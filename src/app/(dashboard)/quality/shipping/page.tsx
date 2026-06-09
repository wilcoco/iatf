"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Save, Search, CheckCircle2, XCircle, ClipboardList, FileCheck, History } from "lucide-react";

// Interfaces
interface InspectionItem {
  id: string;
  name: string;
  passed: boolean | null;
  remarks: string;
}

interface ShippingInspection {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  destination: string;
  inspector: string;
  productName: string;
  partNo: string;
  lotNo: string;
  shippingQty: number;
  deliveryDate: string;
  inspectionItems: InspectionItem[];
  overallResult: "합격" | "불합격" | "보류" | null;
  approver: string;
  approvalDate: string;
  approvalStatus: "대기" | "승인" | "반려";
  remarks: string;
  createdAt: string;
}

// Default inspection items
const defaultInspectionItems: InspectionItem[] = [
  { id: "appearance", name: "외관검사", passed: null, remarks: "" },
  { id: "dimension", name: "치수검사", passed: null, remarks: "" },
  { id: "function", name: "기능검사", passed: null, remarks: "" },
  { id: "packaging", name: "포장검사", passed: null, remarks: "" },
  { id: "label", name: "라벨확인", passed: null, remarks: "" },
];

// Generate inspection number
function generateInspectionNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `SHP-${year}${month}${day}-${random}`;
}

