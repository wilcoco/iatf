"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, Save } from "lucide-react";

interface CapaRecord {
  id: number;
  period: string;
  vehicleType: string;
  productLine: string;
  currentCapacity: string;
  requiredCapacity: string;
  utilizationRate: string;
  analysisResult: string;
  improvements: string;
  status: string;
}

export default function CapaPage() {
  const [records, setRecords] = useState<CapaRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    period: "",
    vehicleType: "",
    productLine: "",
    currentCapacity: "",
    requiredCapacity: "",
    utilizationRate: "",
    analysisResult: "",
    improvements: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CapaRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      period: "",
      vehicleType: "",
      productLine: "",
      currentCapacity: "",
      requiredCapacity: "",
      utilizationRate: "",
      analysisResult: "",
      improvements: "",
      status: "",
    });
    alert("CAPA 분석 기록이 저장되었습니다.");
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "완료": return "success";
      case "진행중": return "warning";
      case "미착수": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CAPA 분석</h1>
          <p className="text-muted-foreground">반기별 생산능력 분석 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          분석 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>CAPA 분석 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>분석기간 *</Label>
                  <Select value={formData.period} onValueChange={(v) => setFormData({ ...formData, period: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026-1H">2026년 상반기</SelectItem>
                      <SelectItem value="2026-2H">2026년 하반기</SelectItem>
                      <SelectItem value="2025-1H">2025년 상반기</SelectItem>
                      <SelectItem value="2025-2H">2025년 하반기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>차종 *</Label>
                  <Input
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="차종명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>제품라인 *</Label>
                  <Input
                    value={formData.productLine}
                    onChange={(e) => setFormData({ ...formData, productLine: e.target.value })}
                    placeholder="제품라인"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="미착수">미착수</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>현재능력 (EA/월) *</Label>
                  <Input
                    type="number"
                    value={formData.currentCapacity}
                    onChange={(e) => setFormData({ ...formData, currentCapacity: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>요구능력 (EA/월) *</Label>
                  <Input
                    type="number"
                    value={formData.requiredCapacity}
                    onChange={(e) => setFormData({ ...formData, requiredCapacity: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>가동률 (%)</Label>
                  <Input
                    type="number"
                    value={formData.utilizationRate}
                    onChange={(e) => setFormData({ ...formData, utilizationRate: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>분석결과</Label>
                  <Textarea
                    value={formData.analysisResult}
                    onChange={(e) => setFormData({ ...formData, analysisResult: e.target.value })}
                    placeholder="분석 결과를 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>개선대책</Label>
                  <Textarea
                    value={formData.improvements}
                    onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                    placeholder="개선대책을 입력하세요"
                    rows={3}
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
            CAPA 분석 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 CAPA 분석 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>분석기간</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>제품라인</TableHead>
                  <TableHead>현재능력</TableHead>
                  <TableHead>요구능력</TableHead>
                  <TableHead>가동률</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.period}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.productLine}</TableCell>
                    <TableCell className="text-right">{Number(record.currentCapacity).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{Number(record.requiredCapacity).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.utilizationRate ? `${record.utilizationRate}%` : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(record.status)}>{record.status}</Badge>
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
