// 기준정보 공유 데이터 모듈
// 다른 메뉴에서 import하여 사용 가능

// ============ 공급자 데이터 ============
export interface Supplier {
  id: number;
  code: string;
  name: string;
  businessNo: string;
  ceo: string;
  type: "제조" | "서비스" | "물류" | "검사" | "";
  grade: "A" | "B" | "C" | "D" | "";
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  certifications: string[];
  isActive: boolean;
}

export const suppliers: Supplier[] = [
  { id: 1, code: "SUP-001", name: "(주)카라", businessNo: "123-45-67890", ceo: "홍길동", type: "제조", grade: "A", address: "경기도 화성시", contactName: "김담당", contactPhone: "031-123-4567", contactEmail: "contact@kara.co.kr", certifications: ["ISO 9001", "IATF 16949"], isActive: true },
  { id: 2, code: "SUP-002", name: "G금강", businessNo: "234-56-78901", ceo: "이사장", type: "제조", grade: "A", address: "경기도 평택시", contactName: "박과장", contactPhone: "031-234-5678", contactEmail: "contact@gkumkang.co.kr", certifications: ["ISO 9001", "IATF 16949", "ISO 14001"], isActive: true },
  { id: 3, code: "SUP-003", name: "신성화학", businessNo: "345-67-89012", ceo: "최대표", type: "제조", grade: "B", address: "충남 아산시", contactName: "정대리", contactPhone: "041-345-6789", contactEmail: "contact@shinsung.co.kr", certifications: ["ISO 9001"], isActive: true },
  { id: 4, code: "SUP-004", name: "성신스프레이", businessNo: "456-78-90123", ceo: "김사장", type: "서비스", grade: "B", address: "경기도 안산시", contactName: "이팀장", contactPhone: "031-456-7890", contactEmail: "contact@ssungsin.co.kr", certifications: ["ISO 9001", "ISO 14001"], isActive: true },
  { id: 5, code: "SUP-005", name: "모아에스엔피", businessNo: "567-89-01234", ceo: "박대표", type: "제조", grade: "C", address: "경기도 시흥시", contactName: "최과장", contactPhone: "031-567-8901", contactEmail: "contact@moasnp.co.kr", certifications: ["ISO 9001"], isActive: false },
];

export function getSuppliers() { return suppliers; }
export function getActiveSuppliers() { return suppliers.filter(s => s.isActive); }
export function getSupplierByCode(code: string) { return suppliers.find(s => s.code === code); }

// ============ 품목 데이터 ============
export interface Part {
  id: number;
  code: string;
  name: string;
  spec: string;
  unit: string;
  customer: string;
  vehicleModel: string;
  category: string;
  isActive: boolean;
}

export const parts: Part[] = [
  { id: 1, code: "P-001", name: "범퍼 커버 FR", spec: "ABS, 검정", unit: "EA", customer: "현대자동차", vehicleModel: "아반떼", category: "외장", isActive: true },
  { id: 2, code: "P-002", name: "범퍼 커버 RR", spec: "ABS, 검정", unit: "EA", customer: "현대자동차", vehicleModel: "아반떼", category: "외장", isActive: true },
  { id: 3, code: "P-003", name: "라디에이터 그릴", spec: "PP, 크롬도금", unit: "EA", customer: "기아자동차", vehicleModel: "K5", category: "외장", isActive: true },
  { id: 4, code: "P-004", name: "사이드 미러 커버 LH", spec: "ABS, 도색", unit: "EA", customer: "현대자동차", vehicleModel: "쏘나타", category: "외장", isActive: true },
  { id: 5, code: "P-005", name: "사이드 미러 커버 RH", spec: "ABS, 도색", unit: "EA", customer: "현대자동차", vehicleModel: "쏘나타", category: "외장", isActive: true },
  { id: 6, code: "P-006", name: "도어 핸들 FR LH", spec: "PC/ABS, 도금", unit: "EA", customer: "기아자동차", vehicleModel: "쏘렌토", category: "내장", isActive: true },
  { id: 7, code: "P-007", name: "도어 핸들 FR RH", spec: "PC/ABS, 도금", unit: "EA", customer: "기아자동차", vehicleModel: "쏘렌토", category: "내장", isActive: true },
  { id: 8, code: "P-008", name: "센터페시아 어셈블리", spec: "PC/ABS", unit: "SET", customer: "현대자동차", vehicleModel: "그랜저", category: "내장", isActive: true },
];

