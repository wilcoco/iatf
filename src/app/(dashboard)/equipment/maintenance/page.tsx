"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, Save } from "lucide-react";

interface MaintenanceRecord {
  id: number;
  maintenanceDate: string;
  equipmentNo: string;
  equipmentName: string;
  maintenanceType: string;
  plannedDate: string;
  workContent: string;
  partsReplaced: string;
  downtime: string;
  result: string;
  worker: string;
  remarks: string;
}

export default function MaintenancePage() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    maintenanceDate: new Date().toISOString().split("T")[0],
    equipmentNo: "",
    equipmentName: "",
    maintenanceType: "",
    plannedDate: "",
    workContent: "",
    partsReplaced: "",
    downtime: "",
    result: "",
    worker: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MaintenanceRecord = {
      id: Date.now(),
      maintenanceDate: formData.maintenanceDate,
      equipmentNo: formData.equipmentNo,
      equipmentName: formData.equipmentName,
      maintenanceType: formData.maintenanceType,
      plannedDate: formData.plannedDate,
      workContent: formData.workContent,
      partsReplaced: formData.partsReplaced,
      downtime: formData.downtime,
      result: formData.result,
      worker: formData.worker,
      remarks: formData.remarks,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      maintenanceDate: new Date().toISOString().split("T")[0],
      equipmentNo: "",
      equipmentName: "",
      maintenanceType: "",
      plannedDate: "",
      workContent: "",
      partsReplaced: "",
      downtime: "",
      result: "",
      worker: "",
      remarks: "",
    });
    alert("예방보전 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">예방보전</h1>
          <p className="text-muted-foreground">설비 예방보전 계획 및 실적 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          보전 기록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>예방보전 기록 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>보전일자 *</Label>
                  <Input
                    type="date"
                    value={formData.maintenanceDate}
                    onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계획일자</Label>
                  <Input
                    type="date"
                    value={formData.plannedDate}
                    onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비번호 *</Label>
                  <Input
                    value={formData.equipmentNo}
                    onChange={(e) => setFormData({ ...formData, equipmentNo: e.target.value })}
                    placeholder="EQ-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비명 *</Label>
                  <Input
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="설비명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>보전유형 *</Label>
                  <Select value={formData.maintenanceType} onValueChange={(v) => setFormData({ ...formData, maintenanceType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일상점검">일상점검</SelectItem>
                      <SelectItem value="정기점검">정기점검</SelectItem>
                      <SelectItem value="예방정비">예방정비</SelectItem>
                      <SelectItem value="사후보전">사후보전</SelectItem>
                      <SelectItem value="개량보전">개량보전</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>정지시간 (분)</Label>
                  <Input
                    value={formData.downtime}
                    onChange={(e) => setFormData({ ...formData, downtime: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="완료">완료</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="연기">연기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>작업자 *</Label>
                  <Input
                    value={formData.worker}
                    onChange={(e) => setFormData({ ...formData, worker: e.target.value })}
                    placeholder="작업자명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>작업내용</Label>
                  <Textarea
                    value={formData.workContent}
                    onChange={(e) => setFormData({ ...formData, workContent: e.target.value })}
                    placeholder="보전 작업 내용"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>교체부품</Label>
                  <Textarea
                    value={formData.partsReplaced}
                    onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
                    placeholder="교체된 부품 목록"
                    rows={3}
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
            <Wrench className="h-5 w-5" />
            예방보전 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">보전 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>보전일자</TableHead>
                  <TableHead>설비번호</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>보전유형</TableHead>
                  <TableHead>정지시간</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>작업자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.maintenanceDate}</TableCell>
                    <TableCell className="font-mono">{record.equipmentNo}</TableCell>
                    <TableCell>{record.equipmentName}</TableCell>
                    <TableCell><Badge variant="outline">{record.maintenanceType}</Badge></TableCell>
                    <TableCell>{record.downtime ? `${record.downtime}분` : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={record.result === "완료" ? "success" : "secondary"}>
                        {record.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.worker}</TableCell>
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
