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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, FileText, ClipboardCheck, Award, History, Building2, Calculator } from "lucide-react";

// Types
interface BasicInfo {
  auditDate: string;
  auditNumber: string;
  supplierName: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  contactNumber: string;
  auditType: string;
  auditorName: string;
}

interface EvaluationCategory {
  name: string;
  maxScore: number;
  items: EvaluationItem[];
}

interface EvaluationItem {
  id: string;
  name: string;
  maxScore: number;
  score: number;
}

interface AuditResult {
  totalScore: number;
  grade: string;
  improvementRequirements: string;
  generalOpinion: string;
  approvalStatus: string;
  approvalDate: string;
  approvedBy: string;
}

interface AuditHistoryRecord {
  id: number;
  auditNumber: string;
  auditDate: string;
  supplierName: string;
  auditType: string;
  totalScore: number;
  grade: string;
  approvalStatus: string;
}

// Grade calculation helper
const getGrade = (score: number): string => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  return "D";
};

const getGradeBadgeVariant = (grade: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (grade) {
    case "A": return "default";
    case "B": return "secondary";
    case "C": return "outline";
    case "D": return "destructive";
    default: return "outline";
  }
};

const getGradeBadgeClass = (grade: string): string => {
  switch (grade) {
    case "A": return "bg-green-100 text-green-800";
    case "B": return "bg-blue-100 text-blue-800";
    case "C": return "bg-yellow-100 text-yellow-800";
    case "D": return "bg-red-100 text-red-800";
    default: return "";
  }
};

