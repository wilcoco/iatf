"use client";

import { useState, useMemo } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  FileText,
  Award,
  History,
  Bell,
  Thermometer,
  Gauge,
  Shield,
  Calendar,
} from "lucide-react";

// Process type definition
type ProcessType = "heat-treatment" | "plating" | "painting" | "welding";

// CQI standards mapping
const cqiStandards: Record<ProcessType, string> = {
  "heat-treatment": "CQI-9 (Heat Treatment)",
  plating: "CQI-11 (Plating)",
  painting: "CQI-12 (Coating)",
  welding: "CQI-15 (Welding)",
};

const processTypeLabels: Record<ProcessType, string> = {
  "heat-treatment": "열처리",
  plating: "도금",
  painting: "도장",
  welding: "용접",
};

// Special process registration interface
interface SpecialProcess {
  id: number;
  processCode: string;
  processName: string;
  processType: ProcessType;
  relatedCqi: string;
  description: string;
  parameters: string[];
  controlItems: string[];
  responsible: string;
  registrationDate: string;
  status: "active" | "inactive" | "pending";
}

// Process parameter interface
interface ProcessParameter {
  id: number;
  processId: number;
  processCode: string;
  parameterName: string;
  unit: string;
  targetValue: string;
  lowerLimit: string;
  upperLimit: string;
  currentValue: string;
  lastUpdated: string;
  status: "normal" | "warning" | "alarm";
}

// Alert interface for parameter monitoring
interface ParameterAlert {
  id: number;
  processCode: string;
  parameterName: string;
  alertType: "warning" | "alarm";
  currentValue: string;
  limitValue: string;
  occurredAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  status: "active" | "acknowledged" | "resolved";
}

// Process certification interface
interface ProcessCertification {
  id: number;
  processCode: string;
  processName: string;
  cqiStandard: string;
  auditType: "internal" | "external" | "customer";
  scheduledDate: string;
  completedDate: string | null;
  auditor: string;
  result: "pass" | "fail" | "conditional" | "pending";
  findings: string;
  correctiveActions: string;
  dueDate: string | null;
  closedDate: string | null;
}

// History record interface
interface HistoryRecord {
  id: number;
  processCode: string;
  processName: string;
  eventType: "registration" | "parameter-change" | "certification" | "alert" | "modification";
  eventDescription: string;
  previousValue: string | null;
  newValue: string | null;
  performedBy: string;
  performedAt: string;
}

// Initial data
const initialProcesses: SpecialProcess[] = [
  {
    id: 1,
    processCode: "HT-001",
    processName: "경화 열처리",
    processType: "heat-treatment",
    relatedCqi: "CQI-9",
    description: "고주파 경화 열처리 공정",
    parameters: ["온도", "시간", "냉각속도", "분위기"],
    controlItems: ["경도", "조직검사", "잔류응력"],
    responsible: "생산기술팀",
    registrationDate: "2026-01-15",
    status: "active",
  },
  {
    id: 2,
    processCode: "PL-001",
    processName: "아연 도금",
    processType: "plating",
    relatedCqi: "CQI-11",
    description: "전기아연도금 공정",
    parameters: ["온도", "전류밀도", "pH", "시간"],
    controlItems: ["도금두께", "밀착성", "내식성"],
    responsible: "표면처리팀",
    registrationDate: "2026-02-01",
    status: "active",
  },
  {
    id: 3,
    processCode: "PT-001",
    processName: "전착도장",
    processType: "painting",
    relatedCqi: "CQI-12",
    description: "ED 전착도장 공정",
    parameters: ["전압", "온도", "pH", "도장시간"],
    controlItems: ["도막두께", "밀착성", "염수분무"],
    responsible: "도장팀",
    registrationDate: "2026-02-15",
    status: "active",
  },
  {
    id: 4,
    processCode: "WD-001",
    processName: "스폿 용접",
    processType: "welding",
    relatedCqi: "CQI-15",
    description: "저항 스폿 용접 공정",
    parameters: ["전류", "가압력", "통전시간", "홀드시간"],
    controlItems: ["너겟 직경", "인장강도", "외관"],
    responsible: "용접팀",
    registrationDate: "2026-03-01",
    status: "active",
  },
];

