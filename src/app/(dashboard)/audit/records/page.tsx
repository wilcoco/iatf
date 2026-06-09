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
import { Search, Plus, Save } from "lucide-react";

interface AuditRecord {
  id: number;
  auditDate: string;
  auditType: string;
  auditArea: string;
  auditor: string;
  auditee: string;
  checklistItems: number;
  conformItems: number;
  ncMajor: number;
  ncMinor: number;
  observations: number;
  result: string;
  summary: string;
}

export default function AuditRecordsPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    auditDate: new Date().toISOString().split("T")[0],
    auditType: "",
    auditArea: "",
    auditor: "",
    auditee: "",
    checklistItems: "",
    conformItems: "",
    ncMajor: "0",
    ncMinor: "0",
    observations: "0",
    summary: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ncMajor = Number(formData.ncMajor) || 0;
    const ncMinor = Number(formData.ncMinor) || 0;
    const result = ncMajor > 0 ? "부적합" : ncMinor > 0 ? "조건부적합" : "적합";

    const newRecord: AuditRecord = {
      id: Date.now(),
      auditDate: formData.auditDate,
      auditType: formData.auditType,
      auditArea: formData.auditArea,
      auditor: formData.auditor,
      auditee: formData.auditee,
      checklistItems: Number(formData.checklistItems),
      conformItems: Number(formData.conformItems),
      ncMajor,
      ncMinor,
      observations: Number(formData.observations),
      result,
      summary: formData.summary,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      auditDate: new Date().toISOString().split("T")[0],
      auditType: "",
      auditArea: "",
      auditor: "",
      auditee: "",
      checklistItems: "",
      conformItems: "",
      ncMajor: "0",
      ncMinor: "0",
      observations: "0",
      summary: "",
    });
    alert("심사실적이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">심사실적</h1>
          <p className="text-muted-foreground">내부심사 실적 및 결과 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          실적 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>심사실적 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>심사일자 *</Label>
                  <Input
                    type="date"
                    value={formData.auditDate}
                    onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>심사유형 *</Label>
                  <Select value={formData.auditType} onValueChange={(v) => setFormData({ ...formData, auditType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="시스템심사">시스템심사</SelectItem>
                      <SelectItem value="프로세스심사">프로세스심사</SelectItem>
                      <SelectItem value="제품심사">제품심사</SelectItem>
                      <SelectItem value="VDA6.3">VDA 6.3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>심사영역 *</Label>
                  <Input
                    value={formData.auditArea}
                    onChange={(e) => setFormData({ ...formData, auditArea: e.target.value })}
                    placeholder="부서/프로세스명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>심사원 *</Label>
                  <Input
                    value={formData.auditor}
                    onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                    placeholder="심사원명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>피심사자</Label>
                  <Input
                    value={formData.auditee}
                    onChange={(e) => setFormData({ ...formData, auditee: e.target.value })}
                    placeholder="피심사자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검항목 수</Label>
                  <Input
                    type="number"
                    value={formData.checklistItems}
                    onChange={(e) => setFormData({ ...formData, checklistItems: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>중부적합 (Major)</Label>
                  <Input
                    type="number"
                    value={formData.ncMajor}
                    onChange={(e) => setFormData({ ...formData, ncMajor: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>경부적합 (Minor)</Label>
                  <Input
                    type="number"
                    value={formData.ncMinor}
                    onChange={(e) => setFormData({ ...formData, ncMinor: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>관찰사항 (OBS)</Label>
                  <Input
                    type="number"
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>심사결과 요약</Label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="심사 결과 요약 및 주요 발견사항"
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
            <Search className="h-5 w-5" />
            심사실적 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">심사 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>심사일자</TableHead>
                  <TableHead>심사유형</TableHead>
                  <TableHead>심사영역</TableHead>
                  <TableHead>심사원</TableHead>
                  <TableHead className="text-right">Major</TableHead>
                  <TableHead className="text-right">Minor</TableHead>
                  <TableHead className="text-right">OBS</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.auditDate}</TableCell>
                    <TableCell><Badge variant="outline">{record.auditType}</Badge></TableCell>
                    <TableCell>{record.auditArea}</TableCell>
                    <TableCell>{record.auditor}</TableCell>
                    <TableCell className="text-right text-red-600 font-bold">{record.ncMajor}</TableCell>
                    <TableCell className="text-right text-orange-600">{record.ncMinor}</TableCell>
                    <TableCell className="text-right text-blue-600">{record.observations}</TableCell>
                    <TableCell>
                      <Badge variant={
                        record.result === "적합" ? "success" :
                        record.result === "조건부적합" ? "warning" : "destructive"
                      }>
                        {record.result}
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
