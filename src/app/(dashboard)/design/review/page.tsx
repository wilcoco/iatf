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
import { Plus, Save, FileText, History, ClipboardList, CheckCircle, Calendar, Trash2 } from "lucide-react";

// ==================== Types ====================
interface ReviewPlan {
  reviewNo: string;
  reviewDate: string;
  projectName: string;
  customerName: string;
  reviewPhase: string;
  participants: string;
}

interface ReviewItem {
  id: string;
  category: string;
  item: string;
  result: "pass" | "fail" | "needs-improvement" | "";
  remarks: string;
}

interface ReviewResult {
  overallResult: "approved" | "conditionally-approved" | "rejected" | "";
  issues: IssueItem[];
  followUpActions: string;
  nextReviewDate: string;
}

interface IssueItem {
  id: string;
  issueNo: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: "open" | "inProgress" | "closed";
}

interface HistoryItem {
  id: string;
  reviewNo: string;
  reviewDate: string;
  projectName: string;
  reviewPhase: string;
  overallResult: string;
  reviewer: string;
}

// ==================== Review Items Data ====================
const reviewCategories = [
  {
    category: "설계 요구사항 충족 여부",
    items: [
      "고객 요구사항 반영 여부",
      "법규/규격 요구사항 충족",
      "내부 기술 기준 만족",
    ],
  },
  {
    category: "기능/성능 검토",
    items: [
      "기능 요구사항 달성 여부",
      "성능 목표 달성 여부",
      "내구성/신뢰성 검토",
      "안전성 검토",
    ],
  },
  {
    category: "제조 가능성",
    items: [
      "기존 공정 활용 가능성",
      "특수 공정 필요 여부",
      "설비/치공구 검토",
      "조립 용이성",
    ],
  },
  {
    category: "품질/신뢰성",
    items: [
      "품질 목표 달성 가능성",
      "검사 방법 적정성",
      "불량 예방 대책",
      "시험 계획 적정성",
    ],
  },
  {
    category: "원가",
    items: [
      "목표 원가 달성 가능성",
      "원가 절감 방안",
      "투자비 검토",
    ],
  },
  {
    category: "일정",
    items: [
      "개발 일정 준수 가능성",
      "시작품 제작 일정",
      "양산 이관 일정",
    ],
  },
];

const getInitialReviewItems = (): ReviewItem[] => {
  const items: ReviewItem[] = [];
  let idx = 0;
  reviewCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      items.push({
        id: `item-${idx++}`,
        category: cat.category,
        item: item,
        result: "",
        remarks: "",
      });
    });
  });
  return items;
};

