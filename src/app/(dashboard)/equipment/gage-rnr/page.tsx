"use client";

import { useState, useMemo, useCallback } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Calculator,
  ClipboardList,
  FileText,
  History,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";

// Types
interface AnalysisCondition {
  analysisNo: string; // 분석번호
  analysisDate: string; // 분석일
  instrumentName: string; // 계측기명
  managementNo: string; // 관리번호
  operatorCount: number; // 측정자수
  sampleCount: number; // 시료수
  trialCount: number; // 반복측정 횟수
  usl: number | null; // 상한규격
  lsl: number | null; // 하한규격
  characteristic: string; // 측정특성
  unit: string; // 단위
}

interface MeasurementData {
  // [operatorIndex][sampleIndex][trialIndex] = value
  data: (number | null)[][][];
}

interface AnalysisResult {
  // Basic statistics per operator
  operatorMeans: number[];
  operatorRanges: number[];
  // Repeatability (EV)
  ev: number;
  evPercent: number;
  // Reproducibility (AV)
  av: number;
  avPercent: number;
  // Gage R&R (GRR)
  grr: number;
  grrPercent: number;
  // Part Variation (PV)
  pv: number;
  pvPercent: number;
  // Total Variation (TV)
  tv: number;
  // ndc (Number of Distinct Categories)
  ndc: number;
  // Judgment
  judgment: "합격" | "조건부합격" | "불합격";
}

interface HistoryRecord {
  id: number;
  analysisNo: string;
  analysisDate: string;
  instrumentName: string;
  managementNo: string;
  operatorCount: number;
  sampleCount: number;
  trialCount: number;
  tolerance: number;
  ev: number;
  evPercent: number;
  av: number;
  avPercent: number;
  grr: number;
  grrPercent: number;
  pv: number;
  pvPercent: number;
  tv: number;
  ndc: number;
  judgment: string;
  createdAt: string;
}

// Constants for d2 values (used in R&R calculations)
// d2 values based on number of trials (g) for average range method
const d2Values: Record<number, number> = {
  2: 1.128,
  3: 1.693,
  4: 2.059,
  5: 2.326,
  6: 2.534,
  7: 2.704,
  8: 2.847,
  9: 2.97,
  10: 3.078,
};

// K1 values based on number of trials
const k1Values: Record<number, number> = {
  2: 0.8862,
  3: 0.5908,
  4: 0.4857,
  5: 0.4299,
  6: 0.3946,
  7: 0.3698,
  8: 0.3512,
  9: 0.3367,
  10: 0.3249,
};

// K2 values based on number of operators
const k2Values: Record<number, number> = {
  2: 0.7071,
  3: 0.5231,
  4: 0.4467,
  5: 0.4030,
  6: 0.3742,
  7: 0.3534,
  8: 0.3375,
  9: 0.3249,
  10: 0.3146,
};

// K3 values based on number of parts
const k3Values: Record<number, number> = {
  2: 0.7071,
  3: 0.5231,
  4: 0.4467,
  5: 0.4030,
  6: 0.3742,
  7: 0.3534,
  8: 0.3375,
  9: 0.3249,
  10: 0.3146,
};

// Sample history data
const initialHistory: HistoryRecord[] = [
  {
    id: 1,
    analysisNo: "MSA-2026-001",
    analysisDate: "2026-05-15",
    instrumentName: "버니어캘리퍼스",
    managementNo: "GA-001",
    operatorCount: 3,
    sampleCount: 10,
    trialCount: 3,
    tolerance: 0.5,
    ev: 0.0234,
    evPercent: 4.68,
    av: 0.0156,
    avPercent: 3.12,
    grr: 0.0281,
    grrPercent: 5.62,
    pv: 0.4823,
    pvPercent: 96.46,
    tv: 0.5,
    ndc: 24,
    judgment: "합격",
    createdAt: "2026-05-15T10:30:00",
  },
  {
    id: 2,
    analysisNo: "MSA-2026-002",
    analysisDate: "2026-05-20",
    instrumentName: "마이크로미터",
    managementNo: "GA-002",
    operatorCount: 3,
    sampleCount: 10,
    trialCount: 3,
    tolerance: 0.1,
    ev: 0.0089,
    evPercent: 8.9,
    av: 0.0067,
    avPercent: 6.7,
    grr: 0.0112,
    grrPercent: 11.2,
    pv: 0.0956,
    pvPercent: 95.6,
    tv: 0.1,
    ndc: 12,
    judgment: "조건부합격",
    createdAt: "2026-05-20T14:15:00",
  },
];