export function getParts() { return parts; }
export function getActiveParts() { return parts.filter(p => p.isActive); }
export function getPartByCode(code: string) { return parts.find(p => p.code === code); }
export function getPartsByCustomer(customer: string) { return parts.filter(p => p.customer === customer); }

// ============ 설비 데이터 ============
export interface Equipment {
  id: number;
  code: string;
  name: string;
  type: string;
  line: string;
  manufacturer: string;
  model: string;
  installDate: string;
  status: "가동" | "정지" | "고장" | "점검중";
}

export const equipments: Equipment[] = [
  { id: 1, code: "EQ-001", name: "사출기 1호기", type: "사출기", line: "사출라인-A", manufacturer: "엘지", model: "LGH-350", installDate: "2020-03-15", status: "가동" },
  { id: 2, code: "EQ-002", name: "사출기 2호기", type: "사출기", line: "사출라인-A", manufacturer: "엘지", model: "LGH-350", installDate: "2020-03-15", status: "가동" },
  { id: 3, code: "EQ-003", name: "사출기 3호기", type: "사출기", line: "사출라인-B", manufacturer: "우진", model: "WJ-450", installDate: "2021-06-20", status: "가동" },
  { id: 4, code: "EQ-004", name: "도장 로봇 1호기", type: "도장설비", line: "도장라인", manufacturer: "현대로보틱스", model: "HH020", installDate: "2019-11-10", status: "가동" },
  { id: 5, code: "EQ-005", name: "건조로 1호", type: "건조설비", line: "도장라인", manufacturer: "삼양", model: "SY-DRY500", installDate: "2019-11-10", status: "가동" },
  { id: 6, code: "EQ-006", name: "조립라인 컨베이어", type: "컨베이어", line: "조립라인", manufacturer: "대한", model: "DH-CV100", installDate: "2018-05-25", status: "가동" },
];

export function getEquipments() { return equipments; }
export function getEquipmentByCode(code: string) { return equipments.find(e => e.code === code); }
export function getEquipmentsByLine(line: string) { return equipments.filter(e => e.line === line); }
export function getEquipmentsByType(type: string) { return equipments.filter(e => e.type === type); }

// ============ 계측기 데이터 ============
export interface Instrument {
  id: number;
  code: string;
  name: string;
  type: string;
  spec: string;
  manufacturer: string;
  model: string;
  calibrationCycle: number; // 개월
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  location: string;
  status: "사용중" | "검교정중" | "보관" | "폐기";
}

export const instruments: Instrument[] = [
  { id: 1, code: "INS-001", name: "버니어캘리퍼스", type: "길이측정", spec: "0-150mm", manufacturer: "미쓰토요", model: "CD-15CPX", calibrationCycle: 12, lastCalibrationDate: "2024-01-15", nextCalibrationDate: "2025-01-15", location: "품질검사실", status: "사용중" },
  { id: 2, code: "INS-002", name: "마이크로미터", type: "길이측정", spec: "0-25mm", manufacturer: "미쓰토요", model: "MDC-25MX", calibrationCycle: 12, lastCalibrationDate: "2024-02-10", nextCalibrationDate: "2025-02-10", location: "품질검사실", status: "사용중" },
  { id: 3, code: "INS-003", name: "하이트게이지", type: "길이측정", spec: "0-300mm", manufacturer: "미쓰토요", model: "HDS-30C", calibrationCycle: 12, lastCalibrationDate: "2024-03-05", nextCalibrationDate: "2025-03-05", location: "측정실", status: "사용중" },
  { id: 4, code: "INS-004", name: "토크렌치", type: "토크측정", spec: "5-25Nm", manufacturer: "토니치", model: "QL25N", calibrationCycle: 6, lastCalibrationDate: "2024-04-20", nextCalibrationDate: "2024-10-20", location: "조립라인", status: "사용중" },
  { id: 5, code: "INS-005", name: "색차계", type: "색상측정", spec: "L*a*b*", manufacturer: "코니카미놀타", model: "CR-400", calibrationCycle: 12, lastCalibrationDate: "2024-01-25", nextCalibrationDate: "2025-01-25", location: "도장검사실", status: "사용중" },
  { id: 6, code: "INS-006", name: "광택계", type: "광택측정", spec: "20/60/85°", manufacturer: "BYK", model: "micro-gloss", calibrationCycle: 12, lastCalibrationDate: "2024-02-28", nextCalibrationDate: "2025-02-28", location: "도장검사실", status: "사용중" },
];

