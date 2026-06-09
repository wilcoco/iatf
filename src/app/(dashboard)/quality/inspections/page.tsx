"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, ClipboardCheck, Calendar, CheckCircle, BarChart3, History, Search } from "lucide-react";

// Types
interface InspectionPlan {
  id: number;
  planYear: number;
  halfYear: "first" | "second"; // 상반기/하반기
  inspectionItem: string;
  targetProduct: string;
  inspectionCycle: string;
  scheduledDate: string;
}

interface InspectionActual {
  id: number;
  inspectionDate: string;
  inspectionItem: string;
  result: "pass" | "fail" | "conditional";
  inspector: string;
  planId?: number;
  notes?: string;
}

interface PlanVsActual {
  planId: number;
  inspectionItem: string;
  targetProduct: string;
  plannedDate: string;
  actualDate?: string;
  status: "completed" | "pending" | "overdue";
  achievementRate: number;
}

// Mock data
const mockPlans: InspectionPlan[] = [
  { id: 1, planYear: 2026, halfYear: "first", inspectionItem: "외관검사", targetProduct: "PCB-A001", inspectionCycle: "월 1회", scheduledDate: "2026-01-15" },
  { id: 2, planYear: 2026, halfYear: "first", inspectionItem: "치수검사", targetProduct: "PCB-A001", inspectionCycle: "월 1회", scheduledDate: "2026-01-20" },
  { id: 3, planYear: 2026, halfYear: "first", inspectionItem: "전기적검사", targetProduct: "PCB-B002", inspectionCycle: "분기 1회", scheduledDate: "2026-02-01" },
  { id: 4, planYear: 2026, halfYear: "first", inspectionItem: "외관검사", targetProduct: "PCB-B002", inspectionCycle: "월 1회", scheduledDate: "2026-02-15" },
  { id: 5, planYear: 2026, halfYear: "first", inspectionItem: "기능검사", targetProduct: "PCB-C003", inspectionCycle: "월 2회", scheduledDate: "2026-03-01" },
  { id: 6, planYear: 2026, halfYear: "second", inspectionItem: "외관검사", targetProduct: "PCB-A001", inspectionCycle: "월 1회", scheduledDate: "2026-07-15" },
  { id: 7, planYear: 2026, halfYear: "second", inspectionItem: "치수검사", targetProduct: "PCB-A001", inspectionCycle: "월 1회", scheduledDate: "2026-07-20" },
  { id: 8, planYear: 2026, halfYear: "second", inspectionItem: "전기적검사", targetProduct: "PCB-B002", inspectionCycle: "분기 1회", scheduledDate: "2026-08-01" },
];

const mockActuals: InspectionActual[] = [
  { id: 1, inspectionDate: "2026-01-15", inspectionItem: "외관검사", result: "pass", inspector: "김검사", planId: 1, notes: "이상 없음" },
  { id: 2, inspectionDate: "2026-01-20", inspectionItem: "치수검사", result: "pass", inspector: "이검사", planId: 2, notes: "규격 내" },
  { id: 3, inspectionDate: "2026-02-02", inspectionItem: "전기적검사", result: "conditional", inspector: "박검사", planId: 3, notes: "재검사 필요" },
  { id: 4, inspectionDate: "2026-02-15", inspectionItem: "외관검사", result: "pass", inspector: "김검사", planId: 4 },
  { id: 5, inspectionDate: "2026-03-05", inspectionItem: "기능검사", result: "fail", inspector: "최검사", planId: 5, notes: "불량 발견" },
];

