"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  CheckCircle2,
  History,
  Plus,
  Save,
  FileText,
  Package,
  AlertTriangle,
} from "lucide-react";

// Requirement types
type RequirementType = "품질" | "납기" | "포장" | "문서" | "기타";
type ComplianceStatus = "적합" | "부적합" | "진행중";

// Requirement interface
interface Requirement {
  id: number;
  registrationNo: string;
  registrationDate: string;
  customer: string;
  requirementType: RequirementType;
  requirementContent: string;
  relatedDocument: string;
  applicableProduct: string;
}

// Customer Specific Requirements interface
interface CustomerCSR {
  id: number;
  customer: string;
  csrCode: string;
  csrTitle: string;
  description: string;
  effectiveDate: string;
  revisionNo: string;
  requirements: string[];
}

// Compliance status interface
interface ComplianceItem {
  id: number;
  requirementId: number;
  requirement: string;
  customer: string;
  status: ComplianceStatus;
  lastAssessmentDate: string;
  nextAssessmentDate: string;
  actionRequired: string;
  responsiblePerson: string;
}

// Requirement history interface
interface RequirementHistory {
  id: number;
  requirementId: number;
  registrationNo: string;
  changeDate: string;
  changeType: string;
  previousContent: string;
  newContent: string;
  changedBy: string;
  reason: string;
}

// Requirement types options
const requirementTypes: RequirementType[] = ["품질", "납기", "포장", "문서", "기타"];

// Customers list
const customerList = [
  "현대자동차",
  "기아자동차",
  "GM대우",
  "르노삼성",
  "쌍용자동차",
];

// Initial requirements data
const initialRequirements: Requirement[] = [
  {
    id: 1,
    registrationNo: "REQ-2026-001",
    registrationDate: "2026-01-15",
    customer: "현대자동차",
    requirementType: "품질",
    requirementContent: "PPAP Level 3 제출 필수, SPC 관리 항목 지정 (Cpk 1.67 이상)",
    relatedDocument: "현대자동차 품질매뉴얼 Rev.5",
    applicableProduct: "엔진 부품 전체",
  },
  {
    id: 2,
    registrationNo: "REQ-2026-002",
    registrationDate: "2026-01-20",
    customer: "현대자동차",
    requirementType: "납기",
    requirementContent: "JIT 납품 시스템 적용, 납기 준수율 99% 이상 유지",
    relatedDocument: "공급망 관리 기준서",
    applicableProduct: "전 제품",
  },
  {
    id: 3,
    registrationNo: "REQ-2026-003",
    registrationDate: "2026-02-01",
    customer: "기아자동차",
    requirementType: "포장",
    requirementContent: "재사용 포장재 사용, 환경표지 인증 포장재 적용",
    relatedDocument: "기아 포장 표준서 PSS-001",
    applicableProduct: "시트 부품",
  },
  {
    id: 4,
    registrationNo: "REQ-2026-004",
    registrationDate: "2026-02-10",
    customer: "GM대우",
    requirementType: "문서",
    requirementContent: "IMDS 데이터 제출, 제품 성분표 영문 제출",
    relatedDocument: "GM Global Supplier Quality Manual",
    applicableProduct: "내장재 부품",
  },
  {
    id: 5,
    registrationNo: "REQ-2026-005",
    registrationDate: "2026-03-05",
    customer: "현대자동차",
    requirementType: "기타",
    requirementContent: "협력사 품질 인증 시스템 등록, 연간 CSR 교육 이수 필수",
    relatedDocument: "협력사 관리 지침",
    applicableProduct: "전 제품",
  },
];

