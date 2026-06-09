import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.inspectionRecord.findMany({
      include: {
        controlItem: true,
        inspector: true,
      },
      orderBy: { inspectionDate: "desc" },
      take: 100,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching inspection records:", error);
    return NextResponse.json({ error: "Failed to fetch inspection records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const record = await prisma.inspectionRecord.create({
      data: {
        controlItemId: body.controlItemId,
        inspectionType: body.inspectionType || "정기",
        inspectionDate: new Date(body.inspectionDate),
        shift: body.shift,
        targetType: body.targetType,
        targetId: body.targetId,
        inspectorId: body.inspectorId,
        result: body.result,
        score: body.score,
        findings: body.findings,
        attachments: body.attachments,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating inspection record:", error);
    return NextResponse.json({ error: "Failed to create inspection record" }, { status: 500 });
  }
}
