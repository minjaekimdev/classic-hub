/**
 * specs/home.md 구현 정책
 * - feedback-001: '서비스 의견 보내기' 버튼 클릭 시 피드백 모달 표시(데스크톱 플로팅 버튼)
 * - feedback-002: '피드백' 버튼 클릭 시 피드백 바텀시트 표시(모바일 헤더 버튼)
 */
"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/Icon";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import useSubmitServiceFeedback from "@/queries/useFeedbacks";

const TOPICS = [
  "기능 제안 / 개선 요청",
  "검색 정확도 / 편의성",
  "디자인 / 사용성",
  "칭찬 및 격려",
  "기타 의견",
] as const;

const RATINGS = [
  { label: "매우 만족", icon: "sentiment_very_satisfied", fill: true },
  { label: "만족", icon: "sentiment_satisfied", fill: false },
  { label: "보통", icon: "sentiment_neutral", fill: false },
  { label: "아쉬움", icon: "sentiment_dissatisfied", fill: false },
  { label: "매우 아쉬움", icon: "sentiment_very_dissatisfied", fill: false },
] as const;

const MAX_CONTENT_LENGTH = 1000;

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [rating, setRating] = useState<string>(RATINGS[0].label);
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending, isError, reset } = useSubmitServiceFeedback();

  const handleClose = () => {
    onClose();
    setTopic(TOPICS[0]);
    setRating(RATINGS[0].label);
    setContent("");
    setEmail("");
    setIsSubmitted(false);
    reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;
    mutate(
      { topic, rating, content, email: email.trim() || undefined },
      { onSuccess: () => setIsSubmitted(true) },
    );
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="서비스 피드백 보내기"
      containerClassName="md:max-w-[700px]"
    >
      {isSubmitted ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-secondary/30 bg-secondary-fixed/40 text-secondary">
            <Icon name="mark_chat_read" size={28} />
          </div>
          <h2 className="mb-2 font-serif text-headline-sm text-primary">
            소중한 의견이 등록되었습니다
          </h2>
          <p className="mb-8 text-body-md text-on-surface-variant">
            OPUS 서비스 발전에 큰 힘이 됩니다.
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
          <div className="flex items-start justify-between border-b border-outline-variant bg-surface-bright px-6 pb-5 pt-6 sm:px-8">
            <div className="space-y-1.5 pr-6">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span className="font-label-caps uppercase tracking-widest text-secondary">
                  Listener &amp; Patron Voice
                </span>
              </div>
              <h2 className="font-serif text-headline-md text-primary">서비스 피드백 보내기</h2>
              <p className="leading-relaxed text-body-md text-on-surface-variant">
                OPUS 서비스 이용 경험이나 개선되었으면 하는 점, 바라는 기능을 자유롭게 들려주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="닫기"
              className="shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          <div className="space-y-7 px-6 py-6 sm:px-8">
            {/* 피드백 주제 */}
            <div className="space-y-2.5">
              <span className="block font-label-md font-semibold text-primary">피드백 주제</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="피드백 주제 선택">
                {TOPICS.map((item) => {
                  const isActive = item === topic;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setTopic(item)}
                      className={`rounded-lg border px-3.5 py-2 font-label-md transition-colors ${
                        isActive
                          ? "border-secondary bg-secondary/5 font-semibold text-secondary"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-secondary hover:text-secondary"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 전반적인 만족도 */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md font-semibold text-primary">전반적인 만족도</span>
                <span className="font-label-caps font-medium text-secondary">{rating}</span>
              </div>
              <div className="grid grid-cols-5 gap-2.5" role="radiogroup" aria-label="만족도 5단계">
                {RATINGS.map((item) => {
                  const isActive = item.label === rating;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setRating(item.label)}
                      className={`group flex flex-col items-center justify-center rounded-lg border px-2 py-3 transition-colors ${
                        isActive
                          ? "border-secondary bg-secondary/5 text-secondary"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-secondary hover:text-secondary"
                      }`}
                    >
                      <Icon
                        name={item.icon}
                        size={26}
                        fill={isActive}
                        className="mb-1 transition-transform group-hover:scale-110"
                      />
                      <span className="font-label-caps">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 의견 및 제안 내용 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="service-feedback-content"
                  className="font-label-md font-semibold text-primary"
                >
                  의견 및 제안 내용 <span className="font-medium text-tertiary-container">*</span>
                </label>
                <span className="font-label-caps tracking-wider text-on-surface-variant">
                  <span className="font-semibold text-primary">{content.length}</span> /{" "}
                  {MAX_CONTENT_LENGTH}자
                </span>
              </div>
              <textarea
                id="service-feedback-content"
                name="service-feedback-content"
                required
                rows={5}
                maxLength={MAX_CONTENT_LENGTH}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="어떤 점이 좋았거나 개선되면 좋을까요? 구체적인 의견을 남겨주시면 서비스 발전에 큰 도움이 됩니다. (예: 아티스트별 모아보기 기능도 있으면 좋겠어요, 검색 필터 관련 의견 등)"
                className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-3.5 leading-relaxed text-body-md text-primary outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>

            {/* 답변 수신용 이메일 */}
            <div className="space-y-2">
              <label
                htmlFor="service-feedback-email"
                className="block font-label-md font-semibold text-primary"
              >
                답변 수신용 이메일{" "}
                <span className="text-body-sm font-normal text-on-surface-variant">(선택)</span>
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-outline">
                  <Icon name="mail" size={20} />
                </span>
                <input
                  id="service-feedback-email"
                  name="service-feedback-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="답변이 필요하시거나 개선 소식을 받고 싶으신 경우 입력해주세요"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-11 pr-4 text-body-md text-primary outline-none transition-colors placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-3.5">
              <Icon name="info" size={18} className="mt-0.5 shrink-0 text-secondary" />
              <p className="leading-relaxed text-body-sm text-on-surface-variant">
                보내주신 프로그램 및 검색 개선 제안은 OPUS 개발팀에 직접 공유되며, 검토 후 서비스
                반영 여부를 결정합니다.
              </p>
            </div>

            {isError && (
              <p className="flex items-center gap-1.5 text-body-sm text-error" role="alert">
                <Icon name="error" size={16} />
                전송에 실패했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-bright px-6 py-5 sm:flex-row sm:px-8">
            <div className="hidden items-center gap-2 text-on-surface-variant sm:flex">
              <Icon name="mark_chat_read" size={18} className="text-secondary" />
              <span className="text-body-sm">소중한 의견은 서비스 운영팀에 직접 전달됩니다.</span>
            </div>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-primary px-5 py-2.5 font-label-md text-primary transition-colors hover:bg-primary/5"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isPending || content.trim().length === 0}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-label-md text-on-primary shadow-sm transition-colors hover:bg-[#2C3847] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>{isPending ? "전송 중..." : "피드백 보내기"}</span>
                <Icon name="arrow_forward" size={16} />
              </button>
            </div>
          </div>
        </form>
      )}
    </ResponsiveDialog>
  );
}

/** 데스크톱: 우하단 플로팅 버튼 (feedback-001) */
export default function ServiceFeedback() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden justify-end px-6 sm:flex">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto flex items-center gap-2 border border-outline-variant bg-primary-container px-4 py-2.5 font-label-md text-on-primary shadow-xl transition-colors hover:bg-on-primary-fixed-variant"
        >
          <Icon name="chat_bubble_outline" size={18} className="text-secondary-fixed" />
          <span>서비스 의견 보내기</span>
        </button>
      </div>
      <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

/** 모바일: 헤더 우측 피드백 버튼 (feedback-002, prototype/홈페이지(모바일)) */
export function FeedbackHeaderButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="서비스 피드백 보내기"
        className="inline-flex items-center gap-1 rounded-sm border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:border-secondary hover:text-secondary sm:hidden"
      >
        <Icon name="rate_review" size={14} className="text-secondary" />
        <span>피드백</span>
      </button>
      <FeedbackDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
