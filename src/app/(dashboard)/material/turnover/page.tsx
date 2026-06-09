"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Types
interface MonthlyTurnoverData {
  month: string;
  averageInventory: number;
  usageAmount: number;
  turnoverRate: number;
}

interface CategoryTurnoverData {
  category: string;
  monthlyData: MonthlyTurnoverData[];
  totalAverageInventory: number;
  totalUsageAmount: number;
  totalTurnoverRate: number;
  turnoverDays: number;
}

interface YearlyComparison {
  year: number;
  category: string;
  totalUsageAmount: number;
  averageInventory: number;
  turnoverRate: number;
  turnoverDays: number;
}

// Sample data based on Excel structure (25년 재고회전율)
const months = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월"
];

const initialCategoryData: CategoryTurnoverData[] = [
  {
    category: "원재료",
    monthlyData: [
      { month: "1월", averageInventory: 183678535, usageAmount: 2080055643, turnoverRate: 0 },
      { month: "2월", averageInventory: 183678535, usageAmount: 2147576045, turnoverRate: 0 },
      { month: "3월", averageInventory: 183678535, usageAmount: 2319783901, turnoverRate: 0 },
      { month: "4월", averageInventory: 183678535, usageAmount: 2502538817, turnoverRate: 0 },
      { month: "5월", averageInventory: 183678535, usageAmount: 2318536446, turnoverRate: 0 },
      { month: "6월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "7월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "8월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "9월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "10월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "11월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "12월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
    ],
    totalAverageInventory: 918392677,
    totalUsageAmount: 11368490852,
    totalTurnoverRate: 0,
    turnoverDays: 0,
  },
  {
    category: "부재료",
    monthlyData: [
      { month: "1월", averageInventory: 45486188, usageAmount: 1091793616, turnoverRate: 0 },
      { month: "2월", averageInventory: 45486188, usageAmount: 1107359548, turnoverRate: 0 },
      { month: "3월", averageInventory: 45486188, usageAmount: 1234971330, turnoverRate: 0 },
      { month: "4월", averageInventory: 45486188, usageAmount: 1193515096, turnoverRate: 0 },
      { month: "5월", averageInventory: 45486188, usageAmount: 1077383301, turnoverRate: 0 },
      { month: "6월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "7월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "8월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "9월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "10월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "11월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "12월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
    ],
    totalAverageInventory: 227430939,
    totalUsageAmount: 5705022891,
    totalTurnoverRate: 0,
    turnoverDays: 0,
  },
  {
    category: "조립부품",
    monthlyData: [
      { month: "1월", averageInventory: 77696379, usageAmount: 14261657147, turnoverRate: 0 },
      { month: "2월", averageInventory: 77696379, usageAmount: 18192856361, turnoverRate: 0 },
      { month: "3월", averageInventory: 77696379, usageAmount: 18561072626, turnoverRate: 0 },
      { month: "4월", averageInventory: 77696379, usageAmount: 19744059066, turnoverRate: 0 },
      { month: "5월", averageInventory: 77696379, usageAmount: 14778543516, turnoverRate: 0 },
      { month: "6월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "7월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "8월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "9월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "10월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "11월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
      { month: "12월", averageInventory: 0, usageAmount: 0, turnoverRate: 0 },
    ],
    totalAverageInventory: 388481893,
    totalUsageAmount: 85538188716,
    totalTurnoverRate: 0,
    turnoverDays: 0,
  },
];

// Historical yearly data for comparison
const yearlyComparisonData: YearlyComparison[] = [
  { year: 2023, category: "원재료", totalUsageAmount: 22500000000, averageInventory: 1800000000, turnoverRate: 1250, turnoverDays: 29 },
  { year: 2023, category: "부재료", totalUsageAmount: 11000000000, averageInventory: 450000000, turnoverRate: 2444, turnoverDays: 15 },
  { year: 2023, category: "조립부품", totalUsageAmount: 165000000000, averageInventory: 750000000, turnoverRate: 22000, turnoverDays: 2 },
  { year: 2024, category: "원재료", totalUsageAmount: 24000000000, averageInventory: 1900000000, turnoverRate: 1263, turnoverDays: 29 },
  { year: 2024, category: "부재료", totalUsageAmount: 12000000000, averageInventory: 480000000, turnoverRate: 2500, turnoverDays: 15 },
  { year: 2024, category: "조립부품", totalUsageAmount: 180000000000, averageInventory: 800000000, turnoverRate: 22500, turnoverDays: 2 },
  { year: 2025, category: "원재료", totalUsageAmount: 11368490852, averageInventory: 918392677, turnoverRate: 1238, turnoverDays: 29 },
  { year: 2025, category: "부재료", totalUsageAmount: 5705022891, averageInventory: 227430939, turnoverRate: 2508, turnoverDays: 15 },
  { year: 2025, category: "조립부품", totalUsageAmount: 85538188716, averageInventory: 388481893, turnoverRate: 22017, turnoverDays: 2 },
];

export default function TurnoverPage() {
  const [activeTab, setActiveTab] = useState("status");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [categoryData, setCategoryData] = useState<CategoryTurnoverData[]>(initialCategoryData);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState({
    category: "",
    month: "",
    averageInventory: "",
    usageAmount: "",
  });

  // Calculate turnover rates for all data
  const calculatedCategoryData = useMemo(() => {
    return categoryData.map((cat) => {
      const updatedMonthlyData = cat.monthlyData.map((m) => ({
        ...m,
        turnoverRate: m.averageInventory > 0 ? (m.usageAmount / m.averageInventory) * 100 : 0,
      }));

      const totalAvg = updatedMonthlyData.reduce((sum, m) => sum + m.averageInventory, 0);
      const totalUsage = updatedMonthlyData.reduce((sum, m) => sum + m.usageAmount, 0);
      const totalRate = totalAvg > 0 ? (totalUsage / totalAvg) * 100 : 0;
      const days = totalRate > 0 ? 365 / (totalRate / 100) : 0;

      return {
        ...cat,
        monthlyData: updatedMonthlyData,
        totalAverageInventory: totalAvg,
        totalUsageAmount: totalUsage,
        totalTurnoverRate: totalRate,
        turnoverDays: days,
      };
    });
  }, [categoryData]);

  // Calculate overall totals
  const overallTotals = useMemo(() => {
    const monthlyTotals = months.map((month, idx) => {
      const avgInv = calculatedCategoryData.reduce(
        (sum, cat) => sum + cat.monthlyData[idx].averageInventory,
        0
      );
      const usage = calculatedCategoryData.reduce(
        (sum, cat) => sum + cat.monthlyData[idx].usageAmount,
        0
      );
      return {
        month,
        averageInventory: avgInv,
        usageAmount: usage,
        turnoverRate: avgInv > 0 ? (usage / avgInv) * 100 : 0,
      };
    });

    const totalAvg = monthlyTotals.reduce((sum, m) => sum + m.averageInventory, 0);
    const totalUsage = monthlyTotals.reduce((sum, m) => sum + m.usageAmount, 0);
    const totalRate = totalAvg > 0 ? (totalUsage / totalAvg) * 100 : 0;

    return {
      monthlyTotals,
      totalAverageInventory: totalAvg,
      totalUsageAmount: totalUsage,
      totalTurnoverRate: totalRate,
      turnoverDays: totalRate > 0 ? 365 / (totalRate / 100) : 0,
    };
  }, [calculatedCategoryData]);

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryIndex = categoryData.findIndex((c) => c.category === entryForm.category);
    if (categoryIndex === -1) return;

    const monthIndex = months.findIndex((m) => m === entryForm.month);
    if (monthIndex === -1) return;

    const updatedData = [...categoryData];
    updatedData[categoryIndex].monthlyData[monthIndex] = {
      month: entryForm.month,
      averageInventory: Number(entryForm.averageInventory),
      usageAmount: Number(entryForm.usageAmount),
      turnoverRate: 0,
    };

    setCategoryData(updatedData);
    setShowEntryForm(false);
    setEntryForm({ category: "", month: "", averageInventory: "", usageAmount: "" });
    alert("데이터가 저장되었습니다.");
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return "-";
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  };

  const formatPercent = (value: number) => {
    if (value === 0) return "-";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">자재 재고회전율</h1>
          <p className="text-muted-foreground">
            (주)캠스 자재 재고회전율 보고 ({selectedYear}년 1월~{selectedYear}년 12월)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023년</SelectItem>
              <SelectItem value="2024">2024년</SelectItem>
              <SelectItem value="2025">2025년</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">연간 사용금액</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overallTotals.totalUsageAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {overallTotals.totalUsageAmount.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균재고금액</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overallTotals.totalAverageInventory)}</div>
            <p className="text-xs text-muted-foreground">
              {overallTotals.totalAverageInventory.toLocaleString()}원
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재고회전율</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(overallTotals.totalTurnoverRate)}</div>
            <p className="text-xs text-muted-foreground">
              사용금액 / 평균재고 x 100
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재고회전일수</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallTotals.turnoverDays > 0 ? `${overallTotals.turnoverDays.toFixed(1)}일` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              365 / 재고회전율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">재고회전율 현황</TabsTrigger>
          <TabsTrigger value="trend">월별 추이</TabsTrigger>
          <TabsTrigger value="category">품목별 현황</TabsTrigger>
          <TabsTrigger value="comparison">년간 비교</TabsTrigger>
        </TabsList>

        {/* Tab 1: Turnover Status */}
        <TabsContent value="status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">재고회전율 현황</h2>
                <p className="text-sm text-muted-foreground">
                  산출근거: 자재 재고회전율(%) = (사용금액 / 평균재고금액) x 100
                </p>
              </div>
              <Button onClick={() => setShowEntryForm(!showEntryForm)}>
                <Plus className="mr-2 h-4 w-4" />
                데이터 입력
              </Button>
            </div>

            {showEntryForm && (
              <Card>
                <CardHeader>
                  <CardTitle>월별 데이터 입력</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEntrySubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>품목분류 *</Label>
                        <Select
                          value={entryForm.category}
                          onValueChange={(v) => setEntryForm({ ...entryForm, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="원재료">원재료</SelectItem>
                            <SelectItem value="부재료">부재료</SelectItem>
                            <SelectItem value="조립부품">조립부품</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>월 *</Label>
                        <Select
                          value={entryForm.month}
                          onValueChange={(v) => setEntryForm({ ...entryForm, month: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>평균재고금액 *</Label>
                        <Input
                          type="number"
                          value={entryForm.averageInventory}
                          onChange={(e) =>
                            setEntryForm({ ...entryForm, averageInventory: e.target.value })
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>사용금액 *</Label>
                        <Input
                          type="number"
                          value={entryForm.usageAmount}
                          onChange={(e) =>
                            setEntryForm({ ...entryForm, usageAmount: e.target.value })
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowEntryForm(false)}
                      >
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  월별 재고회전율 데이터 (단위: 원, %)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background">품목</TableHead>
                        <TableHead className="sticky left-[80px] bg-background">구분</TableHead>
                        {months.map((m) => (
                          <TableHead key={m} className="text-right min-w-[100px]">
                            {selectedYear}년 {m}
                          </TableHead>
                        ))}
                        <TableHead className="text-right min-w-[120px] font-bold">합계</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculatedCategoryData.map((cat) => (
                        <>
                          <TableRow key={`${cat.category}-avg`}>
                            <TableCell
                              rowSpan={2}
                              className="sticky left-0 bg-background font-medium"
                            >
                              {cat.category}
                            </TableCell>
                            <TableCell className="sticky left-[80px] bg-background text-sm text-muted-foreground">
                              평균재고금액
                            </TableCell>
                            {cat.monthlyData.map((m, idx) => (
                              <TableCell key={idx} className="text-right">
                                {formatCurrency(m.averageInventory)}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-medium">
                              {formatCurrency(cat.totalAverageInventory)}
                            </TableCell>
                          </TableRow>
                          <TableRow key={`${cat.category}-usage`}>
                            <TableCell className="sticky left-[80px] bg-background text-sm text-muted-foreground">
                              사용금액
                            </TableCell>
                            {cat.monthlyData.map((m, idx) => (
                              <TableCell key={idx} className="text-right">
                                {formatCurrency(m.usageAmount)}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-medium">
                              {formatCurrency(cat.totalUsageAmount)}
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                      {/* Total rows */}
                      <TableRow className="bg-muted/50">
                        <TableCell rowSpan={2} className="sticky left-0 bg-muted/50 font-bold">
                          합계
                        </TableCell>
                        <TableCell className="sticky left-[80px] bg-muted/50 text-sm">
                          평균재고금액
                        </TableCell>
                        {overallTotals.monthlyTotals.map((m, idx) => (
                          <TableCell key={idx} className="text-right font-medium">
                            {formatCurrency(m.averageInventory)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-bold">
                          {formatCurrency(overallTotals.totalAverageInventory)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50">
                        <TableCell className="sticky left-[80px] bg-muted/50 text-sm">
                          사용금액
                        </TableCell>
                        {overallTotals.monthlyTotals.map((m, idx) => (
                          <TableCell key={idx} className="text-right font-medium">
                            {formatCurrency(m.usageAmount)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-bold">
                          {formatCurrency(overallTotals.totalUsageAmount)}
                        </TableCell>
                      </TableRow>
                      {/* Turnover rate row */}
                      <TableRow className="bg-primary/10">
                        <TableCell colSpan={2} className="sticky left-0 bg-primary/10 font-bold">
                          자재 재고회전율
                        </TableCell>
                        {overallTotals.monthlyTotals.map((m, idx) => (
                          <TableCell key={idx} className="text-right font-bold text-primary">
                            {formatPercent(m.turnoverRate)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-bold text-primary">
                          {formatPercent(overallTotals.totalTurnoverRate)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Monthly Trend */}
        <TabsContent value="trend">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">월별 추이</h2>
              <p className="text-sm text-muted-foreground">12개월간 재고회전율 추이 분석</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    월별 사용금액 추이
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overallTotals.monthlyTotals.map((m, idx) => {
                      const maxUsage = Math.max(
                        ...overallTotals.monthlyTotals.map((t) => t.usageAmount)
                      );
                      const percentage = maxUsage > 0 ? (m.usageAmount / maxUsage) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{m.month}</span>
                            <span className="font-medium">{formatCurrency(m.usageAmount)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    월별 회전율 추이
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overallTotals.monthlyTotals.map((m, idx) => {
                      const maxRate = Math.max(
                        ...overallTotals.monthlyTotals.filter((t) => t.turnoverRate > 0).map((t) => t.turnoverRate)
                      );
                      const percentage = maxRate > 0 ? (m.turnoverRate / maxRate) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{m.month}</span>
                            <span className="font-medium">{formatPercent(m.turnoverRate)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>월별 상세 데이터</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-right">평균재고금액</TableHead>
                      <TableHead className="text-right">사용금액</TableHead>
                      <TableHead className="text-right">회전율(%)</TableHead>
                      <TableHead className="text-right">전월대비</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overallTotals.monthlyTotals.map((m, idx) => {
                      const prevRate =
                        idx > 0 ? overallTotals.monthlyTotals[idx - 1].turnoverRate : 0;
                      const diff = m.turnoverRate - prevRate;
                      const showDiff = idx > 0 && m.turnoverRate > 0 && prevRate > 0;

                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{m.month}</TableCell>
                          <TableCell className="text-right">
                            {m.averageInventory > 0
                              ? m.averageInventory.toLocaleString()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {m.usageAmount > 0 ? m.usageAmount.toLocaleString() : "-"}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatPercent(m.turnoverRate)}
                          </TableCell>
                          <TableCell className="text-right">
                            {showDiff ? (
                              <div
                                className={`flex items-center justify-end gap-1 ${
                                  diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""
                                }`}
                              >
                                {diff > 0 ? (
                                  <ArrowUpRight className="h-4 w-4" />
                                ) : diff < 0 ? (
                                  <ArrowDownRight className="h-4 w-4" />
                                ) : null}
                                {diff > 0 ? "+" : ""}
                                {diff.toFixed(1)}%
                              </div>
                            ) : (
                              "-"
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

        {/* Tab 3: By Category */}
        <TabsContent value="category">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">품목별 현황</h2>
              <p className="text-sm text-muted-foreground">
                품목 분류별 재고회전율 현황 (원재료, 부재료, 조립부품)
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {calculatedCategoryData.map((cat) => (
                <Card key={cat.category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{cat.category}</span>
                      <Badge variant="outline">{formatPercent(cat.totalTurnoverRate)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">총 사용금액</span>
                        <span className="font-medium">{formatCurrency(cat.totalUsageAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">평균재고금액</span>
                        <span className="font-medium">
                          {formatCurrency(cat.totalAverageInventory)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">재고회전율</span>
                        <span className="font-bold text-primary">
                          {formatPercent(cat.totalTurnoverRate)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">재고회전일수</span>
                        <span className="font-medium">
                          {cat.turnoverDays > 0 ? `${cat.turnoverDays.toFixed(1)}일` : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">월별 추이</p>
                      <div className="flex gap-1">
                        {cat.monthlyData.map((m, idx) => {
                          const maxRate = Math.max(...cat.monthlyData.map((d) => d.turnoverRate));
                          const height = maxRate > 0 ? (m.turnoverRate / maxRate) * 32 : 0;
                          return (
                            <div
                              key={idx}
                              className="flex-1 bg-muted rounded-t"
                              style={{
                                height: m.turnoverRate > 0 ? `${Math.max(height, 4)}px` : "4px",
                                backgroundColor:
                                  m.turnoverRate > 0
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--muted))",
                              }}
                              title={`${m.month}: ${formatPercent(m.turnoverRate)}`}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1월</span>
                        <span>12월</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>품목별 상세 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>품목분류</TableHead>
                      <TableHead className="text-right">총 사용금액</TableHead>
                      <TableHead className="text-right">평균재고금액</TableHead>
                      <TableHead className="text-right">재고회전율(%)</TableHead>
                      <TableHead className="text-right">재고회전일수</TableHead>
                      <TableHead className="text-right">구성비</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculatedCategoryData.map((cat) => {
                      const ratio =
                        overallTotals.totalUsageAmount > 0
                          ? (cat.totalUsageAmount / overallTotals.totalUsageAmount) * 100
                          : 0;
                      return (
                        <TableRow key={cat.category}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">{cat.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {cat.totalUsageAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {cat.totalAverageInventory.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            {formatPercent(cat.totalTurnoverRate)}
                          </TableCell>
                          <TableCell className="text-right">
                            {cat.turnoverDays > 0 ? `${cat.turnoverDays.toFixed(1)}일` : "-"}
                          </TableCell>
                          <TableCell className="text-right">{ratio.toFixed(1)}%</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell>합계</TableCell>
                      <TableCell className="text-right">
                        {overallTotals.totalUsageAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {overallTotals.totalAverageInventory.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-primary">
                        {formatPercent(overallTotals.totalTurnoverRate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {overallTotals.turnoverDays > 0
                          ? `${overallTotals.turnoverDays.toFixed(1)}일`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Year-over-Year Comparison */}
        <TabsContent value="comparison">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">년간 비교</h2>
              <p className="text-sm text-muted-foreground">연도별 재고회전율 비교 분석</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {["2023", "2024", "2025"].map((year) => {
                const yearData = yearlyComparisonData.filter((d) => d.year === Number(year));
                const totalUsage = yearData.reduce((sum, d) => sum + d.totalUsageAmount, 0);
                const totalAvg = yearData.reduce((sum, d) => sum + d.averageInventory, 0);
                const avgRate = totalAvg > 0 ? (totalUsage / totalAvg) * 100 : 0;

                return (
                  <Card key={year}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{year}년</span>
                        <Badge
                          variant={
                            year === selectedYear ? "default" : "secondary"
                          }
                        >
                          {year === selectedYear ? "현재" : "과거"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-4">
                        <div className="text-4xl font-bold text-primary">
                          {avgRate.toFixed(0)}%
                        </div>
                        <p className="text-sm text-muted-foreground">평균 재고회전율</p>
                      </div>
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">총 사용금액</span>
                          <span className="font-medium">{formatCurrency(totalUsage)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">평균재고금액</span>
                          <span className="font-medium">{formatCurrency(totalAvg)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>연도별 품목 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>연도</TableHead>
                      <TableHead>품목분류</TableHead>
                      <TableHead className="text-right">총 사용금액</TableHead>
                      <TableHead className="text-right">평균재고금액</TableHead>
                      <TableHead className="text-right">재고회전율(%)</TableHead>
                      <TableHead className="text-right">재고회전일수</TableHead>
                      <TableHead className="text-right">전년대비</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyComparisonData.map((data, idx) => {
                      const prevYearData = yearlyComparisonData.find(
                        (d) => d.year === data.year - 1 && d.category === data.category
                      );
                      const diff = prevYearData
                        ? data.turnoverRate - prevYearData.turnoverRate
                        : 0;
                      const showDiff = prevYearData !== undefined;

                      return (
                        <TableRow
                          key={idx}
                          className={
                            data.year === Number(selectedYear) ? "bg-primary/5" : ""
                          }
                        >
                          <TableCell className="font-medium">{data.year}년</TableCell>
                          <TableCell>
                            <Badge variant="outline">{data.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {data.totalUsageAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {data.averageInventory.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {data.turnoverRate.toFixed(0)}%
                          </TableCell>
                          <TableCell className="text-right">{data.turnoverDays}일</TableCell>
                          <TableCell className="text-right">
                            {showDiff ? (
                              <div
                                className={`flex items-center justify-end gap-1 ${
                                  diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""
                                }`}
                              >
                                {diff > 0 ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : diff < 0 ? (
                                  <TrendingDown className="h-4 w-4" />
                                ) : null}
                                {diff > 0 ? "+" : ""}
                                {diff.toFixed(0)}%
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>연도별 추이 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {["원재료", "부재료", "조립부품"].map((category) => {
                    const catData = yearlyComparisonData.filter((d) => d.category === category);
                    return (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium">{category}</h4>
                        <div className="space-y-1">
                          {catData.map((d) => {
                            const maxRate = Math.max(...catData.map((c) => c.turnoverRate));
                            const width = maxRate > 0 ? (d.turnoverRate / maxRate) * 100 : 0;
                            return (
                              <div key={d.year} className="flex items-center gap-2">
                                <span className="text-sm w-12">{d.year}</span>
                                <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${width}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-16 text-right">
                                  {d.turnoverRate.toFixed(0)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
