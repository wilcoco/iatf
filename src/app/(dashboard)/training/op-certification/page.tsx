"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Award,
  FileText,
  Users,
  ClipboardList,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
} from "lucide-react";

// Types
interface QualificationStandard {
  id: number;
  level: string;
  jobType: string;
  requiredSkills: string;
  evaluationMethod: string;
  passingCriteria: string;
  validityPeriod: string;
}

interface CertificationStatus {
  id: number;
  no: number;
  name: string;
  team: string;
  position: string;
  qualificationLevel: string;
  certificationDate: string;
  validUntil: string;
  status: "유효" | "만료임박" | "만료";
  remarks: string;
}

interface IndividualEvaluation {
  id: number;
  name: string;
  team: string;
  position: string;
  evaluationDate: string;
  evaluator: string;
  categories: {
    category: string;
    score: number;
    maxScore: number;
    remarks: string;
  }[];
  totalScore: number;
  result: "합격" | "불합격" | "재평가";
}

interface EvaluationPlan {
  id: number;
  quarter: string;
  month: string;
  targetTeam: string;
  evaluationType: string;
  targetCount: number;
  scheduledDate: string;
  status: "예정" | "진행중" | "완료";
  completedCount: number;
}

// Sample data - Qualification Standards (자격인정 기준표)
const qualificationStandards: QualificationStandard[] = [
  {
    id: 1,
    level: "OP Level 1",
    jobType: "사출 기초",
    requiredSkills: "설비 기본 조작, 안전 수칙 이해",
    evaluationMethod: "필기시험 + OJT 평가",
    passingCriteria: "필기 60점 이상, OJT 합격",
    validityPeriod: "12개월",
  },
  {
    id: 2,
    level: "OP Level 2",
    jobType: "사출 중급",
    requiredSkills: "조건 변경, 품질 검사, 금형 교체 보조",
    evaluationMethod: "필기시험 + 실기평가",
    passingCriteria: "필기 70점 이상, 실기 합격",
    validityPeriod: "12개월",
  },
  {
    id: 3,
    level: "OP Level 3",
    jobType: "사출 고급",
    requiredSkills: "금형 교체, 불량 분석, 신규 인원 교육",
    evaluationMethod: "필기시험 + 실기평가 + 면접",
    passingCriteria: "필기 80점 이상, 실기/면접 합격",
    validityPeriod: "24개월",
  },
  {
    id: 4,
    level: "반장급",
    jobType: "라인 관리",
    requiredSkills: "생산 관리, 인원 관리, 품질 관리 총괄",
    evaluationMethod: "종합평가 + 관리자 추천",
    passingCriteria: "종합 85점 이상, 추천 필수",
    validityPeriod: "24개월",
  },
];

// Sample data - Certification Status (인증 현황 관리대장)
const initialCertificationStatus: CertificationStatus[] = [
  {
    id: 1,
    no: 1,
    name: "신상철",
    team: "A조",
    position: "반장",
    qualificationLevel: "반장급",
    certificationDate: "2025-01-15",
    validUntil: "2027-01-15",
    status: "유효",
    remarks: "",
  },
  {
    id: 2,
    no: 2,
    name: "김완호",
    team: "A조",
    position: "주임",
    qualificationLevel: "OP Level 3",
    certificationDate: "2025-03-20",
    validUntil: "2027-03-20",
    status: "유효",
    remarks: "",
  },
  {
    id: 3,
    no: 3,
    name: "김은호",
    team: "A조",
    position: "사원",
    qualificationLevel: "OP Level 2",
    certificationDate: "2025-06-01",
    validUntil: "2026-06-01",
    status: "만료임박",
    remarks: "갱신 예정",
  },
  {
    id: 4,
    no: 4,
    name: "임진규",
    team: "A조",
    position: "사원",
    qualificationLevel: "OP Level 2",
    certificationDate: "2025-04-10",
    validUntil: "2026-04-10",
    status: "만료임박",
    remarks: "",
  },
  {
    id: 5,
    no: 5,
    name: "박지훈",
    team: "B조",
    position: "반장",
    qualificationLevel: "반장급",
    certificationDate: "2024-12-01",
    validUntil: "2026-12-01",
    status: "유효",
    remarks: "",
  },
  {
    id: 6,
    no: 6,
    name: "이준혁",
    team: "B조",
    position: "주임",
    qualificationLevel: "OP Level 3",
    certificationDate: "2025-02-15",
    validUntil: "2027-02-15",
    status: "유효",
    remarks: "",
  },
  {
    id: 7,
    no: 7,
    name: "정민수",
    team: "B조",
    position: "사원",
    qualificationLevel: "OP Level 1",
    certificationDate: "2025-05-20",
    validUntil: "2026-05-20",
    status: "만료임박",
    remarks: "Level 2 도전 예정",
  },
  {
    id: 8,
    no: 8,
    name: "최동훈",
    team: "C조",
    position: "사원",
    qualificationLevel: "OP Level 2",
    certificationDate: "2024-08-15",
    validUntil: "2025-08-15",
    status: "만료",
    remarks: "재인증 필요",
  },
];

