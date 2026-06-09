"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  ClipboardCheck,
  PlayCircle,
  History,
  Save,
  User,
  Settings,
  Package,
  Wrench,
} from "lucide-react";

// 4M Change Management Form Data Interface
interface ChangeRequestFormData {
  // Tab 1: Change Request (변경 신청)
  requestNumber: string;
  requestDate: string;
  changeType: "Man" | "Machine" | "Material" | "Method" | "";
  changeDetails: string;
  changeReason: string;
  impactScope: string;
  requester: string;
  approvalRequester: string;

  // Tab 2: Change Review (변경 검토)
  reviewer: string;
  reviewDate: string;
  qualityImpactAssessment: string;
  customerNotificationRequired: "yes" | "no" | "";
  approvalDecision: "approved" | "rejected" | "conditional" | "";
  reviewComments: string;

  // Tab 3: Change Implementation (변경 실행)
  implementationDate: string;
  verificationResult: string;
  documentRevision: "yes" | "no" | "";
  revisedDocumentList: string;
  implementationComments: string;

  // Status
  status: "requested" | "under-review" | "approved" | "rejected" | "implemented" | "closed";
}

interface ChangeHistoryRecord {
  id: number;
  requestNumber: string;
  requestDate: string;
  changeType: string;
  changeDetails: string;
  requester: string;
  approvalDecision: string;
  implementationDate: string | null;
  status: string;
}

const initialFormData: ChangeRequestFormData = {
  requestNumber: "",
  requestDate: new Date().toISOString().split("T")[0],
  changeType: "",
  changeDetails: "",
  changeReason: "",
  impactScope: "",
  requester: "",
  approvalRequester: "",
  reviewer: "",
  reviewDate: "",
  qualityImpactAssessment: "",
  customerNotificationRequired: "",
  approvalDecision: "",
  reviewComments: "",
  implementationDate: "",
  verificationResult: "",
  documentRevision: "",
  revisedDocumentList: "",
  implementationComments: "",
  status: "requested",
};

const sampleHistory: ChangeHistoryRecord[] = [
  {
    id: 1,
    requestNumber: "4M-2026-001",
    requestDate: "2026-01-10",
    changeType: "Man",
    changeDetails: "신규 작업자 배치 (생산 1라인)",
    requester: "김생산",
    approvalDecision: "approved",
    implementationDate: "2026-01-15",
    status: "closed",
  },
  {
    id: 2,
    requestNumber: "4M-2026-002",
    requestDate: "2026-02-05",
    changeType: "Machine",
    changeDetails: "프레스 설비 교체 (HP-200 -> HP-300)",
    requester: "이설비",
    approvalDecision: "approved",
    implementationDate: "2026-02-20",
    status: "closed",
  },
  {
    id: 3,
    requestNumber: "4M-2026-003",
    requestDate: "2026-03-15",
    changeType: "Material",
    changeDetails: "원자재 공급업체 변경 (A사 -> B사)",
    requester: "박구매",
    approvalDecision: "approved",
    implementationDate: "2026-04-01",
    status: "closed",
  },
  {
    id: 4,
    requestNumber: "4M-2026-004",
    requestDate: "2026-05-20",
    changeType: "Method",
    changeDetails: "도장 공정 조건 변경 (건조온도 조정)",
    requester: "최공정",
    approvalDecision: "conditional",
    implementationDate: null,
    status: "under-review",
  },
  {
    id: 5,
    requestNumber: "4M-2026-005",
    requestDate: "2026-06-01",
    changeType: "Man",
    changeDetails: "야간조 작업자 교대",
    requester: "정인사",
    approvalDecision: "",
    implementationDate: null,
    status: "requested",
  },
];

const changeTypeLabels: Record<string, string> = {
  Man: "Man (인적)",
  Machine: "Machine (설비)",
  Material: "Material (자재)",
  Method: "Method (방법)",
};

const changeTypeIcons: Record<string, React.ReactNode> = {
  Man: <User className="h-4 w-4" />,
  Machine: <Settings className="h-4 w-4" />,
  Material: <Package className="h-4 w-4" />,
  Method: <Wrench className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  requested: "bg-gray-100 text-gray-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  implemented: "bg-green-100 text-green-800",
  closed: "bg-slate-100 text-slate-800",
};

const statusLabels: Record<string, string> = {
  requested: "신청",
  "under-review": "검토중",
  approved: "승인",
  rejected: "반려",
  implemented: "실행완료",
  closed: "종결",
};

const approvalLabels: Record<string, string> = {
  approved: "승인",
  rejected: "반려",
  conditional: "조건부승인",
};

