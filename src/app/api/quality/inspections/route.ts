import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const inspections = await prisma.inspectionRecord.findMany({
      include: { inspector: true },
      orderBy: { inspectionDate: "desc" },
      take: 100,
    });
    return NextResponse.json(inspections);
  } catch (error) {
    console.error("Error fetching inspections:", error);
    return NextResponse.json({ error: "Failed to fetch inspections" }, { status: 500 });
  }
}
