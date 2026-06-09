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
import { ClipboardCheck, Plus, Save } from "lucide-react";

interface ProductionInspection {
  id: number;
  inspectionDate: string;
  shift: string;
  inspectionType: string;
  partNo: string;
  partName: string;
  moldNo: string;
  lotNo: string;
  inspectionItems: { item: string; standard: string; measured: string; result: string }[];
  overallResult: string;
  inspector: string;
  findings: string;
}

const defaultInspectionItems = [
  { item: "외관", standard: "기포/이물 없을것", measured: "", result: "" },
  { item: "치수1", standard: "100.0 ± 0.5", measured: "", result: "" },
  { item: "치수2", standard: "50.0 ± 0.3", measured: "", result: "" },
  { item: "중량", standard: "150g ± 5g", measured: "", result: "" },
  { item: "색상", standard: "한도견본 이내", measured: "", result: "" },
];

export default function ProductionInspectionPage() {
  const [inspections, setInspections] = useState<ProductionInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    shift: "",
    inspectionType: "",
    partNo: "",
    partName: "",
    moldNo: "",
    lotNo: "",
    inspectionItems: defaultInspectionItems.map((i) => ({ ...i })),
    inspector: "",
    findings: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.inspectionItems];
    (newItems[index] as Record<string, string>)[field] = value;
    if (field === "measured") {
      newItems[index].result = value ? "OK" : "";
    }
    setFormData({ ...formData, inspectionItems: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const overallResult = formData.inspectionItems.every((i) => i.result === "OK") ? "합격" : "불합격";
    const newInspection: ProductionInspection = {
      id: Date.now(),
      inspectionDate: formData.inspectionDate,
      shift: formData.shift,
      inspectionType: formData.inspectionType,
      partNo: formData.partNo,
      partName: formData.partName,
      moldNo: formData.moldNo,
      lotNo: formData.lotNo,
      inspectionItems: formData.inspectionItems,
      overallResult,
      inspector: formData.inspector,
      findings: formData.findings,
    };
    setInspections([newInspection, ...inspections]);
    setShowForm(false);
    setFormData({
      inspectionDate: new Date().toISOString().split("T")[0],
      shift: "",
      inspectionType: "",
      partNo: "",
      partName: "",
      moldNo: "",
      lotNo: "",
      inspectionItems: defaultInspectionItems.map((i) => ({ ...i })),
      inspector: "",
      findings: "",
    });
    alert("검사 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">초/중/종물 검사</h1>
          <p className="text-muted-foreground">생산 초물, 중간물, 종물 검사 기록</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          검사 기록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>초/중/종물 검사 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>검사일자</Label>
                  <Input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>조/교대</Label>
                  <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A조 (주간)</SelectItem>
                      <SelectItem value="B">B조 (야간)</SelectItem>
                      <SelectItem value="C">C조</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검사유형</Label>
                  <Select value={formData.inspectionType} onValueChange={(v) => setFormData({ ...formData, inspectionType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="초물">초물 검사</SelectItem>
                      <SelectItem value="중간">중간 검사</SelectItem>
                      <SelectItem value="종물">종물 검사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검사자</Label>
                  <Input
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    placeholder="검사자명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>품번</Label>
                  <Input
                    value={formData.partNo}
                    onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                    placeholder="P-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품명</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="부품명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>금형번호</Label>
                  <Input
                    value={formData.moldNo}
                    onChange={(e) => setFormData({ ...formData, moldNo: e.target.value })}
                    placeholder="M-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LOT No.</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT번호"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>검사 항목</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">항목</TableHead>
                      <TableHead>기준</TableHead>
                      <TableHead className="w-32">측정값</TableHead>
                      <TableHead className="w-24">판정</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.inspectionItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.standard}</TableCell>
                        <TableCell>
                          <Input
                            value={item.measured}
                            onChange={(e) => handleItemChange(index, "measured", e.target.value)}
                            placeholder="측정값"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select value={item.result} onValueChange={(v) => handleItemChange(index, "result", v)}>
                            <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OK">OK</SelectItem>
                              <SelectItem value="NG">NG</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <Label>특이사항/발견사항</Label>
                <Textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  placeholder="특이사항 또는 불량 발생시 내용 기록"
                  rows={3}
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
            <ClipboardCheck className="h-5 w-5" />
            검사 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : inspections.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>검사일자</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>LOT No.</TableHead>
                  <TableHead>조</TableHead>
                  <TableHead>판정</TableHead>
                  <TableHead>검사자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((insp) => (
                  <TableRow key={insp.id}>
                    <TableCell>{insp.inspectionDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{insp.inspectionType}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{insp.partNo}</TableCell>
                    <TableCell>{insp.partName}</TableCell>
                    <TableCell className="font-mono text-sm">{insp.lotNo}</TableCell>
                    <TableCell>{insp.shift}</TableCell>
                    <TableCell>
                      <Badge variant={insp.overallResult === "합격" ? "success" : "destructive"}>
                        {insp.overallResult}
                      </Badge>
                    </TableCell>
                    <TableCell>{insp.inspector}</TableCell>
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
