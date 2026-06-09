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
import { Star, Save, FileText, ClipboardCheck, History, Building2 } from "lucide-react";

// Types
interface SupplierInfo {
  companyName: string;
  representative: string;
  businessNumber: string;
  industry: string;
  mainProducts: string;
}

interface QualityScore {
  defectRate: number; // 0-15
  claimCount: number; // 0-15
  certification: number; // 0-10
}

interface DeliveryScore {
  onTimeRate: number; // 0-20
  emergencyResponse: number; // 0-10
}

interface PriceScore {
  competitiveness: number; // 0-10
  costReduction: number; // 0-5
}

interface TechScore {
  capability: number; // 0-10
  cooperation: number; // 0-5
}

interface EvaluationFormData {
  // Header
  evaluationNumber: string;
  evaluationPeriodStart: string;
  evaluationPeriodEnd: string;
  evaluator: string;
  evaluationType: "regular" | "adhoc" | "";

  // Supplier Info
  supplier: SupplierInfo;

  // Scores
  quality: QualityScore;
  delivery: DeliveryScore;
  price: PriceScore;
  tech: TechScore;

  // Improvement Requirements
  issues: string;
  improvementDeadline: string;
}

interface EvaluationHistory {
  id: number;
  evaluationNumber: string;
  evaluationPeriod: string;
  companyName: string;
  evaluator: string;
  evaluationType: string;
  totalScore: number;
  grade: string;
  action: string;
  evaluationDate: string;
}

const initialFormData: EvaluationFormData = {
  evaluationNumber: "",
  evaluationPeriodStart: "",
  evaluationPeriodEnd: "",
  evaluator: "",
  evaluationType: "",
  supplier: {
    companyName: "",
    representative: "",
    businessNumber: "",
    industry: "",
    mainProducts: "",
  },
  quality: {
    defectRate: 0,
    claimCount: 0,
    certification: 0,
  },
  delivery: {
    onTimeRate: 0,
    emergencyResponse: 0,
  },
  price: {
    competitiveness: 0,
    costReduction: 0,
  },
  tech: {
    capability: 0,
    cooperation: 0,
  },
  issues: "",
  improvementDeadline: "",
};

// Sample history data
const sampleHistory: EvaluationHistory[] = [
  {
    id: 1,
    evaluationNumber: "EVL-2026-001",
    evaluationPeriod: "2026-01 ~ 2026-03",
    companyName: "ABC 전자부품",
    evaluator: "김평가",
    evaluationType: "정기",
    totalScore: 92,
    grade: "A",
    action: "유지",
    evaluationDate: "2026-04-15",
  },
  {
    id: 2,
    evaluationNumber: "EVL-2026-002",
    evaluationPeriod: "2026-01 ~ 2026-03",
    companyName: "XYZ 금속",
    evaluator: "이평가",
    evaluationType: "정기",
    totalScore: 78,
    grade: "B",
    action: "관리",
    evaluationDate: "2026-04-15",
  },
  {
    id: 3,
    evaluationNumber: "EVL-2026-003",
    evaluationPeriod: "2026-04 ~ 2026-05",
    companyName: "DEF 플라스틱",
    evaluator: "박평가",
    evaluationType: "수시",
    totalScore: 65,
    grade: "C",
    action: "개선요구",
    evaluationDate: "2026-05-20",
  },
  {
    id: 4,
    evaluationNumber: "EVL-2026-004",
    evaluationPeriod: "2026-01 ~ 2026-03",
    companyName: "GHI 화학",
    evaluator: "김평가",
    evaluationType: "정기",
    totalScore: 52,
    grade: "D",
    action: "거래중지검토",
    evaluationDate: "2026-04-18",
  },
];

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
};

const actionColors: Record<string, string> = {
  유지: "bg-green-100 text-green-800",
  관리: "bg-blue-100 text-blue-800",
  개선요구: "bg-yellow-100 text-yellow-800",
  거래중지검토: "bg-red-100 text-red-800",
};

