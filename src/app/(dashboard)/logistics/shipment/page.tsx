"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Truck,
  Save,
  Search,
  Package,
  Clock,
  BarChart3,
  History,
  Calendar,
  Building2,
  FileText
} from "lucide-react";

// Types
interface ShipmentRecord {
  id: number;
  shipmentNo: string;
  shipmentDate: string;
  customer: string;
  deliveryLocation: string;
  productCode: string;
  productName: string;
  lotNo: string;
  quantity: number;
  carrier: string;
  vehicleNo: string;
  manager: string;
  status: "대기" | "출하완료" | "배송중" | "배송완료";
  remarks: string;
  createdAt: string;
}

interface PendingItem {
  id: number;
  productCode: string;
  productName: string;
  lotNo: string;
  inspectionDate: string;
  availableQty: number;
  dueDate: string;
  customer: string;
  priority: "긴급" | "일반" | "보류";
}

// Generate shipment number
const generateShipmentNo = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `SHP-${dateStr}-${random}`;
};

// Sample pending items data
const samplePendingItems: PendingItem[] = [
  {
    id: 1,
    productCode: "PRD-001",
    productName: "자동차 브레이크 패드",
    lotNo: "LOT-2026-0601",
    inspectionDate: "2026-06-08",
    availableQty: 500,
    dueDate: "2026-06-12",
    customer: "현대자동차",
    priority: "긴급",
  },
  {
    id: 2,
    productCode: "PRD-002",
    productName: "엔진 오일필터",
    lotNo: "LOT-2026-0602",
    inspectionDate: "2026-06-07",
    availableQty: 1200,
    dueDate: "2026-06-15",
    customer: "기아자동차",
    priority: "일반",
  },
  {
    id: 3,
    productCode: "PRD-003",
    productName: "에어컨 필터",
    lotNo: "LOT-2026-0603",
    inspectionDate: "2026-06-06",
    availableQty: 800,
    dueDate: "2026-06-20",
    customer: "GM코리아",
    priority: "일반",
  },
  {
    id: 4,
    productCode: "PRD-004",
    productName: "와이퍼 블레이드",
    lotNo: "LOT-2026-0604",
    inspectionDate: "2026-06-05",
    availableQty: 300,
    dueDate: "2026-06-10",
    customer: "르노코리아",
    priority: "긴급",
  },
];

