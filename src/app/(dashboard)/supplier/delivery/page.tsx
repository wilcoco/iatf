"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Save } from "lucide-react";

interface DeliveryPerformance {
  id: number;
  yearMonth: string;
  supplierCode: string;
  supplierName: string;
  orderCount: number;
  onTimeCount: number;
  lateCount: number;
  onTimeRate: number;
}

export default function DeliveryPerformancePage() {
  const [records, setRecords] = useState<DeliveryPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    yearMonth: new Date().toISOString().slice(0, 7),
    supplierCode: "",
    supplierName: "",
    orderCount: "",
    onTimeCount: "",
    lateCount: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderCount = Number(formData.orderCount) || 0;
    const onTimeCount = Number(formData.onTimeCount) || 0;
    const lateCount = Number(formData.lateCount) || 0;
    const onTimeRate = orderCount > 0 ? Math.round((onTimeCount / orderCount) * 1000) / 10 : 0;

    const newRecord: DeliveryPerformance = {
      id: Date.now(),
      yearMonth: formData.yearMonth,
      supplierCode: formData.supplierCode,
      supplierName: formData.supplierName,
      orderCount,
      onTimeCount,
      lateCount,
      onTimeRate,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      yearMonth: new Date().toISOString().slice(0, 7),
      supplierCode: "",
      supplierName: "",
      orderCount: "",
      onTimeCount: "",
      lateCount: "",
    });
    alert("인도성과가 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">인도성과</h1>
          <p className="text-muted-foreground">공급자 납기 준수율 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          실적 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>인도성과 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>기준년월 *</Label>
                  <Input
                    type="month"
                    value={formData.yearMonth}
                    onChange={(e) => setFormData({ ...formData, yearMonth: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>업체코드 *</Label>
                  <Input
                    value={formData.supplierCode}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    placeholder="S-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>업체명 *</Label>
                  <Input
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="업체명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>발주건수</Label>
                  <Input
                    type="number"
                    value={formData.orderCount}
                    onChange={(e) => setFormData({ ...formData, orderCount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>정시납품건수</Label>
                  <Input
                    type="number"
                    value={formData.onTimeCount}
                    onChange={(e) => setFormData({ ...formData, onTimeCount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>지연납품건수</Label>
                  <Input
                    type="number"
                    value={formData.lateCount}
                    onChange={(e) => setFormData({ ...formData, lateCount: e.target.value })}
                    placeholder="0"
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            인도성과 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">실적 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기준년월</TableHead>
                  <TableHead>업체코드</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead className="text-right">발주</TableHead>
                  <TableHead className="text-right">정시</TableHead>
                  <TableHead className="text-right">지연</TableHead>
                  <TableHead className="text-right">준수율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.yearMonth}</TableCell>
                    <TableCell className="font-mono">{r.supplierCode}</TableCell>
                    <TableCell>{r.supplierName}</TableCell>
                    <TableCell className="text-right">{r.orderCount}</TableCell>
                    <TableCell className="text-right text-green-600">{r.onTimeCount}</TableCell>
                    <TableCell className="text-right text-red-600">{r.lateCount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={r.onTimeRate >= 95 ? "success" : r.onTimeRate >= 90 ? "warning" : "destructive"}>
                        {r.onTimeRate}%
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
