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
  BookOpen,
  Search,
  Save,
  Plus,
  FileText,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Star,
  Eye,
  GraduationCap,
} from "lucide-react";

// Types
interface Knowledge {
  id: number;
  knowledgeNo: string;
  registrationDate: string;
  type: "기술" | "품질" | "공정" | "노하우" | "교훈";
  name: string;
  content: string;
  source: "내부경험" | "외부교육" | "벤치마킹" | "클레임";
  relatedProcess: string;
  registrant: string;
  utilizations: number;
  linkedTrainings: number;
  createdAt: string;
}

interface LessonLearned {
  id: number;
  lessonNo: string;
  registrationDate: string;
  category: "클레임" | "부적합" | "개선사례" | "모범사례";
  title: string;
  background: string;
  lesson: string;
  countermeasure: string;
  relatedProcess: string;
  registrant: string;
  createdAt: string;
}

// Sample data
const sampleKnowledge: Knowledge[] = [
  {
    id: 1,
    knowledgeNo: "KN-2026-001",
    registrationDate: "2026-06-01",
    type: "기술",
    name: "사출 성형 최적 온도 조건",
    content: "PP 소재 사출 시 금형 온도 85-90도, 실린더 온도 220-230도가 최적",
    source: "내부경험",
    relatedProcess: "사출공정",
    registrant: "김기술",
    utilizations: 15,
    linkedTrainings: 3,
    createdAt: "2026-06-01T09:00:00",
  },
  {
    id: 2,
    knowledgeNo: "KN-2026-002",
    registrationDate: "2026-06-03",
    type: "품질",
    name: "도장 불량 예방 관리 포인트",
    content: "도장 전 표면 전처리 시 탈지 시간 3분 이상 유지, 수세 후 완전 건조 필수",
    source: "클레임",
    relatedProcess: "도장공정",
    registrant: "이품질",
    utilizations: 22,
    linkedTrainings: 5,
    createdAt: "2026-06-03T14:30:00",
  },
  {
    id: 3,
    knowledgeNo: "KN-2026-003",
    registrationDate: "2026-06-05",
    type: "노하우",
    name: "금형 세척 주기 최적화",
    content: "생산량 5000개 단위로 금형 세척 시 불량률 0.1% 이하 유지 가능",
    source: "내부경험",
    relatedProcess: "금형관리",
    registrant: "박노하우",
    utilizations: 8,
    linkedTrainings: 2,
    createdAt: "2026-06-05T11:00:00",
  },
];

const sampleLessons: LessonLearned[] = [
  {
    id: 1,
    lessonNo: "LL-2026-001",
    registrationDate: "2026-05-15",
    category: "클레임",
    title: "범퍼 도장 박리 재발 방지",
    background: "현대자동차향 범퍼 도장 박리 클레임 발생 (5건)",
    lesson: "PP 소재 플라즈마 처리 누락 시 부착력 저하",
    countermeasure: "플라즈마 처리 공정 체크시트 추가, 작업자 교육 실시",
    relatedProcess: "도장공정",
    registrant: "김품질",
    createdAt: "2026-05-15T10:00:00",
  },
  {
    id: 2,
    lessonNo: "LL-2026-002",
    registrationDate: "2026-05-20",
    category: "개선사례",
    title: "사출 사이클 타임 단축",
    background: "생산성 향상 프로젝트에서 사출 사이클 타임 개선 필요",
    lesson: "냉각 채널 최적화로 사이클 타임 15% 단축 가능",
    countermeasure: "금형 냉각 채널 재설계 및 적용",
    relatedProcess: "사출공정",
    registrant: "이개선",
    createdAt: "2026-05-20T14:00:00",
  },
  {
    id: 3,
    lessonNo: "LL-2026-003",
    registrationDate: "2026-06-01",
    category: "모범사례",
    title: "5S 활동 우수 사례",
    background: "도장라인 5S 활동 결과 품질 및 안전 지표 개선",
    lesson: "정기적 5S 점검 및 시각화 관리로 이물 불량 50% 감소",
    countermeasure: "월간 5S 평가제도 전사 확대 적용",
    relatedProcess: "도장공정",
    registrant: "박모범",
    createdAt: "2026-06-01T09:00:00",
  },
];

