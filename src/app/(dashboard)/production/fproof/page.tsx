"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShieldCheck, Plus, Save, Trash2, Calendar, Settings, History, ClipboardCheck } from "lucide-react";

// Types
interface DailyVerification {
  id: number;
  verificationDate: string;
  equipmentType: string;
  equipmentId: string;
  equipmentName: string;
  verificationItems: string[];
  results: { [key: string]: "OK" | "NG" };
  inspector: string;
  overallResult: "OK" | "NG";
}

interface MonthlyVerification {
  id: number;
  verificationYearMonth: string;
  equipmentList: string[];
  results: { [key: string]: "OK" | "NG" };
  inspector: string;
  verificationDate: string;
  notes: string;
}

interface Equipment {
  id: number;
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  verificationCycle: "daily" | "monthly";
  verificationItems: string[];
  isActive: boolean;
}

interface VerificationHistory {
  id: number;
  date: string;
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  cycleType: "daily" | "monthly";
  result: "OK" | "NG";
  inspector: string;
}

// Equipment types
const dailyEquipmentTypes = [
  { value: "composite", label: "복합기" },
  { value: "electrical", label: "전장검사" },
  { value: "variant", label: "이종검사" },
];

const monthlyEquipmentTypes = [
  { value: "hopper", label: "사출 호퍼" },
  { value: "interlock", label: "인터록" },
];

// Default verification items by equipment type
const defaultVerificationItems: { [key: string]: string[] } = {
  composite: ["센서 작동 확인", "에러 검출 테스트", "복합 검증 기능"],
  electrical: ["전장 연결 상태", "전압 측정", "접지 확인"],
  variant: ["이종품 검출", "식별 정확도", "알람 작동"],
  hopper: ["호퍼 레벨 센서", "투입 감지", "잔량 알람"],
  interlock: ["인터록 작동", "비상정지 연동", "안전 센서"],
};

