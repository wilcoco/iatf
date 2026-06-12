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

// ============ 차종 데이터 ============
export interface VehicleModel {
  id: number;
  code: string;
  name: string;
  customerCode: string;
  customerName: string;
  productionYear: string;
  status: "양산" | "개발" | "단종";
}

export const vehicleModels: VehicleModel[] = [
  { id: 1, code: "VM-001", name: "아반떼", customerCode: "CUS-001", customerName: "현대자동차", productionYear: "2020", status: "양산" },
  { id: 2, code: "VM-002", name: "쏘나타", customerCode: "CUS-001", customerName: "현대자동차", productionYear: "2019", status: "양산" },
  { id: 3, code: "VM-003", name: "그랜저", customerCode: "CUS-001", customerName: "현대자동차", productionYear: "2021", status: "양산" },
  { id: 4, code: "VM-004", name: "K5", customerCode: "CUS-002", customerName: "기아자동차", productionYear: "2020", status: "양산" },
  { id: 5, code: "VM-005", name: "쏘렌토", customerCode: "CUS-002", customerName: "기아자동차", productionYear: "2020", status: "양산" },
  { id: 6, code: "VM-006", name: "카니발", customerCode: "CUS-002", customerName: "기아자동차", productionYear: "2021", status: "양산" },
  { id: 7, code: "VM-007", name: "투싼", customerCode: "CUS-001", customerName: "현대자동차", productionYear: "2022", status: "양산" },
  { id: 8, code: "VM-008", name: "싼타페", customerCode: "CUS-001", customerName: "현대자동차", productionYear: "2023", status: "양산" },
];

export function getVehicleModels() { return vehicleModels; }
export function getVehicleModelByCode(code: string) { return vehicleModels.find(v => v.code === code); }
export function getVehicleModelsByCustomer(customerCode: string) { return vehicleModels.filter(v => v.customerCode === customerCode); }
export function getActiveVehicleModels() { return vehicleModels.filter(v => v.status === "양산"); }

// ============ 사용자/작업자 데이터 ============
export interface User {
  id: number;
  code: string;
  name: string;
  email: string;
  departmentCode: string;
  departmentName: string;
  position: string;
  role: "admin" | "manager" | "user";
  isActive: boolean;
}

export const users: User[] = [
  { id: 1, code: "EMP-001", name: "김관리", email: "kim@company.com", departmentCode: "DEPT-001", departmentName: "경영지원팀", position: "팀장", role: "admin", isActive: true },
  { id: 2, code: "EMP-002", name: "이영업", email: "lee@company.com", departmentCode: "DEPT-002", departmentName: "영업팀", position: "팀장", role: "manager", isActive: true },
  { id: 3, code: "EMP-003", name: "박품질", email: "park@company.com", departmentCode: "DEPT-003", departmentName: "품질관리팀", position: "팀장", role: "manager", isActive: true },
  { id: 4, code: "EMP-004", name: "최생산", email: "choi@company.com", departmentCode: "DEPT-004", departmentName: "생산관리팀", position: "팀장", role: "manager", isActive: true },
  { id: 5, code: "EMP-005", name: "정기술", email: "jung@company.com", departmentCode: "DEPT-005", departmentName: "생산기술팀", position: "팀장", role: "manager", isActive: true },
  { id: 6, code: "EMP-006", name: "강구매", email: "kang@company.com", departmentCode: "DEPT-006", departmentName: "구매팀", position: "팀장", role: "manager", isActive: true },
  { id: 7, code: "EMP-007", name: "윤설비", email: "yoon@company.com", departmentCode: "DEPT-007", departmentName: "설비팀", position: "팀장", role: "manager", isActive: true },
  { id: 8, code: "EMP-008", name: "한검사", email: "han@company.com", departmentCode: "DEPT-003", departmentName: "품질관리팀", position: "과장", role: "user", isActive: true },
  { id: 9, code: "EMP-009", name: "오생산", email: "oh@company.com", departmentCode: "DEPT-004", departmentName: "생산관리팀", position: "대리", role: "user", isActive: true },
  { id: 10, code: "EMP-010", name: "서조립", email: "seo@company.com", departmentCode: "DEPT-004", departmentName: "생산관리팀", position: "사원", role: "user", isActive: true },
];

