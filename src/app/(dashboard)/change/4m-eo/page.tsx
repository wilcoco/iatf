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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, RefreshCw, FileText, CheckCircle, Clock, History } from "lucide-react";

interface RelatedDocument {
  id: number;
  documentName: string;
  changeRequired: boolean;
}

interface ChangeHistory {
  id: number;
  date: string;
  action: string;
  actor: string;
  details: string;
}

interface FourMChangeRequest {
  // Header
  changeNo: string;
  requestDate: string;
  requestDepartment: string;
  requester: string;
  urgency: "high" | "medium" | "low";

  // Change details
  changeType: "man" | "machine" | "material" | "method";
  changeItem: string;
  beforeChange: string;
  afterChange: string;
  changeReason: string;

  // Impact assessment
  qualityImpact: "high" | "medium" | "low";
  customerNotificationRequired: boolean;
  relatedDocuments: RelatedDocument[];

  // Approval
  reviewer: string;
  reviewDate: string;
  reviewComment: string;
  approver: string;
  approvalDate: string;
  approvalResult: "approved" | "rejected" | "pending";

  // Implementation
  implementationDate: string;
  implementationResult: string;
  verifier: string;

  // History
  history: ChangeHistory[];

  // Status
  status: "draft" | "requested" | "reviewing" | "approved" | "rejected" | "implemented";
}

const initialFormData: FourMChangeRequest = {
  changeNo: "",
  requestDate: new Date().toISOString().split("T")[0],
  requestDepartment: "",
  requester: "",
  urgency: "medium",
  changeType: "man",
  changeItem: "",
  beforeChange: "",
  afterChange: "",
  changeReason: "",
  qualityImpact: "medium",
  customerNotificationRequired: false,
  relatedDocuments: [],
  reviewer: "",
  reviewDate: "",
  reviewComment: "",
  approver: "",
  approvalDate: "",
  approvalResult: "pending",
  implementationDate: "",
  implementationResult: "",
  verifier: "",
  history: [],
  status: "draft",
};

