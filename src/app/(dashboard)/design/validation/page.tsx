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
import { Plus, Save, Trash2, ClipboardList, FlaskConical, CheckCircle2, History } from "lucide-react";

// ==================== Types ====================
interface ValidationPlan {
  validationNo: string;
  validationDate: string;
  partNo: string;
  partName: string;
  validationMethod: string;
  sampleQty: string;
  testConditions: string;
}

interface TestItem {
  id: string;
  testItemName: string;
  specification: string;
  testMethod: string;
  acceptanceCriteria: string;
}

interface TestResult {
  id: string;
  testItemId: string;
  testItemName: string;
  resultValue: string;
  judgment: "pass" | "fail" | "";
}

interface ValidationHistory {
  id: string;
  validationNo: string;
  date: string;
  partNo: string;
  partName: string;
  overallResult: "pass" | "fail" | "";
  customerApproval: "approved" | "pending" | "rejected" | "";
  remarks: string;
}

// ==================== Initial Data ====================
const validationMethods = [
  { value: "field-test", label: "필드테스트" },
  { value: "vehicle-test", label: "실차테스트" },
  { value: "durability-test", label: "내구시험" },
  { value: "reliability-test", label: "신뢰성시험" },
];

const getInitialTestItems = (): TestItem[] => [
  {
    id: "ti-1",
    testItemName: "",
    specification: "",
    testMethod: "",
    acceptanceCriteria: "",
  },
];

const getInitialHistory = (): ValidationHistory[] => [
  {
    id: "hist-1",
    validationNo: "VAL-2026-001",
    date: "2026-05-15",
    partNo: "P-100123",
    partName: "브레이크 패드",
    overallResult: "pass",
    customerApproval: "approved",
    remarks: "고객 승인 완료",
  },
  {
    id: "hist-2",
    validationNo: "VAL-2026-002",
    date: "2026-05-20",
    partNo: "P-100456",
    partName: "엔진 마운트",
    overallResult: "pass",
    customerApproval: "pending",
    remarks: "고객 검토 중",
  },
  {
    id: "hist-3",
    validationNo: "VAL-2026-003",
    date: "2026-05-28",
    partNo: "P-100789",
    partName: "서스펜션 암",
    overallResult: "fail",
    customerApproval: "rejected",
    remarks: "내구시험 불합격, 재설계 필요",
  },
];

