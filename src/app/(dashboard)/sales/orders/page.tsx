"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ShoppingCart, ClipboardList } from "lucide-react";

interface Order {
  id: number;
  orderDate: string;
  orderNo: string;
  customer: string;
  vehicleType: string;
  partName: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  deliveryDate: string;
  status: string;
}

const initialData: Order[] = [
  {
    id: 1,
    orderDate: "2026-06-01",
    orderNo: "ORD-2026-0601",
    customer: "현대자동차",
    vehicleType: "아반떼",
    partName: "도어트림 LH",
    qty: 1000,
    unitPrice: 25000,
    totalAmount: 25000000,
    deliveryDate: "2026-06-15",
    status: "생산중",
  },
  {
    id: 2,
    orderDate: "2026-06-03",
    orderNo: "ORD-2026-0603",
    customer: "기아자동차",
    vehicleType: "K5",
    partName: "센터콘솔",
    qty: 500,
    unitPrice: 45000,
    totalAmount: 22500000,
    deliveryDate: "2026-06-20",
    status: "접수",
  },
  {
    id: 3,
    orderDate: "2026-05-20",
    orderNo: "ORD-2026-0520",
    customer: "현대자동차",
    vehicleType: "소나타",
    partName: "글로브박스",
    qty: 800,
    unitPrice: 18000,
    totalAmount: 14400000,
    deliveryDate: "2026-06-05",
    status: "납품완료",
  },
];

const statusOptions = ["접수", "생산중", "출하대기", "납품완료", "취소"];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderDate: "",
    orderNo: "",
    customer: "",
    vehicleType: "",
    partName: "",
    qty: "",
    unitPrice: "",
    deliveryDate: "",
    status: "접수",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.qty);
    const unitPrice = Number(formData.unitPrice);
    const newOrder: Order = {
      id: orders.length + 1,
      orderDate: formData.orderDate,
      orderNo: formData.orderNo,
      customer: formData.customer,
      vehicleType: formData.vehicleType,
      partName: formData.partName,
      qty,
      unitPrice,
      totalAmount: qty * unitPrice,
      deliveryDate: formData.deliveryDate,
      status: formData.status,
    };
    setOrders([...orders, newOrder]);
    setShowForm(false);
    setFormData({
      orderDate: "",
      orderNo: "",
      customer: "",
      vehicleType: "",
      partName: "",
      qty: "",
      unitPrice: "",
      deliveryDate: "",
      status: "접수",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
      접수: "secondary",
      생산중: "default",
      출하대기: "warning",
      납품완료: "success",
      취소: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">수주관리</h1>
          <p className="text-muted-foreground">수주관리대장</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          수주 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              수주 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderDate">수주일자</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) =>
                      setFormData({ ...formData, orderDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderNo">수주번호</Label>
                  <Input
                    id="orderNo"
                    value={formData.orderNo}
                    onChange={(e) =>
                      setFormData({ ...formData, orderNo: e.target.value })
                    }
                    placeholder="예: ORD-2026-0601"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">고객사</Label>
                  <Input
                    id="customer"
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    placeholder="예: 현대자동차"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">납기일</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">차종</Label>
                  <Input
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                    placeholder="예: 아반떼"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partName">품명</Label>
                  <Input
                    id="partName"
                    value={formData.partName}
                    onChange={(e) =>
                      setFormData({ ...formData, partName: e.target.value })
                    }
                    placeholder="예: 도어트림 LH"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">수량</Label>
                  <Input
                    id="qty"
                    type="number"
                    min="1"
                    value={formData.qty}
                    onChange={(e) =>
                      setFormData({ ...formData, qty: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">단가 (원)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
                <Button type="submit">등록</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            수주 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">등록된 수주가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>수주일자</TableHead>
                  <TableHead>수주번호</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead className="text-right">수량</TableHead>
                  <TableHead className="text-right">단가</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                  <TableHead>납기일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(order.orderDate)}
                    </TableCell>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.vehicleType}</TableCell>
                    <TableCell>{order.partName}</TableCell>
                    <TableCell className="text-right">{order.qty.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(order.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(order.deliveryDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
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
