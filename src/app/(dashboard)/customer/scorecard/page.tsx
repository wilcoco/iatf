"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Plus, Save, Trash2, Search, TrendingUp, Award, BarChart3 } from "lucide-react";

// ---------------------------------------------------------------------------
// 타입 정의
// ---------------------------------------------------------------------------
interface EvalItem {
  id: number;
  item: string; // 평가항목
  method: string; // 평가방법
  maxScore: number; // 배점
  gotScore: number; // 획득점수
  note: string; // 비고
}

interface StarItem {
  id: number;
  item: string; // 평가항목
  maxScore: number; // 배점
  gotScore: number; // 점수
  note: string; // 비고
}

interface TrendRow {
  id: number;
  period: string; // 분기/반기
  grade: number; // 별 개수
  score: number; // 점수
}

// ---------------------------------------------------------------------------
// 헬퍼
// ---------------------------------------------------------------------------
const renderStars = (n: number): string => "★".repeat(n) + "☆".repeat(Math.max(0, 5 - n));

const gradeFromRate = (rate: number): number => {
  if (rate >= 95) return 5;
  if (rate >= 90) return 4;
  if (rate >= 80) return 3;
  if (rate >= 70) return 2;
  if (rate >= 60) return 1;
  return 0;
};

const gradeLabel = (n: number): string => {
  switch (n) {
    case 5:
      return "최우수";
    case 4:
      return "우수";
    case 3:
      return "양호";
    case 2:
      return "보통";
    case 1:
      return "미흡";
    default:
      return "부적합";
  }
};

// ---------------------------------------------------------------------------
// 초기 데이터 (실제 고객평가표 기반 샘플)
// ---------------------------------------------------------------------------
const initialEvalItems: EvalItem[] = [
  { id: 1, item: "설문지조사", method: "고객 만족도 설문 평가", maxScore: 42, gotScore: 38, note: "분기 설문 회신 반영" },
  { id: 2, item: "고객불만접수", method: "접수 건수 / 처리 실적", maxScore: 28, gotScore: 28, note: "무클레임 유지" },
  { id: 3, item: "납입율", method: "납기 준수율 (%)", maxScore: 30, gotScore: 30, note: "100% 달성" },
];

const initialStarItems: StarItem[] = [
  { id: 1, item: "입고불량 (상반기)", maxScore: 25, gotScore: 24.5, note: "ppm 기준" },
  { id: 2, item: "입고불량 (하반기)", maxScore: 25, gotScore: 23.8, note: "ppm 기준" },
  { id: 3, item: "클레임변제율", maxScore: 20, gotScore: 18.0, note: "변제 금액 비율" },
  { id: 4, item: "현장평가", maxScore: 30, gotScore: 20.35, note: "정기 현장심사" },
  { id: 5, item: "외주사관리", maxScore: 10, gotScore: 9.0, note: "협력사 관리 실적" },
];

const initialTrend: TrendRow[] = [
  { id: 1, period: "2024 상반기", grade: 3, score: 82.4 },
  { id: 2, period: "2024 하반기", grade: 4, score: 90.1 },
  { id: 3, period: "2025 상반기", grade: 4, score: 91.7 },
  { id: 4, period: "2025 하반기", grade: 4, score: 95.65 },
];

