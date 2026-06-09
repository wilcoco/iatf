"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calculator,
  Trash2,
} from "lucide-react";

// Types
interface SalesPlanEntry {
  id: number;
  customer: string;
  product: string;
  monthlyPlans: number[];
  total: number;
}

interface PurchasePlanEntry {
  id: number;
  supplier: string;
  item: string;
  monthlyPlans: number[];
  total: number;
}

interface ActualEntry {
  customer: string;
  product: string;
  monthlyActuals: number[];
  monthlyPlans: number[];
}

interface YearData {
  year: number;
  salesTotal: number;
  purchaseTotal: number;
}

// Initial data
const initialSalesPlans: SalesPlanEntry[] = [
  {
    id: 1,
    customer: "현대자동차",
    product: "도어트림 LH",
    monthlyPlans: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230],
    total: 2100,
  },
  {
    id: 2,
    customer: "기아자동차",
    product: "센터콘솔",
    monthlyPlans: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
    total: 1290,
  },
  {
    id: 3,
    customer: "현대자동차",
    product: "글로브박스",
    monthlyPlans: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
    total: 1050,
  },
];

const initialPurchasePlans: PurchasePlanEntry[] = [
  {
    id: 1,
    supplier: "삼성SDI",
    item: "배터리 모듈",
    monthlyPlans: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
    total: 930,
  },
  {
    id: 2,
    supplier: "LG화학",
    item: "플라스틱 원자재",
    monthlyPlans: [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62],
    total: 612,
  },
  {
    id: 3,
    supplier: "포스코",
    item: "철강 자재",
    monthlyPlans: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52],
    total: 492,
  },
];

const initialActuals: ActualEntry[] = [
  {
    customer: "현대자동차",
    product: "도어트림 LH",
    monthlyActuals: [115, 128, 138, 145, 155, 165, 0, 0, 0, 0, 0, 0],
    monthlyPlans: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230],
  },
  {
    customer: "기아자동차",
    product: "센터콘솔",
    monthlyActuals: [82, 88, 92, 98, 103, 108, 0, 0, 0, 0, 0, 0],
    monthlyPlans: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
  },
  {
    customer: "현대자동차",
    product: "글로브박스",
    monthlyActuals: [58, 63, 68, 73, 78, 83, 0, 0, 0, 0, 0, 0],
    monthlyPlans: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
  },
];

const yearOverYearData: YearData[] = [
  { year: 2018, salesTotal: 3200, purchaseTotal: 1800 },
  { year: 2019, salesTotal: 3800, purchaseTotal: 2100 },
  { year: 2020, salesTotal: 4440, purchaseTotal: 2034 },
];

const months = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

const customers = [
  "현대자동차",
  "기아자동차",
  "GM코리아",
  "르노코리아",
  "쌍용자동차",
];

const products = [
  "도어트림 LH",
  "도어트림 RH",
  "센터콘솔",
  "글로브박스",
  "대시보드",
  "헤드라이닝",
];

const suppliers = [
  "삼성SDI",
  "LG화학",
  "포스코",
  "현대제철",
  "SK이노베이션",
];

const items = [
  "배터리 모듈",
  "플라스틱 원자재",
  "철강 자재",
  "알루미늄 판재",
  "전자부품",
];

