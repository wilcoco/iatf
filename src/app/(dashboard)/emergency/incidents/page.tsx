"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Siren } from "lucide-react";

interface EmergencyIncident {
  id: number;
  incidentNumber: string;
  description: string;
  occurredAt: string;
  resolvedAt: string | null;
  status: string;
  emergencyType?: { name: string };
  reportedBy?: { name: string };
}

export default function EmergencyIncidentsPage() {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emergency/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    reported: "bg-red-100 text-red-800",
    responding: "bg-orange-100 text-orange-800",
    contained: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    reported: "발생",
    responding: "대응중",
    contained: "통제중",
    resolved: "해결",
    closed: "종결",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">비상 상황</h1>
          <p className="text-muted-foreground">비상상황 발생 및 대응 이력</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          비상상황 등록
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Siren className="h-5 w-5" />
            비상상황 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : incidents.length === 0 ? (
            <p className="text-muted-foreground">등록된 비상상황이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>발생번호</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>신고자</TableHead>
                  <TableHead>발생시각</TableHead>
                  <TableHead>해결시각</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono">{incident.incidentNumber}</TableCell>
                    <TableCell>{incident.emergencyType?.name || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{incident.description}</TableCell>
                    <TableCell>{incident.reportedBy?.name || "-"}</TableCell>
                    <TableCell>{new Date(incident.occurredAt).toLocaleString("ko-KR")}</TableCell>
                    <TableCell>{incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString("ko-KR") : "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[incident.status] || "bg-gray-100"}`}>
                        {statusLabels[incident.status] || incident.status}
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
