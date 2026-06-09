"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Trash2, Save, FileText, ClipboardList } from "lucide-react";

// Risk types
const RISK_TYPES = [
  { value: "품질", label: "품질" },
  { value: "환경", label: "환경" },
  { value: "안전", label: "안전" },
  { value: "비즈니스", label: "비즈니스" },
];

// Status options
const STATUS_OPTIONS = [
  { value: "진행중", label: "진행중" },
  { value: "완료", label: "완료" },
  { value: "지연", label: "지연" },
  { value: "미착수", label: "미착수" },
];

interface RiskItem {
  id: number;
  riskItem: string;
  riskType: string;
  likelihood: number;
  impact: number;
  riskLevel: number;
  currentControls: string;
  additionalActions: string;
  responsible: string;
  dueDate: string;
  status: string;
}

interface AssessmentHeader {
  assessmentDate: string;
  assessor: string;
  department: string;
}

// Sample data
const initialRiskItems: RiskItem[] = [
  {
    id: 1,
    riskItem: "원자재 품질 불량",
    riskType: "품질",
    likelihood: 3,
    impact: 4,
    riskLevel: 12,
    currentControls: "입고 검사 실시",
    additionalActions: "공급업체 품질 감사 강화",
    responsible: "김품질",
    dueDate: "2024-06-30",
    status: "진행중",
  },
  {
    id: 2,
    riskItem: "화학물질 누출",
    riskType: "환경",
    likelihood: 2,
    impact: 5,
    riskLevel: 10,
    currentControls: "누출 방지 시설 설치",
    additionalActions: "비상대응훈련 실시",
    responsible: "박환경",
    dueDate: "2024-07-15",
    status: "진행중",
  },
  {
    id: 3,
    riskItem: "설비 고장으로 인한 안전사고",
    riskType: "안전",
    likelihood: 4,
    impact: 5,
    riskLevel: 20,
    currentControls: "정기 점검 실시",
    additionalActions: "예방 정비 주기 단축",
    responsible: "이안전",
    dueDate: "2024-05-31",
    status: "완료",
  },
  {
    id: 4,
    riskItem: "주요 거래처 이탈",
    riskType: "비즈니스",
    likelihood: 2,
    impact: 4,
    riskLevel: 8,
    currentControls: "정기 고객 만족도 조사",
    additionalActions: "고객 관계 강화 프로그램",
    responsible: "최영업",
    dueDate: "2024-08-30",
    status: "미착수",
  },
];

// Helper function to calculate risk level
const calculateRiskLevel = (likelihood: number, impact: number): number => {
  return likelihood * impact;
};

// Helper function to get risk level color and label
const getRiskLevelInfo = (level: number): { color: string; label: string; bgClass: string; textClass: string } => {
  if (level >= 15) {
    return { color: "red", label: "고위험", bgClass: "bg-red-100", textClass: "text-red-700" };
  } else if (level >= 8) {
    return { color: "yellow", label: "중위험", bgClass: "bg-yellow-100", textClass: "text-yellow-700" };
  } else {
    return { color: "green", label: "저위험", bgClass: "bg-green-100", textClass: "text-green-700" };
  }
};

