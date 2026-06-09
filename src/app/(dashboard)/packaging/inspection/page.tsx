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
import { ClipboardList, Package, Save, Search, CheckCircle, XCircle } from "lucide-react";

// Types
interface LabelCheck {
  productCode: boolean;
  productName: boolean;
  quantity: boolean;
  lot: boolean;
  barcode: boolean;
}

interface PackagingMaterialCheck {
  box: boolean;
  vinyl: boolean;
  cushion: boolean;
}

interface StackingCheck {
  height: boolean;
  stability: boolean;
}

interface AppearanceCheck {
  damage: boolean;
  contamination: boolean;
}

interface InspectionChecklist {
  label: LabelCheck;
  packagingMaterial: PackagingMaterialCheck;
  stacking: StackingCheck;
  appearance: AppearanceCheck;
}

interface PackagingInspection {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  inspector: string;
  productName: string;
  productCode: string;
  quantity: number;
  destination: string;
  checklist: InspectionChecklist;
  overallResult: "합격" | "불합격" | "보류";
  remarks: string;
  createdAt: string;
}

// Initial checklist state
const initialChecklist: InspectionChecklist = {
  label: {
    productCode: false,
    productName: false,
    quantity: false,
    lot: false,
    barcode: false,
  },
  packagingMaterial: {
    box: false,
    vinyl: false,
    cushion: false,
  },
  stacking: {
    height: false,
    stability: false,
  },
  appearance: {
    damage: false,
    contamination: false,
  },
};

// Generate inspection number
const generateInspectionNo = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `PKG-${dateStr}-${random}`;
};

