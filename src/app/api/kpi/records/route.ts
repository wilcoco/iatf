import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.kpiRecord.findMany({
      include: { kpiDefinition: true },
      orderBy: { period: "desc" },
      take: 100,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching KPI records:", error);
    return NextResponse.json({ error: "Failed to fetch KPI records" }, { status: 500 });
  }
}
