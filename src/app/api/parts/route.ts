import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      include: { vehicleModel: true, supplier: true },
      orderBy: { partNo: "asc" },
    });
    return NextResponse.json(parts);
  } catch (error) {
    console.error("Error fetching parts:", error);
    return NextResponse.json({ error: "Failed to fetch parts" }, { status: 500 });
  }
}