export default function PackagingInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [records, setRecords] = useState<PackagingInspection[]>([]);
  const [search, setSearch] = useState("");

  // Registration form state
  const [formData, setFormData] = useState({
    inspectionNo: generateInspectionNo(),
    inspectionDate: new Date().toISOString().split("T")[0],
    inspector: "",
    productName: "",
    productCode: "",
    quantity: 0,
    destination: "",
    remarks: "",
  });

  // Checklist state
  const [checklist, setChecklist] = useState<InspectionChecklist>(initialChecklist);

  // Calculate overall result based on checklist
  const calculateOverallResult = (): "합격" | "불합격" | "보류" => {
    const allChecks = [
      ...Object.values(checklist.label),
      ...Object.values(checklist.packagingMaterial),
      ...Object.values(checklist.stacking),
      ...Object.values(checklist.appearance),
    ];
    const passCount = allChecks.filter(Boolean).length;
    if (passCount === allChecks.length) return "합격";
    if (passCount === 0) return "보류";
    return "불합격";
  };

  // Check if registration is complete
  const isRegistrationComplete = () => {
    return (
      formData.inspector.trim() !== "" &&
      formData.productName.trim() !== "" &&
      formData.productCode.trim() !== "" &&
      formData.quantity > 0 &&
      formData.destination.trim() !== ""
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isRegistrationComplete()) {
      alert("검사 등록 정보를 먼저 입력해주세요.");
      setActiveTab("registration");
      return;
    }

    const newRecord: PackagingInspection = {
      id: Date.now(),
      inspectionNo: formData.inspectionNo,
      inspectionDate: formData.inspectionDate,
      inspector: formData.inspector,
      productName: formData.productName,
      productCode: formData.productCode,
      quantity: formData.quantity,
      destination: formData.destination,
      checklist: { ...checklist },
      overallResult: calculateOverallResult(),
      remarks: formData.remarks,
      createdAt: new Date().toISOString(),
    };

    setRecords([newRecord, ...records]);

    // Reset form
    setFormData({
      inspectionNo: generateInspectionNo(),
      inspectionDate: new Date().toISOString().split("T")[0],
      inspector: "",
      productName: "",
      productCode: "",
      quantity: 0,
      destination: "",
      remarks: "",
    });
    setChecklist(initialChecklist);

    alert("포장검사가 등록되었습니다.");
    setActiveTab("history");
  };

  // Filter records for history
  const filteredRecords = records.filter(
    (r) =>
      r.inspectionNo.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.productCode.toLowerCase().includes(search.toLowerCase()) ||
      r.inspector.toLowerCase().includes(search.toLowerCase())
  );

  // Get result badge variant
  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "보류":
        return "warning";
      default:
        return "outline";
    }
  };

  // Render checkbox item
  const renderCheckItem = (
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void
  ) => (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={label}
            checked={checked}
            onChange={() => onChange(true)}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm text-green-600 font-medium">합격</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={label}
            checked={!checked}
            onChange={() => onChange(false)}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-sm text-red-600 font-medium">불합격</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">포장검사</h1>
          <p className="text-muted-foreground">포장 상태 검사 및 품질 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="registration">검사 등록</TabsTrigger>
          <TabsTrigger value="checklist">검사 항목</TabsTrigger>
          <TabsTrigger value="history">검사 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Registration */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                검사 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                <div className="grid gap-4 md:grid-cols-3">
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
                    <Label>검사자 *</Label>
                    <Input
                      value={formData.inspector}
                      onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                      placeholder="검사자명 입력"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">제품정보</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>제품명 *</Label>
                    <Input
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="제품명 입력"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>품번 *</Label>
                    <Input
                      value={formData.productCode}
                      onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                      placeholder="품번 입력"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>수량 *</Label>
                    <Input
                      type="number"
                      value={formData.quantity || ""}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      placeholder="수량 입력"
                      min={0}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>출하처 *</Label>
                    <Select
                      value={formData.destination}
                      onValueChange={(v) => setFormData({ ...formData, destination: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="출하처 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="현대자동차">현대자동차</SelectItem>
                        <SelectItem value="기아자동차">기아자동차</SelectItem>
                        <SelectItem value="GM코리아">GM코리아</SelectItem>
                        <SelectItem value="르노코리아">르노코리아</SelectItem>
                        <SelectItem value="쌍용자동차">쌍용자동차</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label>비고</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="추가 메모 사항을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("checklist")} disabled={!isRegistrationComplete()}>
                  다음: 검사 항목으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Checklist */}
        <TabsContent value="checklist">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Label Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">라벨 검사</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCheckItem("품번", checklist.label.productCode, (v) =>
                  setChecklist({ ...checklist, label: { ...checklist.label, productCode: v } })
                )}
                {renderCheckItem("품명", checklist.label.productName, (v) =>
                  setChecklist({ ...checklist, label: { ...checklist.label, productName: v } })
                )}
                {renderCheckItem("수량", checklist.label.quantity, (v) =>
                  setChecklist({ ...checklist, label: { ...checklist.label, quantity: v } })
                )}
                {renderCheckItem("LOT", checklist.label.lot, (v) =>
                  setChecklist({ ...checklist, label: { ...checklist.label, lot: v } })
                )}
                {renderCheckItem("바코드", checklist.label.barcode, (v) =>
                  setChecklist({ ...checklist, label: { ...checklist.label, barcode: v } })
                )}
              </CardContent>
            </Card>

            {/* Packaging Material Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">포장재 검사</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCheckItem("박스", checklist.packagingMaterial.box, (v) =>
                  setChecklist({ ...checklist, packagingMaterial: { ...checklist.packagingMaterial, box: v } })
                )}
                {renderCheckItem("비닐", checklist.packagingMaterial.vinyl, (v) =>
                  setChecklist({ ...checklist, packagingMaterial: { ...checklist.packagingMaterial, vinyl: v } })
                )}
                {renderCheckItem("완충재", checklist.packagingMaterial.cushion, (v) =>
                  setChecklist({ ...checklist, packagingMaterial: { ...checklist.packagingMaterial, cushion: v } })
                )}
              </CardContent>
            </Card>

            {/* Stacking Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">적재상태 검사</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCheckItem("높이", checklist.stacking.height, (v) =>
                  setChecklist({ ...checklist, stacking: { ...checklist.stacking, height: v } })
                )}
                {renderCheckItem("안정성", checklist.stacking.stability, (v) =>
                  setChecklist({ ...checklist, stacking: { ...checklist.stacking, stability: v } })
                )}
              </CardContent>
            </Card>

            {/* Appearance Check */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">외관상태 검사</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCheckItem("파손 여부", checklist.appearance.damage, (v) =>
                  setChecklist({ ...checklist, appearance: { ...checklist.appearance, damage: v } })
                )}
                {renderCheckItem("오염 여부", checklist.appearance.contamination, (v) =>
                  setChecklist({ ...checklist, appearance: { ...checklist.appearance, contamination: v } })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Overall Result */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">종합 판정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    검사 항목 결과에 따른 자동 판정
                  </p>
                  <div className="flex items-center gap-2">
                    {calculateOverallResult() === "합격" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <Badge variant={getResultVariant(calculateOverallResult())} className="text-lg px-4 py-1">
                      {calculateOverallResult()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("registration")}>
                    이전
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    검사 완료 및 저장
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                검사 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검사번호, 제품명, 품번, 검사자로 검색..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredRecords.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">등록된 검사 기록이 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>검사번호</TableHead>
                        <TableHead>검사일</TableHead>
                        <TableHead>제품명</TableHead>
                        <TableHead>품번</TableHead>
                        <TableHead>수량</TableHead>
                        <TableHead>출하처</TableHead>
                        <TableHead>판정</TableHead>
                        <TableHead>검사자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono text-sm">{record.inspectionNo}</TableCell>
                          <TableCell>{record.inspectionDate}</TableCell>
                          <TableCell>{record.productName}</TableCell>
                          <TableCell className="font-mono">{record.productCode}</TableCell>
                          <TableCell>{record.quantity.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.destination}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getResultVariant(record.overallResult)}>
                              {record.overallResult}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.inspector}</TableCell>
                        </TableRow>
                      ))}
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