export function getUsers() { return users; }
export function getUserByCode(code: string) { return users.find(u => u.code === code); }
export function getActiveUsers() { return users.filter(u => u.isActive); }
export function getUsersByDepartment(deptCode: string) { return users.filter(u => u.departmentCode === deptCode); }

// ============ 불량유형 데이터 ============
export interface DefectType {
  id: number;
  code: string;
  name: string;
  category: "외관" | "치수" | "기능" | "포장" | "기타";
  description: string;
  isActive: boolean;
}

export const defectTypes: DefectType[] = [
  { id: 1, code: "DFT-001", name: "스크래치", category: "외관", description: "제품 표면 긁힘", isActive: true },
  { id: 2, code: "DFT-002", name: "찍힘", category: "외관", description: "제품 표면 찍힘 자국", isActive: true },
  { id: 3, code: "DFT-003", name: "이물", category: "외관", description: "도장면 이물 부착", isActive: true },
  { id: 4, code: "DFT-004", name: "흘림", category: "외관", description: "도료 흘림 현상", isActive: true },
  { id: 5, code: "DFT-005", name: "미도장", category: "외관", description: "도장 누락 부위", isActive: true },
  { id: 6, code: "DFT-006", name: "변색", category: "외관", description: "색상 차이/변색", isActive: true },
  { id: 7, code: "DFT-007", name: "광택불량", category: "외관", description: "광택 기준 미달", isActive: true },
  { id: 8, code: "DFT-008", name: "치수불량", category: "치수", description: "규격 치수 초과/미달", isActive: true },
  { id: 9, code: "DFT-009", name: "변형", category: "치수", description: "제품 휨/비틀림", isActive: true },
  { id: 10, code: "DFT-010", name: "크랙", category: "기능", description: "균열/금 발생", isActive: true },
  { id: 11, code: "DFT-011", name: "조립불량", category: "기능", description: "조립 불가/간섭", isActive: true },
  { id: 12, code: "DFT-012", name: "기능불량", category: "기능", description: "동작/기능 이상", isActive: true },
  { id: 13, code: "DFT-013", name: "포장파손", category: "포장", description: "포장 손상", isActive: true },
  { id: 14, code: "DFT-014", name: "라벨오류", category: "포장", description: "라벨 부착 오류", isActive: true },
  { id: 15, code: "DFT-015", name: "기타", category: "기타", description: "기타 불량", isActive: true },
];

export function getDefectTypes() { return defectTypes; }
export function getDefectTypeByCode(code: string) { return defectTypes.find(d => d.code === code); }
export function getDefectTypesByCategory(category: string) { return defectTypes.filter(d => d.category === category); }
export function getActiveDefectTypes() { return defectTypes.filter(d => d.isActive); }

// ============ 검사항목 데이터 ============
export interface InspectionItem {
  id: number;
  code: string;
  name: string;
  type: "수입검사" | "공정검사" | "출하검사" | "초물검사";
  category: "외관" | "치수" | "성능" | "신뢰성";
  spec: string;
  lsl: number | null; // Lower Spec Limit
  usl: number | null; // Upper Spec Limit
  unit: string;
  method: string;
  instrumentCode: string | null;
  frequency: string;
  isActive: boolean;
}