export function getInstruments() { return instruments; }
export function getInstrumentByCode(code: string) { return instruments.find(i => i.code === code); }
export function getInstrumentsByType(type: string) { return instruments.filter(i => i.type === type); }

// ============ 금형 데이터 ============
export interface Mold {
  id: number;
  code: string;
  name: string;
  partCode: string;
  partName: string;
  cavity: number;
  material: string;
  weight: number;
  manufacturer: string;
  manufactureDate: string;
  location: string;
  status: "사용중" | "수리중" | "보관" | "폐기";
  shotCount: number;
  maxShotCount: number;
}

export const molds: Mold[] = [
  { id: 1, code: "MLD-001", name: "범퍼FR금형", partCode: "P-001", partName: "범퍼 커버 FR", cavity: 1, material: "NAK80", weight: 2500, manufacturer: "대성금형", manufactureDate: "2020-02-15", location: "사출라인-A", status: "사용중", shotCount: 150000, maxShotCount: 500000 },
  { id: 2, code: "MLD-002", name: "범퍼RR금형", partCode: "P-002", partName: "범퍼 커버 RR", cavity: 1, material: "NAK80", weight: 2800, manufacturer: "대성금형", manufactureDate: "2020-02-20", location: "사출라인-A", status: "사용중", shotCount: 145000, maxShotCount: 500000 },
  { id: 3, code: "MLD-003", name: "그릴금형", partCode: "P-003", partName: "라디에이터 그릴", cavity: 2, material: "SKD61", weight: 1200, manufacturer: "한양금형", manufactureDate: "2021-05-10", location: "사출라인-B", status: "사용중", shotCount: 80000, maxShotCount: 300000 },
  { id: 4, code: "MLD-004", name: "미러커버LH금형", partCode: "P-004", partName: "사이드 미러 커버 LH", cavity: 4, material: "NAK80", weight: 450, manufacturer: "정밀금형", manufactureDate: "2022-03-15", location: "사출라인-B", status: "사용중", shotCount: 45000, maxShotCount: 200000 },
];

export function getMolds() { return molds; }
export function getMoldByCode(code: string) { return molds.find(m => m.code === code); }
export function getMoldsByPartCode(partCode: string) { return molds.filter(m => m.partCode === partCode); }

// ============ 자재 데이터 ============
export interface Material {
  id: number;
  code: string;
  name: string;
  spec: string;
  unit: string;
  category: "원재료" | "부재료" | "포장재";
  supplierCode: string;
  supplierName: string;
  safetyStock: number;
  reorderPoint: number;
  currentStock: number;
}

export const materials: Material[] = [
  { id: 1, code: "MAT-001", name: "ABS 수지", spec: "HI-121H, 검정", unit: "KG", category: "원재료", supplierCode: "SUP-001", supplierName: "(주)카라", safetyStock: 500, reorderPoint: 800, currentStock: 1200 },
  { id: 2, code: "MAT-002", name: "PP 수지", spec: "J-550S, 자연", unit: "KG", category: "원재료", supplierCode: "SUP-002", supplierName: "G금강", safetyStock: 300, reorderPoint: 500, currentStock: 750 },
  { id: 3, code: "MAT-003", name: "PC/ABS 수지", spec: "C6600, 자연", unit: "KG", category: "원재료", supplierCode: "SUP-003", supplierName: "신성화학", safetyStock: 200, reorderPoint: 350, currentStock: 420 },
  { id: 4, code: "MAT-004", name: "도료 (검정)", spec: "2K PU, 무광", unit: "L", category: "부재료", supplierCode: "SUP-004", supplierName: "성신스프레이", safetyStock: 50, reorderPoint: 80, currentStock: 120 },
  { id: 5, code: "MAT-005", name: "골판지 박스", spec: "500x400x300mm", unit: "EA", category: "포장재", supplierCode: "SUP-005", supplierName: "모아에스엔피", safetyStock: 200, reorderPoint: 300, currentStock: 450 },
];

