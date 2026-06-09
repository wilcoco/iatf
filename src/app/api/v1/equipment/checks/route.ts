import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { withApiAuth, apiResponse, apiError, ApiContext } from "@/lib/api-auth";

/**
 * GET /api/v1/equipment/checks
 * 설비 일상점검 기록 조회
 *
 * Query Parameters:
 * - date: 점검일자 (YYYY-MM-DD)
 * - equipmentId: 설비 ID
 * - assetNo: 설비 자산번호
 * - shift: 조 (A, B, C)
 * - status: 상태 (정상, 이상, 수리필요)
 *
 * 외부 호출 예시 (ERP에서 설비 상태 조회):
 * curl -H "X-API-Key: erp-key" https://domain/api/v1/equipment/checks?date=2026-06-09
 */
export const GET = withApiAuth(
  async (request: NextRequest, context: ApiContext) => {
    const { searchParams } = request.nextUrl;

    const date = searchParams.get("date");
    const assetNo = searchParams.get("assetNo");
    const shift = searchParams.get("shift");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: Record<string, unknown> = {};
    if (date) where.checkDate = new Date(date);
    if (shift) where.shift = shift;
    if (status) where.overallStatus = status;
    if (assetNo) {
      where.equipment = { assetNo };
    }

    const checks = await prisma.equipmentDailyCheck.findMany({
      where,
      include: {
        equipment: {
          select: { assetNo: true, name: true, category: true, location: true },
        },
        checker: {
          select: { employeeId: true, name: true },
        },
      },
      take: limit,
      orderBy: [{ checkDate: "desc" }, { createdAt: "desc" }],
    });

    // 외부 시스템용 데이터 변환
    const formatted = checks.map((check) => ({
      id: check.id,
      equipment: {
        assetNo: check.equipment.assetNo,
        name: check.equipment.name,
        category: check.equipment.category,
        location: check.equipment.location,
      },
      checkDate: check.checkDate.toISOString().split("T")[0],
      shift: check.shift,
      checker: check.checker
        ? { id: check.checker.employeeId, name: check.checker.name }
        : null,
      results: {
        appearance: check.appearance,
        abnormalSound: check.abnormalSound,
        abnormalVibration: check.abnormalVibration,
        oilLevel: check.oilLevel,
        airPressure: check.airPressure,
        temperature: check.temperature ? Number(check.temperature) : null,
      },
      overallStatus: check.overallStatus,
      remarks: check.remarks,
      createdAt: check.createdAt.toISOString(),
    }));

    return apiResponse({
      items: formatted,
      count: formatted.length,
    });
  },
  { requiredPermission: "read:equipment" }
);

/**
 * POST /api/v1/equipment/checks
 * 설비 일상점검 기록 생성/수정
 *
 * Body:
 * {
 *   "assetNo": "EQ-001",
 *   "checkDate": "2026-06-09",
 *   "shift": "A",
 *   "checkerId": "EMP001",
 *   "results": {
 *     "appearance": "OK",
 *     "abnormalSound": "OK",
 *     "abnormalVibration": "OK",
 *     "oilLevel": "OK",
 *     "airPressure": "OK",
 *     "temperature": 45.5
 *   },
 *   "remarks": "정상"
 * }
 *
 * 외부 호출 예시 (모바일 앱에서 점검 결과 전송):
 * curl -X POST -H "X-API-Key: mobile-key" -H "Content-Type: application/json" \
 *   -d '{"assetNo":"EQ-001",...}' https://domain/api/v1/equipment/checks
 */
export const POST = withApiAuth(
  async (request: NextRequest, context: ApiContext) => {
    const body = await request.json();

    // 설비 조회
    const equipment = await prisma.equipment.findUnique({
      where: { assetNo: body.assetNo },
    });
    if (!equipment) {
      return apiError(`Equipment not found: ${body.assetNo}`, 404);
    }

    // 점검자 조회
    let checkerId = null;
    if (body.checkerId) {
      const checker = await prisma.user.findUnique({
        where: { employeeId: body.checkerId },
      });
      checkerId = checker?.id;
    }

    // 전체 상태 판정
    const results = body.results || {};
    const hasNG = Object.entries(results)
      .filter(([key]) => key !== "temperature")
      .some(([, value]) => value === "NG");

    const overallStatus = hasNG ? "이상" : "정상";

    // Upsert (같은 설비/일자/조에 대해 업데이트)
    const check = await prisma.equipmentDailyCheck.upsert({
      where: {
        equipmentId_checkDate_shift: {
          equipmentId: equipment.id,
          checkDate: new Date(body.checkDate),
          shift: body.shift || "A",
        },
      },
      update: {
        checkerId,
        appearance: results.appearance,
        abnormalSound: results.abnormalSound,
        abnormalVibration: results.abnormalVibration,
        oilLevel: results.oilLevel,
        airPressure: results.airPressure,
        temperature: results.temperature,
        overallStatus,
        remarks: body.remarks,
      },
      create: {
        equipmentId: equipment.id,
        checkDate: new Date(body.checkDate),
        shift: body.shift || "A",
        checkerId,
        appearance: results.appearance,
        abnormalSound: results.abnormalSound,
        abnormalVibration: results.abnormalVibration,
        oilLevel: results.oilLevel,
        airPressure: results.airPressure,
        temperature: results.temperature,
        overallStatus,
        remarks: body.remarks,
      },
      include: {
        equipment: { select: { assetNo: true, name: true } },
      },
    });

    return apiResponse(
      {
        id: check.id,
        equipment: check.equipment,
        checkDate: check.checkDate.toISOString().split("T")[0],
        shift: check.shift,
        overallStatus: check.overallStatus,
        message: "Check record saved successfully",
      },
      201
    );
  },
  { requiredPermission: "write:check" }
);
