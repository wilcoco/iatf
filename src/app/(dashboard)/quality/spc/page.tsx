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
import { BarChart3, Plus, Trash2, Calculator, Settings } from "lucide-react";

// Control chart constants (for X-bar R chart with n=5)
const A2 = 0.577; // For n=5
const D3 = 0; // For n=5
const D4 = 2.114; // For n=5
const d2 = 2.326; // For n=5

interface ControlItemSetup {
  processName: string;
  controlItem: string;
  unit: string;
  usl: number | null;
  lsl: number | null;
  target: number | null;
}

interface SubgroupData {
  id: number;
  date: string;
  time: string;
  measurements: [number, number, number, number, number];
  xBar: number;
  range: number;
}

interface ControlLimits {
  xBarUCL: number;
  xBarCL: number;
  xBarLCL: number;
  rUCL: number;
  rCL: number;
  rLCL: number;
}

export default function SPCControlChartPage() {
  const [activeTab, setActiveTab] = useState("setup");

  // Tab 1: Control item setup
  const [setup, setSetup] = useState<ControlItemSetup>({
    processName: "",
    controlItem: "",
    unit: "",
    usl: null,
    lsl: null,
    target: null,
  });

  // Tab 2: Subgroup data
  const [subgroups, setSubgroups] = useState<SubgroupData[]>([]);
  const [newMeasurements, setNewMeasurements] = useState<string[]>(["", "", "", "", ""]);
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTime, setNewTime] = useState(
    new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
  );

  // Calculate X-bar and R for measurements
  const calculateStats = (measurements: number[]): { xBar: number; range: number } => {
    const validMeasurements = measurements.filter((m) => !isNaN(m));
    if (validMeasurements.length === 0) return { xBar: 0, range: 0 };
    const xBar = validMeasurements.reduce((a, b) => a + b, 0) / validMeasurements.length;
    const range = Math.max(...validMeasurements) - Math.min(...validMeasurements);
    return { xBar, range };
  };

  // Calculate control limits
  const calculateControlLimits = (): ControlLimits | null => {
    if (subgroups.length < 2) return null;

    const xBarSum = subgroups.reduce((sum, sg) => sum + sg.xBar, 0);
    const rSum = subgroups.reduce((sum, sg) => sum + sg.range, 0);
    const xBarBar = xBarSum / subgroups.length;
    const rBar = rSum / subgroups.length;

    return {
      xBarUCL: xBarBar + A2 * rBar,
      xBarCL: xBarBar,
      xBarLCL: xBarBar - A2 * rBar,
      rUCL: D4 * rBar,
      rCL: rBar,
      rLCL: D3 * rBar,
    };
  };

  // Calculate process capability
  const calculateCapability = (): { cp: number; cpk: number; sigma: number } | null => {
    if (!setup.usl || !setup.lsl || subgroups.length < 2) return null;

    const limits = calculateControlLimits();
    if (!limits) return null;

    const sigma = limits.rCL / d2;
    if (sigma === 0) return null;

    const cp = (setup.usl - setup.lsl) / (6 * sigma);
    const cpu = (setup.usl - limits.xBarCL) / (3 * sigma);
    const cpl = (limits.xBarCL - setup.lsl) / (3 * sigma);
    const cpk = Math.min(cpu, cpl);
    const sigmaLevel = Math.min(cpu, cpl) * 3;

    return { cp, cpk, sigma: sigmaLevel };
  };

  const handleAddSubgroup = () => {
    const measurements = newMeasurements.map((m) => parseFloat(m));
    if (measurements.some(isNaN)) {
      alert("모든 측정값을 입력해주세요.");
      return;
    }

    const { xBar, range } = calculateStats(measurements);
    const newSubgroup: SubgroupData = {
      id: Date.now(),
      date: newDate,
      time: newTime,
      measurements: measurements as [number, number, number, number, number],
      xBar,
      range,
    };

    setSubgroups([...subgroups, newSubgroup]);
    setNewMeasurements(["", "", "", "", ""]);
    setNewTime(
      new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
    );
  };

  const handleDeleteSubgroup = (id: number) => {
    setSubgroups(subgroups.filter((sg) => sg.id !== id));
  };

  const limits = calculateControlLimits();
  const capability = calculateCapability();

  const getXBarStatus = (xBar: number): "normal" | "warning" | "out" => {
    if (!limits) return "normal";
    if (xBar > limits.xBarUCL || xBar < limits.xBarLCL) return "out";
    const warningUpper = limits.xBarCL + (2 / 3) * (limits.xBarUCL - limits.xBarCL);
    const warningLower = limits.xBarCL - (2 / 3) * (limits.xBarCL - limits.xBarLCL);
    if (xBar > warningUpper || xBar < warningLower) return "warning";
    return "normal";
  };

  const getRangeStatus = (range: number): "normal" | "warning" | "out" => {
    if (!limits) return "normal";
    if (range > limits.rUCL || range < limits.rLCL) return "out";
    const warningUpper = limits.rCL + (2 / 3) * (limits.rUCL - limits.rCL);
    if (range > warningUpper) return "warning";
    return "normal";
  };

  const getStatusBadge = (status: "normal" | "warning" | "out") => {
    switch (status) {
      case "out":
        return <Badge variant="error">이탈</Badge>;
      case "warning":
        return <Badge variant="warning">경고</Badge>;
      default:
        return <Badge variant="success">정상</Badge>;
    }
  };

  const getCpkBadge = (cpk: number) => {
    if (cpk >= 1.67) return <Badge variant="success">우수 (Cpk &ge; 1.67)</Badge>;
    if (cpk >= 1.33) return <Badge variant="success">양호 (Cpk &ge; 1.33)</Badge>;
    if (cpk >= 1.0) return <Badge variant="warning">허용 (Cpk &ge; 1.0)</Badge>;
    return <Badge variant="error">불량 (Cpk &lt; 1.0)</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          SPC 관리도
        </h1>
        <p className="text-muted-foreground">통계적 공정 관리 - X-bar R 관리도</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">관리항목 설정</TabsTrigger>
          <TabsTrigger value="data">데이터 입력</TabsTrigger>
          <TabsTrigger value="chart">관리도 현황</TabsTrigger>
          <TabsTrigger value="capability">공정능력 분석</TabsTrigger>
        </TabsList>

        {/* Tab 1: Control Item Setup */}
        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                관리항목 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="processName">공정명</Label>
                  <Input
                    id="processName"
                    placeholder="예: 사출공정"
                    value={setup.processName}
                    onChange={(e) => setSetup({ ...setup, processName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="controlItem">관리항목</Label>
                  <Input
                    id="controlItem"
                    placeholder="예: 외경 치수"
                    value={setup.controlItem}
                    onChange={(e) => setSetup({ ...setup, controlItem: e.target.value })}
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
                  <Label htmlFor="target">목표값 (Target)</Label>
                  <Input
                    id="target"
                    type="number"
                    step="0.001"
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
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">규격 한계 (Specification Limits)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="usl">상한규격 (USL)</Label>
                    <Input
                      id="usl"
                      type="number"
                      step="0.001"
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
                  <div className="space-y-2">
                    <Label htmlFor="lsl">하한규격 (LSL)</Label>
                    <Input
                      id="lsl"
                      type="number"
                      step="0.001"
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
                </div>
              </div>

              {setup.usl && setup.lsl && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">규격 요약</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">LSL</p>
                      <p className="font-mono text-lg">
                        {setup.lsl.toFixed(3)} {setup.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p className="font-mono text-lg">
                        {setup.target?.toFixed(3) ?? "-"} {setup.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">USL</p>
                      <p className="font-mono text-lg">
                        {setup.usl.toFixed(3)} {setup.unit}
                      </p>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    규격 범위: {(setup.usl - setup.lsl).toFixed(3)} {setup.unit}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Entry */}
        <TabsContent value="data">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  서브그룹 데이터 입력 (n=5)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">시간</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>측정값 (5개 샘플)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {newMeasurements.map((m, i) => (
                      <Input
                        key={i}
                        type="number"
                        step="0.001"
                        placeholder={`X${i + 1}`}
                        value={m}
                        onChange={(e) => {
                          const updated = [...newMeasurements];
                          updated[i] = e.target.value;
                          setNewMeasurements(updated);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {newMeasurements.every((m) => m !== "") && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">X-bar (평균)</p>
                        <p className="font-mono text-lg font-semibold">
                          {calculateStats(newMeasurements.map((m) => parseFloat(m))).xBar.toFixed(
                            4
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">R (범위)</p>
                        <p className="font-mono text-lg font-semibold">
                          {calculateStats(newMeasurements.map((m) => parseFloat(m))).range.toFixed(
                            4
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleAddSubgroup} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  서브그룹 추가
                </Button>
              </CardContent>
            </Card>

            {subgroups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>입력된 데이터 ({subgroups.length}개 서브그룹)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>날짜</TableHead>
                        <TableHead>시간</TableHead>
                        <TableHead>X1</TableHead>
                        <TableHead>X2</TableHead>
                        <TableHead>X3</TableHead>
                        <TableHead>X4</TableHead>
                        <TableHead>X5</TableHead>
                        <TableHead>X-bar</TableHead>
                        <TableHead>R</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subgroups.map((sg, index) => (
                        <TableRow key={sg.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{sg.date}</TableCell>
                          <TableCell>{sg.time}</TableCell>
                          {sg.measurements.map((m, i) => (
                            <TableCell key={i} className="font-mono">
                              {m.toFixed(3)}
                            </TableCell>
                          ))}
                          <TableCell className="font-mono font-semibold">
                            {sg.xBar.toFixed(4)}
                          </TableCell>
                          <TableCell className="font-mono font-semibold">
                            {sg.range.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSubgroup(sg.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Control Chart Display */}
        <TabsContent value="chart">
          <div className="space-y-6">
            {limits && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>X-bar 관리한계</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          UCL (상부관리한계)
                        </span>
                        <span className="font-mono font-semibold text-red-600">
                          {limits.xBarUCL.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">CL (중심선)</span>
                        <span className="font-mono font-semibold text-green-600">
                          {limits.xBarCL.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          LCL (하부관리한계)
                        </span>
                        <span className="font-mono font-semibold text-red-600">
                          {limits.xBarLCL.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>R 관리한계</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          UCL (상부관리한계)
                        </span>
                        <span className="font-mono font-semibold text-red-600">
                          {limits.rUCL.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">CL (중심선)</span>
                        <span className="font-mono font-semibold text-green-600">
                          {limits.rCL.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          LCL (하부관리한계)
                        </span>
                        <span className="font-mono font-semibold text-red-600">
                          {limits.rLCL.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>관리도 데이터 현황</CardTitle>
              </CardHeader>
              <CardContent>
                {subgroups.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    데이터를 입력해주세요.
                  </p>
                ) : subgroups.length < 2 ? (
                  <p className="text-center text-muted-foreground py-8">
                    관리한계 계산을 위해 최소 2개 이상의 서브그룹이 필요합니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>날짜</TableHead>
                        <TableHead>시간</TableHead>
                        <TableHead className="text-center">X-bar</TableHead>
                        <TableHead className="text-center">X-bar 상태</TableHead>
                        <TableHead className="text-center">R</TableHead>
                        <TableHead className="text-center">R 상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subgroups.map((sg, index) => (
                        <TableRow key={sg.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{sg.date}</TableCell>
                          <TableCell>{sg.time}</TableCell>
                          <TableCell className="text-center font-mono">
                            {sg.xBar.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(getXBarStatus(sg.xBar))}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {sg.range.toFixed(4)}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(getRangeStatus(sg.range))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {limits && (
              <Card>
                <CardHeader>
                  <CardTitle>관리도 시각화</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* X-bar Chart Visual */}
                    <div>
                      <h4 className="font-medium mb-4">X-bar 관리도</h4>
                      <div className="relative h-48 border rounded-lg p-4">
                        {/* UCL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                          style={{ top: "10%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-red-500">
                            UCL: {limits.xBarUCL.toFixed(3)}
                          </span>
                        </div>
                        {/* CL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-green-500"
                          style={{ top: "50%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-green-500">
                            CL: {limits.xBarCL.toFixed(3)}
                          </span>
                        </div>
                        {/* LCL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                          style={{ top: "90%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-red-500">
                            LCL: {limits.xBarLCL.toFixed(3)}
                          </span>
                        </div>
                        {/* Data Points */}
                        <div className="absolute inset-0 flex items-center px-8">
                          {subgroups.map((sg, i) => {
                            const range = limits.xBarUCL - limits.xBarLCL;
                            const normalizedPosition =
                              ((limits.xBarUCL - sg.xBar) / range) * 80 + 10;
                            const clampedPosition = Math.max(5, Math.min(95, normalizedPosition));
                            const status = getXBarStatus(sg.xBar);
                            const color =
                              status === "out"
                                ? "bg-red-500"
                                : status === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500";
                            return (
                              <div
                                key={sg.id}
                                className="relative flex-1 flex justify-center"
                              >
                                <div
                                  className={`absolute w-3 h-3 rounded-full ${color}`}
                                  style={{ top: `${clampedPosition}%` }}
                                  title={`#${i + 1}: ${sg.xBar.toFixed(4)}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* R Chart Visual */}
                    <div>
                      <h4 className="font-medium mb-4">R 관리도</h4>
                      <div className="relative h-48 border rounded-lg p-4">
                        {/* UCL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                          style={{ top: "10%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-red-500">
                            UCL: {limits.rUCL.toFixed(3)}
                          </span>
                        </div>
                        {/* CL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-green-500"
                          style={{ top: "50%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-green-500">
                            CL: {limits.rCL.toFixed(3)}
                          </span>
                        </div>
                        {/* LCL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                          style={{ top: "90%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-red-500">
                            LCL: {limits.rLCL.toFixed(3)}
                          </span>
                        </div>
                        {/* Data Points */}
                        <div className="absolute inset-0 flex items-center px-8">
                          {subgroups.map((sg, i) => {
                            const range =
                              limits.rUCL - limits.rLCL || limits.rUCL || 1;
                            const normalizedPosition =
                              ((limits.rUCL - sg.range) / range) * 80 + 10;
                            const clampedPosition = Math.max(5, Math.min(95, normalizedPosition));
                            const status = getRangeStatus(sg.range);
                            const color =
                              status === "out"
                                ? "bg-red-500"
                                : status === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500";
                            return (
                              <div
                                key={sg.id}
                                className="relative flex-1 flex justify-center"
                              >
                                <div
                                  className={`absolute w-3 h-3 rounded-full ${color}`}
                                  style={{ top: `${clampedPosition}%` }}
                                  title={`#${i + 1}: ${sg.range.toFixed(4)}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Process Capability */}
        <TabsContent value="capability">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  공정능력 분석 (Process Capability)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!setup.usl || !setup.lsl ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      공정능력 계산을 위해 먼저 관리항목 설정에서 USL과 LSL을 입력해주세요.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("setup")}
                    >
                      관리항목 설정으로 이동
                    </Button>
                  </div>
                ) : subgroups.length < 2 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      공정능력 계산을 위해 최소 2개 이상의 서브그룹 데이터가 필요합니다.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("data")}
                    >
                      데이터 입력으로 이동
                    </Button>
                  </div>
                ) : capability && limits ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-4">규격 정보</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">USL (상한규격)</span>
                            <span className="font-mono">{setup.usl?.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LSL (하한규격)</span>
                            <span className="font-mono">{setup.lsl?.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">규격 폭</span>
                            <span className="font-mono">
                              {((setup.usl ?? 0) - (setup.lsl ?? 0)).toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-4">공정 통계</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">X-bar-bar (전체평균)</span>
                            <span className="font-mono">{limits.xBarCL.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">R-bar (평균범위)</span>
                            <span className="font-mono">{limits.rCL.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              추정 표준편차 (sigma)
                            </span>
                            <span className="font-mono">
                              {(limits.rCL / d2).toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">공정능력 지수</h4>
                      <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Cp (잠재능력)</p>
                            <p className="text-3xl font-bold font-mono mt-2">
                              {capability.cp.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              (USL - LSL) / 6sigma
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Cpk (실제능력)</p>
                            <p className="text-3xl font-bold font-mono mt-2">
                              {capability.cpk.toFixed(2)}
                            </p>
                            <div className="mt-2">{getCpkBadge(capability.cpk)}</div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">시그마 수준</p>
                            <p className="text-3xl font-bold font-mono mt-2">
                              {capability.sigma.toFixed(2)} sigma
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              3 x min(Cpu, Cpl)
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">공정능력 해석</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cpk 범위</TableHead>
                              <TableHead>등급</TableHead>
                              <TableHead>해석</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow
                              className={capability.cpk >= 1.67 ? "bg-green-50" : ""}
                            >
                              <TableCell>Cpk &ge; 1.67</TableCell>
                              <TableCell>
                                <Badge variant="success">우수</Badge>
                              </TableCell>
                              <TableCell>6시그마 수준, 공정 능력 우수</TableCell>
                            </TableRow>
                            <TableRow
                              className={
                                capability.cpk >= 1.33 && capability.cpk < 1.67
                                  ? "bg-green-50"
                                  : ""
                              }
                            >
                              <TableCell>1.33 &le; Cpk &lt; 1.67</TableCell>
                              <TableCell>
                                <Badge variant="success">양호</Badge>
                              </TableCell>
                              <TableCell>공정 능력 양호, 유지관리 필요</TableCell>
                            </TableRow>
                            <TableRow
                              className={
                                capability.cpk >= 1.0 && capability.cpk < 1.33
                                  ? "bg-yellow-50"
                                  : ""
                              }
                            >
                              <TableCell>1.00 &le; Cpk &lt; 1.33</TableCell>
                              <TableCell>
                                <Badge variant="warning">허용</Badge>
                              </TableCell>
                              <TableCell>공정 개선 권장</TableCell>
                            </TableRow>
                            <TableRow
                              className={capability.cpk < 1.0 ? "bg-red-50" : ""}
                            >
                              <TableCell>Cpk &lt; 1.00</TableCell>
                              <TableCell>
                                <Badge variant="error">불량</Badge>
                              </TableCell>
                              <TableCell>공정 능력 부족, 즉시 개선 필요</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    계산 중 오류가 발생했습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
