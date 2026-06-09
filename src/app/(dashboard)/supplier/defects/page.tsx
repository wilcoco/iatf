"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  CalendarDays,
  Car,
  AlertTriangle,
  Building2,
  Info,
} from "lucide-react";

// Types
interface MonthlyDefectData {
  month: number;
  incomingQty: number;
  returnQty: number;
  defectRate: number;
  ppm: number;
}

interface AnnualSummary {
  year: number;
  data: MonthlyDefectData[];
  totalIncoming: number;
  totalReturn: number;
  avgDefectRate: number;
  avgPpm: number;
}

interface VehicleTypeData {
  vehicleType: string;
  partName: string;
  incomingQty: number;
  returnQty: number;
  defectRate: number;
  ppm: number;
}

interface DefectTypeData {
  defectType: string;
  count: number;
  percentage: number;
  description: string;
}

interface SupplierDefectData {
  supplierName: string;
  supplierCode: string;
  incomingQty: number;
  returnQty: number;
  defectRate: number;
  ppm: number;
  grade: string;
}

// Helper function to calculate PPM
function calculatePpm(defectQty: number, totalQty: number): number {
  if (totalQty === 0) return 0;
  return Math.round((defectQty / totalQty) * 1000000);
}

// Helper function to calculate defect rate
function calculateDefectRate(defectQty: number, totalQty: number): number {
  if (totalQty === 0) return 0;
  return Number(((defectQty / totalQty) * 100).toFixed(3));
}

// Sample data for 2024
const sample2024Data: MonthlyDefectData[] = [
  { month: 1, incomingQty: 125000, returnQty: 45, defectRate: 0.036, ppm: 360 },
  { month: 2, incomingQty: 118000, returnQty: 38, defectRate: 0.032, ppm: 322 },
  { month: 3, incomingQty: 132000, returnQty: 52, defectRate: 0.039, ppm: 394 },
  { month: 4, incomingQty: 128500, returnQty: 41, defectRate: 0.032, ppm: 319 },
  { month: 5, incomingQty: 135000, returnQty: 55, defectRate: 0.041, ppm: 407 },
  { month: 6, incomingQty: 142000, returnQty: 48, defectRate: 0.034, ppm: 338 },
  { month: 7, incomingQty: 138500, returnQty: 62, defectRate: 0.045, ppm: 448 },
  { month: 8, incomingQty: 115000, returnQty: 35, defectRate: 0.030, ppm: 304 },
  { month: 9, incomingQty: 145000, returnQty: 58, defectRate: 0.040, ppm: 400 },
  { month: 10, incomingQty: 152000, returnQty: 65, defectRate: 0.043, ppm: 428 },
  { month: 11, incomingQty: 148000, returnQty: 52, defectRate: 0.035, ppm: 351 },
  { month: 12, incomingQty: 130000, returnQty: 42, defectRate: 0.032, ppm: 323 },
];

// Sample data for 2025
const sample2025Data: MonthlyDefectData[] = [
  { month: 1, incomingQty: 142000, returnQty: 42, defectRate: 0.030, ppm: 296 },
  { month: 2, incomingQty: 138000, returnQty: 38, defectRate: 0.028, ppm: 275 },
  { month: 3, incomingQty: 155000, returnQty: 45, defectRate: 0.029, ppm: 290 },
  { month: 4, incomingQty: 148000, returnQty: 40, defectRate: 0.027, ppm: 270 },
  { month: 5, incomingQty: 160000, returnQty: 48, defectRate: 0.030, ppm: 300 },
  { month: 6, incomingQty: 165000, returnQty: 45, defectRate: 0.027, ppm: 273 },
  { month: 7, incomingQty: 0, returnQty: 0, defectRate: 0, ppm: 0 },
  { month: 8, incomingQty: 0, returnQty: 0, defectRate: 0, ppm: 0 },
  { month: 9, incomingQty: 0, returnQty: 0, defectRate: 0, ppm: 0 },
  { month: 10, incomingQty: 0, returnQty: 0, defectRate: 0, ppm: 0 },
  { month: 11, incomingQty: 0, returnQty: 0, defectRate: 0, ppm: 0 },
  { month: 12, incomingQty: 0, returnQty: 0, defectRate: 0, ppm: 0 },
];

