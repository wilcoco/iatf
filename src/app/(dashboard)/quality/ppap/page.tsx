"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, CheckSquare, ClipboardCheck, History, Save, Plus, FileImage } from "lucide-react";
import { getVehicleModels, getActiveVehicleModels, getVehicleModelsByCustomer, type VehicleModel } from "@/lib/master-data";
import { getCustomers, type Customer } from "@/lib/master-data";
import { getActiveDrawings, getLatestDrawingByPart, type Drawing } from "@/lib/master-data";

// PPAP 18 Elements based on IATF 16949
// Note: Element 1 (설계기록) includes drawings (도면) as a key component
const ppapElements = [
  { id: 1, name: "설계기록/도면 (Design Records/Drawing)", category: "design", requiresDrawing: true },
  { id: 2, name: "승인된 기술변경문서 (Engineering Change Documents)", category: "design", requiresDrawing: false },
  { id: 3, name: "고객 기술승인 (Customer Engineering Approval)", category: "design", requiresDrawing: false },
  { id: 4, name: "설계 FMEA (Design FMEA)", category: "design", requiresDrawing: false },
  { id: 5, name: "공정흐름도 (Process Flow Diagram)", category: "process", requiresDrawing: false },
  { id: 6, name: "공정 FMEA (Process FMEA)", category: "process", requiresDrawing: false },
  { id: 7, name: "관리계획서 (Control Plan)", category: "process", requiresDrawing: false },
  { id: 8, name: "측정시스템분석 (MSA)", category: "measurement", requiresDrawing: false },
  { id: 9, name: "치수성적서 (Dimensional Results)", category: "measurement", requiresDrawing: true },
  { id: 10, name: "재료/성능시험 (Material/Performance Test)", category: "test", requiresDrawing: false },
  { id: 11, name: "초기공정연구 (Initial Process Study - Ppk)", category: "capability", requiresDrawing: false },
  { id: 12, name: "적격 실험실 문서 (Qualified Laboratory Documentation)", category: "documentation", requiresDrawing: false },
  { id: 13, name: "외관승인보고서 (AAR - Appearance Approval Report)", category: "appearance", requiresDrawing: false },
  { id: 14, name: "표본제품 (Sample Production Parts)", category: "sample", requiresDrawing: false },
  { id: 15, name: "마스터샘플 (Master Sample)", category: "sample", requiresDrawing: false },
  { id: 16, name: "검사보조구 (Checking Aids)", category: "inspection", requiresDrawing: false },
  { id: 17, name: "고객특정요구사항 (Customer Specific Requirements)", category: "customer", requiresDrawing: false },
  { id: 18, name: "부품제출보증서 (PSW - Part Submission Warrant)", category: "psw", requiresDrawing: false },
];

// Submission Level Requirements based on IATF 16949
const levelRequirements: Record<string, number[]> = {
  "1": [18], // PSW only
  "2": [18, 14, 9], // PSW + limited samples + dimensional
  "3": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // All elements
  "4": [18], // PSW + customer-defined
  "5": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], // All available at supplier
};

type ChecklistStatus = "ready" | "not-ready" | "not-applicable";

interface PPAPFormData {
  // Basic Info
  ppapNumber: string;
  submissionDate: string;
  customerCode: string;
  vehicleModelCode: string;
  partNumber: string;
  partName: string;
  submissionReason: "new" | "change" | "reapproval" | "";
  submissionLevel: "1" | "2" | "3" | "4" | "5" | "";
  responsiblePerson: string;
  department: string;

  // PSW Info
  pswPartWeight: string;
  pswMaterial: string;
  pswSupplierCode: string;
  pswPurchaseOrder: string;
  pswDrawingNumber: string;
  pswDrawingDate: string;
  pswEngineeringChange: string;
  pswDeclaration: string;
  pswApprovalResult: "approved" | "conditional" | "rejected" | "";
  pswApprovalDate: string;
  pswApprovalComment: string;
}

interface ChecklistItem {
  elementId: number;
  status: ChecklistStatus;
  remarks: string;
  attachmentName: string;
}

interface HistoryRecord {
  id: string;
  date: string;
  action: string;
  user: string;
  details: string;
}

