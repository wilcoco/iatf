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
  ClipboardCheck,
  TrendingUp,
  MapPin,
  Save,
  Trash2,
  Edit2,
  FileText,
} from "lucide-react";

// 3정5행 평가항목 정의 (3정: 정리, 정돈, 청소 / 5행: 정리, 정돈, 청소, 청결, 습관화)
const evaluationItems = [
  {
    id: "jeongri",
    name: "정리",
    description: "불필요한 물건 제거",
    criteria: "불필요한 물품이 제거되고, 필요한 물품만 보관되어 있는가?",
  },
  {
    id: "jeongdon",
    name: "정돈",
    description: "물건의 정위치 관리",
    criteria: "물품이 정해진 위치에 정돈되어 있고, 쉽게 찾을 수 있는가?",
  },
  {
    id: "cheongso",
    name: "청소",
    description: "작업장 청결 유지",
    criteria: "작업 구역이 깨끗하게 청소되어 있고, 오염원이 제거되어 있는가?",
  },
  {
    id: "cheonggyeol",
    name: "청결",
    description: "표준화 및 상태 유지",
    criteria: "3정 상태가 표준화되어 있고, 일관되게 유지되고 있는가?",
  },
  {
    id: "seupgwanhwa",
    name: "습관화",
    description: "지속적 실천 및 개선",
    criteria: "5행 활동이 일상화되어 있고, 지속적으로 개선되고 있는가?",
  },
];

// 평가기준 점수
const scoreDescriptions: Record<number, string> = {
  5: "매우 우수",
  4: "우수",
  3: "보통",
  2: "미흡",
  1: "매우 미흡",
};

// 등급 기준
const getGrade = (average: number): { grade: string; color: string } => {
  if (average >= 4.5) return { grade: "A", color: "text-green-600" };
  if (average >= 3.5) return { grade: "B", color: "text-blue-600" };
  if (average >= 2.5) return { grade: "C", color: "text-yellow-600" };
  return { grade: "D", color: "text-red-600" };
};

// 부서/구역 목록
const initialDepartments = [
  { id: "1", name: "생산1팀", area: "생산라인 A구역", manager: "김철수" },
  { id: "2", name: "생산2팀", area: "생산라인 B구역", manager: "이영희" },
  { id: "3", name: "품질관리팀", area: "검사실", manager: "박민수" },
  { id: "4", name: "물류팀", area: "원자재 창고", manager: "정대리" },
  { id: "5", name: "물류팀", area: "완제품 창고", manager: "최과장" },
  { id: "6", name: "관리팀", area: "사무실", manager: "한부장" },
  { id: "7", name: "정비팀", area: "정비실", manager: "오기사" },
  { id: "8", name: "공용", area: "휴게실", manager: "김대리" },
];

interface EvaluationScores {
  jeongri: number;
  jeongdon: number;
  cheongso: number;
  cheonggyeol: number;
  seupgwanhwa: number;
}

interface MonthlyEvaluation {
  id: string;
  yearMonth: string; // YYYY-MM format
  departmentId: string;
  departmentName: string;
  areaName: string;
  scores: EvaluationScores;
  totalScore: number;
  average: number;
  grade: string;
  evaluator: string;
  evaluationDate: string;
  remarks: string;
}

interface ImprovementAction {
  id: string;
  evaluationId: string;
  yearMonth: string;
  departmentName: string;
  areaName: string;
  issue: string; // 지적사항
  action: string; // 개선대책
  responsible: string; // 담당자
  dueDate: string; // 완료예정일
  completedDate: string; // 완료일
  result: string; // 조치결과
  status: "대기" | "진행중" | "완료" | "지연";
}

interface AreaDefinition {
  id: string;
  departmentName: string;
  areaName: string;
  manager: string;
  description: string;
}

