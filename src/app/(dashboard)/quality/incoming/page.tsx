"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  Plus,
  Save,
  Trash2,
  Search,
  FileText,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Building2,
  Package,
  TrendingUp,
  Send,
  Edit,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

// Types
interface InspectionResult {
  appearance: "합격" | "불합격" | "";
  dimension: "합격" | "불합격" | "";
  function: "합격" | "불합격" | "";
}

interface IncomingInspection {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  supplier: string;
  materialCode: string;
  materialName: string;
  receivedQty: number;
  inspectedQty: number;
  results: InspectionResult;
  judgment: "합격" | "불합격" | "특채";
  inspector: string;
  remarks: string;
}

interface InspectionStandard {
  id: number;
  materialCode: string;
  materialName: string;
  inspectionItem: string;
  specification: string;
  inspectionMethod: string;
  samplingLevel: string;
  aqlLevel: string;
  isActive: boolean;
}

interface NonconformityRecord {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  supplier: string;
  materialCode: string;
  materialName: string;
  defectType: string;
  defectQty: number;
  supplierNotified: boolean;
  notificationDate: string;
  status: "미처리" | "처리중" | "완료";
  capaNo: string;
}

// Monthly defect rate data type
interface MonthlyDefectData {
  supplier: string;
  receivedQty: number;
  defectQty: number;
  defectRate: number;
}

// Supplier monthly trend data type
interface SupplierMonthlyTrend {
  supplier: string;
  monthlyData: Record<string, { receivedQty: number; defectQty: number; defectRate: number }>;
}

// Generate inspection number
function generateInspectionNo(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `INC-${date}-${seq}`;
}

