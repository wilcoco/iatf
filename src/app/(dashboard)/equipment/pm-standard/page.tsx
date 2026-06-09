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
import {
  ClipboardCheck,
  Plus,
  Save,
  Search,
  FileText,
  Calendar,
  History,
  Settings,
  Edit,
  Trash2,
  Filter
} from "lucide-react";

// Types
interface PMStandard {
  id: number;
  equipmentName: string;
  equipmentCode: string;
  inspectionPart: string;
  inspectionItem: string;
  inspectionStandard: string;
  inspectionMethod: string;
  inspectionCycle: "daily" | "weekly" | "monthly" | "quarterly" | "semi-annual" | "yearly";
  manager: string;
  line: string;
  purpose: string;
  executionMethod: "self" | "joint" | "external";
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface RevisionHistory {
  id: number;
  pmStandardId: number;
  equipmentName: string;
  inspectionItem: string;
  changeType: "create" | "update" | "delete";
  changeDescription: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  version: number;
}

const CYCLE_OPTIONS = [
  { value: "daily", label: "일", korLabel: "1일" },
  { value: "weekly", label: "주", korLabel: "1주" },
  { value: "monthly", label: "월", korLabel: "1개월" },
  { value: "quarterly", label: "분기", korLabel: "3개월" },
  { value: "semi-annual", label: "반기", korLabel: "6개월" },
  { value: "yearly", label: "년", korLabel: "1년" },
];

const EXECUTION_METHOD_OPTIONS = [
  { value: "self", label: "자체시행", symbol: "□" },
  { value: "joint", label: "공동시행", symbol: "■" },
  { value: "external", label: "외부시행", symbol: "◈" },
];

const LINES = ["사출라인", "도장라인", "조립라인", "검사라인"];

// Sample data based on Excel file
const initialPMStandards: PMStandard[] = [
  {
    id: 1,
    equipmentName: "사출기 하이브리드",
    equipmentCode: "EQ-INJ-001",
    inspectionPart: "전체",
    inspectionItem: "정기점검",
    inspectionStandard: "정기점검 항목 기준",
    inspectionMethod: "점검표에 의한 점검",
    inspectionCycle: "quarterly",
    manager: "차상정",
    line: "사출라인",
    purpose: "설비 중단 예방",
    executionMethod: "joint",
    createdAt: "2017-01-01",
    updatedAt: "2026-06-01",
    version: 3,
  },
  {
    id: 2,
    equipmentName: "유압모터",
    equipmentCode: "EQ-INJ-002",
    inspectionPart: "환기팬",
    inspectionItem: "세척/교체",
    inspectionStandard: "오염 없을것",
    inspectionMethod: "육안점검 및 세척",
    inspectionCycle: "semi-annual",
    manager: "이동주",
    line: "사출라인",
    purpose: "설비 중단 예방",
    executionMethod: "self",
    createdAt: "2017-01-01",
    updatedAt: "2026-05-15",
    version: 2,
  },
  {
    id: 3,
    equipmentName: "제어반",
    equipmentCode: "EQ-INJ-003",
    inspectionPart: "전기계통",
    inspectionItem: "열화상 온도 측정",
    inspectionStandard: "열화상카메라 측정 기준",
    inspectionMethod: "열화상카메라 측정",
    inspectionCycle: "quarterly",
    manager: "이동주",
    line: "사출라인",
    purpose: "설비 중단 예방",
    executionMethod: "self",
    createdAt: "2017-01-01",
    updatedAt: "2026-04-01",
    version: 1,
  },
  {
    id: 4,
    equipmentName: "배럴히터",
    equipmentCode: "EQ-INJ-004",
    inspectionPart: "접점부",
    inspectionItem: "접점 열화 점검",
    inspectionStandard: "접점 열화 없을것",
    inspectionMethod: "육안점검 및 저항측정",
    inspectionCycle: "yearly",
    manager: "이수열",
    line: "사출라인",
    purpose: "설비 중단 예방",
    executionMethod: "self",
    createdAt: "2017-01-01",
    updatedAt: "2026-03-20",
    version: 1,
  },
  {
    id: 5,
    equipmentName: "하프너트",
    equipmentCode: "EQ-INJ-005",
    inspectionPart: "본체",
    inspectionItem: "크랙 점검",
    inspectionStandard: "크랙 없을것 (내시경 측정)",
    inspectionMethod: "내시경 측정",
    inspectionCycle: "yearly",
    manager: "이수열",
    line: "사출라인",
    purpose: "설비 중단 예방",
    executionMethod: "joint",
    createdAt: "2017-01-01",
    updatedAt: "2026-02-10",
    version: 2,
  },
  {
    id: 6,
    equipmentName: "칠러",
    equipmentCode: "EQ-INJ-006",
    inspectionPart: "배관/연결부",
    inspectionItem: "누수/누유 점검",
    inspectionStandard: "누수/누유 없을것",
    inspectionMethod: "육안점검",
    inspectionCycle: "monthly",
    manager: "정수연",
    line: "사출라인",
    purpose: "사출기 유지보수",
    executionMethod: "self",
    createdAt: "2017-01-01",
    updatedAt: "2026-06-05",
    version: 1,
  },
  {
    id: 7,
    equipmentName: "작동유",
    equipmentCode: "EQ-INJ-007",
    inspectionPart: "유류",
    inspectionItem: "성상점검",
    inspectionStandard: "성상분석 NG 없을것",
    inspectionMethod: "성상분석",
    inspectionCycle: "semi-annual",
    manager: "오명진",
    line: "사출라인",
    purpose: "설비 정도 보증",
    executionMethod: "external",
    createdAt: "2017-01-01",
    updatedAt: "2026-01-15",
    version: 1,
  },
  {
    id: 8,
    equipmentName: "자동화설비",
    equipmentCode: "EQ-INJ-008",
    inspectionPart: "위치결정부",
    inspectionItem: "정도 측정",
    inspectionStandard: "편차 0.05mm 이하일것",
    inspectionMethod: "정밀측정기",
    inspectionCycle: "quarterly",
    manager: "오명진",
    line: "사출라인",
    purpose: "자동화 정도 보증",
    executionMethod: "self",
    createdAt: "2017-01-01",
    updatedAt: "2026-05-20",
    version: 2,
  },
  {
    id: 9,
    equipmentName: "30/15T 크레인",
    equipmentCode: "EQ-INJ-009",
    inspectionPart: "와이어",
    inspectionItem: "와이어 점검",
    inspectionStandard: "와이어 소손기준",
    inspectionMethod: "육안점검",
    inspectionCycle: "quarterly",
    manager: "정수연",
    line: "사출라인",
    purpose: "와이어 소손 방지",
    executionMethod: "external",
    createdAt: "2017-01-01",
    updatedAt: "2026-04-10",
    version: 1,
  },
];

const initialRevisionHistory: RevisionHistory[] = [
  {
    id: 1,
    pmStandardId: 1,
    equipmentName: "사출기 하이브리드",
    inspectionItem: "정기점검",
    changeType: "update",
    changeDescription: "점검주기 변경",
    previousValue: "6개월",
    newValue: "3개월",
    changedBy: "김관리",
    changedAt: "2026-06-01",
    version: 3,
  },
  {
    id: 2,
    pmStandardId: 2,
    equipmentName: "유압모터",
    inspectionItem: "세척/교체",
    changeType: "update",
    changeDescription: "담당자 변경",
    previousValue: "박보전",
    newValue: "이동주",
    changedBy: "김관리",
    changedAt: "2026-05-15",
    version: 2,
  },
  {
    id: 3,
    pmStandardId: 5,
    equipmentName: "하프너트",
    inspectionItem: "크랙 점검",
    changeType: "update",
    changeDescription: "점검기준 상세화",
    previousValue: "크랙 없을것",
    newValue: "크랙 없을것 (내시경 측정)",
    changedBy: "이기술",
    changedAt: "2026-02-10",
    version: 2,
  },
  {
    id: 4,
    pmStandardId: 8,
    equipmentName: "자동화설비",
    inspectionItem: "정도 측정",
    changeType: "update",
    changeDescription: "점검기준 강화",
    previousValue: "편차 0.1mm 이하일것",
    newValue: "편차 0.05mm 이하일것",
    changedBy: "정품질",
    changedAt: "2026-05-20",
    version: 2,
  },
  {
    id: 5,
    pmStandardId: 1,
    equipmentName: "사출기 하이브리드",
    inspectionItem: "정기점검",
    changeType: "create",
    changeDescription: "신규 등록",
    previousValue: "-",
    newValue: "정기점검 항목 기준",
    changedBy: "차상정",
    changedAt: "2017-01-01",
    version: 1,
  },
];

export default function PMStandardPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [pmStandards, setPMStandards] = useState<PMStandard[]>(initialPMStandards);
  const [revisionHistory] = useState<RevisionHistory[]>(initialRevisionHistory);

