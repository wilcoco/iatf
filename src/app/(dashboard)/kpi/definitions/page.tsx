"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, TrendingUp, BarChart3, Calendar, FileText } from "lucide-react";

interface KpiDefinition {
  id: number;
  kpiName: string;
  formula: string;
  targetValue: number;
  frequency: string;
  responsibleDept: string;
  unit: string;
  isActive: boolean;
}

interface MonthlyData {
  kpiId: number;
  kpiName: string;
  values: number[];
}

interface AchievementData {
  kpiId: number;
  kpiName: string;
  targetValue: number;
  actualValue: number;
  achievementRate: number;
  status: "achieved" | "partial" | "failed";
}

interface TrendData {
  kpiId: number;
  kpiName: string;
  year2024: number;
  year2025: number;
  changeRate: number;
}

// Sample data based on Excel structure
const sampleKpis: KpiDefinition[] = [
  {
    id: 1,
    kpiName: "매출액",
    formula: "총 매출 합계",
    targetValue: 100000000,
    frequency: "monthly",
    responsibleDept: "영업부",
    unit: "원",
    isActive: true,
  },
  {
    id: 2,
    kpiName: "영업이익률",
    formula: "(영업이익/매출액)*100",
    targetValue: 15,
    frequency: "monthly",
    responsibleDept: "재무부",
    unit: "%",
    isActive: true,
  },
  {
    id: 3,
    kpiName: "고객만족도",
    formula: "설문조사 평균점수",
    targetValue: 90,
    frequency: "quarterly",
    responsibleDept: "고객서비스부",
    unit: "점",
    isActive: true,
  },
  {
    id: 4,
    kpiName: "신규고객수",
    formula: "월간 신규 등록 고객 수",
    targetValue: 500,
    frequency: "monthly",
    responsibleDept: "마케팅부",
    unit: "명",
    isActive: true,
  },
  {
    id: 5,
    kpiName: "생산효율성",
    formula: "(실제생산량/목표생산량)*100",
    targetValue: 95,
    frequency: "weekly",
    responsibleDept: "생산부",
    unit: "%",
    isActive: true,
  },
];

const sampleMonthlyData: MonthlyData[] = [
  { kpiId: 1, kpiName: "매출액", values: [8500, 9200, 9800, 10200, 10500, 11000, 10800, 11200, 11500, 11800, 12000, 12500] },
  { kpiId: 2, kpiName: "영업이익률", values: [12.5, 13.2, 13.8, 14.1, 14.5, 14.8, 15.0, 15.2, 15.5, 15.3, 15.8, 16.0] },
  { kpiId: 3, kpiName: "고객만족도", values: [85, 0, 0, 87, 0, 0, 89, 0, 0, 91, 0, 0] },
  { kpiId: 4, kpiName: "신규고객수", values: [420, 450, 480, 510, 530, 550, 520, 540, 560, 580, 590, 620] },
  { kpiId: 5, kpiName: "생산효율성", values: [92, 93, 94, 94.5, 95, 95.5, 96, 95.8, 96.2, 96.5, 97, 97.5] },
];

const sampleAchievementData: AchievementData[] = [
  { kpiId: 1, kpiName: "매출액", targetValue: 100000000, actualValue: 129000000, achievementRate: 129, status: "achieved" },
  { kpiId: 2, kpiName: "영업이익률", targetValue: 15, actualValue: 14.6, achievementRate: 97.3, status: "partial" },
  { kpiId: 3, kpiName: "고객만족도", targetValue: 90, actualValue: 88, achievementRate: 97.8, status: "partial" },
  { kpiId: 4, kpiName: "신규고객수", targetValue: 500, actualValue: 529, achievementRate: 105.8, status: "achieved" },
  { kpiId: 5, kpiName: "생산효율성", targetValue: 95, actualValue: 95.3, achievementRate: 100.3, status: "achieved" },
];

