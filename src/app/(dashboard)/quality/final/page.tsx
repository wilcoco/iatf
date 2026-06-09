"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  History,
  Package,
  Settings,
  Truck,
  BarChart3,
} from "lucide-react";

// Types
interface InspectionCheckItem {
  id: number;
  category: "외관" | "치수" | "기능" | "포장";
  itemName: string;
  result: "합격" | "불합격" | "";
  remarks: string;
}

interface FinalInspectionRecord {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  partNo: string;
  partName: string;
  lotNo: string;
  productionQty: number;
  inspectedQty: number;
  checkItems: InspectionCheckItem[];
  overallResult: "합격" | "불합격" | "재검사" | "";
  inspector: string;
  approver: string;
  approvalDate: string;
  remarks: string;
  shipmentApproved: boolean;
  shipmentApprovedDate?: string;
  shipmentApprovedBy?: string;
}

interface InspectionItemSetup {
  id: number;
  partNo: string;
  partName: string;
  category: "외관" | "치수" | "기능" | "포장";
  itemName: string;
  spec: string;
  tolerance: string;
  measureMethod: string;
  measureEquipment: string;
}

// Generate inspection number
function generateInspectionNo(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `FIN-${date}-${seq}`;
}

export default function FinalInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Tab 1: Final inspection registration state
  const [formData, setFormData] = useState({
    inspectionNo: generateInspectionNo(),
    inspectionDate: new Date().toISOString().split("T")[0],
    partNo: "",
    partName: "",
    lotNo: "",
    productionQty: "",
    inspectedQty: "",
    inspector: "",
    approver: "",
    remarks: "",
  });

  const [checkItems, setCheckItems] = useState<InspectionCheckItem[]>([
    { id: 1, category: "외관", itemName: "외관 육안 검사", result: "", remarks: "" },
    { id: 2, category: "치수", itemName: "주요 치수 검사", result: "", remarks: "" },
    { id: 3, category: "기능", itemName: "기능 테스트", result: "", remarks: "" },
    { id: 4, category: "포장", itemName: "포장 상태 확인", result: "", remarks: "" },
  ]);

  const [overallResult, setOverallResult] = useState<"합격" | "불합격" | "재검사" | "">("");
  const [inspectionHistory, setInspectionHistory] = useState<FinalInspectionRecord[]>([]);

  // Tab 2: Inspection items setup state
  const [itemSetups, setItemSetups] = useState<InspectionItemSetup[]>([]);
  const [setupFormData, setSetupFormData] = useState({
    partNo: "",
    partName: "",
    category: "외관" as "외관" | "치수" | "기능" | "포장",
    itemName: "",
    spec: "",
    tolerance: "",
    measureMethod: "",
    measureEquipment: "",
  });

  // Tab 3: Shipment approval state
  const [shipmentSearch, setShipmentSearch] = useState("");

  // Tab 4: History search state
  const [historySearch, setHistorySearch] = useState("");
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");

  // ============ Tab 1: Final Inspection Registration Handlers ============

  const updateCheckItem = (id: number, field: keyof InspectionCheckItem, value: string) => {
    setCheckItems(
      checkItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addCheckItem = () => {
    const newId = Math.max(0, ...checkItems.map((item) => item.id)) + 1;
    setCheckItems([
      ...checkItems,
      { id: newId, category: "외관", itemName: "", result: "", remarks: "" },
    ]);
  };

  const removeCheckItem = (id: number) => {
    if (checkItems.length > 1) {
      setCheckItems(checkItems.filter((item) => item.id !== id));
    }
  };

  const handleSaveInspection = () => {
    if (!formData.partNo || !formData.partName || !formData.lotNo || !formData.inspector) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!overallResult) {
      alert("종합판정을 선택해주세요.");
      return;
    }

    const newRecord: FinalInspectionRecord = {
      id: Date.now(),
      inspectionNo: formData.inspectionNo,
      inspectionDate: formData.inspectionDate,
      partNo: formData.partNo,
      partName: formData.partName,
      lotNo: formData.lotNo,
      productionQty: Number(formData.productionQty) || 0,
      inspectedQty: Number(formData.inspectedQty) || 0,
      checkItems: [...checkItems],
      overallResult,
      inspector: formData.inspector,
      approver: formData.approver,
      approvalDate: new Date().toISOString().split("T")[0],
      remarks: formData.remarks,
      shipmentApproved: false,
    };

    setInspectionHistory([newRecord, ...inspectionHistory]);

    // Reset form
    setFormData({
      inspectionNo: generateInspectionNo(),
      inspectionDate: new Date().toISOString().split("T")[0],
      partNo: "",
      partName: "",
      lotNo: "",
      productionQty: "",
      inspectedQty: "",
      inspector: "",
      approver: "",
      remarks: "",
    });
    setCheckItems([
      { id: 1, category: "외관", itemName: "외관 육안 검사", result: "", remarks: "" },
      { id: 2, category: "치수", itemName: "주요 치수 검사", result: "", remarks: "" },
      { id: 3, category: "기능", itemName: "기능 테스트", result: "", remarks: "" },
      { id: 4, category: "포장", itemName: "포장 상태 확인", result: "", remarks: "" },
    ]);
    setOverallResult("");

    alert("최종검사 기록이 저장되었습니다.");
  };

  // ============ Tab 2: Inspection Items Setup Handlers ============

  const handleSaveItemSetup = () => {
    if (!setupFormData.partNo || !setupFormData.itemName) {
      alert("품번과 검사항목명은 필수입니다.");
      return;
    }

    const newSetup: InspectionItemSetup = {
      id: Date.now(),
      ...setupFormData,
    };

    setItemSetups([...itemSetups, newSetup]);
    setSetupFormData({
      partNo: "",
      partName: "",
      category: "외관",
      itemName: "",
      spec: "",
      tolerance: "",
      measureMethod: "",
      measureEquipment: "",
    });

    alert("검사항목이 등록되었습니다.");
  };

  const removeItemSetup = (id: number) => {
    setItemSetups(itemSetups.filter((item) => item.id !== id));
  };

  // ============ Tab 3: Shipment Approval Handlers ============

  const pendingShipments = inspectionHistory.filter(
    (record) =>
      record.overallResult === "합격" &&
      !record.shipmentApproved &&
      (record.partNo.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
        record.partName.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
        record.lotNo.toLowerCase().includes(shipmentSearch.toLowerCase()))
  );

  const approveShipment = (id: number) => {
    setInspectionHistory(
      inspectionHistory.map((record) =>
        record.id === id
          ? {
              ...record,
              shipmentApproved: true,
              shipmentApprovedDate: new Date().toISOString().split("T")[0],
              shipmentApprovedBy: "현재 사용자",
            }
          : record
      )
    );
    alert("출하 승인되었습니다.");
  };

  // ============ Tab 4: History Handlers ============

  const filteredHistory = inspectionHistory.filter((record) => {
    const matchesSearch =
      record.inspectionNo.toLowerCase().includes(historySearch.toLowerCase()) ||
      record.partNo.toLowerCase().includes(historySearch.toLowerCase()) ||
      record.partName.toLowerCase().includes(historySearch.toLowerCase()) ||
      record.lotNo.toLowerCase().includes(historySearch.toLowerCase());

    const matchesDateFrom = !historyDateFrom || record.inspectionDate >= historyDateFrom;
    const matchesDateTo = !historyDateTo || record.inspectionDate <= historyDateTo;

    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  // Statistics calculation
  const totalInspections = filteredHistory.length;
  const passedInspections = filteredHistory.filter((r) => r.overallResult === "합격").length;
  const failedInspections = filteredHistory.filter((r) => r.overallResult === "불합격").length;
  const reInspections = filteredHistory.filter((r) => r.overallResult === "재검사").length;
  const passRate = totalInspections > 0 ? ((passedInspections / totalInspections) * 100).toFixed(1) : "0.0";

  // Badge helper
  const getResultBadge = (result: string) => {
    switch (result) {
      case "합격":
        return <Badge variant="success">{result}</Badge>;
      case "불합격":
        return <Badge variant="destructive">{result}</Badge>;
      case "재검사":
        return <Badge variant="warning">{result}</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "외관": "bg-blue-100 text-blue-800",
      "치수": "bg-green-100 text-green-800",
      "기능": "bg-purple-100 text-purple-800",
      "포장": "bg-orange-100 text-orange-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category] || "bg-gray-100 text-gray-800"}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">최종검사</h1>
          <p className="text-muted-foreground">IATF 16949 최종검사 관리 (Final Inspection)</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registration" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                최종검사 등록
              </TabsTrigger>
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                검사항목 설정
              </TabsTrigger>
              <TabsTrigger value="shipment" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                출하 승인
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                검사 이력
              </TabsTrigger>
            </TabsList>

            {/* ============ Tab 1: 최종검사 등록 ============ */}
            <TabsContent value="registration">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    최종검사 등록
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>검사일 *</Label>
                        <Input
                          type="date"
                          value={formData.inspectionDate}
                          onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사번호</Label>
                        <Input value={formData.inspectionNo} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={formData.partNo}
                          onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                          placeholder="품번"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품명 *</Label>
                        <Input
                          value={formData.partName}
                          onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                          placeholder="품명"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Lot번호 *</Label>
                        <Input
                          value={formData.lotNo}
                          onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                          placeholder="LOT번호"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>생산수량</Label>
                        <Input
                          type="number"
                          value={formData.productionQty}
                          onChange={(e) => setFormData({ ...formData, productionQty: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사수량</Label>
                        <Input
                          type="number"
                          value={formData.inspectedQty}
                          onChange={(e) => setFormData({ ...formData, inspectedQty: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사자 *</Label>
                        <Input
                          value={formData.inspector}
                          onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                          placeholder="검사자명"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 검사항목 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-semibold">검사항목 (외관, 치수, 기능, 포장)</h3>
                      <Button size="sm" onClick={addCheckItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        항목 추가
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">No.</TableHead>
                          <TableHead className="w-28">구분</TableHead>
                          <TableHead>검사항목</TableHead>
                          <TableHead className="w-32">판정</TableHead>
                          <TableHead>비고</TableHead>
                          <TableHead className="w-16">삭제</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checkItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <Select
                                value={item.category}
                                onValueChange={(value) =>
                                  updateCheckItem(item.id, "category", value as "외관" | "치수" | "기능" | "포장")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="외관">외관</SelectItem>
                                  <SelectItem value="치수">치수</SelectItem>
                                  <SelectItem value="기능">기능</SelectItem>
                                  <SelectItem value="포장">포장</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.itemName}
                                onChange={(e) => updateCheckItem(item.id, "itemName", e.target.value)}
                                placeholder="검사항목명"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.result}
                                onValueChange={(value) =>
                                  updateCheckItem(item.id, "result", value as "합격" | "불합격")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="합격">합격</SelectItem>
                                  <SelectItem value="불합격">불합격</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.remarks}
                                onChange={(e) => updateCheckItem(item.id, "remarks", e.target.value)}
                                placeholder="비고"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCheckItem(item.id)}
                                disabled={checkItems.length <= 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 종합판정 및 승인 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">종합판정 및 승인</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>종합판정 *</Label>
                        <Select
                          value={overallResult}
                          onValueChange={(value) => setOverallResult(value as "합격" | "불합격" | "재검사")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="판정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="합격">합격</SelectItem>
                            <SelectItem value="불합격">불합격</SelectItem>
                            <SelectItem value="재검사">재검사</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>승인자</Label>
                        <Input
                          value={formData.approver}
                          onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                          placeholder="승인자명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={formData.remarks}
                          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                          placeholder="특이사항"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => {
                      setFormData({
                        inspectionNo: generateInspectionNo(),
                        inspectionDate: new Date().toISOString().split("T")[0],
                        partNo: "",
                        partName: "",
                        lotNo: "",
                        productionQty: "",
                        inspectedQty: "",
                        inspector: "",
                        approver: "",
                        remarks: "",
                      });
                      setOverallResult("");
                    }}>
                      초기화
                    </Button>
                    <Button onClick={handleSaveInspection}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ Tab 2: 검사항목 설정 ============ */}
            <TabsContent value="setup">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    검사항목 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 신규 등록 폼 */}
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold">품목별 검사항목 등록</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={setupFormData.partNo}
                          onChange={(e) => setSetupFormData({ ...setupFormData, partNo: e.target.value })}
                          placeholder="품번"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품명</Label>
                        <Input
                          value={setupFormData.partName}
                          onChange={(e) => setSetupFormData({ ...setupFormData, partName: e.target.value })}
                          placeholder="품명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>구분</Label>
                        <Select
                          value={setupFormData.category}
                          onValueChange={(value) =>
                            setSetupFormData({ ...setupFormData, category: value as "외관" | "치수" | "기능" | "포장" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="외관">외관</SelectItem>
                            <SelectItem value="치수">치수</SelectItem>
                            <SelectItem value="기능">기능</SelectItem>
                            <SelectItem value="포장">포장</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>검사항목명 *</Label>
                        <Input
                          value={setupFormData.itemName}
                          onChange={(e) => setSetupFormData({ ...setupFormData, itemName: e.target.value })}
                          placeholder="검사항목명"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>규격</Label>
                        <Input
                          value={setupFormData.spec}
                          onChange={(e) => setSetupFormData({ ...setupFormData, spec: e.target.value })}
                          placeholder="규격값"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>허용공차</Label>
                        <Input
                          value={setupFormData.tolerance}
                          onChange={(e) => setSetupFormData({ ...setupFormData, tolerance: e.target.value })}
                          placeholder="예: +/- 0.1mm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정방법</Label>
                        <Input
                          value={setupFormData.measureMethod}
                          onChange={(e) => setSetupFormData({ ...setupFormData, measureMethod: e.target.value })}
                          placeholder="측정방법"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정기기</Label>
                        <Input
                          value={setupFormData.measureEquipment}
                          onChange={(e) => setSetupFormData({ ...setupFormData, measureEquipment: e.target.value })}
                          placeholder="측정기기명"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveItemSetup}>
                        <Plus className="mr-2 h-4 w-4" />
                        항목 추가
                      </Button>
                    </div>
                  </div>

                  {/* 등록된 검사항목 목록 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">등록된 검사항목</h3>
                    {itemSetups.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">등록된 검사항목이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>품번</TableHead>
                            <TableHead>품명</TableHead>
                            <TableHead>구분</TableHead>
                            <TableHead>검사항목</TableHead>
                            <TableHead>규격</TableHead>
                            <TableHead>허용공차</TableHead>
                            <TableHead>측정방법</TableHead>
                            <TableHead>측정기기</TableHead>
                            <TableHead className="w-16">삭제</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itemSetups.map((setup) => (
                            <TableRow key={setup.id}>
                              <TableCell className="font-mono">{setup.partNo}</TableCell>
                              <TableCell>{setup.partName}</TableCell>
                              <TableCell>{getCategoryBadge(setup.category)}</TableCell>
                              <TableCell>{setup.itemName}</TableCell>
                              <TableCell>{setup.spec || "-"}</TableCell>
                              <TableCell>{setup.tolerance || "-"}</TableCell>
                              <TableCell>{setup.measureMethod || "-"}</TableCell>
                              <TableCell>{setup.measureEquipment || "-"}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItemSetup(setup.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ Tab 3: 출하 승인 ============ */}
            <TabsContent value="shipment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    출하 승인
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 검색 */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="품번, 품명, LOT번호로 검색..."
                      value={shipmentSearch}
                      onChange={(e) => setShipmentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* 출하대기 목록 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">출하대기 목록 (검사 완료건)</h3>
                    {pendingShipments.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">출하 대기 중인 품목이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사번호</TableHead>
                            <TableHead>검사일</TableHead>
                            <TableHead>품번</TableHead>
                            <TableHead>품명</TableHead>
                            <TableHead>LOT번호</TableHead>
                            <TableHead className="text-right">검사수량</TableHead>
                            <TableHead className="text-right">출하 가능 수량</TableHead>
                            <TableHead>판정</TableHead>
                            <TableHead className="text-center">출하승인</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingShipments.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-mono text-sm">{record.inspectionNo}</TableCell>
                              <TableCell>{record.inspectionDate}</TableCell>
                              <TableCell className="font-mono">{record.partNo}</TableCell>
                              <TableCell>{record.partName}</TableCell>
                              <TableCell className="font-mono text-sm">{record.lotNo}</TableCell>
                              <TableCell className="text-right">{record.inspectedQty.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-semibold text-green-600">
                                {record.inspectedQty.toLocaleString()}
                              </TableCell>
                              <TableCell>{getResultBadge(record.overallResult)}</TableCell>
                              <TableCell className="text-center">
                                <Button size="sm" onClick={() => approveShipment(record.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  승인
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  {/* 출하 승인 완료 목록 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">출하 승인 완료</h3>
                    {inspectionHistory.filter((r) => r.shipmentApproved).length === 0 ? (
                      <p className="text-muted-foreground py-4 text-center">승인 완료된 건이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사번호</TableHead>
                            <TableHead>품번</TableHead>
                            <TableHead>품명</TableHead>
                            <TableHead>LOT번호</TableHead>
                            <TableHead className="text-right">출하수량</TableHead>
                            <TableHead>승인일</TableHead>
                            <TableHead>승인자</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inspectionHistory
                            .filter((r) => r.shipmentApproved)
                            .map((record) => (
                              <TableRow key={record.id}>
                                <TableCell className="font-mono text-sm">{record.inspectionNo}</TableCell>
                                <TableCell className="font-mono">{record.partNo}</TableCell>
                                <TableCell>{record.partName}</TableCell>
                                <TableCell className="font-mono text-sm">{record.lotNo}</TableCell>
                                <TableCell className="text-right">{record.inspectedQty.toLocaleString()}</TableCell>
                                <TableCell>{record.shipmentApprovedDate}</TableCell>
                                <TableCell>{record.shipmentApprovedBy}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ Tab 4: 검사 이력 ============ */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    검사 이력
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 검색 및 필터 */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="검사번호, 품번, 품명, LOT번호로 검색..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={historyDateFrom}
                        onChange={(e) => setHistoryDateFrom(e.target.value)}
                        placeholder="시작일"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={historyDateTo}
                        onChange={(e) => setHistoryDateTo(e.target.value)}
                        placeholder="종료일"
                      />
                    </div>
                  </div>

                  {/* 합격률 통계 */}
                  <div className="grid gap-4 md:grid-cols-5">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BarChart3 className="h-4 w-4" />
                          총 검사건수
                        </div>
                        <div className="text-2xl font-bold">{totalInspections}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          합격
                        </div>
                        <div className="text-2xl font-bold text-green-700">{passedInspections}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <XCircle className="h-4 w-4" />
                          불합격
                        </div>
                        <div className="text-2xl font-bold text-red-700">{failedInspections}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                          <Package className="h-4 w-4" />
                          재검사
                        </div>
                        <div className="text-2xl font-bold text-yellow-700">{reInspections}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <BarChart3 className="h-4 w-4" />
                          합격률
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{passRate}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 검사 이력 테이블 */}
                  {filteredHistory.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>검사번호</TableHead>
                          <TableHead>검사일</TableHead>
                          <TableHead>품번</TableHead>
                          <TableHead>품명</TableHead>
                          <TableHead>LOT번호</TableHead>
                          <TableHead className="text-right">생산수량</TableHead>
                          <TableHead className="text-right">검사수량</TableHead>
                          <TableHead>검사자</TableHead>
                          <TableHead>종합판정</TableHead>
                          <TableHead>출하승인</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.inspectionNo}</TableCell>
                            <TableCell>{record.inspectionDate}</TableCell>
                            <TableCell className="font-mono">{record.partNo}</TableCell>
                            <TableCell>{record.partName}</TableCell>
                            <TableCell className="font-mono text-sm">{record.lotNo}</TableCell>
                            <TableCell className="text-right">{record.productionQty.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{record.inspectedQty.toLocaleString()}</TableCell>
                            <TableCell>{record.inspector}</TableCell>
                            <TableCell>{getResultBadge(record.overallResult)}</TableCell>
                            <TableCell>
                              {record.shipmentApproved ? (
                                <Badge variant="success">승인완료</Badge>
                              ) : record.overallResult === "합격" ? (
                                <Badge variant="outline">대기중</Badge>
                              ) : (
                                <Badge variant="secondary">-</Badge>
                              )}
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
        </CardContent>
      </Card>
    </div>
  );
}
