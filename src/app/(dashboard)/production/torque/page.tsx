"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Save, Trash2, Wrench, ClipboardCheck, Settings, History, Calendar } from "lucide-react";

// Types
interface MonthlyTorqueCheck {
  id: number;
  checkYearMonth: string;
  process: string;
  line: string;
  fasteningPoint: string;
  standardTorque: string;
  measuredValue: string;
  result: string;
  inspector: string;
  checkDate: string;
}

interface TorqueWrench {
  id: number;
  equipmentNumber: string;
  name: string;
  range: string;
  calibrationCycle: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  status: string;
  calibrationHistory: string[];
}

interface FasteningPoint {
  id: number;
  partNumber: string;
  process: string;
  fasteningPointName: string;
  standardTorque: string;
  tolerance: string;
  unit: string;
}

interface InspectionHistory {
  id: number;
  checkYearMonth: string;
  process: string;
  line: string;
  totalChecks: number;
  passCount: number;
  failCount: number;
  failDetails: string;
}

export default function TorquePage() {
  const [activeTab, setActiveTab] = useState("monthly-check");

  // Monthly torque check state
  const [monthlyChecks, setMonthlyChecks] = useState<MonthlyTorqueCheck[]>([
    { id: 1, checkYearMonth: "2026-06", process: "조립공정", line: "A라인", fasteningPoint: "메인 볼트", standardTorque: "25", measuredValue: "24.5", result: "합격", inspector: "김철수", checkDate: "2026-06-05" },
    { id: 2, checkYearMonth: "2026-06", process: "조립공정", line: "A라인", fasteningPoint: "서브 볼트", standardTorque: "15", measuredValue: "15.2", result: "합격", inspector: "김철수", checkDate: "2026-06-05" },
    { id: 3, checkYearMonth: "2026-05", process: "조립공정", line: "B라인", fasteningPoint: "커버 체결", standardTorque: "10", measuredValue: "12.5", result: "불합격", inspector: "이영희", checkDate: "2026-05-15" },
  ]);

  const [newCheck, setNewCheck] = useState({
    checkYearMonth: new Date().toISOString().slice(0, 7),
    process: "",
    line: "",
    fasteningPoint: "",
    standardTorque: "",
    measuredValue: "",
    result: "",
    inspector: "",
    checkDate: new Date().toISOString().split("T")[0],
  });
  const [showCheckForm, setShowCheckForm] = useState(false);

  // Torque wrench state
  const [wrenches, setWrenches] = useState<TorqueWrench[]>([
    { id: 1, equipmentNumber: "TW-001", name: "디지털 토르크렌치 A", range: "5-50 N.m", calibrationCycle: "12", lastCalibrationDate: "2026-01-15", nextCalibrationDate: "2027-01-15", status: "정상", calibrationHistory: ["2025-01-10", "2024-01-08", "2023-01-12"] },
    { id: 2, equipmentNumber: "TW-002", name: "디지털 토르크렌치 B", range: "10-100 N.m", calibrationCycle: "12", lastCalibrationDate: "2025-12-20", nextCalibrationDate: "2026-12-20", status: "정상", calibrationHistory: ["2024-12-18", "2023-12-15"] },
    { id: 3, equipmentNumber: "TW-003", name: "클릭형 토르크렌치", range: "20-200 N.m", calibrationCycle: "6", lastCalibrationDate: "2026-03-01", nextCalibrationDate: "2026-09-01", status: "교정예정", calibrationHistory: ["2025-09-05", "2025-03-10", "2024-09-08"] },
  ]);

  const [newWrench, setNewWrench] = useState({
    equipmentNumber: "",
    name: "",
    range: "",
    calibrationCycle: "",
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    status: "정상",
  });
  const [showWrenchForm, setShowWrenchForm] = useState(false);

  // Fastening point state
  const [fasteningPoints, setFasteningPoints] = useState<FasteningPoint[]>([
    { id: 1, partNumber: "P-001", process: "조립공정", fasteningPointName: "메인 볼트", standardTorque: "25", tolerance: "2", unit: "N.m" },
    { id: 2, partNumber: "P-001", process: "조립공정", fasteningPointName: "서브 볼트", standardTorque: "15", tolerance: "1.5", unit: "N.m" },
    { id: 3, partNumber: "P-002", process: "조립공정", fasteningPointName: "커버 체결", standardTorque: "10", tolerance: "1", unit: "N.m" },
    { id: 4, partNumber: "P-003", process: "검사공정", fasteningPointName: "센서 고정", standardTorque: "5", tolerance: "0.5", unit: "N.m" },
  ]);

  const [newPoint, setNewPoint] = useState({
    partNumber: "",
    process: "",
    fasteningPointName: "",
    standardTorque: "",
    tolerance: "",
    unit: "N.m",
  });
  const [showPointForm, setShowPointForm] = useState(false);

  // Inspection history state (derived from monthly checks)
  const [inspectionHistory] = useState<InspectionHistory[]>([
    { id: 1, checkYearMonth: "2026-06", process: "조립공정", line: "A라인", totalChecks: 15, passCount: 15, failCount: 0, failDetails: "" },
    { id: 2, checkYearMonth: "2026-05", process: "조립공정", line: "A라인", totalChecks: 18, passCount: 17, failCount: 1, failDetails: "커버 체결 토르크 초과" },
    { id: 3, checkYearMonth: "2026-05", process: "조립공정", line: "B라인", totalChecks: 12, passCount: 11, failCount: 1, failDetails: "서브 볼트 토르크 미달" },
    { id: 4, checkYearMonth: "2026-04", process: "조립공정", line: "A라인", totalChecks: 20, passCount: 20, failCount: 0, failDetails: "" },
    { id: 5, checkYearMonth: "2026-04", process: "검사공정", line: "C라인", totalChecks: 8, passCount: 8, failCount: 0, failDetails: "" },
    { id: 6, checkYearMonth: "2026-03", process: "조립공정", line: "A라인", totalChecks: 16, passCount: 14, failCount: 2, failDetails: "메인 볼트 2건 토르크 미달" },
  ]);

  // Handlers for monthly check
  const handleAddCheck = () => {
    if (!newCheck.process || !newCheck.fasteningPoint || !newCheck.measuredValue) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    const check: MonthlyTorqueCheck = {
      id: Date.now(),
      ...newCheck,
    };
    setMonthlyChecks([check, ...monthlyChecks]);
    setNewCheck({
      checkYearMonth: new Date().toISOString().slice(0, 7),
      process: "",
      line: "",
      fasteningPoint: "",
      standardTorque: "",
      measuredValue: "",
      result: "",
      inspector: "",
      checkDate: new Date().toISOString().split("T")[0],
    });
    setShowCheckForm(false);
    alert("월간 토르크 점검이 등록되었습니다.");
  };

  const handleDeleteCheck = (id: number) => {
    setMonthlyChecks(monthlyChecks.filter((c) => c.id !== id));
  };

  // Handlers for torque wrench
  const handleAddWrench = () => {
    if (!newWrench.equipmentNumber || !newWrench.name) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    const wrench: TorqueWrench = {
      id: Date.now(),
      ...newWrench,
      calibrationHistory: newWrench.lastCalibrationDate ? [newWrench.lastCalibrationDate] : [],
    };
    setWrenches([wrench, ...wrenches]);
    setNewWrench({
      equipmentNumber: "",
      name: "",
      range: "",
      calibrationCycle: "",
      lastCalibrationDate: "",
      nextCalibrationDate: "",
      status: "정상",
    });
    setShowWrenchForm(false);
    alert("토르크렌치가 등록되었습니다.");
  };

  const handleDeleteWrench = (id: number) => {
    setWrenches(wrenches.filter((w) => w.id !== id));
  };

  // Handlers for fastening point
  const handleAddPoint = () => {
    if (!newPoint.partNumber || !newPoint.fasteningPointName || !newPoint.standardTorque) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    const point: FasteningPoint = {
      id: Date.now(),
      ...newPoint,
    };
    setFasteningPoints([point, ...fasteningPoints]);
    setNewPoint({
      partNumber: "",
      process: "",
      fasteningPointName: "",
      standardTorque: "",
      tolerance: "",
      unit: "N.m",
    });
    setShowPointForm(false);
    alert("체결부위가 등록되었습니다.");
  };

  const handleDeletePoint = (id: number) => {
    setFasteningPoints(fasteningPoints.filter((p) => p.id !== id));
  };

  // Helper functions
  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case "합격": return "default";
      case "불합격": return "destructive";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "정상": return "default";
      case "교정예정": return "secondary";
      case "교정필요": return "destructive";
      default: return "outline";
    }
  };

  const isCalibrationDueSoon = (nextDate: string) => {
    const next = new Date(nextDate);
    const now = new Date();
    const diffDays = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">토르크관리 (월간)</h1>
          <p className="text-muted-foreground">월간 토르크 점검 및 토르크렌치 관리</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monthly-check">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            월간 토르크 점검
          </TabsTrigger>
          <TabsTrigger value="wrench-management">
            <Wrench className="mr-2 h-4 w-4" />
            토르크렌치 관리
          </TabsTrigger>
          <TabsTrigger value="fastening-point">
            <Settings className="mr-2 h-4 w-4" />
            체결부위 등록
          </TabsTrigger>
          <TabsTrigger value="inspection-history">
            <History className="mr-2 h-4 w-4" />
            점검 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Monthly Torque Check */}
        <TabsContent value="monthly-check">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                월간 토르크 점검
              </CardTitle>
              <Button onClick={() => setShowCheckForm(!showCheckForm)}>
                <Plus className="mr-2 h-4 w-4" />
                점검 등록
              </Button>
            </CardHeader>
            <CardContent>
              {showCheckForm && (
                <Card className="mb-6 p-4 border-2 border-dashed">
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>점검년월 *</Label>
                        <Input
                          type="month"
                          value={newCheck.checkYearMonth}
                          onChange={(e) => setNewCheck({ ...newCheck, checkYearMonth: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>점검일자 *</Label>
                        <Input
                          type="date"
                          value={newCheck.checkDate}
                          onChange={(e) => setNewCheck({ ...newCheck, checkDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공정 *</Label>
                        <Select value={newCheck.process} onValueChange={(v) => setNewCheck({ ...newCheck, process: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="조립공정">조립공정</SelectItem>
                            <SelectItem value="검사공정">검사공정</SelectItem>
                            <SelectItem value="포장공정">포장공정</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>라인</Label>
                        <Select value={newCheck.line} onValueChange={(v) => setNewCheck({ ...newCheck, line: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A라인">A라인</SelectItem>
                            <SelectItem value="B라인">B라인</SelectItem>
                            <SelectItem value="C라인">C라인</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>체결부위 *</Label>
                        <Select value={newCheck.fasteningPoint} onValueChange={(v) => {
                          const point = fasteningPoints.find((p) => p.fasteningPointName === v);
                          setNewCheck({
                            ...newCheck,
                            fasteningPoint: v,
                            standardTorque: point?.standardTorque || "",
                          });
                        }}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            {fasteningPoints.map((point) => (
                              <SelectItem key={point.id} value={point.fasteningPointName}>
                                {point.fasteningPointName} ({point.standardTorque} N.m)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>규격 토르크 (N.m)</Label>
                        <Input
                          value={newCheck.standardTorque}
                          onChange={(e) => setNewCheck({ ...newCheck, standardTorque: e.target.value })}
                          placeholder="자동 입력"
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정값 (N.m) *</Label>
                        <Input
                          value={newCheck.measuredValue}
                          onChange={(e) => setNewCheck({ ...newCheck, measuredValue: e.target.value })}
                          placeholder="측정값 입력"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>판정 *</Label>
                        <Select value={newCheck.result} onValueChange={(v) => setNewCheck({ ...newCheck, result: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="합격">합격</SelectItem>
                            <SelectItem value="불합격">불합격</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>점검자</Label>
                        <Input
                          value={newCheck.inspector}
                          onChange={(e) => setNewCheck({ ...newCheck, inspector: e.target.value })}
                          placeholder="점검자명"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowCheckForm(false)}>취소</Button>
                      <Button onClick={handleAddCheck}><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </div>
                </Card>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>점검년월</TableHead>
                    <TableHead>점검일자</TableHead>
                    <TableHead>공정/라인</TableHead>
                    <TableHead>체결부위</TableHead>
                    <TableHead className="text-right">규격 토르크 (N.m)</TableHead>
                    <TableHead className="text-right">측정값 (N.m)</TableHead>
                    <TableHead>판정</TableHead>
                    <TableHead>점검자</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyChecks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        등록된 점검 기록이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    monthlyChecks.map((check) => (
                      <TableRow key={check.id} className={check.result === "불합격" ? "bg-red-50" : ""}>
                        <TableCell>{check.checkYearMonth}</TableCell>
                        <TableCell>{check.checkDate}</TableCell>
                        <TableCell>{check.process} / {check.line}</TableCell>
                        <TableCell>{check.fasteningPoint}</TableCell>
                        <TableCell className="text-right">{check.standardTorque}</TableCell>
                        <TableCell className="text-right">{check.measuredValue}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getResultBadgeVariant(check.result)}
                            className={check.result === "합격" ? "bg-green-100 text-green-800" : ""}
                          >
                            {check.result}
                          </Badge>
                        </TableCell>
                        <TableCell>{check.inspector}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCheck(check.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">점검 현황 요약</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 점검: </span>
                    <span className="font-medium">{monthlyChecks.length}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">합격: </span>
                    <span className="font-medium">{monthlyChecks.filter((c) => c.result === "합격").length}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">불합격: </span>
                    <span className="font-medium">{monthlyChecks.filter((c) => c.result === "불합격").length}건</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">합격률: </span>
                    <span className="font-medium">
                      {monthlyChecks.length > 0
                        ? Math.round((monthlyChecks.filter((c) => c.result === "합격").length / monthlyChecks.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Torque Wrench Management */}
        <TabsContent value="wrench-management">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                토르크렌치 관리
              </CardTitle>
              <Button onClick={() => setShowWrenchForm(!showWrenchForm)}>
                <Plus className="mr-2 h-4 w-4" />
                장비 등록
              </Button>
            </CardHeader>
            <CardContent>
              {showWrenchForm && (
                <Card className="mb-6 p-4 border-2 border-dashed">
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>장비번호 *</Label>
                        <Input
                          value={newWrench.equipmentNumber}
                          onChange={(e) => setNewWrench({ ...newWrench, equipmentNumber: e.target.value })}
                          placeholder="TW-004"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>장비명 *</Label>
                        <Input
                          value={newWrench.name}
                          onChange={(e) => setNewWrench({ ...newWrench, name: e.target.value })}
                          placeholder="토르크렌치 명칭"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정범위</Label>
                        <Input
                          value={newWrench.range}
                          onChange={(e) => setNewWrench({ ...newWrench, range: e.target.value })}
                          placeholder="5-50 N.m"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검교정 주기 (개월)</Label>
                        <Select value={newWrench.calibrationCycle} onValueChange={(v) => setNewWrench({ ...newWrench, calibrationCycle: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6개월</SelectItem>
                            <SelectItem value="12">12개월</SelectItem>
                            <SelectItem value="24">24개월</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>최근 검교정일</Label>
                        <Input
                          type="date"
                          value={newWrench.lastCalibrationDate}
                          onChange={(e) => setNewWrench({ ...newWrench, lastCalibrationDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>다음 검교정일</Label>
                        <Input
                          type="date"
                          value={newWrench.nextCalibrationDate}
                          onChange={(e) => setNewWrench({ ...newWrench, nextCalibrationDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>상태</Label>
                        <Select value={newWrench.status} onValueChange={(v) => setNewWrench({ ...newWrench, status: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="정상">정상</SelectItem>
                            <SelectItem value="교정예정">교정예정</SelectItem>
                            <SelectItem value="교정필요">교정필요</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowWrenchForm(false)}>취소</Button>
                      <Button onClick={handleAddWrench}><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </div>
                </Card>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>장비번호</TableHead>
                    <TableHead>장비명</TableHead>
                    <TableHead>측정범위</TableHead>
                    <TableHead>검교정 주기</TableHead>
                    <TableHead>최근 검교정일</TableHead>
                    <TableHead>다음 검교정일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>검교정 이력</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wrenches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        등록된 토르크렌치가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    wrenches.map((wrench) => (
                      <TableRow key={wrench.id} className={isCalibrationDueSoon(wrench.nextCalibrationDate) ? "bg-yellow-50" : ""}>
                        <TableCell className="font-mono">{wrench.equipmentNumber}</TableCell>
                        <TableCell>{wrench.name}</TableCell>
                        <TableCell>{wrench.range}</TableCell>
                        <TableCell>{wrench.calibrationCycle}개월</TableCell>
                        <TableCell>{wrench.lastCalibrationDate}</TableCell>
                        <TableCell className={isCalibrationDueSoon(wrench.nextCalibrationDate) ? "text-orange-600 font-semibold" : ""}>
                          {wrench.nextCalibrationDate}
                          {isCalibrationDueSoon(wrench.nextCalibrationDate) && (
                            <Calendar className="inline ml-1 h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(wrench.status)}
                            className={
                              wrench.status === "정상" ? "bg-green-100 text-green-800" :
                              wrench.status === "교정예정" ? "bg-yellow-100 text-yellow-800" : ""
                            }
                          >
                            {wrench.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {wrench.calibrationHistory.length}회
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteWrench(wrench.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">장비 현황</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 장비: </span>
                    <span className="font-medium">{wrenches.length}대</span>
                  </div>
                  <div>
                    <span className="text-green-600">정상: </span>
                    <span className="font-medium">{wrenches.filter((w) => w.status === "정상").length}대</span>
                  </div>
                  <div>
                    <span className="text-yellow-600">교정예정: </span>
                    <span className="font-medium">{wrenches.filter((w) => w.status === "교정예정").length}대</span>
                  </div>
                  <div>
                    <span className="text-red-600">교정필요: </span>
                    <span className="font-medium">{wrenches.filter((w) => w.status === "교정필요").length}대</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Fastening Point Registration */}
        <TabsContent value="fastening-point">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                체결부위 등록
              </CardTitle>
              <Button onClick={() => setShowPointForm(!showPointForm)}>
                <Plus className="mr-2 h-4 w-4" />
                체결부위 추가
              </Button>
            </CardHeader>
            <CardContent>
              {showPointForm && (
                <Card className="mb-6 p-4 border-2 border-dashed">
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={newPoint.partNumber}
                          onChange={(e) => setNewPoint({ ...newPoint, partNumber: e.target.value })}
                          placeholder="P-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공정</Label>
                        <Select value={newPoint.process} onValueChange={(v) => setNewPoint({ ...newPoint, process: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="조립공정">조립공정</SelectItem>
                            <SelectItem value="검사공정">검사공정</SelectItem>
                            <SelectItem value="포장공정">포장공정</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>체결부위명 *</Label>
                        <Input
                          value={newPoint.fasteningPointName}
                          onChange={(e) => setNewPoint({ ...newPoint, fasteningPointName: e.target.value })}
                          placeholder="메인 볼트"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>규격 토르크 *</Label>
                        <Input
                          value={newPoint.standardTorque}
                          onChange={(e) => setNewPoint({ ...newPoint, standardTorque: e.target.value })}
                          placeholder="25"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>허용공차</Label>
                        <Input
                          value={newPoint.tolerance}
                          onChange={(e) => setNewPoint({ ...newPoint, tolerance: e.target.value })}
                          placeholder="2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>단위</Label>
                        <Select value={newPoint.unit} onValueChange={(v) => setNewPoint({ ...newPoint, unit: v })}>
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="N.m">N.m</SelectItem>
                            <SelectItem value="kgf.cm">kgf.cm</SelectItem>
                            <SelectItem value="lbf.ft">lbf.ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowPointForm(false)}>취소</Button>
                      <Button onClick={handleAddPoint}><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </div>
                </Card>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>품번</TableHead>
                    <TableHead>공정</TableHead>
                    <TableHead>체결부위명</TableHead>
                    <TableHead className="text-right">규격 토르크</TableHead>
                    <TableHead className="text-right">허용공차</TableHead>
                    <TableHead>단위</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fasteningPoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        등록된 체결부위가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    fasteningPoints.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-mono">{point.partNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{point.process}</Badge>
                        </TableCell>
                        <TableCell>{point.fasteningPointName}</TableCell>
                        <TableCell className="text-right">{point.standardTorque}</TableCell>
                        <TableCell className="text-right">{point.tolerance ? `+/- ${point.tolerance}` : "-"}</TableCell>
                        <TableCell>{point.unit}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePoint(point.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">체결부위 현황</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 체결부위: </span>
                    <span className="font-medium">{fasteningPoints.length}개</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">품번 수: </span>
                    <span className="font-medium">{new Set(fasteningPoints.map((p) => p.partNumber)).size}개</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">공정 수: </span>
                    <span className="font-medium">{new Set(fasteningPoints.map((p) => p.process)).size}개</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Inspection History */}
        <TabsContent value="inspection-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                점검 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>점검년월</TableHead>
                    <TableHead>공정</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead className="text-right">총 점검</TableHead>
                    <TableHead className="text-right">합격</TableHead>
                    <TableHead className="text-right">불합격</TableHead>
                    <TableHead className="text-right">합격률</TableHead>
                    <TableHead>불합격 내역</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspectionHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        점검 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspectionHistory.map((history) => (
                      <TableRow key={history.id} className={history.failCount > 0 ? "bg-red-50" : ""}>
                        <TableCell className="font-mono">{history.checkYearMonth}</TableCell>
                        <TableCell>{history.process}</TableCell>
                        <TableCell>{history.line}</TableCell>
                        <TableCell className="text-right">{history.totalChecks}</TableCell>
                        <TableCell className="text-right text-green-600">{history.passCount}</TableCell>
                        <TableCell className="text-right">
                          {history.failCount > 0 ? (
                            <span className="text-red-600 font-semibold">{history.failCount}</span>
                          ) : (
                            <span>0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={history.failCount > 0 ? "text-orange-600" : "text-green-600"}>
                            {Math.round((history.passCount / history.totalChecks) * 100)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          {history.failDetails ? (
                            <span className="text-red-600 text-sm">{history.failDetails}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">이력 요약 (최근 6개월)</h4>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 점검: </span>
                    <span className="font-medium">{inspectionHistory.reduce((sum, h) => sum + h.totalChecks, 0)}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">합격: </span>
                    <span className="font-medium">{inspectionHistory.reduce((sum, h) => sum + h.passCount, 0)}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">불합격: </span>
                    <span className="font-medium">{inspectionHistory.reduce((sum, h) => sum + h.failCount, 0)}건</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">전체 합격률: </span>
                    <span className="font-medium">
                      {Math.round(
                        (inspectionHistory.reduce((sum, h) => sum + h.passCount, 0) /
                          inspectionHistory.reduce((sum, h) => sum + h.totalChecks, 0)) * 100
                      )}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">불합격 월: </span>
                    <span className="font-medium text-orange-600">
                      {inspectionHistory.filter((h) => h.failCount > 0).length}개월
                    </span>
                  </div>
                </div>
              </div>

              {/* Fail history highlight */}
              {inspectionHistory.filter((h) => h.failCount > 0).length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold mb-2 text-red-800">불합격 이력</h4>
                  <div className="space-y-2">
                    {inspectionHistory.filter((h) => h.failCount > 0).map((h) => (
                      <div key={h.id} className="text-sm">
                        <span className="font-mono text-red-700">{h.checkYearMonth}</span>
                        <span className="mx-2">|</span>
                        <span>{h.process} / {h.line}</span>
                        <span className="mx-2">|</span>
                        <span className="text-red-600">{h.failDetails}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
