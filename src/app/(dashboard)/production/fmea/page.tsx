"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Save, Trash2, BarChart3, FileText, Car, ChevronRight } from "lucide-react";

// FMEA Item interface based on standard FMEA columns
interface FmeaItem {
  id: number;
  processStep: string; // 공정단계/기능
  requirements: string; // 요구사항
  potentialFailureMode: string; // 잠재적 고장모드
  potentialEffects: string; // 잠재적 고장영향
  severity: number; // 심각도 S (1-10)
  classification: string; // 분류 (C: Critical, S: Significant, 빈칸)
  potentialCause: string; // 잠재적 고장원인/메커니즘
  occurrence: number; // 발생도 O (1-10)
  currentControlPrevention: string; // 현 공정관리-예방
  currentControlDetection: string; // 현 공정관리-검출
  detection: number; // 검출도 D (1-10)
  rpn: number; // RPN = S x O x D
  recommendedAction: string; // 권고조치
  responsibility: string; // 책임 및 목표일
  actionTaken: string; // 조치결과
  actionSeverity: number; // 조치 후 S
  actionOccurrence: number; // 조치 후 O
  actionDetection: number; // 조치 후 D
  actionRpn: number; // 조치 후 RPN
}

// Header information for FMEA document
interface HeaderInfo {
  documentNo: string; // 문서번호
  vehicleModel: string; // 차종
  partName: string; // 부품명
  partNo: string; // 부품번호
  processName: string; // 공정명 (사출)
  preparedBy: string; // 작성자
  preparedDate: string; // 작성일
  reviewedBy: string; // 검토자
  reviewedDate: string; // 검토일
  approvedBy: string; // 승인자
  approvedDate: string; // 승인일
  revision: string; // 개정번호
  revisionDate: string; // 개정일
  teamMembers: string; // 팀원
}

// Sample data for FRT (Front Bumper) FMEA
const initialFrtData: FmeaItem[] = [
  {
    id: 1,
    processStep: "원재료 수입검사",
    requirements: "원재료 규격 확인",
    potentialFailureMode: "불량 원재료 입고",
    potentialEffects: "성형 불량, 외관 불량 발생",
    severity: 7,
    classification: "S",
    potentialCause: "수입검사 미흡",
    occurrence: 4,
    currentControlPrevention: "수입검사 절차서 운영",
    currentControlDetection: "성적서 확인, 샘플링 검사",
    detection: 5,
    rpn: 140,
    recommendedAction: "수입검사 강화",
    responsibility: "품질팀/2026-07-01",
    actionTaken: "",
    actionSeverity: 7,
    actionOccurrence: 3,
    actionDetection: 4,
    actionRpn: 84,
  },
  {
    id: 2,
    processStep: "건조",
    requirements: "수분 함량 관리",
    potentialFailureMode: "건조 불량",
    potentialEffects: "기포 발생, 강도 저하",
    severity: 8,
    classification: "C",
    potentialCause: "건조 온도/시간 미준수",
    occurrence: 3,
    currentControlPrevention: "건조 조건 표준화",
    currentControlDetection: "건조기 온도 모니터링",
    detection: 4,
    rpn: 96,
    recommendedAction: "자동 온도 기록 시스템",
    responsibility: "생산팀/2026-06-15",
    actionTaken: "자동 기록 시스템 도입 완료",
    actionSeverity: 8,
    actionOccurrence: 2,
    actionDetection: 3,
    actionRpn: 48,
  },
  {
    id: 3,
    processStep: "사출 성형",
    requirements: "치수 및 외관 품질 확보",
    potentialFailureMode: "미성형, 버 발생",
    potentialEffects: "조립 불가, 외관 불량",
    severity: 8,
    classification: "C",
    potentialCause: "금형 온도, 사출 압력 부적절",
    occurrence: 5,
    currentControlPrevention: "공정 파라미터 관리",
    currentControlDetection: "초중종물 검사",
    detection: 4,
    rpn: 160,
    recommendedAction: "SPC 관리 적용",
    responsibility: "생산기술팀/2026-07-15",
    actionTaken: "",
    actionSeverity: 8,
    actionOccurrence: 3,
    actionDetection: 3,
    actionRpn: 72,
  },
  {
    id: 4,
    processStep: "냉각",
    requirements: "냉각 시간 준수",
    potentialFailureMode: "냉각 부족",
    potentialEffects: "변형, 휨 발생",
    severity: 7,
    classification: "S",
    potentialCause: "냉각 시간 단축",
    occurrence: 3,
    currentControlPrevention: "냉각 시간 설정",
    currentControlDetection: "외관 육안 검사",
    detection: 5,
    rpn: 105,
    recommendedAction: "냉각수 온도 모니터링",
    responsibility: "생산팀/2026-06-30",
    actionTaken: "",
    actionSeverity: 7,
    actionOccurrence: 2,
    actionDetection: 4,
    actionRpn: 56,
  },
  {
    id: 5,
    processStep: "트리밍/가공",
    requirements: "버 제거 완료",
    potentialFailureMode: "버 잔존",
    potentialEffects: "조립 간섭, 외관 불량",
    severity: 6,
    classification: "",
    potentialCause: "트리밍 작업 미흡",
    occurrence: 4,
    currentControlPrevention: "작업 표준서",
    currentControlDetection: "전수 육안검사",
    detection: 3,
    rpn: 72,
    recommendedAction: "-",
    responsibility: "-",
    actionTaken: "-",
    actionSeverity: 6,
    actionOccurrence: 4,
    actionDetection: 3,
    actionRpn: 72,
  },
  {
    id: 6,
    processStep: "최종검사",
    requirements: "품질 기준 합격",
    potentialFailureMode: "검사 누락",
    potentialEffects: "불량품 유출",
    severity: 9,
    classification: "C",
    potentialCause: "검사원 실수",
    occurrence: 2,
    currentControlPrevention: "검사 체크시트",
    currentControlDetection: "출하 전 검사",
    detection: 3,
    rpn: 54,
    recommendedAction: "자동 검사 장비 도입",
    responsibility: "품질팀/2026-08-01",
    actionTaken: "",
    actionSeverity: 9,
    actionOccurrence: 1,
    actionDetection: 2,
    actionRpn: 18,
  },
];

