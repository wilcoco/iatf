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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Save, Trash2, Search, AlertCircle, CheckCircle, TrendingUp, Building2, BarChart3 } from "lucide-react";

// Types
interface Headcount {
  id: number;
  department: string;
  process: string;
  required: number; // 정원 (소요인원)
  current: number; // 현원
}

type Urgency = "높음" | "보통" | "낮음";
type CountermeasureType = "직영" | "도급" | "배치전환";

interface ShortageReview {
  id: number;
  department: string;
  process: string;
  shortage: number;
  reason: string;
  countermeasure: CountermeasureType;
  urgency: Urgency;
}

type RecruitType = "채용" | "전환배치" | "도급";
type PlanStatus = "계획" | "진행중" | "완료";

interface RecruitPlan {
  id: number;
  department: string;
  jobTitle: string;
  recruitType: RecruitType;
  headcount: number;
  targetDate: string;
  status: PlanStatus;
}

// Sample data
const initialHeadcounts: Headcount[] = [
  { id: 1, department: "사출부", process: "사출(SP2/SK3)", required: 12, current: 10 },
  { id: 2, department: "도장부", process: "도장", required: 18, current: 15 },
  { id: 3, department: "조립부", process: "조립1공장", required: 20, current: 20 },
  { id: 4, department: "품질부", process: "검사", required: 8, current: 6 },
];

const initialShortageReviews: ShortageReview[] = [
  { id: 1, department: "사출부", process: "사출(SP2/SK3)", shortage: 2, reason: "야간조 결원 발생, 신규 라인 증설로 소요 증가", countermeasure: "직영", urgency: "높음" },
  { id: 2, department: "도장부", process: "도장", shortage: 3, reason: "숙련공 퇴사 및 휴직 누적", countermeasure: "도급", urgency: "보통" },
  { id: 3, department: "품질부", process: "검사", shortage: 2, reason: "전수검사 항목 추가에 따른 인력 부족", countermeasure: "배치전환", urgency: "높음" },
];

const initialRecruitPlans: RecruitPlan[] = [
  { id: 1, department: "사출부", jobTitle: "사출 오퍼레이터", recruitType: "채용", headcount: 2, targetDate: "2026-07-15", status: "진행중" },
  { id: 2, department: "도장부", jobTitle: "도장 작업자", recruitType: "도급", headcount: 3, targetDate: "2026-07-30", status: "계획" },
  { id: 3, department: "품질부", jobTitle: "검사원", recruitType: "전환배치", headcount: 1, targetDate: "2026-06-30", status: "완료" },
];

const DEPARTMENTS = ["사출부", "도장부", "조립부", "품질부", "물류부", "생산관리부"];

// Badge helpers
const getUtilizationBadge = (rate: number) => {
  if (rate >= 100) return <Badge variant="success">{rate}%</Badge>;
  if (rate >= 90) return <Badge variant="warning">{rate}%</Badge>;
  return <Badge variant="destructive">{rate}%</Badge>;
};

const getUrgencyBadge = (urgency: Urgency) => {
  const map: Record<Urgency, string> = {
    높음: "bg-red-100 text-red-800",
    보통: "bg-yellow-100 text-yellow-800",
    낮음: "bg-green-100 text-green-800",
  };
  return <Badge className={map[urgency]}>{urgency}</Badge>;
};

const getStatusBadge = (status: PlanStatus) => {
  const map: Record<PlanStatus, string> = {
    계획: "bg-gray-100 text-gray-800",
    진행중: "bg-blue-100 text-blue-800",
    완료: "bg-green-100 text-green-800",
  };
  return <Badge className={map[status]}>{status}</Badge>;
};

