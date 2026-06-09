"use client";

import { useState } from "react";
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
  Search,
  Shield,
  FileCheck,
  BarChart3,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

// Nonconformity Form Data Interface
interface NonconformityFormData {
  // Tab 1: NC Registration (부적합 발생 등록)
  ncNumber: string;
  occurrenceDate: string;
  process: string;
  productItem: string;
  ncType: "appearance" | "dimension" | "function" | "other" | "";
  ncDescription: string;
  defectQuantity: string;
  discoveredBy: string;

  // Tab 2: Analysis & Disposition (원인 분석 및 처리)
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  rootCauseConclusion: string;
  dispositionMethod: "scrap" | "concession" | "rework" | "return" | "";
  dispositionQuantity: string;
  dispositionDate: string;
  dispositionResponsible: string;

  // Tab 3: Preventive Measures (재발방지 대책)
  correctiveActionContent: string;
  completionDate: string;
  validationMethod: string;
  validationResult: "effective" | "ineffective" | "";
  validationDate: string;
}

interface NCRecord {
  id: number;
  ncNumber: string;
  occurrenceDate: string;
  process: string;
  productItem: string;
  ncType: string;
  defectQuantity: number;
  dispositionMethod: string;
  status: "open" | "in-progress" | "closed";
}

const initialFormData: NonconformityFormData = {
  ncNumber: "",
  occurrenceDate: new Date().toISOString().split("T")[0],
  process: "",
  productItem: "",
  ncType: "",
  ncDescription: "",
  defectQuantity: "",
  discoveredBy: "",
  why1: "",
  why2: "",
  why3: "",
  why4: "",
  why5: "",
  rootCauseConclusion: "",
  dispositionMethod: "",
  dispositionQuantity: "",
  dispositionDate: "",
  dispositionResponsible: "",
  correctiveActionContent: "",
  completionDate: "",
  validationMethod: "",
  validationResult: "",
  validationDate: "",
};

const sampleNCRecords: NCRecord[] = [
  {
    id: 1,
    ncNumber: "NC-2026-001",
    occurrenceDate: "2026-01-10",
    process: "도장",
    productItem: "부품A",
    ncType: "외관",
    defectQuantity: 25,
    dispositionMethod: "재작업",
    status: "closed",
  },
  {
    id: 2,
    ncNumber: "NC-2026-002",
    occurrenceDate: "2026-02-15",
    process: "가공",
    productItem: "부품B",
    ncType: "치수",
    defectQuantity: 10,
    dispositionMethod: "폐기",
    status: "closed",
  },
  {
    id: 3,
    ncNumber: "NC-2026-003",
    occurrenceDate: "2026-03-20",
    process: "조립",
    productItem: "부품C",
    ncType: "기능",
    defectQuantity: 5,
    dispositionMethod: "특채",
    status: "in-progress",
  },
  {
    id: 4,
    ncNumber: "NC-2026-004",
    occurrenceDate: "2026-04-05",
    process: "검사",
    productItem: "부품D",
    ncType: "외관",
    defectQuantity: 15,
    dispositionMethod: "반품",
    status: "open",
  },
  {
    id: 5,
    ncNumber: "NC-2026-005",
    occurrenceDate: "2026-05-12",
    process: "프레스",
    productItem: "부품E",
    ncType: "치수",
    defectQuantity: 30,
    dispositionMethod: "재작업",
    status: "in-progress",
  },
];

const ncTypeLabels: Record<string, string> = {
  appearance: "외관",
  dimension: "치수",
  function: "기능",
  other: "기타",
};

const dispositionMethodLabels: Record<string, string> = {
  scrap: "폐기",
  concession: "특채",
  rework: "재작업",
  return: "반품",
};

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  closed: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  open: "미처리",
  "in-progress": "처리중",
  closed: "완료",
};

