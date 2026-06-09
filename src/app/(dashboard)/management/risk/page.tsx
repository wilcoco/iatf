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
import { Plus, AlertTriangle, Shield } from "lucide-react";

interface RiskAssessment {
  id: number;
  evaluationDate: string;
  processName: string;
  riskDescription: string;
  probability: number;
  impact: number;
  riskLevel: string;
  countermeasure: string;
  responsibleDept: string;
  status: string;
}

const initialData: RiskAssessment[] = [
  {
    id: 1,
    evaluationDate: "2026-01-15",
    processName: "수입검사",
    riskDescription: "공급업체 품질 불안정으로 인한 불량 유입",
    probability: 3,
    impact: 4,
    riskLevel: "상",
    countermeasure: "공급업체 품질관리 강화, 수입검사 기준 강화",
    responsibleDept: "품질부",
    status: "진행중",
  },
  {
    id: 2,
    evaluationDate: "2026-01-15",
    processName: "생산",
    riskDescription: "설비 노후화로 인한 공정능력 저하",
    probability: 2,
    impact: 3,
    riskLevel: "중",
    countermeasure: "예방보전 주기 단축, 설비 교체 계획 수립",
    responsibleDept: "생산부",
    status: "진행중",
  },
  {
    id: 3,
    evaluationDate: "2026-01-15",
    processName: "출하",
    riskDescription: "운송 중 제품 손상",
    probability: 1,
    impact: 2,
    riskLevel: "하",
    countermeasure: "포장 방법 개선, 운송업체 관리",
    responsibleDept: "물류부",
    status: "완료",
  },
];

const processNames = [
  "수입검사",
  "자재관리",
  "생산",
  "공정검사",
  "최종검사",
  "출하",
  "설비관리",
  "문서관리",
  "교육훈련",
  "내부심사",
];
const departments = ["경영지원부", "영업부", "생산부", "품질부", "인사부", "구매부", "물류부"];
const statusOptions = ["계획", "진행중", "완료", "보류"];
const probabilityOptions = [
  { value: 1, label: "1 - 매우 낮음" },
  { value: 2, label: "2 - 낮음" },
  { value: 3, label: "3 - 보통" },
  { value: 4, label: "4 - 높음" },
  { value: 5, label: "5 - 매우 높음" },
];
const impactOptions = [
  { value: 1, label: "1 - 경미" },
  { value: 2, label: "2 - 낮음" },
  { value: 3, label: "3 - 보통" },
  { value: 4, label: "4 - 심각" },
  { value: 5, label: "5 - 치명적" },
];

const calculateRiskLevel = (probability: number, impact: number): string => {
  const score = probability * impact;
  if (score >= 15) return "상";
  if (score >= 8) return "중";
  return "하";
};

export default function RiskAssessmentPage() {
  const [assessments, setAssessments] = useState<RiskAssessment[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    evaluationDate: "",
    processName: "",
    riskDescription: "",
    probability: 1,
    impact: 1,
    countermeasure: "",
    responsibleDept: "",
    status: "계획",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const riskLevel = calculateRiskLevel(formData.probability, formData.impact);

    const newAssessment: RiskAssessment = {
      id: assessments.length + 1,
      ...formData,
      riskLevel,
    };
    setAssessments([...assessments, newAssessment]);
    setShowForm(false);
    setFormData({
      evaluationDate: "",
      processName: "",
      riskDescription: "",
      probability: 1,
      impact: 1,
      countermeasure: "",
      responsibleDept: "",
      status: "계획",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      계획: "secondary",
      진행중: "default",
      완료: "success",
      보류: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getRiskLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      상: "bg-red-100 text-red-800",
      중: "bg-yellow-100 text-yellow-800",
      하: "bg-green-100 text-green-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level] || "bg-gray-100"}`}>
        {level}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">리스크평가</h1>
          <p className="text-muted-foreground">
            프로세스별 리스크 평가 관리 (리스크평가항목기준 년1회평가)
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          리스크 등록
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 리스크</p>
                <p className="text-2xl font-bold">{assessments.length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">고위험 (상)</p>
                <p className="text-2xl font-bold text-red-600">
                  {assessments.filter((a) => a.riskLevel === "상").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">중위험 (중)</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {assessments.filter((a) => a.riskLevel === "중").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">저위험 (하)</p>
                <p className="text-2xl font-bold text-green-600">
                  {assessments.filter((a) => a.riskLevel === "하").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              리스크 평가 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="evaluationDate">평가일자</Label>
                  <Input
                    id="evaluationDate"
                    type="date"
                    value={formData.evaluationDate}
                    onChange={(e) =>
                      setFormData({ ...formData, evaluationDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processName">프로세스</Label>
                  <Select
                    value={formData.processName}
                    onValueChange={(value) =>
                      setFormData({ ...formData, processName: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="프로세스 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {processNames.map((process) => (
                        <SelectItem key={process} value={process}>
                          {process}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibleDept">담당부서</Label>
                  <Select
                    value={formData.responsibleDept}
                    onValueChange={(value) =>
                      setFormData({ ...formData, responsibleDept: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="담당부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskDescription">리스크 설명</Label>
                <Textarea
                  id="riskDescription"
                  value={formData.riskDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, riskDescription: e.target.value })
                  }
                  placeholder="리스크 내용을 상세히 입력하세요"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="probability">발생확률 (1-5)</Label>
                  <Select
                    value={formData.probability.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, probability: parseInt(value) })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="발생확률 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {probabilityOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">영향도 (1-5)</Label>
                  <Select
                    value={formData.impact.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, impact: parseInt(value) })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="영향도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {impactOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>리스크 등급</Label>
                  <div className="h-10 flex items-center">
                    {getRiskLevelBadge(
                      calculateRiskLevel(formData.probability, formData.impact)
                    )}
                    <span className="ml-2 text-sm text-muted-foreground">
                      (점수: {formData.probability * formData.impact})
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countermeasure">대응방안</Label>
                  <Textarea
                    id="countermeasure"
                    value={formData.countermeasure}
                    onChange={(e) =>
                      setFormData({ ...formData, countermeasure: e.target.value })
                    }
                    placeholder="리스크 대응방안을 입력하세요"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
                <Button type="submit">등록</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            리스크 평가 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <p className="text-muted-foreground">등록된 리스크 평가가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>평가일자</TableHead>
                  <TableHead>프로세스</TableHead>
                  <TableHead>리스크 설명</TableHead>
                  <TableHead className="text-center">발생확률</TableHead>
                  <TableHead className="text-center">영향도</TableHead>
                  <TableHead className="text-center">등급</TableHead>
                  <TableHead>대응방안</TableHead>
                  <TableHead>담당부서</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(assessment.evaluationDate)}
                    </TableCell>
                    <TableCell>{assessment.processName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {assessment.riskDescription}
                    </TableCell>
                    <TableCell className="text-center">{assessment.probability}</TableCell>
                    <TableCell className="text-center">{assessment.impact}</TableCell>
                    <TableCell className="text-center">
                      {getRiskLevelBadge(assessment.riskLevel)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {assessment.countermeasure}
                    </TableCell>
                    <TableCell>{assessment.responsibleDept}</TableCell>
                    <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
