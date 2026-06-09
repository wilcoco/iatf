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
import {
  Flame,
  ClipboardCheck,
  Package,
  Phone,
  History,
  Search,
  Save,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// Types
interface ChecklistItem {
  id: number;
  category: string;
  item: string;
  result: "양호" | "불량" | "";
  action: string;
}

interface InspectionRecord {
  id: number;
  inspectionDate: string;
  inspector: string;
  items: ChecklistItem[];
  overallResult: "양호" | "불량" | "부분양호";
  remarks: string;
  createdAt: string;
}

interface Equipment {
  id: number;
  name: string;
  location: string;
  quantity: number;
  lastInspectionDate: string;
  expirationDate: string;
  status: "정상" | "교체필요" | "점검필요";
}

interface Contact {
  id: number;
  name: string;
  position: string;
  department: string;
  phone: string;
  mobile: string;
  role: string;
}

// Initial checklist items based on fire emergency categories
const initialChecklistItems: ChecklistItem[] = [
  { id: 1, category: "소화기", item: "소화기 배치 상태 확인", result: "", action: "" },
  { id: 2, category: "소화기", item: "소화기 압력 게이지 확인", result: "", action: "" },
  { id: 3, category: "소화기", item: "소화기 안전핀 상태 확인", result: "", action: "" },
  { id: 4, category: "비상구", item: "비상구 통로 확보 상태", result: "", action: "" },
  { id: 5, category: "비상구", item: "비상구 표지판 조명 상태", result: "", action: "" },
  { id: 6, category: "비상구", item: "비상문 개폐 상태", result: "", action: "" },
  { id: 7, category: "스프링클러", item: "스프링클러 헤드 상태", result: "", action: "" },
  { id: 8, category: "스프링클러", item: "스프링클러 배관 누수 확인", result: "", action: "" },
  { id: 9, category: "화재감지기", item: "연기감지기 작동 상태", result: "", action: "" },
  { id: 10, category: "화재감지기", item: "열감지기 작동 상태", result: "", action: "" },
  { id: 11, category: "소화전", item: "옥내소화전 호스 상태", result: "", action: "" },
  { id: 12, category: "소화전", item: "옥내소화전 밸브 작동 확인", result: "", action: "" },
  { id: 13, category: "비상방송", item: "비상방송 설비 작동 확인", result: "", action: "" },
  { id: 14, category: "피난기구", item: "피난사다리 상태 확인", result: "", action: "" },
  { id: 15, category: "피난기구", item: "완강기 설치 상태 확인", result: "", action: "" },
];

// Sample equipment data
const initialEquipment: Equipment[] = [
  { id: 1, name: "ABC 분말소화기 3.3kg", location: "1층 로비", quantity: 2, lastInspectionDate: "2026-05-15", expirationDate: "2027-05-15", status: "정상" },
  { id: 2, name: "ABC 분말소화기 3.3kg", location: "2층 사무실", quantity: 4, lastInspectionDate: "2026-05-15", expirationDate: "2027-05-15", status: "정상" },
  { id: 3, name: "ABC 분말소화기 3.3kg", location: "생산동 A", quantity: 6, lastInspectionDate: "2026-05-15", expirationDate: "2026-08-15", status: "교체필요" },
  { id: 4, name: "CO2 소화기 2.3kg", location: "전산실", quantity: 2, lastInspectionDate: "2026-05-10", expirationDate: "2027-05-10", status: "정상" },
  { id: 5, name: "옥내소화전", location: "각 층 계단실", quantity: 8, lastInspectionDate: "2026-04-20", expirationDate: "-", status: "정상" },
  { id: 6, name: "자동화재탐지설비", location: "건물 전체", quantity: 1, lastInspectionDate: "2026-05-01", expirationDate: "-", status: "정상" },
  { id: 7, name: "스프링클러 설비", location: "건물 전체", quantity: 1, lastInspectionDate: "2026-05-01", expirationDate: "-", status: "점검필요" },
  { id: 8, name: "피난사다리", location: "3층 비상구", quantity: 2, lastInspectionDate: "2026-04-15", expirationDate: "-", status: "정상" },
  { id: 9, name: "완강기", location: "4층 비상구", quantity: 2, lastInspectionDate: "2026-04-15", expirationDate: "-", status: "정상" },
  { id: 10, name: "비상조명등", location: "각 층 복도", quantity: 20, lastInspectionDate: "2026-05-20", expirationDate: "-", status: "정상" },
];

// Sample contact data
const initialContacts: Contact[] = [
  { id: 1, name: "홍길동", position: "대표이사", department: "경영", phone: "02-1234-5678", mobile: "010-1234-5678", role: "비상대책본부장" },
  { id: 2, name: "김안전", position: "안전관리자", department: "안전환경팀", phone: "02-1234-5679", mobile: "010-2345-6789", role: "현장지휘" },
  { id: 3, name: "이소방", position: "팀장", department: "시설관리팀", phone: "02-1234-5680", mobile: "010-3456-7890", role: "소방대장" },
  { id: 4, name: "박응급", position: "간호사", department: "보건실", phone: "02-1234-5681", mobile: "010-4567-8901", role: "응급처치반장" },
  { id: 5, name: "최대피", position: "과장", department: "총무팀", phone: "02-1234-5682", mobile: "010-5678-9012", role: "대피유도반장" },
  { id: 6, name: "정통신", position: "대리", department: "총무팀", phone: "02-1234-5683", mobile: "010-6789-0123", role: "통보연락반장" },
  { id: 7, name: "119", position: "-", department: "소방서", phone: "119", mobile: "-", role: "화재신고" },
  { id: 8, name: "아산소방서", position: "-", department: "소방서", phone: "041-530-8119", mobile: "-", role: "관할소방서" },
  { id: 9, name: "한국전력", position: "-", department: "유틸리티", phone: "123", mobile: "-", role: "전기사고" },
  { id: 10, name: "도시가스", position: "-", department: "유틸리티", phone: "1544-4500", mobile: "-", role: "가스사고" },
];

export default function FireChecklistPage() {
  const [activeTab, setActiveTab] = useState("checklist");
  const [inspectionRecords, setInspectionRecords] = useState<InspectionRecord[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState("");

  // Form state for checklist
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split("T")[0]);
  const [inspector, setInspector] = useState("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    initialChecklistItems.map((item) => ({ ...item }))
  );
  const [remarks, setRemarks] = useState("");

  // Calculate overall result
  const calculateOverallResult = (): "양호" | "불량" | "부분양호" => {
    const completedItems = checklistItems.filter((item) => item.result !== "");
    if (completedItems.length === 0) return "부분양호";

    const goodCount = completedItems.filter((item) => item.result === "양호").length;
    const badCount = completedItems.filter((item) => item.result === "불량").length;

    if (badCount === 0 && goodCount === completedItems.length) return "양호";
    if (goodCount === 0) return "불량";
    return "부분양호";
  };

  // Handle checklist item change
  const handleItemChange = (id: number, field: "result" | "action", value: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Handle save inspection
  const handleSaveInspection = () => {
    if (!inspector.trim()) {
      alert("점검자를 입력해주세요.");
      return;
    }

    const incompleteItems = checklistItems.filter((item) => item.result === "");
    if (incompleteItems.length > 0) {
      const confirmed = confirm(
        `${incompleteItems.length}개 항목이 미점검 상태입니다. 계속 저장하시겠습니까?`
      );
      if (!confirmed) return;
    }

    const newRecord: InspectionRecord = {
      id: Date.now(),
      inspectionDate,
      inspector,
      items: checklistItems.map((item) => ({ ...item })),
      overallResult: calculateOverallResult(),
      remarks,
      createdAt: new Date().toISOString(),
    };

    setInspectionRecords([newRecord, ...inspectionRecords]);

    // Reset form
    setInspector("");
    setRemarks("");
    setChecklistItems(initialChecklistItems.map((item) => ({ ...item })));

    alert("점검 결과가 저장되었습니다.");
    setActiveTab("history");
  };

  // Get result badge variant
  const getResultVariant = (result: string) => {
    switch (result) {
      case "양호":
      case "정상":
        return "success";
      case "불량":
        return "destructive";
      case "교체필요":
        return "destructive";
      case "점검필요":
        return "warning";
      case "부분양호":
        return "warning";
      default:
        return "outline";
    }
  };

  // Get unique categories
  const categories = [...new Set(checklistItems.map((item) => item.category))];

  // Filter inspection records
  const filteredRecords = inspectionRecords.filter(
    (r) =>
      r.inspector.toLowerCase().includes(search.toLowerCase()) ||
      r.inspectionDate.includes(search)
  );

  // Filter equipment
  const filteredEquipment = equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flame className="h-8 w-8 text-red-600" />
            캠스 화재 비상운영 현황(마스터 리스트)
          </h1>
          <p className="text-muted-foreground">화재 비상운영 점검 및 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            비상운영 점검표
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            비상장비 현황
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            비상연락망
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            점검 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Emergency Operation Checklist */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                비상운영 점검표
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Info */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>점검일 *</Label>
                  <Input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검자 *</Label>
                  <Input
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    placeholder="점검자명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>종합 판정</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Badge variant={getResultVariant(calculateOverallResult())} className="text-base px-4 py-1">
                      {calculateOverallResult()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Checklist by Category */}
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                      {category === "소화기" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {category === "비상구" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                      {category === "스프링클러" && <AlertTriangle className="h-5 w-5 text-blue-500" />}
                      {category === "화재감지기" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {category === "소화전" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {category === "비상방송" && <AlertTriangle className="h-5 w-5 text-purple-500" />}
                      {category === "피난기구" && <AlertTriangle className="h-5 w-5 text-green-500" />}
                      {category}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">점검항목</TableHead>
                          <TableHead className="w-[20%]">점검결과</TableHead>
                          <TableHead className="w-[30%]">조치사항</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {checklistItems
                          .filter((item) => item.category === category)
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.item}</TableCell>
                              <TableCell>
                                <Select
                                  value={item.result}
                                  onValueChange={(v) =>
                                    handleItemChange(item.id, "result", v as "양호" | "불량")
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="양호">
                                      <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        양호
                                      </span>
                                    </SelectItem>
                                    <SelectItem value="불량">
                                      <span className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        불량
                                      </span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.action}
                                  onChange={(e) => handleItemChange(item.id, "action", e.target.value)}
                                  placeholder="조치사항 입력"
                                  disabled={item.result !== "불량"}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label>비고</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="추가 메모 사항을 입력하세요"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setChecklistItems(initialChecklistItems.map((item) => ({ ...item })))}>
                  초기화
                </Button>
                <Button onClick={handleSaveInspection}>
                  <Save className="mr-2 h-4 w-4" />
                  점검 결과 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Emergency Equipment Status */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                비상장비 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="장비명, 위치로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>장비명</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead className="text-center">수량</TableHead>
                      <TableHead>최종점검일</TableHead>
                      <TableHead>유효기간</TableHead>
                      <TableHead className="text-center">상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>{item.lastInspectionDate}</TableCell>
                        <TableCell>{item.expirationDate}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getResultVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4 mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {equipment.filter((e) => e.status === "정상").length}
                      </p>
                      <p className="text-sm text-muted-foreground">정상</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {equipment.filter((e) => e.status === "점검필요").length}
                      </p>
                      <p className="text-sm text-muted-foreground">점검필요</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {equipment.filter((e) => e.status === "교체필요").length}
                      </p>
                      <p className="text-sm text-muted-foreground">교체필요</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {equipment.reduce((sum, e) => sum + e.quantity, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">총 장비 수</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Emergency Contacts */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                비상연락망
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Internal Contacts */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold border-b pb-2">사내 비상연락망</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>성명</TableHead>
                        <TableHead>직위</TableHead>
                        <TableHead>부서</TableHead>
                        <TableHead>역할</TableHead>
                        <TableHead>사내전화</TableHead>
                        <TableHead>휴대폰</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts
                        .filter((c) => c.department !== "소방서" && c.department !== "유틸리티")
                        .map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.position}</TableCell>
                            <TableCell>{contact.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{contact.role}</Badge>
                            </TableCell>
                            <TableCell className="font-mono">{contact.phone}</TableCell>
                            <TableCell className="font-mono">{contact.mobile}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* External Emergency Contacts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">외부 비상연락처</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {contacts
                    .filter((c) => c.department === "소방서" || c.department === "유틸리티")
                    .map((contact) => (
                      <Card key={contact.id} className="border-2">
                        <CardContent className="pt-4">
                          <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">{contact.role}</p>
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-2xl font-bold text-red-600">{contact.phone}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Emergency Response Flow */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">비상시 대응 절차</h3>
                <div className="grid gap-4 md:grid-cols-5">
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm font-semibold text-red-700">1단계</p>
                      <p className="mt-2">화재 발견</p>
                      <p className="text-xs text-muted-foreground mt-1">119 신고 및 비상벨 작동</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm font-semibold text-orange-700">2단계</p>
                      <p className="mt-2">초기 진화</p>
                      <p className="text-xs text-muted-foreground mt-1">소화기 사용</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm font-semibold text-yellow-700">3단계</p>
                      <p className="mt-2">대피 유도</p>
                      <p className="text-xs text-muted-foreground mt-1">비상구 통한 대피</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm font-semibold text-green-700">4단계</p>
                      <p className="mt-2">인원 파악</p>
                      <p className="text-xs text-muted-foreground mt-1">집결지 인원 확인</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4 text-center">
                      <p className="text-sm font-semibold text-blue-700">5단계</p>
                      <p className="mt-2">상황 보고</p>
                      <p className="text-xs text-muted-foreground mt-1">본부장 보고</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Inspection History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                점검 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="점검자, 점검일로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredRecords.length === 0 ? (
                <div className="py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">등록된 점검 기록이 없습니다.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("checklist")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    새 점검 등록
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>점검일</TableHead>
                        <TableHead>점검자</TableHead>
                        <TableHead className="text-center">총 점검항목</TableHead>
                        <TableHead className="text-center">양호</TableHead>
                        <TableHead className="text-center">불량</TableHead>
                        <TableHead className="text-center">미점검</TableHead>
                        <TableHead className="text-center">종합판정</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => {
                        const goodCount = record.items.filter((i) => i.result === "양호").length;
                        const badCount = record.items.filter((i) => i.result === "불량").length;
                        const pendingCount = record.items.filter((i) => i.result === "").length;

                        return (
                          <TableRow key={record.id}>
                            <TableCell>{record.inspectionDate}</TableCell>
                            <TableCell className="font-medium">{record.inspector}</TableCell>
                            <TableCell className="text-center">{record.items.length}</TableCell>
                            <TableCell className="text-center text-green-600 font-medium">
                              {goodCount}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-medium">
                              {badCount}
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {pendingCount}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={getResultVariant(record.overallResult)}>
                                {record.overallResult}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {record.remarks || "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
