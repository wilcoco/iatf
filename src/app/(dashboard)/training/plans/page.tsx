"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, BookOpen } from "lucide-react";

interface TrainingPlan {
  id: number;
  planNumber: string;
  title: string;
  category: string;
  targetAudience: string;
  scheduledDate: string;
  duration: number;
  status: string;
}

export default function TrainingPlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          <h1 className="text-3xl font-bold">교육 계획</h1>
          <p className="text-muted-foreground">연간 교육 계획 및 일정 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          계획 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            교육 계획 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : plans.length === 0 ? (
            <p className="text-muted-foreground">등록된 교육 계획이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>계획번호</TableHead>
                  <TableHead>교육명</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead>대상</TableHead>
                  <TableHead>예정일</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-mono">{plan.planNumber}</TableCell>
                    <TableCell className="font-medium">{plan.title}</TableCell>
                    <TableCell>{plan.category || "-"}</TableCell>
                    <TableCell>{plan.targetAudience || "-"}</TableCell>
                    <TableCell>{new Date(plan.scheduledDate).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>{plan.duration ? `${plan.duration}시간` : "-"}</TableCell>
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
