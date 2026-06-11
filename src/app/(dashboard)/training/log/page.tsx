"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Save, Plus, Trash2, FileText, Users, ClipboardCheck, History, CheckCircle } from "lucide-react";
import { getActiveTrainingCourses, type TrainingCourse } from "@/lib/master-data";

// Types
interface Attendee {
  id: string;
  name: string;
  department: string;
  position: string;
  signature: boolean;
  attendanceConfirmed: boolean;
}

interface EvaluationItem {
  id: string;
  category: string;
  item: string;
  score: number | null;
  maxScore: number;
  remarks: string;
}

interface TrainingHistoryEntry {
  id: string;
  date: string;
  trainingName: string;
  trainingType: string;
  instructor: string;
  attendeeCount: number;
  status: "completed" | "scheduled" | "cancelled";
}

interface TrainingLogForm {
  // Basic Info
  logNumber: string;
  trainingDate: string;
  trainingCourseCode: string; // Course code from master data
  trainingTime: string;
  // Instructor
  instructorType: "internal" | "external";
  instructorName: string;
  instructorDepartment: string;
  // Content
  trainingContent: string;
  trainingObjective: string;
  trainingMaterials: string;
}

// Initial data
const initialFormData: TrainingLogForm = {
  logNumber: "LOG-2026-001",
  trainingDate: "",
  trainingCourseCode: "",
  trainingTime: "",
  instructorType: "internal",
  instructorName: "",
  instructorDepartment: "",
  trainingContent: "",
  trainingObjective: "",
  trainingMaterials: "",
};

const initialAttendees: Attendee[] = [
  { id: "1", name: "김철수", department: "품질관리팀", position: "대리", signature: true, attendanceConfirmed: true },
  { id: "2", name: "이영희", department: "생산팀", position: "사원", signature: true, attendanceConfirmed: true },
  { id: "3", name: "박지성", department: "품질관리팀", position: "주임", signature: false, attendanceConfirmed: false },
];

const initialEvaluationItems: EvaluationItem[] = [
  { id: "1", category: "교육내용", item: "교육 목표 달성도", score: 4, maxScore: 5, remarks: "목표 대비 80% 달성" },
  { id: "2", category: "교육내용", item: "교육 내용의 적절성", score: 5, maxScore: 5, remarks: "우수" },
  { id: "3", category: "강사", item: "강사의 전문성", score: 4, maxScore: 5, remarks: "" },
  { id: "4", category: "강사", item: "교수법 및 전달력", score: 4, maxScore: 5, remarks: "" },
  { id: "5", category: "교육환경", item: "교육장소 적합성", score: 3, maxScore: 5, remarks: "공간 협소" },
  { id: "6", category: "교육환경", item: "교육자료 적합성", score: 4, maxScore: 5, remarks: "" },
];

const initialHistory: TrainingHistoryEntry[] = [
  { id: "1", date: "2026-06-05", trainingName: "품질관리 기초 교육", trainingType: "정기", instructor: "김품질 과장", attendeeCount: 15, status: "completed" },
  { id: "2", date: "2026-06-01", trainingName: "IATF 16949 인식 교육", trainingType: "특별", instructor: "외부강사", attendeeCount: 25, status: "completed" },
  { id: "3", date: "2026-05-25", trainingName: "불량 대응 교육", trainingType: "품질문제발생시", instructor: "이품질 대리", attendeeCount: 10, status: "completed" },
  { id: "4", date: "2026-06-15", trainingName: "SPC 실무 교육", trainingType: "정기", instructor: "박통계 과장", attendeeCount: 12, status: "scheduled" },
];

const statusLabels: Record<string, string> = {
  "completed": "완료",
  "scheduled": "예정",
  "cancelled": "취소",
};