// ==================== Main Component ====================
export default function DesignValidationPage() {
  const [activeTab, setActiveTab] = useState("plan");

  // Validation Plan State
  const [plan, setPlan] = useState<ValidationPlan>({
    validationNo: "",
    validationDate: "",
    partNo: "",
    partName: "",
    validationMethod: "",
    sampleQty: "",
    testConditions: "",
  });

  // Test Items State
  const [testItems, setTestItems] = useState<TestItem[]>(getInitialTestItems());

  // Test Results State
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallJudgment, setOverallJudgment] = useState<"pass" | "fail" | "">("");
  const [customerApproval, setCustomerApproval] = useState<"approved" | "pending" | "rejected" | "">("");

  // History State
  const [history, setHistory] = useState<ValidationHistory[]>(getInitialHistory());

  // ==================== Handlers ====================
  const handlePlanChange = (field: keyof ValidationPlan, value: string) => {
    setPlan({ ...plan, [field]: value });
  };

  // Test Items Handlers
  const addTestItem = () => {
    const newItem: TestItem = {
      id: `ti-${Date.now()}`,
      testItemName: "",
      specification: "",
      testMethod: "",
      acceptanceCriteria: "",
    };
    setTestItems([...testItems, newItem]);
  };

  const removeTestItem = (id: string) => {
    setTestItems(testItems.filter((item) => item.id !== id));
    setTestResults(testResults.filter((result) => result.testItemId !== id));
  };

  const handleTestItemChange = (id: string, field: keyof TestItem, value: string) => {
    setTestItems(testItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Test Results Handlers
  const syncTestResultsWithItems = () => {
    const newResults: TestResult[] = testItems.map((item) => {
      const existingResult = testResults.find((r) => r.testItemId === item.id);
      return existingResult || {
        id: `tr-${item.id}`,
        testItemId: item.id,
        testItemName: item.testItemName,
        resultValue: "",
        judgment: "" as const,
      };
    });
    setTestResults(newResults);
  };

  const handleResultChange = (testItemId: string, field: "resultValue" | "judgment", value: string) => {
    setTestResults(
      testResults.map((result) =>
        result.testItemId === testItemId ? { ...result, [field]: value } : result
      )
    );
  };

  // Save Handler
  const handleSave = () => {
    if (!plan.validationNo || !plan.partNo) {
      alert("확인번호와 품번은 필수 입력 항목입니다.");
      return;
    }

    // Add to history
    const newHistoryItem: ValidationHistory = {
      id: `hist-${Date.now()}`,
      validationNo: plan.validationNo,
      date: plan.validationDate || new Date().toISOString().split("T")[0],
      partNo: plan.partNo,
      partName: plan.partName,
      overallResult: overallJudgment,
      customerApproval: customerApproval,
      remarks: "",
    };
    setHistory([newHistoryItem, ...history]);
    alert("설계 유효성 확인 정보가 저장되었습니다.");
  };

  // ==================== Badge Variants ====================
  const judgmentVariants: Record<string, "default" | "success" | "destructive"> = {
    pass: "success",
    fail: "destructive",
    "": "default",
  };

  const judgmentLabels: Record<string, string> = {
    pass: "합격",
    fail: "불합격",
    "": "-",
  };

  const approvalVariants: Record<string, "default" | "success" | "warning" | "destructive"> = {
    approved: "success",
    pending: "warning",
    rejected: "destructive",
    "": "default",
  };

  const approvalLabels: Record<string, string> = {
    approved: "승인",
    pending: "검토중",
    rejected: "반려",
    "": "-",
  };

  // ==================== Render ====================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설계 유효성 확인</h1>
          <p className="text-muted-foreground">IATF 16949 Design Validation</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">
            <ClipboardList className="mr-2 h-4 w-4" />
            유효성 확인 계획
          </TabsTrigger>
          <TabsTrigger value="items">
            <FlaskConical className="mr-2 h-4 w-4" />
            시험 항목
          </TabsTrigger>
          <TabsTrigger value="results" onClick={syncTestResultsWithItems}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            시험 결과
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            유효성 확인 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Validation Plan */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                유효성 확인 계획
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>확인번호 *</Label>
                  <Input
                    value={plan.validationNo}
                    onChange={(e) => handlePlanChange("validationNo", e.target.value)}
                    placeholder="VAL-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>확인일</Label>
                  <Input
                    type="date"
                    value={plan.validationDate}
                    onChange={(e) => handlePlanChange("validationDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Target Product */}
              <div className="space-y-4">
                <h3 className="font-semibold">대상 제품</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Input
                      value={plan.partNo}
                      onChange={(e) => handlePlanChange("partNo", e.target.value)}
                      placeholder="P-100123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품명</Label>
                    <Input
                      value={plan.partName}
                      onChange={(e) => handlePlanChange("partName", e.target.value)}
                      placeholder="제품명 입력"
                    />
                  </div>
                </div>
              </div>

              {/* Validation Method */}
              <div className="space-y-4">
                <h3 className="font-semibold">확인 방법</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>확인방법</Label>
                    <Select
                      value={plan.validationMethod}
                      onValueChange={(v) => handlePlanChange("validationMethod", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="확인방법 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {validationMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>시료 수량</Label>
                    <Input
                      value={plan.sampleQty}
                      onChange={(e) => handlePlanChange("sampleQty", e.target.value)}
                      placeholder="예: 5개"
                    />
                  </div>
                </div>
              </div>

              {/* Test Conditions */}
              <div className="space-y-2">
                <Label>시험조건</Label>
                <Textarea
                  value={plan.testConditions}
                  onChange={(e) => handlePlanChange("testConditions", e.target.value)}
                  placeholder="시험조건을 상세히 기재하세요. (예: 온도, 습도, 하중, 사이클 수 등)"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Test Items */}
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  시험 항목
                </CardTitle>
                <Button onClick={addTestItem} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>시험항목</TableHead>
                    <TableHead>규격</TableHead>
                    <TableHead>시험방법</TableHead>
                    <TableHead>판정기준</TableHead>
                    <TableHead className="w-16">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        등록된 시험 항목이 없습니다. 항목 추가 버튼을 클릭하세요.
                      </TableCell>
                    </TableRow>
                  ) : (
                    testItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={item.testItemName}
                            onChange={(e) => handleTestItemChange(item.id, "testItemName", e.target.value)}
                            placeholder="시험항목명"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.specification}
                            onChange={(e) => handleTestItemChange(item.id, "specification", e.target.value)}
                            placeholder="규격값"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.testMethod}
                            onChange={(e) => handleTestItemChange(item.id, "testMethod", e.target.value)}
                            placeholder="시험방법"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.acceptanceCriteria}
                            onChange={(e) => handleTestItemChange(item.id, "acceptanceCriteria", e.target.value)}
                            placeholder="판정기준"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTestItem(item.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Test Results */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                시험 결과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Results Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>시험항목</TableHead>
                    <TableHead>결과값</TableHead>
                    <TableHead className="w-32">합격/불합격</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        시험 항목 탭에서 항목을 먼저 등록하세요.
                      </TableCell>
                    </TableRow>
                  ) : (
                    testResults.map((result, index) => {
                      const item = testItems.find((ti) => ti.id === result.testItemId);
                      return (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item?.testItemName || "-"}</p>
                              <p className="text-sm text-muted-foreground">
                                규격: {item?.specification || "-"} / 판정기준: {item?.acceptanceCriteria || "-"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={result.resultValue}
                              onChange={(e) => handleResultChange(result.testItemId, "resultValue", e.target.value)}
                              placeholder="측정값 입력"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={result.judgment}
                              onValueChange={(v) => handleResultChange(result.testItemId, "judgment", v as "pass" | "fail" | "")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="판정" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pass">합격</SelectItem>
                                <SelectItem value="fail">불합격</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Overall Judgment */}
              <div className="rounded-lg border p-4 space-y-4">
                <h3 className="font-semibold">종합 판정</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>종합판정</Label>
                    <Select
                      value={overallJudgment}
                      onValueChange={(v) => setOverallJudgment(v as "pass" | "fail" | "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="종합판정 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">합격</SelectItem>
                        <SelectItem value="fail">불합격</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>고객 승인 여부</Label>
                    <Select
                      value={customerApproval}
                      onValueChange={(v) => setCustomerApproval(v as "approved" | "pending" | "rejected" | "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="고객 승인 상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">승인</SelectItem>
                        <SelectItem value="pending">검토중</SelectItem>
                        <SelectItem value="rejected">반려</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Summary Display */}
                {(overallJudgment || customerApproval) && (
                  <div className="flex gap-4 mt-4">
                    {overallJudgment && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">종합판정:</span>
                        <Badge variant={judgmentVariants[overallJudgment]}>
                          {judgmentLabels[overallJudgment]}
                        </Badge>
                      </div>
                    )}
                    {customerApproval && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">고객승인:</span>
                        <Badge variant={approvalVariants[customerApproval]}>
                          {approvalLabels[customerApproval]}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
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
                유효성 확인 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>확인번호</TableHead>
                    <TableHead>확인일</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>종합판정</TableHead>
                    <TableHead>고객승인</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        등록된 유효성 확인 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.validationNo}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.partNo}</TableCell>
                        <TableCell>{item.partName}</TableCell>
                        <TableCell>
                          <Badge variant={judgmentVariants[item.overallResult]}>
                            {judgmentLabels[item.overallResult]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={approvalVariants[item.customerApproval]}>
                            {approvalLabels[item.customerApproval]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.remarks}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
