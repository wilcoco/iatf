import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const processes = await prisma.process.findMany({
      orderBy: { code: "asc" },
    });
    return NextResponse.json(processes);
  } catch (error) {
    console.error("Error fetching processes:", error);
    return NextResponse.json({ error: "Failed to fetch processes" }, { status: 500 });
  }
}
