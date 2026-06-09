import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const instruments = await prisma.measuringInstrument.findMany({
      include: { department: true },
      orderBy: { instrumentNo: "asc" },
    });
    return NextResponse.json(instruments);
  } catch (error) {
    console.error("Error fetching instruments:", error);
    return NextResponse.json({ error: "Failed to fetch instruments" }, { status: 500 });
  }
}
