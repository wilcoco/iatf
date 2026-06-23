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
import { FileText, Plus, Save, Trash2, Search, CheckCircle, XCircle, ClipboardCheck } from "lucide-react";

type Judgement = "OK" | "NG";

interface InspectionItem {
  id: number;
  name: string;
  spec: string;
  measured: string;
  result: Judgement;
}

interface TestReport {
  id: number;
  reportNo: string;
  product: string;
  inspectionDate: string;
  inspector: string;
  items: InspectionItem[];
  overall: Judgement;
  remark: string;
}

const initialReports: TestReport[] = [
  {
    id: 1,
    reportNo: "TR-2026-0101",
    product: "범퍼 / 프론트 범퍼 ASSY",
    inspectionDate: "2026-06-10",
    inspector: "김검사",
    items: [
      { id: 1, name: "외관", spec: "스크래치/이물 없음", measured: "양호", result: "OK" },
      { id: 2, name: "치수(전장)", spec: "1850 ± 1.5 mm", measured: "1850.4", result: "OK" },
      { id: 3, name: "도막두께", spec: "20 ~ 30 ㎛", measured: "24.5", result: "OK" },
    ],
    overall: "OK",
    remark: "초도품 합격, 양산 진행 가능.",
  },
  {
    id: 2,
    reportNo: "TR-2026-0102",
    product: "도어트림 / 리어 도어트림",
    inspectionDate: "2026-06-12",
    inspector: "이품질",
    items: [
      { id: 1, name: "외관", spec: "사출 버 없음", measured: "버 발생", result: "NG" },
      { id: 2, name: "치수(폭)", spec: "420 ± 1.0 mm", measured: "420.3", result: "OK" },
      { id: 3, name: "체결력", spec: "50 N 이상", measured: "53", result: "OK" },
    ],
    overall: "NG",
    remark: "사출 버 발생으로 금형 점검 요청.",
  },
  {
    id: 3,
    reportNo: "TR-2026-0103",
    product: "콘솔 / 센터 콘솔 ASSY",
    inspectionDate: "2026-06-15",
    inspector: "박측정",
    items: [
      { id: 1, name: "외관", spec: "도장 균일", measured: "양호", result: "OK" },
      { id: 2, name: "치수(높이)", spec: "180 ± 1.0 mm", measured: "180.2", result: "OK" },
    ],
    overall: "OK",
    remark: "",
  },
];

const emptyItem = (id: number): InspectionItem => ({
  id,
  name: "",
  spec: "",
  measured: "",
  result: "OK",
});

function OverallBadge({ overall }: { overall: Judgement }) {
  if (overall === "OK") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle className="mr-1 h-3 w-3" />
        OK
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
      <XCircle className="mr-1 h-3 w-3" />
      NG
    </Badge>
  );
}

export default function TestReportPage() {
  const [activeTab, setActiveTab] = useState("write");
  const [reports, setReports] = useState<TestReport[]>(initialReports);
  const [search, setSearch] = useState("");

  const [reportNo, setReportNo] = useState("");
  const [product, setProduct] = useState("");
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split("T")[0]);
  const [inspector, setInspector] = useState("");
  const [remark, setRemark] = useState("");
  const [items, setItems] = useState<InspectionItem[]>([emptyItem(1)]);

  const overall: Judgement = items.some((i) => i.result === "NG") ? "NG" : "OK";

  const addItem = () => {
    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, emptyItem(nextId)]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: keyof InspectionItem, value: string) => {
    setItems(
      items.map((i) =>
        i.id === id ? { ...i, [field]: field === "result" ? (value as Judgement) : value } : i,
      ),
    );
  };

  const resetForm = () => {
    setReportNo("");
    setProduct("");
    setInspectionDate(new Date().toISOString().split("T")[0]);
    setInspector("");
    setRemark("");
    setItems([emptyItem(1)]);
  };

  const handleSave = () => {
    if (!reportNo.trim() || !product.trim() || !inspector.trim()) {
      alert("성적서번호, 차종/부품, 검사자를 입력하세요.");
      return;
    }
    const validItems = items.filter((i) => i.name.trim() !== "");
    if (validItems.length === 0) {
      alert("검사항목을 1개 이상 입력하세요.");
      return;
    }
    const nextId = reports.length > 0 ? Math.max(...reports.map((r) => r.id)) + 1 : 1;
    const newReport: TestReport = {
      id: nextId,
      reportNo: reportNo.trim(),
      product: product.trim(),
      inspectionDate,
      inspector: inspector.trim(),
      items: validItems,
      overall: validItems.some((i) => i.result === "NG") ? "NG" : "OK",
      remark: remark.trim(),
    };
    setReports([newReport, ...reports]);
    resetForm();
    setActiveTab("list");
    alert("성적서가 저장되었습니다.");
  };

  const filteredReports = reports.filter(
    (r) =>
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.reportNo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">검사 성적서 관리</h1>
        <p className="text-muted-foreground">유검사 성적서 등록 및 조회</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            검사 성적서 (유검사)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="write">성적서 작성</TabsTrigger>
              <TabsTrigger value="list">성적서 목록</TabsTrigger>
            </TabsList>

            {/* 성적서 작성 */}
            <TabsContent value="write" className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportNo">성적서번호</Label>
                  <Input
                    id="reportNo"
                    placeholder="예: TR-2026-0104"
                    value={reportNo}
                    onChange={(e) => setReportNo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">차종/부품</Label>
                  <Input
                    id="product"
                    placeholder="예: 범퍼 / 프론트 범퍼 ASSY"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">검사일</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspector">검사자</Label>
                  <Input
                    id="inspector"
                    placeholder="예: 김검사"
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    검사항목
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="mr-1 h-4 w-4" />
                    항목 추가
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>검사항목</TableHead>
                        <TableHead>규격(SPEC)</TableHead>
                        <TableHead>측정값</TableHead>
                        <TableHead className="w-[120px]">판정</TableHead>
                        <TableHead className="w-[60px]">삭제</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              placeholder="예: 외관"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="예: 20 ~ 30 ㎛"
                              value={item.spec}
                              onChange={(e) => updateItem(item.id, "spec", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="예: 24.5"
                              value={item.measured}
                              onChange={(e) => updateItem(item.id, "measured", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={item.result}
                              onValueChange={(v) => updateItem(item.id, "result", v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OK">OK</SelectItem>
                                <SelectItem value="NG">NG</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-4">
                <span className="font-medium">종합판정:</span>
                <OverallBadge overall={overall} />
                <span className="text-sm text-muted-foreground">
                  (검사항목 중 NG가 1개라도 있으면 NG)
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remark">비고</Label>
                <Textarea
                  id="remark"
                  placeholder="특이사항을 입력하세요."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  초기화
                </Button>
                <Button type="button" onClick={handleSave}>
                  <Save className="mr-1 h-4 w-4" />
                  저장
                </Button>
              </div>
            </TabsContent>

            {/* 성적서 목록 */}
            <TabsContent value="list" className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="부품 또는 성적서번호 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>성적서번호</TableHead>
                      <TableHead>차종/부품</TableHead>
                      <TableHead>검사일</TableHead>
                      <TableHead>검사자</TableHead>
                      <TableHead className="text-center">항목수</TableHead>
                      <TableHead className="text-center">종합판정</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.reportNo}</TableCell>
                          <TableCell>{r.product}</TableCell>
                          <TableCell>{r.inspectionDate}</TableCell>
                          <TableCell>{r.inspector}</TableCell>
                          <TableCell className="text-center">{r.items.length}</TableCell>
                          <TableCell className="text-center">
                            <OverallBadge overall={r.overall} />
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
