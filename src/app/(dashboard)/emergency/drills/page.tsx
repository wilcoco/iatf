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
  CheckCircle,
  History,
  Upload,
  X,
  ImageIcon,
  Users,
  Trash2,
  Filter
} from "lucide-react";

// Emergency types based on IATF 16949 requirements (9 types)
const EMERGENCY_TYPES = [
  { value: "전력공급중단", label: "전력공급중단", description: "외부 전력공급 차단으로 전원 중단" },
  { value: "설비고장", label: "설비고장/생산설비손상", description: "주요 생산설비 고장 및 손상" },
  { value: "인력부족", label: "인력부족", description: "인력 부족으로 인한 생산 차질" },
  { value: "자재공급차질", label: "자재/부품공급차질", description: "협력사 부품 납기 지연 및 공급 중단" },
  { value: "정보시스템장애", label: "정보시스템/네트워크장애", description: "ERP 서버 및 네트워크 다운" },
  { value: "자연재해", label: "자연재해", description: "지진, 태풍, 홍수 등 자연재해" },
  { value: "화재폭발", label: "화재 또는 폭발사고", description: "사업장 내 화재 및 폭발 발생" },
  { value: "전염병", label: "전염병 및 팬데믹", description: "감염병 확산 및 팬데믹 상황" },
  { value: "보안사고", label: "보안사고/사이버공격", description: "피싱, 랜섬웨어 등 사이버 공격" },
];

// Effectiveness rating options
const EFFECTIVENESS_RATINGS = [
  { value: "매우효과적", label: "매우 효과적", stars: 5 },
  { value: "효과적", label: "효과적", stars: 4 },
  { value: "보통", label: "보통", stars: 3 },
  { value: "미흡", label: "미흡", stars: 2 },
  { value: "매우미흡", label: "매우 미흡", stars: 1 },
];

interface Attachment {
  id: number;
  name: string;
  type: string;
}

interface TargetResult {
  id: number;
  targetNumber: string;
  name: string;
  email: string;
  department: string;
  tag: string;
  readTime: string;
  readIP: string;
  phishingAccess: string;
  phishingIP: string;
  infoLeak: string;
  cumulativeInfection: number;
  deviceType: string;
  deviceInfo: string;
}

interface EmergencyDrill {
  id: number;
  // Basic info
  drillName: string;
  drillDate: string;
  drillTime: string;
  drillLocation: string;
  participatingDepartments: string;
  participantCount: number;
  emergencyType: string;
  conductor: string;
  // Scenario and objectives
  scenario: string;
  objectives: string;
  keyContents: string;
  // Results
  evaluation: string;
  effectivenessRating: string;
  responseTime: string;
  improvements: string;
  attachments: Attachment[];
  // Target results (for security/cyber drills)
  targetResults: TargetResult[];
  // Meta
  createdAt: string;
  status: "계획" | "완료" | "취소";
}

const initialFormData = {
  // Basic info
  drillName: "",
  drillDate: new Date().toISOString().split("T")[0],
  drillTime: "",
  drillLocation: "",
  participatingDepartments: "",
  participantCount: "",
  emergencyType: "",
  conductor: "",
  // Scenario
  scenario: "",
  objectives: "",
  keyContents: "",
  // Results
  evaluation: "",
  effectivenessRating: "",
  responseTime: "",
  improvements: "",
  attachments: [] as Attachment[],
  targetResults: [] as TargetResult[],
};

