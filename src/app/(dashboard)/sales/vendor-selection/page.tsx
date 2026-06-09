"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Building2, CheckCircle } from "lucide-react";

interface VendorSelection {
  id: number;
  selectionDate: string;
  vehicleType: string;
  partName: string;
  candidateVendors: string;
  evaluationCriteria: string;
  scores: string;
  selectedVendor: string;
  reason: string;
  approver: string;
}

const initialData: VendorSelection[] = [
  {
    id: 1,
    selectionDate: "2026-05-15",
    vehicleType: "아반떼 CN7",
    partName: "도어트림 원단",
    candidateVendors: "A사, B사, C사",
    evaluationCriteria: "품질(40%), 가격(30%), 납기(20%), 기술력(10%)",
    scores: "A사: 85점, B사: 78점, C사: 82점",
    selectedVendor: "A사",
    reason: "품질 및 기술력 우수, 기존 거래 실적 양호",
    approver: "구매부장",
  },
  {
    id: 2,
    selectionDate: "2026-06-01",
    vehicleType: "소나타 DN8",
    partName: "사출 원자재",
    candidateVendors: "X사, Y사",
    evaluationCriteria: "품질(35%), 가격(35%), 납기(20%), 인증(10%)",
    scores: "X사: 88점, Y사: 91점",
    selectedVendor: "Y사",
    reason: "가격경쟁력 우수, IATF 인증 보유",
    approver: "구매부장",
  },
];

export default function VendorSelectionPage() {
  const [vendors, setVendors] = useState<VendorSelection[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    selectionDate: "",
    vehicleType: "",
    partName: "",
    candidateVendors: "",
    evaluationCriteria: "",
    scores: "",
    selectedVendor: "",
    reason: "",
    approver: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor: VendorSelection = {
      id: vendors.length + 1,
      ...formData,
    };
    setVendors([...vendors, newVendor]);
    setShowForm(false);
    setFormData({
      selectionDate: "",
      vehicleType: "",
      partName: "",
      candidateVendors: "",
      evaluationCriteria: "",
      scores: "",
      selectedVendor: "",
      reason: "",
      approver: "",
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">업체선정</h1>
          <p className="text-muted-foreground">업체선정보고서 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          업체선정 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              업체선정보고서 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selectionDate">선정일자</Label>
                  <Input
                    id="selectionDate"
                    type="date"
                    value={formData.selectionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, selectionDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">차종</Label>
                  <Input
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleType: e.target.value })
                    }
                    placeholder="예: 아반떼 CN7"
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
                    placeholder="예: 도어트림 원단"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidateVendors">후보업체</Label>
                <Input
                  id="candidateVendors"
                  value={formData.candidateVendors}
                  onChange={(e) =>
                    setFormData({ ...formData, candidateVendors: e.target.value })
                  }
                  placeholder="예: A사, B사, C사"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evaluationCriteria">평가기준</Label>
                <Textarea
                  id="evaluationCriteria"
                  value={formData.evaluationCriteria}
                  onChange={(e) =>
                    setFormData({ ...formData, evaluationCriteria: e.target.value })
                  }
                  placeholder="예: 품질(40%), 가격(30%), 납기(20%), 기술력(10%)"
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scores">평가점수</Label>
                <Textarea
                  id="scores"
                  value={formData.scores}
                  onChange={(e) =>
                    setFormData({ ...formData, scores: e.target.value })
                  }
                  placeholder="예: A사: 85점, B사: 78점, C사: 82점"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selectedVendor">선정업체</Label>
                  <Input
                    id="selectedVendor"
                    value={formData.selectedVendor}
                    onChange={(e) =>
                      setFormData({ ...formData, selectedVendor: e.target.value })
                    }
                    placeholder="선정된 업체명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approver">승인자</Label>
                  <Input
                    id="approver"
                    value={formData.approver}
                    onChange={(e) =>
                      setFormData({ ...formData, approver: e.target.value })
                    }
                    placeholder="예: 구매부장"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">선정사유</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="업체 선정 사유를 입력하세요"
                  rows={2}
                  required
                />
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
            <CheckCircle className="h-5 w-5" />
            업체선정 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <p className="text-muted-foreground">등록된 업체선정 보고서가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>선정일자</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>후보업체</TableHead>
                  <TableHead>선정업체</TableHead>
                  <TableHead>선정사유</TableHead>
                  <TableHead>승인자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(vendor.selectionDate)}
                    </TableCell>
                    <TableCell>{vendor.vehicleType}</TableCell>
                    <TableCell>{vendor.partName}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {vendor.candidateVendors}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{vendor.selectedVendor}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {vendor.reason}
                    </TableCell>
                    <TableCell>{vendor.approver}</TableCell>
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
