"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, TrendingUp } from "lucide-react";

interface KpiRecord {
  id: number;
  period: string;
  actualValue: number;
  targetValue: number;
  achievementRate: number;
  kpiDefinition?: { code: string; name: string; unit: string };
}

export default function KpiRecordsPage() {
  const [records, setRecords] = useState<KpiRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kpi/records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KPI 실적</h1>
          <p className="text-muted-foreground">KPI 실적 기록 및 달성률 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          실적 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            KPI 실적 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground">등록된 KPI 실적이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KPI코드</TableHead>
                  <TableHead>KPI명</TableHead>
                  <TableHead>기간</TableHead>
                  <TableHead>목표</TableHead>
                  <TableHead>실적</TableHead>
                  <TableHead>달성률</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.kpiDefinition?.code || "-"}</TableCell>
                    <TableCell className="font-medium">{record.kpiDefinition?.name || "-"}</TableCell>
                    <TableCell>{record.period}</TableCell>
                    <TableCell>{record.targetValue} {record.kpiDefinition?.unit}</TableCell>
                    <TableCell>{record.actualValue} {record.kpiDefinition?.unit}</TableCell>
                    <TableCell>{record.achievementRate?.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant={record.achievementRate >= 100 ? "success" : record.achievementRate >= 80 ? "warning" : "destructive"}>
                        {record.achievementRate >= 100 ? "달성" : record.achievementRate >= 80 ? "양호" : "미달"}
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
