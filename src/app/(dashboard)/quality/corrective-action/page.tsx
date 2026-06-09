"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CheckCircle } from "lucide-react";

interface CorrectiveAction {
  id: number;
  carNumber: string;
  type: string;
  status: string;
  problemDescription: string;
  dueDate: string;
  completedAt: string | null;
  responsiblePerson?: { name: string };
}

export default function CorrectiveActionPage() {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quality/corrective-action")
      .then((res) => res.json())
      .then((data) => {
        setActions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const typeLabels: Record<string, string> = {
    corrective: "시정조치",
    preventive: "예방조치",
  };

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    verification: "bg-blue-100 text-blue-800",
    closed: "bg-green-100 text-green-800",
  };

  const statusLabels: Record<string, string> = {
    open: "발행",
    "in-progress": "진행중",
    verification: "검증중",
    closed: "종결",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">시정/예방조치</h1>
          <p className="text-muted-foreground">CAR/PAR 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          조치 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            시정/예방조치 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : actions.length === 0 ? (
            <p className="text-muted-foreground">등록된 조치가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAR번호</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>문제내용</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>완료예정일</TableHead>
                  <TableHead>완료일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell className="font-mono">{action.carNumber}</TableCell>
                    <TableCell>{typeLabels[action.type] || action.type}</TableCell>
                    <TableCell className="max-w-xs truncate">{action.problemDescription}</TableCell>
                    <TableCell>{action.responsiblePerson?.name || "-"}</TableCell>
                    <TableCell>{action.dueDate ? new Date(action.dueDate).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>{action.completedAt ? new Date(action.completedAt).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[action.status] || "bg-gray-100"}`}>
                        {statusLabels[action.status] || action.status}
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
