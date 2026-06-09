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
import { Plus, FileText, History, List, Send, Trash2 } from "lucide-react";

// Types
interface Document {
  id: number;
  documentNumber: string;
  documentName: string;
  documentType: string;
  revisionNumber: string;
  revisionDate: string;
  authorDept: string;
  author: string;
  approver: string;
  distributionList: string[];
  retentionPeriod: string;
}

interface RevisionHistory {
  id: number;
  documentId: number;
  revisionNumber: string;
  revisionDate: string;
  revisionContent: string;
  revisionReason: string;
  approver: string;
}

interface Distribution {
  id: number;
  documentId: number;
  documentNumber: string;
  documentName: string;
  distributionDept: string;
  distributionDate: string;
  distributor: string;
  receiver: string;
  status: string;
}

// Options
const documentTypes = ["규정", "절차서", "지침서", "양식"];
const departments = ["경영지원부", "영업부", "생산부", "품질부", "인사부", "구매부", "물류부"];
const retentionPeriods = ["1년", "3년", "5년", "10년", "영구"];
const distributionStatuses = ["배포대기", "배포완료", "회수"];

// Initial Data
const initialDocuments: Document[] = [
  {
    id: 1,
    documentNumber: "QM-001",
    documentName: "품질매뉴얼",
    documentType: "규정",
    revisionNumber: "3",
    revisionDate: "2026-01-15",
    authorDept: "품질부",
    author: "김품질",
    approver: "이대표",
    distributionList: ["경영지원부", "생산부", "품질부"],
    retentionPeriod: "영구",
  },
  {
    id: 2,
    documentNumber: "QP-001",
    documentName: "문서관리 절차서",
    documentType: "절차서",
    revisionNumber: "2",
    revisionDate: "2025-11-20",
    authorDept: "품질부",
    author: "김품질",
    approver: "이대표",
    distributionList: ["경영지원부", "품질부"],
    retentionPeriod: "5년",
  },
  {
    id: 3,
    documentNumber: "QI-001",
    documentName: "검사 지침서",
    documentType: "지침서",
    revisionNumber: "1",
    revisionDate: "2025-10-10",
    authorDept: "품질부",
    author: "박검사",
    approver: "김품질",
    distributionList: ["품질부", "생산부"],
    retentionPeriod: "3년",
  },
  {
    id: 4,
    documentNumber: "QF-001",
    documentName: "부적합 보고서 양식",
    documentType: "양식",
    revisionNumber: "1",
    revisionDate: "2025-09-01",
    authorDept: "품질부",
    author: "박검사",
    approver: "김품질",
    distributionList: ["품질부", "생산부", "구매부"],
    retentionPeriod: "3년",
  },
];

const initialRevisionHistory: RevisionHistory[] = [
  {
    id: 1,
    documentId: 1,
    revisionNumber: "3",
    revisionDate: "2026-01-15",
    revisionContent: "조직도 변경 반영",
    revisionReason: "조직개편에 따른 품질 책임자 변경",
    approver: "이대표",
  },
  {
    id: 2,
    documentId: 1,
    revisionNumber: "2",
    revisionDate: "2025-06-10",
    revisionContent: "품질방침 개정",
    revisionReason: "경영 전략 변경에 따른 품질방침 수정",
    approver: "이대표",
  },
  {
    id: 3,
    documentId: 2,
    revisionNumber: "2",
    revisionDate: "2025-11-20",
    revisionContent: "전자문서 관리 프로세스 추가",
    revisionReason: "디지털 전환에 따른 절차 개선",
    approver: "이대표",
  },
];

const initialDistributions: Distribution[] = [
  {
    id: 1,
    documentId: 1,
    documentNumber: "QM-001",
    documentName: "품질매뉴얼",
    distributionDept: "생산부",
    distributionDate: "2026-01-16",
    distributor: "김품질",
    receiver: "최생산",
    status: "배포완료",
  },
  {
    id: 2,
    documentId: 1,
    documentNumber: "QM-001",
    documentName: "품질매뉴얼",
    distributionDept: "품질부",
    distributionDate: "2026-01-16",
    distributor: "김품질",
    receiver: "박검사",
    status: "배포완료",
  },
  {
    id: 3,
    documentId: 2,
    documentNumber: "QP-001",
    documentName: "문서관리 절차서",
    distributionDept: "경영지원부",
    distributionDate: "2025-11-21",
    distributor: "김품질",
    receiver: "정경영",
    status: "배포완료",
  },
];

