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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ClipboardList, RotateCcw, Search, Save, History } from "lucide-react";

// Types
interface RecallFormData {
  // Registration
  recallNumber: string;
  occurrenceDate: string;
  customerRequest: "yes" | "no" | "";
  regulatoryRequest: "yes" | "no" | "";
  productNumber: string;
  productName: string;
  lotRangeStart: string;
  lotRangeEnd: string;
  recallReason: string;
  affectedQuantity: string;
  severity: "critical" | "major" | "minor" | "";

  // Execution
  recoveryPlan: string;
  shippedQuantity: string;
  recoveredQuantity: string;
  processingMethod: "exchange" | "repair" | "disposal" | "refund" | "";
  progressStatus: "registered" | "in-progress" | "completed" | "closed" | "";

  // Analysis & Countermeasure
  rootCauseAnalysis: string;
  preventiveMeasures: string;
  similarProductReview: string;
}

interface RecallHistoryItem {
  recallNumber: string;
  occurrenceDate: string;
  productName: string;
  severity: string;
  affectedQuantity: number;
  recoveryRate: number;
  status: string;
}

const initialFormData: RecallFormData = {
  recallNumber: "",
  occurrenceDate: new Date().toISOString().split("T")[0],
  customerRequest: "",
  regulatoryRequest: "",
  productNumber: "",
  productName: "",
  lotRangeStart: "",
  lotRangeEnd: "",
  recallReason: "",
  affectedQuantity: "",
  severity: "",
  recoveryPlan: "",
  shippedQuantity: "",
  recoveredQuantity: "",
  processingMethod: "",
  progressStatus: "registered",
  rootCauseAnalysis: "",
  preventiveMeasures: "",
  similarProductReview: "",
};

const sampleHistory: RecallHistoryItem[] = [
  {
    recallNumber: "RCL-202601-001",
    occurrenceDate: "2026-01-15",
    productName: "브레이크 패드 A-100",
    severity: "critical",
    affectedQuantity: 5000,
    recoveryRate: 98.5,
    status: "closed",
  },
  {
    recallNumber: "RCL-202512-003",
    occurrenceDate: "2025-12-20",
    productName: "엔진 마운트 B-200",
    severity: "major",
    affectedQuantity: 2500,
    recoveryRate: 95.2,
    status: "closed",
  },
  {
    recallNumber: "RCL-202511-002",
    occurrenceDate: "2025-11-10",
    productName: "연료필터 C-300",
    severity: "minor",
    affectedQuantity: 1200,
    recoveryRate: 100,
    status: "closed",
  },
];

const severityLabels: Record<string, string> = {
  critical: "심각",
  major: "중대",
  minor: "경미",
};

const statusLabels: Record<string, string> = {
  registered: "등록",
  "in-progress": "진행중",
  completed: "완료",
  closed: "종료",
};

const processingMethodLabels: Record<string, string> = {
  exchange: "교환",
  repair: "수리",
  disposal: "폐기",
  refund: "환불",
};

function getSeverityBadgeVariant(severity: string): "default" | "destructive" | "secondary" | "outline" {
  switch (severity) {
    case "critical":
      return "destructive";
    case "major":
      return "default";
    case "minor":
      return "secondary";
    default:
      return "outline";
  }
}

function getStatusBadgeVariant(status: string): "default" | "destructive" | "secondary" | "outline" {
  switch (status) {
    case "closed":
      return "secondary";
    case "completed":
      return "default";
    case "in-progress":
      return "outline";
    default:
      return "outline";
  }
}

