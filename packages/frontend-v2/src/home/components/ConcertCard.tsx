/**
 * specs/home.md 구현 정책
 * - common-001: 공연 상태('공연중'/'공연예정') 배지 표기
 * - search-008: 검색어와 일치하는 곡을 프로그램 영역 메인으로 표시
 * - card-001/002: 포스터 세로 중앙 정렬, 영역 크기 고정 및 비율 유지
 * - card-003: 홀 이름 첫 줄, 상세 주소 둘째 줄(데스크톱)
 * - card-004: 공연 날짜 첫 줄, 요일/시간 둘째 줄, 당일 공연은 단일 날짜
 * - card-005/006: 아티스트 라벨+이름 배치(데스크톱 한 줄 줄바꿈 / 모바일 별도 줄)
 * - card-007: 프로그램/아티스트가 없으면 해당 ui 영역 전체 제거
 * - card-008/011: 프로그램 곡명·작곡가 표기 규칙((외 N곡) 별도 영역, 작곡가 한 줄)
 * - card-009/010: '전체 프로그램 보기'(바텀시트)·프로그램 hover 팝오버 진입점
 * - card-012: 러닝타임/관람연령/공연 장소 미제공 시 '-' 표기
 * - card-013/014: 티켓 가격 표기(전석 무료) 및 좌석별 가격 없을 때 영역 제거
 * - card-015/016: '<예매처> 공식 티켓 예매' 표기 및 최상단 티켓 링크 연결
 * - card-017: 공연장 상세 주소 미제공 시 해당 영역 제거
 * - card-018: '작곡가 - 곡명' 형식으로 곡 제목 표기
 * - card-019: 하루 여러 시간대는 DB 데이터 형식 그대로 표기 (토요일(14:30,17:00), ...)
 */
import { Fragment, useState } from "react";
import posthog from "posthog-js";
import Icon from "@/components/Icon";
import { formatPeriodRange } from "@/lib/date";
import { findMatchedProgramWork } from "@/lib/program";
import ProgramFlyout from "@/home/components/ProgramFlyout";
import ProgramReportDialog from "@/home/components/ProgramReportDialog";
import ProgramSheet from "@/home/components/ProgramSheet";
import type { Concert } from "@/types/concert";

interface ConcertCardProps {
  concert: Concert;
  /** 현재 검색어 — 일치하는 곡을 프로그램 영역 메인으로 표시 (specs search-008) */
  searchQuery?: string;
}

const badgeStyles: Record<Concert["status"], string> = {
  ongoing: "border-secondary bg-secondary-container/90 text-on-secondary-container",
  upcoming: "border-outline bg-surface-container-high text-primary",
};

const statusLabels: Record<Concert["status"], string> = {
  ongoing: "공연중",
  upcoming: "공연예정",
};

