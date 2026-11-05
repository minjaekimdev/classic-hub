---
name: 검색 결과 0건 & Not Found (데스크톱)
tone: prototype/홈페이지 수정안(데스크톱) — navy+gold 팔레트, Pretendard·Josefin Sans, 라인 아이콘
screen: code.html
---

## 이 시안에 대하여

예외 화면 2종(검색 결과 0건, not-found)을 `홈페이지 수정안(데스크톱)`과 동일한 톤으로
정의한 시안이다. `code.html` 우측 상단의 스위치로 두 상태를 전환해 확인할 수 있다.

기존 `no-result/`, `not-found(데스크톱|모바일)/` 구 시안(구 디자인 시스템 톤)을 대체하며,
구 시안 폴더는 정리되었다.

## 구성과 specs 대응

| 상태 | 내용 | specs |
|---|---|---|
| 검색 결과 0건 | 결과 헤더(총 0건) + 빈 결과 안내(아이콘·"조건에 맞는 공연이 없습니다"·재검색 안내) + **검색 필터 초기화** 버튼. GNB·히어로·검색 패널·툴바는 홈 화면과 공통(상태 탭 건수는 0 표기) | exception-03, search-007 |
| Not Found | "404" 디스플레이(Josefin, gold 포인트) + 안내 문구 + **홈으로 가기**(primary) / **이전 페이지로**(secondary). GNB·푸터는 사이트 공통 레이아웃 유지 | exception-01, exception-02 |

## 정책 메모

- 0건 화면의 '검색 필터 초기화'는 검색어·공연 상태·관람 기간·정렬 기준을 모두 초기화한다(search-007).
- not-found는 app/not-found.tsx 라우팅으로 진입한다(exception-01: 잘못된 경로, exception-02:
  clamp 불가능한 요청). 유효 범위 내 요청은 clamp로 처리되어 not-found에 도달하지 않는다.
- 모바일 전용 변형(바텀시트 등)은 없음 — 두 화면 모두 콘텐츠 중심의 단일 컬럼 구조라
  데스크톱 시안을 그대로 축소 대응 가능. 필요 시 별도 시안으로 추가한다.
