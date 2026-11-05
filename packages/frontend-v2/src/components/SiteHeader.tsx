/**
 * specs/home.md 구현 정책
 * - feedback-001/002: '서비스 의견 보내기' 버튼 — 클릭 시 데스크톱은 모달, 모바일은 바텀시트
 *   (프로토타입/홈페이지 수정안 GNB: OPUS 로고(gold U) + 서브 타이틀 + 피드백 버튼.
 *    탐색 가능 기간 안내는 head-001 갱신(삭제)에 따라 히어로 notes로 이관했다)
 */
import Link from "next/link";
import { FeedbackHeaderButton } from "@/components/ServiceFeedback";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[100] border-b border-outline-variant bg-white/95 backdrop-blur-[10px]">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-baseline gap-[9px]">
          <span className="font-serif text-[26px] font-bold tracking-[1px] text-primary">
            OP<span className="text-secondary">U</span>S
          </span>
          <span className="text-[11px] font-medium tracking-[2.5px] text-on-surface-variant">
            클래식 공연 프로그램 검색
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <FeedbackHeaderButton />
        </div>
      </div>
    </header>
  );
}
