/**
 * specs/home.md: 이 파일에 해당하는 명시 정책은 없음.
 * - card-009/010 연계: 프로그램 영역·바텀시트 푸터의 '오류 제보' 진입점으로 열리는 다이얼로그
 */
"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/Icon";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { formatPeriodRange } from "@/lib/date";
import { useSubmitProgramReport } from "@/queries/useFeedbacks";
import type { Concert } from "@/types/concert";

interface ProgramReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  concert: Concert;
}

const MAX_DETAILS_LENGTH = 500;

/** 프로그램 정보 오류 제보 다이얼로그 (specs card-009 푸터, 프로그램 영역 '오류 제보' 버튼) */
export default function ProgramReportDialog({ isOpen, onClose, concert }: ProgramReportDialogProps) {
  const [details, setDetails] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending, isError, reset } = useSubmitProgramReport();

  const handleClose = () => {
    onClose();
    setDetails("");
    setReferenceUrl("");
    setEmail("");
    setIsSubmitted(false);
    reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!details.trim()) return;
    mutate(
      { concert, details, referenceUrl: referenceUrl.trim() || undefined, email: email.trim() || undefined },
      { onSuccess: () => setIsSubmitted(true) },
    );
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="프로그램 정보 오류 제보"
      containerClassName="md:max-w-[620px]"
    >
      <div className="h-0.5 w-full bg-secondary" />

      {isSubmitted ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-secondary/30 bg-secondary-fixed/40 text-secondary">
            <Icon name="check" fill size={28} />
          </div>
          <h2 className="mb-2 font-serif text-headline-sm text-primary">제보가 접수되었습니다</h2>
          <p className="mb-8 text-body-md text-on-surface-variant">
            보내주신 정보는 검토 후 아카이브에 반영됩니다.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xs bg-primary px-6 py-2.5 font-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            닫기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4 border-b border-outline-variant/60 px-6 pb-4 pt-6 sm:px-8">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <Icon name="report" size={18} className="text-secondary" />
                <h2 className="font-serif text-headline-md tracking-tight text-primary">
                  프로그램 정보 오류 제보
                </h2>
              </div>
              <p className="leading-relaxed text-body-sm text-on-surface-variant">
                잘못 기재된 작곡가, 곡목, 악장 또는 연주 편성 정보를 제보해 주시면 검토 후 반영됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="닫기"
              className="mt-0.5 shrink-0 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8">
            {/* 대상 공연 정보 요약 */}
            <section>
              <div className="relative rounded-xs border border-outline-variant/80 bg-surface-container-low p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-label-caps tracking-widest text-secondary">대상 공연 정보</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-outline">
                    <Icon name="lock" size={12} />
                    수정 대상
                  </span>
                </div>
                <h3 className="mb-1 font-serif text-headline-sm font-medium leading-snug text-primary">
                  {concert.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Icon name="calendar_today" size={12} className="text-outline" />
                    {formatPeriodRange(concert.periodFrom, concert.periodTo)}
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1">
                    <Icon name="location_on" size={12} className="text-outline" />
                    {concert.venueName}
                  </span>
                </div>
              </div>
            </section>

            {/* 수정 요청 내용 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="program-report-details"
                  className="font-label-caps tracking-wider text-primary"
                >
                  올바른 프로그램 정보 / 수정 요청 내용 <span className="text-secondary">*</span>
                </label>
                <span
                  className={`font-label-caps ${details.length > 0 ? "text-secondary" : "text-outline"}`}
                >
                  {details.length} / {MAX_DETAILS_LENGTH}자
                </span>
              </div>
              <textarea
                id="program-report-details"
                name="program-report-details"
                required
                rows={4}
                maxLength={MAX_DETAILS_LENGTH}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="예: 등록된 작곡가가 브람스가 아닌 말러로 잘못 기재되어 있습니다. 또는 라흐마니노프 작품번호 18번 -> 43번 오기 수정 요청."
                className="w-full resize-none rounded-xs border border-outline-variant bg-surface-container-lowest p-3 text-body-md leading-relaxed text-on-surface outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
              <p className="mt-1 flex items-center gap-1 text-[11px] text-outline">
                <Icon name="info" size={14} className="text-secondary" />
                상세한 악장 번호나 작곡가 공식 표기를 적어주시면 빠른 처리에 도움이 됩니다.
              </p>
            </div>

            {/* 참고 링크 */}
            <div>
              <label
                htmlFor="program-report-reference-url"
                className="mb-1.5 block font-label-caps tracking-wider text-primary"
              >
                참고 링크 / 근거 <span className="font-normal text-outline">(선택사항)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <Icon name="link" size={16} />
                </span>
                <input
                  id="program-report-reference-url"
                  name="program-report-reference-url"
                  type="url"
                  value={referenceUrl}
                  onChange={(event) => setReferenceUrl(event.target.value)}
                  placeholder="공식 기획사 공지 링크 또는 예매처 상세 페이지 URL"
                  className="w-full rounded-xs border border-outline-variant bg-surface-container-lowest py-2.5 pl-9 pr-3 text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            {/* 알림 이메일 */}
            <div className="border-t border-outline-variant/60 pt-4">
              <label
                htmlFor="program-report-email"
                className="mb-1.5 block font-label-caps tracking-wider text-primary"
              >
                처리 결과 알림 이메일 <span className="font-normal text-outline">(선택사항)</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                  <Icon name="mail" size={16} />
                </span>
                <input
                  id="program-report-email"
                  name="program-report-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xs border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-3 text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-outline">
                <Icon name="mark_email_read" size={14} className="text-secondary" />
                검토 완료 및 아카이브 수정 반영 시 1회성 알림 메일이 발송됩니다.
              </p>
            </div>

            {isError && (
              <p className="flex items-center gap-1.5 text-body-sm text-error" role="alert">
                <Icon name="error" size={16} />
                제보 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-outline-variant/70 bg-surface-container-low px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xs border border-primary px-5 py-2.5 font-label-md text-primary transition-colors hover:bg-primary/5"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending || details.trim().length === 0}
              className="flex items-center gap-1.5 rounded-xs bg-primary px-6 py-2.5 font-label-md tracking-wide text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="send" size={16} />
              <span>{isPending ? "접수 중..." : "제보 접수하기"}</span>
            </button>
          </div>
        </form>
      )}
    </ResponsiveDialog>
  );
}
