# IATF 16949 품질관리시스템 데이터베이스 설계

## 1. 시스템 개요

### 목적
- 118개 IATF 16949 관리항목의 온라인화
- 일자별/주기별 기록 관리
- 임베디드 양식들의 디지털화

### 기술 스택
- Frontend: Next.js 14 (App Router)
- Backend: Next.js API Routes
- Database: PostgreSQL (Railway)
- ORM: Prisma
- Auth: NextAuth.js
- UI: Tailwind CSS + shadcn/ui

---

## 2. 핵심 엔티티 분류

### 2.1 마스터 데이터 (기준정보)
```
- 부서 (departments)
- 사용자/직원 (users)
- 프로세스/절차서 (processes)
- 관리항목 (control_items)
- 차종 (vehicle_models)
- 부품 (parts)
- 설비 (equipment)
- 금형 (molds)
- 지그 (jigs)
- 계측기 (measuring_instruments)
- 공급자/협력사 (suppliers)
```

### 2.2 기록 데이터 (일상 관리)
```
- 점검기록 (inspection_records)
- 교육기록 (training_records)
- 심사기록 (audit_records)
- 부적합기록 (nonconformance_records)
- 시정조치 (corrective_actions)
- 시험성적 (test_results)
- 계측기교정 (calibration_records)
- 설비보전 (maintenance_records)
```

### 2.3 평가/분석 데이터
```
- KPI 성과지표 (kpi_metrics)
- 자격인증평가 (qualification_assessments)
- 공급자평가 (supplier_assessments)
- Gage R&R (gage_rnr_studies)
- 공정능력 (process_capabilities)
```

---

## 3. 상세 테이블 설계

### 3.1 기준정보 테이블

