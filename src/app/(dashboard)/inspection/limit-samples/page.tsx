"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileCheck, Plus, Save, Search, AlertTriangle, RefreshCw, History, List, Upload, Calendar, Image as ImageIcon } from "lucide-react";

interface LimitSample {
  id: number;
  // Header
  managementNo: string;
  productName: string;
  partNo: string;
  vehicleType: string;
  // Sample Info
  sampleType: "마스터" | "상한" | "하한" | "표준";
  applicationArea: string;
  creationDate: string;
  expiryDate: string;
  storageLocation: string;
  status: "사용중" | "폐기" | "갱신필요";
  // Status Info
  registrationDate: string;
  changeHistory: string;
  photoAttached: boolean;
  photoUrl?: string;
  // Renewal Info
  renewalCycle: number; // in months
  lastRenewalDate: string;
  nextRenewalDate: string;
}

interface RenewalHistory {
  id: number;
  sampleId: number;
  managementNo: string;
  productName: string;
  renewalDate: string;
  renewalType: "정기갱신" | "긴급갱신" | "재발급";
  previousExpiryDate: string;
  newExpiryDate: string;
  renewedBy: string;
  remarks: string;
}

// Sample data
const initialSamples: LimitSample[] = [
  {
    id: 1,
    managementNo: "LS-2024-001",
    productName: "도어 트림",
    partNo: "DT-12345",
    vehicleType: "GV80",
    sampleType: "마스터",
    applicationArea: "도어 내측 트림 표면",
    creationDate: "2024-01-15",
    expiryDate: "2026-07-15",
    storageLocation: "품질관리실 A-1",
    status: "사용중",
    registrationDate: "2024-01-15",
    changeHistory: "초기 등록",
    photoAttached: true,
    renewalCycle: 12,
    lastRenewalDate: "2025-01-15",
    nextRenewalDate: "2026-01-15",
  },
  {
    id: 2,
    managementNo: "LS-2024-002",
    productName: "범퍼 커버",
    partNo: "BC-67890",
    vehicleType: "GV70",
    sampleType: "상한",
    applicationArea: "전방 범퍼 도장면",
    creationDate: "2024-03-20",
    expiryDate: "2026-06-20",
    storageLocation: "품질관리실 B-2",
    status: "갱신필요",
    registrationDate: "2024-03-20",
    changeHistory: "초기 등록 -> 2025-03-20 갱신",
    photoAttached: true,
    renewalCycle: 12,
    lastRenewalDate: "2025-03-20",
    nextRenewalDate: "2026-03-20",
  },
  {
    id: 3,
    managementNo: "LS-2024-003",
    productName: "헤드라이트 렌즈",
    partNo: "HL-11111",
    vehicleType: "EV9",
    sampleType: "하한",
    applicationArea: "렌즈 투명도",
    creationDate: "2024-06-01",
    expiryDate: "2025-06-01",
    storageLocation: "품질관리실 C-3",
    status: "폐기",
    registrationDate: "2024-06-01",
    changeHistory: "초기 등록 -> 2025-06-01 폐기",
    photoAttached: false,
    renewalCycle: 12,
    lastRenewalDate: "2024-06-01",
    nextRenewalDate: "2025-06-01",
  },
  {
    id: 4,
    managementNo: "LS-2024-004",
    productName: "시트 커버",
    partNo: "SC-22222",
    vehicleType: "GV80",
    sampleType: "표준",
    applicationArea: "시트 표면 질감",
    creationDate: "2024-08-10",
    expiryDate: "2026-08-10",
    storageLocation: "품질관리실 A-2",
    status: "사용중",
    registrationDate: "2024-08-10",
    changeHistory: "초기 등록",
    photoAttached: true,
    renewalCycle: 24,
    lastRenewalDate: "2024-08-10",
    nextRenewalDate: "2026-08-10",
  },
];

const initialRenewalHistory: RenewalHistory[] = [
  {
    id: 1,
    sampleId: 1,
    managementNo: "LS-2024-001",
    productName: "도어 트림",
    renewalDate: "2025-01-15",
    renewalType: "정기갱신",
    previousExpiryDate: "2025-01-15",
    newExpiryDate: "2026-01-15",
    renewedBy: "홍길동",
    remarks: "정기 갱신 완료",
  },
  {
    id: 2,
    sampleId: 2,
    managementNo: "LS-2024-002",
    productName: "범퍼 커버",
    renewalDate: "2025-03-20",
    renewalType: "정기갱신",
    previousExpiryDate: "2025-03-20",
    newExpiryDate: "2026-03-20",
    renewedBy: "김철수",
    remarks: "정기 갱신 완료",
  },
];

