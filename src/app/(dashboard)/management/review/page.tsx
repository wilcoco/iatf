"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  ClipboardCheck,
  FileInput,
  FileOutput,
  History,
  Save,
  Trash2,
  Users,
  Calendar,
} from "lucide-react";

// Types
interface Attendee {
  id: number;
  name: string;
  position: string;
  department: string;
}

interface ReviewAgenda {
  id: number;
  title: string;
  description: string;
}

interface ReviewPlan {
  reviewNumber: string;
  reviewDate: string;
  reviewSession: number;
  attendees: Attendee[];
  agenda: ReviewAgenda[];
}

interface ReviewInputItems {
  previousActionsStatus: string;
  qualityObjectiveAchievement: string;
  processPerformance: string;
  customerFeedback: string;
  customerComplaints: string;
  nonconformityActions: string;
  auditResults: string;
  resourceAdequacy: string;
  riskOpportunity: string;
}

interface ReviewOutputItems {
  improvementOpportunities: string;
  qmsChangeRequirements: string;
  resourceRequirements: string;
  qualityObjectiveAdjustments: string;
  decisions: string;
  actionItems: ActionItem[];
}

interface ActionItem {
  id: number;
  action: string;
  responsible: string;
  department: string;
  deadline: string;
  status: string;
}

interface ReviewHistory {
  id: number;
  reviewNumber: string;
  reviewSession: number;
  reviewDate: string;
  status: string;
  completedDate: string;
  modifiedBy: string;
}

// Initial data
const initialReviewPlan: ReviewPlan = {
  reviewNumber: "MR-2026-002",
  reviewDate: "2026-06-10",
  reviewSession: 2,
  attendees: [
    { id: 1, name: "홍길동", position: "대표이사", department: "경영진" },
    { id: 2, name: "김철수", position: "관리책임자", department: "품질관리팀" },
  ],
  agenda: [
    { id: 1, title: "품질목표 달성현황 검토", description: "2026년 상반기 품질목표 달성률 분석" },
  ],
};

const initialInputItems: ReviewInputItems = {
  previousActionsStatus: "",
  qualityObjectiveAchievement: "",
  processPerformance: "",
  customerFeedback: "",
  customerComplaints: "",
  nonconformityActions: "",
  auditResults: "",
  resourceAdequacy: "",
  riskOpportunity: "",
};

const initialOutputItems: ReviewOutputItems = {
  improvementOpportunities: "",
  qmsChangeRequirements: "",
  resourceRequirements: "",
  qualityObjectiveAdjustments: "",
  decisions: "",
  actionItems: [],
};

const initialHistory: ReviewHistory[] = [
  {
    id: 1,
    reviewNumber: "MR-2026-001",
    reviewSession: 1,
    reviewDate: "2026-03-15",
    status: "완료",
    completedDate: "2026-03-16",
    modifiedBy: "품질관리팀",
  },
  {
    id: 2,
    reviewNumber: "MR-2025-004",
    reviewSession: 4,
    reviewDate: "2025-12-15",
    status: "완료",
    completedDate: "2025-12-16",
    modifiedBy: "품질관리팀",
  },
  {
    id: 3,
    reviewNumber: "MR-2025-003",
    reviewSession: 3,
    reviewDate: "2025-09-15",
    status: "완료",
    completedDate: "2025-09-16",
    modifiedBy: "품질관리팀",
  },
  {
    id: 4,
    reviewNumber: "MR-2025-002",
    reviewSession: 2,
    reviewDate: "2025-06-15",
    status: "완료",
    completedDate: "2025-06-16",
    modifiedBy: "품질관리팀",
  },
  {
    id: 5,
    reviewNumber: "MR-2025-001",
    reviewSession: 1,
    reviewDate: "2025-03-15",
    status: "완료",
    completedDate: "2025-03-16",
    modifiedBy: "품질관리팀",
  },
];

const departmentOptions = [
  "경영진",
  "품질관리팀",
  "생산팀",
  "기술팀",
  "영업팀",
  "구매팀",
  "인사팀",
  "경영지원팀",
];

const positionOptions = [
  "대표이사",
  "관리책임자",
  "부서장",
  "팀장",
  "담당자",
];

const statusOptions = ["작성중", "검토중", "승인완료", "완료"];

