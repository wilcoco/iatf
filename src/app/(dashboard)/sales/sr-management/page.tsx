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
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Calculator,
  ClipboardList,
  Calendar,
  Plus,
  Save,
  Search,
  Trash2,
  Edit
} from "lucide-react";

// ============ Types ============
interface SRReceipt {
  id: number;
  srNo: string;
  receiptDate: string;
  customer: string;
  projectName: string;
  vehicleType: string;
  partName: string;
  partNo: string;
  requestType: string;
  requestContent: string;
  requester: string;
  dueDate: string;
  status: string;
  registeredBy: string;
}

interface Quotation {
  id: number;
  quotationNo: string;
  quotationDate: string;
  srNo: string;
  customer: string;
  projectName: string;
  vehicleType: string;
  partName: string;
  partNo: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  toolingCost: number;
  developmentCost: number;
  validityPeriod: string;
  paymentTerms: string;
  deliveryTerms: string;
  remarks: string;
  status: string;
}

interface OrderRegister {
  id: number;
  orderNo: string;
  orderDate: string;
  quotationNo: string;
  customer: string;
  projectName: string;
  vehicleType: string;
  partName: string;
  partNo: string;
  orderQty: number;
  unitPrice: number;
  orderAmount: number;
  deliveryStartDate: string;
  deliveryEndDate: string;
  productionStatus: string;
  deliveryStatus: string;
  remarks: string;
}

interface MonthlyPlan {
  vehicleType: string;
  partName: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  total: number;
}

// ============ Initial Data ============
const initialSRData: SRReceipt[] = [
  {
    id: 1,
    srNo: "SR-2026-0001",
    receiptDate: "2026-06-01",
    customer: "현대자동차",
    projectName: "아반떼 CN7 F/L",
    vehicleType: "아반떼",
    partName: "도어트림 LH",
    partNo: "86310-AB000",
    requestType: "신규개발",
    requestContent: "신규 도어트림 개발 요청",
    requester: "김개발",
    dueDate: "2026-07-15",
    status: "접수",
    registeredBy: "홍길동",
  },
  {
    id: 2,
    srNo: "SR-2026-0002",
    receiptDate: "2026-06-03",
    customer: "기아자동차",
    projectName: "K5 DL3",
    vehicleType: "K5",
    partName: "센터콘솔",
    partNo: "84610-L2000",
    requestType: "설계변경",
    requestContent: "내장재 변경에 따른 설계변경",
    requester: "이설계",
    dueDate: "2026-06-30",
    status: "검토중",
    registeredBy: "홍길동",
  },
];

const initialQuotationData: Quotation[] = [
  {
    id: 1,
    quotationNo: "QT-2026-0001",
    quotationDate: "2026-06-05",
    srNo: "SR-2026-0001",
    customer: "현대자동차",
    projectName: "아반떼 CN7 F/L",
    vehicleType: "아반떼",
    partName: "도어트림 LH",
    partNo: "86310-AB000",
    quantity: 10000,
    unitPrice: 25000,
    totalAmount: 250000000,
    toolingCost: 50000000,
    developmentCost: 30000000,
    validityPeriod: "견적일로부터 30일",
    paymentTerms: "납품 후 60일 현금",
    deliveryTerms: "공장도 가격",
    remarks: "",
    status: "제출완료",
  },
];

const initialOrderData: OrderRegister[] = [
  {
    id: 1,
    orderNo: "ORD-2026-0001",
    orderDate: "2026-06-10",
    quotationNo: "QT-2026-0001",
    customer: "현대자동차",
    projectName: "아반떼 CN7 F/L",
    vehicleType: "아반떼",
    partName: "도어트림 LH",
    partNo: "86310-AB000",
    orderQty: 10000,
    unitPrice: 25000,
    orderAmount: 250000000,
    deliveryStartDate: "2026-08-01",
    deliveryEndDate: "2026-12-31",
    productionStatus: "양산준비",
    deliveryStatus: "대기",
    remarks: "",
  },
];

