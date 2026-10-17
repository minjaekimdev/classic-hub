# Frontend-v2 설계 결정 문서

이 문서는 홈페이지 프로토타입을 React로 전환하는 과정에서 논의된 설계 결정과 그 근거를 정리한다.
스택: **Next.js (App Router) + TanStack Query + nuqs**

---

## 1. 상태 관리: 두 종류의 state

| | UI state | 서버 state |
|---|---|---|
| 예시 | 검색어, 필터, 정렬, 페이지 | 공연 목록 데이터 |
| 주인 | 브라우저(우리) | 서버 (클라이언트는 캐시) |
| 특징 | 항상 신선함 | 오래될 수 있음(stale), 로딩/에러가 세트 |

### HomePageState — 페이지가 유일하게 소유하는 state

```ts
interface HomePageState {
  query: string;
  statusFilter: 'all' | 'ongoing' | 'upcoming';
  dateRange: { start: string; end: string };
  sortBy: 'imminent' | 'price_asc' | 'price_desc';
  page: number;
}
```

**핵심 원칙**
- state는 **한 곳**(페이지 컴포넌트/훅)에서만 소유한다. 컴포넌트를 분리해도 state 분리가 아니다 — 관리 포인트는 state의 수로 결정된다.
- **파생값은 저장하지 않고 계산한다.** `hasValue = query.length > 0`, 필터링/정렬/페이징 결과 모두 파생값.
- 계산 순서는 **필터 → 정렬 → 페이지**. 결과 개수("총 N건"), 페이지네이션, 빈 결과 화면이 전부 이 계산에서 파생된다.

### 정렬 state가 페이지에 있는 이유
1. 순서는 카드가 아니라 **목록의 속성** — 카드 컴포넌트에 둘 자리가 없다.
2. 스케일업 시 정렬은 **서버 요청 파라미터**가 되어 필터와 같은 요청이 된다.
3. `sortBy`를 필요로 하는 컴포넌트들(SortSelect, 목록, Pagination)의 **공통 조상**이 페이지다.
4. 정렬 변경 시 페이지 1 리셋 등 **state 간 상호작용**은 소유자 한 곳에서 처리해야 한다.

---

## 2. 컴포넌트 설계 원칙

### CSS와 JS state의 경계
- **겉모습만 바뀌는 것** → CSS 가상 클래스(`:focus`, `:focus-within`, `:hover`)로 처리. JS state 불필요.
- **무언가를 "하는" 것** → JS state/코드. (드롭다운 열기, blur 시 유효성 검사, X 클릭 후 재포커스)

### Controlled component 패턴
- 하위 컴포넌트는 state를 갖지 않고 `value` + `onChange` props만 받는다.
- 데이터는 아래로(props), 이벤트는 위로(onChange) — 단방향.
- **UI 컴포넌트 분리는 자유롭게, state 소유는 한 곳.** 화면 배치(디자인)와 state 소유(아키텍처)는 독립적 결정이다.

### 필터링 책임 위치
- `status`는 **공연 데이터의 필드**(서버 응답)이고, 카드는 이를 받아 그릴 뿐.
- **필터링은 부모(페이지)가 하고, 걸러진 것만 카드에 내려준다.**
- 카드 안에서 자기 자신을 숨기면(`return null`) "총 N건" 계산, 페이지네이션, 빈 화면 판단이 흩어진다.
- 배지 스타일은 status → 스타일 매핑으로 처리:

```ts
const badgeStyles = {
  ongoing:  'bg-secondary-container/90 text-on-secondary-container border-secondary',
  upcoming: 'bg-surface-container-high text-primary border-outline',
};
```

---

## 3. 데이터 흐름: URL이 SSOT

```
URL (의도의 저장소, 브라우저 관리)
  ↕ 읽기/쓰기 — useHomePageState 훅
HomePageState (조율자)
  ↘ queryKey            ↘ state, actions
TanStack Query (응답 캐시)   SortSelect, StatusTabs, ConcertCard... (뷰)
  ↘ HTTP
서버
```

### URL을 SSOT로 하는 이유 (공유 기능만이 아님)
- **뒤로가기**가 필터를 되돌려줌 (사용자의 본능적 기대)
- **새로고침**에도 필터 유지
- **딥링킹**: 광고/알림 → 특정 필터 적용 화면 직행
- **SSR/SEO**: 서버가 URL만 보고 렌더링 판단
- **디버깅 재현**: 링크 하나로 버그 상황 공유
- 브라우저가 이미 관리하는 유일한 영구 저장소 — 비용 대비 이득이 압도적

