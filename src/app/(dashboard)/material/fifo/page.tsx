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
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

// Interfaces
interface ReceiptRecord {
  id: number;
  receiptDate: string;
  receiptNumber: string;
  materialCode: string;
  materialName: string;
  specification: string;
  quantity: number;
  remainingQuantity: number;
  unit: string;
  lotNumber: string;
  manufactureDate: string;
  expiryDate: string | null;
  supplier: string;
  warehouse: string;
  rack: string;
  row: string;
  column: string;
}

interface IssueRecord {
  id: number;
  issueDate: string;
  receiptId: number;
  materialCode: string;
  materialName: string;
  lotNumber: string;
  quantity: number;
  workOrderNumber: string;
  fifoCompliant: boolean;
  expectedLotNumber: string;
  reason: string | null;
}

interface FifoViolation {
  id: number;
  violationDate: string;
  materialCode: string;
  materialName: string;
  expectedLotNumber: string;
  usedLotNumber: string;
  workOrderNumber: string;
  reason: string;
  correctionAction: string | null;
  status: "미해결" | "조치완료";
}

// Sample data
const initialReceipts: ReceiptRecord[] = [
  {
    id: 1,
    receiptDate: "2026-05-01",
    receiptNumber: "RCV-2026-0501-001",
    materialCode: "MAT-001",
    materialName: "철강 코일",
    specification: "1.2mm x 1200mm",
    quantity: 2000,
    remainingQuantity: 500,
    unit: "kg",
    lotNumber: "LOT-2026-0501-001",
    manufactureDate: "2026-04-25",
    expiryDate: null,
    supplier: "대한철강(주)",
    warehouse: "창고A",
    rack: "R01",
    row: "01",
    column: "A",
  },
  {
    id: 2,
    receiptDate: "2026-05-15",
    receiptNumber: "RCV-2026-0515-001",
    materialCode: "MAT-001",
    materialName: "철강 코일",
    specification: "1.2mm x 1200mm",
    quantity: 3000,
    remainingQuantity: 3000,
    unit: "kg",
    lotNumber: "LOT-2026-0515-001",
    manufactureDate: "2026-05-10",
    expiryDate: null,
    supplier: "대한철강(주)",
    warehouse: "창고A",
    rack: "R01",
    row: "02",
    column: "A",
  },
  {
    id: 3,
    receiptDate: "2026-05-20",
    receiptNumber: "RCV-2026-0520-001",
    materialCode: "MAT-002",
    materialName: "고무 패킹",
    specification: "50mm x 3mm",
    quantity: 500,
    remainingQuantity: 300,
    unit: "EA",
    lotNumber: "LOT-2026-0520-001",
    manufactureDate: "2026-05-15",
    expiryDate: "2027-05-15",
    supplier: "한국고무산업",
    warehouse: "창고B",
    rack: "R02",
    row: "01",
    column: "B",
  },
  {
    id: 4,
    receiptDate: "2026-06-01",
    receiptNumber: "RCV-2026-0601-001",
    materialCode: "MAT-002",
    materialName: "고무 패킹",
    specification: "50mm x 3mm",
    quantity: 1000,
    remainingQuantity: 1000,
    unit: "EA",
    lotNumber: "LOT-2026-0601-001",
    manufactureDate: "2026-05-28",
    expiryDate: "2027-05-28",
    supplier: "한국고무산업",
    warehouse: "창고B",
    rack: "R02",
    row: "02",
    column: "B",
  },
  {
    id: 5,
    receiptDate: "2026-06-05",
    receiptNumber: "RCV-2026-0605-001",
    materialCode: "MAT-003",
    materialName: "접착제",
    specification: "500ml",
    quantity: 100,
    remainingQuantity: 80,
    unit: "병",
    lotNumber: "LOT-2026-0605-001",
    manufactureDate: "2026-06-01",
    expiryDate: "2026-12-01",
    supplier: "케미컬코리아",
    warehouse: "창고C",
    rack: "R03",
    row: "01",
    column: "A",
  },
];

