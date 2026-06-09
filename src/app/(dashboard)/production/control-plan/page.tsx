"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Save, Trash2, AlertTriangle, Shield, ClipboardList, History } from "lucide-react";

// Header info state type (IATF 16949 Control Plan Header)
interface HeaderInfo {
  // Document Info
  documentNo: string;
  revisionNo: string;
  revisionDate: string;
  createdDate: string;
  approver: string;
  preparedBy: string;
  // Part Info
  partName: string;
  partNo: string;
  customerPartNo: string;
  // Process Info
  processName: string;
  plantLocation: string;
  supplierCode: string;
  customerName: string;
  vehicleModel: string;
  controlPlanPhase: "Prototype" | "Pre-launch" | "Production";
}

// Control item type (IATF 16949 Standard Columns)
interface ControlItem {
  id: number;
  // 공정번호/공정명
  processNo: string;
  processName: string;
  // 기계/장치/치공구
  machine: string;
  device: string;
  jig: string;
  // 특성
  characteristicNo: string;
  productCharacteristic: string;
  processCharacteristic: string;
  // 특별특성분류
  specialCharacteristicClass: "" | "CC" | "SC" | "S";
  // 제품/공정 규격/공차
  specTolerance: string;
  // 평가/측정기술
  evaluationMeasurementTechnique: string;
  // 샘플
  sampleSize: string;
  sampleFrequency: string;
  // 관리방법
  controlMethod: string;
  // 대응계획
  reactionPlan: string;
  // 비고
  remarks: string;
}

// Revision history item type
interface RevisionHistoryItem {
  id: number;
  revisionNo: string;
  revisionDate: string;
  changeDescription: string;
  changedBy: string;
  approvedBy: string;
}

