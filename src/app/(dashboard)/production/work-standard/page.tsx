"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ListOrdered,
  ClipboardCheck,
  History,
  Plus,
  Save,
  Trash2,
  Upload,
  Image,
  FileImage,
} from "lucide-react";

// Types
interface HeaderInfo {
  documentNumber: string; // 문서번호
  revisionNumber: string; // 개정번호
  processName: string; // 공정명
  productName: string; // 제품명
  createdDate: string; // 작성일
  createdBy: string; // 작성자
  approvedBy: string; // 승인자
  approvalDate: string; // 승인일
}

interface WorkStep {
  id: number;
  stepNumber: number; // 순번
  workContent: string; // 작업내용 (상세 설명)
  workTips: string; // 작업요령 (작업 포인트)
  qualityStandard: string; // 품질기준
  toolsEquipment: string; // 사용공구/장비
  cautions: string; // 주의사항
  workPhoto: string; // 작업사진 URL/path
  drawing: string; // 도면 URL/path
}

interface InspectionCriteria {
  id: number;
  inspectionItem: string; // 검사항목
  inspectionMethod: string; // 검사방법
  standard: string; // 기준
  tolerance: string; // 허용공차
  equipment: string; // 측정장비
  frequency: string; // 검사주기
  responsible: string; // 담당자
}

interface RevisionHistory {
  id: number;
  revisionNumber: string; // 개정번호
  revisionDate: string; // 개정일
  revisionContent: string; // 개정내용
  revisedBy: string; // 개정자
  approvedBy: string; // 승인자
}