// Initial CSR data
const initialCSRs: CustomerCSR[] = [
  {
    id: 1,
    customer: "현대자동차",
    csrCode: "HMC-CSR-001",
    csrTitle: "현대자동차 협력사 품질 요구사항",
    description: "현대자동차 협력사에 적용되는 품질 관리 기준",
    effectiveDate: "2025-01-01",
    revisionNo: "Rev.5",
    requirements: [
      "IATF 16949 인증 필수",
      "PPAP Level 3 제출",
      "연간 공정감사 실시",
      "Cpk 1.67 이상 유지",
    ],
  },
  {
    id: 2,
    customer: "현대자동차",
    csrCode: "HMC-CSR-002",
    csrTitle: "현대자동차 환경물질 관리 요구사항",
    description: "환경유해물질 관리 및 IMDS 제출 관련 요구사항",
    effectiveDate: "2025-03-01",
    revisionNo: "Rev.3",
    requirements: [
      "IMDS 데이터 제출",
      "유해물질 불사용 선언서 제출",
      "환경물질 관리대장 운영",
    ],
  },
  {
    id: 3,
    customer: "기아자동차",
    csrCode: "KIA-CSR-001",
    csrTitle: "기아자동차 품질 시스템 요구사항",
    description: "기아자동차 협력사 품질 관리 기준",
    effectiveDate: "2025-02-01",
    revisionNo: "Rev.4",
    requirements: [
      "IATF 16949 인증 필수",
      "품질 목표 달성률 95% 이상",
      "부적합 발생 시 24시간 내 초기 대응",
    ],
  },
  {
    id: 4,
    customer: "GM대우",
    csrCode: "GM-CSR-001",
    csrTitle: "GM Global Supplier Quality Requirements",
    description: "GM 글로벌 협력사 품질 요구사항",
    effectiveDate: "2024-06-01",
    revisionNo: "Rev.7",
    requirements: [
      "BIQS (Built-In Quality Supplier) 인증",
      "GP-12 조기 경고 시스템 적용",
      "Run@Rate 검증 완료",
    ],
  },
];

// Initial compliance data
const initialComplianceItems: ComplianceItem[] = [
  {
    id: 1,
    requirementId: 1,
    requirement: "PPAP Level 3 제출",
    customer: "현대자동차",
    status: "적합",
    lastAssessmentDate: "2026-05-15",
    nextAssessmentDate: "2026-11-15",
    actionRequired: "-",
    responsiblePerson: "품질팀 김품질",
  },
  {
    id: 2,
    requirementId: 1,
    requirement: "SPC 관리 (Cpk 1.67 이상)",
    customer: "현대자동차",
    status: "적합",
    lastAssessmentDate: "2026-06-01",
    nextAssessmentDate: "2026-12-01",
    actionRequired: "-",
    responsiblePerson: "품질팀 김품질",
  },
  {
    id: 3,
    requirementId: 2,
    requirement: "JIT 납품 시스템 적용",
    customer: "현대자동차",
    status: "적합",
    lastAssessmentDate: "2026-05-20",
    nextAssessmentDate: "2026-11-20",
    actionRequired: "-",
    responsiblePerson: "물류팀 박물류",
  },
  {
    id: 4,
    requirementId: 2,
    requirement: "납기 준수율 99% 유지",
    customer: "현대자동차",
    status: "진행중",
    lastAssessmentDate: "2026-06-05",
    nextAssessmentDate: "2026-07-05",
    actionRequired: "현재 97.5% - 개선 활동 진행 중",
    responsiblePerson: "물류팀 박물류",
  },
  {
    id: 5,
    requirementId: 3,
    requirement: "재사용 포장재 사용",
    customer: "기아자동차",
    status: "적합",
    lastAssessmentDate: "2026-04-10",
    nextAssessmentDate: "2026-10-10",
    actionRequired: "-",
    responsiblePerson: "생산팀 이생산",
  },
  {
    id: 6,
    requirementId: 4,
    requirement: "IMDS 데이터 제출",
    customer: "GM대우",
    status: "부적합",
    lastAssessmentDate: "2026-06-01",
    nextAssessmentDate: "2026-06-15",
    actionRequired: "신규 부품 3건 IMDS 등록 필요",
    responsiblePerson: "기술팀 최기술",
  },
];

