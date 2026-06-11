"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Plus, Save, ClipboardCheck, FileCheck, BarChart3, History, CheckCircle, XCircle } from "lucide-react";
import { getJigs, type Jig } from "@/lib/master-data";

// Types
interface JigFixture {
  id: string;
  code: string;
  name: string;
  type: string;
  processName: string;
  partName: string | null;
  location: string;
  status: "사용중" | "점검중" | "수리중" | "보관" | "폐기";
  lastInspectionDate: string;
  nextInspectionDate: string;
}

interface MassProductionCheckItem {
  id: number;
  category: string;
  item: string;
  standard: string;
  method: string;
  importance: "critical" | "major" | "minor";
}

interface MassProductionCheckResult {
  id: number;
  jigId: string;
  checkItemId: number;
  checkDate: string;
  checker: string;
  result: "pass" | "fail" | "na";
  remarks: string;
}

interface RegularInspectionItem {
  id: number;
  category: string;
  item: string;
  standard: string;
  method: string;
  cycle: "daily" | "weekly" | "monthly" | "quarterly";
}

interface RegularInspectionResult {
  id: number;
  jigId: string;
  inspectionItemId: number;
  inspectionDate: string;
  inspector: string;
  result: "good" | "bad" | "na";
  measuredValue: string;
  action: string;
  remarks: string;
}

interface InspectionHistory {
  id: number;
  jigId: string;
  type: "massProduction" | "regular";
  inspectionDate: string;
  inspector: string;
  totalItems: number;
  passCount: number;
  failCount: number;
  overallResult: "pass" | "fail" | "conditional";
  remarks: string;
}

// Load jig/fixture data from master data
const loadJigFixtures = (): JigFixture[] => {
  const masterJigs = getJigs();
  return masterJigs.map((jig: Jig) => ({
    id: jig.code,
    code: jig.code,
    name: jig.name,
    type: jig.type,
    processName: jig.processName,
    partName: jig.partName,
    location: jig.location,
    status: jig.status,
    lastInspectionDate: jig.lastInspectionDate,
    nextInspectionDate: jig.nextInspectionDate,
  }));
};

const initialJigFixtures: JigFixture[] = loadJigFixtures();

// Sample mass production check items (양산성 점검 항목)
const initialMassProductionCheckItems: MassProductionCheckItem[] = [
  { id: 1, category: "치수정밀도", item: "주요 치수 정밀도", standard: "도면 공차 이내", method: "3차원 측정기", importance: "critical" },
  { id: 2, category: "치수정밀도", item: "기준면 평탄도", standard: "0.02mm 이내", method: "평탄도 게이지", importance: "critical" },
  { id: 3, category: "위치결정 정확도", item: "로케이터 위치 정확도", standard: "+-0.05mm", method: "좌표측정기", importance: "critical" },
  { id: 4, category: "위치결정 정확도", item: "가이드 핀 정밀도", standard: "H7 공차", method: "핀 게이지", importance: "major" },
  { id: 5, category: "클램핑력", item: "클램프 유지력", standard: "규정력 이상", method: "토크렌치", importance: "critical" },
  { id: 6, category: "클램핑력", item: "클램프 동작 확인", standard: "원활한 작동", method: "작동시험", importance: "major" },
  { id: 7, category: "마모상태", item: "접촉부 마모", standard: "마모 기준 이내", method: "육안검사/측정", importance: "major" },
  { id: 8, category: "마모상태", item: "슬라이딩부 마모", standard: "백래시 0.1mm 이내", method: "다이얼게이지", importance: "major" },
  { id: 9, category: "청결상태", item: "이물질 유무", standard: "이물 없음", method: "육안검사", importance: "minor" },
  { id: 10, category: "청결상태", item: "오일/그리스 상태", standard: "적정량 유지", method: "육안검사", importance: "minor" },
];

