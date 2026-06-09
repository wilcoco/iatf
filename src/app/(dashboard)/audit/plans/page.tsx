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
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Plus,
  Save,
  Search,
  ClipboardCheck,
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";

// ============ Types ============
interface AnnualPlan {
  id: number;
  planYear: number;
  auditType: string; // 시스템/프로세스/제품
  targetDept: string;
  targetProcess: string;
  assignedAuditors: string[];
  monthlyPlan: boolean[]; // 12 months (true = planned for that month)
  status: string;
  remarks: string;
}

interface AuditActual {
  id: number;
  auditNo: string;
  auditDate: string;
  planId: number;
  targetDept: string;
  targetProcess: string;
  auditType: string;
  leadAuditor: string;
  auditTeam: string[];
  ncCount: number;
  obsCount: number;
  isCompleted: boolean;
  findings: string;
  remarks: string;
}

interface PlanVsActual {
  month: number;
  planned: number;
  actual: number;
  completed: number;
  pending: number;
  completionRate: number;
}

interface Auditor {
  id: number;
  name: string;
  employeeNo: string;
  department: string;
  qualification: string;
  qualificationDate: string;
  expiryDate: string;
  auditCount: number;
  status: string;
}

// ============ Initial Data ============
const currentYear = new Date().getFullYear();

const initialAnnualPlans: AnnualPlan[] = [
  {
    id: 1,
    planYear: currentYear,
    auditType: "시스템",
    targetDept: "품질관리팀",
    targetProcess: "ISO 9001 품질경영시스템",
    assignedAuditors: ["김심사", "이검사"],
    monthlyPlan: [false, false, true, false, false, true, false, false, true, false, false, true],
    status: "진행중",
    remarks: "정기 시스템 심사",
  },
  {
    id: 2,
    planYear: currentYear,
    auditType: "프로세스",
    targetDept: "생산팀",
    targetProcess: "사출 공정",
    assignedAuditors: ["박심사"],
    monthlyPlan: [false, true, false, false, true, false, false, true, false, false, true, false],
    status: "진행중",
    remarks: "공정 심사",
  },
  {
    id: 3,
    planYear: currentYear,
    auditType: "제품",
    targetDept: "품질관리팀",
    targetProcess: "완제품 검사",
    assignedAuditors: ["최심사", "김심사"],
    monthlyPlan: [true, false, false, true, false, false, true, false, false, true, false, false],
    status: "진행중",
    remarks: "제품 심사",
  },
  {
    id: 4,
    planYear: currentYear,
    auditType: "시스템",
    targetDept: "환경안전팀",
    targetProcess: "ISO 14001 환경경영시스템",
    assignedAuditors: ["이검사"],
    monthlyPlan: [false, false, false, true, false, false, false, true, false, false, false, true],
    status: "계획",
    remarks: "환경 시스템 심사",
  },
];

