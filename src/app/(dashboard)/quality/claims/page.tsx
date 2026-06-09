"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, CheckCircle, History, Plus, Search } from "lucide-react";

interface ClaimData {
  // Header
  claimNumber: string;
  receivedDate: string;
  customerName: string;
  urgency: "일반" | "긴급" | "특급";

  // 클레임 접수
  productName: string;
  partNumber: string;
  lotNumber: string;
  defectQuantity: number;
  claimType: "외관불량" | "치수불량" | "기능불량" | "포장불량" | "혼입" | "기타";
  claimDetail: string;

  // 초기대응
  receptionConfirmed: boolean;
  receptionConfirmedDate: string;
  fieldSurveyDate: string;
  emergencyIsolation: string;

  // 분석 결과
  causeAnalysis: string;
  responsibility: "자사귀책" | "협력사귀책" | "고객귀책" | "원인불명";
  analysisReport: string;

  // 대책
  correctiveAction: string;
  completionDate: string;
  preventiveMeasure: string;

  // 처리 완료
  customerResponse: string;
  costProcessing: string;
  finalApproval: boolean;
  finalApprovalDate: string;

  // Status
  status: "접수" | "분석중" | "대책수립" | "처리중" | "완료";
}

const initialClaimData: ClaimData = {
  claimNumber: "",
  receivedDate: "",
  customerName: "",
  urgency: "일반",
  productName: "",
  partNumber: "",
  lotNumber: "",
  defectQuantity: 0,
  claimType: "외관불량",
  claimDetail: "",
  receptionConfirmed: false,
  receptionConfirmedDate: "",
  fieldSurveyDate: "",
  emergencyIsolation: "",
  causeAnalysis: "",
  responsibility: "원인불명",
  analysisReport: "",
  correctiveAction: "",
  completionDate: "",
  preventiveMeasure: "",
  customerResponse: "",
  costProcessing: "",
  finalApproval: false,
  finalApprovalDate: "",
  status: "접수",
};

