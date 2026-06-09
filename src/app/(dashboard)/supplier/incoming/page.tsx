"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Plus, Trash2, Save, FileText, History, Package, CheckCircle } from "lucide-react";

// Types
interface InspectionItem {
  id: number;
  itemName: string;
  method: string;
  standard: string;
  measuredValue: string;
  result: "pass" | "fail" | "";
}

interface InspectionRecord {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  inspector: string;
  supplierName: string;
  productName: string;
  productNo: string;
  receivedQty: number;
  lotNo: string;
  orderNo: string;
  items: InspectionItem[];
  finalJudgment: "pass" | "fail" | "conditional" | "";
  dispositionMethod: "return" | "special" | "sorting" | "";
  remarks: string;
  certificateFile: string;
}

// Generate inspection number
function generateInspectionNo(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `INS-${year}${month}${day}-${seq}`;
}

export default function IncomingInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Header info
  const [header, setHeader] = useState({
    inspectionNo: generateInspectionNo(),
    inspectionDate: new Date().toISOString().slice(0, 10),
    inspector: "",
    supplierName: "",
  });

  // Incoming info
  const [incomingInfo, setIncomingInfo] = useState({
    productName: "",
    productNo: "",
    receivedQty: "",
    lotNo: "",
    orderNo: "",
  });

  // Inspection items
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    { id: 1, itemName: "", method: "", standard: "", measuredValue: "", result: "" },
  ]);

  // Judgment
  const [judgment, setJudgment] = useState({
    finalJudgment: "" as "pass" | "fail" | "conditional" | "",
    dispositionMethod: "" as "return" | "special" | "sorting" | "",
    remarks: "",
    certificateFile: "",
  });

  // History
  const [history, setHistory] = useState<InspectionRecord[]>([]);

  // Add inspection item
  const addInspectionItem = () => {
    const newId = Math.max(...inspectionItems.map((i) => i.id), 0) + 1;
    setInspectionItems([
      ...inspectionItems,
      { id: newId, itemName: "", method: "", standard: "", measuredValue: "", result: "" },
    ]);
  };

  // Remove inspection item
  const removeInspectionItem = (id: number) => {
    if (inspectionItems.length > 1) {
      setInspectionItems(inspectionItems.filter((item) => item.id !== id));
    }
  };

  // Update inspection item
  const updateInspectionItem = (id: number, field: keyof InspectionItem, value: string) => {
    setInspectionItems(
      inspectionItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Calculate overall result based on items
  const calculateOverallResult = (): "pass" | "fail" | "conditional" | "" => {
    const results = inspectionItems.filter((i) => i.result !== "");
    if (results.length === 0) return "";
    const hasFailure = results.some((i) => i.result === "fail");
    if (hasFailure) return "fail";
    return "pass";
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!header.inspector || !header.supplierName) {
      alert("검사자와 공급업체명을 입력해주세요.");
      return;
    }
    if (!incomingInfo.productName || !incomingInfo.productNo) {
      alert("품명과 품번을 입력해주세요.");
      return;
    }
    if (!judgment.finalJudgment) {
      alert("종합판정을 선택해주세요.");
      return;
    }

    const newRecord: InspectionRecord = {
      id: Date.now(),
      inspectionNo: header.inspectionNo,
      inspectionDate: header.inspectionDate,
      inspector: header.inspector,
      supplierName: header.supplierName,
      productName: incomingInfo.productName,
      productNo: incomingInfo.productNo,
      receivedQty: Number(incomingInfo.receivedQty) || 0,
      lotNo: incomingInfo.lotNo,
      orderNo: incomingInfo.orderNo,
      items: [...inspectionItems],
      finalJudgment: judgment.finalJudgment,
      dispositionMethod: judgment.dispositionMethod,
      remarks: judgment.remarks,
      certificateFile: judgment.certificateFile,
    };

    setHistory([newRecord, ...history]);

    // Reset form
    setHeader({
      inspectionNo: generateInspectionNo(),
      inspectionDate: new Date().toISOString().slice(0, 10),
      inspector: "",
      supplierName: "",
    });
    setIncomingInfo({
      productName: "",
      productNo: "",
      receivedQty: "",
      lotNo: "",
      orderNo: "",
    });
    setInspectionItems([
      { id: 1, itemName: "", method: "", standard: "", measuredValue: "", result: "" },
    ]);
    setJudgment({
      finalJudgment: "",
      dispositionMethod: "",
      remarks: "",
      certificateFile: "",
    });

    alert("검사 결과가 저장되었습니다.");
    setActiveTab("history");
  };

  const getJudgmentBadge = (result: string) => {
    switch (result) {
      case "pass":
        return <Badge variant="success">합격</Badge>;
      case "fail":
        return <Badge variant="destructive">불합격</Badge>;
      case "conditional":
        return <Badge variant="warning">조건부합격</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getDispositionText = (method: string) => {
    switch (method) {
      case "return":
        return "반품";
      case "special":
        return "특채";
      case "sorting":
        return "선별사용";
      default:
        return "-";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">수입검사</h1>
          <p className="text-muted-foreground">입고 자재 품질 검사 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <Package className="mr-2 h-4 w-4" />
            입고 등록
          </TabsTrigger>
          <TabsTrigger value="inspection">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            검사 항목
          </TabsTrigger>
          <TabsTrigger value="judgment">
            <CheckCircle className="mr-2 h-4 w-4" />
            판정 및 처리
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            검사 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Incoming Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                입고 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Section */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">검사 기본정보</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>검사번호</Label>
                    <Input value={header.inspectionNo} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>검사일 *</Label>
                    <Input
                      type="date"
                      value={header.inspectionDate}
                      onChange={(e) => setHeader({ ...header, inspectionDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>검사자 *</Label>
                    <Input
                      value={header.inspector}
                      onChange={(e) => setHeader({ ...header, inspector: e.target.value })}
                      placeholder="검사자명"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>공급업체명 *</Label>
                    <Input
                      value={header.supplierName}
                      onChange={(e) => setHeader({ ...header, supplierName: e.target.value })}
                      placeholder="공급업체명"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Incoming Info Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">입고 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>품명 *</Label>
                    <Input
                      value={incomingInfo.productName}
                      onChange={(e) => setIncomingInfo({ ...incomingInfo, productName: e.target.value })}
                      placeholder="품명"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Input
                      value={incomingInfo.productNo}
                      onChange={(e) => setIncomingInfo({ ...incomingInfo, productNo: e.target.value })}
                      placeholder="P-0001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>입고수량</Label>
                    <Input
                      type="number"
                      value={incomingInfo.receivedQty}
                      onChange={(e) => setIncomingInfo({ ...incomingInfo, receivedQty: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LOT번호</Label>
                    <Input
                      value={incomingInfo.lotNo}
                      onChange={(e) => setIncomingInfo({ ...incomingInfo, lotNo: e.target.value })}
                      placeholder="LOT-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>발주번호</Label>
                    <Input
                      value={incomingInfo.orderNo}
                      onChange={(e) => setIncomingInfo({ ...incomingInfo, orderNo: e.target.value })}
                      placeholder="PO-2024-001"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("inspection")}>
                  다음: 검사 항목
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Inspection Items */}
        <TabsContent value="inspection">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  검사 항목
                </span>
                <Button onClick={addInspectionItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>검사항목명</TableHead>
                    <TableHead>검사방법</TableHead>
                    <TableHead>규격/기준</TableHead>
                    <TableHead>측정값</TableHead>
                    <TableHead className="w-[120px]">판정</TableHead>
                    <TableHead className="w-[60px]">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspectionItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateInspectionItem(item.id, "itemName", e.target.value)}
                          placeholder="외관검사"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.method}
                          onChange={(e) => updateInspectionItem(item.id, "method", e.target.value)}
                          placeholder="육안검사"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.standard}
                          onChange={(e) => updateInspectionItem(item.id, "standard", e.target.value)}
                          placeholder="10.0 +/- 0.1mm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.measuredValue}
                          onChange={(e) => updateInspectionItem(item.id, "measuredValue", e.target.value)}
                          placeholder="10.05mm"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.result}
                          onValueChange={(value) => updateInspectionItem(item.id, "result", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pass">합격</SelectItem>
                            <SelectItem value="fail">불합격</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInspectionItem(item.id)}
                          disabled={inspectionItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>검사 결과 요약:</strong>{" "}
                  {inspectionItems.filter((i) => i.result === "pass").length}건 합격 /{" "}
                  {inspectionItems.filter((i) => i.result === "fail").length}건 불합격 /{" "}
                  {inspectionItems.filter((i) => i.result === "").length}건 미판정
                </p>
                <p className="text-sm mt-1">
                  <strong>자동 판정 결과:</strong> {getJudgmentBadge(calculateOverallResult())}
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("registration")}>
                  이전: 입고 등록
                </Button>
                <Button onClick={() => setActiveTab("judgment")}>
                  다음: 판정 및 처리
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Judgment and Disposition */}
        <TabsContent value="judgment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                판정 및 처리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final Judgment */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">종합판정</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>종합판정 *</Label>
                    <Select
                      value={judgment.finalJudgment}
                      onValueChange={(value) =>
                        setJudgment({ ...judgment, finalJudgment: value as "pass" | "fail" | "conditional" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="판정 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">합격</SelectItem>
                        <SelectItem value="fail">불합격</SelectItem>
                        <SelectItem value="conditional">조건부합격</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(judgment.finalJudgment === "fail" || judgment.finalJudgment === "conditional") && (
                    <div className="space-y-2">
                      <Label>불합격시 처리방법</Label>
                      <Select
                        value={judgment.dispositionMethod}
                        onValueChange={(value) =>
                          setJudgment({ ...judgment, dispositionMethod: value as "return" | "special" | "sorting" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="처리방법 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="return">반품</SelectItem>
                          <SelectItem value="special">특채</SelectItem>
                          <SelectItem value="sorting">선별사용</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Attachment */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-4">검사성적서</h3>
                <div className="space-y-2">
                  <Label>공급업체 성적서 첨부</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setJudgment({ ...judgment, certificateFile: file.name });
                        }
                      }}
                      className="flex-1"
                    />
                    {judgment.certificateFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        {judgment.certificateFile}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <h3 className="text-lg font-semibold mb-4">비고</h3>
                <Textarea
                  value={judgment.remarks}
                  onChange={(e) => setJudgment({ ...judgment, remarks: e.target.value })}
                  placeholder="검사 관련 특이사항을 입력하세요..."
                  rows={4}
                />
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("inspection")}>
                  이전: 검사 항목
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  검사 결과 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                검사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">검사 이력이 없습니다.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검사번호</TableHead>
                      <TableHead>검사일</TableHead>
                      <TableHead>검사자</TableHead>
                      <TableHead>공급업체</TableHead>
                      <TableHead>품명</TableHead>
                      <TableHead>품번</TableHead>
                      <TableHead className="text-right">입고수량</TableHead>
                      <TableHead>LOT번호</TableHead>
                      <TableHead>종합판정</TableHead>
                      <TableHead>처리방법</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.inspectionNo}</TableCell>
                        <TableCell>{record.inspectionDate}</TableCell>
                        <TableCell>{record.inspector}</TableCell>
                        <TableCell>{record.supplierName}</TableCell>
                        <TableCell>{record.productName}</TableCell>
                        <TableCell className="font-mono">{record.productNo}</TableCell>
                        <TableCell className="text-right">{record.receivedQty.toLocaleString()}</TableCell>
                        <TableCell className="font-mono">{record.lotNo || "-"}</TableCell>
                        <TableCell>{getJudgmentBadge(record.finalJudgment)}</TableCell>
                        <TableCell>{getDispositionText(record.dispositionMethod)}</TableCell>
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
