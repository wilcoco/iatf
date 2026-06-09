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
import { Plus, ClipboardCheck, Users } from "lucide-react";

interface ManagementReview {
  id: number;
  reviewDate: string;
  meetingTitle: string;
  attendees: string;
  agendaItems: string;
  decisions: string;
  actionItems: string;
  nextReviewDate: string;
  status: string;
}

const initialData: ManagementReview[] = [
  {
    id: 1,
    reviewDate: "2026-03-15",
    meetingTitle: "2026년 1분기 경영검토회의",
    attendees: "대표이사, 품질부장, 생산부장, 영업부장",
    agendaItems: "품질목표 달성현황, 고객불만 처리현황, 내부심사 결과",
    decisions: "품질개선 활동 강화, 교육훈련 확대",
    actionItems: "품질부: 개선활동 계획 수립, 인사부: 교육계획 수립",
    nextReviewDate: "2026-06-15",
    status: "완료",
  },
  {
    id: 2,
    reviewDate: "2026-06-15",
    meetingTitle: "2026년 2분기 경영검토회의",
    attendees: "대표이사, 품질부장, 생산부장, 영업부장, 구매부장",
    agendaItems: "품질목표 달성현황, 공급업체 평가결과, KPI 실적검토",
    decisions: "",
    actionItems: "",
    nextReviewDate: "2026-09-15",
    status: "예정",
  },
];

const statusOptions = ["예정", "진행중", "완료", "연기"];

export default function ManagementReviewPage() {
  const [reviews, setReviews] = useState<ManagementReview[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reviewDate: "",
    meetingTitle: "",
    attendees: "",
    agendaItems: "",
    decisions: "",
    actionItems: "",
    nextReviewDate: "",
    status: "예정",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: ManagementReview = {
      id: reviews.length + 1,
      ...formData,
    };
    setReviews([...reviews, newReview]);
    setShowForm(false);
    setFormData({
      reviewDate: "",
      meetingTitle: "",
      attendees: "",
      agendaItems: "",
      decisions: "",
      actionItems: "",
      nextReviewDate: "",
      status: "예정",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "success" | "destructive"> = {
      예정: "secondary",
      진행중: "default",
      완료: "success",
      연기: "destructive",
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
          <h1 className="text-3xl font-bold">경영검토</h1>
          <p className="text-muted-foreground">경영검토 회의 기록 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          회의 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              경영검토 회의 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewDate">회의일자</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingTitle">회의명</Label>
                  <Input
                    id="meetingTitle"
                    value={formData.meetingTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, meetingTitle: e.target.value })
                    }
                    placeholder="예: 2026년 1분기 경영검토회의"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendees">참석자</Label>
                <Input
                  id="attendees"
                  value={formData.attendees}
                  onChange={(e) =>
                    setFormData({ ...formData, attendees: e.target.value })
                  }
                  placeholder="예: 대표이사, 품질부장, 생산부장"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agendaItems">안건</Label>
                <Textarea
                  id="agendaItems"
                  value={formData.agendaItems}
                  onChange={(e) =>
                    setFormData({ ...formData, agendaItems: e.target.value })
                  }
                  placeholder="회의 안건을 입력하세요"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decisions">결정사항</Label>
                  <Textarea
                    id="decisions"
                    value={formData.decisions}
                    onChange={(e) =>
                      setFormData({ ...formData, decisions: e.target.value })
                    }
                    placeholder="회의 결정사항을 입력하세요"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actionItems">조치사항</Label>
                  <Textarea
                    id="actionItems"
                    value={formData.actionItems}
                    onChange={(e) =>
                      setFormData({ ...formData, actionItems: e.target.value })
                    }
                    placeholder="조치사항 및 담당자를 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextReviewDate">차기 검토일</Label>
                  <Input
                    id="nextReviewDate"
                    type="date"
                    value={formData.nextReviewDate}
                    onChange={(e) =>
                      setFormData({ ...formData, nextReviewDate: e.target.value })
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
            <Users className="h-5 w-5" />
            경영검토 회의 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">등록된 경영검토 회의가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>회의일자</TableHead>
                  <TableHead>회의명</TableHead>
                  <TableHead>참석자</TableHead>
                  <TableHead>안건</TableHead>
                  <TableHead>결정사항</TableHead>
                  <TableHead>차기 검토일</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(review.reviewDate)}
                    </TableCell>
                    <TableCell>{review.meetingTitle}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {review.attendees}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {review.agendaItems}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {review.decisions || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(review.nextReviewDate)}
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
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
