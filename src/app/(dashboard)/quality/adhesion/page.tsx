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
import { Layers, Plus, Save, Search, Settings, History, BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";

// Types
interface AdhesionTest {
  id: number;
  testDate: string;
  testTime: string;
  partNo: string;
  partName: string;
  lotNo: string;
  specimens: SpecimenResult[];
  testMethod: string;
  passCriteria: string;
  result: string;
  tester: string;
  remarks: string;
}

interface SpecimenResult {
  specimenNo: number;
  grade: string;
}

interface TestCondition {
  id: number;
  tapeType: string;
  cuttingInterval: string;
  testTemperature: string;
  testHumidity: string;
  equipment: string;
  validFrom: string;
  validTo: string;
  status: string;
}

// Sample data for history and statistics
const sampleTests: AdhesionTest[] = [
  {
    id: 1,
    testDate: "2026-06-09",
    testTime: "09:30",
    partNo: "BP-A001",
    partName: "범퍼 커버",
    lotNo: "LOT240609-001",
    specimens: [
      { specimenNo: 1, grade: "0B" },
      { specimenNo: 2, grade: "0B" },
      { specimenNo: 3, grade: "1B" },
    ],
    testMethod: "크로스컷",
    passCriteria: "4B 이상",
    result: "합격",
    tester: "김검사",
    remarks: "",
  },
  {
    id: 2,
    testDate: "2026-06-09",
    testTime: "14:00",
    partNo: "BP-A002",
    partName: "그릴 커버",
    lotNo: "LOT240609-002",
    specimens: [
      { specimenNo: 1, grade: "2B" },
      { specimenNo: 2, grade: "3B" },
    ],
    testMethod: "테이프테스트",
    passCriteria: "4B 이상",
    result: "불합격",
    tester: "이품질",
    remarks: "도료 배합 비율 확인 필요",
  },
  {
    id: 3,
    testDate: "2026-06-08",
    testTime: "10:15",
    partNo: "BP-A003",
    partName: "사이드 미러 커버",
    lotNo: "LOT240608-001",
    specimens: [
      { specimenNo: 1, grade: "0B" },
      { specimenNo: 2, grade: "0B" },
    ],
    testMethod: "크로스컷",
    passCriteria: "4B 이상",
    result: "합격",
    tester: "김검사",
    remarks: "",
  },
  {
    id: 4,
    testDate: "2026-06-07",
    testTime: "11:30",
    partNo: "BP-A001",
    partName: "범퍼 커버",
    lotNo: "LOT240607-001",
    specimens: [
      { specimenNo: 1, grade: "0B" },
      { specimenNo: 2, grade: "1B" },
      { specimenNo: 3, grade: "0B" },
    ],
    testMethod: "크로스컷",
    passCriteria: "4B 이상",
    result: "합격",
    tester: "이품질",
    remarks: "",
  },
];

const sampleConditions: TestCondition[] = [
  {
    id: 1,
    tapeType: "3M 610",
    cuttingInterval: "1mm",
    testTemperature: "23",
    testHumidity: "50",
    equipment: "크로스컷 시험기 CC-100",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    status: "active",
  },
  {
    id: 2,
    tapeType: "니치반 CT-24",
    cuttingInterval: "2mm",
    testTemperature: "23",
    testHumidity: "50",
    equipment: "부착력 시험기 AT-200",
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    status: "active",
  },
];

// Grade evaluation helper
const gradeValues: Record<string, number> = {
  "5B": 5,
  "4B": 4,
  "3B": 3,
  "2B": 2,
  "1B": 1,
  "0B": 0,
};

const evaluateResult = (specimens: SpecimenResult[], passCriteria: string): string => {
  if (specimens.length === 0) return "판정불가";

  // Extract minimum grade from criteria (e.g., "4B 이상" -> 4)
  const criteriaMatch = passCriteria.match(/(\d)B/);
  const minGrade = criteriaMatch ? parseInt(criteriaMatch[1]) : 4;

  // Check if all specimens meet the criteria
  // Note: Lower number means better adhesion (0B is best, 5B is worst)
  const allPass = specimens.every((s) => gradeValues[s.grade] <= (5 - minGrade));
  return allPass ? "합격" : "불합격";
};

export default function AdhesionTestPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const [tests, setTests] = useState<AdhesionTest[]>(sampleTests);
  const [conditions, setConditions] = useState<TestCondition[]>(sampleConditions);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showConditionForm, setShowConditionForm] = useState(false);
  const [historyFilter, setHistoryFilter] = useState({ partNo: "", dateFrom: "", dateTo: "", resultFilter: "all" });

  // Daily test form state
  const [testFormData, setTestFormData] = useState({
    testDate: new Date().toISOString().split("T")[0],
    testTime: new Date().toTimeString().slice(0, 5),
    partNo: "",
    partName: "",
    lotNo: "",
    specimenCount: "3",
    specimen1Grade: "",
    specimen2Grade: "",
    specimen3Grade: "",
    testMethod: "",
    passCriteria: "4B 이상",
    tester: "",
    remarks: "",
  });

  // Condition form state
  const [conditionFormData, setConditionFormData] = useState({
    tapeType: "",
    cuttingInterval: "",
    testTemperature: "23",
    testHumidity: "50",
    equipment: "",
    validFrom: new Date().toISOString().split("T")[0],
    validTo: "",
  });

  // Handle daily test submit
  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specimenCount = parseInt(testFormData.specimenCount);
    const specimens: SpecimenResult[] = [];

    if (testFormData.specimen1Grade) {
      specimens.push({ specimenNo: 1, grade: testFormData.specimen1Grade });
    }
    if (specimenCount >= 2 && testFormData.specimen2Grade) {
      specimens.push({ specimenNo: 2, grade: testFormData.specimen2Grade });
    }
    if (specimenCount >= 3 && testFormData.specimen3Grade) {
      specimens.push({ specimenNo: 3, grade: testFormData.specimen3Grade });
    }

    const result = evaluateResult(specimens, testFormData.passCriteria);

    const newTest: AdhesionTest = {
      id: Date.now(),
      testDate: testFormData.testDate,
      testTime: testFormData.testTime,
      partNo: testFormData.partNo,
      partName: testFormData.partName,
      lotNo: testFormData.lotNo,
      specimens,
      testMethod: testFormData.testMethod,
      passCriteria: testFormData.passCriteria,
      result,
      tester: testFormData.tester,
      remarks: testFormData.remarks,
    };

    setTests([newTest, ...tests]);
    setShowTestForm(false);
    setTestFormData({
      testDate: new Date().toISOString().split("T")[0],
      testTime: new Date().toTimeString().slice(0, 5),
      partNo: "",
      partName: "",
      lotNo: "",
      specimenCount: "3",
      specimen1Grade: "",
      specimen2Grade: "",
      specimen3Grade: "",
      testMethod: "",
      passCriteria: "4B 이상",
      tester: "",
      remarks: "",
    });
    alert("부착성시험 기록이 저장되었습니다.");
  };

  // Handle condition submit
  const handleConditionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCondition: TestCondition = {
      id: Date.now(),
      tapeType: conditionFormData.tapeType,
      cuttingInterval: conditionFormData.cuttingInterval,
      testTemperature: conditionFormData.testTemperature,
      testHumidity: conditionFormData.testHumidity,
      equipment: conditionFormData.equipment,
      validFrom: conditionFormData.validFrom,
      validTo: conditionFormData.validTo,
      status: "active",
    };

    setConditions([newCondition, ...conditions]);
    setShowConditionForm(false);
    setConditionFormData({
      tapeType: "",
      cuttingInterval: "",
      testTemperature: "23",
      testHumidity: "50",
      equipment: "",
      validFrom: new Date().toISOString().split("T")[0],
      validTo: "",
    });
    alert("시험조건이 등록되었습니다.");
  };

  // Filter history
  const filteredHistory = tests.filter((test) => {
    if (historyFilter.partNo && !test.partNo.toLowerCase().includes(historyFilter.partNo.toLowerCase())) {
      return false;
    }
    if (historyFilter.dateFrom && test.testDate < historyFilter.dateFrom) {
      return false;
    }
    if (historyFilter.dateTo && test.testDate > historyFilter.dateTo) {
      return false;
    }
    if (historyFilter.resultFilter === "pass" && test.result !== "합격") {
      return false;
    }
    if (historyFilter.resultFilter === "fail" && test.result !== "불합격") {
      return false;
    }
    return true;
  });

  // Statistics calculations
  const calculateStats = () => {
    const totalTests = tests.length;
    const passTests = tests.filter((t) => t.result === "합격").length;
    const failTests = tests.filter((t) => t.result === "불합격").length;
    const passRate = totalTests > 0 ? ((passTests / totalTests) * 100).toFixed(1) : "0.0";

    // Daily stats (last 7 days)
    const today = new Date();
    const dailyStats: { date: string; total: number; pass: number; rate: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayTests = tests.filter((t) => t.testDate === dateStr);
      const dayPass = dayTests.filter((t) => t.result === "합격").length;
      dailyStats.push({
        date: dateStr,
        total: dayTests.length,
        pass: dayPass,
        rate: dayTests.length > 0 ? ((dayPass / dayTests.length) * 100).toFixed(1) : "-",
      });
    }

    // Part-wise stats
    const partStats: Record<string, { total: number; pass: number }> = {};
    tests.forEach((test) => {
      if (!partStats[test.partNo]) {
        partStats[test.partNo] = { total: 0, pass: 0 };
      }
      partStats[test.partNo].total++;
      if (test.result === "합격") {
        partStats[test.partNo].pass++;
      }
    });

    // Failure type analysis
    const failureTypes: Record<string, number> = {};
    tests
      .filter((t) => t.result === "불합격")
      .forEach((test) => {
        test.specimens.forEach((s) => {
          if (gradeValues[s.grade] >= 2) {
            const type = `등급 ${s.grade}`;
            failureTypes[type] = (failureTypes[type] || 0) + 1;
          }
        });
      });

    return { totalTests, passTests, failTests, passRate, dailyStats, partStats, failureTypes };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">부착성관리 (일간)</h1>
          <p className="text-muted-foreground">도장품 부착성(Cross-cut) 시험 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">
            <Layers className="mr-2 h-4 w-4" />
            일일 부착성 시험
          </TabsTrigger>
          <TabsTrigger value="conditions">
            <Settings className="mr-2 h-4 w-4" />
            시험조건 관리
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            시험 이력
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="mr-2 h-4 w-4" />
            통계 분석
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Daily Adhesion Test */}
        <TabsContent value="daily">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowTestForm(!showTestForm)}>
                <Plus className="mr-2 h-4 w-4" />
                시험 등록
              </Button>
            </div>

            {showTestForm && (
              <Card>
                <CardHeader>
                  <CardTitle>일일 부착성 시험 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTestSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>시험일 *</Label>
                        <Input
                          type="date"
                          value={testFormData.testDate}
                          onChange={(e) => setTestFormData({ ...testFormData, testDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>시험시간 *</Label>
                        <Input
                          type="time"
                          value={testFormData.testTime}
                          onChange={(e) => setTestFormData({ ...testFormData, testTime: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={testFormData.partNo}
                          onChange={(e) => setTestFormData({ ...testFormData, partNo: e.target.value })}
                          placeholder="품번 입력"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품명 *</Label>
                        <Input
                          value={testFormData.partName}
                          onChange={(e) => setTestFormData({ ...testFormData, partName: e.target.value })}
                          placeholder="품명 입력"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Lot번호 *</Label>
                        <Input
                          value={testFormData.lotNo}
                          onChange={(e) => setTestFormData({ ...testFormData, lotNo: e.target.value })}
                          placeholder="LOT번호"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>시편 수량</Label>
                        <Select
                          value={testFormData.specimenCount}
                          onValueChange={(v) => setTestFormData({ ...testFormData, specimenCount: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1개</SelectItem>
                            <SelectItem value="2">2개</SelectItem>
                            <SelectItem value="3">3개</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>시험방법 *</Label>
                        <Select
                          value={testFormData.testMethod}
                          onValueChange={(v) => setTestFormData({ ...testFormData, testMethod: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="크로스컷">크로스컷</SelectItem>
                            <SelectItem value="테이프테스트">테이프테스트</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>합격기준</Label>
                        <Select
                          value={testFormData.passCriteria}
                          onValueChange={(v) => setTestFormData({ ...testFormData, passCriteria: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5B 이상">5B 이상 (0% 박리)</SelectItem>
                            <SelectItem value="4B 이상">4B 이상 (5% 미만 박리)</SelectItem>
                            <SelectItem value="3B 이상">3B 이상 (15% 미만 박리)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>시편별 등급 입력</Label>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">시편 1</Label>
                          <Select
                            value={testFormData.specimen1Grade}
                            onValueChange={(v) => setTestFormData({ ...testFormData, specimen1Grade: v })}
                          >
                            <SelectTrigger><SelectValue placeholder="등급 선택" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0B">0B (0% 박리 - 최우수)</SelectItem>
                              <SelectItem value="1B">1B (5% 미만 박리)</SelectItem>
                              <SelectItem value="2B">2B (5-15% 박리)</SelectItem>
                              <SelectItem value="3B">3B (15-35% 박리)</SelectItem>
                              <SelectItem value="4B">4B (35-65% 박리)</SelectItem>
                              <SelectItem value="5B">5B (65% 초과 - 불량)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {parseInt(testFormData.specimenCount) >= 2 && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">시편 2</Label>
                            <Select
                              value={testFormData.specimen2Grade}
                              onValueChange={(v) => setTestFormData({ ...testFormData, specimen2Grade: v })}
                            >
                              <SelectTrigger><SelectValue placeholder="등급 선택" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0B">0B (0% 박리 - 최우수)</SelectItem>
                                <SelectItem value="1B">1B (5% 미만 박리)</SelectItem>
                                <SelectItem value="2B">2B (5-15% 박리)</SelectItem>
                                <SelectItem value="3B">3B (15-35% 박리)</SelectItem>
                                <SelectItem value="4B">4B (35-65% 박리)</SelectItem>
                                <SelectItem value="5B">5B (65% 초과 - 불량)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {parseInt(testFormData.specimenCount) >= 3 && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">시편 3</Label>
                            <Select
                              value={testFormData.specimen3Grade}
                              onValueChange={(v) => setTestFormData({ ...testFormData, specimen3Grade: v })}
                            >
                              <SelectTrigger><SelectValue placeholder="등급 선택" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0B">0B (0% 박리 - 최우수)</SelectItem>
                                <SelectItem value="1B">1B (5% 미만 박리)</SelectItem>
                                <SelectItem value="2B">2B (5-15% 박리)</SelectItem>
                                <SelectItem value="3B">3B (15-35% 박리)</SelectItem>
                                <SelectItem value="4B">4B (35-65% 박리)</SelectItem>
                                <SelectItem value="5B">5B (65% 초과 - 불량)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>시험자 *</Label>
                        <Input
                          value={testFormData.tester}
                          onChange={(e) => setTestFormData({ ...testFormData, tester: e.target.value })}
                          placeholder="시험자명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={testFormData.remarks}
                          onChange={(e) => setTestFormData({ ...testFormData, remarks: e.target.value })}
                          placeholder="특이사항"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowTestForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  금일 부착성 시험 결과
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tests.filter((t) => t.testDate === new Date().toISOString().split("T")[0]).length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">금일 시험 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시험시간</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead>시험방법</TableHead>
                        <TableHead>시편별 등급</TableHead>
                        <TableHead>합격기준</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>시험자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tests
                        .filter((t) => t.testDate === new Date().toISOString().split("T")[0])
                        .map((test) => (
                          <TableRow key={test.id}>
                            <TableCell>{test.testTime}</TableCell>
                            <TableCell className="font-mono">{test.partNo}</TableCell>
                            <TableCell>{test.partName}</TableCell>
                            <TableCell className="font-mono text-sm">{test.lotNo}</TableCell>
                            <TableCell>{test.testMethod}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {test.specimens.map((s) => (
                                  <Badge key={s.specimenNo} variant="outline">
                                    #{s.specimenNo}: {s.grade}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{test.passCriteria}</TableCell>
                            <TableCell>
                              <Badge variant={test.result === "합격" ? "success" : "destructive"}>
                                {test.result}
                              </Badge>
                            </TableCell>
                            <TableCell>{test.tester}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Test Condition Management */}
        <TabsContent value="conditions">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowConditionForm(!showConditionForm)}>
                <Plus className="mr-2 h-4 w-4" />
                시험조건 등록
              </Button>
            </div>

            {showConditionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>시험조건 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleConditionSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>테이프 종류 *</Label>
                        <Input
                          value={conditionFormData.tapeType}
                          onChange={(e) => setConditionFormData({ ...conditionFormData, tapeType: e.target.value })}
                          placeholder="예: 3M 610"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>컷팅 간격 *</Label>
                        <Select
                          value={conditionFormData.cuttingInterval}
                          onValueChange={(v) => setConditionFormData({ ...conditionFormData, cuttingInterval: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1mm">1mm</SelectItem>
                            <SelectItem value="2mm">2mm</SelectItem>
                            <SelectItem value="3mm">3mm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>시험장비 *</Label>
                        <Input
                          value={conditionFormData.equipment}
                          onChange={(e) => setConditionFormData({ ...conditionFormData, equipment: e.target.value })}
                          placeholder="장비명"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>시험온도 (C)</Label>
                        <Input
                          value={conditionFormData.testTemperature}
                          onChange={(e) => setConditionFormData({ ...conditionFormData, testTemperature: e.target.value })}
                          placeholder="23"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>시험습도 (%RH)</Label>
                        <Input
                          value={conditionFormData.testHumidity}
                          onChange={(e) => setConditionFormData({ ...conditionFormData, testHumidity: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>유효기간 시작일 *</Label>
                        <Input
                          type="date"
                          value={conditionFormData.validFrom}
                          onChange={(e) => setConditionFormData({ ...conditionFormData, validFrom: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>유효기간 종료일 *</Label>
                        <Input
                          type="date"
                          value={conditionFormData.validTo}
                          onChange={(e) => setConditionFormData({ ...conditionFormData, validTo: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowConditionForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  등록된 시험조건
                </CardTitle>
              </CardHeader>
              <CardContent>
                {conditions.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 시험조건이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>테이프 종류</TableHead>
                        <TableHead>컷팅 간격</TableHead>
                        <TableHead>시험온도</TableHead>
                        <TableHead>시험습도</TableHead>
                        <TableHead>시험장비</TableHead>
                        <TableHead>유효기간</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conditions.map((cond) => (
                        <TableRow key={cond.id}>
                          <TableCell className="font-medium">{cond.tapeType}</TableCell>
                          <TableCell>{cond.cuttingInterval}</TableCell>
                          <TableCell>{cond.testTemperature}C</TableCell>
                          <TableCell>{cond.testHumidity}%RH</TableCell>
                          <TableCell>{cond.equipment}</TableCell>
                          <TableCell className="text-sm">
                            {cond.validFrom} ~ {cond.validTo}
                          </TableCell>
                          <TableCell>
                            <Badge variant={cond.status === "active" ? "success" : "secondary"}>
                              {cond.status === "active" ? "사용중" : "만료"}
                            </Badge>
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

        {/* Tab 3: Test History */}
        <TabsContent value="history">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  검색 조건
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>품번</Label>
                    <Input
                      value={historyFilter.partNo}
                      onChange={(e) => setHistoryFilter({ ...historyFilter, partNo: e.target.value })}
                      placeholder="품번 검색"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>시작일</Label>
                    <Input
                      type="date"
                      value={historyFilter.dateFrom}
                      onChange={(e) => setHistoryFilter({ ...historyFilter, dateFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>종료일</Label>
                    <Input
                      type="date"
                      value={historyFilter.dateTo}
                      onChange={(e) => setHistoryFilter({ ...historyFilter, dateTo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>판정결과</Label>
                    <Select
                      value={historyFilter.resultFilter}
                      onValueChange={(v) => setHistoryFilter({ ...historyFilter, resultFilter: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="pass">합격</SelectItem>
                        <SelectItem value="fail">불합격</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => setHistoryFilter({ partNo: "", dateFrom: "", dateTo: "", resultFilter: "all" })}
                    >
                      초기화
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  시험 이력 ({filteredHistory.length}건)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredHistory.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">검색 결과가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시험일자</TableHead>
                        <TableHead>시험시간</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>Lot번호</TableHead>
                        <TableHead>시험방법</TableHead>
                        <TableHead>시편별 등급</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>시험자</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((test) => (
                        <TableRow key={test.id} className={test.result === "불합격" ? "bg-red-50" : ""}>
                          <TableCell>{test.testDate}</TableCell>
                          <TableCell>{test.testTime}</TableCell>
                          <TableCell className="font-mono">{test.partNo}</TableCell>
                          <TableCell>{test.partName}</TableCell>
                          <TableCell className="font-mono text-sm">{test.lotNo}</TableCell>
                          <TableCell>{test.testMethod}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {test.specimens.map((s) => (
                                <Badge
                                  key={s.specimenNo}
                                  variant={gradeValues[s.grade] <= 1 ? "success" : gradeValues[s.grade] >= 3 ? "destructive" : "outline"}
                                >
                                  #{s.specimenNo}: {s.grade}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={test.result === "합격" ? "success" : "destructive"}>
                              {test.result === "불합격" && <AlertTriangle className="mr-1 h-3 w-3" />}
                              {test.result}
                            </Badge>
                          </TableCell>
                          <TableCell>{test.tester}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{test.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Statistical Analysis */}
        <TabsContent value="statistics">
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">총 시험 건수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTests}건</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">합격 건수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    {stats.passTests}건
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">불합격 건수</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {stats.failTests}건
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">합격률</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.passRate}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Pass Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  일별 합격률 (최근 7일)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>일자</TableHead>
                      <TableHead>총 시험</TableHead>
                      <TableHead>합격</TableHead>
                      <TableHead>합격률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.dailyStats.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell>{day.total}건</TableCell>
                        <TableCell>{day.pass}건</TableCell>
                        <TableCell>
                          {day.rate === "-" ? (
                            <span className="text-muted-foreground">-</span>
                          ) : (
                            <Badge variant={parseFloat(day.rate) >= 95 ? "success" : parseFloat(day.rate) >= 80 ? "outline" : "destructive"}>
                              {day.rate}%
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Part-wise Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>품목별 합격률</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.partStats).length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">데이터가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>품번</TableHead>
                        <TableHead>총 시험</TableHead>
                        <TableHead>합격</TableHead>
                        <TableHead>불합격</TableHead>
                        <TableHead>합격률</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(stats.partStats).map(([partNo, data]) => {
                        const rate = ((data.pass / data.total) * 100).toFixed(1);
                        return (
                          <TableRow key={partNo}>
                            <TableCell className="font-mono">{partNo}</TableCell>
                            <TableCell>{data.total}건</TableCell>
                            <TableCell className="text-green-600">{data.pass}건</TableCell>
                            <TableCell className="text-red-600">{data.total - data.pass}건</TableCell>
                            <TableCell>
                              <Badge variant={parseFloat(rate) >= 95 ? "success" : parseFloat(rate) >= 80 ? "outline" : "destructive"}>
                                {rate}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Failure Type Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  불량 유형 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.failureTypes).length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">불량 데이터가 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>불량 유형</TableHead>
                        <TableHead>발생 건수</TableHead>
                        <TableHead>비율</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(stats.failureTypes)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, count]) => {
                          const total = Object.values(stats.failureTypes).reduce((a, b) => a + b, 0);
                          const ratio = ((count / total) * 100).toFixed(1);
                          return (
                            <TableRow key={type}>
                              <TableCell>{type}</TableCell>
                              <TableCell>{count}건</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-red-500 rounded-full"
                                      style={{ width: `${ratio}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">{ratio}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
