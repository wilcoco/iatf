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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Save, Trash2, ClipboardCheck, AlertTriangle, History, FileText, Package, Ruler, Eye, BoxIcon } from "lucide-react";

// Types
interface AuditPlan {
  auditNumber: string;
  auditDate: string;
  productNumber: string;
  productName: string;
  auditor: string;
  drawingNumber: string;
  specificationNumber: string;
  controlPlanNumber: string;
}

interface InspectionItem {
  id: number;
  category: "appearance" | "dimension" | "function" | "packaging";
  itemName: string;
  standard: string;
  method: string;
  result: string;
  conformity: string;
  remarks: string;
}

interface AuditResult {
  overallJudgment: string;
  nonconformities: string;
  correctiveActionRequest: string;
  auditorSignature: string;
  approverSignature: string;
  approvalDate: string;
}

interface AuditHistory {
  id: number;
  auditNumber: string;
  auditDate: string;
  productNumber: string;
  productName: string;
  result: string;
  ncCount: number;
}

export default function ProductAuditPage() {
  const [activeTab, setActiveTab] = useState("plan");

  // Audit plan state
  const [plan, setPlan] = useState<AuditPlan>({
    auditNumber: "",
    auditDate: new Date().toISOString().split("T")[0],
    productNumber: "",
    productName: "",
    auditor: "",
    drawingNumber: "",
    specificationNumber: "",
    controlPlanNumber: "",
  });

  // Inspection items state
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    { id: 1, category: "appearance", itemName: "", standard: "", method: "", result: "", conformity: "", remarks: "" },
  ]);

  // Audit result state
  const [auditResult, setAuditResult] = useState<AuditResult>({
    overallJudgment: "",
    nonconformities: "",
    correctiveActionRequest: "",
    auditorSignature: "",
    approverSignature: "",
    approvalDate: "",
  });

  // History state (sample data)
  const [history] = useState<AuditHistory[]>([
    { id: 1, auditNumber: "PA-2026-001", auditDate: "2026-01-10", productNumber: "P-001-A", productName: "브레이크 패드", result: "합격", ncCount: 0 },
    { id: 2, auditNumber: "PA-2026-002", auditDate: "2026-02-15", productNumber: "P-002-B", productName: "클러치 디스크", result: "조건부합격", ncCount: 1 },
    { id: 3, auditNumber: "PA-2026-003", auditDate: "2026-03-20", productNumber: "P-003-C", productName: "엔진 마운트", result: "합격", ncCount: 0 },
    { id: 4, auditNumber: "PA-2026-004", auditDate: "2026-04-12", productNumber: "P-004-D", productName: "서스펜션 암", result: "불합격", ncCount: 3 },
    { id: 5, auditNumber: "PA-2026-005", auditDate: "2026-05-25", productNumber: "P-005-E", productName: "스티어링 샤프트", result: "합격", ncCount: 0 },
  ]);

  // Inspection item handlers
  const addInspectionItem = (category: InspectionItem["category"]) => {
    setInspectionItems([
      ...inspectionItems,
      { id: Date.now(), category, itemName: "", standard: "", method: "", result: "", conformity: "", remarks: "" },
    ]);
  };

  const updateInspectionItem = (id: number, field: keyof InspectionItem, value: string) => {
    setInspectionItems(inspectionItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeInspectionItem = (id: number) => {
    setInspectionItems(inspectionItems.filter((item) => item.id !== id));
  };

  // Save handler
  const handleSave = () => {
    const auditData = {
      plan,
      inspectionItems,
      auditResult,
    };
    console.log("Saving product audit data:", auditData);
    alert("제품심사 데이터가 저장되었습니다.");
  };

  // Filter items by category
  const getItemsByCategory = (category: InspectionItem["category"]) => {
    return inspectionItems.filter((item) => item.category === category);
  };

  // Get category label
  const getCategoryLabel = (category: InspectionItem["category"]) => {
    switch (category) {
      case "appearance": return "외관검사";
      case "dimension": return "치수검사";
      case "function": return "기능검사";
      case "packaging": return "포장검사";
      default: return "";
    }
  };

  // Get category icon
  const getCategoryIcon = (category: InspectionItem["category"]) => {
    switch (category) {
      case "appearance": return <Eye className="h-4 w-4" />;
      case "dimension": return <Ruler className="h-4 w-4" />;
      case "function": return <ClipboardCheck className="h-4 w-4" />;
      case "packaging": return <BoxIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  // Render inspection section
  const renderInspectionSection = (category: InspectionItem["category"]) => {
    const items = getItemsByCategory(category);

    return (
      <Card key={category} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getCategoryIcon(category)}
            {getCategoryLabel(category)}
          </CardTitle>
          <Button onClick={() => addInspectionItem(category)} size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            항목 추가
          </Button>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              등록된 검사항목이 없습니다. 항목을 추가하세요.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">항목 #{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInspectionItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">검사항목</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateInspectionItem(item.id, "itemName", e.target.value)}
                          placeholder={category === "appearance" ? "표면 상태" : category === "dimension" ? "외경" : category === "function" ? "작동 토크" : "포장 상태"}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">규격/기준</Label>
                        <Input
                          value={item.standard}
                          onChange={(e) => updateInspectionItem(item.id, "standard", e.target.value)}
                          placeholder={category === "dimension" ? "50.0 +/- 0.1 mm" : "기준값"}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">검사방법</Label>
                        <Input
                          value={item.method}
                          onChange={(e) => updateInspectionItem(item.id, "method", e.target.value)}
                          placeholder={category === "appearance" ? "육안검사" : category === "dimension" ? "마이크로미터" : "시험기"}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">측정결과</Label>
                        <Input
                          value={item.result}
                          onChange={(e) => updateInspectionItem(item.id, "result", e.target.value)}
                          placeholder={category === "dimension" ? "50.05 mm" : "결과값"}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">적합여부</Label>
                        <Select
                          value={item.conformity}
                          onValueChange={(v) => updateInspectionItem(item.id, "conformity", v)}
                        >
                          <SelectTrigger className="h-8"><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="적합">적합</SelectItem>
                            <SelectItem value="부적합">부적합</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">비고</Label>
                        <Input
                          value={item.remarks}
                          onChange={(e) => updateInspectionItem(item.id, "remarks", e.target.value)}
                          placeholder="특이사항"
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    const total = inspectionItems.length;
    const conforming = inspectionItems.filter((item) => item.conformity === "적합").length;
    const nonConforming = inspectionItems.filter((item) => item.conformity === "부적합").length;
    const notChecked = inspectionItems.filter((item) => item.conformity === "").length;
    return { total, conforming, nonConforming, notChecked };
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">제품심사</h1>
          <p className="text-muted-foreground">IATF 16949 제품심사 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">
            <FileText className="mr-2 h-4 w-4" />
            심사 계획
          </TabsTrigger>
          <TabsTrigger value="items">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            심사 항목
          </TabsTrigger>
          <TabsTrigger value="result">
            <Package className="mr-2 h-4 w-4" />
            심사 결과
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            심사 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Audit Plan */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                심사 계획
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>심사일 *</Label>
                  <Input
                    type="date"
                    value={plan.auditDate}
                    onChange={(e) => setPlan({ ...plan, auditDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>심사번호 *</Label>
                  <Input
                    value={plan.auditNumber}
                    onChange={(e) => setPlan({ ...plan, auditNumber: e.target.value })}
                    placeholder="PA-2026-001"
                  />
                </div>
              </div>

              {/* Target Product */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-4">대상제품</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Input
                      value={plan.productNumber}
                      onChange={(e) => setPlan({ ...plan, productNumber: e.target.value })}
                      placeholder="P-001-A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품명 *</Label>
                    <Input
                      value={plan.productName}
                      onChange={(e) => setPlan({ ...plan, productName: e.target.value })}
                      placeholder="브레이크 패드"
                    />
                  </div>
                </div>
              </div>

              {/* Auditor */}
              <div className="space-y-2">
                <Label>심사원 *</Label>
                <Input
                  value={plan.auditor}
                  onChange={(e) => setPlan({ ...plan, auditor: e.target.value })}
                  placeholder="홍길동 (품질보증팀)"
                />
              </div>

              {/* Audit Criteria */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-4">심사기준</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>도면번호</Label>
                    <Input
                      value={plan.drawingNumber}
                      onChange={(e) => setPlan({ ...plan, drawingNumber: e.target.value })}
                      placeholder="DWG-001-REV.A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>규격서번호</Label>
                    <Input
                      value={plan.specificationNumber}
                      onChange={(e) => setPlan({ ...plan, specificationNumber: e.target.value })}
                      placeholder="SPEC-001-REV.B"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>관리계획서번호</Label>
                    <Input
                      value={plan.controlPlanNumber}
                      onChange={(e) => setPlan({ ...plan, controlPlanNumber: e.target.value })}
                      placeholder="CP-001-REV.C"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Audit Items */}
        <TabsContent value="items">
          <div className="space-y-4">
            {/* Summary Card */}
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{summary.total}</div>
                    <div className="text-muted-foreground">전체 항목</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{summary.conforming}</div>
                    <div className="text-green-600">적합</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{summary.nonConforming}</div>
                    <div className="text-red-600">부적합</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-500">{summary.notChecked}</div>
                    <div className="text-gray-500">미검사</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inspection Sections */}
            {renderInspectionSection("appearance")}
            {renderInspectionSection("dimension")}
            {renderInspectionSection("function")}
            {renderInspectionSection("packaging")}
          </div>
        </TabsContent>

        {/* Tab 3: Audit Result */}
        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                심사 결과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Judgment */}
              <div className="space-y-2">
                <Label>종합판정 *</Label>
                <Select
                  value={auditResult.overallJudgment}
                  onValueChange={(v) => setAuditResult({ ...auditResult, overallJudgment: v })}
                >
                  <SelectTrigger><SelectValue placeholder="판정 선택" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="합격">합격</SelectItem>
                    <SelectItem value="조건부합격">조건부합격</SelectItem>
                    <SelectItem value="불합격">불합격</SelectItem>
                  </SelectContent>
                </Select>
                {auditResult.overallJudgment && (
                  <div className="mt-2">
                    <Badge
                      variant={
                        auditResult.overallJudgment === "합격" ? "default" :
                        auditResult.overallJudgment === "조건부합격" ? "secondary" : "destructive"
                      }
                      className={
                        auditResult.overallJudgment === "합격" ? "bg-green-100 text-green-800 text-lg px-4 py-1" :
                        auditResult.overallJudgment === "조건부합격" ? "bg-yellow-100 text-yellow-800 text-lg px-4 py-1" :
                        "text-lg px-4 py-1"
                      }
                    >
                      {auditResult.overallJudgment}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Nonconformities */}
              <div className="space-y-2">
                <Label>부적합 사항</Label>
                <Textarea
                  value={auditResult.nonconformities}
                  onChange={(e) => setAuditResult({ ...auditResult, nonconformities: e.target.value })}
                  placeholder="발견된 부적합 사항을 상세히 기술하세요.&#10;&#10;예시:&#10;1. 치수검사 - 외경 측정값 50.15mm (규격: 50.0 +/- 0.1mm) - 규격 상한 초과&#10;2. 외관검사 - 표면 스크래치 발견 (A면 좌측 하단)"
                  rows={5}
                />
              </div>

              {/* Corrective Action Request */}
              <div className="space-y-2">
                <Label>시정조치 요청</Label>
                <Textarea
                  value={auditResult.correctiveActionRequest}
                  onChange={(e) => setAuditResult({ ...auditResult, correctiveActionRequest: e.target.value })}
                  placeholder="시정조치 요청 내용을 기술하세요.&#10;&#10;예시:&#10;1. 가공 공정 파라미터 검토 및 조정&#10;2. 검사 빈도 증가 (4시간 -> 2시간)&#10;3. 작업자 재교육 실시&#10;4. 시정조치 완료 후 재심사 실시"
                  rows={5}
                />
              </div>

              {/* Signatures */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-semibold mb-4">승인</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>심사원 서명</Label>
                    <Input
                      value={auditResult.auditorSignature}
                      onChange={(e) => setAuditResult({ ...auditResult, auditorSignature: e.target.value })}
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>승인자 서명</Label>
                    <Input
                      value={auditResult.approverSignature}
                      onChange={(e) => setAuditResult({ ...auditResult, approverSignature: e.target.value })}
                      placeholder="김철수 (품질팀장)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>승인일</Label>
                    <Input
                      type="date"
                      value={auditResult.approvalDate}
                      onChange={(e) => setAuditResult({ ...auditResult, approvalDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">심사 요약</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">검사 항목: </span>
                    <span className="font-medium">{summary.total}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">적합: </span>
                    <span className="font-medium">{summary.conforming}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">부적합: </span>
                    <span className="font-medium">{summary.nonConforming}건</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Audit History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                심사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>심사번호</TableHead>
                    <TableHead>심사일자</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead className="text-center">부적합 건수</TableHead>
                    <TableHead>결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono">{record.auditNumber}</TableCell>
                      <TableCell>{record.auditDate}</TableCell>
                      <TableCell className="font-mono">{record.productNumber}</TableCell>
                      <TableCell>{record.productName}</TableCell>
                      <TableCell className="text-center">
                        <span className={record.ncCount > 0 ? "text-red-600 font-semibold" : ""}>
                          {record.ncCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.result === "합격" ? "default" :
                            record.result === "조건부합격" ? "secondary" : "destructive"
                          }
                          className={
                            record.result === "합격" ? "bg-green-100 text-green-800" :
                            record.result === "조건부합격" ? "bg-yellow-100 text-yellow-800" : ""
                          }
                        >
                          {record.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* History Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">연간 제품심사 현황</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 심사: </span>
                    <span className="font-medium">{history.length}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">합격: </span>
                    <span className="font-medium">{history.filter((h) => h.result === "합격").length}건</span>
                  </div>
                  <div>
                    <span className="text-yellow-600">조건부합격: </span>
                    <span className="font-medium">{history.filter((h) => h.result === "조건부합격").length}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">불합격: </span>
                    <span className="font-medium">{history.filter((h) => h.result === "불합격").length}건</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
