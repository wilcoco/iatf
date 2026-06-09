"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Plus,
  Trash2,
  ClipboardCheck,
  BarChart3,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Download
} from "lucide-react";

// Types
interface AnnualTestPlan {
  id: string;
  planYear: string;
  testItem: string;
  targetProduct: string;
  testCycle: string;
  monthlyPlan: boolean[];
  isRegulatory: boolean;
  createdAt: string;
}

interface TestActual {
  id: string;
  testDate: string;
  testItem: string;
  targetProduct: string;
  plannedMonth: number;
  actualMonth: number;
  result: "합격" | "불합격" | "진행중";
  tester: string;
  remarks: string;
}

interface MonthlyComparison {
  month: number;
  planned: number;
  actual: number;
  achievementRate: number;
}

interface TestReport {
  id: string;
  reportNo: string;
  reportDate: string;
  testItem: string;
  targetProduct: string;
  result: "합격" | "불합격";
  tester: string;
  approver: string;
  filePath: string;
  createdAt: string;
}

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const YEARS = ["2024", "2025", "2026", "2027"];
const TEST_CYCLES = ["1회/1개월", "1회/3개월", "1회/6개월", "1회/12개월"];

// Sample initial data
const initialTestPlans: AnnualTestPlan[] = [
  {
    id: "1",
    planYear: "2026",
    testItem: "내구성 시험",
    targetProduct: "브레이크 패드 (NE1)",
    testCycle: "1회/3개월",
    monthlyPlan: [false, false, true, false, false, true, false, false, true, false, false, true],
    isRegulatory: true,
    createdAt: "2026-01-05",
  },
  {
    id: "2",
    planYear: "2026",
    testItem: "충격 시험",
    targetProduct: "에어백 모듈 (NE1)",
    testCycle: "1회/6개월",
    monthlyPlan: [false, false, false, false, false, true, false, false, false, false, false, true],
    isRegulatory: true,
    createdAt: "2026-01-05",
  },
  {
    id: "3",
    planYear: "2026",
    testItem: "개폐 내구",
    targetProduct: "도어 힌지 (DN8)",
    testCycle: "1회/6개월",
    monthlyPlan: [false, true, false, false, false, false, false, true, false, false, false, false],
    isRegulatory: false,
    createdAt: "2026-01-10",
  },
];

const initialTestActuals: TestActual[] = [
  {
    id: "1",
    testDate: "2026-03-15",
    testItem: "내구성 시험",
    targetProduct: "브레이크 패드 (NE1)",
    plannedMonth: 3,
    actualMonth: 3,
    result: "합격",
    tester: "김시험",
    remarks: "정상 완료",
  },
  {
    id: "2",
    testDate: "2026-02-20",
    testItem: "개폐 내구",
    targetProduct: "도어 힌지 (DN8)",
    plannedMonth: 2,
    actualMonth: 2,
    result: "합격",
    tester: "박검사",
    remarks: "",
  },
  {
    id: "3",
    testDate: "2026-06-10",
    testItem: "충격 시험",
    targetProduct: "에어백 모듈 (NE1)",
    plannedMonth: 6,
    actualMonth: 6,
    result: "진행중",
    tester: "이기술",
    remarks: "시험 진행 중",
  },
];

const initialTestReports: TestReport[] = [
  {
    id: "1",
    reportNo: "TR-20260315-001",
    reportDate: "2026-03-15",
    testItem: "내구성 시험",
    targetProduct: "브레이크 패드 (NE1)",
    result: "합격",
    tester: "김시험",
    approver: "최승인",
    filePath: "/reports/TR-20260315-001.pdf",
    createdAt: "2026-03-15",
  },
  {
    id: "2",
    reportNo: "TR-20260220-001",
    reportDate: "2026-02-20",
    testItem: "개폐 내구",
    targetProduct: "도어 힌지 (DN8)",
    result: "합격",
    tester: "박검사",
    approver: "최승인",
    filePath: "/reports/TR-20260220-001.pdf",
    createdAt: "2026-02-20",
  },
];

