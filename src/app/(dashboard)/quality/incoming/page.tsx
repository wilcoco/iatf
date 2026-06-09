"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, Save, Search } from "lucide-react";

interface IncomingInspection {
  id: number;
  inspectionDate: string;
  supplier: string;
  partNo: string;
  partName: string;
  lotNo: string;
  receivedQty: number;
  sampleQty: number;
  okQty: number;
  ngQty: number;
  defectType: string;
  result: string;
  inspector: string;
  remarks: string;
}

export default function IncomingInspectionPage() {
  const [inspections, setInspections] = useState<IncomingInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    inspectionDate: new Date().toISOString().split("T")[0],
    supplier: "",
    partNo: "",
    partName: "",
    lotNo: "",
    receivedQty: "",
    sampleQty: "",
    okQty: "",
    ngQty: "",
    defectType: "",
    inspector: "",
    remarks: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ngQty = Number(formData.ngQty) || 0;
    const result = ngQty > 0 ? "불합격" : "합격";
    const newInspection: IncomingInspection = {
      id: Date.now(),
      inspectionDate: formData.inspectionDate,
      supplier: formData.supplier,
      partNo: formData.partNo,
      partName: formData.partName,
      lotNo: formData.lotNo,
      receivedQty: Number(formData.receivedQty),
      sampleQty: Number(formData.sampleQty),
      okQty: Number(formData.okQty),
      ngQty,
      defectType: formData.defectType,
      result,
      inspector: formData.inspector,
      remarks: formData.remarks,
    };
    setInspections([newInspection, ...inspections]);
    setShowForm(false);
    setFormData({
      inspectionDate: new Date().toISOString().split("T")[0],
      supplier: "",
      partNo: "",
      partName: "",
      lotNo: "",
      receivedQty: "",
      sampleQty: "",
      okQty: "",
      ngQty: "",
      defectType: "",
      inspector: "",
      remarks: "",
    });
    alert("수입검사 기록이 저장되었습니다.");
  };

  const filteredInspections = inspections.filter(
    (i) =>
      i.partNo.toLowerCase().includes(search.toLowerCase()) ||
      i.partName.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">수입검사</h1>
          <p className="text-muted-foreground">외주/협력업체 입고품 수입검사 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          검사 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>수입검사 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>검사일자 *</Label>
                  <Input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>공급업체 *</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="업체명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품번 *</Label>
                  <Input
                    value={formData.partNo}
                    onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                    placeholder="품번"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품명 *</Label>
                  <Input
                    value={formData.partName}
                    onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                    placeholder="품명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>LOT No. *</Label>
                  <Input
                    value={formData.lotNo}
                    onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                    placeholder="LOT번호"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>입고수량</Label>
                  <Input
                    type="number"
                    value={formData.receivedQty}
                    onChange={(e) => setFormData({ ...formData, receivedQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>샘플수량</Label>
                  <Input
                    type="number"
                    value={formData.sampleQty}
                    onChange={(e) => setFormData({ ...formData, sampleQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>합격수량</Label>
                  <Input
                    type="number"
                    value={formData.okQty}
                    onChange={(e) => setFormData({ ...formData, okQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>불합격수량</Label>
                  <Input
                    type="number"
                    value={formData.ngQty}
                    onChange={(e) => setFormData({ ...formData, ngQty: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>불량유형</Label>
                  <Select value={formData.defectType} onValueChange={(v) => setFormData({ ...formData, defectType: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="외관">외관불량</SelectItem>
                      <SelectItem value="치수">치수불량</SelectItem>
                      <SelectItem value="기능">기능불량</SelectItem>
                      <SelectItem value="포장">포장불량</SelectItem>
                      <SelectItem value="수량">수량부족</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검사자 *</Label>
                  <Input
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                    placeholder="검사자명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <Input
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="비고"
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
          placeholder="품번, 품명, 업체로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            수입검사 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredInspections.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">검사 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>검사일자</TableHead>
                  <TableHead>공급업체</TableHead>
                  <TableHead>품번</TableHead>
                  <TableHead>품명</TableHead>
                  <TableHead>LOT No.</TableHead>
                  <TableHead className="text-right">입고</TableHead>
                  <TableHead className="text-right">불량</TableHead>
                  <TableHead>판정</TableHead>
                  <TableHead>검사자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.map((insp) => (
                  <TableRow key={insp.id}>
                    <TableCell>{insp.inspectionDate}</TableCell>
                    <TableCell>{insp.supplier}</TableCell>
                    <TableCell className="font-mono">{insp.partNo}</TableCell>
                    <TableCell>{insp.partName}</TableCell>
                    <TableCell className="font-mono text-sm">{insp.lotNo}</TableCell>
                    <TableCell className="text-right">{insp.receivedQty?.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">{insp.ngQty || 0}</TableCell>
                    <TableCell>
                      <Badge variant={insp.result === "합격" ? "success" : "destructive"}>
                        {insp.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{insp.inspector}</TableCell>
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
