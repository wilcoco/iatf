"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, Plus, Save, Trash2, Search, CheckCircle, XCircle, BarChart3 } from "lucide-react";

type Judgment = "합격" | "불합격";

interface SampleInspection {
  id: number;
  inspectionDate: string;
  partName: string;
  lotNo: string;
  lotQty: number;
  sampleSize: number;
  aql: string;
  ac: number;
  re: number;
  defects: number;
  judgment: Judgment;
  inspector: string;
  remarks: string;
}

const AQL_OPTIONS = ["0.65", "1.0", "1.5", "2.5", "4.0"];

const initialHistory: SampleInspection[] = [
  {
    id: 1,
    inspectionDate: "2026-06-18",
    partName: "GV80 / 도어 트림",
    lotNo: "LOT-20260618-01",
    lotQty: 1200,
    sampleSize: 80,
    aql: "1.0",
    ac: 2,
    re: 3,
    defects: 1,
    judgment: "합격",
    inspector: "김검사",
    remarks: "정상",
  },
  {
    id: 2,
    inspectionDate: "2026-06-17",
    partName: "GV70 / 콘솔 박스",
    lotNo: "LOT-20260617-03",
    lotQty: 800,
    sampleSize: 50,
    aql: "1.5",
    ac: 2,
    re: 3,
    defects: 4,
    judgment: "불합격",
    inspector: "이품질",
    remarks: "스크래치 다수 발생, 재검사 요청",
  },
  {
    id: 3,
    inspectionDate: "2026-06-16",
    partName: "G90 / 인스트루먼트 패널",
    lotNo: "LOT-20260616-02",
    lotQty: 1500,
    sampleSize: 125,
    aql: "0.65",
    ac: 2,
    re: 3,
    defects: 0,
    judgment: "합격",
    inspector: "박생산",
    remarks: "이상 없음",
  },
  {
    id: 4,
    inspectionDate: "2026-06-15",
    partName: "GV80 / 글로브 박스",
    lotNo: "LOT-20260615-05",
    lotQty: 600,
    sampleSize: 50,
    aql: "2.5",
    ac: 3,
    re: 4,
    defects: 2,
    judgment: "합격",
    inspector: "김검사",
    remarks: "정상",
  },
  {
    id: 5,
    inspectionDate: "2026-06-14",
    partName: "GV70 / 사이드 가니쉬",
    lotNo: "LOT-20260614-01",
    lotQty: 2000,
    sampleSize: 200,
    aql: "1.0",
    ac: 5,
    re: 6,
    defects: 7,
    judgment: "불합격",
    inspector: "최검사",
    remarks: "치수 불량으로 전수검사 전환",
  },
];

interface FormState {
  inspectionDate: string;
  partName: string;
  lotNo: string;
  lotQty: string;
  sampleSize: string;
  aql: string;
  ac: string;
  defects: string;
  inspector: string;
  remarks: string;
}

const emptyForm: FormState = {
  inspectionDate: "",
  partName: "",
  lotNo: "",
  lotQty: "",
  sampleSize: "",
  aql: "1.0",
  ac: "",
  defects: "",
  inspector: "",
  remarks: "",
};