export const inspectionItems: InspectionItem[] = [
  // 외관검사 항목
  { id: 1, code: "INS-ITM-001", name: "외관검사", type: "공정검사", category: "외관", spec: "스크래치, 이물, 변색 없을 것", lsl: null, usl: null, unit: "-", method: "육안검사", instrumentCode: null, frequency: "전수", isActive: true },
  { id: 2, code: "INS-ITM-002", name: "색상검사", type: "공정검사", category: "외관", spec: "ΔE ≤ 1.0", lsl: null, usl: 1.0, unit: "ΔE", method: "색차계 측정", instrumentCode: "INS-005", frequency: "LOT별", isActive: true },
  { id: 3, code: "INS-ITM-003", name: "광택검사", type: "공정검사", category: "외관", spec: "85 ± 5 GU", lsl: 80, usl: 90, unit: "GU", method: "광택계 측정", instrumentCode: "INS-006", frequency: "LOT별", isActive: true },
  // 치수검사 항목
  { id: 4, code: "INS-ITM-004", name: "전장 치수", type: "공정검사", category: "치수", spec: "500 ± 0.5mm", lsl: 499.5, usl: 500.5, unit: "mm", method: "버니어캘리퍼스", instrumentCode: "INS-001", frequency: "초중종물", isActive: true },
  { id: 5, code: "INS-ITM-005", name: "전폭 치수", type: "공정검사", category: "치수", spec: "300 ± 0.3mm", lsl: 299.7, usl: 300.3, unit: "mm", method: "버니어캘리퍼스", instrumentCode: "INS-001", frequency: "초중종물", isActive: true },
  { id: 6, code: "INS-ITM-006", name: "두께 치수", type: "공정검사", category: "치수", spec: "3.0 ± 0.1mm", lsl: 2.9, usl: 3.1, unit: "mm", method: "마이크로미터", instrumentCode: "INS-002", frequency: "초중종물", isActive: true },
  // 성능검사 항목
  { id: 7, code: "INS-ITM-007", name: "토크검사", type: "공정검사", category: "성능", spec: "15 ± 2 Nm", lsl: 13, usl: 17, unit: "Nm", method: "토크렌치", instrumentCode: "INS-004", frequency: "전수", isActive: true },
  { id: 8, code: "INS-ITM-008", name: "조립력검사", type: "출하검사", category: "성능", spec: "50 ± 10 N", lsl: 40, usl: 60, unit: "N", method: "푸시풀게이지", instrumentCode: null, frequency: "샘플링", isActive: true },
  // 신뢰성검사 항목
  { id: 9, code: "INS-ITM-009", name: "도막두께", type: "출하검사", category: "신뢰성", spec: "35 ± 5 μm", lsl: 30, usl: 40, unit: "μm", method: "도막두께계", instrumentCode: null, frequency: "LOT별", isActive: true },
  { id: 10, code: "INS-ITM-010", name: "부착력검사", type: "출하검사", category: "신뢰성", spec: "100/100", lsl: null, usl: null, unit: "-", method: "Cross-cut", instrumentCode: null, frequency: "LOT별", isActive: true },
  // 수입검사 항목
  { id: 11, code: "INS-ITM-011", name: "원자재 외관", type: "수입검사", category: "외관", spec: "이물, 변색 없을 것", lsl: null, usl: null, unit: "-", method: "육안검사", instrumentCode: null, frequency: "LOT별", isActive: true },
  { id: 12, code: "INS-ITM-012", name: "MI (용융지수)", type: "수입검사", category: "성능", spec: "10 ± 2 g/10min", lsl: 8, usl: 12, unit: "g/10min", method: "MI 측정기", instrumentCode: null, frequency: "LOT별", isActive: true },
];

export function getInspectionItems() { return inspectionItems; }
export function getInspectionItemByCode(code: string) { return inspectionItems.find(i => i.code === code); }
export function getInspectionItemsByType(type: string) { return inspectionItems.filter(i => i.type === type); }
export function getInspectionItemsByCategory(category: string) { return inspectionItems.filter(i => i.category === category); }
export function getActiveInspectionItems() { return inspectionItems.filter(i => i.isActive); }

// ============ 교육과정 데이터 ============
export interface TrainingCourse {
  id: number;
  code: string;
  name: string;
  type: "신입교육" | "정기교육" | "특별교육" | "자격교육" | "직무교육";
  category: "품질" | "안전" | "환경" | "기술" | "관리";
  targetDepartments: string[];
  duration: number; // 시간
  frequency: "입사시" | "연1회" | "반기1회" | "분기1회" | "수시";
  description: string;
  isRequired: boolean;
  isActive: boolean;
}

