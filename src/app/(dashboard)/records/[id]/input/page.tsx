"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ArrowLeft, Save, Upload, History, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ControlItem {
  id: number;
  itemNo: number;
  name: string;
  frequency: string;
  notes: string;
  process?: { name: string };
  responsibleDept?: { name: string };
  targetDept?: { name: string };
}

interface InspectionRecord {
  id: number;
  inspectionDate: string;
  shift: string;
  result: string;
  findings: string;
  createdAt: string;
}

const formTemplates: Record<string, { fields: { name: string; label: string; type: string; options?: string[]; required?: boolean }[] }> = {
  default: {
    fields: [
      { name: "recordDate", label: "기록일자", type: "date", required: true },
      { name: "shift", label: "조/교대", type: "select", options: ["A조 (주간)", "B조 (야간)", "C조", "상시"] },
      { name: "result", label: "결과", type: "select", options: ["합격", "불합격", "조건부", "완료", "진행중"], required: true },
      { name: "findings", label: "점검내용/발견사항", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  inspection: {
    fields: [
      { name: "recordDate", label: "검사일자", type: "date", required: true },
      { name: "shift", label: "조/교대", type: "select", options: ["A조", "B조", "C조"] },
      { name: "lotNo", label: "LOT No.", type: "text" },
      { name: "sampleQty", label: "샘플수량", type: "number" },
      { name: "okQty", label: "합격수량", type: "number" },
      { name: "ngQty", label: "불합격수량", type: "number" },
      { name: "result", label: "판정", type: "select", options: ["합격", "불합격", "조건부"], required: true },
      { name: "defectType", label: "불량유형", type: "text" },
      { name: "findings", label: "검사내용", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  measurement: {
    fields: [
      { name: "recordDate", label: "측정일자", type: "date", required: true },
      { name: "shift", label: "조/교대", type: "select", options: ["A조", "B조", "C조"] },
      { name: "targetPart", label: "대상 부품/차종", type: "text" },
      { name: "measuredValue", label: "측정값", type: "text", required: true },
      { name: "standardValue", label: "기준값", type: "text" },
      { name: "tolerance", label: "공차", type: "text" },
      { name: "result", label: "판정", type: "select", options: ["합격", "불합격"], required: true },
      { name: "instrumentUsed", label: "사용 계측기", type: "text" },
      { name: "findings", label: "측정내용", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  equipment: {
    fields: [
      { name: "recordDate", label: "점검일자", type: "date", required: true },
      { name: "shift", label: "조/교대", type: "select", options: ["A조", "B조", "C조"] },
      { name: "equipmentNo", label: "설비번호", type: "text" },
      { name: "equipmentName", label: "설비명", type: "text" },
      { name: "checkItems", label: "점검항목", type: "textarea" },
      { name: "result", label: "판정", type: "select", options: ["정상", "이상", "조치필요"], required: true },
      { name: "actionTaken", label: "조치사항", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  training: {
    fields: [
      { name: "recordDate", label: "교육일자", type: "date", required: true },
      { name: "trainingName", label: "교육명", type: "text", required: true },
      { name: "instructor", label: "강사", type: "text" },
      { name: "duration", label: "교육시간", type: "text" },
      { name: "attendees", label: "참석인원", type: "number" },
      { name: "content", label: "교육내용", type: "textarea" },
      { name: "result", label: "결과", type: "select", options: ["완료", "진행중", "취소"], required: true },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  audit: {
    fields: [
      { name: "recordDate", label: "심사일자", type: "date", required: true },
      { name: "auditType", label: "심사유형", type: "select", options: ["시스템심사", "프로세스심사", "제품심사"] },
      { name: "auditArea", label: "심사영역/부서", type: "text" },
      { name: "auditor", label: "심사원", type: "text" },
      { name: "findings", label: "발견사항", type: "textarea" },
      { name: "ncCount", label: "부적합건수", type: "number" },
      { name: "obsCount", label: "관찰사항건수", type: "number" },
      { name: "result", label: "결과", type: "select", options: ["적합", "부적합", "조건부적합"], required: true },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  kpi: {
    fields: [
      { name: "recordDate", label: "기준일자", type: "date", required: true },
      { name: "period", label: "기간", type: "select", options: ["일", "주", "월", "분기", "반기", "년"] },
      { name: "targetValue", label: "목표값", type: "text", required: true },
      { name: "actualValue", label: "실적값", type: "text", required: true },
      { name: "achievementRate", label: "달성률(%)", type: "number" },
      { name: "result", label: "판정", type: "select", options: ["달성", "미달성"], required: true },
      { name: "actionPlan", label: "개선대책", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  emergency: {
    fields: [
      { name: "recordDate", label: "훈련일자", type: "date", required: true },
      { name: "drillType", label: "훈련유형", type: "text", required: true },
      { name: "scenario", label: "시나리오", type: "textarea" },
      { name: "participants", label: "참여인원", type: "number" },
      { name: "duration", label: "소요시간", type: "text" },
      { name: "findings", label: "훈련결과/발견사항", type: "textarea" },
      { name: "effectiveness", label: "효과성평가", type: "select", options: ["효과적", "보통", "미흡"], required: true },
      { name: "improvements", label: "개선사항", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  supplier: {
    fields: [
      { name: "recordDate", label: "평가일자", type: "date", required: true },
      { name: "supplierName", label: "공급자명", type: "text", required: true },
      { name: "evaluationType", label: "평가유형", type: "select", options: ["정기평가", "수시평가", "실태조사"] },
      { name: "qualityScore", label: "품질점수", type: "number" },
      { name: "deliveryScore", label: "납기점수", type: "number" },
      { name: "totalScore", label: "종합점수", type: "number" },
      { name: "grade", label: "등급", type: "select", options: ["A", "B", "C", "D", "F"] },
      { name: "findings", label: "평가내용", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  calibration: {
    fields: [
      { name: "recordDate", label: "교정일자", type: "date", required: true },
      { name: "instrumentNo", label: "계측기번호", type: "text", required: true },
      { name: "instrumentName", label: "계측기명", type: "text" },
      { name: "calibrationType", label: "교정유형", type: "select", options: ["사내교정", "외부교정"] },
      { name: "calibrator", label: "교정기관/담당자", type: "text" },
      { name: "beforeValue", label: "교정전값", type: "text" },
      { name: "afterValue", label: "교정후값", type: "text" },
      { name: "result", label: "판정", type: "select", options: ["합격", "불합격", "조건부"], required: true },
      { name: "nextDate", label: "차기교정일", type: "date" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  document: {
    fields: [
      { name: "recordDate", label: "작성/검토일자", type: "date", required: true },
      { name: "documentNo", label: "문서번호", type: "text" },
      { name: "documentName", label: "문서명", type: "text", required: true },
      { name: "revision", label: "개정번호", type: "text" },
      { name: "changeContent", label: "변경내용", type: "textarea" },
      { name: "reviewer", label: "검토자", type: "text" },
      { name: "approver", label: "승인자", type: "text" },
      { name: "result", label: "상태", type: "select", options: ["승인", "검토중", "반려"], required: true },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  processCapability: {
    fields: [
      { name: "recordDate", label: "측정일", type: "date", required: true },
      { name: "partName", label: "품명", type: "text", required: true },
      { name: "partNo", label: "품번", type: "text" },
      { name: "vehicleType", label: "차종", type: "text" },
      { name: "sampleCount", label: "시료수", type: "number" },
      { name: "specification", label: "규격", type: "text" },
      { name: "upperLimit", label: "상한", type: "text" },
      { name: "lowerLimit", label: "하한", type: "text" },
      { name: "average", label: "평균(X̄)", type: "text" },
      { name: "stdDev", label: "표준편차(σ)", type: "text" },
      { name: "ppk", label: "PPK값", type: "text", required: true },
      { name: "cpk", label: "Cpk값", type: "text" },
      { name: "result", label: "판정", type: "select", options: ["충분(≥1.67)", "개선요(1.33~1.67)", "부족(<1.33)"], required: true },
      { name: "measurementTool", label: "측정기", type: "text" },
      { name: "inspector", label: "조사자", type: "text" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  mtbfMttr: {
    fields: [
      { name: "recordDate", label: "분석월", type: "date", required: true },
      { name: "equipmentNo", label: "설비번호", type: "text", required: true },
      { name: "equipmentName", label: "설비명", type: "text", required: true },
      { name: "process", label: "공정", type: "text" },
      { name: "installDate", label: "설치일자", type: "date" },
      { name: "loadTime", label: "부하시간(min)", type: "number" },
      { name: "actualRunTime", label: "실가동시간(min)", type: "number" },
      { name: "downtime", label: "비가동시간(min)", type: "number" },
      { name: "breakdownCount", label: "고장횟수", type: "number" },
      { name: "mtbf", label: "MTBF(min)", type: "text", required: true },
      { name: "mttr", label: "MTTR(min)", type: "text", required: true },
      { name: "availability", label: "가동률(%)", type: "text" },
      { name: "result", label: "판정", type: "select", options: ["목표달성", "미달성"], required: true },
      { name: "breakdownDetails", label: "고장내역", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  skillAssessment: {
    fields: [
      { name: "recordDate", label: "평가일", type: "date", required: true },
      { name: "employeeName", label: "성명", type: "text", required: true },
      { name: "department", label: "부서", type: "text" },
      { name: "position", label: "직급", type: "text" },
      { name: "workProcess", label: "담당공정", type: "text" },
      { name: "evaluationItems", label: "평가항목", type: "textarea" },
      { name: "skillLevel", label: "숙련도등급", type: "select", options: ["A(상)", "B(중)", "C(하)", "신입"], required: true },
      { name: "score", label: "평가점수", type: "number" },
      { name: "evaluator", label: "평가자", type: "text" },
      { name: "result", label: "판정", type: "select", options: ["합격", "재교육필요", "불합격"], required: true },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  reliabilityTest: {
    fields: [
      { name: "recordDate", label: "시험일자", type: "date", required: true },
      { name: "vehicleType", label: "차종", type: "text", required: true },
      { name: "partName", label: "품명", type: "text", required: true },
      { name: "partNo", label: "부번", type: "text" },
      { name: "testStandard", label: "시험규격", type: "text" },
      { name: "testType", label: "시험유형", type: "select", options: ["정기신뢰성", "법규시험", "특별시험"] },
      { name: "testItems", label: "시험항목", type: "textarea" },
      { name: "standardSpec", label: "규격", type: "textarea" },
      { name: "testResult", label: "시험결과", type: "textarea" },
      { name: "result", label: "판정", type: "select", options: ["합격", "불합격", "조건부"], required: true },
      { name: "tester", label: "시험자", type: "text" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  supplierSurvey: {
    fields: [
      { name: "recordDate", label: "조사일자", type: "date", required: true },
      { name: "companyName", label: "업체명", type: "text", required: true },
      { name: "representative", label: "대표자", type: "text" },
      { name: "businessType", label: "업종", type: "text" },
      { name: "establishYear", label: "설립년도", type: "text" },
      { name: "employees", label: "종업원수", type: "number" },
      { name: "salesAmount", label: "매출액(억)", type: "text" },
      { name: "qualitySystem", label: "품질시스템", type: "select", options: ["IATF16949", "ISO9001", "없음"] },
      { name: "majorCustomers", label: "주요거래처", type: "textarea" },
      { name: "facilities", label: "주요설비현황", type: "textarea" },
      { name: "result", label: "판정", type: "select", options: ["적합", "조건부적합", "부적합"], required: true },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  torqueCheck: {
    fields: [
      { name: "recordDate", label: "측정일", type: "date", required: true },
      { name: "shift", label: "조", type: "select", options: ["A조", "B조"] },
      { name: "vehicleType", label: "차종", type: "text" },
      { name: "line", label: "라인", type: "select", options: ["FRT", "RR", "서브"] },
      { name: "measurementPoint", label: "측정위치", type: "text" },
      { name: "standardMin", label: "기준값(Min)", type: "text" },
      { name: "standardMax", label: "기준값(Max)", type: "text" },
      { name: "actualLH", label: "실측값(LH)", type: "text" },
      { name: "actualRH", label: "실측값(RH)", type: "text" },
      { name: "result", label: "판정", type: "select", options: ["합격", "불합격"], required: true },
      { name: "measurer", label: "측정자", type: "text" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  riskAssessment: {
    fields: [
      { name: "recordDate", label: "평가일", type: "date", required: true },
      { name: "processName", label: "프로세스", type: "text", required: true },
      { name: "requirement", label: "요구사항", type: "textarea" },
      { name: "riskDescription", label: "리스크(불확실성)", type: "textarea" },
      { name: "severityBefore", label: "평가(심각도)", type: "number" },
      { name: "occurrenceBefore", label: "평가(발생도)", type: "number" },
      { name: "detectionBefore", label: "평가(검출도)", type: "number" },
      { name: "riskLevel", label: "리스크등급", type: "select", options: ["상", "중", "하"] },
      { name: "countermeasure", label: "대응조치", type: "textarea" },
      { name: "severityAfter", label: "조치후(심각도)", type: "number" },
      { name: "occurrenceAfter", label: "조치후(발생도)", type: "number" },
      { name: "detectionAfter", label: "조치후(검출도)", type: "number" },
      { name: "responsibleDept", label: "주관부서", type: "text" },
      { name: "result", label: "상태", type: "select", options: ["완료", "진행중", "계획"], required: true },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
  ppmTracking: {
    fields: [
      { name: "recordDate", label: "기준월", type: "date", required: true },
      { name: "supplierCode", label: "업체코드", type: "text" },
      { name: "supplierName", label: "업체명", type: "text" },
      { name: "receivedQty", label: "입고수량", type: "number", required: true },
      { name: "defectQty", label: "불량수량", type: "number" },
      { name: "ppmValue", label: "PPM값", type: "number" },
      { name: "defectTypes", label: "불량유형", type: "textarea" },
      { name: "targetPpm", label: "목표PPM", type: "number" },
      { name: "result", label: "판정", type: "select", options: ["목표달성", "미달성"], required: true },
      { name: "correctionAction", label: "시정조치", type: "textarea" },
      { name: "remarks", label: "비고", type: "textarea" },
    ],
  },
};

function getFormTemplate(itemName: string, processName: string): typeof formTemplates.default {
  const name = itemName.toLowerCase();
  const process = processName?.toLowerCase() || "";

  // 공정능력 관련
  if (name.includes("공정능력") || name.includes("cpk") || name.includes("ppk")) {
    return formTemplates.processCapability;
  }
  // MTBF/MTTR 설비분석
  if (name.includes("mtbf") || name.includes("mttr") || name.includes("가동률분석")) {
    return formTemplates.mtbfMttr;
  }
  // 숙련도/작업자 능력평가
  if (name.includes("숙련도") || name.includes("능력평가") || name.includes("직무능력")) {
    return formTemplates.skillAssessment;
  }
  // 신뢰성시험
  if (name.includes("신뢰성") || name.includes("정기시험") || name.includes("시험보고")) {
    return formTemplates.reliabilityTest;
  }
  // 업체 실태조사
  if (name.includes("실태조사") || name.includes("실태현황")) {
    return formTemplates.supplierSurvey;
  }
  // 토크 측정
  if (name.includes("토크") || name.includes("체결력")) {
    return formTemplates.torqueCheck;
  }
  // 리스크 평가
  if (name.includes("리스크") || name.includes("risk") || name.includes("위험평가")) {
    return formTemplates.riskAssessment;
  }
  // PPM 관리
  if (name.includes("ppm") || name.includes("불량률관리")) {
    return formTemplates.ppmTracking;
  }
  // 검사 관련
  if (name.includes("검사") || name.includes("초물") || name.includes("중물") || name.includes("종물")) {
    return formTemplates.inspection;
  }
  // 측정 관련
  if (name.includes("색차") || name.includes("도막") || name.includes("치수") || name.includes("측정")) {
    return formTemplates.measurement;
  }
  // 설비점검
  if (name.includes("설비") || name.includes("점검") || process.includes("설비보전")) {
    return formTemplates.equipment;
  }
  // 교육훈련
  if (name.includes("교육") || name.includes("훈련") || process.includes("인적자원")) {
    return formTemplates.training;
  }
  // 내부심사
  if (name.includes("심사") || process.includes("내부심사")) {
    return formTemplates.audit;
  }
  // KPI/성과지표
  if (name.includes("kpi") || name.includes("성과") || name.includes("지표") || name.includes("달성율")) {
    return formTemplates.kpi;
  }
  // 비상대응
  if (name.includes("비상") || process.includes("비상사태")) {
    return formTemplates.emergency;
  }
  // 공급자 평가
  if (name.includes("공급자") || name.includes("협력사") || process.includes("공급자")) {
    return formTemplates.supplier;
  }
  // 교정
  if (name.includes("교정") || name.includes("계측기") || process.includes("계측")) {
    return formTemplates.calibration;
  }
  // 문서관리
  if (name.includes("문서") || name.includes("절차서") || name.includes("표준서") || name.includes("계획서")) {
    return formTemplates.document;
  }

  return formTemplates.default;
}

export default function RecordInputPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ControlItem | null>(null);
  const [recentRecords, setRecentRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (params.id) {
      Promise.all([
        fetch(`/api/control-items/${params.id}`).then((res) => res.json()),
        fetch(`/api/inspection-records?controlItemId=${params.id}&limit=5`).then((res) => res.json()),
      ])
        .then(([itemData, recordsData]) => {
          setItem(itemData);
          setRecentRecords(Array.isArray(recordsData) ? recordsData : []);
          const template = getFormTemplate(itemData.name, itemData.process?.name);
          const initialData: Record<string, string> = {};
          template.fields.forEach((field) => {
            if (field.type === "date" && field.name === "recordDate") {
              initialData[field.name] = new Date().toISOString().split("T")[0];
            } else {
              initialData[field.name] = "";
            }
          });
          setFormData(initialData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/inspection-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          controlItemId: Number(params.id),
          inspectionDate: formData.recordDate,
          shift: formData.shift || null,
          result: formData.result,
          findings: JSON.stringify(formData),
        }),
      });

      if (response.ok) {
        alert("기록이 저장되었습니다.");
        router.push("/records");
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">관리항목을 찾을 수 없습니다.</p>
        <Link href="/records">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const template = getFormTemplate(item.name, item.process?.name || "");

  const frequencyColors: Record<string, string> = {
    "일": "bg-red-100 text-red-800",
    "주": "bg-orange-100 text-orange-800",
    "월": "bg-yellow-100 text-yellow-800",
    "반기": "bg-blue-100 text-blue-800",
    "년": "bg-green-100 text-green-800",
    "발생시": "bg-purple-100 text-purple-800",
  };

  const getFrequencyColor = (freq: string) => {
    for (const key of Object.keys(frequencyColors)) {
      if (freq?.includes(key)) return frequencyColors[key];
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/records">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">#{item.itemNo}</span>
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(item.frequency)}`}>
              {item.frequency}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            {item.process?.name || "미분류"} | 주관: {item.responsibleDept?.name || "-"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                기록 입력
              </CardTitle>
              <CardDescription>
                {item.notes || "관리항목에 대한 기록을 입력합니다."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {template.fields.map((field) => (
                    <div
                      key={field.name}
                      className={`space-y-2 ${field.type === "textarea" ? "md:col-span-2 lg:col-span-3" : ""}`}
                    >
                      <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          value={formData[field.name] || ""}
                          onValueChange={(v) => setFormData({ ...formData, [field.name]: v })}
                          required={field.required}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          placeholder={`${field.label}을(를) 입력하세요...`}
                          value={formData[field.name] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          rows={4}
                          required={field.required}
                        />
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          value={formData[field.name] || ""}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>첨부파일</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">파일을 드래그하거나 클릭하여 업로드</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Excel, 이미지 파일 지원 (최대 10MB)</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="outline" type="button" onClick={() => router.back()}>
                    취소
                  </Button>
                  <Button type="submit" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                최근 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">최근 기록이 없습니다.</p>
              ) : (
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">
                          {new Date(record.inspectionDate).toLocaleDateString("ko-KR")}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            record.result === "합격" || record.result === "완료"
                              ? "bg-green-100 text-green-800"
                              : record.result === "불합격"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.result}
                        </span>
                      </div>
                      {record.shift && (
                        <p className="text-xs text-muted-foreground">{record.shift}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">관리항목 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">프로세스</p>
                <p>{item.process?.name || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">관리주기</p>
                <p>{item.frequency}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">대상부서</p>
                <p>{item.targetDept?.name || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">주관부서</p>
                <p>{item.responsibleDept?.name || "-"}</p>
              </div>
              {item.notes && (
                <div>
                  <p className="text-muted-foreground text-xs">비고</p>
                  <p className="text-xs">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
