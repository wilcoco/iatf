import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Gauge,
  GraduationCap,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const stats = [
  {
    title: "오늘 점검 항목",
    value: "12",
    description: "완료: 8 / 대기: 4",
    icon: ClipboardCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "미완료 부적합",
    value: "5",
    description: "진행중: 3 / 지연: 2",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "이번달 KPI 달성률",
    value: "87%",
    description: "전월 대비 +5%",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "계측기 교정 예정",
    value: "8",
    description: "이번 주 내 교정 필요",
    icon: Gauge,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

const todayTasks = [
  { id: 1, title: "사출기 #3 일상점검", type: "설비점검", status: "대기", dueTime: "09:00" },
  { id: 2, title: "NQ5 범퍼 초물검사", type: "생산검사", status: "완료", dueTime: "08:30" },
  { id: 3, title: "도장1라인 조도측정", type: "품질검사", status: "진행중", dueTime: "10:00" },
  { id: 4, title: "협력사 A 수입검사", type: "수입검사", status: "대기", dueTime: "11:00" },
  { id: 5, title: "버니어 캘리퍼스 교정", type: "계측관리", status: "대기", dueTime: "14:00" },
];

const upcomingDeadlines = [
  { id: 1, title: "내부심사 계획수립", dueDate: "2026-06-15", daysLeft: 6 },
  { id: 2, title: "반기 고객만족도 조사", dueDate: "2026-06-30", daysLeft: 21 },
  { id: 3, title: "공급자 정기평가", dueDate: "2026-06-20", daysLeft: 11 },
  { id: 4, title: "경영검토 보고서", dueDate: "2026-06-25", daysLeft: 16 },
];

const recentNonconformances = [
  { id: "NC2406-001", part: "NQ5 그릴", defect: "도장 이물", status: "분석중", date: "2026-06-07" },
  { id: "NC2406-002", part: "SP2 범퍼", defect: "치수 불량", status: "조치중", date: "2026-06-06" },
  { id: "NC2405-015", part: "PU 커버", defect: "부착성 불량", status: "지연", date: "2026-05-28" },
];

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "success" | "warning" | "error" | "default"> = {
    완료: "success",
    대기: "default",
    진행중: "warning",
    분석중: "warning",
    조치중: "warning",
    지연: "error",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">IATF 16949 품질관리시스템 현황</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              오늘의 할 일
            </CardTitle>
            <CardDescription>오늘 처리해야 할 점검 및 검사 항목</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    {task.status === "완료" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2" />
                    )}
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{task.dueTime}</span>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              다가오는 마감
            </CardTitle>
            <CardDescription>주요 업무 마감 일정</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.dueDate}</p>
                  </div>
                  <Badge variant={item.daysLeft <= 7 ? "error" : item.daysLeft <= 14 ? "warning" : "default"}>
                    D-{item.daysLeft}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Nonconformances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            최근 부적합 현황
          </CardTitle>
          <CardDescription>최근 발생한 부적합 건</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">부적합번호</th>
                  <th className="pb-3 font-medium">부품</th>
                  <th className="pb-3 font-medium">불량유형</th>
                  <th className="pb-3 font-medium">발생일</th>
                  <th className="pb-3 font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {recentNonconformances.map((nc) => (
                  <tr key={nc.id} className="border-b last:border-0">
                    <td className="py-3 font-medium text-primary">{nc.id}</td>
                    <td className="py-3">{nc.part}</td>
                    <td className="py-3">{nc.defect}</td>
                    <td className="py-3 text-muted-foreground">{nc.date}</td>
                    <td className="py-3">
                      <StatusBadge status={nc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