export const trainingCourses: TrainingCourse[] = [
  // 신입교육
  { id: 1, code: "TRN-001", name: "신입사원 품질교육", type: "신입교육", category: "품질", targetDepartments: ["전체"], duration: 8, frequency: "입사시", description: "IATF 16949 기본, 품질시스템 이해", isRequired: true, isActive: true },
  { id: 2, code: "TRN-002", name: "신입사원 안전교육", type: "신입교육", category: "안전", targetDepartments: ["전체"], duration: 4, frequency: "입사시", description: "산업안전보건, 작업장 안전수칙", isRequired: true, isActive: true },
  // 정기교육
  { id: 3, code: "TRN-003", name: "IATF 16949 인식교육", type: "정기교육", category: "품질", targetDepartments: ["전체"], duration: 4, frequency: "연1회", description: "자동차 품질경영시스템 요구사항", isRequired: true, isActive: true },
  { id: 4, code: "TRN-004", name: "정기 안전교육", type: "정기교육", category: "안전", targetDepartments: ["전체"], duration: 2, frequency: "분기1회", description: "안전사고 예방, 비상대응", isRequired: true, isActive: true },
  { id: 5, code: "TRN-005", name: "환경경영 교육", type: "정기교육", category: "환경", targetDepartments: ["전체"], duration: 2, frequency: "연1회", description: "환경방침, 폐기물 관리", isRequired: true, isActive: true },
  // 직무교육
  { id: 6, code: "TRN-006", name: "SPC 교육", type: "직무교육", category: "품질", targetDepartments: ["DEPT-003", "DEPT-004"], duration: 8, frequency: "연1회", description: "통계적공정관리 이론 및 실습", isRequired: false, isActive: true },
  { id: 7, code: "TRN-007", name: "MSA 교육", type: "직무교육", category: "품질", targetDepartments: ["DEPT-003"], duration: 8, frequency: "연1회", description: "측정시스템분석", isRequired: false, isActive: true },
  { id: 8, code: "TRN-008", name: "FMEA 교육", type: "직무교육", category: "품질", targetDepartments: ["DEPT-003", "DEPT-005"], duration: 8, frequency: "연1회", description: "잠재적 고장형태 및 영향분석", isRequired: false, isActive: true },
  { id: 9, code: "TRN-009", name: "검사원 교육", type: "직무교육", category: "품질", targetDepartments: ["DEPT-003"], duration: 16, frequency: "연1회", description: "검사 기준, 계측기 사용법", isRequired: false, isActive: true },
  // 자격교육
  { id: 10, code: "TRN-010", name: "내부심사원 양성교육", type: "자격교육", category: "품질", targetDepartments: ["DEPT-003"], duration: 16, frequency: "수시", description: "내부심사 기법 및 실습", isRequired: false, isActive: true },
  { id: 11, code: "TRN-011", name: "사출기 운전자격", type: "자격교육", category: "기술", targetDepartments: ["DEPT-004"], duration: 24, frequency: "수시", description: "사출기 운전 및 조건설정", isRequired: false, isActive: true },
  { id: 12, code: "TRN-012", name: "도장 작업자격", type: "자격교육", category: "기술", targetDepartments: ["DEPT-004"], duration: 24, frequency: "수시", description: "도장설비 운전 및 품질관리", isRequired: false, isActive: true },
  // 특별교육
  { id: 13, code: "TRN-013", name: "고객클레임 분석교육", type: "특별교육", category: "품질", targetDepartments: ["DEPT-003", "DEPT-004"], duration: 4, frequency: "수시", description: "클레임 발생 시 원인분석", isRequired: false, isActive: true },
  { id: 14, code: "TRN-014", name: "4M 변경관리 교육", type: "특별교육", category: "품질", targetDepartments: ["DEPT-003", "DEPT-004", "DEPT-005"], duration: 4, frequency: "수시", description: "변경점 관리 절차", isRequired: false, isActive: true },
];

export function getTrainingCourses() { return trainingCourses; }
export function getTrainingCourseByCode(code: string) { return trainingCourses.find(t => t.code === code); }
export function getTrainingCoursesByType(type: string) { return trainingCourses.filter(t => t.type === type); }
export function getTrainingCoursesByCategory(category: string) { return trainingCourses.filter(t => t.category === category); }
export function getRequiredTrainingCourses() { return trainingCourses.filter(t => t.isRequired && t.isActive); }
export function getActiveTrainingCourses() { return trainingCourses.filter(t => t.isActive); }

