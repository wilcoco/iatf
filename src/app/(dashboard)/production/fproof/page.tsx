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
import { ShieldCheck, Plus, Save } from "lucide-react";

interface FproofRecord {
  id: number;
  checkDate: string;
  equipmentType: string;
  equipmentName: string;
  checkItems: string;
  result: string;
  actionTaken: string;
  inspector: string;
}

export default function FproofPage() {
  const [records, setRecords] = useState<FproofRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    equipmentType: "",
    equipmentName: "",
    checkItems: "",
    result: "",
    actionTaken: "",
    inspector: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: FproofRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      checkDate: new Date().toISOString().split("T")[0],
      equipmentType: "",
      equipmentName: "",
      checkItems: "",
      result: "",
      actionTaken: "",
      inspector: "",
    });
    alert("F/PROOF 검증 기록이 저장되었습니다.");
  };

  const resultVariant = (result: string) => {
    switch (result) {
      case "정상": return "success";
      case "이상": return "error";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">F/PROOF 검증</h1>
          <p className="text-muted-foreground">풀프루프 장치 검증 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          검증 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>F/PROOF 검증 등록</CardTitle>
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
                  <Label>장치유형 *</Label>
                  <Select value={formData.equipmentType} onValueChange={(v) => setFormData({ ...formData, equipmentType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사출호퍼">사출호퍼</SelectItem>
                      <SelectItem value="인터록">인터록</SelectItem>
                      <SelectItem value="복합기">복합기</SelectItem>
                      <SelectItem value="전장검사">전장검사</SelectItem>
                      <SelectItem value="이종검사">이종검사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>장치명 *</Label>
                  <Input
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="장치명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검자 *</Label>
                  <Input
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    placeholder="점검자명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>점검항목 *</Label>
                  <Textarea
                    value={formData.checkItems}
                    onChange={(e) => setFormData({ ...formData, checkItems: e.target.value })}
                    placeholder="점검 항목을 입력하세요"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>조치내용</Label>
                  <Textarea
                    value={formData.actionTaken}
                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                    placeholder="이상 시 조치 내용을 입력하세요"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="정상">정상</SelectItem>
                      <SelectItem value="이상">이상</SelectItem>
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
            <ShieldCheck className="h-5 w-5" />
            F/PROOF 검증 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 F/PROOF 검증 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>점검일자</TableHead>
                  <TableHead>장치유형</TableHead>
                  <TableHead>장치명</TableHead>
                  <TableHead>점검항목</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>점검자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.checkDate}</TableCell>
                    <TableCell><Badge variant="outline">{record.equipmentType}</Badge></TableCell>
                    <TableCell>{record.equipmentName}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.checkItems}</TableCell>
                    <TableCell>
                      <Badge variant={resultVariant(record.result)}>{record.result}</Badge>
                    </TableCell>
                    <TableCell>{record.inspector}</TableCell>
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
