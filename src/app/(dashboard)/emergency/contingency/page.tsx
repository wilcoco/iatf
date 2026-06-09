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
import {
  AlertTriangle,
  Plus,
  Save,
  FileText,
  ClipboardList,
  Calendar,
  History,
  Trash2,
  Edit,
  Phone,
  Clock,
  Shield,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Emergency types based on IATF 16949 requirements
const EMERGENCY_TYPES = [
  { value: "화재", label: "화재", icon: "fire" },
  { value: "정전", label: "정전", icon: "power" },
  { value: "자연재해", label: "자연재해", icon: "nature" },
  { value: "설비고장", label: "설비고장", icon: "equipment" },
  { value: "공급중단", label: "공급중단", icon: "supply" },
  { value: "팬데믹", label: "팬데믹", icon: "pandemic" },
];

// Severity levels
const SEVERITY_LEVELS = [
  { value: "critical", label: "심각", color: "bg-red-100 text-red-800" },
  { value: "high", label: "높음", color: "bg-orange-100 text-orange-800" },
  { value: "medium", label: "중간", color: "bg-yellow-100 text-yellow-800" },
  { value: "low", label: "낮음", color: "bg-blue-100 text-blue-800" },
];

// Impact scope
const IMPACT_SCOPES = [
  { value: "전사", label: "전사" },
  { value: "공장전체", label: "공장 전체" },
  { value: "특정라인", label: "특정 생산라인" },
  { value: "특정부서", label: "특정 부서" },
  { value: "일부구역", label: "일부 구역" },
];

// Response priority
const RESPONSE_PRIORITIES = [
  { value: 1, label: "1순위 (즉시 대응)" },
  { value: 2, label: "2순위 (1시간 내)" },
  { value: 3, label: "3순위 (4시간 내)" },
  { value: 4, label: "4순위 (24시간 내)" },
];

// Drill evaluation ratings
const DRILL_RATINGS = [
  { value: "excellent", label: "우수", color: "bg-green-100 text-green-800" },
  { value: "good", label: "양호", color: "bg-blue-100 text-blue-800" },
  { value: "fair", label: "보통", color: "bg-yellow-100 text-yellow-800" },
  { value: "poor", label: "미흡", color: "bg-red-100 text-red-800" },
];

// Types
interface EmergencyDefinition {
  id: number;
  emergencyType: string;
  description: string;
  impactScope: string;
  severity: string;
  responsePriority: number;
  triggers: string;
  createdAt: string;
  isActive: boolean;
}

interface ResponsePlan {
  id: number;
  emergencyType: string;
  procedure: string;
  responsible: string;
  contact: string;
  resources: string;
  rto: string; // Recovery Time Objective
  backupPlan: string;
  createdAt: string;
}

interface DrillRecord {
  id: number;
  drillDate: string;
  drillType: string;
  content: string;
  participants: string;
  participantCount: number;
  evaluation: string;
  findings: string;
  improvements: string;
  nextDrillDate: string;
}

interface IncidentHistory {
  id: number;
  incidentDate: string;
  emergencyType: string;
  description: string;
  responseActions: string;
  responseTime: string;
  resolution: string;
  lessonsLearned: string;
  improvements: string;
  status: "resolved" | "ongoing" | "closed";
}

// Sample data
const sampleDefinitions: EmergencyDefinition[] = [
  {
    id: 1,
    emergencyType: "화재",
    description: "공장 내 화재 발생으로 인한 인명 및 재산 피해 위험",
    impactScope: "공장전체",
    severity: "critical",
    responsePriority: 1,
    triggers: "화재 경보 발령, 연기 감지, 불꽃 목격",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: 2,
    emergencyType: "정전",
    description: "외부 전력공급 중단 또는 내부 전기설비 고장으로 인한 생산 중단",
    impactScope: "전사",
    severity: "high",
    responsePriority: 1,
    triggers: "한전 공급중단 통보, UPS 경보, 전력계통 이상",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: 3,
    emergencyType: "자연재해",
    description: "지진, 태풍, 홍수 등 자연재해로 인한 시설 피해",
    impactScope: "전사",
    severity: "critical",
    responsePriority: 1,
    triggers: "기상청 특보 발령, 지진 감지, 침수 경보",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: 4,
    emergencyType: "설비고장",
    description: "주요 생산설비 고장으로 인한 생산라인 중단",
    impactScope: "특정라인",
    severity: "high",
    responsePriority: 2,
    triggers: "설비 이상 경보, 생산 중단, 품질 불량 다발",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: 5,
    emergencyType: "공급중단",
    description: "주요 부품/원자재 공급업체의 공급 중단",
    impactScope: "특정라인",
    severity: "medium",
    responsePriority: 3,
    triggers: "협력사 통보, 재고 부족 경보, 납기 지연",
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: 6,
    emergencyType: "팬데믹",
    description: "전염병 확산으로 인한 인력 부족 및 운영 차질",
    impactScope: "전사",
    severity: "high",
    responsePriority: 2,
    triggers: "정부 지침 발령, 확진자 발생, 지역사회 감염 확산",
    createdAt: "2024-01-15",
    isActive: true,
  },
];

const sampleResponsePlans: ResponsePlan[] = [
  {
    id: 1,
    emergencyType: "화재",
    procedure: "1. 화재 발견 즉시 119 신고 및 비상벨 작동\n2. 인원 대피 유도 (대피 경로 안내)\n3. 초기 진화 시도 (소화기 사용)\n4. 비상대책본부 가동\n5. 인원 현황 파악 및 보고\n6. 피해 상황 조사 및 복구 계획 수립",
    responsible: "안전관리팀장",
    contact: "010-1234-5678",
    resources: "소화기, 소화전, 방화복, 산소호흡기, 응급처치 키트",
    rto: "4시간",
    backupPlan: "인근 협력공장 활용, 대체 생산라인 가동",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    emergencyType: "정전",
    procedure: "1. 정전 발생 시 비상 발전기 자동 가동 확인\n2. 주요 설비 안전 정지 절차 수행\n3. 한전 연락 및 복구 예상 시간 확인\n4. 데이터 백업 및 서버 안전 종료\n5. 복구 후 설비 정상화 점검\n6. 생산 재개 판단",
    responsible: "설비관리팀장",
    contact: "010-2345-6789",
    resources: "비상 발전기, UPS, 손전등, 비상조명",
    rto: "2시간",
    backupPlan: "비상 발전기 가동으로 필수 설비 유지",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    emergencyType: "자연재해",
    procedure: "1. 기상특보 발령 시 비상대기 체제 돌입\n2. 실외 작업 중단 및 인원 대피\n3. 시설물 보강 및 배수 점검\n4. 비상연락망 가동\n5. 피해 상황 파악 및 보고\n6. 복구 계획 수립 및 시행",
    responsible: "총무팀장",
    contact: "010-3456-7890",
    resources: "비상용품, 방수포, 양수기, 비상식량, 응급의료품",
    rto: "24시간",
    backupPlan: "재택근무 전환, 대체 사업장 운영",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    emergencyType: "설비고장",
    procedure: "1. 고장 발생 즉시 설비 정지 및 안전 조치\n2. 보전팀 긴급 출동 및 원인 분석\n3. 예비 부품 확인 및 교체 작업\n4. 대체 설비 가동 검토\n5. 품질 점검 후 생산 재개\n6. 재발 방지 대책 수립",
    responsible: "생산기술팀장",
    contact: "010-4567-8901",
    resources: "예비 부품, 공구, 진단 장비, 기술 매뉴얼",
    rto: "4시간",
    backupPlan: "대체 설비 활용, 외주 가공 의뢰",
    createdAt: "2024-01-15",
  },
  {
    id: 5,
    emergencyType: "공급중단",
    procedure: "1. 공급 중단 통보 접수 및 상황 파악\n2. 현재 재고 수준 확인\n3. 대체 공급업체 연락 및 긴급 발주\n4. 생산 계획 조정\n5. 고객사 납기 협의\n6. 재발 방지를 위한 공급망 다변화 검토",
    responsible: "구매팀장",
    contact: "010-5678-9012",
    resources: "대체 공급업체 리스트, 안전재고, 긴급 운송 계약",
    rto: "48시간",
    backupPlan: "대체 공급업체 활용, 설계 변경 검토",
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    emergencyType: "팬데믹",
    procedure: "1. 정부 지침 확인 및 전파\n2. 방역 체계 강화 (발열 체크, 소독)\n3. 재택근무 대상자 지정\n4. 필수 인력 교대 근무 편성\n5. 확진자 발생 시 격리 및 역학조사 협조\n6. 업무 연속성 계획 가동",
    responsible: "인사팀장",
    contact: "010-6789-0123",
    resources: "마스크, 손소독제, 체온계, 격리 공간, 재택근무 장비",
    rto: "1주일",
    backupPlan: "재택근무 전환, 교대 근무, 핵심 인력 보호",
    createdAt: "2024-01-15",
  },
];

const sampleDrillRecords: DrillRecord[] = [
  {
    id: 1,
    drillDate: "2024-03-15",
    drillType: "화재",
    content: "전 공장 대피 훈련 및 초기 진화 실습",
    participants: "전 직원",
    participantCount: 120,
    evaluation: "good",
    findings: "일부 직원의 대피 경로 숙지 미흡",
    improvements: "분기별 대피 경로 교육 실시",
    nextDrillDate: "2024-06-15",
  },
  {
    id: 2,
    drillDate: "2024-04-20",
    drillType: "정전",
    content: "비상 발전기 가동 및 설비 안전 정지 훈련",
    participants: "설비팀, 생산팀",
    participantCount: 35,
    evaluation: "excellent",
    findings: "발전기 가동 시간 목표 달성",
    improvements: "발전기 연료 점검 주기 단축",
    nextDrillDate: "2024-07-20",
  },
  {
    id: 3,
    drillDate: "2024-05-10",
    drillType: "설비고장",
    content: "주요 설비 고장 대응 및 대체 생산 전환 훈련",
    participants: "생산팀, 생산기술팀, 품질팀",
    participantCount: 25,
    evaluation: "fair",
    findings: "대체 설비 전환 시간 초과",
    improvements: "대체 설비 사전 점검 강화",
    nextDrillDate: "2024-08-10",
  },
];

const sampleIncidentHistory: IncidentHistory[] = [
  {
    id: 1,
    incidentDate: "2024-02-15",
    emergencyType: "정전",
    description: "외부 전력공급 중단으로 인한 2시간 정전 발생",
    responseActions: "비상 발전기 가동, 주요 설비 안전 정지, 한전 연락",
    responseTime: "5분",
    resolution: "한전 복구 완료 후 설비 정상화",
    lessonsLearned: "비상 발전기 연료 잔량 관리 필요",
    improvements: "발전기 연료 점검 주기를 주 1회로 변경",
    status: "closed",
  },
  {
    id: 2,
    incidentDate: "2024-03-20",
    emergencyType: "설비고장",
    description: "사출기 1호기 유압펌프 고장으로 생산 중단",
    responseActions: "긴급 수리 시도, 대체 설비 전환, 예비 부품 발주",
    responseTime: "15분",
    resolution: "예비 부품 교체로 4시간 내 복구 완료",
    lessonsLearned: "주요 예비 부품 재고 관리 강화 필요",
    improvements: "핵심 부품 안전재고 기준 상향 조정",
    status: "closed",
  },
];

export default function ContingencyPlanPage() {
  const [activeTab, setActiveTab] = useState("definitions");

  // State for emergency definitions
  const [definitions, setDefinitions] = useState<EmergencyDefinition[]>(sampleDefinitions);
  const [editingDefinition, setEditingDefinition] = useState<EmergencyDefinition | null>(null);
  const [definitionForm, setDefinitionForm] = useState({
    emergencyType: "",
    description: "",
    impactScope: "",
    severity: "",
    responsePriority: 1,
    triggers: "",
  });

  // State for response plans
  const [responsePlans, setResponsePlans] = useState<ResponsePlan[]>(sampleResponsePlans);
  const [editingPlan, setEditingPlan] = useState<ResponsePlan | null>(null);
  const [planForm, setPlanForm] = useState({
    emergencyType: "",
    procedure: "",
    responsible: "",
    contact: "",
    resources: "",
    rto: "",
    backupPlan: "",
  });

  // State for drill records
  const [drillRecords, setDrillRecords] = useState<DrillRecord[]>(sampleDrillRecords);
  const [editingDrill, setEditingDrill] = useState<DrillRecord | null>(null);
  const [drillForm, setDrillForm] = useState({
    drillDate: new Date().toISOString().split("T")[0],
    drillType: "",
    content: "",
    participants: "",
    participantCount: "",
    evaluation: "",
    findings: "",
    improvements: "",
    nextDrillDate: "",
  });

  // State for incident history
  const [incidents, setIncidents] = useState<IncidentHistory[]>(sampleIncidentHistory);
  const [editingIncident, setEditingIncident] = useState<IncidentHistory | null>(null);
  const [incidentForm, setIncidentForm] = useState<{
    incidentDate: string;
    emergencyType: string;
    description: string;
    responseActions: string;
    responseTime: string;
    resolution: string;
    lessonsLearned: string;
    improvements: string;
    status: "resolved" | "ongoing" | "closed";
  }>({
    incidentDate: new Date().toISOString().split("T")[0],
    emergencyType: "",
    description: "",
    responseActions: "",
    responseTime: "",
    resolution: "",
    lessonsLearned: "",
    improvements: "",
    status: "ongoing",
  });

  // Handlers for definitions
  const handleSaveDefinition = () => {
    if (!definitionForm.emergencyType || !definitionForm.description) {
      alert("비상유형과 설명은 필수 입력 항목입니다.");
      return;
    }

    if (editingDefinition) {
      setDefinitions(definitions.map(d =>
        d.id === editingDefinition.id
          ? { ...d, ...definitionForm }
          : d
      ));
    } else {
      const newDefinition: EmergencyDefinition = {
        id: Date.now(),
        ...definitionForm,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: true,
      };
      setDefinitions([...definitions, newDefinition]);
    }

    setDefinitionForm({
      emergencyType: "",
      description: "",
      impactScope: "",
      severity: "",
      responsePriority: 1,
      triggers: "",
    });
    setEditingDefinition(null);
  };

  const handleEditDefinition = (def: EmergencyDefinition) => {
    setEditingDefinition(def);
    setDefinitionForm({
      emergencyType: def.emergencyType,
      description: def.description,
      impactScope: def.impactScope,
      severity: def.severity,
      responsePriority: def.responsePriority,
      triggers: def.triggers,
    });
  };

  const handleDeleteDefinition = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setDefinitions(definitions.filter(d => d.id !== id));
    }
  };

  // Handlers for response plans
  const handleSavePlan = () => {
    if (!planForm.emergencyType || !planForm.procedure) {
      alert("비상유형과 대응절차는 필수 입력 항목입니다.");
      return;
    }

    if (editingPlan) {
      setResponsePlans(responsePlans.map(p =>
        p.id === editingPlan.id
          ? { ...p, ...planForm }
          : p
      ));
    } else {
      const newPlan: ResponsePlan = {
        id: Date.now(),
        ...planForm,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setResponsePlans([...responsePlans, newPlan]);
    }

    setPlanForm({
      emergencyType: "",
      procedure: "",
      responsible: "",
      contact: "",
      resources: "",
      rto: "",
      backupPlan: "",
    });
    setEditingPlan(null);
  };

  const handleEditPlan = (plan: ResponsePlan) => {
    setEditingPlan(plan);
    setPlanForm({
      emergencyType: plan.emergencyType,
      procedure: plan.procedure,
      responsible: plan.responsible,
      contact: plan.contact,
      resources: plan.resources,
      rto: plan.rto,
      backupPlan: plan.backupPlan,
    });
  };

  const handleDeletePlan = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setResponsePlans(responsePlans.filter(p => p.id !== id));
    }
  };

  // Handlers for drill records
  const handleSaveDrill = () => {
    if (!drillForm.drillDate || !drillForm.drillType || !drillForm.content) {
      alert("훈련일자, 훈련유형, 훈련내용은 필수 입력 항목입니다.");
      return;
    }

    if (editingDrill) {
      setDrillRecords(drillRecords.map(d =>
        d.id === editingDrill.id
          ? { ...d, ...drillForm, participantCount: Number(drillForm.participantCount) || 0 }
          : d
      ));
    } else {
      const newDrill: DrillRecord = {
        id: Date.now(),
        ...drillForm,
        participantCount: Number(drillForm.participantCount) || 0,
      };
      setDrillRecords([newDrill, ...drillRecords]);
    }

    setDrillForm({
      drillDate: new Date().toISOString().split("T")[0],
      drillType: "",
      content: "",
      participants: "",
      participantCount: "",
      evaluation: "",
      findings: "",
      improvements: "",
      nextDrillDate: "",
    });
    setEditingDrill(null);
  };

  const handleEditDrill = (drill: DrillRecord) => {
    setEditingDrill(drill);
    setDrillForm({
      drillDate: drill.drillDate,
      drillType: drill.drillType,
      content: drill.content,
      participants: drill.participants,
      participantCount: drill.participantCount.toString(),
      evaluation: drill.evaluation,
      findings: drill.findings,
      improvements: drill.improvements,
      nextDrillDate: drill.nextDrillDate,
    });
  };

  const handleDeleteDrill = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setDrillRecords(drillRecords.filter(d => d.id !== id));
    }
  };

  // Handlers for incident history
  const handleSaveIncident = () => {
    if (!incidentForm.incidentDate || !incidentForm.emergencyType || !incidentForm.description) {
      alert("발생일자, 비상유형, 상황설명은 필수 입력 항목입니다.");
      return;
    }

    if (editingIncident) {
      setIncidents(incidents.map(i =>
        i.id === editingIncident.id
          ? { ...i, ...incidentForm }
          : i
      ));
    } else {
      const newIncident: IncidentHistory = {
        id: Date.now(),
        ...incidentForm,
      };
      setIncidents([newIncident, ...incidents]);
    }

    setIncidentForm({
      incidentDate: new Date().toISOString().split("T")[0],
      emergencyType: "",
      description: "",
      responseActions: "",
      responseTime: "",
      resolution: "",
      lessonsLearned: "",
      improvements: "",
      status: "ongoing",
    });
    setEditingIncident(null);
  };

  const handleEditIncident = (incident: IncidentHistory) => {
    setEditingIncident(incident);
    setIncidentForm({
      incidentDate: incident.incidentDate,
      emergencyType: incident.emergencyType,
      description: incident.description,
      responseActions: incident.responseActions,
      responseTime: incident.responseTime,
      resolution: incident.resolution,
      lessonsLearned: incident.lessonsLearned,
      improvements: incident.improvements,
      status: incident.status as "resolved" | "ongoing" | "closed",
    });
  };

  const handleDeleteIncident = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setIncidents(incidents.filter(i => i.id !== id));
    }
  };

  // Helper functions
  const getSeverityBadge = (severity: string) => {
    const level = SEVERITY_LEVELS.find(l => l.value === severity);
    return level ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
        {level.label}
      </span>
    ) : null;
  };

  const getEvaluationBadge = (evaluation: string) => {
    const rating = DRILL_RATINGS.find(r => r.value === evaluation);
    return rating ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${rating.color}`}>
        {rating.label}
      </span>
    ) : null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="success">해결됨</Badge>;
      case "ongoing":
        return <Badge variant="warning">진행중</Badge>;
      case "closed":
        return <Badge variant="outline">종료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비상대응계획</h1>
          <p className="text-muted-foreground">IATF 16949 기반 비상상황 대응계획 관리</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="definitions" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                비상상황 정의
              </TabsTrigger>
              <TabsTrigger value="response" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                대응 계획
              </TabsTrigger>
              <TabsTrigger value="drills" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                훈련 및 모의시험
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                비상대응 이력
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Emergency Definitions */}
            <TabsContent value="definitions">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {editingDefinition ? "비상상황 수정" : "비상상황 등록"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyType">비상유형 *</Label>
                        <Select
                          value={definitionForm.emergencyType}
                          onValueChange={(v) => setDefinitionForm({ ...definitionForm, emergencyType: v })}
                        >
                          <SelectTrigger>
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
                      <div className="space-y-2">
                        <Label htmlFor="impactScope">영향범위</Label>
                        <Select
                          value={definitionForm.impactScope}
                          onValueChange={(v) => setDefinitionForm({ ...definitionForm, impactScope: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="영향범위 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {IMPACT_SCOPES.map((scope) => (
                              <SelectItem key={scope.value} value={scope.value}>
                                {scope.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="severity">심각도</Label>
                        <Select
                          value={definitionForm.severity}
                          onValueChange={(v) => setDefinitionForm({ ...definitionForm, severity: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="심각도 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {SEVERITY_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsePriority">대응 우선순위</Label>
                        <Select
                          value={definitionForm.responsePriority.toString()}
                          onValueChange={(v) => setDefinitionForm({ ...definitionForm, responsePriority: Number(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="우선순위 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {RESPONSE_PRIORITIES.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value.toString()}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">상황 설명 *</Label>
                      <Textarea
                        id="description"
                        value={definitionForm.description}
                        onChange={(e) => setDefinitionForm({ ...definitionForm, description: e.target.value })}
                        placeholder="비상상황에 대한 상세 설명을 입력하세요"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="triggers">발동 조건</Label>
                      <Textarea
                        id="triggers"
                        value={definitionForm.triggers}
                        onChange={(e) => setDefinitionForm({ ...definitionForm, triggers: e.target.value })}
                        placeholder="비상대응이 발동되는 조건/상황을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      {editingDefinition && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingDefinition(null);
                            setDefinitionForm({
                              emergencyType: "",
                              description: "",
                              impactScope: "",
                              severity: "",
                              responsePriority: 1,
                              triggers: "",
                            });
                          }}
                        >
                          취소
                        </Button>
                      )}
                      <Button onClick={handleSaveDefinition}>
                        <Save className="mr-2 h-4 w-4" />
                        {editingDefinition ? "수정" : "등록"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      비상상황 정의 목록
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>비상유형</TableHead>
                          <TableHead>설명</TableHead>
                          <TableHead>영향범위</TableHead>
                          <TableHead>심각도</TableHead>
                          <TableHead>우선순위</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {definitions.map((def) => (
                          <TableRow key={def.id}>
                            <TableCell className="font-medium">{def.emergencyType}</TableCell>
                            <TableCell className="max-w-xs truncate">{def.description}</TableCell>
                            <TableCell>{IMPACT_SCOPES.find(s => s.value === def.impactScope)?.label || def.impactScope}</TableCell>
                            <TableCell>{getSeverityBadge(def.severity)}</TableCell>
                            <TableCell>{def.responsePriority}순위</TableCell>
                            <TableCell>
                              <Badge variant={def.isActive ? "success" : "secondary"}>
                                {def.isActive ? "활성" : "비활성"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleEditDefinition(def)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteDefinition(def.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 2: Response Plans */}
            <TabsContent value="response">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      {editingPlan ? "대응계획 수정" : "대응계획 등록"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="planEmergencyType">비상유형 *</Label>
                        <Select
                          value={planForm.emergencyType}
                          onValueChange={(v) => setPlanForm({ ...planForm, emergencyType: v })}
                        >
                          <SelectTrigger>
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
                      <div className="space-y-2">
                        <Label htmlFor="rto">복구목표시간 (RTO)</Label>
                        <Input
                          id="rto"
                          value={planForm.rto}
                          onChange={(e) => setPlanForm({ ...planForm, rto: e.target.value })}
                          placeholder="예: 4시간"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="responsible">담당자</Label>
                        <Input
                          id="responsible"
                          value={planForm.responsible}
                          onChange={(e) => setPlanForm({ ...planForm, responsible: e.target.value })}
                          placeholder="예: 안전관리팀장"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">연락처</Label>
                        <Input
                          id="contact"
                          value={planForm.contact}
                          onChange={(e) => setPlanForm({ ...planForm, contact: e.target.value })}
                          placeholder="예: 010-1234-5678"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="procedure">대응절차 *</Label>
                      <Textarea
                        id="procedure"
                        value={planForm.procedure}
                        onChange={(e) => setPlanForm({ ...planForm, procedure: e.target.value })}
                        placeholder="비상상황 발생 시 대응 절차를 단계별로 입력하세요"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resources">필요자원</Label>
                      <Textarea
                        id="resources"
                        value={planForm.resources}
                        onChange={(e) => setPlanForm({ ...planForm, resources: e.target.value })}
                        placeholder="대응에 필요한 장비, 물자, 인력 등을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backupPlan">대체/백업 계획</Label>
                      <Textarea
                        id="backupPlan"
                        value={planForm.backupPlan}
                        onChange={(e) => setPlanForm({ ...planForm, backupPlan: e.target.value })}
                        placeholder="주 대응계획 실패 시 대체 방안을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      {editingPlan && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPlan(null);
                            setPlanForm({
                              emergencyType: "",
                              procedure: "",
                              responsible: "",
                              contact: "",
                              resources: "",
                              rto: "",
                              backupPlan: "",
                            });
                          }}
                        >
                          취소
                        </Button>
                      )}
                      <Button onClick={handleSavePlan}>
                        <Save className="mr-2 h-4 w-4" />
                        {editingPlan ? "수정" : "등록"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      대응계획 목록
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {responsePlans.map((plan) => (
                        <Card key={plan.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Badge variant="outline">{plan.emergencyType}</Badge>
                                대응계획
                              </CardTitle>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">담당: {plan.responsible}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{plan.contact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">RTO: {plan.rto}</span>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">대응절차</Label>
                              <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">
                                {plan.procedure}
                              </p>
                            </div>
                            {plan.resources && (
                              <div>
                                <Label className="text-sm font-medium">필요자원</Label>
                                <p className="text-sm text-muted-foreground mt-1">{plan.resources}</p>
                              </div>
                            )}
                            {plan.backupPlan && (
                              <div>
                                <Label className="text-sm font-medium">백업계획</Label>
                                <p className="text-sm text-muted-foreground mt-1">{plan.backupPlan}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 3: Drills & Tests */}
            <TabsContent value="drills">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {editingDrill ? "훈련기록 수정" : "훈련기록 등록"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="drillDate">훈련일자 *</Label>
                        <Input
                          id="drillDate"
                          type="date"
                          value={drillForm.drillDate}
                          onChange={(e) => setDrillForm({ ...drillForm, drillDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drillType">훈련유형 *</Label>
                        <Select
                          value={drillForm.drillType}
                          onValueChange={(v) => setDrillForm({ ...drillForm, drillType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="훈련유형 선택" />
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
                      <div className="space-y-2">
                        <Label htmlFor="nextDrillDate">다음 훈련예정일</Label>
                        <Input
                          id="nextDrillDate"
                          type="date"
                          value={drillForm.nextDrillDate}
                          onChange={(e) => setDrillForm({ ...drillForm, nextDrillDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="participants">참가자/부서</Label>
                        <Input
                          id="participants"
                          value={drillForm.participants}
                          onChange={(e) => setDrillForm({ ...drillForm, participants: e.target.value })}
                          placeholder="예: 전 직원, 생산팀"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="participantCount">참가인원</Label>
                        <Input
                          id="participantCount"
                          type="number"
                          value={drillForm.participantCount}
                          onChange={(e) => setDrillForm({ ...drillForm, participantCount: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="drillContent">훈련내용 *</Label>
                      <Textarea
                        id="drillContent"
                        value={drillForm.content}
                        onChange={(e) => setDrillForm({ ...drillForm, content: e.target.value })}
                        placeholder="훈련 내용을 상세히 입력하세요"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evaluation">훈련결과 평가</Label>
                      <Select
                        value={drillForm.evaluation}
                        onValueChange={(v) => setDrillForm({ ...drillForm, evaluation: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="평가 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {DRILL_RATINGS.map((rating) => (
                            <SelectItem key={rating.value} value={rating.value}>
                              {rating.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="findings">발견사항</Label>
                      <Textarea
                        id="findings"
                        value={drillForm.findings}
                        onChange={(e) => setDrillForm({ ...drillForm, findings: e.target.value })}
                        placeholder="훈련 중 발견된 문제점이나 특이사항"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="drillImprovements">개선사항</Label>
                      <Textarea
                        id="drillImprovements"
                        value={drillForm.improvements}
                        onChange={(e) => setDrillForm({ ...drillForm, improvements: e.target.value })}
                        placeholder="향후 개선이 필요한 사항"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      {editingDrill && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingDrill(null);
                            setDrillForm({
                              drillDate: new Date().toISOString().split("T")[0],
                              drillType: "",
                              content: "",
                              participants: "",
                              participantCount: "",
                              evaluation: "",
                              findings: "",
                              improvements: "",
                              nextDrillDate: "",
                            });
                          }}
                        >
                          취소
                        </Button>
                      )}
                      <Button onClick={handleSaveDrill}>
                        <Save className="mr-2 h-4 w-4" />
                        {editingDrill ? "수정" : "등록"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      훈련 기록
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>훈련일자</TableHead>
                          <TableHead>훈련유형</TableHead>
                          <TableHead>훈련내용</TableHead>
                          <TableHead>참가자</TableHead>
                          <TableHead className="text-right">인원</TableHead>
                          <TableHead>평가</TableHead>
                          <TableHead>다음 훈련</TableHead>
                          <TableHead>관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drillRecords.map((drill) => (
                          <TableRow key={drill.id}>
                            <TableCell>{drill.drillDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{drill.drillType}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{drill.content}</TableCell>
                            <TableCell>{drill.participants}</TableCell>
                            <TableCell className="text-right">{drill.participantCount}명</TableCell>
                            <TableCell>{getEvaluationBadge(drill.evaluation)}</TableCell>
                            <TableCell>{drill.nextDrillDate || "-"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleEditDrill(drill)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteDrill(drill.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 4: Emergency Response History */}
            <TabsContent value="history">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      {editingIncident ? "발생이력 수정" : "발생이력 등록"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="incidentDate">발생일자 *</Label>
                        <Input
                          id="incidentDate"
                          type="date"
                          value={incidentForm.incidentDate}
                          onChange={(e) => setIncidentForm({ ...incidentForm, incidentDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incidentType">비상유형 *</Label>
                        <Select
                          value={incidentForm.emergencyType}
                          onValueChange={(v) => setIncidentForm({ ...incidentForm, emergencyType: v })}
                        >
                          <SelectTrigger>
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
                      <div className="space-y-2">
                        <Label htmlFor="responseTime">대응시간</Label>
                        <Input
                          id="responseTime"
                          value={incidentForm.responseTime}
                          onChange={(e) => setIncidentForm({ ...incidentForm, responseTime: e.target.value })}
                          placeholder="예: 5분"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentDescription">상황설명 *</Label>
                      <Textarea
                        id="incidentDescription"
                        value={incidentForm.description}
                        onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                        placeholder="발생한 비상상황에 대한 상세 설명"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responseActions">대응 내용</Label>
                      <Textarea
                        id="responseActions"
                        value={incidentForm.responseActions}
                        onChange={(e) => setIncidentForm({ ...incidentForm, responseActions: e.target.value })}
                        placeholder="비상상황에 대한 대응 조치 내용"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resolution">해결 내용</Label>
                      <Textarea
                        id="resolution"
                        value={incidentForm.resolution}
                        onChange={(e) => setIncidentForm({ ...incidentForm, resolution: e.target.value })}
                        placeholder="비상상황 해결 방법 및 결과"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lessonsLearned">교훈</Label>
                      <Textarea
                        id="lessonsLearned"
                        value={incidentForm.lessonsLearned}
                        onChange={(e) => setIncidentForm({ ...incidentForm, lessonsLearned: e.target.value })}
                        placeholder="이번 사건에서 얻은 교훈"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentImprovements">개선사항</Label>
                      <Textarea
                        id="incidentImprovements"
                        value={incidentForm.improvements}
                        onChange={(e) => setIncidentForm({ ...incidentForm, improvements: e.target.value })}
                        placeholder="향후 재발 방지를 위한 개선 조치"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">상태</Label>
                      <Select
                        value={incidentForm.status}
                        onValueChange={(v) => setIncidentForm({ ...incidentForm, status: v as IncidentHistory["status"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ongoing">진행중</SelectItem>
                          <SelectItem value="resolved">해결됨</SelectItem>
                          <SelectItem value="closed">종료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 justify-end">
                      {editingIncident && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingIncident(null);
                            setIncidentForm({
                              incidentDate: new Date().toISOString().split("T")[0],
                              emergencyType: "",
                              description: "",
                              responseActions: "",
                              responseTime: "",
                              resolution: "",
                              lessonsLearned: "",
                              improvements: "",
                              status: "ongoing",
                            });
                          }}
                        >
                          취소
                        </Button>
                      )}
                      <Button onClick={handleSaveIncident}>
                        <Save className="mr-2 h-4 w-4" />
                        {editingIncident ? "수정" : "등록"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      비상대응 이력
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incidents.length === 0 ? (
                        <div className="text-center py-8">
                          <History className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-muted-foreground">등록된 비상대응 이력이 없습니다.</p>
                        </div>
                      ) : (
                        incidents.map((incident) => (
                          <Card key={incident.id}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{incident.emergencyType}</Badge>
                                  <span className="text-sm text-muted-foreground">{incident.incidentDate}</span>
                                  {getStatusBadge(incident.status)}
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditIncident(incident)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteIncident(incident.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium">상황설명</Label>
                                <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                              </div>
                              {incident.responseActions && (
                                <div>
                                  <Label className="text-sm font-medium">대응 내용</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{incident.responseActions}</p>
                                </div>
                              )}
                              <div className="grid gap-4 md:grid-cols-2">
                                {incident.responseTime && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">대응시간: {incident.responseTime}</span>
                                  </div>
                                )}
                              </div>
                              {incident.lessonsLearned && (
                                <div>
                                  <Label className="text-sm font-medium">교훈</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{incident.lessonsLearned}</p>
                                </div>
                              )}
                              {incident.improvements && (
                                <div>
                                  <Label className="text-sm font-medium">개선사항</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{incident.improvements}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
