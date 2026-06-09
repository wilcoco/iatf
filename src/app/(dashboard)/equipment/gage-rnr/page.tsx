"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, Save } from "lucide-react";

interface GageRnrRecord {
  id: number;
  studyDate: string;
  instrumentNo: string;
  instrumentName: string;
  gageType: string;
  characteristic: string;
  tolerance: string;
  appraiserCount: number;
  trialCount: number;
  partCount: number;
  repeatability: string;
  reproducibility: string;
  gageRnr: string;
  ndc: string;
  result: string;
  evaluator: string;
}

export default function GageRnrPage() {
  const [records, setRecords] = useState<GageRnrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studyDate: new Date().toISOString().split("T")[0],
    instrumentNo: "",
    instrumentName: "",
    gageType: "",
    characteristic: "",
    tolerance: "",
    appraiserCount: "3",
    trialCount: "3",
    partCount: "10",
    repeatability: "",
    reproducibility: "",
    gageRnr: "",
    ndc: "",
    evaluator: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const getResult = (gageRnr: string) => {
    const value = parseFloat(gageRnr) || 0;
    if (value < 10) return "합격";
    if (value < 30) return "조건부";
    return "불합격";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = getResult(formData.gageRnr);
    const newRecord: GageRnrRecord = {
      id: Date.now(),
      studyDate: formData.studyDate,
      instrumentNo: formData.instrumentNo,
      instrumentName: formData.instrumentName,
      gageType: formData.gageType,
      characteristic: formData.characteristic,
      tolerance: formData.tolerance,
      appraiserCount: Number(formData.appraiserCount),
      trialCount: Number(formData.trialCount),
      partCount: Number(formData.partCount),
      repeatability: formData.repeatability,
      reproducibility: formData.reproducibility,
      gageRnr: formData.gageRnr,
      ndc: formData.ndc,
      result,
      evaluator: formData.evaluator,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      studyDate: new Date().toISOString().split("T")[0],
      instrumentNo: "",
      instrumentName: "",
      gageType: "",
      characteristic: "",
      tolerance: "",
      appraiserCount: "3",
      trialCount: "3",
      partCount: "10",
      repeatability: "",
      reproducibility: "",
      gageRnr: "",
      ndc: "",
      evaluator: "",
    });
    alert("Gage R&R 평가 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gage R&R</h1>
          <p className="text-muted-foreground">측정시스템 분석 (MSA) 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          평가 등록
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">판정 기준</p>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-green-600">{"< 10%: 합격"}</p>
              <p className="text-yellow-600">{"10~30%: 조건부"}</p>
              <p className="text-red-600">{"> 30%: 불합격"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">ndc 기준</p>
            <p className="text-2xl font-bold mt-2">5 이상</p>
            <p className="text-xs text-muted-foreground mt-1">구별가능 범주 수</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Gage R&R 평가 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>평가일자 *</Label>
                  <Input
                    type="date"
                    value={formData.studyDate}
                    onChange={(e) => setFormData({ ...formData, studyDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계측기번호 *</Label>
                  <Input
                    value={formData.instrumentNo}
                    onChange={(e) => setFormData({ ...formData, instrumentNo: e.target.value })}
                    placeholder="GA-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계측기명 *</Label>
                  <Input
                    value={formData.instrumentName}
                    onChange={(e) => setFormData({ ...formData, instrumentName: e.target.value })}
                    placeholder="버니어캘리퍼스"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계측기 유형 *</Label>
                  <Select value={formData.gageType} onValueChange={(v) => setFormData({ ...formData, gageType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="계량형">계량형</SelectItem>
                      <SelectItem value="계수형">계수형</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>측정특성</Label>
                  <Input
                    value={formData.characteristic}
                    onChange={(e) => setFormData({ ...formData, characteristic: e.target.value })}
                    placeholder="길이, 두께 등"
                  />
                </div>
                <div className="space-y-2">
                  <Label>공차</Label>
                  <Input
                    value={formData.tolerance}
                    onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })}
                    placeholder="0.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>평가자 수</Label>
                  <Input
                    type="number"
                    value={formData.appraiserCount}
                    onChange={(e) => setFormData({ ...formData, appraiserCount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>반복 횟수</Label>
                  <Input
                    type="number"
                    value={formData.trialCount}
                    onChange={(e) => setFormData({ ...formData, trialCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>반복성 (%)</Label>
                  <Input
                    value={formData.repeatability}
                    onChange={(e) => setFormData({ ...formData, repeatability: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>재현성 (%)</Label>
                  <Input
                    value={formData.reproducibility}
                    onChange={(e) => setFormData({ ...formData, reproducibility: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gage R&R (%) *</Label>
                  <Input
                    value={formData.gageRnr}
                    onChange={(e) => setFormData({ ...formData, gageRnr: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>ndc</Label>
                  <Input
                    value={formData.ndc}
                    onChange={(e) => setFormData({ ...formData, ndc: e.target.value })}
                    placeholder="0"
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
            <BarChart3 className="h-5 w-5" />
            Gage R&R 평가 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">평가 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>평가일자</TableHead>
                  <TableHead>계측기번호</TableHead>
                  <TableHead>계측기명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead className="text-right">반복성</TableHead>
                  <TableHead className="text-right">재현성</TableHead>
                  <TableHead className="text-right">R&R</TableHead>
                  <TableHead className="text-right">ndc</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>평가자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.studyDate}</TableCell>
                    <TableCell className="font-mono">{record.instrumentNo}</TableCell>
                    <TableCell>{record.instrumentName}</TableCell>
                    <TableCell><Badge variant="outline">{record.gageType}</Badge></TableCell>
                    <TableCell className="text-right font-mono">{record.repeatability || "-"}%</TableCell>
                    <TableCell className="text-right font-mono">{record.reproducibility || "-"}%</TableCell>
                    <TableCell className="text-right font-mono font-bold">{record.gageRnr}%</TableCell>
                    <TableCell className="text-right font-mono">{record.ndc || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={record.result === "합격" ? "success" : record.result === "조건부" ? "warning" : "destructive"}>
                        {record.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.evaluator}</TableCell>
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