export default function IncomingInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Tab 1: Registration state
  const [inspections, setInspections] = useState<IncomingInspection[]>([]);
  const [formData, setFormData] = useState({
    inspectionNo: generateInspectionNo(),
    inspectionDate: new Date().toISOString().split("T")[0],
    supplier: "",
    materialCode: "",
    materialName: "",
    receivedQty: "",
    inspectedQty: "",
    inspector: "",
    remarks: "",
  });
  const [inspectionResults, setInspectionResults] = useState<InspectionResult>({
    appearance: "",
    dimension: "",
    function: "",
  });
  const [judgment, setJudgment] = useState<"합격" | "불합격" | "특채" | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  // Tab 2: Standards state
  const [standards, setStandards] = useState<InspectionStandard[]>([
    {
      id: 1,
      materialCode: "MAT-001",
      materialName: "철판 1.0T",
      inspectionItem: "두께",
      specification: "1.0 +/- 0.05mm",
      inspectionMethod: "버니어캘리퍼스",
      samplingLevel: "S-2",
      aqlLevel: "1.0",
      isActive: true,
    },
    {
      id: 2,
      materialCode: "MAT-001",
      materialName: "철판 1.0T",
      inspectionItem: "외관",
      specification: "스크래치, 녹 없음",
      inspectionMethod: "육안검사",
      samplingLevel: "S-2",
      aqlLevel: "0.65",
      isActive: true,
    },
    {
      id: 3,
      materialCode: "MAT-002",
      materialName: "볼트 M8x20",
      inspectionItem: "길이",
      specification: "20 +/- 0.3mm",
      inspectionMethod: "버니어캘리퍼스",
      samplingLevel: "S-3",
      aqlLevel: "1.0",
      isActive: true,
    },
  ]);
  const [standardFormData, setStandardFormData] = useState({
    materialCode: "",
    materialName: "",
    inspectionItem: "",
    specification: "",
    inspectionMethod: "",
    samplingLevel: "S-2",
    aqlLevel: "1.0",
  });
  const [showStandardForm, setShowStandardForm] = useState(false);
  const [standardSearch, setStandardSearch] = useState("");

  // Tab 3: Status state
  const [statusDateRange, setStatusDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Tab 4: Nonconformity state
  const [nonconformities, setNonconformities] = useState<NonconformityRecord[]>([]);
  const [ncSearch, setNcSearch] = useState("");

  // Registration handlers
  const handleSaveInspection = () => {
    if (!formData.supplier || !formData.materialCode || !formData.materialName || !formData.inspector) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!judgment) {
      alert("판정을 선택해주세요.");
      return;
    }

    const newInspection: IncomingInspection = {
      id: Date.now(),
      inspectionNo: formData.inspectionNo,
      inspectionDate: formData.inspectionDate,
      supplier: formData.supplier,
      materialCode: formData.materialCode,
      materialName: formData.materialName,
      receivedQty: Number(formData.receivedQty) || 0,
      inspectedQty: Number(formData.inspectedQty) || 0,
      results: { ...inspectionResults },
      judgment,
      inspector: formData.inspector,
      remarks: formData.remarks,
    };

    setInspections([newInspection, ...inspections]);

    // Create nonconformity record if failed
    if (judgment === "불합격") {
      const defectTypes: string[] = [];
      if (inspectionResults.appearance === "불합격") defectTypes.push("외관불량");
      if (inspectionResults.dimension === "불합격") defectTypes.push("치수불량");
      if (inspectionResults.function === "불합격") defectTypes.push("기능불량");

      const newNC: NonconformityRecord = {
        id: Date.now(),
        inspectionNo: formData.inspectionNo,
        inspectionDate: formData.inspectionDate,
        supplier: formData.supplier,
        materialCode: formData.materialCode,
        materialName: formData.materialName,
        defectType: defectTypes.join(", ") || "기타",
        defectQty: Number(formData.inspectedQty) || 0,
        supplierNotified: false,
        notificationDate: "",
        status: "미처리",
        capaNo: "",
      };
      setNonconformities([newNC, ...nonconformities]);
    }

    // Reset form
    setFormData({
      inspectionNo: generateInspectionNo(),
      inspectionDate: new Date().toISOString().split("T")[0],
      supplier: "",
      materialCode: "",
      materialName: "",
      receivedQty: "",
      inspectedQty: "",
      inspector: "",
      remarks: "",
    });
    setInspectionResults({ appearance: "", dimension: "", function: "" });
    setJudgment("");

    alert("수입검사가 등록되었습니다.");
  };

  // Standards handlers
  const handleSaveStandard = () => {
    if (!standardFormData.materialCode || !standardFormData.materialName || !standardFormData.inspectionItem) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newStandard: InspectionStandard = {
      id: Date.now(),
      ...standardFormData,
      isActive: true,
    };

    setStandards([newStandard, ...standards]);
    setStandardFormData({
      materialCode: "",
      materialName: "",
      inspectionItem: "",
      specification: "",
      inspectionMethod: "",
      samplingLevel: "S-2",
      aqlLevel: "1.0",
    });
    setShowStandardForm(false);
    alert("검사기준이 등록되었습니다.");
  };

  const toggleStandardActive = (id: number) => {
    setStandards(
      standards.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Nonconformity handlers
  const handleNotifySupplier = (id: number) => {
    setNonconformities(
      nonconformities.map((nc) =>
        nc.id === id
          ? {
              ...nc,
              supplierNotified: true,
              notificationDate: new Date().toISOString().split("T")[0],
              status: "처리중",
            }
          : nc
      )
    );
    alert("공급업체에 통보되었습니다.");
  };

  // Filter functions
  const filteredInspections = inspections.filter(
    (i) =>
      i.inspectionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.materialCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStandards = standards.filter(
    (s) =>
      s.materialCode.toLowerCase().includes(standardSearch.toLowerCase()) ||
      s.materialName.toLowerCase().includes(standardSearch.toLowerCase()) ||
      s.inspectionItem.toLowerCase().includes(standardSearch.toLowerCase())
  );

  const filteredNonconformities = nonconformities.filter(
    (nc) =>
      nc.inspectionNo.toLowerCase().includes(ncSearch.toLowerCase()) ||
      nc.supplier.toLowerCase().includes(ncSearch.toLowerCase()) ||
      nc.materialCode.toLowerCase().includes(ncSearch.toLowerCase())
  );

  // Status calculations
  const statusInspections = inspections.filter(
    (i) => i.inspectionDate >= statusDateRange.startDate && i.inspectionDate <= statusDateRange.endDate
  );

  const totalInspected = statusInspections.length;
  const passedCount = statusInspections.filter((i) => i.judgment === "합격").length;
  const failedCount = statusInspections.filter((i) => i.judgment === "불합격").length;
  const concessionCount = statusInspections.filter((i) => i.judgment === "특채").length;
  const passRate = totalInspected > 0 ? ((passedCount / totalInspected) * 100).toFixed(1) : "0.0";

  // Group by date for daily status
  const dailyStats = statusInspections.reduce((acc, insp) => {
    const date = insp.inspectionDate;
    if (!acc[date]) {
      acc[date] = { total: 0, passed: 0, failed: 0, concession: 0 };
    }
    acc[date].total++;
    if (insp.judgment === "합격") acc[date].passed++;
    if (insp.judgment === "불합격") acc[date].failed++;
    if (insp.judgment === "특채") acc[date].concession++;
    return acc;
  }, {} as Record<string, { total: number; passed: number; failed: number; concession: number }>);

  // Group by supplier for supplier stats
  const supplierStats = statusInspections.reduce((acc, insp) => {
    const supplier = insp.supplier;
    if (!acc[supplier]) {
      acc[supplier] = { total: 0, passed: 0, failed: 0 };
    }
    acc[supplier].total++;
    if (insp.judgment === "합격" || insp.judgment === "특채") acc[supplier].passed++;
    if (insp.judgment === "불합격") acc[supplier].failed++;
    return acc;
  }, {} as Record<string, { total: number; passed: number; failed: number }>);

  // Defect type stats for nonconformities
  const defectTypeStats = nonconformities.reduce((acc, nc) => {
    const types = nc.defectType.split(", ");
    types.forEach((type) => {
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
    });
    return acc;
  }, {} as Record<string, number>);

  // Badge helpers
  const getJudgmentBadge = (result: string) => {
    switch (result) {
      case "합격":
        return <Badge variant="success">{result}</Badge>;
      case "불합격":
        return <Badge variant="destructive">{result}</Badge>;
      case "특채":
        return <Badge variant="warning">{result}</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "완료":
        return <Badge variant="success">{status}</Badge>;
      case "처리중":
        return <Badge variant="warning">{status}</Badge>;
      case "미처리":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">수입검사</h1>
          <p className="text-muted-foreground">IATF 16949 기반 수입검사 관리 시스템</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registration">수입검사 등록</TabsTrigger>
              <TabsTrigger value="standards">검사기준 관리</TabsTrigger>
              <TabsTrigger value="status">일별/월별 현황</TabsTrigger>
              <TabsTrigger value="nonconformity">부적합 현황</TabsTrigger>
            </TabsList>

            {/* Tab 1: 수입검사 등록 (Incoming Inspection Entry) */}
            <TabsContent value="registration">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      수입검사 등록
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>검사번호</Label>
                          <Input value={formData.inspectionNo} disabled className="bg-muted font-mono" />
                        </div>
                        <div className="space-y-2">
                          <Label>검사일 *</Label>
                          <Input
                            type="date"
                            value={formData.inspectionDate}
                            onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>공급업체 *</Label>
                          <Input
                            value={formData.supplier}
                            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                            placeholder="공급업체명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>검사자 *</Label>
                          <Input
                            value={formData.inspector}
                            onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                            placeholder="검사자명"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Material Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">자재 정보</h3>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>자재코드 *</Label>
                          <Input
                            value={formData.materialCode}
                            onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                            placeholder="자재코드"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>자재명 *</Label>
                          <Input
                            value={formData.materialName}
                            onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                            placeholder="자재명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>입고수량</Label>
                          <Input
                            type="number"
                            value={formData.receivedQty}
                            onChange={(e) => setFormData({ ...formData, receivedQty: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>검사수량</Label>
                          <Input
                            type="number"
                            value={formData.inspectedQty}
                            onChange={(e) => setFormData({ ...formData, inspectedQty: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inspection Results */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">검사항목별 결과</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>외관검사</Label>
                          <Select
                            value={inspectionResults.appearance}
                            onValueChange={(v) =>
                              setInspectionResults({ ...inspectionResults, appearance: v as "합격" | "불합격" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="합격">합격</SelectItem>
                              <SelectItem value="불합격">불합격</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>치수검사</Label>
                          <Select
                            value={inspectionResults.dimension}
                            onValueChange={(v) =>
                              setInspectionResults({ ...inspectionResults, dimension: v as "합격" | "불합격" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="합격">합격</SelectItem>
                              <SelectItem value="불합격">불합격</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>기능검사</Label>
                          <Select
                            value={inspectionResults.function}
                            onValueChange={(v) =>
                              setInspectionResults({ ...inspectionResults, function: v as "합격" | "불합격" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="합격">합격</SelectItem>
                              <SelectItem value="불합격">불합격</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Judgment */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">종합 판정</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>판정 *</Label>
                          <Select value={judgment} onValueChange={(v) => setJudgment(v as "합격" | "불합격" | "특채")}>
                            <SelectTrigger>
                              <SelectValue placeholder="판정 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="합격">합격</SelectItem>
                              <SelectItem value="불합격">불합격</SelectItem>
                              <SelectItem value="특채">특채</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>비고</Label>
                          <Input
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            placeholder="비고 사항"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveInspection}>
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Inspection History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      검사 이력
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="검사번호, 업체, 자재코드로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {filteredInspections.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사번호</TableHead>
                            <TableHead>검사일</TableHead>
                            <TableHead>공급업체</TableHead>
                            <TableHead>자재코드</TableHead>
                            <TableHead>자재명</TableHead>
                            <TableHead className="text-right">입고수량</TableHead>
                            <TableHead className="text-center">외관</TableHead>
                            <TableHead className="text-center">치수</TableHead>
                            <TableHead className="text-center">기능</TableHead>
                            <TableHead>판정</TableHead>
                            <TableHead>검사자</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInspections.map((insp) => (
                            <TableRow key={insp.id}>
                              <TableCell className="font-mono text-sm">{insp.inspectionNo}</TableCell>
                              <TableCell>{insp.inspectionDate}</TableCell>
                              <TableCell>{insp.supplier}</TableCell>
                              <TableCell className="font-mono">{insp.materialCode}</TableCell>
                              <TableCell>{insp.materialName}</TableCell>
                              <TableCell className="text-right">{insp.receivedQty.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                {insp.results.appearance === "합격" ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                                ) : insp.results.appearance === "불합격" ? (
                                  <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {insp.results.dimension === "합격" ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                                ) : insp.results.dimension === "불합격" ? (
                                  <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {insp.results.function === "합격" ? (
                                  <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                                ) : insp.results.function === "불합격" ? (
                                  <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{getJudgmentBadge(insp.judgment)}</TableCell>
                              <TableCell>{insp.inspector}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 2: 검사기준 관리 (Inspection Standards) */}
            <TabsContent value="standards">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        검사기준 관리
                      </span>
                      <Button size="sm" onClick={() => setShowStandardForm(!showStandardForm)}>
                        <Plus className="mr-2 h-4 w-4" />
                        기준 등록
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {showStandardForm && (
                      <Card className="border-dashed">
                        <CardContent className="pt-6 space-y-4">
                          <h4 className="font-semibold">신규 검사기준 등록</h4>
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                              <Label>자재코드 *</Label>
                              <Input
                                value={standardFormData.materialCode}
                                onChange={(e) =>
                                  setStandardFormData({ ...standardFormData, materialCode: e.target.value })
                                }
                                placeholder="자재코드"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>자재명 *</Label>
                              <Input
                                value={standardFormData.materialName}
                                onChange={(e) =>
                                  setStandardFormData({ ...standardFormData, materialName: e.target.value })
                                }
                                placeholder="자재명"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>검사항목 *</Label>
                              <Input
                                value={standardFormData.inspectionItem}
                                onChange={(e) =>
                                  setStandardFormData({ ...standardFormData, inspectionItem: e.target.value })
                                }
                                placeholder="검사항목"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>규격</Label>
                              <Input
                                value={standardFormData.specification}
                                onChange={(e) =>
                                  setStandardFormData({ ...standardFormData, specification: e.target.value })
                                }
                                placeholder="규격"
                              />
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                              <Label>검사방법</Label>
                              <Input
                                value={standardFormData.inspectionMethod}
                                onChange={(e) =>
                                  setStandardFormData({ ...standardFormData, inspectionMethod: e.target.value })
                                }
                                placeholder="검사방법"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>샘플링 수준</Label>
                              <Select
                                value={standardFormData.samplingLevel}
                                onValueChange={(v) => setStandardFormData({ ...standardFormData, samplingLevel: v })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="S-1">S-1 (최소)</SelectItem>
                                  <SelectItem value="S-2">S-2 (표준)</SelectItem>
                                  <SelectItem value="S-3">S-3 (보통)</SelectItem>
                                  <SelectItem value="S-4">S-4 (강화)</SelectItem>
                                  <SelectItem value="G-I">G-I (일반 I)</SelectItem>
                                  <SelectItem value="G-II">G-II (일반 II)</SelectItem>
                                  <SelectItem value="G-III">G-III (일반 III)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>AQL 수준</Label>
                              <Select
                                value={standardFormData.aqlLevel}
                                onValueChange={(v) => setStandardFormData({ ...standardFormData, aqlLevel: v })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0.10">0.10</SelectItem>
                                  <SelectItem value="0.15">0.15</SelectItem>
                                  <SelectItem value="0.25">0.25</SelectItem>
                                  <SelectItem value="0.40">0.40</SelectItem>
                                  <SelectItem value="0.65">0.65</SelectItem>
                                  <SelectItem value="1.0">1.0</SelectItem>
                                  <SelectItem value="1.5">1.5</SelectItem>
                                  <SelectItem value="2.5">2.5</SelectItem>
                                  <SelectItem value="4.0">4.0</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end gap-2">
                              <Button onClick={handleSaveStandard}>
                                <Save className="mr-2 h-4 w-4" />
                                저장
                              </Button>
                              <Button variant="outline" onClick={() => setShowStandardForm(false)}>
                                취소
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="자재코드, 자재명, 검사항목으로 검색..."
                        value={standardSearch}
                        onChange={(e) => setStandardSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>자재코드</TableHead>
                          <TableHead>자재명</TableHead>
                          <TableHead>검사항목</TableHead>
                          <TableHead>규격</TableHead>
                          <TableHead>검사방법</TableHead>
                          <TableHead>샘플링수준</TableHead>
                          <TableHead>AQL</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead className="text-center">관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStandards.map((std) => (
                          <TableRow key={std.id} className={!std.isActive ? "opacity-50" : ""}>
                            <TableCell className="font-mono">{std.materialCode}</TableCell>
                            <TableCell>{std.materialName}</TableCell>
                            <TableCell>{std.inspectionItem}</TableCell>
                            <TableCell>{std.specification}</TableCell>
                            <TableCell>{std.inspectionMethod}</TableCell>
                            <TableCell>{std.samplingLevel}</TableCell>
                            <TableCell>{std.aqlLevel}</TableCell>
                            <TableCell>
                              <Badge variant={std.isActive ? "success" : "secondary"}>
                                {std.isActive ? "사용" : "미사용"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStandardActive(std.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* AQL Reference Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>AQL 참조표 (KS Q ISO 2859-1)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      합격품질한계(AQL)에 따른 샘플링 검사 기준
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>로트 크기</TableHead>
                          <TableHead>S-2 (샘플수)</TableHead>
                          <TableHead>AQL 1.0 (Ac/Re)</TableHead>
                          <TableHead>AQL 2.5 (Ac/Re)</TableHead>
                          <TableHead>AQL 4.0 (Ac/Re)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>2~8</TableCell>
                          <TableCell>2</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>9~15</TableCell>
                          <TableCell>3</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>16~25</TableCell>
                          <TableCell>5</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>26~50</TableCell>
                          <TableCell>8</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>1/2</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>51~90</TableCell>
                          <TableCell>13</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>1/2</TableCell>
                          <TableCell>1/2</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>91~150</TableCell>
                          <TableCell>20</TableCell>
                          <TableCell>0/1</TableCell>
                          <TableCell>1/2</TableCell>
                          <TableCell>2/3</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>151~280</TableCell>
                          <TableCell>32</TableCell>
                          <TableCell>1/2</TableCell>
                          <TableCell>2/3</TableCell>
                          <TableCell>3/4</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>281~500</TableCell>
                          <TableCell>50</TableCell>
                          <TableCell>1/2</TableCell>
                          <TableCell>3/4</TableCell>
                          <TableCell>5/6</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <p className="text-xs text-muted-foreground mt-2">
                      * Ac: 합격판정개수, Re: 불합격판정개수
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 3: 일별/월별 현황 (Daily/Monthly Status) */}
            <TabsContent value="status">
              <div className="space-y-6">
                {/* Date Range Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      조회 기간 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-end">
                      <div className="space-y-2">
                        <Label>시작일</Label>
                        <Input
                          type="date"
                          value={statusDateRange.startDate}
                          onChange={(e) => setStatusDateRange({ ...statusDateRange, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>종료일</Label>
                        <Input
                          type="date"
                          value={statusDateRange.endDate}
                          onChange={(e) => setStatusDateRange({ ...statusDateRange, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">총 검사건수</span>
                      </div>
                      <div className="text-3xl font-bold mt-2">{totalInspected}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600">합격</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-green-700">{passedCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm text-red-600">불합격</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-red-700">{failedCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm text-yellow-600">특채</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-yellow-700">{concessionCount}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-blue-600">합격률</span>
                      </div>
                      <div className="text-3xl font-bold mt-2 text-blue-700">{passRate}%</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Status Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      일별 검사 현황
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(dailyStats).length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">해당 기간의 검사 데이터가 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사일</TableHead>
                            <TableHead className="text-right">총 검사</TableHead>
                            <TableHead className="text-right">합격</TableHead>
                            <TableHead className="text-right">불합격</TableHead>
                            <TableHead className="text-right">특채</TableHead>
                            <TableHead className="text-right">합격률</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(dailyStats)
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([date, stats]) => (
                              <TableRow key={date}>
                                <TableCell>{date}</TableCell>
                                <TableCell className="text-right">{stats.total}</TableCell>
                                <TableCell className="text-right text-green-600">{stats.passed}</TableCell>
                                <TableCell className="text-right text-red-600">{stats.failed}</TableCell>
                                <TableCell className="text-right text-yellow-600">{stats.concession}</TableCell>
                                <TableCell className="text-right font-semibold">
                                  {((stats.passed / stats.total) * 100).toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Supplier Stats Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      업체별 합격률
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(supplierStats).length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">해당 기간의 업체별 데이터가 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>공급업체</TableHead>
                            <TableHead className="text-right">총 검사</TableHead>
                            <TableHead className="text-right">합격</TableHead>
                            <TableHead className="text-right">불합격</TableHead>
                            <TableHead className="text-right">합격률</TableHead>
                            <TableHead>평가</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(supplierStats)
                            .sort(([, a], [, b]) => b.passed / b.total - a.passed / a.total)
                            .map(([supplier, stats]) => {
                              const rate = (stats.passed / stats.total) * 100;
                              return (
                                <TableRow key={supplier}>
                                  <TableCell className="font-medium">{supplier}</TableCell>
                                  <TableCell className="text-right">{stats.total}</TableCell>
                                  <TableCell className="text-right text-green-600">{stats.passed}</TableCell>
                                  <TableCell className="text-right text-red-600">{stats.failed}</TableCell>
                                  <TableCell className="text-right font-semibold">{rate.toFixed(1)}%</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={rate >= 98 ? "success" : rate >= 95 ? "warning" : "destructive"}
                                    >
                                      {rate >= 98 ? "우수" : rate >= 95 ? "양호" : "개선필요"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 4: 부적합 현황 (Nonconformity Status) */}
            <TabsContent value="nonconformity">
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">총 부적합</div>
                      <div className="text-3xl font-bold mt-2">{nonconformities.length}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardContent className="pt-6">
                      <div className="text-sm text-red-600">미처리</div>
                      <div className="text-3xl font-bold mt-2 text-red-700">
                        {nonconformities.filter((nc) => nc.status === "미처리").length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="text-sm text-yellow-600">처리중</div>
                      <div className="text-3xl font-bold mt-2 text-yellow-700">
                        {nonconformities.filter((nc) => nc.status === "처리중").length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="pt-6">
                      <div className="text-sm text-green-600">완료</div>
                      <div className="text-3xl font-bold mt-2 text-green-700">
                        {nonconformities.filter((nc) => nc.status === "완료").length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Defect Type Stats */}
                {Object.keys(defectTypeStats).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>부적합 유형별 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        {Object.entries(defectTypeStats).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium">{type}</span>
                            <Badge variant="outline">{count}건</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Nonconformity List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      불합격 목록
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="검사번호, 업체, 자재코드로 검색..."
                        value={ncSearch}
                        onChange={(e) => setNcSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {filteredNonconformities.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center">부적합 기록이 없습니다.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사번호</TableHead>
                            <TableHead>검사일</TableHead>
                            <TableHead>공급업체</TableHead>
                            <TableHead>자재코드</TableHead>
                            <TableHead>자재명</TableHead>
                            <TableHead>부적합유형</TableHead>
                            <TableHead className="text-right">불량수량</TableHead>
                            <TableHead>업체통보</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead className="text-center">조치</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredNonconformities.map((nc) => (
                            <TableRow key={nc.id}>
                              <TableCell className="font-mono text-sm">{nc.inspectionNo}</TableCell>
                              <TableCell>{nc.inspectionDate}</TableCell>
                              <TableCell>{nc.supplier}</TableCell>
                              <TableCell className="font-mono">{nc.materialCode}</TableCell>
                              <TableCell>{nc.materialName}</TableCell>
                              <TableCell>
                                <Badge variant="destructive">{nc.defectType}</Badge>
                              </TableCell>
                              <TableCell className="text-right text-red-600">{nc.defectQty}</TableCell>
                              <TableCell>
                                {nc.supplierNotified ? (
                                  <span className="text-green-600 text-sm">{nc.notificationDate}</span>
                                ) : (
                                  <span className="text-muted-foreground text-sm">미통보</span>
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(nc.status)}</TableCell>
                              <TableCell className="text-center">
                                {!nc.supplierNotified && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleNotifySupplier(nc.id)}
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    통보
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Supplier Notification Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>공급업체 통보 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">통보완료</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">
                          {nonconformities.filter((nc) => nc.supplierNotified).length}건
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">통보대기</div>
                        <div className="text-2xl font-bold text-red-600 mt-1">
                          {nonconformities.filter((nc) => !nc.supplierNotified).length}건
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">통보율</div>
                        <div className="text-2xl font-bold text-blue-600 mt-1">
                          {nonconformities.length > 0
                            ? (
                                (nonconformities.filter((nc) => nc.supplierNotified).length /
                                  nonconformities.length) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
