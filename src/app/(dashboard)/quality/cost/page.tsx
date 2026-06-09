"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DollarSign, Save, TrendingUp, BarChart3, Calendar } from "lucide-react";

// Types
interface QualityCostEntry {
  id: string;
  yearMonth: string;
  // Prevention costs
  preventionTraining: number;
  preventionQualityPlanning: number;
  preventionProcessControl: number;
  // Appraisal costs
  appraisalInspection: number;
  appraisalTesting: number;
  appraisalMeasurementManagement: number;
  // Internal failure costs
  internalDefects: number;
  internalRework: number;
  internalScrap: number;
  // External failure costs
  externalClaims: number;
  externalWarranty: number;
  externalRecall: number;
  // Revenue for ratio calculation
  revenue: number;
  // Target
  targetRatio: number;
}

interface CostFormData {
  yearMonth: string;
  preventionTraining: string;
  preventionQualityPlanning: string;
  preventionProcessControl: string;
  appraisalInspection: string;
  appraisalTesting: string;
  appraisalMeasurementManagement: string;
  internalDefects: string;
  internalRework: string;
  internalScrap: string;
  externalClaims: string;
  externalWarranty: string;
  externalRecall: string;
  revenue: string;
  targetRatio: string;
}

// Sample data
const sampleData: QualityCostEntry[] = [
  {
    id: "1",
    yearMonth: "2026-01",
    preventionTraining: 5000000,
    preventionQualityPlanning: 3000000,
    preventionProcessControl: 4000000,
    appraisalInspection: 8000000,
    appraisalTesting: 6000000,
    appraisalMeasurementManagement: 2000000,
    internalDefects: 10000000,
    internalRework: 5000000,
    internalScrap: 3000000,
    externalClaims: 15000000,
    externalWarranty: 8000000,
    externalRecall: 0,
    revenue: 2000000000,
    targetRatio: 3.0,
  },
  {
    id: "2",
    yearMonth: "2026-02",
    preventionTraining: 5500000,
    preventionQualityPlanning: 3200000,
    preventionProcessControl: 4200000,
    appraisalInspection: 7500000,
    appraisalTesting: 5800000,
    appraisalMeasurementManagement: 2100000,
    internalDefects: 9000000,
    internalRework: 4500000,
    internalScrap: 2800000,
    externalClaims: 12000000,
    externalWarranty: 7000000,
    externalRecall: 0,
    revenue: 2100000000,
    targetRatio: 3.0,
  },
  {
    id: "3",
    yearMonth: "2026-03",
    preventionTraining: 6000000,
    preventionQualityPlanning: 3500000,
    preventionProcessControl: 4500000,
    appraisalInspection: 7000000,
    appraisalTesting: 5500000,
    appraisalMeasurementManagement: 2000000,
    internalDefects: 8000000,
    internalRework: 4000000,
    internalScrap: 2500000,
    externalClaims: 10000000,
    externalWarranty: 6000000,
    externalRecall: 0,
    revenue: 2200000000,
    targetRatio: 3.0,
  },
  {
    id: "4",
    yearMonth: "2026-04",
    preventionTraining: 6200000,
    preventionQualityPlanning: 3800000,
    preventionProcessControl: 4800000,
    appraisalInspection: 6800000,
    appraisalTesting: 5200000,
    appraisalMeasurementManagement: 1900000,
    internalDefects: 7500000,
    internalRework: 3800000,
    internalScrap: 2300000,
    externalClaims: 9000000,
    externalWarranty: 5500000,
    externalRecall: 0,
    revenue: 2300000000,
    targetRatio: 2.8,
  },
  {
    id: "5",
    yearMonth: "2026-05",
    preventionTraining: 6500000,
    preventionQualityPlanning: 4000000,
    preventionProcessControl: 5000000,
    appraisalInspection: 6500000,
    appraisalTesting: 5000000,
    appraisalMeasurementManagement: 1800000,
    internalDefects: 7000000,
    internalRework: 3500000,
    internalScrap: 2000000,
    externalClaims: 8000000,
    externalWarranty: 5000000,
    externalRecall: 0,
    revenue: 2400000000,
    targetRatio: 2.8,
  },
];

