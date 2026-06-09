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
import {
  Users,
  Plus,
  Save,
  Trash2,
  Search,
  History,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Types
type CompetencyLevel = "초급" | "중급" | "고급" | "전문가";

interface CompetencyStandard {
  id: number;
  jobTitle: string;
  competencyName: string;
  level: CompetencyLevel;
  description: string;
  evaluationCriteria: string;
}

interface CompetencyAssessmentItem {
  id: number;
  competencyName: string;
  currentScore: number;
  targetScore: number;
  gap: number;
}

interface CompetencyAssessment {
  id: number;
  employeeNo: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  assessmentDate: string;
  assessor: string;
  items: CompetencyAssessmentItem[];
  currentLevel: CompetencyLevel;
  targetLevel: CompetencyLevel;
  remarks: string;
}

interface DevelopmentPlan {
  id: number;
  employeeNo: string;
  employeeName: string;
  department: string;
  planType: "교육/훈련" | "OJT" | "자격증";
  planName: string;
  targetCompetency: string;
  startDate: string;
  endDate: string;
  status: "계획" | "진행중" | "완료" | "보류";
  progress: number;
  remarks: string;
}

interface CompetencyHistory {
  id: number;
  employeeNo: string;
  employeeName: string;
  department: string;
  eventType: "평가" | "교육" | "자격증" | "승급";
  eventDate: string;
  description: string;
  beforeLevel: CompetencyLevel;
  afterLevel: CompetencyLevel;
  evidence: string;
}

// Level badge colors
const levelColors: Record<CompetencyLevel, string> = {
  "초급": "bg-blue-100 text-blue-800",
  "중급": "bg-green-100 text-green-800",
  "고급": "bg-purple-100 text-purple-800",
  "전문가": "bg-orange-100 text-orange-800",
};

// Sample data
const sampleStandards: CompetencyStandard[] = [
  {
    id: 1,
    jobTitle: "품질관리",
    competencyName: "품질검사",
    level: "중급",
    description: "품질검사 절차 및 측정장비 운용 능력",
    evaluationCriteria: "검사성적서 작성, 측정장비 교정 이해, 불량 판정 능력",
  },
  {
    id: 2,
    jobTitle: "생산관리",
    competencyName: "공정관리",
    level: "고급",
    description: "생산공정 계획 및 관리 능력",
    evaluationCriteria: "생산계획 수립, 공정 효율화, 품질관리 연계",
  },
  {
    id: 3,
    jobTitle: "설비관리",
    competencyName: "설비보전",
    level: "중급",
    description: "설비 예방보전 및 고장 대응 능력",
    evaluationCriteria: "예방보전 계획 수립, 설비 진단, 고장 수리",
  },
];

export default function CompetencyManagementPage() {
  const [activeTab, setActiveTab] = useState("standards");

  // Tab 1: Competency Standards State
  const [standards, setStandards] = useState<CompetencyStandard[]>(sampleStandards);
  const [newStandard, setNewStandard] = useState<Omit<CompetencyStandard, "id">>({
    jobTitle: "",
    competencyName: "",
    level: "초급",
    description: "",
    evaluationCriteria: "",
  });
  const [standardSearchQuery, setStandardSearchQuery] = useState("");

  // Tab 2: Competency Assessment State
  const [assessments, setAssessments] = useState<CompetencyAssessment[]>([]);
  const [assessmentForm, setAssessmentForm] = useState({
    employeeNo: "",
    employeeName: "",
    department: "",
    jobTitle: "",
    assessmentDate: new Date().toISOString().split("T")[0],
    assessor: "",
    currentLevel: "초급" as CompetencyLevel,
    targetLevel: "중급" as CompetencyLevel,
    remarks: "",
  });
  const [assessmentItems, setAssessmentItems] = useState<CompetencyAssessmentItem[]>([
    { id: 1, competencyName: "", currentScore: 3, targetScore: 4, gap: -1 },
  ]);

  // Tab 3: Development Plan State
  const [developmentPlans, setDevelopmentPlans] = useState<DevelopmentPlan[]>([]);
  const [planForm, setPlanForm] = useState({
    employeeNo: "",
    employeeName: "",
    department: "",
    planType: "교육/훈련" as "교육/훈련" | "OJT" | "자격증",
    planName: "",
    targetCompetency: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "계획" as "계획" | "진행중" | "완료" | "보류",
    progress: 0,
    remarks: "",
  });

  // Tab 4: Competency History State
  const [competencyHistory, setCompetencyHistory] = useState<CompetencyHistory[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState("");

  // ============ Tab 1: Competency Standards Functions ============
  const addStandard = () => {
    if (!newStandard.jobTitle || !newStandard.competencyName) {
      alert("직무와 역량명은 필수 입력 항목입니다.");
      return;
    }
    const newId = Math.max(0, ...standards.map((s) => s.id)) + 1;
    setStandards([...standards, { ...newStandard, id: newId }]);
    setNewStandard({
      jobTitle: "",
      competencyName: "",
      level: "초급",
      description: "",
      evaluationCriteria: "",
    });
  };

  const removeStandard = (id: number) => {
    setStandards(standards.filter((s) => s.id !== id));
  };

  const filteredStandards = standards.filter(
    (s) =>
      s.jobTitle.toLowerCase().includes(standardSearchQuery.toLowerCase()) ||
      s.competencyName.toLowerCase().includes(standardSearchQuery.toLowerCase())
  );

  // ============ Tab 2: Competency Assessment Functions ============
  const addAssessmentItem = () => {
    const newId = Math.max(0, ...assessmentItems.map((item) => item.id)) + 1;
    setAssessmentItems([
      ...assessmentItems,
      { id: newId, competencyName: "", currentScore: 3, targetScore: 4, gap: -1 },
    ]);
  };

  const removeAssessmentItem = (id: number) => {
    if (assessmentItems.length > 1) {
      setAssessmentItems(assessmentItems.filter((item) => item.id !== id));
    }
  };

  const updateAssessmentItem = (id: number, field: keyof CompetencyAssessmentItem, value: string | number) => {
    setAssessmentItems(
      assessmentItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "currentScore" || field === "targetScore") {
            updatedItem.gap = Number(updatedItem.currentScore) - Number(updatedItem.targetScore);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const saveAssessment = () => {
    if (!assessmentForm.employeeNo || !assessmentForm.employeeName || !assessmentForm.department) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newAssessment: CompetencyAssessment = {
      id: Date.now(),
      ...assessmentForm,
      items: [...assessmentItems],
    };

    setAssessments([newAssessment, ...assessments]);

    // Add to history
    const historyEntry: CompetencyHistory = {
      id: Date.now(),
      employeeNo: assessmentForm.employeeNo,
      employeeName: assessmentForm.employeeName,
      department: assessmentForm.department,
      eventType: "평가",
      eventDate: assessmentForm.assessmentDate,
      description: `역량평가 실시 (평가자: ${assessmentForm.assessor})`,
      beforeLevel: assessmentForm.currentLevel,
      afterLevel: assessmentForm.targetLevel,
      evidence: "역량평가서",
    };
    setCompetencyHistory([historyEntry, ...competencyHistory]);

    // Reset form
    setAssessmentForm({
      employeeNo: "",
      employeeName: "",
      department: "",
      jobTitle: "",
      assessmentDate: new Date().toISOString().split("T")[0],
      assessor: "",
      currentLevel: "초급",
      targetLevel: "중급",
      remarks: "",
    });
    setAssessmentItems([{ id: 1, competencyName: "", currentScore: 3, targetScore: 4, gap: -1 }]);

    alert("역량 평가가 저장되었습니다.");
  };

  // ============ Tab 3: Development Plan Functions ============
  const saveDevelopmentPlan = () => {
    if (!planForm.employeeNo || !planForm.planName || !planForm.targetCompetency) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newPlan: DevelopmentPlan = {
      id: Date.now(),
      ...planForm,
    };

    setDevelopmentPlans([newPlan, ...developmentPlans]);

    // Add to history
    const historyEntry: CompetencyHistory = {
      id: Date.now() + 1,
      employeeNo: planForm.employeeNo,
      employeeName: planForm.employeeName,
      department: planForm.department,
      eventType: planForm.planType === "자격증" ? "자격증" : "교육",
      eventDate: planForm.startDate,
      description: `${planForm.planType} 계획 등록: ${planForm.planName}`,
      beforeLevel: "초급",
      afterLevel: "초급",
      evidence: planForm.planName,
    };
    setCompetencyHistory([historyEntry, ...competencyHistory]);

    // Reset form
    setPlanForm({
      employeeNo: "",
      employeeName: "",
      department: "",
      planType: "교육/훈련",
      planName: "",
      targetCompetency: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "계획",
      progress: 0,
      remarks: "",
    });

    alert("역량개발 계획이 저장되었습니다.");
  };

  const updatePlanStatus = (id: number, status: DevelopmentPlan["status"], progress: number) => {
    setDevelopmentPlans(
      developmentPlans.map((plan) =>
        plan.id === id ? { ...plan, status, progress } : plan
      )
    );
  };

  const getStatusBadge = (status: DevelopmentPlan["status"]) => {
    const variants: Record<string, string> = {
      "계획": "bg-gray-100 text-gray-800",
      "진행중": "bg-blue-100 text-blue-800",
      "완료": "bg-green-100 text-green-800",
      "보류": "bg-yellow-100 text-yellow-800",
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // ============ Tab 4: Competency History Functions ============
  const filteredHistory = competencyHistory.filter(
    (h) =>
      h.employeeNo.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      h.employeeName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  const getEventTypeBadge = (eventType: CompetencyHistory["eventType"]) => {
    const variants: Record<string, string> = {
      "평가": "bg-blue-100 text-blue-800",
      "교육": "bg-green-100 text-green-800",
      "자격증": "bg-purple-100 text-purple-800",
      "승급": "bg-orange-100 text-orange-800",
    };
    return <Badge className={variants[eventType]}>{eventType}</Badge>;
  };

  // Gap indicator
  const getGapIndicator = (gap: number) => {
    if (gap >= 0) {
      return (
        <span className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          충족
        </span>
      );
    }
    return (
      <span className="flex items-center text-red-600">
        <AlertCircle className="h-4 w-4 mr-1" />
        {Math.abs(gap)}점 부족
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">역량관리</h1>
          <p className="text-muted-foreground">IATF 16949 인적자원 역량 관리 시스템</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="standards">역량 기준</TabsTrigger>
              <TabsTrigger value="assessment">역량 평가</TabsTrigger>
              <TabsTrigger value="development">역량개발 계획</TabsTrigger>
              <TabsTrigger value="history">역량 이력</TabsTrigger>
            </TabsList>

            {/* ============ Tab 1: 역량 기준 (Competency Standards) ============ */}
            <TabsContent value="standards">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    역량 기준 관리
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add New Standard Form */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold">역량 기준 등록</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>직무 *</Label>
                        <Input
                          value={newStandard.jobTitle}
                          onChange={(e) => setNewStandard({ ...newStandard, jobTitle: e.target.value })}
                          placeholder="예: 품질관리"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>필요역량 *</Label>
                        <Input
                          value={newStandard.competencyName}
                          onChange={(e) => setNewStandard({ ...newStandard, competencyName: e.target.value })}
                          placeholder="예: 품질검사"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>역량수준</Label>
                        <Select
                          value={newStandard.level}
                          onValueChange={(value) => setNewStandard({ ...newStandard, level: value as CompetencyLevel })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="수준 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="초급">초급</SelectItem>
                            <SelectItem value="중급">중급</SelectItem>
                            <SelectItem value="고급">고급</SelectItem>
                            <SelectItem value="전문가">전문가</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={addStandard}>
                          <Plus className="mr-2 h-4 w-4" />
                          추가
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>역량 설명</Label>
                        <Textarea
                          value={newStandard.description}
                          onChange={(e) => setNewStandard({ ...newStandard, description: e.target.value })}
                          placeholder="역량에 대한 상세 설명"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>평가기준</Label>
                        <Textarea
                          value={newStandard.evaluationCriteria}
                          onChange={(e) => setNewStandard({ ...newStandard, evaluationCriteria: e.target.value })}
                          placeholder="평가 시 확인할 항목 및 기준"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="직무 또는 역량명으로 검색..."
                      value={standardSearchQuery}
                      onChange={(e) => setStandardSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Standards Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>직무</TableHead>
                        <TableHead>필요역량</TableHead>
                        <TableHead>역량수준</TableHead>
                        <TableHead>역량 설명</TableHead>
                        <TableHead>평가기준</TableHead>
                        <TableHead className="w-16">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStandards.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            등록된 역량 기준이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStandards.map((standard) => (
                          <TableRow key={standard.id}>
                            <TableCell className="font-medium">{standard.jobTitle}</TableCell>
                            <TableCell>{standard.competencyName}</TableCell>
                            <TableCell>
                              <Badge className={levelColors[standard.level]}>{standard.level}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{standard.description}</TableCell>
                            <TableCell className="max-w-xs truncate">{standard.evaluationCriteria}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeStandard(standard.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ Tab 2: 역량 평가 (Competency Assessment) ============ */}
            <TabsContent value="assessment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    역량 평가
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Employee Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">평가 대상자 정보</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>사원번호 *</Label>
                        <Input
                          value={assessmentForm.employeeNo}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, employeeNo: e.target.value })}
                          placeholder="EMP001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>성명 *</Label>
                        <Input
                          value={assessmentForm.employeeName}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, employeeName: e.target.value })}
                          placeholder="홍길동"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>부서 *</Label>
                        <Input
                          value={assessmentForm.department}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, department: e.target.value })}
                          placeholder="품질관리팀"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>직무</Label>
                        <Input
                          value={assessmentForm.jobTitle}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, jobTitle: e.target.value })}
                          placeholder="품질검사"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>평가일</Label>
                        <Input
                          type="date"
                          value={assessmentForm.assessmentDate}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, assessmentDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>평가자</Label>
                        <Input
                          value={assessmentForm.assessor}
                          onChange={(e) => setAssessmentForm({ ...assessmentForm, assessor: e.target.value })}
                          placeholder="평가자명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>현재 수준</Label>
                        <Select
                          value={assessmentForm.currentLevel}
                          onValueChange={(value) => setAssessmentForm({ ...assessmentForm, currentLevel: value as CompetencyLevel })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="초급">초급</SelectItem>
                            <SelectItem value="중급">중급</SelectItem>
                            <SelectItem value="고급">고급</SelectItem>
                            <SelectItem value="전문가">전문가</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>목표 수준</Label>
                        <Select
                          value={assessmentForm.targetLevel}
                          onValueChange={(value) => setAssessmentForm({ ...assessmentForm, targetLevel: value as CompetencyLevel })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="초급">초급</SelectItem>
                            <SelectItem value="중급">중급</SelectItem>
                            <SelectItem value="고급">고급</SelectItem>
                            <SelectItem value="전문가">전문가</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-semibold">역량항목별 평가 (1-5점)</h3>
                      <Button size="sm" onClick={addAssessmentItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        항목 추가
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">No.</TableHead>
                          <TableHead>역량항목</TableHead>
                          <TableHead className="w-32">현재 점수 (1-5)</TableHead>
                          <TableHead className="w-32">목표 점수 (1-5)</TableHead>
                          <TableHead className="w-32">Gap 분석</TableHead>
                          <TableHead className="w-16">삭제</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessmentItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={item.competencyName}
                                onChange={(e) => updateAssessmentItem(item.id, "competencyName", e.target.value)}
                                placeholder="역량항목명"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={String(item.currentScore)}
                                onValueChange={(value) => updateAssessmentItem(item.id, "currentScore", Number(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1점</SelectItem>
                                  <SelectItem value="2">2점</SelectItem>
                                  <SelectItem value="3">3점</SelectItem>
                                  <SelectItem value="4">4점</SelectItem>
                                  <SelectItem value="5">5점</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={String(item.targetScore)}
                                onValueChange={(value) => updateAssessmentItem(item.id, "targetScore", Number(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1점</SelectItem>
                                  <SelectItem value="2">2점</SelectItem>
                                  <SelectItem value="3">3점</SelectItem>
                                  <SelectItem value="4">4점</SelectItem>
                                  <SelectItem value="5">5점</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{getGapIndicator(item.gap)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAssessmentItem(item.id)}
                                disabled={assessmentItems.length === 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Textarea
                      value={assessmentForm.remarks}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, remarks: e.target.value })}
                      placeholder="평가 관련 특이사항 및 종합 의견"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveAssessment}>
                      <Save className="mr-2 h-4 w-4" />
                      평가 저장
                    </Button>
                  </div>

                  {/* Assessment History */}
                  {assessments.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="text-lg font-semibold border-b pb-2">최근 평가 기록</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>사원번호</TableHead>
                            <TableHead>성명</TableHead>
                            <TableHead>부서</TableHead>
                            <TableHead>직무</TableHead>
                            <TableHead>평가일</TableHead>
                            <TableHead>현재 수준</TableHead>
                            <TableHead>목표 수준</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assessments.slice(0, 5).map((assessment) => (
                            <TableRow key={assessment.id}>
                              <TableCell className="font-mono">{assessment.employeeNo}</TableCell>
                              <TableCell>{assessment.employeeName}</TableCell>
                              <TableCell>{assessment.department}</TableCell>
                              <TableCell>{assessment.jobTitle}</TableCell>
                              <TableCell>{assessment.assessmentDate}</TableCell>
                              <TableCell>
                                <Badge className={levelColors[assessment.currentLevel]}>{assessment.currentLevel}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={levelColors[assessment.targetLevel]}>{assessment.targetLevel}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ Tab 3: 역량개발 계획 (Development Plan) ============ */}
            <TabsContent value="development">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    역량개발 계획
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Registration Form */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold">개발 계획 등록</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>사원번호 *</Label>
                        <Input
                          value={planForm.employeeNo}
                          onChange={(e) => setPlanForm({ ...planForm, employeeNo: e.target.value })}
                          placeholder="EMP001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>성명</Label>
                        <Input
                          value={planForm.employeeName}
                          onChange={(e) => setPlanForm({ ...planForm, employeeName: e.target.value })}
                          placeholder="홍길동"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>부서</Label>
                        <Input
                          value={planForm.department}
                          onChange={(e) => setPlanForm({ ...planForm, department: e.target.value })}
                          placeholder="품질관리팀"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>계획 유형</Label>
                        <Select
                          value={planForm.planType}
                          onValueChange={(value) => setPlanForm({ ...planForm, planType: value as DevelopmentPlan["planType"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="교육/훈련">
                              <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                교육/훈련
                              </span>
                            </SelectItem>
                            <SelectItem value="OJT">
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                OJT
                              </span>
                            </SelectItem>
                            <SelectItem value="자격증">
                              <span className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                자격증
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>계획명 *</Label>
                        <Input
                          value={planForm.planName}
                          onChange={(e) => setPlanForm({ ...planForm, planName: e.target.value })}
                          placeholder="예: ISO 9001 내부심사원 과정"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>목표 역량 *</Label>
                        <Input
                          value={planForm.targetCompetency}
                          onChange={(e) => setPlanForm({ ...planForm, targetCompetency: e.target.value })}
                          placeholder="예: 품질경영시스템 이해"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>진행상태</Label>
                        <Select
                          value={planForm.status}
                          onValueChange={(value) => setPlanForm({ ...planForm, status: value as DevelopmentPlan["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="계획">계획</SelectItem>
                            <SelectItem value="진행중">진행중</SelectItem>
                            <SelectItem value="완료">완료</SelectItem>
                            <SelectItem value="보류">보류</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>시작일</Label>
                        <Input
                          type="date"
                          value={planForm.startDate}
                          onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>종료일</Label>
                        <Input
                          type="date"
                          value={planForm.endDate}
                          onChange={(e) => setPlanForm({ ...planForm, endDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>진행률 (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={planForm.progress}
                          onChange={(e) => setPlanForm({ ...planForm, progress: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={saveDevelopmentPlan}>
                          <Plus className="mr-2 h-4 w-4" />
                          계획 등록
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>비고</Label>
                      <Textarea
                        value={planForm.remarks}
                        onChange={(e) => setPlanForm({ ...planForm, remarks: e.target.value })}
                        placeholder="특이사항"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Development Plans List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">진행 현황</h3>
                    {developmentPlans.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">등록된 개발 계획이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>사원번호</TableHead>
                            <TableHead>성명</TableHead>
                            <TableHead>부서</TableHead>
                            <TableHead>유형</TableHead>
                            <TableHead>계획명</TableHead>
                            <TableHead>목표역량</TableHead>
                            <TableHead>기간</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>진행률</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {developmentPlans.map((plan) => (
                            <TableRow key={plan.id}>
                              <TableCell className="font-mono">{plan.employeeNo}</TableCell>
                              <TableCell>{plan.employeeName}</TableCell>
                              <TableCell>{plan.department}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{plan.planType}</Badge>
                              </TableCell>
                              <TableCell>{plan.planName}</TableCell>
                              <TableCell>{plan.targetCompetency}</TableCell>
                              <TableCell className="text-sm">
                                {plan.startDate} ~ {plan.endDate || "-"}
                              </TableCell>
                              <TableCell>{getStatusBadge(plan.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className="h-2 bg-blue-600 rounded-full"
                                      style={{ width: `${plan.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{plan.progress}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ Tab 4: 역량 이력 (Competency History) ============ */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    역량 이력
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="사원번호, 성명, 내용으로 검색..."
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {filteredHistory.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">역량 이력이 없습니다.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>사원번호</TableHead>
                          <TableHead>성명</TableHead>
                          <TableHead>부서</TableHead>
                          <TableHead>유형</TableHead>
                          <TableHead>일자</TableHead>
                          <TableHead>내용</TableHead>
                          <TableHead>변경 전</TableHead>
                          <TableHead>변경 후</TableHead>
                          <TableHead>증빙</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((history) => (
                          <TableRow key={history.id}>
                            <TableCell className="font-mono">{history.employeeNo}</TableCell>
                            <TableCell>{history.employeeName}</TableCell>
                            <TableCell>{history.department}</TableCell>
                            <TableCell>{getEventTypeBadge(history.eventType)}</TableCell>
                            <TableCell>{history.eventDate}</TableCell>
                            <TableCell className="max-w-xs truncate">{history.description}</TableCell>
                            <TableCell>
                              <Badge className={levelColors[history.beforeLevel]}>{history.beforeLevel}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={levelColors[history.afterLevel]}>{history.afterLevel}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{history.evidence}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
