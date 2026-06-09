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
import { Plus, ClipboardCheck, TrendingUp } from "lucide-react";

interface HousekeepingEvaluation {
  id: number;
  evaluationDate: string;
  area: string;
  evaluator: string;
  score: number;
  targetScore: number;
  findings: string;
  improvements: string;
  completionDate: string;
  status: string;
}

const initialData: HousekeepingEvaluation[] = [
  {
    id: 1,
    evaluationDate: "2026-06-01",
    area: "생산라인 A",
    evaluator: "김관리",
    score: 92,
    targetScore: 90,
    findings: "정리정돈 우수, 청소상태 양호",
    improvements: "",
    completionDate: "",
    status: "완료",
  },
  {
    id: 2,
    evaluationDate: "2026-06-01",
    area: "생산라인 B",
    evaluator: "이점검",
    score: 78,
    targetScore: 90,
    findings: "불용품 적치, 통로 확보 미흡",
    improvements: "불용품 폐기, 통로 라인 재도색",
    completionDate: "2026-06-15",
    status: "개선중",
  },
  {
    id: 3,
    evaluationDate: "2026-06-01",
    area: "원자재 창고",
    evaluator: "박평가",
    score: 85,
    targetScore: 90,
    findings: "선입선출 관리 미흡",
    improvements: "선입선출 표시판 설치",
    completionDate: "2026-06-10",
    status: "개선완료",
  },
];

const statusOptions = ["평가완료", "개선중", "개선완료", "완료"];

export default function HousekeepingEvaluationPage() {
  const [evaluations, setEvaluations] = useState<HousekeepingEvaluation[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    evaluationDate: "",
    area: "",
    evaluator: "",
    score: "",
    targetScore: "",
    findings: "",
    improvements: "",
    completionDate: "",
    status: "평가완료",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvaluation: HousekeepingEvaluation = {
      id: evaluations.length + 1,
      evaluationDate: formData.evaluationDate,
      area: formData.area,
      evaluator: formData.evaluator,
      score: Number(formData.score),
      targetScore: Number(formData.targetScore),
      findings: formData.findings,
      improvements: formData.improvements,
      completionDate: formData.completionDate,
      status: formData.status,
    };
    setEvaluations([...evaluations, newEvaluation]);
    setShowForm(false);
    setFormData({
      evaluationDate: "",
      area: "",
      evaluator: "",
      score: "",
      targetScore: "",
      findings: "",
      improvements: "",
      completionDate: "",
      status: "평가완료",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning"> = {
      평가완료: "secondary",
      개선중: "warning",
      개선완료: "success",
      완료: "success",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getScoreColor = (score: number, target: number) => {
    if (score >= target) return "text-green-600 font-semibold";
    if (score >= target - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">3정5행 평가/개선</h1>
          <p className="text-muted-foreground">3정5행 평가 및 개선활동 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          평가 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              3정5행 평가 등록
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
                  <Label htmlFor="area">평가구역</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    placeholder="예: 생산라인 A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluator">평가자</Label>
                  <Input
                    id="evaluator"
                    value={formData.evaluator}
                    onChange={(e) =>
                      setFormData({ ...formData, evaluator: e.target.value })
                    }
                    placeholder="평가자명"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">평가점수</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({ ...formData, score: e.target.value })
                    }
                    placeholder="0-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetScore">목표점수</Label>
                  <Input
                    id="targetScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.targetScore}
                    onChange={(e) =>
                      setFormData({ ...formData, targetScore: e.target.value })
                    }
                    placeholder="0-100"
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
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="improvements">개선조치</Label>
                  <Textarea
                    id="improvements"
                    value={formData.improvements}
                    onChange={(e) =>
                      setFormData({ ...formData, improvements: e.target.value })
                    }
                    placeholder="개선조치 내용을 입력하세요"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completionDate">완료예정일</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, completionDate: e.target.value })
                    }
                  />
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
            <TrendingUp className="h-5 w-5" />
            3정5행 평가 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evaluations.length === 0 ? (
            <p className="text-muted-foreground">등록된 평가가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>평가일자</TableHead>
                  <TableHead>평가구역</TableHead>
                  <TableHead>평가자</TableHead>
                  <TableHead>점수</TableHead>
                  <TableHead>목표</TableHead>
                  <TableHead>평가결과</TableHead>
                  <TableHead>개선조치</TableHead>
                  <TableHead>완료예정일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(evaluation.evaluationDate)}
                    </TableCell>
                    <TableCell>{evaluation.area}</TableCell>
                    <TableCell>{evaluation.evaluator}</TableCell>
                    <TableCell className={getScoreColor(evaluation.score, evaluation.targetScore)}>
                      {evaluation.score}점
                    </TableCell>
                    <TableCell>{evaluation.targetScore}점</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {evaluation.findings}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {evaluation.improvements || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(evaluation.completionDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
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
