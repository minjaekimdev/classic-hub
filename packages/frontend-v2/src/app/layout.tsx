import type { Metadata } from "next";
import { Hanken_Grotesk, Playfair_Display } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ServiceFeedback from "@/components/ServiceFeedback";
import Providers from "@/lib/providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OPUS INDEX — 클래식 레퍼토리 및 연주 프로그램 검색 아카이브",
  description:
    "작곡가, 작품명, 연주자 등으로 엄선된 클래식 공연의 연주 프로그램을 탐색하세요. 향후 3개월간의 공연 편성 데이터를 제공합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${playfair.variable} ${hanken.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-sans text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
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
          <ServiceFeedback />
        </Providers>
      </body>
    </html>
  );
}