const initialProductionPlan: MonthlyPlan[] = [
  {
    vehicleType: "아반떼",
    partName: "도어트림 LH",
    jan: 800,
    feb: 850,
    mar: 900,
    apr: 950,
    may: 1000,
    jun: 1000,
    jul: 1050,
    aug: 1100,
    sep: 1000,
    oct: 950,
    nov: 900,
    dec: 800,
    total: 11300,
  },
  {
    vehicleType: "K5",
    partName: "센터콘솔",
    jan: 500,
    feb: 550,
    mar: 600,
    apr: 600,
    may: 650,
    jun: 700,
    jul: 700,
    aug: 750,
    sep: 700,
    oct: 650,
    nov: 600,
    dec: 500,
    total: 7500,
  },
  {
    vehicleType: "소나타",
    partName: "글로브박스",
    jan: 600,
    feb: 650,
    mar: 700,
    apr: 750,
    may: 800,
    jun: 800,
    jul: 850,
    aug: 900,
    sep: 850,
    oct: 800,
    nov: 750,
    dec: 650,
    total: 9100,
  },
];

// Helper functions
const generateSRNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `SR-${year}-${random}`;
};

const generateQuotationNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `QT-${year}-${random}`;
};

const generateOrderNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `ORD-${year}-${random}`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("ko-KR").format(num);
};

// Status options
const srStatusOptions = ["접수", "검토중", "견적진행", "완료", "보류", "취소"];
const quotationStatusOptions = ["작성중", "검토중", "제출완료", "승인", "반려"];
const productionStatusOptions = ["양산준비", "양산중", "양산완료", "단종"];
const deliveryStatusOptions = ["대기", "출하중", "납품완료"];
const requestTypeOptions = ["신규개발", "설계변경", "단가변경", "품질개선", "기타"];