export default function TrainingLogPage() {
  // Get training courses from master data
  const trainingCourses = useMemo(() => getActiveTrainingCourses(), []);

  const [activeTab, setActiveTab] = useState("registration");
  const [formData, setFormData] = useState<TrainingLogForm>(initialFormData);
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [evaluationItems, setEvaluationItems] = useState<EvaluationItem[]>(initialEvaluationItems);
  const [history] = useState<TrainingHistoryEntry[]>(initialHistory);

  // Get selected course details
  const selectedCourse = useMemo(() => {
    return trainingCourses.find((c) => c.code === formData.trainingCourseCode);
  }, [formData.trainingCourseCode, trainingCourses]);

  const handleInputChange = (field: keyof TrainingLogForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAttendeeChange = (id: string, field: keyof Attendee, value: string | boolean) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleEvaluationChange = (id: string, field: keyof EvaluationItem, value: string | number | null) => {
    setEvaluationItems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addAttendee = () => {
    const newAttendee: Attendee = {
      id: Date.now().toString(),
      name: "",
      department: "",
      position: "",
      signature: false,
      attendanceConfirmed: false,
    };
    setAttendees((prev) => [...prev, newAttendee]);
  };

  const removeAttendee = (id: string) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const addEvaluationItem = () => {
    const newItem: EvaluationItem = {
      id: Date.now().toString(),
      category: "",
      item: "",
      score: null,
      maxScore: 5,
      remarks: "",
    };
    setEvaluationItems((prev) => [...prev, newItem]);
  };

  const removeEvaluationItem = (id: string) => {
    setEvaluationItems((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSave = () => {
    console.log("Saving training log:", { formData, attendees, evaluationItems });
    alert("교육일지가 저장되었습니다.");
  };

  const calculateAverageScore = () => {
    const scoredItems = evaluationItems.filter((e) => e.score !== null);
    if (scoredItems.length === 0) return 0;
    const totalScore = scoredItems.reduce((sum, e) => sum + (e.score || 0), 0);
    const totalMaxScore = scoredItems.reduce((sum, e) => sum + e.maxScore, 0);
    return Math.round((totalScore / totalMaxScore) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">교 육 일 지</h1>
          <p className="text-muted-foreground">교육 등록, 참석자 관리 및 효과 평가</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            교육 등록
          </TabsTrigger>
          <TabsTrigger value="attendees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            참석자 명단
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

        {/* Tab 1: Training Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                교육 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logNumber">일지번호</Label>
                  <Input
                    id="logNumber"
                    value={formData.logNumber}
                    onChange={(e) => handleInputChange("logNumber", e.target.value)}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingDate">교육일자</Label>
                  <Input
                    id="trainingDate"
                    type="date"
                    value={formData.trainingDate}
                    onChange={(e) => handleInputChange("trainingDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>교육과정</Label>
                  <Select
                    value={formData.trainingCourseCode}
                    onValueChange={(value) => handleInputChange("trainingCourseCode", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="교육과정 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainingCourses.map((course) => (
                        <SelectItem key={course.code} value={course.code}>
                          {course.name} ({course.type} / {course.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingTime">교육시간</Label>
                  <Input
                    id="trainingTime"
                    value={formData.trainingTime}
                    onChange={(e) => handleInputChange("trainingTime", e.target.value)}
                    placeholder="예: 09:00~12:00 (3시간)"
                  />
                </div>
              </div>

              {/* Selected course details */}
              {selectedCourse && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <div className="grid grid-cols-5 gap-2">
                    <div><span className="text-muted-foreground">유형:</span> {selectedCourse.type}</div>
                    <div><span className="text-muted-foreground">분류:</span> {selectedCourse.category}</div>
                    <div><span className="text-muted-foreground">기본시간:</span> {selectedCourse.duration}시간</div>
                    <div><span className="text-muted-foreground">주기:</span> {selectedCourse.frequency}</div>
                    <div><span className="text-muted-foreground">필수:</span> {selectedCourse.isRequired ? "예" : "아니오"}</div>
                  </div>
                  <div className="mt-2 text-muted-foreground">{selectedCourse.description}</div>
                </div>
              )}

              {/* Instructor */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>강사</Label>
                  <Select
                    value={formData.instructorType}
                    onValueChange={(value) => handleInputChange("instructorType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="강사 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">내부</SelectItem>
                      <SelectItem value="external">외부</SelectItem>
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
                  <Label htmlFor="instructorDepartment">소속</Label>
                  <Input
                    id="instructorDepartment"
                    value={formData.instructorDepartment}
                    onChange={(e) => handleInputChange("instructorDepartment", e.target.value)}
                    placeholder="소속을 입력하세요"
                  />
                </div>
              </div>

              {/* Training Content */}
              <div className="space-y-2">
                <Label htmlFor="trainingObjective">교육목표</Label>
                <Textarea
                  id="trainingObjective"
                  value={formData.trainingObjective}
                  onChange={(e) => handleInputChange("trainingObjective", e.target.value)}
                  placeholder="교육 목표를 입력하세요"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainingContent">교육내용</Label>
                <Textarea
                  id="trainingContent"
                  value={formData.trainingContent}
                  onChange={(e) => handleInputChange("trainingContent", e.target.value)}
                  placeholder="교육 내용을 상세히 입력하세요"
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trainingMaterials">교육자료</Label>
                <Textarea
                  id="trainingMaterials"
                  value={formData.trainingMaterials}
                  onChange={(e) => handleInputChange("trainingMaterials", e.target.value)}
                  placeholder="사용된 교육 자료 목록을 입력하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Attendee List */}
        <TabsContent value="attendees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                참석자 명단
              </CardTitle>
              <Button onClick={addAttendee} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                참석자 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">번호</TableHead>
                    <TableHead className="w-[150px]">성명</TableHead>
                    <TableHead className="w-[150px]">부서</TableHead>
                    <TableHead className="w-[100px]">직급</TableHead>
                    <TableHead className="w-[120px] text-center">서명</TableHead>
                    <TableHead className="w-[120px] text-center">출석확인</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        등록된 참석자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendees.map((attendee, index) => (
                      <TableRow key={attendee.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
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
                        <TableCell className="text-center">
                          <Button
                            variant={attendee.signature ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAttendeeChange(attendee.id, "signature", !attendee.signature)}
                          >
                            {attendee.signature ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              "서명"
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant={attendee.attendanceConfirmed ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAttendeeChange(attendee.id, "attendanceConfirmed", !attendee.attendanceConfirmed)}
                          >
                            {attendee.attendanceConfirmed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              "확인"
                            )}
                          </Button>
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
                  <span>서명완료: {attendees.filter((a) => a.signature).length}명</span>
                  <span>출석확인: {attendees.filter((a) => a.attendanceConfirmed).length}명</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Effectiveness Evaluation */}
        <TabsContent value="effectiveness">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                교육 효과 평가
              </CardTitle>
              <Button onClick={addEvaluationItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                평가항목 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">분류</TableHead>
                    <TableHead className="w-[200px]">평가항목</TableHead>
                    <TableHead className="w-[100px] text-center">평가결과</TableHead>
                    <TableHead className="w-[100px] text-center">만점</TableHead>
                    <TableHead>비고</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        등록된 평가항목이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    evaluationItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.category}
                            onChange={(e) => handleEvaluationChange(item.id, "category", e.target.value)}
                            placeholder="분류"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.item}
                            onChange={(e) => handleEvaluationChange(item.id, "item", e.target.value)}
                            placeholder="평가항목"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={item.maxScore}
                            value={item.score ?? ""}
                            onChange={(e) => handleEvaluationChange(item.id, "score", e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="점수"
                            className="text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.maxScore}
                            onChange={(e) => handleEvaluationChange(item.id, "maxScore", parseInt(e.target.value) || 5)}
                            className="text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.remarks}
                            onChange={(e) => handleEvaluationChange(item.id, "remarks", e.target.value)}
                            placeholder="비고"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEvaluationItem(item.id)}
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

              {/* Evaluation Summary */}
              {evaluationItems.length > 0 && (
                <div className="mt-6 border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-3">평가 결과 요약</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{evaluationItems.length}</div>
                      <div className="text-sm text-muted-foreground">총 평가항목</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {evaluationItems.filter((e) => e.score !== null).reduce((sum, e) => sum + (e.score || 0), 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">총 점수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-muted-foreground">
                        {evaluationItems.reduce((sum, e) => sum + e.maxScore, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">총 만점</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${calculateAverageScore() >= 80 ? "text-green-600" : calculateAverageScore() >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                        {calculateAverageScore()}%
                      </div>
                      <div className="text-sm text-muted-foreground">달성률</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Training History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                교육 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">교육일자</TableHead>
                    <TableHead>교육명</TableHead>
                    <TableHead className="w-[120px]">교육유형</TableHead>
                    <TableHead className="w-[150px]">강사</TableHead>
                    <TableHead className="w-[100px] text-center">참석인원</TableHead>
                    <TableHead className="w-[100px] text-center">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        기록된 교육 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.date}</TableCell>
                        <TableCell className="font-medium">{item.trainingName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.trainingType === "정기"
                                ? "default"
                                : item.trainingType === "특별"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {item.trainingType}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.instructor}</TableCell>
                        <TableCell className="text-center">{item.attendeeCount}명</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              item.status === "completed"
                                ? "success"
                                : item.status === "scheduled"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {statusLabels[item.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {history.length > 0 && (
                <div className="mt-4 flex justify-end gap-4 text-sm text-muted-foreground">
                  <span>총 교육: {history.length}건</span>
                  <span>완료: {history.filter((h) => h.status === "completed").length}건</span>
                  <span>예정: {history.filter((h) => h.status === "scheduled").length}건</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
