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
  FileText,
  History,
  Save,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// 5S 평가항목 정의
const fiveSCategories = [
  {
    id: "seiri",
    name: "정리 (Sort)",
    description: "불필요한 물건 제거",
    criteria: "불필요한 물품이 제거되고, 필요한 물품만 보관되어 있는가?",
  },
  {
    id: "seiton",
    name: "정돈 (Set in Order)",
    description: "물건의 정위치",
    criteria: "물품이 정해진 위치에 정돈되어 있고, 쉽게 찾을 수 있는가?",
  },
  {
    id: "seiso",
    name: "청소 (Shine)",
    description: "청결상태",
    criteria: "작업 구역이 깨끗하게 청소되어 있고, 오염원이 제거되어 있는가?",
  },
  {
    id: "seiketsu",
    name: "청결 (Standardize)",
    description: "표준화 준수",
    criteria: "5S 표준이 문서화되어 있고, 일관되게 준수되고 있는가?",
  },
  {
    id: "shitsuke",
    name: "습관화 (Sustain)",
    description: "지속적 실천",
    criteria: "5S 활동이 일상화되어 있고, 지속적으로 개선되고 있는가?",
  },
];

// 평가기준
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

// 구역 목록
const areas = [
  "생산라인 A",
  "생산라인 B",
  "생산라인 C",
  "원자재 창고",
  "완제품 창고",
  "사무실",
  "휴게실",
  "정비실",
];

interface FiveSScore {
  seiri: number;
  seiton: number;
  seiso: number;
  seiketsu: number;
  shitsuke: number;
}

interface Evaluation {
  id: string;
  evaluationNo: string;
  evaluationDate: string;
  area: string;
  evaluator: string;
  scores: FiveSScore;
  totalScore: number;
  average: number;
  grade: string;
  findings: string;
  improvements: string;
  status: "완료" | "개선중" | "개선완료";
}

interface Improvement {
  id: string;
  evaluationId: string;
  evaluationNo: string;
  area: string;
  category: string;
  issue: string;
  action: string;
  responsible: string;
  dueDate: string;
  completedDate: string;
  status: "대기" | "진행중" | "완료" | "지연";
}

// 초기 데이터
const initialEvaluations: Evaluation[] = [
  {
    id: "1",
    evaluationNo: "5S-2026-001",
    evaluationDate: "2026-06-01",
    area: "생산라인 A",
    evaluator: "김관리",
    scores: { seiri: 5, seiton: 4, seiso: 5, seiketsu: 4, shitsuke: 4 },
    totalScore: 22,
    average: 4.4,
    grade: "B",
    findings: "전반적으로 양호하나 표준 문서화 보완 필요",
    improvements: "",
    status: "완료",
  },
  {
    id: "2",
    evaluationNo: "5S-2026-002",
    evaluationDate: "2026-06-01",
    area: "생산라인 B",
    evaluator: "이점검",
    scores: { seiri: 3, seiton: 2, seiso: 3, seiketsu: 3, shitsuke: 2 },
    totalScore: 13,
    average: 2.6,
    grade: "C",
    findings: "불용품 적치 및 정돈 미흡, 청소 상태 개선 필요",
    improvements: "불용품 폐기 및 정리정돈 개선 활동 시행",
    status: "개선중",
  },
  {
    id: "3",
    evaluationNo: "5S-2026-003",
    evaluationDate: "2026-05-15",
    area: "원자재 창고",
    evaluator: "박평가",
    scores: { seiri: 4, seiton: 4, seiso: 4, seiketsu: 3, shitsuke: 3 },
    totalScore: 18,
    average: 3.6,
    grade: "B",
    findings: "선입선출 표시 및 표준화 보완 필요",
    improvements: "선입선출 표시판 설치 완료",
    status: "개선완료",
  },
];

