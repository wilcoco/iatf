"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Siren } from "lucide-react";

interface EmergencyDrill {
  id: number;
  planDate: string | null;
  actualDate: string | null;
  scenario: string;
  responseTime: number | null;
  effectiveness: string;
  findings: string;
  emergencyType?: { name: string };
  conductedBy?: { name: string };
}

export default function EmergencyDrillsPage() {
  const [drills, setDrills] = useState<EmergencyDrill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emergency/incidents")
      .then((res) => res.json())
      .then((data) => {
        setDrills(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const effectivenessColors: Record<string, string> = {
    "효과적": "bg-green-100 text-green-800",
    "보통": "bg-yellow-100 text-yellow-800",
    "미흡": "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비상 훈련</h1>
          <p className="text-muted-foreground">비상대응 훈련 계획 및 실적</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          훈련 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Siren className="h-5 w-5" />
            비상훈련 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : drills.length === 0 ? (
            <p className="text-muted-foreground">등록된 비상훈련이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>비상유형</TableHead>
                  <TableHead>시나리오</TableHead>
                  <TableHead>계획일</TableHead>
                  <TableHead>실시일</TableHead>
                  <TableHead>대응시간</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead>효과성</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drills.map((drill) => (
                  <TableRow key={drill.id}>
                    <TableCell>{drill.emergencyType?.name || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{drill.scenario || "-"}</TableCell>
                    <TableCell>{drill.planDate ? new Date(drill.planDate).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>{drill.actualDate ? new Date(drill.actualDate).toLocaleDateString("ko-KR") : "-"}</TableCell>
                    <TableCell>{drill.responseTime ? `${drill.responseTime}분` : "-"}</TableCell>
                    <TableCell>{drill.conductedBy?.name || "-"}</TableCell>
                    <TableCell>
                      {drill.effectiveness && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${effectivenessColors[drill.effectiveness] || "bg-gray-100"}`}>
                          {drill.effectiveness}
                        </span>
                      )}
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
