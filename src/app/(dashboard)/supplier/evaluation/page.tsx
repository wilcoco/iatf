"use client";

import { useState, useMemo } from "react";
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
  Calendar,
  ClipboardCheck,
  BarChart3,
  History,
  Save,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getActiveSuppliers, getSupplierByCode, type Supplier } from "@/lib/master-data";

interface AnnualPlan {
  id: string;
  year: number;
  supplierId: string;
  supplierName: string;
  evaluationType: "정기" | "수시" | "신규";
  plannedMonth: number; // 1-12
  status: "계획" | "완료" | "미평가";
}

interface EvaluationRecord {
  id: string;
  evaluationNumber: string;
  evaluationDate: string;
  supplierId: string;
  supplierName: string;
  evaluationType: "정기" | "수시" | "신규";
  // Scores
  qualityScore: number; // max 40
  deliveryScore: number; // max 30
  priceScore: number; // max 15
  techScore: number; // max 15
  totalScore: number; // max 100
  grade: "A" | "B" | "C" | "D";
  action: string;
  evaluator: string;
  remarks: string;
}


// Sample annual plans for 2026
const samplePlans: AnnualPlan[] = [
  { id: "P001", year: 2026, supplierId: "SUP-001", supplierName: "(주)카라", evaluationType: "정기", plannedMonth: 3, status: "완료" },
  { id: "P002", year: 2026, supplierId: "SUP-002", supplierName: "G금강", evaluationType: "정기", plannedMonth: 3, status: "완료" },
  { id: "P003", year: 2026, supplierId: "SUP-003", supplierName: "신성화학", evaluationType: "정기", plannedMonth: 4, status: "완료" },
  { id: "P004", year: 2026, supplierId: "SUP-004", supplierName: "성신스프레이", evaluationType: "정기", plannedMonth: 4, status: "완료" },
  { id: "P005", year: 2026, supplierId: "SUP-005", supplierName: "모아에스엔피", evaluationType: "정기", plannedMonth: 5, status: "미평가" },
  { id: "P006", year: 2026, supplierId: "SUP-001", supplierName: "(주)카라", evaluationType: "정기", plannedMonth: 6, status: "계획" },
  { id: "P007", year: 2026, supplierId: "SUP-002", supplierName: "G금강", evaluationType: "정기", plannedMonth: 6, status: "계획" },
  { id: "P008", year: 2026, supplierId: "SUP-003", supplierName: "신성화학", evaluationType: "정기", plannedMonth: 7, status: "계획" },
  { id: "P009", year: 2026, supplierId: "SUP-004", supplierName: "성신스프레이", evaluationType: "정기", plannedMonth: 7, status: "계획" },
  { id: "P010", year: 2026, supplierId: "SUP-005", supplierName: "모아에스엔피", evaluationType: "정기", plannedMonth: 8, status: "계획" },
];

