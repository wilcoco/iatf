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
  Package,
  Save,
  Search,
  Plus,
  FileText,
  Boxes,
  ClipboardCheck,
  History,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Types
interface PackagingSpec {
  id: number;
  documentNo: string;
  revisionNo: string;
  partNo: string;
  partName: string;
  customer: string;
  containerSpec: string;
  containerMaterial: string;
  packQuantity: number;
  stackingMethod: string;
  labelInfo: string;
  createdAt: string;
  updatedAt: string;
}

interface PackagingMaterial {
  id: number;
  materialType: string;
  supplier: string;
  currentStock: number;
  unit: string;
  reorderPoint: number;
  lastUpdated: string;
}

interface PackagingInspection {
  id: number;
  inspectionDate: string;
  specDocNo: string;
  partNo: string;
  appearance: "합격" | "불합격" | "해당없음";
  dimension: "합격" | "불합격" | "해당없음";
  marking: "합격" | "불합격" | "해당없음";
  quantity: "합격" | "불합격" | "해당없음";
  overallResult: "합격" | "불합격" | "보류";
  inspector: string;
  remarks: string;
}

interface SpecHistory {
  id: number;
  documentNo: string;
  revisionNo: string;
  revisionDate: string;
  changeDetails: string;
  changedBy: string;
  approvedBy: string;
}

// Generate document number
const generateDocNo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `PKG-${year}${month}-${random}`;
};

