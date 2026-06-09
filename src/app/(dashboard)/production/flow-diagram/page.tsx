"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Plus,
  Save,
  Trash2,
  List,
  GitCompare,
  History,
  Search,
  Circle,
  Square,
  Triangle,
  Diamond,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Process symbol types based on IATF 16949
type ProcessSymbol = "operation" | "inspection" | "storage" | "decision" | "transport";

// Process symbol display info
const PROCESS_SYMBOLS: Record<ProcessSymbol, { symbol: string; label: string; icon: React.ReactNode }> = {
  operation: { symbol: "○", label: "작업 (Operation)", icon: <Circle className="h-4 w-4" /> },
  inspection: { symbol: "□", label: "검사 (Inspection)", icon: <Square className="h-4 w-4" /> },
  storage: { symbol: "▽", label: "저장 (Storage)", icon: <Triangle className="h-4 w-4 rotate-180" /> },
  decision: { symbol: "◇", label: "판정 (Decision)", icon: <Diamond className="h-4 w-4" /> },
  transport: { symbol: "→", label: "이동 (Transport)", icon: <ArrowRight className="h-4 w-4" /> },
};

// Process step interface
interface ProcessStep {
  id: number;
  sequence: number;
  processName: string;
  processSymbol: ProcessSymbol;
  equipment: string;
  workDescription: string;
}

// Flow diagram document interface
interface FlowDiagram {
  id: number;
  documentNo: string;
  revisionNo: string;
  revisionDate: string;
  partNo: string;
  partName: string;
  createdBy: string;
  createdDate: string;
  approvedBy: string;
  processSteps: ProcessStep[];
}

// Revision history item
interface RevisionHistoryItem {
  id: number;
  documentNo: string;
  partNo: string;
  partName: string;
  revisionNo: string;
  revisionDate: string;
  changeDescription: string;
  changedBy: string;
  approvedBy: string;
}

