"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Calendar,
  Building2,
  History,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";

// Types
interface InspectionItem {
  id: number;
  itemName: string;
  standard: string;
  measuredValue: string;
  result: "pass" | "fail" | "";
}

interface TestReport {
  id: number;
  reportNo: string;
  receiptDate: string;
  supplierCode: string;
  supplierName: string;
  productNo: string;
  productName: string;
  items: InspectionItem[];
  finalResult: "pass" | "fail";
  registeredDate: string;
  remarks: string;
}

interface SupplierStats {
  supplierCode: string;
  supplierName: string;
  totalReports: number;
  passCount: number;
  failCount: number;
  passRate: number;
}

interface MonthlyStats {
  supplierCode: string;
  supplierName: string;
  submittedCount: number;
  passCount: number;
  failCount: number;
  passRate: number;
}

// Sample suppliers data
const suppliers = [
  { code: "SUP001", name: "ABC 전자" },
  { code: "SUP002", name: "한국정밀" },
  { code: "SUP003", name: "대한산업" },
  { code: "SUP004", name: "우리금속" },
  { code: "SUP005", name: "동양기계" },
];

// Sample products data
const products = [
  { no: "P-0001", name: "PCB Board A" },
  { no: "P-0002", name: "Connector B" },
  { no: "P-0003", name: "Housing C" },
  { no: "P-0004", name: "Bracket D" },
  { no: "P-0005", name: "Cable Assembly E" },
];

// Generate report number
function generateReportNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `TR-${year}${month}${day}-${seq}`;
}

// Sample initial history data
const initialHistory: TestReport[] = [
  {
    id: 1,
    reportNo: "TR-20260601-001",
    receiptDate: "2026-06-01",
    supplierCode: "SUP001",
    supplierName: "ABC 전자",
    productNo: "P-0001",
    productName: "PCB Board A",
    items: [
      { id: 1, itemName: "외관검사", standard: "이물질 없음", measuredValue: "양호", result: "pass" },
      { id: 2, itemName: "치수검사", standard: "100 +/- 0.5mm", measuredValue: "100.2mm", result: "pass" },
    ],
    finalResult: "pass",
    registeredDate: "2026-06-01",
    remarks: "",
  },
  {
    id: 2,
    reportNo: "TR-20260602-001",
    receiptDate: "2026-06-02",
    supplierCode: "SUP002",
    supplierName: "한국정밀",
    productNo: "P-0002",
    productName: "Connector B",
    items: [
      { id: 1, itemName: "외관검사", standard: "스크래치 없음", measuredValue: "양호", result: "pass" },
      { id: 2, itemName: "기능검사", standard: "정상작동", measuredValue: "정상", result: "pass" },
    ],
    finalResult: "pass",
    registeredDate: "2026-06-02",
    remarks: "",
  },
  {
    id: 3,
    reportNo: "TR-20260603-001",
    receiptDate: "2026-06-03",
    supplierCode: "SUP001",
    supplierName: "ABC 전자",
    productNo: "P-0003",
    productName: "Housing C",
    items: [
      { id: 1, itemName: "외관검사", standard: "도장불량 없음", measuredValue: "도장 벗김 발견", result: "fail" },
      { id: 2, itemName: "치수검사", standard: "50 +/- 0.3mm", measuredValue: "49.5mm", result: "pass" },
    ],
    finalResult: "fail",
    registeredDate: "2026-06-03",
    remarks: "도장 불량으로 불합격 처리",
  },
  {
    id: 4,
    reportNo: "TR-20260605-001",
    receiptDate: "2026-06-05",
    supplierCode: "SUP003",
    supplierName: "대한산업",
    productNo: "P-0004",
    productName: "Bracket D",
    items: [
      { id: 1, itemName: "외관검사", standard: "녹 없음", measuredValue: "양호", result: "pass" },
      { id: 2, itemName: "경도검사", standard: "HRC 45-50", measuredValue: "HRC 47", result: "pass" },
    ],
    finalResult: "pass",
    registeredDate: "2026-06-05",
    remarks: "",
  },
  {
    id: 5,
    reportNo: "TR-20260507-001",
    receiptDate: "2026-05-07",
    supplierCode: "SUP002",
    supplierName: "한국정밀",
    productNo: "P-0005",
    productName: "Cable Assembly E",
    items: [
      { id: 1, itemName: "외관검사", standard: "피복손상 없음", measuredValue: "양호", result: "pass" },
      { id: 2, itemName: "도통검사", standard: "정상도통", measuredValue: "정상", result: "pass" },
    ],
    finalResult: "pass",
    registeredDate: "2026-05-07",
    remarks: "",
  },
  {
    id: 6,
    reportNo: "TR-20260510-001",
    receiptDate: "2026-05-10",
    supplierCode: "SUP004",
    supplierName: "우리금속",
    productNo: "P-0001",
    productName: "PCB Board A",
    items: [
      { id: 1, itemName: "외관검사", standard: "이물질 없음", measuredValue: "양호", result: "pass" },
      { id: 2, itemName: "치수검사", standard: "100 +/- 0.5mm", measuredValue: "101.2mm", result: "fail" },
    ],
    finalResult: "fail",
    registeredDate: "2026-05-10",
    remarks: "치수 규격 초과",
  },
];