export default function SupplierAuditPage() {
  const [activeTab, setActiveTab] = useState("basic");

  // Basic info state
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    auditDate: new Date().toISOString().split("T")[0],
    auditNumber: "",
    supplierName: "",
    ceoName: "",
    businessNumber: "",
    address: "",
    contactNumber: "",
    auditType: "",
    auditorName: "",
  });

  // Evaluation categories state
  const [evaluationCategories, setEvaluationCategories] = useState<EvaluationCategory[]>([
    {
      name: "품질시스템",
      maxScore: 20,
      items: [
        { id: "qs1", name: "품질경영시스템 인증(ISO 9001/IATF 16949)", maxScore: 5, score: 0 },
        { id: "qs2", name: "품질매뉴얼/절차서 구비", maxScore: 5, score: 0 },
        { id: "qs3", name: "내부심사 운영", maxScore: 5, score: 0 },
        { id: "qs4", name: "경영검토 실시", maxScore: 5, score: 0 },
      ],
    },
    {
      name: "품질관리능력",
      maxScore: 30,
      items: [
        { id: "qc1", name: "수입검사 체계", maxScore: 6, score: 0 },
        { id: "qc2", name: "공정검사 체계", maxScore: 6, score: 0 },
        { id: "qc3", name: "출하검사 체계", maxScore: 6, score: 0 },
        { id: "qc4", name: "부적합품 관리", maxScore: 6, score: 0 },
        { id: "qc5", name: "시정/예방조치 체계", maxScore: 6, score: 0 },
      ],
    },
    {
      name: "기술능력",
      maxScore: 20,
      items: [
        { id: "tc1", name: "설계/개발 능력", maxScore: 5, score: 0 },
        { id: "tc2", name: "공정설계 능력", maxScore: 5, score: 0 },
        { id: "tc3", name: "설비/금형 관리능력", maxScore: 5, score: 0 },
        { id: "tc4", name: "기술인력 확보", maxScore: 5, score: 0 },
      ],
    },
    {
      name: "납기준수",
      maxScore: 15,
      items: [
        { id: "dl1", name: "납기 준수율", maxScore: 5, score: 0 },
        { id: "dl2", name: "생산계획 관리", maxScore: 5, score: 0 },
        { id: "dl3", name: "재고관리 체계", maxScore: 5, score: 0 },
      ],
    },
    {
      name: "가격경쟁력",
      maxScore: 15,
      items: [
        { id: "pc1", name: "가격 적정성", maxScore: 5, score: 0 },
        { id: "pc2", name: "원가절감 노력", maxScore: 5, score: 0 },
        { id: "pc3", name: "결제조건 적합성", maxScore: 5, score: 0 },
      ],
    },
  ]);

  // Result state
  const [result, setResult] = useState<AuditResult>({
    totalScore: 0,
    grade: "",
    improvementRequirements: "",
    generalOpinion: "",
    approvalStatus: "",
    approvalDate: "",
    approvedBy: "",
  });

  // History state (sample data)
  const [history] = useState<AuditHistoryRecord[]>([
    { id: 1, auditNumber: "SA-2026-001", auditDate: "2026-01-10", supplierName: "(주)우수금속", auditType: "신규", totalScore: 92, grade: "A", approvalStatus: "승인" },
    { id: 2, auditNumber: "SA-2026-002", auditDate: "2026-02-15", supplierName: "(주)대한플라스틱", auditType: "정기", totalScore: 85, grade: "B", approvalStatus: "조건부승인" },
    { id: 3, auditNumber: "SA-2026-003", auditDate: "2026-03-20", supplierName: "(주)삼성전자부품", auditType: "정기", totalScore: 78, grade: "C", approvalStatus: "조건부승인" },
    { id: 4, auditNumber: "SA-2026-004", auditDate: "2026-04-05", supplierName: "(주)한진물류", auditType: "특별", totalScore: 65, grade: "D", approvalStatus: "미승인" },
    { id: 5, auditNumber: "SA-2026-005", auditDate: "2026-05-12", supplierName: "(주)코리아테크", auditType: "신규", totalScore: 88, grade: "B", approvalStatus: "승인" },
  ]);

  // Calculate total score
  const calculatedTotalScore = useMemo(() => {
    return evaluationCategories.reduce((total, category) => {
      const categoryScore = category.items.reduce((sum, item) => sum + item.score, 0);
      return total + categoryScore;
    }, 0);
  }, [evaluationCategories]);

  // Calculate category scores
  const categoryScores = useMemo(() => {
    return evaluationCategories.map((category) => ({
      name: category.name,
      maxScore: category.maxScore,
      currentScore: category.items.reduce((sum, item) => sum + item.score, 0),
    }));
  }, [evaluationCategories]);

  // Update evaluation item score
  const updateItemScore = (categoryIndex: number, itemId: string, newScore: number) => {
    setEvaluationCategories((prev) => {
      const updated = [...prev];
      const category = { ...updated[categoryIndex] };
      category.items = category.items.map((item) =>
        item.id === itemId ? { ...item, score: Math.min(Math.max(0, newScore), item.maxScore) } : item
      );
      updated[categoryIndex] = category;
      return updated;
    });
  };

  // Save handler
  const handleSave = () => {
    const auditData = {
      basicInfo,
      evaluationCategories,
      result: {
        ...result,
        totalScore: calculatedTotalScore,
        grade: getGrade(calculatedTotalScore),
      },
    };
    console.log("Saving supplier audit data:", auditData);
    alert("협력사 평가 데이터가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">협 력 사 평 가 표</h1>
          <p className="text-muted-foreground">공급자 심사 (Supplier Audit)</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <Building2 className="mr-2 h-4 w-4" />
            심사 기본정보
          </TabsTrigger>
          <TabsTrigger value="evaluation">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            평가항목별 점수
          </TabsTrigger>
          <TabsTrigger value="result">
            <Award className="mr-2 h-4 w-4" />
            심사결과
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            심사 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                심사 기본정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audit Info */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>심사일 *</Label>
                  <Input
                    type="date"
                    value={basicInfo.auditDate}
                    onChange={(e) => setBasicInfo({ ...basicInfo, auditDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>심사번호 *</Label>
                  <Input
                    value={basicInfo.auditNumber}
                    onChange={(e) => setBasicInfo({ ...basicInfo, auditNumber: e.target.value })}
                    placeholder="SA-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>심사유형 *</Label>
                  <Select
                    value={basicInfo.auditType}
                    onValueChange={(v) => setBasicInfo({ ...basicInfo, auditType: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="신규">신규</SelectItem>
                      <SelectItem value="정기">정기</SelectItem>
                      <SelectItem value="특별">특별</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Supplier Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">공급업체 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>공급업체명 *</Label>
                    <Input
                      value={basicInfo.supplierName}
                      onChange={(e) => setBasicInfo({ ...basicInfo, supplierName: e.target.value })}
                      placeholder="(주)우수금속"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>대표자 *</Label>
                    <Input
                      value={basicInfo.ceoName}
                      onChange={(e) => setBasicInfo({ ...basicInfo, ceoName: e.target.value })}
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>사업자번호 *</Label>
                    <Input
                      value={basicInfo.businessNumber}
                      onChange={(e) => setBasicInfo({ ...basicInfo, businessNumber: e.target.value })}
                      placeholder="123-45-67890"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>주소</Label>
                    <Input
                      value={basicInfo.address}
                      onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
                      placeholder="경기도 화성시 동탄면 산업단지로 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>연락처</Label>
                    <Input
                      value={basicInfo.contactNumber}
                      onChange={(e) => setBasicInfo({ ...basicInfo, contactNumber: e.target.value })}
                      placeholder="031-123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Auditor Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">심사원 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>심사원 *</Label>
                    <Input
                      value={basicInfo.auditorName}
                      onChange={(e) => setBasicInfo({ ...basicInfo, auditorName: e.target.value })}
                      placeholder="김철수 (품질보증팀 과장)"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Evaluation Scores */}
        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                평가항목별 점수
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {evaluationCategories.map((category, categoryIndex) => (
                <div key={category.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <Badge variant="outline" className="text-base">
                      {categoryScores[categoryIndex].currentScore} / {category.maxScore}점
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="grid gap-4 md:grid-cols-12 items-center">
                        <div className="md:col-span-6">
                          <Label className="text-sm">{item.name}</Label>
                        </div>
                        <div className="md:col-span-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={item.maxScore}
                              value={item.score}
                              onChange={(e) => updateItemScore(categoryIndex, item.id, Number(e.target.value))}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground">/ {item.maxScore}점</span>
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Total Score Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5" />
                  <h4 className="font-semibold">점수 합계</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  {categoryScores.map((cat) => (
                    <div key={cat.name}>
                      <span className="text-muted-foreground">{cat.name}: </span>
                      <span className="font-medium">{cat.currentScore}/{cat.maxScore}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-lg font-semibold">총점</span>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">{calculatedTotalScore} / 100점</span>
                    <Badge
                      variant={getGradeBadgeVariant(getGrade(calculatedTotalScore))}
                      className={`text-lg px-3 py-1 ${getGradeBadgeClass(getGrade(calculatedTotalScore))}`}
                    >
                      {getGrade(calculatedTotalScore)}등급
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Audit Result */}
        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                심사결과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score and Grade Summary */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 border rounded-lg text-center">
                  <h4 className="text-sm text-muted-foreground mb-2">총점</h4>
                  <p className="text-4xl font-bold">{calculatedTotalScore}<span className="text-lg font-normal text-muted-foreground"> / 100점</span></p>
                </div>
                <div className="p-6 border rounded-lg text-center">
                  <h4 className="text-sm text-muted-foreground mb-2">등급 판정</h4>
                  <Badge
                    variant={getGradeBadgeVariant(getGrade(calculatedTotalScore))}
                    className={`text-3xl px-6 py-2 ${getGradeBadgeClass(getGrade(calculatedTotalScore))}`}
                  >
                    {getGrade(calculatedTotalScore)}등급
                  </Badge>
                </div>
              </div>

              {/* Grade Criteria */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">등급 기준</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">A등급</Badge>
                    <span>90점 이상 (우수업체)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">B등급</Badge>
                    <span>80-89점 (양호업체)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">C등급</Badge>
                    <span>70-79점 (보통업체)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">D등급</Badge>
                    <span>70점 미만 (부적격)</span>
                  </div>
                </div>
              </div>

              {/* Improvement Requirements */}
              <div className="space-y-2">
                <Label>개선요구사항</Label>
                <Textarea
                  value={result.improvementRequirements}
                  onChange={(e) => setResult({ ...result, improvementRequirements: e.target.value })}
                  placeholder="심사 결과 발견된 개선요구사항을 기술하세요."
                  rows={4}
                />
              </div>

              {/* General Opinion */}
              <div className="space-y-2">
                <Label>종합의견</Label>
                <Textarea
                  value={result.generalOpinion}
                  onChange={(e) => setResult({ ...result, generalOpinion: e.target.value })}
                  placeholder="심사에 대한 종합적인 의견을 기술하세요."
                  rows={4}
                />
              </div>

              {/* Approval Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">승인여부</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>승인상태 *</Label>
                    <Select
                      value={result.approvalStatus}
                      onValueChange={(v) => setResult({ ...result, approvalStatus: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="승인">승인</SelectItem>
                        <SelectItem value="조건부승인">조건부승인</SelectItem>
                        <SelectItem value="미승인">미승인</SelectItem>
                        <SelectItem value="보류">보류</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>승인일자</Label>
                    <Input
                      type="date"
                      value={result.approvalDate}
                      onChange={(e) => setResult({ ...result, approvalDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>승인자</Label>
                    <Input
                      value={result.approvedBy}
                      onChange={(e) => setResult({ ...result, approvedBy: e.target.value })}
                      placeholder="박영희 (구매팀장)"
                    />
                  </div>
                </div>
              </div>

              {/* Approval Status Display */}
              {result.approvalStatus && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">최종 승인 상태</span>
                    <Badge
                      variant={
                        result.approvalStatus === "승인" ? "default" :
                        result.approvalStatus === "조건부승인" ? "secondary" :
                        result.approvalStatus === "미승인" ? "destructive" : "outline"
                      }
                      className={
                        result.approvalStatus === "승인" ? "bg-green-100 text-green-800" :
                        result.approvalStatus === "조건부승인" ? "bg-yellow-100 text-yellow-800" :
                        result.approvalStatus === "미승인" ? "bg-red-100 text-red-800" : ""
                      }
                    >
                      {result.approvalStatus}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Audit History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                심사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>심사번호</TableHead>
                    <TableHead>심사일자</TableHead>
                    <TableHead>공급업체명</TableHead>
                    <TableHead>심사유형</TableHead>
                    <TableHead className="text-center">총점</TableHead>
                    <TableHead className="text-center">등급</TableHead>
                    <TableHead>승인상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono">{record.auditNumber}</TableCell>
                      <TableCell>{record.auditDate}</TableCell>
                      <TableCell className="font-medium">{record.supplierName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.auditType}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{record.totalScore}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={getGradeBadgeVariant(record.grade)}
                          className={getGradeBadgeClass(record.grade)}
                        >
                          {record.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.approvalStatus === "승인" ? "default" :
                            record.approvalStatus === "조건부승인" ? "secondary" : "destructive"
                          }
                          className={
                            record.approvalStatus === "승인" ? "bg-green-100 text-green-800" :
                            record.approvalStatus === "조건부승인" ? "bg-yellow-100 text-yellow-800" : ""
                          }
                        >
                          {record.approvalStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* History Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">연간 심사 현황</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 심사: </span>
                    <span className="font-medium">{history.length}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">A등급: </span>
                    <span className="font-medium">{history.filter((h) => h.grade === "A").length}건</span>
                  </div>
                  <div>
                    <span className="text-blue-600">B등급: </span>
                    <span className="font-medium">{history.filter((h) => h.grade === "B").length}건</span>
                  </div>
                  <div>
                    <span className="text-yellow-600">C등급: </span>
                    <span className="font-medium">{history.filter((h) => h.grade === "C").length}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">D등급: </span>
                    <span className="font-medium">{history.filter((h) => h.grade === "D").length}건</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
