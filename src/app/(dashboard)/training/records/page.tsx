"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Save, Plus, Trash2, FileText, Users, ClipboardCheck, History } from "lucide-react";

// Types
interface Attendee {
  id: string;
  name: string;
  department: string;
  position: string;
  attendance: "present" | "absent" | "late";
  score: number | null;
  passed: boolean | null;
}

interface TrainingHistory {
  id: string;
  date: string;
  action: string;
  user: string;
  details: string;
}

interface TrainingRecordForm {
  // Header
  trainingNumber: string;
  trainingName: string;
  trainingDateTime: string;
  trainingLocation: string;
  // Training Info
  trainingType: "new-employee" | "regular" | "special" | "qualification";
  trainingContent: string;
  instructorType: "internal" | "external";
  instructorName: string;
  trainingHours: number;
  trainingMaterials: string;
  // Effectiveness
  postEvaluation: string;
  improvements: string;
}

// Initial data
const initialFormData: TrainingRecordForm = {
  trainingNumber: "TRN-2026-001",
  trainingName: "",
  trainingDateTime: "",
  trainingLocation: "",
  trainingType: "regular",
  trainingContent: "",
  instructorType: "internal",
  instructorName: "",
  trainingHours: 0,
  trainingMaterials: "",
  postEvaluation: "",
  improvements: "",
};

const initialAttendees: Attendee[] = [
  { id: "1", name: "김철수", department: "품질관리팀", position: "대리", attendance: "present", score: 85, passed: true },
  { id: "2", name: "이영희", department: "생산팀", position: "사원", attendance: "present", score: 92, passed: true },
  { id: "3", name: "박지성", department: "품질관리팀", position: "주임", attendance: "late", score: 78, passed: true },
];

const initialHistory: TrainingHistory[] = [
  { id: "1", date: "2026-06-01 09:30", action: "생성", user: "관리자", details: "교육 기록 최초 생성" },
  { id: "2", date: "2026-06-02 14:20", action: "수정", user: "관리자", details: "교육 대상자 추가 (3명)" },
  { id: "3", date: "2026-06-05 16:45", action: "평가완료", user: "관리자", details: "교육 효과 평가 입력 완료" },
];

const trainingTypeLabels: Record<string, string> = {
  "new-employee": "신입교육",
  "regular": "정기교육",
  "special": "특별교육",
  "qualification": "자격교육",
};

const attendanceLabels: Record<string, string> = {
  present: "출석",
  absent: "결석",
  late: "지각",
};

