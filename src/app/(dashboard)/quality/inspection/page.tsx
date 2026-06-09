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
import { ClipboardCheck, Plus, Save, Trash2, CheckCircle, XCircle, Search, History } from "lucide-react";

// Types
interface InspectionItem {
  id: number;
  itemName: string;
  specUpper: string;
  specLower: string;
  measuredValue: string;
  result: "합격" | "불합격" | "";
}

interface InspectionRecord {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  inspectionType: "수입검사" | "공정검사" | "출하검사";
  inspector: string;
  productName: string;
  partNo: string;
  lotNo: string;
  quantity: number;
  supplier: string;
  items: InspectionItem[];
  overallResult: "합격" | "불합격" | "조건부합격" | "";
  approver: string;
  approvalDate: string;
  remarks: string;
}

// Generate inspection number
function generateInspectionNo(type: string): string {
  const prefix = type === "수입검사" ? "INC" : type === "공정검사" ? "PRC" : "SHP";
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `${prefix}-${date}-${seq}`;
}

export default function InspectionReportPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Form state for registration
  const [formData, setFormData] = useState({
    inspectionNo: generateInspectionNo("수입검사"),
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionType: "수입검사" as "수입검사" | "공정검사" | "출하검사",
    inspector: "",
    productName: "",
    partNo: "",
    lotNo: "",
    quantity: "",
    supplier: "",
  });

  // Inspection items state
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    { id: 1, itemName: "", specUpper: "", specLower: "", measuredValue: "", result: "" },
  ]);

  // Judgment state
  const [overallResult, setOverallResult] = useState<"합격" | "불합격" | "조건부합격" | "">("");
  const [approver, setApprover] = useState("");
  const [approvalDate, setApprovalDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");

  // History state
  const [inspectionHistory, setInspectionHistory] = useState<InspectionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle inspection type change
  const handleTypeChange = (value: string) => {
    const typedValue = value as "수입검사" | "공정검사" | "출하검사";
    if (typedValue !== "수입검사" && typedValue !== "공정검사" && typedValue !== "출하검사") return;
    setFormData({
      ...formData,
      inspectionType: typedValue,
      inspectionNo: generateInspectionNo(typedValue),
    });
  };

  // Add inspection item row
  const addInspectionItem = () => {
    const newId = Math.max(0, ...inspectionItems.map((item) => item.id)) + 1;
    setInspectionItems([
      ...inspectionItems,
      { id: newId, itemName: "", specUpper: "", specLower: "", measuredValue: "", result: "" },
    ]);
  };

  // Remove inspection item row
  const removeInspectionItem = (id: number) => {
    if (inspectionItems.length > 1) {
      setInspectionItems(inspectionItems.filter((item) => item.id !== id));
    }
  };

  // Update inspection item
  const updateInspectionItem = (id: number, field: keyof InspectionItem, value: string) => {
    setInspectionItems(
      inspectionItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate result if upper/lower specs and measured value are provided
          if (field === "measuredValue" || field === "specUpper" || field === "specLower") {
            const upper = parseFloat(updatedItem.specUpper);
            const lower = parseFloat(updatedItem.specLower);
            const measured = parseFloat(updatedItem.measuredValue);

            if (!isNaN(measured) && (!isNaN(upper) || !isNaN(lower))) {
              const withinUpper = isNaN(upper) || measured <= upper;
              const withinLower = isNaN(lower) || measured >= lower;
              updatedItem.result = withinUpper && withinLower ? "합격" : "불합격";
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Save inspection record
  const handleSave = () => {
    // Validate required fields
    if (!formData.inspector || !formData.productName || !formData.partNo || !formData.lotNo) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!overallResult) {
      alert("종합판정을 선택해주세요.");
      return;
    }

    const newRecord: InspectionRecord = {
      id: Date.now(),
      inspectionNo: formData.inspectionNo,
      inspectionDate: formData.inspectionDate,
      inspectionType: formData.inspectionType,
      inspector: formData.inspector,
      productName: formData.productName,
      partNo: formData.partNo,
      lotNo: formData.lotNo,
      quantity: Number(formData.quantity) || 0,
      supplier: formData.supplier,
      items: [...inspectionItems],
      overallResult,
      approver,
      approvalDate,
      remarks,
    };

    setInspectionHistory([newRecord, ...inspectionHistory]);

    // Reset form
    setFormData({
      inspectionNo: generateInspectionNo("수입검사"),
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectionType: "수입검사",
      inspector: "",
      productName: "",
      partNo: "",
      lotNo: "",
      quantity: "",
      supplier: "",
    });
    setInspectionItems([{ id: 1, itemName: "", specUpper: "", specLower: "", measuredValue: "", result: "" }]);
    setOverallResult("");
    setApprover("");
    setApprovalDate(new Date().toISOString().split("T")[0]);
    setRemarks("");

    alert("검사 기록이 저장되었습니다.");
    setActiveTab("history");
  };

  // Filter history
  const filteredHistory = inspectionHistory.filter(
    (record) =>
      record.inspectionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.partNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.lotNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get result badge variant
  const getResultBadge = (result: string) => {
    switch (result) {
      case "합격":
        return <Badge variant="success">{result}</Badge>;
      case "불합격":
        return <Badge variant="destructive">{result}</Badge>;
      case "조건부합격":
        return <Badge variant="warning">{result}</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">검사성적서</h1>
          <p className="text-muted-foreground">수입검사 / 공정검사 / 출하검사 성적서 관리</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registration">검사 등록</TabsTrigger>
              <TabsTrigger value="items">검사 항목</TabsTrigger>
              <TabsTrigger value="judgment">판정 및 승인</TabsTrigger>
              <TabsTrigger value="history">검사 이력</TabsTrigger>
            </TabsList>

            {/* Tab 1: 검사 등록 (Registration) */}
            <TabsContent value="registration">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    검사 등록
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Header Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>검사번호</Label>
                        <Input value={formData.inspectionNo} disabled className="bg-muted" />
                      </div>
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
                        <Label>검사유형 *</Label>
                        <Select value={formData.inspectionType} onValueChange={handleTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="검사유형 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="수입검사">수입검사</SelectItem>
                            <SelectItem value="공정검사">공정검사</SelectItem>
                            <SelectItem value="출하검사">출하검사</SelectItem>
                          </SelectContent>
                        </Select>
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

                  {/* Product Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">제품 정보</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>품명 *</Label>
                        <Input
                          value={formData.productName}
                          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                          placeholder="제품명"
                          required
                        />
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
                        <Label>LOT번호 *</Label>
                        <Input
                          value={formData.lotNo}
                          onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                          placeholder="LOT번호"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>수량</Label>
                        <Input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      {formData.inspectionType === "수입검사" && (
                        <div className="space-y-2">
                          <Label>공급업체</Label>
                          <Input
                            value={formData.supplier}
                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            placeholder="공급업체명"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("items")}>
                      다음: 검사 항목
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: 검사 항목 (Inspection Items) */}
            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      검사 항목
                    </span>
                    <Button size="sm" onClick={addInspectionItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      항목 추가
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">No.</TableHead>
                        <TableHead>검사항목명</TableHead>
                        <TableHead className="w-28">규격(하한)</TableHead>
                        <TableHead className="w-28">규격(상한)</TableHead>
                        <TableHead className="w-28">측정값</TableHead>
                        <TableHead className="w-24">판정</TableHead>
                        <TableHead className="w-16">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectionItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <Input
                              value={item.itemName}
                              onChange={(e) => updateInspectionItem(item.id, "itemName", e.target.value)}
                              placeholder="검사항목"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="any"
                              value={item.specLower}
                              onChange={(e) => updateInspectionItem(item.id, "specLower", e.target.value)}
                              placeholder="하한"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="any"
                              value={item.specUpper}
                              onChange={(e) => updateInspectionItem(item.id, "specUpper", e.target.value)}
                              placeholder="상한"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="any"
                              value={item.measuredValue}
                              onChange={(e) => updateInspectionItem(item.id, "measuredValue", e.target.value)}
                              placeholder="측정값"
                            />
                          </TableCell>
                          <TableCell>
                            {item.result === "합격" ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                합격
                              </span>
                            ) : item.result === "불합격" ? (
                              <span className="flex items-center text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                불합격
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInspectionItem(item.id)}
                              disabled={inspectionItems.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveTab("registration")}>
                      이전: 검사 등록
                    </Button>
                    <Button onClick={() => setActiveTab("judgment")}>
                      다음: 판정 및 승인
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: 판정 및 승인 (Judgment & Approval) */}
            <TabsContent value="judgment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    판정 및 승인
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">검사 항목 수</div>
                        <div className="text-2xl font-bold">{inspectionItems.length}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-green-600">합격 항목</div>
                        <div className="text-2xl font-bold text-green-700">
                          {inspectionItems.filter((item) => item.result === "합격").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-red-600">불합격 항목</div>
                        <div className="text-2xl font-bold text-red-700">
                          {inspectionItems.filter((item) => item.result === "불합격").length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Overall Judgment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">종합 판정</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>종합판정 *</Label>
                        <Select
                          value={overallResult}
                          onValueChange={(value) => setOverallResult(value as "합격" | "불합격" | "조건부합격")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="판정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="합격">합격</SelectItem>
                            <SelectItem value="불합격">불합격</SelectItem>
                            <SelectItem value="조건부합격">조건부합격</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>승인자</Label>
                        <Input
                          value={approver}
                          onChange={(e) => setApprover(e.target.value)}
                          placeholder="승인자명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>승인일</Label>
                        <Input
                          type="date"
                          value={approvalDate}
                          onChange={(e) => setApprovalDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">비고 / 특이사항</h3>
                    <Textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="검사 관련 특이사항을 입력하세요..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveTab("items")}>
                      이전: 검사 항목
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: 검사 이력 (History) */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    검사 이력
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검사번호, 품명, 품번, LOT번호로 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {filteredHistory.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>검사번호</TableHead>
                          <TableHead>검사일</TableHead>
                          <TableHead>검사유형</TableHead>
                          <TableHead>품명</TableHead>
                          <TableHead>품번</TableHead>
                          <TableHead>LOT번호</TableHead>
                          <TableHead className="text-right">수량</TableHead>
                          <TableHead>검사자</TableHead>
                          <TableHead>종합판정</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.inspectionNo}</TableCell>
                            <TableCell>{record.inspectionDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.inspectionType}</Badge>
                            </TableCell>
                            <TableCell>{record.productName}</TableCell>
                            <TableCell className="font-mono">{record.partNo}</TableCell>
                            <TableCell className="font-mono text-sm">{record.lotNo}</TableCell>
                            <TableCell className="text-right">{record.quantity.toLocaleString()}</TableCell>
                            <TableCell>{record.inspector}</TableCell>
                            <TableCell>{getResultBadge(record.overallResult)}</TableCell>
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