function calculateGrade(totalScore: number): { grade: string; action: string } {
  if (totalScore >= 90) return { grade: "A", action: "유지" };
  if (totalScore >= 70) return { grade: "B", action: "관리" };
  if (totalScore >= 60) return { grade: "C", action: "개선요구" };
  return { grade: "D", action: "거래중지검토" };
}

export default function SupplierEvaluationPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<EvaluationFormData>(initialFormData);
  const [history] = useState<EvaluationHistory[]>(sampleHistory);

  const updateField = <K extends keyof EvaluationFormData>(
    field: K,
    value: EvaluationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSupplier = <K extends keyof SupplierInfo>(
    field: K,
    value: SupplierInfo[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      supplier: { ...prev.supplier, [field]: value },
    }));
  };

  const updateQuality = <K extends keyof QualityScore>(
    field: K,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      quality: { ...prev.quality, [field]: value },
    }));
  };

  const updateDelivery = <K extends keyof DeliveryScore>(
    field: K,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      delivery: { ...prev.delivery, [field]: value },
    }));
  };

  const updatePrice = <K extends keyof PriceScore>(field: K, value: number) => {
    setFormData((prev) => ({
      ...prev,
      price: { ...prev.price, [field]: value },
    }));
  };

  const updateTech = <K extends keyof TechScore>(field: K, value: number) => {
    setFormData((prev) => ({
      ...prev,
      tech: { ...prev.tech, [field]: value },
    }));
  };

  // Calculate scores
  const qualityTotal = useMemo(
    () =>
      formData.quality.defectRate +
      formData.quality.claimCount +
      formData.quality.certification,
    [formData.quality]
  );

  const deliveryTotal = useMemo(
    () => formData.delivery.onTimeRate + formData.delivery.emergencyResponse,
    [formData.delivery]
  );

  const priceTotal = useMemo(
    () => formData.price.competitiveness + formData.price.costReduction,
    [formData.price]
  );

  const techTotal = useMemo(
    () => formData.tech.capability + formData.tech.cooperation,
    [formData.tech]
  );

  const totalScore = useMemo(
    () => qualityTotal + deliveryTotal + priceTotal + techTotal,
    [qualityTotal, deliveryTotal, priceTotal, techTotal]
  );

  const { grade, action } = useMemo(
    () => calculateGrade(totalScore),
    [totalScore]
  );

  const generateEvaluationNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("evaluationNumber", `EVL-${year}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving evaluation data:", formData);
    alert("평가 데이터가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공급자평가</h1>
          <p className="text-muted-foreground">협력업체 평가 등록 및 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">평가 기본정보</TabsTrigger>
          <TabsTrigger value="criteria">평가 항목</TabsTrigger>
          <TabsTrigger value="result">평가 결과</TabsTrigger>
          <TabsTrigger value="history">평가 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic">
          <div className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  평가 기본정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="evaluationNumber">평가번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="evaluationNumber"
                        value={formData.evaluationNumber}
                        onChange={(e) =>
                          updateField("evaluationNumber", e.target.value)
                        }
                        placeholder="EVL-YYYY-XXX"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateEvaluationNumber}
                        className="shrink-0"
                      >
                        자동
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluationPeriodStart">평가기간 (시작)</Label>
                    <Input
                      id="evaluationPeriodStart"
                      type="date"
                      value={formData.evaluationPeriodStart}
                      onChange={(e) =>
                        updateField("evaluationPeriodStart", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluationPeriodEnd">평가기간 (종료)</Label>
                    <Input
                      id="evaluationPeriodEnd"
                      type="date"
                      value={formData.evaluationPeriodEnd}
                      onChange={(e) =>
                        updateField("evaluationPeriodEnd", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluator">평가자</Label>
                    <Input
                      id="evaluator"
                      value={formData.evaluator}
                      onChange={(e) => updateField("evaluator", e.target.value)}
                      placeholder="평가자명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>평가유형</Label>
                    <Select
                      value={formData.evaluationType}
                      onValueChange={(value) =>
                        updateField(
                          "evaluationType",
                          value as EvaluationFormData["evaluationType"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">정기</SelectItem>
                        <SelectItem value="adhoc">수시</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Info Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  공급자 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">업체명</Label>
                    <Input
                      id="companyName"
                      value={formData.supplier.companyName}
                      onChange={(e) =>
                        updateSupplier("companyName", e.target.value)
                      }
                      placeholder="업체명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="representative">대표자</Label>
                    <Input
                      id="representative"
                      value={formData.supplier.representative}
                      onChange={(e) =>
                        updateSupplier("representative", e.target.value)
                      }
                      placeholder="대표자명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessNumber">사업자번호</Label>
                    <Input
                      id="businessNumber"
                      value={formData.supplier.businessNumber}
                      onChange={(e) =>
                        updateSupplier("businessNumber", e.target.value)
                      }
                      placeholder="000-00-00000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">업종</Label>
                    <Input
                      id="industry"
                      value={formData.supplier.industry}
                      onChange={(e) =>
                        updateSupplier("industry", e.target.value)
                      }
                      placeholder="업종 입력"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="mainProducts">주요납품품목</Label>
                    <Input
                      id="mainProducts"
                      value={formData.supplier.mainProducts}
                      onChange={(e) =>
                        updateSupplier("mainProducts", e.target.value)
                      }
                      placeholder="주요 납품 품목 입력"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Evaluation Criteria */}
        <TabsContent value="criteria">
          <div className="space-y-6">
            {/* Quality (40 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    품질 (40점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {qualityTotal} / 40점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="defectRate">입고불량율 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.defectRate}점
                      </span>
                    </div>
                    <Input
                      id="defectRate"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.quality.defectRate}
                      onChange={(e) =>
                        updateQuality("defectRate", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      0%: 15점, 0.1~0.5%: 12점, 0.5~1%: 9점, 1~2%: 6점, 2% 이상: 3점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="claimCount">클레임건수 (15점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.claimCount}점
                      </span>
                    </div>
                    <Input
                      id="claimCount"
                      type="range"
                      min="0"
                      max="15"
                      value={formData.quality.claimCount}
                      onChange={(e) =>
                        updateQuality("claimCount", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      0건: 15점, 1건: 12점, 2건: 9점, 3건: 6점, 4건 이상: 3점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="certification">품질인증 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.quality.certification}점
                      </span>
                    </div>
                    <Input
                      id="certification"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.quality.certification}
                      onChange={(e) =>
                        updateQuality("certification", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      ISO/IATF 인증: 10점, ISO만: 7점, 자체시스템: 4점, 미인증: 0점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery (30 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    납기 (30점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {deliveryTotal} / 30점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="onTimeRate">납기준수율 (20점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.delivery.onTimeRate}점
                      </span>
                    </div>
                    <Input
                      id="onTimeRate"
                      type="range"
                      min="0"
                      max="20"
                      value={formData.delivery.onTimeRate}
                      onChange={(e) =>
                        updateDelivery("onTimeRate", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      100%: 20점, 98~99%: 16점, 95~97%: 12점, 90~94%: 8점, 90% 미만: 4점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="emergencyResponse">긴급대응 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.delivery.emergencyResponse}점
                      </span>
                    </div>
                    <Input
                      id="emergencyResponse"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.delivery.emergencyResponse}
                      onChange={(e) =>
                        updateDelivery("emergencyResponse", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      우수: 10점, 양호: 7점, 보통: 5점, 미흡: 3점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price (15 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    가격 (15점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {priceTotal} / 15점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="competitiveness">가격경쟁력 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.price.competitiveness}점
                      </span>
                    </div>
                    <Input
                      id="competitiveness"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.price.competitiveness}
                      onChange={(e) =>
                        updatePrice("competitiveness", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      최저가: 10점, 평균 이하: 7점, 평균: 5점, 평균 이상: 3점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="costReduction">원가절감 (5점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.price.costReduction}점
                      </span>
                    </div>
                    <Input
                      id="costReduction"
                      type="range"
                      min="0"
                      max="5"
                      value={formData.price.costReduction}
                      onChange={(e) =>
                        updatePrice("costReduction", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      적극협조: 5점, 협조: 3점, 미협조: 1점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tech (15 points) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    기술 (15점)
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {techTotal} / 15점
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="capability">기술역량 (10점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.tech.capability}점
                      </span>
                    </div>
                    <Input
                      id="capability"
                      type="range"
                      min="0"
                      max="10"
                      value={formData.tech.capability}
                      onChange={(e) =>
                        updateTech("capability", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      우수: 10점, 양호: 7점, 보통: 5점, 미흡: 3점
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="cooperation">협력도 (5점)</Label>
                      <span className="text-sm text-muted-foreground">
                        {formData.tech.cooperation}점
                      </span>
                    </div>
                    <Input
                      id="cooperation"
                      type="range"
                      min="0"
                      max="5"
                      value={formData.tech.cooperation}
                      onChange={(e) =>
                        updateTech("cooperation", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      적극적: 5점, 협조적: 3점, 소극적: 1점
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Evaluation Result */}
        <TabsContent value="result">
          <div className="space-y-6">
            {/* Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  평가 결과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">점수 현황</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>품질 (40점)</span>
                        <span className="font-bold">{qualityTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>납기 (30점)</span>
                        <span className="font-bold">{deliveryTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>가격 (15점)</span>
                        <span className="font-bold">{priceTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>기술 (15점)</span>
                        <span className="font-bold">{techTotal}점</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                        <span className="font-semibold text-lg">총점</span>
                        <span className="font-bold text-2xl text-primary">
                          {totalScore}점 / 100점
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grade and Action */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">등급 및 조치사항</h3>
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
                        <p className="text-sm text-muted-foreground mb-2">조치사항</p>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${actionColors[action]}`}
                        >
                          {action}
                        </span>
                      </div>
                    </div>

                    {/* Grade Legend */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-3">등급 기준</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">A</span>
                          <span>90점 이상 - 유지</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">B</span>
                          <span>70~89점 - 관리</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">C</span>
                          <span>60~69점 - 개선요구</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800">D</span>
                          <span>60점 미만 - 거래중지검토</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>개선요구사항</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issues">지적사항</Label>
                  <Textarea
                    id="issues"
                    value={formData.issues}
                    onChange={(e) => updateField("issues", e.target.value)}
                    placeholder="개선이 필요한 사항을 기재하세요"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="improvementDeadline">개선기한</Label>
                  <Input
                    id="improvementDeadline"
                    type="date"
                    value={formData.improvementDeadline}
                    onChange={(e) =>
                      updateField("improvementDeadline", e.target.value)
                    }
                    className="max-w-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                평가 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground">등록된 평가 이력이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>평가번호</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead>평가기간</TableHead>
                      <TableHead>평가자</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>총점</TableHead>
                      <TableHead>등급</TableHead>
                      <TableHead>조치</TableHead>
                      <TableHead>평가일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">
                          {item.evaluationNumber}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.companyName}
                        </TableCell>
                        <TableCell>{item.evaluationPeriod}</TableCell>
                        <TableCell>{item.evaluator}</TableCell>
                        <TableCell>{item.evaluationType}</TableCell>
                        <TableCell className="font-bold">
                          {item.totalScore}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[item.grade]}`}
                          >
                            {item.grade}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[item.action]}`}
                          >
                            {item.action}
                          </span>
                        </TableCell>
                        <TableCell>{item.evaluationDate}</TableCell>
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
