import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const shift = searchParams.get("shift");
    const equipmentId = searchParams.get("equipmentId");

    const where: Record<string, unknown> = {};
    if (date) where.checkDate = new Date(date);
    if (shift) where.shift = shift;
    if (equipmentId) where.equipmentId = parseInt(equipmentId);

    const checks = await prisma.equipmentDailyCheck.findMany({
      where,
      include: {
        equipment: true,
        checker: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(checks);
  } catch (error) {
    console.error("Error fetching equipment checks:", error);
    return NextResponse.json({ error: "Failed to fetch equipment checks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const check = await prisma.equipmentDailyCheck.upsert({
      where: {
        equipmentId_checkDate_shift: {
          equipmentId: body.equipmentId,
          checkDate: new Date(body.checkDate),
          shift: body.shift,
        },
      },
      update: {
        checkerId: body.checkerId,
        appearance: body.appearance,
        abnormalSound: body.abnormalSound,
        abnormalVibration: body.abnormalVibration,
        oilLevel: body.oilLevel,
        airPressure: body.airPressure,
        temperature: body.temperature,
        overallStatus: body.overallStatus,
        remarks: body.remarks,
      },
      create: {
        equipmentId: body.equipmentId,
        checkDate: new Date(body.checkDate),
        shift: body.shift,
        checkerId: body.checkerId,
        appearance: body.appearance,
        abnormalSound: body.abnormalSound,
        abnormalVibration: body.abnormalVibration,
        oilLevel: body.oilLevel,
        airPressure: body.airPressure,
        temperature: body.temperature,
        overallStatus: body.overallStatus,
        remarks: body.remarks,
      },
    });

    return NextResponse.json(check, { status: 201 });
  } catch (error) {
    console.error("Error creating equipment check:", error);
    return NextResponse.json({ error: "Failed to create equipment check" }, { status: 500 });
  }
}