// Sample data - Individual Evaluations (개인별 평가표)
const individualEvaluations: IndividualEvaluation[] = [
  {
    id: 1,
    name: "신상철",
    team: "A조",
    position: "반장",
    evaluationDate: "2025-01-10",
    evaluator: "김팀장",
    categories: [
      { category: "설비 운영 능력", score: 95, maxScore: 100, remarks: "우수" },
      { category: "품질 관리", score: 90, maxScore: 100, remarks: "양호" },
      { category: "안전 관리", score: 88, maxScore: 100, remarks: "양호" },
      { category: "인원 관리", score: 92, maxScore: 100, remarks: "우수" },
      { category: "문제 해결 능력", score: 85, maxScore: 100, remarks: "양호" },
    ],
    totalScore: 90,
    result: "합격",
  },
  {
    id: 2,
    name: "김완호",
    team: "A조",
    position: "주임",
    evaluationDate: "2025-03-15",
    evaluator: "신상철 반장",
    categories: [
      { category: "설비 운영 능력", score: 88, maxScore: 100, remarks: "양호" },
      { category: "품질 관리", score: 85, maxScore: 100, remarks: "양호" },
      { category: "안전 관리", score: 90, maxScore: 100, remarks: "양호" },
      { category: "작업 지시 능력", score: 82, maxScore: 100, remarks: "보통" },
      { category: "문제 해결 능력", score: 80, maxScore: 100, remarks: "보통" },
    ],
    totalScore: 85,
    result: "합격",
  },
  {
    id: 3,
    name: "김은호",
    team: "A조",
    position: "사원",
    evaluationDate: "2025-05-25",
    evaluator: "신상철 반장",
    categories: [
      { category: "설비 기본 조작", score: 78, maxScore: 100, remarks: "양호" },
      { category: "품질 검사", score: 75, maxScore: 100, remarks: "보통" },
      { category: "안전 수칙 준수", score: 85, maxScore: 100, remarks: "양호" },
      { category: "조건 변경 능력", score: 72, maxScore: 100, remarks: "보통" },
      { category: "협업 능력", score: 80, maxScore: 100, remarks: "양호" },
    ],
    totalScore: 78,
    result: "합격",
  },
  {
    id: 4,
    name: "임진규",
    team: "A조",
    position: "사원",
    evaluationDate: "2025-04-05",
    evaluator: "신상철 반장",
    categories: [
      { category: "설비 기본 조작", score: 82, maxScore: 100, remarks: "양호" },
      { category: "품질 검사", score: 78, maxScore: 100, remarks: "양호" },
      { category: "안전 수칙 준수", score: 88, maxScore: 100, remarks: "양호" },
      { category: "조건 변경 능력", score: 75, maxScore: 100, remarks: "보통" },
      { category: "협업 능력", score: 85, maxScore: 100, remarks: "양호" },
    ],
    totalScore: 81.6,
    result: "합격",
  },
  {
    id: 5,
    name: "박지훈",
    team: "B조",
    position: "반장",
    evaluationDate: "2024-11-20",
    evaluator: "김팀장",
    categories: [
      { category: "설비 운영 능력", score: 92, maxScore: 100, remarks: "우수" },
      { category: "품질 관리", score: 88, maxScore: 100, remarks: "양호" },
      { category: "안전 관리", score: 90, maxScore: 100, remarks: "양호" },
      { category: "인원 관리", score: 86, maxScore: 100, remarks: "양호" },
      { category: "문제 해결 능력", score: 84, maxScore: 100, remarks: "양호" },
    ],
    totalScore: 88,
    result: "합격",
  },
];

