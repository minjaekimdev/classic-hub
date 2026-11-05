/**
 * specs/home.md 구현 정책
 * - common-001: 공연 상태는 '공연중', '공연예정' 2가지만 표기한다
 *   (디자인: prototype/홈페이지 수정안 .badge — gold 배지(공연중)/navy 배지(공연예정),
 *    11.5px/700, letter-spacing -0.01em, 패딩 4px 9px, 보더 없음)
 */
import type { ConcertStatus } from "@/types/concert";

interface ConcertStatusBadgeProps {
  status: ConcertStatus;
}

const badgeStyles: Record<ConcertStatus, string> = {
  ongoing: "bg-[#c8a24a] text-[#14213a]",
  upcoming: "bg-[#16233a] text-white",
};

const statusLabels: Record<ConcertStatus, string> = {
  ongoing: "공연중",
  upcoming: "공연예정",
};

/** 리스트형/앨범형 카드가 공유하는 공연 상태 배지 (specs common-001) */
export default function ConcertStatusBadge({ status }: ConcertStatusBadgeProps) {
  return (
    <span className={`inline-block rounded-[4px] px-[9px] py-1 text-[11.5px] font-bold tracking-[-0.01em] ${badgeStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