// Generate knowledge number
const generateKnowledgeNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `KN-${year}-${random}`;
};

// Generate lesson number
const generateLessonNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `LL-${year}-${random}`;
};

export default function KnowledgeManagementPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>(sampleKnowledge);
  const [lessonList, setLessonList] = useState<LessonLearned[]>(sampleLessons);

  // Search states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [processFilter, setProcessFilter] = useState("");

  // Registration form state
  const [knowledgeForm, setKnowledgeForm] = useState({
    knowledgeNo: generateKnowledgeNo(),
    registrationDate: new Date().toISOString().split("T")[0],
    type: "" as Knowledge["type"] | "",
    name: "",
    content: "",
    source: "" as Knowledge["source"] | "",
    relatedProcess: "",
    registrant: "",
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    lessonNo: generateLessonNo(),
    registrationDate: new Date().toISOString().split("T")[0],
    category: "" as LessonLearned["category"] | "",
    title: "",
    background: "",
    lesson: "",
    countermeasure: "",
    relatedProcess: "",
    registrant: "",
  });

  // Constants
  const knowledgeTypes: Knowledge["type"][] = ["기술", "품질", "공정", "노하우", "교훈"];
  const sourceTypes: Knowledge["source"][] = ["내부경험", "외부교육", "벤치마킹", "클레임"];
  const lessonCategories: LessonLearned["category"][] = ["클레임", "부적합", "개선사례", "모범사례"];
  const processes = ["사출공정", "도장공정", "조립공정", "검사공정", "금형관리", "설비관리", "품질관리", "기타"];

  // Type badge colors
  const getTypeBadgeVariant = (type: string) => {
    const variants: Record<string, "default" | "outline" | "success" | "warning" | "error" | "destructive"> = {
      기술: "default",
      품질: "success",
      공정: "warning",
      노하우: "outline",
      교훈: "error",
    };
    return variants[type] || "outline";
  };

  // Category badge colors
  const getCategoryBadgeVariant = (category: string) => {
    const variants: Record<string, "default" | "outline" | "success" | "warning" | "error" | "destructive"> = {
      클레임: "destructive",
      부적합: "error",
      개선사례: "success",
      모범사례: "default",
    };
    return variants[category] || "outline";
  };

  // Filter knowledge
  const filteredKnowledge = knowledgeList.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      k.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      k.knowledgeNo.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = !typeFilter || k.type === typeFilter;
    const matchesProcess = !processFilter || k.relatedProcess === processFilter;
    return matchesSearch && matchesType && matchesProcess;
  });

  // Handle knowledge registration
  const handleKnowledgeSubmit = () => {
    if (!knowledgeForm.name || !knowledgeForm.type || !knowledgeForm.content || !knowledgeForm.source || !knowledgeForm.registrant) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newKnowledge: Knowledge = {
      id: Date.now(),
      knowledgeNo: knowledgeForm.knowledgeNo,
      registrationDate: knowledgeForm.registrationDate,
      type: knowledgeForm.type as Knowledge["type"],
      name: knowledgeForm.name,
      content: knowledgeForm.content,
      source: knowledgeForm.source as Knowledge["source"],
      relatedProcess: knowledgeForm.relatedProcess,
      registrant: knowledgeForm.registrant,
      utilizations: 0,
      linkedTrainings: 0,
      createdAt: new Date().toISOString(),
    };

    setKnowledgeList([newKnowledge, ...knowledgeList]);
    setKnowledgeForm({
      knowledgeNo: generateKnowledgeNo(),
      registrationDate: new Date().toISOString().split("T")[0],
      type: "",
      name: "",
      content: "",
      source: "",
      relatedProcess: "",
      registrant: "",
    });

    alert("지식이 등록되었습니다.");
    setActiveTab("search");
  };

  // Handle lesson registration
  const handleLessonSubmit = () => {
    if (!lessonForm.title || !lessonForm.category || !lessonForm.lesson || !lessonForm.registrant) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newLesson: LessonLearned = {
      id: Date.now(),
      lessonNo: lessonForm.lessonNo,
      registrationDate: lessonForm.registrationDate,
      category: lessonForm.category as LessonLearned["category"],
      title: lessonForm.title,
      background: lessonForm.background,
      lesson: lessonForm.lesson,
      countermeasure: lessonForm.countermeasure,
      relatedProcess: lessonForm.relatedProcess,
      registrant: lessonForm.registrant,
      createdAt: new Date().toISOString(),
    };

    setLessonList([newLesson, ...lessonList]);
    setLessonForm({
      lessonNo: generateLessonNo(),
      registrationDate: new Date().toISOString().split("T")[0],
      category: "",
      title: "",
      background: "",
      lesson: "",
      countermeasure: "",
      relatedProcess: "",
      registrant: "",
    });

    alert("교훈이 등록되었습니다.");
  };

  // Calculate utilization statistics
  const totalKnowledge = knowledgeList.length;
  const totalUtilizations = knowledgeList.reduce((sum, k) => sum + k.utilizations, 0);
  const totalLinkedTrainings = knowledgeList.reduce((sum, k) => sum + k.linkedTrainings, 0);
  const avgUtilization = totalKnowledge > 0 ? (totalUtilizations / totalKnowledge).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">지식관리</h1>
          <p className="text-muted-foreground">IATF 16949 조직 지식 관리 (7.1.6)</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">지식 등록</TabsTrigger>
          <TabsTrigger value="search">지식 검색</TabsTrigger>
          <TabsTrigger value="utilization">활용 현황</TabsTrigger>
          <TabsTrigger value="lessons">교훈 관리</TabsTrigger>
        </TabsList>

        {/* Tab 1: Knowledge Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                지식 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>지식번호</Label>
                    <Input value={knowledgeForm.knowledgeNo} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>등록일 *</Label>
                    <Input
                      type="date"
                      value={knowledgeForm.registrationDate}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, registrationDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>지식유형 *</Label>
                    <Select
                      value={knowledgeForm.type}
                      onValueChange={(v) => setKnowledgeForm({ ...knowledgeForm, type: v as Knowledge["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {knowledgeTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Knowledge Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">지식 내용</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>지식명 *</Label>
                    <Input
                      value={knowledgeForm.name}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, name: e.target.value })}
                      placeholder="지식 제목을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>내용 *</Label>
                    <Textarea
                      value={knowledgeForm.content}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, content: e.target.value })}
                      placeholder="지식 내용을 상세히 기술하세요"
                      rows={5}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Source & Process */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">출처 및 관련 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>출처 *</Label>
                    <Select
                      value={knowledgeForm.source}
                      onValueChange={(v) => setKnowledgeForm({ ...knowledgeForm, source: v as Knowledge["source"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="출처 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypes.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>관련 프로세스</Label>
                    <Select
                      value={knowledgeForm.relatedProcess}
                      onValueChange={(v) => setKnowledgeForm({ ...knowledgeForm, relatedProcess: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="프로세스 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {processes.map((process) => (
                          <SelectItem key={process} value={process}>
                            {process}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>등록자 *</Label>
                    <Input
                      value={knowledgeForm.registrant}
                      onChange={(e) => setKnowledgeForm({ ...knowledgeForm, registrant: e.target.value })}
                      placeholder="등록자명 입력"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleKnowledgeSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  지식 등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Knowledge Search */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                지식 검색
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search Filters */}
              <div className="space-y-4 mb-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="키워드로 검색..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="유형별 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체 유형</SelectItem>
                      {knowledgeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={processFilter} onValueChange={setProcessFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="프로세스별 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체 프로세스</SelectItem>
                      {processes.map((process) => (
                        <SelectItem key={process} value={process}>
                          {process}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Badge variant={typeFilter === "" ? "default" : "outline"} className="cursor-pointer" onClick={() => setTypeFilter("")}>
                    전체
                  </Badge>
                  {knowledgeTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={typeFilter === type ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setTypeFilter(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Knowledge List */}
              {filteredKnowledge.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">검색 결과가 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {filteredKnowledge.map((knowledge) => (
                    <Card key={knowledge.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={getTypeBadgeVariant(knowledge.type)}>{knowledge.type}</Badge>
                              <span className="text-sm text-muted-foreground font-mono">{knowledge.knowledgeNo}</span>
                            </div>
                            <h4 className="font-semibold">{knowledge.name}</h4>
                            <p className="text-sm text-muted-foreground">{knowledge.content}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>출처: {knowledge.source}</span>
                              <span>프로세스: {knowledge.relatedProcess || "-"}</span>
                              <span>등록자: {knowledge.registrant}</span>
                              <span>등록일: {knowledge.registrationDate}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              <span>{knowledge.utilizations}회 활용</span>
                            </div>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-1 h-3 w-3" />
                              상세보기
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Utilization Status */}
        <TabsContent value="utilization">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 지식 건수</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalKnowledge}</div>
                  <p className="text-xs text-muted-foreground">등록된 지식</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 활용 건수</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUtilizations}</div>
                  <p className="text-xs text-muted-foreground">누적 활용</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 활용률</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgUtilization}회</div>
                  <p className="text-xs text-muted-foreground">지식당 평균</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">교육 연계</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLinkedTrainings}</div>
                  <p className="text-xs text-muted-foreground">교육 연계 건수</p>
                </CardContent>
              </Card>
            </div>

            {/* Utilization by Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  지식별 활용 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>지식번호</TableHead>
                      <TableHead>지식명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>활용 건수</TableHead>
                      <TableHead>교육 연계</TableHead>
                      <TableHead>효과</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {knowledgeList
                      .sort((a, b) => b.utilizations - a.utilizations)
                      .map((knowledge) => (
                        <TableRow key={knowledge.id}>
                          <TableCell className="font-mono text-sm">{knowledge.knowledgeNo}</TableCell>
                          <TableCell>{knowledge.name}</TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(knowledge.type)}>{knowledge.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${Math.min((knowledge.utilizations / 30) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{knowledge.utilizations}회</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{knowledge.linkedTrainings}건</Badge>
                          </TableCell>
                          <TableCell>
                            {knowledge.utilizations >= 15 ? (
                              <Badge variant="success">높음</Badge>
                            ) : knowledge.utilizations >= 5 ? (
                              <Badge variant="warning">보통</Badge>
                            ) : (
                              <Badge variant="outline">낮음</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Utilization by Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  유형별 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  {knowledgeTypes.map((type) => {
                    const typeKnowledge = knowledgeList.filter((k) => k.type === type);
                    const typeCount = typeKnowledge.length;
                    const typeUtilizations = typeKnowledge.reduce((sum, k) => sum + k.utilizations, 0);
                    return (
                      <Card key={type}>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getTypeBadgeVariant(type)}>{type}</Badge>
                          </div>
                          <div className="text-2xl font-bold">{typeCount}건</div>
                          <p className="text-xs text-muted-foreground">활용: {typeUtilizations}회</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Lessons Learned */}
        <TabsContent value="lessons">
          <div className="space-y-6">
            {/* Lesson Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  교훈 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>교훈번호</Label>
                    <Input value={lessonForm.lessonNo} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>등록일 *</Label>
                    <Input
                      type="date"
                      value={lessonForm.registrationDate}
                      onChange={(e) => setLessonForm({ ...lessonForm, registrationDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>분류 *</Label>
                    <Select
                      value={lessonForm.category}
                      onValueChange={(v) => setLessonForm({ ...lessonForm, category: v as LessonLearned["category"] })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="분류 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {lessonCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>관련 프로세스</Label>
                    <Select
                      value={lessonForm.relatedProcess}
                      onValueChange={(v) => setLessonForm({ ...lessonForm, relatedProcess: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="프로세스 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {processes.map((process) => (
                          <SelectItem key={process} value={process}>
                            {process}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>제목 *</Label>
                  <Input
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="교훈 제목을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>배경/발생 경위</Label>
                  <Textarea
                    value={lessonForm.background}
                    onChange={(e) => setLessonForm({ ...lessonForm, background: e.target.value })}
                    placeholder="문제 발생 배경이나 상황을 기술하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>교훈 내용 *</Label>
                  <Textarea
                    value={lessonForm.lesson}
                    onChange={(e) => setLessonForm({ ...lessonForm, lesson: e.target.value })}
                    placeholder="얻은 교훈을 기술하세요"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>대응책/조치사항</Label>
                  <Textarea
                    value={lessonForm.countermeasure}
                    onChange={(e) => setLessonForm({ ...lessonForm, countermeasure: e.target.value })}
                    placeholder="수행한 대응책이나 조치사항을 기술하세요"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>등록자 *</Label>
                    <Input
                      value={lessonForm.registrant}
                      onChange={(e) => setLessonForm({ ...lessonForm, registrant: e.target.value })}
                      placeholder="등록자명 입력"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleLessonSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    교훈 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lessons List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  교훈 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {lessonCategories.map((cat) => {
                    const icon =
                      cat === "클레임" ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : cat === "모범사례" ? (
                        <Star className="h-3 w-3 mr-1" />
                      ) : cat === "개선사례" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : null;
                    return (
                      <Badge key={cat} variant={getCategoryBadgeVariant(cat)} className="cursor-pointer">
                        {icon}
                        {cat} ({lessonList.filter((l) => l.category === cat).length})
                      </Badge>
                    );
                  })}
                </div>

                {lessonList.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 교훈이 없습니다.</p>
                ) : (
                  <div className="space-y-4">
                    {lessonList.map((lesson) => (
                      <Card key={lesson.id} className="border-l-4" style={{
                        borderLeftColor:
                          lesson.category === "클레임"
                            ? "hsl(var(--destructive))"
                            : lesson.category === "모범사례"
                            ? "hsl(var(--primary))"
                            : lesson.category === "개선사례"
                            ? "hsl(142.1 76.2% 36.3%)"
                            : "hsl(var(--warning))",
                      }}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant={getCategoryBadgeVariant(lesson.category)}>{lesson.category}</Badge>
                                <span className="text-sm text-muted-foreground font-mono">{lesson.lessonNo}</span>
                              </div>
                              <h4 className="font-semibold">{lesson.title}</h4>
                              {lesson.background && (
                                <div className="text-sm">
                                  <span className="font-medium text-muted-foreground">배경: </span>
                                  {lesson.background}
                                </div>
                              )}
                              <div className="text-sm">
                                <span className="font-medium text-muted-foreground">교훈: </span>
                                {lesson.lesson}
                              </div>
                              {lesson.countermeasure && (
                                <div className="text-sm">
                                  <span className="font-medium text-muted-foreground">대응책: </span>
                                  {lesson.countermeasure}
                                </div>
                              )}
                              <div className="flex gap-4 text-sm text-muted-foreground pt-2">
                                <span>프로세스: {lesson.relatedProcess || "-"}</span>
                                <span>등록자: {lesson.registrant}</span>
                                <span>등록일: {lesson.registrationDate}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
