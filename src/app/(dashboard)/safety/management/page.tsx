"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  ClipboardCheck,
  AlertTriangle,
  Shield,
  GraduationCap,
  Save,
  Trash2,
  Search,
  Calendar,
  User,
  MapPin,
  FileText,
} from "lucide-react";

// Types
interface SafetyInspection {
  id: number;
  inspectionDate: string;
  inspector: string;
  inspectionArea: string;
  items: InspectionItem[];
  remarks: string;
  createdAt: string;
}

interface InspectionItem {
  id: number;
  itemName: string;
  result: "양호" | "불량" | "";
  action: string;
}

interface RiskAssessment {
  id: number;
  assessmentDate: string;
  processName: string;
  hazardFactor: string;
  frequency: number;
  severity: number;
  riskLevel: number;
  mitigationMeasure: string;
  residualRisk: string;
  responsible: string;
  status: string;
}

interface SafetyAccident {
  id: number;
  accidentDate: string;
  accidentTime: string;
  victimName: string;
  victimDepartment: string;
  accidentType: string;
  accidentLocation: string;
  accidentDescription: string;
  causeAnalysis: string;
  preventionMeasure: string;
  status: string;
  reportedBy: string;
}

interface SafetyTraining {
  id: number;
  trainingDate: string;
  trainingTitle: string;
  trainingType: string;
  trainer: string;
  trainees: string;
  traineeCount: number;
  duration: string;
  content: string;
  status: string;
}

// Constants
const INSPECTION_ITEMS = [
  "소화기",
  "비상구",
  "보호구",
  "안전표지",
  "전기설비",
  "가스설비",
  "작업통로",
  "환기시설",
  "조명시설",
  "안전난간",
];

const INSPECTION_AREAS = [
  "생산1라인",
  "생산2라인",
  "사출공장",
  "조립공장",
  "창고",
  "사무실",
  "식당",
  "주차장",
  "옥외구역",
];

const ACCIDENT_TYPES = [
  "추락",
  "전도",
  "충돌",
  "낙하/비래",
  "협착",
  "절단/베임",
  "감전",
  "화상",
  "화재/폭발",
  "질식",
  "중독",
  "기타",
];

const TRAINING_TYPES = [
  "신규채용자 교육",
  "정기 안전교육",
  "특별 안전교육",
  "작업내용 변경시 교육",
  "관리감독자 교육",
  "안전보건관리책임자 교육",
  "위험성평가 교육",
  "비상대응훈련",
];

const DEPARTMENTS = [
  "생산팀",
  "품질팀",
  "설비팀",
  "생산기술팀",
  "물류팀",
  "안전환경팀",
  "총무팀",
  "경영지원팀",
];

// Initial data
const initialInspections: SafetyInspection[] = [
  {
    id: 1,
    inspectionDate: "2026-06-01",
    inspector: "김안전",
    inspectionArea: "생산1라인",
    items: [
      { id: 1, itemName: "소화기", result: "양호", action: "" },
      { id: 2, itemName: "비상구", result: "양호", action: "" },
      { id: 3, itemName: "보호구", result: "불량", action: "안전화 5켤레 추가 배치" },
      { id: 4, itemName: "안전표지", result: "양호", action: "" },
    ],
    remarks: "보호구 일부 마모 확인, 교체 필요",
    createdAt: "2026-06-01",
  },
  {
    id: 2,
    inspectionDate: "2026-05-15",
    inspector: "박점검",
    inspectionArea: "사출공장",
    items: [
      { id: 1, itemName: "소화기", result: "양호", action: "" },
      { id: 2, itemName: "전기설비", result: "양호", action: "" },
      { id: 3, itemName: "환기시설", result: "불량", action: "환풍기 1대 수리" },
      { id: 4, itemName: "작업통로", result: "양호", action: "" },
    ],
    remarks: "환기시설 점검 필요",
    createdAt: "2026-05-15",
  },
];

