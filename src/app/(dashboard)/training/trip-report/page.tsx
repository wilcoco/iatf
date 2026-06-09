"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Save, FileText, BookOpen, Target, History } from "lucide-react";

// Types
interface TripReportForm {
  // Basic Info (Tab 1)
  reportNumber: string;
  createdDate: string;
  travelerName: string;
  travelerDepartment: string;
  travelerPosition: string;
  trainingName: string;
  trainingInstitution: string;
  trainingStartDate: string;
  trainingEndDate: string;
  trainingLocation: string;
  // Training Content (Tab 2)
  trainingPurpose: string;
  contentSummary: string;
  keyLearnings: string;
  // Results & Application Plan (Tab 3)
  achievements: string;
  applicationPlan: string;
  disseminationPlan: string;
}

interface ReportHistory {
  id: string;
  date: string;
  action: string;
  user: string;
  details: string;
}

// Initial data
const initialFormData: TripReportForm = {
  reportNumber: "TTR-2026-001",
  createdDate: "2026-06-10",
  travelerName: "",
  travelerDepartment: "",
  travelerPosition: "",
  trainingName: "",
  trainingInstitution: "",
  trainingStartDate: "",
  trainingEndDate: "",
  trainingLocation: "",
  trainingPurpose: "",
  contentSummary: "",
  keyLearnings: "",
  achievements: "",
  applicationPlan: "",
  disseminationPlan: "",
};

const initialHistory: ReportHistory[] = [
  { id: "1", date: "2026-06-10 09:00", action: "생성", user: "관리자", details: "교육출장 결과보고서 최초 생성" },
];

export default function TrainingTripReportPage() {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [formData, setFormData] = useState<TripReportForm>(initialFormData);
  const [history] = useState<ReportHistory[]>(initialHistory);

  const handleInputChange = (field: keyof TripReportForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving trip report:", formData);
    alert("교육출장 결과보고서가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">교육출장 결과보고서</h1>
          <p className="text-muted-foreground">교육 출장 결과 보고 및 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            기본정보
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            교육내용
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            결과 및 활용계획
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            보고서 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                기본정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportNumber">보고서번호</Label>
                  <Input
                    id="reportNumber"
                    value={formData.reportNumber}
                    onChange={(e) => handleInputChange("reportNumber", e.target.value)}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createdDate">작성일</Label>
                  <Input
                    id="createdDate"
                    type="date"
                    value={formData.createdDate}
                    onChange={(e) => handleInputChange("createdDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Traveler Info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">출장자 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelerName">성명</Label>
                    <Input
                      id="travelerName"
                      value={formData.travelerName}
                      onChange={(e) => handleInputChange("travelerName", e.target.value)}
                      placeholder="출장자 성명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelerDepartment">부서</Label>
                    <Input
                      id="travelerDepartment"
                      value={formData.travelerDepartment}
                      onChange={(e) => handleInputChange("travelerDepartment", e.target.value)}
                      placeholder="부서명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travelerPosition">직급</Label>
                    <Input
                      id="travelerPosition"
                      value={formData.travelerPosition}
                      onChange={(e) => handleInputChange("travelerPosition", e.target.value)}
                      placeholder="직급 입력"
                    />
                  </div>
                </div>
              </div>

              {/* Training Info */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">교육 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingName">교육명</Label>
                    <Input
                      id="trainingName"
                      value={formData.trainingName}
                      onChange={(e) => handleInputChange("trainingName", e.target.value)}
                      placeholder="교육명을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingInstitution">교육기관</Label>
                    <Input
                      id="trainingInstitution"
                      value={formData.trainingInstitution}
                      onChange={(e) => handleInputChange("trainingInstitution", e.target.value)}
                      placeholder="교육기관을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingStartDate">교육기간 (시작)</Label>
                    <Input
                      id="trainingStartDate"
                      type="date"
                      value={formData.trainingStartDate}
                      onChange={(e) => handleInputChange("trainingStartDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingEndDate">교육기간 (종료)</Label>
                    <Input
                      id="trainingEndDate"
                      type="date"
                      value={formData.trainingEndDate}
                      onChange={(e) => handleInputChange("trainingEndDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="trainingLocation">교육장소</Label>
                    <Input
                      id="trainingLocation"
                      value={formData.trainingLocation}
                      onChange={(e) => handleInputChange("trainingLocation", e.target.value)}
                      placeholder="교육장소를 입력하세요"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Training Content */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                교육내용
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="trainingPurpose">교육목적</Label>
                <Textarea
                  id="trainingPurpose"
                  value={formData.trainingPurpose}
                  onChange={(e) => handleInputChange("trainingPurpose", e.target.value)}
                  placeholder="교육 참여 목적 및 기대효과를 입력하세요"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentSummary">교육내용 요약</Label>
                <Textarea
                  id="contentSummary"
                  value={formData.contentSummary}
                  onChange={(e) => handleInputChange("contentSummary", e.target.value)}
                  placeholder="교육에서 다룬 주요 내용을 요약하여 입력하세요"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyLearnings">주요 학습사항</Label>
                <Textarea
                  id="keyLearnings"
                  value={formData.keyLearnings}
                  onChange={(e) => handleInputChange("keyLearnings", e.target.value)}
                  placeholder="교육을 통해 습득한 주요 지식 및 기술을 입력하세요"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Results & Application Plan */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                결과 및 활용계획
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="achievements">교육 성과</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange("achievements", e.target.value)}
                  placeholder="교육 참여를 통해 달성한 성과를 입력하세요 (수료증 취득, 자격증 획득, 역량 향상 등)"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationPlan">업무 활용계획</Label>
                <Textarea
                  id="applicationPlan"
                  value={formData.applicationPlan}
                  onChange={(e) => handleInputChange("applicationPlan", e.target.value)}
                  placeholder="교육 내용을 실제 업무에 어떻게 활용할 계획인지 입력하세요"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disseminationPlan">전파교육 계획</Label>
                <Textarea
                  id="disseminationPlan"
                  value={formData.disseminationPlan}
                  onChange={(e) => handleInputChange("disseminationPlan", e.target.value)}
                  placeholder="교육 내용을 팀원들에게 전파할 계획을 입력하세요 (대상, 일정, 방법 등)"
                  rows={5}
                />
              </div>

              {/* Summary Box */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-3">보고서 요약</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">출장자</div>
                    <div className="font-medium">{formData.travelerName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">교육명</div>
                    <div className="font-medium">{formData.trainingName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">교육기관</div>
                    <div className="font-medium">{formData.trainingInstitution || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">교육기간</div>
                    <div className="font-medium">
                      {formData.trainingStartDate && formData.trainingEndDate
                        ? `${formData.trainingStartDate} ~ ${formData.trainingEndDate}`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Report History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                보고서 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">일시</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                    <TableHead className="w-[120px]">작업자</TableHead>
                    <TableHead>상세내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        기록된 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.action === "생성"
                                ? "default"
                                : item.action === "수정"
                                ? "secondary"
                                : item.action === "승인"
                                ? "success"
                                : "outline"
                            }
                          >
                            {item.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell className="text-muted-foreground">{item.details}</TableCell>
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
