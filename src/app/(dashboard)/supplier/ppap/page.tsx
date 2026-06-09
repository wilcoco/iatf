"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, FileText, ClipboardCheck, Award, History, Send, RefreshCw } from "lucide-react";

// Types
interface PPAPRequest {
  requestNumber: string;
  requestDate: string;
  supplierName: string;
  supplierCode: string;
  partNumber: string;
  partName: string;
  requestReason: string;
  submissionLevel: string;
  dueDate: string;
  requesterName: string;
  requesterDept: string;
}

interface PPAPElement {
  id: number;
  name: string;
  nameKr: string;
  submissionStatus: string;
  conformityStatus: string;
  remarks: string;
}

interface ApprovalInfo {
  approvalStatus: string;
  rejectionReason: string;
  resubmissionRequested: boolean;
  resubmissionDueDate: string;
  approverName: string;
  approvalDate: string;
  comments: string;
}

interface PPAPHistoryRecord {
  id: number;
  requestNumber: string;
  requestDate: string;
  supplierName: string;
  partNumber: string;
  partName: string;
  submissionLevel: string;
  approvalStatus: string;
  approvalDate: string;
}

// PPAP 18 elements based on IATF 16949
const initialPPAPElements: PPAPElement[] = [
  { id: 1, name: "Design Records", nameKr: "설계기록", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 2, name: "Engineering Change Documents", nameKr: "설계변경 문서", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 3, name: "Customer Engineering Approval", nameKr: "고객 설계승인", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 4, name: "Design FMEA", nameKr: "설계 FMEA", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 5, name: "Process Flow Diagram", nameKr: "공정흐름도", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 6, name: "Process FMEA", nameKr: "공정 FMEA", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 7, name: "Control Plan", nameKr: "관리계획서", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 8, name: "MSA Studies", nameKr: "측정시스템 분석", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 9, name: "Dimensional Results", nameKr: "치수검사 결과", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 10, name: "Material/Performance Test Results", nameKr: "재료/성능시험 결과", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 11, name: "Initial Process Studies", nameKr: "초기공정능력 연구", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 12, name: "Qualified Laboratory Documentation", nameKr: "인정시험소 문서", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 13, name: "Appearance Approval Report", nameKr: "외관승인 보고서", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 14, name: "Sample Production Parts", nameKr: "양산 샘플", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 15, name: "Master Sample", nameKr: "마스터 샘플", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 16, name: "Checking Aids", nameKr: "검사 보조구", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 17, name: "Customer-Specific Requirements", nameKr: "고객 특정요구사항", submissionStatus: "", conformityStatus: "", remarks: "" },
  { id: 18, name: "Part Submission Warrant (PSW)", nameKr: "부품제출 보증서", submissionStatus: "", conformityStatus: "", remarks: "" },
];

// Badge styling helpers
const getApprovalBadgeClass = (status: string): string => {
  switch (status) {
    case "승인": return "bg-green-100 text-green-800";
    case "조건부승인": return "bg-yellow-100 text-yellow-800";
    case "반려": return "bg-red-100 text-red-800";
    case "검토중": return "bg-blue-100 text-blue-800";
    default: return "";
  }
};

const getSubmissionBadgeClass = (status: string): string => {
  switch (status) {
    case "제출": return "bg-green-100 text-green-800";
    case "미제출": return "bg-red-100 text-red-800";
    case "해당없음": return "bg-gray-100 text-gray-800";
    default: return "";
  }
};

const getConformityBadgeClass = (status: string): string => {
  switch (status) {
    case "적합": return "bg-green-100 text-green-800";
    case "부적합": return "bg-red-100 text-red-800";
    case "N/A": return "bg-gray-100 text-gray-800";
    default: return "";
  }
};

