import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withApiAuth, apiResponse, apiError, ApiContext } from "@/lib/api-auth";

/**
 * GET /api/v1/inspections
 * 검사 기록 조회 API
 *
 * Query Parameters:
 * - date: 검사일자 (YYYY-MM-DD)
 * - type: 검사유형 (production, incoming, shipping)
 * - partNo: 부품번호
 * - limit: 조회 개수 (기본 50)
 * - offset: 시작 위치
 *
 * 외부 호출 예시:
 * curl -H "X-API-Key: your-api-key" https://your-domain/api/v1/inspections?date=2026-06-09
 */
export const GET = withApiAuth(
  async (request: NextRequest, context: ApiContext) => {
    const { searchParams } = request.nextUrl;

    const date = searchParams.get("date");
    const type = searchParams.get("type");
    const partNo = searchParams.get("partNo");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // 생산검사 조회
    if (!type || type === "production") {
      const where: Record<string, unknown> = {};
      if (date) where.productionDate = new Date(date);
      if (partNo) {
        where.part = { partNo: { contains: partNo } };
      }

      const inspections = await prisma.productionInspection.findMany({
        where,
        include: {
          part: { select: { partNo: true, name: true } },
          inspector: { select: { name: true, employeeId: true } },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.productionInspection.count({ where });

      return apiResponse({
        items: inspections,
        pagination: { total, limit, offset },
      });
    }

    // 수입검사 조회
    if (type === "incoming") {
      const where: Record<string, unknown> = {};
      if (date) where.receivingDate = new Date(date);

      const inspections = await prisma.incomingInspection.findMany({
        where,
        include: {
          part: { select: { partNo: true, name: true } },
          supplier: { select: { code: true, name: true } },
          inspector: { select: { name: true } },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.incomingInspection.count({ where });

      return apiResponse({
        items: inspections,
        pagination: { total, limit, offset },
      });
    }

    // 출하검사 조회
    if (type === "shipping") {
      const where: Record<string, unknown> = {};
      if (date) where.shippingDate = new Date(date);

      const inspections = await prisma.shippingInspection.findMany({
        where,
        include: {
          part: { select: { partNo: true, name: true } },
          inspector: { select: { name: true } },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.shippingInspection.count({ where });

      return apiResponse({
        items: inspections,
        pagination: { total, limit, offset },
      });
    }

    return apiError("Invalid inspection type", 400);
  },
  { requiredPermission: "read:inspection" }
);

/**
 * POST /api/v1/inspections
 * 검사 기록 생성 API
 *
 * Body:
 * {
 *   "type": "production",
 *   "partNo": "86501-P1000",
 *   "productionDate": "2026-06-09",
 *   "shift": "A",
 *   "lotNo": "LOT-001",
 *   "inspectionType": "초물",
 *   "inspectorId": "EMP001",
 *   "results": {
 *     "visual": "OK",
 *     "dimension": "OK",
 *     "function": "OK"
 *   },
 *   "measuredValues": { ... }
 * }
 *
 * 외부 호출 예시 (MES에서):
 * curl -X POST -H "X-API-Key: your-mes-key" -H "Content-Type: application/json" \
 *   -d '{"type":"production",...}' https://your-domain/api/v1/inspections
 */
export const POST = withApiAuth(
  async (request: NextRequest, context: ApiContext) => {
    const body = await request.json();
    const { type } = body;

    if (type === "production") {
      // 부품 조회
      const part = await prisma.part.findUnique({
        where: { partNo: body.partNo },
      });
      if (!part) {
        return apiError(`Part not found: ${body.partNo}`, 404);
      }

      // 검사자 조회 (employeeId로)
      let inspectorId = null;
      if (body.inspectorId) {
        const inspector = await prisma.user.findUnique({
          where: { employeeId: body.inspectorId },
        });
        inspectorId = inspector?.id;
      }

      const inspection = await prisma.productionInspection.create({
        data: {
          partId: part.id,
          productionDate: new Date(body.productionDate),
          shift: body.shift,
          lotNo: body.lotNo,
          inspectionType: body.inspectionType,
          inspectorId,
          visualCheck: body.results?.visual,
          dimensionCheck: body.results?.dimension,
          functionCheck: body.results?.function,
          result: determineOverallResult(body.results),
          measuredValues: body.measuredValues,
          remarks: body.remarks,
        },
        include: {
          part: { select: { partNo: true, name: true } },
        },
      });

      return apiResponse(inspection, 201);
    }

    if (type === "incoming") {
      const part = body.partNo
        ? await prisma.part.findUnique({ where: { partNo: body.partNo } })
        : null;

      const supplier = body.supplierCode
        ? await prisma.supplier.findUnique({ where: { code: body.supplierCode } })
        : null;

      const inspection = await prisma.incomingInspection.create({
        data: {
          partId: part?.id,
          supplierId: supplier?.id,
          receivingDate: new Date(body.receivingDate),
          lotNo: body.lotNo,
          quantity: body.quantity,
          inspectionType: body.inspectionType,
          sampleSize: body.sampleSize,
          visualResult: body.results?.visual,
          dimensionResult: body.results?.dimension,
          materialResult: body.results?.material,
          defectQty: body.defectQty || 0,
          defectRate: body.quantity > 0 ? (body.defectQty / body.quantity) * 100 : 0,
          overallResult: determineOverallResult(body.results),
          disposition: body.disposition,
          supplierCertNo: body.supplierCertNo,
          remarks: body.remarks,
        },
      });

      return apiResponse(inspection, 201);
    }

    return apiError("Invalid inspection type", 400);
  },
  { requiredPermission: "write:inspection" }
);

function determineOverallResult(results: Record<string, string> | undefined): string {
  if (!results) return "미확인";
  const values = Object.values(results);
  if (values.every((v) => v === "OK")) return "합격";
  if (values.some((v) => v === "NG")) return "불합격";
  return "조건부";
}
