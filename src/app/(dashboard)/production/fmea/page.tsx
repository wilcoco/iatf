"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Save } from "lucide-react";

interface FmeaRecord {
  id: number;
  documentNo: string;
  vehicleType: string;
  processName: string;
  failureMode: string;
  effect: string;
  cause: string;
  severity: number;
  occurrence: number;
  detection: number;
  rpn: number;
  recommendedAction: string;
  status: string;
}

export default function FmeaPage() {
  const [records, setRecords] = useState<FmeaRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    documentNo: "",
    vehicleType: "",
    processName: "",
    failureMode: "",
    effect: "",
    cause: "",
    severity: "",
    occurrence: "",
    detection: "",
    recommendedAction: "",
    status: "",
  });

  const calculateRpn = () => {
    const s = parseInt(formData.severity) || 0;
    const o = parseInt(formData.occurrence) || 0;
    const d = parseInt(formData.detection) || 0;
    return s * o * d;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rpn = calculateRpn();
    const newRecord: FmeaRecord = {
      id: Date.now(),
      documentNo: formData.documentNo,
      vehicleType: formData.vehicleType,
      processName: formData.processName,
      failureMode: formData.failureMode,
      effect: formData.effect,
      cause: formData.cause,
      severity: parseInt(formData.severity) || 0,
      occurrence: parseInt(formData.occurrence) || 0,
      detection: parseInt(formData.detection) || 0,
      rpn,
      recommendedAction: formData.recommendedAction,
      status: formData.status,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      documentNo: "",
      vehicleType: "",
      processName: "",
      failureMode: "",
      effect: "",
      cause: "",
      severity: "",
      occurrence: "",
      detection: "",
      recommendedAction: "",
      status: "",
    });
    alert("FMEA 기록이 저장되었습니다.");
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "완료": return "success";
      case "진행중": return "warning";
      case "미착수": return "secondary";
      default: return "outline";
    }
  };

  const rpnVariant = (rpn: number) => {
    if (rpn >= 100) return "error";
    if (rpn >= 50) return "warning";
    return "success";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공정FMEA</h1>
          <p className="text-muted-foreground">공정 고장모드 영향분석 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          FMEA 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>FMEA 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>문서번호 *</Label>
                  <Input
                    value={formData.documentNo}
                    onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                    placeholder="PFMEA-2026-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>차종 *</Label>
                  <Input
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="차종명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>공정명 *</Label>
                  <Input
                    value={formData.processName}
                    onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                    placeholder="공정명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="미착수">미착수</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>고장모드 *</Label>
                  <Input
                    value={formData.failureMode}
                    onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                    placeholder="고장모드"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>영향</Label>
                  <Input
                    value={formData.effect}
                    onChange={(e) => setFormData({ ...formData, effect: e.target.value })}
                    placeholder="영향"
                  />
                </div>
                <div className="space-y-2">
                  <Label>원인</Label>
                  <Input
                    value={formData.cause}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    placeholder="원인"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>심각도 (S) *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    placeholder="1-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>발생도 (O) *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.occurrence}
                    onChange={(e) => setFormData({ ...formData, occurrence: e.target.value })}
                    placeholder="1-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>검출도 (D) *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.detection}
                    onChange={(e) => setFormData({ ...formData, detection: e.target.value })}
                    placeholder="1-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>RPN</Label>
                  <Input
                    type="text"
                    value={calculateRpn()}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>권장조치</Label>
                <Textarea
                  value={formData.recommendedAction}
                  onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
                  placeholder="권장 조치 사항을 입력하세요"
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
            <AlertTriangle className="h-5 w-5" />
            FMEA 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 FMEA 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>문서번호</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>공정명</TableHead>
                  <TableHead>고장모드</TableHead>
                  <TableHead className="text-center">S</TableHead>
                  <TableHead className="text-center">O</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">RPN</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.documentNo}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.processName}</TableCell>
                    <TableCell>{record.failureMode}</TableCell>
                    <TableCell className="text-center">{record.severity}</TableCell>
                    <TableCell className="text-center">{record.occurrence}</TableCell>
                    <TableCell className="text-center">{record.detection}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rpnVariant(record.rpn)}>{record.rpn}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(record.status)}>{record.status}</Badge>
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
