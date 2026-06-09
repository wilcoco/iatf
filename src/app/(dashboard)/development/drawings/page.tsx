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
import { Plus, Save, FileText, Users, History, List, Search, Trash2 } from "lucide-react";

// ==================== Types ====================
interface Drawing {
  id: string;
  drawingNo: string;       // 도면번호
  partNo: string;          // 품번
  partName: string;        // 품명
  revisionNo: string;      // 개정번호
  revisionDate: string;    // 개정일
  revisionContent: string; // 개정내용
  distributor: string;     // 배포처
  retrievalDate: string;   // 회수일
  createdAt: string;
}

interface Distribution {
  id: string;
  drawingId: string;
  drawingNo: string;
  recipient: string;       // 수령자
  department: string;      // 부서/협력사
  distributionDate: string; // 배포일
  signature: string;       // 서명
  copies: number;          // 배포부수
  returnStatus: "distributed" | "returned" | "pending";
  returnDate: string;
}

interface RevisionHistory {
  id: string;
  drawingId: string;
  drawingNo: string;
  revisionNo: string;      // 개정번호
  revisionDate: string;    // 개정일
  changes: string;         // 변경내용
  reason: string;          // 개정사유
  approver: string;        // 승인자
  previousRevision: string;
}

// ==================== Initial Data ====================
const initialDrawings: Drawing[] = [
  {
    id: "drw-1",
    drawingNo: "DWG-2024-001",
    partNo: "PN-001",
    partName: "메인 하우징",
    revisionNo: "A",
    revisionDate: "2024-01-15",
    revisionContent: "초도 작성",
    distributor: "A 협력사",
    retrievalDate: "",
    createdAt: "2024-01-15",
  },
  {
    id: "drw-2",
    drawingNo: "DWG-2024-002",
    partNo: "PN-002",
    partName: "커버 어셈블리",
    revisionNo: "B",
    revisionDate: "2024-02-20",
    revisionContent: "치수 변경",
    distributor: "B 협력사",
    retrievalDate: "2024-03-01",
    createdAt: "2024-01-20",
  },
];

const initialDistributions: Distribution[] = [
  {
    id: "dist-1",
    drawingId: "drw-1",
    drawingNo: "DWG-2024-001",
    recipient: "김철수",
    department: "A 협력사",
    distributionDate: "2024-01-16",
    signature: "김철수",
    copies: 2,
    returnStatus: "distributed",
    returnDate: "",
  },
];

const initialRevisions: RevisionHistory[] = [
  {
    id: "rev-1",
    drawingId: "drw-2",
    drawingNo: "DWG-2024-002",
    revisionNo: "B",
    revisionDate: "2024-02-20",
    changes: "외형 치수 30mm -> 35mm 변경",
    reason: "고객 요청",
    approver: "이영희",
    previousRevision: "A",
  },
];

