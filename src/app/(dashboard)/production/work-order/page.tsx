"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Save, Trash2, Play, CheckCircle, History, Search, Clock, User } from "lucide-react";

// Types
interface WorkOrder {
  id: number;
  orderNumber: string;        // 지시번호
  orderDate: string;          // 지시일
  dueDate: string;            // 납기일
  partNumber: string;         // 품번
  partName: string;           // 품명
  specification: string;      // 규격
  orderQuantity: number;      // 지시수량
  unit: string;               // 단위
  productionLine: string;     // 생산라인
  equipment: string;          // 설비
  remarks: string;            // 특기사항
  status: "waiting" | "inProgress" | "completed" | "stopped";
  progress: number;           // 진행률
  producedQuantity: number;   // 생산수량
  goodQuantity: number;       // 양품수량
  defectQuantity: number;     // 불량수량
  workTime: number;           // 작업시간(분)
  worker: string;             // 작업자
  completionRemarks: string;  // 완료 비고
  createdAt: string;
  completedAt: string;
}

const STATUS_OPTIONS = [
  { value: "waiting", label: "대기" },
  { value: "inProgress", label: "진행중" },
  { value: "completed", label: "완료" },
  { value: "stopped", label: "중단" },
];

const UNIT_OPTIONS = [
  { value: "EA", label: "EA" },
  { value: "SET", label: "SET" },
  { value: "PCS", label: "PCS" },
  { value: "KG", label: "KG" },
];

const PRODUCTION_LINES = [
  { value: "line-a", label: "A라인" },
  { value: "line-b", label: "B라인" },
  { value: "line-c", label: "C라인" },
  { value: "line-d", label: "D라인" },
];

const EQUIPMENT_OPTIONS = [
  { value: "inj-1", label: "사출기 1호기" },
  { value: "inj-2", label: "사출기 2호기" },
  { value: "inj-3", label: "사출기 3호기" },
  { value: "paint-1", label: "도장라인 1" },
  { value: "paint-2", label: "도장라인 2" },
  { value: "asm-1", label: "조립라인 1" },
  { value: "asm-2", label: "조립라인 2" },
];

