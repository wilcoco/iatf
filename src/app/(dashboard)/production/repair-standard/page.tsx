"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ListOrdered,
  ClipboardList,
  History,
  Plus,
  Save,
  Trash2,
  Upload,
  Image,
  Wrench,
  Search,
  Edit,
  Eye,
  AlertTriangle,
} from "lucide-react";

// Types
interface RepairStandardInfo {
  documentNumber: string; // 문서번호
  vehicleModel: string; // 차종
  processName: string; // 공정명
  processNo: string; // 공정 No
  defectType: string; // 불량유형
  repairMethod: string; // 수리방법 (상세 설명)
  repairCriteria: string; // 수리기준
  toolsEquipment: string; // 사용공구/장비
  createdDate: string; // 작성일
  createdBy: string; // 작성자
  approvedBy: string; // 승인자
  revisionNumber: string; // 개정번호
}

interface RepairProcedureStep {
  id: number;
  stepNumber: number; // 순번
  workContent: string; // 작업내용
  cautions: string; // 주의사항
  photo: string; // 사진첨부 URL/path
}

interface RepairStandardListItem {
  id: number;
  documentNumber: string; // 문서번호
  vehicleModel: string; // 차종
  processName: string; // 공정명
  processNo: string; // 공정 No
  defectType: string; // 불량유형
  status: "active" | "draft" | "obsolete"; // 상태
  revisionNumber: string; // 개정번호
  createdDate: string; // 작성일
  createdBy: string; // 작성자
}

interface RevisionHistoryItem {
  id: number;
  revisionNumber: string; // 개정번호
  revisionDate: string; // 개정일
  revisionContent: string; // 개정내용
  revisedBy: string; // 개정자
  approvedBy: string; // 승인자
}

// Sample data for repair standard list
const initialRepairStandardList: RepairStandardListItem[] = [
  {
    id: 1,
    documentNumber: "RS-2026-001",
    vehicleModel: "PE2",
    processName: "사출",
    processNo: "INJ-001",
    defectType: "외관불량 (스크래치)",
    status: "active",
    revisionNumber: "Rev.02",
    createdDate: "2026-05-10",
    createdBy: "홍길동",
  },
  {
    id: 2,
    documentNumber: "RS-2026-002",
    vehicleModel: "PE2",
    processName: "도장",
    processNo: "PNT-001",
    defectType: "도장불량 (흐름)",
    status: "active",
    revisionNumber: "Rev.01",
    createdDate: "2026-05-15",
    createdBy: "김철수",
  },
  {
    id: 3,
    documentNumber: "RS-2026-003",
    vehicleModel: "HV1",
    processName: "조립",
    processNo: "ASM-001",
    defectType: "조립불량 (유격)",
    status: "draft",
    revisionNumber: "Rev.00",
    createdDate: "2026-06-01",
    createdBy: "이영희",
  },
  {
    id: 4,
    documentNumber: "RS-2026-004",
    vehicleModel: "PE2",
    processName: "사출",
    processNo: "INJ-002",
    defectType: "성형불량 (미성형)",
    status: "active",
    revisionNumber: "Rev.01",
    createdDate: "2026-06-05",
    createdBy: "박민수",
  },
  {
    id: 5,
    documentNumber: "RS-2025-010",
    vehicleModel: "HV1",
    processName: "용접",
    processNo: "WLD-001",
    defectType: "용접불량 (기공)",
    status: "obsolete",
    revisionNumber: "Rev.03",
    createdDate: "2025-08-20",
    createdBy: "최수진",
  },
];

// Sample revision history data
const initialRevisionHistory: RevisionHistoryItem[] = [
  {
    id: 1,
    revisionNumber: "Rev.00",
    revisionDate: "2026-05-10",
    revisionContent: "초도 제정",
    revisedBy: "홍길동",
    approvedBy: "김팀장",
  },
  {
    id: 2,
    revisionNumber: "Rev.01",
    revisionDate: "2026-06-01",
    revisionContent: "수리 절차 3단계 추가, 주의사항 보완",
    revisedBy: "홍길동",
    approvedBy: "김팀장",
  },
  {
    id: 3,
    revisionNumber: "Rev.02",
    revisionDate: "2026-06-08",
    revisionContent: "사용공구 변경 (에어샌더 → 전동샌더)",
    revisedBy: "이영희",
    approvedBy: "김팀장",
  },
];

