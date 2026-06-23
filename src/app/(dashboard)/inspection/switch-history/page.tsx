"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  Plus,
  Save,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";

// 전환구분
type SwitchType = "유검사→무검사" | "무검사→유검사";
// 상태
type SwitchStatus = "승인" | "대기" | "반려";

interface SwitchRecord {
  id: number;
  carModel: string; // 차종/부품
  partNo: string; // 부번
  switchType: SwitchType; // 전환구분
  reason: string; // 전환사유
  evidence: string; // 근거 (품질실적/PPM 등)
  applicant: string; // 신청자
  approver: string; // 승인자
  applyDate: string; // 적용일
  status: SwitchStatus; // 상태
}

interface SwitchForm {
  carModel: string;
  partNo: string;
  switchType: SwitchType;
  reason: string;
  evidence: string;
  applicant: string;
  applyDate: string;
}

const initialForm: SwitchForm = {
  carModel: "",
  partNo: "",
  switchType: "유검사→무검사",
  reason: "",
  evidence: "",
  applicant: "",
  applyDate: new Date().toISOString().split("T")[0],
};

const initialRecords: SwitchRecord[] = [
  {
    id: 1,
    carModel: "SUV-A / 프론트 브래킷",
    partNo: "BR-10231",
    switchType: "유검사→무검사",
    reason: "최근 12개월간 부적합 발생 없음, 공정능력 안정",
    evidence: "최근 6개월 0 PPM, Cpk 1.78",
    applicant: "김품질",
    approver: "이부장",
    applyDate: "2026-03-15",
    status: "승인",
  },
  {
    id: 2,
    carModel: "세단-B / 리어 패널",
    partNo: "RP-44120",
    switchType: "무검사→유검사",
    reason: "고객 클레임 발생으로 검사 강화 필요",
    evidence: "최근 3개월 320 PPM, 클레임 2건",
    applicant: "박검사",
    approver: "정과장",
    applyDate: "2026-04-02",
    status: "승인",
  },
  {
    id: 3,
    carModel: "트럭-C / 엔진 마운트",
    partNo: "EM-78902",
    switchType: "유검사→무검사",
    reason: "양산 안정화 및 자동검사 도입 완료",
    evidence: "최근 6개월 5 PPM, 자동검사 100%",
    applicant: "최생산",
    approver: "",
    applyDate: "2026-06-10",
    status: "대기",
  },
  {
    id: 4,
    carModel: "SUV-A / 도어 힌지",
    partNo: "DH-22041",
    switchType: "유검사→무검사",
    reason: "공정능력 미달로 전환 보류",
    evidence: "최근 6개월 85 PPM, Cpk 1.12",
    applicant: "한품질",
    approver: "이부장",
    applyDate: "2026-05-20",
    status: "반려",
  },
];

const switchTypeOptions: SwitchType[] = ["유검사→무검사", "무검사→유검사"];

