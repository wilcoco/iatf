"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Box } from "lucide-react";

interface Mold {
  id: number;
  code: string;
  name: string;
  type: string;
  cavities: number;
  cycleTime: number;
  status: string;
  location: string;
}

export default function MoldsPage() {
  const [molds, setMolds] = useState<Mold[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/molds")
      .then((res) => res.json())
      .then((data) => {
        setMolds(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    maintenance: "bg-yellow-100 text-yellow-800",
    repair: "bg-orange-100 text-orange-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    active: "가동중",
    maintenance: "정비중",
    repair: "수리중",
    inactive: "미사용",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">금형 관리</h1>
          <p className="text-muted-foreground">금형 마스터 및 이력 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          금형 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            금형 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : molds.length === 0 ? (
            <p className="text-muted-foreground">등록된 금형이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>금형코드</TableHead>
                  <TableHead>금형명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>캐비티</TableHead>
                  <TableHead>사이클타임</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {molds.map((mold) => (
                  <TableRow key={mold.id}>
                    <TableCell className="font-mono">{mold.code}</TableCell>
                    <TableCell className="font-medium">{mold.name}</TableCell>
                    <TableCell>{mold.type || "-"}</TableCell>
                    <TableCell>{mold.cavities || "-"}</TableCell>
                    <TableCell>{mold.cycleTime ? `${mold.cycleTime}초` : "-"}</TableCell>
                    <TableCell>{mold.location || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[mold.status] || "bg-gray-100"}`}>
                        {statusLabels[mold.status] || mold.status}
                      </span>
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