export default function InspectionsPage() {
  const [activeTab, setActiveTab] = useState("plan");

  // Tab 1: Plan state
  const [plans, setPlans] = useState<InspectionPlan[]>(mockPlans);
  const [planFilter, setPlanFilter] = useState({ year: "2026", halfYear: "all" });
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<InspectionPlan>>({
    planYear: 2026,
    halfYear: "first",
    inspectionItem: "",
    targetProduct: "",
    inspectionCycle: "",
    scheduledDate: "",
  });

  // Tab 2: Actual entry state
  const [actuals, setActuals] = useState<InspectionActual[]>(mockActuals);
  const [showActualForm, setShowActualForm] = useState(false);
  const [newActual, setNewActual] = useState<Partial<InspectionActual>>({
    inspectionDate: "",
    inspectionItem: "",
    result: "pass",
    inspector: "",
    notes: "",
  });

  // Tab 3: Plan vs Actual state - computed
  const planVsActualData: PlanVsActual[] = plans.map((plan) => {
    const actual = actuals.find((a) => a.planId === plan.id);
    const today = new Date();
    const plannedDate = new Date(plan.scheduledDate);

    let status: "completed" | "pending" | "overdue" = "pending";
    if (actual) {
      status = "completed";
    } else if (plannedDate < today) {
      status = "overdue";
    }

    return {
      planId: plan.id,
      inspectionItem: plan.inspectionItem,
      targetProduct: plan.targetProduct,
      plannedDate: plan.scheduledDate,
      actualDate: actual?.inspectionDate,
      status,
      achievementRate: actual ? 100 : 0,
    };
  });

  // Tab 4: History filter state
  const [historyFilter, setHistoryFilter] = useState({ halfYear: "all", inspectionItem: "all" });

  // Helper functions
  const halfYearLabels: Record<string, string> = {
    first: "상반기",
    second: "하반기",
  };

  const resultColors: Record<string, string> = {
    pass: "bg-green-100 text-green-800",
    fail: "bg-red-100 text-red-800",
    conditional: "bg-yellow-100 text-yellow-800",
  };

  const resultLabels: Record<string, string> = {
    pass: "합격",
    fail: "불합격",
    conditional: "조건부합격",
  };

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    completed: "완료",
    pending: "대기",
    overdue: "미실시",
  };

  // Filter functions
  const filteredPlans = plans.filter((plan) => {
    if (planFilter.year !== "all" && plan.planYear.toString() !== planFilter.year) return false;
    if (planFilter.halfYear !== "all" && plan.halfYear !== planFilter.halfYear) return false;
    return true;
  });

  const filteredHistory = actuals.filter((actual) => {
    const plan = plans.find((p) => p.id === actual.planId);
    if (historyFilter.halfYear !== "all" && plan?.halfYear !== historyFilter.halfYear) return false;
    if (historyFilter.inspectionItem !== "all" && actual.inspectionItem !== historyFilter.inspectionItem) return false;
    return true;
  });

  // Statistics for Tab 3
  const firstHalfPlans = planVsActualData.filter((p) => {
    const plan = plans.find((pl) => pl.id === p.planId);
    return plan?.halfYear === "first";
  });
  const secondHalfPlans = planVsActualData.filter((p) => {
    const plan = plans.find((pl) => pl.id === p.planId);
    return plan?.halfYear === "second";
  });

  const firstHalfCompleted = firstHalfPlans.filter((p) => p.status === "completed").length;
  const secondHalfCompleted = secondHalfPlans.filter((p) => p.status === "completed").length;
  const firstHalfRate = firstHalfPlans.length > 0 ? Math.round((firstHalfCompleted / firstHalfPlans.length) * 100) : 0;
  const secondHalfRate = secondHalfPlans.length > 0 ? Math.round((secondHalfCompleted / secondHalfPlans.length) * 100) : 0;

  // Unique inspection items for filter
  const uniqueInspectionItems = [...new Set(actuals.map((a) => a.inspectionItem))];

  // Add plan handler
  const handleAddPlan = () => {
    if (newPlan.inspectionItem && newPlan.targetProduct && newPlan.inspectionCycle && newPlan.scheduledDate) {
      const plan: InspectionPlan = {
        id: plans.length + 1,
        planYear: newPlan.planYear || 2026,
        halfYear: newPlan.halfYear as "first" | "second" || "first",
        inspectionItem: newPlan.inspectionItem,
        targetProduct: newPlan.targetProduct,
        inspectionCycle: newPlan.inspectionCycle,
        scheduledDate: newPlan.scheduledDate,
      };
      setPlans([...plans, plan]);
      setNewPlan({
        planYear: 2026,
        halfYear: "first",
        inspectionItem: "",
        targetProduct: "",
        inspectionCycle: "",
        scheduledDate: "",
      });
      setShowPlanForm(false);
    }
  };

  // Add actual handler
  const handleAddActual = () => {
    if (newActual.inspectionDate && newActual.inspectionItem && newActual.result && newActual.inspector) {
      const actual: InspectionActual = {
        id: actuals.length + 1,
        inspectionDate: newActual.inspectionDate,
        inspectionItem: newActual.inspectionItem,
        result: newActual.result as "pass" | "fail" | "conditional",
        inspector: newActual.inspector,
        notes: newActual.notes,
      };
      setActuals([...actuals, actual]);
      setNewActual({
        inspectionDate: "",
        inspectionItem: "",
        result: "pass",
        inspector: "",
        notes: "",
      });
      setShowActualForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">정기검사 계획대 실적</h1>
          <p className="text-muted-foreground">6개월 정기검사 계획 및 실적 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            검사 계획
          </TabsTrigger>
          <TabsTrigger value="actual" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            실적 입력
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            계획대 실적
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            검사 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 6개월 정기검사 계획 */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  6개월 정기검사 계획
                </CardTitle>
                <Button onClick={() => setShowPlanForm(!showPlanForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  계획 등록
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="w-40">
                  <Label>계획년도</Label>
                  <Select value={planFilter.year} onValueChange={(v) => setPlanFilter({ ...planFilter, year: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="년도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="2026">2026년</SelectItem>
                      <SelectItem value="2025">2025년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label>반기</Label>
                  <Select value={planFilter.halfYear} onValueChange={(v) => setPlanFilter({ ...planFilter, halfYear: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="반기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="first">상반기</SelectItem>
                      <SelectItem value="second">하반기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Plan Form */}
              {showPlanForm && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-6 gap-4">
                      <div>
                        <Label>계획년도</Label>
                        <Select value={newPlan.planYear?.toString()} onValueChange={(v) => setNewPlan({ ...newPlan, planYear: parseInt(v) })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2026">2026년</SelectItem>
                            <SelectItem value="2025">2025년</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>반기</Label>
                        <Select value={newPlan.halfYear} onValueChange={(v) => setNewPlan({ ...newPlan, halfYear: v as "first" | "second" })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="first">상반기</SelectItem>
                            <SelectItem value="second">하반기</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>검사항목</Label>
                        <Input
                          value={newPlan.inspectionItem}
                          onChange={(e) => setNewPlan({ ...newPlan, inspectionItem: e.target.value })}
                          placeholder="검사항목"
                        />
                      </div>
                      <div>
                        <Label>대상품목</Label>
                        <Input
                          value={newPlan.targetProduct}
                          onChange={(e) => setNewPlan({ ...newPlan, targetProduct: e.target.value })}
                          placeholder="품번"
                        />
                      </div>
                      <div>
                        <Label>검사주기</Label>
                        <Input
                          value={newPlan.inspectionCycle}
                          onChange={(e) => setNewPlan({ ...newPlan, inspectionCycle: e.target.value })}
                          placeholder="예: 월 1회"
                        />
                      </div>
                      <div>
                        <Label>검사일정</Label>
                        <Input
                          type="date"
                          value={newPlan.scheduledDate}
                          onChange={(e) => setNewPlan({ ...newPlan, scheduledDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowPlanForm(false)}>취소</Button>
                      <Button onClick={handleAddPlan}>등록</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Plans Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>계획년도</TableHead>
                    <TableHead>반기</TableHead>
                    <TableHead>검사항목</TableHead>
                    <TableHead>대상품목</TableHead>
                    <TableHead>검사주기</TableHead>
                    <TableHead>검사일정</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        등록된 검사 계획이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>{plan.planYear}년</TableCell>
                        <TableCell>
                          <Badge variant="outline">{halfYearLabels[plan.halfYear]}</Badge>
                        </TableCell>
                        <TableCell>{plan.inspectionItem}</TableCell>
                        <TableCell className="font-mono">{plan.targetProduct}</TableCell>
                        <TableCell>{plan.inspectionCycle}</TableCell>
                        <TableCell>{new Date(plan.scheduledDate).toLocaleDateString("ko-KR")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 검사 실적 입력 */}
        <TabsContent value="actual">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  검사 실적 입력
                </CardTitle>
                <Button onClick={() => setShowActualForm(!showActualForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  실적 등록
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Actual Form */}
              {showActualForm && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <Label>검사일</Label>
                        <Input
                          type="date"
                          value={newActual.inspectionDate}
                          onChange={(e) => setNewActual({ ...newActual, inspectionDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>검사항목</Label>
                        <Input
                          value={newActual.inspectionItem}
                          onChange={(e) => setNewActual({ ...newActual, inspectionItem: e.target.value })}
                          placeholder="검사항목"
                        />
                      </div>
                      <div>
                        <Label>검사결과</Label>
                        <Select value={newActual.result} onValueChange={(v) => setNewActual({ ...newActual, result: v as "pass" | "fail" | "conditional" })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pass">합격</SelectItem>
                            <SelectItem value="fail">불합격</SelectItem>
                            <SelectItem value="conditional">조건부합격</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>검사자</Label>
                        <Input
                          value={newActual.inspector}
                          onChange={(e) => setNewActual({ ...newActual, inspector: e.target.value })}
                          placeholder="검사자명"
                        />
                      </div>
                      <div>
                        <Label>비고</Label>
                        <Input
                          value={newActual.notes}
                          onChange={(e) => setNewActual({ ...newActual, notes: e.target.value })}
                          placeholder="비고"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowActualForm(false)}>취소</Button>
                      <Button onClick={handleAddActual}>등록</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actuals Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>검사일</TableHead>
                    <TableHead>검사항목</TableHead>
                    <TableHead>검사결과</TableHead>
                    <TableHead>검사자</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actuals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        등록된 검사 실적이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    actuals.map((actual) => (
                      <TableRow key={actual.id}>
                        <TableCell>{new Date(actual.inspectionDate).toLocaleDateString("ko-KR")}</TableCell>
                        <TableCell>{actual.inspectionItem}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultColors[actual.result]}`}>
                            {resultLabels[actual.result]}
                          </span>
                        </TableCell>
                        <TableCell>{actual.inspector}</TableCell>
                        <TableCell className="text-muted-foreground">{actual.notes || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 계획대 실적 현황 */}
        <TabsContent value="comparison">
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">상반기 달성률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{firstHalfRate}%</span>
                    <span className="text-muted-foreground">({firstHalfCompleted}/{firstHalfPlans.length}건)</span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${firstHalfRate}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">하반기 달성률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{secondHalfRate}%</span>
                    <span className="text-muted-foreground">({secondHalfCompleted}/{secondHalfPlans.length}건)</span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${secondHalfRate}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan vs Actual Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  계획대 실적 비교
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>반기</TableHead>
                      <TableHead>검사항목</TableHead>
                      <TableHead>대상품목</TableHead>
                      <TableHead>계획일</TableHead>
                      <TableHead>실적일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>달성률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planVsActualData.map((item) => {
                      const plan = plans.find((p) => p.id === item.planId);
                      return (
                        <TableRow key={item.planId}>
                          <TableCell>
                            <Badge variant="outline">{halfYearLabels[plan?.halfYear || "first"]}</Badge>
                          </TableCell>
                          <TableCell>{item.inspectionItem}</TableCell>
                          <TableCell className="font-mono">{item.targetProduct}</TableCell>
                          <TableCell>{new Date(item.plannedDate).toLocaleDateString("ko-KR")}</TableCell>
                          <TableCell>
                            {item.actualDate ? new Date(item.actualDate).toLocaleDateString("ko-KR") : "-"}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                              {statusLabels[item.status]}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={item.achievementRate === 100 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                              {item.achievementRate}%
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Incomplete Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">미실시 항목</CardTitle>
              </CardHeader>
              <CardContent>
                {planVsActualData.filter((p) => p.status === "overdue").length === 0 ? (
                  <p className="text-muted-foreground">미실시 항목이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>검사항목</TableHead>
                        <TableHead>대상품목</TableHead>
                        <TableHead>예정일</TableHead>
                        <TableHead>지연일수</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planVsActualData
                        .filter((p) => p.status === "overdue")
                        .map((item) => {
                          const today = new Date();
                          const plannedDate = new Date(item.plannedDate);
                          const diffDays = Math.floor((today.getTime() - plannedDate.getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <TableRow key={item.planId}>
                              <TableCell>{item.inspectionItem}</TableCell>
                              <TableCell className="font-mono">{item.targetProduct}</TableCell>
                              <TableCell>{new Date(item.plannedDate).toLocaleDateString("ko-KR")}</TableCell>
                              <TableCell className="text-red-600 font-medium">{diffDays}일</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 검사 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                검사 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="w-40">
                  <Label>반기</Label>
                  <Select value={historyFilter.halfYear} onValueChange={(v) => setHistoryFilter({ ...historyFilter, halfYear: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="반기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="first">상반기</SelectItem>
                      <SelectItem value="second">하반기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <Label>검사항목</Label>
                  <Select value={historyFilter.inspectionItem} onValueChange={(v) => setHistoryFilter({ ...historyFilter, inspectionItem: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="항목 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueInspectionItems.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* History Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>검사일</TableHead>
                    <TableHead>반기</TableHead>
                    <TableHead>검사항목</TableHead>
                    <TableHead>검사결과</TableHead>
                    <TableHead>검사자</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        검사 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((actual) => {
                      const plan = plans.find((p) => p.id === actual.planId);
                      return (
                        <TableRow key={actual.id}>
                          <TableCell>{new Date(actual.inspectionDate).toLocaleDateString("ko-KR")}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{plan ? halfYearLabels[plan.halfYear] : "-"}</Badge>
                          </TableCell>
                          <TableCell>{actual.inspectionItem}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultColors[actual.result]}`}>
                              {resultLabels[actual.result]}
                            </span>
                          </TableCell>
                          <TableCell>{actual.inspector}</TableCell>
                          <TableCell className="text-muted-foreground">{actual.notes || "-"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
