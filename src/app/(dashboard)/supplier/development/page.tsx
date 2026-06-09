"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Save,
  FileText,
  Building2,
  Calendar,
  ClipboardList,
  CheckCircle2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

// Types
interface DevelopmentGoal {
  id: string;
  category: "quality" | "cost" | "delivery" | "other";
  description: string;
  targetValue: string;
  currentValue: string;
}

interface TargetSupplier {
  id: number;
  no: number;
  companyName: string;
  certificationStatus: string;
  certificationAgency: string;
  certificationPeriod: string;
  renewalDate: string;
  qualityRisk: number;
  deliveryRisk: number;
  supplierRisk: number;
  rpn: number;
  grade: string;
  qmsGoal: string;
  keyStatus2025: string;
  levelUpPlan: string;
  manager: string;
  responseStatus: string;
}

interface SupplierDevelopmentPlan {
  id: number;
  companyName: string;
  developmentGoal: string;
  executionPlan: string;
  schedule: Record<string, boolean>;
  manager: string;
  status: "planned" | "in-progress" | "completed" | "delayed";
}

interface ProgressRecord {
  id: number;
  companyName: string;
  developmentGoal: string;
  plannedDate: string;
  actualDate: string;
  progressRate: number;
  status: string;
  issues: string;
  actions: string;
}

interface AuditPlan {
  id: number;
  companyName: string;
  auditType: string;
  plannedDate: string;
  auditor: string;
  scope: string;
  status: "planned" | "completed" | "postponed";
  result: string;
  findings: string;
}

// Sample data for target suppliers (based on Excel data)
const sampleTargetSuppliers: TargetSupplier[] = [
  {
    id: 1,
    no: 1,
    companyName: "카라",
    certificationStatus: "IATF 16949 : 2016",
    certificationAgency: "KMAR",
    certificationPeriod: "2018.9.14",
    renewalDate: "2024.10.30",
    qualityRisk: 4,
    deliveryRisk: 3,
    supplierRisk: 3,
    rpn: 10,
    grade: "B",
    qmsGoal: "ISO9001 3자 & IATF16949 2자 준수",
    keyStatus2025: "2025.12월 사후심사 예정",
    levelUpPlan: "2024년 12월 ISO 9001 신규취득",
    manager: "유용희",
    responseStatus: "X",
  },
  {
    id: 2,
    no: 2,
    companyName: "G금강",
    certificationStatus: "ISO 9001:2015\nISO 14001:2015",
    certificationAgency: "(주)엠에스알 인증원",
    certificationPeriod: "2025.07.08",
    renewalDate: "2025.07.07",
    qualityRisk: 4,
    deliveryRisk: 3,
    supplierRisk: 4,
    rpn: 11,
    grade: "B",
    qmsGoal: "ISO9001 3자 & IATF16949 2자 준수",
    keyStatus2025: "2025.6월 ISO9001 사후심사 예정",
    levelUpPlan: "",
    manager: "박현수",
    responseStatus: "O",
  },
  {
    id: 3,
    no: 3,
    companyName: "신성화학",
    certificationStatus: "ISO 14001:2015\nISO 9001:2015\nISO 45001:2018",
    certificationAgency: "중소벤처기업 인증원",
    certificationPeriod: "2028.06.21",
    renewalDate: "2028.06.20",
    qualityRisk: 3,
    deliveryRisk: 3,
    supplierRisk: 4,
    rpn: 10,
    grade: "B",
    qmsGoal: "ISO9001 3자 & IATF16949 2자 준수",
    keyStatus2025: "",
    levelUpPlan: "",
    manager: "",
    responseStatus: "",
  },
  {
    id: 4,
    no: 4,
    companyName: "성신스프레이",
    certificationStatus: "IATF 16949 : 2016",
    certificationAgency: "SAI GLOBAL",
    certificationPeriod: "2025.08.30",
    renewalDate: "2025.06.18",
    qualityRisk: 4,
    deliveryRisk: 3,
    supplierRisk: 4,
    rpn: 11,
    grade: "B",
    qmsGoal: "ISO9001 3자 & IATF16949 2자 준수",
    keyStatus2025: "",
    levelUpPlan: "",
    manager: "",
    responseStatus: "",
  },
  {
    id: 5,
    no: 5,
    companyName: "모아에스엔피",
    certificationStatus: "KS Q ISO 9001:2009",
    certificationAgency: "한국경영인증원 KMR",
    certificationPeriod: "2019.06.30",
    renewalDate: "",
    qualityRisk: 3,
    deliveryRisk: 3,
    supplierRisk: 3,
    rpn: 9,
    grade: "C",
    qmsGoal: "ISO9001 3자 & MAQMSR 2자 준수",
    keyStatus2025: "",
    levelUpPlan: "",
    manager: "",
    responseStatus: "",
  },
  {
    id: 6,
    no: 6,
    companyName: "서라벌산업",
    certificationStatus: "ISO 9001:2015",
    certificationAgency: "KOSRE",
    certificationPeriod: "2026.10.20",
    renewalDate: "2026.10.19",
    qualityRisk: 1,
    deliveryRisk: 2,
    supplierRisk: 1,
    rpn: 4,
    grade: "D",
    qmsGoal: "ISO9001 3자인증",
    keyStatus2025: "",
    levelUpPlan: "",
    manager: "",
    responseStatus: "",
  },
  {
    id: 7,
    no: 7,
    companyName: "남일",
    certificationStatus: "IATF 16949 : 2016",
    certificationAgency: "NQA",
    certificationPeriod: "2027.10.08",
    renewalDate: "2027.10.09",
    qualityRisk: 4,
    deliveryRisk: 4,
    supplierRisk: 3,
    rpn: 11,
    grade: "B",
    qmsGoal: "ISO9001 3자 & IATF16949 2자 준수",
    keyStatus2025: "",
    levelUpPlan: "",
    manager: "",
    responseStatus: "",
  },
];

