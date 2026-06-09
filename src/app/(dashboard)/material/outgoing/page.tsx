"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Save, Search, Package } from "lucide-react";
import { getMaterials } from "@/lib/master-data";

// Types
interface OutgoingRecord {
  id: number;
  outgoingDate: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  lotNo: string;
  destination: string;
  purpose: "생산" | "반품" | "폐기" | "기타";
  workOrderNo: string;
  requester: string;
  remarks: string;
}

export default function MaterialOutgoingPage() {
  const materials = getMaterials();

  const [records, setRecords] = useState<OutgoingRecord[]>([
    {
      id: 1,
      outgoingDate: "2026-06-02",
      materialCode: "MAT-001",
      materialName: "ABS 수지",
      quantity: 150,
      unit: "KG",
      lotNo: "LOT-2026-0601",
      destination: "사출라인-A",
      purpose: "생산",
      workOrderNo: "WO-2026-001",
      requester: "김생산",
      remarks: "범퍼 커버 FR 생산",
    },
    {
      id: 2,
      outgoingDate: "2026-06-04",
      materialCode: "MAT-002",
      materialName: "PP 수지",
      quantity: 100,
      unit: "KG",
      lotNo: "LOT-2026-0603",
      destination: "사출라인-B",
      purpose: "생산",
      workOrderNo: "WO-2026-002",
      requester: "박생산",
      remarks: "",
    },
    {
      id: 3,
      outgoingDate: "2026-06-06",
      materialCode: "MAT-004",
      materialName: "도료 (검정)",
      quantity: 20,
      unit: "L",
      lotNo: "LOT-2026-0605",
      destination: "도장라인",
      purpose: "생산",
      workOrderNo: "WO-2026-003",
      requester: "이생산",
      remarks: "상도 도장용",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    outgoingDate: new Date().toISOString().split("T")[0],
    materialCode: "",
    materialName: "",
    unit: "",
    quantity: "",
    lotNo: "",
    destination: "",
    purpose: "생산" as "생산" | "반품" | "폐기" | "기타",
    workOrderNo: "",
    requester: "",
    remarks: "",
  });

  const handleMaterialSelect = (code: string) => {
    const material = materials.find((m) => m.code === code);
    if (material) {
      setFormData((prev) => ({
        ...prev,
        materialCode: code,
        materialName: material.name,
        unit: material.unit,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialCode) return;

    const newRecord: OutgoingRecord = {
      id: Date.now(),
      outgoingDate: formData.outgoingDate,
      materialCode: formData.materialCode,
      materialName: formData.materialName,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      lotNo: formData.lotNo,
      destination: formData.destination,
      purpose: formData.purpose,
      workOrderNo: formData.workOrderNo,
      requester: formData.requester,
      remarks: formData.remarks,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      outgoingDate: new Date().toISOString().split("T")[0],
      materialCode: "",
      materialName: "",
      unit: "",
      quantity: "",
      lotNo: "",
      destination: "",
      purpose: "생산",
      workOrderNo: "",
      requester: "",
      remarks: "",
    });
    alert("출고가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPurposeBadgeVariant = (purpose: string) => {
    switch (purpose) {
      case "생산":
        return "success";
      case "반품":
        return "warning";
      case "폐기":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">자재 출고</h1>
        <p className="text-muted-foreground">자재 출고 등록 및 이력 관리</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="자재코드, 자재명, 출고처, LOT번호로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          출고 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              출고 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>출고일 *</Label>
                  <Input
                    type="date"
                    value={formData.outgoingDate}
                    onChange={(e) => setFormData({ ...formData, outgoingDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>자재코드 *</Label>
                  <Select value={formData.materialCode} onValueChange={handleMaterialSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((mat) => (
                        <SelectItem key={mat.code} value={mat.code}>
                          {mat.code} - {mat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>자재명</Label>
                  <Input value={formData.materialName} readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>단위</Label>
                  <Input value={formData.unit} readOnly className="bg-muted" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>수량 *</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>LOT번호</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>출고처 *</Label>
                  <Input
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="사출라인-A"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>출고목적</Label>
                  <Select
                    value={formData.purpose}
                    onValueChange={(v) => setFormData({ ...formData, purpose: v as "생산" | "반품" | "폐기" | "기타" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="생산">생산</SelectItem>
                      <SelectItem value="반품">반품</SelectItem>
                      <SelectItem value="폐기">폐기</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>작업지시번호</Label>
                  <Input
                    value={formData.workOrderNo}
                    onChange={(e) => setFormData({ ...formData, workOrderNo: e.target.value })}
                    placeholder="WO-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>요청자</Label>
                  <Input
                    value={formData.requester}
                    onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                    placeholder="담당자명"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="비고사항"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            출고 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 출고 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>출고일</TableHead>
                  <TableHead>자재코드</TableHead>
                  <TableHead>자재명</TableHead>
                  <TableHead className="text-right">수량</TableHead>
                  <TableHead>LOT번호</TableHead>
                  <TableHead>출고처</TableHead>
                  <TableHead>출고목적</TableHead>
                  <TableHead>작업지시번호</TableHead>
                  <TableHead>요청자</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.outgoingDate}</TableCell>
                    <TableCell className="font-mono">{record.materialCode}</TableCell>
                    <TableCell>{record.materialName}</TableCell>
                    <TableCell className="text-right">
                      {record.quantity.toLocaleString()} {record.unit}
                    </TableCell>
                    <TableCell className="font-mono">{record.lotNo || "-"}</TableCell>
                    <TableCell>{record.destination}</TableCell>
                    <TableCell>
                      <Badge variant={getPurposeBadgeVariant(record.purpose)}>{record.purpose}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{record.workOrderNo || "-"}</TableCell>
                    <TableCell>{record.requester || "-"}</TableCell>
                    <TableCell>{record.remarks || "-"}</TableCell>
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