// Sample vehicle type data
const vehicleTypeData2024: VehicleTypeData[] = [
  { vehicleType: "NE1", partName: "브래킷 ASSY", incomingQty: 85000, returnQty: 28, defectRate: 0.033, ppm: 329 },
  { vehicleType: "NE1", partName: "커넥터 ASSY", incomingQty: 72000, returnQty: 22, defectRate: 0.031, ppm: 306 },
  { vehicleType: "MX5", partName: "하우징", incomingQty: 95000, returnQty: 35, defectRate: 0.037, ppm: 368 },
  { vehicleType: "MX5", partName: "케이블 ASSY", incomingQty: 88000, returnQty: 32, defectRate: 0.036, ppm: 364 },
  { vehicleType: "GN7", partName: "센서모듈", incomingQty: 110000, returnQty: 42, defectRate: 0.038, ppm: 382 },
  { vehicleType: "GN7", partName: "PCB ASSY", incomingQty: 98000, returnQty: 38, defectRate: 0.039, ppm: 388 },
  { vehicleType: "CE", partName: "터미널", incomingQty: 125000, returnQty: 45, defectRate: 0.036, ppm: 360 },
  { vehicleType: "CE", partName: "실리콘 SEAL", incomingQty: 115000, returnQty: 40, defectRate: 0.035, ppm: 348 },
  { vehicleType: "EN", partName: "릴레이 ASSY", incomingQty: 78000, returnQty: 28, defectRate: 0.036, ppm: 359 },
  { vehicleType: "EN", partName: "퓨즈박스", incomingQty: 82000, returnQty: 30, defectRate: 0.037, ppm: 366 },
];

const vehicleTypeData2025: VehicleTypeData[] = [
  { vehicleType: "NE1", partName: "브래킷 ASSY", incomingQty: 98000, returnQty: 25, defectRate: 0.026, ppm: 255 },
  { vehicleType: "NE1", partName: "커넥터 ASSY", incomingQty: 85000, returnQty: 22, defectRate: 0.026, ppm: 259 },
  { vehicleType: "MX5", partName: "하우징", incomingQty: 108000, returnQty: 30, defectRate: 0.028, ppm: 278 },
  { vehicleType: "MX5", partName: "케이블 ASSY", incomingQty: 95000, returnQty: 26, defectRate: 0.027, ppm: 274 },
  { vehicleType: "GN7", partName: "센서모듈", incomingQty: 125000, returnQty: 35, defectRate: 0.028, ppm: 280 },
  { vehicleType: "GN7", partName: "PCB ASSY", incomingQty: 112000, returnQty: 32, defectRate: 0.029, ppm: 286 },
  { vehicleType: "CE", partName: "터미널", incomingQty: 142000, returnQty: 38, defectRate: 0.027, ppm: 268 },
  { vehicleType: "CE", partName: "실리콘 SEAL", incomingQty: 135000, returnQty: 35, defectRate: 0.026, ppm: 259 },
  { vehicleType: "EN", partName: "릴레이 ASSY", incomingQty: 88000, returnQty: 22, defectRate: 0.025, ppm: 250 },
  { vehicleType: "EN", partName: "퓨즈박스", incomingQty: 92000, returnQty: 24, defectRate: 0.026, ppm: 261 },
];

// Sample defect type data
const defectTypeData2024: DefectTypeData[] = [
  { defectType: "외관불량", count: 185, percentage: 31.2, description: "스크래치, 찍힘, 변색 등" },
  { defectType: "치수불량", count: 142, percentage: 23.9, description: "규격 초과/미달" },
  { defectType: "기능불량", count: 98, percentage: 16.5, description: "동작 이상, 성능 미달" },
  { defectType: "포장불량", count: 72, percentage: 12.1, description: "파손, 오염, 라벨링 오류" },
  { defectType: "조립불량", count: 55, percentage: 9.3, description: "조립 불량, 누락 부품" },
  { defectType: "이물혼입", count: 28, percentage: 4.7, description: "이물질 부착/혼입" },
  { defectType: "기타", count: 13, percentage: 2.2, description: "분류 외 불량" },
];

