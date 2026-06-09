import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const drills = await prisma.emergencyDrill.findMany({
      include: { emergencyType: true, conductedBy: true },
      orderBy: { actualDate: "desc" },
      take: 100,
    });
    return NextResponse.json(drills);
  } catch (error) {
    console.error("Error fetching emergency drills:", error);
    return NextResponse.json({ error: "Failed to fetch emergency drills" }, { status: 500 });
  }
}
