"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Search,
  ArrowUpDown,
  Package,
  Factory,
  Truck,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Types
interface TreeNode {
  id: string;
  label: string;
  type: "material" | "process" | "product" | "shipment";
  children?: TreeNode[];
}

interface MaterialHistory {
  id: string;
  materialCode: string;
  materialName: string;
  supplier: string;
  receiptDate: string;
  lotNumber: string;
  usedInProducts: string[];
}

interface ProductionHistory {
  id: string;
  productionDate: string;
  workOrderNumber: string;
  productCode: string;
  productName: string;
  quantity: number;
  materialLots: string[];
  worker: string;
  equipment: string;
  inspectionResult: "pass" | "fail" | "pending";
}

interface ShipmentHistory {
  id: string;
  shipmentDate: string;
  customer: string;
  productLot: string;
  productName: string;
  quantity: number;
  deliveryNumber: string;
}

// Sample data
const sampleMaterialHistory: MaterialHistory[] = [
  {
    id: "1",
    materialCode: "MAT-001",
    materialName: "알루미늄 합금 A356",
    supplier: "한국금속(주)",
    receiptDate: "2026-05-15",
    lotNumber: "MAT-2026051501",
    usedInProducts: ["PRD-2026052001", "PRD-2026052102"],
  },
  {
    id: "2",
    materialCode: "MAT-002",
    materialName: "스테인리스 SUS304",
    supplier: "대한스틸(주)",
    receiptDate: "2026-05-18",
    lotNumber: "MAT-2026051801",
    usedInProducts: ["PRD-2026052203"],
  },
  {
    id: "3",
    materialCode: "MAT-003",
    materialName: "폴리카보네이트 PC",
    supplier: "삼성화학(주)",
    receiptDate: "2026-05-20",
    lotNumber: "MAT-2026052001",
    usedInProducts: ["PRD-2026052501", "PRD-2026052602"],
  },
  {
    id: "4",
    materialCode: "MAT-004",
    materialName: "구리 C1100",
    supplier: "동양금속(주)",
    receiptDate: "2026-05-22",
    lotNumber: "MAT-2026052201",
    usedInProducts: ["PRD-2026052801"],
  },
];

const sampleProductionHistory: ProductionHistory[] = [
  {
    id: "1",
    productionDate: "2026-05-20",
    workOrderNumber: "WO-20260520-001",
    productCode: "FIN-001",
    productName: "자동차 브라켓 A",
    quantity: 500,
    materialLots: ["MAT-2026051501"],
    worker: "김철수",
    equipment: "CNC-001",
    inspectionResult: "pass",
  },
  {
    id: "2",
    productionDate: "2026-05-21",
    workOrderNumber: "WO-20260521-002",
    productCode: "FIN-002",
    productName: "자동차 브라켓 B",
    quantity: 300,
    materialLots: ["MAT-2026051501", "MAT-2026051801"],
    worker: "이영희",
    equipment: "CNC-002",
    inspectionResult: "pass",
  },
  {
    id: "3",
    productionDate: "2026-05-22",
    workOrderNumber: "WO-20260522-003",
    productCode: "FIN-003",
    productName: "전자부품 케이스",
    quantity: 1000,
    materialLots: ["MAT-2026052001"],
    worker: "박민수",
    equipment: "INJ-001",
    inspectionResult: "pending",
  },
  {
    id: "4",
    productionDate: "2026-05-25",
    workOrderNumber: "WO-20260525-001",
    productCode: "FIN-004",
    productName: "전기 커넥터",
    quantity: 2000,
    materialLots: ["MAT-2026052201", "MAT-2026052001"],
    worker: "최수진",
    equipment: "PRESS-001",
    inspectionResult: "pass",
  },
];

const sampleShipmentHistory: ShipmentHistory[] = [
  {
    id: "1",
    shipmentDate: "2026-05-25",
    customer: "현대자동차(주)",
    productLot: "PRD-2026052001",
    productName: "자동차 브라켓 A",
    quantity: 500,
    deliveryNumber: "DLV-20260525-001",
  },
  {
    id: "2",
    shipmentDate: "2026-05-26",
    customer: "기아자동차(주)",
    productLot: "PRD-2026052102",
    productName: "자동차 브라켓 B",
    quantity: 300,
    deliveryNumber: "DLV-20260526-001",
  },
  {
    id: "3",
    shipmentDate: "2026-05-28",
    customer: "삼성전자(주)",
    productLot: "PRD-2026052501",
    productName: "전자부품 케이스",
    quantity: 800,
    deliveryNumber: "DLV-20260528-001",
  },
  {
    id: "4",
    shipmentDate: "2026-05-30",
    customer: "LG전자(주)",
    productLot: "PRD-2026052801",
    productName: "전기 커넥터",
    quantity: 1500,
    deliveryNumber: "DLV-20260530-001",
  },
];

