import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.emergencyType.findMany({
      orderBy: { code: "asc" },
    });
    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching emergency types:", error);
    return NextResponse.json({ error: "Failed to fetch emergency types" }, { status: 500 });
  }
}
