"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, Save } from "lucide-react";

interface CapabilityRecord {
  id: number;
  studyDate: string;
  partNo: string;
  partName: string;
  characteristic: string;
  lsl: string;
  usl: string;
  nominal: string;
  mean: string;
  stdDev: string;
  cp: string;
  cpk: string;
  pp: string;
  ppk: string;
  result: string;
  analyst: string;
}

export default function ProcessCapabilityPage() {
  const [records, setRecords] = useState<CapabilityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studyDate: new Date().toISOString().split("T")[0],
    partNo: "",
    partName: "",
    characteristic: "",
    lsl: "",
    usl: "",
    nominal: "",
    mean: "",
    stdDev: "",
    cp: "",
    cpk: "",
    pp: "",
    ppk: "",
    analyst: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const getResult = (cpk: string, ppk: string) => {
    const cpkValue = parseFloat(cpk) || 0;
    const ppkValue = parseFloat(ppk) || 0;
    const minValue = Math.min(cpkValue, ppkValue);
    if (minValue >= 1.67) return "우수";
    if (minValue >= 1.33) return "합격";
    if (minValue >= 1.0) return "조건부";
    return "불합격";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = getResult(formData.cpk, formData.ppk);
    const newRecord: CapabilityRecord = {
      id: Date.now(),
      studyDate: formData.studyDate,
      partNo: formData.partNo,
      partName: formData.partName,
      characteristic: formData.characteristic,
      lsl: formData.lsl,
      usl: formData.usl,
      nominal: formData.nominal,
      mean: formData.mean,
      stdDev: formData.stdDev,
      cp: formData.cp,
      cpk: formData.cpk,
      pp: formData.pp,
      ppk: formData.ppk,
      result,
      analyst: formData.analyst,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      studyDate: new Date().toISOString().split("T")[0],
      partNo: "",
      partName: "",
      characteristic: "",
      lsl: "",
      usl: "",
      nominal: "",
      mean: "",
      stdDev: "",
      cp: "",
      cpk: "",
      pp: "",
      ppk: "",
      analyst: "",
    });
    alert("공정능력 평가 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공정능력</h1>
          <p className="text-muted-foreground">공정능력지수 (Cp/Cpk, Pp/Ppk) 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          평가 등록
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">판정 기준 (Cpk/Ppk)</p>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-green-600">{">= 1.67: 우수"}</p>
              <p className="text-blue-600">{">= 1.33: 합격"}</p>
              <p className="text-yellow-600">{">= 1.00: 조건부"}</p>
              <p className="text-red-600">{"< 1.00: 불합격"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">신규양산 기준</p>
            <p className="text-2xl font-bold mt-2">Ppk &gt; 1.67</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">양산 기준</p>
            <p className="text-2xl font-bold mt-2">Cpk &gt; 1.33</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>공정능력 평가 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>평가일자 *</Label>
                  <Input
                    type="date"
                    value={formData.studyDate}
                    onChange={(e) => setFormData({ ...formData, studyDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품번 *</Label>
                  <Input
                    value={formData.partNo}
                    onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                    placeholder="품번"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품명 *</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="품명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>측정특성 *</Label>
                  <Input
                    value={formData.characteristic}
                    onChange={(e) => setFormData({ ...formData, characteristic: e.target.value })}
                    placeholder="길이, 두께 등"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>LSL (하한)</Label>
                  <Input
                    value={formData.lsl}
                    onChange={(e) => setFormData({ ...formData, lsl: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>USL (상한)</Label>
                  <Input
                    value={formData.usl}
                    onChange={(e) => setFormData({ ...formData, usl: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>규격 중심</Label>
                  <Input
                    value={formData.nominal}
                    onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>평균 (Mean)</Label>
                  <Input
                    value={formData.mean}
                    onChange={(e) => setFormData({ ...formData, mean: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>표준편차 (Std)</Label>
                  <Input
                    value={formData.stdDev}
                    onChange={(e) => setFormData({ ...formData, stdDev: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>Cp</Label>
                  <Input
                    value={formData.cp}
                    onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cpk *</Label>
                  <Input
                    value={formData.cpk}
                    onChange={(e) => setFormData({ ...formData, cpk: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pp</Label>
                  <Input
                    value={formData.pp}
                    onChange={(e) => setFormData({ ...formData, pp: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ppk *</Label>
                  <Input
                    value={formData.ppk}
                    onChange={(e) => setFormData({ ...formData, ppk: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>평가자 *</Label>
                  <Input
                    value={formData.analyst}
                    onChange={(e) => setFormData({ ...formData, analyst: e.target.value })}
                    placeholder="평가자명"
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
            <BarChart3 className="h-5 w-5" />
            공정능력 평가 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">평가 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>평가일자</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>특성</TableHead>
                  <TableHead className="text-right">Cp</TableHead>
                  <TableHead className="text-right">Cpk</TableHead>
                  <TableHead className="text-right">Pp</TableHead>
                  <TableHead className="text-right">Ppk</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>평가자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.studyDate}</TableCell>
                    <TableCell className="font-mono">{record.partNo}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell>{record.characteristic}</TableCell>
                    <TableCell className="text-right font-mono">{record.cp || "-"}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{record.cpk}</TableCell>
                    <TableCell className="text-right font-mono">{record.pp || "-"}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{record.ppk}</TableCell>
                    <TableCell>
                      <Badge variant={
                        record.result === "우수" ? "success" :
                        record.result === "합격" ? "default" :
                        record.result === "조건부" ? "warning" : "destructive"
                      }>
                        {record.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.analyst}</TableCell>
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
