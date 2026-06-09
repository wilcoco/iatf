"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar } from "lucide-react";

interface AuditPlan {
  id: number;
  planNumber: string;
  auditType: string;
  scope: string;
  scheduledDate: string;
  status: string;
  leadAuditor?: { name: string };
}

export default function AuditPlansPage() {
  const [plans, setPlans] = useState<AuditPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const typeLabels: Record<string, string> = {
    internal: "내부심사",
    supplier: "공급자심사",
    customer: "고객심사",
    certification: "인증심사",
  };

  const statusColors: Record<string, string> = {
    planned: "bg-blue-100 text-blue-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    planned: "계획",
    "in-progress": "진행중",
    completed: "완료",
    cancelled: "취소",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">심사 계획</h1>
          <p className="text-muted-foreground">내부/외부 심사 계획 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          계획 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            심사 계획 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : plans.length === 0 ? (
            <p className="text-muted-foreground">등록된 심사 계획이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>계획번호</TableHead>
                  <TableHead>심사유형</TableHead>
                  <TableHead>심사범위</TableHead>
                  <TableHead>심사예정일</TableHead>
                  <TableHead>선임심사원</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-mono">{plan.planNumber}</TableCell>
                    <TableCell>{typeLabels[plan.auditType] || plan.auditType}</TableCell>
                    <TableCell className="max-w-xs truncate">{plan.scope}</TableCell>
                    <TableCell>{new Date(plan.scheduledDate).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>{plan.leadAuditor?.name || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[plan.status] || "bg-gray-100"}`}>
                        {statusLabels[plan.status] || plan.status}
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
