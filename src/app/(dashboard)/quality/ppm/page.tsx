"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, TrendingUp, BarChart3, Calendar } from "lucide-react";

interface PPMRecord {
  id: number;
  customer: string;
  deliveredQty: number;
  claimQty: number;
  ppm: number;
  targetPpm: number;
  achieved: boolean;
}

interface MonthlyData {
  month: number;
  records: PPMRecord[];
}

const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
const months = [
  { value: 1, label: "1월" },
  { value: 2, label: "2월" },
  { value: 3, label: "3월" },
  { value: 4, label: "4월" },
  { value: 5, label: "5월" },
  { value: 6, label: "6월" },
  { value: 7, label: "7월" },
  { value: 8, label: "8월" },
  { value: 9, label: "9월" },
  { value: 10, label: "10월" },
  { value: 11, label: "11월" },
  { value: 12, label: "12월" },
];

const productGroups = ["전체", "A그룹", "B그룹", "C그룹", "D그룹"];

const initialCustomers = [
  "삼성전자",
  "LG전자",
  "현대자동차",
  "SK하이닉스",
  "포스코",
];

export default function PPMManagementPage() {
  const [activeTab, setActiveTab] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1)
  );
  const [selectedProductGroup, setSelectedProductGroup] = useState("전체");

  // Monthly PPM data keyed by "year-month"
  const [monthlyDataMap, setMonthlyDataMap] = useState<
    Record<string, PPMRecord[]>
  >(() => {
    // Initialize with sample data
    const initialData: Record<string, PPMRecord[]> = {};
    const key = `${currentYear}-${new Date().getMonth() + 1}`;
    initialData[key] = initialCustomers.map((customer, index) => ({
      id: index + 1,
      customer,
      deliveredQty: Math.floor(Math.random() * 100000) + 10000,
      claimQty: Math.floor(Math.random() * 50),
      ppm: 0,
      targetPpm: 100,
      achieved: false,
    }));
    // Calculate PPM for initial data
    initialData[key] = initialData[key].map((record) => {
      const ppm =
        record.deliveredQty > 0
          ? Math.round((record.claimQty / record.deliveredQty) * 1000000)
          : 0;
      return {
        ...record,
        ppm,
        achieved: ppm <= record.targetPpm,
      };
    });
    return initialData;
  });

  const currentKey = `${selectedYear}-${selectedMonth}`;
  const currentRecords = monthlyDataMap[currentKey] || [];

  const calculatePPM = (claimQty: number, deliveredQty: number): number => {
    if (deliveredQty === 0) return 0;
    return Math.round((claimQty / deliveredQty) * 1000000);
  };

  const updateRecord = (
    id: number,
    field: keyof PPMRecord,
    value: string | number
  ) => {
    setMonthlyDataMap((prev) => {
      const records = prev[currentKey] || [];
      const updatedRecords = records.map((record) => {
        if (record.id !== id) return record;

        const updated = { ...record, [field]: value };

        // Recalculate PPM if quantity fields change
        if (field === "deliveredQty" || field === "claimQty") {
          const deliveredQty =
            field === "deliveredQty"
              ? Number(value)
              : Number(updated.deliveredQty);
          const claimQty =
            field === "claimQty" ? Number(value) : Number(updated.claimQty);
          updated.ppm = calculatePPM(claimQty, deliveredQty);
          updated.achieved = updated.ppm <= updated.targetPpm;
        }

        // Recalculate achieved status if target changes
        if (field === "targetPpm") {
          updated.achieved = updated.ppm <= Number(value);
        }

        return updated;
      });

      return { ...prev, [currentKey]: updatedRecords };
    });
  };

  const addRecord = () => {
    const newId =
      currentRecords.length > 0
        ? Math.max(...currentRecords.map((r) => r.id)) + 1
        : 1;
    const newRecord: PPMRecord = {
      id: newId,
      customer: "",
      deliveredQty: 0,
      claimQty: 0,
      ppm: 0,
      targetPpm: 100,
      achieved: true,
    };
    setMonthlyDataMap((prev) => ({
      ...prev,
      [currentKey]: [...(prev[currentKey] || []), newRecord],
    }));
  };

  const deleteRecord = (id: number) => {
    setMonthlyDataMap((prev) => ({
      ...prev,
      [currentKey]: (prev[currentKey] || []).filter((r) => r.id !== id),
    }));
  };

  // Get customer trend data (all months for selected year)
  const getCustomerTrendData = () => {
    const customers = new Set<string>();
    const trendData: Record<string, Record<number, number>> = {};

    // Collect all unique customers and their monthly PPM
    Object.entries(monthlyDataMap).forEach(([key, records]) => {
      const [year, month] = key.split("-").map(Number);
      if (year === Number(selectedYear)) {
        records.forEach((record) => {
          if (record.customer) {
            customers.add(record.customer);
            if (!trendData[record.customer]) {
              trendData[record.customer] = {};
            }
            trendData[record.customer][month] = record.ppm;
          }
        });
      }
    });

    return { customers: Array.from(customers), trendData };
  };

  // Get annual summary data
  const getAnnualSummary = () => {
    const summary: Record<
      string,
      {
        totalDelivered: number;
        totalClaim: number;
        ppm: number;
        targetPpm: number;
        monthsAchieved: number;
        totalMonths: number;
      }
    > = {};

    Object.entries(monthlyDataMap).forEach(([key, records]) => {
      const [year] = key.split("-").map(Number);
      if (year === Number(selectedYear)) {
        records.forEach((record) => {
          if (record.customer) {
            if (!summary[record.customer]) {
              summary[record.customer] = {
                totalDelivered: 0,
                totalClaim: 0,
                ppm: 0,
                targetPpm: record.targetPpm,
                monthsAchieved: 0,
                totalMonths: 0,
              };
            }
            summary[record.customer].totalDelivered += record.deliveredQty;
            summary[record.customer].totalClaim += record.claimQty;
            summary[record.customer].totalMonths += 1;
            if (record.achieved) {
              summary[record.customer].monthsAchieved += 1;
            }
          }
        });
      }
    });

    // Calculate annual PPM
    Object.keys(summary).forEach((customer) => {
      const data = summary[customer];
      data.ppm = calculatePPM(data.totalClaim, data.totalDelivered);
    });

    return summary;
  };

  const { customers: trendCustomers, trendData } = getCustomerTrendData();
  const annualSummary = getAnnualSummary();

  // Calculate monthly totals
  const monthlyTotals = currentRecords.reduce(
    (acc, record) => ({
      deliveredQty: acc.deliveredQty + record.deliveredQty,
      claimQty: acc.claimQty + record.claimQty,
    }),
    { deliveredQty: 0, claimQty: 0 }
  );
  const totalPPM = calculatePPM(monthlyTotals.claimQty, monthlyTotals.deliveredQty);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PPM 관리</h1>
          <p className="text-muted-foreground">
            고객별 품질 불량률(PPM) 추적 및 관리
          </p>
        </div>
      </div>

      {/* Header Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>연도</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="연도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>월</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>제품군</Label>
              <Select
                value={selectedProductGroup}
                onValueChange={setSelectedProductGroup}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="제품군 선택" />
                </SelectTrigger>
                <SelectContent>
                  {productGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="monthly">
            <Calendar className="mr-2 h-4 w-4" />
            월별 PPM 현황
          </TabsTrigger>
          <TabsTrigger value="trend">
            <TrendingUp className="mr-2 h-4 w-4" />
            고객별 추이
          </TabsTrigger>
          <TabsTrigger value="annual">
            <BarChart3 className="mr-2 h-4 w-4" />
            연간 요약
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Monthly PPM Status */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedYear}년 {selectedMonth}월 PPM 현황
              </CardTitle>
              <Button onClick={addRecord}>
                <Plus className="mr-2 h-4 w-4" />
                행 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">고객명</TableHead>
                    <TableHead className="text-right">납품수량</TableHead>
                    <TableHead className="text-right">클레임수량</TableHead>
                    <TableHead className="text-right">PPM</TableHead>
                    <TableHead className="text-right">목표PPM</TableHead>
                    <TableHead className="text-center">달성여부</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        등록된 데이터가 없습니다. 행 추가 버튼을 클릭하여 데이터를 입력하세요.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {currentRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Input
                              value={record.customer}
                              onChange={(e) =>
                                updateRecord(record.id, "customer", e.target.value)
                              }
                              placeholder="고객명 입력"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={record.deliveredQty}
                              onChange={(e) =>
                                updateRecord(
                                  record.id,
                                  "deliveredQty",
                                  Number(e.target.value)
                                )
                              }
                              className="text-right"
                              min={0}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={record.claimQty}
                              onChange={(e) =>
                                updateRecord(
                                  record.id,
                                  "claimQty",
                                  Number(e.target.value)
                                )
                              }
                              className="text-right"
                              min={0}
                            />
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {record.ppm.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={record.targetPpm}
                              onChange={(e) =>
                                updateRecord(
                                  record.id,
                                  "targetPpm",
                                  Number(e.target.value)
                                )
                              }
                              className="text-right"
                              min={0}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.achieved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.achieved ? "달성" : "미달성"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRecord(record.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Totals Row */}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell>합계</TableCell>
                        <TableCell className="text-right">
                          {monthlyTotals.deliveredQty.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {monthlyTotals.claimQty.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {totalPPM.toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Customer Trend */}
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}년 고객별 월별 PPM 추이</CardTitle>
            </CardHeader>
            <CardContent>
              {trendCustomers.length === 0 ? (
                <p className="text-muted-foreground">
                  등록된 데이터가 없습니다. 월별 PPM 현황 탭에서 데이터를 먼저
                  입력하세요.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background">
                          고객명
                        </TableHead>
                        {months.map((month) => (
                          <TableHead key={month.value} className="text-center">
                            {month.label}
                          </TableHead>
                        ))}
                        <TableHead className="text-center">평균</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trendCustomers.map((customer) => {
                        const customerData = trendData[customer] || {};
                        const values = Object.values(customerData);
                        const average =
                          values.length > 0
                            ? Math.round(
                                values.reduce((a, b) => a + b, 0) / values.length
                              )
                            : 0;

                        return (
                          <TableRow key={customer}>
                            <TableCell className="sticky left-0 bg-background font-medium">
                              {customer}
                            </TableCell>
                            {months.map((month) => {
                              const ppm = customerData[month.value];
                              return (
                                <TableCell
                                  key={month.value}
                                  className="text-center"
                                >
                                  {ppm !== undefined ? (
                                    <span
                                      className={`font-mono ${
                                        ppm > 100
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {ppm.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      -
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center font-semibold font-mono">
                              {average.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Annual Summary */}
        <TabsContent value="annual">
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}년 연간 PPM 요약</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(annualSummary).length === 0 ? (
                <p className="text-muted-foreground">
                  등록된 데이터가 없습니다. 월별 PPM 현황 탭에서 데이터를 먼저
                  입력하세요.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>고객명</TableHead>
                      <TableHead className="text-right">총 납품수량</TableHead>
                      <TableHead className="text-right">총 클레임수량</TableHead>
                      <TableHead className="text-right">연간 PPM</TableHead>
                      <TableHead className="text-right">목표 PPM</TableHead>
                      <TableHead className="text-center">달성율</TableHead>
                      <TableHead className="text-center">연간 달성</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(annualSummary).map(([customer, data]) => {
                      const achievementRate =
                        data.totalMonths > 0
                          ? Math.round(
                              (data.monthsAchieved / data.totalMonths) * 100
                            )
                          : 0;
                      const annualAchieved = data.ppm <= data.targetPpm;

                      return (
                        <TableRow key={customer}>
                          <TableCell className="font-medium">{customer}</TableCell>
                          <TableCell className="text-right">
                            {data.totalDelivered.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {data.totalClaim.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            <span
                              className={
                                data.ppm > data.targetPpm
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {data.ppm.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {data.targetPpm.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                achievementRate >= 80
                                  ? "bg-green-100 text-green-800"
                                  : achievementRate >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {achievementRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                annualAchieved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {annualAchieved ? "달성" : "미달성"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Grand Totals Row */}
                    {Object.keys(annualSummary).length > 0 && (
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell>총계</TableCell>
                        <TableCell className="text-right">
                          {Object.values(annualSummary)
                            .reduce((sum, d) => sum + d.totalDelivered, 0)
                            .toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {Object.values(annualSummary)
                            .reduce((sum, d) => sum + d.totalClaim, 0)
                            .toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {calculatePPM(
                            Object.values(annualSummary).reduce(
                              (sum, d) => sum + d.totalClaim,
                              0
                            ),
                            Object.values(annualSummary).reduce(
                              (sum, d) => sum + d.totalDelivered,
                              0
                            )
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
