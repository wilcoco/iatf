"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  TrendingUp,
  ClipboardCheck,
  History,
  Search,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Types
interface Supplier {
  id: number;
  code: string;
  name: string;
  representative: string;
  contact: string;
  email: string;
  address: string;
  mainItems: string;
  registrationDate: string;
  status: "active" | "inactive" | "probation";
  grade: "A" | "B" | "C" | "D";
}

interface DeliveryPerformance {
  id: number;
  supplierCode: string;
  supplierName: string;
  yearMonth: string;
  totalOrders: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  onTimeRate: number;
  emergencyOrders: number;
  emergencyResponded: number;
  emergencyResponseRate: number;
  avgDelayDays: number;
}

interface InspectionPlan {
  id: number;
  year: number;
  quarter: string;
  supplierCode: string;
  supplierName: string;
  inspectionType: "regular" | "special" | "initial";
  scheduledDate: string;
  inspector: string;
  status: "planned" | "completed" | "postponed" | "cancelled";
  remarks: string;
}

interface PerformanceHistory {
  id: number;
  supplierCode: string;
  supplierName: string;
  evaluationDate: string;
  period: string;
  onTimeRate: number;
  emergencyResponseRate: number;
  delayCount: number;
  grade: "A" | "B" | "C" | "D";
  action: string;
  evaluator: string;
}

// Sample data
const sampleSuppliers: Supplier[] = [
  {
    id: 1,
    code: "SUP-001",
    name: "(주)대성정밀",
    representative: "김대성",
    contact: "031-123-4567",
    email: "daesung@example.com",
    address: "경기도 화성시 동탄산단로 123",
    mainItems: "정밀 가공부품, 샤프트류",
    registrationDate: "2020-03-15",
    status: "active",
    grade: "A",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "(주)한국부품",
    representative: "이한국",
    contact: "032-456-7890",
    email: "hankook@example.com",
    address: "인천시 남동구 논현동 456",
    mainItems: "플라스틱 사출물, 케이스류",
    registrationDate: "2019-07-22",
    status: "active",
    grade: "B",
  },
  {
    id: 3,
    code: "SUP-003",
    name: "삼성전자부품(주)",
    representative: "박삼성",
    contact: "02-789-1234",
    email: "samsung@example.com",
    address: "서울시 강남구 테헤란로 789",
    mainItems: "전자부품, PCB",
    registrationDate: "2018-11-05",
    status: "active",
    grade: "A",
  },
  {
    id: 4,
    code: "SUP-004",
    name: "(주)우진금속",
    representative: "최우진",
    contact: "041-234-5678",
    email: "woojin@example.com",
    address: "충남 천안시 서북구 직산읍",
    mainItems: "금속 프레스부품, 브라켓",
    registrationDate: "2021-02-10",
    status: "probation",
    grade: "C",
  },
  {
    id: 5,
    code: "SUP-005",
    name: "동양산업(주)",
    representative: "정동양",
    contact: "055-345-6789",
    email: "dongyang@example.com",
    address: "경남 창원시 성산구 완암동",
    mainItems: "고무 패킹, 실링류",
    registrationDate: "2020-08-30",
    status: "active",
    grade: "B",
  },
];

const sampleDeliveryPerformance: DeliveryPerformance[] = [
  {
    id: 1,
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    yearMonth: "2025-01",
    totalOrders: 45,
    onTimeDeliveries: 44,
    lateDeliveries: 1,
    onTimeRate: 97.8,
    emergencyOrders: 5,
    emergencyResponded: 5,
    emergencyResponseRate: 100,
    avgDelayDays: 0.5,
  },
  {
    id: 2,
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    yearMonth: "2025-01",
    totalOrders: 38,
    onTimeDeliveries: 35,
    lateDeliveries: 3,
    onTimeRate: 92.1,
    emergencyOrders: 4,
    emergencyResponded: 3,
    emergencyResponseRate: 75,
    avgDelayDays: 1.2,
  },
  {
    id: 3,
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    yearMonth: "2025-01",
    totalOrders: 62,
    onTimeDeliveries: 61,
    lateDeliveries: 1,
    onTimeRate: 98.4,
    emergencyOrders: 8,
    emergencyResponded: 8,
    emergencyResponseRate: 100,
    avgDelayDays: 0.2,
  },
  {
    id: 4,
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    yearMonth: "2025-01",
    totalOrders: 28,
    onTimeDeliveries: 22,
    lateDeliveries: 6,
    onTimeRate: 78.6,
    emergencyOrders: 3,
    emergencyResponded: 1,
    emergencyResponseRate: 33.3,
    avgDelayDays: 3.5,
  },
  {
    id: 5,
    supplierCode: "SUP-005",
    supplierName: "동양산업(주)",
    yearMonth: "2025-01",
    totalOrders: 33,
    onTimeDeliveries: 31,
    lateDeliveries: 2,
    onTimeRate: 93.9,
    emergencyOrders: 2,
    emergencyResponded: 2,
    emergencyResponseRate: 100,
    avgDelayDays: 0.8,
  },
];

