"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp,
  Calendar,
  Trophy,
  Target,
  Plus,
  Save,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// Types
interface DeliveryRateEntry {
  id: number;
  supplierCode: string;
  supplierName: string;
  month: string;
  totalDeliveries: number; // 납품건수
  onTimeDeliveries: number; // 납기준수건수
  deliveryRate: number; // 인도성과율 = (납기준수건수/납품건수) × 100
  registeredDate: string;
  registeredBy: string;
}

interface MonthlyStatus {
  supplierCode: string;
  supplierName: string;
  jan: number | null;
  feb: number | null;
  mar: number | null;
  apr: number | null;
  may: number | null;
  jun: number | null;
  jul: number | null;
  aug: number | null;
  sep: number | null;
  oct: number | null;
  nov: number | null;
  dec: number | null;
  average: number;
}

interface SupplierRanking {
  rank: number;
  supplierCode: string;
  supplierName: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  averageRate: number;
  grade: "A" | "B" | "C" | "D";
  trend: "up" | "down" | "stable";
}

interface TargetVsActual {
  supplierCode: string;
  supplierName: string;
  targetRate: number;
  actualRate: number;
  gap: number;
  status: "achieved" | "not-achieved";
  action: string;
}

// Sample data for suppliers
const suppliers = [
  { code: "SUP-001", name: "(주)대성정밀" },
  { code: "SUP-002", name: "(주)한국부품" },
  { code: "SUP-003", name: "삼성전자부품(주)" },
  { code: "SUP-004", name: "(주)우진금속" },
  { code: "SUP-005", name: "동양산업(주)" },
  { code: "SUP-006", name: "(주)신화테크" },
  { code: "SUP-007", name: "대한플라스틱(주)" },
  { code: "SUP-008", name: "(주)미래산업" },
];

// Sample delivery rate entries
const sampleEntries: DeliveryRateEntry[] = [
  {
    id: 1,
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    month: "2025-01",
    totalDeliveries: 45,
    onTimeDeliveries: 44,
    deliveryRate: 97.8,
    registeredDate: "2025-02-03",
    registeredBy: "구매팀 홍길동",
  },
  {
    id: 2,
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    month: "2025-01",
    totalDeliveries: 38,
    onTimeDeliveries: 36,
    deliveryRate: 94.7,
    registeredDate: "2025-02-03",
    registeredBy: "구매팀 홍길동",
  },
  {
    id: 3,
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    month: "2025-01",
    totalDeliveries: 62,
    onTimeDeliveries: 61,
    deliveryRate: 98.4,
    registeredDate: "2025-02-03",
    registeredBy: "구매팀 김철수",
  },
  {
    id: 4,
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    month: "2025-01",
    totalDeliveries: 28,
    onTimeDeliveries: 22,
    deliveryRate: 78.6,
    registeredDate: "2025-02-03",
    registeredBy: "구매팀 김철수",
  },
  {
    id: 5,
    supplierCode: "SUP-005",
    supplierName: "동양산업(주)",
    month: "2025-01",
    totalDeliveries: 33,
    onTimeDeliveries: 31,
    deliveryRate: 93.9,
    registeredDate: "2025-02-03",
    registeredBy: "구매팀 홍길동",
  },
  {
    id: 6,
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    month: "2025-02",
    totalDeliveries: 52,
    onTimeDeliveries: 51,
    deliveryRate: 98.1,
    registeredDate: "2025-03-03",
    registeredBy: "구매팀 홍길동",
  },
  {
    id: 7,
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    month: "2025-02",
    totalDeliveries: 42,
    onTimeDeliveries: 40,
    deliveryRate: 95.2,
    registeredDate: "2025-03-03",
    registeredBy: "구매팀 홍길동",
  },
  {
    id: 8,
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    month: "2025-02",
    totalDeliveries: 58,
    onTimeDeliveries: 57,
    deliveryRate: 98.3,
    registeredDate: "2025-03-03",
    registeredBy: "구매팀 김철수",
  },
];

