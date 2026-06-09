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
import { Plus, Trash2, Calculator, Settings, ClipboardList, Building2, FileText } from "lucide-react";

// Types based on Excel format (별지 제2호 서식)
interface FailureRecord {
  id: number;
  no: number;
  failureDateTime: string; // 고장일시
  failureDescription: string; // 고장수기내용
  repairDescription: string; // 수리내용
  downtimeMinutes: number; // 정지시간 (min)
  manpower: number; // 공수 (인)
  laborMinutes: number; // 공수 (인 x 분) = 정지시간 x 인원
}

interface EquipmentInfo {
  processName: string; // 공정
  equipmentName: string; // 설비명
  managementNo: string; // 관리번호
  installDate: string; // 설치일자
}

interface AnalysisCondition {
  analysisMonth: string; // 분석월 (  월)
  analysisPeriodStart: string; // 분석기간 시작
  analysisPeriodEnd: string; // 분석기간 종료
  loadTimeMinutes: number; // 부하시간 (min) - 총투입공수
  actualOperatingTimeMinutes: number; // 실가동시간 (min) = 부하시간 - 비가동시간
}

interface EquipmentSummary {
  equipmentName: string;
  managementNo: string;
  processName: string;
  loadTimeMinutes: number;
  actualOperatingTimeMinutes: number;
  failureCount: number;
  totalDowntimeMinutes: number;
  totalLaborMinutes: number;
  mtbf: number;
  mttr: number;
  failureFrequencyRate: number; // 고장도수율
  failureIntensityRate: number; // 고장강도율
  availability: number;
}