const initialAuditActuals: AuditActual[] = [
  {
    id: 1,
    auditNo: "AUD-2026-001",
    auditDate: "2026-01-15",
    planId: 3,
    targetDept: "품질관리팀",
    targetProcess: "완제품 검사",
    auditType: "제품",
    leadAuditor: "최심사",
    auditTeam: ["김심사"],
    ncCount: 1,
    obsCount: 2,
    isCompleted: true,
    findings: "부적합 1건: 검사기록 누락, 관찰 2건: 작업표준 갱신 필요",
    remarks: "1월 제품심사 완료",
  },
  {
    id: 2,
    auditNo: "AUD-2026-002",
    auditDate: "2026-02-20",
    planId: 2,
    targetDept: "생산팀",
    targetProcess: "사출 공정",
    auditType: "프로세스",
    leadAuditor: "박심사",
    auditTeam: [],
    ncCount: 0,
    obsCount: 3,
    isCompleted: true,
    findings: "관찰 3건: 작업환경 개선 권고",
    remarks: "2월 공정심사 완료",
  },
  {
    id: 3,
    auditNo: "AUD-2026-003",
    auditDate: "2026-03-10",
    planId: 1,
    targetDept: "품질관리팀",
    targetProcess: "ISO 9001 품질경영시스템",
    auditType: "시스템",
    leadAuditor: "김심사",
    auditTeam: ["이검사"],
    ncCount: 2,
    obsCount: 1,
    isCompleted: true,
    findings: "부적합 2건: 문서관리 절차 미준수, 교육훈련 기록 불비",
    remarks: "3월 시스템심사 완료",
  },
  {
    id: 4,
    auditNo: "AUD-2026-004",
    auditDate: "2026-04-15",
    planId: 3,
    targetDept: "품질관리팀",
    targetProcess: "완제품 검사",
    auditType: "제품",
    leadAuditor: "최심사",
    auditTeam: ["김심사"],
    ncCount: 0,
    obsCount: 1,
    isCompleted: true,
    findings: "관찰 1건: 검사장비 교정주기 검토 필요",
    remarks: "4월 제품심사 완료",
  },
  {
    id: 5,
    auditNo: "AUD-2026-005",
    auditDate: "2026-04-22",
    planId: 4,
    targetDept: "환경안전팀",
    targetProcess: "ISO 14001 환경경영시스템",
    auditType: "시스템",
    leadAuditor: "이검사",
    auditTeam: [],
    ncCount: 1,
    obsCount: 2,
    isCompleted: true,
    findings: "부적합 1건: 폐기물 관리대장 기록 미비",
    remarks: "4월 환경심사 완료",
  },
  {
    id: 6,
    auditNo: "AUD-2026-006",
    auditDate: "2026-05-18",
    planId: 2,
    targetDept: "생산팀",
    targetProcess: "사출 공정",
    auditType: "프로세스",
    leadAuditor: "박심사",
    auditTeam: [],
    ncCount: 0,
    obsCount: 0,
    isCompleted: true,
    findings: "특이사항 없음",
    remarks: "5월 공정심사 완료",
  },
];

const initialAuditors: Auditor[] = [
  {
    id: 1,
    name: "김심사",
    employeeNo: "EMP001",
    department: "품질관리팀",
    qualification: "선임심사원",
    qualificationDate: "2023-03-15",
    expiryDate: "2026-03-14",
    auditCount: 8,
    status: "유효",
  },
  {
    id: 2,
    name: "이검사",
    employeeNo: "EMP002",
    department: "품질관리팀",
    qualification: "심사원",
    qualificationDate: "2024-06-20",
    expiryDate: "2027-06-19",
    auditCount: 5,
    status: "유효",
  },
  {
    id: 3,
    name: "박심사",
    employeeNo: "EMP003",
    department: "생산팀",
    qualification: "심사원",
    qualificationDate: "2024-01-10",
    expiryDate: "2027-01-09",
    auditCount: 6,
    status: "유효",
  },
  {
    id: 4,
    name: "최심사",
    employeeNo: "EMP004",
    department: "품질관리팀",
    qualification: "선임심사원",
    qualificationDate: "2022-09-01",
    expiryDate: "2025-08-31",
    auditCount: 12,
    status: "갱신필요",
  },
  {
    id: 5,
    name: "정심사",
    employeeNo: "EMP005",
    department: "환경안전팀",
    qualification: "심사원",
    qualificationDate: "2025-02-15",
    expiryDate: "2028-02-14",
    auditCount: 2,
    status: "유효",
  },
];

// Helper functions
const generateAuditNo = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `AUD-${year}-${random}`;
};

const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const auditTypeOptions = ["시스템", "프로세스", "제품"];
const statusOptions = ["계획", "진행중", "완료", "보류"];
const qualificationOptions = ["선임심사원", "심사원", "심사원 후보"];

