# Railway 배포 가이드

## 1. 사전 준비

### GitHub 저장소 생성

```bash
cd /Users/jhungsoohong/excelal
git init
git add .
git commit -m "Initial commit: IATF 16949 QMS"
git branch -M main
git remote add origin https://github.com/your-username/iatf-qms.git
git push -u origin main
```

## 2. Railway 프로젝트 설정

### 2.1 Railway 접속
1. https://railway.app 접속
2. GitHub 계정으로 로그인

### 2.2 새 프로젝트 생성
1. **New Project** 클릭
2. **Deploy from GitHub repo** 선택
3. `iatf-qms` 저장소 선택

### 2.3 PostgreSQL 추가
1. 프로젝트 대시보드에서 **+ New** 클릭
2. **Database** → **PostgreSQL** 선택
3. 자동으로 `DATABASE_URL` 환경변수가 설정됨

### 2.4 환경변수 설정

Railway 대시보드 → 앱 서비스 → **Variables** 탭에서 추가:

```
# 필수
NEXTAUTH_SECRET=your-32-character-random-string
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# API Keys (외부 연동용)
API_KEY_ERP=erp-your-secret-key-here
API_KEY_MES=mes-your-secret-key-here
API_KEY_MOBILE=mobile-your-secret-key-here
API_KEY_SUPPLIER=supplier-your-secret-key-here
```

**NEXTAUTH_SECRET 생성 방법:**
```bash
openssl rand -base64 32
```

### 2.5 도메인 설정
1. 앱 서비스 → **Settings** → **Networking**
2. **Generate Domain** 클릭 → `iatf-qms-production.up.railway.app` 형태로 생성
3. 또는 커스텀 도메인 연결: `qms.cams.co.kr`

## 3. 배포 확인

### 3.1 배포 상태 확인
- Railway 대시보드에서 **Deployments** 탭 확인
- 빌드 로그에서 오류 확인

### 3.2 Health Check
```bash
curl https://your-domain.up.railway.app/api/health
```

정상 응답:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-09T10:00:00.000Z",
  "services": {
    "database": "connected",
    "api": "running"
  }
}
```

### 3.3 초기 데이터 설정

Railway CLI 또는 콘솔에서:
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 연결
railway link

# Seed 실행
railway run npm run db:seed
```

## 4. 운영 설정

### 4.1 자동 배포
- GitHub main 브랜치에 push하면 자동 배포
- PR 머지 시 자동 배포

### 4.2 환경 분리 (선택)

**Staging 환경 추가:**
1. Railway 대시보드 → **+ New Environment**
2. `staging` 환경 생성
3. 별도 PostgreSQL 인스턴스 추가
4. GitHub `develop` 브랜치 연결

### 4.3 모니터링
- Railway 대시보드에서 CPU, 메모리, 네트워크 모니터링
- 로그 실시간 확인

### 4.4 백업
Railway PostgreSQL은 자동 백업 제공:
- **Settings** → **Backups** 에서 확인
- 수동 백업: `railway run pg_dump > backup.sql`

## 5. 비용 (2026년 기준)

| 항목 | Hobby | Pro |
|------|-------|-----|
| 월 비용 | $5 | $20+ |
| 메모리 | 512MB | 8GB+ |
| CPU | 공유 | 전용 |
| PostgreSQL | 1GB | 10GB+ |
| 대역폭 | 100GB | 무제한 |

**50명 사용 예상:**
- Pro Plan ($20/월) + PostgreSQL ($5/월) = 약 $25/월
- 트래픽 증가 시 자동 스케일링

## 6. 트러블슈팅

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build
```

### DB 연결 실패
1. Railway 대시보드에서 PostgreSQL 상태 확인
2. `DATABASE_URL` 환경변수 확인
3. Health check: `/api/health`

### 메모리 부족
- Railway 대시보드 → **Settings** → 메모리 증가
- 또는 Pro Plan 업그레이드

## 7. 커스텀 도메인 (qms.cams.co.kr)

### DNS 설정
```
Type: CNAME
Name: qms
Value: your-app.up.railway.app
```

### Railway 설정
1. **Settings** → **Networking** → **Custom Domain**
2. `qms.cams.co.kr` 입력
3. SSL 자동 발급 (Let's Encrypt)

### NEXTAUTH_URL 업데이트
```
NEXTAUTH_URL=https://qms.cams.co.kr
```
