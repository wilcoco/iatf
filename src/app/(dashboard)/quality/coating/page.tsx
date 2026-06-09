"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Plus,
  Save,
  Search,
  Calendar,
  BarChart3,
  History,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

// Types
interface CoatingMeasurement {
  id: number;
  measureDate: string;
  measureTime: string;
  partNo: string;
  partName: string;
  lotNo: string;
  position1: string;
  position2: string;
  position3: string;
  position4: string;
  position5: string;
  average: string;
  minSpec: string;
  maxSpec: string;
  result: "pass" | "fail";
  measurer: string;
  remarks: string;
}

interface ColorimeterCalibration {
  id: number;
  calibrationDate: string;
  equipmentNo: string;
  equipmentName: string;
  beforeL: string;
  beforeA: string;
  beforeB: string;
  afterL: string;
  afterA: string;
  afterB: string;
  standardL: string;
  standardA: string;
  standardB: string;
  deviationL: string;
  deviationA: string;
  deviationB: string;
  result: "pass" | "fail";
  calibrator: string;
  remarks: string;
}

// Sample data
const sampleMeasurements: CoatingMeasurement[] = [
  {
    id: 1,
    measureDate: "2026-06-10",
    measureTime: "09:00",
    partNo: "PT-001",
    partName: "프론트 범퍼",
    lotNo: "LOT-2026061001",
    position1: "25.3",
    position2: "24.8",
    position3: "25.1",
    position4: "24.9",
    position5: "25.2",
    average: "25.1",
    minSpec: "20",
    maxSpec: "30",
    result: "pass",
    measurer: "김도장",
    remarks: "",
  },
  {
    id: 2,
    measureDate: "2026-06-10",
    measureTime: "10:30",
    partNo: "PT-002",
    partName: "사이드 미러 커버",
    lotNo: "LOT-2026061002",
    position1: "22.1",
    position2: "23.5",
    position3: "22.8",
    position4: "23.2",
    position5: "22.6",
    average: "22.8",
    minSpec: "20",
    maxSpec: "30",
    result: "pass",
    measurer: "김도장",
    remarks: "",
  },
  {
    id: 3,
    measureDate: "2026-06-09",
    measureTime: "14:00",
    partNo: "PT-003",
    partName: "리어 스포일러",
    lotNo: "LOT-2026060901",
    position1: "31.2",
    position2: "32.1",
    position3: "30.8",
    position4: "31.5",
    position5: "31.0",
    average: "31.3",
    minSpec: "20",
    maxSpec: "30",
    result: "fail",
    measurer: "박도장",
    remarks: "두께 초과 - 재작업 필요",
  },
];

const sampleCalibrations: ColorimeterCalibration[] = [
  {
    id: 1,
    calibrationDate: "2026-06-10",
    equipmentNo: "CM-001",
    equipmentName: "색차계 1호기",
    beforeL: "94.8",
    beforeA: "0.12",
    beforeB: "0.08",
    afterL: "95.0",
    afterA: "0.10",
    afterB: "0.05",
    standardL: "95.0",
    standardA: "0.10",
    standardB: "0.05",
    deviationL: "0.0",
    deviationA: "0.00",
    deviationB: "0.00",
    result: "pass",
    calibrator: "이품질",
    remarks: "",
  },
  {
    id: 2,
    calibrationDate: "2026-06-09",
    equipmentNo: "CM-002",
    equipmentName: "색차계 2호기",
    beforeL: "94.5",
    beforeA: "0.15",
    beforeB: "0.12",
    afterL: "94.9",
    afterA: "0.11",
    afterB: "0.06",
    standardL: "95.0",
    standardA: "0.10",
    standardB: "0.05",
    deviationL: "-0.1",
    deviationA: "0.01",
    deviationB: "0.01",
    result: "pass",
    calibrator: "이품질",
    remarks: "미세 편차 존재하나 허용범위 내",
  },
];