export default function AuditPlansPage() {
  const [activeTab, setActiveTab] = useState("annual-plan");

  // Annual Plan state
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>(initialAnnualPlans);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planYear, setPlanYear] = useState(currentYear.toString());
  const [planFormData, setPlanFormData] = useState({
    auditType: "",
    targetDept: "",
    targetProcess: "",
    assignedAuditors: "",
    monthlyPlan: Array(12).fill(false),
    status: "계획",
    remarks: "",
  });

  // Audit Actual state
  const [auditActuals, setAuditActuals] = useState<AuditActual[]>(initialAuditActuals);
  const [showActualForm, setShowActualForm] = useState(false);
  const [actualSearch, setActualSearch] = useState("");
  const [actualFormData, setActualFormData] = useState({
    auditNo: generateAuditNo(),
    auditDate: new Date().toISOString().split("T")[0],
    planId: "",
    targetDept: "",
    targetProcess: "",
    auditType: "",
    leadAuditor: "",
    auditTeam: "",
    ncCount: "",
    obsCount: "",
    isCompleted: false,
    findings: "",
    remarks: "",
  });

  // Auditors state
  const [auditors, setAuditors] = useState<Auditor[]>(initialAuditors);
  const [showAuditorForm, setShowAuditorForm] = useState(false);
  const [auditorFormData, setAuditorFormData] = useState({
    name: "",
    employeeNo: "",
    department: "",
    qualification: "",
    qualificationDate: "",
    expiryDate: "",
  });

  // ============ Annual Plan Handlers ============
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: AnnualPlan = {
      id: Date.now(),
      planYear: parseInt(planYear),
      auditType: planFormData.auditType,
      targetDept: planFormData.targetDept,
      targetProcess: planFormData.targetProcess,
      assignedAuditors: planFormData.assignedAuditors.split(",").map(a => a.trim()).filter(a => a),
      monthlyPlan: planFormData.monthlyPlan,
      status: planFormData.status,
      remarks: planFormData.remarks,
    };
    setAnnualPlans([newPlan, ...annualPlans]);
    setShowPlanForm(false);
    setPlanFormData({
      auditType: "",
      targetDept: "",
      targetProcess: "",
      assignedAuditors: "",
      monthlyPlan: Array(12).fill(false),
      status: "계획",
      remarks: "",
    });
  };

  const toggleMonthPlan = (monthIndex: number) => {
    const newMonthlyPlan = [...planFormData.monthlyPlan];
    newMonthlyPlan[monthIndex] = !newMonthlyPlan[monthIndex];
    setPlanFormData({ ...planFormData, monthlyPlan: newMonthlyPlan });
  };

  const filteredPlans = annualPlans.filter(p => p.planYear === parseInt(planYear));

  // ============ Audit Actual Handlers ============
  const handleActualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActual: AuditActual = {
      id: Date.now(),
      auditNo: actualFormData.auditNo,
      auditDate: actualFormData.auditDate,
      planId: parseInt(actualFormData.planId) || 0,
      targetDept: actualFormData.targetDept,
      targetProcess: actualFormData.targetProcess,
      auditType: actualFormData.auditType,
      leadAuditor: actualFormData.leadAuditor,
      auditTeam: actualFormData.auditTeam.split(",").map(a => a.trim()).filter(a => a),
      ncCount: parseInt(actualFormData.ncCount) || 0,
      obsCount: parseInt(actualFormData.obsCount) || 0,
      isCompleted: actualFormData.isCompleted,
      findings: actualFormData.findings,
      remarks: actualFormData.remarks,
    };
    setAuditActuals([newActual, ...auditActuals]);
    setShowActualForm(false);
    setActualFormData({
      auditNo: generateAuditNo(),
      auditDate: new Date().toISOString().split("T")[0],
      planId: "",
      targetDept: "",
      targetProcess: "",
      auditType: "",
      leadAuditor: "",
      auditTeam: "",
      ncCount: "",
      obsCount: "",
      isCompleted: false,
      findings: "",
      remarks: "",
    });
  };

  const filteredActuals = auditActuals.filter(
    (a) =>
      a.auditNo.toLowerCase().includes(actualSearch.toLowerCase()) ||
      a.targetDept.toLowerCase().includes(actualSearch.toLowerCase()) ||
      a.targetProcess.toLowerCase().includes(actualSearch.toLowerCase()) ||
      a.leadAuditor.toLowerCase().includes(actualSearch.toLowerCase())
  );

  // ============ Plan vs Actual Calculation ============
  const calculatePlanVsActual = (): PlanVsActual[] => {
    const yearPlans = annualPlans.filter(p => p.planYear === parseInt(planYear));
    const yearActuals = auditActuals.filter(a => {
      const auditYear = new Date(a.auditDate).getFullYear();
      return auditYear === parseInt(planYear);
    });

    return monthNames.map((_, monthIndex) => {
      const plannedCount = yearPlans.filter(p => p.monthlyPlan[monthIndex]).length;
      const monthActuals = yearActuals.filter(a => {
        const auditMonth = new Date(a.auditDate).getMonth();
        return auditMonth === monthIndex;
      });
      const actualCount = monthActuals.length;
      const completedCount = monthActuals.filter(a => a.isCompleted).length;
      const pendingCount = plannedCount - completedCount;
      const completionRate = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

      return {
        month: monthIndex + 1,
        planned: plannedCount,
        actual: actualCount,
        completed: completedCount,
        pending: Math.max(0, pendingCount),
        completionRate,
      };
    });
  };

  const planVsActualData = calculatePlanVsActual();
  const totalPlanned = planVsActualData.reduce((sum, d) => sum + d.planned, 0);
  const totalActual = planVsActualData.reduce((sum, d) => sum + d.actual, 0);
  const totalCompleted = planVsActualData.reduce((sum, d) => sum + d.completed, 0);
  const overallCompletionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

  // ============ Auditor Handlers ============
  const handleAuditorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAuditor: Auditor = {
      id: Date.now(),
      name: auditorFormData.name,
      employeeNo: auditorFormData.employeeNo,
      department: auditorFormData.department,
      qualification: auditorFormData.qualification,
      qualificationDate: auditorFormData.qualificationDate,
      expiryDate: auditorFormData.expiryDate,
      auditCount: 0,
      status: new Date(auditorFormData.expiryDate) > new Date() ? "유효" : "만료",
    };
    setAuditors([newAuditor, ...auditors]);
    setShowAuditorForm(false);
    setAuditorFormData({
      name: "",
      employeeNo: "",
      department: "",
      qualification: "",
      qualificationDate: "",
      expiryDate: "",
    });
  };

  // Calculate audit count per auditor
  const getAuditorAuditCount = (auditorName: string): number => {
    return auditActuals.filter(
      a => a.leadAuditor === auditorName || a.auditTeam.includes(auditorName)
    ).length;
  };

  // ============ Badge Variants ============
  const getStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      계획: "secondary",
      진행중: "default",
      완료: "success",
      보류: "warning",
    };
    return variants[status] || "secondary";
  };

  const getAuditTypeVariant = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      시스템: "default",
      프로세스: "warning",
      제품: "success",
    };
    return variants[type] || "secondary";
  };

  const getAuditorStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      유효: "success",
      갱신필요: "warning",
      만료: "destructive",
    };
    return variants[status] || "secondary";
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 100) return "text-green-600 bg-green-50";
    if (rate >= 75) return "text-blue-600 bg-blue-50";
    if (rate >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내부심사 계획대 실적</h1>
          <p className="text-muted-foreground">년간 심사계획 수립 및 실적 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="annual-plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            년간 심사계획
          </TabsTrigger>
          <TabsTrigger value="audit-actual" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            심사 실적 입력
          </TabsTrigger>
          <TabsTrigger value="plan-vs-actual" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            계획대 실적
          </TabsTrigger>
          <TabsTrigger value="auditor-assignment" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            심사원 배정현황
          </TabsTrigger>
        </TabsList>

        {/* ============ Tab 1: Annual Audit Plan ============ */}
        <TabsContent value="annual-plan">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {planYear}년 심사계획 수립
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={planYear} onValueChange={setPlanYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}년</SelectItem>
                      <SelectItem value={currentYear.toString()}>{currentYear}년</SelectItem>
                      <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}년</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowPlanForm(!showPlanForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    계획 등록
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showPlanForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">신규 심사계획 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePlanSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>심사유형 *</Label>
                          <Select
                            value={planFormData.auditType}
                            onValueChange={(v) => setPlanFormData({ ...planFormData, auditType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {auditTypeOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>대상부서 *</Label>
                          <Input
                            value={planFormData.targetDept}
                            onChange={(e) => setPlanFormData({ ...planFormData, targetDept: e.target.value })}
                            placeholder="예: 품질관리팀"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>대상프로세스 *</Label>
                          <Input
                            value={planFormData.targetProcess}
                            onChange={(e) => setPlanFormData({ ...planFormData, targetProcess: e.target.value })}
                            placeholder="예: ISO 9001 품질경영시스템"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>상태</Label>
                          <Select
                            value={planFormData.status}
                            onValueChange={(v) => setPlanFormData({ ...planFormData, status: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>심사원 배정 (쉼표로 구분)</Label>
                          <Input
                            value={planFormData.assignedAuditors}
                            onChange={(e) => setPlanFormData({ ...planFormData, assignedAuditors: e.target.value })}
                            placeholder="예: 김심사, 이검사"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>비고</Label>
                          <Input
                            value={planFormData.remarks}
                            onChange={(e) => setPlanFormData({ ...planFormData, remarks: e.target.value })}
                            placeholder="비고"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>월별 심사계획 (클릭하여 선택)</Label>
                        <div className="grid grid-cols-12 gap-2">
                          {monthNames.map((month, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => toggleMonthPlan(idx)}
                              className={`p-2 text-xs rounded border transition-colors ${
                                planFormData.monthlyPlan[idx]
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background hover:bg-muted border-input"
                              }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowPlanForm(false)}>
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

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background min-w-[100px]">심사유형</TableHead>
                      <TableHead className="min-w-[120px]">대상부서</TableHead>
                      <TableHead className="min-w-[180px]">대상프로세스</TableHead>
                      <TableHead className="min-w-[150px]">심사원</TableHead>
                      {monthNames.map((month, idx) => (
                        <TableHead key={idx} className="text-center min-w-[50px]">{month}</TableHead>
                      ))}
                      <TableHead className="min-w-[80px]">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                          등록된 심사계획이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="sticky left-0 bg-background">
                            <Badge variant={getAuditTypeVariant(plan.auditType)}>{plan.auditType}</Badge>
                          </TableCell>
                          <TableCell>{plan.targetDept}</TableCell>
                          <TableCell className="max-w-[180px] truncate">{plan.targetProcess}</TableCell>
                          <TableCell className="max-w-[150px]">
                            <div className="flex flex-wrap gap-1">
                              {plan.assignedAuditors.map((auditor, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{auditor}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          {plan.monthlyPlan.map((planned, idx) => (
                            <TableCell key={idx} className="text-center">
                              {planned ? (
                                <div className="w-6 h-6 mx-auto rounded-full bg-primary flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 mx-auto rounded-full bg-muted"></div>
                              )}
                            </TableCell>
                          ))}
                          <TableCell>
                            <Badge variant={getStatusVariant(plan.status)}>{plan.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 2: Audit Actual Entry ============ */}
        <TabsContent value="audit-actual">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  심사 실적 입력
                </CardTitle>
                <Button onClick={() => setShowActualForm(!showActualForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  실적 등록
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showActualForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">심사 실적 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleActualSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>심사번호</Label>
                          <Input value={actualFormData.auditNo} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>심사일 *</Label>
                          <Input
                            type="date"
                            value={actualFormData.auditDate}
                            onChange={(e) => setActualFormData({ ...actualFormData, auditDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>심사유형 *</Label>
                          <Select
                            value={actualFormData.auditType}
                            onValueChange={(v) => setActualFormData({ ...actualFormData, auditType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {auditTypeOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>관련 계획</Label>
                          <Select
                            value={actualFormData.planId}
                            onValueChange={(v) => {
                              const plan = annualPlans.find(p => p.id === parseInt(v));
                              if (plan) {
                                setActualFormData({
                                  ...actualFormData,
                                  planId: v,
                                  targetDept: plan.targetDept,
                                  targetProcess: plan.targetProcess,
                                  auditType: plan.auditType,
                                });
                              } else {
                                setActualFormData({ ...actualFormData, planId: v });
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="계획 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {annualPlans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id.toString()}>
                                  {plan.auditType} - {plan.targetProcess}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>대상부서 *</Label>
                          <Input
                            value={actualFormData.targetDept}
                            onChange={(e) => setActualFormData({ ...actualFormData, targetDept: e.target.value })}
                            placeholder="대상부서"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>대상프로세스 *</Label>
                          <Input
                            value={actualFormData.targetProcess}
                            onChange={(e) => setActualFormData({ ...actualFormData, targetProcess: e.target.value })}
                            placeholder="대상프로세스"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>선임심사원 *</Label>
                          <Select
                            value={actualFormData.leadAuditor}
                            onValueChange={(v) => setActualFormData({ ...actualFormData, leadAuditor: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선임심사원 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {auditors.filter(a => a.status !== "만료").map((auditor) => (
                                <SelectItem key={auditor.id} value={auditor.name}>
                                  {auditor.name} ({auditor.qualification})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>심사팀원 (쉼표로 구분)</Label>
                          <Input
                            value={actualFormData.auditTeam}
                            onChange={(e) => setActualFormData({ ...actualFormData, auditTeam: e.target.value })}
                            placeholder="예: 이검사, 박심사"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>부적합 건수</Label>
                          <Input
                            type="number"
                            min="0"
                            value={actualFormData.ncCount}
                            onChange={(e) => setActualFormData({ ...actualFormData, ncCount: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>관찰 건수</Label>
                          <Input
                            type="number"
                            min="0"
                            value={actualFormData.obsCount}
                            onChange={(e) => setActualFormData({ ...actualFormData, obsCount: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>완료 여부</Label>
                          <div className="flex items-center h-10">
                            <input
                              type="checkbox"
                              id="isCompleted"
                              checked={actualFormData.isCompleted}
                              onChange={(e) => setActualFormData({ ...actualFormData, isCompleted: e.target.checked })}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <label htmlFor="isCompleted" className="ml-2 text-sm">
                              심사 완료
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>심사 결과/발견사항</Label>
                          <Textarea
                            value={actualFormData.findings}
                            onChange={(e) => setActualFormData({ ...actualFormData, findings: e.target.value })}
                            placeholder="부적합 및 관찰사항 내용"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>비고</Label>
                          <Textarea
                            value={actualFormData.remarks}
                            onChange={(e) => setActualFormData({ ...actualFormData, remarks: e.target.value })}
                            placeholder="기타 특이사항"
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowActualForm(false)}>
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

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="심사번호, 부서, 프로세스, 심사원으로 검색..."
                  value={actualSearch}
                  onChange={(e) => setActualSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>심사번호</TableHead>
                      <TableHead>심사일</TableHead>
                      <TableHead>심사유형</TableHead>
                      <TableHead>대상부서</TableHead>
                      <TableHead>대상프로세스</TableHead>
                      <TableHead>선임심사원</TableHead>
                      <TableHead className="text-center">NC</TableHead>
                      <TableHead className="text-center">OBS</TableHead>
                      <TableHead>완료</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActuals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          등록된 심사 실적이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActuals.map((actual) => (
                        <TableRow key={actual.id}>
                          <TableCell className="font-mono text-sm">{actual.auditNo}</TableCell>
                          <TableCell>{actual.auditDate}</TableCell>
                          <TableCell>
                            <Badge variant={getAuditTypeVariant(actual.auditType)}>{actual.auditType}</Badge>
                          </TableCell>
                          <TableCell>{actual.targetDept}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{actual.targetProcess}</TableCell>
                          <TableCell>{actual.leadAuditor}</TableCell>
                          <TableCell className="text-center">
                            {actual.ncCount > 0 ? (
                              <Badge variant="destructive">{actual.ncCount}</Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {actual.obsCount > 0 ? (
                              <Badge variant="warning">{actual.obsCount}</Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {actual.isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 3: Plan vs Actual ============ */}
        <TabsContent value="plan-vs-actual">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">총 계획</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPlanned}건</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">총 실적</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalActual}건</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">완료</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalCompleted}건</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">완료율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${overallCompletionRate >= 80 ? "text-green-600" : overallCompletionRate >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                    {overallCompletionRate}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {planYear}년 계획대 실적 현황
                  </CardTitle>
                  <Select value={planYear} onValueChange={setPlanYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}년</SelectItem>
                      <SelectItem value={currentYear.toString()}>{currentYear}년</SelectItem>
                      <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>월</TableHead>
                        <TableHead className="text-center">계획</TableHead>
                        <TableHead className="text-center">실적</TableHead>
                        <TableHead className="text-center">완료</TableHead>
                        <TableHead className="text-center">미실시</TableHead>
                        <TableHead className="text-center">완료율</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planVsActualData.map((data) => {
                        const currentMonth = new Date().getMonth() + 1;
                        const isPastMonth = data.month < currentMonth;
                        const isCurrentMonth = data.month === currentMonth;
                        const hasPending = data.pending > 0 && isPastMonth;

                        return (
                          <TableRow key={data.month} className={hasPending ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{monthNames[data.month - 1]}</TableCell>
                            <TableCell className="text-center">{data.planned}</TableCell>
                            <TableCell className="text-center">{data.actual}</TableCell>
                            <TableCell className="text-center text-green-600 font-medium">{data.completed}</TableCell>
                            <TableCell className="text-center">
                              {data.pending > 0 ? (
                                <span className="text-red-600 font-medium flex items-center justify-center gap-1">
                                  {isPastMonth && <AlertTriangle className="h-4 w-4" />}
                                  {data.pending}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-1 rounded text-sm font-medium ${getCompletionRateColor(data.completionRate)}`}>
                                {data.planned > 0 ? `${data.completionRate}%` : "-"}
                              </span>
                            </TableCell>
                            <TableCell>
                              {data.planned === 0 ? (
                                <Badge variant="outline">계획없음</Badge>
                              ) : data.completionRate >= 100 ? (
                                <Badge variant="success">완료</Badge>
                              ) : isCurrentMonth ? (
                                <Badge variant="default">진행중</Badge>
                              ) : isPastMonth && data.pending > 0 ? (
                                <Badge variant="destructive">미완료</Badge>
                              ) : (
                                <Badge variant="secondary">예정</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell>합계</TableCell>
                        <TableCell className="text-center">{totalPlanned}</TableCell>
                        <TableCell className="text-center">{totalActual}</TableCell>
                        <TableCell className="text-center text-green-600">{totalCompleted}</TableCell>
                        <TableCell className="text-center text-red-600">
                          {planVsActualData.reduce((sum, d) => sum + (d.month < new Date().getMonth() + 1 ? d.pending : 0), 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getCompletionRateColor(overallCompletionRate)}`}>
                            {overallCompletionRate}%
                          </span>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pending Audits Alert */}
            {planVsActualData.some(d => d.pending > 0 && d.month < new Date().getMonth() + 1) && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    미실시 심사 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {planVsActualData
                      .filter(d => d.pending > 0 && d.month < new Date().getMonth() + 1)
                      .map(d => (
                        <div key={d.month} className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
                          <span className="font-medium text-red-700">{monthNames[d.month - 1]}</span>
                          <span className="text-red-600">미실시 {d.pending}건</span>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============ Tab 4: Auditor Assignment ============ */}
        <TabsContent value="auditor-assignment">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  심사원 배정현황
                </CardTitle>
                <Button onClick={() => setShowAuditorForm(!showAuditorForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  심사원 등록
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showAuditorForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">심사원 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAuditorSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>성명 *</Label>
                          <Input
                            value={auditorFormData.name}
                            onChange={(e) => setAuditorFormData({ ...auditorFormData, name: e.target.value })}
                            placeholder="성명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>사번 *</Label>
                          <Input
                            value={auditorFormData.employeeNo}
                            onChange={(e) => setAuditorFormData({ ...auditorFormData, employeeNo: e.target.value })}
                            placeholder="사번"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>소속부서 *</Label>
                          <Input
                            value={auditorFormData.department}
                            onChange={(e) => setAuditorFormData({ ...auditorFormData, department: e.target.value })}
                            placeholder="소속부서"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>자격구분 *</Label>
                          <Select
                            value={auditorFormData.qualification}
                            onValueChange={(v) => setAuditorFormData({ ...auditorFormData, qualification: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="자격 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {qualificationOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>자격취득일 *</Label>
                          <Input
                            type="date"
                            value={auditorFormData.qualificationDate}
                            onChange={(e) => setAuditorFormData({ ...auditorFormData, qualificationDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>자격만료일 *</Label>
                          <Input
                            type="date"
                            value={auditorFormData.expiryDate}
                            onChange={(e) => setAuditorFormData({ ...auditorFormData, expiryDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAuditorForm(false)}>
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

              {/* Auditor Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">총 심사원</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditors.length}명</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">선임심사원</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditors.filter(a => a.qualification === "선임심사원").length}명</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">자격유효</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{auditors.filter(a => a.status === "유효").length}명</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">갱신필요</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{auditors.filter(a => a.status === "갱신필요").length}명</div>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>성명</TableHead>
                      <TableHead>사번</TableHead>
                      <TableHead>소속부서</TableHead>
                      <TableHead>자격구분</TableHead>
                      <TableHead>자격취득일</TableHead>
                      <TableHead>자격만료일</TableHead>
                      <TableHead className="text-center">심사건수</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          등록된 심사원이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditors.map((auditor) => {
                        const auditCount = getAuditorAuditCount(auditor.name);
                        const expiryDate = new Date(auditor.expiryDate);
                        const today = new Date();
                        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        const status = daysUntilExpiry < 0 ? "만료" : daysUntilExpiry < 90 ? "갱신필요" : "유효";

                        return (
                          <TableRow key={auditor.id} className={status === "갱신필요" ? "bg-yellow-50" : status === "만료" ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{auditor.name}</TableCell>
                            <TableCell className="font-mono text-sm">{auditor.employeeNo}</TableCell>
                            <TableCell>{auditor.department}</TableCell>
                            <TableCell>
                              <Badge variant={auditor.qualification === "선임심사원" ? "default" : "secondary"}>
                                {auditor.qualification}
                              </Badge>
                            </TableCell>
                            <TableCell>{auditor.qualificationDate}</TableCell>
                            <TableCell>
                              <span className={daysUntilExpiry < 90 ? "text-red-600 font-medium" : ""}>
                                {auditor.expiryDate}
                                {daysUntilExpiry > 0 && daysUntilExpiry < 90 && (
                                  <span className="text-xs ml-1">({daysUntilExpiry}일 남음)</span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-semibold">{auditCount}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getAuditorStatusVariant(status)}>{status}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Expiring Qualifications Alert */}
              {auditors.some(a => {
                const daysUntilExpiry = Math.ceil((new Date(a.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry > 0 && daysUntilExpiry < 90;
              }) && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="h-5 w-5" />
                      자격 갱신 필요 심사원
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {auditors
                        .filter(a => {
                          const daysUntilExpiry = Math.ceil((new Date(a.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return daysUntilExpiry > 0 && daysUntilExpiry < 90;
                        })
                        .map(a => {
                          const daysUntilExpiry = Math.ceil((new Date(a.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <div key={a.id} className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                              <span className="font-medium">{a.name} ({a.qualification})</span>
                              <span className="text-yellow-700">만료일: {a.expiryDate} ({daysUntilExpiry}일 남음)</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
