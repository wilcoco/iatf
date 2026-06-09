import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const findings = await prisma.auditFinding.findMany({
      include: { auditPlan: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(findings);
  } catch (error) {
    console.error("Error fetching audit findings:", error);
    return NextResponse.json({ error: "Failed to fetch audit findings" }, { status: 500 });
  }
}