// Initial form states
const initialMeasurementForm = {
  measureDate: new Date().toISOString().split("T")[0],
  measureTime: new Date().toTimeString().slice(0, 5),
  partNo: "",
  partName: "",
  lotNo: "",
  position1: "",
  position2: "",
  position3: "",
  position4: "",
  position5: "",
  minSpec: "20",
  maxSpec: "30",
  measurer: "",
  remarks: "",
};

const initialCalibrationForm = {
  calibrationDate: new Date().toISOString().split("T")[0],
  equipmentNo: "",
  equipmentName: "",
  beforeL: "",
  beforeA: "",
  beforeB: "",
  afterL: "",
  afterA: "",
  afterB: "",
  standardL: "95.0",
  standardA: "0.10",
  standardB: "0.05",
  calibrator: "",
  remarks: "",
};

export default function CoatingInspectionPage() {
  const [activeTab, setActiveTab] = useState("thickness");
  const [measurements, setMeasurements] = useState<CoatingMeasurement[]>(sampleMeasurements);
  const [calibrations, setCalibrations] = useState<ColorimeterCalibration[]>(sampleCalibrations);
  const [measurementForm, setMeasurementForm] = useState(initialMeasurementForm);
  const [calibrationForm, setCalibrationForm] = useState(initialCalibrationForm);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showCalibrationForm, setShowCalibrationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPartNo, setFilterPartNo] = useState("");
  const [filterResult, setFilterResult] = useState<"all" | "pass" | "fail">("all");
  const [historyDateRange, setHistoryDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  // Calculate average for thickness measurement
  const calculateAverage = () => {
    const values = [
      measurementForm.position1,
      measurementForm.position2,
      measurementForm.position3,
      measurementForm.position4,
      measurementForm.position5,
    ]
      .filter((v) => v)
      .map((v) => parseFloat(v));
    if (values.length === 0) return "";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  // Calculate deviation for colorimeter
  const calculateDeviation = (after: string, standard: string) => {
    const afterVal = parseFloat(after) || 0;
    const standardVal = parseFloat(standard) || 0;
    return (afterVal - standardVal).toFixed(2);
  };

  // Handle measurement form submit
  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const average = calculateAverage();
    const avgNum = parseFloat(average) || 0;
    const minSpec = parseFloat(measurementForm.minSpec) || 20;
    const maxSpec = parseFloat(measurementForm.maxSpec) || 30;
    const result: "pass" | "fail" = avgNum >= minSpec && avgNum <= maxSpec ? "pass" : "fail";

    const newMeasurement: CoatingMeasurement = {
      id: Date.now(),
      measureDate: measurementForm.measureDate,
      measureTime: measurementForm.measureTime,
      partNo: measurementForm.partNo,
      partName: measurementForm.partName,
      lotNo: measurementForm.lotNo,
      position1: measurementForm.position1,
      position2: measurementForm.position2,
      position3: measurementForm.position3,
      position4: measurementForm.position4,
      position5: measurementForm.position5,
      average,
      minSpec: measurementForm.minSpec,
      maxSpec: measurementForm.maxSpec,
      result,
      measurer: measurementForm.measurer,
      remarks: measurementForm.remarks,
    };
    setMeasurements([newMeasurement, ...measurements]);
    setShowMeasurementForm(false);
    setMeasurementForm(initialMeasurementForm);
    alert("도막두께 측정 기록이 저장되었습니다.");
  };

  // Handle calibration form submit
  const handleCalibrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deviationL = calculateDeviation(calibrationForm.afterL, calibrationForm.standardL);
    const deviationA = calculateDeviation(calibrationForm.afterA, calibrationForm.standardA);
    const deviationB = calculateDeviation(calibrationForm.afterB, calibrationForm.standardB);

    // Check if deviations are within tolerance (e.g., +-0.5 for L, +-0.05 for a/b)
    const isPass =
      Math.abs(parseFloat(deviationL)) <= 0.5 &&
      Math.abs(parseFloat(deviationA)) <= 0.05 &&
      Math.abs(parseFloat(deviationB)) <= 0.05;

    const newCalibration: ColorimeterCalibration = {
      id: Date.now(),
      calibrationDate: calibrationForm.calibrationDate,
      equipmentNo: calibrationForm.equipmentNo,
      equipmentName: calibrationForm.equipmentName,
      beforeL: calibrationForm.beforeL,
      beforeA: calibrationForm.beforeA,
      beforeB: calibrationForm.beforeB,
      afterL: calibrationForm.afterL,
      afterA: calibrationForm.afterA,
      afterB: calibrationForm.afterB,
      standardL: calibrationForm.standardL,
      standardA: calibrationForm.standardA,
      standardB: calibrationForm.standardB,
      deviationL,
      deviationA,
      deviationB,
      result: isPass ? "pass" : "fail",
      calibrator: calibrationForm.calibrator,
      remarks: calibrationForm.remarks,
    };
    setCalibrations([newCalibration, ...calibrations]);
    setShowCalibrationForm(false);
    setCalibrationForm(initialCalibrationForm);
    alert("색차계 교정 기록이 저장되었습니다.");
  };

  // Filter measurements for history
  const filteredMeasurements = measurements.filter((m) => {
    const matchesDate =
      m.measureDate >= historyDateRange.start && m.measureDate <= historyDateRange.end;
    const matchesPart = !filterPartNo || m.partNo.includes(filterPartNo);
    const matchesResult = filterResult === "all" || m.result === filterResult;
    return matchesDate && matchesPart && matchesResult;
  });

  // Get unique part numbers for filter
  const uniquePartNos = [...new Set(measurements.map((m) => m.partNo))];

  // Calculate statistics
  const calculateStatistics = () => {
    if (filteredMeasurements.length === 0) {
      return {
        totalCount: 0,
        passCount: 0,
        failCount: 0,
        passRate: 0,
        avgThickness: 0,
        minThickness: 0,
        maxThickness: 0,
        stdDev: 0,
        cpk: 0,
      };
    }

    const passCount = filteredMeasurements.filter((m) => m.result === "pass").length;
    const failCount = filteredMeasurements.filter((m) => m.result === "fail").length;
    const averages = filteredMeasurements.map((m) => parseFloat(m.average) || 0);
    const avgThickness = averages.reduce((a, b) => a + b, 0) / averages.length;
    const minThickness = Math.min(...averages);
    const maxThickness = Math.max(...averages);

    // Calculate standard deviation
    const squaredDiffs = averages.map((val) => Math.pow(val - avgThickness, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);

    // Calculate Cpk (using typical spec of 20-30)
    const usl = 30;
    const lsl = 20;
    const cpupper = (usl - avgThickness) / (3 * stdDev);
    const cplower = (avgThickness - lsl) / (3 * stdDev);
    const cpk = Math.min(cpupper, cplower);

    return {
      totalCount: filteredMeasurements.length,
      passCount,
      failCount,
      passRate: (passCount / filteredMeasurements.length) * 100,
      avgThickness,
      minThickness,
      maxThickness,
      stdDev,
      cpk: isFinite(cpk) ? cpk : 0,
    };
  };

  const stats = calculateStatistics();

  // Daily/Weekly statistics for chart data
  const getDailyStats = () => {
    const dailyData: { [key: string]: { total: number; sum: number; count: number } } = {};
    filteredMeasurements.forEach((m) => {
      const date = m.measureDate;
      if (!dailyData[date]) {
        dailyData[date] = { total: 0, sum: 0, count: 0 };
      }
      dailyData[date].total++;
      dailyData[date].sum += parseFloat(m.average) || 0;
      dailyData[date].count++;
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        count: data.total,
        average: data.sum / data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const dailyStats = getDailyStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">도막 검사 관리</h1>
          <p className="text-muted-foreground">
            도막두께 및 색차계 교정 일간 관리
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="thickness">
            <Gauge className="mr-2 h-4 w-4" />
            일일 도막두께 측정
          </TabsTrigger>
          <TabsTrigger value="colorimeter">
            <Settings className="mr-2 h-4 w-4" />
            색차계 교정기록
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            측정 이력
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="mr-2 h-4 w-4" />
            통계 분석
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 일일 도막두께 측정 */}
        <TabsContent value="thickness">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowMeasurementForm(!showMeasurementForm)}>
                <Plus className="mr-2 h-4 w-4" />
                측정 등록
              </Button>
            </div>

            {showMeasurementForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    도막두께 측정 등록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMeasurementSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>측정일 *</Label>
                        <Input
                          type="date"
                          value={measurementForm.measureDate}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, measureDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정시간 *</Label>
                        <Input
                          type="time"
                          value={measurementForm.measureTime}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, measureTime: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={measurementForm.partNo}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, partNo: e.target.value })
                          }
                          placeholder="품번"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품명 *</Label>
                        <Input
                          value={measurementForm.partName}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, partName: e.target.value })
                          }
                          placeholder="품명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lot번호 *</Label>
                        <Input
                          value={measurementForm.lotNo}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, lotNo: e.target.value })
                          }
                          placeholder="Lot번호"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>측정부위별 측정값 (um) - 1~5 포인트</Label>
                      <div className="grid gap-4 md:grid-cols-6">
                        {[1, 2, 3, 4, 5].map((pos) => (
                          <div key={pos} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">포인트 {pos}</Label>
                            <Input
                              value={measurementForm[`position${pos}` as keyof typeof measurementForm]}
                              onChange={(e) =>
                                setMeasurementForm({
                                  ...measurementForm,
                                  [`position${pos}`]: e.target.value,
                                })
                              }
                              placeholder="0.0"
                              type="number"
                              step="0.1"
                            />
                          </div>
                        ))}
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">평균</Label>
                          <Input value={calculateAverage()} disabled className="bg-muted font-bold" />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>규격 하한 (um)</Label>
                        <Input
                          value={measurementForm.minSpec}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, minSpec: e.target.value })
                          }
                          placeholder="20"
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>규격 상한 (um)</Label>
                        <Input
                          value={measurementForm.maxSpec}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, maxSpec: e.target.value })
                          }
                          placeholder="30"
                          type="number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정자 *</Label>
                        <Input
                          value={measurementForm.measurer}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, measurer: e.target.value })
                          }
                          placeholder="측정자명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={measurementForm.remarks}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, remarks: e.target.value })
                          }
                          placeholder="특이사항"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMeasurementForm(false)}
                      >
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
                  <Calendar className="h-5 w-5" />
                  오늘의 도막두께 측정 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                {measurements.filter((m) => m.measureDate === new Date().toISOString().split("T")[0])
                  .length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">오늘 측정 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>측정시간</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead className="text-center">측정값 (1~5)</TableHead>
                        <TableHead>평균</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>측정자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {measurements
                        .filter((m) => m.measureDate === new Date().toISOString().split("T")[0])
                        .map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>{m.measureTime}</TableCell>
                            <TableCell className="font-mono">{m.partNo}</TableCell>
                            <TableCell>{m.partName}</TableCell>
                            <TableCell className="font-mono text-xs">{m.lotNo}</TableCell>
                            <TableCell className="text-center font-mono text-xs">
                              {[m.position1, m.position2, m.position3, m.position4, m.position5]
                                .filter((v) => v)
                                .join(" / ")}
                            </TableCell>
                            <TableCell className="font-mono font-bold">{m.average}</TableCell>
                            <TableCell className="text-xs">
                              {m.minSpec}~{m.maxSpec}
                            </TableCell>
                            <TableCell>
                              <Badge variant={m.result === "pass" ? "success" : "destructive"}>
                                {m.result === "pass" ? (
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3" />
                                )}
                                {m.result === "pass" ? "합격" : "불합격"}
                              </Badge>
                            </TableCell>
                            <TableCell>{m.measurer}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 색차계 교정기록 */}
        <TabsContent value="colorimeter">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowCalibrationForm(!showCalibrationForm)}>
                <Plus className="mr-2 h-4 w-4" />
                교정 등록
              </Button>
            </div>

            {showCalibrationForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    색차계 교정 등록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCalibrationSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>교정일 *</Label>
                        <Input
                          type="date"
                          value={calibrationForm.calibrationDate}
                          onChange={(e) =>
                            setCalibrationForm({
                              ...calibrationForm,
                              calibrationDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>장비번호 *</Label>
                        <Input
                          value={calibrationForm.equipmentNo}
                          onChange={(e) =>
                            setCalibrationForm({ ...calibrationForm, equipmentNo: e.target.value })
                          }
                          placeholder="CM-XXX"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>장비명</Label>
                        <Input
                          value={calibrationForm.equipmentName}
                          onChange={(e) =>
                            setCalibrationForm({
                              ...calibrationForm,
                              equipmentName: e.target.value,
                            })
                          }
                          placeholder="색차계 X호기"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">교정 전 값</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="w-8">L*</Label>
                            <Input
                              value={calibrationForm.beforeL}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, beforeL: e.target.value })
                              }
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="w-8">a*</Label>
                            <Input
                              value={calibrationForm.beforeA}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, beforeA: e.target.value })
                              }
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="w-8">b*</Label>
                            <Input
                              value={calibrationForm.beforeB}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, beforeB: e.target.value })
                              }
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-medium mb-3">교정 후 값</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="w-8">L*</Label>
                            <Input
                              value={calibrationForm.afterL}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, afterL: e.target.value })
                              }
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="w-8">a*</Label>
                            <Input
                              value={calibrationForm.afterA}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, afterA: e.target.value })
                              }
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="w-8">b*</Label>
                            <Input
                              value={calibrationForm.afterB}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, afterB: e.target.value })
                              }
                              placeholder="0.00"
                              type="number"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <h4 className="font-medium mb-3">기준값</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label className="w-8">L*</Label>
                            <Input
                              value={calibrationForm.standardL}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, standardL: e.target.value })
                              }
                              placeholder="95.0"
                              type="number"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="w-8">a*</Label>
                            <Input
                              value={calibrationForm.standardA}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, standardA: e.target.value })
                              }
                              placeholder="0.10"
                              type="number"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="w-8">b*</Label>
                            <Input
                              value={calibrationForm.standardB}
                              onChange={(e) =>
                                setCalibrationForm({ ...calibrationForm, standardB: e.target.value })
                              }
                              placeholder="0.05"
                              type="number"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>교정자 *</Label>
                        <Input
                          value={calibrationForm.calibrator}
                          onChange={(e) =>
                            setCalibrationForm({ ...calibrationForm, calibrator: e.target.value })
                          }
                          placeholder="교정자명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={calibrationForm.remarks}
                          onChange={(e) =>
                            setCalibrationForm({ ...calibrationForm, remarks: e.target.value })
                          }
                          placeholder="특이사항"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCalibrationForm(false)}
                      >
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
                  <Settings className="h-5 w-5" />
                  색차계 교정 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                {calibrations.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">교정 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>교정일</TableHead>
                        <TableHead>장비번호</TableHead>
                        <TableHead>장비명</TableHead>
                        <TableHead className="text-center">교정 전 (L*/a*/b*)</TableHead>
                        <TableHead className="text-center">교정 후 (L*/a*/b*)</TableHead>
                        <TableHead className="text-center">기준값 대비 편차</TableHead>
                        <TableHead>결과</TableHead>
                        <TableHead>교정자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calibrations.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>{c.calibrationDate}</TableCell>
                          <TableCell className="font-mono">{c.equipmentNo}</TableCell>
                          <TableCell>{c.equipmentName}</TableCell>
                          <TableCell className="text-center font-mono text-xs">
                            {c.beforeL} / {c.beforeA} / {c.beforeB}
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs">
                            {c.afterL} / {c.afterA} / {c.afterB}
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs">
                            <span
                              className={
                                Math.abs(parseFloat(c.deviationL)) > 0.3 ? "text-red-600" : ""
                              }
                            >
                              {c.deviationL}
                            </span>{" "}
                            /{" "}
                            <span
                              className={
                                Math.abs(parseFloat(c.deviationA)) > 0.03 ? "text-red-600" : ""
                              }
                            >
                              {c.deviationA}
                            </span>{" "}
                            /{" "}
                            <span
                              className={
                                Math.abs(parseFloat(c.deviationB)) > 0.03 ? "text-red-600" : ""
                              }
                            >
                              {c.deviationB}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={c.result === "pass" ? "success" : "destructive"}>
                              {c.result === "pass" ? "합격" : "불합격"}
                            </Badge>
                          </TableCell>
                          <TableCell>{c.calibrator}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 측정 이력 */}
        <TabsContent value="history">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    검색 조건
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>시작일</Label>
                    <Input
                      type="date"
                      value={historyDateRange.start}
                      onChange={(e) =>
                        setHistoryDateRange({ ...historyDateRange, start: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>종료일</Label>
                    <Input
                      type="date"
                      value={historyDateRange.end}
                      onChange={(e) =>
                        setHistoryDateRange({ ...historyDateRange, end: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품번 필터</Label>
                    <Select value={filterPartNo} onValueChange={setFilterPartNo}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">전체</SelectItem>
                        {uniquePartNos.map((partNo) => (
                          <SelectItem key={partNo} value={partNo}>
                            {partNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>결과 필터</Label>
                    <Select
                      value={filterResult}
                      onValueChange={(v) => setFilterResult(v as "all" | "pass" | "fail")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="pass">합격</SelectItem>
                        <SelectItem value="fail">불합격</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>검색어</Label>
                    <Input
                      placeholder="품번, 품명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fail history highlight */}
            {filteredMeasurements.filter((m) => m.result === "fail").length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    불합격 이력 ({filteredMeasurements.filter((m) => m.result === "fail").length}건)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>측정일</TableHead>
                        <TableHead>측정시간</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead>평균</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMeasurements
                        .filter((m) => m.result === "fail")
                        .map((m) => (
                          <TableRow key={m.id} className="bg-red-100">
                            <TableCell>{m.measureDate}</TableCell>
                            <TableCell>{m.measureTime}</TableCell>
                            <TableCell className="font-mono">{m.partNo}</TableCell>
                            <TableCell>{m.partName}</TableCell>
                            <TableCell className="font-mono text-xs">{m.lotNo}</TableCell>
                            <TableCell className="font-mono font-bold text-red-600">
                              {m.average}
                            </TableCell>
                            <TableCell className="text-xs">
                              {m.minSpec}~{m.maxSpec}
                            </TableCell>
                            <TableCell className="text-sm">{m.remarks}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  측정 이력 ({filteredMeasurements.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMeasurements.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    검색 조건에 맞는 측정 기록이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>측정일</TableHead>
                        <TableHead>측정시간</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead className="text-center">측정값 (1~5)</TableHead>
                        <TableHead>평균</TableHead>
                        <TableHead>규격</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>측정자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMeasurements.map((m) => (
                        <TableRow
                          key={m.id}
                          className={m.result === "fail" ? "bg-red-50" : undefined}
                        >
                          <TableCell>{m.measureDate}</TableCell>
                          <TableCell>{m.measureTime}</TableCell>
                          <TableCell className="font-mono">{m.partNo}</TableCell>
                          <TableCell>{m.partName}</TableCell>
                          <TableCell className="font-mono text-xs">{m.lotNo}</TableCell>
                          <TableCell className="text-center font-mono text-xs">
                            {[m.position1, m.position2, m.position3, m.position4, m.position5]
                              .filter((v) => v)
                              .join(" / ")}
                          </TableCell>
                          <TableCell className="font-mono font-bold">{m.average}</TableCell>
                          <TableCell className="text-xs">
                            {m.minSpec}~{m.maxSpec}
                          </TableCell>
                          <TableCell>
                            <Badge variant={m.result === "pass" ? "success" : "destructive"}>
                              {m.result === "pass" ? "합격" : "불합격"}
                            </Badge>
                          </TableCell>
                          <TableCell>{m.measurer}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 통계 분석 */}
        <TabsContent value="statistics">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 측정 건수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCount}건</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    합격률
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.passRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    합격 {stats.passCount}건 / 불합격 {stats.failCount}건
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평균 도막두께
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgThickness.toFixed(1)} um</div>
                  <p className="text-xs text-muted-foreground">
                    Min: {stats.minThickness.toFixed(1)} / Max: {stats.maxThickness.toFixed(1)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cpk (공정능력지수)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      stats.cpk >= 1.33
                        ? "text-green-600"
                        : stats.cpk >= 1.0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.cpk.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.cpk >= 1.33
                      ? "양호"
                      : stats.cpk >= 1.0
                      ? "개선 필요"
                      : "불량"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  일별 평균 두께 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    표시할 데이터가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-end gap-2 h-48">
                      {dailyStats.map((day, index) => {
                        const maxAvg = Math.max(...dailyStats.map((d) => d.average));
                        const height = (day.average / maxAvg) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-mono">{day.average.toFixed(1)}</span>
                            <div
                              className="w-full bg-blue-500 rounded-t"
                              style={{ height: `${height}%`, minHeight: "4px" }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {day.date.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className="h-3 w-3 bg-blue-500 rounded" />
                        일별 평균 두께 (um)
                      </span>
                      <span>규격: 20~30 um</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  상세 통계
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>항목</TableHead>
                      <TableHead className="text-right">값</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>총 측정 건수</TableCell>
                      <TableCell className="text-right font-mono">{stats.totalCount}</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>합격 건수</TableCell>
                      <TableCell className="text-right font-mono text-green-600">
                        {stats.passCount}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {stats.passRate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>불합격 건수</TableCell>
                      <TableCell className="text-right font-mono text-red-600">
                        {stats.failCount}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(100 - stats.passRate).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>평균 도막두께</TableCell>
                      <TableCell className="text-right font-mono">
                        {stats.avgThickness.toFixed(2)} um
                      </TableCell>
                      <TableCell className="text-muted-foreground">규격 중심: 25um</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>최소값</TableCell>
                      <TableCell className="text-right font-mono">
                        {stats.minThickness.toFixed(2)} um
                      </TableCell>
                      <TableCell className="text-muted-foreground">하한 규격: 20um</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>최대값</TableCell>
                      <TableCell className="text-right font-mono">
                        {stats.maxThickness.toFixed(2)} um
                      </TableCell>
                      <TableCell className="text-muted-foreground">상한 규격: 30um</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>표준편차 (Sigma)</TableCell>
                      <TableCell className="text-right font-mono">
                        {stats.stdDev.toFixed(3)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        산포 정도
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cpk (공정능력지수)</TableCell>
                      <TableCell
                        className={`text-right font-mono font-bold ${
                          stats.cpk >= 1.33
                            ? "text-green-600"
                            : stats.cpk >= 1.0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {stats.cpk.toFixed(3)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {stats.cpk >= 1.33
                          ? "양호 (>= 1.33)"
                          : stats.cpk >= 1.0
                          ? "주의 (1.0 ~ 1.33)"
                          : "불량 (< 1.0)"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Daily Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>일별 측정 현황</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyStats.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    표시할 데이터가 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>일자</TableHead>
                        <TableHead className="text-right">측정 건수</TableHead>
                        <TableHead className="text-right">평균 두께</TableHead>
                        <TableHead className="text-right">평가</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyStats.map((day) => (
                        <TableRow key={day.date}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell className="text-right font-mono">{day.count}</TableCell>
                          <TableCell className="text-right font-mono">
                            {day.average.toFixed(1)} um
                          </TableCell>
                          <TableCell className="text-right">
                            {day.average >= 20 && day.average <= 30 ? (
                              <Badge variant="success">정상</Badge>
                            ) : (
                              <Badge variant="destructive">규격 이탈</Badge>
                            )}
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
