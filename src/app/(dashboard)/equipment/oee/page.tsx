"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calculator, ClipboardList, Building2, History, Save, BarChart3 } from "lucide-react";

// Types for OEE data
interface OEEDataEntry {
  id: number;
  measurementDate: string; // 측정일
  equipmentName: string; // 설비명
  loadTime: number; // 부하시간 (총 가용시간) - minutes
  operatingTime: number; // 가동시간 (실제 가동) - minutes
  plannedDowntime: number; // 계획정지 - minutes
  unplannedDowntime: number; // 비계획정지 - minutes
  productionQuantity: number; // 생산수량
  goodQuantity: number; // 양품수량
  defectQuantity: number; // 불량수량
  theoreticalCycleTime: number; // 이론 사이클타임 (초/개)
}

interface OEEResult {
  availability: number; // 가동률
  performance: number; // 성능률
  quality: number; // 양품률
  oee: number; // OEE
}

interface EquipmentOEESummary {
  equipmentName: string;
  avgAvailability: number;
  avgPerformance: number;
  avgQuality: number;
  avgOEE: number;
  entryCount: number;
}

interface SixBigLoss {
  equipmentName: string;
  equipmentFailure: number; // 설비 고장
  setupAdjustment: number; // 설정 및 조정
  idlingMinorStops: number; // 공회전 및 순간정지
  reducedSpeed: number; // 속도저하
  processDefects: number; // 공정불량
  reducedYield: number; // 수율 저하
}

