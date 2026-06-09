"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package } from "lucide-react";

interface SupplierDelivery {
  id: number;
  deliveryNumber: string;
  partNo: string;
  quantity: number;
  deliveredAt: string;
  inspectionResult: string;
  supplier?: { code: string; name: string };
}

export default function SupplierDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<SupplierDelivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/supplier/deliveries")
      .then((res) => res.json())
      .then((data) => {
        setDeliveries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const resultColors: Record<string, string> = {
    pass: "bg-green-100 text-green-800",
    fail: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const resultLabels: Record<string, string> = {
    pass: "합격",
    fail: "불합격",
    pending: "검사중",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">입고 관리</h1>
          <p className="text-muted-foreground">공급업체 납품 이력</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          입고 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            입고 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : deliveries.length === 0 ? (
            <p className="text-muted-foreground">등록된 입고 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>입고번호</TableHead>
                  <TableHead>업체코드</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>수량</TableHead>
                  <TableHead>입고일</TableHead>
                  <TableHead>검사결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-mono">{delivery.deliveryNumber}</TableCell>
                    <TableCell className="font-mono">{delivery.supplier?.code || "-"}</TableCell>
                    <TableCell>{delivery.supplier?.name || "-"}</TableCell>
                    <TableCell>{delivery.partNo}</TableCell>
                    <TableCell>{delivery.quantity}</TableCell>
                    <TableCell>{new Date(delivery.deliveredAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultColors[delivery.inspectionResult] || "bg-gray-100"}`}>
                        {resultLabels[delivery.inspectionResult] || delivery.inspectionResult || "미검사"}
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