export default function SampleHistoryPage() {
  const [activeTab, setActiveTab] = useState("register");
  const [history, setHistory] = useState<SampleInspection[]>(initialHistory);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState("");

  const acNum = Number(form.ac);
  const defectsNum = Number(form.defects);
  const hasJudgmentInputs = form.ac !== "" && form.defects !== "";
  const currentJudgment: Judgment = defectsNum <= acNum ? "합격" : "불합격";

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (
      !form.inspectionDate ||
      !form.partName.trim() ||
      !form.lotNo.trim() ||
      form.lotQty === "" ||
      form.sampleSize === "" ||
      form.ac === "" ||
      form.defects === "" ||
      !form.inspector.trim()
    ) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    const newId = history.length > 0 ? Math.max(...history.map((h) => h.id)) + 1 : 1;
    const acValue = Number(form.ac);
    const defectsValue = Number(form.defects);

    const newRecord: SampleInspection = {
      id: newId,
      inspectionDate: form.inspectionDate,
      partName: form.partName.trim(),
      lotNo: form.lotNo.trim(),
      lotQty: Number(form.lotQty),
      sampleSize: Number(form.sampleSize),
      aql: form.aql,
      ac: acValue,
      re: acValue + 1,
      defects: defectsValue,
      judgment: defectsValue <= acValue ? "합격" : "불합격",
      inspector: form.inspector.trim(),
      remarks: form.remarks.trim(),
    };

    setHistory((prev) => [newRecord, ...prev]);
    setForm(emptyForm);
    alert("샘플검사 이력이 저장되었습니다.");
  };

  const handleDelete = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const filteredHistory = history.filter((h) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      h.partName.toLowerCase().includes(q) || h.lotNo.toLowerCase().includes(q)
    );
  });

  const totalLots = history.length;
  const passCount = history.filter((h) => h.judgment === "합격").length;
  const failCount = history.filter((h) => h.judgment === "불합격").length;
  const passRate = totalLots > 0 ? Math.round((passCount / totalLots) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">샘플검사 이력</h1>
        <p className="text-muted-foreground">
          로트별 샘플검사 이력을 등록하고 AQL 기준에 따른 합격/불합격 판정을 관리합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            샘플검사 이력관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="register">샘플검사 등록</TabsTrigger>
              <TabsTrigger value="history">검사 이력</TabsTrigger>
            </TabsList>

            {/* 샘플검사 등록 */}
            <TabsContent value="register" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">검사일</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={form.inspectionDate}
                    onChange={(e) => updateField("inspectionDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partName">차종 / 부품</Label>
                  <Input
                    id="partName"
                    placeholder="예: GV80 / 도어 트림"
                    value={form.partName}
                    onChange={(e) => updateField("partName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lotNo">로트번호</Label>
                  <Input
                    id="lotNo"
                    placeholder="예: LOT-20260622-01"
                    value={form.lotNo}
                    onChange={(e) => updateField("lotNo", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lotQty">로트수량</Label>
                  <Input
                    id="lotQty"
                    type="number"
                    min={0}
                    placeholder="예: 1200"
                    value={form.lotQty}
                    onChange={(e) => updateField("lotQty", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sampleSize">샘플수 (n)</Label>
                  <Input
                    id="sampleSize"
                    type="number"
                    min={0}
                    placeholder="예: 80"
                    value={form.sampleSize}
                    onChange={(e) => updateField("sampleSize", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aql">AQL</Label>
                  <Select value={form.aql} onValueChange={(v) => updateField("aql", v)}>
                    <SelectTrigger id="aql">
                      <SelectValue placeholder="AQL 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {AQL_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ac">Ac (합격품질 수)</Label>
                  <Input
                    id="ac"
                    type="number"
                    min={0}
                    placeholder="예: 2"
                    value={form.ac}
                    onChange={(e) => updateField("ac", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defects">부적합수</Label>
                  <Input
                    id="defects"
                    type="number"
                    min={0}
                    placeholder="예: 1"
                    value={form.defects}
                    onChange={(e) => updateField("defects", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspector">검사자</Label>
                  <Input
                    id="inspector"
                    placeholder="예: 김검사"
                    value={form.inspector}
                    onChange={(e) => updateField("inspector", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">비고</Label>
                <Textarea
                  id="remarks"
                  placeholder="특이사항을 입력하세요."
                  value={form.remarks}
                  onChange={(e) => updateField("remarks", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-lg border p-4">
                <span className="text-sm font-medium">판정 (Re = Ac + 1):</span>
                {hasJudgmentInputs ? (
                  currentJudgment === "합격" ? (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-1 h-3.5 w-3.5" />
                      합격
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      불합격
                    </Badge>
                  )
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Ac와 부적합수를 입력하면 자동 판정됩니다.
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
                <Button variant="outline" onClick={() => setForm(emptyForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  초기화
                </Button>
              </div>
            </TabsContent>

            {/* 검사 이력 */}
            <TabsContent value="history" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      총 검사 로트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalLots}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      합격
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{passCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      불합격
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{failCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      합격률
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{passRate}%</div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="부품 또는 로트번호 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>검사일</TableHead>
                      <TableHead>차종 / 부품</TableHead>
                      <TableHead>로트번호</TableHead>
                      <TableHead className="text-right">로트수량</TableHead>
                      <TableHead className="text-right">샘플수</TableHead>
                      <TableHead>AQL</TableHead>
                      <TableHead className="text-right">부적합수</TableHead>
                      <TableHead>판정</TableHead>
                      <TableHead>검사자</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                          검사 이력이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell>{h.inspectionDate}</TableCell>
                          <TableCell className="font-medium">{h.partName}</TableCell>
                          <TableCell>{h.lotNo}</TableCell>
                          <TableCell className="text-right">{h.lotQty.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{h.sampleSize}</TableCell>
                          <TableCell>{h.aql}</TableCell>
                          <TableCell className="text-right">{h.defects}</TableCell>
                          <TableCell>
                            {h.judgment === "합격" ? (
                              <Badge className="bg-green-600 hover:bg-green-700">합격</Badge>
                            ) : (
                              <Badge variant="destructive">불합격</Badge>
                            )}
                          </TableCell>
                          <TableCell>{h.inspector}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(h.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