// 초기 월간 평가 데이터
const initialEvaluations: MonthlyEvaluation[] = [
  {
    id: "1",
    yearMonth: "2026-06",
    departmentId: "1",
    departmentName: "생산1팀",
    areaName: "생산라인 A구역",
    scores: { jeongri: 5, jeongdon: 4, cheongso: 5, cheonggyeol: 4, seupgwanhwa: 4 },
    totalScore: 22,
    average: 4.4,
    grade: "B",
    evaluator: "김관리",
    evaluationDate: "2026-06-05",
    remarks: "전반적으로 양호하나 표준 문서화 보완 필요",
  },
  {
    id: "2",
    yearMonth: "2026-06",
    departmentId: "2",
    departmentName: "생산2팀",
    areaName: "생산라인 B구역",
    scores: { jeongri: 3, jeongdon: 2, cheongso: 3, cheonggyeol: 3, seupgwanhwa: 2 },
    totalScore: 13,
    average: 2.6,
    grade: "C",
    evaluator: "이점검",
    evaluationDate: "2026-06-05",
    remarks: "불용품 적치 및 정돈 미흡, 청소 상태 개선 필요",
  },
  {
    id: "3",
    yearMonth: "2026-05",
    departmentId: "1",
    departmentName: "생산1팀",
    areaName: "생산라인 A구역",
    scores: { jeongri: 4, jeongdon: 4, cheongso: 4, cheonggyeol: 3, seupgwanhwa: 3 },
    totalScore: 18,
    average: 3.6,
    grade: "B",
    evaluator: "김관리",
    evaluationDate: "2026-05-10",
    remarks: "선입선출 표시 및 표준화 보완 필요",
  },
  {
    id: "4",
    yearMonth: "2026-05",
    departmentId: "2",
    departmentName: "생산2팀",
    areaName: "생산라인 B구역",
    scores: { jeongri: 3, jeongdon: 3, cheongso: 3, cheonggyeol: 2, seupgwanhwa: 2 },
    totalScore: 13,
    average: 2.6,
    grade: "C",
    evaluator: "이점검",
    evaluationDate: "2026-05-10",
    remarks: "청결 유지 미흡",
  },
  {
    id: "5",
    yearMonth: "2026-04",
    departmentId: "1",
    departmentName: "생산1팀",
    areaName: "생산라인 A구역",
    scores: { jeongri: 4, jeongdon: 3, cheongso: 4, cheonggyeol: 3, seupgwanhwa: 3 },
    totalScore: 17,
    average: 3.4,
    grade: "C",
    evaluator: "김관리",
    evaluationDate: "2026-04-08",
    remarks: "정돈 상태 개선 필요",
  },
  {
    id: "6",
    yearMonth: "2026-04",
    departmentId: "2",
    departmentName: "생산2팀",
    areaName: "생산라인 B구역",
    scores: { jeongri: 2, jeongdon: 2, cheongso: 3, cheonggyeol: 2, seupgwanhwa: 2 },
    totalScore: 11,
    average: 2.2,
    grade: "D",
    evaluator: "이점검",
    evaluationDate: "2026-04-08",
    remarks: "전체적인 개선 필요",
  },
];

// 초기 개선대책 데이터
const initialImprovements: ImprovementAction[] = [
  {
    id: "1",
    evaluationId: "2",
    yearMonth: "2026-06",
    departmentName: "생산2팀",
    areaName: "생산라인 B구역",
    issue: "공구 정위치 미준수로 작업 효율 저하",
    action: "공구 보관함 정리 및 라벨링 작업 시행",
    responsible: "김정돈",
    dueDate: "2026-06-20",
    completedDate: "",
    result: "",
    status: "진행중",
  },
  {
    id: "2",
    evaluationId: "2",
    yearMonth: "2026-06",
    departmentName: "생산2팀",
    areaName: "생산라인 B구역",
    issue: "불용품 적치로 통로 확보 미흡",
    action: "불용품 분류 및 폐기 처리",
    responsible: "이정리",
    dueDate: "2026-06-15",
    completedDate: "",
    result: "",
    status: "진행중",
  },
  {
    id: "3",
    evaluationId: "3",
    yearMonth: "2026-05",
    departmentName: "생산1팀",
    areaName: "생산라인 A구역",
    issue: "선입선출 표시 미흡",
    action: "선입선출 표시판 설치",
    responsible: "박청결",
    dueDate: "2026-06-01",
    completedDate: "2026-05-30",
    result: "선입선출 표시판 설치 완료, 관리 기준서 개정",
    status: "완료",
  },
];

