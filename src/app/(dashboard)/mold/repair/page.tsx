"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, Save, Search } from "lucide-react";

interface RepairRecord {
  id: number;
  repairDate: string;
  moldNo: string;
  moldName: string;
  issueDescription: string;
  repairContent: string;
  repairCost: string;
  repairVendor: string;
  completionDate: string;
  status: string;
}

export default function MoldRepairPage() {
  const [records, setRecords] = useState<RepairRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    repairDate: new Date().toISOString().split("T")[0],
    moldNo: "",
    moldName: "",
    issueDescription: "",
    repairContent: "",
    repairCost: "",
    repairVendor: "",
    completionDate: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: RepairRecord = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      repairDate: new Date().toISOString().split("T")[0],
      moldNo: "",
      moldName: "",
      issueDescription: "",
      repairContent: "",
      repairCost: "",
      repairVendor: "",
      completionDate: "",
      status: "",
    });
    alert("보수 기록이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.moldNo.toLowerCase().includes(search.toLowerCase()) ||
      r.moldName.toLowerCase().includes(search.toLowerCase()) ||
      r.issueDescription.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "완료":
        return "success";
      case "진행중":
        return "warning";
      case "대기":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">금형보수실적</h1>
          <p className="text-muted-foreground">금형 보수 이력 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          보수 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>금형 보수 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>접수일자 *</Label>
                  <Input
                    type="date"
                    value={formData.repairDate}
                    onChange={(e) => setFormData({ ...formData, repairDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>금형번호 *</Label>
                  <Input
                    value={formData.moldNo}
                    onChange={(e) => setFormData({ ...formData, moldNo: e.target.value })}
                    placeholder="M-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>금형명 *</Label>
                  <Input
                    value={formData.moldName}
                    onChange={(e) => setFormData({ ...formData, moldName: e.target.value })}
                    placeholder="금형명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>불량내용 *</Label>
                  <Input
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    placeholder="불량 내용을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>보수내용 *</Label>
                  <Input
                    value={formData.repairContent}
                    onChange={(e) => setFormData({ ...formData, repairContent: e.target.value })}
                    placeholder="보수 내용을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>보수비용</Label>
                  <Input
                    value={formData.repairCost}
                    onChange={(e) => setFormData({ ...formData, repairCost: e.target.value })}
                    placeholder="비용 (원)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>보수업체</Label>
                  <Input
                    value={formData.repairVendor}
                    onChange={(e) => setFormData({ ...formData, repairVendor: e.target.value })}
                    placeholder="보수업체명"
                  />
                </div>
                <div className="space-y-2">
                  <Label>완료일자</Label>
                  <Input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대기">대기</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
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

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="금형번호, 금형명, 불량내용으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            보수 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">보수 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>접수일자</TableHead>
                  <TableHead>금형번호</TableHead>
                  <TableHead>금형명</TableHead>
                  <TableHead>불량내용</TableHead>
                  <TableHead>보수내용</TableHead>
                  <TableHead>보수비용</TableHead>
                  <TableHead>보수업체</TableHead>
                  <TableHead>완료일자</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.repairDate}</TableCell>
                    <TableCell className="font-mono">{record.moldNo}</TableCell>
                    <TableCell>{record.moldName}</TableCell>
                    <TableCell>{record.issueDescription}</TableCell>
                    <TableCell>{record.repairContent}</TableCell>
                    <TableCell>{record.repairCost ? `${Number(record.repairCost).toLocaleString()}원` : "-"}</TableCell>
                    <TableCell>{record.repairVendor || "-"}</TableCell>
                    <TableCell>{record.completionDate || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.status)}>
                        {record.status}
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