export default function MtbfMttrAnalysisPage() {
  const [activeTab, setActiveTab] = useState("equipment");

  // Equipment info state
  const [equipmentInfo, setEquipmentInfo] = useState<EquipmentInfo>({
    processName: "",
    equipmentName: "",
    managementNo: "",
    installDate: "",
  });

  // Analysis conditions state
  const [conditions, setConditions] = useState<AnalysisCondition>({
    analysisMonth: new Date().toISOString().slice(0, 7),
    analysisPeriodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    analysisPeriodEnd: new Date().toISOString().slice(0, 10),
    loadTimeMinutes: 0,
    actualOperatingTimeMinutes: 0,
  });

  // Failure history state (고장이력)
  const [failureRecords, setFailureRecords] = useState<FailureRecord[]>([]);
  const [newFailure, setNewFailure] = useState<Omit<FailureRecord, "id" | "no" | "laborMinutes">>({
    failureDateTime: "",
    failureDescription: "",
    repairDescription: "",
    downtimeMinutes: 0,
    manpower: 2, // default 2 as seen in Excel
  });

  // Equipment list for comparison (sample data)
  const [equipmentList] = useState<EquipmentSummary[]>([
    {
      equipmentName: "CNC 선반 #1",
      managementNo: "EQ-CNC-001",
      processName: "가공",
      loadTimeMinutes: 43200,
      actualOperatingTimeMinutes: 42000,
      failureCount: 3,
      totalDowntimeMinutes: 180,
      totalLaborMinutes: 360,
      mtbf: 14000,
      mttr: 60,
      failureFrequencyRate: 0.071,
      failureIntensityRate: 0.43,
      availability: 99.57,
    },
    {
      equipmentName: "프레스 기계 #2",
      managementNo: "EQ-PRS-002",
      processName: "성형",
      loadTimeMinutes: 43200,
      actualOperatingTimeMinutes: 40500,
      failureCount: 5,
      totalDowntimeMinutes: 300,
      totalLaborMinutes: 600,
      mtbf: 8100,
      mttr: 60,
      failureFrequencyRate: 0.123,
      failureIntensityRate: 0.74,
      availability: 99.26,
    },
    {
      equipmentName: "용접 로봇 #3",
      managementNo: "EQ-WLD-003",
      processName: "용접",
      loadTimeMinutes: 43200,
      actualOperatingTimeMinutes: 42800,
      failureCount: 1,
      totalDowntimeMinutes: 45,
      totalLaborMinutes: 90,
      mtbf: 42800,
      mttr: 45,
      failureFrequencyRate: 0.023,
      failureIntensityRate: 0.11,
      availability: 99.90,
    },
  ]);

  // Add new failure record
  const handleAddFailure = () => {
    if (!newFailure.failureDateTime) {
      alert("고장일시를 입력해주세요.");
      return;
    }
    if (newFailure.downtimeMinutes <= 0) {
      alert("정지시간을 입력해주세요.");
      return;
    }

    const laborMinutes = newFailure.downtimeMinutes * newFailure.manpower;
    const nextNo = failureRecords.length > 0 ? Math.max(...failureRecords.map(r => r.no)) + 1 : 1;

    const record: FailureRecord = {
      id: Date.now(),
      no: nextNo,
      ...newFailure,
      laborMinutes,
    };

    setFailureRecords([...failureRecords, record]);
    setNewFailure({
      failureDateTime: "",
      failureDescription: "",
      repairDescription: "",
      downtimeMinutes: 0,
      manpower: 2,
    });
  };

  // Delete failure record
  const handleDeleteFailure = (id: number) => {
    const updated = failureRecords.filter((r) => r.id !== id);
    // Renumber the records
    const renumbered = updated.map((r, idx) => ({ ...r, no: idx + 1 }));
    setFailureRecords(renumbered);
  };

  // Calculate MTBF/MTTR metrics based on Excel formulas
  const analysisResults = useMemo(() => {
    const failureCount = failureRecords.length;
    const totalDowntimeMinutes = failureRecords.reduce((sum, r) => sum + r.downtimeMinutes, 0);
    const totalLaborMinutes = failureRecords.reduce((sum, r) => sum + r.laborMinutes, 0);

    // Use manual input for load time and actual operating time
    const loadTime = conditions.loadTimeMinutes || 0;
    const actualOperatingTime = conditions.actualOperatingTimeMinutes || (loadTime - totalDowntimeMinutes);

    // MTBF = 실가동시간 / 고장횟수 (in minutes)
    const mtbf = failureCount > 0 ? actualOperatingTime / failureCount : actualOperatingTime;

    // MTTR = 총정지시간 / 고장횟수 (in minutes)
    const mttr = failureCount > 0 ? totalDowntimeMinutes / failureCount : 0;

    // 고장도수율 = 고장횟수 / 부하시간 * 100
    const failureFrequencyRate = loadTime > 0 ? (failureCount / loadTime) * 100 : 0;

    // 고장강도율 = 총정지시간 / 부하시간 * 100
    const failureIntensityRate = loadTime > 0 ? (totalDowntimeMinutes / loadTime) * 100 : 0;

    // 가용률 = MTBF / (MTBF + MTTR) * 100
    const availability = (mtbf + mttr) > 0 ? (mtbf / (mtbf + mttr)) * 100 : 100;

    return {
      failureCount,
      totalDowntimeMinutes,
      totalLaborMinutes,
      loadTime,
      actualOperatingTime,
      mtbf,
      mttr,
      failureFrequencyRate,
      failureIntensityRate,
      availability,
    };
  }, [failureRecords, conditions]);

  // Format minutes to hours and minutes display
  const formatMinutes = (minutes: number): string => {
    if (minutes === 0) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} h`;
    return `${hours} h ${mins} min`;
  };

  return (
    <div className="space-y-6">
      {/* Header with form title */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">(별지 제2호 서식)</p>
          <h1 className="text-3xl font-bold">설비 MTBF/MTTR 분석표</h1>
          <p className="text-muted-foreground">설비 신뢰성 분석 및 고장 이력 관리</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {conditions.analysisMonth ? `${new Date(conditions.analysisMonth).getMonth() + 1}월` : "-월"} 분석
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">MTBF (평균고장간격)</p>
            <p className="text-2xl font-bold text-green-600">{formatMinutes(Math.round(analysisResults.mtbf))}</p>
            <p className="text-xs text-muted-foreground mt-1">= 실가동시간 / 고장횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">MTTR (평균수리시간)</p>
            <p className="text-2xl font-bold text-blue-600">{formatMinutes(Math.round(analysisResults.mttr))}</p>
            <p className="text-xs text-muted-foreground mt-1">= 총정지시간 / 고장횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">고장도수율</p>
            <p className="text-2xl font-bold">{analysisResults.failureFrequencyRate.toFixed(4)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= 고장횟수 / 부하시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">고장강도율</p>
            <p className="text-2xl font-bold">{analysisResults.failureIntensityRate.toFixed(4)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= 정지시간 / 부하시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">가용률</p>
            <p className="text-2xl font-bold">{analysisResults.availability.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">= MTBF / (MTBF + MTTR)</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            설비 선택 및 분석조건
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            고장 이력 입력
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            MTBF/MTTR 분석결과
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            설비별 비교
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Equipment Selection & Analysis Conditions */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                설비 선택 및 분석조건 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Equipment Info Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">설비 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>공정 *</Label>
                    <Input
                      value={equipmentInfo.processName}
                      onChange={(e) => setEquipmentInfo({ ...equipmentInfo, processName: e.target.value })}
                      placeholder="예: 가공, 조립, 검사"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설비명 *</Label>
                    <Input
                      value={equipmentInfo.equipmentName}
                      onChange={(e) => setEquipmentInfo({ ...equipmentInfo, equipmentName: e.target.value })}
                      placeholder="예: CNC 선반 #1"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>관리번호</Label>
                    <Input
                      value={equipmentInfo.managementNo}
                      onChange={(e) => setEquipmentInfo({ ...equipmentInfo, managementNo: e.target.value })}
                      placeholder="예: EQ-CNC-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>설치일자</Label>
                    <Input
                      type="date"
                      value={equipmentInfo.installDate}
                      onChange={(e) => setEquipmentInfo({ ...equipmentInfo, installDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Period Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">분석 기간</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>분석월</Label>
                    <Input
                      type="month"
                      value={conditions.analysisMonth}
                      onChange={(e) => setConditions({ ...conditions, analysisMonth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>분석기간 시작일</Label>
                    <Input
                      type="date"
                      value={conditions.analysisPeriodStart}
                      onChange={(e) => setConditions({ ...conditions, analysisPeriodStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>분석기간 종료일</Label>
                    <Input
                      type="date"
                      value={conditions.analysisPeriodEnd}
                      onChange={(e) => setConditions({ ...conditions, analysisPeriodEnd: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Operating Time Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="font-semibold">가동상황</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>부하시간 (min) *</Label>
                    <Input
                      type="number"
                      value={conditions.loadTimeMinutes || ""}
                      onChange={(e) => setConditions({ ...conditions, loadTimeMinutes: Number(e.target.value) })}
                      placeholder="총투입공수 (분)"
                    />
                    <p className="text-xs text-muted-foreground">* 부하시간 = 총투입공수</p>
                  </div>
                  <div className="space-y-2">
                    <Label>실가동시간 (min)</Label>
                    <Input
                      type="number"
                      value={conditions.actualOperatingTimeMinutes || ""}
                      onChange={(e) => setConditions({ ...conditions, actualOperatingTimeMinutes: Number(e.target.value) })}
                      placeholder="자동계산: 부하시간 - 정지시간"
                    />
                    <p className="text-xs text-muted-foreground">* 실가동시간 = 총투입공수 - 비가동시간</p>
                  </div>
                </div>
                {conditions.loadTimeMinutes > 0 && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">부하시간:</span>
                        <span className="font-mono ml-2">{conditions.loadTimeMinutes.toLocaleString()} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">총정지시간:</span>
                        <span className="font-mono ml-2">{analysisResults.totalDowntimeMinutes.toLocaleString()} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">실가동시간:</span>
                        <span className="font-mono ml-2">{analysisResults.actualOperatingTime.toLocaleString()} min</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">설정 요약</h3>
                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">공정</p>
                    <p className="font-medium">{equipmentInfo.processName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">설비명</p>
                    <p className="font-medium">{equipmentInfo.equipmentName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">분석기간</p>
                    <p className="font-medium">{conditions.analysisPeriodStart} ~ {conditions.analysisPeriodEnd}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">등록된 고장건수</p>
                    <p className="font-medium">{failureRecords.length}건</p>
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
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>고장일시 *</Label>
                    <Input
                      type="datetime-local"
                      value={newFailure.failureDateTime}
                      onChange={(e) => setNewFailure({ ...newFailure, failureDateTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>정지시간 (min) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={newFailure.downtimeMinutes || ""}
                      onChange={(e) => setNewFailure({ ...newFailure, downtimeMinutes: Number(e.target.value) })}
                      placeholder="분 단위 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>투입인원 (인)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newFailure.manpower}
                      onChange={(e) => setNewFailure({ ...newFailure, manpower: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>고장수기내용 (고장내용)</Label>
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
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    공수 (인 x 분) = {newFailure.downtimeMinutes} x {newFailure.manpower} = <span className="font-mono font-semibold">{newFailure.downtimeMinutes * newFailure.manpower} min</span>
                  </div>
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
                  설비고장내역 ({failureRecords.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {failureRecords.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 고장 이력이 없습니다.</p>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">NO</TableHead>
                          <TableHead>고장일시</TableHead>
                          <TableHead>고장수기내용</TableHead>
                          <TableHead>수리내용</TableHead>
                          <TableHead className="text-right">정지시간 (min)</TableHead>
                          <TableHead className="text-right">공수 (인 x 분)</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {failureRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono">{record.no}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {new Date(record.failureDateTime).toLocaleString("ko-KR")}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={record.failureDescription}>
                              {record.failureDescription || "-"}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={record.repairDescription}>
                              {record.repairDescription || "-"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {record.downtimeMinutes}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {record.laborMinutes}
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
                        {/* Total Row */}
                        <TableRow className="bg-muted/50 font-semibold">
                          <TableCell colSpan={4} className="text-right">합 계</TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResults.totalDowntimeMinutes}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {analysisResults.totalLaborMinutes}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: MTBF/MTTR Analysis Results */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Operating Status */}
            <Card>
              <CardHeader>
                <CardTitle>가동상황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">* 부하시간 = 총투입공수</p>
                    <div className="flex justify-between items-center mt-2">
                      <span>합 계:</span>
                      <span className="font-mono font-bold text-xl">{conditions.loadTimeMinutes.toLocaleString()} min</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">* 실가동시간 = 총투입공수 - 비가동시간</p>
                    <div className="flex justify-between items-center mt-2">
                      <span>합 계:</span>
                      <span className="font-mono font-bold text-xl">{analysisResults.actualOperatingTime.toLocaleString()} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Section */}
            <Card>
              <CardHeader>
                <CardTitle>* 계산</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* MTBF */}
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">MTBF =</p>
                        <p className="text-sm text-muted-foreground mt-1">실가동시간 / 고장횟수</p>
                        <p className="text-sm font-mono mt-2">
                          = {analysisResults.actualOperatingTime.toLocaleString()} / {analysisResults.failureCount || 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">{analysisResults.mtbf.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">min</p>
                        <p className="text-lg font-semibold mt-1">({formatMinutes(Math.round(analysisResults.mtbf))})</p>
                      </div>
                    </div>
                  </div>

                  {/* MTTR */}
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">MTTR =</p>
                        <p className="text-sm text-muted-foreground mt-1">총정지시간 / 고장횟수</p>
                        <p className="text-sm font-mono mt-2">
                          = {analysisResults.totalDowntimeMinutes} / {analysisResults.failureCount || 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{analysisResults.mttr.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">min</p>
                        <p className="text-lg font-semibold mt-1">({formatMinutes(Math.round(analysisResults.mttr))})</p>
                      </div>
                    </div>
                  </div>

                  {/* Failure Frequency Rate */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">고장도수율 =</p>
                        <p className="text-sm text-muted-foreground mt-1">고장횟수 / 부하시간 x 100</p>
                        <p className="text-sm font-mono mt-2">
                          = {analysisResults.failureCount} / {conditions.loadTimeMinutes.toLocaleString()} x 100
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{analysisResults.failureFrequencyRate.toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">%</p>
                      </div>
                    </div>
                  </div>

                  {/* Failure Intensity Rate */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">고장강도율 =</p>
                        <p className="text-sm text-muted-foreground mt-1">총정지시간 / 부하시간 x 100</p>
                        <p className="text-sm font-mono mt-2">
                          = {analysisResults.totalDowntimeMinutes} / {conditions.loadTimeMinutes.toLocaleString()} x 100
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{analysisResults.failureIntensityRate.toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">%</p>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">가용률 =</p>
                        <p className="text-sm text-muted-foreground mt-1">MTBF / (MTBF + MTTR) x 100</p>
                        <p className="text-sm font-mono mt-2">
                          = {analysisResults.mtbf.toFixed(1)} / ({analysisResults.mtbf.toFixed(1)} + {analysisResults.mttr.toFixed(1)}) x 100
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{analysisResults.availability.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>분석 결과 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>항목</TableHead>
                      <TableHead>산출식</TableHead>
                      <TableHead className="text-right">결과값</TableHead>
                      <TableHead className="text-right">단위</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">부하시간</TableCell>
                      <TableCell className="text-muted-foreground">총투입공수</TableCell>
                      <TableCell className="text-right font-mono">{conditions.loadTimeMinutes.toLocaleString()}</TableCell>
                      <TableCell className="text-right">min</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">실가동시간</TableCell>
                      <TableCell className="text-muted-foreground">부하시간 - 비가동시간</TableCell>
                      <TableCell className="text-right font-mono">{analysisResults.actualOperatingTime.toLocaleString()}</TableCell>
                      <TableCell className="text-right">min</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">고장횟수</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                      <TableCell className="text-right font-mono">{analysisResults.failureCount}</TableCell>
                      <TableCell className="text-right">회</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">총정지시간</TableCell>
                      <TableCell className="text-muted-foreground">SUM(정지시간)</TableCell>
                      <TableCell className="text-right font-mono">{analysisResults.totalDowntimeMinutes}</TableCell>
                      <TableCell className="text-right">min</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">총공수</TableCell>
                      <TableCell className="text-muted-foreground">SUM(공수)</TableCell>
                      <TableCell className="text-right font-mono">{analysisResults.totalLaborMinutes}</TableCell>
                      <TableCell className="text-right">인 x 분</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-50 dark:bg-green-950/20">
                      <TableCell className="font-semibold">MTBF</TableCell>
                      <TableCell className="text-muted-foreground">실가동시간 / 고장횟수</TableCell>
                      <TableCell className="text-right font-mono font-bold text-green-600">{analysisResults.mtbf.toFixed(1)}</TableCell>
                      <TableCell className="text-right">min</TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                      <TableCell className="font-semibold">MTTR</TableCell>
                      <TableCell className="text-muted-foreground">총정지시간 / 고장횟수</TableCell>
                      <TableCell className="text-right font-mono font-bold text-blue-600">{analysisResults.mttr.toFixed(1)}</TableCell>
                      <TableCell className="text-right">min</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">고장도수율</TableCell>
                      <TableCell className="text-muted-foreground">고장횟수 / 부하시간 x 100</TableCell>
                      <TableCell className="text-right font-mono font-bold">{analysisResults.failureFrequencyRate.toFixed(4)}</TableCell>
                      <TableCell className="text-right">%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">고장강도율</TableCell>
                      <TableCell className="text-muted-foreground">총정지시간 / 부하시간 x 100</TableCell>
                      <TableCell className="text-right font-mono font-bold">{analysisResults.failureIntensityRate.toFixed(4)}</TableCell>
                      <TableCell className="text-right">%</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-semibold">가용률</TableCell>
                      <TableCell className="text-muted-foreground">MTBF / (MTBF + MTTR) x 100</TableCell>
                      <TableCell className="text-right font-mono font-bold">{analysisResults.availability.toFixed(2)}</TableCell>
                      <TableCell className="text-right">%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
                설비별 MTBF/MTTR 비교
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>공정</TableHead>
                    <TableHead>설비명</TableHead>
                    <TableHead>관리번호</TableHead>
                    <TableHead className="text-right">부하시간 (min)</TableHead>
                    <TableHead className="text-right">실가동시간 (min)</TableHead>
                    <TableHead className="text-right">고장횟수</TableHead>
                    <TableHead className="text-right">MTBF (min)</TableHead>
                    <TableHead className="text-right">MTTR (min)</TableHead>
                    <TableHead className="text-right">고장도수율 (%)</TableHead>
                    <TableHead className="text-right">고장강도율 (%)</TableHead>
                    <TableHead className="text-right">가용률 (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((eq, index) => (
                    <TableRow key={index}>
                      <TableCell>{eq.processName}</TableCell>
                      <TableCell className="font-medium">{eq.equipmentName}</TableCell>
                      <TableCell className="font-mono text-sm">{eq.managementNo}</TableCell>
                      <TableCell className="text-right font-mono">{eq.loadTimeMinutes.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{eq.actualOperatingTimeMinutes.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{eq.failureCount}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-green-600">
                        {eq.mtbf.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-blue-600">
                        {eq.mttr}
                      </TableCell>
                      <TableCell className="text-right font-mono">{eq.failureFrequencyRate.toFixed(3)}</TableCell>
                      <TableCell className="text-right font-mono">{eq.failureIntensityRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={eq.availability >= 99 ? "success" : eq.availability >= 95 ? "warning" : "error"}>
                          {eq.availability.toFixed(2)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Comparison Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">전체 설비 요약 통계</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  <div>
                    <p className="text-sm text-muted-foreground">평균 MTBF</p>
                    <p className="text-xl font-bold text-green-600">
                      {Math.round(equipmentList.reduce((sum, eq) => sum + eq.mtbf, 0) / equipmentList.length).toLocaleString()} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 MTTR</p>
                    <p className="text-xl font-bold text-blue-600">
                      {Math.round(equipmentList.reduce((sum, eq) => sum + eq.mttr, 0) / equipmentList.length)} min
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 고장도수율</p>
                    <p className="text-xl font-bold">
                      {(equipmentList.reduce((sum, eq) => sum + eq.failureFrequencyRate, 0) / equipmentList.length).toFixed(3)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 고장강도율</p>
                    <p className="text-xl font-bold">
                      {(equipmentList.reduce((sum, eq) => sum + eq.failureIntensityRate, 0) / equipmentList.length).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 가용률</p>
                    <p className="text-xl font-bold">
                      {(equipmentList.reduce((sum, eq) => sum + eq.availability, 0) / equipmentList.length).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Best/Worst Performers */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">최고 MTBF 설비</h4>
                  {(() => {
                    const best = equipmentList.reduce((prev, curr) => curr.mtbf > prev.mtbf ? curr : prev);
                    return (
                      <div>
                        <p className="font-medium">{best.equipmentName}</p>
                        <p className="text-sm text-muted-foreground">{best.managementNo}</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{best.mtbf.toLocaleString()} min</p>
                      </div>
                    );
                  })()}
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">개선필요 설비 (최저 MTBF)</h4>
                  {(() => {
                    const worst = equipmentList.reduce((prev, curr) => curr.mtbf < prev.mtbf ? curr : prev);
                    return (
                      <div>
                        <p className="font-medium">{worst.equipmentName}</p>
                        <p className="text-sm text-muted-foreground">{worst.managementNo}</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{worst.mtbf.toLocaleString()} min</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