// Sample data for year comparison
const yearComparisonData = {
  "2024": {
    prevention: 120000000,
    appraisal: 160000000,
    internalFailure: 200000000,
    externalFailure: 280000000,
    revenue: 22000000000,
  },
  "2025": {
    prevention: 140000000,
    appraisal: 180000000,
    internalFailure: 180000000,
    externalFailure: 220000000,
    revenue: 24000000000,
  },
  "2026": {
    prevention: 77000000,
    appraisal: 70800000,
    internalFailure: 66100000,
    externalFailure: 95500000,
    revenue: 11000000000,
  },
};

const initialFormData: CostFormData = {
  yearMonth: "",
  preventionTraining: "",
  preventionQualityPlanning: "",
  preventionProcessControl: "",
  appraisalInspection: "",
  appraisalTesting: "",
  appraisalMeasurementManagement: "",
  internalDefects: "",
  internalRework: "",
  internalScrap: "",
  externalClaims: "",
  externalWarranty: "",
  externalRecall: "",
  revenue: "",
  targetRatio: "3.0",
};

// Helper functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("ko-KR").format(value);
};

const formatPercent = (value: number): string => {
  return value.toFixed(2) + "%";
};

const calculateTotals = (entry: QualityCostEntry) => {
  const prevention =
    entry.preventionTraining +
    entry.preventionQualityPlanning +
    entry.preventionProcessControl;
  const appraisal =
    entry.appraisalInspection +
    entry.appraisalTesting +
    entry.appraisalMeasurementManagement;
  const internalFailure =
    entry.internalDefects + entry.internalRework + entry.internalScrap;
  const externalFailure =
    entry.externalClaims + entry.externalWarranty + entry.externalRecall;
  const total = prevention + appraisal + internalFailure + externalFailure;
  const ratio = entry.revenue > 0 ? (total / entry.revenue) * 100 : 0;

  return {
    prevention,
    appraisal,
    internalFailure,
    externalFailure,
    total,
    ratio,
  };
};

