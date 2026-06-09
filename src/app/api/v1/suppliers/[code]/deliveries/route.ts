import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withApiAuth, apiResponse, apiError, ApiContext } from "@/lib/api-auth";

/**
 * GET /api/v1/suppliers/[code]/deliveries
 * 특정 협력사의 납품 성과 조회
 *
 * Path: /api/v1/suppliers/KU67/deliveries
 * Query:
 * - year: 연도 (기본: 현재 연도)
 * - month: 월 (선택)
 *
 * 협력사 포털에서 자기 실적 조회 시 사용
 */
export const GET = withApiAuth(
  async (
    request: NextRequest,
    context: ApiContext,
  ) => {
    // URL에서 supplier code 추출
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const supplierCode = pathParts[pathParts.indexOf("suppliers") + 1];

    const { searchParams } = request.nextUrl;
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const month = searchParams.get("month");

    // 협력사 확인
    const supplier = await prisma.supplier.findUnique({
      where: { code: supplierCode },
    });

    if (!supplier) {
      return apiError(`Supplier not found: ${supplierCode}`, 404);
    }

    // 협력사 유형 클라이언트는 자기 데이터만 조회 가능
    if (context.clientType === "supplier" && supplierCode !== context.clientName) {
      // 실제 구현시 API Key와 협력사 매핑 필요
    }

    // 납기 성과 조회
    const where: Record<string, unknown> = {
      supplierId: supplier.id,
      yearMonth: month
        ? `${year}-${month.padStart(2, "0")}`
        : { startsWith: `${year}` },
    };

    const deliveryPerformance = await prisma.supplierDeliveryPerformance.findMany({
      where: {
        supplierId: supplier.id,
        yearMonth: month
          ? `${year}-${month.padStart(2, "0")}`
          : { startsWith: `${year}` },
      },
      orderBy: { yearMonth: "asc" },
    });

    // 품질 성과 조회
    const qualityPerformance = await prisma.supplierQualityPerformance.findMany({
      where: {
        supplierId: supplier.id,
        yearMonth: month
          ? `${year}-${month.padStart(2, "0")}`
          : { startsWith: `${year}` },
      },
      orderBy: { yearMonth: "asc" },
    });

    // 최근 평가 조회
    const latestEvaluation = await prisma.supplierEvaluation.findFirst({
      where: { supplierId: supplier.id },
      orderBy: { evaluationYear: "desc" },
    });

    return apiResponse({
      supplier: {
        code: supplier.code,
        name: supplier.name,
        grade: supplier.grade,
      },
      deliveryPerformance: deliveryPerformance.map((d) => ({
        yearMonth: d.yearMonth,
        orderCount: d.orderCount,
        onTimeCount: d.onTimeCount,
        lateCount: d.lateCount,
        onTimeRate: d.onTimeRate ? Number(d.onTimeRate) : null,
      })),
      qualityPerformance: qualityPerformance.map((q) => ({
        yearMonth: q.yearMonth,
        receivedQty: q.receivedQty,
        defectQty: q.defectQty,
        defectRate: q.defectRate ? Number(q.defectRate) : null,
        ncCount: q.ncCount,
      })),
      latestEvaluation: latestEvaluation
        ? {
            year: latestEvaluation.evaluationYear,
            totalScore: latestEvaluation.totalScore
              ? Number(latestEvaluation.totalScore)
              : null,
            grade: latestEvaluation.grade,
          }
        : null,
    });
  },
  { requiredPermission: "read:supplier" }
);

/**
 * POST /api/v1/suppliers/[code]/deliveries
 * 협력사 납품 기록 등록 (협력사 시스템에서 전송)
 *
 * Body:
 * {
 *   "yearMonth": "2026-06",
 *   "orderCount": 100,
 *   "onTimeCount": 95,
 *   "lateCount": 5
 * }
 */
export const POST = withApiAuth(
  async (
    request: NextRequest,
    context: ApiContext,
  ) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const supplierCode = pathParts[pathParts.indexOf("suppliers") + 1];

    const body = await request.json();

    const supplier = await prisma.supplier.findUnique({
      where: { code: supplierCode },
    });

    if (!supplier) {
      return apiError(`Supplier not found: ${supplierCode}`, 404);
    }

    const onTimeRate =
      body.orderCount > 0
        ? (body.onTimeCount / body.orderCount) * 100
        : 0;

    const record = await prisma.supplierDeliveryPerformance.upsert({
      where: {
        supplierId_yearMonth: {
          supplierId: supplier.id,
          yearMonth: body.yearMonth,
        },
      },
      update: {
        orderCount: body.orderCount,
        onTimeCount: body.onTimeCount,
        lateCount: body.lateCount,
        onTimeRate,
      },
      create: {
        supplierId: supplier.id,
        yearMonth: body.yearMonth,
        orderCount: body.orderCount,
        onTimeCount: body.onTimeCount,
        lateCount: body.lateCount,
        onTimeRate,
      },
    });

    return apiResponse(
      {
        yearMonth: record.yearMonth,
        onTimeRate: Number(record.onTimeRate),
        message: "Delivery record saved",
      },
      201
    );
  },
  { requiredPermission: "write:delivery" }
);