const defectTypeData2025: DefectTypeData[] = [
  { defectType: "외관불량", count: 78, percentage: 30.1, description: "스크래치, 찍힘, 변색 등" },
  { defectType: "치수불량", count: 62, percentage: 23.9, description: "규격 초과/미달" },
  { defectType: "기능불량", count: 45, percentage: 17.4, description: "동작 이상, 성능 미달" },
  { defectType: "포장불량", count: 32, percentage: 12.4, description: "파손, 오염, 라벨링 오류" },
  { defectType: "조립불량", count: 24, percentage: 9.3, description: "조립 불량, 누락 부품" },
  { defectType: "이물혼입", count: 12, percentage: 4.6, description: "이물질 부착/혼입" },
  { defectType: "기타", count: 6, percentage: 2.3, description: "분류 외 불량" },
];

// Sample supplier data
const supplierData2024: SupplierDefectData[] = [
  { supplierName: "대한전자부품", supplierCode: "SUP-001", incomingQty: 285000, returnQty: 95, defectRate: 0.033, ppm: 333, grade: "B" },
  { supplierName: "한국정밀", supplierCode: "SUP-002", incomingQty: 198000, returnQty: 55, defectRate: 0.028, ppm: 278, grade: "A" },
  { supplierName: "삼성커넥터", supplierCode: "SUP-003", incomingQty: 245000, returnQty: 88, defectRate: 0.036, ppm: 359, grade: "B" },
  { supplierName: "대우플라스틱", supplierCode: "SUP-004", incomingQty: 165000, returnQty: 72, defectRate: 0.044, ppm: 436, grade: "C" },
  { supplierName: "현대금속", supplierCode: "SUP-005", incomingQty: 312000, returnQty: 85, defectRate: 0.027, ppm: 272, grade: "A" },
  { supplierName: "LG전선", supplierCode: "SUP-006", incomingQty: 178000, returnQty: 62, defectRate: 0.035, ppm: 348, grade: "B" },
  { supplierName: "SK실리콘", supplierCode: "SUP-007", incomingQty: 142000, returnQty: 38, defectRate: 0.027, ppm: 268, grade: "A" },
  { supplierName: "동양전기", supplierCode: "SUP-008", incomingQty: 125000, returnQty: 58, defectRate: 0.046, ppm: 464, grade: "C" },
];

const supplierData2025: SupplierDefectData[] = [
  { supplierName: "대한전자부품", supplierCode: "SUP-001", incomingQty: 165000, returnQty: 42, defectRate: 0.025, ppm: 255, grade: "A" },
  { supplierName: "한국정밀", supplierCode: "SUP-002", incomingQty: 125000, returnQty: 30, defectRate: 0.024, ppm: 240, grade: "A" },
  { supplierName: "삼성커넥터", supplierCode: "SUP-003", incomingQty: 148000, returnQty: 42, defectRate: 0.028, ppm: 284, grade: "A" },
  { supplierName: "대우플라스틱", supplierCode: "SUP-004", incomingQty: 98000, returnQty: 35, defectRate: 0.036, ppm: 357, grade: "B" },
  { supplierName: "현대금속", supplierCode: "SUP-005", incomingQty: 185000, returnQty: 45, defectRate: 0.024, ppm: 243, grade: "A" },
  { supplierName: "LG전선", supplierCode: "SUP-006", incomingQty: 108000, returnQty: 32, defectRate: 0.030, ppm: 296, grade: "A" },
  { supplierName: "SK실리콘", supplierCode: "SUP-007", incomingQty: 88000, returnQty: 20, defectRate: 0.023, ppm: 227, grade: "A" },
  { supplierName: "동양전기", supplierCode: "SUP-008", incomingQty: 75000, returnQty: 28, defectRate: 0.037, ppm: 373, grade: "B" },
];

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
};

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

