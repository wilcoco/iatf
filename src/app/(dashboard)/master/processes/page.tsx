"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText } from "lucide-react";

interface Process {
  id: number;
  code: string;
  name: string;
  category: string;
  documentNo: string;
  revision: string;
  isActive: boolean;
}

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/processes")
      .then((res) => res.json())
      .then((data) => {
        setProcesses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categoryColors: Record<string, string> = {
    품질: "bg-blue-100 text-blue-800",
    생산: "bg-green-100 text-green-800",
    구매: "bg-yellow-100 text-yellow-800",
    경영: "bg-purple-100 text-purple-800",
    영업: "bg-orange-100 text-orange-800",
    안전: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">프로세스/절차서</h1>
          <p className="text-muted-foreground">품질경영시스템 프로세스 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          프로세스 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            프로세스 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>코드</TableHead>
                  <TableHead>프로세스명</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead>문서번호</TableHead>
                  <TableHead>개정</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell className="font-mono">{proc.code}</TableCell>
                    <TableCell className="font-medium">{proc.name}</TableCell>
                    <TableCell>
                      {proc.category && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[proc.category] || "bg-gray-100"}`}>
                          {proc.category}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{proc.documentNo || "-"}</TableCell>
                    <TableCell>{proc.revision || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={proc.isActive ? "success" : "secondary"}>
                        {proc.isActive ? "유효" : "폐기"}
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
