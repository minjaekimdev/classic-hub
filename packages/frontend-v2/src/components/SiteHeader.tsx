/**
 * specs/home.md 구현 정책
 * - head-001: 헤더 우측에 향후 탐색 가능한 기간 출력 (BROWSABLE_MONTHS)
 * - feedback-002: 모바일용 '피드백' 버튼(FeedbackHeaderButton) 마운트
 */
import Link from "next/link";
import { BROWSABLE_MONTHS } from "@/lib/period";
import { FeedbackHeaderButton } from "@/components/ServiceFeedback";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center font-serif text-headline-sm font-semibold tracking-widest text-primary md:text-headline-md md:tracking-wider"
        >
          OPUS
        </Link>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-sm border border-outline-variant bg-surface-container-low px-2.5 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
            <span className="text-[10px] leading-none tracking-tight text-on-surface-variant md:font-label-caps md:leading-none md:tracking-wider">
              향후 {BROWSABLE_MONTHS}개월간 공연 편성 데이터 탐색 가능
            </span>
          </div>
          <FeedbackHeaderButton />
        </div>
      </div>
    </header>
  );
}
