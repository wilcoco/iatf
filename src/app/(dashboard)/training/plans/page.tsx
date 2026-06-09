"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, BarChart3, TrendingUp, Save, Trash2 } from "lucide-react";

// Types
interface MonthlyPlan {
  month: number;
  trainingName: string;
  targetCount: number;
  hours: number;
  trainingType: string;
}

interface AnnualPlan {
  id: number;
  year: number;
  category: string; // 사무실/현장/신입사원
  monthlyPlans: MonthlyPlan[];
  createdAt: string;
}

interface MonthlyActual {
  id: number;
  planId: number;
  month: number;
  trainingName: string;
  conductedDate: string;
  plannedCount: number;
  actualCount: number;
  trainingType: string;
}

// Sample data
const initialPlans: AnnualPlan[] = [
  {
    id: 1,
    year: 2026,
    category: "사무실",
    monthlyPlans: [
      { month: 1, trainingName: "안전보건교육", targetCount: 50, hours: 4, trainingType: "법정의무" },
      { month: 2, trainingName: "품질관리교육", targetCount: 30, hours: 8, trainingType: "품질" },
      { month: 3, trainingName: "정보보호교육", targetCount: 50, hours: 2, trainingType: "법정의무" },
      { month: 4, trainingName: "직무능력향상", targetCount: 25, hours: 16, trainingType: "직무" },
      { month: 5, trainingName: "안전보건교육", targetCount: 50, hours: 4, trainingType: "법정의무" },
      { month: 6, trainingName: "화재예방교육", targetCount: 50, hours: 2, trainingType: "안전" },
    ],
    createdAt: "2026-01-15",
  },
  {
    id: 2,
    year: 2026,
    category: "현장",
    monthlyPlans: [
      { month: 1, trainingName: "안전작업교육", targetCount: 100, hours: 8, trainingType: "안전" },
      { month: 2, trainingName: "장비운용교육", targetCount: 80, hours: 16, trainingType: "직무" },
      { month: 3, trainingName: "안전보건교육", targetCount: 100, hours: 4, trainingType: "법정의무" },
      { month: 4, trainingName: "품질검사교육", targetCount: 60, hours: 8, trainingType: "품질" },
      { month: 5, trainingName: "응급처치교육", targetCount: 50, hours: 4, trainingType: "안전" },
    ],
    createdAt: "2026-01-10",
  },
  {
    id: 3,
    year: 2026,
    category: "신입사원",
    monthlyPlans: [
      { month: 1, trainingName: "신입사원OJT", targetCount: 15, hours: 40, trainingType: "직무" },
      { month: 3, trainingName: "신입사원OJT", targetCount: 10, hours: 40, trainingType: "직무" },
      { month: 7, trainingName: "신입사원OJT", targetCount: 20, hours: 40, trainingType: "직무" },
      { month: 9, trainingName: "신입사원OJT", targetCount: 12, hours: 40, trainingType: "직무" },
    ],
    createdAt: "2026-01-05",
  },
];

const initialActuals: MonthlyActual[] = [
  { id: 1, planId: 1, month: 1, trainingName: "안전보건교육", conductedDate: "2026-01-20", plannedCount: 50, actualCount: 48, trainingType: "법정의무" },
  { id: 2, planId: 1, month: 2, trainingName: "품질관리교육", conductedDate: "2026-02-15", plannedCount: 30, actualCount: 32, trainingType: "품질" },
  { id: 3, planId: 1, month: 3, trainingName: "정보보호교육", conductedDate: "2026-03-10", plannedCount: 50, actualCount: 45, trainingType: "법정의무" },
  { id: 4, planId: 1, month: 4, trainingName: "직무능력향상", conductedDate: "2026-04-22", plannedCount: 25, actualCount: 25, trainingType: "직무" },
  { id: 5, planId: 1, month: 5, trainingName: "안전보건교육", conductedDate: "2026-05-18", plannedCount: 50, actualCount: 52, trainingType: "법정의무" },
  { id: 6, planId: 2, month: 1, trainingName: "안전작업교육", conductedDate: "2026-01-25", plannedCount: 100, actualCount: 95, trainingType: "안전" },
  { id: 7, planId: 2, month: 2, trainingName: "장비운용교육", conductedDate: "2026-02-20", plannedCount: 80, actualCount: 78, trainingType: "직무" },
  { id: 8, planId: 2, month: 3, trainingName: "안전보건교육", conductedDate: "2026-03-15", plannedCount: 100, actualCount: 98, trainingType: "법정의무" },
  { id: 9, planId: 2, month: 4, trainingName: "품질검사교육", conductedDate: "2026-04-18", plannedCount: 60, actualCount: 55, trainingType: "품질" },
  { id: 10, planId: 3, month: 1, trainingName: "신입사원OJT", conductedDate: "2026-01-08", plannedCount: 15, actualCount: 15, trainingType: "직무" },
  { id: 11, planId: 3, month: 3, trainingName: "신입사원OJT", conductedDate: "2026-03-05", plannedCount: 10, actualCount: 10, trainingType: "직무" },
];

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const CATEGORIES = ["사무실", "현장", "신입사원"];
const TRAINING_TYPES = ["법정의무", "품질", "안전", "직무"];

