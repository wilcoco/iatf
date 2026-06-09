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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Building2, Search, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import { departments as initialDepartments, type Department } from "@/lib/master-data";

// 로컬 확장 타입
interface DepartmentExtended extends Department {
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialDepartments: DepartmentExtended[] = initialDepartments.map(d => ({
  ...d,
  description: "",
  isActive: true,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentExtended[]>(extendedInitialDepartments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<DepartmentExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    name: "",
    parentCode: null,
    manager: "",
    phone: "",
    description: "",
    isActive: true,
  });

  // 필터링된 부서 목록
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch =
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && d.isActive) ||
      (filterStatus === "inactive" && !d.isActive);
    return matchesSearch && matchesStatus;
  });

  // 통계
  const stats = {
    total: departments.length,
    active: departments.filter(d => d.isActive).length,
    inactive: departments.filter(d => !d.isActive).length,
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      parentCode: null,
      manager: "",
      phone: "",
      description: "",
      isActive: true,
    });
  };

  const generateCode = () => {
    const maxNum = departments.reduce((max, d) => {
      const num = parseInt(d.code.replace("DEPT-", ""));
      return num > max ? num : max;
    }, 0);
    return `DEPT-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (department: DepartmentExtended) => {
    setIsAdding(false);
    setEditingId(department.id);
    setActiveTab("register");
    setFormData({
      code: department.code,
      name: department.name,
      parentCode: department.parentCode,
      manager: department.manager,
      phone: department.phone,
      description: department.description,
      isActive: department.isActive,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert("부서코드와 부서명은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newDepartment: DepartmentExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setDepartments([...departments, newDepartment]);
    } else if (editingId) {
      setDepartments(departments.map(d =>
        d.id === editingId
          ? { ...d, ...formData, updatedAt: now }
          : d
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
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setDepartments(departments.map(d =>
      d.id === id ? { ...d, isActive: !d.isActive, updatedAt: new Date().toISOString().split("T")[0] } : d
    ));
  };

  // 상위부서 이름 가져오기
  const getParentName = (parentCode: string | null) => {
    if (!parentCode) return "-";
    const parent = departments.find(d => d.code === parentCode);
    return parent ? parent.name : "-";
  };

  // 상위부서 선택 시 자기 자신 제외
  const getAvailableParents = () => {
    if (isAdding) return departments;
    return departments.filter(d => d.id !== editingId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">부서 관리</h1>
          <p className="text-muted-foreground">조직 부서 마스터 데이터 관리</p>
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
            부서 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 부서</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">활성 부서</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
            <p className="text-sm text-muted-foreground">비활성 부서</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">부서 목록</TabsTrigger>
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
                      placeholder="부서코드, 부서명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 부서 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                부서 목록 ({filteredDepartments.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서코드</TableHead>
                    <TableHead>부서명</TableHead>
                    <TableHead>부서장</TableHead>
                    <TableHead>상위부서</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        등록된 부서가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDepartments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-mono">{department.code}</TableCell>
                        <TableCell className="font-medium">{department.name}</TableCell>
                        <TableCell>{department.manager || "-"}</TableCell>
                        <TableCell>{getParentName(department.parentCode)}</TableCell>
                        <TableCell>{department.phone || "-"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {department.description || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={department.isActive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(department.id)}
                          >
                            {department.isActive ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(department)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(department.id)}>
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
                {isAdding ? "신규 부서 등록" : editingId ? "부서 정보 수정" : "부서 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [부서 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 부서의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>부서코드 *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="DEPT-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>부서명 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="부서명 입력"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>부서장</Label>
                      <Input
                        value={formData.manager}
                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        placeholder="부서장명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상위부서</Label>
                      <Select
                        value={formData.parentCode || "none"}
                        onValueChange={(v) => setFormData({ ...formData, parentCode: v === "none" ? null : v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상위부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">없음 (최상위)</SelectItem>
                          {getAvailableParents().map((dept) => (
                            <SelectItem key={dept.id} value={dept.code}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>연락처</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="031-100-1000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={formData.isActive ? "active" : "inactive"}
                        onValueChange={(v) => setFormData({ ...formData, isActive: v === "active" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">활성</SelectItem>
                          <SelectItem value="inactive">비활성</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>설명</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="부서에 대한 설명을 입력하세요"
                      rows={3}
                    />
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
