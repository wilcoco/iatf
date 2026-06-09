"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FlaskConical, ClipboardCheck, History, Save, Search, CheckCircle, XCircle, ChevronRight } from "lucide-react";

// Test types from the Excel file
const TEST_TYPES = {
  physical: [
    { id: "holder_fusion", name: "홀더융착", category: "물리시험" },
    { id: "towing_cap", name: "토잉캡", category: "물리시험" },
    { id: "torque", name: "토크체결", category: "물리시험" },
    { id: "gloss", name: "광택", category: "물리시험" },
    { id: "appearance", name: "외관", category: "물리시험" },
    { id: "adhesion", name: "부착성", category: "물리시험" },
  ],
  impact: [
    { id: "impact_room", name: "상온 내충격성", category: "충격시험" },
    { id: "impact_cold", name: "저온 내충격성", category: "충격시험" },
  ],
  resistance: [
    { id: "humidity", name: "내습성", category: "내성시험" },
    { id: "water", name: "내수성", category: "내성시험" },
    { id: "acid", name: "내산성", category: "내성시험" },
    { id: "alkaline", name: "내알카리성", category: "내성시험" },
    { id: "chemical", name: "내약품성", category: "내성시험" },
    { id: "heat", name: "내열성", category: "내성시험" },
    { id: "heat_cycle", name: "내열CYCLE성", category: "내성시험" },
    { id: "abrasion", name: "내마모성", category: "내성시험" },
  ],
  coating: [
    { id: "coating_thickness", name: "도막두께", category: "도장시험" },
    { id: "car_wash", name: "고압세차성", category: "도장시험" },
    { id: "weather", name: "내후성", category: "도장시험" },
  ],
  other: [
    { id: "heavy_metal", name: "중금속", category: "기타시험" },
    { id: "protect_wrap", name: "보호랩", category: "기타시험" },
  ],
};

const ALL_TESTS = [
  ...TEST_TYPES.physical,
  ...TEST_TYPES.impact,
  ...TEST_TYPES.resistance,
  ...TEST_TYPES.coating,
  ...TEST_TYPES.other,
];

// Type definitions
interface TestResult {
  testId: string;
  testName: string;
  specification: string;
  measuredValue: string;
  result: "합격" | "불합격" | "미실시";
  remarks: string;
}

interface TestReport {
  id: number;
  reportNo: string;
  reportDate: string;
  vehicleType: string;
  partName: string;
  partNo: string;
  supplier: string;
  testSpec: string;
  selectedTests: string[];
  testResults: TestResult[];
  overallResult: "합격" | "불합격" | "진행중";
  tester: string;
  approver: string;
  remarks: string;
  createdAt: string;
}

// Generate report number
const generateReportNo = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `TR-${dateStr}-${random}`;
};