export default function GageRnrPage() {
  const [activeTab, setActiveTab] = useState("setup");
  const [history, setHistory] = useState<HistoryRecord[]>(initialHistory);

  // Analysis Condition State
  const [condition, setCondition] = useState<AnalysisCondition>({
    analysisNo: `MSA-${new Date().getFullYear()}-${String(initialHistory.length + 1).padStart(3, "0")}`,
    analysisDate: new Date().toISOString().split("T")[0],
    instrumentName: "",
    managementNo: "",
    operatorCount: 3,
    sampleCount: 10,
    trialCount: 3,
    usl: null,
    lsl: null,
    characteristic: "",
    unit: "mm",
  });

  // Measurement Data State
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    data: [],
  });

  // Operator names
  const [operatorNames, setOperatorNames] = useState<string[]>([
    "측정자 A",
    "측정자 B",
    "측정자 C",
  ]);

  // Initialize measurement data when conditions change
  const initializeMeasurementData = useCallback(() => {
    const newData: (number | null)[][][] = [];
    for (let op = 0; op < condition.operatorCount; op++) {
      newData[op] = [];
      for (let sample = 0; sample < condition.sampleCount; sample++) {
        newData[op][sample] = [];
        for (let trial = 0; trial < condition.trialCount; trial++) {
          newData[op][sample][trial] = null;
        }
      }
    }
    setMeasurementData({ data: newData });

    // Update operator names if needed
    const newNames = [...operatorNames];
    while (newNames.length < condition.operatorCount) {
      newNames.push(`측정자 ${String.fromCharCode(65 + newNames.length)}`);
    }
    setOperatorNames(newNames.slice(0, condition.operatorCount));
  }, [condition.operatorCount, condition.sampleCount, condition.trialCount, operatorNames]);

  // Handle measurement value change
  const handleMeasurementChange = (
    operatorIndex: number,
    sampleIndex: number,
    trialIndex: number,
    value: string
  ) => {
    const newData = [...measurementData.data];
    if (!newData[operatorIndex]) {
      newData[operatorIndex] = [];
    }
    if (!newData[operatorIndex][sampleIndex]) {
      newData[operatorIndex][sampleIndex] = [];
    }
    newData[operatorIndex][sampleIndex][trialIndex] =
      value === "" ? null : parseFloat(value);
    setMeasurementData({ data: newData });
  };

  // Calculate analysis results
  const analysisResult = useMemo((): AnalysisResult | null => {
    if (
      !measurementData.data.length ||
      condition.usl === null ||
      condition.lsl === null
    ) {
      return null;
    }

    const tolerance = condition.usl - condition.lsl;
    if (tolerance <= 0) return null;

    const { operatorCount, sampleCount, trialCount } = condition;
    const data = measurementData.data;

    // Check if we have enough data
    let hasData = false;
    for (let op = 0; op < operatorCount; op++) {
      for (let sample = 0; sample < sampleCount; sample++) {
        for (let trial = 0; trial < trialCount; trial++) {
          if (data[op]?.[sample]?.[trial] !== null && data[op]?.[sample]?.[trial] !== undefined) {
            hasData = true;
            break;
          }
        }
        if (hasData) break;
      }
      if (hasData) break;
    }
    if (!hasData) return null;

    // Calculate ranges for each operator/part combination
    const ranges: number[][] = [];
    const partAverages: number[][] = [];

    for (let op = 0; op < operatorCount; op++) {
      ranges[op] = [];
      partAverages[op] = [];
      for (let sample = 0; sample < sampleCount; sample++) {
        const values: number[] = [];
        for (let trial = 0; trial < trialCount; trial++) {
          const val = data[op]?.[sample]?.[trial];
          if (val !== null && val !== undefined) {
            values.push(val);
          }
        }
        if (values.length > 0) {
          const max = Math.max(...values);
          const min = Math.min(...values);
          ranges[op][sample] = max - min;
          partAverages[op][sample] = values.reduce((a, b) => a + b, 0) / values.length;
        } else {
          ranges[op][sample] = 0;
          partAverages[op][sample] = 0;
        }
      }
    }

    // Calculate R-bar (average range) for each operator
    const operatorRanges: number[] = [];
    for (let op = 0; op < operatorCount; op++) {
      const validRanges = ranges[op].filter((r) => r !== undefined);
      operatorRanges[op] =
        validRanges.length > 0
          ? validRanges.reduce((a, b) => a + b, 0) / validRanges.length
          : 0;
    }

    // Calculate operator means (X-bar)
    const operatorMeans: number[] = [];
    for (let op = 0; op < operatorCount; op++) {
      const validAverages = partAverages[op].filter((a) => a !== undefined);
      operatorMeans[op] =
        validAverages.length > 0
          ? validAverages.reduce((a, b) => a + b, 0) / validAverages.length
          : 0;
    }

    // Overall R-bar (average of operator ranges)
    const rBar =
      operatorRanges.reduce((a, b) => a + b, 0) / operatorRanges.length;

    // X-bar difference (max - min of operator means)
    const xBarDiff = Math.max(...operatorMeans) - Math.min(...operatorMeans);

    // Part averages (average across all operators for each part)
    const partMeans: number[] = [];
    for (let sample = 0; sample < sampleCount; sample++) {
      let sum = 0;
      let count = 0;
      for (let op = 0; op < operatorCount; op++) {
        if (partAverages[op]?.[sample] !== undefined) {
          sum += partAverages[op][sample];
          count++;
        }
      }
      partMeans[sample] = count > 0 ? sum / count : 0;
    }

    // Range of part means
    const rp = Math.max(...partMeans) - Math.min(...partMeans);

    // Get K values
    const k1 = k1Values[trialCount] || 0.5908;
    const k2 = k2Values[operatorCount] || 0.5231;
    const k3 = k3Values[sampleCount] || 0.3146;

    // Calculate EV (Equipment Variation / Repeatability)
    const ev = rBar * k1;

    // Calculate AV (Appraiser Variation / Reproducibility)
    const avSquared =
      (xBarDiff * k2) ** 2 - (ev ** 2 / (sampleCount * trialCount));
    const av = avSquared > 0 ? Math.sqrt(avSquared) : 0;

    // Calculate GRR (Gage R&R)
    const grr = Math.sqrt(ev ** 2 + av ** 2);

    // Calculate PV (Part Variation)
    const pv = rp * k3;

    // Calculate TV (Total Variation)
    const tv = Math.sqrt(grr ** 2 + pv ** 2);

    // Calculate percentages based on tolerance
    const evPercent = (ev / tolerance) * 100 * 5.15;
    const avPercent = (av / tolerance) * 100 * 5.15;
    const grrPercent = (grr / tolerance) * 100 * 5.15;
    const pvPercent = (pv / tolerance) * 100 * 5.15;

    // Calculate ndc (Number of Distinct Categories)
    const ndc = pv > 0 ? Math.floor((1.41 * pv) / grr) : 0;

    // Judgment based on %GRR
    let judgment: "합격" | "조건부합격" | "불합격";
    if (grrPercent < 10) {
      judgment = "합격";
    } else if (grrPercent <= 30) {
      judgment = "조건부합격";
    } else {
      judgment = "불합격";
    }

    return {
      operatorMeans,
      operatorRanges,
      ev,
      evPercent,
      av,
      avPercent,
      grr,
      grrPercent,
      pv,
      pvPercent,
      tv,
      ndc,
      judgment,
    };
  }, [measurementData, condition]);

  // Save analysis to history
  const handleSaveAnalysis = () => {
    if (!analysisResult || condition.usl === null || condition.lsl === null) {
      alert("분석 조건과 측정 데이터를 입력해주세요.");
      return;
    }

    const newRecord: HistoryRecord = {
      id: Date.now(),
      analysisNo: condition.analysisNo,
      analysisDate: condition.analysisDate,
      instrumentName: condition.instrumentName,
      managementNo: condition.managementNo,
      operatorCount: condition.operatorCount,
      sampleCount: condition.sampleCount,
      trialCount: condition.trialCount,
      tolerance: condition.usl - condition.lsl,
      ev: analysisResult.ev,
      evPercent: analysisResult.evPercent,
      av: analysisResult.av,
      avPercent: analysisResult.avPercent,
      grr: analysisResult.grr,
      grrPercent: analysisResult.grrPercent,
      pv: analysisResult.pv,
      pvPercent: analysisResult.pvPercent,
      tv: analysisResult.tv,
      ndc: analysisResult.ndc,
      judgment: analysisResult.judgment,
      createdAt: new Date().toISOString(),
    };

    setHistory([newRecord, ...history]);
    alert("분석 결과가 저장되었습니다.");

    // Reset for new analysis
    setCondition({
      ...condition,
      analysisNo: `MSA-${new Date().getFullYear()}-${String(history.length + 2).padStart(3, "0")}`,
    });
  };

  // Delete history record
  const handleDeleteHistory = (id: number) => {
    if (confirm("이 분석 이력을 삭제하시겠습니까?")) {
      setHistory(history.filter((h) => h.id !== id));
    }
  };

  // Get badge variant for judgment
  const getJudgmentBadge = (judgment: string) => {
    switch (judgment) {
      case "합격":
        return <Badge variant="success">{judgment}</Badge>;
      case "조건부합격":
        return <Badge variant="warning">{judgment}</Badge>;
      case "불합격":
        return <Badge variant="destructive">{judgment}</Badge>;
      default:
        return <Badge variant="outline">{judgment}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gage R&R</h1>
          <p className="text-muted-foreground">
            측정시스템 분석 (MSA - Measurement System Analysis)
          </p>
        </div>
      </div>

      {/* Judgment Criteria Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">%GRR 판정 기준</p>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-green-600">{"< 10%: 합격"}</p>
              <p className="text-yellow-600">{"10~30%: 조건부합격"}</p>
              <p className="text-red-600">{"> 30%: 불합격"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">ndc 기준</p>
            <p className="text-2xl font-bold mt-2">5 이상</p>
            <p className="text-xs text-muted-foreground mt-1">
              구별가능 범주 수
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">EV (반복성)</p>
            <p className="text-sm mt-2">Equipment Variation</p>
            <p className="text-xs text-muted-foreground mt-1">
              동일 측정자의 반복측정 변동
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">AV (재현성)</p>
            <p className="text-sm mt-2">Appraiser Variation</p>
            <p className="text-xs text-muted-foreground mt-1">
              측정자 간 변동
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            분석 조건 설정
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            측정 데이터 입력
          </TabsTrigger>
          <TabsTrigger value="result" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            분석 결과
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            분석 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Setup */}
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                분석 조건 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Information */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-4">기본 정보</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>분석번호 *</Label>
                    <Input
                      value={condition.analysisNo}
                      onChange={(e) =>
                        setCondition({ ...condition, analysisNo: e.target.value })
                      }
                      placeholder="MSA-2026-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>분석일 *</Label>
                    <Input
                      type="date"
                      value={condition.analysisDate}
                      onChange={(e) =>
                        setCondition({
                          ...condition,
                          analysisDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>계측기명 *</Label>
                    <Input
                      value={condition.instrumentName}
                      onChange={(e) =>
                        setCondition({
                          ...condition,
                          instrumentName: e.target.value,
                        })
                      }
                      placeholder="버니어캘리퍼스"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>관리번호 *</Label>
                    <Input
                      value={condition.managementNo}
                      onChange={(e) =>
                        setCondition({
                          ...condition,
                          managementNo: e.target.value,
                        })
                      }
                      placeholder="GA-001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Conditions */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-4">분석 조건</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>측정자 수</Label>
                    <Select
                      value={condition.operatorCount.toString()}
                      onValueChange={(v) =>
                        setCondition({
                          ...condition,
                          operatorCount: parseInt(v),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}명
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>시료 수</Label>
                    <Select
                      value={condition.sampleCount.toString()}
                      onValueChange={(v) =>
                        setCondition({ ...condition, sampleCount: parseInt(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}개
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>반복측정 횟수</Label>
                    <Select
                      value={condition.trialCount.toString()}
                      onValueChange={(v) =>
                        setCondition({ ...condition, trialCount: parseInt(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}회
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>측정특성</Label>
                    <Input
                      value={condition.characteristic}
                      onChange={(e) =>
                        setCondition({
                          ...condition,
                          characteristic: e.target.value,
                        })
                      }
                      placeholder="외경, 길이 등"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>단위</Label>
                    <Select
                      value={condition.unit}
                      onValueChange={(v) =>
                        setCondition({ ...condition, unit: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm">mm</SelectItem>
                        <SelectItem value="um">um</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="inch">inch</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-4">규격 (Tolerance)</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>USL (상한규격) *</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={condition.usl ?? ""}
                      onChange={(e) =>
                        setCondition({
                          ...condition,
                          usl: e.target.value === "" ? null : parseFloat(e.target.value),
                        })
                      }
                      placeholder="10.500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LSL (하한규격) *</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={condition.lsl ?? ""}
                      onChange={(e) =>
                        setCondition({
                          ...condition,
                          lsl: e.target.value === "" ? null : parseFloat(e.target.value),
                        })
                      }
                      placeholder="9.500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tolerance (공차)</Label>
                    <Input
                      value={
                        condition.usl !== null && condition.lsl !== null
                          ? (condition.usl - condition.lsl).toFixed(3)
                          : ""
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Operator Names */}
              <div>
                <h4 className="font-medium mb-4">측정자 정보</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  {Array.from({ length: condition.operatorCount }).map(
                    (_, index) => (
                      <div key={index} className="space-y-2">
                        <Label>측정자 {index + 1}</Label>
                        <Input
                          value={operatorNames[index] || ""}
                          onChange={(e) => {
                            const newNames = [...operatorNames];
                            newNames[index] = e.target.value;
                            setOperatorNames(newNames);
                          }}
                          placeholder={`측정자 ${String.fromCharCode(65 + index)}`}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button onClick={initializeMeasurementData}>
                  <Plus className="mr-2 h-4 w-4" />
                  데이터 입력 시작
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Entry */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                측정 데이터 입력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {measurementData.data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>먼저 &quot;분석 조건 설정&quot; 탭에서 조건을 설정하고</p>
                  <p>&quot;데이터 입력 시작&quot; 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Data entry for each operator */}
                  {Array.from({ length: condition.operatorCount }).map(
                    (_, opIndex) => (
                      <div key={opIndex} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4 text-lg">
                          {operatorNames[opIndex] || `측정자 ${opIndex + 1}`}
                        </h4>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-20">시료</TableHead>
                                {Array.from({
                                  length: condition.trialCount,
                                }).map((_, trialIndex) => (
                                  <TableHead
                                    key={trialIndex}
                                    className="text-center min-w-24"
                                  >
                                    {trialIndex + 1}차
                                  </TableHead>
                                ))}
                                <TableHead className="text-center min-w-24 bg-muted">
                                  평균
                                </TableHead>
                                <TableHead className="text-center min-w-24 bg-muted">
                                  범위(R)
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.from({
                                length: condition.sampleCount,
                              }).map((_, sampleIndex) => {
                                // Calculate average and range for this row
                                const values: number[] = [];
                                for (
                                  let t = 0;
                                  t < condition.trialCount;
                                  t++
                                ) {
                                  const val =
                                    measurementData.data[opIndex]?.[
                                      sampleIndex
                                    ]?.[t];
                                  if (val !== null && val !== undefined) {
                                    values.push(val);
                                  }
                                }
                                const avg =
                                  values.length > 0
                                    ? values.reduce((a, b) => a + b, 0) /
                                      values.length
                                    : null;
                                const range =
                                  values.length > 0
                                    ? Math.max(...values) - Math.min(...values)
                                    : null;

                                return (
                                  <TableRow key={sampleIndex}>
                                    <TableCell className="font-medium">
                                      #{sampleIndex + 1}
                                    </TableCell>
                                    {Array.from({
                                      length: condition.trialCount,
                                    }).map((_, trialIndex) => (
                                      <TableCell key={trialIndex}>
                                        <Input
                                          type="number"
                                          step="0.001"
                                          className="w-24 text-center"
                                          value={
                                            measurementData.data[opIndex]?.[
                                              sampleIndex
                                            ]?.[trialIndex] ?? ""
                                          }
                                          onChange={(e) =>
                                            handleMeasurementChange(
                                              opIndex,
                                              sampleIndex,
                                              trialIndex,
                                              e.target.value
                                            )
                                          }
                                          placeholder="0.000"
                                        />
                                      </TableCell>
                                    ))}
                                    <TableCell className="text-center font-mono bg-muted">
                                      {avg !== null ? avg.toFixed(4) : "-"}
                                    </TableCell>
                                    <TableCell className="text-center font-mono bg-muted">
                                      {range !== null ? range.toFixed(4) : "-"}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Results */}
        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                분석 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>측정 데이터를 입력하면 자동으로 결과가 계산됩니다.</p>
                  <p>
                    규격(USL, LSL)과 최소 1개 이상의 측정값이 필요합니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-lg">분석 요약</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          판정:
                        </span>
                        {getJudgmentBadge(analysisResult.judgment)}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          %GRR (Gage R&R)
                        </p>
                        <p
                          className={`text-3xl font-bold ${
                            analysisResult.grrPercent < 10
                              ? "text-green-600"
                              : analysisResult.grrPercent <= 30
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {analysisResult.grrPercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          %EV (반복성)
                        </p>
                        <p className="text-3xl font-bold">
                          {analysisResult.evPercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          %AV (재현성)
                        </p>
                        <p className="text-3xl font-bold">
                          {analysisResult.avPercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">ndc</p>
                        <p
                          className={`text-3xl font-bold ${
                            analysisResult.ndc >= 5
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {analysisResult.ndc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Results Table */}
                  <div>
                    <h4 className="font-medium mb-4">상세 분석 결과</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>항목</TableHead>
                          <TableHead className="text-right">값</TableHead>
                          <TableHead className="text-right">%기여도</TableHead>
                          <TableHead>설명</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            EV (반복성 / Repeatability)
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.ev.toFixed(6)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.evPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            동일 측정자가 동일 시료를 반복 측정시 발생하는 변동
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            AV (재현성 / Reproducibility)
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.av.toFixed(6)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.avPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            서로 다른 측정자 간의 측정값 변동
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell className="font-medium">
                            GRR (Gage R&R)
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">
                            {analysisResult.grr.toFixed(6)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">
                            {analysisResult.grrPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            측정시스템 전체 변동 (EV + AV)
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            PV (부품변동 / Part Variation)
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.pv.toFixed(6)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.pvPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            시료(부품) 간의 실제 변동
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            TV (총변동 / Total Variation)
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResult.tv.toFixed(6)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            100%
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            전체 변동 (GRR + PV)
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableCell className="font-medium">
                            ndc (구별가능 범주수)
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">
                            {analysisResult.ndc}
                          </TableCell>
                          <TableCell className="text-right">-</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            측정시스템이 구별할 수 있는 범주 수 (5 이상 권장)
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Operator Statistics */}
                  <div>
                    <h4 className="font-medium mb-4">측정자별 통계</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>측정자</TableHead>
                          <TableHead className="text-right">
                            평균 (X-bar)
                          </TableHead>
                          <TableHead className="text-right">
                            범위 평균 (R-bar)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisResult.operatorMeans.map((mean, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {operatorNames[index] || `측정자 ${index + 1}`}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {mean.toFixed(4)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {analysisResult.operatorRanges[index].toFixed(4)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end gap-4">
                    <Button onClick={handleSaveAnalysis}>
                      <Save className="mr-2 h-4 w-4" />
                      분석 결과 저장
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                분석 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  분석 이력이 없습니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>분석번호</TableHead>
                        <TableHead>분석일</TableHead>
                        <TableHead>계측기명</TableHead>
                        <TableHead>관리번호</TableHead>
                        <TableHead className="text-center">
                          측정자/시료/반복
                        </TableHead>
                        <TableHead className="text-right">%EV</TableHead>
                        <TableHead className="text-right">%AV</TableHead>
                        <TableHead className="text-right">%GRR</TableHead>
                        <TableHead className="text-right">ndc</TableHead>
                        <TableHead className="text-center">판정</TableHead>
                        <TableHead className="text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono">
                            {record.analysisNo}
                          </TableCell>
                          <TableCell>{record.analysisDate}</TableCell>
                          <TableCell>{record.instrumentName}</TableCell>
                          <TableCell className="font-mono">
                            {record.managementNo}
                          </TableCell>
                          <TableCell className="text-center">
                            {record.operatorCount}/{record.sampleCount}/
                            {record.trialCount}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {record.evPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {record.avPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono font-bold ${
                              record.grrPercent < 10
                                ? "text-green-600"
                                : record.grrPercent <= 30
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {record.grrPercent.toFixed(2)}%
                          </TableCell>
                          <TableCell
                            className={`text-right font-mono ${
                              record.ndc >= 5
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {record.ndc}
                          </TableCell>
                          <TableCell className="text-center">
                            {getJudgmentBadge(record.judgment)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteHistory(record.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
