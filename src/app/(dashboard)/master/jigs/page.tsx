"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Wrench } from "lucide-react";

interface Jig {
  id: number;
  code: string;
  name: string;
  type: string;
  status: string;
  location: string;
  lastInspectionDate: string;
  nextInspectionDate: string;
}

export default function JigsPage() {
  const [jigs, setJigs] = useState<Jig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jigs")
      .then((res) => res.json())
      .then((data) => {
        setJigs(data);
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
    active: "사용중",
    maintenance: "정비중",
    repair: "수리중",
    inactive: "미사용",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">치공구 관리</h1>
          <p className="text-muted-foreground">치공구 마스터 및 점검 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          치공구 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            치공구 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : jigs.length === 0 ? (
            <p className="text-muted-foreground">등록된 치공구가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>치공구코드</TableHead>
                  <TableHead>치공구명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>최근점검일</TableHead>
                  <TableHead>차기점검일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jigs.map((jig) => (
                  <TableRow key={jig.id}>
                    <TableCell className="font-mono">{jig.code}</TableCell>
                    <TableCell className="font-medium">{jig.name}</TableCell>
                    <TableCell>{jig.type || "-"}</TableCell>
                    <TableCell>{jig.location || "-"}</TableCell>
                    <TableCell>{jig.lastInspectionDate ? new Date(jig.lastInspectionDate).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>{jig.nextInspectionDate ? new Date(jig.nextInspectionDate).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[jig.status] || "bg-gray-100"}`}>
                        {statusLabels[jig.status] || jig.status}
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
