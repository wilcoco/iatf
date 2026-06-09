"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Plus,
  Save,
  Trash2,
  FileText,
  Factory,
  Package,
  History,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Search,
} from "lucide-react";

// 생산일보 항목 타입
interface DailyReportItem {
  id: number;
  productionDate: string; // 생산일 YYYY-MM-DD
  lineName: string; // 라인명
  shift: string; // 근무조 (주간/야간)
  itemNo: string; // 품번
  itemName: string; // 품명
  planQty: number; // 계획수량
  productionQty: number; // 생산수량
  goodQty: number; // 양품수량
  defectQty: number; // 불량수량
  operatingTime: number; // 가동시간 (분)
  downTime: number; // 비가동시간 (분)
  defectTypes: {
    scratch: number; // 스크래치
    crack: number; // 크랙
    deformation: number; // 변형
    discoloration: number; // 변색
    other: number; // 기타
  };
  workerName: string; // 작업자
  remarks: string; // 비고
}

// 라인별 현황 타입
interface LineStatusItem {
  lineName: string;
  totalPlanQty: number;
  totalProductionQty: number;
  totalGoodQty: number;
  totalDefectQty: number;
  achievementRate: number;
  defectRate: number;
  operatingRate: number;
}

// 품목별 현황 타입
interface ItemStatusItem {
  itemNo: string;
  itemName: string;
  totalPlanQty: number;
  totalProductionQty: number;
  totalGoodQty: number;
  totalDefectQty: number;
  achievementRate: number;
  planVsActualDiff: number;
}

// 생산일보 이력 타입
interface DailyReportHistory {
  id: number;
  productionDate: string;
  lineName: string;
  shift: string;
  itemNo: string;
  itemName: string;
  productionQty: number;
  goodQty: number;
  defectQty: number;
  defectRate: number;
  workerName: string;
  registeredAt: string;
}

