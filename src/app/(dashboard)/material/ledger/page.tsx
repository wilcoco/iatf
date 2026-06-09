"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Save, Search } from "lucide-react";

interface LedgerRecord {
  id: number;
  transactionDate: string;
  itemCode: string;
  itemName: string;
  transactionType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  supplier: string;
  lotNo: string;
  remarks: string;
}

export default function LedgerPage() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split("T")[0],
    itemCode: "",
    itemName: "",
    transactionType: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
    lotNo: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = Number(formData.quantity);
    const unitPrice = Number(formData.unitPrice);
    const newRecord: LedgerRecord = {
      id: Date.now(),
      transactionDate: formData.transactionDate,
      itemCode: formData.itemCode,
      itemName: formData.itemName,
      transactionType: formData.transactionType,
      quantity: quantity,
      unitPrice: unitPrice,
      totalAmount: quantity * unitPrice,
      supplier: formData.supplier,
      lotNo: formData.lotNo,
      remarks: formData.remarks,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      transactionDate: new Date().toISOString().split("T")[0],
      itemCode: "",
      itemName: "",
      transactionType: "",
      quantity: "",
      unitPrice: "",
      supplier: "",
      lotNo: "",
      remarks: "",
    });
    alert("수불 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      r.itemName.toLowerCase().includes(search.toLowerCase()) ||
      r.lotNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">자재수불부</h1>
          <p className="text-muted-foreground">자재 입출고 기록 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          수불 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>수불 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>거래일자 *</Label>
                  <Input
                    type="date"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    required
                  />
                </div>
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
                  <Label>거래유형 *</Label>
                  <Select value={formData.transactionType} onValueChange={(v) => setFormData({ ...formData, transactionType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="입고">입고</SelectItem>
                      <SelectItem value="출고">출고</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>수량 *</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>단가 *</Label>
                  <Input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    placeholder="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>거래처</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="거래처명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LOT No.</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT-2024-001"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1">
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
          placeholder="품목코드, 품목명, LOT No.로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            수불 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 수불 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>거래일자</TableHead>
                  <TableHead>품목코드</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead>거래유형</TableHead>
                  <TableHead>수량</TableHead>
                  <TableHead>단가</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>거래처</TableHead>
                  <TableHead>LOT No.</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.transactionDate}</TableCell>
                    <TableCell className="font-mono">{record.itemCode}</TableCell>
                    <TableCell>{record.itemName}</TableCell>
                    <TableCell>
                      <Badge variant={record.transactionType === "입고" ? "success" : "destructive"}>
                        {record.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{record.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{record.supplier || "-"}</TableCell>
                    <TableCell className="font-mono">{record.lotNo || "-"}</TableCell>
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
