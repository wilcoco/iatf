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
  FileText,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  History,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

// Types
type ClaimStatus = "접수" | "분석중" | "조치완료" | "종결";
type DefectCategory = "외관불량" | "치수불량" | "기능불량" | "재질불량" | "조립불량" | "기타";

interface WarrantyClaim {
  id: string;
  claimNumber: string;
  receiptDate: string;
  customer: string;
  vehicleType: string;
  partNumber: string;
  partName: string;
  defectDescription: string;
  defectQuantity: number;
  warrantyCost: number;
  status: ClaimStatus;
  ntfResult?: "NTF" | "실불량";
  rootCause?: string;
  fiveWhyAnalysis?: string[];
  correctiveAction?: string;
}

interface MonthlyWarrantyCost {
  month: number;
  cost: number;
  claimCount: number;
  target: number;
}

interface CategoryCostData {
  category: string;
  cost: number;
  count: number;
  percentage: number;
}

// Sample warranty claims data
const sampleWarrantyClaims: WarrantyClaim[] = [
  {
    id: "WC-2026-0001",
    claimNumber: "WC-2026-0001",
    receiptDate: "2026-01-15",
    customer: "현대자동차",
    vehicleType: "NQ5",
    partNumber: "PN-NQ5-001",
    partName: "범퍼 커버",
    defectDescription: "도장 이물 발생으로 인한 외관 불량",
    defectQuantity: 5,
    warrantyCost: 1250000,
    status: "종결",
    ntfResult: "실불량",
    rootCause: "도장 라인 필터 오염",
    fiveWhyAnalysis: [
      "왜 도장 이물이 발생했는가? - 필터 오염",
      "왜 필터가 오염되었는가? - 교체 주기 미준수",
      "왜 교체 주기를 미준수했는가? - 관리 기준 부재",
      "왜 관리 기준이 없었는가? - 표준화 미흡",
      "왜 표준화가 미흡했는가? - 초기 설비 도입 시 기준 미수립"
    ],
    correctiveAction: "필터 교체 주기 표준화 및 점검 체크리스트 도입"
  },
  {
    id: "WC-2026-0002",
    claimNumber: "WC-2026-0002",
    receiptDate: "2026-02-20",
    customer: "기아자동차",
    vehicleType: "SP2",
    partNumber: "PN-SP2-002",
    partName: "사이드 미러 하우징",
    defectDescription: "조립 시 간섭 발생",
    defectQuantity: 3,
    warrantyCost: 890000,
    status: "조치완료",
    ntfResult: "실불량",
    rootCause: "금형 마모로 인한 치수 변화",
    fiveWhyAnalysis: [
      "왜 간섭이 발생했는가? - 치수 규격 초과",
      "왜 치수가 규격을 초과했는가? - 금형 마모",
      "왜 금형이 마모되었는가? - 사용 횟수 초과",
      "왜 사용 횟수가 초과되었는가? - 금형 수명 관리 부재",
      "왜 금형 수명 관리가 없었는가? - 예방보전 체계 미구축"
    ],
    correctiveAction: "금형 수명 관리 시스템 구축 및 예방보전 계획 수립"
  },
  {
    id: "WC-2026-0003",
    claimNumber: "WC-2026-0003",
    receiptDate: "2026-03-10",
    customer: "현대모비스",
    vehicleType: "GN7",
    partNumber: "PN-GN7-003",
    partName: "라디에이터 그릴",
    defectDescription: "크롬 도금 박리",
    defectQuantity: 8,
    warrantyCost: 2100000,
    status: "분석중",
    ntfResult: undefined,
    rootCause: undefined
  },
  {
    id: "WC-2026-0004",
    claimNumber: "WC-2026-0004",
    receiptDate: "2026-04-05",
    customer: "현대자동차",
    vehicleType: "CE",
    partNumber: "PN-CE-004",
    partName: "도어 트림",
    defectDescription: "사용 중 이상 소음 발생",
    defectQuantity: 2,
    warrantyCost: 450000,
    status: "종결",
    ntfResult: "NTF",
    rootCause: "재현 불가 - 고객 사용 환경 문제로 판단",
    correctiveAction: "고객 응대 완료"
  },
  {
    id: "WC-2026-0005",
    claimNumber: "WC-2026-0005",
    receiptDate: "2026-05-18",
    customer: "기아자동차",
    vehicleType: "EV9",
    partNumber: "PN-EV9-005",
    partName: "배터리 커버",
    defectDescription: "체결부 균열 발생",
    defectQuantity: 1,
    warrantyCost: 3500000,
    status: "접수"
  },
  {
    id: "WC-2026-0006",
    claimNumber: "WC-2026-0006",
    receiptDate: "2026-06-02",
    customer: "현대모비스",
    vehicleType: "MX5",
    partNumber: "PN-MX5-006",
    partName: "센터 콘솔",
    defectDescription: "표면 스크래치 다수 발생",
    defectQuantity: 4,
    warrantyCost: 780000,
    status: "접수"
  }
];

