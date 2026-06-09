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
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  Settings,
  Database,
  BarChart3,
  History,
  Plus,
  Trash2,
  Calculator,
  Save,
  Search,
} from "lucide-react";

// Types
interface EvaluationSetup {
  productName: string;
  partNo: string;
  processName: string;
  measurementItem: string;
  unit: string;
  usl: number | null;
  lsl: number | null;
  target: number | null;
  evaluator: string;
  evaluationDate: string;
}

interface MeasurementData {
  id: number;
  value: number;
}

interface CapabilityResult {
  mean: number;
  stdDev: number;
  cp: number;
  cpk: number;
  ppk: number;
  cpu: number;
  cpl: number;
  sampleSize: number;
}

interface EvaluationRecord {
  id: number;
  evaluationNo: string;
  evaluationDate: string;
  productName: string;
  partNo: string;
  processName: string;
  measurementItem: string;
  usl: number | null;
  lsl: number | null;
  target: number | null;
  sampleSize: number;
  mean: number;
  stdDev: number;
  cp: number;
  cpk: number;
  ppk: number;
  judgment: string;
  evaluator: string;
  remarks: string;
}

// Generate evaluation number
function generateEvaluationNo(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `PC-${date}-${seq}`;
}

// Get Cpk judgment
function getCpkJudgment(cpk: number): { label: string; variant: "success" | "warning" | "destructive" } {
  if (cpk >= 1.67) {
    return { label: "양호", variant: "success" };
  } else if (cpk >= 1.33) {
    return { label: "보통", variant: "warning" };
  } else {
    return { label: "개선필요", variant: "destructive" };
  }
}