// 초기 구역 정의 데이터
const initialAreaDefinitions: AreaDefinition[] = initialDepartments.map((dept) => ({
  id: dept.id,
  departmentName: dept.name,
  areaName: dept.area,
  manager: dept.manager,
  description: "",
}));

// 년월 선택을 위한 옵션 생성
const getYearMonthOptions = () => {
  const options: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    options.push(yearMonth);
  }
  return options;
};

export default function HousekeepingEvaluationPage() {
  const [activeTab, setActiveTab] = useState("monthly-evaluation");
  const [evaluations, setEvaluations] = useState<MonthlyEvaluation[]>(initialEvaluations);
  const [improvements, setImprovements] = useState<ImprovementAction[]>(initialImprovements);
  const [areaDefinitions, setAreaDefinitions] = useState<AreaDefinition[]>(initialAreaDefinitions);

  // 탭1: 월간 평가 입력 폼 상태
  const [selectedYearMonth, setSelectedYearMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [evaluationDate, setEvaluationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [scores, setScores] = useState<EvaluationScores>({
    jeongri: 0,
    jeongdon: 0,
    cheongso: 0,
    cheonggyeol: 0,
    seupgwanhwa: 0,
  });
  const [remarks, setRemarks] = useState("");

  // 탭2: 개선대책 입력 폼 상태
  const [improvementForm, setImprovementForm] = useState({
    evaluationId: "",
    issue: "",
    action: "",
    responsible: "",
    dueDate: "",
    result: "",
  });

  // 탭3: 추이 분석을 위한 필터
  const [trendYearMonth, setTrendYearMonth] = useState("");

  // 탭4: 구역 편집 상태
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [newAreaForm, setNewAreaForm] = useState({
    departmentName: "",
    areaName: "",
    manager: "",
    description: "",
  });

  // 점수 계산 함수
  const calculateTotalAndAverage = (s: EvaluationScores) => {
    const total = Object.values(s).reduce((sum, score) => sum + score, 0);
    const average = total / 5;
    return { total, average: Math.round(average * 10) / 10 };
  };

  const handleScoreChange = (category: keyof EvaluationScores, value: number) => {
    setScores((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // 탭1: 월간 평가 저장
  const handleSaveEvaluation = () => {
    if (!selectedYearMonth || !selectedDepartment || !evaluator) {
      alert("평가년월, 평가구역/부서, 평가자를 입력해주세요.");
      return;
    }

    const allScoresEntered = Object.values(scores).every((score) => score > 0);
    if (!allScoresEntered) {
      alert("모든 평가항목에 점수를 입력해주세요.");
      return;
    }

    const dept = areaDefinitions.find((d) => d.id === selectedDepartment);
    if (!dept) return;

    const { total, average } = calculateTotalAndAverage(scores);
    const { grade } = getGrade(average);

    // 기존 평가 확인 (같은 년월, 같은 구역)
    const existingIndex = evaluations.findIndex(
      (e) => e.yearMonth === selectedYearMonth && e.departmentId === selectedDepartment
    );

    const newEvaluation: MonthlyEvaluation = {
      id: existingIndex >= 0 ? evaluations[existingIndex].id : String(Date.now()),
      yearMonth: selectedYearMonth,
      departmentId: selectedDepartment,
      departmentName: dept.departmentName,
      areaName: dept.areaName,
      scores: { ...scores },
      totalScore: total,
      average,
      grade,
      evaluator,
      evaluationDate,
      remarks,
    };

    if (existingIndex >= 0) {
      setEvaluations((prev) =>
        prev.map((e, idx) => (idx === existingIndex ? newEvaluation : e))
      );
    } else {
      setEvaluations((prev) => [newEvaluation, ...prev]);
    }

    // 폼 초기화
    setScores({
      jeongri: 0,
      jeongdon: 0,
      cheongso: 0,
      cheonggyeol: 0,
      seupgwanhwa: 0,
    });
    setRemarks("");
    alert("평가가 저장되었습니다.");
  };

  // 탭2: 개선대책 추가
  const handleAddImprovement = () => {
    if (
      !improvementForm.evaluationId ||
      !improvementForm.issue ||
      !improvementForm.action ||
      !improvementForm.responsible ||
      !improvementForm.dueDate
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const evaluation = evaluations.find((e) => e.id === improvementForm.evaluationId);
    if (!evaluation) return;

    const newImprovement: ImprovementAction = {
      id: String(Date.now()),
      evaluationId: improvementForm.evaluationId,
      yearMonth: evaluation.yearMonth,
      departmentName: evaluation.departmentName,
      areaName: evaluation.areaName,
      issue: improvementForm.issue,
      action: improvementForm.action,
      responsible: improvementForm.responsible,
      dueDate: improvementForm.dueDate,
      completedDate: "",
      result: improvementForm.result,
      status: "대기",
    };

    setImprovements((prev) => [newImprovement, ...prev]);

    // 폼 초기화
    setImprovementForm({
      evaluationId: "",
      issue: "",
      action: "",
      responsible: "",
      dueDate: "",
      result: "",
    });
  };

  const handleUpdateImprovementStatus = (
    id: string,
    status: ImprovementAction["status"],
    result?: string
  ) => {
    setImprovements((prev) =>
      prev.map((imp) => {
        if (imp.id !== id) return imp;
        return {
          ...imp,
          status,
          completedDate: status === "완료" ? new Date().toISOString().split("T")[0] : imp.completedDate,
          result: result !== undefined ? result : imp.result,
        };
      })
    );
  };

  // 탭4: 구역 추가
  const handleAddArea = () => {
    if (!newAreaForm.departmentName || !newAreaForm.areaName || !newAreaForm.manager) {
      alert("부서명, 구역명, 담당자를 입력해주세요.");
      return;
    }

    const newArea: AreaDefinition = {
      id: String(Date.now()),
      departmentName: newAreaForm.departmentName,
      areaName: newAreaForm.areaName,
      manager: newAreaForm.manager,
      description: newAreaForm.description,
    };

    setAreaDefinitions((prev) => [...prev, newArea]);
    setNewAreaForm({ departmentName: "", areaName: "", manager: "", description: "" });
  };

  const handleUpdateArea = (id: string, updates: Partial<AreaDefinition>) => {
    setAreaDefinitions((prev) =>
      prev.map((area) => (area.id === id ? { ...area, ...updates } : area))
    );
  };

  const handleDeleteArea = (id: string) => {
    if (confirm("이 구역을 삭제하시겠습니까?")) {
      setAreaDefinitions((prev) => prev.filter((area) => area.id !== id));
    }
  };

  // 유틸리티 함수
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  const formatYearMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    return `${year}년 ${parseInt(month)}월`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "error"> = {
      완료: "success",
      대기: "secondary",
      진행중: "warning",
      지연: "error",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      A: "bg-green-100 text-green-800",
      B: "bg-blue-100 text-blue-800",
      C: "bg-yellow-100 text-yellow-800",
      D: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${colors[grade] || "bg-gray-100"}`}>
        {grade}등급
      </span>
    );
  };

  // 현재 폼 점수 계산
  const currentFormStats = calculateTotalAndAverage(scores);
  const currentFormGrade = getGrade(currentFormStats.average);

  // 월별 추이 데이터 계산
  const getMonthlyTrendData = () => {
    const trendData: Record<
      string,
      Record<string, { average: number; grade: string }>
    > = {};

    // 최근 6개월 데이터 추출
    const months = getYearMonthOptions().slice(0, 6).reverse();

    months.forEach((month) => {
      trendData[month] = {};
    });

    evaluations.forEach((evaluation) => {
      if (trendData[evaluation.yearMonth]) {
        trendData[evaluation.yearMonth][evaluation.departmentName] = {
          average: evaluation.average,
          grade: evaluation.grade,
        };
      }
    });

    return { months, trendData };
  };

  const { months: trendMonths, trendData } = getMonthlyTrendData();

  // 부서별 평균 점수 계산
  const getDepartmentAverages = () => {
    const deptData: Record<string, { total: number; count: number }> = {};

    evaluations.forEach((evaluation) => {
      if (!deptData[evaluation.departmentName]) {
        deptData[evaluation.departmentName] = { total: 0, count: 0 };
      }
      deptData[evaluation.departmentName].total += evaluation.average;
      deptData[evaluation.departmentName].count += 1;
    });

    return Object.entries(deptData).map(([dept, data]) => ({
      department: dept,
      average: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }));
  };

  const departmentAverages = getDepartmentAverages();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">3정5행 평가 및 개선대책</h1>
          <p className="text-muted-foreground">
            월간 3정5행 평가 및 개선활동 관리 (정리, 정돈, 청소, 청결, 습관화)
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="monthly-evaluation">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            월간 3정5행 평가
          </TabsTrigger>
          <TabsTrigger value="improvement">
            <FileText className="mr-2 h-4 w-4" />
            개선대책 입력
          </TabsTrigger>
          <TabsTrigger value="trend">
            <TrendingUp className="mr-2 h-4 w-4" />
            월별 추이
          </TabsTrigger>
          <TabsTrigger value="area-management">
            <MapPin className="mr-2 h-4 w-4" />
            구역도 관리
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 월간 3정5행 평가 */}
        <TabsContent value="monthly-evaluation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 평가 입력 폼 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  월간 3정5행 평가 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="yearMonth">평가년월</Label>
                    <Select value={selectedYearMonth} onValueChange={setSelectedYearMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="년월 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {getYearMonthOptions().map((ym) => (
                          <SelectItem key={ym} value={ym}>
                            {formatYearMonth(ym)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">평가구역/부서</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="구역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaDefinitions.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.departmentName} - {area.areaName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluationDate">평가일</Label>
                    <Input
                      id="evaluationDate"
                      type="date"
                      value={evaluationDate}
                      onChange={(e) => setEvaluationDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluator">평가자</Label>
                    <Input
                      id="evaluator"
                      value={evaluator}
                      onChange={(e) => setEvaluator(e.target.value)}
                      placeholder="평가자명"
                    />
                  </div>
                </div>

                {/* 평가항목 (5개 항목, 각 1-5점) */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    평가항목 (정리, 정돈, 청소, 청결, 습관화) - 각 5점 만점
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">평가항목</TableHead>
                        <TableHead>평가기준</TableHead>
                        <TableHead className="w-[280px]">항목별 점수 (1-5점)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluationItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.criteria}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((score) => (
                                <Button
                                  key={score}
                                  type="button"
                                  variant={
                                    scores[item.id as keyof EvaluationScores] === score
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="w-10"
                                  onClick={() =>
                                    handleScoreChange(item.id as keyof EvaluationScores, score)
                                  }
                                >
                                  {score}
                                </Button>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {scores[item.id as keyof EvaluationScores] > 0 &&
                                scoreDescriptions[scores[item.id as keyof EvaluationScores]]}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 비고 */}
                <div className="space-y-2">
                  <Label htmlFor="remarks">비고/특이사항</Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="평가 결과에 대한 특이사항을 입력하세요"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveEvaluation}>
                    <Save className="mr-2 h-4 w-4" />
                    평가 저장
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 점수 요약 및 등급 기준 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>현재 점수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-4xl font-bold">
                        {currentFormStats.total}/25
                      </div>
                      <div className="text-lg text-muted-foreground">
                        평균: {currentFormStats.average}점
                      </div>
                      {currentFormStats.average > 0 && (
                        <div className="mt-2">{getGradeBadge(currentFormGrade.grade)}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {evaluationItems.map((item) => {
                        const score = scores[item.id as keyof EvaluationScores];
                        return (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>{item.name}</span>
                            <span
                              className={`font-medium ${
                                score === 0
                                  ? "text-muted-foreground"
                                  : score >= 4
                                  ? "text-green-600"
                                  : score >= 3
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {score > 0 ? `${score}점` : "-"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>총점/등급 기준</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">A등급</span>
                      <span>4.5점 이상 (22.5점~)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">B등급</span>
                      <span>3.5점 이상 (17.5점~)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-yellow-600">C등급</span>
                      <span>2.5점 이상 (12.5점~)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-600">D등급</span>
                      <span>2.5점 미만</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 최근 평가 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>최근 평가 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {evaluations.slice(0, 5).map((evaluation) => (
                      <div
                        key={evaluation.id}
                        className="flex justify-between items-center p-2 border rounded-lg text-sm"
                      >
                        <div>
                          <div className="font-medium">{evaluation.areaName}</div>
                          <div className="text-muted-foreground">
                            {formatYearMonth(evaluation.yearMonth)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{evaluation.average}점</div>
                          {getGradeBadge(evaluation.grade)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: 개선대책 입력 */}
        <TabsContent value="improvement">
          <div className="space-y-6">
            {/* 개선대책 등록 폼 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  개선대책 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>관련 평가</Label>
                    <Select
                      value={improvementForm.evaluationId}
                      onValueChange={(value) =>
                        setImprovementForm({ ...improvementForm, evaluationId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="평가 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {evaluations
                          .filter((e) => e.grade === "C" || e.grade === "D")
                          .map((evaluation) => (
                            <SelectItem key={evaluation.id} value={evaluation.id}>
                              {formatYearMonth(evaluation.yearMonth)} - {evaluation.areaName} ({evaluation.grade}등급)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label>지적사항</Label>
                    <Input
                      value={improvementForm.issue}
                      onChange={(e) =>
                        setImprovementForm({ ...improvementForm, issue: e.target.value })
                      }
                      placeholder="지적사항 입력"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label>개선대책</Label>
                    <Input
                      value={improvementForm.action}
                      onChange={(e) =>
                        setImprovementForm({ ...improvementForm, action: e.target.value })
                      }
                      placeholder="개선대책 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>담당자</Label>
                    <Input
                      value={improvementForm.responsible}
                      onChange={(e) =>
                        setImprovementForm({ ...improvementForm, responsible: e.target.value })
                      }
                      placeholder="담당자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>완료예정일</Label>
                    <Input
                      type="date"
                      value={improvementForm.dueDate}
                      onChange={(e) =>
                        setImprovementForm({ ...improvementForm, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <Button onClick={handleAddImprovement} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      등록
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 개선대책 목록 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  개선대책 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                {improvements.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    등록된 개선대책이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>평가년월</TableHead>
                        <TableHead>구역/부서</TableHead>
                        <TableHead>지적사항</TableHead>
                        <TableHead>개선대책</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>완료예정일</TableHead>
                        <TableHead>조치결과</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="w-[120px]">상태변경</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {improvements.map((improvement) => (
                        <TableRow key={improvement.id}>
                          <TableCell>{formatYearMonth(improvement.yearMonth)}</TableCell>
                          <TableCell>
                            <div className="font-medium">{improvement.departmentName}</div>
                            <div className="text-sm text-muted-foreground">
                              {improvement.areaName}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[150px]">
                            {improvement.issue}
                          </TableCell>
                          <TableCell className="max-w-[150px]">
                            {improvement.action}
                          </TableCell>
                          <TableCell>{improvement.responsible}</TableCell>
                          <TableCell>{formatDate(improvement.dueDate)}</TableCell>
                          <TableCell>
                            {improvement.status === "완료" ? (
                              <span className="text-sm">{improvement.result || "-"}</span>
                            ) : (
                              <Input
                                placeholder="조치결과 입력"
                                className="h-8 text-sm"
                                value={improvement.result}
                                onChange={(e) =>
                                  handleUpdateImprovementStatus(
                                    improvement.id,
                                    improvement.status,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(improvement.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={improvement.status}
                              onValueChange={(value) =>
                                handleUpdateImprovementStatus(
                                  improvement.id,
                                  value as ImprovementAction["status"]
                                )
                              }
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="대기">대기</SelectItem>
                                <SelectItem value="진행중">진행중</SelectItem>
                                <SelectItem value="완료">완료</SelectItem>
                                <SelectItem value="지연">지연</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* 개선 현황 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{improvements.length}</div>
                    <div className="text-sm text-muted-foreground">전체 개선 항목</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {improvements.filter((i) => i.status === "진행중").length}
                    </div>
                    <div className="text-sm text-muted-foreground">진행중</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {improvements.filter((i) => i.status === "완료").length}
                    </div>
                    <div className="text-sm text-muted-foreground">완료</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {improvements.filter((i) => i.status === "지연").length}
                    </div>
                    <div className="text-sm text-muted-foreground">지연</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: 월별 추이 */}
        <TabsContent value="trend">
          <div className="space-y-6">
            {/* 부서별 월별 점수 추이 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  부서별 월별 점수 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>부서/구역</TableHead>
                      {trendMonths.map((month) => (
                        <TableHead key={month} className="text-center">
                          {formatYearMonth(month)}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">평균</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {areaDefinitions.map((area) => {
                      const areaEvaluations = evaluations.filter(
                        (e) => e.departmentId === area.id
                      );
                      const avgScore =
                        areaEvaluations.length > 0
                          ? Math.round(
                              (areaEvaluations.reduce((sum, e) => sum + e.average, 0) /
                                areaEvaluations.length) *
                                10
                            ) / 10
                          : 0;
                      const avgGrade = avgScore > 0 ? getGrade(avgScore) : null;

                      return (
                        <TableRow key={area.id}>
                          <TableCell>
                            <div className="font-medium">{area.departmentName}</div>
                            <div className="text-sm text-muted-foreground">{area.areaName}</div>
                          </TableCell>
                          {trendMonths.map((month) => {
                            const evaluation = evaluations.find(
                              (e) => e.departmentId === area.id && e.yearMonth === month
                            );
                            return (
                              <TableCell key={month} className="text-center">
                                {evaluation ? (
                                  <div>
                                    <div
                                      className={`font-semibold ${
                                        evaluation.average >= 4
                                          ? "text-green-600"
                                          : evaluation.average >= 3
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {evaluation.average}
                                    </div>
                                    <div className="text-xs">
                                      {getGradeBadge(evaluation.grade)}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
                            {avgScore > 0 ? (
                              <div>
                                <div className={`font-bold ${avgGrade?.color}`}>
                                  {avgScore}
                                </div>
                                {avgGrade && (
                                  <div className="text-xs">{getGradeBadge(avgGrade.grade)}</div>
                                )}
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

            {/* 평균 점수 변화 */}
            <Card>
              <CardHeader>
                <CardTitle>전체 평균 점수 변화</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendMonths.map((month) => {
                    const monthEvaluations = evaluations.filter((e) => e.yearMonth === month);
                    const avgScore =
                      monthEvaluations.length > 0
                        ? Math.round(
                            (monthEvaluations.reduce((sum, e) => sum + e.average, 0) /
                              monthEvaluations.length) *
                              10
                          ) / 10
                        : 0;
                    const grade = avgScore > 0 ? getGrade(avgScore) : null;

                    return (
                      <div key={month} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{formatYearMonth(month)}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-6 relative">
                            {avgScore > 0 && (
                              <div
                                className={`h-6 rounded-full flex items-center justify-end pr-2 ${
                                  avgScore >= 4
                                    ? "bg-green-500"
                                    : avgScore >= 3
                                    ? "bg-yellow-500"
                                    : avgScore >= 2.5
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${(avgScore / 5) * 100}%` }}
                              >
                                <span className="text-white text-sm font-bold">{avgScore}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-16">
                          {grade && getGradeBadge(grade.grade)}
                        </div>
                        <div className="w-16 text-sm text-muted-foreground">
                          ({monthEvaluations.length}건)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 부서별 평균 요약 */}
            <Card>
              <CardHeader>
                <CardTitle>부서별 누적 평균</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {departmentAverages
                    .sort((a, b) => b.average - a.average)
                    .map((dept) => {
                      const grade = getGrade(dept.average);
                      return (
                        <Card key={dept.department} className="border">
                          <CardContent className="pt-4">
                            <div className="text-center">
                              <div className="font-medium mb-2">{dept.department}</div>
                              <div className={`text-2xl font-bold ${grade.color}`}>
                                {dept.average}점
                              </div>
                              <div className="mt-1">{getGradeBadge(grade.grade)}</div>
                              <div className="text-xs text-muted-foreground mt-2">
                                총 {dept.count}회 평가
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* 항목별 전체 평균 */}
            <Card>
              <CardHeader>
                <CardTitle>5행 항목별 전체 평균</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evaluationItems.map((item) => {
                    const avgScore =
                      evaluations.length > 0
                        ? evaluations.reduce(
                            (sum, e) => sum + e.scores[item.id as keyof EvaluationScores],
                            0
                          ) / evaluations.length
                        : 0;
                    const roundedAvg = Math.round(avgScore * 10) / 10;

                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium">{item.name}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full ${
                                roundedAvg >= 4
                                  ? "bg-green-500"
                                  : roundedAvg >= 3
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${(roundedAvg / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right font-semibold">{roundedAvg}점</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 구역도 관리 */}
        <TabsContent value="area-management">
          <div className="space-y-6">
            {/* 구역 추가 폼 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  구역 정의 추가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>부서명</Label>
                    <Input
                      value={newAreaForm.departmentName}
                      onChange={(e) =>
                        setNewAreaForm({ ...newAreaForm, departmentName: e.target.value })
                      }
                      placeholder="부서명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>구역명</Label>
                    <Input
                      value={newAreaForm.areaName}
                      onChange={(e) =>
                        setNewAreaForm({ ...newAreaForm, areaName: e.target.value })
                      }
                      placeholder="구역명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>담당자</Label>
                    <Input
                      value={newAreaForm.manager}
                      onChange={(e) =>
                        setNewAreaForm({ ...newAreaForm, manager: e.target.value })
                      }
                      placeholder="담당자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설명</Label>
                    <Input
                      value={newAreaForm.description}
                      onChange={(e) =>
                        setNewAreaForm({ ...newAreaForm, description: e.target.value })
                      }
                      placeholder="구역 설명 (선택)"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <Button onClick={handleAddArea} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      추가
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 구역 목록 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  구역 정의 및 담당자 배정
                </CardTitle>
              </CardHeader>
              <CardContent>
                {areaDefinitions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    정의된 구역이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>부서명</TableHead>
                        <TableHead>구역명</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>설명</TableHead>
                        <TableHead className="text-center">최근 평가</TableHead>
                        <TableHead className="w-[100px]">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {areaDefinitions.map((area) => {
                        const latestEvaluation = evaluations.find(
                          (e) => e.departmentId === area.id
                        );
                        const isEditing = editingAreaId === area.id;

                        return (
                          <TableRow key={area.id}>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={area.departmentName}
                                  onChange={(e) =>
                                    handleUpdateArea(area.id, { departmentName: e.target.value })
                                  }
                                  className="h-8"
                                />
                              ) : (
                                <span className="font-medium">{area.departmentName}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={area.areaName}
                                  onChange={(e) =>
                                    handleUpdateArea(area.id, { areaName: e.target.value })
                                  }
                                  className="h-8"
                                />
                              ) : (
                                area.areaName
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={area.manager}
                                  onChange={(e) =>
                                    handleUpdateArea(area.id, { manager: e.target.value })
                                  }
                                  className="h-8"
                                />
                              ) : (
                                area.manager
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={area.description}
                                  onChange={(e) =>
                                    handleUpdateArea(area.id, { description: e.target.value })
                                  }
                                  className="h-8"
                                  placeholder="설명 입력"
                                />
                              ) : (
                                <span className="text-muted-foreground">
                                  {area.description || "-"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {latestEvaluation ? (
                                <div>
                                  <div className="text-sm">{formatYearMonth(latestEvaluation.yearMonth)}</div>
                                  <div>{getGradeBadge(latestEvaluation.grade)}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">미평가</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {isEditing ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingAreaId(null)}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingAreaId(area.id)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteArea(area.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* 구역별 담당자 현황 요약 */}
            <Card>
              <CardHeader>
                <CardTitle>담당자별 구역 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from(new Set(areaDefinitions.map((a) => a.manager))).map((manager) => {
                    const areas = areaDefinitions.filter((a) => a.manager === manager);
                    return (
                      <Card key={manager} className="border">
                        <CardContent className="pt-4">
                          <div className="font-medium text-lg mb-2">{manager}</div>
                          <div className="space-y-1">
                            {areas.map((area) => (
                              <div
                                key={area.id}
                                className="text-sm text-muted-foreground flex justify-between"
                              >
                                <span>{area.areaName}</span>
                                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                  {area.departmentName}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                            총 {areas.length}개 구역 담당
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