export default function ManpowerPage() {
  const [activeTab, setActiveTab] = useState("headcount");
  const [headcounts, setHeadcounts] = useState<Headcount[]>(initialHeadcounts);
  const [shortageReviews, setShortageReviews] = useState<ShortageReview[]>(initialShortageReviews);
  const [recruitPlans, setRecruitPlans] = useState<RecruitPlan[]>(initialRecruitPlans);

  const [searchTerm, setSearchTerm] = useState("");

  // Form visibility
  const [showHeadcountForm, setShowHeadcountForm] = useState(false);
  const [showShortageForm, setShowShortageForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);

  // Form states
  const [newHeadcount, setNewHeadcount] = useState({
    department: "",
    process: "",
    required: 0,
    current: 0,
  });

  const [newShortage, setNewShortage] = useState({
    department: "",
    process: "",
    shortage: 0,
    reason: "",
    countermeasure: "직영" as CountermeasureType,
    urgency: "보통" as Urgency,
  });

  const [newPlan, setNewPlan] = useState({
    department: "",
    jobTitle: "",
    recruitType: "채용" as RecruitType,
    headcount: 0,
    targetDate: "",
    status: "계획" as PlanStatus,
  });

  // Derived helpers
  const getShortage = (h: Headcount) => Math.max(0, h.required - h.current);
  const getUtilization = (h: Headcount) =>
    h.required > 0 ? Math.round((h.current / h.required) * 100) : 0;

  const totalRequired = headcounts.reduce((sum, h) => sum + h.required, 0);
  const totalCurrent = headcounts.reduce((sum, h) => sum + h.current, 0);
  const totalShortage = headcounts.reduce((sum, h) => sum + getShortage(h), 0);

  // Tab 1: Headcount Status
  const handleAddHeadcount = () => {
    if (!newHeadcount.department || !newHeadcount.process) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    const nextId = Math.max(0, ...headcounts.map((h) => h.id)) + 1;
    setHeadcounts([
      ...headcounts,
      { id: nextId, ...newHeadcount },
    ]);
    setNewHeadcount({ department: "", process: "", required: 0, current: 0 });
    setShowHeadcountForm(false);
    alert("정원 현황이 등록되었습니다.");
  };

  const handleDeleteHeadcount = (id: number) => {
    if (confirm("이 항목을 삭제하시겠습니까?")) {
      setHeadcounts(headcounts.filter((h) => h.id !== id));
    }
  };

  const filteredHeadcounts = headcounts.filter(
    (h) =>
      h.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.process.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tab 2: Shortage Review
  const handleAddShortage = () => {
    if (!newShortage.department || !newShortage.process || !newShortage.reason) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    const nextId = Math.max(0, ...shortageReviews.map((s) => s.id)) + 1;
    setShortageReviews([
      ...shortageReviews,
      { id: nextId, ...newShortage },
    ]);
    setNewShortage({
      department: "",
      process: "",
      shortage: 0,
      reason: "",
      countermeasure: "직영",
      urgency: "보통",
    });
    setShowShortageForm(false);
    alert("부족인원 검토가 저장되었습니다.");
  };

  const handleDeleteShortage = (id: number) => {
    if (confirm("이 검토 항목을 삭제하시겠습니까?")) {
      setShortageReviews(shortageReviews.filter((s) => s.id !== id));
    }
  };

  // Tab 3: Recruit Plan
  const handleAddPlan = () => {
    if (!newPlan.department || !newPlan.jobTitle || !newPlan.targetDate || newPlan.headcount <= 0) {
      alert("필수 항목을 입력해주세요. (부서, 직무, 인원, 목표일자)");
      return;
    }
    const nextId = Math.max(0, ...recruitPlans.map((p) => p.id)) + 1;
    setRecruitPlans([
      ...recruitPlans,
      { id: nextId, ...newPlan },
    ]);
    setNewPlan({
      department: "",
      jobTitle: "",
      recruitType: "채용",
      headcount: 0,
      targetDate: "",
      status: "계획",
    });
    setShowPlanForm(false);
    alert("충원계획이 저장되었습니다.");
  };

  const handleDeletePlan = (id: number) => {
    if (confirm("이 충원계획을 삭제하시겠습니까?")) {
      setRecruitPlans(recruitPlans.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">인력관리</h1>
          <p className="text-muted-foreground">
            부서·공정별 정원 및 결원 검토 — 현재 인원 및 부족인원 검토, 충원계획 (IATF 16949)
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">총 정원</p>
              <p className="text-2xl font-bold">{totalRequired}명</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">총 현원</p>
              <p className="text-2xl font-bold">{totalCurrent}명</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">총 부족인원</p>
              <p className="text-2xl font-bold">{totalShortage}명</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-muted-foreground">전체 가동률</p>
              <p className="text-2xl font-bold">
                {totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="headcount">
                <Users className="mr-2 h-4 w-4" />
                정원현황
              </TabsTrigger>
              <TabsTrigger value="shortage">
                <AlertCircle className="mr-2 h-4 w-4" />
                부족인원 검토
              </TabsTrigger>
              <TabsTrigger value="plan">
                <BarChart3 className="mr-2 h-4 w-4" />
                충원계획
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Headcount Status */}
            <TabsContent value="headcount" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="부서, 공정으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowHeadcountForm(!showHeadcountForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  정원 추가
                </Button>
              </div>

              {showHeadcountForm && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-4 font-medium">정원 현황 추가</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>부서 *</Label>
                      <Select
                        value={newHeadcount.department}
                        onValueChange={(v) => setNewHeadcount({ ...newHeadcount, department: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>공정 *</Label>
                      <Input
                        value={newHeadcount.process}
                        onChange={(e) => setNewHeadcount({ ...newHeadcount, process: e.target.value })}
                        placeholder="사출(SP2/SK3)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>정원(소요인원)</Label>
                      <Input
                        type="number"
                        value={newHeadcount.required}
                        onChange={(e) =>
                          setNewHeadcount({ ...newHeadcount, required: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>현원</Label>
                      <Input
                        type="number"
                        value={newHeadcount.current}
                        onChange={(e) =>
                          setNewHeadcount({ ...newHeadcount, current: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowHeadcountForm(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddHeadcount}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서</TableHead>
                    <TableHead>공정</TableHead>
                    <TableHead className="text-center">정원(소요인원)</TableHead>
                    <TableHead className="text-center">현원</TableHead>
                    <TableHead className="text-center">부족인원</TableHead>
                    <TableHead className="text-center">가동률</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHeadcounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        등록된 정원 현황이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHeadcounts.map((h) => {
                      const shortage = getShortage(h);
                      return (
                        <TableRow key={h.id}>
                          <TableCell className="font-medium">{h.department}</TableCell>
                          <TableCell>{h.process}</TableCell>
                          <TableCell className="text-center">{h.required}</TableCell>
                          <TableCell className="text-center">{h.current}</TableCell>
                          <TableCell className="text-center">
                            {shortage > 0 ? (
                              <Badge variant="destructive">{shortage}명</Badge>
                            ) : (
                              <Badge variant="success">충원완료</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{getUtilizationBadge(getUtilization(h))}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteHeadcount(h.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Tab 2: Shortage Review */}
            <TabsContent value="shortage" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  결원이 발생한 부서/공정의 사유 및 대응방안을 검토합니다.
                </p>
                <Button onClick={() => setShowShortageForm(!showShortageForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  검토 추가
                </Button>
              </div>

              {showShortageForm && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-4 font-medium">부족인원 검토 추가</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>부서 *</Label>
                      <Select
                        value={newShortage.department}
                        onValueChange={(v) => setNewShortage({ ...newShortage, department: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>공정 *</Label>
                      <Input
                        value={newShortage.process}
                        onChange={(e) => setNewShortage({ ...newShortage, process: e.target.value })}
                        placeholder="도장"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>부족인원</Label>
                      <Input
                        type="number"
                        value={newShortage.shortage}
                        onChange={(e) =>
                          setNewShortage({ ...newShortage, shortage: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>대응방안</Label>
                      <Select
                        value={newShortage.countermeasure}
                        onValueChange={(v) =>
                          setNewShortage({ ...newShortage, countermeasure: v as CountermeasureType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="직영">직영</SelectItem>
                          <SelectItem value="도급">도급</SelectItem>
                          <SelectItem value="배치전환">배치전환</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>긴급도</Label>
                      <Select
                        value={newShortage.urgency}
                        onValueChange={(v) => setNewShortage({ ...newShortage, urgency: v as Urgency })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="높음">높음</SelectItem>
                          <SelectItem value="보통">보통</SelectItem>
                          <SelectItem value="낮음">낮음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label>사유 *</Label>
                      <Textarea
                        value={newShortage.reason}
                        onChange={(e) => setNewShortage({ ...newShortage, reason: e.target.value })}
                        placeholder="결원 발생 사유를 입력하세요."
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowShortageForm(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddShortage}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서/공정</TableHead>
                    <TableHead className="text-center">부족인원</TableHead>
                    <TableHead>사유</TableHead>
                    <TableHead className="text-center">대응방안</TableHead>
                    <TableHead className="text-center">긴급도</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shortageReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        검토할 부족인원이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    shortageReviews.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          {s.department} / {s.process}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="destructive">{s.shortage}명</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs text-sm text-muted-foreground">{s.reason}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{s.countermeasure}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{getUrgencyBadge(s.urgency)}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteShortage(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Tab 3: Recruit Plan */}
            <TabsContent value="plan" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">채용·배치 등 충원 계획을 수립하고 진행 상태를 관리합니다.</p>
                <Button onClick={() => setShowPlanForm(!showPlanForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  계획 추가
                </Button>
              </div>

              {showPlanForm && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-4 font-medium">충원계획 추가</h4>
                  <div className="mb-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    <AlertCircle className="h-4 w-4" />
                    부서, 직무, 인원, 목표일자는 필수 입력 항목입니다.
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>부서 *</Label>
                      <Select
                        value={newPlan.department}
                        onValueChange={(v) => setNewPlan({ ...newPlan, department: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>직무 *</Label>
                      <Input
                        value={newPlan.jobTitle}
                        onChange={(e) => setNewPlan({ ...newPlan, jobTitle: e.target.value })}
                        placeholder="사출 오퍼레이터"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>충원유형</Label>
                      <Select
                        value={newPlan.recruitType}
                        onValueChange={(v) => setNewPlan({ ...newPlan, recruitType: v as RecruitType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="채용">채용</SelectItem>
                          <SelectItem value="전환배치">전환배치</SelectItem>
                          <SelectItem value="도급">도급</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>인원 *</Label>
                      <Input
                        type="number"
                        value={newPlan.headcount}
                        onChange={(e) => setNewPlan({ ...newPlan, headcount: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>목표일자 *</Label>
                      <Input
                        type="date"
                        value={newPlan.targetDate}
                        onChange={(e) => setNewPlan({ ...newPlan, targetDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>진행상태</Label>
                      <Select
                        value={newPlan.status}
                        onValueChange={(v) => setNewPlan({ ...newPlan, status: v as PlanStatus })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="계획">계획</SelectItem>
                          <SelectItem value="진행중">진행중</SelectItem>
                          <SelectItem value="완료">완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowPlanForm(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddPlan}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서</TableHead>
                    <TableHead>직무</TableHead>
                    <TableHead className="text-center">충원유형</TableHead>
                    <TableHead className="text-center">인원</TableHead>
                    <TableHead>목표일자</TableHead>
                    <TableHead className="text-center">진행상태</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruitPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        등록된 충원계획이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recruitPlans.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.department}</TableCell>
                        <TableCell>{p.jobTitle}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{p.recruitType}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{p.headcount}명</TableCell>
                        <TableCell>{p.targetDate}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1">
                            {p.status === "완료" && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {getStatusBadge(p.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(p.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
