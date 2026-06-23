# 소스문서 ↔ 웹메뉴 커버리지 분석 (수정본)

> 데이터셋: 137개 소스파일 · 웹메뉴(사이드바)
> 매칭 기준: 파일명(무의미 코드)이 아닌 **한글 내용(title+prev)** 으로 의미적(semantic) 매칭.
> ⚠️ 이전 분석에서 "빈 파일"로 오판했던 77개는 사실 **PowerPoint 문서(.pptx를 .xlsx로 개명)** 로, 모두 내용이 있음 → 본 수정본은 이를 정상 반영함.

## 0. 보완 완료 (2026-06-22)

분석에서 식별된 누락(❌ 1건) + 부분(⚠️ 16건)을 **전부 보완 완료**. 빌드/타입체크 통과(에러 0).

**신규 페이지 10개 생성** (사이드바 연결 포함):
| 항목 | 라우트 | 메뉴그룹 |
|---|---|---|
| 인력관리(정원/결원) | `/hr/manpower` | 인적자원관리 |
| 매출/매입 실적 | `/sales/revenue` | 영업/수주관리 |
| 이해관계자 분석 | `/management/stakeholders` | 경영관리 |
| 검사 성적서(유검사) | `/inspection/test-report` | 검사업무 |
| 유/무검사 전환이력 | `/inspection/switch-history` | 검사업무 |
| 샘플검사 이력 | `/inspection/sample-history` | 검사업무 |
| 고객 스코어카드(품질5스타/SQ) | `/customer/scorecard` | 고객만족도 |
| 공정개선 활동 | `/production/improvement` | 생산관리 |
| 현장 게시판(불량유형) | `/quality/bulletin` | 3정5행 |
| 금형 스페어파트 | `/mold/spare-parts` | 금형/지그관리 |

**기존 페이지 4개 사이드바 연결**(페이지는 있었으나 미노출이던 것): 운송비/물류비 `/material/transport-cost`, 공급자 육성/개발 `/supplier/development`, 문서관리 `/management/documents`, 치수/중량 관리 `/quality/dimension`.

→ **결과: 137개 소스문서 전부 대응 메뉴 확보. 미커버 0건.** 사이드바 링크 100개 전수 검증(깨진 링크 0).

---

---

## 1. 요약

| 구분 | 전체 | ✅ 커버 | ⚠️ 부분 | ❌ 누락 |
|---|---|---|---|---|
| **전체 137** | 137 | **120 (87.6%)** | **16 (11.7%)** | **1 (0.7%)** |
| xlsx (실양식, 60) | 60 | 55 (91.7%) | 5 (8.3%) | 0 (0.0%) |
| pptx (문서, 77) | 77 | 65 (84.4%) | 11 (14.3%) | 1 (1.3%) |

- xlsx(live 데이터 입력 양식)는 거의 전부(91.7%) 기존 메뉴로 커버됨.
- pptx(설명/스냅샷 문서)는 다수가 기존 메뉴 주제와 중복되며, 일부 관리항목(스코어카드/공정개선/인력검토 등)만 메뉴가 비어 있음.
- **진짜 신규 메뉴가 필요한 누락(❌)은 단 1건**(인력/인원 부족 검토). 나머지 16건은 관련 메뉴는 있으나 전용 화면/양식이 미흡한 ⚠️.

---

## 2. 매핑표 (137행)

