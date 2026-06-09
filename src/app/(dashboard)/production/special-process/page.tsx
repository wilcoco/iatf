"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// Process types
type ProcessType = "painting" | "heat-treatment" | "welding" | "plating";

// Header info
interface HeaderInfo {
  recordNo: string;
  processType: ProcessType | "";
  workDate: string;
  worker: string;
}

// Process conditions by type
interface PaintingConditions {
  temperature: string;
  humidity: string;
  paintViscosity: string;
  filmThickness: string;
}

interface HeatTreatmentConditions {
  temperature: string;
  time: string;
  atmosphere: string;
}

interface WeldingConditions {
  current: string;
  voltage: string;
  speed: string;
  gasFlowRate: string;
}

interface PlatingConditions {
  temperature: string;
  time: string;
  currentDensity: string;
  ph: string;
}

type ProcessConditions =
  | PaintingConditions
  | HeatTreatmentConditions
  | WeldingConditions
  | PlatingConditions;

// Parameter record
interface ParameterRecord {
  id: number;
  parameterName: string;
  setpoint: string;
  actualValue: string;
  allowableRange: string;
  judgment: "pass" | "fail" | "pending";
}

// Abnormality record
interface AbnormalityRecord {
  id: number;
  occurrenceTime: string;
  abnormalityDescription: string;
  action: string;
  handler: string;
  result: string;
  status: "resolved" | "in-progress" | "pending";
}

// History record
interface HistoryRecord {
  id: number;
  recordNo: string;
  processType: ProcessType;
  workDate: string;
  worker: string;
  result: "pass" | "fail";
  notes: string;
}

// Default conditions by process type
const getDefaultConditions = (type: ProcessType): ProcessConditions => {
  switch (type) {
    case "painting":
      return { temperature: "", humidity: "", paintViscosity: "", filmThickness: "" };
    case "heat-treatment":
      return { temperature: "", time: "", atmosphere: "" };
    case "welding":
      return { current: "", voltage: "", speed: "", gasFlowRate: "" };
    case "plating":
      return { temperature: "", time: "", currentDensity: "", ph: "" };
  }
};

const processTypeLabels: Record<ProcessType, string> = {
  painting: "도장",
  "heat-treatment": "열처리",
  welding: "용접",
  plating: "도금",
};

