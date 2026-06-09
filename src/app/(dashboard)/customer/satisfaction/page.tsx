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
  BarChart3,
  TrendingUp,
  History,
  Star,
  AlertCircle,
} from "lucide-react";

// Survey info interface
interface SurveyInfo {
  surveyNo: string;
  surveyPeriodStart: string;
  surveyPeriodEnd: string;
  targetCustomer: string;
  manager: string;
}

// Satisfaction scores (5-point scale)
interface SatisfactionScores {
  // Product Quality
  appearance: number;
  functionality: number;
  reliability: number;
  // Delivery
  deliveryCompliance: number;
  emergencyResponse: number;
  // Service
  technicalSupport: number;
  claimResponse: number;
  communication: number;
  // Price
  priceLevel: number;
  costReductionCooperation: number;
}

// Improvement action
interface ImprovementAction {
  id: number;
  unsatisfiedItem: string;
  improvementPlan: string;
  responsibleDept: string;
  dueDate: string;
  status: string;
}

// Survey history
interface SurveyHistory {
  id: number;
  surveyNo: string;
  surveyDate: string;
  customer: string;
  totalScore: number;
  avgScore: number;
  previousAvg: number;
  change: number;
}

// Initial data
const initialSurveyInfo: SurveyInfo = {
  surveyNo: "CS-2026-001",
  surveyPeriodStart: "2026-06-01",
  surveyPeriodEnd: "2026-06-30",
  targetCustomer: "현대자동차",
  manager: "김품질",
};

const initialScores: SatisfactionScores = {
  appearance: 4,
  functionality: 5,
  reliability: 4,
  deliveryCompliance: 3,
  emergencyResponse: 4,
  technicalSupport: 5,
  claimResponse: 4,
  communication: 4,
  priceLevel: 3,
  costReductionCooperation: 4,
};

const initialImprovements: ImprovementAction[] = [
  {
    id: 1,
    unsatisfiedItem: "납기준수",
    improvementPlan: "생산계획 시스템 개선 및 실시간 모니터링 강화",
    responsibleDept: "생산관리팀",
    dueDate: "2026-07-31",
    status: "진행중",
  },
  {
    id: 2,
    unsatisfiedItem: "가격수준",
    improvementPlan: "원가절감 TF 구성 및 VE 활동 추진",
    responsibleDept: "구매팀",
    dueDate: "2026-08-15",
    status: "계획",
  },
];

const initialHistory: SurveyHistory[] = [
  {
    id: 1,
    surveyNo: "CS-2025-001",
    surveyDate: "2025-06-15",
    customer: "현대자동차",
    totalScore: 38,
    avgScore: 3.8,
    previousAvg: 3.5,
    change: 0.3,
  },
  {
    id: 2,
    surveyNo: "CS-2025-002",
    surveyDate: "2025-12-10",
    customer: "현대자동차",
    totalScore: 40,
    avgScore: 4.0,
    previousAvg: 3.8,
    change: 0.2,
  },
  {
    id: 3,
    surveyNo: "CS-2026-001",
    surveyDate: "2026-06-01",
    customer: "현대자동차",
    totalScore: 40,
    avgScore: 4.0,
    previousAvg: 4.0,
    change: 0.0,
  },
];

const scoreLabels: Record<number, string> = {
  1: "매우 불만족",
  2: "불만족",
  3: "보통",
  4: "만족",
  5: "매우 만족",
};

