"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Target, TrendingUp } from "lucide-react";

interface BusinessPlanItem {
  id: number;
  year: number;
  department: string;
  targetType: string;
  targetValue: number;
  actualValue: number;
  achievementRate: number;
  status: string;
}

const initialData: BusinessPlanItem[] = [
  {
    id: 1,
    year: 2026,
    department: "영업부",
    targetType: "매출액",
    targetValue: 100000000,
    actualValue: 95000000,
    achievementRate: 95.0,
    status: "진행중",
  },
  {
    id: 2,
    year: 2026,
    department: "경영지원부",
    targetType: "영업이익",
    targetValue: 15000000,
    actualValue: 14500000,
    achievementRate: 96.7,
    status: "진행중",
  },
  {
    id: 3,
    year: 2026,
    department: "인사부",
    targetType: "인원충족성",
    targetValue: 100,
    actualValue: 95,
    achievementRate: 95.0,
    status: "진행중",
  },
];

const targetTypes = ["매출액", "영업이익", "경상이익", "순이익", "인원충족성"];
const departments = ["경영지원부", "영업부", "생산부", "품질부", "인사부", "구매부"];
const statusOptions = ["계획", "진행중", "완료", "미달성"];

export default function BusinessPlanPage() {
  const [items, setItems] = useState<BusinessPlanItem[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    department: "",
    targetType: "",
    targetValue: 0,
    actualValue: 0,
    status: "계획",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const achievementRate =
      formData.targetValue > 0
        ? parseFloat(((formData.actualValue / formData.targetValue) * 100).toFixed(1))
        : 0;

    const newItem: BusinessPlanItem = {
      id: items.length + 1,
      ...formData,
      achievementRate,
    };
    setItems([...items, newItem]);
    setShowForm(false);
    setFormData({
      year: new Date().getFullYear(),
      department: "",
      targetType: "",
      targetValue: 0,
      actualValue: 0,
      status: "계획",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      계획: "secondary",
      진행중: "default",
      완료: "success",
      미달성: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return "text-green-600 font-semibold";
    if (rate >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (value: number, type: string) => {
    if (type === "인원충족성") return `${value}%`;
    return new Intl.NumberFormat("ko-KR").format(value) + "원";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">사업계획</h1>
          <p className="text-muted-foreground">
            연간 사업계획 및 KPI 목표 관리 (매출액달성율, 영업이익달성율, 경상이익달성율, 순이익달성율)
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          계획 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              사업계획 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">연도</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetType">목표 유형</Label>
                  <Select
                    value={formData.targetType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetType: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="목표 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">목표값</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) =>
                      setFormData({ ...formData, targetValue: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualValue">실적값</Label>
                  <Input
                    id="actualValue"
                    type="number"
                    value={formData.actualValue}
                    onChange={(e) =>
                      setFormData({ ...formData, actualValue: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
                <Button type="submit">등록</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            사업계획 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground">등록된 사업계획이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>연도</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>목표유형</TableHead>
                  <TableHead className="text-right">목표값</TableHead>
                  <TableHead className="text-right">실적값</TableHead>
                  <TableHead className="text-right">달성율</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.year}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.targetType}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.targetValue, item.targetType)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.actualValue, item.targetType)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${getAchievementColor(item.achievementRate)}`}
                    >
                      {item.achievementRate}%
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
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