// Initial history data
const initialHistory: RequirementHistory[] = [
  {
    id: 1,
    requirementId: 1,
    registrationNo: "REQ-2026-001",
    changeDate: "2026-03-01",
    changeType: "내용 변경",
    previousContent: "Cpk 1.33 이상",
    newContent: "Cpk 1.67 이상",
    changedBy: "품질팀 김품질",
    reason: "고객사 요구사항 상향 조정",
  },
  {
    id: 2,
    requirementId: 2,
    registrationNo: "REQ-2026-002",
    changeDate: "2026-04-15",
    changeType: "문서 개정",
    previousContent: "공급망 관리 기준서 Rev.2",
    newContent: "공급망 관리 기준서 Rev.3",
    changedBy: "물류팀 박물류",
    reason: "관련 문서 개정에 따른 업데이트",
  },
  {
    id: 3,
    requirementId: 3,
    registrationNo: "REQ-2026-003",
    changeDate: "2026-05-01",
    changeType: "적용 제품 추가",
    previousContent: "시트 부품",
    newContent: "시트 부품, 도어 트림",
    changedBy: "생산팀 이생산",
    reason: "신규 제품 라인 추가",
  },
  {
    id: 4,
    requirementId: 5,
    registrationNo: "REQ-2026-005",
    changeDate: "2026-05-20",
    changeType: "신규 등록",
    previousContent: "-",
    newContent: "협력사 품질 인증 시스템 등록, 연간 CSR 교육 이수 필수",
    changedBy: "품질팀 김품질",
    reason: "고객사 신규 요구사항 반영",
  },
];