export default function DocumentControlPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistory[]>(initialRevisionHistory);
  const [distributions, setDistributions] = useState<Distribution[]>(initialDistributions);

  // Form states
  const [documentForm, setDocumentForm] = useState({
    documentNumber: "",
    documentName: "",
    documentType: "",
    revisionNumber: "1",
    revisionDate: "",
    authorDept: "",
    author: "",
    approver: "",
    distributionList: [] as string[],
    retentionPeriod: "",
  });

  const [revisionForm, setRevisionForm] = useState({
    documentId: 0,
    revisionNumber: "",
    revisionDate: "",
    revisionContent: "",
    revisionReason: "",
    approver: "",
  });

  const [distributionForm, setDistributionForm] = useState({
    documentId: 0,
    distributionDept: "",
    distributionDate: "",
    distributor: "",
    receiver: "",
  });

  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  // Document registration handlers
  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDocument: Document = {
      id: documents.length + 1,
      ...documentForm,
    };
    setDocuments([...documents, newDocument]);
    setDocumentForm({
      documentNumber: "",
      documentName: "",
      documentType: "",
      revisionNumber: "1",
      revisionDate: "",
      authorDept: "",
      author: "",
      approver: "",
      distributionList: [],
      retentionPeriod: "",
    });
  };

  const handleDistributionListChange = (dept: string) => {
    setDocumentForm((prev) => ({
      ...prev,
      distributionList: prev.distributionList.includes(dept)
        ? prev.distributionList.filter((d) => d !== dept)
        : [...prev.distributionList, dept],
    }));
  };

  // Revision history handlers
  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRevision: RevisionHistory = {
      id: revisionHistory.length + 1,
      ...revisionForm,
    };
    setRevisionHistory([...revisionHistory, newRevision]);
    setRevisionForm({
      documentId: 0,
      revisionNumber: "",
      revisionDate: "",
      revisionContent: "",
      revisionReason: "",
      approver: "",
    });
  };

  const handleRemoveRevision = (id: number) => {
    setRevisionHistory(revisionHistory.filter((r) => r.id !== id));
  };

  // Distribution handlers
  const handleDistributionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDoc = documents.find((d) => d.id === distributionForm.documentId);
    if (!selectedDoc) return;

    const newDistribution: Distribution = {
      id: distributions.length + 1,
      documentId: distributionForm.documentId,
      documentNumber: selectedDoc.documentNumber,
      documentName: selectedDoc.documentName,
      distributionDept: distributionForm.distributionDept,
      distributionDate: distributionForm.distributionDate,
      distributor: distributionForm.distributor,
      receiver: distributionForm.receiver,
      status: "배포대기",
    };
    setDistributions([...distributions, newDistribution]);
    setDistributionForm({
      documentId: 0,
      distributionDept: "",
      distributionDate: "",
      distributor: "",
      receiver: "",
    });
  };

  const handleUpdateDistributionStatus = (id: number, status: string) => {
    setDistributions(
      distributions.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  // Filter documents by type and department
  const filteredDocuments = documents.filter((doc) => {
    const typeMatch = selectedDocumentType === "all" || doc.documentType === selectedDocumentType;
    const deptMatch = selectedDept === "all" || doc.authorDept === selectedDept;
    return typeMatch && deptMatch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      배포대기: "secondary",
      배포완료: "success",
      회수: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      규정: "bg-blue-100 text-blue-800",
      절차서: "bg-green-100 text-green-800",
      지침서: "bg-yellow-100 text-yellow-800",
      양식: "bg-purple-100 text-purple-800",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || "bg-gray-100"}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">문서관리</h1>
          <p className="text-muted-foreground">
            품질경영시스템 문서의 등록, 개정, 배포 관리
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 문서</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">규정</p>
                <p className="text-2xl font-bold text-blue-600">
                  {documents.filter((d) => d.documentType === "규정").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">절차서</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter((d) => d.documentType === "절차서").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">지침서/양식</p>
                <p className="text-2xl font-bold text-purple-600">
                  {documents.filter((d) => d.documentType === "지침서" || d.documentType === "양식").length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <Plus className="mr-2 h-4 w-4" />
            문서 등록/수정
          </TabsTrigger>
          <TabsTrigger value="revision">
            <History className="mr-2 h-4 w-4" />
            개정 이력
          </TabsTrigger>
          <TabsTrigger value="status">
            <List className="mr-2 h-4 w-4" />
            문서 현황
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <Send className="mr-2 h-4 w-4" />
            배포 관리
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Document Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                문서 등록/수정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDocumentSubmit} className="space-y-6">
                {/* Header Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">문서 기본정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">문서번호</Label>
                      <Input
                        id="documentNumber"
                        value={documentForm.documentNumber}
                        onChange={(e) =>
                          setDocumentForm({ ...documentForm, documentNumber: e.target.value })
                        }
                        placeholder="QM-001"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentName">문서명</Label>
                      <Input
                        id="documentName"
                        value={documentForm.documentName}
                        onChange={(e) =>
                          setDocumentForm({ ...documentForm, documentName: e.target.value })
                        }
                        placeholder="품질매뉴얼"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentType">문서유형</Label>
                      <Select
                        value={documentForm.documentType}
                        onValueChange={(value) =>
                          setDocumentForm({ ...documentForm, documentType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="문서유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Document Info Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">문서정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="revisionNumber">개정번호</Label>
                      <Input
                        id="revisionNumber"
                        value={documentForm.revisionNumber}
                        onChange={(e) =>
                          setDocumentForm({ ...documentForm, revisionNumber: e.target.value })
                        }
                        placeholder="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revisionDate">개정일</Label>
                      <Input
                        id="revisionDate"
                        type="date"
                        value={documentForm.revisionDate}
                        onChange={(e) =>
                          setDocumentForm({ ...documentForm, revisionDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authorDept">작성부서</Label>
                      <Select
                        value={documentForm.authorDept}
                        onValueChange={(value) =>
                          setDocumentForm({ ...documentForm, authorDept: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="작성부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">작성자</Label>
                      <Input
                        id="author"
                        value={documentForm.author}
                        onChange={(e) =>
                          setDocumentForm({ ...documentForm, author: e.target.value })
                        }
                        placeholder="홍길동"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="approver">승인자</Label>
                      <Input
                        id="approver"
                        value={documentForm.approver}
                        onChange={(e) =>
                          setDocumentForm({ ...documentForm, approver: e.target.value })
                        }
                        placeholder="김대표"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retentionPeriod">보존기간</Label>
                      <Select
                        value={documentForm.retentionPeriod}
                        onValueChange={(value) =>
                          setDocumentForm({ ...documentForm, retentionPeriod: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="보존기간 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {retentionPeriods.map((period) => (
                            <SelectItem key={period} value={period}>
                              {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>배포처</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {departments.map((dept) => (
                          <label key={dept} className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={documentForm.distributionList.includes(dept)}
                              onChange={() => handleDistributionListChange(dept)}
                              className="rounded border-gray-300"
                            />
                            {dept}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setDocumentForm({
                        documentNumber: "",
                        documentName: "",
                        documentType: "",
                        revisionNumber: "1",
                        revisionDate: "",
                        authorDept: "",
                        author: "",
                        approver: "",
                        distributionList: [],
                        retentionPeriod: "",
                      })
                    }
                  >
                    초기화
                  </Button>
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    문서 등록
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Revision History */}
        <TabsContent value="revision">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  개정 이력 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRevisionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="revDocId">문서 선택</Label>
                      <Select
                        value={revisionForm.documentId.toString()}
                        onValueChange={(value) =>
                          setRevisionForm({ ...revisionForm, documentId: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="문서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {documents.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id.toString()}>
                              {doc.documentNumber} - {doc.documentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revNumber">개정번호</Label>
                      <Input
                        id="revNumber"
                        value={revisionForm.revisionNumber}
                        onChange={(e) =>
                          setRevisionForm({ ...revisionForm, revisionNumber: e.target.value })
                        }
                        placeholder="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revDate">개정일자</Label>
                      <Input
                        id="revDate"
                        type="date"
                        value={revisionForm.revisionDate}
                        onChange={(e) =>
                          setRevisionForm({ ...revisionForm, revisionDate: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="revContent">개정내용</Label>
                      <Textarea
                        id="revContent"
                        value={revisionForm.revisionContent}
                        onChange={(e) =>
                          setRevisionForm({ ...revisionForm, revisionContent: e.target.value })
                        }
                        placeholder="개정 내용을 입력하세요"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revReason">개정사유</Label>
                      <Textarea
                        id="revReason"
                        value={revisionForm.revisionReason}
                        onChange={(e) =>
                          setRevisionForm({ ...revisionForm, revisionReason: e.target.value })
                        }
                        placeholder="개정 사유를 입력하세요"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="revApprover">승인자</Label>
                      <Input
                        id="revApprover"
                        value={revisionForm.approver}
                        onChange={(e) =>
                          setRevisionForm({ ...revisionForm, approver: e.target.value })
                        }
                        placeholder="승인자명"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit">
                      <Plus className="mr-2 h-4 w-4" />
                      개정 이력 추가
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>개정 이력 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {revisionHistory.length === 0 ? (
                  <p className="text-muted-foreground">등록된 개정 이력이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>문서</TableHead>
                        <TableHead>개정번호</TableHead>
                        <TableHead>개정일자</TableHead>
                        <TableHead>개정내용</TableHead>
                        <TableHead>개정사유</TableHead>
                        <TableHead>승인자</TableHead>
                        <TableHead>작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revisionHistory.map((revision) => {
                        const doc = documents.find((d) => d.id === revision.documentId);
                        return (
                          <TableRow key={revision.id}>
                            <TableCell>
                              {doc ? `${doc.documentNumber} - ${doc.documentName}` : "-"}
                            </TableCell>
                            <TableCell>{revision.revisionNumber}</TableCell>
                            <TableCell>{formatDate(revision.revisionDate)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {revision.revisionContent}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {revision.revisionReason}
                            </TableCell>
                            <TableCell>{revision.approver}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveRevision(revision.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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
          </div>
        </TabsContent>

        {/* Tab 3: Document Status */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                문서 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="space-y-2">
                  <Label>문서유형 필터</Label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="문서유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>부서 필터</Label>
                  <Select value={selectedDept} onValueChange={setSelectedDept}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredDocuments.length === 0 ? (
                <p className="text-muted-foreground">등록된 문서가 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>문서번호</TableHead>
                      <TableHead>문서명</TableHead>
                      <TableHead>문서유형</TableHead>
                      <TableHead>개정번호</TableHead>
                      <TableHead>개정일</TableHead>
                      <TableHead>작성부서</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>승인자</TableHead>
                      <TableHead>보존기간</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.documentNumber}</TableCell>
                        <TableCell>{doc.documentName}</TableCell>
                        <TableCell>{getDocumentTypeBadge(doc.documentType)}</TableCell>
                        <TableCell>{doc.revisionNumber}</TableCell>
                        <TableCell>{formatDate(doc.revisionDate)}</TableCell>
                        <TableCell>{doc.authorDept}</TableCell>
                        <TableCell>{doc.author}</TableCell>
                        <TableCell>{doc.approver}</TableCell>
                        <TableCell>{doc.retentionPeriod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Distribution Management */}
        <TabsContent value="distribution">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  배포 등록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDistributionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="distDocId">문서 선택</Label>
                      <Select
                        value={distributionForm.documentId.toString()}
                        onValueChange={(value) =>
                          setDistributionForm({ ...distributionForm, documentId: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="문서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {documents.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id.toString()}>
                              {doc.documentNumber} - {doc.documentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distDept">배포부서</Label>
                      <Select
                        value={distributionForm.distributionDept}
                        onValueChange={(value) =>
                          setDistributionForm({ ...distributionForm, distributionDept: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="배포부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distDate">배포일자</Label>
                      <Input
                        id="distDate"
                        type="date"
                        value={distributionForm.distributionDate}
                        onChange={(e) =>
                          setDistributionForm({ ...distributionForm, distributionDate: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="distributor">배포자</Label>
                      <Input
                        id="distributor"
                        value={distributionForm.distributor}
                        onChange={(e) =>
                          setDistributionForm({ ...distributionForm, distributor: e.target.value })
                        }
                        placeholder="배포자명"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiver">수령자</Label>
                      <Input
                        id="receiver"
                        value={distributionForm.receiver}
                        onChange={(e) =>
                          setDistributionForm({ ...distributionForm, receiver: e.target.value })
                        }
                        placeholder="수령자명"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="submit">
                      <Plus className="mr-2 h-4 w-4" />
                      배포 등록
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>배포 현황</CardTitle>
              </CardHeader>
              <CardContent>
                {distributions.length === 0 ? (
                  <p className="text-muted-foreground">등록된 배포 내역이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>문서번호</TableHead>
                        <TableHead>문서명</TableHead>
                        <TableHead>배포부서</TableHead>
                        <TableHead>배포일자</TableHead>
                        <TableHead>배포자</TableHead>
                        <TableHead>수령자</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>상태변경</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributions.map((dist) => (
                        <TableRow key={dist.id}>
                          <TableCell className="font-medium">{dist.documentNumber}</TableCell>
                          <TableCell>{dist.documentName}</TableCell>
                          <TableCell>{dist.distributionDept}</TableCell>
                          <TableCell>{formatDate(dist.distributionDate)}</TableCell>
                          <TableCell>{dist.distributor}</TableCell>
                          <TableCell>{dist.receiver}</TableCell>
                          <TableCell>{getStatusBadge(dist.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={dist.status}
                              onValueChange={(value) =>
                                handleUpdateDistributionStatus(dist.id, value)
                              }
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {distributionStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
