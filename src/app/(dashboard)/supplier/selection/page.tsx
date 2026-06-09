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
  Save,
  FileText,
  ClipboardCheck,
  History,
  Building2,
  Award,
  Settings,
  Shield,
  DollarSign,
} from "lucide-react";

// Types
interface VendorBasicInfo {
  companyName: string;
  representative: string;
  businessNumber: string;
  address: string;
  businessType: string;
  businessCategory: string;
  phone: string;
  fax: string;
  email: string;
  establishedDate: string;
  employeeCount: string;
  mainProducts: string;
}

interface DevelopmentCapabilityScore {
  technicalLevel: number; // 0-20
  equipmentCapacity: number; // 0-15
  rdCapability: number; // 0-15
  processManagement: number; // 0-10
}

interface QualityAssuranceScore {
  qualitySystem: number; // 0-15
  inspectionCapability: number; // 0-15
  documentManagement: number; // 0-10
  traceability: number; // 0-10
}

interface FinancialStatusScore {
  profitability: number; // 0-15
  stability: number; // 0-15
  growthPotential: number; // 0-10
  creditRating: number; // 0-10
}

interface SelectionFormData {
  // Header
  reportNumber: string;
  reportDate: string;
  evaluator: string;
  department: string;
  selectionType: "new" | "existing" | "";
  purchaseCategory: string;

  // Vendor Info
  vendor: VendorBasicInfo;

  // Scores
  development: DevelopmentCapabilityScore;
  quality: QualityAssuranceScore;
  financial: FinancialStatusScore;

  // Overall Evaluation
  overallComment: string;
  selectionDecision: "approved" | "conditional" | "rejected" | "";
  approvalConditions: string;
}

interface SelectionHistory {
  id: number;
  reportNumber: string;
  reportDate: string;
  companyName: string;
  evaluator: string;
  selectionType: string;
  totalScore: number;
  grade: string;
  decision: string;
}

const initialFormData: SelectionFormData = {
  reportNumber: "",
  reportDate: "",
  evaluator: "",
  department: "",
  selectionType: "",
  purchaseCategory: "",
  vendor: {
    companyName: "",
    representative: "",
    businessNumber: "",
    address: "",
    businessType: "",
    businessCategory: "",
    phone: "",
    fax: "",
    email: "",
    establishedDate: "",
    employeeCount: "",
    mainProducts: "",
  },
  development: {
    technicalLevel: 0,
    equipmentCapacity: 0,
    rdCapability: 0,
    processManagement: 0,
  },
  quality: {
    qualitySystem: 0,
    inspectionCapability: 0,
    documentManagement: 0,
    traceability: 0,
  },
  financial: {
    profitability: 0,
    stability: 0,
    growthPotential: 0,
    creditRating: 0,
  },
  overallComment: "",
  selectionDecision: "",
  approvalConditions: "",
};

// Sample history data
const sampleHistory: SelectionHistory[] = [
  {
    id: 1,
    reportNumber: "SEL-2026-001",
    reportDate: "2026-03-15",
    companyName: "ABC 전자부품",
    evaluator: "김구매",
    selectionType: "신규",
    totalScore: 88,
    grade: "A",
    decision: "승인",
  },
  {
    id: 2,
    reportNumber: "SEL-2026-002",
    reportDate: "2026-04-20",
    companyName: "XYZ 금속",
    evaluator: "이구매",
    selectionType: "신규",
    totalScore: 75,
    grade: "B",
    decision: "조건부승인",
  },
  {
    id: 3,
    reportNumber: "SEL-2026-003",
    reportDate: "2026-05-10",
    companyName: "DEF 플라스틱",
    evaluator: "박구매",
    selectionType: "기존",
    totalScore: 92,
    grade: "A",
    decision: "승인",
  },
  {
    id: 4,
    reportNumber: "SEL-2026-004",
    reportDate: "2026-05-25",
    companyName: "GHI 화학",
    evaluator: "김구매",
    selectionType: "신규",
    totalScore: 58,
    grade: "D",
    decision: "불승인",
  },
];

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
};

const decisionColors: Record<string, string> = {
  승인: "bg-green-100 text-green-800",
  조건부승인: "bg-yellow-100 text-yellow-800",
  불승인: "bg-red-100 text-red-800",
};

function calculateGrade(totalScore: number): { grade: string; decision: string } {
  if (totalScore >= 85) return { grade: "A", decision: "승인" };
  if (totalScore >= 70) return { grade: "B", decision: "조건부승인" };
  if (totalScore >= 60) return { grade: "C", decision: "조건부승인" };
  return { grade: "D", decision: "불승인" };
}

