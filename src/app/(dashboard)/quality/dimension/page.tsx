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
import { Textarea } from "@/components/ui/textarea";
import {
  Ruler,
  ClipboardList,
  BarChart3,
  History,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// Types
type JudgmentResult = "합격" | "불합격" | "";

interface MeasurementPoint {
  id: number;
  pointNo: number;
  inspectionArea: string; // 검사부위
  specification: number; // 규격값
  upperTolerance: number; // 공차 상한
  lowerTolerance: number; // 공차 하한
  measuredValue: string;
  result: JudgmentResult;
}

interface WeeklyInspectionRecord {
  id: number;
  inspectionWeek: string; // 년도-주차 (e.g., "2026-W24")
  partNo: string; // 품번
  partName: string; // 품명
  inspector: string;
  inspectionDate: string;
  measurementPoints: MeasurementPoint[];
  overallResult: JudgmentResult;
  remarks: string;
}

interface InspectionStandard {
  id: number;
  partNo: string; // 품번
  partName: string; // 품명
  pointNo: number; // 측정포인트 번호
  inspectionArea: string; // 검사부위
  specification: number; // 규격값
  upperTolerance: number; // 공차 상한
  lowerTolerance: number; // 공차 하한
  measurementMethod: string; // 측정방법
  measurementEquipment: string; // 측정기기
  createdDate: string;
}

interface WeeklyStatus {
  week: string;
  totalInspections: number;
  passCount: number;
  failCount: number;
  passRate: number;
}

interface FailureAnalysis {
  inspectionArea: string;
  failCount: number;
  percentage: number;
}

interface CpkData {
  week: string;
  partNo: string;
  partName: string;
  cpk: number;
}

// Helper function to get current week number
function getCurrentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  const weekNumber = Math.ceil((diff + start.getDay() * 86400000) / oneWeek);
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

// Generate week options for the current year
function generateWeekOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const weeks: string[] = [];
  for (let i = 1; i <= 52; i++) {
    weeks.push(`${currentYear}-W${String(i).padStart(2, "0")}`);
  }
  return weeks;
}

// Sample parts data
const sampleParts = [
  { partNo: "MBD0019DAFC", partName: "Front Bumper Cover SP2" },
  { partNo: "MBD0019DAFR", partName: "Rear Bumper Cover SP2" },
  { partNo: "MBD0020GAFC", partName: "Front Bumper Cover SP3" },
  { partNo: "MBD0020GAFR", partName: "Rear Bumper Cover SP3" },
  { partNo: "MBD0021EVFC", partName: "Front Bumper Cover EV1" },
];

// Default measurement points template
const defaultMeasurementPoints: Omit<MeasurementPoint, "id" | "measuredValue" | "result">[] = [
  { pointNo: 1, inspectionArea: "A Point - Width", specification: 100.0, upperTolerance: 0.5, lowerTolerance: -0.5 },
  { pointNo: 2, inspectionArea: "B Point - Height", specification: 85.5, upperTolerance: 0.3, lowerTolerance: -0.3 },
  { pointNo: 3, inspectionArea: "C Point - Length", specification: 120.0, upperTolerance: 0.5, lowerTolerance: -0.5 },
  { pointNo: 4, inspectionArea: "D Point - Gap", specification: 3.0, upperTolerance: 0.2, lowerTolerance: -0.2 },
  { pointNo: 5, inspectionArea: "E Point - Flush", specification: 0.0, upperTolerance: 0.5, lowerTolerance: -0.5 },
];

