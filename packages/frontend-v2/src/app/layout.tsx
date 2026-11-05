import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Providers from "@/lib/providers";
import "./globals.css";

/**
 * specs/home.md 구현 정책
 * - (폰트) 한글 본문은 Pretendard(CDN), 영문 디스플레이는 Josefin Sans — 수정안 확정 폰트
 *   (prototype/홈페이지 수정안 DESIGN.md 폰트 확정 참조)
 */
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OPUS — 클래식 공연 프로그램 검색",
  description:
    "작곡가, 작품명, 연주자, 공연장으로 엄선된 클래식 공연의 연주 프로그램을 탐색하세요. 향후 3개월간의 공연 편성 데이터를 제공합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={josefin.variable}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        {/* 한글 본문 폰트 — Pretendard Variable (jsdelivr CDN, prototype과 동일 소스) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Material Symbols 아이콘 폰트 (next/font 미지원 아이콘 축 FILL/GRAD 포함) */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <Providers>
          <SiteHeader />
          <main className="flex-grow">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
