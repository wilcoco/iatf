"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Plus, Save, Search } from "lucide-react";

interface LimitSampleRecord {
  id: number;
  sampleNo: string;
  partName: string;
  vehicleType: string;
  defectType: string;
  sampleType: string;
  creationDate: string;
  expiryDate: string;
  storageLocation: string;
  status: string;
}

export default function LimitSamplesPage() {
  const [records, setRecords] = useState<LimitSampleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    sampleNo: "",
    partName: "",
    vehicleType: "",
    defectType: "",
    sampleType: "",
    creationDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    storageLocation: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: LimitSampleRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      sampleNo: "",
      partName: "",
      vehicleType: "",
      defectType: "",
      sampleType: "",
      creationDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      storageLocation: "",
      status: "",
    });
    alert("한도견본이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.sampleNo.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase()) ||
      r.defectType.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "유효":
        return "success";
      case "만료":
        return "warning";
      case "폐기":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">한도견본관리</h1>
          <p className="text-muted-foreground">한도견본 등록 및 유효기간 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          견본 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>한도견본 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>견본번호 *</Label>
                  <Input
                    value={formData.sampleNo}
                    onChange={(e) => setFormData({ ...formData, sampleNo: e.target.value })}
                    placeholder="LS-001"
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
                  <Label>차종 *</Label>
                  <Input
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="차종을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>결함유형 *</Label>
                  <Input
                    value={formData.defectType}
                    onChange={(e) => setFormData({ ...formData, defectType: e.target.value })}
                    placeholder="결함유형을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>견본유형 *</Label>
                  <Select value={formData.sampleType} onValueChange={(v) => setFormData({ ...formData, sampleType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="상한">상한</SelectItem>
                      <SelectItem value="하한">하한</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>제작일자 *</Label>
                  <Input
                    type="date"
                    value={formData.creationDate}
                    onChange={(e) => setFormData({ ...formData, creationDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>유효기간 *</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>보관위치 *</Label>
                  <Input
                    value={formData.storageLocation}
                    onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                    placeholder="보관위치를 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger className="max-w-xs"><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="유효">유효</SelectItem>
                      <SelectItem value="만료">만료</SelectItem>
                      <SelectItem value="폐기">폐기</SelectItem>
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
          placeholder="견본번호, 부품명, 결함유형으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            한도견본 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 한도견본이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>견본번호</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>결함유형</TableHead>
                  <TableHead>견본유형</TableHead>
                  <TableHead>제작일자</TableHead>
                  <TableHead>유효기간</TableHead>
                  <TableHead>보관위치</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.sampleNo}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.defectType}</TableCell>
                    <TableCell><Badge variant="outline">{record.sampleType}</Badge></TableCell>
                    <TableCell>{record.creationDate}</TableCell>
                    <TableCell>{record.expiryDate}</TableCell>
                    <TableCell>{record.storageLocation}</TableCell>
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
