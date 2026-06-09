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
import { Wrench, Plus, Save, Calendar, ClipboardList, FileCheck, BarChart3 } from "lucide-react";

// Types
interface Equipment {
  id: string;
  name: string;
  managementNo: string;
  inspectionCycle: string;
  manager: string;
  line: string;
}

interface AnnualPlan {
  equipmentId: string;
  equipmentName: string;
  line: string;
  monthlyPlan: { [month: number]: boolean };
  monthlyResult: { [month: number]: boolean };
}

interface InspectionItem {
  id: number;
  equipmentId: string;
  part: string;
  item: string;
  standard: string;
  method: string;
  cycle: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
}

interface InspectionResult {
  id: number;
  equipmentId: string;
  inspectionItemId: number;
  inspectionDate: string;
  inspector: string;
  result: "good" | "bad";
  action: string;
  remarks: string;
}

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const CYCLE_LABELS: { [key: string]: string } = {
  daily: "일",
  weekly: "주",
  monthly: "월",
  quarterly: "분기",
  yearly: "년",
};

// Sample equipment data
const initialEquipments: Equipment[] = [
  { id: "EQ-001", name: "CNC 선반 #1", managementNo: "M-2024-001", inspectionCycle: "월간", manager: "김철수", line: "A라인" },
  { id: "EQ-002", name: "밀링머신 #2", managementNo: "M-2024-002", inspectionCycle: "주간", manager: "이영희", line: "A라인" },
  { id: "EQ-003", name: "프레스 #1", managementNo: "M-2024-003", inspectionCycle: "월간", manager: "박민수", line: "B라인" },
  { id: "EQ-004", name: "용접기 #1", managementNo: "M-2024-004", inspectionCycle: "분기", manager: "최지은", line: "B라인" },
];

// Sample annual plans
const initialAnnualPlans: AnnualPlan[] = [
  {
    equipmentId: "EQ-001",
    equipmentName: "CNC 선반 #1",
    line: "A라인",
    monthlyPlan: { 1: true, 3: true, 5: true, 7: true, 9: true, 11: true },
    monthlyResult: { 1: true, 3: true, 5: true },
  },
  {
    equipmentId: "EQ-002",
    equipmentName: "밀링머신 #2",
    line: "A라인",
    monthlyPlan: { 2: true, 4: true, 6: true, 8: true, 10: true, 12: true },
    monthlyResult: { 2: true, 4: true },
  },
  {
    equipmentId: "EQ-003",
    equipmentName: "프레스 #1",
    line: "B라인",
    monthlyPlan: { 1: true, 4: true, 7: true, 10: true },
    monthlyResult: { 1: true, 4: true },
  },
  {
    equipmentId: "EQ-004",
    equipmentName: "용접기 #1",
    line: "B라인",
    monthlyPlan: { 3: true, 6: true, 9: true, 12: true },
    monthlyResult: { 3: true, 6: true },
  },
];

// Sample inspection items
const initialInspectionItems: InspectionItem[] = [
  { id: 1, equipmentId: "EQ-001", part: "주축", item: "베어링 상태", standard: "이상음 없음", method: "청음검사", cycle: "daily" },
  { id: 2, equipmentId: "EQ-001", part: "윤활", item: "오일량", standard: "상한선 이상", method: "육안검사", cycle: "daily" },
  { id: 3, equipmentId: "EQ-001", part: "전기계통", item: "절연저항", standard: "1MΩ 이상", method: "메가측정", cycle: "monthly" },
  { id: 4, equipmentId: "EQ-002", part: "스핀들", item: "진동", standard: "0.5mm/s 이하", method: "진동측정기", cycle: "weekly" },
  { id: 5, equipmentId: "EQ-003", part: "유압", item: "압력", standard: "150~180 bar", method: "게이지확인", cycle: "daily" },
];

