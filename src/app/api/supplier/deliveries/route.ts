import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const deliveries = await prisma.supplierDeliveryPerformance.findMany({
      include: { supplier: true },
      orderBy: { yearMonth: "desc" },
      take: 100,
    });
    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Error fetching supplier deliveries:", error);
    return NextResponse.json({ error: "Failed to fetch supplier deliveries" }, { status: 500 });
  }
}