export default function DailyReportPage() {
  const [activeTab, setActiveTab] = useState("report-entry");

  // 생산일보 입력 상태
  const [reportItems, setReportItems] = useState<DailyReportItem[]>([
    {
      id: 1,
      productionDate: "",
      lineName: "",
      shift: "주간",
      itemNo: "",
      itemName: "",
      planQty: 0,
      productionQty: 0,
      goodQty: 0,
      defectQty: 0,
      operatingTime: 0,
      downTime: 0,
      defectTypes: {
        scratch: 0,
        crack: 0,
        deformation: 0,
        discoloration: 0,
        other: 0,
      },
      workerName: "",
      remarks: "",
    },
  ]);

  // 라인별 현황 상태
  const [lineStatusItems, setLineStatusItems] = useState<LineStatusItem[]>([]);
  const [lineStatusDate, setLineStatusDate] = useState("");

  // 품목별 현황 상태
  const [itemStatusItems, setItemStatusItems] = useState<ItemStatusItem[]>([]);
  const [itemStatusStartDate, setItemStatusStartDate] = useState("");
  const [itemStatusEndDate, setItemStatusEndDate] = useState("");

  // 생산일보 이력 상태
  const [historyItems, setHistoryItems] = useState<DailyReportHistory[]>([]);
  const [historySearchDate, setHistorySearchDate] = useState("");
  const [historySearchLine, setHistorySearchLine] = useState("");

  // 라인 목록
  const lineOptions = ["Line-A", "Line-B", "Line-C", "Line-D", "Line-E"];

  // 불량유형 라벨
  const defectTypeLabels = {
    scratch: "스크래치",
    crack: "크랙",
    deformation: "변형",
    discoloration: "변색",
    other: "기타",
  };

  // 생산일보 입력 핸들러
  const addReportItem = () => {
    setReportItems([
      ...reportItems,
      {
        id: Date.now(),
        productionDate: "",
        lineName: "",
        shift: "주간",
        itemNo: "",
        itemName: "",
        planQty: 0,
        productionQty: 0,
        goodQty: 0,
        defectQty: 0,
        operatingTime: 0,
        downTime: 0,
        defectTypes: {
          scratch: 0,
          crack: 0,
          deformation: 0,
          discoloration: 0,
          other: 0,
        },
        workerName: "",
        remarks: "",
      },
    ]);
  };

  const removeReportItem = (id: number) => {
    if (reportItems.length <= 1) return;
    setReportItems(reportItems.filter((item) => item.id !== id));
  };

  const updateReportItem = (
    id: number,
    field: keyof DailyReportItem,
    value: string | number | DailyReportItem["defectTypes"]
  ) => {
    setReportItems(
      reportItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const updateDefectType = (
    id: number,
    defectType: keyof DailyReportItem["defectTypes"],
    value: number
  ) => {
    setReportItems(
      reportItems.map((item) => {
        if (item.id === id) {
          const newDefectTypes = { ...item.defectTypes, [defectType]: value };
          const totalDefect = Object.values(newDefectTypes).reduce(
            (sum, val) => sum + val,
            0
          );
          return {
            ...item,
            defectTypes: newDefectTypes,
            defectQty: totalDefect,
          };
        }
        return item;
      })
    );
  };

  // 라인별 현황 조회
  const generateLineStatus = () => {
    // 샘플 데이터 생성
    const sampleData: LineStatusItem[] = lineOptions.map((line) => {
      const planQty = Math.floor(Math.random() * 2000) + 1000;
      const productionQty = Math.floor(Math.random() * 2200) + 900;
      const defectQty = Math.floor(productionQty * (Math.random() * 0.05));
      const goodQty = productionQty - defectQty;
      const operatingTime = Math.floor(Math.random() * 120) + 360;
      const totalTime = 480;

      return {
        lineName: line,
        totalPlanQty: planQty,
        totalProductionQty: productionQty,
        totalGoodQty: goodQty,
        totalDefectQty: defectQty,
        achievementRate: Math.round((productionQty / planQty) * 100),
        defectRate:
          productionQty > 0
            ? Math.round((defectQty / productionQty) * 1000) / 10
            : 0,
        operatingRate: Math.round((operatingTime / totalTime) * 100),
      };
    });
    setLineStatusItems(sampleData);
  };

  // 품목별 현황 조회
  const generateItemStatus = () => {
    // 샘플 데이터 생성
    const sampleItems = [
      { itemNo: "MBD0023D784", itemName: "NQ5 PE FRT" },
      { itemNo: "MBD0023D785", itemName: "NQ5 PE RR" },
      { itemNo: "MBD0023D786", itemName: "NQ5 BUMPER FRT" },
      { itemNo: "MBD0023D787", itemName: "NQ5 BUMPER RR" },
      { itemNo: "MBD0023D788", itemName: "NQ5 FENDER LH" },
      { itemNo: "MBD0023D789", itemName: "NQ5 FENDER RH" },
    ];

    const sampleData: ItemStatusItem[] = sampleItems.map((item) => {
      const planQty = Math.floor(Math.random() * 3000) + 1500;
      const productionQty = Math.floor(Math.random() * 3200) + 1400;
      const defectQty = Math.floor(productionQty * (Math.random() * 0.04));
      const goodQty = productionQty - defectQty;

      return {
        itemNo: item.itemNo,
        itemName: item.itemName,
        totalPlanQty: planQty,
        totalProductionQty: productionQty,
        totalGoodQty: goodQty,
        totalDefectQty: defectQty,
        achievementRate: Math.round((productionQty / planQty) * 100),
        planVsActualDiff: productionQty - planQty,
      };
    });
    setItemStatusItems(sampleData);
  };

  // 생산일보 이력 조회
  const generateHistory = () => {
    // 샘플 데이터 생성
    const sampleHistory: DailyReportHistory[] = [];
    const baseDate = historySearchDate
      ? new Date(historySearchDate)
      : new Date();

    for (let i = 0; i < 20; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - Math.floor(i / 4));
      const productionQty = Math.floor(Math.random() * 500) + 200;
      const defectQty = Math.floor(productionQty * (Math.random() * 0.05));

      const lineFilter = historySearchLine || lineOptions[i % lineOptions.length];
      if (historySearchLine && lineFilter !== historySearchLine) continue;

      sampleHistory.push({
        id: i + 1,
        productionDate: date.toISOString().split("T")[0],
        lineName: lineOptions[i % lineOptions.length],
        shift: i % 2 === 0 ? "주간" : "야간",
        itemNo: `MBD0023D78${i % 10}`,
        itemName: `NQ5 PART ${String.fromCharCode(65 + (i % 6))}`,
        productionQty,
        goodQty: productionQty - defectQty,
        defectQty,
        defectRate:
          productionQty > 0
            ? Math.round((defectQty / productionQty) * 1000) / 10
            : 0,
        workerName: ["김철수", "이영희", "박민수", "최지영", "정우성"][i % 5],
        registeredAt: new Date().toISOString(),
      });
    }
    setHistoryItems(
      historySearchLine
        ? sampleHistory.filter((h) => h.lineName === historySearchLine)
        : sampleHistory
    );
  };

  // 요약 계산
  const reportSummary = useMemo(() => {
    const totalPlan = reportItems.reduce((sum, item) => sum + item.planQty, 0);
    const totalProduction = reportItems.reduce(
      (sum, item) => sum + item.productionQty,
      0
    );
    const totalGood = reportItems.reduce((sum, item) => sum + item.goodQty, 0);
    const totalDefect = reportItems.reduce(
      (sum, item) => sum + item.defectQty,
      0
    );
    const totalOperating = reportItems.reduce(
      (sum, item) => sum + item.operatingTime,
      0
    );
    const totalDown = reportItems.reduce((sum, item) => sum + item.downTime, 0);

    return {
      totalPlan,
      totalProduction,
      totalGood,
      totalDefect,
      achievementRate: totalPlan > 0 ? Math.round((totalProduction / totalPlan) * 100) : 0,
      defectRate:
        totalProduction > 0
          ? Math.round((totalDefect / totalProduction) * 1000) / 10
          : 0,
      operatingRate:
        totalOperating + totalDown > 0
          ? Math.round((totalOperating / (totalOperating + totalDown)) * 100)
          : 0,
    };
  }, [reportItems]);

  const lineSummary = useMemo(() => {
    if (lineStatusItems.length === 0) return null;

    const totalPlan = lineStatusItems.reduce(
      (sum, item) => sum + item.totalPlanQty,
      0
    );
    const totalProduction = lineStatusItems.reduce(
      (sum, item) => sum + item.totalProductionQty,
      0
    );
    const avgDefectRate =
      lineStatusItems.reduce((sum, item) => sum + item.defectRate, 0) /
      lineStatusItems.length;
    const avgOperatingRate =
      lineStatusItems.reduce((sum, item) => sum + item.operatingRate, 0) /
      lineStatusItems.length;

    return {
      totalPlan,
      totalProduction,
      overallAchievement: totalPlan > 0 ? Math.round((totalProduction / totalPlan) * 100) : 0,
      avgDefectRate: Math.round(avgDefectRate * 10) / 10,
      avgOperatingRate: Math.round(avgOperatingRate),
    };
  }, [lineStatusItems]);

  // 저장 핸들러
  const handleSaveReport = () => {
    console.log("Saving daily report:", reportItems);
    alert("생산일보가 저장되었습니다.");
  };

  const getAchievementBadge = (rate: number) => {
    if (rate >= 100) {
      return <Badge className="bg-green-500">달성</Badge>;
    } else if (rate >= 90) {
      return <Badge className="bg-yellow-500">주의</Badge>;
    } else {
      return <Badge variant="destructive">미달</Badge>;
    }
  };

  const getDefectRateBadge = (rate: number) => {
    if (rate <= 1) {
      return <Badge className="bg-green-500">양호</Badge>;
    } else if (rate <= 3) {
      return <Badge className="bg-yellow-500">주의</Badge>;
    } else {
      return <Badge variant="destructive">불량</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">생산일보</h1>
          <p className="text-muted-foreground">
            일일 생산 실적 입력 및 현황 관리
          </p>
        </div>
        <Button onClick={handleSaveReport}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="report-entry">
            <FileText className="mr-2 h-4 w-4" />
            생산일보 입력
          </TabsTrigger>
          <TabsTrigger value="line-status">
            <Factory className="mr-2 h-4 w-4" />
            라인별 현황
          </TabsTrigger>
          <TabsTrigger value="item-status">
            <Package className="mr-2 h-4 w-4" />
            품목별 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            생산일보 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 생산일보 입력 */}
        <TabsContent value="report-entry">
          <div className="space-y-6">
            {/* 요약 카드 */}
            <div className="grid gap-4 md:grid-cols-6">
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">등록 건수</p>
                      <p className="text-2xl font-bold">{reportItems.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">총 계획</p>
                      <p className="text-2xl font-bold">
                        {reportSummary.totalPlan.toLocaleString()}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">총 생산</p>
                      <p className="text-2xl font-bold">
                        {reportSummary.totalProduction.toLocaleString()}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">달성률</p>
                      <p className="text-2xl font-bold">
                        {reportSummary.achievementRate}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">불량률</p>
                      <p className="text-2xl font-bold">
                        {reportSummary.defectRate}%
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">가동률</p>
                      <p className="text-2xl font-bold">
                        {reportSummary.operatingRate}%
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 입력 폼 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    생산일보 입력
                  </span>
                  <Button onClick={addReportItem} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    항목 추가
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reportItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-lg border p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">항목 #{index + 1}</h4>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeReportItem(item.id)}
                          disabled={reportItems.length <= 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* 기본 정보 */}
                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="space-y-2">
                          <Label>생산일</Label>
                          <Input
                            type="date"
                            value={item.productionDate}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "productionDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>라인</Label>
                          <Select
                            value={item.lineName}
                            onValueChange={(v) =>
                              updateReportItem(item.id, "lineName", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="라인 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {lineOptions.map((line) => (
                                <SelectItem key={line} value={line}>
                                  {line}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>근무조</Label>
                          <Select
                            value={item.shift}
                            onValueChange={(v) =>
                              updateReportItem(item.id, "shift", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="주간">주간</SelectItem>
                              <SelectItem value="야간">야간</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>품번</Label>
                          <Input
                            value={item.itemNo}
                            onChange={(e) =>
                              updateReportItem(item.id, "itemNo", e.target.value)
                            }
                            placeholder="품번 입력"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품명</Label>
                          <Input
                            value={item.itemName}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "itemName",
                                e.target.value
                              )
                            }
                            placeholder="품명 입력"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>작업자</Label>
                          <Input
                            value={item.workerName}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "workerName",
                                e.target.value
                              )
                            }
                            placeholder="작업자명"
                          />
                        </div>
                      </div>

                      {/* 수량 정보 */}
                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="space-y-2">
                          <Label>계획수량</Label>
                          <Input
                            type="number"
                            value={item.planQty || ""}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "planQty",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>생산수량</Label>
                          <Input
                            type="number"
                            value={item.productionQty || ""}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "productionQty",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>양품수량</Label>
                          <Input
                            type="number"
                            value={item.goodQty || ""}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "goodQty",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>불량수량</Label>
                          <Input
                            type="number"
                            value={item.defectQty || ""}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "defectQty",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="text-right bg-red-50"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>가동시간 (분)</Label>
                          <Input
                            type="number"
                            value={item.operatingTime || ""}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "operatingTime",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>비가동시간 (분)</Label>
                          <Input
                            type="number"
                            value={item.downTime || ""}
                            onChange={(e) =>
                              updateReportItem(
                                item.id,
                                "downTime",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            className="text-right"
                          />
                        </div>
                      </div>

                      {/* 불량유형별 수량 */}
                      <div className="space-y-2">
                        <Label className="text-base font-medium">
                          불량유형별 수량
                        </Label>
                        <div className="grid gap-4 md:grid-cols-5">
                          {Object.entries(defectTypeLabels).map(
                            ([key, label]) => (
                              <div key={key} className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                  {label}
                                </Label>
                                <Input
                                  type="number"
                                  value={
                                    item.defectTypes[
                                      key as keyof typeof item.defectTypes
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    updateDefectType(
                                      item.id,
                                      key as keyof DailyReportItem["defectTypes"],
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  placeholder="0"
                                  className="text-right"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* 비고 */}
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={item.remarks}
                          onChange={(e) =>
                            updateReportItem(item.id, "remarks", e.target.value)
                          }
                          placeholder="비고 입력"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 라인별 현황 */}
        <TabsContent value="line-status">
          <div className="space-y-6">
            {/* 조회 조건 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  라인별 생산현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Label>조회일자</Label>
                    <Input
                      type="date"
                      value={lineStatusDate}
                      onChange={(e) => setLineStatusDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                  <Button onClick={generateLineStatus}>
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 요약 카드 */}
            {lineSummary && (
              <div className="grid gap-4 md:grid-cols-5">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          라인 수
                        </p>
                        <p className="text-2xl font-bold">
                          {lineStatusItems.length}
                        </p>
                      </div>
                      <Factory className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          총 계획
                        </p>
                        <p className="text-2xl font-bold">
                          {lineSummary.totalPlan.toLocaleString()}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          총 생산
                        </p>
                        <p className="text-2xl font-bold">
                          {lineSummary.totalProduction.toLocaleString()}
                        </p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          평균 달성률
                        </p>
                        <p className="text-2xl font-bold">
                          {lineSummary.overallAchievement}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          평균 불량률
                        </p>
                        <p className="text-2xl font-bold">
                          {lineSummary.avgDefectRate}%
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 라인별 테이블 */}
            {lineStatusItems.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>라인별 생산실적</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">라인명</TableHead>
                        <TableHead className="text-right">계획수량</TableHead>
                        <TableHead className="text-right">생산수량</TableHead>
                        <TableHead className="text-right">양품수량</TableHead>
                        <TableHead className="text-right">불량수량</TableHead>
                        <TableHead className="text-center">달성률</TableHead>
                        <TableHead className="text-center">불량률</TableHead>
                        <TableHead className="text-center">가동률</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineStatusItems.map((item) => (
                        <TableRow key={item.lineName}>
                          <TableCell className="text-center font-medium">
                            {item.lineName}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalPlanQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalProductionQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalGoodQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {item.totalDefectQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                item.achievementRate >= 100
                                  ? "text-green-600 font-semibold"
                                  : item.achievementRate >= 90
                                  ? "text-yellow-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {item.achievementRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                item.defectRate <= 1
                                  ? "text-green-600"
                                  : item.defectRate <= 3
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }
                            >
                              {item.defectRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.operatingRate}%
                          </TableCell>
                          <TableCell className="text-center">
                            {getAchievementBadge(item.achievementRate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Factory className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    조회일자를 선택하고 조회 버튼을 클릭하세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: 품목별 현황 */}
        <TabsContent value="item-status">
          <div className="space-y-6">
            {/* 조회 조건 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  품목별 생산현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Label>시작일</Label>
                    <Input
                      type="date"
                      value={itemStatusStartDate}
                      onChange={(e) => setItemStatusStartDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>종료일</Label>
                    <Input
                      type="date"
                      value={itemStatusEndDate}
                      onChange={(e) => setItemStatusEndDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                  <Button onClick={generateItemStatus}>
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 품목별 테이블 */}
            {itemStatusItems.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>품목별 생산실적</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead className="text-right">계획수량</TableHead>
                        <TableHead className="text-right">생산수량</TableHead>
                        <TableHead className="text-right">양품수량</TableHead>
                        <TableHead className="text-right">불량수량</TableHead>
                        <TableHead className="text-center">달성률</TableHead>
                        <TableHead className="text-right">계획대비</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemStatusItems.map((item) => (
                        <TableRow key={item.itemNo}>
                          <TableCell className="text-center font-mono">
                            {item.itemNo}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.itemName}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalPlanQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalProductionQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.totalGoodQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {item.totalDefectQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                item.achievementRate >= 100
                                  ? "text-green-600 font-semibold"
                                  : item.achievementRate >= 90
                                  ? "text-yellow-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {item.achievementRate}%
                            </span>
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              item.planVsActualDiff >= 0
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          >
                            <span className="flex items-center justify-end gap-1">
                              {item.planVsActualDiff >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {item.planVsActualDiff >= 0 ? "+" : ""}
                              {item.planVsActualDiff.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {getAchievementBadge(item.achievementRate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    기간을 선택하고 조회 버튼을 클릭하세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 4: 생산일보 이력 */}
        <TabsContent value="history">
          <div className="space-y-6">
            {/* 조회 조건 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  생산일보 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Label>조회일자</Label>
                    <Input
                      type="date"
                      value={historySearchDate}
                      onChange={(e) => setHistorySearchDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>라인</Label>
                    <Select
                      value={historySearchLine}
                      onValueChange={setHistorySearchLine}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">전체</SelectItem>
                        {lineOptions.map((line) => (
                          <SelectItem key={line} value={line}>
                            {line}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={generateHistory}>
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 이력 테이블 */}
            {historyItems.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>생산일보 이력 목록</span>
                    <Badge variant="outline">
                      총 {historyItems.length}건
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">No.</TableHead>
                        <TableHead className="text-center">생산일</TableHead>
                        <TableHead className="text-center">라인</TableHead>
                        <TableHead className="text-center">근무조</TableHead>
                        <TableHead className="text-center">품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead className="text-right">생산수량</TableHead>
                        <TableHead className="text-right">양품수량</TableHead>
                        <TableHead className="text-right">불량수량</TableHead>
                        <TableHead className="text-center">불량률</TableHead>
                        <TableHead className="text-center">작업자</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.productionDate}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.lineName}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                item.shift === "주간" ? "outline" : "secondary"
                              }
                            >
                              {item.shift}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {item.itemNo}
                          </TableCell>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell className="text-right">
                            {item.productionQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.goodQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {item.defectQty.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={
                                item.defectRate <= 1
                                  ? "text-green-600"
                                  : item.defectRate <= 3
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }
                            >
                              {item.defectRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center gap-1">
                              <Users className="h-3 w-3" />
                              {item.workerName}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {getDefectRateBadge(item.defectRate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <History className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    조회 조건을 입력하고 조회 버튼을 클릭하세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