| 파일 | 유형 | 주요내용(한글요약) | 매칭메뉴(href) | 상태 |
|---|---|---|---|---|
| MBD0023D78F | xlsx | 작업자 능력평가·숙련도 평가서·차종별 조립교육 | /training/assessments | ✅ |
| MBD001DB38F | xlsx | 정기신뢰성 시험보고서(융착·토크·광택·외관) | /quality/reliability | ✅ |
| MBD0023D798 | xlsx | OP 자격인증서·직무능력 관리대장·자격인정 기준표 | /training/standards | ✅ |
| MBD0023DAC1 | xlsx | 연도별 클레임 종합·3M/12M·CS 품질지수 | /customer/claims | ✅ |
| MBD003A884A | xlsx | 입고불량 집계·차종/유형별·반송현황·PPM | /quality/incoming | ✅ |
| MBD0039E0D5 | xlsx | 업체실태현황조사서 | /supplier/survey | ✅ |
| MBD000D4B03 | xlsx | 공급업체 현황·점검계획/실적·SQ인증 | /supplier/evaluations | ✅ |
| MBD002443D5 | xlsx | 클레임 대쉬보드/Raw/피벗·유형 분류 | /customer/claims | ✅ |
| MBD000C1C21 | xlsx | 정기/개발 신뢰성 시험 계획&실적 | /lab/reliability-plan | ✅ |
| MBD0023D799 | xlsx | 자격인증 관리대장(내부심사원·제품/공정/시스템심사) | /training/standards | ✅ |
| MBD001E0165 | xlsx | 정기/개발 신뢰성 계획&실적(중복) | /lab/reliability-plan | ✅ |
| MBD0023D789 | xlsx | 업체선정 보고서·업체평가표·평가등급표 | /sales/vendor-selection | ✅ |
| MBD0019DAFC | xlsx | 치수·중량(FR/RR) 주차·월별 추이 관리 | /inspection/process | ⚠️ |
| MBD0023D78A | xlsx | SR접수·견적서·수주관리대장·생산계획 | /sales/orders | ✅ |
| MBD0023D7B4 | xlsx | 보안사고/사이버공격 대응훈련 결과보고 | /emergency/drills | ✅ |
| MBD0023D797 | xlsx | 신입사원 OJT 계획서·부서별 교육결과보고 | /training/records | ✅ |
| MBD0023D7B2 | xlsx | 정전 대응훈련 결과보고 | /emergency/drills | ✅ |
| MBD0023D7B5 | xlsx | 정보시스템/네트워크 장애 대응훈련 | /emergency/drills | ✅ |
| MBD0023D7A2 | xlsx | 리스크 평가서·리스크 평가기준 | /management/risk | ✅ |
| MBD0023D7B3 | xlsx | 설비고장/생산설비손상 대응훈련 | /emergency/drills | ✅ |
| MBD000CD813 | xlsx | 차종별 매출·매입액 집계 | /management/business-plan | ⚠️ |
| MBD0026C467 | xlsx | 범퍼 조립 토크 측정·기준표 | /production/torque | ✅ |
| MBD0023D79E | xlsx | 성과지표 관리표(계산방법·목표·실적) | /kpi/results | ✅ |
| MBD0017B032 | xlsx | 도면관리·배포 및 개정이력 관리 | /development/drawing | ✅ |
| MBD0023D7AA | xlsx | 부품 납기지연/공급중단 대응훈련 | /emergency/drills | ✅ |
| MBD0016A572 | xlsx | 치공구 양산성 점검 체크시트 | /daily/jig-check | ✅ |
| MBD0016D307 | xlsx | 치공구 점검 체크시트(중복) | /daily/jig-check | ✅ |
| MBD0023D7B6 | xlsx | 전염병/팬데믹 대응훈련 | /emergency/drills | ✅ |
| MBD0023D785 | xlsx | 차종 양산시 사출 CAPA 현황 | /production/capa | ✅ |
| MBD0023D783 | xlsx | 공정 FMEA(사출) FRT/RR | /production/fmea | ✅ |
| MBD0023D784 | xlsx | 관리계획서(Control Plan)·작업표준서 | /production/control-plan | ✅ |
| MBD0023D7B7 | xlsx | 인력부족 상황 대응훈련 | /emergency/drills | ✅ |
| MBD0026FFA2 | xlsx | 적정재고 산정표 | /material/inventory | ✅ |
| MBD0023D786 | xlsx | 사출 CAPA 현황 | /production/capa | ✅ |
| MBD0023D77C | xlsx | 년간 예방보전 추진계획·점검기준 | /equipment/maintenance | ✅ |
| MBD0023D793 | xlsx | 교육출장 결과보고서 | /training/records | ✅ |
| MBD003CAC22 | xlsx | 공정능력 평가표(PP·PPK) | /equipment/capability | ✅ |
| MBD003C46E8 | xlsx | 사출공정 일일 점검현황 | /inspection/process | ✅ |
| MBD0027214A | xlsx | 자재 재고회전율 | /material/turnover | ✅ |
| MBD0023D7A8 | xlsx | 인력부족 대응 절차서 | /emergency/types | ✅ |
| MBD0023D7AB | xlsx | 비상시 물류이관/대체생산 점검결과 | /emergency/types | ✅ |
| MBD002408B0 | xlsx | 설비 MTBF/MTTR 분석표 | /equipment/mtbf | ✅ |
| MBD0023D79C | xlsx | 개선대책서 | /quality/corrective-action | ✅ |
| MBD0023D7BE | xlsx | 운송비 계획대 실적 | /kpi/results | ⚠️ |
| MBD0023D79D | xlsx | 성과지표 Sheet(프로세스별 목표/달성율) | /kpi/results | ✅ |
| MBD0024E365 | xlsx | 공급자 인도성과율 | /supplier/delivery | ✅ |
| MBD0023D7AD | xlsx | 비상시 대체생산 점검결과 | /emergency/types | ✅ |
| MBD0023D7A9 | xlsx | 인력부족 대응 절차서 | /emergency/types | ✅ |
| MBD0023D79F | xlsx | 내부심사 빈도수 결정(리스크등급·심사주기) | /audit/plans | ✅ |
| MBD0023D79A | xlsx | 고객 만족도 조사 계획서 | /customer/satisfaction | ✅ |
| MBD0023D78D | xlsx | 교육일지 | /training/records | ✅ |
| MBD0023D7AF | xlsx | 비상시 대체생산 점검결과 | /emergency/types | ✅ |
| MBD0023D78B | xlsx | 고객 만족도 조사 계획서 | /customer/satisfaction | ✅ |
| MBD0023D7BF | xlsx | 공급자 납입계획대 실적 | /supplier/delivery | ✅ |
| MBD00214668 | xlsx | 수리표준서(범퍼 검사/수정) | /change/rework | ✅ |
| MBD0026E958 | xlsx | (주)캠스 인도성과율(KMC계획 대비) | /material/delivery | ✅ |
| MBD0026AC8E | xlsx | 공급자 개발 계획서(25년) | /supplier/evaluations | ⚠️ |
| MBD0023D7C4 | xlsx | 비상시 대체생산 점검결과 | /emergency/types | ✅ |
| MBD0023D7A1 | xlsx | 공급자 개발 계획서(25년) | /supplier/evaluations | ⚠️ |
| MBD0023D7C2 | xlsx | IATF SIs · IAOB letter List | /iatf/sis-checklist | ✅ |
| MBD001B9889 | PPT | 공정 일일검사 | /inspection/process | ✅ |
| MBD0023D7A3 | PPT | 이해관계자 니즈/요구사항 파악표 | /management/review | ⚠️ |
| MBD0023D7A4 | PPT | 경영검토 보고서 | /management/review | ✅ |
| MBD001AD9ED | PPT | 공정불량 부적합품 관리 | /quality/nonconformance | ✅ |
| MBD000D8293 | PPT | 개발차종 프로젝트 관리 | /development/masterplan | ✅ |
| MBD00196FBA | PPT | 유검사 검사 성적서 | /inspection/process | ⚠️ |
| MBD001B2221 | PPT | 부착성시험 관리 기준 | /quality/adhesion | ✅ |
| MBD0023D781 | PPT | 설비등록 | /equipment/list | ✅ |
| MBD006A1A70 | PPT | 4M 변경 관리 프로세스 | /change/4m-eo | ✅ |
| MBD0017A8BA | PPT | 외주품 수입검사 관리기준·반송이력 | /quality/incoming | ✅ |
| MBD0020A334 | PPT | 부적합품 관리대장 | /quality/nonconformance | ✅ |
| MBD0023D794 | PPT | 관리직 교육 계획대 실적 관리 | /training/plans | ✅ |
| MBD0023D7A5 | PPT | 현재 인원 및 부족인원 검토 | 없음 | ❌ |
| MBD001A512C | PPT | 도장 부착성 관리 | /quality/adhesion | ✅ |
| MBD00107891 | PPT | 금형 보수실적 관리 | /mold/repair | ✅ |
| MBD0023D792 | PPT | 교육훈련 결과보고 작성매뉴얼 | /training/records | ✅ |
| MBD002408AF | PPT | 년간 예방보전 점검기준 | /equipment/maintenance | ✅ |
| MBD00199FC8 | PPT | 유검사 검사 성적서 | /inspection/process | ⚠️ |
| MBD0023D795 | PPT | 관리직 교육관리 | /training/plans | ✅ |
| MBD0010782D | PPT | 금형 습합/세척 관리 | /mold/cleaning | ✅ |
| MBD001A5B4E | PPT | 색차관리 | /quality/color | ✅ |
| MBD0023D7C6 | PPT | 비상대응훈련 잠재적 9가지 항목 | /emergency/types | ✅ |
| MBD0023D780 | PPT | 설비 일상점검표(조회양식) | /daily/equipment-check | ✅ |
| MBD0023D787 | PPT | 사출 설비 성과지표(MTBF/MTTR) | /equipment/mtbf | ✅ |
| MBD001D9710 | PPT | 신뢰성시험 성적서 | /quality/reliability | ✅ |
| MBD0015EC3C | PPT | 지그구분 및 관리방법 | /jig/list | ✅ |
| MBD0017A8B7 | PPT | 사출조건표·사출기/설비자동화 일상점검 | /daily/equipment-check | ✅ |
| MBD001B61E6 | PPT | 공정불량 부적합품 관리 | /quality/nonconformance | ✅ |
| MBD0023D7B9 | PPT | 비상대응훈련 잠재적 9가지 항목 | /emergency/types | ✅ |
| MBD0023D79B | PPT | 고객평가표·품질5스타(고객 스코어카드) | /customer/satisfaction | ⚠️ |
| MBD001BFD69 | PPT | 초·중·종물 검사 | /daily/production-inspection | ✅ |
| MBD0023D7AE | PPT | 캠스 비상대응 매뉴얼(협력사 비상대응) | /emergency/types | ✅ |
| MBD0019A4F6 | PPT | 유/무검사 전환 이력관리 | /inspection/process | ⚠️ |
| MBD0017A8B6 | PPT | 원재료 수입검사·밀시트 수분측정 | /quality/incoming | ✅ |
| MBD0016F22B | PPT | 샘플검사 이력 관리 | /inspection/process | ⚠️ |
| MBD00280AFA | PPT | 도장 믹싱룸 공정개선(설비개선) | /quality/corrective-action | ⚠️ |
| MBD0023D7B8 | PPT | 비상상황 전파·주기교육·소방 안전관리 | /emergency/drills | ✅ |
| MBD00242008 | PPT | 품질개선 활동/계획·클레임 상세분석 | /customer/claims | ✅ |
| MBD001CF8AD | PPT | 시험장비 보유현황 | /lab/equipment | ✅ |
| MBD0017A213 | PPT | 연도별 고객불만 현황 | /customer/complaints | ✅ |
| MBD0023D7AC | PPT | 캠스 비상대응 매뉴얼(중복) | /emergency/types | ✅ |
| MBD0023D78C | PPT | 고객평가표·품질5스타(고객 스코어카드) | /customer/satisfaction | ⚠️ |
| MBD001AB596 | PPT | 도장 건조로 프로파일 관리 | /production/oven | ✅ |
| MBD000E5061 | PPT | 계측기 검교정 성적서 | /equipment/calibration | ✅ |
| MBD0026031E | PPT | 대여자산 관리대장/사용대차계약서(공급자) | /supplier/assets | ✅ |
| MBD0023D78E | PPT | 조립 작업자 숙련도/자격 평가 | /training/assessments | ✅ |
| MBD000EDEB4 | PPT | 금형 보유현황·등록/업체변경 | /mold/inventory | ✅ |
| MBD001A8B9B | PPT | 파일(문서) 관리 | /records/history | ⚠️ |
| MBD0023D7BA | PPT | 비상발전기 대응·제품생산 대응계획 | /emergency/types | ✅ |
| MBD003B0186 | PPT | 원소재 수분측정·성분분석 결과관리 | /quality/incoming | ✅ |
| MBD000CD1AC | PPT | 계측기 검교정 성적서 | /equipment/calibration | ✅ |
| MBD001BCFAA | PPT | 사출공정 패트롤 검사 | /inspection/process | ✅ |
| MBD0027B76E | PPT | 3정5S 구획별 LAY-OUT/담당 | /housekeeping/standards | ✅ |
| MBD001820BC | PPT | 변경관리 | /change/4m-eo | ✅ |
| MBD0025604B | PPT | AUDIT 회의록/도장불량유형 게시관리 | /audit/findings | ⚠️ |
| MBD00254790 | PPT | 대여자산 관리대장/계약서(고객사) | /sales/customer-assets | ✅ |
| MBD00161906 | PPT | 도장지그 현황·관리방안 | /jig/list | ✅ |
| MBD00277A2F | PPT | 3정5S 추진 조직도 | /housekeeping/standards | ✅ |
| MBD000EC31B | PPT | 금형 일상점검 관리 | /daily/mold-check | ✅ |
| MBD0023D7A7 | PPT | 사내전산 비상사태 운영매뉴얼 | /emergency/types | ✅ |
| MBD0023D7B1 | PPT | 사내전산 비상사태 운영매뉴얼(중복) | /emergency/types | ✅ |
| MBD0023D790 | PPT | 캠스 OJT 교안 | /training/records | ✅ |
| MBD0024903B | PPT | 사출 설비 성과지표(MTBF/MTTR) | /equipment/mtbf | ✅ |
| MBD0017A8B8 | PPT | 바코드부착·중량 전산·부적합품 관리 | /quality/nonconformance | ✅ |
| MBD0017A8BB | PPT | 도료점도·건조로 온도·부스 온/풍향 관리 | /production/oven | ✅ |
| MBD0017A8B9 | PPT | 건조로운영·원소재 수분측정 | /production/oven | ✅ |
| MBD0023D782 | PPT | 사출라인 자주검사 기준(초중종물) | /daily/production-inspection | ✅ |
| MBD0017AC8C | PPT | 융착점검·전동공구 토르크·이종/통전검사 | /production/torque | ✅ |
| MBD0017AC8D | PPT | 출하검사 중점관리·체크시트·식별표 | /quality/shipping | ✅ |
| MBD0023D7A6 | PPT | 고객지정 요구사항(CSR) 변경(5스타/SQ) | /iatf/csr-changes | ✅ |
| MBD00114588 | PPT | 금형 스페어파트 관리 | /mold/inventory | ⚠️ |
| MBD001BB361 | PPT | 레이아웃 게시관리 | /housekeeping/standards | ✅ |
| MBD0023D7C5 | PPT | 캠스 비상대응 매뉴얼(중복) | /emergency/types | ✅ |
| MBD0023D77F | PPT | 설비 일상점검표(조회양식) | /daily/equipment-check | ✅ |
| MBD0023D791 | PPT | 관리직 교육 계획대 실적 관리 | /training/plans | ✅ |
| MBD0023D796 | PPT | 사출 설비 성과지표(MTBF/MTTR) | /equipment/mtbf | ✅ |
| MBD0023D7B0 | PPT | 캠스 비상대응 매뉴얼(중복) | /emergency/types | ✅ |