// Sample monthly status data
const sampleMonthlyStatus: MonthlyStatus[] = [
  {
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    jan: 97.8,
    feb: 98.1,
    mar: 97.5,
    apr: 98.3,
    may: 97.9,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 97.9,
  },
  {
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    jan: 94.7,
    feb: 95.2,
    mar: 93.8,
    apr: 95.6,
    may: 94.9,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 94.8,
  },
  {
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    jan: 98.4,
    feb: 98.3,
    mar: 99.1,
    apr: 98.7,
    may: 98.5,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 98.6,
  },
  {
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    jan: 78.6,
    feb: 82.3,
    mar: 85.1,
    apr: 88.4,
    may: 90.2,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 84.9,
  },
  {
    supplierCode: "SUP-005",
    supplierName: "동양산업(주)",
    jan: 93.9,
    feb: 95.1,
    mar: 94.5,
    apr: 96.2,
    may: 95.8,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 95.1,
  },
  {
    supplierCode: "SUP-006",
    supplierName: "(주)신화테크",
    jan: 96.5,
    feb: 97.2,
    mar: 96.8,
    apr: 97.5,
    may: 97.1,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 97.0,
  },
  {
    supplierCode: "SUP-007",
    supplierName: "대한플라스틱(주)",
    jan: 91.2,
    feb: 92.8,
    mar: 93.5,
    apr: 94.1,
    may: 93.9,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 93.1,
  },
  {
    supplierCode: "SUP-008",
    supplierName: "(주)미래산업",
    jan: 99.1,
    feb: 98.8,
    mar: 99.2,
    apr: 99.5,
    may: 99.0,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    oct: null,
    nov: null,
    dec: null,
    average: 99.1,
  },
];

// Sample ranking data
const sampleRankings: SupplierRanking[] = [
  {
    rank: 1,
    supplierCode: "SUP-008",
    supplierName: "(주)미래산업",
    totalDeliveries: 189,
    onTimeDeliveries: 187,
    averageRate: 99.1,
    grade: "A",
    trend: "stable",
  },
  {
    rank: 2,
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    totalDeliveries: 285,
    onTimeDeliveries: 281,
    averageRate: 98.6,
    grade: "A",
    trend: "up",
  },
  {
    rank: 3,
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    totalDeliveries: 245,
    onTimeDeliveries: 240,
    averageRate: 97.9,
    grade: "A",
    trend: "stable",
  },
  {
    rank: 4,
    supplierCode: "SUP-006",
    supplierName: "(주)신화테크",
    totalDeliveries: 156,
    onTimeDeliveries: 151,
    averageRate: 97.0,
    grade: "A",
    trend: "up",
  },
  {
    rank: 5,
    supplierCode: "SUP-005",
    supplierName: "동양산업(주)",
    totalDeliveries: 178,
    onTimeDeliveries: 169,
    averageRate: 95.1,
    grade: "B",
    trend: "up",
  },
  {
    rank: 6,
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    totalDeliveries: 198,
    onTimeDeliveries: 188,
    averageRate: 94.8,
    grade: "B",
    trend: "stable",
  },
  {
    rank: 7,
    supplierCode: "SUP-007",
    supplierName: "대한플라스틱(주)",
    totalDeliveries: 145,
    onTimeDeliveries: 135,
    averageRate: 93.1,
    grade: "C",
    trend: "up",
  },
  {
    rank: 8,
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    totalDeliveries: 134,
    onTimeDeliveries: 114,
    averageRate: 84.9,
    grade: "D",
    trend: "up",
  },
];