export default function SpecialProcessPage() {
  const [activeTab, setActiveTab] = useState("process-conditions");

  // Header info state
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    recordNo: "",
    processType: "",
    workDate: "",
    worker: "",
  });

  // Process conditions state
  const [conditions, setConditions] = useState<ProcessConditions | null>(null);

  // Parameter records state
  const [parameterRecords, setParameterRecords] = useState<ParameterRecord[]>([
    {
      id: 1,
      parameterName: "",
      setpoint: "",
      actualValue: "",
      allowableRange: "",
      judgment: "pending",
    },
  ]);

  // Abnormality records state
  const [abnormalityRecords, setAbnormalityRecords] = useState<AbnormalityRecord[]>([]);
  const [newAbnormality, setNewAbnormality] = useState<Omit<AbnormalityRecord, "id">>({
    occurrenceTime: "",
    abnormalityDescription: "",
    action: "",
    handler: "",
    result: "",
    status: "pending",
  });

  // History records state (mock data)
  const [historyRecords] = useState<HistoryRecord[]>([
    {
      id: 1,
      recordNo: "SP-2026-001",
      processType: "painting",
      workDate: "2026-06-01",
      worker: "김철수",
      result: "pass",
      notes: "정상 완료",
    },
    {
      id: 2,
      recordNo: "SP-2026-002",
      processType: "welding",
      workDate: "2026-06-03",
      worker: "이영희",
      result: "pass",
      notes: "정상 완료",
    },
    {
      id: 3,
      recordNo: "SP-2026-003",
      processType: "heat-treatment",
      workDate: "2026-06-05",
      worker: "박민수",
      result: "fail",
      notes: "온도 이탈로 재작업 필요",
    },
  ]);

  // Handle process type change
  const handleProcessTypeChange = (type: ProcessType) => {
    setHeaderInfo({ ...headerInfo, processType: type });
    setConditions(getDefaultConditions(type));
  };

  // Parameter record handlers
  const addParameterRecord = () => {
    setParameterRecords([
      ...parameterRecords,
      {
        id: Date.now(),
        parameterName: "",
        setpoint: "",
        actualValue: "",
        allowableRange: "",
        judgment: "pending",
      },
    ]);
  };

  const removeParameterRecord = (id: number) => {
    if (parameterRecords.length <= 1) return;
    setParameterRecords(parameterRecords.filter((item) => item.id !== id));
  };

  const updateParameterRecord = (
    id: number,
    field: keyof ParameterRecord,
    value: string
  ) => {
    setParameterRecords(
      parameterRecords.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Abnormality handlers
  const addAbnormalityRecord = () => {
    if (!newAbnormality.occurrenceTime || !newAbnormality.abnormalityDescription) {
      alert("발생시간과 이상내용은 필수 입력 항목입니다.");
      return;
    }
    setAbnormalityRecords([
      { id: Date.now(), ...newAbnormality },
      ...abnormalityRecords,
    ]);
    setNewAbnormality({
      occurrenceTime: "",
      abnormalityDescription: "",
      action: "",
      handler: "",
      result: "",
      status: "pending",
    });
  };

  const removeAbnormalityRecord = (id: number) => {
    setAbnormalityRecords(abnormalityRecords.filter((item) => item.id !== id));
  };

  const updateAbnormalityStatus = (
    id: number,
    status: "resolved" | "in-progress" | "pending"
  ) => {
    setAbnormalityRecords(
      abnormalityRecords.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  // Save handler
  const handleSaveAll = () => {
    if (!headerInfo.recordNo || !headerInfo.processType || !headerInfo.workDate) {
      alert("기록번호, 공정유형, 작업일은 필수 입력 항목입니다.");
      setActiveTab("process-conditions");
      return;
    }
    console.log("Saving special process record:", {
      headerInfo,
      conditions,
      parameterRecords,
      abnormalityRecords,
    });
    alert("특수공정 관리기록이 저장되었습니다.");
  };

  // Render condition fields based on process type
  const renderConditionFields = () => {
    if (!headerInfo.processType || !conditions) {
      return (
        <p className="text-muted-foreground py-8 text-center">
          공정유형을 먼저 선택해주세요.
        </p>
      );
    }

    switch (headerInfo.processType) {
      case "painting":
        const paintingCond = conditions as PaintingConditions;
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="temperature">온도 (C)</Label>
              <Input
                id="temperature"
                value={paintingCond.temperature}
                onChange={(e) =>
                  setConditions({ ...paintingCond, temperature: e.target.value })
                }
                placeholder="예: 20-25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="humidity">습도 (%)</Label>
              <Input
                id="humidity"
                value={paintingCond.humidity}
                onChange={(e) =>
                  setConditions({ ...paintingCond, humidity: e.target.value })
                }
                placeholder="예: 50-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paintViscosity">도료점도 (sec)</Label>
              <Input
                id="paintViscosity"
                value={paintingCond.paintViscosity}
                onChange={(e) =>
                  setConditions({ ...paintingCond, paintViscosity: e.target.value })
                }
                placeholder="예: 18-22"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filmThickness">도막두께 (um)</Label>
              <Input
                id="filmThickness"
                value={paintingCond.filmThickness}
                onChange={(e) =>
                  setConditions({ ...paintingCond, filmThickness: e.target.value })
                }
                placeholder="예: 25-35"
              />
            </div>
          </div>
        );

      case "heat-treatment":
        const heatCond = conditions as HeatTreatmentConditions;
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="heatTemperature">온도 (C)</Label>
              <Input
                id="heatTemperature"
                value={heatCond.temperature}
                onChange={(e) =>
                  setConditions({ ...heatCond, temperature: e.target.value })
                }
                placeholder="예: 850-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heatTime">시간 (min)</Label>
              <Input
                id="heatTime"
                value={heatCond.time}
                onChange={(e) =>
                  setConditions({ ...heatCond, time: e.target.value })
                }
                placeholder="예: 60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="atmosphere">분위기</Label>
              <Input
                id="atmosphere"
                value={heatCond.atmosphere}
                onChange={(e) =>
                  setConditions({ ...heatCond, atmosphere: e.target.value })
                }
                placeholder="예: N2, Ar"
              />
            </div>
          </div>
        );

      case "welding":
        const weldCond = conditions as WeldingConditions;
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current">전류 (A)</Label>
              <Input
                id="current"
                value={weldCond.current}
                onChange={(e) =>
                  setConditions({ ...weldCond, current: e.target.value })
                }
                placeholder="예: 180-220"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voltage">전압 (V)</Label>
              <Input
                id="voltage"
                value={weldCond.voltage}
                onChange={(e) =>
                  setConditions({ ...weldCond, voltage: e.target.value })
                }
                placeholder="예: 22-26"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">속도 (cm/min)</Label>
              <Input
                id="speed"
                value={weldCond.speed}
                onChange={(e) =>
                  setConditions({ ...weldCond, speed: e.target.value })
                }
                placeholder="예: 30-40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gasFlowRate">가스유량 (L/min)</Label>
              <Input
                id="gasFlowRate"
                value={weldCond.gasFlowRate}
                onChange={(e) =>
                  setConditions({ ...weldCond, gasFlowRate: e.target.value })
                }
                placeholder="예: 15-20"
              />
            </div>
          </div>
        );

      case "plating":
        const plateCond = conditions as PlatingConditions;
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plateTemperature">온도 (C)</Label>
              <Input
                id="plateTemperature"
                value={plateCond.temperature}
                onChange={(e) =>
                  setConditions({ ...plateCond, temperature: e.target.value })
                }
                placeholder="예: 45-55"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plateTime">시간 (min)</Label>
              <Input
                id="plateTime"
                value={plateCond.time}
                onChange={(e) =>
                  setConditions({ ...plateCond, time: e.target.value })
                }
                placeholder="예: 20-30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentDensity">전류밀도 (A/dm2)</Label>
              <Input
                id="currentDensity"
                value={plateCond.currentDensity}
                onChange={(e) =>
                  setConditions({ ...plateCond, currentDensity: e.target.value })
                }
                placeholder="예: 2-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ph">pH</Label>
              <Input
                id="ph"
                value={plateCond.ph}
                onChange={(e) =>
                  setConditions({ ...plateCond, ph: e.target.value })
                }
                placeholder="예: 4.0-5.0"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getJudgmentBadge = (judgment: "pass" | "fail" | "pending") => {
    switch (judgment) {
      case "pass":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            합격
          </Badge>
        );
      case "fail":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            불합격
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            대기
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: "resolved" | "in-progress" | "pending") => {
    switch (status) {
      case "resolved":
        return <Badge variant="success">조치완료</Badge>;
      case "in-progress":
        return <Badge variant="warning">조치중</Badge>;
      default:
        return <Badge variant="secondary">대기</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">특수공정 관리 (Special Process Control)</h1>
          <p className="text-muted-foreground">
            용접, 열처리, 도장, 도금 공정 관리기록
          </p>
        </div>
        <Button onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" />
          전체 저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="process-conditions">공정 선택 및 조건</TabsTrigger>
          <TabsTrigger value="parameter-records">파라미터 기록</TabsTrigger>
          <TabsTrigger value="abnormality">이상 조치</TabsTrigger>
          <TabsTrigger value="history">기록 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: 공정 선택 및 조건 */}
        <TabsContent value="process-conditions">
          <div className="space-y-6">
            {/* Header Info */}
            <Card>
              <CardHeader>
                <CardTitle>기본정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="recordNo">기록번호 *</Label>
                    <Input
                      id="recordNo"
                      value={headerInfo.recordNo}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, recordNo: e.target.value })
                      }
                      placeholder="SP-2026-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="processType">공정유형 *</Label>
                    <Select
                      value={headerInfo.processType}
                      onValueChange={(v) => handleProcessTypeChange(v as ProcessType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="공정 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="painting">도장</SelectItem>
                        <SelectItem value="heat-treatment">열처리</SelectItem>
                        <SelectItem value="welding">용접</SelectItem>
                        <SelectItem value="plating">도금</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workDate">작업일 *</Label>
                    <Input
                      id="workDate"
                      type="date"
                      value={headerInfo.workDate}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, workDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker">작업자</Label>
                    <Input
                      id="worker"
                      value={headerInfo.worker}
                      onChange={(e) =>
                        setHeaderInfo({ ...headerInfo, worker: e.target.value })
                      }
                      placeholder="작업자명"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  공정조건
                  {headerInfo.processType && (
                    <Badge variant="outline" className="ml-2">
                      {processTypeLabels[headerInfo.processType]}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>{renderConditionFields()}</CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 파라미터 기록 */}
        <TabsContent value="parameter-records">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>공정 파라미터 기록</span>
                <Button onClick={addParameterRecord} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">파라미터명</TableHead>
                      <TableHead className="min-w-[120px]">설정값</TableHead>
                      <TableHead className="min-w-[120px]">실측값</TableHead>
                      <TableHead className="min-w-[150px]">허용범위</TableHead>
                      <TableHead className="min-w-[100px]">판정</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameterRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Input
                            value={record.parameterName}
                            onChange={(e) =>
                              updateParameterRecord(
                                record.id,
                                "parameterName",
                                e.target.value
                              )
                            }
                            placeholder="파라미터명"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={record.setpoint}
                            onChange={(e) =>
                              updateParameterRecord(record.id, "setpoint", e.target.value)
                            }
                            placeholder="설정값"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={record.actualValue}
                            onChange={(e) =>
                              updateParameterRecord(
                                record.id,
                                "actualValue",
                                e.target.value
                              )
                            }
                            placeholder="실측값"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={record.allowableRange}
                            onChange={(e) =>
                              updateParameterRecord(
                                record.id,
                                "allowableRange",
                                e.target.value
                              )
                            }
                            placeholder="예: 20-25"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={record.judgment}
                            onValueChange={(v) =>
                              updateParameterRecord(record.id, "judgment", v)
                            }
                          >
                            <SelectTrigger className="min-w-[90px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                {getJudgmentBadge("pending")}
                              </SelectItem>
                              <SelectItem value="pass">
                                {getJudgmentBadge("pass")}
                              </SelectItem>
                              <SelectItem value="fail">
                                {getJudgmentBadge("fail")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeParameterRecord(record.id)}
                            disabled={parameterRecords.length <= 1}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {getJudgmentBadge("pass")} 규격 이내
                </span>
                <span className="flex items-center gap-1">
                  {getJudgmentBadge("fail")} 규격 이탈
                </span>
                <span className="flex items-center gap-1">
                  {getJudgmentBadge("pending")} 판정 대기
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 이상 조치 */}
        <TabsContent value="abnormality">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                이상발생시 조치기록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new abnormality form */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>발생시간 *</Label>
                      <Input
                        type="datetime-local"
                        value={newAbnormality.occurrenceTime}
                        onChange={(e) =>
                          setNewAbnormality({
                            ...newAbnormality,
                            occurrenceTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Input
                        value={newAbnormality.handler}
                        onChange={(e) =>
                          setNewAbnormality({
                            ...newAbnormality,
                            handler: e.target.value,
                          })
                        }
                        placeholder="담당자명"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>이상내용 *</Label>
                      <Textarea
                        value={newAbnormality.abnormalityDescription}
                        onChange={(e) =>
                          setNewAbnormality({
                            ...newAbnormality,
                            abnormalityDescription: e.target.value,
                          })
                        }
                        placeholder="발생한 이상 상황을 상세히 기술하세요"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>조치내용</Label>
                      <Textarea
                        value={newAbnormality.action}
                        onChange={(e) =>
                          setNewAbnormality({
                            ...newAbnormality,
                            action: e.target.value,
                          })
                        }
                        placeholder="취해진 조치 내용"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>조치결과</Label>
                      <Input
                        value={newAbnormality.result}
                        onChange={(e) =>
                          setNewAbnormality({
                            ...newAbnormality,
                            result: e.target.value,
                          })
                        }
                        placeholder="조치 후 결과"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <div className="flex gap-2">
                        <Select
                          value={newAbnormality.status}
                          onValueChange={(v) =>
                            setNewAbnormality({
                              ...newAbnormality,
                              status: v as "resolved" | "in-progress" | "pending",
                            })
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">대기</SelectItem>
                            <SelectItem value="in-progress">조치중</SelectItem>
                            <SelectItem value="resolved">조치완료</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={addAbnormalityRecord}>
                          <Plus className="h-4 w-4 mr-2" />
                          등록
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Abnormality records table */}
              {abnormalityRecords.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  등록된 이상 조치 기록이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>발생시간</TableHead>
                      <TableHead>이상내용</TableHead>
                      <TableHead>조치내용</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>결과</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abnormalityRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-sm">
                          {record.occurrenceTime.replace("T", " ")}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.abnormalityDescription}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {record.action || "-"}
                        </TableCell>
                        <TableCell>{record.handler || "-"}</TableCell>
                        <TableCell>{record.result || "-"}</TableCell>
                        <TableCell>
                          <Select
                            value={record.status}
                            onValueChange={(v) =>
                              updateAbnormalityStatus(
                                record.id,
                                v as "resolved" | "in-progress" | "pending"
                              )
                            }
                          >
                            <SelectTrigger className="min-w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                {getStatusBadge("pending")}
                              </SelectItem>
                              <SelectItem value="in-progress">
                                {getStatusBadge("in-progress")}
                              </SelectItem>
                              <SelectItem value="resolved">
                                {getStatusBadge("resolved")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeAbnormalityRecord(record.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 기록 이력 */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>특수공정 기록 이력</CardTitle>
            </CardHeader>
            <CardContent>
              {historyRecords.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  기록된 이력이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>기록번호</TableHead>
                      <TableHead>공정유형</TableHead>
                      <TableHead>작업일</TableHead>
                      <TableHead>작업자</TableHead>
                      <TableHead>결과</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.recordNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {processTypeLabels[record.processType]}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.workDate}</TableCell>
                        <TableCell>{record.worker}</TableCell>
                        <TableCell>
                          {record.result === "pass" ? (
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
                        <TableCell>{record.notes}</TableCell>
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
