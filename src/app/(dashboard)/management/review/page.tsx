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
  FileText,
  CheckCircle,
  History,
  Save,
  Trash2,
} from "lucide-react";

// Types
interface ReviewBasicInfo {
  reviewNumber: string;
  reviewDate: string;
  attendees: string;
  department: string;
}

interface ReviewInputItems {
  previousCorrectiveActions: string;
  qualityObjectiveStatus: string;
  processPerformance: string;
  nonconformityActions: string;
  internalAuditResults: string;
  externalAuditResults: string;
  customerSatisfaction: string;
  resourceAdequacy: string;
  supplierPerformance: string;
  riskOpportunityManagement: string;
  improvementRecommendations: string;
}

interface ReviewResult {
  decisions: string;
  improvementPlan: string;
  requiredResources: string;
  responsibleDepartment: string;
  completionDeadline: string;
}

interface ReviewHistory {
  id: number;
  reviewNumber: string;
  reviewDate: string;
  status: string;
  modifiedDate: string;
  modifiedBy: string;
}

interface ActionItem {
  id: number;
  action: string;
  department: string;
  deadline: string;
  status: string;
}

// Initial data
const initialBasicInfo: ReviewBasicInfo = {
  reviewNumber: "MR-2026-002",
  reviewDate: "2026-06-09",
  attendees: "",
  department: "",
};

const initialInputItems: ReviewInputItems = {
  previousCorrectiveActions: "",
  qualityObjectiveStatus: "",
  processPerformance: "",
  nonconformityActions: "",
  internalAuditResults: "",
  externalAuditResults: "",
  customerSatisfaction: "",
  resourceAdequacy: "",
  supplierPerformance: "",
  riskOpportunityManagement: "",
  improvementRecommendations: "",
};

const initialResult: ReviewResult = {
  decisions: "",
  improvementPlan: "",
  requiredResources: "",
  responsibleDepartment: "",
  completionDeadline: "",
};

const initialHistory: ReviewHistory[] = [
  {
    id: 1,
    reviewNumber: "MR-2026-001",
    reviewDate: "2026-03-15",
    status: "완료",
    modifiedDate: "2026-03-16",
    modifiedBy: "품질관리팀",
  },
  {
    id: 2,
    reviewNumber: "MR-2025-004",
    reviewDate: "2025-12-15",
    status: "완료",
    modifiedDate: "2025-12-16",
    modifiedBy: "품질관리팀",
  },
  {
    id: 3,
    reviewNumber: "MR-2025-003",
    reviewDate: "2025-09-15",
    status: "완료",
    modifiedDate: "2025-09-16",
    modifiedBy: "품질관리팀",
  },
];

const departmentOptions = [
  "품질관리팀",
  "생산팀",
  "기술팀",
  "영업팀",
  "구매팀",
  "인사팀",
  "경영지원팀",
];

const statusOptions = ["작성중", "검토중", "승인완료", "완료"];