export default function VendorSelectionReportPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<SelectionFormData>(initialFormData);
  const [history] = useState<SelectionHistory[]>(sampleHistory);

  const updateField = <K extends keyof SelectionFormData>(
    field: K,
    value: SelectionFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateVendor = <K extends keyof VendorBasicInfo>(
    field: K,
    value: VendorBasicInfo[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      vendor: { ...prev.vendor, [field]: value },
    }));
  };

  const updateDevelopment = <K extends keyof DevelopmentCapabilityScore>(
    field: K,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      development: { ...prev.development, [field]: value },
    }));
  };

  const updateQuality = <K extends keyof QualityAssuranceScore>(
    field: K,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      quality: { ...prev.quality, [field]: value },
    }));
  };

  const updateFinancial = <K extends keyof FinancialStatusScore>(
    field: K,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      financial: { ...prev.financial, [field]: value },
    }));
  };

  // Calculate scores
  const developmentTotal = useMemo(
    () =>
      formData.development.technicalLevel +
      formData.development.equipmentCapacity +
      formData.development.rdCapability +
      formData.development.processManagement,
    [formData.development]
  );

  const qualityTotal = useMemo(
    () =>
      formData.quality.qualitySystem +
      formData.quality.inspectionCapability +
      formData.quality.documentManagement +
      formData.quality.traceability,
    [formData.quality]
  );

  const financialTotal = useMemo(
    () =>
      formData.financial.profitability +
      formData.financial.stability +
      formData.financial.growthPotential +
      formData.financial.creditRating,
    [formData.financial]
  );

  const totalScore = useMemo(
    () => developmentTotal + qualityTotal + financialTotal,
    [developmentTotal, qualityTotal, financialTotal]
  );

  const { grade, decision } = useMemo(
    () => calculateGrade(totalScore),
    [totalScore]
  );

  const generateReportNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("reportNumber", `SEL-${year}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving selection report data:", formData);
    alert("업체선정 보고서가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">업체 선정 보고서</h1>
          <p className="text-muted-foreground">협력업체 선정 평가 및 보고서 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">업체 기본정보</TabsTrigger>
          <TabsTrigger value="evaluation">업체 평가표</TabsTrigger>
          <TabsTrigger value="result">종합 평가</TabsTrigger>
          <TabsTrigger value="history">선정 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Vendor Basic Info */}
        <TabsContent value="basic">
          <div className="space-y-6">
            {/* Report Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  보고서 기본정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportNumber">보고서번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="reportNumber"
                        value={formData.reportNumber}
                        onChange={(e) =>
                          updateField("reportNumber", e.target.value)
                        }
                        placeholder="SEL-YYYY-XXX"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateReportNumber}
                        className="shrink-0"
                      >
                        자동
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportDate">작성일자</Label>
                    <Input
                      id="reportDate"
                      type="date"
                      value={formData.reportDate}
                      onChange={(e) => updateField("reportDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluator">작성자</Label>
                    <Input
                      id="evaluator"
                      value={formData.evaluator}
                      onChange={(e) => updateField("evaluator", e.target.value)}
                      placeholder="작성자명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">담당부서</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      placeholder="구매팀"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>선정유형</Label>
                    <Select
                      value={formData.selectionType}
                      onValueChange={(value) =>
                        updateField(
                          "selectionType",
                          value as SelectionFormData["selectionType"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">신규업체</SelectItem>
                        <SelectItem value="existing">기존업체</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseCategory">구매품목분류</Label>
                    <Input
                      id="purchaseCategory"
                      value={formData.purchaseCategory}
                      onChange={(e) =>
                        updateField("purchaseCategory", e.target.value)
                      }
                      placeholder="원자재/부품/외주가공"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  업체 기본정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">업체명</Label>
                    <Input
                      id="companyName"
                      value={formData.vendor.companyName}
                      onChange={(e) => updateVendor("companyName", e.target.value)}
                      placeholder="업체명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="representative">대표자</Label>
                    <Input
                      id="representative"
                      value={formData.vendor.representative}
                      onChange={(e) =>
                        updateVendor("representative", e.target.value)
                      }
                      placeholder="대표자명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessNumber">사업자등록번호</Label>
                    <Input
                      id="businessNumber"
                      value={formData.vendor.businessNumber}
                      onChange={(e) =>
                        updateVendor("businessNumber", e.target.value)
                      }
                      placeholder="000-00-00000"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="address">주소</Label>
                    <Input
                      id="address"
                      value={formData.vendor.address}
                      onChange={(e) => updateVendor("address", e.target.value)}
                      placeholder="사업장 주소 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">업태</Label>
                    <Input
                      id="businessType"
                      value={formData.vendor.businessType}
                      onChange={(e) =>
                        updateVendor("businessType", e.target.value)
                      }
                      placeholder="제조업"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">업종</Label>
                    <Input
                      id="businessCategory"
                      value={formData.vendor.businessCategory}
                      onChange={(e) =>
                        updateVendor("businessCategory", e.target.value)
                      }
                      placeholder="자동차부품"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={formData.vendor.phone}
                      onChange={(e) => updateVendor("phone", e.target.value)}
                      placeholder="000-0000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fax">팩스</Label>
                    <Input
                      id="fax"
                      value={formData.vendor.fax}
                      onChange={(e) => updateVendor("fax", e.target.value)}
                      placeholder="000-0000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.vendor.email}
                      onChange={(e) => updateVendor("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishedDate">설립일</Label>
                    <Input
                      id="establishedDate"
                      type="date"
                      value={formData.vendor.establishedDate}
                      onChange={(e) =>
                        updateVendor("establishedDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">종업원수</Label>
                    <Input
                      id="employeeCount"
                      value={formData.vendor.employeeCount}
                      onChange={(e) =>
                        updateVendor("employeeCount", e.target.value)
                      }
                      placeholder="00명"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-3">
                    <Label htmlFor="mainProducts">주요 납품 품목</Label>
                    <Textarea
                      id="mainProducts"
                      value={formData.vendor.mainProducts}
                      onChange={(e) =>
                        updateVendor("mainProducts", e.target.value)
                      }
                      placeholder="주요 납품 품목을 입력하세요"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Vendor Evaluation Form */}
        <TabsContent value="evaluation">
          <div className="space-y-6">
            {/* Development Capability (60 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    개발역량 (60점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {developmentTotal} / 60점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="technicalLevel">기술수준 (20점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.development.technicalLevel}점
                      </span>
                    </div>
                    <Input
                      id="technicalLevel"
                      type="range"
                      min="0"
                      max="20"
                      value={formData.development.technicalLevel}
                      onChange={(e) =>
                        updateDevelopment("technicalLevel", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      우수: 20점, 양호: 15점, 보통: 10점, 미흡: 5점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="equipmentCapacity">설비능력 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.development.equipmentCapacity}점
                      </span>
                    </div>
                    <Input
                      id="equipmentCapacity"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.development.equipmentCapacity}
                      onChange={(e) =>
                        updateDevelopment(
                          "equipmentCapacity",
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      최신장비: 15점, 양호: 12점, 보통: 8점, 노후: 4점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="rdCapability">R&D역량 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.development.rdCapability}점
                      </span>
                    </div>
                    <Input
                      id="rdCapability"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.development.rdCapability}
                      onChange={(e) =>
                        updateDevelopment("rdCapability", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      연구소보유: 15점, R&D조직: 10점, 기술인력: 5점, 미보유: 0점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="processManagement">공정관리 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.development.processManagement}점
                      </span>
                    </div>
                    <Input
                      id="processManagement"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.development.processManagement}
                      onChange={(e) =>
                        updateDevelopment(
                          "processManagement",
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      체계적: 10점, 양호: 7점, 보통: 5점, 미흡: 2점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Assurance (50 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    품질보증 (50점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {qualityTotal} / 50점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="qualitySystem">품질시스템 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.qualitySystem}점
                      </span>
                    </div>
                    <Input
                      id="qualitySystem"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.quality.qualitySystem}
                      onChange={(e) =>
                        updateQuality("qualitySystem", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      IATF16949: 15점, ISO9001: 12점, 자체시스템: 7점, 미인증: 3점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="inspectionCapability">검사능력 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.inspectionCapability}점
                      </span>
                    </div>
                    <Input
                      id="inspectionCapability"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.quality.inspectionCapability}
                      onChange={(e) =>
                        updateQuality(
                          "inspectionCapability",
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      전수검사가능: 15점, 샘플링검사: 10점, 외부의뢰: 5점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="documentManagement">문서관리 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.documentManagement}점
                      </span>
                    </div>
                    <Input
                      id="documentManagement"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.quality.documentManagement}
                      onChange={(e) =>
                        updateQuality("documentManagement", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      전산화: 10점, 체계적: 7점, 보통: 5점, 미흡: 2점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="traceability">추적성 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.traceability}점
                      </span>
                    </div>
                    <Input
                      id="traceability"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.quality.traceability}
                      onChange={(e) =>
                        updateQuality("traceability", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      완벽: 10점, 양호: 7점, 보통: 5점, 미흡: 2점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Status (40 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    재정상태 (40점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {financialTotal} / 40점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="profitability">수익성 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.financial.profitability}점
                      </span>
                    </div>
                    <Input
                      id="profitability"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.financial.profitability}
                      onChange={(e) =>
                        updateFinancial("profitability", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      영업이익률 10%+: 15점, 5~10%: 12점, 1~5%: 8점, 0% 이하: 4점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="stability">안정성 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.financial.stability}점
                      </span>
                    </div>
                    <Input
                      id="stability"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.financial.stability}
                      onChange={(e) =>
                        updateFinancial("stability", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      부채비율 100% 미만: 15점, 100~200%: 10점, 200~300%: 6점, 300%+: 3점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="growthPotential">성장성 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.financial.growthPotential}점
                      </span>
                    </div>
                    <Input
                      id="growthPotential"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.financial.growthPotential}
                      onChange={(e) =>
                        updateFinancial("growthPotential", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      매출성장 20%+: 10점, 10~20%: 7점, 0~10%: 5점, 감소: 2점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="creditRating">신용등급 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.financial.creditRating}점
                      </span>
                    </div>
                    <Input
                      id="creditRating"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.financial.creditRating}
                      onChange={(e) =>
                        updateFinancial("creditRating", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      A등급: 10점, B등급: 7점, C등급: 4점, D등급 이하: 2점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Overall Evaluation */}
        <TabsContent value="result">
          <div className="space-y-6">
            {/* Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  종합 평가 결과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">부문별 점수</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          개발역량 (60점)
                        </span>
                        <span className="font-bold">{developmentTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          품질보증 (50점)
                        </span>
                        <span className="font-bold">{qualityTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          재정상태 (40점)
                        </span>
                        <span className="font-bold">{financialTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                        <span className="font-semibold text-lg">총점</span>
                        <span className="font-bold text-2xl text-primary">
                          {totalScore}점 / 150점
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grade and Decision */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">등급 및 선정결과</h3>
                    <div className="space-y-4">
                      <div className="p-6 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">평가등급</p>
                        <span
                          className={`inline-block px-6 py-3 rounded-full text-3xl font-bold ${gradeColors[grade]}`}
                        >
                          {grade}등급
                        </span>
                      </div>
                      <div className="p-6 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-2">선정결과</p>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${decisionColors[decision]}`}
                        >
                          {decision}
                        </span>
                      </div>
                    </div>

                    {/* Grade Legend */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-3">등급 기준</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                            A
                          </span>
                          <span>85점 이상 (128점+) - 승인</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            B
                          </span>
                          <span>70~84점 (105~127점) - 조건부승인</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                            C
                          </span>
                          <span>60~69점 (90~104점) - 조건부승인</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">
                            D
                          </span>
                          <span>60점 미만 (90점 미만) - 불승인</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selection Decision */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  선정 결정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>최종 선정 결정</Label>
                  <Select
                    value={formData.selectionDecision}
                    onValueChange={(value) =>
                      updateField(
                        "selectionDecision",
                        value as SelectionFormData["selectionDecision"]
                      )
                    }
                  >
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="결정 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="conditional">조건부승인</SelectItem>
                      <SelectItem value="rejected">불승인</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overallComment">종합의견</Label>
                  <Textarea
                    id="overallComment"
                    value={formData.overallComment}
                    onChange={(e) => updateField("overallComment", e.target.value)}
                    placeholder="업체 선정에 대한 종합 의견을 기재하세요"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalConditions">승인조건 (조건부승인 시)</Label>
                  <Textarea
                    id="approvalConditions"
                    value={formData.approvalConditions}
                    onChange={(e) =>
                      updateField("approvalConditions", e.target.value)
                    }
                    placeholder="조건부승인 시 충족해야 할 조건을 기재하세요"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Selection History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                선정 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground">등록된 선정 이력이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>보고서번호</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>선정유형</TableHead>
                      <TableHead>총점</TableHead>
                      <TableHead>등급</TableHead>
                      <TableHead>결정</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">
                          {item.reportNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.companyName}
                        </TableCell>
                        <TableCell>{item.reportDate}</TableCell>
                        <TableCell>{item.evaluator}</TableCell>
                        <TableCell>{item.selectionType}</TableCell>
                        <TableCell className="font-bold">{item.totalScore}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[item.grade]}`}
                          >
                            {item.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${decisionColors[item.decision]}`}
                          >
                            {item.decision}
                          </span>
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
    </div>
  );
}
