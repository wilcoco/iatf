import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const jigs = await prisma.jig.findMany({
      orderBy: { jigNo: "asc" },
    });
    return NextResponse.json(jigs);
  } catch (error) {
    console.error("Error fetching jigs:", error);
    return NextResponse.json({ error: "Failed to fetch jigs" }, { status: 500 });
  }
}
