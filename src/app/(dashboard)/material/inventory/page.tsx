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
import {
  Package,
  Plus,
  Save,
  Search,
  AlertTriangle,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw,
  Trash2,
  Edit
} from "lucide-react";

// Interfaces
interface Material {
  id: number;
  materialCode: string;
  materialName: string;
  specification: string;
  unit: string;
  currentStock: number;
  safetyStock: number;
  optimalStock: number;
  reorderPoint: number;
}

interface TransactionHistory {
  id: number;
  materialId: number;
  date: string;
  type: "입고" | "출고";
  quantity: number;
  lotNumber: string;
  supplierOrDestination: string;
  remainingStock: number;
}

interface TurnoverData {
  materialId: number;
  periodUsage: { month: string; usage: number }[];
  turnoverRate: number;
}

// Sample data
const initialMaterials: Material[] = [
  {
    id: 1,
    materialCode: "MAT-001",
    materialName: "철강 코일",
    specification: "1.2mm x 1200mm",
    unit: "kg",
    currentStock: 5000,
    safetyStock: 2000,
    optimalStock: 8000,
    reorderPoint: 3000,
  },
  {
    id: 2,
    materialCode: "MAT-002",
    materialName: "알루미늄 판재",
    specification: "2.0mm x 1000mm",
    unit: "장",
    currentStock: 150,
    safetyStock: 200,
    optimalStock: 500,
    reorderPoint: 250,
  },
  {
    id: 3,
    materialCode: "MAT-003",
    materialName: "구리 파이프",
    specification: "25mm x 3m",
    unit: "개",
    currentStock: 800,
    safetyStock: 300,
    optimalStock: 1000,
    reorderPoint: 400,
  },
];

const initialTransactions: TransactionHistory[] = [
  {
    id: 1,
    materialId: 1,
    date: "2026-06-09",
    type: "입고",
    quantity: 2000,
    lotNumber: "LOT-2026-0609-001",
    supplierOrDestination: "대한철강(주)",
    remainingStock: 5000,
  },
  {
    id: 2,
    materialId: 1,
    date: "2026-06-08",
    type: "출고",
    quantity: 500,
    lotNumber: "LOT-2026-0605-001",
    supplierOrDestination: "생산라인 A",
    remainingStock: 3000,
  },
  {
    id: 3,
    materialId: 2,
    date: "2026-06-07",
    type: "입고",
    quantity: 100,
    lotNumber: "LOT-2026-0607-001",
    supplierOrDestination: "알루미늄코리아",
    remainingStock: 150,
  },
  {
    id: 4,
    materialId: 3,
    date: "2026-06-06",
    type: "출고",
    quantity: 200,
    lotNumber: "LOT-2026-0601-001",
    supplierOrDestination: "조립라인 B",
    remainingStock: 800,
  },
];

