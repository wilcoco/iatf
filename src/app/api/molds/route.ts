import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const molds = await prisma.mold.findMany({
      orderBy: { moldNo: "asc" },
    });
    return NextResponse.json(molds);
  } catch (error) {
    console.error("Error fetching molds:", error);
    return NextResponse.json({ error: "Failed to fetch molds" }, { status: 500 });
  }
}