// Sample data for RR (Rear Bumper) FMEA
const initialRrData: FmeaItem[] = [
  {
    id: 101,
    processStep: "원재료 수입검사",
    requirements: "원재료 규격 확인",
    potentialFailureMode: "불량 원재료 입고",
    potentialEffects: "성형 불량, 물성 저하",
    severity: 7,
    classification: "S",
    potentialCause: "수입검사 미흡",
    occurrence: 4,
    currentControlPrevention: "수입검사 절차서",
    currentControlDetection: "샘플링 검사",
    detection: 5,
    rpn: 140,
    recommendedAction: "검사 항목 추가",
    responsibility: "품질팀/2026-07-01",
    actionTaken: "",
    actionSeverity: 7,
    actionOccurrence: 3,
    actionDetection: 4,
    actionRpn: 84,
  },
  {
    id: 102,
    processStep: "건조",
    requirements: "수분 함량 0.02% 이하",
    potentialFailureMode: "건조 불량",
    potentialEffects: "기포 발생, 실버 마크",
    severity: 8,
    classification: "C",
    potentialCause: "건조기 이상",
    occurrence: 3,
    currentControlPrevention: "건조 조건 설정",
    currentControlDetection: "수분 측정기",
    detection: 4,
    rpn: 96,
    recommendedAction: "건조기 예방보전",
    responsibility: "설비팀/2026-06-20",
    actionTaken: "PM 주기 단축",
    actionSeverity: 8,
    actionOccurrence: 2,
    actionDetection: 3,
    actionRpn: 48,
  },
  {
    id: 103,
    processStep: "사출 성형",
    requirements: "치수 공차 준수",
    potentialFailureMode: "치수 불량",
    potentialEffects: "조립 불가",
    severity: 9,
    classification: "C",
    potentialCause: "금형 마모, 공정 조건 변동",
    occurrence: 4,
    currentControlPrevention: "금형 점검",
    currentControlDetection: "치수 검사 (3회/Lot)",
    detection: 4,
    rpn: 144,
    recommendedAction: "금형 수명 관리",
    responsibility: "금형팀/2026-07-10",
    actionTaken: "",
    actionSeverity: 9,
    actionOccurrence: 2,
    actionDetection: 3,
    actionRpn: 54,
  },
  {
    id: 104,
    processStep: "사출 성형",
    requirements: "외관 품질",
    potentialFailureMode: "웰드라인, 플로우마크",
    potentialEffects: "외관 불량",
    severity: 7,
    classification: "S",
    potentialCause: "사출 속도/온도 부적절",
    occurrence: 5,
    currentControlPrevention: "공정 조건 관리",
    currentControlDetection: "외관 전수 검사",
    detection: 3,
    rpn: 105,
    recommendedAction: "CAE 분석 적용",
    responsibility: "기술팀/2026-07-20",
    actionTaken: "",
    actionSeverity: 7,
    actionOccurrence: 3,
    actionDetection: 3,
    actionRpn: 63,
  },
  {
    id: 105,
    processStep: "후가공",
    requirements: "게이트 컷 처리",
    potentialFailureMode: "게이트 잔존",
    potentialEffects: "조립 간섭",
    severity: 6,
    classification: "",
    potentialCause: "작업 미숙",
    occurrence: 3,
    currentControlPrevention: "작업 교육",
    currentControlDetection: "육안 검사",
    detection: 4,
    rpn: 72,
    recommendedAction: "-",
    responsibility: "-",
    actionTaken: "-",
    actionSeverity: 6,
    actionOccurrence: 3,
    actionDetection: 4,
    actionRpn: 72,
  },
  {
    id: 106,
    processStep: "포장/출하",
    requirements: "포장 손상 방지",
    potentialFailureMode: "포장 불량",
    potentialEffects: "운송 중 파손",
    severity: 6,
    classification: "",
    potentialCause: "포장재 부적합",
    occurrence: 2,
    currentControlPrevention: "포장 규격서",
    currentControlDetection: "포장 상태 확인",
    detection: 4,
    rpn: 48,
    recommendedAction: "-",
    responsibility: "-",
    actionTaken: "-",
    actionSeverity: 6,
    actionOccurrence: 2,
    actionDetection: 4,
    actionRpn: 48,
  },
];