// Sample data based on Excel files
const sampleDrills: EmergencyDrill[] = [
  {
    id: 1,
    drillName: "전력공급중단 대응 훈련",
    drillDate: "2025-07-02",
    drillTime: "11:00 ~ 12:00",
    drillLocation: "전 공장 구역",
    participatingDepartments: "생산팀, 설비팀, 안전관리팀, 총무팀",
    participantCount: 12,
    emergencyType: "전력공급중단",
    conductor: "김안전",
    scenario: "외부 전력공급 차단으로 전 공장 전원 중단, 생산 및 시스템 운영 불가 상태 발생",
    objectives: "전력공급 중단 시 긴급 대응 및 복구 체계 점검",
    keyContents: "1. 정전 발생 즉시 전원 차단 확인 및 인원 대피 유도\n2. 비상 발전기 가동 여부 확인 및 점검\n3. 주요 설비 상태 점검 및 복구 준비\n4. 전력 복구 후 설비 정상화 확인",
    evaluation: "1. 정전 발생 후 전원 차단 확인까지 5분 소요\n2. 비상 발전기 정상 작동 확인됨\n3. 설비 안전 점검 후 이상 없음 확인\n4. 전력 복구 후 설비 정상 작동 완료",
    effectivenessRating: "효과적",
    responseTime: "5분",
    improvements: "1. 일부 부서의 대피 경로 숙지 부족\n2. 비상 발전기 연료 잔량 부족 확인\n→ 조치계획: 정기 비상 대피 훈련 실시 및 발전기 연료 점검 주기 강화",
    attachments: [],
    targetResults: [],
    createdAt: "2025-07-02",
    status: "완료",
  },
  {
    id: 2,
    drillName: "설비고장/생산설비손상 대응 훈련",
    drillDate: "2025-07-02",
    drillTime: "14:00 ~ 15:00",
    drillLocation: "사출 1라인",
    participatingDepartments: "생산팀, 생산기술팀, 개발품질팀, 상생협력팀, 영업관리팀",
    participantCount: 9,
    emergencyType: "설비고장",
    conductor: "박생산",
    scenario: "주요 생산설비(사출1호기)가 볼트파손으로 정지, 생산 중단 발생",
    objectives: "설비고장 발생 시 즉각적인 복구 조치 및 대체 설비 가동 여부 검토",
    keyContents: "1. 설비 고장 보고 및 현장 출동\n2. 고장 원인 분석 및 부품 교체 시뮬레이션\n3. 대체 설비 전환 테스트\n4. 품질 검사 후 생산 재개 판단",
    evaluation: "1. 보전반 출동 후 고장 진단까지 8분 소요\n2. 예비 부품 확보로 35분 내 교체 완료\n3. 대체 설비 가동 성공 및 품질 이상 없음\n4. 전체 생산 중단 시간: 약 40분",
    effectivenessRating: "매우효과적",
    responseTime: "8분",
    improvements: "1. 일부 생산직의 고장 대응 매뉴얼 숙지 부족\n2. 예비 부품 위치 및 수량 정보 체계화 미흡\n→ 조치계획: 사출반/보전반 대상 고장 대응 교육 실시 및 부품 위치 라벨링 개선",
    attachments: [],
    targetResults: [],
    createdAt: "2025-07-02",
    status: "완료",
  },
  {
    id: 3,
    drillName: "보안사고/사이버공격 대응 훈련",
    drillDate: "2025-06-05",
    drillTime: "종일 (6월 5일 ~ 6월 10일)",
    drillLocation: "각 부서 사무실",
    participatingDepartments: "전체 관리직 대상",
    participantCount: 55,
    emergencyType: "보안사고",
    conductor: "이전산",
    scenario: "모의피싱 메일 전체 관리직 대상 메일송부 감염유출 점검",
    objectives: "모의피싱 메일 접수시 열람 방지를 통한 감염유출 방지",
    keyContents: "1. 전체 관리직 대상 모의피싱 메일 발송\n2. 모의피싱 메일발송후 5일간 PC 감염여부 점검\n3. 전산팀 담당자 PC 감염결과 정리 및 보고\n4. 모의피싱 훈련결과 전체 관리직 인원 대상 결과 공유",
    evaluation: "1. 전체관리직 직원 55명중 26명 감염 및 유출 발생\n   - 열람 : 26명, 피싱접속 : 7명, 정보유출 : 5명\n2. 피싱접속인원/정보유출 인원 긴급 인터넷차단 진행\n3. 감염 PC 복원 작업후 원상 복귀\n4. PC 프로그램 오염부터 복구까지 최대 40분 소요",
    effectivenessRating: "효과적",
    responseTime: "40분",
    improvements: "1. 일부 직원 외부 메일에 대한 위험성 인지 부족\n→ 조치계획: 전 직원 대상 개인 및 회사 메일 열람시 피싱메일 확인후 열람\n2. 전산팀 인원 1명 운영에 따른 다수 PC 문제시 대응 어려움\n→ 각부서 담당자 개인 PC 프로그램 오염 복구 방법 주기적 교육 실시",
    attachments: [],
    targetResults: [
      { id: 1, targetNumber: "780215", name: "채정훈", email: "chaejh1234@icams.co.kr", department: "캠스", tag: "25년_캠스", readTime: "", readIP: "", phishingAccess: "", phishingIP: "", infoLeak: "", cumulativeInfection: 0, deviceType: "PC", deviceInfo: "" },
      { id: 2, targetNumber: "780214", name: "임민규", email: "dlarb1009@icams.co.kr", department: "캠스", tag: "25년_캠스", readTime: "2025-06-05 15:50:54", readIP: "59.3.91.52", phishingAccess: "2025-06-05 15:51:13", phishingIP: "59.3.91.52", infoLeak: "", cumulativeInfection: 0, deviceType: "PC", deviceInfo: "Windows 10 / Edge 137.0.0" },
      { id: 3, targetNumber: "780212", name: "윤두섭", email: "seogdu@icams.co.kr", department: "캠스", tag: "25년_캠스", readTime: "2025-06-09 11:50:01", readIP: "59.3.91.101", phishingAccess: "2025-06-09 11:50:19", phishingIP: "59.3.91.101", infoLeak: "2025-06-09 11:51:11", cumulativeInfection: 1, deviceType: "PC", deviceInfo: "Windows 10 / Edge 137.0.0" },
      { id: 4, targetNumber: "678872", name: "김주환", email: "kjh8005@icams.co.kr", department: "캠스", tag: "25년_캠스", readTime: "2025-06-05 15:38:32", readIP: "223.39.204.39", phishingAccess: "2025-06-05 15:38:34", phishingIP: "223.39.204.39", infoLeak: "2025-06-05 15:38:49", cumulativeInfection: 1, deviceType: "MOBILE", deviceInfo: "Samsung SMS911N / Android 14" },
      { id: 5, targetNumber: "577004", name: "장지우", email: "hanafos941@icams.co.kr", department: "캠스", tag: "25년_캠스", readTime: "2025-06-09 12:00:03", readIP: "59.3.91.101", phishingAccess: "2025-06-09 13:25:29", phishingIP: "59.3.91.101", infoLeak: "2025-06-09 13:25:41", cumulativeInfection: 1, deviceType: "PC", deviceInfo: "Windows 10 / Edge 137.0.0" },
    ],
    createdAt: "2025-06-10",
    status: "완료",
  },
  {
    id: 4,
    drillName: "정보시스템/네트워크 장애 대응 훈련",
    drillDate: "2025-07-01",
    drillTime: "09:30 ~ 10:30",
    drillLocation: "서버실 및 각 부서 사무실",
    participatingDepartments: "전산팀, 생산팀, 개발품질팀, 영업관리팀, 생산기술팀",
    participantCount: 10,
    emergencyType: "정보시스템장애",
    conductor: "김전산",
    scenario: "ERP 서버 및 사내 네트워크가 예고 없이 다운되어 전사적 업무 중단 발생",
    objectives: "정보시스템 장애 발생 시 신속한 원인 파악 및 업무 복구 체계 점검",
    keyContents: "1. 장애 감지 및 IT팀 긴급 대응 절차 수행\n2. 백업 시스템 작동 확인 및 데이터 복원\n3. 대체 업무절차 (수기 처리) 가동\n4. 복구 후 업무 정상화 확인",
    evaluation: "1. 장애 감지 후 대응까지 10분 소요\n2. 백업 서버 정상 작동, ERP 데이터 100% 복원 성공\n3. 수기 작업으로 생산지시 임시 운영 가능 확인\n4. 전체 시스템 복구까지 총 50분 소요",
    effectivenessRating: "효과적",
    responseTime: "10분",
    improvements: "1. 일부 직원 장애 시 대응 프로세스 숙지 부족\n2. 백업 데이터 확인 주기 미흡\n→ 조치계획: 전 직원 대상 장애 대응 교육 및 백업 점검 주기 강화",
    attachments: [],
    targetResults: [],
    createdAt: "2025-07-01",
    status: "완료",
  },
  {
    id: 5,
    drillName: "전염병 및 팬데믹 상황 대응 훈련",
    drillDate: "2025-06-30",
    drillTime: "10:00 ~ 11:30",
    drillLocation: "본관 회의실 및 각 부서 작업장",
    participatingDepartments: "ES담당, 영업관리팀, 생산팀, 개발품질팀, 생산기술팀, 전산팀",
    participantCount: 10,
    emergencyType: "전염병",
    conductor: "박방역",
    scenario: "지역 내 전염병 확산으로 정부의 사회적 거리두기 격상 지침 발령, 전직원 50% 재택근무 전환 필요",
    objectives: "전염병 확산 시 사업장 내 감염 방지 및 업무 연속성 확보",
    keyContents: "1. 방역지침 전파 및 개인보호장비 배포\n2. 재택근무 대상자 지정 및 IT 인프라 점검\n3. 대면 업무 축소 및 화상회의 운영 시뮬레이션\n4. 감염자 발생 시 보고 및 격리 프로세스 시연",
    evaluation: "1. 전 직원 대상 방역지침 공지 완료\n2. 재택근무 체계 점검 및 일부 장비 보완 필요 확인\n3. 화상회의 시스템 운영 원활\n4. 감염자 격리 시뮬레이션 15분 내 완료",
    effectivenessRating: "효과적",
    responseTime: "15분",
    improvements: "1. 일부 직원 노트북 부족으로 IT 대응 지연\n2. 방역물품 재고 부족 확인됨\n→ 조치계획: 노트북 추가 확보 및 방역물품 정기 재고점검체계 구축",
    attachments: [],
    targetResults: [],
    createdAt: "2025-06-30",
    status: "완료",
  },
  {
    id: 6,
    drillName: "자재/부품공급차질 대응 훈련",
    drillDate: "2025-07-02",
    drillTime: "16:00 ~ 17:00",
    drillLocation: "현장 자재보관장 및 자재사무실",
    participatingDepartments: "상생협력팀, 생산팀, 개발품질팀, 영업관리팀",
    participantCount: 9,
    emergencyType: "자재공급차질",
    conductor: "최자재",
    scenario: "주요 협력사 부품 납기 지연 발생, 생산 일정 차질 우려",
    objectives: "부품 공급 중단 시 대체 공급처 확보 및 생산계획 조정 체계 점검",
    keyContents: "1. 납기 지연 상황 접수 및 원인 분석\n2. 보유 재고 및 안전재고 확인\n3. 대체 공급처 가용성 확인 및 긴급 발주\n4. 생산계획 재조정 및 고객 커뮤니케이션",
    evaluation: "1. 안전재고 3일치 확보되어 급한 생산 차질은 없음\n2. 대체 업체 2곳 확보 및 발주 완료\n3. 생산일정 1일 조정으로 납기 차질 방지 성공",
    effectivenessRating: "효과적",
    responseTime: "30분",
    improvements: "1. 일부 품목의 재고 정보 최신화 미흡\n2. 대체 공급업체 리스트 업데이트 필요\n→ 조치계획: 재고관리 시스템 정기 검토 및 협력사 리스트 분기별 갱신",
    attachments: [],
    targetResults: [],
    createdAt: "2025-07-02",
    status: "완료",
  },
];

