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
  ClipboardList,
  Save,
  Search,
  Plus,
  Trash2,
  Building2,
  Package,
  TrendingUp,
  BarChart3
} from "lucide-react";

// Types
interface MonthlyPlan {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

interface MonthlyActual {
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

interface SupplierPlanActual {
  id: number;
  supplierName: string;
  itemName: string;
  itemCode: string;
  unit: string;
  plan: MonthlyPlan;
  actual: MonthlyActual;
  createdAt: string;
}

// Month labels
const months = [
  { key: "jan", label: "1월" },
  { key: "feb", label: "2월" },
  { key: "mar", label: "3월" },
  { key: "apr", label: "4월" },
  { key: "may", label: "5월" },
  { key: "jun", label: "6월" },
  { key: "jul", label: "7월" },
  { key: "aug", label: "8월" },
  { key: "sep", label: "9월" },
  { key: "oct", label: "10월" },
  { key: "nov", label: "11월" },
  { key: "dec", label: "12월" },
] as const;

type MonthKey = typeof months[number]["key"];

// Initial monthly data
const createEmptyMonthlyData = (): MonthlyPlan => ({
  jan: 0,
  feb: 0,
  mar: 0,
  apr: 0,
  may: 0,
  jun: 0,
  jul: 0,
  aug: 0,
  sep: 0,
  oct: 0,
  nov: 0,
  dec: 0,
});

// Sample suppliers
const sampleSuppliers = [
  "삼성전자",
  "LG전자",
  "SK하이닉스",
  "현대모비스",
  "한화솔루션",
  "포스코",
  "기타",
];

// Sample items
const sampleItems = [
  { name: "PCB 기판", code: "PCB-001" },
  { name: "반도체 칩", code: "CHIP-002" },
  { name: "커넥터", code: "CONN-003" },
  { name: "케이블", code: "CABLE-004" },
  { name: "하우징", code: "HOUS-005" },
];

export default function SupplierPlanActualPage() {
  const [activeTab, setActiveTab] = useState("plan-entry");
  const [records, setRecords] = useState<SupplierPlanActual[]>([]);
  const [search, setSearch] = useState("");

  // Form state for plan entry
  const [planForm, setPlanForm] = useState({
    supplierName: "",
    itemName: "",
    itemCode: "",
    unit: "EA",
    plan: createEmptyMonthlyData(),
  });

  // Form state for actual entry
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [actualForm, setActualForm] = useState<MonthlyActual>(createEmptyMonthlyData());

  // Calculate totals
  const calculateTotal = (data: MonthlyPlan | MonthlyActual): number => {
    return Object.values(data).reduce((sum, val) => sum + val, 0);
  };

  // Calculate achievement rate
  const calculateAchievementRate = (plan: number, actual: number): number => {
    if (plan === 0) return actual > 0 ? 100 : 0;
    return Math.round((actual / plan) * 100);
  };

  // Handle plan form submission
  const handlePlanSubmit = () => {
    if (!planForm.supplierName || !planForm.itemName || !planForm.itemCode) {
      alert("공급업체명, 품목명, 품번을 입력해주세요.");
      return;
    }

    const newRecord: SupplierPlanActual = {
      id: Date.now(),
      supplierName: planForm.supplierName,
      itemName: planForm.itemName,
      itemCode: planForm.itemCode,
      unit: planForm.unit,
      plan: { ...planForm.plan },
      actual: createEmptyMonthlyData(),
      createdAt: new Date().toISOString(),
    };

    setRecords([...records, newRecord]);

    // Reset form
    setPlanForm({
      supplierName: "",
      itemName: "",
      itemCode: "",
      unit: "EA",
      plan: createEmptyMonthlyData(),
    });

    alert("납입계획이 등록되었습니다.");
  };

  // Handle actual form submission
  const handleActualSubmit = () => {
    if (selectedRecordId === null) {
      alert("실적을 입력할 항목을 선택해주세요.");
      return;
    }

    setRecords(
      records.map((r) =>
        r.id === selectedRecordId ? { ...r, actual: { ...actualForm } } : r
      )
    );

    setSelectedRecordId(null);
    setActualForm(createEmptyMonthlyData());
    alert("실적이 저장되었습니다.");
  };

  // Select record for actual entry
  const selectRecordForActual = (record: SupplierPlanActual) => {
    setSelectedRecordId(record.id);
    setActualForm({ ...record.actual });
  };

  // Delete record
  const deleteRecord = (id: number) => {
    if (confirm("이 항목을 삭제하시겠습니까?")) {
      setRecords(records.filter((r) => r.id !== id));
      if (selectedRecordId === id) {
        setSelectedRecordId(null);
        setActualForm(createEmptyMonthlyData());
      }
    }
  };

  // Filter records
  const filteredRecords = records.filter(
    (r) =>
      r.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      r.itemName.toLowerCase().includes(search.toLowerCase()) ||
      r.itemCode.toLowerCase().includes(search.toLowerCase())
  );

  // Group by supplier
  const groupBySupplier = () => {
    const grouped: Record<string, SupplierPlanActual[]> = {};
    records.forEach((r) => {
      if (!grouped[r.supplierName]) {
        grouped[r.supplierName] = [];
      }
      grouped[r.supplierName].push(r);
    });
    return grouped;
  };

  // Group by item
  const groupByItem = () => {
    const grouped: Record<string, SupplierPlanActual[]> = {};
    records.forEach((r) => {
      const key = `${r.itemName} (${r.itemCode})`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(r);
    });
    return grouped;
  };

  // Get achievement badge variant
  const getAchievementVariant = (rate: number): "default" | "secondary" | "destructive" | "outline" => {
    if (rate >= 100) return "default";
    if (rate >= 80) return "secondary";
    if (rate >= 50) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">2025년 공급자 납입계획대실적</h1>
          <p className="text-muted-foreground">1. 2025년 공급자 계획대 실적</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan-entry">납입계획 입력</TabsTrigger>
          <TabsTrigger value="actual-entry">실적 입력</TabsTrigger>
          <TabsTrigger value="by-supplier">업체별 현황</TabsTrigger>
          <TabsTrigger value="by-item">품목별 현황</TabsTrigger>
        </TabsList>

        {/* Tab 1: Plan Entry */}
        <TabsContent value="plan-entry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                납입계획 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>공급업체명 *</Label>
                    <Select
                      value={planForm.supplierName}
                      onValueChange={(v) => setPlanForm({ ...planForm, supplierName: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleSuppliers.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>품목명 *</Label>
                    <Select
                      value={planForm.itemName}
                      onValueChange={(v) => {
                        const item = sampleItems.find((i) => i.name === v);
                        setPlanForm({
                          ...planForm,
                          itemName: v,
                          itemCode: item?.code || "",
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="품목 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleItems.map((item) => (
                          <SelectItem key={item.code} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>품번</Label>
                    <Input
                      value={planForm.itemCode}
                      onChange={(e) => setPlanForm({ ...planForm, itemCode: e.target.value })}
                      placeholder="품번"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>단위</Label>
                    <Select
                      value={planForm.unit}
                      onValueChange={(v) => setPlanForm({ ...planForm, unit: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EA">EA</SelectItem>
                        <SelectItem value="KG">KG</SelectItem>
                        <SelectItem value="SET">SET</SelectItem>
                        <SelectItem value="BOX">BOX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">월별 계획수량</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {months.map((m) => (
                          <TableHead key={m.key} className="text-center min-w-[80px]">
                            {m.label}
                          </TableHead>
                        ))}
                        <TableHead className="text-center min-w-[100px] bg-muted">합계</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        {months.map((m) => (
                          <TableCell key={m.key} className="p-1">
                            <Input
                              type="number"
                              min={0}
                              value={planForm.plan[m.key] || ""}
                              onChange={(e) =>
                                setPlanForm({
                                  ...planForm,
                                  plan: {
                                    ...planForm.plan,
                                    [m.key]: parseInt(e.target.value) || 0,
                                  },
                                })
                              }
                              className="text-center"
                            />
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold bg-muted">
                          {calculateTotal(planForm.plan).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={handlePlanSubmit}>
                  <Plus className="mr-2 h-4 w-4" />
                  계획 등록
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Registered Plans List */}
          {records.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">등록된 납입계획</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>공급업체</TableHead>
                        <TableHead>품목명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>단위</TableHead>
                        <TableHead className="text-right">연간계획</TableHead>
                        <TableHead className="text-center">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.supplierName}</TableCell>
                          <TableCell>{record.itemName}</TableCell>
                          <TableCell className="font-mono">{record.itemCode}</TableCell>
                          <TableCell>{record.unit}</TableCell>
                          <TableCell className="text-right font-mono">
                            {calculateTotal(record.plan).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecord(record.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Actual Entry */}
        <TabsContent value="actual-entry">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Record Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-5 w-5" />
                  실적 입력 대상 선택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredRecords.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    등록된 계획이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => selectRecordForActual(record)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedRecordId === record.id
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        }`}
                      >
                        <p className="font-medium">{record.supplierName}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.itemName} ({record.itemCode})
                        </p>
                        <div className="flex justify-between mt-2 text-xs">
                          <span>계획: {calculateTotal(record.plan).toLocaleString()}</span>
                          <span>실적: {calculateTotal(record.actual).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actual Entry Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5" />
                  월별 실적수량 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRecordId === null ? (
                  <p className="text-muted-foreground text-center py-8">
                    왼쪽에서 실적을 입력할 항목을 선택해주세요.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {/* Selected Record Info */}
                    {(() => {
                      const selectedRecord = records.find((r) => r.id === selectedRecordId);
                      if (!selectedRecord) return null;
                      return (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="font-medium">
                            {selectedRecord.supplierName} - {selectedRecord.itemName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            품번: {selectedRecord.itemCode} / 단위: {selectedRecord.unit}
                          </p>
                        </div>
                      );
                    })()}

                    {/* Actual Entry Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">구분</TableHead>
                            {months.map((m) => (
                              <TableHead key={m.key} className="text-center min-w-[70px]">
                                {m.label}
                              </TableHead>
                            ))}
                            <TableHead className="text-center min-w-[80px] bg-muted">
                              합계
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Plan Row */}
                          <TableRow>
                            <TableCell className="font-medium">계획</TableCell>
                            {months.map((m) => {
                              const selectedRecord = records.find(
                                (r) => r.id === selectedRecordId
                              );
                              return (
                                <TableCell
                                  key={m.key}
                                  className="text-center text-muted-foreground"
                                >
                                  {selectedRecord?.plan[m.key].toLocaleString() || 0}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center bg-muted font-medium">
                              {(() => {
                                const selectedRecord = records.find(
                                  (r) => r.id === selectedRecordId
                                );
                                return selectedRecord
                                  ? calculateTotal(selectedRecord.plan).toLocaleString()
                                  : 0;
                              })()}
                            </TableCell>
                          </TableRow>

                          {/* Actual Row */}
                          <TableRow>
                            <TableCell className="font-medium">실적</TableCell>
                            {months.map((m) => (
                              <TableCell key={m.key} className="p-1">
                                <Input
                                  type="number"
                                  min={0}
                                  value={actualForm[m.key] || ""}
                                  onChange={(e) =>
                                    setActualForm({
                                      ...actualForm,
                                      [m.key]: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="text-center h-8"
                                />
                              </TableCell>
                            ))}
                            <TableCell className="text-center bg-muted font-bold">
                              {calculateTotal(actualForm).toLocaleString()}
                            </TableCell>
                          </TableRow>

                          {/* Achievement Rate Row */}
                          <TableRow>
                            <TableCell className="font-medium">달성률</TableCell>
                            {months.map((m) => {
                              const selectedRecord = records.find(
                                (r) => r.id === selectedRecordId
                              );
                              const planVal = selectedRecord?.plan[m.key] || 0;
                              const actualVal = actualForm[m.key] || 0;
                              const rate = calculateAchievementRate(planVal, actualVal);
                              return (
                                <TableCell key={m.key} className="text-center">
                                  <Badge variant={getAchievementVariant(rate)}>{rate}%</Badge>
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center bg-muted">
                              {(() => {
                                const selectedRecord = records.find(
                                  (r) => r.id === selectedRecordId
                                );
                                const planTotal = selectedRecord
                                  ? calculateTotal(selectedRecord.plan)
                                  : 0;
                                const actualTotal = calculateTotal(actualForm);
                                const rate = calculateAchievementRate(planTotal, actualTotal);
                                return <Badge variant={getAchievementVariant(rate)}>{rate}%</Badge>;
                              })()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleActualSubmit}>
                        <Save className="mr-2 h-4 w-4" />
                        실적 저장
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: By Supplier */}
        <TabsContent value="by-supplier">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                업체별 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  등록된 데이터가 없습니다.
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupBySupplier()).map(([supplierName, items]) => {
                    const totalPlan = items.reduce(
                      (sum, item) => sum + calculateTotal(item.plan),
                      0
                    );
                    const totalActual = items.reduce(
                      (sum, item) => sum + calculateTotal(item.actual),
                      0
                    );
                    const overallRate = calculateAchievementRate(totalPlan, totalActual);

                    return (
                      <div key={supplierName} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{supplierName}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              총 계획: {totalPlan.toLocaleString()} / 총 실적:{" "}
                              {totalActual.toLocaleString()}
                            </span>
                            <Badge variant={getAchievementVariant(overallRate)} className="text-lg">
                              {overallRate}%
                            </Badge>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>품목</TableHead>
                                <TableHead>품번</TableHead>
                                {months.map((m) => (
                                  <TableHead key={m.key} className="text-center text-xs">
                                    {m.label}
                                  </TableHead>
                                ))}
                                <TableHead className="text-center">합계</TableHead>
                                <TableHead className="text-center">달성률</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {items.map((item) => {
                                const planTotal = calculateTotal(item.plan);
                                const actualTotal = calculateTotal(item.actual);
                                const rate = calculateAchievementRate(planTotal, actualTotal);
                                return (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                      {item.itemCode}
                                    </TableCell>
                                    {months.map((m) => (
                                      <TableCell key={m.key} className="text-center text-xs">
                                        <div>{item.plan[m.key]}</div>
                                        <div className="text-muted-foreground">
                                          {item.actual[m.key]}
                                        </div>
                                      </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                      <div>{planTotal.toLocaleString()}</div>
                                      <div className="text-muted-foreground">
                                        {actualTotal.toLocaleString()}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={getAchievementVariant(rate)}>{rate}%</Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: By Item */}
        <TabsContent value="by-item">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                품목별 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  등록된 데이터가 없습니다.
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupByItem()).map(([itemKey, suppliers]) => {
                    const totalPlan = suppliers.reduce(
                      (sum, item) => sum + calculateTotal(item.plan),
                      0
                    );
                    const totalActual = suppliers.reduce(
                      (sum, item) => sum + calculateTotal(item.actual),
                      0
                    );
                    const overallRate = calculateAchievementRate(totalPlan, totalActual);

                    return (
                      <div key={itemKey} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{itemKey}</h3>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              총 계획: {totalPlan.toLocaleString()} / 총 실적:{" "}
                              {totalActual.toLocaleString()}
                            </span>
                            <Badge variant={getAchievementVariant(overallRate)} className="text-lg">
                              {overallRate}%
                            </Badge>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>공급업체</TableHead>
                                {months.map((m) => (
                                  <TableHead key={m.key} className="text-center text-xs">
                                    {m.label}
                                  </TableHead>
                                ))}
                                <TableHead className="text-center">합계</TableHead>
                                <TableHead className="text-center">달성률</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {suppliers.map((item) => {
                                const planTotal = calculateTotal(item.plan);
                                const actualTotal = calculateTotal(item.actual);
                                const rate = calculateAchievementRate(planTotal, actualTotal);
                                return (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.supplierName}</TableCell>
                                    {months.map((m) => (
                                      <TableCell key={m.key} className="text-center text-xs">
                                        <div>{item.plan[m.key]}</div>
                                        <div className="text-muted-foreground">
                                          {item.actual[m.key]}
                                        </div>
                                      </TableCell>
                                    ))}
                                    <TableCell className="text-center">
                                      <div>{planTotal.toLocaleString()}</div>
                                      <div className="text-muted-foreground">
                                        {actualTotal.toLocaleString()}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant={getAchievementVariant(rate)}>{rate}%</Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
