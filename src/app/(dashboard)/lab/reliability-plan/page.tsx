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
import { ClipboardCheck, Plus, Trash2, Settings, Calendar, BarChart3 } from "lucide-react";

// Types
interface TestPlanItem {
  id: string;
  vehicleType: string;
  partName: string;
  testConditions: string;
  isRegulatory: boolean;
  monthlyStatus: MonthStatus[];
}

interface MonthStatus {
  month: number;
  status: "none" | "planned" | "completed";
}

interface HeaderSettings {
  year: string;
  regularCycle: string;
  regulatoryCycle: string;
}

// Initial data
const createEmptyMonthlyStatus = (): MonthStatus[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    status: "none" as const,
  }));
};

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default function ReliabilityPlanPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Header settings state
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>({
    year: new Date().getFullYear().toString(),
    regularCycle: "1회/6개월",
    regulatoryCycle: "1회/3개월",
  });

  // Test plan items state
  const [planItems, setPlanItems] = useState<TestPlanItem[]>([
    {
      id: "1",
      vehicleType: "NE1",
      partName: "브레이크 패드",
      testConditions: "내구성 시험 10만회",
      isRegulatory: true,
      monthlyStatus: createEmptyMonthlyStatus().map((m, i) => ({
        ...m,
        status: i === 2 ? "completed" : i === 5 ? "planned" : "none",
      })),
    },
    {
      id: "2",
      vehicleType: "NE1",
      partName: "에어백 모듈",
      testConditions: "충격 시험 KS R 4030",
      isRegulatory: true,
      monthlyStatus: createEmptyMonthlyStatus().map((m, i) => ({
        ...m,
        status: i === 0 ? "completed" : i === 3 ? "completed" : i === 6 ? "planned" : i === 9 ? "planned" : "none",
      })),
    },
    {
      id: "3",
      vehicleType: "DN8",
      partName: "도어 힌지",
      testConditions: "개폐 내구 5만회",
      isRegulatory: false,
      monthlyStatus: createEmptyMonthlyStatus().map((m, i) => ({
        ...m,
        status: i === 1 ? "completed" : i === 7 ? "planned" : "none",
      })),
    },
  ]);

  // New item form state
  const [newItem, setNewItem] = useState({
    vehicleType: "",
    partName: "",
    testConditions: "",
    isRegulatory: false,
  });

  // Add new test plan item
  const handleAddItem = () => {
    if (!newItem.vehicleType || !newItem.partName || !newItem.testConditions) {
      alert("차종, 품명, 시험조건을 모두 입력해주세요.");
      return;
    }

    const newPlanItem: TestPlanItem = {
      id: Date.now().toString(),
      vehicleType: newItem.vehicleType,
      partName: newItem.partName,
      testConditions: newItem.testConditions,
      isRegulatory: newItem.isRegulatory,
      monthlyStatus: createEmptyMonthlyStatus(),
    };

    setPlanItems([...planItems, newPlanItem]);
    setNewItem({
      vehicleType: "",
      partName: "",
      testConditions: "",
      isRegulatory: false,
    });
  };

  // Remove test plan item
  const handleRemoveItem = (id: string) => {
    setPlanItems(planItems.filter((item) => item.id !== id));
  };

  // Toggle monthly status (none -> planned -> completed -> none)
  const toggleMonthStatus = (itemId: string, monthIndex: number) => {
    setPlanItems(
      planItems.map((item) => {
        if (item.id === itemId) {
          const newMonthlyStatus = [...item.monthlyStatus];
          const currentStatus = newMonthlyStatus[monthIndex].status;
          let nextStatus: "none" | "planned" | "completed" = "none";

          if (currentStatus === "none") nextStatus = "planned";
          else if (currentStatus === "planned") nextStatus = "completed";
          else nextStatus = "none";

          newMonthlyStatus[monthIndex] = {
            ...newMonthlyStatus[monthIndex],
            status: nextStatus,
          };

          return { ...item, monthlyStatus: newMonthlyStatus };
        }
        return item;
      })
    );
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    let totalPlanned = 0;
    let totalCompleted = 0;
    let regulatoryPlanned = 0;
    let regulatoryCompleted = 0;
    let regularPlanned = 0;
    let regularCompleted = 0;

    planItems.forEach((item) => {
      item.monthlyStatus.forEach((m) => {
        if (m.status === "planned") {
          totalPlanned++;
          if (item.isRegulatory) regulatoryPlanned++;
          else regularPlanned++;
        } else if (m.status === "completed") {
          totalCompleted++;
          if (item.isRegulatory) regulatoryCompleted++;
          else regularCompleted++;
        }
      });
    });

    return {
      totalPlanned,
      totalCompleted,
      regulatoryPlanned,
      regulatoryCompleted,
      regularPlanned,
      regularCompleted,
      completionRate: totalPlanned + totalCompleted > 0
        ? Math.round((totalCompleted / (totalPlanned + totalCompleted)) * 100)
        : 0,
    };
  };

  const stats = getSummaryStats();

  // Render status symbol
  const renderStatusSymbol = (status: "none" | "planned" | "completed") => {
    if (status === "planned") {
      return <span className="text-blue-600 text-xl font-bold cursor-pointer hover:scale-125 transition-transform">○</span>;
    }
    if (status === "completed") {
      return <span className="text-green-600 text-xl font-bold cursor-pointer hover:scale-125 transition-transform">●</span>;
    }
    return <span className="text-gray-300 text-xl cursor-pointer hover:text-gray-500">-</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">신뢰성시험 계획</h1>
          <p className="text-muted-foreground">{headerSettings.year}년 연간 신뢰성 시험 계획 관리</p>
        </div>
      </div>

      {/* Legend */}
      <Card className="bg-muted/30">
        <CardContent className="py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium">범례:</span>
            <span className="flex items-center gap-2">
              <span className="text-blue-600 text-lg font-bold">○</span>
              <span>= 계획</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-600 text-lg font-bold">●</span>
              <span>= 완료</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gray-400">-</span>
              <span>= 미계획</span>
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            개요 및 설정
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            월별 계획 매트릭스
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            시험 결과 요약
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Header Settings */}
        <TabsContent value="overview">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  시험 주기 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>대상 년도</Label>
                    <Select
                      value={headerSettings.year}
                      onValueChange={(v) => setHeaderSettings({ ...headerSettings, year: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>정기신뢰성 주기</Label>
                    <Select
                      value={headerSettings.regularCycle}
                      onValueChange={(v) => setHeaderSettings({ ...headerSettings, regularCycle: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1회/3개월">1회/3개월</SelectItem>
                        <SelectItem value="1회/6개월">1회/6개월</SelectItem>
                        <SelectItem value="1회/12개월">1회/12개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>법규사항 신뢰성 주기</Label>
                    <Select
                      value={headerSettings.regulatoryCycle}
                      onValueChange={(v) => setHeaderSettings({ ...headerSettings, regulatoryCycle: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1회/1개월">1회/1개월</SelectItem>
                        <SelectItem value="1회/3개월">1회/3개월</SelectItem>
                        <SelectItem value="1회/6개월">1회/6개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                  <Card className="bg-blue-50 dark:bg-blue-950/20">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">정기신뢰성 시험</div>
                      <div className="text-2xl font-bold text-blue-600">{headerSettings.regularCycle}</div>
                      <div className="text-xs text-muted-foreground mt-1">일반 부품 신뢰성 검증</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 dark:bg-amber-950/20">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">법규사항 신뢰성 시험</div>
                      <div className="text-2xl font-bold text-amber-600">{headerSettings.regulatoryCycle}</div>
                      <div className="text-xs text-muted-foreground mt-1">법규 준수 필수 항목</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>등록된 시험 항목 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{planItems.length}</div>
                    <div className="text-sm text-muted-foreground">총 시험 항목</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-amber-600">
                      {planItems.filter((i) => i.isRegulatory).length}
                    </div>
                    <div className="text-sm text-muted-foreground">법규 항목</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {planItems.filter((i) => !i.isRegulatory).length}
                    </div>
                    <div className="text-sm text-muted-foreground">정기 항목</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{stats.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">완료율</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Monthly Plan Matrix */}
        <TabsContent value="monthly">
          <div className="space-y-6">
            {/* Add new item form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  시험 항목 추가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5 items-end">
                  <div className="space-y-2">
                    <Label>차종 *</Label>
                    <Input
                      value={newItem.vehicleType}
                      onChange={(e) => setNewItem({ ...newItem, vehicleType: e.target.value })}
                      placeholder="예: NE1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품명 *</Label>
                    <Input
                      value={newItem.partName}
                      onChange={(e) => setNewItem({ ...newItem, partName: e.target.value })}
                      placeholder="예: 브레이크 패드"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>시험조건 *</Label>
                    <Input
                      value={newItem.testConditions}
                      onChange={(e) => setNewItem({ ...newItem, testConditions: e.target.value })}
                      placeholder="예: 내구성 시험 10만회"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>법규 여부</Label>
                    <Select
                      value={newItem.isRegulatory ? "Y" : "N"}
                      onValueChange={(v) => setNewItem({ ...newItem, isRegulatory: v === "Y" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Y (법규)</SelectItem>
                        <SelectItem value="N">N (정기)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monthly matrix table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  {headerSettings.year}년 월별 시험 계획
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] sticky left-0 bg-background">차종</TableHead>
                        <TableHead className="w-[150px]">품명</TableHead>
                        <TableHead className="w-[200px]">시험조건</TableHead>
                        <TableHead className="w-[70px] text-center">법규</TableHead>
                        {MONTHS.map((month) => (
                          <TableHead key={month} className="w-[50px] text-center">
                            {month}
                          </TableHead>
                        ))}
                        <TableHead className="w-[60px] text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={17} className="text-center py-8 text-muted-foreground">
                            등록된 시험 항목이 없습니다. 위 폼에서 항목을 추가해주세요.
                          </TableCell>
                        </TableRow>
                      ) : (
                        planItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium sticky left-0 bg-background">
                              {item.vehicleType}
                            </TableCell>
                            <TableCell>{item.partName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.testConditions}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={item.isRegulatory ? "default" : "secondary"}>
                                {item.isRegulatory ? "Y" : "N"}
                              </Badge>
                            </TableCell>
                            {item.monthlyStatus.map((m, idx) => (
                              <TableCell
                                key={idx}
                                className="text-center cursor-pointer hover:bg-muted/50"
                                onClick={() => toggleMonthStatus(item.id, idx)}
                              >
                                {renderStatusSymbol(m.status)}
                              </TableCell>
                            ))}
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * 월별 셀을 클릭하여 상태를 변경할 수 있습니다 (미계획 → 계획 → 완료 → 미계획)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Test Results Summary */}
        <TabsContent value="summary">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">전체 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">계획 건수</span>
                      <span className="text-xl font-bold text-blue-600">{stats.totalPlanned}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">완료 건수</span>
                      <span className="text-xl font-bold text-green-600">{stats.totalCompleted}건</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">완료율</span>
                      <span className="text-2xl font-bold">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">법규 시험 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">계획 건수</span>
                      <span className="text-xl font-bold text-blue-600">{stats.regulatoryPlanned}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">완료 건수</span>
                      <span className="text-xl font-bold text-green-600">{stats.regulatoryCompleted}건</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">완료율</span>
                      <span className="text-2xl font-bold">
                        {stats.regulatoryPlanned + stats.regulatoryCompleted > 0
                          ? Math.round((stats.regulatoryCompleted / (stats.regulatoryPlanned + stats.regulatoryCompleted)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-amber-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${stats.regulatoryPlanned + stats.regulatoryCompleted > 0
                            ? Math.round((stats.regulatoryCompleted / (stats.regulatoryPlanned + stats.regulatoryCompleted)) * 100)
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">정기 시험 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">계획 건수</span>
                      <span className="text-xl font-bold text-blue-600">{stats.regularPlanned}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">완료 건수</span>
                      <span className="text-xl font-bold text-green-600">{stats.regularCompleted}건</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">완료율</span>
                      <span className="text-2xl font-bold">
                        {stats.regularPlanned + stats.regularCompleted > 0
                          ? Math.round((stats.regularCompleted / (stats.regularPlanned + stats.regularCompleted)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${stats.regularPlanned + stats.regularCompleted > 0
                            ? Math.round((stats.regularCompleted / (stats.regularPlanned + stats.regularCompleted)) * 100)
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>월별 시험 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-center">계획</TableHead>
                      <TableHead className="text-center">완료</TableHead>
                      <TableHead className="text-center">완료율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MONTHS.map((month, idx) => {
                      const monthPlanned = planItems.reduce((acc, item) =>
                        acc + (item.monthlyStatus[idx].status === "planned" ? 1 : 0), 0);
                      const monthCompleted = planItems.reduce((acc, item) =>
                        acc + (item.monthlyStatus[idx].status === "completed" ? 1 : 0), 0);
                      const monthTotal = monthPlanned + monthCompleted;
                      const monthRate = monthTotal > 0 ? Math.round((monthCompleted / monthTotal) * 100) : 0;

                      return (
                        <TableRow key={month}>
                          <TableCell className="font-medium">{month}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-blue-600">
                              {monthPlanned}건
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-green-600">
                              {monthCompleted}건
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {monthTotal > 0 ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${monthRate}%` }}
                                  />
                                </div>
                                <span className="text-sm">{monthRate}%</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Detailed list by vehicle type */}
            <Card>
              <CardHeader>
                <CardTitle>차종별 상세 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>차종</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead>법규 여부</TableHead>
                      <TableHead className="text-center">계획</TableHead>
                      <TableHead className="text-center">완료</TableHead>
                      <TableHead className="text-center">진행 상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planItems.map((item) => {
                      const itemPlanned = item.monthlyStatus.filter((m) => m.status === "planned").length;
                      const itemCompleted = item.monthlyStatus.filter((m) => m.status === "completed").length;
                      const itemTotal = itemPlanned + itemCompleted;
                      const itemRate = itemTotal > 0 ? Math.round((itemCompleted / itemTotal) * 100) : 0;

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.vehicleType}</TableCell>
                          <TableCell>{item.partName}</TableCell>
                          <TableCell>
                            <Badge variant={item.isRegulatory ? "default" : "secondary"}>
                              {item.isRegulatory ? "법규" : "정기"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-blue-600">{itemPlanned}건</TableCell>
                          <TableCell className="text-center text-green-600">{itemCompleted}건</TableCell>
                          <TableCell className="text-center">
                            {itemTotal > 0 ? (
                              <Badge
                                variant={itemRate === 100 ? "default" : itemRate > 0 ? "secondary" : "outline"}
                                className={itemRate === 100 ? "bg-green-600" : ""}
                              >
                                {itemRate}% 완료
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">미계획</span>
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
      </Tabs>
    </div>
  );
}
