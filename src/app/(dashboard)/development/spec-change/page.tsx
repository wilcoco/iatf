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
import { Plus, Save, FileEdit } from "lucide-react";

interface SpecChange {
  id: number;
  changeDate: string;
  specNo: string;
  partName: string;
  changeDescription: string;
  reason: string;
  beforeSpec: string;
  afterSpec: string;
  approver: string;
  status: string;
}

export default function SpecChangePage() {
  const [items, setItems] = useState<SpecChange[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    changeDate: new Date().toISOString().split("T")[0],
    specNo: "",
    partName: "",
    changeDescription: "",
    reason: "",
    beforeSpec: "",
    afterSpec: "",
    approver: "",
    status: "",
  });

  const statusLabels: Record<string, string> = {
    requested: "신청",
    reviewing: "검토중",
    approved: "승인",
    rejected: "반려",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    requested: "default",
    reviewing: "warning",
    approved: "success",
    rejected: "destructive",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: SpecChange = {
      id: Date.now(),
      changeDate: formData.changeDate,
      specNo: formData.specNo,
      partName: formData.partName,
      changeDescription: formData.changeDescription,
      reason: formData.reason,
      beforeSpec: formData.beforeSpec,
      afterSpec: formData.afterSpec,
      approver: formData.approver,
      status: formData.status,
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      changeDate: new Date().toISOString().split("T")[0],
      specNo: "",
      partName: "",
      changeDescription: "",
      reason: "",
      beforeSpec: "",
      afterSpec: "",
      approver: "",
      status: "",
    });
    alert("기술사양변경이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">기술사양변경</h1>
          <p className="text-muted-foreground">기술사양 변경 이력 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          변경 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>기술사양변경 등록</CardTitle>
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
                  <Label>사양번호 *</Label>
                  <Input
                    value={formData.specNo}
                    onChange={(e) => setFormData({ ...formData, specNo: e.target.value })}
                    placeholder="SPEC-2024-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>부품명 *</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="부품명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">신청</SelectItem>
                      <SelectItem value="reviewing">검토중</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="rejected">반려</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>변경전 사양 *</Label>
                  <Textarea
                    value={formData.beforeSpec}
                    onChange={(e) => setFormData({ ...formData, beforeSpec: e.target.value })}
                    placeholder="변경 전 사양 내용"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>변경후 사양 *</Label>
                  <Textarea
                    value={formData.afterSpec}
                    onChange={(e) => setFormData({ ...formData, afterSpec: e.target.value })}
                    placeholder="변경 후 사양 내용"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>변경내용 *</Label>
                  <Input
                    value={formData.changeDescription}
                    onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                    placeholder="변경 내용 요약"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>변경사유 *</Label>
                  <Input
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="변경 사유"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인자 *</Label>
                  <Input
                    value={formData.approver}
                    onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                    placeholder="승인자명"
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
            <FileEdit className="h-5 w-5" />
            기술사양변경 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">기술사양변경 이력이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>변경일자</TableHead>
                  <TableHead>사양번호</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>변경내용</TableHead>
                  <TableHead>변경사유</TableHead>
                  <TableHead>변경전</TableHead>
                  <TableHead>변경후</TableHead>
                  <TableHead>승인자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.changeDate}</TableCell>
                    <TableCell className="font-mono">{item.specNo}</TableCell>
                    <TableCell>{item.partName}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.changeDescription}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.reason}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.beforeSpec}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.afterSpec}</TableCell>
                    <TableCell>{item.approver}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[item.status] || "default"}>
                        {statusLabels[item.status] || item.status}
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