// Sample history data
const sampleHistory: ClaimData[] = [
  {
    claimNumber: "CLM-2026-0001",
    receivedDate: "2026-05-15",
    customerName: "삼성전자",
    urgency: "긴급",
    productName: "커넥터 A-100",
    partNumber: "CN-A100-001",
    lotNumber: "L2026051001",
    defectQuantity: 50,
    claimType: "치수불량",
    claimDetail: "핀 간격 규격 미달",
    receptionConfirmed: true,
    receptionConfirmedDate: "2026-05-15",
    fieldSurveyDate: "2026-05-16",
    emergencyIsolation: "해당 LOT 전량 격리",
    causeAnalysis: "금형 마모로 인한 치수 변동",
    responsibility: "자사귀책",
    analysisReport: "금형 점검 결과 마모 확인",
    correctiveAction: "금형 교체 및 검사 주기 단축",
    completionDate: "2026-05-20",
    preventiveMeasure: "금형 수명 관리 시스템 도입",
    customerResponse: "재발방지 대책 승인",
    costProcessing: "교체품 무상 공급",
    finalApproval: true,
    finalApprovalDate: "2026-05-22",
    status: "완료",
  },
  {
    claimNumber: "CLM-2026-0002",
    receivedDate: "2026-06-01",
    customerName: "LG전자",
    urgency: "특급",
    productName: "케이블 B-200",
    partNumber: "CB-B200-002",
    lotNumber: "L2026060101",
    defectQuantity: 100,
    claimType: "기능불량",
    claimDetail: "통전 불량 발생",
    receptionConfirmed: true,
    receptionConfirmedDate: "2026-06-01",
    fieldSurveyDate: "2026-06-02",
    emergencyIsolation: "라인 투입 중단",
    causeAnalysis: "분석 진행중",
    responsibility: "원인불명",
    analysisReport: "",
    correctiveAction: "",
    completionDate: "",
    preventiveMeasure: "",
    customerResponse: "",
    costProcessing: "",
    finalApproval: false,
    finalApprovalDate: "",
    status: "분석중",
  },
  {
    claimNumber: "CLM-2026-0003",
    receivedDate: "2026-06-05",
    customerName: "현대모비스",
    urgency: "일반",
    productName: "하우징 C-300",
    partNumber: "HS-C300-003",
    lotNumber: "L2026060501",
    defectQuantity: 20,
    claimType: "외관불량",
    claimDetail: "표면 스크래치 발견",
    receptionConfirmed: true,
    receptionConfirmedDate: "2026-06-05",
    fieldSurveyDate: "",
    emergencyIsolation: "",
    causeAnalysis: "",
    responsibility: "원인불명",
    analysisReport: "",
    correctiveAction: "",
    completionDate: "",
    preventiveMeasure: "",
    customerResponse: "",
    costProcessing: "",
    finalApproval: false,
    finalApprovalDate: "",
    status: "접수",
  },
];

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [claimData, setClaimData] = useState<ClaimData>(initialClaimData);
  const [claimHistory, setClaimHistory] = useState<ClaimData[]>(sampleHistory);
  const [searchTerm, setSearchTerm] = useState("");

  const generateClaimNumber = () => {
    const year = new Date().getFullYear();
    const nextNum = claimHistory.length + 1;
    return `CLM-${year}-${String(nextNum).padStart(4, "0")}`;
  };

  const handleNewClaim = () => {
    const newClaimNumber = generateClaimNumber();
    const today = new Date().toISOString().split("T")[0];
    setClaimData({
      ...initialClaimData,
      claimNumber: newClaimNumber,
      receivedDate: today,
    });
    setActiveTab("registration");
  };

  const handleSaveClaim = () => {
    if (!claimData.claimNumber) {
      alert("클레임 번호가 필요합니다.");
      return;
    }
    const existingIndex = claimHistory.findIndex(
      (c) => c.claimNumber === claimData.claimNumber
    );
    if (existingIndex >= 0) {
      const updated = [...claimHistory];
      updated[existingIndex] = claimData;
      setClaimHistory(updated);
    } else {
      setClaimHistory([...claimHistory, claimData]);
    }
    alert("저장되었습니다.");
  };

  const handleSelectClaim = (claim: ClaimData) => {
    setClaimData(claim);
    setActiveTab("registration");
  };

  const filteredHistory = claimHistory.filter(
    (claim) =>
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const urgencyColors: Record<string, string> = {
    일반: "bg-gray-100 text-gray-800",
    긴급: "bg-orange-100 text-orange-800",
    특급: "bg-red-100 text-red-800",
  };

  const statusColors: Record<string, string> = {
    접수: "bg-blue-100 text-blue-800",
    분석중: "bg-yellow-100 text-yellow-800",
    대책수립: "bg-purple-100 text-purple-800",
    처리중: "bg-indigo-100 text-indigo-800",
    완료: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">클레임 분석/관리</h1>
          <p className="text-muted-foreground">
            고객 클레임 접수, 분석, 대책 수립 및 처리 관리
          </p>
        </div>
        <Button onClick={handleNewClaim}>
          <Plus className="mr-2 h-4 w-4" />
          신규 클레임 등록
        </Button>
      </div>

      {/* Header Card - Always visible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            클레임 기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>클레임번호</Label>
              <Input
                value={claimData.claimNumber}
                onChange={(e) =>
                  setClaimData({ ...claimData, claimNumber: e.target.value })
                }
                placeholder="CLM-YYYY-XXXX"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>접수일</Label>
              <Input
                type="date"
                value={claimData.receivedDate}
                onChange={(e) =>
                  setClaimData({ ...claimData, receivedDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>고객명</Label>
              <Input
                value={claimData.customerName}
                onChange={(e) =>
                  setClaimData({ ...claimData, customerName: e.target.value })
                }
                placeholder="고객사명 입력"
              />
            </div>
            <div className="space-y-2">
              <Label>긴급도</Label>
              <Select
                value={claimData.urgency}
                onValueChange={(value) =>
                  setClaimData({
                    ...claimData,
                    urgency: value as ClaimData["urgency"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="긴급도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="일반">일반</SelectItem>
                  <SelectItem value="긴급">긴급</SelectItem>
                  <SelectItem value="특급">특급</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            클레임 접수
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Search className="mr-2 h-4 w-4" />
            분석 및 대책
          </TabsTrigger>
          <TabsTrigger value="completion">
            <CheckCircle className="mr-2 h-4 w-4" />
            처리 완료
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            클레임 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 클레임 접수 (Registration) */}
        <TabsContent value="registration">
          <div className="grid grid-cols-2 gap-6">
            {/* 클레임 접수 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>클레임 접수 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>제품명</Label>
                    <Input
                      value={claimData.productName}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          productName: e.target.value,
                        })
                      }
                      placeholder="제품명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품번</Label>
                    <Input
                      value={claimData.partNumber}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          partNumber: e.target.value,
                        })
                      }
                      placeholder="품번 입력"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>LOT번호</Label>
                    <Input
                      value={claimData.lotNumber}
                      onChange={(e) =>
                        setClaimData({ ...claimData, lotNumber: e.target.value })
                      }
                      placeholder="LOT번호 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>불량수량</Label>
                    <Input
                      type="number"
                      value={claimData.defectQuantity}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          defectQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="수량 입력"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>클레임 유형</Label>
                  <Select
                    value={claimData.claimType}
                    onValueChange={(value) =>
                      setClaimData({
                        ...claimData,
                        claimType: value as ClaimData["claimType"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="외관불량">외관불량</SelectItem>
                      <SelectItem value="치수불량">치수불량</SelectItem>
                      <SelectItem value="기능불량">기능불량</SelectItem>
                      <SelectItem value="포장불량">포장불량</SelectItem>
                      <SelectItem value="혼입">혼입</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>클레임 내용 상세</Label>
                  <Textarea
                    value={claimData.claimDetail}
                    onChange={(e) =>
                      setClaimData({ ...claimData, claimDetail: e.target.value })
                    }
                    placeholder="클레임 내용을 상세히 기술하세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 초기대응 */}
            <Card>
              <CardHeader>
                <CardTitle>초기대응</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="receptionConfirmed"
                      checked={claimData.receptionConfirmed}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          receptionConfirmed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="receptionConfirmed">접수확인 연락 완료</Label>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>연락일시</Label>
                    <Input
                      type="date"
                      value={claimData.receptionConfirmedDate}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          receptionConfirmedDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>현장조사 일정</Label>
                  <Input
                    type="date"
                    value={claimData.fieldSurveyDate}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        fieldSurveyDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>긴급 격리조치</Label>
                  <Textarea
                    value={claimData.emergencyIsolation}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        emergencyIsolation: e.target.value,
                      })
                    }
                    placeholder="긴급 격리조치 내용을 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>처리 상태</Label>
                  <Select
                    value={claimData.status}
                    onValueChange={(value) =>
                      setClaimData({
                        ...claimData,
                        status: value as ClaimData["status"],
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
                      <SelectItem value="처리중">처리중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveClaim}>저장</Button>
          </div>
        </TabsContent>

        {/* Tab 2: 분석 및 대책 (Analysis & Actions) */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-2 gap-6">
            {/* 분석 결과 */}
            <Card>
              <CardHeader>
                <CardTitle>분석 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>불량원인 분석</Label>
                  <Textarea
                    value={claimData.causeAnalysis}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        causeAnalysis: e.target.value,
                      })
                    }
                    placeholder="불량 원인을 분석하여 기술하세요"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>책임소재</Label>
                  <Select
                    value={claimData.responsibility}
                    onValueChange={(value) =>
                      setClaimData({
                        ...claimData,
                        responsibility: value as ClaimData["responsibility"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="책임소재 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="자사귀책">자사귀책</SelectItem>
                      <SelectItem value="협력사귀책">협력사귀책</SelectItem>
                      <SelectItem value="고객귀책">고객귀책</SelectItem>
                      <SelectItem value="원인불명">원인불명</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>분석 보고서</Label>
                  <Textarea
                    value={claimData.analysisReport}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        analysisReport: e.target.value,
                      })
                    }
                    placeholder="분석 보고서 내용을 입력하세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 대책 */}
            <Card>
              <CardHeader>
                <CardTitle>대책</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>시정조치 내용</Label>
                  <Textarea
                    value={claimData.correctiveAction}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        correctiveAction: e.target.value,
                      })
                    }
                    placeholder="시정조치 내용을 입력하세요"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>완료일</Label>
                  <Input
                    type="date"
                    value={claimData.completionDate}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        completionDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>재발방지대책</Label>
                  <Textarea
                    value={claimData.preventiveMeasure}
                    onChange={(e) =>
                      setClaimData({
                        ...claimData,
                        preventiveMeasure: e.target.value,
                      })
                    }
                    placeholder="재발방지대책을 입력하세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveClaim}>저장</Button>
          </div>
        </TabsContent>

        {/* Tab 3: 처리 완료 (Completion) */}
        <TabsContent value="completion">
          <Card>
            <CardHeader>
              <CardTitle>처리 완료</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>고객 회신</Label>
                    <Textarea
                      value={claimData.customerResponse}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          customerResponse: e.target.value,
                        })
                      }
                      placeholder="고객 회신 내용을 입력하세요"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>비용 처리</Label>
                    <Textarea
                      value={claimData.costProcessing}
                      onChange={(e) =>
                        setClaimData({
                          ...claimData,
                          costProcessing: e.target.value,
                        })
                      }
                      placeholder="비용 처리 내용을 입력하세요 (교체, 환불, 할인 등)"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="finalApproval"
                        checked={claimData.finalApproval}
                        onChange={(e) =>
                          setClaimData({
                            ...claimData,
                            finalApproval: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="finalApproval">최종 승인 완료</Label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>승인일</Label>
                      <Input
                        type="date"
                        value={claimData.finalApprovalDate}
                        onChange={(e) =>
                          setClaimData({
                            ...claimData,
                            finalApprovalDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h4 className="font-semibold mb-2">클레임 요약</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">클레임번호:</span>{" "}
                        {claimData.claimNumber || "-"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">고객명:</span>{" "}
                        {claimData.customerName || "-"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">제품:</span>{" "}
                        {claimData.productName || "-"} ({claimData.partNumber || "-"})
                      </p>
                      <p>
                        <span className="text-muted-foreground">유형:</span>{" "}
                        {claimData.claimType}
                      </p>
                      <p>
                        <span className="text-muted-foreground">책임소재:</span>{" "}
                        {claimData.responsibility}
                      </p>
                      <p>
                        <span className="text-muted-foreground">상태:</span>{" "}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[claimData.status] || "bg-gray-100"
                          }`}
                        >
                          {claimData.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setClaimData({ ...claimData, status: "완료", finalApproval: true, finalApprovalDate: new Date().toISOString().split("T")[0] });
              }}
            >
              처리 완료
            </Button>
            <Button onClick={handleSaveClaim}>저장</Button>
          </div>
        </TabsContent>

        {/* Tab 4: 클레임 이력 (History) */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>클레임 이력</span>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="검색 (클레임번호, 고객명, 제품명)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>클레임번호</TableHead>
                    <TableHead>접수일</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>긴급도</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        클레임 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map((claim) => (
                      <TableRow key={claim.claimNumber}>
                        <TableCell className="font-mono">
                          {claim.claimNumber}
                        </TableCell>
                        <TableCell>{claim.receivedDate}</TableCell>
                        <TableCell>{claim.customerName}</TableCell>
                        <TableCell>{claim.productName}</TableCell>
                        <TableCell>{claim.claimType}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              urgencyColors[claim.urgency] || "bg-gray-100"
                            }`}
                          >
                            {claim.urgency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[claim.status] || "bg-gray-100"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectClaim(claim)}
                          >
                            상세보기
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
      </Tabs>
    </div>
  );
}