// Monthly warranty cost data for 2026
const monthlyWarrantyCostData: MonthlyWarrantyCost[] = [
  { month: 1, cost: 1250000, claimCount: 3, target: 2000000 },
  { month: 2, cost: 890000, claimCount: 2, target: 2000000 },
  { month: 3, cost: 2100000, claimCount: 4, target: 2000000 },
  { month: 4, cost: 1650000, claimCount: 3, target: 2000000 },
  { month: 5, cost: 3500000, claimCount: 5, target: 2000000 },
  { month: 6, cost: 780000, claimCount: 2, target: 2000000 },
  { month: 7, cost: 0, claimCount: 0, target: 2000000 },
  { month: 8, cost: 0, claimCount: 0, target: 2000000 },
  { month: 9, cost: 0, claimCount: 0, target: 2000000 },
  { month: 10, cost: 0, claimCount: 0, target: 2000000 },
  { month: 11, cost: 0, claimCount: 0, target: 2000000 },
  { month: 12, cost: 0, claimCount: 0, target: 2000000 }
];

// Category cost data
const categoryCostData: CategoryCostData[] = [
  { category: "외관불량", cost: 4030000, count: 9, percentage: 38.5 },
  { category: "치수불량", cost: 2540000, count: 5, percentage: 24.3 },
  { category: "기능불량", cost: 1890000, count: 3, percentage: 18.1 },
  { category: "재질불량", cost: 1200000, count: 2, percentage: 11.5 },
  { category: "조립불량", cost: 800000, count: 1, percentage: 7.6 }
];

// Type cost data
const typeCostData: CategoryCostData[] = [
  { category: "NQ5", cost: 3200000, count: 7, percentage: 30.6 },
  { category: "SP2", cost: 2100000, count: 4, percentage: 20.1 },
  { category: "GN7", cost: 2100000, count: 4, percentage: 20.1 },
  { category: "EV9", cost: 1800000, count: 2, percentage: 17.2 },
  { category: "CE", cost: 750000, count: 2, percentage: 7.2 },
  { category: "MX5", cost: 510000, count: 2, percentage: 4.9 }
];

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("ko-KR").format(value);
};

