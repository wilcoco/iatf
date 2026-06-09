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

interface CalibrationRecord {
  id: number;
  calibrationDate: string;
  instrumentNo: string;
  instrumentName: string;
  calibrationType: string;
  calibrator: string;
  standardUsed: string;
  beforeValue: string;
  afterValue: string;
  result: string;
  certificateNo: string;
  nextCalibrationDate: string;
}

export default function CalibrationPage() {
  const [records, setRecords] = useState<CalibrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    calibrationDate: new Date().toISOString().split("T")[0],
    instrumentNo: "",
    instrumentName: "",
    calibrationType: "",
    calibrator: "",
    standardUsed: "",
    beforeValue: "",
    afterValue: "",
    result: "",
    certificateNo: "",
    nextCalibrationDate: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CalibrationRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      calibrationDate: new Date().toISOString().split("T")[0],
      instrumentNo: "",
      instrumentName: "",
      calibrationType: "",
      calibrator: "",
      standardUsed: "",
      beforeValue: "",
      afterValue: "",
      result: "",
      certificateNo: "",
      nextCalibrationDate: "",
    });
    alert("교정 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.instrumentNo.toLowerCase().includes(search.toLowerCase()) ||
      r.instrumentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">계측기 교정</h1>
          <p className="text-muted-foreground">계측기 교정 관리 및 이력</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          교정 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>계측기 교정 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>교정일자 *</Label>
                  <Input
                    type="date"
                    value={formData.calibrationDate}
                    onChange={(e) => setFormData({ ...formData, calibrationDate: e.target.value })}
                    required
                  />
                </div>
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
                  <Label>교정유형 *</Label>
                  <Select value={formData.calibrationType} onValueChange={(v) => setFormData({ ...formData, calibrationType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사내">사내교정</SelectItem>
                      <SelectItem value="외부">외부교정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>교정기관/담당자</Label>
                  <Input
                    value={formData.calibrator}
                    onChange={(e) => setFormData({ ...formData, calibrator: e.target.value })}
                    placeholder="한국표준과학연구원"
                  />
                </div>
                <div className="space-y-2">
                  <Label>사용표준기</Label>
                  <Input
                    value={formData.standardUsed}
                    onChange={(e) => setFormData({ ...formData, standardUsed: e.target.value })}
                    placeholder="표준기 정보"
                  />
                </div>
                <div className="space-y-2">
                  <Label>교정전 값</Label>
                  <Input
                    value={formData.beforeValue}
                    onChange={(e) => setFormData({ ...formData, beforeValue: e.target.value })}
                    placeholder="측정값"
                  />
                </div>
                <div className="space-y-2">
                  <Label>교정후 값</Label>
                  <Input
                    value={formData.afterValue}
                    onChange={(e) => setFormData({ ...formData, afterValue: e.target.value })}
                    placeholder="측정값"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="합격">합격</SelectItem>
                      <SelectItem value="불합격">불합격</SelectItem>
                      <SelectItem value="조건부">조건부</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>성적서 번호</Label>
                  <Input
                    value={formData.certificateNo}
                    onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                    placeholder="CAL-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>차기 교정일</Label>
                  <Input
                    type="date"
                    value={formData.nextCalibrationDate}
                    onChange={(e) => setFormData({ ...formData, nextCalibrationDate: e.target.value })}
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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="계측기번호, 계측기명으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            교정 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">교정 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>교정일자</TableHead>
                  <TableHead>계측기번호</TableHead>
                  <TableHead>계측기명</TableHead>
                  <TableHead>교정유형</TableHead>
                  <TableHead>교정기관</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>차기교정일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.calibrationDate}</TableCell>
                    <TableCell className="font-mono">{record.instrumentNo}</TableCell>
                    <TableCell>{record.instrumentName}</TableCell>
                    <TableCell><Badge variant="outline">{record.calibrationType}</Badge></TableCell>
                    <TableCell>{record.calibrator || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={record.result === "합격" ? "success" : record.result === "조건부" ? "warning" : "destructive"}>
                        {record.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.nextCalibrationDate || "-"}</TableCell>
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
