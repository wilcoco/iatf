"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, CheckCircle, XCircle, AlertTriangle, History, ClipboardCheck, Thermometer } from "lucide-react";

// Types
interface CheckItem {
  id: number;
  itemName: string;
  checkContent: string;
  standard: string;
  spec: string;
  measured: string;
  result: "OK" | "NG" | "";
  remark: string;
}

interface IssueRecord {
  id: number;
  checkDate: string;
  lineMachine: string;
  checkItem: string;
  issueDescription: string;
  actionTaken: string;
  actionBy: string;
  status: "미조치" | "조치중" | "조치완료";
}

interface CheckHistory {
  id: number;
  checkDate: string;
  lineMachine: string;
  shift: string;
  checker: string;
  carModel: string;
  partName: string;
  totalItems: number;
  okCount: number;
  ngCount: number;
  overallStatus: "정상" | "이상";
}

// Initial check items for injection process
const initialCheckItems: Omit<CheckItem, "measured" | "result" | "remark">[] = [
  {
    id: 1,
    itemName: "사출기 온도",
    checkContent: "노즐 온도",
    standard: "설정온도 ±5°C",
    spec: "200~250°C"
  },
  {
    id: 2,
    itemName: "사출기 온도",
    checkContent: "실린더 온도 (Z1)",
    standard: "설정온도 ±5°C",
    spec: "190~240°C"
  },
  {
    id: 3,
    itemName: "사출기 온도",
    checkContent: "실린더 온도 (Z2)",
    standard: "설정온도 ±5°C",
    spec: "185~235°C"
  },
  {
    id: 4,
    itemName: "사출기 온도",
    checkContent: "실린더 온도 (Z3)",
    standard: "설정온도 ±5°C",
    spec: "180~230°C"
  },
  {
    id: 5,
    itemName: "압력",
    checkContent: "사출압력 (1차)",
    standard: "기준값 ±10%",
    spec: "80~120 bar"
  },
  {
    id: 6,
    itemName: "압력",
    checkContent: "사출압력 (2차)",
    standard: "기준값 ±10%",
    spec: "60~100 bar"
  },
  {
    id: 7,
    itemName: "압력",
    checkContent: "보압",
    standard: "기준값 ±10%",
    spec: "40~80 bar"
  },
  {
    id: 8,
    itemName: "금형온도",
    checkContent: "고정측 온도",
    standard: "설정온도 ±3°C",
    spec: "40~60°C"
  },
  {
    id: 9,
    itemName: "금형온도",
    checkContent: "가동측 온도",
    standard: "설정온도 ±3°C",
    spec: "40~60°C"
  },
  {
    id: 10,
    itemName: "사이클타임",
    checkContent: "전체 사이클타임",
    standard: "기준값 ±2sec",
    spec: "45~55 sec"
  },
  {
    id: 11,
    itemName: "사이클타임",
    checkContent: "냉각시간",
    standard: "기준값 ±1sec",
    spec: "20~25 sec"
  },
  {
    id: 12,
    itemName: "사이클타임",
    checkContent: "사출시간",
    standard: "기준값 ±0.5sec",
    spec: "2~4 sec"
  },
];

// Sample history data
const sampleHistory: CheckHistory[] = [
  { id: 1, checkDate: "2026-06-08", lineMachine: "1호기", shift: "A조", checker: "김철수", carModel: "NQ5", partName: "범퍼 LH", totalItems: 12, okCount: 12, ngCount: 0, overallStatus: "정상" },
  { id: 2, checkDate: "2026-06-08", lineMachine: "2호기", shift: "A조", checker: "박영희", carModel: "EV6", partName: "사이드실 RH", totalItems: 12, okCount: 11, ngCount: 1, overallStatus: "이상" },
  { id: 3, checkDate: "2026-06-07", lineMachine: "1호기", shift: "B조", checker: "이민호", carModel: "NQ5", partName: "범퍼 LH", totalItems: 12, okCount: 12, ngCount: 0, overallStatus: "정상" },
  { id: 4, checkDate: "2026-06-07", lineMachine: "3호기", shift: "B조", checker: "최지영", carModel: "GV80", partName: "펜더 LH", totalItems: 12, okCount: 10, ngCount: 2, overallStatus: "이상" },
  { id: 5, checkDate: "2026-06-06", lineMachine: "2호기", shift: "A조", checker: "정민수", carModel: "EV6", partName: "사이드실 RH", totalItems: 12, okCount: 12, ngCount: 0, overallStatus: "정상" },
];

// Sample issues data
const sampleIssues: IssueRecord[] = [
  { id: 1, checkDate: "2026-06-08", lineMachine: "2호기", checkItem: "사출압력 (1차)", issueDescription: "압력 불안정 (85bar로 하락)", actionTaken: "", actionBy: "", status: "미조치" },
  { id: 2, checkDate: "2026-06-07", lineMachine: "3호기", checkItem: "금형온도 고정측", issueDescription: "온도 상승 (65°C 확인)", actionTaken: "냉각수 라인 점검 및 청소", actionBy: "박정비", status: "조치완료" },
];

