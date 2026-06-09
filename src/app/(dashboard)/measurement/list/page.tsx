"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gauge, Plus, Save, Search } from "lucide-react";

interface MeasurementInstrument {
  id: number;
  instrumentNo: string;
  instrumentName: string;
  instrumentType: string;
  manufacturer: string;
  model: string;
  range: string;
  accuracy: string;
  calibrationCycle: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  location: string;
  status: string;
}

export default function MeasurementListPage() {
  const [records, setRecords] = useState<MeasurementInstrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    instrumentNo: "",
    instrumentName: "",
    instrumentType: "",
    manufacturer: "",
    model: "",
    range: "",
    accuracy: "",
    calibrationCycle: "",
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    location: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MeasurementInstrument = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      instrumentNo: "",
      instrumentName: "",
      instrumentType: "",
      manufacturer: "",
      model: "",
      range: "",
      accuracy: "",
      calibrationCycle: "",
      lastCalibrationDate: "",
      nextCalibrationDate: "",
      location: "",
      status: "",
    });
    alert("계측기가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.instrumentNo.toLowerCase().includes(search.toLowerCase()) ||
      r.instrumentName.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold">계측기관리대장</h1>
          <p className="text-muted-foreground">계측기 마스터 리스트 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          계측기 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>계측기 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>계측기번호 *</Label>
                  <Input
                    value={formData.instrumentNo}
                    onChange={(e) => setFormData({ ...formData, instrumentNo: e.target.value })}
                    placeholder="GA-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계측기명 *</Label>
                  <Input
                    value={formData.instrumentName}
                    onChange={(e) => setFormData({ ...formData, instrumentName: e.target.value })}
                    placeholder="버니어캘리퍼스"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계측기유형 *</Label>
                  <Select value={formData.instrumentType} onValueChange={(v) => setFormData({ ...formData, instrumentType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="길이">길이</SelectItem>
                      <SelectItem value="압력">압력</SelectItem>
                      <SelectItem value="온도">온도</SelectItem>
                      <SelectItem value="전기">전기</SelectItem>
                      <SelectItem value="무게">무게</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>제조사</Label>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Mitutoyo"
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
                  <Label>측정범위</Label>
                  <Input
                    value={formData.range}
                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                    placeholder="0-150mm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>정밀도</Label>
                  <Input
                    value={formData.accuracy}
                    onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                    placeholder="0.01mm"
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
                  <Label>보관위치</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="품질검사실"
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
          placeholder="계측기번호, 계측기명, 보관위치로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            계측기 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 계측기가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>계측기번호</TableHead>
                  <TableHead>계측기명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>제조사</TableHead>
                  <TableHead>측정범위</TableHead>
                  <TableHead>교정주기</TableHead>
                  <TableHead>최종교정일</TableHead>
                  <TableHead>차기교정일</TableHead>
                  <TableHead>보관위치</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.instrumentNo}</TableCell>
                    <TableCell>{record.instrumentName}</TableCell>
                    <TableCell><Badge variant="outline">{record.instrumentType}</Badge></TableCell>
                    <TableCell>{record.manufacturer || "-"}</TableCell>
                    <TableCell>{record.range || "-"}</TableCell>
                    <TableCell>{record.calibrationCycle}</TableCell>
                    <TableCell>{record.lastCalibrationDate || "-"}</TableCell>
                    <TableCell>{record.nextCalibrationDate || "-"}</TableCell>
                    <TableCell>{record.location || "-"}</TableCell>
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