// Sample flow diagrams data
const initialFlowDiagrams: FlowDiagram[] = [
  {
    id: 1,
    documentNo: "PFD-2026-001",
    revisionNo: "Rev.01",
    revisionDate: "2026-05-15",
    partNo: "MBD0023D784",
    partName: "NQ5 PE FRT Bumper",
    createdBy: "Hong",
    createdDate: "2026-05-10",
    approvedBy: "Kim",
    processSteps: [
      { id: 1, sequence: 10, processName: "원재료 입고", processSymbol: "transport", equipment: "지게차", workDescription: "원재료 입고 및 검수" },
      { id: 2, sequence: 20, processName: "수입검사", processSymbol: "inspection", equipment: "검사대", workDescription: "원재료 규격 검사, 성적서 확인" },
      { id: 3, sequence: 30, processName: "원재료 보관", processSymbol: "storage", equipment: "창고", workDescription: "온습도 관리 창고 보관" },
      { id: 4, sequence: 40, processName: "건조", processSymbol: "operation", equipment: "건조기", workDescription: "PP 수지 건조 (80°C, 4hr)" },
      { id: 5, sequence: 50, processName: "사출 성형", processSymbol: "operation", equipment: "사출기 #1", workDescription: "금형 셋팅, 사출 성형" },
      { id: 6, sequence: 60, processName: "초물 검사", processSymbol: "inspection", equipment: "검사대", workDescription: "초물 품질 확인 및 승인" },
      { id: 7, sequence: 70, processName: "냉각", processSymbol: "operation", equipment: "냉각 지그", workDescription: "제품 냉각 (상온 30분)" },
      { id: 8, sequence: 80, processName: "트리밍", processSymbol: "operation", equipment: "트리밍 JIG", workDescription: "버 제거, 게이트 컷" },
      { id: 9, sequence: 90, processName: "외관 검사", processSymbol: "inspection", equipment: "검사대", workDescription: "외관 전수 검사" },
      { id: 10, sequence: 100, processName: "합부 판정", processSymbol: "decision", equipment: "-", workDescription: "양품/불량품 판정" },
      { id: 11, sequence: 110, processName: "포장", processSymbol: "operation", equipment: "포장대", workDescription: "제품 포장 및 라벨링" },
      { id: 12, sequence: 120, processName: "출하 검사", processSymbol: "inspection", equipment: "검사대", workDescription: "출하 전 최종 검사" },
      { id: 13, sequence: 130, processName: "출하", processSymbol: "transport", equipment: "트럭", workDescription: "고객사 출하" },
    ],
  },
  {
    id: 2,
    documentNo: "PFD-2026-002",
    revisionNo: "Rev.02",
    revisionDate: "2026-06-01",
    partNo: "MBD0023D785",
    partName: "NQ5 PE RR Bumper",
    createdBy: "Hong",
    createdDate: "2026-04-20",
    approvedBy: "Kim",
    processSteps: [
      { id: 101, sequence: 10, processName: "원재료 입고", processSymbol: "transport", equipment: "지게차", workDescription: "원재료 입고" },
      { id: 102, sequence: 20, processName: "수입검사", processSymbol: "inspection", equipment: "검사대", workDescription: "원재료 검사" },
      { id: 103, sequence: 30, processName: "건조", processSymbol: "operation", equipment: "건조기", workDescription: "PP 수지 건조" },
      { id: 104, sequence: 40, processName: "사출 성형", processSymbol: "operation", equipment: "사출기 #2", workDescription: "사출 성형" },
      { id: 105, sequence: 50, processName: "냉각/안정화", processSymbol: "operation", equipment: "냉각 JIG", workDescription: "냉각 및 치수 안정화" },
      { id: 106, sequence: 60, processName: "후가공", processSymbol: "operation", equipment: "가공대", workDescription: "홀 가공, 버 제거" },
      { id: 107, sequence: 70, processName: "검사", processSymbol: "inspection", equipment: "검사대", workDescription: "외관/치수 검사" },
      { id: 108, sequence: 80, processName: "포장/출하", processSymbol: "transport", equipment: "트럭", workDescription: "포장 및 출하" },
    ],
  },
  {
    id: 3,
    documentNo: "PFD-2026-003",
    revisionNo: "Rev.01",
    revisionDate: "2026-06-05",
    partNo: "MBD0023D786",
    partName: "NQ5 Side Sill Moulding",
    createdBy: "Lee",
    createdDate: "2026-06-01",
    approvedBy: "Park",
    processSteps: [
      { id: 201, sequence: 10, processName: "원재료 입고", processSymbol: "transport", equipment: "지게차", workDescription: "PP+TPO 입고" },
      { id: 202, sequence: 20, processName: "수입검사", processSymbol: "inspection", equipment: "검사대", workDescription: "LOT 검사" },
      { id: 203, sequence: 30, processName: "압출 성형", processSymbol: "operation", equipment: "압출기", workDescription: "연속 압출 성형" },
      { id: 204, sequence: 40, processName: "냉각", processSymbol: "operation", equipment: "수조", workDescription: "수냉 냉각" },
      { id: 205, sequence: 50, processName: "절단", processSymbol: "operation", equipment: "절단기", workDescription: "규정 길이 절단" },
      { id: 206, sequence: 60, processName: "검사", processSymbol: "inspection", equipment: "검사대", workDescription: "치수/외관 검사" },
      { id: 207, sequence: 70, processName: "포장/출하", processSymbol: "transport", equipment: "트럭", workDescription: "포장 및 출하" },
    ],
  },
];

// Sample revision history data
const initialRevisionHistory: RevisionHistoryItem[] = [
  {
    id: 1,
    documentNo: "PFD-2026-002",
    partNo: "MBD0023D785",
    partName: "NQ5 PE RR Bumper",
    revisionNo: "Rev.02",
    revisionDate: "2026-06-01",
    changeDescription: "냉각 공정 분리, 후가공 공정 추가",
    changedBy: "Hong",
    approvedBy: "Kim",
  },
  {
    id: 2,
    documentNo: "PFD-2026-002",
    partNo: "MBD0023D785",
    partName: "NQ5 PE RR Bumper",
    revisionNo: "Rev.01",
    revisionDate: "2026-04-20",
    changeDescription: "최초 등록",
    changedBy: "Hong",
    approvedBy: "Kim",
  },
  {
    id: 3,
    documentNo: "PFD-2026-001",
    partNo: "MBD0023D784",
    partName: "NQ5 PE FRT Bumper",
    revisionNo: "Rev.01",
    revisionDate: "2026-05-15",
    changeDescription: "최초 등록",
    changedBy: "Hong",
    approvedBy: "Kim",
  },
];