// Sample regular inspection items (정기 점검 항목)
const initialRegularInspectionItems: RegularInspectionItem[] = [
  { id: 1, category: "치수정밀도", item: "주요 치수 확인", standard: "공차 이내", method: "캘리퍼스/마이크로미터", cycle: "monthly" },
  { id: 2, category: "위치결정 정확도", item: "로케이터 핀 상태", standard: "헐거움 없음", method: "손감각/육안", cycle: "weekly" },
  { id: 3, category: "클램핑력", item: "클램프 동작 상태", standard: "정상 작동", method: "작동시험", cycle: "daily" },
  { id: 4, category: "클램핑력", item: "에어/유압 누출", standard: "누출 없음", method: "육안/청음", cycle: "daily" },
  { id: 5, category: "마모상태", item: "접촉면 마모", standard: "기준선 이내", method: "육안검사", cycle: "weekly" },
  { id: 6, category: "마모상태", item: "가이드 레일 상태", standard: "흔들림 없음", method: "손감각", cycle: "weekly" },
  { id: 7, category: "청결상태", item: "칩/이물 제거", standard: "청결", method: "육안검사", cycle: "daily" },
  { id: 8, category: "청결상태", item: "윤활 상태", standard: "적정량", method: "육안검사", cycle: "weekly" },
];

// Sample mass production check results
const initialMassProductionResults: MassProductionCheckResult[] = [
  { id: 1, jigId: "JIG-001", checkItemId: 1, checkDate: "2026-06-01", checker: "김철수", result: "pass", remarks: "" },
  { id: 2, jigId: "JIG-001", checkItemId: 2, checkDate: "2026-06-01", checker: "김철수", result: "pass", remarks: "" },
  { id: 3, jigId: "JIG-001", checkItemId: 3, checkDate: "2026-06-01", checker: "김철수", result: "pass", remarks: "" },
  { id: 4, jigId: "JIG-001", checkItemId: 5, checkDate: "2026-06-01", checker: "김철수", result: "fail", remarks: "클램프력 부족, 조정 필요" },
];

// Sample regular inspection results
const initialRegularInspectionResults: RegularInspectionResult[] = [
  { id: 1, jigId: "JIG-001", inspectionItemId: 3, inspectionDate: "2026-06-09", inspector: "김철수", result: "good", measuredValue: "-", action: "", remarks: "" },
  { id: 2, jigId: "JIG-001", inspectionItemId: 4, inspectionDate: "2026-06-09", inspector: "김철수", result: "good", measuredValue: "-", action: "", remarks: "" },
  { id: 3, jigId: "JIG-001", inspectionItemId: 7, inspectionDate: "2026-06-09", inspector: "김철수", result: "good", measuredValue: "-", action: "", remarks: "" },
  { id: 4, jigId: "JIG-002", inspectionItemId: 3, inspectionDate: "2026-06-09", inspector: "이영희", result: "bad", measuredValue: "-", action: "클램프 수리 요청", remarks: "동작 불량" },
];

// Sample inspection history
const initialInspectionHistory: InspectionHistory[] = [
  { id: 1, jigId: "JIG-001", type: "massProduction", inspectionDate: "2026-06-01", inspector: "김철수", totalItems: 10, passCount: 9, failCount: 1, overallResult: "conditional", remarks: "클램프력 조정 후 재점검 예정" },
  { id: 2, jigId: "JIG-001", type: "regular", inspectionDate: "2026-06-09", inspector: "김철수", totalItems: 8, passCount: 8, failCount: 0, overallResult: "pass", remarks: "" },
  { id: 3, jigId: "JIG-002", type: "massProduction", inspectionDate: "2026-05-15", inspector: "이영희", totalItems: 10, passCount: 10, failCount: 0, overallResult: "pass", remarks: "" },
  { id: 4, jigId: "JIG-002", type: "regular", inspectionDate: "2026-06-09", inspector: "이영희", totalItems: 8, passCount: 7, failCount: 1, overallResult: "fail", remarks: "클램프 동작 불량" },
  { id: 5, jigId: "JIG-003", type: "massProduction", inspectionDate: "2026-04-20", inspector: "박민수", totalItems: 10, passCount: 10, failCount: 0, overallResult: "pass", remarks: "" },
];

const CYCLE_LABELS: { [key: string]: string } = {
  daily: "일간",
  weekly: "주간",
  monthly: "월간",
  quarterly: "분기",
};