export default function ConcertCard({ concert, searchQuery = "" }: ConcertCardProps) {
  // 전체 프로그램 바텀시트 / 오류 제보 다이얼로그의 열림 상태 (순간 UI 상태)
  const [isProgramSheetOpen, setIsProgramSheetOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const openProgramSheet = () => setIsProgramSheetOpen(true);
  const openReportDialog = () => setIsReportDialogOpen(true);

  const totalProgramCount = concert.programs.reduce((sum, program) => sum + program.titles.length, 0);
  // 검색어와 일치하는 곡이 있으면 해당 작품을 메인으로 표시한다 (specs search-008)
  const matchedWork = findMatchedProgramWork(concert.programs, searchQuery);
  const featuredProgram = matchedWork?.program ?? concert.programs[0];
  const featuredTitle = matchedWork?.title ?? featuredProgram?.titles[0];
  const firstTitleKo = featuredTitle?.ko ?? featuredTitle?.en ?? null;
  const firstTitleEn = featuredTitle?.ko && featuredTitle.en ? featuredTitle.en : null;
  // '작곡가 - 곡명' 형식으로 표기 (specs card-018)
  const firstComposer = featuredProgram?.composerKo ?? featuredProgram?.composerEn ?? null;
  const firstTitleLabel =
    firstComposer && firstTitleKo ? `${firstComposer} - ${firstTitleKo}` : firstTitleKo;
  const extraProgramCount = totalProgramCount - 1;
  const composers = concert.programs
    .map((program) => program.composerKo ?? program.composerEn)
    .filter((composer): composer is string => composer !== null)
    .filter((composer, index, all) => all.indexOf(composer) === index);
  const bookingLink = concert.bookingLinks[0];
  const isFree = concert.seatPrices.length > 0 && concert.seatPrices.every((seat) => seat.price === 0);

  return (
    <article className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm transition-all duration-200 hover:border-secondary md:overflow-visible md:rounded-none md:shadow-none">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* 포스터 + 공연 상태 + 공연장 */}
        <div className="flex flex-col justify-between border-b border-outline-variant bg-surface p-3 lg:col-span-3 lg:border-b-0 lg:border-r lg:p-6">
          <div className="relative my-auto h-80 w-full overflow-hidden border border-outline-variant bg-[#131c28] p-2 lg:h-auto lg:aspect-[3/4] lg:bg-surface-container lg:p-0">
            {concert.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={concert.poster}
                alt={`${concert.name} 포스터`}
                loading="lazy"
                className="h-full w-full object-contain lg:object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-outline">
                <Icon name="music_note" fill size={32} />
              </div>
            )}
            <div className="absolute left-3 top-3">
              <span
                className={`border px-2.5 py-1 font-label-caps ${badgeStyles[concert.status]}`}
              >
                {statusLabels[concert.status]}
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-outline-variant/60 pt-2 lg:mt-4 lg:pt-3">
            {/* 모바일: 공연장명 / 주소 한 줄 */}
            <p className="flex items-start gap-1.5 text-[12px] leading-snug lg:hidden">
              <Icon name="location_on" size={16} className="mt-0.5 text-outline" />
              <span>
                <span className="font-medium text-primary">{concert.venueName}</span>
                {concert.venueAddress && (
                  <span className="text-outline"> / {concert.venueAddress}</span>
                )}
              </span>
            </p>
            {/* 데스크톱: 홀 이름 첫 줄, 상세 주소 둘째 줄 (card-003) */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Icon name="location_on" size={16} className="text-secondary" />
                <span className="font-label-caps font-semibold text-primary">
                  {concert.venueName}
                </span>
              </div>
              {concert.venueAddress && (
                <div className="mt-1 text-body-sm text-on-surface-variant">
                  {concert.venueAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 공연 정보 */}
        <div className="flex flex-col gap-4 p-4 lg:col-span-9 lg:gap-5 lg:p-8">
          {/* 공연명 + 공연 날짜/회차 */}
          <div className="flex flex-col gap-1.5 border-b border-outline-variant/70 pb-4 lg:flex-row lg:items-start lg:justify-between lg:gap-3">
            <h2 className="font-serif text-headline-sm leading-snug text-primary lg:tracking-tight lg:text-headline-md">
              {concert.name}
            </h2>
            <div className="flex flex-col gap-0.5 text-body-sm text-on-surface-variant lg:shrink-0 lg:items-end">
              <div className="flex items-center gap-1.5 font-medium text-primary lg:text-headline-sm">
                <Icon name="schedule" size={15} className="text-secondary lg:hidden" />
                <span>{formatPeriodRange(concert.periodFrom, concert.periodTo)}</span>
              </div>
              {concert.time && (
                <p className="pl-5 text-outline lg:pl-0 lg:text-on-surface-variant">
                  {concert.time}
                </p>
              )}
            </div>
          </div>

          {/* 아티스트 */}
          {concert.artists.length > 0 && (
            <>
              {/* 모바일: 라벨과 아티스트명 별도 줄 (card-006) */}
              <div className="border-b border-outline-variant/40 py-2.5 lg:hidden">
                <span className="mb-1 block font-label-caps uppercase text-secondary">
                  아티스트 (ARTISTS)
                </span>
                <p className="font-medium text-primary">{concert.artists.join(" · ")}</p>
              </div>
              {/* 데스크톱: 라벨과 아티스트명 한 줄 배치 후 그대로 줄바꿈 (card-005) */}
              <div className="hidden flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-outline-variant/40 py-3.5 lg:flex">
                <span className="mr-1 font-label-caps uppercase text-secondary">
                  아티스트 (Artists):
                </span>
                {concert.artists.map((artist, index) => (
                  <Fragment key={`${artist}-${index}`}>
                    {index > 0 && <span className="text-outline-variant">·</span>}
                    <span className="text-body-md font-medium text-primary">{artist}</span>
                  </Fragment>
                ))}
              </div>
            </>
          )}

          {/* 연주 프로그램 (card-007: 없으면 영역 전체 제거) */}
          {firstTitleLabel && (
            <div className="group/program relative rounded-lg border border-outline-variant/70 bg-surface p-3.5 lg:rounded-none lg:border-outline-variant lg:bg-surface-bright lg:p-5">
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-outline-variant/50 pb-2">
                <div className="flex items-center gap-2">
                  <Icon name="queue_music" size={18} className="text-secondary" />
                  <span className="font-label-caps tracking-wider text-primary lg:text-[10px]">
                    PROGRAM
                  </span>
                </div>
                {/* 데스크톱: 총 곡 수 + 오류 제보 (card-010) */}
                <div className="hidden items-center gap-2.5 lg:flex">
                  <span className="font-label-caps uppercase text-secondary lg:text-[10px]">
                    총 {totalProgramCount}곡 연주
                  </span>
                  <span className="text-outline-variant">·</span>
                  <button
                    type="button"
                    onClick={openReportDialog}
                    title="프로그램 정보 오류 제보"
                    className="inline-flex items-center gap-1.5 border border-outline bg-surface-container-high px-2.5 py-1 font-label-caps font-semibold text-primary shadow-sm transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    <Icon name="flag" size={14} className="text-secondary" />
                    <span>오류 제보</span>
                  </button>
                </div>
                {/* 모바일: 전체 프로그램 보기 + 오류 제보 (card-009) */}
                <div className="flex items-center gap-1.5 lg:hidden">
                  <button
                    type="button"
                    onClick={openProgramSheet}
                    className="inline-flex items-center gap-1 rounded-xs border border-outline-variant bg-surface-container-lowest px-2 py-1 text-[11px] text-primary transition-colors hover:border-secondary hover:text-secondary"
                  >
                    <Icon name="queue_music" size={13} className="text-secondary" />
                    <span>전체 프로그램 보기</span>
                  </button>
                  <button
                    type="button"
                    onClick={openReportDialog}
                    className="inline-flex items-center gap-1 rounded-xs border border-outline-variant bg-surface-container-high px-2 py-1 text-[11px] text-on-surface transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    <Icon name="flag" size={13} />
                    <span>오류 제보</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                  {/* (외 N곡)은 곡명과 별도 영역, 항상 첫 줄 (card-008) */}
                  <p className="font-serif text-program-title text-primary">{firstTitleLabel}</p>
                  {extraProgramCount > 0 && (
                    <span className="relative inline-flex items-center">
                      {/* 데스크톱 hover 팝오버: '외 N곡' 바로 하단 고정 (card-010) */}
                      <span className="text-body-sm text-on-surface-variant">
                        (외 {extraProgramCount}곡)
                      </span>
                      <span className="hidden lg:block">
                        <ProgramFlyout programs={concert.programs} runtime={concert.runtime} />
                      </span>
                    </span>
                  )}
                </div>
                {firstTitleEn && (
                  <p className="text-body-sm italic text-outline">{firstTitleEn}</p>
                )}
              </div>
              {/* 프로그램 작곡가: 라벨과 작곡가명 한 줄 (card-011) */}
              {composers.length > 0 && (
                <div className="pt-1 text-[12px] text-on-surface-variant">
                  <span className="text-outline">프로그램 작곡가:</span>
                  <span className="font-medium text-primary"> {composers.join(" · ")}</span>
                </div>
              )}
            </div>
          )}

          {/* 러닝타임 / 관람연령 / 공연 장소 / 가격 */}
          <div className="space-y-1 rounded-xs border border-outline-variant bg-surface-container-low/40 p-3 text-body-sm text-on-surface-variant lg:space-y-2 lg:rounded-none lg:bg-surface lg:p-4">
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-2">
              <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start">
                <span className="font-label-caps text-outline">러닝타임</span>
                <span className="text-right font-medium text-primary sm:text-left">
                  {concert.runtime ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start">
                <span className="font-label-caps text-outline">관람연령</span>
                <span className="text-right font-medium text-primary sm:text-left">
                  {concert.age ?? "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 sm:col-span-2 sm:flex-col sm:items-start sm:justify-start lg:col-span-1">
                <span className="font-label-caps text-outline">공연 장소</span>
                <span className="text-right font-medium text-primary sm:text-left">
                  {concert.venueName || "-"}
                </span>
              </div>
            </div>
            {/* 좌석별 가격이 없으면 영역 제거 (card-014) */}
            {concert.seatPrices.length > 0 && (
              <div className="border-t border-outline-variant/40 pt-1.5 text-[11px] lg:pt-2 lg:text-body-sm">
                <span className="mr-2 font-label-caps text-outline">좌석별 티켓 가격:</span>
                {isFree ? (
                  <span className="font-medium text-primary">전석 무료</span>
                ) : (
                  concert.seatPrices.map((seat, index) => (
                    <Fragment key={`${seat.seatType}-${index}`}>
                      {index > 0 && <span className="mx-1 text-outline-variant">/</span>}
                      <span className="font-medium text-primary">
                        {seat.seatType} {seat.price.toLocaleString()}원
                      </span>
                    </Fragment>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 예매처 (card-015, card-016) */}
          {bookingLink && (
            <div className="flex flex-col items-stretch gap-2 border-t border-outline-variant pt-4 lg:mt-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="hidden items-center font-label-caps text-on-surface-variant lg:flex">
                <Icon name="confirmation_number" size={16} className="mr-1 text-secondary" />
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
                className="flex w-full items-center justify-center gap-2 rounded-xs bg-primary-container px-6 py-3 font-label-md text-on-primary transition-colors hover:bg-on-primary-fixed-variant lg:w-auto lg:rounded-none lg:py-2.5"
              >
                <span>예매처 바로가기</span>
                <Icon name="open_in_new" size={16} />
              </a>
            </div>
          )}
        </div>
      </div>

      <ProgramSheet
        isOpen={isProgramSheetOpen}
        onClose={() => setIsProgramSheetOpen(false)}
        onReport={() => {
          setIsProgramSheetOpen(false);
          setIsReportDialogOpen(true);
        }}
        programs={concert.programs}
        runtime={concert.runtime}
      />
      <ProgramReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        concert={concert}
      />
    </article>
  );
}
