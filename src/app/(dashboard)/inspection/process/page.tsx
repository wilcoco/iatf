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

interface ProcessInspectionRecord {
  id: number;
  inspectionDate: string;
  shift: string;
  processName: string;
  inspectionType: string;
  vehicleType: string;
  partName: string;
  checkItems: string;
  result: string;
  inspector: string;
  remarks: string;
}

export default function ProcessInspectionPage() {
  const [records, setRecords] = useState<ProcessInspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    shift: "",
    processName: "",
    inspectionType: "",
    vehicleType: "",
    partName: "",
    checkItems: "",
    result: "",
    inspector: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ProcessInspectionRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      inspectionDate: new Date().toISOString().split("T")[0],
      shift: "",
      processName: "",
      inspectionType: "",
      vehicleType: "",
      partName: "",
      checkItems: "",
      result: "",
      inspector: "",
      remarks: "",
    });
    alert("공정검사 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.processName.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase()) ||
      r.inspector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공정검사</h1>
          <p className="text-muted-foreground">패트롤검사, 융착력 점검 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          검사 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>공정검사 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>검사일자 *</Label>
                  <Input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>근무조 *</Label>
                  <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="주간">주간</SelectItem>
                      <SelectItem value="야간">야간</SelectItem>
                      <SelectItem value="A조">A조</SelectItem>
                      <SelectItem value="B조">B조</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>공정명 *</Label>
                  <Input
                    value={formData.processName}
                    onChange={(e) => setFormData({ ...formData, processName: e.target.value })}
                    placeholder="공정명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>검사유형 *</Label>
                  <Select value={formData.inspectionType} onValueChange={(v) => setFormData({ ...formData, inspectionType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="패트롤">패트롤</SelectItem>
                      <SelectItem value="융착력">융착력</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
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
                  <Label>점검항목 *</Label>
                  <Input
                    value={formData.checkItems}
                    onChange={(e) => setFormData({ ...formData, checkItems: e.target.value })}
                    placeholder="점검항목을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="합격">합격</SelectItem>
                      <SelectItem value="불합격">불합격</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>검사자 *</Label>
                  <Input
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    placeholder="검사자명"
                    required
                  />
                </div>
                <div className="space-y-2">
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
          placeholder="공정명, 부품명, 검사자로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            공정검사 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 공정검사 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>검사일자</TableHead>
                  <TableHead>근무조</TableHead>
                  <TableHead>공정명</TableHead>
                  <TableHead>검사유형</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>점검항목</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>검사자</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.inspectionDate}</TableCell>
                    <TableCell><Badge variant="outline">{record.shift}</Badge></TableCell>
                    <TableCell>{record.processName}</TableCell>
                    <TableCell><Badge variant="outline">{record.inspectionType}</Badge></TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell>{record.checkItems}</TableCell>
                    <TableCell>
                      <Badge variant={record.result === "합격" ? "success" : "destructive"}>
                        {record.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.inspector}</TableCell>
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
