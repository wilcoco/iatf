"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Plus,
  Trash2,
  Settings,
  AlertTriangle,
  History,
  FileText,
  Save,
  Search,
} from "lucide-react";

// Control chart constants by subgroup size
const CONTROL_CHART_CONSTANTS: Record<
  number,
  { A2: number; D3: number; D4: number; d2: number; A3: number; B3: number; B4: number; c4: number }
> = {
  2: { A2: 1.88, D3: 0, D4: 3.267, d2: 1.128, A3: 2.659, B3: 0, B4: 3.267, c4: 0.7979 },
  3: { A2: 1.023, D3: 0, D4: 2.574, d2: 1.693, A3: 1.954, B3: 0, B4: 2.568, c4: 0.8862 },
  4: { A2: 0.729, D3: 0, D4: 2.282, d2: 2.059, A3: 1.628, B3: 0, B4: 2.266, c4: 0.9213 },
  5: { A2: 0.577, D3: 0, D4: 2.114, d2: 2.326, A3: 1.427, B3: 0, B4: 2.089, c4: 0.94 },
  6: { A2: 0.483, D3: 0, D4: 2.004, d2: 2.534, A3: 1.287, B3: 0.03, B4: 1.97, c4: 0.9515 },
  7: { A2: 0.419, D3: 0.076, D4: 1.924, d2: 2.704, A3: 1.182, B3: 0.118, B4: 1.882, c4: 0.9594 },
  8: { A2: 0.373, D3: 0.136, D4: 1.864, d2: 2.847, A3: 1.099, B3: 0.185, B4: 1.815, c4: 0.965 },
  9: { A2: 0.337, D3: 0.184, D4: 1.816, d2: 2.97, A3: 1.032, B3: 0.239, B4: 1.761, c4: 0.9693 },
  10: { A2: 0.308, D3: 0.223, D4: 1.777, d2: 3.078, A3: 0.975, B3: 0.284, B4: 1.716, c4: 0.9727 },
};

type ChartType = "X-bar R" | "X-bar S" | "I-MR" | "p" | "np" | "c" | "u";

interface ControlChartSetup {
  id: string;
  productName: string;
  partNumber: string;
  processName: string;
  measurementItem: string;
  unit: string;
  usl: number | null;
  lsl: number | null;
  target: number | null;
  chartType: ChartType;
  subgroupSize: number;
  createdAt: string;
  isActive: boolean;
}

interface MeasurementData {
  id: string;
  setupId: string;
  measurementDateTime: string;
  measurements: number[];
  xBar: number;
  range: number;
  stdDev: number;
  ucl: number;
  cl: number;
  lcl: number;
  rUcl: number;
  rCl: number;
  rLcl: number;
  status: "normal" | "warning" | "out";
}

interface OutOfControlRecord {
  id: string;
  setupId: string;
  detectedAt: string;
  measurementDataId: string;
  violationType: "spec-out" | "run" | "trend" | "cycle" | "ucl-out" | "lcl-out";
  description: string;
  causeAnalysis: string;
  correctiveAction: string;
  status: "open" | "in-progress" | "closed";
  closedAt: string | null;
}

interface ControlChartHistory {
  id: string;
  setupId: string;
  action: "created" | "modified" | "recalculated" | "out-of-control" | "corrective-action";
  description: string;
  timestamp: string;
  userId: string;
}

// Initial demo data
const initialSetups: ControlChartSetup[] = [
  {
    id: "setup-1",
    productName: "엔진 커버",
    partNumber: "EC-2024-001",
    processName: "사출 성형",
    measurementItem: "외경 치수",
    unit: "mm",
    usl: 25.1,
    lsl: 24.9,
    target: 25.0,
    chartType: "X-bar R",
    subgroupSize: 5,
    createdAt: "2024-01-15",
    isActive: true,
  },
  {
    id: "setup-2",
    productName: "브레이크 패드",
    partNumber: "BP-2024-003",
    processName: "프레스",
    measurementItem: "두께",
    unit: "mm",
    usl: 12.05,
    lsl: 11.95,
    target: 12.0,
    chartType: "X-bar R",
    subgroupSize: 5,
    createdAt: "2024-02-01",
    isActive: true,
  },
];

