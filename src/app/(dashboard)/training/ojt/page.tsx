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
import { UserPlus, Save, Plus, Trash2, FileText, Calendar, ClipboardCheck, History } from "lucide-react";

// Types
interface DepartmentTraining {
  id: string;
  department: string;
  startDate: string;
  endDate: string;
  content: string;
  evaluator: string;
  evaluationResult: "excellent" | "good" | "fair" | "poor" | "";
}

interface DailySchedule {
  id: string;
  date: string;
  day: string;
  department: string;
  topic: string;
  instructor: string;
  hours: number;
  location: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface TrainingResult {
  id: string;
  department: string;
  period: string;
  content: string;
  evaluator: string;
  evaluationScore: number | null;
  evaluationResult: "excellent" | "good" | "fair" | "poor" | "";
  feedback: string;
  supervisorName: string;
  supervisorApproved: boolean;
}

interface OJTHistory {
  id: string;
  employeeName: string;
  department: string;
  ojNumber: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  result: "completed" | "ongoing" | "cancelled";
  finalEvaluation: string;
}

// Initial data
interface OJTPlanForm {
  ojNumber: string;
  employeeName: string;
  employeeNo: string;
  hireDate: string;
  department: string;
  position: string;
  trainingStartDate: string;
  trainingEndDate: string;
  supervisor: string;
  mentor: string;
  remarks: string;
}

const initialFormData: OJTPlanForm = {
  ojNumber: "OJT-2026-001",
  employeeName: "",
  employeeNo: "",
  hireDate: "",
  department: "",
  position: "",
  trainingStartDate: "",
  trainingEndDate: "",
  supervisor: "",
  mentor: "",
  remarks: "",
};

const initialDepartmentTraining: DepartmentTraining[] = [
  {
    id: "1",
    department: "품질관리팀",
    startDate: "2026-06-10",
    endDate: "2026-06-14",
    content: "품질관리 기초, 검사기준 이해, 품질시스템 교육",
    evaluator: "김품질",
    evaluationResult: "",
  },
  {
    id: "2",
    department: "생산팀",
    startDate: "2026-06-17",
    endDate: "2026-06-21",
    content: "생산공정 이해, 설비운전 기초, 안전교육",
    evaluator: "이생산",
    evaluationResult: "",
  },
  {
    id: "3",
    department: "영업팀",
    startDate: "2026-06-24",
    endDate: "2026-06-28",
    content: "제품소개, 고객응대, 영업프로세스",
    evaluator: "박영업",
    evaluationResult: "",
  },
];

const initialDailySchedule: DailySchedule[] = [
  { id: "1", date: "2026-06-10", day: "월", department: "품질관리팀", topic: "오리엔테이션 및 팀 소개", instructor: "김품질", hours: 4, location: "대회의실", status: "scheduled" },
  { id: "2", date: "2026-06-10", day: "월", department: "품질관리팀", topic: "품질매뉴얼 및 절차서 학습", instructor: "김품질", hours: 4, location: "품질관리팀", status: "scheduled" },
  { id: "3", date: "2026-06-11", day: "화", department: "품질관리팀", topic: "검사기준 및 측정장비 교육", instructor: "최검사", hours: 8, location: "검사실", status: "scheduled" },
  { id: "4", date: "2026-06-12", day: "수", department: "품질관리팀", topic: "불량유형 및 처리절차", instructor: "김품질", hours: 8, location: "품질관리팀", status: "scheduled" },
  { id: "5", date: "2026-06-13", day: "목", department: "품질관리팀", topic: "품질시스템(ISO) 교육", instructor: "이품질", hours: 8, location: "대회의실", status: "scheduled" },
  { id: "6", date: "2026-06-14", day: "금", department: "품질관리팀", topic: "실습 및 평가", instructor: "김품질", hours: 8, location: "검사실", status: "scheduled" },
];

const initialTrainingResults: TrainingResult[] = [
  {
    id: "1",
    department: "품질관리팀",
    period: "2026-06-10 ~ 2026-06-14",
    content: "품질관리 기초, 검사기준 이해, 품질시스템 교육",
    evaluator: "김품질",
    evaluationScore: null,
    evaluationResult: "",
    feedback: "",
    supervisorName: "",
    supervisorApproved: false,
  },
];

const initialOJTHistory: OJTHistory[] = [
  {
    id: "1",
    employeeName: "홍길동",
    department: "품질관리팀",
    ojNumber: "OJT-2025-012",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    totalDays: 22,
    result: "completed",
    finalEvaluation: "우수",
  },
  {
    id: "2",
    employeeName: "김철수",
    department: "생산팀",
    ojNumber: "OJT-2025-015",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    totalDays: 23,
    result: "completed",
    finalEvaluation: "양호",
  },
  {
    id: "3",
    employeeName: "이영희",
    department: "영업팀",
    ojNumber: "OJT-2026-001",
    startDate: "2026-01-15",
    endDate: "2026-02-14",
    totalDays: 22,
    result: "completed",
    finalEvaluation: "우수",
  },
];

const evaluationLabels: Record<string, string> = {
  excellent: "우수",
  good: "양호",
  fair: "보통",
  poor: "미흡",
};

const statusLabels: Record<string, string> = {
  scheduled: "예정",
  completed: "완료",
  cancelled: "취소",
};

const resultLabels: Record<string, string> = {
  completed: "수료",
  ongoing: "진행중",
  cancelled: "중단",
};

export default function NewEmployeeOJTPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [formData, setFormData] = useState<OJTPlanForm>(initialFormData);
  const [departmentTraining, setDepartmentTraining] = useState<DepartmentTraining[]>(initialDepartmentTraining);
  const [dailySchedule, setDailySchedule] = useState<DailySchedule[]>(initialDailySchedule);
  const [trainingResults, setTrainingResults] = useState<TrainingResult[]>(initialTrainingResults);
  const [ojtHistory] = useState<OJTHistory[]>(initialOJTHistory);

