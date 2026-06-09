"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardCheck, Users, History, Save, Search, FileDown, Building2, TrendingUp } from "lucide-react";

// Types
interface PlanItem {
  id: string;
  factory: string;
  line: string;
  months: Record<number, { plan: boolean; actual: boolean }>;
}

interface StatusSummary {
  factory: string;
  line: string;
  totalWorkers: number;
  evaluated: number;
  passed: number;
  failed: number;
  pending: number;
}

interface Worker {
  id: string;
  employeeNo: string;
  name: string;
  factory: string;
  line: string;
  position: string;
  hireDate: string;
}

interface EvaluationItem {
  id: string;
  category: string;
  item: string;
  standard: string;
  score: number | null;
  maxScore: number;
  remarks: string;
}

interface EvaluationHistory {
  id: string;
  date: string;
  workerName: string;
  factory: string;
  line: string;
  evaluator: string;
  totalScore: number;
  result: "pass" | "fail";
}

// Initial data for annual plan
const initialPlanData: PlanItem[] = [
  {
    id: "1",
    factory: "1공장",
    line: "SP2",
    months: {
      1: { plan: true, actual: true },
      2: { plan: false, actual: false },
      3: { plan: true, actual: true },
      4: { plan: false, actual: false },
      5: { plan: true, actual: false },
      6: { plan: false, actual: false },
      7: { plan: true, actual: false },
      8: { plan: false, actual: false },
      9: { plan: true, actual: false },
      10: { plan: false, actual: false },
      11: { plan: true, actual: false },
      12: { plan: false, actual: false },
    },
  },
  {
    id: "2",
    factory: "1공장",
    line: "SK3",
    months: {
      1: { plan: false, actual: false },
      2: { plan: true, actual: true },
      3: { plan: false, actual: false },
      4: { plan: true, actual: true },
      5: { plan: false, actual: false },
      6: { plan: true, actual: false },
      7: { plan: false, actual: false },
      8: { plan: true, actual: false },
      9: { plan: false, actual: false },
      10: { plan: true, actual: false },
      11: { plan: false, actual: false },
      12: { plan: true, actual: false },
    },
  },
  {
    id: "3",
    factory: "2공장",
    line: "NQ5",
    months: {
      1: { plan: true, actual: true },
      2: { plan: false, actual: false },
      3: { plan: false, actual: false },
      4: { plan: true, actual: true },
      5: { plan: false, actual: false },
      6: { plan: false, actual: false },
      7: { plan: true, actual: false },
      8: { plan: false, actual: false },
      9: { plan: false, actual: false },
      10: { plan: true, actual: false },
      11: { plan: false, actual: false },
      12: { plan: false, actual: false },
    },
  },
  {
    id: "4",
    factory: "2공장",
    line: "SK3",
    months: {
      1: { plan: false, actual: false },
      2: { plan: true, actual: true },
      3: { plan: false, actual: false },
      4: { plan: false, actual: false },
      5: { plan: true, actual: true },
      6: { plan: false, actual: false },
      7: { plan: false, actual: false },
      8: { plan: true, actual: false },
      9: { plan: false, actual: false },
      10: { plan: false, actual: false },
      11: { plan: true, actual: false },
      12: { plan: false, actual: false },
    },
  },
  {
    id: "5",
    factory: "3공장",
    line: "PU",
    months: {
      1: { plan: true, actual: true },
      2: { plan: false, actual: false },
      3: { plan: true, actual: true },
      4: { plan: false, actual: false },
      5: { plan: true, actual: false },
      6: { plan: false, actual: false },
      7: { plan: true, actual: false },
      8: { plan: false, actual: false },
      9: { plan: true, actual: false },
      10: { plan: false, actual: false },
      11: { plan: true, actual: false },
      12: { plan: false, actual: false },
    },
  },
  {
    id: "6",
    factory: "4공장",
    line: "AX1",
    months: {
      1: { plan: false, actual: false },
      2: { plan: true, actual: true },
      3: { plan: false, actual: false },
      4: { plan: true, actual: true },
      5: { plan: false, actual: false },
      6: { plan: true, actual: false },
      7: { plan: false, actual: false },
      8: { plan: true, actual: false },
      9: { plan: false, actual: false },
      10: { plan: true, actual: false },
      11: { plan: false, actual: false },
      12: { plan: true, actual: false },
    },
  },
];

