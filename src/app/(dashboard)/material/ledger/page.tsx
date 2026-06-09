"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Save, Search, Calendar, Package, ClipboardList, Settings2 } from "lucide-react";

// Types
interface LedgerRecord {
  id: number;
  transactionDate: string;
  materialCode: string;
  materialName: string;
  transactionType: "입고" | "출고" | "조정";
  quantity: number;
  lotNo: string;
  supplier: string;
  remarks: string;
}

interface MonthlyLedger {
  materialCode: string;
  materialName: string;
  carryoverStock: number;
  incoming: number;
  outgoing: number;
  closingStock: number;
}

interface InventoryAdjustment {
  id: number;
  adjustmentDate: string;
  materialCode: string;
  materialName: string;
  reason: string;
  quantity: number;
  approver: string;
  status: "대기" | "승인" | "반려";
}

// Sample data for materials
const sampleMaterials = [
  { code: "MAT-001", name: "철강판 SPHC" },
  { code: "MAT-002", name: "알루미늄 AL5052" },
  { code: "MAT-003", name: "스테인리스 SUS304" },
  { code: "MAT-004", name: "구리판 C1100" },
  { code: "MAT-005", name: "황동봉 C2600" },
];

export default function LedgerPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Tab 1: Registration state
  const [records, setRecords] = useState<LedgerRecord[]>([
    {
      id: 1,
      transactionDate: "2026-06-01",
      materialCode: "MAT-001",
      materialName: "철강판 SPHC",
      transactionType: "입고",
      quantity: 500,
      lotNo: "LOT-2026-0601",
      supplier: "대한철강",
      remarks: "정기 입고",
    },
    {
      id: 2,
      transactionDate: "2026-06-03",
      materialCode: "MAT-001",
      materialName: "철강판 SPHC",
      transactionType: "출고",
      quantity: 150,
      lotNo: "LOT-2026-0601",
      supplier: "A라인",
      remarks: "생산 출고",
    },
    {
      id: 3,
      transactionDate: "2026-06-05",
      materialCode: "MAT-002",
      materialName: "알루미늄 AL5052",
      transactionType: "입고",
      quantity: 300,
      lotNo: "LOT-2026-0605",
      supplier: "한국알루미늄",
      remarks: "",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().split("T")[0],
    materialCode: "",
    materialName: "",
    transactionType: "" as "" | "입고" | "출고" | "조정",
    quantity: "",
    lotNo: "",
    supplier: "",
    remarks: "",
  });

  // Tab 2: Monthly ledger state
  const [selectedMonth, setSelectedMonth] = useState("2026-06");

  // Tab 3: Material ledger state
  const [selectedMaterial, setSelectedMaterial] = useState("");

  // Tab 4: Adjustment state
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([
    {
      id: 1,
      adjustmentDate: "2026-06-02",
      materialCode: "MAT-003",
      materialName: "스테인리스 SUS304",
      reason: "실사 결과 차이 조정",
      quantity: -10,
      approver: "김철수",
      status: "승인",
    },
  ]);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [adjustmentFormData, setAdjustmentFormData] = useState({
    adjustmentDate: new Date().toISOString().split("T")[0],
    materialCode: "",
    materialName: "",
    reason: "",
    quantity: "",
    approver: "",
  });

  // Tab 1: Handle registration submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transactionType) return;

    const newRecord: LedgerRecord = {
      id: Date.now(),
      transactionDate: formData.transactionDate,
      materialCode: formData.materialCode,
      materialName: formData.materialName,
      transactionType: formData.transactionType,
      quantity: Number(formData.quantity),
      lotNo: formData.lotNo,
      supplier: formData.supplier,
      remarks: formData.remarks,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      transactionDate: new Date().toISOString().split("T")[0],
      materialCode: "",
      materialName: "",
      transactionType: "",
      quantity: "",
      lotNo: "",
      supplier: "",
      remarks: "",
    });
    alert("입출고 기록이 저장되었습니다.");
  };

  // Tab 1: Filtered records
  const filteredRecords = records.filter(
    (r) =>
      r.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tab 2: Calculate monthly ledger data
  const calculateMonthlyLedger = (): MonthlyLedger[] => {
    const materialMap = new Map<string, MonthlyLedger>();

    // Initialize with sample materials
    sampleMaterials.forEach((mat) => {
      materialMap.set(mat.code, {
        materialCode: mat.code,
        materialName: mat.name,
        carryoverStock: Math.floor(Math.random() * 200) + 100, // Sample carryover
        incoming: 0,
        outgoing: 0,
        closingStock: 0,
      });
    });

    // Calculate incoming/outgoing from records for selected month
    records
      .filter((r) => r.transactionDate.startsWith(selectedMonth))
      .forEach((record) => {
        const ledger = materialMap.get(record.materialCode);
        if (ledger) {
          if (record.transactionType === "입고") {
            ledger.incoming += record.quantity;
          } else if (record.transactionType === "출고") {
            ledger.outgoing += record.quantity;
          } else if (record.transactionType === "조정") {
            if (record.quantity > 0) {
              ledger.incoming += record.quantity;
            } else {
              ledger.outgoing += Math.abs(record.quantity);
            }
          }
        }
      });

    // Calculate closing stock
    materialMap.forEach((ledger) => {
      ledger.closingStock = ledger.carryoverStock + ledger.incoming - ledger.outgoing;
    });

    return Array.from(materialMap.values());
  };

  const monthlyLedgerData = calculateMonthlyLedger();
  const monthlyTotals = monthlyLedgerData.reduce(
    (acc, item) => ({
      carryoverStock: acc.carryoverStock + item.carryoverStock,
      incoming: acc.incoming + item.incoming,
      outgoing: acc.outgoing + item.outgoing,
      closingStock: acc.closingStock + item.closingStock,
    }),
    { carryoverStock: 0, incoming: 0, outgoing: 0, closingStock: 0 }
  );

  // Tab 3: Material specific records
  const materialRecords = records
    .filter((r) => r.materialCode === selectedMaterial)
    .sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());

  const calculateMaterialBalance = () => {
    let balance = 200; // Initial balance (sample)
    return materialRecords.map((record) => {
      if (record.transactionType === "입고") {
        balance += record.quantity;
      } else if (record.transactionType === "출고") {
        balance -= record.quantity;
      } else {
        balance += record.quantity; // Adjustment can be positive or negative
      }
      return { ...record, balance };
    });
  };

  // Tab 4: Handle adjustment submit
  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdjustment: InventoryAdjustment = {
      id: Date.now(),
      adjustmentDate: adjustmentFormData.adjustmentDate,
      materialCode: adjustmentFormData.materialCode,
      materialName: adjustmentFormData.materialName,
      reason: adjustmentFormData.reason,
      quantity: Number(adjustmentFormData.quantity),
      approver: adjustmentFormData.approver,
      status: "대기",
    };
    setAdjustments([newAdjustment, ...adjustments]);

    // Also add to records as adjustment type
    const adjustmentRecord: LedgerRecord = {
      id: Date.now() + 1,
      transactionDate: adjustmentFormData.adjustmentDate,
      materialCode: adjustmentFormData.materialCode,
      materialName: adjustmentFormData.materialName,
      transactionType: "조정",
      quantity: Number(adjustmentFormData.quantity),
      lotNo: "",
      supplier: "",
      remarks: `조정사유: ${adjustmentFormData.reason}`,
    };
    setRecords([adjustmentRecord, ...records]);

    setShowAdjustmentForm(false);
    setAdjustmentFormData({
      adjustmentDate: new Date().toISOString().split("T")[0],
      materialCode: "",
      materialName: "",
      reason: "",
      quantity: "",
      approver: "",
    });
    alert("재고 조정이 등록되었습니다.");
  };

  const handleMaterialSelectForForm = (code: string) => {
    const material = sampleMaterials.find((m) => m.code === code);
    if (material) {
      setFormData((prev) => ({
        ...prev,
        materialCode: code,
        materialName: material.name,
      }));
    }
  };

  const handleMaterialSelectForAdjustment = (code: string) => {
    const material = sampleMaterials.find((m) => m.code === code);
    if (material) {
      setAdjustmentFormData((prev) => ({
        ...prev,
        materialCode: code,
        materialName: material.name,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">자재수불부 (월간)</h1>
        <p className="text-muted-foreground">자재 입출고 기록 및 재고 현황 관리</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            자재 입출고 등록
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            월별 수불 현황
          </TabsTrigger>
          <TabsTrigger value="material" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            자재별 수불부
          </TabsTrigger>
          <TabsTrigger value="adjustment" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            재고 조정
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Material In/Out Registration */}
        <TabsContent value="registration">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="자재코드, 자재명, LOT번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="mr-2 h-4 w-4" />
                입출고 등록
              </Button>
            </div>

            {showForm && (
              <Card>
                <CardHeader>
                  <CardTitle>입출고 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>일자 *</Label>
                        <Input
                          type="date"
                          value={formData.transactionDate}
                          onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>자재코드 *</Label>
                        <Select
                          value={formData.materialCode}
                          onValueChange={handleMaterialSelectForForm}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleMaterials.map((mat) => (
                              <SelectItem key={mat.code} value={mat.code}>
                                {mat.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>자재명</Label>
                        <Input value={formData.materialName} readOnly className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>구분 *</Label>
                        <Select
                          value={formData.transactionType}
                          onValueChange={(v) => setFormData({ ...formData, transactionType: v as "입고" | "출고" | "조정" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="입고">입고</SelectItem>
                            <SelectItem value="출고">출고</SelectItem>
                            <SelectItem value="조정">조정</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>수량 *</Label>
                        <Input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lot번호</Label>
                        <Input
                          value={formData.lotNo}
                          onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                          placeholder="LOT-2026-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>거래처/사용처</Label>
                        <Input
                          value={formData.supplier}
                          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                          placeholder="거래처명 또는 사용처"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={formData.remarks}
                          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                          placeholder="비고사항"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  입출고 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRecords.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 입출고 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>일자</TableHead>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead>구분</TableHead>
                        <TableHead className="text-right">수량</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead>거래처/사용처</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.transactionDate}</TableCell>
                          <TableCell className="font-mono">{record.materialCode}</TableCell>
                          <TableCell>{record.materialName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.transactionType === "입고"
                                  ? "success"
                                  : record.transactionType === "출고"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {record.transactionType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{record.quantity.toLocaleString()}</TableCell>
                          <TableCell className="font-mono">{record.lotNo || "-"}</TableCell>
                          <TableCell>{record.supplier || "-"}</TableCell>
                          <TableCell>{record.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Monthly Ledger Status */}
        <TabsContent value="monthly">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  월별 수불 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>년월 선택</Label>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-48"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead className="text-right">이월재고</TableHead>
                      <TableHead className="text-right">입고</TableHead>
                      <TableHead className="text-right">출고</TableHead>
                      <TableHead className="text-right">기말재고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyLedgerData.map((item) => (
                      <TableRow key={item.materialCode}>
                        <TableCell className="font-mono">{item.materialCode}</TableCell>
                        <TableCell>{item.materialName}</TableCell>
                        <TableCell className="text-right">{item.carryoverStock.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-green-600">+{item.incoming.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-red-600">-{item.outgoing.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold">{item.closingStock.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={2}>합계</TableCell>
                      <TableCell className="text-right">{monthlyTotals.carryoverStock.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">+{monthlyTotals.incoming.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">-{monthlyTotals.outgoing.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{monthlyTotals.closingStock.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Ledger by Material */}
        <TabsContent value="material">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  자재별 수불부
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>자재 선택</Label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="자재를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleMaterials.map((mat) => (
                        <SelectItem key={mat.code} value={mat.code}>
                          {mat.code} - {mat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMaterial ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">선택된 자재</p>
                      <p className="font-semibold">
                        {selectedMaterial} - {sampleMaterials.find((m) => m.code === selectedMaterial)?.name}
                      </p>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>일자</TableHead>
                          <TableHead>구분</TableHead>
                          <TableHead className="text-right">입고</TableHead>
                          <TableHead className="text-right">출고</TableHead>
                          <TableHead className="text-right">잔고</TableHead>
                          <TableHead>Lot번호</TableHead>
                          <TableHead>거래처/사용처</TableHead>
                          <TableHead>비고</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculateMaterialBalance().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                              해당 자재의 입출고 기록이 없습니다.
                            </TableCell>
                          </TableRow>
                        ) : (
                          calculateMaterialBalance().map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{record.transactionDate}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    record.transactionType === "입고"
                                      ? "success"
                                      : record.transactionType === "출고"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {record.transactionType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                {record.transactionType === "입고" ? `+${record.quantity.toLocaleString()}` : "-"}
                              </TableCell>
                              <TableCell className="text-right text-red-600">
                                {record.transactionType === "출고" ? `-${record.quantity.toLocaleString()}` : "-"}
                              </TableCell>
                              <TableCell className="text-right font-semibold">{record.balance.toLocaleString()}</TableCell>
                              <TableCell className="font-mono">{record.lotNo || "-"}</TableCell>
                              <TableCell>{record.supplier || "-"}</TableCell>
                              <TableCell>{record.remarks || "-"}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <p className="text-muted-foreground py-8 text-center">자재를 선택하면 수불 내역이 표시됩니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Inventory Adjustment */}
        <TabsContent value="adjustment">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowAdjustmentForm(!showAdjustmentForm)}>
                <Plus className="mr-2 h-4 w-4" />
                재고 조정 등록
              </Button>
            </div>

            {showAdjustmentForm && (
              <Card>
                <CardHeader>
                  <CardTitle>재고 조정 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdjustmentSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>조정일 *</Label>
                        <Input
                          type="date"
                          value={adjustmentFormData.adjustmentDate}
                          onChange={(e) =>
                            setAdjustmentFormData({ ...adjustmentFormData, adjustmentDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>자재코드 *</Label>
                        <Select
                          value={adjustmentFormData.materialCode}
                          onValueChange={handleMaterialSelectForAdjustment}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleMaterials.map((mat) => (
                              <SelectItem key={mat.code} value={mat.code}>
                                {mat.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>자재명</Label>
                        <Input value={adjustmentFormData.materialName} readOnly className="bg-muted" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>조정수량 *</Label>
                        <Input
                          type="number"
                          value={adjustmentFormData.quantity}
                          onChange={(e) => setAdjustmentFormData({ ...adjustmentFormData, quantity: e.target.value })}
                          placeholder="양수: 증가, 음수: 감소"
                          required
                        />
                        <p className="text-xs text-muted-foreground">증가는 양수, 감소는 음수로 입력</p>
                      </div>
                      <div className="space-y-2">
                        <Label>승인자 *</Label>
                        <Input
                          value={adjustmentFormData.approver}
                          onChange={(e) => setAdjustmentFormData({ ...adjustmentFormData, approver: e.target.value })}
                          placeholder="승인자 이름"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>조정사유 *</Label>
                      <Textarea
                        value={adjustmentFormData.reason}
                        onChange={(e) => setAdjustmentFormData({ ...adjustmentFormData, reason: e.target.value })}
                        placeholder="재고 조정 사유를 상세히 입력하세요"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowAdjustmentForm(false)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        등록
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  재고 조정 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {adjustments.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 재고 조정 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>조정일</TableHead>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead>조정사유</TableHead>
                        <TableHead className="text-right">조정수량</TableHead>
                        <TableHead>승인자</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adjustments.map((adj) => (
                        <TableRow key={adj.id}>
                          <TableCell>{adj.adjustmentDate}</TableCell>
                          <TableCell className="font-mono">{adj.materialCode}</TableCell>
                          <TableCell>{adj.materialName}</TableCell>
                          <TableCell>{adj.reason}</TableCell>
                          <TableCell className={`text-right ${adj.quantity >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {adj.quantity >= 0 ? `+${adj.quantity.toLocaleString()}` : adj.quantity.toLocaleString()}
                          </TableCell>
                          <TableCell>{adj.approver}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                adj.status === "승인"
                                  ? "success"
                                  : adj.status === "반려"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {adj.status}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
