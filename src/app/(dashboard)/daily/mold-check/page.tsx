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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hammer, Save, CheckCircle, XCircle, TrendingUp, History } from "lucide-react";

// 점검부위 및 항목 데이터
const checkAreas = [
  {
    area: "캐비티",
    items: [
      { name: "표면 상태", standard: "스크래치, 부식 없음" },
      { name: "게이트 마모", standard: "마모 깊이 0.1mm 이내" },
    ],
  },
  {
    area: "코어",
    items: [
      { name: "표면 상태", standard: "스크래치, 부식 없음" },
      { name: "돌출핀 홀", standard: "마모 없음" },
    ],
  },
  {
    area: "가이드핀/부시",
    items: [
      { name: "마모 상태", standard: "유격 0.05mm 이내" },
      { name: "윤활 상태", standard: "적정 윤활" },
    ],
  },
  {
    area: "이젝터",
    items: [
      { name: "핀 마모", standard: "마모 없음" },
      { name: "작동 상태", standard: "부드러운 작동" },
      { name: "리턴핀 상태", standard: "손상 없음" },
    ],
  },
  {
    area: "냉각수 라인",
    items: [
      { name: "누수 여부", standard: "누수 없음" },
      { name: "유로 막힘", standard: "막힘 없음" },
    ],
  },
  {
    area: "파팅라인",
    items: [
      { name: "손상 여부", standard: "버(Burr) 없음" },
      { name: "밀착 상태", standard: "정상 밀착" },
    ],
  },
];

interface CheckItem {
  area: string;
  itemName: string;
  standard: string;
  result: "양호" | "불량" | "";
  action: string;
}

interface ShotCount {
  id: number;
  date: string;
  moldNo: string;
  previousShots: number;
  todayShots: number;
  totalShots: number;
  maintenanceTarget: number;
}

interface CheckHistory {
  id: number;
  checkDate: string;
  moldNo: string;
  checker: string;
  overallResult: "양호" | "불량";
  ngCount: number;
  items: CheckItem[];
}

// 샘플 샷수 데이터
const sampleShotCounts: ShotCount[] = [
  { id: 1, date: "2026-06-09", moldNo: "M-001", previousShots: 125000, todayShots: 1500, totalShots: 126500, maintenanceTarget: 150000 },
  { id: 2, date: "2026-06-09", moldNo: "M-002", previousShots: 89000, todayShots: 2200, totalShots: 91200, maintenanceTarget: 100000 },
  { id: 3, date: "2026-06-09", moldNo: "M-003", previousShots: 45000, todayShots: 800, totalShots: 45800, maintenanceTarget: 80000 },
];

// 샘플 점검 이력 데이터
const sampleHistory: CheckHistory[] = [
  {
    id: 1,
    checkDate: "2026-06-08",
    moldNo: "M-001",
    checker: "김철수",
    overallResult: "양호",
    ngCount: 0,
    items: [],
  },
  {
    id: 2,
    checkDate: "2026-06-08",
    moldNo: "M-002",
    checker: "박영희",
    overallResult: "불량",
    ngCount: 2,
    items: [],
  },
  {
    id: 3,
    checkDate: "2026-06-07",
    moldNo: "M-001",
    checker: "김철수",
    overallResult: "양호",
    ngCount: 0,
    items: [],
  },
];