export default function SupplierPPAPPage() {
  const [activeTab, setActiveTab] = useState("request");

  // PPAP Request state
  const [ppapRequest, setPPAPRequest] = useState<PPAPRequest>({
    requestNumber: "",
    requestDate: new Date().toISOString().split("T")[0],
    supplierName: "",
    supplierCode: "",
    partNumber: "",
    partName: "",
    requestReason: "",
    submissionLevel: "",
    dueDate: "",
    requesterName: "",
    requesterDept: "",
  });

  // PPAP Elements state
  const [ppapElements, setPPAPElements] = useState<PPAPElement[]>(initialPPAPElements);

  // Approval state
  const [approvalInfo, setApprovalInfo] = useState<ApprovalInfo>({
    approvalStatus: "",
    rejectionReason: "",
    resubmissionRequested: false,
    resubmissionDueDate: "",
    approverName: "",
    approvalDate: "",
    comments: "",
  });

  // History state (sample data)
  const [history] = useState<PPAPHistoryRecord[]>([
    { id: 1, requestNumber: "PPAP-2026-001", requestDate: "2026-01-15", supplierName: "(주)우수금속", partNumber: "PT-10001", partName: "브라켓 ASSY", submissionLevel: "Level 3", approvalStatus: "승인", approvalDate: "2026-02-01" },
    { id: 2, requestNumber: "PPAP-2026-002", requestDate: "2026-02-10", supplierName: "(주)대한플라스틱", partNumber: "PT-10002", partName: "커버 R/H", submissionLevel: "Level 3", approvalStatus: "조건부승인", approvalDate: "2026-02-25" },
    { id: 3, requestNumber: "PPAP-2026-003", requestDate: "2026-03-05", supplierName: "(주)삼성전자부품", partNumber: "PT-10003", partName: "PCB ASSY", submissionLevel: "Level 5", approvalStatus: "승인", approvalDate: "2026-03-20" },
    { id: 4, requestNumber: "PPAP-2026-004", requestDate: "2026-04-01", supplierName: "(주)코리아테크", partNumber: "PT-10004", partName: "하우징 LWR", submissionLevel: "Level 3", approvalStatus: "반려", approvalDate: "2026-04-15" },
    { id: 5, requestNumber: "PPAP-2026-005", requestDate: "2026-05-10", supplierName: "(주)한진물류", partNumber: "PT-10005", partName: "프레임 ASSY", submissionLevel: "Level 2", approvalStatus: "검토중", approvalDate: "" },
  ]);

  // Update PPAP element
  const updatePPAPElement = (id: number, field: keyof PPAPElement, value: string) => {
    setPPAPElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, [field]: value } : element
      )
    );
  };

  // Calculate submission statistics
  const submissionStats = {
    total: ppapElements.length,
    submitted: ppapElements.filter((e) => e.submissionStatus === "제출").length,
    notSubmitted: ppapElements.filter((e) => e.submissionStatus === "미제출").length,
    notApplicable: ppapElements.filter((e) => e.submissionStatus === "해당없음").length,
    conforming: ppapElements.filter((e) => e.conformityStatus === "적합").length,
    nonConforming: ppapElements.filter((e) => e.conformityStatus === "부적합").length,
  };

  // Save handler
  const handleSave = () => {
    const ppapData = {
      ppapRequest,
      ppapElements,
      approvalInfo,
    };
    console.log("Saving PPAP data:", ppapData);
    alert("PPAP 데이터가 저장되었습니다.");
  };

  // Request resubmission handler
  const handleResubmissionRequest = () => {
    setApprovalInfo((prev) => ({
      ...prev,
      resubmissionRequested: true,
    }));
    alert("재제출이 요청되었습니다.");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공급자 PPAP</h1>
          <p className="text-muted-foreground">Production Part Approval Process (양산부품 승인 프로세스)</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="request">
            <Send className="mr-2 h-4 w-4" />
            PPAP 요청
          </TabsTrigger>
          <TabsTrigger value="documents">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            제출 서류 확인
          </TabsTrigger>
          <TabsTrigger value="approval">
            <Award className="mr-2 h-4 w-4" />
            승인 현황
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            PPAP 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: PPAP Request */}
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PPAP 요청 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request Info */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>요청번호 *</Label>
                  <Input
                    value={ppapRequest.requestNumber}
                    onChange={(e) => setPPAPRequest({ ...ppapRequest, requestNumber: e.target.value })}
                    placeholder="PPAP-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>요청일 *</Label>
                  <Input
                    type="date"
                    value={ppapRequest.requestDate}
                    onChange={(e) => setPPAPRequest({ ...ppapRequest, requestDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>제출 기한 *</Label>
                  <Input
                    type="date"
                    value={ppapRequest.dueDate}
                    onChange={(e) => setPPAPRequest({ ...ppapRequest, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Supplier Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">공급업체 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>공급업체명 *</Label>
                    <Input
                      value={ppapRequest.supplierName}
                      onChange={(e) => setPPAPRequest({ ...ppapRequest, supplierName: e.target.value })}
                      placeholder="(주)우수금속"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공급업체 코드</Label>
                    <Input
                      value={ppapRequest.supplierCode}
                      onChange={(e) => setPPAPRequest({ ...ppapRequest, supplierCode: e.target.value })}
                      placeholder="SUP-001"
                    />
                  </div>
                </div>
              </div>

              {/* Part Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">부품 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Input
                      value={ppapRequest.partNumber}
                      onChange={(e) => setPPAPRequest({ ...ppapRequest, partNumber: e.target.value })}
                      placeholder="PT-10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품명 *</Label>
                    <Input
                      value={ppapRequest.partName}
                      onChange={(e) => setPPAPRequest({ ...ppapRequest, partName: e.target.value })}
                      placeholder="브라켓 ASSY"
                    />
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">요청 상세</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>요청사유 *</Label>
                    <Select
                      value={ppapRequest.requestReason}
                      onValueChange={(v) => setPPAPRequest({ ...ppapRequest, requestReason: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="신규">신규 (New Part)</SelectItem>
                        <SelectItem value="설변">설계변경 (Engineering Change)</SelectItem>
                        <SelectItem value="정기갱신">정기갱신 (Annual Re-validation)</SelectItem>
                        <SelectItem value="공정변경">공정변경 (Process Change)</SelectItem>
                        <SelectItem value="공급업체변경">공급업체 변경 (Supplier Change)</SelectItem>
                        <SelectItem value="재료변경">재료변경 (Material Change)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>제출 레벨 *</Label>
                    <Select
                      value={ppapRequest.submissionLevel}
                      onValueChange={(v) => setPPAPRequest({ ...ppapRequest, submissionLevel: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Level 1">Level 1 - PSW만 제출</SelectItem>
                        <SelectItem value="Level 2">Level 2 - PSW + 샘플 + 제한적 데이터</SelectItem>
                        <SelectItem value="Level 3">Level 3 - PSW + 샘플 + 완전 데이터</SelectItem>
                        <SelectItem value="Level 4">Level 4 - PSW + 고객 요구사항</SelectItem>
                        <SelectItem value="Level 5">Level 5 - PSW + 샘플 + 전체 데이터 (현장 검토)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Requester Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">요청자 정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>요청자명</Label>
                    <Input
                      value={ppapRequest.requesterName}
                      onChange={(e) => setPPAPRequest({ ...ppapRequest, requesterName: e.target.value })}
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>요청부서</Label>
                    <Input
                      value={ppapRequest.requesterDept}
                      onChange={(e) => setPPAPRequest({ ...ppapRequest, requesterDept: e.target.value })}
                      placeholder="품질보증팀"
                    />
                  </div>
                </div>
              </div>

              {/* Submission Level Guide */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">제출 레벨 가이드 (AIAG PPAP Manual)</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Level 1:</strong> 부품제출 보증서(PSW)만 고객에게 제출</div>
                  <div><strong>Level 2:</strong> PSW와 제품 샘플, 제한적인 지원 데이터 제출</div>
                  <div><strong>Level 3:</strong> PSW와 제품 샘플, 완전한 지원 데이터 제출 (기본 레벨)</div>
                  <div><strong>Level 4:</strong> PSW와 고객이 정의한 기타 요구사항 제출</div>
                  <div><strong>Level 5:</strong> PSW와 제품 샘플, 완전한 지원 데이터를 공급자 제조현장에서 검토</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Document Verification */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                PPAP 18개 요소 체크리스트
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Checklist Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>요소명 (Element)</TableHead>
                    <TableHead className="w-32">제출현황</TableHead>
                    <TableHead className="w-32">적합여부</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ppapElements.map((element) => (
                    <TableRow key={element.id}>
                      <TableCell className="font-mono">{element.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{element.nameKr}</div>
                          <div className="text-sm text-muted-foreground">{element.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={element.submissionStatus}
                          onValueChange={(v) => updatePPAPElement(element.id, "submissionStatus", v)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="제출">제출</SelectItem>
                            <SelectItem value="미제출">미제출</SelectItem>
                            <SelectItem value="해당없음">해당없음</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={element.conformityStatus}
                          onValueChange={(v) => updatePPAPElement(element.id, "conformityStatus", v)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="적합">적합</SelectItem>
                            <SelectItem value="부적합">부적합</SelectItem>
                            <SelectItem value="N/A">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={element.remarks}
                          onChange={(e) => updatePPAPElement(element.id, "remarks", e.target.value)}
                          placeholder="비고"
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Submission Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-4">제출 현황 요약</h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold">{submissionStats.total}</div>
                    <div className="text-sm text-muted-foreground">전체 요소</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{submissionStats.submitted}</div>
                    <div className="text-sm text-muted-foreground">제출</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{submissionStats.notSubmitted}</div>
                    <div className="text-sm text-muted-foreground">미제출</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{submissionStats.notApplicable}</div>
                    <div className="text-sm text-muted-foreground">해당없음</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{submissionStats.conforming}</div>
                    <div className="text-sm text-muted-foreground">적합</div>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{submissionStats.nonConforming}</div>
                    <div className="text-sm text-muted-foreground">부적합</div>
                  </div>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className={getSubmissionBadgeClass("제출")}>제출</Badge>
                  <span>서류 제출 완료</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSubmissionBadgeClass("미제출")}>미제출</Badge>
                  <span>서류 미제출</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSubmissionBadgeClass("해당없음")}>해당없음</Badge>
                  <span>해당 요소 적용 제외</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Approval Status */}
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                승인 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Approval Status Selection */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>승인 상태 *</Label>
                  <Select
                    value={approvalInfo.approvalStatus}
                    onValueChange={(v) => setApprovalInfo({ ...approvalInfo, approvalStatus: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="승인">승인 (Approved)</SelectItem>
                      <SelectItem value="조건부승인">조건부승인 (Interim Approval)</SelectItem>
                      <SelectItem value="반려">반려 (Rejected)</SelectItem>
                      <SelectItem value="검토중">검토중 (Under Review)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>승인일자</Label>
                  <Input
                    type="date"
                    value={approvalInfo.approvalDate}
                    onChange={(e) => setApprovalInfo({ ...approvalInfo, approvalDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인자</Label>
                  <Input
                    value={approvalInfo.approverName}
                    onChange={(e) => setApprovalInfo({ ...approvalInfo, approverName: e.target.value })}
                    placeholder="김철수 (품질보증팀장)"
                  />
                </div>
              </div>

              {/* Approval Status Display */}
              {approvalInfo.approvalStatus && (
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">현재 승인 상태</span>
                    <Badge className={`text-lg px-4 py-1 ${getApprovalBadgeClass(approvalInfo.approvalStatus)}`}>
                      {approvalInfo.approvalStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {approvalInfo.approvalStatus === "승인" && "PPAP가 완전히 승인되었습니다. 양산을 시작할 수 있습니다."}
                    {approvalInfo.approvalStatus === "조건부승인" && "조건부로 승인되었습니다. 지정된 기간 내에 미비사항을 보완해야 합니다."}
                    {approvalInfo.approvalStatus === "반려" && "PPAP가 반려되었습니다. 아래 반려 사유를 확인하고 재제출하십시오."}
                    {approvalInfo.approvalStatus === "검토중" && "PPAP 서류 검토가 진행 중입니다."}
                  </div>
                </div>
              )}

              {/* Rejection Reason (shown when rejected) */}
              {(approvalInfo.approvalStatus === "반려" || approvalInfo.approvalStatus === "조건부승인") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>반려 사유 / 조건부 승인 조건</Label>
                    <Textarea
                      value={approvalInfo.rejectionReason}
                      onChange={(e) => setApprovalInfo({ ...approvalInfo, rejectionReason: e.target.value })}
                      placeholder="반려 사유 또는 조건부 승인 조건을 입력하세요."
                      rows={4}
                    />
                  </div>

                  {/* Resubmission Request */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">재제출 요청</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>재제출 기한</Label>
                        <Input
                          type="date"
                          value={approvalInfo.resubmissionDueDate}
                          onChange={(e) => setApprovalInfo({ ...approvalInfo, resubmissionDueDate: e.target.value })}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleResubmissionRequest}
                          variant={approvalInfo.resubmissionRequested ? "secondary" : "default"}
                          disabled={approvalInfo.resubmissionRequested}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {approvalInfo.resubmissionRequested ? "재제출 요청됨" : "재제출 요청"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="space-y-2">
                <Label>검토 의견</Label>
                <Textarea
                  value={approvalInfo.comments}
                  onChange={(e) => setApprovalInfo({ ...approvalInfo, comments: e.target.value })}
                  placeholder="검토 의견을 입력하세요."
                  rows={4}
                />
              </div>

              {/* Approval Criteria Guide */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">승인 상태 기준</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className={getApprovalBadgeClass("승인")}>승인</Badge>
                    <span>모든 PPAP 요소가 고객 요구사항을 충족하며, 양산 출하가 가능한 상태</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className={getApprovalBadgeClass("조건부승인")}>조건부승인</Badge>
                    <span>제한된 기간/수량으로 출하 가능. 지정 기간 내 미비사항 보완 필요</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className={getApprovalBadgeClass("반려")}>반려</Badge>
                    <span>PPAP 요구사항 미충족. 시정조치 후 재제출 필요</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className={getApprovalBadgeClass("검토중")}>검토중</Badge>
                    <span>제출된 서류 검토가 진행 중인 상태</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: PPAP History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                PPAP 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>요청번호</TableHead>
                    <TableHead>요청일</TableHead>
                    <TableHead>공급업체명</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>제출 레벨</TableHead>
                    <TableHead>승인상태</TableHead>
                    <TableHead>승인일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono">{record.requestNumber}</TableCell>
                      <TableCell>{record.requestDate}</TableCell>
                      <TableCell className="font-medium">{record.supplierName}</TableCell>
                      <TableCell className="font-mono">{record.partNumber}</TableCell>
                      <TableCell>{record.partName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.submissionLevel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getApprovalBadgeClass(record.approvalStatus)}>
                          {record.approvalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.approvalDate || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* History Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">PPAP 현황 요약</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">총 건수: </span>
                    <span className="font-medium">{history.length}건</span>
                  </div>
                  <div>
                    <span className="text-green-600">승인: </span>
                    <span className="font-medium">{history.filter((h) => h.approvalStatus === "승인").length}건</span>
                  </div>
                  <div>
                    <span className="text-yellow-600">조건부승인: </span>
                    <span className="font-medium">{history.filter((h) => h.approvalStatus === "조건부승인").length}건</span>
                  </div>
                  <div>
                    <span className="text-red-600">반려: </span>
                    <span className="font-medium">{history.filter((h) => h.approvalStatus === "반려").length}건</span>
                  </div>
                  <div>
                    <span className="text-blue-600">검토중: </span>
                    <span className="font-medium">{history.filter((h) => h.approvalStatus === "검토중").length}건</span>
                  </div>
                </div>
              </div>

              {/* Level Distribution */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">제출 레벨별 현황</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  {["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"].map((level) => (
                    <div key={level}>
                      <span className="text-muted-foreground">{level}: </span>
                      <span className="font-medium">{history.filter((h) => h.submissionLevel === level).length}건</span>
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
