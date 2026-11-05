/** 사이트 공통 푸터 — prototype/홈페이지 수정안 footer (데이터 출처 + AI 추출 고지) */
export default function SiteFooter() {
  return (
    <footer className="bg-[#0d1728] px-0 pb-12 pt-[42px] text-[#9aa4b8]">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <span className="font-serif text-[22px] font-bold tracking-[1px] text-[#e6eaf2]">
          OP<span className="text-secondary">U</span>S
        </span>
        <p className="mt-3.5 text-[12.5px] leading-[1.9]">
          이 서비스의 데이터 출처는 <b className="font-semibold text-[#cfd6e4]">(주)공연예술통합전산망 (KOPIS)</b>{" "}
          입니다.
          <br />
          프로그램 정보는 AI로 추출되어 실제 공연 정보와 다를 수 있습니다.
        </p>
        <p className="mt-2.5 text-[11.5px] text-[#6d7789]">
          © 2026 OPUS. 본 페이지는 디자인 시안이며 카드의 공연·인물은 표기 규칙 시연용 가상 데이터입니다.
        </p>
      </div>
    </footer>
  );
}
