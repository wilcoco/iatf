import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.trainingPlan.findMany({
      orderBy: { scheduledDate: "desc" },
      take: 100,
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching training plans:", error);
    return NextResponse.json({ error: "Failed to fetch training plans" }, { status: 500 });
  }
}