export default function ManagementReviewPage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [basicInfo, setBasicInfo] = useState<ReviewBasicInfo>(initialBasicInfo);
  const [inputItems, setInputItems] = useState<ReviewInputItems>(initialInputItems);
  const [result, setResult] = useState<ReviewResult>(initialResult);
  const [history] = useState<ReviewHistory[]>(initialHistory);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [newAction, setNewAction] = useState({
    action: "",
    department: "",
    deadline: "",
    status: "진행중",
  });

  const handleAddAction = () => {
    if (newAction.action && newAction.department && newAction.deadline) {
      setActionItems([
        ...actionItems,
        {
          id: actionItems.length + 1,
          ...newAction,
        },
      ]);
      setNewAction({
        action: "",
        department: "",
        deadline: "",
        status: "진행중",
      });
    }
  };

  const handleRemoveAction = (id: number) => {
    setActionItems(actionItems.filter((item) => item.id !== id));
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
            <FileText className="mr-2 h-4 w-4" />
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
          <TabsTrigger value="basic">검토 기본정보</TabsTrigger>
          <TabsTrigger value="input">검토 항목 입력</TabsTrigger>
          <TabsTrigger value="results">결과 및 조치</TabsTrigger>
          <TabsTrigger value="history">검토 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                검토 기본정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reviewNumber">검토번호</Label>
                  <Input
                    id="reviewNumber"
                    value={basicInfo.reviewNumber}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, reviewNumber: e.target.value })
                    }
                    placeholder="MR-YYYY-XXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewDate">검토일</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    value={basicInfo.reviewDate}
                    onChange={(e) =>
                      setBasicInfo({ ...basicInfo, reviewDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">참석자</Label>
                <Textarea
                  id="attendees"
                  value={basicInfo.attendees}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, attendees: e.target.value })
                  }
                  placeholder="참석자 명단을 입력하세요 (예: 대표이사, 품질부장, 생산부장, 영업부장)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">주관부서</Label>
                <Select
                  value={basicInfo.department}
                  onValueChange={(value) =>
                    setBasicInfo({ ...basicInfo, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="주관부서 선택" />
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Review Input Items (IATF 16949) */}
        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                검토 항목 입력 (IATF 16949 요구사항)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="previousCorrectiveActions">
                  1. 이전검토 시정조치 현황
                </Label>
                <Textarea
                  id="previousCorrectiveActions"
                  value={inputItems.previousCorrectiveActions}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      previousCorrectiveActions: e.target.value,
                    })
                  }
                  placeholder="이전 경영검토에서 결정된 시정조치의 이행 현황을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualityObjectiveStatus">
                  2. 품질목표 달성현황
                </Label>
                <Textarea
                  id="qualityObjectiveStatus"
                  value={inputItems.qualityObjectiveStatus}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      qualityObjectiveStatus: e.target.value,
                    })
                  }
                  placeholder="품질목표 대비 실적 및 달성률을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processPerformance">
                  3. 프로세스 성과 / 제품 적합성
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

              <div className="space-y-2">
                <Label htmlFor="nonconformityActions">
                  4. 부적합 및 시정조치
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="internalAuditResults">
                    5. 심사결과 - 내부심사
                  </Label>
                  <Textarea
                    id="internalAuditResults"
                    value={inputItems.internalAuditResults}
                    onChange={(e) =>
                      setInputItems({
                        ...inputItems,
                        internalAuditResults: e.target.value,
                      })
                    }
                    placeholder="내부심사 결과 및 발견사항을 기술하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="externalAuditResults">
                    6. 심사결과 - 외부심사
                  </Label>
                  <Textarea
                    id="externalAuditResults"
                    value={inputItems.externalAuditResults}
                    onChange={(e) =>
                      setInputItems({
                        ...inputItems,
                        externalAuditResults: e.target.value,
                      })
                    }
                    placeholder="외부심사(인증심사, 고객심사) 결과를 기술하세요"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerSatisfaction">
                  7. 고객만족 및 피드백
                </Label>
                <Textarea
                  id="customerSatisfaction"
                  value={inputItems.customerSatisfaction}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      customerSatisfaction: e.target.value,
                    })
                  }
                  placeholder="고객만족도 조사 결과, 고객 클레임, 피드백 현황을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceAdequacy">8. 자원의 적절성</Label>
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
                <Label htmlFor="supplierPerformance">9. 공급자 성과</Label>
                <Textarea
                  id="supplierPerformance"
                  value={inputItems.supplierPerformance}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      supplierPerformance: e.target.value,
                    })
                  }
                  placeholder="공급자 평가 결과 및 성과 현황을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskOpportunityManagement">
                  10. 리스크 / 기회 관리
                </Label>
                <Textarea
                  id="riskOpportunityManagement"
                  value={inputItems.riskOpportunityManagement}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      riskOpportunityManagement: e.target.value,
                    })
                  }
                  placeholder="리스크 및 기회에 대한 조치 효과성을 기술하세요"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvementRecommendations">
                  11. 개선 권고사항
                </Label>
                <Textarea
                  id="improvementRecommendations"
                  value={inputItems.improvementRecommendations}
                  onChange={(e) =>
                    setInputItems({
                      ...inputItems,
                      improvementRecommendations: e.target.value,
                    })
                  }
                  placeholder="품질경영시스템 개선을 위한 권고사항을 기술하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Results and Actions */}
        <TabsContent value="results">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  검토결과
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="decisions">결정사항</Label>
                  <Textarea
                    id="decisions"
                    value={result.decisions}
                    onChange={(e) =>
                      setResult({ ...result, decisions: e.target.value })
                    }
                    placeholder="경영검토 회의에서 결정된 사항을 기술하세요"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improvementPlan">개선조치 계획</Label>
                  <Textarea
                    id="improvementPlan"
                    value={result.improvementPlan}
                    onChange={(e) =>
                      setResult({ ...result, improvementPlan: e.target.value })
                    }
                    placeholder="개선을 위한 구체적인 조치 계획을 기술하세요"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="requiredResources">필요자원</Label>
                    <Textarea
                      id="requiredResources"
                      value={result.requiredResources}
                      onChange={(e) =>
                        setResult({ ...result, requiredResources: e.target.value })
                      }
                      placeholder="필요한 인력, 예산, 장비 등"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsibleDepartment">담당부서</Label>
                    <Select
                      value={result.responsibleDepartment}
                      onValueChange={(value) =>
                        setResult({ ...result, responsibleDepartment: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="담당부서 선택" />
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
                    <Label htmlFor="completionDeadline">완료기한</Label>
                    <Input
                      id="completionDeadline"
                      type="date"
                      value={result.completionDeadline}
                      onChange={(e) =>
                        setResult({ ...result, completionDeadline: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>개선조치 항목 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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

                {actionItems.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>조치사항</TableHead>
                        <TableHead>담당부서</TableHead>
                        <TableHead>완료기한</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="w-[80px]">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actionItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.action}</TableCell>
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

        {/* Tab 4: Review History */}
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
                      <TableHead>검토일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>수정일</TableHead>
                      <TableHead>수정자</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.reviewNumber}
                        </TableCell>
                        <TableCell>{formatDate(item.reviewDate)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{formatDate(item.modifiedDate)}</TableCell>
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
