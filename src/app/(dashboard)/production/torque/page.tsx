"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Save } from "lucide-react";

interface TorqueRecord {
  id: number;
  checkDate: string;
  checkType: string;
  location: string;
  standardValue: string;
  measuredValue: string;
  result: string;
  inspector: string;
}

export default function TorquePage() {
  const [records, setRecords] = useState<TorqueRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    checkType: "",
    location: "",
    standardValue: "",
    measuredValue: "",
    result: "",
    inspector: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TorqueRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      checkDate: new Date().toISOString().split("T")[0],
      checkType: "",
      location: "",
      standardValue: "",
      measuredValue: "",
      result: "",
      inspector: "",
    });
    alert("토르크/조도 관리 기록이 저장되었습니다.");
  };

  const resultVariant = (result: string) => {
    switch (result) {
      case "적합": return "success";
      case "부적합": return "error";
      default: return "outline";
    }
  };

  const getUnit = (checkType: string) => {
    return checkType === "토르크" ? "N.m" : "Lux";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">토르크/조도관리</h1>
          <p className="text-muted-foreground">토르크 및 조도 측정 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          측정 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>토르크/조도 측정 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>측정일자 *</Label>
                  <Input
                    type="date"
                    value={formData.checkDate}
                    onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>측정유형 *</Label>
                  <Select value={formData.checkType} onValueChange={(v) => setFormData({ ...formData, checkType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="토르크">토르크</SelectItem>
                      <SelectItem value="조도">조도</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>측정위치 *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="측정 위치"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>측정자 *</Label>
                  <Input
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    placeholder="측정자명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>기준값 * {formData.checkType && `(${getUnit(formData.checkType)})`}</Label>
                  <Input
                    value={formData.standardValue}
                    onChange={(e) => setFormData({ ...formData, standardValue: e.target.value })}
                    placeholder="기준값"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>측정값 * {formData.checkType && `(${getUnit(formData.checkType)})`}</Label>
                  <Input
                    value={formData.measuredValue}
                    onChange={(e) => setFormData({ ...formData, measuredValue: e.target.value })}
                    placeholder="측정값"
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
            <Lightbulb className="h-5 w-5" />
            토르크/조도 측정 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 측정 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>측정일자</TableHead>
                  <TableHead>측정유형</TableHead>
                  <TableHead>측정위치</TableHead>
                  <TableHead>기준값</TableHead>
                  <TableHead>측정값</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>측정자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.checkDate}</TableCell>
                    <TableCell><Badge variant="outline">{record.checkType}</Badge></TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell className="text-right">{record.standardValue} {getUnit(record.checkType)}</TableCell>
                    <TableCell className="text-right">{record.measuredValue} {getUnit(record.checkType)}</TableCell>
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
