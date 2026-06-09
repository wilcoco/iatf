import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const nonconformances = await prisma.nonconformance.findMany({
      include: { detectedBy: true },
      orderBy: { detectedAt: "desc" },
      take: 100,
    });
    return NextResponse.json(nonconformances);
  } catch (error) {
    console.error("Error fetching nonconformances:", error);
    return NextResponse.json({ error: "Failed to fetch nonconformances" }, { status: 500 });
  }
}