const initialImprovements: Improvement[] = [
  {
    id: "1",
    evaluationId: "2",
    evaluationNo: "5S-2026-002",
    area: "생산라인 B",
    category: "정돈",
    issue: "공구 정위치 미준수",
    action: "공구 보관함 정리 및 라벨링",
    responsible: "김정돈",
    dueDate: "2026-06-15",
    completedDate: "",
    status: "진행중",
  },
  {
    id: "2",
    evaluationId: "2",
    evaluationNo: "5S-2026-002",
    area: "생산라인 B",
    category: "정리",
    issue: "불용품 적치",
    action: "불용품 분류 및 폐기",
    responsible: "이정리",
    dueDate: "2026-06-10",
    completedDate: "",
    status: "진행중",
  },
  {
    id: "3",
    evaluationId: "3",
    evaluationNo: "5S-2026-003",
    area: "원자재 창고",
    category: "청결",
    issue: "선입선출 표시 미흡",
    action: "선입선출 표시판 설치",
    responsible: "박청결",
    dueDate: "2026-06-01",
    completedDate: "2026-05-30",
    status: "완료",
  },
];

// 점검번호 생성
const generateEvaluationNo = (evaluations: Evaluation[]): string => {
  const year = new Date().getFullYear();
  const count = evaluations.filter((e) =>
    e.evaluationNo.includes(`5S-${year}`)
  ).length;
  return `5S-${year}-${String(count + 1).padStart(3, "0")}`;
};

