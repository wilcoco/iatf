"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wrench,
  Plus,
  Save,
  Trash2,
  Search,
  TrendingUp,
  CheckCircle,
  Lightbulb,
} from "lucide-react"

// 개선분야 옵션
const IMPROVEMENT_FIELDS = [
  "3정5S",
  "품질개선",
  "물류개선",
  "작업개선",
  "설비개선",
  "원가절감",
  "조립",
  "F-PROOF",
  "기타",
] as const

type ImprovementField = (typeof IMPROVEMENT_FIELDS)[number]
type ImprovementStatus = "계획" | "진행중" | "완료"

// 공정개선 활동 데이터 타입
interface ImprovementItem {
  id: number
  improvementNo: string
  title: string
  department: string
  manager: string
  qualityAdvisor: string
  field: ImprovementField
  background: string
  problem: string
  content: string
  investment: string
  startDate: string
  endDate: string
  expectedEffect: string
  status: ImprovementStatus
}

// 개선분야 Badge 색상
const fieldBadgeClass = (field: ImprovementField): string => {
  switch (field) {
    case "품질개선":
      return "bg-purple-100 text-purple-800"
    case "설비개선":
      return "bg-amber-100 text-amber-800"
    case "물류개선":
      return "bg-cyan-100 text-cyan-800"
    case "작업개선":
      return "bg-indigo-100 text-indigo-800"
    case "원가절감":
      return "bg-rose-100 text-rose-800"
    case "3정5S":
      return "bg-teal-100 text-teal-800"
    case "조립":
      return "bg-lime-100 text-lime-800"
    case "F-PROOF":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// 상태 Badge 색상
const statusBadgeClass = (status: ImprovementStatus): string => {
  switch (status) {
    case "계획":
      return "bg-gray-100 text-gray-700"
    case "진행중":
      return "bg-blue-100 text-blue-700"
    case "완료":
      return "bg-green-100 text-green-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

// 신규 입력 폼 타입
interface ImprovementForm {
  title: string
  department: string
  manager: string
  qualityAdvisor: string
  field: ImprovementField
  background: string
  problem: string
  content: string
  investment: string
  startDate: string
  endDate: string
  expectedEffect: string
  status: ImprovementStatus
}

const emptyForm: ImprovementForm = {
  title: "",
  department: "",
  manager: "",
  qualityAdvisor: "",
  field: "설비개선",
  background: "",
  problem: "",
  content: "",
  investment: "",
  startDate: "",
  endDate: "",
  expectedEffect: "",
  status: "계획",
}

export default function ImprovementPage() {
  const [activeTab, setActiveTab] = useState("register")
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState<ImprovementForm>(emptyForm)

  // 공정개선 활동 목록 (mock)
  const [items, setItems] = useState<ImprovementItem[]>([
    {
      id: 1,
      improvementNo: "2024001",
      title: "도장 믹싱룸 공정개선",
      department: "도장팀 / 캠스(광주)",
      manager: "김지용",
      qualityAdvisor: "박상호",
      field: "설비개선",
      background: "도료 믹싱 작업의 수작업 비중이 높아 색상 편차 및 작업 부하 발생",
      problem: "수동 믹싱으로 인한 배합비 편차, 작업자 피로도 증가, 도료 LOSS 과다",
      content: "자동 믹싱 설비 도입 및 배합 레시피 표준화, 정량 토출 시스템 적용",
      investment: "3.1억",
      startDate: "2024-02-28",
      endDate: "2024-03-31",
      expectedEffect: "색상 편차 50% 감소, 도료 LOSS 30% 절감, 작업 공수 2명 절감",
      status: "완료",
    },
    {
      id: 2,
      improvementNo: "2024002",
      title: "사출 금형 교환 시간 단축",
      department: "사출팀 / 신성정밀",
      manager: "이정훈",
      qualityAdvisor: "최영미",
      field: "작업개선",
      background: "금형 교환(SMED) 시간이 길어 가동률 저하 및 LOT 변경 대응 지연",
      problem: "금형 교환 평균 45분 소요, 외부 준비 작업 미흡, 표준 절차 부재",
      content: "SMED 기법 적용, 외부 준비 작업 분리, 퀵 클램프 및 표준 작업서 도입",
      investment: "0.8억",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      expectedEffect: "금형 교환 시간 45분 → 20분 단축, 가동률 5% 향상",
      status: "진행중",
    },
    {
      id: 3,
      improvementNo: "2024003",
      title: "범퍼 조립라인 물류 동선 개선",
      department: "조립팀 / 본사",
      manager: "정우성",
      qualityAdvisor: "한지민",
      field: "물류개선",
      background: "조립라인 부품 공급 동선이 길어 운반 공수 과다 및 재공 증가",
      problem: "부품 적치장과 라인 간 거리 과다, 대차 운반 빈도 높음, 재공 재고 과다",
      content: "라인사이드 직서열 공급(JIS) 적용, 적치장 재배치, AGV 운반 도입 검토",
      investment: "1.5억",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      expectedEffect: "운반 공수 40% 절감, 라인사이드 재공 30% 감소",
      status: "계획",
    },
  ])

  // 요약 통계
  const totalCount = items.length
  const inProgressCount = items.filter((i) => i.status === "진행중").length
  const completedCount = items.filter((i) => i.status === "완료").length
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // 검색 필터
  const filteredItems = items.filter((item) => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return true
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.field.toLowerCase().includes(keyword)
    )
  })

  // 자동 개선번호 생성 (2026XXX)
  const generateImprovementNo = (): string => {
    const year = 2026
    const yearItems = items.filter((i) =>
      i.improvementNo.startsWith(String(year))
    )
    const next = yearItems.length + 1
    return `${year}${String(next).padStart(3, "0")}`
  }

  // 저장
  const handleSave = () => {
    if (!form.title.trim()) {
      alert("공정개선명을 입력하세요.")
      return
    }
    if (!form.manager.trim()) {
      alert("개선담당자를 입력하세요.")
      return
    }
    if (!form.startDate || !form.endDate) {
      alert("개선기간(시작/종료)을 입력하세요.")
      return
    }

    const newItem: ImprovementItem = {
      id: Date.now(),
      improvementNo: generateImprovementNo(),
      title: form.title.trim(),
      department: form.department.trim(),
      manager: form.manager.trim(),
      qualityAdvisor: form.qualityAdvisor.trim(),
      field: form.field,
      background: form.background.trim(),
      problem: form.problem.trim(),
      content: form.content.trim(),
      investment: form.investment.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      expectedEffect: form.expectedEffect.trim(),
      status: form.status,
    }

    setItems([...items, newItem])
    setForm(emptyForm)
    alert(`개선번호 ${newItem.improvementNo} 로 등록되었습니다.`)
    setActiveTab("status")
  }

  // 삭제
  const handleDelete = (id: number) => {
    setItems(items.filter((i) => i.id !== id))
  }

  // 기간 표시 포맷 (YYYY-MM-DD → YYYY.MM.DD)
  const formatPeriod = (start: string, end: string): string => {
    const fmt = (d: string) => d.replace(/-/g, ".")
    if (!start && !end) return "-"
    return `${fmt(start)} ~ ${fmt(end)}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">공정개선 활동</h1>
        <p className="text-muted-foreground">
          공정개선 활동을 등록하고 진행 현황 및 기대효과를 관리합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            공정개선 활동관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">개선 등록</TabsTrigger>
              <TabsTrigger value="status">개선 현황</TabsTrigger>
            </TabsList>

            {/* Tab 1: 개선 등록 */}
            <TabsContent value="register" className="space-y-6 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">공정개선명</Label>
                  <Input
                    id="title"
                    placeholder="예: 도장 믹싱룸 공정개선"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서 / 협력사</Label>
                  <Input
                    id="department"
                    placeholder="예: 도장팀 / 캠스(광주)"
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">개선담당자</Label>
                  <Input
                    id="manager"
                    placeholder="예: 김지용"
                    value={form.manager}
                    onChange={(e) =>
                      setForm({ ...form, manager: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualityAdvisor">품질지도담당자</Label>
                  <Input
                    id="qualityAdvisor"
                    placeholder="예: 박상호"
                    value={form.qualityAdvisor}
                    onChange={(e) =>
                      setForm({ ...form, qualityAdvisor: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">개선분야</Label>
                  <Select
                    value={form.field}
                    onValueChange={(value) =>
                      setForm({ ...form, field: value as ImprovementField })
                    }
                  >
                    <SelectTrigger id="field">
                      <SelectValue placeholder="개선분야 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPROVEMENT_FIELDS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      setForm({ ...form, status: value as ImprovementStatus })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="계획">계획</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investment">투자비</Label>
                  <Input
                    id="investment"
                    placeholder="예: 3.1억"
                    value={form.investment}
                    onChange={(e) =>
                      setForm({ ...form, investment: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">개선기간 시작</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) =>
                        setForm({ ...form, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">개선기간 종료</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={(e) =>
                        setForm({ ...form, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">배경 / 목적</Label>
                <Textarea
                  id="background"
                  placeholder="개선의 배경 및 목적을 입력하세요."
                  value={form.background}
                  onChange={(e) =>
                    setForm({ ...form, background: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">문제점 (개선 전)</Label>
                <Textarea
                  id="problem"
                  placeholder="개선 전 문제점을 입력하세요."
                  value={form.problem}
                  onChange={(e) =>
                    setForm({ ...form, problem: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">개선내용 (개선 후)</Label>
                <Textarea
                  id="content"
                  placeholder="개선 후 내용을 입력하세요."
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedEffect">기대효과</Label>
                <Textarea
                  id="expectedEffect"
                  placeholder="개선을 통한 기대효과를 입력하세요."
                  value={form.expectedEffect}
                  onChange={(e) =>
                    setForm({ ...form, expectedEffect: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setForm(emptyForm)}>
                  <Plus className="mr-2 h-4 w-4" />
                  초기화
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </div>
            </TabsContent>

            {/* Tab 2: 개선 현황 */}
            <TabsContent value="status" className="space-y-6 pt-4">
              {/* 요약 카드 */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      총 개선건수
                    </CardTitle>
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalCount} 건</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">진행중</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {inProgressCount} 건
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">완료</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {completedCount} 건
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">완료율</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completionRate}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* 검색 */}
              <div className="flex items-center gap-2">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="개선명 / 분야로 검색"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* 현황 테이블 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>개선번호</TableHead>
                      <TableHead>공정개선명</TableHead>
                      <TableHead>개선분야</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>개선기간</TableHead>
                      <TableHead className="text-right">투자비</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground"
                        >
                          등록된 공정개선 활동이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.improvementNo}
                          </TableCell>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={fieldBadgeClass(item.field)}
                            >
                              {item.field}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.manager}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm">
                            {formatPeriod(item.startDate, item.endDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.investment || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={statusBadgeClass(item.status)}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
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
  )
}
