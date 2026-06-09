"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Save,
  Plus,
  Target,
  BarChart3
} from "lucide-react";

// Types
interface Process {
  id: string;
  name: string;
  code: string;
}

interface KpiIndicator {
  id: string;
  processId: string;
  name: string;
  unit: string;
  formula: string;
  targetDirection: "higher" | "lower"; // higher is better or lower is better
}

interface MonthlyRecord {
  id: string;
  indicatorId: string;
  yearMonth: string;
  targetValue: number;
  actualValue: number;
  achievementRate: number;
}

interface ProcessStatus {
  processId: string;
  processName: string;
  indicators: {
    indicatorId: string;
    indicatorName: string;
    unit: string;
    monthlyData: { month: number; target: number; actual: number; rate: number }[];
  }[];
}

interface ImprovementAction {
  id: string;
  indicatorId: string;
  indicatorName: string;
  processName: string;
  yearMonth: string;
  targetValue: number;
  actualValue: number;
  achievementRate: number;
  causeAnalysis: string;
  improvementPlan: string;
  actionStatus: "planned" | "in-progress" | "completed" | "verified";
  dueDate: string;
  responsible: string;
}

// Sample data
const processes: Process[] = [
  { id: "P001", name: "영업 프로세스", code: "SALES" },
  { id: "P002", name: "생산 프로세스", code: "PROD" },
  { id: "P003", name: "품질관리 프로세스", code: "QC" },
  { id: "P004", name: "구매 프로세스", code: "PURCH" },
  { id: "P005", name: "물류 프로세스", code: "LOGIS" },
];

const indicators: KpiIndicator[] = [
  { id: "I001", processId: "P001", name: "수주 달성률", unit: "%", formula: "(실제수주/목표수주)*100", targetDirection: "higher" },
  { id: "I002", processId: "P001", name: "고객 응대 시간", unit: "시간", formula: "평균 응대 시간", targetDirection: "lower" },
  { id: "I003", processId: "P002", name: "생산 효율성", unit: "%", formula: "(실제생산/계획생산)*100", targetDirection: "higher" },
  { id: "I004", processId: "P002", name: "설비 가동률", unit: "%", formula: "(가동시간/계획시간)*100", targetDirection: "higher" },
  { id: "I005", processId: "P003", name: "불량률", unit: "ppm", formula: "(불량수/생산수)*1000000", targetDirection: "lower" },
  { id: "I006", processId: "P003", name: "고객 불만 건수", unit: "건", formula: "월간 고객불만 접수 건수", targetDirection: "lower" },
  { id: "I007", processId: "P004", name: "구매 리드타임", unit: "일", formula: "평균 구매 소요일수", targetDirection: "lower" },
  { id: "I008", processId: "P004", name: "협력사 품질 적합률", unit: "%", formula: "(적합품/입고품)*100", targetDirection: "higher" },
  { id: "I009", processId: "P005", name: "납기 준수율", unit: "%", formula: "(정시납품/총납품)*100", targetDirection: "higher" },
  { id: "I010", processId: "P005", name: "재고 회전율", unit: "회", formula: "출고금액/평균재고금액", targetDirection: "higher" },
];

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

// Generate sample monthly records
const generateSampleRecords = (): MonthlyRecord[] => {
  const records: MonthlyRecord[] = [];
  indicators.forEach((ind) => {
    for (let m = 1; m <= 12; m++) {
      const target = ind.targetDirection === "higher" ? 95 : 10;
      const variance = (Math.random() - 0.5) * 20;
      const actual = Math.max(0, target + variance);
      const rate = ind.targetDirection === "higher"
        ? (actual / target) * 100
        : target > 0 ? (target / actual) * 100 : 100;

      records.push({
        id: `${ind.id}-2026-${m.toString().padStart(2, "0")}`,
        indicatorId: ind.id,
        yearMonth: `2026-${m.toString().padStart(2, "0")}`,
        targetValue: Math.round(target * 10) / 10,
        actualValue: Math.round(actual * 10) / 10,
        achievementRate: Math.round(rate * 10) / 10,
      });
    }
  });
  return records;
};

