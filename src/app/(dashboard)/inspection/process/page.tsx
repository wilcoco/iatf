"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Save, Trash2, CheckCircle, XCircle } from "lucide-react";

// Types
interface InspectionItem {
  id: number;
  itemName: string;
  method: string;
  standard: string;
  measuredValue: string;
  result: "합격" | "불합격" | "";
}

interface NonconformityRecord {
  id: number;
  content: string;
  treatment: "재작업" | "선별" | "폐기" | "";
  quantity: number;
}

interface ProcessInspectionRecord {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  lineProcess: string;
  inspector: string;
  productName: string;
  partNumber: string;
  lotNumber: string;
  productionQuantity: number;
  inspectionType: "초물검사" | "순회검사" | "최종검사";
  inspectionItems: InspectionItem[];
  nonconformities: NonconformityRecord[];
  overallResult: "합격" | "불합격" | "진행중";
  createdAt: string;
}

export default function ProcessInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Registration form state
  const [formData, setFormData] = useState({
    inspectionNo: `PI-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${String(Date.now()).slice(-4)}`,
    inspectionDate: new Date().toISOString().split("T")[0],
    lineProcess: "",
    inspector: "",
    productName: "",
    partNumber: "",
    lotNumber: "",
    productionQuantity: 0,
    inspectionType: "" as "초물검사" | "순회검사" | "최종검사" | "",
  });

  // Inspection items state
  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    { id: 1, itemName: "", method: "", standard: "", measuredValue: "", result: "" },
  ]);

  // Nonconformity state
  const [nonconformities, setNonconformities] = useState<NonconformityRecord[]>([]);
  const [newNonconformity, setNewNonconformity] = useState({
    content: "",
    treatment: "" as "재작업" | "선별" | "폐기" | "",
    quantity: 0,
  });

  // History state
  const [history, setHistory] = useState<ProcessInspectionRecord[]>([]);

  // Add inspection item
  const addInspectionItem = () => {
    setInspectionItems([
      ...inspectionItems,
      { id: Date.now(), itemName: "", method: "", standard: "", measuredValue: "", result: "" },
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

  // Add nonconformity
  const addNonconformity = () => {
    if (newNonconformity.content && newNonconformity.treatment && newNonconformity.quantity > 0) {
      setNonconformities([
        ...nonconformities,
        { id: Date.now(), ...newNonconformity },
      ]);
      setNewNonconformity({ content: "", treatment: "", quantity: 0 });
    }
  };

  // Remove nonconformity
  const removeNonconformity = (id: number) => {
    setNonconformities(nonconformities.filter((nc) => nc.id !== id));
  };

  // Calculate overall result
  const calculateOverallResult = (): "합격" | "불합격" | "진행중" => {
    const completedItems = inspectionItems.filter((item) => item.result !== "");
    if (completedItems.length === 0) return "진행중";
    if (completedItems.length < inspectionItems.length) return "진행중";
    if (completedItems.some((item) => item.result === "불합격")) return "불합격";
    return "합격";
  };

  // Save inspection
  const handleSaveInspection = () => {
    if (!formData.inspectionType || !formData.lineProcess || !formData.inspector) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newRecord: ProcessInspectionRecord = {
      id: Date.now(),
      inspectionNo: formData.inspectionNo,
      inspectionDate: formData.inspectionDate,
      lineProcess: formData.lineProcess,
      inspector: formData.inspector,
      productName: formData.productName,
      partNumber: formData.partNumber,
      lotNumber: formData.lotNumber,
      productionQuantity: formData.productionQuantity,
      inspectionType: formData.inspectionType as "초물검사" | "순회검사" | "최종검사",
      inspectionItems: [...inspectionItems],
      nonconformities: [...nonconformities],
      overallResult: calculateOverallResult(),
      createdAt: new Date().toISOString(),
    };

    setHistory([newRecord, ...history]);

    // Reset form
    setFormData({
      inspectionNo: `PI-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${String(Date.now()).slice(-4)}`,
      inspectionDate: new Date().toISOString().split("T")[0],
      lineProcess: "",
      inspector: "",
      productName: "",
      partNumber: "",
      lotNumber: "",
      productionQuantity: 0,
      inspectionType: "",
    });
    setInspectionItems([{ id: 1, itemName: "", method: "", standard: "", measuredValue: "", result: "" }]);
    setNonconformities([]);

    alert("공정검사가 저장되었습니다.");
    setActiveTab("history");
  };

  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getInspectionTypeVariant = (type: string) => {
    switch (type) {
      case "초물검사":
        return "default";
      case "순회검사":
        return "secondary";
      case "최종검사":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공정검사</h1>
          <p className="text-muted-foreground">초물검사, 순회검사, 최종검사 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">검사 등록</TabsTrigger>
          <TabsTrigger value="items">검사 항목</TabsTrigger>
          <TabsTrigger value="nonconformity">부적합 처리</TabsTrigger>
          <TabsTrigger value="history">검사 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                검사 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>검사번호</Label>
                    <Input value={formData.inspectionNo} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>검사일 *</Label>
                    <Input
                      type="date"
                      value={formData.inspectionDate}
                      onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>라인/공정 *</Label>
                    <Input
                      value={formData.lineProcess}
                      onChange={(e) => setFormData({ ...formData, lineProcess: e.target.value })}
                      placeholder="라인/공정명"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>검사자 *</Label>
                    <Input
                      value={formData.inspector}
                      onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                      placeholder="검사자명"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Information Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">제품 정보</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>제품명 *</Label>
                    <Input
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="제품명"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품번</Label>
                    <Input
                      value={formData.partNumber}
                      onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                      placeholder="품번"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LOT번호 *</Label>
                    <Input
                      value={formData.lotNumber}
                      onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                      placeholder="LOT번호"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>생산수량</Label>
                    <Input
                      type="number"
                      value={formData.productionQuantity || ""}
                      onChange={(e) => setFormData({ ...formData, productionQuantity: parseInt(e.target.value) || 0 })}
                      placeholder="수량"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Inspection Type Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">검사 유형 *</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.inspectionType === "초물검사"
                        ? "border-primary ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, inspectionType: "초물검사" })}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold">초물검사</h4>
                      <p className="text-sm text-muted-foreground mt-1">작업 시작 시 첫 제품 검사</p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.inspectionType === "순회검사"
                        ? "border-primary ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, inspectionType: "순회검사" })}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold">순회검사</h4>
                      <p className="text-sm text-muted-foreground mt-1">정기적 공정 순회 검사</p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      formData.inspectionType === "최종검사"
                        ? "border-primary ring-2 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, inspectionType: "최종검사" })}
                  >
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold">최종검사</h4>
                      <p className="text-sm text-muted-foreground mt-1">공정 완료 후 최종 검사</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("items")}>
                  다음: 검사 항목
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Inspection Items */}
        <TabsContent value="items">
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
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspectionItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateInspectionItem(item.id, "itemName", e.target.value)}
                          placeholder="검사항목명"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.method}
                          onChange={(e) => updateInspectionItem(item.id, "method", e.target.value)}
                          placeholder="검사방법"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.standard}
                          onChange={(e) => updateInspectionItem(item.id, "standard", e.target.value)}
                          placeholder="규격/기준"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.measuredValue}
                          onChange={(e) => updateInspectionItem(item.id, "measuredValue", e.target.value)}
                          placeholder="측정값"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.result}
                          onValueChange={(v) => updateInspectionItem(item.id, "result", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="합격">
                              <span className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                합격
                              </span>
                            </SelectItem>
                            <SelectItem value="불합격">
                              <span className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-500" />
                                불합격
                              </span>
                            </SelectItem>
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
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("registration")}>
                  이전: 검사 등록
                </Button>
                <div className="flex gap-2">
                  {inspectionItems.some((item) => item.result === "불합격") && (
                    <Button variant="destructive" onClick={() => setActiveTab("nonconformity")}>
                      부적합 처리
                    </Button>
                  )}
                  <Button onClick={() => setActiveTab("nonconformity")}>
                    다음: 부적합 처리
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Nonconformity Handling */}
        <TabsContent value="nonconformity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                부적합 처리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Nonconformity Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold">부적합 등록</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2 md:col-span-3">
                    <Label>부적합 내용</Label>
                    <Textarea
                      value={newNonconformity.content}
                      onChange={(e) => setNewNonconformity({ ...newNonconformity, content: e.target.value })}
                      placeholder="부적합 내용을 상세히 기술하세요"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>처리방법</Label>
                    <Select
                      value={newNonconformity.treatment}
                      onValueChange={(v) => setNewNonconformity({ ...newNonconformity, treatment: v as "재작업" | "선별" | "폐기" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="재작업">재작업</SelectItem>
                        <SelectItem value="선별">선별</SelectItem>
                        <SelectItem value="폐기">폐기</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>수량</Label>
                    <Input
                      type="number"
                      value={newNonconformity.quantity || ""}
                      onChange={(e) => setNewNonconformity({ ...newNonconformity, quantity: parseInt(e.target.value) || 0 })}
                      placeholder="수량"
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addNonconformity} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      추가
                    </Button>
                  </div>
                </div>
              </div>

              {/* Nonconformity List */}
              {nonconformities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No.</TableHead>
                      <TableHead>부적합 내용</TableHead>
                      <TableHead className="w-[120px]">처리방법</TableHead>
                      <TableHead className="w-[100px]">수량</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nonconformities.map((nc, index) => (
                      <TableRow key={nc.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{nc.content}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              nc.treatment === "폐기"
                                ? "destructive"
                                : nc.treatment === "재작업"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {nc.treatment}
                          </Badge>
                        </TableCell>
                        <TableCell>{nc.quantity.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeNonconformity(nc.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  등록된 부적합 내역이 없습니다.
                </p>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab("items")}>
                  이전: 검사 항목
                </Button>
                <Button onClick={handleSaveInspection}>
                  <Save className="mr-2 h-4 w-4" />
                  검사 저장
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
                <ClipboardCheck className="h-5 w-5" />
                검사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  등록된 검사 이력이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검사번호</TableHead>
                      <TableHead>검사일</TableHead>
                      <TableHead>라인/공정</TableHead>
                      <TableHead>검사유형</TableHead>
                      <TableHead>제품명</TableHead>
                      <TableHead>LOT번호</TableHead>
                      <TableHead>생산수량</TableHead>
                      <TableHead>검사자</TableHead>
                      <TableHead>판정</TableHead>
                      <TableHead>부적합</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.inspectionNo}</TableCell>
                        <TableCell>{record.inspectionDate}</TableCell>
                        <TableCell>{record.lineProcess}</TableCell>
                        <TableCell>
                          <Badge variant={getInspectionTypeVariant(record.inspectionType)}>
                            {record.inspectionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.productName}</TableCell>
                        <TableCell>{record.lotNumber}</TableCell>
                        <TableCell>{record.productionQuantity.toLocaleString()}</TableCell>
                        <TableCell>{record.inspector}</TableCell>
                        <TableCell>
                          <Badge variant={getResultVariant(record.overallResult)}>
                            {record.overallResult}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.nonconformities.length > 0 ? (
                            <Badge variant="destructive">
                              {record.nonconformities.length}건
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
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
