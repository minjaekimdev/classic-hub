# ETL 파이프라인 리팩토링 로드맵 (refactor-infra)

> 목표: **크론잡이 매일 실패 없이 돌고, 실패 데이터는 artifact에 쌓이고, 재처리 가능하며, 전체가 테스트로 보호되는 상태**까지의 작업 순서와 그 이유를 정리한 문서.
>
> 표기: 각 Phase 옆의 S/M/L은 티셔츠 사이즈 추정으로, 절대 시간이 아니라 **상대적인 작업 크기**를 나타낸다.
> (S = 몇 시간~반나절, M = 1~2일, L = 3일 이상 + 불확실성 포함)

---

## 1. 현재 상태 요약

### 완료 / 온전한 것
- `getProgramJSON` zod 마이그레이션 완료 — `shared/types/gemini.ts`의 zod 스키마가 단일 진실 공급원(타입 `z.infer`, Gemini 요청 스키마 `z.toJSONSchema`, 런타임 검증 `safeParse`).
- extract flows 단위 테스트 존재: `extractPerformances`(11), `compareNewOld`(6), `getAllPerformanceIdList`(5), `getPerformanceDetailList`(5), `getPerformanceImageBuffers`(6), `getDbPerformanceIds`(4)
- transform 조각 테스트 존재: `getProgramText`(4), `getProgramJSON`(10), `splitLongImage`(7), `sanitizeImageBuffer`(8)
- Supabase 자산 존재: `supabase/migrations/`(18개, 단 `remote_schema.sql` 베이스라인이 2번 리필됨), `config.toml`, Edge Functions(`task-worker`, `delete-storage-file`) + Deno 통합 테스트 (`_tests/`)
- `.env.test` 분기 지원 (`infrastructure/supabase/client.ts`)

### 깨진 것 / 미검증 영역
| 영역 | 상태 |
|---|---|
| `syncPerformances.ts` | ❌ 컴파일 에러 ~10개 (존재하지 않는 `processPerformance` import 등) |
| `retry.ts` | ❌ 컴파일 에러 (`processPerformance` import) + 테스트 없음 |
| `failureCollector.ts` | ❌ `./types` 모듈 부재 + 어디서도 안 쓰임 |
| artifact 파일명 | ❌ **유실 버그**: 오케스트레이터는 `failed_actions.json`, 워크플로우는 `failed_records.json` 업로드 → `if-no-files-found: ignore`가 조용히 가림 |
| 재처리 경로 | ❌ package.json의 `insert-failed-performances`가 존재하지 않는 파일 참조 |
| `composeExtract.ts` | ❌ `1_extract/index.ts`와 내용 중복 |
| 매퍼·유틸 테스트 | ❌ `toDbPerformance`, `mapExternalToInternal`, `parser`, `getMinMaxPrice` |
| transform 합성 본체 | ❌ `transformPerformances.ts`(208줄, 에러 분류 로직) 테스트 없음 |
| 빈 스텁 | `transformedPerformances` (transformPerformances.ts:206) |

---

## 2. 순서를 결정한 다섯 가지 원칙

1. **의존성이 허용하는 것부터** — 위층은 아래층이 온전해야 지을 수 있다.
2. **결정이 수정보다 먼저** — "무엇으로 할지"(계약)를 정한 다음에 "고치기"를 시작한다.
3. **싼 검증이 비싼 검증보다 먼저** — 유닛 테스트(싸다)를 통과한 조각들로만 통합 테스트(비싸다)를 만든다. 조각이 검증돼 있으면 통합 실패 시 원인이 "배선 문제"로 좁혀진다.
4. **지금 새고 있는 피는 먼저 막는다** — 매일 손해가 나는 버그(artifact 유실)는 모든 순서 논리보다 우선한다.
5. **돌아가는 것 ≠ 돌아가는 걸 아는 것** — 관측성은 마지막이지만 필수다. 다만 아직 움직이는 대상(변할 `ProcessResult` 등) 위에 계기판을 먼저 지으면 재작업이므로, 기계를 고친 뒤 단다.

### 작업은 "줄"이 아니라 "의존성 그래프"다
- 화살표(의존성)가 있는 작업만 순서가 강제된다.
- 화살표가 없는 작업들끼리는 순서가 자유 — 이것이 "Track B를 병렬로"의 의미 (동시 작업이 아니라 **순서 강제가 없다**는 뜻).

---

## 3. 전체 지도

