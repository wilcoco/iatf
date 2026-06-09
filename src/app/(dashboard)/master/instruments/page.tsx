"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Gauge } from "lucide-react";

interface Instrument {
  id: number;
  instrumentNo: string;
  name: string;
  type: string;
  range: string;
  resolution: string;
  calibrationCycle: number;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  status: string;
}

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instruments")
      .then((res) => res.json())
      .then((data) => {
        setInstruments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">계측기 관리</h1>
          <p className="text-muted-foreground">계측기 마스터 및 교정 관리</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          계측기 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            계측기 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>기기번호</TableHead>
                  <TableHead>계측기명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>측정범위</TableHead>
                  <TableHead>분해능</TableHead>
                  <TableHead>교정주기</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instruments.map((inst) => (
                  <TableRow key={inst.id}>
                    <TableCell className="font-mono">{inst.instrumentNo}</TableCell>
                    <TableCell className="font-medium">{inst.name}</TableCell>
                    <TableCell>{inst.type}</TableCell>
                    <TableCell>{inst.range}</TableCell>
                    <TableCell>{inst.resolution}</TableCell>
                    <TableCell>{inst.calibrationCycle}개월</TableCell>
                    <TableCell>
                      <Badge variant={inst.status === "active" ? "success" : "warning"}>
                        {inst.status === "active" ? "사용중" : "보관"}
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
