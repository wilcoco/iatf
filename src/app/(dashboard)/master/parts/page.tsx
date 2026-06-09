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
import { Plus, Box, Search, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import { parts as initialParts, type Part } from "@/lib/master-data";

// 로컬 확장 타입
interface PartExtended extends Part {
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialParts: PartExtended[] = initialParts.map(p => ({
  ...p,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

// 분류 옵션
const categoryOptions = ["외장", "내장", "기능부품"];

// 고객사 옵션 (데이터에서 추출)
const customerOptions = [...new Set(initialParts.map(p => p.customer))];

export default function PartsPage() {
  const [parts, setParts] = useState<PartExtended[]>(extendedInitialParts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<PartExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    name: "",
    spec: "",
    unit: "",
    customer: "",
    vehicleModel: "",
    category: "",
    isActive: true,
  });

  const categoryColors: Record<string, string> = {
    "외장": "bg-blue-100 text-blue-800",
    "내장": "bg-green-100 text-green-800",
    "기능부품": "bg-purple-100 text-purple-800",
  };

  // 필터링된 품목 목록
  const filteredParts = parts.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesCustomer = filterCustomer === "all" || p.customer === filterCustomer;
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && p.isActive) ||
      (filterStatus === "inactive" && !p.isActive);
    return matchesSearch && matchesCategory && matchesCustomer && matchesStatus;
  });

  // 통계
  const stats = {
    total: parts.length,
    active: parts.filter(p => p.isActive).length,
    exterior: parts.filter(p => p.category === "외장").length,
    interior: parts.filter(p => p.category === "내장").length,
    functional: parts.filter(p => p.category === "기능부품").length,
    byCustomer: customerOptions.map(customer => ({
      customer,
      count: parts.filter(p => p.customer === customer).length,
    })),
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      spec: "",
      unit: "",
      customer: "",
      vehicleModel: "",
      category: "",
      isActive: true,
    });
  };

  const generateCode = () => {
    const maxNum = parts.reduce((max, p) => {
      const num = parseInt(p.code.replace("P-", ""));
      return num > max ? num : max;
    }, 0);
    return `P-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (part: PartExtended) => {
    setIsAdding(false);
    setEditingId(part.id);
    setActiveTab("register");
    setFormData({
      code: part.code,
      name: part.name,
      spec: part.spec,
      unit: part.unit,
      customer: part.customer,
      vehicleModel: part.vehicleModel,
      category: part.category,
      isActive: part.isActive,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert("품번과 품명은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newPart: PartExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setParts([...parts, newPart]);
    } else if (editingId) {
      setParts(parts.map(p =>
        p.id === editingId
          ? { ...p, ...formData, updatedAt: now }
          : p
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
      setParts(parts.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setParts(parts.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString().split("T")[0] } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">품목 관리</h1>
          <p className="text-muted-foreground">품목 마스터 데이터 관리</p>
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
            품목 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 품목</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">사용중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.exterior}</div>
            <p className="text-sm text-muted-foreground">외장</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.interior}</div>
            <p className="text-sm text-muted-foreground">내장</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{stats.functional}</div>
            <p className="text-sm text-muted-foreground">기능부품</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.byCustomer.length}</div>
            <p className="text-sm text-muted-foreground">고객사</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">품목 목록</TabsTrigger>
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
                      placeholder="품번, 품명, 고객사 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="분류" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 분류</SelectItem>
                    {categoryOptions.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="고객사" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 고객사</SelectItem>
                    {customerOptions.map(customer => (
                      <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="active">사용중</SelectItem>
                    <SelectItem value="inactive">미사용</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 품목 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                품목 목록 ({filteredParts.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>규격</TableHead>
                    <TableHead>단위</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>차종</TableHead>
                    <TableHead>분류</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        등록된 품목이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="font-mono">{part.code}</TableCell>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>{part.spec || "-"}</TableCell>
                        <TableCell>{part.unit || "-"}</TableCell>
                        <TableCell>{part.customer || "-"}</TableCell>
                        <TableCell>{part.vehicleModel || "-"}</TableCell>
                        <TableCell>
                          {part.category && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[part.category] || "bg-gray-100 text-gray-800"}`}>
                              {part.category}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={part.isActive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(part.id)}
                          >
                            {part.isActive ? "사용중" : "미사용"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(part)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(part.id)}>
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
                {isAdding ? "신규 품목 등록" : editingId ? "품목 정보 수정" : "품목 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [품목 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 품목의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>품번 *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="P-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품명 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="품명 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>규격</Label>
                      <Input
                        value={formData.spec}
                        onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                        placeholder="ABS, 검정"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>단위</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(v) => setFormData({ ...formData, unit: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="단위 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EA">EA (개)</SelectItem>
                          <SelectItem value="SET">SET (세트)</SelectItem>
                          <SelectItem value="KG">KG (킬로그램)</SelectItem>
                          <SelectItem value="L">L (리터)</SelectItem>
                          <SelectItem value="M">M (미터)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>고객사</Label>
                      <Select
                        value={formData.customer}
                        onValueChange={(v) => setFormData({ ...formData, customer: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="고객사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {customerOptions.map(customer => (
                            <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>차종</Label>
                      <Input
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                        placeholder="아반떼, 쏘나타 등"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>분류</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="분류 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>상태</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formData.isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, isActive: true })}
                      >
                        사용중
                      </Button>
                      <Button
                        type="button"
                        variant={!formData.isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, isActive: false })}
                      >
                        미사용
                      </Button>
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