export default function TrainingRecordsPage() {
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState<TrainingRecordForm>(initialFormData);
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [history] = useState<TrainingHistory[]>(initialHistory);

  const handleInputChange = (field: keyof TrainingRecordForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttendeeChange = (id: string, field: keyof Attendee, value: string | number | boolean | null) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const addAttendee = () => {
    const newAttendee: Attendee = {
      id: Date.now().toString(),
      name: "",
      department: "",
      position: "",
      attendance: "present",
      score: null,
      passed: null,
    };
    setAttendees((prev) => [...prev, newAttendee]);
  };

  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = () => {
    console.log("Saving training record:", { formData, attendees });
    alert("교육훈련기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">교육훈련기록</h1>
          <p className="text-muted-foreground">교육 훈련 실시 기록 및 평가 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainingNumber">교육번호</Label>
              <Input
                id="trainingNumber"
                value={formData.trainingNumber}
                onChange={(e) => handleInputChange("trainingNumber", e.target.value)}
                readOnly
                className="bg-muted"
              />
            </div>
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
              <Label htmlFor="trainingDateTime">교육일시</Label>
              <Input
                id="trainingDateTime"
                type="datetime-local"
                value={formData.trainingDateTime}
                onChange={(e) => handleInputChange("trainingDateTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingLocation">교육장소</Label>
              <Input
                id="trainingLocation"
                value={formData.trainingLocation}
                onChange={(e) => handleInputChange("trainingLocation", e.target.value)}
                placeholder="교육장소를 입력하세요"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            교육 기본정보
          </TabsTrigger>
          <TabsTrigger value="attendees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            교육 대상자
          </TabsTrigger>
          <TabsTrigger value="effectiveness" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            교육 효과 평가
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            교육 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Training Info */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>교육정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>교육유형</Label>
                  <Select
                    value={formData.trainingType}
                    onValueChange={(value) => handleInputChange("trainingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="교육유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-employee">신입교육</SelectItem>
                      <SelectItem value="regular">정기교육</SelectItem>
                      <SelectItem value="special">특별교육</SelectItem>
                      <SelectItem value="qualification">자격교육</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>강사 유형</Label>
                  <Select
                    value={formData.instructorType}
                    onValueChange={(value) => handleInputChange("instructorType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="강사 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">내부강사</SelectItem>
                      <SelectItem value="external">외부강사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructorName">강사명</Label>
                  <Input
                    id="instructorName"
                    value={formData.instructorName}
                    onChange={(e) => handleInputChange("instructorName", e.target.value)}
                    placeholder="강사명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingHours">교육시간 (시간)</Label>
                  <Input
                    id="trainingHours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.trainingHours || ""}
                    onChange={(e) => handleInputChange("trainingHours", parseFloat(e.target.value) || 0)}
                    placeholder="교육시간을 입력하세요"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainingContent">교육내용</Label>
                <Textarea
                  id="trainingContent"
                  value={formData.trainingContent}
                  onChange={(e) => handleInputChange("trainingContent", e.target.value)}
                  placeholder="교육내용을 상세히 입력하세요"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainingMaterials">교육자료</Label>
                <Textarea
                  id="trainingMaterials"
                  value={formData.trainingMaterials}
                  onChange={(e) => handleInputChange("trainingMaterials", e.target.value)}
                  placeholder="교육에 사용된 자료 목록을 입력하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Attendees */}
        <TabsContent value="attendees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>교육 대상자 목록</CardTitle>
              <Button onClick={addAttendee} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                대상자 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">성명</TableHead>
                    <TableHead className="w-[150px]">부서</TableHead>
                    <TableHead className="w-[100px]">직급</TableHead>
                    <TableHead className="w-[120px]">출석여부</TableHead>
                    <TableHead className="w-[100px]">점수</TableHead>
                    <TableHead className="w-[120px]">합격여부</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        등록된 교육 대상자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell>
                          <Input
                            value={attendee.name}
                            onChange={(e) => handleAttendeeChange(attendee.id, "name", e.target.value)}
                            placeholder="이름"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attendee.department}
                            onChange={(e) => handleAttendeeChange(attendee.id, "department", e.target.value)}
                            placeholder="부서"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={attendee.position}
                            onChange={(e) => handleAttendeeChange(attendee.id, "position", e.target.value)}
                            placeholder="직급"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attendee.attendance}
                            onValueChange={(value) => handleAttendeeChange(attendee.id, "attendance", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">출석</SelectItem>
                              <SelectItem value="absent">결석</SelectItem>
                              <SelectItem value="late">지각</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={attendee.score ?? ""}
                            onChange={(e) => handleAttendeeChange(attendee.id, "score", e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="점수"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={attendee.passed === null ? "" : attendee.passed ? "pass" : "fail"}
                            onValueChange={(value) => handleAttendeeChange(attendee.id, "passed", value === "" ? null : value === "pass")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pass">합격</SelectItem>
                              <SelectItem value="fail">불합격</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttendee(attendee.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {attendees.length > 0 && (
                <div className="mt-4 flex justify-end gap-4 text-sm text-muted-foreground">
                  <span>총 인원: {attendees.length}명</span>
                  <span>출석: {attendees.filter((a) => a.attendance === "present").length}명</span>
                  <span>합격: {attendees.filter((a) => a.passed === true).length}명</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Effectiveness Evaluation */}
        <TabsContent value="effectiveness">
          <Card>
            <CardHeader>
              <CardTitle>교육 효과 평가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="postEvaluation">교육 후 평가</Label>
                <Textarea
                  id="postEvaluation"
                  value={formData.postEvaluation}
                  onChange={(e) => handleInputChange("postEvaluation", e.target.value)}
                  placeholder="교육 후 평가 결과를 입력하세요 (교육 목표 달성도, 교육생 반응, 학습 성과 등)"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="improvements">개선사항</Label>
                <Textarea
                  id="improvements"
                  value={formData.improvements}
                  onChange={(e) => handleInputChange("improvements", e.target.value)}
                  placeholder="향후 교육 개선을 위한 사항을 입력하세요"
                  rows={6}
                />
              </div>
              {/* Summary Statistics */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-3">교육 결과 요약</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{attendees.length}</div>
                    <div className="text-sm text-muted-foreground">총 교육 인원</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {attendees.filter((a) => a.attendance === "present").length}
                    </div>
                    <div className="text-sm text-muted-foreground">출석 인원</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {attendees.filter((a) => a.score !== null).length > 0
                        ? Math.round(
                            attendees
                              .filter((a) => a.score !== null)
                              .reduce((sum, a) => sum + (a.score || 0), 0) /
                              attendees.filter((a) => a.score !== null).length
                          )
                        : "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">평균 점수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {attendees.length > 0
                        ? Math.round(
                            (attendees.filter((a) => a.passed === true).length / attendees.length) * 100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">합격률</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>교육 이력</CardTitle>
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
                                : "success"
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
