/**
 * specs/home.md 구현 정책
 * - common-001: 공연 상태('공연중'/'공연예정') 배지 표기
 * - search-008: 검색어와 일치하는 곡을 프로그램 영역 메인으로 표시
 * - card-001/002: 포스터 세로 중앙 정렬, 영역 크기 고정 및 비율 유지
 * - card-003: 홀 이름 첫 줄, 상세 주소 둘째 줄(데스크톱)
 * - card-004: 공연 날짜 첫 줄, 요일/시간 둘째 줄, 당일 공연은 단일 날짜
 * - card-005: 아티스트 라벨+이름 한 줄 배치, 줄바꿈 시 그대로 이어서 표기
 * - card-007: 프로그램/아티스트가 없으면 해당 ui 영역 전체 제거
 * - card-008: 프로그램 곡명 표기 규칙((외 N곡) 별도 영역, 항상 첫 줄)
 * - card-009/010: '전체 프로그램 보기'(바텀시트)·프로그램 hover 팝오버 진입점
 * - card-015/016: '<예매처> 공식 티켓 예매' 표기 및 최상단 티켓 링크 연결
 * - card-017: 공연장 상세 주소 미제공 시 해당 영역 제거
 * - card-018: '작곡가 - 곡명' 형식으로 곡 제목 표기
 * - card-019: 하루 여러 시간대는 DB 데이터 형식 그대로 표기 (토요일(14:30,17:00), ...)
 * - (제외 확정 2026.10.23) 러닝타임·관람연령·공연 장소·좌석별 가격 블록 및 '프로그램 작곡가' 줄은
 *   카드에서 표기하지 않는다 — 작곡가 정보는 전체 프로그램 ui(flyout/시트)의 작곡가 그룹 헤더로 표기
 *   (디자인: prototype/홈페이지 수정안 index.html — card-side 18px 패딩(포스터 203×271), card-body 22/26px)
 */
import { Fragment, useState } from "react";
import posthog from "posthog-js";
import Icon from "@/components/Icon";
import { formatPeriodRange } from "@/lib/date";
import { getProgramSummary } from "@/lib/program";
import ConcertStatusBadge from "@/home/components/ConcertStatusBadge";
import ProgramFlyout from "@/home/components/ProgramFlyout";
import ProgramReportDialog from "@/home/components/ProgramReportDialog";
import ProgramSheet from "@/home/components/ProgramSheet";
import type { Concert } from "@/types/concert";

interface ConcertCardProps {
  concert: Concert;
  /** 현재 검색어 — 일치하는 곡을 프로그램 영역 메인으로 표시 (specs search-008) */
  searchQuery?: string;
}

