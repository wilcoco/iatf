"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Save, Search } from "lucide-react";

interface DeliveryRecord {
  id: number;
  period: string;
  customer: string;
  plannedQty: number;
  actualQty: number;
  deliveryRate: number;
  onTimeCount: number;
  lateCount: number;
  remarks: string;
}

export default function DeliveryPage() {
  const [records, setRecords] = useState<DeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    period: "",
    customer: "",
    plannedQty: "",
    actualQty: "",
    onTimeCount: "",
    lateCount: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const calculateDeliveryRate = (actualQty: number, plannedQty: number) => {
    if (plannedQty === 0) return 0;
    return (actualQty / plannedQty) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plannedQty = Number(formData.plannedQty);
    const actualQty = Number(formData.actualQty);
    const deliveryRate = calculateDeliveryRate(actualQty, plannedQty);

    const newRecord: DeliveryRecord = {
      id: Date.now(),
      period: formData.period,
      customer: formData.customer,
      plannedQty: plannedQty,
      actualQty: actualQty,
      deliveryRate: deliveryRate,
      onTimeCount: Number(formData.onTimeCount),
      lateCount: Number(formData.lateCount),
      remarks: formData.remarks,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      period: "",
      customer: "",
      plannedQty: "",
      actualQty: "",
      onTimeCount: "",
      lateCount: "",
      remarks: "",
    });
    alert("인도성과율이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.period.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
  );

  const getRateVariant = (rate: number) => {
    if (rate >= 100) return "success";
    if (rate >= 90) return "warning";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">인도성과율</h1>
          <p className="text-muted-foreground">고객 납품 성과 관리 (실적/KMC계획*100)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          성과 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>인도성과율 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>기간 *</Label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2024-01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>고객사 *</Label>
                  <Input
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="고객사명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>계획수량 *</Label>
                  <Input
                    type="number"
                    value={formData.plannedQty}
                    onChange={(e) => setFormData({ ...formData, plannedQty: e.target.value })}
                    placeholder="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>실적수량 *</Label>
                  <Input
                    type="number"
                    value={formData.actualQty}
                    onChange={(e) => setFormData({ ...formData, actualQty: e.target.value })}
                    placeholder="980"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>정시납품 건수</Label>
                  <Input
                    type="number"
                    value={formData.onTimeCount}
                    onChange={(e) => setFormData({ ...formData, onTimeCount: e.target.value })}
                    placeholder="95"
                  />
                </div>
                <div className="space-y-2">
                  <Label>지연납품 건수</Label>
                  <Input
                    type="number"
                    value={formData.lateCount}
                    onChange={(e) => setFormData({ ...formData, lateCount: e.target.value })}
                    placeholder="5"
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
          placeholder="기간, 고객사로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            인도성과 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 인도성과 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기간</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>계획수량</TableHead>
                  <TableHead>실적수량</TableHead>
                  <TableHead>인도성과율</TableHead>
                  <TableHead>정시납품</TableHead>
                  <TableHead>지연납품</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.period}</TableCell>
                    <TableCell>{record.customer}</TableCell>
                    <TableCell className="text-right">{record.plannedQty.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.actualQty.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getRateVariant(record.deliveryRate)}>
                        {record.deliveryRate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{record.onTimeCount}</TableCell>
                    <TableCell className="text-right">{record.lateCount}</TableCell>
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
