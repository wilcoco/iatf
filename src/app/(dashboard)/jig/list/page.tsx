"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Cog, Plus, Save, Search } from "lucide-react";

interface JigRecord {
  id: number;
  jigNo: string;
  jigName: string;
  jigType: string;
  vehicleType: string;
  acquisitionDate: string;
  inspectionCycle: string;
  lastInspectionDate: string;
  nextInspectionDate: string;
  status: string;
}

export default function JigListPage() {
  const [records, setRecords] = useState<JigRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    jigNo: "",
    jigName: "",
    jigType: "",
    vehicleType: "",
    acquisitionDate: new Date().toISOString().split("T")[0],
    inspectionCycle: "",
    lastInspectionDate: "",
    nextInspectionDate: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: JigRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      jigNo: "",
      jigName: "",
      jigType: "",
      vehicleType: "",
      acquisitionDate: new Date().toISOString().split("T")[0],
      inspectionCycle: "",
      lastInspectionDate: "",
      nextInspectionDate: "",
      status: "",
    });
    alert("지그 정보가 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.jigNo.toLowerCase().includes(search.toLowerCase()) ||
      r.jigName.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleType.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "success";
      case "점검필요":
        return "warning";
      case "사용불가":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">지그관리대장</h1>
          <p className="text-muted-foreground">지그 마스터 목록 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          지그 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>지그 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>지그번호 *</Label>
                  <Input
                    value={formData.jigNo}
                    onChange={(e) => setFormData({ ...formData, jigNo: e.target.value })}
                    placeholder="J-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>지그명 *</Label>
                  <Input
                    value={formData.jigName}
                    onChange={(e) => setFormData({ ...formData, jigName: e.target.value })}
                    placeholder="지그명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>지그유형 *</Label>
                  <Select value={formData.jigType} onValueChange={(v) => setFormData({ ...formData, jigType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="도장">도장</SelectItem>
                      <SelectItem value="조립">조립</SelectItem>
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
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>취득일자 *</Label>
                  <Input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검주기 *</Label>
                  <Select value={formData.inspectionCycle} onValueChange={(v) => setFormData({ ...formData, inspectionCycle: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1개월">1개월</SelectItem>
                      <SelectItem value="3개월">3개월</SelectItem>
                      <SelectItem value="6개월">6개월</SelectItem>
                      <SelectItem value="12개월">12개월</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>최종점검일</Label>
                  <Input
                    type="date"
                    value={formData.lastInspectionDate}
                    onChange={(e) => setFormData({ ...formData, lastInspectionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>차기점검일</Label>
                  <Input
                    type="date"
                    value={formData.nextInspectionDate}
                    onChange={(e) => setFormData({ ...formData, nextInspectionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="점검필요">점검필요</SelectItem>
                      <SelectItem value="사용불가">사용불가</SelectItem>
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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="지그번호, 지그명, 차종으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            지그 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 지그가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>지그번호</TableHead>
                  <TableHead>지그명</TableHead>
                  <TableHead>지그유형</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>취득일자</TableHead>
                  <TableHead>점검주기</TableHead>
                  <TableHead>최종점검일</TableHead>
                  <TableHead>차기점검일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.jigNo}</TableCell>
                    <TableCell>{record.jigName}</TableCell>
                    <TableCell><Badge variant="outline">{record.jigType}</Badge></TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.acquisitionDate}</TableCell>
                    <TableCell>{record.inspectionCycle}</TableCell>
                    <TableCell>{record.lastInspectionDate || "-"}</TableCell>
                    <TableCell>{record.nextInspectionDate || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
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