const initialFormData: PPAPFormData = {
  ppapNumber: "",
  submissionDate: new Date().toISOString().split("T")[0],
  customerCode: "",
  vehicleModelCode: "",
  partNumber: "",
  partName: "",
  submissionReason: "",
  submissionLevel: "",
  responsiblePerson: "",
  department: "",
  pswPartWeight: "",
  pswMaterial: "",
  pswSupplierCode: "",
  pswPurchaseOrder: "",
  pswDrawingNumber: "",
  pswDrawingDate: "",
  pswEngineeringChange: "",
  pswDeclaration: "",
  pswApprovalResult: "",
  pswApprovalDate: "",
  pswApprovalComment: "",
};

const initialChecklist: ChecklistItem[] = ppapElements.map((element) => ({
  elementId: element.id,
  status: "not-ready" as ChecklistStatus,
  remarks: "",
  attachmentName: "",
}));

const sampleHistory: HistoryRecord[] = [
  {
    id: "1",
    date: "2026-06-01",
    action: "PPAP 등록",
    user: "김철수",
    details: "신규 PPAP 문서 등록",
  },
  {
    id: "2",
    date: "2026-06-03",
    action: "체크리스트 업데이트",
    user: "김철수",
    details: "설계기록, 공정흐름도 준비완료",
  },
  {
    id: "3",
    date: "2026-06-05",
    action: "PSW 작성",
    user: "이영희",
    details: "부품제출보증서 작성 완료",
  },
];

