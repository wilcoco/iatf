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
import {
  Building2,
  BarChart3,
  AlertTriangle,
  History,
  Plus,
  Save,
  Search,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Types
interface ExternalProvider {
  id: number;
  providerCode: string;
  providerName: string;
  providerType: "manufacturing" | "service" | "logistics" | "inspection";
  mainProducts: string;
  certifications: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  registrationDate: string;
  status: "active" | "inactive" | "suspended";
}

interface PerformanceData {
  id: number;
  providerCode: string;
  providerName: string;
  month: string;
  ppm: number;
  defectRate: number;
  deliveryRate: number;
  claimResponseTime: number; // days
  claimResolutionRate: number;
}

interface RiskAssessment {
  id: number;
  providerCode: string;
  providerName: string;
  riskFactor: string;
  riskLevel: "high" | "medium" | "low";
  impact: string;
  probability: string;
  responsePlan: string;
  assessmentDate: string;
  nextReviewDate: string;
}

interface ManagementHistory {
  id: number;
  providerCode: string;
  providerName: string;
  activityType: string;
  description: string;
  performedBy: string;
  performedDate: string;
  result: string;
}

// Sample data
const sampleProviders: ExternalProvider[] = [
  {
    id: 1,
    providerCode: "EXT-001",
    providerName: "ABC 전자부품",
    providerType: "manufacturing",
    mainProducts: "PCB, 전자부품, 커넥터",
    certifications: ["ISO 9001", "IATF 16949"],
    contactPerson: "김담당",
    contactPhone: "02-1234-5678",
    contactEmail: "contact@abc-parts.co.kr",
    registrationDate: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    providerCode: "EXT-002",
    providerName: "XYZ 물류",
    providerType: "logistics",
    mainProducts: "입출고 물류, 창고관리",
    certifications: ["ISO 9001"],
    contactPerson: "이물류",
    contactPhone: "031-9876-5432",
    contactEmail: "logistics@xyz.co.kr",
    registrationDate: "2024-03-20",
    status: "active",
  },
  {
    id: 3,
    providerCode: "EXT-003",
    providerName: "검사연구소",
    providerType: "inspection",
    mainProducts: "재료검사, 치수측정, 환경시험",
    certifications: ["ISO 17025", "KOLAS"],
    contactPerson: "박검사",
    contactPhone: "02-5555-1234",
    contactEmail: "test@lab.co.kr",
    registrationDate: "2023-11-10",
    status: "active",
  },
  {
    id: 4,
    providerCode: "EXT-004",
    providerName: "기술서비스",
    providerType: "service",
    mainProducts: "설비유지보수, 기술지원",
    certifications: ["ISO 9001"],
    contactPerson: "최기술",
    contactPhone: "032-3333-4444",
    contactEmail: "service@tech.co.kr",
    registrationDate: "2024-06-01",
    status: "inactive",
  },
];

const samplePerformance: PerformanceData[] = [
  { id: 1, providerCode: "EXT-001", providerName: "ABC 전자부품", month: "2026-01", ppm: 150, defectRate: 0.8, deliveryRate: 98.5, claimResponseTime: 2, claimResolutionRate: 95 },
  { id: 2, providerCode: "EXT-001", providerName: "ABC 전자부품", month: "2026-02", ppm: 120, defectRate: 0.6, deliveryRate: 99.0, claimResponseTime: 1.5, claimResolutionRate: 98 },
  { id: 3, providerCode: "EXT-001", providerName: "ABC 전자부품", month: "2026-03", ppm: 100, defectRate: 0.5, deliveryRate: 99.2, claimResponseTime: 1, claimResolutionRate: 100 },
  { id: 4, providerCode: "EXT-002", providerName: "XYZ 물류", month: "2026-01", ppm: 0, defectRate: 0, deliveryRate: 97.0, claimResponseTime: 3, claimResolutionRate: 90 },
  { id: 5, providerCode: "EXT-002", providerName: "XYZ 물류", month: "2026-02", ppm: 0, defectRate: 0, deliveryRate: 98.5, claimResponseTime: 2, claimResolutionRate: 95 },
  { id: 6, providerCode: "EXT-002", providerName: "XYZ 물류", month: "2026-03", ppm: 0, defectRate: 0, deliveryRate: 99.0, claimResponseTime: 1.5, claimResolutionRate: 98 },
  { id: 7, providerCode: "EXT-003", providerName: "검사연구소", month: "2026-01", ppm: 0, defectRate: 0, deliveryRate: 100, claimResponseTime: 1, claimResolutionRate: 100 },
  { id: 8, providerCode: "EXT-003", providerName: "검사연구소", month: "2026-02", ppm: 0, defectRate: 0, deliveryRate: 100, claimResponseTime: 1, claimResolutionRate: 100 },
  { id: 9, providerCode: "EXT-003", providerName: "검사연구소", month: "2026-03", ppm: 0, defectRate: 0, deliveryRate: 100, claimResponseTime: 0.5, claimResolutionRate: 100 },
];

const sampleRisks: RiskAssessment[] = [
  {
    id: 1,
    providerCode: "EXT-001",
    providerName: "ABC 전자부품",
    riskFactor: "단일 공급원 의존",
    riskLevel: "high",
    impact: "공급 중단시 생산 차질",
    probability: "중간",
    responsePlan: "대체 공급업체 발굴 및 승인 진행 (2차 공급원 확보)",
    assessmentDate: "2026-03-15",
    nextReviewDate: "2026-06-15",
  },
  {
    id: 2,
    providerCode: "EXT-001",
    providerName: "ABC 전자부품",
    riskFactor: "품질 변동성",
    riskLevel: "medium",
    impact: "입고불량 증가",
    probability: "낮음",
    responsePlan: "월별 품질 모니터링 강화 및 정기 현장 감사",
    assessmentDate: "2026-03-15",
    nextReviewDate: "2026-06-15",
  },
  {
    id: 3,
    providerCode: "EXT-002",
    providerName: "XYZ 물류",
    riskFactor: "물류 지연 리스크",
    riskLevel: "medium",
    impact: "납기 지연",
    probability: "중간",
    responsePlan: "비상 물류 협력업체 계약, 안전재고 확보",
    assessmentDate: "2026-02-20",
    nextReviewDate: "2026-05-20",
  },
  {
    id: 4,
    providerCode: "EXT-004",
    providerName: "기술서비스",
    riskFactor: "서비스 품질 저하",
    riskLevel: "low",
    impact: "설비 가동률 저하",
    probability: "낮음",
    responsePlan: "서비스 수준 협약(SLA) 강화 및 대체 업체 확보",
    assessmentDate: "2026-01-10",
    nextReviewDate: "2026-07-10",
  },
];

const sampleHistory: ManagementHistory[] = [
  {
    id: 1,
    providerCode: "EXT-001",
    providerName: "ABC 전자부품",
    activityType: "현장 감사",
    description: "연간 정기 품질 감사 실시",
    performedBy: "김품질",
    performedDate: "2026-03-10",
    result: "적합 (경미한 부적합 2건 시정조치 완료)",
  },
  {
    id: 2,
    providerCode: "EXT-001",
    providerName: "ABC 전자부품",
    activityType: "인증 갱신",
    description: "IATF 16949 인증 갱신 확인",
    performedBy: "이인증",
    performedDate: "2026-02-15",
    result: "인증 유효 (유효기간: 2029-02-14)",
  },
  {
    id: 3,
    providerCode: "EXT-002",
    providerName: "XYZ 물류",
    activityType: "계약 검토",
    description: "연간 물류 서비스 계약 갱신 검토",
    performedBy: "박구매",
    performedDate: "2026-03-01",
    result: "계약 갱신 (단가 2% 인하 협의)",
  },
  {
    id: 4,
    providerCode: "EXT-003",
    providerName: "검사연구소",
    activityType: "역량 평가",
    description: "시험 역량 및 장비 현황 점검",
    performedBy: "최기술",
    performedDate: "2026-01-20",
    result: "우수 (신규 시험 항목 추가 가능)",
  },
  {
    id: 5,
    providerCode: "EXT-004",
    providerName: "기술서비스",
    activityType: "성과 검토",
    description: "분기별 서비스 성과 검토 회의",
    performedBy: "김담당",
    performedDate: "2026-04-05",
    result: "개선 필요 (응답 시간 지연 문제 제기)",
  },
];

const providerTypeLabels: Record<string, string> = {
  manufacturing: "제조",
  service: "서비스",
  logistics: "물류",
  inspection: "검사",
};

const statusLabels: Record<string, string> = {
  active: "활성",
  inactive: "비활성",
  suspended: "중지",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
};

const riskLevelLabels: Record<string, string> = {
  high: "높음",
  medium: "중간",
  low: "낮음",
};

const riskLevelColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

// Provider Registration Form
interface ProviderFormData {
  providerCode: string;
  providerName: string;
  providerType: string;
  mainProducts: string;
  certifications: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

const initialFormData: ProviderFormData = {
  providerCode: "",
  providerName: "",
  providerType: "",
  mainProducts: "",
  certifications: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
};

export default function ExternalProviderControlPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [providers] = useState<ExternalProvider[]>(sampleProviders);
  const [performance] = useState<PerformanceData[]>(samplePerformance);
  const [risks] = useState<RiskAssessment[]>(sampleRisks);
  const [history] = useState<ManagementHistory[]>(sampleHistory);
  const [formData, setFormData] = useState<ProviderFormData>(initialFormData);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateField = <K extends keyof ProviderFormData>(
    field: K,
    value: ProviderFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateProviderCode = () => {
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("providerCode", `EXT-${random}`);
  };

  const handleSave = () => {
    console.log("Saving provider data:", formData);
    alert("외부 제공자 정보가 저장되었습니다.");
  };

  const filteredProviders = providers.filter(
    (p) =>
      p.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.providerCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPerformance = selectedProvider
    ? performance.filter((p) => p.providerCode === selectedProvider)
    : performance;

  const filteredRisks = selectedProvider
    ? risks.filter((r) => r.providerCode === selectedProvider)
    : risks;

  const filteredHistory = selectedProvider
    ? history.filter((h) => h.providerCode === selectedProvider)
    : history;

  // Calculate performance trend (comparing last 2 months)
  const getPerformanceTrend = (providerCode: string, metric: keyof PerformanceData) => {
    const providerData = performance
      .filter((p) => p.providerCode === providerCode)
      .sort((a, b) => b.month.localeCompare(a.month));

    if (providerData.length < 2) return null;

    const current = providerData[0][metric] as number;
    const previous = providerData[1][metric] as number;

    if (metric === "ppm" || metric === "defectRate" || metric === "claimResponseTime") {
      // Lower is better
      return current < previous ? "improving" : current > previous ? "declining" : "stable";
    } else {
      // Higher is better
      return current > previous ? "improving" : current < previous ? "declining" : "stable";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">외부 제공자 관리</h1>
          <p className="text-muted-foreground">
            IATF 16949 기반 외부 제공자 등록, 성과 모니터링 및 리스크 관리
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <Building2 className="mr-2 h-4 w-4" />
            외부 제공자 등록
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="mr-2 h-4 w-4" />
            성과 모니터링
          </TabsTrigger>
          <TabsTrigger value="risk">
            <AlertTriangle className="mr-2 h-4 w-4" />
            리스크 평가
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            관리 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Provider Registration */}
        <TabsContent value="registration">
          <div className="space-y-6">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  외부 제공자 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="providerCode">업체코드</Label>
                    <div className="flex gap-2">
                      <Input
                        id="providerCode"
                        value={formData.providerCode}
                        onChange={(e) => updateField("providerCode", e.target.value)}
                        placeholder="EXT-XXX"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateProviderCode}
                        className="shrink-0"
                      >
                        자동
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="providerName">업체명</Label>
                    <Input
                      id="providerName"
                      value={formData.providerName}
                      onChange={(e) => updateField("providerName", e.target.value)}
                      placeholder="업체명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>제공유형</Label>
                    <Select
                      value={formData.providerType}
                      onValueChange={(value) => updateField("providerType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">제조</SelectItem>
                        <SelectItem value="service">서비스</SelectItem>
                        <SelectItem value="logistics">물류</SelectItem>
                        <SelectItem value="inspection">검사</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">품질인증 (ISO/IATF)</Label>
                    <Input
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => updateField("certifications", e.target.value)}
                      placeholder="ISO 9001, IATF 16949"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="mainProducts">주요 제공 품목/서비스</Label>
                    <Input
                      id="mainProducts"
                      value={formData.mainProducts}
                      onChange={(e) => updateField("mainProducts", e.target.value)}
                      placeholder="주요 제공 품목 또는 서비스 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">담당자</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => updateField("contactPerson", e.target.value)}
                      placeholder="담당자명"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">연락처</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                      placeholder="02-1234-5678"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="contactEmail">이메일</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    등록된 외부 제공자
                  </span>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체코드</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead>제공유형</TableHead>
                      <TableHead>주요 품목/서비스</TableHead>
                      <TableHead>품질인증</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>연락처</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-mono">{provider.providerCode}</TableCell>
                        <TableCell className="font-medium">{provider.providerName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {providerTypeLabels[provider.providerType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{provider.mainProducts}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {provider.certifications.map((cert, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{provider.contactPerson}</TableCell>
                        <TableCell>{provider.contactPhone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[provider.status]}`}>
                            {statusLabels[provider.status]}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Performance Monitoring */}
        <TabsContent value="performance">
          <div className="space-y-6">
            {/* Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  성과 모니터링
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label>외부 제공자 선택</Label>
                    <Select
                      value={selectedProvider}
                      onValueChange={setSelectedProvider}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">전체</SelectItem>
                        {providers.map((p) => (
                          <SelectItem key={p.providerCode} value={p.providerCode}>
                            {p.providerName} ({p.providerCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평균 PPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(filteredPerformance.reduce((sum, p) => sum + p.ppm, 0) / filteredPerformance.length || 0).toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">품질 성과 지표</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평균 불량률
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(filteredPerformance.reduce((sum, p) => sum + p.defectRate, 0) / filteredPerformance.length || 0).toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">입고 불량률</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평균 납기준수율
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(filteredPerformance.reduce((sum, p) => sum + p.deliveryRate, 0) / filteredPerformance.length || 0).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">납기 성과</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    클레임 처리율
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(filteredPerformance.reduce((sum, p) => sum + p.claimResolutionRate, 0) / filteredPerformance.length || 0).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">대응 성과</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>월별 성과 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체코드</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead className="text-right">PPM</TableHead>
                      <TableHead className="text-right">불량률 (%)</TableHead>
                      <TableHead className="text-right">납기준수율 (%)</TableHead>
                      <TableHead className="text-right">클레임 응답 (일)</TableHead>
                      <TableHead className="text-right">클레임 처리율 (%)</TableHead>
                      <TableHead>추이</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPerformance.map((perf) => {
                      const trend = getPerformanceTrend(perf.providerCode, "deliveryRate");
                      return (
                        <TableRow key={perf.id}>
                          <TableCell className="font-mono">{perf.providerCode}</TableCell>
                          <TableCell className="font-medium">{perf.providerName}</TableCell>
                          <TableCell>{perf.month}</TableCell>
                          <TableCell className="text-right">{perf.ppm}</TableCell>
                          <TableCell className="text-right">{perf.defectRate}</TableCell>
                          <TableCell className="text-right">{perf.deliveryRate}</TableCell>
                          <TableCell className="text-right">{perf.claimResponseTime}</TableCell>
                          <TableCell className="text-right">{perf.claimResolutionRate}</TableCell>
                          <TableCell>
                            {trend === "improving" && (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            )}
                            {trend === "declining" && (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Risk Assessment */}
        <TabsContent value="risk">
          <div className="space-y-6">
            {/* Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    고위험
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {risks.filter((r) => r.riskLevel === "high").length}
                  </div>
                  <p className="text-xs text-muted-foreground">즉각적 조치 필요</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    중위험
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {risks.filter((r) => r.riskLevel === "medium").length}
                  </div>
                  <p className="text-xs text-muted-foreground">모니터링 필요</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    저위험
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {risks.filter((r) => r.riskLevel === "low").length}
                  </div>
                  <p className="text-xs text-muted-foreground">정상 관리</p>
                </CardContent>
              </Card>
            </div>

            {/* Risk Assessment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  리스크 평가 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>외부 제공자</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((p) => (
                          <SelectItem key={p.providerCode} value={p.providerCode}>
                            {p.providerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskFactor">리스크 요소</Label>
                    <Input id="riskFactor" placeholder="리스크 요소 입력" />
                  </div>

                  <div className="space-y-2">
                    <Label>리스크 수준</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="수준 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">높음</SelectItem>
                        <SelectItem value="medium">중간</SelectItem>
                        <SelectItem value="low">낮음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact">영향</Label>
                    <Input id="impact" placeholder="리스크 발생시 영향" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probability">발생 가능성</Label>
                    <Input id="probability" placeholder="높음/중간/낮음" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextReviewDate">다음 검토일</Label>
                    <Input id="nextReviewDate" type="date" />
                  </div>

                  <div className="space-y-2 lg:col-span-3">
                    <Label htmlFor="responsePlan">대응 계획</Label>
                    <Textarea
                      id="responsePlan"
                      placeholder="리스크 대응 계획을 상세히 기재하세요"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk List */}
            <Card>
              <CardHeader>
                <CardTitle>리스크 평가 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체코드</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead>리스크 요소</TableHead>
                      <TableHead>수준</TableHead>
                      <TableHead>영향</TableHead>
                      <TableHead>발생 가능성</TableHead>
                      <TableHead className="max-w-xs">대응 계획</TableHead>
                      <TableHead>평가일</TableHead>
                      <TableHead>다음 검토일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRisks.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell className="font-mono">{risk.providerCode}</TableCell>
                        <TableCell className="font-medium">{risk.providerName}</TableCell>
                        <TableCell>{risk.riskFactor}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskLevelColors[risk.riskLevel]}`}>
                            {riskLevelLabels[risk.riskLevel]}
                          </span>
                        </TableCell>
                        <TableCell>{risk.impact}</TableCell>
                        <TableCell>{risk.probability}</TableCell>
                        <TableCell className="max-w-xs truncate" title={risk.responsePlan}>
                          {risk.responsePlan}
                        </TableCell>
                        <TableCell>{risk.assessmentDate}</TableCell>
                        <TableCell>{risk.nextReviewDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Management History */}
        <TabsContent value="history">
          <div className="space-y-6">
            {/* Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  관리 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label>외부 제공자 선택</Label>
                    <Select
                      value={selectedProvider}
                      onValueChange={setSelectedProvider}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">전체</SelectItem>
                        {providers.map((p) => (
                          <SelectItem key={p.providerCode} value={p.providerCode}>
                            {p.providerName} ({p.providerCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle>관리 활동 이력</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredHistory.length === 0 ? (
                  <p className="text-muted-foreground">등록된 관리 이력이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>업체코드</TableHead>
                        <TableHead>업체명</TableHead>
                        <TableHead>활동유형</TableHead>
                        <TableHead>내용</TableHead>
                        <TableHead>수행자</TableHead>
                        <TableHead>수행일</TableHead>
                        <TableHead>결과</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono">{item.providerCode}</TableCell>
                          <TableCell className="font-medium">{item.providerName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.activityType}</Badge>
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.performedBy}</TableCell>
                          <TableCell>{item.performedDate}</TableCell>
                          <TableCell className="max-w-xs truncate" title={item.result}>
                            {item.result}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Add History Form */}
            <Card>
              <CardHeader>
                <CardTitle>관리 이력 추가</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>외부 제공자</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((p) => (
                          <SelectItem key={p.providerCode} value={p.providerCode}>
                            {p.providerName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>활동유형</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audit">현장 감사</SelectItem>
                        <SelectItem value="certification">인증 갱신</SelectItem>
                        <SelectItem value="contract">계약 검토</SelectItem>
                        <SelectItem value="evaluation">역량 평가</SelectItem>
                        <SelectItem value="review">성과 검토</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performer">수행자</Label>
                    <Input id="performer" placeholder="수행자명" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performedDate">수행일</Label>
                    <Input id="performedDate" type="date" />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="historyDescription">내용</Label>
                    <Input id="historyDescription" placeholder="활동 내용 입력" />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="historyResult">결과</Label>
                    <Input id="historyResult" placeholder="활동 결과 입력" />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    이력 추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
