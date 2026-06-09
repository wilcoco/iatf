"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Star } from "lucide-react";

interface SupplierEvaluation {
  id: number;
  evaluationPeriod: string;
  qualityScore: number;
  deliveryScore: number;
  priceScore: number;
  totalScore: number;
  grade: string;
  supplier?: { code: string; name: string };
}

export default function SupplierEvaluationPage() {
  const [evaluations, setEvaluations] = useState<SupplierEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/supplier/evaluation")
      .then((res) => res.json())
      .then((data) => {
        setEvaluations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const gradeColors: Record<string, string> = {
    A: "bg-green-100 text-green-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공급업체 평가</h1>
          <p className="text-muted-foreground">협력사 정기 평가 이력</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          평가 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            공급업체 평가 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : evaluations.length === 0 ? (
            <p className="text-muted-foreground">등록된 평가 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>업체코드</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead>평가기간</TableHead>
                  <TableHead>품질</TableHead>
                  <TableHead>납기</TableHead>
                  <TableHead>가격</TableHead>
                  <TableHead>종합점수</TableHead>
                  <TableHead>등급</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((eval_) => (
                  <TableRow key={eval_.id}>
                    <TableCell className="font-mono">{eval_.supplier?.code || "-"}</TableCell>
                    <TableCell className="font-medium">{eval_.supplier?.name || "-"}</TableCell>
                    <TableCell>{eval_.evaluationPeriod}</TableCell>
                    <TableCell>{eval_.qualityScore?.toFixed(1)}</TableCell>
                    <TableCell>{eval_.deliveryScore?.toFixed(1)}</TableCell>
                    <TableCell>{eval_.priceScore?.toFixed(1)}</TableCell>
                    <TableCell className="font-bold">{eval_.totalScore?.toFixed(1)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[eval_.grade] || "bg-gray-100"}`}>
                        {eval_.grade}
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
