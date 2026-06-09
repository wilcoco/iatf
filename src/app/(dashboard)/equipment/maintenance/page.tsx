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
import { Wrench, Plus, Save, Calendar, ClipboardList, FileCheck, BarChart3, Search, AlertTriangle } from "lucide-react";

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

// Patrol Inspection Types
interface PatrolInspectionItem {
  id: string;
  category: string;
  item: string;
}

interface PatrolInspection {
  id: number;
  inspectionDate: string;
  inspectionTime: string;
  patrolArea: string;
  inspector: string;
  items: {
    itemId: string;
    result: "normal" | "abnormal";
    action?: string;
  }[];
  remarks: string;
}

// Equipment Anomaly Report Types
interface AnomalyReport {
  id: number;
  reportDate: string;
  reportTime: string;
  equipmentId: string;
  equipmentName: string;
  anomalyDescription: string;
  emergencyAction: string;
  rootCause: string;
  permanentSolution: string;
  reporter: string;
  status: "open" | "in-progress" | "resolved";
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

// Patrol Inspection Items (standard checklist)
const PATROL_INSPECTION_ITEMS: PatrolInspectionItem[] = [
  { id: "PI-001", category: "소음", item: "이상소음" },
  { id: "PI-002", category: "진동", item: "비정상 진동" },
  { id: "PI-003", category: "누유", item: "오일/유압 누출" },
  { id: "PI-004", category: "온도", item: "과열 여부" },
  { id: "PI-005", category: "전기", item: "전기 접촉 이상" },
  { id: "PI-006", category: "외관", item: "외관 손상/파손" },
  { id: "PI-007", category: "청결", item: "오염/이물질" },
  { id: "PI-008", category: "안전", item: "안전장치 작동" },
];

// Patrol Areas (Lines)
const PATROL_AREAS = ["A라인", "B라인", "C라인", "조립라인", "검사라인"];

// Sample patrol inspections
const initialPatrolInspections: PatrolInspection[] = [
  {
    id: 1,
    inspectionDate: "2026-06-10",
    inspectionTime: "09:00",
    patrolArea: "A라인",
    inspector: "김철수",
    items: [
      { itemId: "PI-001", result: "normal" },
      { itemId: "PI-002", result: "normal" },
      { itemId: "PI-003", result: "normal" },
      { itemId: "PI-004", result: "normal" },
      { itemId: "PI-005", result: "normal" },
      { itemId: "PI-006", result: "normal" },
      { itemId: "PI-007", result: "normal" },
      { itemId: "PI-008", result: "normal" },
    ],
    remarks: "",
  },
  {
    id: 2,
    inspectionDate: "2026-06-10",
    inspectionTime: "09:30",
    patrolArea: "B라인",
    inspector: "이영희",
    items: [
      { itemId: "PI-001", result: "abnormal", action: "프레스 #1 이상소음 발생, 설비이상보고서 작성" },
      { itemId: "PI-002", result: "normal" },
      { itemId: "PI-003", result: "abnormal", action: "용접기 #1 미세 누유 확인, 모니터링 중" },
      { itemId: "PI-004", result: "normal" },
      { itemId: "PI-005", result: "normal" },
      { itemId: "PI-006", result: "normal" },
      { itemId: "PI-007", result: "normal" },
      { itemId: "PI-008", result: "normal" },
    ],
    remarks: "B라인 프레스 이상 발견",
  },
  {
    id: 3,
    inspectionDate: "2026-06-09",
    inspectionTime: "09:00",
    patrolArea: "A라인",
    inspector: "김철수",
    items: [
      { itemId: "PI-001", result: "normal" },
      { itemId: "PI-002", result: "normal" },
      { itemId: "PI-003", result: "normal" },
      { itemId: "PI-004", result: "normal" },
      { itemId: "PI-005", result: "normal" },
      { itemId: "PI-006", result: "normal" },
      { itemId: "PI-007", result: "normal" },
      { itemId: "PI-008", result: "normal" },
    ],
    remarks: "",
  },
];

// Sample anomaly reports
const initialAnomalyReports: AnomalyReport[] = [
  {
    id: 1,
    reportDate: "2026-06-10",
    reportTime: "09:35",
    equipmentId: "EQ-003",
    equipmentName: "프레스 #1",
    anomalyDescription: "가동 중 이상소음 발생. 금속 마찰음으로 추정되는 소리가 간헐적으로 발생함.",
    emergencyAction: "설비 가동 중단 후 안전구역 확보. 윤활유 주입 시도.",
    rootCause: "베어링 마모로 인한 소음 발생 (분석 중)",
    permanentSolution: "베어링 교체 예정 (6/12)",
    reporter: "이영희",
    status: "in-progress",
  },
  {
    id: 2,
    reportDate: "2026-06-05",
    reportTime: "14:20",
    equipmentId: "EQ-001",
    equipmentName: "CNC 선반 #1",
    anomalyDescription: "절연저항 저하로 인한 누전차단기 작동",
    emergencyAction: "전원 차단 후 습기 제거 작업 실시",
    rootCause: "우기로 인한 습기 유입",
    permanentSolution: "절연 보강 및 방습 커버 설치 완료",
    reporter: "김철수",
    status: "resolved",
  },
];

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("annual-plan");
  const [equipments] = useState<Equipment[]>(initialEquipments);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>(initialAnnualPlans);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>(initialInspectionItems);
  const [inspectionResults, setInspectionResults] = useState<InspectionResult[]>(initialInspectionResults);
  const [patrolInspections, setPatrolInspections] = useState<PatrolInspection[]>(initialPatrolInspections);
  const [anomalyReports, setAnomalyReports] = useState<AnomalyReport[]>(initialAnomalyReports);

