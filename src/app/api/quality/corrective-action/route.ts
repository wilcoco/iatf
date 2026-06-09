import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const actions = await prisma.correctiveAction.findMany({
      include: { responsiblePerson: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(actions);
  } catch (error) {
    console.error("Error fetching corrective actions:", error);
    return NextResponse.json({ error: "Failed to fetch corrective actions" }, { status: 500 });
  }
}