export default function ProcessCapabilityPage() {
  const [activeTab, setActiveTab] = useState("setup");

  // Tab 1: Evaluation setup state
  const [setup, setSetup] = useState<EvaluationSetup>({
    productName: "",
    partNo: "",
    processName: "",
    measurementItem: "",
    unit: "",
    usl: null,
    lsl: null,
    target: null,
    evaluator: "",
    evaluationDate: new Date().toISOString().split("T")[0],
  });

  // Tab 2: Measurement data state
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [newValue, setNewValue] = useState("");
  const [bulkInput, setBulkInput] = useState("");

  // Tab 3: Analysis result state (calculated)
  const [result, setResult] = useState<CapabilityResult | null>(null);

  // Tab 4: History state
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [remarks, setRemarks] = useState("");

  // Calculate statistics
  const calculateStatistics = (data: number[]): CapabilityResult | null => {
    if (data.length < 2 || setup.usl === null || setup.lsl === null) {
      return null;
    }

    const n = data.length;
    const mean = data.reduce((sum, val) => sum + val, 0) / n;

    // Sample standard deviation (for Cpk - short-term)
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);

    // Population standard deviation (for Ppk - long-term)
    const popVariance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const popStdDev = Math.sqrt(popVariance);

    if (stdDev === 0 || popStdDev === 0) {
      return null;
    }

    // Cp = (USL - LSL) / (6 * sigma)
    const cp = (setup.usl - setup.lsl) / (6 * stdDev);

    // Cpu = (USL - mean) / (3 * sigma)
    const cpu = (setup.usl - mean) / (3 * stdDev);

    // Cpl = (mean - LSL) / (3 * sigma)
    const cpl = (mean - setup.lsl) / (3 * stdDev);

    // Cpk = min(Cpu, Cpl)
    const cpk = Math.min(cpu, cpl);

    // Ppk (long-term capability using population std dev)
    const ppuPop = (setup.usl - mean) / (3 * popStdDev);
    const pplPop = (mean - setup.lsl) / (3 * popStdDev);
    const ppk = Math.min(ppuPop, pplPop);

    return {
      mean,
      stdDev,
      cp,
      cpk,
      ppk,
      cpu,
      cpl,
      sampleSize: n,
    };
  };

  // Add single measurement
  const handleAddMeasurement = () => {
    const value = parseFloat(newValue);
    if (isNaN(value)) {
      alert("유효한 숫자를 입력해주세요.");
      return;
    }
    const newId = measurements.length > 0 ? Math.max(...measurements.map(m => m.id)) + 1 : 1;
    setMeasurements([...measurements, { id: newId, value }]);
    setNewValue("");
  };

  // Add bulk measurements
  const handleBulkAdd = () => {
    const values = bulkInput
      .split(/[\s,;]+/)
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));

    if (values.length === 0) {
      alert("유효한 측정값이 없습니다.");
      return;
    }

    const maxId = measurements.length > 0 ? Math.max(...measurements.map(m => m.id)) : 0;
    const newMeasurements = values.map((value, index) => ({
      id: maxId + index + 1,
      value,
    }));

    setMeasurements([...measurements, ...newMeasurements]);
    setBulkInput("");
  };

  // Delete measurement
  const handleDeleteMeasurement = (id: number) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  // Clear all measurements
  const handleClearAll = () => {
    if (confirm("모든 측정 데이터를 삭제하시겠습니까?")) {
      setMeasurements([]);
    }
  };

  // Run analysis
  const handleAnalyze = () => {
    if (measurements.length < 30) {
      alert("공정능력 분석을 위해 최소 30개 이상의 측정 데이터가 필요합니다.");
      return;
    }

    if (setup.usl === null || setup.lsl === null) {
      alert("규격 한계(USL, LSL)를 설정해주세요.");
      return;
    }

    const data = measurements.map(m => m.value);
    const calculatedResult = calculateStatistics(data);

    if (calculatedResult) {
      setResult(calculatedResult);
      setActiveTab("analysis");
    } else {
      alert("계산 중 오류가 발생했습니다.");
    }
  };

  // Save evaluation record
  const handleSaveRecord = () => {
    if (!result) {
      alert("분석 결과가 없습니다. 먼저 분석을 실행해주세요.");
      return;
    }

    if (!setup.productName || !setup.processName) {
      alert("제품명과 공정명을 입력해주세요.");
      return;
    }

    const judgment = getCpkJudgment(result.cpk);
    const newRecord: EvaluationRecord = {
      id: Date.now(),
      evaluationNo: generateEvaluationNo(),
      evaluationDate: setup.evaluationDate,
      productName: setup.productName,
      partNo: setup.partNo,
      processName: setup.processName,
      measurementItem: setup.measurementItem,
      usl: setup.usl,
      lsl: setup.lsl,
      target: setup.target,
      sampleSize: result.sampleSize,
      mean: result.mean,
      stdDev: result.stdDev,
      cp: result.cp,
      cpk: result.cpk,
      ppk: result.ppk,
      judgment: judgment.label,
      evaluator: setup.evaluator,
      remarks,
    };

    setEvaluationHistory([newRecord, ...evaluationHistory]);
    alert("평가 기록이 저장되었습니다.");
    setActiveTab("history");
  };

  // Reset form
  const handleReset = () => {
    if (confirm("모든 입력 데이터를 초기화하시겠습니까?")) {
      setSetup({
        productName: "",
        partNo: "",
        processName: "",
        measurementItem: "",
        unit: "",
        usl: null,
        lsl: null,
        target: null,
        evaluator: "",
        evaluationDate: new Date().toISOString().split("T")[0],
      });
      setMeasurements([]);
      setResult(null);
      setRemarks("");
      setActiveTab("setup");
    }
  };

  // Filter history
  const filteredHistory = evaluationHistory.filter(
    (record) =>
      record.evaluationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.partNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.processName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get judgment badge
  const getJudgmentBadge = (judgment: string) => {
    switch (judgment) {
      case "양호":
        return <Badge variant="success">{judgment}</Badge>;
      case "보통":
        return <Badge variant="warning">{judgment}</Badge>;
      case "개선필요":
        return <Badge variant="destructive">{judgment}</Badge>;
      default:
        return <Badge variant="secondary">{judgment}</Badge>;
    }
  };

  // Calculate live statistics for preview
  const liveStats = measurements.length >= 2 && setup.usl !== null && setup.lsl !== null
    ? calculateStatistics(measurements.map(m => m.value))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8" />
            공정능력 평가표
          </h1>
          <p className="text-muted-foreground">
            Process Capability Analysis (Cp, Cpk, Ppk)
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          초기화
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">
            <Settings className="mr-2 h-4 w-4" />
            평가 조건 설정
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="mr-2 h-4 w-4" />
            측정 데이터 입력
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="mr-2 h-4 w-4" />
            공정능력 분석결과
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            평가 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 평가 조건 설정 */}
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                평가 조건 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">제품 및 공정 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="productName">제품명 *</Label>
                    <Input
                      id="productName"
                      placeholder="제품명 입력"
                      value={setup.productName}
                      onChange={(e) => setSetup({ ...setup, productName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partNo">품번</Label>
                    <Input
                      id="partNo"
                      placeholder="품번 입력"
                      value={setup.partNo}
                      onChange={(e) => setSetup({ ...setup, partNo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processName">공정명 *</Label>
                    <Input
                      id="processName"
                      placeholder="공정명 입력"
                      value={setup.processName}
                      onChange={(e) => setSetup({ ...setup, processName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="measurementItem">측정항목</Label>
                    <Input
                      id="measurementItem"
                      placeholder="예: 외경 치수"
                      value={setup.measurementItem}
                      onChange={(e) => setSetup({ ...setup, measurementItem: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">측정단위</Label>
                    <Input
                      id="unit"
                      placeholder="예: mm"
                      value={setup.unit}
                      onChange={(e) => setSetup({ ...setup, unit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evaluationDate">평가일</Label>
                    <Input
                      id="evaluationDate"
                      type="date"
                      value={setup.evaluationDate}
                      onChange={(e) => setSetup({ ...setup, evaluationDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evaluator">평가자</Label>
                  <Input
                    id="evaluator"
                    placeholder="평가자명"
                    value={setup.evaluator}
                    onChange={(e) => setSetup({ ...setup, evaluator: e.target.value })}
                    className="max-w-md"
                  />
                </div>
              </div>

              {/* Specification Limits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">규격 (Specification Limits)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="lsl">하한규격 (LSL) *</Label>
                    <Input
                      id="lsl"
                      type="number"
                      step="any"
                      placeholder="예: 24.900"
                      value={setup.lsl ?? ""}
                      onChange={(e) =>
                        setSetup({
                          ...setup,
                          lsl: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">목표값 (Target)</Label>
                    <Input
                      id="target"
                      type="number"
                      step="any"
                      placeholder="예: 25.000"
                      value={setup.target ?? ""}
                      onChange={(e) =>
                        setSetup({
                          ...setup,
                          target: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usl">상한규격 (USL) *</Label>
                    <Input
                      id="usl"
                      type="number"
                      step="any"
                      placeholder="예: 25.100"
                      value={setup.usl ?? ""}
                      onChange={(e) =>
                        setSetup({
                          ...setup,
                          usl: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Specification Summary */}
              {setup.usl !== null && setup.lsl !== null && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-4">규격 요약</h4>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">LSL (하한)</p>
                      <p className="font-mono text-lg font-semibold">
                        {setup.lsl.toFixed(3)} {setup.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target (목표)</p>
                      <p className="font-mono text-lg font-semibold">
                        {setup.target?.toFixed(3) ?? "-"} {setup.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">USL (상한)</p>
                      <p className="font-mono text-lg font-semibold">
                        {setup.usl.toFixed(3)} {setup.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">규격 폭</p>
                      <p className="font-mono text-lg font-semibold">
                        {(setup.usl - setup.lsl).toFixed(3)} {setup.unit}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("data")}>
                  다음: 측정 데이터 입력
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 측정 데이터 입력 */}
        <TabsContent value="data">
          <div className="space-y-6">
            {/* Data Entry Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  측정 데이터 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Single Entry */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">개별 입력</h3>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="singleValue">측정값</Label>
                      <Input
                        id="singleValue"
                        type="number"
                        step="any"
                        placeholder={`측정값 입력 (${setup.unit || "단위"})`}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddMeasurement();
                          }
                        }}
                      />
                    </div>
                    <Button onClick={handleAddMeasurement}>
                      <Plus className="mr-2 h-4 w-4" />
                      추가
                    </Button>
                  </div>
                </div>

                {/* Bulk Entry */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">대량 입력</h3>
                  <div className="space-y-2">
                    <Label htmlFor="bulkInput">
                      측정값 (쉼표, 공백, 세미콜론으로 구분)
                    </Label>
                    <Textarea
                      id="bulkInput"
                      placeholder="예: 25.01, 25.02, 24.98, 25.00, 24.99..."
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleBulkAdd} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    대량 추가
                  </Button>
                </div>

                {/* Data Status */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">입력된 데이터</p>
                      <p className="text-2xl font-bold">{measurements.length}개</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">최소 필요 데이터</p>
                      <p className="text-2xl font-bold">30개</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">상태</p>
                      {measurements.length >= 30 ? (
                        <Badge variant="success" className="text-lg">분석 가능</Badge>
                      ) : (
                        <Badge variant="warning" className="text-lg">
                          {30 - measurements.length}개 부족
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Table Card */}
            {measurements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>입력된 데이터 ({measurements.length}개)</span>
                    <Button variant="destructive" size="sm" onClick={handleClearAll}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      전체 삭제
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">No.</TableHead>
                          <TableHead>측정값</TableHead>
                          <TableHead className="w-20">삭제</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {measurements.map((m, index) => (
                          <TableRow key={m.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono">
                              {m.value.toFixed(4)} {setup.unit}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMeasurement(m.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Live Preview Stats */}
                  {liveStats && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">실시간 통계 (미리보기)</h4>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">평균 (X-bar):</span>
                          <span className="ml-2 font-mono">{liveStats.mean.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">표준편차 (sigma):</span>
                          <span className="ml-2 font-mono">{liveStats.stdDev.toFixed(4)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cpk:</span>
                          <span className="ml-2 font-mono">{liveStats.cpk.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ppk:</span>
                          <span className="ml-2 font-mono">{liveStats.ppk.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("setup")}>
                이전: 평가 조건 설정
              </Button>
              <Button onClick={handleAnalyze} disabled={measurements.length < 30}>
                <Calculator className="mr-2 h-4 w-4" />
                분석 실행
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: 공정능력 분석결과 */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Analysis Summary */}
            {result ? (
              <>
                {/* Evaluation Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>평가 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">제품명</p>
                        <p className="font-semibold">{setup.productName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">품번</p>
                        <p className="font-mono">{setup.partNo || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">공정명</p>
                        <p className="font-semibold">{setup.processName || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">측정항목</p>
                        <p>{setup.measurementItem || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Specification & Statistics */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>규격 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">상한규격 (USL)</span>
                          <span className="font-mono">{setup.usl?.toFixed(4)} {setup.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">목표값 (Target)</span>
                          <span className="font-mono">{setup.target?.toFixed(4) ?? "-"} {setup.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">하한규격 (LSL)</span>
                          <span className="font-mono">{setup.lsl?.toFixed(4)} {setup.unit}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-muted-foreground">규격 폭 (USL - LSL)</span>
                          <span className="font-mono font-semibold">
                            {((setup.usl ?? 0) - (setup.lsl ?? 0)).toFixed(4)} {setup.unit}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>측정 통계</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">샘플 크기 (n)</span>
                          <span className="font-mono">{result.sampleSize}개</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">평균 (X-bar)</span>
                          <span className="font-mono">{result.mean.toFixed(4)} {setup.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">표준편차 (sigma)</span>
                          <span className="font-mono">{result.stdDev.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-muted-foreground">6sigma 폭</span>
                          <span className="font-mono font-semibold">
                            {(6 * result.stdDev).toFixed(4)} {setup.unit}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Capability Indices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      공정능력 지수
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <Card className="border-2">
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm text-muted-foreground">Cp (잠재능력)</p>
                          <p className="text-4xl font-bold font-mono mt-2">
                            {result.cp.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            (USL - LSL) / 6sigma
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-primary">
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm text-muted-foreground">Cpk (단기 공정능력)</p>
                          <p className="text-4xl font-bold font-mono mt-2">
                            {result.cpk.toFixed(2)}
                          </p>
                          <div className="mt-2">
                            {(() => {
                              const judgment = getCpkJudgment(result.cpk);
                              return <Badge variant={judgment.variant}>{judgment.label}</Badge>;
                            })()}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            min(Cpu, Cpl)
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-2">
                        <CardContent className="pt-6 text-center">
                          <p className="text-sm text-muted-foreground">Ppk (장기 공정능력)</p>
                          <p className="text-4xl font-bold font-mono mt-2">
                            {result.ppk.toFixed(2)}
                          </p>
                          <div className="mt-2">
                            {(() => {
                              const judgment = getCpkJudgment(result.ppk);
                              return <Badge variant={judgment.variant}>{judgment.label}</Badge>;
                            })()}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Overall capability
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Cpu and Cpl Details */}
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cpu (상한 기준)</span>
                          <span className="font-mono text-xl">{result.cpu.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          (USL - X-bar) / 3sigma = ({setup.usl?.toFixed(3)} - {result.mean.toFixed(3)}) / {(3 * result.stdDev).toFixed(3)}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cpl (하한 기준)</span>
                          <span className="font-mono text-xl">{result.cpl.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          (X-bar - LSL) / 3sigma = ({result.mean.toFixed(3)} - {setup.lsl?.toFixed(3)}) / {(3 * result.stdDev).toFixed(3)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Judgment Criteria */}
                <Card>
                  <CardHeader>
                    <CardTitle>판정 기준</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cpk 범위</TableHead>
                          <TableHead>판정</TableHead>
                          <TableHead>설명</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className={result.cpk >= 1.67 ? "bg-green-50" : ""}>
                          <TableCell className="font-mono">Cpk &ge; 1.67</TableCell>
                          <TableCell><Badge variant="success">양호</Badge></TableCell>
                          <TableCell>공정능력 우수, 현 상태 유지</TableCell>
                        </TableRow>
                        <TableRow className={result.cpk >= 1.33 && result.cpk < 1.67 ? "bg-yellow-50" : ""}>
                          <TableCell className="font-mono">1.33 &le; Cpk &lt; 1.67</TableCell>
                          <TableCell><Badge variant="warning">보통</Badge></TableCell>
                          <TableCell>공정능력 양호, 지속적 모니터링 필요</TableCell>
                        </TableRow>
                        <TableRow className={result.cpk < 1.33 ? "bg-red-50" : ""}>
                          <TableCell className="font-mono">Cpk &lt; 1.33</TableCell>
                          <TableCell><Badge variant="destructive">개선필요</Badge></TableCell>
                          <TableCell>공정능력 부족, 개선 조치 필요</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Remarks and Save */}
                <Card>
                  <CardHeader>
                    <CardTitle>비고 및 저장</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="remarks">비고 / 특이사항</Label>
                      <Textarea
                        id="remarks"
                        placeholder="평가 관련 특이사항을 입력하세요..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("data")}>
                        이전: 측정 데이터
                      </Button>
                      <Button onClick={handleSaveRecord}>
                        <Save className="mr-2 h-4 w-4" />
                        평가 기록 저장
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">분석 결과 없음</h3>
                  <p className="text-muted-foreground mb-4">
                    측정 데이터를 입력하고 분석을 실행해주세요.
                  </p>
                  <Button onClick={() => setActiveTab("data")}>
                    데이터 입력으로 이동
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: 평가 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                평가 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="평가번호, 제품명, 품번, 공정명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredHistory.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  평가 기록이 없습니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>평가번호</TableHead>
                        <TableHead>평가일</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>공정명</TableHead>
                        <TableHead className="text-right">샘플수</TableHead>
                        <TableHead className="text-right">평균</TableHead>
                        <TableHead className="text-right">Cp</TableHead>
                        <TableHead className="text-right">Cpk</TableHead>
                        <TableHead className="text-right">Ppk</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>평가자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm">{record.evaluationNo}</TableCell>
                          <TableCell>{record.evaluationDate}</TableCell>
                          <TableCell>{record.productName}</TableCell>
                          <TableCell className="font-mono">{record.partNo}</TableCell>
                          <TableCell>{record.processName}</TableCell>
                          <TableCell className="text-right">{record.sampleSize}</TableCell>
                          <TableCell className="text-right font-mono">{record.mean.toFixed(4)}</TableCell>
                          <TableCell className="text-right font-mono">{record.cp.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-mono">{record.cpk.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-mono">{record.ppk.toFixed(2)}</TableCell>
                          <TableCell>{getJudgmentBadge(record.judgment)}</TableCell>
                          <TableCell>{record.evaluator}</TableCell>
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