export default function SalesPlanPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [selectedYear, setSelectedYear] = useState("2020");
  const [selectedManager, setSelectedManager] = useState("박찬희");

  // Sales plan state
  const [salesPlans, setSalesPlans] = useState<SalesPlanEntry[]>(initialSalesPlans);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [salesFormData, setSalesFormData] = useState({
    customer: "",
    product: "",
    monthlyPlans: Array(12).fill(0),
  });

  // Purchase plan state
  const [purchasePlans, setPurchasePlans] = useState<PurchasePlanEntry[]>(initialPurchasePlans);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseFormData, setPurchaseFormData] = useState({
    supplier: "",
    item: "",
    monthlyPlans: Array(12).fill(0),
  });

  // Actuals state
  const [actuals] = useState<ActualEntry[]>(initialActuals);

  // Year comparison state
  const [yearData] = useState<YearData[]>(yearOverYearData);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  // Calculate total from monthly plans
  const calculateTotal = (monthlyPlans: number[]) => {
    return monthlyPlans.reduce((sum, val) => sum + val, 0);
  };

  // Calculate achievement rate
  const calculateAchievementRate = (actual: number, plan: number) => {
    if (plan === 0) return 0;
    return Math.round((actual / plan) * 100);
  };

  // Handle sales form submission
  const handleSalesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SalesPlanEntry = {
      id: salesPlans.length + 1,
      customer: salesFormData.customer,
      product: salesFormData.product,
      monthlyPlans: [...salesFormData.monthlyPlans],
      total: calculateTotal(salesFormData.monthlyPlans),
    };
    setSalesPlans([...salesPlans, newEntry]);
    setShowSalesForm(false);
    setSalesFormData({
      customer: "",
      product: "",
      monthlyPlans: Array(12).fill(0),
    });
  };

  // Handle purchase form submission
  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PurchasePlanEntry = {
      id: purchasePlans.length + 1,
      supplier: purchaseFormData.supplier,
      item: purchaseFormData.item,
      monthlyPlans: [...purchaseFormData.monthlyPlans],
      total: calculateTotal(purchaseFormData.monthlyPlans),
    };
    setPurchasePlans([...purchasePlans, newEntry]);
    setShowPurchaseForm(false);
    setPurchaseFormData({
      supplier: "",
      item: "",
      monthlyPlans: Array(12).fill(0),
    });
  };

  // Delete sales plan
  const deleteSalesPlan = (id: number) => {
    setSalesPlans(salesPlans.filter((p) => p.id !== id));
  };

  // Delete purchase plan
  const deletePurchasePlan = (id: number) => {
    setPurchasePlans(purchasePlans.filter((p) => p.id !== id));
  };

  // Calculate totals
  const salesTotal = salesPlans.reduce((sum, p) => sum + p.total, 0);
  const purchaseTotal = purchasePlans.reduce((sum, p) => sum + p.total, 0);

  // Calculate monthly totals for sales
  const salesMonthlyTotals = months.map((_, i) =>
    salesPlans.reduce((sum, p) => sum + p.monthlyPlans[i], 0)
  );

  // Calculate monthly totals for purchase
  const purchaseMonthlyTotals = months.map((_, i) =>
    purchasePlans.reduce((sum, p) => sum + p.monthlyPlans[i], 0)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">2020년 매출계획</h1>
          <p className="text-muted-foreground">매출계획 및 매입계획 관리</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>년도:</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label>담당자:</Label>
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="박찬희">박찬희</SelectItem>
                <SelectItem value="김부영">김부영</SelectItem>
                <SelectItem value="이철수">이철수</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">매출 계획 입력</TabsTrigger>
          <TabsTrigger value="purchase">매입 계획</TabsTrigger>
          <TabsTrigger value="comparison">계획 vs 실적</TabsTrigger>
          <TabsTrigger value="yearly">년간 비교</TabsTrigger>
        </TabsList>

        {/* Tab 1: Sales Plan Entry */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  고객사별 월별 매출계획 (단위: 백만원)
                </CardTitle>
                <Button onClick={() => setShowSalesForm(!showSalesForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  계획 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showSalesForm && (
                <Card className="mb-6 border-dashed">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSalesSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>고객사 *</Label>
                          <Select
                            value={salesFormData.customer}
                            onValueChange={(v) =>
                              setSalesFormData({ ...salesFormData, customer: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="고객사 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {customers.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>품목 *</Label>
                          <Select
                            value={salesFormData.product}
                            onValueChange={(v) =>
                              setSalesFormData({ ...salesFormData, product: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="품목 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>월별 계획 (백만원)</Label>
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                          {months.map((month, i) => (
                            <div key={month} className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                {month}
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={salesFormData.monthlyPlans[i] || ""}
                                onChange={(e) => {
                                  const newPlans = [...salesFormData.monthlyPlans];
                                  newPlans[i] = Number(e.target.value) || 0;
                                  setSalesFormData({
                                    ...salesFormData,
                                    monthlyPlans: newPlans,
                                  });
                                }}
                                className="text-center"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSalesForm(false)}
                        >
                          취소
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            !salesFormData.customer || !salesFormData.product
                          }
                        >
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">
                        고객사
                      </TableHead>
                      <TableHead>품목</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[70px]">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">합계</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="sticky left-0 bg-background font-medium">
                          {plan.customer}
                        </TableCell>
                        <TableCell>{plan.product}</TableCell>
                        {plan.monthlyPlans.map((val, i) => (
                          <TableCell key={i} className="text-center">
                            {formatCurrency(val)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(plan.total)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSalesPlan(plan.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="sticky left-0 bg-muted/50" colSpan={2}>
                        월별 합계
                      </TableCell>
                      {salesMonthlyTotals.map((val, i) => (
                        <TableCell key={i} className="text-center">
                          {formatCurrency(val)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        {formatCurrency(salesTotal)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Purchase Plan */}
        <TabsContent value="purchase">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  공급업체별 월별 매입계획 (단위: 백만원)
                </CardTitle>
                <Button onClick={() => setShowPurchaseForm(!showPurchaseForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  계획 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showPurchaseForm && (
                <Card className="mb-6 border-dashed">
                  <CardContent className="pt-6">
                    <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>공급업체 *</Label>
                          <Select
                            value={purchaseFormData.supplier}
                            onValueChange={(v) =>
                              setPurchaseFormData({
                                ...purchaseFormData,
                                supplier: v,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="공급업체 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>품목 *</Label>
                          <Select
                            value={purchaseFormData.item}
                            onValueChange={(v) =>
                              setPurchaseFormData({ ...purchaseFormData, item: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="품목 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((i) => (
                                <SelectItem key={i} value={i}>
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>월별 계획 (백만원)</Label>
                        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                          {months.map((month, i) => (
                            <div key={month} className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                {month}
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                value={purchaseFormData.monthlyPlans[i] || ""}
                                onChange={(e) => {
                                  const newPlans = [
                                    ...purchaseFormData.monthlyPlans,
                                  ];
                                  newPlans[i] = Number(e.target.value) || 0;
                                  setPurchaseFormData({
                                    ...purchaseFormData,
                                    monthlyPlans: newPlans,
                                  });
                                }}
                                className="text-center"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPurchaseForm(false)}
                        >
                          취소
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            !purchaseFormData.supplier || !purchaseFormData.item
                          }
                        >
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">
                        공급업체
                      </TableHead>
                      <TableHead>품목</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[70px]">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">합계</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchasePlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="sticky left-0 bg-background font-medium">
                          {plan.supplier}
                        </TableCell>
                        <TableCell>{plan.item}</TableCell>
                        {plan.monthlyPlans.map((val, i) => (
                          <TableCell key={i} className="text-center">
                            {formatCurrency(val)}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(plan.total)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePurchasePlan(plan.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell className="sticky left-0 bg-muted/50" colSpan={2}>
                        월별 합계
                      </TableCell>
                      {purchaseMonthlyTotals.map((val, i) => (
                        <TableCell key={i} className="text-center">
                          {formatCurrency(val)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        {formatCurrency(purchaseTotal)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Plan vs Actual */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                월별 계획 대비 실적 달성률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">
                        고객사
                      </TableHead>
                      <TableHead>품목</TableHead>
                      <TableHead>구분</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center min-w-[70px]">
                          {month}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actuals.map((entry, idx) => (
                      <>
                        <TableRow key={`plan-${idx}`}>
                          <TableCell
                            className="sticky left-0 bg-background font-medium"
                            rowSpan={3}
                          >
                            {entry.customer}
                          </TableCell>
                          <TableCell rowSpan={3}>{entry.product}</TableCell>
                          <TableCell className="text-muted-foreground">
                            계획
                          </TableCell>
                          {entry.monthlyPlans.map((val, i) => (
                            <TableCell key={i} className="text-center">
                              {formatCurrency(val)}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow key={`actual-${idx}`}>
                          <TableCell className="text-muted-foreground">
                            실적
                          </TableCell>
                          {entry.monthlyActuals.map((val, i) => (
                            <TableCell key={i} className="text-center">
                              {val > 0 ? formatCurrency(val) : "-"}
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow key={`rate-${idx}`} className="border-b-2">
                          <TableCell className="text-muted-foreground">
                            달성률
                          </TableCell>
                          {entry.monthlyActuals.map((actual, i) => {
                            const plan = entry.monthlyPlans[i];
                            const rate = calculateAchievementRate(actual, plan);
                            return (
                              <TableCell key={i} className="text-center">
                                {actual > 0 ? (
                                  <Badge
                                    variant={
                                      rate >= 100
                                        ? "success"
                                        : rate >= 90
                                        ? "warning"
                                        : "destructive"
                                    }
                                  >
                                    {rate}%
                                  </Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      상반기 평균 달성률
                    </div>
                    <div className="text-2xl font-bold text-green-600">96.2%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      목표 대비 실적
                    </div>
                    <div className="text-2xl font-bold">1,968 / 2,040</div>
                    <div className="text-sm text-muted-foreground">(백만원)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      하반기 목표
                    </div>
                    <div className="text-2xl font-bold text-blue-600">2,400</div>
                    <div className="text-sm text-muted-foreground">(백만원)</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Year-over-Year Comparison */}
        <TabsContent value="yearly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                년간 매출/매입 비교
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>년도</TableHead>
                      <TableHead className="text-right">매출 (백만원)</TableHead>
                      <TableHead className="text-right">매입 (백만원)</TableHead>
                      <TableHead className="text-right">매출총이익</TableHead>
                      <TableHead className="text-right">이익률</TableHead>
                      <TableHead className="text-right">전년대비 매출</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearData.map((data, idx) => {
                      const grossProfit = data.salesTotal - data.purchaseTotal;
                      const profitRate = Math.round(
                        (grossProfit / data.salesTotal) * 100
                      );
                      const prevYear = yearData[idx - 1];
                      const yoyGrowth = prevYear
                        ? Math.round(
                            ((data.salesTotal - prevYear.salesTotal) /
                              prevYear.salesTotal) *
                              100
                          )
                        : null;

                      return (
                        <TableRow key={data.year}>
                          <TableCell className="font-medium">
                            {data.year}년
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(data.salesTotal)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(data.purchaseTotal)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(grossProfit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                profitRate >= 50
                                  ? "success"
                                  : profitRate >= 40
                                  ? "warning"
                                  : "destructive"
                              }
                            >
                              {profitRate}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {yoyGrowth !== null ? (
                              <span
                                className={
                                  yoyGrowth >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {yoyGrowth >= 0 ? "+" : ""}
                                {yoyGrowth}%
                              </span>
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
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      2020년 매출 계획
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(salesTotal)}
                    </div>
                    <div className="text-sm text-muted-foreground">(백만원)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      2020년 매입 계획
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(purchaseTotal)}
                    </div>
                    <div className="text-sm text-muted-foreground">(백만원)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      예상 매출총이익
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(salesTotal - purchaseTotal)}
                    </div>
                    <div className="text-sm text-muted-foreground">(백만원)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      전년대비 성장률
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      +
                      {Math.round(
                        ((salesTotal - 3800) / 3800) * 100
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      (2019년 대비)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Bar Chart Representation */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">년도별 매출/매입 추이</h3>
                {yearData.map((data) => (
                  <div key={data.year} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.year}년</span>
                      <span className="text-muted-foreground">
                        매출: {formatCurrency(data.salesTotal)} / 매입:{" "}
                        {formatCurrency(data.purchaseTotal)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="h-6 bg-blue-500 rounded"
                        style={{
                          width: `${(data.salesTotal / 5000) * 100}%`,
                        }}
                      />
                      <div
                        className="h-6 bg-orange-500 rounded"
                        style={{
                          width: `${(data.purchaseTotal / 5000) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span>매출</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded" />
                    <span>매입</span>
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