// Sample inspection results
const initialInspectionResults: InspectionResult[] = [
  { id: 1, equipmentId: "EQ-001", inspectionItemId: 1, inspectionDate: "2026-06-09", inspector: "김철수", result: "good", action: "", remarks: "" },
  { id: 2, equipmentId: "EQ-001", inspectionItemId: 2, inspectionDate: "2026-06-09", inspector: "김철수", result: "good", action: "", remarks: "" },
  { id: 3, equipmentId: "EQ-001", inspectionItemId: 3, inspectionDate: "2026-06-01", inspector: "김철수", result: "bad", action: "절연 처리 완료", remarks: "습기 유입으로 저하" },
];

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("annual-plan");
  const [equipments] = useState<Equipment[]>(initialEquipments);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>(initialAnnualPlans);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(initialInspectionItems);
  const [inspectionResults, setInspectionResults] = useState<InspectionResult[]>(initialInspectionResults);

  // Header filter state
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  // Form states
  const [showItemForm, setShowItemForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);

  const [newItem, setNewItem] = useState<Omit<InspectionItem, "id">>({
    equipmentId: "",
    part: "",
    item: "",
    standard: "",
    method: "",
    cycle: "daily",
  });

  const [newResult, setNewResult] = useState<Omit<InspectionResult, "id">>({
    equipmentId: "",
    inspectionItemId: 0,
    inspectionDate: new Date().toISOString().split("T")[0],
    inspector: "",
    result: "good",
    action: "",
    remarks: "",
  });

  // Header Component
  const HeaderSection = () => {
    const equipment = equipments.find(e => e.id === selectedEquipment);
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            예방보전 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>설비 선택</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger><SelectValue placeholder="설비 선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {equipments.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>관리번호</Label>
              <Input value={equipment?.managementNo || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>점검주기</Label>
              <Input value={equipment?.inspectionCycle || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>담당자</Label>
              <Input value={equipment?.manager || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>년도</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024년</SelectItem>
                  <SelectItem value="2025">2025년</SelectItem>
                  <SelectItem value="2026">2026년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tab 1: Annual Plan
  const AnnualPlanTab = () => {
    const filteredPlans = selectedEquipment && selectedEquipment !== "all"
      ? annualPlans.filter(p => p.equipmentId === selectedEquipment)
      : annualPlans;

    const togglePlan = (equipmentId: string, month: number) => {
      setAnnualPlans(prev => prev.map(plan => {
        if (plan.equipmentId === equipmentId) {
          const newMonthlyPlan = { ...plan.monthlyPlan };
          if (newMonthlyPlan[month]) {
            delete newMonthlyPlan[month];
          } else {
            newMonthlyPlan[month] = true;
          }
          return { ...plan, monthlyPlan: newMonthlyPlan };
        }
        return plan;
      }));
    };

    const toggleResult = (equipmentId: string, month: number) => {
      setAnnualPlans(prev => prev.map(plan => {
        if (plan.equipmentId === equipmentId) {
          const newMonthlyResult = { ...plan.monthlyResult };
          if (newMonthlyResult[month]) {
            delete newMonthlyResult[month];
          } else {
            newMonthlyResult[month] = true;
          }
          return { ...plan, monthlyResult: newMonthlyResult };
        }
        return plan;
      }));
    };

    // Group by line
    const lines = [...new Set(filteredPlans.map(p => p.line))];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {selectedYear}년 예방보전 계획
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">라인</TableHead>
                  <TableHead className="w-40">설비명</TableHead>
                  <TableHead className="w-16 text-center">구분</TableHead>
                  {MONTHS.map((month, idx) => (
                    <TableHead key={idx} className="w-12 text-center">{month}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map(line => {
                  const linePlans = filteredPlans.filter(p => p.line === line);
                  return linePlans.map((plan, planIdx) => (
                    <>
                      <TableRow key={`${plan.equipmentId}-plan`}>
                        {planIdx === 0 && (
                          <TableCell rowSpan={linePlans.length * 2} className="font-medium bg-muted/50 align-middle">
                            {line}
                          </TableCell>
                        )}
                        <TableCell rowSpan={2} className="font-medium align-middle">
                          {plan.equipmentName}
                        </TableCell>
                        <TableCell className="text-center text-sm bg-blue-50">계획</TableCell>
                        {MONTHS.map((_, idx) => (
                          <TableCell
                            key={idx}
                            className="text-center cursor-pointer hover:bg-blue-100 bg-blue-50"
                            onClick={() => togglePlan(plan.equipmentId, idx + 1)}
                          >
                            {plan.monthlyPlan[idx + 1] && (
                              <span className="text-blue-600 font-bold text-lg">○</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow key={`${plan.equipmentId}-result`}>
                        <TableCell className="text-center text-sm bg-green-50">실적</TableCell>
                        {MONTHS.map((_, idx) => (
                          <TableCell
                            key={idx}
                            className="text-center cursor-pointer hover:bg-green-100 bg-green-50"
                            onClick={() => toggleResult(plan.equipmentId, idx + 1)}
                          >
                            {plan.monthlyResult[idx + 1] && (
                              <span className="text-green-600 font-bold text-lg">●</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </>
                  ));
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-blue-600 font-bold">○</span> 계획
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-600 font-bold">●</span> 실적
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tab 2: Inspection Items Setup
  const InspectionItemsTab = () => {
    const filteredItems = selectedEquipment && selectedEquipment !== "all"
      ? inspectionItems.filter(i => i.equipmentId === selectedEquipment)
      : inspectionItems;

    const handleAddItem = () => {
      if (!newItem.equipmentId || !newItem.part || !newItem.item) {
        alert("필수 항목을 입력해주세요.");
        return;
      }
      const newInspectionItem: InspectionItem = {
        id: Date.now(),
        ...newItem,
      };
      setInspectionItems([...inspectionItems, newInspectionItem]);
      setNewItem({
        equipmentId: "",
        part: "",
        item: "",
        standard: "",
        method: "",
        cycle: "daily",
      });
      setShowItemForm(false);
      alert("점검항목이 등록되었습니다.");
    };

    const handleDeleteItem = (id: number) => {
      if (confirm("이 점검항목을 삭제하시겠습니까?")) {
        setInspectionItems(inspectionItems.filter(i => i.id !== id));
      }
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            점검항목 설정
          </CardTitle>
          <Button onClick={() => setShowItemForm(!showItemForm)}>
            <Plus className="mr-2 h-4 w-4" />
            항목 추가
          </Button>
        </CardHeader>
        <CardContent>
          {showItemForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">점검항목 등록</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>설비 *</Label>
                  <Select value={newItem.equipmentId} onValueChange={(v) => setNewItem({ ...newItem, equipmentId: v })}>
                    <SelectTrigger><SelectValue placeholder="설비 선택" /></SelectTrigger>
                    <SelectContent>
                      {equipments.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검부위 *</Label>
                  <Input
                    value={newItem.part}
                    onChange={(e) => setNewItem({ ...newItem, part: e.target.value })}
                    placeholder="예: 주축, 윤활, 전기계통"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검항목 *</Label>
                  <Input
                    value={newItem.item}
                    onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                    placeholder="예: 베어링 상태"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검기준</Label>
                  <Input
                    value={newItem.standard}
                    onChange={(e) => setNewItem({ ...newItem, standard: e.target.value })}
                    placeholder="예: 이상음 없음"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검방법</Label>
                  <Input
                    value={newItem.method}
                    onChange={(e) => setNewItem({ ...newItem, method: e.target.value })}
                    placeholder="예: 청음검사"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검주기</Label>
                  <Select value={newItem.cycle} onValueChange={(v) => setNewItem({ ...newItem, cycle: v as InspectionItem["cycle"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">일</SelectItem>
                      <SelectItem value="weekly">주</SelectItem>
                      <SelectItem value="monthly">월</SelectItem>
                      <SelectItem value="quarterly">분기</SelectItem>
                      <SelectItem value="yearly">년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowItemForm(false)}>취소</Button>
                <Button onClick={handleAddItem}><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>설비명</TableHead>
                <TableHead>점검부위</TableHead>
                <TableHead>점검항목</TableHead>
                <TableHead>점검기준</TableHead>
                <TableHead>점검방법</TableHead>
                <TableHead className="text-center">점검주기</TableHead>
                <TableHead className="text-center">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    등록된 점검항목이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const equipment = equipments.find(e => e.id === item.equipmentId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{equipment?.name || item.equipmentId}</TableCell>
                      <TableCell>{item.part}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.standard}</TableCell>
                      <TableCell>{item.method}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{CYCLE_LABELS[item.cycle]}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                          삭제
                        </Button>
                      </TableCell>
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

  // Tab 3: Inspection Results Entry
  const InspectionResultsTab = () => {
    const filteredResults = selectedEquipment && selectedEquipment !== "all"
      ? inspectionResults.filter(r => r.equipmentId === selectedEquipment)
      : inspectionResults;

    const getInspectionItemsForEquipment = (equipmentId: string) => {
      return inspectionItems.filter(i => i.equipmentId === equipmentId);
    };

    const handleAddResult = () => {
      if (!newResult.equipmentId || !newResult.inspectionItemId || !newResult.inspector) {
        alert("필수 항목을 입력해주세요.");
        return;
      }
      const newInspectionResult: InspectionResult = {
        id: Date.now(),
        ...newResult,
      };
      setInspectionResults([newInspectionResult, ...inspectionResults]);
      setNewResult({
        equipmentId: "",
        inspectionItemId: 0,
        inspectionDate: new Date().toISOString().split("T")[0],
        inspector: "",
        result: "good",
        action: "",
        remarks: "",
      });
      setShowResultForm(false);
      alert("점검결과가 등록되었습니다.");
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            점검 실적 입력
          </CardTitle>
          <Button onClick={() => setShowResultForm(!showResultForm)}>
            <Plus className="mr-2 h-4 w-4" />
            실적 입력
          </Button>
        </CardHeader>
        <CardContent>
          {showResultForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">점검결과 등록</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>점검일 *</Label>
                  <Input
                    type="date"
                    value={newResult.inspectionDate}
                    onChange={(e) => setNewResult({ ...newResult, inspectionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비 *</Label>
                  <Select
                    value={newResult.equipmentId}
                    onValueChange={(v) => setNewResult({ ...newResult, equipmentId: v, inspectionItemId: 0 })}
                  >
                    <SelectTrigger><SelectValue placeholder="설비 선택" /></SelectTrigger>
                    <SelectContent>
                      {equipments.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검항목 *</Label>
                  {!newResult.equipmentId ? (
                    <Select value="" onValueChange={() => {}}>
                      <SelectTrigger className="opacity-50"><SelectValue placeholder="먼저 설비를 선택하세요" /></SelectTrigger>
                      <SelectContent><SelectItem value="_">-</SelectItem></SelectContent>
                    </Select>
                  ) : (
                  <Select
                    value={newResult.inspectionItemId.toString()}
                    onValueChange={(v) => setNewResult({ ...newResult, inspectionItemId: parseInt(v) })}
                  >
                    <SelectTrigger><SelectValue placeholder="점검항목 선택" /></SelectTrigger>
                    <SelectContent>
                      {getInspectionItemsForEquipment(newResult.equipmentId).map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.part} - {item.item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>점검자 *</Label>
                  <Input
                    value={newResult.inspector}
                    onChange={(e) => setNewResult({ ...newResult, inspector: e.target.value })}
                    placeholder="점검자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검결과 *</Label>
                  <Select
                    value={newResult.result}
                    onValueChange={(v) => setNewResult({ ...newResult, result: v as "good" | "bad" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">양호</SelectItem>
                      <SelectItem value="bad">불량</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>조치내용</Label>
                  <Input
                    value={newResult.action}
                    onChange={(e) => setNewResult({ ...newResult, action: e.target.value })}
                    placeholder="조치내용 (불량 시)"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label>비고</Label>
                <Textarea
                  value={newResult.remarks}
                  onChange={(e) => setNewResult({ ...newResult, remarks: e.target.value })}
                  placeholder="추가 메모"
                  rows={2}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowResultForm(false)}>취소</Button>
                <Button onClick={handleAddResult}><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>점검일</TableHead>
                <TableHead>설비명</TableHead>
                <TableHead>점검항목</TableHead>
                <TableHead>점검자</TableHead>
                <TableHead className="text-center">점검결과</TableHead>
                <TableHead>조치내용</TableHead>
                <TableHead>비고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    등록된 점검결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result) => {
                  const equipment = equipments.find(e => e.id === result.equipmentId);
                  const inspectionItem = inspectionItems.find(i => i.id === result.inspectionItemId);
                  return (
                    <TableRow key={result.id}>
                      <TableCell>{result.inspectionDate}</TableCell>
                      <TableCell className="font-medium">{equipment?.name || result.equipmentId}</TableCell>
                      <TableCell>
                        {inspectionItem ? `${inspectionItem.part} - ${inspectionItem.item}` : "-"}
                      </TableCell>
                      <TableCell>{result.inspector}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={result.result === "good" ? "success" : "destructive"}>
                          {result.result === "good" ? "양호" : "불량"}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.action || "-"}</TableCell>
                      <TableCell>{result.remarks || "-"}</TableCell>
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

  // Tab 4: Equipment Status Summary
  const EquipmentStatusTab = () => {
    const getEquipmentStats = (equipmentId: string) => {
      const equipmentResults = inspectionResults.filter(r => r.equipmentId === equipmentId);
      const totalInspections = equipmentResults.length;
      const goodCount = equipmentResults.filter(r => r.result === "good").length;
      const badCount = equipmentResults.filter(r => r.result === "bad").length;
      const rate = totalInspections > 0 ? Math.round((goodCount / totalInspections) * 100) : 0;

      const plan = annualPlans.find(p => p.equipmentId === equipmentId);
      const plannedCount = plan ? Object.keys(plan.monthlyPlan).length : 0;
      const completedCount = plan ? Object.keys(plan.monthlyResult).length : 0;
      const planRate = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

      const itemCount = inspectionItems.filter(i => i.equipmentId === equipmentId).length;

      return { totalInspections, goodCount, badCount, rate, plannedCount, completedCount, planRate, itemCount };
    };

    const filteredEquipments = selectedEquipment && selectedEquipment !== "all"
      ? equipments.filter(e => e.id === selectedEquipment)
      : equipments;

    // Summary totals
    const totalStats = filteredEquipments.reduce(
      (acc, eq) => {
        const stats = getEquipmentStats(eq.id);
        return {
          totalInspections: acc.totalInspections + stats.totalInspections,
          goodCount: acc.goodCount + stats.goodCount,
          badCount: acc.badCount + stats.badCount,
          plannedCount: acc.plannedCount + stats.plannedCount,
          completedCount: acc.completedCount + stats.completedCount,
          itemCount: acc.itemCount + stats.itemCount,
        };
      },
      { totalInspections: 0, goodCount: 0, badCount: 0, plannedCount: 0, completedCount: 0, itemCount: 0 }
    );

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 설비 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEquipments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">점검항목 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.itemCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">년간계획 이행률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.plannedCount > 0
                  ? Math.round((totalStats.completedCount / totalStats.plannedCount) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {totalStats.completedCount} / {totalStats.plannedCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">점검 합격률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.totalInspections > 0
                  ? Math.round((totalStats.goodCount / totalStats.totalInspections) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                양호 {totalStats.goodCount} / 불량 {totalStats.badCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Details Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              설비별 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>설비번호</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>라인</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead className="text-center">점검항목</TableHead>
                  <TableHead className="text-center">년간계획</TableHead>
                  <TableHead className="text-center">계획이행률</TableHead>
                  <TableHead className="text-center">점검건수</TableHead>
                  <TableHead className="text-center">합격률</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipments.map((equipment) => {
                  const stats = getEquipmentStats(equipment.id);
                  return (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-mono">{equipment.id}</TableCell>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>{equipment.line}</TableCell>
                      <TableCell>{equipment.manager}</TableCell>
                      <TableCell className="text-center">{stats.itemCount}</TableCell>
                      <TableCell className="text-center">
                        {stats.completedCount} / {stats.plannedCount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={stats.planRate >= 80 ? "success" : stats.planRate >= 50 ? "secondary" : "destructive"}>
                          {stats.planRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{stats.totalInspections}</TableCell>
                      <TableCell className="text-center">
                        {stats.totalInspections > 0 ? (
                          <Badge variant={stats.rate >= 90 ? "success" : stats.rate >= 70 ? "secondary" : "destructive"}>
                            {stats.rate}%
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            stats.badCount > 0 ? "destructive" :
                            stats.planRate >= 80 && stats.rate >= 90 ? "success" : "secondary"
                          }
                        >
                          {stats.badCount > 0 ? "점검필요" : stats.planRate >= 80 ? "양호" : "진행중"}
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">예방보전</h1>
          <p className="text-muted-foreground">설비 예방보전 계획 및 실적 관리</p>
        </div>
      </div>

      <HeaderSection />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="annual-plan">
            <Calendar className="mr-2 h-4 w-4" />
            년간 예방보전 계획
          </TabsTrigger>
          <TabsTrigger value="inspection-items">
            <ClipboardList className="mr-2 h-4 w-4" />
            점검항목 설정
          </TabsTrigger>
          <TabsTrigger value="inspection-results">
            <FileCheck className="mr-2 h-4 w-4" />
            점검 실적 입력
          </TabsTrigger>
          <TabsTrigger value="equipment-status">
            <BarChart3 className="mr-2 h-4 w-4" />
            설비별 현황
          </TabsTrigger>
        </TabsList>

        <TabsContent value="annual-plan">
          <AnnualPlanTab />
        </TabsContent>

        <TabsContent value="inspection-items">
          <InspectionItemsTab />
        </TabsContent>

        <TabsContent value="inspection-results">
          <InspectionResultsTab />
        </TabsContent>

        <TabsContent value="equipment-status">
          <EquipmentStatusTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