export default function MoldCheckPage() {
  const [activeTab, setActiveTab] = useState("check");

  // 점검 입력 상태
  const [checkDate, setCheckDate] = useState(new Date().toISOString().split("T")[0]);
  const [moldNo, setMoldNo] = useState("");
  const [checker, setChecker] = useState("");
  const [checkItems, setCheckItems] = useState<CheckItem[]>(() =>
    checkAreas.flatMap((area) =>
      area.items.map((item) => ({
        area: area.area,
        itemName: item.name,
        standard: item.standard,
        result: "" as const,
        action: "",
      }))
    )
  );

  // 샷수 관리 상태
  const [shotCounts, setShotCounts] = useState<ShotCount[]>(sampleShotCounts);
  const [newShotData, setNewShotData] = useState({
    moldNo: "",
    previousShots: 0,
    todayShots: 0,
    maintenanceTarget: 100000,
  });

  // 점검 이력 상태
  const [history, setHistory] = useState<CheckHistory[]>(sampleHistory);

  const handleResultChange = (index: number, result: "양호" | "불량") => {
    const newItems = [...checkItems];
    newItems[index].result = result;
    setCheckItems(newItems);
  };

  const handleActionChange = (index: number, action: string) => {
    const newItems = [...checkItems];
    newItems[index].action = action;
    setCheckItems(newItems);
  };

  const handleCheckSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!moldNo || !checker) {
      alert("금형번호와 점검자를 입력해주세요.");
      return;
    }

    const ngCount = checkItems.filter((item) => item.result === "불량").length;
    const overallResult = ngCount === 0 ? "양호" : "불량";

    const newHistory: CheckHistory = {
      id: Date.now(),
      checkDate,
      moldNo,
      checker,
      overallResult,
      ngCount,
      items: [...checkItems],
    };

    setHistory([newHistory, ...history]);

    // Reset form
    setMoldNo("");
    setChecker("");
    setCheckItems(
      checkAreas.flatMap((area) =>
        area.items.map((item) => ({
          area: area.area,
          itemName: item.name,
          standard: item.standard,
          result: "" as const,
          action: "",
        }))
      )
    );

    alert("점검 기록이 저장되었습니다.");
  };

  const handleShotSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newShotData.moldNo) {
      alert("금형번호를 입력해주세요.");
      return;
    }

    const newShot: ShotCount = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      moldNo: newShotData.moldNo,
      previousShots: newShotData.previousShots,
      todayShots: newShotData.todayShots,
      totalShots: newShotData.previousShots + newShotData.todayShots,
      maintenanceTarget: newShotData.maintenanceTarget,
    };

    setShotCounts([newShot, ...shotCounts]);
    setNewShotData({
      moldNo: "",
      previousShots: 0,
      todayShots: 0,
      maintenanceTarget: 100000,
    });

    alert("샷수 기록이 저장되었습니다.");
  };

  const getShotProgress = (total: number, target: number) => {
    const percentage = (total / target) * 100;
    if (percentage >= 90) return "destructive";
    if (percentage >= 70) return "warning";
    return "success";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">금형 일상점검</h1>
          <p className="text-muted-foreground">금형 일상점검 및 샷수 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="check">
            <CheckCircle className="mr-2 h-4 w-4" />
            점검 입력
          </TabsTrigger>
          <TabsTrigger value="shots">
            <TrendingUp className="mr-2 h-4 w-4" />
            샷수 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            점검 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 점검 입력 */}
        <TabsContent value="check">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="h-5 w-5" />
                금형 일상점검 입력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckSubmit} className="space-y-6">
                {/* 헤더 정보 */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>점검일</Label>
                    <Input
                      type="date"
                      value={checkDate}
                      onChange={(e) => setCheckDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>금형번호</Label>
                    <Select value={moldNo} onValueChange={setMoldNo}>
                      <SelectTrigger>
                        <SelectValue placeholder="금형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M-001">M-001 (프론트 범퍼)</SelectItem>
                        <SelectItem value="M-002">M-002 (리어 범퍼)</SelectItem>
                        <SelectItem value="M-003">M-003 (사이드 미러)</SelectItem>
                        <SelectItem value="M-004">M-004 (도어 트림)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>점검자</Label>
                    <Input
                      value={checker}
                      onChange={(e) => setChecker(e.target.value)}
                      placeholder="점검자 이름"
                      required
                    />
                  </div>
                </div>

                {/* 점검 항목 테이블 */}
                <div className="space-y-2">
                  <Label>점검항목</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">점검부위</TableHead>
                          <TableHead className="w-[150px]">점검항목</TableHead>
                          <TableHead>점검기준</TableHead>
                          <TableHead className="w-[150px] text-center">점검결과</TableHead>
                          <TableHead className="w-[200px]">조치내용</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checkItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.area}</TableCell>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {item.standard}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "양호" ? "default" : "outline"}
                                  onClick={() => handleResultChange(index, "양호")}
                                  className={item.result === "양호" ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> 양호
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={item.result === "불량" ? "destructive" : "outline"}
                                  onClick={() => handleResultChange(index, "불량")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> 불량
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.action}
                                onChange={(e) => handleActionChange(index, e.target.value)}
                                placeholder="조치내용"
                                disabled={item.result !== "불량"}
                                className="h-8"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    점검 저장
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 샷수 현황 */}
        <TabsContent value="shots">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 샷수 입력 폼 */}
            <Card>
              <CardHeader>
                <CardTitle>샷수 입력</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShotSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>금형번호</Label>
                    <Select
                      value={newShotData.moldNo}
                      onValueChange={(v) => setNewShotData({ ...newShotData, moldNo: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="금형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M-001">M-001</SelectItem>
                        <SelectItem value="M-002">M-002</SelectItem>
                        <SelectItem value="M-003">M-003</SelectItem>
                        <SelectItem value="M-004">M-004</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>전일 샷수</Label>
                      <Input
                        type="number"
                        value={newShotData.previousShots}
                        onChange={(e) =>
                          setNewShotData({ ...newShotData, previousShots: parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>금일 샷수</Label>
                      <Input
                        type="number"
                        value={newShotData.todayShots}
                        onChange={(e) =>
                          setNewShotData({ ...newShotData, todayShots: parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>누적 샷수 (자동계산)</Label>
                    <Input
                      type="number"
                      value={newShotData.previousShots + newShotData.todayShots}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>정비 목표 샷수</Label>
                    <Input
                      type="number"
                      value={newShotData.maintenanceTarget}
                      onChange={(e) =>
                        setNewShotData({ ...newShotData, maintenanceTarget: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    샷수 저장
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 샷수 현황 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>샷수 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shotCounts.map((shot) => {
                    const progress = (shot.totalShots / shot.maintenanceTarget) * 100;
                    const variant = getShotProgress(shot.totalShots, shot.maintenanceTarget);
                    return (
                      <div key={shot.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{shot.moldNo}</span>
                          <Badge variant={variant}>
                            {progress.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">전일</span>
                            <p className="font-medium">{shot.previousShots.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">금일</span>
                            <p className="font-medium text-blue-600">+{shot.todayShots.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">누적</span>
                            <p className="font-medium">{shot.totalShots.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              variant === "destructive"
                                ? "bg-red-500"
                                : variant === "warning"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          목표: {shot.maintenanceTarget.toLocaleString()} shots
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 점검 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                점검 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">점검 기록이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>점검일</TableHead>
                      <TableHead>금형번호</TableHead>
                      <TableHead>점검자</TableHead>
                      <TableHead>불량 항목수</TableHead>
                      <TableHead>종합 판정</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.checkDate}</TableCell>
                        <TableCell className="font-mono">{record.moldNo}</TableCell>
                        <TableCell>{record.checker}</TableCell>
                        <TableCell>
                          {record.ngCount > 0 ? (
                            <span className="text-red-600 font-medium">{record.ngCount}건</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.overallResult === "양호" ? "success" : "destructive"}>
                            {record.overallResult}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