// Sample development plans
const sampleDevelopmentPlans: SupplierDevelopmentPlan[] = [
  {
    id: 1,
    companyName: "카라",
    developmentGoal: "ISO 9001 신규취득",
    executionPlan: "인증취득 지원 컨설팅 진행",
    schedule: {
      "1월": false,
      "2월": false,
      "3월": true,
      "4월": true,
      "5월": true,
      "6월": true,
      "7월": false,
      "8월": false,
      "9월": false,
      "10월": false,
      "11월": false,
      "12월": true,
    },
    manager: "유용희",
    status: "in-progress",
  },
  {
    id: 2,
    companyName: "G금강",
    developmentGoal: "품질불량률 개선",
    executionPlan: "공정관리 강화 및 검사기준 정립",
    schedule: {
      "1월": true,
      "2월": true,
      "3월": true,
      "4월": true,
      "5월": true,
      "6월": true,
      "7월": false,
      "8월": false,
      "9월": false,
      "10월": false,
      "11월": false,
      "12월": false,
    },
    manager: "박현수",
    status: "in-progress",
  },
  {
    id: 3,
    companyName: "모아에스엔피",
    developmentGoal: "MAQMSR 2자 준수",
    executionPlan: "품질경영시스템 문서화 및 교육",
    schedule: {
      "1월": false,
      "2월": false,
      "3월": false,
      "4월": true,
      "5월": true,
      "6월": true,
      "7월": true,
      "8월": true,
      "9월": true,
      "10월": false,
      "11월": false,
      "12월": false,
    },
    manager: "김개발",
    status: "planned",
  },
];

// Sample progress records
const sampleProgressRecords: ProgressRecord[] = [
  {
    id: 1,
    companyName: "카라",
    developmentGoal: "ISO 9001 신규취득",
    plannedDate: "2025-12-31",
    actualDate: "",
    progressRate: 35,
    status: "진행중",
    issues: "문서화 작업 지연",
    actions: "외부 컨설턴트 투입 예정",
  },
  {
    id: 2,
    companyName: "G금강",
    developmentGoal: "품질불량률 개선",
    plannedDate: "2025-06-30",
    actualDate: "",
    progressRate: 60,
    status: "진행중",
    issues: "없음",
    actions: "정기 모니터링 진행",
  },
  {
    id: 3,
    companyName: "남일",
    developmentGoal: "납기준수율 향상",
    plannedDate: "2025-03-31",
    actualDate: "2025-03-15",
    progressRate: 100,
    status: "완료",
    issues: "",
    actions: "",
  },
];