// Sample target vs actual data
const sampleTargetVsActual: TargetVsActual[] = [
  {
    supplierCode: "SUP-008",
    supplierName: "(주)미래산업",
    targetRate: 95,
    actualRate: 99.1,
    gap: 4.1,
    status: "achieved",
    action: "우수업체 인증",
  },
  {
    supplierCode: "SUP-003",
    supplierName: "삼성전자부품(주)",
    targetRate: 95,
    actualRate: 98.6,
    gap: 3.6,
    status: "achieved",
    action: "우수업체 유지",
  },
  {
    supplierCode: "SUP-001",
    supplierName: "(주)대성정밀",
    targetRate: 95,
    actualRate: 97.9,
    gap: 2.9,
    status: "achieved",
    action: "우수업체 유지",
  },
  {
    supplierCode: "SUP-006",
    supplierName: "(주)신화테크",
    targetRate: 95,
    actualRate: 97.0,
    gap: 2.0,
    status: "achieved",
    action: "우수업체 유지",
  },
  {
    supplierCode: "SUP-005",
    supplierName: "동양산업(주)",
    targetRate: 95,
    actualRate: 95.1,
    gap: 0.1,
    status: "achieved",
    action: "목표 달성",
  },
  {
    supplierCode: "SUP-002",
    supplierName: "(주)한국부품",
    targetRate: 95,
    actualRate: 94.8,
    gap: -0.2,
    status: "not-achieved",
    action: "개선 권고",
  },
  {
    supplierCode: "SUP-007",
    supplierName: "대한플라스틱(주)",
    targetRate: 95,
    actualRate: 93.1,
    gap: -1.9,
    status: "not-achieved",
    action: "시정조치 요구",
  },
  {
    supplierCode: "SUP-004",
    supplierName: "(주)우진금속",
    targetRate: 95,
    actualRate: 84.9,
    gap: -10.1,
    status: "not-achieved",
    action: "긴급 개선 요구 / 관찰대상",
  },
];

const TARGET_RATE = 95; // 인도성과율 목표 95% 이상

