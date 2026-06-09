"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, Plus, Save, Trash2, BarChart3, FileText, Search, Clock, AlertTriangle } from "lucide-react";

// Types
interface HeaderInfo {
  reportNumber: string;        // 보고번호
  occurrenceDateTime: string;  // 발생일시
  recoveryDateTime: string;    // 복구일시
  reporter: string;            // 보고자
}

interface StopInfo {
  lineProcess: string;         // 발생라인/공정
  stopType: string;            // 중단유형
  stopDuration: number;        // 중단시간(분)
  productionLoss: number;      // 생산손실수량
}

interface CauseAnalysis {
  detailedCause: string;       // 발생원인 상세
  rootCause: string;           // 근본원인
}

interface Countermeasure {
  emergencyAction: string;     // 긴급조치
  preventionMeasure: string;   // 재발방지대책
  responsible: string;         // 담당자
  completionDate: string;      // 완료일
}

interface ImpactAssessment {
  deliveryImpact: string;      // 납기영향
  customerNotified: boolean;   // 고객통보여부
}

interface LineStopRecord {
  id: number;
  header: HeaderInfo;
  stopInfo: StopInfo;
  causeAnalysis: CauseAnalysis;
  countermeasure: Countermeasure;
  impactAssessment: ImpactAssessment;
  status: "open" | "inProgress" | "closed";
  createdAt: string;
}

const STOP_TYPES = [
  { value: "equipment", label: "설비고장" },
  { value: "quality", label: "품질문제" },
  { value: "material", label: "자재부족" },
  { value: "other", label: "기타" },
];

const DELIVERY_IMPACT_OPTIONS = [
  { value: "none", label: "영향없음" },
  { value: "minor", label: "경미 (1일 이내)" },
  { value: "moderate", label: "보통 (1-3일)" },
  { value: "severe", label: "심각 (3일 이상)" },
];