const initialRiskAssessments: RiskAssessment[] = [
  {
    id: 1,
    assessmentDate: "2026-05-20",
    processName: "사출성형 작업",
    hazardFactor: "고온 금형 접촉에 의한 화상",
    frequency: 3,
    severity: 4,
    riskLevel: 12,
    mitigationMeasure: "내열장갑 착용 의무화, 금형 보호커버 설치",
    residualRisk: "낮음",
    responsible: "생산팀장",
    status: "완료",
  },
  {
    id: 2,
    assessmentDate: "2026-05-22",
    processName: "프레스 작업",
    hazardFactor: "프레스 기계에 의한 협착",
    frequency: 2,
    severity: 5,
    riskLevel: 10,
    mitigationMeasure: "양수조작 방식 적용, 안전커버 설치",
    residualRisk: "중간",
    responsible: "설비팀장",
    status: "진행중",
  },
  {
    id: 3,
    assessmentDate: "2026-05-25",
    processName: "지게차 운반",
    hazardFactor: "지게차 충돌에 의한 부상",
    frequency: 4,
    severity: 3,
    riskLevel: 12,
    mitigationMeasure: "지게차 통행로 구분, 경광등/경고음 설치",
    residualRisk: "낮음",
    responsible: "물류팀장",
    status: "완료",
  },
];

const initialAccidents: SafetyAccident[] = [
  {
    id: 1,
    accidentDate: "2026-04-10",
    accidentTime: "14:30",
    victimName: "이작업",
    victimDepartment: "생산팀",
    accidentType: "절단/베임",
    accidentLocation: "생산2라인",
    accidentDescription: "날카로운 부품 모서리에 의한 손가락 베임 발생",
    causeAnalysis: "작업장갑 미착용, 안전수칙 미준수",
    preventionMeasure: "보호장갑 착용 의무화, 안전교육 재실시",
    status: "조치완료",
    reportedBy: "김안전",
  },
  {
    id: 2,
    accidentDate: "2026-03-22",
    accidentTime: "09:15",
    victimName: "박물류",
    victimDepartment: "물류팀",
    accidentType: "전도",
    accidentLocation: "창고",
    accidentDescription: "바닥 기름 미끄러짐으로 넘어져 무릎 타박상",
    causeAnalysis: "바닥 청결 관리 미흡, 미끄럼 방지 매트 미설치",
    preventionMeasure: "바닥 청소 주기 강화, 미끄럼 방지 매트 설치",
    status: "조치완료",
    reportedBy: "최안전",
  },
];

const initialTrainings: SafetyTraining[] = [
  {
    id: 1,
    trainingDate: "2026-06-05",
    trainingTitle: "2026년 상반기 정기 안전교육",
    trainingType: "정기 안전교육",
    trainer: "안전환경팀",
    trainees: "전 직원",
    traineeCount: 85,
    duration: "2시간",
    content: "산업안전보건법 주요 내용, 작업장 안전수칙, 개인보호구 착용법",
    status: "완료",
  },
  {
    id: 2,
    trainingDate: "2026-05-20",
    trainingTitle: "신규 입사자 안전교육",
    trainingType: "신규채용자 교육",
    trainer: "김안전",
    trainees: "신규 입사자 5명",
    traineeCount: 5,
    duration: "4시간",
    content: "회사 안전정책, 작업장 위험요소, 비상대피 절차, 보호구 사용법",
    status: "완료",
  },
  {
    id: 3,
    trainingDate: "2026-05-10",
    trainingTitle: "화재 예방 특별교육",
    trainingType: "특별 안전교육",
    trainer: "소방안전관리자",
    trainees: "생산팀, 설비팀",
    traineeCount: 35,
    duration: "1시간",
    content: "화재 예방 수칙, 소화기 사용법, 비상대피 훈련",
    status: "완료",
  },
  {
    id: 4,
    trainingDate: "2026-06-15",
    trainingTitle: "위험성평가 실무 교육",
    trainingType: "위험성평가 교육",
    trainer: "외부 전문강사",
    trainees: "관리감독자",
    traineeCount: 12,
    duration: "3시간",
    content: "위험성평가 절차, 위험요인 파악, 위험성 추정 및 결정 방법",
    status: "예정",
  },
];

