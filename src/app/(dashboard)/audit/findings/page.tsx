"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileSearch } from "lucide-react";

interface AuditFinding {
  id: number;
  findingNumber: string;
  type: string;
  severity: string;
  clauseReference: string;
  description: string;
  status: string;
  auditPlan?: { planNumber: string };
}

export default function AuditFindingsPage() {
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit/findings")
      .then((res) => res.json())
      .then((data) => {
        setFindings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const severityColors: Record<string, string> = {
    major: "bg-red-100 text-red-800",
    minor: "bg-yellow-100 text-yellow-800",
    observation: "bg-blue-100 text-blue-800",
    opportunity: "bg-green-100 text-green-800",
  };

  const severityLabels: Record<string, string> = {
    major: "중결함",
    minor: "경결함",
    observation: "관찰사항",
    opportunity: "개선기회",
  };

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    closed: "bg-green-100 text-green-800",
  };

  const statusLabels: Record<string, string> = {
    open: "발행",
    "in-progress": "조치중",
    closed: "종결",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">심사 발견사항</h1>
          <p className="text-muted-foreground">심사 결함 및 관찰사항 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          발견사항 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" />
            발견사항 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : findings.length === 0 ? (
            <p className="text-muted-foreground">등록된 발견사항이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>발견번호</TableHead>
                  <TableHead>심사번호</TableHead>
                  <TableHead>조항</TableHead>
                  <TableHead>심각도</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((finding) => (
                  <TableRow key={finding.id}>
                    <TableCell className="font-mono">{finding.findingNumber}</TableCell>
                    <TableCell>{finding.auditPlan?.planNumber || "-"}</TableCell>
                    <TableCell>{finding.clauseReference || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[finding.severity] || "bg-gray-100"}`}>
                        {severityLabels[finding.severity] || finding.severity}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{finding.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[finding.status] || "bg-gray-100"}`}>
                        {statusLabels[finding.status] || finding.status}
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
