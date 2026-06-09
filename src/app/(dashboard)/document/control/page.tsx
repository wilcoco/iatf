"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Plus,
  Save,
  Search,
  ListFilter,
  RefreshCw,
  Send,
  CheckCircle,
  Clock,
  FileCheck,
  FolderOpen,
  Trash2,
} from "lucide-react";

// Document types
const DOCUMENT_TYPES = [
  { value: "절차서", label: "절차서" },
  { value: "규정", label: "규정" },
  { value: "지침", label: "지침" },
  { value: "기준서", label: "기준서" },
  { value: "양식", label: "양식" },
];

// Departments
const DEPARTMENTS = [
  { value: "품질관리팀", label: "품질관리팀" },
  { value: "생산팀", label: "생산팀" },
  { value: "개발팀", label: "개발팀" },
  { value: "구매팀", label: "구매팀" },
  { value: "영업팀", label: "영업팀" },
  { value: "관리팀", label: "관리팀" },
  { value: "전체", label: "전체" },
];

// Retention periods
const RETENTION_PERIODS = [
  { value: "1년", label: "1년" },
  { value: "3년", label: "3년" },
  { value: "5년", label: "5년" },
  { value: "10년", label: "10년" },
  { value: "영구", label: "영구" },
];

// Status options
const STATUS_OPTIONS = [
  { value: "승인대기", label: "승인대기" },
  { value: "승인완료", label: "승인완료" },
  { value: "폐기", label: "폐기" },
];

// Interfaces
interface DocumentRegistration {
  documentNumber: string;
  documentName: string;
  documentType: string;
  revisionNumber: string;
  revisionDate: string;
  author: string;
  reviewer: string;
  approver: string;
  distributionTargets: string[];
  retentionPeriod: string;
}

interface DocumentItem {
  id: number;
  documentNumber: string;
  documentName: string;
  documentType: string;
  revisionNumber: string;
  revisionDate: string;
  department: string;
  status: string;
  isLatest: boolean;
}

interface RevisionRequest {
  id: number;
  documentNumber: string;
  documentName: string;
  currentRevision: string;
  newRevision: string;
  requestDate: string;
  requestReason: string;
  changeContent: string;
  requester: string;
  status: string;
  oldDocRecoveryStatus: string;
}

interface DistributionRecord {
  id: number;
  documentNumber: string;
  documentName: string;
  department: string;
  distributionDate: string;
  receivedConfirmation: boolean;
  receivedDate: string | null;
  receiver: string;
}

// Sample data
const sampleDocuments: DocumentItem[] = [
  {
    id: 1,
    documentNumber: "QP-001",
    documentName: "품질매뉴얼",
    documentType: "절차서",
    revisionNumber: "Rev.05",
    revisionDate: "2024-03-15",
    department: "품질관리팀",
    status: "승인완료",
    isLatest: true,
  },
  {
    id: 2,
    documentNumber: "QP-002",
    documentName: "내부심사 절차서",
    documentType: "절차서",
    revisionNumber: "Rev.03",
    revisionDate: "2024-02-10",
    department: "품질관리팀",
    status: "승인완료",
    isLatest: true,
  },
  {
    id: 3,
    documentNumber: "WI-001",
    documentName: "검사작업지침서",
    documentType: "지침",
    revisionNumber: "Rev.02",
    revisionDate: "2024-01-20",
    department: "생산팀",
    status: "승인완료",
    isLatest: true,
  },
  {
    id: 4,
    documentNumber: "QF-001",
    documentName: "부적합품 보고서",
    documentType: "양식",
    revisionNumber: "Rev.01",
    revisionDate: "2023-12-01",
    department: "전체",
    status: "승인완료",
    isLatest: true,
  },
  {
    id: 5,
    documentNumber: "QP-003",
    documentName: "시정조치 절차서",
    documentType: "절차서",
    revisionNumber: "Rev.02",
    revisionDate: "2024-04-01",
    department: "품질관리팀",
    status: "승인대기",
    isLatest: false,
  },
];

const sampleRevisionRequests: RevisionRequest[] = [
  {
    id: 1,
    documentNumber: "QP-001",
    documentName: "품질매뉴얼",
    currentRevision: "Rev.04",
    newRevision: "Rev.05",
    requestDate: "2024-03-01",
    requestReason: "IATF 16949:2016 요구사항 반영",
    changeContent: "8.5절 생산 및 서비스 제공 내용 수정",
    requester: "김품질",
    status: "완료",
    oldDocRecoveryStatus: "회수완료",
  },
  {
    id: 2,
    documentNumber: "QP-003",
    documentName: "시정조치 절차서",
    currentRevision: "Rev.01",
    newRevision: "Rev.02",
    requestDate: "2024-03-20",
    requestReason: "프로세스 개선",
    changeContent: "시정조치 완료 확인 절차 추가",
    requester: "박관리",
    status: "진행중",
    oldDocRecoveryStatus: "회수중",
  },
];