```sql
-- 부서
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  parent_id INTEGER REFERENCES departments(id),
  manager_id INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 사용자
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  department_id INTEGER REFERENCES departments(id),
  position VARCHAR(50),
  role VARCHAR(20) DEFAULT 'user', -- admin, manager, user
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 프로세스/절차서
CREATE TABLE processes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50), -- 품질, 생산, 구매, 개발 등
  document_no VARCHAR(50),
  revision VARCHAR(10),
  effective_date DATE,
  owner_dept_id INTEGER REFERENCES departments(id),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 관리항목 (118개 항목)
CREATE TABLE control_items (
  id SERIAL PRIMARY KEY,
  item_no INTEGER NOT NULL,
  process_id INTEGER REFERENCES processes(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  frequency VARCHAR(20), -- 일, 주, 월, 분기, 반기, 년, 발생시
  frequency_days INTEGER, -- 주기를 일수로 환산
  target_dept_id INTEGER REFERENCES departments(id),
  responsible_dept_id INTEGER REFERENCES departments(id),
  responsible_user_id INTEGER REFERENCES users(id),
  form_type VARCHAR(50), -- 점검표, 보고서, 대장, 성적서 등
  requires_attachment BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 차종
CREATE TABLE vehicle_models (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  customer VARCHAR(50), -- 현대, 기아 등
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 부품
CREATE TABLE parts (
  id SERIAL PRIMARY KEY,
  part_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  vehicle_model_id INTEGER REFERENCES vehicle_models(id),
  category VARCHAR(50), -- 사출, 도장, 조립 등
  material VARCHAR(100),
  color VARCHAR(50),
  supplier_id INTEGER REFERENCES suppliers(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 설비
CREATE TABLE equipment (
  id SERIAL PRIMARY KEY,
  asset_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50), -- 사출기, 도장설비, 조립설비 등
  location VARCHAR(100),
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  install_date DATE,
  department_id INTEGER REFERENCES departments(id),
  status VARCHAR(20) DEFAULT 'active', -- active, maintenance, inactive
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 금형
CREATE TABLE molds (
  id SERIAL PRIMARY KEY,
  mold_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  part_id INTEGER REFERENCES parts(id),
  cavity_count INTEGER,
  storage_location VARCHAR(100),
  owner VARCHAR(50), -- 자사, 고객사
  status VARCHAR(20) DEFAULT 'active',
  last_maintenance_date DATE,
  shot_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 지그
CREATE TABLE jigs (
  id SERIAL PRIMARY KEY,
  jig_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50), -- 도장지그, 조립지그, 검사지그
  process VARCHAR(50),
  part_id INTEGER REFERENCES parts(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 계측기
CREATE TABLE measuring_instruments (
  id SERIAL PRIMARY KEY,
  instrument_no VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50), -- 버니어, 갭자, 다이얼, 푸쉬풀 등
  range VARCHAR(50),
  resolution VARCHAR(20),
  department_id INTEGER REFERENCES departments(id),
  location VARCHAR(100),
  calibration_cycle INTEGER, -- 교정주기(월)
  last_calibration_date DATE,
  next_calibration_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 공급자/협력사
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20), -- 1차, 2차, 외주
  business_no VARCHAR(20),
  address TEXT,
  contact_name VARCHAR(50),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  grade VARCHAR(10), -- A, B, C, D
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 일상 점검/기록 테이블

```sql
-- 일반 점검기록 (다목적)
CREATE TABLE inspection_records (
  id SERIAL PRIMARY KEY,
  control_item_id INTEGER REFERENCES control_items(id),
  inspection_type VARCHAR(50), -- 일상, 정기, 특별
  inspection_date DATE NOT NULL,
  shift VARCHAR(10), -- A조, B조, C조
  
  -- 점검 대상 (다형성)
  target_type VARCHAR(50), -- equipment, mold, jig, part 등
  target_id INTEGER,
  
  inspector_id INTEGER REFERENCES users(id),
  result VARCHAR(20), -- 합격, 불합격, 조건부
  score DECIMAL(5,2),
  
  findings TEXT,
  attachments JSONB, -- 첨부파일 정보
  
  verified_by INTEGER REFERENCES users(id),
  verified_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 점검 상세항목 (체크리스트)
CREATE TABLE inspection_details (
  id SERIAL PRIMARY KEY,
  inspection_id INTEGER REFERENCES inspection_records(id),
  check_item VARCHAR(200) NOT NULL,
  standard VARCHAR(200),
  method VARCHAR(100),
  measured_value VARCHAR(100),
  result VARCHAR(20), -- OK, NG, NA
  remarks TEXT,
  seq_no INTEGER
);

-- 설비 일상점검
CREATE TABLE equipment_daily_checks (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id) NOT NULL,
  check_date DATE NOT NULL,
  shift VARCHAR(10),
  checker_id INTEGER REFERENCES users(id),
  
  -- 공통 점검항목
  appearance VARCHAR(10), -- OK, NG
  abnormal_sound VARCHAR(10),
  abnormal_vibration VARCHAR(10),
  oil_level VARCHAR(10),
  air_pressure VARCHAR(10),
  temperature DECIMAL(5,1),
  
  overall_status VARCHAR(20), -- 정상, 이상, 수리필요
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(equipment_id, check_date, shift)
);