// Generate sample improvement actions for underachieving indicators
const generateSampleImprovements = (records: MonthlyRecord[]): ImprovementAction[] => {
  const improvements: ImprovementAction[] = [];
  const underachieving = records.filter((r) => r.achievementRate < 100);

  underachieving.slice(0, 8).forEach((record, idx) => {
    const indicator = indicators.find((i) => i.id === record.indicatorId);
    const process = processes.find((p) => p.id === indicator?.processId);

    if (indicator && process) {
      improvements.push({
        id: `IMP-${idx + 1}`,
        indicatorId: record.indicatorId,
        indicatorName: indicator.name,
        processName: process.name,
        yearMonth: record.yearMonth,
        targetValue: record.targetValue,
        actualValue: record.actualValue,
        achievementRate: record.achievementRate,
        causeAnalysis: idx % 2 === 0 ? "인력 부족으로 인한 업무 지연" : "설비 노후화로 인한 효율 저하",
        improvementPlan: idx % 2 === 0 ? "추가 인력 채용 및 업무 프로세스 개선" : "설비 교체 및 예방정비 강화",
        actionStatus: ["planned", "in-progress", "completed", "verified"][idx % 4] as ImprovementAction["actionStatus"],
        dueDate: `2026-${((parseInt(record.yearMonth.split("-")[1]) % 12) + 1).toString().padStart(2, "0")}-15`,
        responsible: ["김철수", "이영희", "박민수", "정지은"][idx % 4],
      });
    }
  });

  return improvements;
};

