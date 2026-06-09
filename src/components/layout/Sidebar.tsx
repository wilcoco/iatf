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
  Target,
  Shield,
  UserCheck,
  TrendingUp,
  Package,
  Clipboard,
  ScrollText,
  RefreshCw,
  Megaphone,
  ShoppingCart,
  Warehouse,
  TestTube,
  Boxes,
  Siren,
  LayoutGrid,
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
    title: "IATF16949/CSR",
    icon: Shield,
    children: [
      { title: "IATF SIs 점검", href: "/iatf/sis-checklist", icon: ClipboardCheck },
      { title: "CSR 변경관리", href: "/iatf/csr-changes", icon: RefreshCw },
    ],
  },
  {
    title: "경영관리",
    icon: Target,
    children: [
      { title: "사업계획", href: "/management/business-plan", icon: TrendingUp },
      { title: "경영검토", href: "/management/review", icon: FileText },
      { title: "리스크평가", href: "/management/risk", icon: AlertTriangle },
      { title: "KPI 성과지표", href: "/kpi/results", icon: BarChart3 },
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
    title: "고객만족도",
    icon: UserCheck,
    children: [
      { title: "조사계획/실적", href: "/customer/satisfaction", icon: ClipboardCheck },
      { title: "고객불만관리", href: "/customer/complaints", icon: Megaphone },
      { title: "클레임분석", href: "/customer/claims", icon: BarChart3 },
    ],
  },
  {
    title: "인적자원관리",
    icon: GraduationCap,
    children: [
      { title: "교육계획", href: "/training/plans", icon: FileText },
      { title: "교육실적", href: "/training/records", icon: ClipboardCheck },
      { title: "자격인증기준", href: "/training/standards", icon: FileText },
      { title: "자격인증평가", href: "/training/assessments", icon: ClipboardCheck },
    ],
  },
  {
    title: "영업/수주관리",
    icon: ShoppingCart,
    children: [
      { title: "수주관리", href: "/sales/orders", icon: FileText },
      { title: "업체선정", href: "/sales/vendor-selection", icon: ClipboardCheck },
      { title: "고객재산관리", href: "/sales/customer-assets", icon: Package },
    ],
  },
  {
    title: "생산관리",
    icon: Factory,
    children: [
      { title: "CAPA분석", href: "/production/capa", icon: BarChart3 },
      { title: "관리계획서/작업표준서", href: "/production/control-plan", icon: FileText },
      { title: "공정FMEA", href: "/production/fmea", icon: AlertTriangle },
      { title: "F/PROOF 검증", href: "/production/fproof", icon: ClipboardCheck },
      { title: "토르크/조도관리", href: "/production/torque", icon: Gauge },
      { title: "건조로관리", href: "/production/oven", icon: Wrench },
    ],
  },
  {
    title: "설비보전관리",
    icon: Wrench,
    children: [
      { title: "설비관리대장", href: "/equipment/list", icon: FileText },
      { title: "일상점검", href: "/daily/equipment-check", icon: ClipboardCheck },
      { title: "예방보전", href: "/equipment/maintenance", icon: Wrench },
      { title: "MTBF/MTTR", href: "/equipment/mtbf", icon: BarChart3 },
    ],
  },
  {
    title: "금형/지그관리",
    icon: Hammer,
    children: [
      { title: "금형보유현황", href: "/mold/inventory", icon: FileText },
      { title: "금형일상점검", href: "/daily/mold-check", icon: ClipboardCheck },
      { title: "금형습합/세척", href: "/mold/cleaning", icon: Wrench },
      { title: "금형보수실적", href: "/mold/repair", icon: Wrench },
      { title: "지그관리대장", href: "/jig/list", icon: FileText },
      { title: "지그점검", href: "/daily/jig-check", icon: ClipboardCheck },
    ],
  },
  {
    title: "개발/도면관리",
    icon: ScrollText,
    children: [
      { title: "마스터플랜", href: "/development/masterplan", icon: FileText },
      { title: "도면불출대장", href: "/development/drawing", icon: FileText },
      { title: "기술사양변경", href: "/development/spec-change", icon: RefreshCw },
    ],
  },
  {
    title: "변경/부적합관리",
    icon: RefreshCw,
    children: [
      { title: "4M/EO 변경관리", href: "/change/4m-eo", icon: RefreshCw },
      { title: "부적합품관리", href: "/quality/nonconformance", icon: AlertTriangle },
      { title: "시정조치", href: "/quality/corrective-action", icon: Wrench },
      { title: "재작업표준서", href: "/change/rework", icon: FileText },
    ],
  },
  {
    title: "구매/공급자관리",
    icon: Truck,
    children: [
      { title: "구매계획", href: "/purchase/plan", icon: FileText },
      { title: "공급자인도성과", href: "/supplier/delivery", icon: BarChart3 },
      { title: "공급자평가", href: "/supplier/evaluations", icon: ClipboardCheck },
      { title: "업체실태조사", href: "/supplier/survey", icon: FileText },
      { title: "대여자산관리", href: "/supplier/assets", icon: Package },
    ],
  },
  {
    title: "자재/인도관리",
    icon: Warehouse,
    children: [
      { title: "적정재고관리", href: "/material/inventory", icon: Boxes },
      { title: "자재수불부", href: "/material/ledger", icon: FileText },
      { title: "재고회전율", href: "/material/turnover", icon: BarChart3 },
      { title: "인도성과율", href: "/material/delivery", icon: TrendingUp },
    ],
  },
  {
    title: "검사업무",
    icon: ClipboardCheck,
    children: [
      { title: "초/중/종물검사", href: "/daily/production-inspection", icon: ClipboardCheck },
      { title: "공정검사", href: "/inspection/process", icon: ClipboardCheck },
      { title: "수입검사", href: "/quality/incoming", icon: ClipboardCheck },
      { title: "출하검사", href: "/quality/shipping", icon: ClipboardCheck },
      { title: "한도견본관리", href: "/inspection/limit-samples", icon: FileText },
      { title: "공정능력평가", href: "/equipment/capability", icon: BarChart3 },
    ],
  },
  {
    title: "품질시험관리",
    icon: FlaskConical,
    children: [
      { title: "신뢰성시험", href: "/quality/reliability", icon: FlaskConical },
      { title: "색차관리", href: "/quality/color", icon: FlaskConical },
      { title: "도막두께", href: "/quality/coating", icon: Gauge },
      { title: "부착성시험", href: "/quality/adhesion", icon: FlaskConical },
    ],
  },
  {
    title: "계측/검사구관리",
    icon: Gauge,
    children: [
      { title: "계측기관리대장", href: "/measurement/list", icon: FileText },
      { title: "계측기교정", href: "/equipment/calibration", icon: Gauge },
      { title: "Gage R&R", href: "/equipment/gage-rnr", icon: BarChart3 },
      { title: "검사구관리", href: "/measurement/fixtures", icon: Ruler },
    ],
  },
  {
    title: "시험실관리",
    icon: TestTube,
    children: [
      { title: "신뢰성시험계획", href: "/lab/reliability-plan", icon: FileText },
      { title: "시험장비관리", href: "/lab/equipment", icon: Wrench },
    ],
  },
  {
    title: "포장관리",
    icon: Package,
    children: [
      { title: "납입용기설정", href: "/packaging/container", icon: FileText },
      { title: "용기점검", href: "/packaging/inspection", icon: ClipboardCheck },
    ],
  },
  {
    title: "비상사태관리",
    icon: Siren,
    children: [
      { title: "비상유형", href: "/emergency/types", icon: AlertTriangle },
      { title: "훈련계획/실적", href: "/emergency/drills", icon: ClipboardCheck },
    ],
  },
  {
    title: "3정5행",
    icon: LayoutGrid,
    children: [
      { title: "관리기준", href: "/housekeeping/standards", icon: FileText },
      { title: "평가/개선", href: "/housekeeping/evaluation", icon: ClipboardCheck },
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
