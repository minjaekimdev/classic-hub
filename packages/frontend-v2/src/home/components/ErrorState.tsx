import Icon from "@/components/Icon";

interface ErrorStateProps {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-lg border border-outline-variant bg-surface-container-lowest p-10 text-center md:p-14">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-error/30 bg-error-container/40 text-error">
        <Icon name="cloud_off" size={32} />
      </div>
      <h2 className="mb-3 font-serif text-headline-md text-primary">
        공연 정보를 불러오지 못했어요
      </h2>
      <p className="mb-8 text-body-lg text-on-surface-variant">
        네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-primary-container px-6 py-2.5 font-label-md text-on-primary transition-colors hover:bg-on-primary-fixed-variant"
      >
        <Icon name="refresh" size={18} />
        <span>다시 시도</span>
      </button>
    </section>
  );
}
