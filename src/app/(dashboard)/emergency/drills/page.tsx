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
import { AlertTriangle, Plus, Save, FileText, ClipboardList, CheckCircle, History, Upload, X, ImageIcon } from "lucide-react";

// Emergency types based on Excel form
const EMERGENCY_TYPES = [
  { value: "전력공급중단", label: "전력공급중단" },
  { value: "설비고장", label: "설비고장/생산설비손상" },
  { value: "인력부족", label: "인력부족" },
  { value: "자재공급차질", label: "자재/부품공급차질" },
  { value: "정보시스템장애", label: "정보시스템/네트워크장애" },
  { value: "자연재해", label: "자연재해" },
  { value: "화재폭발", label: "화재 또는 폭발사고" },
  { value: "전염병", label: "전염병 및 팬데믹" },
  { value: "보안사고", label: "보안사고/사이버공격" },
];

interface Attachment {
  id: number;
  name: string;
  type: string;
}

interface EmergencyDrill {
  id: number;
  // Basic info (Header)
  drillName: string;
  drillDate: string;
  drillTime: string;
  drillLocation: string;
  participatingDepartments: string;
  participantCount: number;
  emergencyType: string;
  conductor: string;
  // Plan
  scenario: string;
  objectives: string;
  keyContents: string;
  // Results
  evaluation: string;
  effectivenessRating: string;
  responseTime: string;
  improvements: string;
  attachments: Attachment[];
  // Meta
  createdAt: string;
  status: "계획" | "완료" | "취소";
}

const initialFormData = {
  // Basic info
  drillName: "",
  drillDate: new Date().toISOString().split("T")[0],
  drillTime: "",
  drillLocation: "",
  participatingDepartments: "",
  participantCount: "",
  emergencyType: "",
  conductor: "",
  // Plan
  scenario: "",
  objectives: "",
  keyContents: "",
  // Results
  evaluation: "",
  effectivenessRating: "",
  responseTime: "",
  improvements: "",
  attachments: [] as Attachment[],
};

// Sample data for history
const sampleDrills: EmergencyDrill[] = [
  {
    id: 1,
    drillName: "2024년 상반기 화재대응훈련",
    drillDate: "2024-03-15",
    drillTime: "14:00-16:00",
    drillLocation: "본사 1공장",
    participatingDepartments: "생산팀, 안전팀, 시설팀",
    participantCount: 45,
    emergencyType: "화재폭발",
    conductor: "김안전",
    scenario: "1공장 도장라인에서 화재 발생 상황 가정",
    objectives: "초기 화재 진압 능력 확인, 대피 절차 숙지",
    keyContents: "소화기 사용법 교육, 대피경로 확인, 비상연락망 점검",
    evaluation: "대피시간 목표 달성, 소화기 사용 미숙자 발견",
    effectivenessRating: "효과적",
    responseTime: "12분",
    improvements: "소화기 사용 재교육 필요, 비상구 표지판 추가 설치",
    attachments: [],
    createdAt: "2024-03-15",
    status: "완료",
  },
  {
    id: 2,
    drillName: "정보시스템 장애 대응훈련",
    drillDate: "2024-05-20",
    drillTime: "09:00-11:00",
    drillLocation: "IT센터",
    participatingDepartments: "IT팀, 경영지원팀",
    participantCount: 15,
    emergencyType: "정보시스템장애",
    conductor: "박시스템",
    scenario: "메인 서버 다운 및 데이터 복구 시나리오",
    objectives: "백업 시스템 전환 절차 확인, 복구 시간 측정",
    keyContents: "장애 감지, 백업 서버 전환, 데이터 무결성 확인",
    evaluation: "백업 전환 성공, 복구 시간 목표 초과",
    effectivenessRating: "보통",
    responseTime: "25분",
    improvements: "자동 전환 시스템 도입 검토, 복구 매뉴얼 개선",
    attachments: [],
    createdAt: "2024-05-20",
    status: "완료",
  },
];

