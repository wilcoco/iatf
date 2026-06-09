import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const calibrations = await prisma.calibrationRecord.findMany({
      include: { instrument: true, calibratedBy: true },
      orderBy: { calibratedAt: "desc" },
      take: 100,
    });
    return NextResponse.json(calibrations);
  } catch (error) {
    console.error("Error fetching calibrations:", error);
    return NextResponse.json({ error: "Failed to fetch calibrations" }, { status: 500 });
  }
}
