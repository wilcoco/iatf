"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  Plus,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  History,
  Clock,
  PlayCircle,
  StopCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { getInspectionItemsByType, type InspectionItem as MasterInspectionItem } from "@/lib/master-data";

// Types
interface InspectionItem {
  id: number;
  itemName: string;
  specUpper: string;
  specLower: string;
  measuredValue: string;
  result: "양호" | "불량" | "";
}

interface ProcessInspectionRecord {
  id: number;
  inspectionNo: string;
  inspectionDate: string;
  inspectionTime: string;
  processName: string;
  line: string;
  equipment: string;
  partNo: string;
  productName: string;
  lotNo: string;
  items: InspectionItem[];
  overallResult: "양호" | "불량" | "";
  inspector: string;
  remarks: string;
}

interface FirstLastInspection {
  id: number;
  inspectionDate: string;
  processName: string;
  line: string;
  partNo: string;
  productName: string;
  lotNo: string;
  firstInspectionTime: string;
  firstItems: InspectionItem[];
  firstResult: "양호" | "불량" | "";
  firstInspector: string;
  lastInspectionTime: string;
  lastItems: InspectionItem[];
  lastResult: "양호" | "불량" | "";
  lastInspector: string;
  comparisonResult: "일치" | "불일치" | "";
  remarks: string;
}

interface PatrolInspection {
  id: number;
  inspectionDate: string;
  inspectionTime: string;
  processName: string;
  line: string;
  inspector: string;
  checkItems: { item: string; status: "정상" | "이상" | ""; action: string }[];
  overallStatus: "정상" | "이상발생" | "";
  actionTaken: string;
  remarks: string;
}

// Generate inspection number
function generateInspectionNo(prefix: string): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `${prefix}-${date}-${seq}`;
}

// Helper function to create inspection items from master data
function createInspectionItemsFromMasterData(masterDataItems: MasterInspectionItem[]): {
  id: number;
  itemName: string;
  specUpper: string;
  specLower: string;
  measuredValue: string;
  result: "양호" | "불량" | "";
}[] {
  return masterDataItems.map((item) => ({
    id: item.id,
    itemName: `${item.name} (${item.spec})`,
    specUpper: item.usl !== null ? String(item.usl) : "",
    specLower: item.lsl !== null ? String(item.lsl) : "",
    measuredValue: "",
    result: "" as "양호" | "불량" | "",
  }));
}