export default function SafetyManagementPage() {
  const [activeTab, setActiveTab] = useState("inspection");

  // Inspection state
  const [inspections, setInspections] = useState<SafetyInspection[]>(initialInspections);
  const [inspectionForm, setInspectionForm] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    inspector: "",
    inspectionArea: "",
    items: INSPECTION_ITEMS.slice(0, 4).map((item, idx) => ({
      id: idx + 1,
      itemName: item,
      result: "" as "" | "양호" | "불량",
      action: "",
    })),
    remarks: "",
  });

  // Risk assessment state
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(initialRiskAssessments);
  const [riskForm, setRiskForm] = useState({
    assessmentDate: new Date().toISOString().split("T")[0],
    processName: "",
    hazardFactor: "",
    frequency: 1,
    severity: 1,
    mitigationMeasure: "",
    residualRisk: "",
    responsible: "",
  });

  // Accident state
  const [accidents, setAccidents] = useState<SafetyAccident[]>(initialAccidents);
  const [accidentForm, setAccidentForm] = useState({
    accidentDate: new Date().toISOString().split("T")[0],
    accidentTime: "",
    victimName: "",
    victimDepartment: "",
    accidentType: "",
    accidentLocation: "",
    accidentDescription: "",
    causeAnalysis: "",
    preventionMeasure: "",
    reportedBy: "",
  });

  // Training state
  const [trainings, setTrainings] = useState<SafetyTraining[]>(initialTrainings);
  const [trainingForm, setTrainingForm] = useState({
    trainingDate: new Date().toISOString().split("T")[0],
    trainingTitle: "",
    trainingType: "",
    trainer: "",
    trainees: "",
    traineeCount: "",
    duration: "",
    content: "",
  });

  // Inspection handlers
  const handleAddInspectionItem = () => {
    const availableItems = INSPECTION_ITEMS.filter(
      (item) => !inspectionForm.items.some((i) => i.itemName === item)
    );
    if (availableItems.length > 0) {
      setInspectionForm({
        ...inspectionForm,
        items: [
          ...inspectionForm.items,
          {
            id: inspectionForm.items.length + 1,
            itemName: availableItems[0],
            result: "",
            action: "",
          },
        ],
      });
    }
  };

  const handleRemoveInspectionItem = (id: number) => {
    setInspectionForm({
      ...inspectionForm,
      items: inspectionForm.items.filter((item) => item.id !== id),
    });
  };

  const handleInspectionItemChange = (
    id: number,
    field: "itemName" | "result" | "action",
    value: string
  ) => {
    setInspectionForm({
      ...inspectionForm,
      items: inspectionForm.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleSaveInspection = () => {
    if (!inspectionForm.inspectionDate || !inspectionForm.inspector || !inspectionForm.inspectionArea) {
      alert("필수 항목(점검일, 점검자, 점검구역)을 입력해주세요.");
      return;
    }

    const newInspection: SafetyInspection = {
      id: Date.now(),
      inspectionDate: inspectionForm.inspectionDate,
      inspector: inspectionForm.inspector,
      inspectionArea: inspectionForm.inspectionArea,
      items: inspectionForm.items.filter((item) => item.result !== ""),
      remarks: inspectionForm.remarks,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setInspections([newInspection, ...inspections]);
    setInspectionForm({
      inspectionDate: new Date().toISOString().split("T")[0],
      inspector: "",
      inspectionArea: "",
      items: INSPECTION_ITEMS.slice(0, 4).map((item, idx) => ({
        id: idx + 1,
        itemName: item,
        result: "",
        action: "",
      })),
      remarks: "",
    });
    alert("안전점검이 등록되었습니다.");
  };

  // Risk assessment handlers
  const handleSaveRiskAssessment = () => {
    if (!riskForm.processName || !riskForm.hazardFactor) {
      alert("필수 항목(작업/공정명, 위험요소)을 입력해주세요.");
      return;
    }

    const newAssessment: RiskAssessment = {
      id: Date.now(),
      assessmentDate: riskForm.assessmentDate,
      processName: riskForm.processName,
      hazardFactor: riskForm.hazardFactor,
      frequency: riskForm.frequency,
      severity: riskForm.severity,
      riskLevel: riskForm.frequency * riskForm.severity,
      mitigationMeasure: riskForm.mitigationMeasure,
      residualRisk: riskForm.residualRisk,
      responsible: riskForm.responsible,
      status: "진행중",
    };

    setRiskAssessments([newAssessment, ...riskAssessments]);
    setRiskForm({
      assessmentDate: new Date().toISOString().split("T")[0],
      processName: "",
      hazardFactor: "",
      frequency: 1,
      severity: 1,
      mitigationMeasure: "",
      residualRisk: "",
      responsible: "",
    });
    alert("위험성 평가가 등록되었습니다.");
  };

  // Accident handlers
  const handleSaveAccident = () => {
    if (!accidentForm.accidentDate || !accidentForm.victimName || !accidentForm.accidentType) {
      alert("필수 항목(사고일, 사고자, 사고유형)을 입력해주세요.");
      return;
    }

    const newAccident: SafetyAccident = {
      id: Date.now(),
      accidentDate: accidentForm.accidentDate,
      accidentTime: accidentForm.accidentTime,
      victimName: accidentForm.victimName,
      victimDepartment: accidentForm.victimDepartment,
      accidentType: accidentForm.accidentType,
      accidentLocation: accidentForm.accidentLocation,
      accidentDescription: accidentForm.accidentDescription,
      causeAnalysis: accidentForm.causeAnalysis,
      preventionMeasure: accidentForm.preventionMeasure,
      status: "조치중",
      reportedBy: accidentForm.reportedBy,
    };

    setAccidents([newAccident, ...accidents]);
    setAccidentForm({
      accidentDate: new Date().toISOString().split("T")[0],
      accidentTime: "",
      victimName: "",
      victimDepartment: "",
      accidentType: "",
      accidentLocation: "",
      accidentDescription: "",
      causeAnalysis: "",
      preventionMeasure: "",
      reportedBy: "",
    });
    alert("안전사고가 등록되었습니다.");
  };

  // Training handlers
  const handleSaveTraining = () => {
    if (!trainingForm.trainingDate || !trainingForm.trainingTitle || !trainingForm.trainingType) {
      alert("필수 항목(교육일, 교육명, 교육유형)을 입력해주세요.");
      return;
    }

    const newTraining: SafetyTraining = {
      id: Date.now(),
      trainingDate: trainingForm.trainingDate,
      trainingTitle: trainingForm.trainingTitle,
      trainingType: trainingForm.trainingType,
      trainer: trainingForm.trainer,
      trainees: trainingForm.trainees,
      traineeCount: Number(trainingForm.traineeCount) || 0,
      duration: trainingForm.duration,
      content: trainingForm.content,
      status: new Date(trainingForm.trainingDate) > new Date() ? "예정" : "완료",
    };

    setTrainings([newTraining, ...trainings]);
    setTrainingForm({
      trainingDate: new Date().toISOString().split("T")[0],
      trainingTitle: "",
      trainingType: "",
      trainer: "",
      trainees: "",
      traineeCount: "",
      duration: "",
      content: "",
    });
    alert("안전교육이 등록되었습니다.");
  };

  // Helper functions
  const getRiskLevelBadge = (level: number) => {
    if (level >= 15) return <Badge variant="destructive">매우높음 ({level})</Badge>;
    if (level >= 10) return <Badge variant="warning">높음 ({level})</Badge>;
    if (level >= 5) return <Badge variant="secondary">중간 ({level})</Badge>;
    return <Badge variant="success">낮음 ({level})</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "완료":
      case "조치완료":
        return <Badge variant="success">{status}</Badge>;
      case "진행중":
      case "조치중":
        return <Badge variant="warning">{status}</Badge>;
      case "예정":
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultBadge = (result: string) => {
    return result === "양호" ? (
      <Badge variant="success">양호</Badge>
    ) : result === "불량" ? (
      <Badge variant="destructive">불량</Badge>
    ) : (
      <Badge variant="outline">미점검</Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">안전관리</h1>
          <p className="text-muted-foreground">
            작업장 안전점검, 위험성 평가, 사고 관리 및 안전교육 이력 관리
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inspection" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            안전점검 등록
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            위험성 평가
          </TabsTrigger>
          <TabsTrigger value="accident" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            안전사고 관리
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            안전교육 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Safety Inspection */}
        <TabsContent value="inspection">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  안전점검 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspectionDate">점검일 *</Label>
                    <Input
                      id="inspectionDate"
                      type="date"
                      value={inspectionForm.inspectionDate}
                      onChange={(e) =>
                        setInspectionForm({ ...inspectionForm, inspectionDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inspector">점검자 *</Label>
                    <Input
                      id="inspector"
                      value={inspectionForm.inspector}
                      onChange={(e) =>
                        setInspectionForm({ ...inspectionForm, inspector: e.target.value })
                      }
                      placeholder="점검자명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inspectionArea">점검구역 *</Label>
                    <Select
                      value={inspectionForm.inspectionArea}
                      onValueChange={(value) =>
                        setInspectionForm({ ...inspectionForm, inspectionArea: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="점검구역 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {INSPECTION_AREAS.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">점검항목</Label>
                    <Button variant="outline" size="sm" onClick={handleAddInspectionItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      항목 추가
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">점검항목</TableHead>
                        <TableHead className="w-[150px]">점검결과</TableHead>
                        <TableHead>조치사항</TableHead>
                        <TableHead className="w-[80px]">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectionForm.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select
                              value={item.itemName}
                              onValueChange={(value) =>
                                handleInspectionItemChange(item.id, "itemName", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {INSPECTION_ITEMS.map((name) => (
                                  <SelectItem key={name} value={name}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.result}
                              onValueChange={(value) =>
                                handleInspectionItemChange(item.id, "result", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="양호">양호</SelectItem>
                                <SelectItem value="불량">불량</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.action}
                              onChange={(e) =>
                                handleInspectionItemChange(item.id, "action", e.target.value)
                              }
                              placeholder="불량 시 조치사항 입력"
                              disabled={item.result !== "불량"}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInspectionItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">비고</Label>
                  <Textarea
                    id="remarks"
                    value={inspectionForm.remarks}
                    onChange={(e) =>
                      setInspectionForm({ ...inspectionForm, remarks: e.target.value })
                    }
                    placeholder="특이사항 및 비고 입력"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveInspection}>
                    <Save className="mr-2 h-4 w-4" />
                    점검 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>안전점검 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {inspections.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    안전점검 이력이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>점검일</TableHead>
                        <TableHead>점검자</TableHead>
                        <TableHead>점검구역</TableHead>
                        <TableHead>점검항목 수</TableHead>
                        <TableHead>양호</TableHead>
                        <TableHead>불량</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspections.map((inspection) => {
                        const goodCount = inspection.items.filter((i) => i.result === "양호").length;
                        const badCount = inspection.items.filter((i) => i.result === "불량").length;
                        return (
                          <TableRow key={inspection.id}>
                            <TableCell>{formatDate(inspection.inspectionDate)}</TableCell>
                            <TableCell>{inspection.inspector}</TableCell>
                            <TableCell>{inspection.inspectionArea}</TableCell>
                            <TableCell>{inspection.items.length}개</TableCell>
                            <TableCell>
                              <Badge variant="success">{goodCount}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={badCount > 0 ? "destructive" : "outline"}>
                                {badCount}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {inspection.remarks || "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Risk Assessment */}
        <TabsContent value="risk">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  위험성 평가 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessmentDate">평가일</Label>
                    <Input
                      id="assessmentDate"
                      type="date"
                      value={riskForm.assessmentDate}
                      onChange={(e) =>
                        setRiskForm({ ...riskForm, assessmentDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processName">작업/공정명 *</Label>
                    <Input
                      id="processName"
                      value={riskForm.processName}
                      onChange={(e) =>
                        setRiskForm({ ...riskForm, processName: e.target.value })
                      }
                      placeholder="작업 또는 공정명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">담당자</Label>
                    <Input
                      id="responsible"
                      value={riskForm.responsible}
                      onChange={(e) =>
                        setRiskForm({ ...riskForm, responsible: e.target.value })
                      }
                      placeholder="담당자명 입력"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hazardFactor">위험요소 *</Label>
                  <Textarea
                    id="hazardFactor"
                    value={riskForm.hazardFactor}
                    onChange={(e) =>
                      setRiskForm({ ...riskForm, hazardFactor: e.target.value })
                    }
                    placeholder="위험요소를 상세히 기술하세요"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">빈도 (1-5)</Label>
                    <Select
                      value={riskForm.frequency.toString()}
                      onValueChange={(value) =>
                        setRiskForm({ ...riskForm, frequency: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - 거의 없음</SelectItem>
                        <SelectItem value="2">2 - 가끔</SelectItem>
                        <SelectItem value="3">3 - 보통</SelectItem>
                        <SelectItem value="4">4 - 자주</SelectItem>
                        <SelectItem value="5">5 - 매우 자주</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity">강도 (1-5)</Label>
                    <Select
                      value={riskForm.severity.toString()}
                      onValueChange={(value) =>
                        setRiskForm({ ...riskForm, severity: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - 경미</SelectItem>
                        <SelectItem value="2">2 - 약간</SelectItem>
                        <SelectItem value="3">3 - 보통</SelectItem>
                        <SelectItem value="4">4 - 심각</SelectItem>
                        <SelectItem value="5">5 - 치명적</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>위험성 수준 (빈도 x 강도)</Label>
                    <div className="h-10 flex items-center">
                      {getRiskLevelBadge(riskForm.frequency * riskForm.severity)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mitigationMeasure">저감 대책</Label>
                  <Textarea
                    id="mitigationMeasure"
                    value={riskForm.mitigationMeasure}
                    onChange={(e) =>
                      setRiskForm({ ...riskForm, mitigationMeasure: e.target.value })
                    }
                    placeholder="위험성을 낮추기 위한 대책을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residualRisk">잔여 위험성</Label>
                  <Select
                    value={riskForm.residualRisk}
                    onValueChange={(value) =>
                      setRiskForm({ ...riskForm, residualRisk: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="잔여 위험성 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="낮음">낮음</SelectItem>
                      <SelectItem value="중간">중간</SelectItem>
                      <SelectItem value="높음">높음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveRiskAssessment}>
                    <Save className="mr-2 h-4 w-4" />
                    평가 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>위험성 평가 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {riskAssessments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    위험성 평가 이력이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>평가일</TableHead>
                        <TableHead>작업/공정</TableHead>
                        <TableHead>위험요소</TableHead>
                        <TableHead>빈도</TableHead>
                        <TableHead>강도</TableHead>
                        <TableHead>위험수준</TableHead>
                        <TableHead>잔여위험</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riskAssessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell>{formatDate(assessment.assessmentDate)}</TableCell>
                          <TableCell className="font-medium">{assessment.processName}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {assessment.hazardFactor}
                          </TableCell>
                          <TableCell>{assessment.frequency}</TableCell>
                          <TableCell>{assessment.severity}</TableCell>
                          <TableCell>{getRiskLevelBadge(assessment.riskLevel)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                assessment.residualRisk === "낮음"
                                  ? "success"
                                  : assessment.residualRisk === "중간"
                                  ? "warning"
                                  : "destructive"
                              }
                            >
                              {assessment.residualRisk}
                            </Badge>
                          </TableCell>
                          <TableCell>{assessment.responsible}</TableCell>
                          <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Accident Management */}
        <TabsContent value="accident">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  안전사고 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accidentDate">사고일 *</Label>
                    <Input
                      id="accidentDate"
                      type="date"
                      value={accidentForm.accidentDate}
                      onChange={(e) =>
                        setAccidentForm({ ...accidentForm, accidentDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accidentTime">사고시간</Label>
                    <Input
                      id="accidentTime"
                      type="time"
                      value={accidentForm.accidentTime}
                      onChange={(e) =>
                        setAccidentForm({ ...accidentForm, accidentTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="victimName">사고자 *</Label>
                    <Input
                      id="victimName"
                      value={accidentForm.victimName}
                      onChange={(e) =>
                        setAccidentForm({ ...accidentForm, victimName: e.target.value })
                      }
                      placeholder="사고자명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="victimDepartment">소속부서</Label>
                    <Select
                      value={accidentForm.victimDepartment}
                      onValueChange={(value) =>
                        setAccidentForm({ ...accidentForm, victimDepartment: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="부서 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accidentType">사고유형 *</Label>
                    <Select
                      value={accidentForm.accidentType}
                      onValueChange={(value) =>
                        setAccidentForm({ ...accidentForm, accidentType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="사고유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCIDENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accidentLocation">사고장소</Label>
                    <Input
                      id="accidentLocation"
                      value={accidentForm.accidentLocation}
                      onChange={(e) =>
                        setAccidentForm({ ...accidentForm, accidentLocation: e.target.value })
                      }
                      placeholder="사고 발생 장소"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportedBy">보고자</Label>
                    <Input
                      id="reportedBy"
                      value={accidentForm.reportedBy}
                      onChange={(e) =>
                        setAccidentForm({ ...accidentForm, reportedBy: e.target.value })
                      }
                      placeholder="보고자명 입력"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accidentDescription">사고내용</Label>
                  <Textarea
                    id="accidentDescription"
                    value={accidentForm.accidentDescription}
                    onChange={(e) =>
                      setAccidentForm({ ...accidentForm, accidentDescription: e.target.value })
                    }
                    placeholder="사고 발생 경위 및 상황을 상세히 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="causeAnalysis">원인분석</Label>
                  <Textarea
                    id="causeAnalysis"
                    value={accidentForm.causeAnalysis}
                    onChange={(e) =>
                      setAccidentForm({ ...accidentForm, causeAnalysis: e.target.value })
                    }
                    placeholder="사고 원인을 분석하여 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preventionMeasure">재발방지대책</Label>
                  <Textarea
                    id="preventionMeasure"
                    value={accidentForm.preventionMeasure}
                    onChange={(e) =>
                      setAccidentForm({ ...accidentForm, preventionMeasure: e.target.value })
                    }
                    placeholder="재발 방지를 위한 대책을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveAccident}>
                    <Save className="mr-2 h-4 w-4" />
                    사고 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>안전사고 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {accidents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    안전사고 이력이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>사고일</TableHead>
                        <TableHead>사고자</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead>사고유형</TableHead>
                        <TableHead>사고장소</TableHead>
                        <TableHead>사고내용</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>보고자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accidents.map((accident) => (
                        <TableRow key={accident.id}>
                          <TableCell>
                            {formatDate(accident.accidentDate)}
                            {accident.accidentTime && (
                              <span className="text-muted-foreground ml-1">
                                {accident.accidentTime}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{accident.victimName}</TableCell>
                          <TableCell>{accident.victimDepartment}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{accident.accidentType}</Badge>
                          </TableCell>
                          <TableCell>{accident.accidentLocation}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {accident.accidentDescription}
                          </TableCell>
                          <TableCell>{getStatusBadge(accident.status)}</TableCell>
                          <TableCell>{accident.reportedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Safety Training History */}
        <TabsContent value="training">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  안전교육 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingDate">교육일 *</Label>
                    <Input
                      id="trainingDate"
                      type="date"
                      value={trainingForm.trainingDate}
                      onChange={(e) =>
                        setTrainingForm({ ...trainingForm, trainingDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingTitle">교육명 *</Label>
                    <Input
                      id="trainingTitle"
                      value={trainingForm.trainingTitle}
                      onChange={(e) =>
                        setTrainingForm({ ...trainingForm, trainingTitle: e.target.value })
                      }
                      placeholder="교육명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingType">교육유형 *</Label>
                    <Select
                      value={trainingForm.trainingType}
                      onValueChange={(value) =>
                        setTrainingForm({ ...trainingForm, trainingType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="교육유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainer">교육자(강사)</Label>
                    <Input
                      id="trainer"
                      value={trainingForm.trainer}
                      onChange={(e) =>
                        setTrainingForm({ ...trainingForm, trainer: e.target.value })
                      }
                      placeholder="강사명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainees">교육대상</Label>
                    <Input
                      id="trainees"
                      value={trainingForm.trainees}
                      onChange={(e) =>
                        setTrainingForm({ ...trainingForm, trainees: e.target.value })
                      }
                      placeholder="교육 대상자 또는 부서"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traineeCount">교육인원</Label>
                    <Input
                      id="traineeCount"
                      type="number"
                      value={trainingForm.traineeCount}
                      onChange={(e) =>
                        setTrainingForm({ ...trainingForm, traineeCount: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">교육시간</Label>
                    <Input
                      id="duration"
                      value={trainingForm.duration}
                      onChange={(e) =>
                        setTrainingForm({ ...trainingForm, duration: e.target.value })
                      }
                      placeholder="예: 2시간"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">교육내용</Label>
                  <Textarea
                    id="content"
                    value={trainingForm.content}
                    onChange={(e) =>
                      setTrainingForm({ ...trainingForm, content: e.target.value })
                    }
                    placeholder="교육 내용을 기술하세요"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveTraining}>
                    <Save className="mr-2 h-4 w-4" />
                    교육 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>안전교육 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {trainings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    안전교육 이력이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>교육일</TableHead>
                        <TableHead>교육명</TableHead>
                        <TableHead>교육유형</TableHead>
                        <TableHead>교육자</TableHead>
                        <TableHead>교육대상</TableHead>
                        <TableHead>인원</TableHead>
                        <TableHead>시간</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trainings.map((training) => (
                        <TableRow key={training.id}>
                          <TableCell>{formatDate(training.trainingDate)}</TableCell>
                          <TableCell className="font-medium">{training.trainingTitle}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{training.trainingType}</Badge>
                          </TableCell>
                          <TableCell>{training.trainer}</TableCell>
                          <TableCell>{training.trainees}</TableCell>
                          <TableCell>{training.traineeCount}명</TableCell>
                          <TableCell>{training.duration}</TableCell>
                          <TableCell>{getStatusBadge(training.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