export default function RecallPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [formData, setFormData] = useState<RecallFormData>(initialFormData);
  const [historyFilter, setHistoryFilter] = useState("");

  const updateField = <K extends keyof RecallFormData>(
    field: K,
    value: RecallFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateRecallNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("recallNumber", `RCL-${year}${month}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving recall data:", formData);
    alert("리콜 데이터가 저장되었습니다.");
  };

  const calculateRecoveryRate = (): string => {
    const shipped = parseFloat(formData.shippedQuantity) || 0;
    const recovered = parseFloat(formData.recoveredQuantity) || 0;
    if (shipped === 0) return "0.0";
    return ((recovered / shipped) * 100).toFixed(1);
  };

  const filteredHistory = sampleHistory.filter(
    (item) =>
      item.recallNumber.toLowerCase().includes(historyFilter.toLowerCase()) ||
      item.productName.toLowerCase().includes(historyFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">리콜 관리</h1>
          <p className="text-muted-foreground">IATF 16949 기반 제품 리콜 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">리콜 등록</TabsTrigger>
          <TabsTrigger value="execution">리콜 실행</TabsTrigger>
          <TabsTrigger value="analysis">원인 분석 및 대책</TabsTrigger>
          <TabsTrigger value="history">리콜 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Recall Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                리콜 등록 (Recall Registration)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recallNumber">리콜번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="recallNumber"
                      value={formData.recallNumber}
                      onChange={(e) => updateField("recallNumber", e.target.value)}
                      placeholder="RCL-YYYYMM-XXX"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateRecallNumber}
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
                  <Label>심각도</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      updateField("severity", value as RecallFormData["severity"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="심각도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">심각 (Critical)</SelectItem>
                      <SelectItem value="major">중대 (Major)</SelectItem>
                      <SelectItem value="minor">경미 (Minor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Request Source */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">요청 출처</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>고객 요청 여부</Label>
                    <Select
                      value={formData.customerRequest}
                      onValueChange={(value) =>
                        updateField("customerRequest", value as RecallFormData["customerRequest"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">예</SelectItem>
                        <SelectItem value="no">아니오</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>규제기관 요청 여부</Label>
                    <Select
                      value={formData.regulatoryRequest}
                      onValueChange={(value) =>
                        updateField("regulatoryRequest", value as RecallFormData["regulatoryRequest"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">예</SelectItem>
                        <SelectItem value="no">아니오</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Target Product */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">대상 제품</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productNumber">품번</Label>
                    <Input
                      id="productNumber"
                      value={formData.productNumber}
                      onChange={(e) => updateField("productNumber", e.target.value)}
                      placeholder="제품 품번 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">품명</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => updateField("productName", e.target.value)}
                      placeholder="제품명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lotRangeStart">Lot 범위 (시작)</Label>
                    <Input
                      id="lotRangeStart"
                      value={formData.lotRangeStart}
                      onChange={(e) => updateField("lotRangeStart", e.target.value)}
                      placeholder="시작 Lot 번호"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lotRangeEnd">Lot 범위 (종료)</Label>
                    <Input
                      id="lotRangeEnd"
                      value={formData.lotRangeEnd}
                      onChange={(e) => updateField("lotRangeEnd", e.target.value)}
                      placeholder="종료 Lot 번호"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="affectedQuantity">영향 수량</Label>
                  <Input
                    id="affectedQuantity"
                    type="number"
                    value={formData.affectedQuantity}
                    onChange={(e) => updateField("affectedQuantity", e.target.value)}
                    placeholder="영향받는 제품 수량"
                  />
                </div>
              </div>

              {/* Recall Reason */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">리콜 사유</h3>
                <div className="space-y-2">
                  <Label htmlFor="recallReason">리콜 사유 상세</Label>
                  <Textarea
                    id="recallReason"
                    value={formData.recallReason}
                    onChange={(e) => updateField("recallReason", e.target.value)}
                    placeholder="리콜이 필요한 사유를 상세히 기술하세요. (불량 내용, 안전 문제, 규격 미달 등)"
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Recall Execution */}
        <TabsContent value="execution">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                리콜 실행 (Recall Execution)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recovery Plan */}
              <div className="space-y-2">
                <Label htmlFor="recoveryPlan">회수 계획</Label>
                <Textarea
                  id="recoveryPlan"
                  value={formData.recoveryPlan}
                  onChange={(e) => updateField("recoveryPlan", e.target.value)}
                  placeholder="회수 일정, 방법, 담당자, 고객 통보 계획 등을 상세히 기술하세요."
                  rows={5}
                />
              </div>

              {/* Recovery Status */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">회수 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippedQuantity">출하수량</Label>
                    <Input
                      id="shippedQuantity"
                      type="number"
                      value={formData.shippedQuantity}
                      onChange={(e) => updateField("shippedQuantity", e.target.value)}
                      placeholder="출하된 총 수량"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recoveredQuantity">회수수량</Label>
                    <Input
                      id="recoveredQuantity"
                      type="number"
                      value={formData.recoveredQuantity}
                      onChange={(e) => updateField("recoveredQuantity", e.target.value)}
                      placeholder="회수된 수량"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>회수율</Label>
                    <div className="flex items-center h-10 px-3 rounded-md border bg-muted">
                      <span className="text-lg font-semibold">
                        {calculateRecoveryRate()}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recovery Rate Progress Bar */}
                {(formData.shippedQuantity || formData.recoveredQuantity) && (
                  <div className="mt-4">
                    <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(parseFloat(calculateRecoveryRate()), 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.recoveredQuantity || 0} / {formData.shippedQuantity || 0} 개 회수 완료
                    </p>
                  </div>
                )}
              </div>

              {/* Processing Method */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">처리 방법</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>처리 방법</Label>
                    <Select
                      value={formData.processingMethod}
                      onValueChange={(value) =>
                        updateField("processingMethod", value as RecallFormData["processingMethod"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="처리 방법 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exchange">교환</SelectItem>
                        <SelectItem value="repair">수리</SelectItem>
                        <SelectItem value="disposal">폐기</SelectItem>
                        <SelectItem value="refund">환불</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>진행 상태</Label>
                    <Select
                      value={formData.progressStatus}
                      onValueChange={(value) =>
                        updateField("progressStatus", value as RecallFormData["progressStatus"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="진행 상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registered">등록</SelectItem>
                        <SelectItem value="in-progress">진행중</SelectItem>
                        <SelectItem value="completed">완료</SelectItem>
                        <SelectItem value="closed">종료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Status Summary */}
              {formData.processingMethod && (
                <div className="border-t pt-6">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">리콜 실행 요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">처리 방법</p>
                          <p className="font-medium">
                            {processingMethodLabels[formData.processingMethod] || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">진행 상태</p>
                          <p className="font-medium">
                            {statusLabels[formData.progressStatus] || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">회수율</p>
                          <p className="font-medium">{calculateRecoveryRate()}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">잔여 수량</p>
                          <p className="font-medium">
                            {Math.max(
                              0,
                              (parseFloat(formData.shippedQuantity) || 0) -
                                (parseFloat(formData.recoveredQuantity) || 0)
                            ).toLocaleString()}{" "}
                            개
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Analysis & Countermeasure */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                원인 분석 및 대책 (Analysis & Countermeasure)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Root Cause Analysis */}
              <div className="space-y-2">
                <Label htmlFor="rootCauseAnalysis">근본원인 분석</Label>
                <Textarea
                  id="rootCauseAnalysis"
                  value={formData.rootCauseAnalysis}
                  onChange={(e) => updateField("rootCauseAnalysis", e.target.value)}
                  placeholder="리콜 발생의 근본 원인을 분석하세요.&#10;&#10;분석 방법:&#10;- 5Why 분석&#10;- 특성요인도 (Fishbone)&#10;- FMEA 검토&#10;- 공정 이력 분석"
                  rows={8}
                />
              </div>

              {/* Preventive Measures */}
              <div className="border-t pt-6 space-y-2">
                <Label htmlFor="preventiveMeasures">재발방지 대책</Label>
                <Textarea
                  id="preventiveMeasures"
                  value={formData.preventiveMeasures}
                  onChange={(e) => updateField("preventiveMeasures", e.target.value)}
                  placeholder="동일 문제의 재발을 방지하기 위한 대책을 기술하세요.&#10;&#10;예시:&#10;- 공정 개선 사항&#10;- 검사 강화 계획&#10;- 설비/금형 수정&#10;- 작업 표준 개정&#10;- 교육 계획"
                  rows={8}
                />
              </div>

              {/* Similar Product Review */}
              <div className="border-t pt-6 space-y-2">
                <Label htmlFor="similarProductReview">유사제품 영향 검토</Label>
                <Textarea
                  id="similarProductReview"
                  value={formData.similarProductReview}
                  onChange={(e) => updateField("similarProductReview", e.target.value)}
                  placeholder="동일/유사 공정으로 생산되는 다른 제품에 대한 영향을 검토하세요.&#10;&#10;검토 항목:&#10;- 동일 라인 생산 제품&#10;- 동일 원자재 사용 제품&#10;- 유사 설계 제품&#10;- 수평전개 대상 및 조치 계획"
                  rows={8}
                />
              </div>

              {/* Analysis Summary */}
              {(formData.rootCauseAnalysis || formData.preventiveMeasures) && (
                <div className="border-t pt-6">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        분석 및 대책 요약
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        {formData.rootCauseAnalysis && (
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">근본원인:</p>
                            <p className="whitespace-pre-wrap">{formData.rootCauseAnalysis.slice(0, 200)}...</p>
                          </div>
                        )}
                        {formData.preventiveMeasures && (
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">재발방지 대책:</p>
                            <p className="whitespace-pre-wrap">{formData.preventiveMeasures.slice(0, 200)}...</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Recall History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                리콜 이력 (Recall History)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="리콜번호 또는 제품명으로 검색..."
                    value={historyFilter}
                    onChange={(e) => setHistoryFilter(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  검색
                </Button>
              </div>

              {/* History Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>리콜번호</TableHead>
                      <TableHead>발생일</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>심각도</TableHead>
                      <TableHead className="text-right">영향수량</TableHead>
                      <TableHead className="text-right">회수율</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((item) => (
                        <TableRow key={item.recallNumber}>
                          <TableCell className="font-medium">{item.recallNumber}</TableCell>
                          <TableCell>{item.occurrenceDate}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>
                            <Badge variant={getSeverityBadgeVariant(item.severity)}>
                              {severityLabels[item.severity] || item.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.affectedQuantity.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">{item.recoveryRate}%</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {statusLabels[item.status] || item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{sampleHistory.length}</div>
                    <p className="text-sm text-muted-foreground">총 리콜 건수</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {sampleHistory.filter((h) => h.severity === "critical").length}
                    </div>
                    <p className="text-sm text-muted-foreground">심각 등급</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {(
                        sampleHistory.reduce((sum, h) => sum + h.recoveryRate, 0) /
                        sampleHistory.length
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">평균 회수율</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {sampleHistory
                        .reduce((sum, h) => sum + h.affectedQuantity, 0)
                        .toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">총 영향 수량</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
