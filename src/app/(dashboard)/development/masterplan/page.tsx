"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, FileText } from "lucide-react";

interface MasterPlanItem {
  id: number;
  projectNo: string;
  vehicleType: string;
  milestone: string;
  plannedDate: string;
  actualDate: string;
  deliverables: string;
  responsibleDept: string;
  status: string;
}

export default function MasterPlanPage() {
  const [items, setItems] = useState<MasterPlanItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectNo: "",
    vehicleType: "",
    milestone: "",
    plannedDate: "",
    actualDate: "",
    deliverables: "",
    responsibleDept: "",
    status: "",
  });

  const statusLabels: Record<string, string> = {
    planned: "계획",
    inProgress: "진행중",
    completed: "완료",
    delayed: "지연",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    planned: "default",
    inProgress: "warning",
    completed: "success",
    delayed: "destructive",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MasterPlanItem = {
      id: Date.now(),
      projectNo: formData.projectNo,
      vehicleType: formData.vehicleType,
      milestone: formData.milestone,
      plannedDate: formData.plannedDate,
      actualDate: formData.actualDate,
      deliverables: formData.deliverables,
      responsibleDept: formData.responsibleDept,
      status: formData.status,
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      projectNo: "",
      vehicleType: "",
      milestone: "",
      plannedDate: "",
      actualDate: "",
      deliverables: "",
      responsibleDept: "",
      status: "",
    });
    alert("마스터플랜이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">마스터플랜</h1>
          <p className="text-muted-foreground">신차개발 마스터플랜 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          마스터플랜 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>마스터플랜 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>프로젝트번호 *</Label>
                  <Input
                    value={formData.projectNo}
                    onChange={(e) => setFormData({ ...formData, projectNo: e.target.value })}
                    placeholder="PRJ-2024-001"
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
                  <Label>마일스톤 *</Label>
                  <Input
                    value={formData.milestone}
                    onChange={(e) => setFormData({ ...formData, milestone: e.target.value })}
                    placeholder="P1, P2, SOP 등"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">계획</SelectItem>
                      <SelectItem value="inProgress">진행중</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="delayed">지연</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>계획일자 *</Label>
                  <Input
                    type="date"
                    value={formData.plannedDate}
                    onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>실적일자</Label>
                  <Input
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>산출물 *</Label>
                  <Input
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                    placeholder="산출물 명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>담당부서 *</Label>
                  <Input
                    value={formData.responsibleDept}
                    onChange={(e) => setFormData({ ...formData, responsibleDept: e.target.value })}
                    placeholder="담당부서명"
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
            <FileText className="h-5 w-5" />
            마스터플랜 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 마스터플랜이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>프로젝트번호</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>마일스톤</TableHead>
                  <TableHead>계획일자</TableHead>
                  <TableHead>실적일자</TableHead>
                  <TableHead>산출물</TableHead>
                  <TableHead>담당부서</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.projectNo}</TableCell>
                    <TableCell>{item.vehicleType}</TableCell>
                    <TableCell>{item.milestone}</TableCell>
                    <TableCell>{item.plannedDate}</TableCell>
                    <TableCell>{item.actualDate || "-"}</TableCell>
                    <TableCell>{item.deliverables}</TableCell>
                    <TableCell>{item.responsibleDept}</TableCell>
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
