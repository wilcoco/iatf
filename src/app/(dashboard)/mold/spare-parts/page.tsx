"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hammer, Plus, Save, Trash2, Search, AlertTriangle, Package, ArrowUpDown } from "lucide-react";

// 금형 스페어파트(예비부품) 품목
interface SparePart {
  id: number;
  partCode: string; // 품목코드
  partName: string; // 품목명
  vehicle: string; // 적용 차종
  moldNo: string; // 적용 금형번호
  specification: string; // 규격
  unit: string; // 단위
  currentStock: number; // 현재고
  safetyStock: number; // 안전재고
  unitPrice: number; // 단가
  location: string; // 위치(보관처)
  remarks: string; // 비고
}

// 입출고 이력
interface MovementHistory {
  id: number;
  partId: number;
  date: string; // 일자
  type: "in" | "out"; // 구분
  quantity: number; // 수량
  reason: string; // 사유/비고
  worker: string; // 담당자
}

const UNITS = ["EA", "SET", "PCS", "M", "KG", "BOX"];

const initialSpareParts: SparePart[] = [
  { id: 1, partCode: "MSP-001", partName: "노즐팁", vehicle: "아반떼 CN7", moldNo: "M-2401", specification: "φ3.0 / SKD61", unit: "EA", currentStock: 4, safetyStock: 6, unitPrice: 85000, location: "A-01-02", remarks: "사출 게이트용" },
  { id: 2, partCode: "MSP-002", partName: "이젝터핀", vehicle: "쏘렌토 MQ4", moldNo: "M-2207", specification: "φ4.0 x 150L", unit: "EA", currentStock: 24, safetyStock: 20, unitPrice: 12000, location: "A-02-01", remarks: "표준 규격" },
  { id: 3, partCode: "MSP-003", partName: "히터밴드", vehicle: "공용", moldNo: "M-1905", specification: "220V 350W", unit: "EA", currentStock: 3, safetyStock: 5, unitPrice: 45000, location: "B-01-03", remarks: "노즐 가열용" },
  { id: 4, partCode: "MSP-004", partName: "가이드부싱", vehicle: "투싼 NX4", moldNo: "M-2310", specification: "φ25 / STD", unit: "SET", currentStock: 8, safetyStock: 4, unitPrice: 32000, location: "B-02-02", remarks: "" },
  { id: 5, partCode: "MSP-005", partName: "리턴스프링", vehicle: "공용", moldNo: "M-1905", specification: "φ20 x 60L", unit: "EA", currentStock: 40, safetyStock: 30, unitPrice: 4500, location: "C-01-01", remarks: "이젝터 복귀용" },
  { id: 6, partCode: "MSP-006", partName: "냉각수 O링", vehicle: "공용", moldNo: "공용", specification: "φ10 / NBR", unit: "BOX", currentStock: 2, safetyStock: 5, unitPrice: 18000, location: "C-02-04", remarks: "100개입" },
  { id: 7, partCode: "MSP-007", partName: "코어핀", vehicle: "쏘렌토 MQ4", moldNo: "M-2207", specification: "φ6.0 / SKD11", unit: "EA", currentStock: 6, safetyStock: 6, unitPrice: 68000, location: "A-03-02", remarks: "정밀 가공품" },
  { id: 8, partCode: "MSP-008", partName: "로케이트링", vehicle: "아반떼 CN7", moldNo: "M-2401", specification: "φ100 / S45C", unit: "EA", currentStock: 5, safetyStock: 3, unitPrice: 28000, location: "B-03-01", remarks: "" },
];

const initialHistory: MovementHistory[] = [
  { id: 1, partId: 1, date: "2026-06-18", type: "out", quantity: 2, reason: "M-2401 노즐 마모 교체", worker: "김정비" },
  { id: 2, partId: 2, date: "2026-06-15", type: "in", quantity: 30, reason: "정기 발주 입고", worker: "이자재" },
  { id: 3, partId: 3, date: "2026-06-12", type: "out", quantity: 2, reason: "히터 단선 교체", worker: "박설비" },
  { id: 4, partId: 5, date: "2026-06-10", type: "in", quantity: 50, reason: "정기 입고", worker: "이자재" },
  { id: 5, partId: 6, date: "2026-06-08", type: "out", quantity: 3, reason: "냉각라인 누수 보수", worker: "최보전" },
];

const emptyPart = {
  partCode: "",
  partName: "",
  vehicle: "",
  moldNo: "",
  specification: "",
  unit: "EA",
  currentStock: 0,
  safetyStock: 0,
  unitPrice: 0,
  location: "",
  remarks: "",
};

