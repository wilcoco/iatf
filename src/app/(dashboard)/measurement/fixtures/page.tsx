"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ruler, Plus, Save, Search } from "lucide-react";

interface InspectionFixture {
  id: number;
  fixtureNo: string;
  fixtureName: string;
  vehicleType: string;
  partName: string;
  acquisitionDate: string;
  lastCheckDate: string;
  nextCheckDate: string;
  cmmCheckResult: string;
  status: string;
}

export default function FixturesPage() {
  const [records, setRecords] = useState<InspectionFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    fixtureNo: "",
    fixtureName: "",
    vehicleType: "",
    partName: "",
    acquisitionDate: "",
    lastCheckDate: "",
    nextCheckDate: "",
    cmmCheckResult: "",
    status: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InspectionFixture = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      fixtureNo: "",
      fixtureName: "",
      vehicleType: "",
      partName: "",
      acquisitionDate: "",
      lastCheckDate: "",
      nextCheckDate: "",
      cmmCheckResult: "",
      status: "",
    });
    alert("검사구가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.fixtureNo.toLowerCase().includes(search.toLowerCase()) ||
      r.fixtureName.toLowerCase().includes(search.toLowerCase()) ||
      r.partName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "사용중":
        return "success";
      case "점검중":
        return "warning";
      case "수리중":
        return "warning";
      case "폐기":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "조건부":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">검사구관리</h1>
          <p className="text-muted-foreground">검사구 이력카드 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          검사구 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>검사구 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>검사구번호 *</Label>
                  <Input
                    value={formData.fixtureNo}
                    onChange={(e) => setFormData({ ...formData, fixtureNo: e.target.value })}
                    placeholder="FX-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>검사구명 *</Label>
                  <Input
                    value={formData.fixtureName}
                    onChange={(e) => setFormData({ ...formData, fixtureName: e.target.value })}
                    placeholder="검사구명을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>차종 *</Label>
                  <Input
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="차종을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>부품명 *</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="부품명을 입력하세요"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>취득일자 *</Label>
                  <Input
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>최종점검일</Label>
                  <Input
                    type="date"
                    value={formData.lastCheckDate}
                    onChange={(e) => setFormData({ ...formData, lastCheckDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>차기점검일</Label>
                  <Input
                    type="date"
                    value={formData.nextCheckDate}
                    onChange={(e) => setFormData({ ...formData, nextCheckDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CMM점검결과</Label>
                  <Select value={formData.cmmCheckResult} onValueChange={(v) => setFormData({ ...formData, cmmCheckResult: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="합격">합격</SelectItem>
                      <SelectItem value="불합격">불합격</SelectItem>
                      <SelectItem value="조건부">조건부</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="사용중">사용중</SelectItem>
                      <SelectItem value="점검중">점검중</SelectItem>
                      <SelectItem value="수리중">수리중</SelectItem>
                      <SelectItem value="폐기">폐기</SelectItem>
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
          placeholder="검사구번호, 검사구명, 부품명으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            검사구 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 검사구가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>검사구번호</TableHead>
                  <TableHead>검사구명</TableHead>
                  <TableHead>차종</TableHead>
                  <TableHead>부품명</TableHead>
                  <TableHead>취득일자</TableHead>
                  <TableHead>최종점검일</TableHead>
                  <TableHead>차기점검일</TableHead>
                  <TableHead>CMM결과</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.fixtureNo}</TableCell>
                    <TableCell>{record.fixtureName}</TableCell>
                    <TableCell>{record.vehicleType}</TableCell>
                    <TableCell>{record.partName}</TableCell>
                    <TableCell>{record.acquisitionDate}</TableCell>
                    <TableCell>{record.lastCheckDate || "-"}</TableCell>
                    <TableCell>{record.nextCheckDate || "-"}</TableCell>
                    <TableCell>
                      {record.cmmCheckResult ? (
                        <Badge variant={getResultVariant(record.cmmCheckResult)}>
                          {record.cmmCheckResult}
                        </Badge>
                      ) : "-"}
                    </TableCell>
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
