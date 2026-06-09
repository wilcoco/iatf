"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Plus, Save, Search, Wrench, ClipboardCheck, BarChart3 } from "lucide-react";

// Interfaces
interface MoldInfo {
  id: number;
  moldNo: string;
  moldName: string;
  productName: string;
  partNo: string;
  manufactureDate: string;
  manufacturer: string;
  cavityCount: number;
  guaranteedShots: number;
  currentShots: number;
  status: "사용중" | "수리중" | "폐기" | "보관";
  storageLocation: string;
}

interface InspectionRecord {
  id: number;
  moldNo: string;
  inspectionDate: string;
  inspectionItem: string;
  inspectionResult: string;
  actionTaken: string;
}

interface RepairRecord {
  id: number;
  moldNo: string;
  repairDate: string;
  repairContent: string;
  repairCost: number;
  repairCompany: string;
}

export default function MoldInventoryPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [search, setSearch] = useState("");

  // Mold Info State
  const [molds, setMolds] = useState<MoldInfo[]>([
    {
      id: 1,
      moldNo: "M-001",
      moldName: "프론트 범퍼 금형",
      productName: "프론트 범퍼",
      partNo: "P-10001",
      manufactureDate: "2023-01-15",
      manufacturer: "한국금형",
      cavityCount: 2,
      guaranteedShots: 500000,
      currentShots: 125000,
      status: "사용중",
      storageLocation: "A-1-01",
    },
    {
      id: 2,
      moldNo: "M-002",
      moldName: "리어 범퍼 금형",
      productName: "리어 범퍼",
      partNo: "P-10002",
      manufactureDate: "2022-06-20",
      manufacturer: "대한몰드",
      cavityCount: 1,
      guaranteedShots: 400000,
      currentShots: 380000,
      status: "수리중",
      storageLocation: "A-2-03",
    },
  ]);
  const [showMoldForm, setShowMoldForm] = useState(false);
  const [moldFormData, setMoldFormData] = useState<Omit<MoldInfo, "id">>({
    moldNo: "",
    moldName: "",
    productName: "",
    partNo: "",
    manufactureDate: new Date().toISOString().split("T")[0],
    manufacturer: "",
    cavityCount: 1,
    guaranteedShots: 0,
    currentShots: 0,
    status: "사용중",
    storageLocation: "",
  });

  // Inspection State
  const [inspections, setInspections] = useState<InspectionRecord[]>([
    {
      id: 1,
      moldNo: "M-001",
      inspectionDate: "2024-01-10",
      inspectionItem: "파팅라인 상태",
      inspectionResult: "양호",
      actionTaken: "-",
    },
    {
      id: 2,
      moldNo: "M-002",
      inspectionDate: "2024-01-08",
      inspectionItem: "냉각수로 점검",
      inspectionResult: "불량",
      actionTaken: "수리 의뢰",
    },
  ]);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [inspectionFormData, setInspectionFormData] = useState<Omit<InspectionRecord, "id">>({
    moldNo: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionItem: "",
    inspectionResult: "",
    actionTaken: "",
  });

  // Repair State
  const [repairs, setRepairs] = useState<RepairRecord[]>([
    {
      id: 1,
      moldNo: "M-002",
      repairDate: "2024-01-12",
      repairContent: "냉각수로 청소 및 보수",
      repairCost: 1500000,
      repairCompany: "금형수리전문",
    },
  ]);
  const [showRepairForm, setShowRepairForm] = useState(false);
  const [repairFormData, setRepairFormData] = useState<Omit<RepairRecord, "id">>({
    moldNo: "",
    repairDate: new Date().toISOString().split("T")[0],
    repairContent: "",
    repairCost: 0,
    repairCompany: "",
  });

  // Shot count update
  const [selectedMoldForShot, setSelectedMoldForShot] = useState("");
  const [shotIncrement, setShotIncrement] = useState(0);

  // Handlers
  const handleMoldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMold: MoldInfo = {
      id: Date.now(),
      ...moldFormData,
    };
    setMolds([newMold, ...molds]);
    setShowMoldForm(false);
    setMoldFormData({
      moldNo: "",
      moldName: "",
      productName: "",
      partNo: "",
      manufactureDate: new Date().toISOString().split("T")[0],
      manufacturer: "",
      cavityCount: 1,
      guaranteedShots: 0,
      currentShots: 0,
      status: "사용중",
      storageLocation: "",
    });
    alert("금형 정보가 저장되었습니다.");
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInspection: InspectionRecord = {
      id: Date.now(),
      ...inspectionFormData,
    };
    setInspections([newInspection, ...inspections]);
    setShowInspectionForm(false);
    setInspectionFormData({
      moldNo: "",
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectionItem: "",
      inspectionResult: "",
      actionTaken: "",
    });
    alert("점검 기록이 저장되었습니다.");
  };

  const handleRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRepair: RepairRecord = {
      id: Date.now(),
      ...repairFormData,
    };
    setRepairs([newRepair, ...repairs]);
    setShowRepairForm(false);
    setRepairFormData({
      moldNo: "",
      repairDate: new Date().toISOString().split("T")[0],
      repairContent: "",
      repairCost: 0,
      repairCompany: "",
    });
    alert("수리 기록이 저장되었습니다.");
  };

  const handleShotUpdate = () => {
    if (!selectedMoldForShot || shotIncrement <= 0) {
      alert("금형을 선택하고 샷수를 입력해주세요.");
      return;
    }
    setMolds(molds.map(m =>
      m.moldNo === selectedMoldForShot
        ? { ...m, currentShots: m.currentShots + shotIncrement }
        : m
    ));
    setSelectedMoldForShot("");
    setShotIncrement(0);
    alert("샷수가 업데이트되었습니다.");
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "success";
      case "수리중":
        return "warning";
      case "폐기":
        return "destructive";
      case "보관":
        return "outline";
      default:
        return "outline";
    }
  };

  const getShotPercentage = (current: number, guaranteed: number) => {
    return ((current / guaranteed) * 100).toFixed(1);
  };

  const filteredMolds = molds.filter(
    (m) =>
      m.moldNo.toLowerCase().includes(search.toLowerCase()) ||
      m.moldName.toLowerCase().includes(search.toLowerCase()) ||
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.partNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">금형관리</h1>
          <p className="text-muted-foreground">금형 정보, 점검, 수리 이력 통합 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <Box className="mr-2 h-4 w-4" />
            금형 기본정보
          </TabsTrigger>
          <TabsTrigger value="inspection">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            점검 관리
          </TabsTrigger>
          <TabsTrigger value="repair">
            <Wrench className="mr-2 h-4 w-4" />
            수리 이력
          </TabsTrigger>
          <TabsTrigger value="status">
            <BarChart3 className="mr-2 h-4 w-4" />
            금형 현황
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 금형 기본정보 */}
        <TabsContent value="basic">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="금형번호, 금형명, 제품명, 품번으로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowMoldForm(!showMoldForm)}>
                <Plus className="mr-2 h-4 w-4" />
                금형 등록
              </Button>
            </div>

            {showMoldForm && (
              <Card>
                <CardHeader>
                  <CardTitle>금형 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMoldSubmit} className="space-y-6">
                    {/* Header Fields */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>금형번호 *</Label>
                        <Input
                          value={moldFormData.moldNo}
                          onChange={(e) => setMoldFormData({ ...moldFormData, moldNo: e.target.value })}
                          placeholder="M-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>금형명 *</Label>
                        <Input
                          value={moldFormData.moldName}
                          onChange={(e) => setMoldFormData({ ...moldFormData, moldName: e.target.value })}
                          placeholder="금형명을 입력하세요"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>제품명 *</Label>
                        <Input
                          value={moldFormData.productName}
                          onChange={(e) => setMoldFormData({ ...moldFormData, productName: e.target.value })}
                          placeholder="제품명을 입력하세요"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={moldFormData.partNo}
                          onChange={(e) => setMoldFormData({ ...moldFormData, partNo: e.target.value })}
                          placeholder="P-10001"
                          required
                        />
                      </div>
                    </div>

                    {/* Mold Info Fields */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>제작일 *</Label>
                        <Input
                          type="date"
                          value={moldFormData.manufactureDate}
                          onChange={(e) => setMoldFormData({ ...moldFormData, manufactureDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>제작업체 *</Label>
                        <Input
                          value={moldFormData.manufacturer}
                          onChange={(e) => setMoldFormData({ ...moldFormData, manufacturer: e.target.value })}
                          placeholder="제작업체를 입력하세요"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>캐비티수 *</Label>
                        <Input
                          type="number"
                          min={1}
                          value={moldFormData.cavityCount}
                          onChange={(e) => setMoldFormData({ ...moldFormData, cavityCount: parseInt(e.target.value) || 1 })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>보증샷수 *</Label>
                        <Input
                          type="number"
                          min={0}
                          value={moldFormData.guaranteedShots}
                          onChange={(e) => setMoldFormData({ ...moldFormData, guaranteedShots: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>현재샷수</Label>
                        <Input
                          type="number"
                          min={0}
                          value={moldFormData.currentShots}
                          onChange={(e) => setMoldFormData({ ...moldFormData, currentShots: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>상태 *</Label>
                        <Select
                          value={moldFormData.status}
                          onValueChange={(v) => setMoldFormData({ ...moldFormData, status: v as "사용중" | "수리중" | "폐기" | "보관" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="사용중">사용중</SelectItem>
                            <SelectItem value="수리중">수리중</SelectItem>
                            <SelectItem value="폐기">폐기</SelectItem>
                            <SelectItem value="보관">보관</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>보관위치 *</Label>
                        <Input
                          value={moldFormData.storageLocation}
                          onChange={(e) => setMoldFormData({ ...moldFormData, storageLocation: e.target.value })}
                          placeholder="A-1-01"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowMoldForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Shot Count Update Card */}
            <Card>
              <CardHeader>
                <CardTitle>샷수 업데이트</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label>금형 선택</Label>
                    <Select value={selectedMoldForShot} onValueChange={setSelectedMoldForShot}>
                      <SelectTrigger><SelectValue placeholder="금형 선택" /></SelectTrigger>
                      <SelectContent>
                        {molds.filter(m => m.status === "사용중").map(m => (
                          <SelectItem key={m.id} value={m.moldNo}>
                            {m.moldNo} - {m.moldName} (현재: {m.currentShots.toLocaleString()}샷)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 w-48">
                    <Label>추가 샷수</Label>
                    <Input
                      type="number"
                      min={0}
                      value={shotIncrement || ""}
                      onChange={(e) => setShotIncrement(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <Button onClick={handleShotUpdate}>
                    <Plus className="mr-2 h-4 w-4" />
                    샷수 추가
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  금형 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredMolds.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 금형이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>금형번호</TableHead>
                        <TableHead>금형명</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>제작업체</TableHead>
                        <TableHead>캐비티</TableHead>
                        <TableHead>샷수 현황</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>보관위치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMolds.map((mold) => (
                        <TableRow key={mold.id}>
                          <TableCell className="font-mono">{mold.moldNo}</TableCell>
                          <TableCell>{mold.moldName}</TableCell>
                          <TableCell>{mold.productName}</TableCell>
                          <TableCell className="font-mono">{mold.partNo}</TableCell>
                          <TableCell>{mold.manufacturer}</TableCell>
                          <TableCell className="text-center">{mold.cavityCount}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {mold.currentShots.toLocaleString()} / {mold.guaranteedShots.toLocaleString()}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    parseFloat(getShotPercentage(mold.currentShots, mold.guaranteedShots)) >= 90
                                      ? 'bg-red-500'
                                      : parseFloat(getShotPercentage(mold.currentShots, mold.guaranteedShots)) >= 70
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, parseFloat(getShotPercentage(mold.currentShots, mold.guaranteedShots)))}%` }}
                                />
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getShotPercentage(mold.currentShots, mold.guaranteedShots)}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(mold.status)}>
                              {mold.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{mold.storageLocation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 점검 관리 */}
        <TabsContent value="inspection">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowInspectionForm(!showInspectionForm)}>
                <Plus className="mr-2 h-4 w-4" />
                점검 기록 추가
              </Button>
            </div>

            {showInspectionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>점검 기록 추가</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInspectionSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>금형번호 *</Label>
                        <Select
                          value={inspectionFormData.moldNo}
                          onValueChange={(v) => setInspectionFormData({ ...inspectionFormData, moldNo: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="금형 선택" /></SelectTrigger>
                          <SelectContent>
                            {molds.map(m => (
                              <SelectItem key={m.id} value={m.moldNo}>
                                {m.moldNo} - {m.moldName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>점검일 *</Label>
                        <Input
                          type="date"
                          value={inspectionFormData.inspectionDate}
                          onChange={(e) => setInspectionFormData({ ...inspectionFormData, inspectionDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>점검항목 *</Label>
                        <Select
                          value={inspectionFormData.inspectionItem}
                          onValueChange={(v) => setInspectionFormData({ ...inspectionFormData, inspectionItem: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="점검항목 선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="파팅라인 상태">파팅라인 상태</SelectItem>
                            <SelectItem value="냉각수로 점검">냉각수로 점검</SelectItem>
                            <SelectItem value="이젝터 핀 점검">이젝터 핀 점검</SelectItem>
                            <SelectItem value="가이드 핀 점검">가이드 핀 점검</SelectItem>
                            <SelectItem value="코어/캐비티 상태">코어/캐비티 상태</SelectItem>
                            <SelectItem value="러너/게이트 상태">러너/게이트 상태</SelectItem>
                            <SelectItem value="기타">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>점검결과 *</Label>
                        <Select
                          value={inspectionFormData.inspectionResult}
                          onValueChange={(v) => setInspectionFormData({ ...inspectionFormData, inspectionResult: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="결과 선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="양호">양호</SelectItem>
                            <SelectItem value="주의">주의</SelectItem>
                            <SelectItem value="불량">불량</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>조치사항</Label>
                      <Input
                        value={inspectionFormData.actionTaken}
                        onChange={(e) => setInspectionFormData({ ...inspectionFormData, actionTaken: e.target.value })}
                        placeholder="조치사항을 입력하세요"
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowInspectionForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  점검 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inspections.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 점검 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>금형번호</TableHead>
                        <TableHead>점검일</TableHead>
                        <TableHead>점검항목</TableHead>
                        <TableHead>점검결과</TableHead>
                        <TableHead>조치사항</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspections.map((inspection) => (
                        <TableRow key={inspection.id}>
                          <TableCell className="font-mono">{inspection.moldNo}</TableCell>
                          <TableCell>{inspection.inspectionDate}</TableCell>
                          <TableCell>{inspection.inspectionItem}</TableCell>
                          <TableCell>
                            <Badge variant={
                              inspection.inspectionResult === "양호" ? "success" :
                              inspection.inspectionResult === "주의" ? "warning" : "destructive"
                            }>
                              {inspection.inspectionResult}
                            </Badge>
                          </TableCell>
                          <TableCell>{inspection.actionTaken || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 수리 이력 */}
        <TabsContent value="repair">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setShowRepairForm(!showRepairForm)}>
                <Plus className="mr-2 h-4 w-4" />
                수리 기록 추가
              </Button>
            </div>

            {showRepairForm && (
              <Card>
                <CardHeader>
                  <CardTitle>수리 기록 추가</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRepairSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>금형번호 *</Label>
                        <Select
                          value={repairFormData.moldNo}
                          onValueChange={(v) => setRepairFormData({ ...repairFormData, moldNo: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="금형 선택" /></SelectTrigger>
                          <SelectContent>
                            {molds.map(m => (
                              <SelectItem key={m.id} value={m.moldNo}>
                                {m.moldNo} - {m.moldName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>수리일 *</Label>
                        <Input
                          type="date"
                          value={repairFormData.repairDate}
                          onChange={(e) => setRepairFormData({ ...repairFormData, repairDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>수리내용 *</Label>
                      <Input
                        value={repairFormData.repairContent}
                        onChange={(e) => setRepairFormData({ ...repairFormData, repairContent: e.target.value })}
                        placeholder="수리 내용을 입력하세요"
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>수리비용 (원) *</Label>
                        <Input
                          type="number"
                          min={0}
                          value={repairFormData.repairCost || ""}
                          onChange={(e) => setRepairFormData({ ...repairFormData, repairCost: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>수리업체 *</Label>
                        <Input
                          value={repairFormData.repairCompany}
                          onChange={(e) => setRepairFormData({ ...repairFormData, repairCompany: e.target.value })}
                          placeholder="수리업체를 입력하세요"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowRepairForm(false)}>취소</Button>
                      <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  수리 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {repairs.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 수리 기록이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>금형번호</TableHead>
                        <TableHead>수리일</TableHead>
                        <TableHead>수리내용</TableHead>
                        <TableHead>수리비용</TableHead>
                        <TableHead>수리업체</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repairs.map((repair) => (
                        <TableRow key={repair.id}>
                          <TableCell className="font-mono">{repair.moldNo}</TableCell>
                          <TableCell>{repair.repairDate}</TableCell>
                          <TableCell>{repair.repairContent}</TableCell>
                          <TableCell className="text-right">{repair.repairCost.toLocaleString()}원</TableCell>
                          <TableCell>{repair.repairCompany}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 금형 현황 */}
        <TabsContent value="status">
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">전체 금형</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{molds.length}개</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">사용중</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {molds.filter(m => m.status === "사용중").length}개
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">수리중</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {molds.filter(m => m.status === "수리중").length}개
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">보증샷수 90% 이상</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {molds.filter(m => (m.currentShots / m.guaranteedShots) >= 0.9).length}개
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status by Category */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>상태별 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["사용중", "수리중", "보관", "폐기"].map((status) => {
                      const count = molds.filter(m => m.status === status).length;
                      const percentage = molds.length > 0 ? ((count / molds.length) * 100).toFixed(1) : "0";
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(status)}>{status}</Badge>
                            <span className="text-sm text-muted-foreground">{count}개</span>
                          </div>
                          <div className="flex items-center gap-2 w-1/2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  status === "사용중" ? "bg-green-500" :
                                  status === "수리중" ? "bg-yellow-500" :
                                  status === "보관" ? "bg-gray-500" : "bg-red-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm w-12 text-right">{percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>샷수 경고 금형</CardTitle>
                </CardHeader>
                <CardContent>
                  {molds.filter(m => (m.currentShots / m.guaranteedShots) >= 0.7).length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center">경고 대상 금형이 없습니다.</p>
                  ) : (
                    <div className="space-y-3">
                      {molds
                        .filter(m => (m.currentShots / m.guaranteedShots) >= 0.7)
                        .sort((a, b) => (b.currentShots / b.guaranteedShots) - (a.currentShots / a.guaranteedShots))
                        .map((mold) => {
                          const percentage = parseFloat(getShotPercentage(mold.currentShots, mold.guaranteedShots));
                          return (
                            <div key={mold.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <div className="font-medium">{mold.moldNo}</div>
                                <div className="text-sm text-muted-foreground">{mold.moldName}</div>
                              </div>
                              <div className="text-right">
                                <Badge variant={percentage >= 90 ? "destructive" : "warning"}>
                                  {percentage}%
                                </Badge>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {mold.currentShots.toLocaleString()} / {mold.guaranteedShots.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Full Mold List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  전체 금형 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>금형번호</TableHead>
                      <TableHead>금형명</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>샷수 현황</TableHead>
                      <TableHead>최근 점검</TableHead>
                      <TableHead>최근 수리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {molds.map((mold) => {
                      const lastInspection = inspections
                        .filter(i => i.moldNo === mold.moldNo)
                        .sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime())[0];
                      const lastRepair = repairs
                        .filter(r => r.moldNo === mold.moldNo)
                        .sort((a, b) => new Date(b.repairDate).getTime() - new Date(a.repairDate).getTime())[0];

                      return (
                        <TableRow key={mold.id}>
                          <TableCell className="font-mono">{mold.moldNo}</TableCell>
                          <TableCell>{mold.moldName}</TableCell>
                          <TableCell>{mold.productName}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(mold.status)}>
                              {mold.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    (mold.currentShots / mold.guaranteedShots) >= 0.9
                                      ? 'bg-red-500'
                                      : (mold.currentShots / mold.guaranteedShots) >= 0.7
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (mold.currentShots / mold.guaranteedShots) * 100)}%` }}
                                />
                              </div>
                              <span className="text-sm">{getShotPercentage(mold.currentShots, mold.guaranteedShots)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {lastInspection ? (
                              <div>
                                <div className="text-sm">{lastInspection.inspectionDate}</div>
                                <Badge variant={
                                  lastInspection.inspectionResult === "양호" ? "success" :
                                  lastInspection.inspectionResult === "주의" ? "warning" : "destructive"
                                } className="mt-1">
                                  {lastInspection.inspectionResult}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {lastRepair ? (
                              <div>
                                <div className="text-sm">{lastRepair.repairDate}</div>
                                <div className="text-xs text-muted-foreground">{lastRepair.repairContent}</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
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
      </Tabs>
    </div>
  );
}
