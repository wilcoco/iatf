import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: { department: true },
      orderBy: { assetNo: "asc" },
    });
    return NextResponse.json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const equipment = await prisma.equipment.create({
      data: {
        assetNo: body.assetNo,
        name: body.name,
        category: body.category,
        location: body.location,
        manufacturer: body.manufacturer,
        model: body.model,
        installDate: body.installDate ? new Date(body.installDate) : null,
        departmentId: body.departmentId,
      },
    });
    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    console.error("Error creating equipment:", error);
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 });
  }
}
