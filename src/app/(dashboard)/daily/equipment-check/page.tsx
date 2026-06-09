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
import { Plus, Save, CheckCircle, XCircle, AlertTriangle, History, ClipboardCheck, Wrench } from "lucide-react";

// Types
interface CheckItem {
  id: number;
  equipmentName: string;
  checkPart: string;
  checkCategory: string;
  checkStandard: string;
  result: "양호" | "불량" | "NA" | "";
  remark: string;
}

interface IssueRecord {
  id: number;
  equipmentName: string;
  checkPart: string;
  issueDescription: string;
  actionTaken: string;
  actionBy: string;
  actionDate: string;
  status: "미조치" | "조치중" | "조치완료";
}

interface CheckHistory {
  id: number;
  checkDate: string;
  lineProcess: string;
  checker: string;
  totalItems: number;
  normalCount: number;
  abnormalCount: number;
  naCount: number;
  overallStatus: "정상" | "이상";
}

// Initial check items for equipment
const initialCheckItems: Omit<CheckItem, "result" | "remark">[] = [
  { id: 1, equipmentName: "사출기 #1", checkPart: "유압부", checkCategory: "외관", checkStandard: "누유 없을 것" },
  { id: 2, equipmentName: "사출기 #1", checkPart: "유압부", checkCategory: "작동", checkStandard: "정상 압력 유지" },
  { id: 3, equipmentName: "사출기 #1", checkPart: "냉각부", checkCategory: "외관", checkStandard: "호스 손상 없을 것" },
  { id: 4, equipmentName: "사출기 #1", checkPart: "냉각부", checkCategory: "청소", checkStandard: "이물질 없을 것" },
  { id: 5, equipmentName: "사출기 #2", checkPart: "전기부", checkCategory: "외관", checkStandard: "배선 손상 없을 것" },
  { id: 6, equipmentName: "사출기 #2", checkPart: "전기부", checkCategory: "작동", checkStandard: "정상 작동" },
  { id: 7, equipmentName: "도장부스 #1", checkPart: "환기부", checkCategory: "작동", checkStandard: "정상 풍량" },
  { id: 8, equipmentName: "도장부스 #1", checkPart: "필터", checkCategory: "청소", checkStandard: "막힘 없을 것" },
  { id: 9, equipmentName: "도장부스 #1", checkPart: "스프레이건", checkCategory: "급유", checkStandard: "윤활 양호" },
  { id: 10, equipmentName: "조립라인 #1", checkPart: "컨베이어", checkCategory: "외관", checkStandard: "벨트 손상 없을 것" },
  { id: 11, equipmentName: "조립라인 #1", checkPart: "컨베이어", checkCategory: "작동", checkStandard: "정상 속도" },
  { id: 12, equipmentName: "조립라인 #1", checkPart: "구동부", checkCategory: "급유", checkStandard: "오일레벨 적정" },
];

// Sample history data
const sampleHistory: CheckHistory[] = [
  { id: 1, checkDate: "2026-06-08", lineProcess: "사출동/사출공정", checker: "김철수", totalItems: 12, normalCount: 12, abnormalCount: 0, naCount: 0, overallStatus: "정상" },
  { id: 2, checkDate: "2026-06-07", lineProcess: "사출동/사출공정", checker: "박영희", totalItems: 12, normalCount: 11, abnormalCount: 1, naCount: 0, overallStatus: "이상" },
  { id: 3, checkDate: "2026-06-06", lineProcess: "도장동/도장공정", checker: "이민호", totalItems: 12, normalCount: 12, abnormalCount: 0, naCount: 0, overallStatus: "정상" },
  { id: 4, checkDate: "2026-06-05", lineProcess: "조립동/조립공정", checker: "최지영", totalItems: 12, normalCount: 10, abnormalCount: 2, naCount: 0, overallStatus: "이상" },
  { id: 5, checkDate: "2026-06-04", lineProcess: "사출동/사출공정", checker: "김철수", totalItems: 12, normalCount: 12, abnormalCount: 0, naCount: 0, overallStatus: "정상" },
];

