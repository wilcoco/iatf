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
import { Plus, Users, Search, Edit, Trash2, Save, X, Download, Upload, Shield, UserCheck } from "lucide-react";
import { departments, type Department } from "@/lib/master-data";

// 사용자 인터페이스
interface User {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  departmentCode: string;
  departmentName: string;
  position: string;
  role: "admin" | "manager" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 초기 사용자 데이터
const initialUsers: User[] = [
  { id: 1, employeeId: "EMP-001", name: "김관리", email: "admin@company.co.kr", departmentCode: "DEPT-001", departmentName: "경영지원팀", position: "팀장", role: "admin", isActive: true, createdAt: "2023-01-01", updatedAt: "2024-01-01" },
  { id: 2, employeeId: "EMP-002", name: "이영업", email: "sales@company.co.kr", departmentCode: "DEPT-002", departmentName: "영업팀", position: "팀장", role: "manager", isActive: true, createdAt: "2023-01-15", updatedAt: "2024-02-01" },
  { id: 3, employeeId: "EMP-003", name: "박품질", email: "quality@company.co.kr", departmentCode: "DEPT-003", departmentName: "품질관리팀", position: "팀장", role: "manager", isActive: true, createdAt: "2023-02-01", updatedAt: "2024-01-15" },
  { id: 4, employeeId: "EMP-004", name: "최생산", email: "production@company.co.kr", departmentCode: "DEPT-004", departmentName: "생산관리팀", position: "팀장", role: "manager", isActive: true, createdAt: "2023-02-15", updatedAt: "2024-03-01" },
  { id: 5, employeeId: "EMP-005", name: "정대리", email: "junior@company.co.kr", departmentCode: "DEPT-003", departmentName: "품질관리팀", position: "대리", role: "user", isActive: true, createdAt: "2023-03-01", updatedAt: "2024-01-20" },
  { id: 6, employeeId: "EMP-006", name: "강사원", email: "staff@company.co.kr", departmentCode: "DEPT-004", departmentName: "생산관리팀", position: "사원", role: "user", isActive: false, createdAt: "2023-04-01", updatedAt: "2024-02-15" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<User, "id" | "createdAt" | "updatedAt">>({
    employeeId: "",
    name: "",
    email: "",
    departmentCode: "",
    departmentName: "",
    position: "",
    role: "user",
    isActive: true,
  });

  const roleLabels: Record<string, string> = {
    admin: "관리자",
    manager: "매니저",
    user: "일반사용자",
  };

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    manager: "bg-blue-100 text-blue-800",
    user: "bg-gray-100 text-gray-800",
  };

  // 필터링된 사용자 목록
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || u.departmentCode === filterDepartment;
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && u.isActive) ||
      (filterStatus === "inactive" && !u.isActive);
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // 통계
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admin: users.filter(u => u.role === "admin").length,
    manager: users.filter(u => u.role === "manager").length,
    user: users.filter(u => u.role === "user").length,
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
      name: "",
      email: "",
      departmentCode: "",
      departmentName: "",
      position: "",
      role: "user",
      isActive: true,
    });
  };

  const generateEmployeeId = () => {
    const maxNum = users.reduce((max, u) => {
      const num = parseInt(u.employeeId.replace("EMP-", ""));
      return num > max ? num : max;
    }, 0);
    return `EMP-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, employeeId: generateEmployeeId() }));
    setActiveTab("register");
  };

  const handleEdit = (user: User) => {
    setIsAdding(false);
    setEditingId(user.id);
    setActiveTab("register");
    setFormData({
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      departmentCode: user.departmentCode,
      departmentName: user.departmentName,
      position: user.position,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleSave = () => {
    if (!formData.employeeId || !formData.name) {
      alert("사용자 ID와 이름은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newUser: User = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setUsers([...users, newUser]);
    } else if (editingId) {
      setUsers(users.map(u =>
        u.id === editingId
          ? { ...u, ...formData, updatedAt: now }
          : u
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
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, isActive: !u.isActive, updatedAt: new Date().toISOString().split("T")[0] } : u
    ));
  };

  const handleDepartmentChange = (deptCode: string) => {
    const dept = departments.find(d => d.code === deptCode);
    setFormData({
      ...formData,
      departmentCode: deptCode,
      departmentName: dept ? dept.name : "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">사용자 관리</h1>
          <p className="text-muted-foreground">시스템 사용자 계정 관리</p>
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
            사용자 추가
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 사용자</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">활성</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
            <p className="text-sm text-muted-foreground">비활성</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.admin}</div>
            <p className="text-sm text-muted-foreground">관리자</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.manager}</div>
            <p className="text-sm text-muted-foreground">매니저</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-600">{stats.user}</div>
            <p className="text-sm text-muted-foreground">일반사용자</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">사용자 목록</TabsTrigger>
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
                      placeholder="사번, 이름, 이메일 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="부서" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 부서</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="역할" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 역할</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                    <SelectItem value="manager">매니저</SelectItem>
                    <SelectItem value="user">일반사용자</SelectItem>
                  </SelectContent>
                </Select>
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

          {/* 사용자 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                사용자 목록 ({filteredUsers.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직책</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        등록된 사용자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.employeeId}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email || "-"}</TableCell>
                        <TableCell>{user.departmentName || "-"}</TableCell>
                        <TableCell>{user.position || "-"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                            {roleLabels[user.role]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.isActive ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(user.id)}>
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
              <CardTitle className="flex items-center gap-2">
                {isAdding ? <Plus className="h-5 w-5" /> : editingId ? <Edit className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                {isAdding ? "신규 사용자 등록" : editingId ? "사용자 정보 수정" : "사용자 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [사용자 추가] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 사용자의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>사용자 ID *</Label>
                      <Input
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="EMP-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>이름 *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="이름 입력"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>이메일</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@company.co.kr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>부서</Label>
                      <Select
                        value={formData.departmentCode}
                        onValueChange={handleDepartmentChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="부서 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.code} value={dept.code}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>직책</Label>
                      <Input
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="예: 팀장, 과장, 대리, 사원"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>역할</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(v) => setFormData({ ...formData, role: v as User["role"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="역할 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-red-500" />
                              관리자
                            </div>
                          </SelectItem>
                          <SelectItem value="manager">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-blue-500" />
                              매니저
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              일반사용자
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
