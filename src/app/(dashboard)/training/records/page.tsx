"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, GraduationCap } from "lucide-react";

interface TrainingRecord {
  id: number;
  completedAt: string;
  score: number;
  result: string;
  trainee?: { name: string; employeeId: string };
  trainingPlan?: { title: string };
}

export default function TrainingRecordsPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/records")
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
          <h1 className="text-3xl font-bold">교육 이수 기록</h1>
          <p className="text-muted-foreground">직원 교육 이수 이력 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          이수 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            교육 이수 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground">등록된 교육 이수 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>사번</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>교육명</TableHead>
                  <TableHead>완료일</TableHead>
                  <TableHead>점수</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.trainee?.employeeId || "-"}</TableCell>
                    <TableCell className="font-medium">{record.trainee?.name || "-"}</TableCell>
                    <TableCell>{record.trainingPlan?.title || "-"}</TableCell>
                    <TableCell>{new Date(record.completedAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>{record.score ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={record.result === "pass" ? "success" : "destructive"}>
                        {record.result === "pass" ? "합격" : "불합격"}
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
