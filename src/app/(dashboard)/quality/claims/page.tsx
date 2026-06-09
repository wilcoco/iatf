"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Car,
  FileText,
  Plus,
  Calendar
} from "lucide-react";

// Types
type WarrantyType = "3M" | "12M";
type VehicleType = "NQ5" | "SP2" | "GN7" | "CE" | "MX5" | "EV9" | "기타";

interface MonthlyClaimData {
  month: number;
  threeM: number;
  twelveM: number;
  total: number;
}

interface YearlyClaimSummary {
  year: number;
  monthlyData: MonthlyClaimData[];
  totalThreeM: number;
  totalTwelveM: number;
  grandTotal: number;
}

interface VehicleClaimData {
  vehicleType: VehicleType;
  threeM: number;
  twelveM: number;
  total: number;
  percentage: number;
}

interface ClaimRegistration {
  id: string;
  registrationDate: string;
  vehicleType: VehicleType;
  warrantyType: WarrantyType;
  partNumber: string;
  defectType: string;
  quantity: number;
  customerName: string;
  claimDetail: string;
  status: "접수" | "처리중" | "완료";
}

// Sample data based on Excel structure
const yearlyClaimData: YearlyClaimSummary[] = [
  {
    year: 2025,
    monthlyData: [
      { month: 1, threeM: 12, twelveM: 8, total: 20 },
      { month: 2, threeM: 15, twelveM: 10, total: 25 },
      { month: 3, threeM: 8, twelveM: 6, total: 14 },
      { month: 4, threeM: 11, twelveM: 9, total: 20 },
      { month: 5, threeM: 14, twelveM: 7, total: 21 },
      { month: 6, threeM: 9, twelveM: 5, total: 14 },
      { month: 7, threeM: 0, twelveM: 0, total: 0 },
      { month: 8, threeM: 0, twelveM: 0, total: 0 },
      { month: 9, threeM: 0, twelveM: 0, total: 0 },
      { month: 10, threeM: 0, twelveM: 0, total: 0 },
      { month: 11, threeM: 0, twelveM: 0, total: 0 },
      { month: 12, threeM: 0, twelveM: 0, total: 0 },
    ],
    totalThreeM: 69,
    totalTwelveM: 45,
    grandTotal: 114,
  },
  {
    year: 2024,
    monthlyData: [
      { month: 1, threeM: 18, twelveM: 12, total: 30 },
      { month: 2, threeM: 22, twelveM: 14, total: 36 },
      { month: 3, threeM: 16, twelveM: 11, total: 27 },
      { month: 4, threeM: 19, twelveM: 13, total: 32 },
      { month: 5, threeM: 21, twelveM: 15, total: 36 },
      { month: 6, threeM: 17, twelveM: 10, total: 27 },
      { month: 7, threeM: 14, twelveM: 9, total: 23 },
      { month: 8, threeM: 20, twelveM: 12, total: 32 },
      { month: 9, threeM: 15, twelveM: 8, total: 23 },
      { month: 10, threeM: 18, twelveM: 11, total: 29 },
      { month: 11, threeM: 13, twelveM: 7, total: 20 },
      { month: 12, threeM: 16, twelveM: 10, total: 26 },
    ],
    totalThreeM: 209,
    totalTwelveM: 132,
    grandTotal: 341,
  },
  {
    year: 2023,
    monthlyData: [
      { month: 1, threeM: 25, twelveM: 18, total: 43 },
      { month: 2, threeM: 28, twelveM: 20, total: 48 },
      { month: 3, threeM: 22, twelveM: 15, total: 37 },
      { month: 4, threeM: 26, twelveM: 17, total: 43 },
      { month: 5, threeM: 30, twelveM: 19, total: 49 },
      { month: 6, threeM: 24, twelveM: 14, total: 38 },
      { month: 7, threeM: 21, twelveM: 13, total: 34 },
      { month: 8, threeM: 27, twelveM: 16, total: 43 },
      { month: 9, threeM: 23, twelveM: 12, total: 35 },
      { month: 10, threeM: 25, twelveM: 15, total: 40 },
      { month: 11, threeM: 20, twelveM: 11, total: 31 },
      { month: 12, threeM: 24, twelveM: 14, total: 38 },
    ],
    totalThreeM: 295,
    totalTwelveM: 184,
    grandTotal: 479,
  },
  {
    year: 2022,
    monthlyData: [
      { month: 1, threeM: 30, twelveM: 22, total: 52 },
      { month: 2, threeM: 33, twelveM: 25, total: 58 },
      { month: 3, threeM: 28, twelveM: 20, total: 48 },
      { month: 4, threeM: 31, twelveM: 23, total: 54 },
      { month: 5, threeM: 35, twelveM: 26, total: 61 },
      { month: 6, threeM: 29, twelveM: 21, total: 50 },
      { month: 7, threeM: 26, twelveM: 18, total: 44 },
      { month: 8, threeM: 32, twelveM: 24, total: 56 },
      { month: 9, threeM: 28, twelveM: 19, total: 47 },
      { month: 10, threeM: 30, twelveM: 21, total: 51 },
      { month: 11, threeM: 25, twelveM: 17, total: 42 },
      { month: 12, threeM: 29, twelveM: 20, total: 49 },
    ],
    totalThreeM: 356,
    totalTwelveM: 256,
    grandTotal: 612,
  },
];

