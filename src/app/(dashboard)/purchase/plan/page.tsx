"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Save } from "lucide-react";

interface PurchasePlan {
  id: number;
  period: string;
  itemCategory: string;
  itemName: string;
  plannedQty: number;
  plannedAmount: number;
  actualQty: number;
  actualAmount: number;
  variance: number;
  supplier: string;
  status: string;
}

export default function PurchasePlanPage() {
  const [plans, setPlans] = useState<PurchasePlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    period: "",
    itemCategory: "",
    itemName: "",
    plannedQty: "",
    plannedAmount: "",
    actualQty: "",
    actualAmount: "",
    supplier: "",
    status: "",
  });

  const calculateVariance = () => {
    const planned = parseFloat(formData.plannedAmount) || 0;
    const actual = parseFloat(formData.actualAmount) || 0;
    if (planned === 0) return 0;
    return ((actual - planned) / planned * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variance = calculateVariance();
    const newPlan: PurchasePlan = {
      id: Date.now(),
      period: formData.period,
      itemCategory: formData.itemCategory,
      itemName: formData.itemName,
      plannedQty: parseFloat(formData.plannedQty) || 0,
      plannedAmount: parseFloat(formData.plannedAmount) || 0,
      actualQty: parseFloat(formData.actualQty) || 0,
      actualAmount: parseFloat(formData.actualAmount) || 0,
      variance,
      supplier: formData.supplier,
      status: formData.status,
    };
    setPlans([newPlan, ...plans]);
    setShowForm(false);
    setFormData({
      period: "",
      itemCategory: "",
      itemName: "",
      plannedQty: "",
      plannedAmount: "",
      actualQty: "",
      actualAmount: "",
      supplier: "",
      status: "",
    });
    alert("구매계획이 저장되었습니다.");
  };

  const statusColors: Record<string, string> = {
    "계획": "bg-blue-100 text-blue-800",
    "진행중": "bg-yellow-100 text-yellow-800",
    "완료": "bg-green-100 text-green-800",
    "지연": "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">구매계획</h1>
          <p className="text-muted-foreground">연간/월간 구매 계획 및 실적 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          계획 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>구매계획 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>기간 *</Label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="예: 2026-06"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품목분류 *</Label>
                  <Select value={formData.itemCategory} onValueChange={(v) => setFormData({ ...formData, itemCategory: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="원자재">원자재</SelectItem>
                      <SelectItem value="부자재">부자재</SelectItem>
                      <SelectItem value="설비">설비</SelectItem>
                      <SelectItem value="소모품">소모품</SelectItem>
                      <SelectItem value="외주가공">외주가공</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>품목명 *</Label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="품목명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>공급업체</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="공급업체명"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>계획수량</Label>
                  <Input
                    type="number"
                    value={formData.plannedQty}
                    onChange={(e) => setFormData({ ...formData, plannedQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>계획금액 (원)</Label>
                  <Input
                    type="number"
                    value={formData.plannedAmount}
                    onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>실적수량</Label>
                  <Input
                    type="number"
                    value={formData.actualQty}
                    onChange={(e) => setFormData({ ...formData, actualQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>실적금액 (원)</Label>
                  <Input
                    type="number"
                    value={formData.actualAmount}
                    onChange={(e) => setFormData({ ...formData, actualAmount: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>차이율 (%)</Label>
                  <Input
                    value={calculateVariance().toFixed(1)}
                    disabled
                    className="bg-muted font-bold"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="계획">계획</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                      <SelectItem value="지연">지연</SelectItem>
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
            <ClipboardList className="h-5 w-5" />
            구매계획 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 구매계획이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기간</TableHead>
                  <TableHead>품목분류</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead className="text-right">계획수량</TableHead>
                  <TableHead className="text-right">계획금액</TableHead>
                  <TableHead className="text-right">실적수량</TableHead>
                  <TableHead className="text-right">실적금액</TableHead>
                  <TableHead className="text-right">차이율</TableHead>
                  <TableHead>공급업체</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-mono">{plan.period}</TableCell>
                    <TableCell>{plan.itemCategory}</TableCell>
                    <TableCell className="font-medium">{plan.itemName}</TableCell>
                    <TableCell className="text-right font-mono">{plan.plannedQty.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{plan.plannedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{plan.actualQty.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{plan.actualAmount.toLocaleString()}</TableCell>
                    <TableCell className={`text-right font-mono ${plan.variance > 0 ? "text-red-600" : plan.variance < 0 ? "text-green-600" : ""}`}>
                      {plan.variance > 0 ? "+" : ""}{plan.variance.toFixed(1)}%
                    </TableCell>
                    <TableCell>{plan.supplier || "-"}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[plan.status] || "bg-gray-100"}>
                        {plan.status}
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
