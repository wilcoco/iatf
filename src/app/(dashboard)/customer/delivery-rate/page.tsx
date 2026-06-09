"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Calendar,
  Trophy,
  Target,
  Plus,
  Trash2,
} from "lucide-react";

// Types
interface DeliveryEntry {
  id: number;
  customerName: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  deliveryRate: number;
}

interface MonthlyData {
  month: string;
  kmcPlan: number;
  actual: number;
  achievementRate: number;
}

interface CustomerRanking {
  rank: number;
  customerName: string;
  totalDeliveries: number;
  onTimeDeliveries: number;
  deliveryRate: number;
}

interface TargetVsActual {
  customerName: string;
  targetRate: number;
  actualRate: number;
  gap: number;
  status: string;
}

// Initial monthly data based on Excel
const initialMonthlyData: MonthlyData[] = [
  { month: "1월", kmcPlan: 38030, actual: 37389, achievementRate: 98.3 },
  { month: "2월", kmcPlan: 46243, actual: 45543, achievementRate: 98.5 },
  { month: "3월", kmcPlan: 47325, actual: 46972, achievementRate: 99.3 },
  { month: "4월", kmcPlan: 48280, actual: 48363, achievementRate: 100.2 },
  { month: "5월", kmcPlan: 43675, actual: 42346, achievementRate: 97.0 },
  { month: "6월", kmcPlan: 0, actual: 0, achievementRate: 0 },
  { month: "7월", kmcPlan: 0, actual: 0, achievementRate: 0 },
  { month: "8월", kmcPlan: 0, actual: 0, achievementRate: 0 },
  { month: "9월", kmcPlan: 0, actual: 0, achievementRate: 0 },
  { month: "10월", kmcPlan: 0, actual: 0, achievementRate: 0 },
  { month: "11월", kmcPlan: 0, actual: 0, achievementRate: 0 },
  { month: "12월", kmcPlan: 0, actual: 0, achievementRate: 0 },
];

// Initial delivery entries
const initialDeliveryEntries: DeliveryEntry[] = [
  {
    id: 1,
    customerName: "현대자동차",
    totalDeliveries: 85000,
    onTimeDeliveries: 83980,
    deliveryRate: 98.8,
  },
  {
    id: 2,
    customerName: "기아자동차",
    totalDeliveries: 72000,
    onTimeDeliveries: 70920,
    deliveryRate: 98.5,
  },
  {
    id: 3,
    customerName: "현대모비스",
    totalDeliveries: 45000,
    onTimeDeliveries: 44370,
    deliveryRate: 98.6,
  },
  {
    id: 4,
    customerName: "한온시스템",
    totalDeliveries: 18613,
    onTimeDeliveries: 18343,
    deliveryRate: 98.6,
  },
];

// Initial customer rankings
const initialRankings: CustomerRanking[] = [
  {
    rank: 1,
    customerName: "현대자동차",
    totalDeliveries: 85000,
    onTimeDeliveries: 83980,
    deliveryRate: 98.8,
  },
  {
    rank: 2,
    customerName: "현대모비스",
    totalDeliveries: 45000,
    onTimeDeliveries: 44370,
    deliveryRate: 98.6,
  },
  {
    rank: 3,
    customerName: "한온시스템",
    totalDeliveries: 18613,
    onTimeDeliveries: 18343,
    deliveryRate: 98.6,
  },
  {
    rank: 4,
    customerName: "기아자동차",
    totalDeliveries: 72000,
    onTimeDeliveries: 70920,
    deliveryRate: 98.5,
  },
];

// Initial target vs actual data
const initialTargetVsActual: TargetVsActual[] = [
  {
    customerName: "현대자동차",
    targetRate: 98,
    actualRate: 98.8,
    gap: 0.8,
    status: "달성",
  },
  {
    customerName: "기아자동차",
    targetRate: 98,
    actualRate: 98.5,
    gap: 0.5,
    status: "달성",
  },
  {
    customerName: "현대모비스",
    targetRate: 98,
    actualRate: 98.6,
    gap: 0.6,
    status: "달성",
  },
  {
    customerName: "한온시스템",
    targetRate: 98,
    actualRate: 98.6,
    gap: 0.6,
    status: "달성",
  },
];

