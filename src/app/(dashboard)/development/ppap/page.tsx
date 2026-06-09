"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileCheck,
  ClipboardList,
  FileText,
  History,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus
} from "lucide-react";

// PPAP 18 요소 타입
interface PPAPElement {
  id: number;
  name: string;
  required: Record<string, boolean>; // level1-5
  status: "완료" | "진행중" | "미완료" | "해당없음";
  submittedDate?: string;
  remarks?: string;
}

// PPAP 이력 타입
interface PPAPHistory {
  id: number;
  date: string;
  action: string;
  user: string;
  details: string;
}

// 제출수준 설명
const submissionLevels = [
  { level: "1", name: "Level 1", description: "보증서만 (Warrant Only)" },
  { level: "2", name: "Level 2", description: "제한된 샘플 (Limited Samples)" },
  { level: "3", name: "Level 3", description: "전체 샘플 + 전체 데이터 (Full Samples + Full Data)" },
  { level: "4", name: "Level 4", description: "고객요구사항 (Customer Requirements)" },
  { level: "5", name: "Level 5", description: "현장검토 (On-site Review)" },
];

// 18가지 PPAP 요소 초기 데이터
const initialPPAPElements: PPAPElement[] = [
  { id: 1, name: "설계기록 (Design Records)", required: { "1": false, "2": true, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 2, name: "승인된 설계변경 (Authorized Engineering Changes)", required: { "1": false, "2": true, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 3, name: "고객엔지니어링 승인 (Customer Engineering Approval)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 4, name: "설계FMEA (Design FMEA)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 5, name: "공정흐름도 (Process Flow Diagram)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 6, name: "공정FMEA (Process FMEA)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 7, name: "관리계획서 (Control Plan)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 8, name: "MSA (Measurement System Analysis)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 9, name: "치수성적서 (Dimensional Results)", required: { "1": false, "2": true, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 10, name: "재료/성능시험 (Material/Performance Test)", required: { "1": false, "2": true, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 11, name: "초도샘플검사 (Initial Process Study)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 12, name: "외관승인 (Appearance Approval)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 13, name: "샘플제품 (Sample Product)", required: { "1": false, "2": true, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 14, name: "마스터샘플 (Master Sample)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 15, name: "검사보조구 (Checking Aids)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 16, name: "고객별요구사항 (Customer-Specific Requirements)", required: { "1": false, "2": false, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 17, name: "PSW (Part Submission Warrant)", required: { "1": true, "2": true, "3": true, "4": true, "5": true }, status: "미완료" },
  { id: 18, name: "벌크자재요구사항 (Bulk Material Requirements)", required: { "1": false, "2": false, "3": false, "4": false, "5": true }, status: "해당없음" },
];

// 샘플 이력 데이터
const initialHistory: PPAPHistory[] = [
  { id: 1, date: "2024-01-15", action: "생성", user: "김품질", details: "PPAP 신규 생성" },
  { id: 2, date: "2024-01-18", action: "수정", user: "이엔지니어", details: "설계기록 업로드" },
  { id: 3, date: "2024-01-20", action: "제출", user: "김품질", details: "고객에게 Level 3 제출" },
];

export default function PPAPSubmissionPage() {
  const [activeTab, setActiveTab] = useState("basic");

  // PPAP 기본정보 상태
  const [ppapInfo, setPpapInfo] = useState({
    ppapNumber: "",
    productName: "",
    partNumber: "",
    customerName: "",
    submissionDate: "",
    submissionLevel: "3",
    approvalStatus: "pending",
  });

  // 18요소 체크리스트 상태
  const [elements, setElements] = useState<PPAPElement[]>(initialPPAPElements);

  // PSW 상태
  const [pswData, setPswData] = useState({
    partName: "",
    partNumber: "",
    drawingNumber: "",
    drawingDate: "",
    drawingChangeLevel: "",
    additionalEngChanges: "",
    purchaseOrderNumber: "",
    weightKg: "",
    checkingAidNumber: "",
    reasonForSubmission: "initial",
    requestedSubmissionLevel: "3",
    submissionResults: "",
    declarationText: "",
    supplierName: "",
    supplierAddress: "",
    supplierCode: "",
    supplierAuthorizedSignature: "",
    printName: "",
    title: "",
    phone: "",
    fax: "",
    email: "",
    submissionDate: "",
  });

  // 이력 상태
  const [history] = useState<PPAPHistory[]>(initialHistory);

  // 요소 상태 변경 핸들러
  const handleElementStatusChange = (elementId: number, newStatus: PPAPElement["status"]) => {
    setElements(elements.map(el =>
      el.id === elementId ? { ...el, status: newStatus } : el
    ));
  };

  // 상태 배지 컴포넌트
  const StatusBadge = ({ status }: { status: PPAPElement["status"] }) => {
    const variants: Record<PPAPElement["status"], { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      "완료": { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
      "진행중": { variant: "secondary", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
      "미완료": { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
      "해당없음": { variant: "outline", icon: null },
    };
    const { variant, icon } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {status}
      </Badge>
    );
  };

  // 승인상태 배지
  const ApprovalStatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      "approved": { variant: "default", label: "승인" },
      "conditional": { variant: "secondary", label: "조건부승인" },
      "rejected": { variant: "destructive", label: "반려" },
      "pending": { variant: "outline" as "secondary", label: "대기중" },
    };
    const { variant, label } = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">PPAP 제출</h1>
          <p className="text-muted-foreground">Production Part Approval Process - 양산부품 승인절차</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            미리보기
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            PPAP 기본정보
          </TabsTrigger>
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            18요소 체크리스트
          </TabsTrigger>
          <TabsTrigger value="psw" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PSW 작성
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            PPAP 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: PPAP 기본정보 */}
        <TabsContent value="basic">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>PPAP 제출 기본 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>PPAP번호</Label>
                    <Input
                      placeholder="PPAP-2024-001"
                      value={ppapInfo.ppapNumber}
                      onChange={(e) => setPpapInfo({...ppapInfo, ppapNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>제출일</Label>
                    <Input
                      type="date"
                      value={ppapInfo.submissionDate}
                      onChange={(e) => setPpapInfo({...ppapInfo, submissionDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>제품명</Label>
                  <Input
                    placeholder="제품명 입력"
                    value={ppapInfo.productName}
                    onChange={(e) => setPpapInfo({...ppapInfo, productName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>품번</Label>
                  <Input
                    placeholder="품번 입력"
                    value={ppapInfo.partNumber}
                    onChange={(e) => setPpapInfo({...ppapInfo, partNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>고객명</Label>
                  <Input
                    placeholder="고객명 입력"
                    value={ppapInfo.customerName}
                    onChange={(e) => setPpapInfo({...ppapInfo, customerName: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>제출수준 (Submission Level)</CardTitle>
                <CardDescription>고객이 요구하는 제출수준을 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>제출수준</Label>
                  <Select
                    value={ppapInfo.submissionLevel}
                    onValueChange={(value) => setPpapInfo({...ppapInfo, submissionLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="제출수준 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {submissionLevels.map((level) => (
                        <SelectItem key={level.level} value={level.level}>
                          {level.name} - {level.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium">선택된 제출수준 설명</h4>
                  <p className="text-sm text-muted-foreground">
                    {submissionLevels.find(l => l.level === ppapInfo.submissionLevel)?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>승인상태</Label>
                  <Select
                    value={ppapInfo.approvalStatus}
                    onValueChange={(value) => setPpapInfo({...ppapInfo, approvalStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">대기중</SelectItem>
                      <SelectItem value="approved">승인</SelectItem>
                      <SelectItem value="conditional">조건부승인</SelectItem>
                      <SelectItem value="rejected">반려</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">현재 상태:</span>
                  <ApprovalStatusBadge status={ppapInfo.approvalStatus} />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>제출수준별 요구사항</CardTitle>
                <CardDescription>각 제출수준에 따른 필수 제출 항목</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>수준</TableHead>
                      <TableHead>명칭</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead>필수 요소 수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissionLevels.map((level) => {
                      const requiredCount = elements.filter(el => el.required[level.level]).length;
                      return (
                        <TableRow key={level.level} className={ppapInfo.submissionLevel === level.level ? "bg-muted" : ""}>
                          <TableCell className="font-medium">{level.name}</TableCell>
                          <TableCell>{level.description.split(" (")[0]}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {level.description.split(" (")[1]?.replace(")", "")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{requiredCount}개</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 18요소 체크리스트 */}
        <TabsContent value="elements">
          <Card>
            <CardHeader>
              <CardTitle>18가지 PPAP 요소 체크리스트</CardTitle>
              <CardDescription>
                현재 제출수준: Level {ppapInfo.submissionLevel} -
                {submissionLevels.find(l => l.level === ppapInfo.submissionLevel)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>요소명</TableHead>
                    <TableHead className="w-20 text-center">필수</TableHead>
                    <TableHead className="w-32">상태</TableHead>
                    <TableHead className="w-32">제출일</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elements.map((element) => {
                    const isRequired = element.required[ppapInfo.submissionLevel];
                    return (
                      <TableRow key={element.id} className={!isRequired ? "opacity-50" : ""}>
                        <TableCell className="font-medium">{element.id}</TableCell>
                        <TableCell>{element.name}</TableCell>
                        <TableCell className="text-center">
                          {isRequired ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={element.status}
                            onValueChange={(value) => handleElementStatusChange(element.id, value as PPAPElement["status"])}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="완료">완료</SelectItem>
                              <SelectItem value="진행중">진행중</SelectItem>
                              <SelectItem value="미완료">미완료</SelectItem>
                              <SelectItem value="해당없음">해당없음</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            className="h-8"
                            value={element.submittedDate || ""}
                            onChange={(e) => {
                              setElements(elements.map(el =>
                                el.id === element.id ? { ...el, submittedDate: e.target.value } : el
                              ));
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="비고"
                            className="h-8"
                            value={element.remarks || ""}
                            onChange={(e) => {
                              setElements(elements.map(el =>
                                el.id === element.id ? { ...el, remarks: e.target.value } : el
                              ));
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">요약</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <StatusBadge status="완료" />
                    <span>{elements.filter(e => e.status === "완료").length}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="진행중" />
                    <span>{elements.filter(e => e.status === "진행중").length}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="미완료" />
                    <span>{elements.filter(e => e.status === "미완료").length}개</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="해당없음" />
                    <span>{elements.filter(e => e.status === "해당없음").length}개</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: PSW 작성 */}
        <TabsContent value="psw">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>부품 정보 (Part Information)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>부품명 (Part Name)</Label>
                    <Input
                      value={pswData.partName}
                      onChange={(e) => setPswData({...pswData, partName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>부품번호 (Part Number)</Label>
                    <Input
                      value={pswData.partNumber}
                      onChange={(e) => setPswData({...pswData, partNumber: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>도면번호 (Drawing Number)</Label>
                    <Input
                      value={pswData.drawingNumber}
                      onChange={(e) => setPswData({...pswData, drawingNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>도면일자 (Drawing Date)</Label>
                    <Input
                      type="date"
                      value={pswData.drawingDate}
                      onChange={(e) => setPswData({...pswData, drawingDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>도면변경수준 (Drawing Change Level)</Label>
                    <Input
                      value={pswData.drawingChangeLevel}
                      onChange={(e) => setPswData({...pswData, drawingChangeLevel: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>중량 (kg)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={pswData.weightKg}
                      onChange={(e) => setPswData({...pswData, weightKg: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>추가 설계변경 (Additional Eng. Changes)</Label>
                  <Input
                    value={pswData.additionalEngChanges}
                    onChange={(e) => setPswData({...pswData, additionalEngChanges: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>구매주문번호 (P.O. Number)</Label>
                    <Input
                      value={pswData.purchaseOrderNumber}
                      onChange={(e) => setPswData({...pswData, purchaseOrderNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>검사보조구 번호</Label>
                    <Input
                      value={pswData.checkingAidNumber}
                      onChange={(e) => setPswData({...pswData, checkingAidNumber: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>제출 정보 (Submission Information)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>제출사유 (Reason for Submission)</Label>
                  <Select
                    value={pswData.reasonForSubmission}
                    onValueChange={(value) => setPswData({...pswData, reasonForSubmission: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">최초 제출 (Initial Submission)</SelectItem>
                      <SelectItem value="engChange">설계 변경 (Engineering Change)</SelectItem>
                      <SelectItem value="tooling">툴링/장비 변경 (Tooling Change)</SelectItem>
                      <SelectItem value="correction">시정 조치 (Correction)</SelectItem>
                      <SelectItem value="revalidation">재검증 (Revalidation)</SelectItem>
                      <SelectItem value="material">재료 변경 (Material Change)</SelectItem>
                      <SelectItem value="supplier">공급업체 변경 (Supplier Change)</SelectItem>
                      <SelectItem value="other">기타 (Other)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>요청 제출수준 (Requested Submission Level)</Label>
                  <Select
                    value={pswData.requestedSubmissionLevel}
                    onValueChange={(value) => setPswData({...pswData, requestedSubmissionLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {submissionLevels.map((level) => (
                        <SelectItem key={level.level} value={level.level}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>제출 결과 (Submission Results)</Label>
                  <Textarea
                    placeholder="제출 결과 및 특이사항을 입력하세요"
                    value={pswData.submissionResults}
                    onChange={(e) => setPswData({...pswData, submissionResults: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>선언문 (Declaration)</Label>
                  <Textarea
                    placeholder="본 제출물은 모든 적용 가능한 사양 및 요구사항을 충족함을 확인합니다."
                    value={pswData.declarationText}
                    onChange={(e) => setPswData({...pswData, declarationText: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>공급업체 정보 (Supplier Information)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>공급업체명</Label>
                    <Input
                      value={pswData.supplierName}
                      onChange={(e) => setPswData({...pswData, supplierName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공급업체 코드</Label>
                    <Input
                      value={pswData.supplierCode}
                      onChange={(e) => setPswData({...pswData, supplierCode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>주소</Label>
                    <Input
                      value={pswData.supplierAddress}
                      onChange={(e) => setPswData({...pswData, supplierAddress: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>담당자명</Label>
                    <Input
                      value={pswData.printName}
                      onChange={(e) => setPswData({...pswData, printName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>직책</Label>
                    <Input
                      value={pswData.title}
                      onChange={(e) => setPswData({...pswData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>전화번호</Label>
                    <Input
                      value={pswData.phone}
                      onChange={(e) => setPswData({...pswData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>팩스</Label>
                    <Input
                      value={pswData.fax}
                      onChange={(e) => setPswData({...pswData, fax: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input
                      type="email"
                      value={pswData.email}
                      onChange={(e) => setPswData({...pswData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>제출일</Label>
                    <Input
                      type="date"
                      value={pswData.submissionDate}
                      onChange={(e) => setPswData({...pswData, submissionDate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: PPAP 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>PPAP 이력</CardTitle>
                <CardDescription>PPAP 제출 및 변경 이력을 확인합니다</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                이력 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead className="w-32">일자</TableHead>
                    <TableHead className="w-24">구분</TableHead>
                    <TableHead className="w-24">담당자</TableHead>
                    <TableHead>상세내용</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.action === "생성" ? "default" :
                          item.action === "수정" ? "secondary" :
                          item.action === "제출" ? "outline" : "default"
                        }>
                          {item.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {history.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  이력이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
