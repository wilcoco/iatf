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
  AlertTriangle,
  Shield,
  ClipboardList,
  History,
  Save,
  Plus,
  Trash2,
  Search,
} from "lucide-react";

// Risk types based on IATF 16949
type RiskType = "quality" | "delivery" | "cost" | "safety" | "environment" | "";
type RiskLevel = "high" | "medium" | "low";
type ActionStatus = "planned" | "in-progress" | "completed" | "verified" | "";

interface RiskItem {
  id: number;
  riskNumber: string;
  registrationDate: string;
  processArea: string;
  riskDescription: string;
  riskType: RiskType;
  likelihood: number; // 1-5
  severity: number; // 1-5
  rpn: number; // auto-calculated
  mitigationPlan: string;
  responsible: string;
  dueDate: string;
  residualLikelihood: number;
  residualSeverity: number;
  residualRpn: number;
  actionStatus: ActionStatus;
  remarks: string;
}

interface RiskFormData {
  riskNumber: string;
  registrationDate: string;
  processArea: string;
  riskDescription: string;
  riskType: RiskType;
  likelihood: number;
  severity: number;
  mitigationPlan: string;
  responsible: string;
  dueDate: string;
  residualLikelihood: number;
  residualSeverity: number;
  actionStatus: ActionStatus;
  remarks: string;
}

const initialFormData: RiskFormData = {
  riskNumber: "",
  registrationDate: new Date().toISOString().split("T")[0],
  processArea: "",
  riskDescription: "",
  riskType: "",
  likelihood: 1,
  severity: 1,
  mitigationPlan: "",
  responsible: "",
  dueDate: "",
  residualLikelihood: 1,
  residualSeverity: 1,
  actionStatus: "",
  remarks: "",
};

const riskTypeLabels: Record<string, string> = {
  quality: "품질",
  delivery: "납기",
  cost: "비용",
  safety: "안전",
  environment: "환경",
};

const actionStatusLabels: Record<string, string> = {
  planned: "계획",
  "in-progress": "진행중",
  completed: "완료",
  verified: "검증완료",
};

const actionStatusColors: Record<string, string> = {
  planned: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  verified: "bg-purple-100 text-purple-800",
};

// Sample risk data for demonstration
const sampleRisks: RiskItem[] = [
  {
    id: 1,
    riskNumber: "RISK-2026-001",
    registrationDate: "2026-01-10",
    processArea: "사출 공정",
    riskDescription: "원자재 공급업체 단일화로 인한 공급 중단 위험",
    riskType: "delivery",
    likelihood: 4,
    severity: 5,
    rpn: 20,
    mitigationPlan: "대체 공급업체 발굴 및 2nd source 등록",
    responsible: "김구매",
    dueDate: "2026-03-31",
    residualLikelihood: 2,
    residualSeverity: 5,
    residualRpn: 10,
    actionStatus: "completed",
    remarks: "2nd source 등록 완료",
  },
  {
    id: 2,
    riskNumber: "RISK-2026-002",
    registrationDate: "2026-02-15",
    processArea: "도장 공정",
    riskDescription: "도장 두께 불균일로 인한 품질 불량 발생 가능성",
    riskType: "quality",
    likelihood: 3,
    severity: 4,
    rpn: 12,
    mitigationPlan: "자동 두께 측정 시스템 도입 및 SPC 관리",
    responsible: "이품질",
    dueDate: "2026-04-30",
    residualLikelihood: 2,
    residualSeverity: 4,
    residualRpn: 8,
    actionStatus: "in-progress",
    remarks: "측정 시스템 설치 중",
  },
  {
    id: 3,
    riskNumber: "RISK-2026-003",
    registrationDate: "2026-03-01",
    processArea: "조립 공정",
    riskDescription: "작업자 안전사고 위험 (중량물 취급)",
    riskType: "safety",
    likelihood: 3,
    severity: 5,
    rpn: 15,
    mitigationPlan: "리프트 장비 도입 및 안전 교육 강화",
    responsible: "박안전",
    dueDate: "2026-05-15",
    residualLikelihood: 1,
    residualSeverity: 5,
    residualRpn: 5,
    actionStatus: "verified",
    remarks: "리프트 설치 및 교육 완료",
  },
  {
    id: 4,
    riskNumber: "RISK-2026-004",
    registrationDate: "2026-04-10",
    processArea: "전체 공정",
    riskDescription: "환경 규제 강화에 따른 VOC 배출 기준 초과 위험",
    riskType: "environment",
    likelihood: 2,
    severity: 4,
    rpn: 8,
    mitigationPlan: "VOC 저감 설비 업그레이드",
    responsible: "최환경",
    dueDate: "2026-06-30",
    residualLikelihood: 1,
    residualSeverity: 4,
    residualRpn: 4,
    actionStatus: "planned",
    remarks: "설비 발주 예정",
  },
  {
    id: 5,
    riskNumber: "RISK-2026-005",
    registrationDate: "2026-05-05",
    processArea: "검사 공정",
    riskDescription: "검사 장비 노후화로 인한 측정 오차 발생",
    riskType: "quality",
    likelihood: 4,
    severity: 3,
    rpn: 12,
    mitigationPlan: "정기 교정 주기 단축 및 신규 장비 교체",
    responsible: "정검사",
    dueDate: "2026-07-31",
    residualLikelihood: 2,
    residualSeverity: 3,
    residualRpn: 6,
    actionStatus: "in-progress",
    remarks: "장비 교체 진행중",
  },
  {
    id: 6,
    riskNumber: "RISK-2026-006",
    registrationDate: "2026-05-20",
    processArea: "물류/출하",
    riskDescription: "물류비 상승으로 인한 원가 증가 위험",
    riskType: "cost",
    likelihood: 4,
    severity: 3,
    rpn: 12,
    mitigationPlan: "물류업체 다변화 및 물류 최적화 시스템 도입",
    responsible: "한물류",
    dueDate: "2026-08-31",
    residualLikelihood: 3,
    residualSeverity: 3,
    residualRpn: 9,
    actionStatus: "planned",
    remarks: "",
  },
];

