import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const incidents = await prisma.emergencyIncident.findMany({
      include: { emergencyType: true, reportedBy: true },
      orderBy: { occurredAt: "desc" },
      take: 100,
    });
    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Error fetching emergency incidents:", error);
    return NextResponse.json({ error: "Failed to fetch emergency incidents" }, { status: 500 });
  }
}
