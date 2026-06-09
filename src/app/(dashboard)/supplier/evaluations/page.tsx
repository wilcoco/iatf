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

interface SupplierEvaluation {
  id: number;
  evaluationDate: string;
  evaluationType: string;
  supplierCode: string;
  supplierName: string;
  qualityScore: number;
  deliveryScore: number;
  costScore: number;
  serviceScore: number;
  totalScore: number;
  grade: string;
  improvements: string;
  evaluator: string;
}

export default function SupplierEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<SupplierEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    evaluationDate: new Date().toISOString().split("T")[0],
    evaluationType: "",
    supplierCode: "",
    supplierName: "",
    qualityScore: "",
    deliveryScore: "",
    costScore: "",
    serviceScore: "",
    improvements: "",
    evaluator: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const calculateGrade = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qualityScore = Number(formData.qualityScore) || 0;
    const deliveryScore = Number(formData.deliveryScore) || 0;
    const costScore = Number(formData.costScore) || 0;
    const serviceScore = Number(formData.serviceScore) || 0;
    const totalScore = Math.round((qualityScore * 0.4 + deliveryScore * 0.3 + costScore * 0.2 + serviceScore * 0.1) * 10) / 10;
    const grade = calculateGrade(totalScore);

    const newEvaluation: SupplierEvaluation = {
      id: Date.now(),
      evaluationDate: formData.evaluationDate,
      evaluationType: formData.evaluationType,
      supplierCode: formData.supplierCode,
      supplierName: formData.supplierName,
      qualityScore,
      deliveryScore,
      costScore,
      serviceScore,
      totalScore,
      grade,
      improvements: formData.improvements,
      evaluator: formData.evaluator,
    };
    setEvaluations([newEvaluation, ...evaluations]);
    setShowForm(false);
    setFormData({
      evaluationDate: new Date().toISOString().split("T")[0],
      evaluationType: "",
      supplierCode: "",
      supplierName: "",
      qualityScore: "",
      deliveryScore: "",
      costScore: "",
      serviceScore: "",
      improvements: "",
      evaluator: "",
    });
    alert("공급자평가가 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공급자평가</h1>
          <p className="text-muted-foreground">협력업체 정기/수시 평가 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          평가 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>공급자평가 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>평가일자 *</Label>
                  <Input
                    type="date"
                    value={formData.evaluationDate}
                    onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>평가유형 *</Label>
                  <Select value={formData.evaluationType} onValueChange={(v) => setFormData({ ...formData, evaluationType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="정기평가">정기평가</SelectItem>
                      <SelectItem value="수시평가">수시평가</SelectItem>
                      <SelectItem value="신규평가">신규평가</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>업체코드 *</Label>
                  <Input
                    value={formData.supplierCode}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    placeholder="S-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>업체명 *</Label>
                  <Input
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="업체명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>품질 (40%)</Label>
                  <Input
                    type="number"
                    value={formData.qualityScore}
                    onChange={(e) => setFormData({ ...formData, qualityScore: e.target.value })}
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>납기 (30%)</Label>
                  <Input
                    type="number"
                    value={formData.deliveryScore}
                    onChange={(e) => setFormData({ ...formData, deliveryScore: e.target.value })}
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>가격 (20%)</Label>
                  <Input
                    type="number"
                    value={formData.costScore}
                    onChange={(e) => setFormData({ ...formData, costScore: e.target.value })}
                    placeholder="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>서비스 (10%)</Label>
                  <Input
                    type="number"
                    value={formData.serviceScore}
                    onChange={(e) => setFormData({ ...formData, serviceScore: e.target.value })}
                    placeholder="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>개선요구사항</Label>
                  <Textarea
                    value={formData.improvements}
                    onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                    placeholder="개선 필요사항"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>평가자 *</Label>
                  <Input
                    value={formData.evaluator}
                    onChange={(e) => setFormData({ ...formData, evaluator: e.target.value })}
                    placeholder="평가자명"
                    required
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
            공급자평가 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : evaluations.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">평가 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>평가일자</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>업체코드</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead className="text-right">품질</TableHead>
                  <TableHead className="text-right">납기</TableHead>
                  <TableHead className="text-right">가격</TableHead>
                  <TableHead className="text-right">종합</TableHead>
                  <TableHead>등급</TableHead>
                  <TableHead>평가자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.evaluationDate}</TableCell>
                    <TableCell><Badge variant="outline">{e.evaluationType}</Badge></TableCell>
                    <TableCell className="font-mono">{e.supplierCode}</TableCell>
                    <TableCell>{e.supplierName}</TableCell>
                    <TableCell className="text-right">{e.qualityScore}</TableCell>
                    <TableCell className="text-right">{e.deliveryScore}</TableCell>
                    <TableCell className="text-right">{e.costScore}</TableCell>
                    <TableCell className="text-right font-bold">{e.totalScore}</TableCell>
                    <TableCell>
                      <Badge variant={e.grade === "A" || e.grade === "B" ? "success" : e.grade === "C" ? "warning" : "destructive"}>
                        {e.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{e.evaluator}</TableCell>
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
