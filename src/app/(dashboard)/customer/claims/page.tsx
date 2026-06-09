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
import { Plus, TrendingDown, BarChart } from "lucide-react";

interface ClaimAnalysis {
  id: number;
  period: string;
  claimType: string;
  vehicleType: string;
  partName: string;
  defectDescription: string;
  qty: number;
  ppm: number;
  csIndex: number;
  rsIndex: number;
  analysisResult: string;
  countermeasure: string;
}

const initialData: ClaimAnalysis[] = [
  {
    id: 1,
    period: "2026-05",
    claimType: "3M클레임",
    vehicleType: "아반떼",
    partName: "도어트림",
    defectDescription: "조립불량으로 인한 이음 발생",
    qty: 5,
    ppm: 25,
    csIndex: 98.5,
    rsIndex: 97.2,
    analysisResult: "작업자 숙련도 부족",
    countermeasure: "작업표준 교육 강화",
  },
  {
    id: 2,
    period: "2026-05",
    claimType: "필드클레임",
    vehicleType: "소나타",
    partName: "센터콘솔",
    defectDescription: "장기사용 후 표면 박리",
    qty: 12,
    ppm: 45,
    csIndex: 96.8,
    rsIndex: 95.5,
    analysisResult: "원자재 내구성 미흡",
    countermeasure: "원자재 사양 변경 검토",
  },
];

const claimTypeOptions = ["3M클레임", "필드클레임"];

export default function ClaimAnalysisPage() {
  const [claims, setClaims] = useState<ClaimAnalysis[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    period: "",
    claimType: "3M클레임",
    vehicleType: "",
    partName: "",
    defectDescription: "",
    qty: "",
    ppm: "",
    csIndex: "",
    rsIndex: "",
    analysisResult: "",
    countermeasure: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: ClaimAnalysis = {
      id: claims.length + 1,
      period: formData.period,
      claimType: formData.claimType,
      vehicleType: formData.vehicleType,
      partName: formData.partName,
      defectDescription: formData.defectDescription,
      qty: Number(formData.qty),
      ppm: Number(formData.ppm),
      csIndex: Number(formData.csIndex),
      rsIndex: Number(formData.rsIndex),
      analysisResult: formData.analysisResult,
      countermeasure: formData.countermeasure,
    };
    setClaims([...claims, newClaim]);
    setShowForm(false);
    setFormData({
      period: "",
      claimType: "3M클레임",
      vehicleType: "",
      partName: "",
      defectDescription: "",
      qty: "",
      ppm: "",
      csIndex: "",
      rsIndex: "",
      analysisResult: "",
      countermeasure: "",
    });
  };

  const getClaimTypeBadge = (claimType: string) => {
    const variants: Record<string, "default" | "warning"> = {
      "3M클레임": "warning",
      "필드클레임": "default",
    };
    return <Badge variant={variants[claimType] || "secondary"}>{claimType}</Badge>;
  };

  const getPpmColor = (ppm: number) => {
    if (ppm <= 20) return "text-green-600";
    if (ppm <= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">클레임분석</h1>
          <p className="text-muted-foreground">필드클레임 고품분석 및 CS/RS 지수관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          클레임 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              클레임 분석 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">기간</Label>
                  <Input
                    id="period"
                    type="month"
                    value={formData.period}
                    onChange={(e) =>
                      setFormData({ ...formData, period: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimType">클레임유형</Label>
                  <Select
                    value={formData.claimType}
                    onValueChange={(value) => setFormData({ ...formData, claimType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {claimTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">차종</Label>
                  <Input
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                    placeholder="예: 아반떼"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partName">부품명</Label>
                  <Input
                    id="partName"
                    value={formData.partName}
                    onChange={(e) =>
                      setFormData({ ...formData, partName: e.target.value })
                    }
                    placeholder="예: 도어트림"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defectDescription">불량내용</Label>
                <Textarea
                  id="defectDescription"
                  value={formData.defectDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, defectDescription: e.target.value })
                  }
                  placeholder="불량 현상을 상세히 입력하세요"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">수량</Label>
                  <Input
                    id="qty"
                    type="number"
                    min="0"
                    value={formData.qty}
                    onChange={(e) =>
                      setFormData({ ...formData, qty: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ppm">PPM</Label>
                  <Input
                    id="ppm"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.ppm}
                    onChange={(e) =>
                      setFormData({ ...formData, ppm: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="csIndex">CS지수</Label>
                  <Input
                    id="csIndex"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.csIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, csIndex: e.target.value })
                    }
                    placeholder="0-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rsIndex">RS지수</Label>
                  <Input
                    id="rsIndex"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.rsIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, rsIndex: e.target.value })
                    }
                    placeholder="0-100"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="analysisResult">분석결과</Label>
                  <Textarea
                    id="analysisResult"
                    value={formData.analysisResult}
                    onChange={(e) =>
                      setFormData({ ...formData, analysisResult: e.target.value })
                    }
                    placeholder="원인 분석 결과를 입력하세요"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countermeasure">대책</Label>
                  <Textarea
                    id="countermeasure"
                    value={formData.countermeasure}
                    onChange={(e) =>
                      setFormData({ ...formData, countermeasure: e.target.value })
                    }
                    placeholder="시정/예방 대책을 입력하세요"
                    rows={2}
                  />
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
            <BarChart className="h-5 w-5" />
            클레임분석 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <p className="text-muted-foreground">등록된 클레임이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기간</TableHead>
                  <TableHead>클레임유형</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>불량내용</TableHead>
                  <TableHead>수량</TableHead>
                  <TableHead>PPM</TableHead>
                  <TableHead>CS지수</TableHead>
                  <TableHead>RS지수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {claim.period}
                    </TableCell>
                    <TableCell>{getClaimTypeBadge(claim.claimType)}</TableCell>
                    <TableCell>{claim.vehicleType}</TableCell>
                    <TableCell>{claim.partName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {claim.defectDescription}
                    </TableCell>
                    <TableCell>{claim.qty}</TableCell>
                    <TableCell className={getPpmColor(claim.ppm)}>
                      {claim.ppm}
                    </TableCell>
                    <TableCell>{claim.csIndex}%</TableCell>
                    <TableCell>{claim.rsIndex}%</TableCell>
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
