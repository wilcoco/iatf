"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Search } from "lucide-react";
import Link from "next/link";

interface ControlItem {
  id: number;
  itemNo: number;
  name: string;
  frequency: string;
  process?: { name: string };
  targetDept?: { name: string };
  responsibleDept?: { name: string };
  notes: string;
}

export default function ControlItemsPage() {
  const [items, setItems] = useState<ControlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("");

  useEffect(() => {
    fetch("/api/control-items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const frequencyColors: Record<string, string> = {
    "일": "bg-red-100 text-red-800",
    "주": "bg-orange-100 text-orange-800",
    "월": "bg-yellow-100 text-yellow-800",
    "반기": "bg-blue-100 text-blue-800",
    "년": "bg-green-100 text-green-800",
    "발생시": "bg-purple-100 text-purple-800",
  };

  const getFrequencyColor = (freq: string) => {
    for (const key of Object.keys(frequencyColors)) {
      if (freq?.includes(key)) return frequencyColors[key];
    }
    return "bg-gray-100 text-gray-800";
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.process?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.itemNo.toString().includes(search);
    const matchesFrequency = !frequencyFilter || item.frequency?.includes(frequencyFilter);
    return matchesSearch && matchesFrequency;
  });

  const frequencies = ["일", "주", "월", "반기", "년", "발생시"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">관리항목 (118개)</h1>
        <p className="text-muted-foreground">IATF 16949 품질경영시스템 관리항목</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="항목명, 프로세스, 번호로 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={frequencyFilter === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFrequencyFilter("")}
          >
            전체
          </Badge>
          {frequencies.map((freq) => (
            <Badge
              key={freq}
              variant={frequencyFilter === freq ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFrequencyFilter(freq)}
            >
              {freq}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            관리항목 목록 ({filteredItems.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">NO</TableHead>
                  <TableHead className="w-48">프로세스</TableHead>
                  <TableHead>관리항목</TableHead>
                  <TableHead className="w-24">주기</TableHead>
                  <TableHead className="w-32">주관부서</TableHead>
                  <TableHead className="w-24">입력</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.itemNo}</TableCell>
                    <TableCell className="text-sm">{item.process?.name || "-"}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.frequency && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFrequencyColor(item.frequency)}`}>
                          {item.frequency}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{item.responsibleDept?.name || "-"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/control-items/${item.id}/record`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        기록하기
                      </Link>
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