export default function ChangeManagementPage() {
  const [activeTab, setActiveTab] = useState("request");
  const [formData, setFormData] = useState<ChangeRequestFormData>(initialFormData);
  const [historyData] = useState<ChangeHistoryRecord[]>(sampleHistory);

  const updateField = <K extends keyof ChangeRequestFormData>(
    field: K,
    value: ChangeRequestFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateRequestNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("requestNumber", `4M-${year}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving 4M Change Management data:", formData);
    alert("4M 변경관리 데이터가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">4M 변경관리</h1>
          <p className="text-muted-foreground">Man, Machine, Material, Method 변경 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="request">변경 신청</TabsTrigger>
          <TabsTrigger value="review">변경 검토</TabsTrigger>
          <TabsTrigger value="implementation">변경 실행</TabsTrigger>
          <TabsTrigger value="history">변경 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Change Request (변경 신청) */}
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                변경 신청 (Change Request)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestNumber">신청번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="requestNumber"
                      value={formData.requestNumber}
                      onChange={(e) => updateField("requestNumber", e.target.value)}
                      placeholder="4M-YYYY-XXX"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateRequestNumber}
                      className="shrink-0"
                    >
                      자동생성
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestDate">신청일</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => updateField("requestDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requester">신청자</Label>
                  <Input
                    id="requester"
                    value={formData.requester}
                    onChange={(e) => updateField("requester", e.target.value)}
                    placeholder="신청자명"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalRequester">승인요청자</Label>
                  <Input
                    id="approvalRequester"
                    value={formData.approvalRequester}
                    onChange={(e) => updateField("approvalRequester", e.target.value)}
                    placeholder="승인요청자명"
                  />
                </div>
              </div>

              {/* Change Type */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">변경 유형 (4M)</h3>
                <div className="space-y-2">
                  <Label>변경 유형</Label>
                  <Select
                    value={formData.changeType}
                    onValueChange={(value) =>
                      updateField("changeType", value as ChangeRequestFormData["changeType"])
                    }
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="변경 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Man">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Man (인적) - 작업자 변경
                        </div>
                      </SelectItem>
                      <SelectItem value="Machine">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Machine (설비) - 설비/장비 변경
                        </div>
                      </SelectItem>
                      <SelectItem value="Material">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Material (자재) - 원자재/부품 변경
                        </div>
                      </SelectItem>
                      <SelectItem value="Method">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          Method (방법) - 작업방법/공정 변경
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.changeType && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {changeTypeIcons[formData.changeType]}
                      <span>선택된 유형: {changeTypeLabels[formData.changeType]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Change Details */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">변경 내용</h3>

                <div className="space-y-2">
                  <Label htmlFor="changeDetails">변경 내용 상세</Label>
                  <Textarea
                    id="changeDetails"
                    value={formData.changeDetails}
                    onChange={(e) => updateField("changeDetails", e.target.value)}
                    placeholder="변경 내용을 상세하게 기술하세요&#10;&#10;예시:&#10;- 변경 전 상태&#10;- 변경 후 상태&#10;- 변경 적용 범위"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changeReason">변경 사유</Label>
                  <Textarea
                    id="changeReason"
                    value={formData.changeReason}
                    onChange={(e) => updateField("changeReason", e.target.value)}
                    placeholder="변경이 필요한 사유를 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impactScope">영향 범위</Label>
                  <Textarea
                    id="impactScope"
                    value={formData.impactScope}
                    onChange={(e) => updateField("impactScope", e.target.value)}
                    placeholder="변경으로 인해 영향을 받는 제품, 공정, 부서 등을 기술하세요"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Change Review (변경 검토) */}
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                변경 검토 (Change Review)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reviewer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewer">검토자</Label>
                  <Input
                    id="reviewer"
                    value={formData.reviewer}
                    onChange={(e) => updateField("reviewer", e.target.value)}
                    placeholder="검토자명"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewDate">검토일</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => updateField("reviewDate", e.target.value)}
                  />
                </div>
              </div>

              {/* Quality Impact Assessment */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">품질 영향 평가</h3>

                <div className="space-y-2">
                  <Label htmlFor="qualityImpactAssessment">품질 영향 평가</Label>
                  <Textarea
                    id="qualityImpactAssessment"
                    value={formData.qualityImpactAssessment}
                    onChange={(e) => updateField("qualityImpactAssessment", e.target.value)}
                    placeholder="변경이 제품 품질에 미치는 영향을 평가하세요&#10;&#10;평가 항목:&#10;- 제품 규격/성능 영향&#10;- 공정 안정성 영향&#10;- 불량률 예상 변화"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>고객 통보 필요 여부</Label>
                  <Select
                    value={formData.customerNotificationRequired}
                    onValueChange={(value) =>
                      updateField(
                        "customerNotificationRequired",
                        value as ChangeRequestFormData["customerNotificationRequired"]
                      )
                    }
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">필요</SelectItem>
                      <SelectItem value="no">불필요</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.customerNotificationRequired === "yes" && (
                    <p className="text-sm text-orange-600 mt-2">
                      고객사에 변경 사항을 사전 통보해야 합니다.
                    </p>
                  )}
                </div>
              </div>

              {/* Approval Decision */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">승인 결정</h3>

                <div className="space-y-2">
                  <Label>승인/반려 결정</Label>
                  <Select
                    value={formData.approvalDecision}
                    onValueChange={(value) =>
                      updateField(
                        "approvalDecision",
                        value as ChangeRequestFormData["approvalDecision"]
                      )
                    }
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="결정 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="conditional">조건부 승인</SelectItem>
                      <SelectItem value="rejected">반려</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewComments">검토 의견</Label>
                  <Textarea
                    id="reviewComments"
                    value={formData.reviewComments}
                    onChange={(e) => updateField("reviewComments", e.target.value)}
                    placeholder="검토 의견 또는 조건부 승인 시 조건을 기술하세요"
                    rows={4}
                  />
                </div>

                {formData.approvalDecision && (
                  <div
                    className={`p-4 rounded-lg ${
                      formData.approvalDecision === "approved"
                        ? "bg-green-50 border border-green-200"
                        : formData.approvalDecision === "conditional"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p className="font-medium">
                      결정:{" "}
                      {formData.approvalDecision === "approved"
                        ? "승인"
                        : formData.approvalDecision === "conditional"
                        ? "조건부 승인"
                        : "반려"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Change Implementation (변경 실행) */}
        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                변경 실행 (Change Implementation)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Implementation Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="implementationDate">실행일</Label>
                  <Input
                    id="implementationDate"
                    type="date"
                    value={formData.implementationDate}
                    onChange={(e) => updateField("implementationDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      updateField("status", value as ChangeRequestFormData["status"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requested">신청</SelectItem>
                      <SelectItem value="under-review">검토중</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="rejected">반려</SelectItem>
                      <SelectItem value="implemented">실행완료</SelectItem>
                      <SelectItem value="closed">종결</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Verification Result */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">검증 결과</h3>

                <div className="space-y-2">
                  <Label htmlFor="verificationResult">검증 결과</Label>
                  <Textarea
                    id="verificationResult"
                    value={formData.verificationResult}
                    onChange={(e) => updateField("verificationResult", e.target.value)}
                    placeholder="변경 실행 후 검증 결과를 기술하세요&#10;&#10;검증 항목:&#10;- 변경 목적 달성 여부&#10;- 품질 영향 확인&#10;- 문제점 발생 여부"
                    rows={5}
                  />
                </div>
              </div>

              {/* Document Revision */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">문서 개정</h3>

                <div className="space-y-2">
                  <Label>문서 개정 여부</Label>
                  <Select
                    value={formData.documentRevision}
                    onValueChange={(value) =>
                      updateField(
                        "documentRevision",
                        value as ChangeRequestFormData["documentRevision"]
                      )
                    }
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">개정 필요</SelectItem>
                      <SelectItem value="no">개정 불필요</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.documentRevision === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="revisedDocumentList">개정 문서 목록</Label>
                    <Textarea
                      id="revisedDocumentList"
                      value={formData.revisedDocumentList}
                      onChange={(e) => updateField("revisedDocumentList", e.target.value)}
                      placeholder="개정된 문서명을 나열하세요&#10;&#10;예시:&#10;- 작업표준서 WI-001 (Rev.3 -> Rev.4)&#10;- 검사기준서 QI-002 (Rev.2 -> Rev.3)"
                      rows={4}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="implementationComments">실행 비고</Label>
                  <Textarea
                    id="implementationComments"
                    value={formData.implementationComments}
                    onChange={(e) => updateField("implementationComments", e.target.value)}
                    placeholder="변경 실행 관련 추가 사항을 기술하세요"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Change History (변경 이력) */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                변경 이력 (Change History)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>신청번호</TableHead>
                    <TableHead>신청일</TableHead>
                    <TableHead>변경유형</TableHead>
                    <TableHead>변경내용</TableHead>
                    <TableHead>신청자</TableHead>
                    <TableHead>승인결정</TableHead>
                    <TableHead>실행일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono">{record.requestNumber}</TableCell>
                      <TableCell>
                        {new Date(record.requestDate).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {changeTypeIcons[record.changeType]}
                          <span>{changeTypeLabels[record.changeType] || record.changeType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{record.changeDetails}</TableCell>
                      <TableCell>{record.requester}</TableCell>
                      <TableCell>
                        {record.approvalDecision ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.approvalDecision === "approved"
                                ? "bg-green-100 text-green-800"
                                : record.approvalDecision === "conditional"
                                ? "bg-yellow-100 text-yellow-800"
                                : record.approvalDecision === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {approvalLabels[record.approvalDecision] || record.approvalDecision}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {record.implementationDate
                          ? new Date(record.implementationDate).toLocaleDateString("ko-KR")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[record.status] || "bg-gray-100"
                          }`}
                        >
                          {statusLabels[record.status] || record.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
