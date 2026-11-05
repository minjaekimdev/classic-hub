/**
 * specs/home.md 구현 정책
 * - view-003: 모바일(lg 미만) 여부 판별 — 모바일에서는 보기 모드와 무관하게 앨범형 구조로 렌더링
 */
"use client";

import { useSyncExternalStore } from "react";

/** ConcertCard의 데스크톱 분기(lg)와 동일한 1024px 기준 */
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

const subscribe = (onStoreChange: () => void) => {
  const mediaQueryList = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mediaQueryList.addEventListener("change", onStoreChange);
  return () => mediaQueryList.removeEventListener("change", onStoreChange);
};

/**
 * 데스크톱(lg 이상) 여부를 반환한다.
 * 서버/하이드레이션 전에는 모바일 기준(false)으로 계산한다 — 카드 목록은 클라이언트
 * 데이터 페칭 이후 렌더링되므로 첫 페인트 레이아웃 불일치는 발생하지 않는다.
 */
export default function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
    () => false,
  );
}
