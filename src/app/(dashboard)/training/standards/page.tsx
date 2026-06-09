"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Save } from "lucide-react";

interface QualificationStandard {
  id: number;
  jobType: string;
  requiredTraining: string;
  requiredExperience: string;
  evaluationCriteria: string;
  passingScore: number;
  validityMonths: number;
  remarks: string;
}

export default function QualificationStandardsPage() {
  const [standards, setStandards] = useState<QualificationStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jobType: "",
    requiredTraining: "",
    requiredExperience: "",
    evaluationCriteria: "",
    passingScore: "80",
    validityMonths: "12",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStandard: QualificationStandard = {
      id: Date.now(),
      jobType: formData.jobType,
      requiredTraining: formData.requiredTraining,
      requiredExperience: formData.requiredExperience,
      evaluationCriteria: formData.evaluationCriteria,
      passingScore: Number(formData.passingScore),
      validityMonths: Number(formData.validityMonths),
      remarks: formData.remarks,
    };
    setStandards([newStandard, ...standards]);
    setShowForm(false);
    setFormData({
      jobType: "",
      requiredTraining: "",
      requiredExperience: "",
      evaluationCriteria: "",
      passingScore: "80",
      validityMonths: "12",
      remarks: "",
    });
    alert("자격인증기준이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">자격인증기준</h1>
          <p className="text-muted-foreground">직무별 자격인증 기준 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          기준 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>자격인증기준 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>직무유형 *</Label>
                  <Input
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    placeholder="수입검사원, 내부심사원 등"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>합격점수</Label>
                  <Input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                    placeholder="80"
                  />
                </div>
                <div className="space-y-2">
                  <Label>유효기간 (개월)</Label>
                  <Input
                    type="number"
                    value={formData.validityMonths}
                    onChange={(e) => setFormData({ ...formData, validityMonths: e.target.value })}
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>필수교육</Label>
                  <Textarea
                    value={formData.requiredTraining}
                    onChange={(e) => setFormData({ ...formData, requiredTraining: e.target.value })}
                    placeholder="필수 이수 교육 목록"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>필요경력</Label>
                  <Textarea
                    value={formData.requiredExperience}
                    onChange={(e) => setFormData({ ...formData, requiredExperience: e.target.value })}
                    placeholder="필요 경력 요건"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>평가기준</Label>
                <Textarea
                  value={formData.evaluationCriteria}
                  onChange={(e) => setFormData({ ...formData, evaluationCriteria: e.target.value })}
                  placeholder="평가항목 및 배점 기준"
                  rows={3}
                />
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
            <FileText className="h-5 w-5" />
            자격인증기준 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : standards.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 기준이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>직무유형</TableHead>
                  <TableHead>필수교육</TableHead>
                  <TableHead>필요경력</TableHead>
                  <TableHead className="text-right">합격점수</TableHead>
                  <TableHead className="text-right">유효기간</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standards.map((std) => (
                  <TableRow key={std.id}>
                    <TableCell className="font-medium">{std.jobType}</TableCell>
                    <TableCell className="text-sm">{std.requiredTraining || "-"}</TableCell>
                    <TableCell className="text-sm">{std.requiredExperience || "-"}</TableCell>
                    <TableCell className="text-right">{std.passingScore}점</TableCell>
                    <TableCell className="text-right">{std.validityMonths}개월</TableCell>
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