```
[트랙 A: 코드 리팩토링]
Phase 0 (잔해 정리) ──→ Phase 1 (계약 테스트) ──→ Phase 2 (export 계약)
                                                        │
[트랙 B: 테스트 인프라]                                  ▼
B1/B2 (로컬 Supabase) ────────────────────────→ Phase 3 (오케스트레이터 수리+테스트)
                                                        │
                                               Phase 4 (합성 본체 테스트)
                                                        │
                                               Phase 5 (통합 테스트 합류점)
                                                        │
                                               Phase 6 (운영 관측성)
                                                        ▼
                                               🎯 cron 구동 + 신뢰 가능

[Phase 7 (선택)] — 구동을 막지 않는 것들 (Edge Function, CI화, 스모크, 이미지 리사이징)
```

---

## 4. Phase 상세

### Phase 0 — 잔해 정리 (S, 반나절) — 지금 바로

**작업**
- `composeExtract.ts` 삭제 (1_extract/index.ts와 중복)
- artifact 파일명 상수 통합 — **진행 중인 데이터 유실 버그 수정**
- `failureCollector.ts`의 `./types` 부재 처리 (사용처가 없으므로 삭제가 기본값)
- package.json의 존재하지 않는 스크립트 참조 정리
- 빈 스텁 `transformedPerformances` 제거

**완료 판정**: tsc 에러가 orchestrator/retry 관련만 남음 (노이즈 에러 제거 → 신호 에러만 남김).

**왜 이 순서인가**
- 원칙 4: artifact 파일명 버그는 매일 실패 데이터를 조용히 유실시키는 "진행 중인 사고". 몇 줄로 막을 수 있으므로 모든 것보다 우선.
- 잔해는 미래 작업의 신호 대 잡음비를 오염시킨다. 중복 컴포지션 루트가 있으면 수리 중 "어느 쪽이 진짜인가"를 매번 판단해야 한다.
- **Phase 0의 기준은 "결정 없이 고칠 수 있는가"**. 위 항목들은 정답이 유일한 기계적 정리다.

### Phase 1 — 계약 끝단의 단위 테스트 (S~M)

**작업**: `toDbPerformance`, `mapExternalToInternal`, `parser.ts`, `getMinMaxPrice.ts` 테스트 작성.

**완료 판정**: 각 매퍼가 "입력 샘플 → 기대되는 DB 행" 테스트 통과.

**왜 이 순서인가**
- 원칙 1: 오케스트레이터 수리는 "extract 결과 → DB 행" 체인 조립이고, 그 연결점이 매퍼다. 검증된 매퍼 위에서 수리해야 수리의 전제가 옳다.
- 원칙 3: 매퍼는 순수 함수라 테스트가 가장 싸다(모킹 거의 불필요). 싼 검증을 먼저 통과시켜 뒤의 비싼 검증(통합) 실패 시 원인 특정을 쉽게 만든다.
- 테스트 성격은 **기록형**: DB 스키마가 명세라서 기대값이 저절로 정해진다. "명세를 만드는 고통"이 없어 싸다.

### Track B — 로컬 Supabase 기반 (M) — Phase 1과 병렬

**작업**
1. `supabase db reset` 클린 재생 확인 — 실패 시 마이그레이션 베이스라인 재정립 (`remote_schema.sql`이 두 번 리필된 흔적 = 체인이 순수하지 않을 가능성). 이후엔 forward-only: 스키마 변경은 항상 새 migration 파일로, 로컬은 `db reset`, 프로덕션은 `db push`.
2. `.env.test`에 로컬 스택 URL/키 설정 (client.ts 분기는 이미 구현됨).
3. 일치 검증 장치: CI에서 `supabase gen types`를 로컬 기준으로 생성해 커밋된 타입과 diff (현재의 수동 `db:gen:remote`는 보조로).

**완료 판정**: `supabase start && supabase db reset` 클린 성공 + `.env.test`로 로컬 DB 접속 확인.

**왜 병렬(독립)인가 / 왜 Phase 3 전이어야 하나**
- Track B는 애플리케이션 코드를 만지지 않으므로 Phase 0~2와 의존성이 없다 → 순서 강제가 없음(병렬의 의미).
- 단, Phase 3의 bulk insert 검증은 "진짜 DB"가 필요하므로 이 시점까지는 완료돼야 한다 (유일한 화살표).
- 리스크가 가장 큰 작업(마이그레이션 체인 문제가 터질 수 있음)일수록 일찍 시작해 일찍 놀란다 — 한 줄의 끝에 두면 문제가 터졌을 때 임계경로가 통째로 밀린다.