-- 설비 예방보전
CREATE TABLE maintenance_records (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER REFERENCES equipment(id),
  maintenance_type VARCHAR(20), -- 예방, 사후, 개량
  plan_date DATE,
  actual_date DATE,
  
  work_description TEXT,
  parts_replaced JSONB,
  downtime_hours DECIMAL(5,1),
  cost DECIMAL(12,2),
  
  performed_by INTEGER REFERENCES users(id),
  verified_by INTEGER REFERENCES users(id),
  
  next_maintenance_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 금형 점검/보수
CREATE TABLE mold_records (
  id SERIAL PRIMARY KEY,
  mold_id INTEGER REFERENCES molds(id) NOT NULL,
  record_type VARCHAR(20), -- 일상점검, 습합, 세척, 보수
  record_date DATE NOT NULL,
  
  -- 일상점검 항목
  parting_line VARCHAR(10),
  ejector_pin VARCHAR(10),
  cooling_channel VARCHAR(10),
  guide_pin VARCHAR(10),
  
  -- 보수 내역
  issue_description TEXT,
  repair_action TEXT,
  parts_replaced TEXT,
  
  shot_count_at_check INTEGER,
  performer_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 지그 점검
CREATE TABLE jig_records (
  id SERIAL PRIMARY KEY,
  jig_id INTEGER REFERENCES jigs(id) NOT NULL,
  record_type VARCHAR(20), -- 일상점검, 정도검증, 박리(도장)
  record_date DATE NOT NULL,
  
  status VARCHAR(20), -- 정상, 이상, 수리필요
  measured_values JSONB, -- 측정값들
  
  remarks TEXT,
  performer_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 계측기 교정
CREATE TABLE calibration_records (
  id SERIAL PRIMARY KEY,
  instrument_id INTEGER REFERENCES measuring_instruments(id) NOT NULL,
  calibration_date DATE NOT NULL,
  calibration_type VARCHAR(20), -- 사내, 외부
  calibrator VARCHAR(100), -- 교정기관/담당자
  
  standard_used VARCHAR(200),
  result VARCHAR(20), -- 합격, 불합격, 조건부
  
  -- 교정 데이터
  before_values JSONB,
  after_values JSONB,
  uncertainty DECIMAL(10,6),
  
  certificate_no VARCHAR(50),
  certificate_file VARCHAR(255),
  
  next_calibration_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 초중종물 검사
CREATE TABLE production_inspections (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id) NOT NULL,
  production_date DATE NOT NULL,
  shift VARCHAR(10),
  lot_no VARCHAR(50),
  
  inspection_type VARCHAR(10), -- 초물, 중물, 종물
  inspection_time TIME,
  
  inspector_id INTEGER REFERENCES users(id),
  
  -- 검사 결과
  visual_check VARCHAR(10),
  dimension_check VARCHAR(10),
  function_check VARCHAR(10),
  
  measured_values JSONB, -- 측정값 상세
  result VARCHAR(20), -- 합격, 불합격
  
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 수입검사
CREATE TABLE incoming_inspections (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id),
  part_id INTEGER REFERENCES parts(id),
  receiving_date DATE NOT NULL,
  lot_no VARCHAR(50),
  quantity INTEGER,
  
  inspection_type VARCHAR(20), -- 전수, 샘플링, 무검사
  sample_size INTEGER,
  
  inspector_id INTEGER REFERENCES users(id),
  
  -- 검사 결과
  visual_result VARCHAR(10),
  dimension_result VARCHAR(10),
  material_result VARCHAR(10), -- Mill Sheet 확인
  
  defect_qty INTEGER DEFAULT 0,
  defect_rate DECIMAL(5,2),
  
  overall_result VARCHAR(20),
  disposition VARCHAR(20), -- 합격입고, 반품, 특채
  
  supplier_cert_no VARCHAR(50), -- 공급자 성적서 번호
  
  remarks TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 완제품 출하검사
CREATE TABLE shipping_inspections (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id) NOT NULL,
  shipping_date DATE NOT NULL,
  lot_no VARCHAR(50),
  quantity INTEGER,
  destination VARCHAR(100), -- 납품처
  
  inspector_id INTEGER REFERENCES users(id),
  
  -- 검사 항목
  visual_check VARCHAR(10),
  dimension_check VARCHAR(10),
  packaging_check VARCHAR(10),
  label_check VARCHAR(10),
  
  result VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 품질 시험/평가 테이블

```sql
-- 신뢰성 시험
CREATE TABLE reliability_tests (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id) NOT NULL,
  test_type VARCHAR(50), -- 내후성, 내열성, 내약품성, 부착성 등
  test_date DATE NOT NULL,
  
  test_standard VARCHAR(100),
  test_conditions JSONB,
  
  sample_qty INTEGER,
  test_duration VARCHAR(50),
  
  result VARCHAR(20),
  measured_values JSONB,
  
  tester_id INTEGER REFERENCES users(id),
  report_no VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 부착성 시험 (월별)
CREATE TABLE adhesion_tests (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id) NOT NULL,
  test_date DATE NOT NULL,
  color VARCHAR(50),
  
  -- 측정위치별 결과 (1차, 2차)
  position1_grade VARCHAR(10),
  position1_result VARCHAR(10),
  position2_grade VARCHAR(10),
  position2_result VARCHAR(10),
  
  overall_result VARCHAR(20),
  tester_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 색차 측정
CREATE TABLE color_measurements (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id) NOT NULL,
  measurement_date DATE NOT NULL,
  lot_no VARCHAR(50),
  color VARCHAR(50),
  
  -- 색차값
  delta_l DECIMAL(6,3),
  delta_a DECIMAL(6,3),
  delta_b DECIMAL(6,3),
  delta_e DECIMAL(6,3),
  
  standard_plate_no VARCHAR(50),
  result VARCHAR(20), -- 합격, 불합격
  
  measurer_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 도막두께 측정
CREATE TABLE coating_thickness (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id) NOT NULL,
  measurement_date DATE NOT NULL,
  color VARCHAR(50),
  
  -- 측정위치별 두께 (μm)
  position1 DECIMAL(6,1),
  position2 DECIMAL(6,1),
  position3 DECIMAL(6,1),
  position4 DECIMAL(6,1),
  position5 DECIMAL(6,1),
  
  average_thickness DECIMAL(6,1),
  spec_min DECIMAL(6,1),
  spec_max DECIMAL(6,1),
  
  result VARCHAR(20),
  measurer_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gage R&R 분석
CREATE TABLE gage_rnr_studies (
  id SERIAL PRIMARY KEY,
  instrument_id INTEGER REFERENCES measuring_instruments(id),
  study_date DATE NOT NULL,
  study_type VARCHAR(20), -- 계량형, 계수형
  
  part_id INTEGER REFERENCES parts(id),
  characteristic VARCHAR(100), -- 측정 특성
  specification DECIMAL(10,4),
  tolerance DECIMAL(10,4),
  
  -- 측정자 정보
  appraiser_count INTEGER,
  trial_count INTEGER,
  part_count INTEGER,
  
  -- 분석 결과
  repeatability DECIMAL(6,2),
  reproducibility DECIMAL(6,2),
  gage_rnr DECIMAL(6,2),
  part_variation DECIMAL(6,2),
  ndc INTEGER, -- Number of Distinct Categories
  
  result VARCHAR(20), -- 합격, 불합격, 조건부
  raw_data JSONB,
  
  analyst_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 공정능력 분석
CREATE TABLE process_capabilities (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id),
  process VARCHAR(100),
  characteristic VARCHAR(100),
  
  analysis_date DATE NOT NULL,
  sample_size INTEGER,
  
  -- 규격
  usl DECIMAL(10,4),
  lsl DECIMAL(10,4),
  target DECIMAL(10,4),
  
  -- 통계값
  mean DECIMAL(10,4),
  std_dev DECIMAL(10,6),
  
  -- 공정능력지수
  cp DECIMAL(6,3),
  cpk DECIMAL(6,3),
  pp DECIMAL(6,3),
  ppk DECIMAL(6,3),
  
  result VARCHAR(20),
  raw_data JSONB,
  
  analyst_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.4 교육/자격 테이블

```sql
-- 교육계획
CREATE TABLE training_plans (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  training_name VARCHAR(200) NOT NULL,
  category VARCHAR(50), -- 품질, 안전, 직무, 법정 등
  target_dept_id INTEGER REFERENCES departments(id),
  
  plan_date DATE,
  actual_date DATE,
  
  duration_hours DECIMAL(4,1),
  instructor VARCHAR(100),
  location VARCHAR(100),
  
  status VARCHAR(20), -- 계획, 진행중, 완료, 취소
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 교육실적 (개인별)
CREATE TABLE training_records (
  id SERIAL PRIMARY KEY,
  training_plan_id INTEGER REFERENCES training_plans(id),
  user_id INTEGER REFERENCES users(id) NOT NULL,
  
  attendance VARCHAR(10), -- 참석, 불참, 지각
  completion_status VARCHAR(20), -- 수료, 미수료
  score DECIMAL(5,2),
  
  certificate_no VARCHAR(50),
  certificate_file VARCHAR(255),
  
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 자격인증 기준
CREATE TABLE qualification_standards (
  id SERIAL PRIMARY KEY,
  job_type VARCHAR(50) NOT NULL, -- 수입검사, 출하검사, 내부심사원 등
  
  required_experience_months INTEGER,
  evaluation_criteria JSONB, -- 평가항목 및 배점
  passing_score DECIMAL(5,2),
  
  validity_months INTEGER, -- 유효기간(월)
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 자격인증 평가
CREATE TABLE qualification_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  standard_id INTEGER REFERENCES qualification_standards(id),
  
  assessment_date DATE NOT NULL,
  
  -- 평가자들
  evaluator1_id INTEGER REFERENCES users(id),
  evaluator2_id INTEGER REFERENCES users(id),
  evaluator3_id INTEGER REFERENCES users(id),
  
  -- 평가 점수
  scores JSONB, -- 항목별 점수
  total_score DECIMAL(5,2),
  
  result VARCHAR(20), -- 합격, 불합격
  valid_until DATE,
  
  certificate_no VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.5 부적합/시정조치 테이블

```sql
-- 부적합 관리
CREATE TABLE nonconformances (
  id SERIAL PRIMARY KEY,
  nc_no VARCHAR(20) UNIQUE NOT NULL,
  
  source VARCHAR(20), -- 내부, 고객, 공급자
  detection_point VARCHAR(50), -- 수입, 공정, 출하, 필드
  
  occurrence_date DATE NOT NULL,
  detection_date DATE,
  
  part_id INTEGER REFERENCES parts(id),
  lot_no VARCHAR(50),
  defect_qty INTEGER,
  
  defect_type VARCHAR(50),
  defect_description TEXT,
  
  immediate_action TEXT, -- 긴급대책
  containment_action TEXT, -- 봉쇄조치
  
  disposition VARCHAR(20), -- 폐기, 수리, 특채, 반품
  disposition_qty INTEGER,
  
  reporter_id INTEGER REFERENCES users(id),
  responsible_dept_id INTEGER REFERENCES departments(id),
  
  status VARCHAR(20), -- 발생, 분석중, 조치중, 완료
  
  attachments JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 시정조치 (8D 기반)
CREATE TABLE corrective_actions (
  id SERIAL PRIMARY KEY,
  car_no VARCHAR(20) UNIQUE NOT NULL,
  nonconformance_id INTEGER REFERENCES nonconformances(id),
  
  -- D1: 팀 구성
  team_leader_id INTEGER REFERENCES users(id),
  team_members JSONB,
  
  -- D2: 문제 정의
  problem_description TEXT,
  
  -- D3: 임시조치
  interim_action TEXT,
  interim_action_date DATE,
  
  -- D4: 근본원인 분석
  root_cause_analysis TEXT, -- 5Why, 특성요인도 등
  root_causes JSONB,
  
  -- D5: 시정조치 선정
  corrective_actions JSONB,
  
  -- D6: 시정조치 실행
  implementation_date DATE,
  implementation_details TEXT,
  
  -- D7: 재발방지
  preventive_actions JSONB,
  horizontal_deployment TEXT,
  
  -- D8: 완료 확인
  verification_date DATE,
  verification_result TEXT,
  verified_by INTEGER REFERENCES users(id),
  
  target_date DATE,
  completion_date DATE,
  status VARCHAR(20), -- 진행중, 완료, 지연
  
  effectiveness_check_date DATE,
  effectiveness_result VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3.6 내부심사 테이블

```sql
-- 내부심사 계획
CREATE TABLE audit_plans (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  audit_type VARCHAR(20), -- 시스템, 공정, 제품
  
  plan_date DATE,
  
  lead_auditor_id INTEGER REFERENCES users(id),
  auditors JSONB,
  
  target_departments JSONB,
  audit_scope TEXT,
  
  status VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 내부심사 실적
CREATE TABLE audit_records (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES audit_plans(id),
  
  audit_date DATE NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  process_id INTEGER REFERENCES processes(id),
  
  checklist_used VARCHAR(100),
  
  -- 심사 결과
  findings_count INTEGER DEFAULT 0,
  nc_major INTEGER DEFAULT 0,
  nc_minor INTEGER DEFAULT 0,
  observations INTEGER DEFAULT 0,
  
  overall_result VARCHAR(20),
  
  auditor_id INTEGER REFERENCES users(id),
  auditee_id INTEGER REFERENCES users(id),
  
  summary TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 심사 발견사항
CREATE TABLE audit_findings (
  id SERIAL PRIMARY KEY,
  audit_id INTEGER REFERENCES audit_records(id),
  
  finding_no INTEGER,
  finding_type VARCHAR(20), -- 중부적합, 경부적합, 관찰사항
  
  clause_reference VARCHAR(50), -- IATF 조항
  requirement TEXT,
  evidence TEXT,
  
  corrective_action_id INTEGER REFERENCES corrective_actions(id),
  
  status VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.7 KPI/성과지표 테이블

```sql
-- KPI 정의
CREATE TABLE kpi_definitions (
  id SERIAL PRIMARY KEY,
  process_id INTEGER REFERENCES processes(id),
  
  kpi_name VARCHAR(200) NOT NULL,
  calculation_method TEXT,
  unit VARCHAR(20),
  
  target_value DECIMAL(10,2),
  target_direction VARCHAR(10), -- 상향, 하향, 범위
  
  frequency VARCHAR(20), -- 일, 주, 월, 분기
  responsible_dept_id INTEGER REFERENCES departments(id),
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- KPI 실적
CREATE TABLE kpi_results (
  id SERIAL PRIMARY KEY,
  kpi_id INTEGER REFERENCES kpi_definitions(id),
  
  period_year INTEGER NOT NULL,
  period_month INTEGER,
  period_week INTEGER,
  
  target_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  achievement_rate DECIMAL(6,2),
  
  status VARCHAR(20), -- 달성, 미달성
  
  remarks TEXT,
  action_required TEXT, -- 미달성시 대책
  
  recorded_by INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.8 비상사태 관리 테이블

```sql
-- 비상사태 유형
CREATE TABLE emergency_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  response_procedure TEXT,
  responsible_dept_id INTEGER REFERENCES departments(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 비상대응 훈련
CREATE TABLE emergency_drills (
  id SERIAL PRIMARY KEY,
  emergency_type_id INTEGER REFERENCES emergency_types(id),
  
  plan_date DATE,
  actual_date DATE,
  
  scenario TEXT,
  participants JSONB,
  
  -- 훈련 결과
  response_time INTEGER, -- 분
  effectiveness VARCHAR(20), -- 효과적, 보통, 미흡
  
  findings TEXT,
  improvements TEXT,
  
  conducted_by INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.9 공급자 관리 테이블

```sql
-- 공급자 평가
CREATE TABLE supplier_evaluations (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
  
  evaluation_year INTEGER NOT NULL,
  evaluation_type VARCHAR(20), -- 정기, 수시, 신규
  evaluation_date DATE,
  
  -- 평가 항목별 점수
  quality_score DECIMAL(5,2), -- 품질
  delivery_score DECIMAL(5,2), -- 납기
  cost_score DECIMAL(5,2), -- 가격
  service_score DECIMAL(5,2), -- 서비스
  
  total_score DECIMAL(5,2),
  grade VARCHAR(10), -- A, B, C, D
  
  improvement_required TEXT,
  
  evaluator_id INTEGER REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 공급자 인도성과
CREATE TABLE supplier_delivery_performance (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
  
  year_month VARCHAR(7) NOT NULL, -- YYYY-MM
  
  order_count INTEGER,
  on_time_count INTEGER,
  late_count INTEGER,
  
  on_time_rate DECIMAL(5,2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(supplier_id, year_month)
);

-- 공급자 품질성과
CREATE TABLE supplier_quality_performance (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id) NOT NULL,
  
  year_month VARCHAR(7) NOT NULL,
  
  received_qty INTEGER,
  defect_qty INTEGER,
  defect_rate DECIMAL(6,4),
  
  nc_count INTEGER, -- 부적합 건수
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(supplier_id, year_month)
);
```

### 3.10 첨부파일/문서 관리

```sql
-- 첨부파일
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  
  entity_type VARCHAR(50) NOT NULL, -- 어느 테이블의 첨부인지
  entity_id INTEGER NOT NULL,
  
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 알림/리마인더
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  
  reminder_type VARCHAR(50), -- 점검예정, 교정만료, 심사예정 등
  target_date DATE,
  
  entity_type VARCHAR(50),
  entity_id INTEGER,
  
  recipient_id INTEGER REFERENCES users(id),
  message TEXT,
  
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 감사로그
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50), -- CREATE, UPDATE, DELETE, LOGIN
  
  entity_type VARCHAR(50),
  entity_id INTEGER,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address VARCHAR(50),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. 주요 기능 모듈

### 4.1 대시보드
- 오늘의 할 일 (점검 예정 항목)
- KPI 현황
- 부적합 현황
- 만료 예정 알림 (교정, 자격인증 등)

### 4.2 일상관리
- 설비 일상점검
- 금형 점검/보수
- 초중종물 검사
- 생산검사 기록

### 4.3 품질관리
- 수입검사
- 출하검사
- 신뢰성 시험
- 색차/도막 관리
- 부적합 관리
- 시정조치

### 4.4 계측관리
- 계측기 대장
- 교정 계획/실적
- Gage R&R

### 4.5 설비/금형/지그 관리
- 설비 예방보전
- MTBF/MTTR 분석
- 금형 이력관리
- 지그 정도검증

### 4.6 교육/자격
- 교육 계획/실적
- 자격인증 평가
- 개인별 교육이력

### 4.7 내부심사
- 심사 계획
- 체크리스트
- 발견사항/시정조치

### 4.8 공급자관리
- 공급자 대장
- 평가 계획/실적
- 인도/품질 성과

### 4.9 KPI/성과지표
- KPI 정의
- 월별 실적 입력
- 대시보드/리포트

### 4.10 비상사태
- 비상유형 관리
- 훈련 계획/실적

---

## 5. 관리항목 매핑 (118개)

| NO | 프로세스 | 관리항목 | 모듈 | 테이블 |
|----|---------|---------|------|--------|
| 1 | IATF16949 | IATF 변경사항 점검 | 시스템설정 | control_items |
| 2 | CSR 변경 | CSR 업데이트 관리 | 시스템설정 | control_items |
| 3-8 | 사업계획 | 매출/영업이익 달성율 | KPI | kpi_results |
| 9 | 경영검토 | 경영검토 보고서 | 경영검토 | audit_records |
| 10-13 | 리스크관리 | 리스크 평가 | 리스크 | risk_assessments |
| 14-16 | 지속적개선 | KPI 성과지표 | KPI | kpi_results |
| 17-19 | 고객만족 | 설문조사/불만관리 | 고객 | customer_surveys |
| 20-29 | 인적자원 | 교육/자격인증 | 교육 | training_*, qualification_* |
| 32-35 | 영업관리 | 수주/업체선정 | 영업 | contracts |
| 36-43 | 생산관리 | 관리계획서/FMEA/F-Proof | 생산 | production_* |
| 44-53 | 설비보전 | 일상점검/예방보전 | 설비 | equipment_*, maintenance_* |
| 54-60 | 금형/지그 | 금형/지그 관리 | 금형/지그 | mold_*, jig_* |
| 61-65 | 개발/변경 | 도면/4M변경 | 개발 | change_* |
| 66-68 | 부적합 | 부적합/시정조치 | 품질 | nonconformances, corrective_actions |
| 69-77 | 구매 | 공급자 관리 | 구매 | supplier_* |
| 78-96 | 검사업무 | 초중종/정기검사/색차 | 검사 | *_inspections, color_*, adhesion_* |
| 97-104 | 계측/시험 | 계측기/Gage R&R | 계측 | measuring_*, calibration_*, gage_* |
| 105-107 | 시험실 | 신뢰성시험 | 시험 | reliability_tests |
| 108-109 | 포장 | 납입용기 | 포장 | packaging_* |
| 110-119 | 비상사태 | 비상훈련 | 비상 | emergency_* |
| 120-121 | 3정5행 | 3정5행 평가 | 현장관리 | workplace_* |

---

## 6. 다음 단계

1. Next.js 프로젝트 생성
2. Prisma 스키마 작성
3. Railway PostgreSQL 연결
4. 인증 시스템 구현
5. 핵심 CRUD 구현
6. 대시보드 구현
7. 점진적 모듈 추가