// Sample data - Evaluation Plan (평가 계획서)
const evaluationPlans: EvaluationPlan[] = [
  {
    id: 1,
    quarter: "1분기",
    month: "1월",
    targetTeam: "A조",
    evaluationType: "정기 자격 평가",
    targetCount: 5,
    scheduledDate: "2025-01-15",
    status: "완료",
    completedCount: 5,
  },
  {
    id: 2,
    quarter: "1분기",
    month: "2월",
    targetTeam: "B조",
    evaluationType: "정기 자격 평가",
    targetCount: 4,
    scheduledDate: "2025-02-20",
    status: "완료",
    completedCount: 4,
  },
  {
    id: 3,
    quarter: "1분기",
    month: "3월",
    targetTeam: "C조",
    evaluationType: "정기 자격 평가",
    targetCount: 5,
    scheduledDate: "2025-03-18",
    status: "완료",
    completedCount: 5,
  },
  {
    id: 4,
    quarter: "2분기",
    month: "4월",
    targetTeam: "신입사원",
    evaluationType: "신규 자격 취득",
    targetCount: 3,
    scheduledDate: "2025-04-10",
    status: "완료",
    completedCount: 3,
  },
  {
    id: 5,
    quarter: "2분기",
    month: "5월",
    targetTeam: "A조",
    evaluationType: "승급 평가",
    targetCount: 2,
    scheduledDate: "2025-05-25",
    status: "완료",
    completedCount: 2,
  },
  {
    id: 6,
    quarter: "2분기",
    month: "6월",
    targetTeam: "전체",
    evaluationType: "반기 종합 평가",
    targetCount: 15,
    scheduledDate: "2025-06-20",
    status: "진행중",
    completedCount: 8,
  },
  {
    id: 7,
    quarter: "3분기",
    month: "7월",
    targetTeam: "B조",
    evaluationType: "갱신 평가",
    targetCount: 4,
    scheduledDate: "2025-07-15",
    status: "예정",
    completedCount: 0,
  },
  {
    id: 8,
    quarter: "3분기",
    month: "8월",
    targetTeam: "C조",
    evaluationType: "갱신 평가",
    targetCount: 3,
    scheduledDate: "2025-08-12",
    status: "예정",
    completedCount: 0,
  },
  {
    id: 9,
    quarter: "3분기",
    month: "9월",
    targetTeam: "신입사원",
    evaluationType: "신규 자격 취득",
    targetCount: 2,
    scheduledDate: "2025-09-18",
    status: "예정",
    completedCount: 0,
  },
  {
    id: 10,
    quarter: "4분기",
    month: "10월",
    targetTeam: "A조",
    evaluationType: "갱신 평가",
    targetCount: 5,
    scheduledDate: "2025-10-20",
    status: "예정",
    completedCount: 0,
  },
  {
    id: 11,
    quarter: "4분기",
    month: "11월",
    targetTeam: "전체",
    evaluationType: "특별 승급 평가",
    targetCount: 3,
    scheduledDate: "2025-11-15",
    status: "예정",
    completedCount: 0,
  },
  {
    id: 12,
    quarter: "4분기",
    month: "12월",
    targetTeam: "전체",
    evaluationType: "연말 종합 평가",
    targetCount: 20,
    scheduledDate: "2025-12-10",
    status: "예정",
    completedCount: 0,
  },
];

