import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const evaluations = await prisma.supplierEvaluation.findMany({
      include: { supplier: true },
      orderBy: { evaluationPeriod: "desc" },
      take: 100,
    });
    return NextResponse.json(evaluations);
  } catch (error) {
    console.error("Error fetching supplier evaluations:", error);
    return NextResponse.json({ error: "Failed to fetch supplier evaluations" }, { status: 500 });
  }
}