const sampleInspectionPlans: InspectionPlan[] = [
  {
    id: 1,
    year: 2025,
    quarter: "Q1",
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    inspectionType: "regular",
    scheduledDate: "2025-02-15",
    inspector: "품질팀 김검사",
    status: "completed",
    remarks: "정기점검 완료",
  },
  {
    id: 2,
    year: 2025,
    quarter: "Q1",
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    inspectionType: "special",
    scheduledDate: "2025-02-20",
    inspector: "품질팀 이점검",
    status: "completed",
    remarks: "납기지연 관련 특별점검",
  },
  {
    id: 3,
    year: 2025,
    quarter: "Q2",
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    inspectionType: "regular",
    scheduledDate: "2025-05-10",
    inspector: "품질팀 박관리",
    status: "planned",
    remarks: "",
  },
  {
    id: 4,
    year: 2025,
    quarter: "Q2",
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    inspectionType: "regular",
    scheduledDate: "2025-05-25",
    inspector: "품질팀 김검사",
    status: "planned",
    remarks: "",
  },
  {
    id: 5,
    year: 2025,
    quarter: "Q3",
    supplierCode: "SUP-005",
    supplierName: "동양산업(주)",
    inspectionType: "regular",
    scheduledDate: "2025-08-15",
    inspector: "품질팀 이점검",
    status: "planned",
    remarks: "",
  },
];

const samplePerformanceHistory: PerformanceHistory[] = [
  {
    id: 1,
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    evaluationDate: "2025-01-31",
    period: "2025년 1월",
    onTimeRate: 97.8,
    emergencyResponseRate: 100,
    delayCount: 1,
    grade: "A",
    action: "우수업체 유지",
    evaluator: "구매팀 홍길동",
  },
  {
    id: 2,
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    evaluationDate: "2025-01-31",
    period: "2025년 1월",
    onTimeRate: 78.6,
    emergencyResponseRate: 33.3,
    delayCount: 6,
    grade: "D",
    action: "시정조치 요구",
    evaluator: "구매팀 홍길동",
  },
  {
    id: 3,
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    evaluationDate: "2024-12-31",
    period: "2024년 12월",
    onTimeRate: 99.1,
    emergencyResponseRate: 100,
    delayCount: 0,
    grade: "A",
    action: "우수업체 인증",
    evaluator: "구매팀 김철수",
  },
  {
    id: 4,
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    evaluationDate: "2024-12-31",
    period: "2024년 12월",
    onTimeRate: 91.5,
    emergencyResponseRate: 80,
    delayCount: 4,
    grade: "B",
    action: "개선권고",
    evaluator: "구매팀 김철수",
  },
];