export default function NonconformityPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [formData, setFormData] = useState<NonconformityFormData>(initialFormData);
  const [ncRecords] = useState<NCRecord[]>(sampleNCRecords);

  const updateField = <K extends keyof NonconformityFormData>(
    field: K,
    value: NonconformityFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateNCNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("ncNumber", `NC-${year}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving nonconformity data:", formData);
    alert("부적합품 데이터가 저장되었습니다.");
  };

  // Summary statistics for Tab 4
  const summaryStats = {
    totalNC: ncRecords.length,
    openNC: ncRecords.filter((r) => r.status === "open").length,
    inProgressNC: ncRecords.filter((r) => r.status === "in-progress").length,
    closedNC: ncRecords.filter((r) => r.status === "closed").length,
    byType: {
      appearance: ncRecords.filter((r) => r.ncType === "외관").length,
      dimension: ncRecords.filter((r) => r.ncType === "치수").length,
      function: ncRecords.filter((r) => r.ncType === "기능").length,
      other: ncRecords.filter((r) => r.ncType === "기타").length,
    },
    byDisposition: {
      scrap: ncRecords.filter((r) => r.dispositionMethod === "폐기").length,
      concession: ncRecords.filter((r) => r.dispositionMethod === "특채").length,
      rework: ncRecords.filter((r) => r.dispositionMethod === "재작업").length,
      return: ncRecords.filter((r) => r.dispositionMethod === "반품").length,
    },
    totalDefectQuantity: ncRecords.reduce((sum, r) => sum + r.defectQuantity, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">부적합품 관리</h1>
          <p className="text-muted-foreground">부적합품 발생, 원인분석, 처리 및 재발방지 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">부적합 발생 등록</TabsTrigger>
          <TabsTrigger value="analysis">원인 분석 및 처리</TabsTrigger>
          <TabsTrigger value="preventive">재발방지 대책</TabsTrigger>
          <TabsTrigger value="summary">부적합 현황</TabsTrigger>
        </TabsList>

        {/* Tab 1: NC Registration (부적합 발생 등록) */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                부적합 발생 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ncNumber">발생번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="ncNumber"
                      value={formData.ncNumber}
                      onChange={(e) => updateField("ncNumber", e.target.value)}
                      placeholder="NC-YYYY-XXX"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateNCNumber}
                      className="shrink-0"
                    >
                      자동생성
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occurrenceDate">발생일</Label>
                  <Input
                    id="occurrenceDate"
                    type="date"
                    value={formData.occurrenceDate}
                    onChange={(e) => updateField("occurrenceDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="process">발생공정</Label>
                  <Input
                    id="process"
                    value={formData.process}
                    onChange={(e) => updateField("process", e.target.value)}
                    placeholder="공정명 입력"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productItem">품목</Label>
                  <Input
                    id="productItem"
                    value={formData.productItem}
                    onChange={(e) => updateField("productItem", e.target.value)}
                    placeholder="품목명/품번"
                  />
                </div>
              </div>

              {/* NC Type and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>부적합 유형</Label>
                  <Select
                    value={formData.ncType}
                    onValueChange={(value) =>
                      updateField("ncType", value as NonconformityFormData["ncType"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appearance">외관</SelectItem>
                      <SelectItem value="dimension">치수</SelectItem>
                      <SelectItem value="function">기능</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defectQuantity">발생수량</Label>
                  <Input
                    id="defectQuantity"
                    type="number"
                    value={formData.defectQuantity}
                    onChange={(e) => updateField("defectQuantity", e.target.value)}
                    placeholder="수량 입력"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discoveredBy">발견자</Label>
                  <Input
                    id="discoveredBy"
                    value={formData.discoveredBy}
                    onChange={(e) => updateField("discoveredBy", e.target.value)}
                    placeholder="발견자 이름"
                  />
                </div>
              </div>

              {/* NC Description */}
              <div className="space-y-2">
                <Label htmlFor="ncDescription">부적합 내용 상세</Label>
                <Textarea
                  id="ncDescription"
                  value={formData.ncDescription}
                  onChange={(e) => updateField("ncDescription", e.target.value)}
                  placeholder="부적합 상황을 상세하게 기술하세요. (발생 상황, 불량 현상, 관련 정보 등)"
                  rows={5}
                />
              </div>

              {/* Summary Card */}
              {(formData.ncNumber || formData.ncDescription) && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">등록 정보 요약</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {formData.ncNumber && (
                        <div>
                          <span className="font-medium text-muted-foreground">발생번호:</span>
                          <p>{formData.ncNumber}</p>
                        </div>
                      )}
                      {formData.occurrenceDate && (
                        <div>
                          <span className="font-medium text-muted-foreground">발생일:</span>
                          <p>{formData.occurrenceDate}</p>
                        </div>
                      )}
                      {formData.ncType && (
                        <div>
                          <span className="font-medium text-muted-foreground">유형:</span>
                          <p>{ncTypeLabels[formData.ncType]}</p>
                        </div>
                      )}
                      {formData.defectQuantity && (
                        <div>
                          <span className="font-medium text-muted-foreground">발생수량:</span>
                          <p>{formData.defectQuantity}개</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis & Disposition (원인 분석 및 처리) */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* 5 Why Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-500" />
                  원인 분석 (5 Why)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  문제의 근본 원인을 찾기 위해 "왜?"를 반복하여 질문합니다.
                </p>

                <div className="space-y-4">
                  {[
                    { key: "why1", label: "Why 1: 왜 부적합이 발생했는가?" },
                    { key: "why2", label: "Why 2: 왜 그런 원인이 있었는가?" },
                    { key: "why3", label: "Why 3: 왜 그런 상황이 발생했는가?" },
                    { key: "why4", label: "Why 4: 왜 그런 조건이 존재했는가?" },
                    { key: "why5", label: "Why 5: 근본 원인은 무엇인가?" },
                  ].map(({ key, label }, index) => (
                    <div key={key} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={key}>{label}</Label>
                        <Textarea
                          id={key}
                          value={formData[key as keyof NonconformityFormData] as string}
                          onChange={(e) =>
                            updateField(key as keyof NonconformityFormData, e.target.value)
                          }
                          placeholder={`${index + 1}차 원인을 기술하세요`}
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Label htmlFor="rootCauseConclusion">근본 원인 결론</Label>
                  <Textarea
                    id="rootCauseConclusion"
                    value={formData.rootCauseConclusion}
                    onChange={(e) => updateField("rootCauseConclusion", e.target.value)}
                    placeholder="위 분석을 종합하여 도출된 근본원인을 명확하게 기술하세요"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Disposition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  처리 방법
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>처리 방법</Label>
                    <Select
                      value={formData.dispositionMethod}
                      onValueChange={(value) =>
                        updateField(
                          "dispositionMethod",
                          value as NonconformityFormData["dispositionMethod"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="처리방법 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scrap">폐기</SelectItem>
                        <SelectItem value="concession">특채</SelectItem>
                        <SelectItem value="rework">재작업</SelectItem>
                        <SelectItem value="return">반품</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispositionQuantity">처리 수량</Label>
                    <Input
                      id="dispositionQuantity"
                      type="number"
                      value={formData.dispositionQuantity}
                      onChange={(e) => updateField("dispositionQuantity", e.target.value)}
                      placeholder="수량 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispositionDate">처리일</Label>
                    <Input
                      id="dispositionDate"
                      type="date"
                      value={formData.dispositionDate}
                      onChange={(e) => updateField("dispositionDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispositionResponsible">처리자</Label>
                    <Input
                      id="dispositionResponsible"
                      value={formData.dispositionResponsible}
                      onChange={(e) => updateField("dispositionResponsible", e.target.value)}
                      placeholder="처리자 이름"
                    />
                  </div>
                </div>

                {/* Disposition Summary */}
                {formData.dispositionMethod && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">처리 정보:</span>
                        <span>
                          {dispositionMethodLabels[formData.dispositionMethod]} /{" "}
                          {formData.dispositionQuantity || "-"}개 /{" "}
                          {formData.dispositionDate || "-"} /{" "}
                          {formData.dispositionResponsible || "-"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Preventive Measures (재발방지 대책) */}
        <TabsContent value="preventive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                재발방지 대책
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Corrective Action Content */}
              <div className="space-y-2">
                <Label htmlFor="correctiveActionContent">시정조치 내용</Label>
                <Textarea
                  id="correctiveActionContent"
                  value={formData.correctiveActionContent}
                  onChange={(e) => updateField("correctiveActionContent", e.target.value)}
                  placeholder="재발방지를 위한 시정조치 내용을 상세하게 기술하세요.&#10;&#10;예시:&#10;- 작업표준서 개정&#10;- 작업자 재교육 실시&#10;- 검사 기준 강화&#10;- 설비 점검 주기 단축"
                  rows={6}
                />
              </div>

              {/* Completion Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completionDate">완료일</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => updateField("completionDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Validation Section */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">유효성 검증</h3>
                <p className="text-sm text-muted-foreground">
                  시정조치의 효과를 검증하여 재발 여부를 확인합니다.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="validationMethod">검증 방법</Label>
                  <Textarea
                    id="validationMethod"
                    value={formData.validationMethod}
                    onChange={(e) => updateField("validationMethod", e.target.value)}
                    placeholder="시정조치의 유효성을 검증할 방법을 기술하세요.&#10;&#10;예시: 1개월간 동일 불량 발생 여부 모니터링, 공정 능력 지수 재측정 등"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validationDate">검증일자</Label>
                    <Input
                      id="validationDate"
                      type="date"
                      value={formData.validationDate}
                      onChange={(e) => updateField("validationDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>검증 결과</Label>
                    <Select
                      value={formData.validationResult}
                      onValueChange={(value) =>
                        updateField(
                          "validationResult",
                          value as NonconformityFormData["validationResult"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="검증결과 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="effective">효과적</SelectItem>
                        <SelectItem value="ineffective">비효과적</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Validation Result Display */}
                {formData.validationResult && (
                  <Card
                    className={
                      formData.validationResult === "effective"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        {formData.validationResult === "effective" ? (
                          <>
                            <FileCheck className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">
                              유효성 검증 완료 - 시정조치가 효과적입니다.
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-800">
                              유효성 검증 완료 - 추가 조치가 필요합니다.
                            </span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: NC Summary (부적합 현황) */}
        <TabsContent value="summary">
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{summaryStats.totalNC}</p>
                    <p className="text-sm text-muted-foreground">총 부적합 건수</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{summaryStats.openNC}</p>
                    <p className="text-sm text-muted-foreground">미처리</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{summaryStats.inProgressNC}</p>
                    <p className="text-sm text-muted-foreground">처리중</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{summaryStats.closedNC}</p>
                    <p className="text-sm text-muted-foreground">완료</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Type and Disposition Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    유형별 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>외관</span>
                      <span className="font-medium">{summaryStats.byType.appearance}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>치수</span>
                      <span className="font-medium">{summaryStats.byType.dimension}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>기능</span>
                      <span className="font-medium">{summaryStats.byType.function}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>기타</span>
                      <span className="font-medium">{summaryStats.byType.other}건</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    처리방법별 현황
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>폐기</span>
                      <span className="font-medium">{summaryStats.byDisposition.scrap}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>특채</span>
                      <span className="font-medium">{summaryStats.byDisposition.concession}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>재작업</span>
                      <span className="font-medium">{summaryStats.byDisposition.rework}건</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>반품</span>
                      <span className="font-medium">{summaryStats.byDisposition.return}건</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Total Defect Quantity */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {summaryStats.totalDefectQuantity}
                  </p>
                  <p className="text-sm text-muted-foreground">총 부적합 수량</p>
                </div>
              </CardContent>
            </Card>

            {/* NC Records Table */}
            <Card>
              <CardHeader>
                <CardTitle>부적합 관리대장</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>발생번호</TableHead>
                      <TableHead>발생일</TableHead>
                      <TableHead>발생공정</TableHead>
                      <TableHead>품목</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                      <TableHead>처리방법</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ncRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.ncNumber}</TableCell>
                        <TableCell>
                          {new Date(record.occurrenceDate).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell>{record.process}</TableCell>
                        <TableCell>{record.productItem}</TableCell>
                        <TableCell>{record.ncType}</TableCell>
                        <TableCell className="text-right">{record.defectQuantity}</TableCell>
                        <TableCell>{record.dispositionMethod}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[record.status] || "bg-gray-100"
                            }`}
                          >
                            {statusLabels[record.status] || record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            상세보기
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
      </Tabs>
    </div>
  );
}
