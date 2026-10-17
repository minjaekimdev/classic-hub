"use client";

import { useEffect, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "@posthog/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { makeQueryClient } from "@/queries/queryClient";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  // 운영 빌드에서만 전송한다 — 개발 모드는 무료 플랜 1개 프로젝트 제한 때문에
  // 운영 이벤트 오염을 막기 위해 기본 비활성화한다.
  // 로컬에서 이벤트 동작을 테스트할 때만 .env.local에
  // NEXT_PUBLIC_POSTHOG_ENABLED=true 를 임시로 넣고 서버를 재시작한다.
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === "production";
    const explicitlyEnabled = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true";
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token || (!isProduction && !explicitlyEnabled)) return;

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      defaults: "2026-05-30",
      // 에러(런타임 예외 + unhandled rejection)와 Web Vitals 자동 수집
      capture_exceptions: true,
      capture_performance: true,
      // 로그인 없는 서비스라 익명 사용자의 person profile 생성을 생략 (개인정보 최소화)
      person_profiles: "identified_only",
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </PHProvider>
  );
}
