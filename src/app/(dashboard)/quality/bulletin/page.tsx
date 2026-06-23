"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Megaphone,
  Plus,
  Save,
  Trash2,
  Search,
  AlertTriangle,
  FileText,
  Pin,
} from "lucide-react";

type PostCategory = "불량유형" | "중점관리" | "AUDIT회의록" | "공지";
type RefreshCycle = "주1회" | "월1회" | "수시";
type PostStatus = "게시중" | "만료";

interface BulletinPost {
  id: string;
  postNumber: string;
  category: PostCategory;
  title: string;
  content: string;
  location: string;
  postDate: string;
  refreshCycle: RefreshCycle;
  manager: string;
  status: PostStatus;
}

interface BulletinForm {
  category: PostCategory | "";
  title: string;
  content: string;
  location: string;
  postDate: string;
  refreshCycle: RefreshCycle | "";
  manager: string;
}

const initialForm: BulletinForm = {
  category: "",
  title: "",
  content: "",
  location: "",
  postDate: new Date().toISOString().split("T")[0],
  refreshCycle: "",
  manager: "",
};

const categoryVariant: Record<
  PostCategory,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "error"
> = {
  불량유형: "error",
  중점관리: "warning",
  AUDIT회의록: "default",
  공지: "secondary",
};

const initialPosts: BulletinPost[] = [
  {
    id: "1",
    postNumber: "BL-202606-001",
    category: "불량유형",
    title: "최근 도장불량유형 최신화",
    content:
      "도장 공정에서 최근 빈발하는 오렌지필, 흐름, 이물 불량의 발생 사례와 식별 포인트를 게시합니다.",
    location: "도장2라인",
    postDate: "2026-06-10",
    refreshCycle: "주1회",
    manager: "김도장",
    status: "게시중",
  },
  {
    id: "2",
    postNumber: "BL-202606-002",
    category: "AUDIT회의록",
    title: "AUDIT 회의록 게시",
    content:
      "내부심사(공정심사) 결과 도출된 부적합 사항 및 시정조치 진행현황 회의록을 현장에 공유합니다.",
    location: "조립1라인",
    postDate: "2026-06-12",
    refreshCycle: "월1회",
    manager: "이심사",
    status: "게시중",
  },
  {
    id: "3",
    postNumber: "BL-202606-003",
    category: "중점관리",
    title: "중점관리 항목",
    content:
      "당월 중점관리 특별특성(CTQ) 항목과 관리한계, 측정주기를 게시하여 작업자 인지를 강화합니다.",
    location: "가공3라인",
    postDate: "2026-06-01",
    refreshCycle: "수시",
    manager: "박관리",
    status: "게시중",
  },
  {
    id: "4",
    postNumber: "BL-202605-014",
    category: "공지",
    title: "5월 품질의 날 행사 안내",
    content: "5월 품질의 날 행사 일정 및 우수 개선사례 시상 안내입니다.",
    location: "전사 게시판",
    postDate: "2026-05-20",
    refreshCycle: "수시",
    manager: "최품질",
    status: "만료",
  },
];

export default function BulletinPage() {
  const [activeTab, setActiveTab] = useState("register");
  const [form, setForm] = useState<BulletinForm>(initialForm);
  const [posts, setPosts] = useState<BulletinPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const updateField = <K extends keyof BulletinForm>(
    field: K,
    value: BulletinForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generatePostNumber = () => {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const seq = String(posts.length + 1).padStart(3, "0");
    return `BL-${ym}-${seq}`;
  };

  const handleSave = () => {
    if (
      !form.category ||
      !form.title.trim() ||
      !form.content.trim() ||
      !form.location.trim() ||
      !form.postDate ||
      !form.refreshCycle ||
      !form.manager.trim()
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const newPost: BulletinPost = {
      id: Date.now().toString(),
      postNumber: generatePostNumber(),
      category: form.category,
      title: form.title.trim(),
      content: form.content.trim(),
      location: form.location.trim(),
      postDate: form.postDate,
      refreshCycle: form.refreshCycle,
      manager: form.manager.trim(),
      status: "게시중",
    };

    setPosts((prev) => [...prev, newPost]);
    setForm(initialForm);
    alert("게시물이 등록되었습니다.");
    setActiveTab("status");
  };

  const handleToggleStatus = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "게시중" ? "만료" : "게시중" }
          : p
      )
    );
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPosts = posts.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.title.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term)
    );
  });

  const activeCount = posts.filter((p) => p.status === "게시중").length;
  const expiredCount = posts.filter((p) => p.status === "만료").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">현장 게시판</h1>
        <p className="text-muted-foreground">
          현장 게시판 관리 (중점관리/불량유형 게시) — 중점관리 항목, 최신
          불량유형, AUDIT 회의록 등을 등록하고 게시 현황을 관리합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            현장 게시판 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">게시물 등록</TabsTrigger>
              <TabsTrigger value="status">게시 현황</TabsTrigger>
            </TabsList>

            {/* Tab 1: 게시물 등록 */}
            <TabsContent value="register" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>게시구분</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      updateField("category", value as PostCategory)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="게시구분 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="불량유형">불량유형</SelectItem>
                      <SelectItem value="중점관리">중점관리</SelectItem>
                      <SelectItem value="AUDIT회의록">AUDIT회의록</SelectItem>
                      <SelectItem value="공지">공지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">담당자</Label>
                  <Input
                    id="manager"
                    value={form.manager}
                    onChange={(e) => updateField("manager", e.target.value)}
                    placeholder="담당자명 입력"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="게시물 제목 입력"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="게시 내용을 입력하세요"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">게시위치 (공정/라인)</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="예: 도장2라인"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postDate">게시일</Label>
                  <Input
                    id="postDate"
                    type="date"
                    value={form.postDate}
                    onChange={(e) => updateField("postDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>갱신주기</Label>
                  <Select
                    value={form.refreshCycle}
                    onValueChange={(value) =>
                      updateField("refreshCycle", value as RefreshCycle)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="갱신주기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="주1회">주1회</SelectItem>
                      <SelectItem value="월1회">월1회</SelectItem>
                      <SelectItem value="수시">수시</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                <Pin className="h-4 w-4 shrink-0" />
                저장 시 게시물은 자동으로 &quot;게시중&quot; 상태로 등록되며,
                게시번호가 자동 생성됩니다.
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setForm(initialForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  초기화
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </div>
            </TabsContent>

            {/* Tab 2: 게시 현황 */}
            <TabsContent value="status" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">전체 게시물</p>
                      <p className="text-2xl font-bold">{posts.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Megaphone className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">게시중</p>
                      <p className="text-2xl font-bold">{activeCount}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">만료</p>
                      <p className="text-2xl font-bold">{expiredCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="제목 또는 게시위치로 검색"
                  className="pl-9"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>게시번호</TableHead>
                      <TableHead>게시구분</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>게시위치</TableHead>
                      <TableHead>게시일</TableHead>
                      <TableHead>갱신주기</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center text-muted-foreground py-8"
                        >
                          게시물이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-mono text-xs">
                            {post.postNumber}
                          </TableCell>
                          <TableCell>
                            <Badge variant={categoryVariant[post.category]}>
                              {post.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {post.title}
                          </TableCell>
                          <TableCell>{post.location}</TableCell>
                          <TableCell>{post.postDate}</TableCell>
                          <TableCell>{post.refreshCycle}</TableCell>
                          <TableCell>{post.manager}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === "게시중" ? "success" : "secondary"
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(post.id)}
                              >
                                {post.status === "게시중" ? "만료처리" : "게시처리"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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
