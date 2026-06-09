"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Target } from "lucide-react";

interface KpiDefinition {
  id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
  targetValue: number;
  frequency: string;
  isActive: boolean;
  department?: { name: string };
}

export default function KpiDefinitionsPage() {
  const [kpis, setKpis] = useState<KpiDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kpi/definitions")
      .then((res) => res.json())
      .then((data) => {
        setKpis(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const frequencyLabels: Record<string, string> = {
    daily: "일간",
    weekly: "주간",
    monthly: "월간",
    quarterly: "분기",
    yearly: "연간",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KPI 정의</h1>
          <p className="text-muted-foreground">핵심성과지표 항목 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          KPI 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            KPI 항목 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : kpis.length === 0 ? (
            <p className="text-muted-foreground">등록된 KPI가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>코드</TableHead>
                  <TableHead>KPI명</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>단위</TableHead>
                  <TableHead>목표</TableHead>
                  <TableHead>주기</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpis.map((kpi) => (
                  <TableRow key={kpi.id}>
                    <TableCell className="font-mono">{kpi.code}</TableCell>
                    <TableCell className="font-medium">{kpi.name}</TableCell>
                    <TableCell>{kpi.category || "-"}</TableCell>
                    <TableCell>{kpi.department?.name || "-"}</TableCell>
                    <TableCell>{kpi.unit || "-"}</TableCell>
                    <TableCell>{kpi.targetValue ?? "-"}</TableCell>
                    <TableCell>{frequencyLabels[kpi.frequency] || kpi.frequency}</TableCell>
                    <TableCell>
                      <Badge variant={kpi.isActive ? "success" : "secondary"}>
                        {kpi.isActive ? "활성" : "비활성"}
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
