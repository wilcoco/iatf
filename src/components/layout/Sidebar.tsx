"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  ClipboardCheck,
  FlaskConical,
  Wrench,
  GraduationCap,
  Search,
  BarChart3,
  Truck,
  AlertTriangle,
  Settings,
  ChevronDown,
  Building2,
  Users,
  FileText,
  Box,
  Gauge,
  Factory,
  Hammer,
  Ruler,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "기록입력 (118항목)",
    href: "/records",
    icon: ClipboardCheck,
  },
  {
    title: "기록이력 조회",
    href: "/records/history",
    icon: Search,
  },
  {
    title: "관리항목 목록",
    href: "/control-items",
    icon: FileText,
  },
  {
    title: "기준정보",
    icon: Database,
    children: [
      { title: "부서관리", href: "/master/departments", icon: Building2 },
      { title: "사용자관리", href: "/master/users", icon: Users },
      { title: "프로세스/절차서", href: "/master/processes", icon: FileText },
      { title: "차종/부품", href: "/master/parts", icon: Box },
      { title: "설비", href: "/master/equipment", icon: Factory },
      { title: "금형", href: "/master/molds", icon: Hammer },
      { title: "지그", href: "/master/jigs", icon: Ruler },
      { title: "계측기", href: "/master/instruments", icon: Gauge },
      { title: "공급자", href: "/master/suppliers", icon: Truck },
    ],
  },
  {
    title: "일상관리",
    icon: ClipboardCheck,
    children: [
      { title: "설비일상점검", href: "/daily/equipment-check", icon: Factory },
      { title: "금형점검/보수", href: "/daily/mold-check", icon: Hammer },
      { title: "지그점검", href: "/daily/jig-check", icon: Ruler },
      { title: "초/중/종물 검사", href: "/daily/production-inspection", icon: ClipboardCheck },
    ],
  },
  {
    title: "품질관리",
    icon: FlaskConical,
    children: [
      { title: "수입검사", href: "/quality/incoming", icon: ClipboardCheck },
      { title: "출하검사", href: "/quality/shipping", icon: ClipboardCheck },
      { title: "신뢰성시험", href: "/quality/reliability", icon: FlaskConical },
      { title: "부착성시험", href: "/quality/adhesion", icon: FlaskConical },
      { title: "색차관리", href: "/quality/color", icon: FlaskConical },
      { title: "도막두께", href: "/quality/coating", icon: Gauge },
      { title: "부적합관리", href: "/quality/nonconformance", icon: AlertTriangle },
      { title: "시정조치", href: "/quality/corrective-action", icon: Wrench },
    ],
  },
  {
    title: "설비/계측관리",
    icon: Wrench,
    children: [
      { title: "예방보전", href: "/equipment/maintenance", icon: Wrench },
      { title: "MTBF/MTTR", href: "/equipment/mtbf", icon: BarChart3 },
      { title: "계측기교정", href: "/equipment/calibration", icon: Gauge },
      { title: "Gage R&R", href: "/equipment/gage-rnr", icon: BarChart3 },
      { title: "공정능력", href: "/equipment/capability", icon: BarChart3 },
    ],
  },
  {
    title: "교육/자격",
    icon: GraduationCap,
    children: [
      { title: "교육계획", href: "/training/plans", icon: FileText },
      { title: "교육실적", href: "/training/records", icon: ClipboardCheck },
      { title: "자격인증기준", href: "/training/standards", icon: FileText },
      { title: "자격인증평가", href: "/training/assessments", icon: ClipboardCheck },
    ],
  },
  {
    title: "내부심사",
    icon: Search,
    children: [
      { title: "심사계획", href: "/audit/plans", icon: FileText },
      { title: "심사실적", href: "/audit/records", icon: ClipboardCheck },
      { title: "발견사항", href: "/audit/findings", icon: AlertTriangle },
    ],
  },
  {
    title: "KPI/성과지표",
    icon: BarChart3,
    children: [
      { title: "KPI 정의", href: "/kpi/definitions", icon: FileText },
      { title: "KPI 실적", href: "/kpi/results", icon: BarChart3 },
    ],
  },
  {
    title: "공급자관리",
    icon: Truck,
    children: [
      { title: "공급자평가", href: "/supplier/evaluations", icon: ClipboardCheck },
      { title: "인도성과", href: "/supplier/delivery", icon: BarChart3 },
      { title: "품질성과", href: "/supplier/quality", icon: BarChart3 },
    ],
  },
  {
    title: "비상사태",
    icon: AlertTriangle,
    children: [
      { title: "비상유형", href: "/emergency/types", icon: AlertTriangle },
      { title: "훈련계획/실적", href: "/emergency/drills", icon: ClipboardCheck },
    ],
  },
  {
    title: "설정",
    href: "/settings",
    icon: Settings,
  },
];

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : item.children?.some((child) => pathname === child.href);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            {item.title}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-3">
            {item.children!.map((child) => (
              <NavItemComponent key={child.title} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        pathname === item.href
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            QM
          </div>
          <span className="font-semibold">IATF 품질관리</span>
        </Link>
      </div>
      <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
