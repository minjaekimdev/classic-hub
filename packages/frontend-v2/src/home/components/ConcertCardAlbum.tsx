/**
 * specs/home.md 구현 정책
 * - common-001: 공연 상태('공연중'/'공연예정') 배지 표기
 * - search-008: 검색어와 일치하는 곡을 프로그램 영역 메인으로 표시
 * - card-003: 홀 이름 첫 줄, 상세 주소 둘째 줄
 * - card-004: 공연 날짜 첫 줄, 요일/시간 둘째 줄
 * - card-005: 아티스트 라벨과 이름을 한 줄에 배치하고 줄바꿈 시 그대로 이어서 표기
 * - card-007: 프로그램/아티스트가 없으면 해당 ui 영역 전체 제거
 * - card-008/018: 프로그램 곡명 표기 규칙((외 N곡) 별도 영역, '작곡가 - 곡명')
 * - card-010 / view-004: 프로그램 hover 팝오버('외 N곡' 하단 고정, 헤더보다 낮은 z-index)
 * - card-016: 최상단 티켓 링크로 이동
 * - view-003: 모바일에서도 동일한 앨범형 구조(포스터 상단 카드)
 * - (제외 확정 2026.10.23) 러닝타임·관람연령 블록과 '프로그램 작곡가' 줄은 카드에서 표기하지 않는다 —
 *   작곡가 정보는 전체 프로그램 ui(flyout)의 작곡가 그룹 헤더로 표기
 *   (디자인: prototype/홈페이지 수정안 index-album.html — hover 시 translateY(-6px) 리프트,
 *    DESIGN.md 미결 사항 5 시연)
 */
import { useState } from "react";
import posthog from "posthog-js";
import Icon from "@/components/Icon";
import { formatPeriodRange } from "@/lib/date";
import { getProgramSummary } from "@/lib/program";
import ConcertStatusBadge from "@/home/components/ConcertStatusBadge";
import ProgramFlyout from "@/home/components/ProgramFlyout";
import ProgramReportDialog from "@/home/components/ProgramReportDialog";
import type { Concert } from "@/types/concert";

interface ConcertCardAlbumProps {
  concert: Concert;
  /** 현재 검색어 — 일치하는 곡을 프로그램 영역 메인으로 표시 (specs search-008) */
  searchQuery?: string;
}