export default function LimitSamplesPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [samples, setSamples] = useState<LimitSample[]>(initialSamples);
  const [renewalHistory, setRenewalHistory] = useState<RenewalHistory[]>(initialRenewalHistory);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sampleTypeFilter, setSampleTypeFilter] = useState<string>("all");

  // Registration form state
  const [formData, setFormData] = useState({
    managementNo: "",
    productName: "",
    partNo: "",
    vehicleType: "",
    sampleType: "" as "" | "마스터" | "상한" | "하한" | "표준",
    applicationArea: "",
    creationDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    storageLocation: "",
    status: "" as "" | "사용중" | "폐기" | "갱신필요",
    renewalCycle: 12,
    photoAttached: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    const newSample: LimitSample = {
      id: Date.now(),
      managementNo: formData.managementNo,
      productName: formData.productName,
      partNo: formData.partNo,
      vehicleType: formData.vehicleType,
      sampleType: formData.sampleType as "마스터" | "상한" | "하한" | "표준",
      applicationArea: formData.applicationArea,
      creationDate: formData.creationDate,
      expiryDate: formData.expiryDate,
      storageLocation: formData.storageLocation,
      status: formData.status as "사용중" | "폐기" | "갱신필요",
      registrationDate: today,
      changeHistory: "초기 등록",
      photoAttached: formData.photoAttached,
      renewalCycle: formData.renewalCycle,
      lastRenewalDate: formData.creationDate,
      nextRenewalDate: calculateNextRenewalDate(formData.creationDate, formData.renewalCycle),
    };
    setSamples([newSample, ...samples]);
    resetForm();
    alert("한도견본이 등록되었습니다.");
  };

  const calculateNextRenewalDate = (fromDate: string, cycleMonths: number): string => {
    const date = new Date(fromDate);
    date.setMonth(date.getMonth() + cycleMonths);
    return date.toISOString().split("T")[0];
  };

  const resetForm = () => {
    setFormData({
      managementNo: "",
      productName: "",
      partNo: "",
      vehicleType: "",
      sampleType: "",
      applicationArea: "",
      creationDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      storageLocation: "",
      status: "",
      renewalCycle: 12,
      photoAttached: false,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "default";
      case "갱신필요":
        return "warning";
      case "폐기":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getSampleTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "마스터":
        return "default";
      case "상한":
        return "secondary";
      case "하한":
        return "outline";
      case "표준":
        return "default";
      default:
        return "outline";
    }
  };

  const isExpiringSoon = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const filteredSamples = samples.filter((sample) => {
    const matchesSearch =
      sample.managementNo.toLowerCase().includes(search.toLowerCase()) ||
      sample.productName.toLowerCase().includes(search.toLowerCase()) ||
      sample.partNo.toLowerCase().includes(search.toLowerCase()) ||
      sample.vehicleType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sample.status === statusFilter;
    const matchesSampleType = sampleTypeFilter === "all" || sample.sampleType === sampleTypeFilter;
    return matchesSearch && matchesStatus && matchesSampleType;
  });

  const expiringOrExpiredSamples = samples.filter(
    (sample) => isExpiringSoon(sample.expiryDate) || isExpired(sample.expiryDate) || sample.status === "갱신필요"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">한도견본관리</h1>
          <p className="text-muted-foreground">한도견본 등록, 현황 관리 및 갱신 이력 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            한도견본 등록
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            견본 현황
            {expiringOrExpiredSamples.length > 0 && (
              <Badge variant="destructive" className="ml-1">{expiringOrExpiredSamples.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="renewal-history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            갱신 이력
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            견본 목록
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                한도견본 등록
              </CardTitle>
              <CardDescription>새로운 한도견본 정보를 등록합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>관리번호 *</Label>
                      <Input
                        value={formData.managementNo}
                        onChange={(e) => setFormData({ ...formData, managementNo: e.target.value })}
                        placeholder="LS-2024-XXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>제품명 *</Label>
                      <Input
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        placeholder="제품명을 입력하세요"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품번 *</Label>
                      <Input
                        value={formData.partNo}
                        onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                        placeholder="품번을 입력하세요"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>차종 *</Label>
                      <Input
                        value={formData.vehicleType}
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        placeholder="차종을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sample Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">한도견본 정보</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>견본유형 *</Label>
                      <Select
                        value={formData.sampleType}
                        onValueChange={(v) => setFormData({ ...formData, sampleType: v as "마스터" | "상한" | "하한" | "표준" })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="마스터">마스터</SelectItem>
                          <SelectItem value="상한">상한</SelectItem>
                          <SelectItem value="하한">하한</SelectItem>
                          <SelectItem value="표준">표준</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>적용부위 *</Label>
                      <Input
                        value={formData.applicationArea}
                        onChange={(e) => setFormData({ ...formData, applicationArea: e.target.value })}
                        placeholder="적용부위를 입력하세요"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>제작일 *</Label>
                      <Input
                        type="date"
                        value={formData.creationDate}
                        onChange={(e) => setFormData({ ...formData, creationDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>유효기간 *</Label>
                      <Input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>보관위치 *</Label>
                      <Input
                        value={formData.storageLocation}
                        onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                        placeholder="보관위치를 입력하세요"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상태 *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v as "사용중" | "폐기" | "갱신필요" })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="사용중">사용중</SelectItem>
                          <SelectItem value="폐기">폐기</SelectItem>
                          <SelectItem value="갱신필요">갱신필요</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>갱신주기 (개월) *</Label>
                      <Select
                        value={formData.renewalCycle.toString()}
                        onValueChange={(v) => setFormData({ ...formData, renewalCycle: parseInt(v) })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6개월</SelectItem>
                          <SelectItem value="12">12개월</SelectItem>
                          <SelectItem value="18">18개월</SelectItem>
                          <SelectItem value="24">24개월</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>사진첨부</Label>
                      <Button type="button" variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        사진 업로드
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={resetForm}>초기화</Button>
                  <Button type="submit"><Save className="mr-2 h-4 w-4" />등록</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Status with Expiry Alerts */}
        <TabsContent value="status">
          <div className="space-y-6">
            {/* Alert Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-700 text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    만료됨
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">
                    {samples.filter((s) => isExpired(s.expiryDate)).length}
                  </div>
                  <p className="text-xs text-red-600">즉시 갱신 필요</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-700 text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    30일 이내 만료
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-700">
                    {samples.filter((s) => isExpiringSoon(s.expiryDate)).length}
                  </div>
                  <p className="text-xs text-yellow-600">갱신 예정</p>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-orange-700 text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    갱신필요 상태
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">
                    {samples.filter((s) => s.status === "갱신필요").length}
                  </div>
                  <p className="text-xs text-orange-600">확인 필요</p>
                </CardContent>
              </Card>
            </div>

            {/* Status Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  견본 현황 (만료 및 갱신필요)
                </CardTitle>
                <CardDescription>유효기간이 만료되었거나 곧 만료되는 견본 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                {expiringOrExpiredSamples.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">만료되었거나 갱신이 필요한 견본이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>관리번호</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>차종</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead>유효기간</TableHead>
                        <TableHead>남은 일수</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>사진</TableHead>
                        <TableHead>조치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiringOrExpiredSamples.map((sample) => {
                        const expiry = new Date(sample.expiryDate);
                        const today = new Date();
                        const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <TableRow key={sample.id} className={isExpired(sample.expiryDate) ? "bg-red-50" : isExpiringSoon(sample.expiryDate) ? "bg-yellow-50" : ""}>
                            <TableCell className="font-mono">{sample.managementNo}</TableCell>
                            <TableCell>{sample.productName}</TableCell>
                            <TableCell>{sample.partNo}</TableCell>
                            <TableCell>{sample.vehicleType}</TableCell>
                            <TableCell>{sample.registrationDate}</TableCell>
                            <TableCell>{sample.expiryDate}</TableCell>
                            <TableCell>
                              <Badge variant={daysRemaining <= 0 ? "destructive" : "warning"}>
                                {daysRemaining <= 0 ? `${Math.abs(daysRemaining)}일 초과` : `${daysRemaining}일 남음`}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(sample.status)}>
                                {sample.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {sample.photoAttached ? (
                                <ImageIcon className="h-4 w-4 text-green-600" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <RefreshCw className="mr-1 h-3 w-3" />
                                갱신
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Change History Section */}
            <Card>
              <CardHeader>
                <CardTitle>변경 이력</CardTitle>
                <CardDescription>선택된 견본의 변경 이력을 확인합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>관리번호</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>변경이력</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samples.slice(0, 5).map((sample) => (
                      <TableRow key={sample.id}>
                        <TableCell className="font-mono">{sample.managementNo}</TableCell>
                        <TableCell>{sample.productName}</TableCell>
                        <TableCell>{sample.changeHistory}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Renewal History */}
        <TabsContent value="renewal-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                갱신 이력
              </CardTitle>
              <CardDescription>한도견본의 갱신 이력을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Renewal Summary */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">총 갱신 건수</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{renewalHistory.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">정기갱신</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{renewalHistory.filter((h) => h.renewalType === "정기갱신").length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">긴급갱신</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{renewalHistory.filter((h) => h.renewalType === "긴급갱신").length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">재발급</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{renewalHistory.filter((h) => h.renewalType === "재발급").length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Renewal Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">갱신 일정 관리</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>관리번호</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>갱신주기</TableHead>
                      <TableHead>최종갱신일</TableHead>
                      <TableHead>차기갱신예정일</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samples.map((sample) => {
                      const nextRenewal = new Date(sample.nextRenewalDate);
                      const today = new Date();
                      const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <TableRow key={sample.id}>
                          <TableCell className="font-mono">{sample.managementNo}</TableCell>
                          <TableCell>{sample.productName}</TableCell>
                          <TableCell>{sample.renewalCycle}개월</TableCell>
                          <TableCell>{sample.lastRenewalDate}</TableCell>
                          <TableCell>{sample.nextRenewalDate}</TableCell>
                          <TableCell>
                            {daysUntilRenewal <= 0 ? (
                              <Badge variant="destructive">갱신 필요</Badge>
                            ) : daysUntilRenewal <= 30 ? (
                              <Badge variant="warning">예정 ({daysUntilRenewal}일)</Badge>
                            ) : (
                              <Badge variant="default">정상</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Renewal History Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">갱신 이력 목록</h3>
                {renewalHistory.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">등록된 갱신 이력이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>관리번호</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>갱신일</TableHead>
                        <TableHead>갱신유형</TableHead>
                        <TableHead>이전 유효기간</TableHead>
                        <TableHead>새 유효기간</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renewalHistory.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell className="font-mono">{history.managementNo}</TableCell>
                          <TableCell>{history.productName}</TableCell>
                          <TableCell>{history.renewalDate}</TableCell>
                          <TableCell>
                            <Badge variant={history.renewalType === "긴급갱신" ? "destructive" : "outline"}>
                              {history.renewalType}
                            </Badge>
                          </TableCell>
                          <TableCell>{history.previousExpiryDate}</TableCell>
                          <TableCell>{history.newExpiryDate}</TableCell>
                          <TableCell>{history.renewedBy}</TableCell>
                          <TableCell>{history.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: List with Filters */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                견본 목록
              </CardTitle>
              <CardDescription>등록된 모든 한도견본 목록을 조회합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px] max-w-md relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="관리번호, 제품명, 품번, 차종으로 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">상태</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="폐기">폐기</SelectItem>
                      <SelectItem value="갱신필요">갱신필요</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">견본유형</Label>
                  <Select value={sampleTypeFilter} onValueChange={setSampleTypeFilter}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="마스터">마스터</SelectItem>
                      <SelectItem value="상한">상한</SelectItem>
                      <SelectItem value="하한">하한</SelectItem>
                      <SelectItem value="표준">표준</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all"); setSampleTypeFilter("all"); }}>
                  초기화
                </Button>
              </div>

              {/* Results Summary */}
              <div className="text-sm text-muted-foreground">
                총 {filteredSamples.length}건 / 전체 {samples.length}건
              </div>

              {/* Table */}
              {filteredSamples.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">조회된 한도견본이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>관리번호</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>품번</TableHead>
                      <TableHead>차종</TableHead>
                      <TableHead>견본유형</TableHead>
                      <TableHead>적용부위</TableHead>
                      <TableHead>제작일</TableHead>
                      <TableHead>유효기간</TableHead>
                      <TableHead>보관위치</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>사진</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSamples.map((sample) => (
                      <TableRow key={sample.id}>
                        <TableCell className="font-mono">{sample.managementNo}</TableCell>
                        <TableCell>{sample.productName}</TableCell>
                        <TableCell>{sample.partNo}</TableCell>
                        <TableCell>{sample.vehicleType}</TableCell>
                        <TableCell>
                          <Badge variant={getSampleTypeBadgeVariant(sample.sampleType)}>
                            {sample.sampleType}
                          </Badge>
                        </TableCell>
                        <TableCell>{sample.applicationArea}</TableCell>
                        <TableCell>{sample.creationDate}</TableCell>
                        <TableCell className={isExpired(sample.expiryDate) ? "text-red-600 font-medium" : isExpiringSoon(sample.expiryDate) ? "text-yellow-600 font-medium" : ""}>
                          {sample.expiryDate}
                        </TableCell>
                        <TableCell>{sample.storageLocation}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(sample.status)}>
                            {sample.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {sample.photoAttached ? (
                            <ImageIcon className="h-4 w-4 text-green-600" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
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