### URL에 넣는 state의 경계
- **넣는다**: 화면의 정체("무엇을 보여주는가")를 정의하는 것 — q, status, sort, page, dateRange
- **안 넣는다**: 포커스, 드롭다운 열림, 호버 등 순간의 UI 상태
- state를 메모리에 **복제하지 않고 URL에서 직접 파생**(useState 이중 소유 금지) — 동기화 버그 원천 차단
- 모든 변경(사용자 조작, 뒤로가기, 링크)이 "URL이 바뀐다"는 단일 진입점으로 흐른다

---

## 4. 서버 페이지네이션

- 서버는 **해당 페이지 항목 + 메타(total, totalPages)**만 응답. 전체를 주지 않는다.
- 페이지네이션 UI("총 N건", 다음 버튼 활성화)는 이 메타로 그린다.
- 방식: 번호 페이지네이션이면 **오프셋 방식**(`page`/`size`)이 무난. 데이터 중간 삽입에 강한 커서 방식은 인피니트 스크롤용.
- 전체를 받아도 되는 것: 유한하고 작은 목록(필터 옵션, 지역 목록 등).

### 페이지 크기: 10 (데스크톱/모바일 동일)
판단 기준:
1. **콘텐츠 밀도** — 공연 카드는 매우 무거움(포스터+프로그램+가격) → 상한 10
2. **탐색 행동** — 대부분의 사용자는 1~3페이지를 넘지 않음. 첫 페이지의 정렬 품질이 개수보다 중요
3. **성능** — 첫 페이지는 가볍게 (LCP)
4. **관행** — 검색 서비스 표준이 10

운용 규칙:
- `PAGE_SIZE = 10` 상수로 한 곳에 정의
- 서버가 `size` 상한 clamp (`Math.min(size, 50)`) — 클라이언트 파라미터는 신뢰하지 않음
- 출시 후 PostHog로 2페이지 이동률/스크롤 깊이 측정 후 조정

---

## 5. TanStack Query 설계

### 쿼리 키 규칙
```ts
['concerts', { query, statusFilter, dateRange, sortBy, page }]  // 목록
['concert', 'detail', concertId]                                 // 상세 (추후)
```
- `[리소스, 파라미터]` 계층 구조. 키에는 "요청을 결정하는 것"만.
- HomePageState가 곧 queryKey — 필터 변경 → 키 변경 → 새 요청/캐시.

### 캐시 정책
- `staleTime: 5분` — 공연 편성 데이터는 실시간성이 낮음 (KOPIS 주기 갱신)
- `placeholderData: keepPreviousData` — 페이지 이동 시 목록 깜빡임 방지 (`isPlaceholderData`로 흐림 처리)

### 구조 (api와 queries의 분리)
```
src/api/concerts.ts        # 순수 fetch 함수 + 응답 타입 (라이브러리 모름)
src/queries/useConcerts.ts # useQuery 래퍼 + queryOptions (staleTime 등)
```
- 페이지는 `useConcerts(state)` 한 줄만 호출.
- 응답 타입: `{ items: Concert[], total, page, totalPages }`

### 재시도 정책 (기본값 수정)
```ts
retry: (failureCount, error) => {
  if (error.status >= 400 && error.status < 500) return false; // 4xx는 재시도 없음
  return failureCount < 3; // 5xx/네트워크는 백오프 재시도
}
```

### Mutation — 오류 제보
- 읽기는 query, 쓰기는 mutation.
- 성공 후 **무효화할 캐시가 있는지** 판단: 제보는 공연 데이터를 바꾸지 않으므로 invalidate 불필요.

---

## 6. 에러 처리 설계

### 에러 분류

| 발생 위치 | 예 | 대응 |
|---|---|---|
| 네트워크 | 오프라인, 타임아웃 | 안내 + 재시도 버튼 |
| 서버 4xx | 400, 429 | 400→Sentry(버그 지표), 429→"잠시 후 재시도" |
| 서버 5xx | 500/503 (Supabase) | 자동 재시도 + 백오프 |
| 데이터 품질 | 포스터 누락, 취소 공연, URL 만료 | 대체값 표시 + **오류 제보** 수집 |
| 클라이언트 | null 크래시 | 방어적 렌더링, ErrorBoundary |
| URL 조작 | `?page=99999`, `?sort=xyz` | 파서에서 정규화 (nuqs) |

### 핵심 구분: 0건 vs 404
- **검색 결과 0건 = 200 OK + `items: []`** — 에러가 아니라 성공 응답. "조건에 맞는 공연이 없습니다" 빈 상태 UI.
- **404 = 요청한 리소스 없음** — 상세 페이지의 없는 ID 접속 등.

