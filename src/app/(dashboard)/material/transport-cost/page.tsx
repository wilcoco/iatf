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
import {
  Truck,
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

// Types
interface TransportPlan {
  id: number;
  year: number;
  month: number;
  carrierId: number;
  carrierName: string;
  plannedAmount: number;
}

interface TransportActual {
  id: number;
  year: number;
  month: number;
  carrierId: number;
  carrierName: string;
  actualAmount: number;
}

interface Carrier {
  id: number;
  name: string;
}

// Sample carriers
const carriers: Carrier[] = [
  { id: 1, name: "대한운송(주)" },
  { id: 2, name: "신속물류" },
  { id: 3, name: "한국택배" },
  { id: 4, name: "고려운수" },
  { id: 5, name: "삼성로지스틱" },
];

// Sample plan data for 2025
const initialPlans: TransportPlan[] = [
  { id: 1, year: 2025, month: 1, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 12000000 },
  { id: 2, year: 2025, month: 1, carrierId: 2, carrierName: "신속물류", plannedAmount: 8000000 },
  { id: 3, year: 2025, month: 1, carrierId: 3, carrierName: "한국택배", plannedAmount: 5000000 },
  { id: 4, year: 2025, month: 2, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 12500000 },
  { id: 5, year: 2025, month: 2, carrierId: 2, carrierName: "신속물류", plannedAmount: 8500000 },
  { id: 6, year: 2025, month: 2, carrierId: 3, carrierName: "한국택배", plannedAmount: 5200000 },
  { id: 7, year: 2025, month: 3, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 13000000 },
  { id: 8, year: 2025, month: 3, carrierId: 2, carrierName: "신속물류", plannedAmount: 9000000 },
  { id: 9, year: 2025, month: 3, carrierId: 3, carrierName: "한국택배", plannedAmount: 5500000 },
  { id: 10, year: 2025, month: 4, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 12800000 },
  { id: 11, year: 2025, month: 4, carrierId: 2, carrierName: "신속물류", plannedAmount: 8800000 },
  { id: 12, year: 2025, month: 4, carrierId: 3, carrierName: "한국택배", plannedAmount: 5300000 },
  { id: 13, year: 2025, month: 5, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 13200000 },
  { id: 14, year: 2025, month: 5, carrierId: 2, carrierName: "신속물류", plannedAmount: 9200000 },
  { id: 15, year: 2025, month: 5, carrierId: 3, carrierName: "한국택배", plannedAmount: 5600000 },
  { id: 16, year: 2025, month: 6, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 14000000 },
  { id: 17, year: 2025, month: 6, carrierId: 2, carrierName: "신속물류", plannedAmount: 9500000 },
  { id: 18, year: 2025, month: 6, carrierId: 3, carrierName: "한국택배", plannedAmount: 5800000 },
  // Add more months...
  { id: 19, year: 2025, month: 7, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 13500000 },
  { id: 20, year: 2025, month: 7, carrierId: 2, carrierName: "신속물류", plannedAmount: 9000000 },
  { id: 21, year: 2025, month: 7, carrierId: 3, carrierName: "한국택배", plannedAmount: 5400000 },
  { id: 22, year: 2025, month: 8, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 14200000 },
  { id: 23, year: 2025, month: 8, carrierId: 2, carrierName: "신속물류", plannedAmount: 9800000 },
  { id: 24, year: 2025, month: 8, carrierId: 3, carrierName: "한국택배", plannedAmount: 6000000 },
  { id: 25, year: 2025, month: 9, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 13800000 },
  { id: 26, year: 2025, month: 9, carrierId: 2, carrierName: "신속물류", plannedAmount: 9300000 },
  { id: 27, year: 2025, month: 9, carrierId: 3, carrierName: "한국택배", plannedAmount: 5700000 },
  { id: 28, year: 2025, month: 10, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 14500000 },
  { id: 29, year: 2025, month: 10, carrierId: 2, carrierName: "신속물류", plannedAmount: 10000000 },
  { id: 30, year: 2025, month: 10, carrierId: 3, carrierName: "한국택배", plannedAmount: 6200000 },
  { id: 31, year: 2025, month: 11, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 15000000 },
  { id: 32, year: 2025, month: 11, carrierId: 2, carrierName: "신속물류", plannedAmount: 10500000 },
  { id: 33, year: 2025, month: 11, carrierId: 3, carrierName: "한국택배", plannedAmount: 6500000 },
  { id: 34, year: 2025, month: 12, carrierId: 1, carrierName: "대한운송(주)", plannedAmount: 15500000 },
  { id: 35, year: 2025, month: 12, carrierId: 2, carrierName: "신속물류", plannedAmount: 11000000 },
  { id: 36, year: 2025, month: 12, carrierId: 3, carrierName: "한국택배", plannedAmount: 6800000 },
];

// Sample actual data for 2025
const initialActuals: TransportActual[] = [
  { id: 1, year: 2025, month: 1, carrierId: 1, carrierName: "대한운송(주)", actualAmount: 11800000 },
  { id: 2, year: 2025, month: 1, carrierId: 2, carrierName: "신속물류", actualAmount: 8200000 },
  { id: 3, year: 2025, month: 1, carrierId: 3, carrierName: "한국택배", actualAmount: 4800000 },
  { id: 4, year: 2025, month: 2, carrierId: 1, carrierName: "대한운송(주)", actualAmount: 12700000 },
  { id: 5, year: 2025, month: 2, carrierId: 2, carrierName: "신속물류", actualAmount: 8300000 },
  { id: 6, year: 2025, month: 2, carrierId: 3, carrierName: "한국택배", actualAmount: 5400000 },
  { id: 7, year: 2025, month: 3, carrierId: 1, carrierName: "대한운송(주)", actualAmount: 12500000 },
  { id: 8, year: 2025, month: 3, carrierId: 2, carrierName: "신속물류", actualAmount: 9200000 },
  { id: 9, year: 2025, month: 3, carrierId: 3, carrierName: "한국택배", actualAmount: 5300000 },
  { id: 10, year: 2025, month: 4, carrierId: 1, carrierName: "대한운송(주)", actualAmount: 13100000 },
  { id: 11, year: 2025, month: 4, carrierId: 2, carrierName: "신속물류", actualAmount: 8600000 },
  { id: 12, year: 2025, month: 4, carrierId: 3, carrierName: "한국택배", actualAmount: 5500000 },
  { id: 13, year: 2025, month: 5, carrierId: 1, carrierName: "대한운송(주)", actualAmount: 13000000 },
  { id: 14, year: 2025, month: 5, carrierId: 2, carrierName: "신속물류", actualAmount: 9400000 },
  { id: 15, year: 2025, month: 5, carrierId: 3, carrierName: "한국택배", actualAmount: 5400000 },
  { id: 16, year: 2025, month: 6, carrierId: 1, carrierName: "대한운송(주)", actualAmount: 14200000 },
  { id: 17, year: 2025, month: 6, carrierId: 2, carrierName: "신속물류", actualAmount: 9300000 },
  { id: 18, year: 2025, month: 6, carrierId: 3, carrierName: "한국택배", actualAmount: 5900000 },
];

// Previous year data for comparison
const previousYearData = [
  { month: 1, total: 23000000 },
  { month: 2, total: 24500000 },
  { month: 3, total: 25000000 },
  { month: 4, total: 24000000 },
  { month: 5, total: 26000000 },
  { month: 6, total: 27500000 },
  { month: 7, total: 26500000 },
  { month: 8, total: 28000000 },
  { month: 9, total: 27000000 },
  { month: 10, total: 29000000 },
  { month: 11, total: 30000000 },
  { month: 12, total: 31500000 },
];

const months = [
  { value: 1, label: "1월" },
  { value: 2, label: "2월" },
  { value: 3, label: "3월" },
  { value: 4, label: "4월" },
  { value: 5, label: "5월" },
  { value: 6, label: "6월" },
  { value: 7, label: "7월" },
  { value: 8, label: "8월" },
  { value: 9, label: "9월" },
  { value: 10, label: "10월" },
  { value: 11, label: "11월" },
  { value: 12, label: "12월" },
];

const years = [2023, 2024, 2025, 2026];

export default function TransportCostPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [plans, setPlans] = useState<TransportPlan[]>(initialPlans);
  const [actuals, setActuals] = useState<TransportActual[]>(initialActuals);

  // Plan form state
  const [planForm, setPlanForm] = useState({
    year: 2025,
    month: 1,
    carrierId: "",
    plannedAmount: "",
  });
  const [showPlanForm, setShowPlanForm] = useState(false);

  // Actual form state
  const [actualForm, setActualForm] = useState({
    year: 2025,
    month: 1,
    carrierId: "",
    actualAmount: "",
  });
  const [showActualForm, setShowActualForm] = useState(false);

  // Filter states
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [comparisonYear, setComparisonYear] = useState(2024);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateAchievementRate = (actual: number, plan: number) => {
    if (plan === 0) return 0;
    return (actual / plan) * 100;
  };

  const calculateChangeRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getMonthlyTotal = (year: number, month: number, data: TransportPlan[] | TransportActual[], field: "plannedAmount" | "actualAmount") => {
    return data
      .filter((item) => item.year === year && item.month === month)
      .reduce((sum, item) => sum + (item as never)[field], 0);
  };

  const getCarrierTotal = (year: number, carrierId: number, data: TransportPlan[] | TransportActual[], field: "plannedAmount" | "actualAmount") => {
    return data
      .filter((item) => item.year === year && item.carrierId === carrierId)
      .reduce((sum, item) => sum + (item as never)[field], 0);
  };

  const getAchievementBadge = (rate: number) => {
    if (rate >= 100) return { variant: "success" as const, icon: ArrowUpRight };
    if (rate >= 90) return { variant: "warning" as const, icon: Minus };
    return { variant: "destructive" as const, icon: ArrowDownRight };
  };

  // Handle plan submission
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const carrier = carriers.find((c) => c.id === Number(planForm.carrierId));
    if (!carrier) return;

    const existingPlan = plans.find(
      (p) => p.year === planForm.year && p.month === planForm.month && p.carrierId === Number(planForm.carrierId)
    );

    if (existingPlan) {
      setPlans(
        plans.map((p) =>
          p.id === existingPlan.id ? { ...p, plannedAmount: Number(planForm.plannedAmount) } : p
        )
      );
    } else {
      const newPlan: TransportPlan = {
        id: Date.now(),
        year: planForm.year,
        month: planForm.month,
        carrierId: Number(planForm.carrierId),
        carrierName: carrier.name,
        plannedAmount: Number(planForm.plannedAmount),
      };
      setPlans([...plans, newPlan]);
    }

    setShowPlanForm(false);
    setPlanForm({ year: 2025, month: 1, carrierId: "", plannedAmount: "" });
    alert("계획이 저장되었습니다.");
  };

  // Handle actual submission
  const handleActualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const carrier = carriers.find((c) => c.id === Number(actualForm.carrierId));
    if (!carrier) return;

    const existingActual = actuals.find(
      (a) => a.year === actualForm.year && a.month === actualForm.month && a.carrierId === Number(actualForm.carrierId)
    );

    if (existingActual) {
      setActuals(
        actuals.map((a) =>
          a.id === existingActual.id ? { ...a, actualAmount: Number(actualForm.actualAmount) } : a
        )
      );
    } else {
      const newActual: TransportActual = {
        id: Date.now(),
        year: actualForm.year,
        month: actualForm.month,
        carrierId: Number(actualForm.carrierId),
        carrierName: carrier.name,
        actualAmount: Number(actualForm.actualAmount),
      };
      setActuals([...actuals, newActual]);
    }

    setShowActualForm(false);
    setActualForm({ year: 2025, month: 1, carrierId: "", actualAmount: "" });
    alert("실적이 저장되었습니다.");
  };

  // Get filtered data based on selected year
  const filteredPlans = plans.filter((p) => p.year === selectedYear);
  const filteredActuals = actuals.filter((a) => a.year === selectedYear);

  // Calculate yearly totals
  const yearlyPlanTotal = filteredPlans.reduce((sum, p) => sum + p.plannedAmount, 0);
  const yearlyActualTotal = filteredActuals.reduce((sum, a) => sum + a.actualAmount, 0);
  const yearlyAchievementRate = calculateAchievementRate(yearlyActualTotal, yearlyPlanTotal);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">2. 2025년 운송비 계획대 실적</h1>
          <p className="text-muted-foreground">운송비 계획 및 실적 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">운송비 계획 입력</TabsTrigger>
          <TabsTrigger value="actual">실적 입력</TabsTrigger>
          <TabsTrigger value="monthly">월별 추이</TabsTrigger>
          <TabsTrigger value="yearly">년간 비교</TabsTrigger>
        </TabsList>

        {/* Tab 1: Plan Entry */}
        <TabsContent value="plan">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                운송비 계획 입력
              </h2>
              <Button onClick={() => setShowPlanForm(!showPlanForm)}>
                <Plus className="mr-2 h-4 w-4" />
                계획 등록
              </Button>
            </div>

            {showPlanForm && (
              <Card>
                <CardHeader>
                  <CardTitle>운송비 계획 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlanSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>년도 *</Label>
                        <Select
                          value={planForm.year.toString()}
                          onValueChange={(v) => setPlanForm({ ...planForm, year: Number(v) })}
                        >
                          <SelectTrigger><SelectValue placeholder="년도 선택" /></SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>월 *</Label>
                        <Select
                          value={planForm.month.toString()}
                          onValueChange={(v) => setPlanForm({ ...planForm, month: Number(v) })}
                        >
                          <SelectTrigger><SelectValue placeholder="월 선택" /></SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>운송업체 *</Label>
                        <Select
                          value={planForm.carrierId}
                          onValueChange={(v) => setPlanForm({ ...planForm, carrierId: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="업체 선택" /></SelectTrigger>
                          <SelectContent>
                            {carriers.map((carrier) => (
                              <SelectItem key={carrier.id} value={carrier.id.toString()}>{carrier.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>계획금액 (원) *</Label>
                        <Input
                          type="number"
                          value={planForm.plannedAmount}
                          onChange={(e) => setPlanForm({ ...planForm, plannedAmount: e.target.value })}
                          placeholder="10000000"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowPlanForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Filter Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2">
                    <Label>년도</Label>
                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(v) => setSelectedYear(Number(v))}
                    >
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>월</Label>
                    <Select
                      value={selectedMonth?.toString() || "all"}
                      onValueChange={(v) => setSelectedMonth(v === "all" ? null : Number(v))}
                    >
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedYear}년 총 계획</p>
                      <p className="text-2xl font-bold">{formatCurrency(yearlyPlanTotal)}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">등록 운송업체</p>
                      <p className="text-2xl font-bold">{carriers.length}개사</p>
                    </div>
                    <Truck className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">월 평균 계획</p>
                      <p className="text-2xl font-bold">{formatCurrency(yearlyPlanTotal / 12)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Table by Carrier */}
            <Card>
              <CardHeader>
                <CardTitle>운송업체별 계획금액</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>운송업체</TableHead>
                      {months.map((m) => (
                        <TableHead key={m.value} className="text-right">{m.label}</TableHead>
                      ))}
                      <TableHead className="text-right">합계</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carriers.slice(0, 3).map((carrier) => {
                      const carrierPlans = filteredPlans.filter((p) => p.carrierId === carrier.id);
                      const total = carrierPlans.reduce((sum, p) => sum + p.plannedAmount, 0);
                      return (
                        <TableRow key={carrier.id}>
                          <TableCell className="font-medium">{carrier.name}</TableCell>
                          {months.map((m) => {
                            const plan = carrierPlans.find((p) => p.month === m.value);
                            return (
                              <TableCell key={m.value} className="text-right">
                                {plan ? formatCurrency(plan.plannedAmount) : "-"}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right font-bold">{formatCurrency(total)}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">합계</TableCell>
                      {months.map((m) => {
                        const monthTotal = getMonthlyTotal(selectedYear, m.value, filteredPlans, "plannedAmount");
                        return (
                          <TableCell key={m.value} className="text-right font-bold">
                            {monthTotal > 0 ? formatCurrency(monthTotal) : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right font-bold text-blue-600">
                        {formatCurrency(yearlyPlanTotal)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Actual Entry */}
        <TabsContent value="actual">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                실적 입력
              </h2>
              <Button onClick={() => setShowActualForm(!showActualForm)}>
                <Plus className="mr-2 h-4 w-4" />
                실적 등록
              </Button>
            </div>

            {showActualForm && (
              <Card>
                <CardHeader>
                  <CardTitle>운송비 실적 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleActualSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>년도 *</Label>
                        <Select
                          value={actualForm.year.toString()}
                          onValueChange={(v) => setActualForm({ ...actualForm, year: Number(v) })}
                        >
                          <SelectTrigger><SelectValue placeholder="년도 선택" /></SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>월 *</Label>
                        <Select
                          value={actualForm.month.toString()}
                          onValueChange={(v) => setActualForm({ ...actualForm, month: Number(v) })}
                        >
                          <SelectTrigger><SelectValue placeholder="월 선택" /></SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>운송업체 *</Label>
                        <Select
                          value={actualForm.carrierId}
                          onValueChange={(v) => setActualForm({ ...actualForm, carrierId: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="업체 선택" /></SelectTrigger>
                          <SelectContent>
                            {carriers.map((carrier) => (
                              <SelectItem key={carrier.id} value={carrier.id.toString()}>{carrier.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>실적금액 (원) *</Label>
                        <Input
                          type="number"
                          value={actualForm.actualAmount}
                          onChange={(e) => setActualForm({ ...actualForm, actualAmount: e.target.value })}
                          placeholder="10000000"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowActualForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedYear}년 계획</p>
                      <p className="text-2xl font-bold">{formatCurrency(yearlyPlanTotal)}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedYear}년 실적</p>
                      <p className="text-2xl font-bold">{formatCurrency(yearlyActualTotal)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">달성률</p>
                      <p className="text-2xl font-bold">{yearlyAchievementRate.toFixed(1)}%</p>
                    </div>
                    {yearlyAchievementRate >= 100 ? (
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">계획대비 차이</p>
                      <p className={`text-2xl font-bold ${yearlyActualTotal - yearlyPlanTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(yearlyActualTotal - yearlyPlanTotal)}
                      </p>
                    </div>
                    {yearlyActualTotal - yearlyPlanTotal >= 0 ? (
                      <ArrowUpRight className="h-8 w-8 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actual vs Plan Table */}
            <Card>
              <CardHeader>
                <CardTitle>월별 실적금액 및 달성률</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-right">계획금액</TableHead>
                      <TableHead className="text-right">실적금액</TableHead>
                      <TableHead className="text-right">차이</TableHead>
                      <TableHead className="text-right">달성률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {months.map((m) => {
                      const planTotal = getMonthlyTotal(selectedYear, m.value, filteredPlans, "plannedAmount");
                      const actualTotal = getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount");
                      const diff = actualTotal - planTotal;
                      const rate = calculateAchievementRate(actualTotal, planTotal);
                      const badge = getAchievementBadge(rate);
                      const BadgeIcon = badge.icon;

                      return (
                        <TableRow key={m.value}>
                          <TableCell className="font-medium">{m.label}</TableCell>
                          <TableCell className="text-right">{planTotal > 0 ? formatCurrency(planTotal) : "-"}</TableCell>
                          <TableCell className="text-right">{actualTotal > 0 ? formatCurrency(actualTotal) : "-"}</TableCell>
                          <TableCell className={`text-right ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {actualTotal > 0 ? formatCurrency(diff) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {actualTotal > 0 ? (
                              <Badge variant={badge.variant} className="flex items-center gap-1 w-fit ml-auto">
                                <BadgeIcon className="h-3 w-3" />
                                {rate.toFixed(1)}%
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">합계</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(yearlyPlanTotal)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(yearlyActualTotal)}</TableCell>
                      <TableCell className={`text-right font-bold ${yearlyActualTotal - yearlyPlanTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(yearlyActualTotal - yearlyPlanTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={getAchievementBadge(yearlyAchievementRate).variant}
                          className="flex items-center gap-1 w-fit ml-auto"
                        >
                          {yearlyAchievementRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Carrier Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>운송업체별 실적 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>운송업체</TableHead>
                      <TableHead className="text-right">계획금액</TableHead>
                      <TableHead className="text-right">실적금액</TableHead>
                      <TableHead className="text-right">달성률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carriers.slice(0, 3).map((carrier) => {
                      const planTotal = getCarrierTotal(selectedYear, carrier.id, filteredPlans, "plannedAmount");
                      const actualTotal = getCarrierTotal(selectedYear, carrier.id, filteredActuals, "actualAmount");
                      const rate = calculateAchievementRate(actualTotal, planTotal);
                      const badge = getAchievementBadge(rate);
                      const BadgeIcon = badge.icon;

                      return (
                        <TableRow key={carrier.id}>
                          <TableCell className="font-medium">{carrier.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(planTotal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(actualTotal)}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={badge.variant} className="flex items-center gap-1 w-fit ml-auto">
                              <BadgeIcon className="h-3 w-3" />
                              {rate.toFixed(1)}%
                            </Badge>
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

        {/* Tab 3: Monthly Trend */}
        <TabsContent value="monthly">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              월별 추이 (12개월)
            </h2>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">최대 월</p>
                      <p className="text-2xl font-bold">
                        {(() => {
                          const monthlyTotals = months.map((m) => ({
                            month: m.label,
                            total: getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount"),
                          })).filter((m) => m.total > 0);
                          if (monthlyTotals.length === 0) return "-";
                          const max = monthlyTotals.reduce((a, b) => (a.total > b.total ? a : b));
                          return max.month;
                        })()}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">최대 금액</p>
                      <p className="text-2xl font-bold">
                        {(() => {
                          const monthlyTotals = months.map((m) =>
                            getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount")
                          ).filter((t) => t > 0);
                          if (monthlyTotals.length === 0) return "-";
                          return formatCurrency(Math.max(...monthlyTotals));
                        })()}
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">최소 월</p>
                      <p className="text-2xl font-bold">
                        {(() => {
                          const monthlyTotals = months.map((m) => ({
                            month: m.label,
                            total: getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount"),
                          })).filter((m) => m.total > 0);
                          if (monthlyTotals.length === 0) return "-";
                          const min = monthlyTotals.reduce((a, b) => (a.total < b.total ? a : b));
                          return min.month;
                        })()}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">월 평균</p>
                      <p className="text-2xl font-bold">
                        {(() => {
                          const monthlyTotals = months.map((m) =>
                            getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount")
                          ).filter((t) => t > 0);
                          if (monthlyTotals.length === 0) return "-";
                          const avg = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
                          return formatCurrency(avg);
                        })()}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend Table */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedYear}년 월별 운송비 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-right">계획</TableHead>
                      <TableHead className="text-right">실적</TableHead>
                      <TableHead className="text-right">달성률</TableHead>
                      <TableHead className="text-right">전월대비 증감률</TableHead>
                      <TableHead>추세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {months.map((m, index) => {
                      const planTotal = getMonthlyTotal(selectedYear, m.value, filteredPlans, "plannedAmount");
                      const actualTotal = getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount");
                      const prevActualTotal = index > 0
                        ? getMonthlyTotal(selectedYear, months[index - 1].value, filteredActuals, "actualAmount")
                        : 0;
                      const achievementRate = calculateAchievementRate(actualTotal, planTotal);
                      const changeRate = prevActualTotal > 0 ? calculateChangeRate(actualTotal, prevActualTotal) : 0;

                      return (
                        <TableRow key={m.value}>
                          <TableCell className="font-medium">{m.label}</TableCell>
                          <TableCell className="text-right">{planTotal > 0 ? formatCurrency(planTotal) : "-"}</TableCell>
                          <TableCell className="text-right">{actualTotal > 0 ? formatCurrency(actualTotal) : "-"}</TableCell>
                          <TableCell className="text-right">
                            {actualTotal > 0 ? (
                              <Badge variant={getAchievementBadge(achievementRate).variant}>
                                {achievementRate.toFixed(1)}%
                              </Badge>
                            ) : "-"}
                          </TableCell>
                          <TableCell className={`text-right ${changeRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {actualTotal > 0 && prevActualTotal > 0 ? (
                              <span className="flex items-center justify-end gap-1">
                                {changeRate >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(changeRate).toFixed(1)}%
                              </span>
                            ) : "-"}
                          </TableCell>
                          <TableCell>
                            {actualTotal > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min((actualTotal / (yearlyActualTotal / filteredActuals.length * 2)) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Carrier Trend Table */}
            <Card>
              <CardHeader>
                <CardTitle>운송업체별 월별 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>운송업체</TableHead>
                      {months.slice(0, 6).map((m) => (
                        <TableHead key={m.value} className="text-right">{m.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carriers.slice(0, 3).map((carrier) => (
                      <TableRow key={carrier.id}>
                        <TableCell className="font-medium">{carrier.name}</TableCell>
                        {months.slice(0, 6).map((m) => {
                          const actual = filteredActuals.find(
                            (a) => a.carrierId === carrier.id && a.month === m.value
                          );
                          return (
                            <TableCell key={m.value} className="text-right">
                              {actual ? formatCurrency(actual.actualAmount) : "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Year-over-Year Comparison */}
        <TabsContent value="yearly">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                년간 비교
              </h2>
              <div className="flex gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">비교년도</Label>
                  <Select
                    value={comparisonYear.toString()}
                    onValueChange={(v) => setComparisonYear(Number(v))}
                  >
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {years.filter((y) => y !== selectedYear).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedYear}년 실적</p>
                    <p className="text-2xl font-bold">{formatCurrency(yearlyActualTotal)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">{comparisonYear}년 실적</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(previousYearData.reduce((sum, d) => sum + d.total, 0))}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">전년대비 증감</p>
                    {(() => {
                      const prevTotal = previousYearData.reduce((sum, d) => sum + d.total, 0);
                      const diff = yearlyActualTotal - prevTotal;
                      return (
                        <p className={`text-2xl font-bold ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(diff)}
                        </p>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">전년대비 증감률</p>
                    {(() => {
                      const prevTotal = previousYearData.reduce((sum, d) => sum + d.total, 0);
                      const rate = calculateChangeRate(yearlyActualTotal, prevTotal);
                      return (
                        <p className={`text-2xl font-bold flex items-center gap-1 ${rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {rate >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                          {Math.abs(rate).toFixed(1)}%
                        </p>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Year Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>월별 년간 비교 ({selectedYear}년 vs {comparisonYear}년)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-right">{comparisonYear}년</TableHead>
                      <TableHead className="text-right">{selectedYear}년</TableHead>
                      <TableHead className="text-right">증감액</TableHead>
                      <TableHead className="text-right">증감률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {months.map((m) => {
                      const currentTotal = getMonthlyTotal(selectedYear, m.value, filteredActuals, "actualAmount");
                      const prevData = previousYearData.find((d) => d.month === m.value);
                      const prevTotal = prevData?.total || 0;
                      const diff = currentTotal - prevTotal;
                      const rate = prevTotal > 0 ? calculateChangeRate(currentTotal, prevTotal) : 0;

                      return (
                        <TableRow key={m.value}>
                          <TableCell className="font-medium">{m.label}</TableCell>
                          <TableCell className="text-right">{formatCurrency(prevTotal)}</TableCell>
                          <TableCell className="text-right">
                            {currentTotal > 0 ? formatCurrency(currentTotal) : "-"}
                          </TableCell>
                          <TableCell className={`text-right ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {currentTotal > 0 ? formatCurrency(diff) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {currentTotal > 0 ? (
                              <span className={`flex items-center justify-end gap-1 ${rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {rate >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(rate).toFixed(1)}%
                              </span>
                            ) : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold">합계</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(previousYearData.reduce((sum, d) => sum + d.total, 0))}
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(yearlyActualTotal)}</TableCell>
                      <TableCell className={`text-right font-bold ${yearlyActualTotal - previousYearData.reduce((sum, d) => sum + d.total, 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(yearlyActualTotal - previousYearData.reduce((sum, d) => sum + d.total, 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        {(() => {
                          const prevTotal = previousYearData.reduce((sum, d) => sum + d.total, 0);
                          const rate = calculateChangeRate(yearlyActualTotal, prevTotal);
                          return (
                            <span className={`flex items-center justify-end gap-1 font-bold ${rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {rate >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              {Math.abs(rate).toFixed(1)}%
                            </span>
                          );
                        })()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quarterly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>분기별 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>분기</TableHead>
                      <TableHead className="text-right">{comparisonYear}년</TableHead>
                      <TableHead className="text-right">{selectedYear}년</TableHead>
                      <TableHead className="text-right">증감률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "1분기 (1-3월)", months: [1, 2, 3] },
                      { label: "2분기 (4-6월)", months: [4, 5, 6] },
                      { label: "3분기 (7-9월)", months: [7, 8, 9] },
                      { label: "4분기 (10-12월)", months: [10, 11, 12] },
                    ].map((quarter, idx) => {
                      const prevQuarterTotal = previousYearData
                        .filter((d) => quarter.months.includes(d.month))
                        .reduce((sum, d) => sum + d.total, 0);
                      const currentQuarterTotal = quarter.months.reduce(
                        (sum, month) => sum + getMonthlyTotal(selectedYear, month, filteredActuals, "actualAmount"),
                        0
                      );
                      const rate = prevQuarterTotal > 0 ? calculateChangeRate(currentQuarterTotal, prevQuarterTotal) : 0;

                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{quarter.label}</TableCell>
                          <TableCell className="text-right">{formatCurrency(prevQuarterTotal)}</TableCell>
                          <TableCell className="text-right">
                            {currentQuarterTotal > 0 ? formatCurrency(currentQuarterTotal) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {currentQuarterTotal > 0 ? (
                              <span className={`flex items-center justify-end gap-1 ${rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {rate >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(rate).toFixed(1)}%
                              </span>
                            ) : "-"}
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
      </Tabs>
    </div>
  );
}
