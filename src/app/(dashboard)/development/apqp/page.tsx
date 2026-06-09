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
import { Plus, Save, FileText, Calendar, CheckSquare, History, LayoutDashboard } from "lucide-react";

// ==================== Types ====================
interface ProjectHeader {
  projectNo: string;
  productName: string;
  customerName: string;
  vehicleType: string;
  devSchedule: string;
}

interface DeliverableItem {
  id: string;
  phase: number;
  name: string;
  isCompleted: boolean;
  completedDate: string;
  responsible: string;
  remarks: string;
}

interface MilestoneItem {
  id: string;
  phase: number;
  milestoneName: string;
  plannedDate: string;
  actualDate: string;
  status: "planned" | "inProgress" | "completed" | "delayed";
}

interface HistoryItem {
  id: string;
  date: string;
  action: string;
  description: string;
  user: string;
}

// ==================== Phase Data ====================
const phaseData = [
  {
    phase: 1,
    name: "계획 및 정의",
    deliverables: ["고객요구사항", "품질/신뢰성 목표", "BOM 초안", "공정흐름도 초안"],
  },
  {
    phase: 2,
    name: "제품설계",
    deliverables: ["설계FMEA", "DV 시험계획", "도면/사양서"],
  },
  {
    phase: 3,
    name: "공정설계",
    deliverables: ["공정FMEA", "관리계획서", "작업표준서", "포장사양서"],
  },
  {
    phase: 4,
    name: "제품/공정 검증",
    deliverables: ["시작품 검사", "MSA, SPC", "PV 시험"],
  },
  {
    phase: 5,
    name: "양산이행",
    deliverables: ["PPAP 제출", "양산승인", "교훈정리"],
  },
];

// ==================== Initial Data ====================
const getInitialDeliverables = (): DeliverableItem[] => {
  const items: DeliverableItem[] = [];
  let idx = 0;
  phaseData.forEach((p) => {
    p.deliverables.forEach((d) => {
      items.push({
        id: `del-${idx++}`,
        phase: p.phase,
        name: d,
        isCompleted: false,
        completedDate: "",
        responsible: "",
        remarks: "",
      });
    });
  });
  return items;
};

const getInitialMilestones = (): MilestoneItem[] => {
  return phaseData.map((p, idx) => ({
    id: `ms-${idx}`,
    phase: p.phase,
    milestoneName: `Phase ${p.phase}: ${p.name} 완료`,
    plannedDate: "",
    actualDate: "",
    status: "planned" as const,
  }));
};

