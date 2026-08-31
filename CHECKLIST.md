# Infra

## **📅 1일차 오전 — Phase 1: 인프라 위생**

- [ ]  1-1. 루트 **`.nvmrc`** 생성 (**`20`**) + 두 워크플로우 **`node-version-file`** 통일
- [ ]  1-2. 화석 lockfile 2개 삭제 (**`packages/backend|frontend/package-lock.json`**)
- [ ]  1-3. **`npx syncpack fix-mismatches`** (typescript **`~5.8.3`** 수동 확인)
- [ ]  1-4. frontend에서 **`xml-js`** 제거
- [ ]  1-5. backend에 **`"@classic-hub/shared": "*"`** 선언 추가
- [ ]  1-6. backend에 **`"build": "tsc --noEmit"`** 추가
- [ ]  1-7. CI: 루트 **`npm ci`**로 수정 (실행 step의 working-directory는 유지)
- [ ]  1-8. CI: **`cache: npm`** 추가
- [ ]  1-9. CI: **`timeout-minutes`** + **`concurrency`** 추가
- [ ]  1-10. pre-push에 **`syncpack check`** 게이트 추가
- [ ]  1-11. 검증: **`npm ci`** ✅ / **`syncpack lint`** ✅ / **`turbo run build`** ⏳ (아래 🚨 마이그레이션 완료 후 재검증) / 테스트 ⏳

### 🚨 마이그레이션 잔여 작업 (1-11 검증 중 발견 — 긴급)

> 7/21 `transform 단계 리팩토링` 커밋 이후 **두 크론잡(performance/ranking) 모두 런타임에서 import 실패로 즉시 크래시**하는 상태로 확인됨 (tsx 실행 재현 완료). 새 DI 팩토리 아키텍처로 마이그레이션을 완료해야 함.

- [ ]  `syncPerformances.ts` 재작성 — 신버전 `extractPerformances` (4인자, `{performances, idsToDelete}` 반환) ↔ `createTransformPerformances` 팩토리 연결. 현재 구버전 호출(`processPerformance`, `../shared/retry`, 미선언 변수 다수) 혼재
- [ ]  transform 팩토리와 extract 반환값 간 데이터 흐름 결정 — extract는 `InternalPerformance`(버퍼 포함, 이미지 페칭 완료)를 주고 transform 팩토리는 `PerformanceDetail`(이미지 자체 페칭)을 기대함. 중복 페칭 제거 방향으로 설계 필요
- [ ]  `services/retry.ts` — `processPerformance` import 제거, processor 함수를 파라미터로 주입받도록 수정 + `../2_transform` → `../use-cases/2_transform` 경로 수정
- [ ]  `use-cases/scripts/updateRanking.ts` — `../fetchers/getRanking` → `../1_extract/infra/getRanking` + `createGetRanking(kopisService)` 팩토리 적용
- [ ]  `uploadPosterToStorage.ts`/`uploadDetailImagesToStorage.ts` — `STORAGE_NAME` import를 `@/application/constants/limits` → `../3_load/constants`로 수정
- [ ]  `services/failureCollector.ts` — 존재하지 않는 `./types` 해소 (`FailedRecord`, `Step` 타입 정의)
- [ ]  legacy 스크립트 2건 (`application/scripts/extractPerformances.ts`, `insertFacility.ts`) — 죽은 import 경로. 삭제 또는 수정 결정
- [x]  깨진 테스트 수정 — `saveFailuresToArtifact.test.ts` (시그니처 drift 4건, tmp 경로 사용 개선) + `getProgramText.test.ts` (빈 파일 → 실제 테스트 3건 작성). **47/47 통과**

## **📅 1일차 오후 — Phase 0: 기준선 측정**

- [ ]  0-1. 스테이지별 계측 (extract / transform / load)
- [ ]  0-2. 이미지 크기 분포 수집
- [ ]  0-3. Vision 호출 수·응답시간 계측
- [ ]  0-4. Gemini 토큰·응답시간 계측
- [ ]  0-5. Storage 업로드 시간 계측
- [ ]  0-6. 고정 데이터셋 지정 + E2E 총시간 측정
- [ ]  0-8. Vision 정확도 비교용 ground truth 구축 (고정 데이터셋의 작곡가·작품명 등 필드별 정답 라벨 작성 — 사람이 검수)
- [ ]  0-9. Vision OFF(텍스트 전용 경로) vs ON 동일 데이터셋 실행 → 필드별 정확도 산출 (exact match율 + 정규화 후 유사도, 예: 편집거리 ≥ 0.9를 일치로 인정) → **`BASELINE.md`** 기록
- [ ]  0-7. **`BASELINE.md`** 작성

## **📅 1일차 저녁 — 테스트 안전망**

### **Part A — env 체계**

- [ ]  A-1. **`.env.example`** 작성
- [ ]  A-2. **`.env.test`** 생성 (로컬 docker 크레덴셜 — 테스트가 운영을 향하는 위험 제거)
- [ ]  A-3. **`.gitignore`** **`.env*`** + **`!.env.example`** 확인
- [ ]  A-4. **`NODE_ENV=test`** 실행 시 로컬 향하는지 로그 검증

### **Part B — RPC/뷰 검증**

- [ ]  B-1. 뷰/RPC 목록 추출 (migrations 스캔)
- [ ]  B-2. 각 RPC 호출→형태 검증 테스트 (로컬 docker)
- [ ]  B-3. Edge Function Storage 경로 커버 점검