const IMPORTANCE_LABELS: { [key: string]: string } = {
  critical: "필수",
  major: "주요",
  minor: "일반",
};

export default function JigInspectionPage() {
  const [activeTab, setActiveTab] = useState("mass-production");
  const [jigFixtures] = useState<JigFixture[]>(initialJigFixtures);
  const [massProductionCheckItems] = useState<MassProductionCheckItem[]>(initialMassProductionCheckItems);
  const [regularInspectionItems] = useState<RegularInspectionItem[]>(initialRegularInspectionItems);
  const [massProductionResults, setMassProductionResults] = useState<MassProductionCheckResult[]>(initialMassProductionResults);
  const [regularInspectionResults, setRegularInspectionResults] = useState<RegularInspectionResult[]>(initialRegularInspectionResults);
  const [inspectionHistory, setInspectionHistory] = useState<InspectionHistory[]>(initialInspectionHistory);

  // Header filter state
  const [selectedJig, setSelectedJig] = useState<string>("");

  // Form states
  const [showMassProductionForm, setShowMassProductionForm] = useState(false);
  const [showRegularForm, setShowRegularForm] = useState(false);

  const [newMassProductionResult, setNewMassProductionResult] = useState<Omit<MassProductionCheckResult, "id">>({
    jigId: "",
    checkItemId: 0,
    checkDate: new Date().toISOString().split("T")[0],
    checker: "",
    result: "pass",
    remarks: "",
  });

  const [newRegularResult, setNewRegularResult] = useState<Omit<RegularInspectionResult, "id">>({
    jigId: "",
    inspectionItemId: 0,
    inspectionDate: new Date().toISOString().split("T")[0],
    inspector: "",
    result: "good",
    measuredValue: "",
    action: "",
    remarks: "",
  });

  // Header Component
  const HeaderSection = () => {
    const jig = jigFixtures.find(j => j.id === selectedJig);
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            양산성체크시트(치공구)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            <div className="space-y-2">
              <Label>치공구 선택</Label>
              <Select value={selectedJig} onValueChange={setSelectedJig}>
                <SelectTrigger><SelectValue placeholder="치공구 선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {jigFixtures.map((jig) => (
                    <SelectItem key={jig.id} value={jig.id}>{jig.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>지그코드</Label>
              <Input value={jig?.code || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>품목명</Label>
              <Input value={jig?.partName || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>공정</Label>
              <Input value={jig?.processName || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>위치</Label>
              <Input value={jig?.location || "-"} disabled />
            </div>
            <div className="space-y-2">
              <Label>상태</Label>
              <Input value={jig?.status || "-"} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Tab 1: Mass Production Check (양산성 점검)
  const MassProductionCheckTab = () => {
    const filteredResults = selectedJig && selectedJig !== "all"
      ? massProductionResults.filter(r => r.jigId === selectedJig)
      : massProductionResults;

    const handleAddResult = () => {
      if (!newMassProductionResult.jigId || !newMassProductionResult.checkItemId || !newMassProductionResult.checker) {
        alert("필수 항목을 입력해주세요.");
        return;
      }
      const newResult: MassProductionCheckResult = {
        id: Date.now(),
        ...newMassProductionResult,
      };
      setMassProductionResults([newResult, ...massProductionResults]);
      setNewMassProductionResult({
        jigId: "",
        checkItemId: 0,
        checkDate: new Date().toISOString().split("T")[0],
        checker: "",
        result: "pass",
        remarks: "",
      });
      setShowMassProductionForm(false);
      alert("양산성 점검 결과가 등록되었습니다.");
    };

    // Group items by category
    const categories = [...new Set(massProductionCheckItems.map(item => item.category))];

    return (
      <div className="space-y-6">
        {/* Jig Information */}
        {selectedJig && selectedJig !== "all" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">치공구 정보</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const jig = jigFixtures.find(j => j.id === selectedJig);
                if (!jig) return null;
                return (
                  <div className="grid gap-4 md:grid-cols-5">
                    <div>
                      <Label className="text-muted-foreground">치공구명</Label>
                      <p className="font-medium">{jig.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">유형</Label>
                      <p className="font-medium">{jig.type}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">상태</Label>
                      <Badge variant={jig.status === "사용중" ? "success" : jig.status === "점검중" || jig.status === "수리중" ? "secondary" : "destructive"}>
                        {jig.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">최종 점검일</Label>
                      <p className="font-medium">{jig.lastInspectionDate || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">차기 점검일</Label>
                      <p className="font-medium">{jig.nextInspectionDate || "-"}</p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Check Items by Category */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              치공구 양산성 점검체크시트
            </CardTitle>
            <Button onClick={() => setShowMassProductionForm(!showMassProductionForm)}>
              <Plus className="mr-2 h-4 w-4" />
              점검 결과 입력
            </Button>
          </CardHeader>
          <CardContent>
            {showMassProductionForm && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-4">양산성 점검 결과 등록</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>점검일 *</Label>
                    <Input
                      type="date"
                      value={newMassProductionResult.checkDate}
                      onChange={(e) => setNewMassProductionResult({ ...newMassProductionResult, checkDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>치공구 *</Label>
                    <Select
                      value={newMassProductionResult.jigId}
                      onValueChange={(v) => setNewMassProductionResult({ ...newMassProductionResult, jigId: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="치공구 선택" /></SelectTrigger>
                      <SelectContent>
                        {jigFixtures.map((jig) => (
                          <SelectItem key={jig.id} value={jig.id}>{jig.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>점검항목 *</Label>
                    <Select
                      value={newMassProductionResult.checkItemId.toString()}
                      onValueChange={(v) => setNewMassProductionResult({ ...newMassProductionResult, checkItemId: parseInt(v) })}
                    >
                      <SelectTrigger><SelectValue placeholder="점검항목 선택" /></SelectTrigger>
                      <SelectContent>
                        {massProductionCheckItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            [{item.category}] {item.item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>점검자 *</Label>
                    <Input
                      value={newMassProductionResult.checker}
                      onChange={(e) => setNewMassProductionResult({ ...newMassProductionResult, checker: e.target.value })}
                      placeholder="점검자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>판정 *</Label>
                    <Select
                      value={newMassProductionResult.result}
                      onValueChange={(v) => setNewMassProductionResult({ ...newMassProductionResult, result: v as "pass" | "fail" | "na" })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">합격</SelectItem>
                        <SelectItem value="fail">불합격</SelectItem>
                        <SelectItem value="na">해당없음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Input
                      value={newMassProductionResult.remarks}
                      onChange={(e) => setNewMassProductionResult({ ...newMassProductionResult, remarks: e.target.value })}
                      placeholder="특이사항"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowMassProductionForm(false)}>취소</Button>
                  <Button onClick={handleAddResult}><Save className="mr-2 h-4 w-4" />저장</Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">분류</TableHead>
                  <TableHead>점검항목</TableHead>
                  <TableHead>점검기준</TableHead>
                  <TableHead>점검방법</TableHead>
                  <TableHead className="text-center w-20">중요도</TableHead>
                  <TableHead className="text-center w-20">판정</TableHead>
                  <TableHead className="w-40">비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(category => {
                  const categoryItems = massProductionCheckItems.filter(item => item.category === category);
                  return categoryItems.map((item, idx) => {
                    const result = filteredResults.find(r => r.checkItemId === item.id);
                    return (
                      <TableRow key={item.id}>
                        {idx === 0 && (
                          <TableCell rowSpan={categoryItems.length} className="font-medium bg-muted/50 align-middle">
                            {category}
                          </TableCell>
                        )}
                        <TableCell>{item.item}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.standard}</TableCell>
                        <TableCell className="text-sm">{item.method}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.importance === "critical" ? "destructive" : item.importance === "major" ? "secondary" : "outline"}>
                            {IMPORTANCE_LABELS[item.importance]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {result ? (
                            result.result === "pass" ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                            ) : result.result === "fail" ? (
                              <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{result?.remarks || "-"}</TableCell>
                      </TableRow>
                    );
                  });
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tab 2: Regular Inspection (정기 점검)
  const RegularInspectionTab = () => {
    const filteredResults = selectedJig && selectedJig !== "all"
      ? regularInspectionResults.filter(r => r.jigId === selectedJig)
      : regularInspectionResults;

    const handleAddResult = () => {
      if (!newRegularResult.jigId || !newRegularResult.inspectionItemId || !newRegularResult.inspector) {
        alert("필수 항목을 입력해주세요.");
        return;
      }
      const newResult: RegularInspectionResult = {
        id: Date.now(),
        ...newRegularResult,
      };
      setRegularInspectionResults([newResult, ...regularInspectionResults]);
      setNewRegularResult({
        jigId: "",
        inspectionItemId: 0,
        inspectionDate: new Date().toISOString().split("T")[0],
        inspector: "",
        result: "good",
        measuredValue: "",
        action: "",
        remarks: "",
      });
      setShowRegularForm(false);
      alert("정기 점검 결과가 등록되었습니다.");
    };

    // Group items by category
    const categories = [...new Set(regularInspectionItems.map(item => item.category))];

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            치공구 점검시트 (정기 점검)
          </CardTitle>
          <Button onClick={() => setShowRegularForm(!showRegularForm)}>
            <Plus className="mr-2 h-4 w-4" />
            점검 결과 입력
          </Button>
        </CardHeader>
        <CardContent>
          {showRegularForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">정기 점검 결과 등록</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>점검일 *</Label>
                  <Input
                    type="date"
                    value={newRegularResult.inspectionDate}
                    onChange={(e) => setNewRegularResult({ ...newRegularResult, inspectionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>치공구 *</Label>
                  <Select
                    value={newRegularResult.jigId}
                    onValueChange={(v) => setNewRegularResult({ ...newRegularResult, jigId: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="치공구 선택" /></SelectTrigger>
                    <SelectContent>
                      {jigFixtures.map((jig) => (
                        <SelectItem key={jig.id} value={jig.id}>{jig.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검항목 *</Label>
                  <Select
                    value={newRegularResult.inspectionItemId.toString()}
                    onValueChange={(v) => setNewRegularResult({ ...newRegularResult, inspectionItemId: parseInt(v) })}
                  >
                    <SelectTrigger><SelectValue placeholder="점검항목 선택" /></SelectTrigger>
                    <SelectContent>
                      {regularInspectionItems.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          [{item.category}] {item.item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검자 *</Label>
                  <Input
                    value={newRegularResult.inspector}
                    onChange={(e) => setNewRegularResult({ ...newRegularResult, inspector: e.target.value })}
                    placeholder="점검자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>판정 *</Label>
                  <Select
                    value={newRegularResult.result}
                    onValueChange={(v) => setNewRegularResult({ ...newRegularResult, result: v as "good" | "bad" | "na" })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">양호</SelectItem>
                      <SelectItem value="bad">불량</SelectItem>
                      <SelectItem value="na">해당없음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>측정값</Label>
                  <Input
                    value={newRegularResult.measuredValue}
                    onChange={(e) => setNewRegularResult({ ...newRegularResult, measuredValue: e.target.value })}
                    placeholder="측정값 (해당 시)"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>조치내용</Label>
                  <Textarea
                    value={newRegularResult.action}
                    onChange={(e) => setNewRegularResult({ ...newRegularResult, action: e.target.value })}
                    placeholder="불량 시 조치내용"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Textarea
                    value={newRegularResult.remarks}
                    onChange={(e) => setNewRegularResult({ ...newRegularResult, remarks: e.target.value })}
                    placeholder="특이사항"
                    rows={2}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRegularForm(false)}>취소</Button>
                <Button onClick={handleAddResult}><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">분류</TableHead>
                <TableHead>점검항목</TableHead>
                <TableHead>점검기준</TableHead>
                <TableHead>점검방법</TableHead>
                <TableHead className="text-center w-20">주기</TableHead>
                <TableHead className="text-center w-20">판정</TableHead>
                <TableHead className="w-32">조치내용</TableHead>
                <TableHead className="w-32">비고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => {
                const categoryItems = regularInspectionItems.filter(item => item.category === category);
                return categoryItems.map((item, idx) => {
                  const result = filteredResults.find(r => r.inspectionItemId === item.id);
                  return (
                    <TableRow key={item.id}>
                      {idx === 0 && (
                        <TableCell rowSpan={categoryItems.length} className="font-medium bg-muted/50 align-middle">
                          {category}
                        </TableCell>
                      )}
                      <TableCell>{item.item}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.standard}</TableCell>
                      <TableCell className="text-sm">{item.method}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{CYCLE_LABELS[item.cycle]}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {result ? (
                          <Badge variant={result.result === "good" ? "success" : result.result === "bad" ? "destructive" : "outline"}>
                            {result.result === "good" ? "양호" : result.result === "bad" ? "불량" : "-"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{result?.action || "-"}</TableCell>
                      <TableCell className="text-sm">{result?.remarks || "-"}</TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  // Tab 3: Inspection Status (점검 현황)
  const InspectionStatusTab = () => {
    const getJigStats = (jigId: string) => {
      const massResults = massProductionResults.filter(r => r.jigId === jigId);
      const regularResults = regularInspectionResults.filter(r => r.jigId === jigId);

      const massPassCount = massResults.filter(r => r.result === "pass").length;
      const massFailCount = massResults.filter(r => r.result === "fail").length;
      const regularGoodCount = regularResults.filter(r => r.result === "good").length;
      const regularBadCount = regularResults.filter(r => r.result === "bad").length;

      const history = inspectionHistory.filter(h => h.jigId === jigId);
      const lastMassProduction = history.filter(h => h.type === "massProduction").sort((a, b) => b.inspectionDate.localeCompare(a.inspectionDate))[0];
      const lastRegular = history.filter(h => h.type === "regular").sort((a, b) => b.inspectionDate.localeCompare(a.inspectionDate))[0];

      return {
        massTotal: massResults.length,
        massPass: massPassCount,
        massFail: massFailCount,
        regularTotal: regularResults.length,
        regularGood: regularGoodCount,
        regularBad: regularBadCount,
        lastMassProductionDate: lastMassProduction?.inspectionDate || "-",
        lastMassProductionResult: lastMassProduction?.overallResult || null,
        lastRegularDate: lastRegular?.inspectionDate || "-",
        lastRegularResult: lastRegular?.overallResult || null,
      };
    };

    const filteredJigs = selectedJig && selectedJig !== "all"
      ? jigFixtures.filter(j => j.id === selectedJig)
      : jigFixtures;

    // Summary statistics
    const totalStats = filteredJigs.reduce(
      (acc, jig) => {
        const stats = getJigStats(jig.id);
        return {
          massTotal: acc.massTotal + stats.massTotal,
          massPass: acc.massPass + stats.massPass,
          massFail: acc.massFail + stats.massFail,
          regularTotal: acc.regularTotal + stats.regularTotal,
          regularGood: acc.regularGood + stats.regularGood,
          regularBad: acc.regularBad + stats.regularBad,
        };
      },
      { massTotal: 0, massPass: 0, massFail: 0, regularTotal: 0, regularGood: 0, regularBad: 0 }
    );

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 치공구 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredJigs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">양산성 점검 합격률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.massTotal > 0
                  ? Math.round((totalStats.massPass / totalStats.massTotal) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                합격 {totalStats.massPass} / 불합격 {totalStats.massFail}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">정기 점검 양호율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.regularTotal > 0
                  ? Math.round((totalStats.regularGood / totalStats.regularTotal) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                양호 {totalStats.regularGood} / 불량 {totalStats.regularBad}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">점검 필요</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {filteredJigs.filter(j => j.status === "점검중" || j.status === "수리중").length}
              </div>
              <p className="text-xs text-muted-foreground">보전/수리 필요 치공구</p>
            </CardContent>
          </Card>
        </div>

        {/* Jig Status Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              치공구별 점검 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>지그코드</TableHead>
                  <TableHead>치공구명</TableHead>
                  <TableHead>공정/위치</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead className="text-center">최근 양산성 점검</TableHead>
                  <TableHead className="text-center">양산성 결과</TableHead>
                  <TableHead className="text-center">최근 정기 점검</TableHead>
                  <TableHead className="text-center">정기 점검 결과</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJigs.map((jig) => {
                  const stats = getJigStats(jig.id);
                  return (
                    <TableRow key={jig.id}>
                      <TableCell className="font-mono">{jig.code}</TableCell>
                      <TableCell className="font-medium">{jig.name}</TableCell>
                      <TableCell>{jig.processName} / {jig.location}</TableCell>
                      <TableCell>{jig.partName || "-"}</TableCell>
                      <TableCell className="text-center">{stats.lastMassProductionDate}</TableCell>
                      <TableCell className="text-center">
                        {stats.lastMassProductionResult && (
                          <Badge
                            variant={
                              stats.lastMassProductionResult === "pass" ? "success" :
                              stats.lastMassProductionResult === "fail" ? "destructive" : "secondary"
                            }
                          >
                            {stats.lastMassProductionResult === "pass" ? "합격" :
                             stats.lastMassProductionResult === "fail" ? "불합격" : "조건부"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">{stats.lastRegularDate}</TableCell>
                      <TableCell className="text-center">
                        {stats.lastRegularResult && (
                          <Badge
                            variant={
                              stats.lastRegularResult === "pass" ? "success" :
                              stats.lastRegularResult === "fail" ? "destructive" : "secondary"
                            }
                          >
                            {stats.lastRegularResult === "pass" ? "합격" :
                             stats.lastRegularResult === "fail" ? "불합격" : "조건부"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            jig.status === "사용중" ? "success" :
                            jig.status === "점검중" || jig.status === "수리중" ? "secondary" : "destructive"
                          }
                        >
                          {jig.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tab 4: Inspection History (점검 이력)
  const InspectionHistoryTab = () => {
    const filteredHistory = selectedJig && selectedJig !== "all"
      ? inspectionHistory.filter(h => h.jigId === selectedJig)
      : inspectionHistory;

    const sortedHistory = [...filteredHistory].sort((a, b) =>
      b.inspectionDate.localeCompare(a.inspectionDate)
    );

    return (
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
                <TableHead>점검일</TableHead>
                <TableHead>치공구</TableHead>
                <TableHead>점검유형</TableHead>
                <TableHead>점검자</TableHead>
                <TableHead className="text-center">총 항목</TableHead>
                <TableHead className="text-center">합격/양호</TableHead>
                <TableHead className="text-center">불합격/불량</TableHead>
                <TableHead className="text-center">최종 판정</TableHead>
                <TableHead>비고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    점검 이력이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                sortedHistory.map((record) => {
                  const jig = jigFixtures.find(j => j.id === record.jigId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{record.inspectionDate}</TableCell>
                      <TableCell className="font-medium">{jig?.name || record.jigId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {record.type === "massProduction" ? "양산성 점검" : "정기 점검"}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.inspector}</TableCell>
                      <TableCell className="text-center">{record.totalItems}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">{record.passCount}</TableCell>
                      <TableCell className="text-center text-red-600 font-medium">{record.failCount}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            record.overallResult === "pass" ? "success" :
                            record.overallResult === "fail" ? "destructive" : "secondary"
                          }
                        >
                          {record.overallResult === "pass" ? "합격" :
                           record.overallResult === "fail" ? "불합격" : "조건부 합격"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{record.remarks || "-"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">치공구 점검</h1>
          <p className="text-muted-foreground">치공구 양산성 점검 및 정기 점검 관리</p>
        </div>
      </div>

      <HeaderSection />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mass-production">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            양산성 점검
          </TabsTrigger>
          <TabsTrigger value="regular-inspection">
            <FileCheck className="mr-2 h-4 w-4" />
            정기 점검
          </TabsTrigger>
          <TabsTrigger value="inspection-status">
            <BarChart3 className="mr-2 h-4 w-4" />
            점검 현황
          </TabsTrigger>
          <TabsTrigger value="inspection-history">
            <History className="mr-2 h-4 w-4" />
            점검 이력
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mass-production">
          <MassProductionCheckTab />
        </TabsContent>

        <TabsContent value="regular-inspection">
          <RegularInspectionTab />
        </TabsContent>

        <TabsContent value="inspection-status">
          <InspectionStatusTab />
        </TabsContent>

        <TabsContent value="inspection-history">
          <InspectionHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