export default function ConcertCard({ concert, searchQuery = "" }: ConcertCardProps) {
  // 전체 프로그램 바텀시트 / 오류 제보 다이얼로그의 열림 상태 (순간 UI 상태)
  const [isProgramSheetOpen, setIsProgramSheetOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const openProgramSheet = () => setIsProgramSheetOpen(true);
  const openReportDialog = () => setIsReportDialogOpen(true);

  // 프로그램 영역 파생값(메인 곡, (외 N곡) 등) — specs search-008, card-008/018
  const summary = getProgramSummary(concert.programs, searchQuery);
  const bookingLink = concert.bookingLinks[0];

  return (
    <article className="grid min-w-0 grid-cols-1 rounded-md border border-outline-variant bg-white transition-[border-color,box-shadow] duration-[180ms] hover:border-secondary hover:shadow-[0_6px_20px_rgba(22,35,58,0.08)] md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      {/* 포스터 + 공연 상태 + 공연장 (prototype .card-side: padding 18px, 데스크톱 우측 보더) */}
      <div className="flex flex-col border-b border-[#efece3] p-[18px] md:border-b-0 md:border-r md:border-r-[#efece3]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] border border-[#efece3] bg-surface-container">
          {concert.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={concert.poster}
              alt={`${concert.name} 포스터`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#6e7278,#8b8f96)] text-white/85">
              <Icon name="music_note" fill size={32} />
            </div>
          )}
          <div className="absolute left-2.5 top-2.5">
            <ConcertStatusBadge status={concert.status} />
          </div>
        </div>
        <div className="mt-3 border-t border-[#efece3] pt-2.5">
          {/* 공연장: 홀 이름 첫 줄, 상세 주소 둘째 줄 (card-003). 주소 미제공 시 숨김 (card-017) */}
          <div className="flex items-center gap-1.5 text-primary">
            <Icon name="location_on" size={13} className="text-secondary" />
            <span className="text-[12px] font-bold">{concert.venueName}</span>
          </div>
          {concert.venueAddress && (
            <div className="mt-1 text-[11.5px] leading-snug text-on-surface-variant">
              {concert.venueAddress}
            </div>
          )}
        </div>
      </div>

      {/* 공연 정보 (prototype .card-body: padding 22px 26px) */}
      <div className="min-w-0 px-[26px] pb-[22px] pt-[22px] max-md:px-4 max-md:pb-4 max-md:pt-4">
        {/* 공연명 + 공연 날짜/회차 (card-004) — 데스크톱: 제목 좌측 + 일시 우측 정렬 / 모바일: 세로 스택 */}
        <div className="border-b border-[#eae2cf] pb-[14px] md:flex md:items-start md:justify-between md:gap-6">
          <h2 className="font-serif text-[21px] font-bold leading-[1.4] tracking-[-0.01em] text-primary">
            {concert.name}
          </h2>
          <div className="mt-2 flex flex-col gap-0.5 text-body-sm text-on-surface-variant md:mt-0 md:shrink-0 md:items-end">
            <span className="font-bold text-primary">
              {formatPeriodRange(concert.periodFrom, concert.periodTo)}
            </span>
            {concert.time && <p className="text-on-surface-variant">{concert.time}</p>}
          </div>
        </div>

        {/* 아티스트 (card-005) */}
        {concert.artists.length > 0 && (
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-[#eae2cf] pb-3">
            <span className="font-serif text-[10.5px] font-bold uppercase tracking-[0.1em] text-secondary">
              아티스트 (Artists):
            </span>
            {concert.artists.map((artist, index) => (
              <Fragment key={`${artist}-${index}`}>
                {index > 0 && <span className="text-outline-variant">·</span>}
                <span className="text-body-md font-semibold text-on-surface">{artist}</span>
              </Fragment>
            ))}
          </div>
        )}

        {/* 연주 프로그램 (card-007: 없으면 영역 전체 제거) */}
        {summary.firstTitleLabel && (
          <div className="group/program relative mt-4 rounded-md border border-[#ece5d4] bg-surface-container-low p-4 transition-colors duration-150 hover:border-secondary hover:bg-[#fffdf6]">
            <div className="mb-2.5 flex items-center justify-between gap-2 border-b border-[#eae2cf] pb-2.5">
              <div className="flex items-center gap-1.5">
                <Icon name="queue_music" size={15} className="text-secondary" />
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
                  onClick={openProgramSheet}
                  className="inline-flex items-center gap-1 rounded-[4px] border border-outline-variant bg-white px-2 py-1 text-[11px] font-semibold text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary lg:hidden"
                >
                  <Icon name="queue_music" size={12} />
                  <span>전체 프로그램 보기</span>
                </button>
                <button
                  type="button"
                  onClick={openReportDialog}
                  title="프로그램 정보 오류 제보"
                  className="inline-flex items-center gap-1 rounded-[4px] border border-outline-variant bg-white px-2 py-1 text-[11px] font-semibold text-on-surface-variant transition-colors hover:bg-primary hover:text-on-primary"
                >
                  <Icon name="flag" size={12} />
                  <span>오류 제보</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              {/* (외 N곡)은 곡명과 별도 영역, 항상 첫 줄 (card-008) — 모바일에서는 단순 표기로 강등 */}
              <p className="font-serif text-[17px] font-semibold leading-[1.5] text-primary">
                {summary.firstTitleLabel}
              </p>
              {summary.extraCount > 0 && (
                <span className="relative inline-flex items-center gap-0.5">
                  {/* 데스크톱 hover 팝오버: '외 N곡' 바로 하단 고정 (card-010) */}
                  <span className="text-body-sm font-semibold text-secondary underline decoration-dashed underline-offset-[3px] opacity-90 transition-colors group-hover/program:text-primary max-md:font-normal max-md:text-on-surface-variant max-md:no-underline">
                    (외 {summary.extraCount}곡)
                  </span>
                  <Icon
                    name="expand_more"
                    size={12}
                    className="max-md:hidden! text-secondary opacity-90 transition-colors group-hover/program:text-primary"
                  />
                  <span className="hidden lg:block">
                    <ProgramFlyout
                      programs={concert.programs}
                      runtime={concert.runtime}
                      searchQuery={searchQuery}
                      className="absolute left-0 top-full z-30 mt-2 w-[28rem] max-w-[85vw]"
                    />
                  </span>
                </span>
              )}
            </div>
            {summary.firstTitleEn && (
              <p className="mt-1 font-serif text-body-sm italic text-outline">
                {summary.firstTitleEn}
              </p>
            )}
          </div>
        )}

        {/* 예매처 (card-015, card-016) */}
        {bookingLink && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-on-surface-variant">
              <Icon name="confirmation_number" size={15} className="text-secondary" />
              {bookingLink.name} 공식 티켓 예매
            </div>
            <a
              href={bookingLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                // 유일한 전환 지표 — 검색/관심에서 예매 의사로 이어진 공연을 측정한다
                posthog.capture("booking_click", {
                  concertId: concert.id,
                  concertName: concert.name,
                  vendor: bookingLink.name,
                })
              }
              className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-body-sm font-bold text-on-primary transition-colors hover:bg-secondary hover:text-on-secondary"
            >
              <span>예매처 바로가기</span>
              <Icon name="open_in_new" size={15} />
            </a>
          </div>
        )}
      </div>

      <ProgramSheet
        isOpen={isProgramSheetOpen}
        onClose={() => setIsProgramSheetOpen(false)}
        programs={concert.programs}
        runtime={concert.runtime}
        searchQuery={searchQuery}
      />
      <ProgramReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        concert={concert}
      />
    </article>
  );
}