export default function FlowDiagramPage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Flow diagram registration state
  const [currentDiagram, setCurrentDiagram] = useState<FlowDiagram>({
    id: 0,
    documentNo: "",
    revisionNo: "",
    revisionDate: "",
    partNo: "",
    partName: "",
    createdBy: "",
    createdDate: "",
    approvedBy: "",
    processSteps: [
      {
        id: Date.now(),
        sequence: 10,
        processName: "",
        processSymbol: "operation",
        equipment: "",
        workDescription: "",
      },
    ],
  });

  // Flow diagrams list state
  const [flowDiagrams, setFlowDiagrams] = useState<FlowDiagram[]>(initialFlowDiagrams);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPartNo, setFilterPartNo] = useState("");

  // Comparison state
  const [compareItem1, setCompareItem1] = useState<string>("");
  const [compareItem2, setCompareItem2] = useState<string>("");

  // Revision history state
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>(initialRevisionHistory);
  const [revisionSearchTerm, setRevisionSearchTerm] = useState("");

  // Filtered flow diagrams
  const filteredDiagrams = useMemo(() => {
    return flowDiagrams.filter((diagram) => {
      const matchesSearch =
        searchTerm === "" ||
        diagram.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagram.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagram.documentNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPartNo = filterPartNo === "" || diagram.partNo === filterPartNo;
      return matchesSearch && matchesPartNo;
    });
  }, [flowDiagrams, searchTerm, filterPartNo]);

  // Filtered revision history
  const filteredRevisionHistory = useMemo(() => {
    return revisionHistory.filter((item) => {
      return (
        revisionSearchTerm === "" ||
        item.partNo.toLowerCase().includes(revisionSearchTerm.toLowerCase()) ||
        item.partName.toLowerCase().includes(revisionSearchTerm.toLowerCase()) ||
        item.documentNo.toLowerCase().includes(revisionSearchTerm.toLowerCase())
      );
    });
  }, [revisionHistory, revisionSearchTerm]);

  // Get unique part numbers for filter
  const uniquePartNos = useMemo(() => {
    return [...new Set(flowDiagrams.map((d) => d.partNo))];
  }, [flowDiagrams]);

  // Comparison diagrams
  const diagram1 = useMemo(() => {
    return flowDiagrams.find((d) => d.partNo === compareItem1);
  }, [flowDiagrams, compareItem1]);

  const diagram2 = useMemo(() => {
    return flowDiagrams.find((d) => d.partNo === compareItem2);
  }, [flowDiagrams, compareItem2]);

  // Process step handlers
  const addProcessStep = () => {
    const maxSequence = currentDiagram.processSteps.length > 0
      ? Math.max(...currentDiagram.processSteps.map((s) => s.sequence))
      : 0;
    setCurrentDiagram({
      ...currentDiagram,
      processSteps: [
        ...currentDiagram.processSteps,
        {
          id: Date.now(),
          sequence: maxSequence + 10,
          processName: "",
          processSymbol: "operation",
          equipment: "",
          workDescription: "",
        },
      ],
    });
  };

  const removeProcessStep = (id: number) => {
    if (currentDiagram.processSteps.length <= 1) return;
    setCurrentDiagram({
      ...currentDiagram,
      processSteps: currentDiagram.processSteps.filter((s) => s.id !== id),
    });
  };

  const updateProcessStep = (id: number, field: keyof ProcessStep, value: string | number) => {
    setCurrentDiagram({
      ...currentDiagram,
      processSteps: currentDiagram.processSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    });
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...currentDiagram.processSteps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    // Update sequence numbers
    newSteps.forEach((step, idx) => {
      step.sequence = (idx + 1) * 10;
    });
    setCurrentDiagram({ ...currentDiagram, processSteps: newSteps });
  };

  const moveStepDown = (index: number) => {
    if (index === currentDiagram.processSteps.length - 1) return;
    const newSteps = [...currentDiagram.processSteps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    // Update sequence numbers
    newSteps.forEach((step, idx) => {
      step.sequence = (idx + 1) * 10;
    });
    setCurrentDiagram({ ...currentDiagram, processSteps: newSteps });
  };

  // Save flow diagram
  const handleSave = () => {
    if (!currentDiagram.documentNo || !currentDiagram.partNo || !currentDiagram.partName) {
      alert("문서번호, 품번, 품명은 필수 입력 항목입니다.");
      return;
    }
    const newDiagram: FlowDiagram = {
      ...currentDiagram,
      id: Date.now(),
    };
    setFlowDiagrams([...flowDiagrams, newDiagram]);

    // Add to revision history
    const newRevision: RevisionHistoryItem = {
      id: Date.now(),
      documentNo: newDiagram.documentNo,
      partNo: newDiagram.partNo,
      partName: newDiagram.partName,
      revisionNo: newDiagram.revisionNo || "Rev.01",
      revisionDate: newDiagram.revisionDate || new Date().toISOString().split("T")[0],
      changeDescription: "신규 등록",
      changedBy: newDiagram.createdBy,
      approvedBy: newDiagram.approvedBy,
    };
    setRevisionHistory([newRevision, ...revisionHistory]);

    alert("공정흐름도가 저장되었습니다.");
    // Reset form
    setCurrentDiagram({
      id: 0,
      documentNo: "",
      revisionNo: "",
      revisionDate: "",
      partNo: "",
      partName: "",
      createdBy: "",
      createdDate: "",
      approvedBy: "",
      processSteps: [
        {
          id: Date.now(),
          sequence: 10,
          processName: "",
          processSymbol: "operation",
          equipment: "",
          workDescription: "",
        },
      ],
    });
  };

  // Load diagram for editing
  const loadDiagram = (diagram: FlowDiagram) => {
    setCurrentDiagram({ ...diagram });
    setActiveTab("registration");
  };

  // Delete diagram
  const deleteDiagram = (id: number) => {
    if (!confirm("이 공정흐름도를 삭제하시겠습니까?")) return;
    setFlowDiagrams(flowDiagrams.filter((d) => d.id !== id));
  };

  // Get symbol badge
  const getSymbolBadge = (symbol: ProcessSymbol) => {
    const info = PROCESS_SYMBOLS[symbol];
    const variantMap: Record<ProcessSymbol, "default" | "secondary" | "outline" | "destructive"> = {
      operation: "default",
      inspection: "secondary",
      storage: "outline",
      decision: "destructive",
      transport: "outline",
    };
    return (
      <Badge variant={variantMap[symbol]} className="font-mono text-lg px-2">
        {info.symbol}
      </Badge>
    );
  };

  // Compare process differences
  const getProcessDifferences = () => {
    if (!diagram1 || !diagram2) return [];

    const differences: Array<{
      type: "added" | "removed" | "different";
      process1?: ProcessStep;
      process2?: ProcessStep;
      description: string;
    }> = [];

    // Check processes in diagram1 that are not in diagram2
    diagram1.processSteps.forEach((step1) => {
      const matchingStep = diagram2.processSteps.find(
        (step2) => step2.processName === step1.processName
      );
      if (!matchingStep) {
        differences.push({
          type: "removed",
          process1: step1,
          description: `${step1.processName} - ${diagram1.partName}에만 존재`,
        });
      } else if (
        matchingStep.processSymbol !== step1.processSymbol ||
        matchingStep.equipment !== step1.equipment ||
        matchingStep.workDescription !== step1.workDescription
      ) {
        differences.push({
          type: "different",
          process1: step1,
          process2: matchingStep,
          description: `${step1.processName} - 내용 상이`,
        });
      }
    });

    // Check processes in diagram2 that are not in diagram1
    diagram2.processSteps.forEach((step2) => {
      const matchingStep = diagram1.processSteps.find(
        (step1) => step1.processName === step2.processName
      );
      if (!matchingStep) {
        differences.push({
          type: "added",
          process2: step2,
          description: `${step2.processName} - ${diagram2.partName}에만 존재`,
        });
      }
    });

    return differences;
  };

  const differences = useMemo(() => getProcessDifferences(), [diagram1, diagram2]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공정흐름도 (Process Flow Diagram)</h1>
          <p className="text-muted-foreground">IATF 16949 기반 공정흐름도 관리</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <FileText className="mr-2 h-4 w-4" />
            공정흐름도 등록
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            공정흐름도 목록
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <GitCompare className="mr-2 h-4 w-4" />
            공정 비교
          </TabsTrigger>
          <TabsTrigger value="revision-history">
            <History className="mr-2 h-4 w-4" />
            개정 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Flow Diagram Registration */}
        <TabsContent value="registration" className="space-y-6">
          {/* Document Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                문서 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="documentNo">문서번호 *</Label>
                  <Input
                    id="documentNo"
                    value={currentDiagram.documentNo}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, documentNo: e.target.value })
                    }
                    placeholder="PFD-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revisionNo">개정번호</Label>
                  <Input
                    id="revisionNo"
                    value={currentDiagram.revisionNo}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, revisionNo: e.target.value })
                    }
                    placeholder="Rev.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createdDate">작성일</Label>
                  <Input
                    id="createdDate"
                    type="date"
                    value={currentDiagram.createdDate}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, createdDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revisionDate">개정일</Label>
                  <Input
                    id="revisionDate"
                    type="date"
                    value={currentDiagram.revisionDate}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, revisionDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="partNo">품번 *</Label>
                  <Input
                    id="partNo"
                    value={currentDiagram.partNo}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, partNo: e.target.value })
                    }
                    placeholder="MBD0023D784"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partName">품명 *</Label>
                  <Input
                    id="partName"
                    value={currentDiagram.partName}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, partName: e.target.value })
                    }
                    placeholder="NQ5 PE FRT Bumper"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createdBy">작성자</Label>
                  <Input
                    id="createdBy"
                    value={currentDiagram.createdBy}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, createdBy: e.target.value })
                    }
                    placeholder="작성자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvedBy">승인자</Label>
                  <Input
                    id="approvedBy"
                    value={currentDiagram.approvedBy}
                    onChange={(e) =>
                      setCurrentDiagram({ ...currentDiagram, approvedBy: e.target.value })
                    }
                    placeholder="승인자명"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Symbol Legend */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-medium text-sm">공정기호:</span>
                {Object.entries(PROCESS_SYMBOLS).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-lg">{value.symbol}</span>
                    <span className="text-muted-foreground">{value.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Process Steps Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                공정 단계 등록
              </CardTitle>
              <Button onClick={addProcessStep} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                공정 추가
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">순서</TableHead>
                    <TableHead className="w-[80px] text-center">순번</TableHead>
                    <TableHead className="min-w-[150px]">공정명</TableHead>
                    <TableHead className="w-[120px] text-center">공정기호</TableHead>
                    <TableHead className="min-w-[150px]">설비</TableHead>
                    <TableHead className="min-w-[250px]">작업내용</TableHead>
                    <TableHead className="w-[100px] text-center">삭제</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDiagram.processSteps.map((step, index) => (
                    <TableRow key={step.id}>
                      <TableCell className="text-center">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveStepUp(index)}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveStepDown(index)}
                            disabled={index === currentDiagram.processSteps.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={step.sequence}
                          onChange={(e) =>
                            updateProcessStep(step.id, "sequence", Number(e.target.value))
                          }
                          className="w-16 text-center"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={step.processName}
                          onChange={(e) =>
                            updateProcessStep(step.id, "processName", e.target.value)
                          }
                          placeholder="공정명 입력"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={step.processSymbol}
                          onValueChange={(v) =>
                            updateProcessStep(step.id, "processSymbol", v as ProcessSymbol)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PROCESS_SYMBOLS).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                <span className="font-mono">{value.symbol}</span> {value.label.split(" ")[0]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={step.equipment}
                          onChange={(e) =>
                            updateProcessStep(step.id, "equipment", e.target.value)
                          }
                          placeholder="설비명"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={step.workDescription}
                          onChange={(e) =>
                            updateProcessStep(step.id, "workDescription", e.target.value)
                          }
                          placeholder="작업내용 상세"
                          rows={2}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeProcessStep(step.id)}
                          disabled={currentDiagram.processSteps.length <= 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Flow Diagram Preview */}
          {currentDiagram.processSteps.some((s) => s.processName) && (
            <Card>
              <CardHeader>
                <CardTitle>공정흐름도 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  {currentDiagram.processSteps
                    .filter((s) => s.processName)
                    .map((step, index, arr) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className="flex flex-col items-center p-2 border rounded-lg bg-background min-w-[100px]">
                          <span className="font-mono text-2xl">
                            {PROCESS_SYMBOLS[step.processSymbol].symbol}
                          </span>
                          <span className="text-xs text-center font-medium mt-1">
                            {step.processName}
                          </span>
                          <span className="text-xs text-muted-foreground">{step.sequence}</span>
                        </div>
                        {index < arr.length - 1 && (
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Flow Diagram List */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                공정흐름도 목록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="문서번호, 품번, 품명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterPartNo} onValueChange={setFilterPartNo}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="품번 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">전체</SelectItem>
                    {uniquePartNos.map((partNo) => (
                      <SelectItem key={partNo} value={partNo}>
                        {partNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Diagrams Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>문서번호</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>개정번호</TableHead>
                    <TableHead>작성일</TableHead>
                    <TableHead className="text-center">공정수</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiagrams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        등록된 공정흐름도가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDiagrams.map((diagram) => (
                      <TableRow key={diagram.id}>
                        <TableCell className="font-mono">{diagram.documentNo}</TableCell>
                        <TableCell className="font-mono">{diagram.partNo}</TableCell>
                        <TableCell>{diagram.partName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{diagram.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{diagram.createdDate}</TableCell>
                        <TableCell className="text-center">
                          <Badge>{diagram.processSteps.length}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadDiagram(diagram)}
                            >
                              편집
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDiagram(diagram.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              삭제
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Selected Diagram Detail View */}
          {filteredDiagrams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>공정흐름도 상세 보기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredDiagrams.map((diagram) => (
                  <div key={diagram.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{diagram.partName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {diagram.documentNo} | {diagram.partNo} | {diagram.revisionNo}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
                      {diagram.processSteps.map((step, index, arr) => (
                        <div key={step.id} className="flex items-center gap-2">
                          <div className="flex flex-col items-center p-2 border rounded bg-muted/50 min-w-[80px]">
                            <span className="font-mono text-xl">
                              {PROCESS_SYMBOLS[step.processSymbol].symbol}
                            </span>
                            <span className="text-xs text-center">{step.processName}</span>
                          </div>
                          {index < arr.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Process Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                공정 비교
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>품목 1 선택</Label>
                  <Select value={compareItem1} onValueChange={setCompareItem1}>
                    <SelectTrigger>
                      <SelectValue placeholder="품목을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {flowDiagrams.map((d) => (
                        <SelectItem key={d.partNo} value={d.partNo}>
                          {d.partNo} - {d.partName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>품목 2 선택</Label>
                  <Select value={compareItem2} onValueChange={setCompareItem2}>
                    <SelectTrigger>
                      <SelectValue placeholder="품목을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {flowDiagrams.map((d) => (
                        <SelectItem key={d.partNo} value={d.partNo}>
                          {d.partNo} - {d.partName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comparison View */}
              {diagram1 && diagram2 && (
                <>
                  {/* Side by Side Flow */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Diagram 1 */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{diagram1.partName}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {diagram1.partNo} | {diagram1.revisionNo}
                      </p>
                      <div className="space-y-2">
                        {diagram1.processSteps.map((step) => {
                          const isInOther = diagram2.processSteps.some(
                            (s) => s.processName === step.processName
                          );
                          return (
                            <div
                              key={step.id}
                              className={`flex items-center gap-3 p-2 rounded ${
                                !isInOther ? "bg-red-50 border border-red-200" : "bg-muted/50"
                              }`}
                            >
                              <span className="font-mono text-lg w-8 text-center">
                                {PROCESS_SYMBOLS[step.processSymbol].symbol}
                              </span>
                              <span className="text-sm flex-1">{step.processName}</span>
                              <span className="text-xs text-muted-foreground">{step.equipment}</span>
                              {!isInOther && (
                                <Badge variant="destructive" className="text-xs">
                                  고유
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Diagram 2 */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{diagram2.partName}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {diagram2.partNo} | {diagram2.revisionNo}
                      </p>
                      <div className="space-y-2">
                        {diagram2.processSteps.map((step) => {
                          const isInOther = diagram1.processSteps.some(
                            (s) => s.processName === step.processName
                          );
                          return (
                            <div
                              key={step.id}
                              className={`flex items-center gap-3 p-2 rounded ${
                                !isInOther ? "bg-green-50 border border-green-200" : "bg-muted/50"
                              }`}
                            >
                              <span className="font-mono text-lg w-8 text-center">
                                {PROCESS_SYMBOLS[step.processSymbol].symbol}
                              </span>
                              <span className="text-sm flex-1">{step.processName}</span>
                              <span className="text-xs text-muted-foreground">{step.equipment}</span>
                              {!isInOther && (
                                <Badge variant="success" className="text-xs">
                                  고유
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Differences Summary */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">차이점 요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3 text-center">
                        <div className="p-4 border rounded-lg bg-background">
                          <div className="text-2xl font-bold">{diagram1.processSteps.length}</div>
                          <div className="text-sm text-muted-foreground">
                            {diagram1.partName} 공정수
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg bg-background">
                          <div className="text-2xl font-bold">{diagram2.processSteps.length}</div>
                          <div className="text-sm text-muted-foreground">
                            {diagram2.partName} 공정수
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg bg-background">
                          <div className="text-2xl font-bold text-orange-600">
                            {differences.length}
                          </div>
                          <div className="text-sm text-muted-foreground">차이점 개수</div>
                        </div>
                      </div>

                      {differences.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h5 className="font-medium">상세 차이점:</h5>
                          {differences.map((diff, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-sm ${
                                diff.type === "added"
                                  ? "bg-green-50 text-green-800"
                                  : diff.type === "removed"
                                  ? "bg-red-50 text-red-800"
                                  : "bg-yellow-50 text-yellow-800"
                              }`}
                            >
                              {diff.type === "added" && <span>[추가] </span>}
                              {diff.type === "removed" && <span>[삭제] </span>}
                              {diff.type === "different" && <span>[상이] </span>}
                              {diff.description}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {(!compareItem1 || !compareItem2) && (
                <div className="text-center py-12 text-muted-foreground">
                  <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>두 개의 품목을 선택하여 공정을 비교하세요.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Revision History */}
        <TabsContent value="revision-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                개정 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="문서번호, 품번, 품명으로 검색..."
                      value={revisionSearchTerm}
                      onChange={(e) => setRevisionSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* Revision History Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>문서번호</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>개정번호</TableHead>
                    <TableHead>개정일</TableHead>
                    <TableHead>변경내용</TableHead>
                    <TableHead>변경자</TableHead>
                    <TableHead>승인자</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRevisionHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        개정 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRevisionHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.documentNo}</TableCell>
                        <TableCell className="font-mono">{item.partNo}</TableCell>
                        <TableCell>{item.partName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{item.revisionDate}</TableCell>
                        <TableCell>{item.changeDescription}</TableCell>
                        <TableCell>{item.changedBy}</TableCell>
                        <TableCell>{item.approvedBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Revision History by Part */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">품목별 개정 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uniquePartNos.map((partNo) => {
                      const partHistory = revisionHistory.filter((h) => h.partNo === partNo);
                      const latestRevision = partHistory[0];
                      if (!latestRevision) return null;
                      return (
                        <div key={partNo} className="border rounded-lg p-4 bg-background">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold">{latestRevision.partName}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ({partNo})
                              </span>
                            </div>
                            <Badge>{latestRevision.revisionNo}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>총 {partHistory.length}회 개정</span>
                            <span className="mx-2">|</span>
                            <span>최근 개정일: {latestRevision.revisionDate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