export default function FourMEOChangePage() {
  const [activeTab, setActiveTab] = useState("request");
  const [items, setItems] = useState<FourMChangeRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FourMChangeRequest>(initialFormData);
  const [newDocument, setNewDocument] = useState({ documentName: "", changeRequired: false });

  const changeTypeLabels: Record<string, string> = {
    man: "Man (인원)",
    machine: "Machine (설비)",
    material: "Material (자재)",
    method: "Method (방법)",
  };

  const urgencyLabels: Record<string, string> = {
    high: "긴급",
    medium: "보통",
    low: "일반",
  };

  const urgencyVariants: Record<string, "destructive" | "warning" | "default"> = {
    high: "destructive",
    medium: "warning",
    low: "default",
  };

  const impactLabels: Record<string, string> = {
    high: "상",
    medium: "중",
    low: "하",
  };

  const statusLabels: Record<string, string> = {
    draft: "작성중",
    requested: "신청완료",
    reviewing: "검토중",
    approved: "승인",
    rejected: "반려",
    implemented: "이행완료",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    draft: "default",
    requested: "warning",
    reviewing: "warning",
    approved: "success",
    rejected: "destructive",
    implemented: "success",
  };

  const approvalResultLabels: Record<string, string> = {
    approved: "승인",
    rejected: "반려",
    pending: "대기",
  };

  const handleAddDocument = () => {
    if (newDocument.documentName.trim()) {
      setFormData({
        ...formData,
        relatedDocuments: [
          ...formData.relatedDocuments,
          { id: Date.now(), ...newDocument },
        ],
      });
      setNewDocument({ documentName: "", changeRequired: false });
    }
  };

  const handleRemoveDocument = (id: number) => {
    setFormData({
      ...formData,
      relatedDocuments: formData.relatedDocuments.filter((doc) => doc.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newItem: FourMChangeRequest = {
      ...formData,
      changeNo: formData.changeNo || `4M-${new Date().getFullYear()}-${String(items.length + 1).padStart(3, "0")}`,
      status: "requested",
      history: [
        {
          id: Date.now(),
          date: now,
          action: "변경신청",
          actor: formData.requester,
          details: "변경 신청이 등록되었습니다.",
        },
      ],
    };
    setItems([newItem, ...items]);
    setShowForm(false);
    setFormData(initialFormData);
    alert("4M 변경 신청이 등록되었습니다.");
  };

  const generateChangeNo = () => {
    const year = new Date().getFullYear();
    const seq = String(items.length + 1).padStart(3, "0");
    setFormData({ ...formData, changeNo: `4M-${year}-${seq}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">4M 변경관리</h1>
          <p className="text-muted-foreground">4M 변경관리 (Man, Machine, Material, Method)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          변경 신청
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>4M 변경 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="request">
                  <FileText className="mr-2 h-4 w-4" />
                  변경 신청
                </TabsTrigger>
                <TabsTrigger value="impact">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  영향 평가
                </TabsTrigger>
                <TabsTrigger value="approval">
                  <Clock className="mr-2 h-4 w-4" />
                  승인 및 이행
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="mr-2 h-4 w-4" />
                  변경 이력
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                {/* Tab 1: Change Request */}
                <TabsContent value="request" className="space-y-6 mt-6">
                  {/* Header Section */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">기본정보</h3>
                    <div className="grid gap-4 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>변경번호 *</Label>
                        <div className="flex gap-2">
                          <Input
                            value={formData.changeNo}
                            onChange={(e) => setFormData({ ...formData, changeNo: e.target.value })}
                            placeholder="4M-2024-001"
                          />
                          <Button type="button" variant="outline" size="sm" onClick={generateChangeNo}>
                            자동
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>신청일 *</Label>
                        <Input
                          type="date"
                          value={formData.requestDate}
                          onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>신청부서 *</Label>
                        <Select
                          value={formData.requestDepartment}
                          onValueChange={(v) => setFormData({ ...formData, requestDepartment: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="production">생산부</SelectItem>
                            <SelectItem value="quality">품질부</SelectItem>
                            <SelectItem value="engineering">기술부</SelectItem>
                            <SelectItem value="purchase">구매부</SelectItem>
                            <SelectItem value="management">관리부</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>신청자 *</Label>
                        <Input
                          value={formData.requester}
                          onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                          placeholder="성명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>긴급도 *</Label>
                        <Select
                          value={formData.urgency}
                          onValueChange={(v) => setFormData({ ...formData, urgency: v as "high" | "medium" | "low" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">긴급</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="low">일반</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Change Details Section */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">변경내용</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>변경유형 *</Label>
                        <Select
                          value={formData.changeType}
                          onValueChange={(v) => setFormData({ ...formData, changeType: v as "man" | "machine" | "material" | "method" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="man">Man (인원)</SelectItem>
                            <SelectItem value="machine">Machine (설비)</SelectItem>
                            <SelectItem value="material">Material (자재)</SelectItem>
                            <SelectItem value="method">Method (방법)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>변경항목 *</Label>
                        <Input
                          value={formData.changeItem}
                          onChange={(e) => setFormData({ ...formData, changeItem: e.target.value })}
                          placeholder="변경 대상 항목"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>변경전 내용 *</Label>
                        <Textarea
                          value={formData.beforeChange}
                          onChange={(e) => setFormData({ ...formData, beforeChange: e.target.value })}
                          placeholder="변경 전 상태 상세 기술"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>변경후 내용 *</Label>
                        <Textarea
                          value={formData.afterChange}
                          onChange={(e) => setFormData({ ...formData, afterChange: e.target.value })}
                          placeholder="변경 후 상태 상세 기술"
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>변경사유 *</Label>
                      <Textarea
                        value={formData.changeReason}
                        onChange={(e) => setFormData({ ...formData, changeReason: e.target.value })}
                        placeholder="변경 사유 상세 기술"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("impact")}>
                      다음: 영향 평가
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 2: Impact Assessment */}
                <TabsContent value="impact" className="space-y-6 mt-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">영향평가</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>품질영향 *</Label>
                        <Select
                          value={formData.qualityImpact}
                          onValueChange={(v) => setFormData({ ...formData, qualityImpact: v as "high" | "medium" | "low" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">상 (High)</SelectItem>
                            <SelectItem value="medium">중 (Medium)</SelectItem>
                            <SelectItem value="low">하 (Low)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>고객통보 필요여부 *</Label>
                        <Select
                          value={formData.customerNotificationRequired ? "yes" : "no"}
                          onValueChange={(v) => setFormData({ ...formData, customerNotificationRequired: v === "yes" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">필요</SelectItem>
                            <SelectItem value="no">불필요</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">관련문서 변경목록</h3>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>문서명</Label>
                        <Input
                          value={newDocument.documentName}
                          onChange={(e) => setNewDocument({ ...newDocument, documentName: e.target.value })}
                          placeholder="관련 문서명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>변경필요</Label>
                        <Select
                          value={newDocument.changeRequired ? "yes" : "no"}
                          onValueChange={(v) => setNewDocument({ ...newDocument, changeRequired: v === "yes" })}
                        >
                          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">필요</SelectItem>
                            <SelectItem value="no">불필요</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="button" onClick={handleAddDocument}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.relatedDocuments.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>문서명</TableHead>
                            <TableHead>변경필요여부</TableHead>
                            <TableHead className="w-[80px]">삭제</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.relatedDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.documentName}</TableCell>
                              <TableCell>
                                <Badge variant={doc.changeRequired ? "warning" : "default"}>
                                  {doc.changeRequired ? "필요" : "불필요"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveDocument(doc.id)}
                                >
                                  삭제
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">등록된 관련문서가 없습니다.</p>
                    )}
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("request")}>
                      이전: 변경 신청
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setActiveTab("approval")}>
                      다음: 승인 및 이행
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 3: Approval and Implementation */}
                <TabsContent value="approval" className="space-y-6 mt-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">검토</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>검토자</Label>
                        <Input
                          value={formData.reviewer}
                          onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
                          placeholder="검토자 성명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검토일</Label>
                        <Input
                          type="date"
                          value={formData.reviewDate}
                          onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label>검토의견</Label>
                        <Textarea
                          value={formData.reviewComment}
                          onChange={(e) => setFormData({ ...formData, reviewComment: e.target.value })}
                          placeholder="검토 의견"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">승인</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>승인자</Label>
                        <Input
                          value={formData.approver}
                          onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                          placeholder="승인자 성명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>승인일</Label>
                        <Input
                          type="date"
                          value={formData.approvalDate}
                          onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>승인결과</Label>
                        <Select
                          value={formData.approvalResult}
                          onValueChange={(v) => setFormData({ ...formData, approvalResult: v as "approved" | "rejected" | "pending" })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">대기</SelectItem>
                            <SelectItem value="approved">승인</SelectItem>
                            <SelectItem value="rejected">반려</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">이행확인</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>이행일</Label>
                        <Input
                          type="date"
                          value={formData.implementationDate}
                          onChange={(e) => setFormData({ ...formData, implementationDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>확인자</Label>
                        <Input
                          value={formData.verifier}
                          onChange={(e) => setFormData({ ...formData, verifier: e.target.value })}
                          placeholder="확인자 성명"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label>이행결과</Label>
                        <Textarea
                          value={formData.implementationResult}
                          onChange={(e) => setFormData({ ...formData, implementationResult: e.target.value })}
                          placeholder="이행 결과 상세 기술"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("impact")}>
                      이전: 영향 평가
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setActiveTab("history")}>
                      다음: 변경 이력
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 4: Change History */}
                <TabsContent value="history" className="space-y-6 mt-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">변경 이력</h3>
                    {formData.history.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>일시</TableHead>
                            <TableHead>작업</TableHead>
                            <TableHead>수행자</TableHead>
                            <TableHead>상세내용</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.history.map((h) => (
                            <TableRow key={h.id}>
                              <TableCell>{new Date(h.date).toLocaleString("ko-KR")}</TableCell>
                              <TableCell><Badge variant="outline">{h.action}</Badge></TableCell>
                              <TableCell>{h.actor}</TableCell>
                              <TableCell>{h.details}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        신규 신청 건으로 변경 이력이 없습니다.<br />
                        등록 후 이력이 자동으로 기록됩니다.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between gap-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("approval")}>
                      이전: 승인 및 이행
                    </Button>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            4M 변경 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">4M 변경 이력이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>변경번호</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead>신청부서</TableHead>
                  <TableHead>신청자</TableHead>
                  <TableHead>긴급도</TableHead>
                  <TableHead>변경유형</TableHead>
                  <TableHead>변경항목</TableHead>
                  <TableHead>품질영향</TableHead>
                  <TableHead>고객통보</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{item.changeNo}</TableCell>
                    <TableCell>{item.requestDate}</TableCell>
                    <TableCell>{item.requestDepartment}</TableCell>
                    <TableCell>{item.requester}</TableCell>
                    <TableCell>
                      <Badge variant={urgencyVariants[item.urgency]}>
                        {urgencyLabels[item.urgency]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{changeTypeLabels[item.changeType]}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{item.changeItem}</TableCell>
                    <TableCell>
                      <Badge variant={item.qualityImpact === "high" ? "destructive" : item.qualityImpact === "medium" ? "warning" : "default"}>
                        {impactLabels[item.qualityImpact]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.customerNotificationRequired ? "warning" : "default"}>
                        {item.customerNotificationRequired ? "필요" : "불필요"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[item.status]}>
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
