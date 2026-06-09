"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Plus, Save, TrendingUp, TrendingDown } from "lucide-react";

interface MtbfRecord {
  id: number;
  yearMonth: string;
  equipmentNo: string;
  equipmentName: string;
  operatingHours: number;
  failureCount: number;
  totalDowntime: number;
  mtbf: number;
  mttr: number;
  availability: number;
}

export default function MtbfMttrPage() {
  const [records, setRecords] = useState<MtbfRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    yearMonth: new Date().toISOString().slice(0, 7),
    equipmentNo: "",
    equipmentName: "",
    operatingHours: "",
    failureCount: "",
    totalDowntime: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const calculateMetrics = () => {
    const operatingHours = Number(formData.operatingHours) || 0;
    const failureCount = Number(formData.failureCount) || 0;
    const totalDowntime = Number(formData.totalDowntime) || 0;

    const mtbf = failureCount > 0 ? operatingHours / failureCount : operatingHours;
    const mttr = failureCount > 0 ? totalDowntime / failureCount : 0;
    const availability = operatingHours > 0 ? ((operatingHours - totalDowntime) / operatingHours) * 100 : 100;

    return { mtbf: mtbf.toFixed(1), mttr: mttr.toFixed(1), availability: availability.toFixed(2) };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const metrics = calculateMetrics();
    const newRecord: MtbfRecord = {
      id: Date.now(),
      yearMonth: formData.yearMonth,
      equipmentNo: formData.equipmentNo,
      equipmentName: formData.equipmentName,
      operatingHours: Number(formData.operatingHours),
      failureCount: Number(formData.failureCount),
      totalDowntime: Number(formData.totalDowntime),
      mtbf: Number(metrics.mtbf),
      mttr: Number(metrics.mttr),
      availability: Number(metrics.availability),
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      yearMonth: new Date().toISOString().slice(0, 7),
      equipmentNo: "",
      equipmentName: "",
      operatingHours: "",
      failureCount: "",
      totalDowntime: "",
    });
    alert("MTBF/MTTR 기록이 저장되었습니다.");
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MTBF/MTTR 분석</h1>
          <p className="text-muted-foreground">설비 신뢰성 지표 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          분석 등록
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTBF (평균고장간격)</p>
                <p className="text-2xl font-bold">- 시간</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">높을수록 좋음</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTTR (평균수리시간)</p>
                <p className="text-2xl font-bold">- 시간</p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">낮을수록 좋음</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">설비가동률</p>
                <p className="text-2xl font-bold">- %</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">목표: 95% 이상</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>MTBF/MTTR 분석 등록</CardTitle>
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
                  <Label>설비번호 *</Label>
                  <Input
                    value={formData.equipmentNo}
                    onChange={(e) => setFormData({ ...formData, equipmentNo: e.target.value })}
                    placeholder="EQ-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비명 *</Label>
                  <Input
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="설비명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>가동시간 (시간) *</Label>
                  <Input
                    type="number"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>고장횟수 *</Label>
                  <Input
                    type="number"
                    value={formData.failureCount}
                    onChange={(e) => setFormData({ ...formData, failureCount: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>총 정지시간 (시간) *</Label>
                  <Input
                    type="number"
                    value={formData.totalDowntime}
                    onChange={(e) => setFormData({ ...formData, totalDowntime: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">MTBF (계산값)</p>
                  <p className="text-xl font-bold">{metrics.mtbf} 시간</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MTTR (계산값)</p>
                  <p className="text-xl font-bold">{metrics.mttr} 시간</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">가동률 (계산값)</p>
                  <p className="text-xl font-bold">{metrics.availability}%</p>
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
            MTBF/MTTR 분석 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">분석 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기준년월</TableHead>
                  <TableHead>설비번호</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead className="text-right">가동시간</TableHead>
                  <TableHead className="text-right">고장횟수</TableHead>
                  <TableHead className="text-right">정지시간</TableHead>
                  <TableHead className="text-right">MTBF</TableHead>
                  <TableHead className="text-right">MTTR</TableHead>
                  <TableHead className="text-right">가동률</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.yearMonth}</TableCell>
                    <TableCell className="font-mono">{record.equipmentNo}</TableCell>
                    <TableCell>{record.equipmentName}</TableCell>
                    <TableCell className="text-right">{record.operatingHours}h</TableCell>
                    <TableCell className="text-right">{record.failureCount}회</TableCell>
                    <TableCell className="text-right">{record.totalDowntime}h</TableCell>
                    <TableCell className="text-right font-mono">{record.mtbf}h</TableCell>
                    <TableCell className="text-right font-mono">{record.mttr}h</TableCell>
                    <TableCell className="text-right font-bold">{record.availability}%</TableCell>
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