// Vehicle type data by year
const vehicleClaimDataByYear: Record<number, VehicleClaimData[]> = {
  2025: [
    { vehicleType: "NQ5", threeM: 18, twelveM: 12, total: 30, percentage: 26.3 },
    { vehicleType: "SP2", threeM: 15, twelveM: 10, total: 25, percentage: 21.9 },
    { vehicleType: "GN7", threeM: 12, twelveM: 8, total: 20, percentage: 17.5 },
    { vehicleType: "CE", threeM: 10, twelveM: 6, total: 16, percentage: 14.0 },
    { vehicleType: "MX5", threeM: 8, twelveM: 5, total: 13, percentage: 11.4 },
    { vehicleType: "EV9", threeM: 4, twelveM: 3, total: 7, percentage: 6.1 },
    { vehicleType: "기타", threeM: 2, twelveM: 1, total: 3, percentage: 2.6 },
  ],
  2024: [
    { vehicleType: "NQ5", threeM: 55, twelveM: 35, total: 90, percentage: 26.4 },
    { vehicleType: "SP2", threeM: 48, twelveM: 30, total: 78, percentage: 22.9 },
    { vehicleType: "GN7", threeM: 38, twelveM: 24, total: 62, percentage: 18.2 },
    { vehicleType: "CE", threeM: 30, twelveM: 19, total: 49, percentage: 14.4 },
    { vehicleType: "MX5", threeM: 22, twelveM: 14, total: 36, percentage: 10.6 },
    { vehicleType: "EV9", threeM: 10, twelveM: 6, total: 16, percentage: 4.7 },
    { vehicleType: "기타", threeM: 6, twelveM: 4, total: 10, percentage: 2.9 },
  ],
  2023: [
    { vehicleType: "NQ5", threeM: 78, twelveM: 49, total: 127, percentage: 26.5 },
    { vehicleType: "SP2", threeM: 68, twelveM: 42, total: 110, percentage: 23.0 },
    { vehicleType: "GN7", threeM: 54, twelveM: 34, total: 88, percentage: 18.4 },
    { vehicleType: "CE", threeM: 42, twelveM: 27, total: 69, percentage: 14.4 },
    { vehicleType: "MX5", threeM: 32, twelveM: 20, total: 52, percentage: 10.9 },
    { vehicleType: "EV9", threeM: 14, twelveM: 8, total: 22, percentage: 4.6 },
    { vehicleType: "기타", threeM: 7, twelveM: 4, total: 11, percentage: 2.3 },
  ],
  2022: [
    { vehicleType: "NQ5", threeM: 94, twelveM: 68, total: 162, percentage: 26.5 },
    { vehicleType: "SP2", threeM: 82, twelveM: 59, total: 141, percentage: 23.0 },
    { vehicleType: "GN7", threeM: 65, twelveM: 47, total: 112, percentage: 18.3 },
    { vehicleType: "CE", threeM: 51, twelveM: 37, total: 88, percentage: 14.4 },
    { vehicleType: "MX5", threeM: 39, twelveM: 28, total: 67, percentage: 10.9 },
    { vehicleType: "EV9", threeM: 17, twelveM: 12, total: 29, percentage: 4.7 },
    { vehicleType: "기타", threeM: 8, twelveM: 5, total: 13, percentage: 2.1 },
  ],
};