// ==================== Main Component ====================
export default function DrawingManagementPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // State
  const [drawings, setDrawings] = useState<Drawing[]>(initialDrawings);
  const [distributions, setDistributions] = useState<Distribution[]>(initialDistributions);
  const [revisions, setRevisions] = useState<RevisionHistory[]>(initialRevisions);

  // Form States
  const [showDrawingForm, setShowDrawingForm] = useState(false);
  const [showDistributionForm, setShowDistributionForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  // Search/Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPartNo, setFilterPartNo] = useState("");

  // Form Data States
  const [drawingFormData, setDrawingFormData] = useState<Omit<Drawing, "id" | "createdAt">>({
    drawingNo: "",
    partNo: "",
    partName: "",
    revisionNo: "",
    revisionDate: new Date().toISOString().split("T")[0],
    revisionContent: "",
    distributor: "",
    retrievalDate: "",
  });

  const [distributionFormData, setDistributionFormData] = useState<Omit<Distribution, "id">>({
    drawingId: "",
    drawingNo: "",
    recipient: "",
    department: "",
    distributionDate: new Date().toISOString().split("T")[0],
    signature: "",
    copies: 1,
    returnStatus: "distributed",
    returnDate: "",
  });

  const [revisionFormData, setRevisionFormData] = useState<Omit<RevisionHistory, "id">>({
    drawingId: "",
    drawingNo: "",
    revisionNo: "",
    revisionDate: new Date().toISOString().split("T")[0],
    changes: "",
    reason: "",
    approver: "",
    previousRevision: "",
  });

  // ==================== Status Helpers ====================
  const returnStatusLabels: Record<string, string> = {
    distributed: "배포됨",
    returned: "회수됨",
    pending: "회수대기",
  };

  const returnStatusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    distributed: "default",
    returned: "success",
    pending: "warning",
  };

  // ==================== Handlers ====================
  const handleAddDrawing = (e: React.FormEvent) => {
    e.preventDefault();
    const newDrawing: Drawing = {
      id: `drw-${Date.now()}`,
      ...drawingFormData,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDrawings([newDrawing, ...drawings]);
    setShowDrawingForm(false);
    setDrawingFormData({
      drawingNo: "",
      partNo: "",
      partName: "",
      revisionNo: "",
      revisionDate: new Date().toISOString().split("T")[0],
      revisionContent: "",
      distributor: "",
      retrievalDate: "",
    });
    alert("도면이 등록되었습니다.");
  };

  const handleAddDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    const newDistribution: Distribution = {
      id: `dist-${Date.now()}`,
      ...distributionFormData,
    };
    setDistributions([newDistribution, ...distributions]);
    setShowDistributionForm(false);
    setDistributionFormData({
      drawingId: "",
      drawingNo: "",
      recipient: "",
      department: "",
      distributionDate: new Date().toISOString().split("T")[0],
      signature: "",
      copies: 1,
      returnStatus: "distributed",
      returnDate: "",
    });
    alert("배포 정보가 등록되었습니다.");
  };

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const newRevision: RevisionHistory = {
      id: `rev-${Date.now()}`,
      ...revisionFormData,
    };
    setRevisions([newRevision, ...revisions]);
    setShowRevisionForm(false);
    setRevisionFormData({
      drawingId: "",
      drawingNo: "",
      revisionNo: "",
      revisionDate: new Date().toISOString().split("T")[0],
      changes: "",
      reason: "",
      approver: "",
      previousRevision: "",
    });
    alert("개정 이력이 등록되었습니다.");
  };

  const handleDeleteDrawing = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setDrawings(drawings.filter((d) => d.id !== id));
    }
  };

  const handleDrawingSelect = (drawingNo: string) => {
    const drawing = drawings.find((d) => d.drawingNo === drawingNo);
    if (drawing) {
      setDistributionFormData({
        ...distributionFormData,
        drawingId: drawing.id,
        drawingNo: drawing.drawingNo,
      });
    }
  };

  const handleRevisionDrawingSelect = (drawingNo: string) => {
    const drawing = drawings.find((d) => d.drawingNo === drawingNo);
    if (drawing) {
      setRevisionFormData({
        ...revisionFormData,
        drawingId: drawing.id,
        drawingNo: drawing.drawingNo,
        previousRevision: drawing.revisionNo,
      });
    }
  };

  // ==================== Filtered Data ====================
  const filteredDrawings = drawings.filter((d) => {
    const matchesSearch =
      searchTerm === "" ||
      d.drawingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.partNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPartNo === "" || d.partNo === filterPartNo;
    return matchesSearch && matchesFilter;
  });

  const uniquePartNos = Array.from(new Set(drawings.map((d) => d.partNo)));

  // ==================== Render ====================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">도면관리</h1>
          <p className="text-muted-foreground">Drawing Management - 도면 등록, 배포 및 개정이력 관리</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            도면 등록
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <Users className="mr-2 h-4 w-4" />
            배포 관리
          </TabsTrigger>
          <TabsTrigger value="revision">
            <History className="mr-2 h-4 w-4" />
            개정 이력
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            도면 목록
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 도면 등록 */}
        <TabsContent value="registration">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                도면 등록
              </CardTitle>
              <Button onClick={() => setShowDrawingForm(!showDrawingForm)}>
                <Plus className="mr-2 h-4 w-4" />
                도면 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showDrawingForm && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">새 도면 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddDrawing} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>도면번호 *</Label>
                          <Input
                            value={drawingFormData.drawingNo}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, drawingNo: e.target.value })
                            }
                            placeholder="DWG-2024-001"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품번 *</Label>
                          <Input
                            value={drawingFormData.partNo}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, partNo: e.target.value })
                            }
                            placeholder="PN-001"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>품명 *</Label>
                          <Input
                            value={drawingFormData.partName}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, partName: e.target.value })
                            }
                            placeholder="부품명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>개정번호 *</Label>
                          <Input
                            value={drawingFormData.revisionNo}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, revisionNo: e.target.value })
                            }
                            placeholder="A"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>개정일 *</Label>
                          <Input
                            type="date"
                            value={drawingFormData.revisionDate}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, revisionDate: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>배포처</Label>
                          <Input
                            value={drawingFormData.distributor}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, distributor: e.target.value })
                            }
                            placeholder="협력사/부서명"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>회수일</Label>
                          <Input
                            type="date"
                            value={drawingFormData.retrievalDate}
                            onChange={(e) =>
                              setDrawingFormData({ ...drawingFormData, retrievalDate: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>개정내용</Label>
                        <Textarea
                          value={drawingFormData.revisionContent}
                          onChange={(e) =>
                            setDrawingFormData({ ...drawingFormData, revisionContent: e.target.value })
                          }
                          placeholder="개정 내용을 입력하세요..."
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setShowDrawingForm(false)}>
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

              {/* Drawing List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>도면번호</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>개정번호</TableHead>
                    <TableHead>개정일</TableHead>
                    <TableHead>개정내용</TableHead>
                    <TableHead>배포처</TableHead>
                    <TableHead>회수일</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drawings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        등록된 도면이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    drawings.map((drawing) => (
                      <TableRow key={drawing.id}>
                        <TableCell className="font-mono">{drawing.drawingNo}</TableCell>
                        <TableCell>{drawing.partNo}</TableCell>
                        <TableCell>{drawing.partName}</TableCell>
                        <TableCell>
                          <Badge variant="default">{drawing.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{drawing.revisionDate}</TableCell>
                        <TableCell className="max-w-xs truncate">{drawing.revisionContent}</TableCell>
                        <TableCell>{drawing.distributor || "-"}</TableCell>
                        <TableCell>{drawing.retrievalDate || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDrawing(drawing.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 배포 관리 */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                배포 관리
              </CardTitle>
              <Button onClick={() => setShowDistributionForm(!showDistributionForm)}>
                <Plus className="mr-2 h-4 w-4" />
                배포 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showDistributionForm && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">새 배포 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddDistribution} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>도면번호 *</Label>
                          <Select
                            value={distributionFormData.drawingNo}
                            onValueChange={handleDrawingSelect}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="도면 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {drawings.map((d) => (
                                <SelectItem key={d.id} value={d.drawingNo}>
                                  {d.drawingNo} - {d.partName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>수령자 *</Label>
                          <Input
                            value={distributionFormData.recipient}
                            onChange={(e) =>
                              setDistributionFormData({ ...distributionFormData, recipient: e.target.value })
                            }
                            placeholder="수령자명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>부서/협력사 *</Label>
                          <Input
                            value={distributionFormData.department}
                            onChange={(e) =>
                              setDistributionFormData({ ...distributionFormData, department: e.target.value })
                            }
                            placeholder="부서 또는 협력사명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>배포일 *</Label>
                          <Input
                            type="date"
                            value={distributionFormData.distributionDate}
                            onChange={(e) =>
                              setDistributionFormData({
                                ...distributionFormData,
                                distributionDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>서명/확인 *</Label>
                          <Input
                            value={distributionFormData.signature}
                            onChange={(e) =>
                              setDistributionFormData({ ...distributionFormData, signature: e.target.value })
                            }
                            placeholder="서명자명"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>배포부수</Label>
                          <Input
                            type="number"
                            min={1}
                            value={distributionFormData.copies}
                            onChange={(e) =>
                              setDistributionFormData({
                                ...distributionFormData,
                                copies: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>회수상태</Label>
                          <Select
                            value={distributionFormData.returnStatus}
                            onValueChange={(v) =>
                              setDistributionFormData({
                                ...distributionFormData,
                                returnStatus: v as Distribution["returnStatus"],
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="distributed">배포됨</SelectItem>
                              <SelectItem value="returned">회수됨</SelectItem>
                              <SelectItem value="pending">회수대기</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>회수일</Label>
                          <Input
                            type="date"
                            value={distributionFormData.returnDate}
                            onChange={(e) =>
                              setDistributionFormData({ ...distributionFormData, returnDate: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowDistributionForm(false)}
                        >
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

              {/* Distribution List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>도면번호</TableHead>
                    <TableHead>수령자</TableHead>
                    <TableHead>부서/협력사</TableHead>
                    <TableHead>배포일</TableHead>
                    <TableHead>서명</TableHead>
                    <TableHead>배포부수</TableHead>
                    <TableHead>회수상태</TableHead>
                    <TableHead>회수일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        배포 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    distributions.map((dist) => (
                      <TableRow key={dist.id}>
                        <TableCell className="font-mono">{dist.drawingNo}</TableCell>
                        <TableCell>{dist.recipient}</TableCell>
                        <TableCell>{dist.department}</TableCell>
                        <TableCell>{dist.distributionDate}</TableCell>
                        <TableCell>{dist.signature}</TableCell>
                        <TableCell>{dist.copies}</TableCell>
                        <TableCell>
                          <Badge variant={returnStatusVariants[dist.returnStatus]}>
                            {returnStatusLabels[dist.returnStatus]}
                          </Badge>
                        </TableCell>
                        <TableCell>{dist.returnDate || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 개정 이력 */}
        <TabsContent value="revision">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                개정 이력
              </CardTitle>
              <Button onClick={() => setShowRevisionForm(!showRevisionForm)}>
                <Plus className="mr-2 h-4 w-4" />
                개정 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {showRevisionForm && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">새 개정 이력 등록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddRevision} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>도면번호 *</Label>
                          <Select
                            value={revisionFormData.drawingNo}
                            onValueChange={handleRevisionDrawingSelect}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="도면 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {drawings.map((d) => (
                                <SelectItem key={d.id} value={d.drawingNo}>
                                  {d.drawingNo} - {d.partName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>이전 개정번호</Label>
                          <Input value={revisionFormData.previousRevision} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>새 개정번호 *</Label>
                          <Input
                            value={revisionFormData.revisionNo}
                            onChange={(e) =>
                              setRevisionFormData({ ...revisionFormData, revisionNo: e.target.value })
                            }
                            placeholder="B"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>개정일 *</Label>
                          <Input
                            type="date"
                            value={revisionFormData.revisionDate}
                            onChange={(e) =>
                              setRevisionFormData({ ...revisionFormData, revisionDate: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>변경내용 *</Label>
                          <Textarea
                            value={revisionFormData.changes}
                            onChange={(e) =>
                              setRevisionFormData({ ...revisionFormData, changes: e.target.value })
                            }
                            placeholder="변경된 내용을 상세히 입력하세요..."
                            rows={3}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>개정사유 *</Label>
                          <Textarea
                            value={revisionFormData.reason}
                            onChange={(e) =>
                              setRevisionFormData({ ...revisionFormData, reason: e.target.value })
                            }
                            placeholder="개정 사유를 입력하세요..."
                            rows={3}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label>승인자 *</Label>
                          <Input
                            value={revisionFormData.approver}
                            onChange={(e) =>
                              setRevisionFormData({ ...revisionFormData, approver: e.target.value })
                            }
                            placeholder="승인자명"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => setShowRevisionForm(false)}>
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

              {/* Revision History List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>도면번호</TableHead>
                    <TableHead>이전 개정</TableHead>
                    <TableHead>새 개정</TableHead>
                    <TableHead>개정일</TableHead>
                    <TableHead>변경내용</TableHead>
                    <TableHead>개정사유</TableHead>
                    <TableHead>승인자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revisions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        개정 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    revisions.map((rev) => (
                      <TableRow key={rev.id}>
                        <TableCell className="font-mono">{rev.drawingNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{rev.previousRevision}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{rev.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{rev.revisionDate}</TableCell>
                        <TableCell className="max-w-xs truncate">{rev.changes}</TableCell>
                        <TableCell className="max-w-xs truncate">{rev.reason}</TableCell>
                        <TableCell>{rev.approver}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 도면 목록 */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                도면 목록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="도면번호, 품명, 품번 검색..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Select value={filterPartNo} onValueChange={setFilterPartNo}>
                    <SelectTrigger>
                      <SelectValue placeholder="품번 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      {uniquePartNos.map((pn) => (
                        <SelectItem key={pn} value={pn}>
                          {pn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterPartNo("");
                  }}
                >
                  초기화
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{drawings.length}</p>
                      <p className="text-sm text-muted-foreground">전체 도면</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{distributions.length}</p>
                      <p className="text-sm text-muted-foreground">배포 건수</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{revisions.length}</p>
                      <p className="text-sm text-muted-foreground">개정 이력</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {distributions.filter((d) => d.returnStatus === "pending").length}
                      </p>
                      <p className="text-sm text-muted-foreground">회수 대기</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filtered Drawing List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>도면번호</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>개정번호</TableHead>
                    <TableHead>개정일</TableHead>
                    <TableHead>개정내용</TableHead>
                    <TableHead>배포처</TableHead>
                    <TableHead>회수일</TableHead>
                    <TableHead>등록일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrawings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        {searchTerm || filterPartNo
                          ? "검색 결과가 없습니다."
                          : "등록된 도면이 없습니다."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrawings.map((drawing) => (
                      <TableRow key={drawing.id}>
                        <TableCell className="font-mono">{drawing.drawingNo}</TableCell>
                        <TableCell>{drawing.partNo}</TableCell>
                        <TableCell>{drawing.partName}</TableCell>
                        <TableCell>
                          <Badge variant="default">{drawing.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{drawing.revisionDate}</TableCell>
                        <TableCell className="max-w-xs truncate">{drawing.revisionContent}</TableCell>
                        <TableCell>{drawing.distributor || "-"}</TableCell>
                        <TableCell>{drawing.retrievalDate || "-"}</TableCell>
                        <TableCell>{drawing.createdAt}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Result Count */}
              <div className="text-sm text-muted-foreground">
                검색 결과: {filteredDrawings.length}건 / 전체 {drawings.length}건
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
