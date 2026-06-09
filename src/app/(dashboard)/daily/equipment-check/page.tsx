"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const equipmentList = [
  { id: 1, assetNo: "EQ-001", name: "사출기 #1", location: "사출동", status: "점검완료" },
  { id: 2, assetNo: "EQ-002", name: "사출기 #2", location: "사출동", status: "점검완료" },
  { id: 3, assetNo: "EQ-003", name: "사출기 #3", location: "사출동", status: "미점검" },
  { id: 4, assetNo: "EQ-004", name: "도장부스 #1", location: "도장동", status: "이상발생" },
  { id: 5, assetNo: "EQ-005", name: "도장부스 #2", location: "도장동", status: "점검완료" },
  { id: 6, assetNo: "EQ-006", name: "조립라인 #1", location: "조립동", status: "미점검" },
];

const recentChecks = [
  {
    id: 1,
    equipment: "사출기 #1",
    checkDate: "2026-06-09",
    shift: "A조",
    checker: "김철수",
    overallStatus: "정상",
    items: { appearance: "OK", sound: "OK", vibration: "OK", oilLevel: "OK" },
  },
  {
    id: 2,
    equipment: "사출기 #2",
    checkDate: "2026-06-09",
    shift: "A조",
    checker: "박영희",
    overallStatus: "정상",
    items: { appearance: "OK", sound: "OK", vibration: "OK", oilLevel: "OK" },
  },
  {
    id: 3,
    equipment: "도장부스 #1",
    checkDate: "2026-06-09",
    shift: "A조",
    checker: "이민호",
    overallStatus: "이상",
    items: { appearance: "OK", sound: "NG", vibration: "OK", oilLevel: "OK" },
  },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "OK" || status === "정상" || status === "점검완료") {
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  }
  if (status === "NG" || status === "이상" || status === "이상발생") {
    return <XCircle className="h-5 w-5 text-red-600" />;
  }
  return <AlertCircle className="h-5 w-5 text-yellow-600" />;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "success" | "error" | "warning" | "default"> = {
    점검완료: "success",
    정상: "success",
    OK: "success",
    이상발생: "error",
    이상: "error",
    NG: "error",
    미점검: "warning",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
}

export default function EquipmentCheckPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedShift, setSelectedShift] = useState("A조");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비 일상점검</h1>
          <p className="text-muted-foreground">일일 설비 점검 기록 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          점검 기록
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>점검일자</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>조</Label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="A조">A조</option>
                <option value="B조">B조</option>
                <option value="C조">C조</option>
              </select>
            </div>
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              조회
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 설비 점검 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>설비 점검 현황</CardTitle>
            <CardDescription>오늘 점검 대상 설비</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equipmentList.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon status={eq.status} />
                    <div>
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.assetNo} · {eq.location}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={eq.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 점검 입력 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>점검 입력</CardTitle>
            <CardDescription>설비를 선택하여 점검 결과를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>설비 선택</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>사출기 #3</option>
                    <option>조립라인 #1</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>점검자</Label>
                  <Input placeholder="점검자 이름" />
                </div>
              </div>

              <div className="space-y-3">
                <Label>점검 항목</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["외관상태", "이상음", "이상진동", "오일레벨", "공기압", "온도"].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">{item}</span>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" className="h-8 w-12">
                          OK
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="h-8 w-12">
                          NG
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>비고</Label>
                <textarea
                  className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="특이사항 입력..."
                />
              </div>

              <Button type="submit" className="w-full">
                점검 완료
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 최근 점검 기록 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 점검 기록</CardTitle>
          <CardDescription>오늘 완료된 점검 기록</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>설비</TableHead>
                <TableHead>점검일</TableHead>
                <TableHead>조</TableHead>
                <TableHead>점검자</TableHead>
                <TableHead>외관</TableHead>
                <TableHead>이상음</TableHead>
                <TableHead>진동</TableHead>
                <TableHead>오일</TableHead>
                <TableHead>종합</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell className="font-medium">{check.equipment}</TableCell>
                  <TableCell>{check.checkDate}</TableCell>
                  <TableCell>{check.shift}</TableCell>
                  <TableCell>{check.checker}</TableCell>
                  <TableCell>
                    <StatusIcon status={check.items.appearance} />
                  </TableCell>
                  <TableCell>
                    <StatusIcon status={check.items.sound} />
                  </TableCell>
                  <TableCell>
                    <StatusIcon status={check.items.vibration} />
                  </TableCell>
                  <TableCell>
                    <StatusIcon status={check.items.oilLevel} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={check.overallStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