export default function EquipmentCheckPage() {
  const [activeTab, setActiveTab] = useState("check-entry");

  // Tab 1: Check Entry State
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split("T")[0]);
  const [lineProcess, setLineProcess] = useState("");
  const [checker, setChecker] = useState("");
  const [checkItems, setCheckItems] = useState<CheckItem[]>(
    initialCheckItems.map((item) => ({ ...item, result: "", remark: "" }))
  );

  // Tab 2: Issue State
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [issueForm, setIssueForm] = useState({
    equipmentName: "",
    checkPart: "",
    issueDescription: "",
    actionTaken: "",
    actionBy: "",
  });

  // Tab 3: History State
  const [history, setHistory] = useState<CheckHistory[]>(sampleHistory);
  const [historyFilter, setHistoryFilter] = useState({
    startDate: "",
    endDate: "",
    lineProcess: "",
  });

  // Handler for check item result change
  const handleResultChange = (itemId: number, result: "양호" | "불량" | "NA") => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, result } : item
      )
    );

    // If result is "불량", automatically add to issues
    if (result === "불량") {
      const item = checkItems.find((i) => i.id === itemId);
      if (item) {
        const existingIssue = issues.find(
          (issue) => issue.equipmentName === item.equipmentName && issue.checkPart === item.checkPart
        );
        if (!existingIssue) {
          setIssues((prev) => [
            ...prev,
            {
              id: Date.now(),
              equipmentName: item.equipmentName,
              checkPart: item.checkPart,
              issueDescription: "",
              actionTaken: "",
              actionBy: "",
              actionDate: checkDate,
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
    const normalCount = checkItems.filter((i) => i.result === "양호").length;
    const abnormalCount = checkItems.filter((i) => i.result === "불량").length;
    const naCount = checkItems.filter((i) => i.result === "NA").length;
    const emptyCount = checkItems.filter((i) => i.result === "").length;

    if (emptyCount > 0) {
      alert("모든 점검 항목의 결과를 입력해주세요.");
      return;
    }

    if (!lineProcess || !checker) {
      alert("라인/공정과 점검자를 입력해주세요.");
      return;
    }

    const newHistory: CheckHistory = {
      id: Date.now(),
      checkDate,
      lineProcess,
      checker,
      totalItems: checkItems.length,
      normalCount,
      abnormalCount,
      naCount,
      overallStatus: abnormalCount > 0 ? "이상" : "정상",
    };

    setHistory((prev) => [newHistory, ...prev]);

    // Reset form
    setCheckItems(initialCheckItems.map((item) => ({ ...item, result: "", remark: "" })));
    setLineProcess("");
    setChecker("");

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

  // Get unique equipment names for grouping
  const equipmentGroups = Array.from(new Set(checkItems.map((item) => item.equipmentName)));

  // Filter history
  const filteredHistory = history.filter((h) => {
    if (historyFilter.startDate && h.checkDate < historyFilter.startDate) return false;
    if (historyFilter.endDate && h.checkDate > historyFilter.endDate) return false;
    if (historyFilter.lineProcess && !h.lineProcess.includes(historyFilter.lineProcess)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비 일상점검</h1>
          <p className="text-muted-foreground">일일 설비 점검 기록 관리</p>
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
              <CardTitle>일상 점검 입력</CardTitle>
              <CardDescription>설비별 점검 항목을 확인하고 결과를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Info */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>점검일</Label>
                  <Input
                    type="date"
                    value={checkDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>라인/공정</Label>
                  <Select value={lineProcess} onValueChange={setLineProcess}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사출동/사출공정">사출동/사출공정</SelectItem>
                      <SelectItem value="도장동/도장공정">도장동/도장공정</SelectItem>
                      <SelectItem value="조립동/조립공정">조립동/조립공정</SelectItem>
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
              </div>

              {/* Check Items by Equipment */}
              {equipmentGroups.map((equipmentName) => (
                <div key={equipmentName} className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    {equipmentName}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">점검부위</TableHead>
                        <TableHead className="w-[100px]">점검항목</TableHead>
                        <TableHead>점검기준</TableHead>
                        <TableHead className="w-[200px]">점검결과</TableHead>
                        <TableHead className="w-[200px]">비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkItems
                        .filter((item) => item.equipmentName === equipmentName)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.checkPart}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.checkCategory}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.checkStandard}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "양호" ? "default" : "outline"}
                                  onClick={() => handleResultChange(item.id, "양호")}
                                  className={item.result === "양호" ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  양호
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "불량" ? "destructive" : "outline"}
                                  onClick={() => handleResultChange(item.id, "불량")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  불량
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "NA" ? "secondary" : "outline"}
                                  onClick={() => handleResultChange(item.id, "NA")}
                                >
                                  NA
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
                      <TableHead>설비명</TableHead>
                      <TableHead>점검부위</TableHead>
                      <TableHead>이상내용</TableHead>
                      <TableHead>조치사항</TableHead>
                      <TableHead>조치자</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.equipmentName}</TableCell>
                        <TableCell>{issue.checkPart}</TableCell>
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
              <CardDescription>날짜별 설비 점검 이력 조회</CardDescription>
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
                  <Label>라인/공정</Label>
                  <Select
                    value={historyFilter.lineProcess}
                    onValueChange={(value) => setHistoryFilter((prev) => ({ ...prev, lineProcess: value }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="사출동">사출동</SelectItem>
                      <SelectItem value="도장동">도장동</SelectItem>
                      <SelectItem value="조립동">조립동</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setHistoryFilter({ startDate: "", endDate: "", lineProcess: "" })}
                >
                  초기화
                </Button>
              </div>

              {/* History Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>점검일</TableHead>
                    <TableHead>라인/공정</TableHead>
                    <TableHead>점검자</TableHead>
                    <TableHead className="text-center">총 항목</TableHead>
                    <TableHead className="text-center">양호</TableHead>
                    <TableHead className="text-center">불량</TableHead>
                    <TableHead className="text-center">NA</TableHead>
                    <TableHead>종합판정</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        조회된 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.checkDate}</TableCell>
                        <TableCell>{record.lineProcess}</TableCell>
                        <TableCell>{record.checker}</TableCell>
                        <TableCell className="text-center">{record.totalItems}</TableCell>
                        <TableCell className="text-center text-green-600 font-medium">
                          {record.normalCount}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-medium">
                          {record.abnormalCount}
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          {record.naCount}
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
