"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, Calculator, ClipboardList, History, Settings, Save, Trash2 } from "lucide-react";

interface AnalysisCondition {
  analysisNo: string;
  analysisDate: string;
  equipmentName: string;
  managementNo: string;
  measurementItem: string;
  usl: string;
  lsl: string;
  target: string;
  measurementQty: string;
  inspector: string;
}

interface MeasurementData {
  values: string[];
}

interface AnalysisResult {
  mean: number | null;
  stdDev: number | null;
  cm: number | null;
  cmk: number | null;
  judgment: string;
  judgmentColor: string;
}

interface CapabilityRecord {
  id: number;
  condition: AnalysisCondition;
  measurements: string[];
  result: AnalysisResult;
  createdAt: string;
}

export default function EquipmentCapabilityPage() {
  const [activeTab, setActiveTab] = useState("setup");

  // Tab 1: Analysis Condition
  const [condition, setCondition] = useState<AnalysisCondition>({
    analysisNo: "",
    analysisDate: new Date().toISOString().split("T")[0],
    equipmentName: "",
    managementNo: "",
    measurementItem: "",
    usl: "",
    lsl: "",
    target: "",
    measurementQty: "50",
    inspector: "",
  });

  // Tab 2: Measurement Data
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    values: Array(50).fill(""),
  });

  // Tab 3: Analysis Result (calculated)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    mean: null,
    stdDev: null,
    cm: null,
    cmk: null,
    judgment: "",
    judgmentColor: "",
  });

  // Tab 4: History
  const [history, setHistory] = useState<CapabilityRecord[]>([]);

  // Generate analysis number
  const generateAnalysisNo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const seq = String(history.length + 1).padStart(3, "0");
    return `CMK-${year}${month}${day}-${seq}`;
  };

  // Update measurement count
  const handleMeasurementQtyChange = (qty: string) => {
    const newQty = parseInt(qty) || 50;
    const clampedQty = Math.max(50, newQty);
    setCondition({ ...condition, measurementQty: String(clampedQty) });

    const currentValues = [...measurementData.values];
    if (clampedQty > currentValues.length) {
      const newValues = [...currentValues, ...Array(clampedQty - currentValues.length).fill("")];
      setMeasurementData({ values: newValues });
    } else {
      setMeasurementData({ values: currentValues.slice(0, clampedQty) });
    }
  };

  // Update single measurement value
  const handleMeasurementChange = (index: number, value: string) => {
    const newValues = [...measurementData.values];
    newValues[index] = value;
    setMeasurementData({ values: newValues });
  };

  // Calculate statistics
  const calculateResults = () => {
    const validValues = measurementData.values
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v));

    if (validValues.length < 50) {
      alert("최소 50개 이상의 측정값이 필요합니다.");
      return;
    }

    const usl = parseFloat(condition.usl);
    const lsl = parseFloat(condition.lsl);

    if (isNaN(usl) || isNaN(lsl)) {
      alert("USL과 LSL을 입력해주세요.");
      return;
    }

    // Calculate mean
    const mean = validValues.reduce((a, b) => a + b, 0) / validValues.length;

    // Calculate standard deviation (population)
    const squaredDiffs = validValues.map((v) => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / validValues.length;
    const stdDev = Math.sqrt(variance);

    // Calculate Cm and Cmk
    let cm: number | null = null;
    let cmk: number | null = null;

    if (stdDev > 0) {
      cm = (usl - lsl) / (6 * stdDev);
      const cmkUpper = (usl - mean) / (3 * stdDev);
      const cmkLower = (mean - lsl) / (3 * stdDev);
      cmk = Math.min(cmkUpper, cmkLower);
    }

    // Determine judgment
    let judgment = "";
    let judgmentColor = "";
    if (cmk !== null) {
      if (cmk >= 1.67) {
        judgment = "합격 (양호)";
        judgmentColor = "success";
      } else if (cmk >= 1.33) {
        judgment = "조건부합격 (관리필요)";
        judgmentColor = "warning";
      } else {
        judgment = "불합격 (개선필요)";
        judgmentColor = "destructive";
      }
    }

    setAnalysisResult({
      mean,
      stdDev,
      cm,
      cmk,
      judgment,
      judgmentColor,
    });

    setActiveTab("results");
  };

  // Save to history
  const saveToHistory = () => {
    if (!analysisResult.cmk) {
      alert("먼저 분석을 수행해주세요.");
      return;
    }

    const newRecord: CapabilityRecord = {
      id: Date.now(),
      condition: { ...condition, analysisNo: condition.analysisNo || generateAnalysisNo() },
      measurements: [...measurementData.values],
      result: { ...analysisResult },
      createdAt: new Date().toISOString(),
    };

    setHistory([newRecord, ...history]);

    // Reset form
    setCondition({
      analysisNo: "",
      analysisDate: new Date().toISOString().split("T")[0],
      equipmentName: "",
      managementNo: "",
      measurementItem: "",
      usl: "",
      lsl: "",
      target: "",
      measurementQty: "50",
      inspector: "",
    });
    setMeasurementData({ values: Array(50).fill("") });
    setAnalysisResult({
      mean: null,
      stdDev: null,
      cm: null,
      cmk: null,
      judgment: "",
      judgmentColor: "",
    });

    alert("분석 결과가 저장되었습니다.");
    setActiveTab("history");
  };

  // Delete from history
  const deleteFromHistory = (id: number) => {
    if (confirm("이 기록을 삭제하시겠습니까?")) {
      setHistory(history.filter((record) => record.id !== id));
    }
  };

  // Load from history
  const loadFromHistory = (record: CapabilityRecord) => {
    setCondition(record.condition);
    setMeasurementData({ values: record.measurements });
    setAnalysisResult(record.result);
    setActiveTab("setup");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비능력분석 (Cmk)</h1>
          <p className="text-muted-foreground">Machine Capability Index - 설비능력지수 분석</p>
        </div>
      </div>

      {/* Judgment Criteria Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">판정 기준 (Cmk)</p>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-green-600">{">= 1.67: 합격 (양호)"}</p>
              <p className="text-yellow-600">{"1.33 ~ 1.67: 조건부합격"}</p>
              <p className="text-red-600">{"< 1.33: 불합격 (개선필요)"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Cm 공식</p>
            <p className="text-lg font-mono mt-2">(USL-LSL) / 6σ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Cmk 공식</p>
            <p className="text-xs font-mono mt-2">min[(USL-X̄)/3σ, (X̄-LSL)/3σ]</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">필수 측정수량</p>
            <p className="text-2xl font-bold mt-2">최소 50개</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                분석 조건 설정
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                측정 데이터 입력
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                분석 결과
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                분석 이력
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            {/* Tab 1: Analysis Condition Setup */}
            <TabsContent value="setup">
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>분석번호</Label>
                      <Input
                        value={condition.analysisNo}
                        onChange={(e) => setCondition({ ...condition, analysisNo: e.target.value })}
                        placeholder={generateAnalysisNo()}
                      />
                      <p className="text-xs text-muted-foreground">비워두면 자동 생성</p>
                    </div>
                    <div className="space-y-2">
                      <Label>분석일 *</Label>
                      <Input
                        type="date"
                        value={condition.analysisDate}
                        onChange={(e) => setCondition({ ...condition, analysisDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>설비명 *</Label>
                      <Input
                        value={condition.equipmentName}
                        onChange={(e) => setCondition({ ...condition, equipmentName: e.target.value })}
                        placeholder="설비명"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>관리번호 *</Label>
                      <Input
                        value={condition.managementNo}
                        onChange={(e) => setCondition({ ...condition, managementNo: e.target.value })}
                        placeholder="EQ-001"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">분석 조건</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>측정항목 *</Label>
                      <Input
                        value={condition.measurementItem}
                        onChange={(e) => setCondition({ ...condition, measurementItem: e.target.value })}
                        placeholder="길이, 두께, 직경 등"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>측정수량 (최소 50개) *</Label>
                      <Input
                        type="number"
                        min="50"
                        value={condition.measurementQty}
                        onChange={(e) => handleMeasurementQtyChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>측정자 *</Label>
                      <Input
                        value={condition.inspector}
                        onChange={(e) => setCondition({ ...condition, inspector: e.target.value })}
                        placeholder="측정자명"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">규격 (Specification)</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>USL (상한규격) *</Label>
                      <Input
                        type="number"
                        step="any"
                        value={condition.usl}
                        onChange={(e) => setCondition({ ...condition, usl: e.target.value })}
                        placeholder="0.000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LSL (하한규격) *</Label>
                      <Input
                        type="number"
                        step="any"
                        value={condition.lsl}
                        onChange={(e) => setCondition({ ...condition, lsl: e.target.value })}
                        placeholder="0.000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target (목표값)</Label>
                      <Input
                        type="number"
                        step="any"
                        value={condition.target}
                        onChange={(e) => setCondition({ ...condition, target: e.target.value })}
                        placeholder="0.000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("data")}>
                    다음: 측정 데이터 입력
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Measurement Data Entry */}
            <TabsContent value="data">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">측정 데이터 입력</h3>
                    <p className="text-sm text-muted-foreground">
                      {condition.equipmentName && `설비: ${condition.equipmentName} | `}
                      {condition.measurementItem && `측정항목: ${condition.measurementItem} | `}
                      입력된 값: {measurementData.values.filter((v) => v !== "").length} / {condition.measurementQty}개
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("setup")}>
                      이전
                    </Button>
                    <Button onClick={calculateResults}>
                      <Calculator className="mr-2 h-4 w-4" />
                      분석 실행
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 max-h-[500px] overflow-y-auto">
                  <div className="grid gap-2 grid-cols-5 md:grid-cols-10">
                    {measurementData.values.map((value, index) => (
                      <div key={index} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">#{index + 1}</Label>
                        <Input
                          type="number"
                          step="any"
                          value={value}
                          onChange={(e) => handleMeasurementChange(index, e.target.value)}
                          placeholder="0.000"
                          className="text-sm h-8"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    유효한 측정값: {measurementData.values.filter((v) => v !== "" && !isNaN(parseFloat(v))).length}개
                    {measurementData.values.filter((v) => v !== "" && !isNaN(parseFloat(v))).length < 50 &&
                      <span className="text-red-500 ml-2">(최소 50개 필요)</span>
                    }
                  </p>
                  <Button onClick={calculateResults} size="lg">
                    <Calculator className="mr-2 h-4 w-4" />
                    분석 실행
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Analysis Results */}
            <TabsContent value="results">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">분석 결과</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActiveTab("data")}>
                      이전
                    </Button>
                    <Button onClick={saveToHistory} disabled={!analysisResult.cmk}>
                      <Save className="mr-2 h-4 w-4" />
                      결과 저장
                    </Button>
                  </div>
                </div>

                {analysisResult.cmk !== null ? (
                  <>
                    {/* Summary Info */}
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="grid gap-4 md:grid-cols-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">설비명:</span>{" "}
                            <span className="font-medium">{condition.equipmentName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">관리번호:</span>{" "}
                            <span className="font-medium">{condition.managementNo}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">측정항목:</span>{" "}
                            <span className="font-medium">{condition.measurementItem}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">측정자:</span>{" "}
                            <span className="font-medium">{condition.inspector}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Results Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">평균 (X-bar)</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {analysisResult.mean?.toFixed(4) ?? "-"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">표준편차 (σ)</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {analysisResult.stdDev?.toFixed(4) ?? "-"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Cm</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {analysisResult.cm?.toFixed(3) ?? "-"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className={
                        analysisResult.judgmentColor === "success" ? "border-green-500 bg-green-50 dark:bg-green-950" :
                        analysisResult.judgmentColor === "warning" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
                        "border-red-500 bg-red-50 dark:bg-red-950"
                      }>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Cmk</p>
                          <p className="text-2xl font-bold font-mono mt-2">
                            {analysisResult.cmk?.toFixed(3) ?? "-"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Judgment */}
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-lg text-muted-foreground mb-2">판정 결과</p>
                        <Badge
                          variant={analysisResult.judgmentColor as "success" | "warning" | "destructive" | "default"}
                          className="text-lg px-4 py-2"
                        >
                          {analysisResult.judgment}
                        </Badge>
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>USL: {condition.usl} | LSL: {condition.lsl} | Target: {condition.target || "-"}</p>
                          <p className="mt-1">
                            측정수량: {measurementData.values.filter((v) => v !== "" && !isNaN(parseFloat(v))).length}개
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Calculation Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">계산 상세</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 text-sm font-mono">
                          <div className="space-y-2">
                            <p className="text-muted-foreground">Cm = (USL - LSL) / (6 x σ)</p>
                            <p>Cm = ({condition.usl} - {condition.lsl}) / (6 x {analysisResult.stdDev?.toFixed(4)})</p>
                            <p className="font-bold">Cm = {analysisResult.cm?.toFixed(4)}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-muted-foreground">Cmk = min[(USL-X̄)/(3σ), (X̄-LSL)/(3σ)]</p>
                            <p>
                              = min[({condition.usl}-{analysisResult.mean?.toFixed(4)})/(3x{analysisResult.stdDev?.toFixed(4)}),
                              ({analysisResult.mean?.toFixed(4)}-{condition.lsl})/(3x{analysisResult.stdDev?.toFixed(4)})]
                            </p>
                            <p className="font-bold">Cmk = {analysisResult.cmk?.toFixed(4)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>아직 분석이 수행되지 않았습니다.</p>
                    <p className="text-sm mt-2">측정 데이터를 입력한 후 분석을 실행해주세요.</p>
                    <Button className="mt-4" onClick={() => setActiveTab("data")}>
                      데이터 입력하기
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab 4: History */}
            <TabsContent value="history">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5" />
                    분석 이력
                  </h3>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>저장된 분석 이력이 없습니다.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>분석번호</TableHead>
                        <TableHead>분석일</TableHead>
                        <TableHead>설비명</TableHead>
                        <TableHead>관리번호</TableHead>
                        <TableHead>측정항목</TableHead>
                        <TableHead className="text-right">Cm</TableHead>
                        <TableHead className="text-right">Cmk</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>측정자</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono">{record.condition.analysisNo}</TableCell>
                          <TableCell>{record.condition.analysisDate}</TableCell>
                          <TableCell>{record.condition.equipmentName}</TableCell>
                          <TableCell className="font-mono">{record.condition.managementNo}</TableCell>
                          <TableCell>{record.condition.measurementItem}</TableCell>
                          <TableCell className="text-right font-mono">{record.result.cm?.toFixed(3) ?? "-"}</TableCell>
                          <TableCell className="text-right font-mono font-bold">{record.result.cmk?.toFixed(3) ?? "-"}</TableCell>
                          <TableCell>
                            <Badge variant={record.result.judgmentColor as "success" | "warning" | "destructive" | "default"}>
                              {record.result.cmk !== null && record.result.cmk >= 1.67 ? "합격" :
                               record.result.cmk !== null && record.result.cmk >= 1.33 ? "조건부" : "불합격"}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.condition.inspector}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadFromHistory(record)}
                              >
                                불러오기
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteFromHistory(record.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
