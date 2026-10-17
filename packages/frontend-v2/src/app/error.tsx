/**
 * specs/home.md: 이 파일에 해당하는 명시 정책은 없음.
 * - 라우트 렌더링 에러 시 ErrorState 폴백 표시 + PostHog 에러 수집
 */
"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import ErrorState from "@/home/components/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <ErrorState onRetry={reset} />
    </div>
  );
}
