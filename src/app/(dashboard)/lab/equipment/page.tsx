"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Plus, Save, Search } from "lucide-react";

interface TestEquipment {
  id: number;
  equipmentNo: string;
  equipmentName: string;
  manufacturer: string;
  model: string;
  testCapability: string;
  acquisitionDate: string;
  calibrationCycle: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  status: string;
}

export default function LabEquipmentPage() {
  const [records, setRecords] = useState<TestEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    equipmentNo: "",
    equipmentName: "",
    manufacturer: "",
    model: "",
    testCapability: "",
    acquisitionDate: "",
    calibrationCycle: "",
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TestEquipment = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      equipmentNo: "",
      equipmentName: "",
      manufacturer: "",
      model: "",
      testCapability: "",
      acquisitionDate: "",
      calibrationCycle: "",
      lastCalibrationDate: "",
      nextCalibrationDate: "",
      status: "",
    });
    alert("시험장비가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.equipmentNo.toLowerCase().includes(search.toLowerCase()) ||
      r.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      r.testCapability.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "success";
      case "교정중":
        return "warning";
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
          <h1 className="text-3xl font-bold">시험장비관리</h1>
          <p className="text-muted-foreground">시험장비 이력카드 및 보유현황 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          장비 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>시험장비 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>장비번호 *</Label>
                  <Input
                    value={formData.equipmentNo}
                    onChange={(e) => setFormData({ ...formData, equipmentNo: e.target.value })}
                    placeholder="TE-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>장비명 *</Label>
                  <Input
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="장비명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>제조사</Label>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="제조사를 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label>모델명</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="모델명을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>시험능력 *</Label>
                  <Input
                    value={formData.testCapability}
                    onChange={(e) => setFormData({ ...formData, testCapability: e.target.value })}
                    placeholder="온도시험 -40~150C, 습도시험 등"
                    required
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
                  <Label>교정주기 *</Label>
                  <Select value={formData.calibrationCycle} onValueChange={(v) => setFormData({ ...formData, calibrationCycle: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3개월">3개월</SelectItem>
                      <SelectItem value="6개월">6개월</SelectItem>
                      <SelectItem value="1년">1년</SelectItem>
                      <SelectItem value="2년">2년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>최종교정일</Label>
                  <Input
                    type="date"
                    value={formData.lastCalibrationDate}
                    onChange={(e) => setFormData({ ...formData, lastCalibrationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>차기교정일</Label>
                  <Input
                    type="date"
                    value={formData.nextCalibrationDate}
                    onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="교정중">교정중</SelectItem>
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
          placeholder="장비번호, 장비명, 시험능력으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            시험장비 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 시험장비가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>장비번호</TableHead>
                  <TableHead>장비명</TableHead>
                  <TableHead>제조사</TableHead>
                  <TableHead>모델명</TableHead>
                  <TableHead>시험능력</TableHead>
                  <TableHead>취득일자</TableHead>
                  <TableHead>교정주기</TableHead>
                  <TableHead>최종교정일</TableHead>
                  <TableHead>차기교정일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.equipmentNo}</TableCell>
                    <TableCell>{record.equipmentName}</TableCell>
                    <TableCell>{record.manufacturer || "-"}</TableCell>
                    <TableCell>{record.model || "-"}</TableCell>
                    <TableCell>{record.testCapability}</TableCell>
                    <TableCell>{record.acquisitionDate}</TableCell>
                    <TableCell>{record.calibrationCycle}</TableCell>
                    <TableCell>{record.lastCalibrationDate || "-"}</TableCell>
                    <TableCell>{record.nextCalibrationDate || "-"}</TableCell>
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
