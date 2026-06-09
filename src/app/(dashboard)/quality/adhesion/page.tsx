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
import { Layers, Plus, Save } from "lucide-react";

interface AdhesionTest {
  id: number;
  testDate: string;
  shift: string;
  partNo: string;
  partName: string;
  color: string;
  lotNo: string;
  crossCutResult: string;
  tapeType: string;
  peelOffRatio: string;
  grade: string;
  result: string;
  tester: string;
  remarks: string;
}

export default function AdhesionTestPage() {
  const [tests, setTests] = useState<AdhesionTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    testDate: new Date().toISOString().split("T")[0],
    shift: "",
    partNo: "",
    partName: "",
    color: "",
    lotNo: "",
    crossCutResult: "",
    tapeType: "",
    peelOffRatio: "",
    grade: "",
    tester: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const grade = formData.grade;
    const result = grade === "0B" || grade === "1B" ? "합격" : "불합격";
    const newTest: AdhesionTest = {
      id: Date.now(),
      testDate: formData.testDate,
      shift: formData.shift,
      partNo: formData.partNo,
      partName: formData.partName,
      color: formData.color,
      lotNo: formData.lotNo,
      crossCutResult: formData.crossCutResult,
      tapeType: formData.tapeType,
      peelOffRatio: formData.peelOffRatio,
      grade,
      result,
      tester: formData.tester,
      remarks: formData.remarks,
    };
    setTests([newTest, ...tests]);
    setShowForm(false);
    setFormData({
      testDate: new Date().toISOString().split("T")[0],
      shift: "",
      partNo: "",
      partName: "",
      color: "",
      lotNo: "",
      crossCutResult: "",
      tapeType: "",
      peelOffRatio: "",
      grade: "",
      tester: "",
      remarks: "",
    });
    alert("부착성시험 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">부착성시험</h1>
          <p className="text-muted-foreground">도장품 부착성(Cross-cut) 시험 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          시험 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>부착성시험 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>시험일자 *</Label>
                  <Input
                    type="date"
                    value={formData.testDate}
                    onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
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
                  <Label>색상</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="색상코드"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>LOT No.</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT번호"
                  />
                </div>
                <div className="space-y-2">
                  <Label>크로스컷 상태</Label>
                  <Select value={formData.crossCutResult} onValueChange={(v) => setFormData({ ...formData, crossCutResult: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="양호">양호</SelectItem>
                      <SelectItem value="박리">박리</SelectItem>
                      <SelectItem value="균열">균열</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>테이프 종류</Label>
                  <Input
                    value={formData.tapeType}
                    onChange={(e) => setFormData({ ...formData, tapeType: e.target.value })}
                    placeholder="3M 610 등"
                  />
                </div>
                <div className="space-y-2">
                  <Label>박리율 (%)</Label>
                  <Input
                    value={formData.peelOffRatio}
                    onChange={(e) => setFormData({ ...formData, peelOffRatio: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>등급 (ISO) *</Label>
                  <Select value={formData.grade} onValueChange={(v) => setFormData({ ...formData, grade: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0B">0B (0%)</SelectItem>
                      <SelectItem value="1B">1B (5% 미만)</SelectItem>
                      <SelectItem value="2B">2B (5-15%)</SelectItem>
                      <SelectItem value="3B">3B (15-35%)</SelectItem>
                      <SelectItem value="4B">4B (35-65%)</SelectItem>
                      <SelectItem value="5B">5B (65% 초과)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>시험자 *</Label>
                  <Input
                    value={formData.tester}
                    onChange={(e) => setFormData({ ...formData, tester: e.target.value })}
                    placeholder="시험자명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="비고"
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
            <Layers className="h-5 w-5" />
            부착성시험 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : tests.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">시험 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>시험일자</TableHead>
                  <TableHead>조</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>색상</TableHead>
                  <TableHead>LOT</TableHead>
                  <TableHead>등급</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>시험자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.testDate}</TableCell>
                    <TableCell>{test.shift || "-"}</TableCell>
                    <TableCell className="font-mono">{test.partNo}</TableCell>
                    <TableCell>{test.partName}</TableCell>
                    <TableCell>{test.color || "-"}</TableCell>
                    <TableCell className="font-mono text-sm">{test.lotNo || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{test.grade}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={test.result === "합격" ? "success" : "destructive"}>
                        {test.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.tester}</TableCell>
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