export default function QualityCostPage() {
  const [activeTab, setActiveTab] = useState("entry");
  const [formData, setFormData] = useState<CostFormData>(initialFormData);
  const [costData, setCostData] = useState<QualityCostEntry[]>(sampleData);
  const [selectedYear, setSelectedYear] = useState("2026");

  const updateField = <K extends keyof CostFormData>(
    field: K,
    value: CostFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.yearMonth) {
      alert("년월을 선택해주세요.");
      return;
    }

    const newEntry: QualityCostEntry = {
      id: Date.now().toString(),
      yearMonth: formData.yearMonth,
      preventionTraining: parseFloat(formData.preventionTraining) || 0,
      preventionQualityPlanning:
        parseFloat(formData.preventionQualityPlanning) || 0,
      preventionProcessControl:
        parseFloat(formData.preventionProcessControl) || 0,
      appraisalInspection: parseFloat(formData.appraisalInspection) || 0,
      appraisalTesting: parseFloat(formData.appraisalTesting) || 0,
      appraisalMeasurementManagement:
        parseFloat(formData.appraisalMeasurementManagement) || 0,
      internalDefects: parseFloat(formData.internalDefects) || 0,
      internalRework: parseFloat(formData.internalRework) || 0,
      internalScrap: parseFloat(formData.internalScrap) || 0,
      externalClaims: parseFloat(formData.externalClaims) || 0,
      externalWarranty: parseFloat(formData.externalWarranty) || 0,
      externalRecall: parseFloat(formData.externalRecall) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      targetRatio: parseFloat(formData.targetRatio) || 3.0,
    };

    setCostData((prev) => [...prev, newEntry]);
    setFormData(initialFormData);
    alert("품질비용 데이터가 저장되었습니다.");
  };

  // Calculate aggregated data for analysis
  const aggregatedData = costData.reduce(
    (acc, entry) => {
      const totals = calculateTotals(entry);
      return {
        prevention: acc.prevention + totals.prevention,
        appraisal: acc.appraisal + totals.appraisal,
        internalFailure: acc.internalFailure + totals.internalFailure,
        externalFailure: acc.externalFailure + totals.externalFailure,
        total: acc.total + totals.total,
        revenue: acc.revenue + entry.revenue,
      };
    },
    {
      prevention: 0,
      appraisal: 0,
      internalFailure: 0,
      externalFailure: 0,
      total: 0,
      revenue: 0,
    }
  );

  const overallRatio =
    aggregatedData.revenue > 0
      ? (aggregatedData.total / aggregatedData.revenue) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">품질비용 관리</h1>
          <p className="text-muted-foreground">
            IATF 16949 기반 품질비용 (Cost of Poor Quality) 분석
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry">품질비용 입력</TabsTrigger>
          <TabsTrigger value="analysis">비용 분석</TabsTrigger>
          <TabsTrigger value="trend">월별 추이</TabsTrigger>
          <TabsTrigger value="comparison">년간 비교</TabsTrigger>
        </TabsList>

        {/* Tab 1: Cost Entry */}
        <TabsContent value="entry">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  품질비용 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Year Month and Revenue */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearMonth">년월</Label>
                    <Input
                      id="yearMonth"
                      type="month"
                      value={formData.yearMonth}
                      onChange={(e) => updateField("yearMonth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">매출액 (원)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={formData.revenue}
                      onChange={(e) => updateField("revenue", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetRatio">목표 비율 (%)</Label>
                    <Input
                      id="targetRatio"
                      type="number"
                      step="0.1"
                      value={formData.targetRatio}
                      onChange={(e) => updateField("targetRatio", e.target.value)}
                      placeholder="3.0"
                    />
                  </div>
                </div>

                {/* Prevention Costs */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">
                    예방비용 (Prevention Cost)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preventionTraining">교육비용 (원)</Label>
                      <Input
                        id="preventionTraining"
                        type="number"
                        value={formData.preventionTraining}
                        onChange={(e) =>
                          updateField("preventionTraining", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preventionQualityPlanning">
                        품질계획비용 (원)
                      </Label>
                      <Input
                        id="preventionQualityPlanning"
                        type="number"
                        value={formData.preventionQualityPlanning}
                        onChange={(e) =>
                          updateField("preventionQualityPlanning", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preventionProcessControl">
                        공정관리비용 (원)
                      </Label>
                      <Input
                        id="preventionProcessControl"
                        type="number"
                        value={formData.preventionProcessControl}
                        onChange={(e) =>
                          updateField("preventionProcessControl", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Appraisal Costs */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">
                    평가비용 (Appraisal Cost)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="appraisalInspection">검사비용 (원)</Label>
                      <Input
                        id="appraisalInspection"
                        type="number"
                        value={formData.appraisalInspection}
                        onChange={(e) =>
                          updateField("appraisalInspection", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appraisalTesting">시험비용 (원)</Label>
                      <Input
                        id="appraisalTesting"
                        type="number"
                        value={formData.appraisalTesting}
                        onChange={(e) =>
                          updateField("appraisalTesting", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appraisalMeasurementManagement">
                        계측기 관리비용 (원)
                      </Label>
                      <Input
                        id="appraisalMeasurementManagement"
                        type="number"
                        value={formData.appraisalMeasurementManagement}
                        onChange={(e) =>
                          updateField(
                            "appraisalMeasurementManagement",
                            e.target.value
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Internal Failure Costs */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 text-orange-600">
                    내부실패비용 (Internal Failure Cost)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="internalDefects">불량비용 (원)</Label>
                      <Input
                        id="internalDefects"
                        type="number"
                        value={formData.internalDefects}
                        onChange={(e) =>
                          updateField("internalDefects", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalRework">재작업비용 (원)</Label>
                      <Input
                        id="internalRework"
                        type="number"
                        value={formData.internalRework}
                        onChange={(e) =>
                          updateField("internalRework", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="internalScrap">폐기비용 (원)</Label>
                      <Input
                        id="internalScrap"
                        type="number"
                        value={formData.internalScrap}
                        onChange={(e) =>
                          updateField("internalScrap", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* External Failure Costs */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">
                    외부실패비용 (External Failure Cost)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="externalClaims">클레임비용 (원)</Label>
                      <Input
                        id="externalClaims"
                        type="number"
                        value={formData.externalClaims}
                        onChange={(e) =>
                          updateField("externalClaims", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalWarranty">보증비용 (원)</Label>
                      <Input
                        id="externalWarranty"
                        type="number"
                        value={formData.externalWarranty}
                        onChange={(e) =>
                          updateField("externalWarranty", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalRecall">리콜비용 (원)</Label>
                      <Input
                        id="externalRecall"
                        type="number"
                        value={formData.externalRecall}
                        onChange={(e) =>
                          updateField("externalRecall", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>입력된 품질비용 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>년월</TableHead>
                      <TableHead className="text-right">예방비용</TableHead>
                      <TableHead className="text-right">평가비용</TableHead>
                      <TableHead className="text-right">내부실패비용</TableHead>
                      <TableHead className="text-right">외부실패비용</TableHead>
                      <TableHead className="text-right">총 품질비용</TableHead>
                      <TableHead className="text-right">매출대비비율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costData.map((entry) => {
                      const totals = calculateTotals(entry);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.yearMonth}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(totals.prevention)}
                          </TableCell>
                          <TableCell className="text-right text-blue-600">
                            {formatCurrency(totals.appraisal)}
                          </TableCell>
                          <TableCell className="text-right text-orange-600">
                            {formatCurrency(totals.internalFailure)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(totals.externalFailure)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(totals.total)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              totals.ratio > entry.targetRatio
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatPercent(totals.ratio)}
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

        {/* Tab 2: Cost Analysis */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    예방비용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(aggregatedData.prevention)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aggregatedData.total > 0
                      ? formatPercent(
                          (aggregatedData.prevention / aggregatedData.total) * 100
                        )
                      : "0%"}{" "}
                    of total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    평가비용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(aggregatedData.appraisal)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aggregatedData.total > 0
                      ? formatPercent(
                          (aggregatedData.appraisal / aggregatedData.total) * 100
                        )
                      : "0%"}{" "}
                    of total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    내부실패비용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(aggregatedData.internalFailure)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aggregatedData.total > 0
                      ? formatPercent(
                          (aggregatedData.internalFailure / aggregatedData.total) *
                            100
                        )
                      : "0%"}{" "}
                    of total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    외부실패비용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(aggregatedData.externalFailure)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aggregatedData.total > 0
                      ? formatPercent(
                          (aggregatedData.externalFailure / aggregatedData.total) *
                            100
                        )
                      : "0%"}{" "}
                    of total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cost Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  비용 구성비
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Visual Bar Chart */}
                  <div className="h-8 flex rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${
                          aggregatedData.total > 0
                            ? (aggregatedData.prevention / aggregatedData.total) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {aggregatedData.total > 0 &&
                        (aggregatedData.prevention / aggregatedData.total) * 100 >
                          5 &&
                        "예방"}
                    </div>
                    <div
                      className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${
                          aggregatedData.total > 0
                            ? (aggregatedData.appraisal / aggregatedData.total) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {aggregatedData.total > 0 &&
                        (aggregatedData.appraisal / aggregatedData.total) * 100 >
                          5 &&
                        "평가"}
                    </div>
                    <div
                      className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${
                          aggregatedData.total > 0
                            ? (aggregatedData.internalFailure /
                                aggregatedData.total) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {aggregatedData.total > 0 &&
                        (aggregatedData.internalFailure / aggregatedData.total) *
                          100 >
                          5 &&
                        "내부실패"}
                    </div>
                    <div
                      className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${
                          aggregatedData.total > 0
                            ? (aggregatedData.externalFailure /
                                aggregatedData.total) *
                              100
                            : 0
                        }%`,
                      }}
                    >
                      {aggregatedData.total > 0 &&
                        (aggregatedData.externalFailure / aggregatedData.total) *
                          100 >
                          5 &&
                        "외부실패"}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500" />
                      <span>
                        예방비용:{" "}
                        {aggregatedData.total > 0
                          ? formatPercent(
                              (aggregatedData.prevention / aggregatedData.total) *
                                100
                            )
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500" />
                      <span>
                        평가비용:{" "}
                        {aggregatedData.total > 0
                          ? formatPercent(
                              (aggregatedData.appraisal / aggregatedData.total) *
                                100
                            )
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500" />
                      <span>
                        내부실패:{" "}
                        {aggregatedData.total > 0
                          ? formatPercent(
                              (aggregatedData.internalFailure /
                                aggregatedData.total) *
                                100
                            )
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500" />
                      <span>
                        외부실패:{" "}
                        {aggregatedData.total > 0
                          ? formatPercent(
                              (aggregatedData.externalFailure /
                                aggregatedData.total) *
                                100
                            )
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Ratio & Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>매출 대비 품질비용 비율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {formatPercent(overallRatio)}
                      </div>
                      <p className="text-muted-foreground mt-2">
                        총 품질비용 / 총 매출액
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">총 품질비용</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(aggregatedData.total)} 원
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">총 매출액</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(aggregatedData.revenue)} 원
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>목표 대비 실적</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>년월</TableHead>
                          <TableHead className="text-right">목표</TableHead>
                          <TableHead className="text-right">실적</TableHead>
                          <TableHead className="text-right">달성</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costData.slice(-5).map((entry) => {
                          const totals = calculateTotals(entry);
                          const achieved = totals.ratio <= entry.targetRatio;
                          return (
                            <TableRow key={entry.id}>
                              <TableCell>{entry.yearMonth}</TableCell>
                              <TableCell className="text-right">
                                {formatPercent(entry.targetRatio)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatPercent(totals.ratio)}
                              </TableCell>
                              <TableCell
                                className={`text-right font-semibold ${
                                  achieved ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {achieved ? "O" : "X"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Monthly Trend */}
        <TabsContent value="trend">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  비용 유형별 월별 추이
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>년월</TableHead>
                      <TableHead className="text-right">예방비용</TableHead>
                      <TableHead className="text-right">평가비용</TableHead>
                      <TableHead className="text-right">내부실패비용</TableHead>
                      <TableHead className="text-right">외부실패비용</TableHead>
                      <TableHead className="text-right">총 품질비용</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costData.map((entry) => {
                      const totals = calculateTotals(entry);
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.yearMonth}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totals.prevention)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totals.appraisal)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totals.internalFailure)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(totals.externalFailure)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(totals.total)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Trend Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>품질비용 비율 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costData.map((entry) => {
                    const totals = calculateTotals(entry);
                    const barWidth = Math.min(totals.ratio * 20, 100);
                    return (
                      <div key={entry.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{entry.yearMonth}</span>
                          <span
                            className={
                              totals.ratio > entry.targetRatio
                                ? "text-red-600 font-medium"
                                : "text-green-600 font-medium"
                            }
                          >
                            {formatPercent(totals.ratio)} (목표:{" "}
                            {formatPercent(entry.targetRatio)})
                          </span>
                        </div>
                        <div className="relative h-6 bg-muted rounded overflow-hidden">
                          <div
                            className={`h-full ${
                              totals.ratio > entry.targetRatio
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                          <div
                            className="absolute top-0 h-full w-0.5 bg-yellow-500"
                            style={{ left: `${entry.targetRatio * 20}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span>목표 달성</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded" />
                      <span>목표 미달</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-yellow-500" />
                      <span>목표선</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Failure Cost Trend */}
            <Card>
              <CardHeader>
                <CardTitle>실패비용 추이 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    실패비용(내부+외부)의 감소 추세를 통해 품질 개선 효과를
                    확인합니다.
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>년월</TableHead>
                        <TableHead className="text-right">실패비용 합계</TableHead>
                        <TableHead className="text-right">전월 대비</TableHead>
                        <TableHead className="text-right">
                          실패비용 비중
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costData.map((entry, index) => {
                        const totals = calculateTotals(entry);
                        const failureCost =
                          totals.internalFailure + totals.externalFailure;
                        const prevEntry = index > 0 ? costData[index - 1] : null;
                        const prevTotals = prevEntry
                          ? calculateTotals(prevEntry)
                          : null;
                        const prevFailureCost = prevTotals
                          ? prevTotals.internalFailure + prevTotals.externalFailure
                          : null;
                        const change =
                          prevFailureCost !== null
                            ? ((failureCost - prevFailureCost) / prevFailureCost) *
                              100
                            : null;
                        const failureRatio =
                          totals.total > 0
                            ? (failureCost / totals.total) * 100
                            : 0;

                        return (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.yearMonth}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(failureCost)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${
                                change !== null
                                  ? change < 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                  : ""
                              }`}
                            >
                              {change !== null
                                ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPercent(failureRatio)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Year Comparison */}
        <TabsContent value="comparison">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  년간 품질비용 비교
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="yearSelect">비교 연도 선택</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-48 mt-2">
                      <SelectValue placeholder="연도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2026">2026년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>비용 구분</TableHead>
                      <TableHead className="text-right">2024년</TableHead>
                      <TableHead className="text-right">2025년</TableHead>
                      <TableHead className="text-right">2026년 (누적)</TableHead>
                      <TableHead className="text-right">전년 대비 증감</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-green-600">
                        예방비용
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2024"].prevention)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2025"].prevention)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2026"].prevention)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        +16.7%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-blue-600">
                        평가비용
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2024"].appraisal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2025"].appraisal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2026"].appraisal)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        +12.5%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-orange-600">
                        내부실패비용
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2024"].internalFailure)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2025"].internalFailure)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2026"].internalFailure)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        -10.0%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">
                        외부실패비용
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2024"].externalFailure)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2025"].externalFailure)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(yearComparisonData["2026"].externalFailure)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        -21.4%
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold border-t-2">
                      <TableCell>총 품질비용</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          yearComparisonData["2024"].prevention +
                            yearComparisonData["2024"].appraisal +
                            yearComparisonData["2024"].internalFailure +
                            yearComparisonData["2024"].externalFailure
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          yearComparisonData["2025"].prevention +
                            yearComparisonData["2025"].appraisal +
                            yearComparisonData["2025"].internalFailure +
                            yearComparisonData["2025"].externalFailure
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          yearComparisonData["2026"].prevention +
                            yearComparisonData["2026"].appraisal +
                            yearComparisonData["2026"].internalFailure +
                            yearComparisonData["2026"].externalFailure
                        )}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        -5.3%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Year-over-Year Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>매출 대비 품질비용 비율 (연간)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(yearComparisonData).map(([year, data]) => {
                      const total =
                        data.prevention +
                        data.appraisal +
                        data.internalFailure +
                        data.externalFailure;
                      const ratio = (total / data.revenue) * 100;
                      return (
                        <div key={year} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{year}년</span>
                            <span>{formatPercent(ratio)}</span>
                          </div>
                          <div className="h-4 bg-muted rounded overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${ratio * 15}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>비용 구조 변화 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800">긍정적 변화</h4>
                      <ul className="mt-2 space-y-1 text-green-700">
                        <li>
                          - 예방비용 증가: 품질 예방 활동 강화
                        </li>
                        <li>
                          - 외부실패비용 감소: 고객 클레임 감소
                        </li>
                        <li>
                          - 내부실패비용 감소: 공정 불량률 개선
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800">개선 필요</h4>
                      <ul className="mt-2 space-y-1 text-yellow-700">
                        <li>
                          - 평가비용 최적화 검토 필요
                        </li>
                        <li>
                          - 예방/평가 비용 대비 실패비용 비율 모니터링
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800">권장 사항</h4>
                      <ul className="mt-2 space-y-1 text-blue-700">
                        <li>
                          - 예방활동 투자 지속 확대
                        </li>
                        <li>
                          - 품질비용 목표: 매출 대비 2.5% 이하
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>COPQ (Cost of Poor Quality) 지표</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      총 실패비용 (2026 누적)
                    </p>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                      {formatCurrency(
                        yearComparisonData["2026"].internalFailure +
                          yearComparisonData["2026"].externalFailure
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      내부실패 + 외부실패
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      실패비용 비중
                    </p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      {formatPercent(
                        ((yearComparisonData["2026"].internalFailure +
                          yearComparisonData["2026"].externalFailure) /
                          (yearComparisonData["2026"].prevention +
                            yearComparisonData["2026"].appraisal +
                            yearComparisonData["2026"].internalFailure +
                            yearComparisonData["2026"].externalFailure)) *
                          100
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      총 품질비용 대비
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      예방/평가 투자 효율
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {(
                        (yearComparisonData["2026"].internalFailure +
                          yearComparisonData["2026"].externalFailure) /
                        (yearComparisonData["2026"].prevention +
                          yearComparisonData["2026"].appraisal)
                      ).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      실패비용 / (예방+평가)비용
                    </p>
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
