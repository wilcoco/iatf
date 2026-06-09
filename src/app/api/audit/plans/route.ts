import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.auditPlan.findMany({
      include: { leadAuditor: true },
      orderBy: { scheduledDate: "desc" },
      take: 100,
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching audit plans:", error);
    return NextResponse.json({ error: "Failed to fetch audit plans" }, { status: 500 });
  }
}