export default function TestReportPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Tab 1: Registration state
  const [registration, setRegistration] = useState({
    reportNo: generateReportNo(),
    receiptDate: new Date().toISOString().slice(0, 10),
    supplierCode: "",
    supplierName: "",
    productNo: "",
    productName: "",
    remarks: "",
  });

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    { id: 1, itemName: "", standard: "", measuredValue: "", result: "" },
  ]);

  // Tab 2: Monthly status state
  const [selectedYearMonth, setSelectedYearMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Tab 3: Supplier status state
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState<string>("all");

  // Tab 4: History state
  const [historyStartDate, setHistoryStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10)
  );
  const [historyEndDate, setHistoryEndDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [historySupplierFilter, setHistorySupplierFilter] = useState<string>("all");
  const [historyResultFilter, setHistoryResultFilter] = useState<string>("all");

  // Test reports history
  const [history, setHistory] = useState<TestReport[]>(initialHistory);

  // Supplier selection handler
  const handleSupplierChange = (code: string) => {
    const supplier = suppliers.find((s) => s.code === code);
    setRegistration({
      ...registration,
      supplierCode: code,
      supplierName: supplier?.name || "",
    });
  };

  // Product selection handler
  const handleProductChange = (no: string) => {
    const product = products.find((p) => p.no === no);
    setRegistration({
      ...registration,
      productNo: no,
      productName: product?.name || "",
    });
  };

  // Add inspection item
  const addInspectionItem = () => {
    const newId = Math.max(...inspectionItems.map((i) => i.id), 0) + 1;
    setInspectionItems([
      ...inspectionItems,
      { id: newId, itemName: "", standard: "", measuredValue: "", result: "" },
    ]);
  };

  // Remove inspection item
  const removeInspectionItem = (id: number) => {
    if (inspectionItems.length > 1) {
      setInspectionItems(inspectionItems.filter((item) => item.id !== id));
    }
  };

  // Update inspection item
  const updateInspectionItem = (id: number, field: keyof InspectionItem, value: string) => {
    setInspectionItems(
      inspectionItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate final result
  const calculateFinalResult = (): "pass" | "fail" | "" => {
    const results = inspectionItems.filter((i) => i.result !== "");
    if (results.length === 0) return "";
    const hasFailure = results.some((i) => i.result === "fail");
    return hasFailure ? "fail" : "pass";
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!registration.supplierCode) {
      alert("외주업체를 선택해주세요.");
      return;
    }
    if (!registration.productNo) {
      alert("품번을 선택해주세요.");
      return;
    }
    if (inspectionItems.every((i) => i.result === "")) {
      alert("검사 결과를 입력해주세요.");
      return;
    }

    const finalResult = calculateFinalResult();
    if (finalResult === "") {
      alert("검사 결과를 입력해주세요.");
      return;
    }

    const newReport: TestReport = {
      id: Date.now(),
      reportNo: registration.reportNo,
      receiptDate: registration.receiptDate,
      supplierCode: registration.supplierCode,
      supplierName: registration.supplierName,
      productNo: registration.productNo,
      productName: registration.productName,
      items: [...inspectionItems],
      finalResult,
      registeredDate: new Date().toISOString().slice(0, 10),
      remarks: registration.remarks,
    };

    setHistory([newReport, ...history]);

    // Reset form
    setRegistration({
      reportNo: generateReportNo(),
      receiptDate: new Date().toISOString().slice(0, 10),
      supplierCode: "",
      supplierName: "",
      productNo: "",
      productName: "",
      remarks: "",
    });
    setInspectionItems([
      { id: 1, itemName: "", standard: "", measuredValue: "", result: "" },
    ]);

    alert("성적서가 등록되었습니다.");
    setActiveTab("history");
  };

  // Get monthly statistics
  const getMonthlyStats = (): MonthlyStats[] => {
    const yearMonth = selectedYearMonth;
    const filteredReports = history.filter(
      (r) => r.receiptDate.slice(0, 7) === yearMonth
    );

    const statsMap = new Map<string, MonthlyStats>();

    filteredReports.forEach((report) => {
      const existing = statsMap.get(report.supplierCode);
      if (existing) {
        existing.submittedCount++;
        if (report.finalResult === "pass") {
          existing.passCount++;
        } else {
          existing.failCount++;
        }
        existing.passRate = (existing.passCount / existing.submittedCount) * 100;
      } else {
        statsMap.set(report.supplierCode, {
          supplierCode: report.supplierCode,
          supplierName: report.supplierName,
          submittedCount: 1,
          passCount: report.finalResult === "pass" ? 1 : 0,
          failCount: report.finalResult === "fail" ? 1 : 0,
          passRate: report.finalResult === "pass" ? 100 : 0,
        });
      }
    });

    return Array.from(statsMap.values());
  };

  // Get supplier statistics
  const getSupplierStats = (): SupplierStats[] => {
    const statsMap = new Map<string, SupplierStats>();

    history.forEach((report) => {
      const existing = statsMap.get(report.supplierCode);
      if (existing) {
        existing.totalReports++;
        if (report.finalResult === "pass") {
          existing.passCount++;
        } else {
          existing.failCount++;
        }
        existing.passRate = (existing.passCount / existing.totalReports) * 100;
      } else {
        statsMap.set(report.supplierCode, {
          supplierCode: report.supplierCode,
          supplierName: report.supplierName,
          totalReports: 1,
          passCount: report.finalResult === "pass" ? 1 : 0,
          failCount: report.finalResult === "fail" ? 1 : 0,
          passRate: report.finalResult === "pass" ? 100 : 0,
        });
      }
    });

    return Array.from(statsMap.values());
  };

  // Get supplier reports
  const getSupplierReports = (): TestReport[] => {
    if (selectedSupplierFilter === "all") {
      return history;
    }
    return history.filter((r) => r.supplierCode === selectedSupplierFilter);
  };

  // Get failed reports for selected supplier
  const getFailedReports = (): TestReport[] => {
    const reports = getSupplierReports();
    return reports.filter((r) => r.finalResult === "fail");
  };

  // Get filtered history
  const getFilteredHistory = (): TestReport[] => {
    let filtered = history.filter((r) => {
      const date = new Date(r.receiptDate);
      const start = new Date(historyStartDate);
      const end = new Date(historyEndDate);
      return date >= start && date <= end;
    });

    if (historySupplierFilter !== "all") {
      filtered = filtered.filter((r) => r.supplierCode === historySupplierFilter);
    }

    if (historyResultFilter !== "all") {
      filtered = filtered.filter((r) => r.finalResult === historyResultFilter);
    }

    return filtered;
  };

  // Badge helpers
  const getResultBadge = (result: "pass" | "fail" | "") => {
    switch (result) {
      case "pass":
        return <Badge variant="success">합격</Badge>;
      case "fail":
        return <Badge variant="destructive">불합격</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getPassRateBadge = (rate: number) => {
    if (rate >= 95) {
      return <Badge variant="success">{rate.toFixed(1)}%</Badge>;
    } else if (rate >= 80) {
      return <Badge variant="warning">{rate.toFixed(1)}%</Badge>;
    } else {
      return <Badge variant="destructive">{rate.toFixed(1)}%</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">외주업체 검사시험 성적서</h1>
          <p className="text-muted-foreground">월간 외주업체 품질 성적서 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            성적서 등록
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <Calendar className="mr-2 h-4 w-4" />
            월별 현황
          </TabsTrigger>
          <TabsTrigger value="supplier">
            <Building2 className="mr-2 h-4 w-4" />
            업체별 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            성적서 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Test Report Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                성적서 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">기본정보</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>성적서번호</Label>
                    <Input value={registration.reportNo} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>접수일 *</Label>
                    <Input
                      type="date"
                      value={registration.receiptDate}
                      onChange={(e) =>
                        setRegistration({ ...registration, receiptDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>외주업체 *</Label>
                    <Select
                      value={registration.supplierCode}
                      onValueChange={handleSupplierChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="업체 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.code} value={supplier.code}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>업체코드</Label>
                    <Input
                      value={registration.supplierCode}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">품목정보</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Select
                      value={registration.productNo}
                      onValueChange={handleProductChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="품번 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.no} value={product.no}>
                            {product.no}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>품명</Label>
                    <Input
                      value={registration.productName}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Inspection Items */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">검사항목</h3>
                  <Button onClick={addInspectionItem} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    항목 추가
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No.</TableHead>
                      <TableHead>검사항목</TableHead>
                      <TableHead>규격/기준</TableHead>
                      <TableHead>측정값</TableHead>
                      <TableHead className="w-[120px]">검사결과</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Input
                            value={item.itemName}
                            onChange={(e) =>
                              updateInspectionItem(item.id, "itemName", e.target.value)
                            }
                            placeholder="외관검사"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.standard}
                            onChange={(e) =>
                              updateInspectionItem(item.id, "standard", e.target.value)
                            }
                            placeholder="10.0 +/- 0.1mm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.measuredValue}
                            onChange={(e) =>
                              updateInspectionItem(item.id, "measuredValue", e.target.value)
                            }
                            placeholder="10.05mm"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.result}
                            onValueChange={(value) =>
                              updateInspectionItem(item.id, "result", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pass">합격</SelectItem>
                              <SelectItem value="fail">불합격</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInspectionItem(item.id)}
                            disabled={inspectionItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>검사 결과 요약:</strong>{" "}
                    {inspectionItems.filter((i) => i.result === "pass").length}건 합격 /{" "}
                    {inspectionItems.filter((i) => i.result === "fail").length}건 불합격 /{" "}
                    {inspectionItems.filter((i) => i.result === "").length}건 미판정
                  </p>
                  <p className="text-sm mt-1">
                    <strong>종합 판정:</strong> {getResultBadge(calculateFinalResult())}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <h3 className="text-lg font-semibold mb-4">비고</h3>
                <Textarea
                  value={registration.remarks}
                  onChange={(e) =>
                    setRegistration({ ...registration, remarks: e.target.value })
                  }
                  placeholder="특이사항을 입력하세요..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  성적서 등록
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Monthly Status */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                월별 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Year-Month Selection */}
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label>년월 선택</Label>
                  <Input
                    type="month"
                    value={selectedYearMonth}
                    onChange={(e) => setSelectedYearMonth(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">제출 성적서</p>
                        <p className="text-2xl font-bold">
                          {getMonthlyStats().reduce((acc, s) => acc + s.submittedCount, 0)}건
                        </p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">합격</p>
                        <p className="text-2xl font-bold text-green-600">
                          {getMonthlyStats().reduce((acc, s) => acc + s.passCount, 0)}건
                        </p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">불합격</p>
                        <p className="text-2xl font-bold text-red-600">
                          {getMonthlyStats().reduce((acc, s) => acc + s.failCount, 0)}건
                        </p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">평균 합격률</p>
                        <p className="text-2xl font-bold">
                          {getMonthlyStats().length > 0
                            ? (
                                getMonthlyStats().reduce((acc, s) => acc + s.passRate, 0) /
                                getMonthlyStats().length
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Stats Table */}
              <div>
                <h3 className="text-lg font-semibold mb-4">업체별 성적서 제출 현황</h3>
                {getMonthlyStats().length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    해당 월의 성적서 데이터가 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>업체코드</TableHead>
                        <TableHead>업체명</TableHead>
                        <TableHead className="text-right">제출 건수</TableHead>
                        <TableHead className="text-right">합격</TableHead>
                        <TableHead className="text-right">불합격</TableHead>
                        <TableHead className="text-right">합격률</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getMonthlyStats().map((stat) => (
                        <TableRow key={stat.supplierCode}>
                          <TableCell className="font-mono">{stat.supplierCode}</TableCell>
                          <TableCell>{stat.supplierName}</TableCell>
                          <TableCell className="text-right">{stat.submittedCount}건</TableCell>
                          <TableCell className="text-right text-green-600">
                            {stat.passCount}건
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {stat.failCount}건
                          </TableCell>
                          <TableCell className="text-right">
                            {getPassRateBadge(stat.passRate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Supplier Status */}
        <TabsContent value="supplier">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                업체별 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Supplier Filter */}
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <Label>업체 선택</Label>
                  <Select
                    value={selectedSupplierFilter}
                    onValueChange={setSelectedSupplierFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="업체 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.code} value={supplier.code}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Supplier Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">업체 종합 현황</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>업체코드</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead className="text-right">총 성적서</TableHead>
                      <TableHead className="text-right">합격</TableHead>
                      <TableHead className="text-right">불합격</TableHead>
                      <TableHead className="text-right">합격률</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSupplierStats()
                      .filter(
                        (s) =>
                          selectedSupplierFilter === "all" ||
                          s.supplierCode === selectedSupplierFilter
                      )
                      .map((stat) => (
                        <TableRow key={stat.supplierCode}>
                          <TableCell className="font-mono">{stat.supplierCode}</TableCell>
                          <TableCell>{stat.supplierName}</TableCell>
                          <TableCell className="text-right">{stat.totalReports}건</TableCell>
                          <TableCell className="text-right text-green-600">
                            {stat.passCount}건
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {stat.failCount}건
                          </TableCell>
                          <TableCell className="text-right">
                            {getPassRateBadge(stat.passRate)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Supplier Reports */}
              <div>
                <h3 className="text-lg font-semibold mb-4">업체별 성적서 목록</h3>
                {getSupplierReports().length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    성적서 데이터가 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>성적서번호</TableHead>
                        <TableHead>접수일</TableHead>
                        <TableHead>업체명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>판정</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSupplierReports().map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono">{report.reportNo}</TableCell>
                          <TableCell>{report.receiptDate}</TableCell>
                          <TableCell>{report.supplierName}</TableCell>
                          <TableCell className="font-mono">{report.productNo}</TableCell>
                          <TableCell>{report.productName}</TableCell>
                          <TableCell>{getResultBadge(report.finalResult)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Failed Reports */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  불합격 이력
                </h3>
                {getFailedReports().length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    불합격 이력이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>성적서번호</TableHead>
                        <TableHead>접수일</TableHead>
                        <TableHead>업체명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>품명</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFailedReports().map((report) => (
                        <TableRow key={report.id} className="bg-red-50">
                          <TableCell className="font-mono">{report.reportNo}</TableCell>
                          <TableCell>{report.receiptDate}</TableCell>
                          <TableCell>{report.supplierName}</TableCell>
                          <TableCell className="font-mono">{report.productNo}</TableCell>
                          <TableCell>{report.productName}</TableCell>
                          <TableCell>{report.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Test Report History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                성적서 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <Input
                    type="date"
                    value={historyStartDate}
                    onChange={(e) => setHistoryStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <Input
                    type="date"
                    value={historyEndDate}
                    onChange={(e) => setHistoryEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>업체</Label>
                  <Select
                    value={historySupplierFilter}
                    onValueChange={setHistorySupplierFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="업체 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.code} value={supplier.code}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>판정</Label>
                  <Select
                    value={historyResultFilter}
                    onValueChange={setHistoryResultFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="판정 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="pass">합격</SelectItem>
                      <SelectItem value="fail">불합격</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setHistoryStartDate(
                      new Date(new Date().setMonth(new Date().getMonth() - 1))
                        .toISOString()
                        .slice(0, 10)
                    );
                    setHistoryEndDate(new Date().toISOString().slice(0, 10));
                    setHistorySupplierFilter("all");
                    setHistoryResultFilter("all");
                  }}
                >
                  초기화
                </Button>
              </div>

              {/* Results Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>검색 결과:</strong> {getFilteredHistory().length}건 /{" "}
                  <span className="text-green-600">
                    합격 {getFilteredHistory().filter((r) => r.finalResult === "pass").length}건
                  </span>{" "}
                  /{" "}
                  <span className="text-red-600">
                    불합격 {getFilteredHistory().filter((r) => r.finalResult === "fail").length}건
                  </span>
                </p>
              </div>

              {/* History Table */}
              {getFilteredHistory().length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  조건에 맞는 성적서 이력이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>성적서번호</TableHead>
                      <TableHead>접수일</TableHead>
                      <TableHead>업체코드</TableHead>
                      <TableHead>업체명</TableHead>
                      <TableHead>품번</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead>판정</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredHistory().map((report) => (
                      <TableRow
                        key={report.id}
                        className={report.finalResult === "fail" ? "bg-red-50" : ""}
                      >
                        <TableCell className="font-mono">{report.reportNo}</TableCell>
                        <TableCell>{report.receiptDate}</TableCell>
                        <TableCell className="font-mono">{report.supplierCode}</TableCell>
                        <TableCell>{report.supplierName}</TableCell>
                        <TableCell className="font-mono">{report.productNo}</TableCell>
                        <TableCell>{report.productName}</TableCell>
                        <TableCell>{getResultBadge(report.finalResult)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {report.remarks || "-"}
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