export default function TestReportPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [reports, setReports] = useState<TestReport[]>([]);
  const [search, setSearch] = useState("");

  // Basic info form state (Tab 1)
  const [basicInfo, setBasicInfo] = useState({
    reportNo: generateReportNo(),
    reportDate: new Date().toISOString().split("T")[0],
    vehicleType: "SK3 PE",
    partName: "BUMPER ASSY-FR/RR 外",
    partNo: "86550-K0AA0 外",
    supplier: "",
    testSpec: "MS655-15 外",
    tester: "",
    approver: "",
    remarks: "",
  });

  // Selected tests state (Tab 2)
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  // Test results state (Tab 3)
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  // Toggle test selection
  const toggleTest = (testId: string) => {
    setSelectedTests((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  // Select all tests in a category
  const selectAllInCategory = (tests: typeof TEST_TYPES.physical) => {
    const testIds = tests.map((t) => t.id);
    const allSelected = testIds.every((id) => selectedTests.includes(id));
    if (allSelected) {
      setSelectedTests((prev) => prev.filter((id) => !testIds.includes(id)));
    } else {
      setSelectedTests((prev) => [...new Set([...prev, ...testIds])]);
    }
  };

  // Update test result
  const updateTestResult = (testId: string, field: keyof TestResult, value: string) => {
    const test = ALL_TESTS.find((t) => t.id === testId);
    if (!test) return;

    setTestResults((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        testId,
        testName: test.name,
        [field]: value,
      },
    }));
  };

  // Calculate overall result
  const calculateOverallResult = (): "합격" | "불합격" | "진행중" => {
    if (selectedTests.length === 0) return "진행중";

    const resultsCount = selectedTests.filter((id) => testResults[id]?.result).length;
    if (resultsCount < selectedTests.length) return "진행중";

    const failedCount = selectedTests.filter((id) => testResults[id]?.result === "불합격").length;
    return failedCount > 0 ? "불합격" : "합격";
  };

  // Check if basic info is complete
  const isBasicInfoComplete = () => {
    return (
      basicInfo.vehicleType.trim() !== "" &&
      basicInfo.partName.trim() !== "" &&
      basicInfo.partNo.trim() !== "" &&
      basicInfo.testSpec.trim() !== "" &&
      basicInfo.tester.trim() !== ""
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isBasicInfoComplete()) {
      alert("기본정보를 먼저 입력해주세요.");
      setActiveTab("basic");
      return;
    }

    if (selectedTests.length === 0) {
      alert("시험항목을 선택해주세요.");
      setActiveTab("selection");
      return;
    }

    const newReport: TestReport = {
      id: Date.now(),
      reportNo: basicInfo.reportNo,
      reportDate: basicInfo.reportDate,
      vehicleType: basicInfo.vehicleType,
      partName: basicInfo.partName,
      partNo: basicInfo.partNo,
      supplier: basicInfo.supplier,
      testSpec: basicInfo.testSpec,
      selectedTests: [...selectedTests],
      testResults: selectedTests.map((id) => ({
        testId: id,
        testName: ALL_TESTS.find((t) => t.id === id)?.name || "",
        specification: testResults[id]?.specification || "",
        measuredValue: testResults[id]?.measuredValue || "",
        result: testResults[id]?.result || "미실시",
        remarks: testResults[id]?.remarks || "",
      })),
      overallResult: calculateOverallResult(),
      tester: basicInfo.tester,
      approver: basicInfo.approver,
      remarks: basicInfo.remarks,
      createdAt: new Date().toISOString(),
    };

    setReports([newReport, ...reports]);

    // Reset form
    setBasicInfo({
      reportNo: generateReportNo(),
      reportDate: new Date().toISOString().split("T")[0],
      vehicleType: "SK3 PE",
      partName: "BUMPER ASSY-FR/RR 外",
      partNo: "86550-K0AA0 外",
      supplier: "",
      testSpec: "MS655-15 外",
      tester: "",
      approver: "",
      remarks: "",
    });
    setSelectedTests([]);
    setTestResults({});

    alert("시험보고서가 저장되었습니다.");
    setActiveTab("history");
  };

  // Filter reports for history
  const filteredReports = reports.filter(
    (r) =>
      r.reportNo.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase()) ||
      r.partNo.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleType.toLowerCase().includes(search.toLowerCase())
  );

  // Get result badge variant
  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "진행중":
      case "미실시":
        return "warning";
      default:
        return "outline";
    }
  };

  // Render test category checkbox group
  const renderTestCategory = (title: string, tests: typeof TEST_TYPES.physical) => {
    const allSelected = tests.every((t) => selectedTests.includes(t.id));
    const someSelected = tests.some((t) => selectedTests.includes(t.id));

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{title}</CardTitle>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={() => selectAllInCategory(tests)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-muted-foreground">전체선택</span>
            </label>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {tests.map((test) => (
              <label key={test.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted">
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test.id)}
                  onChange={() => toggleTest(test.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">{test.name}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">시험보고서</h1>
          <p className="text-muted-foreground">재료/부품 시험 성적서 관리 (MS655-15 기준)</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본정보</TabsTrigger>
          <TabsTrigger value="selection">시험항목 선택</TabsTrigger>
          <TabsTrigger value="results">시험결과 입력</TabsTrigger>
          <TabsTrigger value="history">성적서 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                성적서 갑 - 기본정보
              </CardTitle>
              <CardDescription>시험보고서의 기본 정보를 입력합니다 (차종, 품명, 부번, 시험규격)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Header */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">보고서 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>보고서 번호</Label>
                    <Input value={basicInfo.reportNo} disabled className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>시험일자 *</Label>
                    <Input
                      type="date"
                      value={basicInfo.reportDate}
                      onChange={(e) => setBasicInfo({ ...basicInfo, reportDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>시험규격 *</Label>
                    <Input
                      value={basicInfo.testSpec}
                      onChange={(e) => setBasicInfo({ ...basicInfo, testSpec: e.target.value })}
                      placeholder="예: MS655-15"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">제품 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>차종 *</Label>
                    <Input
                      value={basicInfo.vehicleType}
                      onChange={(e) => setBasicInfo({ ...basicInfo, vehicleType: e.target.value })}
                      placeholder="예: SK3 PE"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품명 *</Label>
                    <Input
                      value={basicInfo.partName}
                      onChange={(e) => setBasicInfo({ ...basicInfo, partName: e.target.value })}
                      placeholder="예: BUMPER ASSY-FR/RR"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>부번 *</Label>
                    <Input
                      value={basicInfo.partNo}
                      onChange={(e) => setBasicInfo({ ...basicInfo, partNo: e.target.value })}
                      placeholder="예: 86550-K0AA0"
                      className="font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>업체</Label>
                    <Select
                      value={basicInfo.supplier}
                      onValueChange={(v) => setBasicInfo({ ...basicInfo, supplier: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="협력사A">협력사A</SelectItem>
                        <SelectItem value="협력사B">협력사B</SelectItem>
                        <SelectItem value="협력사C">협력사C</SelectItem>
                        <SelectItem value="자체생산">자체생산</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Personnel */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">담당자</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>시험자 *</Label>
                    <Input
                      value={basicInfo.tester}
                      onChange={(e) => setBasicInfo({ ...basicInfo, tester: e.target.value })}
                      placeholder="시험자명 입력"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>승인자</Label>
                    <Input
                      value={basicInfo.approver}
                      onChange={(e) => setBasicInfo({ ...basicInfo, approver: e.target.value })}
                      placeholder="승인자명 입력"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label>비고</Label>
                <Textarea
                  value={basicInfo.remarks}
                  onChange={(e) => setBasicInfo({ ...basicInfo, remarks: e.target.value })}
                  placeholder="추가 메모 사항을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("selection")} disabled={!isBasicInfoComplete()}>
                  다음: 시험항목 선택
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Test Selection */}
        <TabsContent value="selection">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  시험항목 선택
                </CardTitle>
                <CardDescription>
                  실시할 시험항목을 선택하세요. 선택된 항목: {selectedTests.length}개
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {renderTestCategory("물리시험", TEST_TYPES.physical)}
              {renderTestCategory("충격시험", TEST_TYPES.impact)}
              {renderTestCategory("내성시험", TEST_TYPES.resistance)}
              {renderTestCategory("도장시험", TEST_TYPES.coating)}
              {renderTestCategory("기타시험", TEST_TYPES.other)}
            </div>

            {/* Selection Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">선택된 시험항목</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">시험항목을 선택해주세요.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedTests.map((id) => {
                      const test = ALL_TESTS.find((t) => t.id === id);
                      return (
                        <Badge key={id} variant="secondary" className="px-3 py-1">
                          {test?.name}
                          <button
                            onClick={() => toggleTest(id)}
                            className="ml-2 hover:text-destructive"
                          >
                            x
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                이전
              </Button>
              <Button onClick={() => setActiveTab("results")} disabled={selectedTests.length === 0}>
                다음: 시험결과 입력
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Test Results Entry */}
        <TabsContent value="results">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  시험결과 입력
                </CardTitle>
                <CardDescription>
                  선택된 각 시험항목에 대한 결과를 입력하세요
                </CardDescription>
              </CardHeader>
            </Card>

            {selectedTests.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-muted-foreground text-center">
                    먼저 시험항목을 선택해주세요.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={() => setActiveTab("selection")}>
                      시험항목 선택으로 이동
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {selectedTests.map((testId) => {
                    const test = ALL_TESTS.find((t) => t.id === testId);
                    if (!test) return null;

                    return (
                      <Card key={testId}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{test.name}</CardTitle>
                            <Badge variant="outline">{test.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                              <Label>규격</Label>
                              <Input
                                value={testResults[testId]?.specification || ""}
                                onChange={(e) => updateTestResult(testId, "specification", e.target.value)}
                                placeholder="시험 규격"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>측정값</Label>
                              <Input
                                value={testResults[testId]?.measuredValue || ""}
                                onChange={(e) => updateTestResult(testId, "measuredValue", e.target.value)}
                                placeholder="측정 결과"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>판정</Label>
                              <Select
                                value={testResults[testId]?.result || ""}
                                onValueChange={(v) => updateTestResult(testId, "result", v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="판정 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="합격">합격</SelectItem>
                                  <SelectItem value="불합격">불합격</SelectItem>
                                  <SelectItem value="미실시">미실시</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>비고</Label>
                              <Input
                                value={testResults[testId]?.remarks || ""}
                                onChange={(e) => updateTestResult(testId, "remarks", e.target.value)}
                                placeholder="특이사항"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Overall Result */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">종합 판정</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          시험 결과에 따른 자동 판정
                        </p>
                        <div className="flex items-center gap-2">
                          {calculateOverallResult() === "합격" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : calculateOverallResult() === "불합격" ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : null}
                          <Badge variant={getResultVariant(calculateOverallResult())} className="text-lg px-4 py-1">
                            {calculateOverallResult()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setActiveTab("selection")}>
                          이전
                        </Button>
                        <Button onClick={handleSubmit}>
                          <Save className="mr-2 h-4 w-4" />
                          시험보고서 저장
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                성적서 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="보고서번호, 품명, 부번, 차종으로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredReports.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 시험보고서가 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>보고서번호</TableHead>
                        <TableHead>시험일</TableHead>
                        <TableHead>차종</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>부번</TableHead>
                        <TableHead>시험항목</TableHead>
                        <TableHead>종합판정</TableHead>
                        <TableHead>시험자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono text-sm">{report.reportNo}</TableCell>
                          <TableCell>{report.reportDate}</TableCell>
                          <TableCell>{report.vehicleType}</TableCell>
                          <TableCell>{report.partName}</TableCell>
                          <TableCell className="font-mono">{report.partNo}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.selectedTests.length}개 항목</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getResultVariant(report.overallResult)}>
                              {report.overallResult}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.tester}</TableCell>
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
