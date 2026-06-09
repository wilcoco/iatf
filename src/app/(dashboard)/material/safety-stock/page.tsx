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
  Clock,
  ShoppingCart,
  History,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowDownCircle,
  ArrowUpCircle,
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
  reorderPoint: number;
  maxStock: number;
  leadTime: number;
}

interface InventoryHistory {
  id: number;
  materialId: number;
  date: string;
  type: "입고" | "출고" | "조정";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  registeredBy: string;
}

// Sample data based on Excel "적정재고" sheet
const initialMaterials: Material[] = [
  {
    id: 1,
    materialCode: "RM-001",
    materialName: "스테인리스 파이프",
    specification: "50A x 3.0t",
    unit: "m",
    currentStock: 450,
    safetyStock: 200,
    reorderPoint: 300,
    maxStock: 800,
    leadTime: 7,
  },
  {
    id: 2,
    materialCode: "RM-002",
    materialName: "탄소강 플레이트",
    specification: "10t x 1500 x 3000",
    unit: "장",
    currentStock: 85,
    safetyStock: 50,
    reorderPoint: 70,
    maxStock: 150,
    leadTime: 5,
  },
  {
    id: 3,
    materialCode: "RM-003",
    materialName: "구리 튜브",
    specification: "15A x 1.0t",
    unit: "m",
    currentStock: 120,
    safetyStock: 300,
    reorderPoint: 350,
    maxStock: 600,
    leadTime: 10,
  },
  {
    id: 4,
    materialCode: "RM-004",
    materialName: "알루미늄 앵글",
    specification: "50 x 50 x 5t",
    unit: "개",
    currentStock: 280,
    safetyStock: 100,
    reorderPoint: 150,
    maxStock: 400,
    leadTime: 3,
  },
  {
    id: 5,
    materialCode: "RM-005",
    materialName: "PE 파이프",
    specification: "100A SDR11",
    unit: "m",
    currentStock: 650,
    safetyStock: 200,
    reorderPoint: 300,
    maxStock: 1000,
    leadTime: 4,
  },
  {
    id: 6,
    materialCode: "RM-006",
    materialName: "절연 테이프",
    specification: "25mm x 20m",
    unit: "롤",
    currentStock: 45,
    safetyStock: 100,
    reorderPoint: 120,
    maxStock: 300,
    leadTime: 2,
  },
  {
    id: 7,
    materialCode: "RM-007",
    materialName: "볼트 세트",
    specification: "M10 x 30",
    unit: "set",
    currentStock: 1500,
    safetyStock: 500,
    reorderPoint: 700,
    maxStock: 2000,
    leadTime: 5,
  },
  {
    id: 8,
    materialCode: "RM-008",
    materialName: "용접봉",
    specification: "E7016 4.0mm",
    unit: "kg",
    currentStock: 180,
    safetyStock: 200,
    reorderPoint: 250,
    maxStock: 500,
    leadTime: 3,
  },
];

const initialHistory: InventoryHistory[] = [
  {
    id: 1,
    materialId: 1,
    date: "2023-06-10",
    type: "입고",
    quantity: 200,
    previousStock: 250,
    newStock: 450,
    reason: "정기 발주분 입고",
    registeredBy: "김재고",
  },
  {
    id: 2,
    materialId: 3,
    date: "2023-06-09",
    type: "출고",
    quantity: 150,
    previousStock: 270,
    newStock: 120,
    reason: "A라인 생산투입",
    registeredBy: "이생산",
  },
  {
    id: 3,
    materialId: 6,
    date: "2023-06-08",
    type: "출고",
    quantity: 55,
    previousStock: 100,
    newStock: 45,
    reason: "설비 보수용",
    registeredBy: "박설비",
  },
  {
    id: 4,
    materialId: 8,
    date: "2023-06-07",
    type: "출고",
    quantity: 20,
    previousStock: 200,
    newStock: 180,
    reason: "용접작업 사용",
    registeredBy: "최용접",
  },
  {
    id: 5,
    materialId: 2,
    date: "2023-06-06",
    type: "입고",
    quantity: 50,
    previousStock: 35,
    newStock: 85,
    reason: "긴급 발주분 입고",
    registeredBy: "김재고",
  },
  {
    id: 6,
    materialId: 5,
    date: "2023-06-05",
    type: "조정",
    quantity: 50,
    previousStock: 600,
    newStock: 650,
    reason: "재고실사 조정",
    registeredBy: "정관리",
  },
];