export default function ProcessInspectionPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Get process inspection items from master data
  const processInspectionItems = useMemo(() => getInspectionItemsByType("공정검사"), []);

  // Tab 1: Process Inspection Registration State
  const [processForm, setProcessForm] = useState({
    inspectionNo: generateInspectionNo("PRC"),
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionTime: new Date().toTimeString().slice(0, 5),
    processName: "",
    line: "",
    equipment: "",
    partNo: "",
    productName: "",
    lotNo: "",
    inspector: "",
  });

  // Initialize process items from master data
  const [processItems, setProcessItems] = useState<InspectionItem[]>(() =>
    createInspectionItemsFromMasterData(processInspectionItems)
  );

  const [processOverallResult, setProcessOverallResult] = useState<"양호" | "불량" | "">("");
  const [processRemarks, setProcessRemarks] = useState("");
  const [processHistory, setProcessHistory] = useState<ProcessInspectionRecord[]>([]);

  // Tab 2: First-off/Last-off Inspection State
  const [firstLastForm, setFirstLastForm] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    processName: "",
    line: "",
    partNo: "",
    productName: "",
    lotNo: "",
  });

  const [firstInspection, setFirstInspection] = useState({
    time: "",
    inspector: "",
    result: "" as "양호" | "불량" | "",
  });

  const [firstItems, setFirstItems] = useState<InspectionItem[]>(() =>
    createInspectionItemsFromMasterData(processInspectionItems)
  );

  const [lastInspection, setLastInspection] = useState({
    time: "",
    inspector: "",
    result: "" as "양호" | "불량" | "",
  });

  const [lastItems, setLastItems] = useState<InspectionItem[]>(() =>
    createInspectionItemsFromMasterData(processInspectionItems)
  );

  const [firstLastRemarks, setFirstLastRemarks] = useState("");
  const [firstLastHistory, setFirstLastHistory] = useState<FirstLastInspection[]>([]);

  // Tab 3: Patrol Inspection State
  const [patrolForm, setPatrolForm] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionTime: new Date().toTimeString().slice(0, 5),
    processName: "",
    line: "",
    inspector: "",
  });

  const [patrolCheckItems, setPatrolCheckItems] = useState<
    { id: number; item: string; status: "정상" | "이상" | ""; action: string }[]
  >([
    { id: 1, item: "설비 작동 상태", status: "", action: "" },
    { id: 2, item: "작업 표준 준수", status: "", action: "" },
    { id: 3, item: "제품 외관 상태", status: "", action: "" },
    { id: 4, item: "작업 환경(온도/습도)", status: "", action: "" },
    { id: 5, item: "5S 상태", status: "", action: "" },
  ]);

  const [patrolActionTaken, setPatrolActionTaken] = useState("");
  const [patrolRemarks, setPatrolRemarks] = useState("");
  const [patrolHistory, setPatrolHistory] = useState<PatrolInspection[]>([]);

  // Tab 4: History Search
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"all" | "process" | "firstlast" | "patrol">("all");

  // Helper: Update inspection item with auto-judgment
  const updateInspectionItem = (
    items: InspectionItem[],
    setItems: React.Dispatch<React.SetStateAction<InspectionItem[]>>,
    id: number,
    field: keyof InspectionItem,
    value: string
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "measuredValue" || field === "specUpper" || field === "specLower") {
            const upper = parseFloat(updatedItem.specUpper);
            const lower = parseFloat(updatedItem.specLower);
            const measured = parseFloat(updatedItem.measuredValue);

            if (!isNaN(measured) && (!isNaN(upper) || !isNaN(lower))) {
              const withinUpper = isNaN(upper) || measured <= upper;
              const withinLower = isNaN(lower) || measured >= lower;
              updatedItem.result = withinUpper && withinLower ? "양호" : "불량";
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Helper: Add inspection item
  const addInspectionItem = (
    items: InspectionItem[],
    setItems: React.Dispatch<React.SetStateAction<InspectionItem[]>>
  ) => {
    const newId = Math.max(0, ...items.map((item) => item.id)) + 1;
    setItems([...items, { id: newId, itemName: "", specUpper: "", specLower: "", measuredValue: "", result: "" }]);
  };

  // Helper: Remove inspection item
  const removeInspectionItem = (
    items: InspectionItem[],
    setItems: React.Dispatch<React.SetStateAction<InspectionItem[]>>,
    id: number
  ) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Tab 1: Save Process Inspection
  const handleSaveProcessInspection = () => {
    if (!processForm.inspector || !processForm.processName || !processForm.partNo || !processForm.lotNo) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!processOverallResult) {
      alert("종합판정을 선택해주세요.");
      return;
    }

    const newRecord: ProcessInspectionRecord = {
      id: Date.now(),
      inspectionNo: processForm.inspectionNo,
      inspectionDate: processForm.inspectionDate,
      inspectionTime: processForm.inspectionTime,
      processName: processForm.processName,
      line: processForm.line,
      equipment: processForm.equipment,
      partNo: processForm.partNo,
      productName: processForm.productName,
      lotNo: processForm.lotNo,
      items: [...processItems],
      overallResult: processOverallResult,
      inspector: processForm.inspector,
      remarks: processRemarks,
    };

    setProcessHistory([newRecord, ...processHistory]);

    // Reset form
    setProcessForm({
      inspectionNo: generateInspectionNo("PRC"),
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectionTime: new Date().toTimeString().slice(0, 5),
      processName: "",
      line: "",
      equipment: "",
      partNo: "",
      productName: "",
      lotNo: "",
      inspector: "",
    });
    setProcessItems(createInspectionItemsFromMasterData(processInspectionItems));
    setProcessOverallResult("");
    setProcessRemarks("");

    alert("공정검사 기록이 저장되었습니다.");
    setActiveTab("history");
  };

  // Tab 2: Save First-off/Last-off Inspection
  const handleSaveFirstLastInspection = () => {
    if (!firstLastForm.processName || !firstLastForm.partNo || !firstLastForm.lotNo) {
      alert("기본 정보를 모두 입력해주세요.");
      return;
    }

    if (!firstInspection.time || !firstInspection.inspector) {
      alert("초물검사 정보를 입력해주세요.");
      return;
    }

    // Calculate comparison result
    let comparisonResult: "일치" | "불일치" | "" = "";
    if (firstInspection.result && lastInspection.result) {
      comparisonResult = firstInspection.result === lastInspection.result ? "일치" : "불일치";
    }

    const newRecord: FirstLastInspection = {
      id: Date.now(),
      inspectionDate: firstLastForm.inspectionDate,
      processName: firstLastForm.processName,
      line: firstLastForm.line,
      partNo: firstLastForm.partNo,
      productName: firstLastForm.productName,
      lotNo: firstLastForm.lotNo,
      firstInspectionTime: firstInspection.time,
      firstItems: [...firstItems],
      firstResult: firstInspection.result,
      firstInspector: firstInspection.inspector,
      lastInspectionTime: lastInspection.time,
      lastItems: [...lastItems],
      lastResult: lastInspection.result,
      lastInspector: lastInspection.inspector,
      comparisonResult,
      remarks: firstLastRemarks,
    };

    setFirstLastHistory([newRecord, ...firstLastHistory]);

    // Reset form
    setFirstLastForm({
      inspectionDate: new Date().toISOString().split("T")[0],
      processName: "",
      line: "",
      partNo: "",
      productName: "",
      lotNo: "",
    });
    setFirstInspection({ time: "", inspector: "", result: "" });
    setFirstItems(createInspectionItemsFromMasterData(processInspectionItems));
    setLastInspection({ time: "", inspector: "", result: "" });
    setLastItems(createInspectionItemsFromMasterData(processInspectionItems));
    setFirstLastRemarks("");

    alert("초물/종물 검사 기록이 저장되었습니다.");
    setActiveTab("history");
  };

  // Tab 3: Save Patrol Inspection
  const handleSavePatrolInspection = () => {
    if (!patrolForm.processName || !patrolForm.inspector) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const hasAbnormal = patrolCheckItems.some((item) => item.status === "이상");
    const overallStatus: "정상" | "이상발생" = hasAbnormal ? "이상발생" : "정상";

    const newRecord: PatrolInspection = {
      id: Date.now(),
      inspectionDate: patrolForm.inspectionDate,
      inspectionTime: patrolForm.inspectionTime,
      processName: patrolForm.processName,
      line: patrolForm.line,
      inspector: patrolForm.inspector,
      checkItems: patrolCheckItems.map((item) => ({ item: item.item, status: item.status, action: item.action })),
      overallStatus,
      actionTaken: patrolActionTaken,
      remarks: patrolRemarks,
    };

    setPatrolHistory([newRecord, ...patrolHistory]);

    // Reset form
    setPatrolForm({
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectionTime: new Date().toTimeString().slice(0, 5),
      processName: "",
      line: "",
      inspector: "",
    });
    setPatrolCheckItems([
      { id: 1, item: "설비 작동 상태", status: "", action: "" },
      { id: 2, item: "작업 표준 준수", status: "", action: "" },
      { id: 3, item: "제품 외관 상태", status: "", action: "" },
      { id: 4, item: "작업 환경(온도/습도)", status: "", action: "" },
      { id: 5, item: "5S 상태", status: "", action: "" },
    ]);
    setPatrolActionTaken("");
    setPatrolRemarks("");

    alert("순회검사 기록이 저장되었습니다.");
    setActiveTab("history");
  };

  // Get result badge
  const getResultBadge = (result: string) => {
    switch (result) {
      case "양호":
      case "정상":
      case "일치":
        return <Badge variant="success">{result}</Badge>;
      case "불량":
      case "이상":
      case "이상발생":
      case "불일치":
        return <Badge variant="destructive">{result}</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  // Render inspection items table
  const renderInspectionItemsTable = (
    items: InspectionItem[],
    setItems: React.Dispatch<React.SetStateAction<InspectionItem[]>>,
    readOnly: boolean = false
  ) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">No.</TableHead>
          <TableHead>검사항목명</TableHead>
          <TableHead className="w-24">규격(하한)</TableHead>
          <TableHead className="w-24">규격(상한)</TableHead>
          <TableHead className="w-24">측정값</TableHead>
          <TableHead className="w-20">판정</TableHead>
          {!readOnly && <TableHead className="w-16">삭제</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <Input
                value={item.itemName}
                onChange={(e) => updateInspectionItem(items, setItems, item.id, "itemName", e.target.value)}
                placeholder="검사항목"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="any"
                value={item.specLower}
                onChange={(e) => updateInspectionItem(items, setItems, item.id, "specLower", e.target.value)}
                placeholder="하한"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="any"
                value={item.specUpper}
                onChange={(e) => updateInspectionItem(items, setItems, item.id, "specUpper", e.target.value)}
                placeholder="상한"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="any"
                value={item.measuredValue}
                onChange={(e) => updateInspectionItem(items, setItems, item.id, "measuredValue", e.target.value)}
                placeholder="측정값"
                disabled={readOnly}
              />
            </TableCell>
            <TableCell>
              {item.result === "양호" ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  양호
                </span>
              ) : item.result === "불량" ? (
                <span className="flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1" />
                  불량
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            {!readOnly && (
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInspectionItem(items, setItems, item.id)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공정검사</h1>
          <p className="text-muted-foreground">IATF 16949 기반 공정 중 검사 관리</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registration">공정검사 등록</TabsTrigger>
              <TabsTrigger value="firstlast">초물/종물 검사</TabsTrigger>
              <TabsTrigger value="patrol">순회검사 현황</TabsTrigger>
              <TabsTrigger value="history">검사 이력</TabsTrigger>
            </TabsList>

            {/* Tab 1: 공정검사 등록 (Process Inspection Entry) */}
            <TabsContent value="registration">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    공정검사 등록
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>검사번호</Label>
                        <Input value={processForm.inspectionNo} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>검사일 *</Label>
                        <Input
                          type="date"
                          value={processForm.inspectionDate}
                          onChange={(e) => setProcessForm({ ...processForm, inspectionDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사시간 *</Label>
                        <Input
                          type="time"
                          value={processForm.inspectionTime}
                          onChange={(e) => setProcessForm({ ...processForm, inspectionTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사자 *</Label>
                        <Input
                          value={processForm.inspector}
                          onChange={(e) => setProcessForm({ ...processForm, inspector: e.target.value })}
                          placeholder="검사자명"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Process Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">공정 정보</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>공정명 *</Label>
                        <Select
                          value={processForm.processName}
                          onValueChange={(value) => setProcessForm({ ...processForm, processName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="공정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="사출">사출</SelectItem>
                            <SelectItem value="도장">도장</SelectItem>
                            <SelectItem value="조립">조립</SelectItem>
                            <SelectItem value="검사">검사</SelectItem>
                            <SelectItem value="포장">포장</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>라인</Label>
                        <Select
                          value={processForm.line}
                          onValueChange={(value) => setProcessForm({ ...processForm, line: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="라인 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A라인">A라인</SelectItem>
                            <SelectItem value="B라인">B라인</SelectItem>
                            <SelectItem value="C라인">C라인</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>설비</Label>
                        <Input
                          value={processForm.equipment}
                          onChange={(e) => setProcessForm({ ...processForm, equipment: e.target.value })}
                          placeholder="설비명"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">제품 정보</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={processForm.partNo}
                          onChange={(e) => setProcessForm({ ...processForm, partNo: e.target.value })}
                          placeholder="품번"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품명</Label>
                        <Input
                          value={processForm.productName}
                          onChange={(e) => setProcessForm({ ...processForm, productName: e.target.value })}
                          placeholder="품명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lot번호 *</Label>
                        <Input
                          value={processForm.lotNo}
                          onChange={(e) => setProcessForm({ ...processForm, lotNo: e.target.value })}
                          placeholder="Lot번호"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inspection Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-lg font-semibold">검사항목별 측정값</h3>
                      <Button size="sm" onClick={() => addInspectionItem(processItems, setProcessItems)}>
                        <Plus className="mr-2 h-4 w-4" />
                        항목 추가
                      </Button>
                    </div>
                    {renderInspectionItemsTable(processItems, setProcessItems)}
                  </div>

                  {/* Judgment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">종합 판정</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>판정 *</Label>
                        <Select
                          value={processOverallResult}
                          onValueChange={(value) => setProcessOverallResult(value as "양호" | "불량")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="판정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="양호">양호</SelectItem>
                            <SelectItem value="불량">불량</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Textarea
                          value={processRemarks}
                          onChange={(e) => setProcessRemarks(e.target.value)}
                          placeholder="특이사항 입력"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProcessInspection}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: 초물/종물 검사 (First-off/Last-off Inspection) */}
            <TabsContent value="firstlast">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    초물/종물 검사
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>검사일 *</Label>
                        <Input
                          type="date"
                          value={firstLastForm.inspectionDate}
                          onChange={(e) => setFirstLastForm({ ...firstLastForm, inspectionDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공정명 *</Label>
                        <Select
                          value={firstLastForm.processName}
                          onValueChange={(value) => setFirstLastForm({ ...firstLastForm, processName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="공정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="사출">사출</SelectItem>
                            <SelectItem value="도장">도장</SelectItem>
                            <SelectItem value="조립">조립</SelectItem>
                            <SelectItem value="검사">검사</SelectItem>
                            <SelectItem value="포장">포장</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>라인</Label>
                        <Select
                          value={firstLastForm.line}
                          onValueChange={(value) => setFirstLastForm({ ...firstLastForm, line: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="라인 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A라인">A라인</SelectItem>
                            <SelectItem value="B라인">B라인</SelectItem>
                            <SelectItem value="C라인">C라인</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>품번 *</Label>
                        <Input
                          value={firstLastForm.partNo}
                          onChange={(e) => setFirstLastForm({ ...firstLastForm, partNo: e.target.value })}
                          placeholder="품번"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>품명</Label>
                        <Input
                          value={firstLastForm.productName}
                          onChange={(e) => setFirstLastForm({ ...firstLastForm, productName: e.target.value })}
                          placeholder="품명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lot번호 *</Label>
                        <Input
                          value={firstLastForm.lotNo}
                          onChange={(e) => setFirstLastForm({ ...firstLastForm, lotNo: e.target.value })}
                          placeholder="Lot번호"
                        />
                      </div>
                    </div>
                  </div>

                  {/* First-off Inspection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <PlayCircle className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold">초물검사 (생산 시작시)</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>검사시간 *</Label>
                        <Input
                          type="time"
                          value={firstInspection.time}
                          onChange={(e) => setFirstInspection({ ...firstInspection, time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사자 *</Label>
                        <Input
                          value={firstInspection.inspector}
                          onChange={(e) => setFirstInspection({ ...firstInspection, inspector: e.target.value })}
                          placeholder="검사자명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>판정</Label>
                        <Select
                          value={firstInspection.result}
                          onValueChange={(value) =>
                            setFirstInspection({ ...firstInspection, result: value as "양호" | "불량" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="판정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="양호">양호</SelectItem>
                            <SelectItem value="불량">불량</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline" onClick={() => addInspectionItem(firstItems, setFirstItems)}>
                        <Plus className="mr-2 h-4 w-4" />
                        항목 추가
                      </Button>
                    </div>
                    {renderInspectionItemsTable(firstItems, setFirstItems)}
                  </div>

                  {/* Last-off Inspection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <StopCircle className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold">종물검사 (생산 종료시)</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>검사시간</Label>
                        <Input
                          type="time"
                          value={lastInspection.time}
                          onChange={(e) => setLastInspection({ ...lastInspection, time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사자</Label>
                        <Input
                          value={lastInspection.inspector}
                          onChange={(e) => setLastInspection({ ...lastInspection, inspector: e.target.value })}
                          placeholder="검사자명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>판정</Label>
                        <Select
                          value={lastInspection.result}
                          onValueChange={(value) =>
                            setLastInspection({ ...lastInspection, result: value as "양호" | "불량" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="판정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="양호">양호</SelectItem>
                            <SelectItem value="불량">불량</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline" onClick={() => addInspectionItem(lastItems, setLastItems)}>
                        <Plus className="mr-2 h-4 w-4" />
                        항목 추가
                      </Button>
                    </div>
                    {renderInspectionItemsTable(lastItems, setLastItems)}
                  </div>

                  {/* Comparison Result */}
                  {firstInspection.result && lastInspection.result && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">비교 결과</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card className={firstInspection.result === "양호" ? "bg-green-50" : "bg-red-50"}>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">초물검사 결과</div>
                            <div className="text-xl font-bold">{getResultBadge(firstInspection.result)}</div>
                          </CardContent>
                        </Card>
                        <Card className={lastInspection.result === "양호" ? "bg-green-50" : "bg-red-50"}>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">종물검사 결과</div>
                            <div className="text-xl font-bold">{getResultBadge(lastInspection.result)}</div>
                          </CardContent>
                        </Card>
                        <Card
                          className={
                            firstInspection.result === lastInspection.result ? "bg-blue-50" : "bg-yellow-50"
                          }
                        >
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">비교 결과</div>
                            <div className="text-xl font-bold">
                              {firstInspection.result === lastInspection.result ? (
                                <Badge variant="success">일치</Badge>
                              ) : (
                                <Badge variant="warning">불일치</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Textarea
                      value={firstLastRemarks}
                      onChange={(e) => setFirstLastRemarks(e.target.value)}
                      placeholder="특이사항 입력"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveFirstLastInspection}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: 순회검사 현황 (Patrol Inspection) */}
            <TabsContent value="patrol">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    순회검사 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">기본 정보</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>검사일 *</Label>
                        <Input
                          type="date"
                          value={patrolForm.inspectionDate}
                          onChange={(e) => setPatrolForm({ ...patrolForm, inspectionDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>검사시간 *</Label>
                        <Input
                          type="time"
                          value={patrolForm.inspectionTime}
                          onChange={(e) => setPatrolForm({ ...patrolForm, inspectionTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>공정명 *</Label>
                        <Select
                          value={patrolForm.processName}
                          onValueChange={(value) => setPatrolForm({ ...patrolForm, processName: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="공정 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="사출">사출</SelectItem>
                            <SelectItem value="도장">도장</SelectItem>
                            <SelectItem value="조립">조립</SelectItem>
                            <SelectItem value="검사">검사</SelectItem>
                            <SelectItem value="포장">포장</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>검사자 *</Label>
                        <Input
                          value={patrolForm.inspector}
                          onChange={(e) => setPatrolForm({ ...patrolForm, inspector: e.target.value })}
                          placeholder="검사자명"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>라인</Label>
                        <Select
                          value={patrolForm.line}
                          onValueChange={(value) => setPatrolForm({ ...patrolForm, line: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="라인 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A라인">A라인</SelectItem>
                            <SelectItem value="B라인">B라인</SelectItem>
                            <SelectItem value="C라인">C라인</SelectItem>
                            <SelectItem value="전체">전체</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Check Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">시간대별 순회검사 항목</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">No.</TableHead>
                          <TableHead>점검 항목</TableHead>
                          <TableHead className="w-32">상태</TableHead>
                          <TableHead>이상시 조치 내용</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patrolCheckItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{item.item}</TableCell>
                            <TableCell>
                              <Select
                                value={item.status}
                                onValueChange={(value) =>
                                  setPatrolCheckItems(
                                    patrolCheckItems.map((ci) =>
                                      ci.id === item.id ? { ...ci, status: value as "정상" | "이상" } : ci
                                    )
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="상태" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="정상">정상</SelectItem>
                                  <SelectItem value="이상">이상</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={item.action}
                                onChange={(e) =>
                                  setPatrolCheckItems(
                                    patrolCheckItems.map((ci) =>
                                      ci.id === item.id ? { ...ci, action: e.target.value } : ci
                                    )
                                  )
                                }
                                placeholder="조치 내용"
                                disabled={item.status !== "이상"}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Abnormality Summary */}
                  {patrolCheckItems.some((item) => item.status === "이상") && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b pb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-yellow-700">이상 발생 현황</h3>
                      </div>
                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            {patrolCheckItems
                              .filter((item) => item.status === "이상")
                              .map((item) => (
                                <div key={item.id} className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium">{item.item}</span>
                                    {item.action && (
                                      <span className="text-sm text-muted-foreground"> - 조치: {item.action}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Action Taken */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">종합 조치 내용</h3>
                    <Textarea
                      value={patrolActionTaken}
                      onChange={(e) => setPatrolActionTaken(e.target.value)}
                      placeholder="전체적인 조치 내용을 입력하세요..."
                      rows={3}
                    />
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <Label>비고</Label>
                    <Textarea
                      value={patrolRemarks}
                      onChange={(e) => setPatrolRemarks(e.target.value)}
                      placeholder="특이사항 입력"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSavePatrolInspection}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: 검사 이력 (Inspection History) */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    검사 이력
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="검사번호, 품번, Lot번호로 검색..."
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={historyFilter}
                      onValueChange={(value) =>
                        setHistoryFilter(value as "all" | "process" | "firstlast" | "patrol")
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="검사 유형" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="process">공정검사</SelectItem>
                        <SelectItem value="firstlast">초물/종물 검사</SelectItem>
                        <SelectItem value="patrol">순회검사</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Process Inspection History */}
                  {(historyFilter === "all" || historyFilter === "process") && processHistory.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4" />
                        공정검사 이력
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사번호</TableHead>
                            <TableHead>검사일시</TableHead>
                            <TableHead>공정/라인</TableHead>
                            <TableHead>품번</TableHead>
                            <TableHead>Lot번호</TableHead>
                            <TableHead>검사자</TableHead>
                            <TableHead>판정</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {processHistory
                            .filter(
                              (r) =>
                                r.inspectionNo.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                r.partNo.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                r.lotNo.toLowerCase().includes(historySearchQuery.toLowerCase())
                            )
                            .map((record) => (
                              <TableRow key={record.id}>
                                <TableCell className="font-mono text-sm">{record.inspectionNo}</TableCell>
                                <TableCell>
                                  {record.inspectionDate} {record.inspectionTime}
                                </TableCell>
                                <TableCell>
                                  {record.processName} / {record.line || "-"}
                                </TableCell>
                                <TableCell className="font-mono">{record.partNo}</TableCell>
                                <TableCell className="font-mono text-sm">{record.lotNo}</TableCell>
                                <TableCell>{record.inspector}</TableCell>
                                <TableCell>{getResultBadge(record.overallResult)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* First-off/Last-off Inspection History */}
                  {(historyFilter === "all" || historyFilter === "firstlast") && firstLastHistory.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        초물/종물 검사 이력
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사일</TableHead>
                            <TableHead>공정/라인</TableHead>
                            <TableHead>품번</TableHead>
                            <TableHead>Lot번호</TableHead>
                            <TableHead>초물 결과</TableHead>
                            <TableHead>종물 결과</TableHead>
                            <TableHead>비교</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {firstLastHistory
                            .filter(
                              (r) =>
                                r.partNo.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                                r.lotNo.toLowerCase().includes(historySearchQuery.toLowerCase())
                            )
                            .map((record) => (
                              <TableRow key={record.id}>
                                <TableCell>{record.inspectionDate}</TableCell>
                                <TableCell>
                                  {record.processName} / {record.line || "-"}
                                </TableCell>
                                <TableCell className="font-mono">{record.partNo}</TableCell>
                                <TableCell className="font-mono text-sm">{record.lotNo}</TableCell>
                                <TableCell>{getResultBadge(record.firstResult)}</TableCell>
                                <TableCell>{getResultBadge(record.lastResult)}</TableCell>
                                <TableCell>{getResultBadge(record.comparisonResult)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Patrol Inspection History */}
                  {(historyFilter === "all" || historyFilter === "patrol") && patrolHistory.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        순회검사 이력
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>검사일시</TableHead>
                            <TableHead>공정/라인</TableHead>
                            <TableHead>검사자</TableHead>
                            <TableHead>상태</TableHead>
                            <TableHead>이상 항목</TableHead>
                            <TableHead>조치 내용</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patrolHistory.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>
                                {record.inspectionDate} {record.inspectionTime}
                              </TableCell>
                              <TableCell>
                                {record.processName} / {record.line || "-"}
                              </TableCell>
                              <TableCell>{record.inspector}</TableCell>
                              <TableCell>{getResultBadge(record.overallStatus)}</TableCell>
                              <TableCell>
                                {record.checkItems.filter((item) => item.status === "이상").length > 0 ? (
                                  <span className="text-red-600">
                                    {record.checkItems.filter((item) => item.status === "이상").length}건
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{record.actionTaken || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Empty State */}
                  {processHistory.length === 0 &&
                    firstLastHistory.length === 0 &&
                    patrolHistory.length === 0 && (
                      <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