// ==================== Main Component ====================
export default function APQPPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Header State
  const [header, setHeader] = useState<ProjectHeader>({
    projectNo: "",
    productName: "",
    customerName: "",
    vehicleType: "",
    devSchedule: "",
  });

  // Deliverables State
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(getInitialDeliverables());

  // Milestones State
  const [milestones, setMilestones] = useState<MilestoneItem[]>(getInitialMilestones());

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [newHistoryDescription, setNewHistoryDescription] = useState("");

  // ==================== Status Helpers ====================
  const statusLabels: Record<string, string> = {
    planned: "계획",
    inProgress: "진행중",
    completed: "완료",
    delayed: "지연",
  };

  const statusVariants: Record<string, "default" | "warning" | "success" | "destructive"> = {
    planned: "default",
    inProgress: "warning",
    completed: "success",
    delayed: "destructive",
  };

  const phaseColors: Record<number, string> = {
    1: "bg-blue-500",
    2: "bg-green-500",
    3: "bg-yellow-500",
    4: "bg-purple-500",
    5: "bg-red-500",
  };

  // ==================== Handlers ====================
  const handleHeaderChange = (field: keyof ProjectHeader, value: string) => {
    setHeader({ ...header, [field]: value });
  };

  const handleDeliverableToggle = (id: string) => {
    setDeliverables(
      deliverables.map((d) =>
        d.id === id
          ? {
              ...d,
              isCompleted: !d.isCompleted,
              completedDate: !d.isCompleted ? new Date().toISOString().split("T")[0] : "",
            }
          : d
      )
    );
  };

  const handleDeliverableChange = (id: string, field: keyof DeliverableItem, value: string) => {
    setDeliverables(deliverables.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const handleMilestoneChange = (id: string, field: keyof MilestoneItem, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const addHistoryEntry = () => {
    if (!newHistoryDescription.trim()) return;
    const newEntry: HistoryItem = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      action: "기록 추가",
      description: newHistoryDescription,
      user: "현재 사용자",
    };
    setHistory([newEntry, ...history]);
    setNewHistoryDescription("");
  };

  const handleSave = () => {
    alert("APQP 프로젝트 정보가 저장되었습니다.");
    const saveEntry: HistoryItem = {
      id: `hist-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      action: "저장",
      description: "프로젝트 정보 저장",
      user: "현재 사용자",
    };
    setHistory([saveEntry, ...history]);
  };

  // ==================== Computed Values ====================
  const getPhaseProgress = (phase: number) => {
    const phaseItems = deliverables.filter((d) => d.phase === phase);
    const completed = phaseItems.filter((d) => d.isCompleted).length;
    return phaseItems.length > 0 ? Math.round((completed / phaseItems.length) * 100) : 0;
  };

  const totalProgress = () => {
    const completed = deliverables.filter((d) => d.isCompleted).length;
    return deliverables.length > 0 ? Math.round((completed / deliverables.length) * 100) : 0;
  };

  // ==================== Render ====================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">APQP 관리</h1>
          <p className="text-muted-foreground">Advanced Product Quality Planning</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Project Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>프로젝트번호 *</Label>
              <Input
                value={header.projectNo}
                onChange={(e) => handleHeaderChange("projectNo", e.target.value)}
                placeholder="PRJ-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label>제품명 *</Label>
              <Input
                value={header.productName}
                onChange={(e) => handleHeaderChange("productName", e.target.value)}
                placeholder="제품명 입력"
              />
            </div>
            <div className="space-y-2">
              <Label>고객명 *</Label>
              <Input
                value={header.customerName}
                onChange={(e) => handleHeaderChange("customerName", e.target.value)}
                placeholder="고객사명"
              />
            </div>
            <div className="space-y-2">
              <Label>차종 *</Label>
              <Input
                value={header.vehicleType}
                onChange={(e) => handleHeaderChange("vehicleType", e.target.value)}
                placeholder="차종명"
              />
            </div>
            <div className="space-y-2">
              <Label>개발일정</Label>
              <Input
                type="date"
                value={header.devSchedule}
                onChange={(e) => handleHeaderChange("devSchedule", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            프로젝트 개요
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <CheckSquare className="mr-2 h-4 w-4" />
            산출물 체크리스트
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            일정 관리
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            프로젝트 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                프로젝트 개요 및 타임라인
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">전체 진행률</span>
                  <span>{totalProgress()}%</span>
                </div>
                <div className="h-4 w-full rounded-full bg-muted">
                  <div
                    className="h-4 rounded-full bg-primary transition-all"
                    style={{ width: `${totalProgress()}%` }}
                  />
                </div>
              </div>

              {/* Phase Timeline (Gantt-like) */}
              <div className="space-y-4">
                <h3 className="font-semibold">APQP 단계별 현황</h3>
                <div className="space-y-3">
                  {phaseData.map((phase) => {
                    const progress = getPhaseProgress(phase.phase);
                    const milestone = milestones.find((m) => m.phase === phase.phase);
                    return (
                      <div key={phase.phase} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${phaseColors[phase.phase]}`} />
                            <span className="font-medium">
                              Phase {phase.phase}: {phase.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {milestone?.plannedDate || "일정 미설정"}
                            </span>
                            <Badge variant={milestone ? statusVariants[milestone.status] : "default"}>
                              {milestone ? statusLabels[milestone.status] : "계획"}
                            </Badge>
                            <span className="text-sm font-medium">{progress}%</span>
                          </div>
                        </div>
                        <div className="ml-5 h-2 w-full rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full transition-all ${phaseColors[phase.phase]}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="ml-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {phase.deliverables.map((d, idx) => {
                            const item = deliverables.find(
                              (del) => del.phase === phase.phase && del.name === d
                            );
                            return (
                              <span
                                key={idx}
                                className={item?.isCompleted ? "line-through text-green-600" : ""}
                              >
                                {d}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-5">
                {phaseData.map((phase) => {
                  const progress = getPhaseProgress(phase.phase);
                  const phaseItems = deliverables.filter((d) => d.phase === phase.phase);
                  const completedCount = phaseItems.filter((d) => d.isCompleted).length;
                  return (
                    <Card key={phase.phase} className="border-t-4" style={{ borderTopColor: phaseColors[phase.phase].replace("bg-", "") }}>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white ${phaseColors[phase.phase]}`}>
                            {phase.phase}
                          </div>
                          <p className="mt-2 text-sm font-medium">{phase.name}</p>
                          <p className="text-2xl font-bold">{progress}%</p>
                          <p className="text-xs text-muted-foreground">
                            {completedCount}/{phaseItems.length} 완료
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Checklist */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                산출물 체크리스트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {phaseData.map((phase) => (
                  <div key={phase.phase} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded ${phaseColors[phase.phase]}`} />
                      <h3 className="font-semibold">
                        Phase {phase.phase}: {phase.name}
                      </h3>
                      <Badge variant="outline">{getPhaseProgress(phase.phase)}%</Badge>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">완료</TableHead>
                          <TableHead>산출물</TableHead>
                          <TableHead>완료일</TableHead>
                          <TableHead>담당자</TableHead>
                          <TableHead>비고</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliverables
                          .filter((d) => d.phase === phase.phase)
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <button
                                  type="button"
                                  onClick={() => handleDeliverableToggle(item.id)}
                                  className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    item.isCompleted
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  {item.isCompleted && (
                                    <svg
                                      className="h-3 w-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className={item.isCompleted ? "line-through text-muted-foreground" : ""}>
                                {item.name}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="date"
                                  value={item.completedDate}
                                  onChange={(e) =>
                                    handleDeliverableChange(item.id, "completedDate", e.target.value)
                                  }
                                  className="w-36"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.responsible}
                                  onChange={(e) =>
                                    handleDeliverableChange(item.id, "responsible", e.target.value)
                                  }
                                  placeholder="담당자"
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.remarks}
                                  onChange={(e) =>
                                    handleDeliverableChange(item.id, "remarks", e.target.value)
                                  }
                                  placeholder="비고"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Schedule */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                일정 관리 (마일스톤)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phase</TableHead>
                    <TableHead>마일스톤</TableHead>
                    <TableHead>계획일</TableHead>
                    <TableHead>실적일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>진행률</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestones.map((milestone) => {
                    const phase = phaseData.find((p) => p.phase === milestone.phase);
                    const progress = getPhaseProgress(milestone.phase);
                    return (
                      <TableRow key={milestone.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${phaseColors[milestone.phase]}`} />
                            <span>Phase {milestone.phase}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{phase?.name}</TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={milestone.plannedDate}
                            onChange={(e) =>
                              handleMilestoneChange(milestone.id, "plannedDate", e.target.value)
                            }
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={milestone.actualDate}
                            onChange={(e) =>
                              handleMilestoneChange(milestone.id, "actualDate", e.target.value)
                            }
                            className="w-40"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={milestone.status}
                            onValueChange={(v) =>
                              handleMilestoneChange(milestone.id, "status", v)
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">계획</SelectItem>
                              <SelectItem value="inProgress">진행중</SelectItem>
                              <SelectItem value="completed">완료</SelectItem>
                              <SelectItem value="delayed">지연</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted">
                              <div
                                className={`h-2 rounded-full ${phaseColors[milestone.phase]}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{progress}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Gantt-like Visual */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold">타임라인 뷰</h3>
                <div className="relative overflow-x-auto rounded-lg border p-4">
                  <div className="min-w-[600px] space-y-3">
                    {milestones.map((milestone) => {
                      const phase = phaseData.find((p) => p.phase === milestone.phase);
                      return (
                        <div key={milestone.id} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium">Phase {milestone.phase}</div>
                          <div className="relative flex-1 h-8 rounded bg-muted">
                            <div
                              className={`absolute left-0 top-0 h-full rounded ${phaseColors[milestone.phase]} opacity-80`}
                              style={{ width: `${getPhaseProgress(milestone.phase)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                              {phase?.name}
                            </div>
                          </div>
                          <div className="w-24 text-right text-sm">
                            <Badge variant={statusVariants[milestone.status]}>
                              {statusLabels[milestone.status]}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
                프로젝트 이력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add History Entry */}
              <div className="flex gap-4">
                <Textarea
                  value={newHistoryDescription}
                  onChange={(e) => setNewHistoryDescription(e.target.value)}
                  placeholder="이력 내용을 입력하세요..."
                  className="flex-1"
                  rows={2}
                />
                <Button onClick={addHistoryEntry} className="self-end">
                  <Plus className="mr-2 h-4 w-4" />
                  추가
                </Button>
              </div>

              {/* History List */}
              {history.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  등록된 프로젝트 이력이 없습니다.
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.action}</span>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">작성자: {item.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
