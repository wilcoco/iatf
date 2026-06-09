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
  Search,
  FileText,
  CheckCircle,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Plus,
  Save,
} from "lucide-react";

// Types
interface ComplaintRecord {
  id: number;
  receiptNo: string;
  receiptDate: string;
  customer: string;
  receiver: string;
  complaintType: "품질" | "납기" | "서비스" | "기타";
  productName: string;
  partNo: string;
  lotNo: string;
  defectQty: number;
  description: string;
  // Analysis
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  emergencyAction: string;
  permanentAction: string;
  similarProductAction: string;
  // Processing
  status: "접수" | "분석중" | "대책수립" | "완료";
  targetDate: string;
  completionDate: string;
  result: string;
  customerFeedback: string;
}

// Initial sample data
const initialData: ComplaintRecord[] = [
  {
    id: 1,
    receiptNo: "CC-2026-001",
    receiptDate: "2026-05-15",
    customer: "현대자동차",
    receiver: "김품질",
    complaintType: "품질",
    productName: "브레이크 패드",
    partNo: "BP-A1234",
    lotNo: "LOT-202605-01",
    defectQty: 50,
    description: "부품 표면에 미세 균열 발생",
    why1: "열처리 온도 편차",
    why2: "온도 센서 노후화",
    why3: "정기점검 미흡",
    why4: "점검 주기 길음",
    why5: "예방보전 기준 미비",
    emergencyAction: "불량품 전수 선별 및 양품 긴급 출하",
    permanentAction: "열처리 설비 온도 센서 교체 및 점검주기 단축",
    similarProductAction: "동일 열처리 공정 적용 제품 전수 검사 실시",
    status: "완료",
    targetDate: "2026-05-25",
    completionDate: "2026-05-23",
    result: "온도센서 교체 및 공정 점검 주기 주 1회로 변경",
    customerFeedback: "신속한 조치에 만족, 재발 방지 모니터링 요청",
  },
  {
    id: 2,
    receiptNo: "CC-2026-002",
    receiptDate: "2026-06-01",
    customer: "기아자동차",
    receiver: "이물류",
    complaintType: "납기",
    productName: "서스펜션 암",
    partNo: "SA-B5678",
    lotNo: "LOT-202606-03",
    defectQty: 0,
    description: "납기일 3일 지연 발생",
    why1: "원자재 입고 지연",
    why2: "협력업체 생산 차질",
    why3: "",
    why4: "",
    why5: "",
    emergencyAction: "안전재고 사용 및 특송 출하",
    permanentAction: "",
    similarProductAction: "",
    status: "분석중",
    targetDate: "2026-06-10",
    completionDate: "",
    result: "",
    customerFeedback: "",
  },
  {
    id: 3,
    receiptNo: "CC-2026-003",
    receiptDate: "2026-06-05",
    customer: "삼성SDI",
    receiver: "박서비스",
    complaintType: "서비스",
    productName: "배터리 케이스",
    partNo: "BC-C9012",
    lotNo: "LOT-202606-05",
    defectQty: 0,
    description: "납품 서류 누락 (성적서 미첨부)",
    why1: "출하 체크리스트 미확인",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
    emergencyAction: "성적서 즉시 발송",
    permanentAction: "",
    similarProductAction: "",
    status: "대책수립",
    targetDate: "2026-06-15",
    completionDate: "",
    result: "",
    customerFeedback: "",
  },
];

// Monthly complaint data for history
const monthlyData = [
  { month: "2026-01", total: 3, quality: 2, delivery: 1, service: 0, etc: 0, ppm: 45 },
  { month: "2026-02", total: 5, quality: 3, delivery: 1, service: 1, etc: 0, ppm: 62 },
  { month: "2026-03", total: 2, quality: 1, delivery: 0, service: 1, etc: 0, ppm: 28 },
  { month: "2026-04", total: 4, quality: 2, delivery: 2, service: 0, etc: 0, ppm: 51 },
  { month: "2026-05", total: 3, quality: 2, delivery: 0, service: 0, etc: 1, ppm: 38 },
  { month: "2026-06", total: 2, quality: 0, delivery: 1, service: 1, etc: 0, ppm: 25 },
];

