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
import { Plus, Save, Search, FileText, CheckCircle, AlertTriangle, History, ClipboardList } from "lucide-react";

// Types
interface SIIAOBItem {
  id: number;
  siIaobNo: string;
  issueDate: string;
  titleSummary: string;
  relatedClause: string;
  applicationStatus: "applied" | "reviewing" | "notApplicable";
}

interface ApplicationRecord {
  id: number;
  siIaobNo: string;
  targetDocument: string;
  applicationDate: string;
  responsiblePerson: string;
  remarks: string;
}

interface ImpactAnalysis {
  id: number;
  siIaobNo: string;
  affectedProcess: string;
  impactLevel: "high" | "medium" | "low";
  requiredAction: string;
  riskAssessment: string;
  mitigationPlan: string;
}

interface ImplementationHistory {
  id: number;
  siIaobNo: string;
  actionDate: string;
  actionType: string;
  performer: string;
  description: string;
  result: string;
}

export default function IATFSIIAOBChecklistPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");

  // Tab 1: SI/IAOB List
  const [siIaobItems, setSiIaobItems] = useState<SIIAOBItem[]>([]);
  const [showSIForm, setShowSIForm] = useState(false);
  const [siFormData, setSiFormData] = useState({
    siIaobNo: "",
    issueDate: new Date().toISOString().split("T")[0],
    titleSummary: "",
    relatedClause: "",
    applicationStatus: "" as "" | "applied" | "reviewing" | "notApplicable",
  });

  // Tab 2: Application Status
  const [applicationRecords, setApplicationRecords] = useState<ApplicationRecord[]>([]);
  const [showAppForm, setShowAppForm] = useState(false);
  const [appFormData, setAppFormData] = useState({
    siIaobNo: "",
    targetDocument: "",
    applicationDate: new Date().toISOString().split("T")[0],
    responsiblePerson: "",
    remarks: "",
  });

  // Tab 3: Impact Analysis
  const [impactAnalyses, setImpactAnalyses] = useState<ImpactAnalysis[]>([]);
  const [showImpactForm, setShowImpactForm] = useState(false);
  const [impactFormData, setImpactFormData] = useState({
    siIaobNo: "",
    affectedProcess: "",
    impactLevel: "" as "" | "high" | "medium" | "low",
    requiredAction: "",
    riskAssessment: "",
    mitigationPlan: "",
  });

  // Tab 4: Implementation History
  const [implementationHistory, setImplementationHistory] = useState<ImplementationHistory[]>([]);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [historyFormData, setHistoryFormData] = useState({
    siIaobNo: "",
    actionDate: new Date().toISOString().split("T")[0],
    actionType: "",
    performer: "",
    description: "",
    result: "",
  });

  // Status helpers
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "applied":
        return "success";
      case "reviewing":
        return "warning";
      case "notApplicable":
        return "default";
      default:
        return "outline";
    }
  };

  const statusLabels: Record<string, string> = {
    applied: "적용완료",
    reviewing: "검토중",
    notApplicable: "해당없음",
  };

  const impactLevelLabels: Record<string, string> = {
    high: "상",
    medium: "중",
    low: "하",
  };

  const getImpactBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "outline";
    }
  };

  // Tab 1: SI/IAOB List Handlers
  const handleSISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siFormData.applicationStatus) {
      alert("적용상태를 선택해주세요.");
      return;
    }
    const newItem: SIIAOBItem = {
      id: Date.now(),
      siIaobNo: siFormData.siIaobNo,
      issueDate: siFormData.issueDate,
      titleSummary: siFormData.titleSummary,
      relatedClause: siFormData.relatedClause,
      applicationStatus: siFormData.applicationStatus,
    };
    setSiIaobItems([newItem, ...siIaobItems]);
    setShowSIForm(false);
    setSiFormData({
      siIaobNo: "",
      issueDate: new Date().toISOString().split("T")[0],
      titleSummary: "",
      relatedClause: "",
      applicationStatus: "",
    });
    alert("SI/IAOB가 등록되었습니다.");
  };

  // Tab 2: Application Status Handlers
  const handleAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ApplicationRecord = {
      id: Date.now(),
      ...appFormData,
    };
    setApplicationRecords([newRecord, ...applicationRecords]);
    setShowAppForm(false);
    setAppFormData({
      siIaobNo: "",
      targetDocument: "",
      applicationDate: new Date().toISOString().split("T")[0],
      responsiblePerson: "",
      remarks: "",
    });
    alert("적용 현황이 등록되었습니다.");
  };

  // Tab 3: Impact Analysis Handlers
  const handleImpactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impactFormData.impactLevel) {
      alert("영향도를 선택해주세요.");
      return;
    }
    const newAnalysis: ImpactAnalysis = {
      id: Date.now(),
      siIaobNo: impactFormData.siIaobNo,
      affectedProcess: impactFormData.affectedProcess,
      impactLevel: impactFormData.impactLevel,
      requiredAction: impactFormData.requiredAction,
      riskAssessment: impactFormData.riskAssessment,
      mitigationPlan: impactFormData.mitigationPlan,
    };
    setImpactAnalyses([newAnalysis, ...impactAnalyses]);
    setShowImpactForm(false);
    setImpactFormData({
      siIaobNo: "",
      affectedProcess: "",
      impactLevel: "",
      requiredAction: "",
      riskAssessment: "",
      mitigationPlan: "",
    });
    alert("영향 분석이 등록되었습니다.");
  };

  // Tab 4: Implementation History Handlers
  const handleHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHistory: ImplementationHistory = {
      id: Date.now(),
      ...historyFormData,
    };
    setImplementationHistory([newHistory, ...implementationHistory]);
    setShowHistoryForm(false);
    setHistoryFormData({
      siIaobNo: "",
      actionDate: new Date().toISOString().split("T")[0],
      actionType: "",
      performer: "",
      description: "",
      result: "",
    });
    alert("이행 이력이 등록되었습니다.");
  };

  // Filter functions
  const filteredSIItems = siIaobItems.filter(
    (item) =>
      item.siIaobNo.toLowerCase().includes(search.toLowerCase()) ||
      item.titleSummary.toLowerCase().includes(search.toLowerCase()) ||
      item.relatedClause.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAppRecords = applicationRecords.filter(
    (record) =>
      record.siIaobNo.toLowerCase().includes(search.toLowerCase()) ||
      record.targetDocument.toLowerCase().includes(search.toLowerCase()) ||
      record.responsiblePerson.toLowerCase().includes(search.toLowerCase())
  );

  const filteredImpactAnalyses = impactAnalyses.filter(
    (analysis) =>
      analysis.siIaobNo.toLowerCase().includes(search.toLowerCase()) ||
      analysis.affectedProcess.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHistory = implementationHistory.filter(
    (history) =>
      history.siIaobNo.toLowerCase().includes(search.toLowerCase()) ||
      history.performer.toLowerCase().includes(search.toLowerCase()) ||
      history.actionType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IATF SIs, IAOB letter 반영 Checklist</h1>
          <p className="text-muted-foreground">IATF 16949 공인해석(SIs) 및 IAOB letter 적용 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">
            <ClipboardList className="mr-2 h-4 w-4" />
            SI/IAOB 목록
          </TabsTrigger>
          <TabsTrigger value="application">
            <CheckCircle className="mr-2 h-4 w-4" />
            적용 현황
          </TabsTrigger>
          <TabsTrigger value="impact">
            <AlertTriangle className="mr-2 h-4 w-4" />
            변경 영향 분석
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            이행 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: SI/IAOB List */}
        <TabsContent value="list" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SI/IAOB 번호, 제목, 관련 조항으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowSIForm(!showSIForm)}>
              <Plus className="mr-2 h-4 w-4" />
              SI/IAOB 등록
            </Button>
          </div>

          {showSIForm && (
            <Card>
              <CardHeader>
                <CardTitle>SI/IAOB 등록</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSISubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>SI/IAOB 번호 *</Label>
                      <Input
                        value={siFormData.siIaobNo}
                        onChange={(e) => setSiFormData({ ...siFormData, siIaobNo: e.target.value })}
                        placeholder="SI-2024-001 또는 IAOB-2024-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>발행일 *</Label>
                      <Input
                        type="date"
                        value={siFormData.issueDate}
                        onChange={(e) => setSiFormData({ ...siFormData, issueDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>관련 조항 *</Label>
                      <Input
                        value={siFormData.relatedClause}
                        onChange={(e) => setSiFormData({ ...siFormData, relatedClause: e.target.value })}
                        placeholder="예: 8.5.1.1, 9.1.1.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>제목/내용 요약 *</Label>
                    <Textarea
                      value={siFormData.titleSummary}
                      onChange={(e) => setSiFormData({ ...siFormData, titleSummary: e.target.value })}
                      placeholder="SI/IAOB letter의 제목 및 주요 내용 요약"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>적용상태 *</Label>
                      <Select
                        value={siFormData.applicationStatus}
                        onValueChange={(v) => setSiFormData({ ...siFormData, applicationStatus: v as "applied" | "reviewing" | "notApplicable" })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">적용완료</SelectItem>
                          <SelectItem value="reviewing">검토중</SelectItem>
                          <SelectItem value="notApplicable">해당없음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowSIForm(false)}>취소</Button>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                SI/IAOB 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSIItems.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 SI/IAOB가 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SI/IAOB 번호</TableHead>
                      <TableHead>발행일</TableHead>
                      <TableHead>제목/내용 요약</TableHead>
                      <TableHead>관련 조항</TableHead>
                      <TableHead>적용상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSIItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.siIaobNo}</TableCell>
                        <TableCell>{item.issueDate}</TableCell>
                        <TableCell className="max-w-md truncate" title={item.titleSummary}>
                          {item.titleSummary}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.relatedClause}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.applicationStatus)}>
                            {statusLabels[item.applicationStatus]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Application Status */}
        <TabsContent value="application" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SI/IAOB 번호, 문서명, 담당자로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowAppForm(!showAppForm)}>
              <Plus className="mr-2 h-4 w-4" />
              적용 현황 등록
            </Button>
          </div>

          {showAppForm && (
            <Card>
              <CardHeader>
                <CardTitle>적용 현황 등록</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAppSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>SI/IAOB 번호 *</Label>
                      <Input
                        value={appFormData.siIaobNo}
                        onChange={(e) => setAppFormData({ ...appFormData, siIaobNo: e.target.value })}
                        placeholder="SI-2024-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>적용대상 문서 *</Label>
                      <Input
                        value={appFormData.targetDocument}
                        onChange={(e) => setAppFormData({ ...appFormData, targetDocument: e.target.value })}
                        placeholder="품질매뉴얼, 절차서 등"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>적용일 *</Label>
                      <Input
                        type="date"
                        value={appFormData.applicationDate}
                        onChange={(e) => setAppFormData({ ...appFormData, applicationDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>담당자 *</Label>
                      <Input
                        value={appFormData.responsiblePerson}
                        onChange={(e) => setAppFormData({ ...appFormData, responsiblePerson: e.target.value })}
                        placeholder="홍길동"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Textarea
                      value={appFormData.remarks}
                      onChange={(e) => setAppFormData({ ...appFormData, remarks: e.target.value })}
                      placeholder="추가 메모 및 설명"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowAppForm(false)}>취소</Button>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                적용 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAppRecords.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 적용 현황이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SI/IAOB 번호</TableHead>
                      <TableHead>적용대상 문서</TableHead>
                      <TableHead>적용일</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.siIaobNo}</TableCell>
                        <TableCell>{record.targetDocument}</TableCell>
                        <TableCell>{record.applicationDate}</TableCell>
                        <TableCell>{record.responsiblePerson}</TableCell>
                        <TableCell className="max-w-xs truncate" title={record.remarks}>
                          {record.remarks || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Impact Analysis */}
        <TabsContent value="impact" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SI/IAOB 번호, 영향 프로세스로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowImpactForm(!showImpactForm)}>
              <Plus className="mr-2 h-4 w-4" />
              영향 분석 등록
            </Button>
          </div>

          {showImpactForm && (
            <Card>
              <CardHeader>
                <CardTitle>변경 영향 분석 등록</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleImpactSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>SI/IAOB 번호 *</Label>
                      <Input
                        value={impactFormData.siIaobNo}
                        onChange={(e) => setImpactFormData({ ...impactFormData, siIaobNo: e.target.value })}
                        placeholder="SI-2024-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>영향 프로세스 *</Label>
                      <Input
                        value={impactFormData.affectedProcess}
                        onChange={(e) => setImpactFormData({ ...impactFormData, affectedProcess: e.target.value })}
                        placeholder="생산, 품질검사, 설계 등"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>영향도 *</Label>
                      <Select
                        value={impactFormData.impactLevel}
                        onValueChange={(v) => setImpactFormData({ ...impactFormData, impactLevel: v as "high" | "medium" | "low" })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">상 (High)</SelectItem>
                          <SelectItem value="medium">중 (Medium)</SelectItem>
                          <SelectItem value="low">하 (Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>필요 조치사항 *</Label>
                    <Textarea
                      value={impactFormData.requiredAction}
                      onChange={(e) => setImpactFormData({ ...impactFormData, requiredAction: e.target.value })}
                      placeholder="변경으로 인해 필요한 조치사항 기술"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>위험 평가</Label>
                      <Textarea
                        value={impactFormData.riskAssessment}
                        onChange={(e) => setImpactFormData({ ...impactFormData, riskAssessment: e.target.value })}
                        placeholder="관련 위험 요소 평가"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>위험 완화 계획</Label>
                      <Textarea
                        value={impactFormData.mitigationPlan}
                        onChange={(e) => setImpactFormData({ ...impactFormData, mitigationPlan: e.target.value })}
                        placeholder="위험 완화를 위한 대책"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowImpactForm(false)}>취소</Button>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                변경 영향 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredImpactAnalyses.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 영향 분석이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SI/IAOB 번호</TableHead>
                      <TableHead>영향 프로세스</TableHead>
                      <TableHead>영향도</TableHead>
                      <TableHead>필요 조치사항</TableHead>
                      <TableHead>위험 평가</TableHead>
                      <TableHead>완화 계획</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredImpactAnalyses.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell className="font-mono">{analysis.siIaobNo}</TableCell>
                        <TableCell>{analysis.affectedProcess}</TableCell>
                        <TableCell>
                          <Badge variant={getImpactBadgeVariant(analysis.impactLevel)}>
                            {impactLevelLabels[analysis.impactLevel]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={analysis.requiredAction}>
                          {analysis.requiredAction}
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={analysis.riskAssessment}>
                          {analysis.riskAssessment || "-"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={analysis.mitigationPlan}>
                          {analysis.mitigationPlan || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Implementation History */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SI/IAOB 번호, 수행자, 작업유형으로 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowHistoryForm(!showHistoryForm)}>
              <Plus className="mr-2 h-4 w-4" />
              이행 이력 등록
            </Button>
          </div>

          {showHistoryForm && (
            <Card>
              <CardHeader>
                <CardTitle>이행 이력 등록</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHistorySubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>SI/IAOB 번호 *</Label>
                      <Input
                        value={historyFormData.siIaobNo}
                        onChange={(e) => setHistoryFormData({ ...historyFormData, siIaobNo: e.target.value })}
                        placeholder="SI-2024-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>작업일자 *</Label>
                      <Input
                        type="date"
                        value={historyFormData.actionDate}
                        onChange={(e) => setHistoryFormData({ ...historyFormData, actionDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>작업유형 *</Label>
                      <Select
                        value={historyFormData.actionType}
                        onValueChange={(v) => setHistoryFormData({ ...historyFormData, actionType: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="검토">검토</SelectItem>
                          <SelectItem value="문서개정">문서개정</SelectItem>
                          <SelectItem value="교육">교육</SelectItem>
                          <SelectItem value="적용확인">적용확인</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>수행자 *</Label>
                      <Input
                        value={historyFormData.performer}
                        onChange={(e) => setHistoryFormData({ ...historyFormData, performer: e.target.value })}
                        placeholder="홍길동"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>작업 내용 *</Label>
                      <Textarea
                        value={historyFormData.description}
                        onChange={(e) => setHistoryFormData({ ...historyFormData, description: e.target.value })}
                        placeholder="수행한 작업 내용 상세 기술"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>결과</Label>
                      <Textarea
                        value={historyFormData.result}
                        onChange={(e) => setHistoryFormData({ ...historyFormData, result: e.target.value })}
                        placeholder="작업 결과 및 후속조치"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowHistoryForm(false)}>취소</Button>
                    <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                이행 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredHistory.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 이행 이력이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SI/IAOB 번호</TableHead>
                      <TableHead>작업일자</TableHead>
                      <TableHead>작업유형</TableHead>
                      <TableHead>수행자</TableHead>
                      <TableHead>작업 내용</TableHead>
                      <TableHead>결과</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="font-mono">{history.siIaobNo}</TableCell>
                        <TableCell>{history.actionDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{history.actionType}</Badge>
                        </TableCell>
                        <TableCell>{history.performer}</TableCell>
                        <TableCell className="max-w-xs truncate" title={history.description}>
                          {history.description}
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={history.result}>
                          {history.result || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