export default function DeliveryRatePage() {
  const [activeTab, setActiveTab] = useState("entry");
  const [deliveryEntries, setDeliveryEntries] =
    useState<DeliveryEntry[]>(initialDeliveryEntries);
  const [monthlyData, setMonthlyData] =
    useState<MonthlyData[]>(initialMonthlyData);
  const [rankings, setRankings] = useState<CustomerRanking[]>(initialRankings);
  const [targetVsActual, setTargetVsActual] =
    useState<TargetVsActual[]>(initialTargetVsActual);
  const [selectedYear, setSelectedYear] = useState("2025");

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    customerName: "",
    totalDeliveries: 0,
    onTimeDeliveries: 0,
  });

  // Calculate delivery rate
  const calculateDeliveryRate = (
    onTime: number,
    total: number
  ): number => {
    if (total === 0) return 0;
    return Number(((onTime / total) * 100).toFixed(1));
  };

  // Add new delivery entry
  const handleAddEntry = () => {
    if (newEntry.customerName && newEntry.totalDeliveries > 0) {
      const deliveryRate = calculateDeliveryRate(
        newEntry.onTimeDeliveries,
        newEntry.totalDeliveries
      );
      const newDeliveryEntry: DeliveryEntry = {
        id: deliveryEntries.length + 1,
        customerName: newEntry.customerName,
        totalDeliveries: newEntry.totalDeliveries,
        onTimeDeliveries: newEntry.onTimeDeliveries,
        deliveryRate,
      };
      setDeliveryEntries([...deliveryEntries, newDeliveryEntry]);

      // Update rankings
      const updatedRankings = [...rankings, {
        rank: rankings.length + 1,
        ...newDeliveryEntry,
      }].sort((a, b) => b.deliveryRate - a.deliveryRate)
        .map((item, index) => ({ ...item, rank: index + 1 }));
      setRankings(updatedRankings);

      // Update target vs actual
      const newTargetActual: TargetVsActual = {
        customerName: newEntry.customerName,
        targetRate: 98,
        actualRate: deliveryRate,
        gap: Number((deliveryRate - 98).toFixed(1)),
        status: deliveryRate >= 98 ? "달성" : "미달성",
      };
      setTargetVsActual([...targetVsActual, newTargetActual]);

      // Reset form
      setNewEntry({
        customerName: "",
        totalDeliveries: 0,
        onTimeDeliveries: 0,
      });
    }
  };

  // Delete entry
  const handleDeleteEntry = (id: number) => {
    const entryToDelete = deliveryEntries.find((e) => e.id === id);
    setDeliveryEntries(deliveryEntries.filter((e) => e.id !== id));

    if (entryToDelete) {
      setRankings(
        rankings
          .filter((r) => r.customerName !== entryToDelete.customerName)
          .map((item, index) => ({ ...item, rank: index + 1 }))
      );
      setTargetVsActual(
        targetVsActual.filter((t) => t.customerName !== entryToDelete.customerName)
      );
    }
  };

  // Update monthly data
  const handleMonthlyDataChange = (
    index: number,
    field: "kmcPlan" | "actual",
    value: number
  ) => {
    const updated = [...monthlyData];
    updated[index][field] = value;
    updated[index].achievementRate = calculateDeliveryRate(
      updated[index].actual,
      updated[index].kmcPlan
    );
    setMonthlyData(updated);
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString("ko-KR");
  };

  // Get achievement rate badge
  const getAchievementBadge = (rate: number) => {
    if (rate === 0) return <Badge variant="secondary">-</Badge>;
    if (rate >= 100) return <Badge variant="success">초과달성</Badge>;
    if (rate >= 98) return <Badge variant="success">달성</Badge>;
    if (rate >= 95) return <Badge variant="warning">양호</Badge>;
    return <Badge variant="destructive">미달성</Badge>;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === "달성") return <Badge variant="success">달성</Badge>;
    return <Badge variant="destructive">미달성</Badge>;
  };

  // Get rank badge
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">1위</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">2위</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">3위</Badge>;
    return <Badge variant="secondary">{rank}위</Badge>;
  };

  // Calculate totals
  const totalKmcPlan = monthlyData.reduce((sum, m) => sum + m.kmcPlan, 0);
  const totalActual = monthlyData.reduce((sum, m) => sum + m.actual, 0);
  const totalAchievementRate = calculateDeliveryRate(totalActual, totalKmcPlan);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">고객 인도성과율</h1>
        <p className="text-muted-foreground">
          (주)캠스 인도성과율 현황 ({selectedYear}년 1월~{selectedYear}년 12월)
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          산출근거: 인도성과율(%) = (정시납품건수 / 전체납품건수) x 100
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Label>조회년도</Label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024년</SelectItem>
            <SelectItem value="2025">2025년</SelectItem>
            <SelectItem value="2026">2026년</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            인도성과율 입력
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            월별 현황
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            고객별 순위
          </TabsTrigger>
          <TabsTrigger value="target" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            목표 대비 실적
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Delivery Rate Entry */}
        <TabsContent value="entry">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  인도성과율 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>고객사명</TableHead>
                      <TableHead className="text-right">납품건수 (대)</TableHead>
                      <TableHead className="text-right">정시납품건수 (대)</TableHead>
                      <TableHead className="text-right">인도성과율 (%)</TableHead>
                      <TableHead className="text-center">평가</TableHead>
                      <TableHead className="text-center">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveryEntries.map((entry, index) => (
                      <TableRow key={entry.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {entry.customerName}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(entry.totalDeliveries)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(entry.onTimeDeliveries)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {entry.deliveryRate.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-center">
                          {getAchievementBadge(entry.deliveryRate)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  신규 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>고객사명</Label>
                    <Input
                      value={newEntry.customerName}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, customerName: e.target.value })
                      }
                      placeholder="고객사명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>납품건수 (대)</Label>
                    <Input
                      type="number"
                      value={newEntry.totalDeliveries || ""}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          totalDeliveries: Number(e.target.value),
                        })
                      }
                      placeholder="전체 납품건수"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>정시납품건수 (대)</Label>
                    <Input
                      type="number"
                      value={newEntry.onTimeDeliveries || ""}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          onTimeDeliveries: Number(e.target.value),
                        })
                      }
                      placeholder="정시 납품건수"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>예상 인도성과율</Label>
                    <div className="h-10 flex items-center px-3 bg-muted rounded-md font-bold">
                      {calculateDeliveryRate(
                        newEntry.onTimeDeliveries,
                        newEntry.totalDeliveries
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleAddEntry}>
                    <Plus className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Monthly Status */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                월별 현황 ({selectedYear}년)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                (단위: 대, %)
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구분</TableHead>
                    {monthlyData.map((m) => (
                      <TableHead key={m.month} className="text-center">
                        {m.month}
                      </TableHead>
                    ))}
                    <TableHead className="text-center bg-muted font-bold">
                      합계
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">KMC 계획</TableCell>
                    {monthlyData.map((m, index) => (
                      <TableCell key={m.month} className="text-center">
                        <Input
                          type="number"
                          value={m.kmcPlan || ""}
                          onChange={(e) =>
                            handleMonthlyDataChange(
                              index,
                              "kmcPlan",
                              Number(e.target.value)
                            )
                          }
                          className="w-20 text-center text-sm"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center bg-muted font-bold">
                      {formatNumber(totalKmcPlan)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">실적</TableCell>
                    {monthlyData.map((m, index) => (
                      <TableCell key={m.month} className="text-center">
                        <Input
                          type="number"
                          value={m.actual || ""}
                          onChange={(e) =>
                            handleMonthlyDataChange(
                              index,
                              "actual",
                              Number(e.target.value)
                            )
                          }
                          className="w-20 text-center text-sm"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-center bg-muted font-bold">
                      {formatNumber(totalActual)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">달성율</TableCell>
                    {monthlyData.map((m) => (
                      <TableCell key={m.month} className="text-center">
                        {m.achievementRate > 0 ? (
                          <span
                            className={
                              m.achievementRate >= 98
                                ? "text-green-600 font-bold"
                                : m.achievementRate >= 95
                                ? "text-yellow-600 font-bold"
                                : "text-red-600 font-bold"
                            }
                          >
                            {m.achievementRate.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center bg-muted">
                      <span
                        className={
                          totalAchievementRate >= 98
                            ? "text-green-600 font-bold"
                            : totalAchievementRate >= 95
                            ? "text-yellow-600 font-bold"
                            : "text-red-600 font-bold"
                        }
                      >
                        {totalAchievementRate.toFixed(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">총 계획</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(totalKmcPlan)}
                  </p>
                  <p className="text-xs text-muted-foreground">대</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">총 실적</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(totalActual)}
                  </p>
                  <p className="text-xs text-muted-foreground">대</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">달성율</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalAchievementRate.toFixed(1)}%
                  </p>
                  {getAchievementBadge(totalAchievementRate)}
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">차이</p>
                  <p
                    className={`text-2xl font-bold ${
                      totalActual - totalKmcPlan >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {totalActual - totalKmcPlan >= 0 ? "+" : ""}
                    {formatNumber(totalActual - totalKmcPlan)}
                  </p>
                  <p className="text-xs text-muted-foreground">대</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Customer Ranking */}
        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                고객별 인도성과율 순위
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">순위</TableHead>
                    <TableHead>고객사명</TableHead>
                    <TableHead className="text-right">납품건수 (대)</TableHead>
                    <TableHead className="text-right">정시납품건수 (대)</TableHead>
                    <TableHead className="text-right">인도성과율 (%)</TableHead>
                    <TableHead className="text-center">평가</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((ranking) => (
                    <TableRow
                      key={ranking.rank}
                      className={ranking.rank <= 3 ? "bg-muted/30" : ""}
                    >
                      <TableCell className="text-center">
                        {getRankBadge(ranking.rank)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {ranking.customerName}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(ranking.totalDeliveries)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(ranking.onTimeDeliveries)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {ranking.deliveryRate.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-center">
                        {getAchievementBadge(ranking.deliveryRate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Ranking Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-4">순위 요약</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rankings.slice(0, 3).map((ranking) => (
                    <div
                      key={ranking.rank}
                      className={`p-4 rounded-lg ${
                        ranking.rank === 1
                          ? "bg-yellow-100 border-2 border-yellow-400"
                          : ranking.rank === 2
                          ? "bg-gray-100 border-2 border-gray-400"
                          : "bg-amber-100 border-2 border-amber-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {getRankBadge(ranking.rank)}
                        <span className="text-2xl font-bold">
                          {ranking.deliveryRate.toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium">{ranking.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(ranking.onTimeDeliveries)} /{" "}
                        {formatNumber(ranking.totalDeliveries)} 대
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Target vs Actual */}
        <TabsContent value="target">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                목표 대비 실적 (목표: 98%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객사명</TableHead>
                    <TableHead className="text-center">목표 (%)</TableHead>
                    <TableHead className="text-center">실적 (%)</TableHead>
                    <TableHead className="text-center">Gap (%p)</TableHead>
                    <TableHead className="text-center">달성여부</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {targetVsActual.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.customerName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.targetRate.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {item.actualRate.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={
                            item.gap >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          {item.gap >= 0 ? "+" : ""}
                          {item.gap.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Target Summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">목표</p>
                  <p className="text-3xl font-bold text-blue-600">98.0%</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">평균 실적</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(
                      targetVsActual.reduce((sum, t) => sum + t.actualRate, 0) /
                      targetVsActual.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">달성 고객</p>
                  <p className="text-3xl font-bold text-green-600">
                    {targetVsActual.filter((t) => t.status === "달성").length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {targetVsActual.length} 개사
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">미달성 고객</p>
                  <p className="text-3xl font-bold text-red-600">
                    {targetVsActual.filter((t) => t.status === "미달성").length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {targetVsActual.length} 개사
                  </p>
                </div>
              </div>

              {/* Progress Bar Visualization */}
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">고객별 목표 달성 현황</h4>
                {targetVsActual.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.customerName}</span>
                      <span className="font-medium">
                        {item.actualRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                      {/* Target line at 98% */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{ left: "98%" }}
                      />
                      {/* Actual progress */}
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.actualRate >= 98
                            ? "bg-green-500"
                            : item.actualRate >= 95
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(item.actualRate, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>목표선 (98%)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>달성</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded" />
                    <span>양호</span>
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