export default function WorkStandardPage() {
  const [activeTab, setActiveTab] = useState("basic-info");

  // Header Info State
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    documentNumber: "",
    revisionNumber: "",
    processName: "",
    productName: "",
    createdDate: "",
    createdBy: "",
    approvedBy: "",
    approvalDate: "",
  });

  // Work Steps State
  const [workSteps, setWorkSteps] = useState<WorkStep[]>([]);

  // Inspection Criteria State
  const [inspectionCriteria, setInspectionCriteria] = useState<InspectionCriteria[]>([]);

  // Revision History State
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistory[]>([]);

  // Work Steps Functions
  const addWorkStep = () => {
    const newStep: WorkStep = {
      id: Date.now(),
      stepNumber: workSteps.length + 1,
      workContent: "",
      workTips: "",
      qualityStandard: "",
      toolsEquipment: "",
      cautions: "",
      workPhoto: "",
      drawing: "",
    };
    setWorkSteps([...workSteps, newStep]);
  };

  const removeWorkStep = (id: number) => {
    const filteredSteps = workSteps.filter((step) => step.id !== id);
    // Renumber steps
    const renumberedSteps = filteredSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));
    setWorkSteps(renumberedSteps);
  };

  const updateWorkStep = (id: number, field: keyof WorkStep, value: string | number) => {
    setWorkSteps(
      workSteps.map((step) => {
        if (step.id === id) {
          return { ...step, [field]: value };
        }
        return step;
      })
    );
  };

  // Inspection Criteria Functions
  const addInspectionCriteria = () => {
    const newCriteria: InspectionCriteria = {
      id: Date.now(),
      inspectionItem: "",
      inspectionMethod: "",
      standard: "",
      tolerance: "",
      equipment: "",
      frequency: "",
      responsible: "",
    };
    setInspectionCriteria([...inspectionCriteria, newCriteria]);
  };

  const removeInspectionCriteria = (id: number) => {
    setInspectionCriteria(inspectionCriteria.filter((item) => item.id !== id));
  };

  const updateInspectionCriteria = (id: number, field: keyof InspectionCriteria, value: string) => {
    setInspectionCriteria(
      inspectionCriteria.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Revision History Functions
  const addRevisionHistory = () => {
    const newRevision: RevisionHistory = {
      id: Date.now(),
      revisionNumber: "",
      revisionDate: "",
      revisionContent: "",
      revisedBy: "",
      approvedBy: "",
    };
    setRevisionHistory([...revisionHistory, newRevision]);
  };

  const removeRevisionHistory = (id: number) => {
    setRevisionHistory(revisionHistory.filter((item) => item.id !== id));
  };

  const updateRevisionHistory = (id: number, field: keyof RevisionHistory, value: string) => {
    setRevisionHistory(
      revisionHistory.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Save handler
  const handleSave = () => {
    const data = {
      headerInfo,
      workSteps,
      inspectionCriteria,
      revisionHistory,
    };
    console.log("Saving Work Standard:", data);
    alert("작업표준서가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            작업표준서
          </h1>
          <p className="text-muted-foreground">Work Instruction / Standard Operating Procedure</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">
            <FileText className="mr-2 h-4 w-4" />
            1. 기본정보
          </TabsTrigger>
          <TabsTrigger value="work-sequence">
            <ListOrdered className="mr-2 h-4 w-4" />
            2. 작업순서
          </TabsTrigger>
          <TabsTrigger value="inspection">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            3. 검사기준
          </TabsTrigger>
          <TabsTrigger value="revision-history">
            <History className="mr-2 h-4 w-4" />
            4. 변경이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information (기본정보) */}
        <TabsContent value="basic-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>문서 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>문서번호 *</Label>
                  <Input
                    value={headerInfo.documentNumber}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, documentNumber: e.target.value })}
                    placeholder="WI-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>개정번호 *</Label>
                  <Input
                    value={headerInfo.revisionNumber}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, revisionNumber: e.target.value })}
                    placeholder="Rev.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>작성일 *</Label>
                  <Input
                    type="date"
                    value={headerInfo.createdDate}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, createdDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인일</Label>
                  <Input
                    type="date"
                    value={headerInfo.approvalDate}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, approvalDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>공정명 *</Label>
                  <Input
                    value={headerInfo.processName}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, processName: e.target.value })}
                    placeholder="공정명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>제품명 *</Label>
                  <Input
                    value={headerInfo.productName}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, productName: e.target.value })}
                    placeholder="제품명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>작성자</Label>
                  <Input
                    value={headerInfo.createdBy}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, createdBy: e.target.value })}
                    placeholder="작성자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인자</Label>
                  <Input
                    value={headerInfo.approvedBy}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, approvedBy: e.target.value })}
                    placeholder="승인자명"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>작업표준서 개요</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">문서 구성</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>1. 기본정보: 문서번호, 공정, 제품, 작성/승인 정보</p>
                    <p>2. 작업순서: 단계별 작업내용, 요령, 품질기준</p>
                    <p>3. 검사기준: 검사항목, 방법, 기준, 허용공차</p>
                    <p>4. 변경이력: 개정번호, 개정내용, 승인이력</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">작성 지침</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>- 작업순서는 실제 작업 흐름에 맞게 기술</p>
                    <p>- 품질기준은 구체적인 수치로 명시</p>
                    <p>- 주의사항은 안전/품질 관련 중요사항 포함</p>
                    <p>- 첨부 사진/도면은 이해를 돕는 자료 추가</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Work Sequence (작업순서) */}
        <TabsContent value="work-sequence" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>작업순서</CardTitle>
              <Button onClick={addWorkStep}>
                <Plus className="mr-2 h-4 w-4" />
                작업단계 추가
              </Button>
            </CardHeader>
            <CardContent>
              {workSteps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ListOrdered className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 작업단계가 없습니다.</p>
                  <p className="text-sm">작업단계 추가 버튼을 클릭하여 작업순서를 입력하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {workSteps.map((step) => (
                    <Card key={step.id} className="border-2">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-lg px-3 py-1">
                              {step.stepNumber}
                            </Badge>
                            <span className="font-semibold">작업단계 {step.stepNumber}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWorkStep(step.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>작업내용 (상세 설명) *</Label>
                            <Textarea
                              value={step.workContent}
                              onChange={(e) => updateWorkStep(step.id, "workContent", e.target.value)}
                              placeholder="이 단계에서 수행하는 작업의 상세 내용을 기술하세요."
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>작업요령 (작업 포인트)</Label>
                            <Textarea
                              value={step.workTips}
                              onChange={(e) => updateWorkStep(step.id, "workTips", e.target.value)}
                              placeholder="작업 시 핵심 포인트, 노하우를 기술하세요."
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>품질기준</Label>
                            <Input
                              value={step.qualityStandard}
                              onChange={(e) => updateWorkStep(step.id, "qualityStandard", e.target.value)}
                              placeholder="예: 외관 이상 없음, 치수 +/-0.1mm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>사용공구/장비</Label>
                            <Input
                              value={step.toolsEquipment}
                              onChange={(e) => updateWorkStep(step.id, "toolsEquipment", e.target.value)}
                              placeholder="예: 토크렌치, 버니어캘리퍼스"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>주의사항</Label>
                            <Input
                              value={step.cautions}
                              onChange={(e) => updateWorkStep(step.id, "cautions", e.target.value)}
                              placeholder="안전/품질 관련 주의사항"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              작업사진
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                value={step.workPhoto}
                                onChange={(e) => updateWorkStep(step.id, "workPhoto", e.target.value)}
                                placeholder="사진 경로 또는 URL"
                                className="flex-1"
                              />
                              <Button variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <FileImage className="h-4 w-4" />
                              도면
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                value={step.drawing}
                                onChange={(e) => updateWorkStep(step.id, "drawing", e.target.value)}
                                placeholder="도면 경로 또는 URL"
                                className="flex-1"
                              />
                              <Button variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Inspection Criteria (검사기준) */}
        <TabsContent value="inspection" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>검사기준</CardTitle>
              <Button onClick={addInspectionCriteria}>
                <Plus className="mr-2 h-4 w-4" />
                검사항목 추가
              </Button>
            </CardHeader>
            <CardContent>
              {inspectionCriteria.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 검사항목이 없습니다.</p>
                  <p className="text-sm">검사항목 추가 버튼을 클릭하여 검사기준을 입력하세요.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">검사항목</TableHead>
                        <TableHead className="min-w-[120px]">검사방법</TableHead>
                        <TableHead className="min-w-[100px]">기준</TableHead>
                        <TableHead className="min-w-[100px]">허용공차</TableHead>
                        <TableHead className="min-w-[120px]">측정장비</TableHead>
                        <TableHead className="min-w-[100px]">검사주기</TableHead>
                        <TableHead className="min-w-[80px]">담당자</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectionCriteria.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.inspectionItem}
                              onChange={(e) => updateInspectionCriteria(item.id, "inspectionItem", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="검사항목"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.inspectionMethod}
                              onChange={(e) => updateInspectionCriteria(item.id, "inspectionMethod", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="검사방법"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.standard}
                              onChange={(e) => updateInspectionCriteria(item.id, "standard", e.target.value)}
                              className="h-8 min-w-[80px]"
                              placeholder="기준값"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.tolerance}
                              onChange={(e) => updateInspectionCriteria(item.id, "tolerance", e.target.value)}
                              className="h-8 min-w-[80px]"
                              placeholder="+/-0.1"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.equipment}
                              onChange={(e) => updateInspectionCriteria(item.id, "equipment", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="측정장비"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.frequency}
                              onChange={(e) => updateInspectionCriteria(item.id, "frequency", e.target.value)}
                              className="h-8 min-w-[80px]"
                              placeholder="매회/시간당"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.responsible}
                              onChange={(e) => updateInspectionCriteria(item.id, "responsible", e.target.value)}
                              className="h-8 min-w-[60px]"
                              placeholder="담당자"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInspectionCriteria(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>검사기준 작성 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">검사항목 예시</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>- 외관검사 (스크래치, 찍힘)</p>
                    <p>- 치수검사 (길이, 폭, 두께)</p>
                    <p>- 기능검사 (작동, 토크)</p>
                    <p>- 재질검사 (경도, 성분)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">검사방법 예시</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>- 육안검사</p>
                    <p>- 계측기 측정</p>
                    <p>- 게이지 검사</p>
                    <p>- 샘플링 검사</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">검사주기 예시</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>- 전수검사</p>
                    <p>- 초/중/종물</p>
                    <p>- 시간당 n개</p>
                    <p>- 로트별</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Revision History (변경이력) */}
        <TabsContent value="revision-history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>변경이력</CardTitle>
              <Button onClick={addRevisionHistory}>
                <Plus className="mr-2 h-4 w-4" />
                이력 추가
              </Button>
            </CardHeader>
            <CardContent>
              {revisionHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 변경이력이 없습니다.</p>
                  <p className="text-sm">이력 추가 버튼을 클릭하여 변경이력을 입력하세요.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">개정번호</TableHead>
                        <TableHead className="min-w-[120px]">개정일</TableHead>
                        <TableHead className="min-w-[250px]">개정내용</TableHead>
                        <TableHead className="min-w-[100px]">개정자</TableHead>
                        <TableHead className="min-w-[100px]">승인자</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revisionHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.revisionNumber}
                              onChange={(e) => updateRevisionHistory(item.id, "revisionNumber", e.target.value)}
                              className="h-8 min-w-[80px]"
                              placeholder="Rev.01"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={item.revisionDate}
                              onChange={(e) => updateRevisionHistory(item.id, "revisionDate", e.target.value)}
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              value={item.revisionContent}
                              onChange={(e) => updateRevisionHistory(item.id, "revisionContent", e.target.value)}
                              className="min-h-[60px] min-w-[200px]"
                              placeholder="변경 내용을 상세히 기술하세요."
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.revisedBy}
                              onChange={(e) => updateRevisionHistory(item.id, "revisedBy", e.target.value)}
                              className="h-8 min-w-[80px]"
                              placeholder="개정자"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.approvedBy}
                              onChange={(e) => updateRevisionHistory(item.id, "approvedBy", e.target.value)}
                              className="h-8 min-w-[80px]"
                              placeholder="승인자"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRevisionHistory(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>문서 관리 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">변경 관리 절차</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <span>변경 필요성 검토 및 변경요청서 작성</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <span>변경 영향 분석 및 관련 문서 검토</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span>변경 내용 반영 및 개정번호 부여</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <span>승인 후 현장 교육 및 배포</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">개정 사유 분류</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>- 초도 제정 (신규 문서 작성)</p>
                    <p>- 공정 변경 (설비, 작업방법 변경)</p>
                    <p>- 품질 개선 (불량 감소, 기준 강화)</p>
                    <p>- 안전 강화 (위험요소 추가, 보호구 변경)</p>
                    <p>- 고객 요구 (고객 요청에 의한 변경)</p>
                    <p>- 정기 검토 (연간 정기 검토 반영)</p>
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
