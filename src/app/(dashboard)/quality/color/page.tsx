"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus, Save } from "lucide-react";

interface ColorMeasurement {
  id: number;
  measureDate: string;
  shift: string;
  partNo: string;
  partName: string;
  colorCode: string;
  lotNo: string;
  lValue: string;
  aValue: string;
  bValue: string;
  deltaE: string;
  result: string;
  measurer: string;
  remarks: string;
}

export default function ColorManagementPage() {
  const [measurements, setMeasurements] = useState<ColorMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    measureDate: new Date().toISOString().split("T")[0],
    shift: "",
    partNo: "",
    partName: "",
    colorCode: "",
    lotNo: "",
    lValue: "",
    aValue: "",
    bValue: "",
    deltaE: "",
    measurer: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deltaE = Number(formData.deltaE) || 0;
    const result = deltaE <= 1.0 ? "합격" : deltaE <= 1.5 ? "조건부" : "불합격";
    const newMeasurement: ColorMeasurement = {
      id: Date.now(),
      measureDate: formData.measureDate,
      shift: formData.shift,
      partNo: formData.partNo,
      partName: formData.partName,
      colorCode: formData.colorCode,
      lotNo: formData.lotNo,
      lValue: formData.lValue,
      aValue: formData.aValue,
      bValue: formData.bValue,
      deltaE: formData.deltaE,
      result,
      measurer: formData.measurer,
      remarks: formData.remarks,
    };
    setMeasurements([newMeasurement, ...measurements]);
    setShowForm(false);
    setFormData({
      measureDate: new Date().toISOString().split("T")[0],
      shift: "",
      partNo: "",
      partName: "",
      colorCode: "",
      lotNo: "",
      lValue: "",
      aValue: "",
      bValue: "",
      deltaE: "",
      measurer: "",
      remarks: "",
    });
    alert("색차측정 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">색차관리</h1>
          <p className="text-muted-foreground">도장품 색차(Delta E) 측정 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          측정 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>색차측정 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>측정일자 *</Label>
                  <Input
                    type="date"
                    value={formData.measureDate}
                    onChange={(e) => setFormData({ ...formData, measureDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>조/교대</Label>
                  <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A조</SelectItem>
                      <SelectItem value="B">B조</SelectItem>
                      <SelectItem value="C">C조</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label>색상코드</Label>
                  <Input
                    value={formData.colorCode}
                    onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                    placeholder="YR6, ABT 등"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2">
                  <Label>LOT No.</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT번호"
                  />
                </div>
                <div className="space-y-2">
                  <Label>L* 값</Label>
                  <Input
                    value={formData.lValue}
                    onChange={(e) => setFormData({ ...formData, lValue: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>a* 값</Label>
                  <Input
                    value={formData.aValue}
                    onChange={(e) => setFormData({ ...formData, aValue: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>b* 값</Label>
                  <Input
                    value={formData.bValue}
                    onChange={(e) => setFormData({ ...formData, bValue: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delta E *</Label>
                  <Input
                    value={formData.deltaE}
                    onChange={(e) => setFormData({ ...formData, deltaE: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>측정자 *</Label>
                  <Input
                    value={formData.measurer}
                    onChange={(e) => setFormData({ ...formData, measurer: e.target.value })}
                    placeholder="측정자명"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>비고</Label>
                <Input
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="특이사항"
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
            <Palette className="h-5 w-5" />
            색차측정 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : measurements.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">측정 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>측정일자</TableHead>
                  <TableHead>조</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>색상</TableHead>
                  <TableHead>L*</TableHead>
                  <TableHead>a*</TableHead>
                  <TableHead>b*</TableHead>
                  <TableHead>dE</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>측정자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.measureDate}</TableCell>
                    <TableCell>{m.shift || "-"}</TableCell>
                    <TableCell className="font-mono">{m.partNo}</TableCell>
                    <TableCell>{m.partName}</TableCell>
                    <TableCell>{m.colorCode || "-"}</TableCell>
                    <TableCell className="font-mono text-sm">{m.lValue || "-"}</TableCell>
                    <TableCell className="font-mono text-sm">{m.aValue || "-"}</TableCell>
                    <TableCell className="font-mono text-sm">{m.bValue || "-"}</TableCell>
                    <TableCell className="font-mono font-bold">{m.deltaE}</TableCell>
                    <TableCell>
                      <Badge variant={m.result === "합격" ? "success" : m.result === "조건부" ? "warning" : "destructive"}>
                        {m.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{m.measurer}</TableCell>
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
