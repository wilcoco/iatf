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
import { FlaskConical, Plus, Save } from "lucide-react";

interface ReliabilityTest {
  id: number;
  testDate: string;
  testType: string;
  partNo: string;
  partName: string;
  carModel: string;
  lotNo: string;
  sampleQty: number;
  testConditions: string;
  testDuration: string;
  result: string;
  findings: string;
  tester: string;
}

export default function ReliabilityTestPage() {
  const [tests, setTests] = useState<ReliabilityTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    testDate: new Date().toISOString().split("T")[0],
    testType: "",
    partNo: "",
    partName: "",
    carModel: "",
    lotNo: "",
    sampleQty: "",
    testConditions: "",
    testDuration: "",
    findings: "",
    tester: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: ReliabilityTest = {
      id: Date.now(),
      testDate: formData.testDate,
      testType: formData.testType,
      partNo: formData.partNo,
      partName: formData.partName,
      carModel: formData.carModel,
      lotNo: formData.lotNo,
      sampleQty: Number(formData.sampleQty),
      testConditions: formData.testConditions,
      testDuration: formData.testDuration,
      result: "합격",
      findings: formData.findings,
      tester: formData.tester,
    };
    setTests([newTest, ...tests]);
    setShowForm(false);
    setFormData({
      testDate: new Date().toISOString().split("T")[0],
      testType: "",
      partNo: "",
      partName: "",
      carModel: "",
      lotNo: "",
      sampleQty: "",
      testConditions: "",
      testDuration: "",
      findings: "",
      tester: "",
    });
    alert("신뢰성시험 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">신뢰성시험</h1>
          <p className="text-muted-foreground">제품 신뢰성/내구성 시험 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          시험 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>신뢰성시험 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
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
                  <Label>시험유형 *</Label>
                  <Select value={formData.testType} onValueChange={(v) => setFormData({ ...formData, testType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="열충격">열충격시험</SelectItem>
                      <SelectItem value="내열">내열시험</SelectItem>
                      <SelectItem value="내한">내한시험</SelectItem>
                      <SelectItem value="내습">내습시험</SelectItem>
                      <SelectItem value="진동">진동시험</SelectItem>
                      <SelectItem value="내광">내광시험</SelectItem>
                      <SelectItem value="마모">마모시험</SelectItem>
                      <SelectItem value="인장">인장시험</SelectItem>
                      <SelectItem value="충격">충격시험</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>차종</Label>
                  <Input
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    placeholder="NQ5, SU2 등"
                  />
                </div>
                <div className="space-y-2">
                  <Label>시험자 *</Label>
                  <Input
                    value={formData.tester}
                    onChange={(e) => setFormData({ ...formData, tester: e.target.value })}
                    placeholder="시험자명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
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
                  <Label>LOT No.</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT번호"
                  />
                </div>
                <div className="space-y-2">
                  <Label>시료수량</Label>
                  <Input
                    type="number"
                    value={formData.sampleQty}
                    onChange={(e) => setFormData({ ...formData, sampleQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>시험조건</Label>
                  <Textarea
                    value={formData.testConditions}
                    onChange={(e) => setFormData({ ...formData, testConditions: e.target.value })}
                    placeholder="온도, 습도, 사이클 등 시험조건"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>시험시간</Label>
                  <Input
                    value={formData.testDuration}
                    onChange={(e) => setFormData({ ...formData, testDuration: e.target.value })}
                    placeholder="예: 500시간, 100사이클"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>시험결과/발견사항</Label>
                <Textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  placeholder="시험 결과 및 특이사항 기록"
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
            <FlaskConical className="h-5 w-5" />
            신뢰성시험 이력
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
                  <TableHead>시험유형</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>시료</TableHead>
                  <TableHead>시험시간</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>시험자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.testDate}</TableCell>
                    <TableCell><Badge variant="outline">{test.testType}</Badge></TableCell>
                    <TableCell>{test.carModel || "-"}</TableCell>
                    <TableCell className="font-mono">{test.partNo}</TableCell>
                    <TableCell>{test.partName}</TableCell>
                    <TableCell>{test.sampleQty}</TableCell>
                    <TableCell>{test.testDuration || "-"}</TableCell>
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
