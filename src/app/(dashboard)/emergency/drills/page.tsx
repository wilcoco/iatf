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
import { AlertTriangle, Plus, Save } from "lucide-react";

interface EmergencyDrill {
  id: number;
  drillDate: string;
  drillType: string;
  scenario: string;
  participants: number;
  duration: string;
  responseTime: string;
  findings: string;
  improvements: string;
  effectiveness: string;
  conductor: string;
}

export default function EmergencyDrillsPage() {
  const [drills, setDrills] = useState<EmergencyDrill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    drillDate: new Date().toISOString().split("T")[0],
    drillType: "",
    scenario: "",
    participants: "",
    duration: "",
    responseTime: "",
    findings: "",
    improvements: "",
    effectiveness: "",
    conductor: "",
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDrill: EmergencyDrill = {
      id: Date.now(),
      drillDate: formData.drillDate,
      drillType: formData.drillType,
      scenario: formData.scenario,
      participants: Number(formData.participants) || 0,
      duration: formData.duration,
      responseTime: formData.responseTime,
      findings: formData.findings,
      improvements: formData.improvements,
      effectiveness: formData.effectiveness,
      conductor: formData.conductor,
    };
    setDrills([newDrill, ...drills]);
    setShowForm(false);
    setFormData({
      drillDate: new Date().toISOString().split("T")[0],
      drillType: "",
      scenario: "",
      participants: "",
      duration: "",
      responseTime: "",
      findings: "",
      improvements: "",
      effectiveness: "",
      conductor: "",
    });
    alert("훈련실적이 등록되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">훈련계획/실적</h1>
          <p className="text-muted-foreground">비상대응훈련 계획 및 실적 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          훈련 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>비상대응훈련 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>훈련일자 *</Label>
                  <Input
                    type="date"
                    value={formData.drillDate}
                    onChange={(e) => setFormData({ ...formData, drillDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>훈련유형 *</Label>
                  <Select value={formData.drillType} onValueChange={(v) => setFormData({ ...formData, drillType: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="전력공급중단">전력공급중단</SelectItem>
                      <SelectItem value="설비고장">설비고장/생산설비손상</SelectItem>
                      <SelectItem value="인력부족">인력부족</SelectItem>
                      <SelectItem value="자재공급차질">자재/부품공급차질</SelectItem>
                      <SelectItem value="정보시스템장애">정보시스템/네트워크장애</SelectItem>
                      <SelectItem value="자연재해">자연재해</SelectItem>
                      <SelectItem value="화재폭발">화재 또는 폭발사고</SelectItem>
                      <SelectItem value="전염병">전염병 및 펜더믹</SelectItem>
                      <SelectItem value="보안사고">보안사고/사이버공격</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>참여인원</Label>
                  <Input
                    type="number"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>훈련시간</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="예: 2시간"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>시나리오</Label>
                  <Textarea
                    value={formData.scenario}
                    onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                    placeholder="훈련 시나리오 내용"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>훈련결과/발견사항</Label>
                  <Textarea
                    value={formData.findings}
                    onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                    placeholder="훈련 결과 및 발견사항"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>대응시간</Label>
                  <Input
                    value={formData.responseTime}
                    onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                    placeholder="예: 15분"
                  />
                </div>
                <div className="space-y-2">
                  <Label>효과성평가 *</Label>
                  <Select value={formData.effectiveness} onValueChange={(v) => setFormData({ ...formData, effectiveness: v })} required>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="효과적">효과적</SelectItem>
                      <SelectItem value="보통">보통</SelectItem>
                      <SelectItem value="미흡">미흡</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>훈련책임자 *</Label>
                  <Input
                    value={formData.conductor}
                    onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                    placeholder="훈련 책임자"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>개선사항</Label>
                <Textarea
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  placeholder="개선 필요사항"
                  rows={2}
                />
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
            <AlertTriangle className="h-5 w-5" />
            훈련 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : drills.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">훈련 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>훈련일자</TableHead>
                  <TableHead>훈련유형</TableHead>
                  <TableHead className="text-right">참여인원</TableHead>
                  <TableHead>훈련시간</TableHead>
                  <TableHead>대응시간</TableHead>
                  <TableHead>효과성</TableHead>
                  <TableHead>책임자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drills.map((drill) => (
                  <TableRow key={drill.id}>
                    <TableCell>{drill.drillDate}</TableCell>
                    <TableCell><Badge variant="outline">{drill.drillType}</Badge></TableCell>
                    <TableCell className="text-right">{drill.participants}명</TableCell>
                    <TableCell>{drill.duration || "-"}</TableCell>
                    <TableCell>{drill.responseTime || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={
                        drill.effectiveness === "효과적" ? "success" :
                        drill.effectiveness === "보통" ? "warning" : "destructive"
                      }>
                        {drill.effectiveness}
                      </Badge>
                    </TableCell>
                    <TableCell>{drill.conductor}</TableCell>
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
