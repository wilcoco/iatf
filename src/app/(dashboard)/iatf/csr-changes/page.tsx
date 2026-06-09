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
import { FileText, Plus, Save, Search } from "lucide-react";

interface CSRChangeRecord {
  id: number;
  changeDate: string;
  customer: string;
  requirementType: string;
  changeDescription: string;
  internalStandardsUpdated: string;
  actionPlan: string;
  responsiblePerson: string;
  completionDate: string;
  status: string;
}

export default function CSRChangesPage() {
  const [records, setRecords] = useState<CSRChangeRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    changeDate: new Date().toISOString().split("T")[0],
    customer: "",
    requirementType: "",
    changeDescription: "",
    internalStandardsUpdated: "",
    actionPlan: "",
    responsiblePerson: "",
    completionDate: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CSRChangeRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      changeDate: new Date().toISOString().split("T")[0],
      customer: "",
      requirementType: "",
      changeDescription: "",
      internalStandardsUpdated: "",
      actionPlan: "",
      responsiblePerson: "",
      completionDate: "",
      status: "",
    });
    alert("CSR 변경 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.requirementType.toLowerCase().includes(search.toLowerCase()) ||
      r.changeDescription.toLowerCase().includes(search.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold">CSR 변경관리</h1>
          <p className="text-muted-foreground">고객별 요구사항 변경 추적 (품질5스타, SQ 평가기준, 품질보증 매뉴얼)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          CSR 변경 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>CSR 변경 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>변경일자 *</Label>
                  <Input
                    type="date"
                    value={formData.changeDate}
                    onChange={(e) => setFormData({ ...formData, changeDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>고객사 *</Label>
                  <Input
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="현대자동차"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>요구사항 유형 *</Label>
                  <Select value={formData.requirementType} onValueChange={(v) => setFormData({ ...formData, requirementType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="품질5스타">품질5스타</SelectItem>
                      <SelectItem value="SQ 평가기준">SQ 평가기준</SelectItem>
                      <SelectItem value="품질보증 매뉴얼">품질보증 매뉴얼</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="space-y-2">
                <Label>변경 내용 *</Label>
                <Textarea
                  value={formData.changeDescription}
                  onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                  placeholder="변경된 요구사항 내용을 입력하세요"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>내부 기준서 갱신 현황</Label>
                  <Textarea
                    value={formData.internalStandardsUpdated}
                    onChange={(e) => setFormData({ ...formData, internalStandardsUpdated: e.target.value })}
                    placeholder="갱신이 필요한/완료된 내부 기준서를 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label>조치 계획</Label>
                  <Textarea
                    value={formData.actionPlan}
                    onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                    placeholder="조치 계획을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>완료일</Label>
                  <Input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
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
          placeholder="고객사, 요구사항 유형, 변경 내용, 담당자로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSR 변경 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">CSR 변경 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>변경일자</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>요구사항 유형</TableHead>
                  <TableHead>변경 내용</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>완료일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.changeDate}</TableCell>
                    <TableCell>{record.customer}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.requirementType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={record.changeDescription}>
                      {record.changeDescription}
                    </TableCell>
                    <TableCell>{record.responsiblePerson}</TableCell>
                    <TableCell>{record.completionDate || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
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
