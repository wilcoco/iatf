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
  Calendar,
  Plus,
  Save,
  Trash2,
  FileSpreadsheet,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { getParts, getEquipments } from "@/lib/master-data";

// 생산계획 항목 타입
interface ProductionPlanItem {
  id: number;
  planYearMonth: string; // 계획년월 YYYY-MM
  itemName: string; // 품목명
  itemNo: string; // 품번
  customerName: string; // 고객사
  vehicleModel: string; // 차종
  unit: string; // 단위
  monthlyPlan: number[]; // 1월~12월 계획수량
  remarks: string; // 비고
}

// 일별 계획 항목 타입
interface DailyPlanItem {
  id: number;
  date: string; // YYYY-MM-DD
  itemName: string;
  itemNo: string;
  lineName: string; // 라인명
  weekNo: number; // 주차
  targetQty: number; // 목표수량
  shift: string; // 근무조 (주간/야간)
  remarks: string;
}

// 계획 vs 실적 항목 타입
interface PlanActualItem {
  id: number;
  month: number; // 1~12
  itemName: string;
  itemNo: string;
  planQty: number; // 계획수량
  actualQty: number; // 실적수량
  achievementRate: number; // 달성률 (%)
  status: "exceeded" | "achieved" | "underachieved"; // 초과/달성/미달
}

// 년간 추이 데이터 타입
interface AnnualTrendData {
  year: number;
  monthlyData: {
    month: number;
    planQty: number;
    actualQty: number;
  }[];
}