export default function MoldSparePartsPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [parts, setParts] = useState<SparePart[]>(initialSpareParts);
  const [history, setHistory] = useState<MovementHistory[]>(initialHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPart, setNewPart] = useState({ ...emptyPart });

  const [movement, setMovement] = useState({
    partId: 0,
    type: "in" as "in" | "out",
    quantity: 0,
    date: new Date().toISOString().split("T")[0],
    reason: "",
    worker: "",
  });

  // 부족 여부 판정
  const isLow = (p: SparePart) => p.currentStock < p.safetyStock;

  // 집계값
  const totalItems = parts.length;
  const lowCount = parts.filter(isLow).length;
  const totalValue = parts.reduce((sum, p) => sum + p.currentStock * p.unitPrice, 0);

  const filteredParts = parts.filter(
    (p) =>
      p.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.moldNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const won = (n: number) => `₩${n.toLocaleString()}`;

  const handleAddPart = () => {
    if (!newPart.partCode || !newPart.partName) {
      alert("품목코드와 품목명은 필수 입력 항목입니다.");
      return;
    }
    const nextId = parts.length > 0 ? Math.max(...parts.map((p) => p.id)) + 1 : 1;
    setParts([...parts, { id: nextId, ...newPart }]);
    setNewPart({ ...emptyPart });
    setShowAddForm(false);
    alert("스페어파트가 등록되었습니다.");
  };

  const handleRemovePart = (id: number) => {
    if (confirm("이 품목을 삭제하시겠습니까?")) {
      setParts(parts.filter((p) => p.id !== id));
    }
  };

  const handleSaveMovement = () => {
    if (!movement.partId) {
      alert("품목을 선택해주세요.");
      return;
    }
    if (movement.quantity <= 0) {
      alert("수량은 1 이상이어야 합니다.");
      return;
    }
    const target = parts.find((p) => p.id === movement.partId);
    if (!target) {
      alert("선택한 품목을 찾을 수 없습니다.");
      return;
    }
    if (movement.type === "out" && movement.quantity > target.currentStock) {
      alert(`출고 수량이 현재고(${target.currentStock})를 초과할 수 없습니다.`);
      return;
    }

    const nextId = history.length > 0 ? Math.max(...history.map((h) => h.id)) + 1 : 1;
    const entry: MovementHistory = {
      id: nextId,
      partId: movement.partId,
      date: movement.date,
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      worker: movement.worker,
    };
    setHistory([entry, ...history]);

    setParts(
      parts.map((p) =>
        p.id === movement.partId
          ? {
              ...p,
              currentStock:
                movement.type === "in"
                  ? p.currentStock + movement.quantity
                  : p.currentStock - movement.quantity,
            }
          : p
      )
    );

    setMovement({
      partId: 0,
      type: "in",
      quantity: 0,
      date: new Date().toISOString().split("T")[0],
      reason: "",
      worker: "",
    });
    alert("입출고 이력이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">금형 스페어파트</h1>
        <p className="text-muted-foreground">금형별 예비부품(스페어파트) 재고 및 입출고 관리</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inventory">
                <Package className="mr-2 h-4 w-4" />
                재고 현황
              </TabsTrigger>
              <TabsTrigger value="history">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                입출고 이력
              </TabsTrigger>
            </TabsList>

            {/* 탭 1: 재고 현황 */}
            <TabsContent value="inventory" className="space-y-6 pt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 품목수</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalItems}건</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">부족 품목수</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{lowCount}건</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 재고금액</CardTitle>
                    <Hammer className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{won(totalValue)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Hammer className="h-5 w-5" />
                    스페어파트 재고 목록
                  </CardTitle>
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    품목 등록
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddForm && (
                    <div className="mb-6 rounded-lg border bg-muted/30 p-4">
                      <h4 className="mb-4 font-medium">신규 품목 등록</h4>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>품목코드 *</Label>
                          <Input
                            value={newPart.partCode}
                            onChange={(e) => setNewPart({ ...newPart, partCode: e.target.value })}
                            placeholder="MSP-009"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품목명 *</Label>
                          <Input
                            value={newPart.partName}
                            onChange={(e) => setNewPart({ ...newPart, partName: e.target.value })}
                            placeholder="노즐팁"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>적용 차종</Label>
                          <Input
                            value={newPart.vehicle}
                            onChange={(e) => setNewPart({ ...newPart, vehicle: e.target.value })}
                            placeholder="아반떼 CN7"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>금형번호</Label>
                          <Input
                            value={newPart.moldNo}
                            onChange={(e) => setNewPart({ ...newPart, moldNo: e.target.value })}
                            placeholder="M-2401"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>규격</Label>
                          <Input
                            value={newPart.specification}
                            onChange={(e) => setNewPart({ ...newPart, specification: e.target.value })}
                            placeholder="φ3.0 / SKD61"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>단위</Label>
                          <Select value={newPart.unit} onValueChange={(v) => setNewPart({ ...newPart, unit: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNITS.map((u) => (
                                <SelectItem key={u} value={u}>
                                  {u}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>현재고</Label>
                          <Input
                            type="number"
                            value={newPart.currentStock}
                            onChange={(e) =>
                              setNewPart({ ...newPart, currentStock: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>안전재고</Label>
                          <Input
                            type="number"
                            value={newPart.safetyStock}
                            onChange={(e) =>
                              setNewPart({ ...newPart, safetyStock: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>단가 (원)</Label>
                          <Input
                            type="number"
                            value={newPart.unitPrice}
                            onChange={(e) =>
                              setNewPart({ ...newPart, unitPrice: parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>위치(보관처)</Label>
                          <Input
                            value={newPart.location}
                            onChange={(e) => setNewPart({ ...newPart, location: e.target.value })}
                            placeholder="A-01-02"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>비고</Label>
                          <Textarea
                            value={newPart.remarks}
                            onChange={(e) => setNewPart({ ...newPart, remarks: e.target.value })}
                            placeholder="특이사항 입력"
                            rows={1}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>
                          취소
                        </Button>
                        <Button onClick={handleAddPart}>
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="relative mb-4 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="품목명 / 차종 / 금형번호로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>품목코드</TableHead>
                        <TableHead>품목명</TableHead>
                        <TableHead>적용금형</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead className="text-center">단위</TableHead>
                        <TableHead className="text-center">현재고</TableHead>
                        <TableHead className="text-center">안전재고</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                        <TableHead className="text-right">단가</TableHead>
                        <TableHead>위치</TableHead>
                        <TableHead className="text-center">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={11} className="py-8 text-center text-muted-foreground">
                            등록된 스페어파트가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParts.map((part) => (
                          <TableRow key={part.id} className={isLow(part) ? "bg-red-50" : ""}>
                            <TableCell className="font-mono">{part.partCode}</TableCell>
                            <TableCell className="font-medium">{part.partName}</TableCell>
                            <TableCell>
                              <div className="text-sm">{part.vehicle}</div>
                              <div className="font-mono text-xs text-muted-foreground">{part.moldNo}</div>
                            </TableCell>
                            <TableCell>{part.specification}</TableCell>
                            <TableCell className="text-center">{part.unit}</TableCell>
                            <TableCell className="text-center font-semibold">{part.currentStock}</TableCell>
                            <TableCell className="text-center">{part.safetyStock}</TableCell>
                            <TableCell className="text-center">
                              {isLow(part) ? (
                                <Badge variant="destructive">부족</Badge>
                              ) : (
                                <Badge variant="success">정상</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">{won(part.unitPrice)}</TableCell>
                            <TableCell className="font-mono text-sm">{part.location}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="sm" onClick={() => handleRemovePart(part.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 탭 2: 입출고 이력 */}
            <TabsContent value="history" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5" />
                    입출고 등록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>품목 *</Label>
                      <Select
                        value={movement.partId ? movement.partId.toString() : ""}
                        onValueChange={(v) => setMovement({ ...movement, partId: parseInt(v) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="품목 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {parts.map((part) => (
                            <SelectItem key={part.id} value={part.id.toString()}>
                              {part.partName} ({part.partCode}) · 재고 {part.currentStock}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>구분 *</Label>
                      <Select
                        value={movement.type}
                        onValueChange={(v) => setMovement({ ...movement, type: v as "in" | "out" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
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
                        value={movement.quantity}
                        onChange={(e) =>
                          setMovement({ ...movement, quantity: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>일자</Label>
                      <Input
                        type="date"
                        value={movement.date}
                        onChange={(e) => setMovement({ ...movement, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Input
                        value={movement.worker}
                        onChange={(e) => setMovement({ ...movement, worker: e.target.value })}
                        placeholder="담당자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>사유 / 비고</Label>
                      <Input
                        value={movement.reason}
                        onChange={(e) => setMovement({ ...movement, reason: e.target.value })}
                        placeholder="교체 사유, 발주 입고 등"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSaveMovement}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="h-5 w-5" />
                    입출고 이력
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>일자</TableHead>
                        <TableHead>품목명</TableHead>
                        <TableHead className="text-center">구분</TableHead>
                        <TableHead className="text-center">수량</TableHead>
                        <TableHead>사유</TableHead>
                        <TableHead>담당자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                            입출고 이력이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        history.map((h) => {
                          const part = parts.find((p) => p.id === h.partId);
                          return (
                            <TableRow key={h.id}>
                              <TableCell>{h.date}</TableCell>
                              <TableCell className="font-medium">{part?.partName || "-"}</TableCell>
                              <TableCell className="text-center">
                                {h.type === "in" ? (
                                  <Badge variant="success">입고</Badge>
                                ) : (
                                  <Badge className="border-transparent bg-orange-100 text-orange-800">출고</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center font-semibold">
                                {h.type === "in" ? "+" : "-"}
                                {h.quantity}
                              </TableCell>
                              <TableCell>{h.reason || "-"}</TableCell>
                              <TableCell>{h.worker || "-"}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
