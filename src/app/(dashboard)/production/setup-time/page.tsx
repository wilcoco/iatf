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
import { Clock, Plus, Save, Trash2, BarChart3, TrendingDown, Settings, History, ArrowRight } from "lucide-react";

// Types
interface SetupMeasurement {
  id: number;
  measurementDate: string;        // 측정일
  measurementNumber: string;      // 측정번호
  line: string;                   // 라인
  equipment: string;              // 설비
  productFrom: string;            // 품목 변경 (From)
  productTo: string;              // 품목 변경 (To)
  externalSetupTime: number;      // 외단취시간 (분)
  internalSetupTime: number;      // 내단취시간 (분)
  totalSetupTime: number;         // 총 작업준비시간 (분)
  measurer: string;               // 측정자
  createdAt: string;
}

interface EquipmentStatus {
  equipment: string;
  line: string;
  measurementCount: number;
  avgSetupTime: number;
  targetTime: number;
  achievement: number;            // 목표 달성률
}

interface ImprovementActivity {
  id: number;
  activityDate: string;           // 개선일
  equipment: string;              // 대상 설비
  setupTimeBefore: number;        // 개선 전 시간
  setupTimeAfter: number;         // 개선 후 시간
  improvementContent: string;     // 개선 내용
  improvementEffect: number;      // 개선 효과 (%)
  responsible: string;            // 담당자
  status: "planned" | "inProgress" | "completed";
}

// Constants
const LINES = [
  { value: "lineA", label: "A라인" },
  { value: "lineB", label: "B라인" },
  { value: "lineC", label: "C라인" },
  { value: "lineD", label: "D라인" },
];

const EQUIPMENT_LIST = [
  { value: "press-001", label: "프레스 #001", line: "lineA" },
  { value: "press-002", label: "프레스 #002", line: "lineA" },
  { value: "welding-001", label: "용접기 #001", line: "lineB" },
  { value: "welding-002", label: "용접기 #002", line: "lineB" },
  { value: "cnc-001", label: "CNC #001", line: "lineC" },
  { value: "cnc-002", label: "CNC #002", line: "lineC" },
  { value: "assembly-001", label: "조립기 #001", line: "lineD" },
  { value: "assembly-002", label: "조립기 #002", line: "lineD" },
];