export default function PackagingStandardPage() {
  const [activeTab, setActiveTab] = useState("spec-registration");

  // Tab 1: Packaging Spec Registration State
  const [specs, setSpecs] = useState<PackagingSpec[]>([]);
  const [specForm, setSpecForm] = useState({
    documentNo: generateDocNo(),
    revisionNo: "01",
    partNo: "",
    partName: "",
    customer: "",
    containerSpec: "",
    containerMaterial: "",
    packQuantity: 0,
    stackingMethod: "",
    labelInfo: "",
  });

  // Tab 2: Packaging Material Management State
  const [materials, setMaterials] = useState<PackagingMaterial[]>([
    {
      id: 1,
      materialType: "골판지 박스 (대)",
      supplier: "한국포장",
      currentStock: 500,
      unit: "EA",
      reorderPoint: 100,
      lastUpdated: "2026-06-08",
    },
    {
      id: 2,
      materialType: "골판지 박스 (중)",
      supplier: "한국포장",
      currentStock: 800,
      unit: "EA",
      reorderPoint: 150,
      lastUpdated: "2026-06-08",
    },
    {
      id: 3,
      materialType: "PE 비닐",
      supplier: "대한화학",
      currentStock: 50,
      unit: "ROLL",
      reorderPoint: 20,
      lastUpdated: "2026-06-07",
    },
    {
      id: 4,
      materialType: "완충재 (폼)",
      supplier: "폼테크",
      currentStock: 200,
      unit: "EA",
      reorderPoint: 50,
      lastUpdated: "2026-06-06",
    },
    {
      id: 5,
      materialType: "스트레치 필름",
      supplier: "대한화학",
      currentStock: 30,
      unit: "ROLL",
      reorderPoint: 10,
      lastUpdated: "2026-06-08",
    },
  ]);
  const [materialForm, setMaterialForm] = useState({
    materialType: "",
    supplier: "",
    currentStock: 0,
    unit: "EA",
    reorderPoint: 0,
  });
  const [materialSearch, setMaterialSearch] = useState("");

  // Tab 3: Packaging Inspection State
  const [inspections, setInspections] = useState<PackagingInspection[]>([]);
  const [inspectionForm, setInspectionForm] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    specDocNo: "",
    partNo: "",
    appearance: "합격" as "합격" | "불합격" | "해당없음",
    dimension: "합격" as "합격" | "불합격" | "해당없음",
    marking: "합격" as "합격" | "불합격" | "해당없음",
    quantity: "합격" as "합격" | "불합격" | "해당없음",
    inspector: "",
    remarks: "",
  });
  const [inspectionSearch, setInspectionSearch] = useState("");

  // Tab 4: Spec History State
  const [histories, setHistories] = useState<SpecHistory[]>([
    {
      id: 1,
      documentNo: "PKG-202606-001",
      revisionNo: "02",
      revisionDate: "2026-06-05",
      changeDetails: "수납수량 변경 (50EA -> 60EA)",
      changedBy: "김품질",
      approvedBy: "이승인",
    },
    {
      id: 2,
      documentNo: "PKG-202605-015",
      revisionNo: "01",
      revisionDate: "2026-05-20",
      changeDetails: "신규 등록",
      changedBy: "박물류",
      approvedBy: "이승인",
    },
    {
      id: 3,
      documentNo: "PKG-202605-010",
      revisionNo: "03",
      revisionDate: "2026-05-15",
      changeDetails: "포장용기 재질 변경 (PP -> PE)",
      changedBy: "김품질",
      approvedBy: "이승인",
    },
  ]);
  const [historySearch, setHistorySearch] = useState("");

  // Handlers for Tab 1: Spec Registration
  const handleSpecSubmit = () => {
    if (
      !specForm.partNo ||
      !specForm.partName ||
      !specForm.customer ||
      !specForm.containerSpec
    ) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const newSpec: PackagingSpec = {
      id: Date.now(),
      ...specForm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSpecs([newSpec, ...specs]);

    // Add to history
    const historyEntry: SpecHistory = {
      id: Date.now(),
      documentNo: specForm.documentNo,
      revisionNo: specForm.revisionNo,
      revisionDate: new Date().toISOString().split("T")[0],
      changeDetails: "신규 등록",
      changedBy: "시스템",
      approvedBy: "-",
    };
    setHistories([historyEntry, ...histories]);

    // Reset form
    setSpecForm({
      documentNo: generateDocNo(),
      revisionNo: "01",
      partNo: "",
      partName: "",
      customer: "",
      containerSpec: "",
      containerMaterial: "",
      packQuantity: 0,
      stackingMethod: "",
      labelInfo: "",
    });

    alert("포장규격서가 등록되었습니다.");
  };

  // Handlers for Tab 2: Material Management
  const handleMaterialSubmit = () => {
    if (!materialForm.materialType || !materialForm.supplier) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const newMaterial: PackagingMaterial = {
      id: Date.now(),
      ...materialForm,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setMaterials([newMaterial, ...materials]);
    setMaterialForm({
      materialType: "",
      supplier: "",
      currentStock: 0,
      unit: "EA",
      reorderPoint: 0,
    });

    alert("포장재가 등록되었습니다.");
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.materialType.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.supplier.toLowerCase().includes(materialSearch.toLowerCase())
  );

  // Handlers for Tab 3: Inspection
  const calculateOverallResult = (): "합격" | "불합격" | "보류" => {
    const results = [
      inspectionForm.appearance,
      inspectionForm.dimension,
      inspectionForm.marking,
      inspectionForm.quantity,
    ];
    const hasFailure = results.some((r) => r === "불합격");
    const allPass = results.every((r) => r === "합격" || r === "해당없음");

    if (hasFailure) return "불합격";
    if (allPass) return "합격";
    return "보류";
  };

  const handleInspectionSubmit = () => {
    if (
      !inspectionForm.specDocNo ||
      !inspectionForm.partNo ||
      !inspectionForm.inspector
    ) {
      alert("필수 항목을 입력해주세요.");
      return;
    }

    const newInspection: PackagingInspection = {
      id: Date.now(),
      ...inspectionForm,
      overallResult: calculateOverallResult(),
    };

    setInspections([newInspection, ...inspections]);
    setInspectionForm({
      inspectionDate: new Date().toISOString().split("T")[0],
      specDocNo: "",
      partNo: "",
      appearance: "합격",
      dimension: "합격",
      marking: "합격",
      quantity: "합격",
      inspector: "",
      remarks: "",
    });

    alert("포장검사가 등록되었습니다.");
  };

  const filteredInspections = inspections.filter(
    (i) =>
      i.specDocNo.toLowerCase().includes(inspectionSearch.toLowerCase()) ||
      i.partNo.toLowerCase().includes(inspectionSearch.toLowerCase()) ||
      i.inspector.toLowerCase().includes(inspectionSearch.toLowerCase())
  );

  // Filter for Tab 4: History
  const filteredHistories = histories.filter(
    (h) =>
      h.documentNo.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.changeDetails.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.changedBy.toLowerCase().includes(historySearch.toLowerCase())
  );

  // Badge variant helper
  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "보류":
        return "warning";
      case "해당없음":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">포장규격서</h1>
          <p className="text-muted-foreground">
            IATF 16949 포장규격 관리 (Packaging Standard Management)
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spec-registration" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">포장규격 등록</span>
            <span className="sm:hidden">등록</span>
          </TabsTrigger>
          <TabsTrigger value="material-management" className="flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            <span className="hidden sm:inline">포장재 관리</span>
            <span className="sm:hidden">포장재</span>
          </TabsTrigger>
          <TabsTrigger value="inspection" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">포장 검사</span>
            <span className="sm:hidden">검사</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">포장규격 이력</span>
            <span className="sm:hidden">이력</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Packaging Spec Registration */}
        <TabsContent value="spec-registration">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  포장규격 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">문서 정보</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>문서번호</Label>
                      <Input
                        value={specForm.documentNo}
                        disabled
                        className="bg-muted font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>개정번호</Label>
                      <Input
                        value={specForm.revisionNo}
                        onChange={(e) =>
                          setSpecForm({ ...specForm, revisionNo: e.target.value })
                        }
                        placeholder="01"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">제품 정보</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>품번 *</Label>
                      <Input
                        value={specForm.partNo}
                        onChange={(e) =>
                          setSpecForm({ ...specForm, partNo: e.target.value })
                        }
                        placeholder="품번 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품명 *</Label>
                      <Input
                        value={specForm.partName}
                        onChange={(e) =>
                          setSpecForm({ ...specForm, partName: e.target.value })
                        }
                        placeholder="품명 입력"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>고객사 *</Label>
                    <Select
                      value={specForm.customer}
                      onValueChange={(v) => setSpecForm({ ...specForm, customer: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="고객사 선택" />
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

                {/* Container Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">포장용기</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>규격 *</Label>
                      <Input
                        value={specForm.containerSpec}
                        onChange={(e) =>
                          setSpecForm({ ...specForm, containerSpec: e.target.value })
                        }
                        placeholder="예: 600x400x300mm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>재질</Label>
                      <Select
                        value={specForm.containerMaterial}
                        onValueChange={(v) =>
                          setSpecForm({ ...specForm, containerMaterial: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="재질 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="골판지">골판지</SelectItem>
                          <SelectItem value="PP">PP (폴리프로필렌)</SelectItem>
                          <SelectItem value="PE">PE (폴리에틸렌)</SelectItem>
                          <SelectItem value="목재">목재</SelectItem>
                          <SelectItem value="철재">철재</SelectItem>
                          <SelectItem value="복합재">복합재</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Packing Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">포장 정보</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>수납수량</Label>
                      <Input
                        type="number"
                        value={specForm.packQuantity || ""}
                        onChange={(e) =>
                          setSpecForm({
                            ...specForm,
                            packQuantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="EA 단위 입력"
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>적재방법</Label>
                      <Select
                        value={specForm.stackingMethod}
                        onValueChange={(v) =>
                          setSpecForm({ ...specForm, stackingMethod: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="적재방법 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="단단적재">단단적재</SelectItem>
                          <SelectItem value="2단적재">2단적재</SelectItem>
                          <SelectItem value="3단적재">3단적재</SelectItem>
                          <SelectItem value="4단적재">4단적재</SelectItem>
                          <SelectItem value="팔레트">팔레트</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>라벨 정보</Label>
                    <Textarea
                      value={specForm.labelInfo}
                      onChange={(e) =>
                        setSpecForm({ ...specForm, labelInfo: e.target.value })
                      }
                      placeholder="라벨 부착 위치, 필수 표시 항목 등 입력"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSpecSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registered Specs List */}
            <Card>
              <CardHeader>
                <CardTitle>등록된 포장규격서</CardTitle>
              </CardHeader>
              <CardContent>
                {specs.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    등록된 포장규격서가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {specs.map((spec) => (
                      <div
                        key={spec.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">
                            {spec.documentNo}
                          </span>
                          <Badge variant="outline">Rev.{spec.revisionNo}</Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{spec.partNo}</span> -{" "}
                          {spec.partName}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{spec.customer}</Badge>
                          <span>{spec.containerSpec}</span>
                          <span>{spec.packQuantity}EA</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Packaging Material Management */}
        <TabsContent value="material-management">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Material Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  포장재 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>포장재 종류 *</Label>
                  <Input
                    value={materialForm.materialType}
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, materialType: e.target.value })
                    }
                    placeholder="예: 골판지 박스 (대)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>공급업체 *</Label>
                  <Input
                    value={materialForm.supplier}
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, supplier: e.target.value })
                    }
                    placeholder="공급업체명 입력"
                  />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label>재고수량</Label>
                    <Input
                      type="number"
                      value={materialForm.currentStock || ""}
                      onChange={(e) =>
                        setMaterialForm({
                          ...materialForm,
                          currentStock: parseInt(e.target.value) || 0,
                        })
                      }
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>단위</Label>
                    <Select
                      value={materialForm.unit}
                      onValueChange={(v) =>
                        setMaterialForm({ ...materialForm, unit: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EA">EA</SelectItem>
                        <SelectItem value="ROLL">ROLL</SelectItem>
                        <SelectItem value="BOX">BOX</SelectItem>
                        <SelectItem value="SET">SET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>발주점</Label>
                  <Input
                    type="number"
                    value={materialForm.reorderPoint || ""}
                    onChange={(e) =>
                      setMaterialForm({
                        ...materialForm,
                        reorderPoint: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="재고가 이 수량 이하이면 발주 필요"
                    min={0}
                  />
                </div>
                <Button onClick={handleMaterialSubmit} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  등록
                </Button>
              </CardContent>
            </Card>

            {/* Material Stock List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Boxes className="h-5 w-5" />
                  포장재 재고현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-md mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="포장재명, 공급업체로 검색..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>포장재 종류</TableHead>
                        <TableHead>공급업체</TableHead>
                        <TableHead className="text-right">재고수량</TableHead>
                        <TableHead className="text-right">발주점</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>최종갱신</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.map((material) => {
                        const isLowStock = material.currentStock <= material.reorderPoint;
                        return (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">
                              {material.materialType}
                            </TableCell>
                            <TableCell>{material.supplier}</TableCell>
                            <TableCell className="text-right">
                              {material.currentStock.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell className="text-right">
                              {material.reorderPoint.toLocaleString()} {material.unit}
                            </TableCell>
                            <TableCell>
                              {isLowStock ? (
                                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                  <AlertTriangle className="h-3 w-3" />
                                  발주필요
                                </Badge>
                              ) : (
                                <Badge variant="success" className="flex items-center gap-1 w-fit">
                                  <CheckCircle className="h-3 w-3" />
                                  정상
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{material.lastUpdated}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Packaging Inspection */}
        <TabsContent value="inspection">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inspection Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  포장 검사 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">기본 정보</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>검사일 *</Label>
                      <Input
                        type="date"
                        value={inspectionForm.inspectionDate}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            inspectionDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>검사자 *</Label>
                      <Input
                        value={inspectionForm.inspector}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            inspector: e.target.value,
                          })
                        }
                        placeholder="검사자명 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>규격서 문서번호 *</Label>
                      <Input
                        value={inspectionForm.specDocNo}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            specDocNo: e.target.value,
                          })
                        }
                        placeholder="PKG-YYYYMM-XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품번 *</Label>
                      <Input
                        value={inspectionForm.partNo}
                        onChange={(e) =>
                          setInspectionForm({
                            ...inspectionForm,
                            partNo: e.target.value,
                          })
                        }
                        placeholder="품번 입력"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">
                    검사항목 (외관/치수/표시/수량)
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>외관 검사</Label>
                      <Select
                        value={inspectionForm.appearance}
                        onValueChange={(v) =>
                          setInspectionForm({
                            ...inspectionForm,
                            appearance: v as "합격" | "불합격" | "해당없음",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="합격">합격</SelectItem>
                          <SelectItem value="불합격">불합격</SelectItem>
                          <SelectItem value="해당없음">해당없음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>치수 검사</Label>
                      <Select
                        value={inspectionForm.dimension}
                        onValueChange={(v) =>
                          setInspectionForm({
                            ...inspectionForm,
                            dimension: v as "합격" | "불합격" | "해당없음",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="합격">합격</SelectItem>
                          <SelectItem value="불합격">불합격</SelectItem>
                          <SelectItem value="해당없음">해당없음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>표시 검사</Label>
                      <Select
                        value={inspectionForm.marking}
                        onValueChange={(v) =>
                          setInspectionForm({
                            ...inspectionForm,
                            marking: v as "합격" | "불합격" | "해당없음",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="합격">합격</SelectItem>
                          <SelectItem value="불합격">불합격</SelectItem>
                          <SelectItem value="해당없음">해당없음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>수량 검사</Label>
                      <Select
                        value={inspectionForm.quantity}
                        onValueChange={(v) =>
                          setInspectionForm({
                            ...inspectionForm,
                            quantity: v as "합격" | "불합격" | "해당없음",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="합격">합격</SelectItem>
                          <SelectItem value="불합격">불합격</SelectItem>
                          <SelectItem value="해당없음">해당없음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>비고</Label>
                  <Textarea
                    value={inspectionForm.remarks}
                    onChange={(e) =>
                      setInspectionForm({
                        ...inspectionForm,
                        remarks: e.target.value,
                      })
                    }
                    placeholder="특이사항 또는 부적합 내용 기록"
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">종합 판정</p>
                    <Badge
                      variant={getResultVariant(calculateOverallResult())}
                      className="text-lg px-4 py-1 mt-1"
                    >
                      {calculateOverallResult()}
                    </Badge>
                  </div>
                  <Button onClick={handleInspectionSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    검사 등록
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inspection History */}
            <Card>
              <CardHeader>
                <CardTitle>검사 이력</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-md mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="문서번호, 품번, 검사자로 검색..."
                    value={inspectionSearch}
                    onChange={(e) => setInspectionSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredInspections.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">
                    등록된 검사 이력이 없습니다.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>검사일</TableHead>
                          <TableHead>문서번호</TableHead>
                          <TableHead>품번</TableHead>
                          <TableHead>외관</TableHead>
                          <TableHead>치수</TableHead>
                          <TableHead>표시</TableHead>
                          <TableHead>수량</TableHead>
                          <TableHead>판정</TableHead>
                          <TableHead>검사자</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInspections.map((inspection) => (
                          <TableRow key={inspection.id}>
                            <TableCell>{inspection.inspectionDate}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {inspection.specDocNo}
                            </TableCell>
                            <TableCell>{inspection.partNo}</TableCell>
                            <TableCell>
                              <Badge variant={getResultVariant(inspection.appearance)} className="text-xs">
                                {inspection.appearance}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getResultVariant(inspection.dimension)} className="text-xs">
                                {inspection.dimension}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getResultVariant(inspection.marking)} className="text-xs">
                                {inspection.marking}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getResultVariant(inspection.quantity)} className="text-xs">
                                {inspection.quantity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getResultVariant(inspection.overallResult)}>
                                {inspection.overallResult}
                              </Badge>
                            </TableCell>
                            <TableCell>{inspection.inspector}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Packaging Spec History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                포장규격 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="문서번호, 변경내용, 변경자로 검색..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>문서번호</TableHead>
                      <TableHead>개정번호</TableHead>
                      <TableHead>개정일</TableHead>
                      <TableHead>변경내용</TableHead>
                      <TableHead>변경자</TableHead>
                      <TableHead>승인자</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistories.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="font-mono text-sm">
                          {history.documentNo}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Rev.{history.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{history.revisionDate}</TableCell>
                        <TableCell>{history.changeDetails}</TableCell>
                        <TableCell>{history.changedBy}</TableCell>
                        <TableCell>{history.approvedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