export default function RepairStandardPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Repair Standard Info State
  const [repairInfo, setRepairInfo] = useState<RepairStandardInfo>({
    documentNumber: "",
    vehicleModel: "",
    processName: "",
    processNo: "",
    defectType: "",
    repairMethod: "",
    repairCriteria: "",
    toolsEquipment: "",
    createdDate: "",
    createdBy: "",
    approvedBy: "",
    revisionNumber: "",
  });

  // Repair Procedure Steps State
  const [procedureSteps, setProcedureSteps] = useState<RepairProcedureStep[]>([]);

  // Repair Standard List State
  const [repairStandardList, setRepairStandardList] = useState<RepairStandardListItem[]>(initialRepairStandardList);

  // Search filter state
  const [searchFilter, setSearchFilter] = useState({
    vehicleModel: "",
    processName: "",
    defectType: "",
    status: "",
  });

  // Revision History State
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>(initialRevisionHistory);

  // Add Procedure Step
  const addProcedureStep = () => {
    const newStep: RepairProcedureStep = {
      id: Date.now(),
      stepNumber: procedureSteps.length + 1,
      workContent: "",
      cautions: "",
      photo: "",
    };
    setProcedureSteps([...procedureSteps, newStep]);
  };

  // Remove Procedure Step
  const removeProcedureStep = (id: number) => {
    const filteredSteps = procedureSteps.filter((step) => step.id !== id);
    const renumberedSteps = filteredSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1,
    }));
    setProcedureSteps(renumberedSteps);
  };

  // Update Procedure Step
  const updateProcedureStep = (id: number, field: keyof RepairProcedureStep, value: string | number) => {
    setProcedureSteps(
      procedureSteps.map((step) => {
        if (step.id === id) {
          return { ...step, [field]: value };
        }
        return step;
      })
    );
  };

  // Add Revision History
  const addRevisionHistory = () => {
    const newRevision: RevisionHistoryItem = {
      id: Date.now(),
      revisionNumber: "",
      revisionDate: "",
      revisionContent: "",
      revisedBy: "",
      approvedBy: "",
    };
    setRevisionHistory([...revisionHistory, newRevision]);
  };

  // Remove Revision History
  const removeRevisionHistory = (id: number) => {
    setRevisionHistory(revisionHistory.filter((item) => item.id !== id));
  };

  // Update Revision History
  const updateRevisionHistory = (id: number, field: keyof RevisionHistoryItem, value: string) => {
    setRevisionHistory(
      revisionHistory.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">사용중</Badge>;
      case "draft":
        return <Badge variant="warning">작성중</Badge>;
      case "obsolete":
        return <Badge variant="outline">폐기</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter repair standard list
  const filteredList = repairStandardList.filter((item) => {
    if (searchFilter.vehicleModel && !item.vehicleModel.toLowerCase().includes(searchFilter.vehicleModel.toLowerCase())) {
      return false;
    }
    if (searchFilter.processName && !item.processName.toLowerCase().includes(searchFilter.processName.toLowerCase())) {
      return false;
    }
    if (searchFilter.defectType && !item.defectType.toLowerCase().includes(searchFilter.defectType.toLowerCase())) {
      return false;
    }
    if (searchFilter.status && item.status !== searchFilter.status) {
      return false;
    }
    return true;
  });

  // Save handler
  const handleSave = () => {
    const data = {
      repairInfo,
      procedureSteps,
      revisionHistory,
    };
    console.log("Saving Repair Standard:", data);
    alert("수리표준서가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8" />
            수리표준서
          </h1>
          <p className="text-muted-foreground">
            차 종 공정 No 수 리 표 준 서 - Repair Standard Document
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            1. 수리표준서 등록
          </TabsTrigger>
          <TabsTrigger value="procedure">
            <ListOrdered className="mr-2 h-4 w-4" />
            2. 수리 절차
          </TabsTrigger>
          <TabsTrigger value="list">
            <ClipboardList className="mr-2 h-4 w-4" />
            3. 수리표준서 목록
          </TabsTrigger>
          <TabsTrigger value="revision-history">
            <History className="mr-2 h-4 w-4" />
            4. 개정 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Repair Standard Registration (수리표준서 등록) */}
        <TabsContent value="registration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>수리표준서 기본정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> 문서정보
                </h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>문서번호 *</Label>
                    <Input
                      value={repairInfo.documentNumber}
                      onChange={(e) => setRepairInfo({ ...repairInfo, documentNumber: e.target.value })}
                      placeholder="RS-2026-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>개정번호</Label>
                    <Input
                      value={repairInfo.revisionNumber}
                      onChange={(e) => setRepairInfo({ ...repairInfo, revisionNumber: e.target.value })}
                      placeholder="Rev.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>작성일 *</Label>
                    <Input
                      type="date"
                      value={repairInfo.createdDate}
                      onChange={(e) => setRepairInfo({ ...repairInfo, createdDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>작성자</Label>
                    <Input
                      value={repairInfo.createdBy}
                      onChange={(e) => setRepairInfo({ ...repairInfo, createdBy: e.target.value })}
                      placeholder="작성자명"
                    />
                  </div>
                </div>
              </div>

              {/* Process Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Wrench className="h-4 w-4" /> 공정정보
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>차종 *</Label>
                    <Input
                      value={repairInfo.vehicleModel}
                      onChange={(e) => setRepairInfo({ ...repairInfo, vehicleModel: e.target.value })}
                      placeholder="PE2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공정명 *</Label>
                    <Input
                      value={repairInfo.processName}
                      onChange={(e) => setRepairInfo({ ...repairInfo, processName: e.target.value })}
                      placeholder="사출, 도장, 조립 등"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공정 No *</Label>
                    <Input
                      value={repairInfo.processNo}
                      onChange={(e) => setRepairInfo({ ...repairInfo, processNo: e.target.value })}
                      placeholder="INJ-001"
                    />
                  </div>
                </div>
              </div>

              {/* Defect & Repair Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> 불량 및 수리정보
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>불량유형 *</Label>
                    <Select
                      value={repairInfo.defectType}
                      onValueChange={(value) => setRepairInfo({ ...repairInfo, defectType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="불량유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="외관불량 (스크래치)">외관불량 (스크래치)</SelectItem>
                        <SelectItem value="외관불량 (찍힘)">외관불량 (찍힘)</SelectItem>
                        <SelectItem value="외관불량 (이물)">외관불량 (이물)</SelectItem>
                        <SelectItem value="도장불량 (흐름)">도장불량 (흐름)</SelectItem>
                        <SelectItem value="도장불량 (기포)">도장불량 (기포)</SelectItem>
                        <SelectItem value="도장불량 (벗겨짐)">도장불량 (벗겨짐)</SelectItem>
                        <SelectItem value="성형불량 (미성형)">성형불량 (미성형)</SelectItem>
                        <SelectItem value="성형불량 (버)">성형불량 (버)</SelectItem>
                        <SelectItem value="성형불량 (웰드라인)">성형불량 (웰드라인)</SelectItem>
                        <SelectItem value="조립불량 (유격)">조립불량 (유격)</SelectItem>
                        <SelectItem value="조립불량 (단차)">조립불량 (단차)</SelectItem>
                        <SelectItem value="용접불량 (기공)">용접불량 (기공)</SelectItem>
                        <SelectItem value="용접불량 (강도부족)">용접불량 (강도부족)</SelectItem>
                        <SelectItem value="치수불량">치수불량</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>사용공구/장비</Label>
                    <Input
                      value={repairInfo.toolsEquipment}
                      onChange={(e) => setRepairInfo({ ...repairInfo, toolsEquipment: e.target.value })}
                      placeholder="전동샌더, 토치, 페인트건 등"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>수리방법 (상세 설명) *</Label>
                  <Textarea
                    value={repairInfo.repairMethod}
                    onChange={(e) => setRepairInfo({ ...repairInfo, repairMethod: e.target.value })}
                    placeholder="불량 수리를 위한 상세 방법을 기술하세요. 예: 스크래치 부위를 샌딩 후 프라이머 도포, 도장 재실시"
                    rows={4}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label>수리기준</Label>
                  <Textarea
                    value={repairInfo.repairCriteria}
                    onChange={(e) => setRepairInfo({ ...repairInfo, repairCriteria: e.target.value })}
                    placeholder="수리 완료 후 합격 기준을 기술하세요. 예: 육안검사 합격, 광택도 80% 이상, 밀착력 4B 이상"
                    rows={3}
                  />
                </div>
              </div>

              {/* Approval Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">결재정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>작성자</Label>
                    <Input
                      value={repairInfo.createdBy}
                      onChange={(e) => setRepairInfo({ ...repairInfo, createdBy: e.target.value })}
                      placeholder="작성자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>승인자</Label>
                    <Input
                      value={repairInfo.approvedBy}
                      onChange={(e) => setRepairInfo({ ...repairInfo, approvedBy: e.target.value })}
                      placeholder="승인자명"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>수리표준서 작성 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">문서 구성</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>1. 수리표준서 등록: 기본정보, 불량유형, 수리방법/기준</p>
                    <p>2. 수리 절차: 단계별 작업내용, 주의사항, 사진</p>
                    <p>3. 수리표준서 목록: 등록된 표준서 조회/검색</p>
                    <p>4. 개정 이력: 변경 내역 관리</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">작성 지침</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>- 불량유형은 정확하게 분류하여 선택</p>
                    <p>- 수리방법은 작업자가 이해하기 쉽게 기술</p>
                    <p>- 수리기준은 구체적인 수치로 명시</p>
                    <p>- 첨부 사진은 각 단계별로 추가</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Repair Procedure (수리 절차) */}
        <TabsContent value="procedure" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>수리 절차</CardTitle>
              <Button onClick={addProcedureStep}>
                <Plus className="mr-2 h-4 w-4" />
                단계 추가
              </Button>
            </CardHeader>
            <CardContent>
              {procedureSteps.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ListOrdered className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 수리 절차가 없습니다.</p>
                  <p className="text-sm">단계 추가 버튼을 클릭하여 수리 절차를 입력하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {procedureSteps.map((step) => (
                    <Card key={step.id} className="border-2">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-lg px-3 py-1">
                              {step.stepNumber}
                            </Badge>
                            <span className="font-semibold">수리 단계 {step.stepNumber}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProcedureStep(step.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>작업내용 *</Label>
                          <Textarea
                            value={step.workContent}
                            onChange={(e) => updateProcedureStep(step.id, "workContent", e.target.value)}
                            placeholder="이 단계에서 수행하는 수리 작업의 상세 내용을 기술하세요."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            주의사항
                          </Label>
                          <Textarea
                            value={step.cautions}
                            onChange={(e) => updateProcedureStep(step.id, "cautions", e.target.value)}
                            placeholder="안전 및 품질 관련 주의사항을 기술하세요."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            사진첨부
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={step.photo}
                              onChange={(e) => updateProcedureStep(step.id, "photo", e.target.value)}
                              placeholder="사진 경로 또는 URL"
                              className="flex-1"
                            />
                            <Button variant="outline" size="icon">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>수리 절차 작성 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">작업내용 작성 예시</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>- 불량 부위 확인 및 마킹</p>
                    <p>- 샌딩 작업 (P400 → P800)</p>
                    <p>- 탈지 및 클리닝</p>
                    <p>- 프라이머 도포</p>
                    <p>- 컬러 도장 (2회)</p>
                    <p>- 클리어 도장</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">주의사항 예시</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>- 보호 장갑 착용 필수</p>
                    <p>- 환기 상태 확인</p>
                    <p>- 도장 두께 관리</p>
                    <p>- 건조 시간 준수</p>
                    <p>- 인접 부위 마스킹</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">사진첨부 기준</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>- 수리 전 불량 상태</p>
                    <p>- 수리 중 주요 작업</p>
                    <p>- 수리 후 완료 상태</p>
                    <p>- 검사 결과 사진</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Repair Standard List (수리표준서 목록) */}
        <TabsContent value="list" className="space-y-6">
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
                  <Label>차종</Label>
                  <Input
                    value={searchFilter.vehicleModel}
                    onChange={(e) => setSearchFilter({ ...searchFilter, vehicleModel: e.target.value })}
                    placeholder="차종 검색"
                  />
                </div>
                <div className="space-y-2">
                  <Label>공정명</Label>
                  <Input
                    value={searchFilter.processName}
                    onChange={(e) => setSearchFilter({ ...searchFilter, processName: e.target.value })}
                    placeholder="공정명 검색"
                  />
                </div>
                <div className="space-y-2">
                  <Label>불량유형</Label>
                  <Input
                    value={searchFilter.defectType}
                    onChange={(e) => setSearchFilter({ ...searchFilter, defectType: e.target.value })}
                    placeholder="불량유형 검색"
                  />
                </div>
                <div className="space-y-2">
                  <Label>상태</Label>
                  <Select
                    value={searchFilter.status}
                    onValueChange={(value) => setSearchFilter({ ...searchFilter, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="active">사용중</SelectItem>
                      <SelectItem value="draft">작성중</SelectItem>
                      <SelectItem value="obsolete">폐기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSearchFilter({ vehicleModel: "", processName: "", defectType: "", status: "" })}
                  >
                    초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>수리표준서 목록</CardTitle>
              <Badge variant="outline">{filteredList.length}건</Badge>
            </CardHeader>
            <CardContent>
              {filteredList.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>검색 조건에 맞는 수리표준서가 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">문서번호</TableHead>
                        <TableHead className="min-w-[80px]">차종</TableHead>
                        <TableHead className="min-w-[80px]">공정명</TableHead>
                        <TableHead className="min-w-[100px]">공정 No</TableHead>
                        <TableHead className="min-w-[150px]">불량유형</TableHead>
                        <TableHead className="min-w-[80px]">상태</TableHead>
                        <TableHead className="min-w-[80px]">개정번호</TableHead>
                        <TableHead className="min-w-[100px]">작성일</TableHead>
                        <TableHead className="min-w-[80px]">작성자</TableHead>
                        <TableHead className="w-24">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredList.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.documentNumber}</TableCell>
                          <TableCell>{item.vehicleModel}</TableCell>
                          <TableCell>{item.processName}</TableCell>
                          <TableCell>{item.processNo}</TableCell>
                          <TableCell>{item.defectType}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.revisionNumber}</TableCell>
                          <TableCell>{item.createdDate}</TableCell>
                          <TableCell>{item.createdBy}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
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
              <CardTitle>통계 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">{repairStandardList.length}</div>
                  <p className="text-sm text-muted-foreground">총 등록건수</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {repairStandardList.filter((item) => item.status === "active").length}
                  </div>
                  <p className="text-sm text-muted-foreground">사용중</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {repairStandardList.filter((item) => item.status === "draft").length}
                  </div>
                  <p className="text-sm text-muted-foreground">작성중</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-gray-400">
                    {repairStandardList.filter((item) => item.status === "obsolete").length}
                  </div>
                  <p className="text-sm text-muted-foreground">폐기</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Revision History (개정 이력) */}
        <TabsContent value="revision-history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>개정 이력</CardTitle>
              <Button onClick={addRevisionHistory}>
                <Plus className="mr-2 h-4 w-4" />
                이력 추가
              </Button>
            </CardHeader>
            <CardContent>
              {revisionHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 개정 이력이 없습니다.</p>
                  <p className="text-sm">이력 추가 버튼을 클릭하여 개정 이력을 입력하세요.</p>
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
                      <span>수리표준서 내용 수정 및 검증</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <span>개정번호 부여 및 이력 등록</span>
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
                    <p>- 수리방법 변경 (공정/장비 변경)</p>
                    <p>- 품질 개선 (수리기준 강화)</p>
                    <p>- 안전 강화 (보호구/주의사항 추가)</p>
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