### 현재 범위 (YAGNI 적용)
- 상세 페이지가 없으므로 **리소스 단위 404는 현재 발생 불가** — 구현하지 않음.
- 지금 하는 것: ① `app/not-found.tsx` (잘못된 URL용, 라우트 수준) ② 0건 빈 상태 UI ③ 400/429/5xx 대응
- 429 예방: 검색 중 버튼 disabled + TanStack Query dedupe + 입력 디바운스(300~500ms)
- 원칙: **에러 처리도 기능이다 — 기능이 없으면 에러 처리도 없다.** 상세 페이지 추가 시 그 이슈에 404 설계 포함.

---

## 7. Next.js (App Router) 폴더 구조

```
packages/frontend-v2/
├── next.config.ts
├── public/
└── src/
    ├── app/                      # ★ 주소만 정의 — 최대한 얇게
    │   ├── layout.tsx            #   <html>/<body> + <Providers>
    │   ├── page.tsx              #   "/" → <HomePage /> 렌더만
    │   ├── not-found.tsx
    │   └── concerts/[id]/page.tsx  # 상세 (추후)
    ├── home/                     # ★ 홈 화면의 모든 로직
    │   ├── HomePage.tsx          #   state 소유 + 조립 ("use client")
    │   ├── useHomePageState.ts   #   nuqs 파싱 + state 로직
    │   └── components/           #   이 페이지 전용 (SearchBar, StatusTabs,
    │                             #     DateRangePicker, SortSelect,
    │                             #     ConcertCard, Pagination)
    ├── api/                      # 순수 fetch (라이브러리 독립)
    ├── queries/                  # queryClient.ts(팩토리), useConcerts.ts
    ├── components/               # 2개 이상 화면에서 재사용되는 범용 UI만
    ├── lib/                      # providers.tsx, urlState.ts
    └── types/                    # concert.ts
```

### App Router 규칙/함정
- **`pages/` 폴더명 금지** — Pages Router로 해석됨. → `home/` 등 도메인 폴더 사용
- `app/`은 라우팅만, 로직은 밖으로 (주소 변경과 화면 로직 변경의 분리)
- Providers(QueryClientProvider + NuqsAdapter)는 `"use client"`
- **QueryClient는 팩토리로 생성** — 모듈 최상단 생성 시 SSR에서 모든 요청이 캐시 공유하는 사고 발생
- nuqs 파서가 URL 검증을 담당: `parseAsInteger.withDefault(1)` → `?page=abc` 자동 정규화
- `loading.tsx`/`error.tsx`는 렌더링 크래시의 최후 방어선 (데이터 로딩은 TanStack Query의 isPending이 담당)

### FSD 채택 안 함 (의사결정)
- 이 규모(홈 검색 + 추후 상세/제보)에 7레이어 구조는 복잡도 역전.
- 유지하는 대신 지킬 것: 의존성 단방향 `home/ → queries/ → api/`, `lib/`, `types/` (리뷰로 강제)
- FSD 재고 트리거: 페이지 5개 초과 + pages 간 복붙 발생 / 다수 동시 작업 충돌 / 컴포넌트 소속 논쟁 상습화

---

## 8. 렌더링 전략

- 검색 페이지는 필터 조작이 많아 사실상 전부 클라이언트("use client" HomePage).
- **v2 초반: CSR + TanStack Query 캐시로 충분.**
- SEO가 중요해지면 서버 prefetch + `HydrationBoundary`로 확장 — 그때 `app/page.tsx`만 수정하면 되도록 구조 분리.

### 가상 스크롤 불필요 (의사결정)
- 가상화는 **데이터 페칭 전략이 아니라 렌더링 기법** (페이지네이션의 대안이 아님)
- 서버 페이지네이션으로 DOM이 항상 10개 수준 → 최적화 대상 없음
- 카드 높이 불균일 + Ctrl+F/접근성/크롤링 이슈로 오히려 불리
- 판단 기준: "DOM에 수천 개가 올라오는가?" — 아니오: 일반 렌더링
- UX 근거: 검색 아카이브 사용자는 비교·선택이 목적 → 위치/총량을 아는 번호 페이지네이션이 피드형(인피니트)보다 적합

## API 설계
- DB의 performances_with_program_view 뷰를 참고하여 api를 구현할 것

---

## 유의사항
- 설계 문서와 정책을 바탕으로 컴포넌트 구현 시 화면 디자인은 frontend-v2/prototype을 참고할 것
- frontend-v2/prototype/홈페이지(데스크톱)/code.html에는 페이지가 여러개인 경우의 디자인도 하단에 포함되어 있음
- 검색 결과가 0건인 경우의 ui는 frontend-v2/prototype/no-result 참고
- 404 에러 시 ui는 frontend-v2/prototype/not-found(데스크톱), frontend-v2/prototype/not-found(모바일)을 참고할 것