export default function FproofPage() {
  const [activeTab, setActiveTab] = useState("daily");

  // Daily verification state
  const [dailyVerifications, setDailyVerifications] = useState<DailyVerification[]>([
    {
      id: 1,
      verificationDate: "2026-06-10",
      equipmentType: "composite",
      equipmentId: "CP-001",
      equipmentName: "복합기 1호기",
      verificationItems: ["센서 작동 확인", "에러 검출 테스트", "복합 검증 기능"],
      results: { "센서 작동 확인": "OK", "에러 검출 테스트": "OK", "복합 검증 기능": "OK" },
      inspector: "김철수",
      overallResult: "OK",
    },
    {
      id: 2,
      verificationDate: "2026-06-10",
      equipmentType: "electrical",
      equipmentId: "EL-001",
      equipmentName: "전장검사기 1호기",
      verificationItems: ["전장 연결 상태", "전압 측정", "접지 확인"],
      results: { "전장 연결 상태": "OK", "전압 측정": "NG", "접지 확인": "OK" },
      inspector: "이영희",
      overallResult: "NG",
    },
  ]);

  const [newDailyVerification, setNewDailyVerification] = useState({
    verificationDate: new Date().toISOString().split("T")[0],
    equipmentType: "",
    equipmentId: "",
    equipmentName: "",
    inspector: "",
  });
  const [dailyVerificationItems, setDailyVerificationItems] = useState<{ item: string; result: "OK" | "NG" | "" }[]>([]);

  // Monthly verification state
  const [monthlyVerifications, setMonthlyVerifications] = useState<MonthlyVerification[]>([
    {
      id: 1,
      verificationYearMonth: "2026-06",
      equipmentList: ["사출 호퍼 1호기", "사출 호퍼 2호기", "인터록 A"],
      results: { "사출 호퍼 1호기": "OK", "사출 호퍼 2호기": "OK", "인터록 A": "OK" },
      inspector: "박지성",
      verificationDate: "2026-06-05",
      notes: "정상 작동 확인",
    },
  ]);

  const [newMonthlyVerification, setNewMonthlyVerification] = useState({
    verificationYearMonth: new Date().toISOString().slice(0, 7),
    inspector: "",
    verificationDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [monthlyEquipmentResults, setMonthlyEquipmentResults] = useState<{ name: string; result: "OK" | "NG" | "" }[]>([]);

  // Equipment registration state
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([
    {
      id: 1,
      equipmentId: "CP-001",
      equipmentName: "복합기 1호기",
      equipmentType: "composite",
      verificationCycle: "daily",
      verificationItems: ["센서 작동 확인", "에러 검출 테스트", "복합 검증 기능"],
      isActive: true,
    },
    {
      id: 2,
      equipmentId: "EL-001",
      equipmentName: "전장검사기 1호기",
      equipmentType: "electrical",
      verificationCycle: "daily",
      verificationItems: ["전장 연결 상태", "전압 측정", "접지 확인"],
      isActive: true,
    },
    {
      id: 3,
      equipmentId: "HP-001",
      equipmentName: "사출 호퍼 1호기",
      equipmentType: "hopper",
      verificationCycle: "monthly",
      verificationItems: ["호퍼 레벨 센서", "투입 감지", "잔량 알람"],
      isActive: true,
    },
    {
      id: 4,
      equipmentId: "IL-001",
      equipmentName: "인터록 A",
      equipmentType: "interlock",
      verificationCycle: "monthly",
      verificationItems: ["인터록 작동", "비상정지 연동", "안전 센서"],
      isActive: true,
    },
  ]);

  const [newEquipment, setNewEquipment] = useState({
    equipmentId: "",
    equipmentName: "",
    equipmentType: "",
    verificationCycle: "" as "daily" | "monthly" | "",
  });
  const [newEquipmentItems, setNewEquipmentItems] = useState<string[]>([]);

  // History state
  const [historyFilter, setHistoryFilter] = useState({
    cycleType: "all",
    equipmentId: "",
    startDate: "",
    endDate: "",
  });

  const [verificationHistory] = useState<VerificationHistory[]>([
    { id: 1, date: "2026-06-10", equipmentId: "CP-001", equipmentName: "복합기 1호기", equipmentType: "composite", cycleType: "daily", result: "OK", inspector: "김철수" },
    { id: 2, date: "2026-06-10", equipmentId: "EL-001", equipmentName: "전장검사기 1호기", equipmentType: "electrical", cycleType: "daily", result: "NG", inspector: "이영희" },
    { id: 3, date: "2026-06-09", equipmentId: "CP-001", equipmentName: "복합기 1호기", equipmentType: "composite", cycleType: "daily", result: "OK", inspector: "김철수" },
    { id: 4, date: "2026-06-05", equipmentId: "HP-001", equipmentName: "사출 호퍼 1호기", equipmentType: "hopper", cycleType: "monthly", result: "OK", inspector: "박지성" },
    { id: 5, date: "2026-06-05", equipmentId: "IL-001", equipmentName: "인터록 A", equipmentType: "interlock", cycleType: "monthly", result: "OK", inspector: "박지성" },
    { id: 6, date: "2026-05-05", equipmentId: "HP-001", equipmentName: "사출 호퍼 1호기", equipmentType: "hopper", cycleType: "monthly", result: "OK", inspector: "박지성" },
  ]);

  // Helper functions
  const getEquipmentTypeLabel = (type: string) => {
    const all = [...dailyEquipmentTypes, ...monthlyEquipmentTypes];
    return all.find((t) => t.value === type)?.label || type;
  };

  const getResultBadge = (result: "OK" | "NG" | string) => {
    if (result === "OK") {
      return <Badge className="bg-green-500">OK</Badge>;
    } else if (result === "NG") {
      return <Badge className="bg-red-500">NG</Badge>;
    }
    return <Badge variant="outline">-</Badge>;
  };

  const getCycleLabel = (cycle: "daily" | "monthly") => {
    return cycle === "daily" ? "일간" : "월간";
  };

  // Daily verification handlers
  const handleDailyEquipmentTypeChange = (type: string) => {
    setNewDailyVerification({ ...newDailyVerification, equipmentType: type });
    const items = defaultVerificationItems[type] || [];
    setDailyVerificationItems(items.map((item) => ({ item, result: "" })));
  };

  const updateDailyVerificationResult = (index: number, result: "OK" | "NG") => {
    const updated = [...dailyVerificationItems];
    updated[index].result = result;
    setDailyVerificationItems(updated);
  };

  const addDailyVerification = () => {
    if (!newDailyVerification.equipmentType || !newDailyVerification.equipmentId || !newDailyVerification.inspector) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const hasIncomplete = dailyVerificationItems.some((item) => item.result === "");
    if (hasIncomplete) {
      alert("모든 검증 항목의 결과를 입력해주세요.");
      return;
    }

    const results: { [key: string]: "OK" | "NG" } = {};
    dailyVerificationItems.forEach((item) => {
      results[item.item] = item.result as "OK" | "NG";
    });

    const hasNG = dailyVerificationItems.some((item) => item.result === "NG");

    const newRecord: DailyVerification = {
      id: Date.now(),
      verificationDate: newDailyVerification.verificationDate,
      equipmentType: newDailyVerification.equipmentType,
      equipmentId: newDailyVerification.equipmentId,
      equipmentName: newDailyVerification.equipmentName,
      verificationItems: dailyVerificationItems.map((item) => item.item),
      results,
      inspector: newDailyVerification.inspector,
      overallResult: hasNG ? "NG" : "OK",
    };

    setDailyVerifications([newRecord, ...dailyVerifications]);
    setNewDailyVerification({
      verificationDate: new Date().toISOString().split("T")[0],
      equipmentType: "",
      equipmentId: "",
      equipmentName: "",
      inspector: "",
    });
    setDailyVerificationItems([]);
    alert("일일 검증 기록이 저장되었습니다.");
  };

  // Monthly verification handlers
  const loadMonthlyEquipment = () => {
    const monthlyEquipment = equipmentList.filter((eq) => eq.verificationCycle === "monthly" && eq.isActive);
    setMonthlyEquipmentResults(monthlyEquipment.map((eq) => ({ name: eq.equipmentName, result: "" })));
  };

  const updateMonthlyResult = (index: number, result: "OK" | "NG") => {
    const updated = [...monthlyEquipmentResults];
    updated[index].result = result;
    setMonthlyEquipmentResults(updated);
  };

  const addMonthlyVerification = () => {
    if (!newMonthlyVerification.inspector || monthlyEquipmentResults.length === 0) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const hasIncomplete = monthlyEquipmentResults.some((eq) => eq.result === "");
    if (hasIncomplete) {
      alert("모든 장비의 검증 결과를 입력해주세요.");
      return;
    }

    const results: { [key: string]: "OK" | "NG" } = {};
    monthlyEquipmentResults.forEach((eq) => {
      results[eq.name] = eq.result as "OK" | "NG";
    });

    const newRecord: MonthlyVerification = {
      id: Date.now(),
      verificationYearMonth: newMonthlyVerification.verificationYearMonth,
      equipmentList: monthlyEquipmentResults.map((eq) => eq.name),
      results,
      inspector: newMonthlyVerification.inspector,
      verificationDate: newMonthlyVerification.verificationDate,
      notes: newMonthlyVerification.notes,
    };

    setMonthlyVerifications([newRecord, ...monthlyVerifications]);
    setNewMonthlyVerification({
      verificationYearMonth: new Date().toISOString().slice(0, 7),
      inspector: "",
      verificationDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setMonthlyEquipmentResults([]);
    alert("월간 검증 기록이 저장되었습니다.");
  };

  // Equipment registration handlers
  const handleNewEquipmentTypeChange = (type: string) => {
    setNewEquipment({ ...newEquipment, equipmentType: type });
    const items = defaultVerificationItems[type] || [];
    setNewEquipmentItems(items);

    // Auto-set verification cycle based on equipment type
    const isMonthly = monthlyEquipmentTypes.some((t) => t.value === type);
    setNewEquipment((prev) => ({ ...prev, equipmentType: type, verificationCycle: isMonthly ? "monthly" : "daily" }));
  };

  const addNewEquipmentItem = () => {
    setNewEquipmentItems([...newEquipmentItems, ""]);
  };

  const updateEquipmentItem = (index: number, value: string) => {
    const updated = [...newEquipmentItems];
    updated[index] = value;
    setNewEquipmentItems(updated);
  };

  const removeEquipmentItem = (index: number) => {
    setNewEquipmentItems(newEquipmentItems.filter((_, i) => i !== index));
  };

  const addEquipment = () => {
    if (!newEquipment.equipmentId || !newEquipment.equipmentName || !newEquipment.equipmentType || !newEquipment.verificationCycle) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const validItems = newEquipmentItems.filter((item) => item.trim() !== "");
    if (validItems.length === 0) {
      alert("최소 1개 이상의 검증 항목을 입력해주세요.");
      return;
    }

    const equipment: Equipment = {
      id: Date.now(),
      equipmentId: newEquipment.equipmentId,
      equipmentName: newEquipment.equipmentName,
      equipmentType: newEquipment.equipmentType,
      verificationCycle: newEquipment.verificationCycle as "daily" | "monthly",
      verificationItems: validItems,
      isActive: true,
    };

    setEquipmentList([...equipmentList, equipment]);
    setNewEquipment({ equipmentId: "", equipmentName: "", equipmentType: "", verificationCycle: "" });
    setNewEquipmentItems([]);
    alert("장비가 등록되었습니다.");
  };

  const toggleEquipmentActive = (id: number) => {
    setEquipmentList(
      equipmentList.map((eq) => (eq.id === id ? { ...eq, isActive: !eq.isActive } : eq))
    );
  };

  const deleteEquipment = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setEquipmentList(equipmentList.filter((eq) => eq.id !== id));
    }
  };

  // Filter history
  const filteredHistory = verificationHistory.filter((h) => {
    if (historyFilter.cycleType !== "all" && h.cycleType !== historyFilter.cycleType) return false;
    if (historyFilter.equipmentId && !h.equipmentId.toLowerCase().includes(historyFilter.equipmentId.toLowerCase())) return false;
    if (historyFilter.startDate && h.date < historyFilter.startDate) return false;
    if (historyFilter.endDate && h.date > historyFilter.endDate) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" />
            F/PROOF 장비검증
          </h1>
          <p className="text-muted-foreground">풀프루프 장치 검증 관리 (일간/월간)</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            일일 검증
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            월간 검증
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            장비 등록
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            검증 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Daily Verification */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>일일 검증 등록 (복합기, 전장검사, 이종검사)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>검증일 *</Label>
                  <Input
                    type="date"
                    value={newDailyVerification.verificationDate}
                    onChange={(e) => setNewDailyVerification({ ...newDailyVerification, verificationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>장비유형 *</Label>
                  <Select value={newDailyVerification.equipmentType} onValueChange={handleDailyEquipmentTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {dailyEquipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>장비번호 *</Label>
                  <Input
                    value={newDailyVerification.equipmentId}
                    onChange={(e) => setNewDailyVerification({ ...newDailyVerification, equipmentId: e.target.value })}
                    placeholder="예: CP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>장비명</Label>
                  <Input
                    value={newDailyVerification.equipmentName}
                    onChange={(e) => setNewDailyVerification({ ...newDailyVerification, equipmentName: e.target.value })}
                    placeholder="장비명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>검증자 *</Label>
                  <Input
                    value={newDailyVerification.inspector}
                    onChange={(e) => setNewDailyVerification({ ...newDailyVerification, inspector: e.target.value })}
                    placeholder="검증자명"
                  />
                </div>
              </div>

              {dailyVerificationItems.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">검증 항목</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>검증항목</TableHead>
                        <TableHead className="w-[200px]">검증결과</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyVerificationItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={item.result === "OK" ? "default" : "outline"}
                                className={item.result === "OK" ? "bg-green-500 hover:bg-green-600" : ""}
                                onClick={() => updateDailyVerificationResult(index, "OK")}
                              >
                                OK
                              </Button>
                              <Button
                                size="sm"
                                variant={item.result === "NG" ? "default" : "outline"}
                                className={item.result === "NG" ? "bg-red-500 hover:bg-red-600" : ""}
                                onClick={() => updateDailyVerificationResult(index, "NG")}
                              >
                                NG
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={addDailyVerification}>
                  <Save className="h-4 w-4 mr-2" />
                  검증 저장
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>일일 검증 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>검증일</TableHead>
                    <TableHead>장비유형</TableHead>
                    <TableHead>장비번호</TableHead>
                    <TableHead>장비명</TableHead>
                    <TableHead>검증항목</TableHead>
                    <TableHead>결과</TableHead>
                    <TableHead>검증자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyVerifications.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.verificationDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getEquipmentTypeLabel(record.equipmentType)}</Badge>
                      </TableCell>
                      <TableCell>{record.equipmentId}</TableCell>
                      <TableCell>{record.equipmentName}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm">
                          {record.verificationItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span>{item}:</span>
                              {getResultBadge(record.results[item])}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getResultBadge(record.overallResult)}</TableCell>
                      <TableCell>{record.inspector}</TableCell>
                    </TableRow>
                  ))}
                  {dailyVerifications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        등록된 일일 검증 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Monthly Verification */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>월간 검증 등록 (사출 호퍼, 인터록)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>검증년월 *</Label>
                  <Input
                    type="month"
                    value={newMonthlyVerification.verificationYearMonth}
                    onChange={(e) => setNewMonthlyVerification({ ...newMonthlyVerification, verificationYearMonth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>검증일 *</Label>
                  <Input
                    type="date"
                    value={newMonthlyVerification.verificationDate}
                    onChange={(e) => setNewMonthlyVerification({ ...newMonthlyVerification, verificationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>검증자 *</Label>
                  <Input
                    value={newMonthlyVerification.inspector}
                    onChange={(e) => setNewMonthlyVerification({ ...newMonthlyVerification, inspector: e.target.value })}
                    placeholder="검증자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={newMonthlyVerification.notes}
                    onChange={(e) => setNewMonthlyVerification({ ...newMonthlyVerification, notes: e.target.value })}
                    placeholder="비고"
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <Button variant="outline" onClick={loadMonthlyEquipment}>
                  <Plus className="h-4 w-4 mr-2" />
                  월간 장비 목록 불러오기
                </Button>
              </div>

              {monthlyEquipmentResults.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">장비 검증 결과</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>장비명</TableHead>
                        <TableHead className="w-[200px]">검증결과</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyEquipmentResults.map((eq, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{eq.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={eq.result === "OK" ? "default" : "outline"}
                                className={eq.result === "OK" ? "bg-green-500 hover:bg-green-600" : ""}
                                onClick={() => updateMonthlyResult(index, "OK")}
                              >
                                OK
                              </Button>
                              <Button
                                size="sm"
                                variant={eq.result === "NG" ? "default" : "outline"}
                                className={eq.result === "NG" ? "bg-red-500 hover:bg-red-600" : ""}
                                onClick={() => updateMonthlyResult(index, "NG")}
                              >
                                NG
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={addMonthlyVerification}>
                  <Save className="h-4 w-4 mr-2" />
                  월간 검증 저장
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>월간 검증 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>검증년월</TableHead>
                    <TableHead>검증일</TableHead>
                    <TableHead>장비목록</TableHead>
                    <TableHead>결과</TableHead>
                    <TableHead>검증자</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyVerifications.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.verificationYearMonth}</TableCell>
                      <TableCell>{record.verificationDate}</TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {record.equipmentList.map((eq, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span>{eq}:</span>
                              {getResultBadge(record.results[eq])}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {Object.values(record.results).every((r) => r === "OK") ? (
                          <Badge className="bg-green-500">전체 OK</Badge>
                        ) : (
                          <Badge className="bg-red-500">NG 포함</Badge>
                        )}
                      </TableCell>
                      <TableCell>{record.inspector}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                    </TableRow>
                  ))}
                  {monthlyVerifications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        등록된 월간 검증 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Equipment Registration */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>장비 등록</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>장비번호 *</Label>
                  <Input
                    value={newEquipment.equipmentId}
                    onChange={(e) => setNewEquipment({ ...newEquipment, equipmentId: e.target.value })}
                    placeholder="예: CP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>장비명 *</Label>
                  <Input
                    value={newEquipment.equipmentName}
                    onChange={(e) => setNewEquipment({ ...newEquipment, equipmentName: e.target.value })}
                    placeholder="장비명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>장비유형 *</Label>
                  <Select value={newEquipment.equipmentType} onValueChange={handleNewEquipmentTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-sm font-bold text-muted-foreground">
                        --- 일간 검증 ---
                      </div>
                      {dailyEquipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-sm font-bold text-muted-foreground">
                        --- 월간 검증 ---
                      </div>
                      {monthlyEquipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검증주기 *</Label>
                  <Select
                    value={newEquipment.verificationCycle}
                    onValueChange={(v) => setNewEquipment({ ...newEquipment, verificationCycle: v as "daily" | "monthly" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">일간</SelectItem>
                      <SelectItem value="monthly">월간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">검증 항목 설정</Label>
                  <Button variant="outline" size="sm" onClick={addNewEquipmentItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    항목 추가
                  </Button>
                </div>
                {newEquipmentItems.length > 0 && (
                  <div className="space-y-2">
                    {newEquipmentItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-8 text-sm text-muted-foreground">{index + 1}.</span>
                        <Input
                          value={item}
                          onChange={(e) => updateEquipmentItem(index, e.target.value)}
                          placeholder="검증 항목"
                          className="flex-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeEquipmentItem(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={addEquipment}>
                  <Plus className="h-4 w-4 mr-2" />
                  장비 등록
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>등록된 장비 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>장비번호</TableHead>
                    <TableHead>장비명</TableHead>
                    <TableHead>장비유형</TableHead>
                    <TableHead>검증주기</TableHead>
                    <TableHead>검증항목</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell>{eq.equipmentId}</TableCell>
                      <TableCell>{eq.equipmentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getEquipmentTypeLabel(eq.equipmentType)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={eq.verificationCycle === "daily" ? "default" : "secondary"}>
                          {getCycleLabel(eq.verificationCycle)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="text-sm text-muted-foreground">
                          {eq.verificationItems.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={eq.isActive ? "bg-green-500" : "bg-gray-500"}
                          onClick={() => toggleEquipmentActive(eq.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {eq.isActive ? "활성" : "비활성"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteEquipment(eq.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {equipmentList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        등록된 장비가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Verification History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>검증 이력 조회</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>검증주기</Label>
                  <Select value={historyFilter.cycleType} onValueChange={(v) => setHistoryFilter({ ...historyFilter, cycleType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="daily">일간</SelectItem>
                      <SelectItem value="monthly">월간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>장비번호</Label>
                  <Input
                    value={historyFilter.equipmentId}
                    onChange={(e) => setHistoryFilter({ ...historyFilter, equipmentId: e.target.value })}
                    placeholder="검색"
                  />
                </div>
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={historyFilter.startDate}
                    onChange={(e) => setHistoryFilter({ ...historyFilter, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    value={historyFilter.endDate}
                    onChange={(e) => setHistoryFilter({ ...historyFilter, endDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>검증 이력 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>검증일</TableHead>
                    <TableHead>장비번호</TableHead>
                    <TableHead>장비명</TableHead>
                    <TableHead>장비유형</TableHead>
                    <TableHead>검증주기</TableHead>
                    <TableHead>결과</TableHead>
                    <TableHead>검증자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.equipmentId}</TableCell>
                      <TableCell>{record.equipmentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getEquipmentTypeLabel(record.equipmentType)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.cycleType === "daily" ? "default" : "secondary"}>
                          {getCycleLabel(record.cycleType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getResultBadge(record.result)}</TableCell>
                      <TableCell>{record.inspector}</TableCell>
                    </TableRow>
                  ))}
                  {filteredHistory.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        검증 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 검증 횟수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredHistory.length}회</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">OK 건수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {filteredHistory.filter((h) => h.result === "OK").length}건
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">NG 건수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {filteredHistory.filter((h) => h.result === "NG").length}건
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">적합률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredHistory.length > 0
                    ? ((filteredHistory.filter((h) => h.result === "OK").length / filteredHistory.length) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
