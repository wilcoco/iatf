"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, Plus, Save, Search } from "lucide-react";

interface SICheckRecord {
  id: number;
  checkDate: string;
  siNumber: string;
  description: string;
  impactAnalysis: string;
  actionRequired: string;
  responsiblePerson: string;
  dueDate: string;
  status: string;
  remarks: string;
}

export default function SISChecklistPage() {
  const [records, setRecords] = useState<SICheckRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    siNumber: "",
    description: "",
    impactAnalysis: "",
    actionRequired: "",
    responsiblePerson: "",
    dueDate: "",
    status: "",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SICheckRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      checkDate: new Date().toISOString().split("T")[0],
      siNumber: "",
      description: "",
      impactAnalysis: "",
      actionRequired: "",
      responsiblePerson: "",
      dueDate: "",
      status: "",
      remarks: "",
    });
    alert("SI 점검 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.siNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.responsiblePerson.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "완료":
        return "success";
      case "진행중":
        return "warning";
      case "미착수":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IATF SIs 점검</h1>
          <p className="text-muted-foreground">IATF 16949 변경사항 추적 (www.iatfglobaloversight.org)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          SI 점검 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>SI 점검 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>점검일자 *</Label>
                  <Input
                    type="date"
                    value={formData.checkDate}
                    onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>SI 번호 *</Label>
                  <Input
                    value={formData.siNumber}
                    onChange={(e) => setFormData({ ...formData, siNumber: e.target.value })}
                    placeholder="SI-2024-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>담당자 *</Label>
                  <Input
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>완료예정일</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>변경 설명 *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="SI 변경 내용을 입력하세요"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>영향 분석</Label>
                  <Textarea
                    value={formData.impactAnalysis}
                    onChange={(e) => setFormData({ ...formData, impactAnalysis: e.target.value })}
                    placeholder="당사 QMS에 미치는 영향을 분석하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label>필요 조치</Label>
                  <Textarea
                    value={formData.actionRequired}
                    onChange={(e) => setFormData({ ...formData, actionRequired: e.target.value })}
                    placeholder="필요한 조치 사항을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="추가 메모"
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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="SI 번호, 설명, 담당자로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            SI 점검 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">SI 점검 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>점검일자</TableHead>
                  <TableHead>SI 번호</TableHead>
                  <TableHead>변경 설명</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>완료예정일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.checkDate}</TableCell>
                    <TableCell className="font-mono">{record.siNumber}</TableCell>
                    <TableCell className="max-w-xs truncate" title={record.description}>
                      {record.description}
                    </TableCell>
                    <TableCell>{record.responsiblePerson}</TableCell>
                    <TableCell>{record.dueDate || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.remarks || "-"}</TableCell>
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
