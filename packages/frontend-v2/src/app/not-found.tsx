/**
 * specs/home.md 구현 정책
 * - exception-01: 잘못된 경로(/asdf 등) 접근 시 app/not-found.tsx 라우팅 처리
 */
import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="flex flex-grow items-center justify-center px-4 py-16 md:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-xs border border-[#9B733240] bg-[#9B733215] px-3.5 py-1 font-label-caps tracking-widest text-secondary">
          <Icon name="music_off" size={14} />
          404 NOT FOUND
        </div>

        <div className="relative my-2 flex select-none items-center justify-center">
          <div className="font-serif text-[112px] font-semibold leading-none tracking-tight text-primary opacity-90 md:text-[144px]">
            4
            <span className="relative inline-block px-1 text-secondary">
              0
              <Icon
                name="pause_circle"
                size={36}
                className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-secondary opacity-70 md:-top-8 md:text-[40px]"
              />
            </span>
            4
          </div>
        </div>

        <div className="my-6 flex w-24 flex-col items-center gap-1">
          <div className="h-px w-full bg-outline-variant" />
          <div className="h-px w-12 bg-secondary" />
        </div>

        <h1 className="mb-4 max-w-2xl font-serif text-headline-lg-mobile text-primary md:text-headline-lg">
          요청하신 페이지를 찾을 수 없습니다
        </h1>
        <p className="mb-10 max-w-xl leading-relaxed text-body-lg font-normal text-on-surface-variant">
          존재하지 않거나 삭제된 주소입니다. 입력하신 URL을 다시 확인하시거나 홈으로 이동하여
          원하는 클래식 프로그램을 탐색해 보세요.
        </p>

        <div className="mb-14 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 border border-primary-container bg-primary-container px-6 py-3.5 font-label-md tracking-wider text-white transition-all duration-150 hover:border-[#2C3847] hover:bg-[#2C3847]"
          >
            <Icon name="home" size={18} />
            <span>OPUS 홈으로 돌아가기</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
