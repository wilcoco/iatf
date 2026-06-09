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
import { Package, Plus, Save, ClipboardList, History, ShoppingCart, AlertTriangle, Search } from "lucide-react";

// Types
interface SparePart {
  id: number;
  partCode: string;
  partName: string;
  specification: string;
  unit: string;
  targetEquipment: string;
  safetyStock: number;
  reorderPoint: number;
  supplier: string;
  leadTime: number;
  currentStock: number;
}

interface StockHistory {
  id: number;
  partId: number;
  date: string;
  type: "in" | "out";
  quantity: number;
  relatedEquipment?: string;
  remarks: string;
}

interface UsageHistory {
  id: number;
  partId: number;
  useDate: string;
  equipment: string;
  quantity: number;
  reason: string;
  worker: string;
}

interface PurchaseOrder {
  id: number;
  partId: number;
  orderDate: string;
  quantity: number;
  expectedDate: string;
  status: "pending" | "ordered" | "received" | "cancelled";
  supplier: string;
  remarks: string;
}

// Sample data
const initialSpareParts: SparePart[] = [
  { id: 1, partCode: "SP-001", partName: "베어링 6205", specification: "25x52x15mm", unit: "EA", targetEquipment: "CNC 선반 #1", safetyStock: 5, reorderPoint: 3, supplier: "한국베어링", leadTime: 7, currentStock: 8 },
  { id: 2, partCode: "SP-002", partName: "오일필터", specification: "HF-250", unit: "EA", targetEquipment: "밀링머신 #2", safetyStock: 10, reorderPoint: 5, supplier: "필터코리아", leadTime: 3, currentStock: 4 },
  { id: 3, partCode: "SP-003", partName: "V벨트", specification: "A-68", unit: "EA", targetEquipment: "프레스 #1", safetyStock: 3, reorderPoint: 2, supplier: "동아벨트", leadTime: 5, currentStock: 2 },
  { id: 4, partCode: "SP-004", partName: "유압호스", specification: "1/2\" x 1m", unit: "M", targetEquipment: "유압프레스", safetyStock: 20, reorderPoint: 10, supplier: "유압부품상사", leadTime: 4, currentStock: 25 },
  { id: 5, partCode: "SP-005", partName: "서보모터", specification: "400W AC", unit: "EA", targetEquipment: "CNC 선반 #1", safetyStock: 1, reorderPoint: 1, supplier: "서보텍", leadTime: 14, currentStock: 1 },
];

const initialStockHistory: StockHistory[] = [
  { id: 1, partId: 1, date: "2026-06-08", type: "in", quantity: 5, remarks: "정기 입고" },
  { id: 2, partId: 1, date: "2026-06-05", type: "out", quantity: 2, relatedEquipment: "CNC 선반 #1", remarks: "정기 교체" },
  { id: 3, partId: 2, date: "2026-06-07", type: "out", quantity: 1, relatedEquipment: "밀링머신 #2", remarks: "필터 교체" },
  { id: 4, partId: 3, date: "2026-06-01", type: "in", quantity: 3, remarks: "긴급 발주 입고" },
  { id: 5, partId: 4, date: "2026-05-28", type: "in", quantity: 10, remarks: "정기 입고" },
];

const initialUsageHistory: UsageHistory[] = [
  { id: 1, partId: 1, useDate: "2026-06-05", equipment: "CNC 선반 #1", quantity: 2, reason: "정기 교체 (마모)", worker: "김철수" },
  { id: 2, partId: 2, useDate: "2026-06-07", equipment: "밀링머신 #2", quantity: 1, reason: "오염으로 인한 교체", worker: "이영희" },
  { id: 3, partId: 3, useDate: "2026-05-20", equipment: "프레스 #1", quantity: 1, reason: "파손 교체", worker: "박민수" },
  { id: 4, partId: 4, useDate: "2026-05-15", equipment: "유압프레스", quantity: 2, reason: "누유 발생으로 교체", worker: "최지은" },
];

