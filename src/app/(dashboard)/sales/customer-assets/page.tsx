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
import { Plus, Package, ClipboardList } from "lucide-react";

interface CustomerAsset {
  id: number;
  assetNo: string;
  assetType: string;
  assetName: string;
  customer: string;
  receiptDate: string;
  returnDueDate: string;
  location: string;
  condition: string;
  status: string;
}

const initialData: CustomerAsset[] = [
  {
    id: 1,
    assetNo: "CA-2026-001",
    assetType: "금형",
    assetName: "도어트림 사출금형 #1",
    customer: "현대자동차",
    receiptDate: "2025-01-15",
    returnDueDate: "2030-01-15",
    location: "금형보관소 A구역",
    condition: "양호",
    status: "보관중",
  },
  {
    id: 2,
    assetNo: "CA-2026-002",
    assetType: "검사구",
    assetName: "센터콘솔 검사구",
    customer: "기아자동차",
    receiptDate: "2025-06-01",
    returnDueDate: "2028-06-01",
    location: "품질검사실",
    condition: "양호",
    status: "사용중",
  },
  {
    id: 3,
    assetNo: "CA-2026-003",
    assetType: "치구",
    assetName: "조립치구 SET",
    customer: "현대자동차",
    receiptDate: "2024-03-10",
    returnDueDate: "2027-03-10",
    location: "생산라인 B",
    condition: "수리필요",
    status: "사용중",
  },
];

const assetTypeOptions = ["금형", "검사구", "치구", "측정기", "시험장비", "기타"];
const conditionOptions = ["양호", "보통", "수리필요", "불량"];
const statusOptions = ["보관중", "사용중", "수리중", "반납완료"];

export default function CustomerAssetsPage() {
  const [assets, setAssets] = useState<CustomerAsset[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetNo: "",
    assetType: "금형",
    assetName: "",
    customer: "",
    receiptDate: "",
    returnDueDate: "",
    location: "",
    condition: "양호",
    status: "보관중",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: CustomerAsset = {
      id: assets.length + 1,
      ...formData,
    };
    setAssets([...assets, newAsset]);
    setShowForm(false);
    setFormData({
      assetNo: "",
      assetType: "금형",
      assetName: "",
      customer: "",
      receiptDate: "",
      returnDueDate: "",
      location: "",
      condition: "양호",
      status: "보관중",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning"> = {
      보관중: "secondary",
      사용중: "default",
      수리중: "warning",
      반납완료: "success",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, "success" | "secondary" | "warning" | "destructive"> = {
      양호: "success",
      보통: "secondary",
      수리필요: "warning",
      불량: "destructive",
    };
    return <Badge variant={variants[condition] || "secondary"}>{condition}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">고객재산관리</h1>
          <p className="text-muted-foreground">대여자산관리대장 (고객사)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          자산 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              고객재산 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetNo">자산번호</Label>
                  <Input
                    id="assetNo"
                    value={formData.assetNo}
                    onChange={(e) =>
                      setFormData({ ...formData, assetNo: e.target.value })
                    }
                    placeholder="예: CA-2026-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetType">자산유형</Label>
                  <Select
                    value={formData.assetType}
                    onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assetName">자산명</Label>
                  <Input
                    id="assetName"
                    value={formData.assetName}
                    onChange={(e) =>
                      setFormData({ ...formData, assetName: e.target.value })
                    }
                    placeholder="예: 도어트림 사출금형 #1"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">고객사</Label>
                  <Input
                    id="customer"
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    placeholder="예: 현대자동차"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiptDate">입고일자</Label>
                  <Input
                    id="receiptDate"
                    type="date"
                    value={formData.receiptDate}
                    onChange={(e) =>
                      setFormData({ ...formData, receiptDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDueDate">반납예정일</Label>
                  <Input
                    id="returnDueDate"
                    type="date"
                    value={formData.returnDueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, returnDueDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">보관위치</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="예: 금형보관소 A구역"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">상태</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((cond) => (
                        <SelectItem key={cond} value={cond}>
                          {cond}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">관리상태</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="관리상태 선택" />
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
            <ClipboardList className="h-5 w-5" />
            고객재산 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p className="text-muted-foreground">등록된 고객재산이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>자산번호</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>자산명</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>입고일</TableHead>
                  <TableHead>반납예정일</TableHead>
                  <TableHead>보관위치</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>관리상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetNo}</TableCell>
                    <TableCell>{asset.assetType}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {asset.assetName}
                    </TableCell>
                    <TableCell>{asset.customer}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(asset.receiptDate)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(asset.returnDueDate)}
                    </TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
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