function getStatusBadge(status: SwitchStatus) {
  switch (status) {
    case "승인":
      return <Badge variant="success">{status}</Badge>;
    case "대기":
      return <Badge variant="warning">{status}</Badge>;
    case "반려":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getSwitchTypeBadge(type: SwitchType) {
  return type === "유검사→무검사" ? (
    <Badge variant="secondary">{type}</Badge>
  ) : (
    <Badge variant="outline">{type}</Badge>
  );
}

export default function SwitchHistoryPage() {
  const [activeTab, setActiveTab] = useState("apply");
  const [records, setRecords] = useState<SwitchRecord[]>(initialRecords);
  const [form, setForm] = useState<SwitchForm>(initialForm);
  const [search, setSearch] = useState("");

  // 요약 통계
  const stats = useMemo(() => {
    return {
      total: records.length,
      approved: records.filter((r) => r.status === "승인").length,
      pending: records.filter((r) => r.status === "대기").length,
      rejected: records.filter((r) => r.status === "반려").length,
    };
  }, [records]);

  // 검색 필터링
  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return records;
    return records.filter(
      (r) =>
        r.carModel.toLowerCase().includes(keyword) ||
        r.partNo.toLowerCase().includes(keyword)
    );
  }, [records, search]);

  // 신청 저장
  const handleSave = () => {
    if (!form.carModel.trim()) {
      alert("차종/부품을 입력해주세요.");
      return;
    }
    if (!form.partNo.trim()) {
      alert("부번을 입력해주세요.");
      return;
    }
    if (!form.reason.trim()) {
      alert("전환사유를 입력해주세요.");
      return;
    }
    if (!form.evidence.trim()) {
      alert("근거를 입력해주세요.");
      return;
    }
    if (!form.applicant.trim()) {
      alert("신청자를 입력해주세요.");
      return;
    }

    const newRecord: SwitchRecord = {
      id: Date.now(),
      carModel: form.carModel.trim(),
      partNo: form.partNo.trim(),
      switchType: form.switchType,
      reason: form.reason.trim(),
      evidence: form.evidence.trim(),
      applicant: form.applicant.trim(),
      approver: "",
      applyDate: form.applyDate,
      status: "대기",
    };

    setRecords([newRecord, ...records]);
    setForm(initialForm);
    alert("전환 신청이 등록되었습니다. (상태: 대기)");
    setActiveTab("history");
  };

  // 승인 처리
  const handleApprove = (id: number) => {
    const approver = window.prompt("승인자 이름을 입력하세요.", "이부장");
    if (!approver || !approver.trim()) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "승인", approver: approver.trim() }
          : r
      )
    );
  };

  // 반려 처리
  const handleReject = (id: number) => {
    const approver = window.prompt("반려 처리자 이름을 입력하세요.", "이부장");
    if (!approver || !approver.trim()) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "반려", approver: approver.trim() }
          : r
      )
    );
  };

  // 이력 삭제
  const handleDelete = (id: number) => {
    if (window.confirm("이 전환 이력을 삭제하시겠습니까?")) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">유/무검사 전환 이력</h1>
        <p className="text-muted-foreground">
          부품(차종/부번)별 유검사 ↔ 무검사 전환 신청 및 승인 이력을 관리합니다.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">전체 신청</p>
            <p className="text-2xl font-bold mt-2">{stats.total}건</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">승인</p>
            <p className="text-2xl font-bold mt-2 text-green-600">
              {stats.approved}건
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">대기</p>
            <p className="text-2xl font-bold mt-2 text-yellow-600">
              {stats.pending}건
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">반려</p>
            <p className="text-2xl font-bold mt-2 text-red-600">
              {stats.rejected}건
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            유/무검사 전환 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="apply" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                전환 신청
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                전환 이력
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: 전환 신청 */}
            <TabsContent value="apply" className="mt-4">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>차종/부품 *</Label>
                    <Input
                      value={form.carModel}
                      onChange={(e) =>
                        setForm({ ...form, carModel: e.target.value })
                      }
                      placeholder="예: SUV-A / 프론트 브래킷"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>부번 *</Label>
                    <Input
                      value={form.partNo}
                      onChange={(e) =>
                        setForm({ ...form, partNo: e.target.value })
                      }
                      placeholder="예: BR-10231"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>전환구분 *</Label>
                    <Select
                      value={form.switchType}
                      onValueChange={(v) =>
                        setForm({ ...form, switchType: v as SwitchType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {switchTypeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>적용일 *</Label>
                    <Input
                      type="date"
                      value={form.applyDate}
                      onChange={(e) =>
                        setForm({ ...form, applyDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>신청자 *</Label>
                    <Input
                      value={form.applicant}
                      onChange={(e) =>
                        setForm({ ...form, applicant: e.target.value })
                      }
                      placeholder="예: 김품질"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>근거 (품질실적/PPM 등) *</Label>
                    <Input
                      value={form.evidence}
                      onChange={(e) =>
                        setForm({ ...form, evidence: e.target.value })
                      }
                      placeholder="예: 최근 6개월 0 PPM, Cpk 1.78"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>전환사유 *</Label>
                  <Textarea
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    placeholder="전환을 신청하는 사유를 입력하세요."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setForm(initialForm)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    초기화
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    신청 저장
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: 전환 이력 */}
            <TabsContent value="history" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="부품 또는 부번으로 검색"
                      className="pl-8"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    총 {filteredRecords.length}건
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>차종/부품</TableHead>
                        <TableHead>부번</TableHead>
                        <TableHead>전환구분</TableHead>
                        <TableHead>전환사유</TableHead>
                        <TableHead>적용일</TableHead>
                        <TableHead>신청자</TableHead>
                        <TableHead>승인자</TableHead>
                        <TableHead className="text-center">상태</TableHead>
                        <TableHead className="text-center">처리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-8 text-muted-foreground"
                          >
                            전환 이력이 없습니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {record.carModel}
                            </TableCell>
                            <TableCell className="font-mono">
                              {record.partNo}
                            </TableCell>
                            <TableCell>
                              {getSwitchTypeBadge(record.switchType)}
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <span className="text-sm text-muted-foreground">
                                {record.reason}
                              </span>
                            </TableCell>
                            <TableCell>{record.applyDate}</TableCell>
                            <TableCell>{record.applicant}</TableCell>
                            <TableCell>
                              {record.approver || (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(record.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                {record.status === "대기" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApprove(record.id)}
                                      title="승인"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleReject(record.id)}
                                      title="반려"
                                    >
                                      <Clock className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(record.id)}
                                  title="삭제"
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