export default function IncomingDefectsPage() {
  const [activeTab, setActiveTab] = useState("annual");
  const [selectedYear, setSelectedYear] = useState("2025");

  // Calculate annual summary
  const annualSummary2024: AnnualSummary = useMemo(() => {
    const totalIncoming = sample2024Data.reduce((sum, d) => sum + d.incomingQty, 0);
    const totalReturn = sample2024Data.reduce((sum, d) => sum + d.returnQty, 0);
    return {
      year: 2024,
      data: sample2024Data,
      totalIncoming,
      totalReturn,
      avgDefectRate: calculateDefectRate(totalReturn, totalIncoming),
      avgPpm: calculatePpm(totalReturn, totalIncoming),
    };
  }, []);

  const annualSummary2025: AnnualSummary = useMemo(() => {
    const activeData = sample2025Data.filter((d) => d.incomingQty > 0);
    const totalIncoming = activeData.reduce((sum, d) => sum + d.incomingQty, 0);
    const totalReturn = activeData.reduce((sum, d) => sum + d.returnQty, 0);
    return {
      year: 2025,
      data: sample2025Data,
      totalIncoming,
      totalReturn,
      avgDefectRate: calculateDefectRate(totalReturn, totalIncoming),
      avgPpm: calculatePpm(totalReturn, totalIncoming),
    };
  }, []);

  // Select data based on year
  const currentAnnualData = selectedYear === "2024" ? annualSummary2024 : annualSummary2025;
  const currentVehicleData = selectedYear === "2024" ? vehicleTypeData2024 : vehicleTypeData2025;
  const currentDefectTypeData = selectedYear === "2024" ? defectTypeData2024 : defectTypeData2025;
  const currentSupplierData = selectedYear === "2024" ? supplierData2024 : supplierData2025;

  // Calculate vehicle type totals
  const vehicleTotals = useMemo(() => {
    const totalIncoming = currentVehicleData.reduce((sum, d) => sum + d.incomingQty, 0);
    const totalReturn = currentVehicleData.reduce((sum, d) => sum + d.returnQty, 0);
    return {
      totalIncoming,
      totalReturn,
      avgDefectRate: calculateDefectRate(totalReturn, totalIncoming),
      avgPpm: calculatePpm(totalReturn, totalIncoming),
    };
  }, [currentVehicleData]);

  // Calculate defect type totals
  const defectTypeTotals = useMemo(() => {
    return currentDefectTypeData.reduce((sum, d) => sum + d.count, 0);
  }, [currentDefectTypeData]);

  // Calculate supplier totals
  const supplierTotals = useMemo(() => {
    const totalIncoming = currentSupplierData.reduce((sum, d) => sum + d.incomingQty, 0);
    const totalReturn = currentSupplierData.reduce((sum, d) => sum + d.returnQty, 0);
    return {
      totalIncoming,
      totalReturn,
      avgDefectRate: calculateDefectRate(totalReturn, totalIncoming),
      avgPpm: calculatePpm(totalReturn, totalIncoming),
    };
  }, [currentSupplierData]);

  // Group vehicle data by vehicle type
  const groupedVehicleData = useMemo(() => {
    const groups: Record<string, VehicleTypeData[]> = {};
    currentVehicleData.forEach((item) => {
      if (!groups[item.vehicleType]) {
        groups[item.vehicleType] = [];
      }
      groups[item.vehicleType].push(item);
    });
    return groups;
  }, [currentVehicleData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">입고불량 집계</h1>
          <p className="text-muted-foreground">입고 자재 불량 현황 및 분석</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="year">조회년도</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024년</SelectItem>
                <SelectItem value="2025">2025년</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ERP Path Info */}
      <Card className="bg-muted/50">
        <CardContent className="py-3">
          <div className="flex items-start gap-2 text-sm">
            <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="space-y-1">
              <p>
                <span className="font-medium">입고수량 조회:</span>{" "}
                <span className="text-muted-foreground">ERP / 물자관리 / 출력목록 / 입고현황 / 일자별</span>
              </p>
              <p>
                <span className="font-medium">반송수량 조회:</span>{" "}
                <span className="text-muted-foreground">ERP / 품질관리 / 검사관리목록 / 반송현황</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="annual">
            <CalendarDays className="mr-2 h-4 w-4" />
            년간 입고불량 집계
          </TabsTrigger>
          <TabsTrigger value="vehicle">
            <Car className="mr-2 h-4 w-4" />
            차종별 현황
          </TabsTrigger>
          <TabsTrigger value="defectType">
            <AlertTriangle className="mr-2 h-4 w-4" />
            유형별 현황
          </TabsTrigger>
          <TabsTrigger value="supplier">
            <Building2 className="mr-2 h-4 w-4" />
            업체별 현황
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Annual Summary */}
        <TabsContent value="annual">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 입고수량
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{currentAnnualData.totalIncoming.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 반송수량
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{currentAnnualData.totalReturn.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    불량율
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{currentAnnualData.avgDefectRate}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    PPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{currentAnnualData.avgPpm.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {selectedYear}년 월별 입고불량 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">월</TableHead>
                      <TableHead className="text-right">입고수량</TableHead>
                      <TableHead className="text-right">반송수량</TableHead>
                      <TableHead className="text-right">불량율 (%)</TableHead>
                      <TableHead className="text-right">PPM</TableHead>
                      <TableHead className="w-[150px]">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAnnualData.data.map((item) => (
                      <TableRow key={item.month} className={item.incomingQty === 0 ? "opacity-50" : ""}>
                        <TableCell className="font-medium">{months[item.month - 1]}</TableCell>
                        <TableCell className="text-right">
                          {item.incomingQty > 0 ? item.incomingQty.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.incomingQty > 0 ? item.returnQty.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.incomingQty > 0 ? item.defectRate.toFixed(3) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {item.incomingQty > 0 ? item.ppm.toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>
                          {item.incomingQty === 0 ? (
                            <Badge variant="outline">미집계</Badge>
                          ) : item.ppm < 300 ? (
                            <Badge variant="success">양호</Badge>
                          ) : item.ppm < 400 ? (
                            <Badge variant="warning">주의</Badge>
                          ) : (
                            <Badge variant="error">관리필요</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">합계/평균</TableCell>
                      <TableCell className="text-right font-bold">
                        {currentAnnualData.totalIncoming.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {currentAnnualData.totalReturn.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {currentAnnualData.avgDefectRate}
                      </TableCell>
                      <TableCell className="text-right font-bold font-mono">
                        {currentAnnualData.avgPpm.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            {/* PPM Calculation Info */}
            <Card className="bg-blue-50">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Info className="h-4 w-4" />
                  <span>
                    <strong>PPM 계산식:</strong> (불량수 / 입고수) x 1,000,000
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: By Vehicle Type */}
        <TabsContent value="vehicle">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    차종 수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{Object.keys(groupedVehicleData).length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 입고수량
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{vehicleTotals.totalIncoming.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 반송수량
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{vehicleTotals.totalReturn.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평균 PPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{vehicleTotals.avgPpm.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Vehicle Type Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {selectedYear}년 차종별 입고불량 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>차종</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead className="text-right">입고수량</TableHead>
                      <TableHead className="text-right">반송수량</TableHead>
                      <TableHead className="text-right">불량율 (%)</TableHead>
                      <TableHead className="text-right">PPM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(groupedVehicleData).map(([vehicleType, items]) => (
                      items.map((item, index) => {
                        const isFirst = index === 0;
                        const vehicleTotal = items.reduce((sum, i) => sum + i.incomingQty, 0);
                        const vehicleReturn = items.reduce((sum, i) => sum + i.returnQty, 0);
                        return (
                          <TableRow key={`${vehicleType}-${item.partName}`}>
                            {isFirst ? (
                              <TableCell
                                className="font-bold bg-muted/50 align-top"
                                rowSpan={items.length}
                              >
                                <div>{vehicleType}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  소계: {vehicleTotal.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  PPM: {calculatePpm(vehicleReturn, vehicleTotal).toLocaleString()}
                                </div>
                              </TableCell>
                            ) : null}
                            <TableCell>{item.partName}</TableCell>
                            <TableCell className="text-right">{item.incomingQty.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.returnQty.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.defectRate.toFixed(3)}</TableCell>
                            <TableCell className="text-right font-mono">{item.ppm.toLocaleString()}</TableCell>
                          </TableRow>
                        );
                      })
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">합계/평균</TableCell>
                      <TableCell className="text-right font-bold">
                        {vehicleTotals.totalIncoming.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {vehicleTotals.totalReturn.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {vehicleTotals.avgDefectRate}
                      </TableCell>
                      <TableCell className="text-right font-bold font-mono">
                        {vehicleTotals.avgPpm.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: By Defect Type */}
        <TabsContent value="defectType">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 불량건수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{defectTypeTotals.toLocaleString()}건</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    유형 수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{currentDefectTypeData.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    최다 불량유형
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    {currentDefectTypeData[0]?.defectType || "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentDefectTypeData[0]?.percentage || 0}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Defect Type Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {selectedYear}년 유형별 입고불량 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">순위</TableHead>
                      <TableHead>불량유형</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead className="text-right">건수</TableHead>
                      <TableHead className="text-right">비율 (%)</TableHead>
                      <TableHead className="w-[200px]">점유율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDefectTypeData.map((item, index) => (
                      <TableRow key={item.defectType}>
                        <TableCell className="font-bold">{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.defectType}</TableCell>
                        <TableCell className="text-muted-foreground">{item.description}</TableCell>
                        <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  index === 0
                                    ? "bg-red-500"
                                    : index === 1
                                    ? "bg-orange-500"
                                    : index === 2
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold">합계</TableCell>
                      <TableCell className="text-right font-bold">
                        {defectTypeTotals.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">100.0%</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            {/* Pareto Note */}
            <Card className="bg-yellow-50">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    <strong>파레토 분석:</strong> 상위 3개 유형(외관불량, 치수불량, 기능불량)이 전체 불량의{" "}
                    {(
                      currentDefectTypeData.slice(0, 3).reduce((sum, d) => sum + d.percentage, 0)
                    ).toFixed(1)}
                    %를 차지합니다. 집중 관리가 필요합니다.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: By Supplier */}
        <TabsContent value="supplier">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    업체 수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{currentSupplierData.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 입고수량
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{supplierTotals.totalIncoming.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    총 반송수량
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">{supplierTotals.totalReturn.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평균 PPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{supplierTotals.avgPpm.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Grade Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50">
                <CardContent className="py-4 text-center">
                  <p className="text-sm text-green-700 font-medium">A등급 (PPM 300 미만)</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {currentSupplierData.filter((s) => s.grade === "A").length}개사
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50">
                <CardContent className="py-4 text-center">
                  <p className="text-sm text-blue-700 font-medium">B등급 (PPM 300-400)</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {currentSupplierData.filter((s) => s.grade === "B").length}개사
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50">
                <CardContent className="py-4 text-center">
                  <p className="text-sm text-yellow-700 font-medium">C등급 (PPM 400-500)</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-1">
                    {currentSupplierData.filter((s) => s.grade === "C").length}개사
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="py-4 text-center">
                  <p className="text-sm text-red-700 font-medium">D등급 (PPM 500 이상)</p>
                  <p className="text-3xl font-bold text-red-700 mt-1">
                    {currentSupplierData.filter((s) => s.grade === "D").length}개사
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Supplier Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedYear}년 업체별 입고불량 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체코드</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead className="text-right">입고수량</TableHead>
                      <TableHead className="text-right">반송수량</TableHead>
                      <TableHead className="text-right">불량율 (%)</TableHead>
                      <TableHead className="text-right">PPM</TableHead>
                      <TableHead className="w-[80px]">등급</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSupplierData
                      .sort((a, b) => a.ppm - b.ppm)
                      .map((item) => (
                        <TableRow key={item.supplierCode}>
                          <TableCell className="font-mono">{item.supplierCode}</TableCell>
                          <TableCell className="font-medium">{item.supplierName}</TableCell>
                          <TableCell className="text-right">{item.incomingQty.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.returnQty.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.defectRate.toFixed(3)}</TableCell>
                          <TableCell className="text-right font-mono">{item.ppm.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${gradeColors[item.grade]}`}
                            >
                              {item.grade}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">합계/평균</TableCell>
                      <TableCell className="text-right font-bold">
                        {supplierTotals.totalIncoming.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {supplierTotals.totalReturn.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {supplierTotals.avgDefectRate}
                      </TableCell>
                      <TableCell className="text-right font-bold font-mono">
                        {supplierTotals.avgPpm.toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>

            {/* Grade Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">업체 등급 기준</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors.A}`}>A등급</span>
                    <span>PPM 300 미만 - 우수업체</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors.B}`}>B등급</span>
                    <span>PPM 300-400 - 양호업체</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors.C}`}>C등급</span>
                    <span>PPM 400-500 - 관리대상</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors.D}`}>D등급</span>
                    <span>PPM 500 이상 - 개선요구</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
