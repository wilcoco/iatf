"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Box } from "lucide-react";

interface Part {
  id: number;
  partNo: string;
  name: string;
  category: string;
  vehicleModel?: { code: string; name: string };
}

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parts")
      .then((res) => res.json())
      .then((data) => {
        setParts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">차종/부품 관리</h1>
          <p className="text-muted-foreground">차종 및 부품 마스터 데이터</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          부품 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            부품 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-mono">{part.partNo}</TableCell>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell>{part.vehicleModel?.code || "-"}</TableCell>
                    <TableCell>{part.category || "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">상세</Button>
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