const initialIssues: IssueRecord[] = [
  {
    id: 1,
    issueDate: "2026-06-05",
    receiptId: 1,
    materialCode: "MAT-001",
    materialName: "철강 코일",
    lotNumber: "LOT-2026-0501-001",
    quantity: 1000,
    workOrderNumber: "WO-2026-0605-001",
    fifoCompliant: true,
    expectedLotNumber: "LOT-2026-0501-001",
    reason: null,
  },
  {
    id: 2,
    issueDate: "2026-06-08",
    receiptId: 1,
    materialCode: "MAT-001",
    materialName: "철강 코일",
    lotNumber: "LOT-2026-0501-001",
    quantity: 500,
    workOrderNumber: "WO-2026-0608-001",
    fifoCompliant: true,
    expectedLotNumber: "LOT-2026-0501-001",
    reason: null,
  },
  {
    id: 3,
    issueDate: "2026-06-07",
    receiptId: 3,
    materialCode: "MAT-002",
    materialName: "고무 패킹",
    lotNumber: "LOT-2026-0520-001",
    quantity: 200,
    workOrderNumber: "WO-2026-0607-001",
    fifoCompliant: true,
    expectedLotNumber: "LOT-2026-0520-001",
    reason: null,
  },
  {
    id: 4,
    issueDate: "2026-06-09",
    receiptId: 5,
    materialCode: "MAT-003",
    materialName: "접착제",
    lotNumber: "LOT-2026-0605-001",
    quantity: 20,
    workOrderNumber: "WO-2026-0609-001",
    fifoCompliant: true,
    expectedLotNumber: "LOT-2026-0605-001",
    reason: null,
  },
];

const initialViolations: FifoViolation[] = [
  {
    id: 1,
    violationDate: "2026-05-25",
    materialCode: "MAT-001",
    materialName: "철강 코일",
    expectedLotNumber: "LOT-2026-0420-001",
    usedLotNumber: "LOT-2026-0501-001",
    workOrderNumber: "WO-2026-0525-001",
    reason: "긴급 생산으로 인한 물류 동선 우선",
    correctionAction: "물류팀 교육 실시, 보관위치 재배치",
    status: "조치완료",
  },
  {
    id: 2,
    violationDate: "2026-06-02",
    materialCode: "MAT-002",
    materialName: "고무 패킹",
    expectedLotNumber: "LOT-2026-0510-001",
    usedLotNumber: "LOT-2026-0520-001",
    workOrderNumber: "WO-2026-0602-001",
    reason: "재고 위치 라벨 오류",
    correctionAction: null,
    status: "미해결",
  },
];

