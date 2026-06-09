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
import { Plus, Save, RefreshCw } from "lucide-react";

interface FourMEOChange {
  id: number;
  requestDate: string;
  changeType: string;
  changeNo: string;
  vehicleType: string;
  partName: string;
  changeDescription: string;
  customer: string;
  submissionDate: string;
  approvalDate: string;
  status: string;
}

export default function FourMEOChangePage() {
  const [items, setItems] = useState<FourMEOChange[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split("T")[0],
    changeType: "",
    changeNo: "",
    vehicleType: "",
    partName: "",
    changeDescription: "",
    customer: "",
    submissionDate: "",
    approvalDate: "",
    status: "",
  });

  const statusLabels: Record<string, string> = {
    requested: "신청",
    pending: "승인대기",
    approved: "승인",
    rejected: "반려",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    requested: "default",
    pending: "warning",
    approved: "success",
    rejected: "destructive",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: FourMEOChange = {
      id: Date.now(),
      requestDate: formData.requestDate,
      changeType: formData.changeType,
      changeNo: formData.changeNo,
      vehicleType: formData.vehicleType,
      partName: formData.partName,
      changeDescription: formData.changeDescription,
      customer: formData.customer,
      submissionDate: formData.submissionDate,
      approvalDate: formData.approvalDate,
      status: formData.status,
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      requestDate: new Date().toISOString().split("T")[0],
      changeType: "",
      changeNo: "",
      vehicleType: "",
      partName: "",
      changeDescription: "",
      customer: "",
      submissionDate: "",
      approvalDate: "",
      status: "",
    });
    alert("4M/EO 변경이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">4M/EO 변경관리</h1>
          <p className="text-muted-foreground">4M 및 Engineering Order 변경관리 (고객사 제출 승인관리)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          변경 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>4M/EO 변경 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>신청일자 *</Label>
                  <Input
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>변경유형 *</Label>
                  <Select value={formData.changeType} onValueChange={(v) => setFormData({ ...formData, changeType: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4M">4M</SelectItem>
                      <SelectItem value="EO">EO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>변경번호 *</Label>
                  <Input
                    value={formData.changeNo}
                    onChange={(e) => setFormData({ ...formData, changeNo: e.target.value })}
                    placeholder="4M-2024-001"
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
              </div>

              <div className="grid gap-4 md:grid-cols-4">
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
                  <Label>고객사 *</Label>
                  <Input
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="고객사명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>제출일자</Label>
                  <Input
                    type="date"
                    value={formData.submissionDate}
                    onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인일자</Label>
                  <Input
                    type="date"
                    value={formData.approvalDate}
                    onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>변경내용 *</Label>
                  <Textarea
                    value={formData.changeDescription}
                    onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
                    placeholder="변경 내용 상세 기술"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">신청</SelectItem>
                      <SelectItem value="pending">승인대기</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="rejected">반려</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            4M/EO 변경 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">4M/EO 변경 이력이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>신청일자</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>변경번호</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>변경내용</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>제출일자</TableHead>
                  <TableHead>승인일자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.requestDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.changeType}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{item.changeNo}</TableCell>
                    <TableCell>{item.vehicleType}</TableCell>
                    <TableCell>{item.partName}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.changeDescription}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.submissionDate || "-"}</TableCell>
                    <TableCell>{item.approvalDate || "-"}</TableCell>
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