export default function SRManagementPage() {
  const [activeTab, setActiveTab] = useState("sr-receipt");

  // SR Receipt state
  const [srRecords, setSRRecords] = useState<SRReceipt[]>(initialSRData);
  const [showSRForm, setShowSRForm] = useState(false);
  const [srSearch, setSRSearch] = useState("");
  const [srFormData, setSRFormData] = useState({
    srNo: generateSRNo(),
    receiptDate: new Date().toISOString().split("T")[0],
    customer: "",
    projectName: "",
    vehicleType: "",
    partName: "",
    partNo: "",
    requestType: "",
    requestContent: "",
    requester: "",
    dueDate: "",
    status: "접수",
    registeredBy: "",
  });

  // Quotation state
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotationData);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [quotationSearch, setQuotationSearch] = useState("");
  const [quotationFormData, setQuotationFormData] = useState({
    quotationNo: generateQuotationNo(),
    quotationDate: new Date().toISOString().split("T")[0],
    srNo: "",
    customer: "",
    projectName: "",
    vehicleType: "",
    partName: "",
    partNo: "",
    quantity: "",
    unitPrice: "",
    toolingCost: "",
    developmentCost: "",
    validityPeriod: "견적일로부터 30일",
    paymentTerms: "납품 후 60일 현금",
    deliveryTerms: "공장도 가격",
    remarks: "",
    status: "작성중",
  });

  // Order Register state
  const [orders, setOrders] = useState<OrderRegister[]>(initialOrderData);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFormData, setOrderFormData] = useState({
    orderNo: generateOrderNo(),
    orderDate: new Date().toISOString().split("T")[0],
    quotationNo: "",
    customer: "",
    projectName: "",
    vehicleType: "",
    partName: "",
    partNo: "",
    orderQty: "",
    unitPrice: "",
    deliveryStartDate: "",
    deliveryEndDate: "",
    productionStatus: "양산준비",
    deliveryStatus: "대기",
    remarks: "",
  });

  // Production Plan state
  const [productionPlan, setProductionPlan] = useState<MonthlyPlan[]>(initialProductionPlan);
  const [planYear, setPlanYear] = useState("2026");
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planFormData, setPlanFormData] = useState({
    vehicleType: "",
    partName: "",
    jan: "",
    feb: "",
    mar: "",
    apr: "",
    may: "",
    jun: "",
    jul: "",
    aug: "",
    sep: "",
    oct: "",
    nov: "",
    dec: "",
  });

  // ============ SR Receipt Handlers ============
  const handleSRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSR: SRReceipt = {
      id: Date.now(),
      ...srFormData,
    };
    setSRRecords([newSR, ...srRecords]);
    setShowSRForm(false);
    setSRFormData({
      srNo: generateSRNo(),
      receiptDate: new Date().toISOString().split("T")[0],
      customer: "",
      projectName: "",
      vehicleType: "",
      partName: "",
      partNo: "",
      requestType: "",
      requestContent: "",
      requester: "",
      dueDate: "",
      status: "접수",
      registeredBy: "",
    });
  };

  const filteredSRRecords = srRecords.filter(
    (r) =>
      r.srNo.toLowerCase().includes(srSearch.toLowerCase()) ||
      r.customer.toLowerCase().includes(srSearch.toLowerCase()) ||
      r.projectName.toLowerCase().includes(srSearch.toLowerCase()) ||
      r.partName.toLowerCase().includes(srSearch.toLowerCase())
  );

  // ============ Quotation Handlers ============
  const handleQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quotationFormData.quantity);
    const price = Number(quotationFormData.unitPrice);
    const newQuotation: Quotation = {
      id: Date.now(),
      quotationNo: quotationFormData.quotationNo,
      quotationDate: quotationFormData.quotationDate,
      srNo: quotationFormData.srNo,
      customer: quotationFormData.customer,
      projectName: quotationFormData.projectName,
      vehicleType: quotationFormData.vehicleType,
      partName: quotationFormData.partName,
      partNo: quotationFormData.partNo,
      quantity: qty,
      unitPrice: price,
      totalAmount: qty * price,
      toolingCost: Number(quotationFormData.toolingCost) || 0,
      developmentCost: Number(quotationFormData.developmentCost) || 0,
      validityPeriod: quotationFormData.validityPeriod,
      paymentTerms: quotationFormData.paymentTerms,
      deliveryTerms: quotationFormData.deliveryTerms,
      remarks: quotationFormData.remarks,
      status: quotationFormData.status,
    };
    setQuotations([newQuotation, ...quotations]);
    setShowQuotationForm(false);
    setQuotationFormData({
      quotationNo: generateQuotationNo(),
      quotationDate: new Date().toISOString().split("T")[0],
      srNo: "",
      customer: "",
      projectName: "",
      vehicleType: "",
      partName: "",
      partNo: "",
      quantity: "",
      unitPrice: "",
      toolingCost: "",
      developmentCost: "",
      validityPeriod: "견적일로부터 30일",
      paymentTerms: "납품 후 60일 현금",
      deliveryTerms: "공장도 가격",
      remarks: "",
      status: "작성중",
    });
  };

  const filteredQuotations = quotations.filter(
    (q) =>
      q.quotationNo.toLowerCase().includes(quotationSearch.toLowerCase()) ||
      q.customer.toLowerCase().includes(quotationSearch.toLowerCase()) ||
      q.partName.toLowerCase().includes(quotationSearch.toLowerCase())
  );

  // ============ Order Register Handlers ============
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(orderFormData.orderQty);
    const price = Number(orderFormData.unitPrice);
    const newOrder: OrderRegister = {
      id: Date.now(),
      orderNo: orderFormData.orderNo,
      orderDate: orderFormData.orderDate,
      quotationNo: orderFormData.quotationNo,
      customer: orderFormData.customer,
      projectName: orderFormData.projectName,
      vehicleType: orderFormData.vehicleType,
      partName: orderFormData.partName,
      partNo: orderFormData.partNo,
      orderQty: qty,
      unitPrice: price,
      orderAmount: qty * price,
      deliveryStartDate: orderFormData.deliveryStartDate,
      deliveryEndDate: orderFormData.deliveryEndDate,
      productionStatus: orderFormData.productionStatus,
      deliveryStatus: orderFormData.deliveryStatus,
      remarks: orderFormData.remarks,
    };
    setOrders([newOrder, ...orders]);
    setShowOrderForm(false);
    setOrderFormData({
      orderNo: generateOrderNo(),
      orderDate: new Date().toISOString().split("T")[0],
      quotationNo: "",
      customer: "",
      projectName: "",
      vehicleType: "",
      partName: "",
      partNo: "",
      orderQty: "",
      unitPrice: "",
      deliveryStartDate: "",
      deliveryEndDate: "",
      productionStatus: "양산준비",
      deliveryStatus: "대기",
      remarks: "",
    });
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNo.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.partName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // ============ Production Plan Handlers ============
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const months = [
      Number(planFormData.jan) || 0,
      Number(planFormData.feb) || 0,
      Number(planFormData.mar) || 0,
      Number(planFormData.apr) || 0,
      Number(planFormData.may) || 0,
      Number(planFormData.jun) || 0,
      Number(planFormData.jul) || 0,
      Number(planFormData.aug) || 0,
      Number(planFormData.sep) || 0,
      Number(planFormData.oct) || 0,
      Number(planFormData.nov) || 0,
      Number(planFormData.dec) || 0,
    ];
    const newPlan: MonthlyPlan = {
      vehicleType: planFormData.vehicleType,
      partName: planFormData.partName,
      jan: months[0],
      feb: months[1],
      mar: months[2],
      apr: months[3],
      may: months[4],
      jun: months[5],
      jul: months[6],
      aug: months[7],
      sep: months[8],
      oct: months[9],
      nov: months[10],
      dec: months[11],
      total: months.reduce((a, b) => a + b, 0),
    };
    setProductionPlan([...productionPlan, newPlan]);
    setShowPlanForm(false);
    setPlanFormData({
      vehicleType: "",
      partName: "",
      jan: "",
      feb: "",
      mar: "",
      apr: "",
      may: "",
      jun: "",
      jul: "",
      aug: "",
      sep: "",
      oct: "",
      nov: "",
      dec: "",
    });
  };

  // ============ Badge Variants ============
  const getSRStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      접수: "secondary",
      검토중: "default",
      견적진행: "warning",
      완료: "success",
      보류: "outline",
      취소: "destructive",
    };
    return variants[status] || "secondary";
  };

  const getQuotationStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      작성중: "secondary",
      검토중: "default",
      제출완료: "warning",
      승인: "success",
      반려: "destructive",
    };
    return variants[status] || "secondary";
  };

  const getProductionStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      양산준비: "secondary",
      양산중: "default",
      양산완료: "success",
      단종: "destructive",
    };
    return variants[status] || "secondary";
  };

  const getDeliveryStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
      대기: "secondary",
      출하중: "warning",
      납품완료: "success",
    };
    return variants[status] || "secondary";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SR 접수 (전산관리)</h1>
          <p className="text-muted-foreground">SR 접수부터 수주관리, 생산계획까지 통합 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sr-receipt" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SR 접수
          </TabsTrigger>
          <TabsTrigger value="quotation" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            견적서 작성
          </TabsTrigger>
          <TabsTrigger value="order-register" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            수주 관리대장
          </TabsTrigger>
          <TabsTrigger value="production-plan" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            년간 생산계획
          </TabsTrigger>
        </TabsList>

        {/* ============ Tab 1: SR Receipt ============ */}
        <TabsContent value="sr-receipt">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  SR 접수 관리
                </CardTitle>
                <Button onClick={() => setShowSRForm(!showSRForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  SR 등록
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showSRForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">신규 SR 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSRSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>SR 번호</Label>
                          <Input value={srFormData.srNo} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>접수일자 *</Label>
                          <Input
                            type="date"
                            value={srFormData.receiptDate}
                            onChange={(e) => setSRFormData({ ...srFormData, receiptDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>고객사 *</Label>
                          <Select
                            value={srFormData.customer}
                            onValueChange={(v) => setSRFormData({ ...srFormData, customer: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="고객사 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="현대자동차">현대자동차</SelectItem>
                              <SelectItem value="기아자동차">기아자동차</SelectItem>
                              <SelectItem value="GM코리아">GM코리아</SelectItem>
                              <SelectItem value="르노코리아">르노코리아</SelectItem>
                              <SelectItem value="쌍용자동차">쌍용자동차</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>요청유형 *</Label>
                          <Select
                            value={srFormData.requestType}
                            onValueChange={(v) => setSRFormData({ ...srFormData, requestType: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="요청유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {requestTypeOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>프로젝트명 *</Label>
                          <Input
                            value={srFormData.projectName}
                            onChange={(e) => setSRFormData({ ...srFormData, projectName: e.target.value })}
                            placeholder="예: 아반떼 CN7 F/L"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>차종 *</Label>
                          <Input
                            value={srFormData.vehicleType}
                            onChange={(e) => setSRFormData({ ...srFormData, vehicleType: e.target.value })}
                            placeholder="예: 아반떼"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>요청자</Label>
                          <Input
                            value={srFormData.requester}
                            onChange={(e) => setSRFormData({ ...srFormData, requester: e.target.value })}
                            placeholder="요청자명"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>부품명 *</Label>
                          <Input
                            value={srFormData.partName}
                            onChange={(e) => setSRFormData({ ...srFormData, partName: e.target.value })}
                            placeholder="예: 도어트림 LH"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품번</Label>
                          <Input
                            value={srFormData.partNo}
                            onChange={(e) => setSRFormData({ ...srFormData, partNo: e.target.value })}
                            placeholder="예: 86310-AB000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>완료요청일</Label>
                          <Input
                            type="date"
                            value={srFormData.dueDate}
                            onChange={(e) => setSRFormData({ ...srFormData, dueDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>요청내용</Label>
                          <Textarea
                            value={srFormData.requestContent}
                            onChange={(e) => setSRFormData({ ...srFormData, requestContent: e.target.value })}
                            placeholder="상세 요청 내용을 입력하세요"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>등록자</Label>
                          <Input
                            value={srFormData.registeredBy}
                            onChange={(e) => setSRFormData({ ...srFormData, registeredBy: e.target.value })}
                            placeholder="등록자명"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowSRForm(false)}>
                          취소
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SR번호, 고객사, 프로젝트명, 부품명으로 검색..."
                  value={srSearch}
                  onChange={(e) => setSRSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SR번호</TableHead>
                      <TableHead>접수일</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead>프로젝트</TableHead>
                      <TableHead>부품명</TableHead>
                      <TableHead>요청유형</TableHead>
                      <TableHead>완료요청일</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSRRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          등록된 SR이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSRRecords.map((sr) => (
                        <TableRow key={sr.id}>
                          <TableCell className="font-mono text-sm">{sr.srNo}</TableCell>
                          <TableCell>{sr.receiptDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{sr.customer}</Badge>
                          </TableCell>
                          <TableCell>{sr.projectName}</TableCell>
                          <TableCell>{sr.partName}</TableCell>
                          <TableCell>{sr.requestType}</TableCell>
                          <TableCell>{sr.dueDate || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={getSRStatusVariant(sr.status)}>{sr.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 2: Quotation ============ */}
        <TabsContent value="quotation">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  견적서 관리
                </CardTitle>
                <Button onClick={() => setShowQuotationForm(!showQuotationForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  견적서 작성
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showQuotationForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">견적서 작성</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleQuotationSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>견적번호</Label>
                          <Input value={quotationFormData.quotationNo} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>견적일자 *</Label>
                          <Input
                            type="date"
                            value={quotationFormData.quotationDate}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, quotationDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SR번호</Label>
                          <Select
                            value={quotationFormData.srNo}
                            onValueChange={(v) => {
                              const sr = srRecords.find((s) => s.srNo === v);
                              if (sr) {
                                setQuotationFormData({
                                  ...quotationFormData,
                                  srNo: v,
                                  customer: sr.customer,
                                  projectName: sr.projectName,
                                  vehicleType: sr.vehicleType,
                                  partName: sr.partName,
                                  partNo: sr.partNo,
                                });
                              } else {
                                setQuotationFormData({ ...quotationFormData, srNo: v });
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="SR 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {srRecords.map((sr) => (
                                <SelectItem key={sr.srNo} value={sr.srNo}>
                                  {sr.srNo} - {sr.partName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>고객사 *</Label>
                          <Select
                            value={quotationFormData.customer}
                            onValueChange={(v) => setQuotationFormData({ ...quotationFormData, customer: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="고객사 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="현대자동차">현대자동차</SelectItem>
                              <SelectItem value="기아자동차">기아자동차</SelectItem>
                              <SelectItem value="GM코리아">GM코리아</SelectItem>
                              <SelectItem value="르노코리아">르노코리아</SelectItem>
                              <SelectItem value="쌍용자동차">쌍용자동차</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>프로젝트명</Label>
                          <Input
                            value={quotationFormData.projectName}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, projectName: e.target.value })}
                            placeholder="프로젝트명"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>차종</Label>
                          <Input
                            value={quotationFormData.vehicleType}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, vehicleType: e.target.value })}
                            placeholder="차종"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>부품명 *</Label>
                          <Input
                            value={quotationFormData.partName}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, partName: e.target.value })}
                            placeholder="부품명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품번</Label>
                          <Input
                            value={quotationFormData.partNo}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, partNo: e.target.value })}
                            placeholder="품번"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>수량 *</Label>
                          <Input
                            type="number"
                            value={quotationFormData.quantity}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, quantity: e.target.value })}
                            placeholder="수량"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>단가 (원) *</Label>
                          <Input
                            type="number"
                            value={quotationFormData.unitPrice}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, unitPrice: e.target.value })}
                            placeholder="단가"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>금형비 (원)</Label>
                          <Input
                            type="number"
                            value={quotationFormData.toolingCost}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, toolingCost: e.target.value })}
                            placeholder="금형비"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>개발비 (원)</Label>
                          <Input
                            type="number"
                            value={quotationFormData.developmentCost}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, developmentCost: e.target.value })}
                            placeholder="개발비"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>유효기간</Label>
                          <Input
                            value={quotationFormData.validityPeriod}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, validityPeriod: e.target.value })}
                            placeholder="유효기간"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>결제조건</Label>
                          <Input
                            value={quotationFormData.paymentTerms}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, paymentTerms: e.target.value })}
                            placeholder="결제조건"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>인도조건</Label>
                          <Input
                            value={quotationFormData.deliveryTerms}
                            onChange={(e) => setQuotationFormData({ ...quotationFormData, deliveryTerms: e.target.value })}
                            placeholder="인도조건"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Textarea
                          value={quotationFormData.remarks}
                          onChange={(e) => setQuotationFormData({ ...quotationFormData, remarks: e.target.value })}
                          placeholder="특이사항 및 비고"
                          rows={2}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowQuotationForm(false)}>
                          취소
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="견적번호, 고객사, 부품명으로 검색..."
                  value={quotationSearch}
                  onChange={(e) => setQuotationSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>견적번호</TableHead>
                      <TableHead>견적일</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead>부품명</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                      <TableHead className="text-right">단가</TableHead>
                      <TableHead className="text-right">총액</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          등록된 견적서가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuotations.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell className="font-mono text-sm">{q.quotationNo}</TableCell>
                          <TableCell>{q.quotationDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{q.customer}</Badge>
                          </TableCell>
                          <TableCell>{q.partName}</TableCell>
                          <TableCell className="text-right">{formatNumber(q.quantity)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(q.unitPrice)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(q.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge variant={getQuotationStatusVariant(q.status)}>{q.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 3: Order Register ============ */}
        <TabsContent value="order-register">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  수주 관리대장
                </CardTitle>
                <Button onClick={() => setShowOrderForm(!showOrderForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  수주 등록
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showOrderForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">수주 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>수주번호</Label>
                          <Input value={orderFormData.orderNo} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>수주일자 *</Label>
                          <Input
                            type="date"
                            value={orderFormData.orderDate}
                            onChange={(e) => setOrderFormData({ ...orderFormData, orderDate: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>견적번호</Label>
                          <Select
                            value={orderFormData.quotationNo}
                            onValueChange={(v) => {
                              const qt = quotations.find((q) => q.quotationNo === v);
                              if (qt) {
                                setOrderFormData({
                                  ...orderFormData,
                                  quotationNo: v,
                                  customer: qt.customer,
                                  projectName: qt.projectName,
                                  vehicleType: qt.vehicleType,
                                  partName: qt.partName,
                                  partNo: qt.partNo,
                                  unitPrice: qt.unitPrice.toString(),
                                  orderQty: qt.quantity.toString(),
                                });
                              } else {
                                setOrderFormData({ ...orderFormData, quotationNo: v });
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="견적 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {quotations.map((qt) => (
                                <SelectItem key={qt.quotationNo} value={qt.quotationNo}>
                                  {qt.quotationNo} - {qt.partName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>고객사 *</Label>
                          <Select
                            value={orderFormData.customer}
                            onValueChange={(v) => setOrderFormData({ ...orderFormData, customer: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="고객사 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="현대자동차">현대자동차</SelectItem>
                              <SelectItem value="기아자동차">기아자동차</SelectItem>
                              <SelectItem value="GM코리아">GM코리아</SelectItem>
                              <SelectItem value="르노코리아">르노코리아</SelectItem>
                              <SelectItem value="쌍용자동차">쌍용자동차</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>프로젝트명</Label>
                          <Input
                            value={orderFormData.projectName}
                            onChange={(e) => setOrderFormData({ ...orderFormData, projectName: e.target.value })}
                            placeholder="프로젝트명"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>차종</Label>
                          <Input
                            value={orderFormData.vehicleType}
                            onChange={(e) => setOrderFormData({ ...orderFormData, vehicleType: e.target.value })}
                            placeholder="차종"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>부품명 *</Label>
                          <Input
                            value={orderFormData.partName}
                            onChange={(e) => setOrderFormData({ ...orderFormData, partName: e.target.value })}
                            placeholder="부품명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품번</Label>
                          <Input
                            value={orderFormData.partNo}
                            onChange={(e) => setOrderFormData({ ...orderFormData, partNo: e.target.value })}
                            placeholder="품번"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>수주수량 *</Label>
                          <Input
                            type="number"
                            value={orderFormData.orderQty}
                            onChange={(e) => setOrderFormData({ ...orderFormData, orderQty: e.target.value })}
                            placeholder="수량"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>단가 (원) *</Label>
                          <Input
                            type="number"
                            value={orderFormData.unitPrice}
                            onChange={(e) => setOrderFormData({ ...orderFormData, unitPrice: e.target.value })}
                            placeholder="단가"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>납품시작일</Label>
                          <Input
                            type="date"
                            value={orderFormData.deliveryStartDate}
                            onChange={(e) => setOrderFormData({ ...orderFormData, deliveryStartDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>납품종료일</Label>
                          <Input
                            type="date"
                            value={orderFormData.deliveryEndDate}
                            onChange={(e) => setOrderFormData({ ...orderFormData, deliveryEndDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>생산상태</Label>
                          <Select
                            value={orderFormData.productionStatus}
                            onValueChange={(v) => setOrderFormData({ ...orderFormData, productionStatus: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="생산상태 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {productionStatusOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>납품상태</Label>
                          <Select
                            value={orderFormData.deliveryStatus}
                            onValueChange={(v) => setOrderFormData({ ...orderFormData, deliveryStatus: v })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="납품상태 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryStatusOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>비고</Label>
                          <Input
                            value={orderFormData.remarks}
                            onChange={(e) => setOrderFormData({ ...orderFormData, remarks: e.target.value })}
                            placeholder="비고"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowOrderForm(false)}>
                          취소
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="수주번호, 고객사, 부품명으로 검색..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>수주번호</TableHead>
                      <TableHead>수주일</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead>프로젝트</TableHead>
                      <TableHead>부품명</TableHead>
                      <TableHead className="text-right">수량</TableHead>
                      <TableHead className="text-right">금액</TableHead>
                      <TableHead>생산상태</TableHead>
                      <TableHead>납품상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          등록된 수주가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-mono text-sm">{o.orderNo}</TableCell>
                          <TableCell>{o.orderDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{o.customer}</Badge>
                          </TableCell>
                          <TableCell>{o.projectName}</TableCell>
                          <TableCell>{o.partName}</TableCell>
                          <TableCell className="text-right">{formatNumber(o.orderQty)}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(o.orderAmount)}</TableCell>
                          <TableCell>
                            <Badge variant={getProductionStatusVariant(o.productionStatus)}>{o.productionStatus}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getDeliveryStatusVariant(o.deliveryStatus)}>{o.deliveryStatus}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ Tab 4: Production Plan ============ */}
        <TabsContent value="production-plan">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {planYear}년 생산계획
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={planYear} onValueChange={setPlanYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2026">2026년</SelectItem>
                      <SelectItem value="2027">2027년</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowPlanForm(!showPlanForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    계획 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showPlanForm && (
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">생산계획 추가</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePlanSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>차종 *</Label>
                          <Input
                            value={planFormData.vehicleType}
                            onChange={(e) => setPlanFormData({ ...planFormData, vehicleType: e.target.value })}
                            placeholder="차종"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>부품명 *</Label>
                          <Input
                            value={planFormData.partName}
                            onChange={(e) => setPlanFormData({ ...planFormData, partName: e.target.value })}
                            placeholder="부품명"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="space-y-2">
                          <Label>1월</Label>
                          <Input
                            type="number"
                            value={planFormData.jan}
                            onChange={(e) => setPlanFormData({ ...planFormData, jan: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>2월</Label>
                          <Input
                            type="number"
                            value={planFormData.feb}
                            onChange={(e) => setPlanFormData({ ...planFormData, feb: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>3월</Label>
                          <Input
                            type="number"
                            value={planFormData.mar}
                            onChange={(e) => setPlanFormData({ ...planFormData, mar: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>4월</Label>
                          <Input
                            type="number"
                            value={planFormData.apr}
                            onChange={(e) => setPlanFormData({ ...planFormData, apr: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>5월</Label>
                          <Input
                            type="number"
                            value={planFormData.may}
                            onChange={(e) => setPlanFormData({ ...planFormData, may: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>6월</Label>
                          <Input
                            type="number"
                            value={planFormData.jun}
                            onChange={(e) => setPlanFormData({ ...planFormData, jun: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="space-y-2">
                          <Label>7월</Label>
                          <Input
                            type="number"
                            value={planFormData.jul}
                            onChange={(e) => setPlanFormData({ ...planFormData, jul: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>8월</Label>
                          <Input
                            type="number"
                            value={planFormData.aug}
                            onChange={(e) => setPlanFormData({ ...planFormData, aug: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>9월</Label>
                          <Input
                            type="number"
                            value={planFormData.sep}
                            onChange={(e) => setPlanFormData({ ...planFormData, sep: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>10월</Label>
                          <Input
                            type="number"
                            value={planFormData.oct}
                            onChange={(e) => setPlanFormData({ ...planFormData, oct: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>11월</Label>
                          <Input
                            type="number"
                            value={planFormData.nov}
                            onChange={(e) => setPlanFormData({ ...planFormData, nov: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>12월</Label>
                          <Input
                            type="number"
                            value={planFormData.dec}
                            onChange={(e) => setPlanFormData({ ...planFormData, dec: e.target.value })}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowPlanForm(false)}>
                          취소
                        </Button>
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">차종</TableHead>
                      <TableHead className="sticky left-20 bg-background">부품명</TableHead>
                      <TableHead className="text-right">1월</TableHead>
                      <TableHead className="text-right">2월</TableHead>
                      <TableHead className="text-right">3월</TableHead>
                      <TableHead className="text-right">4월</TableHead>
                      <TableHead className="text-right">5월</TableHead>
                      <TableHead className="text-right">6월</TableHead>
                      <TableHead className="text-right">7월</TableHead>
                      <TableHead className="text-right">8월</TableHead>
                      <TableHead className="text-right">9월</TableHead>
                      <TableHead className="text-right">10월</TableHead>
                      <TableHead className="text-right">11월</TableHead>
                      <TableHead className="text-right">12월</TableHead>
                      <TableHead className="text-right font-bold">합계</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productionPlan.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                          등록된 생산계획이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {productionPlan.map((plan, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="sticky left-0 bg-background font-medium">{plan.vehicleType}</TableCell>
                            <TableCell className="sticky left-20 bg-background">{plan.partName}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.jan)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.feb)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.mar)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.apr)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.may)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.jun)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.jul)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.aug)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.sep)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.oct)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.nov)}</TableCell>
                            <TableCell className="text-right">{formatNumber(plan.dec)}</TableCell>
                            <TableCell className="text-right font-bold">{formatNumber(plan.total)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-bold">
                          <TableCell className="sticky left-0 bg-muted/50" colSpan={2}>월별 합계</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.jan, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.feb, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.mar, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.apr, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.may, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.jun, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.jul, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.aug, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.sep, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.oct, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.nov, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.dec, 0))}</TableCell>
                          <TableCell className="text-right">{formatNumber(productionPlan.reduce((sum, p) => sum + p.total, 0))}</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