const initialMeasurements: MeasurementData[] = [
  {
    id: "m-1",
    setupId: "setup-1",
    measurementDateTime: "2024-03-01 09:00",
    measurements: [25.01, 24.98, 25.02, 24.99, 25.0],
    xBar: 25.0,
    range: 0.04,
    stdDev: 0.0158,
    ucl: 25.046,
    cl: 25.0,
    lcl: 24.954,
    rUcl: 0.0846,
    rCl: 0.04,
    rLcl: 0,
    status: "normal",
  },
  {
    id: "m-2",
    setupId: "setup-1",
    measurementDateTime: "2024-03-01 10:00",
    measurements: [25.02, 25.01, 24.99, 25.03, 25.0],
    xBar: 25.01,
    range: 0.04,
    stdDev: 0.0158,
    ucl: 25.046,
    cl: 25.0,
    lcl: 24.954,
    rUcl: 0.0846,
    rCl: 0.04,
    rLcl: 0,
    status: "normal",
  },
  {
    id: "m-3",
    setupId: "setup-1",
    measurementDateTime: "2024-03-01 11:00",
    measurements: [25.08, 25.06, 25.07, 25.05, 25.09],
    xBar: 25.07,
    range: 0.04,
    stdDev: 0.0158,
    ucl: 25.046,
    cl: 25.0,
    lcl: 24.954,
    rUcl: 0.0846,
    rCl: 0.04,
    rLcl: 0,
    status: "out",
  },
];

const initialOutOfControl: OutOfControlRecord[] = [
  {
    id: "ooc-1",
    setupId: "setup-1",
    detectedAt: "2024-03-01 11:05",
    measurementDataId: "m-3",
    violationType: "ucl-out",
    description: "X-bar 값이 UCL을 초과 (25.07 > 25.046)",
    causeAnalysis: "금형 온도 상승으로 인한 치수 변화",
    correctiveAction: "금형 냉각 시스템 점검 및 온도 조정",
    status: "closed",
    closedAt: "2024-03-01 14:00",
  },
];

const initialHistory: ControlChartHistory[] = [
  {
    id: "h-1",
    setupId: "setup-1",
    action: "created",
    description: "관리도 설정 생성",
    timestamp: "2024-01-15 09:00",
    userId: "admin",
  },
  {
    id: "h-2",
    setupId: "setup-1",
    action: "out-of-control",
    description: "관리 이탈 발생 - UCL 초과",
    timestamp: "2024-03-01 11:05",
    userId: "operator1",
  },
  {
    id: "h-3",
    setupId: "setup-1",
    action: "corrective-action",
    description: "시정조치 완료 - 금형 냉각 시스템 점검",
    timestamp: "2024-03-01 14:00",
    userId: "engineer1",
  },
];