---

## 3. 진짜 누락 (❌ · ⚠️)

### ❌ 누락 (전용 메뉴 부재) — 1건
| 파일 | 주요내용 | 추가 권장 메뉴 |
|---|---|---|
| MBD0023D7A5 | 현재 인원 및 부족인원 검토 | **인력/요원(정원·결원) 관리** 메뉴 신설 — 부서·공정별 현원/소요인원/부족인원 검토 화면. 86개 메뉴 어디에도 인력 정원관리 항목이 없음. |

### ⚠️ 부분(관련 메뉴는 있으나 전용 양식/화면 미흡) — 16건
| 파일 | 주요내용 | 비고(보완 권장) |
|---|---|---|
| MBD0019DAFC | 치수·중량 주차/월별 추이 관리 | /inspection/process 와 별개로 **치수·중량 추이(SPC) 전용 화면** 보완 권장 |
| MBD000CD813 | 차종별 매출·매입액 집계 | **영업 매출/매입 실적 관리** 메뉴 부재(사업계획과 일부 연계) |
| MBD0023D7BE | 운송비 계획대 실적 | **운송비/물류비 관리** 메뉴 부재(KPI로 일부 대체) |
| MBD0026AC8E / MBD0023D7A1 | 공급자 개발 계획서 | 공급자평가와 별도 **공급자 육성/개발 계획** 화면 보완 권장 |
| MBD0023D7A3 | 이해관계자 니즈파악표 | 경영검토 입력자료로 쓰이나 **이해관계자 분석 전용 화면** 부재 |
| MBD00196FBA / MBD00199FC8 | 유검사 검사 성적서 | 공정검사와 연계되나 **검사 성적서(파일) 관리** 화면 미흡 |
| MBD0019A4F6 | 유/무검사 전환 이력관리 | **유무검사 전환 이력** 전용 화면 부재 |
| MBD0016F22B | 샘플검사 이력 관리 | **샘플검사 이력** 전용 화면 미흡 |
| MBD0023D79B / MBD0023D78C | 고객평가표·품질5스타(인바운드 스코어카드) | **고객 스코어카드(품질5스타/SQ 등급)** 관리 화면 부재 |
| MBD00280AFA | 도장 믹싱룸 공정개선 보고 | **공정개선 활동 관리** 화면 부재(시정조치와 일부 연계) |
| MBD001A8B9B | 파일(문서) 관리 | **문서/성적서 파일 보관 관리** 화면 미흡 |
| MBD0025604B | AUDIT 회의록/불량유형 현장게시 관리 | **현장 게시판(중점/불량유형 게시)** 관리 화면 부재 |
| MBD00114588 | 금형 스페어파트 관리 | 금형보유/보수와 별개 **금형 스페어파트 재고** 화면 보완 권장 |