// Sample audit plans
const sampleAuditPlans: AuditPlan[] = [
  {
    id: 1,
    companyName: "카라",
    auditType: "2자 심사",
    plannedDate: "2025-06-15",
    auditor: "품질팀",
    scope: "품질경영시스템 전반",
    status: "planned",
    result: "",
    findings: "",
  },
  {
    id: 2,
    companyName: "G금강",
    auditType: "2자 심사",
    plannedDate: "2025-04-20",
    auditor: "품질팀",
    scope: "입고검사 프로세스",
    status: "completed",
    result: "적합",
    findings: "경미한 부적합 2건",
  },
  {
    id: 3,
    companyName: "모아에스엔피",
    auditType: "2자 심사",
    plannedDate: "2025-09-10",
    auditor: "품질팀",
    scope: "MAQMSR 준수 여부",
    status: "planned",
    result: "",
    findings: "",
  },
  {
    id: 4,
    companyName: "성신스프레이",
    auditType: "2자 심사",
    plannedDate: "2025-08-25",
    auditor: "품질팀",
    scope: "도장공정 품질관리",
    status: "planned",
    result: "",
    findings: "",
  },
];

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  planned: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
  postponed: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  planned: "계획",
  "in-progress": "진행중",
  completed: "완료",
  delayed: "지연",
  postponed: "연기",
};

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

export default function SupplierDevelopmentPlanPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Tab 1: Overview state
  const [planYear, setPlanYear] = useState("2025");
  const [goals, setGoals] = useState<DevelopmentGoal[]>([
    {
      id: "1",
      category: "quality",
      description: "공급자 품질불량률 50% 감소",
      targetValue: "0.5%",
      currentValue: "1.0%",
    },
    {
      id: "2",
      category: "cost",
      description: "원가절감 협력 활동 강화",
      targetValue: "3%",
      currentValue: "0%",
    },
    {
      id: "3",
      category: "delivery",
      description: "납기준수율 98% 달성",
      targetValue: "98%",
      currentValue: "95%",
    },
  ]);
  const [targetSuppliers] = useState<TargetSupplier[]>(sampleTargetSuppliers);

  // Tab 2: Development plans state
  const [developmentPlans] =
    useState<SupplierDevelopmentPlan[]>(sampleDevelopmentPlans);

  // Tab 3: Progress state
  const [progressRecords] = useState<ProgressRecord[]>(sampleProgressRecords);

  // Tab 4: Audit plans state
  const [auditPlans] = useState<AuditPlan[]>(sampleAuditPlans);

  const handleSave = () => {
    console.log("Saving development plan data:", {
      planYear,
      goals,
      targetSuppliers,
      developmentPlans,
      progressRecords,
      auditPlans,
    });
    alert("개발 계획서가 저장되었습니다.");
  };

  const addGoal = () => {
    const newGoal: DevelopmentGoal = {
      id: String(Date.now()),
      category: "quality",
      description: "",
      targetValue: "",
      currentValue: "",
    };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (
    id: string,
    field: keyof DevelopmentGoal,
    value: string
  ) => {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            2025년 (주)캠스 공급자 개발 계획서
          </h1>
          <p className="text-muted-foreground">협력업체 개발 계획 및 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개발 계획 개요</TabsTrigger>
          <TabsTrigger value="by-supplier">업체별 개발계획</TabsTrigger>
          <TabsTrigger value="progress">진행 현황</TabsTrigger>
          <TabsTrigger value="audit">2차 심사 계획</TabsTrigger>
        </TabsList>

        {/* Tab 1: Development Plan Overview */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Plan Year Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  계획년도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planYear">계획년도</Label>
                    <Select value={planYear} onValueChange={setPlanYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="년도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024년</SelectItem>
                        <SelectItem value="2025">2025년</SelectItem>
                        <SelectItem value="2026">2026년</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    목표 (품질향상, 원가절감, 납기개선 등)
                  </span>
                  <Button variant="outline" size="sm" onClick={addGoal}>
                    + 목표 추가
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg"
                    >
                      <div className="space-y-2">
                        <Label>분류</Label>
                        <Select
                          value={goal.category}
                          onValueChange={(value) =>
                            updateGoal(goal.id, "category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quality">품질향상</SelectItem>
                            <SelectItem value="cost">원가절감</SelectItem>
                            <SelectItem value="delivery">납기개선</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>목표 내용</Label>
                        <Input
                          value={goal.description}
                          onChange={(e) =>
                            updateGoal(goal.id, "description", e.target.value)
                          }
                          placeholder="목표 내용 입력"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>목표치</Label>
                        <Input
                          value={goal.targetValue}
                          onChange={(e) =>
                            updateGoal(goal.id, "targetValue", e.target.value)
                          }
                          placeholder="목표치"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>현재값</Label>
                        <div className="flex gap-2">
                          <Input
                            value={goal.currentValue}
                            onChange={(e) =>
                              updateGoal(
                                goal.id,
                                "currentValue",
                                e.target.value
                              )
                            }
                            placeholder="현재값"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGoal(goal.id)}
                            className="shrink-0 text-red-500 hover:text-red-700"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Suppliers List Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  대상업체 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">NO</TableHead>
                        <TableHead>업체명</TableHead>
                        <TableHead>인증현황</TableHead>
                        <TableHead>인증기관</TableHead>
                        <TableHead className="text-center">
                          품질
                          <br />
                          RISK
                        </TableHead>
                        <TableHead className="text-center">
                          납기
                          <br />
                          RISK
                        </TableHead>
                        <TableHead className="text-center">
                          공급자
                          <br />
                          RISK
                        </TableHead>
                        <TableHead className="text-center">RPN</TableHead>
                        <TableHead className="text-center">등급</TableHead>
                        <TableHead>QMS 목표</TableHead>
                        <TableHead>담당자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {targetSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>{supplier.no}</TableCell>
                          <TableCell className="font-medium">
                            {supplier.companyName}
                          </TableCell>
                          <TableCell className="text-sm whitespace-pre-line max-w-[200px]">
                            {supplier.certificationStatus}
                          </TableCell>
                          <TableCell className="text-sm">
                            {supplier.certificationAgency}
                          </TableCell>
                          <TableCell className="text-center">
                            {supplier.qualityRisk}
                          </TableCell>
                          <TableCell className="text-center">
                            {supplier.deliveryRisk}
                          </TableCell>
                          <TableCell className="text-center">
                            {supplier.supplierRisk}
                          </TableCell>
                          <TableCell className="text-center font-bold">
                            {supplier.rpn}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[supplier.grade]}`}
                            >
                              {supplier.grade}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm max-w-[150px]">
                            {supplier.qmsGoal}
                          </TableCell>
                          <TableCell>{supplier.manager}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Grade Legend */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">등급 기준</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                        A
                      </span>
                      <span>RPN 12 이상</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        B
                      </span>
                      <span>RPN 10 이상</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                        C
                      </span>
                      <span>RPN 5 이상</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">
                        D
                      </span>
                      <span>RPN 5 미만</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Development Plan by Supplier */}
        <TabsContent value="by-supplier">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                업체별 개발계획
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">
                        업체명
                      </TableHead>
                      <TableHead>개발목표</TableHead>
                      <TableHead>실행계획</TableHead>
                      {months.map((month) => (
                        <TableHead
                          key={month}
                          className="text-center w-12 min-w-12"
                        >
                          {month}
                        </TableHead>
                      ))}
                      <TableHead>담당자</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {developmentPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="sticky left-0 bg-background font-medium">
                          {plan.companyName}
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          {plan.developmentGoal}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          {plan.executionPlan}
                        </TableCell>
                        {months.map((month) => (
                          <TableCell key={month} className="text-center">
                            {plan.schedule[month] && (
                              <div className="w-4 h-4 mx-auto bg-blue-500 rounded" />
                            )}
                          </TableCell>
                        ))}
                        <TableCell>{plan.manager}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[plan.status]}`}
                          >
                            {statusLabels[plan.status]}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Add New Plan Form */}
              <div className="mt-6 p-4 border rounded-lg space-y-4">
                <h4 className="font-medium">신규 개발계획 추가</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>업체명</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetSuppliers.map((s) => (
                          <SelectItem key={s.id} value={s.companyName}>
                            {s.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>개발목표</Label>
                    <Input placeholder="개발목표 입력" />
                  </div>
                  <div className="space-y-2">
                    <Label>실행계획</Label>
                    <Input placeholder="실행계획 입력" />
                  </div>
                  <div className="space-y-2">
                    <Label>담당자</Label>
                    <Input placeholder="담당자명" />
                  </div>
                </div>
                <Button variant="outline" className="mt-2">
                  + 계획 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Progress Tracking */}
        <TabsContent value="progress">
          <div className="space-y-6">
            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">전체 계획</p>
                      <p className="text-2xl font-bold">
                        {progressRecords.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">완료</p>
                      <p className="text-2xl font-bold">
                        {
                          progressRecords.filter((p) => p.status === "완료")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">진행중</p>
                      <p className="text-2xl font-bold">
                        {
                          progressRecords.filter((p) => p.status === "진행중")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Calendar className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">평균 진행률</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          progressRecords.reduce(
                            (sum, p) => sum + p.progressRate,
                            0
                          ) / progressRecords.length
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  진행 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체명</TableHead>
                      <TableHead>개발목표</TableHead>
                      <TableHead>계획일</TableHead>
                      <TableHead>완료일</TableHead>
                      <TableHead>진행률</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>이슈사항</TableHead>
                      <TableHead>조치계획</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.companyName}
                        </TableCell>
                        <TableCell>{record.developmentGoal}</TableCell>
                        <TableCell>{record.plannedDate}</TableCell>
                        <TableCell>{record.actualDate || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  record.progressRate >= 100
                                    ? "bg-green-500"
                                    : record.progressRate >= 50
                                      ? "bg-blue-500"
                                      : "bg-yellow-500"
                                }`}
                                style={{ width: `${record.progressRate}%` }}
                              />
                            </div>
                            <span className="text-sm">{record.progressRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "완료"
                                ? "bg-green-100 text-green-800"
                                : record.status === "진행중"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          {record.issues || "-"}
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          {record.actions || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Progress Update Form */}
            <Card>
              <CardHeader>
                <CardTitle>진행 현황 업데이트</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>업체 선택</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {progressRecords.map((p) => (
                          <SelectItem key={p.id} value={p.companyName}>
                            {p.companyName} - {p.developmentGoal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>진행률 (%)</Label>
                    <Input type="number" min="0" max="100" placeholder="진행률" />
                  </div>
                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="진행중">진행중</SelectItem>
                        <SelectItem value="완료">완료</SelectItem>
                        <SelectItem value="지연">지연</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>이슈사항</Label>
                    <Textarea placeholder="이슈사항을 입력하세요" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>조치계획</Label>
                    <Textarea placeholder="조치계획을 입력하세요" rows={3} />
                  </div>
                </div>
                <Button variant="outline">진행 현황 업데이트</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 2nd Party Audit Plan */}
        <TabsContent value="audit">
          <div className="space-y-6">
            {/* Audit Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <ClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        전체 심사 계획
                      </p>
                      <p className="text-2xl font-bold">{auditPlans.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">완료</p>
                      <p className="text-2xl font-bold">
                        {
                          auditPlans.filter((a) => a.status === "completed")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">예정</p>
                      <p className="text-2xl font-bold">
                        {
                          auditPlans.filter((a) => a.status === "planned")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Plan Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  2차 심사 계획
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체명</TableHead>
                      <TableHead>심사유형</TableHead>
                      <TableHead>심사예정일</TableHead>
                      <TableHead>심사원</TableHead>
                      <TableHead>심사범위</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>결과</TableHead>
                      <TableHead>발견사항</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditPlans.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">
                          {audit.companyName}
                        </TableCell>
                        <TableCell>{audit.auditType}</TableCell>
                        <TableCell>{audit.plannedDate}</TableCell>
                        <TableCell>{audit.auditor}</TableCell>
                        <TableCell className="max-w-[200px]">
                          {audit.scope}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[audit.status]}`}
                          >
                            {statusLabels[audit.status]}
                          </span>
                        </TableCell>
                        <TableCell>
                          {audit.result ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                audit.result === "적합"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {audit.result}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          {audit.findings || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Add New Audit Plan Form */}
            <Card>
              <CardHeader>
                <CardTitle>신규 심사 계획 등록</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>업체명</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetSuppliers.map((s) => (
                          <SelectItem key={s.id} value={s.companyName}>
                            {s.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>심사유형</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="심사유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2nd-audit">2자 심사</SelectItem>
                        <SelectItem value="follow-up">후속심사</SelectItem>
                        <SelectItem value="special">특별심사</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>심사예정일</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>심사원</Label>
                    <Input placeholder="심사원명" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>심사범위</Label>
                  <Textarea
                    placeholder="심사범위를 입력하세요"
                    rows={2}
                  />
                </div>
                <Button variant="outline">+ 심사 계획 추가</Button>
              </CardContent>
            </Card>

            {/* Audit Result Registration */}
            <Card>
              <CardHeader>
                <CardTitle>심사 결과 등록</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>심사 선택</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="심사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {auditPlans
                          .filter((a) => a.status === "planned")
                          .map((a) => (
                            <SelectItem
                              key={a.id}
                              value={String(a.id)}
                            >
                              {a.companyName} - {a.plannedDate}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>결과</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="결과 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">적합</SelectItem>
                        <SelectItem value="conditional">조건부 적합</SelectItem>
                        <SelectItem value="fail">부적합</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>실제 심사일</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>발견사항</Label>
                  <Textarea
                    placeholder="발견사항을 입력하세요"
                    rows={3}
                  />
                </div>
                <Button variant="outline">결과 등록</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