export default function EmergencyDrillsPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [drills, setDrills] = useState<EmergencyDrill[]>(sampleDrills);
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState<EmergencyDrill | null>(null);
  const [historyFilter, setHistoryFilter] = useState<string>("all");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAttachment = () => {
    const newAttachment: Attachment = {
      id: Date.now(),
      name: `첨부파일_${formData.attachments.length + 1}.pdf`,
      type: "document",
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment],
    }));
  };

  const handleRemoveAttachment = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  const handleAddTargetResult = () => {
    const newTarget: TargetResult = {
      id: Date.now(),
      targetNumber: "",
      name: "",
      email: "",
      department: "",
      tag: "",
      readTime: "",
      readIP: "",
      phishingAccess: "",
      phishingIP: "",
      infoLeak: "",
      cumulativeInfection: 0,
      deviceType: "PC",
      deviceInfo: "",
    };
    setFormData((prev) => ({
      ...prev,
      targetResults: [...prev.targetResults, newTarget],
    }));
  };

  const handleUpdateTargetResult = (id: number, field: keyof TargetResult, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      targetResults: prev.targetResults.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  };

  const handleRemoveTargetResult = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      targetResults: prev.targetResults.filter((t) => t.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (!formData.drillName || !formData.drillDate || !formData.emergencyType) {
      alert("필수 항목(훈련명, 훈련일시, 비상유형)을 입력해주세요.");
      return;
    }

    const newDrill: EmergencyDrill = {
      id: isEditing && selectedDrill ? selectedDrill.id : Date.now(),
      drillName: formData.drillName,
      drillDate: formData.drillDate,
      drillTime: formData.drillTime,
      drillLocation: formData.drillLocation,
      participatingDepartments: formData.participatingDepartments,
      participantCount: Number(formData.participantCount) || 0,
      emergencyType: formData.emergencyType,
      conductor: formData.conductor,
      scenario: formData.scenario,
      objectives: formData.objectives,
      keyContents: formData.keyContents,
      evaluation: formData.evaluation,
      effectivenessRating: formData.effectivenessRating,
      responseTime: formData.responseTime,
      improvements: formData.improvements,
      attachments: formData.attachments,
      targetResults: formData.targetResults,
      createdAt: new Date().toISOString().split("T")[0],
      status: formData.evaluation ? "완료" : "계획",
    };

    if (isEditing && selectedDrill) {
      setDrills(drills.map((d) => (d.id === selectedDrill.id ? newDrill : d)));
    } else {
      setDrills([newDrill, ...drills]);
    }

    setFormData(initialFormData);
    setIsEditing(false);
    setSelectedDrill(null);
    setActiveTab("history");
    alert("비상대응훈련 보고서가 저장되었습니다.");
  };

  const handleNewDrill = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setSelectedDrill(null);
    setActiveTab("basic");
  };

  const handleViewDrill = (drill: EmergencyDrill) => {
    setSelectedDrill(drill);
    setFormData({
      drillName: drill.drillName,
      drillDate: drill.drillDate,
      drillTime: drill.drillTime,
      drillLocation: drill.drillLocation,
      participatingDepartments: drill.participatingDepartments,
      participantCount: drill.participantCount.toString(),
      emergencyType: drill.emergencyType,
      conductor: drill.conductor,
      scenario: drill.scenario,
      objectives: drill.objectives,
      keyContents: drill.keyContents,
      evaluation: drill.evaluation,
      effectivenessRating: drill.effectivenessRating,
      responseTime: drill.responseTime,
      improvements: drill.improvements,
      attachments: drill.attachments,
      targetResults: drill.targetResults,
    });
    setIsEditing(true);
    setActiveTab("basic");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "완료":
        return <Badge variant="success">완료</Badge>;
      case "계획":
        return <Badge variant="warning">계획</Badge>;
      case "취소":
        return <Badge variant="destructive">취소</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEmergencyTypeLabel = (value: string) => {
    return EMERGENCY_TYPES.find((t) => t.value === value)?.label || value;
  };

  const getEffectivenessStars = (rating: string) => {
    const found = EFFECTIVENESS_RATINGS.find((r) => r.value === rating);
    if (!found) return "";
    return "★".repeat(found.stars) + "☆".repeat(5 - found.stars);
  };

  const getEffectivenessBadge = (rating: string) => {
    switch (rating) {
      case "매우효과적":
        return <Badge variant="success">{rating} {getEffectivenessStars(rating)}</Badge>;
      case "효과적":
        return <Badge variant="success">{rating} {getEffectivenessStars(rating)}</Badge>;
      case "보통":
        return <Badge variant="warning">{rating} {getEffectivenessStars(rating)}</Badge>;
      case "미흡":
      case "매우미흡":
        return <Badge variant="destructive">{rating} {getEffectivenessStars(rating)}</Badge>;
      default:
        return <Badge variant="outline">{rating}</Badge>;
    }
  };

  const filteredDrills = historyFilter === "all"
    ? drills
    : drills.filter((d) => d.emergencyType === historyFilter);

  // Calculate summary stats for target results
  const getTargetResultsSummary = () => {
    const results = formData.targetResults;
    const total = results.length;
    const read = results.filter((r) => r.readTime).length;
    const phishing = results.filter((r) => r.phishingAccess).length;
    const leaked = results.filter((r) => r.infoLeak).length;
    return { total, read, phishing, leaked };
  };

  const targetSummary = getTargetResultsSummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비상대응훈련결과 보고서</h1>
          <p className="text-muted-foreground">IATF 16949 기반 비상대응훈련 계획, 실행 및 결과 관리</p>
        </div>
        <Button onClick={handleNewDrill}>
          <Plus className="mr-2 h-4 w-4" />
          새 훈련 등록
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                훈련 유형 및 기본정보
              </TabsTrigger>
              <TabsTrigger value="scenario" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                시나리오 및 결과
              </TabsTrigger>
              <TabsTrigger value="targets" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                대상별 결과 정리
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                훈련 이력
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Emergency Type and Basic Info */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    훈련 유형 선택 및 기본정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Emergency Type Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">비상유형 선택 (IATF 16949 기준 9가지 유형) *</Label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {EMERGENCY_TYPES.map((type) => (
                        <div
                          key={type.value}
                          className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary ${
                            formData.emergencyType === type.value
                              ? "border-primary bg-primary/5"
                              : "border-muted"
                          }`}
                          onClick={() => handleInputChange("emergencyType", type.value)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full border-2 ${
                                formData.emergencyType === type.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              }`}
                            />
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="my-6" />

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">훈련 기본정보</Label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="drillName">훈련명 *</Label>
                        <Input
                          id="drillName"
                          value={formData.drillName}
                          onChange={(e) => handleInputChange("drillName", e.target.value)}
                          placeholder="예: 2025년 상반기 전력공급중단 대응 훈련"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conductor">훈련책임자</Label>
                        <Input
                          id="conductor"
                          value={formData.conductor}
                          onChange={(e) => handleInputChange("conductor", e.target.value)}
                          placeholder="훈련 책임자 이름"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="drillDate">훈련일시 *</Label>
                        <Input
                          id="drillDate"
                          type="date"
                          value={formData.drillDate}
                          onChange={(e) => handleInputChange("drillDate", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drillTime">훈련시간</Label>
                        <Input
                          id="drillTime"
                          value={formData.drillTime}
                          onChange={(e) => handleInputChange("drillTime", e.target.value)}
                          placeholder="예: 14:00 ~ 16:00"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="drillLocation">훈련장소</Label>
                        <Input
                          id="drillLocation"
                          value={formData.drillLocation}
                          onChange={(e) => handleInputChange("drillLocation", e.target.value)}
                          placeholder="예: 전 공장 구역, 사출 1라인"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="participantCount">훈련참여인원</Label>
                        <Input
                          id="participantCount"
                          type="number"
                          value={formData.participantCount}
                          onChange={(e) => handleInputChange("participantCount", e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="participatingDepartments">훈련참여부서</Label>
                      <Input
                        id="participatingDepartments"
                        value={formData.participatingDepartments}
                        onChange={(e) => handleInputChange("participatingDepartments", e.target.value)}
                        placeholder="예: 생산팀, 설비팀, 안전관리팀, 총무팀"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("scenario")}>
                      다음: 시나리오 및 결과
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Scenario and Results */}
            <TabsContent value="scenario">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    훈련 시나리오 및 결과 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scenario Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">훈련 시나리오 및 목표</Label>

                    <div className="space-y-2">
                      <Label htmlFor="scenario">훈련 시나리오</Label>
                      <Textarea
                        id="scenario"
                        value={formData.scenario}
                        onChange={(e) => handleInputChange("scenario", e.target.value)}
                        placeholder="훈련 시나리오 내용을 상세히 기술해주세요.&#10;예: 외부 전력공급 차단으로 전 공장 전원 중단, 생산 및 시스템 운영 불가 상태 발생"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objectives">훈련 목표</Label>
                      <Textarea
                        id="objectives"
                        value={formData.objectives}
                        onChange={(e) => handleInputChange("objectives", e.target.value)}
                        placeholder="이번 훈련의 목표를 기술해주세요.&#10;예: 전력공급 중단 시 긴급 대응 및 복구 체계 점검"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keyContents">주요 훈련 내용</Label>
                      <Textarea
                        id="keyContents"
                        value={formData.keyContents}
                        onChange={(e) => handleInputChange("keyContents", e.target.value)}
                        placeholder="주요 훈련 내용 및 절차를 기술해주세요.&#10;예:&#10;1. 정전 발생 즉시 전원 차단 확인 및 인원 대피 유도&#10;2. 비상 발전기 가동 여부 확인 및 점검"
                        rows={5}
                      />
                    </div>
                  </div>

                  <hr className="my-6" />

                  {/* Results Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">훈련 결과 평가</Label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="responseTime">대응시간</Label>
                        <Input
                          id="responseTime"
                          value={formData.responseTime}
                          onChange={(e) => handleInputChange("responseTime", e.target.value)}
                          placeholder="예: 5분, 10분"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="effectivenessRating">효과성 평가</Label>
                        <Select
                          value={formData.effectivenessRating}
                          onValueChange={(v) => handleInputChange("effectivenessRating", v)}
                        >
                          <SelectTrigger id="effectivenessRating">
                            <SelectValue placeholder="효과성 평가 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {EFFECTIVENESS_RATINGS.map((rating) => (
                              <SelectItem key={rating.value} value={rating.value}>
                                {rating.label} {"★".repeat(rating.stars)}{"☆".repeat(5 - rating.stars)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="evaluation">훈련 결과</Label>
                      <Textarea
                        id="evaluation"
                        value={formData.evaluation}
                        onChange={(e) => handleInputChange("evaluation", e.target.value)}
                        placeholder="훈련 결과 및 평가 내용을 기술해주세요.&#10;예:&#10;1. 정전 발생 후 전원 차단 확인까지 5분 소요&#10;2. 비상 발전기 정상 작동 확인됨"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="improvements">문제점 및 개선사항</Label>
                      <Textarea
                        id="improvements"
                        value={formData.improvements}
                        onChange={(e) => handleInputChange("improvements", e.target.value)}
                        placeholder="발견된 문제점과 향후 개선이 필요한 사항을 기술해주세요.&#10;예:&#10;1. 일부 부서의 대피 경로 숙지 부족&#10;→ 조치계획: 정기 비상 대피 훈련 실시"
                        rows={5}
                      />
                    </div>
                  </div>

                  <hr className="my-6" />

                  {/* Attachments Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">사진 및 첨부자료</Label>
                      <Button variant="outline" size="sm" onClick={handleAddAttachment}>
                        <Upload className="mr-2 h-4 w-4" />
                        파일 추가
                      </Button>
                    </div>
                    {formData.attachments.length > 0 ? (
                      <div className="grid gap-2">
                        {formData.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded-md border p-3"
                          >
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{attachment.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(attachment.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed p-8 text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          첨부된 파일이 없습니다
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("basic")}>
                      이전: 기본정보
                    </Button>
                    <div className="flex gap-2">
                      {formData.emergencyType === "보안사고" && (
                        <Button variant="outline" onClick={() => setActiveTab("targets")}>
                          다음: 대상별 결과
                        </Button>
                      )}
                      <Button onClick={handleSubmit}>
                        <Save className="mr-2 h-4 w-4" />
                        보고서 저장
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Target Results */}
            <TabsContent value="targets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    대상별 훈련 결과 (보안사고/사이버공격 훈련용)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Cards */}
                  {formData.targetResults.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">{targetSummary.total}명</div>
                          <p className="text-sm text-muted-foreground">총 대상자</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-yellow-600">{targetSummary.read}명</div>
                          <p className="text-sm text-muted-foreground">메일 열람</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-orange-600">{targetSummary.phishing}명</div>
                          <p className="text-sm text-muted-foreground">피싱 접속</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-red-600">{targetSummary.leaked}명</div>
                          <p className="text-sm text-muted-foreground">정보 유출</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Add Target Button */}
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={handleAddTargetResult}>
                      <Plus className="mr-2 h-4 w-4" />
                      대상자 추가
                    </Button>
                  </div>

                  {/* Target Results Table */}
                  {formData.targetResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">대상번호</TableHead>
                            <TableHead className="w-[100px]">이름</TableHead>
                            <TableHead className="w-[150px]">이메일</TableHead>
                            <TableHead className="w-[100px]">소속</TableHead>
                            <TableHead className="w-[120px]">열람 시간</TableHead>
                            <TableHead className="w-[120px]">피싱 접속</TableHead>
                            <TableHead className="w-[120px]">정보 유출</TableHead>
                            <TableHead className="w-[80px]">누적</TableHead>
                            <TableHead className="w-[80px]">디바이스</TableHead>
                            <TableHead className="w-[60px]">삭제</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.targetResults.map((target) => (
                            <TableRow key={target.id}>
                              <TableCell>
                                <Input
                                  value={target.targetNumber}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "targetNumber", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="번호"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={target.name}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "name", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="이름"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={target.email}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "email", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="이메일"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={target.department}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "department", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="소속"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={target.readTime}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "readTime", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="열람 시간"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={target.phishingAccess}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "phishingAccess", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="피싱 접속"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={target.infoLeak}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "infoLeak", e.target.value)}
                                  className="h-8 w-full"
                                  placeholder="정보 유출"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={target.cumulativeInfection}
                                  onChange={(e) => handleUpdateTargetResult(target.id, "cumulativeInfection", parseInt(e.target.value) || 0)}
                                  className="h-8 w-full"
                                  placeholder="0"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={target.deviceType}
                                  onValueChange={(v) => handleUpdateTargetResult(target.id, "deviceType", v)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PC">PC</SelectItem>
                                    <SelectItem value="MOBILE">MOBILE</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveTargetResult(target.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-8 text-center">
                      <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        대상별 훈련 결과가 없습니다.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        보안사고/사이버공격 훈련의 경우 대상자별 결과를 입력할 수 있습니다.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("scenario")}>
                      이전: 시나리오 및 결과
                    </Button>
                    <Button onClick={handleSubmit}>
                      <Save className="mr-2 h-4 w-4" />
                      보고서 저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      훈련 이력 (비상유형별)
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={historyFilter} onValueChange={setHistoryFilter}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="비상유형 필터" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체 보기</SelectItem>
                          {EMERGENCY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredDrills.length === 0 ? (
                    <div className="py-8 text-center">
                      <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        {historyFilter === "all"
                          ? "훈련 기록이 없습니다."
                          : `${getEmergencyTypeLabel(historyFilter)} 유형의 훈련 기록이 없습니다.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Summary by Emergency Type */}
                      {historyFilter === "all" && (
                        <div className="mb-6 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                          {EMERGENCY_TYPES.map((type) => {
                            const count = drills.filter((d) => d.emergencyType === type.value).length;
                            return (
                              <div
                                key={type.value}
                                className={`cursor-pointer rounded-lg border p-3 transition-all hover:border-primary ${
                                  count > 0 ? "bg-background" : "bg-muted/30"
                                }`}
                                onClick={() => setHistoryFilter(type.value)}
                              >
                                <div className="text-lg font-bold">{count}건</div>
                                <div className="text-sm text-muted-foreground">{type.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>훈련일자</TableHead>
                            <TableHead>훈련명</TableHead>
                            <TableHead>비상유형</TableHead>
                            <TableHead>훈련장소</TableHead>
                            <TableHead className="text-right">참여인원</TableHead>
                            <TableHead>대응시간</TableHead>
                            <TableHead>효과성</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>관리</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDrills.map((drill) => (
                            <TableRow key={drill.id}>
                              <TableCell>{drill.drillDate}</TableCell>
                              <TableCell className="font-medium">{drill.drillName}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {getEmergencyTypeLabel(drill.emergencyType)}
                                </Badge>
                              </TableCell>
                              <TableCell>{drill.drillLocation || "-"}</TableCell>
                              <TableCell className="text-right">{drill.participantCount}명</TableCell>
                              <TableCell>{drill.responseTime || "-"}</TableCell>
                              <TableCell>
                                {drill.effectivenessRating ? (
                                  getEffectivenessBadge(drill.effectivenessRating)
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(drill.status)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDrill(drill)}
                                >
                                  상세보기
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
        </CardContent>
      </Card>
    </div>
  );
}
