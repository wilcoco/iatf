import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.trainingRecord.findMany({
      include: { trainee: true, trainingPlan: true },
      orderBy: { completedAt: "desc" },
      take: 100,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching training records:", error);
    return NextResponse.json({ error: "Failed to fetch training records" }, { status: 500 });
  }
}