// ==================== Main Component ====================
export default function DesignReviewPage() {
  const [activeTab, setActiveTab] = useState("plan");

  // Tab 1: Review Plan State
  const [reviewPlan, setReviewPlan] = useState<ReviewPlan>({
    reviewNo: "",
    reviewDate: "",
    projectName: "",
    customerName: "",
    reviewPhase: "",
    participants: "",
  });

  // Tab 2: Review Items State
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(getInitialReviewItems());

  // Tab 3: Review Result State
  const [reviewResult, setReviewResult] = useState<ReviewResult>({
    overallResult: "",
    issues: [],
    followUpActions: "",
    nextReviewDate: "",
  });
  const [newIssue, setNewIssue] = useState({
    description: "",
    responsible: "",
    dueDate: "",
  });

  // Tab 4: History State
  const [historyList, setHistoryList] = useState<HistoryItem[]>([
    {
      id: "hist-1",
      reviewNo: "DR-2026-001",
      reviewDate: "2026-05-15",
      projectName: "EV Motor Controller",
      reviewPhase: "상세설계",
      overallResult: "승인",
      reviewer: "김품질",
    },
    {
      id: "hist-2",
      reviewNo: "DR-2026-002",
      reviewDate: "2026-05-20",
      projectName: "Battery Pack Housing",
      reviewPhase: "개념검토",
      overallResult: "조건부승인",
      reviewer: "이설계",
    },
    {
      id: "hist-3",
      reviewNo: "DR-2026-003",
      reviewDate: "2026-06-01",
      projectName: "Power Module Assembly",
      reviewPhase: "시작품",
      overallResult: "승인",
      reviewer: "박개발",
    },
  ]);

  // ==================== Status/Label Helpers ====================
  const resultLabels: Record<string, string> = {
    pass: "적합",
    fail: "부적합",
    "needs-improvement": "보완필요",
  };

  const resultVariants: Record<string, "success" | "destructive" | "warning" | "default"> = {
    pass: "success",
    fail: "destructive",
    "needs-improvement": "warning",
  };

  const overallResultLabels: Record<string, string> = {
    approved: "승인",
    "conditionally-approved": "조건부승인",
    rejected: "불승인",
  };

  const overallResultVariants: Record<string, "success" | "warning" | "destructive"> = {
    approved: "success",
    "conditionally-approved": "warning",
    rejected: "destructive",
  };

  const issueStatusLabels: Record<string, string> = {
    open: "미착수",
    inProgress: "진행중",
    closed: "완료",
  };

  const issueStatusVariants: Record<string, "default" | "warning" | "success"> = {
    open: "default",
    inProgress: "warning",
    closed: "success",
  };

  const phaseOptions = [
    { value: "concept", label: "개념검토" },
    { value: "detail", label: "상세설계" },
    { value: "prototype", label: "시작품" },
    { value: "production", label: "양산이관" },
  ];

  // ==================== Handlers ====================
  const handlePlanChange = (field: keyof ReviewPlan, value: string) => {
    setReviewPlan({ ...reviewPlan, [field]: value });
  };

  const handleReviewItemChange = (id: string, field: keyof ReviewItem, value: string) => {
    setReviewItems(
      reviewItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleResultChange = (field: keyof ReviewResult, value: string) => {
    setReviewResult({ ...reviewResult, [field]: value });
  };

  const addIssue = () => {
    if (!newIssue.description.trim()) return;
    const issue: IssueItem = {
      id: `issue-${Date.now()}`,
      issueNo: `ISS-${String(reviewResult.issues.length + 1).padStart(3, "0")}`,
      description: newIssue.description,
      responsible: newIssue.responsible,
      dueDate: newIssue.dueDate,
      status: "open",
    };
    setReviewResult({
      ...reviewResult,
      issues: [...reviewResult.issues, issue],
    });
    setNewIssue({ description: "", responsible: "", dueDate: "" });
  };

  const handleIssueStatusChange = (id: string, status: string) => {
    setReviewResult({
      ...reviewResult,
      issues: reviewResult.issues.map((issue) =>
        issue.id === id ? { ...issue, status: status as IssueItem["status"] } : issue
      ),
    });
  };

  const deleteIssue = (id: string) => {
    setReviewResult({
      ...reviewResult,
      issues: reviewResult.issues.filter((issue) => issue.id !== id),
    });
  };

  const handleSave = () => {
    // Add to history
    if (reviewPlan.reviewNo && reviewPlan.reviewDate) {
      const newHistory: HistoryItem = {
        id: `hist-${Date.now()}`,
        reviewNo: reviewPlan.reviewNo,
        reviewDate: reviewPlan.reviewDate,
        projectName: reviewPlan.projectName,
        reviewPhase: phaseOptions.find((p) => p.value === reviewPlan.reviewPhase)?.label || "",
        overallResult: overallResultLabels[reviewResult.overallResult] || "진행중",
        reviewer: "현재 사용자",
      };
      setHistoryList([newHistory, ...historyList]);
    }
    alert("설계검토 정보가 저장되었습니다.");
  };

  // ==================== Computed Values ====================
  const getItemsByCategory = (category: string) => {
    return reviewItems.filter((item) => item.category === category);
  };

  const getCategoryProgress = (category: string) => {
    const items = getItemsByCategory(category);
    const evaluated = items.filter((item) => item.result !== "").length;
    return items.length > 0 ? Math.round((evaluated / items.length) * 100) : 0;
  };

  const getCategoryPassRate = (category: string) => {
    const items = getItemsByCategory(category);
    const passed = items.filter((item) => item.result === "pass").length;
    const evaluated = items.filter((item) => item.result !== "").length;
    return evaluated > 0 ? Math.round((passed / evaluated) * 100) : 0;
  };

  const totalEvaluated = reviewItems.filter((item) => item.result !== "").length;
  const totalPassed = reviewItems.filter((item) => item.result === "pass").length;
  const totalFailed = reviewItems.filter((item) => item.result === "fail").length;
  const totalNeedsImprovement = reviewItems.filter((item) => item.result === "needs-improvement").length;

  // ==================== Render ====================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설계검토</h1>
          <p className="text-muted-foreground">IATF 16949 Design Review Management</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">
            <Calendar className="mr-2 h-4 w-4" />
            설계검토 계획
          </TabsTrigger>
          <TabsTrigger value="items">
            <ClipboardList className="mr-2 h-4 w-4" />
            검토 항목
          </TabsTrigger>
          <TabsTrigger value="result">
            <CheckCircle className="mr-2 h-4 w-4" />
            검토 결과
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            설계검토 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Review Plan */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                설계검토 계획
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>검토번호 *</Label>
                  <Input
                    value={reviewPlan.reviewNo}
                    onChange={(e) => handlePlanChange("reviewNo", e.target.value)}
                    placeholder="DR-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>검토일 *</Label>
                  <Input
                    type="date"
                    value={reviewPlan.reviewDate}
                    onChange={(e) => handlePlanChange("reviewDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>프로젝트명 *</Label>
                  <Input
                    value={reviewPlan.projectName}
                    onChange={(e) => handlePlanChange("projectName", e.target.value)}
                    placeholder="프로젝트명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>고객사 *</Label>
                  <Input
                    value={reviewPlan.customerName}
                    onChange={(e) => handlePlanChange("customerName", e.target.value)}
                    placeholder="고객사명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>검토단계 *</Label>
                  <Select
                    value={reviewPlan.reviewPhase}
                    onValueChange={(value) => handlePlanChange("reviewPhase", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="검토단계 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {phaseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>참석자</Label>
                  <Input
                    value={reviewPlan.participants}
                    onChange={(e) => handlePlanChange("participants", e.target.value)}
                    placeholder="참석자 (쉼표로 구분)"
                  />
                </div>
              </div>

              {/* Review Plan Summary */}
              <div className="mt-8 rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-4 font-semibold">검토 정보 요약</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">검토번호</p>
                    <p className="font-medium">{reviewPlan.reviewNo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">검토일</p>
                    <p className="font-medium">{reviewPlan.reviewDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">검토단계</p>
                    <p className="font-medium">
                      {phaseOptions.find((p) => p.value === reviewPlan.reviewPhase)?.label || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">프로젝트명</p>
                    <p className="font-medium">{reviewPlan.projectName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">고객사</p>
                    <p className="font-medium">{reviewPlan.customerName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">참석자</p>
                    <p className="font-medium">{reviewPlan.participants || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Review Items */}
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                검토 항목
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress Summary */}
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">총 항목</p>
                    <p className="text-2xl font-bold">{reviewItems.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-green-700">적합</p>
                    <p className="text-2xl font-bold text-green-700">{totalPassed}</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-red-700">부적합</p>
                    <p className="text-2xl font-bold text-red-700">{totalFailed}</p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-yellow-700">보완필요</p>
                    <p className="text-2xl font-bold text-yellow-700">{totalNeedsImprovement}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Review Items by Category */}
              <div className="space-y-6">
                {reviewCategories.map((cat) => (
                  <div key={cat.category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{cat.category}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          평가: {getCategoryProgress(cat.category)}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          적합률: {getCategoryPassRate(cat.category)}%
                        </span>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">검토 항목</TableHead>
                          <TableHead className="w-[20%]">판정</TableHead>
                          <TableHead>비고</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getItemsByCategory(cat.category).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.item}</TableCell>
                            <TableCell>
                              <Select
                                value={item.result}
                                onValueChange={(value) =>
                                  handleReviewItemChange(item.id, "result", value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pass">적합</SelectItem>
                                  <SelectItem value="fail">부적합</SelectItem>
                                  <SelectItem value="needs-improvement">보완필요</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.remarks}
                                onChange={(e) =>
                                  handleReviewItemChange(item.id, "remarks", e.target.value)
                                }
                                placeholder="비고 입력"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Review Result */}
        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                검토 결과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Overall Result */}
              <div className="space-y-4">
                <h3 className="font-semibold">종합판정</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>종합 판정 결과 *</Label>
                    <Select
                      value={reviewResult.overallResult}
                      onValueChange={(value) => handleResultChange("overallResult", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="판정 결과 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">승인</SelectItem>
                        <SelectItem value="conditionally-approved">조건부승인</SelectItem>
                        <SelectItem value="rejected">불승인</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    {reviewResult.overallResult && (
                      <Badge
                        variant={overallResultVariants[reviewResult.overallResult]}
                        className="text-lg px-4 py-2"
                      >
                        {overallResultLabels[reviewResult.overallResult]}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Review Summary */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-3 font-medium">검토 결과 요약</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">평가 완료</p>
                      <p className="text-xl font-bold">
                        {totalEvaluated} / {reviewItems.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-600">적합</p>
                      <p className="text-xl font-bold text-green-600">{totalPassed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-red-600">부적합</p>
                      <p className="text-xl font-bold text-red-600">{totalFailed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-yellow-600">보완필요</p>
                      <p className="text-xl font-bold text-yellow-600">{totalNeedsImprovement}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues and Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold">지적사항 및 조치</h3>

                {/* Add Issue Form */}
                <div className="rounded-lg border p-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label>지적사항</Label>
                      <Input
                        value={newIssue.description}
                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                        placeholder="지적사항 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Input
                        value={newIssue.responsible}
                        onChange={(e) => setNewIssue({ ...newIssue, responsible: e.target.value })}
                        placeholder="담당자"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>완료예정일</Label>
                      <Input
                        type="date"
                        value={newIssue.dueDate}
                        onChange={(e) => setNewIssue({ ...newIssue, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={addIssue}>
                      <Plus className="mr-2 h-4 w-4" />
                      추가
                    </Button>
                  </div>
                </div>

                {/* Issues Table */}
                {reviewResult.issues.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>지적사항</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>완료예정일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewResult.issues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>{issue.issueNo}</TableCell>
                          <TableCell>{issue.description}</TableCell>
                          <TableCell>{issue.responsible}</TableCell>
                          <TableCell>{issue.dueDate}</TableCell>
                          <TableCell>
                            <Select
                              value={issue.status}
                              onValueChange={(value) => handleIssueStatusChange(issue.id, value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">미착수</SelectItem>
                                <SelectItem value="inProgress">진행중</SelectItem>
                                <SelectItem value="closed">완료</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteIssue(issue.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Follow-up Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold">후속조치 필요사항</h3>
                <Textarea
                  value={reviewResult.followUpActions}
                  onChange={(e) => handleResultChange("followUpActions", e.target.value)}
                  placeholder="후속조치가 필요한 사항을 입력하세요..."
                  rows={4}
                />
              </div>

              {/* Next Review Date */}
              <div className="space-y-4">
                <h3 className="font-semibold">다음 검토 일정</h3>
                <div className="md:w-1/4">
                  <Input
                    type="date"
                    value={reviewResult.nextReviewDate}
                    onChange={(e) => handleResultChange("nextReviewDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Review History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                설계검토 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyList.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  등록된 설계검토 이력이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검토번호</TableHead>
                      <TableHead>검토일</TableHead>
                      <TableHead>프로젝트명</TableHead>
                      <TableHead>검토단계</TableHead>
                      <TableHead>종합판정</TableHead>
                      <TableHead>검토자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyList.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{item.reviewNo}</TableCell>
                        <TableCell>{item.reviewDate}</TableCell>
                        <TableCell>{item.projectName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.reviewPhase}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.overallResult === "승인"
                                ? "success"
                                : item.overallResult === "조건부승인"
                                ? "warning"
                                : item.overallResult === "불승인"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {item.overallResult}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.reviewer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* History Summary */}
              <div className="mt-8 grid gap-4 md:grid-cols-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-muted-foreground">총 검토 건수</p>
                    <p className="text-2xl font-bold">{historyList.length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-green-700">승인</p>
                    <p className="text-2xl font-bold text-green-700">
                      {historyList.filter((h) => h.overallResult === "승인").length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-yellow-700">조건부승인</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {historyList.filter((h) => h.overallResult === "조건부승인").length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="pt-4 text-center">
                    <p className="text-sm text-red-700">불승인</p>
                    <p className="text-2xl font-bold text-red-700">
                      {historyList.filter((h) => h.overallResult === "불승인").length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
