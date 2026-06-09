# IATF 16949 품질관리시스템 API Reference

## 개요

외부 시스템(ERP, MES, 모바일 앱, 협력사 포털)에서 품질관리시스템과 연동하기 위한 REST API입니다.

### Base URL
```
Production: https://qms.cams.co.kr/api/v1
Development: http://localhost:3000/api/v1
```

### 인증

모든 API 요청에는 API Key가 필요합니다.

```bash
# Header 방식 (권장)
curl -H "X-API-Key: your-api-key" https://qms.cams.co.kr/api/v1/inspections

# Query Parameter 방식
curl https://qms.cams.co.kr/api/v1/inspections?api_key=your-api-key
```

### API Key 유형

| 유형 | 용도 | 권한 |
|------|------|------|
| ERP | 전사 ERP 시스템 연동 | 전체 읽기, 생산/재고 쓰기 |
| MES | 생산관리시스템 연동 | 설비/검사 읽기쓰기 |
| Mobile | 모바일 앱 (현장 점검) | 전체 읽기, 점검/검사 쓰기 |
| Supplier | 협력사 포털 | 자사 데이터만 읽기/쓰기 |

### 응답 형식

```json
// 성공
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-06-09T10:30:00.000Z"
}

// 실패
{
  "success": false,
  "error": {
    "message": "Invalid API key",
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2026-06-09T10:30:00.000Z"
}
```

---

## 검사 API

### 검사 기록 조회

```
GET /api/v1/inspections
```

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| type | string | N | production, incoming, shipping |
| date | string | N | 검사일자 (YYYY-MM-DD) |
| partNo | string | N | 부품번호 (부분 일치) |
| limit | number | N | 조회 개수 (기본 50) |
| offset | number | N | 시작 위치 |

**예시**

```bash
# 오늘 생산검사 조회
curl -H "X-API-Key: mes-key" \
  "https://qms.cams.co.kr/api/v1/inspections?type=production&date=2026-06-09"

# 특정 부품 수입검사 조회
curl -H "X-API-Key: erp-key" \
  "https://qms.cams.co.kr/api/v1/inspections?type=incoming&partNo=86501"
```

**응답**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "part": { "partNo": "86501-P1000", "name": "FR BUMPER ASSY" },
        "productionDate": "2026-06-09",
        "shift": "A",
        "lotNo": "LOT-001",
        "inspectionType": "초물",
        "inspector": { "name": "김철수" },
        "visualCheck": "OK",
        "dimensionCheck": "OK",
        "functionCheck": "OK",
        "result": "합격"
      }
    ],
    "pagination": { "total": 45, "limit": 50, "offset": 0 }
  }
}
```

### 검사 기록 생성

```
POST /api/v1/inspections
```

**Body (생산검사)**

```json
{
  "type": "production",
  "partNo": "86501-P1000",
  "productionDate": "2026-06-09",
  "shift": "A",
  "lotNo": "LOT-001",
  "inspectionType": "초물",
  "inspectorId": "EMP001",
  "results": {
    "visual": "OK",
    "dimension": "OK",
    "function": "OK"
  },
  "measuredValues": {
    "length": 1250.5,
    "width": 450.2
  },
  "remarks": ""
}
```

**Body (수입검사)**

```json
{
  "type": "incoming",
  "partNo": "86501-P1000",
  "supplierCode": "KU67",
  "receivingDate": "2026-06-09",
  "lotNo": "LOT-001",
  "quantity": 500,
  "inspectionType": "샘플링",
  "sampleSize": 50,
  "results": {
    "visual": "OK",
    "dimension": "OK",
    "material": "OK"
  },
  "defectQty": 0,
  "disposition": "합격입고",
  "supplierCertNo": "SC-2026-001"
}
```

---

## 설비 점검 API

### 일상점검 기록 조회

```
GET /api/v1/equipment/checks
```

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| date | string | N | 점검일자 |
| assetNo | string | N | 설비 자산번호 |
| shift | string | N | 조 (A, B, C) |
| status | string | N | 상태 (정상, 이상, 수리필요) |

**예시**

```bash
# 오늘 이상 발생 설비 조회
curl -H "X-API-Key: erp-key" \
  "https://qms.cams.co.kr/api/v1/equipment/checks?date=2026-06-09&status=이상"
```

### 일상점검 기록 생성

```
POST /api/v1/equipment/checks
```

**Body**

```json
{
  "assetNo": "EQ-001",
  "checkDate": "2026-06-09",
  "shift": "A",
  "checkerId": "EMP001",
  "results": {
    "appearance": "OK",
    "abnormalSound": "OK",
    "abnormalVibration": "OK",
    "oilLevel": "OK",
    "airPressure": "OK",
    "temperature": 45.5
  },
  "remarks": "정상 운전 중"
}
```

---

## 협력사 API

### 납품 성과 조회

```
GET /api/v1/suppliers/{code}/deliveries
```

**Parameters**

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| year | number | N | 연도 (기본: 현재) |
| month | string | N | 월 (01-12) |

**예시**

```bash
# KU67 협력사 2026년 성과 조회
curl -H "X-API-Key: supplier-key" \
  "https://qms.cams.co.kr/api/v1/suppliers/KU67/deliveries?year=2026"
```

**응답**

```json
{
  "success": true,
  "data": {
    "supplier": {
      "code": "KU67",
      "name": "(주)캠스",
      "grade": "A"
    },
    "deliveryPerformance": [
      {
        "yearMonth": "2026-01",
        "orderCount": 150,
        "onTimeCount": 148,
        "lateCount": 2,
        "onTimeRate": 98.67
      }
    ],
    "qualityPerformance": [
      {
        "yearMonth": "2026-01",
        "receivedQty": 5000,
        "defectQty": 5,
        "defectRate": 0.1,
        "ncCount": 0
      }
    ],
    "latestEvaluation": {
      "year": 2025,
      "totalScore": 92.5,
      "grade": "A"
    }
  }
}
```

### 납품 기록 등록

```
POST /api/v1/suppliers/{code}/deliveries
```

**Body**

```json
{
  "yearMonth": "2026-06",
  "orderCount": 100,
  "onTimeCount": 98,
  "lateCount": 2
}
```

---

## 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| UNAUTHORIZED | 401 | API Key 없음 또는 잘못됨 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| BAD_REQUEST | 400 | 잘못된 요청 |
| INTERNAL_ERROR | 500 | 서버 오류 |

---

## 연동 가이드

### ERP 연동

1. **검사 데이터 동기화**: 일 1회 배치로 검사 결과 조회
2. **품질 지표 연동**: KPI, 불량률 데이터 조회
3. **재고 연동**: 수입검사 합격 시 재고 증가 트리거

### MES 연동

1. **실시간 검사**: 생산 라인에서 초/중/종물 검사 결과 즉시 전송
2. **설비 상태**: 일상점검 결과로 설비 가동률 연동
3. **LOT 추적**: 생산 LOT와 검사 기록 연계

### 모바일 앱 연동

1. **점검 입력**: 현장에서 설비/금형/지그 점검 결과 입력
2. **오프라인 지원**: 로컬 저장 후 네트워크 연결 시 동기화
3. **푸시 알림**: 점검 예정/만료 알림 연동

### 협력사 포털 연동

1. **실적 조회**: 자사 납기/품질 성과 대시보드
2. **성적서 업로드**: 수입검사용 시험성적서 전송
3. **부적합 알림**: 부적합 발생 시 실시간 통보

---

## 변경 이력

| 버전 | 일자 | 내용 |
|------|------|------|
| 1.0.0 | 2026-06-09 | 최초 릴리즈 |
