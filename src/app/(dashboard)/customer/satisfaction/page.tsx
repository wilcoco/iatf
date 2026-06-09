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
  ClipboardList,
  Star,
  TrendingUp,
  Wrench,
  Plus,
  Save,
} from "lucide-react";

// Survey registration interface
interface SurveyRegistration {
  id: number;
  surveyDate: string;
  surveyYear: string;
  surveyQuarter: string;
  customer: string;
  manager: string;
  surveyMethod: string;
}

// Survey scores interface
interface SurveyScores {
  id: number;
  surveyId: number;
  qualityScore: number;
  deliveryScore: number;
  responseScore: number;
  priceScore: number;
  totalScore: number;
}

// Quarterly trend data
interface TrendData {
  id: number;
  year: string;
  quarter: string;
  qualityAvg: number;
  deliveryAvg: number;
  responseAvg: number;
  priceAvg: number;
  overallAvg: number;
}

// Improvement action interface
interface ImprovementAction {
  id: number;
  surveyId: number;
  category: string;
  issue: string;
  action: string;
  responsiblePerson: string;
  dueDate: string;
  status: string;
}

// Survey methods
const surveyMethods = ["방문", "전화", "이메일", "서면"];

// Quarter options
const quarterOptions = ["1분기", "2분기", "3분기", "4분기"];

// Year options
const yearOptions = ["2024", "2025", "2026"];

// Initial survey registrations
const initialSurveys: SurveyRegistration[] = [
  {
    id: 1,
    surveyDate: "2026-03-15",
    surveyYear: "2026",
    surveyQuarter: "1분기",
    customer: "현대자동차",
    manager: "김품질",
    surveyMethod: "방문",
  },
  {
    id: 2,
    surveyDate: "2026-03-20",
    surveyYear: "2026",
    surveyQuarter: "1분기",
    customer: "기아자동차",
    manager: "박영업",
    surveyMethod: "이메일",
  },
  {
    id: 3,
    surveyDate: "2026-06-05",
    surveyYear: "2026",
    surveyQuarter: "2분기",
    customer: "현대자동차",
    manager: "김품질",
    surveyMethod: "전화",
  },
];

// Initial scores data
const initialScores: SurveyScores[] = [
  {
    id: 1,
    surveyId: 1,
    qualityScore: 4,
    deliveryScore: 3,
    responseScore: 5,
    priceScore: 3,
    totalScore: 15,
  },
  {
    id: 2,
    surveyId: 2,
    qualityScore: 5,
    deliveryScore: 4,
    responseScore: 4,
    priceScore: 4,
    totalScore: 17,
  },
  {
    id: 3,
    surveyId: 3,
    qualityScore: 4,
    deliveryScore: 4,
    responseScore: 5,
    priceScore: 3,
    totalScore: 16,
  },
];

// Initial trend data
const initialTrends: TrendData[] = [
  {
    id: 1,
    year: "2025",
    quarter: "1분기",
    qualityAvg: 3.8,
    deliveryAvg: 3.5,
    responseAvg: 4.0,
    priceAvg: 3.2,
    overallAvg: 3.6,
  },
  {
    id: 2,
    year: "2025",
    quarter: "2분기",
    qualityAvg: 4.0,
    deliveryAvg: 3.7,
    responseAvg: 4.2,
    priceAvg: 3.3,
    overallAvg: 3.8,
  },
  {
    id: 3,
    year: "2025",
    quarter: "3분기",
    qualityAvg: 4.2,
    deliveryAvg: 3.8,
    responseAvg: 4.3,
    priceAvg: 3.5,
    overallAvg: 4.0,
  },
  {
    id: 4,
    year: "2025",
    quarter: "4분기",
    qualityAvg: 4.3,
    deliveryAvg: 4.0,
    responseAvg: 4.5,
    priceAvg: 3.6,
    overallAvg: 4.1,
  },
  {
    id: 5,
    year: "2026",
    quarter: "1분기",
    qualityAvg: 4.5,
    deliveryAvg: 3.5,
    responseAvg: 4.5,
    priceAvg: 3.5,
    overallAvg: 4.0,
  },
  {
    id: 6,
    year: "2026",
    quarter: "2분기",
    qualityAvg: 4.0,
    deliveryAvg: 4.0,
    responseAvg: 5.0,
    priceAvg: 3.0,
    overallAvg: 4.0,
  },
];

