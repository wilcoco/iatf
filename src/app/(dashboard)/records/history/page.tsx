"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Eye } from "lucide-react";
import Link from "next/link";

interface InspectionRecord {
  id: number;
  inspectionDate: string;
  shift: string;
  result: string;
  findings: string;
  createdAt: string;
  controlItem?: {
    id: number;
    itemNo: number;
    name: string;
    frequency: string;
    process?: { name: string };
  };
  inspector?: { name: string };
}

export default function RecordsHistoryPage() {
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetch("/api/inspection-records")
      .then((res) => res.json())
      .then((data) => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.controlItem?.name.toLowerCase().includes(search.toLowerCase()) ||
      record.controlItem?.process?.name.toLowerCase().includes(search.toLowerCase()) ||
      record.controlItem?.itemNo.toString().includes(search);
    const matchesDate = !dateFilter || record.inspectionDate.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  const resultColors: Record<string, string> = {
    합격: "bg-green-100 text-green-800",
    완료: "bg-green-100 text-green-800",
    불합격: "bg-red-100 text-red-800",
    조건부: "bg-yellow-100 text-yellow-800",
    진행중: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">기록 이력</h1>
        <p className="text-muted-foreground">입력된 관리항목 기록 조회</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="항목명, 프로세스, 번호로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Input
          type="month"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-40"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            기록 이력 ({filteredRecords.length}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-8 text-center">로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">NO</TableHead>
                  <TableHead>관리항목</TableHead>
                  <TableHead className="w-32">프로세스</TableHead>
                  <TableHead className="w-28">기록일자</TableHead>
                  <TableHead className="w-20">조</TableHead>
                  <TableHead className="w-20">결과</TableHead>
                  <TableHead className="w-24">기록자</TableHead>
                  <TableHead className="w-20">상세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-sm">
                      #{record.controlItem?.itemNo || "-"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.controlItem?.name || "-"}</p>
                        {record.findings && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {record.findings.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.controlItem?.process?.name || "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(record.inspectionDate).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell>{record.shift || "-"}</TableCell>
                    <TableCell>
                      {record.result && (
                        <Badge
                          variant="secondary"
                          className={resultColors[record.result] || ""}
                        >
                          {record.result}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{record.inspector?.name || "-"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/records/history/${record.id}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
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
