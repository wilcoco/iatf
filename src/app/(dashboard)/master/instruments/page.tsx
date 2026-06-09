"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Gauge, Search, Edit, Trash2, Save, X, Download, Upload, AlertTriangle, Clock } from "lucide-react";
import { instruments as initialInstruments, type Instrument } from "@/lib/master-data";

// 로컬 확장 타입
interface InstrumentExtended extends Instrument {
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialInstruments: InstrumentExtended[] = initialInstruments.map(i => ({
  ...i,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

export default function InstrumentsPage() {
  const [instruments, setInstruments] = useState<InstrumentExtended[]>(extendedInitialInstruments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<InstrumentExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    name: "",
    type: "",
    spec: "",
    manufacturer: "",
    model: "",
    calibrationCycle: 12,
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    location: "",
    status: "사용중",
  });

  const typeOptions = ["길이측정", "토크측정", "색상측정", "광택측정"];
  const locationOptions = [...new Set(instruments.map(i => i.location))];
  const statusOptions: Instrument["status"][] = ["사용중", "검교정중", "보관", "폐기"];

  const statusColors: Record<string, string> = {
    "사용중": "bg-green-100 text-green-800",
    "검교정중": "bg-yellow-100 text-yellow-800",
    "보관": "bg-blue-100 text-blue-800",
    "폐기": "bg-red-100 text-red-800",
  };

  // 필터링된 계측기 목록
  const filteredInstruments = instruments.filter((i) => {
    const matchesSearch =
      i.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || i.type === filterType;
    const matchesLocation = filterLocation === "all" || i.location === filterLocation;
    const matchesStatus = filterStatus === "all" || i.status === filterStatus;
    return matchesSearch && matchesType && matchesLocation && matchesStatus;
  });

  // 검교정 기한 임박 여부 확인 (30일 이내)
  const isCalibrationDueSoon = (nextDate: string) => {
    const next = new Date(nextDate);
    const today = new Date();
    const diffDays = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  // 통계
  const stats = {
    total: instruments.length,
    dueSoon: instruments.filter(i => i.status === "사용중" && isCalibrationDueSoon(i.nextCalibrationDate)).length,
    inCalibration: instruments.filter(i => i.status === "검교정중").length,
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      type: "",
      spec: "",
      manufacturer: "",
      model: "",
      calibrationCycle: 12,
      lastCalibrationDate: "",
      nextCalibrationDate: "",
      location: "",
      status: "사용중",
    });
  };

  const generateCode = () => {
    const maxNum = instruments.reduce((max, i) => {
      const num = parseInt(i.code.replace("INS-", ""));
      return num > max ? num : max;
    }, 0);
    return `INS-${String(maxNum + 1).padStart(3, "0")}`;
  };

  // 차기검교정일 자동 계산
  const calculateNextCalibrationDate = (lastDate: string, cycle: number) => {
    if (!lastDate) return "";
    const date = new Date(lastDate);
    date.setMonth(date.getMonth() + cycle);
    return date.toISOString().split("T")[0];
  };

  const handleLastCalibrationDateChange = (value: string) => {
    const nextDate = calculateNextCalibrationDate(value, formData.calibrationCycle);
    setFormData({
      ...formData,
      lastCalibrationDate: value,
      nextCalibrationDate: nextDate,
    });
  };

  const handleCalibrationCycleChange = (value: number) => {
    const nextDate = calculateNextCalibrationDate(formData.lastCalibrationDate, value);
    setFormData({
      ...formData,
      calibrationCycle: value,
      nextCalibrationDate: nextDate,
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (instrument: InstrumentExtended) => {
    setIsAdding(false);
    setEditingId(instrument.id);
    setActiveTab("register");
    setFormData({
      code: instrument.code,
      name: instrument.name,
      type: instrument.type,
      spec: instrument.spec,
      manufacturer: instrument.manufacturer,
      model: instrument.model,
      calibrationCycle: instrument.calibrationCycle,
      lastCalibrationDate: instrument.lastCalibrationDate,
      nextCalibrationDate: instrument.nextCalibrationDate,
      location: instrument.location,
      status: instrument.status,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert("계측기코드와 계측기명은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newInstrument: InstrumentExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setInstruments([...instruments, newInstrument]);
    } else if (editingId) {
      setInstruments(instruments.map(i =>
        i.id === editingId
          ? { ...i, ...formData, updatedAt: now }
          : i
      ));
    }

    setIsAdding(false);
    setEditingId(null);
    resetForm();
    setActiveTab("list");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
    setActiveTab("list");
  };

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setInstruments(instruments.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">계측기 관리</h1>
          <p className="text-muted-foreground">계측기 마스터 및 검교정 관리</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            가져오기
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            계측기 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Gauge className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">전체 계측기</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.dueSoon}</div>
                <p className="text-sm text-muted-foreground">검교정 기한 임박 (30일 이내)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.inCalibration}</div>
                <p className="text-sm text-muted-foreground">검교정중</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">계측기 목록</TabsTrigger>
          <TabsTrigger value="register">
            {isAdding ? "신규 등록" : editingId ? "정보 수정" : "등록/수정"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* 검색/필터 */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="계측기코드, 계측기명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 유형</SelectItem>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="보관위치" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 위치</SelectItem>
                    {locationOptions.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 계측기 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                계측기 목록 ({filteredInstruments.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>계측기코드</TableHead>
                    <TableHead>계측기명</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>규격</TableHead>
                    <TableHead>제조사/모델</TableHead>
                    <TableHead>검교정주기</TableHead>
                    <TableHead>최종검교정일</TableHead>
                    <TableHead>차기검교정일</TableHead>
                    <TableHead>보관위치</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstruments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        등록된 계측기가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInstruments.map((instrument) => (
                      <TableRow key={instrument.id}>
                        <TableCell className="font-mono">{instrument.code}</TableCell>
                        <TableCell className="font-medium">{instrument.name}</TableCell>
                        <TableCell>{instrument.type}</TableCell>
                        <TableCell>{instrument.spec || "-"}</TableCell>
                        <TableCell>
                          {instrument.manufacturer && instrument.model
                            ? `${instrument.manufacturer} / ${instrument.model}`
                            : instrument.manufacturer || instrument.model || "-"}
                        </TableCell>
                        <TableCell>{instrument.calibrationCycle}개월</TableCell>
                        <TableCell>{instrument.lastCalibrationDate || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {instrument.nextCalibrationDate || "-"}
                            {instrument.status === "사용중" && isCalibrationDueSoon(instrument.nextCalibrationDate) && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{instrument.location || "-"}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[instrument.status]}>
                            {instrument.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(instrument)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(instrument.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdding ? "신규 계측기 등록" : editingId ? "계측기 정보 수정" : "계측기 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [계측기 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 계측기의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>계측기코드 *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="INS-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>계측기명 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="계측기명 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>유형</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData({ ...formData, type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>규격</Label>
                      <Input
                        value={formData.spec}
                        onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                        placeholder="0-150mm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>제조사</Label>
                      <Input
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="제조사명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>모델</Label>
                      <Input
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="모델명"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>검교정 주기 (개월)</Label>
                      <Select
                        value={String(formData.calibrationCycle)}
                        onValueChange={(v) => handleCalibrationCycleChange(parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="주기 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3개월</SelectItem>
                          <SelectItem value="6">6개월</SelectItem>
                          <SelectItem value="12">12개월</SelectItem>
                          <SelectItem value="24">24개월</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>최종검교정일</Label>
                      <Input
                        type="date"
                        value={formData.lastCalibrationDate}
                        onChange={(e) => handleLastCalibrationDateChange(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>차기검교정일 (자동계산)</Label>
                      <Input
                        type="date"
                        value={formData.nextCalibrationDate}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>보관위치</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="품질검사실"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v as Instrument["status"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      취소
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      {isAdding ? "등록" : "저장"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
