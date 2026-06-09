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
import { Plus, Factory, Search, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import { equipments as initialEquipments, type Equipment } from "@/lib/master-data";

// 로컬 확장 타입
interface EquipmentExtended extends Equipment {
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialEquipments: EquipmentExtended[] = initialEquipments.map(e => ({
  ...e,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<EquipmentExtended[]>(extendedInitialEquipments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLine, setFilterLine] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<EquipmentExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    name: "",
    type: "",
    line: "",
    manufacturer: "",
    model: "",
    installDate: "",
    status: "가동",
  });

  const statusColors: Record<string, string> = {
    "가동": "bg-green-100 text-green-800",
    "정지": "bg-gray-100 text-gray-800",
    "고장": "bg-red-100 text-red-800",
    "점검중": "bg-yellow-100 text-yellow-800",
  };

  const typeOptions = ["사출기", "도장설비", "건조설비", "컨베이어"];

  // 라인 목록 (설비 데이터에서 동적으로 추출)
  const lineOptions = Array.from(new Set(initialEquipments.map(e => e.line)));

  // 필터링된 설비 목록
  const filteredEquipments = equipments.filter((e) => {
    const matchesSearch =
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || e.type === filterType;
    const matchesLine = filterLine === "all" || e.line === filterLine;
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesType && matchesLine && matchesStatus;
  });

  // 통계
  const stats = {
    total: equipments.length,
    running: equipments.filter(e => e.status === "가동").length,
    stopped: equipments.filter(e => e.status === "정지").length,
    broken: equipments.filter(e => e.status === "고장").length,
    maintenance: equipments.filter(e => e.status === "점검중").length,
    byLine: lineOptions.map(line => ({
      line,
      count: equipments.filter(e => e.line === line).length,
    })),
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      type: "",
      line: "",
      manufacturer: "",
      model: "",
      installDate: "",
      status: "가동",
    });
  };

  const generateCode = () => {
    const maxNum = equipments.reduce((max, e) => {
      const num = parseInt(e.code.replace("EQ-", ""));
      return num > max ? num : max;
    }, 0);
    return `EQ-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (equipment: EquipmentExtended) => {
    setIsAdding(false);
    setEditingId(equipment.id);
    setActiveTab("register");
    setFormData({
      code: equipment.code,
      name: equipment.name,
      type: equipment.type,
      line: equipment.line,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      installDate: equipment.installDate,
      status: equipment.status,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert("설비코드와 설비명은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newEquipment: EquipmentExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setEquipments([...equipments, newEquipment]);
    } else if (editingId) {
      setEquipments(equipments.map(e =>
        e.id === editingId
          ? { ...e, ...formData, updatedAt: now }
          : e
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
      setEquipments(equipments.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">설비 관리</h1>
          <p className="text-muted-foreground">생산설비 마스터 데이터 관리</p>
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
            설비 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 설비</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.running}</div>
            <p className="text-sm text-muted-foreground">가동</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-600">{stats.stopped}</div>
            <p className="text-sm text-muted-foreground">정지</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.broken}</div>
            <p className="text-sm text-muted-foreground">고장</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <p className="text-sm text-muted-foreground">점검중</p>
          </CardContent>
        </Card>
      </div>

      {/* 라인별 통계 */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.byLine.map(({ line, count }) => (
          <Card key={line}>
            <CardContent className="pt-4">
              <div className="text-xl font-bold">{count}</div>
              <p className="text-sm text-muted-foreground">{line}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">설비 목록</TabsTrigger>
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
                      placeholder="설비코드, 설비명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="설비유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 유형</SelectItem>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterLine} onValueChange={setFilterLine}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="라인" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 라인</SelectItem>
                    {lineOptions.map(line => (
                      <SelectItem key={line} value={line}>{line}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="가동">가동</SelectItem>
                    <SelectItem value="정지">정지</SelectItem>
                    <SelectItem value="고장">고장</SelectItem>
                    <SelectItem value="점검중">점검중</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 설비 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                설비 목록 ({filteredEquipments.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>설비코드</TableHead>
                    <TableHead>설비명</TableHead>
                    <TableHead>설비유형</TableHead>
                    <TableHead>라인</TableHead>
                    <TableHead>제조사</TableHead>
                    <TableHead>모델</TableHead>
                    <TableHead>설치일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        등록된 설비가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEquipments.map((equipment) => (
                      <TableRow key={equipment.id}>
                        <TableCell className="font-mono">{equipment.code}</TableCell>
                        <TableCell className="font-medium">{equipment.name}</TableCell>
                        <TableCell>{equipment.type}</TableCell>
                        <TableCell>{equipment.line}</TableCell>
                        <TableCell>{equipment.manufacturer || "-"}</TableCell>
                        <TableCell>{equipment.model || "-"}</TableCell>
                        <TableCell>{equipment.installDate || "-"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[equipment.status]}`}>
                            {equipment.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(equipment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(equipment.id)}>
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
                {isAdding ? "신규 설비 등록" : editingId ? "설비 정보 수정" : "설비 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [설비 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 설비의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>설비코드 *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="EQ-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>설비명 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="설비명 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>설비유형</Label>
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
                      <Label>라인</Label>
                      <Select
                        value={formData.line}
                        onValueChange={(v) => setFormData({ ...formData, line: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="라인 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {lineOptions.map(line => (
                            <SelectItem key={line} value={line}>{line}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>설치일</Label>
                      <Input
                        type="date"
                        value={formData.installDate}
                        onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v as Equipment["status"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="가동">가동</SelectItem>
                          <SelectItem value="정지">정지</SelectItem>
                          <SelectItem value="고장">고장</SelectItem>
                          <SelectItem value="점검중">점검중</SelectItem>
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