// Sample backward trace tree (raw material -> process -> finished product)
const sampleBackwardTrace: TreeNode = {
  id: "product-1",
  label: "완제품: 자동차 브라켓 A (PRD-2026052001)",
  type: "product",
  children: [
    {
      id: "process-1",
      label: "공정: CNC 가공 (WO-20260520-001)",
      type: "process",
      children: [
        {
          id: "material-1",
          label: "원자재: 알루미늄 합금 A356 (MAT-2026051501)",
          type: "material",
        },
      ],
    },
    {
      id: "process-2",
      label: "공정: 표면처리 (WO-20260520-002)",
      type: "process",
      children: [
        {
          id: "material-2",
          label: "원자재: 표면처리제 (MAT-2026051502)",
          type: "material",
        },
      ],
    },
  ],
};

// Sample forward trace tree (finished product -> shipment)
const sampleForwardTrace: TreeNode = {
  id: "product-1",
  label: "완제품: 자동차 브라켓 A (PRD-2026052001)",
  type: "product",
  children: [
    {
      id: "shipment-1",
      label: "출하: 현대자동차(주) (DLV-20260525-001)",
      type: "shipment",
      children: [
        {
          id: "delivery-1",
          label: "수량: 500개 / 출하일: 2026-05-25",
          type: "shipment",
        },
      ],
    },
    {
      id: "shipment-2",
      label: "출하: 기아자동차(주) (DLV-20260526-002)",
      type: "shipment",
      children: [
        {
          id: "delivery-2",
          label: "수량: 200개 / 출하일: 2026-05-26",
          type: "shipment",
        },
      ],
    },
  ],
};