/** 앨범형 보기 모드 카드 — 포스터 중심 요약 카드 (specs view-001, 데스크톱 전용) */
export default function ConcertCardAlbum({ concert, searchQuery = "" }: ConcertCardAlbumProps) {
  // 오류 제보 다이얼로그의 열림 상태 (순간 UI 상태)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // 프로그램 영역 파생값 — 리스트형 카드와 동일한 규칙 (specs search-008, card-008/018)
  const summary = getProgramSummary(concert.programs, searchQuery);
  const bookingLink = concert.bookingLinks[0];

  return (
    <article className="flex min-w-0 flex-col rounded-md border border-outline-variant bg-white transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-1.5 hover:border-secondary hover:z-[5] hover:shadow-[0_14px_32px_rgba(22,35,58,0.14)]">
      {/* 포스터 + 공연 상태 (리스트형과 동일한 3:4 비율) */}
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-t-[5px] border-b border-outline-variant ${
          concert.poster ? "bg-surface-container" : "bg-[linear-gradient(145deg,#6e7278,#8b8f96)]"
        } max-md:mx-auto max-md:max-w-[320px]`}
      >
        {concert.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={concert.poster}
            alt={`${concert.name} 포스터`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/85">
            <Icon name="music_note" fill size={32} />
          </div>
        )}
        <div className="absolute left-2.5 top-2.5">
          <ConcertStatusBadge status={concert.status} />
        </div>
      </div>

      {/* 요약 콘텐츠 (prototype .album-body: padding 16px 18px 18px) */}
      <div className="flex min-w-0 flex-1 flex-col px-[18px] pb-[18px] pt-4">
        <h2 className="line-clamp-2 min-h-[49px] overflow-hidden font-serif text-[17px] font-bold leading-[1.45] tracking-[-0.01em] text-primary [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
          {concert.name}
        </h2>

        {/* 공연 날짜 + 회차 (card-004) */}
        <div className="mt-1.5 flex flex-col gap-0.5 text-body-sm text-on-surface-variant">
          <span className="text-[13.5px] font-bold text-primary">
            {formatPeriodRange(concert.periodFrom, concert.periodTo)}
          </span>
          {concert.time && <p className="mt-0.5 text-[12px] text-on-surface-variant">{concert.time}</p>}
        </div>

        {/* 공연 장소: 홀 이름 첫 줄, 상세 주소 둘째 줄 (card-003). 주소 미제공 시 숨김 (card-017) */}
        <div className="mt-3 border-t border-outline-variant pt-2.5">
          <div className="flex items-center gap-1.5 text-primary">
            <Icon name="location_on" size={13} className="text-secondary" />
            <span className="text-[12px] font-bold">{concert.venueName}</span>
          </div>
          {concert.venueAddress && (
            <div className="mt-1 truncate text-[11.5px] leading-snug text-on-surface-variant">
              {concert.venueAddress}
            </div>
          )}
        </div>

        {/* 아티스트: 라벨과 이름을 한 줄에 배치 (card-005, card-007) */}
        {concert.artists.length > 0 && (
          <div className="mt-3 flex items-baseline gap-2 border-t border-outline-variant pt-2.5">
            <span className="shrink-0 font-serif text-[10.5px] font-bold uppercase tracking-[0.1em] text-secondary">
              Artists:
            </span>
            <span className="truncate text-[12.5px] font-semibold text-on-surface">
              {concert.artists.join(" · ")}
            </span>
          </div>
        )}

        {/* 연주 프로그램 (card-007: 없으면 영역 전체 제거) */}
        {summary.firstTitleLabel && (
          <div className="group/program relative mt-3 mb-3.5 rounded-md border border-[#ece5d4] bg-surface-container-low p-3 transition-colors duration-150 hover:border-secondary hover:bg-[#fffdf6]">
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-[#eae2cf] pb-2">
              <div className="flex items-center gap-1.5">
                <Icon name="queue_music" size={13} className="text-secondary" />
                <span className="font-serif text-[10.5px] font-bold tracking-[0.22em] text-secondary">
                  PROGRAM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[0.05em] text-on-surface-variant">
                  총 {summary.totalCount}곡 연주
                </span>
                <button
                  type="button"
                  onClick={() => setIsReportDialogOpen(true)}
                  title="프로그램 정보 오류 제보"
                  className="inline-flex items-center gap-1 rounded-[4px] border border-outline-variant bg-white px-2 py-1 text-[11px] font-semibold text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
                >
                  <Icon name="flag" size={12} />
                  <span>오류 제보</span>
                </button>
              </div>
            </div>
            {/* (외 N곡)은 곡명과 별도 영역, 항상 첫 줄 (card-008) */}
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <p className="font-serif text-[15px] font-semibold leading-[1.5] text-primary">
                {summary.firstTitleLabel}
              </p>
              {summary.extraCount > 0 && (
                <span className="inline-flex items-center gap-0.5 font-serif text-[12.5px] font-semibold text-secondary underline decoration-dashed decoration-[rgba(200,162,74,0.6)] underline-offset-[3px] transition-colors group-hover/program:text-primary">
                  (외 {summary.extraCount}곡)
                  <Icon name="expand_more" size={12} />
                </span>
              )}
            </div>
            {summary.firstTitleEn && (
              <p className="mt-1 font-serif text-[11.5px] italic text-outline">
                {summary.firstTitleEn}
              </p>
            )}
            {/* hover 팝오버: '외 N곡'이 속한 프로그램 박스 바로 하단, 박스 너비로 제한 (card-010, view-004) */}
            {summary.extraCount > 0 && (
              <ProgramFlyout
                programs={concert.programs}
                runtime={concert.runtime}
                searchQuery={searchQuery}
                className="absolute inset-x-0 top-full z-30 w-full"
              />
            )}
          </div>
        )}

        {/* 하단: 예매처 (card-016) */}
        <div className="mt-auto border-t border-outline-variant pt-3">
          {bookingLink && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-on-surface-variant">
              <Icon name="confirmation_number" size={14} className="text-secondary" />
              {bookingLink.name} 공식 티켓 예매
            </div>
          )}
          {bookingLink && (
            <a
              href={bookingLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                posthog.capture("booking_click", {
                  concertId: concert.id,
                  concertName: concert.name,
                  vendor: bookingLink.name,
                })
              }
              className="flex items-center justify-center gap-2 bg-primary py-2.5 text-body-sm font-bold text-on-primary transition-colors hover:bg-secondary hover:text-on-secondary"
            >
              <span>예매처 바로가기</span>
              <Icon name="open_in_new" size={15} />
            </a>
          )}
        </div>
      </div>

      <ProgramReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        concert={concert}
      />
    </article>
  );
}