export default function SupplierDeliveryPerformancePage() {
  const [activeTab, setActiveTab] = useState("supplier-status");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("2025");
  const [quarterFilter, setQuarterFilter] = useState("all");

  // Calculate summary metrics
  const totalSuppliers = sampleSuppliers.filter((s) => s.status === "active").length;
  const avgOnTimeRate =
    sampleDeliveryPerformance.reduce((sum, p) => sum + p.onTimeRate, 0) /
    sampleDeliveryPerformance.length;
  const totalDelays = sampleDeliveryPerformance.reduce((sum, p) => sum + p.lateDeliveries, 0);
  const avgEmergencyRate =
    sampleDeliveryPerformance.reduce((sum, p) => sum + p.emergencyResponseRate, 0) /
    sampleDeliveryPerformance.length;

  // Filter suppliers by search term
  const filteredSuppliers = sampleSuppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mainItems.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter inspection plans
  const filteredInspectionPlans = sampleInspectionPlans.filter((plan) => {
    const yearMatch = plan.year.toString() === yearFilter;
    const quarterMatch = quarterFilter === "all" || plan.quarter === quarterFilter;
    return yearMatch && quarterMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">활성</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">비활성</Badge>;
      case "probation":
        return <Badge className="bg-yellow-500">관찰대상</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A":
        return <Badge className="bg-green-600">A등급</Badge>;
      case "B":
        return <Badge className="bg-blue-500">B등급</Badge>;
      case "C":
        return <Badge className="bg-yellow-500">C등급</Badge>;
      case "D":
        return <Badge className="bg-red-500">D등급</Badge>;
      default:
        return <Badge>{grade}</Badge>;
    }
  };

  const getInspectionStatusBadge = (status: string) => {
    switch (status) {
      case "planned":
        return <Badge className="bg-blue-500">예정</Badge>;
      case "completed":
        return <Badge className="bg-green-500">완료</Badge>;
      case "postponed":
        return <Badge className="bg-yellow-500">연기</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">취소</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInspectionTypeBadge = (type: string) => {
    switch (type) {
      case "regular":
        return <Badge variant="outline">정기점검</Badge>;
      case "special":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">특별점검</Badge>;
      case "initial":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">초도점검</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-blue-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">(주)캠스 부품 공급업체 현황</h1>
          <p className="text-muted-foreground">공급업체 납기 성과 및 점검 관리</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 공급업체</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}개사</div>
            <p className="text-xs text-muted-foreground">전체 등록업체 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 납기준수율</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRateColor(avgOnTimeRate)}`}>
              {avgOnTimeRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">목표: 95% 이상</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">납기지연 건수</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalDelays}건</div>
            <p className="text-xs text-muted-foreground">당월 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">긴급납품 대응률</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRateColor(avgEmergencyRate)}`}>
              {avgEmergencyRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">목표: 90% 이상</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="supplier-status" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            공급업체 현황
          </TabsTrigger>
          <TabsTrigger value="delivery-performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            납기 성과
          </TabsTrigger>
          <TabsTrigger value="inspection-plan" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            점검 계획
          </TabsTrigger>
          <TabsTrigger value="performance-history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            성과 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 공급업체 현황 */}
        <TabsContent value="supplier-status">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>공급업체 목록</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="업체명, 코드, 품목 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    업체 등록
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead>대표자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>주요 납품품목</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>등급</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.code}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.representative}</TableCell>
                      <TableCell>
                        <div>
                          <div>{supplier.contact}</div>
                          <div className="text-xs text-muted-foreground">{supplier.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48 truncate">{supplier.mainItems}</TableCell>
                      <TableCell>{supplier.registrationDate}</TableCell>
                      <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                      <TableCell>{getGradeBadge(supplier.grade)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 납기 성과 */}
        <TabsContent value="delivery-performance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>납기 성과 현황</CardTitle>
                <div className="flex gap-2">
                  <Select value="2025-01" onValueChange={() => {}}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="기준년월" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-01">2025년 1월</SelectItem>
                      <SelectItem value="2024-12">2024년 12월</SelectItem>
                      <SelectItem value="2024-11">2024년 11월</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    실적 등록
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead className="text-center">발주건수</TableHead>
                    <TableHead className="text-center">정시납품</TableHead>
                    <TableHead className="text-center">지연건수</TableHead>
                    <TableHead className="text-center">납기준수율</TableHead>
                    <TableHead className="text-center">긴급대응율</TableHead>
                    <TableHead className="text-center">평균지연일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDeliveryPerformance.map((perf) => (
                    <TableRow key={perf.id}>
                      <TableCell className="font-medium">{perf.supplierCode}</TableCell>
                      <TableCell>{perf.supplierName}</TableCell>
                      <TableCell className="text-center">{perf.totalOrders}</TableCell>
                      <TableCell className="text-center text-green-600">
                        {perf.onTimeDeliveries}
                      </TableCell>
                      <TableCell className="text-center text-red-600">
                        {perf.lateDeliveries}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getRateColor(perf.onTimeRate)}`}>
                          {perf.onTimeRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getRateColor(perf.emergencyResponseRate)}`}>
                          {perf.emergencyResponseRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {perf.avgDelayDays > 0 ? (
                          <span className="text-yellow-600">{perf.avgDelayDays}일</span>
                        ) : (
                          <span className="text-green-600">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Performance Summary */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50">
                  <CardContent className="pt-4">
                    <div className="text-sm text-green-800 font-medium">우수업체 (95% 이상)</div>
                    <div className="text-2xl font-bold text-green-600">
                      {sampleDeliveryPerformance.filter((p) => p.onTimeRate >= 95).length}개사
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-50">
                  <CardContent className="pt-4">
                    <div className="text-sm text-yellow-800 font-medium">개선필요 (85-95%)</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {sampleDeliveryPerformance.filter((p) => p.onTimeRate >= 85 && p.onTimeRate < 95).length}개사
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="pt-4">
                    <div className="text-sm text-red-800 font-medium">조치필요 (85% 미만)</div>
                    <div className="text-2xl font-bold text-red-600">
                      {sampleDeliveryPerformance.filter((p) => p.onTimeRate < 85).length}개사
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 점검 계획 */}
        <TabsContent value="inspection-plan">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>2025년 점검계획 (Rev.05)</CardTitle>
                <div className="flex gap-2">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="년도" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2024">2024년</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="분기" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="Q1">1분기</SelectItem>
                      <SelectItem value="Q2">2분기</SelectItem>
                      <SelectItem value="Q3">3분기</SelectItem>
                      <SelectItem value="Q4">4분기</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    계획 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>년도</TableHead>
                    <TableHead>분기</TableHead>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead>점검유형</TableHead>
                    <TableHead>예정일</TableHead>
                    <TableHead>점검자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspectionPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>{plan.year}</TableCell>
                      <TableCell>{plan.quarter}</TableCell>
                      <TableCell className="font-medium">{plan.supplierCode}</TableCell>
                      <TableCell>{plan.supplierName}</TableCell>
                      <TableCell>{getInspectionTypeBadge(plan.inspectionType)}</TableCell>
                      <TableCell>{plan.scheduledDate}</TableCell>
                      <TableCell>{plan.inspector}</TableCell>
                      <TableCell>{getInspectionStatusBadge(plan.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{plan.remarks || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Inspection Plan Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">점검 현황 요약</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <div className="text-sm text-muted-foreground">전체 계획</div>
                    <div className="text-xl font-bold">{filteredInspectionPlans.length}건</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">완료</div>
                    <div className="text-xl font-bold text-green-600">
                      {filteredInspectionPlans.filter((p) => p.status === "completed").length}건
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">예정</div>
                    <div className="text-xl font-bold text-blue-600">
                      {filteredInspectionPlans.filter((p) => p.status === "planned").length}건
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">연기/취소</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {filteredInspectionPlans.filter((p) => p.status === "postponed" || p.status === "cancelled").length}건
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 성과 이력 */}
        <TabsContent value="performance-history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>납기 성과 평가 이력</CardTitle>
                <div className="flex gap-2">
                  <Input type="month" className="w-40" defaultValue="2025-01" />
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>평가일</TableHead>
                    <TableHead>평가기간</TableHead>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead className="text-center">납기준수율</TableHead>
                    <TableHead className="text-center">긴급대응율</TableHead>
                    <TableHead className="text-center">지연건수</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead>조치사항</TableHead>
                    <TableHead>평가자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samplePerformanceHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.evaluationDate}</TableCell>
                      <TableCell>{history.period}</TableCell>
                      <TableCell className="font-medium">{history.supplierCode}</TableCell>
                      <TableCell>{history.supplierName}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getRateColor(history.onTimeRate)}`}>
                          {history.onTimeRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getRateColor(history.emergencyResponseRate)}`}>
                          {history.emergencyResponseRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {history.delayCount > 0 ? (
                          <span className="text-red-600">{history.delayCount}건</span>
                        ) : (
                          <span className="text-green-600">0건</span>
                        )}
                      </TableCell>
                      <TableCell>{getGradeBadge(history.grade)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            history.action.includes("시정") || history.action.includes("조치")
                              ? "text-red-600"
                              : history.action.includes("우수")
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        >
                          {history.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{history.evaluator}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Grade Distribution */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">등급별 분포</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">A</Badge>
                    <span className="text-sm">
                      {samplePerformanceHistory.filter((h) => h.grade === "A").length}개사 - 우수
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500">B</Badge>
                    <span className="text-sm">
                      {samplePerformanceHistory.filter((h) => h.grade === "B").length}개사 - 양호
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500">C</Badge>
                    <span className="text-sm">
                      {samplePerformanceHistory.filter((h) => h.grade === "C").length}개사 - 보통
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">D</Badge>
                    <span className="text-sm">
                      {samplePerformanceHistory.filter((h) => h.grade === "D").length}개사 - 미흡
                    </span>
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