// Tree Node Component
function TreeNodeComponent({
  node,
  level = 0,
}: {
  node: TreeNode;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const getTypeColor = (type: TreeNode["type"]) => {
    switch (type) {
      case "material":
        return "text-blue-600 bg-blue-50";
      case "process":
        return "text-orange-600 bg-orange-50";
      case "product":
        return "text-green-600 bg-green-50";
      case "shipment":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeIcon = (type: TreeNode["type"]) => {
    switch (type) {
      case "material":
        return <Package className="h-4 w-4" />;
      case "process":
        return <Factory className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "shipment":
        return <Truck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted/50 cursor-pointer`}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <span className="w-4" />
        )}
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${getTypeColor(node.type)}`}
        >
          {getTypeIcon(node.type)}
          {node.label}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TraceabilityPage() {
  const [activeTab, setActiveTab] = useState("lot-trace");

  // Tab 1: Lot Tracing State
  const [lotNumber, setLotNumber] = useState("");
  const [traceDirection, setTraceDirection] = useState<
    "backward" | "forward" | ""
  >("");
  const [showTraceResult, setShowTraceResult] = useState(false);

  // Tab 2: Material History State
  const [materialSearchCode, setMaterialSearchCode] = useState("");
  const [materialSearchSupplier, setMaterialSearchSupplier] = useState("");

  // Tab 3: Production History State
  const [productionSearchDate, setProductionSearchDate] = useState("");
  const [productionSearchProduct, setProductionSearchProduct] = useState("");

  // Tab 4: Shipment History State
  const [shipmentSearchDate, setShipmentSearchDate] = useState("");
  const [shipmentSearchCustomer, setShipmentSearchCustomer] = useState("");

  const handleLotSearch = () => {
    if (lotNumber && traceDirection) {
      setShowTraceResult(true);
    }
  };

  const filteredMaterials = sampleMaterialHistory.filter((m) => {
    const matchCode =
      !materialSearchCode ||
      m.materialCode.toLowerCase().includes(materialSearchCode.toLowerCase()) ||
      m.materialName.toLowerCase().includes(materialSearchCode.toLowerCase());
    const matchSupplier =
      !materialSearchSupplier ||
      m.supplier.toLowerCase().includes(materialSearchSupplier.toLowerCase());
    return matchCode && matchSupplier;
  });

  const filteredProduction = sampleProductionHistory.filter((p) => {
    const matchDate =
      !productionSearchDate || p.productionDate === productionSearchDate;
    const matchProduct =
      !productionSearchProduct ||
      p.productCode
        .toLowerCase()
        .includes(productionSearchProduct.toLowerCase()) ||
      p.productName
        .toLowerCase()
        .includes(productionSearchProduct.toLowerCase());
    return matchDate && matchProduct;
  });

  const filteredShipments = sampleShipmentHistory.filter((s) => {
    const matchDate =
      !shipmentSearchDate || s.shipmentDate === shipmentSearchDate;
    const matchCustomer =
      !shipmentSearchCustomer ||
      s.customer.toLowerCase().includes(shipmentSearchCustomer.toLowerCase());
    return matchDate && matchCustomer;
  });

  const getInspectionBadge = (result: ProductionHistory["inspectionResult"]) => {
    switch (result) {
      case "pass":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            합격
          </span>
        );
      case "fail":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            불합격
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            검사중
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">추적성 관리</h1>
          <p className="text-muted-foreground">
            IATF 16949 기반 제품 추적성 관리
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lot-trace">Lot 추적 조회</TabsTrigger>
          <TabsTrigger value="material-history">원자재 이력</TabsTrigger>
          <TabsTrigger value="production-history">생산 이력</TabsTrigger>
          <TabsTrigger value="shipment-history">출하 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Lot Tracing */}
        <TabsContent value="lot-trace">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Lot 추적 조회
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lotNumber">제품 Lot번호</Label>
                  <Input
                    id="lotNumber"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="PRD-2026052001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>추적 방향</Label>
                  <Select
                    value={traceDirection}
                    onValueChange={(value) =>
                      setTraceDirection(value as "backward" | "forward")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="추적 방향 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backward">
                        역추적 (원자재 -&gt; 공정 -&gt; 완제품)
                      </SelectItem>
                      <SelectItem value="forward">
                        순추적 (완제품 -&gt; 출하처)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleLotSearch} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    조회
                  </Button>
                </div>
              </div>

              {showTraceResult && (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h3 className="text-lg font-semibold mb-4">
                    {traceDirection === "backward"
                      ? "역추적 결과 (원자재 -> 공정 -> 완제품)"
                      : "순추적 결과 (완제품 -> 출하처)"}
                  </h3>
                  <div className="border rounded-lg bg-background p-4">
                    <TreeNodeComponent
                      node={
                        traceDirection === "backward"
                          ? sampleBackwardTrace
                          : sampleForwardTrace
                      }
                    />
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">범례</h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-700">
                        <Package className="h-3 w-3" /> 원자재
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-100 text-orange-700">
                        <Factory className="h-3 w-3" /> 공정
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700">
                        <Package className="h-3 w-3" /> 완제품
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-100 text-purple-700">
                        <Truck className="h-3 w-3" /> 출하
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Material History */}
        <TabsContent value="material-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                원자재 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="materialSearchCode">자재코드/자재명</Label>
                  <Input
                    id="materialSearchCode"
                    value={materialSearchCode}
                    onChange={(e) => setMaterialSearchCode(e.target.value)}
                    placeholder="자재코드 또는 자재명 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materialSearchSupplier">공급업체</Label>
                  <Input
                    id="materialSearchSupplier"
                    value={materialSearchSupplier}
                    onChange={(e) => setMaterialSearchSupplier(e.target.value)}
                    placeholder="공급업체명 입력"
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>자재코드</TableHead>
                    <TableHead>자재명</TableHead>
                    <TableHead>공급업체</TableHead>
                    <TableHead>입고일</TableHead>
                    <TableHead>Lot번호</TableHead>
                    <TableHead>사용 제품</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.materialCode}
                      </TableCell>
                      <TableCell>{material.materialName}</TableCell>
                      <TableCell>{material.supplier}</TableCell>
                      <TableCell>{material.receiptDate}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-sm">
                          {material.lotNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {material.usedInProducts.map((product) => (
                            <span
                              key={product}
                              className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Production History */}
        <TabsContent value="production-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                생산 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productionSearchDate">생산일</Label>
                  <Input
                    id="productionSearchDate"
                    type="date"
                    value={productionSearchDate}
                    onChange={(e) => setProductionSearchDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productionSearchProduct">품목코드/품목명</Label>
                  <Input
                    id="productionSearchProduct"
                    value={productionSearchProduct}
                    onChange={(e) => setProductionSearchProduct(e.target.value)}
                    placeholder="품목코드 또는 품목명 입력"
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>생산일</TableHead>
                    <TableHead>작업지시번호</TableHead>
                    <TableHead>품목</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>사용 원자재 Lot</TableHead>
                    <TableHead>작업자</TableHead>
                    <TableHead>설비</TableHead>
                    <TableHead>검사결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProduction.map((production) => (
                    <TableRow key={production.id}>
                      <TableCell>{production.productionDate}</TableCell>
                      <TableCell className="font-medium">
                        {production.workOrderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {production.productCode}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {production.productName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{production.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {production.materialLots.map((lot) => (
                            <span
                              key={lot}
                              className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs"
                            >
                              {lot}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{production.worker}</TableCell>
                      <TableCell>{production.equipment}</TableCell>
                      <TableCell>
                        {getInspectionBadge(production.inspectionResult)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Shipment History */}
        <TabsContent value="shipment-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                출하 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipmentSearchDate">출하일</Label>
                  <Input
                    id="shipmentSearchDate"
                    type="date"
                    value={shipmentSearchDate}
                    onChange={(e) => setShipmentSearchDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipmentSearchCustomer">출하처</Label>
                  <Input
                    id="shipmentSearchCustomer"
                    value={shipmentSearchCustomer}
                    onChange={(e) => setShipmentSearchCustomer(e.target.value)}
                    placeholder="출하처명 입력"
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    검색
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>출하일</TableHead>
                    <TableHead>출하처</TableHead>
                    <TableHead>제품 Lot</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead>수량</TableHead>
                    <TableHead>납품서 번호</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>{shipment.shipmentDate}</TableCell>
                      <TableCell className="font-medium">
                        {shipment.customer}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-sm">
                          {shipment.productLot}
                        </span>
                      </TableCell>
                      <TableCell>{shipment.productName}</TableCell>
                      <TableCell>{shipment.quantity.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-700 text-sm">
                          {shipment.deliveryNumber}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
