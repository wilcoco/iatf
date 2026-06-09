"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Save, Search } from "lucide-react";

interface ReliabilityPlan {
  id: number;
  year: string;
  vehicleType: string;
  partName: string;
  testItem: string;
  testStandard: string;
  testCycle: string;
  plannedMonth: string;
  actualDate: string;
  result: string;
  remarks: string;
}

export default function ReliabilityPlanPage() {
  const [records, setRecords] = useState<ReliabilityPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    vehicleType: "",
    partName: "",
    testItem: "",
    testStandard: "",
    testCycle: "",
    plannedMonth: "",
    actualDate: "",
    result: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ReliabilityPlan = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      year: new Date().getFullYear().toString(),
      vehicleType: "",
      partName: "",
      testItem: "",
      testStandard: "",
      testCycle: "",
      plannedMonth: "",
      actualDate: "",
      result: "",
      remarks: "",
    });
    alert("신뢰성시험계획이 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.vehicleType.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase()) ||
      r.testItem.toLowerCase().includes(search.toLowerCase())
  );

  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "진행중":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">신뢰성시험계획</h1>
          <p className="text-muted-foreground">연간 신뢰성 시험 계획 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          시험계획 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>신뢰성시험계획 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>년도 *</Label>
                  <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>차종 *</Label>
                  <Input
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="차종을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>부품명 *</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="부품명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>시험항목 *</Label>
                  <Input
                    value={formData.testItem}
                    onChange={(e) => setFormData({ ...formData, testItem: e.target.value })}
                    placeholder="시험항목을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>시험규격</Label>
                  <Input
                    value={formData.testStandard}
                    onChange={(e) => setFormData({ ...formData, testStandard: e.target.value })}
                    placeholder="ES-XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>시험주기 *</Label>
                  <Select value={formData.testCycle} onValueChange={(v) => setFormData({ ...formData, testCycle: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="정기">정기</SelectItem>
                      <SelectItem value="법규">법규</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>계획월 *</Label>
                  <Select value={formData.plannedMonth} onValueChange={(v) => setFormData({ ...formData, plannedMonth: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1월">1월</SelectItem>
                      <SelectItem value="2월">2월</SelectItem>
                      <SelectItem value="3월">3월</SelectItem>
                      <SelectItem value="4월">4월</SelectItem>
                      <SelectItem value="5월">5월</SelectItem>
                      <SelectItem value="6월">6월</SelectItem>
                      <SelectItem value="7월">7월</SelectItem>
                      <SelectItem value="8월">8월</SelectItem>
                      <SelectItem value="9월">9월</SelectItem>
                      <SelectItem value="10월">10월</SelectItem>
                      <SelectItem value="11월">11월</SelectItem>
                      <SelectItem value="12월">12월</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>실시일자</Label>
                  <Input
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>결과</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="합격">합격</SelectItem>
                      <SelectItem value="불합격">불합격</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="비고사항을 입력하세요"
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
          placeholder="차종, 부품명, 시험항목으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            시험계획 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 시험계획이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>년도</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>시험항목</TableHead>
                  <TableHead>시험규격</TableHead>
                  <TableHead>시험주기</TableHead>
                  <TableHead>계획월</TableHead>
                  <TableHead>실시일자</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.year}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell>{record.testItem}</TableCell>
                    <TableCell>{record.testStandard || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{record.testCycle}</Badge></TableCell>
                    <TableCell>{record.plannedMonth}</TableCell>
                    <TableCell>{record.actualDate || "-"}</TableCell>
                    <TableCell>
                      {record.result ? (
                        <Badge variant={getResultVariant(record.result)}>
                          {record.result}
                        </Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell>{record.remarks || "-"}</TableCell>
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
