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
import { Plus, Save, Wrench, Play, ClipboardCheck, History, CheckCircle, XCircle } from "lucide-react";

interface ReworkRecord {
  id: number;
  // Header
  reworkNo: string;
  occurrenceDate: string;
  occurrenceProcess: string;
  manager: string;
  // Rework Info
  productName: string;
  partNo: string;
  lotNo: string;
  defectQty: number;
  defectType: string;
  defectContent: string;
  // Rework Plan
  reworkMethod: string;
  reworkProcess: string;
  estimatedTime: string;
  requiredResources: string;
  // Rework Result
  reworkQty: number;
  passQty: number;
  failQty: number;
  completionDate: string;
  // Re-inspection
  inspectionItems: string;
  inspectionResult: string;
  inspector: string;
  // Status
  status: "registered" | "in_progress" | "completed" | "closed";
}

interface InspectionItem {
  id: number;
  reworkId: number;
  itemName: string;
  standard: string;
  measuredValue: string;
  result: "pass" | "fail";
  inspector: string;
  inspectionDate: string;
}

export default function ReworkManagementPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [records, setRecords] = useState<ReworkRecord[]>([]);
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ReworkRecord | null>(null);

  // Registration form state
  const [registrationForm, setRegistrationForm] = useState({
    reworkNo: "",
    occurrenceDate: new Date().toISOString().split("T")[0],
    occurrenceProcess: "",
    manager: "",
    productName: "",
    partNo: "",
    lotNo: "",
    defectQty: 0,
    defectType: "",
    defectContent: "",
    reworkMethod: "",
    reworkProcess: "",
    estimatedTime: "",
    requiredResources: "",
  });

  // Execution form state
  const [executionForm, setExecutionForm] = useState({
    reworkQty: 0,
    passQty: 0,
    failQty: 0,
    completionDate: new Date().toISOString().split("T")[0],
  });

  // Inspection form state
  const [inspectionForm, setInspectionForm] = useState({
    itemName: "",
    standard: "",
    measuredValue: "",
    result: "",
    inspector: "",
    inspectionDate: new Date().toISOString().split("T")[0],
  });

  const statusLabels: Record<string, string> = {
    registered: "등록완료",
    in_progress: "진행중",
    completed: "완료",
    closed: "종결",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    registered: "default",
    in_progress: "warning",
    completed: "success",
    closed: "default",
  };

  const defectTypeLabels: Record<string, string> = {
    scratch: "스크래치",
    dent: "찍힘",
    paint: "도장불량",
    dimension: "치수불량",
    assembly: "조립불량",
    material: "자재불량",
    other: "기타",
  };

  const generateReworkNo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const seq = String(records.length + 1).padStart(3, "0");
    return `RW-${year}${month}${day}-${seq}`;
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ReworkRecord = {
      id: Date.now(),
      reworkNo: registrationForm.reworkNo || generateReworkNo(),
      occurrenceDate: registrationForm.occurrenceDate,
      occurrenceProcess: registrationForm.occurrenceProcess,
      manager: registrationForm.manager,
      productName: registrationForm.productName,
      partNo: registrationForm.partNo,
      lotNo: registrationForm.lotNo,
      defectQty: registrationForm.defectQty,
      defectType: registrationForm.defectType,
      defectContent: registrationForm.defectContent,
      reworkMethod: registrationForm.reworkMethod,
      reworkProcess: registrationForm.reworkProcess,
      estimatedTime: registrationForm.estimatedTime,
      requiredResources: registrationForm.requiredResources,
      reworkQty: 0,
      passQty: 0,
      failQty: 0,
      completionDate: "",
      inspectionItems: "",
      inspectionResult: "",
      inspector: "",
      status: "registered",
    };
    setRecords([newRecord, ...records]);
    setRegistrationForm({
      reworkNo: "",
      occurrenceDate: new Date().toISOString().split("T")[0],
      occurrenceProcess: "",
      manager: "",
      productName: "",
      partNo: "",
      lotNo: "",
      defectQty: 0,
      defectType: "",
      defectContent: "",
      reworkMethod: "",
      reworkProcess: "",
      estimatedTime: "",
      requiredResources: "",
    });
    alert("재작업이 등록되었습니다.");
  };

  const handleExecutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) {
      alert("실행할 재작업을 선택해주세요.");
      return;
    }
    const updatedRecords = records.map((r) =>
      r.id === selectedRecord.id
        ? {
            ...r,
            reworkQty: executionForm.reworkQty,
            passQty: executionForm.passQty,
            failQty: executionForm.failQty,
            completionDate: executionForm.completionDate,
            status: "completed" as const,
          }
        : r
    );
    setRecords(updatedRecords);
    setSelectedRecord(null);
    setExecutionForm({
      reworkQty: 0,
      passQty: 0,
      failQty: 0,
      completionDate: new Date().toISOString().split("T")[0],
    });
    alert("재작업 결과가 저장되었습니다.");
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) {
      alert("검사할 재작업을 선택해주세요.");
      return;
    }
    const newInspection: InspectionItem = {
      id: Date.now(),
      reworkId: selectedRecord.id,
      itemName: inspectionForm.itemName,
      standard: inspectionForm.standard,
      measuredValue: inspectionForm.measuredValue,
      result: inspectionForm.result as "pass" | "fail",
      inspector: inspectionForm.inspector,
      inspectionDate: inspectionForm.inspectionDate,
    };
    setInspectionItems([newInspection, ...inspectionItems]);

    // Update the record's inspection info
    const updatedRecords = records.map((r) =>
      r.id === selectedRecord.id
        ? {
            ...r,
            inspectionItems: inspectionForm.itemName,
            inspectionResult: inspectionForm.result === "pass" ? "합격" : "불합격",
            inspector: inspectionForm.inspector,
            status: inspectionForm.result === "pass" ? ("closed" as const) : r.status,
          }
        : r
    );
    setRecords(updatedRecords);

    setInspectionForm({
      itemName: "",
      standard: "",
      measuredValue: "",
      result: "",
      inspector: "",
      inspectionDate: new Date().toISOString().split("T")[0],
    });
    alert("재검사 결과가 저장되었습니다.");
  };

  const selectRecordForExecution = (record: ReworkRecord) => {
    setSelectedRecord(record);
    setExecutionForm({
      reworkQty: record.defectQty,
      passQty: 0,
      failQty: 0,
      completionDate: new Date().toISOString().split("T")[0],
    });
  };

  const selectRecordForInspection = (record: ReworkRecord) => {
    setSelectedRecord(record);
  };

  // Statistics for history tab
  const totalReworks = records.length;
  const completedReworks = records.filter((r) => r.status === "completed" || r.status === "closed").length;
  const totalDefectQty = records.reduce((sum, r) => sum + r.defectQty, 0);
  const totalPassQty = records.reduce((sum, r) => sum + r.passQty, 0);
  const totalFailQty = records.reduce((sum, r) => sum + r.failQty, 0);
  const reworkRate = totalDefectQty > 0 ? ((totalPassQty / totalDefectQty) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">재작업관리</h1>
          <p className="text-muted-foreground">재작업 등록, 실행, 검사 및 이력 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <Plus className="mr-2 h-4 w-4" />
            재작업 등록
          </TabsTrigger>
          <TabsTrigger value="execution">
            <Play className="mr-2 h-4 w-4" />
            재작업 실행
          </TabsTrigger>
          <TabsTrigger value="inspection">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            재검사
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            재작업 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                재작업 등록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                {/* Header Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>재작업번호</Label>
                      <Input
                        value={registrationForm.reworkNo}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, reworkNo: e.target.value })}
                        placeholder="자동생성"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>발생일 *</Label>
                      <Input
                        type="date"
                        value={registrationForm.occurrenceDate}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, occurrenceDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>발생공정 *</Label>
                      <Select
                        value={registrationForm.occurrenceProcess}
                        onValueChange={(v) => setRegistrationForm({ ...registrationForm, occurrenceProcess: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="도장">도장</SelectItem>
                          <SelectItem value="조립">조립</SelectItem>
                          <SelectItem value="사출">사출</SelectItem>
                          <SelectItem value="검사">검사</SelectItem>
                          <SelectItem value="포장">포장</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>담당자 *</Label>
                      <Input
                        value={registrationForm.manager}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, manager: e.target.value })}
                        placeholder="담당자명"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rework Info Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">재작업 정보</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>제품명 *</Label>
                      <Input
                        value={registrationForm.productName}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, productName: e.target.value })}
                        placeholder="제품명"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품번 *</Label>
                      <Input
                        value={registrationForm.partNo}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, partNo: e.target.value })}
                        placeholder="품번"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LOT번호 *</Label>
                      <Input
                        value={registrationForm.lotNo}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, lotNo: e.target.value })}
                        placeholder="LOT번호"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3 mt-4">
                    <div className="space-y-2">
                      <Label>불량수량 *</Label>
                      <Input
                        type="number"
                        value={registrationForm.defectQty}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, defectQty: parseInt(e.target.value) || 0 })}
                        min={0}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>불량유형 *</Label>
                      <Select
                        value={registrationForm.defectType}
                        onValueChange={(v) => setRegistrationForm({ ...registrationForm, defectType: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scratch">스크래치</SelectItem>
                          <SelectItem value="dent">찍힘</SelectItem>
                          <SelectItem value="paint">도장불량</SelectItem>
                          <SelectItem value="dimension">치수불량</SelectItem>
                          <SelectItem value="assembly">조립불량</SelectItem>
                          <SelectItem value="material">자재불량</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>불량내용 *</Label>
                      <Textarea
                        value={registrationForm.defectContent}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, defectContent: e.target.value })}
                        placeholder="불량 상세 내용"
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rework Plan Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4">재작업 계획</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>재작업 방법 *</Label>
                      <Textarea
                        value={registrationForm.reworkMethod}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, reworkMethod: e.target.value })}
                        placeholder="재작업 방법 상세 기술"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>필요자원</Label>
                      <Textarea
                        value={registrationForm.requiredResources}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, requiredResources: e.target.value })}
                        placeholder="필요한 인력, 장비, 자재 등"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label>재작업 공정 *</Label>
                      <Select
                        value={registrationForm.reworkProcess}
                        onValueChange={(v) => setRegistrationForm({ ...registrationForm, reworkProcess: v })}
                      >
                        <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="도장">도장</SelectItem>
                          <SelectItem value="조립">조립</SelectItem>
                          <SelectItem value="사출">사출</SelectItem>
                          <SelectItem value="검사">검사</SelectItem>
                          <SelectItem value="수정">수정</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>예상 소요시간</Label>
                      <Input
                        value={registrationForm.estimatedTime}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, estimatedTime: e.target.value })}
                        placeholder="예: 2시간, 1일"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    재작업 등록
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Execution */}
        <TabsContent value="execution">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>재작업 대상 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {records.filter((r) => r.status === "registered" || r.status === "in_progress").length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">실행 대기중인 재작업이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>재작업번호</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>불량수량</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>선택</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records
                        .filter((r) => r.status === "registered" || r.status === "in_progress")
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono">{record.reworkNo}</TableCell>
                            <TableCell>{record.productName}</TableCell>
                            <TableCell>{record.defectQty}</TableCell>
                            <TableCell>
                              <Badge variant={statusVariants[record.status]}>
                                {statusLabels[record.status]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={selectedRecord?.id === record.id ? "default" : "outline"}
                                onClick={() => selectRecordForExecution(record)}
                              >
                                선택
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  재작업 결과 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRecord ? (
                  <form onSubmit={handleExecutionSubmit} className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p><strong>재작업번호:</strong> {selectedRecord.reworkNo}</p>
                      <p><strong>제품명:</strong> {selectedRecord.productName}</p>
                      <p><strong>품번:</strong> {selectedRecord.partNo}</p>
                      <p><strong>불량유형:</strong> {defectTypeLabels[selectedRecord.defectType] || selectedRecord.defectType}</p>
                      <p><strong>불량수량:</strong> {selectedRecord.defectQty}개</p>
                      <p><strong>재작업 방법:</strong> {selectedRecord.reworkMethod}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>재작업 수량 *</Label>
                        <Input
                          type="number"
                          value={executionForm.reworkQty}
                          onChange={(e) => setExecutionForm({ ...executionForm, reworkQty: parseInt(e.target.value) || 0 })}
                          min={0}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>합격수량 *</Label>
                        <Input
                          type="number"
                          value={executionForm.passQty}
                          onChange={(e) => setExecutionForm({ ...executionForm, passQty: parseInt(e.target.value) || 0 })}
                          min={0}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>불합격수량 (폐기)</Label>
                        <Input
                          type="number"
                          value={executionForm.failQty}
                          onChange={(e) => setExecutionForm({ ...executionForm, failQty: parseInt(e.target.value) || 0 })}
                          min={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>재작업 완료일 *</Label>
                        <Input
                          type="date"
                          value={executionForm.completionDate}
                          onChange={(e) => setExecutionForm({ ...executionForm, completionDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setSelectedRecord(null)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        결과 저장
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="text-muted-foreground py-8 text-center">왼쪽 목록에서 재작업을 선택해주세요.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Re-inspection */}
        <TabsContent value="inspection">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>재검사 대상 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {records.filter((r) => r.status === "completed").length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">재검사 대기중인 재작업이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>재작업번호</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>합격수량</TableHead>
                        <TableHead>선택</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records
                        .filter((r) => r.status === "completed")
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono">{record.reworkNo}</TableCell>
                            <TableCell>{record.productName}</TableCell>
                            <TableCell>{record.passQty}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={selectedRecord?.id === record.id ? "default" : "outline"}
                                onClick={() => selectRecordForInspection(record)}
                              >
                                선택
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  재검사 결과 입력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRecord && selectedRecord.status === "completed" ? (
                  <form onSubmit={handleInspectionSubmit} className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p><strong>재작업번호:</strong> {selectedRecord.reworkNo}</p>
                      <p><strong>제품명:</strong> {selectedRecord.productName}</p>
                      <p><strong>품번:</strong> {selectedRecord.partNo}</p>
                      <p><strong>재작업 수량:</strong> {selectedRecord.reworkQty}개</p>
                      <p><strong>합격 수량:</strong> {selectedRecord.passQty}개</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>검사항목 *</Label>
                        <Input
                          value={inspectionForm.itemName}
                          onChange={(e) => setInspectionForm({ ...inspectionForm, itemName: e.target.value })}
                          placeholder="검사항목명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사기준 *</Label>
                        <Input
                          value={inspectionForm.standard}
                          onChange={(e) => setInspectionForm({ ...inspectionForm, standard: e.target.value })}
                          placeholder="예: 0.5mm 이하"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>측정값</Label>
                        <Input
                          value={inspectionForm.measuredValue}
                          onChange={(e) => setInspectionForm({ ...inspectionForm, measuredValue: e.target.value })}
                          placeholder="측정된 값"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사결과 *</Label>
                        <Select
                          value={inspectionForm.result}
                          onValueChange={(v) => setInspectionForm({ ...inspectionForm, result: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pass">합격</SelectItem>
                            <SelectItem value="fail">불합격</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>검사자 *</Label>
                        <Input
                          value={inspectionForm.inspector}
                          onChange={(e) => setInspectionForm({ ...inspectionForm, inspector: e.target.value })}
                          placeholder="검사자명"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사일 *</Label>
                        <Input
                          type="date"
                          value={inspectionForm.inspectionDate}
                          onChange={(e) => setInspectionForm({ ...inspectionForm, inspectionDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setSelectedRecord(null)}>
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        검사결과 저장
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="text-muted-foreground py-8 text-center">왼쪽 목록에서 재작업을 선택해주세요.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Inspection History */}
          {inspectionItems.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>재검사 이력</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검사일</TableHead>
                      <TableHead>검사항목</TableHead>
                      <TableHead>검사기준</TableHead>
                      <TableHead>측정값</TableHead>
                      <TableHead>결과</TableHead>
                      <TableHead>검사자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.inspectionDate}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.standard}</TableCell>
                        <TableCell>{item.measuredValue}</TableCell>
                        <TableCell>
                          {item.result === "pass" ? (
                            <Badge variant="success" className="flex items-center gap-1 w-fit">
                              <CheckCircle className="h-3 w-3" />
                              합격
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <XCircle className="h-3 w-3" />
                              불합격
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.inspector}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-5 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalReworks}</p>
                  <p className="text-sm text-muted-foreground">총 재작업</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{completedReworks}</p>
                  <p className="text-sm text-muted-foreground">완료/종결</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalDefectQty}</p>
                  <p className="text-sm text-muted-foreground">총 불량수량</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{totalPassQty}</p>
                  <p className="text-sm text-muted-foreground">합격수량</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{reworkRate}%</p>
                  <p className="text-sm text-muted-foreground">재작업 성공률</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                재작업 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 재작업 이력이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>재작업번호</TableHead>
                      <TableHead>발생일</TableHead>
                      <TableHead>발생공정</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>품번</TableHead>
                      <TableHead>불량유형</TableHead>
                      <TableHead>불량수량</TableHead>
                      <TableHead>합격수량</TableHead>
                      <TableHead>불합격수량</TableHead>
                      <TableHead>완료일</TableHead>
                      <TableHead>검사결과</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.reworkNo}</TableCell>
                        <TableCell>{record.occurrenceDate}</TableCell>
                        <TableCell>{record.occurrenceProcess}</TableCell>
                        <TableCell>{record.productName}</TableCell>
                        <TableCell>{record.partNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {defectTypeLabels[record.defectType] || record.defectType}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.defectQty}</TableCell>
                        <TableCell className="text-green-600">{record.passQty || "-"}</TableCell>
                        <TableCell className="text-red-600">{record.failQty || "-"}</TableCell>
                        <TableCell>{record.completionDate || "-"}</TableCell>
                        <TableCell>
                          {record.inspectionResult ? (
                            record.inspectionResult === "합격" ? (
                              <Badge variant="success">합격</Badge>
                            ) : (
                              <Badge variant="destructive">불합격</Badge>
                            )
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[record.status]}>
                            {statusLabels[record.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
