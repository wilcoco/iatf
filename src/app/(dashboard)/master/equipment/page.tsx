"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Factory } from "lucide-react";

interface Equipment {
  id: number;
  assetNo: string;
  name: string;
  category: string;
  location: string;
  status: string;
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/equipment")
      .then((res) => res.json())
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비 관리</h1>
          <p className="text-muted-foreground">생산설비 마스터 데이터</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          설비 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            설비 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>자산번호</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((eq) => (
                  <TableRow key={eq.id}>
                    <TableCell className="font-mono">{eq.assetNo}</TableCell>
                    <TableCell className="font-medium">{eq.name}</TableCell>
                    <TableCell>{eq.category}</TableCell>
                    <TableCell>{eq.location}</TableCell>
                    <TableCell>
                      <Badge variant={eq.status === "active" ? "success" : "warning"}>
                        {eq.status === "active" ? "가동중" : "정지"}
                      </Badge>
                    </TableCell>
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