export default function ControlPlanPage() {
  const [activeTab, setActiveTab] = useState("basic-info");

  // Header info state
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    documentNo: "",
    revisionNo: "",
    revisionDate: "",
    createdDate: "",
    approver: "",
    preparedBy: "",
    partName: "",
    partNo: "",
    customerPartNo: "",
    processName: "",
    plantLocation: "",
    supplierCode: "",
    customerName: "",
    vehicleModel: "",
    controlPlanPhase: "Production",
  });

  // Control items state (IATF 16949 columns)
  const [controlItems, setControlItems] = useState<ControlItem[]>([
    {
      id: 1,
      processNo: "",
      processName: "",
      machine: "",
      device: "",
      jig: "",
      characteristicNo: "",
      productCharacteristic: "",
      processCharacteristic: "",
      specialCharacteristicClass: "",
      specTolerance: "",
      evaluationMeasurementTechnique: "",
      sampleSize: "",
      sampleFrequency: "",
      controlMethod: "",
      reactionPlan: "",
      remarks: "",
    },
  ]);

  // Revision history state
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>([]);
  const [newRevision, setNewRevision] = useState<Omit<RevisionHistoryItem, "id">>({
    revisionNo: "",
    revisionDate: "",
    changeDescription: "",
    changedBy: "",
    approvedBy: "",
  });

  // Computed: Special characteristics summary (CC/SC items)
  const specialCharacteristics = useMemo(() => {
    return controlItems.filter(
      (item) => item.specialCharacteristicClass === "CC" || item.specialCharacteristicClass === "SC" || item.specialCharacteristicClass === "S"
    );
  }, [controlItems]);

  const ccItems = useMemo(() => {
    return controlItems.filter((item) => item.specialCharacteristicClass === "CC");
  }, [controlItems]);

  const scItems = useMemo(() => {
    return controlItems.filter((item) => item.specialCharacteristicClass === "SC");
  }, [controlItems]);

  const sItems = useMemo(() => {
    return controlItems.filter((item) => item.specialCharacteristicClass === "S");
  }, [controlItems]);

  // Control items handlers
  const addControlItem = () => {
    setControlItems([
      ...controlItems,
      {
        id: Date.now(),
        processNo: "",
        processName: "",
        machine: "",
        device: "",
        jig: "",
        characteristicNo: "",
        productCharacteristic: "",
        processCharacteristic: "",
        specialCharacteristicClass: "",
        specTolerance: "",
        evaluationMeasurementTechnique: "",
        sampleSize: "",
        sampleFrequency: "",
        controlMethod: "",
        reactionPlan: "",
        remarks: "",
      },
    ]);
  };

  const removeControlItem = (id: number) => {
    if (controlItems.length <= 1) return;
    setControlItems(controlItems.filter((item) => item.id !== id));
  };

  const updateControlItem = (id: number, field: keyof ControlItem, value: string) => {
    setControlItems(
      controlItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Revision history handlers
  const addRevisionHistory = () => {
    if (!newRevision.revisionNo || !newRevision.revisionDate) {
      alert("개정번호와 개정일을 입력해주세요.");
      return;
    }
    setRevisionHistory([
      { id: Date.now(), ...newRevision },
      ...revisionHistory,
    ]);
    setNewRevision({
      revisionNo: "",
      revisionDate: "",
      changeDescription: "",
      changedBy: "",
      approvedBy: "",
    });
  };

  const removeRevisionHistory = (id: number) => {
    setRevisionHistory(revisionHistory.filter((item) => item.id !== id));
  };

  // Save all data
  const handleSaveAll = () => {
    if (!headerInfo.documentNo || !headerInfo.partName || !headerInfo.partNo) {
      alert("문서번호, 부품명, 품번은 필수 입력 항목입니다.");
      setActiveTab("basic-info");
      return;
    }
    console.log("Saving control plan:", {
      headerInfo,
      controlItems,
      revisionHistory,
    });
    alert("관리계획서가 저장되었습니다.");
  };

  const getSpecialCharBadge = (charClass: string) => {
    switch (charClass) {
      case "CC":
        return <Badge variant="destructive">CC (Critical)</Badge>;
      case "SC":
        return <Badge variant="warning">SC (Significant)</Badge>;
      case "S":
        return <Badge variant="secondary">S (Standard)</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "Prototype":
        return "시작품 (Prototype)";
      case "Pre-launch":
        return "양산 시험 (Pre-launch)";
      case "Production":
        return "양산 (Production)";
      default:
        return phase;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리 계획서 (Control Plan)</h1>
          <p className="text-muted-foreground">IATF 16949 표준 양식 - 제품 및 공정 관리계획 문서</p>
        </div>
        <Button onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" />
          전체 저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">
            <FileText className="mr-2 h-4 w-4" />
            관리계획서 기본정보
          </TabsTrigger>
          <TabsTrigger value="control-items">
            <ClipboardList className="mr-2 h-4 w-4" />
            관리항목 입력
          </TabsTrigger>
          <TabsTrigger value="special-characteristics">
            <AlertTriangle className="mr-2 h-4 w-4" />
            특별특성 현황
          </TabsTrigger>
          <TabsTrigger value="revision-history">
            <History className="mr-2 h-4 w-4" />
            개정 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 관리계획서 기본정보 (Header) */}
        <TabsContent value="basic-info">
          <div className="space-y-6">
            {/* Document Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  문서 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentNo">문서번호 *</Label>
                    <Input
                      id="documentNo"
                      value={headerInfo.documentNo}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, documentNo: e.target.value })
                      }
                      placeholder="CP-2026-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revisionNo">개정번호</Label>
                    <Input
                      id="revisionNo"
                      value={headerInfo.revisionNo}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, revisionNo: e.target.value })
                      }
                      placeholder="Rev.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdDate">작성일</Label>
                    <Input
                      id="createdDate"
                      type="date"
                      value={headerInfo.createdDate}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, createdDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revisionDate">개정일</Label>
                    <Input
                      id="revisionDate"
                      type="date"
                      value={headerInfo.revisionDate}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, revisionDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="preparedBy">작성자</Label>
                    <Input
                      id="preparedBy"
                      value={headerInfo.preparedBy}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, preparedBy: e.target.value })
                      }
                      placeholder="작성자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approver">승인자</Label>
                    <Input
                      id="approver"
                      value={headerInfo.approver}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, approver: e.target.value })
                      }
                      placeholder="승인자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="controlPlanPhase">관리계획서 단계</Label>
                    <Select
                      value={headerInfo.controlPlanPhase}
                      onValueChange={(v) =>
                        setHeaderInfo({ ...headerInfo, controlPlanPhase: v as HeaderInfo["controlPlanPhase"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prototype">시작품 (Prototype)</SelectItem>
                        <SelectItem value="Pre-launch">양산 시험 (Pre-launch)</SelectItem>
                        <SelectItem value="Production">양산 (Production)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  부품 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="partName">부품명 *</Label>
                    <Input
                      id="partName"
                      value={headerInfo.partName}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, partName: e.target.value })
                      }
                      placeholder="NQ5 PE FRT"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partNo">품번 *</Label>
                    <Input
                      id="partNo"
                      value={headerInfo.partNo}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, partNo: e.target.value })
                      }
                      placeholder="MBD0023D784"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPartNo">고객 품번</Label>
                    <Input
                      id="customerPartNo"
                      value={headerInfo.customerPartNo}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, customerPartNo: e.target.value })
                      }
                      placeholder="고객사 품번"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  공정 및 고객 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="processName">공정명</Label>
                    <Input
                      id="processName"
                      value={headerInfo.processName}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, processName: e.target.value })
                      }
                      placeholder="공정명을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plantLocation">공장/라인</Label>
                    <Input
                      id="plantLocation"
                      value={headerInfo.plantLocation}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, plantLocation: e.target.value })
                      }
                      placeholder="공장 위치 / 라인명"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">고객사</Label>
                    <Input
                      id="customerName"
                      value={headerInfo.customerName}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, customerName: e.target.value })
                      }
                      placeholder="고객사명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">차종/모델</Label>
                    <Input
                      id="vehicleModel"
                      value={headerInfo.vehicleModel}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, vehicleModel: e.target.value })
                      }
                      placeholder="NQ5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierCode">공급업체코드</Label>
                    <Input
                      id="supplierCode"
                      value={headerInfo.supplierCode}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, supplierCode: e.target.value })
                      }
                      placeholder="공급업체 코드"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Info */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">관리계획서 단계</p>
                    <p className="font-medium">{getPhaseLabel(headerInfo.controlPlanPhase)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">전체 관리항목</p>
                    <p className="font-medium">{controlItems.length} 건</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">특별특성 항목</p>
                    <p className="font-medium">{specialCharacteristics.length} 건</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">개정 이력</p>
                    <p className="font-medium">{revisionHistory.length} 건</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 관리항목 입력 (Control Items Table with IATF Columns) */}
        <TabsContent value="control-items">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  관리항목 입력 (IATF 16949)
                </span>
                <Button onClick={addControlItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[60px] text-center" rowSpan={2}>No.</TableHead>
                      <TableHead className="min-w-[180px] text-center" colSpan={2}>공정번호/공정명</TableHead>
                      <TableHead className="min-w-[250px] text-center" colSpan={3}>기계/장치/치공구</TableHead>
                      <TableHead className="min-w-[250px] text-center" colSpan={3}>특성</TableHead>
                      <TableHead className="min-w-[100px] text-center" rowSpan={2}>특별특성분류</TableHead>
                      <TableHead className="min-w-[120px] text-center" rowSpan={2}>제품/공정 규격/공차</TableHead>
                      <TableHead className="min-w-[120px] text-center" rowSpan={2}>평가/측정기술</TableHead>
                      <TableHead className="min-w-[140px] text-center" colSpan={2}>샘플</TableHead>
                      <TableHead className="min-w-[120px] text-center" rowSpan={2}>관리방법</TableHead>
                      <TableHead className="min-w-[120px] text-center" rowSpan={2}>대응계획</TableHead>
                      <TableHead className="min-w-[100px] text-center" rowSpan={2}>비고</TableHead>
                      <TableHead className="w-[60px] text-center" rowSpan={2}>삭제</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="min-w-[80px] text-center">공정번호</TableHead>
                      <TableHead className="min-w-[100px] text-center">공정명</TableHead>
                      <TableHead className="min-w-[80px] text-center">기계</TableHead>
                      <TableHead className="min-w-[80px] text-center">장치</TableHead>
                      <TableHead className="min-w-[80px] text-center">치공구</TableHead>
                      <TableHead className="min-w-[60px] text-center">No</TableHead>
                      <TableHead className="min-w-[100px] text-center">제품</TableHead>
                      <TableHead className="min-w-[100px] text-center">공정</TableHead>
                      <TableHead className="min-w-[70px] text-center">크기</TableHead>
                      <TableHead className="min-w-[70px] text-center">빈도</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {controlItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={item.processNo}
                            onChange={(e) => updateControlItem(item.id, "processNo", e.target.value)}
                            placeholder="10"
                            className="min-w-[70px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.processName}
                            onChange={(e) => updateControlItem(item.id, "processName", e.target.value)}
                            placeholder="수입검사"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.machine}
                            onChange={(e) => updateControlItem(item.id, "machine", e.target.value)}
                            placeholder="기계명"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.device}
                            onChange={(e) => updateControlItem(item.id, "device", e.target.value)}
                            placeholder="장치명"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.jig}
                            onChange={(e) => updateControlItem(item.id, "jig", e.target.value)}
                            placeholder="치공구"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.characteristicNo}
                            onChange={(e) => updateControlItem(item.id, "characteristicNo", e.target.value)}
                            placeholder="1"
                            className="min-w-[50px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.productCharacteristic}
                            onChange={(e) => updateControlItem(item.id, "productCharacteristic", e.target.value)}
                            placeholder="외관"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.processCharacteristic}
                            onChange={(e) => updateControlItem(item.id, "processCharacteristic", e.target.value)}
                            placeholder="온도"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.specialCharacteristicClass}
                            onValueChange={(v) => updateControlItem(item.id, "specialCharacteristicClass", v)}
                          >
                            <SelectTrigger className="min-w-[90px]">
                              <SelectValue placeholder="-" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-</SelectItem>
                              <SelectItem value="CC">
                                <Badge variant="destructive">CC</Badge>
                              </SelectItem>
                              <SelectItem value="SC">
                                <Badge variant="warning">SC</Badge>
                              </SelectItem>
                              <SelectItem value="S">
                                <Badge variant="secondary">S</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={item.specTolerance}
                            onChange={(e) => updateControlItem(item.id, "specTolerance", e.target.value)}
                            placeholder="규격/공차"
                            rows={2}
                            className="min-w-[100px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.evaluationMeasurementTechnique}
                            onChange={(e) => updateControlItem(item.id, "evaluationMeasurementTechnique", e.target.value)}
                            placeholder="육안검사"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.sampleSize}
                            onChange={(e) => updateControlItem(item.id, "sampleSize", e.target.value)}
                            placeholder="5pcs"
                            className="min-w-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.sampleFrequency}
                            onChange={(e) => updateControlItem(item.id, "sampleFrequency", e.target.value)}
                            placeholder="매 로트"
                            className="min-w-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.controlMethod}
                            onChange={(e) => updateControlItem(item.id, "controlMethod", e.target.value)}
                            placeholder="X-bar R"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={item.reactionPlan}
                            onChange={(e) => updateControlItem(item.id, "reactionPlan", e.target.value)}
                            placeholder="관리계획서 대응"
                            rows={2}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.remarks}
                            onChange={(e) => updateControlItem(item.id, "remarks", e.target.value)}
                            placeholder="비고"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeControlItem(item.id)}
                            disabled={controlItems.length <= 1}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Badge variant="destructive">CC</Badge> Critical Characteristic (안전/법규)
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="warning">SC</Badge> Significant Characteristic (기능/성능)
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="secondary">S</Badge> Standard Characteristic (일반)
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 특별특성 현황 (Special Characteristics Summary) */}
        <TabsContent value="special-characteristics">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">전체 특별특성</p>
                      <p className="text-2xl font-bold">{specialCharacteristics.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-destructive">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CC (Critical)</p>
                      <p className="text-2xl font-bold text-destructive">{ccItems.length}</p>
                    </div>
                    <Badge variant="destructive">CC</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">SC (Significant)</p>
                      <p className="text-2xl font-bold text-yellow-600">{scItems.length}</p>
                    </div>
                    <Badge variant="warning">SC</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-gray-400">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">S (Standard)</p>
                      <p className="text-2xl font-bold text-gray-600">{sItems.length}</p>
                    </div>
                    <Badge variant="secondary">S</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CC Items Table */}
            {ccItems.length > 0 && (
              <Card className="border-l-4 border-l-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="destructive">CC</Badge>
                    Critical Characteristic - 안전/법규 관련 특성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>공정번호</TableHead>
                        <TableHead>공정명</TableHead>
                        <TableHead>특성 No</TableHead>
                        <TableHead>제품 특성</TableHead>
                        <TableHead>공정 특성</TableHead>
                        <TableHead>규격/공차</TableHead>
                        <TableHead>관리방법</TableHead>
                        <TableHead>대응계획</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ccItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.processNo}</TableCell>
                          <TableCell>{item.processName}</TableCell>
                          <TableCell>{item.characteristicNo}</TableCell>
                          <TableCell>{item.productCharacteristic}</TableCell>
                          <TableCell>{item.processCharacteristic}</TableCell>
                          <TableCell>{item.specTolerance}</TableCell>
                          <TableCell>{item.controlMethod}</TableCell>
                          <TableCell>{item.reactionPlan}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* SC Items Table */}
            {scItems.length > 0 && (
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="warning">SC</Badge>
                    Significant Characteristic - 기능/성능 관련 특성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>공정번호</TableHead>
                        <TableHead>공정명</TableHead>
                        <TableHead>특성 No</TableHead>
                        <TableHead>제품 특성</TableHead>
                        <TableHead>공정 특성</TableHead>
                        <TableHead>규격/공차</TableHead>
                        <TableHead>관리방법</TableHead>
                        <TableHead>대응계획</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.processNo}</TableCell>
                          <TableCell>{item.processName}</TableCell>
                          <TableCell>{item.characteristicNo}</TableCell>
                          <TableCell>{item.productCharacteristic}</TableCell>
                          <TableCell>{item.processCharacteristic}</TableCell>
                          <TableCell>{item.specTolerance}</TableCell>
                          <TableCell>{item.controlMethod}</TableCell>
                          <TableCell>{item.reactionPlan}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* S Items Table */}
            {sItems.length > 0 && (
              <Card className="border-l-4 border-l-gray-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">S</Badge>
                    Standard Characteristic - 일반 특성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>공정번호</TableHead>
                        <TableHead>공정명</TableHead>
                        <TableHead>특성 No</TableHead>
                        <TableHead>제품 특성</TableHead>
                        <TableHead>공정 특성</TableHead>
                        <TableHead>규격/공차</TableHead>
                        <TableHead>관리방법</TableHead>
                        <TableHead>대응계획</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.processNo}</TableCell>
                          <TableCell>{item.processName}</TableCell>
                          <TableCell>{item.characteristicNo}</TableCell>
                          <TableCell>{item.productCharacteristic}</TableCell>
                          <TableCell>{item.processCharacteristic}</TableCell>
                          <TableCell>{item.specTolerance}</TableCell>
                          <TableCell>{item.controlMethod}</TableCell>
                          <TableCell>{item.reactionPlan}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {specialCharacteristics.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    등록된 특별특성이 없습니다.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    관리항목 입력 탭에서 특별특성분류(CC/SC/S)를 지정해주세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: 개정 이력 (Revision History) */}
        <TabsContent value="revision-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                개정 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new revision form */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid gap-4 md:grid-cols-6">
                    <div className="space-y-2">
                      <Label>개정번호 *</Label>
                      <Input
                        value={newRevision.revisionNo}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, revisionNo: e.target.value })
                        }
                        placeholder="Rev.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>개정일 *</Label>
                      <Input
                        type="date"
                        value={newRevision.revisionDate}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, revisionDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>변경내용</Label>
                      <Input
                        value={newRevision.changeDescription}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, changeDescription: e.target.value })
                        }
                        placeholder="변경 사유 및 내용"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>변경자</Label>
                      <Input
                        value={newRevision.changedBy}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, changedBy: e.target.value })
                        }
                        placeholder="작성자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>승인자</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRevision.approvedBy}
                          onChange={(e) =>
                            setNewRevision({ ...newRevision, approvedBy: e.target.value })
                          }
                          placeholder="승인자명"
                        />
                        <Button onClick={addRevisionHistory}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revision history table */}
              {revisionHistory.length === 0 ? (
                <div className="py-12 text-center">
                  <History className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    등록된 개정이력이 없습니다.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">개정번호</TableHead>
                      <TableHead className="w-[120px]">개정일</TableHead>
                      <TableHead>변경내용</TableHead>
                      <TableHead className="w-[100px]">변경자</TableHead>
                      <TableHead className="w-[100px]">승인자</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revisionHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.revisionNo}</TableCell>
                        <TableCell>{item.revisionDate}</TableCell>
                        <TableCell>{item.changeDescription}</TableCell>
                        <TableCell>{item.changedBy}</TableCell>
                        <TableCell>{item.approvedBy}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeRevisionHistory(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
