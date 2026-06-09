import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.controlItem.findUnique({
      where: { id: Number(params.id) },
      include: {
        process: true,
        targetDept: true,
        responsibleDept: true,
        responsibleUser: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching control item:", error);
    return NextResponse.json({ error: "Failed to fetch control item" }, { status: 500 });
  }
}