export default function EmergencyDrillsPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [drills, setDrills] = useState<EmergencyDrill[]>(sampleDrills);
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<EmergencyDrill | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAttachment = () => {
    const newAttachment: Attachment = {
      id: Date.now(),
      name: `첨부파일_${formData.attachments.length + 1}.pdf`,
      type: "document",
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment],
    }));
  };

  const handleRemoveAttachment = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (!formData.drillName || !formData.drillDate || !formData.emergencyType) {
      alert("필수 항목(훈련명, 훈련일시, 비상유형)을 입력해주세요.");
      return;
    }

    const newDrill: EmergencyDrill = {
      id: Date.now(),
      drillName: formData.drillName,
      drillDate: formData.drillDate,
      drillTime: formData.drillTime,
      drillLocation: formData.drillLocation,
      participatingDepartments: formData.participatingDepartments,
      participantCount: Number(formData.participantCount) || 0,
      emergencyType: formData.emergencyType,
      conductor: formData.conductor,
      scenario: formData.scenario,
      objectives: formData.objectives,
      keyContents: formData.keyContents,
      evaluation: formData.evaluation,
      effectivenessRating: formData.effectivenessRating,
      responseTime: formData.responseTime,
      improvements: formData.improvements,
      attachments: formData.attachments,
      createdAt: new Date().toISOString().split("T")[0],
      status: formData.evaluation ? "완료" : "계획",
    };

    setDrills([newDrill, ...drills]);
    setFormData(initialFormData);
    setActiveTab("history");
    alert("비상대응훈련 보고서가 저장되었습니다.");
  };

  const handleNewDrill = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setSelectedDrill(null);
    setActiveTab("basic");
  };

  const handleViewDrill = (drill: EmergencyDrill) => {
    setSelectedDrill(drill);
    setFormData({
      drillName: drill.drillName,
      drillDate: drill.drillDate,
      drillTime: drill.drillTime,
      drillLocation: drill.drillLocation,
      participatingDepartments: drill.participatingDepartments,
      participantCount: drill.participantCount.toString(),
      emergencyType: drill.emergencyType,
      conductor: drill.conductor,
      scenario: drill.scenario,
      objectives: drill.objectives,
      keyContents: drill.keyContents,
      evaluation: drill.evaluation,
      effectivenessRating: drill.effectivenessRating,
      responseTime: drill.responseTime,
      improvements: drill.improvements,
      attachments: drill.attachments,
    });
    setIsEditing(true);
    setActiveTab("basic");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "완료":
        return <Badge variant="success">완료</Badge>;
      case "계획":
        return <Badge variant="warning">계획</Badge>;
      case "취소":
        return <Badge variant="destructive">취소</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmergencyTypeLabel = (value: string) => {
    return EMERGENCY_TYPES.find((t) => t.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비상대응훈련결과 보고서</h1>
          <p className="text-muted-foreground">비상대응훈련 계획, 실행 및 결과 관리</p>
        </div>
        <Button onClick={handleNewDrill}>
          <Plus className="mr-2 h-4 w-4" />
          새 훈련 등록
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                훈련 기본정보
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                훈련 계획
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                훈련 결과
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                훈련 이력
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Basic Info */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    훈련 기본정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="drillName">훈련명 *</Label>
                      <Input
                        id="drillName"
                        value={formData.drillName}
                        onChange={(e) => handleInputChange("drillName", e.target.value)}
                        placeholder="예: 2024년 상반기 화재대응훈련"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyType">비상유형 *</Label>
                      <Select
                        value={formData.emergencyType}
                        onValueChange={(v) => handleInputChange("emergencyType", v)}
                      >
                        <SelectTrigger id="emergencyType">
                          <SelectValue placeholder="비상유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMERGENCY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="drillDate">훈련일시 *</Label>
                      <Input
                        id="drillDate"
                        type="date"
                        value={formData.drillDate}
                        onChange={(e) => handleInputChange("drillDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drillTime">훈련시간</Label>
                      <Input
                        id="drillTime"
                        value={formData.drillTime}
                        onChange={(e) => handleInputChange("drillTime", e.target.value)}
                        placeholder="예: 14:00-16:00"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="drillLocation">훈련장소</Label>
                      <Input
                        id="drillLocation"
                        value={formData.drillLocation}
                        onChange={(e) => handleInputChange("drillLocation", e.target.value)}
                        placeholder="예: 본사 1공장"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conductor">훈련책임자</Label>
                      <Input
                        id="conductor"
                        value={formData.conductor}
                        onChange={(e) => handleInputChange("conductor", e.target.value)}
                        placeholder="훈련 책임자 이름"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="participatingDepartments">훈련참여부서</Label>
                      <Input
                        id="participatingDepartments"
                        value={formData.participatingDepartments}
                        onChange={(e) => handleInputChange("participatingDepartments", e.target.value)}
                        placeholder="예: 생산팀, 안전팀, 시설팀"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participantCount">훈련참여인원</Label>
                      <Input
                        id="participantCount"
                        type="number"
                        value={formData.participantCount}
                        onChange={(e) => handleInputChange("participantCount", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("plan")}>
                      다음: 훈련 계획
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Plan */}
            <TabsContent value="plan">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    훈련 계획
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="scenario">훈련 시나리오</Label>
                    <Textarea
                      id="scenario"
                      value={formData.scenario}
                      onChange={(e) => handleInputChange("scenario", e.target.value)}
                      placeholder="훈련 시나리오 내용을 상세히 기술해주세요."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">훈련 목표</Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) => handleInputChange("objectives", e.target.value)}
                      placeholder="이번 훈련의 목표를 기술해주세요."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keyContents">주요 훈련 내용</Label>
                    <Textarea
                      id="keyContents"
                      value={formData.keyContents}
                      onChange={(e) => handleInputChange("keyContents", e.target.value)}
                      placeholder="주요 훈련 내용 및 절차를 기술해주세요."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("basic")}>
                      이전: 기본정보
                    </Button>
                    <Button onClick={() => setActiveTab("results")}>
                      다음: 훈련 결과
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Results */}
            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    훈련 결과 평가
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="responseTime">대응시간</Label>
                      <Input
                        id="responseTime"
                        value={formData.responseTime}
                        onChange={(e) => handleInputChange("responseTime", e.target.value)}
                        placeholder="예: 15분"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="effectivenessRating">효과성 평가</Label>
                      <Select
                        value={formData.effectivenessRating}
                        onValueChange={(v) => handleInputChange("effectivenessRating", v)}
                      >
                        <SelectTrigger id="effectivenessRating">
                          <SelectValue placeholder="효과성 평가 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="효과적">효과적</SelectItem>
                          <SelectItem value="보통">보통</SelectItem>
                          <SelectItem value="미흡">미흡</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluation">훈련 결과 평가</Label>
                    <Textarea
                      id="evaluation"
                      value={formData.evaluation}
                      onChange={(e) => handleInputChange("evaluation", e.target.value)}
                      placeholder="훈련 결과 및 평가 내용을 기술해주세요."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="improvements">개선사항</Label>
                    <Textarea
                      id="improvements"
                      value={formData.improvements}
                      onChange={(e) => handleInputChange("improvements", e.target.value)}
                      placeholder="향후 개선이 필요한 사항을 기술해주세요."
                      rows={4}
                    />
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>사진 및 첨부자료</Label>
                      <Button variant="outline" size="sm" onClick={handleAddAttachment}>
                        <Upload className="mr-2 h-4 w-4" />
                        파일 추가
                      </Button>
                    </div>
                    {formData.attachments.length > 0 ? (
                      <div className="grid gap-2">
                        {formData.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{attachment.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(attachment.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed p-8 text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          첨부된 파일이 없습니다
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("plan")}>
                      이전: 훈련 계획
                    </Button>
                    <Button onClick={handleSubmit}>
                      <Save className="mr-2 h-4 w-4" />
                      보고서 저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    훈련 이력
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {drills.length === 0 ? (
                    <div className="py-8 text-center">
                      <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">훈련 기록이 없습니다.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>훈련일자</TableHead>
                          <TableHead>훈련명</TableHead>
                          <TableHead>비상유형</TableHead>
                          <TableHead>훈련장소</TableHead>
                          <TableHead className="text-right">참여인원</TableHead>
                          <TableHead>효과성</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drills.map((drill) => (
                          <TableRow key={drill.id}>
                            <TableCell>{drill.drillDate}</TableCell>
                            <TableCell className="font-medium">{drill.drillName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getEmergencyTypeLabel(drill.emergencyType)}
                              </Badge>
                            </TableCell>
                            <TableCell>{drill.drillLocation || "-"}</TableCell>
                            <TableCell className="text-right">{drill.participantCount}명</TableCell>
                            <TableCell>
                              {drill.effectivenessRating ? (
                                <Badge
                                  variant={
                                    drill.effectivenessRating === "효과적"
                                      ? "success"
                                      : drill.effectivenessRating === "보통"
                                      ? "warning"
                                      : "destructive"
                                  }
                                >
                                  {drill.effectivenessRating}
                                </Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(drill.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDrill(drill)}
                              >
                                상세보기
                              </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