// Sample claim registrations
const sampleRegistrations: ClaimRegistration[] = [
  {
    id: "CLM-2025-0001",
    registrationDate: "2025-01-15",
    vehicleType: "NQ5",
    warrantyType: "3M",
    partNumber: "PN-NQ5-001",
    defectType: "외관불량",
    quantity: 5,
    customerName: "현대모비스",
    claimDetail: "도장 이물 발생",
    status: "완료",
  },
  {
    id: "CLM-2025-0002",
    registrationDate: "2025-02-20",
    vehicleType: "SP2",
    warrantyType: "12M",
    partNumber: "PN-SP2-002",
    defectType: "치수불량",
    quantity: 3,
    customerName: "현대자동차",
    claimDetail: "조립 간섭 발생",
    status: "처리중",
  },
  {
    id: "CLM-2025-0003",
    registrationDate: "2025-06-05",
    vehicleType: "GN7",
    warrantyType: "3M",
    partNumber: "PN-GN7-003",
    defectType: "기능불량",
    quantity: 2,
    customerName: "기아자동차",
    claimDetail: "체결 불량",
    status: "접수",
  },
];

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState("yearly-summary");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [registrations, setRegistrations] = useState<ClaimRegistration[]>(sampleRegistrations);

  // New registration form state
  const [newClaim, setNewClaim] = useState<Partial<ClaimRegistration>>({
    vehicleType: "NQ5",
    warrantyType: "3M",
    status: "접수",
  });

  const currentYearData = yearlyClaimData.find(d => d.year === selectedYear) || yearlyClaimData[0];
  const currentVehicleData = vehicleClaimDataByYear[selectedYear] || vehicleClaimDataByYear[2025];

  const handleAddClaim = () => {
    if (!newClaim.partNumber || !newClaim.customerName) {
      alert("품번과 고객사를 입력해주세요.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newId = `CLM-${selectedYear}-${String(registrations.length + 1).padStart(4, "0")}`;

    const claim: ClaimRegistration = {
      id: newId,
      registrationDate: today,
      vehicleType: newClaim.vehicleType as VehicleType || "NQ5",
      warrantyType: newClaim.warrantyType as WarrantyType || "3M",
      partNumber: newClaim.partNumber || "",
      defectType: newClaim.defectType || "",
      quantity: newClaim.quantity || 1,
      customerName: newClaim.customerName || "",
      claimDetail: newClaim.claimDetail || "",
      status: "접수",
    };

    setRegistrations([...registrations, claim]);
    setNewClaim({
      vehicleType: "NQ5",
      warrantyType: "3M",
      status: "접수",
    });
    alert("클레임이 등록되었습니다.");
  };

  // Calculate max for visual bar rendering
  const maxMonthlyTotal = Math.max(...currentYearData.monthlyData.map(d => d.total), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">클레임 분석/관리</h1>
          <p className="text-muted-foreground">
            월별 클레임 현황 (3M/12M 보증 구분)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="년도 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025년</SelectItem>
              <SelectItem value="2024">2024년</SelectItem>
              <SelectItem value="2023">2023년</SelectItem>
              <SelectItem value="2022">2022년</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">3M 보증 클레임</CardTitle>
            <div className="rounded-lg p-2 bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentYearData.totalThreeM}건</div>
            <p className="text-xs text-muted-foreground">3개월 보증 클레임 합계</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">12M 보증 클레임</CardTitle>
            <div className="rounded-lg p-2 bg-orange-100">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentYearData.totalTwelveM}건</div>
            <p className="text-xs text-muted-foreground">12개월 보증 클레임 합계</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 클레임</CardTitle>
            <div className="rounded-lg p-2 bg-red-100">
              <BarChart3 className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentYearData.grandTotal}건</div>
            <p className="text-xs text-muted-foreground">{selectedYear}년 전체 합계</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전년 대비</CardTitle>
            <div className="rounded-lg p-2 bg-green-100">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const prevYearData = yearlyClaimData.find(d => d.year === selectedYear - 1);
              if (prevYearData) {
                const diff = currentYearData.grandTotal - prevYearData.grandTotal;
                const percent = ((diff / prevYearData.grandTotal) * 100).toFixed(1);
                return (
                  <>
                    <div className={`text-2xl font-bold ${diff < 0 ? "text-green-600" : "text-red-600"}`}>
                      {diff < 0 ? "" : "+"}{percent}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {diff < 0 ? "감소" : "증가"} ({Math.abs(diff)}건)
                    </p>
                  </>
                );
              }
              return (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">비교 데이터 없음</p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="yearly-summary">
            <BarChart3 className="mr-2 h-4 w-4" />
            년도별 클레임 종합
          </TabsTrigger>
          <TabsTrigger value="vehicle-type">
            <Car className="mr-2 h-4 w-4" />
            차종별 현황
          </TabsTrigger>
          <TabsTrigger value="monthly-trend">
            <TrendingUp className="mr-2 h-4 w-4" />
            월별 추이
          </TabsTrigger>
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            클레임 상세 등록
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 년도별 클레임 종합 */}
        <TabsContent value="yearly-summary">
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}년도 클레임 종합 (3M/12M)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">구분</TableHead>
                    {months.map((month) => (
                      <TableHead key={month} className="text-center w-16">{month}</TableHead>
                    ))}
                    <TableHead className="text-center w-20 bg-muted font-bold">합계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* 3M Row */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <Badge variant="default" className="bg-blue-600">3M</Badge>
                    </TableCell>
                    {currentYearData.monthlyData.map((data, idx) => (
                      <TableCell key={idx} className="text-center">
                        {data.threeM > 0 ? data.threeM : "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold bg-blue-50">
                      {currentYearData.totalThreeM}
                    </TableCell>
                  </TableRow>
                  {/* 12M Row */}
                  <TableRow>
                    <TableCell className="font-medium">
                      <Badge variant="default" className="bg-orange-600">12M</Badge>
                    </TableCell>
                    {currentYearData.monthlyData.map((data, idx) => (
                      <TableCell key={idx} className="text-center">
                        {data.twelveM > 0 ? data.twelveM : "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold bg-orange-50">
                      {currentYearData.totalTwelveM}
                    </TableCell>
                  </TableRow>
                  {/* Total Row */}
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">합계</TableCell>
                    {currentYearData.monthlyData.map((data, idx) => (
                      <TableCell key={idx} className="text-center font-bold">
                        {data.total > 0 ? data.total : "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-bold bg-red-50 text-red-700">
                      {currentYearData.grandTotal}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Year comparison table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">연도별 비교</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>년도</TableHead>
                      <TableHead className="text-center">3M 클레임</TableHead>
                      <TableHead className="text-center">12M 클레임</TableHead>
                      <TableHead className="text-center">합계</TableHead>
                      <TableHead className="text-center">전년 대비</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyClaimData.map((yearData, idx) => {
                      const prevYearData = yearlyClaimData[idx + 1];
                      let changePercent = "-";
                      let changeColor = "";
                      if (prevYearData) {
                        const diff = yearData.grandTotal - prevYearData.grandTotal;
                        const percent = ((diff / prevYearData.grandTotal) * 100).toFixed(1);
                        changePercent = `${diff < 0 ? "" : "+"}${percent}%`;
                        changeColor = diff < 0 ? "text-green-600" : "text-red-600";
                      }
                      return (
                        <TableRow
                          key={yearData.year}
                          className={yearData.year === selectedYear ? "bg-blue-50" : ""}
                        >
                          <TableCell className="font-medium">{yearData.year}년</TableCell>
                          <TableCell className="text-center">{yearData.totalThreeM}건</TableCell>
                          <TableCell className="text-center">{yearData.totalTwelveM}건</TableCell>
                          <TableCell className="text-center font-bold">{yearData.grandTotal}건</TableCell>
                          <TableCell className={`text-center font-medium ${changeColor}`}>
                            {changePercent}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 차종별 현황 */}
        <TabsContent value="vehicle-type">
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}년 차종별 클레임 발생 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">차종</TableHead>
                    <TableHead className="text-center">3M 클레임</TableHead>
                    <TableHead className="text-center">12M 클레임</TableHead>
                    <TableHead className="text-center">합계</TableHead>
                    <TableHead className="text-center">비율</TableHead>
                    <TableHead className="w-40">분포</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentVehicleData.map((vehicle) => (
                    <TableRow key={vehicle.vehicleType}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          {vehicle.vehicleType}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-blue-600">
                          {vehicle.threeM}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="bg-orange-600">
                          {vehicle.twelveM}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{vehicle.total}</TableCell>
                      <TableCell className="text-center">{vehicle.percentage.toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${vehicle.percentage}%` }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>합계</TableCell>
                    <TableCell className="text-center">
                      {currentVehicleData.reduce((sum, v) => sum + v.threeM, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {currentVehicleData.reduce((sum, v) => sum + v.twelveM, 0)}
                    </TableCell>
                    <TableCell className="text-center">
                      {currentVehicleData.reduce((sum, v) => sum + v.total, 0)}
                    </TableCell>
                    <TableCell className="text-center">100%</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>

              {/* Visual Summary Cards */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-blue-600">
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">3M 최다 발생 차종</div>
                    <div className="text-xl font-bold mt-1">
                      {currentVehicleData.sort((a, b) => b.threeM - a.threeM)[0]?.vehicleType || "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentVehicleData.sort((a, b) => b.threeM - a.threeM)[0]?.threeM || 0}건
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-600">
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">12M 최다 발생 차종</div>
                    <div className="text-xl font-bold mt-1">
                      {currentVehicleData.sort((a, b) => b.twelveM - a.twelveM)[0]?.vehicleType || "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentVehicleData.sort((a, b) => b.twelveM - a.twelveM)[0]?.twelveM || 0}건
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-600">
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">총 최다 발생 차종</div>
                    <div className="text-xl font-bold mt-1">
                      {currentVehicleData.sort((a, b) => b.total - a.total)[0]?.vehicleType || "-"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentVehicleData.sort((a, b) => b.total - a.total)[0]?.total || 0}건 ({currentVehicleData.sort((a, b) => b.total - a.total)[0]?.percentage.toFixed(1)}%)
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 월별 추이 */}
        <TabsContent value="monthly-trend">
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}년 월별 클레임 추이 (3M/12M 분리)</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Visual Bar Chart */}
              <div className="space-y-4">
                {currentYearData.monthlyData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{months[idx]}</div>
                    <div className="flex-1 flex gap-1">
                      {/* 3M Bar */}
                      <div
                        className="h-6 bg-blue-500 rounded-l flex items-center justify-end pr-1"
                        style={{
                          width: `${maxMonthlyTotal > 0 ? (data.threeM / maxMonthlyTotal) * 50 : 0}%`,
                          minWidth: data.threeM > 0 ? "20px" : "0"
                        }}
                      >
                        {data.threeM > 0 && (
                          <span className="text-xs text-white font-medium">{data.threeM}</span>
                        )}
                      </div>
                      {/* 12M Bar */}
                      <div
                        className="h-6 bg-orange-500 rounded-r flex items-center justify-start pl-1"
                        style={{
                          width: `${maxMonthlyTotal > 0 ? (data.twelveM / maxMonthlyTotal) * 50 : 0}%`,
                          minWidth: data.twelveM > 0 ? "20px" : "0"
                        }}
                      >
                        {data.twelveM > 0 && (
                          <span className="text-xs text-white font-medium">{data.twelveM}</span>
                        )}
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm font-medium">
                      {data.total > 0 ? `${data.total}건` : "-"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-sm">3M 보증</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span className="text-sm">12M 보증</span>
                </div>
              </div>

              {/* Monthly Comparison Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">월별 상세 현황</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-center">3M</TableHead>
                      <TableHead className="text-center">12M</TableHead>
                      <TableHead className="text-center">합계</TableHead>
                      <TableHead className="text-center">3M 비율</TableHead>
                      <TableHead className="text-center">12M 비율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentYearData.monthlyData.map((data, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{months[idx]}</TableCell>
                        <TableCell className="text-center">{data.threeM || "-"}</TableCell>
                        <TableCell className="text-center">{data.twelveM || "-"}</TableCell>
                        <TableCell className="text-center font-bold">{data.total || "-"}</TableCell>
                        <TableCell className="text-center">
                          {data.total > 0 ? `${((data.threeM / data.total) * 100).toFixed(0)}%` : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {data.total > 0 ? `${((data.twelveM / data.total) * 100).toFixed(0)}%` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Multi-year trend comparison */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">연도별 월별 합계 비교</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>년도</TableHead>
                      {months.map((month) => (
                        <TableHead key={month} className="text-center">{month}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearlyClaimData.map((yearData) => (
                      <TableRow
                        key={yearData.year}
                        className={yearData.year === selectedYear ? "bg-blue-50" : ""}
                      >
                        <TableCell className="font-medium">{yearData.year}</TableCell>
                        {yearData.monthlyData.map((data, idx) => (
                          <TableCell key={idx} className="text-center">
                            {data.total > 0 ? data.total : "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 클레임 상세 등록 */}
        <TabsContent value="registration">
          <div className="grid grid-cols-2 gap-6">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  신규 클레임 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>차종</Label>
                    <Select
                      value={newClaim.vehicleType}
                      onValueChange={(value) => setNewClaim({ ...newClaim, vehicleType: value as VehicleType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="차종 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NQ5">NQ5</SelectItem>
                        <SelectItem value="SP2">SP2</SelectItem>
                        <SelectItem value="GN7">GN7</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="MX5">MX5</SelectItem>
                        <SelectItem value="EV9">EV9</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>보증 구분</Label>
                    <Select
                      value={newClaim.warrantyType}
                      onValueChange={(value) => setNewClaim({ ...newClaim, warrantyType: value as WarrantyType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="보증 구분" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3M">3M (3개월 보증)</SelectItem>
                        <SelectItem value="12M">12M (12개월 보증)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Input
                      value={newClaim.partNumber || ""}
                      onChange={(e) => setNewClaim({ ...newClaim, partNumber: e.target.value })}
                      placeholder="품번 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>불량 유형</Label>
                    <Select
                      value={newClaim.defectType}
                      onValueChange={(value) => setNewClaim({ ...newClaim, defectType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="외관불량">외관불량</SelectItem>
                        <SelectItem value="치수불량">치수불량</SelectItem>
                        <SelectItem value="기능불량">기능불량</SelectItem>
                        <SelectItem value="포장불량">포장불량</SelectItem>
                        <SelectItem value="혼입">혼입</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>고객사 *</Label>
                    <Input
                      value={newClaim.customerName || ""}
                      onChange={(e) => setNewClaim({ ...newClaim, customerName: e.target.value })}
                      placeholder="고객사명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>수량</Label>
                    <Input
                      type="number"
                      value={newClaim.quantity || ""}
                      onChange={(e) => setNewClaim({ ...newClaim, quantity: parseInt(e.target.value) || 0 })}
                      placeholder="불량 수량"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>클레임 상세</Label>
                  <Textarea
                    value={newClaim.claimDetail || ""}
                    onChange={(e) => setNewClaim({ ...newClaim, claimDetail: e.target.value })}
                    placeholder="클레임 상세 내용을 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddClaim}>
                    <Plus className="mr-2 h-4 w-4" />
                    클레임 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registration List */}
            <Card>
              <CardHeader>
                <CardTitle>등록된 클레임 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>번호</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead>차종</TableHead>
                      <TableHead>보증</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          등록된 클레임이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrations.map((reg) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-mono text-xs">{reg.id}</TableCell>
                          <TableCell className="text-sm">{reg.registrationDate}</TableCell>
                          <TableCell>{reg.vehicleType}</TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={reg.warrantyType === "3M" ? "bg-blue-600" : "bg-orange-600"}
                            >
                              {reg.warrantyType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{reg.customerName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                reg.status === "완료" ? "success" :
                                reg.status === "처리중" ? "warning" :
                                "default"
                              }
                            >
                              {reg.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
