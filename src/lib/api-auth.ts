import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";

export interface ApiContext {
  apiKeyId?: number;
  clientName?: string;
  clientType?: "erp" | "mes" | "mobile" | "supplier" | "internal";
  permissions?: string[];
}

/**
 * API Key 검증 미들웨어
 * 외부 시스템(ERP, MES, 모바일앱, 협력사)에서 호출할 때 사용
 *
 * 사용법:
 * - Header: X-API-Key: <api_key>
 * - 또는 Query: ?api_key=<api_key>
 */
export async function validateApiKey(request: NextRequest): Promise<ApiContext | null> {
  const apiKey =
    request.headers.get("X-API-Key") ||
    request.nextUrl.searchParams.get("api_key");

  if (!apiKey) {
    return null;
  }

  try {
    // API Key 조회 (실제 구현시 api_keys 테이블 필요)
    // 임시로 환경변수 기반 검증
    const validKeys: Record<string, ApiContext> = {
      [process.env.API_KEY_ERP || "erp-secret-key"]: {
        clientName: "ERP System",
        clientType: "erp",
        permissions: ["read:all", "write:production", "write:inventory"],
      },
      [process.env.API_KEY_MES || "mes-secret-key"]: {
        clientName: "MES System",
        clientType: "mes",
        permissions: ["read:equipment", "write:inspection", "write:production"],
      },
      [process.env.API_KEY_MOBILE || "mobile-secret-key"]: {
        clientName: "Mobile App",
        clientType: "mobile",
        permissions: ["read:all", "write:inspection", "write:check"],
      },
      [process.env.API_KEY_SUPPLIER || "supplier-secret-key"]: {
        clientName: "Supplier Portal",
        clientType: "supplier",
        permissions: ["read:supplier", "write:delivery"],
      },
    };

    const context = validKeys[apiKey];
    if (!context) {
      return null;
    }

    return context;
  } catch (error) {
    console.error("API Key validation error:", error);
    return null;
  }
}

/**
 * API 응답 헬퍼
 */
export function apiResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }, { status });
}

export function apiError(message: string, status: number = 400, code?: string) {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code: code || `ERR_${status}`,
    },
    timestamp: new Date().toISOString(),
  }, { status });
}

/**
 * API 권한 체크
 */
export function hasPermission(context: ApiContext, required: string): boolean {
  if (!context.permissions) return false;

  // 와일드카드 체크 (예: read:all)
  const [action, resource] = required.split(":");
  if (context.permissions.includes(`${action}:all`)) return true;

  return context.permissions.includes(required);
}

/**
 * API Route Wrapper - 인증 및 에러 처리 자동화
 */
export function withApiAuth(
  handler: (request: NextRequest, context: ApiContext) => Promise<NextResponse>,
  options?: { requiredPermission?: string; allowPublic?: boolean }
) {
  return async (request: NextRequest) => {
    try {
      // 내부 호출 (같은 Next.js 앱에서) 체크
      const isInternalCall = request.headers.get("X-Internal-Request") === "true";

      if (isInternalCall && !options?.requiredPermission) {
        return handler(request, { clientType: "internal" });
      }

      // API Key 검증
      const apiContext = await validateApiKey(request);

      if (!apiContext && !options?.allowPublic) {
        return apiError("Invalid or missing API key", 401, "UNAUTHORIZED");
      }

      // 권한 체크
      if (options?.requiredPermission && apiContext) {
        if (!hasPermission(apiContext, options.requiredPermission)) {
          return apiError(
            `Permission denied: ${options.requiredPermission}`,
            403,
            "FORBIDDEN"
          );
        }
      }

      return handler(request, apiContext || { clientType: "internal" });
    } catch (error) {
      console.error("API Error:", error);
      return apiError("Internal server error", 500, "INTERNAL_ERROR");
    }
  };
}