export default function OEEPage() {
  const [activeTab, setActiveTab] = useState("entry");

  // OEE data entries
  const [entries, setEntries] = useState<OEEDataEntry[]>([]);

  // Form state for new entry
  const [newEntry, setNewEntry] = useState<Omit<OEEDataEntry, "id">>({
    measurementDate: new Date().toISOString().slice(0, 10),
    equipmentName: "",
    loadTime: 0,
    operatingTime: 0,
    plannedDowntime: 0,
    unplannedDowntime: 0,
    productionQuantity: 0,
    goodQuantity: 0,
    defectQuantity: 0,
    theoreticalCycleTime: 0,
  });

  // Equipment list for selection
  const equipmentOptions = [
    "CNC 선반 #1",
    "CNC 선반 #2",
    "프레스 기계 #1",
    "프레스 기계 #2",
    "용접 로봇 #1",
    "사출성형기 #1",
    "사출성형기 #2",
    "조립라인 #1",
    "조립라인 #2",
    "검사설비 #1",
  ];

  // Sample data for equipment comparison
  const [sampleEquipmentData] = useState<EquipmentOEESummary[]>([
    { equipmentName: "CNC 선반 #1", avgAvailability: 92.5, avgPerformance: 88.3, avgQuality: 98.2, avgOEE: 80.2, entryCount: 30 },
    { equipmentName: "CNC 선반 #2", avgAvailability: 89.2, avgPerformance: 85.1, avgQuality: 97.5, avgOEE: 74.0, entryCount: 28 },
    { equipmentName: "프레스 기계 #1", avgAvailability: 95.1, avgPerformance: 91.2, avgQuality: 99.1, avgOEE: 85.9, entryCount: 30 },
    { equipmentName: "프레스 기계 #2", avgAvailability: 88.5, avgPerformance: 82.4, avgQuality: 96.8, avgOEE: 70.6, entryCount: 25 },
    { equipmentName: "용접 로봇 #1", avgAvailability: 94.8, avgPerformance: 93.5, avgQuality: 99.5, avgOEE: 88.2, entryCount: 30 },
    { equipmentName: "사출성형기 #1", avgAvailability: 91.2, avgPerformance: 87.8, avgQuality: 98.0, avgOEE: 78.5, entryCount: 29 },
  ]);

  // Sample 6 Big Losses data
  const [sixBigLossesData] = useState<SixBigLoss[]>([
    { equipmentName: "CNC 선반 #1", equipmentFailure: 120, setupAdjustment: 45, idlingMinorStops: 30, reducedSpeed: 60, processDefects: 15, reducedYield: 8 },
    { equipmentName: "CNC 선반 #2", equipmentFailure: 180, setupAdjustment: 60, idlingMinorStops: 45, reducedSpeed: 90, processDefects: 25, reducedYield: 12 },
    { equipmentName: "프레스 기계 #1", equipmentFailure: 60, setupAdjustment: 30, idlingMinorStops: 20, reducedSpeed: 40, processDefects: 10, reducedYield: 5 },
    { equipmentName: "프레스 기계 #2", equipmentFailure: 200, setupAdjustment: 75, idlingMinorStops: 55, reducedSpeed: 110, processDefects: 30, reducedYield: 18 },
    { equipmentName: "용접 로봇 #1", equipmentFailure: 40, setupAdjustment: 25, idlingMinorStops: 15, reducedSpeed: 30, processDefects: 5, reducedYield: 3 },
    { equipmentName: "사출성형기 #1", equipmentFailure: 150, setupAdjustment: 55, idlingMinorStops: 40, reducedSpeed: 75, processDefects: 20, reducedYield: 10 },
  ]);

  // Calculate OEE for a single entry
  const calculateOEE = (entry: OEEDataEntry): OEEResult => {
    // 가동률 = 가동시간 / 부하시간
    const availability = entry.loadTime > 0 ? (entry.operatingTime / entry.loadTime) * 100 : 0;

    // 성능률 = (생산수량 x 이론CT) / 가동시간
    // Note: theoreticalCycleTime is in seconds, operatingTime is in minutes
    const theoreticalProductionTime = (entry.productionQuantity * entry.theoreticalCycleTime) / 60; // convert to minutes
    const performance = entry.operatingTime > 0 ? (theoreticalProductionTime / entry.operatingTime) * 100 : 0;

    // 양품률 = 양품수량 / 생산수량
    const quality = entry.productionQuantity > 0 ? (entry.goodQuantity / entry.productionQuantity) * 100 : 0;

    // OEE = 가동률 x 성능률 x 양품률
    const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

    return {
      availability: Math.min(availability, 100),
      performance: Math.min(performance, 100),
      quality: Math.min(quality, 100),
      oee: Math.min(oee, 100),
    };
  };

  // Calculate auto-computed values
  const computedValues = useMemo(() => {
    const totalDowntime = newEntry.plannedDowntime + newEntry.unplannedDowntime;
    const calculatedOperatingTime = newEntry.loadTime - totalDowntime;
    const calculatedDefects = newEntry.productionQuantity - newEntry.goodQuantity;

    return {
      totalDowntime,
      calculatedOperatingTime: Math.max(0, calculatedOperatingTime),
      calculatedDefects: Math.max(0, calculatedDefects),
    };
  }, [newEntry]);

  // Handle adding new entry
  const handleAddEntry = () => {
    if (!newEntry.equipmentName) {
      alert("설비명을 선택해주세요.");
      return;
    }
    if (newEntry.loadTime <= 0) {
      alert("부하시간을 입력해주세요.");
      return;
    }
    if (newEntry.theoreticalCycleTime <= 0) {
      alert("이론 사이클타임을 입력해주세요.");
      return;
    }

    const entry: OEEDataEntry = {
      id: Date.now(),
      ...newEntry,
      operatingTime: newEntry.operatingTime || computedValues.calculatedOperatingTime,
      defectQuantity: newEntry.defectQuantity || computedValues.calculatedDefects,
    };

    setEntries([entry, ...entries]);

    // Reset form
    setNewEntry({
      measurementDate: new Date().toISOString().slice(0, 10),
      equipmentName: "",
      loadTime: 0,
      operatingTime: 0,
      plannedDowntime: 0,
      unplannedDowntime: 0,
      productionQuantity: 0,
      goodQuantity: 0,
      defectQuantity: 0,
      theoreticalCycleTime: 0,
    });
  };

  // Handle deleting entry
  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // Get OEE badge variant
  const getOEEBadgeVariant = (oee: number): "success" | "warning" | "destructive" | "default" => {
    if (oee >= 85) return "success";
    if (oee >= 60) return "warning";
    return "destructive";
  };

  // Get OEE class based on world-class standards
  const getOEEClass = (oee: number): string => {
    if (oee >= 85) return "World Class";
    if (oee >= 75) return "Good";
    if (oee >= 60) return "Average";
    return "Low";
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (entries.length === 0) {
      return {
        avgAvailability: 0,
        avgPerformance: 0,
        avgQuality: 0,
        avgOEE: 0,
        totalEntries: 0,
      };
    }

    const results = entries.map((e) => calculateOEE(e));
    const avgAvailability = results.reduce((sum, r) => sum + r.availability, 0) / results.length;
    const avgPerformance = results.reduce((sum, r) => sum + r.performance, 0) / results.length;
    const avgQuality = results.reduce((sum, r) => sum + r.quality, 0) / results.length;
    const avgOEE = results.reduce((sum, r) => sum + r.oee, 0) / results.length;

    return {
      avgAvailability,
      avgPerformance,
      avgQuality,
      avgOEE,
      totalEntries: entries.length,
    };
  }, [entries]);

  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number): string => {
    if (minutes === 0) return "0분";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OEE (Overall Equipment Effectiveness)</h1>
          <p className="text-muted-foreground">설비종합효율 분석 - 가동률 x 성능률 x 양품률</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          평균 OEE: {summaryStats.avgOEE.toFixed(1)}%
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">평균 가동률</p>
            <p className="text-2xl font-bold text-blue-600">{summaryStats.avgAvailability.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= 가동시간 / 부하시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">평균 성능률</p>
            <p className="text-2xl font-bold text-green-600">{summaryStats.avgPerformance.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= (생산수량 x CT) / 가동시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">평균 양품률</p>
            <p className="text-2xl font-bold text-purple-600">{summaryStats.avgQuality.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= 양품수량 / 생산수량</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">평균 OEE</p>
            <p className="text-2xl font-bold">{summaryStats.avgOEE.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= 가동률 x 성능률 x 양품률</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">등록 건수</p>
            <p className="text-2xl font-bold">{summaryStats.totalEntries}건</p>
            <p className="text-xs text-muted-foreground mt-1">총 측정 데이터 수</p>
          </CardContent>
        </Card>
      </div>

      {/* OEE 기준 */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">OEE 판정 기준</p>
            <div className="flex gap-6 text-sm">
              <span className="text-green-600">World Class: 85% 이상</span>
              <span className="text-blue-600">Good: 75-85%</span>
              <span className="text-yellow-600">Average: 60-75%</span>
              <span className="text-red-600">Low: 60% 미만</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            OEE 데이터 입력
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            OEE 분석결과
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            설비별 비교
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            OEE 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: OEE 데이터 입력 */}
        <TabsContent value="entry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                OEE 데이터 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">기본 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>측정일 *</Label>
                    <Input
                      type="date"
                      value={newEntry.measurementDate}
                      onChange={(e) => setNewEntry({ ...newEntry, measurementDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설비명 *</Label>
                    <Select
                      value={newEntry.equipmentName}
                      onValueChange={(value) => setNewEntry({ ...newEntry, equipmentName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="설비 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentOptions.map((eq) => (
                          <SelectItem key={eq} value={eq}>
                            {eq}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Time Data */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">시간 데이터 (분)</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>부하시간 (총 가용시간) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.loadTime || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, loadTime: Number(e.target.value) })}
                      placeholder="분 단위"
                    />
                    <p className="text-xs text-muted-foreground">예: 480분 = 8시간</p>
                  </div>
                  <div className="space-y-2">
                    <Label>계획정지</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.plannedDowntime || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, plannedDowntime: Number(e.target.value) })}
                      placeholder="분 단위"
                    />
                    <p className="text-xs text-muted-foreground">정기점검, 휴식 등</p>
                  </div>
                  <div className="space-y-2">
                    <Label>비계획정지</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.unplannedDowntime || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, unplannedDowntime: Number(e.target.value) })}
                      placeholder="분 단위"
                    />
                    <p className="text-xs text-muted-foreground">고장, 자재대기 등</p>
                  </div>
                  <div className="space-y-2">
                    <Label>가동시간 (실제 가동)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.operatingTime || computedValues.calculatedOperatingTime || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, operatingTime: Number(e.target.value) })}
                      placeholder="자동계산"
                    />
                    <p className="text-xs text-muted-foreground">= 부하시간 - 정지시간</p>
                  </div>
                </div>
                {newEntry.loadTime > 0 && (
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <span className="text-muted-foreground">정지시간 합계:</span>
                    <span className="font-mono ml-2">{computedValues.totalDowntime}분</span>
                    <span className="mx-3">|</span>
                    <span className="text-muted-foreground">계산된 가동시간:</span>
                    <span className="font-mono ml-2">{computedValues.calculatedOperatingTime}분</span>
                  </div>
                )}
              </div>

              {/* Production Data */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">생산 데이터</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label>생산수량 *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.productionQuantity || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, productionQuantity: Number(e.target.value) })}
                      placeholder="개"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>양품수량 *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.goodQuantity || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, goodQuantity: Number(e.target.value) })}
                      placeholder="개"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>불량수량</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newEntry.defectQuantity || computedValues.calculatedDefects || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, defectQuantity: Number(e.target.value) })}
                      placeholder="자동계산"
                    />
                    <p className="text-xs text-muted-foreground">= 생산수량 - 양품수량</p>
                  </div>
                  <div className="space-y-2">
                    <Label>이론 사이클타임 (초/개) *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newEntry.theoreticalCycleTime || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, theoreticalCycleTime: Number(e.target.value) })}
                      placeholder="초"
                    />
                    <p className="text-xs text-muted-foreground">제품 1개당 이론시간</p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {newEntry.loadTime > 0 && newEntry.productionQuantity > 0 && newEntry.theoreticalCycleTime > 0 && (
                <div className="p-4 bg-primary/5 border rounded-lg">
                  <h3 className="font-semibold mb-3">OEE 미리보기</h3>
                  {(() => {
                    const previewEntry: OEEDataEntry = {
                      id: 0,
                      ...newEntry,
                      operatingTime: newEntry.operatingTime || computedValues.calculatedOperatingTime,
                      defectQuantity: newEntry.defectQuantity || computedValues.calculatedDefects,
                    };
                    const result = calculateOEE(previewEntry);
                    return (
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm text-muted-foreground">가동률</p>
                          <p className="text-xl font-bold text-blue-600">{result.availability.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">성능률</p>
                          <p className="text-xl font-bold text-green-600">{result.performance.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">양품률</p>
                          <p className="text-xl font-bold text-purple-600">{result.quality.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">OEE</p>
                          <p className="text-xl font-bold">{result.oee.toFixed(1)}%</p>
                          <Badge variant={getOEEBadgeVariant(result.oee)} className="mt-1">
                            {getOEEClass(result.oee)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Add Button */}
              <div className="flex justify-end">
                <Button onClick={handleAddEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  데이터 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: OEE 분석결과 */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {entries.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>분석할 데이터가 없습니다.</p>
                  <p className="text-sm mt-2">OEE 데이터 입력 탭에서 데이터를 추가해주세요.</p>
                  <Button className="mt-4" onClick={() => setActiveTab("entry")}>
                    데이터 입력하기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* OEE Formula Explanation */}
                <Card>
                  <CardHeader>
                    <CardTitle>OEE 계산 공식</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                          <p className="font-semibold text-blue-700 dark:text-blue-400">가동률 (Availability)</p>
                          <p className="text-lg font-mono mt-2">= 가동시간 / 부하시간 x 100</p>
                          <p className="text-sm text-muted-foreground mt-1">설비가 실제로 가동된 시간 비율</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                          <p className="font-semibold text-green-700 dark:text-green-400">성능률 (Performance)</p>
                          <p className="text-lg font-mono mt-2">= (생산수량 x 이론CT) / 가동시간 x 100</p>
                          <p className="text-sm text-muted-foreground mt-1">이론적 생산능력 대비 실제 생산 비율</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                          <p className="font-semibold text-purple-700 dark:text-purple-400">양품률 (Quality)</p>
                          <p className="text-lg font-mono mt-2">= 양품수량 / 생산수량 x 100</p>
                          <p className="text-sm text-muted-foreground mt-1">생산품 중 양품 비율</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-primary/10">
                          <p className="font-semibold">OEE (Overall Equipment Effectiveness)</p>
                          <p className="text-lg font-mono mt-2">= 가동률 x 성능률 x 양품률</p>
                          <p className="text-sm text-muted-foreground mt-1">설비종합효율</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Results Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>분석 결과 상세</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>측정일</TableHead>
                          <TableHead>설비명</TableHead>
                          <TableHead className="text-right">부하시간</TableHead>
                          <TableHead className="text-right">가동시간</TableHead>
                          <TableHead className="text-right">생산수량</TableHead>
                          <TableHead className="text-right">양품수량</TableHead>
                          <TableHead className="text-right">가동률</TableHead>
                          <TableHead className="text-right">성능률</TableHead>
                          <TableHead className="text-right">양품률</TableHead>
                          <TableHead className="text-right">OEE</TableHead>
                          <TableHead>등급</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => {
                          const result = calculateOEE(entry);
                          return (
                            <TableRow key={entry.id}>
                              <TableCell className="font-mono">{entry.measurementDate}</TableCell>
                              <TableCell>{entry.equipmentName}</TableCell>
                              <TableCell className="text-right font-mono">{entry.loadTime}</TableCell>
                              <TableCell className="text-right font-mono">{entry.operatingTime}</TableCell>
                              <TableCell className="text-right font-mono">{entry.productionQuantity.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-mono">{entry.goodQuantity.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-mono text-blue-600">{result.availability.toFixed(1)}%</TableCell>
                              <TableCell className="text-right font-mono text-green-600">{result.performance.toFixed(1)}%</TableCell>
                              <TableCell className="text-right font-mono text-purple-600">{result.quality.toFixed(1)}%</TableCell>
                              <TableCell className="text-right font-mono font-bold">{result.oee.toFixed(1)}%</TableCell>
                              <TableCell>
                                <Badge variant={getOEEBadgeVariant(result.oee)}>
                                  {getOEEClass(result.oee)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {/* Average Row */}
                        <TableRow className="bg-muted/50 font-semibold">
                          <TableCell colSpan={6} className="text-right">평균</TableCell>
                          <TableCell className="text-right font-mono text-blue-600">{summaryStats.avgAvailability.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono text-green-600">{summaryStats.avgPerformance.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono text-purple-600">{summaryStats.avgQuality.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono font-bold">{summaryStats.avgOEE.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant={getOEEBadgeVariant(summaryStats.avgOEE)}>
                              {getOEEClass(summaryStats.avgOEE)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: 설비별 비교 */}
        <TabsContent value="comparison">
          <div className="space-y-6">
            {/* Equipment OEE Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  설비별 OEE 순위
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">순위</TableHead>
                      <TableHead>설비명</TableHead>
                      <TableHead className="text-right">평균 가동률</TableHead>
                      <TableHead className="text-right">평균 성능률</TableHead>
                      <TableHead className="text-right">평균 양품률</TableHead>
                      <TableHead className="text-right">평균 OEE</TableHead>
                      <TableHead>등급</TableHead>
                      <TableHead className="text-right">측정 횟수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...sampleEquipmentData]
                      .sort((a, b) => b.avgOEE - a.avgOEE)
                      .map((eq, index) => (
                        <TableRow key={eq.equipmentName}>
                          <TableCell className="font-bold">
                            {index === 0 ? (
                              <span className="text-yellow-500">1</span>
                            ) : index === 1 ? (
                              <span className="text-gray-400">2</span>
                            ) : index === 2 ? (
                              <span className="text-orange-400">3</span>
                            ) : (
                              index + 1
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{eq.equipmentName}</TableCell>
                          <TableCell className="text-right font-mono text-blue-600">{eq.avgAvailability.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono text-green-600">{eq.avgPerformance.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono text-purple-600">{eq.avgQuality.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono font-bold">{eq.avgOEE.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant={getOEEBadgeVariant(eq.avgOEE)}>
                              {getOEEClass(eq.avgOEE)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{eq.entryCount}회</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 6 Big Losses Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>6대 로스 분석 (분)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-semibold mb-2">6대 로스 (Six Big Losses)</p>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">가동 로스 (Downtime Losses)</p>
                      <p>1. 설비 고장 | 2. 설정 및 조정</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">속도 로스 (Speed Losses)</p>
                      <p>3. 공회전/순간정지 | 4. 속도저하</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">품질 로스 (Quality Losses)</p>
                      <p>5. 공정불량 | 6. 수율 저하</p>
                    </div>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>설비명</TableHead>
                      <TableHead className="text-right">설비 고장</TableHead>
                      <TableHead className="text-right">설정/조정</TableHead>
                      <TableHead className="text-right">공회전/순간정지</TableHead>
                      <TableHead className="text-right">속도저하</TableHead>
                      <TableHead className="text-right">공정불량</TableHead>
                      <TableHead className="text-right">수율 저하</TableHead>
                      <TableHead className="text-right">총 로스</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sixBigLossesData.map((loss) => {
                      const totalLoss =
                        loss.equipmentFailure +
                        loss.setupAdjustment +
                        loss.idlingMinorStops +
                        loss.reducedSpeed +
                        loss.processDefects +
                        loss.reducedYield;
                      return (
                        <TableRow key={loss.equipmentName}>
                          <TableCell className="font-medium">{loss.equipmentName}</TableCell>
                          <TableCell className="text-right font-mono text-red-600">{loss.equipmentFailure}</TableCell>
                          <TableCell className="text-right font-mono text-orange-600">{loss.setupAdjustment}</TableCell>
                          <TableCell className="text-right font-mono text-yellow-600">{loss.idlingMinorStops}</TableCell>
                          <TableCell className="text-right font-mono text-blue-600">{loss.reducedSpeed}</TableCell>
                          <TableCell className="text-right font-mono text-purple-600">{loss.processDefects}</TableCell>
                          <TableCell className="text-right font-mono text-pink-600">{loss.reducedYield}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{totalLoss}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Loss Summary */}
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">최다 설비 고장</h4>
                    {(() => {
                      const worst = sixBigLossesData.reduce((prev, curr) =>
                        curr.equipmentFailure > prev.equipmentFailure ? curr : prev
                      );
                      return (
                        <div>
                          <p className="font-medium">{worst.equipmentName}</p>
                          <p className="text-2xl font-bold text-red-600 mt-1">{worst.equipmentFailure}분</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">최다 속도저하</h4>
                    {(() => {
                      const worst = sixBigLossesData.reduce((prev, curr) =>
                        curr.reducedSpeed > prev.reducedSpeed ? curr : prev
                      );
                      return (
                        <div>
                          <p className="font-medium">{worst.equipmentName}</p>
                          <p className="text-2xl font-bold text-yellow-600 mt-1">{worst.reducedSpeed}분</p>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">최소 총 로스</h4>
                    {(() => {
                      const best = sixBigLossesData.reduce((prev, curr) => {
                        const prevTotal =
                          prev.equipmentFailure + prev.setupAdjustment + prev.idlingMinorStops +
                          prev.reducedSpeed + prev.processDefects + prev.reducedYield;
                        const currTotal =
                          curr.equipmentFailure + curr.setupAdjustment + curr.idlingMinorStops +
                          curr.reducedSpeed + curr.processDefects + curr.reducedYield;
                        return currTotal < prevTotal ? curr : prev;
                      });
                      const totalLoss =
                        best.equipmentFailure + best.setupAdjustment + best.idlingMinorStops +
                        best.reducedSpeed + best.processDefects + best.reducedYield;
                      return (
                        <div>
                          <p className="font-medium">{best.equipmentName}</p>
                          <p className="text-2xl font-bold text-green-600 mt-1">{totalLoss}분</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best/Worst Equipment */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/10">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">최고 OEE 설비</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const best = sampleEquipmentData.reduce((prev, curr) =>
                      curr.avgOEE > prev.avgOEE ? curr : prev
                    );
                    return (
                      <div className="space-y-3">
                        <p className="text-xl font-semibold">{best.equipmentName}</p>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">평균 OEE:</span>
                            <span className="font-bold text-green-600">{best.avgOEE.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">가동률:</span>
                            <span>{best.avgAvailability.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">성능률:</span>
                            <span>{best.avgPerformance.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">양품률:</span>
                            <span>{best.avgQuality.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
              <Card className="border-red-500/50 bg-red-50/50 dark:bg-red-950/10">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-400">개선필요 설비 (최저 OEE)</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const worst = sampleEquipmentData.reduce((prev, curr) =>
                      curr.avgOEE < prev.avgOEE ? curr : prev
                    );
                    return (
                      <div className="space-y-3">
                        <p className="text-xl font-semibold">{worst.equipmentName}</p>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">평균 OEE:</span>
                            <span className="font-bold text-red-600">{worst.avgOEE.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">가동률:</span>
                            <span>{worst.avgAvailability.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">성능률:</span>
                            <span>{worst.avgPerformance.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">양품률:</span>
                            <span>{worst.avgQuality.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: OEE 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                OEE 이력 ({entries.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 OEE 데이터가 없습니다.</p>
                  <p className="text-sm mt-2">OEE 데이터 입력 탭에서 데이터를 추가해주세요.</p>
                  <Button className="mt-4" onClick={() => setActiveTab("entry")}>
                    데이터 입력하기
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>측정일</TableHead>
                      <TableHead>설비명</TableHead>
                      <TableHead className="text-right">부하시간</TableHead>
                      <TableHead className="text-right">가동시간</TableHead>
                      <TableHead className="text-right">정지시간</TableHead>
                      <TableHead className="text-right">생산수량</TableHead>
                      <TableHead className="text-right">양품수량</TableHead>
                      <TableHead className="text-right">불량수량</TableHead>
                      <TableHead className="text-right">CT (초)</TableHead>
                      <TableHead className="text-right">가동률</TableHead>
                      <TableHead className="text-right">성능률</TableHead>
                      <TableHead className="text-right">양품률</TableHead>
                      <TableHead className="text-right">OEE</TableHead>
                      <TableHead>등급</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => {
                      const result = calculateOEE(entry);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-mono">{entry.measurementDate}</TableCell>
                          <TableCell>{entry.equipmentName}</TableCell>
                          <TableCell className="text-right font-mono">{entry.loadTime}</TableCell>
                          <TableCell className="text-right font-mono">{entry.operatingTime}</TableCell>
                          <TableCell className="text-right font-mono">{entry.plannedDowntime + entry.unplannedDowntime}</TableCell>
                          <TableCell className="text-right font-mono">{entry.productionQuantity.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono">{entry.goodQuantity.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono">{entry.defectQuantity}</TableCell>
                          <TableCell className="text-right font-mono">{entry.theoreticalCycleTime}</TableCell>
                          <TableCell className="text-right font-mono text-blue-600">{result.availability.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono text-green-600">{result.performance.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono text-purple-600">{result.quality.toFixed(1)}%</TableCell>
                          <TableCell className="text-right font-mono font-bold">{result.oee.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant={getOEEBadgeVariant(result.oee)}>
                              {getOEEClass(result.oee)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