export default function SafetyStockPage() {
  const [activeTab, setActiveTab] = useState("settings");
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [history, setHistory] = useState<InventoryHistory[]>(initialHistory);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [historyMaterialFilter, setHistoryMaterialFilter] = useState("all");
  const [historyTypeFilter, setHistoryTypeFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    materialCode: "",
    materialName: "",
    specification: "",
    unit: "",
    currentStock: "",
    safetyStock: "",
    reorderPoint: "",
    maxStock: "",
    leadTime: "",
  });

  // Filtered materials
  const filteredMaterials = materials.filter(
    (m) =>
      m.materialCode.toLowerCase().includes(search.toLowerCase()) ||
      m.materialName.toLowerCase().includes(search.toLowerCase())
  );

  // Status calculation functions
  const getStockStatus = (material: Material) => {
    if (material.currentStock <= material.safetyStock) {
      return { status: "부족", variant: "destructive" as const, icon: XCircle };
    }
    if (material.currentStock > material.maxStock) {
      return { status: "과다", variant: "warning" as const, icon: AlertTriangle };
    }
    return { status: "정상", variant: "success" as const, icon: CheckCircle };
  };

  const needsReorder = (material: Material) => {
    return material.currentStock <= material.reorderPoint;
  };

  const getShortage = (material: Material) => {
    if (material.currentStock < material.safetyStock) {
      return material.safetyStock - material.currentStock;
    }
    return 0;
  };

  const getExcess = (material: Material) => {
    if (material.currentStock > material.maxStock) {
      return material.currentStock - material.maxStock;
    }
    return 0;
  };

  // Items needing reorder
  const reorderItems = materials.filter(needsReorder);

  // Items with shortage or excess
  const shortageItems = materials.filter((m) => m.currentStock < m.safetyStock);
  const excessItems = materials.filter((m) => m.currentStock > m.maxStock);

  // Form handlers
  const resetForm = () => {
    setFormData({
      materialCode: "",
      materialName: "",
      specification: "",
      unit: "",
      currentStock: "",
      safetyStock: "",
      reorderPoint: "",
      maxStock: "",
      leadTime: "",
    });
    setEditingMaterial(null);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      materialCode: material.materialCode,
      materialName: material.materialName,
      specification: material.specification,
      unit: material.unit,
      currentStock: material.currentStock.toString(),
      safetyStock: material.safetyStock.toString(),
      reorderPoint: material.reorderPoint.toString(),
      maxStock: material.maxStock.toString(),
      leadTime: material.leadTime.toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMaterial) {
      // Update existing material
      setMaterials(
        materials.map((m) =>
          m.id === editingMaterial.id
            ? {
                ...m,
                materialCode: formData.materialCode,
                materialName: formData.materialName,
                specification: formData.specification,
                unit: formData.unit,
                currentStock: Number(formData.currentStock),
                safetyStock: Number(formData.safetyStock),
                reorderPoint: Number(formData.reorderPoint),
                maxStock: Number(formData.maxStock),
                leadTime: Number(formData.leadTime),
              }
            : m
        )
      );
      alert("자재 정보가 수정되었습니다.");
    } else {
      // Add new material
      const newMaterial: Material = {
        id: Date.now(),
        materialCode: formData.materialCode,
        materialName: formData.materialName,
        specification: formData.specification,
        unit: formData.unit,
        currentStock: Number(formData.currentStock),
        safetyStock: Number(formData.safetyStock),
        reorderPoint: Number(formData.reorderPoint),
        maxStock: Number(formData.maxStock),
        leadTime: Number(formData.leadTime),
      };
      setMaterials([newMaterial, ...materials]);
      alert("자재가 등록되었습니다.");
    }

    setShowForm(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("정말로 이 자재를 삭제하시겠습니까?")) {
      setMaterials(materials.filter((m) => m.id !== id));
      setHistory(history.filter((h) => h.materialId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">적정재고관리</h1>
          <p className="text-muted-foreground">작성일 : 2023년 6월 12일</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">적정재고 기준 설정</TabsTrigger>
          <TabsTrigger value="status">재고 현황</TabsTrigger>
          <TabsTrigger value="reorder">발주 필요 품목</TabsTrigger>
          <TabsTrigger value="history">재고 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Safety Stock Standard Settings */}
        <TabsContent value="settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">적정재고 기준 설정</h2>
              <Button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                자재 등록
              </Button>
            </div>

            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingMaterial ? "자재 정보 수정" : "신규 자재 등록"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>자재코드 *</Label>
                        <Input
                          value={formData.materialCode}
                          onChange={(e) =>
                            setFormData({ ...formData, materialCode: e.target.value })
                          }
                          placeholder="RM-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>자재명 *</Label>
                        <Input
                          value={formData.materialName}
                          onChange={(e) =>
                            setFormData({ ...formData, materialName: e.target.value })
                          }
                          placeholder="자재명을 입력하세요"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>규격 *</Label>
                        <Input
                          value={formData.specification}
                          onChange={(e) =>
                            setFormData({ ...formData, specification: e.target.value })
                          }
                          placeholder="50A x 3.0t"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-6">
                      <div className="space-y-2">
                        <Label>단위 *</Label>
                        <Select
                          value={formData.unit}
                          onValueChange={(v) => setFormData({ ...formData, unit: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="장">장</SelectItem>
                            <SelectItem value="개">개</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="set">set</SelectItem>
                            <SelectItem value="롤">롤</SelectItem>
                            <SelectItem value="EA">EA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>현재고</Label>
                        <Input
                          type="number"
                          value={formData.currentStock}
                          onChange={(e) =>
                            setFormData({ ...formData, currentStock: e.target.value })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>안전재고 *</Label>
                        <Input
                          type="number"
                          value={formData.safetyStock}
                          onChange={(e) =>
                            setFormData({ ...formData, safetyStock: e.target.value })
                          }
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>발주점 *</Label>
                        <Input
                          type="number"
                          value={formData.reorderPoint}
                          onChange={(e) =>
                            setFormData({ ...formData, reorderPoint: e.target.value })
                          }
                          placeholder="150"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>적정재고 *</Label>
                        <Input
                          type="number"
                          value={formData.maxStock}
                          onChange={(e) =>
                            setFormData({ ...formData, maxStock: e.target.value })
                          }
                          placeholder="500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>리드타임(일) *</Label>
                        <Input
                          type="number"
                          value={formData.leadTime}
                          onChange={(e) =>
                            setFormData({ ...formData, leadTime: e.target.value })
                          }
                          placeholder="7"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                      >
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        {editingMaterial ? "수정" : "저장"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="자재코드, 자재명으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Settings Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  적정재고 기준 목록 ({filteredMaterials.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead>규격</TableHead>
                      <TableHead className="text-right">안전재고</TableHead>
                      <TableHead className="text-right">발주점</TableHead>
                      <TableHead className="text-right">적정재고</TableHead>
                      <TableHead className="text-right">리드타임(일)</TableHead>
                      <TableHead className="text-right">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-mono">{material.materialCode}</TableCell>
                        <TableCell className="font-medium">{material.materialName}</TableCell>
                        <TableCell>{material.specification}</TableCell>
                        <TableCell className="text-right">
                          {material.safetyStock.toLocaleString()} {material.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {material.reorderPoint.toLocaleString()} {material.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {material.maxStock.toLocaleString()} {material.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {material.leadTime}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(material)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredMaterials.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">
                    등록된 자재가 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Current Inventory Status */}
        <TabsContent value="status">
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
                        {
                          materials.filter((m) => getStockStatus(m).status === "정상")
                            .length
                        }
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">부족 재고</p>
                      <p className="text-2xl font-bold text-red-600">
                        {shortageItems.length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">과다 재고</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {materials.filter((m) => m.currentStock > m.maxStock).length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shortage Alert */}
            {shortageItems.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    부족 알림 - 안전재고 미달
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
                        <TableHead className="text-right">부족수량</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shortageItems.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-mono">
                            {material.materialCode}
                          </TableCell>
                          <TableCell>{material.materialName}</TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            {material.currentStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {material.safetyStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            -{getShortage(material).toLocaleString()} {material.unit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Excess Alert */}
            {materials.filter((m) => m.currentStock > m.maxStock).length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    과다 알림 - 적정재고 초과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead className="text-right">현재고</TableHead>
                        <TableHead className="text-right">적정재고</TableHead>
                        <TableHead className="text-right">초과수량</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials
                        .filter((m) => m.currentStock > m.maxStock)
                        .map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-mono">
                              {material.materialCode}
                            </TableCell>
                            <TableCell>{material.materialName}</TableCell>
                            <TableCell className="text-right font-bold text-yellow-600">
                              {material.currentStock.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {material.maxStock.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right font-bold text-yellow-600">
                              +{getExcess(material).toLocaleString()} {material.unit}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Full Inventory Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>현재고 vs 안전재고 비교</CardTitle>
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
                      <TableHead className="text-right">재고율</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => {
                      const status = getStockStatus(material);
                      const stockRatio = Math.round(
                        (material.currentStock / material.safetyStock) * 100
                      );
                      const StatusIcon = status.icon;
                      return (
                        <TableRow key={material.id}>
                          <TableCell className="font-mono">
                            {material.materialCode}
                          </TableCell>
                          <TableCell>{material.materialName}</TableCell>
                          <TableCell>{material.specification}</TableCell>
                          <TableCell className="text-right">
                            {material.currentStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {material.safetyStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {material.maxStock.toLocaleString()} {material.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                stockRatio < 100
                                  ? "text-red-600"
                                  : stockRatio > 150
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }
                            >
                              {stockRatio}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={status.variant}
                              className="flex items-center gap-1 w-fit"
                            >
                              <StatusIcon className="h-3 w-3" />
                              {status.status}
                            </Badge>
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

        {/* Tab 3: Items Needing Reorder */}
        <TabsContent value="reorder">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">발주 필요 품목</h2>

            {/* Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="h-10 w-10 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">발주 필요 품목</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {reorderItems.length}건
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {reorderItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-lg font-medium">모든 자재가 발주점 이상입니다.</p>
                  <p className="text-muted-foreground">현재 발주가 필요한 품목이 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <ShoppingCart className="h-5 w-5" />
                    발주 필요 목록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead className="text-right">현재고</TableHead>
                        <TableHead className="text-right">발주점</TableHead>
                        <TableHead className="text-right">적정재고</TableHead>
                        <TableHead className="text-right">권장 발주량</TableHead>
                        <TableHead className="text-right">리드타임</TableHead>
                        <TableHead>긴급도</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reorderItems.map((material) => {
                        const recommendedOrder = material.maxStock - material.currentStock;
                        const urgency =
                          material.currentStock <= material.safetyStock
                            ? { label: "긴급", variant: "destructive" as const }
                            : { label: "보통", variant: "warning" as const };
                        return (
                          <TableRow key={material.id}>
                            <TableCell className="font-mono">
                              {material.materialCode}
                            </TableCell>
                            <TableCell className="font-medium">
                              {material.materialName}
                            </TableCell>
                            <TableCell>{material.specification}</TableCell>
                            <TableCell className="text-right text-red-600 font-bold">
                              {material.currentStock.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {material.reorderPoint.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {material.maxStock.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right font-bold text-blue-600">
                              {recommendedOrder.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {material.leadTime}일
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={urgency.variant}>{urgency.label}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            {reorderItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>발주 요약</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">긴급 발주 필요</p>
                      <p className="text-2xl font-bold text-red-700">
                        {
                          reorderItems.filter((m) => m.currentStock <= m.safetyStock)
                            .length
                        }
                        건
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-600 font-medium">일반 발주 필요</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {
                          reorderItems.filter(
                            (m) =>
                              m.currentStock > m.safetyStock &&
                              m.currentStock <= m.reorderPoint
                          ).length
                        }
                        건
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">총 발주 금액 (예상)</p>
                      <p className="text-2xl font-bold text-blue-700">-</p>
                      <p className="text-xs text-muted-foreground">단가 정보 필요</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Inventory History */}
        <TabsContent value="history">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">재고 이력</h2>

            {/* Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1 max-w-xs">
                    <Label>자재 필터</Label>
                    <Select value={historyMaterialFilter} onValueChange={setHistoryMaterialFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
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
                  <div className="space-y-2 flex-1 max-w-xs">
                    <Label>구분</Label>
                    <Select value={historyTypeFilter} onValueChange={setHistoryTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="입고">입고</SelectItem>
                        <SelectItem value="출고">출고</SelectItem>
                        <SelectItem value="조정">조정</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  재고 변동 이력
                </CardTitle>
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
                      <TableHead className="text-right">이전재고</TableHead>
                      <TableHead className="text-right">변경재고</TableHead>
                      <TableHead>사유</TableHead>
                      <TableHead>등록자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history
                      .filter((record) => {
                        if (historyMaterialFilter !== "all" && record.materialId.toString() !== historyMaterialFilter) {
                          return false;
                        }
                        if (historyTypeFilter !== "all" && record.type !== historyTypeFilter) {
                          return false;
                        }
                        return true;
                      })
                      .map((record) => {
                      const material = materials.find((m) => m.id === record.materialId);
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell className="font-mono">
                            {material?.materialCode || "-"}
                          </TableCell>
                          <TableCell>{material?.materialName || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.type === "입고"
                                  ? "success"
                                  : record.type === "출고"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="flex items-center gap-1 w-fit"
                            >
                              {record.type === "입고" ? (
                                <ArrowDownCircle className="h-3 w-3" />
                              ) : record.type === "출고" ? (
                                <ArrowUpCircle className="h-3 w-3" />
                              ) : null}
                              {record.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                record.type === "입고"
                                  ? "text-green-600"
                                  : record.type === "출고"
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }
                            >
                              {record.type === "입고"
                                ? "+"
                                : record.type === "출고"
                                ? "-"
                                : ""}
                              {record.quantity.toLocaleString()}{" "}
                              {material?.unit || ""}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {record.previousStock.toLocaleString()} {material?.unit || ""}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {record.newStock.toLocaleString()} {material?.unit || ""}
                          </TableCell>
                          <TableCell>{record.reason}</TableCell>
                          <TableCell>{record.registeredBy}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {history.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">
                    재고 이력이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
