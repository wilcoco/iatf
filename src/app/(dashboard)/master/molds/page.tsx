"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Box, Search, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import { molds as initialMolds, type Mold } from "@/lib/master-data";

// 로컬 확장 타입
interface MoldExtended extends Mold {
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialMolds: MoldExtended[] = initialMolds.map(m => ({
  ...m,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

export default function MoldsPage() {
  const [molds, setMolds] = useState<MoldExtended[]>(extendedInitialMolds);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<MoldExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    name: "",
    partCode: "",
    partName: "",
    cavity: 1,
    material: "",
    weight: 0,
    manufacturer: "",
    manufactureDate: "",
    location: "",
    status: "보관",
    shotCount: 0,
    maxShotCount: 0,
  });

  const statusColors: Record<string, string> = {
    "사용중": "bg-green-100 text-green-800",
    "수리중": "bg-orange-100 text-orange-800",
    "보관": "bg-blue-100 text-blue-800",
    "폐기": "bg-gray-100 text-gray-800",
  };

  // 고유 위치 목록 추출
  const uniqueLocations = Array.from(new Set(molds.map(m => m.location).filter(Boolean)));

  // 필터링된 금형 목록
  const filteredMolds = molds.filter((m) => {
    const matchesSearch =
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.partCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.partName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    const matchesLocation = filterLocation === "all" || m.location === filterLocation;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // 통계
  const stats = {
    total: molds.length,
    inUse: molds.filter(m => m.status === "사용중").length,
    inRepair: molds.filter(m => m.status === "수리중").length,
    totalShots: molds.reduce((sum, m) => sum + m.shotCount, 0),
    avgShotPercent: molds.length > 0
      ? Math.round(molds.reduce((sum, m) => sum + (m.maxShotCount > 0 ? (m.shotCount / m.maxShotCount) * 100 : 0), 0) / molds.length)
      : 0,
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      partCode: "",
      partName: "",
      cavity: 1,
      material: "",
      weight: 0,
      manufacturer: "",
      manufactureDate: "",
      location: "",
      status: "보관",
      shotCount: 0,
      maxShotCount: 0,
    });
  };

  const generateCode = () => {
    const maxNum = molds.reduce((max, m) => {
      const num = parseInt(m.code.replace("MLD-", ""));
      return num > max ? num : max;
    }, 0);
    return `MLD-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (mold: MoldExtended) => {
    setIsAdding(false);
    setEditingId(mold.id);
    setActiveTab("register");
    setFormData({
      code: mold.code,
      name: mold.name,
      partCode: mold.partCode,
      partName: mold.partName,
      cavity: mold.cavity,
      material: mold.material,
      weight: mold.weight,
      manufacturer: mold.manufacturer,
      manufactureDate: mold.manufactureDate,
      location: mold.location,
      status: mold.status,
      shotCount: mold.shotCount,
      maxShotCount: mold.maxShotCount,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert("금형코드와 금형명은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newMold: MoldExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setMolds([...molds, newMold]);
    } else if (editingId) {
      setMolds(molds.map(m =>
        m.id === editingId
          ? { ...m, ...formData, updatedAt: now }
          : m
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
      setMolds(molds.filter(m => m.id !== id));
    }
  };

  // Shot count progress bar 컴포넌트
  const ShotCountProgress = ({ current, max }: { current: number; max: number }) => {
    const percent = max > 0 ? Math.round((current / max) * 100) : 0;
    let barColor = "bg-green-500";
    if (percent >= 80) barColor = "bg-red-500";
    else if (percent >= 60) barColor = "bg-yellow-500";

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span>{current.toLocaleString()}</span>
          <span className="text-muted-foreground">/ {max.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <div className="text-xs text-right text-muted-foreground mt-0.5">{percent}%</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">금형 관리</h1>
          <p className="text-muted-foreground">금형 마스터 및 이력 관리</p>
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
            금형 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 금형</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.inUse}</div>
            <p className="text-sm text-muted-foreground">사용중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{stats.inRepair}</div>
            <p className="text-sm text-muted-foreground">수리중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.avgShotPercent}%</div>
            <p className="text-sm text-muted-foreground">평균 Shot 사용률</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">금형 목록</TabsTrigger>
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
                      placeholder="금형코드, 금형명, 품번, 품명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="사용중">사용중</SelectItem>
                    <SelectItem value="수리중">수리중</SelectItem>
                    <SelectItem value="보관">보관</SelectItem>
                    <SelectItem value="폐기">폐기</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="보관위치" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 위치</SelectItem>
                    {uniqueLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 금형 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                금형 목록 ({filteredMolds.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>금형코드</TableHead>
                    <TableHead>금형명</TableHead>
                    <TableHead>적용품번</TableHead>
                    <TableHead>Cavity</TableHead>
                    <TableHead>보관위치</TableHead>
                    <TableHead>제작업체</TableHead>
                    <TableHead className="w-[150px]">Shot Count</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMolds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        등록된 금형이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMolds.map((mold) => (
                      <TableRow key={mold.id}>
                        <TableCell className="font-mono">{mold.code}</TableCell>
                        <TableCell className="font-medium">{mold.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-mono text-xs">{mold.partCode}</div>
                            <div className="text-muted-foreground text-xs">{mold.partName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{mold.cavity}</TableCell>
                        <TableCell>{mold.location || "-"}</TableCell>
                        <TableCell>{mold.manufacturer || "-"}</TableCell>
                        <TableCell>
                          <ShotCountProgress current={mold.shotCount} max={mold.maxShotCount} />
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[mold.status]}`}>
                            {mold.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(mold)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(mold.id)}>
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
                {isAdding ? "신규 금형 등록" : editingId ? "금형 정보 수정" : "금형 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [금형 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 금형의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">기본 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>금형코드 *</Label>
                        <Input
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                          placeholder="MLD-001"
                          readOnly={!!editingId}
                          className={editingId ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>금형명 *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="금형명 입력"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>상태</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(v) => setFormData({ ...formData, status: v as Mold["status"] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="상태 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="사용중">사용중</SelectItem>
                            <SelectItem value="수리중">수리중</SelectItem>
                            <SelectItem value="보관">보관</SelectItem>
                            <SelectItem value="폐기">폐기</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 적용 품번 정보 */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">적용 품번 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>적용품번</Label>
                        <Input
                          value={formData.partCode}
                          onChange={(e) => setFormData({ ...formData, partCode: e.target.value })}
                          placeholder="P-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>적용품명</Label>
                        <Input
                          value={formData.partName}
                          onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                          placeholder="품명 입력"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 금형 사양 */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">금형 사양</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Cavity 수</Label>
                        <Input
                          type="number"
                          value={formData.cavity}
                          onChange={(e) => setFormData({ ...formData, cavity: parseInt(e.target.value) || 1 })}
                          placeholder="1"
                          min={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>재질</Label>
                        <Input
                          value={formData.material}
                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                          placeholder="NAK80, SKD61 등"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>중량 (kg)</Label>
                        <Input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 제작 및 보관 정보 */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">제작 및 보관 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>제작업체</Label>
                        <Input
                          value={formData.manufacturer}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                          placeholder="제작업체명"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>제작일</Label>
                        <Input
                          type="date"
                          value={formData.manufactureDate}
                          onChange={(e) => setFormData({ ...formData, manufactureDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>보관위치</Label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="사출라인-A"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shot Count 정보 */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Shot Count 관리</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>현재 Shot Count</Label>
                        <Input
                          type="number"
                          value={formData.shotCount}
                          onChange={(e) => setFormData({ ...formData, shotCount: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          min={0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>최대 Shot Count</Label>
                        <Input
                          type="number"
                          value={formData.maxShotCount}
                          onChange={(e) => setFormData({ ...formData, maxShotCount: parseInt(e.target.value) || 0 })}
                          placeholder="500000"
                          min={0}
                        />
                      </div>
                    </div>
                    {formData.maxShotCount > 0 && (
                      <div className="mt-4">
                        <Label className="text-muted-foreground">Shot Count 현황</Label>
                        <div className="mt-2 max-w-md">
                          <ShotCountProgress current={formData.shotCount} max={formData.maxShotCount} />
                        </div>
                      </div>
                    )}
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