  // Filter states
  const [filterLine, setFilterLine] = useState<string>("all");
  const [filterCycle, setFilterCycle] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Form state for new PM standard
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<PMStandard, "id" | "createdAt" | "updatedAt" | "version">>({
    equipmentName: "",
    equipmentCode: "",
    inspectionPart: "",
    inspectionItem: "",
    inspectionStandard: "",
    inspectionMethod: "",
    inspectionCycle: "monthly",
    manager: "",
    line: "사출라인",
    purpose: "",
    executionMethod: "self",
  });

  const resetForm = () => {
    setFormData({
      equipmentName: "",
      equipmentCode: "",
      inspectionPart: "",
      inspectionItem: "",
      inspectionStandard: "",
      inspectionMethod: "",
      inspectionCycle: "monthly",
      manager: "",
      line: "사출라인",
      purpose: "",
      executionMethod: "self",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!formData.equipmentName || !formData.inspectionItem || !formData.inspectionStandard) {
      alert("필수 항목을 입력해주세요. (설비명, 점검항목, 점검기준)");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (editingId) {
      setPMStandards(prev => prev.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            ...formData,
            updatedAt: now,
            version: item.version + 1,
          };
        }
        return item;
      }));
      alert("점검기준이 수정되었습니다.");
    } else {
      const newStandard: PMStandard = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
        version: 1,
      };
      setPMStandards([...pmStandards, newStandard]);
      alert("점검기준이 등록되었습니다.");
    }
    resetForm();
  };

  const handleEdit = (item: PMStandard) => {
    setFormData({
      equipmentName: item.equipmentName,
      equipmentCode: item.equipmentCode,
      inspectionPart: item.inspectionPart,
      inspectionItem: item.inspectionItem,
      inspectionStandard: item.inspectionStandard,
      inspectionMethod: item.inspectionMethod,
      inspectionCycle: item.inspectionCycle,
      manager: item.manager,
      line: item.line,
      purpose: item.purpose,
      executionMethod: item.executionMethod,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("이 점검기준을 삭제하시겠습니까?")) {
      setPMStandards(pmStandards.filter(item => item.id !== id));
    }
  };

  const getCycleLabel = (cycle: string) => {
    return CYCLE_OPTIONS.find(c => c.value === cycle)?.korLabel || cycle;
  };

  const getExecutionMethodInfo = (method: string) => {
    return EXECUTION_METHOD_OPTIONS.find(m => m.value === method) || { label: method, symbol: "?" };
  };

  const filteredStandards = pmStandards.filter(item => {
    const matchesLine = filterLine === "all" || item.line === filterLine;
    const matchesCycle = filterCycle === "all" || item.inspectionCycle === filterCycle;
    const matchesSearch = searchKeyword === "" ||
      item.equipmentName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.inspectionItem.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.inspectionStandard.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesLine && matchesCycle && matchesSearch;
  });

  // Tab 1: PM Standard Registration
  const RegistrationTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            점검기준 등록
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "취소" : "신규 등록"}
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-4">
                {editingId ? "점검기준 수정" : "점검기준 신규 등록"}
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>설비명 *</Label>
                  <Input
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="예: 사출기 하이브리드"
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비코드</Label>
                  <Input
                    value={formData.equipmentCode}
                    onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value })}
                    placeholder="예: EQ-INJ-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>라인</Label>
                  <Select value={formData.line} onValueChange={(v) => setFormData({ ...formData, line: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LINES.map(line => (
                        <SelectItem key={line} value={line}>{line}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검부위</Label>
                  <Input
                    value={formData.inspectionPart}
                    onChange={(e) => setFormData({ ...formData, inspectionPart: e.target.value })}
                    placeholder="예: 환기팬, 배관, 전기계통"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검항목 *</Label>
                  <Input
                    value={formData.inspectionItem}
                    onChange={(e) => setFormData({ ...formData, inspectionItem: e.target.value })}
                    placeholder="예: 세척/교체, 정도 측정"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검목적</Label>
                  <Input
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="예: 설비 중단 예방"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>점검기준 (상세) *</Label>
                  <Textarea
                    value={formData.inspectionStandard}
                    onChange={(e) => setFormData({ ...formData, inspectionStandard: e.target.value })}
                    placeholder="예: 오염 없을것, 편차 0.05mm 이하일것"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검방법</Label>
                  <Input
                    value={formData.inspectionMethod}
                    onChange={(e) => setFormData({ ...formData, inspectionMethod: e.target.value })}
                    placeholder="예: 육안점검, 측정기 사용"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검주기</Label>
                  <Select
                    value={formData.inspectionCycle}
                    onValueChange={(v) => setFormData({ ...formData, inspectionCycle: v as PMStandard["inspectionCycle"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CYCLE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.korLabel} ({option.label})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>시행방법</Label>
                  <Select
                    value={formData.executionMethod}
                    onValueChange={(v) => setFormData({ ...formData, executionMethod: v as PMStandard["executionMethod"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EXECUTION_METHOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.symbol} {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>담당자</Label>
                  <Input
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="담당자명"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>취소</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "수정" : "저장"}
                </Button>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="mb-4 flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs">라인 필터</Label>
              <Select value={filterLine} onValueChange={setFilterLine}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {LINES.map(line => (
                    <SelectItem key={line} value={line}>{line}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">점검주기</Label>
              <Select value={filterCycle} onValueChange={setFilterCycle}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {CYCLE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.korLabel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label className="text-xs">검색</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="설비명, 점검항목, 점검기준 검색..."
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-2">
            총 {filteredStandards.length}건의 점검기준
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>라인</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>설비코드</TableHead>
                  <TableHead>점검부위</TableHead>
                  <TableHead>점검항목</TableHead>
                  <TableHead>점검기준</TableHead>
                  <TableHead>점검방법</TableHead>
                  <TableHead className="text-center">주기</TableHead>
                  <TableHead className="text-center">시행</TableHead>
                  <TableHead>담당자</TableHead>
                  <TableHead className="text-center">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStandards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      등록된 점검기준이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStandards.map((item) => {
                    const execMethod = getExecutionMethodInfo(item.executionMethod);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">{item.line}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.equipmentName}</TableCell>
                        <TableCell className="font-mono text-xs">{item.equipmentCode}</TableCell>
                        <TableCell>{item.inspectionPart}</TableCell>
                        <TableCell>{item.inspectionItem}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={item.inspectionStandard}>
                          {item.inspectionStandard}
                        </TableCell>
                        <TableCell>{item.inspectionMethod}</TableCell>
                        <TableCell className="text-center">
                          <Badge>{getCycleLabel(item.inspectionCycle)}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span title={execMethod.label}>{execMethod.symbol}</span>
                        </TableCell>
                        <TableCell>{item.manager}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-1 justify-center">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Tab 2: PM Standards by Equipment
  const ByEquipmentTab = () => {
    const groupedByEquipment = pmStandards.reduce((acc, item) => {
      const key = `${item.line}-${item.equipmentName}`;
      if (!acc[key]) {
        acc[key] = {
          line: item.line,
          equipmentName: item.equipmentName,
          equipmentCode: item.equipmentCode,
          standards: [],
        };
      }
      acc[key].standards.push(item);
      return acc;
    }, {} as Record<string, { line: string; equipmentName: string; equipmentCode: string; standards: PMStandard[] }>);

    const equipmentGroups = Object.values(groupedByEquipment);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              설비별 점검기준 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              총 {equipmentGroups.length}개 설비, {pmStandards.length}건의 점검기준
            </div>

            <div className="space-y-4">
              {equipmentGroups.map((group, idx) => (
                <Card key={idx} className="border">
                  <CardHeader className="py-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{group.line}</Badge>
                        <span className="font-semibold">{group.equipmentName}</span>
                        <span className="text-sm text-muted-foreground font-mono">{group.equipmentCode}</span>
                      </div>
                      <Badge>{group.standards.length}건</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>점검부위</TableHead>
                          <TableHead>점검항목</TableHead>
                          <TableHead>점검목적</TableHead>
                          <TableHead>점검기준</TableHead>
                          <TableHead>점검방법</TableHead>
                          <TableHead className="text-center">주기</TableHead>
                          <TableHead className="text-center">시행</TableHead>
                          <TableHead>담당자</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.standards.map((item) => {
                          const execMethod = getExecutionMethodInfo(item.executionMethod);
                          return (
                            <TableRow key={item.id}>
                              <TableCell>{item.inspectionPart}</TableCell>
                              <TableCell className="font-medium">{item.inspectionItem}</TableCell>
                              <TableCell className="text-muted-foreground">{item.purpose}</TableCell>
                              <TableCell>{item.inspectionStandard}</TableCell>
                              <TableCell>{item.inspectionMethod}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">{getCycleLabel(item.inspectionCycle)}</Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <span title={execMethod.label}>{execMethod.symbol}</span>
                              </TableCell>
                              <TableCell>{item.manager}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tab 3: Status by Frequency
  const ByFrequencyTab = () => {
    const cycleStats = CYCLE_OPTIONS.map(cycle => {
      const items = pmStandards.filter(s => s.inspectionCycle === cycle.value);
      const byLine = LINES.reduce((acc, line) => {
        acc[line] = items.filter(i => i.line === line).length;
        return acc;
      }, {} as Record<string, number>);

      const byMethod = EXECUTION_METHOD_OPTIONS.reduce((acc, method) => {
        acc[method.value] = items.filter(i => i.executionMethod === method.value).length;
        return acc;
      }, {} as Record<string, number>);

      return {
        cycle: cycle.value,
        label: cycle.label,
        korLabel: cycle.korLabel,
        total: items.length,
        byLine,
        byMethod,
        items,
      };
    });

    const totalItems = pmStandards.length;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          {cycleStats.map(stat => (
            <Card key={stat.cycle}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.korLabel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.total}</div>
                <p className="text-xs text-muted-foreground">
                  {totalItems > 0 ? Math.round((stat.total / totalItems) * 100) : 0}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              점검주기별 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>점검주기</TableHead>
                  <TableHead className="text-center">총 건수</TableHead>
                  {LINES.map(line => (
                    <TableHead key={line} className="text-center">{line}</TableHead>
                  ))}
                  <TableHead className="text-center">자체</TableHead>
                  <TableHead className="text-center">공동</TableHead>
                  <TableHead className="text-center">외부</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cycleStats.map(stat => (
                  <TableRow key={stat.cycle}>
                    <TableCell>
                      <Badge>{stat.korLabel}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{stat.total}</TableCell>
                    {LINES.map(line => (
                      <TableCell key={line} className="text-center">
                        {stat.byLine[line] || 0}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">{stat.byMethod.self || 0}</TableCell>
                    <TableCell className="text-center">{stat.byMethod.joint || 0}</TableCell>
                    <TableCell className="text-center">{stat.byMethod.external || 0}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold bg-muted/50">
                  <TableCell>합계</TableCell>
                  <TableCell className="text-center">{totalItems}</TableCell>
                  {LINES.map(line => (
                    <TableCell key={line} className="text-center">
                      {pmStandards.filter(s => s.line === line).length}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    {pmStandards.filter(s => s.executionMethod === "self").length}
                  </TableCell>
                  <TableCell className="text-center">
                    {pmStandards.filter(s => s.executionMethod === "joint").length}
                  </TableCell>
                  <TableCell className="text-center">
                    {pmStandards.filter(s => s.executionMethod === "external").length}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Items by Cycle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              주기별 점검항목 상세
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cycleStats.filter(s => s.total > 0).map(stat => (
                <div key={stat.cycle} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{stat.korLabel}</Badge>
                    <span className="text-sm text-muted-foreground">{stat.total}건</span>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {stat.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
                        <Badge variant="outline" className="text-xs">{item.line.replace("라인", "")}</Badge>
                        <span className="font-medium">{item.equipmentName}</span>
                        <span className="text-muted-foreground">- {item.inspectionItem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Tab 4: Revision History
  const RevisionHistoryTab = () => {
    const sortedHistory = [...revisionHistory].sort((a, b) =>
      new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
    );

    const getChangeTypeBadge = (type: string) => {
      switch (type) {
        case "create":
          return <Badge variant="success">신규</Badge>;
        case "update":
          return <Badge variant="secondary">수정</Badge>;
        case "delete":
          return <Badge variant="destructive">삭제</Badge>;
        default:
          return <Badge>{type}</Badge>;
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              점검기준 개정 이력
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              총 {sortedHistory.length}건의 개정 이력
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>개정일</TableHead>
                  <TableHead>설비명</TableHead>
                  <TableHead>점검항목</TableHead>
                  <TableHead className="text-center">유형</TableHead>
                  <TableHead>변경내용</TableHead>
                  <TableHead>이전값</TableHead>
                  <TableHead>변경값</TableHead>
                  <TableHead>변경자</TableHead>
                  <TableHead className="text-center">버전</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      개정 이력이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">{record.changedAt}</TableCell>
                      <TableCell className="font-medium">{record.equipmentName}</TableCell>
                      <TableCell>{record.inspectionItem}</TableCell>
                      <TableCell className="text-center">{getChangeTypeBadge(record.changeType)}</TableCell>
                      <TableCell>{record.changeDescription}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[150px] truncate" title={record.previousValue}>
                        {record.previousValue}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={record.newValue}>
                        {record.newValue}
                      </TableCell>
                      <TableCell>{record.changedBy}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">v{record.version}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Version Summary by Equipment */}
        <Card>
          <CardHeader>
            <CardTitle>설비별 현재 버전</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              {pmStandards.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{item.equipmentName}</div>
                    <div className="text-xs text-muted-foreground">{item.inspectionItem}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">v{item.version}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {item.updatedAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">예방보전 점검기준</h1>
          <p className="text-muted-foreground">
            #첨부) 2017년 년간 예방보전 추진계획 점검기준
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="flex items-center gap-1">
            <span className="font-bold">□</span> 자체시행
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold">■</span> 공동시행
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold">◈</span> 외부시행
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            점검기준 등록
          </TabsTrigger>
          <TabsTrigger value="by-equipment">
            <FileText className="mr-2 h-4 w-4" />
            설비별 점검기준 목록
          </TabsTrigger>
          <TabsTrigger value="by-frequency">
            <Calendar className="mr-2 h-4 w-4" />
            점검주기별 현황
          </TabsTrigger>
          <TabsTrigger value="revision-history">
            <History className="mr-2 h-4 w-4" />
            개정 이력
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <RegistrationTab />
        </TabsContent>

        <TabsContent value="by-equipment">
          <ByEquipmentTab />
        </TabsContent>

        <TabsContent value="by-frequency">
          <ByFrequencyTab />
        </TabsContent>

        <TabsContent value="revision-history">
          <RevisionHistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