export default function ShipmentManagementPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [records, setRecords] = useState<ShipmentRecord[]>([]);
  const [pendingItems] = useState<PendingItem[]>(samplePendingItems);
  const [search, setSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("daily");
  const [customerFilter, setCustomerFilter] = useState<string>("all");

  // Registration form state
  const [formData, setFormData] = useState({
    shipmentNo: generateShipmentNo(),
    shipmentDate: new Date().toISOString().split("T")[0],
    customer: "",
    deliveryLocation: "",
    productCode: "",
    productName: "",
    lotNo: "",
    quantity: 0,
    carrier: "",
    vehicleNo: "",
    manager: "",
    remarks: "",
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer || !formData.productCode || !formData.quantity || !formData.manager) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newRecord: ShipmentRecord = {
      id: Date.now(),
      shipmentNo: formData.shipmentNo,
      shipmentDate: formData.shipmentDate,
      customer: formData.customer,
      deliveryLocation: formData.deliveryLocation,
      productCode: formData.productCode,
      productName: formData.productName,
      lotNo: formData.lotNo,
      quantity: formData.quantity,
      carrier: formData.carrier,
      vehicleNo: formData.vehicleNo,
      manager: formData.manager,
      status: "대기",
      remarks: formData.remarks,
      createdAt: new Date().toISOString(),
    };

    setRecords([newRecord, ...records]);

    // Reset form
    setFormData({
      shipmentNo: generateShipmentNo(),
      shipmentDate: new Date().toISOString().split("T")[0],
      customer: "",
      deliveryLocation: "",
      productCode: "",
      productName: "",
      lotNo: "",
      quantity: 0,
      carrier: "",
      vehicleNo: "",
      manager: "",
      remarks: "",
    });

    alert("출하가 등록되었습니다.");
  };

  // Handle shipment from pending items
  const handleShipFromPending = (item: PendingItem) => {
    setFormData({
      ...formData,
      customer: item.customer,
      productCode: item.productCode,
      productName: item.productName,
      lotNo: item.lotNo,
      quantity: item.availableQty,
    });
    setActiveTab("registration");
  };

  // Update shipment status
  const updateStatus = (id: number, newStatus: ShipmentRecord["status"]) => {
    setRecords(records.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  // Filter records for history
  const filteredHistoryRecords = records.filter(
    (r) =>
      (r.shipmentNo.toLowerCase().includes(historySearch.toLowerCase()) ||
      r.productName.toLowerCase().includes(historySearch.toLowerCase()) ||
      r.customer.toLowerCase().includes(historySearch.toLowerCase())) &&
      (statusFilter === "all" || r.status === statusFilter)
  );

  // Filter pending items
  const filteredPendingItems = pendingItems.filter(
    (item) =>
      item.productCode.toLowerCase().includes(search.toLowerCase()) ||
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase())
  );

  // Get status stats for dashboard
  const getStatusStats = () => {
    const total = records.length;
    const waiting = records.filter(r => r.status === "대기").length;
    const shipped = records.filter(r => r.status === "출하완료").length;
    const inTransit = records.filter(r => r.status === "배송중").length;
    const delivered = records.filter(r => r.status === "배송완료").length;
    return { total, waiting, shipped, inTransit, delivered };
  };

  // Get customer stats
  const getCustomerStats = () => {
    const customerMap = new Map<string, { count: number; totalQty: number }>();
    records.forEach(r => {
      const existing = customerMap.get(r.customer) || { count: 0, totalQty: 0 };
      customerMap.set(r.customer, {
        count: existing.count + 1,
        totalQty: existing.totalQty + r.quantity,
      });
    });
    return Array.from(customerMap.entries()).map(([customer, stats]) => ({
      customer,
      ...stats,
    }));
  };

  // Get product stats
  const getProductStats = () => {
    const productMap = new Map<string, { productName: string; count: number; totalQty: number }>();
    records.forEach(r => {
      const existing = productMap.get(r.productCode) || { productName: r.productName, count: 0, totalQty: 0 };
      productMap.set(r.productCode, {
        productName: r.productName,
        count: existing.count + 1,
        totalQty: existing.totalQty + r.quantity,
      });
    });
    return Array.from(productMap.entries()).map(([productCode, stats]) => ({
      productCode,
      ...stats,
    }));
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "긴급":
        return "destructive";
      case "보류":
        return "warning";
      default:
        return "outline";
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "대기":
        return "warning";
      case "출하완료":
        return "default";
      case "배송중":
        return "secondary";
      case "배송완료":
        return "success";
      default:
        return "outline";
    }
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">출하관리</h1>
          <p className="text-muted-foreground">제품 출하 등록 및 현황 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">출하 등록</TabsTrigger>
          <TabsTrigger value="pending">출하 대기 목록</TabsTrigger>
          <TabsTrigger value="status">출하 현황</TabsTrigger>
          <TabsTrigger value="history">출하 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Shipment Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                출하 등록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>출하번호</Label>
                      <Input value={formData.shipmentNo} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>출하일 *</Label>
                      <Input
                        type="date"
                        value={formData.shipmentDate}
                        onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>출하 담당자 *</Label>
                      <Input
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        placeholder="담당자명 입력"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Customer Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">고객 정보</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>고객사 *</Label>
                      <Select
                        value={formData.customer}
                        onValueChange={(v) => setFormData({ ...formData, customer: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="고객사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="현대자동차">현대자동차</SelectItem>
                          <SelectItem value="기아자동차">기아자동차</SelectItem>
                          <SelectItem value="GM코리아">GM코리아</SelectItem>
                          <SelectItem value="르노코리아">르노코리아</SelectItem>
                          <SelectItem value="쌍용자동차">쌍용자동차</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>납품처</Label>
                      <Input
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                        placeholder="납품처 주소 또는 명칭"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">제품 정보</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>품번 *</Label>
                      <Input
                        value={formData.productCode}
                        onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                        placeholder="PRD-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품명</Label>
                      <Input
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        placeholder="제품명 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lot번호</Label>
                      <Input
                        value={formData.lotNo}
                        onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                        placeholder="LOT-2026-0001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>출하수량 *</Label>
                      <Input
                        type="number"
                        value={formData.quantity || ""}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        placeholder="수량 입력"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Transport Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">운송 정보</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>운송업체</Label>
                      <Select
                        value={formData.carrier}
                        onValueChange={(v) => setFormData({ ...formData, carrier: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="운송업체 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CJ대한통운">CJ대한통운</SelectItem>
                          <SelectItem value="한진택배">한진택배</SelectItem>
                          <SelectItem value="롯데택배">롯데택배</SelectItem>
                          <SelectItem value="우체국택배">우체국택배</SelectItem>
                          <SelectItem value="자가배송">자가배송</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>차량번호</Label>
                      <Input
                        value={formData.vehicleNo}
                        onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                        placeholder="12가 3456"
                      />
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="추가 메모 사항을 입력하세요"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setFormData({
                    shipmentNo: generateShipmentNo(),
                    shipmentDate: new Date().toISOString().split("T")[0],
                    customer: "",
                    deliveryLocation: "",
                    productCode: "",
                    productName: "",
                    lotNo: "",
                    quantity: 0,
                    carrier: "",
                    vehicleNo: "",
                    manager: "",
                    remarks: "",
                  })}>
                    초기화
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    출하 등록
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Pending Shipment List */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                출하 대기 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  검사 완료 후 출하 대기 중인 품목 목록입니다.
                </p>

                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="품번, 품명, 고객사로 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredPendingItems.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">출하 대기 품목이 없습니다.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>품번</TableHead>
                          <TableHead>품명</TableHead>
                          <TableHead>Lot번호</TableHead>
                          <TableHead>검사완료일</TableHead>
                          <TableHead>출하가능수량</TableHead>
                          <TableHead>납기일</TableHead>
                          <TableHead>고객사</TableHead>
                          <TableHead>우선순위</TableHead>
                          <TableHead>액션</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPendingItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.productCode}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell className="font-mono text-sm">{item.lotNo}</TableCell>
                            <TableCell>{item.inspectionDate}</TableCell>
                            <TableCell className="text-right">{item.availableQty.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={new Date(item.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 3)) ? "text-red-600 font-medium" : ""}>
                                {item.dueDate}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.customer}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPriorityVariant(item.priority)}>
                                {item.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleShipFromPending(item)}
                              >
                                출하등록
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Shipment Status */}
        <TabsContent value="status">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">총 출하건수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">대기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">출하완료</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.shipped}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">배송중</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.inTransit}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">배송완료</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                </CardContent>
              </Card>
            </div>

            {/* Period Filter */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    일별/월별 출하 현황
                  </CardTitle>
                  <Select value={periodFilter} onValueChange={setPeriodFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">일별</SelectItem>
                      <SelectItem value="monthly">월별</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">출하 데이터가 없습니다.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      <span>{periodFilter === "daily" ? "일별" : "월별"} 출하 통계</span>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{periodFilter === "daily" ? "출하일" : "월"}</TableHead>
                          <TableHead>출하건수</TableHead>
                          <TableHead>총수량</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periodFilter === "daily" ? (
                          // Group by date
                          Array.from(
                            records.reduce((acc, r) => {
                              const date = r.shipmentDate;
                              const existing = acc.get(date) || { count: 0, qty: 0 };
                              acc.set(date, { count: existing.count + 1, qty: existing.qty + r.quantity });
                              return acc;
                            }, new Map<string, { count: number; qty: number }>())
                          ).map(([date, data]) => (
                            <TableRow key={date}>
                              <TableCell>{date}</TableCell>
                              <TableCell>{data.count}</TableCell>
                              <TableCell>{data.qty.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          // Group by month
                          Array.from(
                            records.reduce((acc, r) => {
                              const month = r.shipmentDate.substring(0, 7);
                              const existing = acc.get(month) || { count: 0, qty: 0 };
                              acc.set(month, { count: existing.count + 1, qty: existing.qty + r.quantity });
                              return acc;
                            }, new Map<string, { count: number; qty: number }>())
                          ).map(([month, data]) => (
                            <TableRow key={month}>
                              <TableCell>{month}</TableCell>
                              <TableCell>{data.count}</TableCell>
                              <TableCell>{data.qty.toLocaleString()}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Stats */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    고객별 출하 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getCustomerStats().length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center">데이터가 없습니다.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>고객사</TableHead>
                          <TableHead>출하건수</TableHead>
                          <TableHead>총수량</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCustomerStats().map((stat) => (
                          <TableRow key={stat.customer}>
                            <TableCell>
                              <Badge variant="outline">{stat.customer}</Badge>
                            </TableCell>
                            <TableCell>{stat.count}</TableCell>
                            <TableCell>{stat.totalQty.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    품목별 출하 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getProductStats().length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center">데이터가 없습니다.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>품번</TableHead>
                          <TableHead>품명</TableHead>
                          <TableHead>출하건수</TableHead>
                          <TableHead>총수량</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getProductStats().map((stat) => (
                          <TableRow key={stat.productCode}>
                            <TableCell className="font-mono">{stat.productCode}</TableCell>
                            <TableCell>{stat.productName}</TableCell>
                            <TableCell>{stat.count}</TableCell>
                            <TableCell>{stat.totalQty.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Shipment History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                출하 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="출하번호, 품명, 고객사로 검색..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="상태 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="대기">대기</SelectItem>
                      <SelectItem value="출하완료">출하완료</SelectItem>
                      <SelectItem value="배송중">배송중</SelectItem>
                      <SelectItem value="배송완료">배송완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredHistoryRecords.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">출하 이력이 없습니다.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>출하번호</TableHead>
                          <TableHead>출하일</TableHead>
                          <TableHead>고객사</TableHead>
                          <TableHead>납품처</TableHead>
                          <TableHead>품번</TableHead>
                          <TableHead>품명</TableHead>
                          <TableHead>Lot번호</TableHead>
                          <TableHead>수량</TableHead>
                          <TableHead>운송업체</TableHead>
                          <TableHead>차량번호</TableHead>
                          <TableHead>담당자</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>액션</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistoryRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.shipmentNo}</TableCell>
                            <TableCell>{record.shipmentDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.customer}</Badge>
                            </TableCell>
                            <TableCell>{record.deliveryLocation || "-"}</TableCell>
                            <TableCell className="font-mono">{record.productCode}</TableCell>
                            <TableCell>{record.productName || "-"}</TableCell>
                            <TableCell className="font-mono text-sm">{record.lotNo || "-"}</TableCell>
                            <TableCell className="text-right">{record.quantity.toLocaleString()}</TableCell>
                            <TableCell>{record.carrier || "-"}</TableCell>
                            <TableCell>{record.vehicleNo || "-"}</TableCell>
                            <TableCell>{record.manager}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(record.status)}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={record.status}
                                onValueChange={(v) => updateStatus(record.id, v as ShipmentRecord["status"])}
                              >
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="대기">대기</SelectItem>
                                  <SelectItem value="출하완료">출하완료</SelectItem>
                                  <SelectItem value="배송중">배송중</SelectItem>
                                  <SelectItem value="배송완료">배송완료</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