// Sample evaluation records
const sampleEvaluations: EvaluationRecord[] = [
  {
    id: "E002", evaluationNumber: "EVL-2026-001", evaluationDate: "2026-03-15", supplierId: "SUP-001", supplierName: "(주)카라",
    evaluationType: "정기", qualityScore: 38, deliveryScore: 28, priceScore: 14, techScore: 12, totalScore: 92, grade: "A",
    action: "유지", evaluator: "김평가", remarks: "품질 우수"
  },
  {
    id: "E003", evaluationNumber: "EVL-2026-002", evaluationDate: "2026-03-20", supplierId: "SUP-002", supplierName: "G금강",
    evaluationType: "정기", qualityScore: 30, deliveryScore: 24, priceScore: 12, techScore: 12, totalScore: 78, grade: "B",
    action: "관리", evaluator: "이평가", remarks: "납기 개선 필요"
  },
  {
    id: "E004", evaluationNumber: "EVL-2026-003", evaluationDate: "2026-04-10", supplierId: "SUP-003", supplierName: "신성화학",
    evaluationType: "정기", qualityScore: 26, deliveryScore: 22, priceScore: 10, techScore: 7, totalScore: 65, grade: "C",
    action: "개선요구", evaluator: "박평가", remarks: "품질 불량률 증가, 개선 필요"
  },
  {
    id: "E005", evaluationNumber: "EVL-2026-004", evaluationDate: "2026-04-18", supplierId: "SUP-004", supplierName: "성신스프레이",
    evaluationType: "정기", qualityScore: 20, deliveryScore: 18, priceScore: 8, techScore: 6, totalScore: 52, grade: "D",
    action: "거래중지검토", evaluator: "김평가", remarks: "품질 및 납기 문제 심각"
  },
  // Historical data for SUP-001
  {
    id: "E006", evaluationNumber: "EVL-2025-010", evaluationDate: "2025-09-15", supplierId: "SUP-001", supplierName: "(주)카라",
    evaluationType: "정기", qualityScore: 36, deliveryScore: 26, priceScore: 13, techScore: 11, totalScore: 86, grade: "B",
    action: "관리", evaluator: "김평가", remarks: ""
  },
  {
    id: "E007", evaluationNumber: "EVL-2025-004", evaluationDate: "2025-03-15", supplierId: "SUP-001", supplierName: "(주)카라",
    evaluationType: "정기", qualityScore: 34, deliveryScore: 25, priceScore: 12, techScore: 10, totalScore: 81, grade: "B",
    action: "관리", evaluator: "김평가", remarks: ""
  },
  // Historical data for SUP-002
  {
    id: "E008", evaluationNumber: "EVL-2025-011", evaluationDate: "2025-09-20", supplierId: "SUP-002", supplierName: "G금강",
    evaluationType: "정기", qualityScore: 32, deliveryScore: 22, priceScore: 11, techScore: 10, totalScore: 75, grade: "B",
    action: "관리", evaluator: "이평가", remarks: ""
  },
  // Historical data for SUP-003
  {
    id: "E009", evaluationNumber: "EVL-2025-012", evaluationDate: "2025-10-10", supplierId: "SUP-003", supplierName: "신성화학",
    evaluationType: "정기", qualityScore: 30, deliveryScore: 24, priceScore: 11, techScore: 9, totalScore: 74, grade: "B",
    action: "관리", evaluator: "박평가", remarks: ""
  },
  // Historical data for SUP-004
  {
    id: "E010", evaluationNumber: "EVL-2025-013", evaluationDate: "2025-10-18", supplierId: "SUP-004", supplierName: "성신스프레이",
    evaluationType: "정기", qualityScore: 28, deliveryScore: 22, priceScore: 10, techScore: 8, totalScore: 68, grade: "C",
    action: "개선요구", evaluator: "김평가", remarks: ""
  },
];

const months = [
  { value: 1, label: "1월" },
  { value: 2, label: "2월" },
  { value: 3, label: "3월" },
  { value: 4, label: "4월" },
  { value: 5, label: "5월" },
  { value: 6, label: "6월" },
  { value: 7, label: "7월" },
  { value: 8, label: "8월" },
  { value: 9, label: "9월" },
  { value: 10, label: "10월" },
  { value: 11, label: "11월" },
  { value: 12, label: "12월" },
];

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
};

const actionColors: Record<string, string> = {
  유지: "bg-green-100 text-green-800",
  관리: "bg-blue-100 text-blue-800",
  개선요구: "bg-yellow-100 text-yellow-800",
  거래중지검토: "bg-red-100 text-red-800",
};

const statusColors: Record<string, string> = {
  계획: "bg-gray-100 text-gray-800",
  완료: "bg-green-100 text-green-800",
  미평가: "bg-red-100 text-red-800",
};

function calculateGrade(totalScore: number): { grade: "A" | "B" | "C" | "D"; action: string } {
  if (totalScore >= 90) return { grade: "A", action: "유지" };
  if (totalScore >= 70) return { grade: "B", action: "관리" };
  if (totalScore >= 60) return { grade: "C", action: "개선요구" };
  return { grade: "D", action: "거래중지검토" };
}