### Phase 2 — transform export 계약 확정 (S)

**작업**: 항목당 처리 함수의 이름·시그니처 확정 (`processPerformance`), 빈 스텁 정리, retry/syncPerformances가 의존할 인터페이스 확정.

**완료 판정**: `processPerformance`(또는 확정된 이름)가 타입상 존재, retry.ts 컴파일 가능.

**왜 이 순서인가**
- 원칙 2: retry.ts와 syncPerformances.ts 두 파일이 모두 존재하지 않는 `processPerformance`를 import 중 — 이것은 "고장"이 아니라 **아직 안 내려진 결정이 타입 에러로 표현된 것**.
- 하류의 모든 코드가 영향받는 결정일수록 독립된 체크포인트로 둔다. 수리 중간에 암묵적으로 정하면 transform 내부 구조와 맞는지 검토 없이 흘러간다.

### Phase 3 — 오케스트레이터 + retry 수리 (M~L) — 로드맵의 심장

**작업**
- `retry` 수리 + DI 전환: `retry(failures, maxRepeat, deps)` — `processPerformance`/`sleep` 주입 (extract flows의 기존 패턴 재사용)
- `syncPerformances` 수리 + 유닛 테스트
- **테스트 동반 원칙**: 코드를 고치기 전에 시나리오를 숫자로 확정한다 (예: "maxRepeat=3 → 재시도 3회, 대기 2/4/8분, 이후 포기"). 시나리오가 곧 명세가 되고, 코드는 명세를 증명하는 쪽이 된다. "먼저 고치고 나중에 테스트"는 코드를 보고 테스트를 쓰게 되어 테스트가 코드의 거울(믿음의 반향)이 된다.
- 함께 처리: `ProcessResult`에 `failedAt`/`attempts` 추가, `console.log` → logger 통일, 로그는 요약만(전체 데이터는 artifact로)
- Track B 덕분에 가능한 것: bulk insert를 **로컬 DB의 `upsert_performances_bulk` RPC 실호출**로 검증 (첫 DB 통합 테스트)

**완료 판정**: 오케스트레이터/retry 유닛 테스트 통과 + 로컬 DB에 실제 행이 쌓임 + **tsc 에러 0**.

**왜 이 순서인가**
- 임계경로: "파이프라인이 돌아가는 것"을 막고 있는 유일한 조립부.
- 테스트 강도 기준에서 retry는 3개 기준(명세 모호성: off-by-one/백오프/종료조건, 폭발 반경: 조용한 데이터 유실, 변경 성격: 결정형)을 **전부** 최상위로 만족하는 코드라 가장 강한 검증이 필요.
- sleep 주입 같은 DI 전환은 동작을 바꿀 수 있는 수술이므로 명세 테스트가 보호막 역할을 한다.

### Phase 4 — transform 합성 본체 테스트 (M)

**작업**: `transformPerformances`(208줄)의 에러 분류(`OCRError`/`GeminiError`/`SharpError`/`StorageError`)별 시나리오 테스트. deps 주입 패턴 그대로.

**완료 판정**: 각 에러 코드별로 `{id, error, data: null}` 반환 보장.

**왜 이 순서인가**
- 중요하지만 "파이프라인 구동"의 임계경로는 아니다. 임계경로(Phase 3)를 먼저 잠그고 보강을 붙여야 목표 도달 시간이 최소화된다.
- 테스트 성격은 기록형(이미 동작 중) + 일부 결정형(`ProcessResult` 모양)의 혼합.

### Phase 5 — 통합 테스트 합류점 (M)

**작업**: msw 통합 테스트 — KOPIS/Gemini/Vision은 네트워크 경계에서 가짜, 나머지 전부 진짜, **쓰기는 로컬 DB에 실제 행**.
- `onUnhandledRequest: "error"`로 의도치 않은 실제 외부 호출 차단
- 실제 Gemini 응답을 픽스처로 축적 → `programExtractionSchema` 통과 여부를 확인하는 **계약 테스트**로 활용
- 경계 판단 기준: "Docker로 재현 가능한가" — Supabase는 재현 가능하므로 가짜가 아니라 로컬의 진짜가 된다. KOPIS/Gemini/Vision은 재현 불가하므로 msw.

**완료 판정**: "픽스처 공연 → 로컬 DB에 완성된 행" 단언 테스트 1개 통과.