export default function FmeaPage() {
  const [activeTab, setActiveTab] = useState("header");

  // Header Info State
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    documentNo: "MBD0023D783",
    vehicleModel: "PE2",
    partName: "범퍼 (FRT/RR)",
    partNo: "MBD0023D783",
    processName: "사출",
    preparedBy: "홍길동",
    preparedDate: "2026-05-15",
    reviewedBy: "김철수",
    reviewedDate: "2026-05-20",
    approvedBy: "이영희",
    approvedDate: "2026-05-25",
    revision: "A",
    revisionDate: "2026-05-25",
    teamMembers: "생산기술팀, 품질팀, 금형팀",
  });

  // FMEA Items State for FRT and RR
  const [frtItems, setFrtItems] = useState<FmeaItem[]>(initialFrtData);
  const [rrItems, setRrItems] = useState<FmeaItem[]>(initialRrData);

  // Calculate RPN
  const calculateRpn = (s: number, o: number, d: number): number => {
    return s * o * d;
  };

  // Add new FMEA item
  const addFmeaItem = (type: "frt" | "rr") => {
    const baseId = type === "frt" ? Date.now() : Date.now() + 100;
    const newItem: FmeaItem = {
      id: baseId,
      processStep: "",
      requirements: "",
      potentialFailureMode: "",
      potentialEffects: "",
      severity: 1,
      classification: "",
      potentialCause: "",
      occurrence: 1,
      currentControlPrevention: "",
      currentControlDetection: "",
      detection: 1,
      rpn: 1,
      recommendedAction: "",
      responsibility: "",
      actionTaken: "",
      actionSeverity: 1,
      actionOccurrence: 1,
      actionDetection: 1,
      actionRpn: 1,
    };
    if (type === "frt") {
      setFrtItems([...frtItems, newItem]);
    } else {
      setRrItems([...rrItems, newItem]);
    }
  };

  // Remove FMEA item
  const removeFmeaItem = (type: "frt" | "rr", id: number) => {
    if (type === "frt") {
      setFrtItems(frtItems.filter((item) => item.id !== id));
    } else {
      setRrItems(rrItems.filter((item) => item.id !== id));
    }
  };

  // Update FMEA item
  const updateFmeaItem = (type: "frt" | "rr", id: number, field: keyof FmeaItem, value: string | number) => {
    const updateItem = (item: FmeaItem): FmeaItem => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Auto-calculate RPN when S, O, or D changes
        if (field === "severity" || field === "occurrence" || field === "detection") {
          updated.rpn = calculateRpn(
            field === "severity" ? Number(value) : updated.severity,
            field === "occurrence" ? Number(value) : updated.occurrence,
            field === "detection" ? Number(value) : updated.detection
          );
        }
        // Auto-calculate Action RPN
        if (field === "actionSeverity" || field === "actionOccurrence" || field === "actionDetection") {
          updated.actionRpn = calculateRpn(
            field === "actionSeverity" ? Number(value) : updated.actionSeverity,
            field === "actionOccurrence" ? Number(value) : updated.actionOccurrence,
            field === "actionDetection" ? Number(value) : updated.actionDetection
          );
        }
        return updated;
      }
      return item;
    };

    if (type === "frt") {
      setFrtItems(frtItems.map(updateItem));
    } else {
      setRrItems(rrItems.map(updateItem));
    }
  };

  // Get RPN badge variant
  const getRpnVariant = (rpn: number): "error" | "warning" | "success" | "outline" => {
    if (rpn >= 100) return "error";
    if (rpn >= 50) return "warning";
    return "success";
  };

  // Get classification badge
  const getClassificationBadge = (classification: string) => {
    if (classification === "C") {
      return <Badge variant="error">C</Badge>;
    } else if (classification === "S") {
      return <Badge variant="warning">S</Badge>;
    }
    return <span className="text-muted-foreground">-</span>;
  };

  // Statistics calculations
  const getStatistics = (items: FmeaItem[]) => {
    if (items.length === 0) {
      return {
        totalItems: 0,
        avgRpn: 0,
        maxRpn: 0,
        minRpn: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        avgSeverity: 0,
        avgOccurrence: 0,
        avgDetection: 0,
        rpnReduction: 0,
        criticalCount: 0,
        significantCount: 0,
        avgActionRpn: 0,
      };
    }

    const rpnValues = items.map((item) => item.rpn);
    const actionRpnValues = items.map((item) => item.actionRpn);
    const totalRpn = rpnValues.reduce((sum, rpn) => sum + rpn, 0);
    const totalActionRpn = actionRpnValues.reduce((sum, rpn) => sum + rpn, 0);

    return {
      totalItems: items.length,
      avgRpn: Math.round(totalRpn / items.length),
      maxRpn: Math.max(...rpnValues),
      minRpn: Math.min(...rpnValues),
      highRiskCount: items.filter((item) => item.rpn >= 100).length,
      mediumRiskCount: items.filter((item) => item.rpn >= 50 && item.rpn < 100).length,
      lowRiskCount: items.filter((item) => item.rpn < 50).length,
      avgSeverity: Math.round((items.reduce((sum, item) => sum + item.severity, 0) / items.length) * 10) / 10,
      avgOccurrence: Math.round((items.reduce((sum, item) => sum + item.occurrence, 0) / items.length) * 10) / 10,
      avgDetection: Math.round((items.reduce((sum, item) => sum + item.detection, 0) / items.length) * 10) / 10,
      rpnReduction: totalRpn > 0 ? Math.round(((totalRpn - totalActionRpn) / totalRpn) * 100) : 0,
      criticalCount: items.filter((item) => item.classification === "C").length,
      significantCount: items.filter((item) => item.classification === "S").length,
      avgActionRpn: Math.round(totalActionRpn / items.length),
    };
  };

  // Combined statistics
  const allItems = [...frtItems, ...rrItems];
  const frtStats = useMemo(() => getStatistics(frtItems), [frtItems]);
  const rrStats = useMemo(() => getStatistics(rrItems), [rrItems]);
  const totalStats = useMemo(() => getStatistics(allItems), [allItems]);

  // Save handler
  const handleSave = () => {
    const data = {
      headerInfo,
      frtItems,
      rrItems,
    };
    console.log("Saving FMEA:", data);
    alert("FMEA가 저장되었습니다.");
  };

  // FMEA Table Component
  const FmeaTable = ({ items, type }: { items: FmeaItem[]; type: "frt" | "rr" }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">공정단계/기능</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">요구사항</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">잠재적 고장모드</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">잠재적 고장영향</TableHead>
            <TableHead rowSpan={2} className="text-center w-12 border align-middle">S</TableHead>
            <TableHead rowSpan={2} className="text-center w-12 border align-middle">분류</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">잠재적 원인/메커니즘</TableHead>
            <TableHead rowSpan={2} className="text-center w-12 border align-middle">O</TableHead>
            <TableHead colSpan={2} className="text-center border">현 공정관리</TableHead>
            <TableHead rowSpan={2} className="text-center w-12 border align-middle">D</TableHead>
            <TableHead rowSpan={2} className="text-center w-16 border align-middle">RPN</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">권고조치</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">책임/목표일</TableHead>
            <TableHead rowSpan={2} className="min-w-[100px] border text-center align-middle">조치결과</TableHead>
            <TableHead colSpan={4} className="text-center border">조치 후</TableHead>
            <TableHead rowSpan={2} className="w-10 border"></TableHead>
          </TableRow>
          <TableRow className="bg-muted/30">
            <TableHead className="min-w-[80px] border text-center text-xs">예방</TableHead>
            <TableHead className="min-w-[80px] border text-center text-xs">검출</TableHead>
            <TableHead className="text-center w-10 border text-xs">S</TableHead>
            <TableHead className="text-center w-10 border text-xs">O</TableHead>
            <TableHead className="text-center w-10 border text-xs">D</TableHead>
            <TableHead className="text-center w-14 border text-xs">RPN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="border p-1">
                <Input
                  value={item.processStep}
                  onChange={(e) => updateFmeaItem(type, item.id, "processStep", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.requirements}
                  onChange={(e) => updateFmeaItem(type, item.id, "requirements", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.potentialFailureMode}
                  onChange={(e) => updateFmeaItem(type, item.id, "potentialFailureMode", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.potentialEffects}
                  onChange={(e) => updateFmeaItem(type, item.id, "potentialEffects", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Select
                  value={String(item.severity)}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "severity", Number(v))}
                >
                  <SelectTrigger className="h-8 w-12 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1 text-center">
                <Select
                  value={item.classification || "none"}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "classification", v === "none" ? "" : v)}
                >
                  <SelectTrigger className="h-8 w-12 text-xs">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    <SelectItem value="C">C (Critical)</SelectItem>
                    <SelectItem value="S">S (Significant)</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.potentialCause}
                  onChange={(e) => updateFmeaItem(type, item.id, "potentialCause", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Select
                  value={String(item.occurrence)}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "occurrence", Number(v))}
                >
                  <SelectTrigger className="h-8 w-12 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.currentControlPrevention}
                  onChange={(e) => updateFmeaItem(type, item.id, "currentControlPrevention", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.currentControlDetection}
                  onChange={(e) => updateFmeaItem(type, item.id, "currentControlDetection", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Select
                  value={String(item.detection)}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "detection", Number(v))}
                >
                  <SelectTrigger className="h-8 w-12 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1 text-center">
                <Badge variant={getRpnVariant(item.rpn)} className="text-xs">{item.rpn}</Badge>
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.recommendedAction}
                  onChange={(e) => updateFmeaItem(type, item.id, "recommendedAction", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.responsibility}
                  onChange={(e) => updateFmeaItem(type, item.id, "responsibility", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Input
                  value={item.actionTaken}
                  onChange={(e) => updateFmeaItem(type, item.id, "actionTaken", e.target.value)}
                  className="h-8 text-xs"
                />
              </TableCell>
              <TableCell className="border p-1">
                <Select
                  value={String(item.actionSeverity)}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "actionSeverity", Number(v))}
                >
                  <SelectTrigger className="h-8 w-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1">
                <Select
                  value={String(item.actionOccurrence)}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "actionOccurrence", Number(v))}
                >
                  <SelectTrigger className="h-8 w-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1">
                <Select
                  value={String(item.actionDetection)}
                  onValueChange={(v) => updateFmeaItem(type, item.id, "actionDetection", Number(v))}
                >
                  <SelectTrigger className="h-8 w-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="border p-1 text-center">
                <Badge variant={getRpnVariant(item.actionRpn)} className="text-xs">{item.actionRpn}</Badge>
              </TableCell>
              <TableCell className="border p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFmeaItem(type, item.id)}
                  className="h-7 w-7 p-0"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            잠재적 고장형태 및 영향분석 (공정 FMEA - 사출)
          </h1>
          <p className="text-muted-foreground">
            Process Failure Mode and Effects Analysis - MBD0023D783_Package.xlsx
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="header">
            <FileText className="mr-2 h-4 w-4" />
            FMEA 기본정보
          </TabsTrigger>
          <TabsTrigger value="frt">
            <Car className="mr-2 h-4 w-4" />
            FRT FMEA 분석
          </TabsTrigger>
          <TabsTrigger value="rr">
            <Car className="mr-2 h-4 w-4" />
            RR FMEA 분석
          </TabsTrigger>
          <TabsTrigger value="summary">
            <BarChart3 className="mr-2 h-4 w-4" />
            RPN 현황/통계
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: FMEA Basic Information */}
        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FMEA 기본정보 (Header Information)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> 문서정보
                </h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>문서번호 *</Label>
                    <Input
                      value={headerInfo.documentNo}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, documentNo: e.target.value })}
                      placeholder="MBD0023D783"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>개정번호</Label>
                    <Input
                      value={headerInfo.revision}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, revision: e.target.value })}
                      placeholder="A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>개정일</Label>
                    <Input
                      type="date"
                      value={headerInfo.revisionDate}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, revisionDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공정명 *</Label>
                    <Input
                      value={headerInfo.processName}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, processName: e.target.value })}
                      placeholder="사출"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle/Part Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Car className="h-4 w-4" /> 차종/부품정보
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>차종 *</Label>
                    <Input
                      value={headerInfo.vehicleModel}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, vehicleModel: e.target.value })}
                      placeholder="PE2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>부품명 *</Label>
                    <Input
                      value={headerInfo.partName}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, partName: e.target.value })}
                      placeholder="범퍼 (FRT/RR)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>부품번호 *</Label>
                    <Input
                      value={headerInfo.partNo}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, partNo: e.target.value })}
                      placeholder="MBD0023D783"
                    />
                  </div>
                </div>
              </div>

              {/* Approval Info */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">결재정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded p-3 space-y-2">
                    <Label className="text-muted-foreground text-xs">작성</Label>
                    <Input
                      value={headerInfo.preparedBy}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, preparedBy: e.target.value })}
                      placeholder="작성자"
                    />
                    <Input
                      type="date"
                      value={headerInfo.preparedDate}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, preparedDate: e.target.value })}
                    />
                  </div>
                  <div className="border rounded p-3 space-y-2">
                    <Label className="text-muted-foreground text-xs">검토</Label>
                    <Input
                      value={headerInfo.reviewedBy}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, reviewedBy: e.target.value })}
                      placeholder="검토자"
                    />
                    <Input
                      type="date"
                      value={headerInfo.reviewedDate}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, reviewedDate: e.target.value })}
                    />
                  </div>
                  <div className="border rounded p-3 space-y-2">
                    <Label className="text-muted-foreground text-xs">승인</Label>
                    <Input
                      value={headerInfo.approvedBy}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, approvedBy: e.target.value })}
                      placeholder="승인자"
                    />
                    <Input
                      type="date"
                      value={headerInfo.approvedDate}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, approvedDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">FMEA 팀</h3>
                <div className="space-y-2">
                  <Label>팀원</Label>
                  <Input
                    value={headerInfo.teamMembers}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, teamMembers: e.target.value })}
                    placeholder="생산기술팀, 품질팀, 금형팀"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FMEA Rating Guide */}
          <Card>
            <CardHeader>
              <CardTitle>FMEA 평가기준 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">심각도 (Severity) S</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>1-3: 경미한 영향</p>
                    <p>4-6: 보통 영향</p>
                    <p>7-8: 심각한 영향</p>
                    <p>9-10: 매우 심각/치명적</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">발생도 (Occurrence) O</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>1-3: 거의 발생 안함</p>
                    <p>4-6: 가끔 발생</p>
                    <p>7-8: 자주 발생</p>
                    <p>9-10: 매우 자주 발생</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">검출도 (Detection) D</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>1-3: 높은 검출 가능성</p>
                    <p>4-6: 보통 검출 가능성</p>
                    <p>7-8: 낮은 검출 가능성</p>
                    <p>9-10: 검출 거의 불가능</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">RPN = S x O x D</span>
                  </div>
                  <Badge variant="error">고위험: RPN 100 이상</Badge>
                  <Badge variant="warning">중위험: RPN 50-99</Badge>
                  <Badge variant="success">저위험: RPN 50 미만</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs">
                  <span className="font-semibold">분류:</span>
                  <Badge variant="error">C = Critical (안전/법규 관련)</Badge>
                  <Badge variant="warning">S = Significant (주요 기능)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: FRT (Front Bumper) FMEA Analysis */}
        <TabsContent value="frt" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChevronRight className="h-5 w-5" />
                  FRT (Front Bumper) FMEA 분석
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  전방 범퍼 사출 공정 FMEA - {frtItems.length}건
                </p>
              </div>
              <Button onClick={() => addFmeaItem("frt")}>
                <Plus className="mr-2 h-4 w-4" />
                항목 추가
              </Button>
            </CardHeader>
            <CardContent>
              {frtItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 FRT FMEA 항목이 없습니다.</p>
                  <p className="text-sm">항목 추가 버튼을 클릭하여 분석을 시작하세요.</p>
                </div>
              ) : (
                <FmeaTable items={frtItems} type="frt" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: RR (Rear Bumper) FMEA Analysis */}
        <TabsContent value="rr" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChevronRight className="h-5 w-5" />
                  RR (Rear Bumper) FMEA 분석
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  후방 범퍼 사출 공정 FMEA - {rrItems.length}건
                </p>
              </div>
              <Button onClick={() => addFmeaItem("rr")}>
                <Plus className="mr-2 h-4 w-4" />
                항목 추가
              </Button>
            </CardHeader>
            <CardContent>
              {rrItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 RR FMEA 항목이 없습니다.</p>
                  <p className="text-sm">항목 추가 버튼을 클릭하여 분석을 시작하세요.</p>
                </div>
              ) : (
                <FmeaTable items={rrItems} type="rr" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: RPN Summary/Statistics */}
        <TabsContent value="summary" className="space-y-6">
          {/* Overall Summary Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 분석 항목</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalStats.totalItems}</div>
                <p className="text-xs text-muted-foreground">FRT: {frtStats.totalItems} / RR: {rrStats.totalItems}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">평균 RPN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={getRpnVariant(totalStats.avgRpn)} className="text-lg px-3 py-1">
                    {totalStats.avgRpn}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">최대 RPN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={getRpnVariant(totalStats.maxRpn)} className="text-lg px-3 py-1">
                    {totalStats.maxRpn}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">조치 후 평균 RPN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={getRpnVariant(totalStats.avgActionRpn)} className="text-lg px-3 py-1">
                    {totalStats.avgActionRpn}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">RPN 개선율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{totalStats.rpnReduction}%</div>
              </CardContent>
            </Card>
          </div>

          {/* FRT vs RR Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>FRT 범퍼 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border rounded p-3">
                    <div className="text-2xl font-bold text-red-600">{frtStats.highRiskCount}</div>
                    <p className="text-xs text-muted-foreground">고위험</p>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-2xl font-bold text-yellow-600">{frtStats.mediumRiskCount}</div>
                    <p className="text-xs text-muted-foreground">중위험</p>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-2xl font-bold text-green-600">{frtStats.lowRiskCount}</div>
                    <p className="text-xs text-muted-foreground">저위험</p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <span>분류:</span>
                  <Badge variant="error">Critical: {frtStats.criticalCount}</Badge>
                  <Badge variant="warning">Significant: {frtStats.significantCount}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  평균 S: {frtStats.avgSeverity} / O: {frtStats.avgOccurrence} / D: {frtStats.avgDetection}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RR 범퍼 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border rounded p-3">
                    <div className="text-2xl font-bold text-red-600">{rrStats.highRiskCount}</div>
                    <p className="text-xs text-muted-foreground">고위험</p>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-2xl font-bold text-yellow-600">{rrStats.mediumRiskCount}</div>
                    <p className="text-xs text-muted-foreground">중위험</p>
                  </div>
                  <div className="border rounded p-3">
                    <div className="text-2xl font-bold text-green-600">{rrStats.lowRiskCount}</div>
                    <p className="text-xs text-muted-foreground">저위험</p>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <span>분류:</span>
                  <Badge variant="error">Critical: {rrStats.criticalCount}</Badge>
                  <Badge variant="warning">Significant: {rrStats.significantCount}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  평균 S: {rrStats.avgSeverity} / O: {rrStats.avgOccurrence} / D: {rrStats.avgDetection}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>위험 수준 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="error">고위험</Badge>
                    <span className="text-sm text-muted-foreground">(RPN 100 이상)</span>
                  </div>
                  <span className="text-2xl font-bold">{totalStats.highRiskCount}건</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-red-500 h-4 rounded-full transition-all"
                    style={{
                      width: totalStats.totalItems > 0 ? `${(totalStats.highRiskCount / totalStats.totalItems) * 100}%` : "0%",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">중위험</Badge>
                    <span className="text-sm text-muted-foreground">(RPN 50-99)</span>
                  </div>
                  <span className="text-2xl font-bold">{totalStats.mediumRiskCount}건</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-yellow-500 h-4 rounded-full transition-all"
                    style={{
                      width: totalStats.totalItems > 0 ? `${(totalStats.mediumRiskCount / totalStats.totalItems) * 100}%` : "0%",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">저위험</Badge>
                    <span className="text-sm text-muted-foreground">(RPN 50 미만)</span>
                  </div>
                  <span className="text-2xl font-bold">{totalStats.lowRiskCount}건</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{
                      width: totalStats.totalItems > 0 ? `${(totalStats.lowRiskCount / totalStats.totalItems) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Risk Items List */}
          {allItems.filter((item) => item.rpn >= 100).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  고위험 항목 목록 (RPN 100 이상)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>구분</TableHead>
                      <TableHead>공정단계</TableHead>
                      <TableHead>잠재적 고장모드</TableHead>
                      <TableHead>잠재적 원인</TableHead>
                      <TableHead className="text-center">S</TableHead>
                      <TableHead className="text-center">O</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">RPN</TableHead>
                      <TableHead>권고조치</TableHead>
                      <TableHead>책임/목표</TableHead>
                      <TableHead className="text-center">조치후 RPN</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...frtItems.filter((item) => item.rpn >= 100).map((item) => ({ ...item, type: "FRT" })),
                      ...rrItems.filter((item) => item.rpn >= 100).map((item) => ({ ...item, type: "RR" })),
                    ]
                      .sort((a, b) => b.rpn - a.rpn)
                      .map((item) => (
                        <TableRow key={`${item.type}-${item.id}`}>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{item.processStep || "-"}</TableCell>
                          <TableCell>{item.potentialFailureMode || "-"}</TableCell>
                          <TableCell>{item.potentialCause || "-"}</TableCell>
                          <TableCell className="text-center">{item.severity}</TableCell>
                          <TableCell className="text-center">{item.occurrence}</TableCell>
                          <TableCell className="text-center">{item.detection}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="error">{item.rpn}</Badge>
                          </TableCell>
                          <TableCell>{item.recommendedAction || "-"}</TableCell>
                          <TableCell>{item.responsibility || "-"}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getRpnVariant(item.actionRpn)}>{item.actionRpn}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Average Rating Summary */}
          <Card>
            <CardHeader>
              <CardTitle>평균 평가지수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>평균 심각도 (S)</Label>
                    <span className="text-lg font-bold">{totalStats.avgSeverity}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(totalStats.avgSeverity / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>평균 발생도 (O)</Label>
                    <span className="text-lg font-bold">{totalStats.avgOccurrence}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${(totalStats.avgOccurrence / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>평균 검출도 (D)</Label>
                    <span className="text-lg font-bold">{totalStats.avgDetection}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: `${(totalStats.avgDetection / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
