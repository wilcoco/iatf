"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ClipboardCheck } from "lucide-react";

interface Inspection {
  id: number;
  inspectionNo: string;
  type: string;
  partNo: string;
  lotNo: string;
  quantity: number;
  sampleSize: number;
  result: string;
  inspectedAt: string;
  inspector?: { name: string };
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quality/inspections")
      .then((res) => res.json())
      .then((data) => {
        setInspections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const resultColors: Record<string, string> = {
    pass: "bg-green-100 text-green-800",
    fail: "bg-red-100 text-red-800",
    conditional: "bg-yellow-100 text-yellow-800",
    pending: "bg-gray-100 text-gray-800",
  };

  const resultLabels: Record<string, string> = {
    pass: "합격",
    fail: "불합격",
    conditional: "조건부합격",
    pending: "검사중",
  };

  const typeLabels: Record<string, string> = {
    incoming: "수입검사",
    inprocess: "공정검사",
    final: "최종검사",
    shipping: "출하검사",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">검사 기록</h1>
          <p className="text-muted-foreground">수입/공정/출하 검사 이력 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          검사 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            검사 기록 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : inspections.length === 0 ? (
            <p className="text-muted-foreground">등록된 검사 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>검사번호</TableHead>
                  <TableHead>검사유형</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>LOT번호</TableHead>
                  <TableHead>수량</TableHead>
                  <TableHead>샘플수</TableHead>
                  <TableHead>검사자</TableHead>
                  <TableHead>검사일</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.map((insp) => (
                  <TableRow key={insp.id}>
                    <TableCell className="font-mono">{insp.inspectionNo}</TableCell>
                    <TableCell>{typeLabels[insp.type] || insp.type}</TableCell>
                    <TableCell>{insp.partNo}</TableCell>
                    <TableCell>{insp.lotNo || "-"}</TableCell>
                    <TableCell>{insp.quantity}</TableCell>
                    <TableCell>{insp.sampleSize}</TableCell>
                    <TableCell>{insp.inspector?.name || "-"}</TableCell>
                    <TableCell>{new Date(insp.inspectedAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultColors[insp.result] || "bg-gray-100"}`}>
                        {resultLabels[insp.result] || insp.result}
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