export default function SPCManagementPage() {
  const [activeTab, setActiveTab] = useState("setup");

  // Tab 1: Control chart setups
  const [setups, setSetups] = useState<ControlChartSetup[]>(initialSetups);
  const [selectedSetupId, setSelectedSetupId] = useState<string | null>("setup-1");
  const [newSetup, setNewSetup] = useState<Partial<ControlChartSetup>>({
    chartType: "X-bar R",
    subgroupSize: 5,
  });
  const [isAddingSetup, setIsAddingSetup] = useState(false);

  // Tab 2: Measurement data
  const [measurements, setMeasurements] = useState<MeasurementData[]>(initialMeasurements);
  const [newMeasurements, setNewMeasurements] = useState<string[]>(["", "", "", "", ""]);
  const [newDateTime, setNewDateTime] = useState(
    new Date().toISOString().slice(0, 16).replace("T", " ")
  );

  // Tab 3: Out of control records
  const [outOfControlRecords, setOutOfControlRecords] =
    useState<OutOfControlRecord[]>(initialOutOfControl);
  const [editingOocId, setEditingOocId] = useState<string | null>(null);
  const [editCauseAnalysis, setEditCauseAnalysis] = useState("");
  const [editCorrectiveAction, setEditCorrectiveAction] = useState("");

  // Tab 4: History
  const [history, setHistory] = useState<ControlChartHistory[]>(initialHistory);
  const [historyFilter, setHistoryFilter] = useState<string>("all");

  const selectedSetup = setups.find((s) => s.id === selectedSetupId);
  const filteredMeasurements = measurements.filter((m) => m.setupId === selectedSetupId);
  const filteredOutOfControl = outOfControlRecords.filter((r) => r.setupId === selectedSetupId);
  const filteredHistory =
    historyFilter === "all"
      ? history.filter((h) => h.setupId === selectedSetupId)
      : history.filter((h) => h.setupId === selectedSetupId && h.action === historyFilter);

  // Calculate statistics
  const calculateStats = (
    measurementValues: number[]
  ): { xBar: number; range: number; stdDev: number } => {
    if (measurementValues.length === 0) return { xBar: 0, range: 0, stdDev: 0 };
    const xBar = measurementValues.reduce((a, b) => a + b, 0) / measurementValues.length;
    const range = Math.max(...measurementValues) - Math.min(...measurementValues);
    const variance =
      measurementValues.reduce((sum, val) => sum + Math.pow(val - xBar, 2), 0) /
      (measurementValues.length - 1);
    const stdDev = Math.sqrt(variance);
    return { xBar, range, stdDev };
  };

  // Calculate control limits for X-bar R chart
  const calculateControlLimits = (
    setup: ControlChartSetup,
    measurementData: MeasurementData[]
  ): {
    xBarUcl: number;
    xBarCl: number;
    xBarLcl: number;
    rUcl: number;
    rCl: number;
    rLcl: number;
  } | null => {
    if (measurementData.length < 2) return null;
    const constants = CONTROL_CHART_CONSTANTS[setup.subgroupSize];
    if (!constants) return null;

    const xBarSum = measurementData.reduce((sum, m) => sum + m.xBar, 0);
    const rSum = measurementData.reduce((sum, m) => sum + m.range, 0);
    const xBarBar = xBarSum / measurementData.length;
    const rBar = rSum / measurementData.length;

    return {
      xBarUcl: xBarBar + constants.A2 * rBar,
      xBarCl: xBarBar,
      xBarLcl: xBarBar - constants.A2 * rBar,
      rUcl: constants.D4 * rBar,
      rCl: rBar,
      rLcl: constants.D3 * rBar,
    };
  };

  // Handle adding new setup
  const handleAddSetup = () => {
    if (
      !newSetup.productName ||
      !newSetup.partNumber ||
      !newSetup.processName ||
      !newSetup.measurementItem
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const setup: ControlChartSetup = {
      id: `setup-${Date.now()}`,
      productName: newSetup.productName!,
      partNumber: newSetup.partNumber!,
      processName: newSetup.processName!,
      measurementItem: newSetup.measurementItem!,
      unit: newSetup.unit || "",
      usl: newSetup.usl ?? null,
      lsl: newSetup.lsl ?? null,
      target: newSetup.target ?? null,
      chartType: (newSetup.chartType as ChartType) || "X-bar R",
      subgroupSize: newSetup.subgroupSize || 5,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };

    setSetups([...setups, setup]);
    setHistory([
      ...history,
      {
        id: `h-${Date.now()}`,
        setupId: setup.id,
        action: "created",
        description: `관리도 설정 생성: ${setup.productName} - ${setup.measurementItem}`,
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        userId: "current-user",
      },
    ]);
    setNewSetup({ chartType: "X-bar R", subgroupSize: 5 });
    setIsAddingSetup(false);
    setSelectedSetupId(setup.id);
  };

  // Handle adding measurement
  const handleAddMeasurement = () => {
    if (!selectedSetup) return;

    const measurementValues = newMeasurements.slice(0, selectedSetup.subgroupSize).map((m) => parseFloat(m));
    if (measurementValues.some(isNaN)) {
      alert(`${selectedSetup.subgroupSize}개의 측정값을 모두 입력해주세요.`);
      return;
    }

    const { xBar, range, stdDev } = calculateStats(measurementValues);
    const existingMeasurements = measurements.filter((m) => m.setupId === selectedSetupId);
    const allMeasurements = [
      ...existingMeasurements,
      { xBar, range } as MeasurementData,
    ];
    const limits = calculateControlLimits(selectedSetup, allMeasurements);

    let status: "normal" | "warning" | "out" = "normal";
    if (limits) {
      if (xBar > limits.xBarUcl || xBar < limits.xBarLcl) {
        status = "out";
      } else {
        const warningUpper = limits.xBarCl + (2 / 3) * (limits.xBarUcl - limits.xBarCl);
        const warningLower = limits.xBarCl - (2 / 3) * (limits.xBarCl - limits.xBarLcl);
        if (xBar > warningUpper || xBar < warningLower) {
          status = "warning";
        }
      }
    }

    const newMeasurement: MeasurementData = {
      id: `m-${Date.now()}`,
      setupId: selectedSetupId!,
      measurementDateTime: newDateTime,
      measurements: measurementValues,
      xBar,
      range,
      stdDev,
      ucl: limits?.xBarUcl ?? 0,
      cl: limits?.xBarCl ?? xBar,
      lcl: limits?.xBarLcl ?? 0,
      rUcl: limits?.rUcl ?? 0,
      rCl: limits?.rCl ?? range,
      rLcl: limits?.rLcl ?? 0,
      status,
    };

    setMeasurements([...measurements, newMeasurement]);

    // If out of control, create a record
    if (status === "out") {
      const violationType = xBar > (limits?.xBarUcl ?? Infinity) ? "ucl-out" : "lcl-out";
      const oocRecord: OutOfControlRecord = {
        id: `ooc-${Date.now()}`,
        setupId: selectedSetupId!,
        detectedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        measurementDataId: newMeasurement.id,
        violationType,
        description: `X-bar 값이 ${violationType === "ucl-out" ? "UCL을 초과" : "LCL 미만"} (${xBar.toFixed(4)} ${violationType === "ucl-out" ? ">" : "<"} ${violationType === "ucl-out" ? limits?.xBarUcl.toFixed(4) : limits?.xBarLcl.toFixed(4)})`,
        causeAnalysis: "",
        correctiveAction: "",
        status: "open",
        closedAt: null,
      };
      setOutOfControlRecords([...outOfControlRecords, oocRecord]);
      setHistory([
        ...history,
        {
          id: `h-${Date.now()}`,
          setupId: selectedSetupId!,
          action: "out-of-control",
          description: `관리 이탈 발생 - ${violationType === "ucl-out" ? "UCL 초과" : "LCL 미만"}`,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          userId: "current-user",
        },
      ]);
    }

    // Reset inputs
    const emptyMeasurements = Array(selectedSetup.subgroupSize).fill("");
    setNewMeasurements(emptyMeasurements);
    setNewDateTime(new Date().toISOString().slice(0, 16).replace("T", " "));
  };

  // Handle delete measurement
  const handleDeleteMeasurement = (id: string) => {
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  // Handle save OOC analysis
  const handleSaveOocAnalysis = (recordId: string) => {
    setOutOfControlRecords(
      outOfControlRecords.map((r) =>
        r.id === recordId
          ? {
              ...r,
              causeAnalysis: editCauseAnalysis,
              correctiveAction: editCorrectiveAction,
              status: editCorrectiveAction ? "in-progress" : r.status,
            }
          : r
      )
    );
    setEditingOocId(null);
    setEditCauseAnalysis("");
    setEditCorrectiveAction("");
  };

  // Handle close OOC record
  const handleCloseOocRecord = (recordId: string) => {
    setOutOfControlRecords(
      outOfControlRecords.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: "closed",
              closedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
            }
          : r
      )
    );
    setHistory([
      ...history,
      {
        id: `h-${Date.now()}`,
        setupId: selectedSetupId!,
        action: "corrective-action",
        description: "시정조치 완료",
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        userId: "current-user",
      },
    ]);
  };

  // Get status badge
  const getStatusBadge = (status: "normal" | "warning" | "out") => {
    switch (status) {
      case "out":
        return <Badge variant="error">이탈</Badge>;
      case "warning":
        return <Badge variant="warning">경고</Badge>;
      default:
        return <Badge variant="success">정상</Badge>;
    }
  };

  // Get violation type label
  const getViolationTypeLabel = (type: OutOfControlRecord["violationType"]) => {
    const labels: Record<OutOfControlRecord["violationType"], string> = {
      "spec-out": "규격 이탈",
      run: "런 (Run)",
      trend: "트렌드 (Trend)",
      cycle: "사이클 (Cycle)",
      "ucl-out": "UCL 초과",
      "lcl-out": "LCL 미만",
    };
    return labels[type];
  };

  // Get OOC status badge
  const getOocStatusBadge = (status: OutOfControlRecord["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="error">미조치</Badge>;
      case "in-progress":
        return <Badge variant="warning">진행중</Badge>;
      case "closed":
        return <Badge variant="success">완료</Badge>;
    }
  };

  // Get history action label
  const getHistoryActionLabel = (action: ControlChartHistory["action"]) => {
    const labels: Record<ControlChartHistory["action"], string> = {
      created: "생성",
      modified: "수정",
      recalculated: "재계산",
      "out-of-control": "관리 이탈",
      "corrective-action": "시정조치",
    };
    return labels[action];
  };

  // Update newMeasurements array when subgroup size changes
  const handleSubgroupSizeChange = (value: string) => {
    const size = parseInt(value);
    setNewSetup({ ...newSetup, subgroupSize: size });
  };

  // Update measurement inputs when selected setup changes
  const handleSetupSelect = (setupId: string) => {
    setSelectedSetupId(setupId);
    const setup = setups.find((s) => s.id === setupId);
    if (setup) {
      setNewMeasurements(Array(setup.subgroupSize).fill(""));
    }
  };

  const limits = selectedSetup ? calculateControlLimits(selectedSetup, filteredMeasurements) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          SPC 관리 (IATF 16949)
        </h1>
        <p className="text-muted-foreground">
          통계적 공정 관리 - Statistical Process Control
        </p>
      </div>

      {/* Setup Selector */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap">관리도 선택:</Label>
            <Select value={selectedSetupId || ""} onValueChange={handleSetupSelect}>
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="관리도를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {setups.map((setup) => (
                  <SelectItem key={setup.id} value={setup.id}>
                    {setup.productName} - {setup.measurementItem} ({setup.partNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsAddingSetup(true)}>
              <Plus className="mr-2 h-4 w-4" />
              새 관리도
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">
            <Settings className="mr-2 h-4 w-4" />
            관리도 설정
          </TabsTrigger>
          <TabsTrigger value="data">
            <FileText className="mr-2 h-4 w-4" />
            데이터 입력
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <AlertTriangle className="mr-2 h-4 w-4" />
            이상 패턴 분석
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            관리도 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Control Chart Setup */}
        <TabsContent value="setup">
          <div className="space-y-6">
            {isAddingSetup && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    새 관리도 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="productName">제품명 *</Label>
                      <Input
                        id="productName"
                        placeholder="예: 엔진 커버"
                        value={newSetup.productName || ""}
                        onChange={(e) =>
                          setNewSetup({ ...newSetup, productName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partNumber">품번 *</Label>
                      <Input
                        id="partNumber"
                        placeholder="예: EC-2024-001"
                        value={newSetup.partNumber || ""}
                        onChange={(e) =>
                          setNewSetup({ ...newSetup, partNumber: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="processName">공정명 *</Label>
                      <Input
                        id="processName"
                        placeholder="예: 사출 성형"
                        value={newSetup.processName || ""}
                        onChange={(e) =>
                          setNewSetup({ ...newSetup, processName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="measurementItem">측정항목 *</Label>
                      <Input
                        id="measurementItem"
                        placeholder="예: 외경 치수"
                        value={newSetup.measurementItem || ""}
                        onChange={(e) =>
                          setNewSetup({ ...newSetup, measurementItem: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">측정단위</Label>
                      <Input
                        id="unit"
                        placeholder="예: mm"
                        value={newSetup.unit || ""}
                        onChange={(e) => setNewSetup({ ...newSetup, unit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chartType">관리도 유형</Label>
                      <Select
                        value={newSetup.chartType || "X-bar R"}
                        onValueChange={(value) =>
                          setNewSetup({ ...newSetup, chartType: value as ChartType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="X-bar R">X-bar R (평균-범위)</SelectItem>
                          <SelectItem value="X-bar S">X-bar S (평균-표준편차)</SelectItem>
                          <SelectItem value="I-MR">I-MR (개별값-이동범위)</SelectItem>
                          <SelectItem value="p">p (불량률)</SelectItem>
                          <SelectItem value="np">np (불량개수)</SelectItem>
                          <SelectItem value="c">c (결점수)</SelectItem>
                          <SelectItem value="u">u (단위당 결점수)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="subgroupSize">서브그룹 크기</Label>
                      <Select
                        value={String(newSetup.subgroupSize || 5)}
                        onValueChange={handleSubgroupSizeChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usl">상한규격 (USL)</Label>
                      <Input
                        id="usl"
                        type="number"
                        step="0.001"
                        placeholder="예: 25.1"
                        value={newSetup.usl ?? ""}
                        onChange={(e) =>
                          setNewSetup({
                            ...newSetup,
                            usl: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lsl">하한규격 (LSL)</Label>
                      <Input
                        id="lsl"
                        type="number"
                        step="0.001"
                        placeholder="예: 24.9"
                        value={newSetup.lsl ?? ""}
                        onChange={(e) =>
                          setNewSetup({
                            ...newSetup,
                            lsl: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target">목표값 (Target)</Label>
                      <Input
                        id="target"
                        type="number"
                        step="0.001"
                        placeholder="예: 25.0"
                        value={newSetup.target ?? ""}
                        onChange={(e) =>
                          setNewSetup({
                            ...newSetup,
                            target: e.target.value ? parseFloat(e.target.value) : null,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddSetup}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingSetup(false)}>
                      취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedSetup && (
              <Card>
                <CardHeader>
                  <CardTitle>관리도 설정 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-semibold">제품 정보</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">제품명</span>
                          <span>{selectedSetup.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">품번</span>
                          <span>{selectedSetup.partNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">공정명</span>
                          <span>{selectedSetup.processName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">측정항목</span>
                          <span>{selectedSetup.measurementItem}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">규격 정보</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">USL (상한규격)</span>
                          <span className="font-mono">
                            {selectedSetup.usl?.toFixed(3) ?? "-"} {selectedSetup.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">LSL (하한규격)</span>
                          <span className="font-mono">
                            {selectedSetup.lsl?.toFixed(3) ?? "-"} {selectedSetup.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Target (목표값)</span>
                          <span className="font-mono">
                            {selectedSetup.target?.toFixed(3) ?? "-"} {selectedSetup.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">관리도 설정</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">관리도 유형</span>
                          <span>{selectedSetup.chartType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">서브그룹 크기</span>
                          <span>{selectedSetup.subgroupSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">생성일</span>
                          <span>{selectedSetup.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">상태</span>
                          <Badge variant={selectedSetup.isActive ? "success" : "error"}>
                            {selectedSetup.isActive ? "활성" : "비활성"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {limits && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">관리한계 (계산값)</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">X-bar UCL</span>
                            <span className="font-mono text-red-600">
                              {limits.xBarUcl.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">X-bar CL</span>
                            <span className="font-mono text-green-600">
                              {limits.xBarCl.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">X-bar LCL</span>
                            <span className="font-mono text-red-600">
                              {limits.xBarLcl.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Data Entry */}
        <TabsContent value="data">
          <div className="space-y-6">
            {selectedSetup && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      측정값 입력 (서브그룹 크기: {selectedSetup.subgroupSize})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="datetime">측정일시</Label>
                        <Input
                          id="datetime"
                          type="datetime-local"
                          value={newDateTime.replace(" ", "T")}
                          onChange={(e) =>
                            setNewDateTime(e.target.value.replace("T", " "))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        측정값 ({selectedSetup.subgroupSize}개 샘플) - 단위:{" "}
                        {selectedSetup.unit || "N/A"}
                      </Label>
                      <div
                        className="grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${Math.min(selectedSetup.subgroupSize, 5)}, 1fr)`,
                        }}
                      >
                        {Array.from({ length: selectedSetup.subgroupSize }).map((_, i) => (
                          <Input
                            key={i}
                            type="number"
                            step="0.001"
                            placeholder={`X${i + 1}`}
                            value={newMeasurements[i] || ""}
                            onChange={(e) => {
                              const updated = [...newMeasurements];
                              updated[i] = e.target.value;
                              setNewMeasurements(updated);
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {newMeasurements
                      .slice(0, selectedSetup.subgroupSize)
                      .every((m) => m !== "") && (
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-muted-foreground">X-bar (평균)</p>
                            <p className="font-mono text-lg font-semibold">
                              {calculateStats(
                                newMeasurements
                                  .slice(0, selectedSetup.subgroupSize)
                                  .map((m) => parseFloat(m))
                              ).xBar.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">R (범위)</p>
                            <p className="font-mono text-lg font-semibold">
                              {calculateStats(
                                newMeasurements
                                  .slice(0, selectedSetup.subgroupSize)
                                  .map((m) => parseFloat(m))
                              ).range.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">S (표준편차)</p>
                            <p className="font-mono text-lg font-semibold">
                              {calculateStats(
                                newMeasurements
                                  .slice(0, selectedSetup.subgroupSize)
                                  .map((m) => parseFloat(m))
                              ).stdDev.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button onClick={handleAddMeasurement} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      측정값 추가
                    </Button>
                  </CardContent>
                </Card>

                {/* Control limits display */}
                {limits && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">X-bar 관리한계</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>UCL</span>
                            <span className="font-mono text-red-600">
                              {limits.xBarUcl.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>CL</span>
                            <span className="font-mono text-green-600">
                              {limits.xBarCl.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>LCL</span>
                            <span className="font-mono text-red-600">
                              {limits.xBarLcl.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">R 관리한계</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>UCL</span>
                            <span className="font-mono text-red-600">
                              {limits.rUcl.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>CL</span>
                            <span className="font-mono text-green-600">
                              {limits.rCl.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>LCL</span>
                            <span className="font-mono text-red-600">
                              {limits.rLcl.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Data table */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      측정 데이터 ({filteredMeasurements.length}개 서브그룹)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredMeasurements.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        데이터가 없습니다. 측정값을 입력해주세요.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No.</TableHead>
                              <TableHead>측정일시</TableHead>
                              {Array.from({ length: selectedSetup.subgroupSize }).map(
                                (_, i) => (
                                  <TableHead key={i}>X{i + 1}</TableHead>
                                )
                              )}
                              <TableHead className="text-center">X-bar</TableHead>
                              <TableHead className="text-center">R</TableHead>
                              <TableHead className="text-center">상태</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMeasurements.map((m, index) => (
                              <TableRow
                                key={m.id}
                                className={m.status === "out" ? "bg-red-50" : ""}
                              >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{m.measurementDateTime}</TableCell>
                                {m.measurements.map((val, i) => (
                                  <TableCell key={i} className="font-mono">
                                    {val.toFixed(3)}
                                  </TableCell>
                                ))}
                                <TableCell className="font-mono text-center font-semibold">
                                  {m.xBar.toFixed(4)}
                                </TableCell>
                                <TableCell className="font-mono text-center font-semibold">
                                  {m.range.toFixed(4)}
                                </TableCell>
                                <TableCell className="text-center">
                                  {getStatusBadge(m.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteMeasurement(m.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Simple visual chart */}
                {limits && filteredMeasurements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>X-bar 관리도 (실시간)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-48 border rounded-lg p-4">
                        {/* UCL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                          style={{ top: "10%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-red-500">
                            UCL: {limits.xBarUcl.toFixed(3)}
                          </span>
                        </div>
                        {/* CL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-green-500"
                          style={{ top: "50%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-green-500">
                            CL: {limits.xBarCl.toFixed(3)}
                          </span>
                        </div>
                        {/* LCL Line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500"
                          style={{ top: "90%" }}
                        >
                          <span className="absolute right-2 -top-3 text-xs text-red-500">
                            LCL: {limits.xBarLcl.toFixed(3)}
                          </span>
                        </div>
                        {/* Data Points */}
                        <div className="absolute inset-0 flex items-center px-8">
                          {filteredMeasurements.map((m, i) => {
                            const range = limits.xBarUcl - limits.xBarLcl;
                            const normalizedPosition =
                              ((limits.xBarUcl - m.xBar) / range) * 80 + 10;
                            const clampedPosition = Math.max(
                              5,
                              Math.min(95, normalizedPosition)
                            );
                            const color =
                              m.status === "out"
                                ? "bg-red-500"
                                : m.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500";
                            return (
                              <div
                                key={m.id}
                                className="relative flex-1 flex justify-center"
                              >
                                <div
                                  className={`absolute w-3 h-3 rounded-full ${color}`}
                                  style={{ top: `${clampedPosition}%` }}
                                  title={`#${i + 1}: ${m.xBar.toFixed(4)}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!selectedSetup && (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    관리도를 선택해주세요.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Out-of-Control Analysis */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  관리 이탈 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOutOfControl.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    관리 이탈 기록이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>발생일시</TableHead>
                        <TableHead>이탈 유형</TableHead>
                        <TableHead>설명</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>조치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOutOfControl.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.detectedAt}</TableCell>
                          <TableCell>
                            <Badge variant="error">
                              {getViolationTypeLabel(record.violationType)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {record.description}
                          </TableCell>
                          <TableCell>{getOocStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {record.status !== "closed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingOocId(record.id);
                                  setEditCauseAnalysis(record.causeAnalysis);
                                  setEditCorrectiveAction(record.correctiveAction);
                                }}
                              >
                                분석/조치
                              </Button>
                            )}
                            {record.status === "closed" && (
                              <span className="text-sm text-muted-foreground">
                                완료: {record.closedAt}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {editingOocId && (
              <Card>
                <CardHeader>
                  <CardTitle>원인 분석 및 시정 조치</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="causeAnalysis">원인 분석</Label>
                    <Textarea
                      id="causeAnalysis"
                      placeholder="이탈 원인을 분석하여 입력하세요..."
                      value={editCauseAnalysis}
                      onChange={(e) => setEditCauseAnalysis(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correctiveAction">조치 내용</Label>
                    <Textarea
                      id="correctiveAction"
                      placeholder="시정 조치 내용을 입력하세요..."
                      value={editCorrectiveAction}
                      onChange={(e) => setEditCorrectiveAction(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveOocAnalysis(editingOocId)}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                    {editCorrectiveAction && (
                      <Button
                        variant="outline"
                        onClick={() => handleCloseOocRecord(editingOocId)}
                      >
                        조치 완료
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingOocId(null);
                        setEditCauseAnalysis("");
                        setEditCorrectiveAction("");
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">전체 이탈</p>
                  <p className="text-3xl font-bold">{filteredOutOfControl.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">미조치</p>
                  <p className="text-3xl font-bold text-red-600">
                    {filteredOutOfControl.filter((r) => r.status === "open").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">진행중</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {filteredOutOfControl.filter((r) => r.status === "in-progress").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">완료</p>
                  <p className="text-3xl font-bold text-green-600">
                    {filteredOutOfControl.filter((r) => r.status === "closed").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Violation type breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>이탈 유형별 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이탈 유형</TableHead>
                      <TableHead>설명</TableHead>
                      <TableHead className="text-center">발생 건수</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="error">규격 이탈</Badge>
                      </TableCell>
                      <TableCell>측정값이 USL 또는 LSL을 벗어남</TableCell>
                      <TableCell className="text-center">
                        {
                          filteredOutOfControl.filter((r) => r.violationType === "spec-out")
                            .length
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="error">UCL 초과</Badge>
                      </TableCell>
                      <TableCell>평균값이 상부 관리한계를 초과</TableCell>
                      <TableCell className="text-center">
                        {
                          filteredOutOfControl.filter((r) => r.violationType === "ucl-out")
                            .length
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="error">LCL 미만</Badge>
                      </TableCell>
                      <TableCell>평균값이 하부 관리한계 미만</TableCell>
                      <TableCell className="text-center">
                        {
                          filteredOutOfControl.filter((r) => r.violationType === "lcl-out")
                            .length
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="warning">런 (Run)</Badge>
                      </TableCell>
                      <TableCell>연속 7개 이상 점이 중심선 한쪽에 위치</TableCell>
                      <TableCell className="text-center">
                        {
                          filteredOutOfControl.filter((r) => r.violationType === "run")
                            .length
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="warning">트렌드 (Trend)</Badge>
                      </TableCell>
                      <TableCell>연속 7개 이상 점이 증가 또는 감소 추세</TableCell>
                      <TableCell className="text-center">
                        {
                          filteredOutOfControl.filter((r) => r.violationType === "trend")
                            .length
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge variant="warning">사이클 (Cycle)</Badge>
                      </TableCell>
                      <TableCell>주기적인 패턴이 반복됨</TableCell>
                      <TableCell className="text-center">
                        {
                          filteredOutOfControl.filter((r) => r.violationType === "cycle")
                            .length
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Control Chart History */}
        <TabsContent value="history">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    관리도 이력
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">필터:</Label>
                    <Select value={historyFilter} onValueChange={setHistoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="created">생성</SelectItem>
                        <SelectItem value="modified">수정</SelectItem>
                        <SelectItem value="recalculated">재계산</SelectItem>
                        <SelectItem value="out-of-control">관리 이탈</SelectItem>
                        <SelectItem value="corrective-action">시정조치</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    이력이 없습니다.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>일시</TableHead>
                        <TableHead>구분</TableHead>
                        <TableHead>내용</TableHead>
                        <TableHead>사용자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell>{h.timestamp}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                h.action === "out-of-control"
                                  ? "error"
                                  : h.action === "corrective-action"
                                  ? "success"
                                  : "default"
                              }
                            >
                              {getHistoryActionLabel(h.action)}
                            </Badge>
                          </TableCell>
                          <TableCell>{h.description}</TableCell>
                          <TableCell>{h.userId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Timeline view */}
            <Card>
              <CardHeader>
                <CardTitle>타임라인</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHistory.map((h, index) => (
                    <div key={h.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            h.action === "out-of-control"
                              ? "bg-red-500"
                              : h.action === "corrective-action"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        />
                        {index < filteredHistory.length - 1 && (
                          <div className="w-px h-full bg-border flex-1 min-h-[40px]" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {getHistoryActionLabel(h.action)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {h.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{h.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          담당: {h.userId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export options */}
            <Card>
              <CardHeader>
                <CardTitle>이력 내보내기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Excel 내보내기
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF 내보내기
                  </Button>
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    상세 검색
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