export default function ComplaintManagementPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(initialData);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state for new complaint
  const [formData, setFormData] = useState<Omit<ComplaintRecord, "id">>({
    receiptNo: "",
    receiptDate: new Date().toISOString().split("T")[0],
    customer: "",
    receiver: "",
    complaintType: "품질",
    productName: "",
    partNo: "",
    lotNo: "",
    defectQty: 0,
    description: "",
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
    emergencyAction: "",
    permanentAction: "",
    similarProductAction: "",
    status: "접수",
    targetDate: "",
    completionDate: "",
    result: "",
    customerFeedback: "",
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
      접수: "destructive",
      분석중: "warning",
      대책수립: "default",
      완료: "success",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      품질: "bg-red-100 text-red-800 border-red-200",
      납기: "bg-orange-100 text-orange-800 border-orange-200",
      서비스: "bg-blue-100 text-blue-800 border-blue-200",
      기타: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[type] || colors["기타"]}`}>
        {type}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: ComplaintRecord = {
      id: complaints.length + 1,
      ...formData,
      receiptNo: `CC-2026-${String(complaints.length + 1).padStart(3, "0")}`,
    };
    setComplaints([...complaints, newComplaint]);
    setFormData({
      receiptNo: "",
      receiptDate: new Date().toISOString().split("T")[0],
      customer: "",
      receiver: "",
      complaintType: "품질",
      productName: "",
      partNo: "",
      lotNo: "",
      defectQty: 0,
      description: "",
      why1: "",
      why2: "",
      why3: "",
      why4: "",
      why5: "",
      emergencyAction: "",
      permanentAction: "",
      similarProductAction: "",
      status: "접수",
      targetDate: "",
      completionDate: "",
      result: "",
      customerFeedback: "",
    });
    alert("불만이 접수되었습니다.");
  };

  const handleUpdateAnalysis = () => {
    if (!selectedComplaint) return;
    const updated = complaints.map((c) =>
      c.id === selectedComplaint.id ? selectedComplaint : c
    );
    setComplaints(updated);
    alert("원인분석 및 대책이 저장되었습니다.");
  };

  const handleUpdateStatus = () => {
    if (!selectedComplaint) return;
    const updated = complaints.map((c) =>
      c.id === selectedComplaint.id ? selectedComplaint : c
    );
    setComplaints(updated);
    alert("처리 현황이 저장되었습니다.");
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics for history tab
  const totalComplaints = monthlyData.reduce((sum, m) => sum + m.total, 0);
  const avgPpm = Math.round(monthlyData.reduce((sum, m) => sum + m.ppm, 0) / monthlyData.length);
  const typeStats = {
    품질: monthlyData.reduce((sum, m) => sum + m.quality, 0),
    납기: monthlyData.reduce((sum, m) => sum + m.delivery, 0),
    서비스: monthlyData.reduce((sum, m) => sum + m.service, 0),
    기타: monthlyData.reduce((sum, m) => sum + m.etc, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">고객 불만 관리</h1>
        <p className="text-muted-foreground">고객불만 접수, 원인분석, 대책 수립 및 이력 관리</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            불만 접수
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            원인분석 및 대책
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            처리 현황
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            불만 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Complaint Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                불만 접수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptNo">접수번호</Label>
                    <Input
                      id="receiptNo"
                      value={`CC-2026-${String(complaints.length + 1).padStart(3, "0")}`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiptDate">접수일</Label>
                    <Input
                      id="receiptDate"
                      type="date"
                      value={formData.receiptDate}
                      onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer">고객사</Label>
                    <Input
                      id="customer"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      placeholder="예: 현대자동차"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiver">접수자</Label>
                    <Input
                      id="receiver"
                      value={formData.receiver}
                      onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                      placeholder="접수자 이름"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaintType">불만유형</Label>
                    <Select
                      value={formData.complaintType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, complaintType: value as ComplaintRecord["complaintType"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="품질">품질</SelectItem>
                        <SelectItem value="납기">납기</SelectItem>
                        <SelectItem value="서비스">서비스</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productName">제품명</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="제품명 입력"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partNo">품번</Label>
                    <Input
                      id="partNo"
                      value={formData.partNo}
                      onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                      placeholder="예: BP-A1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lotNo">Lot번호</Label>
                    <Input
                      id="lotNo"
                      value={formData.lotNo}
                      onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                      placeholder="예: LOT-202606-01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defectQty">불량수량</Label>
                    <Input
                      id="defectQty"
                      type="number"
                      min="0"
                      value={formData.defectQty}
                      onChange={(e) => setFormData({ ...formData, defectQty: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">불만내용 상세</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="고객 불만 내용을 상세히 입력하세요"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    불만 접수
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>최근 접수 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>접수번호</TableHead>
                    <TableHead>접수일</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.slice(-5).reverse().map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.receiptNo}</TableCell>
                      <TableCell>{formatDate(complaint.receiptDate)}</TableCell>
                      <TableCell>{complaint.customer}</TableCell>
                      <TableCell>{getTypeBadge(complaint.complaintType)}</TableCell>
                      <TableCell>{complaint.productName}</TableCell>
                      <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis & Countermeasure */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>불만 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedComplaint?.id === complaint.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedComplaint({ ...complaint })}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{complaint.receiptNo}</span>
                        {getStatusBadge(complaint.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{complaint.customer}</p>
                      <p className="text-xs text-muted-foreground truncate">{complaint.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  원인분석 및 대책
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComplaint ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">불만 개요</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>접수번호: {selectedComplaint.receiptNo}</div>
                        <div>고객사: {selectedComplaint.customer}</div>
                        <div>제품: {selectedComplaint.productName}</div>
                        <div>품번: {selectedComplaint.partNo || "-"}</div>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">{selectedComplaint.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        원인분석 (5 Why)
                      </h4>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <div key={num} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-16">Why {num}:</span>
                            <Input
                              value={selectedComplaint[`why${num}` as keyof ComplaintRecord] as string}
                              onChange={(e) =>
                                setSelectedComplaint({
                                  ...selectedComplaint,
                                  [`why${num}`]: e.target.value,
                                })
                              }
                              placeholder={`${num}번째 원인`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">긴급조치</h4>
                      <Textarea
                        value={selectedComplaint.emergencyAction}
                        onChange={(e) =>
                          setSelectedComplaint({ ...selectedComplaint, emergencyAction: e.target.value })
                        }
                        placeholder="긴급 조치 내용을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">항구대책</h4>
                      <Textarea
                        value={selectedComplaint.permanentAction}
                        onChange={(e) =>
                          setSelectedComplaint({ ...selectedComplaint, permanentAction: e.target.value })
                        }
                        placeholder="항구적 대책 내용을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">유사품 적용</h4>
                      <Textarea
                        value={selectedComplaint.similarProductAction}
                        onChange={(e) =>
                          setSelectedComplaint({ ...selectedComplaint, similarProductAction: e.target.value })
                        }
                        placeholder="유사 제품에 대한 적용 사항을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleUpdateAnalysis}>
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mb-4" />
                    <p>좌측에서 분석할 불만을 선택하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Processing Status */}
        <TabsContent value="status">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>불만 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedComplaint?.id === complaint.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedComplaint({ ...complaint })}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{complaint.receiptNo}</span>
                        {getStatusBadge(complaint.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{complaint.customer}</p>
                      <p className="text-xs text-muted-foreground">{complaint.productName}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  처리 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedComplaint ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">불만 개요</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>접수번호: {selectedComplaint.receiptNo}</div>
                        <div>고객사: {selectedComplaint.customer}</div>
                        <div>제품: {selectedComplaint.productName}</div>
                        <div>접수일: {formatDate(selectedComplaint.receiptDate)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">처리상태</Label>
                        <Select
                          value={selectedComplaint.status}
                          onValueChange={(value) =>
                            setSelectedComplaint({
                              ...selectedComplaint,
                              status: value as ComplaintRecord["status"],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="접수">접수</SelectItem>
                            <SelectItem value="분석중">분석중</SelectItem>
                            <SelectItem value="대책수립">대책수립</SelectItem>
                            <SelectItem value="완료">완료</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetDate">목표일</Label>
                        <Input
                          id="targetDate"
                          type="date"
                          value={selectedComplaint.targetDate}
                          onChange={(e) =>
                            setSelectedComplaint({ ...selectedComplaint, targetDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="completionDate">완료일</Label>
                        <Input
                          id="completionDate"
                          type="date"
                          value={selectedComplaint.completionDate}
                          onChange={(e) =>
                            setSelectedComplaint({ ...selectedComplaint, completionDate: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="result">처리결과</Label>
                      <Textarea
                        id="result"
                        value={selectedComplaint.result}
                        onChange={(e) =>
                          setSelectedComplaint({ ...selectedComplaint, result: e.target.value })
                        }
                        placeholder="처리 결과를 입력하세요"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerFeedback">고객 피드백</Label>
                      <Textarea
                        id="customerFeedback"
                        value={selectedComplaint.customerFeedback}
                        onChange={(e) =>
                          setSelectedComplaint({ ...selectedComplaint, customerFeedback: e.target.value })
                        }
                        placeholder="고객 피드백을 입력하세요"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleUpdateStatus}>
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>좌측에서 처리할 불만을 선택하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Complaint History */}
        <TabsContent value="history">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">연간 총 불만</p>
                    <p className="text-2xl font-bold">{totalComplaints}건</p>
                  </div>
                  <ClipboardList className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">평균 PPM</p>
                    <p className="text-2xl font-bold">{avgPpm}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">품질 불만</p>
                    <p className="text-2xl font-bold text-red-600">{typeStats["품질"]}건</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">납기 불만</p>
                    <p className="text-2xl font-bold text-orange-600">{typeStats["납기"]}건</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 불만 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>월</TableHead>
                      <TableHead className="text-center">총건수</TableHead>
                      <TableHead className="text-center">품질</TableHead>
                      <TableHead className="text-center">납기</TableHead>
                      <TableHead className="text-center">서비스</TableHead>
                      <TableHead className="text-center">PPM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyData.map((data) => (
                      <TableRow key={data.month}>
                        <TableCell className="font-medium">{data.month}</TableCell>
                        <TableCell className="text-center">{data.total}</TableCell>
                        <TableCell className="text-center">{data.quality}</TableCell>
                        <TableCell className="text-center">{data.delivery}</TableCell>
                        <TableCell className="text-center">{data.service}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              data.ppm <= 30
                                ? "bg-green-100 text-green-800"
                                : data.ppm <= 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {data.ppm}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>유형별 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(typeStats).map(([type, count]) => {
                    const percentage = Math.round((count / totalComplaints) * 100);
                    const colors: Record<string, string> = {
                      품질: "bg-red-500",
                      납기: "bg-orange-500",
                      서비스: "bg-blue-500",
                      기타: "bg-gray-500",
                    };
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{type}</span>
                          <span>
                            {count}건 ({percentage}%)
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors[type]} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-4">PPM 추이</h4>
                  <div className="flex items-end gap-2 h-32">
                    {monthlyData.map((data) => {
                      const height = (data.ppm / 70) * 100;
                      return (
                        <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs">{data.ppm}</span>
                          <div
                            className={`w-full rounded-t ${
                              data.ppm <= 30
                                ? "bg-green-500"
                                : data.ppm <= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {data.month.split("-")[1]}월
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