export default function PPAPPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<PPAPFormData>(initialFormData);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [history] = useState<HistoryRecord[]>(sampleHistory);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  // Master data
  const customers = getCustomers();
  const vehicleModels = formData.customerCode
    ? getVehicleModelsByCustomer(formData.customerCode)
    : getActiveVehicleModels();
  const activeDrawings = getActiveDrawings();

  const updateField = <K extends keyof PPAPFormData>(
    field: K,
    value: PPAPFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // When part number changes, try to find related drawing
    if (field === "partNumber" && typeof value === "string") {
      const drawing = getLatestDrawingByPart(value);
      setSelectedDrawing(drawing || null);
      // Auto-populate PSW drawing fields if drawing found
      if (drawing) {
        setFormData((prev) => ({
          ...prev,
          pswDrawingNumber: drawing.code,
          pswDrawingDate: drawing.revisionDate,
        }));
      }
    }
  };

  const updateChecklistItem = (
    elementId: number,
    field: keyof ChecklistItem,
    value: string
  ) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.elementId === elementId ? { ...item, [field]: value } : item
      )
    );
  };

  const generatePPAPNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("ppapNumber", `PPAP-${year}${month}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving PPAP data:", { formData, checklist });
    alert("PPAP 데이터가 저장되었습니다.");
  };

  const getStatusBadge = (status: ChecklistStatus) => {
    switch (status) {
      case "ready":
        return <Badge variant="success">준비완료</Badge>;
      case "not-ready":
        return <Badge variant="warning">미준비</Badge>;
      case "not-applicable":
        return <Badge variant="secondary">해당없음</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getApprovalBadge = (result: string) => {
    switch (result) {
      case "approved":
        return <Badge variant="success">승인</Badge>;
      case "conditional":
        return <Badge variant="warning">조건부 승인</Badge>;
      case "rejected":
        return <Badge variant="destructive">반려</Badge>;
      default:
        return <Badge variant="outline">미결정</Badge>;
    }
  };

  const getDrawingStatusBadge = (status: Drawing["status"]) => {
    switch (status) {
      case "최신":
        return <Badge variant="success">최신</Badge>;
      case "구버전":
        return <Badge variant="warning">구버전</Badge>;
      case "폐기":
        return <Badge variant="destructive">폐기</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getRequiredElements = () => {
    if (!formData.submissionLevel) return [];
    return levelRequirements[formData.submissionLevel] || [];
  };

  const isElementRequired = (elementId: number) => {
    return getRequiredElements().includes(elementId);
  };

  const getChecklistStats = () => {
    const required = getRequiredElements();
    const requiredItems = checklist.filter((item) =>
      required.includes(item.elementId)
    );
    const ready = requiredItems.filter((item) => item.status === "ready").length;
    const notApplicable = requiredItems.filter(
      (item) => item.status === "not-applicable"
    ).length;
    const total = requiredItems.length;
    return { ready, notApplicable, total, pending: total - ready - notApplicable };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PPAP 관리</h1>
          <p className="text-muted-foreground">
            Production Part Approval Process (IATF 16949)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            신규 등록
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            기본정보
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            제출요건 체크리스트
          </TabsTrigger>
          <TabsTrigger value="psw" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            PSW
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PPAP 기본정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ppapNumber">PPAP 번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ppapNumber"
                      value={formData.ppapNumber}
                      onChange={(e) => updateField("ppapNumber", e.target.value)}
                      placeholder="PPAP-YYYYMM-XXX"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generatePPAPNumber}
                      className="shrink-0"
                    >
                      자동생성
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submissionDate">제출일</Label>
                  <Input
                    id="submissionDate"
                    type="date"
                    value={formData.submissionDate}
                    onChange={(e) => updateField("submissionDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>제출사유</Label>
                  <Select
                    value={formData.submissionReason}
                    onValueChange={(value) =>
                      updateField(
                        "submissionReason",
                        value as PPAPFormData["submissionReason"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="제출사유 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">신규</SelectItem>
                      <SelectItem value="change">설계변경</SelectItem>
                      <SelectItem value="reapproval">재승인</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>제출 레벨</Label>
                  <Select
                    value={formData.submissionLevel}
                    onValueChange={(value) =>
                      updateField(
                        "submissionLevel",
                        value as PPAPFormData["submissionLevel"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="레벨 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 - PSW만 제출</SelectItem>
                      <SelectItem value="2">Level 2 - PSW + 제한된 샘플</SelectItem>
                      <SelectItem value="3">Level 3 - PSW + 전체 서류</SelectItem>
                      <SelectItem value="4">Level 4 - 고객 정의</SelectItem>
                      <SelectItem value="5">Level 5 - 공급업체 보관</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">고객/품목 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>고객사</Label>
                    <Select
                      value={formData.customerCode}
                      onValueChange={(value) => {
                        updateField("customerCode", value);
                        updateField("vehicleModelCode", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="고객사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.code} value={customer.code}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>차종</Label>
                    <Select
                      value={formData.vehicleModelCode}
                      onValueChange={(value) => updateField("vehicleModelCode", value)}
                    >
                      <SelectTrigger className={!formData.customerCode ? "opacity-50" : ""}>
                        <SelectValue placeholder={formData.customerCode ? "차종 선택" : "고객사를 먼저 선택하세요"} />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleModels.map((model) => (
                          <SelectItem key={model.code} value={model.code}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partNumber">품번</Label>
                    <Input
                      id="partNumber"
                      value={formData.partNumber}
                      onChange={(e) => updateField("partNumber", e.target.value)}
                      placeholder="품번 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partName">품명</Label>
                    <Input
                      id="partName"
                      value={formData.partName}
                      onChange={(e) => updateField("partName", e.target.value)}
                      placeholder="품명 입력"
                    />
                  </div>
                </div>
              </div>

              {/* Drawing Information Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  도면 정보
                </h3>
                {selectedDrawing ? (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-xs">도면번호</Label>
                          <p className="font-medium">{selectedDrawing.code}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">현재 개정번호</Label>
                          <p className="font-medium">Rev. {selectedDrawing.revisionNo}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">개정일</Label>
                          <p className="font-medium">{selectedDrawing.revisionDate}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">승인상태</Label>
                          <div className="flex items-center gap-2">
                            {getDrawingStatusBadge(selectedDrawing.status)}
                            {selectedDrawing.approvalDate && (
                              <span className="text-sm text-muted-foreground">
                                ({selectedDrawing.approvalDate} 승인)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <Label className="text-muted-foreground text-xs">개정내용</Label>
                          <p className="text-sm">{selectedDrawing.revisionContent}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">파일형식</Label>
                          <p className="text-sm">{selectedDrawing.fileType}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-6 text-muted-foreground bg-muted/50 rounded-lg">
                    {formData.partNumber
                      ? "해당 품번에 연결된 도면이 없습니다."
                      : "품번을 입력하면 연관 도면 정보가 표시됩니다."}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">담당자 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsiblePerson">담당자</Label>
                    <Input
                      id="responsiblePerson"
                      value={formData.responsiblePerson}
                      onChange={(e) =>
                        updateField("responsiblePerson", e.target.value)
                      }
                      placeholder="담당자명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">부서</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      placeholder="부서명 입력"
                    />
                  </div>
                </div>
              </div>

              {/* Level Description */}
              {formData.submissionLevel && (
                <div className="border-t pt-4">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Level {formData.submissionLevel} 요구사항
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.submissionLevel === "1" &&
                          "PSW (부품제출보증서)만 고객에게 제출합니다."}
                        {formData.submissionLevel === "2" &&
                          "PSW와 함께 제한된 제품 샘플 및 치수성적서를 제출합니다."}
                        {formData.submissionLevel === "3" &&
                          "PSW와 함께 모든 PPAP 요소의 완전한 서류를 제출합니다."}
                        {formData.submissionLevel === "4" &&
                          "고객이 정의한 특정 요소만 제출합니다."}
                        {formData.submissionLevel === "5" &&
                          "PSW만 제출하고 모든 서류는 공급업체에서 보관합니다."}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">필수 요소 수:</span>{" "}
                        {getRequiredElements().length}개
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Requirements Checklist */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  PPAP 18개 요소 체크리스트
                </span>
                {formData.submissionLevel && (
                  <div className="flex gap-4 text-sm font-normal">
                    <span>
                      준비완료: {getChecklistStats().ready}/
                      {getChecklistStats().total}
                    </span>
                    <span>
                      미준비: {getChecklistStats().pending}개
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!formData.submissionLevel ? (
                <div className="text-center py-8 text-muted-foreground">
                  기본정보 탭에서 제출 레벨을 먼저 선택해주세요.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">No.</TableHead>
                      <TableHead className="w-12">필수</TableHead>
                      <TableHead>PPAP 요소</TableHead>
                      <TableHead className="w-40">도면 참조</TableHead>
                      <TableHead className="w-32">상태</TableHead>
                      <TableHead className="w-48">첨부파일</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ppapElements.map((element) => {
                      const checklistItem = checklist.find(
                        (item) => item.elementId === element.id
                      );
                      const required = isElementRequired(element.id);

                      return (
                        <TableRow
                          key={element.id}
                          className={!required ? "opacity-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {element.id}
                          </TableCell>
                          <TableCell>
                            {required ? (
                              <Badge variant="default">필수</Badge>
                            ) : (
                              <Badge variant="outline">선택</Badge>
                            )}
                          </TableCell>
                          <TableCell>{element.name}</TableCell>
                          <TableCell>
                            {element.requiresDrawing && selectedDrawing ? (
                              <div className="text-xs">
                                <div className="font-medium">{selectedDrawing.code}</div>
                                <div className="text-muted-foreground">
                                  Rev.{selectedDrawing.revisionNo} ({selectedDrawing.revisionDate})
                                </div>
                              </div>
                            ) : element.requiresDrawing ? (
                              <span className="text-xs text-muted-foreground">도면 미선택</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={checklistItem?.status || "not-ready"}
                              onValueChange={(value) =>
                                updateChecklistItem(
                                  element.id,
                                  "status",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ready">준비완료</SelectItem>
                                <SelectItem value="not-ready">미준비</SelectItem>
                                <SelectItem value="not-applicable">
                                  해당없음
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="파일명"
                              value={checklistItem?.attachmentName || ""}
                              onChange={(e) =>
                                updateChecklistItem(
                                  element.id,
                                  "attachmentName",
                                  e.target.value
                                )
                              }
                              className="w-40"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="비고"
                              value={checklistItem?.remarks || ""}
                              onChange={(e) =>
                                updateChecklistItem(
                                  element.id,
                                  "remarks",
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: PSW (Part Submission Warrant) */}
        <TabsContent value="psw">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                부품제출보증서 (Part Submission Warrant)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Part Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">부품 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pswDrawingNumber">도면번호</Label>
                    <Input
                      id="pswDrawingNumber"
                      value={formData.pswDrawingNumber}
                      onChange={(e) =>
                        updateField("pswDrawingNumber", e.target.value)
                      }
                      placeholder="도면번호 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswDrawingDate">도면일자</Label>
                    <Input
                      id="pswDrawingDate"
                      type="date"
                      value={formData.pswDrawingDate}
                      onChange={(e) =>
                        updateField("pswDrawingDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswEngineeringChange">설계변경 레벨</Label>
                    <Input
                      id="pswEngineeringChange"
                      value={formData.pswEngineeringChange}
                      onChange={(e) =>
                        updateField("pswEngineeringChange", e.target.value)
                      }
                      placeholder="E/C Level"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswPartWeight">부품중량 (kg)</Label>
                    <Input
                      id="pswPartWeight"
                      value={formData.pswPartWeight}
                      onChange={(e) =>
                        updateField("pswPartWeight", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswMaterial">재질</Label>
                    <Input
                      id="pswMaterial"
                      value={formData.pswMaterial}
                      onChange={(e) =>
                        updateField("pswMaterial", e.target.value)
                      }
                      placeholder="재질 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswPurchaseOrder">발주번호 (P/O)</Label>
                    <Input
                      id="pswPurchaseOrder"
                      value={formData.pswPurchaseOrder}
                      onChange={(e) =>
                        updateField("pswPurchaseOrder", e.target.value)
                      }
                      placeholder="P/O Number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswSupplierCode">공급업체 코드</Label>
                    <Input
                      id="pswSupplierCode"
                      value={formData.pswSupplierCode}
                      onChange={(e) =>
                        updateField("pswSupplierCode", e.target.value)
                      }
                      placeholder="Supplier Code"
                    />
                  </div>
                </div>
              </div>

              {/* Supplier Declaration */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">공급업체 선언</h3>
                <div className="space-y-4">
                  <Textarea
                    id="pswDeclaration"
                    value={formData.pswDeclaration}
                    onChange={(e) =>
                      updateField("pswDeclaration", e.target.value)
                    }
                    placeholder="본 제품이 모든 도면, 규격서 및 기타 적용 가능한 요구사항에 적합함을 확인합니다..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    공급업체는 위 부품이 고객의 모든 도면 및 규격 요구사항에 적합함을 보증합니다.
                  </p>
                </div>
              </div>

              {/* Customer Approval */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">고객 승인</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>승인 결과</Label>
                    <Select
                      value={formData.pswApprovalResult}
                      onValueChange={(value) =>
                        updateField(
                          "pswApprovalResult",
                          value as PPAPFormData["pswApprovalResult"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="승인결과 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">승인</SelectItem>
                        <SelectItem value="conditional">조건부 승인</SelectItem>
                        <SelectItem value="rejected">반려</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pswApprovalDate">승인일자</Label>
                    <Input
                      id="pswApprovalDate"
                      type="date"
                      value={formData.pswApprovalDate}
                      onChange={(e) =>
                        updateField("pswApprovalDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>현재 상태</Label>
                    <div className="pt-2">
                      {getApprovalBadge(formData.pswApprovalResult)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="pswApprovalComment">승인 코멘트</Label>
                  <Textarea
                    id="pswApprovalComment"
                    value={formData.pswApprovalComment}
                    onChange={(e) =>
                      updateField("pswApprovalComment", e.target.value)
                    }
                    placeholder="고객 승인 코멘트 입력"
                    rows={3}
                  />
                </div>
              </div>

              {/* Summary Card */}
              {formData.pswApprovalResult && (
                <div className="border-t pt-6">
                  <Card
                    className={`${
                      formData.pswApprovalResult === "approved"
                        ? "bg-green-50 border-green-200"
                        : formData.pswApprovalResult === "conditional"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        PSW 승인 상태
                        {getApprovalBadge(formData.pswApprovalResult)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">품번:</span>{" "}
                          {formData.partNumber || "-"}
                        </p>
                        <p>
                          <span className="font-medium">품명:</span>{" "}
                          {formData.partName || "-"}
                        </p>
                        <p>
                          <span className="font-medium">승인일:</span>{" "}
                          {formData.pswApprovalDate || "-"}
                        </p>
                        {formData.pswApprovalComment && (
                          <p className="pt-2 border-t">
                            <span className="font-medium">코멘트:</span>{" "}
                            {formData.pswApprovalComment}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                PPAP 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">일자</TableHead>
                    <TableHead className="w-40">작업</TableHead>
                    <TableHead className="w-32">담당자</TableHead>
                    <TableHead>상세내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.action}</Badge>
                      </TableCell>
                      <TableCell>{record.user}</TableCell>
                      <TableCell>{record.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {history.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  이력이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