export default function FifoManagementPage() {
  const [activeTab, setActiveTab] = useState("receipt");
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(initialReceipts);
  const [issues, setIssues] = useState<IssueRecord[]>(initialIssues);
  const [violations, setViolations] = useState<FifoViolation[]>(initialViolations);
  const [search, setSearch] = useState("");
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Form states
  const [receiptForm, setReceiptForm] = useState({
    receiptDate: new Date().toISOString().split("T")[0],
    receiptNumber: "",
    materialCode: "",
    materialName: "",
    specification: "",
    quantity: "",
    unit: "",
    lotNumber: "",
    manufactureDate: "",
    expiryDate: "",
    supplier: "",
    warehouse: "",
    rack: "",
    row: "",
    column: "",
  });

  const [issueForm, setIssueForm] = useState({
    issueDate: new Date().toISOString().split("T")[0],
    selectedReceiptId: "",
    quantity: "",
    workOrderNumber: "",
    fifoOverride: false,
    overrideReason: "",
  });

  // Get available materials for issue (grouped by material code, sorted by receipt date)
  const getAvailableMaterials = () => {
    const materialGroups = receipts
      .filter((r) => r.remainingQuantity > 0)
      .reduce((acc, receipt) => {
        if (!acc[receipt.materialCode]) {
          acc[receipt.materialCode] = [];
        }
        acc[receipt.materialCode].push(receipt);
        return acc;
      }, {} as Record<string, ReceiptRecord[]>);

    // Sort each group by receipt date (oldest first for FIFO)
    Object.keys(materialGroups).forEach((code) => {
      materialGroups[code].sort(
        (a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime()
      );
    });

    return materialGroups;
  };

  const availableMaterials = getAvailableMaterials();

  // Get oldest lot for a material (FIFO recommendation)
  const getOldestLot = (materialCode: string): ReceiptRecord | null => {
    const materialReceipts = availableMaterials[materialCode];
    return materialReceipts && materialReceipts.length > 0 ? materialReceipts[0] : null;
  };

  // Calculate days in storage
  const calculateDaysInStorage = (receiptDate: string): number => {
    const receipt = new Date(receiptDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - receipt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check if expiry is approaching (within 30 days)
  const isExpiryApproaching = (expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  // Check if expired
  const isExpired = (expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  // Handle receipt form submit
  const handleReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: ReceiptRecord = {
      id: Date.now(),
      receiptDate: receiptForm.receiptDate,
      receiptNumber: receiptForm.receiptNumber || `RCV-${receiptForm.receiptDate.replace(/-/g, "")}-${String(receipts.length + 1).padStart(3, "0")}`,
      materialCode: receiptForm.materialCode,
      materialName: receiptForm.materialName,
      specification: receiptForm.specification,
      quantity: Number(receiptForm.quantity),
      remainingQuantity: Number(receiptForm.quantity),
      unit: receiptForm.unit,
      lotNumber: receiptForm.lotNumber,
      manufactureDate: receiptForm.manufactureDate,
      expiryDate: receiptForm.expiryDate || null,
      supplier: receiptForm.supplier,
      warehouse: receiptForm.warehouse,
      rack: receiptForm.rack,
      row: receiptForm.row,
      column: receiptForm.column,
    };
    setReceipts([newReceipt, ...receipts]);
    setShowReceiptForm(false);
    setReceiptForm({
      receiptDate: new Date().toISOString().split("T")[0],
      receiptNumber: "",
      materialCode: "",
      materialName: "",
      specification: "",
      quantity: "",
      unit: "",
      lotNumber: "",
      manufactureDate: "",
      expiryDate: "",
      supplier: "",
      warehouse: "",
      rack: "",
      row: "",
      column: "",
    });
    alert("입고가 등록되었습니다.");
  };

  // Handle issue form submit
  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedReceipt = receipts.find((r) => r.id === Number(issueForm.selectedReceiptId));
    if (!selectedReceipt) return;

    const issueQuantity = Number(issueForm.quantity);
    if (issueQuantity > selectedReceipt.remainingQuantity) {
      alert("출고 수량이 잔여 수량을 초과합니다.");
      return;
    }

    const oldestLot = getOldestLot(selectedReceipt.materialCode);
    const isFifoCompliant = !oldestLot || selectedReceipt.id === oldestLot.id;

    // Create violation record if not FIFO compliant
    if (!isFifoCompliant && oldestLot) {
      const newViolation: FifoViolation = {
        id: Date.now(),
        violationDate: issueForm.issueDate,
        materialCode: selectedReceipt.materialCode,
        materialName: selectedReceipt.materialName,
        expectedLotNumber: oldestLot.lotNumber,
        usedLotNumber: selectedReceipt.lotNumber,
        workOrderNumber: issueForm.workOrderNumber,
        reason: issueForm.overrideReason || "사유 미입력",
        correctionAction: null,
        status: "미해결",
      };
      setViolations([newViolation, ...violations]);
    }

    const newIssue: IssueRecord = {
      id: Date.now(),
      issueDate: issueForm.issueDate,
      receiptId: selectedReceipt.id,
      materialCode: selectedReceipt.materialCode,
      materialName: selectedReceipt.materialName,
      lotNumber: selectedReceipt.lotNumber,
      quantity: issueQuantity,
      workOrderNumber: issueForm.workOrderNumber,
      fifoCompliant: isFifoCompliant,
      expectedLotNumber: oldestLot?.lotNumber || selectedReceipt.lotNumber,
      reason: !isFifoCompliant ? issueForm.overrideReason : null,
    };

    setIssues([newIssue, ...issues]);
    setReceipts(
      receipts.map((r) =>
        r.id === selectedReceipt.id
          ? { ...r, remainingQuantity: r.remainingQuantity - issueQuantity }
          : r
      )
    );
    setShowIssueForm(false);
    setIssueForm({
      issueDate: new Date().toISOString().split("T")[0],
      selectedReceiptId: "",
      quantity: "",
      workOrderNumber: "",
      fifoOverride: false,
      overrideReason: "",
    });

    if (!isFifoCompliant) {
      alert("출고가 처리되었습니다. (FIFO 위반 기록됨)");
    } else {
      alert("출고가 처리되었습니다.");
    }
  };

  // Handle violation correction
  const handleViolationCorrection = (violationId: number, correctionAction: string) => {
    setViolations(
      violations.map((v) =>
        v.id === violationId
          ? { ...v, correctionAction, status: "조치완료" as const }
          : v
      )
    );
    alert("조치가 기록되었습니다.");
  };

  // Filter receipts by search
  const filteredReceipts = receipts.filter(
    (r) =>
      r.materialCode.toLowerCase().includes(search.toLowerCase()) ||
      r.materialName.toLowerCase().includes(search.toLowerCase()) ||
      r.lotNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Get inventory status (grouped by material)
  const getInventoryStatus = () => {
    const materialGroups: Record<
      string,
      {
        materialCode: string;
        materialName: string;
        specification: string;
        unit: string;
        lots: ReceiptRecord[];
        totalRemaining: number;
      }
    > = {};

    receipts.forEach((r) => {
      if (!materialGroups[r.materialCode]) {
        materialGroups[r.materialCode] = {
          materialCode: r.materialCode,
          materialName: r.materialName,
          specification: r.specification,
          unit: r.unit,
          lots: [],
          totalRemaining: 0,
        };
      }
      if (r.remainingQuantity > 0) {
        materialGroups[r.materialCode].lots.push(r);
        materialGroups[r.materialCode].totalRemaining += r.remainingQuantity;
      }
    });

    // Sort lots by receipt date (oldest first)
    Object.values(materialGroups).forEach((group) => {
      group.lots.sort(
        (a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime()
      );
    });

    return Object.values(materialGroups);
  };

  const inventoryStatus = getInventoryStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">선입선출 관리 (FIFO)</h1>
          <p className="text-muted-foreground">IATF 16949 기준 FIFO 관리 시스템</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="receipt">입고 등록</TabsTrigger>
          <TabsTrigger value="issue">출고 처리</TabsTrigger>
          <TabsTrigger value="inventory">재고 현황</TabsTrigger>
          <TabsTrigger value="violations">FIFO 위반 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Receipt Registration */}
        <TabsContent value="receipt">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">입고 등록</h2>
              <Button onClick={() => setShowReceiptForm(!showReceiptForm)}>
                <Plus className="mr-2 h-4 w-4" />
                신규 입고
              </Button>
            </div>

            {showReceiptForm && (
              <Card>
                <CardHeader>
                  <CardTitle>신규 입고 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReceiptSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>입고일 *</Label>
                        <Input
                          type="date"
                          value={receiptForm.receiptDate}
                          onChange={(e) => setReceiptForm({ ...receiptForm, receiptDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>입고번호</Label>
                        <Input
                          value={receiptForm.receiptNumber}
                          onChange={(e) => setReceiptForm({ ...receiptForm, receiptNumber: e.target.value })}
                          placeholder="자동생성"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>자재코드 *</Label>
                        <Input
                          value={receiptForm.materialCode}
                          onChange={(e) => setReceiptForm({ ...receiptForm, materialCode: e.target.value })}
                          placeholder="MAT-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>자재명 *</Label>
                        <Input
                          value={receiptForm.materialName}
                          onChange={(e) => setReceiptForm({ ...receiptForm, materialName: e.target.value })}
                          placeholder="자재명"
                          required
                        />
                      </div>
                    </div>

                    {/* Material Details */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>규격 *</Label>
                        <Input
                          value={receiptForm.specification}
                          onChange={(e) => setReceiptForm({ ...receiptForm, specification: e.target.value })}
                          placeholder="규격"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>수량 *</Label>
                        <Input
                          type="number"
                          value={receiptForm.quantity}
                          onChange={(e) => setReceiptForm({ ...receiptForm, quantity: e.target.value })}
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>단위 *</Label>
                        <Select
                          value={receiptForm.unit}
                          onValueChange={(v) => setReceiptForm({ ...receiptForm, unit: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="EA">EA</SelectItem>
                            <SelectItem value="개">개</SelectItem>
                            <SelectItem value="장">장</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="병">병</SelectItem>
                            <SelectItem value="Set">Set</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lot번호 *</Label>
                        <Input
                          value={receiptForm.lotNumber}
                          onChange={(e) => setReceiptForm({ ...receiptForm, lotNumber: e.target.value })}
                          placeholder="LOT-2026-0610-001"
                          required
                        />
                      </div>
                    </div>

                    {/* Date & Supplier */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>제조일자 *</Label>
                        <Input
                          type="date"
                          value={receiptForm.manufactureDate}
                          onChange={(e) => setReceiptForm({ ...receiptForm, manufactureDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>유효기간</Label>
                        <Input
                          type="date"
                          value={receiptForm.expiryDate}
                          onChange={(e) => setReceiptForm({ ...receiptForm, expiryDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>공급업체 *</Label>
                        <Input
                          value={receiptForm.supplier}
                          onChange={(e) => setReceiptForm({ ...receiptForm, supplier: e.target.value })}
                          placeholder="공급업체명"
                          required
                        />
                      </div>
                    </div>

                    {/* Storage Location */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>창고 *</Label>
                        <Select
                          value={receiptForm.warehouse}
                          onValueChange={(v) => setReceiptForm({ ...receiptForm, warehouse: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="창고A">창고A</SelectItem>
                            <SelectItem value="창고B">창고B</SelectItem>
                            <SelectItem value="창고C">창고C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>랙 *</Label>
                        <Input
                          value={receiptForm.rack}
                          onChange={(e) => setReceiptForm({ ...receiptForm, rack: e.target.value })}
                          placeholder="R01"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>행 *</Label>
                        <Input
                          value={receiptForm.row}
                          onChange={(e) => setReceiptForm({ ...receiptForm, row: e.target.value })}
                          placeholder="01"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>열 *</Label>
                        <Input
                          value={receiptForm.column}
                          onChange={(e) => setReceiptForm({ ...receiptForm, column: e.target.value })}
                          placeholder="A"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowReceiptForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="자재코드, 자재명, Lot번호로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Receipt List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownCircle className="h-5 w-5" />
                  입고 목록 ({filteredReceipts.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>입고일</TableHead>
                      <TableHead>입고번호</TableHead>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead>Lot번호</TableHead>
                      <TableHead className="text-right">입고수량</TableHead>
                      <TableHead className="text-right">잔여수량</TableHead>
                      <TableHead>공급업체</TableHead>
                      <TableHead>보관위치</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell>{receipt.receiptDate}</TableCell>
                        <TableCell className="font-mono text-sm">{receipt.receiptNumber}</TableCell>
                        <TableCell className="font-mono">{receipt.materialCode}</TableCell>
                        <TableCell>{receipt.materialName}</TableCell>
                        <TableCell className="font-mono text-sm">{receipt.lotNumber}</TableCell>
                        <TableCell className="text-right">
                          {receipt.quantity.toLocaleString()} {receipt.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={receipt.remainingQuantity === 0 ? "text-muted-foreground" : ""}>
                            {receipt.remainingQuantity.toLocaleString()} {receipt.unit}
                          </span>
                        </TableCell>
                        <TableCell>{receipt.supplier}</TableCell>
                        <TableCell className="text-sm">
                          {receipt.warehouse}/{receipt.rack}/{receipt.row}/{receipt.column}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredReceipts.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">입고 내역이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Issue Processing */}
        <TabsContent value="issue">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">출고 처리</h2>
              <Button onClick={() => setShowIssueForm(!showIssueForm)}>
                <Plus className="mr-2 h-4 w-4" />
                출고 처리
              </Button>
            </div>

            {showIssueForm && (
              <Card>
                <CardHeader>
                  <CardTitle>출고 처리</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleIssueSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>출고일 *</Label>
                        <Input
                          type="date"
                          value={issueForm.issueDate}
                          onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>작업지시번호 *</Label>
                        <Input
                          value={issueForm.workOrderNumber}
                          onChange={(e) => setIssueForm({ ...issueForm, workOrderNumber: e.target.value })}
                          placeholder="WO-2026-0610-001"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>자재 선택 (FIFO 기준 정렬) *</Label>
                      <Select
                        value={issueForm.selectedReceiptId}
                        onValueChange={(v) => {
                          const receipt = receipts.find((r) => r.id === Number(v));
                          const oldest = receipt ? getOldestLot(receipt.materialCode) : null;
                          const isOldest = oldest && receipt && oldest.id === receipt.id;
                          setIssueForm({
                            ...issueForm,
                            selectedReceiptId: v,
                            fifoOverride: !isOldest,
                          });
                        }}
                      >
                        <SelectTrigger><SelectValue placeholder="자재를 선택하세요" /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(availableMaterials).map(([code, lots]) => (
                            <div key={code}>
                              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted">
                                {code} - {lots[0].materialName}
                              </div>
                              {lots.map((lot, index) => (
                                <SelectItem key={lot.id} value={lot.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    {index === 0 && (
                                      <Badge variant="success" className="text-xs">FIFO</Badge>
                                    )}
                                    <span>{lot.lotNumber}</span>
                                    <span className="text-muted-foreground">
                                      (잔량: {lot.remainingQuantity.toLocaleString()} {lot.unit}, 입고: {lot.receiptDate})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {issueForm.selectedReceiptId && (
                      <>
                        {(() => {
                          const selectedReceipt = receipts.find(
                            (r) => r.id === Number(issueForm.selectedReceiptId)
                          );
                          const oldest = selectedReceipt
                            ? getOldestLot(selectedReceipt.materialCode)
                            : null;
                          const isOldest = oldest && selectedReceipt && oldest.id === selectedReceipt.id;

                          return (
                            <>
                              {!isOldest && oldest && (
                                <Card className="border-orange-200 bg-orange-50">
                                  <CardContent className="pt-4">
                                    <div className="flex items-start gap-3">
                                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                                      <div>
                                        <p className="font-medium text-orange-800">FIFO 준수 경고</p>
                                        <p className="text-sm text-orange-700">
                                          선택하신 Lot ({selectedReceipt?.lotNumber})보다 먼저 입고된 Lot ({oldest.lotNumber})이 있습니다.
                                        </p>
                                        <p className="text-sm text-orange-700">
                                          FIFO 원칙에 따라 입고일 {oldest.receiptDate}의 Lot을 먼저 사용해야 합니다.
                                        </p>
                                        <div className="mt-3 space-y-2">
                                          <Label>FIFO 미준수 사유 *</Label>
                                          <Input
                                            value={issueForm.overrideReason}
                                            onChange={(e) =>
                                              setIssueForm({ ...issueForm, overrideReason: e.target.value })
                                            }
                                            placeholder="미준수 사유를 입력하세요"
                                            required={!isOldest}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {isOldest && (
                                <Card className="border-green-200 bg-green-50">
                                  <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                      <p className="text-green-800">FIFO 준수: 가장 오래된 Lot이 선택되었습니다.</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>출고수량 *</Label>
                                  <Input
                                    type="number"
                                    value={issueForm.quantity}
                                    onChange={(e) => setIssueForm({ ...issueForm, quantity: e.target.value })}
                                    placeholder="100"
                                    max={selectedReceipt?.remainingQuantity}
                                    required
                                  />
                                  <p className="text-sm text-muted-foreground">
                                    잔여수량: {selectedReceipt?.remainingQuantity.toLocaleString()} {selectedReceipt?.unit}
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowIssueForm(false)}>취소</Button>
                      <Button type="submit"><ArrowUpCircle className="mr-2 h-4 w-4" />출고 처리</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Issue History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5" />
                  출고 이력 ({issues.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>출고일</TableHead>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead>Lot번호</TableHead>
                      <TableHead className="text-right">출고수량</TableHead>
                      <TableHead>작업지시번호</TableHead>
                      <TableHead>FIFO 준수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>{issue.issueDate}</TableCell>
                        <TableCell className="font-mono">{issue.materialCode}</TableCell>
                        <TableCell>{issue.materialName}</TableCell>
                        <TableCell className="font-mono text-sm">{issue.lotNumber}</TableCell>
                        <TableCell className="text-right">{issue.quantity.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-sm">{issue.workOrderNumber}</TableCell>
                        <TableCell>
                          {issue.fifoCompliant ? (
                            <Badge variant="success" className="flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              준수
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <XCircle className="h-3 w-3" />
                              위반
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {issues.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">출고 이력이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Inventory Status */}
        <TabsContent value="inventory">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">재고 현황</h2>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">총 자재 종류</p>
                      <p className="text-2xl font-bold">{inventoryStatus.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">총 Lot 수</p>
                      <p className="text-2xl font-bold">
                        {inventoryStatus.reduce((acc, m) => acc + m.lots.length, 0)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">유효기간 임박</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {receipts.filter((r) => r.remainingQuantity > 0 && isExpiryApproaching(r.expiryDate)).length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">유효기간 만료</p>
                      <p className="text-2xl font-bold text-red-600">
                        {receipts.filter((r) => r.remainingQuantity > 0 && isExpired(r.expiryDate)).length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expiry Alert */}
            {receipts.filter((r) => r.remainingQuantity > 0 && (isExpiryApproaching(r.expiryDate) || isExpired(r.expiryDate))).length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    유효기간 알림
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>자재코드</TableHead>
                        <TableHead>자재명</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead className="text-right">잔여수량</TableHead>
                        <TableHead>유효기간</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receipts
                        .filter((r) => r.remainingQuantity > 0 && (isExpiryApproaching(r.expiryDate) || isExpired(r.expiryDate)))
                        .map((receipt) => (
                          <TableRow key={receipt.id}>
                            <TableCell className="font-mono">{receipt.materialCode}</TableCell>
                            <TableCell>{receipt.materialName}</TableCell>
                            <TableCell className="font-mono text-sm">{receipt.lotNumber}</TableCell>
                            <TableCell className="text-right">
                              {receipt.remainingQuantity.toLocaleString()} {receipt.unit}
                            </TableCell>
                            <TableCell>{receipt.expiryDate}</TableCell>
                            <TableCell>
                              {isExpired(receipt.expiryDate) ? (
                                <Badge variant="destructive">만료</Badge>
                              ) : (
                                <Badge variant="warning">임박</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Inventory by Material */}
            {inventoryStatus.map((material) => (
              <Card key={material.materialCode}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {material.materialCode} - {material.materialName}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">총 잔여수량</p>
                      <p className="text-xl font-bold">
                        {material.totalRemaining.toLocaleString()} {material.unit}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>입고일</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead>제조일자</TableHead>
                        <TableHead>유효기간</TableHead>
                        <TableHead className="text-right">잔여수량</TableHead>
                        <TableHead className="text-right">체류일수</TableHead>
                        <TableHead>보관위치</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {material.lots.map((lot, index) => (
                        <TableRow key={lot.id}>
                          <TableCell>
                            {index === 0 ? (
                              <Badge variant="success">FIFO</Badge>
                            ) : (
                              <span className="text-muted-foreground">{index + 1}</span>
                            )}
                          </TableCell>
                          <TableCell>{lot.receiptDate}</TableCell>
                          <TableCell className="font-mono text-sm">{lot.lotNumber}</TableCell>
                          <TableCell>{lot.manufactureDate}</TableCell>
                          <TableCell>{lot.expiryDate || "-"}</TableCell>
                          <TableCell className="text-right">
                            {lot.remainingQuantity.toLocaleString()} {lot.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className={calculateDaysInStorage(lot.receiptDate) > 90 ? "text-orange-600 font-medium" : ""}>
                                {calculateDaysInStorage(lot.receiptDate)}일
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {lot.warehouse}/{lot.rack}/{lot.row}/{lot.column}
                          </TableCell>
                          <TableCell>
                            {isExpired(lot.expiryDate) ? (
                              <Badge variant="destructive">만료</Badge>
                            ) : isExpiryApproaching(lot.expiryDate) ? (
                              <Badge variant="warning">임박</Badge>
                            ) : (
                              <Badge variant="success">정상</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}

            {inventoryStatus.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <p className="text-muted-foreground text-center">재고가 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: FIFO Violations */}
        <TabsContent value="violations">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">FIFO 위반 이력</h2>

            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">총 위반 건수</p>
                      <p className="text-2xl font-bold">{violations.length}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">미해결</p>
                      <p className="text-2xl font-bold text-red-600">
                        {violations.filter((v) => v.status === "미해결").length}
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
                      <p className="text-sm text-muted-foreground">조치완료</p>
                      <p className="text-2xl font-bold text-green-600">
                        {violations.filter((v) => v.status === "조치완료").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Violation List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  위반 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>위반일자</TableHead>
                      <TableHead>자재코드</TableHead>
                      <TableHead>자재명</TableHead>
                      <TableHead>예상 Lot</TableHead>
                      <TableHead>사용 Lot</TableHead>
                      <TableHead>작업지시번호</TableHead>
                      <TableHead>사유</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>조치</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {violations.map((violation) => (
                      <TableRow key={violation.id}>
                        <TableCell>{violation.violationDate}</TableCell>
                        <TableCell className="font-mono">{violation.materialCode}</TableCell>
                        <TableCell>{violation.materialName}</TableCell>
                        <TableCell className="font-mono text-sm text-green-600">{violation.expectedLotNumber}</TableCell>
                        <TableCell className="font-mono text-sm text-red-600">{violation.usedLotNumber}</TableCell>
                        <TableCell className="font-mono text-sm">{violation.workOrderNumber}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={violation.reason}>
                          {violation.reason}
                        </TableCell>
                        <TableCell>
                          <Badge variant={violation.status === "조치완료" ? "success" : "destructive"}>
                            {violation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {violation.status === "미해결" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const action = prompt("조치 내용을 입력하세요:");
                                if (action) {
                                  handleViolationCorrection(violation.id, action);
                                }
                              }}
                            >
                              조치 입력
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground" title={violation.correctionAction || ""}>
                              {violation.correctionAction?.slice(0, 20)}...
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {violations.length === 0 && (
                  <div className="py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">FIFO 위반 이력이 없습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
