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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Save, Trash2, ClipboardCheck, AlertTriangle, History, FileText } from "lucide-react";

// Types
interface AuditHeader {
  auditNumber: string;
  auditDate: string;
  auditType: string;
  department: string;
}

interface AuditPlan {
  purpose: string;
  scope: string;
  criteria: string;
  teamLeader: string;
  auditors: string;
}

interface ChecklistItem {
  id: number;
  clauseNumber: string;
  auditItem: string;
  auditQuestion: string;
  conformity: string;
  evidence: string;
}

interface Nonconformity {
  id: number;
  description: string;
  correctiveAction: string;
  dueDate: string;
  status: string;
}

interface AuditHistory {
  id: number;
  auditNumber: string;
  auditDate: string;
  auditType: string;
  department: string;
  result: string;
  ncCount: number;
}

export default function InternalAuditPage() {
  const [activeTab, setActiveTab] = useState("plan");

  // Header state
  const [header, setHeader] = useState<AuditHeader>({
    auditNumber: "",
    auditDate: new Date().toISOString().split("T")[0],
    auditType: "",
    department: "",
  });

  // Audit plan state
  const [plan, setPlan] = useState<AuditPlan>({
    purpose: "",
    scope: "",
    criteria: "",
    teamLeader: "",
    auditors: "",
  });

  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, clauseNumber: "", auditItem: "", auditQuestion: "", conformity: "", evidence: "" },
  ]);

  // Nonconformity state
  const [nonconformities, setNonconformities] = useState<Nonconformity[]>([]);

  // Conclusion state
  const [conclusion, setConclusion] = useState("");

  // History state (sample data)
  const [history] = useState<AuditHistory[]>([
    { id: 1, auditNumber: "IA-2026-001", auditDate: "2026-01-15", auditType: "시스템", department: "품질보증팀", result: "적합", ncCount: 0 },
    { id: 2, auditNumber: "IA-2026-002", auditDate: "2026-02-20", auditType: "프로세스", department: "생산팀", result: "조건부적합", ncCount: 2 },
    { id: 3, auditNumber: "IA-2026-003", auditDate: "2026-03-10", auditType: "제품", department: "개발팀", result: "적합", ncCount: 0 },
    { id: 4, auditNumber: "IA-2026-004", auditDate: "2026-04-05", auditType: "시스템", department: "구매팀", result: "부적합", ncCount: 3 },
    { id: 5, auditNumber: "IA-2026-005", auditDate: "2026-05-18", auditType: "프로세스", department: "물류팀", result: "적합", ncCount: 1 },
  ]);

  // Checklist handlers
  const addChecklistItem = () => {
    setChecklist([
      ...checklist,
      { id: Date.now(), clauseNumber: "", auditItem: "", auditQuestion: "", conformity: "", evidence: "" },
    ]);
  };

  const updateChecklistItem = (id: number, field: keyof ChecklistItem, value: string) => {
    setChecklist(checklist.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeChecklistItem = (id: number) => {
    if (checklist.length > 1) {
      setChecklist(checklist.filter((item) => item.id !== id));
    }
  };

  // Nonconformity handlers
  const addNonconformity = () => {
    setNonconformities([
      ...nonconformities,
      { id: Date.now(), description: "", correctiveAction: "", dueDate: "", status: "open" },
    ]);
  };

  const updateNonconformity = (id: number, field: keyof Nonconformity, value: string) => {
    setNonconformities(nonconformities.map((nc) =>
      nc.id === id ? { ...nc, [field]: value } : nc
    ));
  };

  const removeNonconformity = (id: number) => {
    setNonconformities(nonconformities.filter((nc) => nc.id !== id));
  };

  // Save handler
  const handleSave = () => {
    const auditData = {
      header,
      plan,
      checklist,
      nonconformities,
      conclusion,
    };
    console.log("Saving audit data:", auditData);
    alert("내부심사 데이터가 저장되었습니다.");
  };

  // IATF 16949 clause options
  const iatfClauses = [
    "4.1 조직과 조직상황의 이해",
    "4.2 이해관계자의 니즈와 기대 이해",
    "4.3 품질경영시스템 적용범위 결정",
    "4.4 품질경영시스템과 그 프로세스",
    "5.1 리더십과 의지표명",
    "5.2 방침",
    "5.3 조직의 역할, 책임 및 권한",
    "6.1 리스크와 기회를 다루는 조치",
    "6.2 품질목표와 달성기획",
    "6.3 변경의 기획",
    "7.1 자원",
    "7.2 적격성",
    "7.3 인식",
    "7.4 의사소통",
    "7.5 문서화된 정보",
    "8.1 운영 기획 및 관리",
    "8.2 제품 및 서비스에 대한 요구사항",
    "8.3 제품 및 서비스의 설계와 개발",
    "8.4 외부에서 제공되는 프로세스, 제품 및 서비스의 관리",
    "8.5 생산 및 서비스 제공",
    "8.6 제품 및 서비스의 불출",
    "8.7 부적합 출력의 관리",
    "9.1 모니터링, 측정, 분석 및 평가",
    "9.2 내부심사",
    "9.3 경영검토",
    "10.1 개선 - 일반",
    "10.2 부적합 및 시정조치",
    "10.3 지속적 개선",
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내부심사</h1>
          <p className="text-muted-foreground">IATF 16949 내부심사 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Audit Header Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            심사 기본정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>심사번호 *</Label>
              <Input
                value={header.auditNumber}
                onChange={(e) => setHeader({ ...header, auditNumber: e.target.value })}
                placeholder="IA-2026-001"
              />
            </div>
            <div className="space-y-2">
              <Label>심사일정 *</Label>
              <Input
                type="date"
                value={header.auditDate}
                onChange={(e) => setHeader({ ...header, auditDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>심사유형 *</Label>
              <Select value={header.auditType} onValueChange={(v) => setHeader({ ...header, auditType: v })}>
                <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="시스템">시스템</SelectItem>
                  <SelectItem value="프로세스">프로세스</SelectItem>
                  <SelectItem value="제품">제품</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>수검부서 *</Label>
              <Input
                value={header.department}
                onChange={(e) => setHeader({ ...header, department: e.target.value })}
                placeholder="품질보증팀"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">
            <FileText className="mr-2 h-4 w-4" />
            심사 계획
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            체크리스트
          </TabsTrigger>
          <TabsTrigger value="nonconformity">
            <AlertTriangle className="mr-2 h-4 w-4" />
            부적합 관리
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            심사 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Audit Plan */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>심사 계획</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>심사목적 *</Label>
                <Textarea
                  value={plan.purpose}
                  onChange={(e) => setPlan({ ...plan, purpose: e.target.value })}
                  placeholder="IATF 16949 요구사항 적합성 확인 및 품질경영시스템의 효과적 실행 검증"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>심사범위 *</Label>
                <Textarea
                  value={plan.scope}
                  onChange={(e) => setPlan({ ...plan, scope: e.target.value })}
                  placeholder="품질경영시스템 전 프로세스 (영업, 설계, 구매, 생산, 품질, 출하)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>심사기준 (IATF 16949 조항)</Label>
                <Select value={plan.criteria} onValueChange={(v) => setPlan({ ...plan, criteria: v })}>
                  <SelectTrigger><SelectValue placeholder="조항 선택" /></SelectTrigger>
                  <SelectContent>
                    {iatfClauses.map((clause) => (
                      <SelectItem key={clause} value={clause}>{clause}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  value={plan.criteria}
                  onChange={(e) => setPlan({ ...plan, criteria: e.target.value })}
                  placeholder="또는 직접 입력: IATF 16949:2016 전 조항, 고객특정요구사항(CSR), 내부규정"
                  rows={2}
                  className="mt-2"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>심사팀 리더 *</Label>
                  <Input
                    value={plan.teamLeader}
                    onChange={(e) => setPlan({ ...plan, teamLeader: e.target.value })}
                    placeholder="홍길동 (품질보증팀 과장)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>심사원</Label>
                  <Input
                    value={plan.auditors}
                    onChange={(e) => setPlan({ ...plan, auditors: e.target.value })}
                    placeholder="김철수, 이영희"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>심사결론 / 종합의견</Label>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="심사 결과에 대한 종합적인 의견을 기술하세요."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Checklist */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>심사 체크리스트</CardTitle>
              <Button onClick={addChecklistItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                항목 추가
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-sm font-medium text-muted-foreground">항목 #{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChecklistItem(item.id)}
                        disabled={checklist.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>조항번호</Label>
                          <Select
                            value={item.clauseNumber}
                            onValueChange={(v) => updateChecklistItem(item.id, "clauseNumber", v)}
                          >
                            <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                            <SelectContent>
                              {iatfClauses.map((clause) => (
                                <SelectItem key={clause} value={clause.split(" ")[0]}>{clause}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>심사항목</Label>
                          <Input
                            value={item.auditItem}
                            onChange={(e) => updateChecklistItem(item.id, "auditItem", e.target.value)}
                            placeholder="문서관리"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>적합여부</Label>
                          <Select
                            value={item.conformity}
                            onValueChange={(v) => updateChecklistItem(item.id, "conformity", v)}
                          >
                            <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="적합">적합 (C)</SelectItem>
                              <SelectItem value="부적합-Major">부적합-Major (NC)</SelectItem>
                              <SelectItem value="부적합-Minor">부적합-Minor (nc)</SelectItem>
                              <SelectItem value="관찰사항">관찰사항 (OBS)</SelectItem>
                              <SelectItem value="해당없음">해당없음 (N/A)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>심사질문</Label>
                        <Textarea
                          value={item.auditQuestion}
                          onChange={(e) => updateChecklistItem(item.id, "auditQuestion", e.target.value)}
                          placeholder="문서화된 정보의 작성, 검토, 승인 절차가 규정되어 있습니까?"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>객관적 증거</Label>
                        <Textarea
                          value={item.evidence}
                          onChange={(e) => updateChecklistItem(item.id, "evidence", e.target.value)}
                          placeholder="문서관리규정(QP-001) 확인, 최신본 관리대장 검토, 현장 비치문서 확인"
                          rows={2}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Checklist Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">체크리스트 요약</h4>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">전체: </span>
                    <span className="font-medium">{checklist.length}</span>
                  </div>
                  <div>
                    <span className="text-green-600">적합: </span>
                    <span className="font-medium">{checklist.filter((c) => c.conformity === "적합").length}</span>
                  </div>
                  <div>
                    <span className="text-red-600">Major NC: </span>
                    <span className="font-medium">{checklist.filter((c) => c.conformity === "부적합-Major").length}</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Minor NC: </span>
                    <span className="font-medium">{checklist.filter((c) => c.conformity === "부적합-Minor").length}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">OBS: </span>
                    <span className="font-medium">{checklist.filter((c) => c.conformity === "관찰사항").length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Nonconformity Management */}
        <TabsContent value="nonconformity">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>부적합 관리</CardTitle>
              <Button onClick={addNonconformity} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                부적합 추가
              </Button>
            </CardHeader>
            <CardContent>
              {nonconformities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>등록된 부적합사항이 없습니다.</p>
                  <p className="text-sm">체크리스트에서 부적합 판정된 항목을 등록하세요.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nonconformities.map((nc, index) => (
                    <Card key={nc.id} className="p-4 border-l-4 border-l-red-500">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium">부적합 #{index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNonconformity(nc.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>부적합 내용 *</Label>
                          <Textarea
                            value={nc.description}
                            onChange={(e) => updateNonconformity(nc.id, "description", e.target.value)}
                            placeholder="7.5.3 문서화된 정보의 관리 - 외부출처 문서의 최신본 관리가 미흡함. 고객사양서 Rev.C가 현장에 비치되어 있으나 최신본은 Rev.E임."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>시정조치 요구</Label>
                          <Textarea
                            value={nc.correctiveAction}
                            onChange={(e) => updateNonconformity(nc.id, "correctiveAction", e.target.value)}
                            placeholder="1. 외부출처 문서 목록 재검토 및 최신본 확인&#10;2. 구버전 문서 회수 및 폐기&#10;3. 문서관리 담당자 교육 실시"
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>완료기한</Label>
                            <Input
                              type="date"
                              value={nc.dueDate}
                              onChange={(e) => updateNonconformity(nc.id, "dueDate", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>상태</Label>
                            <Select
                              value={nc.status}
                              onValueChange={(v) => updateNonconformity(nc.id, "status", v)}
                            >
                              <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">미완료</SelectItem>
                                <SelectItem value="in-progress">진행중</SelectItem>
                                <SelectItem value="completed">완료</SelectItem>
                                <SelectItem value="verified">검증완료</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* NC Summary */}
              {nonconformities.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">부적합 현황</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">전체: </span>
                      <span className="font-medium">{nonconformities.length}</span>
                    </div>
                    <div>
                      <span className="text-red-600">미완료: </span>
                      <span className="font-medium">{nonconformities.filter((nc) => nc.status === "open").length}</span>
                    </div>
                    <div>
                      <span className="text-yellow-600">진행중: </span>
                      <span className="font-medium">{nonconformities.filter((nc) => nc.status === "in-progress").length}</span>
                    </div>
                    <div>
                      <span className="text-green-600">완료: </span>
                      <span className="font-medium">{nonconformities.filter((nc) => nc.status === "completed" || nc.status === "verified").length}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Audit History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                심사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>심사번호</TableHead>
                    <TableHead>심사일자</TableHead>
                    <TableHead>심사유형</TableHead>
                    <TableHead>수검부서</TableHead>
                    <TableHead className="text-center">부적합 건수</TableHead>
                    <TableHead>결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono">{record.auditNumber}</TableCell>
                      <TableCell>{record.auditDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.auditType}</Badge>
                      </TableCell>
                      <TableCell>{record.department}</TableCell>
                      <TableCell className="text-center">
                        <span className={record.ncCount > 0 ? "text-red-600 font-semibold" : ""}>
                          {record.ncCount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.result === "적합" ? "default" :
                            record.result === "조건부적합" ? "secondary" : "destructive"
                          }
                          className={
                            record.result === "적합" ? "bg-green-100 text-green-800" :
                            record.result === "조건부적합" ? "bg-yellow-100 text-yellow-800" : ""
                          }
                        >
                          {record.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* History Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">연간 심사 현황</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 심사: </span>
                    <span className="font-medium">{history.length}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">적합: </span>
                    <span className="font-medium">{history.filter((h) => h.result === "적합").length}건</span>
                  </div>
                  <div>
                    <span className="text-yellow-600">조건부적합: </span>
                    <span className="font-medium">{history.filter((h) => h.result === "조건부적합").length}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">부적합: </span>
                    <span className="font-medium">{history.filter((h) => h.result === "부적합").length}건</span>
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
