"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, AlertCircle } from "lucide-react";

interface EmergencyType {
  id: number;
  code: string;
  name: string;
  category: string;
  severity: string;
  responseTime: number;
  isActive: boolean;
}

export default function EmergencyTypesPage() {
  const [types, setTypes] = useState<EmergencyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emergency/types")
      .then((res) => res.json())
      .then((data) => {
        setTypes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const severityColors: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  };

  const severityLabels: Record<string, string> = {
    high: "긴급",
    medium: "중요",
    low: "일반",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비상 유형</h1>
          <p className="text-muted-foreground">비상상황 유형 및 대응 기준 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          유형 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            비상 유형 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : types.length === 0 ? (
            <p className="text-muted-foreground">등록된 비상 유형이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>코드</TableHead>
                  <TableHead>유형명</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead>심각도</TableHead>
                  <TableHead>대응시간</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-mono">{type.code}</TableCell>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.category || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[type.severity] || "bg-gray-100"}`}>
                        {severityLabels[type.severity] || type.severity}
                      </span>
                    </TableCell>
                    <TableCell>{type.responseTime ? `${type.responseTime}분` : "-"}</TableCell>
                    <TableCell>
                      <Badge variant={type.isActive ? "success" : "secondary"}>
                        {type.isActive ? "활성" : "비활성"}
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
