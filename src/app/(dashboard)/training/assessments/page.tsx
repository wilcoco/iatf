"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Save } from "lucide-react";

interface QualificationAssessment {
  id: number;
  assessmentDate: string;
  employeeName: string;
  employeeNo: string;
  department: string;
  jobType: string;
  theoreticalScore: number;
  practicalScore: number;
  totalScore: number;
  result: string;
  validUntil: string;
  evaluator: string;
  remarks: string;
}

export default function QualificationAssessmentsPage() {
  const [assessments, setAssessments] = useState<QualificationAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assessmentDate: new Date().toISOString().split("T")[0],
    employeeName: "",
    employeeNo: "",
    department: "",
    jobType: "",
    theoreticalScore: "",
    practicalScore: "",
    validUntil: "",
    evaluator: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const theoreticalScore = Number(formData.theoreticalScore) || 0;
    const practicalScore = Number(formData.practicalScore) || 0;
    const totalScore = Math.round((theoreticalScore + practicalScore) / 2);
    const result = totalScore >= 80 ? "합격" : "불합격";

    const newAssessment: QualificationAssessment = {
      id: Date.now(),
      assessmentDate: formData.assessmentDate,
      employeeName: formData.employeeName,
      employeeNo: formData.employeeNo,
      department: formData.department,
      jobType: formData.jobType,
      theoreticalScore,
      practicalScore,
      totalScore,
      result,
      validUntil: formData.validUntil,
      evaluator: formData.evaluator,
      remarks: formData.remarks,
    };
    setAssessments([newAssessment, ...assessments]);
    setShowForm(false);
    setFormData({
      assessmentDate: new Date().toISOString().split("T")[0],
      employeeName: "",
      employeeNo: "",
      department: "",
      jobType: "",
      theoreticalScore: "",
      practicalScore: "",
      validUntil: "",
      evaluator: "",
      remarks: "",
    });
    alert("자격인증평가가 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">자격인증평가</h1>
          <p className="text-muted-foreground">인원별 자격인증 평가 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          평가 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>자격인증평가 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>평가일자 *</Label>
                  <Input
                    type="date"
                    value={formData.assessmentDate}
                    onChange={(e) => setFormData({ ...formData, assessmentDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>사번</Label>
                  <Input
                    value={formData.employeeNo}
                    onChange={(e) => setFormData({ ...formData, employeeNo: e.target.value })}
                    placeholder="사번"
                  />
                </div>
                <div className="space-y-2">
                  <Label>성명 *</Label>
                  <Input
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    placeholder="성명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>부서</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="소속부서"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>직무유형 *</Label>
                  <Select value={formData.jobType} onValueChange={(v) => setFormData({ ...formData, jobType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="수입검사원">수입검사원</SelectItem>
                      <SelectItem value="출하검사원">출하검사원</SelectItem>
                      <SelectItem value="공정검사원">공정검사원</SelectItem>
                      <SelectItem value="내부심사원">내부심사원</SelectItem>
                      <SelectItem value="설비조작원">설비조작원</SelectItem>
                      <SelectItem value="용접작업자">용접작업자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>필기점수</Label>
                  <Input
                    type="number"
                    value={formData.theoreticalScore}
                    onChange={(e) => setFormData({ ...formData, theoreticalScore: e.target.value })}
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>실기점수</Label>
                  <Input
                    type="number"
                    value={formData.practicalScore}
                    onChange={(e) => setFormData({ ...formData, practicalScore: e.target.value })}
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>유효기한</Label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>평가자 *</Label>
                  <Input
                    value={formData.evaluator}
                    onChange={(e) => setFormData({ ...formData, evaluator: e.target.value })}
                    placeholder="평가자명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="비고"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>취소</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            자격인증평가 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : assessments.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">평가 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>평가일자</TableHead>
                  <TableHead>사번</TableHead>
                  <TableHead>성명</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>직무유형</TableHead>
                  <TableHead className="text-right">필기</TableHead>
                  <TableHead className="text-right">실기</TableHead>
                  <TableHead className="text-right">총점</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>유효기한</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.assessmentDate}</TableCell>
                    <TableCell className="font-mono">{a.employeeNo || "-"}</TableCell>
                    <TableCell className="font-medium">{a.employeeName}</TableCell>
                    <TableCell>{a.department || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{a.jobType}</Badge></TableCell>
                    <TableCell className="text-right">{a.theoreticalScore}</TableCell>
                    <TableCell className="text-right">{a.practicalScore}</TableCell>
                    <TableCell className="text-right font-bold">{a.totalScore}</TableCell>
                    <TableCell>
                      <Badge variant={a.result === "합격" ? "success" : "destructive"}>
                        {a.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{a.validUntil || "-"}</TableCell>
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
