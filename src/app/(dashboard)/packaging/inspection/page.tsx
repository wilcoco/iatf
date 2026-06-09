"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Save, Search } from "lucide-react";

interface ContainerInspection {
  id: number;
  inspectionDate: string;
  containerNo: string;
  containerType: string;
  checkAppearance: boolean;
  checkDamage: boolean;
  checkCleanliness: boolean;
  checkLabel: boolean;
  result: string;
  actionTaken: string;
  inspector: string;
}

export default function ContainerInspectionPage() {
  const [records, setRecords] = useState<ContainerInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    containerNo: "",
    containerType: "",
    checkAppearance: false,
    checkDamage: false,
    checkCleanliness: false,
    checkLabel: false,
    result: "",
    actionTaken: "",
    inspector: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ContainerInspection = {
      id: Date.now(),
      ...formData,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      inspectionDate: new Date().toISOString().split("T")[0],
      containerNo: "",
      containerType: "",
      checkAppearance: false,
      checkDamage: false,
      checkCleanliness: false,
      checkLabel: false,
      result: "",
      actionTaken: "",
      inspector: "",
    });
    alert("용기점검이 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.containerNo.toLowerCase().includes(search.toLowerCase()) ||
      r.inspector.toLowerCase().includes(search.toLowerCase())
  );

  const getResultVariant = (result: string) => {
    switch (result) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "수리필요":
        return "warning";
      default:
        return "outline";
    }
  };

  const getCheckItems = (record: ContainerInspection) => {
    const items = [];
    if (record.checkAppearance) items.push("외관");
    if (record.checkDamage) items.push("파손");
    if (record.checkCleanliness) items.push("청결");
    if (record.checkLabel) items.push("라벨");
    return items.length > 0 ? items.join(", ") : "-";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">용기점검</h1>
          <p className="text-muted-foreground">납입용기 점검 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          점검 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>용기점검 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>점검일자 *</Label>
                  <Input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>용기번호 *</Label>
                  <Input
                    value={formData.containerNo}
                    onChange={(e) => setFormData({ ...formData, containerNo: e.target.value })}
                    placeholder="CT-001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>용기유형 *</Label>
                  <Select value={formData.containerType} onValueChange={(v) => setFormData({ ...formData, containerType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="플라스틱박스">플라스틱박스</SelectItem>
                      <SelectItem value="철제박스">철제박스</SelectItem>
                      <SelectItem value="골판지박스">골판지박스</SelectItem>
                      <SelectItem value="트레이">트레이</SelectItem>
                      <SelectItem value="팔레트">팔레트</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검자 *</Label>
                  <Input
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    placeholder="점검자명"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>점검항목</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.checkAppearance}
                      onChange={(e) => setFormData({ ...formData, checkAppearance: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span>외관</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.checkDamage}
                      onChange={(e) => setFormData({ ...formData, checkDamage: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span>파손</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.checkCleanliness}
                      onChange={(e) => setFormData({ ...formData, checkCleanliness: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span>청결</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.checkLabel}
                      onChange={(e) => setFormData({ ...formData, checkLabel: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span>라벨</span>
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="합격">합격</SelectItem>
                      <SelectItem value="불합격">불합격</SelectItem>
                      <SelectItem value="수리필요">수리필요</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>조치내용</Label>
                  <Input
                    value={formData.actionTaken}
                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                    placeholder="조치내용을 입력하세요"
                  />
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
          placeholder="용기번호, 점검자로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            점검 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 점검 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>점검일자</TableHead>
                  <TableHead>용기번호</TableHead>
                  <TableHead>용기유형</TableHead>
                  <TableHead>점검항목</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>조치내용</TableHead>
                  <TableHead>점검자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.inspectionDate}</TableCell>
                    <TableCell className="font-mono">{record.containerNo}</TableCell>
                    <TableCell><Badge variant="outline">{record.containerType}</Badge></TableCell>
                    <TableCell>{getCheckItems(record)}</TableCell>
                    <TableCell>
                      <Badge variant={getResultVariant(record.result)}>
                        {record.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.actionTaken || "-"}</TableCell>
                    <TableCell>{record.inspector}</TableCell>
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