export default function LineStopReportPage() {
  const [activeTab, setActiveTab] = useState("occurrence");

  // Form State
  const [header, setHeader] = useState<HeaderInfo>({
    reportNumber: "",
    occurrenceDateTime: "",
    recoveryDateTime: "",
    reporter: "",
  });

  const [stopInfo, setStopInfo] = useState<StopInfo>({
    lineProcess: "",
    stopType: "",
    stopDuration: 0,
    productionLoss: 0,
  });

  const [causeAnalysis, setCauseAnalysis] = useState<CauseAnalysis>({
    detailedCause: "",
    rootCause: "",
  });

  const [countermeasure, setCountermeasure] = useState<Countermeasure>({
    emergencyAction: "",
    preventionMeasure: "",
    responsible: "",
    completionDate: "",
  });

  const [impactAssessment, setImpactAssessment] = useState<ImpactAssessment>({
    deliveryImpact: "",
    customerNotified: false,
  });

  // History records
  const [records, setRecords] = useState<LineStopRecord[]>([
    {
      id: 1,
      header: {
        reportNumber: "LSR-2026-001",
        occurrenceDateTime: "2026-06-01T09:30",
        recoveryDateTime: "2026-06-01T11:45",
        reporter: "김철수",
      },
      stopInfo: {
        lineProcess: "A라인 - 용접공정",
        stopType: "equipment",
        stopDuration: 135,
        productionLoss: 450,
      },
      causeAnalysis: {
        detailedCause: "용접기 전극 마모로 인한 용접 불량 발생",
        rootCause: "정기 교체 주기 미준수",
      },
      countermeasure: {
        emergencyAction: "전극 즉시 교체 및 재가동",
        preventionMeasure: "전극 교체 주기 관리 시스템 도입",
        responsible: "이영희",
        completionDate: "2026-06-15",
      },
      impactAssessment: {
        deliveryImpact: "minor",
        customerNotified: false,
      },
      status: "closed",
      createdAt: "2026-06-01",
    },
    {
      id: 2,
      header: {
        reportNumber: "LSR-2026-002",
        occurrenceDateTime: "2026-06-05T14:00",
        recoveryDateTime: "2026-06-05T16:30",
        reporter: "박민수",
      },
      stopInfo: {
        lineProcess: "B라인 - 조립공정",
        stopType: "material",
        stopDuration: 150,
        productionLoss: 300,
      },
      causeAnalysis: {
        detailedCause: "부품 공급업체 납품 지연",
        rootCause: "공급업체 생산 계획 변경 미통보",
      },
      countermeasure: {
        emergencyAction: "긴급 대체 부품 수급",
        preventionMeasure: "공급업체 모니터링 강화 및 안전재고 확보",
        responsible: "최정훈",
        completionDate: "2026-06-20",
      },
      impactAssessment: {
        deliveryImpact: "moderate",
        customerNotified: true,
      },
      status: "inProgress",
      createdAt: "2026-06-05",
    },
    {
      id: 3,
      header: {
        reportNumber: "LSR-2026-003",
        occurrenceDateTime: "2026-06-08T10:15",
        recoveryDateTime: "",
        reporter: "정수진",
      },
      stopInfo: {
        lineProcess: "C라인 - 도장공정",
        stopType: "quality",
        stopDuration: 0,
        productionLoss: 0,
      },
      causeAnalysis: {
        detailedCause: "도료 점도 이상으로 도장 불량 발생",
        rootCause: "",
      },
      countermeasure: {
        emergencyAction: "도료 점도 측정 및 조정 중",
        preventionMeasure: "",
        responsible: "",
        completionDate: "",
      },
      impactAssessment: {
        deliveryImpact: "",
        customerNotified: false,
      },
      status: "open",
      createdAt: "2026-06-08",
    },
  ]);

  // Generate report number
  const generateReportNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = records.length + 1;
    return `LSR-${year}-${String(nextNumber).padStart(3, "0")}`;
  };

  // Calculate stop duration from datetime
  const calculateStopDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60)));
  };

  // Handle header datetime change
  const handleDateTimeChange = (field: "occurrenceDateTime" | "recoveryDateTime", value: string) => {
    const newHeader = { ...header, [field]: value };
    setHeader(newHeader);

    if (field === "recoveryDateTime" && newHeader.occurrenceDateTime) {
      const duration = calculateStopDuration(newHeader.occurrenceDateTime, value);
      setStopInfo({ ...stopInfo, stopDuration: duration });
    }
  };

  // Save new record
  const handleSave = () => {
    const newRecord: LineStopRecord = {
      id: Date.now(),
      header: { ...header, reportNumber: header.reportNumber || generateReportNumber() },
      stopInfo,
      causeAnalysis,
      countermeasure,
      impactAssessment,
      status: countermeasure.completionDate ? "inProgress" : "open",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setRecords([newRecord, ...records]);
    resetForm();
    alert("라인중단보고서가 저장되었습니다.");
  };

  // Reset form
  const resetForm = () => {
    setHeader({ reportNumber: "", occurrenceDateTime: "", recoveryDateTime: "", reporter: "" });
    setStopInfo({ lineProcess: "", stopType: "", stopDuration: 0, productionLoss: 0 });
    setCauseAnalysis({ detailedCause: "", rootCause: "" });
    setCountermeasure({ emergencyAction: "", preventionMeasure: "", responsible: "", completionDate: "" });
    setImpactAssessment({ deliveryImpact: "", customerNotified: false });
  };

  // Delete record
  const deleteRecord = (id: number) => {
    if (confirm("이 보고서를 삭제하시겠습니까?")) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="error">진행중</Badge>;
      case "inProgress":
        return <Badge variant="warning">조치중</Badge>;
      case "closed":
        return <Badge variant="success">완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get stop type label
  const getStopTypeLabel = (type: string) => {
    return STOP_TYPES.find((t) => t.value === type)?.label || type;
  };

  // Get delivery impact label
  const getDeliveryImpactLabel = (impact: string) => {
    return DELIVERY_IMPACT_OPTIONS.find((o) => o.value === impact)?.label || impact;
  };

  // Statistics
  const getStatistics = () => {
    const total = records.length;
    const openCount = records.filter((r) => r.status === "open").length;
    const inProgressCount = records.filter((r) => r.status === "inProgress").length;
    const closedCount = records.filter((r) => r.status === "closed").length;

    const totalDuration = records.reduce((sum, r) => sum + r.stopInfo.stopDuration, 0);
    const totalLoss = records.reduce((sum, r) => sum + r.stopInfo.productionLoss, 0);

    const byType = STOP_TYPES.map((type) => ({
      type: type.label,
      count: records.filter((r) => r.stopInfo.stopType === type.value).length,
    }));

    const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;

    return {
      total,
      openCount,
      inProgressCount,
      closedCount,
      totalDuration,
      totalLoss,
      avgDuration,
      byType,
    };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertOctagon className="h-8 w-8" />
            라인중단보고서
          </h1>
          <p className="text-muted-foreground">Line Stop Report - 라인 중단 발생 보고 및 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="occurrence">
            <AlertOctagon className="mr-2 h-4 w-4" />
            1. 중단 발생 등록
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Search className="mr-2 h-4 w-4" />
            2. 원인 분석 및 대책
          </TabsTrigger>
          <TabsTrigger value="impact">
            <AlertTriangle className="mr-2 h-4 w-4" />
            3. 영향 평가
          </TabsTrigger>
          <TabsTrigger value="history">
            <BarChart3 className="mr-2 h-4 w-4" />
            4. 중단 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 중단 발생 등록 (Occurrence Registration) */}
        <TabsContent value="occurrence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>보고서 기본정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>보고번호</Label>
                  <Input
                    value={header.reportNumber}
                    onChange={(e) => setHeader({ ...header, reportNumber: e.target.value })}
                    placeholder={generateReportNumber()}
                  />
                </div>
                <div className="space-y-2">
                  <Label>발생일시 *</Label>
                  <Input
                    type="datetime-local"
                    value={header.occurrenceDateTime}
                    onChange={(e) => handleDateTimeChange("occurrenceDateTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>복구일시</Label>
                  <Input
                    type="datetime-local"
                    value={header.recoveryDateTime}
                    onChange={(e) => handleDateTimeChange("recoveryDateTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>보고자 *</Label>
                  <Input
                    value={header.reporter}
                    onChange={(e) => setHeader({ ...header, reporter: e.target.value })}
                    placeholder="보고자명"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>중단정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>발생라인/공정 *</Label>
                  <Input
                    value={stopInfo.lineProcess}
                    onChange={(e) => setStopInfo({ ...stopInfo, lineProcess: e.target.value })}
                    placeholder="예: A라인 - 용접공정"
                  />
                </div>
                <div className="space-y-2">
                  <Label>중단유형 *</Label>
                  <Select
                    value={stopInfo.stopType}
                    onValueChange={(v) => setStopInfo({ ...stopInfo, stopType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="중단유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {STOP_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>중단시간 (분)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={stopInfo.stopDuration}
                      onChange={(e) => setStopInfo({ ...stopInfo, stopDuration: Number(e.target.value) })}
                      placeholder="0"
                      min={0}
                    />
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    {stopInfo.stopDuration > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({Math.floor(stopInfo.stopDuration / 60)}시간 {stopInfo.stopDuration % 60}분)
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>생산손실수량</Label>
                  <Input
                    type="number"
                    value={stopInfo.productionLoss}
                    onChange={(e) => setStopInfo({ ...stopInfo, productionLoss: Number(e.target.value) })}
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>중단유형 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">설비고장</h4>
                  <p className="text-xs text-muted-foreground">
                    기계, 설비의 고장이나 오작동으로 인한 라인 중단
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">품질문제</h4>
                  <p className="text-xs text-muted-foreground">
                    품질 불량 발생으로 인한 라인 중단 또는 재작업
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">자재부족</h4>
                  <p className="text-xs text-muted-foreground">
                    원자재, 부품 공급 부족으로 인한 라인 중단
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">기타</h4>
                  <p className="text-xs text-muted-foreground">
                    인력, 환경, 기타 사유로 인한 라인 중단
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 원인 분석 및 대책 (Cause Analysis and Countermeasures) */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>원인분석</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>발생원인 상세 *</Label>
                <Textarea
                  value={causeAnalysis.detailedCause}
                  onChange={(e) => setCauseAnalysis({ ...causeAnalysis, detailedCause: e.target.value })}
                  placeholder="중단 발생의 직접적인 원인을 상세하게 기술하세요"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>근본원인 (Root Cause)</Label>
                <Textarea
                  value={causeAnalysis.rootCause}
                  onChange={(e) => setCauseAnalysis({ ...causeAnalysis, rootCause: e.target.value })}
                  placeholder="5Why 분석 등을 통한 근본원인을 기술하세요"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>조치내용</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>긴급조치 *</Label>
                <Textarea
                  value={countermeasure.emergencyAction}
                  onChange={(e) => setCountermeasure({ ...countermeasure, emergencyAction: e.target.value })}
                  placeholder="라인 복구를 위해 즉시 시행한 조치사항"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>재발방지대책</Label>
                <Textarea
                  value={countermeasure.preventionMeasure}
                  onChange={(e) => setCountermeasure({ ...countermeasure, preventionMeasure: e.target.value })}
                  placeholder="동일한 문제 재발 방지를 위한 대책"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>담당자</Label>
                  <Input
                    value={countermeasure.responsible}
                    onChange={(e) => setCountermeasure({ ...countermeasure, responsible: e.target.value })}
                    placeholder="재발방지대책 담당자"
                  />
                </div>
                <div className="space-y-2">
                  <Label>완료예정일</Label>
                  <Input
                    type="date"
                    value={countermeasure.completionDate}
                    onChange={(e) => setCountermeasure({ ...countermeasure, completionDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5Why 분석 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  5Why 분석은 근본원인을 찾기 위해 왜?(Why?)를 반복적으로 질문하는 기법입니다.
                </p>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p><strong>예시:</strong> 용접 불량 발생</p>
                  <p className="pl-4">1. 왜? - 용접 전극이 마모됨</p>
                  <p className="pl-4">2. 왜? - 전극 교체 시기를 놓침</p>
                  <p className="pl-4">3. 왜? - 교체 주기 관리가 안됨</p>
                  <p className="pl-4">4. 왜? - 점검 체크리스트에 항목 누락</p>
                  <p className="pl-4">5. 왜? - 체크리스트 검토 프로세스 부재</p>
                  <p className="mt-2 font-semibold">근본원인: 점검 체크리스트 관리 프로세스 미비</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 영향 평가 (Impact Assessment) */}
        <TabsContent value="impact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>영향평가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>납기영향</Label>
                  <Select
                    value={impactAssessment.deliveryImpact}
                    onValueChange={(v) => setImpactAssessment({ ...impactAssessment, deliveryImpact: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="납기영향 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_IMPACT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>고객통보여부</Label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="customerNotified"
                        checked={impactAssessment.customerNotified === true}
                        onChange={() => setImpactAssessment({ ...impactAssessment, customerNotified: true })}
                        className="w-4 h-4"
                      />
                      <span>통보완료</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="customerNotified"
                        checked={impactAssessment.customerNotified === false}
                        onChange={() => setImpactAssessment({ ...impactAssessment, customerNotified: false })}
                        className="w-4 h-4"
                      />
                      <span>미통보</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>현재 등록 중인 보고서 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">보고번호</p>
                  <p className="font-semibold">{header.reportNumber || generateReportNumber()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">발생라인/공정</p>
                  <p className="font-semibold">{stopInfo.lineProcess || "-"}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">중단유형</p>
                  <p className="font-semibold">{getStopTypeLabel(stopInfo.stopType) || "-"}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">중단시간</p>
                  <p className="font-semibold">
                    {stopInfo.stopDuration > 0
                      ? `${Math.floor(stopInfo.stopDuration / 60)}시간 ${stopInfo.stopDuration % 60}분`
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">입력 진행 상태</h4>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="flex items-center gap-2">
                    {header.occurrenceDateTime && stopInfo.lineProcess && stopInfo.stopType ? (
                      <Badge variant="success">완료</Badge>
                    ) : (
                      <Badge variant="outline">미완료</Badge>
                    )}
                    <span>중단정보</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {causeAnalysis.detailedCause && countermeasure.emergencyAction ? (
                      <Badge variant="success">완료</Badge>
                    ) : (
                      <Badge variant="outline">미완료</Badge>
                    )}
                    <span>원인분석/대책</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {impactAssessment.deliveryImpact ? (
                      <Badge variant="success">완료</Badge>
                    ) : (
                      <Badge variant="outline">미완료</Badge>
                    )}
                    <span>영향평가</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>납기영향 기준 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 border rounded-lg border-green-500">
                  <Badge variant="success" className="mb-2">영향없음</Badge>
                  <p className="text-xs text-muted-foreground">
                    안전재고 또는 대체 생산으로 납기 준수 가능
                  </p>
                </div>
                <div className="p-4 border rounded-lg border-yellow-500">
                  <Badge variant="warning" className="mb-2">경미</Badge>
                  <p className="text-xs text-muted-foreground">
                    1일 이내 지연 예상, 긴급 복구로 해소 가능
                  </p>
                </div>
                <div className="p-4 border rounded-lg border-orange-500">
                  <Badge variant="warning" className="mb-2">보통</Badge>
                  <p className="text-xs text-muted-foreground">
                    1-3일 지연 예상, 고객 협의 필요
                  </p>
                </div>
                <div className="p-4 border rounded-lg border-red-500">
                  <Badge variant="error" className="mb-2">심각</Badge>
                  <p className="text-xs text-muted-foreground">
                    3일 이상 지연 예상, 긴급 대응 및 고객 통보 필수
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 중단 이력 (History with Statistics) */}
        <TabsContent value="history" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 발생건수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}건</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 중단시간</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(stats.totalDuration / 60)}시간 {stats.totalDuration % 60}분
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 생산손실</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalLoss.toLocaleString()}개</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">평균 중단시간</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.avgDuration}분</div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>처리 상태 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="error">진행중</Badge>
                      <span className="text-sm text-muted-foreground">(미복구)</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.openCount}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-red-500 h-4 rounded-full"
                      style={{
                        width: stats.total > 0 ? `${(stats.openCount / stats.total) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">조치중</Badge>
                      <span className="text-sm text-muted-foreground">(대책 진행)</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.inProgressCount}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-yellow-500 h-4 rounded-full"
                      style={{
                        width: stats.total > 0 ? `${(stats.inProgressCount / stats.total) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">완료</Badge>
                      <span className="text-sm text-muted-foreground">(대책 완료)</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.closedCount}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width: stats.total > 0 ? `${(stats.closedCount / stats.total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>중단유형별 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.byType.map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-lg font-bold">{item.count}건</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{
                            width: stats.total > 0 ? `${(item.count / stats.total) * 100}%` : "0%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>중단 이력 목록</CardTitle>
              <Button variant="outline" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                신규 등록
              </Button>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertOctagon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 라인중단 보고서가 없습니다.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>보고번호</TableHead>
                        <TableHead>발생일시</TableHead>
                        <TableHead>라인/공정</TableHead>
                        <TableHead>중단유형</TableHead>
                        <TableHead className="text-right">중단시간</TableHead>
                        <TableHead className="text-right">손실수량</TableHead>
                        <TableHead>납기영향</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="text-center">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.header.reportNumber}</TableCell>
                          <TableCell>
                            {record.header.occurrenceDateTime
                              ? new Date(record.header.occurrenceDateTime).toLocaleString("ko-KR")
                              : "-"}
                          </TableCell>
                          <TableCell>{record.stopInfo.lineProcess}</TableCell>
                          <TableCell>{getStopTypeLabel(record.stopInfo.stopType)}</TableCell>
                          <TableCell className="text-right">
                            {record.stopInfo.stopDuration > 0
                              ? `${Math.floor(record.stopInfo.stopDuration / 60)}h ${record.stopInfo.stopDuration % 60}m`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {record.stopInfo.productionLoss > 0
                              ? record.stopInfo.productionLoss.toLocaleString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {record.impactAssessment.deliveryImpact
                              ? getDeliveryImpactLabel(record.impactAssessment.deliveryImpact)
                              : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecord(record.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