function getRiskLevel(rpn: number): RiskLevel {
  if (rpn >= 15) return "high";
  if (rpn >= 8) return "medium";
  return "low";
}

function getRiskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
}

function getRiskLevelLabel(level: RiskLevel): string {
  switch (level) {
    case "high":
      return "고위험";
    case "medium":
      return "중위험";
    case "low":
      return "저위험";
  }
}

export default function RiskManagementPage() {
  const [activeTab, setActiveTab] = useState("identification");
  const [formData, setFormData] = useState<RiskFormData>(initialFormData);
  const [risks, setRisks] = useState<RiskItem[]>(sampleRisks);
  const [searchQuery, setSearchQuery] = useState("");

  const updateField = <K extends keyof RiskFormData>(
    field: K,
    value: RiskFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateRPN = (likelihood: number, severity: number): number => {
    return likelihood * severity;
  };

  const currentRPN = useMemo(
    () => calculateRPN(formData.likelihood, formData.severity),
    [formData.likelihood, formData.severity]
  );

  const residualRPN = useMemo(
    () => calculateRPN(formData.residualLikelihood, formData.residualSeverity),
    [formData.residualLikelihood, formData.residualSeverity]
  );

  const generateRiskNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("riskNumber", `RISK-${year}-${random}`);
  };

  const handleAddRisk = () => {
    if (!formData.riskNumber || !formData.riskDescription) {
      alert("리스크번호와 리스크 내용을 입력해주세요.");
      return;
    }

    const newRisk: RiskItem = {
      id: risks.length + 1,
      riskNumber: formData.riskNumber,
      registrationDate: formData.registrationDate,
      processArea: formData.processArea,
      riskDescription: formData.riskDescription,
      riskType: formData.riskType,
      likelihood: formData.likelihood,
      severity: formData.severity,
      rpn: currentRPN,
      mitigationPlan: formData.mitigationPlan,
      responsible: formData.responsible,
      dueDate: formData.dueDate,
      residualLikelihood: formData.residualLikelihood,
      residualSeverity: formData.residualSeverity,
      residualRpn: residualRPN,
      actionStatus: formData.actionStatus,
      remarks: formData.remarks,
    };

    setRisks([...risks, newRisk]);
    setFormData(initialFormData);
    alert("리스크가 등록되었습니다.");
  };

  const handleDeleteRisk = (id: number) => {
    if (confirm("이 리스크를 삭제하시겠습니까?")) {
      setRisks(risks.filter((risk) => risk.id !== id));
    }
  };

  const handleSave = () => {
    console.log("Saving risk data:", risks);
    alert("리스크 관리 데이터가 저장되었습니다.");
  };

  const filteredRisks = useMemo(() => {
    if (!searchQuery) return risks;
    return risks.filter(
      (risk) =>
        risk.riskNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.processArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.riskDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [risks, searchQuery]);

  const risksByLevel = useMemo(() => {
    const high = risks.filter((r) => r.rpn >= 15);
    const medium = risks.filter((r) => r.rpn >= 8 && r.rpn < 15);
    const low = risks.filter((r) => r.rpn < 8);
    return { high, medium, low };
  }, [risks]);

  // Risk Matrix data (5x5 grid)
  const riskMatrix = useMemo(() => {
    const matrix: { [key: string]: RiskItem[] } = {};
    for (let s = 1; s <= 5; s++) {
      for (let l = 1; l <= 5; l++) {
        matrix[`${l}-${s}`] = risks.filter(
          (r) => r.likelihood === l && r.severity === s
        );
      }
    }
    return matrix;
  }, [risks]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">리스크 관리</h1>
          <p className="text-muted-foreground">
            IATF 16949 기반 리스크 기반 사고 (Risk-based Thinking)
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 리스크</p>
                <p className="text-2xl font-bold">{risks.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">고위험 (RPN 15+)</p>
                <p className="text-2xl font-bold text-red-700">
                  {risksByLevel.high.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">중위험 (RPN 8-14)</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {risksByLevel.medium.length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">저위험 (RPN 7-)</p>
                <p className="text-2xl font-bold text-green-700">
                  {risksByLevel.low.length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identification">리스크 식별</TabsTrigger>
          <TabsTrigger value="assessment">리스크 평가</TabsTrigger>
          <TabsTrigger value="mitigation">대응 계획</TabsTrigger>
          <TabsTrigger value="history">리스크 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Risk Identification */}
        <TabsContent value="identification">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  리스크 식별 (Risk Identification)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="riskNumber">리스크번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="riskNumber"
                        value={formData.riskNumber}
                        onChange={(e) => updateField("riskNumber", e.target.value)}
                        placeholder="RISK-YYYY-XXX"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateRiskNumber}
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
                    <Label htmlFor="processArea">프로세스/영역</Label>
                    <Input
                      id="processArea"
                      value={formData.processArea}
                      onChange={(e) => updateField("processArea", e.target.value)}
                      placeholder="예: 사출 공정, 도장 공정"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>리스크 유형</Label>
                    <Select
                      value={formData.riskType}
                      onValueChange={(value) =>
                        updateField("riskType", value as RiskType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quality">품질</SelectItem>
                        <SelectItem value="delivery">납기</SelectItem>
                        <SelectItem value="cost">비용</SelectItem>
                        <SelectItem value="safety">안전</SelectItem>
                        <SelectItem value="environment">환경</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Risk Description */}
                <div className="space-y-2">
                  <Label htmlFor="riskDescription">리스크 내용</Label>
                  <Textarea
                    id="riskDescription"
                    value={formData.riskDescription}
                    onChange={(e) => updateField("riskDescription", e.target.value)}
                    placeholder="리스크 내용을 상세히 기술하세요"
                    rows={3}
                  />
                </div>

                {/* Risk Assessment */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">리스크 평가</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>발생가능성 (1-5)</Label>
                      <Select
                        value={String(formData.likelihood)}
                        onValueChange={(value) =>
                          updateField("likelihood", Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - 거의 발생 안함</SelectItem>
                          <SelectItem value="2">2 - 낮음</SelectItem>
                          <SelectItem value="3">3 - 보통</SelectItem>
                          <SelectItem value="4">4 - 높음</SelectItem>
                          <SelectItem value="5">5 - 매우 높음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>심각도 (1-5)</Label>
                      <Select
                        value={String(formData.severity)}
                        onValueChange={(value) =>
                          updateField("severity", Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - 경미</SelectItem>
                          <SelectItem value="2">2 - 낮음</SelectItem>
                          <SelectItem value="3">3 - 보통</SelectItem>
                          <SelectItem value="4">4 - 심각</SelectItem>
                          <SelectItem value="5">5 - 치명적</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>RPN (자동계산)</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-10 px-4 flex items-center justify-center rounded-md font-bold text-lg ${getRiskLevelColor(
                            getRiskLevel(currentRPN)
                          )}`}
                        >
                          {currentRPN}
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-sm ${getRiskLevelColor(
                            getRiskLevel(currentRPN)
                          )}`}
                        >
                          {getRiskLevelLabel(getRiskLevel(currentRPN))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <div className="flex justify-end">
                  <Button onClick={handleAddRisk}>
                    <Plus className="mr-2 h-4 w-4" />
                    리스크 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registered Risks List */}
            <Card>
              <CardHeader>
                <CardTitle>등록된 리스크 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>리스크번호</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead>프로세스/영역</TableHead>
                      <TableHead>리스크 내용</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>발생가능성</TableHead>
                      <TableHead>심각도</TableHead>
                      <TableHead>RPN</TableHead>
                      <TableHead>등급</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell className="font-mono">{risk.riskNumber}</TableCell>
                        <TableCell>
                          {new Date(risk.registrationDate).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell>{risk.processArea}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {risk.riskDescription}
                        </TableCell>
                        <TableCell>
                          {risk.riskType ? riskTypeLabels[risk.riskType] : "-"}
                        </TableCell>
                        <TableCell className="text-center">{risk.likelihood}</TableCell>
                        <TableCell className="text-center">{risk.severity}</TableCell>
                        <TableCell className="text-center font-bold">{risk.rpn}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                              getRiskLevel(risk.rpn)
                            )}`}
                          >
                            {getRiskLevelLabel(getRiskLevel(risk.rpn))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRisk(risk.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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

        {/* Tab 2: Risk Assessment */}
        <TabsContent value="assessment">
          <div className="space-y-6">
            {/* Risk Level Classification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* High Risk */}
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    고위험 (RPN 15 이상)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {risksByLevel.high.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        고위험 리스크가 없습니다.
                      </p>
                    ) : (
                      risksByLevel.high.map((risk) => (
                        <div
                          key={risk.id}
                          className="p-3 border rounded-lg bg-red-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{risk.riskNumber}</p>
                              <p className="text-sm text-gray-600">{risk.processArea}</p>
                            </div>
                            <span className="font-bold text-red-700">
                              RPN: {risk.rpn}
                            </span>
                          </div>
                          <p className="text-sm mt-2">{risk.riskDescription}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Medium Risk */}
              <Card className="border-yellow-200">
                <CardHeader className="bg-yellow-50">
                  <CardTitle className="flex items-center gap-2 text-yellow-700">
                    <Shield className="h-5 w-5" />
                    중위험 (RPN 8-14)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {risksByLevel.medium.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        중위험 리스크가 없습니다.
                      </p>
                    ) : (
                      risksByLevel.medium.map((risk) => (
                        <div
                          key={risk.id}
                          className="p-3 border rounded-lg bg-yellow-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{risk.riskNumber}</p>
                              <p className="text-sm text-gray-600">{risk.processArea}</p>
                            </div>
                            <span className="font-bold text-yellow-700">
                              RPN: {risk.rpn}
                            </span>
                          </div>
                          <p className="text-sm mt-2">{risk.riskDescription}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Low Risk */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Shield className="h-5 w-5" />
                    저위험 (RPN 7 이하)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {risksByLevel.low.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        저위험 리스크가 없습니다.
                      </p>
                    ) : (
                      risksByLevel.low.map((risk) => (
                        <div
                          key={risk.id}
                          className="p-3 border rounded-lg bg-green-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{risk.riskNumber}</p>
                              <p className="text-sm text-gray-600">{risk.processArea}</p>
                            </div>
                            <span className="font-bold text-green-700">
                              RPN: {risk.rpn}
                            </span>
                          </div>
                          <p className="text-sm mt-2">{risk.riskDescription}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>리스크 매트릭스 (Risk Matrix)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-gray-100" rowSpan={2}>
                          발생가능성
                        </th>
                        <th className="border p-2 bg-gray-100" colSpan={5}>
                          심각도 (Severity)
                        </th>
                      </tr>
                      <tr>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <th key={s} className="border p-2 bg-gray-50 w-24">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[5, 4, 3, 2, 1].map((l) => (
                        <tr key={l}>
                          <th className="border p-2 bg-gray-50 w-24">{l}</th>
                          {[1, 2, 3, 4, 5].map((s) => {
                            const rpn = l * s;
                            const level = getRiskLevel(rpn);
                            const cellRisks = riskMatrix[`${l}-${s}`] || [];
                            let bgColor = "bg-green-100";
                            if (level === "high") bgColor = "bg-red-200";
                            else if (level === "medium") bgColor = "bg-yellow-200";

                            return (
                              <td
                                key={s}
                                className={`border p-2 text-center ${bgColor} h-20 align-top`}
                              >
                                <div className="text-xs font-medium mb-1">
                                  RPN: {rpn}
                                </div>
                                {cellRisks.length > 0 && (
                                  <div className="text-xs">
                                    {cellRisks.map((r) => (
                                      <div
                                        key={r.id}
                                        className="bg-white rounded px-1 py-0.5 mb-1 truncate"
                                        title={r.riskDescription}
                                      >
                                        {r.riskNumber}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span>고위험 (RPN 15+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span>중위험 (RPN 8-14)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span>저위험 (RPN 7-)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Mitigation Plan */}
        <TabsContent value="mitigation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                대응 계획 (Mitigation Plan)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>리스크번호</TableHead>
                    <TableHead>리스크 내용</TableHead>
                    <TableHead>현재 RPN</TableHead>
                    <TableHead>대응 방안</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>완료예정일</TableHead>
                    <TableHead>잔여 RPN</TableHead>
                    <TableHead>조치 상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-mono">{risk.riskNumber}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={risk.riskDescription}>
                          {risk.riskDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded font-bold ${getRiskLevelColor(
                            getRiskLevel(risk.rpn)
                          )}`}
                        >
                          {risk.rpn}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={risk.mitigationPlan}>
                          {risk.mitigationPlan || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{risk.responsible || "-"}</TableCell>
                      <TableCell>
                        {risk.dueDate
                          ? new Date(risk.dueDate).toLocaleDateString("ko-KR")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded font-bold ${getRiskLevelColor(
                            getRiskLevel(risk.residualRpn)
                          )}`}
                        >
                          {risk.residualRpn}
                        </span>
                      </TableCell>
                      <TableCell>
                        {risk.actionStatus ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              actionStatusColors[risk.actionStatus] || "bg-gray-100"
                            }`}
                          >
                            {actionStatusLabels[risk.actionStatus] || risk.actionStatus}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Risk Reduction Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">리스크 저감 현황</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">전체 리스크</p>
                    <p className="text-xl font-bold">{risks.length}건</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">조치 완료</p>
                    <p className="text-xl font-bold text-green-600">
                      {risks.filter((r) => r.actionStatus === "completed" || r.actionStatus === "verified").length}건
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">진행중</p>
                    <p className="text-xl font-bold text-blue-600">
                      {risks.filter((r) => r.actionStatus === "in-progress").length}건
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">평균 RPN 저감율</p>
                    <p className="text-xl font-bold text-purple-600">
                      {risks.length > 0
                        ? Math.round(
                            ((risks.reduce((acc, r) => acc + r.rpn, 0) -
                              risks.reduce((acc, r) => acc + r.residualRpn, 0)) /
                              risks.reduce((acc, r) => acc + r.rpn, 0)) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Risk History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  리스크 이력 (Risk History)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>리스크번호</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>프로세스/영역</TableHead>
                    <TableHead>리스크 유형</TableHead>
                    <TableHead>리스크 내용</TableHead>
                    <TableHead>초기 RPN</TableHead>
                    <TableHead>현재 RPN</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRisks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-mono">{risk.riskNumber}</TableCell>
                      <TableCell>
                        {new Date(risk.registrationDate).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>{risk.processArea}</TableCell>
                      <TableCell>
                        {risk.riskType ? riskTypeLabels[risk.riskType] : "-"}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={risk.riskDescription}>
                          {risk.riskDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded font-bold ${getRiskLevelColor(
                            getRiskLevel(risk.rpn)
                          )}`}
                        >
                          {risk.rpn}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded font-bold ${getRiskLevelColor(
                            getRiskLevel(risk.residualRpn)
                          )}`}
                        >
                          {risk.residualRpn}
                        </span>
                      </TableCell>
                      <TableCell>{risk.responsible || "-"}</TableCell>
                      <TableCell>
                        {risk.actionStatus ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              actionStatusColors[risk.actionStatus] || "bg-gray-100"
                            }`}
                          >
                            {actionStatusLabels[risk.actionStatus] || risk.actionStatus}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={risk.remarks}>
                          {risk.remarks || "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRisks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
