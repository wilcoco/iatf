"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cog, Plus, Save, Search } from "lucide-react";

interface Equipment {
  id: number;
  equipmentNo: string;
  equipmentName: string;
  equipmentType: string;
  manufacturer: string;
  model: string;
  acquisitionDate: string;
  installLocation: string;
  specification: string;
  maintenanceCycle: string;
  responsiblePerson: string;
  status: string;
}

export default function EquipmentListPage() {
  const [records, setRecords] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    equipmentNo: "",
    equipmentName: "",
    equipmentType: "",
    manufacturer: "",
    model: "",
    acquisitionDate: new Date().toISOString().split("T")[0],
    installLocation: "",
    specification: "",
    maintenanceCycle: "",
    responsiblePerson: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: Equipment = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      equipmentNo: "",
      equipmentName: "",
      equipmentType: "",
      manufacturer: "",
      model: "",
      acquisitionDate: new Date().toISOString().split("T")[0],
      installLocation: "",
      specification: "",
      maintenanceCycle: "",
      responsiblePerson: "",
      status: "",
    });
    alert("설비가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.equipmentNo.toLowerCase().includes(search.toLowerCase()) ||
      r.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      r.installLocation.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "가동중":
        return "success";
      case "정지":
        return "secondary";
      case "수리중":
        return "warning";
      case "폐기":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비관리대장</h1>
          <p className="text-muted-foreground">설비등록관리대장 - Equipment Master List</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          설비 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>설비 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
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
                    placeholder="CNC 선반"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비유형 *</Label>
                  <Select value={formData.equipmentType} onValueChange={(v) => setFormData({ ...formData, equipmentType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="가공설비">가공설비</SelectItem>
                      <SelectItem value="조립설비">조립설비</SelectItem>
                      <SelectItem value="검사설비">검사설비</SelectItem>
                      <SelectItem value="운반설비">운반설비</SelectItem>
                      <SelectItem value="유틸리티">유틸리티</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>제조사</Label>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="제조사명"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>모델명</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="모델명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>취득일자 *</Label>
                  <Input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>설치위치 *</Label>
                  <Input
                    value={formData.installLocation}
                    onChange={(e) => setFormData({ ...formData, installLocation: e.target.value })}
                    placeholder="1공장 A라인"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>사양</Label>
                  <Input
                    value={formData.specification}
                    onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                    placeholder="주요 사양"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>보전주기</Label>
                  <Select value={formData.maintenanceCycle} onValueChange={(v) => setFormData({ ...formData, maintenanceCycle: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일일">일일</SelectItem>
                      <SelectItem value="주간">주간</SelectItem>
                      <SelectItem value="월간">월간</SelectItem>
                      <SelectItem value="분기">분기</SelectItem>
                      <SelectItem value="반기">반기</SelectItem>
                      <SelectItem value="연간">연간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>담당자 *</Label>
                  <Input
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                    placeholder="담당자명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="가동중">가동중</SelectItem>
                      <SelectItem value="정지">정지</SelectItem>
                      <SelectItem value="수리중">수리중</SelectItem>
                      <SelectItem value="폐기">폐기</SelectItem>
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
          placeholder="설비번호, 설비명, 설치위치로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            설비 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 설비가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>설비번호</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>설비유형</TableHead>
                  <TableHead>제조사</TableHead>
                  <TableHead>모델명</TableHead>
                  <TableHead>취득일자</TableHead>
                  <TableHead>설치위치</TableHead>
                  <TableHead>보전주기</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.equipmentNo}</TableCell>
                    <TableCell>{record.equipmentName}</TableCell>
                    <TableCell><Badge variant="outline">{record.equipmentType}</Badge></TableCell>
                    <TableCell>{record.manufacturer || "-"}</TableCell>
                    <TableCell>{record.model || "-"}</TableCell>
                    <TableCell>{record.acquisitionDate}</TableCell>
                    <TableCell>{record.installLocation}</TableCell>
                    <TableCell>{record.maintenanceCycle || "-"}</TableCell>
                    <TableCell>{record.responsiblePerson}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.status)}>
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