export default function KpiRecordsPage() {
  const [activeTab, setActiveTab] = useState("monthly-entry");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("06");
  const [selectedProcess, setSelectedProcess] = useState<string>("");
  const [selectedIndicator, setSelectedIndicator] = useState<string>("");

  // Form state for monthly entry
  const [entryForm, setEntryForm] = useState({
    targetValue: "",
    actualValue: "",
  });

  // Records state
  const [records, setRecords] = useState<MonthlyRecord[]>(generateSampleRecords());
  const [improvements, setImprovements] = useState<ImprovementAction[]>(() => generateSampleImprovements(generateSampleRecords()));

  // Improvement form state
  const [editingImprovement, setEditingImprovement] = useState<string | null>(null);
  const [improvementForm, setImprovementForm] = useState({
    causeAnalysis: "",
    improvementPlan: "",
    actionStatus: "planned" as ImprovementAction["actionStatus"],
    dueDate: "",
    responsible: "",
  });

  // Calculate achievement rate
  const calculateAchievementRate = (target: number, actual: number, indicatorId: string): number => {
    const indicator = indicators.find((i) => i.id === indicatorId);
    if (!indicator || target === 0) return 0;

    if (indicator.targetDirection === "higher") {
      return (actual / target) * 100;
    } else {
      return target > 0 && actual > 0 ? (target / actual) * 100 : 100;
    }
  };

  // Get filtered indicators by process
  const getIndicatorsByProcess = (processId: string) => {
    return indicators.filter((i) => i.processId === processId);
  };

  // Handle monthly entry save
  const handleSaveEntry = () => {
    if (!selectedIndicator || !entryForm.targetValue || !entryForm.actualValue) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const target = parseFloat(entryForm.targetValue);
    const actual = parseFloat(entryForm.actualValue);
    const rate = calculateAchievementRate(target, actual, selectedIndicator);
    const yearMonth = `${selectedYear}-${selectedMonth}`;
    const recordId = `${selectedIndicator}-${yearMonth}`;

    const existingIndex = records.findIndex((r) => r.id === recordId);
    const newRecord: MonthlyRecord = {
      id: recordId,
      indicatorId: selectedIndicator,
      yearMonth,
      targetValue: target,
      actualValue: actual,
      achievementRate: Math.round(rate * 10) / 10,
    };

    if (existingIndex >= 0) {
      const newRecords = [...records];
      newRecords[existingIndex] = newRecord;
      setRecords(newRecords);
    } else {
      setRecords([...records, newRecord]);
    }

    setEntryForm({ targetValue: "", actualValue: "" });
    alert("저장되었습니다.");
  };

  // Get process status data
  const getProcessStatusData = (): ProcessStatus[] => {
    return processes.map((process) => {
      const processIndicators = getIndicatorsByProcess(process.id);
      return {
        processId: process.id,
        processName: process.name,
        indicators: processIndicators.map((ind) => {
          const monthlyData = [];
          for (let m = 1; m <= 12; m++) {
            const record = records.find(
              (r) => r.indicatorId === ind.id && r.yearMonth === `${selectedYear}-${m.toString().padStart(2, "0")}`
            );
            monthlyData.push({
              month: m,
              target: record?.targetValue || 0,
              actual: record?.actualValue || 0,
              rate: record?.achievementRate || 0,
            });
          }
          return {
            indicatorId: ind.id,
            indicatorName: ind.name,
            unit: ind.unit,
            monthlyData,
          };
        }),
      };
    });
  };

  // Get 12-month trend data for an indicator
  const getTrendData = (indicatorId: string) => {
    const trendRecords = [];
    for (let m = 1; m <= 12; m++) {
      const record = records.find(
        (r) => r.indicatorId === indicatorId && r.yearMonth === `${selectedYear}-${m.toString().padStart(2, "0")}`
      );
      trendRecords.push({
        month: m,
        target: record?.targetValue || 0,
        actual: record?.actualValue || 0,
        rate: record?.achievementRate || 0,
      });
    }
    return trendRecords;
  };

  // Get underachieving indicators for improvement tab
  const getUnderachievingIndicators = () => {
    return improvements.filter((imp) => imp.yearMonth.startsWith(selectedYear));
  };

  // Handle improvement edit
  const handleEditImprovement = (improvement: ImprovementAction) => {
    setEditingImprovement(improvement.id);
    setImprovementForm({
      causeAnalysis: improvement.causeAnalysis,
      improvementPlan: improvement.improvementPlan,
      actionStatus: improvement.actionStatus,
      dueDate: improvement.dueDate,
      responsible: improvement.responsible,
    });
  };

  // Handle improvement save
  const handleSaveImprovement = (improvementId: string) => {
    setImprovements(
      improvements.map((imp) =>
        imp.id === improvementId
          ? {
              ...imp,
              causeAnalysis: improvementForm.causeAnalysis,
              improvementPlan: improvementForm.improvementPlan,
              actionStatus: improvementForm.actionStatus,
              dueDate: improvementForm.dueDate,
              responsible: improvementForm.responsible,
            }
          : imp
      )
    );
    setEditingImprovement(null);
    alert("개선대책이 저장되었습니다.");
  };

  // Get status badge
  const getStatusBadge = (rate: number) => {
    if (rate >= 100) return <Badge variant="success">달성</Badge>;
    if (rate >= 80) return <Badge variant="warning">양호</Badge>;
    return <Badge variant="destructive">미달</Badge>;
  };

  // Get action status badge
  const getActionStatusBadge = (status: ImprovementAction["actionStatus"]) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline">계획</Badge>;
      case "in-progress":
        return <Badge variant="warning">진행중</Badge>;
      case "completed":
        return <Badge variant="success">완료</Badge>;
      case "verified":
        return <Badge variant="success">검증완료</Badge>;
    }
  };

  // Get cell background color based on achievement
  const getCellBgColor = (rate: number) => {
    if (rate >= 100) return "bg-green-50";
    if (rate >= 80) return "bg-yellow-50";
    if (rate > 0) return "bg-red-50";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">프로세스별 성과지표</h1>
          <p className="text-muted-foreground">프로세스별 KPI 월간 실적 입력 및 현황 관리</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="연도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025년</SelectItem>
              <SelectItem value="2026">2026년</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monthly-entry" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            성과지표 월별 입력
          </TabsTrigger>
          <TabsTrigger value="process-status" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            프로세스별 현황
          </TabsTrigger>
          <TabsTrigger value="monthly-trend" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            월별 추이
          </TabsTrigger>
          <TabsTrigger value="improvement" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            미달성 개선대책
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Monthly KPI Entry */}
        <TabsContent value="monthly-entry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedYear}년 성과지표 월별 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>년월 선택 *</Label>
                  <div className="flex gap-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="월 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <SelectItem key={m} value={m.toString().padStart(2, "0")}>
                            {m}월
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>프로세스 선택 *</Label>
                  <Select value={selectedProcess} onValueChange={(v) => { setSelectedProcess(v); setSelectedIndicator(""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="프로세스 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>지표 선택 *</Label>
                  {!selectedProcess ? (
                    <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted text-muted-foreground text-sm">
                      프로세스를 먼저 선택하세요
                    </div>
                  ) : (
                    <Select
                      value={selectedIndicator}
                      onValueChange={setSelectedIndicator}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="지표 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {getIndicatorsByProcess(selectedProcess).map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>
                            {ind.name} ({ind.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>산출식</Label>
                  <Input
                    value={indicators.find((i) => i.id === selectedIndicator)?.formula || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>목표값 *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={entryForm.targetValue}
                    onChange={(e) => setEntryForm({ ...entryForm, targetValue: e.target.value })}
                    placeholder="목표값 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>실적값 *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={entryForm.actualValue}
                    onChange={(e) => setEntryForm({ ...entryForm, actualValue: e.target.value })}
                    placeholder="실적값 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>달성률 (자동계산)</Label>
                  <Input
                    value={
                      entryForm.targetValue && entryForm.actualValue && selectedIndicator
                        ? `${calculateAchievementRate(
                            parseFloat(entryForm.targetValue),
                            parseFloat(entryForm.actualValue),
                            selectedIndicator
                          ).toFixed(1)}%`
                        : ""
                    }
                    disabled
                    className="bg-muted font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveEntry}>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </div>

              {/* Recent entries table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">최근 입력 내역</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>년월</TableHead>
                      <TableHead>프로세스</TableHead>
                      <TableHead>지표명</TableHead>
                      <TableHead className="text-right">목표</TableHead>
                      <TableHead className="text-right">실적</TableHead>
                      <TableHead className="text-right">달성률</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records
                      .filter((r) => r.yearMonth.startsWith(selectedYear))
                      .sort((a, b) => b.yearMonth.localeCompare(a.yearMonth))
                      .slice(0, 10)
                      .map((record) => {
                        const indicator = indicators.find((i) => i.id === record.indicatorId);
                        const process = processes.find((p) => p.id === indicator?.processId);
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{record.yearMonth}</TableCell>
                            <TableCell>{process?.name || "-"}</TableCell>
                            <TableCell className="font-medium">{indicator?.name || "-"}</TableCell>
                            <TableCell className="text-right">{record.targetValue} {indicator?.unit}</TableCell>
                            <TableCell className="text-right">{record.actualValue} {indicator?.unit}</TableCell>
                            <TableCell className="text-right font-bold">{record.achievementRate}%</TableCell>
                            <TableCell>{getStatusBadge(record.achievementRate)}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Process Status */}
        <TabsContent value="process-status">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                {selectedYear}년 프로세스별 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {getProcessStatusData().map((processData) => (
                  <div key={processData.processId} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {processData.processName}
                    </h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">지표명</TableHead>
                            <TableHead className="min-w-[60px]">단위</TableHead>
                            {months.map((month) => (
                              <TableHead key={month} className="text-center min-w-[70px]">
                                {month}
                              </TableHead>
                            ))}
                            <TableHead className="text-center min-w-[80px]">평균</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {processData.indicators.map((ind) => {
                            const avgRate = ind.monthlyData.filter((d) => d.rate > 0).length > 0
                              ? ind.monthlyData.filter((d) => d.rate > 0).reduce((sum, d) => sum + d.rate, 0) /
                                ind.monthlyData.filter((d) => d.rate > 0).length
                              : 0;
                            return (
                              <TableRow key={ind.indicatorId}>
                                <TableCell className="sticky left-0 bg-background z-10 font-medium">
                                  {ind.indicatorName}
                                </TableCell>
                                <TableCell>{ind.unit}</TableCell>
                                {ind.monthlyData.map((data, idx) => (
                                  <TableCell
                                    key={idx}
                                    className={`text-center text-sm ${getCellBgColor(data.rate)}`}
                                  >
                                    {data.rate > 0 ? (
                                      <div>
                                        <div className="font-semibold">{data.rate.toFixed(0)}%</div>
                                        <div className="text-xs text-muted-foreground">
                                          {data.actual}/{data.target}
                                        </div>
                                      </div>
                                    ) : (
                                      "-"
                                    )}
                                  </TableCell>
                                ))}
                                <TableCell className={`text-center font-bold ${getCellBgColor(avgRate)}`}>
                                  {avgRate > 0 ? `${avgRate.toFixed(1)}%` : "-"}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <span className="font-medium">범례:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border rounded"></div>
                  <span>달성 (100% 이상)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border rounded"></div>
                  <span>양호 (80-99%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border rounded"></div>
                  <span>미달 (80% 미만)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Monthly Trend */}
        <TabsContent value="monthly-trend">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {selectedYear}년 12개월 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 min-w-[150px]">지표명</TableHead>
                      <TableHead className="min-w-[100px]">프로세스</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[65px]">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[70px]">평균</TableHead>
                      <TableHead className="text-center min-w-[70px]">추세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {indicators.map((ind) => {
                      const trendData = getTrendData(ind.id);
                      const validData = trendData.filter((d) => d.rate > 0);
                      const avgRate = validData.length > 0
                        ? validData.reduce((sum, d) => sum + d.rate, 0) / validData.length
                        : 0;

                      // Calculate trend (comparing first half vs second half)
                      const firstHalf = trendData.slice(0, 6).filter((d) => d.rate > 0);
                      const secondHalf = trendData.slice(6).filter((d) => d.rate > 0);
                      const firstAvg = firstHalf.length > 0
                        ? firstHalf.reduce((sum, d) => sum + d.rate, 0) / firstHalf.length
                        : 0;
                      const secondAvg = secondHalf.length > 0
                        ? secondHalf.reduce((sum, d) => sum + d.rate, 0) / secondHalf.length
                        : 0;
                      const trend = secondAvg - firstAvg;

                      const process = processes.find((p) => p.id === ind.processId);

                      return (
                        <TableRow key={ind.id}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium">
                            {ind.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {process?.name || "-"}
                          </TableCell>
                          {trendData.map((data, idx) => (
                            <TableCell
                              key={idx}
                              className={`text-center text-sm ${getCellBgColor(data.rate)}`}
                            >
                              {data.rate > 0 ? `${data.rate.toFixed(0)}%` : "-"}
                            </TableCell>
                          ))}
                          <TableCell className={`text-center font-bold ${getCellBgColor(avgRate)}`}>
                            {avgRate > 0 ? `${avgRate.toFixed(1)}%` : "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {validData.length >= 2 ? (
                              trend > 2 ? (
                                <Badge variant="success">상승</Badge>
                              ) : trend < -2 ? (
                                <Badge variant="destructive">하락</Badge>
                              ) : (
                                <Badge variant="outline">유지</Badge>
                              )
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{indicators.length}</p>
                      <p className="text-sm text-muted-foreground">총 지표 수</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-2xl font-bold text-green-600">
                        {indicators.filter((ind) => {
                          const data = getTrendData(ind.id);
                          const firstHalf = data.slice(0, 6).filter((d) => d.rate > 0);
                          const secondHalf = data.slice(6).filter((d) => d.rate > 0);
                          if (firstHalf.length === 0 || secondHalf.length === 0) return false;
                          const firstAvg = firstHalf.reduce((sum, d) => sum + d.rate, 0) / firstHalf.length;
                          const secondAvg = secondHalf.reduce((sum, d) => sum + d.rate, 0) / secondHalf.length;
                          return secondAvg - firstAvg > 2;
                        }).length}
                      </p>
                      <p className="text-sm text-muted-foreground">상승 추세</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-2xl font-bold text-blue-600">
                        {indicators.filter((ind) => {
                          const data = getTrendData(ind.id);
                          const validData = data.filter((d) => d.rate > 0);
                          if (validData.length === 0) return false;
                          const avgRate = validData.reduce((sum, d) => sum + d.rate, 0) / validData.length;
                          return avgRate >= 100;
                        }).length}
                      </p>
                      <p className="text-sm text-muted-foreground">목표 달성</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <p className="text-2xl font-bold text-red-600">
                        {indicators.filter((ind) => {
                          const data = getTrendData(ind.id);
                          const validData = data.filter((d) => d.rate > 0);
                          if (validData.length === 0) return false;
                          const avgRate = validData.reduce((sum, d) => sum + d.rate, 0) / validData.length;
                          return avgRate < 80;
                        }).length}
                      </p>
                      <p className="text-sm text-muted-foreground">주의 필요</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Improvement Actions */}
        <TabsContent value="improvement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {selectedYear}년 미달성 지표 개선대책
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUnderachievingIndicators().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">미달성 지표가 없습니다.</p>
                ) : (
                  getUnderachievingIndicators().map((improvement) => (
                    <div key={improvement.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{improvement.indicatorName}</h4>
                            <Badge variant="outline">{improvement.processName}</Badge>
                            {getActionStatusBadge(improvement.actionStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {improvement.yearMonth} | 목표: {improvement.targetValue} | 실적: {improvement.actualValue} |
                            <span className="text-red-600 font-medium ml-1">달성률: {improvement.achievementRate.toFixed(1)}%</span>
                          </p>
                        </div>
                        {editingImprovement !== improvement.id && (
                          <Button variant="outline" size="sm" onClick={() => handleEditImprovement(improvement)}>
                            수정
                          </Button>
                        )}
                      </div>

                      {editingImprovement === improvement.id ? (
                        <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <Label>원인분석</Label>
                            <Textarea
                              value={improvementForm.causeAnalysis}
                              onChange={(e) => setImprovementForm({ ...improvementForm, causeAnalysis: e.target.value })}
                              placeholder="미달성 원인을 분석하여 입력"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>개선대책</Label>
                            <Textarea
                              value={improvementForm.improvementPlan}
                              onChange={(e) => setImprovementForm({ ...improvementForm, improvementPlan: e.target.value })}
                              placeholder="개선을 위한 대책 입력"
                              rows={2}
                            />
                          </div>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label>조치 현황</Label>
                              <Select
                                value={improvementForm.actionStatus}
                                onValueChange={(v) => setImprovementForm({ ...improvementForm, actionStatus: v as ImprovementAction["actionStatus"] })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="planned">계획</SelectItem>
                                  <SelectItem value="in-progress">진행중</SelectItem>
                                  <SelectItem value="completed">완료</SelectItem>
                                  <SelectItem value="verified">검증완료</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>완료 예정일</Label>
                              <Input
                                type="date"
                                value={improvementForm.dueDate}
                                onChange={(e) => setImprovementForm({ ...improvementForm, dueDate: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>담당자</Label>
                              <Input
                                value={improvementForm.responsible}
                                onChange={(e) => setImprovementForm({ ...improvementForm, responsible: e.target.value })}
                                placeholder="담당자명"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingImprovement(null)}>
                              취소
                            </Button>
                            <Button onClick={() => handleSaveImprovement(improvement.id)}>
                              <Save className="mr-2 h-4 w-4" />
                              저장
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">원인분석</p>
                            <p className="text-sm">{improvement.causeAnalysis || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">개선대책</p>
                            <p className="text-sm">{improvement.improvementPlan || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">완료 예정일</p>
                            <p className="text-sm">{improvement.dueDate || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">담당자</p>
                            <p className="text-sm">{improvement.responsible || "-"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{getUnderachievingIndicators().length}</p>
                      <p className="text-sm text-muted-foreground">총 미달성 건수</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {getUnderachievingIndicators().filter((i) => i.actionStatus === "planned").length}
                      </p>
                      <p className="text-sm text-muted-foreground">계획</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {getUnderachievingIndicators().filter((i) => i.actionStatus === "in-progress").length}
                      </p>
                      <p className="text-sm text-muted-foreground">진행중</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {getUnderachievingIndicators().filter((i) => i.actionStatus === "completed" || i.actionStatus === "verified").length}
                      </p>
                      <p className="text-sm text-muted-foreground">완료/검증</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