// Risk Matrix component
const RiskMatrix = () => {
  const matrixData: { likelihood: number; impact: number; level: number }[][] = [];

  for (let l = 5; l >= 1; l--) {
    const row: { likelihood: number; impact: number; level: number }[] = [];
    for (let i = 1; i <= 5; i++) {
      row.push({ likelihood: l, impact: i, level: l * i });
    }
    matrixData.push(row);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-muted text-sm font-medium" rowSpan={2}>발생가능성</th>
            <th className="border p-2 bg-muted text-sm font-medium text-center" colSpan={5}>영향도</th>
          </tr>
          <tr>
            <th className="border p-2 bg-muted text-sm">1 (미미)</th>
            <th className="border p-2 bg-muted text-sm">2 (경미)</th>
            <th className="border p-2 bg-muted text-sm">3 (보통)</th>
            <th className="border p-2 bg-muted text-sm">4 (심각)</th>
            <th className="border p-2 bg-muted text-sm">5 (치명적)</th>
          </tr>
        </thead>
        <tbody>
          {matrixData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 bg-muted text-sm font-medium text-center">
                {5 - rowIndex} ({["거의없음", "낮음", "보통", "높음", "매우높음"][4 - rowIndex]})
              </td>
              {row.map((cell, cellIndex) => {
                const info = getRiskLevelInfo(cell.level);
                return (
                  <td
                    key={cellIndex}
                    className={`border p-3 text-center font-bold ${info.bgClass} ${info.textClass}`}
                  >
                    {cell.level}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function RiskAssessmentPage() {
  const [activeTab, setActiveTab] = useState("criteria");
  const [header, setHeader] = useState<AssessmentHeader>({
    assessmentDate: new Date().toISOString().split("T")[0],
    assessor: "",
    department: "",
  });
  const [riskItems, setRiskItems] = useState<RiskItem[]>(initialRiskItems);

  const handleHeaderChange = (field: keyof AssessmentHeader, value: string) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleRiskItemChange = (id: number, field: keyof RiskItem, value: string | number) => {
    setRiskItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updatedItem = { ...item, [field]: value };

        // Auto-calculate risk level when likelihood or impact changes
        if (field === "likelihood" || field === "impact") {
          updatedItem.riskLevel = calculateRiskLevel(
            field === "likelihood" ? Number(value) : item.likelihood,
            field === "impact" ? Number(value) : item.impact
          );
        }

        return updatedItem;
      })
    );
  };

  const handleAddRiskItem = () => {
    const newItem: RiskItem = {
      id: Date.now(),
      riskItem: "",
      riskType: "",
      likelihood: 1,
      impact: 1,
      riskLevel: 1,
      currentControls: "",
      additionalActions: "",
      responsible: "",
      dueDate: "",
      status: "미착수",
    };
    setRiskItems([...riskItems, newItem]);
  };

  const handleRemoveRiskItem = (id: number) => {
    if (riskItems.length <= 1) {
      alert("최소 1개의 리스크 항목이 필요합니다.");
      return;
    }
    setRiskItems(riskItems.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!header.assessor || !header.department) {
      alert("평가자와 부서를 입력해주세요.");
      return;
    }

    const emptyItems = riskItems.filter((item) => !item.riskItem || !item.riskType);
    if (emptyItems.length > 0) {
      alert("모든 리스크 항목과 유형을 입력해주세요.");
      return;
    }

    alert("리스크 평가가 저장되었습니다.");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "완료":
        return <Badge variant="success">완료</Badge>;
      case "진행중":
        return <Badge variant="warning">진행중</Badge>;
      case "지연":
        return <Badge variant="destructive">지연</Badge>;
      case "미착수":
        return <Badge variant="outline">미착수</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">리스크 평가</h1>
          <p className="text-muted-foreground">리스크 평가 기준 및 평가 목록 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle>평가 기본정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="assessmentDate">평가일자</Label>
              <Input
                id="assessmentDate"
                type="date"
                value={header.assessmentDate}
                onChange={(e) => handleHeaderChange("assessmentDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessor">평가자</Label>
              <Input
                id="assessor"
                value={header.assessor}
                onChange={(e) => handleHeaderChange("assessor", e.target.value)}
                placeholder="평가자 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                value={header.department}
                onChange={(e) => handleHeaderChange("department", e.target.value)}
                placeholder="부서명"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="criteria" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                리스크 평가 기준
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                리스크 평가 목록
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Risk Criteria */}
            <TabsContent value="criteria">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    리스크 평가 기준
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Matrix */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">리스크 매트릭스</h3>
                    <RiskMatrix />
                  </div>

                  {/* Risk Level Legend */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">리스크 등급 기준</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                            <div>
                              <p className="font-semibold text-green-700">저위험 (1-6)</p>
                              <p className="text-sm text-green-600">현재 통제수단 유지</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-yellow-500"></div>
                            <div>
                              <p className="font-semibold text-yellow-700">중위험 (8-12)</p>
                              <p className="text-sm text-yellow-600">모니터링 및 개선 필요</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-red-500"></div>
                            <div>
                              <p className="font-semibold text-red-700">고위험 (15-25)</p>
                              <p className="text-sm text-red-600">즉각적인 조치 필요</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Likelihood Criteria */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">발생가능성 기준</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">등급</TableHead>
                          <TableHead className="w-32">명칭</TableHead>
                          <TableHead>설명</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">1</TableCell>
                          <TableCell>거의 없음</TableCell>
                          <TableCell>10년에 1회 미만 발생 가능</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2</TableCell>
                          <TableCell>낮음</TableCell>
                          <TableCell>5-10년에 1회 발생 가능</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">3</TableCell>
                          <TableCell>보통</TableCell>
                          <TableCell>1-5년에 1회 발생 가능</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">4</TableCell>
                          <TableCell>높음</TableCell>
                          <TableCell>연 1회 이상 발생 가능</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">5</TableCell>
                          <TableCell>매우 높음</TableCell>
                          <TableCell>분기 1회 이상 발생 가능</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Impact Criteria */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">영향도 기준</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">등급</TableHead>
                          <TableHead className="w-32">명칭</TableHead>
                          <TableHead>설명</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">1</TableCell>
                          <TableCell>미미</TableCell>
                          <TableCell>업무 영향 거의 없음</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">2</TableCell>
                          <TableCell>경미</TableCell>
                          <TableCell>일부 업무 지연, 즉시 복구 가능</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">3</TableCell>
                          <TableCell>보통</TableCell>
                          <TableCell>업무 지연 발생, 단기간 내 복구</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">4</TableCell>
                          <TableCell>심각</TableCell>
                          <TableCell>주요 업무 중단, 상당한 손실 발생</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">5</TableCell>
                          <TableCell>치명적</TableCell>
                          <TableCell>사업 연속성 위협, 회복 불가능한 손실</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Risk Types */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">리스크 유형</h3>
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardContent className="pt-4">
                          <Badge className="mb-2">품질</Badge>
                          <p className="text-sm text-muted-foreground">제품/서비스 품질 관련 리스크</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <Badge className="mb-2" variant="outline">환경</Badge>
                          <p className="text-sm text-muted-foreground">환경 오염, 폐기물 관련 리스크</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <Badge className="mb-2" variant="warning">안전</Badge>
                          <p className="text-sm text-muted-foreground">산업안전, 작업환경 관련 리스크</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <Badge className="mb-2" variant="destructive">비즈니스</Badge>
                          <p className="text-sm text-muted-foreground">경영, 재무, 운영 관련 리스크</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Risk Assessment List */}
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      리스크 평가 목록
                    </CardTitle>
                    <Button onClick={handleAddRiskItem} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      항목 추가
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {riskItems.length === 0 ? (
                    <div className="py-8 text-center">
                      <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">리스크 항목이 없습니다.</p>
                      <Button className="mt-4" onClick={handleAddRiskItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        첫 항목 추가
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">NO</TableHead>
                            <TableHead className="min-w-[150px]">리스크 항목</TableHead>
                            <TableHead className="w-24">리스크 유형</TableHead>
                            <TableHead className="w-24">발생가능성</TableHead>
                            <TableHead className="w-20">영향도</TableHead>
                            <TableHead className="w-24">리스크등급</TableHead>
                            <TableHead className="min-w-[120px]">현재 통제수단</TableHead>
                            <TableHead className="min-w-[120px]">추가 조치계획</TableHead>
                            <TableHead className="w-24">담당자</TableHead>
                            <TableHead className="w-32">완료예정일</TableHead>
                            <TableHead className="w-24">상태</TableHead>
                            <TableHead className="w-16">삭제</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {riskItems.map((item, index) => {
                            const riskInfo = getRiskLevelInfo(item.riskLevel);
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>
                                  <Input
                                    value={item.riskItem}
                                    onChange={(e) => handleRiskItemChange(item.id, "riskItem", e.target.value)}
                                    placeholder="리스크 항목"
                                    className="min-w-[140px]"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={item.riskType}
                                    onValueChange={(v) => handleRiskItemChange(item.id, "riskType", v)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="유형" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {RISK_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={item.likelihood.toString()}
                                    onValueChange={(v) => handleRiskItemChange(item.id, "likelihood", Number(v))}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>
                                          {n}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={item.impact.toString()}
                                    onValueChange={(v) => handleRiskItemChange(item.id, "impact", Number(v))}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map((n) => (
                                        <SelectItem key={n} value={n.toString()}>
                                          {n}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <div className={`px-3 py-1 rounded text-center font-bold ${riskInfo.bgClass} ${riskInfo.textClass}`}>
                                    {item.riskLevel} ({riskInfo.label})
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={item.currentControls}
                                    onChange={(e) => handleRiskItemChange(item.id, "currentControls", e.target.value)}
                                    placeholder="현재 통제수단"
                                    className="min-w-[110px]"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={item.additionalActions}
                                    onChange={(e) => handleRiskItemChange(item.id, "additionalActions", e.target.value)}
                                    placeholder="추가 조치계획"
                                    className="min-w-[110px]"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={item.responsible}
                                    onChange={(e) => handleRiskItemChange(item.id, "responsible", e.target.value)}
                                    placeholder="담당자"
                                    className="w-20"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="date"
                                    value={item.dueDate}
                                    onChange={(e) => handleRiskItemChange(item.id, "dueDate", e.target.value)}
                                    className="w-32"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={item.status}
                                    onValueChange={(v) => handleRiskItemChange(item.id, "status", v)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {STATUS_OPTIONS.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                          {status.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveRiskItem(item.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Summary Section */}
                  {riskItems.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-4">리스크 요약</h4>
                      <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                          <CardContent className="pt-4">
                            <p className="text-sm text-muted-foreground">전체 리스크</p>
                            <p className="text-2xl font-bold">{riskItems.length}건</p>
                          </CardContent>
                        </Card>
                        <Card className="border-red-200">
                          <CardContent className="pt-4">
                            <p className="text-sm text-red-600">고위험</p>
                            <p className="text-2xl font-bold text-red-600">
                              {riskItems.filter((item) => item.riskLevel >= 15).length}건
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border-yellow-200">
                          <CardContent className="pt-4">
                            <p className="text-sm text-yellow-600">중위험</p>
                            <p className="text-2xl font-bold text-yellow-600">
                              {riskItems.filter((item) => item.riskLevel >= 8 && item.riskLevel < 15).length}건
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="border-green-200">
                          <CardContent className="pt-4">
                            <p className="text-sm text-green-600">저위험</p>
                            <p className="text-2xl font-bold text-green-600">
                              {riskItems.filter((item) => item.riskLevel < 8).length}건
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
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