const sampleTrendData: TrendData[] = [
  { kpiId: 1, kpiName: "매출액", year2024: 110000000, year2025: 129000000, changeRate: 17.3 },
  { kpiId: 2, kpiName: "영업이익률", year2024: 13.5, year2025: 14.6, changeRate: 8.1 },
  { kpiId: 3, kpiName: "고객만족도", year2024: 85, year2025: 88, changeRate: 3.5 },
  { kpiId: 4, kpiName: "신규고객수", year2024: 480, year2025: 529, changeRate: 10.2 },
  { kpiId: 5, kpiName: "생산효율성", year2024: 93.2, year2025: 95.3, changeRate: 2.3 },
];

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default function KpiDefinitionsPage() {
  const [activeTab, setActiveTab] = useState("definitions");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [kpis, setKpis] = useState<KpiDefinition[]>(sampleKpis);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(sampleMonthlyData);
  const [achievementData] = useState<AchievementData[]>(sampleAchievementData);
  const [trendData] = useState<TrendData[]>(sampleTrendData);
  const [loading, setLoading] = useState(false);

  const frequencyLabels: Record<string, string> = {
    daily: "일간",
    weekly: "주간",
    monthly: "월간",
    quarterly: "분기",
    yearly: "연간",
  };

  const handleMonthlyValueChange = (kpiIndex: number, monthIndex: number, value: string) => {
    const newData = [...monthlyData];
    newData[kpiIndex].values[monthIndex] = parseFloat(value) || 0;
    setMonthlyData(newData);
  };

  const getStatusBadge = (status: "achieved" | "partial" | "failed") => {
    switch (status) {
      case "achieved":
        return <Badge variant="success">달성</Badge>;
      case "partial":
        return <Badge variant="warning">부분달성</Badge>;
      case "failed":
        return <Badge variant="destructive">미달성</Badge>;
    }
  };

  const getChangeRateColor = (rate: number) => {
    if (rate > 0) return "text-green-600";
    if (rate < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{selectedYear}년 성과지표 관리표(KPI)</h1>
          <p className="text-muted-foreground">핵심성과지표 정의, 실적 입력 및 분석</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="연도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024년</SelectItem>
              <SelectItem value="2025">2025년</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            KPI 등록
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="definitions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            성과지표 정의
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            월별 실적 입력
          </TabsTrigger>
          <TabsTrigger value="achievement" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            달성 현황
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            추이 분석
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 성과지표 정의 */}
        <TabsContent value="definitions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                KPI 정의 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>로딩 중...</p>
              ) : kpis.length === 0 ? (
                <p className="text-muted-foreground">등록된 KPI가 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No.</TableHead>
                      <TableHead>지표명</TableHead>
                      <TableHead>산출식</TableHead>
                      <TableHead>목표값</TableHead>
                      <TableHead>단위</TableHead>
                      <TableHead>측정주기</TableHead>
                      <TableHead>담당부서</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpis.map((kpi, index) => (
                      <TableRow key={kpi.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{kpi.kpiName}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{kpi.formula}</TableCell>
                        <TableCell>{kpi.targetValue.toLocaleString()}</TableCell>
                        <TableCell>{kpi.unit}</TableCell>
                        <TableCell>{frequencyLabels[kpi.frequency] || kpi.frequency}</TableCell>
                        <TableCell>{kpi.responsibleDept}</TableCell>
                        <TableCell>
                          <Badge variant={kpi.isActive ? "success" : "secondary"}>
                            {kpi.isActive ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 월별 실적 입력 */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedYear}년 월별 실적 입력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 min-w-[120px]">지표명</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[80px]">
                          {month}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((data, kpiIndex) => (
                      <TableRow key={data.kpiId}>
                        <TableCell className="sticky left-0 bg-background z-10 font-medium">
                          {data.kpiName}
                        </TableCell>
                        {data.values.map((value, monthIndex) => (
                          <TableCell key={monthIndex} className="p-1">
                            <Input
                              type="number"
                              value={value || ""}
                              onChange={(e) => handleMonthlyValueChange(kpiIndex, monthIndex, e.target.value)}
                              className="w-[70px] h-8 text-center text-sm"
                              placeholder="-"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  실적 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 달성 현황 */}
        <TabsContent value="achievement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {selectedYear}년 KPI 달성 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>지표명</TableHead>
                    <TableHead className="text-right">목표값</TableHead>
                    <TableHead className="text-right">실적값</TableHead>
                    <TableHead className="text-right">달성률</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievementData.map((data, index) => (
                    <TableRow key={data.kpiId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{data.kpiName}</TableCell>
                      <TableCell className="text-right">{data.targetValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{data.actualValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={data.achievementRate >= 100 ? "text-green-600 font-semibold" : "text-amber-600"}>
                          {data.achievementRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(data.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {achievementData.filter((d) => d.status === "achieved").length}
                      </p>
                      <p className="text-sm text-muted-foreground">목표 달성</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {achievementData.filter((d) => d.status === "partial").length}
                      </p>
                      <p className="text-sm text-muted-foreground">부분 달성</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {achievementData.filter((d) => d.status === "failed").length}
                      </p>
                      <p className="text-sm text-muted-foreground">미달성</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 추이 분석 */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                연도별 추이 분석 (2024년 vs 2025년)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>지표명</TableHead>
                    <TableHead className="text-right">2024년 실적</TableHead>
                    <TableHead className="text-right">2025년 실적</TableHead>
                    <TableHead className="text-right">변동률</TableHead>
                    <TableHead className="text-center">추세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendData.map((data, index) => (
                    <TableRow key={data.kpiId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{data.kpiName}</TableCell>
                      <TableCell className="text-right">{data.year2024.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{data.year2025.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-semibold ${getChangeRateColor(data.changeRate)}`}>
                        {data.changeRate > 0 ? "+" : ""}
                        {data.changeRate.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        {data.changeRate > 0 ? (
                          <Badge variant="success">상승</Badge>
                        ) : data.changeRate < 0 ? (
                          <Badge variant="destructive">하락</Badge>
                        ) : (
                          <Badge variant="secondary">유지</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Trend Summary */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {trendData.filter((d) => d.changeRate > 0).length}개
                      </p>
                      <p className="text-sm text-muted-foreground">개선 지표</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        평균 상승률:{" "}
                        {(
                          trendData.filter((d) => d.changeRate > 0).reduce((sum, d) => sum + d.changeRate, 0) /
                          trendData.filter((d) => d.changeRate > 0).length
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {trendData.filter((d) => d.changeRate < 0).length}개
                      </p>
                      <p className="text-sm text-muted-foreground">악화 지표</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {trendData.filter((d) => d.changeRate < 0).length === 0
                          ? "없음"
                          : `평균 하락률: ${(
                              trendData.filter((d) => d.changeRate < 0).reduce((sum, d) => sum + d.changeRate, 0) /
                              trendData.filter((d) => d.changeRate < 0).length
                            ).toFixed(1)}%`}
                      </p>
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