export default function CustomerSatisfactionPage() {
  const [activeTab, setActiveTab] = useState("info");
  const [surveyInfo, setSurveyInfo] = useState<SurveyInfo>(initialSurveyInfo);
  const [scores, setScores] = useState<SatisfactionScores>(initialScores);
  const [improvements, setImprovements] =
    useState<ImprovementAction[]>(initialImprovements);
  const [history] = useState<SurveyHistory[]>(initialHistory);
  const [newImprovement, setNewImprovement] = useState({
    unsatisfiedItem: "",
    improvementPlan: "",
    responsibleDept: "",
    dueDate: "",
    status: "계획",
  });

  // Calculate scores
  const calculateCategoryScores = () => {
    const productQuality =
      (scores.appearance + scores.functionality + scores.reliability) / 3;
    const delivery =
      (scores.deliveryCompliance + scores.emergencyResponse) / 2;
    const service =
      (scores.technicalSupport + scores.claimResponse + scores.communication) /
      3;
    const price = (scores.priceLevel + scores.costReductionCooperation) / 2;
    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    const average = total / 10;

    return { productQuality, delivery, service, price, total, average };
  };

  const categoryScores = calculateCategoryScores();

  const handleScoreChange = (key: keyof SatisfactionScores, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddImprovement = () => {
    if (
      newImprovement.unsatisfiedItem &&
      newImprovement.improvementPlan &&
      newImprovement.responsibleDept
    ) {
      setImprovements((prev) => [
        ...prev,
        {
          ...newImprovement,
          id: prev.length + 1,
        },
      ]);
      setNewImprovement({
        unsatisfiedItem: "",
        improvementPlan: "",
        responsibleDept: "",
        dueDate: "",
        status: "계획",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "secondary"> = {
      완료: "success",
      진행중: "warning",
      계획: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 4.5) return <Badge variant="success">우수</Badge>;
    if (score >= 3.5) return <Badge variant="warning">양호</Badge>;
    if (score >= 2.5) return <Badge variant="secondary">보통</Badge>;
    return <Badge variant="destructive">미흡</Badge>;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0)
      return <span className="text-green-600">+{change.toFixed(1)}</span>;
    if (change < 0) return <span className="text-red-600">{change.toFixed(1)}</span>;
    return <span className="text-gray-500">-</span>;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">고객만족도 조사</h1>
        <p className="text-muted-foreground">
          고객만족도 조사 및 분석 관리
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            조사 기본정보
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            만족도 평가
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            분석 결과
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            조사 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Survey Basic Info */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                조사 기본정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="surveyNo">조사번호</Label>
                  <Input
                    id="surveyNo"
                    value={surveyInfo.surveyNo}
                    onChange={(e) =>
                      setSurveyInfo({ ...surveyInfo, surveyNo: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">담당자</Label>
                  <Input
                    id="manager"
                    value={surveyInfo.manager}
                    onChange={(e) =>
                      setSurveyInfo({ ...surveyInfo, manager: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="surveyPeriodStart">조사기간 (시작)</Label>
                  <Input
                    id="surveyPeriodStart"
                    type="date"
                    value={surveyInfo.surveyPeriodStart}
                    onChange={(e) =>
                      setSurveyInfo({
                        ...surveyInfo,
                        surveyPeriodStart: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surveyPeriodEnd">조사기간 (종료)</Label>
                  <Input
                    id="surveyPeriodEnd"
                    type="date"
                    value={surveyInfo.surveyPeriodEnd}
                    onChange={(e) =>
                      setSurveyInfo({
                        ...surveyInfo,
                        surveyPeriodEnd: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetCustomer">조사대상고객</Label>
                <Input
                  id="targetCustomer"
                  value={surveyInfo.targetCustomer}
                  onChange={(e) =>
                    setSurveyInfo({
                      ...surveyInfo,
                      targetCustomer: e.target.value,
                    })
                  }
                  placeholder="조사 대상 고객사명"
                />
              </div>
              <div className="flex justify-end">
                <Button>정보 저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Satisfaction Scoring */}
        <TabsContent value="scoring">
          <div className="space-y-6">
            {/* Product Quality */}
            <Card>
              <CardHeader>
                <CardTitle>제품품질</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreSelector
                  label="외관"
                  value={scores.appearance}
                  onChange={(val) => handleScoreChange("appearance", val)}
                />
                <ScoreSelector
                  label="기능"
                  value={scores.functionality}
                  onChange={(val) => handleScoreChange("functionality", val)}
                />
                <ScoreSelector
                  label="신뢰성"
                  value={scores.reliability}
                  onChange={(val) => handleScoreChange("reliability", val)}
                />
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card>
              <CardHeader>
                <CardTitle>납기</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreSelector
                  label="납기준수"
                  value={scores.deliveryCompliance}
                  onChange={(val) => handleScoreChange("deliveryCompliance", val)}
                />
                <ScoreSelector
                  label="긴급대응"
                  value={scores.emergencyResponse}
                  onChange={(val) => handleScoreChange("emergencyResponse", val)}
                />
              </CardContent>
            </Card>

            {/* Service */}
            <Card>
              <CardHeader>
                <CardTitle>서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreSelector
                  label="기술지원"
                  value={scores.technicalSupport}
                  onChange={(val) => handleScoreChange("technicalSupport", val)}
                />
                <ScoreSelector
                  label="클레임대응"
                  value={scores.claimResponse}
                  onChange={(val) => handleScoreChange("claimResponse", val)}
                />
                <ScoreSelector
                  label="의사소통"
                  value={scores.communication}
                  onChange={(val) => handleScoreChange("communication", val)}
                />
              </CardContent>
            </Card>

            {/* Price */}
            <Card>
              <CardHeader>
                <CardTitle>가격</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreSelector
                  label="가격수준"
                  value={scores.priceLevel}
                  onChange={(val) => handleScoreChange("priceLevel", val)}
                />
                <ScoreSelector
                  label="원가절감협력"
                  value={scores.costReductionCooperation}
                  onChange={(val) =>
                    handleScoreChange("costReductionCooperation", val)
                  }
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>평가 저장</Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Analysis Results */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  조사결과 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">총점</p>
                    <p className="text-3xl font-bold">
                      {categoryScores.total}
                    </p>
                    <p className="text-sm text-muted-foreground">/ 50점</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">평균점수</p>
                    <p className="text-3xl font-bold">
                      {categoryScores.average.toFixed(1)}
                    </p>
                    {getScoreBadge(categoryScores.average)}
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">전년 평균</p>
                    <p className="text-3xl font-bold">4.0</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">전년대비</p>
                    <p className="text-3xl font-bold">
                      {getChangeIndicator(categoryScores.average - 4.0)}
                    </p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>평가항목</TableHead>
                      <TableHead>세부항목</TableHead>
                      <TableHead className="text-center">점수</TableHead>
                      <TableHead className="text-center">카테고리 평균</TableHead>
                      <TableHead className="text-center">평가</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell rowSpan={3} className="font-medium">
                        제품품질
                      </TableCell>
                      <TableCell>외관</TableCell>
                      <TableCell className="text-center">{scores.appearance}</TableCell>
                      <TableCell rowSpan={3} className="text-center font-medium">
                        {categoryScores.productQuality.toFixed(1)}
                      </TableCell>
                      <TableCell rowSpan={3} className="text-center">
                        {getScoreBadge(categoryScores.productQuality)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>기능</TableCell>
                      <TableCell className="text-center">{scores.functionality}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>신뢰성</TableCell>
                      <TableCell className="text-center">{scores.reliability}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell rowSpan={2} className="font-medium">
                        납기
                      </TableCell>
                      <TableCell>납기준수</TableCell>
                      <TableCell className="text-center">{scores.deliveryCompliance}</TableCell>
                      <TableCell rowSpan={2} className="text-center font-medium">
                        {categoryScores.delivery.toFixed(1)}
                      </TableCell>
                      <TableCell rowSpan={2} className="text-center">
                        {getScoreBadge(categoryScores.delivery)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>긴급대응</TableCell>
                      <TableCell className="text-center">{scores.emergencyResponse}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell rowSpan={3} className="font-medium">
                        서비스
                      </TableCell>
                      <TableCell>기술지원</TableCell>
                      <TableCell className="text-center">{scores.technicalSupport}</TableCell>
                      <TableCell rowSpan={3} className="text-center font-medium">
                        {categoryScores.service.toFixed(1)}
                      </TableCell>
                      <TableCell rowSpan={3} className="text-center">
                        {getScoreBadge(categoryScores.service)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>클레임대응</TableCell>
                      <TableCell className="text-center">{scores.claimResponse}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>의사소통</TableCell>
                      <TableCell className="text-center">{scores.communication}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell rowSpan={2} className="font-medium">
                        가격
                      </TableCell>
                      <TableCell>가격수준</TableCell>
                      <TableCell className="text-center">{scores.priceLevel}</TableCell>
                      <TableCell rowSpan={2} className="text-center font-medium">
                        {categoryScores.price.toFixed(1)}
                      </TableCell>
                      <TableCell rowSpan={2} className="text-center">
                        {getScoreBadge(categoryScores.price)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>원가절감협력</TableCell>
                      <TableCell className="text-center">
                        {scores.costReductionCooperation}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Improvement Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  개선조치
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>불만족항목</TableHead>
                      <TableHead>개선계획</TableHead>
                      <TableHead>담당부서</TableHead>
                      <TableHead>완료예정일</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {improvements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.unsatisfiedItem}
                        </TableCell>
                        <TableCell>{item.improvementPlan}</TableCell>
                        <TableCell>{item.responsibleDept}</TableCell>
                        <TableCell>{formatDate(item.dueDate)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 border rounded-lg space-y-4">
                  <h4 className="font-medium">개선조치 추가</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>불만족항목</Label>
                      <Input
                        value={newImprovement.unsatisfiedItem}
                        onChange={(e) =>
                          setNewImprovement({
                            ...newImprovement,
                            unsatisfiedItem: e.target.value,
                          })
                        }
                        placeholder="개선이 필요한 항목"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>담당부서</Label>
                      <Input
                        value={newImprovement.responsibleDept}
                        onChange={(e) =>
                          setNewImprovement({
                            ...newImprovement,
                            responsibleDept: e.target.value,
                          })
                        }
                        placeholder="담당 부서"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>개선계획</Label>
                    <Textarea
                      value={newImprovement.improvementPlan}
                      onChange={(e) =>
                        setNewImprovement({
                          ...newImprovement,
                          improvementPlan: e.target.value,
                        })
                      }
                      placeholder="개선 계획 상세 내용"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>완료예정일</Label>
                      <Input
                        type="date"
                        value={newImprovement.dueDate}
                        onChange={(e) =>
                          setNewImprovement({
                            ...newImprovement,
                            dueDate: e.target.value,
                          })
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleAddImprovement}>추가</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Survey History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                조사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>조사번호</TableHead>
                    <TableHead>조사일자</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead className="text-center">총점</TableHead>
                    <TableHead className="text-center">평균</TableHead>
                    <TableHead className="text-center">전회 평균</TableHead>
                    <TableHead className="text-center">변동</TableHead>
                    <TableHead className="text-center">평가</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.surveyNo}
                      </TableCell>
                      <TableCell>{formatDate(item.surveyDate)}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell className="text-center">{item.totalScore}</TableCell>
                      <TableCell className="text-center">
                        {item.avgScore.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.previousAvg.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getChangeIndicator(item.change)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getScoreBadge(item.avgScore)}
                      </TableCell>
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