export default function WorkOrderPage() {
  const [activeTab, setActiveTab] = useState("issue");

  // Form State for issuing work order
  const [formData, setFormData] = useState({
    orderNumber: "",
    orderDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    partNumber: "",
    partName: "",
    specification: "",
    orderQuantity: 0,
    unit: "EA",
    productionLine: "",
    equipment: "",
    remarks: "",
  });

  // Completion form state
  const [completionForm, setCompletionForm] = useState({
    selectedOrderId: 0,
    completedQuantity: 0,
    workTime: 0,
    worker: "",
    completionRemarks: "",
  });

  // Work orders list
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 1,
      orderNumber: "WO-2026-0001",
      orderDate: "2026-06-01",
      dueDate: "2026-06-05",
      partNumber: "BP-FR-001",
      partName: "범퍼 FR",
      specification: "SK3 STD",
      orderQuantity: 500,
      unit: "EA",
      productionLine: "line-a",
      equipment: "inj-1",
      remarks: "긴급 오더",
      status: "completed",
      progress: 100,
      producedQuantity: 500,
      goodQuantity: 495,
      defectQuantity: 5,
      workTime: 480,
      worker: "김철수",
      completionRemarks: "정상 완료",
      createdAt: "2026-06-01",
      completedAt: "2026-06-05",
    },
    {
      id: 2,
      orderNumber: "WO-2026-0002",
      orderDate: "2026-06-03",
      dueDate: "2026-06-08",
      partNumber: "BP-RR-001",
      partName: "범퍼 RR",
      specification: "SK3 STD",
      orderQuantity: 300,
      unit: "EA",
      productionLine: "line-a",
      equipment: "inj-2",
      remarks: "",
      status: "inProgress",
      progress: 60,
      producedQuantity: 180,
      goodQuantity: 178,
      defectQuantity: 2,
      workTime: 240,
      worker: "이영희",
      completionRemarks: "",
      createdAt: "2026-06-03",
      completedAt: "",
    },
    {
      id: 3,
      orderNumber: "WO-2026-0003",
      orderDate: "2026-06-05",
      dueDate: "2026-06-10",
      partNumber: "GR-FR-001",
      partName: "그릴 FR",
      specification: "NQ5 GTL",
      orderQuantity: 200,
      unit: "EA",
      productionLine: "line-b",
      equipment: "inj-3",
      remarks: "신규 품목",
      status: "waiting",
      progress: 0,
      producedQuantity: 0,
      goodQuantity: 0,
      defectQuantity: 0,
      workTime: 0,
      worker: "",
      completionRemarks: "",
      createdAt: "2026-06-05",
      completedAt: "",
    },
    {
      id: 4,
      orderNumber: "WO-2026-0004",
      orderDate: "2026-06-06",
      dueDate: "2026-06-12",
      partNumber: "SS-L-001",
      partName: "사이드 스커트 LH",
      specification: "AX1 STD",
      orderQuantity: 150,
      unit: "EA",
      productionLine: "line-c",
      equipment: "paint-1",
      remarks: "",
      status: "stopped",
      progress: 30,
      producedQuantity: 45,
      goodQuantity: 40,
      defectQuantity: 5,
      workTime: 120,
      worker: "박민수",
      completionRemarks: "설비 고장으로 중단",
      createdAt: "2026-06-06",
      completedAt: "",
    },
  ]);

  // Search filter for history
  const [searchFilter, setSearchFilter] = useState({
    orderNumber: "",
    partName: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  // Generate order number
  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = workOrders.length + 1;
    return `WO-${year}-${String(nextNumber).padStart(4, "0")}`;
  };

  // Handle form submission for new work order
  const handleIssueWorkOrder = () => {
    const newOrder: WorkOrder = {
      id: Date.now(),
      orderNumber: formData.orderNumber || generateOrderNumber(),
      orderDate: formData.orderDate,
      dueDate: formData.dueDate,
      partNumber: formData.partNumber,
      partName: formData.partName,
      specification: formData.specification,
      orderQuantity: formData.orderQuantity,
      unit: formData.unit,
      productionLine: formData.productionLine,
      equipment: formData.equipment,
      remarks: formData.remarks,
      status: "waiting",
      progress: 0,
      producedQuantity: 0,
      goodQuantity: 0,
      defectQuantity: 0,
      workTime: 0,
      worker: "",
      completionRemarks: "",
      createdAt: new Date().toISOString().split("T")[0],
      completedAt: "",
    };

    setWorkOrders([newOrder, ...workOrders]);
    resetForm();
    alert("작업지시서가 발행되었습니다.");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      orderNumber: "",
      orderDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      partNumber: "",
      partName: "",
      specification: "",
      orderQuantity: 0,
      unit: "EA",
      productionLine: "",
      equipment: "",
      remarks: "",
    });
  };

  // Update work order status
  const updateOrderStatus = (id: number, status: WorkOrder["status"]) => {
    setWorkOrders(
      workOrders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  // Update progress
  const updateProgress = (id: number, producedQty: number, goodQty: number, defectQty: number) => {
    setWorkOrders(
      workOrders.map((order) => {
        if (order.id === id) {
          const progress = Math.min(100, Math.round((producedQty / order.orderQuantity) * 100));
          return {
            ...order,
            producedQuantity: producedQty,
            goodQuantity: goodQty,
            defectQuantity: defectQty,
            progress,
            status: progress >= 100 ? "completed" : order.status === "waiting" ? "inProgress" : order.status,
          };
        }
        return order;
      })
    );
  };

  // Complete work order
  const handleCompleteWorkOrder = () => {
    if (!completionForm.selectedOrderId) {
      alert("완료 처리할 작업지시서를 선택해주세요.");
      return;
    }

    setWorkOrders(
      workOrders.map((order) => {
        if (order.id === completionForm.selectedOrderId) {
          return {
            ...order,
            producedQuantity: completionForm.completedQuantity,
            goodQuantity: completionForm.completedQuantity - order.defectQuantity,
            workTime: completionForm.workTime,
            worker: completionForm.worker,
            completionRemarks: completionForm.completionRemarks,
            status: "completed",
            progress: 100,
            completedAt: new Date().toISOString().split("T")[0],
          };
        }
        return order;
      })
    );

    setCompletionForm({
      selectedOrderId: 0,
      completedQuantity: 0,
      workTime: 0,
      worker: "",
      completionRemarks: "",
    });

    alert("작업이 완료 처리되었습니다.");
  };

  // Delete work order
  const deleteWorkOrder = (id: number) => {
    if (confirm("이 작업지시서를 삭제하시겠습니까?")) {
      setWorkOrders(workOrders.filter((order) => order.id !== id));
    }
  };

  // Get status badge
  const getStatusBadge = (status: WorkOrder["status"]) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline">대기</Badge>;
      case "inProgress":
        return <Badge variant="warning">진행중</Badge>;
      case "completed":
        return <Badge variant="success">완료</Badge>;
      case "stopped":
        return <Badge variant="error">중단</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get label for select values
  const getLineLabel = (value: string) => PRODUCTION_LINES.find((l) => l.value === value)?.label || value;
  const getEquipmentLabel = (value: string) => EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value;

  // Filter orders for history
  const filteredOrders = workOrders.filter((order) => {
    if (searchFilter.orderNumber && !order.orderNumber.includes(searchFilter.orderNumber)) return false;
    if (searchFilter.partName && !order.partName.includes(searchFilter.partName)) return false;
    if (searchFilter.status && order.status !== searchFilter.status) return false;
    if (searchFilter.dateFrom && order.orderDate < searchFilter.dateFrom) return false;
    if (searchFilter.dateTo && order.orderDate > searchFilter.dateTo) return false;
    return true;
  });

  // Statistics
  const stats = {
    total: workOrders.length,
    waiting: workOrders.filter((o) => o.status === "waiting").length,
    inProgress: workOrders.filter((o) => o.status === "inProgress").length,
    completed: workOrders.filter((o) => o.status === "completed").length,
    stopped: workOrders.filter((o) => o.status === "stopped").length,
    totalOrderQty: workOrders.reduce((sum, o) => sum + o.orderQuantity, 0),
    totalProducedQty: workOrders.reduce((sum, o) => sum + o.producedQuantity, 0),
    totalGoodQty: workOrders.reduce((sum, o) => sum + o.goodQuantity, 0),
    totalDefectQty: workOrders.reduce((sum, o) => sum + o.defectQuantity, 0),
  };

  const defectRate = stats.totalProducedQty > 0 ? ((stats.totalDefectQty / stats.totalProducedQty) * 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="h-8 w-8" />
            작업지시서
          </h1>
          <p className="text-muted-foreground">Work Order - 생산 작업지시 발행 및 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="issue">
            <Plus className="mr-2 h-4 w-4" />
            1. 작업지시서 발행
          </TabsTrigger>
          <TabsTrigger value="progress">
            <Play className="mr-2 h-4 w-4" />
            2. 작업 진행 현황
          </TabsTrigger>
          <TabsTrigger value="completion">
            <CheckCircle className="mr-2 h-4 w-4" />
            3. 작업 완료 처리
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            4. 작업지시 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 작업지시서 발행 (Work Order Issue) */}
        <TabsContent value="issue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>작업지시서 발행</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>지시번호</Label>
                  <Input
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder={generateOrderNumber()}
                  />
                  <p className="text-xs text-muted-foreground">미입력시 자동생성</p>
                </div>
                <div className="space-y-2">
                  <Label>지시일 *</Label>
                  <Input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>납기일 *</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div></div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>품번 *</Label>
                  <Input
                    value={formData.partNumber}
                    onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                    placeholder="품번 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>품명 *</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="품명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>규격</Label>
                  <Input
                    value={formData.specification}
                    onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                    placeholder="규격 입력"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>지시수량 *</Label>
                  <Input
                    type="number"
                    value={formData.orderQuantity}
                    onChange={(e) => setFormData({ ...formData, orderQuantity: Number(e.target.value) })}
                    placeholder="0"
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label>단위</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(v) => setFormData({ ...formData, unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIT_OPTIONS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>생산라인 *</Label>
                  <Select
                    value={formData.productionLine}
                    onValueChange={(v) => setFormData({ ...formData, productionLine: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="라인 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTION_LINES.map((line) => (
                        <SelectItem key={line.value} value={line.value}>
                          {line.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>설비</Label>
                  <Select
                    value={formData.equipment}
                    onValueChange={(v) => setFormData({ ...formData, equipment: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="설비 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_OPTIONS.map((eq) => (
                        <SelectItem key={eq.value} value={eq.value}>
                          {eq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>특기사항</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="특이사항이나 주의사항을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  초기화
                </Button>
                <Button onClick={handleIssueWorkOrder}>
                  <Save className="mr-2 h-4 w-4" />
                  발행
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 발행 작업지시서</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>지시번호</TableHead>
                    <TableHead>지시일</TableHead>
                    <TableHead>납기일</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead className="text-right">지시수량</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.dueDate}</TableCell>
                      <TableCell>{order.partNumber}</TableCell>
                      <TableCell>{order.partName}</TableCell>
                      <TableCell className="text-right">{order.orderQuantity.toLocaleString()} {order.unit}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 작업 진행 현황 (Work Progress) */}
        <TabsContent value="progress" className="space-y-6">
          {/* Status Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">대기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.waiting}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">진행중</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">완료</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.completed}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">중단</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.stopped}건</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>작업지시 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>지시번호</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead>라인/설비</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>진행률</TableHead>
                      <TableHead className="text-right">생산수량</TableHead>
                      <TableHead className="text-right">양품수량</TableHead>
                      <TableHead className="text-right">불량수량</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.filter((o) => o.status !== "completed").map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.partName}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{getLineLabel(order.productionLine)}</div>
                            <div className="text-muted-foreground">{getEquipmentLabel(order.equipment)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  order.status === "stopped" ? "bg-red-500" :
                                  order.progress >= 100 ? "bg-green-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{order.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={order.producedQuantity}
                            onChange={(e) => {
                              const produced = Number(e.target.value);
                              updateProgress(order.id, produced, produced - order.defectQuantity, order.defectQuantity);
                            }}
                            className="w-24 text-right"
                            min={0}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {order.goodQuantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={order.defectQuantity}
                            onChange={(e) => {
                              const defect = Number(e.target.value);
                              updateProgress(order.id, order.producedQuantity, order.producedQuantity - defect, defect);
                            }}
                            className="w-20 text-right"
                            min={0}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) => updateOrderStatus(order.id, v as WorkOrder["status"])}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>생산 현황 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">총 지시수량</p>
                  <p className="text-2xl font-bold">{stats.totalOrderQty.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">총 생산수량</p>
                  <p className="text-2xl font-bold">{stats.totalProducedQty.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">총 양품수량</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalGoodQty.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">불량률</p>
                  <p className="text-2xl font-bold text-red-600">{defectRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 작업 완료 처리 (Work Completion) */}
        <TabsContent value="completion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>작업 완료 처리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>작업지시서 선택 *</Label>
                <Select
                  value={completionForm.selectedOrderId ? String(completionForm.selectedOrderId) : ""}
                  onValueChange={(v) => {
                    const order = workOrders.find((o) => o.id === Number(v));
                    if (order) {
                      setCompletionForm({
                        ...completionForm,
                        selectedOrderId: Number(v),
                        completedQuantity: order.producedQuantity || order.orderQuantity,
                        workTime: order.workTime,
                        worker: order.worker,
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="완료 처리할 작업지시서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {workOrders
                      .filter((o) => o.status === "inProgress" || o.status === "stopped")
                      .map((order) => (
                        <SelectItem key={order.id} value={String(order.id)}>
                          {order.orderNumber} - {order.partName} ({order.progress}% 진행)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {completionForm.selectedOrderId > 0 && (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">선택된 작업지시서 정보</h4>
                    {(() => {
                      const order = workOrders.find((o) => o.id === completionForm.selectedOrderId);
                      if (!order) return null;
                      return (
                        <div className="grid gap-4 md:grid-cols-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">품명:</span>
                            <span className="ml-2 font-medium">{order.partName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">지시수량:</span>
                            <span className="ml-2 font-medium">{order.orderQuantity.toLocaleString()} {order.unit}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">현재 생산:</span>
                            <span className="ml-2 font-medium">{order.producedQuantity.toLocaleString()} ({order.progress}%)</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">불량수량:</span>
                            <span className="ml-2 font-medium text-red-600">{order.defectQuantity.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>완료 수량 *</Label>
                      <Input
                        type="number"
                        value={completionForm.completedQuantity}
                        onChange={(e) => setCompletionForm({ ...completionForm, completedQuantity: Number(e.target.value) })}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>작업시간 (분) *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={completionForm.workTime}
                          onChange={(e) => setCompletionForm({ ...completionForm, workTime: Number(e.target.value) })}
                          min={0}
                        />
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        {completionForm.workTime > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({Math.floor(completionForm.workTime / 60)}시간 {completionForm.workTime % 60}분)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>작업자 *</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <Input
                          value={completionForm.worker}
                          onChange={(e) => setCompletionForm({ ...completionForm, worker: e.target.value })}
                          placeholder="작업자명"
                        />
                      </div>
                    </div>
                    <div></div>
                  </div>

                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Textarea
                      value={completionForm.completionRemarks}
                      onChange={(e) => setCompletionForm({ ...completionForm, completionRemarks: e.target.value })}
                      placeholder="완료 처리 관련 비고사항"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleCompleteWorkOrder}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      완료 처리
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>최근 완료된 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>지시번호</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead className="text-right">완료수량</TableHead>
                    <TableHead className="text-right">작업시간</TableHead>
                    <TableHead>작업자</TableHead>
                    <TableHead>완료일</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders
                    .filter((o) => o.status === "completed")
                    .slice(0, 5)
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.partName}</TableCell>
                        <TableCell className="text-right">{order.producedQuantity.toLocaleString()} {order.unit}</TableCell>
                        <TableCell className="text-right">
                          {order.workTime > 0
                            ? `${Math.floor(order.workTime / 60)}h ${order.workTime % 60}m`
                            : "-"}
                        </TableCell>
                        <TableCell>{order.worker || "-"}</TableCell>
                        <TableCell>{order.completedAt || "-"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{order.completionRemarks || "-"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 작업지시 이력 (Work Order History) */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>검색 필터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>지시번호</Label>
                  <Input
                    value={searchFilter.orderNumber}
                    onChange={(e) => setSearchFilter({ ...searchFilter, orderNumber: e.target.value })}
                    placeholder="지시번호 검색"
                  />
                </div>
                <div className="space-y-2">
                  <Label>품명</Label>
                  <Input
                    value={searchFilter.partName}
                    onChange={(e) => setSearchFilter({ ...searchFilter, partName: e.target.value })}
                    placeholder="품명 검색"
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태</Label>
                  <Select
                    value={searchFilter.status}
                    onValueChange={(v) => setSearchFilter({ ...searchFilter, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={searchFilter.dateFrom}
                    onChange={(e) => setSearchFilter({ ...searchFilter, dateFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    value={searchFilter.dateTo}
                    onChange={(e) => setSearchFilter({ ...searchFilter, dateTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSearchFilter({ orderNumber: "", partName: "", status: "", dateFrom: "", dateTo: "" })}
                >
                  필터 초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>작업지시 이력 ({filteredOrders.length}건)</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>검색 조건에 맞는 작업지시서가 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>지시번호</TableHead>
                        <TableHead>지시일</TableHead>
                        <TableHead>납기일</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead className="text-right">지시수량</TableHead>
                        <TableHead className="text-right">생산수량</TableHead>
                        <TableHead>라인</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>작업자</TableHead>
                        <TableHead className="text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell>{order.dueDate}</TableCell>
                          <TableCell>{order.partNumber}</TableCell>
                          <TableCell>{order.partName}</TableCell>
                          <TableCell>{order.specification || "-"}</TableCell>
                          <TableCell className="text-right">{order.orderQuantity.toLocaleString()} {order.unit}</TableCell>
                          <TableCell className="text-right">{order.producedQuantity.toLocaleString()}</TableCell>
                          <TableCell>{getLineLabel(order.productionLine)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.worker || "-"}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteWorkOrder(order.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>상태별 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">대기</Badge>
                    </div>
                    <span className="text-xl font-bold">{stats.waiting}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full"
                      style={{ width: stats.total > 0 ? `${(stats.waiting / stats.total) * 100}%` : "0%" }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">진행중</Badge>
                    </div>
                    <span className="text-xl font-bold">{stats.inProgress}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: stats.total > 0 ? `${(stats.inProgress / stats.total) * 100}%` : "0%" }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">완료</Badge>
                    </div>
                    <span className="text-xl font-bold">{stats.completed}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : "0%" }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="error">중단</Badge>
                    </div>
                    <span className="text-xl font-bold">{stats.stopped}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: stats.total > 0 ? `${(stats.stopped / stats.total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>생산 실적 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">총 지시수량</p>
                    <p className="text-2xl font-bold">{stats.totalOrderQty.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">총 생산수량</p>
                    <p className="text-2xl font-bold">{stats.totalProducedQty.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg border-green-500">
                      <p className="text-sm text-muted-foreground">양품수량</p>
                      <p className="text-xl font-bold text-green-600">{stats.totalGoodQty.toLocaleString()}</p>
                    </div>
                    <div className="p-4 border rounded-lg border-red-500">
                      <p className="text-sm text-muted-foreground">불량수량</p>
                      <p className="text-xl font-bold text-red-600">{stats.totalDefectQty.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