export default function CustomerRequirementPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements);
  const [csrs] = useState<CustomerCSR[]>(initialCSRs);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(initialComplianceItems);
  const [history] = useState<RequirementHistory[]>(initialHistory);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [showComplianceForm, setShowComplianceForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("전체");

  // New requirement form data
  const [newRequirement, setNewRequirement] = useState({
    registrationDate: "",
    customer: "",
    requirementType: "품질" as RequirementType,
    requirementContent: "",
    relatedDocument: "",
    applicableProduct: "",
  });

  // New compliance form data
  const [newCompliance, setNewCompliance] = useState({
    requirementId: 0,
    requirement: "",
    customer: "",
    status: "진행중" as ComplianceStatus,
    lastAssessmentDate: "",
    nextAssessmentDate: "",
    actionRequired: "",
    responsiblePerson: "",
  });

  // Generate registration number
  const generateRegistrationNo = () => {
    const year = new Date().getFullYear();
    const nextNum = requirements.length + 1;
    return `REQ-${year}-${nextNum.toString().padStart(3, "0")}`;
  };

  // Handle requirement registration
  const handleAddRequirement = () => {
    if (
      newRequirement.registrationDate &&
      newRequirement.customer &&
      newRequirement.requirementContent
    ) {
      const newId = requirements.length + 1;
      setRequirements([
        ...requirements,
        {
          ...newRequirement,
          id: newId,
          registrationNo: generateRegistrationNo(),
        },
      ]);
      setNewRequirement({
        registrationDate: "",
        customer: "",
        requirementType: "품질",
        requirementContent: "",
        relatedDocument: "",
        applicableProduct: "",
      });
      setShowRequirementForm(false);
    }
  };

  // Handle compliance update
  const handleAddCompliance = () => {
    if (newCompliance.requirement && newCompliance.customer) {
      const newId = complianceItems.length + 1;
      setComplianceItems([...complianceItems, { ...newCompliance, id: newId }]);
      setNewCompliance({
        requirementId: 0,
        requirement: "",
        customer: "",
        status: "진행중",
        lastAssessmentDate: "",
        nextAssessmentDate: "",
        actionRequired: "",
        responsiblePerson: "",
      });
      setShowComplianceForm(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  // Get requirement type badge
  const getTypeBadge = (type: RequirementType) => {
    const variants: Record<RequirementType, "default" | "success" | "warning" | "secondary" | "destructive"> = {
      품질: "default",
      납기: "success",
      포장: "warning",
      문서: "secondary",
      기타: "destructive",
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  // Get compliance status badge
  const getStatusBadge = (status: ComplianceStatus) => {
    const variants: Record<ComplianceStatus, "success" | "warning" | "destructive"> = {
      적합: "success",
      부적합: "destructive",
      진행중: "warning",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  // Get change type badge
  const getChangeTypeBadge = (changeType: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "secondary"> = {
      "신규 등록": "success",
      "내용 변경": "warning",
      "문서 개정": "secondary",
      "적용 제품 추가": "default",
    };
    return <Badge variant={variants[changeType] || "default"}>{changeType}</Badge>;
  };

  // Filter requirements by customer
  const filteredRequirements =
    selectedCustomer === "전체"
      ? requirements
      : requirements.filter((r) => r.customer === selectedCustomer);

  // Filter CSRs by customer
  const filteredCSRs =
    selectedCustomer === "전체"
      ? csrs
      : csrs.filter((c) => c.customer === selectedCustomer);

  // Get requirements by customer for tab 2
  const getRequirementsByCustomer = () => {
    const grouped: Record<string, Requirement[]> = {};
    requirements.forEach((req) => {
      if (!grouped[req.customer]) {
        grouped[req.customer] = [];
      }
      grouped[req.customer].push(req);
    });
    return grouped;
  };

  // Count compliance status
  const complianceStats = {
    적합: complianceItems.filter((c) => c.status === "적합").length,
    부적합: complianceItems.filter((c) => c.status === "부적합").length,
    진행중: complianceItems.filter((c) => c.status === "진행중").length,
  };

  // Action required items
  const actionRequiredItems = complianceItems.filter(
    (c) => c.status === "부적합" || c.status === "진행중"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">고객 요구사항</h1>
        <p className="text-muted-foreground">
          IATF 16949 고객 특정 요구사항(CSR) 관리
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            요구사항 등록
          </TabsTrigger>
          <TabsTrigger value="by-customer" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            고객별 요구사항
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            이행 현황
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            요구사항 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Requirement Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                요구사항 등록
              </CardTitle>
              <Button onClick={() => setShowRequirementForm(!showRequirementForm)}>
                <Plus className="mr-2 h-4 w-4" />
                요구사항 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showRequirementForm && (
                <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                  <h4 className="font-medium">신규 요구사항 등록</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>등록번호</Label>
                      <Input value={generateRegistrationNo()} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationDate">등록일</Label>
                      <Input
                        id="registrationDate"
                        type="date"
                        value={newRequirement.registrationDate}
                        onChange={(e) =>
                          setNewRequirement({
                            ...newRequirement,
                            registrationDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer">고객사</Label>
                      <Select
                        value={newRequirement.customer}
                        onValueChange={(value) =>
                          setNewRequirement({ ...newRequirement, customer: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="고객사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {customerList.map((customer) => (
                            <SelectItem key={customer} value={customer}>
                              {customer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requirementType">요구사항 유형</Label>
                      <Select
                        value={newRequirement.requirementType}
                        onValueChange={(value) =>
                          setNewRequirement({
                            ...newRequirement,
                            requirementType: value as RequirementType,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {requirementTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applicableProduct">적용 제품</Label>
                      <Input
                        id="applicableProduct"
                        value={newRequirement.applicableProduct}
                        onChange={(e) =>
                          setNewRequirement({
                            ...newRequirement,
                            applicableProduct: e.target.value,
                          })
                        }
                        placeholder="예: 엔진 부품, 전 제품"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirementContent">요구사항 내용</Label>
                    <Textarea
                      id="requirementContent"
                      value={newRequirement.requirementContent}
                      onChange={(e) =>
                        setNewRequirement({
                          ...newRequirement,
                          requirementContent: e.target.value,
                        })
                      }
                      placeholder="고객 요구사항 상세 내용"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relatedDocument">관련 문서</Label>
                    <Input
                      id="relatedDocument"
                      value={newRequirement.relatedDocument}
                      onChange={(e) =>
                        setNewRequirement({
                          ...newRequirement,
                          relatedDocument: e.target.value,
                        })
                      }
                      placeholder="예: 고객사 품질매뉴얼 Rev.5"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowRequirementForm(false)}
                    >
                      취소
                    </Button>
                    <Button onClick={handleAddRequirement}>
                      <Save className="mr-2 h-4 w-4" />
                      등록
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>등록번호</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>요구사항 내용</TableHead>
                    <TableHead>관련 문서</TableHead>
                    <TableHead>적용 제품</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        {req.registrationNo}
                      </TableCell>
                      <TableCell>{formatDate(req.registrationDate)}</TableCell>
                      <TableCell>{req.customer}</TableCell>
                      <TableCell>{getTypeBadge(req.requirementType)}</TableCell>
                      <TableCell className="max-w-[250px]">
                        {req.requirementContent}
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {req.relatedDocument}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {req.applicableProduct}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Requirements by Customer */}
        <TabsContent value="by-customer">
          <div className="space-y-6">
            {/* Customer Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  고객별 요구사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Label>고객사 선택:</Label>
                  <Select
                    value={selectedCustomer}
                    onValueChange={setSelectedCustomer}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="고객사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전체">전체</SelectItem>
                      {customerList.map((customer) => (
                        <SelectItem key={customer} value={customer}>
                          {customer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Requirements by Customer */}
                {selectedCustomer === "전체" ? (
                  Object.entries(getRequirementsByCustomer()).map(
                    ([customer, reqs]) => (
                      <div key={customer} className="mb-6 last:mb-0">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {customer} ({reqs.length}건)
                        </h4>
                        <div className="space-y-2 ml-6">
                          {reqs.map((req) => (
                            <div
                              key={req.id}
                              className="p-3 border rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">
                                  {req.registrationNo}
                                </span>
                                {getTypeBadge(req.requirementType)}
                              </div>
                              <p className="text-sm">{req.requirementContent}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                적용 제품: {req.applicableProduct}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="space-y-2">
                    {filteredRequirements.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{req.registrationNo}</span>
                          {getTypeBadge(req.requirementType)}
                        </div>
                        <p className="text-sm">{req.requirementContent}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          적용 제품: {req.applicableProduct}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CSR Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CSR (Customer Specific Requirements) 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCSRs.map((csr) => (
                    <div key={csr.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{csr.csrCode}</span>
                            <Badge variant="secondary">{csr.customer}</Badge>
                          </div>
                          <h4 className="font-medium mt-1">{csr.csrTitle}</h4>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>개정: {csr.revisionNo}</p>
                          <p>시행일: {formatDate(csr.effectiveDate)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {csr.description}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">주요 요구사항:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                          {csr.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Compliance Status */}
        <TabsContent value="compliance">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">적합</p>
                      <p className="text-3xl font-bold text-green-600">
                        {complianceStats.적합}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">부적합</p>
                      <p className="text-3xl font-bold text-red-600">
                        {complianceStats.부적합}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">진행중</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {complianceStats.진행중}
                      </p>
                    </div>
                    <History className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  요구사항별 이행 상태
                </CardTitle>
                <Button onClick={() => setShowComplianceForm(!showComplianceForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  이행 현황 등록
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {showComplianceForm && (
                  <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                    <h4 className="font-medium">이행 현황 등록</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>요구사항</Label>
                        <Input
                          value={newCompliance.requirement}
                          onChange={(e) =>
                            setNewCompliance({
                              ...newCompliance,
                              requirement: e.target.value,
                            })
                          }
                          placeholder="요구사항 내용"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>고객사</Label>
                        <Select
                          value={newCompliance.customer}
                          onValueChange={(value) =>
                            setNewCompliance({ ...newCompliance, customer: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="고객사 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {customerList.map((customer) => (
                              <SelectItem key={customer} value={customer}>
                                {customer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>이행 상태</Label>
                        <Select
                          value={newCompliance.status}
                          onValueChange={(value) =>
                            setNewCompliance({
                              ...newCompliance,
                              status: value as ComplianceStatus,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="적합">적합</SelectItem>
                            <SelectItem value="부적합">부적합</SelectItem>
                            <SelectItem value="진행중">진행중</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>최근 평가일</Label>
                        <Input
                          type="date"
                          value={newCompliance.lastAssessmentDate}
                          onChange={(e) =>
                            setNewCompliance({
                              ...newCompliance,
                              lastAssessmentDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>차기 평가일</Label>
                        <Input
                          type="date"
                          value={newCompliance.nextAssessmentDate}
                          onChange={(e) =>
                            setNewCompliance({
                              ...newCompliance,
                              nextAssessmentDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>조치 필요 사항</Label>
                        <Input
                          value={newCompliance.actionRequired}
                          onChange={(e) =>
                            setNewCompliance({
                              ...newCompliance,
                              actionRequired: e.target.value,
                            })
                          }
                          placeholder="조치 필요 사항 (해당시)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>담당자</Label>
                        <Input
                          value={newCompliance.responsiblePerson}
                          onChange={(e) =>
                            setNewCompliance({
                              ...newCompliance,
                              responsiblePerson: e.target.value,
                            })
                          }
                          placeholder="부서 담당자명"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowComplianceForm(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={handleAddCompliance}>
                        <Save className="mr-2 h-4 w-4" />
                        등록
                      </Button>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>요구사항</TableHead>
                      <TableHead>고객사</TableHead>
                      <TableHead className="text-center">이행 상태</TableHead>
                      <TableHead>최근 평가일</TableHead>
                      <TableHead>차기 평가일</TableHead>
                      <TableHead>조치 필요 사항</TableHead>
                      <TableHead>담당자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="max-w-[200px]">
                          {item.requirement}
                        </TableCell>
                        <TableCell>{item.customer}</TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>{formatDate(item.lastAssessmentDate)}</TableCell>
                        <TableCell>{formatDate(item.nextAssessmentDate)}</TableCell>
                        <TableCell className="max-w-[200px]">
                          {item.actionRequired}
                        </TableCell>
                        <TableCell>{item.responsiblePerson}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Action Required Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  조치 필요 항목
                </CardTitle>
              </CardHeader>
              <CardContent>
                {actionRequiredItems.length > 0 ? (
                  <div className="space-y-3">
                    {actionRequiredItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-lg ${
                          item.status === "부적합"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.requirement}</span>
                            {getStatusBadge(item.status)}
                          </div>
                          <Badge variant="secondary">{item.customer}</Badge>
                        </div>
                        <p className="text-sm">{item.actionRequired}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>담당: {item.responsiblePerson}</span>
                          <span>차기 평가: {formatDate(item.nextAssessmentDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    조치 필요 항목이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Requirement History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                요구사항 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>등록번호</TableHead>
                    <TableHead>변경일</TableHead>
                    <TableHead>변경 유형</TableHead>
                    <TableHead>이전 내용</TableHead>
                    <TableHead>변경 내용</TableHead>
                    <TableHead>변경자</TableHead>
                    <TableHead>변경 사유</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.registrationNo}
                      </TableCell>
                      <TableCell>{formatDate(item.changeDate)}</TableCell>
                      <TableCell>{getChangeTypeBadge(item.changeType)}</TableCell>
                      <TableCell className="max-w-[150px] text-muted-foreground">
                        {item.previousContent}
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        {item.newContent}
                      </TableCell>
                      <TableCell>{item.changedBy}</TableCell>
                      <TableCell className="max-w-[150px]">{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Timeline View */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">변경 이력 타임라인</h4>
                <div className="space-y-4">
                  {history
                    .sort(
                      (a, b) =>
                        new Date(b.changeDate).getTime() -
                        new Date(a.changeDate).getTime()
                    )
                    .map((item, idx) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          {idx < history.length - 1 && (
                            <div className="w-0.5 h-full bg-border" />
                          )}
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {item.registrationNo}
                            </span>
                            {getChangeTypeBadge(item.changeType)}
                            <span className="text-sm text-muted-foreground">
                              {formatDate(item.changeDate)}
                            </span>
                          </div>
                          <p className="text-sm">{item.newContent}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            변경자: {item.changedBy} | 사유: {item.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
