"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Save } from "lucide-react";

interface LoanedAsset {
  id: number;
  assetNo: string;
  assetType: string;
  assetName: string;
  supplier: string;
  loanDate: string;
  returnDueDate: string;
  actualReturnDate: string;
  condition: string;
  status: string;
}

export default function LoanedAssetsPage() {
  const [assets, setAssets] = useState<LoanedAsset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    assetNo: "",
    assetType: "",
    assetName: "",
    supplier: "",
    loanDate: new Date().toISOString().split("T")[0],
    returnDueDate: "",
    actualReturnDate: "",
    condition: "",
    status: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: LoanedAsset = {
      id: Date.now(),
      assetNo: formData.assetNo,
      assetType: formData.assetType,
      assetName: formData.assetName,
      supplier: formData.supplier,
      loanDate: formData.loanDate,
      returnDueDate: formData.returnDueDate,
      actualReturnDate: formData.actualReturnDate,
      condition: formData.condition,
      status: formData.status,
    };
    setAssets([newAsset, ...assets]);
    setShowForm(false);
    setFormData({
      assetNo: "",
      assetType: "",
      assetName: "",
      supplier: "",
      loanDate: new Date().toISOString().split("T")[0],
      returnDueDate: "",
      actualReturnDate: "",
      condition: "",
      status: "",
    });
    alert("대여자산이 등록되었습니다.");
  };

  const statusColors: Record<string, string> = {
    "대여중": "bg-blue-100 text-blue-800",
    "반납완료": "bg-green-100 text-green-800",
    "반납지연": "bg-red-100 text-red-800",
    "폐기": "bg-gray-100 text-gray-800",
  };

  const typeColors: Record<string, string> = {
    "금형": "bg-purple-100 text-purple-800",
    "지그": "bg-orange-100 text-orange-800",
    "설비": "bg-cyan-100 text-cyan-800",
  };

  const conditionColors: Record<string, string> = {
    "양호": "bg-green-100 text-green-800",
    "보통": "bg-yellow-100 text-yellow-800",
    "불량": "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">대여자산관리</h1>
          <p className="text-muted-foreground">협력업체 대여자산 (금형/지그/설비) 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          자산 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>대여자산 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>자산번호 *</Label>
                  <Input
                    value={formData.assetNo}
                    onChange={(e) => setFormData({ ...formData, assetNo: e.target.value })}
                    placeholder="자산번호"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>자산유형 *</Label>
                  <Select value={formData.assetType} onValueChange={(v) => setFormData({ ...formData, assetType: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="금형">금형</SelectItem>
                      <SelectItem value="지그">지그</SelectItem>
                      <SelectItem value="설비">설비</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>자산명 *</Label>
                  <Input
                    value={formData.assetName}
                    onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                    placeholder="자산명"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>대여업체 *</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="대여업체명"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>대여일자 *</Label>
                  <Input
                    type="date"
                    value={formData.loanDate}
                    onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>반납예정일</Label>
                  <Input
                    type="date"
                    value={formData.returnDueDate}
                    onChange={(e) => setFormData({ ...formData, returnDueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>실반납일</Label>
                  <Input
                    type="date"
                    value={formData.actualReturnDate}
                    onChange={(e) => setFormData({ ...formData, actualReturnDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>자산상태</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="양호">양호</SelectItem>
                      <SelectItem value="보통">보통</SelectItem>
                      <SelectItem value="불량">불량</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>상태 *</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대여중">대여중</SelectItem>
                      <SelectItem value="반납완료">반납완료</SelectItem>
                      <SelectItem value="반납지연">반납지연</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            대여자산 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 대여자산이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>자산번호</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>자산명</TableHead>
                  <TableHead>대여업체</TableHead>
                  <TableHead>대여일자</TableHead>
                  <TableHead>반납예정일</TableHead>
                  <TableHead>실반납일</TableHead>
                  <TableHead>자산상태</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-mono">{asset.assetNo}</TableCell>
                    <TableCell>
                      <Badge className={typeColors[asset.assetType] || "bg-gray-100"}>
                        {asset.assetType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{asset.assetName}</TableCell>
                    <TableCell>{asset.supplier}</TableCell>
                    <TableCell>{asset.loanDate}</TableCell>
                    <TableCell>{asset.returnDueDate || "-"}</TableCell>
                    <TableCell>{asset.actualReturnDate || "-"}</TableCell>
                    <TableCell>
                      {asset.condition && (
                        <Badge className={conditionColors[asset.condition] || "bg-gray-100"}>
                          {asset.condition}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[asset.status] || "bg-gray-100"}>
                        {asset.status}
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
