"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  Target,
  TrendingUp,
  ClipboardList,
  History,
  Calendar,
  Building2,
  User,
  FileText,
  Edit,
  Trash2,
  Save,
} from "lucide-react";

// Types
interface PlanHeader {
  planYear: number;
  department: string;
  author: string;
  createdDate: string;
}

interface DepartmentTarget {
  id: number;
  department: string;
  salesTarget: number;
  operatingProfitTarget: number;
  qualityPPM: number;
  qualityClaims: number;
  productivityTarget: number;
  costReductionTarget: number;
}

interface ActionPlan {
  id: number;
  task: string;
  description: string;
  assignee: string;
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  resources: string;
  status: string;
}

interface MonthlyPerformance {
  id: number;
  month: number;
  targetType: string;
  target: number;
  actual: number;
  achievementRate: number;
}

interface PlanHistory {
  id: number;
  version: string;
  changedDate: string;
  changedBy: string;
  changeDescription: string;
}

// Initial Data
const initialHeader: PlanHeader = {
  planYear: 2026,
  department: "경영지원부",
  author: "홍길동",
  createdDate: "2026-01-15",
};

const initialDepartmentTargets: DepartmentTarget[] = [
  {
    id: 1,
    department: "영업부",
    salesTarget: 100000000,
    operatingProfitTarget: 15000000,
    qualityPPM: 50,
    qualityClaims: 5,
    productivityTarget: 95,
    costReductionTarget: 5,
  },
  {
    id: 2,
    department: "생산부",
    salesTarget: 0,
    operatingProfitTarget: 0,
    qualityPPM: 30,
    qualityClaims: 3,
    productivityTarget: 98,
    costReductionTarget: 8,
  },
  {
    id: 3,
    department: "품질부",
    salesTarget: 0,
    operatingProfitTarget: 0,
    qualityPPM: 20,
    qualityClaims: 2,
    productivityTarget: 100,
    costReductionTarget: 3,
  },
];

const initialActionPlans: ActionPlan[] = [
  {
    id: 1,
    task: "신규 시장 개척",
    description: "동남아 시장 진출 및 현지 파트너십 구축",
    assignee: "김영업",
    q1: true,
    q2: true,
    q3: false,
    q4: false,
    resources: "해외출장비 50,000,000원, 전담인력 2명",
    status: "진행중",
  },
  {
    id: 2,
    task: "생산성 향상 프로젝트",
    description: "자동화 설비 도입 및 공정 개선",
    assignee: "박생산",
    q1: false,
    q2: true,
    q3: true,
    q4: true,
    resources: "설비투자 200,000,000원",
    status: "계획",
  },
  {
    id: 3,
    task: "품질관리 시스템 고도화",
    description: "AI 기반 불량 검출 시스템 도입",
    assignee: "이품질",
    q1: true,
    q2: true,
    q3: true,
    q4: false,
    resources: "시스템 구축비 100,000,000원",
    status: "진행중",
  },
  {
    id: 4,
    task: "원가절감 TFT 운영",
    description: "부서별 원가절감 과제 발굴 및 실행",
    assignee: "최경영",
    q1: true,
    q2: true,
    q3: true,
    q4: true,
    resources: "TFT 운영비 10,000,000원",
    status: "진행중",
  },
];

const initialMonthlyPerformance: MonthlyPerformance[] = [
  { id: 1, month: 1, targetType: "매출목표", target: 8000000, actual: 7800000, achievementRate: 97.5 },
  { id: 2, month: 1, targetType: "영업이익", target: 1200000, actual: 1150000, achievementRate: 95.8 },
  { id: 3, month: 2, targetType: "매출목표", target: 8500000, actual: 8700000, achievementRate: 102.4 },
  { id: 4, month: 2, targetType: "영업이익", target: 1300000, actual: 1350000, achievementRate: 103.8 },
  { id: 5, month: 3, targetType: "매출목표", target: 9000000, actual: 8900000, achievementRate: 98.9 },
  { id: 6, month: 3, targetType: "영업이익", target: 1400000, actual: 1380000, achievementRate: 98.6 },
  { id: 7, month: 4, targetType: "매출목표", target: 8500000, actual: 8600000, achievementRate: 101.2 },
  { id: 8, month: 4, targetType: "영업이익", target: 1300000, actual: 1320000, achievementRate: 101.5 },
  { id: 9, month: 5, targetType: "매출목표", target: 9000000, actual: 9200000, achievementRate: 102.2 },
  { id: 10, month: 5, targetType: "영업이익", target: 1400000, actual: 1450000, achievementRate: 103.6 },
];