export default function ProductionSchedulePage() {
  const [activeTab, setActiveTab] = useState("plan-entry");

  // 기준정보에서 품목 및 설비 데이터 가져오기
  const parts = getParts();
  const equipments = getEquipments();

  // 설비 데이터에서 라인 목록 추출 (중복 제거)
  const lineOptions = [...new Set(equipments.map(eq => eq.line))];

  // 생산계획 입력 상태
  const [planItems, setPlanItems] = useState<ProductionPlanItem[]>([
    {
      id: 1,
      planYearMonth: "2020-01",
      itemName: "",
      itemNo: "",
      customerName: "",
      vehicleModel: "",
      unit: "EA",
      monthlyPlan: Array(12).fill(0),
      remarks: "",
    },
  ]);

  // 일별 생산계획 상태
  const [dailyPlanItems, setDailyPlanItems] = useState<DailyPlanItem[]>([
    {
      id: 1,
      date: "",
      itemName: "",
      itemNo: "",
      lineName: "",
      weekNo: 1,
      targetQty: 0,
      shift: "주간",
      remarks: "",
    },
  ]);

  // 계획 vs 실적 상태
  const [planActualItems, setPlanActualItems] = useState<PlanActualItem[]>([]);
  const [selectedYear, setSelectedYear] = useState("2020");
  const [selectedItemForComparison, setSelectedItemForComparison] = useState("");

  // 년간 추이 상태
  const [annualTrendData, setAnnualTrendData] = useState<AnnualTrendData | null>(null);
  const [trendYear, setTrendYear] = useState("2020");

  // 월 이름 배열
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  // 생산계획 입력 핸들러
  const addPlanItem = () => {
    setPlanItems([
      ...planItems,
      {
        id: Date.now(),
        planYearMonth: "2020-01",
        itemName: "",
        itemNo: "",
        customerName: "",
        vehicleModel: "",
        unit: "EA",
        monthlyPlan: Array(12).fill(0),
        remarks: "",
      },
    ]);
  };

  const removePlanItem = (id: number) => {
    if (planItems.length <= 1) return;
    setPlanItems(planItems.filter((item) => item.id !== id));
  };

  const updatePlanItem = (id: number, field: keyof ProductionPlanItem, value: string | number[]) => {
    setPlanItems(
      planItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const updateMonthlyPlan = (id: number, monthIndex: number, value: number) => {
    setPlanItems(
      planItems.map((item) => {
        if (item.id === id) {
          const newMonthlyPlan = [...item.monthlyPlan];
          newMonthlyPlan[monthIndex] = value;
          return { ...item, monthlyPlan: newMonthlyPlan };
        }
        return item;
      })
    );
  };

  // 일별 계획 핸들러
  const addDailyPlanItem = () => {
    setDailyPlanItems([
      ...dailyPlanItems,
      {
        id: Date.now(),
        date: "",
        itemName: "",
        itemNo: "",
        lineName: "",
        weekNo: 1,
        targetQty: 0,
        shift: "주간",
        remarks: "",
      },
    ]);
  };

  const removeDailyPlanItem = (id: number) => {
    if (dailyPlanItems.length <= 1) return;
    setDailyPlanItems(dailyPlanItems.filter((item) => item.id !== id));
  };

  const updateDailyPlanItem = (id: number, field: keyof DailyPlanItem, value: string | number) => {
    setDailyPlanItems(
      dailyPlanItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 계획 vs 실적 비교 생성
  const generatePlanActualComparison = () => {
    // 샘플 데이터 생성 (실제로는 API에서 가져올 데이터)
    const sampleData: PlanActualItem[] = [];
    for (let month = 1; month <= 12; month++) {
      const planQty = Math.floor(Math.random() * 5000) + 3000;
      const actualQty = Math.floor(Math.random() * 5500) + 2800;
      const achievementRate = Math.round((actualQty / planQty) * 100);
      let status: "exceeded" | "achieved" | "underachieved";
      if (achievementRate >= 105) {
        status = "exceeded";
      } else if (achievementRate >= 95) {
        status = "achieved";
      } else {
        status = "underachieved";
      }
      sampleData.push({
        id: month,
        month,
        itemName: selectedItemForComparison || "NQ5 PE FRT",
        itemNo: "MBD0023D784",
        planQty,
        actualQty,
        achievementRate,
        status,
      });
    }
    setPlanActualItems(sampleData);
  };

  // 년간 추이 데이터 생성
  const generateAnnualTrend = () => {
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      monthlyData.push({
        month,
        planQty: Math.floor(Math.random() * 5000) + 3000,
        actualQty: Math.floor(Math.random() * 5500) + 2800,
      });
    }
    setAnnualTrendData({
      year: parseInt(trendYear),
      monthlyData,
    });
  };

  // 요약 계산
  const totalPlanSummary = useMemo(() => {
    let totalPlan = 0;
    let totalActual = 0;
    planActualItems.forEach((item) => {
      totalPlan += item.planQty;
      totalActual += item.actualQty;
    });
    return {
      totalPlan,
      totalActual,
      overallRate: totalPlan > 0 ? Math.round((totalActual / totalPlan) * 100) : 0,
      exceededCount: planActualItems.filter((i) => i.status === "exceeded").length,
      achievedCount: planActualItems.filter((i) => i.status === "achieved").length,
      underachievedCount: planActualItems.filter((i) => i.status === "underachieved").length,
    };
  }, [planActualItems]);

  // 년간 총 계획수량 계산
  const yearlyPlanTotal = useMemo(() => {
    return planItems.reduce((total, item) => {
      return total + item.monthlyPlan.reduce((sum, qty) => sum + qty, 0);
    }, 0);
  }, [planItems]);

  // 저장 핸들러
  const handleSaveAll = () => {
    console.log("Saving production schedule:", {
      planItems,
      dailyPlanItems,
    });
    alert("생산계획이 저장되었습니다.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "exceeded":
        return <Badge className="bg-blue-500">초과 달성</Badge>;
      case "achieved":
        return <Badge className="bg-green-500">달성</Badge>;
      case "underachieved":
        return <Badge variant="destructive">미달</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">2020년 생산계획 현황표</h1>
          <p className="text-muted-foreground">생산계획 수립 및 실적 관리</p>
        </div>
        <Button onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" />
          전체 저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan-entry">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            생산계획 입력
          </TabsTrigger>
          <TabsTrigger value="daily-plan">
            <CalendarDays className="mr-2 h-4 w-4" />
            일별 생산계획
          </TabsTrigger>
          <TabsTrigger value="plan-actual">
            <BarChart3 className="mr-2 h-4 w-4" />
            계획 vs 실적
          </TabsTrigger>
          <TabsTrigger value="annual-trend">
            <TrendingUp className="mr-2 h-4 w-4" />
            년간 추이
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 생산계획 입력 */}
        <TabsContent value="plan-entry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  생산계획 입력
                </span>
                <Button onClick={addPlanItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 요약 정보 */}
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">등록 품목 수</p>
                        <p className="text-2xl font-bold">{planItems.length}</p>
                      </div>
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">년간 총 계획수량</p>
                        <p className="text-2xl font-bold">{yearlyPlanTotal.toLocaleString()}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[60px] text-center">No.</TableHead>
                      <TableHead className="min-w-[100px]">계획년월</TableHead>
                      <TableHead colSpan={2} className="min-w-[200px]">품목</TableHead>
                      <TableHead className="min-w-[100px]">고객사</TableHead>
                      <TableHead className="min-w-[80px]">차종</TableHead>
                      {monthNames.map((month, index) => (
                        <TableHead key={index} className="min-w-[80px] text-center">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="min-w-[60px]">단위</TableHead>
                      <TableHead className="min-w-[100px]">비고</TableHead>
                      <TableHead className="w-[60px] text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            type="month"
                            value={item.planYearMonth}
                            onChange={(e) => updatePlanItem(item.id, "planYearMonth", e.target.value)}
                            className="min-w-[120px]"
                          />
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Select
                            value={item.itemNo}
                            onValueChange={(v) => {
                              const selectedPart = parts.find(p => p.code === v);
                              if (selectedPart) {
                                updatePlanItem(item.id, "itemNo", selectedPart.code);
                                updatePlanItem(item.id, "itemName", selectedPart.name);
                                updatePlanItem(item.id, "customerName", selectedPart.customer);
                                updatePlanItem(item.id, "vehicleModel", selectedPart.vehicleModel);
                              }
                            }}
                          >
                            <SelectTrigger className="min-w-[200px]">
                              <SelectValue placeholder="품목 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {parts.map((part) => (
                                <SelectItem key={part.code} value={part.code}>
                                  {part.code} - {part.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.customerName}
                            readOnly
                            className="bg-muted"
                            placeholder="고객사"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.vehicleModel}
                            readOnly
                            className="bg-muted"
                            placeholder="차종"
                          />
                        </TableCell>
                        {item.monthlyPlan.map((qty, monthIndex) => (
                          <TableCell key={monthIndex}>
                            <Input
                              type="number"
                              value={qty || ""}
                              onChange={(e) => updateMonthlyPlan(item.id, monthIndex, parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="min-w-[70px] text-right"
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Select
                            value={item.unit}
                            onValueChange={(v) => updatePlanItem(item.id, "unit", v)}
                          >
                            <SelectTrigger className="min-w-[70px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EA">EA</SelectItem>
                              <SelectItem value="SET">SET</SelectItem>
                              <SelectItem value="KG">KG</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.remarks}
                            onChange={(e) => updatePlanItem(item.id, "remarks", e.target.value)}
                            placeholder="비고"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removePlanItem(item.id)}
                            disabled={planItems.length <= 1}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 일별 생산계획 */}
        <TabsContent value="daily-plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  일별 생산계획
                </span>
                <Button onClick={addDailyPlanItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">일별 계획 건수</p>
                        <p className="text-2xl font-bold">{dailyPlanItems.length}</p>
                      </div>
                      <CalendarDays className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">총 목표수량</p>
                        <p className="text-2xl font-bold">
                          {dailyPlanItems.reduce((sum, item) => sum + item.targetQty, 0).toLocaleString()}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[60px] text-center">No.</TableHead>
                      <TableHead className="min-w-[130px]">날짜</TableHead>
                      <TableHead className="min-w-[60px] text-center">주차</TableHead>
                      <TableHead colSpan={2} className="min-w-[200px]">품목</TableHead>
                      <TableHead className="min-w-[100px]">라인명</TableHead>
                      <TableHead className="min-w-[80px]">근무조</TableHead>
                      <TableHead className="min-w-[100px] text-right">목표수량</TableHead>
                      <TableHead className="min-w-[100px]">비고</TableHead>
                      <TableHead className="w-[60px] text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyPlanItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) => updateDailyPlanItem(item.id, "date", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.weekNo.toString()}
                            onValueChange={(v) => updateDailyPlanItem(item.id, "weekNo", parseInt(v))}
                          >
                            <SelectTrigger className="min-w-[60px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((week) => (
                                <SelectItem key={week} value={week.toString()}>
                                  {week}주
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell colSpan={2}>
                          <Select
                            value={item.itemNo}
                            onValueChange={(v) => {
                              const selectedPart = parts.find(p => p.code === v);
                              if (selectedPart) {
                                updateDailyPlanItem(item.id, "itemNo", selectedPart.code);
                                updateDailyPlanItem(item.id, "itemName", selectedPart.name);
                              }
                            }}
                          >
                            <SelectTrigger className="min-w-[200px]">
                              <SelectValue placeholder="품목 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {parts.map((part) => (
                                <SelectItem key={part.code} value={part.code}>
                                  {part.code} - {part.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.lineName}
                            onValueChange={(v) => updateDailyPlanItem(item.id, "lineName", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="라인 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {lineOptions.map((line) => (
                                <SelectItem key={line} value={line}>
                                  {line}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.shift}
                            onValueChange={(v) => updateDailyPlanItem(item.id, "shift", v)}
                          >
                            <SelectTrigger className="min-w-[70px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="주간">주간</SelectItem>
                              <SelectItem value="야간">야간</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.targetQty || ""}
                            onChange={(e) => updateDailyPlanItem(item.id, "targetQty", parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.remarks}
                            onChange={(e) => updateDailyPlanItem(item.id, "remarks", e.target.value)}
                            placeholder="비고"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeDailyPlanItem(item.id)}
                            disabled={dailyPlanItems.length <= 1}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 계획 vs 실적 */}
        <TabsContent value="plan-actual">
          <div className="space-y-6">
            {/* 조회 조건 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  계획 vs 실적 비교
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Label>년도</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2020">2020년</SelectItem>
                        <SelectItem value="2021">2021년</SelectItem>
                        <SelectItem value="2022">2022년</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>품목명</Label>
                    <Input
                      value={selectedItemForComparison}
                      onChange={(e) => setSelectedItemForComparison(e.target.value)}
                      placeholder="품목명 입력"
                      className="w-[200px]"
                    />
                  </div>
                  <Button onClick={generatePlanActualComparison}>
                    조회
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 요약 카드 */}
            {planActualItems.length > 0 && (
              <div className="grid gap-4 md:grid-cols-5">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">총 계획</p>
                        <p className="text-2xl font-bold">{totalPlanSummary.totalPlan.toLocaleString()}</p>
                      </div>
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">총 실적</p>
                        <p className="text-2xl font-bold">{totalPlanSummary.totalActual.toLocaleString()}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">달성률</p>
                        <p className="text-2xl font-bold">{totalPlanSummary.overallRate}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">초과 달성</p>
                        <p className="text-2xl font-bold text-blue-600">{totalPlanSummary.exceededCount}개월</p>
                      </div>
                      <ArrowUpRight className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">미달</p>
                        <p className="text-2xl font-bold text-red-600">{totalPlanSummary.underachievedCount}개월</p>
                      </div>
                      <ArrowDownRight className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 비교 테이블 */}
            {planActualItems.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>월별 계획/실적 비교표</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">월</TableHead>
                        <TableHead className="text-center">품목명</TableHead>
                        <TableHead className="text-center">품번</TableHead>
                        <TableHead className="text-right">계획수량</TableHead>
                        <TableHead className="text-right">실적수량</TableHead>
                        <TableHead className="text-right">차이</TableHead>
                        <TableHead className="text-center">달성률</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planActualItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center font-medium">{item.month}월</TableCell>
                          <TableCell className="text-center">{item.itemName}</TableCell>
                          <TableCell className="text-center font-mono">{item.itemNo}</TableCell>
                          <TableCell className="text-right">{item.planQty.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.actualQty.toLocaleString()}</TableCell>
                          <TableCell className={`text-right ${item.actualQty - item.planQty >= 0 ? "text-blue-600" : "text-red-600"}`}>
                            {item.actualQty - item.planQty >= 0 ? "+" : ""}
                            {(item.actualQty - item.planQty).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={
                              item.achievementRate >= 100
                                ? "text-green-600 font-semibold"
                                : item.achievementRate >= 95
                                ? "text-yellow-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }>
                              {item.achievementRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(item.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    조회 조건을 입력하고 조회 버튼을 클릭하세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: 년간 추이 */}
        <TabsContent value="annual-trend">
          <div className="space-y-6">
            {/* 조회 조건 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  년간 생산 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Label>년도</Label>
                    <Select value={trendYear} onValueChange={setTrendYear}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2020">2020년</SelectItem>
                        <SelectItem value="2021">2021년</SelectItem>
                        <SelectItem value="2022">2022년</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateAnnualTrend}>
                    조회
                  </Button>
                </div>
              </CardContent>
            </Card>

            {annualTrendData ? (
              <>
                {/* 추이 차트 (막대 시각화) */}
                <Card>
                  <CardHeader>
                    <CardTitle>{annualTrendData.year}년 월별 생산 추이</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {annualTrendData.monthlyData.map((data) => {
                        const maxQty = Math.max(
                          ...annualTrendData.monthlyData.map((d) => Math.max(d.planQty, d.actualQty))
                        );
                        const planWidth = (data.planQty / maxQty) * 100;
                        const actualWidth = (data.actualQty / maxQty) * 100;
                        const achievementRate = Math.round((data.actualQty / data.planQty) * 100);

                        return (
                          <div key={data.month} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium w-16">{data.month}월</span>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span>계획: {data.planQty.toLocaleString()}</span>
                                <span>실적: {data.actualQty.toLocaleString()}</span>
                                <span className={
                                  achievementRate >= 100 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                                }>
                                  {achievementRate}%
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs w-8">계획</span>
                                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                                  <div
                                    className="bg-blue-500 h-full rounded-full transition-all"
                                    style={{ width: `${planWidth}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs w-8">실적</span>
                                <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${
                                      achievementRate >= 100 ? "bg-green-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${actualWidth}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded" />
                        <span>계획</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded" />
                        <span>실적 (달성)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded" />
                        <span>실적 (미달)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상세 테이블 */}
                <Card>
                  <CardHeader>
                    <CardTitle>월별 상세 데이터</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">월</TableHead>
                          <TableHead className="text-right">계획수량</TableHead>
                          <TableHead className="text-right">실적수량</TableHead>
                          <TableHead className="text-right">차이</TableHead>
                          <TableHead className="text-center">달성률</TableHead>
                          <TableHead className="text-center">전월 대비</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {annualTrendData.monthlyData.map((data, index) => {
                          const diff = data.actualQty - data.planQty;
                          const achievementRate = Math.round((data.actualQty / data.planQty) * 100);
                          const prevMonthActual = index > 0 ? annualTrendData.monthlyData[index - 1].actualQty : null;
                          const momChange = prevMonthActual
                            ? Math.round(((data.actualQty - prevMonthActual) / prevMonthActual) * 100)
                            : null;

                          return (
                            <TableRow key={data.month}>
                              <TableCell className="text-center font-medium">{data.month}월</TableCell>
                              <TableCell className="text-right">{data.planQty.toLocaleString()}</TableCell>
                              <TableCell className="text-right">{data.actualQty.toLocaleString()}</TableCell>
                              <TableCell className={`text-right ${diff >= 0 ? "text-blue-600" : "text-red-600"}`}>
                                {diff >= 0 ? "+" : ""}{diff.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={
                                  achievementRate >= 100
                                    ? "text-green-600 font-semibold"
                                    : achievementRate >= 95
                                    ? "text-yellow-600 font-semibold"
                                    : "text-red-600 font-semibold"
                                }>
                                  {achievementRate}%
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {momChange !== null ? (
                                  <span className={momChange >= 0 ? "text-green-600" : "text-red-600"}>
                                    {momChange >= 0 ? "+" : ""}{momChange}%
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
                  </CardContent>
                </Card>

                {/* 년간 요약 */}
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">년간 총 계획</p>
                        <p className="font-medium text-lg">
                          {annualTrendData.monthlyData.reduce((sum, d) => sum + d.planQty, 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">년간 총 실적</p>
                        <p className="font-medium text-lg">
                          {annualTrendData.monthlyData.reduce((sum, d) => sum + d.actualQty, 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">년간 평균 달성률</p>
                        <p className="font-medium text-lg">
                          {Math.round(
                            annualTrendData.monthlyData.reduce((sum, d) => sum + d.actualQty, 0) /
                            annualTrendData.monthlyData.reduce((sum, d) => sum + d.planQty, 0) * 100
                          )}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">월 평균 생산량</p>
                        <p className="font-medium text-lg">
                          {Math.round(
                            annualTrendData.monthlyData.reduce((sum, d) => sum + d.actualQty, 0) / 12
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    년도를 선택하고 조회 버튼을 클릭하세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
