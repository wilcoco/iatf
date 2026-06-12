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
import { Plus, FileText, Search, Edit, Trash2, Save, X, Download, Upload } from "lucide-react";
import {
  drawings as initialDrawings,
  getActiveParts,
  getCustomers,
  type Drawing,
  type Part,
  type Customer
} from "@/lib/master-data";

// 로컬 확장 타입
interface DrawingExtended extends Drawing {
  createdAt: string;
  updatedAt: string;
}

// 초기 데이터 확장
const extendedInitialDrawings: DrawingExtended[] = initialDrawings.map(d => ({
  ...d,
  createdAt: "2023-01-01",
  updatedAt: "2024-01-01",
}));

export default function DrawingsPage() {
  const [drawings, setDrawings] = useState<DrawingExtended[]>(extendedInitialDrawings);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCustomer, setFilterCustomer] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFileType, setFilterFileType] = useState<string>("all");

  const [activeTab, setActiveTab] = useState("list");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const parts = getActiveParts();
  const customers = getCustomers();

  const [formData, setFormData] = useState<Omit<DrawingExtended, "id" | "createdAt" | "updatedAt">>({
    code: "",
    partCode: "",
    partName: "",
    customerCode: "",
    customerName: "",
    revisionNo: "A",
    revisionDate: "",
    revisionContent: "",
    fileType: "2D CAD",
    filePath: "",
    status: "최신",
    approver: "",
    approvalDate: "",
    isActive: true,
  });

  const statusColors: Record<string, string> = {
    "최신": "bg-green-100 text-green-800",
    "구버전": "bg-yellow-100 text-yellow-800",
    "폐기": "bg-red-100 text-red-800",
  };

  const fileTypeLabels: Record<string, string> = {
    "2D CAD": "2D CAD",
    "3D CAD": "3D CAD",
    "PDF": "PDF",
    "기타": "기타",
  };

  // 필터링된 도면 목록
  const filteredDrawings = drawings.filter((d) => {
    const matchesSearch =
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.partCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = filterCustomer === "all" || d.customerCode === filterCustomer;
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    const matchesFileType = filterFileType === "all" || d.fileType === filterFileType;
    return matchesSearch && matchesCustomer && matchesStatus && matchesFileType;
  });

  // 통계
  const stats = {
    total: drawings.length,
    latest: drawings.filter(d => d.status === "최신").length,
    oldVersion: drawings.filter(d => d.status === "구버전").length,
  };

  const resetForm = () => {
    setFormData({
      code: "",
      partCode: "",
      partName: "",
      customerCode: "",
      customerName: "",
      revisionNo: "A",
      revisionDate: "",
      revisionContent: "",
      fileType: "2D CAD",
      filePath: "",
      status: "최신",
      approver: "",
      approvalDate: "",
      isActive: true,
    });
  };

  const generateCode = () => {
    const maxNum = drawings.reduce((max, d) => {
      const num = parseInt(d.code.replace("DWG-", ""));
      return num > max ? num : max;
    }, 0);
    return `DWG-${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    resetForm();
    setFormData(prev => ({ ...prev, code: generateCode() }));
    setActiveTab("register");
  };

  const handleEdit = (drawing: DrawingExtended) => {
    setIsAdding(false);
    setEditingId(drawing.id);
    setActiveTab("register");
    setFormData({
      code: drawing.code,
      partCode: drawing.partCode,
      partName: drawing.partName,
      customerCode: drawing.customerCode,
      customerName: drawing.customerName,
      revisionNo: drawing.revisionNo,
      revisionDate: drawing.revisionDate,
      revisionContent: drawing.revisionContent,
      fileType: drawing.fileType,
      filePath: drawing.filePath,
      status: drawing.status,
      approver: drawing.approver,
      approvalDate: drawing.approvalDate,
      isActive: drawing.isActive,
    });
  };

  const handleSave = () => {
    if (!formData.code || !formData.partCode) {
      alert("도면번호와 품번은 필수입니다.");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isAdding) {
      const newDrawing: DrawingExtended = {
        id: Date.now(),
        ...formData,
        createdAt: now,
        updatedAt: now,
      };
      setDrawings([...drawings, newDrawing]);
    } else if (editingId) {
      setDrawings(drawings.map(d =>
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
      setDrawings(drawings.filter(d => d.id !== id));
    }
  };

  const handlePartChange = (partCode: string) => {
    const selectedPart = parts.find(p => p.code === partCode);
    if (selectedPart) {
      // 고객사 정보 자동 설정
      const customer = customers.find(c => c.name === selectedPart.customer);
      setFormData({
        ...formData,
        partCode: selectedPart.code,
        partName: selectedPart.name,
        customerCode: customer?.code || "",
        customerName: selectedPart.customer,
      });
    }
  };

  const handleCustomerChange = (customerCode: string) => {
    const selectedCustomer = customers.find(c => c.code === customerCode);
    if (selectedCustomer) {
      setFormData({
        ...formData,
        customerCode: selectedCustomer.code,
        customerName: selectedCustomer.name,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">도면 관리</h1>
          <p className="text-muted-foreground">도면 마스터 데이터 관리</p>
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
            도면 등록
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">전체 도면</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.latest}</div>
            <p className="text-sm text-muted-foreground">최신</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.oldVersion}</div>
            <p className="text-sm text-muted-foreground">구버전</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">도면 목록</TabsTrigger>
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
                      placeholder="도면번호, 품번, 품명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="고객사" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 고객사</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.code} value={customer.code}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="최신">최신</SelectItem>
                    <SelectItem value="구버전">구버전</SelectItem>
                    <SelectItem value="폐기">폐기</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFileType} onValueChange={setFilterFileType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="파일유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 유형</SelectItem>
                    <SelectItem value="2D CAD">2D CAD</SelectItem>
                    <SelectItem value="3D CAD">3D CAD</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 도면 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                도면 목록 ({filteredDrawings.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>도면번호</TableHead>
                    <TableHead>품번</TableHead>
                    <TableHead>품명</TableHead>
                    <TableHead>고객사</TableHead>
                    <TableHead>개정번호</TableHead>
                    <TableHead>개정일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>파일유형</TableHead>
                    <TableHead className="text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrawings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        등록된 도면이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrawings.map((drawing) => (
                      <TableRow key={drawing.id}>
                        <TableCell className="font-mono">{drawing.code}</TableCell>
                        <TableCell className="font-mono">{drawing.partCode}</TableCell>
                        <TableCell className="font-medium">{drawing.partName}</TableCell>
                        <TableCell>{drawing.customerName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{drawing.revisionNo}</Badge>
                        </TableCell>
                        <TableCell>{drawing.revisionDate}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[drawing.status]}`}>
                            {drawing.status}
                          </span>
                        </TableCell>
                        <TableCell>{fileTypeLabels[drawing.fileType]}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(drawing)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(drawing.id)}>
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
                {isAdding ? "신규 도면 등록" : editingId ? "도면 정보 수정" : "도면 등록/수정"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdding && !editingId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>상단의 [도면 등록] 버튼을 클릭하거나</p>
                  <p>목록에서 수정할 도면의 편집 버튼을 클릭하세요.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>도면번호 *</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="DWG-001"
                        readOnly={!!editingId}
                        className={editingId ? "bg-muted" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>품번 선택 *</Label>
                      <Select
                        value={formData.partCode}
                        onValueChange={handlePartChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="품번 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {parts.map((part) => (
                            <SelectItem key={part.code} value={part.code}>
                              {part.code} - {part.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>품명</Label>
                      <Input
                        value={formData.partName}
                        readOnly
                        className="bg-muted"
                        placeholder="품번 선택 시 자동 입력"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>고객사 선택</Label>
                      <Select
                        value={formData.customerCode}
                        onValueChange={handleCustomerChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="고객사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.code} value={customer.code}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>개정번호</Label>
                      <Input
                        value={formData.revisionNo}
                        onChange={(e) => setFormData({ ...formData, revisionNo: e.target.value })}
                        placeholder="A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>개정일</Label>
                      <Input
                        type="date"
                        value={formData.revisionDate}
                        onChange={(e) => setFormData({ ...formData, revisionDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>개정내용</Label>
                    <Input
                      value={formData.revisionContent}
                      onChange={(e) => setFormData({ ...formData, revisionContent: e.target.value })}
                      placeholder="개정내용 입력"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>파일유형</Label>
                      <Select
                        value={formData.fileType}
                        onValueChange={(v) => setFormData({ ...formData, fileType: v as Drawing["fileType"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="파일유형 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2D CAD">2D CAD</SelectItem>
                          <SelectItem value="3D CAD">3D CAD</SelectItem>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>승인자</Label>
                      <Input
                        value={formData.approver}
                        onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                        placeholder="승인자명"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>승인일</Label>
                      <Input
                        type="date"
                        value={formData.approvalDate}
                        onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => setFormData({ ...formData, status: v as Drawing["status"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="최신">최신</SelectItem>
                          <SelectItem value="구버전">구버전</SelectItem>
                          <SelectItem value="폐기">폐기</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>파일경로</Label>
                      <Input
                        value={formData.filePath}
                        onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                        placeholder="/drawings/DWG-001-A.dwg"
                      />
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
