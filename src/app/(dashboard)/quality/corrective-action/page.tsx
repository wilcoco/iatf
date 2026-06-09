"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Users,
  Search,
  Shield,
  CheckCircle,
  History,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

// 8D Corrective Action Form Data Interface
interface CorrectiveActionFormData {
  // D1: Team (팀 구성)
  carNumber: string;
  registrationDate: string;
  customer: string;
  problemOccurredDate: string;
  teamLeader: string;
  teamMembers: { name: string; role: string; department: string }[];

  // D2: Problem Definition (문제 정의)
  problemTitle: string;
  problemDescription: string;
  affectedProducts: string;
  affectedQuantity: string;
  discoveryLocation: string;
  defectType: string;

  // D3: Interim Containment Action (긴급 대책)
  interimAction: string;
  interimActionResponsible: string;
  interimActionDate: string;
  interimActionResult: string;

  // D4: Root Cause Analysis (근본 원인 분석)
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  rootCause: string;
  escapePoint: string;

  // D5: Permanent Corrective Action (영구 대책)
  permanentActions: { action: string; responsible: string; dueDate: string; status: string }[];

  // D6: Implementation & Verification (대책 실행 및 검증)
  implementationResults: string;
  verificationMethod: string;
  verificationDate: string;
  verificationResult: "effective" | "ineffective" | "";
  effectivenessData: string;

  // D7: Preventive Action (재발 방지)
  horizontalDeploymentTargets: string;
  preventiveActions: string;
  documentRevisions: string;
  trainingRequired: boolean;
  trainingContent: string;

  // D8: Team Closure (팀 해산 및 종료)
  closureDate: string;
  closureApproval: string;
  lessonsLearned: string;
  status: "open" | "in-progress" | "verification" | "closed";
}

interface HistoryRecord {
  id: number;
  carNumber: string;
  customer: string;
  problemTitle: string;
  registrationDate: string;
  closureDate: string | null;
  status: string;
}

const initialFormData: CorrectiveActionFormData = {
  carNumber: "",
  registrationDate: new Date().toISOString().split("T")[0],
  customer: "",
  problemOccurredDate: "",
  teamLeader: "",
  teamMembers: [{ name: "", role: "", department: "" }],
  problemTitle: "",
  problemDescription: "",
  affectedProducts: "",
  affectedQuantity: "",
  discoveryLocation: "",
  defectType: "",
  interimAction: "",
  interimActionResponsible: "",
  interimActionDate: "",
  interimActionResult: "",
  why1: "",
  why2: "",
  why3: "",
  why4: "",
  why5: "",
  rootCause: "",
  escapePoint: "",
  permanentActions: [{ action: "", responsible: "", dueDate: "", status: "pending" }],
  implementationResults: "",
  verificationMethod: "",
  verificationDate: "",
  verificationResult: "",
  effectivenessData: "",
  horizontalDeploymentTargets: "",
  preventiveActions: "",
  documentRevisions: "",
  trainingRequired: false,
  trainingContent: "",
  closureDate: "",
  closureApproval: "",
  lessonsLearned: "",
  status: "open",
};

const sampleHistory: HistoryRecord[] = [
  {
    id: 1,
    carNumber: "CAR-2026-001",
    customer: "삼성전자",
    problemTitle: "표면 스크래치 불량",
    registrationDate: "2026-01-15",
    closureDate: "2026-02-20",
    status: "closed",
  },
  {
    id: 2,
    carNumber: "CAR-2026-002",
    customer: "LG전자",
    problemTitle: "치수 규격 초과",
    registrationDate: "2026-03-10",
    closureDate: "2026-04-15",
    status: "closed",
  },
  {
    id: 3,
    carNumber: "CAR-2026-003",
    customer: "현대자동차",
    problemTitle: "도장 벗겨짐",
    registrationDate: "2026-05-01",
    closureDate: null,
    status: "verification",
  },
  {
    id: 4,
    carNumber: "CAR-2026-004",
    customer: "SK하이닉스",
    problemTitle: "이물질 혼입",
    registrationDate: "2026-06-01",
    closureDate: null,
    status: "in-progress",
  },
];

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  verification: "bg-blue-100 text-blue-800",
  closed: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  open: "발행",
  "in-progress": "진행중",
  verification: "검증중",
  closed: "종결",
};

