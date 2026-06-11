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
import { Plus, AlertCircle, MessageSquareWarning } from "lucide-react";
import { getActiveDefectTypes } from "@/lib/master-data";

interface CustomerComplaint {
  id: number;
  receiptDate: string;
  customer: string;
  complaintType: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  responsiblePerson: string;
  completionDate: string;
  status: string;
}

const initialData: CustomerComplaint[] = [
  {
    id: 1,
    receiptDate: "2026-05-10",
    customer: "현대자동차",
    complaintType: "품질불량",
    description: "부품 외관 스크래치 발생",
    rootCause: "포장 방법 미흡",
    correctiveAction: "포장재 변경 및 작업표준 개정",
    responsiblePerson: "김품질",
    completionDate: "2026-05-20",
    status: "완료",
  },
  {
    id: 2,
    receiptDate: "2026-06-01",
    customer: "기아자동차",
    complaintType: "납기지연",
    description: "주문량 대비 납품 지연 3일",
    rootCause: "설비고장으로 인한 생산차질",
    correctiveAction: "",
    responsiblePerson: "박생산",
    completionDate: "",
    status: "분석중",
  },
];

const complaintTypeOptions = getActiveDefectTypes();
const statusOptions = ["접수", "분석중", "조치중", "완료"];

export default function CustomerComplaintsPage() {
  const [complaints, setComplaints] = useState<CustomerComplaint[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    receiptDate: "",
    customer: "",
    complaintType: "",
    description: "",
    rootCause: "",
    correctiveAction: "",
    responsiblePerson: "",
    completionDate: "",
    status: "접수",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: CustomerComplaint = {
      id: complaints.length + 1,
      ...formData,
    };
    setComplaints([...complaints, newComplaint]);
    setShowForm(false);
    setFormData({
      receiptDate: "",
      customer: "",
      complaintType: "",
      description: "",
      rootCause: "",
      correctiveAction: "",
      responsiblePerson: "",
      completionDate: "",
      status: "접수",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
      접수: "destructive",
      분석중: "warning",
      조치중: "default",
      완료: "success",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">고객불만관리</h1>
          <p className="text-muted-foreground">고객불만 접수 및 처리 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          불만 접수
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              고객불만 접수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptDate">접수일자</Label>
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
                  <Label htmlFor="complaintType">불만유형</Label>
                  <Select
                    value={formData.complaintType}
                    onValueChange={(value) => setFormData({ ...formData, complaintType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintTypeOptions.map((defect) => (
                        <SelectItem key={defect.code} value={defect.code}>
                          {defect.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">불만내용</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="고객불만 내용을 상세히 입력하세요"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rootCause">원인분석</Label>
                  <Textarea
                    id="rootCause"
                    value={formData.rootCause}
                    onChange={(e) =>
                      setFormData({ ...formData, rootCause: e.target.value })
                    }
                    placeholder="불만 발생 원인을 입력하세요"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correctiveAction">시정조치</Label>
                  <Textarea
                    id="correctiveAction"
                    value={formData.correctiveAction}
                    onChange={(e) =>
                      setFormData({ ...formData, correctiveAction: e.target.value })
                    }
                    placeholder="시정조치 내용을 입력하세요"
                    rows={2}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsiblePerson">담당자</Label>
                  <Input
                    id="responsiblePerson"
                    value={formData.responsiblePerson}
                    onChange={(e) =>
                      setFormData({ ...formData, responsiblePerson: e.target.value })
                    }
                    placeholder="담당자명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completionDate">완료일자</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, completionDate: e.target.value })
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
            <MessageSquareWarning className="h-5 w-5" />
            고객불만 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <p className="text-muted-foreground">등록된 고객불만이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>접수일자</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>불만유형</TableHead>
                  <TableHead>불만내용</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>완료일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(complaint.receiptDate)}
                    </TableCell>
                    <TableCell>{complaint.customer}</TableCell>
                    <TableCell>{complaint.complaintType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {complaint.description}
                    </TableCell>
                    <TableCell>{complaint.responsiblePerson}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(complaint.completionDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(complaint.status)}</TableCell>
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
