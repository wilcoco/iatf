import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getFrequencyDays(frequency: string): number {
  const frequencyMap: Record<string, number> = {
    일: 1,
    주: 7,
    월: 30,
    분기: 90,
    반기: 180,
    년: 365,
    발생시: 0,
  };
  return frequencyMap[frequency] || 0;
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    합격: "bg-green-100 text-green-800",
    정상: "bg-green-100 text-green-800",
    달성: "bg-green-100 text-green-800",
    완료: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    불합격: "bg-red-100 text-red-800",
    이상: "bg-red-100 text-red-800",
    미달성: "bg-red-100 text-red-800",
    지연: "bg-red-100 text-red-800",
    inactive: "bg-red-100 text-red-800",
    진행중: "bg-blue-100 text-blue-800",
    계획: "bg-yellow-100 text-yellow-800",
    조건부: "bg-yellow-100 text-yellow-800",
    수리필요: "bg-orange-100 text-orange-800",
    maintenance: "bg-orange-100 text-orange-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
}

export function generateNCNo(prefix: string = "NC"): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}${year}${month}-${random}`;
}

export function calculateAchievementRate(actual: number, target: number, direction: string = "상향"): number {
  if (target === 0) return 0;

  if (direction === "하향") {
    return target / actual * 100;
  }
  return actual / target * 100;
}