export default function ManagementReviewPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [reviewPlan, setReviewPlan] = useState<ReviewPlan>(initialReviewPlan);
  const [inputItems, setInputItems] = useState<ReviewInputItems>(initialInputItems);
  const [outputItems, setOutputItems] = useState<ReviewOutputItems>(initialOutputItems);
  const [history] = useState<ReviewHistory[]>(initialHistory);

  // New attendee form state
  const [newAttendee, setNewAttendee] = useState({
    name: "",
    position: "",
    department: "",
  });

  // New agenda form state
  const [newAgenda, setNewAgenda] = useState({
    title: "",
    description: "",
  });

  // New action item form state
  const [newAction, setNewAction] = useState({
    action: "",
    responsible: "",
    department: "",
    deadline: "",
    status: "진행중",
  });

  const handleAddAttendee = () => {
    if (newAttendee.name && newAttendee.position && newAttendee.department) {
      setReviewPlan({
        ...reviewPlan,
        attendees: [
          ...reviewPlan.attendees,
          {
            id: reviewPlan.attendees.length + 1,
            ...newAttendee,
          },
        ],
      });
      setNewAttendee({ name: "", position: "", department: "" });
    }
  };

  const handleRemoveAttendee = (id: number) => {
    setReviewPlan({
      ...reviewPlan,
      attendees: reviewPlan.attendees.filter((a) => a.id !== id),
    });
  };

  const handleAddAgenda = () => {
    if (newAgenda.title) {
      setReviewPlan({
        ...reviewPlan,
        agenda: [
          ...reviewPlan.agenda,
          {
            id: reviewPlan.agenda.length + 1,
            ...newAgenda,
          },
        ],
      });
      setNewAgenda({ title: "", description: "" });
    }
  };

  const handleRemoveAgenda = (id: number) => {
    setReviewPlan({
      ...reviewPlan,
      agenda: reviewPlan.agenda.filter((a) => a.id !== id),
    });
  };

  const handleAddAction = () => {
    if (newAction.action && newAction.responsible && newAction.deadline) {
      setOutputItems({
        ...outputItems,
        actionItems: [
          ...outputItems.actionItems,
          {
            id: outputItems.actionItems.length + 1,
            ...newAction,
          },
        ],
      });
      setNewAction({
        action: "",
        responsible: "",
        department: "",
        deadline: "",
        status: "진행중",
      });
    }
  };

  const handleRemoveAction = (id: number) => {
    setOutputItems({
      ...outputItems,
      actionItems: outputItems.actionItems.filter((item) => item.id !== id),
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      작성중: "secondary",
      검토중: "default",
      승인완료: "success",
      완료: "success",
      진행중: "default",
      지연: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">경영검토</h1>
          <p className="text-muted-foreground">
            IATF 16949 요구사항에 따른 경영검토 관리
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            불러오기
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">검토 계획</TabsTrigger>
          <TabsTrigger value="input">입력사항</TabsTrigger>
          <TabsTrigger value="output">출력사항</TabsTrigger>
          <TabsTrigger value="history">검토 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Review Plan (검토 계획) */}
        <TabsContent value="plan">
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  검토 기본정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewNumber">검토번호</Label>
                    <Input
                      id="reviewNumber"
                      value={reviewPlan.reviewNumber}
                      onChange={(e) =>
                        setReviewPlan({ ...reviewPlan, reviewNumber: e.target.value })
                      }
                      placeholder="MR-YYYY-XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewSession">회차</Label>
                    <Input
                      id="reviewSession"
                      type="number"
                      min={1}
                      value={reviewPlan.reviewSession}
                      onChange={(e) =>
                        setReviewPlan({
                          ...reviewPlan,
                          reviewSession: parseInt(e.target.value) || 1,
                        })
                      }
                      placeholder="회차 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewDate">검토일</Label>
                    <Input
                      id="reviewDate"
                      type="date"
                      value={reviewPlan.reviewDate}
                      onChange={(e) =>
                        setReviewPlan({ ...reviewPlan, reviewDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendees Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  참석자 (경영진, 관리책임자, 각 부서장)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="attendeeName">성명</Label>
                    <Input
                      id="attendeeName"
                      value={newAttendee.name}
                      onChange={(e) =>
                        setNewAttendee({ ...newAttendee, name: e.target.value })
                      }
                      placeholder="성명 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendeePosition">직책</Label>
                    <Select
                      value={newAttendee.position}
                      onValueChange={(value) =>
                        setNewAttendee({ ...newAttendee, position: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="직책 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendeeDepartment">소속</Label>
                    <Select
                      value={newAttendee.department}
                      onValueChange={(value) =>
                        setNewAttendee({ ...newAttendee, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="소속 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddAttendee}>
                    <Plus className="mr-2 h-4 w-4" />
                    추가
                  </Button>
                </div>

                {reviewPlan.attendees.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>성명</TableHead>
                        <TableHead>직책</TableHead>
                        <TableHead>소속</TableHead>
                        <TableHead className="w-[80px]">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewPlan.attendees.map((attendee, index) => (
                        <TableRow key={attendee.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{attendee.name}</TableCell>
                          <TableCell>{attendee.position}</TableCell>
                          <TableCell>{attendee.department}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttendee(attendee.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Agenda Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  검토 안건
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="agendaTitle">안건 제목</Label>
                    <Input
                      id="agendaTitle"
                      value={newAgenda.title}
                      onChange={(e) =>
                        setNewAgenda({ ...newAgenda, title: e.target.value })
                      }
                      placeholder="안건 제목 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agendaDescription">안건 설명</Label>
                    <Input
                      id="agendaDescription"
                      value={newAgenda.description}
                      onChange={(e) =>
                        setNewAgenda({ ...newAgenda, description: e.target.value })
                      }
                      placeholder="안건 설명 입력"
                    />
                  </div>
                  <Button onClick={handleAddAgenda}>
                    <Plus className="mr-2 h-4 w-4" />
                    추가
                  </Button>
                </div>

                {reviewPlan.agenda.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>안건 제목</TableHead>
                        <TableHead>안건 설명</TableHead>
                        <TableHead className="w-[80px]">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewPlan.agenda.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAgenda(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Input Items (입력사항) */}
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileInput className="h-5 w-5" />
                입력사항 (IATF 16949 요구사항)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="previousActionsStatus">
                  1. 이전 경영검토 조치현황
                </Label>
                <Textarea
                  id="previousActionsStatus"
                  value={inputItems.previousActionsStatus}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      previousActionsStatus: e.target.value,
                    })
                  }
                  placeholder="이전 경영검토에서 결정된 조치사항의 이행 현황을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualityObjectiveAchievement">
                  2. 품질목표 달성현황
                </Label>
                <Textarea
                  id="qualityObjectiveAchievement"
                  value={inputItems.qualityObjectiveAchievement}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      qualityObjectiveAchievement: e.target.value,
                    })
                  }
                  placeholder="품질목표 대비 실적 및 달성률을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processPerformance">
                  3. 프로세스 성과
                </Label>
                <Textarea
                  id="processPerformance"
                  value={inputItems.processPerformance}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      processPerformance: e.target.value,
                    })
                  }
                  placeholder="주요 프로세스의 성과 지표 및 제품 적합성 현황을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerFeedback">
                    4. 고객 피드백
                  </Label>
                  <Textarea
                    id="customerFeedback"
                    value={inputItems.customerFeedback}
                    onChange={(e) =>
                      setInputItems({
                        ...inputItems,
                        customerFeedback: e.target.value,
                      })
                    }
                    placeholder="고객만족도 조사 결과, 고객 의견 등을 기술하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerComplaints">
                    5. 고객 불만
                  </Label>
                  <Textarea
                    id="customerComplaints"
                    value={inputItems.customerComplaints}
                    onChange={(e) =>
                      setInputItems({
                        ...inputItems,
                        customerComplaints: e.target.value,
                      })
                    }
                    placeholder="고객 클레임 현황 및 처리 결과를 기술하세요"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nonconformityActions">
                  6. 부적합 및 시정조치
                </Label>
                <Textarea
                  id="nonconformityActions"
                  value={inputItems.nonconformityActions}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      nonconformityActions: e.target.value,
                    })
                  }
                  placeholder="부적합 발생 현황 및 시정조치 이행 상태를 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auditResults">
                  7. 심사 결과 (내부/외부)
                </Label>
                <Textarea
                  id="auditResults"
                  value={inputItems.auditResults}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      auditResults: e.target.value,
                    })
                  }
                  placeholder="내부심사 및 외부심사(인증심사, 고객심사) 결과를 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceAdequacy">
                  8. 자원 적절성
                </Label>
                <Textarea
                  id="resourceAdequacy"
                  value={inputItems.resourceAdequacy}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      resourceAdequacy: e.target.value,
                    })
                  }
                  placeholder="인적자원, 인프라, 작업환경 등의 적절성을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskOpportunity">
                  9. 리스크/기회
                </Label>
                <Textarea
                  id="riskOpportunity"
                  value={inputItems.riskOpportunity}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      riskOpportunity: e.target.value,
                    })
                  }
                  placeholder="리스크 및 기회에 대한 조치 현황과 효과성을 기술하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Output Items (출력사항) */}
        <TabsContent value="output">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileOutput className="h-5 w-5" />
                  출력사항 (IATF 16949 요구사항)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="improvementOpportunities">
                    1. 개선 기회
                  </Label>
                  <Textarea
                    id="improvementOpportunities"
                    value={outputItems.improvementOpportunities}
                    onChange={(e) =>
                      setOutputItems({
                        ...outputItems,
                        improvementOpportunities: e.target.value,
                      })
                    }
                    placeholder="품질경영시스템 및 프로세스 개선 기회를 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qmsChangeRequirements">
                    2. QMS 변경 필요사항
                  </Label>
                  <Textarea
                    id="qmsChangeRequirements"
                    value={outputItems.qmsChangeRequirements}
                    onChange={(e) =>
                      setOutputItems({
                        ...outputItems,
                        qmsChangeRequirements: e.target.value,
                      })
                    }
                    placeholder="품질경영시스템의 변경이 필요한 사항을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resourceRequirements">
                    3. 자원 필요사항
                  </Label>
                  <Textarea
                    id="resourceRequirements"
                    value={outputItems.resourceRequirements}
                    onChange={(e) =>
                      setOutputItems({
                        ...outputItems,
                        resourceRequirements: e.target.value,
                      })
                    }
                    placeholder="추가적으로 필요한 인력, 예산, 장비, 인프라 등을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualityObjectiveAdjustments">
                    4. 품질목표 조정
                  </Label>
                  <Textarea
                    id="qualityObjectiveAdjustments"
                    value={outputItems.qualityObjectiveAdjustments}
                    onChange={(e) =>
                      setOutputItems({
                        ...outputItems,
                        qualityObjectiveAdjustments: e.target.value,
                      })
                    }
                    placeholder="품질목표의 수정 또는 조정이 필요한 사항을 기술하세요"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decisions">
                    5. 결정사항 및 조치
                  </Label>
                  <Textarea
                    id="decisions"
                    value={outputItems.decisions}
                    onChange={(e) =>
                      setOutputItems({
                        ...outputItems,
                        decisions: e.target.value,
                      })
                    }
                    placeholder="경영검토 회의에서 결정된 사항을 기술하세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Items Card */}
            <Card>
              <CardHeader>
                <CardTitle>조치사항 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="newAction">조치사항</Label>
                    <Input
                      id="newAction"
                      value={newAction.action}
                      onChange={(e) =>
                        setNewAction({ ...newAction, action: e.target.value })
                      }
                      placeholder="조치사항 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newResponsible">담당자</Label>
                    <Input
                      id="newResponsible"
                      value={newAction.responsible}
                      onChange={(e) =>
                        setNewAction({ ...newAction, responsible: e.target.value })
                      }
                      placeholder="담당자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newDepartment">담당부서</Label>
                    <Select
                      value={newAction.department}
                      onValueChange={(value) =>
                        setNewAction({ ...newAction, department: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newDeadline">완료기한</Label>
                    <Input
                      id="newDeadline"
                      type="date"
                      value={newAction.deadline}
                      onChange={(e) =>
                        setNewAction({ ...newAction, deadline: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleAddAction}>
                    <Plus className="mr-2 h-4 w-4" />
                    추가
                  </Button>
                </div>

                {outputItems.actionItems.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>조치사항</TableHead>
                        <TableHead>담당자</TableHead>
                        <TableHead>담당부서</TableHead>
                        <TableHead>완료기한</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="w-[80px]">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {outputItems.actionItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.action}</TableCell>
                          <TableCell>{item.responsible}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{formatDate(item.deadline)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAction(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Review History (검토 이력) */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                검토 이력
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  검토 이력이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검토번호</TableHead>
                      <TableHead>회차</TableHead>
                      <TableHead>검토일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>완료일</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.reviewNumber}
                        </TableCell>
                        <TableCell>{item.reviewSession}회차</TableCell>
                        <TableCell>{formatDate(item.reviewDate)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{formatDate(item.completedDate)}</TableCell>
                        <TableCell>{item.modifiedBy}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            상세보기
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
      </Tabs>
    </div>
  );
}