// Initial improvement actions
const initialImprovements: ImprovementAction[] = [
  {
    id: 1,
    surveyId: 1,
    category: "납기",
    issue: "긴급 주문 시 납기 지연 발생",
    action: "안전재고 확보 및 생산계획 유연성 강화",
    responsiblePerson: "생산팀 이생산",
    dueDate: "2026-06-30",
    status: "진행중",
  },
  {
    id: 2,
    surveyId: 1,
    category: "가격",
    issue: "경쟁사 대비 가격 경쟁력 부족",
    action: "원가절감 TF 구성 및 VE 활동 추진",
    responsiblePerson: "구매팀 최구매",
    dueDate: "2026-07-31",
    status: "계획",
  },
  {
    id: 3,
    surveyId: 3,
    category: "가격",
    issue: "단가 인하 요청에 대한 대응 필요",
    action: "공정 개선을 통한 원가 절감 방안 수립",
    responsiblePerson: "기술팀 박기술",
    dueDate: "2026-08-15",
    status: "계획",
  },
];

// Score labels
const scoreLabels: Record<number, string> = {
  1: "매우 불만족",
  2: "불만족",
  3: "보통",
  4: "만족",
  5: "매우 만족",
};

export default function CustomerSatisfactionPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [surveys, setSurveys] = useState<SurveyRegistration[]>(initialSurveys);
  const [scores, setScores] = useState<SurveyScores[]>(initialScores);
  const [trends] = useState<TrendData[]>(initialTrends);
  const [improvements, setImprovements] = useState<ImprovementAction[]>(initialImprovements);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [showImprovementForm, setShowImprovementForm] = useState(false);

  // New survey form data
  const [newSurvey, setNewSurvey] = useState({
    surveyDate: "",
    surveyYear: "2026",
    surveyQuarter: "1분기",
    customer: "",
    manager: "",
    surveyMethod: "방문",
  });

  // New score form data
  const [newScore, setNewScore] = useState({
    surveyId: 0,
    qualityScore: 3,
    deliveryScore: 3,
    responseScore: 3,
    priceScore: 3,
  });

  // New improvement form data
  const [newImprovement, setNewImprovement] = useState({
    surveyId: 0,
    category: "품질",
    issue: "",
    action: "",
    responsiblePerson: "",
    dueDate: "",
    status: "계획",
  });

  // Handle survey registration
  const handleAddSurvey = () => {
    if (newSurvey.surveyDate && newSurvey.customer && newSurvey.manager) {
      const newId = surveys.length + 1;
      setSurveys([...surveys, { ...newSurvey, id: newId }]);
      setNewSurvey({
        surveyDate: "",
        surveyYear: "2026",
        surveyQuarter: "1분기",
        customer: "",
        manager: "",
        surveyMethod: "방문",
      });
      setShowSurveyForm(false);
    }
  };

  // Handle score submission
  const handleAddScore = () => {
    if (newScore.surveyId > 0) {
      const totalScore =
        newScore.qualityScore +
        newScore.deliveryScore +
        newScore.responseScore +
        newScore.priceScore;
      const newId = scores.length + 1;
      setScores([...scores, { ...newScore, id: newId, totalScore }]);
      setNewScore({
        surveyId: 0,
        qualityScore: 3,
        deliveryScore: 3,
        responseScore: 3,
        priceScore: 3,
      });
      setShowScoreForm(false);
    }
  };

  // Handle improvement action
  const handleAddImprovement = () => {
    if (newImprovement.issue && newImprovement.action && newImprovement.responsiblePerson) {
      const newId = improvements.length + 1;
      setImprovements([...improvements, { ...newImprovement, id: newId }]);
      setNewImprovement({
        surveyId: 0,
        category: "품질",
        issue: "",
        action: "",
        responsiblePerson: "",
        dueDate: "",
        status: "계획",
      });
      setShowImprovementForm(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
      완료: "success",
      진행중: "warning",
      계획: "secondary",
      지연: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  // Get score badge
  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return <Badge variant="success">우수</Badge>;
    if (score >= 3.5) return <Badge variant="warning">양호</Badge>;
    if (score >= 2.5) return <Badge variant="secondary">보통</Badge>;
    return <Badge variant="destructive">미흡</Badge>;
  };

  // Get survey by ID
  const getSurveyById = (id: number) => {
    return surveys.find((s) => s.id === id);
  };

  // Score selector component
  const ScoreSelector = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (val: number) => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              value === score
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {score}
          </button>
        ))}
        <span className="ml-3 text-sm text-muted-foreground w-24">
          {scoreLabels[value]}
        </span>
      </div>
    </div>
  );

  // Simple bar chart component
  const SimpleBarChart = ({ data, label }: { data: number; label: string }) => {
    const percentage = (data / 5) * 100;
    return (
      <div className="flex items-center gap-2">
        <span className="w-20 text-sm">{label}</span>
        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-10 text-sm font-medium">{data.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">고객만족도 조사</h1>
        <p className="text-muted-foreground">고객만족도 조사 현황 관리</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            만족도 조사 등록
          </TabsTrigger>
          <TabsTrigger value="scores" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            설문 항목별 점수
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            만족도 추이
          </TabsTrigger>
          <TabsTrigger value="improvements" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            개선 활동
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Survey Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                만족도 조사 등록
              </CardTitle>
              <Button onClick={() => setShowSurveyForm(!showSurveyForm)}>
                <Plus className="mr-2 h-4 w-4" />
                조사 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showSurveyForm && (
                <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                  <h4 className="font-medium">신규 조사 등록</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="surveyDate">조사일</Label>
                      <Input
                        id="surveyDate"
                        type="date"
                        value={newSurvey.surveyDate}
                        onChange={(e) =>
                          setNewSurvey({ ...newSurvey, surveyDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surveyYear">조사년도</Label>
                      <Select
                        value={newSurvey.surveyYear}
                        onValueChange={(value) =>
                          setNewSurvey({ ...newSurvey, surveyYear: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="년도 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}년
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surveyQuarter">분기</Label>
                      <Select
                        value={newSurvey.surveyQuarter}
                        onValueChange={(value) =>
                          setNewSurvey({ ...newSurvey, surveyQuarter: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="분기 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {quarterOptions.map((quarter) => (
                            <SelectItem key={quarter} value={quarter}>
                              {quarter}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer">고객사</Label>
                      <Input
                        id="customer"
                        value={newSurvey.customer}
                        onChange={(e) =>
                          setNewSurvey({ ...newSurvey, customer: e.target.value })
                        }
                        placeholder="예: 현대자동차"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manager">담당자</Label>
                      <Input
                        id="manager"
                        value={newSurvey.manager}
                        onChange={(e) =>
                          setNewSurvey({ ...newSurvey, manager: e.target.value })
                        }
                        placeholder="담당자명"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surveyMethod">조사방법</Label>
                      <Select
                        value={newSurvey.surveyMethod}
                        onValueChange={(value) =>
                          setNewSurvey({ ...newSurvey, surveyMethod: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="조사방법 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {surveyMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSurveyForm(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddSurvey}>
                      <Save className="mr-2 h-4 w-4" />
                      등록
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>조사번호</TableHead>
                    <TableHead>조사일</TableHead>
                    <TableHead>조사년도/분기</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>조사방법</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell className="font-medium">CS-{survey.id.toString().padStart(3, "0")}</TableCell>
                      <TableCell>{formatDate(survey.surveyDate)}</TableCell>
                      <TableCell>{survey.surveyYear}년 {survey.surveyQuarter}</TableCell>
                      <TableCell>{survey.customer}</TableCell>
                      <TableCell>{survey.manager}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{survey.surveyMethod}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Scores by Question */}
        <TabsContent value="scores">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  설문 항목별 점수
                </CardTitle>
                <Button onClick={() => setShowScoreForm(!showScoreForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  점수 입력
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {showScoreForm && (
                  <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                    <h4 className="font-medium">점수 입력</h4>
                    <div className="space-y-2">
                      <Label>조사 선택</Label>
                      <Select
                        value={newScore.surveyId.toString()}
                        onValueChange={(value) =>
                          setNewScore({ ...newScore, surveyId: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="조사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {surveys.map((survey) => (
                            <SelectItem key={survey.id} value={survey.id.toString()}>
                              CS-{survey.id.toString().padStart(3, "0")} - {survey.customer} ({survey.surveyYear} {survey.surveyQuarter})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <ScoreSelector
                        label="품질 만족도"
                        value={newScore.qualityScore}
                        onChange={(val) => setNewScore({ ...newScore, qualityScore: val })}
                      />
                      <ScoreSelector
                        label="납기 만족도"
                        value={newScore.deliveryScore}
                        onChange={(val) => setNewScore({ ...newScore, deliveryScore: val })}
                      />
                      <ScoreSelector
                        label="대응 만족도"
                        value={newScore.responseScore}
                        onChange={(val) => setNewScore({ ...newScore, responseScore: val })}
                      />
                      <ScoreSelector
                        label="가격 만족도"
                        value={newScore.priceScore}
                        onChange={(val) => setNewScore({ ...newScore, priceScore: val })}
                      />
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">종합 점수</span>
                        <span className="text-2xl font-bold">
                          {newScore.qualityScore + newScore.deliveryScore + newScore.responseScore + newScore.priceScore} / 20
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">평균</span>
                        <span className="text-lg font-medium">
                          {((newScore.qualityScore + newScore.deliveryScore + newScore.responseScore + newScore.priceScore) / 4).toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowScoreForm(false)}>
                        취소
                      </Button>
                      <Button onClick={handleAddScore}>
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>조사번호</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead className="text-center">품질 만족도</TableHead>
                      <TableHead className="text-center">납기 만족도</TableHead>
                      <TableHead className="text-center">대응 만족도</TableHead>
                      <TableHead className="text-center">가격 만족도</TableHead>
                      <TableHead className="text-center">종합 점수</TableHead>
                      <TableHead className="text-center">평균</TableHead>
                      <TableHead className="text-center">평가</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score) => {
                      const survey = getSurveyById(score.surveyId);
                      const avg = score.totalScore / 4;
                      return (
                        <TableRow key={score.id}>
                          <TableCell className="font-medium">
                            CS-{score.surveyId.toString().padStart(3, "0")}
                          </TableCell>
                          <TableCell>{survey?.customer || "-"}</TableCell>
                          <TableCell className="text-center">{score.qualityScore}</TableCell>
                          <TableCell className="text-center">{score.deliveryScore}</TableCell>
                          <TableCell className="text-center">{score.responseScore}</TableCell>
                          <TableCell className="text-center">{score.priceScore}</TableCell>
                          <TableCell className="text-center font-medium">{score.totalScore}</TableCell>
                          <TableCell className="text-center">{avg.toFixed(1)}</TableCell>
                          <TableCell className="text-center">{getScoreBadge(avg)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Satisfaction Trends */}
        <TabsContent value="trends">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  분기별 만족도 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trends.map((trend) => (
                    <div key={trend.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">{trend.year}년 {trend.quarter}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">종합 평균:</span>
                          <span className="text-lg font-bold">{trend.overallAvg.toFixed(1)}</span>
                          {getScoreBadge(trend.overallAvg)}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <SimpleBarChart data={trend.qualityAvg} label="품질" />
                        <SimpleBarChart data={trend.deliveryAvg} label="납기" />
                        <SimpleBarChart data={trend.responseAvg} label="대응" />
                        <SimpleBarChart data={trend.priceAvg} label="가격" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  년간 추이 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-center">품질</TableHead>
                      <TableHead className="text-center">납기</TableHead>
                      <TableHead className="text-center">대응</TableHead>
                      <TableHead className="text-center">가격</TableHead>
                      <TableHead className="text-center">종합 평균</TableHead>
                      <TableHead className="text-center">평가</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trends.map((trend) => (
                      <TableRow key={trend.id}>
                        <TableCell className="font-medium">{trend.year}년 {trend.quarter}</TableCell>
                        <TableCell className="text-center">{trend.qualityAvg.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{trend.deliveryAvg.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{trend.responseAvg.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{trend.priceAvg.toFixed(1)}</TableCell>
                        <TableCell className="text-center font-medium">{trend.overallAvg.toFixed(1)}</TableCell>
                        <TableCell className="text-center">{getScoreBadge(trend.overallAvg)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Improvement Actions */}
        <TabsContent value="improvements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                개선 활동
              </CardTitle>
              <Button onClick={() => setShowImprovementForm(!showImprovementForm)}>
                <Plus className="mr-2 h-4 w-4" />
                개선활동 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showImprovementForm && (
                <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                  <h4 className="font-medium">개선활동 등록</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>관련 조사</Label>
                      <Select
                        value={newImprovement.surveyId.toString()}
                        onValueChange={(value) =>
                          setNewImprovement({ ...newImprovement, surveyId: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="조사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {surveys.map((survey) => (
                            <SelectItem key={survey.id} value={survey.id.toString()}>
                              CS-{survey.id.toString().padStart(3, "0")} - {survey.customer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>개선 영역</Label>
                      <Select
                        value={newImprovement.category}
                        onValueChange={(value) =>
                          setNewImprovement({ ...newImprovement, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="영역 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="품질">품질</SelectItem>
                          <SelectItem value="납기">납기</SelectItem>
                          <SelectItem value="대응">대응</SelectItem>
                          <SelectItem value="가격">가격</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>개선 필요 사항</Label>
                    <Textarea
                      value={newImprovement.issue}
                      onChange={(e) =>
                        setNewImprovement({ ...newImprovement, issue: e.target.value })
                      }
                      placeholder="고객 불만족 사항 또는 개선이 필요한 내용"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>개선 조치 계획</Label>
                    <Textarea
                      value={newImprovement.action}
                      onChange={(e) =>
                        setNewImprovement({ ...newImprovement, action: e.target.value })
                      }
                      placeholder="구체적인 개선 조치 계획"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Input
                        value={newImprovement.responsiblePerson}
                        onChange={(e) =>
                          setNewImprovement({ ...newImprovement, responsiblePerson: e.target.value })
                        }
                        placeholder="부서 담당자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>완료 예정일</Label>
                      <Input
                        type="date"
                        value={newImprovement.dueDate}
                        onChange={(e) =>
                          setNewImprovement({ ...newImprovement, dueDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={newImprovement.status}
                        onValueChange={(value) =>
                          setNewImprovement({ ...newImprovement, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="계획">계획</SelectItem>
                          <SelectItem value="진행중">진행중</SelectItem>
                          <SelectItem value="완료">완료</SelectItem>
                          <SelectItem value="지연">지연</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowImprovementForm(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddImprovement}>
                      <Save className="mr-2 h-4 w-4" />
                      등록
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>조사번호</TableHead>
                    <TableHead>개선 영역</TableHead>
                    <TableHead>개선 필요 사항</TableHead>
                    <TableHead>개선 조치 계획</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>완료 예정일</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {improvements.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        CS-{item.surveyId.toString().padStart(3, "0")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">{item.issue}</TableCell>
                      <TableCell className="max-w-[200px]">{item.action}</TableCell>
                      <TableCell>{item.responsiblePerson}</TableCell>
                      <TableCell>{formatDate(item.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
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
