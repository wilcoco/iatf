"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Gauge } from "lucide-react";

interface Calibration {
  id: number;
  calibrationNo: string;
  result: string;
  calibratedAt: string;
  nextCalibrationDate: string;
  instrument?: { code: string; name: string };
  calibratedBy?: { name: string };
}

export default function CalibrationPage() {
  const [calibrations, setCalibrations] = useState<Calibration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quality/calibration")
      .then((res) => res.json())
      .then((data) => {
        setCalibrations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const resultColors: Record<string, string> = {
    pass: "bg-green-100 text-green-800",
    fail: "bg-red-100 text-red-800",
    adjusted: "bg-yellow-100 text-yellow-800",
  };

  const resultLabels: Record<string, string> = {
    pass: "합격",
    fail: "불합격",
    adjusted: "조정후합격",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">교정 관리</h1>
          <p className="text-muted-foreground">계측기 교정 이력 및 일정 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          교정 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            교정 기록 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : calibrations.length === 0 ? (
            <p className="text-muted-foreground">등록된 교정 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>교정번호</TableHead>
                  <TableHead>계측기코드</TableHead>
                  <TableHead>계측기명</TableHead>
                  <TableHead>교정일</TableHead>
                  <TableHead>차기교정일</TableHead>
                  <TableHead>교정자</TableHead>
                  <TableHead>결과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calibrations.map((cal) => (
                  <TableRow key={cal.id}>
                    <TableCell className="font-mono">{cal.calibrationNo}</TableCell>
                    <TableCell className="font-mono">{cal.instrument?.code || "-"}</TableCell>
                    <TableCell>{cal.instrument?.name || "-"}</TableCell>
                    <TableCell>{new Date(cal.calibratedAt).toLocaleDateString("ko-KR")}</TableCell>
                    <TableCell>{cal.nextCalibrationDate ? new Date(cal.nextCalibrationDate).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>{cal.calibratedBy?.name || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultColors[cal.result] || "bg-gray-100"}`}>
                        {resultLabels[cal.result] || cal.result}
                      </span>
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
