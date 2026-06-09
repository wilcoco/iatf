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
import { Plus, Truck, Search, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import { suppliers as initialSuppliers, type Supplier } from "@/lib/master-data";

// 로컬 확장 타입
interface SupplierExtended extends Supplier {
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialSuppliers: SupplierExtended[] = initialSuppliers.map(s => ({
  ...s,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierExtended[]>(extendedInitialSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<SupplierExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    name: "",
    businessNo: "",
    ceo: "",
    type: "",
    grade: "",
    address: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    certifications: [],
    isActive: true,
  });

  const gradeColors: Record<string, string> = {
    A: "bg-green-100 text-green-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-red-100 text-red-800",
  };

  const typeLabels: Record<string, string> = {
    "제조": "제조업체",
    "서비스": "서비스업체",
    "물류": "물류업체",
    "검사": "검사기관",
  };

  // 필터링된 공급자 목록
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === "all" || s.grade === filterGrade;
    const matchesType = filterType === "all" || s.type === filterType;
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && s.isActive) ||
      (filterStatus === "inactive" && !s.isActive);
    return matchesSearch && matchesGrade && matchesType && matchesStatus;
  });

  // 통계
  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.isActive).length,
    gradeA: suppliers.filter(s => s.grade === "A").length,
    gradeB: suppliers.filter(s => s.grade === "B").length,
    gradeC: suppliers.filter(s => s.grade === "C").length,
    gradeD: suppliers.filter(s => s.grade === "D").length,
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      businessNo: "",
      ceo: "",
      type: "",
      grade: "",
      address: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      certifications: [],
      isActive: true,
    });
  };

  const generateCode = () => {
    const maxNum = suppliers.reduce((max, s) => {
      const num = parseInt(s.code.replace("SUP-", ""));
      return num > max ? num : max;
    }, 0);
    return `SUP-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (supplier: SupplierExtended) => {
    setIsAdding(false);
    setEditingId(supplier.id);
    setActiveTab("register");
    setFormData({
      code: supplier.code,
      name: supplier.name,
      businessNo: supplier.businessNo,
      ceo: supplier.ceo,
      type: supplier.type,
      grade: supplier.grade,
      address: supplier.address,
      contactName: supplier.contactName,
      contactPhone: supplier.contactPhone,
      contactEmail: supplier.contactEmail,
      certifications: supplier.certifications,
      isActive: supplier.isActive,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert("업체코드와 업체명은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newSupplier: SupplierExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setSuppliers([...suppliers, newSupplier]);
    } else if (editingId) {
      setSuppliers(suppliers.map(s =>
        s.id === editingId
          ? { ...s, ...formData, updatedAt: now }
          : s
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
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setSuppliers(suppliers.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString().split("T")[0] } : s
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">공급자 관리</h1>
          <p className="text-muted-foreground">협력사/공급자 마스터 데이터 관리</p>
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
            공급자 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 업체</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">거래중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.gradeA}</div>
            <p className="text-sm text-muted-foreground">A등급</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.gradeB}</div>
            <p className="text-sm text-muted-foreground">B등급</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.gradeC}</div>
            <p className="text-sm text-muted-foreground">C등급</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.gradeD}</div>
            <p className="text-sm text-muted-foreground">D등급</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">공급자 목록</TabsTrigger>
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
                      placeholder="업체코드, 업체명, 담당자 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterGrade} onValueChange={setFilterGrade}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="등급" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 등급</SelectItem>
                    <SelectItem value="A">A등급</SelectItem>
                    <SelectItem value="B">B등급</SelectItem>
                    <SelectItem value="C">C등급</SelectItem>
                    <SelectItem value="D">D등급</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="구분" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 구분</SelectItem>
                    <SelectItem value="제조">제조업체</SelectItem>
                    <SelectItem value="서비스">서비스업체</SelectItem>
                    <SelectItem value="물류">물류업체</SelectItem>
                    <SelectItem value="검사">검사기관</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="active">거래중</SelectItem>
                    <SelectItem value="inactive">거래중지</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 공급자 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                공급자 목록 ({filteredSuppliers.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>업체코드</TableHead>
                    <TableHead>업체명</TableHead>
                    <TableHead>사업자번호</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>인증현황</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        등록된 공급자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-mono">{supplier.code}</TableCell>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.businessNo || "-"}</TableCell>
                        <TableCell>{supplier.type ? typeLabels[supplier.type] : "-"}</TableCell>
                        <TableCell>
                          {supplier.grade && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${gradeColors[supplier.grade]}`}>
                              {supplier.grade}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{supplier.contactName || "-"}</TableCell>
                        <TableCell>{supplier.contactPhone || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {supplier.certifications.map((cert, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={supplier.isActive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(supplier.id)}
                          >
                            {supplier.isActive ? "거래중" : "거래중지"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(supplier)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(supplier.id)}>
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
                {isAdding ? "신규 공급자 등록" : editingId ? "공급자 정보 수정" : "공급자 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [공급자 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 공급자의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>업체코드 *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="SUP-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>업체명 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="업체명 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>사업자번호</Label>
                      <Input
                        value={formData.businessNo}
                        onChange={(e) => setFormData({ ...formData, businessNo: e.target.value })}
                        placeholder="123-45-67890"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>대표자</Label>
                      <Input
                        value={formData.ceo}
                        onChange={(e) => setFormData({ ...formData, ceo: e.target.value })}
                        placeholder="대표자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>업체구분</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(v) => setFormData({ ...formData, type: v as Supplier["type"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="구분 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="제조">제조업체</SelectItem>
                          <SelectItem value="서비스">서비스업체</SelectItem>
                          <SelectItem value="물류">물류업체</SelectItem>
                          <SelectItem value="검사">검사기관</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>등급</Label>
                      <Select
                        value={formData.grade}
                        onValueChange={(v) => setFormData({ ...formData, grade: v as Supplier["grade"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="등급 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A등급 (우수)</SelectItem>
                          <SelectItem value="B">B등급 (양호)</SelectItem>
                          <SelectItem value="C">C등급 (보통)</SelectItem>
                          <SelectItem value="D">D등급 (개선필요)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>주소</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="주소 입력"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>담당자</Label>
                      <Input
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="담당자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>연락처</Label>
                      <Input
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="031-123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>이메일</Label>
                      <Input
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="email@company.co.kr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>인증현황</Label>
                    <div className="flex flex-wrap gap-2">
                      {["ISO 9001", "IATF 16949", "ISO 14001", "ISO 45001"].map((cert) => (
                        <Button
                          key={cert}
                          type="button"
                          variant={formData.certifications.includes(cert) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (formData.certifications.includes(cert)) {
                              setFormData({
                                ...formData,
                                certifications: formData.certifications.filter(c => c !== cert),
                              });
                            } else {
                              setFormData({
                                ...formData,
                                certifications: [...formData.certifications, cert],
                              });
                            }
                          }}
                        >
                          {cert}
                        </Button>
                      ))}
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
