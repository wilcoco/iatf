"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle } from "lucide-react";
import { getCommonCodesByGroup, type CommonCode } from "@/lib/master-data";

interface Nonconformance {
  id: number;
  ncNumber: string;
  type: string;
  severity: string;
  status: string;
  actionType?: string;
  description: string;
  detectedAt: string;
  detectedBy?: { name: string };
}

export default function NonconformancePage() {
  const [ncList, setNcList] = useState<Nonconformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTypeFilter, setActionTypeFilter] = useState("");

  const actionTypes = getCommonCodesByGroup("ACTION_TYPE");

  useEffect(() => {
    fetch("/api/quality/nonconformance")
      .then((res) => res.json())
      .then((data) => {
        setNcList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const severityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    major: "bg-orange-100 text-orange-800",
    minor: "bg-yellow-100 text-yellow-800",
  };

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-800",
    investigating: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    open: "발생",
    investigating: "조사중",
    resolved: "해결",
    closed: "종결",
  };

  const filteredNcList = ncList.filter((nc) => {
    if (!actionTypeFilter) return true;
    return nc.actionType === actionTypeFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">부적합 관리</h1>
          <p className="text-muted-foreground">부적합 발생 및 처리 이력</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          부적합 등록
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="space-y-1">
          <label className="text-sm font-medium">조치유형 필터</label>
          <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체</SelectItem>
              {actionTypes.map((a) => (
                <SelectItem key={a.code} value={a.code}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            부적합 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredNcList.length === 0 ? (
            <p className="text-muted-foreground">등록된 부적합이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>부적합번호</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>심각도</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>발견자</TableHead>
                  <TableHead>발견일</TableHead>
                  <TableHead>조치유형</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNcList.map((nc) => (
                  <TableRow key={nc.id}>
                    <TableCell className="font-mono">{nc.ncNumber}</TableCell>
                    <TableCell>{nc.type}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[nc.severity] || "bg-gray-100"}`}>
                        {nc.severity === "critical" ? "치명" : nc.severity === "major" ? "중대" : "경미"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{nc.description}</TableCell>
                    <TableCell>{nc.detectedBy?.name || "-"}</TableCell>
                    <TableCell>{new Date(nc.detectedAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>
                      {nc.actionType ? actionTypes.find(a => a.code === nc.actionType)?.name || nc.actionType : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[nc.status] || "bg-gray-100"}`}>
                        {statusLabels[nc.status] || nc.status}
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