**왜 이 순서인가**
- 원칙 3의 정점: 조각들이 전부 유닛 검증된 뒤에야 통합 실패가 "배선 문제"로 좁혀진다. 미검증 조각으로 통합 테스트를 먼저 만들면 실패 시 어디가 문제인지 모르는 Blind 디버깅이 된다.

### Phase 6 — 운영 관측성 완성 (M)

**작업**
- artifact 재처리 스크립트 구현 (`gh run download` → upsert, 멱등) — Phase 0에서 정리한 깨진 참조의 실체 만들기
- Slack을 실행 단위 요약 알림으로 개편 (성공 42/실패 3 + 유형별 집계 + artifact 링크), 성공 시에도 조용히 1건 (크론 스킵 감지)
- `sendSlackNotification`의 실패 처리 일관화 (환경변수 없을 때 throw 대신 로그)
- 치명적 실패 시 `process.exitCode = 1` — Actions가 실패로 표시되게
- CI 편입: PR마다 유닛+통합, DB 테스트는 조건부

**완료 판정**: 수동 `workflow_dispatch`로 실제 크론 경로 1회 성공 + 실패 주입 시 artifact 적재·알림 확인.

**왜 이 순서인가**
- 원칙 5: "돌아가는 것 ≠ 돌아가는 걸 아는 것". cron잡의 신뢰성은 "조용히 실패하지 않게 하는 것"에서 나온다.
- 마지막인 이유: 재처리 스크립트 등은 `ProcessResult` 모양에 의존하는데 Phase 3에서 그 모양이 바뀐다. 움직이는 대상 위에 지으면 재작업. 기계를 고친 뒤 계기판을 단다. 단, 마지막이지 선택이 아니다.

### Phase 7 — 파이프라인 구동 후 (선택)

- Edge Function 테스트 복구·로컬화 (`_shared/supabaseAdmin.ts` 부재로 현재 실행 불가 — 로컬 스택(54321)을 향하도록)
- 마이그레이션 단일 소스 CI화 (types diff)
- 주간 클라우드 스모크 (읽기 위주, `workflow_dispatch`)
- 이미지 리사이징 재검토 (S3 이전은 보류 결정 — 리사이징으로 용량 원인 제거가 선행 후보)

**왜 뒤인가**: 전부 "파이프라인 구동"을 막지 않는다. 블로킹이 아닌 작업을 앞에 두면 목표 도달이 늦어진다. 뒤로 미루되 목록에 명시적으로 남겨 미루는 것과 잊는 것을 구분한다.

---

## 5. 테스트 강도 기준 (어디에 얼마나 쓸 것인가)

"명세가 코드보다 먼저여야 한다"는 원칙은 모든 로직에 보편적이지만, **강도는 배분**한다. 세 가지 기준:

| 기준 | 낮음 → 높음 |
|---|---|
| 명세 모호성 | DB 스키마가 답을 주는 매퍼 ↔ off-by-one/타이밍이 있는 retry |
| 폭발 반경 | 눈에 보이는 이상 행 ↔ 조용한 데이터 유실 |
| 변경 성격 | 기록(이미 동작) ↔ 결정(동작이 미정) |

- 기록형(매퍼): 싸다 — 스키마 보고 기대값 적으면 끝
- 결정형(retry): 시나리오 확정이 곧 설계 — 테스트 순서가 품질을 결정

---

## 6. 검증 관련 결정 사항 기록

- **빈 응답 체크 유지** (`getProgramJSON`의 `if (!response?.text)`): zod는 "파싱된 JSON의 구조"를 검사하는 층위이고, 이 체크는 "전송 계층의 이상"을 방어하는 다른 층위다. 삭제해도 최종 결과(`GeminiError`)는 같지만 원인 추적 로그 품질이 떨어지고, 이후 재시도 정책의 분류 기반이 된다.
- **S3 이미지 이전 보류**: 용량 문제의 원인 진단(상세 이미지 원본 저장 → 리사이징 후보)이 선행. 이전한다면 DB에 URL이 아닌 **객체 키**를 저장하도록 설계해 다음 이전을 공짜로 만든다.
- **syncPerformances의 타입 에러를 Phase 0에 넣지 않은 이유**: 그 에러들은 고장이 아니라 미결정 계약이 타입 에러로 표현된 것. Phase 0에서 억지로 컴파일만 통과시키면 실제 남은 일은 그대로인데 실패 신호만 사라지는 "가짜 초록불"이 된다. 깨져 있지만 정직한 상태가 더 낫다.
