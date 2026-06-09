import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const controlItems = [
  { itemNo: 1, process: "IATF16949", name: "IATF SIs, IAOB letter 반영 Checklist", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "IATF16949 변경사항 점검 (www.iatfglobaloversight.org)" },
  { itemNo: 2, process: "고객지정요구사항(CSR) 변경 이행점검", name: "고객 요구사항(CSR) 업데이트 또는 개정 관리", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "품질5스타, SQ 평가기준 변경, 품질보증 매뉴얼 변경시 사내표준류 반영확인" },
  { itemNo: 3, process: "사업계획운영프로세스", name: "사업계획 수립(부서/전사)", frequency: "년", targetDept: "전부서", responsibleDept: "영업관리팀", notes: "년 1회 사업계획 수립 보고 진행 중" },
  { itemNo: 4, process: "사업계획운영프로세스", name: "매출액달성율(매출목표/실적)*100", frequency: "년", targetDept: "영업관리팀", responsibleDept: "경영관리팀", notes: "별도관리(요청시 제출)" },
  { itemNo: 5, process: "사업계획운영프로세스", name: "영업이익달성율(영업이익목표/실적)*100", frequency: "년", targetDept: "경영관리팀", responsibleDept: "경영관리팀", notes: "별도관리(요청시 제출)" },
  { itemNo: 6, process: "사업계획운영프로세스", name: "경상이익달성율(경상이익목표/실적)*100", frequency: "년", targetDept: "경영관리팀", responsibleDept: "경영관리팀", notes: "별도관리(요청시 제출)" },
  { itemNo: 7, process: "사업계획운영프로세스", name: "순이익달성율(순이익목표/실적)*100", frequency: "년", targetDept: "경영관리팀", responsibleDept: "경영관리팀", notes: "별도관리(요청시 제출)" },
  { itemNo: 8, process: "사업계획운영프로세스", name: "인원의 충족성", frequency: "년/필요시", targetDept: "전부서", responsibleDept: "경영관리팀", notes: "" },
  { itemNo: 9, process: "경영검토절차서", name: "경영검토 보고서", frequency: "년", targetDept: "전부서", responsibleDept: "개발품질팀", notes: "" },
  { itemNo: 10, process: "리스크 관리 및 예방조치 절차서", name: "리스크평가", frequency: "년", targetDept: "전부서", responsibleDept: "전부서", notes: "리스크평가항목기준 년1회평가 및 조치결과 작성" },
  { itemNo: 11, process: "공급자 평가 및 등록 절차서/리스크 관리 및 예방조치 절차서", name: "공급자 개발계획 및 리스크평가표", frequency: "년", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "공급자개발계획 및 리스크평가 실적 관리" },
  { itemNo: 12, process: "내부심사프로세스", name: "내부심사 계획대 실적", frequency: "년", targetDept: "전부서", responsibleDept: "개발품질팀", notes: "" },
  { itemNo: 13, process: "내부심사프로세스", name: "내부심사 빈도수 결정 리스크 평가", frequency: "년", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "2025년 평가시 요청사항으로 개선 진행 중" },
  { itemNo: 14, process: "지속적개선 프로세스", name: "프로세스별 성과지표", frequency: "월", targetDept: "전부서", responsibleDept: "개발품질팀", notes: "" },
  { itemNo: 15, process: "지속적개선 프로세스", name: "프로세스별 성과지표 결과", frequency: "월", targetDept: "전부서", responsibleDept: "개발품질팀", notes: "매월 KPI 성과지표 작성후 달성/미달성 항목 대책수립" },
  { itemNo: 16, process: "지속적개선 프로세스", name: "프로세스별 성과지표 미달성에 대한 개선대책", frequency: "발생시", targetDept: "전부서", responsibleDept: "개발품질팀", notes: "매월 KPI 성과지표 작성후 미달성 항목 대책수립" },
  { itemNo: 17, process: "고객만족도프로세스", name: "조사계획 수립", frequency: "년", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "" },
  { itemNo: 18, process: "고객만족도프로세스", name: "설문조사 및 평가보고서", frequency: "반기", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "" },
  { itemNo: 19, process: "고객만족도프로세스", name: "고객 불만족", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "고객사 입고불량" },
  { itemNo: 20, process: "인적자원관리", name: "년간 교육계획 수립(사무실, 신입사원)", frequency: "년", targetDept: "전부서", responsibleDept: "생산기술팀", notes: "전산관리(팀즈), 신입사원 교육 계획대 실적 관리 필요" },
  { itemNo: 21, process: "인적자원관리", name: "년간 교육계획대 실적(현장)", frequency: "년", targetDept: "전부서", responsibleDept: "생산기술팀", notes: "안전보건 교육 진행 중" },
  { itemNo: 22, process: "인적자원관리", name: "년간 교육계획대 실적", frequency: "월", targetDept: "전부서", responsibleDept: "생산기술팀", notes: "전산관리(팀즈)" },
  { itemNo: 23, process: "인적자원관리", name: "교육결과보고서(사무실)", frequency: "발생시", targetDept: "전부서", responsibleDept: "전부서", notes: "교육 완료후 교육출장 보고서 작성, 팀즈에 파일첨부 관리" },
  { itemNo: 24, process: "인적자원관리", name: "교육결과보고서(현장)", frequency: "품질문제발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "사내/외 주요품질문제 발생시 현장 작업자 교육일지 작성" },
  { itemNo: 25, process: "인적자원관리", name: "자격인증관리(내부심사원)", frequency: "년/신규인원", targetDept: "생산팀/개발품질팀", responsibleDept: "개발품질팀", notes: "내부심사원/생산현장/품질검사원 자격인증 관리" },
  { itemNo: 26, process: "인적자원관리", name: "자격인증관리(품질검사원)", frequency: "년/신규인원", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "품질팀 자격인증 관리대장 첨부필요" },
  { itemNo: 27, process: "인적자원관리", name: "자격인증관리(생산현장)", frequency: "년/신규인원", targetDept: "생산팀", responsibleDept: "생산팀", notes: "신규인원 업무교육 및 자격인증 평가필요" },
  { itemNo: 28, process: "인적자원관리", name: "개인별교육이력관리(사무실, 신입사원)", frequency: "발생시", targetDept: "전부서", responsibleDept: "전부서", notes: "기존직원: 전산관리(팀즈), 신입사원: OJT 교안/교육계획/교육실적 자료 필요" },
  { itemNo: 29, process: "인적자원관리", name: "개인별교육이력관리(현장)", frequency: "발생시", targetDept: "전부서", responsibleDept: "전부서", notes: "안전교육, 자격인증만 진행중, 개인별 교육이력카드 작성 필요" },
  { itemNo: 30, process: "고객만족도프로세스", name: "조사계획 수립", frequency: "년", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "" },
  { itemNo: 31, process: "고객만족도프로세스", name: "고객 만족도 설문조사 및 평가보고서", frequency: "반기", targetDept: "영업관리팀/개발품질팀", responsibleDept: "영업관리팀", notes: "" },
  { itemNo: 32, process: "영업관리프로세스", name: "수주관리대장", frequency: "발생시", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "" },
  { itemNo: 33, process: "영업관리프로세스", name: "업체선정보고서", frequency: "발생시", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "개발차종 신규업체 추가시 업체선정보고서 작성필요" },
  { itemNo: 34, process: "고객재산절차서", name: "대여자산관리대장(고객사)", frequency: "발생시", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "현대/기아 대여자산 관리대장 VAATZ 전산관리" },
  { itemNo: 35, process: "생산관리프로세스", name: "CAPA 분석", frequency: "반기", targetDept: "생산팀", responsibleDept: "생산팀", notes: "" },
  { itemNo: 36, process: "생산관리프로세스", name: "관리계획서/작업표준서", frequency: "발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "신차개발시 작성후 작업공정 변경시 변경 이력관리" },
  { itemNo: 37, process: "생산관리프로세스", name: "공정FMEA/중점관리표", frequency: "발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "신차개발시 작성, 주요불량 발생시 표준류 반영 관리" },
  { itemNo: 38, process: "생산관리프로세스", name: "라인중단보고서", frequency: "발생시", targetDept: "생산팀/생산기술팀", responsibleDept: "생산기술팀", notes: "" },
  { itemNo: 39, process: "생산관리프로세스", name: "대체공정 검토 결과서", frequency: "년/발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "년1회 OR 신규설비 및 금형 도입시 대체공정 검토 필요" },
  { itemNo: 40, process: "생산관리프로세스", name: "F/PROOF 장비검증(사출 호퍼, 사출장비 인터록)", frequency: "월", targetDept: "생산팀/생산기술팀", responsibleDept: "생산팀", notes: "월단위 F/PROOF 장비 점검결과 보유, 현재 일상점검만 관리 중" },
  { itemNo: 41, process: "생산관리프로세스", name: "F/PROOF 장비검증(복합기, 전장검사, 이종검사)", frequency: "일", targetDept: "생산팀/생산기술팀", responsibleDept: "생산팀", notes: "일상점검 결과 기록관리 필요, 조업시작전 검사후 전산이력관리" },
  { itemNo: 42, process: "생산관리프로세스", name: "토르크관리", frequency: "월", targetDept: "생산팀", responsibleDept: "생산팀", notes: "토르크관리기준 수립 및 계획대 실적 관리" },
  { itemNo: 43, process: "생산관리프로세스", name: "조도관리", frequency: "월", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "조도관리기준 수립 및 계획대 실적 관리" },
  { itemNo: 44, process: "생산관리프로세스", name: "건조로 프로파일 관리", frequency: "월", targetDept: "생산팀", responsibleDept: "생산팀", notes: "도장 건조로 프로파일 관리" },
  { itemNo: 45, process: "설비보전관리프로세스", name: "설비등록관리대장", frequency: "발생시", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "전산관리(ERP)" },
  { itemNo: 46, process: "설비보전관리프로세스", name: "설비일상점검표", frequency: "일", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "전산관리(팀즈)" },
  { itemNo: 47, process: "설비보전관리프로세스", name: "보전패트롤점검표", frequency: "일", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "전산관리(팀즈)" },
  { itemNo: 48, process: "설비보전관리프로세스", name: "설비이상보고서", frequency: "발생시", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "생산관리프로세스 라인중단보고서 동일양식 사용" },
  { itemNo: 49, process: "설비보전관리프로세스", name: "년간예방보전계획대 실적", frequency: "월", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "전산관리(ERP)" },
  { itemNo: 50, process: "설비보전관리프로세스", name: "년간예방보전점검기준", frequency: "발생시", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "최신본 업데이트 관리필요" },
  { itemNo: 51, process: "설비보전관리프로세스", name: "MTBF/MTTR 분석표", frequency: "월", targetDept: "생산기술팀", responsibleDept: "생산기술팀", notes: "" },
  { itemNo: 52, process: "금형관리절차서", name: "금형보유 종합 현황", frequency: "발생시", targetDept: "생산팀/금형개발팀/상생협력팀", responsibleDept: "생산팀", notes: "대여자산 조사자료 기준 금형 보유업체 업데이트 필요" },
  { itemNo: 53, process: "금형관리절차서", name: "금형일상점검 체크시트", frequency: "금형교환시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "금형 교환시 체크시트 기준 점검후 전산등록" },
  { itemNo: 54, process: "금형관리절차서", name: "금형 습합/세척 관리", frequency: "월", targetDept: "생산팀", responsibleDept: "생산팀", notes: "금형습합 및 세척 계획대 실적 관리(일정준수)" },
  { itemNo: 55, process: "금형관리절차서", name: "금형 보수실적 관리", frequency: "발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "금형문제 발생시 발생현상 및 수리내용 전산등록 관리" },
  { itemNo: 56, process: "금형관리절차서", name: "금형 스페어파트 관리", frequency: "일/발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "금형 스페어파트 수불관리, 현장 게시판 활용 게시관리 중" },
  { itemNo: 57, process: "지그관리 절차서", name: "지그 관리기준 수립", frequency: "발생시", targetDept: "생산팀/생산기술팀", responsibleDept: "생산팀", notes: "개발차종 or 신규지그 제작시 관리기준 수립" },
  { itemNo: 58, process: "지그관리 절차서", name: "지그 관리대장", frequency: "발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "도장/조립지그 관리대장 작성 및 정도검증 기록관리" },
  { itemNo: 59, process: "개발업무프로세스", name: "마스터플랜외 관리문서관리", frequency: "신차개발시", targetDept: "전부서", responsibleDept: "전부서", notes: "팀즈 부품개발프로젝트 전산관리 중" },
  { itemNo: 60, process: "도면관리절차서", name: "도면불출대장", frequency: "발생시", targetDept: "설계팀", responsibleDept: "설계팀", notes: "협력사 및 사내 배포시 결재후 배포 필요, 불출이력만 관리 중" },
  { itemNo: 61, process: "도면관리절차서", name: "기술사양변경내역서", frequency: "발생시", targetDept: "설계팀", responsibleDept: "설계팀", notes: "설계팀 전산 관리 중" },
  { itemNo: 62, process: "변경관리프로세스", name: "변경관리대장(4M, EO) - 고객사", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "4M/EO 변경시 고객사 제출 승인관리, 전산관리중(팀즈)" },
  { itemNo: 63, process: "부적합품관리 및 시정조치프로세스", name: "부적합품 관리대장(고객사, 2차협력사)", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "전산관리(팀즈)" },
  { itemNo: 64, process: "부적합품관리 및 시정조치프로세스", name: "재작업표준서 제정", frequency: "발생시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "도장/조립/사출품에 대한 재작업 표준자료 작성 보유 필요" },
  { itemNo: 65, process: "고객불만절차서", name: "필드클레임 고품분석 관리대장", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "3M 클레임 품질이력 관리" },
  { itemNo: 66, process: "고객불만절차서", name: "CS/RS 지수관리", frequency: "월", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "매월 불량율 집계 관리" },
  { itemNo: 67, process: "구매관리프로세스", name: "년 구매계획서", frequency: "년/월", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "고객사 계획대비 구매계획 수립" },
  { itemNo: 68, process: "구매관리프로세스", name: "공급자인도성과율", frequency: "월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "" },
  { itemNo: 69, process: "구매관리프로세스", name: "공급자 납입계획대실적", frequency: "월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "" },
  { itemNo: 70, process: "공급자치공구관리절차서", name: "대여자산관리대장(공급자)", frequency: "발생시", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "공증자료 ERP 전산등록 관리" },
  { itemNo: 71, process: "공급자평가 및 등록 절차서", name: "년간 정기평가계획대실적", frequency: "년/월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "협력사 정기점검 계획대 실적 관리" },
  { itemNo: 72, process: "공급자평가 및 등록 절차서", name: "업체실태조사서", frequency: "년", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "거래협력사 업체실태조사 자료 관리" },
  { itemNo: 73, process: "공급자평가 및 등록 절차서", name: "공급자개발계획서(2자심사 계획대실적포함)", frequency: "년", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "공급자개발계획대실적/2자검사계획대실적/리스크평가" },
  { itemNo: 74, process: "제품보존 및 인도관리 프로세스", name: "일매출실적 현황", frequency: "일", targetDept: "영업관리팀", responsibleDept: "영업관리팀", notes: "영업관리팀 관리 중" },
  { itemNo: 75, process: "제품보존 및 인도관리 프로세스", name: "고객 인도성과율", frequency: "월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "" },
  { itemNo: 76, process: "제품보존 및 인도관리 프로세스", name: "운송비 계획대 실적", frequency: "월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "추가운송 관리" },
  { itemNo: 77, process: "자재관리절차서", name: "적정재고관리", frequency: "년", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "변경사항발생시(신규개발차종)" },
  { itemNo: 78, process: "자재관리절차서", name: "자재수불부", frequency: "월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "현재 미관리중(월 재고실사 미진행 이후 관리 안됨), IATF 요구사항" },
  { itemNo: 79, process: "자재관리절차서", name: "자재재고회전율", frequency: "월", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "사내 입고품 재고 회전율(원소재, 부재료, 조립부품)" },
  { itemNo: 80, process: "자재관리절차서", name: "LAY-OUT(자재보관)", frequency: "발생시", targetDept: "생산팀/상생협력팀", responsibleDept: "생산팀", notes: "신규차종적용 OR LAY-OUT 변경시, 현장 게시 관리 중" },
  { itemNo: 81, process: "검사업무프로세스", name: "초, 중, 종품 검사일지", frequency: "일", targetDept: "생산팀", responsibleDept: "생산팀", notes: "사출 초, 중, 종물 검사 전산관리중(POP)" },
  { itemNo: 82, process: "검사업무프로세스", name: "공정일일검사", frequency: "일", targetDept: "생산팀", responsibleDept: "생산팀", notes: "융착설비 융착력 점검 결과 기록관리(전산관리), 사출공정 패트롤검사(문서관리)" },
  { itemNo: 83, process: "검사업무프로세스", name: "한도견본관리대장", frequency: "발생시", targetDept: "생산팀/개발품질팀", responsibleDept: "개발품질팀", notes: "한도견본 관리부품 리스트 작성관리" },
  { itemNo: 84, process: "검사업무프로세스", name: "공정불량 부적합품 관리", frequency: "발생시", targetDept: "생산팀/개발품질팀", responsibleDept: "생산팀", notes: "조립부품 불량식별 및 기록관리, 현장 파일배치" },
  { itemNo: 85, process: "검사업무프로세스", name: "정기검사 계획대 실적", frequency: "6개월", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "차종별 정기 신뢰성검사 계획대 실적관리" },
  { itemNo: 86, process: "검사업무프로세스", name: "색차 관리", frequency: "LOT", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "현장 색차관리 인원 LOT 별 색차측정관리 중, 데이터 집계 및 정리 사무실 엑셀파일 관리 중" },
  { itemNo: 87, process: "검사업무프로세스", name: "도막두께", frequency: "일", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "시험실 담당자 차종별 1주 1회 칼라별 측정 관리" },
  { itemNo: 88, process: "검사업무프로세스", name: "색차계 교정결과 기록관리", frequency: "일", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "초기화 리셋후 마스터시편 측정결과 기록관리, 2025년 IATF16949 사후심사시 지적사항_대책수립중" },
  { itemNo: 89, process: "검사업무프로세스", name: "부착성관리", frequency: "일", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "현장 색차관리 인원 부착성 측정관리 중" },
  { itemNo: 90, process: "검사업무프로세스", name: "완제품 치수관리", frequency: "주", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "차종별 완제품 치수 측정 기록관리" },
  { itemNo: 91, process: "검사업무프로세스", name: "수입검사 유검사 관리기준 설정", frequency: "월", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "수입검사 유검사 관리항목 선정" },
  { itemNo: 92, process: "검사업무프로세스", name: "수입검사 유검사 검사이력 관리", frequency: "일", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "수입검사 입고시 유검사품목 입고 LOT 별 성적서 접수 기록관리" },
  { itemNo: 93, process: "검사업무프로세스", name: "외주업체검사시험 성적서", frequency: "월", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "외주 입고품 수입검사 성적서 관리(전부품), 업체성적서 접수 및 수입검사 담당자 실측정 자료 기록관리" },
  { itemNo: 94, process: "검사업무프로세스", name: "수입검사입고불량율", frequency: "월", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "수입검사 불량율 집계 및 개선관리" },
  { itemNo: 95, process: "검사업무프로세스", name: "원/부재료 수입검사 기록관리", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "원재료 입고시 MILL SHEET 접수 및 수분측정 및 결과 전산등록" },
  { itemNo: 96, process: "검사업무프로세스", name: "공정검사 이력관리", frequency: "일", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "공정 패트롤 검사 실적관리(파일철 관리중)" },
  { itemNo: 97, process: "검사업무프로세스", name: "공정능력평가", frequency: "월", targetDept: "생산팀", responsibleDept: "생산팀", notes: "현재 신차개발 및 4M변경시만 관리중이나 고객사/IATF16949 요청사항은 매월 측정관리 필요" },
  { itemNo: 98, process: "검사구관리절차서", name: "검사구이력카드 관리대장", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "신규차종 개발시 신규제작 및 년단위 3차원측정 점검 기록관리" },
  { itemNo: 99, process: "계측 및 시험관리절차서", name: "계측기관리대장", frequency: "년", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "팀즈 파일 업로드 관리 중" },
  { itemNo: 100, process: "계측 및 시험관리절차서", name: "년간 계측기 교정 계획대 실적", frequency: "년", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "팀즈 파일 업로드 관리 중" },
  { itemNo: 101, process: "계측 및 시험관리절차서", name: "계측기 검교정 성적서", frequency: "년", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "파일철 관리 중" },
  { itemNo: 102, process: "계측 및 시험관리절차서", name: "게이지 R&R 평가(계수형/계량형)", frequency: "년", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "현장 검사원 게이지 R&R 평가 및 결과 기록관리, 엑셀 파일 관리 중" },
  { itemNo: 103, process: "시험실관리절차서", name: "연간 신뢰성시험 계획대 실적", frequency: "년/월", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "차종별 년간 신뢰성시험 계획수립 및 실적 관리" },
  { itemNo: 104, process: "시험실관리절차서", name: "신뢰성시험성적서", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "양산/개발차종 신뢰성시험성적서 전산(팀즈) 등록 관리 중" },
  { itemNo: 105, process: "시험실관리절차서", name: "시험장비 이력카드", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "시험장비 신규구매 및 검교정/수리 이력 관리" },
  { itemNo: 106, process: "시험실관리절차서", name: "시험장비 보유(범위)현황", frequency: "발생시", targetDept: "개발품질팀", responsibleDept: "개발품질팀", notes: "전산(팀즈) 관리 중, 신규장비 구매 및 장비 폐기시 전산(팀즈) 업데이트 관리" },
  { itemNo: 107, process: "포장관리지침서", name: "납입용기 설정서", frequency: "발생시", targetDept: "생산기술팀/상생협력팀", responsibleDept: "생산기술팀", notes: "생산기술팀: 개발차종 납입용기 승인 및 제작, 상생협력팀: 2차 협력사 납입용기 승인 및 제작" },
  { itemNo: 108, process: "포장관리지침서", name: "납입용기 점검 체크시트", frequency: "일", targetDept: "생산팀", responsibleDept: "생산팀", notes: "납입용기 유지보수 관리" },
  { itemNo: 109, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_전력공급중단", frequency: "년", targetDept: "생산기술팀", responsibleDept: "개발품질팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 110, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_설비고장/생산설비손상", frequency: "년", targetDept: "생산팀/생산기술팀", responsibleDept: "개발품질팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 111, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_인력부족", frequency: "년", targetDept: "전부서", responsibleDept: "경영관리팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 112, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_자재/부품공급차질", frequency: "년", targetDept: "상생협력팀", responsibleDept: "상생협력팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 113, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_정보시스템/네트워크장애", frequency: "년", targetDept: "전산팀", responsibleDept: "전산팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 114, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_자연재해", frequency: "년", targetDept: "전부서", responsibleDept: "개발품질팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 115, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_화재 또는 폭발사고", frequency: "년", targetDept: "전부서", responsibleDept: "생산기술팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 116, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_전염병 및 펜더믹 상황", frequency: "년", targetDept: "전부서", responsibleDept: "경영관리팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 117, process: "비상사태관리지침", name: "비상대응훈련결과 보고서_보안사고/사이버공격", frequency: "년", targetDept: "전산팀", responsibleDept: "전산팀", notes: "매뉴얼 수시 업데이트 및 훈련결과(효과성) 기록 관리필요" },
  { itemNo: 118, process: "3정5행 운영지침서", name: "3정5행 관리기준(조직도, 구역도등)", frequency: "변경시", targetDept: "생산팀", responsibleDept: "생산팀", notes: "" },
  { itemNo: 119, process: "3정5행 운영지침서", name: "3정5행 평가 및 개선대책", frequency: "월", targetDept: "생산팀", responsibleDept: "생산팀", notes: "" },
];

async function seedControlItems() {
  console.log("Seeding 118 control items...");

  // Get or create processes
  const processMap = new Map<string, number>();
  const uniqueProcesses = [...new Set(controlItems.map(item => item.process))];

  for (const processName of uniqueProcesses) {
    const code = processName.substring(0, 50).replace(/[^a-zA-Z0-9가-힣]/g, "_");
    let process = await prisma.process.findFirst({ where: { name: processName } });
    if (!process) {
      process = await prisma.process.create({
        data: {
          code: `PROC_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: processName,
          category: "품질",
          isActive: true,
        },
      });
    }
    processMap.set(processName, process.id);
  }

  // Get department map
  const departments = await prisma.department.findMany();
  const deptMap = new Map<string, number>();
  departments.forEach(d => deptMap.set(d.name, d.id));

  // Helper to find department ID
  const findDeptId = (name: string): number | null => {
    if (!name || name === "전부서") return null;
    const parts = name.split("/");
    for (const part of parts) {
      const trimmed = part.trim();
      if (deptMap.has(trimmed)) return deptMap.get(trimmed)!;
    }
    return null;
  };

  // Delete existing control items
  await prisma.controlItem.deleteMany({});

  // Create control items
  for (const item of controlItems) {
    await prisma.controlItem.create({
      data: {
        itemNo: item.itemNo,
        processId: processMap.get(item.process) || null,
        name: item.name,
        frequency: item.frequency,
        targetDeptId: findDeptId(item.targetDept),
        responsibleDeptId: findDeptId(item.responsibleDept),
        notes: item.notes || null,
        isActive: true,
      },
    });
  }

  console.log(`Created ${controlItems.length} control items`);
}

seedControlItems()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