export default function OPCertificationPage() {
  const [activeTab, setActiveTab] = useState("standards");
  const [certifications] = useState<CertificationStatus[]>(initialCertificationStatus);
  const [selectedPerson, setSelectedPerson] = useState<string>(individualEvaluations[0].name);

  // Get selected person's evaluation
  const selectedEvaluation = individualEvaluations.find(
    (e) => e.name === selectedPerson
  );

  // Calculate status counts
  const statusCounts = {
    valid: certifications.filter((c) => c.status === "유효").length,
    expiringSoon: certifications.filter((c) => c.status === "만료임박").length,
    expired: certifications.filter((c) => c.status === "만료").length,
  };

  // Calculate plan progress
  const planProgress = {
    completed: evaluationPlans.filter((p) => p.status === "완료").length,
    inProgress: evaluationPlans.filter((p) => p.status === "진행중").length,
    scheduled: evaluationPlans.filter((p) => p.status === "예정").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8" />
            OP 자격인증
          </h1>
          <p className="text-muted-foreground">
            2025년 OP 자격인증 현황 및 평가 관리 (사출팀)
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">유효 인증</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.valid}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">만료 임박</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.expiringSoon}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">만료</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.expired}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">총 인원</p>
                <p className="text-2xl font-bold text-blue-600">{certifications.length}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="standards" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            자격인증 기준
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            인증 현황 관리대장
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            개인별 평가
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            평가 계획
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Qualification Standards (자격인증 기준) */}
        <TabsContent value="standards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                자격인정 기준표
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">자격 등급</TableHead>
                    <TableHead className="w-[120px]">직무 유형</TableHead>
                    <TableHead>필요 역량</TableHead>
                    <TableHead>평가 방법</TableHead>
                    <TableHead>합격 기준</TableHead>
                    <TableHead className="w-[100px] text-center">유효 기간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qualificationStandards.map((std) => (
                    <TableRow key={std.id}>
                      <TableCell>
                        <Badge
                          variant={
                            std.level === "반장급"
                              ? "default"
                              : std.level === "OP Level 3"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {std.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{std.jobType}</TableCell>
                      <TableCell className="text-sm">{std.requiredSkills}</TableCell>
                      <TableCell className="text-sm">{std.evaluationMethod}</TableCell>
                      <TableCell className="text-sm">{std.passingCriteria}</TableCell>
                      <TableCell className="text-center">{std.validityPeriod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Legend */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">평가 등급 설명</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>OP Level 1:</strong> 신입/기초 수준, 기본 설비 조작 가능</p>
                    <p><strong>OP Level 2:</strong> 중급 수준, 조건 변경 및 품질 검사 수행</p>
                  </div>
                  <div>
                    <p><strong>OP Level 3:</strong> 고급 수준, 금형 교체 및 신규 인원 교육 가능</p>
                    <p><strong>반장급:</strong> 관리자 수준, 라인 전체 관리 역량</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Certification Status Register (인증 현황 관리대장) */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                직무평가 인증현황 관리대장
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filter by team */}
              <div className="mb-4 flex gap-4 items-center">
                <Label>조 필터:</Label>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    전체
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    A조
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    B조
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    C조
                  </Badge>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">NO</TableHead>
                    <TableHead>성명</TableHead>
                    <TableHead className="text-center">조</TableHead>
                    <TableHead className="text-center">직급</TableHead>
                    <TableHead>자격 등급</TableHead>
                    <TableHead className="text-center">인증일</TableHead>
                    <TableHead className="text-center">유효기간</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certifications.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="text-center font-medium">{cert.no}</TableCell>
                      <TableCell className="font-medium">{cert.name}</TableCell>
                      <TableCell className="text-center">{cert.team}</TableCell>
                      <TableCell className="text-center">{cert.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cert.qualificationLevel === "반장급"
                              ? "default"
                              : cert.qualificationLevel === "OP Level 3"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {cert.qualificationLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{cert.certificationDate}</TableCell>
                      <TableCell className="text-center">{cert.validUntil}</TableCell>
                      <TableCell className="text-center">
                        {cert.status === "유효" ? (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            유효
                          </Badge>
                        ) : cert.status === "만료임박" ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            만료임박
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            만료
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cert.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary by team */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">A조 현황</h4>
                  <p className="text-sm text-muted-foreground">
                    총 {certifications.filter((c) => c.team === "A조").length}명 |
                    유효 {certifications.filter((c) => c.team === "A조" && c.status === "유효").length}명
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">B조 현황</h4>
                  <p className="text-sm text-muted-foreground">
                    총 {certifications.filter((c) => c.team === "B조").length}명 |
                    유효 {certifications.filter((c) => c.team === "B조" && c.status === "유효").length}명
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">C조 현황</h4>
                  <p className="text-sm text-muted-foreground">
                    총 {certifications.filter((c) => c.team === "C조").length}명 |
                    유효 {certifications.filter((c) => c.team === "C조" && c.status === "유효").length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Individual Evaluation (개인별 평가) */}
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                개인별 평가표
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Person Selector */}
              <div className="flex items-center gap-4">
                <Label>평가 대상자 선택:</Label>
                <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="대상자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {individualEvaluations.map((e) => (
                      <SelectItem key={e.id} value={e.name}>
                        {e.name} ({e.team} {e.position})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEvaluation && (
                <>
                  {/* Person Info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label className="text-muted-foreground">성명</Label>
                      <p className="font-medium">{selectedEvaluation.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">소속</Label>
                      <p className="font-medium">{selectedEvaluation.team} / {selectedEvaluation.position}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">평가일</Label>
                      <p className="font-medium">{selectedEvaluation.evaluationDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">평가자</Label>
                      <p className="font-medium">{selectedEvaluation.evaluator}</p>
                    </div>
                  </div>

                  {/* Evaluation Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>평가 항목</TableHead>
                        <TableHead className="text-center w-[100px]">배점</TableHead>
                        <TableHead className="text-center w-[100px]">득점</TableHead>
                        <TableHead className="text-center w-[120px]">득점률</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEvaluation.categories.map((cat, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{cat.category}</TableCell>
                          <TableCell className="text-center">{cat.maxScore}</TableCell>
                          <TableCell className="text-center font-medium">{cat.score}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                cat.score / cat.maxScore >= 0.9
                                  ? "text-green-600 font-medium"
                                  : cat.score / cat.maxScore >= 0.7
                                  ? "text-blue-600"
                                  : "text-amber-600"
                              }
                            >
                              {Math.round((cat.score / cat.maxScore) * 100)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{cat.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Result Summary */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-8">
                      <div>
                        <Label className="text-muted-foreground">총점</Label>
                        <p className="text-2xl font-bold">{selectedEvaluation.totalScore}점</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">평가 결과</Label>
                        <div className="mt-1">
                          {selectedEvaluation.result === "합격" ? (
                            <Badge className="bg-green-600 hover:bg-green-700 text-lg px-4 py-1">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              합격
                            </Badge>
                          ) : selectedEvaluation.result === "불합격" ? (
                            <Badge variant="destructive" className="text-lg px-4 py-1">
                              <XCircle className="mr-2 h-4 w-4" />
                              불합격
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-lg px-4 py-1">
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              재평가
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      평가표 출력
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Evaluation Plan (평가 계획) */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                2025년 평가 계획서
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <p className="text-sm text-muted-foreground">완료</p>
                  <p className="text-2xl font-bold text-green-600">{planProgress.completed}건</p>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-sm text-muted-foreground">진행중</p>
                  <p className="text-2xl font-bold text-blue-600">{planProgress.inProgress}건</p>
                </div>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm text-muted-foreground">예정</p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{planProgress.scheduled}건</p>
                </div>
              </div>

              {/* Plan Table by Quarter */}
              {["1분기", "2분기", "3분기", "4분기"].map((quarter) => (
                <div key={quarter} className="space-y-2">
                  <h4 className="font-medium text-lg border-b pb-2">{quarter}</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">월</TableHead>
                        <TableHead>대상</TableHead>
                        <TableHead>평가 유형</TableHead>
                        <TableHead className="text-center">대상 인원</TableHead>
                        <TableHead className="text-center">예정일</TableHead>
                        <TableHead className="text-center">진행 현황</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluationPlans
                        .filter((p) => p.quarter === quarter)
                        .map((plan) => (
                          <TableRow key={plan.id}>
                            <TableCell className="font-medium">{plan.month}</TableCell>
                            <TableCell>{plan.targetTeam}</TableCell>
                            <TableCell>{plan.evaluationType}</TableCell>
                            <TableCell className="text-center">{plan.targetCount}명</TableCell>
                            <TableCell className="text-center">{plan.scheduledDate}</TableCell>
                            <TableCell className="text-center">
                              <span className="font-medium">
                                {plan.completedCount}/{plan.targetCount}
                              </span>
                              {plan.targetCount > 0 && (
                                <span className="text-muted-foreground ml-1">
                                  ({Math.round((plan.completedCount / plan.targetCount) * 100)}%)
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {plan.status === "완료" ? (
                                <Badge className="bg-green-600 hover:bg-green-700">완료</Badge>
                              ) : plan.status === "진행중" ? (
                                <Badge className="bg-blue-600 hover:bg-blue-700">진행중</Badge>
                              ) : (
                                <Badge variant="secondary">예정</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
