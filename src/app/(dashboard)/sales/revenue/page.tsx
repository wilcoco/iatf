"use client";

import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

// ===== Types =====
interface SalesRow {
  id: number;
  vehicle: string; // 차종
  q1: number; // 1분기 금액 (천원)
  q2: number;
  q3: number;
  q4: number;
  target: number; // 연간 계획 (천원)
}

interface PurchaseRow {
  id: number;
  category: string; // 구분 (공급처/차종)
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  note: string; // 비고
}

// ===== Constants =====
const VEHICLE_TYPES = ["PU", "SK3", "SK3EV", "QV2", "SP2", "QL"];

// ===== Helpers =====
const sumQuarters = (r: { q1: number; q2: number; q3: number; q4: number }) =>
  r.q1 + r.q2 + r.q3 + r.q4;

const formatKRW = (v: number) => v.toLocaleString("ko-KR");

const achievementRate = (actual: number, target: number) =>
  target > 0 ? Math.round((actual / target) * 1000) / 10 : 0;

function AchievementBadge({ rate }: { rate: number }) {
  if (rate >= 100) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        {rate}% 달성
      </Badge>
    );
  }
  if (rate >= 80) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        {rate}% 진행
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
      {rate}% 미달
    </Badge>
  );
}

// ===== Initial mock data =====
const INITIAL_SALES: SalesRow[] = [
  { id: 1, vehicle: "PU", q1: 1250000, q2: 1380000, q3: 1420000, q4: 1510000, target: 5800000 },
  { id: 2, vehicle: "SK3", q1: 980000, q2: 1020000, q3: 1100000, q4: 1080000, target: 4500000 },
  { id: 3, vehicle: "SK3EV", q1: 620000, q2: 720000, q3: 810000, q4: 920000, target: 2800000 },
  { id: 4, vehicle: "QV2", q1: 450000, q2: 480000, q3: 510000, q4: 530000, target: 2200000 },
  { id: 5, vehicle: "SP2", q1: 320000, q2: 340000, q3: 360000, q4: 380000, target: 1300000 },
];

const INITIAL_PURCHASE: PurchaseRow[] = [
  { id: 1, category: "대성금속 (PU)", q1: 620000, q2: 660000, q3: 690000, q4: 710000, note: "강판 소재" },
  { id: 2, category: "한국정밀 (SK3)", q1: 480000, q2: 500000, q3: 520000, q4: 540000, note: "가공품" },
  { id: 3, category: "동양전장 (SK3EV)", q1: 310000, q2: 360000, q3: 410000, q4: 460000, note: "전장 부품" },
  { id: 4, category: "삼화기공 (QV2)", q1: 210000, q2: 230000, q3: 250000, q4: 260000, note: "사출품" },
];

const emptySales = { vehicle: "PU", q1: 0, q2: 0, q3: 0, q4: 0, target: 0 };
const emptyPurchase = { category: "", q1: 0, q2: 0, q3: 0, q4: 0, note: "" };