// Status summary data
const initialStatusData: StatusSummary[] = [
  { factory: "1공장", line: "SP2", totalWorkers: 25, evaluated: 15, passed: 14, failed: 1, pending: 10 },
  { factory: "1공장", line: "SK3", totalWorkers: 20, evaluated: 12, passed: 11, failed: 1, pending: 8 },
  { factory: "2공장", line: "NQ5", totalWorkers: 18, evaluated: 10, passed: 9, failed: 1, pending: 8 },
  { factory: "2공장", line: "SK3", totalWorkers: 22, evaluated: 14, passed: 13, failed: 1, pending: 8 },
  { factory: "3공장", line: "PU", totalWorkers: 30, evaluated: 18, passed: 17, failed: 1, pending: 12 },
  { factory: "4공장", line: "AX1", totalWorkers: 28, evaluated: 16, passed: 15, failed: 1, pending: 12 },
];

// Workers list
const initialWorkers: Worker[] = [
  { id: "1", employeeNo: "E001", name: "김철수", factory: "1공장", line: "SP2", position: "조장", hireDate: "2020-03-15" },
  { id: "2", employeeNo: "E002", name: "이영희", factory: "1공장", line: "SP2", position: "반장", hireDate: "2019-05-20" },
  { id: "3", employeeNo: "E003", name: "박민수", factory: "1공장", line: "SK3", position: "작업자", hireDate: "2021-08-10" },
  { id: "4", employeeNo: "E004", name: "정수진", factory: "2공장", line: "NQ5", position: "조장", hireDate: "2018-01-05" },
  { id: "5", employeeNo: "E005", name: "최동훈", factory: "2공장", line: "SK3", position: "작업자", hireDate: "2022-02-28" },
  { id: "6", employeeNo: "E006", name: "강미영", factory: "3공장", line: "PU", position: "반장", hireDate: "2017-11-12" },
  { id: "7", employeeNo: "E007", name: "윤성호", factory: "4공장", line: "AX1", position: "조장", hireDate: "2019-09-01" },
  { id: "8", employeeNo: "E008", name: "조은지", factory: "4공장", line: "AX1", position: "작업자", hireDate: "2023-04-15" },
];

// Evaluation items
const initialEvaluationItems: EvaluationItem[] = [
  { id: "1", category: "안전관리", item: "안전수칙 이해도", standard: "안전수칙 숙지 및 준수 여부", score: null, maxScore: 10, remarks: "" },
  { id: "2", category: "안전관리", item: "보호구 착용", standard: "작업 시 보호구 착용 여부", score: null, maxScore: 10, remarks: "" },
  { id: "3", category: "작업숙련도", item: "작업표준 이해", standard: "작업표준서 내용 이해도", score: null, maxScore: 15, remarks: "" },
  { id: "4", category: "작업숙련도", item: "작업속도", standard: "표준작업시간 대비 실제 작업시간", score: null, maxScore: 15, remarks: "" },
  { id: "5", category: "작업숙련도", item: "작업품질", standard: "불량률 및 재작업률", score: null, maxScore: 20, remarks: "" },
  { id: "6", category: "품질관리", item: "검사방법 이해", standard: "검사기준서 이해 및 적용", score: null, maxScore: 15, remarks: "" },
  { id: "7", category: "품질관리", item: "측정기 사용", standard: "측정기 사용 능력", score: null, maxScore: 15, remarks: "" },
];