export default function SupplierDeliveryRatePage() {
  const [activeTab, setActiveTab] = useState("entry");
  const [entries, setEntries] = useState<DeliveryRateEntry[]>(sampleEntries);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("2025");

  // Form state for entry
  const [formData, setFormData] = useState({
    supplierCode: "",
    supplierName: "",
    month: "",
    totalDeliveries: 0,
    onTimeDeliveries: 0,
  });

  // Calculate delivery rate
  const calculateDeliveryRate = (total: number, onTime: number) => {
    if (total === 0) return 0;
    return Math.round((onTime / total) * 1000) / 10;
  };

  // Handle supplier selection
  const handleSupplierChange = (code: string) => {
    const supplier = suppliers.find((s) => s.code === code);
    if (supplier) {
      setFormData({
        ...formData,
        supplierCode: code,
        supplierName: supplier.name,
      });
    }
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!formData.supplierCode || !formData.month || formData.totalDeliveries === 0) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const deliveryRate = calculateDeliveryRate(
      formData.totalDeliveries,
      formData.onTimeDeliveries
    );

    const newEntry: DeliveryRateEntry = {
      id: Date.now(),
      supplierCode: formData.supplierCode,
      supplierName: formData.supplierName,
      month: formData.month,
      totalDeliveries: formData.totalDeliveries,
      onTimeDeliveries: formData.onTimeDeliveries,
      deliveryRate,
      registeredDate: new Date().toISOString().split("T")[0],
      registeredBy: "현재 사용자",
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      supplierCode: "",
      supplierName: "",
      month: "",
      totalDeliveries: 0,
      onTimeDeliveries: 0,
    });
    alert("인도성과율이 등록되었습니다.");
  };

  // Get rate color
  const getRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 90) return "text-blue-600";
    if (rate >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  // Get rate background color
  const getRateBgColor = (rate: number | null) => {
    if (rate === null) return "";
    if (rate >= 95) return "bg-green-50";
    if (rate >= 90) return "bg-blue-50";
    if (rate >= 85) return "bg-yellow-50";
    return "bg-red-50";
  };

  // Get grade badge
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

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <span className="text-green-600">↑</span>;
      case "down":
        return <span className="text-red-600">↓</span>;
      default:
        return <span className="text-gray-500">-</span>;
    }
  };

  // Filter entries
  const filteredEntries = entries.filter(
    (e) =>
      (e.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      e.month.startsWith(yearFilter)
  );

  // Calculate summary statistics
  const totalEntries = filteredEntries.length;
  const avgDeliveryRate =
    totalEntries > 0
      ? Math.round(
          (filteredEntries.reduce((sum, e) => sum + e.deliveryRate, 0) / totalEntries) * 10
        ) / 10
      : 0;
  const achievedTargetCount = filteredEntries.filter(
    (e) => e.deliveryRate >= TARGET_RATE
  ).length;
  const belowTargetCount = filteredEntries.filter(
    (e) => e.deliveryRate < TARGET_RATE
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            (주)캠스 공급자 인도성과율 현황(25년 1월~25년 12월)
          </h1>
          <p className="text-muted-foreground">
            2025년 공급자 인도성과율 관리 (목표: 95% 이상)
          </p>
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
            <CardTitle className="text-sm font-medium">등록 건수</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}건</div>
            <p className="text-xs text-muted-foreground">{yearFilter}년 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 인도성과율</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRateColor(avgDeliveryRate)}`}>
              {avgDeliveryRate}%
            </div>
            <p className="text-xs text-muted-foreground">목표: {TARGET_RATE}% 이상</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">목표 달성</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{achievedTargetCount}건</div>
            <p className="text-xs text-muted-foreground">95% 이상 달성</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">목표 미달</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{belowTargetCount}건</div>
            <p className="text-xs text-muted-foreground">개선 필요</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            인도성과율 입력
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            월별 현황
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            업체별 순위
          </TabsTrigger>
          <TabsTrigger value="target" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            목표 대비 실적
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 인도성과율 입력 */}
        <TabsContent value="entry">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  인도성과율 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>공급업체명 *</Label>
                  <Select
                    value={formData.supplierCode}
                    onValueChange={handleSupplierChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="공급업체 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>대상 월 *</Label>
                  <Input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>납품건수 *</Label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.totalDeliveries || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalDeliveries: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="총 납품 건수"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>납기준수건수 *</Label>
                    <Input
                      type="number"
                      min={0}
                      max={formData.totalDeliveries}
                      value={formData.onTimeDeliveries || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          onTimeDeliveries: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="납기 준수 건수"
                    />
                  </div>
                </div>

                {/* Calculated Rate Display */}
                {formData.totalDeliveries > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      인도성과율 = (납기준수건수 / 납품건수) x 100
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        ({formData.onTimeDeliveries} / {formData.totalDeliveries}) x 100 =
                      </span>
                      <span
                        className={`text-2xl font-bold ${getRateColor(
                          calculateDeliveryRate(
                            formData.totalDeliveries,
                            formData.onTimeDeliveries
                          )
                        )}`}
                      >
                        {calculateDeliveryRate(
                          formData.totalDeliveries,
                          formData.onTimeDeliveries
                        )}
                        %
                      </span>
                      {calculateDeliveryRate(
                        formData.totalDeliveries,
                        formData.onTimeDeliveries
                      ) >= TARGET_RATE ? (
                        <Badge className="bg-green-600">목표 달성</Badge>
                      ) : (
                        <Badge className="bg-red-500">목표 미달</Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button className="w-full" onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  등록
                </Button>
              </CardContent>
            </Card>

            {/* Entry History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>등록 이력</CardTitle>
                  <div className="flex gap-2">
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025년</SelectItem>
                        <SelectItem value="2024">2024년</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="업체 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-40"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>대상월</TableHead>
                        <TableHead>공급업체</TableHead>
                        <TableHead className="text-center">납품건수</TableHead>
                        <TableHead className="text-center">준수건수</TableHead>
                        <TableHead className="text-center">인도성과율</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.month}</TableCell>
                          <TableCell>{entry.supplierName}</TableCell>
                          <TableCell className="text-center">
                            {entry.totalDeliveries}
                          </TableCell>
                          <TableCell className="text-center">
                            {entry.onTimeDeliveries}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-semibold ${getRateColor(
                                entry.deliveryRate
                              )}`}
                            >
                              {entry.deliveryRate}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 월별 현황 */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{yearFilter}년 월별 인도성과율 현황</CardTitle>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 bg-green-50 border rounded"></span>
                    <span>95% 이상</span>
                    <span className="w-4 h-4 bg-blue-50 border rounded"></span>
                    <span>90-95%</span>
                    <span className="w-4 h-4 bg-yellow-50 border rounded"></span>
                    <span>85-90%</span>
                    <span className="w-4 h-4 bg-red-50 border rounded"></span>
                    <span>85% 미만</span>
                  </div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2024">2024년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">공급업체</TableHead>
                      <TableHead className="text-center min-w-16">1월</TableHead>
                      <TableHead className="text-center min-w-16">2월</TableHead>
                      <TableHead className="text-center min-w-16">3월</TableHead>
                      <TableHead className="text-center min-w-16">4월</TableHead>
                      <TableHead className="text-center min-w-16">5월</TableHead>
                      <TableHead className="text-center min-w-16">6월</TableHead>
                      <TableHead className="text-center min-w-16">7월</TableHead>
                      <TableHead className="text-center min-w-16">8월</TableHead>
                      <TableHead className="text-center min-w-16">9월</TableHead>
                      <TableHead className="text-center min-w-16">10월</TableHead>
                      <TableHead className="text-center min-w-16">11월</TableHead>
                      <TableHead className="text-center min-w-16">12월</TableHead>
                      <TableHead className="text-center min-w-20 bg-muted">평균</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleMonthlyStatus.map((status) => (
                      <TableRow key={status.supplierCode}>
                        <TableCell className="sticky left-0 bg-background font-medium">
                          {status.supplierName}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.jan)}`}
                        >
                          {status.jan !== null ? (
                            <span className={getRateColor(status.jan)}>
                              {status.jan}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.feb)}`}
                        >
                          {status.feb !== null ? (
                            <span className={getRateColor(status.feb)}>
                              {status.feb}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.mar)}`}
                        >
                          {status.mar !== null ? (
                            <span className={getRateColor(status.mar)}>
                              {status.mar}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.apr)}`}
                        >
                          {status.apr !== null ? (
                            <span className={getRateColor(status.apr)}>
                              {status.apr}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.may)}`}
                        >
                          {status.may !== null ? (
                            <span className={getRateColor(status.may)}>
                              {status.may}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.jun)}`}
                        >
                          {status.jun !== null ? (
                            <span className={getRateColor(status.jun)}>
                              {status.jun}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.jul)}`}
                        >
                          {status.jul !== null ? (
                            <span className={getRateColor(status.jul)}>
                              {status.jul}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.aug)}`}
                        >
                          {status.aug !== null ? (
                            <span className={getRateColor(status.aug)}>
                              {status.aug}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.sep)}`}
                        >
                          {status.sep !== null ? (
                            <span className={getRateColor(status.sep)}>
                              {status.sep}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.oct)}`}
                        >
                          {status.oct !== null ? (
                            <span className={getRateColor(status.oct)}>
                              {status.oct}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.nov)}`}
                        >
                          {status.nov !== null ? (
                            <span className={getRateColor(status.nov)}>
                              {status.nov}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center ${getRateBgColor(status.dec)}`}
                        >
                          {status.dec !== null ? (
                            <span className={getRateColor(status.dec)}>
                              {status.dec}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell
                          className={`text-center font-bold bg-muted ${getRateColor(
                            status.average
                          )}`}
                        >
                          {status.average}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">목표: 인도성과율 95% 이상</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground">목표 달성 업체</div>
                    <div className="text-xl font-bold text-green-600">
                      {sampleMonthlyStatus.filter((s) => s.average >= 95).length}개사
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">목표 미달 업체</div>
                    <div className="text-xl font-bold text-red-600">
                      {sampleMonthlyStatus.filter((s) => s.average < 95).length}개사
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">전체 평균</div>
                    <div
                      className={`text-xl font-bold ${getRateColor(
                        Math.round(
                          (sampleMonthlyStatus.reduce((sum, s) => sum + s.average, 0) /
                            sampleMonthlyStatus.length) *
                            10
                        ) / 10
                      )}`}
                    >
                      {(
                        Math.round(
                          (sampleMonthlyStatus.reduce((sum, s) => sum + s.average, 0) /
                            sampleMonthlyStatus.length) *
                            10
                        ) / 10
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 업체별 순위 */}
        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {yearFilter}년 업체별 인도성과율 순위
                </CardTitle>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025년</SelectItem>
                    <SelectItem value="2024">2024년</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-16">순위</TableHead>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead className="text-center">총 납품건수</TableHead>
                    <TableHead className="text-center">준수건수</TableHead>
                    <TableHead className="text-center">평균 인도성과율</TableHead>
                    <TableHead className="text-center">등급</TableHead>
                    <TableHead className="text-center">추세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleRankings.map((ranking) => (
                    <TableRow
                      key={ranking.supplierCode}
                      className={ranking.rank <= 3 ? "bg-yellow-50" : ""}
                    >
                      <TableCell className="text-center font-bold">
                        {ranking.rank <= 3 ? (
                          <span
                            className={
                              ranking.rank === 1
                                ? "text-yellow-500 text-xl"
                                : ranking.rank === 2
                                ? "text-gray-400 text-lg"
                                : "text-amber-600"
                            }
                          >
                            {ranking.rank === 1
                              ? "1"
                              : ranking.rank === 2
                              ? "2"
                              : "3"}
                          </span>
                        ) : (
                          ranking.rank
                        )}
                      </TableCell>
                      <TableCell className="font-mono">{ranking.supplierCode}</TableCell>
                      <TableCell className="font-medium">{ranking.supplierName}</TableCell>
                      <TableCell className="text-center">
                        {ranking.totalDeliveries}
                      </TableCell>
                      <TableCell className="text-center">
                        {ranking.onTimeDeliveries}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold text-lg ${getRateColor(
                            ranking.averageRate
                          )}`}
                        >
                          {ranking.averageRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getGradeBadge(ranking.grade)}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {getTrendIcon(ranking.trend)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Grade Distribution */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">등급 기준</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">A</Badge>
                    <span className="text-sm">95% 이상 - 우수</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500">B</Badge>
                    <span className="text-sm">90-95% - 양호</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500">C</Badge>
                    <span className="text-sm">85-90% - 보통</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">D</Badge>
                    <span className="text-sm">85% 미만 - 미흡</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 목표 대비 실적 */}
        <TabsContent value="target">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  {yearFilter}년 목표 대비 실적
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">목표:</span>
                    <Badge className="bg-blue-600 text-lg px-3">
                      인도성과율 {TARGET_RATE}% 이상
                    </Badge>
                  </div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2024">2024년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead className="text-center">목표</TableHead>
                    <TableHead className="text-center">실적</TableHead>
                    <TableHead className="text-center">Gap</TableHead>
                    <TableHead className="text-center">달성 여부</TableHead>
                    <TableHead>조치사항</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleTargetVsActual.map((item) => (
                    <TableRow key={item.supplierCode}>
                      <TableCell className="font-mono">{item.supplierCode}</TableCell>
                      <TableCell className="font-medium">{item.supplierName}</TableCell>
                      <TableCell className="text-center font-semibold text-blue-600">
                        {item.targetRate}%
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold ${getRateColor(item.actualRate)}`}
                        >
                          {item.actualRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={
                            item.gap >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {item.gap >= 0 ? "+" : ""}
                          {item.gap.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status === "achieved" ? (
                          <Badge className="bg-green-600">달성</Badge>
                        ) : (
                          <Badge className="bg-red-500">미달</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            item.status === "achieved"
                              ? "text-green-600"
                              : "text-red-600 font-medium"
                          }
                        >
                          {item.action}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Target Achievement Summary */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="bg-green-50">
                  <CardContent className="pt-4">
                    <div className="text-sm text-green-800 font-medium">
                      목표 달성 업체
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {sampleTargetVsActual.filter((t) => t.status === "achieved").length}
                      개사
                    </div>
                    <div className="text-sm text-green-700">
                      (
                      {Math.round(
                        (sampleTargetVsActual.filter((t) => t.status === "achieved")
                          .length /
                          sampleTargetVsActual.length) *
                          100
                      )}
                      %)
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="pt-4">
                    <div className="text-sm text-red-800 font-medium">
                      목표 미달 업체
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {
                        sampleTargetVsActual.filter((t) => t.status === "not-achieved")
                          .length
                      }
                      개사
                    </div>
                    <div className="text-sm text-red-700">
                      (
                      {Math.round(
                        (sampleTargetVsActual.filter((t) => t.status === "not-achieved")
                          .length /
                          sampleTargetVsActual.length) *
                          100
                      )}
                      %)
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="text-sm text-blue-800 font-medium">
                      전체 평균 인도성과율
                    </div>
                    <div
                      className={`text-3xl font-bold ${getRateColor(
                        Math.round(
                          (sampleTargetVsActual.reduce((sum, t) => sum + t.actualRate, 0) /
                            sampleTargetVsActual.length) *
                            10
                        ) / 10
                      )}`}
                    >
                      {(
                        Math.round(
                          (sampleTargetVsActual.reduce((sum, t) => sum + t.actualRate, 0) /
                            sampleTargetVsActual.length) *
                            10
                        ) / 10
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-blue-700">목표: {TARGET_RATE}%</div>
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
