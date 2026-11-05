/**
 * specs/home.md 구현 정책
 * - exception-01: 잘못된 경로(/asdf 등) 접근 시 app/not-found.tsx 라우팅 처리
 * - exception-02: clamp 불가능한 비정상 요청 역시 app/not-found.tsx 라우팅 처리
 *   (디자인: prototype/검색 결과 0건 및 not-found(데스크톱) — navy 그라데이션 404)
 *   '이전 페이지로' 버튼(history.back) 사용을 위해 클라이언트 컴포넌트로 렌더링한다
 */
"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="hero-surface flex flex-col items-center px-4 py-24 text-center text-white md:py-36">
      <p className="font-serif text-[120px] font-bold leading-none tracking-wide select-none" aria-hidden="true">
        4<em className="not-italic text-secondary">0</em>4
      </p>
      <h1 className="mt-6 text-body-lg font-bold md:text-headline-md">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-md text-body-md text-[#aab3c6]">
        주소가 잘못 입력되었거나, 변경 혹은 삭제된 페이지일 수 있습니다.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-body-md font-bold text-[#0d1728] transition-colors hover:bg-white hover:text-primary"
        >
          <Icon name="home" size={16} />
          <span>홈으로 가기</span>
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 text-body-md font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <Icon name="arrow_back" size={16} />
          <span>이전 페이지로</span>
        </button>
      </div>
      <p className="mt-7 text-body-sm text-[#8b96ad]">OPUS · 클래식 공연 프로그램 검색</p>
    </section>
  );
}