const initialParameters: ProcessParameter[] = [
  {
    id: 1,
    processId: 1,
    processCode: "HT-001",
    parameterName: "열처리 온도",
    unit: "C",
    targetValue: "860",
    lowerLimit: "850",
    upperLimit: "870",
    currentValue: "858",
    lastUpdated: "2026-06-10 09:30:00",
    status: "normal",
  },
  {
    id: 2,
    processId: 1,
    processCode: "HT-001",
    parameterName: "열처리 시간",
    unit: "min",
    targetValue: "45",
    lowerLimit: "40",
    upperLimit: "50",
    currentValue: "45",
    lastUpdated: "2026-06-10 09:30:00",
    status: "normal",
  },
  {
    id: 3,
    processId: 2,
    processCode: "PL-001",
    parameterName: "도금욕 온도",
    unit: "C",
    targetValue: "25",
    lowerLimit: "22",
    upperLimit: "28",
    currentValue: "24",
    lastUpdated: "2026-06-10 09:25:00",
    status: "normal",
  },
  {
    id: 4,
    processId: 2,
    processCode: "PL-001",
    parameterName: "전류밀도",
    unit: "A/dm2",
    targetValue: "3.0",
    lowerLimit: "2.5",
    upperLimit: "3.5",
    currentValue: "3.6",
    lastUpdated: "2026-06-10 09:25:00",
    status: "warning",
  },
  {
    id: 5,
    processId: 2,
    processCode: "PL-001",
    parameterName: "pH",
    unit: "",
    targetValue: "4.5",
    lowerLimit: "4.0",
    upperLimit: "5.0",
    currentValue: "4.3",
    lastUpdated: "2026-06-10 09:25:00",
    status: "normal",
  },
  {
    id: 6,
    processId: 3,
    processCode: "PT-001",
    parameterName: "전착 전압",
    unit: "V",
    targetValue: "280",
    lowerLimit: "260",
    upperLimit: "300",
    currentValue: "278",
    lastUpdated: "2026-06-10 09:20:00",
    status: "normal",
  },
  {
    id: 7,
    processId: 4,
    processCode: "WD-001",
    parameterName: "용접 전류",
    unit: "kA",
    targetValue: "12.0",
    lowerLimit: "11.0",
    upperLimit: "13.0",
    currentValue: "13.5",
    lastUpdated: "2026-06-10 09:15:00",
    status: "alarm",
  },
  {
    id: 8,
    processId: 4,
    processCode: "WD-001",
    parameterName: "가압력",
    unit: "kN",
    targetValue: "4.5",
    lowerLimit: "4.0",
    upperLimit: "5.0",
    currentValue: "4.6",
    lastUpdated: "2026-06-10 09:15:00",
    status: "normal",
  },
];

const initialAlerts: ParameterAlert[] = [
  {
    id: 1,
    processCode: "WD-001",
    parameterName: "용접 전류",
    alertType: "alarm",
    currentValue: "13.5 kA",
    limitValue: "USL: 13.0 kA",
    occurredAt: "2026-06-10 09:15:00",
    acknowledgedAt: null,
    acknowledgedBy: null,
    status: "active",
  },
  {
    id: 2,
    processCode: "PL-001",
    parameterName: "전류밀도",
    alertType: "warning",
    currentValue: "3.6 A/dm2",
    limitValue: "USL: 3.5 A/dm2",
    occurredAt: "2026-06-10 09:25:00",
    acknowledgedAt: "2026-06-10 09:30:00",
    acknowledgedBy: "김철수",
    status: "acknowledged",
  },
];