export default function CorrectiveActionPage() {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [formData, setFormData] = useState<CorrectiveActionFormData>(initialFormData);
  const [historyData] = useState<HistoryRecord[]>(sampleHistory);

  const updateField = <K extends keyof CorrectiveActionFormData>(
    field: K,
    value: CorrectiveActionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateCARNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("carNumber", `CAR-${year}-${random}`);
  };

  const addTeamMember = () => {
    updateField("teamMembers", [
      ...formData.teamMembers,
      { name: "", role: "", department: "" },
    ]);
  };

  const removeTeamMember = (index: number) => {
    if (formData.teamMembers.length > 1) {
      const newMembers = formData.teamMembers.filter((_, i) => i !== index);
      updateField("teamMembers", newMembers);
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof CorrectiveActionFormData["teamMembers"][0],
    value: string
  ) => {
    const newMembers = [...formData.teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateField("teamMembers", newMembers);
  };

  const addPermanentAction = () => {
    updateField("permanentActions", [
      ...formData.permanentActions,
      { action: "", responsible: "", dueDate: "", status: "pending" },
    ]);
  };

  const removePermanentAction = (index: number) => {
    if (formData.permanentActions.length > 1) {
      const newActions = formData.permanentActions.filter((_, i) => i !== index);
      updateField("permanentActions", newActions);
    }
  };

  const updatePermanentAction = (
    index: number,
    field: keyof CorrectiveActionFormData["permanentActions"][0],
    value: string
  ) => {
    const newActions = [...formData.permanentActions];
    newActions[index] = { ...newActions[index], [field]: value };
    updateField("permanentActions", newActions);
  };

  const handleSave = () => {
    console.log("Saving Corrective Action data:", formData);
    alert("개선대책서가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">개선대책서 (8D Report)</h1>
          <p className="text-muted-foreground">8D 방법론 기반 시정조치 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">기본정보 (D1, D2)</TabsTrigger>
          <TabsTrigger value="analysis">원인분석 및 대책 (D3-D5)</TabsTrigger>
          <TabsTrigger value="verification">실행 및 검증 (D6-D8)</TabsTrigger>
          <TabsTrigger value="history">개선대책 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info (D1, D2) */}
        <TabsContent value="basic-info">
          <div className="space-y-6">
            {/* Header Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  대책서 기본정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carNumber">대책서 번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="carNumber"
                        value={formData.carNumber}
                        onChange={(e) => updateField("carNumber", e.target.value)}
                        placeholder="CAR-YYYY-XXX"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateCARNumber}
                        className="shrink-0"
                      >
                        자동생성
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationDate">등록일</Label>
                    <Input
                      id="registrationDate"
                      type="date"
                      value={formData.registrationDate}
                      onChange={(e) => updateField("registrationDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="problemOccurredDate">발생일</Label>
                    <Input
                      id="problemOccurredDate"
                      type="date"
                      value={formData.problemOccurredDate}
                      onChange={(e) => updateField("problemOccurredDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">고객사</Label>
                    <Input
                      id="customer"
                      value={formData.customer}
                      onChange={(e) => updateField("customer", e.target.value)}
                      placeholder="고객사명"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* D1: Team Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  D1: 팀 구성 (Team Formation)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamLeader">팀 리더</Label>
                    <Input
                      id="teamLeader"
                      value={formData.teamLeader}
                      onChange={(e) => updateField("teamLeader", e.target.value)}
                      placeholder="팀 리더 이름"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>팀 멤버</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                      <Plus className="h-4 w-4 mr-1" />
                      멤버 추가
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          placeholder="이름"
                          className="flex-1"
                        />
                        <Input
                          value={member.role}
                          onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                          placeholder="역할"
                          className="flex-1"
                        />
                        <Input
                          value={member.department}
                          onChange={(e) => updateTeamMember(index, "department", e.target.value)}
                          placeholder="부서"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                          disabled={formData.teamMembers.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* D2: Problem Definition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  D2: 문제 정의 (Problem Description)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problemTitle">문제 제목</Label>
                  <Input
                    id="problemTitle"
                    value={formData.problemTitle}
                    onChange={(e) => updateField("problemTitle", e.target.value)}
                    placeholder="문제를 간략히 요약하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemDescription">문제 상세 설명</Label>
                  <Textarea
                    id="problemDescription"
                    value={formData.problemDescription}
                    onChange={(e) => updateField("problemDescription", e.target.value)}
                    placeholder="문제 상황을 구체적으로 기술하세요 (What, Where, When, Who, How much)"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="affectedProducts">영향 제품</Label>
                    <Input
                      id="affectedProducts"
                      value={formData.affectedProducts}
                      onChange={(e) => updateField("affectedProducts", e.target.value)}
                      placeholder="제품명/모델"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affectedQuantity">영향 수량</Label>
                    <Input
                      id="affectedQuantity"
                      value={formData.affectedQuantity}
                      onChange={(e) => updateField("affectedQuantity", e.target.value)}
                      placeholder="불량 수량"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discoveryLocation">발견 위치</Label>
                    <Input
                      id="discoveryLocation"
                      value={formData.discoveryLocation}
                      onChange={(e) => updateField("discoveryLocation", e.target.value)}
                      placeholder="공정/고객사"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defectType">불량 유형</Label>
                    <Input
                      id="defectType"
                      value={formData.defectType}
                      onChange={(e) => updateField("defectType", e.target.value)}
                      placeholder="외관/치수/기능 등"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Root Cause Analysis & Countermeasures (D3, D4, D5) */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* D3: Interim Containment Action */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  D3: 긴급 대책 (Interim Containment Action)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interimAction">긴급 대책 내용</Label>
                  <Textarea
                    id="interimAction"
                    value={formData.interimAction}
                    onChange={(e) => updateField("interimAction", e.target.value)}
                    placeholder="고객 보호를 위한 즉각적인 대책 내용을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interimActionResponsible">담당자</Label>
                    <Input
                      id="interimActionResponsible"
                      value={formData.interimActionResponsible}
                      onChange={(e) => updateField("interimActionResponsible", e.target.value)}
                      placeholder="담당자명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interimActionDate">실행일</Label>
                    <Input
                      id="interimActionDate"
                      type="date"
                      value={formData.interimActionDate}
                      onChange={(e) => updateField("interimActionDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interimActionResult">실행 결과</Label>
                    <Input
                      id="interimActionResult"
                      value={formData.interimActionResult}
                      onChange={(e) => updateField("interimActionResult", e.target.value)}
                      placeholder="실행 결과 요약"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* D4: Root Cause Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-500" />
                  D4: 근본 원인 분석 (Root Cause Analysis)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 5 Why Analysis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">5 Why 분석</h3>
                  <p className="text-sm text-muted-foreground">
                    문제의 근본 원인을 찾기 위해 "왜?"를 반복하여 질문합니다.
                  </p>

                  <div className="space-y-3">
                    {[
                      { key: "why1", label: "Why 1: 왜 문제가 발생했는가?" },
                      { key: "why2", label: "Why 2: 왜 그런 원인이 있었는가?" },
                      { key: "why3", label: "Why 3: 왜 그런 상황이 발생했는가?" },
                      { key: "why4", label: "Why 4: 왜 그런 조건이 존재했는가?" },
                      { key: "why5", label: "Why 5: 근본 원인은 무엇인가?" },
                    ].map(({ key, label }, index) => (
                      <div key={key} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={key}>{label}</Label>
                          <Textarea
                            id={key}
                            value={formData[key as keyof CorrectiveActionFormData] as string}
                            onChange={(e) =>
                              updateField(key as keyof CorrectiveActionFormData, e.target.value)
                            }
                            placeholder={`${index + 1}차 원인을 기술하세요`}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rootCause">근본 원인 결론</Label>
                    <Textarea
                      id="rootCause"
                      value={formData.rootCause}
                      onChange={(e) => updateField("rootCause", e.target.value)}
                      placeholder="위 분석을 종합하여 도출된 근본원인을 명확하게 기술하세요"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escapePoint">유출점 (Escape Point)</Label>
                    <Textarea
                      id="escapePoint"
                      value={formData.escapePoint}
                      onChange={(e) => updateField("escapePoint", e.target.value)}
                      placeholder="불량이 검출되지 않고 유출된 지점을 분석하세요"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* D5: Permanent Corrective Action */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  D5: 영구 대책 (Permanent Corrective Action)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    근본 원인을 제거하기 위한 영구적인 대책을 수립하세요
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={addPermanentAction}>
                    <Plus className="h-4 w-4 mr-1" />
                    대책 추가
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.permanentActions.map((action, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">대책 {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePermanentAction(index)}
                          disabled={formData.permanentActions.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>대책 내용</Label>
                        <Textarea
                          value={action.action}
                          onChange={(e) => updatePermanentAction(index, "action", e.target.value)}
                          placeholder="영구 대책 내용을 기술하세요"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>담당자</Label>
                          <Input
                            value={action.responsible}
                            onChange={(e) =>
                              updatePermanentAction(index, "responsible", e.target.value)
                            }
                            placeholder="담당자명"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>완료 예정일</Label>
                          <Input
                            type="date"
                            value={action.dueDate}
                            onChange={(e) => updatePermanentAction(index, "dueDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>상태</Label>
                          <Select
                            value={action.status}
                            onValueChange={(value) => updatePermanentAction(index, "status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="상태 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">대기</SelectItem>
                              <SelectItem value="in-progress">진행중</SelectItem>
                              <SelectItem value="completed">완료</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Implementation & Verification (D6, D7, D8) */}
        <TabsContent value="verification">
          <div className="space-y-6">
            {/* D6: Implementation & Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  D6: 대책 실행 및 검증 (Implementation & Verification)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="implementationResults">대책 실행 결과</Label>
                  <Textarea
                    id="implementationResults"
                    value={formData.implementationResults}
                    onChange={(e) => updateField("implementationResults", e.target.value)}
                    placeholder="영구 대책의 실행 결과를 상세히 기술하세요"
                    rows={4}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">효과 검증</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationMethod">검증 방법</Label>
                      <Textarea
                        id="verificationMethod"
                        value={formData.verificationMethod}
                        onChange={(e) => updateField("verificationMethod", e.target.value)}
                        placeholder="대책의 효과를 검증할 방법을 기술하세요"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="verificationDate">검증일자</Label>
                        <Input
                          id="verificationDate"
                          type="date"
                          value={formData.verificationDate}
                          onChange={(e) => updateField("verificationDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검증 결과</Label>
                        <Select
                          value={formData.verificationResult}
                          onValueChange={(value) =>
                            updateField(
                              "verificationResult",
                              value as CorrectiveActionFormData["verificationResult"]
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="검증결과 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="effective">효과적</SelectItem>
                            <SelectItem value="ineffective">비효과적</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="effectivenessData">효과성 데이터</Label>
                      <Textarea
                        id="effectivenessData"
                        value={formData.effectivenessData}
                        onChange={(e) => updateField("effectivenessData", e.target.value)}
                        placeholder="개선 전후 비교 데이터, PPM 변화 등을 기술하세요"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* D7: Preventive Action */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  D7: 재발 방지 (Preventive Action)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="horizontalDeploymentTargets">수평전개 대상</Label>
                  <Textarea
                    id="horizontalDeploymentTargets"
                    value={formData.horizontalDeploymentTargets}
                    onChange={(e) => updateField("horizontalDeploymentTargets", e.target.value)}
                    placeholder="유사 공정, 제품, 설비 등 수평전개 대상을 기술하세요"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preventiveActions">예방조치 내용</Label>
                  <Textarea
                    id="preventiveActions"
                    value={formData.preventiveActions}
                    onChange={(e) => updateField("preventiveActions", e.target.value)}
                    placeholder="재발 방지를 위한 예방조치 내용을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentRevisions">문서 개정 내역</Label>
                  <Textarea
                    id="documentRevisions"
                    value={formData.documentRevisions}
                    onChange={(e) => updateField("documentRevisions", e.target.value)}
                    placeholder="개정된 문서명을 나열하세요 (작업표준서, 검사기준서 등)"
                    rows={2}
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="trainingRequired"
                      checked={formData.trainingRequired}
                      onChange={(e) => updateField("trainingRequired", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="trainingRequired">교육 필요</Label>
                  </div>
                  {formData.trainingRequired && (
                    <div className="space-y-2">
                      <Label htmlFor="trainingContent">교육 내용</Label>
                      <Textarea
                        id="trainingContent"
                        value={formData.trainingContent}
                        onChange={(e) => updateField("trainingContent", e.target.value)}
                        placeholder="실시할 교육 내용을 기술하세요"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* D8: Team Closure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  D8: 팀 해산 및 종료 (Team Recognition & Closure)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="closureDate">종료일</Label>
                    <Input
                      id="closureDate"
                      type="date"
                      value={formData.closureDate}
                      onChange={(e) => updateField("closureDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closureApproval">승인자</Label>
                    <Input
                      id="closureApproval"
                      value={formData.closureApproval}
                      onChange={(e) => updateField("closureApproval", e.target.value)}
                      placeholder="최종 승인자명"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lessonsLearned">교훈 (Lessons Learned)</Label>
                  <Textarea
                    id="lessonsLearned"
                    value={formData.lessonsLearned}
                    onChange={(e) => updateField("lessonsLearned", e.target.value)}
                    placeholder="이번 개선활동을 통해 얻은 교훈을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      updateField("status", value as CorrectiveActionFormData["status"])
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">발행</SelectItem>
                      <SelectItem value="in-progress">진행중</SelectItem>
                      <SelectItem value="verification">검증중</SelectItem>
                      <SelectItem value="closed">종결</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                개선대책 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>대책서 번호</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>문제 제목</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>종료일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono">{record.carNumber}</TableCell>
                      <TableCell>{record.customer}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.problemTitle}</TableCell>
                      <TableCell>
                        {new Date(record.registrationDate).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        {record.closureDate
                          ? new Date(record.closureDate).toLocaleDateString("ko-KR")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[record.status] || "bg-gray-100"
                          }`}
                        >
                          {statusLabels[record.status] || record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
