"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, Save } from "lucide-react";

interface QualityPerformance {
  id: number;
  yearMonth: string;
  supplierCode: string;
  supplierName: string;
  receivedQty: number;
  defectQty: number;
  defectRate: number;
  ncCount: number;
}

export default function SupplierQualityPage() {
  const [records, setRecords] = useState<QualityPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    yearMonth: new Date().toISOString().slice(0, 7),
    supplierCode: "",
    supplierName: "",
    receivedQty: "",
    defectQty: "",
    ncCount: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const receivedQty = Number(formData.receivedQty) || 0;
    const defectQty = Number(formData.defectQty) || 0;
    const defectRate = receivedQty > 0 ? Math.round((defectQty / receivedQty) * 10000) / 100 : 0;

    const newRecord: QualityPerformance = {
      id: Date.now(),
      yearMonth: formData.yearMonth,
      supplierCode: formData.supplierCode,
      supplierName: formData.supplierName,
      receivedQty,
      defectQty,
      defectRate,
      ncCount: Number(formData.ncCount) || 0,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      yearMonth: new Date().toISOString().slice(0, 7),
      supplierCode: "",
      supplierName: "",
      receivedQty: "",
      defectQty: "",
      ncCount: "",
    });
    alert("품질성과가 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">품질성과</h1>
          <p className="text-muted-foreground">공급자 품질 실적 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          실적 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>품질성과 등록</CardTitle>
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
                  <Label>입고수량</Label>
                  <Input
                    type="number"
                    value={formData.receivedQty}
                    onChange={(e) => setFormData({ ...formData, receivedQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>불량수량</Label>
                  <Input
                    type="number"
                    value={formData.defectQty}
                    onChange={(e) => setFormData({ ...formData, defectQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>부적합 건수</Label>
                  <Input
                    type="number"
                    value={formData.ncCount}
                    onChange={(e) => setFormData({ ...formData, ncCount: e.target.value })}
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
            <BarChart3 className="h-5 w-5" />
            품질성과 이력
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
                  <TableHead className="text-right">입고</TableHead>
                  <TableHead className="text-right">불량</TableHead>
                  <TableHead className="text-right">불량률</TableHead>
                  <TableHead className="text-right">NC건수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.yearMonth}</TableCell>
                    <TableCell className="font-mono">{r.supplierCode}</TableCell>
                    <TableCell>{r.supplierName}</TableCell>
                    <TableCell className="text-right">{r.receivedQty.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">{r.defectQty}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={r.defectRate <= 0.5 ? "success" : r.defectRate <= 1 ? "warning" : "destructive"}>
                        {r.defectRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{r.ncCount}</TableCell>
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
