import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const controlItems = await prisma.controlItem.findMany({
      include: {
        process: true,
        targetDept: true,
        responsibleDept: true,
        responsibleUser: true,
      },
      orderBy: {
        itemNo: "asc",
      },
    });
    return NextResponse.json(controlItems);
  } catch (error) {
    console.error("Error fetching control items:", error);
    return NextResponse.json({ error: "Failed to fetch control items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const controlItem = await prisma.controlItem.create({
      data: {
        itemNo: body.itemNo,
        processId: body.processId,
        name: body.name,
        description: body.description,
        frequency: body.frequency,
        frequencyDays: body.frequencyDays,
        targetDeptId: body.targetDeptId,
        responsibleDeptId: body.responsibleDeptId,
        responsibleUserId: body.responsibleUserId,
        formType: body.formType,
        requiresAttachment: body.requiresAttachment || false,
        notes: body.notes,
      },
    });
    return NextResponse.json(controlItem, { status: 201 });
  } catch (error) {
    console.error("Error creating control item:", error);
    return NextResponse.json({ error: "Failed to create control item" }, { status: 500 });
  }
}