function generateEvaluationNumber(evaluations: EvaluationRecord[]): string {
  const year = new Date().getFullYear();
  const count = evaluations.filter((e) => e.evaluationNumber.includes(`EVL-${year}`)).length;
  return `EVL-${year}-${String(count + 1).padStart(3, "0")}`;
}

export default function SupplierEvaluationPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [plans, setPlans] = useState<AnnualPlan[]>(samplePlans);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(sampleEvaluations);

  // Use shared supplier data from master-data
  const suppliers = getActiveSuppliers();

  // New plan form state
  const [newPlan, setNewPlan] = useState({
    supplierId: "",
    evaluationType: "" as "정기" | "수시" | "신규" | "",
    plannedMonth: 0,
  });

  // Evaluation form state
  const [evalForm, setEvalForm] = useState({
    evaluationDate: new Date().toISOString().split("T")[0],
    supplierId: "",
    evaluationType: "" as "정기" | "수시" | "신규" | "",
    qualityScore: 0,
    deliveryScore: 0,
    priceScore: 0,
    techScore: 0,
    evaluator: "",
    remarks: "",
  });

  // Filter states
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState("");

  // Computed values
  const yearPlans = useMemo(() => plans.filter((p) => p.year === selectedYear), [plans, selectedYear]);

  const plansByMonth = useMemo(() => {
    const result: Record<number, AnnualPlan[]> = {};
    for (let m = 1; m <= 12; m++) {
      result[m] = yearPlans.filter((p) => p.plannedMonth === m);
    }
    return result;
  }, [yearPlans]);

  const planVsActualStats = useMemo(() => {
    const stats = months.map((m) => {
      const monthPlans = yearPlans.filter((p) => p.plannedMonth === m.value);
      const planned = monthPlans.length;
      const completed = monthPlans.filter((p) => p.status === "완료").length;
      const pending = monthPlans.filter((p) => p.status === "미평가").length;
      return {
        month: m.value,
        monthLabel: m.label,
        planned,
        completed,
        pending,
        rate: planned > 0 ? Math.round((completed / planned) * 100) : 0,
      };
    });
    return stats;
  }, [yearPlans]);

  const pendingSuppliers = useMemo(() => {
    return yearPlans.filter((p) => p.status === "미평가");
  }, [yearPlans]);

  const supplierHistory = useMemo(() => {
    const history: Record<string, EvaluationRecord[]> = {};
    evaluations.forEach((e) => {
      if (!history[e.supplierId]) {
        history[e.supplierId] = [];
      }
      history[e.supplierId].push(e);
    });
    // Sort each supplier's history by date descending
    Object.keys(history).forEach((key) => {
      history[key].sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime());
    });
    return history;
  }, [evaluations]);

  const filteredSupplierHistory = useMemo(() => {
    if (!selectedSupplierFilter) return supplierHistory;
    const filtered: Record<string, EvaluationRecord[]> = {};
    if (supplierHistory[selectedSupplierFilter]) {
      filtered[selectedSupplierFilter] = supplierHistory[selectedSupplierFilter];
    }
    return filtered;
  }, [supplierHistory, selectedSupplierFilter]);

  // Handlers
  const handleAddPlan = () => {
    if (!newPlan.supplierId || !newPlan.evaluationType || !newPlan.plannedMonth) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const supplier = getSupplierByCode(newPlan.supplierId);
    if (!supplier) return;

    const plan: AnnualPlan = {
      id: `P${String(Date.now()).slice(-6)}`,
      year: selectedYear,
      supplierId: supplier.code,
      supplierName: supplier.name,
      evaluationType: newPlan.evaluationType as "정기" | "수시" | "신규",
      plannedMonth: newPlan.plannedMonth,
      status: "계획",
    };

    setPlans((prev) => [...prev, plan]);
    setNewPlan({ supplierId: "", evaluationType: "", plannedMonth: 0 });
  };

  const handleSaveEvaluation = () => {
    if (!evalForm.supplierId || !evalForm.evaluationType || !evalForm.evaluator) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const totalScore = evalForm.qualityScore + evalForm.deliveryScore + evalForm.priceScore + evalForm.techScore;
    const { grade, action } = calculateGrade(totalScore);
    const supplier = getSupplierByCode(evalForm.supplierId);

    const newEval: EvaluationRecord = {
      id: `E${String(Date.now()).slice(-6)}`,
      evaluationNumber: generateEvaluationNumber(evaluations),
      evaluationDate: evalForm.evaluationDate,
      supplierId: evalForm.supplierId,
      supplierName: supplier?.name || "",
      evaluationType: evalForm.evaluationType as "정기" | "수시" | "신규",
      qualityScore: evalForm.qualityScore,
      deliveryScore: evalForm.deliveryScore,
      priceScore: evalForm.priceScore,
      techScore: evalForm.techScore,
      totalScore,
      grade,
      action,
      evaluator: evalForm.evaluator,
      remarks: evalForm.remarks,
    };

    setEvaluations((prev) => [newEval, ...prev]);

    // Update plan status if matching
    const evalMonth = new Date(evalForm.evaluationDate).getMonth() + 1;
    setPlans((prev) =>
      prev.map((p) => {
        if (
          p.supplierId === evalForm.supplierId &&
          p.year === selectedYear &&
          (p.plannedMonth === evalMonth || p.status === "미평가") &&
          p.status !== "완료"
        ) {
          return { ...p, status: "완료" };
        }
        return p;
      })
    );

    // Reset form
    setEvalForm({
      evaluationDate: new Date().toISOString().split("T")[0],
      supplierId: "",
      evaluationType: "",
      qualityScore: 0,
      deliveryScore: 0,
      priceScore: 0,
      techScore: 0,
      evaluator: "",
      remarks: "",
    });

    alert("평가가 저장되었습니다.");
  };

  const currentEvalTotal = evalForm.qualityScore + evalForm.deliveryScore + evalForm.priceScore + evalForm.techScore;
  const currentEvalGrade = calculateGrade(currentEvalTotal);

  // Grade trend indicator
  const getGradeTrend = (history: EvaluationRecord[]) => {
    if (history.length < 2) return null;
    const current = history[0].totalScore;
    const previous = history[1].totalScore;
    if (current > previous) return { trend: "up", diff: current - previous };
    if (current < previous) return { trend: "down", diff: previous - current };
    return { trend: "same", diff: 0 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공급자평가 - 년간 정기평가 계획대 실적</h1>
          <p className="text-muted-foreground">협력업체 년간 평가계획 수립 및 실적 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">
            <Calendar className="mr-2 h-4 w-4" />
            년간 평가계획
          </TabsTrigger>
          <TabsTrigger value="entry">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            평가 실적 입력
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <BarChart3 className="mr-2 h-4 w-4" />
            계획대 실적 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            업체별 평가이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 년간 평가계획 */}
        <TabsContent value="plan">
          <div className="space-y-6">
            {/* Year Selection and New Plan Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {selectedYear}년 평가계획 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>계획년도</Label>
                    <Select
                      value={String(selectedYear)}
                      onValueChange={(value) => setSelectedYear(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025년</SelectItem>
                        <SelectItem value="2026">2026년</SelectItem>
                        <SelectItem value="2027">2027년</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>대상업체</Label>
                    <Select
                      value={newPlan.supplierId}
                      onValueChange={(value) => setNewPlan({ ...newPlan, supplierId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>평가유형</Label>
                    <Select
                      value={newPlan.evaluationType}
                      onValueChange={(value) => setNewPlan({ ...newPlan, evaluationType: value as "정기" | "수시" | "신규" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="정기">정기</SelectItem>
                        <SelectItem value="수시">수시</SelectItem>
                        <SelectItem value="신규">신규</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>평가예정월</Label>
                    <Select
                      value={newPlan.plannedMonth ? String(newPlan.plannedMonth) : ""}
                      onValueChange={(value) => setNewPlan({ ...newPlan, plannedMonth: Number(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="월 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m.value} value={String(m.value)}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddPlan}>
                    <Plus className="mr-2 h-4 w-4" />
                    계획 추가
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Plan Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedYear}년 월별 평가 대상업체 배정 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">업체명</TableHead>
                        {months.map((m) => (
                          <TableHead key={m.value} className="text-center min-w-[80px]">
                            {m.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suppliers.map((supplier) => {
                        const supplierPlans = yearPlans.filter((p) => p.supplierId === supplier.code);
                        return (
                          <TableRow key={supplier.code}>
                            <TableCell className="font-medium">{supplier.name}</TableCell>
                            {months.map((m) => {
                              const monthPlan = supplierPlans.find((p) => p.plannedMonth === m.value);
                              return (
                                <TableCell key={m.value} className="text-center">
                                  {monthPlan ? (
                                    <div className="space-y-1">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          monthPlan.evaluationType === "정기"
                                            ? "border-blue-500 text-blue-700"
                                            : monthPlan.evaluationType === "신규"
                                            ? "border-green-500 text-green-700"
                                            : "border-orange-500 text-orange-700"
                                        }`}
                                      >
                                        {monthPlan.evaluationType}
                                      </Badge>
                                      <div>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${statusColors[monthPlan.status]}`}>
                                          {monthPlan.status}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Plan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{yearPlans.length}</div>
                    <div className="text-sm text-muted-foreground">총 계획건수</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {yearPlans.filter((p) => p.status === "완료").length}
                    </div>
                    <div className="text-sm text-muted-foreground">완료</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">
                      {yearPlans.filter((p) => p.status === "계획").length}
                    </div>
                    <div className="text-sm text-muted-foreground">예정</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {yearPlans.filter((p) => p.status === "미평가").length}
                    </div>
                    <div className="text-sm text-muted-foreground">미평가</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: 평가 실적 입력 */}
        <TabsContent value="entry">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Evaluation Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  평가 실적 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label>평가번호</Label>
                    <Input value={generateEvaluationNumber(evaluations)} disabled className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>평가일</Label>
                    <Input
                      type="date"
                      value={evalForm.evaluationDate}
                      onChange={(e) => setEvalForm({ ...evalForm, evaluationDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>업체명 *</Label>
                    <Select
                      value={evalForm.supplierId}
                      onValueChange={(value) => setEvalForm({ ...evalForm, supplierId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>평가유형 *</Label>
                    <Select
                      value={evalForm.evaluationType}
                      onValueChange={(value) => setEvalForm({ ...evalForm, evaluationType: value as "정기" | "수시" | "신규" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="정기">정기</SelectItem>
                        <SelectItem value="수시">수시</SelectItem>
                        <SelectItem value="신규">신규</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Score Input */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">평가항목별 점수</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>품질 (40점 만점)</Label>
                        <span className="font-bold text-primary">{evalForm.qualityScore}점</span>
                      </div>
                      <Input
                        type="range"
                        min="0"
                        max="40"
                        value={evalForm.qualityScore}
                        onChange={(e) => setEvalForm({ ...evalForm, qualityScore: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        입고불량율, 클레임건수, 품질인증 등
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>납기 (30점 만점)</Label>
                        <span className="font-bold text-primary">{evalForm.deliveryScore}점</span>
                      </div>
                      <Input
                        type="range"
                        min="0"
                        max="30"
                        value={evalForm.deliveryScore}
                        onChange={(e) => setEvalForm({ ...evalForm, deliveryScore: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        납기준수율, 긴급대응 등
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>가격 (15점 만점)</Label>
                        <span className="font-bold text-primary">{evalForm.priceScore}점</span>
                      </div>
                      <Input
                        type="range"
                        min="0"
                        max="15"
                        value={evalForm.priceScore}
                        onChange={(e) => setEvalForm({ ...evalForm, priceScore: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        가격경쟁력, 원가절감 협조 등
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>기술 (15점 만점)</Label>
                        <span className="font-bold text-primary">{evalForm.techScore}점</span>
                      </div>
                      <Input
                        type="range"
                        min="0"
                        max="15"
                        value={evalForm.techScore}
                        onChange={(e) => setEvalForm({ ...evalForm, techScore: Number(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">
                        기술역량, 협력도 등
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evaluator and Remarks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>평가자 *</Label>
                    <Input
                      value={evalForm.evaluator}
                      onChange={(e) => setEvalForm({ ...evalForm, evaluator: e.target.value })}
                      placeholder="평가자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Textarea
                      value={evalForm.remarks}
                      onChange={(e) => setEvalForm({ ...evalForm, remarks: e.target.value })}
                      placeholder="평가 의견"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveEvaluation}>
                    <Save className="mr-2 h-4 w-4" />
                    평가 저장
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Evaluation Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>현재 평가 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-4xl font-bold">{currentEvalTotal}/100</div>
                      <div className="text-lg text-muted-foreground">총점</div>
                      {currentEvalTotal > 0 && (
                        <div className="mt-2">
                          <span className={`px-4 py-2 rounded-full text-lg font-bold ${gradeColors[currentEvalGrade.grade]}`}>
                            {currentEvalGrade.grade}등급
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>품질</span>
                        <span className="font-bold">{evalForm.qualityScore}/40</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>납기</span>
                        <span className="font-bold">{evalForm.deliveryScore}/30</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>가격</span>
                        <span className="font-bold">{evalForm.priceScore}/15</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <span>기술</span>
                        <span className="font-bold">{evalForm.techScore}/15</span>
                      </div>
                    </div>
                    {currentEvalTotal > 0 && (
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-sm text-muted-foreground">조치사항</div>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${actionColors[currentEvalGrade.action]}`}>
                          {currentEvalGrade.action}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>등급 기준</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded ${gradeColors["A"]}`}>A등급</span>
                      <span>90점 이상 - 유지</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded ${gradeColors["B"]}`}>B등급</span>
                      <span>70~89점 - 관리</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded ${gradeColors["C"]}`}>C등급</span>
                      <span>60~69점 - 개선요구</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded ${gradeColors["D"]}`}>D등급</span>
                      <span>60점 미만 - 거래중지검토</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: 계획대 실적 현황 */}
        <TabsContent value="comparison">
          <div className="space-y-6">
            {/* Year Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {selectedYear}년 계획대 실적 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Label>년도 선택</Label>
                  <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2026">2026년</SelectItem>
                      <SelectItem value="2027">2027년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Monthly Comparison Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-center">계획</TableHead>
                      <TableHead className="text-center">실적</TableHead>
                      <TableHead className="text-center">미평가</TableHead>
                      <TableHead className="text-center">달성률</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planVsActualStats.map((stat) => (
                      <TableRow key={stat.month}>
                        <TableCell className="font-medium">{stat.monthLabel}</TableCell>
                        <TableCell className="text-center">{stat.planned}건</TableCell>
                        <TableCell className="text-center text-green-600 font-medium">{stat.completed}건</TableCell>
                        <TableCell className="text-center text-red-600 font-medium">{stat.pending}건</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`font-bold ${
                              stat.rate >= 100 ? "text-green-600" : stat.rate >= 50 ? "text-yellow-600" : "text-red-600"
                            }`}
                          >
                            {stat.rate}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {stat.planned === 0 ? (
                            <span className="text-muted-foreground">-</span>
                          ) : stat.rate >= 100 ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              완료
                            </Badge>
                          ) : stat.pending > 0 ? (
                            <Badge variant="default" className="bg-red-500">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              미완료
                            </Badge>
                          ) : (
                            <Badge variant="secondary">예정</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{yearPlans.length}</div>
                    <div className="text-sm text-muted-foreground">년간 총 계획</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {yearPlans.filter((p) => p.status === "완료").length}
                    </div>
                    <div className="text-sm text-muted-foreground">완료 실적</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {yearPlans.length > 0
                        ? Math.round((yearPlans.filter((p) => p.status === "완료").length / yearPlans.length) * 100)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">년간 달성률</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{pendingSuppliers.length}</div>
                    <div className="text-sm text-muted-foreground">미평가 업체</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Suppliers List */}
            {pendingSuppliers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    미평가 업체 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>업체명</TableHead>
                        <TableHead>평가유형</TableHead>
                        <TableHead>예정월</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingSuppliers.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.supplierName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{plan.evaluationType}</Badge>
                          </TableCell>
                          <TableCell>{plan.plannedMonth}월</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[plan.status]}`}>
                              {plan.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: 업체별 평가이력 */}
        <TabsContent value="history">
          <div className="space-y-6">
            {/* Supplier Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  업체별 평가이력 조회
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Label>업체 선택</Label>
                  <Select value={selectedSupplierFilter} onValueChange={setSelectedSupplierFilter}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="전체 업체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체 업체</SelectItem>
                      {suppliers.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Supplier History Cards */}
            {Object.entries(filteredSupplierHistory).map(([supplierId, records]) => {
              const supplier = getSupplierByCode(supplierId);
              const latestRecord = records[0];
              const trend = getGradeTrend(records);

              return (
                <Card key={supplierId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span>{supplier?.name || supplierId}</span>
                        {latestRecord && (
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${gradeColors[latestRecord.grade]}`}>
                            현재 {latestRecord.grade}등급
                          </span>
                        )}
                        {trend && (
                          <span className="flex items-center gap-1 text-sm">
                            {trend.trend === "up" && (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">+{trend.diff}점</span>
                              </>
                            )}
                            {trend.trend === "down" && (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">-{trend.diff}점</span>
                              </>
                            )}
                            {trend.trend === "same" && (
                              <>
                                <Minus className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-600">변동없음</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-normal text-muted-foreground">
                        총 {records.length}회 평가
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>평가번호</TableHead>
                          <TableHead>평가일</TableHead>
                          <TableHead>평가유형</TableHead>
                          <TableHead className="text-center">품질</TableHead>
                          <TableHead className="text-center">납기</TableHead>
                          <TableHead className="text-center">가격</TableHead>
                          <TableHead className="text-center">기술</TableHead>
                          <TableHead className="text-center">총점</TableHead>
                          <TableHead className="text-center">등급</TableHead>
                          <TableHead>조치</TableHead>
                          <TableHead>평가자</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record, index) => (
                          <TableRow key={record.id} className={index === 0 ? "bg-muted/30" : ""}>
                            <TableCell className="font-mono">{record.evaluationNumber}</TableCell>
                            <TableCell>{record.evaluationDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.evaluationType}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{record.qualityScore}</TableCell>
                            <TableCell className="text-center">{record.deliveryScore}</TableCell>
                            <TableCell className="text-center">{record.priceScore}</TableCell>
                            <TableCell className="text-center">{record.techScore}</TableCell>
                            <TableCell className="text-center font-bold">{record.totalScore}</TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[record.grade]}`}>
                                {record.grade}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[record.action]}`}>
                                {record.action}
                              </span>
                            </TableCell>
                            <TableCell>{record.evaluator}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Grade Trend Visualization */}
                    {records.length > 1 && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-3">등급 변동 현황</h4>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {[...records].reverse().map((record, index, arr) => (
                            <div key={record.id} className="flex items-center">
                              <div className="text-center min-w-[80px]">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${gradeColors[record.grade]}`}>
                                  {record.grade}등급
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {record.evaluationDate.slice(0, 7)}
                                </div>
                                <div className="text-xs font-medium">{record.totalScore}점</div>
                              </div>
                              {index < arr.length - 1 && (
                                <div className="px-2 text-muted-foreground">
                                  {arr[index + 1].totalScore > record.totalScore ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : arr[index + 1].totalScore < record.totalScore ? (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  ) : (
                                    <Minus className="h-4 w-4" />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {Object.keys(filteredSupplierHistory).length === 0 && (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  평가 이력이 없습니다.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