## **📅 2일차 오전 — 성능 최적화 (각각 격리 + 재측정)**

- [ ]  4a-1. sharp 리사이즈 (최대장변 2000px, q80)
- [ ]  4a-2. OCR 품질 회귀 검증 (전후 텍스트 비교 — 0-8의 ground truth 재사용해 정확도 수치로 비교)
- [ ]  4a-3. 재측정 → BASELINE.md 기록
- [ ]  4b-1. **`thinkingBudget: 0`** 적용
- [ ]  4b-2. 출력 품질 비교 기록
- [ ]  4b-3. 재측정 → BASELINE.md 기록
- [ ]  4b-4. (필요시) **`thinkingBudget: 1024`** 백업안

## **📅 2일차 오후 — Part S: 중복 일원화 ← 신규**

> 원칙: **"같은 것은 하나로, 다른 것은 이름을 다르게."** KOPIS 원본 DTO와 내부 모델은 **다른 것이므로 통합 대상이 아니고**, 복제(동일 내용)만 제거해요.
> 

### **S-1군: BookingLink 3중 정의 해소**

- [ ]  S-1-1. **`1_extract/types/index.ts`**의 **`BookingLink`** **삭제** → **`backend/shared/types/kopis.ts`** 것을 import로 대체 (완전 동일한 복제본이므로)
- [ ]  S-1-2. **`InternalPerformance`**의 **`bookingLinks`** 필드가 kopis 타입을 참조하도록 수정 + **`tsc --noEmit`** 통과 확인
- [ ]  S-1-3. **`shared/types/common.ts`**의 **`BookingLink`**(name/url)는 유지하되 **이름 변경 검토** (예: **`BookingLinkRef`**) — KOPIS DTO와의 혼동 영구 차단. 단, frontend 사용처가 있으니 영향 범위 확인 후 진행

### **S-2군: PerformanceSummary 이중 정의 정리**

- [ ]  S-2-1. 양쪽 정의의 사용처 전수 조사 (backend kopis DTO vs shared 내부 모델)
- [ ]  S-2-2. 내부 모델 쪽(**`shared/types/client.ts`**)을 **`PerformanceSummary`** 유지, KOPIS DTO 쪽을 **`KopisPerformanceSummary`**로 리네임 (또는 그 반대 — 사용 빈도 낮은 쪽 변경)
- [ ]  S-2-3. **`tsc --noEmit`** + 기존 테스트 통과 확인

### **S-3군: 폴더 구조 일원화**

- [ ]  S-3-1. **`backend/shared`** → **`backend/common`** 리네임 (루트 **`packages/shared`**와의 동명 혼동 제거)
    - 대상: **`tsconfig.json`** paths(**`@/shared/*`** → **`@/common/*`**), 전체 import 경로 교체
    - 조사 결과 import 지점이 많으니 일괄 치환 후 **`tsc`**로 검증
- [ ]  S-3-2. phantom import 정상화: **`@classic-hub/shared`** import 7곳이 1-5의 선언으로 정당화됐는지 재확인

### **S-4군: supabase 폴더 마무리 점검 (기존 구조 존중)**

- [ ]  S-4-1. **`infrastructure/supabase/`**에 client/database/storage/storage 이미 잘 모여 있음을 확인 — 신규 폴더 만들지 말고 **유지 결정만 기록**
- [ ]  S-4-2. **`database.ts`** 내 TODO 주석 정리 (**`IDatabaseService`** 인터페이스의 **`resetData(table, id)`** 시그니처 개선 여부 결정)
- [ ]  S-4-3. **`any[]`** 반환 타입(**`getRowsByIs`**, **`getRowsByEq`**) 제네릭 강화 — 시간 남을 때만

### **S 검증 공통**

- [ ]  S-V. 각 군 완료 시: **`tsc --noEmit`** + 기존 유닛테스트 + B 파트 RPC 테스트 전량 통과

## **📅 2일차 오후 (后半) — Part C+D: 스테이징 + 자동화**

- [ ]  C-1. 스테이징에 **`supabase db push`**
- [ ]  C-2. RPC 테스트 스테이징 env로 재실행
- [ ]  C-3. 로컬 ↔ 클라우드 차이 기록
- [ ]  D-1. **`test-backend.sh`** **`-target=local|staging`** 지원
- [ ]  D-2. 주 1회 스테이징 워크플로우
- [ ]  D-3. **`if: failure()`** Slack 알림
- [ ]  D-4. PR 검증 CI 신규 작성

## **📅 2일차 저녁 — 마무리**

- [ ]  M-1. 동일 데이터셋 전체 재측정
- [ ]  M-2. BASELINE.md 전후 비교표 완성
- [ ]  M-3. 다음 백로그 기록 (아래 항목들)

## **📋 다음으로 미룸**

- [ ]  Vision 배치 호출 (4c)
- [ ]  ETL 파이프라인 병렬화 (4d) — S 완료 후 안전하게
- [ ]  pnpm/catalog 전환 검토
- [ ]  **`parser.ts`**의 알리아스 제거 (S-1-3 완료 시 자연 해소될 수도)

# Frontend

- [ ]  FSD 폴더구조 리팩토링
- [ ]  테스트 코드 리팩토링
    - [ ]  storybook 걷어내고 playwright galleries 활용하기
- [ ]  코드 리팩토링
- [ ]  성능 최적화
    - [ ]  상세 페이지 LCP, CLS 개선
    - [ ]  결과 페이지 더미 데이터 + 가상 스크롤 적용
    - [ ]  전반적인 웹 바이탈 최적화