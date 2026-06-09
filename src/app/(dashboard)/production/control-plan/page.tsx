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
import { FileText, Plus, Save } from "lucide-react";

interface ControlPlanRecord {
  id: number;
  documentNo: string;
  documentType: string;
  vehicleType: string;
  processName: string;
  revision: string;
  changeDescription: string;
  effectiveDate: string;
  status: string;
}

export default function ControlPlanPage() {
  const [records, setRecords] = useState<ControlPlanRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    documentNo: "",
    documentType: "",
    vehicleType: "",
    processName: "",
    revision: "",
    changeDescription: "",
    effectiveDate: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ControlPlanRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      documentNo: "",
      documentType: "",
      vehicleType: "",
      processName: "",
      revision: "",
      changeDescription: "",
      effectiveDate: "",
      status: "",
    });
    alert("문서가 저장되었습니다.");
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "승인": return "success";
      case "검토중": return "warning";
      case "폐기": return "error";
      case "작성중": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리계획서/작업표준서</h1>
          <p className="text-muted-foreground">관리계획서 및 작업표준서 문서 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          문서 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>문서 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>문서번호 *</Label>
                  <Input
                    value={formData.documentNo}
                    onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                    placeholder="CP-2026-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>문서유형 *</Label>
                  <Select value={formData.documentType} onValueChange={(v) => setFormData({ ...formData, documentType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="관리계획서">관리계획서</SelectItem>
                      <SelectItem value="작업표준서">작업표준서</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>개정번호 *</Label>
                  <Input
                    value={formData.revision}
                    onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                    placeholder="Rev.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>시행일자 *</Label>
                  <Input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="작성중">작성중</SelectItem>
                      <SelectItem value="검토중">검토중</SelectItem>
                      <SelectItem value="승인">승인</SelectItem>
                      <SelectItem value="폐기">폐기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>변경사항</Label>
                <Textarea
                  value={formData.changeDescription}
                  onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                  placeholder="개정 사유 및 변경 내용을 입력하세요"
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
            문서 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 문서가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>문서번호</TableHead>
                  <TableHead>문서유형</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>공정명</TableHead>
                  <TableHead>개정번호</TableHead>
                  <TableHead>시행일자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.documentNo}</TableCell>
                    <TableCell><Badge variant="outline">{record.documentType}</Badge></TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.processName}</TableCell>
                    <TableCell>{record.revision}</TableCell>
                    <TableCell>{record.effectiveDate}</TableCell>
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