export default function InjectionCheckPage() {
  const [activeTab, setActiveTab] = useState("check-entry");

  // Tab 1: Check Entry State
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split("T")[0]);
  const [lineMachine, setLineMachine] = useState("");
  const [shift, setShift] = useState("");
  const [checker, setChecker] = useState("");
  const [carModel, setCarModel] = useState("");
  const [partName, setPartName] = useState("");
  const [weight, setWeight] = useState("");
  const [checkItems, setCheckItems] = useState<CheckItem[]>(
    initialCheckItems.map((item) => ({ ...item, measured: "", result: "", remark: "" }))
  );

  // Tab 2: Issue State
  const [issues, setIssues] = useState<IssueRecord[]>(sampleIssues);

  // Tab 3: History State
  const [history, setHistory] = useState<CheckHistory[]>(sampleHistory);
  const [historyFilter, setHistoryFilter] = useState({
    startDate: "",
    endDate: "",
    lineMachine: "",
  });

  // Handler for measured value change
  const handleMeasuredChange = (itemId: number, measured: string) => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, measured } : item
      )
    );
  };

  // Handler for check result change
  const handleResultChange = (itemId: number, result: "OK" | "NG") => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, result } : item
      )
    );

    // If result is "NG", automatically add to issues
    if (result === "NG") {
      const item = checkItems.find((i) => i.id === itemId);
      if (item) {
        const existingIssue = issues.find(
          (issue) => issue.checkItem === item.checkContent && issue.checkDate === checkDate && issue.lineMachine === lineMachine
        );
        if (!existingIssue && lineMachine) {
          setIssues((prev) => [
            ...prev,
            {
              id: Date.now(),
              checkDate,
              lineMachine,
              checkItem: item.checkContent,
              issueDescription: "",
              actionTaken: "",
              actionBy: "",
              status: "미조치",
            },
          ]);
        }
      }
    }
  };

  // Handler for remark change
  const handleRemarkChange = (itemId: number, remark: string) => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, remark } : item
      )
    );
  };

  // Submit check
  const handleSubmitCheck = () => {
    const okCount = checkItems.filter((i) => i.result === "OK").length;
    const ngCount = checkItems.filter((i) => i.result === "NG").length;
    const emptyCount = checkItems.filter((i) => i.result === "").length;

    if (emptyCount > 0) {
      alert("모든 점검 항목의 판정 결과를 입력해주세요.");
      return;
    }

    if (!lineMachine || !shift || !checker) {
      alert("라인/호기, 작업조, 점검자를 입력해주세요.");
      return;
    }

    const newHistory: CheckHistory = {
      id: Date.now(),
      checkDate,
      lineMachine,
      shift,
      checker,
      carModel,
      partName,
      totalItems: checkItems.length,
      okCount,
      ngCount,
      overallStatus: ngCount > 0 ? "이상" : "정상",
    };

    setHistory((prev) => [newHistory, ...prev]);

    // Reset form
    setCheckItems(initialCheckItems.map((item) => ({ ...item, measured: "", result: "", remark: "" })));
    setLineMachine("");
    setShift("");
    setChecker("");
    setCarModel("");
    setPartName("");
    setWeight("");

    alert("점검 기록이 저장되었습니다.");
  };

  // Update issue
  const handleUpdateIssue = (issueId: number, field: keyof IssueRecord, value: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, [field]: value } : issue
      )
    );
  };

  // Get unique item names for grouping
  const itemGroups = Array.from(new Set(checkItems.map((item) => item.itemName)));

  // Filter history
  const filteredHistory = history.filter((h) => {
    if (historyFilter.startDate && h.checkDate < historyFilter.startDate) return false;
    if (historyFilter.endDate && h.checkDate > historyFilter.endDate) return false;
    if (historyFilter.lineMachine && h.lineMachine !== historyFilter.lineMachine) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">사출공정 일일점검</h1>
          <p className="text-muted-foreground">사출공정 일일 점검현황</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="check-entry" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            점검 입력
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            이상 현황
            {issues.filter((i) => i.status !== "조치완료").length > 0 && (
              <Badge variant="error" className="ml-1">
                {issues.filter((i) => i.status !== "조치완료").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            점검 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 점검 입력 */}
        <TabsContent value="check-entry">
          <Card>
            <CardHeader>
              <CardTitle>사출공정 점검 입력</CardTitle>
              <CardDescription>사출기 온도, 압력, 금형온도, 사이클타임 등 점검 항목별 규격/실측/판정을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Info */}
              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2">
                  <Label>점검일</Label>
                  <Input
                    type="date"
                    value={checkDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>라인/호기</Label>
                  <Select value={lineMachine} onValueChange={setLineMachine}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1호기">1호기</SelectItem>
                      <SelectItem value="2호기">2호기</SelectItem>
                      <SelectItem value="3호기">3호기</SelectItem>
                      <SelectItem value="4호기">4호기</SelectItem>
                      <SelectItem value="5호기">5호기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>작업조</Label>
                  <Select value={shift} onValueChange={setShift}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A조">A조</SelectItem>
                      <SelectItem value="B조">B조</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검자</Label>
                  <Input
                    value={checker}
                    onChange={(e) => setChecker(e.target.value)}
                    placeholder="점검자 이름"
                  />
                </div>
                <div className="space-y-2">
                  <Label>차종</Label>
                  <Input
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="예: NQ5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>부품명</Label>
                  <Input
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="예: 범퍼 LH"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2">
                  <Label>관리중량</Label>
                  <Input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="예: 2.5kg"
                  />
                </div>
              </div>

              {/* Check Items by Category */}
              {itemGroups.map((itemName) => (
                <div key={itemName} className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    {itemName}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">점검내용</TableHead>
                        <TableHead className="w-[150px]">관리기준</TableHead>
                        <TableHead className="w-[120px]">규격</TableHead>
                        <TableHead className="w-[120px]">실측값</TableHead>
                        <TableHead className="w-[160px]">판정</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkItems
                        .filter((item) => item.itemName === itemName)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.checkContent}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.standard}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.spec}</Badge>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.measured}
                                onChange={(e) => handleMeasuredChange(item.id, e.target.value)}
                                placeholder="실측값"
                                className="h-8 w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "OK" ? "default" : "outline"}
                                  onClick={() => handleResultChange(item.id, "OK")}
                                  className={item.result === "OK" ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  OK
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "NG" ? "destructive" : "outline"}
                                  onClick={() => handleResultChange(item.id, "NG")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  NG
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.remark}
                                onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                                placeholder="특이사항"
                                className="h-8"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ))}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button onClick={handleSubmitCheck} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  점검 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 이상 현황 */}
        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                이상 발생 현황
              </CardTitle>
              <CardDescription>점검 중 발견된 이상 항목과 조치 현황</CardDescription>
            </CardHeader>
            <CardContent>
              {issues.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>현재 발생한 이상 항목이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>점검일</TableHead>
                      <TableHead>라인/호기</TableHead>
                      <TableHead>점검항목</TableHead>
                      <TableHead>이상내용</TableHead>
                      <TableHead>조치사항</TableHead>
                      <TableHead>조치자</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>{issue.checkDate}</TableCell>
                        <TableCell className="font-medium">{issue.lineMachine}</TableCell>
                        <TableCell>{issue.checkItem}</TableCell>
                        <TableCell>
                          <Textarea
                            value={issue.issueDescription}
                            onChange={(e) => handleUpdateIssue(issue.id, "issueDescription", e.target.value)}
                            placeholder="이상 내용 입력"
                            className="min-h-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={issue.actionTaken}
                            onChange={(e) => handleUpdateIssue(issue.id, "actionTaken", e.target.value)}
                            placeholder="조치 내용 입력"
                            className="min-h-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={issue.actionBy}
                            onChange={(e) => handleUpdateIssue(issue.id, "actionBy", e.target.value)}
                            placeholder="조치자"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={issue.status}
                            onValueChange={(value) => handleUpdateIssue(issue.id, "status", value)}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="미조치">미조치</SelectItem>
                              <SelectItem value="조치중">조치중</SelectItem>
                              <SelectItem value="조치완료">조치완료</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 점검 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                점검 이력
              </CardTitle>
              <CardDescription>날짜별/라인별 사출공정 점검 이력 조회</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filter */}
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={historyFilter.startDate}
                    onChange={(e) => setHistoryFilter((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    value={historyFilter.endDate}
                    onChange={(e) => setHistoryFilter((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>라인/호기</Label>
                  <Select
                    value={historyFilter.lineMachine}
                    onValueChange={(value) => setHistoryFilter((prev) => ({ ...prev, lineMachine: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="1호기">1호기</SelectItem>
                      <SelectItem value="2호기">2호기</SelectItem>
                      <SelectItem value="3호기">3호기</SelectItem>
                      <SelectItem value="4호기">4호기</SelectItem>
                      <SelectItem value="5호기">5호기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setHistoryFilter({ startDate: "", endDate: "", lineMachine: "" })}
                >
                  초기화
                </Button>
              </div>

              {/* History Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>점검일</TableHead>
                    <TableHead>라인/호기</TableHead>
                    <TableHead>작업조</TableHead>
                    <TableHead>점검자</TableHead>
                    <TableHead>차종</TableHead>
                    <TableHead>부품명</TableHead>
                    <TableHead className="text-center">총 항목</TableHead>
                    <TableHead className="text-center">OK</TableHead>
                    <TableHead className="text-center">NG</TableHead>
                    <TableHead>종합판정</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        조회된 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.checkDate}</TableCell>
                        <TableCell className="font-medium">{record.lineMachine}</TableCell>
                        <TableCell>{record.shift}</TableCell>
                        <TableCell>{record.checker}</TableCell>
                        <TableCell>{record.carModel}</TableCell>
                        <TableCell>{record.partName}</TableCell>
                        <TableCell className="text-center">{record.totalItems}</TableCell>
                        <TableCell className="text-center text-green-600 font-medium">
                          {record.okCount}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-medium">
                          {record.ngCount}
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.overallStatus === "정상" ? "success" : "error"}>
                            {record.overallStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
