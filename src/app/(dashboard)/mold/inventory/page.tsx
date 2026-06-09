"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Box, Plus, Save, Search } from "lucide-react";

interface MoldInventory {
  id: number;
  moldNo: string;
  moldName: string;
  vehicleType: string;
  partName: string;
  location: string;
  ownerCompany: string;
  acquisitionDate: string;
  status: string;
}

export default function MoldInventoryPage() {
  const [records, setRecords] = useState<MoldInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    moldNo: "",
    moldName: "",
    vehicleType: "",
    partName: "",
    location: "",
    ownerCompany: "",
    acquisitionDate: new Date().toISOString().split("T")[0],
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MoldInventory = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      moldNo: "",
      moldName: "",
      vehicleType: "",
      partName: "",
      location: "",
      ownerCompany: "",
      acquisitionDate: new Date().toISOString().split("T")[0],
      status: "",
    });
    alert("금형 정보가 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.moldNo.toLowerCase().includes(search.toLowerCase()) ||
      r.moldName.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "success";
      case "보관":
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
          <h1 className="text-3xl font-bold">금형보유현황</h1>
          <p className="text-muted-foreground">금형 보유 현황 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          금형 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>금형 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
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
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>보관위치 *</Label>
                  <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="자사">자사</SelectItem>
                      <SelectItem value="협력사">협력사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>소유사</Label>
                  <Input
                    value={formData.ownerCompany}
                    onChange={(e) => setFormData({ ...formData, ownerCompany: e.target.value })}
                    placeholder="소유사를 입력하세요"
                  />
                </div>
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
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="보관">보관</SelectItem>
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
          placeholder="금형번호, 금형명, 부품명으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            금형 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 금형이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>금형번호</TableHead>
                  <TableHead>금형명</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>보관위치</TableHead>
                  <TableHead>소유사</TableHead>
                  <TableHead>취득일자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.moldNo}</TableCell>
                    <TableCell>{record.moldName}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell><Badge variant="outline">{record.location}</Badge></TableCell>
                    <TableCell>{record.ownerCompany || "-"}</TableCell>
                    <TableCell>{record.acquisitionDate}</TableCell>
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