const sampleDistributionRecords: DistributionRecord[] = [
  {
    id: 1,
    documentNumber: "QP-001",
    documentName: "품질매뉴얼",
    department: "품질관리팀",
    distributionDate: "2024-03-16",
    receivedConfirmation: true,
    receivedDate: "2024-03-16",
    receiver: "이팀장",
  },
  {
    id: 2,
    documentNumber: "QP-001",
    documentName: "품질매뉴얼",
    department: "생산팀",
    distributionDate: "2024-03-16",
    receivedConfirmation: true,
    receivedDate: "2024-03-17",
    receiver: "김팀장",
  },
  {
    id: 3,
    documentNumber: "QP-001",
    documentName: "품질매뉴얼",
    department: "개발팀",
    distributionDate: "2024-03-16",
    receivedConfirmation: false,
    receivedDate: null,
    receiver: "",
  },
  {
    id: 4,
    documentNumber: "WI-001",
    documentName: "검사작업지침서",
    department: "생산팀",
    distributionDate: "2024-01-21",
    receivedConfirmation: true,
    receivedDate: "2024-01-21",
    receiver: "최검사",
  },
];

export default function DocumentControlPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Registration state
  const [registration, setRegistration] = useState<DocumentRegistration>({
    documentNumber: "",
    documentName: "",
    documentType: "",
    revisionNumber: "Rev.01",
    revisionDate: new Date().toISOString().split("T")[0],
    author: "",
    reviewer: "",
    approver: "",
    distributionTargets: [],
    retentionPeriod: "",
  });

  // Document list state
  const [documents, setDocuments] = useState<DocumentItem[]>(sampleDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Revision state
  const [revisionRequests, setRevisionRequests] = useState<RevisionRequest[]>(sampleRevisionRequests);
  const [newRevisionRequest, setNewRevisionRequest] = useState({
    documentNumber: "",
    requestReason: "",
    changeContent: "",
  });

  // Distribution state
  const [distributionRecords, setDistributionRecords] = useState<DistributionRecord[]>(sampleDistributionRecords);

  // Handlers for registration
  const handleRegistrationChange = (field: keyof DocumentRegistration, value: string | string[]) => {
    setRegistration((prev) => ({ ...prev, [field]: value }));
  };

  const handleDistributionTargetToggle = (department: string) => {
    setRegistration((prev) => {
      const targets = [...prev.distributionTargets];
      const index = targets.indexOf(department);
      if (index === -1) {
        targets.push(department);
      } else {
        targets.splice(index, 1);
      }
      return { ...prev, distributionTargets: targets };
    });
  };

  const handleSaveRegistration = () => {
    if (!registration.documentNumber || !registration.documentName || !registration.documentType) {
      alert("문서번호, 문서명, 문서유형은 필수 입력 항목입니다.");
      return;
    }
    alert("문서가 등록되었습니다.");
    // Reset form
    setRegistration({
      documentNumber: "",
      documentName: "",
      documentType: "",
      revisionNumber: "Rev.01",
      revisionDate: new Date().toISOString().split("T")[0],
      author: "",
      reviewer: "",
      approver: "",
      distributionTargets: [],
      retentionPeriod: "",
    });
  };

  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    const matchesDepartment = filterDepartment === "all" || doc.department === filterDepartment;
    return matchesSearch && matchesType && matchesDepartment;
  });

  // Handle revision request submission
  const handleSubmitRevisionRequest = () => {
    if (!newRevisionRequest.documentNumber || !newRevisionRequest.requestReason) {
      alert("문서번호와 개정 사유를 입력해주세요.");
      return;
    }
    alert("개정 신청이 등록되었습니다.");
    setNewRevisionRequest({
      documentNumber: "",
      requestReason: "",
      changeContent: "",
    });
  };

  // Handle distribution confirmation
  const handleConfirmReceived = (id: number) => {
    setDistributionRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              receivedConfirmation: true,
              receivedDate: new Date().toISOString().split("T")[0],
              receiver: "현재 사용자",
            }
          : record
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "승인완료":
      case "완료":
        return <Badge variant="success">{status}</Badge>;
      case "승인대기":
      case "진행중":
        return <Badge variant="warning">{status}</Badge>;
      case "폐기":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRecoveryStatusBadge = (status: string) => {
    switch (status) {
      case "회수완료":
        return <Badge variant="success">{status}</Badge>;
      case "회수중":
        return <Badge variant="warning">{status}</Badge>;
      case "미회수":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">문서관리</h1>
          <p className="text-muted-foreground">IATF 16949 문서 관리 시스템</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registration" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                문서 등록
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                문서 목록
              </TabsTrigger>
              <TabsTrigger value="revision" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                개정 관리
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                배포 현황
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Document Registration */}
            <TabsContent value="registration">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    문서 등록
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">문서번호 *</Label>
                      <Input
                        id="documentNumber"
                        value={registration.documentNumber}
                        onChange={(e) => handleRegistrationChange("documentNumber", e.target.value)}
                        placeholder="예: QP-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentName">문서명 *</Label>
                      <Input
                        id="documentName"
                        value={registration.documentName}
                        onChange={(e) => handleRegistrationChange("documentName", e.target.value)}
                        placeholder="문서명을 입력하세요"
                      />
                    </div>
                  </div>

                  {/* Type and Revision */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">문서유형 *</Label>
                      <Select
                        value={registration.documentType}
                        onValueChange={(v) => handleRegistrationChange("documentType", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revisionNumber">개정번호</Label>
                      <Input
                        id="revisionNumber"
                        value={registration.revisionNumber}
                        onChange={(e) => handleRegistrationChange("revisionNumber", e.target.value)}
                        placeholder="Rev.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revisionDate">개정일</Label>
                      <Input
                        id="revisionDate"
                        type="date"
                        value={registration.revisionDate}
                        onChange={(e) => handleRegistrationChange("revisionDate", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Author, Reviewer, Approver */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="author">작성자</Label>
                      <Input
                        id="author"
                        value={registration.author}
                        onChange={(e) => handleRegistrationChange("author", e.target.value)}
                        placeholder="작성자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewer">검토자</Label>
                      <Input
                        id="reviewer"
                        value={registration.reviewer}
                        onChange={(e) => handleRegistrationChange("reviewer", e.target.value)}
                        placeholder="검토자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approver">승인자</Label>
                      <Input
                        id="approver"
                        value={registration.approver}
                        onChange={(e) => handleRegistrationChange("approver", e.target.value)}
                        placeholder="승인자명"
                      />
                    </div>
                  </div>

                  {/* Distribution Targets */}
                  <div className="space-y-2">
                    <Label>배포처</Label>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-md">
                      {DEPARTMENTS.map((dept) => (
                        <Button
                          key={dept.value}
                          variant={registration.distributionTargets.includes(dept.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDistributionTargetToggle(dept.value)}
                        >
                          {dept.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Retention Period */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="retentionPeriod">보존기간</Label>
                      <Select
                        value={registration.retentionPeriod}
                        onValueChange={(v) => handleRegistrationChange("retentionPeriod", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="보존기간 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {RETENTION_PERIODS.map((period) => (
                            <SelectItem key={period.value} value={period.value}>
                              {period.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={handleSaveRegistration}>
                      <Save className="mr-2 h-4 w-4" />
                      문서 등록
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Document List */}
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    문서 목록
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filters */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>검색</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="문서번호 또는 문서명"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>문서유형</Label>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>부서</Label>
                      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체</SelectItem>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterType("all");
                          setFilterDepartment("all");
                        }}
                      >
                        <ListFilter className="mr-2 h-4 w-4" />
                        필터 초기화
                      </Button>
                    </div>
                  </div>

                  {/* Document Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>문서번호</TableHead>
                        <TableHead>문서명</TableHead>
                        <TableHead>문서유형</TableHead>
                        <TableHead>개정번호</TableHead>
                        <TableHead>개정일</TableHead>
                        <TableHead>부서</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>최신본</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            검색 결과가 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-mono">{doc.documentNumber}</TableCell>
                            <TableCell>{doc.documentName}</TableCell>
                            <TableCell>{doc.documentType}</TableCell>
                            <TableCell>{doc.revisionNumber}</TableCell>
                            <TableCell>{doc.revisionDate}</TableCell>
                            <TableCell>{doc.department}</TableCell>
                            <TableCell>{getStatusBadge(doc.status)}</TableCell>
                            <TableCell>
                              {doc.isLatest ? (
                                <Badge variant="success">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  최신
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Clock className="mr-1 h-3 w-3" />
                                  구버전
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Summary */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      총 {filteredDocuments.length}건의 문서가 검색되었습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Revision Control */}
            <TabsContent value="revision">
              <div className="space-y-6">
                {/* New Revision Request Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      개정 신청
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="revDocNumber">문서번호</Label>
                        <Select
                          value={newRevisionRequest.documentNumber}
                          onValueChange={(v) =>
                            setNewRevisionRequest((prev) => ({ ...prev, documentNumber: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="문서 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {documents
                              .filter((d) => d.isLatest)
                              .map((doc) => (
                                <SelectItem key={doc.documentNumber} value={doc.documentNumber}>
                                  {doc.documentNumber} - {doc.documentName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requestReason">개정 사유 *</Label>
                      <Textarea
                        id="requestReason"
                        value={newRevisionRequest.requestReason}
                        onChange={(e) =>
                          setNewRevisionRequest((prev) => ({ ...prev, requestReason: e.target.value }))
                        }
                        placeholder="개정 사유를 입력하세요"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="changeContent">변경 내용</Label>
                      <Textarea
                        id="changeContent"
                        value={newRevisionRequest.changeContent}
                        onChange={(e) =>
                          setNewRevisionRequest((prev) => ({ ...prev, changeContent: e.target.value }))
                        }
                        placeholder="변경 내용을 상세히 입력하세요"
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitRevisionRequest}>
                        <FileCheck className="mr-2 h-4 w-4" />
                        개정 신청
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Revision Request List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      개정 현황 및 구본 회수 현황
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>문서번호</TableHead>
                          <TableHead>문서명</TableHead>
                          <TableHead>현재 개정</TableHead>
                          <TableHead>신규 개정</TableHead>
                          <TableHead>신청일</TableHead>
                          <TableHead>개정 사유</TableHead>
                          <TableHead>신청자</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>구본 회수</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {revisionRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                              개정 신청 내역이 없습니다.
                            </TableCell>
                          </TableRow>
                        ) : (
                          revisionRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-mono">{request.documentNumber}</TableCell>
                              <TableCell>{request.documentName}</TableCell>
                              <TableCell>{request.currentRevision}</TableCell>
                              <TableCell>{request.newRevision}</TableCell>
                              <TableCell>{request.requestDate}</TableCell>
                              <TableCell className="max-w-xs truncate">{request.requestReason}</TableCell>
                              <TableCell>{request.requester}</TableCell>
                              <TableCell>{getStatusBadge(request.status)}</TableCell>
                              <TableCell>{getRecoveryStatusBadge(request.oldDocRecoveryStatus)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 4: Distribution Status */}
            <TabsContent value="distribution">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    배포 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">전체 배포</p>
                        <p className="text-2xl font-bold">{distributionRecords.length}건</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200">
                      <CardContent className="pt-4">
                        <p className="text-sm text-green-600">수령 확인</p>
                        <p className="text-2xl font-bold text-green-600">
                          {distributionRecords.filter((r) => r.receivedConfirmation).length}건
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-yellow-200">
                      <CardContent className="pt-4">
                        <p className="text-sm text-yellow-600">미확인</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {distributionRecords.filter((r) => !r.receivedConfirmation).length}건
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">배포 부서</p>
                        <p className="text-2xl font-bold">
                          {new Set(distributionRecords.map((r) => r.department)).size}개
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Distribution Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>문서번호</TableHead>
                        <TableHead>문서명</TableHead>
                        <TableHead>배포 부서</TableHead>
                        <TableHead>배포일</TableHead>
                        <TableHead>수령확인</TableHead>
                        <TableHead>수령일</TableHead>
                        <TableHead>수령자</TableHead>
                        <TableHead>작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributionRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            배포 기록이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        distributionRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono">{record.documentNumber}</TableCell>
                            <TableCell>{record.documentName}</TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.distributionDate}</TableCell>
                            <TableCell>
                              {record.receivedConfirmation ? (
                                <Badge variant="success">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  확인
                                </Badge>
                              ) : (
                                <Badge variant="warning">
                                  <Clock className="mr-1 h-3 w-3" />
                                  미확인
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{record.receivedDate || "-"}</TableCell>
                            <TableCell>{record.receiver || "-"}</TableCell>
                            <TableCell>
                              {!record.receivedConfirmation && (
                                <Button size="sm" onClick={() => handleConfirmReceived(record.id)}>
                                  수령확인
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Department Summary */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">부서별 배포 현황</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      {Array.from(new Set(distributionRecords.map((r) => r.department))).map((dept) => {
                        const deptRecords = distributionRecords.filter((r) => r.department === dept);
                        const confirmed = deptRecords.filter((r) => r.receivedConfirmation).length;
                        const total = deptRecords.length;
                        return (
                          <Card key={dept}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{dept}</span>
                                <span className="text-sm">
                                  <span className="text-green-600">{confirmed}</span>
                                  <span className="text-muted-foreground"> / {total}</span>
                                </span>
                              </div>
                              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 transition-all"
                                  style={{ width: `${(confirmed / total) * 100}%` }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
