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
import { Plus, FileText, ClipboardList } from "lucide-react";

interface HousekeepingStandard {
  id: number;
  documentNo: string;
  documentType: string;
  area: string;
  description: string;
  revision: string;
  effectiveDate: string;
  status: string;
}

const initialData: HousekeepingStandard[] = [
  {
    id: 1,
    documentNo: "3J5H-ORG-001",
    documentType: "조직도",
    area: "전사",
    description: "3정5행 추진조직도 및 역할분장",
    revision: "Rev.3",
    effectiveDate: "2026-01-01",
    status: "유효",
  },
  {
    id: 2,
    documentNo: "3J5H-MAP-001",
    documentType: "구역도",
    area: "생산동 1층",
    description: "생산라인 구역 배치도 및 책임구역",
    revision: "Rev.2",
    effectiveDate: "2026-03-01",
    status: "유효",
  },
  {
    id: 3,
    documentNo: "3J5H-STD-001",
    documentType: "관리기준",
    area: "전 구역",
    description: "3정5행 평가기준 및 점검항목",
    revision: "Rev.4",
    effectiveDate: "2026-02-15",
    status: "유효",
  },
  {
    id: 4,
    documentNo: "3J5H-MAP-002",
    documentType: "구역도",
    area: "사무동",
    description: "사무실 구역 배치도",
    revision: "Rev.1",
    effectiveDate: "2025-06-01",
    status: "개정중",
  },
];

const documentTypeOptions = ["조직도", "구역도", "관리기준"];
const statusOptions = ["유효", "개정중", "폐기"];

export default function HousekeepingStandardsPage() {
  const [standards, setStandards] = useState<HousekeepingStandard[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    documentNo: "",
    documentType: "조직도",
    area: "",
    description: "",
    revision: "",
    effectiveDate: "",
    status: "유효",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStandard: HousekeepingStandard = {
      id: standards.length + 1,
      ...formData,
    };
    setStandards([...standards, newStandard]);
    setShowForm(false);
    setFormData({
      documentNo: "",
      documentType: "조직도",
      area: "",
      description: "",
      revision: "",
      effectiveDate: "",
      status: "유효",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "destructive"> = {
      유효: "success",
      개정중: "warning",
      폐기: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getDocTypeBadge = (docType: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      조직도: "default",
      구역도: "secondary",
      관리기준: "outline",
    };
    return <Badge variant={variants[docType] || "secondary"}>{docType}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">3정5행 관리기준</h1>
          <p className="text-muted-foreground">조직도, 구역도 및 관리기준 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          문서 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              3정5행 문서 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentNo">문서번호</Label>
                  <Input
                    id="documentNo"
                    value={formData.documentNo}
                    onChange={(e) =>
                      setFormData({ ...formData, documentNo: e.target.value })
                    }
                    placeholder="예: 3J5H-ORG-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentType">문서유형</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">대상구역</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    placeholder="예: 생산동 1층"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">문서설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="문서 내용 및 목적을 입력하세요"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revision">개정번호</Label>
                  <Input
                    id="revision"
                    value={formData.revision}
                    onChange={(e) =>
                      setFormData({ ...formData, revision: e.target.value })
                    }
                    placeholder="예: Rev.1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">시행일자</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) =>
                      setFormData({ ...formData, effectiveDate: e.target.value })
                    }
                    required
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
            <ClipboardList className="h-5 w-5" />
            3정5행 문서 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {standards.length === 0 ? (
            <p className="text-muted-foreground">등록된 문서가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>문서번호</TableHead>
                  <TableHead>문서유형</TableHead>
                  <TableHead>대상구역</TableHead>
                  <TableHead>문서설명</TableHead>
                  <TableHead>개정번호</TableHead>
                  <TableHead>시행일자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standards.map((standard) => (
                  <TableRow key={standard.id}>
                    <TableCell className="font-medium">{standard.documentNo}</TableCell>
                    <TableCell>{getDocTypeBadge(standard.documentType)}</TableCell>
                    <TableCell>{standard.area}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {standard.description}
                    </TableCell>
                    <TableCell>{standard.revision}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(standard.effectiveDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(standard.status)}</TableCell>
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