export function getMaterials() { return materials; }
export function getMaterialByCode(code: string) { return materials.find(m => m.code === code); }
export function getMaterialsByCategory(category: string) { return materials.filter(m => m.category === category); }

// ============ 공정 데이터 ============
export interface Process {
  id: number;
  code: string;
  name: string;
  type: "사출" | "도장" | "조립" | "검사" | "포장";
  line: string;
  cycleTime: number; // 초
  description: string;
}

export const processes: Process[] = [
  { id: 1, code: "PRC-001", name: "사출공정", type: "사출", line: "사출라인-A", cycleTime: 45, description: "ABS/PP 사출 성형" },
  { id: 2, code: "PRC-002", name: "전처리공정", type: "도장", line: "도장라인", cycleTime: 120, description: "탈지, 수세, 건조" },
  { id: 3, code: "PRC-003", name: "프라이머도장", type: "도장", line: "도장라인", cycleTime: 90, description: "프라이머 도포" },
  { id: 4, code: "PRC-004", name: "상도도장", type: "도장", line: "도장라인", cycleTime: 90, description: "컬러베이스 및 클리어 도포" },
  { id: 5, code: "PRC-005", name: "건조공정", type: "도장", line: "도장라인", cycleTime: 1800, description: "80℃ 열풍건조" },
  { id: 6, code: "PRC-006", name: "조립공정", type: "조립", line: "조립라인", cycleTime: 60, description: "부품 조립" },
  { id: 7, code: "PRC-007", name: "최종검사", type: "검사", line: "검사라인", cycleTime: 30, description: "외관 및 치수 검사" },
  { id: 8, code: "PRC-008", name: "포장공정", type: "포장", line: "포장라인", cycleTime: 20, description: "제품 포장" },
];

export function getProcesses() { return processes; }
export function getProcessByCode(code: string) { return processes.find(p => p.code === code); }
export function getProcessesByType(type: string) { return processes.filter(p => p.type === type); }

// ============ 부서 데이터 ============
export interface Department {
  id: number;
  code: string;
  name: string;
  parentCode: string | null;
  manager: string;
  phone: string;
}

export const departments: Department[] = [
  { id: 1, code: "DEPT-001", name: "경영지원팀", parentCode: null, manager: "김경영", phone: "031-100-1000" },
  { id: 2, code: "DEPT-002", name: "영업팀", parentCode: null, manager: "이영업", phone: "031-100-2000" },
  { id: 3, code: "DEPT-003", name: "품질관리팀", parentCode: null, manager: "박품질", phone: "031-100-3000" },
  { id: 4, code: "DEPT-004", name: "생산관리팀", parentCode: null, manager: "최생산", phone: "031-100-4000" },
  { id: 5, code: "DEPT-005", name: "생산기술팀", parentCode: null, manager: "정기술", phone: "031-100-5000" },
  { id: 6, code: "DEPT-006", name: "구매팀", parentCode: null, manager: "강구매", phone: "031-100-6000" },
  { id: 7, code: "DEPT-007", name: "설비팀", parentCode: null, manager: "윤설비", phone: "031-100-7000" },
];

export function getDepartments() { return departments; }
export function getDepartmentByCode(code: string) { return departments.find(d => d.code === code); }

// ============ 고객사 데이터 ============
export interface Customer {
  id: number;
  code: string;
  name: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export const customers: Customer[] = [
  { id: 1, code: "CUS-001", name: "현대자동차", contactName: "김현대", contactPhone: "02-1234-5678", contactEmail: "contact@hyundai.com" },
  { id: 2, code: "CUS-002", name: "기아자동차", contactName: "이기아", contactPhone: "02-2345-6789", contactEmail: "contact@kia.com" },
  { id: 3, code: "CUS-003", name: "현대모비스", contactName: "박모비스", contactPhone: "02-3456-7890", contactEmail: "contact@mobis.com" },
];

export function getCustomers() { return customers; }
export function getCustomerByCode(code: string) { return customers.find(c => c.code === code); }