export default function ShippingInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [inspections, setInspections] = useState<ShippingInspection[]>([]);
  const [search, setSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    inspectionNo: generateInspectionNo(),
    inspectionDate: new Date().toISOString().split("T")[0],
    destination: "",
    inspector: "",
    productName: "",
    partNo: "",
    lotNo: "",
    shippingQty: "",
    deliveryDate: "",
    remarks: "",
  });

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(
    defaultInspectionItems.map((item) => ({ ...item }))
  );

  const [approvalData, setApprovalData] = useState({
    approver: "",
    approvalDate: new Date().toISOString().split("T")[0],
    overallResult: null as "합격" | "불합격" | "보류" | null,
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      inspectionNo: generateInspectionNo(),
      inspectionDate: new Date().toISOString().split("T")[0],
      destination: "",
      inspector: "",
      productName: "",
      partNo: "",
      lotNo: "",
      shippingQty: "",
      deliveryDate: "",
      remarks: "",
    });
    setInspectionItems(defaultInspectionItems.map((item) => ({ ...item })));
    setApprovalData({
      approver: "",
      approvalDate: new Date().toISOString().split("T")[0],
      overallResult: null,
    });
  };

  // Update inspection item
  const updateInspectionItem = (id: string, field: "passed" | "remarks", value: boolean | string | null) => {
    setInspectionItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate overall result based on inspection items
  const calculateOverallResult = (): "합격" | "불합격" | "보류" => {
    const allPassed = inspectionItems.every((item) => item.passed === true);
    const anyFailed = inspectionItems.some((item) => item.passed === false);
    const anyPending = inspectionItems.some((item) => item.passed === null);

    if (anyFailed) return "불합격";
    if (anyPending) return "보류";
    if (allPassed) return "합격";
    return "보류";
  };

  // Save shipping registration (Tab 1)
  const handleSaveRegistration = () => {
    if (!formData.destination || !formData.inspector || !formData.productName || !formData.partNo) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    alert("출하 정보가 저장되었습니다. 검사 항목 탭으로 이동합니다.");
    setActiveTab("inspection");
  };

  // Save inspection items (Tab 2)
  const handleSaveInspection = () => {
    const pendingItems = inspectionItems.filter((item) => item.passed === null);
    if (pendingItems.length > 0) {
      alert(`아직 검사하지 않은 항목이 ${pendingItems.length}개 있습니다.`);
      return;
    }
    alert("검사 항목이 저장되었습니다. 승인 탭으로 이동합니다.");
    setActiveTab("approval");
  };

  // Submit final approval (Tab 3)
  const handleApprove = (status: "승인" | "반려") => {
    if (!approvalData.approver) {
      alert("승인자를 입력해주세요.");
      return;
    }

    const newInspection: ShippingInspection = {
      id: Date.now(),
      inspectionNo: formData.inspectionNo,
      inspectionDate: formData.inspectionDate,
      destination: formData.destination,
      inspector: formData.inspector,
      productName: formData.productName,
      partNo: formData.partNo,
      lotNo: formData.lotNo,
      shippingQty: Number(formData.shippingQty) || 0,
      deliveryDate: formData.deliveryDate,
      inspectionItems: [...inspectionItems],
      overallResult: status === "승인" ? calculateOverallResult() : "불합격",
      approver: approvalData.approver,
      approvalDate: approvalData.approvalDate,
      approvalStatus: status,
      remarks: formData.remarks,
      createdAt: new Date().toISOString(),
    };

    setInspections([newInspection, ...inspections]);
    resetForm();
    alert(status === "승인" ? "출하가 승인되었습니다." : "출하가 반려되었습니다.");
    setActiveTab("history");
  };

  // Filter inspections for history
  const filteredInspections = inspections.filter(
    (i) =>
      i.inspectionNo.toLowerCase().includes(search.toLowerCase()) ||
      i.partNo.toLowerCase().includes(search.toLowerCase()) ||
      i.productName.toLowerCase().includes(search.toLowerCase()) ||
      i.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">출하검사</h1>
          <p className="text-muted-foreground">고객사 납품 전 출하검사 및 승인 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            출하 등록
          </TabsTrigger>
          <TabsTrigger value="inspection" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            검사 항목
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            승인 및 출하
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            출하 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Shipping Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>출하 등록</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Info */}
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
                  <Label>출하처 *</Label>
                  <Select
                    value={formData.destination}
                    onValueChange={(v) => setFormData({ ...formData, destination: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="현대자동차">현대자동차</SelectItem>
                      <SelectItem value="기아자동차">기아자동차</SelectItem>
                      <SelectItem value="현대모비스">현대모비스</SelectItem>
                      <SelectItem value="만도">만도</SelectItem>
                      <SelectItem value="한온시스템">한온시스템</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
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

              {/* Shipping Info */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">출하정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>제품명 *</Label>
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
                    <Label>LOT번호</Label>
                    <Input
                      value={formData.lotNo}
                      onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                      placeholder="LOT번호"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>출하수량</Label>
                    <Input
                      type="number"
                      value={formData.shippingQty}
                      onChange={(e) => setFormData({ ...formData, shippingQty: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>납기</Label>
                    <Input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>비고</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="특이사항 입력"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={resetForm}>
                  초기화
                </Button>
                <Button onClick={handleSaveRegistration}>
                  <Save className="mr-2 h-4 w-4" />
                  저장 및 다음
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Inspection Checklist */}
        <TabsContent value="inspection">
          <Card>
            <CardHeader>
              <CardTitle>검사 항목</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current item info summary */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">검사번호:</span>{" "}
                    <span className="font-medium">{formData.inspectionNo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">제품명:</span>{" "}
                    <span className="font-medium">{formData.productName || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">품번:</span>{" "}
                    <span className="font-mono">{formData.partNo || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">출하처:</span>{" "}
                    <span className="font-medium">{formData.destination || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Inspection Items Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>검사항목</TableHead>
                    <TableHead className="w-[200px]">판정</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspectionItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={item.passed === true ? "default" : "outline"}
                            className={item.passed === true ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={() => updateInspectionItem(item.id, "passed", true)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            합격
                          </Button>
                          <Button
                            size="sm"
                            variant={item.passed === false ? "default" : "outline"}
                            className={item.passed === false ? "bg-red-600 hover:bg-red-700" : ""}
                            onClick={() => updateInspectionItem(item.id, "passed", false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            불합격
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.remarks}
                          onChange={(e) => updateInspectionItem(item.id, "remarks", e.target.value)}
                          placeholder="비고"
                          className="max-w-[200px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-muted-foreground">합격 항목:</span>{" "}
                      <span className="font-bold text-green-600">
                        {inspectionItems.filter((i) => i.passed === true).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">불합격 항목:</span>{" "}
                      <span className="font-bold text-red-600">
                        {inspectionItems.filter((i) => i.passed === false).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">미검사:</span>{" "}
                      <span className="font-bold text-yellow-600">
                        {inspectionItems.filter((i) => i.passed === null).length}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">예상 종합판정:</span>{" "}
                    <Badge
                      variant={
                        calculateOverallResult() === "합격"
                          ? "success"
                          : calculateOverallResult() === "불합격"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {calculateOverallResult()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setActiveTab("registration")}>
                  이전
                </Button>
                <Button onClick={handleSaveInspection}>
                  <Save className="mr-2 h-4 w-4" />
                  저장 및 다음
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Approval & Shipping */}
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle>승인 및 출하</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary of inspection */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">출하 정보 요약</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">검사번호</span>
                      <span className="font-medium">{formData.inspectionNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">검사일</span>
                      <span>{formData.inspectionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">출하처</span>
                      <span>{formData.destination || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">제품명</span>
                      <span>{formData.productName || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">품번</span>
                      <span className="font-mono">{formData.partNo || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">출하수량</span>
                      <span>{Number(formData.shippingQty).toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">검사자</span>
                      <span>{formData.inspector || "-"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">검사 결과 요약</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {inspectionItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span>{item.name}</span>
                        <Badge
                          variant={
                            item.passed === true
                              ? "success"
                              : item.passed === false
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {item.passed === true ? "합격" : item.passed === false ? "불합격" : "미검사"}
                        </Badge>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-4 flex justify-between items-center font-medium">
                      <span>종합판정</span>
                      <Badge
                        variant={
                          calculateOverallResult() === "합격"
                            ? "success"
                            : calculateOverallResult() === "불합격"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-base px-4 py-1"
                      >
                        {calculateOverallResult()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Approval Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">출하승인</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>승인자 *</Label>
                    <Input
                      value={approvalData.approver}
                      onChange={(e) => setApprovalData({ ...approvalData, approver: e.target.value })}
                      placeholder="승인자명"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>승인일</Label>
                    <Input
                      type="date"
                      value={approvalData.approvalDate}
                      onChange={(e) => setApprovalData({ ...approvalData, approvalDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setActiveTab("inspection")}>
                  이전
                </Button>
                <Button variant="destructive" onClick={() => handleApprove("반려")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  반려
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove("승인")}
                  disabled={calculateOverallResult() === "불합격"}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  승인 및 출하
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                출하 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검사번호, 품번, 제품명, 출하처로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredInspections.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">출하 이력이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검사번호</TableHead>
                      <TableHead>검사일</TableHead>
                      <TableHead>출하처</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>품번</TableHead>
                      <TableHead className="text-right">출하수량</TableHead>
                      <TableHead>검사판정</TableHead>
                      <TableHead>승인상태</TableHead>
                      <TableHead>승인자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInspections.map((insp) => (
                      <TableRow key={insp.id}>
                        <TableCell className="font-mono text-sm">{insp.inspectionNo}</TableCell>
                        <TableCell>{insp.inspectionDate}</TableCell>
                        <TableCell>{insp.destination}</TableCell>
                        <TableCell>{insp.productName}</TableCell>
                        <TableCell className="font-mono">{insp.partNo}</TableCell>
                        <TableCell className="text-right">{insp.shippingQty.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              insp.overallResult === "합격"
                                ? "success"
                                : insp.overallResult === "불합격"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {insp.overallResult}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              insp.approvalStatus === "승인"
                                ? "success"
                                : insp.approvalStatus === "반려"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {insp.approvalStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{insp.approver}</TableCell>
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
