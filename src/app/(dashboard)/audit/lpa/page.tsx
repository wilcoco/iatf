"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Save, Trash2, Calendar, ClipboardCheck, BarChart3, History, CheckCircle, XCircle, Minus } from "lucide-react";

// Types
interface LPAPlan {
  id: number;
  auditDate: string;
  auditTime: string;
  auditArea: string;
  processLine: string;
  auditorLevel: string;
  auditorName: string;
  auditCycle: string;
  status: string;
}

interface ChecklistItem {
  id: number;
  category: string;
  checkItem: string;
  conformity: string;
  correctiveAction: string;
}

interface AuditResult {
  id: number;
  auditDate: string;
  auditArea: string;
  auditorName: string;
  totalItems: number;
  conformCount: number;
  nonConformCount: number;
  naCount: number;
  conformRate: number;
  nonConformItems: string[];
  actionStatus: string;
}

interface LPAHistory {
  id: number;
  period: string;
  totalAudits: number;
  avgConformRate: number;
  totalNonConform: number;
  closedActions: number;
  openActions: number;
}

// Sample data for checklist categories
const checklistCategories = [
  "작업표준 준수",
  "품질 기록 관리",
  "설비 상태",
  "안전 및 환경",
  "자재 관리",
  "4M 변경관리",
  "부적합품 관리",
  "계측기 관리",
];

// Default checklist items by category
const defaultChecklistItems: { category: string; items: string[] }[] = [
  {
    category: "작업표준 준수",
    items: [
      "작업자가 작업표준서를 보유하고 있는가?",
      "작업자가 작업표준서대로 작업을 수행하는가?",
      "작업표준서가 최신본인가?",
    ],
  },
  {
    category: "품질 기록 관리",
    items: [
      "품질 기록이 정확하게 작성되어 있는가?",
      "초중종 검사가 계획대로 수행되는가?",
      "SPC 관리도가 관리되고 있는가?",
    ],
  },
  {
    category: "설비 상태",
    items: [
      "설비 일상점검이 수행되고 있는가?",
      "설비 이상 시 조치 기록이 있는가?",
      "설비 청소 상태가 양호한가?",
    ],
  },
  {
    category: "안전 및 환경",
    items: [
      "작업자가 안전보호구를 착용하고 있는가?",
      "작업장이 정리정돈되어 있는가?",
      "위험물질이 적절히 보관되어 있는가?",
    ],
  },
  {
    category: "자재 관리",
    items: [
      "자재가 선입선출로 관리되고 있는가?",
      "자재 식별표가 부착되어 있는가?",
      "불합격품과 합격품이 구분되어 있는가?",
    ],
  },
  {
    category: "4M 변경관리",
    items: [
      "4M 변경 시 승인 절차를 준수하는가?",
      "변경 이력이 기록되어 있는가?",
      "변경 후 초도품 검사가 수행되었는가?",
    ],
  },
  {
    category: "부적합품 관리",
    items: [
      "부적합품이 격리 보관되어 있는가?",
      "부적합 표시가 명확한가?",
      "부적합 처리 절차를 준수하는가?",
    ],
  },
  {
    category: "계측기 관리",
    items: [
      "계측기 교정 상태가 유효한가?",
      "계측기가 적절히 보관되고 있는가?",
      "계측기 사용 전 영점 확인을 하는가?",
    ],
  },
];

// Auditor levels based on IATF 16949
const auditorLevels = [
  { value: "foreman", label: "반장 (매일)" },
  { value: "section_chief", label: "과장 (주 1회)" },
  { value: "department_head", label: "부장 (월 1회)" },
  { value: "plant_manager", label: "공장장 (분기 1회)" },
];

// Audit cycles
const auditCycles = [
  { value: "daily", label: "매일" },
  { value: "weekly", label: "주간" },
  { value: "monthly", label: "월간" },
  { value: "quarterly", label: "분기" },
];