// Evaluation history
const initialHistory: EvaluationHistory[] = [
  { id: "1", date: "2026-05-15", workerName: "김철수", factory: "1공장", line: "SP2", evaluator: "홍길동", totalScore: 92, result: "pass" },
  { id: "2", date: "2026-05-15", workerName: "이영희", factory: "1공장", line: "SP2", evaluator: "홍길동", totalScore: 88, result: "pass" },
  { id: "3", date: "2026-04-20", workerName: "박민수", factory: "1공장", line: "SK3", evaluator: "김관리", totalScore: 75, result: "pass" },
  { id: "4", date: "2026-04-20", workerName: "정수진", factory: "2공장", line: "NQ5", evaluator: "김관리", totalScore: 95, result: "pass" },
  { id: "5", date: "2026-03-10", workerName: "최동훈", factory: "2공장", line: "SK3", evaluator: "이평가", totalScore: 68, result: "fail" },
  { id: "6", date: "2026-03-10", workerName: "강미영", factory: "3공장", line: "PU", evaluator: "이평가", totalScore: 90, result: "pass" },
  { id: "7", date: "2026-02-05", workerName: "윤성호", factory: "4공장", line: "AX1", evaluator: "박심사", totalScore: 85, result: "pass" },
  { id: "8", date: "2026-02-05", workerName: "조은지", factory: "4공장", line: "AX1", evaluator: "박심사", totalScore: 82, result: "pass" },
];

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function ProficiencyEvaluationPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [planData] = useState<PlanItem[]>(initialPlanData);
  const [statusData] = useState<StatusSummary[]>(initialStatusData);
  const [workers] = useState<Worker[]>(initialWorkers);
  const [evaluationItems, setEvaluationItems] = useState<EvaluationItem[]>(initialEvaluationItems);
  const [historyData] = useState<EvaluationHistory[]>(initialHistory);

  // Filter states
  const [selectedYear] = useState("2026");
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split("T")[0]);
  const [overallRemarks, setOverallRemarks] = useState("");

  // History filter
  const [historyFactory, setHistoryFactory] = useState<string>("");
  const [historyDateFrom, setHistoryDateFrom] = useState("");
  const [historyDateTo, setHistoryDateTo] = useState("");

  // Filtered workers based on factory and line
  const filteredWorkers = workers.filter((w) => {
    const matchesFactory = !selectedFactory || w.factory === selectedFactory;
    const matchesLine = !selectedLine || w.line === selectedLine;
    const matchesSearch = !searchTerm || w.name.includes(searchTerm) || w.employeeNo.includes(searchTerm);
    return matchesFactory && matchesLine && matchesSearch;
  });

  // Filtered history
  const filteredHistory = historyData.filter((h) => {
    const matchesFactory = !historyFactory || h.factory === historyFactory;
    const matchesDateFrom = !historyDateFrom || h.date >= historyDateFrom;
    const matchesDateTo = !historyDateTo || h.date <= historyDateTo;
    return matchesFactory && matchesDateFrom && matchesDateTo;
  });

  // Calculate totals for status
  const statusTotals = statusData.reduce(
    (acc, curr) => ({
      totalWorkers: acc.totalWorkers + curr.totalWorkers,
      evaluated: acc.evaluated + curr.evaluated,
      passed: acc.passed + curr.passed,
      failed: acc.failed + curr.failed,
      pending: acc.pending + curr.pending,
    }),
    { totalWorkers: 0, evaluated: 0, passed: 0, failed: 0, pending: 0 }
  );

  // Handle evaluation item score change
  const handleScoreChange = (id: string, score: number | null) => {
    setEvaluationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score } : item))
    );
  };

  // Handle evaluation item remarks change
  const handleRemarksChange = (id: string, remarks: string) => {
    setEvaluationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, remarks } : item))
    );
  };

  // Calculate total score
  const totalScore = evaluationItems.reduce((sum, item) => sum + (item.score || 0), 0);
  const maxTotalScore = evaluationItems.reduce((sum, item) => sum + item.maxScore, 0);
  const scorePercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  const evaluationResult = scorePercentage >= 70 ? "pass" : "fail";

  // Handle save evaluation
  const handleSaveEvaluation = () => {
    if (!selectedWorker) {
      alert("평가 대상 작업자를 선택해주세요.");
      return;
    }
    if (!evaluator) {
      alert("평가자를 입력해주세요.");
      return;
    }
    console.log("Saving evaluation:", {
      worker: selectedWorker,
      evaluator,
      evaluationDate,
      items: evaluationItems,
      totalScore,
      result: evaluationResult,
      remarks: overallRemarks,
    });
    alert("숙련도 평가가 저장되었습니다.");
  };

  // Get unique factories and lines
  const factories = Array.from(new Set(workers.map((w) => w.factory)));
  const lines = selectedFactory
    ? Array.from(new Set(workers.filter((w) => w.factory === selectedFactory).map((w) => w.line)))
    : Array.from(new Set(workers.map((w) => w.line)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">숙련도 평가</h1>
          <p className="text-muted-foreground">작업자 능력평가 계획 대 실적 관리</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            평가 계획
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            평가 현황
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            개인별 평가
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            평가 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Annual Plan */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedYear}년 작업자 능력평가 계획 대 실적
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary text-primary text-xs font-bold">
                    O
                  </span>
                  <span className="text-sm text-muted-foreground">계획</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    *
                  </span>
                  <span className="text-sm text-muted-foreground">실적</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">공장</TableHead>
                      <TableHead className="w-[80px]">라인</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center w-[60px]">
                          {month}월
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.factory}</TableCell>
                        <TableCell>{item.line}</TableCell>
                        {months.map((month) => {
                          const monthData = item.months[month];
                          return (
                            <TableCell key={month} className="text-center">
                              {monthData.plan && monthData.actual ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold">
                                  *
                                </span>
                              ) : monthData.plan ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary text-primary text-xs font-bold">
                                  O
                                </span>
                              ) : monthData.actual ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-xs font-bold">
                                  *
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {planData.reduce(
                          (sum, item) => sum + Object.values(item.months).filter((m) => m.plan).length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">계획 건수</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {planData.reduce(
                          (sum, item) => sum + Object.values(item.months).filter((m) => m.actual).length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">실적 건수</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {Math.round(
                          (planData.reduce(
                            (sum, item) => sum + Object.values(item.months).filter((m) => m.actual).length,
                            0
                          ) /
                            planData.reduce(
                              (sum, item) => sum + Object.values(item.months).filter((m) => m.plan).length,
                              0
                            )) *
                            100
                        ) || 0}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">달성률</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {planData.reduce(
                          (sum, item) =>
                            sum + Object.values(item.months).filter((m) => m.plan && !m.actual).length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">미완료</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Status Summary */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                공장별 평가 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>공장</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead className="text-right">총 인원</TableHead>
                    <TableHead className="text-right">평가완료</TableHead>
                    <TableHead className="text-right">합격</TableHead>
                    <TableHead className="text-right">불합격</TableHead>
                    <TableHead className="text-right">미평가</TableHead>
                    <TableHead className="text-right">완료율</TableHead>
                    <TableHead className="text-right">합격률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.factory}</TableCell>
                      <TableCell>{item.line}</TableCell>
                      <TableCell className="text-right">{item.totalWorkers}</TableCell>
                      <TableCell className="text-right">{item.evaluated}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">{item.passed}</TableCell>
                      <TableCell className="text-right text-red-600 font-medium">{item.failed}</TableCell>
                      <TableCell className="text-right text-orange-600">{item.pending}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.evaluated / item.totalWorkers >= 0.8 ? "success" : "secondary"}>
                          {Math.round((item.evaluated / item.totalWorkers) * 100)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.passed / item.evaluated >= 0.9 ? "success" : item.passed / item.evaluated >= 0.7 ? "secondary" : "destructive"}>
                          {item.evaluated > 0 ? Math.round((item.passed / item.evaluated) * 100) : 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={2}>합계</TableCell>
                    <TableCell className="text-right">{statusTotals.totalWorkers}</TableCell>
                    <TableCell className="text-right">{statusTotals.evaluated}</TableCell>
                    <TableCell className="text-right text-green-600">{statusTotals.passed}</TableCell>
                    <TableCell className="text-right text-red-600">{statusTotals.failed}</TableCell>
                    <TableCell className="text-right text-orange-600">{statusTotals.pending}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default">
                        {Math.round((statusTotals.evaluated / statusTotals.totalWorkers) * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default">
                        {statusTotals.evaluated > 0
                          ? Math.round((statusTotals.passed / statusTotals.evaluated) * 100)
                          : 0}
                        %
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{statusTotals.totalWorkers}</div>
                      <div className="text-sm text-muted-foreground">총 작업자</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{statusTotals.evaluated}</div>
                      <div className="text-sm text-muted-foreground">평가 완료</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{statusTotals.passed}</div>
                      <div className="text-sm text-muted-foreground">합격</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{statusTotals.failed}</div>
                      <div className="text-sm text-muted-foreground">불합격</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{statusTotals.pending}</div>
                      <div className="text-sm text-muted-foreground">미평가</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Individual Evaluation */}
        <TabsContent value="individual">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Worker Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  작업자 선택
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>공장</Label>
                  <Select value={selectedFactory} onValueChange={(v) => { setSelectedFactory(v); setSelectedLine(""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="공장 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      {factories.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>라인</Label>
                  <Select value={selectedLine} onValueChange={setSelectedLine}>
                    <SelectTrigger>
                      <SelectValue placeholder="라인 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      {lines.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검색</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="이름 또는 사번"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="border rounded-md max-h-[300px] overflow-y-auto">
                  {filteredWorkers.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      작업자가 없습니다.
                    </div>
                  ) : (
                    filteredWorkers.map((worker) => (
                      <div
                        key={worker.id}
                        onClick={() => setSelectedWorker(worker)}
                        className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                          selectedWorker?.id === worker.id ? "bg-primary/10" : ""
                        }`}
                      >
                        <div className="font-medium">{worker.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {worker.employeeNo} | {worker.factory} {worker.line} | {worker.position}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Form */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  개인별 숙련도 평가서
                </CardTitle>
                <Button onClick={handleSaveEvaluation} disabled={!selectedWorker}>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </CardHeader>
              <CardContent>
                {!selectedWorker ? (
                  <div className="text-center py-12 text-muted-foreground">
                    평가할 작업자를 선택해주세요.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Worker Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <Label className="text-muted-foreground">성명</Label>
                        <div className="font-medium">{selectedWorker.name}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">사번</Label>
                        <div className="font-medium">{selectedWorker.employeeNo}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">소속</Label>
                        <div className="font-medium">{selectedWorker.factory} {selectedWorker.line}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">직급</Label>
                        <div className="font-medium">{selectedWorker.position}</div>
                      </div>
                    </div>

                    {/* Evaluation Meta */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>평가일자</Label>
                        <Input
                          type="date"
                          value={evaluationDate}
                          onChange={(e) => setEvaluationDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>평가자</Label>
                        <Input
                          placeholder="평가자명"
                          value={evaluator}
                          onChange={(e) => setEvaluator(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Evaluation Items */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">분류</TableHead>
                          <TableHead className="w-[150px]">평가항목</TableHead>
                          <TableHead>평가기준</TableHead>
                          <TableHead className="w-[100px] text-center">배점</TableHead>
                          <TableHead className="w-[100px] text-center">점수</TableHead>
                          <TableHead className="w-[150px]">비고</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {evaluationItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.category}</TableCell>
                            <TableCell>{item.item}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.standard}</TableCell>
                            <TableCell className="text-center">{item.maxScore}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={item.maxScore}
                                value={item.score ?? ""}
                                onChange={(e) =>
                                  handleScoreChange(
                                    item.id,
                                    e.target.value ? parseInt(e.target.value) : null
                                  )
                                }
                                className="w-full text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.remarks}
                                onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                                placeholder="비고"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Score Summary */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalScore} / {maxTotalScore}</div>
                        <div className="text-sm text-muted-foreground">총점</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{scorePercentage}%</div>
                        <div className="text-sm text-muted-foreground">득점률</div>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={evaluationResult === "pass" ? "success" : "destructive"}
                          className="text-lg px-4 py-1"
                        >
                          {evaluationResult === "pass" ? "합격" : "불합격"}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">평가결과 (70% 이상 합격)</div>
                      </div>
                    </div>

                    {/* Overall Remarks */}
                    <div className="space-y-2">
                      <Label>종합의견</Label>
                      <Textarea
                        value={overallRemarks}
                        onChange={(e) => setOverallRemarks(e.target.value)}
                        placeholder="평가 종합의견을 입력하세요"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                평가 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-4">
                <div className="space-y-2">
                  <Label>공장</Label>
                  <Select value={historyFactory} onValueChange={setHistoryFactory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      {factories.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={historyDateFrom}
                    onChange={(e) => setHistoryDateFrom(e.target.value)}
                    className="w-[150px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    value={historyDateTo}
                    onChange={(e) => setHistoryDateTo(e.target.value)}
                    className="w-[150px]"
                  />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>평가일자</TableHead>
                    <TableHead>성명</TableHead>
                    <TableHead>공장</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead>평가자</TableHead>
                    <TableHead className="text-right">총점</TableHead>
                    <TableHead className="text-center">결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        평가 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.date}</TableCell>
                        <TableCell className="font-medium">{item.workerName}</TableCell>
                        <TableCell>{item.factory}</TableCell>
                        <TableCell>{item.line}</TableCell>
                        <TableCell>{item.evaluator}</TableCell>
                        <TableCell className="text-right font-bold">{item.totalScore}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.result === "pass" ? "success" : "destructive"}>
                            {item.result === "pass" ? "합격" : "불합격"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {filteredHistory.length > 0 && (
                <div className="mt-4 flex justify-end gap-4 text-sm text-muted-foreground">
                  <span>총 {filteredHistory.length}건</span>
                  <span>합격: {filteredHistory.filter((h) => h.result === "pass").length}건</span>
                  <span>불합격: {filteredHistory.filter((h) => h.result === "fail").length}건</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
