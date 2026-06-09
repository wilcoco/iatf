"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Save, Search } from "lucide-react";

interface CleaningRecord {
  id: number;
  planDate: string;
  moldNo: string;
  moldName: string;
  cleaningType: string;
  plannedDate: string;
  actualDate: string;
  result: string;
  remarks: string;
}

export default function MoldCleaningPage() {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    planDate: new Date().toISOString().split("T")[0],
    moldNo: "",
    moldName: "",
    cleaningType: "",
    plannedDate: "",
    actualDate: "",
    result: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CleaningRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      planDate: new Date().toISOString().split("T")[0],
      moldNo: "",
      moldName: "",
      cleaningType: "",
      plannedDate: "",
      actualDate: "",
      result: "",
      remarks: "",
    });
    alert("습합/세척 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.moldNo.toLowerCase().includes(search.toLowerCase()) ||
      r.moldName.toLowerCase().includes(search.toLowerCase())
  );

  const getResultVariant = (result: string) => {
    switch (result) {
      case "완료":
        return "success";
      case "진행중":
        return "warning";
      case "미실시":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">금형습합/세척</h1>
          <p className="text-muted-foreground">금형 습합 및 세척 일정 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          일정 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>습합/세척 일정 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>계획등록일 *</Label>
                  <Input
                    type="date"
                    value={formData.planDate}
                    onChange={(e) => setFormData({ ...formData, planDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>금형번호 *</Label>
                  <Input
                    value={formData.moldNo}
                    onChange={(e) => setFormData({ ...formData, moldNo: e.target.value })}
                    placeholder="M-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>금형명 *</Label>
                  <Input
                    value={formData.moldName}
                    onChange={(e) => setFormData({ ...formData, moldName: e.target.value })}
                    placeholder="금형명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>유형 *</Label>
                  <Select value={formData.cleaningType} onValueChange={(v) => setFormData({ ...formData, cleaningType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="습합">습합</SelectItem>
                      <SelectItem value="세척">세척</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>계획일자 *</Label>
                  <Input
                    type="date"
                    value={formData.plannedDate}
                    onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>실시일자</Label>
                  <Input
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="완료">완료</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="미실시">미실시</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="비고 사항"
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
          placeholder="금형번호, 금형명으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            습합/세척 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">습합/세척 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>계획등록일</TableHead>
                  <TableHead>금형번호</TableHead>
                  <TableHead>금형명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>계획일자</TableHead>
                  <TableHead>실시일자</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.planDate}</TableCell>
                    <TableCell className="font-mono">{record.moldNo}</TableCell>
                    <TableCell>{record.moldName}</TableCell>
                    <TableCell><Badge variant="outline">{record.cleaningType}</Badge></TableCell>
                    <TableCell>{record.plannedDate}</TableCell>
                    <TableCell>{record.actualDate || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getResultVariant(record.result)}>
                        {record.result}
                      </Badge>
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