export default function TrainingPlansPage() {
  const [activeTab, setActiveTab] = useState("annual-plan");
  const [plans, setPlans] = useState<AnnualPlan[]>(initialPlans);
  const [actuals, setActuals] = useState<MonthlyActual[]>(initialActuals);

  // Tab 1: Annual Plan Setup State
  const [planYear, setPlanYear] = useState("2026");
  const [planCategory, setPlanCategory] = useState("사무실");
  const [newPlanMonth, setNewPlanMonth] = useState("1");
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanTarget, setNewPlanTarget] = useState("");
  const [newPlanHours, setNewPlanHours] = useState("");
  const [newPlanType, setNewPlanType] = useState("법정의무");

  // Tab 2: Monthly Actual State
  const [actualMonth, setActualMonth] = useState("1");
  const [actualCategory, setActualCategory] = useState("사무실");
  const [newActualName, setNewActualName] = useState("");
  const [newActualDate, setNewActualDate] = useState("");
  const [newActualPlanned, setNewActualPlanned] = useState("");
  const [newActualCount, setNewActualCount] = useState("");
  const [newActualType, setNewActualType] = useState("법정의무");

  // Filter plans by year and category
  const filteredPlans = plans.filter((p) => p.year === parseInt(planYear) && p.category === planCategory);
  const currentPlan = filteredPlans[0];

  // Add monthly plan to annual plan
  const handleAddMonthlyPlan = () => {
    if (!newPlanName || !newPlanTarget || !newPlanHours) return;

    const newMonthlyPlan: MonthlyPlan = {
      month: parseInt(newPlanMonth),
      trainingName: newPlanName,
      targetCount: parseInt(newPlanTarget),
      hours: parseInt(newPlanHours),
      trainingType: newPlanType,
    };

    if (currentPlan) {
      setPlans(
        plans.map((p) =>
          p.id === currentPlan.id ? { ...p, monthlyPlans: [...p.monthlyPlans, newMonthlyPlan] } : p
        )
      );
    } else {
      const newPlan: AnnualPlan = {
        id: Date.now(),
        year: parseInt(planYear),
        category: planCategory,
        monthlyPlans: [newMonthlyPlan],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPlans([...plans, newPlan]);
    }

    // Reset form
    setNewPlanName("");
    setNewPlanTarget("");
    setNewPlanHours("");
  };

  // Delete monthly plan
  const handleDeleteMonthlyPlan = (planId: number, month: number, trainingName: string) => {
    setPlans(
      plans.map((p) =>
        p.id === planId
          ? { ...p, monthlyPlans: p.monthlyPlans.filter((mp) => !(mp.month === month && mp.trainingName === trainingName)) }
          : p
      )
    );
  };

  // Add monthly actual
  const handleAddActual = () => {
    if (!newActualName || !newActualDate || !newActualPlanned || !newActualCount) return;

    const matchingPlan = plans.find((p) => p.year === parseInt(planYear) && p.category === actualCategory);

    const newActual: MonthlyActual = {
      id: Date.now(),
      planId: matchingPlan?.id || 0,
      month: parseInt(actualMonth),
      trainingName: newActualName,
      conductedDate: newActualDate,
      plannedCount: parseInt(newActualPlanned),
      actualCount: parseInt(newActualCount),
      trainingType: newActualType,
    };

    setActuals([...actuals, newActual]);

    // Reset form
    setNewActualName("");
    setNewActualDate("");
    setNewActualPlanned("");
    setNewActualCount("");
  };

  // Calculate achievement rate
  const calculateAchievementRate = (planned: number, actual: number): number => {
    if (planned === 0) return 0;
    return Math.round((actual / planned) * 100);
  };

  // Get actuals for comparison (Tab 3)
  const getMonthlyComparison = () => {
    const comparison: {
      month: number;
      category: string;
      trainingName: string;
      plannedCount: number;
      actualCount: number;
      achievementRate: number;
    }[] = [];

    plans.forEach((plan) => {
      plan.monthlyPlans.forEach((mp) => {
        const actual = actuals.find(
          (a) => a.planId === plan.id && a.month === mp.month && a.trainingName === mp.trainingName
        );
        comparison.push({
          month: mp.month,
          category: plan.category,
          trainingName: mp.trainingName,
          plannedCount: mp.targetCount,
          actualCount: actual?.actualCount || 0,
          achievementRate: actual ? calculateAchievementRate(mp.targetCount, actual.actualCount) : 0,
        });
      });
    });

    return comparison.sort((a, b) => a.month - b.month);
  };

  // Get statistics (Tab 4)
  const getStatistics = () => {
    const statsByType: Record<string, { planned: number; actual: number }> = {};
    const statsByCategory: Record<string, { planned: number; actual: number }> = {};
    const monthlyTrend: { month: number; planned: number; actual: number }[] = [];

    // Initialize
    TRAINING_TYPES.forEach((type) => {
      statsByType[type] = { planned: 0, actual: 0 };
    });
    CATEGORIES.forEach((cat) => {
      statsByCategory[cat] = { planned: 0, actual: 0 };
    });
    for (let i = 1; i <= 12; i++) {
      monthlyTrend.push({ month: i, planned: 0, actual: 0 });
    }

    // Calculate
    plans.forEach((plan) => {
      plan.monthlyPlans.forEach((mp) => {
        statsByType[mp.trainingType].planned += mp.targetCount;
        statsByCategory[plan.category].planned += mp.targetCount;
        monthlyTrend[mp.month - 1].planned += mp.targetCount;

        const actual = actuals.find(
          (a) => a.planId === plan.id && a.month === mp.month && a.trainingName === mp.trainingName
        );
        if (actual) {
          statsByType[mp.trainingType].actual += actual.actualCount;
          statsByCategory[plan.category].actual += actual.actualCount;
          monthlyTrend[mp.month - 1].actual += actual.actualCount;
        }
      });
    });

    return { statsByType, statsByCategory, monthlyTrend };
  };

  const comparison = getMonthlyComparison();
  const statistics = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">년간 교육계획 관리</h1>
          <p className="text-muted-foreground">년간 교육계획 수립 및 계획대 실적 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="annual-plan">
            <Calendar className="mr-2 h-4 w-4" />
            년간 교육계획 수립
          </TabsTrigger>
          <TabsTrigger value="monthly-actual">
            <Plus className="mr-2 h-4 w-4" />
            월별 실적 입력
          </TabsTrigger>
          <TabsTrigger value="plan-vs-actual">
            <BarChart3 className="mr-2 h-4 w-4" />
            계획대 실적 현황
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <TrendingUp className="mr-2 h-4 w-4" />
            통계
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Annual Plan Setup */}
        <TabsContent value="annual-plan">
          <Card>
            <CardHeader>
              <CardTitle>년간 교육계획 수립</CardTitle>
              <CardDescription>계획년도와 교육구분을 선택하여 월별 교육계획을 수립합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label>계획년도</Label>
                  <Select value={planYear} onValueChange={setPlanYear}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2026">2026년</SelectItem>
                      <SelectItem value="2027">2027년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>교육구분</Label>
                  <Select value={planCategory} onValueChange={setPlanCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add New Plan Form */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">월별 교육계획 추가</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label>월</Label>
                      <Select value={newPlanMonth} onValueChange={setNewPlanMonth}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MONTHS.map((m, i) => (
                            <SelectItem key={i} value={String(i + 1)}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>교육명</Label>
                      <Input
                        placeholder="교육명 입력"
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>대상인원</Label>
                      <Input
                        type="number"
                        placeholder="인원"
                        value={newPlanTarget}
                        onChange={(e) => setNewPlanTarget(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>교육시간</Label>
                      <Input
                        type="number"
                        placeholder="시간"
                        value={newPlanHours}
                        onChange={(e) => setNewPlanHours(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>교육유형</Label>
                      <Select value={newPlanType} onValueChange={setNewPlanType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRAINING_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button onClick={handleAddMonthlyPlan} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        추가
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plans Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">월</TableHead>
                    <TableHead>교육명</TableHead>
                    <TableHead className="w-[100px]">대상인원</TableHead>
                    <TableHead className="w-[100px]">교육시간</TableHead>
                    <TableHead className="w-[100px]">교육유형</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPlan?.monthlyPlans
                    .sort((a, b) => a.month - b.month)
                    .map((mp, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{MONTHS[mp.month - 1]}</TableCell>
                        <TableCell className="font-medium">{mp.trainingName}</TableCell>
                        <TableCell>{mp.targetCount}명</TableCell>
                        <TableCell>{mp.hours}시간</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              mp.trainingType === "법정의무"
                                ? "destructive"
                                : mp.trainingType === "안전"
                                ? "warning"
                                : mp.trainingType === "품질"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {mp.trainingType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMonthlyPlan(currentPlan.id, mp.month, mp.trainingName)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) || (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        등록된 교육계획이 없습니다. 위 양식을 통해 추가해주세요.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Monthly Actual Entry */}
        <TabsContent value="monthly-actual">
          <Card>
            <CardHeader>
              <CardTitle>월별 실적 입력</CardTitle>
              <CardDescription>월을 선택하여 교육 실적을 입력합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label>월 선택</Label>
                  <Select value={actualMonth} onValueChange={setActualMonth}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>교육구분</Label>
                  <Select value={actualCategory} onValueChange={setActualCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Actual Form */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">실적 추가</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label>교육명</Label>
                      <Input
                        placeholder="교육명"
                        value={newActualName}
                        onChange={(e) => setNewActualName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>실시일</Label>
                      <Input
                        type="date"
                        value={newActualDate}
                        onChange={(e) => setNewActualDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>계획인원</Label>
                      <Input
                        type="number"
                        placeholder="계획인원"
                        value={newActualPlanned}
                        onChange={(e) => setNewActualPlanned(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>실적인원</Label>
                      <Input
                        type="number"
                        placeholder="실적인원"
                        value={newActualCount}
                        onChange={(e) => setNewActualCount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>교육유형</Label>
                      <Select value={newActualType} onValueChange={setNewActualType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRAINING_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button onClick={handleAddActual} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actuals for Selected Month */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>교육명</TableHead>
                    <TableHead>실시일</TableHead>
                    <TableHead>계획인원</TableHead>
                    <TableHead>실적인원</TableHead>
                    <TableHead>달성률</TableHead>
                    <TableHead>교육유형</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actuals
                    .filter((a) => a.month === parseInt(actualMonth))
                    .map((actual) => {
                      const rate = calculateAchievementRate(actual.plannedCount, actual.actualCount);
                      return (
                        <TableRow key={actual.id}>
                          <TableCell className="font-medium">{actual.trainingName}</TableCell>
                          <TableCell>{new Date(actual.conductedDate).toLocaleDateString("ko-KR")}</TableCell>
                          <TableCell>{actual.plannedCount}명</TableCell>
                          <TableCell>{actual.actualCount}명</TableCell>
                          <TableCell>
                            <Badge variant={rate >= 100 ? "success" : rate >= 80 ? "warning" : "error"}>
                              {rate}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                actual.trainingType === "법정의무"
                                  ? "destructive"
                                  : actual.trainingType === "안전"
                                  ? "warning"
                                  : actual.trainingType === "품질"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {actual.trainingType}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {actuals.filter((a) => a.month === parseInt(actualMonth)).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        해당 월에 등록된 실적이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Plan vs Actual */}
        <TabsContent value="plan-vs-actual">
          <Card>
            <CardHeader>
              <CardTitle>계획대 실적 현황</CardTitle>
              <CardDescription>월별 계획 대비 실적을 비교합니다. 미달성 항목은 빨간색으로 표시됩니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>월</TableHead>
                    <TableHead>교육구분</TableHead>
                    <TableHead>교육명</TableHead>
                    <TableHead className="text-right">계획인원</TableHead>
                    <TableHead className="text-right">실적인원</TableHead>
                    <TableHead className="text-right">달성률</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparison.map((item, idx) => {
                    const isUnderAchieved = item.achievementRate > 0 && item.achievementRate < 80;
                    const isNotStarted = item.achievementRate === 0;
                    return (
                      <TableRow
                        key={idx}
                        className={isUnderAchieved ? "bg-red-50" : isNotStarted ? "bg-gray-50" : ""}
                      >
                        <TableCell>{MONTHS[item.month - 1]}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-medium">{item.trainingName}</TableCell>
                        <TableCell className="text-right">{item.plannedCount}명</TableCell>
                        <TableCell className="text-right">{item.actualCount}명</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              item.achievementRate === 0
                                ? "outline"
                                : item.achievementRate >= 100
                                ? "success"
                                : item.achievementRate >= 80
                                ? "warning"
                                : "error"
                            }
                          >
                            {item.achievementRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.achievementRate === 0 ? (
                            <span className="text-muted-foreground">미실시</span>
                          ) : item.achievementRate >= 100 ? (
                            <span className="text-green-600 font-medium">달성</span>
                          ) : item.achievementRate >= 80 ? (
                            <span className="text-yellow-600 font-medium">양호</span>
                          ) : (
                            <span className="text-red-600 font-medium">미달성</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{comparison.length}</div>
                    <p className="text-sm text-muted-foreground">전체 계획</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {comparison.filter((c) => c.achievementRate >= 100).length}
                    </div>
                    <p className="text-sm text-muted-foreground">달성</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-600">
                      {comparison.filter((c) => c.achievementRate > 0 && c.achievementRate < 100 && c.achievementRate >= 80).length}
                    </div>
                    <p className="text-sm text-muted-foreground">양호</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">
                      {comparison.filter((c) => c.achievementRate > 0 && c.achievementRate < 80).length}
                    </div>
                    <p className="text-sm text-muted-foreground">미달성</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Statistics */}
        <TabsContent value="statistics">
          <div className="grid grid-cols-2 gap-6">
            {/* By Training Type */}
            <Card>
              <CardHeader>
                <CardTitle>교육유형별 달성률</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>교육유형</TableHead>
                      <TableHead className="text-right">계획인원</TableHead>
                      <TableHead className="text-right">실적인원</TableHead>
                      <TableHead className="text-right">달성률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TRAINING_TYPES.map((type) => {
                      const stats = statistics.statsByType[type];
                      const rate = calculateAchievementRate(stats.planned, stats.actual);
                      return (
                        <TableRow key={type}>
                          <TableCell>
                            <Badge
                              variant={
                                type === "법정의무"
                                  ? "destructive"
                                  : type === "안전"
                                  ? "warning"
                                  : type === "품질"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{stats.planned}명</TableCell>
                          <TableCell className="text-right">{stats.actual}명</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`font-bold ${
                                rate >= 100 ? "text-green-600" : rate >= 80 ? "text-yellow-600" : "text-red-600"
                              }`}
                            >
                              {rate}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* By Category */}
            <Card>
              <CardHeader>
                <CardTitle>교육구분별 달성률</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>교육구분</TableHead>
                      <TableHead className="text-right">계획인원</TableHead>
                      <TableHead className="text-right">실적인원</TableHead>
                      <TableHead className="text-right">달성률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CATEGORIES.map((cat) => {
                      const stats = statistics.statsByCategory[cat];
                      const rate = calculateAchievementRate(stats.planned, stats.actual);
                      return (
                        <TableRow key={cat}>
                          <TableCell className="font-medium">{cat}</TableCell>
                          <TableCell className="text-right">{stats.planned}명</TableCell>
                          <TableCell className="text-right">{stats.actual}명</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`font-bold ${
                                rate >= 100 ? "text-green-600" : rate >= 80 ? "text-yellow-600" : "text-red-600"
                              }`}
                            >
                              {rate}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>월별 추이</CardTitle>
                <CardDescription>월별 계획 및 실적 인원 추이</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>구분</TableHead>
                      {MONTHS.map((m) => (
                        <TableHead key={m} className="text-center text-xs">
                          {m}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">합계</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">계획</TableCell>
                      {statistics.monthlyTrend.map((mt, idx) => (
                        <TableCell key={idx} className="text-center">
                          {mt.planned > 0 ? mt.planned : "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-bold">
                        {statistics.monthlyTrend.reduce((sum, mt) => sum + mt.planned, 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">실적</TableCell>
                      {statistics.monthlyTrend.map((mt, idx) => (
                        <TableCell key={idx} className="text-center">
                          {mt.actual > 0 ? mt.actual : "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-right font-bold">
                        {statistics.monthlyTrend.reduce((sum, mt) => sum + mt.actual, 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-medium">달성률</TableCell>
                      {statistics.monthlyTrend.map((mt, idx) => {
                        const rate = calculateAchievementRate(mt.planned, mt.actual);
                        return (
                          <TableCell key={idx} className="text-center">
                            {mt.planned > 0 ? (
                              <span
                                className={`font-medium ${
                                  rate >= 100 ? "text-green-600" : rate >= 80 ? "text-yellow-600" : rate > 0 ? "text-red-600" : ""
                                }`}
                              >
                                {rate}%
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right font-bold">
                        {calculateAchievementRate(
                          statistics.monthlyTrend.reduce((sum, mt) => sum + mt.planned, 0),
                          statistics.monthlyTrend.reduce((sum, mt) => sum + mt.actual, 0)
                        )}
                        %
                      </TableCell>
                    </TableRow>
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
