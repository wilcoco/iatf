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
import { BarChart3, Plus, Save, TrendingUp, TrendingDown } from "lucide-react";

interface KpiResult {
  id: number;
  yearMonth: string;
  kpiName: string;
  category: string;
  unit: string;
  targetValue: number;
  actualValue: number;
  achievementRate: number;
  status: string;
  actionRequired: string;
}

export default function KpiResultsPage() {
  const [results, setResults] = useState<KpiResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    yearMonth: new Date().toISOString().slice(0, 7),
    kpiName: "",
    category: "",
    unit: "",
    targetValue: "",
    actualValue: "",
    actionRequired: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetValue = Number(formData.targetValue) || 0;
    const actualValue = Number(formData.actualValue) || 0;
    const achievementRate = targetValue > 0 ? (actualValue / targetValue) * 100 : 0;
    const status = achievementRate >= 100 ? "달성" : "미달성";

    const newResult: KpiResult = {
      id: Date.now(),
      yearMonth: formData.yearMonth,
      kpiName: formData.kpiName,
      category: formData.category,
      unit: formData.unit,
      targetValue,
      actualValue,
      achievementRate: Math.round(achievementRate * 10) / 10,
      status,
      actionRequired: formData.actionRequired,
    };
    setResults([newResult, ...results]);
    setShowForm(false);
    setFormData({
      yearMonth: new Date().toISOString().slice(0, 7),
      kpiName: "",
      category: "",
      unit: "",
      targetValue: "",
      actualValue: "",
      actionRequired: "",
    });
    alert("KPI 실적이 등록되었습니다.");
  };

  const achievedCount = results.filter((r) => r.status === "달성").length;
  const missedCount = results.filter((r) => r.status === "미달성").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KPI 실적</h1>
          <p className="text-muted-foreground">핵심성과지표 실적 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          실적 등록
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">달성 항목</p>
                <p className="text-2xl font-bold text-green-600">{achievedCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">미달성 항목</p>
                <p className="text-2xl font-bold text-red-600">{missedCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">달성률</p>
                <p className="text-2xl font-bold">
                  {results.length > 0 ? Math.round((achievedCount / results.length) * 100) : 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>KPI 실적 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>기준년월 *</Label>
                  <Input
                    type="month"
                    value={formData.yearMonth}
                    onChange={(e) => setFormData({ ...formData, yearMonth: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>KPI명 *</Label>
                  <Input
                    value={formData.kpiName}
                    onChange={(e) => setFormData({ ...formData, kpiName: e.target.value })}
                    placeholder="KPI 항목명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>분류</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="품질">품질</SelectItem>
                      <SelectItem value="생산">생산</SelectItem>
                      <SelectItem value="원가">원가</SelectItem>
                      <SelectItem value="납기">납기</SelectItem>
                      <SelectItem value="안전">안전</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>단위</Label>
                  <Input
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="%, ppm, 건"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>목표값 *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>실적값 *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.actualValue}
                    onChange={(e) => setFormData({ ...formData, actualValue: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>미달성시 개선대책</Label>
                <Textarea
                  value={formData.actionRequired}
                  onChange={(e) => setFormData({ ...formData, actionRequired: e.target.value })}
                  placeholder="미달성시 개선 대책 기술"
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
            <BarChart3 className="h-5 w-5" />
            KPI 실적 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">실적 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기준년월</TableHead>
                  <TableHead>KPI명</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead className="text-right">목표</TableHead>
                  <TableHead className="text-right">실적</TableHead>
                  <TableHead className="text-right">달성률</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.yearMonth}</TableCell>
                    <TableCell className="font-medium">{result.kpiName}</TableCell>
                    <TableCell><Badge variant="outline">{result.category || "-"}</Badge></TableCell>
                    <TableCell className="text-right">{result.targetValue}{result.unit}</TableCell>
                    <TableCell className="text-right font-mono">{result.actualValue}{result.unit}</TableCell>
                    <TableCell className="text-right font-bold">{result.achievementRate}%</TableCell>
                    <TableCell>
                      <Badge variant={result.status === "달성" ? "success" : "destructive"}>
                        {result.status}
                      </Badge>
                    </TableCell>
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