// ============ 공통코드 데이터 ============
export interface CommonCode {
  id: number;
  groupCode: string;
  groupName: string;
  code: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export const commonCodes: CommonCode[] = [
  // 관리주기
  { id: 1, groupCode: "FREQ", groupName: "관리주기", code: "DAILY", name: "일", sortOrder: 1, isActive: true },
  { id: 2, groupCode: "FREQ", groupName: "관리주기", code: "WEEKLY", name: "주", sortOrder: 2, isActive: true },
  { id: 3, groupCode: "FREQ", groupName: "관리주기", code: "MONTHLY", name: "월", sortOrder: 3, isActive: true },
  { id: 4, groupCode: "FREQ", groupName: "관리주기", code: "QUARTERLY", name: "분기", sortOrder: 4, isActive: true },
  { id: 5, groupCode: "FREQ", groupName: "관리주기", code: "SEMIANNUAL", name: "반기", sortOrder: 5, isActive: true },
  { id: 6, groupCode: "FREQ", groupName: "관리주기", code: "YEARLY", name: "년", sortOrder: 6, isActive: true },
  { id: 7, groupCode: "FREQ", groupName: "관리주기", code: "LOT", name: "LOT별", sortOrder: 7, isActive: true },
  { id: 8, groupCode: "FREQ", groupName: "관리주기", code: "EVENT", name: "발생시", sortOrder: 8, isActive: true },
  // 검사유형
  { id: 9, groupCode: "INSP_TYPE", groupName: "검사유형", code: "INCOMING", name: "수입검사", sortOrder: 1, isActive: true },
  { id: 10, groupCode: "INSP_TYPE", groupName: "검사유형", code: "PROCESS", name: "공정검사", sortOrder: 2, isActive: true },
  { id: 11, groupCode: "INSP_TYPE", groupName: "검사유형", code: "FINAL", name: "출하검사", sortOrder: 3, isActive: true },
  { id: 12, groupCode: "INSP_TYPE", groupName: "검사유형", code: "FIRST", name: "초물검사", sortOrder: 4, isActive: true },
  // 판정
  { id: 13, groupCode: "JUDGEMENT", groupName: "판정", code: "PASS", name: "합격", sortOrder: 1, isActive: true },
  { id: 14, groupCode: "JUDGEMENT", groupName: "판정", code: "FAIL", name: "불합격", sortOrder: 2, isActive: true },
  { id: 15, groupCode: "JUDGEMENT", groupName: "판정", code: "COND", name: "조건부합격", sortOrder: 3, isActive: true },
  // 처리상태
  { id: 16, groupCode: "STATUS", groupName: "처리상태", code: "OPEN", name: "진행중", sortOrder: 1, isActive: true },
  { id: 17, groupCode: "STATUS", groupName: "처리상태", code: "CLOSED", name: "완료", sortOrder: 2, isActive: true },
  { id: 18, groupCode: "STATUS", groupName: "처리상태", code: "PENDING", name: "대기", sortOrder: 3, isActive: true },
  { id: 19, groupCode: "STATUS", groupName: "처리상태", code: "CANCEL", name: "취소", sortOrder: 4, isActive: true },
  // 공급자등급
  { id: 20, groupCode: "SUP_GRADE", groupName: "공급자등급", code: "A", name: "A (우수)", sortOrder: 1, isActive: true },
  { id: 21, groupCode: "SUP_GRADE", groupName: "공급자등급", code: "B", name: "B (양호)", sortOrder: 2, isActive: true },
  { id: 22, groupCode: "SUP_GRADE", groupName: "공급자등급", code: "C", name: "C (보통)", sortOrder: 3, isActive: true },
  { id: 23, groupCode: "SUP_GRADE", groupName: "공급자등급", code: "D", name: "D (불량)", sortOrder: 4, isActive: true },
  // 조치유형
  { id: 24, groupCode: "ACTION_TYPE", groupName: "조치유형", code: "USE", name: "사용", sortOrder: 1, isActive: true },
  { id: 25, groupCode: "ACTION_TYPE", groupName: "조치유형", code: "REWORK", name: "재작업", sortOrder: 2, isActive: true },
  { id: 26, groupCode: "ACTION_TYPE", groupName: "조치유형", code: "SCRAP", name: "폐기", sortOrder: 3, isActive: true },
  { id: 27, groupCode: "ACTION_TYPE", groupName: "조치유형", code: "RETURN", name: "반품", sortOrder: 4, isActive: true },
  { id: 28, groupCode: "ACTION_TYPE", groupName: "조치유형", code: "SELECT", name: "선별", sortOrder: 5, isActive: true },
  // 우선순위
  { id: 29, groupCode: "PRIORITY", groupName: "우선순위", code: "HIGH", name: "높음", sortOrder: 1, isActive: true },
  { id: 30, groupCode: "PRIORITY", groupName: "우선순위", code: "MEDIUM", name: "보통", sortOrder: 2, isActive: true },
  { id: 31, groupCode: "PRIORITY", groupName: "우선순위", code: "LOW", name: "낮음", sortOrder: 3, isActive: true },
  // 단위
  { id: 32, groupCode: "UNIT", groupName: "단위", code: "EA", name: "EA", sortOrder: 1, isActive: true },
  { id: 33, groupCode: "UNIT", groupName: "단위", code: "SET", name: "SET", sortOrder: 2, isActive: true },
  { id: 34, groupCode: "UNIT", groupName: "단위", code: "KG", name: "KG", sortOrder: 3, isActive: true },
  { id: 35, groupCode: "UNIT", groupName: "단위", code: "L", name: "L", sortOrder: 4, isActive: true },
  { id: 36, groupCode: "UNIT", groupName: "단위", code: "M", name: "M", sortOrder: 5, isActive: true },
];

export function getCommonCodes() { return commonCodes; }
export function getCommonCodesByGroup(groupCode: string) { return commonCodes.filter(c => c.groupCode === groupCode && c.isActive).sort((a, b) => a.sortOrder - b.sortOrder); }
export function getCommonCodeByGroupAndCode(groupCode: string, code: string) { return commonCodes.find(c => c.groupCode === groupCode && c.code === code); }

// ============ 치공구 데이터 ============
export interface Jig {
  id: number;
  code: string;
  name: string;
  type: string;
  processCode: string;
  processName: string;
  partCode: string | null;
  partName: string | null;
  location: string;
  status: "사용중" | "점검중" | "수리중" | "보관" | "폐기";
  lastInspectionDate: string;
  nextInspectionDate: string;
}

export const jigs: Jig[] = [
  { id: 1, code: "JIG-001", name: "범퍼FR 검사지그", type: "검사지그", processCode: "PRC-007", processName: "최종검사", partCode: "P-001", partName: "범퍼 커버 FR", location: "검사라인", status: "사용중", lastInspectionDate: "2025-01-15", nextInspectionDate: "2025-04-15" },
  { id: 2, code: "JIG-002", name: "범퍼RR 검사지그", type: "검사지그", processCode: "PRC-007", processName: "최종검사", partCode: "P-002", partName: "범퍼 커버 RR", location: "검사라인", status: "사용중", lastInspectionDate: "2025-01-15", nextInspectionDate: "2025-04-15" },
  { id: 3, code: "JIG-003", name: "그릴 조립지그", type: "조립지그", processCode: "PRC-006", processName: "조립공정", partCode: "P-003", partName: "라디에이터 그릴", location: "조립라인", status: "사용중", lastInspectionDate: "2025-02-01", nextInspectionDate: "2025-05-01" },
  { id: 4, code: "JIG-004", name: "미러커버 도장지그", type: "도장지그", processCode: "PRC-003", processName: "프라이머도장", partCode: "P-004", partName: "사이드 미러 커버 LH", location: "도장라인", status: "사용중", lastInspectionDate: "2025-01-20", nextInspectionDate: "2025-04-20" },
  { id: 5, code: "JIG-005", name: "도어핸들 조립지그", type: "조립지그", processCode: "PRC-006", processName: "조립공정", partCode: "P-006", partName: "도어 핸들 FR LH", location: "조립라인", status: "점검중", lastInspectionDate: "2025-02-10", nextInspectionDate: "2025-05-10" },
];

export function getJigs() { return jigs; }
export function getJigByCode(code: string) { return jigs.find(j => j.code === code); }
export function getJigsByProcess(processCode: string) { return jigs.filter(j => j.processCode === processCode); }
export function getActiveJigs() { return jigs.filter(j => j.status === "사용중"); }

// ============ 라인 데이터 (설비에서 추출) ============
export function getProductionLines() {
  return [...new Set(equipments.map(e => e.line))];
}

// ============ 도면 데이터 ============
export interface Drawing {
  id: number;
  code: string;           // 도면번호
  partCode: string;       // 품번 연결
  partName: string;       // 품명
  customerCode: string;   // 고객사 코드
  customerName: string;   // 고객사명
  revisionNo: string;     // 개정번호 A, B, C...
  revisionDate: string;   // 개정일
  revisionContent: string; // 개정내용
  fileType: "2D CAD" | "3D CAD" | "PDF" | "기타";
  filePath: string;       // 파일경로
  status: "최신" | "구버전" | "폐기";
  approver: string;       // 승인자
  approvalDate: string;   // 승인일
  isActive: boolean;
}

export const drawings: Drawing[] = [
  { id: 1, code: "DWG-001", partCode: "P-001", partName: "범퍼 커버 FR", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "C", revisionDate: "2025-03-15", revisionContent: "도장 사양 변경", fileType: "2D CAD", filePath: "/drawings/DWG-001-C.dwg", status: "최신", approver: "박품질", approvalDate: "2025-03-16", isActive: true },
  { id: 2, code: "DWG-002", partCode: "P-002", partName: "범퍼 커버 RR", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "B", revisionDate: "2025-02-20", revisionContent: "체결부 치수 변경", fileType: "2D CAD", filePath: "/drawings/DWG-002-B.dwg", status: "최신", approver: "박품질", approvalDate: "2025-02-21", isActive: true },
  { id: 3, code: "DWG-003", partCode: "P-003", partName: "라디에이터 그릴", customerCode: "CUS-002", customerName: "기아자동차", revisionNo: "A", revisionDate: "2024-11-10", revisionContent: "초도 작성", fileType: "3D CAD", filePath: "/drawings/DWG-003-A.stp", status: "최신", approver: "정기술", approvalDate: "2024-11-11", isActive: true },
  { id: 4, code: "DWG-004", partCode: "P-004", partName: "사이드 미러 커버 LH", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "D", revisionDate: "2025-04-05", revisionContent: "외형 R값 변경", fileType: "2D CAD", filePath: "/drawings/DWG-004-D.dwg", status: "최신", approver: "정기술", approvalDate: "2025-04-06", isActive: true },
  { id: 5, code: "DWG-005", partCode: "P-005", partName: "사이드 미러 커버 RH", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "D", revisionDate: "2025-04-05", revisionContent: "외형 R값 변경 (LH 대칭)", fileType: "2D CAD", filePath: "/drawings/DWG-005-D.dwg", status: "최신", approver: "정기술", approvalDate: "2025-04-06", isActive: true },
  { id: 6, code: "DWG-006", partCode: "P-006", partName: "도어 핸들 FR LH", customerCode: "CUS-002", customerName: "기아자동차", revisionNo: "B", revisionDate: "2025-01-18", revisionContent: "도금 두께 규격 변경", fileType: "2D CAD", filePath: "/drawings/DWG-006-B.dwg", status: "최신", approver: "박품질", approvalDate: "2025-01-19", isActive: true },
  { id: 7, code: "DWG-007", partCode: "P-007", partName: "도어 핸들 FR RH", customerCode: "CUS-002", customerName: "기아자동차", revisionNo: "B", revisionDate: "2025-01-18", revisionContent: "도금 두께 규격 변경 (LH 대칭)", fileType: "2D CAD", filePath: "/drawings/DWG-007-B.dwg", status: "최신", approver: "박품질", approvalDate: "2025-01-19", isActive: true },
  { id: 8, code: "DWG-008", partCode: "P-008", partName: "센터페시아 어셈블리", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "A", revisionDate: "2024-09-20", revisionContent: "초도 작성", fileType: "3D CAD", filePath: "/drawings/DWG-008-A.stp", status: "최신", approver: "정기술", approvalDate: "2024-09-21", isActive: true },
  // 구버전 도면
  { id: 9, code: "DWG-001", partCode: "P-001", partName: "범퍼 커버 FR", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "B", revisionDate: "2024-12-10", revisionContent: "체결부 강도 보강", fileType: "2D CAD", filePath: "/drawings/DWG-001-B.dwg", status: "구버전", approver: "박품질", approvalDate: "2024-12-11", isActive: false },
  { id: 10, code: "DWG-001", partCode: "P-001", partName: "범퍼 커버 FR", customerCode: "CUS-001", customerName: "현대자동차", revisionNo: "A", revisionDate: "2024-06-15", revisionContent: "초도 작성", fileType: "2D CAD", filePath: "/drawings/DWG-001-A.dwg", status: "구버전", approver: "정기술", approvalDate: "2024-06-16", isActive: false },
];

export function getDrawings() { return drawings; }
export function getDrawingByCode(code: string) { return drawings.find(d => d.code === code && d.status === "최신"); }
export function getActiveDrawings() { return drawings.filter(d => d.isActive && d.status === "최신"); }
export function getDrawingsByPart(partCode: string) { return drawings.filter(d => d.partCode === partCode); }
export function getLatestDrawingByPart(partCode: string) { return drawings.find(d => d.partCode === partCode && d.status === "최신"); }
export function getDrawingRevisionHistory(code: string) { return drawings.filter(d => d.code === code).sort((a, b) => b.revisionNo.localeCompare(a.revisionNo)); }