  const handleInputChange = (field: keyof OJTPlanForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDepartmentTrainingChange = (id: string, field: keyof DepartmentTraining, value: string) => {
    setDepartmentTraining((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const addDepartmentTraining = () => {
    const newTraining: DepartmentTraining = {
      id: Date.now().toString(),
      department: "",
      startDate: "",
      endDate: "",
      content: "",
      evaluator: "",
      evaluationResult: "",
    };
    setDepartmentTraining((prev) => [...prev, newTraining]);
  };

  const removeDepartmentTraining = (id: string) => {
    setDepartmentTraining((prev) => prev.filter((d) => d.id !== id));
  };

  const handleScheduleChange = (id: string, field: keyof DailySchedule, value: string | number) => {
    setDailySchedule((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addScheduleItem = () => {
    const newItem: DailySchedule = {
      id: Date.now().toString(),
      date: "",
      day: "",
      department: "",
      topic: "",
      instructor: "",
      hours: 8,
      location: "",
      status: "scheduled",
    };
    setDailySchedule((prev) => [...prev, newItem]);
  };

  const removeScheduleItem = (id: string) => {
    setDailySchedule((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResultChange = (id: string, field: keyof TrainingResult, value: string | number | boolean | null) => {
    setTrainingResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = () => {
    console.log("Saving OJT plan:", { formData, departmentTraining, dailySchedule, trainingResults });
    alert("신입사원 OJT 계획서가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">신입사원 OJT 계획서</h1>
          <p className="text-muted-foreground">신입사원 현장직무교육 계획 및 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Employee Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            신입사원 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ojNumber">OJT 번호</Label>
              <Input
                id="ojNumber"
                value={formData.ojNumber}
                onChange={(e) => handleInputChange("ojNumber", e.target.value)}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeNo">사번</Label>
              <Input
                id="employeeNo"
                value={formData.employeeNo}
                onChange={(e) => handleInputChange("employeeNo", e.target.value)}
                placeholder="사번을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeName">성명</Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                onChange={(e) => handleInputChange("employeeName", e.target.value)}
                placeholder="성명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">입사일</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">소속부서</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleInputChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="품질관리팀">품질관리팀</SelectItem>
                  <SelectItem value="생산팀">생산팀</SelectItem>
                  <SelectItem value="영업팀">영업팀</SelectItem>
                  <SelectItem value="개발팀">개발팀</SelectItem>
                  <SelectItem value="관리팀">관리팀</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">직급</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleInputChange("position", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="직급 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="사원">사원</SelectItem>
                  <SelectItem value="주임">주임</SelectItem>
                  <SelectItem value="대리">대리</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingStartDate">교육시작일</Label>
              <Input
                id="trainingStartDate"
                type="date"
                value={formData.trainingStartDate}
                onChange={(e) => handleInputChange("trainingStartDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingEndDate">교육종료일</Label>
              <Input
                id="trainingEndDate"
                type="date"
                value={formData.trainingEndDate}
                onChange={(e) => handleInputChange("trainingEndDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor">지도담당자</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => handleInputChange("supervisor", e.target.value)}
                placeholder="지도담당자를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor">멘토</Label>
              <Input
                id="mentor"
                value={formData.mentor}
                onChange={(e) => handleInputChange("mentor", e.target.value)}
                placeholder="멘토를 입력하세요"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remarks">비고</Label>
              <Input
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                placeholder="비고사항을 입력하세요"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            OJT 계획서
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            교육 일정
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            교육 결과 보고
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            OJT 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: OJT Plan */}
        <TabsContent value="plan">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>교육부서별 일정</CardTitle>
              <Button onClick={addDepartmentTraining} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                부서 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">교육부서</TableHead>
                    <TableHead className="w-[130px]">시작일</TableHead>
                    <TableHead className="w-[130px]">종료일</TableHead>
                    <TableHead>교육내용</TableHead>
                    <TableHead className="w-[120px]">확인자</TableHead>
                    <TableHead className="w-[120px]">평가결과</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentTraining.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        등록된 교육부서가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    departmentTraining.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell>
                          <Select
                            value={dept.department}
                            onValueChange={(value) => handleDepartmentTrainingChange(dept.id, "department", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="품질관리팀">품질관리팀</SelectItem>
                              <SelectItem value="생산팀">생산팀</SelectItem>
                              <SelectItem value="영업팀">영업팀</SelectItem>
                              <SelectItem value="개발팀">개발팀</SelectItem>
                              <SelectItem value="관리팀">관리팀</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={dept.startDate}
                            onChange={(e) => handleDepartmentTrainingChange(dept.id, "startDate", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={dept.endDate}
                            onChange={(e) => handleDepartmentTrainingChange(dept.id, "endDate", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={dept.content}
                            onChange={(e) => handleDepartmentTrainingChange(dept.id, "content", e.target.value)}
                            placeholder="교육내용"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={dept.evaluator}
                            onChange={(e) => handleDepartmentTrainingChange(dept.id, "evaluator", e.target.value)}
                            placeholder="확인자"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={dept.evaluationResult}
                            onValueChange={(value) => handleDepartmentTrainingChange(dept.id, "evaluationResult", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">우수</SelectItem>
                              <SelectItem value="good">양호</SelectItem>
                              <SelectItem value="fair">보통</SelectItem>
                              <SelectItem value="poor">미흡</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDepartmentTraining(dept.id)}
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
              {departmentTraining.length > 0 && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">교육기간 요약</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">총 교육부서: </span>
                      <span className="font-medium">{departmentTraining.length}개</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">평가완료: </span>
                      <span className="font-medium">{departmentTraining.filter((d) => d.evaluationResult).length}개</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">평가대기: </span>
                      <span className="font-medium">{departmentTraining.filter((d) => !d.evaluationResult).length}개</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Training Schedule */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>일별 교육 일정</CardTitle>
              <Button onClick={addScheduleItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                일정 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">날짜</TableHead>
                    <TableHead className="w-[60px]">요일</TableHead>
                    <TableHead className="w-[130px]">교육부서</TableHead>
                    <TableHead>교육주제</TableHead>
                    <TableHead className="w-[100px]">강사</TableHead>
                    <TableHead className="w-[80px]">시간</TableHead>
                    <TableHead className="w-[120px]">장소</TableHead>
                    <TableHead className="w-[100px]">상태</TableHead>
                    <TableHead className="w-[80px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailySchedule.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        등록된 교육 일정이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    dailySchedule.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            type="date"
                            value={item.date}
                            onChange={(e) => handleScheduleChange(item.id, "date", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.day}
                            onChange={(e) => handleScheduleChange(item.id, "day", e.target.value)}
                            placeholder="요일"
                            className="w-14"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.department}
                            onValueChange={(value) => handleScheduleChange(item.id, "department", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="품질관리팀">품질관리팀</SelectItem>
                              <SelectItem value="생산팀">생산팀</SelectItem>
                              <SelectItem value="영업팀">영업팀</SelectItem>
                              <SelectItem value="개발팀">개발팀</SelectItem>
                              <SelectItem value="관리팀">관리팀</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.topic}
                            onChange={(e) => handleScheduleChange(item.id, "topic", e.target.value)}
                            placeholder="교육주제"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.instructor}
                            onChange={(e) => handleScheduleChange(item.id, "instructor", e.target.value)}
                            placeholder="강사"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max="8"
                            value={item.hours}
                            onChange={(e) => handleScheduleChange(item.id, "hours", parseInt(e.target.value) || 0)}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.location}
                            onChange={(e) => handleScheduleChange(item.id, "location", e.target.value)}
                            placeholder="장소"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.status}
                            onValueChange={(value) => handleScheduleChange(item.id, "status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">예정</SelectItem>
                              <SelectItem value="completed">완료</SelectItem>
                              <SelectItem value="cancelled">취소</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScheduleItem(item.id)}
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
              {dailySchedule.length > 0 && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">일정 요약</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">총 교육일정: </span>
                      <span className="font-medium">{dailySchedule.length}건</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">총 교육시간: </span>
                      <span className="font-medium">{dailySchedule.reduce((sum, s) => sum + s.hours, 0)}시간</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">완료: </span>
                      <span className="font-medium text-green-600">{dailySchedule.filter((s) => s.status === "completed").length}건</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">예정: </span>
                      <span className="font-medium text-blue-600">{dailySchedule.filter((s) => s.status === "scheduled").length}건</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Training Results Report */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>부서별 교육 결과 보고</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {trainingResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">{result.department}</h4>
                    <Badge variant="outline">{result.period}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>교육내용</Label>
                      <Textarea
                        value={result.content}
                        onChange={(e) => handleResultChange(result.id, "content", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>평가점수</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={result.evaluationScore ?? ""}
                            onChange={(e) => handleResultChange(result.id, "evaluationScore", e.target.value ? parseInt(e.target.value) : null)}
                            placeholder="점수"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>평가결과</Label>
                          <Select
                            value={result.evaluationResult}
                            onValueChange={(value) => handleResultChange(result.id, "evaluationResult", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">우수</SelectItem>
                              <SelectItem value="good">양호</SelectItem>
                              <SelectItem value="fair">보통</SelectItem>
                              <SelectItem value="poor">미흡</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>평가자</Label>
                        <Input
                          value={result.evaluator}
                          onChange={(e) => handleResultChange(result.id, "evaluator", e.target.value)}
                          placeholder="평가자명"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>피드백 및 개선사항</Label>
                    <Textarea
                      value={result.feedback}
                      onChange={(e) => handleResultChange(result.id, "feedback", e.target.value)}
                      placeholder="교육에 대한 피드백 및 개선사항을 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label>확인자 (지도담당자)</Label>
                      <Input
                        value={result.supervisorName}
                        onChange={(e) => handleResultChange(result.id, "supervisorName", e.target.value)}
                        placeholder="확인자명"
                      />
                    </div>
                    <div className="flex items-end gap-4">
                      <Button
                        variant={result.supervisorApproved ? "default" : "outline"}
                        onClick={() => handleResultChange(result.id, "supervisorApproved", !result.supervisorApproved)}
                      >
                        {result.supervisorApproved ? "승인완료" : "승인처리"}
                      </Button>
                      {result.supervisorApproved && (
                        <Badge variant="success">확인완료</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-3">종합 평가 요약</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{trainingResults.length}</div>
                    <div className="text-sm text-muted-foreground">총 교육부서</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {trainingResults.filter((r) => r.evaluationResult).length}
                    </div>
                    <div className="text-sm text-muted-foreground">평가완료</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {trainingResults.filter((r) => r.evaluationScore !== null).length > 0
                        ? Math.round(
                            trainingResults
                              .filter((r) => r.evaluationScore !== null)
                              .reduce((sum, r) => sum + (r.evaluationScore || 0), 0) /
                              trainingResults.filter((r) => r.evaluationScore !== null).length
                          )
                        : "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">평균점수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {trainingResults.filter((r) => r.supervisorApproved).length}
                    </div>
                    <div className="text-sm text-muted-foreground">확인완료</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: OJT History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>OJT 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">OJT 번호</TableHead>
                    <TableHead className="w-[100px]">성명</TableHead>
                    <TableHead className="w-[120px]">소속부서</TableHead>
                    <TableHead className="w-[120px]">시작일</TableHead>
                    <TableHead className="w-[120px]">종료일</TableHead>
                    <TableHead className="w-[80px]">일수</TableHead>
                    <TableHead className="w-[100px]">결과</TableHead>
                    <TableHead>종합평가</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ojtHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        OJT 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    ojtHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.ojNumber}</TableCell>
                        <TableCell className="font-medium">{item.employeeName}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.startDate}</TableCell>
                        <TableCell>{item.endDate}</TableCell>
                        <TableCell className="text-center">{item.totalDays}일</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.result === "completed"
                                ? "success"
                                : item.result === "ongoing"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {resultLabels[item.result]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.finalEvaluation === "우수"
                                ? "success"
                                : item.finalEvaluation === "양호"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {item.finalEvaluation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {ojtHistory.length > 0 && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">OJT 통계</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">총 OJT 건수: </span>
                      <span className="font-medium">{ojtHistory.length}건</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">수료: </span>
                      <span className="font-medium text-green-600">{ojtHistory.filter((h) => h.result === "completed").length}건</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">진행중: </span>
                      <span className="font-medium text-blue-600">{ojtHistory.filter((h) => h.result === "ongoing").length}건</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">평균 교육일수: </span>
                      <span className="font-medium">
                        {ojtHistory.length > 0
                          ? Math.round(ojtHistory.reduce((sum, h) => sum + h.totalDays, 0) / ojtHistory.length)
                          : 0}
                        일
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