// Process areas
const processAreas = [
  "프레스 공정",
  "용접 공정",
  "도장 공정",
  "조립 공정",
  "검사 공정",
  "포장 공정",
  "원자재 창고",
  "완제품 창고",
];

export default function LPAPage() {
  const [activeTab, setActiveTab] = useState("plan");

  // LPA Plan state
  const [plans, setPlans] = useState<LPAPlan[]>([
    {
      id: 1,
      auditDate: "2026-06-10",
      auditTime: "09:00",
      auditArea: "프레스 공정",
      processLine: "A라인",
      auditorLevel: "foreman",
      auditorName: "김철수",
      auditCycle: "daily",
      status: "scheduled",
    },
    {
      id: 2,
      auditDate: "2026-06-10",
      auditTime: "14:00",
      auditArea: "조립 공정",
      processLine: "B라인",
      auditorLevel: "section_chief",
      auditorName: "이영희",
      auditCycle: "weekly",
      status: "scheduled",
    },
  ]);

  // New plan form state
  const [newPlan, setNewPlan] = useState<Omit<LPAPlan, "id" | "status">>({
    auditDate: new Date().toISOString().split("T")[0],
    auditTime: "09:00",
    auditArea: "",
    processLine: "",
    auditorLevel: "",
    auditorName: "",
    auditCycle: "",
  });

  // Checklist state
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Audit results state
  const [auditResults] = useState<AuditResult[]>([
    {
      id: 1,
      auditDate: "2026-06-09",
      auditArea: "프레스 공정 A라인",
      auditorName: "김철수",
      totalItems: 10,
      conformCount: 8,
      nonConformCount: 1,
      naCount: 1,
      conformRate: 88.9,
      nonConformItems: ["작업표준서가 최신본이 아님"],
      actionStatus: "진행중",
    },
    {
      id: 2,
      auditDate: "2026-06-08",
      auditArea: "조립 공정 B라인",
      auditorName: "이영희",
      totalItems: 12,
      conformCount: 12,
      nonConformCount: 0,
      naCount: 0,
      conformRate: 100,
      nonConformItems: [],
      actionStatus: "완료",
    },
    {
      id: 3,
      auditDate: "2026-06-07",
      auditArea: "도장 공정 C라인",
      auditorName: "박지성",
      totalItems: 8,
      conformCount: 6,
      nonConformCount: 2,
      naCount: 0,
      conformRate: 75,
      nonConformItems: ["안전보호구 미착용", "설비 일상점검 미수행"],
      actionStatus: "진행중",
    },
  ]);

  // LPA History state
  const [lpaHistory] = useState<LPAHistory[]>([
    { id: 1, period: "2026년 1월", totalAudits: 45, avgConformRate: 92.5, totalNonConform: 8, closedActions: 8, openActions: 0 },
    { id: 2, period: "2026년 2월", totalAudits: 42, avgConformRate: 94.2, totalNonConform: 5, closedActions: 5, openActions: 0 },
    { id: 3, period: "2026년 3월", totalAudits: 48, avgConformRate: 91.8, totalNonConform: 10, closedActions: 9, openActions: 1 },
    { id: 4, period: "2026년 4월", totalAudits: 44, avgConformRate: 95.1, totalNonConform: 4, closedActions: 4, openActions: 0 },
    { id: 5, period: "2026년 5월", totalAudits: 46, avgConformRate: 93.7, totalNonConform: 6, closedActions: 5, openActions: 1 },
    { id: 6, period: "2026년 6월", totalAudits: 15, avgConformRate: 87.9, totalNonConform: 3, closedActions: 1, openActions: 2 },
  ]);

  // Plan handlers
  const addPlan = () => {
    if (!newPlan.auditArea || !newPlan.auditorLevel || !newPlan.auditorName) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    setPlans([
      ...plans,
      {
        ...newPlan,
        id: Date.now(),
        status: "scheduled",
      },
    ]);
    setNewPlan({
      auditDate: new Date().toISOString().split("T")[0],
      auditTime: "09:00",
      auditArea: "",
      processLine: "",
      auditorLevel: "",
      auditorName: "",
      auditCycle: "",
    });
  };

  const removePlan = (id: number) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  // Checklist handlers
  const loadChecklistByCategory = (category: string) => {
    setSelectedCategory(category);
    const categoryItems = defaultChecklistItems.find((c) => c.category === category);
    if (categoryItems) {
      setChecklistItems(
        categoryItems.items.map((item, index) => ({
          id: Date.now() + index,
          category,
          checkItem: item,
          conformity: "",
          correctiveAction: "",
        }))
      );
    }
  };

  const updateChecklistItem = (id: number, field: keyof ChecklistItem, value: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addChecklistItem = () => {
    if (!selectedCategory) {
      alert("먼저 분류를 선택해주세요.");
      return;
    }
    setChecklistItems([
      ...checklistItems,
      {
        id: Date.now(),
        category: selectedCategory,
        checkItem: "",
        conformity: "",
        correctiveAction: "",
      },
    ]);
  };

  const removeChecklistItem = (id: number) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  // Save checklist
  const saveChecklist = () => {
    console.log("Saving checklist:", checklistItems);
    alert("체크리스트가 저장되었습니다.");
  };

  // Get auditor level label
  const getAuditorLevelLabel = (value: string) => {
    return auditorLevels.find((level) => level.value === value)?.label || value;
  };

  // Get audit cycle label
  const getAuditCycleLabel = (value: string) => {
    return auditCycles.find((cycle) => cycle.value === value)?.label || value;
  };

  // Get conformity badge
  const getConformityBadge = (conformity: string) => {
    switch (conformity) {
      case "conform":
        return <Badge className="bg-green-500">적합</Badge>;
      case "nonconform":
        return <Badge className="bg-red-500">부적합</Badge>;
      case "na":
        return <Badge variant="secondary">해당없음</Badge>;
      default:
        return <Badge variant="outline">미점검</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">완료</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">예정</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-500">진행중</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get action status badge
  const getActionStatusBadge = (status: string) => {
    switch (status) {
      case "완료":
        return <Badge className="bg-green-500">완료</Badge>;
      case "진행중":
        return <Badge className="bg-yellow-500">진행중</Badge>;
      case "미착수":
        return <Badge className="bg-red-500">미착수</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate summary statistics
  const calculateResultsSummary = () => {
    if (auditResults.length === 0) return { avgRate: 0, totalNC: 0, openActions: 0 };
    const avgRate = auditResults.reduce((sum, r) => sum + r.conformRate, 0) / auditResults.length;
    const totalNC = auditResults.reduce((sum, r) => sum + r.nonConformCount, 0);
    const openActions = auditResults.filter((r) => r.actionStatus !== "완료").length;
    return { avgRate: avgRate.toFixed(1), totalNC, openActions };
  };

  const resultsSummary = calculateResultsSummary();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LPA (Layered Process Audit)</h1>
          <p className="text-muted-foreground">IATF 16949 계층별 공정 심사</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            LPA 계획
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            체크리스트
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            심사 결과
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            LPA 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: LPA Plan */}
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>새 LPA 심사 계획</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auditDate">심사일</Label>
                  <Input
                    id="auditDate"
                    type="date"
                    value={newPlan.auditDate}
                    onChange={(e) => setNewPlan({ ...newPlan, auditDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditTime">심사시간</Label>
                  <Input
                    id="auditTime"
                    type="time"
                    value={newPlan.auditTime}
                    onChange={(e) => setNewPlan({ ...newPlan, auditTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditArea">심사영역 (공정)</Label>
                  <Select
                    value={newPlan.auditArea}
                    onValueChange={(value) => setNewPlan({ ...newPlan, auditArea: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="공정 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {processAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processLine">라인</Label>
                  <Input
                    id="processLine"
                    value={newPlan.processLine}
                    onChange={(e) => setNewPlan({ ...newPlan, processLine: e.target.value })}
                    placeholder="예: A라인"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="auditorLevel">심사자 계층</Label>
                  <Select
                    value={newPlan.auditorLevel}
                    onValueChange={(value) => setNewPlan({ ...newPlan, auditorLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="계층 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {auditorLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditorName">심사자명</Label>
                  <Input
                    id="auditorName"
                    value={newPlan.auditorName}
                    onChange={(e) => setNewPlan({ ...newPlan, auditorName: e.target.value })}
                    placeholder="심사자 이름"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auditCycle">심사주기</Label>
                  <Select
                    value={newPlan.auditCycle}
                    onValueChange={(value) => setNewPlan({ ...newPlan, auditCycle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="주기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {auditCycles.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={addPlan}>
                  <Plus className="h-4 w-4 mr-2" />
                  계획 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LPA 심사 계획 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>심사일</TableHead>
                    <TableHead>심사시간</TableHead>
                    <TableHead>심사영역</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead>심사자 계층</TableHead>
                    <TableHead>심사자</TableHead>
                    <TableHead>심사주기</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[80px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.auditDate}</TableCell>
                      <TableCell>{plan.auditTime}</TableCell>
                      <TableCell>{plan.auditArea}</TableCell>
                      <TableCell>{plan.processLine}</TableCell>
                      <TableCell>{getAuditorLevelLabel(plan.auditorLevel)}</TableCell>
                      <TableCell>{plan.auditorName}</TableCell>
                      <TableCell>{getAuditCycleLabel(plan.auditCycle)}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {plans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        등록된 심사 계획이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Checklist */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>LPA 체크리스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>분류 선택</Label>
                  <Select value={selectedCategory} onValueChange={loadChecklistByCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="점검 분류를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {checklistCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={addChecklistItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  항목 추가
                </Button>
              </div>

              {checklistItems.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No.</TableHead>
                      <TableHead>점검항목</TableHead>
                      <TableHead className="w-[200px]">적합여부</TableHead>
                      <TableHead className="w-[300px]">부적합 시 조치사항</TableHead>
                      <TableHead className="w-[80px]">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checklistItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={item.checkItem}
                            onChange={(e) => updateChecklistItem(item.id, "checkItem", e.target.value)}
                            placeholder="점검 항목"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={item.conformity === "conform" ? "default" : "outline"}
                              className={item.conformity === "conform" ? "bg-green-500 hover:bg-green-600" : ""}
                              onClick={() => updateChecklistItem(item.id, "conformity", "conform")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              적합
                            </Button>
                            <Button
                              size="sm"
                              variant={item.conformity === "nonconform" ? "default" : "outline"}
                              className={item.conformity === "nonconform" ? "bg-red-500 hover:bg-red-600" : ""}
                              onClick={() => updateChecklistItem(item.id, "conformity", "nonconform")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              부적합
                            </Button>
                            <Button
                              size="sm"
                              variant={item.conformity === "na" ? "default" : "outline"}
                              onClick={() => updateChecklistItem(item.id, "conformity", "na")}
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              N/A
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={item.correctiveAction}
                            onChange={(e) => updateChecklistItem(item.id, "correctiveAction", e.target.value)}
                            placeholder="부적합 시 조치사항 입력"
                            className="min-h-[60px]"
                            disabled={item.conformity !== "nonconform"}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeChecklistItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {checklistItems.length > 0 && (
                <div className="flex justify-end gap-2">
                  <Button onClick={saveChecklist}>
                    <Save className="h-4 w-4 mr-2" />
                    체크리스트 저장
                  </Button>
                </div>
              )}

              {!selectedCategory && (
                <div className="text-center py-8 text-muted-foreground">
                  점검 분류를 선택하면 해당 분류의 체크리스트가 표시됩니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Audit Results */}
        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">평균 적합률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resultsSummary.avgRate}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 부적합 건수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{resultsSummary.totalNC}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">미완료 조치</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{resultsSummary.openActions}건</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>심사 결과 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>심사일</TableHead>
                    <TableHead>심사영역</TableHead>
                    <TableHead>심사자</TableHead>
                    <TableHead>총 항목</TableHead>
                    <TableHead>적합</TableHead>
                    <TableHead>부적합</TableHead>
                    <TableHead>N/A</TableHead>
                    <TableHead>적합률</TableHead>
                    <TableHead>조치현황</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.auditDate}</TableCell>
                      <TableCell>{result.auditArea}</TableCell>
                      <TableCell>{result.auditorName}</TableCell>
                      <TableCell>{result.totalItems}</TableCell>
                      <TableCell className="text-green-600">{result.conformCount}</TableCell>
                      <TableCell className="text-red-600">{result.nonConformCount}</TableCell>
                      <TableCell className="text-gray-500">{result.naCount}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            result.conformRate >= 90
                              ? "bg-green-500"
                              : result.conformRate >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {result.conformRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{getActionStatusBadge(result.actionStatus)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>부적합 항목 상세</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>심사일</TableHead>
                    <TableHead>심사영역</TableHead>
                    <TableHead>부적합 내용</TableHead>
                    <TableHead>조치현황</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditResults
                    .filter((r) => r.nonConformItems.length > 0)
                    .flatMap((result) =>
                      result.nonConformItems.map((item, index) => (
                        <TableRow key={`${result.id}-${index}`}>
                          <TableCell>{result.auditDate}</TableCell>
                          <TableCell>{result.auditArea}</TableCell>
                          <TableCell>{item}</TableCell>
                          <TableCell>{getActionStatusBadge(result.actionStatus)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  {auditResults.filter((r) => r.nonConformItems.length > 0).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        부적합 항목이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: LPA History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기간별 LPA 심사 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>기간</TableHead>
                    <TableHead>총 심사 횟수</TableHead>
                    <TableHead>평균 적합률</TableHead>
                    <TableHead>총 부적합 건수</TableHead>
                    <TableHead>조치 완료</TableHead>
                    <TableHead>조치 진행중</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lpaHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.period}</TableCell>
                      <TableCell>{history.totalAudits}회</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            history.avgConformRate >= 90
                              ? "bg-green-500"
                              : history.avgConformRate >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {history.avgConformRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{history.totalNonConform}건</TableCell>
                      <TableCell className="text-green-600">{history.closedActions}건</TableCell>
                      <TableCell className="text-yellow-600">{history.openActions}건</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>적합률 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lpaHistory.map((history) => (
                  <div key={history.id} className="flex items-center gap-4">
                    <div className="w-24 text-sm text-muted-foreground">{history.period}</div>
                    <div className="flex-1">
                      <div className="h-6 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            history.avgConformRate >= 90
                              ? "bg-green-500"
                              : history.avgConformRate >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${history.avgConformRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-right font-medium">{history.avgConformRate}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>심사 횟수 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 심사 횟수:</span>
                    <span className="font-medium">
                      {lpaHistory.reduce((sum, h) => sum + h.totalAudits, 0)}회
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">월 평균 심사:</span>
                    <span className="font-medium">
                      {(lpaHistory.reduce((sum, h) => sum + h.totalAudits, 0) / lpaHistory.length).toFixed(1)}회
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>부적합 조치 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 부적합 건수:</span>
                    <span className="font-medium text-red-600">
                      {lpaHistory.reduce((sum, h) => sum + h.totalNonConform, 0)}건
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">조치 완료:</span>
                    <span className="font-medium text-green-600">
                      {lpaHistory.reduce((sum, h) => sum + h.closedActions, 0)}건
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">조치 진행중:</span>
                    <span className="font-medium text-yellow-600">
                      {lpaHistory.reduce((sum, h) => sum + h.openActions, 0)}건
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