// ---------------------------------------------------------------------------
// 페이지
// ---------------------------------------------------------------------------
export default function CustomerScorecardPage() {
  const [activeTab, setActiveTab] = useState("eval");

  // 고객평가표 상태
  const [customer, setCustomer] = useState("현대자동차");
  const [evalYear, setEvalYear] = useState("2025");
  const [evalItems, setEvalItems] = useState<EvalItem[]>(initialEvalItems);
  const [evalMemo, setEvalMemo] = useState("");

  // 품질5스타 상태
  const [starSupplier, setStarSupplier] = useState("캠스");
  const [starItems, setStarItems] = useState<StarItem[]>(initialStarItems);
  const [prevGrade] = useState(3);
  const [trend] = useState<TrendRow[]>(initialTrend);

  // -------------------------------------------------------------------------
  // 계산: 고객평가표
  // -------------------------------------------------------------------------
  const evalTotals = useMemo(() => {
    const max = evalItems.reduce((s, r) => s + r.maxScore, 0);
    const got = evalItems.reduce((s, r) => s + r.gotScore, 0);
    const rate = max > 0 ? (got / max) * 100 : 0;
    return { max, got, rate, grade: gradeFromRate(rate) };
  }, [evalItems]);

  // -------------------------------------------------------------------------
  // 계산: 품질5스타
  // -------------------------------------------------------------------------
  const starTotals = useMemo(() => {
    const max = starItems.reduce((s, r) => s + r.maxScore, 0);
    const got = starItems.reduce((s, r) => s + r.gotScore, 0);
    const rate = max > 0 ? (got / max) * 100 : 0;
    return { max, got, rate, grade: gradeFromRate(rate) };
  }, [starItems]);

  // -------------------------------------------------------------------------
  // 핸들러: 고객평가표
  // -------------------------------------------------------------------------
  const updateEvalScore = (id: number, value: number) => {
    setEvalItems((prev) => prev.map((r) => (r.id === id ? { ...r, gotScore: value } : r)));
  };

  const addEvalRow = () => {
    const nextId = evalItems.length ? Math.max(...evalItems.map((r) => r.id)) + 1 : 1;
    setEvalItems((prev) => [
      ...prev,
      { id: nextId, item: "신규 항목", method: "", maxScore: 0, gotScore: 0, note: "" },
    ]);
  };

  const removeEvalRow = (id: number) => {
    setEvalItems((prev) => prev.filter((r) => r.id !== id));
  };

  // -------------------------------------------------------------------------
  // 핸들러: 품질5스타
  // -------------------------------------------------------------------------
  const updateStarScore = (id: number, value: number) => {
    setStarItems((prev) => prev.map((r) => (r.id === id ? { ...r, gotScore: value } : r)));
  };

  const removeStarRow = (id: number) => {
    setStarItems((prev) => prev.filter((r) => r.id !== id));
  };

  // -------------------------------------------------------------------------
  // 렌더
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">고객 스코어카드</h1>
        <p className="text-muted-foreground mt-1">
          고객평가표 배점/획득점수 관리 및 품질5스타(SQ) 등급 산정 · 추이 관리
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="eval">
                <BarChart3 className="mr-2 h-4 w-4" />
                고객평가표
              </TabsTrigger>
              <TabsTrigger value="star">
                <Star className="mr-2 h-4 w-4" />
                품질5스타 등급
              </TabsTrigger>
            </TabsList>

            {/* ============================= 탭1: 고객평가표 ============================= */}
            <TabsContent value="eval" className="space-y-6 pt-4">
              {/* 조건 선택 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>고객사</Label>
                  <Select value={customer} onValueChange={setCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="고객사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="현대자동차">현대자동차</SelectItem>
                      <SelectItem value="기아">기아</SelectItem>
                      <SelectItem value="현대모비스">현대모비스</SelectItem>
                      <SelectItem value="현대위아">현대위아</SelectItem>
                      <SelectItem value="만도">만도</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>평가년도</Label>
                  <Select value={evalYear} onValueChange={setEvalYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="년도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023년</SelectItem>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2026">2026년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" className="flex-1">
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                  <Button className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </div>

              {/* 평가항목 테이블 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>평가항목별 배점 / 획득점수</CardTitle>
                  <Button size="sm" variant="outline" onClick={addEvalRow}>
                    <Plus className="mr-2 h-4 w-4" />
                    항목 추가
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">항목</TableHead>
                        <TableHead>평가방법</TableHead>
                        <TableHead className="text-right">배점</TableHead>
                        <TableHead className="text-right">획득점수</TableHead>
                        <TableHead>비고</TableHead>
                        <TableHead className="w-[60px] text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evalItems.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.item}</TableCell>
                          <TableCell className="text-muted-foreground">{row.method}</TableCell>
                          <TableCell className="text-right">{row.maxScore}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="ml-auto w-24 text-right"
                              value={row.gotScore}
                              onChange={(e) => updateEvalScore(row.id, Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{row.note}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeEvalRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={2}>TOTAL</TableCell>
                        <TableCell className="text-right">{evalTotals.max}</TableCell>
                        <TableCell className="text-right">{evalTotals.got}</TableCell>
                        <TableCell colSpan={2}>
                          달성률 {evalTotals.rate.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 종합 요약 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">종합점수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {evalTotals.got}
                      <span className="text-base text-muted-foreground"> / {evalTotals.max}</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      달성률 {evalTotals.rate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">품질 5스타</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl tracking-widest text-amber-500">
                      {renderStars(evalTotals.grade)}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {gradeLabel(evalTotals.grade)} 등급
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      등급 결과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="text-base">
                      {customer} · {evalYear}년
                    </Badge>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {evalTotals.grade}성 / 5성
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 메모 */}
              <div className="space-y-2">
                <Label>평가 메모</Label>
                <Textarea
                  placeholder="고객평가 관련 특이사항을 입력하세요."
                  value={evalMemo}
                  onChange={(e) => setEvalMemo(e.target.value)}
                />
              </div>
            </TabsContent>

            {/* ============================= 탭2: 품질5스타 등급 ============================= */}
            <TabsContent value="star" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>대상 공급사</Label>
                  <Select value={starSupplier} onValueChange={setStarSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="공급사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="캠스">캠스</SelectItem>
                      <SelectItem value="에스엘">에스엘</SelectItem>
                      <SelectItem value="평화발레오">평화발레오</SelectItem>
                      <SelectItem value="화신">화신</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2 md:col-span-2">
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    등급 산정
                  </Button>
                </div>
              </div>

              {/* 평가항목별 배점/점수 */}
              <Card>
                <CardHeader>
                  <CardTitle>평가항목별 배점 / 점수</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>평가항목</TableHead>
                        <TableHead className="text-right">배점</TableHead>
                        <TableHead className="text-right">점수</TableHead>
                        <TableHead>비고</TableHead>
                        <TableHead className="w-[60px] text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {starItems.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.item}</TableCell>
                          <TableCell className="text-right">{row.maxScore.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              step="0.01"
                              className="ml-auto w-24 text-right"
                              value={row.gotScore}
                              onChange={(e) => updateStarScore(row.id, Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{row.note}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeStarRow(row.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell>합계</TableCell>
                        <TableCell className="text-right">{starTotals.max.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{starTotals.got.toFixed(2)}</TableCell>
                        <TableCell colSpan={2}>
                          달성률 {starTotals.rate.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 등급 결과 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">등급결과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl tracking-widest text-amber-500">
                      {renderStars(starTotals.grade)}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {starTotals.got.toFixed(2)}점 · {gradeLabel(starTotals.grade)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">이전등급</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-base tracking-widest">
                      {renderStars(prevGrade)}
                    </Badge>
                    <div className="mt-2 text-sm text-muted-foreground">
                      직전 평가 {prevGrade}성
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      금번등급
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="text-base tracking-widest">
                      {renderStars(starTotals.grade)}
                    </Badge>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {starTotals.grade > prevGrade
                        ? `↑ ${starTotals.grade - prevGrade}성 상승`
                        : starTotals.grade < prevGrade
                          ? `↓ ${prevGrade - starTotals.grade}성 하락`
                          : "등급 유지"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 등급 추이 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    등급 추이 (분기/반기별)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>기간</TableHead>
                        <TableHead className="text-right">점수</TableHead>
                        <TableHead className="text-center">등급</TableHead>
                        <TableHead>판정</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trend.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.period}</TableCell>
                          <TableCell className="text-right">{row.score.toFixed(2)}</TableCell>
                          <TableCell className="text-center tracking-widest text-amber-500">
                            {renderStars(row.grade)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{gradeLabel(row.grade)}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
