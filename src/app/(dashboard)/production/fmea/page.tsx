"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Save, Trash2, BarChart3, FileText } from "lucide-react";

interface FmeaItem {
  id: number;
  processFunction: string; // 공정/기능
  potentialFailureMode: string; // 잠재적고장형태
  potentialEffects: string; // 잠재적영향
  severity: number; // 심각도 S (1-10)
  potentialCauses: string; // 잠재적원인
  occurrence: number; // 발생도 O (1-10)
  currentControls: string; // 현검출관리
  detection: number; // 검출도 D (1-10)
  rpn: number; // RPN (S*O*D)
  recommendedActions: string; // 권고조치사항
  responsible: string; // 담당자
  targetDate: string; // 완료일
  actionResults: string; // 조치결과
  actionSeverity: number; // 조치후 S
  actionOccurrence: number; // 조치후 O
  actionDetection: number; // 조치후 D
  actionRpn: number; // 조치후 RPN
}

interface HeaderInfo {
  vehicleType: string; // 차종
  processName: string; // 공정명
  fmeaNumber: string; // FMEA번호
  createdDate: string; // 작성일
  revision: string; // 개정번호
  preparedBy: string; // 작성자
  approvedBy: string; // 승인자
  approvalDate: string; // 승인일
}

export default function FmeaPage() {
  const [activeTab, setActiveTab] = useState("header");

  // Header Info State
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    vehicleType: "",
    processName: "",
    fmeaNumber: "",
    createdDate: "",
    revision: "",
    preparedBy: "",
    approvedBy: "",
    approvalDate: "",
  });

  // FMEA Items State
  const [fmeaItems, setFmeaItems] = useState<FmeaItem[]>([]);

  // Calculate RPN
  const calculateRpn = (s: number, o: number, d: number): number => {
    return s * o * d;
  };

  // Add new FMEA item
  const addFmeaItem = () => {
    const newItem: FmeaItem = {
      id: Date.now(),
      processFunction: "",
      potentialFailureMode: "",
      potentialEffects: "",
      severity: 1,
      potentialCauses: "",
      occurrence: 1,
      currentControls: "",
      detection: 1,
      rpn: 1,
      recommendedActions: "",
      responsible: "",
      targetDate: "",
      actionResults: "",
      actionSeverity: 1,
      actionOccurrence: 1,
      actionDetection: 1,
      actionRpn: 1,
    };
    setFmeaItems([...fmeaItems, newItem]);
  };

  // Remove FMEA item
  const removeFmeaItem = (id: number) => {
    setFmeaItems(fmeaItems.filter((item) => item.id !== id));
  };

  // Update FMEA item
  const updateFmeaItem = (id: number, field: keyof FmeaItem, value: string | number) => {
    setFmeaItems(
      fmeaItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Auto-calculate RPN when S, O, or D changes
          if (field === "severity" || field === "occurrence" || field === "detection") {
            updated.rpn = calculateRpn(
              field === "severity" ? Number(value) : updated.severity,
              field === "occurrence" ? Number(value) : updated.occurrence,
              field === "detection" ? Number(value) : updated.detection
            );
          }
          // Auto-calculate Action RPN
          if (field === "actionSeverity" || field === "actionOccurrence" || field === "actionDetection") {
            updated.actionRpn = calculateRpn(
              field === "actionSeverity" ? Number(value) : updated.actionSeverity,
              field === "actionOccurrence" ? Number(value) : updated.actionOccurrence,
              field === "actionDetection" ? Number(value) : updated.actionDetection
            );
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Get RPN badge variant
  const getRpnVariant = (rpn: number): "error" | "warning" | "success" | "outline" => {
    if (rpn >= 100) return "error";
    if (rpn >= 50) return "warning";
    return "success";
  };

  // Statistics calculations
  const getStatistics = () => {
    if (fmeaItems.length === 0) {
      return {
        totalItems: 0,
        avgRpn: 0,
        maxRpn: 0,
        minRpn: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        avgSeverity: 0,
        avgOccurrence: 0,
        avgDetection: 0,
        rpnReduction: 0,
      };
    }

    const rpnValues = fmeaItems.map((item) => item.rpn);
    const actionRpnValues = fmeaItems.map((item) => item.actionRpn);
    const totalRpn = rpnValues.reduce((sum, rpn) => sum + rpn, 0);
    const totalActionRpn = actionRpnValues.reduce((sum, rpn) => sum + rpn, 0);

    return {
      totalItems: fmeaItems.length,
      avgRpn: Math.round(totalRpn / fmeaItems.length),
      maxRpn: Math.max(...rpnValues),
      minRpn: Math.min(...rpnValues),
      highRiskCount: fmeaItems.filter((item) => item.rpn >= 100).length,
      mediumRiskCount: fmeaItems.filter((item) => item.rpn >= 50 && item.rpn < 100).length,
      lowRiskCount: fmeaItems.filter((item) => item.rpn < 50).length,
      avgSeverity: Math.round((fmeaItems.reduce((sum, item) => sum + item.severity, 0) / fmeaItems.length) * 10) / 10,
      avgOccurrence: Math.round((fmeaItems.reduce((sum, item) => sum + item.occurrence, 0) / fmeaItems.length) * 10) / 10,
      avgDetection: Math.round((fmeaItems.reduce((sum, item) => sum + item.detection, 0) / fmeaItems.length) * 10) / 10,
      rpnReduction: totalRpn > 0 ? Math.round(((totalRpn - totalActionRpn) / totalRpn) * 100) : 0,
    };
  };

  const stats = getStatistics();

  // Save handler
  const handleSave = () => {
    const data = {
      headerInfo,
      fmeaItems,
    };
    console.log("Saving FMEA:", data);
    alert("FMEA가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" />
            공정FMEA
          </h1>
          <p className="text-muted-foreground">공정 고장모드 영향분석 (Process Failure Mode and Effects Analysis)</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="header">
            <FileText className="mr-2 h-4 w-4" />
            1. 기본정보
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <AlertTriangle className="mr-2 h-4 w-4" />
            2. FMEA 분석
          </TabsTrigger>
          <TabsTrigger value="summary">
            <BarChart3 className="mr-2 h-4 w-4" />
            3. 통계/요약
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Header Information */}
        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FMEA 기본정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>차종 *</Label>
                  <Input
                    value={headerInfo.vehicleType}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, vehicleType: e.target.value })}
                    placeholder="차종명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>공정명 *</Label>
                  <Input
                    value={headerInfo.processName}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, processName: e.target.value })}
                    placeholder="공정명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>FMEA번호 *</Label>
                  <Input
                    value={headerInfo.fmeaNumber}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, fmeaNumber: e.target.value })}
                    placeholder="PFMEA-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>작성일 *</Label>
                  <Input
                    type="date"
                    value={headerInfo.createdDate}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, createdDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>개정번호</Label>
                  <Input
                    value={headerInfo.revision}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, revision: e.target.value })}
                    placeholder="Rev.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>작성자</Label>
                  <Input
                    value={headerInfo.preparedBy}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, preparedBy: e.target.value })}
                    placeholder="작성자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인자</Label>
                  <Input
                    value={headerInfo.approvedBy}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, approvedBy: e.target.value })}
                    placeholder="승인자명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>승인일</Label>
                  <Input
                    type="date"
                    value={headerInfo.approvalDate}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, approvalDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FMEA 평가기준 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">심각도 (Severity) S</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>1-3: 경미한 영향</p>
                    <p>4-6: 보통 영향</p>
                    <p>7-8: 심각한 영향</p>
                    <p>9-10: 매우 심각/치명적</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">발생도 (Occurrence) O</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>1-3: 거의 발생 안함</p>
                    <p>4-6: 가끔 발생</p>
                    <p>7-8: 자주 발생</p>
                    <p>9-10: 매우 자주 발생</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">검출도 (Detection) D</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>1-3: 높은 검출 가능성</p>
                    <p>4-6: 보통 검출 가능성</p>
                    <p>7-8: 낮은 검출 가능성</p>
                    <p>9-10: 검출 거의 불가능</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">RPN (Risk Priority Number) = S x O x D</h4>
                <div className="flex gap-4 text-xs">
                  <Badge variant="error">고위험: RPN 100 이상</Badge>
                  <Badge variant="warning">중위험: RPN 50-99</Badge>
                  <Badge variant="success">저위험: RPN 50 미만</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: FMEA Analysis Table */}
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>FMEA 분석 항목</CardTitle>
              <Button onClick={addFmeaItem}>
                <Plus className="mr-2 h-4 w-4" />
                항목 추가
              </Button>
            </CardHeader>
            <CardContent>
              {fmeaItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 FMEA 항목이 없습니다.</p>
                  <p className="text-sm">항목 추가 버튼을 클릭하여 분석을 시작하세요.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">공정/기능</TableHead>
                        <TableHead className="min-w-[120px]">잠재적고장형태</TableHead>
                        <TableHead className="min-w-[120px]">잠재적영향</TableHead>
                        <TableHead className="text-center w-16">S</TableHead>
                        <TableHead className="min-w-[120px]">잠재적원인</TableHead>
                        <TableHead className="text-center w-16">O</TableHead>
                        <TableHead className="min-w-[120px]">현검출관리</TableHead>
                        <TableHead className="text-center w-16">D</TableHead>
                        <TableHead className="text-center w-20">RPN</TableHead>
                        <TableHead className="min-w-[120px]">권고조치사항</TableHead>
                        <TableHead className="min-w-[80px]">담당자</TableHead>
                        <TableHead className="min-w-[100px]">완료일</TableHead>
                        <TableHead className="min-w-[120px]">조치결과</TableHead>
                        <TableHead className="text-center w-16">S'</TableHead>
                        <TableHead className="text-center w-16">O'</TableHead>
                        <TableHead className="text-center w-16">D'</TableHead>
                        <TableHead className="text-center w-20">RPN'</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fmeaItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.processFunction}
                              onChange={(e) => updateFmeaItem(item.id, "processFunction", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="공정/기능"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.potentialFailureMode}
                              onChange={(e) => updateFmeaItem(item.id, "potentialFailureMode", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="고장형태"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.potentialEffects}
                              onChange={(e) => updateFmeaItem(item.id, "potentialEffects", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="영향"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(item.severity)}
                              onValueChange={(v) => updateFmeaItem(item.id, "severity", Number(v))}
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.potentialCauses}
                              onChange={(e) => updateFmeaItem(item.id, "potentialCauses", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="원인"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(item.occurrence)}
                              onValueChange={(v) => updateFmeaItem(item.id, "occurrence", Number(v))}
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.currentControls}
                              onChange={(e) => updateFmeaItem(item.id, "currentControls", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="검출관리"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(item.detection)}
                              onValueChange={(v) => updateFmeaItem(item.id, "detection", Number(v))}
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getRpnVariant(item.rpn)}>{item.rpn}</Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.recommendedActions}
                              onChange={(e) => updateFmeaItem(item.id, "recommendedActions", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="조치사항"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.responsible}
                              onChange={(e) => updateFmeaItem(item.id, "responsible", e.target.value)}
                              className="h-8 min-w-[60px]"
                              placeholder="담당자"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={item.targetDate}
                              onChange={(e) => updateFmeaItem(item.id, "targetDate", e.target.value)}
                              className="h-8 min-w-[100px]"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.actionResults}
                              onChange={(e) => updateFmeaItem(item.id, "actionResults", e.target.value)}
                              className="h-8 min-w-[100px]"
                              placeholder="조치결과"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(item.actionSeverity)}
                              onValueChange={(v) => updateFmeaItem(item.id, "actionSeverity", Number(v))}
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(item.actionOccurrence)}
                              onValueChange={(v) => updateFmeaItem(item.id, "actionOccurrence", Number(v))}
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={String(item.actionDetection)}
                              onValueChange={(v) => updateFmeaItem(item.id, "actionDetection", Number(v))}
                            >
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <SelectItem key={n} value={String(n)}>
                                    {n}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={getRpnVariant(item.actionRpn)}>{item.actionRpn}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFmeaItem(item.id)}
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
        </TabsContent>

        {/* Tab 3: Summary/Statistics */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 분석 항목</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">평균 RPN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={getRpnVariant(stats.avgRpn)} className="text-lg px-3 py-1">
                    {stats.avgRpn}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">최대 RPN</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <Badge variant={getRpnVariant(stats.maxRpn)} className="text-lg px-3 py-1">
                    {stats.maxRpn}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">RPN 개선율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.rpnReduction}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>위험 수준 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="error">고위험</Badge>
                      <span className="text-sm text-muted-foreground">(RPN 100 이상)</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.highRiskCount}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-red-500 h-4 rounded-full"
                      style={{
                        width: stats.totalItems > 0 ? `${(stats.highRiskCount / stats.totalItems) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">중위험</Badge>
                      <span className="text-sm text-muted-foreground">(RPN 50-99)</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.mediumRiskCount}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-yellow-500 h-4 rounded-full"
                      style={{
                        width: stats.totalItems > 0 ? `${(stats.mediumRiskCount / stats.totalItems) * 100}%` : "0%",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">저위험</Badge>
                      <span className="text-sm text-muted-foreground">(RPN 50 미만)</span>
                    </div>
                    <span className="text-2xl font-bold">{stats.lowRiskCount}건</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width: stats.totalItems > 0 ? `${(stats.lowRiskCount / stats.totalItems) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>평균 평가지수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>평균 심각도 (S)</Label>
                      <span className="text-lg font-bold">{stats.avgSeverity}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${(stats.avgSeverity / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>평균 발생도 (O)</Label>
                      <span className="text-lg font-bold">{stats.avgOccurrence}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full"
                        style={{ width: `${(stats.avgOccurrence / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>평균 검출도 (D)</Label>
                      <span className="text-lg font-bold">{stats.avgDetection}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full"
                        style={{ width: `${(stats.avgDetection / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {fmeaItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>고위험 항목 목록</CardTitle>
              </CardHeader>
              <CardContent>
                {fmeaItems.filter((item) => item.rpn >= 100).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">고위험 항목이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>공정/기능</TableHead>
                        <TableHead>잠재적고장형태</TableHead>
                        <TableHead>잠재적원인</TableHead>
                        <TableHead className="text-center">S</TableHead>
                        <TableHead className="text-center">O</TableHead>
                        <TableHead className="text-center">D</TableHead>
                        <TableHead className="text-center">RPN</TableHead>
                        <TableHead>권고조치사항</TableHead>
                        <TableHead>담당자</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fmeaItems
                        .filter((item) => item.rpn >= 100)
                        .sort((a, b) => b.rpn - a.rpn)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.processFunction || "-"}</TableCell>
                            <TableCell>{item.potentialFailureMode || "-"}</TableCell>
                            <TableCell>{item.potentialCauses || "-"}</TableCell>
                            <TableCell className="text-center">{item.severity}</TableCell>
                            <TableCell className="text-center">{item.occurrence}</TableCell>
                            <TableCell className="text-center">{item.detection}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="error">{item.rpn}</Badge>
                            </TableCell>
                            <TableCell>{item.recommendedActions || "-"}</TableCell>
                            <TableCell>{item.responsible || "-"}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