const initialTurnoverData: TurnoverData[] = [
  {
    materialId: 1,
    periodUsage: [
      { month: "2026-01", usage: 3000 },
      { month: "2026-02", usage: 2800 },
      { month: "2026-03", usage: 3200 },
      { month: "2026-04", usage: 2900 },
      { month: "2026-05", usage: 3100 },
      { month: "2026-06", usage: 1500 },
    ],
    turnoverRate: 3.2,
  },
  {
    materialId: 2,
    periodUsage: [
      { month: "2026-01", usage: 80 },
      { month: "2026-02", usage: 90 },
      { month: "2026-03", usage: 75 },
      { month: "2026-04", usage: 85 },
      { month: "2026-05", usage: 95 },
      { month: "2026-06", usage: 50 },
    ],
    turnoverRate: 2.8,
  },
  {
    materialId: 3,
    periodUsage: [
      { month: "2026-01", usage: 150 },
      { month: "2026-02", usage: 180 },
      { month: "2026-03", usage: 160 },
      { month: "2026-04", usage: 170 },
      { month: "2026-05", usage: 200 },
      { month: "2026-06", usage: 100 },
    ],
    turnoverRate: 1.5,
  },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [transactions, setTransactions] = useState<TransactionHistory[]>(initialTransactions);
  const [turnoverData] = useState<TurnoverData[]>(initialTurnoverData);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Form states
  const [materialForm, setMaterialForm] = useState({
    materialCode: "",
    materialName: "",
    specification: "",
    unit: "",
    currentStock: "",
    safetyStock: "",
    optimalStock: "",
    reorderPoint: "",
  });

  const [transactionForm, setTransactionForm] = useState({
    materialId: "",
    date: new Date().toISOString().split("T")[0],
    type: "" as "입고" | "출고" | "",
    quantity: "",
    lotNumber: "",
    supplierOrDestination: "",
  });

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId);
  const filteredMaterials = materials.filter(
    (m) =>
      m.materialCode.toLowerCase().includes(search.toLowerCase()) ||
      m.materialName.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (material: Material) => {
    if (material.currentStock <= material.reorderPoint) {
      return { status: "발주필요", variant: "destructive" as const };
    }
    if (material.currentStock < material.safetyStock) {
      return { status: "부족", variant: "warning" as const };
    }
    if (material.currentStock > material.optimalStock * 1.2) {
      return { status: "과다", variant: "secondary" as const };
    }
    return { status: "정상", variant: "success" as const };
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaterial: Material = {
      id: Date.now(),
      materialCode: materialForm.materialCode,
      materialName: materialForm.materialName,
      specification: materialForm.specification,
      unit: materialForm.unit,
      currentStock: Number(materialForm.currentStock),
      safetyStock: Number(materialForm.safetyStock),
      optimalStock: Number(materialForm.optimalStock),
      reorderPoint: Number(materialForm.reorderPoint),
    };
    setMaterials([newMaterial, ...materials]);
    setShowMaterialForm(false);
    setMaterialForm({
      materialCode: "",
      materialName: "",
      specification: "",
      unit: "",
      currentStock: "",
      safetyStock: "",
      optimalStock: "",
      reorderPoint: "",
    });
    alert("자재가 등록되었습니다.");
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const material = materials.find((m) => m.id === Number(transactionForm.materialId));
    if (!material) return;

    const quantityChange = transactionForm.type === "입고"
      ? Number(transactionForm.quantity)
      : -Number(transactionForm.quantity);
    const newStock = material.currentStock + quantityChange;

    const newTransaction: TransactionHistory = {
      id: Date.now(),
      materialId: Number(transactionForm.materialId),
      date: transactionForm.date,
      type: transactionForm.type as "입고" | "출고",
      quantity: Number(transactionForm.quantity),
      lotNumber: transactionForm.lotNumber,
      supplierOrDestination: transactionForm.supplierOrDestination,
      remainingStock: newStock,
    };

    setTransactions([newTransaction, ...transactions]);
    setMaterials(
      materials.map((m) =>
        m.id === Number(transactionForm.materialId) ? { ...m, currentStock: newStock } : m
      )
    );
    setShowTransactionForm(false);
    setTransactionForm({
      materialId: "",
      date: new Date().toISOString().split("T")[0],
      type: "",
      quantity: "",
      lotNumber: "",
      supplierOrDestination: "",
    });
    alert("입출고 내역이 등록되었습니다.");
  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm("정말로 이 자재를 삭제하시겠습니까?")) {
      setMaterials(materials.filter((m) => m.id !== id));
      setTransactions(transactions.filter((t) => t.materialId !== id));
      if (selectedMaterialId === id) {
        setSelectedMaterialId(materials.length > 1 ? materials[0].id : null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">자재관리</h1>
          <p className="text-muted-foreground">자재 재고 및 입출고 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">자재 기본정보</TabsTrigger>
          <TabsTrigger value="inventory-status">재고 현황</TabsTrigger>
          <TabsTrigger value="transaction-history">입출고 이력</TabsTrigger>
          <TabsTrigger value="material-list">자재 목록</TabsTrigger>
        </TabsList>

        {/* Tab 1: Material Basic Info */}
        <TabsContent value="basic-info">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">자재 기본정보</h2>
              <Button onClick={() => setShowMaterialForm(!showMaterialForm)}>
                <Plus className="mr-2 h-4 w-4" />
                자재 등록
              </Button>
            </div>

            {showMaterialForm && (
              <Card>
                <CardHeader>
                  <CardTitle>신규 자재 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMaterialSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>자재코드 *</Label>
                        <Input
                          value={materialForm.materialCode}
                          onChange={(e) => setMaterialForm({ ...materialForm, materialCode: e.target.value })}
                          placeholder="MAT-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>자재명 *</Label>
                        <Input
                          value={materialForm.materialName}
                          onChange={(e) => setMaterialForm({ ...materialForm, materialName: e.target.value })}
                          placeholder="자재명을 입력하세요"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>규격 *</Label>
                        <Input
                          value={materialForm.specification}
                          onChange={(e) => setMaterialForm({ ...materialForm, specification: e.target.value })}
                          placeholder="1.2mm x 1200mm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>단위 *</Label>
                        <Select
                          value={materialForm.unit}
                          onValueChange={(v) => setMaterialForm({ ...materialForm, unit: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="개">개</SelectItem>
                            <SelectItem value="장">장</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="EA">EA</SelectItem>
                            <SelectItem value="Set">Set</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>현재고 *</Label>
                        <Input
                          type="number"
                          value={materialForm.currentStock}
                          onChange={(e) => setMaterialForm({ ...materialForm, currentStock: e.target.value })}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>안전재고 *</Label>
                        <Input
                          type="number"
                          value={materialForm.safetyStock}
                          onChange={(e) => setMaterialForm({ ...materialForm, safetyStock: e.target.value })}
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>적정재고 *</Label>
                        <Input
                          type="number"
                          value={materialForm.optimalStock}
                          onChange={(e) => setMaterialForm({ ...materialForm, optimalStock: e.target.value })}
                          placeholder="500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>발주점 *</Label>
                        <Input
                          type="number"
                          value={materialForm.reorderPoint}
                          onChange={(e) => setMaterialForm({ ...materialForm, reorderPoint: e.target.value })}
                          placeholder="150"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowMaterialForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Material Selection & Details */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">자재 선택</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedMaterialId?.toString() || ""}
                    onValueChange={(v) => setSelectedMaterialId(Number(v))}
                  >
                    <SelectTrigger><SelectValue placeholder="자재를 선택하세요" /></SelectTrigger>
                    <SelectContent>
                      {materials.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.materialCode} - {m.materialName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {selectedMaterial && (
                <>
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        기본 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <Label className="text-muted-foreground">자재코드</Label>
                          <p className="font-mono font-medium">{selectedMaterial.materialCode}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">자재명</Label>
                          <p className="font-medium">{selectedMaterial.materialName}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">규격</Label>
                          <p className="font-medium">{selectedMaterial.specification}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">단위</Label>
                          <p className="font-medium">{selectedMaterial.unit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Inventory Status */}
        <TabsContent value="inventory-status">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">재고 현황</h2>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">전체 자재</p>
                      <p className="text-2xl font-bold">{materials.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">정상 재고</p>
                      <p className="text-2xl font-bold text-green-600">
                        {materials.filter((m) => getStockStatus(m).status === "정상").length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">부족/발주필요</p>
                      <p className="text-2xl font-bold text-red-600">
                        {materials.filter((m) =>
                          getStockStatus(m).status === "부족" ||
                          getStockStatus(m).status === "발주필요"
                        ).length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">과다 재고</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {materials.filter((m) => getStockStatus(m).status === "과다").length}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Section */}
            {materials.filter((m) =>
              getStockStatus(m).status === "부족" ||
              getStockStatus(m).status === "발주필요"
            ).length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    안전재고 경고
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead className="text-right">현재고</TableHead>
                        <TableHead className="text-right">안전재고</TableHead>
                        <TableHead className="text-right">발주점</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials
                        .filter((m) =>
                          getStockStatus(m).status === "부족" ||
                          getStockStatus(m).status === "발주필요"
                        )
                        .map((material) => {
                          const status = getStockStatus(material);
                          return (
                            <TableRow key={material.id}>
                              <TableCell className="font-mono">{material.materialCode}</TableCell>
                              <TableCell>{material.materialName}</TableCell>
                              <TableCell className="text-right font-bold text-red-600">
                                {material.currentStock.toLocaleString()} {material.unit}
                              </TableCell>
                              <TableCell className="text-right">
                                {material.safetyStock.toLocaleString()} {material.unit}
                              </TableCell>
                              <TableCell className="text-right">
                                {material.reorderPoint.toLocaleString()} {material.unit}
                              </TableCell>
                              <TableCell>
                                <Badge variant={status.variant}>{status.status}</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Full Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle>전체 재고 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead>규격</TableHead>
                      <TableHead className="text-right">현재고</TableHead>
                      <TableHead className="text-right">안전재고</TableHead>
                      <TableHead className="text-right">적정재고</TableHead>
                      <TableHead className="text-right">발주점</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => {
                      const status = getStockStatus(material);
                      return (
                        <TableRow key={material.id}>
                          <TableCell className="font-mono">{material.materialCode}</TableCell>
                          <TableCell>{material.materialName}</TableCell>
                          <TableCell>{material.specification}</TableCell>
                          <TableCell className="text-right">
                            {material.currentStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {material.safetyStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {material.optimalStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {material.reorderPoint.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Turnover Rate Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  재고회전율
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead className="text-right">1월</TableHead>
                      <TableHead className="text-right">2월</TableHead>
                      <TableHead className="text-right">3월</TableHead>
                      <TableHead className="text-right">4월</TableHead>
                      <TableHead className="text-right">5월</TableHead>
                      <TableHead className="text-right">6월</TableHead>
                      <TableHead className="text-right">회전율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {turnoverData.map((data) => {
                      const material = materials.find((m) => m.id === data.materialId);
                      if (!material) return null;
                      return (
                        <TableRow key={data.materialId}>
                          <TableCell className="font-mono">{material.materialCode}</TableCell>
                          <TableCell>{material.materialName}</TableCell>
                          {data.periodUsage.map((usage, idx) => (
                            <TableCell key={idx} className="text-right">
                              {usage.usage.toLocaleString()}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {data.turnoverRate.toFixed(1)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Transaction History */}
        <TabsContent value="transaction-history">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">입출고 이력</h2>
              <Button onClick={() => setShowTransactionForm(!showTransactionForm)}>
                <Plus className="mr-2 h-4 w-4" />
                입출고 등록
              </Button>
            </div>

            {showTransactionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>입출고 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTransactionSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>자재 *</Label>
                        <Select
                          value={transactionForm.materialId}
                          onValueChange={(v) => setTransactionForm({ ...transactionForm, materialId: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="자재 선택" /></SelectTrigger>
                          <SelectContent>
                            {materials.map((m) => (
                              <SelectItem key={m.id} value={m.id.toString()}>
                                {m.materialCode} - {m.materialName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>일자 *</Label>
                        <Input
                          type="date"
                          value={transactionForm.date}
                          onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>구분 *</Label>
                        <Select
                          value={transactionForm.type}
                          onValueChange={(v) => setTransactionForm({ ...transactionForm, type: v as "입고" | "출고" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="입고">입고</SelectItem>
                            <SelectItem value="출고">출고</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>수량 *</Label>
                        <Input
                          type="number"
                          value={transactionForm.quantity}
                          onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>LOT번호 *</Label>
                        <Input
                          value={transactionForm.lotNumber}
                          onChange={(e) => setTransactionForm({ ...transactionForm, lotNumber: e.target.value })}
                          placeholder="LOT-2026-0609-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공급업체/사용처 *</Label>
                        <Input
                          value={transactionForm.supplierOrDestination}
                          onChange={(e) => setTransactionForm({ ...transactionForm, supplierOrDestination: e.target.value })}
                          placeholder="업체명 또는 사용처"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowTransactionForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Filter by Material */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label>자재 필터</Label>
                    <Select
                      value={selectedMaterialId?.toString() || "all"}
                      onValueChange={(v) => setSelectedMaterialId(v === "all" ? null : Number(v))}
                    >
                      <SelectTrigger><SelectValue placeholder="전체" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.materialCode} - {m.materialName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Table */}
            <Card>
              <CardHeader>
                <CardTitle>입출고 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>일자</TableHead>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead>구분</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                      <TableHead>LOT번호</TableHead>
                      <TableHead>공급업체/사용처</TableHead>
                      <TableHead className="text-right">잔량</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions
                      .filter((t) => !selectedMaterialId || t.materialId === selectedMaterialId)
                      .map((transaction) => {
                        const material = materials.find((m) => m.id === transaction.materialId);
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className="font-mono">{material?.materialCode}</TableCell>
                            <TableCell>{material?.materialName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={transaction.type === "입고" ? "success" : "destructive"}
                                className="flex items-center gap-1 w-fit"
                              >
                                {transaction.type === "입고" ? (
                                  <ArrowDownCircle className="h-3 w-3" />
                                ) : (
                                  <ArrowUpCircle className="h-3 w-3" />
                                )}
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {transaction.quantity.toLocaleString()} {material?.unit}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{transaction.lotNumber}</TableCell>
                            <TableCell>{transaction.supplierOrDestination}</TableCell>
                            <TableCell className="text-right">
                              {transaction.remainingStock.toLocaleString()} {material?.unit}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                {transactions.filter((t) => !selectedMaterialId || t.materialId === selectedMaterialId).length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">입출고 내역이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Material List */}
        <TabsContent value="material-list">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">자재 목록</h2>
              <Button onClick={() => { setActiveTab("basic-info"); setShowMaterialForm(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                자재 등록
              </Button>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="자재코드, 자재명으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  자재 목록 ({filteredMaterials.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMaterials.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 자재가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead>단위</TableHead>
                        <TableHead className="text-right">현재고</TableHead>
                        <TableHead className="text-right">안전재고</TableHead>
                        <TableHead className="text-right">적정재고</TableHead>
                        <TableHead className="text-right">발주점</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.map((material) => {
                        const status = getStockStatus(material);
                        return (
                          <TableRow key={material.id}>
                            <TableCell className="font-mono">{material.materialCode}</TableCell>
                            <TableCell className="font-medium">{material.materialName}</TableCell>
                            <TableCell>{material.specification}</TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell className="text-right">{material.currentStock.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{material.safetyStock.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{material.optimalStock.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{material.reorderPoint.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={status.variant}>{status.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedMaterialId(material.id);
                                    setActiveTab("basic-info");
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteMaterial(material.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
