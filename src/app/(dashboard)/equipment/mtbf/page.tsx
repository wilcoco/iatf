"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, Trash2, TrendingUp, TrendingDown, Calculator, Settings, ClipboardList, Building2 } from "lucide-react";

// Types
interface FailureRecord {
  id: number;
  occurrenceDateTime: string;
  recoveryDateTime: string;
  failureType: "mechanical" | "electrical" | "control" | "other";
  failureDescription: string;
  repairDescription: string;
  downtimeMinutes: number;
}

interface AnalysisCondition {
  startDate: string;
  endDate: string;
  equipmentName: string;
  managementNo: string;
  targetMtbf: number;
}

interface EquipmentSummary {
  equipmentName: string;
  managementNo: string;
  totalOperatingTime: number;
  failureCount: number;
  totalRepairTime: number;
  mtbf: number;
  mttr: number;
  availability: number;
  targetMtbf: number;
  achievementRate: number;
}

const FAILURE_TYPE_LABELS: Record<string, string> = {
  mechanical: "기계",
  electrical: "전기",
  control: "제어",
  other: "기타",
};

const FAILURE_TYPE_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error"> = {
  mechanical: "destructive",
  electrical: "warning",
  control: "secondary",
  other: "outline",
};

export default function MtbfAnalysisPage() {
  const [activeTab, setActiveTab] = useState("conditions");

  // Analysis conditions state
  const [conditions, setConditions] = useState<AnalysisCondition>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    equipmentName: "",
    managementNo: "",
    targetMtbf: 720,
  });

  // Failure history state
  const [failureRecords, setFailureRecords] = useState<FailureRecord[]>([]);
  const [newFailure, setNewFailure] = useState<Omit<FailureRecord, "id" | "downtimeMinutes">>({
    occurrenceDateTime: "",
    recoveryDateTime: "",
    failureType: "mechanical",
    failureDescription: "",
    repairDescription: "",
  });

  // Equipment list for comparison (sample data)
  const [equipmentList] = useState<EquipmentSummary[]>([
    {
      equipmentName: "CNC 선반 #1",
      managementNo: "EQ-CNC-001",
      totalOperatingTime: 720,
      failureCount: 3,
      totalRepairTime: 12,
      mtbf: 240,
      mttr: 4,
      availability: 98.3,
      targetMtbf: 200,
      achievementRate: 120,
    },
    {
      equipmentName: "프레스 기계 #2",
      managementNo: "EQ-PRS-002",
      totalOperatingTime: 720,
      failureCount: 5,
      totalRepairTime: 25,
      mtbf: 144,
      mttr: 5,
      availability: 96.5,
      targetMtbf: 200,
      achievementRate: 72,
    },
    {
      equipmentName: "용접 로봇 #3",
      managementNo: "EQ-WLD-003",
      totalOperatingTime: 720,
      failureCount: 1,
      totalRepairTime: 3,
      mtbf: 720,
      mttr: 3,
      availability: 99.6,
      targetMtbf: 500,
      achievementRate: 144,
    },
  ]);

  // Calculate downtime in minutes between two datetimes
  const calculateDowntimeMinutes = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return Math.max(0, Math.round((endTime - startTime) / (1000 * 60)));
  };

  // Add new failure record
  const handleAddFailure = () => {
    if (!newFailure.occurrenceDateTime || !newFailure.recoveryDateTime) {
      alert("발생일시와 복구일시를 입력해주세요.");
      return;
    }

    const downtimeMinutes = calculateDowntimeMinutes(
      newFailure.occurrenceDateTime,
      newFailure.recoveryDateTime
    );

    const record: FailureRecord = {
      id: Date.now(),
      ...newFailure,
      downtimeMinutes,
    };

    setFailureRecords([...failureRecords, record]);
    setNewFailure({
      occurrenceDateTime: "",
      recoveryDateTime: "",
      failureType: "mechanical",
      failureDescription: "",
      repairDescription: "",
    });
  };

  // Delete failure record
  const handleDeleteFailure = (id: number) => {
    setFailureRecords(failureRecords.filter((r) => r.id !== id));
  };

  // Calculate MTBF/MTTR metrics
  const analysisResults = useMemo(() => {
    const failureCount = failureRecords.length;
    const totalRepairMinutes = failureRecords.reduce((sum, r) => sum + r.downtimeMinutes, 0);
    const totalRepairHours = totalRepairMinutes / 60;

    // Calculate total operating time based on analysis period (in hours)
    const startDate = new Date(conditions.startDate);
    const endDate = new Date(conditions.endDate);
    const periodDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalOperatingHours = periodDays * 24; // Assuming 24-hour operation

    const mtbf = failureCount > 0 ? (totalOperatingHours - totalRepairHours) / failureCount : totalOperatingHours;
    const mttr = failureCount > 0 ? totalRepairHours / failureCount : 0;
    const availability = totalOperatingHours > 0 ? (mtbf / (mtbf + mttr)) * 100 : 100;
    const achievementRate = conditions.targetMtbf > 0 ? (mtbf / conditions.targetMtbf) * 100 : 0;

    return {
      totalOperatingHours,
      failureCount,
      totalRepairHours,
      mtbf,
      mttr,
      availability,
      achievementRate,
    };
  }, [failureRecords, conditions]);

  // Failure type statistics
  const failureTypeStats = useMemo(() => {
    const stats: Record<string, number> = {
      mechanical: 0,
      electrical: 0,
      control: 0,
      other: 0,
    };
    failureRecords.forEach((r) => {
      stats[r.failureType]++;
    });
    return stats;
  }, [failureRecords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MTBF 분석</h1>
          <p className="text-muted-foreground">설비 신뢰성 분석 및 고장 이력 관리</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTBF</p>
                <p className="text-2xl font-bold">{analysisResults.mtbf.toFixed(1)} 시간</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">평균고장간격</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MTTR</p>
                <p className="text-2xl font-bold">{analysisResults.mttr.toFixed(1)} 시간</p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">평균수리시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">가용률</p>
                <p className="text-2xl font-bold">{analysisResults.availability.toFixed(2)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">MTBF / (MTBF + MTTR)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">목표 달성률</p>
                <p className={`text-2xl font-bold ${analysisResults.achievementRate >= 100 ? "text-green-600" : "text-red-600"}`}>
                  {analysisResults.achievementRate.toFixed(1)}%
                </p>
              </div>
              <Calculator className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">목표 MTBF: {conditions.targetMtbf}h</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            분석 조건
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            고장 이력 입력
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            MTBF/MTTR 분석
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            설비별 현황
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Analysis Conditions */}
        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle>분석 조건 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>분석기간 시작일 *</Label>
                  <Input
                    type="date"
                    value={conditions.startDate}
                    onChange={(e) => setConditions({ ...conditions, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>분석기간 종료일 *</Label>
                  <Input
                    type="date"
                    value={conditions.endDate}
                    onChange={(e) => setConditions({ ...conditions, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>설비명 *</Label>
                  <Input
                    value={conditions.equipmentName}
                    onChange={(e) => setConditions({ ...conditions, equipmentName: e.target.value })}
                    placeholder="예: CNC 선반 #1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>관리번호 *</Label>
                  <Input
                    value={conditions.managementNo}
                    onChange={(e) => setConditions({ ...conditions, managementNo: e.target.value })}
                    placeholder="예: EQ-CNC-001"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>목표 MTBF (시간)</Label>
                  <Input
                    type="number"
                    value={conditions.targetMtbf}
                    onChange={(e) => setConditions({ ...conditions, targetMtbf: Number(e.target.value) })}
                    placeholder="720"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">분석 개요</h3>
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">분석기간</p>
                    <p className="font-medium">{conditions.startDate} ~ {conditions.endDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">설비</p>
                    <p className="font-medium">{conditions.equipmentName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">관리번호</p>
                    <p className="font-medium font-mono">{conditions.managementNo || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Failure History Entry */}
        <TabsContent value="history">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>고장 이력 입력</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>발생일시 *</Label>
                    <Input
                      type="datetime-local"
                      value={newFailure.occurrenceDateTime}
                      onChange={(e) => setNewFailure({ ...newFailure, occurrenceDateTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>복구일시 *</Label>
                    <Input
                      type="datetime-local"
                      value={newFailure.recoveryDateTime}
                      onChange={(e) => setNewFailure({ ...newFailure, recoveryDateTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>고장유형 *</Label>
                    <Select
                      value={newFailure.failureType}
                      onValueChange={(value) => setNewFailure({ ...newFailure, failureType: value as FailureRecord["failureType"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mechanical">기계</SelectItem>
                        <SelectItem value="electrical">전기</SelectItem>
                        <SelectItem value="control">제어</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>정지시간 (계산값)</Label>
                    <Input
                      type="text"
                      value={
                        newFailure.occurrenceDateTime && newFailure.recoveryDateTime
                          ? `${calculateDowntimeMinutes(newFailure.occurrenceDateTime, newFailure.recoveryDateTime)} 분`
                          : "-"
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>고장내용</Label>
                  <Textarea
                    value={newFailure.failureDescription}
                    onChange={(e) => setNewFailure({ ...newFailure, failureDescription: e.target.value })}
                    placeholder="고장 발생 상황 및 증상을 기술하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>수리내용</Label>
                  <Textarea
                    value={newFailure.repairDescription}
                    onChange={(e) => setNewFailure({ ...newFailure, repairDescription: e.target.value })}
                    placeholder="수리 조치 내용을 기술하세요"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddFailure}>
                    <Plus className="mr-2 h-4 w-4" />
                    고장 이력 추가
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  등록된 고장 이력 ({failureRecords.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {failureRecords.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 고장 이력이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>발생일시</TableHead>
                        <TableHead>복구일시</TableHead>
                        <TableHead>고장유형</TableHead>
                        <TableHead>고장내용</TableHead>
                        <TableHead>수리내용</TableHead>
                        <TableHead className="text-right">정지시간</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {failureRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm">
                            {new Date(record.occurrenceDateTime).toLocaleString("ko-KR")}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {new Date(record.recoveryDateTime).toLocaleString("ko-KR")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={FAILURE_TYPE_COLORS[record.failureType]}>
                              {FAILURE_TYPE_LABELS[record.failureType]}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={record.failureDescription}>
                            {record.failureDescription || "-"}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={record.repairDescription}>
                            {record.repairDescription || "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {record.downtimeMinutes} 분
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFailure(record.id)}
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
          </div>
        </TabsContent>

        {/* Tab 3: MTBF/MTTR Analysis */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>MTBF/MTTR 계산 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Calculation Inputs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">계산 기초 데이터</h3>
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">총 가동시간</span>
                        <span className="font-mono font-semibold">{analysisResults.totalOperatingHours.toFixed(1)} 시간</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">고장횟수</span>
                        <span className="font-mono font-semibold">{analysisResults.failureCount} 회</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">총 수리시간</span>
                        <span className="font-mono font-semibold">{analysisResults.totalRepairHours.toFixed(2)} 시간</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Results */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">계산 결과</h3>
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-muted-foreground">MTBF</span>
                          <p className="text-xs text-muted-foreground">= 총가동시간 / 고장횟수</p>
                        </div>
                        <span className="font-mono font-bold text-xl text-green-600">{analysisResults.mtbf.toFixed(1)} h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-muted-foreground">MTTR</span>
                          <p className="text-xs text-muted-foreground">= 총수리시간 / 고장횟수</p>
                        </div>
                        <span className="font-mono font-bold text-xl text-blue-600">{analysisResults.mttr.toFixed(2)} h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-muted-foreground">가용률</span>
                          <p className="text-xs text-muted-foreground">= MTBF / (MTBF + MTTR)</p>
                        </div>
                        <span className="font-mono font-bold text-xl">{analysisResults.availability.toFixed(2)} %</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>목표 대비 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">목표 MTBF</p>
                    <p className="text-3xl font-bold">{conditions.targetMtbf} 시간</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">실적 MTBF</p>
                    <p className="text-3xl font-bold">{analysisResults.mtbf.toFixed(1)} 시간</p>
                  </div>
                  <div className={`p-4 border rounded-lg text-center ${analysisResults.achievementRate >= 100 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <p className="text-sm text-muted-foreground mb-2">달성률</p>
                    <p className={`text-3xl font-bold ${analysisResults.achievementRate >= 100 ? "text-green-600" : "text-red-600"}`}>
                      {analysisResults.achievementRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Failure Type Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>고장 유형별 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {Object.entries(FAILURE_TYPE_LABELS).map(([key, label]) => (
                    <div key={key} className="p-4 border rounded-lg text-center">
                      <Badge variant={FAILURE_TYPE_COLORS[key]} className="mb-2">
                        {label}
                      </Badge>
                      <p className="text-2xl font-bold">{failureTypeStats[key]} 건</p>
                      <p className="text-xs text-muted-foreground">
                        {analysisResults.failureCount > 0
                          ? `${((failureTypeStats[key] / analysisResults.failureCount) * 100).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Equipment Comparison */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                설비별 MTBF/MTTR 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설비명</TableHead>
                    <TableHead>관리번호</TableHead>
                    <TableHead className="text-right">가동시간 (h)</TableHead>
                    <TableHead className="text-right">고장횟수</TableHead>
                    <TableHead className="text-right">MTBF (h)</TableHead>
                    <TableHead className="text-right">MTTR (h)</TableHead>
                    <TableHead className="text-right">가용률 (%)</TableHead>
                    <TableHead className="text-right">목표 MTBF</TableHead>
                    <TableHead className="text-right">달성률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((eq, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{eq.equipmentName}</TableCell>
                      <TableCell className="font-mono text-sm">{eq.managementNo}</TableCell>
                      <TableCell className="text-right">{eq.totalOperatingTime}</TableCell>
                      <TableCell className="text-right">{eq.failureCount}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-green-600">
                        {eq.mtbf.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-blue-600">
                        {eq.mttr.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">{eq.availability.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{eq.targetMtbf}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={eq.achievementRate >= 100 ? "success" : "error"}>
                          {eq.achievementRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary Statistics */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">전체 설비 요약</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">평균 MTBF</p>
                    <p className="text-xl font-bold">
                      {(equipmentList.reduce((sum, eq) => sum + eq.mtbf, 0) / equipmentList.length).toFixed(1)} h
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 MTTR</p>
                    <p className="text-xl font-bold">
                      {(equipmentList.reduce((sum, eq) => sum + eq.mttr, 0) / equipmentList.length).toFixed(1)} h
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 가용률</p>
                    <p className="text-xl font-bold">
                      {(equipmentList.reduce((sum, eq) => sum + eq.availability, 0) / equipmentList.length).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">목표 달성 설비</p>
                    <p className="text-xl font-bold">
                      {equipmentList.filter((eq) => eq.achievementRate >= 100).length} / {equipmentList.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
