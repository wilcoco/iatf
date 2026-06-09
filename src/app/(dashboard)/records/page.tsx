"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";

interface ControlItem {
  id: number;
  itemNo: number;
  name: string;
  frequency: string;
  process?: { id: number; name: string };
  targetDept?: { name: string };
  responsibleDept?: { name: string };
  notes: string;
}

interface ProcessGroup {
  processId: number;
  processName: string;
  items: ControlItem[];
}

export default function RecordsPage() {
  const [items, setItems] = useState<ControlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("");
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);

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
    "일": "bg-red-100 text-red-800 border-red-200",
    "주": "bg-orange-100 text-orange-800 border-orange-200",
    "월": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "반기": "bg-blue-100 text-blue-800 border-blue-200",
    "6개월": "bg-blue-100 text-blue-800 border-blue-200",
    "년": "bg-green-100 text-green-800 border-green-200",
    "발생시": "bg-purple-100 text-purple-800 border-purple-200",
    "변경시": "bg-purple-100 text-purple-800 border-purple-200",
  };

  const getFrequencyColor = (freq: string) => {
    for (const key of Object.keys(frequencyColors)) {
      if (freq?.includes(key)) return frequencyColors[key];
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.process?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.itemNo.toString().includes(search);
    const matchesFrequency = !frequencyFilter || item.frequency?.includes(frequencyFilter);
    return matchesSearch && matchesFrequency;
  });

  const groupedByProcess: ProcessGroup[] = filteredItems.reduce((acc, item) => {
    const processId = item.process?.id || 0;
    const processName = item.process?.name || "미분류";
    let group = acc.find((g) => g.processId === processId);
    if (!group) {
      group = { processId, processName, items: [] };
      acc.push(group);
    }
    group.items.push(item);
    return acc;
  }, [] as ProcessGroup[]);

  groupedByProcess.sort((a, b) => {
    const minA = Math.min(...a.items.map((i) => i.itemNo));
    const minB = Math.min(...b.items.map((i) => i.itemNo));
    return minA - minB;
  });

  const frequencies = ["일", "주", "월", "반기", "년", "발생시"];

  const frequencyCounts = frequencies.reduce((acc, freq) => {
    acc[freq] = items.filter((item) => item.frequency?.includes(freq)).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">기록 입력</h1>
        <p className="text-muted-foreground">IATF 16949 품질관리 118개 항목 기록</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card
          className={`cursor-pointer transition-all ${
            frequencyFilter === "" ? "ring-2 ring-primary" : "hover:bg-muted/50"
          }`}
          onClick={() => setFrequencyFilter("")}
        >
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{items.length}</p>
            <p className="text-xs text-muted-foreground">전체</p>
          </CardContent>
        </Card>
        {frequencies.map((freq) => (
          <Card
            key={freq}
            className={`cursor-pointer transition-all ${
              frequencyFilter === freq ? "ring-2 ring-primary" : "hover:bg-muted/50"
            }`}
            onClick={() => setFrequencyFilter(freq === frequencyFilter ? "" : freq)}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{frequencyCounts[freq] || 0}</p>
              <p className={`text-xs px-2 py-0.5 rounded ${getFrequencyColor(freq)}`}>{freq}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="항목명, 프로세스, 번호로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByProcess.map((group) => (
            <Card key={group.processId} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors py-4"
                onClick={() =>
                  setExpandedProcess(expandedProcess === group.processId ? null : group.processId)
                }
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    {group.processName}
                    <Badge variant="secondary">{group.items.length}개</Badge>
                  </CardTitle>
                  <ChevronRight
                    className={`h-5 w-5 transition-transform ${
                      expandedProcess === group.processId ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </CardHeader>
              {expandedProcess === group.processId && (
                <CardContent className="pt-0">
                  <div className="border rounded-lg divide-y">
                    {group.items
                      .sort((a, b) => a.itemNo - b.itemNo)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-mono text-muted-foreground w-8">
                                #{item.itemNo}
                              </span>
                              <span className="font-medium">{item.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${getFrequencyColor(
                                  item.frequency
                                )}`}
                              >
                                {item.frequency}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-1 ml-11 line-clamp-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {item.responsibleDept?.name || "-"}
                            </span>
                            <Link
                              href={`/records/${item.id}/input`}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                              <Calendar className="h-4 w-4" />
                              기록입력
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