export default function WeeklyDimensionInspectionPage() {
  const [activeTab, setActiveTab] = useState("weekly-inspection");

  // ===== Tab 1: Weekly Inspection State =====
  const [weeklyFormData, setWeeklyFormData] = useState({
    inspectionWeek: getCurrentWeek(),
    partNo: "",
    partName: "",
    inspector: "",
    inspectionDate: new Date().toISOString().split("T")[0],
  });

  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoint[]>(
    defaultMeasurementPoints.map((point, index) => ({
      ...point,
      id: index + 1,
      measuredValue: "",
      result: "" as JudgmentResult,
    }))
  );

  const [weeklyRemarks, setWeeklyRemarks] = useState("");

  // ===== Tab 2: Inspection Standards State =====
  const [inspectionStandards, setInspectionStandards] = useState<InspectionStandard[]>([]);
  const [standardFormData, setStandardFormData] = useState({
    partNo: "",
    partName: "",
    pointNo: 1,
    inspectionArea: "",
    specification: "",
    upperTolerance: "",
    lowerTolerance: "",
    measurementMethod: "",
    measurementEquipment: "",
  });

  // ===== Tab 3 & 4: History State =====
  const [inspectionHistory, setInspectionHistory] = useState<WeeklyInspectionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPartNo, setFilterPartNo] = useState<string>("");
  const [filterWeek, setFilterWeek] = useState<string>("");

  // Week options
  const weekOptions = generateWeekOptions();

  // ===== Tab 1: Weekly Inspection Functions =====
  const handlePartNoChange = (partNo: string) => {
    const part = sampleParts.find((p) => p.partNo === partNo);
    setWeeklyFormData({
      ...weeklyFormData,
      partNo,
      partName: part?.partName || "",
    });

    // Load measurement points from standards if available
    const standards = inspectionStandards.filter((s) => s.partNo === partNo);
    if (standards.length > 0) {
      setMeasurementPoints(
        standards.map((s, index) => ({
          id: index + 1,
          pointNo: s.pointNo,
          inspectionArea: s.inspectionArea,
          specification: s.specification,
          upperTolerance: s.upperTolerance,
          lowerTolerance: s.lowerTolerance,
          measuredValue: "",
          result: "" as JudgmentResult,
        }))
      );
    } else {
      // Reset to default points
      setMeasurementPoints(
        defaultMeasurementPoints.map((point, index) => ({
          ...point,
          id: index + 1,
          measuredValue: "",
          result: "" as JudgmentResult,
        }))
      );
    }
  };

  const addMeasurementPoint = () => {
    if (measurementPoints.length >= 10) {
      alert("최대 10개의 검사부위만 등록할 수 있습니다.");
      return;
    }
    const newId = Math.max(0, ...measurementPoints.map((p) => p.id)) + 1;
    const newPointNo = measurementPoints.length + 1;
    setMeasurementPoints([
      ...measurementPoints,
      {
        id: newId,
        pointNo: newPointNo,
        inspectionArea: "",
        specification: 0,
        upperTolerance: 0.5,
        lowerTolerance: -0.5,
        measuredValue: "",
        result: "",
      },
    ]);
  };

  const removeMeasurementPoint = (id: number) => {
    if (measurementPoints.length > 1) {
      setMeasurementPoints(measurementPoints.filter((p) => p.id !== id));
    }
  };

  const updateMeasurementPoint = (id: number, field: keyof MeasurementPoint, value: string | number) => {
    setMeasurementPoints(
      measurementPoints.map((point) => {
        if (point.id === id) {
          const updatedPoint = { ...point, [field]: value };

          // Auto-calculate result when measured value changes
          if (field === "measuredValue") {
            const measured = parseFloat(value as string);
            if (!isNaN(measured)) {
              const upper = updatedPoint.specification + updatedPoint.upperTolerance;
              const lower = updatedPoint.specification + updatedPoint.lowerTolerance;
              updatedPoint.result = measured >= lower && measured <= upper ? "합격" : "불합격";
            } else {
              updatedPoint.result = "";
            }
          }

          return updatedPoint;
        }
        return point;
      })
    );
  };

  const handleWeeklyInspectionSave = () => {
    if (!weeklyFormData.partNo || !weeklyFormData.inspector) {
      alert("품번과 검사자를 입력해주세요.");
      return;
    }

    const hasUnmeasured = measurementPoints.some((p) => p.measuredValue === "");
    if (hasUnmeasured) {
      alert("모든 측정값을 입력해주세요.");
      return;
    }

    const failCount = measurementPoints.filter((p) => p.result === "불합격").length;
    const overallResult: JudgmentResult = failCount > 0 ? "불합격" : "합격";

    const newRecord: WeeklyInspectionRecord = {
      id: Date.now(),
      inspectionWeek: weeklyFormData.inspectionWeek,
      partNo: weeklyFormData.partNo,
      partName: weeklyFormData.partName,
      inspector: weeklyFormData.inspector,
      inspectionDate: weeklyFormData.inspectionDate,
      measurementPoints: [...measurementPoints],
      overallResult,
      remarks: weeklyRemarks,
    };

    setInspectionHistory([newRecord, ...inspectionHistory]);

    // Reset form
    setWeeklyFormData({
      inspectionWeek: getCurrentWeek(),
      partNo: "",
      partName: "",
      inspector: "",
      inspectionDate: new Date().toISOString().split("T")[0],
    });
    setMeasurementPoints(
      defaultMeasurementPoints.map((point, index) => ({
        ...point,
        id: index + 1,
        measuredValue: "",
        result: "" as JudgmentResult,
      }))
    );
    setWeeklyRemarks("");

    alert("주간 치수검사 기록이 저장되었습니다.");
    setActiveTab("weekly-status");
  };

  // ===== Tab 2: Inspection Standards Functions =====
  const handleAddStandard = () => {
    if (
      !standardFormData.partNo ||
      !standardFormData.inspectionArea ||
      !standardFormData.specification ||
      !standardFormData.measurementMethod ||
      !standardFormData.measurementEquipment
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newStandard: InspectionStandard = {
      id: Date.now(),
      partNo: standardFormData.partNo,
      partName: standardFormData.partName,
      pointNo: standardFormData.pointNo,
      inspectionArea: standardFormData.inspectionArea,
      specification: parseFloat(standardFormData.specification),
      upperTolerance: parseFloat(standardFormData.upperTolerance) || 0.5,
      lowerTolerance: parseFloat(standardFormData.lowerTolerance) || -0.5,
      measurementMethod: standardFormData.measurementMethod,
      measurementEquipment: standardFormData.measurementEquipment,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setInspectionStandards([...inspectionStandards, newStandard]);

    // Reset form
    setStandardFormData({
      partNo: standardFormData.partNo, // Keep part number
      partName: standardFormData.partName,
      pointNo: standardFormData.pointNo + 1,
      inspectionArea: "",
      specification: "",
      upperTolerance: "",
      lowerTolerance: "",
      measurementMethod: "",
      measurementEquipment: "",
    });

    alert("검사기준이 등록되었습니다.");
  };

  const removeStandard = (id: number) => {
    setInspectionStandards(inspectionStandards.filter((s) => s.id !== id));
  };

  // ===== Tab 3: Weekly Status Functions =====
  const calculateWeeklyStatus = (): WeeklyStatus[] => {
    const weekMap = new Map<string, { pass: number; fail: number }>();

    inspectionHistory.forEach((record) => {
      const existing = weekMap.get(record.inspectionWeek) || { pass: 0, fail: 0 };
      if (record.overallResult === "합격") {
        existing.pass++;
      } else if (record.overallResult === "불합격") {
        existing.fail++;
      }
      weekMap.set(record.inspectionWeek, existing);
    });

    return Array.from(weekMap.entries())
      .map(([week, counts]) => ({
        week,
        totalInspections: counts.pass + counts.fail,
        passCount: counts.pass,
        failCount: counts.fail,
        passRate: ((counts.pass / (counts.pass + counts.fail)) * 100) || 0,
      }))
      .sort((a, b) => b.week.localeCompare(a.week));
  };

  const calculateFailureAnalysis = (): FailureAnalysis[] => {
    const failureMap = new Map<string, number>();
    let totalFailures = 0;

    inspectionHistory.forEach((record) => {
      record.measurementPoints.forEach((point) => {
        if (point.result === "불합격") {
          const count = failureMap.get(point.inspectionArea) || 0;
          failureMap.set(point.inspectionArea, count + 1);
          totalFailures++;
        }
      });
    });

    return Array.from(failureMap.entries())
      .map(([area, count]) => ({
        inspectionArea: area,
        failCount: count,
        percentage: totalFailures > 0 ? (count / totalFailures) * 100 : 0,
      }))
      .sort((a, b) => b.failCount - a.failCount);
  };

  // ===== Tab 4: History / Cpk Functions =====
  const filteredHistory = inspectionHistory.filter((record) => {
    const matchesSearch =
      record.partNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.inspector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPartNo = !filterPartNo || record.partNo === filterPartNo;
    const matchesWeek = !filterWeek || record.inspectionWeek === filterWeek;
    return matchesSearch && matchesPartNo && matchesWeek;
  });

  // Calculate Cpk for each part/week combination (simplified calculation)
  const calculateCpkData = (): CpkData[] => {
    const cpkMap = new Map<string, { values: number[]; spec: number; upper: number; lower: number }>();

    inspectionHistory.forEach((record) => {
      record.measurementPoints.forEach((point) => {
        if (point.measuredValue) {
          const key = `${record.inspectionWeek}-${record.partNo}`;
          const existing = cpkMap.get(key) || {
            values: [],
            spec: point.specification,
            upper: point.specification + point.upperTolerance,
            lower: point.specification + point.lowerTolerance,
          };
          existing.values.push(parseFloat(point.measuredValue));
          cpkMap.set(key, existing);
        }
      });
    });

    return Array.from(cpkMap.entries())
      .map(([key, data]) => {
        const [week, partNo] = key.split("-").slice(0, 2);
        const fullPartNo = key.substring(key.indexOf("-") + 1);
        const part = sampleParts.find((p) => fullPartNo.startsWith(p.partNo));

        if (data.values.length < 2) {
          return {
            week: `${week}-${key.split("-")[1]}`,
            partNo: fullPartNo,
            partName: part?.partName || fullPartNo,
            cpk: 0,
          };
        }

        // Simple Cpk calculation
        const mean = data.values.reduce((a, b) => a + b, 0) / data.values.length;
        const variance = data.values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.values.length - 1);
        const stdDev = Math.sqrt(variance) || 0.001;
        const cpuVal = (data.upper - mean) / (3 * stdDev);
        const cplVal = (mean - data.lower) / (3 * stdDev);
        const cpk = Math.min(cpuVal, cplVal);

        return {
          week: `${week}-${key.split("-")[1]}`,
          partNo: fullPartNo,
          partName: part?.partName || fullPartNo,
          cpk: isFinite(cpk) ? cpk : 0,
        };
      })
      .filter((d) => d.cpk !== 0)
      .sort((a, b) => b.week.localeCompare(a.week));
  };

  // Get result badge
  const getResultBadge = (result: JudgmentResult) => {
    switch (result) {
      case "합격":
        return <Badge variant="success">합격</Badge>;
      case "불합격":
        return <Badge variant="destructive">불합격</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  // Get Cpk badge
  const getCpkBadge = (cpk: number) => {
    if (cpk >= 1.67) {
      return <Badge variant="success">우수 ({cpk.toFixed(2)})</Badge>;
    } else if (cpk >= 1.33) {
      return <Badge className="bg-green-100 text-green-800">양호 ({cpk.toFixed(2)})</Badge>;
    } else if (cpk >= 1.0) {
      return <Badge className="bg-yellow-100 text-yellow-800">주의 ({cpk.toFixed(2)})</Badge>;
    } else {
      return <Badge variant="destructive">불량 ({cpk.toFixed(2)})</Badge>;
    }
  };

  const weeklyStatus = calculateWeeklyStatus();
  const failureAnalysis = calculateFailureAnalysis();
  const cpkData = calculateCpkData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">완제품 치수관리 (주간)</h1>
          <p className="text-muted-foreground">Weekly Finished Product Dimension Management</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weekly-inspection">주간 치수검사</TabsTrigger>
              <TabsTrigger value="standards">치수검사 기준</TabsTrigger>
              <TabsTrigger value="weekly-status">주간 현황</TabsTrigger>
              <TabsTrigger value="history">검사 이력</TabsTrigger>
            </TabsList>

            {/* Tab 1: Weekly Dimension Inspection */}
            <TabsContent value="weekly-inspection">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    주간 치수검사 (Weekly Dimension Inspection)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    <div className="grid gap-4 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>검사주차 (년도-주차) *</Label>
                        <Select
                          value={weeklyFormData.inspectionWeek}
                          onValueChange={(value) => setWeeklyFormData({ ...weeklyFormData, inspectionWeek: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="주차 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {weekOptions.map((week) => (
                              <SelectItem key={week} value={week}>
                                {week}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Select value={weeklyFormData.partNo} onValueChange={handlePartNoChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="품번 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleParts.map((part) => (
                              <SelectItem key={part.partNo} value={part.partNo}>
                                {part.partNo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>품명</Label>
                        <Input value={weeklyFormData.partName} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>검사일 *</Label>
                        <Input
                          type="date"
                          value={weeklyFormData.inspectionDate}
                          onChange={(e) => setWeeklyFormData({ ...weeklyFormData, inspectionDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사자 *</Label>
                        <Input
                          value={weeklyFormData.inspector}
                          onChange={(e) => setWeeklyFormData({ ...weeklyFormData, inspector: e.target.value })}
                          placeholder="검사자명"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Measurement Points */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold border-b pb-2">검사부위 (1~10개 포인트)</h3>
                      <Button size="sm" onClick={addMeasurementPoint} disabled={measurementPoints.length >= 10}>
                        <Plus className="mr-2 h-4 w-4" />
                        포인트 추가
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">No.</TableHead>
                          <TableHead>검사부위</TableHead>
                          <TableHead className="w-28">규격값</TableHead>
                          <TableHead className="w-28">공차 상한</TableHead>
                          <TableHead className="w-28">공차 하한</TableHead>
                          <TableHead className="w-28">측정값</TableHead>
                          <TableHead className="w-24">판정</TableHead>
                          <TableHead className="w-16">삭제</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {measurementPoints.map((point, index) => (
                          <TableRow key={point.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={point.inspectionArea}
                                onChange={(e) => updateMeasurementPoint(point.id, "inspectionArea", e.target.value)}
                                placeholder="검사부위명"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="any"
                                value={point.specification}
                                onChange={(e) =>
                                  updateMeasurementPoint(point.id, "specification", parseFloat(e.target.value) || 0)
                                }
                                placeholder="규격값"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="any"
                                value={point.upperTolerance}
                                onChange={(e) =>
                                  updateMeasurementPoint(point.id, "upperTolerance", parseFloat(e.target.value) || 0)
                                }
                                placeholder="+0.5"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="any"
                                value={point.lowerTolerance}
                                onChange={(e) =>
                                  updateMeasurementPoint(point.id, "lowerTolerance", parseFloat(e.target.value) || 0)
                                }
                                placeholder="-0.5"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="any"
                                value={point.measuredValue}
                                onChange={(e) => updateMeasurementPoint(point.id, "measuredValue", e.target.value)}
                                placeholder="측정값"
                              />
                            </TableCell>
                            <TableCell>
                              {point.result === "합격" ? (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  합격
                                </span>
                              ) : point.result === "불합격" ? (
                                <span className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  불합격
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMeasurementPoint(point.id)}
                                disabled={measurementPoints.length === 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary and Remarks */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">검사 요약</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-muted/50">
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">총 포인트</div>
                            <div className="text-2xl font-bold">{measurementPoints.length}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-green-50">
                          <CardContent className="pt-4">
                            <div className="text-sm text-green-600">합격</div>
                            <div className="text-2xl font-bold text-green-700">
                              {measurementPoints.filter((p) => p.result === "합격").length}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-red-50">
                          <CardContent className="pt-4">
                            <div className="text-sm text-red-600">불합격</div>
                            <div className="text-2xl font-bold text-red-700">
                              {measurementPoints.filter((p) => p.result === "불합격").length}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">비고</h3>
                      <Textarea
                        value={weeklyRemarks}
                        onChange={(e) => setWeeklyRemarks(e.target.value)}
                        placeholder="특이사항 입력..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleWeeklyInspectionSave}>
                      <Save className="mr-2 h-4 w-4" />
                      검사결과 저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Inspection Standards */}
            <TabsContent value="standards">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    치수검사 기준 (Dimension Inspection Standard)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Standard Registration Form */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h3 className="text-lg font-semibold">검사항목 등록</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Select
                          value={standardFormData.partNo}
                          onValueChange={(value) => {
                            const part = sampleParts.find((p) => p.partNo === value);
                            setStandardFormData({
                              ...standardFormData,
                              partNo: value,
                              partName: part?.partName || "",
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="품번 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleParts.map((part) => (
                              <SelectItem key={part.partNo} value={part.partNo}>
                                {part.partNo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>품명</Label>
                        <Input value={standardFormData.partName} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>측정포인트 번호</Label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={standardFormData.pointNo}
                          onChange={(e) =>
                            setStandardFormData({ ...standardFormData, pointNo: parseInt(e.target.value) || 1 })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사부위 *</Label>
                        <Input
                          value={standardFormData.inspectionArea}
                          onChange={(e) => setStandardFormData({ ...standardFormData, inspectionArea: e.target.value })}
                          placeholder="예: A Point - Width"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-6">
                      <div className="space-y-2">
                        <Label>규격값 *</Label>
                        <Input
                          type="number"
                          step="any"
                          value={standardFormData.specification}
                          onChange={(e) => setStandardFormData({ ...standardFormData, specification: e.target.value })}
                          placeholder="100.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공차 상한</Label>
                        <Input
                          type="number"
                          step="any"
                          value={standardFormData.upperTolerance}
                          onChange={(e) => setStandardFormData({ ...standardFormData, upperTolerance: e.target.value })}
                          placeholder="0.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공차 하한</Label>
                        <Input
                          type="number"
                          step="any"
                          value={standardFormData.lowerTolerance}
                          onChange={(e) => setStandardFormData({ ...standardFormData, lowerTolerance: e.target.value })}
                          placeholder="-0.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정방법 *</Label>
                        <Select
                          value={standardFormData.measurementMethod}
                          onValueChange={(value) => setStandardFormData({ ...standardFormData, measurementMethod: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="버니어캘리퍼스">버니어캘리퍼스</SelectItem>
                            <SelectItem value="마이크로미터">마이크로미터</SelectItem>
                            <SelectItem value="하이트게이지">하이트게이지</SelectItem>
                            <SelectItem value="3차원측정기">3차원측정기</SelectItem>
                            <SelectItem value="틈새게이지">틈새게이지</SelectItem>
                            <SelectItem value="R게이지">R게이지</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>측정기기 *</Label>
                        <Select
                          value={standardFormData.measurementEquipment}
                          onValueChange={(value) =>
                            setStandardFormData({ ...standardFormData, measurementEquipment: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="버니어캘리퍼스 0-150mm">버니어캘리퍼스 0-150mm</SelectItem>
                            <SelectItem value="버니어캘리퍼스 0-300mm">버니어캘리퍼스 0-300mm</SelectItem>
                            <SelectItem value="외경마이크로미터 0-25mm">외경마이크로미터 0-25mm</SelectItem>
                            <SelectItem value="디지털하이트게이지">디지털하이트게이지</SelectItem>
                            <SelectItem value="CMM Zeiss">CMM Zeiss</SelectItem>
                            <SelectItem value="틈새게이지세트">틈새게이지세트</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 flex items-end">
                        <Button onClick={handleAddStandard} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          등록
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Standards List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">등록된 검사기준</h3>
                    {inspectionStandards.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">등록된 검사기준이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>품번</TableHead>
                            <TableHead>품명</TableHead>
                            <TableHead className="w-16">포인트</TableHead>
                            <TableHead>검사부위</TableHead>
                            <TableHead className="w-24">규격값</TableHead>
                            <TableHead className="w-24">공차</TableHead>
                            <TableHead>측정방법</TableHead>
                            <TableHead>측정기기</TableHead>
                            <TableHead className="w-16">삭제</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inspectionStandards.map((standard) => (
                            <TableRow key={standard.id}>
                              <TableCell className="font-mono text-sm">{standard.partNo}</TableCell>
                              <TableCell>{standard.partName}</TableCell>
                              <TableCell className="text-center">{standard.pointNo}</TableCell>
                              <TableCell>{standard.inspectionArea}</TableCell>
                              <TableCell className="text-right">{standard.specification.toFixed(2)}</TableCell>
                              <TableCell className="text-center">
                                {standard.lowerTolerance} / {standard.upperTolerance > 0 ? "+" : ""}
                                {standard.upperTolerance}
                              </TableCell>
                              <TableCell>{standard.measurementMethod}</TableCell>
                              <TableCell>{standard.measurementEquipment}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => removeStandard(standard.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Weekly Status */}
            <TabsContent value="weekly-status">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    주간 현황 (Weekly Status)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Weekly Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">총 검사 건수</div>
                        <div className="text-3xl font-bold">{inspectionHistory.length}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-green-600">합격</div>
                        <div className="text-3xl font-bold text-green-700">
                          {inspectionHistory.filter((r) => r.overallResult === "합격").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-red-600">불합격</div>
                        <div className="text-3xl font-bold text-red-700">
                          {inspectionHistory.filter((r) => r.overallResult === "불합격").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-blue-600">합격률</div>
                        <div className="text-3xl font-bold text-blue-700">
                          {inspectionHistory.length > 0
                            ? (
                                (inspectionHistory.filter((r) => r.overallResult === "합격").length /
                                  inspectionHistory.length) *
                                100
                              ).toFixed(1)
                            : "0.0"}
                          %
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Weekly Status Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">주차별 검사 현황</h3>
                    {weeklyStatus.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사주차</TableHead>
                            <TableHead className="text-center">검사 건수</TableHead>
                            <TableHead className="text-center">합격</TableHead>
                            <TableHead className="text-center">불합격</TableHead>
                            <TableHead className="text-center">합격률</TableHead>
                            <TableHead>합격률 추이</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {weeklyStatus.map((status) => (
                            <TableRow key={status.week}>
                              <TableCell className="font-mono">{status.week}</TableCell>
                              <TableCell className="text-center">{status.totalInspections}</TableCell>
                              <TableCell className="text-center text-green-600">{status.passCount}</TableCell>
                              <TableCell className="text-center text-red-600">{status.failCount}</TableCell>
                              <TableCell className="text-center">
                                <span
                                  className={`font-bold ${
                                    status.passRate >= 95
                                      ? "text-green-700"
                                      : status.passRate >= 90
                                      ? "text-yellow-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {status.passRate.toFixed(1)}%
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      status.passRate >= 95
                                        ? "bg-green-500"
                                        : status.passRate >= 90
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${status.passRate}%` }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  {/* Failure Analysis */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      불합격 항목 분석
                    </h3>
                    {failureAnalysis.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">불합격 항목이 없습니다.</p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>검사부위</TableHead>
                              <TableHead className="text-center">불합격 건수</TableHead>
                              <TableHead className="text-center">비율</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {failureAnalysis.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.inspectionArea}</TableCell>
                                <TableCell className="text-center text-red-600 font-bold">{item.failCount}</TableCell>
                                <TableCell className="text-center">{item.percentage.toFixed(1)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle className="text-base">불합격 분포</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {failureAnalysis.map((item, index) => (
                              <div key={index} className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{item.inspectionArea}</span>
                                  <span>{item.percentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-red-500 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Inspection History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    검사 이력 (Inspection History)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Filters */}
                  <div className="flex gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="품번, 품명, 검사자 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="w-40">
                      <Select value={filterWeek} onValueChange={setFilterWeek}>
                        <SelectTrigger>
                          <SelectValue placeholder="주차 필터" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">전체 주차</SelectItem>
                          {weekOptions.slice(-12).map((week) => (
                            <SelectItem key={week} value={week}>
                              {week}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-48">
                      <Select value={filterPartNo} onValueChange={setFilterPartNo}>
                        <SelectTrigger>
                          <SelectValue placeholder="품목 필터" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">전체 품목</SelectItem>
                          {sampleParts.map((part) => (
                            <SelectItem key={part.partNo} value={part.partNo}>
                              {part.partNo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* History Table */}
                  {filteredHistory.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">검사 이력이 없습니다.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>검사주차</TableHead>
                          <TableHead>검사일</TableHead>
                          <TableHead>품번</TableHead>
                          <TableHead>품명</TableHead>
                          <TableHead className="text-center">측정포인트</TableHead>
                          <TableHead className="text-center">합격/불합격</TableHead>
                          <TableHead>검사자</TableHead>
                          <TableHead>판정</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono">{record.inspectionWeek}</TableCell>
                            <TableCell>{record.inspectionDate}</TableCell>
                            <TableCell className="font-mono text-sm">{record.partNo}</TableCell>
                            <TableCell>{record.partName}</TableCell>
                            <TableCell className="text-center">{record.measurementPoints.length}</TableCell>
                            <TableCell className="text-center">
                              <span className="text-green-600">
                                {record.measurementPoints.filter((p) => p.result === "합격").length}
                              </span>
                              /
                              <span className="text-red-600">
                                {record.measurementPoints.filter((p) => p.result === "불합격").length}
                              </span>
                            </TableCell>
                            <TableCell>{record.inspector}</TableCell>
                            <TableCell>{getResultBadge(record.overallResult)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {/* Cpk Trend */}
                  <div className="space-y-4 mt-8">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Cpk 추이
                    </h3>
                    {cpkData.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">Cpk 데이터가 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>주차</TableHead>
                            <TableHead>품번</TableHead>
                            <TableHead>품명</TableHead>
                            <TableHead className="text-center">Cpk</TableHead>
                            <TableHead>상태</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cpkData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono">{data.week}</TableCell>
                              <TableCell className="font-mono text-sm">{data.partNo}</TableCell>
                              <TableCell>{data.partName}</TableCell>
                              <TableCell className="text-center font-bold">{data.cpk.toFixed(2)}</TableCell>
                              <TableCell>{getCpkBadge(data.cpk)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            <strong>Cpk 기준:</strong>
                          </p>
                          <p>- Cpk &gt;= 1.67: 우수 (공정능력 충분)</p>
                          <p>- 1.33 &lt;= Cpk &lt; 1.67: 양호</p>
                          <p>- 1.0 &lt;= Cpk &lt; 1.33: 주의 (개선 필요)</p>
                          <p>- Cpk &lt; 1.0: 불량 (즉시 조치 필요)</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
