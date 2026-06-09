"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Save, Search } from "lucide-react";

interface DeliveryContainer {
  id: number;
  containerNo: string;
  vehicleType: string;
  partName: string;
  containerType: string;
  size: string;
  capacity: string;
  material: string;
  supplier: string;
  approvalDate: string;
  status: string;
}

export default function ContainerPage() {
  const [records, setRecords] = useState<DeliveryContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    containerNo: "",
    vehicleType: "",
    partName: "",
    containerType: "",
    size: "",
    capacity: "",
    material: "",
    supplier: "",
    approvalDate: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DeliveryContainer = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      containerNo: "",
      vehicleType: "",
      partName: "",
      containerType: "",
      size: "",
      capacity: "",
      material: "",
      supplier: "",
      approvalDate: "",
      status: "",
    });
    alert("납입용기가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.containerNo.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleType.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "success";
      case "검토중":
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
          <h1 className="text-3xl font-bold">납입용기설정</h1>
          <p className="text-muted-foreground">납입용기 설정 및 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          용기 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>납입용기 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>용기번호 *</Label>
                  <Input
                    value={formData.containerNo}
                    onChange={(e) => setFormData({ ...formData, containerNo: e.target.value })}
                    placeholder="CT-001"
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
                <div className="space-y-2">
                  <Label>용기유형 *</Label>
                  <Select value={formData.containerType} onValueChange={(v) => setFormData({ ...formData, containerType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="플라스틱박스">플라스틱박스</SelectItem>
                      <SelectItem value="철제박스">철제박스</SelectItem>
                      <SelectItem value="골판지박스">골판지박스</SelectItem>
                      <SelectItem value="트레이">트레이</SelectItem>
                      <SelectItem value="팔레트">팔레트</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>크기(LxWxH)</Label>
                  <Input
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="600x400x300mm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>수용량 *</Label>
                  <Input
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="100EA"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>재질</Label>
                  <Input
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="PP, PE 등"
                  />
                </div>
                <div className="space-y-2">
                  <Label>공급업체</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="공급업체명"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>승인일자</Label>
                  <Input
                    type="date"
                    value={formData.approvalDate}
                    onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="검토중">검토중</SelectItem>
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
          placeholder="용기번호, 부품명, 차종으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            납입용기 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 납입용기가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>용기번호</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>용기유형</TableHead>
                  <TableHead>크기</TableHead>
                  <TableHead>수용량</TableHead>
                  <TableHead>재질</TableHead>
                  <TableHead>공급업체</TableHead>
                  <TableHead>승인일자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.containerNo}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell><Badge variant="outline">{record.containerType}</Badge></TableCell>
                    <TableCell>{record.size || "-"}</TableCell>
                    <TableCell>{record.capacity}</TableCell>
                    <TableCell>{record.material || "-"}</TableCell>
                    <TableCell>{record.supplier || "-"}</TableCell>
                    <TableCell>{record.approvalDate || "-"}</TableCell>
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
