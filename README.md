# IATF 16949 품질경영시스템 (QMS) 웹

자동차 부품사(㈜캠스 기준)의 **IATF 16949 품질경영 관리항목을 엑셀/문서에서 웹으로 디지털화**한 사내 품질관리 시스템입니다.
기존에 흩어져 있던 137개 소스 문서(엑셀 양식 60개 + PowerPoint 문서 77개)를 분석하여, 관리항목별 웹 메뉴와 입력 화면으로 전환했습니다.

> 저장소: `github.com/wilcoco/iatf`

---

## 무엇을 했나

- **소스 문서 137개 분석** — IATF 관리항목이 담긴 엑셀(`extracted_docs/`)과 문서를 시트/내용 기준으로 분류.
- **관리항목 → 웹 메뉴화** — 21개 메뉴 그룹, 약 190개 페이지로 구성된 대시보드 구축.
- **커버리지 검증** — 137개 소스문서 ↔ 웹메뉴 매핑표를 작성하고 누락을 식별·보완하여 **전 항목 메뉴 확보(미커버 0건)**. 분석 결과는 [`docs/EXCEL_MENU_COVERAGE.md`](docs/EXCEL_MENU_COVERAGE.md) 참고.

## 주요 메뉴 그룹

기준정보 · IATF16949/CSR · 경영관리 · 내부심사 · 고객만족도 · 인적자원관리 · 영업/수주관리 · 생산관리 ·
설비보전관리 · 금형/지그관리 · 개발/도면관리 · 변경/부적합관리 · 구매/공급자관리 · 자재/인도관리 ·
검사업무 · 품질시험관리 · 계측/검사구관리 · 시험실관리 · 포장관리 · 비상사태관리 · 3정5행

각 화면은 탭 기반의 입력 폼 + 현황 목록 + 요약 지표로 구성되며, IATF 16949 양식 구조를 그대로 반영합니다.

## 기술 스택

| 구분 | 내용 |
|------|------|
| 프레임워크 | Next.js 14 (App Router), React 18, TypeScript |
| UI | Tailwind CSS, Radix UI 기반 shadcn 컴포넌트, lucide-react 아이콘 |
| 데이터 | Prisma ORM, recharts(차트), xlsx(엑셀 파싱) |
| 인증 | NextAuth (Prisma Adapter) |
| 폼/검증 | react-hook-form, zod |

## 프로젝트 구조

```
src/
  app/(dashboard)/      # 관리항목별 페이지 (메뉴 = 라우트)
  components/
    layout/Sidebar.tsx  # 전체 메뉴 정의(단일 소스)
    ui/                 # 공용 UI 컴포넌트
data/                   # 엑셀 분석 결과, 관리항목 정의
docs/                   # 설계/배포 문서, 커버리지 분석
extracted_docs/         # 원본 엑셀/문서 추출본
prisma/                 # DB 스키마 및 시드
```

## 시작하기

```bash
npm install          # 의존성 설치 (postinstall에서 prisma generate 실행)
npm run dev          # 개발 서버 → http://localhost:3000
```

기타 스크립트:

```bash
npm run build        # prisma generate + next build (프로덕션 빌드)
npm run start        # 프로덕션 서버
npm run db:push      # Prisma 스키마를 DB에 반영
npm run db:seed      # 시드 데이터 입력
npm run lint         # ESLint
```

> 요구 사항: Node.js ≥ 20.9.0. 환경 변수는 `.env.example`을 참고해 `.env`를 구성하세요.

## 배포

Railway 배포 구성(`railway.json`, `nixpacks.toml`)이 포함되어 있습니다. 자세한 내용은 [`docs/RAILWAY_DEPLOY.md`](docs/RAILWAY_DEPLOY.md) 참고.
