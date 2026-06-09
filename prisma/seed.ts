import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 부서 생성
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "DEV_QA" },
      update: {},
      create: { code: "DEV_QA", name: "개발품질팀" },
    }),
    prisma.department.upsert({
      where: { code: "PROD" },
      update: {},
      create: { code: "PROD", name: "생산팀" },
    }),
    prisma.department.upsert({
      where: { code: "PROD_TECH" },
      update: {},
      create: { code: "PROD_TECH", name: "생산기술팀" },
    }),
    prisma.department.upsert({
      where: { code: "SALES" },
      update: {},
      create: { code: "SALES", name: "영업관리팀" },
    }),
    prisma.department.upsert({
      where: { code: "COOP" },
      update: {},
      create: { code: "COOP", name: "상생협력팀" },
    }),
    prisma.department.upsert({
      where: { code: "DESIGN" },
      update: {},
      create: { code: "DESIGN", name: "설계팀" },
    }),
    prisma.department.upsert({
      where: { code: "MOLD" },
      update: {},
      create: { code: "MOLD", name: "금형개발팀" },
    }),
    prisma.department.upsert({
      where: { code: "MGMT" },
      update: {},
      create: { code: "MGMT", name: "경영관리팀" },
    }),
    prisma.department.upsert({
      where: { code: "IT" },
      update: {},
      create: { code: "IT", name: "전산팀" },
    }),
  ]);

  console.log(`Created ${departments.length} departments`);

  // 관리자 계정 생성
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { employeeId: "ADMIN001" },
    update: {},
    create: {
      employeeId: "ADMIN001",
      name: "시스템관리자",
      email: "admin@cams.co.kr",
      passwordHash: hashedPassword,
      departmentId: departments[0].id,
      position: "관리자",
      role: "admin",
    },
  });

  console.log(`Created admin user: ${adminUser.name}`);

  // 프로세스 생성
  const processes = await Promise.all([
    prisma.process.upsert({
      where: { code: "IATF16949" },
      update: {},
      create: { code: "IATF16949", name: "IATF16949", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "CSR" },
      update: {},
      create: { code: "CSR", name: "고객지정요구사항(CSR) 변경 이행점검", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "BIZ_PLAN" },
      update: {},
      create: { code: "BIZ_PLAN", name: "사업계획운영프로세스", category: "경영" },
    }),
    prisma.process.upsert({
      where: { code: "MGMT_REVIEW" },
      update: {},
      create: { code: "MGMT_REVIEW", name: "경영검토절차서", category: "경영" },
    }),
    prisma.process.upsert({
      where: { code: "RISK_MGMT" },
      update: {},
      create: { code: "RISK_MGMT", name: "리스크 관리 및 예방조치 절차서", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "INTERNAL_AUDIT" },
      update: {},
      create: { code: "INTERNAL_AUDIT", name: "내부심사프로세스", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "CONTINUOUS_IMPROVE" },
      update: {},
      create: { code: "CONTINUOUS_IMPROVE", name: "지속적개선 프로세스", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "CUST_SATISFY" },
      update: {},
      create: { code: "CUST_SATISFY", name: "고객만족도프로세스", category: "영업" },
    }),
    prisma.process.upsert({
      where: { code: "HR" },
      update: {},
      create: { code: "HR", name: "인적자원관리", category: "경영" },
    }),
    prisma.process.upsert({
      where: { code: "PRODUCTION" },
      update: {},
      create: { code: "PRODUCTION", name: "생산관리프로세스", category: "생산" },
    }),
    prisma.process.upsert({
      where: { code: "EQUIPMENT" },
      update: {},
      create: { code: "EQUIPMENT", name: "설비보전관리프로세스", category: "생산" },
    }),
    prisma.process.upsert({
      where: { code: "MOLD" },
      update: {},
      create: { code: "MOLD", name: "금형관리절차서", category: "생산" },
    }),
    prisma.process.upsert({
      where: { code: "JIG" },
      update: {},
      create: { code: "JIG", name: "지그관리 절차서", category: "생산" },
    }),
    prisma.process.upsert({
      where: { code: "INSPECTION" },
      update: {},
      create: { code: "INSPECTION", name: "검사업무프로세스", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "MEASUREMENT" },
      update: {},
      create: { code: "MEASUREMENT", name: "계측 및 시험관리절차서", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "LAB" },
      update: {},
      create: { code: "LAB", name: "시험실관리절차서", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "NC_MGMT" },
      update: {},
      create: { code: "NC_MGMT", name: "부적합품관리 및 시정조치프로세스", category: "품질" },
    }),
    prisma.process.upsert({
      where: { code: "PURCHASE" },
      update: {},
      create: { code: "PURCHASE", name: "구매관리프로세스", category: "구매" },
    }),
    prisma.process.upsert({
      where: { code: "SUPPLIER" },
      update: {},
      create: { code: "SUPPLIER", name: "공급자평가 및 등록 절차서", category: "구매" },
    }),
    prisma.process.upsert({
      where: { code: "EMERGENCY" },
      update: {},
      create: { code: "EMERGENCY", name: "비상사태관리지침", category: "안전" },
    }),
  ]);

  console.log(`Created ${processes.length} processes`);

  // 118개 관리항목 중 샘플 생성
  const controlItemsData = [
    { itemNo: 1, processCode: "IATF16949", name: "IATF_SIs, IAOB_letter_반영_Checklist", frequency: "발생시", notes: "IATF16949 변경사항 점검" },
    { itemNo: 2, processCode: "CSR", name: "고객 요구사항(CSR) 업데이트 또는 개정 관리", frequency: "발생시", notes: "품질5스타, SQ 평가기준 변경시 반영확인" },
    { itemNo: 3, processCode: "BIZ_PLAN", name: "사업계획 수립(부서/전사)", frequency: "년", notes: "년 1회 사업계획 수립 보고" },
    { itemNo: 4, processCode: "BIZ_PLAN", name: "매출액달성율", frequency: "년", notes: "별도관리(요청시 제출)" },
    { itemNo: 5, processCode: "BIZ_PLAN", name: "영업이익달성율", frequency: "년", notes: "별도관리(요청시 제출)" },
    { itemNo: 9, processCode: "MGMT_REVIEW", name: "경영검토 보고서", frequency: "년", notes: "" },
    { itemNo: 10, processCode: "RISK_MGMT", name: "리스크평가", frequency: "년", notes: "리스크평가항목기준 년1회평가" },
    { itemNo: 12, processCode: "INTERNAL_AUDIT", name: "내부심사 계획대 실적", frequency: "년", notes: "" },
    { itemNo: 14, processCode: "CONTINUOUS_IMPROVE", name: "프로세스별 성과지표", frequency: "월", notes: "매월 KPI 성과지표 작성" },
    { itemNo: 20, processCode: "HR", name: "년간 교육계획 수립", frequency: "년", notes: "전산관리(팀즈)" },
    { itemNo: 36, processCode: "PRODUCTION", name: "관리계획서/작업표준서", frequency: "발생시", notes: "신차개발시 작성" },
    { itemNo: 37, processCode: "PRODUCTION", name: "공정FMEA/중점관리표", frequency: "발생시", notes: "신차개발시 작성" },
    { itemNo: 40, processCode: "PRODUCTION", name: "F/PROOF 장비검증", frequency: "월", notes: "월단위 F/PROOF 장비 점검" },
    { itemNo: 45, processCode: "EQUIPMENT", name: "설비일상점검표", frequency: "일", notes: "전산관리(팀즈)" },
    { itemNo: 48, processCode: "EQUIPMENT", name: "년간예방보전계획대 실적", frequency: "월", notes: "전산관리(ERP)" },
    { itemNo: 50, processCode: "EQUIPMENT", name: "MTBF/MTTR 분석표", frequency: "월", notes: "" },
    { itemNo: 52, processCode: "MOLD", name: "금형일상점검 체크시트", frequency: "발생시", notes: "금형 교환시 체크" },
    { itemNo: 56, processCode: "JIG", name: "지그 관리기준 수립", frequency: "발생시", notes: "신규지그 제작시" },
    { itemNo: 80, processCode: "INSPECTION", name: "초,중,종품 검사일지", frequency: "일", notes: "사출 전산관리(POP)" },
    { itemNo: 85, processCode: "INSPECTION", name: "색차 관리", frequency: "LOT", notes: "LOT 별 색차측정관리" },
    { itemNo: 86, processCode: "INSPECTION", name: "도막두께", frequency: "일", notes: "주 1회 칼라별 측정" },
    { itemNo: 91, processCode: "INSPECTION", name: "수입검사 유검사 관리기준 설정", frequency: "월", notes: "수입검사 관리항목 선정" },
    { itemNo: 97, processCode: "MEASUREMENT", name: "검사구이력카드 관리대장", frequency: "발생시", notes: "신규차종 개발시" },
    { itemNo: 98, processCode: "MEASUREMENT", name: "계측기관리대장", frequency: "년", notes: "팀즈 파일 관리" },
    { itemNo: 101, processCode: "MEASUREMENT", name: "게이지 R&R 평가", frequency: "년", notes: "현장 검사원 R&R 평가" },
    { itemNo: 108, processCode: "EMERGENCY", name: "비상대응훈련결과 보고서_전력공급중단", frequency: "년", notes: "훈련결과보고서 필요" },
    { itemNo: 109, processCode: "EMERGENCY", name: "비상대응훈련결과 보고서_설비고장", frequency: "년", notes: "훈련결과보고서 필요" },
  ];

  const processMap = new Map(processes.map((p) => [p.code, p.id]));

  for (const item of controlItemsData) {
    await prisma.controlItem.upsert({
      where: {
        id: item.itemNo, // Using itemNo as temp unique key
      },
      update: {},
      create: {
        itemNo: item.itemNo,
        processId: processMap.get(item.processCode),
        name: item.name,
        frequency: item.frequency,
        notes: item.notes,
      },
    });
  }

  console.log(`Created ${controlItemsData.length} control items`);

  // 샘플 설비 생성
  const equipmentData = [
    { assetNo: "EQ-001", name: "사출기 #1", category: "사출", location: "사출동" },
    { assetNo: "EQ-002", name: "사출기 #2", category: "사출", location: "사출동" },
    { assetNo: "EQ-003", name: "사출기 #3", category: "사출", location: "사출동" },
    { assetNo: "EQ-004", name: "도장부스 #1", category: "도장", location: "도장동" },
    { assetNo: "EQ-005", name: "도장부스 #2", category: "도장", location: "도장동" },
    { assetNo: "EQ-006", name: "조립라인 #1", category: "조립", location: "조립동" },
    { assetNo: "EQ-007", name: "조립라인 #2", category: "조립", location: "조립동" },
  ];

  for (const eq of equipmentData) {
    await prisma.equipment.upsert({
      where: { assetNo: eq.assetNo },
      update: {},
      create: eq,
    });
  }

  console.log(`Created ${equipmentData.length} equipment`);

  // 샘플 차종/부품 생성
  const vehicleModel = await prisma.vehicleModel.upsert({
    where: { code: "NQ5" },
    update: {},
    create: { code: "NQ5", name: "NQ5 스포티지", customer: "기아" },
  });

  const partsData = [
    { partNo: "86501-P1000", name: "FR BUMPER ASSY" },
    { partNo: "86350-P1500", name: "GRILLE-RADIATOR" },
    { partNo: "86512-P1010", name: "COVER-FR BUMPER LWR" },
    { partNo: "86555-P1000", name: "REINF-FR BUMPER SIDE" },
  ];

  for (const part of partsData) {
    await prisma.part.upsert({
      where: { partNo: part.partNo },
      update: {},
      create: { ...part, vehicleModelId: vehicleModel.id, category: "도장" },
    });
  }

  console.log(`Created ${partsData.length} parts`);

  // 샘플 계측기 생성
  const instrumentsData = [
    { instrumentNo: "903515", name: "버니어 캘리퍼스", type: "버니어", range: "0-150mm", resolution: "0.01mm" },
    { instrumentNo: "903516", name: "갭자", type: "갭자", range: "0-150mm", resolution: "0.1mm" },
    { instrumentNo: "903517", name: "다이얼 게이지", type: "다이얼", range: "0-10mm", resolution: "0.01mm" },
    { instrumentNo: "903518", name: "푸쉬풀 게이지", type: "푸쉬풀", range: "0-50N", resolution: "0.1N" },
  ];

  for (const inst of instrumentsData) {
    await prisma.measuringInstrument.upsert({
      where: { instrumentNo: inst.instrumentNo },
      update: {},
      create: { ...inst, calibrationCycle: 12 },
    });
  }

  console.log(`Created ${instrumentsData.length} measuring instruments`);

  // 비상사태 유형 생성
  const emergencyTypes = [
    { code: "POWER", name: "전력공급중단" },
    { code: "EQUIP", name: "설비고장/생산설비손상" },
    { code: "LABOR", name: "인력부족" },
    { code: "SUPPLY", name: "자재/부품공급차질" },
    { code: "IT", name: "정보시스템/네트워크장애" },
    { code: "NATURAL", name: "자연재해" },
    { code: "FIRE", name: "화재 또는 폭발사고" },
    { code: "PANDEMIC", name: "전염병 및 팬데믹 상황" },
    { code: "CYBER", name: "보안사고/사이버공격" },
  ];

  for (const et of emergencyTypes) {
    await prisma.emergencyType.upsert({
      where: { code: et.code },
      update: {},
      create: et,
    });
  }

  console.log(`Created ${emergencyTypes.length} emergency types`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
