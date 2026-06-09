"use client";

import React, { useState } from "react";
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
import { Target, BarChart3, CheckCircle2, TrendingUp, Plus, Trash2, Save } from "lucide-react";

// Types
interface QualityObjective {
  id: string;
  name: string;
  targetValue: string;
  measurementMethod: string;
  responsibleDepartment: string;
  unit: string;
}

interface MonthlyPerformance {
  objectiveId: string;
  month: number;
  actualValue: string;
}

interface ImprovementPlan {
  objectiveId: string;
  analysis: string;
  plan: string;
  targetDate: string;
  responsible: string;
}

interface YearlyTrend {
  year: number;
  objectiveId: string;
  targetValue: string;
  actualValue: string;
}

// Default quality objectives based on IATF 16949
const defaultObjectives: QualityObjective[] = [
  {
    id: "1",
    name: "고객불만 PPM",
    targetValue: "50",
    measurementMethod: "고객불만 건수 / 출하수량 x 1,000,000",
    responsibleDepartment: "품질보증팀",
    unit: "PPM",
  },
  {
    id: "2",
    name: "공정불량률",
    targetValue: "0.5",
    measurementMethod: "공정불량 수량 / 생산수량 x 100",
    responsibleDepartment: "생산팀",
    unit: "%",
  },
  {
    id: "3",
    name: "납기준수율",
    targetValue: "98",
    measurementMethod: "정시납품 건수 / 총 납품 건수 x 100",
    responsibleDepartment: "영업팀",
    unit: "%",
  },
  {
    id: "4",
    name: "고객만족도",
    targetValue: "85",
    measurementMethod: "고객만족도 설문조사 평균 점수",
    responsibleDepartment: "품질보증팀",
    unit: "점",
  },
  {
    id: "5",
    name: "내부감사 부적합 건수",
    targetValue: "5",
    measurementMethod: "연간 내부감사 부적합 건수 합계",
    responsibleDepartment: "품질경영팀",
    unit: "건",
  },
];

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default function QualityObjectivesPage() {
  const [activeTab, setActiveTab] = useState("setting");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear().toString());
  const [objectives, setObjectives] = useState<QualityObjective[]>(defaultObjectives);
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([]);
  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>([]);
  const [yearlyTrends, setYearlyTrends] = useState<YearlyTrend[]>([]);

  // Objective setting handlers
  const addObjective = () => {
    const newId = (Math.max(...objectives.map((o) => parseInt(o.id)), 0) + 1).toString();
    setObjectives([
      ...objectives,
      {
        id: newId,
        name: "",
        targetValue: "",
        measurementMethod: "",
        responsibleDepartment: "",
        unit: "",
      },
    ]);
  };

  const updateObjective = (id: string, field: keyof QualityObjective, value: string) => {
    setObjectives((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, [field]: value } : obj))
    );
  };

  const deleteObjective = (id: string) => {
    setObjectives((prev) => prev.filter((obj) => obj.id !== id));
  };

  // Monthly performance handlers
  const getMonthlyValue = (objectiveId: string, month: number): string => {
    const found = monthlyPerformance.find(
      (mp) => mp.objectiveId === objectiveId && mp.month === month
    );
    return found?.actualValue || "";
  };

  const updateMonthlyPerformance = (objectiveId: string, month: number, value: string) => {
    setMonthlyPerformance((prev) => {
      const existing = prev.findIndex(
        (mp) => mp.objectiveId === objectiveId && mp.month === month
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], actualValue: value };
        return updated;
      }
      return [...prev, { objectiveId, month, actualValue: value }];
    });
  };

  // Calculate achievement rate
  const calculateAchievementRate = (objectiveId: string): { rate: string; values: number[] } => {
    const objective = objectives.find((o) => o.id === objectiveId);
    if (!objective) return { rate: "-", values: [] };

    const values: number[] = [];
    for (let m = 1; m <= 12; m++) {
      const val = getMonthlyValue(objectiveId, m);
      if (val) values.push(parseFloat(val));
    }

    if (values.length === 0) return { rate: "-", values: [] };

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const target = parseFloat(objective.targetValue);

    if (isNaN(target) || target === 0) return { rate: "-", values };

    // For PPM and defect rate, lower is better
    const lowerIsBetter = objective.name.includes("PPM") || objective.name.includes("불량") || objective.name.includes("부적합");

    let rate: number;
    if (lowerIsBetter) {
      rate = target >= avg ? 100 : (target / avg) * 100;
    } else {
      rate = (avg / target) * 100;
    }

    return { rate: Math.min(rate, 150).toFixed(1), values };
  };

  // Get improvement plan
  const getImprovementPlan = (objectiveId: string): ImprovementPlan | undefined => {
    return improvementPlans.find((ip) => ip.objectiveId === objectiveId);
  };

  const updateImprovementPlan = (objectiveId: string, field: keyof ImprovementPlan, value: string) => {
    setImprovementPlans((prev) => {
      const existing = prev.findIndex((ip) => ip.objectiveId === objectiveId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], [field]: value };
        return updated;
      }
      return [...prev, { objectiveId, analysis: "", plan: "", targetDate: "", responsible: "", [field]: value }];
    });
  };

  // Yearly trend handlers
  const getYearlyTrend = (year: number, objectiveId: string): YearlyTrend | undefined => {
    return yearlyTrends.find((yt) => yt.year === year && yt.objectiveId === objectiveId);
  };

  const updateYearlyTrend = (year: number, objectiveId: string, field: "targetValue" | "actualValue", value: string) => {
    setYearlyTrends((prev) => {
      const existing = prev.findIndex((yt) => yt.year === year && yt.objectiveId === objectiveId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], [field]: value };
        return updated;
      }
      return [...prev, { year, objectiveId, targetValue: "", actualValue: "", [field]: value }];
    });
  };

  const handleSave = () => {
    console.log("Saving quality objectives data:", {
      targetYear,
      objectives,
      monthlyPerformance,
      improvementPlans,
      yearlyTrends,
    });
    alert("품질목표 데이터가 저장되었습니다.");
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const trendYears = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">품질목표</h1>
          <p className="text-muted-foreground">IATF 16949 품질목표 설정 및 성과 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setting">품질목표 설정</TabsTrigger>
          <TabsTrigger value="monthly">월별 실적</TabsTrigger>
          <TabsTrigger value="achievement">목표 달성 현황</TabsTrigger>
          <TabsTrigger value="trend">년간 추이</TabsTrigger>
        </TabsList>

        {/* Tab 1: 품질목표 설정 (Objective Setting) */}
        <TabsContent value="setting">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                품질목표 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label>목표년도</Label>
                  <Select value={targetYear} onValueChange={setTargetYear}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="년도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1" />
                <Button onClick={addObjective} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  목표항목 추가
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">No.</th>
                      <th className="p-3 text-left font-medium min-w-[150px]">목표항목</th>
                      <th className="p-3 text-left font-medium min-w-[100px]">목표치</th>
                      <th className="p-3 text-left font-medium min-w-[80px]">단위</th>
                      <th className="p-3 text-left font-medium min-w-[250px]">측정방법</th>
                      <th className="p-3 text-left font-medium min-w-[120px]">담당부서</th>
                      <th className="p-3 text-center font-medium w-[80px]">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.map((obj, index) => (
                      <tr key={obj.id} className="border-b">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">
                          <Input
                            value={obj.name}
                            onChange={(e) => updateObjective(obj.id, "name", e.target.value)}
                            placeholder="목표항목명"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={obj.targetValue}
                            onChange={(e) => updateObjective(obj.id, "targetValue", e.target.value)}
                            placeholder="목표치"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={obj.unit}
                            onChange={(e) => updateObjective(obj.id, "unit", e.target.value)}
                            placeholder="단위"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={obj.measurementMethod}
                            onChange={(e) => updateObjective(obj.id, "measurementMethod", e.target.value)}
                            placeholder="측정방법"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            value={obj.responsibleDepartment}
                            onChange={(e) => updateObjective(obj.id, "responsibleDepartment", e.target.value)}
                            placeholder="담당부서"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteObjective(obj.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 월별 실적 (Monthly Performance) */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                월별 실적 입력 ({targetYear}년)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium min-w-[120px] sticky left-0 bg-muted/50">목표항목</th>
                      <th className="p-2 text-center font-medium w-[60px]">목표</th>
                      {months.map((month) => (
                        <th key={month} className="p-2 text-center font-medium w-[70px]">
                          {month}
                        </th>
                      ))}
                      <th className="p-2 text-center font-medium w-[70px]">평균</th>
                      <th className="p-2 text-center font-medium w-[80px]">달성률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.map((obj) => {
                      const { rate, values } = calculateAchievementRate(obj.id);
                      const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "-";
                      const rateNum = parseFloat(rate);
                      const rateColor = isNaN(rateNum) ? "" : rateNum >= 100 ? "text-green-600" : rateNum >= 80 ? "text-yellow-600" : "text-red-600";

                      return (
                        <tr key={obj.id} className="border-b">
                          <td className="p-2 font-medium sticky left-0 bg-background">
                            {obj.name}
                            <span className="text-muted-foreground text-xs ml-1">({obj.unit})</span>
                          </td>
                          <td className="p-2 text-center bg-muted/30">{obj.targetValue}</td>
                          {months.map((_, monthIndex) => (
                            <td key={monthIndex} className="p-1">
                              <Input
                                type="number"
                                className="h-8 text-center text-sm p-1"
                                value={getMonthlyValue(obj.id, monthIndex + 1)}
                                onChange={(e) => updateMonthlyPerformance(obj.id, monthIndex + 1, e.target.value)}
                              />
                            </td>
                          ))}
                          <td className="p-2 text-center font-medium bg-muted/30">{avg}</td>
                          <td className={`p-2 text-center font-bold ${rateColor}`}>
                            {rate !== "-" ? `${rate}%` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Trend Table (text-based graph representation) */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">추이 그래프 (테이블)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium min-w-[120px]">목표항목</th>
                        {months.map((month) => (
                          <th key={month} className="p-2 text-center font-medium w-[60px]">
                            {month}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {objectives.map((obj) => {
                        const target = parseFloat(obj.targetValue);
                        const lowerIsBetter = obj.name.includes("PPM") || obj.name.includes("불량") || obj.name.includes("부적합");

                        return (
                          <tr key={obj.id} className="border-b">
                            <td className="p-2 font-medium">{obj.name}</td>
                            {months.map((_, monthIndex) => {
                              const val = getMonthlyValue(obj.id, monthIndex + 1);
                              const numVal = parseFloat(val);
                              if (!val || isNaN(numVal)) {
                                return (
                                  <td key={monthIndex} className="p-2 text-center">
                                    <div className="h-6 flex items-center justify-center text-muted-foreground">-</div>
                                  </td>
                                );
                              }

                              let isGood: boolean;
                              if (lowerIsBetter) {
                                isGood = numVal <= target;
                              } else {
                                isGood = numVal >= target;
                              }

                              return (
                                <td key={monthIndex} className="p-2 text-center">
                                  <div
                                    className={`h-6 rounded flex items-center justify-center text-xs font-medium ${
                                      isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {numVal}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 목표 달성 현황 (Achievement Status) */}
        <TabsContent value="achievement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                목표 달성 현황 ({targetYear}년)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Achievement Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-4">항목별 연간 달성률</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {objectives.map((obj) => {
                    const { rate, values } = calculateAchievementRate(obj.id);
                    const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : "-";
                    const rateNum = parseFloat(rate);
                    const isAchieved = !isNaN(rateNum) && rateNum >= 100;
                    const statusColor = isNaN(rateNum)
                      ? "border-gray-200"
                      : rateNum >= 100
                      ? "border-green-500 bg-green-50"
                      : rateNum >= 80
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-red-500 bg-red-50";

                    return (
                      <Card key={obj.id} className={`${statusColor} border-2`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{obj.name}</h4>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                isNaN(rateNum)
                                  ? "bg-gray-100 text-gray-600"
                                  : isAchieved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {isNaN(rateNum) ? "미입력" : isAchieved ? "달성" : "미달성"}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">목표:</span>
                              <span>
                                {obj.targetValue} {obj.unit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">실적(평균):</span>
                              <span>
                                {avg} {avg !== "-" ? obj.unit : ""}
                              </span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-muted-foreground">달성률:</span>
                              <span className={rateNum >= 100 ? "text-green-600" : rateNum >= 80 ? "text-yellow-600" : "text-red-600"}>
                                {rate !== "-" ? `${rate}%` : "-"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Underachieved Items Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4">미달성 항목 분석 및 개선 계획</h3>
                <div className="space-y-4">
                  {objectives.map((obj) => {
                    const { rate } = calculateAchievementRate(obj.id);
                    const rateNum = parseFloat(rate);
                    const isUnderAchieved = !isNaN(rateNum) && rateNum < 100;
                    const plan = getImprovementPlan(obj.id);

                    if (isNaN(rateNum)) return null;

                    return (
                      <Card key={obj.id} className={isUnderAchieved ? "border-red-200" : "border-green-200"}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span
                              className={`h-3 w-3 rounded-full ${isUnderAchieved ? "bg-red-500" : "bg-green-500"}`}
                            />
                            {obj.name}
                            <span className="text-sm font-normal text-muted-foreground">
                              (달성률: {rate}%)
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>미달성 원인 분석</Label>
                              <Textarea
                                value={plan?.analysis || ""}
                                onChange={(e) => updateImprovementPlan(obj.id, "analysis", e.target.value)}
                                placeholder={isUnderAchieved ? "미달성 원인을 분석하세요" : "목표 달성됨 - 필요시 분석 입력"}
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>개선 계획</Label>
                              <Textarea
                                value={plan?.plan || ""}
                                onChange={(e) => updateImprovementPlan(obj.id, "plan", e.target.value)}
                                placeholder={isUnderAchieved ? "개선 계획을 수립하세요" : "목표 달성됨 - 필요시 개선계획 입력"}
                                rows={3}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>완료 목표일</Label>
                              <Input
                                type="date"
                                value={plan?.targetDate || ""}
                                onChange={(e) => updateImprovementPlan(obj.id, "targetDate", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>담당자</Label>
                              <Input
                                value={plan?.responsible || ""}
                                onChange={(e) => updateImprovementPlan(obj.id, "responsible", e.target.value)}
                                placeholder="담당자명"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 년간 추이 (Year-over-year Trend) */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                년간 추이 (최근 5개년)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium min-w-[150px]" rowSpan={2}>
                        목표항목
                      </th>
                      {trendYears.map((year) => (
                        <th key={year} colSpan={2} className="p-3 text-center font-medium border-l">
                          {year}년
                        </th>
                      ))}
                    </tr>
                    <tr className="border-b bg-muted/30">
                      {trendYears.map((year) => (
                        <React.Fragment key={year}>
                          <th className="p-2 text-center text-sm font-medium border-l w-[80px]">목표</th>
                          <th className="p-2 text-center text-sm font-medium w-[80px]">실적</th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {objectives.map((obj) => (
                      <tr key={obj.id} className="border-b">
                        <td className="p-3 font-medium">
                          {obj.name}
                          <span className="text-muted-foreground text-xs ml-1">({obj.unit})</span>
                        </td>
                        {trendYears.map((year) => {
                          const trend = getYearlyTrend(year, obj.id);
                          const targetVal = trend?.targetValue || (year === parseInt(targetYear) ? obj.targetValue : "");
                          const actualVal = trend?.actualValue || "";
                          const target = parseFloat(targetVal);
                          const actual = parseFloat(actualVal);
                          const lowerIsBetter = obj.name.includes("PPM") || obj.name.includes("불량") || obj.name.includes("부적합");

                          let cellColor = "";
                          if (!isNaN(target) && !isNaN(actual)) {
                            const isGood = lowerIsBetter ? actual <= target : actual >= target;
                            cellColor = isGood ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700";
                          }

                          return (
                            <React.Fragment key={year}>
                              <td className="p-1 border-l">
                                <Input
                                  type="number"
                                  className="h-8 text-center text-sm"
                                  value={year === parseInt(targetYear) ? obj.targetValue : (trend?.targetValue || "")}
                                  onChange={(e) => updateYearlyTrend(year, obj.id, "targetValue", e.target.value)}
                                  disabled={year === parseInt(targetYear)}
                                />
                              </td>
                              <td className={`p-1 ${cellColor}`}>
                                <Input
                                  type="number"
                                  className={`h-8 text-center text-sm ${cellColor}`}
                                  value={trend?.actualValue || ""}
                                  onChange={(e) => updateYearlyTrend(year, obj.id, "actualValue", e.target.value)}
                                />
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Year-over-year Trend Visualization (Table-based) */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">년간 추이 비교</h3>
                <div className="space-y-4">
                  {objectives.map((obj) => {
                    const trendData = trendYears.map((year) => {
                      const trend = getYearlyTrend(year, obj.id);
                      return {
                        year,
                        target: trend?.targetValue || (year === parseInt(targetYear) ? obj.targetValue : ""),
                        actual: trend?.actualValue || "",
                      };
                    });

                    const hasData = trendData.some((d) => d.actual);

                    return (
                      <Card key={obj.id}>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3">
                            {obj.name} ({obj.unit})
                          </h4>
                          {hasData ? (
                            <div className="flex items-end gap-2 h-24">
                              {trendData.map(({ year, target, actual }) => {
                                const targetNum = parseFloat(target);
                                const actualNum = parseFloat(actual);
                                const maxVal = Math.max(
                                  ...trendData.map((d) => Math.max(parseFloat(d.target) || 0, parseFloat(d.actual) || 0))
                                );
                                const height = maxVal > 0 && !isNaN(actualNum) ? (actualNum / maxVal) * 80 : 0;
                                const lowerIsBetter = obj.name.includes("PPM") || obj.name.includes("불량") || obj.name.includes("부적합");
                                const isGood = !isNaN(targetNum) && !isNaN(actualNum) && (lowerIsBetter ? actualNum <= targetNum : actualNum >= targetNum);

                                return (
                                  <div key={year} className="flex-1 flex flex-col items-center">
                                    <div className="flex-1 w-full flex items-end justify-center">
                                      {actual ? (
                                        <div
                                          className={`w-8 rounded-t ${isGood ? "bg-green-500" : "bg-red-500"}`}
                                          style={{ height: `${height}px` }}
                                          title={`실적: ${actual}`}
                                        />
                                      ) : (
                                        <div className="w-8 h-4 bg-gray-200 rounded" />
                                      )}
                                    </div>
                                    <div className="text-xs mt-1 text-center">
                                      <div className="font-medium">{year}</div>
                                      <div className="text-muted-foreground">{actual || "-"}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">데이터를 입력해주세요.</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