export default function ReliabilityPlanPage() {
  const [activeTab, setActiveTab] = useState("annual-plan");

  // Tab 1: Annual Test Plan state
  const [testPlans, setTestPlans] = useState<AnnualTestPlan[]>(initialTestPlans);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [newPlan, setNewPlan] = useState({
    testItem: "",
    targetProduct: "",
    testCycle: "1회/6개월",
    isRegulatory: false,
  });

  // Tab 2: Test Actual Entry state
  const [testActuals, setTestActuals] = useState<TestActual[]>(initialTestActuals);
  const [newActual, setNewActual] = useState({
    testDate: "",
    testItem: "",
    targetProduct: "",
    plannedMonth: 1,
    result: "진행중" as "합격" | "불합격" | "진행중",
    tester: "",
    remarks: "",
  });

  // Tab 4: Test Report Management state
  const [testReports, setTestReports] = useState<TestReport[]>(initialTestReports);
  const [reportSearch, setReportSearch] = useState("");

  // Add new annual plan
  const handleAddPlan = () => {
    if (!newPlan.testItem || !newPlan.targetProduct) {
      alert("시험항목과 대상제품을 입력해주세요.");
      return;
    }

    const plan: AnnualTestPlan = {
      id: Date.now().toString(),
      planYear: selectedYear,
      testItem: newPlan.testItem,
      targetProduct: newPlan.targetProduct,
      testCycle: newPlan.testCycle,
      monthlyPlan: Array(12).fill(false),
      isRegulatory: newPlan.isRegulatory,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTestPlans([...testPlans, plan]);
    setNewPlan({
      testItem: "",
      targetProduct: "",
      testCycle: "1회/6개월",
      isRegulatory: false,
    });
  };

  // Remove plan
  const handleRemovePlan = (id: string) => {
    setTestPlans(testPlans.filter((p) => p.id !== id));
  };

  // Toggle monthly plan
  const toggleMonthPlan = (planId: string, monthIndex: number) => {
    setTestPlans(
      testPlans.map((plan) => {
        if (plan.id === planId) {
          const newMonthlyPlan = [...plan.monthlyPlan];
          newMonthlyPlan[monthIndex] = !newMonthlyPlan[monthIndex];
          return { ...plan, monthlyPlan: newMonthlyPlan };
        }
        return plan;
      })
    );
  };

  // Add test actual
  const handleAddActual = () => {
    if (!newActual.testDate || !newActual.testItem || !newActual.targetProduct || !newActual.tester) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const testDate = new Date(newActual.testDate);
    const actual: TestActual = {
      id: Date.now().toString(),
      testDate: newActual.testDate,
      testItem: newActual.testItem,
      targetProduct: newActual.targetProduct,
      plannedMonth: newActual.plannedMonth,
      actualMonth: testDate.getMonth() + 1,
      result: newActual.result,
      tester: newActual.tester,
      remarks: newActual.remarks,
    };

    setTestActuals([...testActuals, actual]);
    setNewActual({
      testDate: "",
      testItem: "",
      targetProduct: "",
      plannedMonth: 1,
      result: "진행중",
      tester: "",
      remarks: "",
    });
  };

  // Calculate monthly comparison data
  const getMonthlyComparison = (): MonthlyComparison[] => {
    const filteredPlans = testPlans.filter((p) => p.planYear === selectedYear);

    return MONTHS.map((_, idx) => {
      const planned = filteredPlans.reduce((acc, plan) =>
        acc + (plan.monthlyPlan[idx] ? 1 : 0), 0);
      const actual = testActuals.filter((a) =>
        a.actualMonth === idx + 1 &&
        (a.result === "합격" || a.result === "불합격")
      ).length;

      return {
        month: idx + 1,
        planned,
        actual,
        achievementRate: planned > 0 ? Math.round((actual / planned) * 100) : 0,
      };
    });
  };

  // Get summary stats
  const getSummaryStats = () => {
    const filteredPlans = testPlans.filter((p) => p.planYear === selectedYear);
    const totalPlanned = filteredPlans.reduce((acc, p) =>
      acc + p.monthlyPlan.filter(Boolean).length, 0);
    const totalCompleted = testActuals.filter((a) =>
      a.result === "합격" || a.result === "불합격"
    ).length;
    const passCount = testActuals.filter((a) => a.result === "합격").length;
    const failCount = testActuals.filter((a) => a.result === "불합격").length;

    return {
      totalPlanned,
      totalCompleted,
      passCount,
      failCount,
      achievementRate: totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
      passRate: totalCompleted > 0 ? Math.round((passCount / totalCompleted) * 100) : 0,
    };
  };

  const stats = getSummaryStats();
  const monthlyComparison = getMonthlyComparison();

  // Filter reports by search
  const filteredReports = testReports.filter((r) =>
    r.reportNo.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.testItem.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.targetProduct.toLowerCase().includes(reportSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">연간 신뢰성시험 계획대 실적</h1>
          <p className="text-muted-foreground">{selectedYear}년 신뢰성 시험 계획 및 실적 관리</p>
        </div>
        <div className="flex items-center gap-2">
          <Label>계획년도:</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>{year}년</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">총 계획</div>
            <div className="text-2xl font-bold">{stats.totalPlanned}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">완료</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalCompleted}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">달성률</div>
            <div className="text-2xl font-bold text-green-600">{stats.achievementRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">합격</div>
            <div className="text-2xl font-bold text-green-600">{stats.passCount}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">불합격</div>
            <div className="text-2xl font-bold text-red-600">{stats.failCount}건</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="annual-plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            년간 시험계획
          </TabsTrigger>
          <TabsTrigger value="actual-entry" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            시험 실적 입력
          </TabsTrigger>
          <TabsTrigger value="plan-vs-actual" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            계획대 실적 현황
          </TabsTrigger>
          <TabsTrigger value="report-mgmt" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            시험성적서 관리
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Annual Test Plan */}
        <TabsContent value="annual-plan">
          <div className="space-y-6">
            {/* Add new plan form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  시험 계획 등록
                </CardTitle>
                <CardDescription>년간 시험 계획 항목을 등록하고 월별 시험 일정을 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5 items-end">
                  <div className="space-y-2">
                    <Label>시험항목 *</Label>
                    <Input
                      value={newPlan.testItem}
                      onChange={(e) => setNewPlan({ ...newPlan, testItem: e.target.value })}
                      placeholder="예: 내구성 시험"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>대상제품 *</Label>
                    <Input
                      value={newPlan.targetProduct}
                      onChange={(e) => setNewPlan({ ...newPlan, targetProduct: e.target.value })}
                      placeholder="예: 브레이크 패드 (NE1)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>시험주기</Label>
                    <Select
                      value={newPlan.testCycle}
                      onValueChange={(v) => setNewPlan({ ...newPlan, testCycle: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TEST_CYCLES.map((cycle) => (
                          <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>법규 여부</Label>
                    <Select
                      value={newPlan.isRegulatory ? "Y" : "N"}
                      onValueChange={(v) => setNewPlan({ ...newPlan, isRegulatory: v === "Y" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Y (법규)</SelectItem>
                        <SelectItem value="N">N (정기)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddPlan}>
                    <Plus className="h-4 w-4 mr-2" />
                    등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Annual plan table with monthly columns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {selectedYear}년 월별 시험 계획
                </CardTitle>
                <CardDescription>월별 셀을 클릭하여 시험 계획을 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px] text-center">No</TableHead>
                        <TableHead className="w-[150px]">시험항목</TableHead>
                        <TableHead className="w-[180px]">대상제품</TableHead>
                        <TableHead className="w-[100px] text-center">시험주기</TableHead>
                        <TableHead className="w-[60px] text-center">법규</TableHead>
                        {MONTHS.map((month) => (
                          <TableHead key={month} className="w-[50px] text-center min-w-[50px]">
                            {month}
                          </TableHead>
                        ))}
                        <TableHead className="w-[60px] text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testPlans.filter((p) => p.planYear === selectedYear).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={18} className="text-center py-8 text-muted-foreground">
                            등록된 시험 계획이 없습니다. 위 폼에서 계획을 등록해주세요.
                          </TableCell>
                        </TableRow>
                      ) : (
                        testPlans
                          .filter((p) => p.planYear === selectedYear)
                          .map((plan, idx) => (
                            <TableRow key={plan.id}>
                              <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                              <TableCell className="font-medium">{plan.testItem}</TableCell>
                              <TableCell>{plan.targetProduct}</TableCell>
                              <TableCell className="text-center text-sm">{plan.testCycle}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant={plan.isRegulatory ? "default" : "secondary"}>
                                  {plan.isRegulatory ? "Y" : "N"}
                                </Badge>
                              </TableCell>
                              {plan.monthlyPlan.map((isPlanned, monthIdx) => (
                                <TableCell
                                  key={monthIdx}
                                  className="text-center cursor-pointer hover:bg-muted/50"
                                  onClick={() => toggleMonthPlan(plan.id, monthIdx)}
                                >
                                  {isPlanned ? (
                                    <span className="text-blue-600 text-xl font-bold">O</span>
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </TableCell>
                              ))}
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemovePlan(plan.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <span className="font-medium">범례:</span>
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600 text-lg font-bold">O</span>
                    <span>= 계획</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">-</span>
                    <span>= 미계획</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Test Actual Entry */}
        <TabsContent value="actual-entry">
          <div className="space-y-6">
            {/* Add actual entry form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  시험 실적 입력
                </CardTitle>
                <CardDescription>실제 수행한 시험 실적을 입력합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>시험일 *</Label>
                    <Input
                      type="date"
                      value={newActual.testDate}
                      onChange={(e) => setNewActual({ ...newActual, testDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>시험항목 *</Label>
                    <Select
                      value={newActual.testItem}
                      onValueChange={(v) => setNewActual({ ...newActual, testItem: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="시험항목 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testPlans
                          .filter((p) => p.planYear === selectedYear)
                          .map((plan) => (
                            <SelectItem key={plan.id} value={plan.testItem}>
                              {plan.testItem}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>대상제품 *</Label>
                    <Select
                      value={newActual.targetProduct}
                      onValueChange={(v) => setNewActual({ ...newActual, targetProduct: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="대상제품 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {testPlans
                          .filter((p) => p.planYear === selectedYear)
                          .map((plan) => (
                            <SelectItem key={plan.id} value={plan.targetProduct}>
                              {plan.targetProduct}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>계획월</Label>
                    <Select
                      value={newActual.plannedMonth.toString()}
                      onValueChange={(v) => setNewActual({ ...newActual, plannedMonth: parseInt(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month, idx) => (
                          <SelectItem key={idx} value={(idx + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>시험결과</Label>
                    <Select
                      value={newActual.result}
                      onValueChange={(v) => setNewActual({ ...newActual, result: v as "합격" | "불합격" | "진행중" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="진행중">진행중</SelectItem>
                        <SelectItem value="합격">합격</SelectItem>
                        <SelectItem value="불합격">불합격</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>시험자 *</Label>
                    <Input
                      value={newActual.tester}
                      onChange={(e) => setNewActual({ ...newActual, tester: e.target.value })}
                      placeholder="시험자명"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label>비고</Label>
                  <Textarea
                    value={newActual.remarks}
                    onChange={(e) => setNewActual({ ...newActual, remarks: e.target.value })}
                    placeholder="비고사항을 입력하세요"
                    rows={2}
                  />
                </div>
                <div className="mt-4">
                  <Button onClick={handleAddActual}>
                    <Save className="h-4 w-4 mr-2" />
                    실적 저장
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actual entries list */}
            <Card>
              <CardHeader>
                <CardTitle>시험 실적 목록</CardTitle>
                <CardDescription>계획 대비 실제 시험 수행 내역</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] text-center">No</TableHead>
                      <TableHead className="w-[120px]">시험일</TableHead>
                      <TableHead>시험항목</TableHead>
                      <TableHead>대상제품</TableHead>
                      <TableHead className="text-center">계획월</TableHead>
                      <TableHead className="text-center">실적월</TableHead>
                      <TableHead className="text-center">결과</TableHead>
                      <TableHead>시험자</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testActuals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          등록된 실적이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      testActuals.map((actual, idx) => (
                        <TableRow key={actual.id}>
                          <TableCell className="text-center">{idx + 1}</TableCell>
                          <TableCell>{actual.testDate}</TableCell>
                          <TableCell className="font-medium">{actual.testItem}</TableCell>
                          <TableCell>{actual.targetProduct}</TableCell>
                          <TableCell className="text-center">{actual.plannedMonth}월</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={actual.actualMonth === actual.plannedMonth ? "default" : "destructive"}
                            >
                              {actual.actualMonth}월
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {actual.result === "합격" && (
                              <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />합격</Badge>
                            )}
                            {actual.result === "불합격" && (
                              <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />불합격</Badge>
                            )}
                            {actual.result === "진행중" && (
                              <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />진행중</Badge>
                            )}
                          </TableCell>
                          <TableCell>{actual.tester}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{actual.remarks}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Plan vs Actual */}
        <TabsContent value="plan-vs-actual">
          <div className="space-y-6">
            {/* Monthly comparison table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  월별 계획/실적 비교
                </CardTitle>
                <CardDescription>{selectedYear}년 월별 계획 대비 실적 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">월</TableHead>
                      <TableHead className="text-center">계획</TableHead>
                      <TableHead className="text-center">실적</TableHead>
                      <TableHead className="text-center">달성률</TableHead>
                      <TableHead className="w-[200px]">진행상황</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyComparison.map((data) => (
                      <TableRow key={data.month}>
                        <TableCell className="font-medium">{MONTHS[data.month - 1]}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-blue-600">{data.planned}건</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-green-600">{data.actual}건</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {data.planned > 0 ? (
                            <Badge
                              variant={data.achievementRate >= 100 ? "default" : data.achievementRate >= 50 ? "secondary" : "destructive"}
                              className={data.achievementRate >= 100 ? "bg-green-600" : ""}
                            >
                              {data.achievementRate}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {data.planned > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full transition-all ${
                                    data.achievementRate >= 100 ? "bg-green-600" :
                                    data.achievementRate >= 50 ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.min(data.achievementRate, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Summary by test item */}
            <Card>
              <CardHeader>
                <CardTitle>시험항목별 달성률</CardTitle>
                <CardDescription>각 시험항목별 계획 대비 실적 달성률</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>시험항목</TableHead>
                      <TableHead>대상제품</TableHead>
                      <TableHead className="text-center">연간계획</TableHead>
                      <TableHead className="text-center">완료</TableHead>
                      <TableHead className="text-center">달성률</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testPlans
                      .filter((p) => p.planYear === selectedYear)
                      .map((plan) => {
                        const plannedCount = plan.monthlyPlan.filter(Boolean).length;
                        const completedCount = testActuals.filter(
                          (a) => a.testItem === plan.testItem &&
                                 a.targetProduct === plan.targetProduct &&
                                 (a.result === "합격" || a.result === "불합격")
                        ).length;
                        const rate = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

                        return (
                          <TableRow key={plan.id}>
                            <TableCell className="font-medium">{plan.testItem}</TableCell>
                            <TableCell>{plan.targetProduct}</TableCell>
                            <TableCell className="text-center">{plannedCount}건</TableCell>
                            <TableCell className="text-center">{completedCount}건</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      rate >= 100 ? "bg-green-600" : rate >= 50 ? "bg-yellow-500" : "bg-gray-400"
                                    }`}
                                    style={{ width: `${Math.min(rate, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm w-10">{rate}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {rate >= 100 ? (
                                <Badge className="bg-green-600">완료</Badge>
                              ) : rate > 0 ? (
                                <Badge variant="secondary">진행중</Badge>
                              ) : (
                                <Badge variant="outline">대기</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Test Report Management */}
        <TabsContent value="report-mgmt">
          <div className="space-y-6">
            {/* Search and filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  시험성적서 관리
                </CardTitle>
                <CardDescription>시험성적서 목록 및 합격/불합격 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="성적서 번호, 시험항목, 제품명 검색..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    목록 다운로드
                  </Button>
                </div>

                {/* Summary cards */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">전체 성적서</div>
                          <div className="text-2xl font-bold">{testReports.length}건</div>
                        </div>
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-950/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">합격</div>
                          <div className="text-2xl font-bold text-green-600">
                            {testReports.filter((r) => r.result === "합격").length}건
                          </div>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 dark:bg-red-950/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">불합격</div>
                          <div className="text-2xl font-bold text-red-600">
                            {testReports.filter((r) => r.result === "불합격").length}건
                          </div>
                        </div>
                        <XCircle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Reports table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] text-center">No</TableHead>
                      <TableHead>성적서 번호</TableHead>
                      <TableHead>발행일</TableHead>
                      <TableHead>시험항목</TableHead>
                      <TableHead>대상제품</TableHead>
                      <TableHead className="text-center">결과</TableHead>
                      <TableHead>시험자</TableHead>
                      <TableHead>승인자</TableHead>
                      <TableHead className="text-center">파일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          {reportSearch ? "검색 결과가 없습니다." : "등록된 성적서가 없습니다."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report, idx) => (
                        <TableRow key={report.id}>
                          <TableCell className="text-center">{idx + 1}</TableCell>
                          <TableCell className="font-mono font-medium">{report.reportNo}</TableCell>
                          <TableCell>{report.reportDate}</TableCell>
                          <TableCell>{report.testItem}</TableCell>
                          <TableCell>{report.targetProduct}</TableCell>
                          <TableCell className="text-center">
                            {report.result === "합격" ? (
                              <Badge className="bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                합격
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                불합격
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{report.tester}</TableCell>
                          <TableCell>{report.approver}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
