"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";

interface ControlItem {
  id: number;
  itemNo: number;
  name: string;
  frequency: string;
  notes: string;
  process?: { name: string };
  responsibleDept?: { name: string };
}

export default function RecordPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<ControlItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split("T")[0],
    shift: "",
    result: "",
    findings: "",
    remarks: "",
  });

  useEffect(() => {
    if (params.id) {
      fetch(`/api/control-items/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setItem(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/inspection-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          controlItemId: Number(params.id),
          inspectionDate: formData.recordDate,
          shift: formData.shift,
          result: formData.result,
          findings: formData.findings,
        }),
      });

      if (response.ok) {
        alert("기록이 저장되었습니다.");
        router.push("/control-items");
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">로딩 중...</div>;
  }

  if (!item) {
    return <div className="p-8">관리항목을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/control-items">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">기록 입력</h1>
          <p className="text-muted-foreground">
            #{item.itemNo} - {item.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>기록 정보 입력</CardTitle>
            <CardDescription>
              프로세스: {item.process?.name || "-"} | 주기: {item.frequency} | 주관: {item.responsibleDept?.name || "-"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="recordDate">기록일자 *</Label>
                  <Input
                    id="recordDate"
                    type="date"
                    value={formData.recordDate}
                    onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">조/교대</Label>
                  <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A조 (주간)</SelectItem>
                      <SelectItem value="B">B조 (야간)</SelectItem>
                      <SelectItem value="C">C조</SelectItem>
                      <SelectItem value="상시">상시</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result">결과 *</Label>
                  <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v })} required>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="합격">합격 (적합)</SelectItem>
                      <SelectItem value="불합격">불합격 (부적합)</SelectItem>
                      <SelectItem value="조건부">조건부</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="findings">점검내용 / 발견사항</Label>
                <Textarea
                  id="findings"
                  placeholder="점검 결과, 측정값, 발견사항 등을 입력하세요..."
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">비고</Label>
                <Textarea
                  id="remarks"
                  placeholder="기타 특이사항..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>첨부파일</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, Excel, 이미지 파일 지원</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  취소
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "저장 중..." : "저장"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">관리항목 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">관리항목</p>
                <p className="font-medium">{item.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">프로세스</p>
                <p>{item.process?.name || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">관리주기</p>
                <p>{item.frequency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">주관부서</p>
                <p>{item.responsibleDept?.name || "-"}</p>
              </div>
              {item.notes && (
                <div>
                  <p className="text-muted-foreground">비고</p>
                  <p className="text-xs">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">최근 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">최근 기록이 없습니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