const initialHistory: PlanHistory[] = [
  {
    id: 1,
    version: "v1.0",
    changedDate: "2026-01-15",
    changedBy: "홍길동",
    changeDescription: "초기 사업계획 수립",
  },
  {
    id: 2,
    version: "v1.1",
    changedDate: "2026-02-01",
    changedBy: "김경영",
    changeDescription: "Q2 매출목표 상향 조정 (8,500만원 → 9,000만원)",
  },
  {
    id: 3,
    version: "v1.2",
    changedDate: "2026-03-15",
    changedBy: "박기획",
    changeDescription: "신규 시장 개척 과제 일정 조정",
  },
];

const departments = ["경영지원부", "영업부", "생산부", "품질부", "인사부", "구매부"];
const statusOptions = ["계획", "진행중", "완료", "지연", "중단"];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const targetTypes = ["매출목표", "영업이익", "품질PPM", "생산성", "원가절감"];

export default function BusinessPlanPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Header state
  const [header, setHeader] = useState<PlanHeader>(initialHeader);
  const [isEditingHeader, setIsEditingHeader] = useState(false);

  // Department targets state
  const [departmentTargets, setDepartmentTargets] = useState<DepartmentTarget[]>(initialDepartmentTargets);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [targetFormData, setTargetFormData] = useState<Partial<DepartmentTarget>>({
    department: "",
    salesTarget: 0,
    operatingProfitTarget: 0,
    qualityPPM: 0,
    qualityClaims: 0,
    productivityTarget: 0,
    costReductionTarget: 0,
  });

  // Action plans state
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(initialActionPlans);
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionFormData, setActionFormData] = useState<Partial<ActionPlan>>({
    task: "",
    description: "",
    assignee: "",
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    resources: "",
    status: "계획",
  });

  // Monthly performance state
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>(initialMonthlyPerformance);
  const [showPerformanceForm, setShowPerformanceForm] = useState(false);
  const [performanceFormData, setPerformanceFormData] = useState<Partial<MonthlyPerformance>>({
    month: 1,
    targetType: "",
    target: 0,
    actual: 0,
  });

  // History state
  const [history, setHistory] = useState<PlanHistory[]>(initialHistory);

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      계획: "secondary",
      진행중: "default",
      완료: "success",
      지연: "destructive",
      중단: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return "text-green-600 font-semibold";
    if (rate >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getMonthName = (month: number) => `${month}월`;

  // Handler functions
  const handleSaveHeader = () => {
    setIsEditingHeader(false);
    // Add to history
    const newHistory: PlanHistory = {
      id: history.length + 1,
      version: `v${(parseFloat(history[history.length - 1]?.version.replace("v", "") || "1.0") + 0.1).toFixed(1)}`,
      changedDate: new Date().toISOString().split("T")[0],
      changedBy: header.author,
      changeDescription: "계획 헤더 정보 수정",
    };
    setHistory([...history, newHistory]);
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget: DepartmentTarget = {
      id: departmentTargets.length + 1,
      department: targetFormData.department || "",
      salesTarget: targetFormData.salesTarget || 0,
      operatingProfitTarget: targetFormData.operatingProfitTarget || 0,
      qualityPPM: targetFormData.qualityPPM || 0,
      qualityClaims: targetFormData.qualityClaims || 0,
      productivityTarget: targetFormData.productivityTarget || 0,
      costReductionTarget: targetFormData.costReductionTarget || 0,
    };
    setDepartmentTargets([...departmentTargets, newTarget]);
    setShowTargetForm(false);
    setTargetFormData({
      department: "",
      salesTarget: 0,
      operatingProfitTarget: 0,
      qualityPPM: 0,
      qualityClaims: 0,
      productivityTarget: 0,
      costReductionTarget: 0,
    });
  };

  const handleDeleteTarget = (id: number) => {
    setDepartmentTargets(departmentTargets.filter((t) => t.id !== id));
  };

  const handleAddActionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: ActionPlan = {
      id: actionPlans.length + 1,
      task: actionFormData.task || "",
      description: actionFormData.description || "",
      assignee: actionFormData.assignee || "",
      q1: actionFormData.q1 || false,
      q2: actionFormData.q2 || false,
      q3: actionFormData.q3 || false,
      q4: actionFormData.q4 || false,
      resources: actionFormData.resources || "",
      status: actionFormData.status || "계획",
    };
    setActionPlans([...actionPlans, newPlan]);
    setShowActionForm(false);
    setActionFormData({
      task: "",
      description: "",
      assignee: "",
      q1: false,
      q2: false,
      q3: false,
      q4: false,
      resources: "",
      status: "계획",
    });
  };

  const handleDeleteActionPlan = (id: number) => {
    setActionPlans(actionPlans.filter((p) => p.id !== id));
  };

  const handleAddPerformance = (e: React.FormEvent) => {
    e.preventDefault();
    const achievementRate =
      performanceFormData.target && performanceFormData.target > 0
        ? parseFloat(((performanceFormData.actual || 0) / performanceFormData.target * 100).toFixed(1))
        : 0;

    const newPerformance: MonthlyPerformance = {
      id: monthlyPerformance.length + 1,
      month: performanceFormData.month || 1,
      targetType: performanceFormData.targetType || "",
      target: performanceFormData.target || 0,
      actual: performanceFormData.actual || 0,
      achievementRate,
    };
    setMonthlyPerformance([...monthlyPerformance, newPerformance]);
    setShowPerformanceForm(false);
    setPerformanceFormData({
      month: 1,
      targetType: "",
      target: 0,
      actual: 0,
    });
  };

  const handleDeletePerformance = (id: number) => {
    setMonthlyPerformance(monthlyPerformance.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">사업계획</h1>
          <p className="text-muted-foreground">
            연간 사업계획 수립 및 목표 관리 (부서별 목표, 실행계획, 실적 현황)
          </p>
        </div>
      </div>

      {/* Header Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              계획 기본정보
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditingHeader ? handleSaveHeader() : setIsEditingHeader(true)}
            >
              {isEditingHeader ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  수정
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">계획년도:</Label>
              {isEditingHeader ? (
                <Input
                  type="number"
                  value={header.planYear}
                  onChange={(e) => setHeader({ ...header, planYear: parseInt(e.target.value) })}
                  className="w-24"
                />
              ) : (
                <span>{header.planYear}년</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">작성부서:</Label>
              {isEditingHeader ? (
                <Select
                  value={header.department}
                  onValueChange={(value) => setHeader({ ...header, department: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span>{header.department}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">작성자:</Label>
              {isEditingHeader ? (
                <Input
                  value={header.author}
                  onChange={(e) => setHeader({ ...header, author: e.target.value })}
                  className="w-24"
                />
              ) : (
                <span>{header.author}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">작성일:</Label>
              {isEditingHeader ? (
                <Input
                  type="date"
                  value={header.createdDate}
                  onChange={(e) => setHeader({ ...header, createdDate: e.target.value })}
                  className="w-36"
                />
              ) : (
                <span>{header.createdDate}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Target className="mr-2 h-4 w-4" />
            사업계획 개요
          </TabsTrigger>
          <TabsTrigger value="action-plans">
            <ClipboardList className="mr-2 h-4 w-4" />
            세부 실행계획
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="mr-2 h-4 w-4" />
            실적 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            계획 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview - Annual Targets */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  부서별 목표
                </div>
                <Button onClick={() => setShowTargetForm(!showTargetForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  목표 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showTargetForm && (
                <form onSubmit={handleAddTarget} className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>부서</Label>
                      <Select
                        value={targetFormData.department}
                        onValueChange={(value) => setTargetFormData({ ...targetFormData, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>매출목표 (원)</Label>
                      <Input
                        type="number"
                        value={targetFormData.salesTarget}
                        onChange={(e) => setTargetFormData({ ...targetFormData, salesTarget: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>영업이익목표 (원)</Label>
                      <Input
                        type="number"
                        value={targetFormData.operatingProfitTarget}
                        onChange={(e) => setTargetFormData({ ...targetFormData, operatingProfitTarget: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>품질목표 PPM</Label>
                      <Input
                        type="number"
                        value={targetFormData.qualityPPM}
                        onChange={(e) => setTargetFormData({ ...targetFormData, qualityPPM: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>클레임건수 목표</Label>
                      <Input
                        type="number"
                        value={targetFormData.qualityClaims}
                        onChange={(e) => setTargetFormData({ ...targetFormData, qualityClaims: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>생산성목표 (%)</Label>
                      <Input
                        type="number"
                        value={targetFormData.productivityTarget}
                        onChange={(e) => setTargetFormData({ ...targetFormData, productivityTarget: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>원가절감목표 (%)</Label>
                      <Input
                        type="number"
                        value={targetFormData.costReductionTarget}
                        onChange={(e) => setTargetFormData({ ...targetFormData, costReductionTarget: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowTargetForm(false)}>
                      취소
                    </Button>
                    <Button type="submit">등록</Button>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서</TableHead>
                    <TableHead className="text-right">매출목표</TableHead>
                    <TableHead className="text-right">영업이익목표</TableHead>
                    <TableHead className="text-right">품질PPM</TableHead>
                    <TableHead className="text-right">클레임건수</TableHead>
                    <TableHead className="text-right">생산성(%)</TableHead>
                    <TableHead className="text-right">원가절감(%)</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentTargets.map((target) => (
                    <TableRow key={target.id}>
                      <TableCell className="font-medium">{target.department}</TableCell>
                      <TableCell className="text-right">{formatCurrency(target.salesTarget)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(target.operatingProfitTarget)}</TableCell>
                      <TableCell className="text-right">{target.qualityPPM}</TableCell>
                      <TableCell className="text-right">{target.qualityClaims}건</TableCell>
                      <TableCell className="text-right">{target.productivityTarget}%</TableCell>
                      <TableCell className="text-right">{target.costReductionTarget}%</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTarget(target.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Detailed Action Plans */}
        <TabsContent value="action-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  세부 실행계획
                </div>
                <Button onClick={() => setShowActionForm(!showActionForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  실행계획 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showActionForm && (
                <form onSubmit={handleAddActionPlan} className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>추진과제</Label>
                      <Input
                        value={actionFormData.task}
                        onChange={(e) => setActionFormData({ ...actionFormData, task: e.target.value })}
                        placeholder="추진과제 입력"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Input
                        value={actionFormData.assignee}
                        onChange={(e) => setActionFormData({ ...actionFormData, assignee: e.target.value })}
                        placeholder="담당자 입력"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Label>실행내용</Label>
                    <Textarea
                      value={actionFormData.description}
                      onChange={(e) => setActionFormData({ ...actionFormData, description: e.target.value })}
                      placeholder="실행내용 상세 기술"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>일정</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={actionFormData.q1}
                            onChange={(e) => setActionFormData({ ...actionFormData, q1: e.target.checked })}
                          />
                          Q1
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={actionFormData.q2}
                            onChange={(e) => setActionFormData({ ...actionFormData, q2: e.target.checked })}
                          />
                          Q2
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={actionFormData.q3}
                            onChange={(e) => setActionFormData({ ...actionFormData, q3: e.target.checked })}
                          />
                          Q3
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={actionFormData.q4}
                            onChange={(e) => setActionFormData({ ...actionFormData, q4: e.target.checked })}
                          />
                          Q4
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={actionFormData.status}
                        onValueChange={(value) => setActionFormData({ ...actionFormData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Label>필요자원</Label>
                    <Input
                      value={actionFormData.resources}
                      onChange={(e) => setActionFormData({ ...actionFormData, resources: e.target.value })}
                      placeholder="필요자원 (예: 예산, 인력 등)"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowActionForm(false)}>
                      취소
                    </Button>
                    <Button type="submit">등록</Button>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>추진과제</TableHead>
                    <TableHead>실행내용</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead className="text-center">Q1</TableHead>
                    <TableHead className="text-center">Q2</TableHead>
                    <TableHead className="text-center">Q3</TableHead>
                    <TableHead className="text-center">Q4</TableHead>
                    <TableHead>필요자원</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.task}</TableCell>
                      <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                      <TableCell>{plan.assignee}</TableCell>
                      <TableCell className="text-center">
                        {plan.q1 ? <Badge variant="default">O</Badge> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan.q2 ? <Badge variant="default">O</Badge> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan.q3 ? <Badge variant="default">O</Badge> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan.q4 ? <Badge variant="default">O</Badge> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{plan.resources}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActionPlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Performance Tracking - Monthly */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  월별 목표 vs 실적
                </div>
                <Button onClick={() => setShowPerformanceForm(!showPerformanceForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  실적 등록
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showPerformanceForm && (
                <form onSubmit={handleAddPerformance} className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>월</Label>
                      <Select
                        value={String(performanceFormData.month)}
                        onValueChange={(value) => setPerformanceFormData({ ...performanceFormData, month: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="월 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={String(month)}>{month}월</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>목표 유형</Label>
                      <Select
                        value={performanceFormData.targetType}
                        onValueChange={(value) => setPerformanceFormData({ ...performanceFormData, targetType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>목표값</Label>
                      <Input
                        type="number"
                        value={performanceFormData.target}
                        onChange={(e) => setPerformanceFormData({ ...performanceFormData, target: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>실적값</Label>
                      <Input
                        type="number"
                        value={performanceFormData.actual}
                        onChange={(e) => setPerformanceFormData({ ...performanceFormData, actual: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowPerformanceForm(false)}>
                      취소
                    </Button>
                    <Button type="submit">등록</Button>
                  </div>
                </form>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>월</TableHead>
                    <TableHead>목표 유형</TableHead>
                    <TableHead className="text-right">목표</TableHead>
                    <TableHead className="text-right">실적</TableHead>
                    <TableHead className="text-right">달성률</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyPerformance
                    .sort((a, b) => a.month - b.month || a.targetType.localeCompare(b.targetType))
                    .map((perf) => (
                      <TableRow key={perf.id}>
                        <TableCell className="font-medium">{getMonthName(perf.month)}</TableCell>
                        <TableCell>{perf.targetType}</TableCell>
                        <TableCell className="text-right">{formatCurrency(perf.target)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(perf.actual)}</TableCell>
                        <TableCell className={`text-right ${getAchievementColor(perf.achievementRate)}`}>
                          {perf.achievementRate}%
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePerformance(perf.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">매출목표 평균 달성률</p>
                      <p className={`text-2xl font-bold ${getAchievementColor(
                        monthlyPerformance
                          .filter((p) => p.targetType === "매출목표")
                          .reduce((acc, p) => acc + p.achievementRate, 0) /
                          (monthlyPerformance.filter((p) => p.targetType === "매출목표").length || 1)
                      )}`}>
                        {(
                          monthlyPerformance
                            .filter((p) => p.targetType === "매출목표")
                            .reduce((acc, p) => acc + p.achievementRate, 0) /
                          (monthlyPerformance.filter((p) => p.targetType === "매출목표").length || 1)
                        ).toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">영업이익 평균 달성률</p>
                      <p className={`text-2xl font-bold ${getAchievementColor(
                        monthlyPerformance
                          .filter((p) => p.targetType === "영업이익")
                          .reduce((acc, p) => acc + p.achievementRate, 0) /
                          (monthlyPerformance.filter((p) => p.targetType === "영업이익").length || 1)
                      )}`}>
                        {(
                          monthlyPerformance
                            .filter((p) => p.targetType === "영업이익")
                            .reduce((acc, p) => acc + p.achievementRate, 0) /
                          (monthlyPerformance.filter((p) => p.targetType === "영업이익").length || 1)
                        ).toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">전체 평균 달성률</p>
                      <p className={`text-2xl font-bold ${getAchievementColor(
                        monthlyPerformance.reduce((acc, p) => acc + p.achievementRate, 0) /
                          (monthlyPerformance.length || 1)
                      )}`}>
                        {(
                          monthlyPerformance.reduce((acc, p) => acc + p.achievementRate, 0) /
                          (monthlyPerformance.length || 1)
                        ).toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                계획 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>버전</TableHead>
                    <TableHead>변경일</TableHead>
                    <TableHead>변경자</TableHead>
                    <TableHead>변경내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="secondary">{item.version}</Badge>
                      </TableCell>
                      <TableCell>{item.changedDate}</TableCell>
                      <TableCell>{item.changedBy}</TableCell>
                      <TableCell>{item.changeDescription}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
