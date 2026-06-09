"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Save, Trash2, AlertTriangle, History, Calculator, Calendar, BarChart3 } from "lucide-react";

// Types
interface RiskCriteria {
  id: number;
  criteriaName: string;
  description: string;
  weight: number;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
}

interface ProcessFrequency {
  id: number;
  processName: string;
  department: string;
  importance: number;
  previousResult: number;
  customerClaims: number;
  changeOccurred: number;
  totalScore: number;
  determinedFrequency: string;
  remarks: string;
}

interface AnnualSchedule {
  id: number;
  processName: string;
  frequency: string;
  jan: boolean;
  feb: boolean;
  mar: boolean;
  apr: boolean;
  may: boolean;
  jun: boolean;
  jul: boolean;
  aug: boolean;
  sep: boolean;
  oct: boolean;
  nov: boolean;
  dec: boolean;
}

interface FrequencyHistory {
  id: number;
  changeDate: string;
  processName: string;
  previousFrequency: string;
  newFrequency: string;
  reason: string;
  approvedBy: string;
}

export default function AuditFrequencyPage() {
  const [activeTab, setActiveTab] = useState("criteria");

  // Risk Criteria state with initial data
  const [riskCriteria, setRiskCriteria] = useState<RiskCriteria[]>([
    {
      id: 1,
      criteriaName: "프로세스 중요도",
      description: "제품품질 및 고객만족에 미치는 영향도",
      weight: 30,
      level1: "영향 미미",
      level2: "경미한 영향",
      level3: "보통 영향",
      level4: "중요한 영향",
      level5: "핵심 프로세스",
    },
    {
      id: 2,
      criteriaName: "이전 심사결과",
      description: "최근 내부/외부 심사 시 발견된 부적합 현황",
      weight: 25,
      level1: "부적합 없음",
      level2: "관찰사항 1건",
      level3: "Minor NC 1건",
      level4: "Minor NC 2건 이상",
      level5: "Major NC 발생",
    },
    {
      id: 3,
      criteriaName: "고객 클레임 이력",
      description: "최근 1년간 고객 클레임/불만 발생 현황",
      weight: 25,
      level1: "클레임 없음",
      level2: "1건 발생",
      level3: "2-3건 발생",
      level4: "4-5건 발생",
      level5: "6건 이상",
    },
    {
      id: 4,
      criteriaName: "변경사항 발생여부",
      description: "프로세스/설비/인원 등 주요 변경 발생 현황",
      weight: 20,
      level1: "변경 없음",
      level2: "경미한 변경",
      level3: "일부 변경",
      level4: "주요 변경",
      level5: "전면 변경",
    },
  ]);

  // Process Frequency state with initial data
  const [processFrequencies, setProcessFrequencies] = useState<ProcessFrequency[]>([
    { id: 1, processName: "영업 프로세스", department: "영업팀", importance: 3, previousResult: 2, customerClaims: 2, changeOccurred: 1, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 2, processName: "설계 개발", department: "개발팀", importance: 5, previousResult: 3, customerClaims: 2, changeOccurred: 3, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 3, processName: "구매/외주관리", department: "구매팀", importance: 4, previousResult: 4, customerClaims: 3, changeOccurred: 2, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 4, processName: "생산 프로세스", department: "생산팀", importance: 5, previousResult: 3, customerClaims: 4, changeOccurred: 2, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 5, processName: "품질관리", department: "품질팀", importance: 5, previousResult: 2, customerClaims: 3, changeOccurred: 1, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 6, processName: "출하/물류", department: "물류팀", importance: 3, previousResult: 1, customerClaims: 1, changeOccurred: 1, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 7, processName: "문서관리", department: "품질팀", importance: 2, previousResult: 2, customerClaims: 1, changeOccurred: 1, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 8, processName: "설비관리", department: "설비팀", importance: 4, previousResult: 3, customerClaims: 2, changeOccurred: 3, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 9, processName: "교육훈련", department: "인사팀", importance: 3, previousResult: 1, customerClaims: 1, changeOccurred: 2, totalScore: 0, determinedFrequency: "", remarks: "" },
    { id: 10, processName: "경영검토", department: "경영지원", importance: 4, previousResult: 1, customerClaims: 1, changeOccurred: 1, totalScore: 0, determinedFrequency: "", remarks: "" },
  ]);

  // Annual Schedule state
  const [annualSchedule, setAnnualSchedule] = useState<AnnualSchedule[]>([
    { id: 1, processName: "영업 프로세스", frequency: "반기", jan: false, feb: false, mar: true, apr: false, may: false, jun: false, jul: false, aug: false, sep: true, oct: false, nov: false, dec: false },
    { id: 2, processName: "설계 개발", frequency: "분기", jan: false, feb: false, mar: true, apr: false, may: false, jun: true, jul: false, aug: false, sep: true, oct: false, nov: false, dec: true },
    { id: 3, processName: "구매/외주관리", frequency: "분기", jan: false, feb: true, mar: false, apr: false, may: true, jun: false, jul: false, aug: true, sep: false, oct: false, nov: true, dec: false },
    { id: 4, processName: "생산 프로세스", frequency: "월간", jan: true, feb: true, mar: true, apr: true, may: true, jun: true, jul: true, aug: true, sep: true, oct: true, nov: true, dec: true },
    { id: 5, processName: "품질관리", frequency: "분기", jan: true, feb: false, mar: false, apr: true, may: false, jun: false, jul: true, aug: false, sep: false, oct: true, nov: false, dec: false },
    { id: 6, processName: "출하/물류", frequency: "연간", jan: false, feb: false, mar: false, apr: false, may: false, jun: true, jul: false, aug: false, sep: false, oct: false, nov: false, dec: false },
    { id: 7, processName: "문서관리", frequency: "연간", jan: false, feb: false, mar: false, apr: false, may: false, jun: false, jul: false, aug: false, sep: false, oct: false, nov: true, dec: false },
    { id: 8, processName: "설비관리", frequency: "분기", jan: false, feb: true, mar: false, apr: false, may: true, jun: false, jul: false, aug: true, sep: false, oct: false, nov: true, dec: false },
    { id: 9, processName: "교육훈련", frequency: "반기", jan: false, feb: false, mar: false, apr: true, may: false, jun: false, jul: false, aug: false, sep: false, oct: true, nov: false, dec: false },
    { id: 10, processName: "경영검토", frequency: "연간", jan: false, feb: false, mar: false, apr: false, may: false, jun: false, jul: false, aug: false, sep: false, oct: false, nov: false, dec: true },
  ]);

  // Frequency History state
  const [frequencyHistory, setFrequencyHistory] = useState<FrequencyHistory[]>([
    { id: 1, changeDate: "2026-01-15", processName: "생산 프로세스", previousFrequency: "분기", newFrequency: "월간", reason: "고객 클레임 증가로 인한 강화", approvedBy: "품질책임자" },
    { id: 2, changeDate: "2025-11-20", processName: "구매/외주관리", previousFrequency: "반기", newFrequency: "분기", reason: "공급업체 품질문제 발생", approvedBy: "품질책임자" },
    { id: 3, changeDate: "2025-08-10", processName: "설계 개발", previousFrequency: "반기", newFrequency: "분기", reason: "신규 프로젝트 증가", approvedBy: "품질책임자" },
    { id: 4, changeDate: "2025-06-05", processName: "출하/물류", previousFrequency: "분기", newFrequency: "연간", reason: "12개월 부적합 미발생", approvedBy: "품질책임자" },
    { id: 5, changeDate: "2025-03-22", processName: "문서관리", previousFrequency: "반기", newFrequency: "연간", reason: "시스템 안정화 완료", approvedBy: "품질책임자" },
  ]);

  // Calculate total score and determine frequency
  const calculateScore = (process: ProcessFrequency): { score: number; frequency: string } => {
    const weights = [0.30, 0.25, 0.25, 0.20];
    const scores = [process.importance, process.previousResult, process.customerClaims, process.changeOccurred];
    const totalScore = scores.reduce((sum, score, idx) => sum + score * weights[idx], 0) * 20; // Scale to 100

    let frequency = "";
    if (totalScore >= 80) frequency = "월간";
    else if (totalScore >= 60) frequency = "분기";
    else if (totalScore >= 40) frequency = "반기";
    else frequency = "연간";

    return { score: Math.round(totalScore), frequency };
  };

  // Update process scores
  const updateProcessScore = (id: number, field: keyof ProcessFrequency, value: number | string) => {
    setProcessFrequencies(processFrequencies.map((p) => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        const { score, frequency } = calculateScore(updated);
        return { ...updated, totalScore: score, determinedFrequency: frequency };
      }
      return p;
    }));
  };

  // Add new process
  const addProcess = () => {
    setProcessFrequencies([
      ...processFrequencies,
      { id: Date.now(), processName: "", department: "", importance: 3, previousResult: 1, customerClaims: 1, changeOccurred: 1, totalScore: 0, determinedFrequency: "", remarks: "" },
    ]);
  };

  // Remove process
  const removeProcess = (id: number) => {
    setProcessFrequencies(processFrequencies.filter((p) => p.id !== id));
  };

  // Toggle schedule month
  const toggleScheduleMonth = (id: number, month: string) => {
    setAnnualSchedule(annualSchedule.map((s) =>
      s.id === id ? { ...s, [month]: !s[month as keyof AnnualSchedule] } : s
    ));
  };

  // Add history record
  const addHistoryRecord = () => {
    setFrequencyHistory([
      { id: Date.now(), changeDate: new Date().toISOString().split("T")[0], processName: "", previousFrequency: "", newFrequency: "", reason: "", approvedBy: "" },
      ...frequencyHistory,
    ]);
  };

  // Update history record
  const updateHistoryRecord = (id: number, field: keyof FrequencyHistory, value: string) => {
    setFrequencyHistory(frequencyHistory.map((h) =>
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  // Remove history record
  const removeHistoryRecord = (id: number) => {
    setFrequencyHistory(frequencyHistory.filter((h) => h.id !== id));
  };

  // Update criteria
  const updateCriteria = (id: number, field: keyof RiskCriteria, value: string | number) => {
    setRiskCriteria(riskCriteria.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Save handler
  const handleSave = () => {
    const data = {
      riskCriteria,
      processFrequencies,
      annualSchedule,
      frequencyHistory,
    };
    console.log("Saving frequency data:", data);
    alert("내부심사 빈도수 결정 데이터가 저장되었습니다.");
  };

  // Recalculate all scores
  const recalculateAllScores = () => {
    setProcessFrequencies(processFrequencies.map((p) => {
      const { score, frequency } = calculateScore(p);
      return { ...p, totalScore: score, determinedFrequency: frequency };
    }));
  };

  // Frequency options
  const frequencyOptions = ["월간", "분기", "반기", "연간"];
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const monthLabels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  // Get frequency badge color
  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case "월간": return "bg-red-100 text-red-800";
      case "분기": return "bg-orange-100 text-orange-800";
      case "반기": return "bg-yellow-100 text-yellow-800";
      case "연간": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">내부심사 빈도수 결정</h1>
          <p className="text-muted-foreground">IATF 16949 리스크 기반 심사 빈도 결정</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criteria">
            <BarChart3 className="mr-2 h-4 w-4" />
            리스크 평가 기준
          </TabsTrigger>
          <TabsTrigger value="frequency">
            <Calculator className="mr-2 h-4 w-4" />
            프로세스별 빈도 결정
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            년간 심사 일정
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            결정 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Risk Criteria */}
        <TabsContent value="criteria">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                리스크 평가 기준
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                IATF 16949 요구사항에 따라 프로세스 리스크를 평가하여 심사 빈도를 결정합니다.
                각 기준별 가중치 합계는 100%가 되어야 합니다.
              </p>

              <div className="space-y-6">
                {riskCriteria.map((criteria, index) => (
                  <Card key={criteria.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{index + 1}. {criteria.criteriaName}</h4>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">가중치(%)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={criteria.weight}
                            onChange={(e) => updateCriteria(criteria.id, "weight", parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>설명</Label>
                        <Textarea
                          value={criteria.description}
                          onChange={(e) => updateCriteria(criteria.id, "description", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Level 1 (최저)</Label>
                          <Input
                            value={criteria.level1}
                            onChange={(e) => updateCriteria(criteria.id, "level1", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Level 2</Label>
                          <Input
                            value={criteria.level2}
                            onChange={(e) => updateCriteria(criteria.id, "level2", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Level 3 (중간)</Label>
                          <Input
                            value={criteria.level3}
                            onChange={(e) => updateCriteria(criteria.id, "level3", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Level 4</Label>
                          <Input
                            value={criteria.level4}
                            onChange={(e) => updateCriteria(criteria.id, "level4", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Level 5 (최고)</Label>
                          <Input
                            value={criteria.level5}
                            onChange={(e) => updateCriteria(criteria.id, "level5", e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Weight Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">가중치 합계</h4>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">
                    {riskCriteria.reduce((sum, c) => sum + c.weight, 0)}%
                  </span>
                  {riskCriteria.reduce((sum, c) => sum + c.weight, 0) !== 100 && (
                    <Badge variant="destructive">가중치 합계가 100%가 아닙니다</Badge>
                  )}
                  {riskCriteria.reduce((sum, c) => sum + c.weight, 0) === 100 && (
                    <Badge className="bg-green-100 text-green-800">정상</Badge>
                  )}
                </div>
              </div>

              {/* Frequency Determination Guide */}
              <div className="mt-6 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">빈도 결정 기준</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="p-2 bg-red-50 rounded">
                    <span className="font-medium text-red-800">80점 이상</span>
                    <p className="text-red-600">월간 심사</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <span className="font-medium text-orange-800">60-79점</span>
                    <p className="text-orange-600">분기별 심사</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded">
                    <span className="font-medium text-yellow-800">40-59점</span>
                    <p className="text-yellow-600">반기별 심사</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <span className="font-medium text-green-800">40점 미만</span>
                    <p className="text-green-600">연간 심사</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Process Frequency Determination */}
        <TabsContent value="frequency">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                프로세스별 빈도 결정
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={recalculateAllScores}>
                  <Calculator className="mr-2 h-4 w-4" />
                  전체 재계산
                </Button>
                <Button onClick={addProcess} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  프로세스 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">프로세스명</TableHead>
                      <TableHead className="w-[100px]">부서</TableHead>
                      <TableHead className="text-center w-[80px]">중요도<br/>(30%)</TableHead>
                      <TableHead className="text-center w-[80px]">이전결과<br/>(25%)</TableHead>
                      <TableHead className="text-center w-[80px]">클레임<br/>(25%)</TableHead>
                      <TableHead className="text-center w-[80px]">변경<br/>(20%)</TableHead>
                      <TableHead className="text-center w-[80px]">총점</TableHead>
                      <TableHead className="text-center w-[100px]">결정 빈도</TableHead>
                      <TableHead className="w-[150px]">비고</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processFrequencies.map((process) => {
                      const { score, frequency } = calculateScore(process);
                      return (
                        <TableRow key={process.id}>
                          <TableCell>
                            <Input
                              value={process.processName}
                              onChange={(e) => updateProcessScore(process.id, "processName", e.target.value)}
                              placeholder="프로세스명"
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={process.department}
                              onChange={(e) => updateProcessScore(process.id, "department", e.target.value)}
                              placeholder="부서"
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={process.importance.toString()}
                              onValueChange={(v) => updateProcessScore(process.id, "importance", parseInt(v))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={process.previousResult.toString()}
                              onValueChange={(v) => updateProcessScore(process.id, "previousResult", parseInt(v))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={process.customerClaims.toString()}
                              onValueChange={(v) => updateProcessScore(process.id, "customerClaims", parseInt(v))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={process.changeOccurred.toString()}
                              onValueChange={(v) => updateProcessScore(process.id, "changeOccurred", parseInt(v))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-bold text-lg">{score}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={getFrequencyColor(frequency)}>
                              {frequency}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={process.remarks}
                              onChange={(e) => updateProcessScore(process.id, "remarks", e.target.value)}
                              placeholder="비고"
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProcess(process.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Frequency Distribution Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">빈도 분포 현황</h4>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-red-600">월간: </span>
                    <span className="font-medium">
                      {processFrequencies.filter((p) => calculateScore(p).frequency === "월간").length}개 프로세스
                    </span>
                  </div>
                  <div>
                    <span className="text-orange-600">분기: </span>
                    <span className="font-medium">
                      {processFrequencies.filter((p) => calculateScore(p).frequency === "분기").length}개 프로세스
                    </span>
                  </div>
                  <div>
                    <span className="text-yellow-600">반기: </span>
                    <span className="font-medium">
                      {processFrequencies.filter((p) => calculateScore(p).frequency === "반기").length}개 프로세스
                    </span>
                  </div>
                  <div>
                    <span className="text-green-600">연간: </span>
                    <span className="font-medium">
                      {processFrequencies.filter((p) => calculateScore(p).frequency === "연간").length}개 프로세스
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Annual Schedule Matrix */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                년간 심사 일정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                각 프로세스별 심사 일정을 월별로 클릭하여 지정합니다.
              </p>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">프로세스명</TableHead>
                      <TableHead className="w-[80px] text-center">빈도</TableHead>
                      {monthLabels.map((label, idx) => (
                        <TableHead key={idx} className="text-center w-[50px]">{label}</TableHead>
                      ))}
                      <TableHead className="text-center w-[60px]">계</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {annualSchedule.map((schedule) => {
                      const monthCount = monthNames.reduce((count, month) =>
                        count + (schedule[month as keyof AnnualSchedule] ? 1 : 0), 0
                      );
                      return (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.processName}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getFrequencyColor(schedule.frequency)}>
                              {schedule.frequency}
                            </Badge>
                          </TableCell>
                          {monthNames.map((month) => (
                            <TableCell key={month} className="text-center p-1">
                              <button
                                onClick={() => toggleScheduleMonth(schedule.id, month)}
                                className={`w-8 h-8 rounded-full transition-colors ${
                                  schedule[month as keyof AnnualSchedule]
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }`}
                              >
                                {schedule[month as keyof AnnualSchedule] ? "O" : "-"}
                              </button>
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-bold">{monthCount}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Monthly Summary */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">월별 심사 건수</h4>
                <div className="grid grid-cols-12 gap-2 text-sm">
                  {monthNames.map((month, idx) => {
                    const count = annualSchedule.reduce((sum, s) =>
                      sum + (s[month as keyof AnnualSchedule] ? 1 : 0), 0
                    );
                    return (
                      <div key={month} className="text-center p-2 bg-white rounded">
                        <div className="text-xs text-muted-foreground">{monthLabels[idx]}</div>
                        <div className="font-bold text-lg">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Annual Total */}
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">연간 심사 총계</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">총 심사 횟수: </span>
                    <span className="font-bold text-xl">
                      {annualSchedule.reduce((total, s) =>
                        total + monthNames.reduce((count, month) =>
                          count + (s[month as keyof AnnualSchedule] ? 1 : 0), 0
                        ), 0
                      )}회
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">심사 대상 프로세스: </span>
                    <span className="font-bold text-xl">{annualSchedule.length}개</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Frequency Change History */}
        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                빈도 결정 변경 이력
              </CardTitle>
              <Button onClick={addHistoryRecord} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                이력 추가
              </Button>
            </CardHeader>
            <CardContent>
              {frequencyHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>등록된 변경 이력이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">변경일자</TableHead>
                      <TableHead className="w-[150px]">프로세스명</TableHead>
                      <TableHead className="w-[100px] text-center">변경 전</TableHead>
                      <TableHead className="w-[100px] text-center">변경 후</TableHead>
                      <TableHead>변경 사유</TableHead>
                      <TableHead className="w-[100px]">승인자</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {frequencyHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Input
                            type="date"
                            value={record.changeDate}
                            onChange={(e) => updateHistoryRecord(record.id, "changeDate", e.target.value)}
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={record.processName}
                            onChange={(e) => updateHistoryRecord(record.id, "processName", e.target.value)}
                            placeholder="프로세스명"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={record.previousFrequency}
                            onValueChange={(v) => updateHistoryRecord(record.id, "previousFrequency", v)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyOptions.map((f) => (
                                <SelectItem key={f} value={f}>{f}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={record.newFrequency}
                            onValueChange={(v) => updateHistoryRecord(record.id, "newFrequency", v)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyOptions.map((f) => (
                                <SelectItem key={f} value={f}>{f}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={record.reason}
                            onChange={(e) => updateHistoryRecord(record.id, "reason", e.target.value)}
                            placeholder="변경 사유"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={record.approvedBy}
                            onChange={(e) => updateHistoryRecord(record.id, "approvedBy", e.target.value)}
                            placeholder="승인자"
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHistoryRecord(record.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* History Summary */}
              {frequencyHistory.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">변경 현황 요약</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">총 변경 건수: </span>
                      <span className="font-medium">{frequencyHistory.length}건</span>
                    </div>
                    <div>
                      <span className="text-red-600">빈도 강화: </span>
                      <span className="font-medium">
                        {frequencyHistory.filter((h) => {
                          const order = { "연간": 1, "반기": 2, "분기": 3, "월간": 4 };
                          return (order[h.newFrequency as keyof typeof order] || 0) > (order[h.previousFrequency as keyof typeof order] || 0);
                        }).length}건
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600">빈도 완화: </span>
                      <span className="font-medium">
                        {frequencyHistory.filter((h) => {
                          const order = { "연간": 1, "반기": 2, "분기": 3, "월간": 4 };
                          return (order[h.newFrequency as keyof typeof order] || 0) < (order[h.previousFrequency as keyof typeof order] || 0);
                        }).length}건
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