export default function WarrantyManagementPage() {
  const [activeTab, setActiveTab] = useState("claim-registration");
  const [claims, setClaims] = useState<WarrantyClaim[]>(sampleWarrantyClaims);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // New claim form state
  const [newClaim, setNewClaim] = useState<Partial<WarrantyClaim>>({
    status: "접수"
  });

  // Root cause analysis form state
  const [analysisForm, setAnalysisForm] = useState({
    ntfResult: "" as "NTF" | "실불량" | "",
    rootCause: "",
    fiveWhy1: "",
    fiveWhy2: "",
    fiveWhy3: "",
    fiveWhy4: "",
    fiveWhy5: "",
    correctiveAction: ""
  });

  const handleAddClaim = () => {
    if (!newClaim.partNumber || !newClaim.customer || !newClaim.partName) {
      alert("품번, 고객사, 품명은 필수 입력 항목입니다.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newId = `WC-2026-${String(claims.length + 1).padStart(4, "0")}`;

    const claim: WarrantyClaim = {
      id: newId,
      claimNumber: newId,
      receiptDate: newClaim.receiptDate || today,
      customer: newClaim.customer || "",
      vehicleType: newClaim.vehicleType || "",
      partNumber: newClaim.partNumber || "",
      partName: newClaim.partName || "",
      defectDescription: newClaim.defectDescription || "",
      defectQuantity: newClaim.defectQuantity || 1,
      warrantyCost: newClaim.warrantyCost || 0,
      status: "접수"
    };

    setClaims([...claims, claim]);
    setNewClaim({ status: "접수" });
    alert("보증 클레임이 등록되었습니다.");
  };

  const handleSaveAnalysis = () => {
    if (!selectedClaim) return;

    const updatedClaims = claims.map(claim => {
      if (claim.id === selectedClaim.id) {
        return {
          ...claim,
          ntfResult: analysisForm.ntfResult as "NTF" | "실불량" | undefined,
          rootCause: analysisForm.rootCause,
          fiveWhyAnalysis: [
            analysisForm.fiveWhy1,
            analysisForm.fiveWhy2,
            analysisForm.fiveWhy3,
            analysisForm.fiveWhy4,
            analysisForm.fiveWhy5
          ].filter(w => w),
          correctiveAction: analysisForm.correctiveAction,
          status: analysisForm.correctiveAction ? "조치완료" as ClaimStatus : "분석중" as ClaimStatus
        };
      }
      return claim;
    });

    setClaims(updatedClaims);
    alert("원인분석 내용이 저장되었습니다.");
  };

  const selectClaimForAnalysis = (claim: WarrantyClaim) => {
    setSelectedClaim(claim);
    setAnalysisForm({
      ntfResult: claim.ntfResult || "",
      rootCause: claim.rootCause || "",
      fiveWhy1: claim.fiveWhyAnalysis?.[0] || "",
      fiveWhy2: claim.fiveWhyAnalysis?.[1] || "",
      fiveWhy3: claim.fiveWhyAnalysis?.[2] || "",
      fiveWhy4: claim.fiveWhyAnalysis?.[3] || "",
      fiveWhy5: claim.fiveWhyAnalysis?.[4] || "",
      correctiveAction: claim.correctiveAction || ""
    });
  };

  const filteredClaims = claims.filter(claim =>
    claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.partName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary statistics
  const totalWarrantyCost = monthlyWarrantyCostData.reduce((sum, m) => sum + m.cost, 0);
  const totalClaimCount = claims.length;
  const ntfCount = claims.filter(c => c.ntfResult === "NTF").length;
  const actualDefectCount = claims.filter(c => c.ntfResult === "실불량").length;
  const pendingCount = claims.filter(c => c.status === "접수" || c.status === "분석중").length;

  const maxMonthlyCost = Math.max(...monthlyWarrantyCostData.map(m => Math.max(m.cost, m.target)), 1);

  const getStatusBadgeVariant = (status: ClaimStatus) => {
    switch (status) {
      case "접수": return "default";
      case "분석중": return "warning";
      case "조치완료": return "success";
      case "종결": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">보증관리</h1>
          <p className="text-muted-foreground">
            IATF 16949 보증 클레임 관리 및 분석 시스템
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 보증비용</CardTitle>
            <div className="rounded-lg p-2 bg-red-100">
              <DollarSign className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalWarrantyCost)}</div>
            <p className="text-xs text-muted-foreground">2026년 누적</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">클레임 건수</CardTitle>
            <div className="rounded-lg p-2 bg-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaimCount}건</div>
            <p className="text-xs text-muted-foreground">전체 등록 건수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NTF 건수</CardTitle>
            <div className="rounded-lg p-2 bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ntfCount}건</div>
            <p className="text-xs text-muted-foreground">No Trouble Found</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실 불량</CardTitle>
            <div className="rounded-lg p-2 bg-orange-100">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actualDefectCount}건</div>
            <p className="text-xs text-muted-foreground">원인 규명 완료</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">처리 대기</CardTitle>
            <div className="rounded-lg p-2 bg-yellow-100">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}건</div>
            <p className="text-xs text-muted-foreground">분석/조치 필요</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="claim-registration">
            <FileText className="mr-2 h-4 w-4" />
            보증 클레임 등록
          </TabsTrigger>
          <TabsTrigger value="root-cause-analysis">
            <Search className="mr-2 h-4 w-4" />
            원인분석
          </TabsTrigger>
          <TabsTrigger value="warranty-cost">
            <TrendingUp className="mr-2 h-4 w-4" />
            보증비용 현황
          </TabsTrigger>
          <TabsTrigger value="warranty-history">
            <History className="mr-2 h-4 w-4" />
            보증 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 보증 클레임 등록 */}
        <TabsContent value="claim-registration">
          <div className="grid grid-cols-2 gap-6">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  신규 보증 클레임 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>클레임번호</Label>
                    <Input
                      value={`WC-2026-${String(claims.length + 1).padStart(4, "0")}`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>접수일 *</Label>
                    <Input
                      type="date"
                      value={newClaim.receiptDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setNewClaim({ ...newClaim, receiptDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>고객사 *</Label>
                    <Select
                      value={newClaim.customer}
                      onValueChange={(value) => setNewClaim({ ...newClaim, customer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="고객사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="현대자동차">현대자동차</SelectItem>
                        <SelectItem value="기아자동차">기아자동차</SelectItem>
                        <SelectItem value="현대모비스">현대모비스</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>차종</Label>
                    <Select
                      value={newClaim.vehicleType}
                      onValueChange={(value) => setNewClaim({ ...newClaim, vehicleType: value })}
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
                    <Label>품명 *</Label>
                    <Input
                      value={newClaim.partName || ""}
                      onChange={(e) => setNewClaim({ ...newClaim, partName: e.target.value })}
                      placeholder="품명 입력"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>불량내용</Label>
                  <Textarea
                    value={newClaim.defectDescription || ""}
                    onChange={(e) => setNewClaim({ ...newClaim, defectDescription: e.target.value })}
                    placeholder="불량 내용을 상세히 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>불량수량</Label>
                    <Input
                      type="number"
                      value={newClaim.defectQuantity || ""}
                      onChange={(e) => setNewClaim({ ...newClaim, defectQuantity: parseInt(e.target.value) || 0 })}
                      placeholder="수량 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>보증비용 (원)</Label>
                    <Input
                      type="number"
                      value={newClaim.warrantyCost || ""}
                      onChange={(e) => setNewClaim({ ...newClaim, warrantyCost: parseInt(e.target.value) || 0 })}
                      placeholder="비용 입력"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddClaim}>
                    <Plus className="mr-2 h-4 w-4" />
                    클레임 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Claims List */}
            <Card>
              <CardHeader>
                <CardTitle>최근 등록된 클레임</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>클레임번호</TableHead>
                      <TableHead>접수일</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.slice(-6).reverse().map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-mono text-xs">{claim.claimNumber}</TableCell>
                        <TableCell className="text-sm">{claim.receiptDate}</TableCell>
                        <TableCell className="text-sm">{claim.customer}</TableCell>
                        <TableCell className="text-sm">{claim.partName}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(claim.status)}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 원인분석 */}
        <TabsContent value="root-cause-analysis">
          <div className="grid grid-cols-3 gap-6">
            {/* Claim Selection */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>분석 대상 클레임</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>검색</Label>
                  <Input
                    placeholder="클레임번호, 품번, 품명 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredClaims.map((claim) => (
                    <div
                      key={claim.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                        selectedClaim?.id === claim.id ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => selectClaimForAnalysis(claim)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{claim.claimNumber}</div>
                          <div className="text-xs text-muted-foreground">{claim.partName}</div>
                          <div className="text-xs text-muted-foreground">{claim.customer}</div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(claim.status)} className="text-xs">
                          {claim.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Form */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedClaim ? `원인분석 - ${selectedClaim.claimNumber}` : "클레임을 선택하세요"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedClaim ? (
                  <div className="space-y-6">
                    {/* Claim Info */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">품번:</span>
                          <span className="ml-2 font-medium">{selectedClaim.partNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">품명:</span>
                          <span className="ml-2 font-medium">{selectedClaim.partName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">불량수량:</span>
                          <span className="ml-2 font-medium">{selectedClaim.defectQuantity}개</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">불량내용:</span>
                        <span className="ml-2">{selectedClaim.defectDescription}</span>
                      </div>
                    </div>

                    {/* NTF Analysis */}
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">NTF (No Trouble Found) 분석</Label>
                      <Select
                        value={analysisForm.ntfResult}
                        onValueChange={(value) => setAnalysisForm({ ...analysisForm, ntfResult: value as "NTF" | "실불량" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="NTF 결과 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NTF">NTF - 재현 불가 / 이상 없음</SelectItem>
                          <SelectItem value="실불량">실불량 - 원인 규명 필요</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Root Cause */}
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">실 불량 원인 분석</Label>
                      <Textarea
                        value={analysisForm.rootCause}
                        onChange={(e) => setAnalysisForm({ ...analysisForm, rootCause: e.target.value })}
                        placeholder="근본 원인을 분석하여 입력하세요"
                        rows={2}
                      />
                    </div>

                    {/* 5 Why Analysis */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">5 Why 분석</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm font-medium text-red-600">Why 1:</span>
                          <Input
                            value={analysisForm.fiveWhy1}
                            onChange={(e) => setAnalysisForm({ ...analysisForm, fiveWhy1: e.target.value })}
                            placeholder="왜 문제가 발생했는가?"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm font-medium text-orange-600">Why 2:</span>
                          <Input
                            value={analysisForm.fiveWhy2}
                            onChange={(e) => setAnalysisForm({ ...analysisForm, fiveWhy2: e.target.value })}
                            placeholder="왜 그런 현상이 있었는가?"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm font-medium text-yellow-600">Why 3:</span>
                          <Input
                            value={analysisForm.fiveWhy3}
                            onChange={(e) => setAnalysisForm({ ...analysisForm, fiveWhy3: e.target.value })}
                            placeholder="왜 그 원인이 존재했는가?"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm font-medium text-green-600">Why 4:</span>
                          <Input
                            value={analysisForm.fiveWhy4}
                            onChange={(e) => setAnalysisForm({ ...analysisForm, fiveWhy4: e.target.value })}
                            placeholder="왜 그 상황이 발생했는가?"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-16 text-sm font-medium text-blue-600">Why 5:</span>
                          <Input
                            value={analysisForm.fiveWhy5}
                            onChange={(e) => setAnalysisForm({ ...analysisForm, fiveWhy5: e.target.value })}
                            placeholder="근본 원인은 무엇인가?"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Corrective Action */}
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">시정조치</Label>
                      <Textarea
                        value={analysisForm.correctiveAction}
                        onChange={(e) => setAnalysisForm({ ...analysisForm, correctiveAction: e.target.value })}
                        placeholder="시정 및 예방 조치 내용을 입력하세요"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveAnalysis}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        분석 결과 저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    좌측 목록에서 분석할 클레임을 선택하세요
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 보증비용 현황 */}
        <TabsContent value="warranty-cost">
          <div className="space-y-6">
            {/* Monthly Cost Chart */}
            <Card>
              <CardHeader>
                <CardTitle>월별 보증비용 현황 (2026년)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyWarrantyCostData.map((data, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium">{months[idx]}</div>
                      <div className="flex-1">
                        <div className="relative h-8 bg-gray-100 rounded">
                          {/* Target line */}
                          <div
                            className="absolute top-0 bottom-0 border-r-2 border-dashed border-red-400"
                            style={{ left: `${(data.target / maxMonthlyCost) * 100}%` }}
                          />
                          {/* Cost bar */}
                          <div
                            className={`h-full rounded flex items-center justify-end pr-2 ${
                              data.cost > data.target ? "bg-red-500" : "bg-blue-500"
                            }`}
                            style={{
                              width: `${data.cost > 0 ? (data.cost / maxMonthlyCost) * 100 : 0}%`,
                              minWidth: data.cost > 0 ? "60px" : "0"
                            }}
                          >
                            {data.cost > 0 && (
                              <span className="text-xs text-white font-medium">
                                {formatNumber(data.cost / 10000)}만원
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm">
                        {data.claimCount > 0 ? `${data.claimCount}건` : "-"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 flex justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span className="text-sm">목표 이내</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded" />
                    <span className="text-sm">목표 초과</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 border-t-2 border-dashed border-red-400" />
                    <span className="text-sm">월 목표 (200만원)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category and Type Analysis */}
            <div className="grid grid-cols-2 gap-6">
              {/* By Defect Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    불량유형별 보증비용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>불량유형</TableHead>
                        <TableHead className="text-right">비용</TableHead>
                        <TableHead className="text-center">건수</TableHead>
                        <TableHead className="text-center">비율</TableHead>
                        <TableHead className="w-32">분포</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryCostData.map((cat) => (
                        <TableRow key={cat.category}>
                          <TableCell className="font-medium">{cat.category}</TableCell>
                          <TableCell className="text-right">{formatNumber(cat.cost / 10000)}만원</TableCell>
                          <TableCell className="text-center">{cat.count}건</TableCell>
                          <TableCell className="text-center">{cat.percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-orange-500 h-3 rounded-full"
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* By Vehicle Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    차종별 보증비용
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>차종</TableHead>
                        <TableHead className="text-right">비용</TableHead>
                        <TableHead className="text-center">건수</TableHead>
                        <TableHead className="text-center">비율</TableHead>
                        <TableHead className="w-32">분포</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {typeCostData.map((type) => (
                        <TableRow key={type.category}>
                          <TableCell className="font-medium">{type.category}</TableCell>
                          <TableCell className="text-right">{formatNumber(type.cost / 10000)}만원</TableCell>
                          <TableCell className="text-center">{type.count}건</TableCell>
                          <TableCell className="text-center">{type.percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-blue-500 h-3 rounded-full"
                                style={{ width: `${type.percentage}%` }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Target vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>목표 대비 실적</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-blue-600">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">연간 목표</div>
                      <div className="text-xl font-bold mt-1">
                        {formatCurrency(monthlyWarrantyCostData.reduce((sum, m) => sum + m.target, 0))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-600">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">누적 실적</div>
                      <div className="text-xl font-bold mt-1">{formatCurrency(totalWarrantyCost)}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-orange-600">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">목표 대비</div>
                      <div className="text-xl font-bold mt-1">
                        {((totalWarrantyCost / (2000000 * 6)) * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-red-600">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">월평균 비용</div>
                      <div className="text-xl font-bold mt-1">
                        {formatCurrency(totalWarrantyCost / 6)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 보증 이력 */}
        <TabsContent value="warranty-history">
          <Card>
            <CardHeader>
              <CardTitle>보증 클레임 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="클레임번호, 품번, 품명, 고객사 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>클레임번호</TableHead>
                    <TableHead>접수일</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>차종</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead className="text-center">수량</TableHead>
                    <TableHead className="text-right">보증비용</TableHead>
                    <TableHead className="text-center">NTF</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-mono text-xs">{claim.claimNumber}</TableCell>
                        <TableCell className="text-sm">{claim.receiptDate}</TableCell>
                        <TableCell className="text-sm">{claim.customer}</TableCell>
                        <TableCell className="text-sm">{claim.vehicleType}</TableCell>
                        <TableCell className="font-mono text-xs">{claim.partNumber}</TableCell>
                        <TableCell className="text-sm">{claim.partName}</TableCell>
                        <TableCell className="text-center">{claim.defectQuantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(claim.warrantyCost)}</TableCell>
                        <TableCell className="text-center">
                          {claim.ntfResult ? (
                            <Badge
                              variant={claim.ntfResult === "NTF" ? "success" : "warning"}
                            >
                              {claim.ntfResult}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusBadgeVariant(claim.status)}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Summary Footer */}
              <div className="mt-6 flex justify-between items-center p-4 bg-muted rounded-lg">
                <div className="text-sm">
                  <span className="text-muted-foreground">전체: </span>
                  <span className="font-medium">{filteredClaims.length}건</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">총 보증비용: </span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(filteredClaims.reduce((sum, c) => sum + c.warrantyCost, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