---

## 4. 참고

- **pptx 77개**는 .pptx를 .xlsx로 개명한 **문서/프레젠테이션(설명·스냅샷) 자료**로, 대부분 표지에 `【팀즈】 / 【ERP】 / 【문서】 / 【파일】` 형태의 관리항목 제목을 달고 있다. 이들은 이미 메뉴로 존재하는 주제(부적합품·설비등록·금형관리·예방보전·검사 등)를 **중복 설명**하는 경우가 많아, 신규 메뉴 추가보다는 기존 메뉴에 대한 운영 가이드/근거 문서로 보는 것이 타당하다.
- **xlsx 60개**는 실제로 셀에 데이터를 입력·집계하는 **live 데이터 입력 양식**으로, 웹 화면(입력폼)으로 1:1 대응되어야 하는 대상이다. xlsx는 91.7%가 이미 커버되어 양식 디지털화가 사실상 완료 단계.
- 다수 중복: 비상대응 매뉴얼(MBD…7AE/7AC/7C5/7B0 등 동일 29p 문서 4부), 사출 설비 성과지표(MBD…787/24903B/796 등 동일), 사내전산 비상매뉴얼(7A7/7B1) 등 동일 주제가 여러 파일로 존재 → 메뉴 커버리지 판단에는 영향 없음.
