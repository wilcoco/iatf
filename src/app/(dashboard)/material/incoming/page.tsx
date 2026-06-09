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
import { getActiveSuppliers, getMaterials } from "@/lib/master-data";

// Types
interface IncomingRecord {
  id: number;
  incomingDate: string;
  materialCode: string;
  materialName: string;
  supplierCode: string;
  supplierName: string;
  quantity: number;
  unit: string;
  lotNo: string;
  poNo: string;
  inspectionStatus: "대기" | "합격" | "불합격" | "보류";
  remarks: string;
}

export default function MaterialIncomingPage() {
  const suppliers = getActiveSuppliers();
  const materials = getMaterials();

  const [records, setRecords] = useState<IncomingRecord[]>([
    {
      id: 1,
      incomingDate: "2026-06-01",
      materialCode: "MAT-001",
      materialName: "ABS 수지",
      supplierCode: "SUP-001",
      supplierName: "(주)카라",
      quantity: 500,
      unit: "KG",
      lotNo: "LOT-2026-0601",
      poNo: "PO-2026-001",
      inspectionStatus: "합격",
      remarks: "정기 입고",
    },
    {
      id: 2,
      incomingDate: "2026-06-03",
      materialCode: "MAT-002",
      materialName: "PP 수지",
      supplierCode: "SUP-002",
      supplierName: "G금강",
      quantity: 300,
      unit: "KG",
      lotNo: "LOT-2026-0603",
      poNo: "PO-2026-002",
      inspectionStatus: "합격",
      remarks: "",
    },
    {
      id: 3,
      incomingDate: "2026-06-05",
      materialCode: "MAT-003",
      materialName: "PC/ABS 수지",
      supplierCode: "SUP-003",
      supplierName: "신성화학",
      quantity: 200,
      unit: "KG",
      lotNo: "LOT-2026-0605",
      poNo: "PO-2026-003",
      inspectionStatus: "대기",
      remarks: "검사 대기중",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    incomingDate: new Date().toISOString().split("T")[0],
    materialCode: "",
    materialName: "",
    unit: "",
    supplierCode: "",
    supplierName: "",
    quantity: "",
    lotNo: "",
    poNo: "",
    inspectionStatus: "대기" as "대기" | "합격" | "불합격" | "보류",
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
        supplierCode: material.supplierCode,
        supplierName: material.supplierName,
      }));
    }
  };

  const handleSupplierSelect = (code: string) => {
    const supplier = suppliers.find((s) => s.code === code);
    if (supplier) {
      setFormData((prev) => ({
        ...prev,
        supplierCode: code,
        supplierName: supplier.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialCode || !formData.supplierCode) return;

    const newRecord: IncomingRecord = {
      id: Date.now(),
      incomingDate: formData.incomingDate,
      materialCode: formData.materialCode,
      materialName: formData.materialName,
      supplierCode: formData.supplierCode,
      supplierName: formData.supplierName,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      lotNo: formData.lotNo,
      poNo: formData.poNo,
      inspectionStatus: formData.inspectionStatus,
      remarks: formData.remarks,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      incomingDate: new Date().toISOString().split("T")[0],
      materialCode: "",
      materialName: "",
      unit: "",
      supplierCode: "",
      supplierName: "",
      quantity: "",
      lotNo: "",
      poNo: "",
      inspectionStatus: "대기",
      remarks: "",
    });
    alert("입고가 등록되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "합격":
        return "success";
      case "불합격":
        return "destructive";
      case "보류":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">자재 입고</h1>
        <p className="text-muted-foreground">자재 입고 등록 및 이력 관리</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="자재코드, 자재명, 공급업체, LOT번호로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          입고 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              입고 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>입고일 *</Label>
                  <Input
                    type="date"
                    value={formData.incomingDate}
                    onChange={(e) => setFormData({ ...formData, incomingDate: e.target.value })}
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
                  <Label>공급업체 *</Label>
                  <Select value={formData.supplierCode} onValueChange={handleSupplierSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup.code} value={sup.code}>
                          {sup.code} - {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>공급업체명</Label>
                  <Input value={formData.supplierName} readOnly className="bg-muted" />
                </div>
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
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>발주번호</Label>
                  <Input
                    value={formData.poNo}
                    onChange={(e) => setFormData({ ...formData, poNo: e.target.value })}
                    placeholder="PO-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>검사상태</Label>
                  <Select
                    value={formData.inspectionStatus}
                    onValueChange={(v) =>
                      setFormData({ ...formData, inspectionStatus: v as "대기" | "합격" | "불합격" | "보류" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대기">대기</SelectItem>
                      <SelectItem value="합격">합격</SelectItem>
                      <SelectItem value="불합격">불합격</SelectItem>
                      <SelectItem value="보류">보류</SelectItem>
                    </SelectContent>
                  </Select>
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
            입고 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 입고 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>입고일</TableHead>
                  <TableHead>자재코드</TableHead>
                  <TableHead>자재명</TableHead>
                  <TableHead>공급업체</TableHead>
                  <TableHead className="text-right">수량</TableHead>
                  <TableHead>LOT번호</TableHead>
                  <TableHead>발주번호</TableHead>
                  <TableHead>검사상태</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.incomingDate}</TableCell>
                    <TableCell className="font-mono">{record.materialCode}</TableCell>
                    <TableCell>{record.materialName}</TableCell>
                    <TableCell>{record.supplierName}</TableCell>
                    <TableCell className="text-right">
                      {record.quantity.toLocaleString()} {record.unit}
                    </TableCell>
                    <TableCell className="font-mono">{record.lotNo || "-"}</TableCell>
                    <TableCell className="font-mono">{record.poNo || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.inspectionStatus)}>
                        {record.inspectionStatus}
                      </Badge>
                    </TableCell>
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
