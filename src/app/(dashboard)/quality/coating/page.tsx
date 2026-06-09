"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gauge, Plus, Save } from "lucide-react";

interface CoatingMeasurement {
  id: number;
  measureDate: string;
  shift: string;
  partNo: string;
  partName: string;
  colorCode: string;
  position1: string;
  position2: string;
  position3: string;
  position4: string;
  position5: string;
  average: string;
  minSpec: string;
  maxSpec: string;
  result: string;
  measurer: string;
  remarks: string;
}

export default function CoatingThicknessPage() {
  const [measurements, setMeasurements] = useState<CoatingMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    measureDate: new Date().toISOString().split("T")[0],
    shift: "",
    partNo: "",
    partName: "",
    colorCode: "",
    position1: "",
    position2: "",
    position3: "",
    position4: "",
    position5: "",
    minSpec: "15",
    maxSpec: "35",
    measurer: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const calculateAverage = () => {
    const values = [
      formData.position1,
      formData.position2,
      formData.position3,
      formData.position4,
      formData.position5,
    ]
      .filter((v) => v)
      .map((v) => parseFloat(v));
    if (values.length === 0) return "";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const average = calculateAverage();
    const avgNum = parseFloat(average) || 0;
    const minSpec = parseFloat(formData.minSpec) || 15;
    const maxSpec = parseFloat(formData.maxSpec) || 35;
    const result = avgNum >= minSpec && avgNum <= maxSpec ? "합격" : "불합격";

    const newMeasurement: CoatingMeasurement = {
      id: Date.now(),
      measureDate: formData.measureDate,
      shift: formData.shift,
      partNo: formData.partNo,
      partName: formData.partName,
      colorCode: formData.colorCode,
      position1: formData.position1,
      position2: formData.position2,
      position3: formData.position3,
      position4: formData.position4,
      position5: formData.position5,
      average,
      minSpec: formData.minSpec,
      maxSpec: formData.maxSpec,
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
      position1: "",
      position2: "",
      position3: "",
      position4: "",
      position5: "",
      minSpec: "15",
      maxSpec: "35",
      measurer: "",
      remarks: "",
    });
    alert("도막두께 측정 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">도막두께</h1>
          <p className="text-muted-foreground">도장품 도막두께 측정 관리 (단위: um)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          측정 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>도막두께 측정 등록</CardTitle>
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
                    placeholder="색상코드"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>측정값 (um) - 5개 위치</Label>
                <div className="grid gap-4 md:grid-cols-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">위치1</Label>
                    <Input
                      value={formData.position1}
                      onChange={(e) => setFormData({ ...formData, position1: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">위치2</Label>
                    <Input
                      value={formData.position2}
                      onChange={(e) => setFormData({ ...formData, position2: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">위치3</Label>
                    <Input
                      value={formData.position3}
                      onChange={(e) => setFormData({ ...formData, position3: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">위치4</Label>
                    <Input
                      value={formData.position4}
                      onChange={(e) => setFormData({ ...formData, position4: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">위치5</Label>
                    <Input
                      value={formData.position5}
                      onChange={(e) => setFormData({ ...formData, position5: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">평균</Label>
                    <Input value={calculateAverage()} disabled className="bg-muted font-bold" />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>규격 Min (um)</Label>
                  <Input
                    value={formData.minSpec}
                    onChange={(e) => setFormData({ ...formData, minSpec: e.target.value })}
                    placeholder="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label>규격 Max (um)</Label>
                  <Input
                    value={formData.maxSpec}
                    onChange={(e) => setFormData({ ...formData, maxSpec: e.target.value })}
                    placeholder="35"
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
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="특이사항"
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
            <Gauge className="h-5 w-5" />
            도막두께 측정 이력
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
                  <TableHead className="text-center">측정값 (1~5)</TableHead>
                  <TableHead>평균</TableHead>
                  <TableHead>규격</TableHead>
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
                    <TableCell className="text-center font-mono text-xs">
                      {[m.position1, m.position2, m.position3, m.position4, m.position5]
                        .filter((v) => v)
                        .join(" / ")}
                    </TableCell>
                    <TableCell className="font-mono font-bold">{m.average}</TableCell>
                    <TableCell className="text-xs">{m.minSpec}~{m.maxSpec}</TableCell>
                    <TableCell>
                      <Badge variant={m.result === "합격" ? "success" : "destructive"}>
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
