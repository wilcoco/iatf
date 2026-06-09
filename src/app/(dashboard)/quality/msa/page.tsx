"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Ruler, Settings, Grid3X3, Calculator, History, Save, Trash2 } from "lucide-react";

// MSA Study Setup interface
interface MSASetup {
  studyNumber: string;
  studyDate: string;
  measurementItem: string;
  measuringDevice: string;
  usl: number | null;
  lsl: number | null;
  tolerance: number | null;
  operators: [string, string, string];
  sampleCount: number;
  trialCount: number;
}

// Measurement data structure: operators[3] x samples[10] x trials[3]
type MeasurementData = number[][][]; // [operator][sample][trial]

// GRR Analysis Results
interface GRRResults {
  repeatability: number;
  reproducibility: number;
  grr: number;
  percentGRR: number;
  ndc: number;
  judgment: "pass" | "conditional" | "fail";
  partVariation: number;
  totalVariation: number;
}

// MSA History Record
interface MSAHistoryRecord {
  id: number;
  studyNumber: string;
  studyDate: string;
  measurementItem: string;
  measuringDevice: string;
  percentGRR: number;
  judgment: "pass" | "conditional" | "fail";
  createdAt: string;
}

export default function MSAPage() {
  const [activeTab, setActiveTab] = useState("setup");

  // Tab 1: MSA Setup
  const [setup, setSetup] = useState<MSASetup>({
    studyNumber: "",
    studyDate: new Date().toISOString().split("T")[0],
    measurementItem: "",
    measuringDevice: "",
    usl: null,
    lsl: null,
    tolerance: null,
    operators: ["", "", ""],
    sampleCount: 10,
    trialCount: 3,
  });

  // Tab 2: Measurement Data (3 operators x 10 samples x 3 trials)
  const [measurementData, setMeasurementData] = useState<MeasurementData>(
    Array(3)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => Array(3).fill(NaN))
      )
  );

  // Tab 4: History
  const [history, setHistory] = useState<MSAHistoryRecord[]>([]);

  // Calculate tolerance when USL or LSL changes
  const handleSpecChange = (field: "usl" | "lsl", value: string) => {
    const numValue = value ? parseFloat(value) : null;
    const newSetup = { ...setup, [field]: numValue };

    if (newSetup.usl !== null && newSetup.lsl !== null) {
      newSetup.tolerance = newSetup.usl - newSetup.lsl;
    } else {
      newSetup.tolerance = null;
    }

    setSetup(newSetup);
  };

  // Update measurement value
  const updateMeasurement = (
    operatorIndex: number,
    sampleIndex: number,
    trialIndex: number,
    value: string
  ) => {
    const newData = measurementData.map((op, oi) =>
      op.map((sample, si) =>
        sample.map((trial, ti) =>
          oi === operatorIndex && si === sampleIndex && ti === trialIndex
            ? value === "" ? NaN : parseFloat(value)
            : trial
        )
      )
    );
    setMeasurementData(newData);
  };

  // Calculate GRR Analysis
  const calculateGRR = (): GRRResults | null => {
    // Check if we have enough valid data
    const allValues: number[] = [];
    for (let op = 0; op < 3; op++) {
      for (let s = 0; s < 10; s++) {
        for (let t = 0; t < 3; t++) {
          if (!isNaN(measurementData[op][s][t])) {
            allValues.push(measurementData[op][s][t]);
          }
        }
      }
    }

    if (allValues.length < 90 || setup.tolerance === null || setup.tolerance === 0) {
      return null;
    }

    const numOperators = 3;
    const numSamples = 10;
    const numTrials = 3;
    const n = numOperators * numSamples * numTrials;

    // Calculate grand mean
    const grandMean = allValues.reduce((a, b) => a + b, 0) / n;

    // Calculate operator means
    const operatorMeans: number[] = [];
    for (let op = 0; op < numOperators; op++) {
      let sum = 0;
      let count = 0;
      for (let s = 0; s < numSamples; s++) {
        for (let t = 0; t < numTrials; t++) {
          sum += measurementData[op][s][t];
          count++;
        }
      }
      operatorMeans.push(sum / count);
    }

    // Calculate part means
    const partMeans: number[] = [];
    for (let s = 0; s < numSamples; s++) {
      let sum = 0;
      let count = 0;
      for (let op = 0; op < numOperators; op++) {
        for (let t = 0; t < numTrials; t++) {
          sum += measurementData[op][s][t];
          count++;
        }
      }
      partMeans.push(sum / count);
    }

    // ANOVA calculations
    // SS Total
    let ssTotal = 0;
    for (let op = 0; op < numOperators; op++) {
      for (let s = 0; s < numSamples; s++) {
        for (let t = 0; t < numTrials; t++) {
          ssTotal += Math.pow(measurementData[op][s][t] - grandMean, 2);
        }
      }
    }

    // SS Parts
    let ssParts = 0;
    for (let s = 0; s < numSamples; s++) {
      ssParts += Math.pow(partMeans[s] - grandMean, 2) * numOperators * numTrials;
    }

    // SS Operators
    let ssOperators = 0;
    for (let op = 0; op < numOperators; op++) {
      ssOperators += Math.pow(operatorMeans[op] - grandMean, 2) * numSamples * numTrials;
    }

    // SS Equipment (Repeatability) - Within subgroups
    let ssEquipment = 0;
    for (let op = 0; op < numOperators; op++) {
      for (let s = 0; s < numSamples; s++) {
        let cellMean = 0;
        for (let t = 0; t < numTrials; t++) {
          cellMean += measurementData[op][s][t];
        }
        cellMean /= numTrials;
        for (let t = 0; t < numTrials; t++) {
          ssEquipment += Math.pow(measurementData[op][s][t] - cellMean, 2);
        }
      }
    }

    // SS Interaction (Operator x Part)
    const ssInteraction = ssTotal - ssParts - ssOperators - ssEquipment;

    // Degrees of freedom
    const dfParts = numSamples - 1;
    const dfOperators = numOperators - 1;
    const dfInteraction = dfParts * dfOperators;
    const dfEquipment = numOperators * numSamples * (numTrials - 1);

    // Mean squares
    const msParts = ssParts / dfParts;
    const msOperators = ssOperators / dfOperators;
    const msInteraction = Math.max(0, ssInteraction / dfInteraction);
    const msEquipment = ssEquipment / dfEquipment;

    // Variance components
    const varEquipment = msEquipment; // Repeatability variance
    const varInteraction = Math.max(0, (msInteraction - msEquipment) / numTrials);
    const varOperator = Math.max(0, (msOperators - msInteraction) / (numSamples * numTrials));
    const varPart = Math.max(0, (msParts - msInteraction) / (numOperators * numTrials));

    // Repeatability (Equipment Variation)
    const repeatability = Math.sqrt(varEquipment);

    // Reproducibility (Operator Variation including interaction)
    const reproducibility = Math.sqrt(varOperator + varInteraction);

    // GRR (Gage R&R)
    const grr = Math.sqrt(Math.pow(repeatability, 2) + Math.pow(reproducibility, 2));

    // Part Variation
    const partVariation = Math.sqrt(varPart);

    // Total Variation
    const totalVariation = Math.sqrt(
      Math.pow(grr, 2) + Math.pow(partVariation, 2)
    );

    // %GRR (Study Variation method using tolerance)
    const percentGRR = (grr / (setup.tolerance! / 6)) * 100;

    // ndc (Number of Distinct Categories)
    const ndc = Math.floor(1.41 * (partVariation / grr));

    // Judgment
    let judgment: "pass" | "conditional" | "fail";
    if (percentGRR <= 10) {
      judgment = "pass";
    } else if (percentGRR <= 30) {
      judgment = "conditional";
    } else {
      judgment = "fail";
    }

    return {
      repeatability,
      reproducibility,
      grr,
      percentGRR,
      ndc,
      judgment,
      partVariation,
      totalVariation,
    };
  };

  const grrResults = calculateGRR();

  // Get judgment badge
  const getJudgmentBadge = (judgment: "pass" | "conditional" | "fail") => {
    switch (judgment) {
      case "pass":
        return <Badge variant="success">합격 (10% 이하)</Badge>;
      case "conditional":
        return <Badge variant="warning">조건부 (10-30%)</Badge>;
      case "fail":
        return <Badge variant="error">불합격 (30% 초과)</Badge>;
    }
  };

  // Save study to history
  const handleSaveStudy = () => {
    if (!grrResults || !setup.studyNumber) {
      alert("연구번호를 입력하고 모든 측정 데이터를 완료해주세요.");
      return;
    }

    const newRecord: MSAHistoryRecord = {
      id: Date.now(),
      studyNumber: setup.studyNumber,
      studyDate: setup.studyDate,
      measurementItem: setup.measurementItem,
      measuringDevice: setup.measuringDevice,
      percentGRR: grrResults.percentGRR,
      judgment: grrResults.judgment,
      createdAt: new Date().toISOString(),
    };

    setHistory([newRecord, ...history]);
    alert("MSA 연구가 저장되었습니다.");
  };

  // Delete history record
  const handleDeleteHistory = (id: number) => {
    setHistory(history.filter((record) => record.id !== id));
  };

  // Check if all measurements are entered
  const getMeasurementProgress = () => {
    let filled = 0;
    const total = 90;
    for (let op = 0; op < 3; op++) {
      for (let s = 0; s < 10; s++) {
        for (let t = 0; t < 3; t++) {
          if (!isNaN(measurementData[op][s][t])) {
            filled++;
          }
        }
      }
    }
    return { filled, total, percent: Math.round((filled / total) * 100) };
  };

  const progress = getMeasurementProgress();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Ruler className="h-8 w-8" />
          MSA (측정시스템분석)
        </h1>
        <p className="text-muted-foreground">
          IATF 16949 Measurement System Analysis - Gage R&R Study
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">MSA 기본정보</TabsTrigger>
          <TabsTrigger value="data">측정 데이터 입력</TabsTrigger>
          <TabsTrigger value="results">GRR 분석결과</TabsTrigger>
          <TabsTrigger value="history">MSA 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: MSA Setup */}
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                MSA 기본정보 설정 (Study Setup)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Study Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="studyNumber">연구번호 (Study Number)</Label>
                  <Input
                    id="studyNumber"
                    placeholder="예: MSA-2024-001"
                    value={setup.studyNumber}
                    onChange={(e) => setSetup({ ...setup, studyNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studyDate">연구일 (Study Date)</Label>
                  <Input
                    id="studyDate"
                    type="date"
                    value={setup.studyDate}
                    onChange={(e) => setSetup({ ...setup, studyDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Measurement Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="measurementItem">측정항목명 (Measurement Item)</Label>
                  <Input
                    id="measurementItem"
                    placeholder="예: 외경 치수, 두께"
                    value={setup.measurementItem}
                    onChange={(e) => setSetup({ ...setup, measurementItem: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="measuringDevice">측정기기 (Measuring Device)</Label>
                  <Input
                    id="measuringDevice"
                    placeholder="예: 마이크로미터 #001"
                    value={setup.measuringDevice}
                    onChange={(e) => setSetup({ ...setup, measuringDevice: e.target.value })}
                  />
                </div>
              </div>

              {/* Specification Limits */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">규격 (Specification Limits)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="usl">상한규격 (USL)</Label>
                    <Input
                      id="usl"
                      type="number"
                      step="0.001"
                      placeholder="예: 25.100"
                      value={setup.usl ?? ""}
                      onChange={(e) => handleSpecChange("usl", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lsl">하한규격 (LSL)</Label>
                    <Input
                      id="lsl"
                      type="number"
                      step="0.001"
                      placeholder="예: 24.900"
                      value={setup.lsl ?? ""}
                      onChange={(e) => handleSpecChange("lsl", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tolerance">공차 (Tolerance)</Label>
                    <Input
                      id="tolerance"
                      type="number"
                      step="0.001"
                      value={setup.tolerance ?? ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Operators */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">측정자 (Operators) - 3명</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <Label htmlFor={`operator${i + 1}`}>측정자 {i + 1}</Label>
                      <Input
                        id={`operator${i + 1}`}
                        placeholder={`예: 홍길동`}
                        value={setup.operators[i]}
                        onChange={(e) => {
                          const newOperators = [...setup.operators] as [string, string, string];
                          newOperators[i] = e.target.value;
                          setSetup({ ...setup, operators: newOperators });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Parameters */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">연구 파라미터</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>시료 수 (Number of Parts)</Label>
                    <Input value="10개" disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>반복 횟수 (Number of Trials)</Label>
                    <Input value="3회" disabled className="bg-muted" />
                  </div>
                </div>
              </div>

              {/* Setup Summary */}
              {setup.tolerance && setup.operators.every((op) => op !== "") && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">설정 요약</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">공차 (Tolerance)</p>
                      <p className="font-mono font-semibold">{setup.tolerance.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">총 측정 데이터</p>
                      <p className="font-mono font-semibold">
                        3명 x 10시료 x 3회 = 90개
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">측정자</p>
                      <p className="font-semibold">
                        {setup.operators.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">측정항목</p>
                      <p className="font-semibold">{setup.measurementItem || "-"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Measurement Data Entry */}
        <TabsContent value="data">
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5" />
                    측정 데이터 입력 (3명 x 10시료 x 3회 = 90개)
                  </span>
                  <Badge variant={progress.percent === 100 ? "success" : "secondary"}>
                    입력 진행률: {progress.filled}/{progress.total} ({progress.percent}%)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all ${
                      progress.percent === 100 ? "bg-green-500" : "bg-primary"
                    }`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Measurement Tables per Operator */}
            {[0, 1, 2].map((operatorIndex) => (
              <Card key={operatorIndex}>
                <CardHeader>
                  <CardTitle>
                    측정자 {operatorIndex + 1}: {setup.operators[operatorIndex] || `Operator ${operatorIndex + 1}`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">시료</TableHead>
                          <TableHead className="text-center">1회차</TableHead>
                          <TableHead className="text-center">2회차</TableHead>
                          <TableHead className="text-center">3회차</TableHead>
                          <TableHead className="text-center">평균</TableHead>
                          <TableHead className="text-center">범위(R)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 10 }, (_, sampleIndex) => {
                          const values = measurementData[operatorIndex][sampleIndex];
                          const validValues = values.filter((v) => !isNaN(v));
                          const mean =
                            validValues.length > 0
                              ? validValues.reduce((a, b) => a + b, 0) / validValues.length
                              : NaN;
                          const range =
                            validValues.length > 0
                              ? Math.max(...validValues) - Math.min(...validValues)
                              : NaN;

                          return (
                            <TableRow key={sampleIndex}>
                              <TableCell className="font-medium">
                                Part {sampleIndex + 1}
                              </TableCell>
                              {[0, 1, 2].map((trialIndex) => (
                                <TableCell key={trialIndex} className="p-1">
                                  <Input
                                    type="number"
                                    step="0.001"
                                    className="text-center h-9"
                                    value={
                                      isNaN(measurementData[operatorIndex][sampleIndex][trialIndex])
                                        ? ""
                                        : measurementData[operatorIndex][sampleIndex][trialIndex]
                                    }
                                    onChange={(e) =>
                                      updateMeasurement(
                                        operatorIndex,
                                        sampleIndex,
                                        trialIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-mono bg-muted/50">
                                {isNaN(mean) ? "-" : mean.toFixed(4)}
                              </TableCell>
                              <TableCell className="text-center font-mono bg-muted/50">
                                {isNaN(range) ? "-" : range.toFixed(4)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: GRR Analysis Results */}
        <TabsContent value="results">
          <div className="space-y-6">
            {!grrResults ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">분석 데이터 부족</h3>
                    <p className="text-muted-foreground mb-4">
                      GRR 분석을 위해 다음 조건을 충족해야 합니다:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- 모든 측정 데이터 입력 (90개)</li>
                      <li>- USL/LSL 규격 설정</li>
                    </ul>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("setup")}>
                        기본정보 설정
                      </Button>
                      <Button onClick={() => setActiveTab("data")}>
                        데이터 입력
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        GRR 분석결과 (Gage R&R Analysis)
                      </span>
                      <Button onClick={handleSaveStudy}>
                        <Save className="mr-2 h-4 w-4" />
                        연구 저장
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Main Result */}
                    <div className="text-center p-6 bg-muted rounded-lg mb-6">
                      <p className="text-sm text-muted-foreground mb-2">%GRR (Tolerance 기준)</p>
                      <p className="text-5xl font-bold font-mono">
                        {grrResults.percentGRR.toFixed(2)}%
                      </p>
                      <div className="mt-4">{getJudgmentBadge(grrResults.judgment)}</div>
                    </div>

                    {/* Detailed Results */}
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm text-muted-foreground">반복성 (Repeatability)</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {grrResults.repeatability.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">EV (Equipment Variation)</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm text-muted-foreground">재현성 (Reproducibility)</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {grrResults.reproducibility.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">AV (Appraiser Variation)</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm text-muted-foreground">GRR</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {grrResults.grr.toFixed(6)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            sqrt(EV^2 + AV^2)
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-medium mb-4">변동 분석 (Variation Analysis)</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">GRR (측정시스템)</span>
                              <span className="font-mono">{grrResults.grr.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Part Variation (부품)</span>
                              <span className="font-mono">{grrResults.partVariation.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Variation (전체)</span>
                              <span className="font-mono">{grrResults.totalVariation.toFixed(6)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-medium mb-4">ndc (Number of Distinct Categories)</h4>
                          <div className="text-center">
                            <p className="text-4xl font-bold font-mono">
                              {grrResults.ndc}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {grrResults.ndc >= 5
                                ? "ndc >= 5: 측정시스템 적합"
                                : "ndc < 5: 측정시스템 개선 필요"}
                            </p>
                            <Badge
                              variant={grrResults.ndc >= 5 ? "success" : "warning"}
                              className="mt-2"
                            >
                              {grrResults.ndc >= 5 ? "적합" : "개선 필요"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Judgment Criteria */}
                <Card>
                  <CardHeader>
                    <CardTitle>%GRR 판정 기준 (AIAG Guidelines)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>%GRR 범위</TableHead>
                          <TableHead>판정</TableHead>
                          <TableHead>해석</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className={grrResults.percentGRR <= 10 ? "bg-green-50" : ""}>
                          <TableCell>10% 이하</TableCell>
                          <TableCell>
                            <Badge variant="success">합격</Badge>
                          </TableCell>
                          <TableCell>측정시스템 허용 가능, 권장 사용</TableCell>
                        </TableRow>
                        <TableRow
                          className={
                            grrResults.percentGRR > 10 && grrResults.percentGRR <= 30
                              ? "bg-yellow-50"
                              : ""
                          }
                        >
                          <TableCell>10% ~ 30%</TableCell>
                          <TableCell>
                            <Badge variant="warning">조건부</Badge>
                          </TableCell>
                          <TableCell>
                            적용 중요도, 측정장비 비용, 수리 비용 등을 고려하여
                            사용 여부 결정
                          </TableCell>
                        </TableRow>
                        <TableRow className={grrResults.percentGRR > 30 ? "bg-red-50" : ""}>
                          <TableCell>30% 초과</TableCell>
                          <TableCell>
                            <Badge variant="error">불합격</Badge>
                          </TableCell>
                          <TableCell>
                            측정시스템 개선 필요, 원인 파악 및 시정 조치 필요
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Formula Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle>GRR 계산 공식</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">기본 공식</h4>
                        <div className="space-y-2 font-mono text-sm">
                          <p>GRR = sqrt(EV^2 + AV^2)</p>
                          <p>%GRR = (GRR / (Tolerance/6)) x 100</p>
                          <p>ndc = 1.41 x (PV / GRR)</p>
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">용어 정의</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">EV:</span> Equipment Variation
                            (반복성)
                          </p>
                          <p>
                            <span className="font-medium">AV:</span> Appraiser Variation
                            (재현성)
                          </p>
                          <p>
                            <span className="font-medium">PV:</span> Part Variation
                            (부품 변동)
                          </p>
                          <p>
                            <span className="font-medium">ndc:</span> Number of Distinct
                            Categories (구분 범주 수)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: MSA History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                MSA 이력 (Study History)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">저장된 이력 없음</h3>
                  <p className="text-muted-foreground">
                    MSA 연구를 완료하고 저장하면 여기에 기록됩니다.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>연구번호</TableHead>
                      <TableHead>연구일</TableHead>
                      <TableHead>측정항목</TableHead>
                      <TableHead>측정기기</TableHead>
                      <TableHead className="text-center">%GRR</TableHead>
                      <TableHead className="text-center">판정</TableHead>
                      <TableHead className="text-center">저장일시</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.studyNumber}</TableCell>
                        <TableCell>{record.studyDate}</TableCell>
                        <TableCell>{record.measurementItem}</TableCell>
                        <TableCell>{record.measuringDevice}</TableCell>
                        <TableCell className="text-center font-mono">
                          {record.percentGRR.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-center">
                          {getJudgmentBadge(record.judgment)}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {new Date(record.createdAt).toLocaleString("ko-KR")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteHistory(record.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