const initialCertifications: ProcessCertification[] = [
  {
    id: 1,
    processCode: "HT-001",
    processName: "경화 열처리",
    cqiStandard: "CQI-9",
    auditType: "external",
    scheduledDate: "2026-07-15",
    completedDate: null,
    auditor: "TUV Korea",
    result: "pending",
    findings: "",
    correctiveActions: "",
    dueDate: null,
    closedDate: null,
  },
  {
    id: 2,
    processCode: "PL-001",
    processName: "아연 도금",
    cqiStandard: "CQI-11",
    auditType: "internal",
    scheduledDate: "2026-05-20",
    completedDate: "2026-05-20",
    auditor: "내부심사팀",
    result: "conditional",
    findings: "도금욕 온도 기록 누락 3건",
    correctiveActions: "자동 기록 시스템 도입 예정",
    dueDate: "2026-06-30",
    closedDate: null,
  },
  {
    id: 3,
    processCode: "PT-001",
    processName: "전착도장",
    cqiStandard: "CQI-12",
    auditType: "customer",
    scheduledDate: "2026-04-10",
    completedDate: "2026-04-10",
    auditor: "현대자동차 SQ",
    result: "pass",
    findings: "경미한 문서 보완 권고",
    correctiveActions: "절차서 개정 완료",
    dueDate: "2026-04-30",
    closedDate: "2026-04-25",
  },
  {
    id: 4,
    processCode: "WD-001",
    processName: "스폿 용접",
    cqiStandard: "CQI-15",
    auditType: "external",
    scheduledDate: "2026-03-05",
    completedDate: "2026-03-05",
    auditor: "KS인증원",
    result: "fail",
    findings: "용접 파라미터 관리 미흡, 작업자 자격관리 부적합",
    correctiveActions: "파라미터 모니터링 시스템 구축, 용접사 재교육 완료",
    dueDate: "2026-05-15",
    closedDate: "2026-05-10",
  },
];

const initialHistory: HistoryRecord[] = [
  {
    id: 1,
    processCode: "HT-001",
    processName: "경화 열처리",
    eventType: "registration",
    eventDescription: "특수공정 최초 등록",
    previousValue: null,
    newValue: "CQI-9 기반 열처리 공정 등록",
    performedBy: "홍길동",
    performedAt: "2026-01-15 10:00:00",
  },
  {
    id: 2,
    processCode: "PL-001",
    processName: "아연 도금",
    eventType: "certification",
    eventDescription: "내부심사 완료",
    previousValue: null,
    newValue: "조건부 합격 (시정조치 필요)",
    performedBy: "내부심사팀",
    performedAt: "2026-05-20 16:30:00",
  },
  {
    id: 3,
    processCode: "WD-001",
    processName: "스폿 용접",
    eventType: "alert",
    eventDescription: "용접 전류 상한 이탈",
    previousValue: "12.8 kA",
    newValue: "13.5 kA (USL: 13.0 kA)",
    performedBy: "시스템",
    performedAt: "2026-06-10 09:15:00",
  },
  {
    id: 4,
    processCode: "PT-001",
    processName: "전착도장",
    eventType: "parameter-change",
    eventDescription: "전착 전압 목표값 변경",
    previousValue: "270 V",
    newValue: "280 V",
    performedBy: "박민수",
    performedAt: "2026-06-01 14:20:00",
  },
];