export default function SalesRevenuePage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [salesRows, setSalesRows] = useState<SalesRow[]>(INITIAL_SALES);
  const [purchaseRows, setPurchaseRows] =
    useState<PurchaseRow[]>(INITIAL_PURCHASE);

  const [salesForm, setSalesForm] = useState({ ...emptySales });
  const [purchaseForm, setPurchaseForm] = useState({ ...emptyPurchase });

  // ===== Sales computed =====
  const salesTotals = useMemo(() => {
    const totalAmount = salesRows.reduce((s, r) => s + sumQuarters(r), 0);
    const totalTarget = salesRows.reduce((s, r) => s + r.target, 0);
    const avgRate =
      salesRows.length > 0
        ? Math.round(
            (salesRows.reduce(
              (s, r) => s + achievementRate(sumQuarters(r), r.target),
              0
            ) /
              salesRows.length) *
              10
          ) / 10
        : 0;
    return { totalAmount, totalTarget, avgRate };
  }, [salesRows]);

  // ===== Purchase computed =====
  const purchaseTotals = useMemo(() => {
    const totalAmount = purchaseRows.reduce((s, r) => s + sumQuarters(r), 0);
    return { totalAmount };
  }, [purchaseRows]);

  // ===== Sales handlers =====
  const addSalesRow = () => {
    const nextId =
      salesRows.length > 0 ? Math.max(...salesRows.map((r) => r.id)) + 1 : 1;
    setSalesRows([...salesRows, { id: nextId, ...salesForm }]);
    setSalesForm({ ...emptySales });
  };

  const removeSalesRow = (id: number) =>
    setSalesRows(salesRows.filter((r) => r.id !== id));

  // ===== Purchase handlers =====
  const addPurchaseRow = () => {
    if (!purchaseForm.category.trim()) return;
    const nextId =
      purchaseRows.length > 0
        ? Math.max(...purchaseRows.map((r) => r.id)) + 1
        : 1;
    setPurchaseRows([...purchaseRows, { id: nextId, ...purchaseForm }]);
    setPurchaseForm({ ...emptyPurchase });
  };

  const removePurchaseRow = (id: number) =>
    setPurchaseRows(purchaseRows.filter((r) => r.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">매출/매입 실적</h1>
        <p className="text-muted-foreground mt-1">
          차종별 월별 매출/매입(수량·금액)의 계획 대비 실적을 분기/연 단위로
          집계 관리합니다. (출처: 매출, 매입액 시트)
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="sales">
                <TrendingUp className="mr-2 h-4 w-4" />
                매출 실적
              </TabsTrigger>
              <TabsTrigger value="purchase">
                <ShoppingCart className="mr-2 h-4 w-4" />
                매입 실적
              </TabsTrigger>
            </TabsList>

            {/* ===== 매출 실적 ===== */}
            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      총 매출 (천원)
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatKRW(salesTotals.totalAmount)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      연간 계획 (천원)
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatKRW(salesTotals.totalTarget)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      평균 달성률
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesTotals.avgRate}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">차종별 매출 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="space-y-1">
                      <Label>차종</Label>
                      <Select
                        value={salesForm.vehicle}
                        onValueChange={(v) =>
                          setSalesForm({ ...salesForm, vehicle: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="차종 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {VEHICLE_TYPES.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>1분기</Label>
                      <Input
                        type="number"
                        value={salesForm.q1}
                        onChange={(e) =>
                          setSalesForm({
                            ...salesForm,
                            q1: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>2분기</Label>
                      <Input
                        type="number"
                        value={salesForm.q2}
                        onChange={(e) =>
                          setSalesForm({
                            ...salesForm,
                            q2: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>3분기</Label>
                      <Input
                        type="number"
                        value={salesForm.q3}
                        onChange={(e) =>
                          setSalesForm({
                            ...salesForm,
                            q3: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>4분기</Label>
                      <Input
                        type="number"
                        value={salesForm.q4}
                        onChange={(e) =>
                          setSalesForm({
                            ...salesForm,
                            q4: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>연간 계획</Label>
                      <Input
                        type="number"
                        value={salesForm.target}
                        onChange={(e) =>
                          setSalesForm({
                            ...salesForm,
                            target: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={addSalesRow}>
                      <Plus className="mr-2 h-4 w-4" />
                      행 추가
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>차종</TableHead>
                    <TableHead className="text-right">1분기</TableHead>
                    <TableHead className="text-right">2분기</TableHead>
                    <TableHead className="text-right">3분기</TableHead>
                    <TableHead className="text-right">4분기</TableHead>
                    <TableHead className="text-right">합계금액(천원)</TableHead>
                    <TableHead>달성률</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesRows.map((r) => {
                    const total = sumQuarters(r);
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">
                          {r.vehicle}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatKRW(r.q1)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatKRW(r.q2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatKRW(r.q3)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatKRW(r.q4)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatKRW(total)}
                        </TableCell>
                        <TableCell>
                          <AchievementBadge
                            rate={achievementRate(total, r.target)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSalesRow(r.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>합계</TableCell>
                    <TableCell className="text-right">
                      {formatKRW(salesRows.reduce((s, r) => s + r.q1, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(salesRows.reduce((s, r) => s + r.q2, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(salesRows.reduce((s, r) => s + r.q3, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(salesRows.reduce((s, r) => s + r.q4, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(salesTotals.totalAmount)}
                    </TableCell>
                    <TableCell colSpan={2}>
                      평균 {salesTotals.avgRate}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* ===== 매입 실적 ===== */}
            <TabsContent value="purchase" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      총 매입 (천원)
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatKRW(purchaseTotals.totalAmount)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      공급처 수
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {purchaseRows.length} 개
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      매출 대비 매입율
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {achievementRate(
                        purchaseTotals.totalAmount,
                        salesTotals.totalAmount
                      )}
                      %
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">매입 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="space-y-1 md:col-span-2">
                      <Label>구분 (공급처/차종)</Label>
                      <Input
                        value={purchaseForm.category}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            category: e.target.value,
                          })
                        }
                        placeholder="예: 대성금속 (PU)"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>1분기</Label>
                      <Input
                        type="number"
                        value={purchaseForm.q1}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            q1: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>2분기</Label>
                      <Input
                        type="number"
                        value={purchaseForm.q2}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            q2: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>3분기</Label>
                      <Input
                        type="number"
                        value={purchaseForm.q3}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            q3: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>4분기</Label>
                      <Input
                        type="number"
                        value={purchaseForm.q4}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            q4: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
                    <div className="space-y-1 md:col-span-4">
                      <Label>비고</Label>
                      <Input
                        value={purchaseForm.note}
                        onChange={(e) =>
                          setPurchaseForm({
                            ...purchaseForm,
                            note: e.target.value,
                          })
                        }
                        placeholder="비고 입력"
                      />
                    </div>
                    <div className="flex items-end md:col-span-2">
                      <Button onClick={addPurchaseRow}>
                        <Plus className="mr-2 h-4 w-4" />
                        행 추가
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구분</TableHead>
                    <TableHead className="text-right">1분기</TableHead>
                    <TableHead className="text-right">2분기</TableHead>
                    <TableHead className="text-right">3분기</TableHead>
                    <TableHead className="text-right">4분기</TableHead>
                    <TableHead className="text-right">합계(천원)</TableHead>
                    <TableHead>비고</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseRows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        {r.category}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatKRW(r.q1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatKRW(r.q2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatKRW(r.q3)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatKRW(r.q4)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatKRW(sumQuarters(r))}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.note}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePurchaseRow(r.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>합계</TableCell>
                    <TableCell className="text-right">
                      {formatKRW(purchaseRows.reduce((s, r) => s + r.q1, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(purchaseRows.reduce((s, r) => s + r.q2, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(purchaseRows.reduce((s, r) => s + r.q3, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(purchaseRows.reduce((s, r) => s + r.q4, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatKRW(purchaseTotals.totalAmount)}
                    </TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
