"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, FileOutput } from "lucide-react";

interface DrawingIssue {
  id: number;
  issueDate: string;
  drawingNo: string;
  drawingName: string;
  revision: string;
  recipient: string;
  purpose: string;
  approver: string;
  returnDate: string;
  status: string;
}

export default function DrawingIssuePage() {
  const [items, setItems] = useState<DrawingIssue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    issueDate: new Date().toISOString().split("T")[0],
    drawingNo: "",
    drawingName: "",
    revision: "",
    recipient: "",
    purpose: "",
    approver: "",
    returnDate: "",
    status: "",
  });

  const statusLabels: Record<string, string> = {
    issued: "불출",
    returned: "반납",
    overdue: "연체",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    issued: "warning",
    returned: "success",
    overdue: "destructive",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: DrawingIssue = {
      id: Date.now(),
      issueDate: formData.issueDate,
      drawingNo: formData.drawingNo,
      drawingName: formData.drawingName,
      revision: formData.revision,
      recipient: formData.recipient,
      purpose: formData.purpose,
      approver: formData.approver,
      returnDate: formData.returnDate,
      status: formData.status,
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      issueDate: new Date().toISOString().split("T")[0],
      drawingNo: "",
      drawingName: "",
      revision: "",
      recipient: "",
      purpose: "",
      approver: "",
      returnDate: "",
      status: "",
    });
    alert("도면불출이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">도면불출대장</h1>
          <p className="text-muted-foreground">도면 불출/배포 이력 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          불출 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>도면불출 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>불출일자 *</Label>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>도면번호 *</Label>
                  <Input
                    value={formData.drawingNo}
                    onChange={(e) => setFormData({ ...formData, drawingNo: e.target.value })}
                    placeholder="DWG-2024-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>도면명 *</Label>
                  <Input
                    value={formData.drawingName}
                    onChange={(e) => setFormData({ ...formData, drawingName: e.target.value })}
                    placeholder="도면명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>리비전 *</Label>
                  <Input
                    value={formData.revision}
                    onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                    placeholder="A, B, C..."
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>수령자 (협력사/부서) *</Label>
                  <Input
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder="협력사명 또는 부서명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>불출목적 *</Label>
                  <Input
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="불출 목적"
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
                <div className="space-y-2">
                  <Label>반납예정일</Label>
                  <Input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issued">불출</SelectItem>
                      <SelectItem value="returned">반납</SelectItem>
                      <SelectItem value="overdue">연체</SelectItem>
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
            <FileOutput className="h-5 w-5" />
            도면불출 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">도면불출 이력이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>불출일자</TableHead>
                  <TableHead>도면번호</TableHead>
                  <TableHead>도면명</TableHead>
                  <TableHead>리비전</TableHead>
                  <TableHead>수령자</TableHead>
                  <TableHead>불출목적</TableHead>
                  <TableHead>승인자</TableHead>
                  <TableHead>반납예정일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.issueDate}</TableCell>
                    <TableCell className="font-mono">{item.drawingNo}</TableCell>
                    <TableCell>{item.drawingName}</TableCell>
                    <TableCell>{item.revision}</TableCell>
                    <TableCell>{item.recipient}</TableCell>
                    <TableCell>{item.purpose}</TableCell>
                    <TableCell>{item.approver}</TableCell>
                    <TableCell>{item.returnDate || "-"}</TableCell>
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