const initialPurchaseOrders: PurchaseOrder[] = [
  { id: 1, partId: 2, orderDate: "2026-06-08", quantity: 10, expectedDate: "2026-06-11", status: "ordered", supplier: "필터코리아", remarks: "재고 부족으로 긴급 발주" },
  { id: 2, partId: 3, orderDate: "2026-06-07", quantity: 5, expectedDate: "2026-06-12", status: "ordered", supplier: "동아벨트", remarks: "" },
  { id: 3, partId: 5, orderDate: "2026-05-25", quantity: 1, expectedDate: "2026-06-08", status: "received", supplier: "서보텍", remarks: "예비용 확보" },
];

const EQUIPMENTS = ["CNC 선반 #1", "밀링머신 #2", "프레스 #1", "유압프레스", "용접기 #1"];

export default function SparePartsPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [spareParts, setSpareParts] = useState<SparePart[]>(initialSpareParts);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>(initialStockHistory);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>(initialUsageHistory);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);

  // Form states
  const [showPartForm, setShowPartForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newPart, setNewPart] = useState({
    partCode: "",
    partName: "",
    specification: "",
    unit: "EA",
    targetEquipment: "",
    safetyStock: 0,
    reorderPoint: 0,
    supplier: "",
    leadTime: 7,
    currentStock: 0,
  });

  const [newStock, setNewStock] = useState({
    partId: 0,
    type: "in" as "in" | "out",
    quantity: 0,
    relatedEquipment: "",
    remarks: "",
  });

  const [newUsage, setNewUsage] = useState({
    partId: 0,
    useDate: new Date().toISOString().split("T")[0],
    equipment: "",
    quantity: 0,
    reason: "",
    worker: "",
  });

  const [newOrder, setNewOrder] = useState({
    partId: 0,
    quantity: 0,
    expectedDate: "",
    supplier: "",
    remarks: "",
  });

  // Get parts that need reordering
  const getPartsNeedingReorder = () => {
    return spareParts.filter(p => p.currentStock <= p.reorderPoint);
  };

  // Tab 1: Spare Parts Registration
  const RegistrationTab = () => {
    const handleAddPart = () => {
      if (!newPart.partCode || !newPart.partName) {
        alert("필수 항목을 입력해주세요.");
        return;
      }
      const newSparePart: SparePart = {
        id: Date.now(),
        ...newPart,
      };
      setSpareParts([...spareParts, newSparePart]);
      setNewPart({
        partCode: "",
        partName: "",
        specification: "",
        unit: "EA",
        targetEquipment: "",
        safetyStock: 0,
        reorderPoint: 0,
        supplier: "",
        leadTime: 7,
        currentStock: 0,
      });
      setShowPartForm(false);
      alert("예비품이 등록되었습니다.");
    };

    const handleDeletePart = (id: number) => {
      if (confirm("이 예비품을 삭제하시겠습니까?")) {
        setSpareParts(spareParts.filter(p => p.id !== id));
      }
    };

    const filteredParts = spareParts.filter(p =>
      p.partCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.targetEquipment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            예비품 등록
          </CardTitle>
          <Button onClick={() => setShowPartForm(!showPartForm)}>
            <Plus className="mr-2 h-4 w-4" />
            예비품 등록
          </Button>
        </CardHeader>
        <CardContent>
          {showPartForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">예비품 등록</h4>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>예비품코드 *</Label>
                  <Input
                    value={newPart.partCode}
                    onChange={(e) => setNewPart({ ...newPart, partCode: e.target.value })}
                    placeholder="SP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>예비품명 *</Label>
                  <Input
                    value={newPart.partName}
                    onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
                    placeholder="베어링 6205"
                  />
                </div>
                <div className="space-y-2">
                  <Label>규격</Label>
                  <Input
                    value={newPart.specification}
                    onChange={(e) => setNewPart({ ...newPart, specification: e.target.value })}
                    placeholder="25x52x15mm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>단위</Label>
                  <Select value={newPart.unit} onValueChange={(v) => setNewPart({ ...newPart, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EA">EA</SelectItem>
                      <SelectItem value="SET">SET</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="BOX">BOX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4 mt-4">
                <div className="space-y-2">
                  <Label>대상설비</Label>
                  <Select value={newPart.targetEquipment} onValueChange={(v) => setNewPart({ ...newPart, targetEquipment: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {EQUIPMENTS.map((eq) => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>안전재고</Label>
                  <Input
                    type="number"
                    value={newPart.safetyStock}
                    onChange={(e) => setNewPart({ ...newPart, safetyStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>발주점</Label>
                  <Input
                    type="number"
                    value={newPart.reorderPoint}
                    onChange={(e) => setNewPart({ ...newPart, reorderPoint: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>현재고</Label>
                  <Input
                    type="number"
                    value={newPart.currentStock}
                    onChange={(e) => setNewPart({ ...newPart, currentStock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <Label>공급업체</Label>
                  <Input
                    value={newPart.supplier}
                    onChange={(e) => setNewPart({ ...newPart, supplier: e.target.value })}
                    placeholder="공급업체명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>리드타임 (일)</Label>
                  <Input
                    type="number"
                    value={newPart.leadTime}
                    onChange={(e) => setNewPart({ ...newPart, leadTime: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPartForm(false)}>취소</Button>
                <Button onClick={handleAddPart}><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </div>
          )}

          <div className="mb-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="예비품코드, 예비품명, 대상설비로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>예비품코드</TableHead>
                <TableHead>예비품명</TableHead>
                <TableHead>규격</TableHead>
                <TableHead>단위</TableHead>
                <TableHead>대상설비</TableHead>
                <TableHead className="text-center">안전재고</TableHead>
                <TableHead className="text-center">발주점</TableHead>
                <TableHead className="text-center">현재고</TableHead>
                <TableHead>공급업체</TableHead>
                <TableHead className="text-center">리드타임</TableHead>
                <TableHead className="text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    등록된 예비품이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-mono">{part.partCode}</TableCell>
                    <TableCell className="font-medium">{part.partName}</TableCell>
                    <TableCell>{part.specification}</TableCell>
                    <TableCell>{part.unit}</TableCell>
                    <TableCell>{part.targetEquipment}</TableCell>
                    <TableCell className="text-center">{part.safetyStock}</TableCell>
                    <TableCell className="text-center">{part.reorderPoint}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={part.currentStock <= part.reorderPoint ? "destructive" : part.currentStock <= part.safetyStock ? "warning" : "success"}>
                        {part.currentStock}
                      </Badge>
                    </TableCell>
                    <TableCell>{part.supplier}</TableCell>
                    <TableCell className="text-center">{part.leadTime}일</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePart(part.id)}>
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  // Tab 2: Inventory Status
  const InventoryTab = () => {
    const handleAddStock = () => {
      if (!newStock.partId || !newStock.quantity) {
        alert("필수 항목을 입력해주세요.");
        return;
      }

      const stockEntry: StockHistory = {
        id: Date.now(),
        partId: newStock.partId,
        date: new Date().toISOString().split("T")[0],
        type: newStock.type,
        quantity: newStock.quantity,
        relatedEquipment: newStock.relatedEquipment,
        remarks: newStock.remarks,
      };
      setStockHistory([stockEntry, ...stockHistory]);

      // Update current stock
      setSpareParts(spareParts.map(p => {
        if (p.id === newStock.partId) {
          return {
            ...p,
            currentStock: newStock.type === "in"
              ? p.currentStock + newStock.quantity
              : p.currentStock - newStock.quantity
          };
        }
        return p;
      }));

      setNewStock({
        partId: 0,
        type: "in",
        quantity: 0,
        relatedEquipment: "",
        remarks: "",
      });
      setShowStockForm(false);
      alert("입출고가 등록되었습니다.");
    };

    const lowStockParts = getPartsNeedingReorder();

    return (
      <div className="space-y-6">
        {/* Low Stock Alert */}
        {lowStockParts.length > 0 && (
          <Card className="border-orange-300 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                재고 부족 알림
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {lowStockParts.map(part => (
                  <div key={part.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                    <div>
                      <p className="font-medium">{part.partName}</p>
                      <p className="text-sm text-muted-foreground">{part.partCode}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{part.currentStock} / {part.reorderPoint}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">발주 필요</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              현재고 현황
            </CardTitle>
            <Button onClick={() => setShowStockForm(!showStockForm)}>
              <Plus className="mr-2 h-4 w-4" />
              입출고 등록
            </Button>
          </CardHeader>
          <CardContent>
            {showStockForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-4">입출고 등록</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>예비품 *</Label>
                    <Select value={newStock.partId.toString()} onValueChange={(v) => setNewStock({ ...newStock, partId: parseInt(v) })}>
                      <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                        {spareParts.map((part) => (
                          <SelectItem key={part.id} value={part.id.toString()}>{part.partName} ({part.partCode})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>구분 *</Label>
                    <Select value={newStock.type} onValueChange={(v) => setNewStock({ ...newStock, type: v as "in" | "out" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">입고</SelectItem>
                        <SelectItem value="out">출고</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>수량 *</Label>
                    <Input
                      type="number"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>관련 설비</Label>
                    <Select value={newStock.relatedEquipment} onValueChange={(v) => setNewStock({ ...newStock, relatedEquipment: v })}>
                      <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                        {EQUIPMENTS.map((eq) => (
                          <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Input
                      value={newStock.remarks}
                      onChange={(e) => setNewStock({ ...newStock, remarks: e.target.value })}
                      placeholder="비고"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowStockForm(false)}>취소</Button>
                  <Button onClick={handleAddStock}><Save className="mr-2 h-4 w-4" />저장</Button>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-5 mb-6">
              {spareParts.slice(0, 5).map(part => (
                <Card key={part.id} className="p-4">
                  <div className="text-sm text-muted-foreground">{part.partCode}</div>
                  <div className="font-medium">{part.partName}</div>
                  <div className="text-2xl font-bold mt-2">
                    <Badge variant={part.currentStock <= part.reorderPoint ? "destructive" : part.currentStock <= part.safetyStock ? "warning" : "success"} className="text-lg px-3 py-1">
                      {part.currentStock} {part.unit}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    안전재고: {part.safetyStock} / 발주점: {part.reorderPoint}
                  </div>
                </Card>
              ))}
            </div>

            <h4 className="font-medium mb-4">입출고 이력</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>일자</TableHead>
                  <TableHead>예비품</TableHead>
                  <TableHead className="text-center">구분</TableHead>
                  <TableHead className="text-center">수량</TableHead>
                  <TableHead>관련 설비</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      입출고 이력이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  stockHistory.map((history) => {
                    const part = spareParts.find(p => p.id === history.partId);
                    return (
                      <TableRow key={history.id}>
                        <TableCell>{history.date}</TableCell>
                        <TableCell className="font-medium">{part?.partName || "-"}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={history.type === "in" ? "success" : "secondary"}>
                            {history.type === "in" ? "입고" : "출고"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{history.quantity}</TableCell>
                        <TableCell>{history.relatedEquipment || "-"}</TableCell>
                        <TableCell>{history.remarks}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tab 3: Usage History
  const UsageTab = () => {
    const handleAddUsage = () => {
      if (!newUsage.partId || !newUsage.equipment || !newUsage.quantity) {
        alert("필수 항목을 입력해주세요.");
        return;
      }

      const usageEntry: UsageHistory = {
        id: Date.now(),
        ...newUsage,
      };
      setUsageHistory([usageEntry, ...usageHistory]);

      // Update stock and stock history
      setSpareParts(spareParts.map(p => {
        if (p.id === newUsage.partId) {
          return { ...p, currentStock: p.currentStock - newUsage.quantity };
        }
        return p;
      }));

      const stockEntry: StockHistory = {
        id: Date.now() + 1,
        partId: newUsage.partId,
        date: newUsage.useDate,
        type: "out",
        quantity: newUsage.quantity,
        relatedEquipment: newUsage.equipment,
        remarks: `사용: ${newUsage.reason}`,
      };
      setStockHistory([stockEntry, ...stockHistory]);

      setNewUsage({
        partId: 0,
        useDate: new Date().toISOString().split("T")[0],
        equipment: "",
        quantity: 0,
        reason: "",
        worker: "",
      });
      setShowUsageForm(false);
      alert("사용 이력이 등록되었습니다.");
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            사용 이력
          </CardTitle>
          <Button onClick={() => setShowUsageForm(!showUsageForm)}>
            <Plus className="mr-2 h-4 w-4" />
            사용 등록
          </Button>
        </CardHeader>
        <CardContent>
          {showUsageForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">사용 이력 등록</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>사용일 *</Label>
                  <Input
                    type="date"
                    value={newUsage.useDate}
                    onChange={(e) => setNewUsage({ ...newUsage, useDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>예비품 *</Label>
                  <Select value={newUsage.partId.toString()} onValueChange={(v) => setNewUsage({ ...newUsage, partId: parseInt(v) })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {spareParts.map((part) => (
                        <SelectItem key={part.id} value={part.id.toString()}>{part.partName} ({part.partCode})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>사용설비 *</Label>
                  <Select value={newUsage.equipment} onValueChange={(v) => setNewUsage({ ...newUsage, equipment: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      {EQUIPMENTS.map((eq) => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>사용수량 *</Label>
                  <Input
                    type="number"
                    value={newUsage.quantity}
                    onChange={(e) => setNewUsage({ ...newUsage, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>교체 사유</Label>
                  <Input
                    value={newUsage.reason}
                    onChange={(e) => setNewUsage({ ...newUsage, reason: e.target.value })}
                    placeholder="마모, 파손, 정기교체 등"
                  />
                </div>
                <div className="space-y-2">
                  <Label>작업자</Label>
                  <Input
                    value={newUsage.worker}
                    onChange={(e) => setNewUsage({ ...newUsage, worker: e.target.value })}
                    placeholder="작업자명"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowUsageForm(false)}>취소</Button>
                <Button onClick={handleAddUsage}><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용일</TableHead>
                <TableHead>예비품</TableHead>
                <TableHead>사용설비</TableHead>
                <TableHead className="text-center">사용수량</TableHead>
                <TableHead>교체 사유</TableHead>
                <TableHead>작업자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    사용 이력이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                usageHistory.map((usage) => {
                  const part = spareParts.find(p => p.id === usage.partId);
                  return (
                    <TableRow key={usage.id}>
                      <TableCell>{usage.useDate}</TableCell>
                      <TableCell className="font-medium">{part?.partName || "-"}</TableCell>
                      <TableCell>{usage.equipment}</TableCell>
                      <TableCell className="text-center">{usage.quantity}</TableCell>
                      <TableCell>{usage.reason || "-"}</TableCell>
                      <TableCell>{usage.worker || "-"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  // Tab 4: Order Management
  const OrderTab = () => {
    const handleAddOrder = () => {
      if (!newOrder.partId || !newOrder.quantity) {
        alert("필수 항목을 입력해주세요.");
        return;
      }

      const part = spareParts.find(p => p.id === newOrder.partId);
      const order: PurchaseOrder = {
        id: Date.now(),
        partId: newOrder.partId,
        orderDate: new Date().toISOString().split("T")[0],
        quantity: newOrder.quantity,
        expectedDate: newOrder.expectedDate,
        status: "ordered",
        supplier: newOrder.supplier || part?.supplier || "",
        remarks: newOrder.remarks,
      };
      setPurchaseOrders([order, ...purchaseOrders]);
      setNewOrder({
        partId: 0,
        quantity: 0,
        expectedDate: "",
        supplier: "",
        remarks: "",
      });
      setShowOrderForm(false);
      alert("발주가 등록되었습니다.");
    };

    const handleStatusChange = (orderId: number, status: PurchaseOrder["status"]) => {
      setPurchaseOrders(purchaseOrders.map(o => {
        if (o.id === orderId) {
          // If status changes to received, update stock
          if (status === "received" && o.status !== "received") {
            setSpareParts(spareParts.map(p => {
              if (p.id === o.partId) {
                return { ...p, currentStock: p.currentStock + o.quantity };
              }
              return p;
            }));
            const stockEntry: StockHistory = {
              id: Date.now(),
              partId: o.partId,
              date: new Date().toISOString().split("T")[0],
              type: "in",
              quantity: o.quantity,
              remarks: `발주 입고 (PO-${o.id})`,
            };
            setStockHistory(prev => [stockEntry, ...prev]);
          }
          return { ...o, status };
        }
        return o;
      }));
    };

    const partsNeedingOrder = getPartsNeedingReorder();
    const pendingOrders = purchaseOrders.filter(o => o.status === "pending" || o.status === "ordered");

    return (
      <div className="space-y-6">
        {/* Parts Needing Order */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              발주 필요 품목
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partsNeedingOrder.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">발주가 필요한 품목이 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>예비품코드</TableHead>
                    <TableHead>예비품명</TableHead>
                    <TableHead className="text-center">현재고</TableHead>
                    <TableHead className="text-center">발주점</TableHead>
                    <TableHead className="text-center">안전재고</TableHead>
                    <TableHead>공급업체</TableHead>
                    <TableHead className="text-center">리드타임</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partsNeedingOrder.map((part) => (
                    <TableRow key={part.id} className="bg-orange-50">
                      <TableCell className="font-mono">{part.partCode}</TableCell>
                      <TableCell className="font-medium">{part.partName}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive">{part.currentStock}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{part.reorderPoint}</TableCell>
                      <TableCell className="text-center">{part.safetyStock}</TableCell>
                      <TableCell>{part.supplier}</TableCell>
                      <TableCell className="text-center">{part.leadTime}일</TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" onClick={() => {
                          setNewOrder({
                            partId: part.id,
                            quantity: part.safetyStock - part.currentStock + 5,
                            expectedDate: "",
                            supplier: part.supplier,
                            remarks: "재고 부족으로 인한 발주",
                          });
                          setShowOrderForm(true);
                        }}>
                          발주
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Order Form and History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              발주 이력
            </CardTitle>
            <Button onClick={() => setShowOrderForm(!showOrderForm)}>
              <Plus className="mr-2 h-4 w-4" />
              발주 등록
            </Button>
          </CardHeader>
          <CardContent>
            {showOrderForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-4">발주 등록</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>예비품 *</Label>
                    <Select value={newOrder.partId.toString()} onValueChange={(v) => {
                      const part = spareParts.find(p => p.id === parseInt(v));
                      setNewOrder({ ...newOrder, partId: parseInt(v), supplier: part?.supplier || "" });
                    }}>
                      <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                        {spareParts.map((part) => (
                          <SelectItem key={part.id} value={part.id.toString()}>{part.partName} ({part.partCode})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>발주수량 *</Label>
                    <Input
                      type="number"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>납기예정일</Label>
                    <Input
                      type="date"
                      value={newOrder.expectedDate}
                      onChange={(e) => setNewOrder({ ...newOrder, expectedDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공급업체</Label>
                    <Input
                      value={newOrder.supplier}
                      onChange={(e) => setNewOrder({ ...newOrder, supplier: e.target.value })}
                      placeholder="공급업체명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Input
                      value={newOrder.remarks}
                      onChange={(e) => setNewOrder({ ...newOrder, remarks: e.target.value })}
                      placeholder="비고"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowOrderForm(false)}>취소</Button>
                  <Button onClick={handleAddOrder}><Save className="mr-2 h-4 w-4" />저장</Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>발주일</TableHead>
                  <TableHead>예비품</TableHead>
                  <TableHead className="text-center">발주수량</TableHead>
                  <TableHead>납기예정일</TableHead>
                  <TableHead>공급업체</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                  <TableHead>비고</TableHead>
                  <TableHead className="text-center">상태변경</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      발주 이력이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  purchaseOrders.map((order) => {
                    const part = spareParts.find(p => p.id === order.partId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell className="font-medium">{part?.partName || "-"}</TableCell>
                        <TableCell className="text-center">{order.quantity}</TableCell>
                        <TableCell>{order.expectedDate || "-"}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={
                            order.status === "received" ? "success" :
                            order.status === "ordered" ? "secondary" :
                            order.status === "cancelled" ? "destructive" : "outline"
                          }>
                            {order.status === "pending" ? "대기" :
                             order.status === "ordered" ? "발주완료" :
                             order.status === "received" ? "입고완료" : "취소"}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.remarks || "-"}</TableCell>
                        <TableCell className="text-center">
                          {order.status !== "received" && order.status !== "cancelled" && (
                            <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v as PurchaseOrder["status"])}>
                              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">대기</SelectItem>
                                <SelectItem value="ordered">발주완료</SelectItem>
                                <SelectItem value="received">입고완료</SelectItem>
                                <SelectItem value="cancelled">취소</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">예비품 관리</h1>
          <p className="text-muted-foreground">설비 예비품 등록 및 재고 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <Package className="mr-2 h-4 w-4" />
            예비품 등록
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <ClipboardList className="mr-2 h-4 w-4" />
            재고 현황
          </TabsTrigger>
          <TabsTrigger value="usage">
            <History className="mr-2 h-4 w-4" />
            사용 이력
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-2 h-4 w-4" />
            발주 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <RegistrationTab />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>

        <TabsContent value="usage">
          <UsageTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrderTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
