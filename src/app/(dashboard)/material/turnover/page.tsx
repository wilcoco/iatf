"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, Save, Search } from "lucide-react";

interface TurnoverRecord {
  id: number;
  period: string;
  itemCategory: string;
  receivedAmount: number;
  averageInventory: number;
  turnoverRate: number;
  target: number;
  result: string;
}

export default function TurnoverPage() {
  const [records, setRecords] = useState<TurnoverRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    period: "",
    itemCategory: "",
    receivedAmount: "",
    averageInventory: "",
    target: "",
    result: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const calculateTurnoverRate = (receivedAmount: number, averageInventory: number) => {
    if (averageInventory === 0) return 0;
    return (receivedAmount / averageInventory) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const receivedAmount = Number(formData.receivedAmount);
    const averageInventory = Number(formData.averageInventory);
    const turnoverRate = calculateTurnoverRate(receivedAmount, averageInventory);

    const newRecord: TurnoverRecord = {
      id: Date.now(),
      period: formData.period,
      itemCategory: formData.itemCategory,
      receivedAmount: receivedAmount,
      averageInventory: averageInventory,
      turnoverRate: turnoverRate,
      target: Number(formData.target),
      result: formData.result,
    };
    setRecords([newRecord, ...records]);
    setShowForm(false);
    setFormData({
      period: "",
      itemCategory: "",
      receivedAmount: "",
      averageInventory: "",
      target: "",
      result: "",
    });
    alert("재고회전율이 저장되었습니다.");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.period.toLowerCase().includes(search.toLowerCase()) ||
      r.itemCategory.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">재고회전율</h1>
          <p className="text-muted-foreground">자재재고회전율 관리 (입고금액/평균재고금액*100)</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          회전율 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>재고회전율 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>기간 *</Label>
                  <Input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2024-01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>품목분류 *</Label>
                  <Select value={formData.itemCategory} onValueChange={(v) => setFormData({ ...formData, itemCategory: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="원재료">원재료</SelectItem>
                      <SelectItem value="부재료">부재료</SelectItem>
                      <SelectItem value="조립부품">조립부품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>입고금액 *</Label>
                  <Input
                    type="number"
                    value={formData.receivedAmount}
                    onChange={(e) => setFormData({ ...formData, receivedAmount: e.target.value })}
                    placeholder="10000000"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>평균재고금액 *</Label>
                  <Input
                    type="number"
                    value={formData.averageInventory}
                    onChange={(e) => setFormData({ ...formData, averageInventory: e.target.value })}
                    placeholder="5000000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>목표 회전율(%) *</Label>
                  <Input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    placeholder="200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="달성">달성</SelectItem>
                      <SelectItem value="미달성">미달성</SelectItem>
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
          placeholder="기간, 품목분류로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            재고회전율 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">등록된 재고회전율 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기간</TableHead>
                  <TableHead>품목분류</TableHead>
                  <TableHead>입고금액</TableHead>
                  <TableHead>평균재고금액</TableHead>
                  <TableHead>회전율(%)</TableHead>
                  <TableHead>목표(%)</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.period}</TableCell>
                    <TableCell><Badge variant="outline">{record.itemCategory}</Badge></TableCell>
                    <TableCell className="text-right">{record.receivedAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{record.averageInventory.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">{record.turnoverRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{record.target}%</TableCell>
                    <TableCell>
                      <Badge variant={record.result === "달성" ? "success" : "destructive"}>
                        {record.result}
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