export default function SetupTimeManagementPage() {
  const [activeTab, setActiveTab] = useState("measurement");

  // Measurement form state
  const [measurementForm, setMeasurementForm] = useState({
    measurementDate: "",
    measurementNumber: "",
    line: "",
    equipment: "",
    productFrom: "",
    productTo: "",
    externalSetupTime: 0,
    internalSetupTime: 0,
    measurer: "",
  });

  // Improvement form state
  const [improvementForm, setImprovementForm] = useState({
    activityDate: "",
    equipment: "",
    setupTimeBefore: 0,
    setupTimeAfter: 0,
    improvementContent: "",
    responsible: "",
  });

  // Sample measurement data
  const [measurements, setMeasurements] = useState<SetupMeasurement[]>([
    {
      id: 1,
      measurementDate: "2026-06-01",
      measurementNumber: "STM-2026-001",
      line: "lineA",
      equipment: "press-001",
      productFrom: "PART-A001",
      productTo: "PART-A002",
      externalSetupTime: 15,
      internalSetupTime: 45,
      totalSetupTime: 60,
      measurer: "김철수",
      createdAt: "2026-06-01",
    },
    {
      id: 2,
      measurementDate: "2026-06-03",
      measurementNumber: "STM-2026-002",
      line: "lineA",
      equipment: "press-001",
      productFrom: "PART-A002",
      productTo: "PART-A003",
      externalSetupTime: 12,
      internalSetupTime: 38,
      totalSetupTime: 50,
      measurer: "이영희",
      createdAt: "2026-06-03",
    },
    {
      id: 3,
      measurementDate: "2026-06-05",
      measurementNumber: "STM-2026-003",
      line: "lineB",
      equipment: "welding-001",
      productFrom: "WELD-B001",
      productTo: "WELD-B002",
      externalSetupTime: 20,
      internalSetupTime: 55,
      totalSetupTime: 75,
      measurer: "박민수",
      createdAt: "2026-06-05",
    },
    {
      id: 4,
      measurementDate: "2026-06-07",
      measurementNumber: "STM-2026-004",
      line: "lineC",
      equipment: "cnc-001",
      productFrom: "CNC-C001",
      productTo: "CNC-C002",
      externalSetupTime: 10,
      internalSetupTime: 30,
      totalSetupTime: 40,
      measurer: "최정훈",
      createdAt: "2026-06-07",
    },
    {
      id: 5,
      measurementDate: "2026-06-09",
      measurementNumber: "STM-2026-005",
      line: "lineA",
      equipment: "press-002",
      productFrom: "PART-A004",
      productTo: "PART-A005",
      externalSetupTime: 18,
      internalSetupTime: 42,
      totalSetupTime: 60,
      measurer: "정수진",
      createdAt: "2026-06-09",
    },
  ]);

  // Sample improvement activities
  const [improvements, setImprovements] = useState<ImprovementActivity[]>([
    {
      id: 1,
      activityDate: "2026-05-15",
      equipment: "press-001",
      setupTimeBefore: 90,
      setupTimeAfter: 60,
      improvementContent: "금형 클램프 시스템 개선 - 퀵 클램프 도입으로 금형 교체 시간 단축",
      improvementEffect: 33.3,
      responsible: "김철수",
      status: "completed",
    },
    {
      id: 2,
      activityDate: "2026-05-25",
      equipment: "welding-001",
      setupTimeBefore: 100,
      setupTimeAfter: 75,
      improvementContent: "용접 치구 표준화 - 범용 치구 적용으로 치구 교체 시간 단축",
      improvementEffect: 25.0,
      responsible: "박민수",
      status: "completed",
    },
    {
      id: 3,
      activityDate: "2026-06-10",
      equipment: "cnc-001",
      setupTimeBefore: 50,
      setupTimeAfter: 35,
      improvementContent: "프로그램 사전 준비 체계 구축 - 외단취 작업 확대",
      improvementEffect: 30.0,
      responsible: "최정훈",
      status: "inProgress",
    },
    {
      id: 4,
      activityDate: "2026-06-20",
      equipment: "assembly-001",
      setupTimeBefore: 45,
      setupTimeAfter: 30,
      improvementContent: "조립 라인 레이아웃 개선 - 부품 배치 최적화",
      improvementEffect: 33.3,
      responsible: "이영희",
      status: "planned",
    },
  ]);

  // Generate measurement number
  const generateMeasurementNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = measurements.length + 1;
    return `STM-${year}-${String(nextNumber).padStart(3, "0")}`;
  };

  // Calculate total setup time
  const calculateTotalSetupTime = (external: number, internal: number) => {
    return external + internal;
  };

  // Get equipment label
  const getEquipmentLabel = (value: string) => {
    return EQUIPMENT_LIST.find((e) => e.value === value)?.label || value;
  };

  // Get line label
  const getLineLabel = (value: string) => {
    return LINES.find((l) => l.value === value)?.label || value;
  };

  // Filter equipment by line
  const getEquipmentByLine = (lineValue: string) => {
    if (!lineValue) return EQUIPMENT_LIST;
    return EQUIPMENT_LIST.filter((e) => e.line === lineValue);
  };

  // Calculate equipment status statistics
  const getEquipmentStatistics = (): EquipmentStatus[] => {
    const equipmentStats: { [key: string]: { times: number[]; line: string } } = {};

    measurements.forEach((m) => {
      if (!equipmentStats[m.equipment]) {
        equipmentStats[m.equipment] = { times: [], line: m.line };
      }
      equipmentStats[m.equipment].times.push(m.totalSetupTime);
    });

    return Object.entries(equipmentStats).map(([equipment, data]) => {
      const avgTime = Math.round(data.times.reduce((a, b) => a + b, 0) / data.times.length);
      const targetTime = 45; // 목표 시간 (분)
      const achievement = Math.round((targetTime / avgTime) * 100);

      return {
        equipment,
        line: data.line,
        measurementCount: data.times.length,
        avgSetupTime: avgTime,
        targetTime,
        achievement: Math.min(achievement, 100),
      };
    });
  };

  // Save measurement
  const handleSaveMeasurement = () => {
    const totalTime = calculateTotalSetupTime(
      measurementForm.externalSetupTime,
      measurementForm.internalSetupTime
    );

    const newMeasurement: SetupMeasurement = {
      id: Date.now(),
      measurementDate: measurementForm.measurementDate,
      measurementNumber: measurementForm.measurementNumber || generateMeasurementNumber(),
      line: measurementForm.line,
      equipment: measurementForm.equipment,
      productFrom: measurementForm.productFrom,
      productTo: measurementForm.productTo,
      externalSetupTime: measurementForm.externalSetupTime,
      internalSetupTime: measurementForm.internalSetupTime,
      totalSetupTime: totalTime,
      measurer: measurementForm.measurer,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setMeasurements([newMeasurement, ...measurements]);
    resetMeasurementForm();
    alert("작업준비시간 측정 기록이 저장되었습니다.");
  };

  // Save improvement
  const handleSaveImprovement = () => {
    const effect = Math.round(
      ((improvementForm.setupTimeBefore - improvementForm.setupTimeAfter) /
        improvementForm.setupTimeBefore) *
        100 *
        10
    ) / 10;

    const newImprovement: ImprovementActivity = {
      id: Date.now(),
      activityDate: improvementForm.activityDate,
      equipment: improvementForm.equipment,
      setupTimeBefore: improvementForm.setupTimeBefore,
      setupTimeAfter: improvementForm.setupTimeAfter,
      improvementContent: improvementForm.improvementContent,
      improvementEffect: effect,
      responsible: improvementForm.responsible,
      status: "planned",
    };

    setImprovements([newImprovement, ...improvements]);
    resetImprovementForm();
    alert("개선 활동이 등록되었습니다.");
  };

  // Reset forms
  const resetMeasurementForm = () => {
    setMeasurementForm({
      measurementDate: "",
      measurementNumber: "",
      line: "",
      equipment: "",
      productFrom: "",
      productTo: "",
      externalSetupTime: 0,
      internalSetupTime: 0,
      measurer: "",
    });
  };

  const resetImprovementForm = () => {
    setImprovementForm({
      activityDate: "",
      equipment: "",
      setupTimeBefore: 0,
      setupTimeAfter: 0,
      improvementContent: "",
      responsible: "",
    });
  };

  // Delete measurement
  const deleteMeasurement = (id: number) => {
    if (confirm("이 측정 기록을 삭제하시겠습니까?")) {
      setMeasurements(measurements.filter((m) => m.id !== id));
    }
  };

  // Delete improvement
  const deleteImprovement = (id: number) => {
    if (confirm("이 개선 활동을 삭제하시겠습니까?")) {
      setImprovements(improvements.filter((i) => i.id !== id));
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge variant="outline">계획</Badge>;
      case "inProgress":
        return <Badge variant="warning">진행중</Badge>;
      case "completed":
        return <Badge variant="success">완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get achievement badge
  const getAchievementBadge = (achievement: number) => {
    if (achievement >= 100) {
      return <Badge variant="success">{achievement}%</Badge>;
    } else if (achievement >= 80) {
      return <Badge variant="warning">{achievement}%</Badge>;
    } else {
      return <Badge variant="error">{achievement}%</Badge>;
    }
  };

  // Statistics
  const equipmentStats = getEquipmentStatistics();
  const totalMeasurements = measurements.length;
  const avgTotalSetupTime = totalMeasurements > 0
    ? Math.round(measurements.reduce((sum, m) => sum + m.totalSetupTime, 0) / totalMeasurements)
    : 0;
  const totalImprovements = improvements.filter((i) => i.status === "completed").length;
  const avgImprovementEffect = improvements.filter((i) => i.status === "completed").length > 0
    ? Math.round(
        improvements
          .filter((i) => i.status === "completed")
          .reduce((sum, i) => sum + i.improvementEffect, 0) /
          improvements.filter((i) => i.status === "completed").length * 10
      ) / 10
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            작업준비시간 관리
          </h1>
          <p className="text-muted-foreground">
            Setup Time Management - IATF 16949 기반 작업준비시간 측정 및 개선 관리
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 측정 건수</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeasurements}건</div>
            <p className="text-xs text-muted-foreground">이번 달 측정 기록</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 작업준비시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTotalSetupTime}분</div>
            <p className="text-xs text-muted-foreground">전체 설비 평균</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료 개선 활동</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImprovements}건</div>
            <p className="text-xs text-muted-foreground">개선 완료</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 개선 효과</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgImprovementEffect}%</div>
            <p className="text-xs text-muted-foreground">시간 단축률</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="measurement">
            <Clock className="mr-2 h-4 w-4" />
            1. 작업준비시간 측정
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Settings className="mr-2 h-4 w-4" />
            2. 설비별 현황
          </TabsTrigger>
          <TabsTrigger value="improvement">
            <TrendingDown className="mr-2 h-4 w-4" />
            3. 개선 활동
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            4. 측정 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 작업준비시간 측정 */}
        <TabsContent value="measurement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>측정 기본정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>측정일 *</Label>
                  <Input
                    type="date"
                    value={measurementForm.measurementDate}
                    onChange={(e) =>
                      setMeasurementForm({ ...measurementForm, measurementDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>측정번호</Label>
                  <Input
                    value={measurementForm.measurementNumber}
                    onChange={(e) =>
                      setMeasurementForm({ ...measurementForm, measurementNumber: e.target.value })
                    }
                    placeholder={generateMeasurementNumber()}
                  />
                </div>
                <div className="space-y-2">
                  <Label>라인 *</Label>
                  <Select
                    value={measurementForm.line}
                    onValueChange={(v) =>
                      setMeasurementForm({ ...measurementForm, line: v, equipment: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="라인 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {LINES.map((line) => (
                        <SelectItem key={line.value} value={line.value}>
                          {line.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>설비 *</Label>
                  <Select
                    value={measurementForm.equipment}
                    onValueChange={(v) =>
                      setMeasurementForm({ ...measurementForm, equipment: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="설비 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {getEquipmentByLine(measurementForm.line).map((equip) => (
                        <SelectItem key={equip.value} value={equip.value}>
                          {equip.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>품목 변경 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label>변경 전 품목 (From) *</Label>
                  <Input
                    value={measurementForm.productFrom}
                    onChange={(e) =>
                      setMeasurementForm({ ...measurementForm, productFrom: e.target.value })
                    }
                    placeholder="예: PART-A001"
                  />
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground mt-6" />
                <div className="flex-1 space-y-2">
                  <Label>변경 후 품목 (To) *</Label>
                  <Input
                    value={measurementForm.productTo}
                    onChange={(e) =>
                      setMeasurementForm({ ...measurementForm, productTo: e.target.value })
                    }
                    placeholder="예: PART-A002"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>작업준비시간 측정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>외단취시간 (External Setup) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={measurementForm.externalSetupTime}
                      onChange={(e) =>
                        setMeasurementForm({
                          ...measurementForm,
                          externalSetupTime: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      min={0}
                    />
                    <span className="text-sm text-muted-foreground">분</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    설비 가동 중 수행 가능한 준비 작업 시간
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>내단취시간 (Internal Setup) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={measurementForm.internalSetupTime}
                      onChange={(e) =>
                        setMeasurementForm({
                          ...measurementForm,
                          internalSetupTime: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      min={0}
                    />
                    <span className="text-sm text-muted-foreground">분</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    설비 정지 후 수행해야 하는 준비 작업 시간
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>총 작업준비시간</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={calculateTotalSetupTime(
                        measurementForm.externalSetupTime,
                        measurementForm.internalSetupTime
                      )}
                      readOnly
                      className="bg-muted"
                    />
                    <span className="text-sm text-muted-foreground">분</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    외단취 + 내단취 = 총 작업준비시간
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>측정자 *</Label>
                  <Input
                    value={measurementForm.measurer}
                    onChange={(e) =>
                      setMeasurementForm({ ...measurementForm, measurer: e.target.value })
                    }
                    placeholder="측정자명"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveMeasurement}>
                  <Save className="mr-2 h-4 w-4" />
                  측정 기록 저장
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMED 개념 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-semibold text-sm mb-2">외단취 (External Setup)</h4>
                  <p className="text-xs text-muted-foreground">
                    설비가 가동 중일 때 미리 준비할 수 있는 작업입니다.
                    금형/치구 준비, 자재 준비, 공구 세팅 등이 포함됩니다.
                    외단취 비율을 높이면 설비 정지 시간을 줄일 수 있습니다.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                  <h4 className="font-semibold text-sm mb-2">내단취 (Internal Setup)</h4>
                  <p className="text-xs text-muted-foreground">
                    설비를 정지한 후에만 수행할 수 있는 작업입니다.
                    금형 교체, 설비 조정, 시운전 등이 포함됩니다.
                    내단취 시간 단축이 작업준비시간 개선의 핵심입니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 설비별 현황 */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>설비별 작업준비시간 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설비</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead className="text-center">측정 횟수</TableHead>
                    <TableHead className="text-center">평균 작업준비시간</TableHead>
                    <TableHead className="text-center">목표 시간</TableHead>
                    <TableHead className="text-center">달성률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        측정 데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    equipmentStats.map((stat) => (
                      <TableRow key={stat.equipment}>
                        <TableCell className="font-medium">
                          {getEquipmentLabel(stat.equipment)}
                        </TableCell>
                        <TableCell>{getLineLabel(stat.line)}</TableCell>
                        <TableCell className="text-center">{stat.measurementCount}회</TableCell>
                        <TableCell className="text-center">{stat.avgSetupTime}분</TableCell>
                        <TableCell className="text-center">{stat.targetTime}분</TableCell>
                        <TableCell className="text-center">
                          {getAchievementBadge(stat.achievement)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>라인별 평균 작업준비시간</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {LINES.map((line) => {
                    const lineMeasurements = measurements.filter((m) => m.line === line.value);
                    const avgTime = lineMeasurements.length > 0
                      ? Math.round(
                          lineMeasurements.reduce((sum, m) => sum + m.totalSetupTime, 0) /
                            lineMeasurements.length
                        )
                      : 0;
                    const targetTime = 45;
                    const percentage = avgTime > 0 ? Math.min((avgTime / 90) * 100, 100) : 0;

                    return (
                      <div key={line.value} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{line.label}</span>
                          <span className="font-medium">
                            {avgTime}분 / 목표 {targetTime}분
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              avgTime <= targetTime ? "bg-green-500" : avgTime <= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>목표 달성 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const achieved = equipmentStats.filter((s) => s.achievement >= 100).length;
                    const partial = equipmentStats.filter(
                      (s) => s.achievement >= 80 && s.achievement < 100
                    ).length;
                    const notAchieved = equipmentStats.filter((s) => s.achievement < 80).length;
                    const total = equipmentStats.length;

                    return (
                      <>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>목표 달성</span>
                          </div>
                          <span className="font-bold">{achieved}개 설비</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span>부분 달성 (80% 이상)</span>
                          </div>
                          <span className="font-bold">{partial}개 설비</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>미달성 (80% 미만)</span>
                          </div>
                          <span className="font-bold">{notAchieved}개 설비</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">전체 설비</span>
                            <span className="font-bold">{total}개</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 개선 활동 */}
        <TabsContent value="improvement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>개선 활동 등록</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>개선일 *</Label>
                  <Input
                    type="date"
                    value={improvementForm.activityDate}
                    onChange={(e) =>
                      setImprovementForm({ ...improvementForm, activityDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>대상 설비 *</Label>
                  <Select
                    value={improvementForm.equipment}
                    onValueChange={(v) =>
                      setImprovementForm({ ...improvementForm, equipment: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="설비 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_LIST.map((equip) => (
                        <SelectItem key={equip.value} value={equip.value}>
                          {equip.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>담당자 *</Label>
                  <Input
                    value={improvementForm.responsible}
                    onChange={(e) =>
                      setImprovementForm({ ...improvementForm, responsible: e.target.value })
                    }
                    placeholder="담당자명"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>개선 전 시간 *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={improvementForm.setupTimeBefore}
                      onChange={(e) =>
                        setImprovementForm({
                          ...improvementForm,
                          setupTimeBefore: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      min={0}
                    />
                    <span className="text-sm text-muted-foreground">분</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>개선 후 시간 *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={improvementForm.setupTimeAfter}
                      onChange={(e) =>
                        setImprovementForm({
                          ...improvementForm,
                          setupTimeAfter: Number(e.target.value),
                        })
                      }
                      placeholder="0"
                      min={0}
                    />
                    <span className="text-sm text-muted-foreground">분</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>개선 효과</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={
                        improvementForm.setupTimeBefore > 0
                          ? `${Math.round(
                              ((improvementForm.setupTimeBefore - improvementForm.setupTimeAfter) /
                                improvementForm.setupTimeBefore) *
                                100 *
                                10
                            ) / 10}%`
                          : "0%"
                      }
                      readOnly
                      className="bg-muted"
                    />
                    <span className="text-sm text-muted-foreground">단축</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>개선 내용 *</Label>
                <Textarea
                  value={improvementForm.improvementContent}
                  onChange={(e) =>
                    setImprovementForm({ ...improvementForm, improvementContent: e.target.value })
                  }
                  placeholder="개선 활동 내용을 상세히 기술하세요"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveImprovement}>
                  <Plus className="mr-2 h-4 w-4" />
                  개선 활동 등록
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개선 활동 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>개선일</TableHead>
                    <TableHead>대상 설비</TableHead>
                    <TableHead className="text-center">개선 전</TableHead>
                    <TableHead className="text-center">개선 후</TableHead>
                    <TableHead className="text-center">개선 효과</TableHead>
                    <TableHead>개선 내용</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {improvements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        등록된 개선 활동이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    improvements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.activityDate}</TableCell>
                        <TableCell>{getEquipmentLabel(item.equipment)}</TableCell>
                        <TableCell className="text-center">{item.setupTimeBefore}분</TableCell>
                        <TableCell className="text-center">{item.setupTimeAfter}분</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="success">{item.improvementEffect}%</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={item.improvementContent}>
                          {item.improvementContent}
                        </TableCell>
                        <TableCell>{item.responsible}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteImprovement(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개선 효과 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">총 개선 활동</p>
                  <p className="text-2xl font-bold">{improvements.length}건</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">완료된 활동</p>
                  <p className="text-2xl font-bold">
                    {improvements.filter((i) => i.status === "completed").length}건
                  </p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">평균 개선율</p>
                  <p className="text-2xl font-bold">{avgImprovementEffect}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 측정 이력 */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>작업준비시간 측정 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>측정일</TableHead>
                    <TableHead>측정번호</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead>설비</TableHead>
                    <TableHead>품목 변경</TableHead>
                    <TableHead className="text-center">외단취</TableHead>
                    <TableHead className="text-center">내단취</TableHead>
                    <TableHead className="text-center">총 시간</TableHead>
                    <TableHead>측정자</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measurements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground">
                        측정 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    measurements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.measurementDate}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.measurementNumber}
                        </TableCell>
                        <TableCell>{getLineLabel(item.line)}</TableCell>
                        <TableCell>{getEquipmentLabel(item.equipment)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <span>{item.productFrom}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{item.productTo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.externalSetupTime}분</TableCell>
                        <TableCell className="text-center">{item.internalSetupTime}분</TableCell>
                        <TableCell className="text-center font-medium">
                          {item.totalSetupTime}분
                        </TableCell>
                        <TableCell>{item.measurer}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMeasurement(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>최근 측정 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {measurements.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{getEquipmentLabel(item.equipment)}</p>
                        <p className="text-xs text-muted-foreground">{item.measurementDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.totalSetupTime}분</p>
                        <p className="text-xs text-muted-foreground">
                          외:{item.externalSetupTime} / 내:{item.internalSetupTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>외단취/내단취 비율 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const totalExternal = measurements.reduce((sum, m) => sum + m.externalSetupTime, 0);
                    const totalInternal = measurements.reduce((sum, m) => sum + m.internalSetupTime, 0);
                    const total = totalExternal + totalInternal;
                    const externalRatio = total > 0 ? Math.round((totalExternal / total) * 100) : 0;
                    const internalRatio = total > 0 ? Math.round((totalInternal / total) * 100) : 0;

                    return (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>외단취 비율</span>
                            <span className="font-medium">{externalRatio}%</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${externalRatio}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>내단취 비율</span>
                            <span className="font-medium">{internalRatio}%</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500"
                              style={{ width: `${internalRatio}%` }}
                            />
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            <strong>SMED 목표:</strong> 외단취 비율을 높여 내단취 시간을 최소화하세요.
                            이상적인 외단취 비율은 30% 이상입니다.
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
