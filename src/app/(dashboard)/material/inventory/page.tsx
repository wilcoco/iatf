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

interface InventoryRecord {
  id: number;
  itemCode: string;
  itemName: string;
  itemType: string;
  safetyStock: number;
  currentStock: number;
  reorderPoint: number;
  status: string;
}

export default function InventoryPage() {
  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    itemType: "",
    safetyStock: "",
    currentStock: "",
    reorderPoint: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InventoryRecord = {
      id: Date.now(),
      itemCode: formData.itemCode,
      itemName: formData.itemName,
      itemType: formData.itemType,
      safetyStock: Number(formData.safetyStock),
      currentStock: Number(formData.currentStock),
      reorderPoint: Number(formData.reorderPoint),
      status: formData.status,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      itemCode: "",
      itemName: "",
      itemType: "",
      safetyStock: "",
      currentStock: "",
      reorderPoint: "",
      status: "",
    });
    alert("재고 정보가 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      r.itemName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "정상":
        return "success";
      case "부족":
        return "destructive";
      case "과다":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">적정재고관리</h1>
          <p className="text-muted-foreground">적정 재고 수준 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          재고 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>재고 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>품목코드 *</Label>
                  <Input
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    placeholder="ITM-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품목명 *</Label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="품목명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품목유형 *</Label>
                  <Select value={formData.itemType} onValueChange={(v) => setFormData({ ...formData, itemType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="원재료">원재료</SelectItem>
                      <SelectItem value="부재료">부재료</SelectItem>
                      <SelectItem value="조립부품">조립부품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>안전재고 *</Label>
                  <Input
                    type="number"
                    value={formData.safetyStock}
                    onChange={(e) => setFormData({ ...formData, safetyStock: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>현재재고 *</Label>
                  <Input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    placeholder="150"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>재주문점 *</Label>
                  <Input
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                    placeholder="50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="정상">정상</SelectItem>
                      <SelectItem value="부족">부족</SelectItem>
                      <SelectItem value="과다">과다</SelectItem>
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
          placeholder="품목코드, 품목명으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            재고 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 재고가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>품목코드</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead>품목유형</TableHead>
                  <TableHead>안전재고</TableHead>
                  <TableHead>현재재고</TableHead>
                  <TableHead>재주문점</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.itemCode}</TableCell>
                    <TableCell>{record.itemName}</TableCell>
                    <TableCell><Badge variant="outline">{record.itemType}</Badge></TableCell>
                    <TableCell className="text-right">{record.safetyStock.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.currentStock.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.reorderPoint.toLocaleString()}</TableCell>
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