  // Header filter state
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  // Form states
  const [showItemForm, setShowItemForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [showPatrolForm, setShowPatrolForm] = useState(false);
  const [showAnomalyForm, setShowAnomalyForm] = useState(false);

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

  const [newPatrol, setNewPatrol] = useState<Omit<PatrolInspection, "id">>({
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionTime: new Date().toTimeString().slice(0, 5),
    patrolArea: "",
    inspector: "",
    items: PATROL_INSPECTION_ITEMS.map(item => ({ itemId: item.id, result: "normal" as const })),
    remarks: "",
  });

  const [newAnomaly, setNewAnomaly] = useState<Omit<AnomalyReport, "id">>({
    reportDate: new Date().toISOString().split("T")[0],
    reportTime: new Date().toTimeString().slice(0, 5),
    equipmentId: "",
    equipmentName: "",
    anomalyDescription: "",
    emergencyAction: "",
    rootCause: "",
    permanentSolution: "",
    reporter: "",
    status: "open",
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

  // Tab 5: Patrol Inspection (보전패트롤점검)
  const PatrolInspectionTab = () => {
    const [selectedPatrolArea, setSelectedPatrolArea] = useState<string>("all");
    const [selectedPatrolDate, setSelectedPatrolDate] = useState<string>("");

    const filteredPatrols = patrolInspections.filter(p => {
      const areaMatch = selectedPatrolArea === "all" || p.patrolArea === selectedPatrolArea;
      const dateMatch = !selectedPatrolDate || p.inspectionDate === selectedPatrolDate;
      return areaMatch && dateMatch;
    });

    const handlePatrolItemResultChange = (itemId: string, result: "normal" | "abnormal") => {
      setNewPatrol(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.itemId === itemId ? { ...item, result, action: result === "normal" ? "" : item.action } : item
        ),
      }));
    };

    const handlePatrolItemActionChange = (itemId: string, action: string) => {
      setNewPatrol(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.itemId === itemId ? { ...item, action } : item
        ),
      }));
    };

    const handleAddPatrol = () => {
      if (!newPatrol.patrolArea || !newPatrol.inspector) {
        alert("순회구역과 점검자를 입력해주세요.");
        return;
      }
      const newPatrolInspection: PatrolInspection = {
        id: Date.now(),
        ...newPatrol,
      };
      setPatrolInspections([newPatrolInspection, ...patrolInspections]);
      setNewPatrol({
        inspectionDate: new Date().toISOString().split("T")[0],
        inspectionTime: new Date().toTimeString().slice(0, 5),
        patrolArea: "",
        inspector: "",
        items: PATROL_INSPECTION_ITEMS.map(item => ({ itemId: item.id, result: "normal" as const })),
        remarks: "",
      });
      setShowPatrolForm(false);
      alert("패트롤점검이 등록되었습니다.");
    };

    const getAbnormalCount = (patrol: PatrolInspection) => {
      return patrol.items.filter(item => item.result === "abnormal").length;
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            보전패트롤점검표 (일간)
          </CardTitle>
          <Button onClick={() => setShowPatrolForm(!showPatrolForm)}>
            <Plus className="mr-2 h-4 w-4" />
            점검 등록
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filter Section */}
          <div className="mb-6 flex gap-4">
            <div className="space-y-2">
              <Label>순회구역</Label>
              <Select value={selectedPatrolArea} onValueChange={setSelectedPatrolArea}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {PATROL_AREAS.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>점검일</Label>
              <Input
                type="date"
                value={selectedPatrolDate}
                onChange={(e) => setSelectedPatrolDate(e.target.value)}
                className="w-[180px]"
              />
            </div>
            {selectedPatrolDate && (
              <div className="flex items-end">
                <Button variant="ghost" onClick={() => setSelectedPatrolDate("")}>초기화</Button>
              </div>
            )}
          </div>

          {showPatrolForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">패트롤점검 등록</h4>
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <div className="space-y-2">
                  <Label>점검일 *</Label>
                  <Input
                    type="date"
                    value={newPatrol.inspectionDate}
                    onChange={(e) => setNewPatrol({ ...newPatrol, inspectionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검시간 *</Label>
                  <Input
                    type="time"
                    value={newPatrol.inspectionTime}
                    onChange={(e) => setNewPatrol({ ...newPatrol, inspectionTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>순회구역 (라인별) *</Label>
                  <Select value={newPatrol.patrolArea} onValueChange={(v) => setNewPatrol({ ...newPatrol, patrolArea: v })}>
                    <SelectTrigger><SelectValue placeholder="구역 선택" /></SelectTrigger>
                    <SelectContent>
                      {PATROL_AREAS.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검자 *</Label>
                  <Input
                    value={newPatrol.inspector}
                    onChange={(e) => setNewPatrol({ ...newPatrol, inspector: e.target.value })}
                    placeholder="점검자명"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label className="mb-2 block">점검항목</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">분류</TableHead>
                      <TableHead>점검항목</TableHead>
                      <TableHead className="w-32 text-center">점검결과</TableHead>
                      <TableHead>이상 발견시 조치내용</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PATROL_INSPECTION_ITEMS.map((item) => {
                      const patrolItem = newPatrol.items.find(i => i.itemId === item.id);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.item}</TableCell>
                          <TableCell className="text-center">
                            <Select
                              value={patrolItem?.result || "normal"}
                              onValueChange={(v) => handlePatrolItemResultChange(item.id, v as "normal" | "abnormal")}
                            >
                              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">정상</SelectItem>
                                <SelectItem value="abnormal">이상</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {patrolItem?.result === "abnormal" && (
                              <Input
                                value={patrolItem?.action || ""}
                                onChange={(e) => handlePatrolItemActionChange(item.id, e.target.value)}
                                placeholder="조치내용 입력"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 mb-4">
                <Label>비고</Label>
                <Textarea
                  value={newPatrol.remarks}
                  onChange={(e) => setNewPatrol({ ...newPatrol, remarks: e.target.value })}
                  placeholder="추가 메모"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPatrolForm(false)}>취소</Button>
                <Button onClick={handleAddPatrol}><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>점검일</TableHead>
                <TableHead>점검시간</TableHead>
                <TableHead>순회구역</TableHead>
                <TableHead>점검자</TableHead>
                <TableHead className="text-center">정상</TableHead>
                <TableHead className="text-center">이상</TableHead>
                <TableHead>비고</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatrols.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    등록된 패트롤점검이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatrols.map((patrol) => {
                  const abnormalCount = getAbnormalCount(patrol);
                  const normalCount = patrol.items.length - abnormalCount;
                  return (
                    <TableRow key={patrol.id}>
                      <TableCell>{patrol.inspectionDate}</TableCell>
                      <TableCell>{patrol.inspectionTime}</TableCell>
                      <TableCell className="font-medium">{patrol.patrolArea}</TableCell>
                      <TableCell>{patrol.inspector}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{normalCount}</TableCell>
                      <TableCell className="text-center text-red-600 font-medium">{abnormalCount}</TableCell>
                      <TableCell>{patrol.remarks || "-"}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={abnormalCount > 0 ? "destructive" : "success"}>
                          {abnormalCount > 0 ? "이상발견" : "정상"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Legend */}
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium mb-2">점검항목:</p>
            <div className="flex flex-wrap gap-4">
              {PATROL_INSPECTION_ITEMS.map(item => (
                <span key={item.id}>{item.category}: {item.item}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tab 6: Equipment Anomaly Report (설비이상보고서)
  const AnomalyReportTab = () => {
    const [selectedReportStatus, setSelectedReportStatus] = useState<string>("all");

    const filteredReports = anomalyReports.filter(r => {
      const statusMatch = selectedReportStatus === "all" || r.status === selectedReportStatus;
      const equipmentMatch = !selectedEquipment || selectedEquipment === "all" || r.equipmentId === selectedEquipment;
      return statusMatch && equipmentMatch;
    });

    const handleEquipmentSelect = (equipmentId: string) => {
      const equipment = equipments.find(e => e.id === equipmentId);
      setNewAnomaly({
        ...newAnomaly,
        equipmentId,
        equipmentName: equipment?.name || "",
      });
    };

    const handleAddAnomaly = () => {
      if (!newAnomaly.equipmentId || !newAnomaly.anomalyDescription || !newAnomaly.reporter) {
        alert("설비, 이상내용, 보고자를 입력해주세요.");
        return;
      }
      const newAnomalyReport: AnomalyReport = {
        id: Date.now(),
        ...newAnomaly,
      };
      setAnomalyReports([newAnomalyReport, ...anomalyReports]);
      setNewAnomaly({
        reportDate: new Date().toISOString().split("T")[0],
        reportTime: new Date().toTimeString().slice(0, 5),
        equipmentId: "",
        equipmentName: "",
        anomalyDescription: "",
        emergencyAction: "",
        rootCause: "",
        permanentSolution: "",
        reporter: "",
        status: "open",
      });
      setShowAnomalyForm(false);
      alert("설비이상보고서가 등록되었습니다.");
    };

    const handleUpdateStatus = (id: number, status: AnomalyReport["status"]) => {
      setAnomalyReports(prev => prev.map(report =>
        report.id === id ? { ...report, status } : report
      ));
    };

    const getStatusLabel = (status: AnomalyReport["status"]) => {
      switch (status) {
        case "open": return "접수";
        case "in-progress": return "처리중";
        case "resolved": return "완료";
        default: return status;
      }
    };

    const getStatusVariant = (status: AnomalyReport["status"]) => {
      switch (status) {
        case "open": return "destructive";
        case "in-progress": return "secondary";
        case "resolved": return "success";
        default: return "secondary";
      }
    };

    // Summary counts
    const openCount = anomalyReports.filter(r => r.status === "open").length;
    const inProgressCount = anomalyReports.filter(r => r.status === "in-progress").length;
    const resolvedCount = anomalyReports.filter(r => r.status === "resolved").length;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 보고서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{anomalyReports.length}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">접수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{openCount}</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">처리중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">완료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              설비이상보고서
            </CardTitle>
            <Button onClick={() => setShowAnomalyForm(!showAnomalyForm)}>
              <Plus className="mr-2 h-4 w-4" />
              이상 보고
            </Button>
          </CardHeader>
          <CardContent>
            {/* Filter Section */}
            <div className="mb-6 flex gap-4">
              <div className="space-y-2">
                <Label>상태</Label>
                <Select value={selectedReportStatus} onValueChange={setSelectedReportStatus}>
                  <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="open">접수</SelectItem>
                    <SelectItem value="in-progress">처리중</SelectItem>
                    <SelectItem value="resolved">완료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showAnomalyForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-4">설비이상보고서 작성</h4>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="space-y-2">
                    <Label>이상 발생일 *</Label>
                    <Input
                      type="date"
                      value={newAnomaly.reportDate}
                      onChange={(e) => setNewAnomaly({ ...newAnomaly, reportDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>발생시간 *</Label>
                    <Input
                      type="time"
                      value={newAnomaly.reportTime}
                      onChange={(e) => setNewAnomaly({ ...newAnomaly, reportTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설비명 *</Label>
                    <Select value={newAnomaly.equipmentId} onValueChange={handleEquipmentSelect}>
                      <SelectTrigger><SelectValue placeholder="설비 선택" /></SelectTrigger>
                      <SelectContent>
                        {equipments.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>{eq.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>이상내용 *</Label>
                    <Textarea
                      value={newAnomaly.anomalyDescription}
                      onChange={(e) => setNewAnomaly({ ...newAnomaly, anomalyDescription: e.target.value })}
                      placeholder="발생한 이상 현상을 상세히 기록하세요"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>응급조치</Label>
                    <Textarea
                      value={newAnomaly.emergencyAction}
                      onChange={(e) => setNewAnomaly({ ...newAnomaly, emergencyAction: e.target.value })}
                      placeholder="현장에서 취한 응급조치 내용"
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>근본원인</Label>
                      <Textarea
                        value={newAnomaly.rootCause}
                        onChange={(e) => setNewAnomaly({ ...newAnomaly, rootCause: e.target.value })}
                        placeholder="이상 발생의 근본 원인 (분석 후 기록)"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>영구대책</Label>
                      <Textarea
                        value={newAnomaly.permanentSolution}
                        onChange={(e) => setNewAnomaly({ ...newAnomaly, permanentSolution: e.target.value })}
                        placeholder="재발 방지를 위한 영구적 대책"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>보고자 *</Label>
                      <Input
                        value={newAnomaly.reporter}
                        onChange={(e) => setNewAnomaly({ ...newAnomaly, reporter: e.target.value })}
                        placeholder="보고자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>처리상태</Label>
                      <Select
                        value={newAnomaly.status}
                        onValueChange={(v) => setNewAnomaly({ ...newAnomaly, status: v as AnomalyReport["status"] })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">접수</SelectItem>
                          <SelectItem value="in-progress">처리중</SelectItem>
                          <SelectItem value="resolved">완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAnomalyForm(false)}>취소</Button>
                  <Button onClick={handleAddAnomaly}><Save className="mr-2 h-4 w-4" />저장</Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>발생일시</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>이상내용</TableHead>
                  <TableHead>응급조치</TableHead>
                  <TableHead>근본원인</TableHead>
                  <TableHead>영구대책</TableHead>
                  <TableHead>보고자</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      등록된 이상보고서가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="whitespace-nowrap">
                        {report.reportDate}<br />
                        <span className="text-muted-foreground text-sm">{report.reportTime}</span>
                      </TableCell>
                      <TableCell className="font-medium">{report.equipmentName}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={report.anomalyDescription}>
                          {report.anomalyDescription}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="truncate" title={report.emergencyAction}>
                          {report.emergencyAction || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="truncate" title={report.rootCause}>
                          {report.rootCause || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="truncate" title={report.permanentSolution}>
                          {report.permanentSolution || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{report.reporter}</TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={report.status}
                          onValueChange={(v) => handleUpdateStatus(report.id, v as AnomalyReport["status"])}
                        >
                          <SelectTrigger className="w-[100px]">
                            <Badge variant={getStatusVariant(report.status)}>
                              {getStatusLabel(report.status)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">접수</SelectItem>
                            <SelectItem value="in-progress">처리중</SelectItem>
                            <SelectItem value="resolved">완료</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
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
