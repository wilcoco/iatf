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
import { Plus, Save, Wrench } from "lucide-react";

interface ReworkStandard {
  id: number;
  documentNo: string;
  processType: string;
  partName: string;
  defectType: string;
  reworkMethod: string;
  qualityCheck: string;
  effectiveDate: string;
  revision: string;
  status: string;
}

export default function ReworkStandardPage() {
  const [items, setItems] = useState<ReworkStandard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    documentNo: "",
    processType: "",
    partName: "",
    defectType: "",
    reworkMethod: "",
    qualityCheck: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    revision: "",
    status: "",
  });

  const processTypeLabels: Record<string, string> = {
    painting: "도장",
    assembly: "조립",
    injection: "사출",
  };

  const statusLabels: Record<string, string> = {
    active: "유효",
    draft: "작성중",
    expired: "만료",
    revision: "개정중",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    active: "success",
    draft: "default",
    expired: "destructive",
    revision: "warning",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: ReworkStandard = {
      id: Date.now(),
      documentNo: formData.documentNo,
      processType: formData.processType,
      partName: formData.partName,
      defectType: formData.defectType,
      reworkMethod: formData.reworkMethod,
      qualityCheck: formData.qualityCheck,
      effectiveDate: formData.effectiveDate,
      revision: formData.revision,
      status: formData.status,
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData({
      documentNo: "",
      processType: "",
      partName: "",
      defectType: "",
      reworkMethod: "",
      qualityCheck: "",
      effectiveDate: new Date().toISOString().split("T")[0],
      revision: "",
      status: "",
    });
    alert("재작업표준서가 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">재작업표준서</h1>
          <p className="text-muted-foreground">재작업 표준 문서 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          표준서 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>재작업표준서 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>문서번호 *</Label>
                  <Input
                    value={formData.documentNo}
                    onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                    placeholder="RW-2024-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>공정유형 *</Label>
                  <Select value={formData.processType} onValueChange={(v) => setFormData({ ...formData, processType: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="painting">도장</SelectItem>
                      <SelectItem value="assembly">조립</SelectItem>
                      <SelectItem value="injection">사출</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label>불량유형 *</Label>
                  <Input
                    value={formData.defectType}
                    onChange={(e) => setFormData({ ...formData, defectType: e.target.value })}
                    placeholder="불량 유형"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>재작업방법 *</Label>
                  <Textarea
                    value={formData.reworkMethod}
                    onChange={(e) => setFormData({ ...formData, reworkMethod: e.target.value })}
                    placeholder="재작업 방법 상세 기술"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품질검사 *</Label>
                  <Textarea
                    value={formData.qualityCheck}
                    onChange={(e) => setFormData({ ...formData, qualityCheck: e.target.value })}
                    placeholder="품질검사 항목 및 기준"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
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
                  <Label>리비전 *</Label>
                  <Input
                    value={formData.revision}
                    onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                    placeholder="A, B, C..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">유효</SelectItem>
                      <SelectItem value="draft">작성중</SelectItem>
                      <SelectItem value="expired">만료</SelectItem>
                      <SelectItem value="revision">개정중</SelectItem>
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
            <Wrench className="h-5 w-5" />
            재작업표준서 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 재작업표준서가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>문서번호</TableHead>
                  <TableHead>공정유형</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>불량유형</TableHead>
                  <TableHead>재작업방법</TableHead>
                  <TableHead>품질검사</TableHead>
                  <TableHead>시행일자</TableHead>
                  <TableHead>리비전</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.documentNo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{processTypeLabels[item.processType] || item.processType}</Badge>
                    </TableCell>
                    <TableCell>{item.partName}</TableCell>
                    <TableCell>{item.defectType}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.reworkMethod}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.qualityCheck}</TableCell>
                    <TableCell>{item.effectiveDate}</TableCell>
                    <TableCell>{item.revision}</TableCell>
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