export default function HousekeepingEvaluationPage() {
  const [activeTab, setActiveTab] = useState("input");
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [improvements, setImprovements] = useState<Improvement[]>(initialImprovements);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  // 신규 평가 입력 폼 상태
  const [formData, setFormData] = useState({
    evaluationDate: new Date().toISOString().split("T")[0],
    area: "",
    evaluator: "",
    scores: {
      seiri: 0,
      seiton: 0,
      seiso: 0,
      seiketsu: 0,
      shitsuke: 0,
    } as FiveSScore,
    findings: "",
    improvements: "",
  });

  // 개선 등록 폼 상태
  const [improvementForm, setImprovementForm] = useState({
    evaluationId: "",
    category: "",
    issue: "",
    action: "",
    responsible: "",
    dueDate: "",
  });

  const calculateTotalAndAverage = (scores: FiveSScore) => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const average = total / 5;
    return { total, average: Math.round(average * 10) / 10 };
  };

  const handleScoreChange = (category: keyof FiveSScore, value: number) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: value,
      },
    }));
  };

  const handleSubmitEvaluation = () => {
    if (!formData.area || !formData.evaluator) {
      alert("점검구역과 점검자를 입력해주세요.");
      return;
    }

    const allScoresEntered = Object.values(formData.scores).every(
      (score) => score > 0
    );
    if (!allScoresEntered) {
      alert("모든 평가항목에 점수를 입력해주세요.");
      return;
    }

    const { total, average } = calculateTotalAndAverage(formData.scores);
    const { grade } = getGrade(average);

    const newEvaluation: Evaluation = {
      id: String(Date.now()),
      evaluationNo: generateEvaluationNo(evaluations),
      evaluationDate: formData.evaluationDate,
      area: formData.area,
      evaluator: formData.evaluator,
      scores: { ...formData.scores },
      totalScore: total,
      average,
      grade,
      findings: formData.findings,
      improvements: formData.improvements,
      status: average >= 3.5 ? "완료" : "개선중",
    };

    setEvaluations((prev) => [newEvaluation, ...prev]);
    setSelectedEvaluation(newEvaluation);

    // 폼 초기화
    setFormData({
      evaluationDate: new Date().toISOString().split("T")[0],
      area: "",
      evaluator: "",
      scores: {
        seiri: 0,
        seiton: 0,
        seiso: 0,
        seiketsu: 0,
        shitsuke: 0,
      },
      findings: "",
      improvements: "",
    });

    // 결과 탭으로 이동
    setActiveTab("result");
  };

  const handleAddImprovement = () => {
    if (
      !improvementForm.evaluationId ||
      !improvementForm.category ||
      !improvementForm.issue ||
      !improvementForm.action ||
      !improvementForm.responsible ||
      !improvementForm.dueDate
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const evaluation = evaluations.find(
      (e) => e.id === improvementForm.evaluationId
    );
    if (!evaluation) return;

    const newImprovement: Improvement = {
      id: String(Date.now()),
      evaluationId: improvementForm.evaluationId,
      evaluationNo: evaluation.evaluationNo,
      area: evaluation.area,
      category: improvementForm.category,
      issue: improvementForm.issue,
      action: improvementForm.action,
      responsible: improvementForm.responsible,
      dueDate: improvementForm.dueDate,
      completedDate: "",
      status: "대기",
    };

    setImprovements((prev) => [newImprovement, ...prev]);

    // 폼 초기화
    setImprovementForm({
      evaluationId: "",
      category: "",
      issue: "",
      action: "",
      responsible: "",
      dueDate: "",
    });
  };

  const handleUpdateImprovementStatus = (
    id: string,
    status: Improvement["status"]
  ) => {
    setImprovements((prev) =>
      prev.map((imp) => {
        if (imp.id !== id) return imp;
        return {
          ...imp,
          status,
          completedDate: status === "완료" ? new Date().toISOString().split("T")[0] : imp.completedDate,
        };
      })
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "error"> = {
      완료: "success",
      개선완료: "success",
      개선중: "warning",
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
      <span
        className={`px-3 py-1 rounded-full text-sm font-bold ${colors[grade] || "bg-gray-100"}`}
      >
        {grade}등급
      </span>
    );
  };

  // 이력 데이터 (구역별 평균 추이)
  const getAreaTrends = () => {
    const trends: Record<
      string,
      { evaluations: Evaluation[]; avgScore: number }
    > = {};

    evaluations.forEach((evaluation) => {
      if (!trends[evaluation.area]) {
        trends[evaluation.area] = { evaluations: [], avgScore: 0 };
      }
      trends[evaluation.area].evaluations.push(evaluation);
    });

    Object.keys(trends).forEach((area) => {
      const evals = trends[area].evaluations;
      const totalAvg = evals.reduce((sum, e) => sum + e.average, 0);
      trends[area].avgScore =
        evals.length > 0 ? Math.round((totalAvg / evals.length) * 10) / 10 : 0;
    });

    return trends;
  };

  const areaTrends = getAreaTrends();

  // 현재 폼 점수 계산
  const currentFormStats = calculateTotalAndAverage(formData.scores);
  const currentFormGrade = getGrade(currentFormStats.average);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">5S 점검 평가</h1>
          <p className="text-muted-foreground">
            5S (정리, 정돈, 청소, 청결, 습관화) 평가 및 개선활동 관리
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="input">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            점검 입력
          </TabsTrigger>
          <TabsTrigger value="result">
            <FileText className="mr-2 h-4 w-4" />
            평가 결과
          </TabsTrigger>
          <TabsTrigger value="improvement">
            <AlertTriangle className="mr-2 h-4 w-4" />
            개선 관리
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            점검 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 점검 입력 */}
        <TabsContent value="input">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 기본 정보 입력 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  5S 점검 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 헤더 정보 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="evaluationNo">점검번호</Label>
                    <Input
                      id="evaluationNo"
                      value={generateEvaluationNo(evaluations)}
                      disabled
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluationDate">점검일</Label>
                    <Input
                      id="evaluationDate"
                      type="date"
                      value={formData.evaluationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, evaluationDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">점검구역</Label>
                    <Select
                      value={formData.area}
                      onValueChange={(value) =>
                        setFormData({ ...formData, area: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="구역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluator">점검자</Label>
                    <Input
                      id="evaluator"
                      value={formData.evaluator}
                      onChange={(e) =>
                        setFormData({ ...formData, evaluator: e.target.value })
                      }
                      placeholder="점검자명"
                    />
                  </div>
                </div>

                {/* 5S 평가항목 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">5S 평가항목 (각 5점 만점)</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">평가항목</TableHead>
                        <TableHead>평가기준</TableHead>
                        <TableHead className="w-[300px]">점수</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fiveSCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {category.criteria}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((score) => (
                                <Button
                                  key={score}
                                  type="button"
                                  variant={
                                    formData.scores[category.id as keyof FiveSScore] ===
                                    score
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  className="w-10"
                                  onClick={() =>
                                    handleScoreChange(
                                      category.id as keyof FiveSScore,
                                      score
                                    )
                                  }
                                >
                                  {score}
                                </Button>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formData.scores[category.id as keyof FiveSScore] > 0 &&
                                scoreDescriptions[
                                  formData.scores[category.id as keyof FiveSScore]
                                ]}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* 평가 결과 및 의견 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="findings">평가결과/지적사항</Label>
                    <Textarea
                      id="findings"
                      value={formData.findings}
                      onChange={(e) =>
                        setFormData({ ...formData, findings: e.target.value })
                      }
                      placeholder="평가 결과 및 지적사항을 입력하세요"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="improvements">개선필요사항</Label>
                    <Textarea
                      id="improvements"
                      value={formData.improvements}
                      onChange={(e) =>
                        setFormData({ ...formData, improvements: e.target.value })
                      }
                      placeholder="개선이 필요한 사항을 입력하세요"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSubmitEvaluation}>
                    <Save className="mr-2 h-4 w-4" />
                    평가 저장
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 평가기준 및 현재 점수 요약 */}
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
                        <div className="mt-2">
                          {getGradeBadge(currentFormGrade.grade)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {fiveSCategories.map((category) => {
                        const score =
                          formData.scores[category.id as keyof FiveSScore];
                        return (
                          <div
                            key={category.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>{category.name.split(" ")[0]}</span>
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
                  <CardTitle>평가기준</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(scoreDescriptions)
                      .reverse()
                      .map(([score, desc]) => (
                        <div
                          key={score}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium">{score}점</span>
                          <span className="text-muted-foreground">{desc}</span>
                        </div>
                      ))}
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
                      <span className="font-bold text-green-600">A등급</span>
                      <span>4.5점 이상</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">B등급</span>
                      <span>3.5점 이상</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-yellow-600">C등급</span>
                      <span>2.5점 이상</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-600">D등급</span>
                      <span>2.5점 미만</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: 평가 결과 */}
        <TabsContent value="result">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 평가 목록 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>5S 평가 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {evaluations.length === 0 ? (
                  <p className="text-muted-foreground">등록된 평가가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>점검번호</TableHead>
                        <TableHead>점검일</TableHead>
                        <TableHead>점검구역</TableHead>
                        <TableHead>점검자</TableHead>
                        <TableHead className="text-center">총점</TableHead>
                        <TableHead className="text-center">평균</TableHead>
                        <TableHead className="text-center">등급</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluations.map((evaluation) => (
                        <TableRow
                          key={evaluation.id}
                          className={`cursor-pointer hover:bg-muted/50 ${
                            selectedEvaluation?.id === evaluation.id
                              ? "bg-muted"
                              : ""
                          }`}
                          onClick={() => setSelectedEvaluation(evaluation)}
                        >
                          <TableCell className="font-medium">
                            {evaluation.evaluationNo}
                          </TableCell>
                          <TableCell>
                            {formatDate(evaluation.evaluationDate)}
                          </TableCell>
                          <TableCell>{evaluation.area}</TableCell>
                          <TableCell>{evaluation.evaluator}</TableCell>
                          <TableCell className="text-center font-semibold">
                            {evaluation.totalScore}/25
                          </TableCell>
                          <TableCell className="text-center">
                            {evaluation.average}
                          </TableCell>
                          <TableCell className="text-center">
                            {getGradeBadge(evaluation.grade)}
                          </TableCell>
                          <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* 선택된 평가 상세 */}
            <Card>
              <CardHeader>
                <CardTitle>평가 상세</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEvaluation ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold">
                        {selectedEvaluation.totalScore}/25
                      </div>
                      <div className="text-lg text-muted-foreground">
                        평균: {selectedEvaluation.average}점
                      </div>
                      <div className="mt-2">
                        {getGradeBadge(selectedEvaluation.grade)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">점검번호</span>
                        <span className="font-medium">
                          {selectedEvaluation.evaluationNo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">점검일</span>
                        <span>{formatDate(selectedEvaluation.evaluationDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">점검구역</span>
                        <span>{selectedEvaluation.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">점검자</span>
                        <span>{selectedEvaluation.evaluator}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">항목별 점수</h4>
                      <div className="space-y-2">
                        {fiveSCategories.map((category) => {
                          const score =
                            selectedEvaluation.scores[
                              category.id as keyof FiveSScore
                            ];
                          return (
                            <div
                              key={category.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span>{category.name.split(" ")[0]}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      score >= 4
                                        ? "bg-green-500"
                                        : score >= 3
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${(score / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="font-medium w-8">{score}점</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {selectedEvaluation.findings && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">평가결과</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvaluation.findings}
                        </p>
                      </div>
                    )}

                    {selectedEvaluation.improvements && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">개선필요사항</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvaluation.improvements}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    평가를 선택하여 상세 내용을 확인하세요.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 개선 관리 */}
        <TabsContent value="improvement">
          <div className="space-y-6">
            {/* 개선 등록 폼 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  개선 활동 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                          .filter((e) => e.status !== "완료")
                          .map((evaluation) => (
                            <SelectItem key={evaluation.id} value={evaluation.id}>
                              {evaluation.evaluationNo} - {evaluation.area}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>5S 항목</Label>
                    <Select
                      value={improvementForm.category}
                      onValueChange={(value) =>
                        setImprovementForm({ ...improvementForm, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="항목 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {fiveSCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.name.split(" ")[0]}
                          >
                            {category.name.split(" ")[0]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>문제점</Label>
                    <Input
                      value={improvementForm.issue}
                      onChange={(e) =>
                        setImprovementForm({
                          ...improvementForm,
                          issue: e.target.value,
                        })
                      }
                      placeholder="문제점"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>개선 조치</Label>
                    <Input
                      value={improvementForm.action}
                      onChange={(e) =>
                        setImprovementForm({
                          ...improvementForm,
                          action: e.target.value,
                        })
                      }
                      placeholder="개선 조치 내용"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>담당자</Label>
                    <Input
                      value={improvementForm.responsible}
                      onChange={(e) =>
                        setImprovementForm({
                          ...improvementForm,
                          responsible: e.target.value,
                        })
                      }
                      placeholder="담당자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>완료예정일</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={improvementForm.dueDate}
                        onChange={(e) =>
                          setImprovementForm({
                            ...improvementForm,
                            dueDate: e.target.value,
                          })
                        }
                      />
                      <Button onClick={handleAddImprovement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 개선 활동 목록 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  개선 활동 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                {improvements.length === 0 ? (
                  <p className="text-muted-foreground">등록된 개선 활동이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>점검번호</TableHead>
                        <TableHead>점검구역</TableHead>
                        <TableHead>5S 항목</TableHead>
                        <TableHead>문제점</TableHead>
                        <TableHead>개선 조치</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>완료예정일</TableHead>
                        <TableHead>완료일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>조치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {improvements.map((improvement) => (
                        <TableRow key={improvement.id}>
                          <TableCell className="font-medium">
                            {improvement.evaluationNo}
                          </TableCell>
                          <TableCell>{improvement.area}</TableCell>
                          <TableCell>{improvement.category}</TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {improvement.issue}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {improvement.action}
                          </TableCell>
                          <TableCell>{improvement.responsible}</TableCell>
                          <TableCell>{formatDate(improvement.dueDate)}</TableCell>
                          <TableCell>
                            {formatDate(improvement.completedDate)}
                          </TableCell>
                          <TableCell>{getStatusBadge(improvement.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={improvement.status}
                              onValueChange={(value) =>
                                handleUpdateImprovementStatus(
                                  improvement.id,
                                  value as Improvement["status"]
                                )
                              }
                            >
                              <SelectTrigger className="w-[100px]">
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

        {/* Tab 4: 점검 이력 */}
        <TabsContent value="history">
          <div className="space-y-6">
            {/* 구역별 추이 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  구역별 5S 평가 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(areaTrends).map(([area, data]) => {
                    const { grade, color } = getGrade(data.avgScore);
                    return (
                      <Card key={area} className="border">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="font-medium mb-2">{area}</div>
                            <div className={`text-2xl font-bold ${color}`}>
                              {data.avgScore}점
                            </div>
                            <div className="mt-1">{getGradeBadge(grade)}</div>
                            <div className="text-xs text-muted-foreground mt-2">
                              총 {data.evaluations.length}회 평가
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 전체 이력 테이블 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  전체 점검 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evaluations.length === 0 ? (
                  <p className="text-muted-foreground">등록된 점검 이력이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>점검번호</TableHead>
                        <TableHead>점검일</TableHead>
                        <TableHead>점검구역</TableHead>
                        <TableHead>점검자</TableHead>
                        <TableHead className="text-center">정리</TableHead>
                        <TableHead className="text-center">정돈</TableHead>
                        <TableHead className="text-center">청소</TableHead>
                        <TableHead className="text-center">청결</TableHead>
                        <TableHead className="text-center">습관화</TableHead>
                        <TableHead className="text-center">총점</TableHead>
                        <TableHead className="text-center">평균</TableHead>
                        <TableHead className="text-center">등급</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluations.map((evaluation) => (
                        <TableRow key={evaluation.id}>
                          <TableCell className="font-medium">
                            {evaluation.evaluationNo}
                          </TableCell>
                          <TableCell>
                            {formatDate(evaluation.evaluationDate)}
                          </TableCell>
                          <TableCell>{evaluation.area}</TableCell>
                          <TableCell>{evaluation.evaluator}</TableCell>
                          <TableCell className="text-center">
                            <ScoreCell score={evaluation.scores.seiri} />
                          </TableCell>
                          <TableCell className="text-center">
                            <ScoreCell score={evaluation.scores.seiton} />
                          </TableCell>
                          <TableCell className="text-center">
                            <ScoreCell score={evaluation.scores.seiso} />
                          </TableCell>
                          <TableCell className="text-center">
                            <ScoreCell score={evaluation.scores.seiketsu} />
                          </TableCell>
                          <TableCell className="text-center">
                            <ScoreCell score={evaluation.scores.shitsuke} />
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {evaluation.totalScore}
                          </TableCell>
                          <TableCell className="text-center">
                            {evaluation.average}
                          </TableCell>
                          <TableCell className="text-center">
                            {getGradeBadge(evaluation.grade)}
                          </TableCell>
                          <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* 5S 항목별 평균 추이 */}
            <Card>
              <CardHeader>
                <CardTitle>5S 항목별 전체 평균</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fiveSCategories.map((category) => {
                    const avgScore =
                      evaluations.length > 0
                        ? evaluations.reduce(
                            (sum, e) =>
                              sum + e.scores[category.id as keyof FiveSScore],
                            0
                          ) / evaluations.length
                        : 0;
                    const roundedAvg = Math.round(avgScore * 10) / 10;

                    return (
                      <div
                        key={category.id}
                        className="flex items-center gap-4"
                      >
                        <div className="w-32 text-sm font-medium">
                          {category.name.split(" ")[0]}
                        </div>
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
                        <div className="w-16 text-right font-semibold">
                          {roundedAvg}점
                        </div>
                      </div>
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

// 점수 셀 컴포넌트
function ScoreCell({ score }: { score: number }) {
  const color =
    score >= 4
      ? "text-green-600"
      : score >= 3
      ? "text-yellow-600"
      : "text-red-600";
  return <span className={`font-medium ${color}`}>{score}</span>;
}