export default function SpecialProcessPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // State for special processes
  const [processes, setProcesses] = useState<SpecialProcess[]>(initialProcesses);
  const [newProcess, setNewProcess] = useState<Omit<SpecialProcess, "id">>({
    processCode: "",
    processName: "",
    processType: "heat-treatment",
    relatedCqi: "CQI-9",
    description: "",
    parameters: [],
    controlItems: [],
    responsible: "",
    registrationDate: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [newParameterInput, setNewParameterInput] = useState("");
  const [newControlItemInput, setNewControlItemInput] = useState("");

  // State for parameters
  const [parameters, setParameters] = useState<ProcessParameter[]>(initialParameters);
  const [alerts, setAlerts] = useState<ParameterAlert[]>(initialAlerts);

  // State for certifications
  const [certifications, setCertifications] = useState<ProcessCertification[]>(initialCertifications);
  const [newCertification, setNewCertification] = useState<Omit<ProcessCertification, "id">>({
    processCode: "",
    processName: "",
    cqiStandard: "",
    auditType: "internal",
    scheduledDate: "",
    completedDate: null,
    auditor: "",
    result: "pending",
    findings: "",
    correctiveActions: "",
    dueDate: null,
    closedDate: null,
  });

  // State for history
  const [history] = useState<HistoryRecord[]>(initialHistory);

  // Computed values
  const activeAlerts = useMemo(() => alerts.filter((a) => a.status === "active"), [alerts]);
  const warningParameters = useMemo(
    () => parameters.filter((p) => p.status === "warning" || p.status === "alarm"),
    [parameters]
  );

  // Handlers for process registration
  const handleProcessTypeChange = (type: ProcessType) => {
    setNewProcess({
      ...newProcess,
      processType: type,
      relatedCqi: cqiStandards[type].split(" ")[0],
    });
  };

  const addParameter = () => {
    if (newParameterInput.trim()) {
      setNewProcess({
        ...newProcess,
        parameters: [...newProcess.parameters, newParameterInput.trim()],
      });
      setNewParameterInput("");
    }
  };

  const removeParameter = (index: number) => {
    setNewProcess({
      ...newProcess,
      parameters: newProcess.parameters.filter((_, i) => i !== index),
    });
  };

  const addControlItem = () => {
    if (newControlItemInput.trim()) {
      setNewProcess({
        ...newProcess,
        controlItems: [...newProcess.controlItems, newControlItemInput.trim()],
      });
      setNewControlItemInput("");
    }
  };

  const removeControlItem = (index: number) => {
    setNewProcess({
      ...newProcess,
      controlItems: newProcess.controlItems.filter((_, i) => i !== index),
    });
  };

  const handleAddProcess = () => {
    if (!newProcess.processCode || !newProcess.processName) {
      alert("공정코드와 공정명은 필수 입력 항목입니다.");
      return;
    }
    setProcesses([...processes, { id: Date.now(), ...newProcess }]);
    setNewProcess({
      processCode: "",
      processName: "",
      processType: "heat-treatment",
      relatedCqi: "CQI-9",
      description: "",
      parameters: [],
      controlItems: [],
      responsible: "",
      registrationDate: new Date().toISOString().split("T")[0],
      status: "pending",
    });
    alert("특수공정이 등록되었습니다.");
  };

  const removeProcess = (id: number) => {
    setProcesses(processes.filter((p) => p.id !== id));
  };

  // Handlers for alerts
  const acknowledgeAlert = (id: number) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "acknowledged",
              acknowledgedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
              acknowledgedBy: "현재 사용자",
            }
          : a
      )
    );
  };

  const resolveAlert = (id: number) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: "resolved" } : a)));
  };

  // Handlers for certifications
  const handleAddCertification = () => {
    if (!newCertification.processCode || !newCertification.scheduledDate) {
      alert("공정코드와 심사예정일은 필수 입력 항목입니다.");
      return;
    }
    const selectedProcess = processes.find((p) => p.processCode === newCertification.processCode);
    setCertifications([
      ...certifications,
      {
        id: Date.now(),
        ...newCertification,
        processName: selectedProcess?.processName || "",
        cqiStandard: selectedProcess?.relatedCqi || "",
      },
    ]);
    setNewCertification({
      processCode: "",
      processName: "",
      cqiStandard: "",
      auditType: "internal",
      scheduledDate: "",
      completedDate: null,
      auditor: "",
      result: "pending",
      findings: "",
      correctiveActions: "",
      dueDate: null,
      closedDate: null,
    });
    alert("심사 일정이 등록되었습니다.");
  };

  const removeCertification = (id: number) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  const updateCertification = (id: number, field: keyof ProcessCertification, value: string) => {
    setCertifications(
      certifications.map((c) => (c.id === id ? { ...c, [field]: value || null } : c))
    );
  };

  // Badge helpers
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">운영중</Badge>;
      case "inactive":
        return <Badge variant="secondary">미운영</Badge>;
      case "pending":
        return <Badge variant="warning">승인대기</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getParameterStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            정상
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            경고
          </Badge>
        );
      case "alarm":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            이상
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCertResultBadge = (result: string) => {
    switch (result) {
      case "pass":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            합격
          </Badge>
        );
      case "fail":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            불합격
          </Badge>
        );
      case "conditional":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            조건부
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            예정
          </Badge>
        );
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  const getAuditTypeBadge = (type: string) => {
    switch (type) {
      case "internal":
        return <Badge variant="outline">내부심사</Badge>;
      case "external":
        return <Badge variant="secondary">외부심사</Badge>;
      case "customer":
        return <Badge variant="default">고객심사</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "registration":
        return <Badge variant="success">등록</Badge>;
      case "parameter-change":
        return <Badge variant="secondary">파라미터 변경</Badge>;
      case "certification":
        return <Badge variant="default">인증심사</Badge>;
      case "alert":
        return <Badge variant="destructive">이상알림</Badge>;
      case "modification":
        return <Badge variant="warning">수정</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Save handler
  const handleSaveAll = () => {
    console.log("Saving special process data:", {
      processes,
      parameters,
      alerts,
      certifications,
    });
    alert("특수공정 관리 데이터가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            특수공정 관리 (Special Process Control)
          </h1>
          <p className="text-muted-foreground">
            IATF 16949 기반 특수공정 관리 - CQI-9, CQI-11, CQI-12, CQI-15
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              이상 {activeAlerts.length}건
            </Badge>
          )}
          <Button onClick={handleSaveAll}>
            <Save className="mr-2 h-4 w-4" />
            전체 저장
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            특수공정 등록
          </TabsTrigger>
          <TabsTrigger value="parameters">
            <Gauge className="mr-2 h-4 w-4" />
            공정파라미터 관리
          </TabsTrigger>
          <TabsTrigger value="certification">
            <Award className="mr-2 h-4 w-4" />
            공정 인증 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            특수공정 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 특수공정 등록 */}
        <TabsContent value="registration">
          <div className="space-y-6">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  신규 특수공정 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="processCode">공정코드 *</Label>
                    <Input
                      id="processCode"
                      value={newProcess.processCode}
                      onChange={(e) =>
                        setNewProcess({ ...newProcess, processCode: e.target.value })
                      }
                      placeholder="HT-002"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processName">공정명 *</Label>
                    <Input
                      id="processName"
                      value={newProcess.processName}
                      onChange={(e) =>
                        setNewProcess({ ...newProcess, processName: e.target.value })
                      }
                      placeholder="침탄 열처리"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processType">공정유형 *</Label>
                    <Select
                      value={newProcess.processType}
                      onValueChange={(v) => handleProcessTypeChange(v as ProcessType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heat-treatment">열처리 (CQI-9)</SelectItem>
                        <SelectItem value="plating">도금 (CQI-11)</SelectItem>
                        <SelectItem value="painting">도장 (CQI-12)</SelectItem>
                        <SelectItem value="welding">용접 (CQI-15)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relatedCqi">관련 CQI 규격</Label>
                    <Input id="relatedCqi" value={newProcess.relatedCqi} disabled />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="responsible">담당부서</Label>
                    <Input
                      id="responsible"
                      value={newProcess.responsible}
                      onChange={(e) =>
                        setNewProcess({ ...newProcess, responsible: e.target.value })
                      }
                      placeholder="생산기술팀"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">공정 설명</Label>
                    <Input
                      id="description"
                      value={newProcess.description}
                      onChange={(e) =>
                        setNewProcess({ ...newProcess, description: e.target.value })
                      }
                      placeholder="공정 상세 설명"
                    />
                  </div>
                </div>

                {/* Parameters */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      공정 파라미터
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newParameterInput}
                        onChange={(e) => setNewParameterInput(e.target.value)}
                        placeholder="파라미터명 입력"
                        className="w-[200px]"
                        onKeyDown={(e) => e.key === "Enter" && addParameter()}
                      />
                      <Button onClick={addParameter} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProcess.parameters.length === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        등록된 파라미터가 없습니다.
                      </span>
                    ) : (
                      newProcess.parameters.map((param, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {param}
                          <button
                            onClick={() => removeParameter(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Control Items */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      관리항목
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newControlItemInput}
                        onChange={(e) => setNewControlItemInput(e.target.value)}
                        placeholder="관리항목명 입력"
                        className="w-[200px]"
                        onKeyDown={(e) => e.key === "Enter" && addControlItem()}
                      />
                      <Button onClick={addControlItem} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProcess.controlItems.length === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        등록된 관리항목이 없습니다.
                      </span>
                    ) : (
                      newProcess.controlItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {item}
                          <button
                            onClick={() => removeControlItem(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleAddProcess}>
                    <Plus className="mr-2 h-4 w-4" />
                    특수공정 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registered Processes List */}
            <Card>
              <CardHeader>
                <CardTitle>등록된 특수공정 목록 ({processes.length}건)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>공정코드</TableHead>
                      <TableHead>공정명</TableHead>
                      <TableHead>공정유형</TableHead>
                      <TableHead>CQI 규격</TableHead>
                      <TableHead>파라미터</TableHead>
                      <TableHead>관리항목</TableHead>
                      <TableHead>담당부서</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processes.map((process) => (
                      <TableRow key={process.id}>
                        <TableCell className="font-mono">{process.processCode}</TableCell>
                        <TableCell className="font-medium">{process.processName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {processTypeLabels[process.processType]}
                          </Badge>
                        </TableCell>
                        <TableCell>{process.relatedCqi}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {process.parameters.slice(0, 2).map((p, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                            {process.parameters.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{process.parameters.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {process.controlItems.slice(0, 2).map((c, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {c}
                              </Badge>
                            ))}
                            {process.controlItems.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{process.controlItems.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{process.responsible}</TableCell>
                        <TableCell>{getStatusBadge(process.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeProcess(process.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 공정파라미터 관리 */}
        <TabsContent value="parameters">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">전체 파라미터</p>
                      <p className="text-2xl font-bold">{parameters.length}</p>
                    </div>
                    <Gauge className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">정상</p>
                      <p className="text-2xl font-bold text-green-600">
                        {parameters.filter((p) => p.status === "normal").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">경고</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {parameters.filter((p) => p.status === "warning").length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">이상</p>
                      <p className="text-2xl font-bold text-red-600">
                        {parameters.filter((p) => p.status === "alarm").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Parameter Monitoring Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  파라미터별 관리기준 및 실시간 모니터링
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>공정코드</TableHead>
                      <TableHead>파라미터명</TableHead>
                      <TableHead className="text-center">단위</TableHead>
                      <TableHead className="text-center">목표값</TableHead>
                      <TableHead className="text-center">하한(LSL)</TableHead>
                      <TableHead className="text-center">상한(USL)</TableHead>
                      <TableHead className="text-center">현재값</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                      <TableHead>최종 업데이트</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.map((param) => (
                      <TableRow
                        key={param.id}
                        className={
                          param.status === "alarm"
                            ? "bg-red-50"
                            : param.status === "warning"
                            ? "bg-yellow-50"
                            : ""
                        }
                      >
                        <TableCell className="font-mono">{param.processCode}</TableCell>
                        <TableCell className="font-medium">{param.parameterName}</TableCell>
                        <TableCell className="text-center">{param.unit || "-"}</TableCell>
                        <TableCell className="text-center font-mono">{param.targetValue}</TableCell>
                        <TableCell className="text-center font-mono text-blue-600">
                          {param.lowerLimit}
                        </TableCell>
                        <TableCell className="text-center font-mono text-blue-600">
                          {param.upperLimit}
                        </TableCell>
                        <TableCell
                          className={`text-center font-mono font-bold ${
                            param.status === "alarm"
                              ? "text-red-600"
                              : param.status === "warning"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {param.currentValue}
                        </TableCell>
                        <TableCell className="text-center">
                          {getParameterStatusBadge(param.status)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {param.lastUpdated}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  이상 알림 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="mx-auto h-12 w-12 mb-4 text-green-500" />
                    <p>현재 발생된 이상 알림이 없습니다.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>알림유형</TableHead>
                        <TableHead>공정코드</TableHead>
                        <TableHead>파라미터</TableHead>
                        <TableHead>현재값</TableHead>
                        <TableHead>관리한계</TableHead>
                        <TableHead>발생시간</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>확인/조치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow
                          key={alert.id}
                          className={
                            alert.status === "active"
                              ? alert.alertType === "alarm"
                                ? "bg-red-50"
                                : "bg-yellow-50"
                              : ""
                          }
                        >
                          <TableCell>
                            {alert.alertType === "alarm" ? (
                              <Badge variant="destructive">ALARM</Badge>
                            ) : (
                              <Badge variant="warning">WARNING</Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono">{alert.processCode}</TableCell>
                          <TableCell>{alert.parameterName}</TableCell>
                          <TableCell className="font-mono font-bold">{alert.currentValue}</TableCell>
                          <TableCell className="font-mono">{alert.limitValue}</TableCell>
                          <TableCell className="text-sm">{alert.occurredAt}</TableCell>
                          <TableCell>
                            {alert.status === "active" ? (
                              <Badge variant="destructive">미확인</Badge>
                            ) : alert.status === "acknowledged" ? (
                              <Badge variant="warning">확인됨</Badge>
                            ) : (
                              <Badge variant="success">조치완료</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {alert.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => acknowledgeAlert(alert.id)}
                                >
                                  확인
                                </Button>
                              )}
                              {alert.status === "acknowledged" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => resolveAlert(alert.id)}
                                >
                                  조치완료
                                </Button>
                              )}
                              {alert.status === "resolved" && (
                                <span className="text-sm text-muted-foreground">완료</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 공정 인증 현황 */}
        <TabsContent value="certification">
          <div className="space-y-6">
            {/* Add Certification Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  CQI 심사 일정 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>공정 선택 *</Label>
                    <Select
                      value={newCertification.processCode}
                      onValueChange={(v) =>
                        setNewCertification({ ...newCertification, processCode: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="공정 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {processes.map((p) => (
                          <SelectItem key={p.id} value={p.processCode}>
                            {p.processCode} - {p.processName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>심사유형 *</Label>
                    <Select
                      value={newCertification.auditType}
                      onValueChange={(v) =>
                        setNewCertification({
                          ...newCertification,
                          auditType: v as "internal" | "external" | "customer",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">내부심사</SelectItem>
                        <SelectItem value="external">외부심사</SelectItem>
                        <SelectItem value="customer">고객심사</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>심사예정일 *</Label>
                    <Input
                      type="date"
                      value={newCertification.scheduledDate}
                      onChange={(e) =>
                        setNewCertification({ ...newCertification, scheduledDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>심사원/기관</Label>
                    <Input
                      value={newCertification.auditor}
                      onChange={(e) =>
                        setNewCertification({ ...newCertification, auditor: e.target.value })
                      }
                      placeholder="심사원 또는 인증기관"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button onClick={handleAddCertification} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      일정 등록
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">예정 심사</p>
                      <p className="text-2xl font-bold">
                        {certifications.filter((c) => c.result === "pending").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">합격</p>
                      <p className="text-2xl font-bold text-green-600">
                        {certifications.filter((c) => c.result === "pass").length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">조건부</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {certifications.filter((c) => c.result === "conditional").length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">불합격</p>
                      <p className="text-2xl font-bold text-red-600">
                        {certifications.filter((c) => c.result === "fail").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certification Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  심사 결과 및 부적합 사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>공정코드</TableHead>
                      <TableHead>공정명</TableHead>
                      <TableHead>CQI 규격</TableHead>
                      <TableHead>심사유형</TableHead>
                      <TableHead>심사일</TableHead>
                      <TableHead>심사원</TableHead>
                      <TableHead>결과</TableHead>
                      <TableHead>부적합 사항</TableHead>
                      <TableHead>시정조치</TableHead>
                      <TableHead>완료기한</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certifications.map((cert) => (
                      <TableRow
                        key={cert.id}
                        className={
                          cert.result === "fail"
                            ? "bg-red-50"
                            : cert.result === "conditional"
                            ? "bg-yellow-50"
                            : ""
                        }
                      >
                        <TableCell className="font-mono">{cert.processCode}</TableCell>
                        <TableCell>{cert.processName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{cert.cqiStandard}</Badge>
                        </TableCell>
                        <TableCell>{getAuditTypeBadge(cert.auditType)}</TableCell>
                        <TableCell>
                          {cert.completedDate || cert.scheduledDate}
                          {!cert.completedDate && " (예정)"}
                        </TableCell>
                        <TableCell>{cert.auditor}</TableCell>
                        <TableCell>{getCertResultBadge(cert.result)}</TableCell>
                        <TableCell className="max-w-[150px]">
                          {cert.result === "pending" ? (
                            "-"
                          ) : (
                            <Textarea
                              value={cert.findings}
                              onChange={(e) =>
                                updateCertification(cert.id, "findings", e.target.value)
                              }
                              placeholder="부적합 사항"
                              rows={2}
                              className="text-xs"
                            />
                          )}
                        </TableCell>
                        <TableCell className="max-w-[150px]">
                          {cert.result === "pending" ? (
                            "-"
                          ) : (
                            <Textarea
                              value={cert.correctiveActions}
                              onChange={(e) =>
                                updateCertification(cert.id, "correctiveActions", e.target.value)
                              }
                              placeholder="시정조치"
                              rows={2}
                              className="text-xs"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {cert.result === "pending" ? (
                            "-"
                          ) : (
                            <div className="space-y-1">
                              <Input
                                type="date"
                                value={cert.dueDate || ""}
                                onChange={(e) =>
                                  updateCertification(cert.id, "dueDate", e.target.value)
                                }
                                className="text-xs h-7"
                              />
                              {cert.closedDate && (
                                <Badge variant="success" className="text-xs">
                                  완료: {cert.closedDate}
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeCertification(cert.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 특수공정 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                특수공정 변경 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="mx-auto h-12 w-12 mb-4" />
                  <p>기록된 이력이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">일시</TableHead>
                      <TableHead>공정코드</TableHead>
                      <TableHead>공정명</TableHead>
                      <TableHead>이벤트 유형</TableHead>
                      <TableHead>변경 내용</TableHead>
                      <TableHead>이전값</TableHead>
                      <TableHead>변경후</TableHead>
                      <TableHead>작업자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history
                      .sort(
                        (a, b) =>
                          new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
                      )
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm">{record.performedAt}</TableCell>
                          <TableCell className="font-mono">{record.processCode}</TableCell>
                          <TableCell>{record.processName}</TableCell>
                          <TableCell>{getEventTypeBadge(record.eventType)}</TableCell>
                          <TableCell>{record.eventDescription}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {record.previousValue || "-"}
                          </TableCell>
                          <TableCell>{record.newValue || "-"}</TableCell>
                          <TableCell>{record.performedBy}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
