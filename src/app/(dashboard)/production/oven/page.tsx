"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Plus, Save } from "lucide-react";

interface OvenRecord {
  id: number;
  checkDate: string;
  ovenNo: string;
  zone: string;
  setTemp: string;
  actualTemp: string;
  time: string;
  profile: string;
  result: string;
  inspector: string;
}

export default function OvenPage() {
  const [records, setRecords] = useState<OvenRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    ovenNo: "",
    zone: "",
    setTemp: "",
    actualTemp: "",
    time: "",
    profile: "",
    result: "",
    inspector: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: OvenRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      checkDate: new Date().toISOString().split("T")[0],
      ovenNo: "",
      zone: "",
      setTemp: "",
      actualTemp: "",
      time: "",
      profile: "",
      result: "",
      inspector: "",
    });
    alert("건조로 관리 기록이 저장되었습니다.");
  };

  const resultVariant = (result: string) => {
    switch (result) {
      case "적합": return "success";
      case "부적합": return "error";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">건조로관리</h1>
          <p className="text-muted-foreground">건조로 프로파일 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          기록 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>건조로 관리 등록</CardTitle>
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
                  <Label>건조로 번호 *</Label>
                  <Input
                    value={formData.ovenNo}
                    onChange={(e) => setFormData({ ...formData, ovenNo: e.target.value })}
                    placeholder="OVEN-01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>존(Zone) *</Label>
                  <Select value={formData.zone} onValueChange={(v) => setFormData({ ...formData, zone: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zone 1">Zone 1</SelectItem>
                      <SelectItem value="Zone 2">Zone 2</SelectItem>
                      <SelectItem value="Zone 3">Zone 3</SelectItem>
                      <SelectItem value="Zone 4">Zone 4</SelectItem>
                      <SelectItem value="Zone 5">Zone 5</SelectItem>
                    </SelectContent>
                  </Select>
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

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>설정온도 (C) *</Label>
                  <Input
                    type="number"
                    value={formData.setTemp}
                    onChange={(e) => setFormData({ ...formData, setTemp: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>실제온도 (C) *</Label>
                  <Input
                    type="number"
                    value={formData.actualTemp}
                    onChange={(e) => setFormData({ ...formData, actualTemp: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>시간 (분) *</Label>
                  <Input
                    type="number"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="적합">적합</SelectItem>
                      <SelectItem value="부적합">부적합</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>프로파일</Label>
                <Input
                  value={formData.profile}
                  onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                  placeholder="온도 프로파일 정보"
                />
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
            <Thermometer className="h-5 w-5" />
            건조로 관리 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 건조로 관리 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>점검일자</TableHead>
                  <TableHead>건조로 번호</TableHead>
                  <TableHead>존(Zone)</TableHead>
                  <TableHead>설정온도</TableHead>
                  <TableHead>실제온도</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>점검자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.checkDate}</TableCell>
                    <TableCell className="font-mono">{record.ovenNo}</TableCell>
                    <TableCell><Badge variant="outline">{record.zone}</Badge></TableCell>
                    <TableCell className="text-right">{record.setTemp}C</TableCell>
                    <TableCell className="text-right">{record.actualTemp}C</TableCell>
                    <TableCell className="text-right">{record.time}분</TableCell>
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
