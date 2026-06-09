"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Save } from "lucide-react";

interface SupplierSurvey {
  id: number;
  surveyDate: string;
  supplierCode: string;
  supplierName: string;
  representative: string;
  businessType: string;
  employees: number;
  revenue: number;
  qualityCertification: string;
  majorCustomers: string;
  facilities: string;
  financialStatus: string;
  result: string;
}

export default function SupplierSurveyPage() {
  const [surveys, setSurveys] = useState<SupplierSurvey[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    surveyDate: new Date().toISOString().split("T")[0],
    supplierCode: "",
    supplierName: "",
    representative: "",
    businessType: "",
    employees: "",
    revenue: "",
    qualityCertification: "",
    majorCustomers: "",
    facilities: "",
    financialStatus: "",
    result: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: SupplierSurvey = {
      id: Date.now(),
      surveyDate: formData.surveyDate,
      supplierCode: formData.supplierCode,
      supplierName: formData.supplierName,
      representative: formData.representative,
      businessType: formData.businessType,
      employees: parseInt(formData.employees) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      qualityCertification: formData.qualityCertification,
      majorCustomers: formData.majorCustomers,
      facilities: formData.facilities,
      financialStatus: formData.financialStatus,
      result: formData.result,
    };
    setSurveys([newSurvey, ...surveys]);
    setShowForm(false);
    setFormData({
      surveyDate: new Date().toISOString().split("T")[0],
      supplierCode: "",
      supplierName: "",
      representative: "",
      businessType: "",
      employees: "",
      revenue: "",
      qualityCertification: "",
      majorCustomers: "",
      facilities: "",
      financialStatus: "",
      result: "",
    });
    alert("업체실태조사가 저장되었습니다.");
  };

  const resultColors: Record<string, string> = {
    "적합": "bg-green-100 text-green-800",
    "조건부": "bg-yellow-100 text-yellow-800",
    "부적합": "bg-red-100 text-red-800",
  };

  const certColors: Record<string, string> = {
    "IATF16949": "bg-blue-100 text-blue-800",
    "ISO9001": "bg-purple-100 text-purple-800",
    "없음": "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">업체실태조사</h1>
          <p className="text-muted-foreground">협력업체 실태현황조사서 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          조사 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>업체실태조사 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>조사일자 *</Label>
                  <Input
                    type="date"
                    value={formData.surveyDate}
                    onChange={(e) => setFormData({ ...formData, surveyDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>업체코드 *</Label>
                  <Input
                    value={formData.supplierCode}
                    onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                    placeholder="업체코드"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>업체명 *</Label>
                  <Input
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="업체명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>대표자</Label>
                  <Input
                    value={formData.representative}
                    onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                    placeholder="대표자명"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>업종</Label>
                  <Input
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    placeholder="예: 자동차부품 제조"
                  />
                </div>
                <div className="space-y-2">
                  <Label>종업원수 (명)</Label>
                  <Input
                    type="number"
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>매출액 (억원)</Label>
                  <Input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>품질인증</Label>
                  <Select value={formData.qualityCertification} onValueChange={(v) => setFormData({ ...formData, qualityCertification: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IATF16949">IATF16949</SelectItem>
                      <SelectItem value="ISO9001">ISO9001</SelectItem>
                      <SelectItem value="없음">없음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>주요 거래처</Label>
                  <Input
                    value={formData.majorCustomers}
                    onChange={(e) => setFormData({ ...formData, majorCustomers: e.target.value })}
                    placeholder="주요 거래처 (쉼표로 구분)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비현황</Label>
                  <Input
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    placeholder="주요 설비 현황"
                  />
                </div>
                <div className="space-y-2">
                  <Label>재무상태</Label>
                  <Select value={formData.financialStatus} onValueChange={(v) => setFormData({ ...formData, financialStatus: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="양호">양호</SelectItem>
                      <SelectItem value="보통">보통</SelectItem>
                      <SelectItem value="주의">주의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>조사결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="적합">적합</SelectItem>
                      <SelectItem value="조건부">조건부</SelectItem>
                      <SelectItem value="부적합">부적합</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>취소</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            업체실태조사 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {surveys.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 조사 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>조사일자</TableHead>
                  <TableHead>업체코드</TableHead>
                  <TableHead>업체명</TableHead>
                  <TableHead>대표자</TableHead>
                  <TableHead>업종</TableHead>
                  <TableHead className="text-right">종업원수</TableHead>
                  <TableHead className="text-right">매출액</TableHead>
                  <TableHead>품질인증</TableHead>
                  <TableHead>재무상태</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell>{survey.surveyDate}</TableCell>
                    <TableCell className="font-mono">{survey.supplierCode}</TableCell>
                    <TableCell className="font-medium">{survey.supplierName}</TableCell>
                    <TableCell>{survey.representative || "-"}</TableCell>
                    <TableCell>{survey.businessType || "-"}</TableCell>
                    <TableCell className="text-right font-mono">{survey.employees.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{survey.revenue}억</TableCell>
                    <TableCell>
                      {survey.qualityCertification && (
                        <Badge className={certColors[survey.qualityCertification] || "bg-gray-100"}>
                          {survey.qualityCertification}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{survey.financialStatus || "-"}</TableCell>
                    <TableCell>
                      <Badge className={resultColors[survey.result] || "bg-gray-100"}>
                        {survey.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
