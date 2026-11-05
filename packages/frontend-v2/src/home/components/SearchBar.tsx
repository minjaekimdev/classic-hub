/**
 * specs/home.md 구현 정책
 * - search-001: placeholder 자리에 실제 검색 가능한 검색어 예시를 롤링 표시한다
 *   (예시 트랙은 초록색(gold)이 아닌 뮤트 톤이며, 입력/포커스 시 숨긴다)
 * - search-009: 제출은 검색 패널의 '검색' 버튼(HomePage 폼)에서만 수행한다 — 이 컴포넌트는 입력 버퍼만 관리
 */
import { useRef } from "react";
import Icon from "@/components/Icon";

interface SearchBarProps {
  value: string;
  /** 매 입력마다 호출 — 입력 버퍼만 갱신하며 URL 커밋은 하지 않는다 */
  onChange: (value: string) => void;
  /** 입력 초기화(X) 클릭 시 호출 — 기존 동작 유지를 위해 빈 값으로 즉시 커밋한다 */
  onClear: () => void;
}

/** 롤링 예시 — 트랙 마지막에 1번 예시를 복제해 끊김 없이 순환한다 (search-001) */
const PLACEHOLDER_EXAMPLES = [
  "라흐마니노프 피아노 협주곡 3번",
  "쇼팽 녹턴",
  "조성진",
  "예술의전당 콘서트홀",
];

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col justify-center rounded-xl border-[1.5px] border-outline-variant bg-white px-4 pb-2.5 pt-[11px] transition-colors hover:border-[#c9cfdd] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(22,35,58,0.06)]">
      <label
        htmlFor="concert-search"
        className="mb-[3px] inline-flex items-center gap-[5px] text-[11.5px] font-bold leading-none tracking-[0.01em] text-[#8a8f9c]"
      >
        <Icon name="search" size={12} />
        검색어
      </label>
      <div className="relative flex min-w-0 items-center gap-1.5">
        <input
          ref={inputRef}
          id="concert-search"
          type="text"
          name="concert-search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder=" "
          aria-label="공연 프로그램 검색"
          className="peer min-w-0 flex-1 bg-transparent text-[15px] font-medium leading-[1.4] text-on-surface placeholder:text-transparent outline-none"
        />
        {/* search-001: placeholder 자리에 실제 검색 가능한 예시가 아래→위로 롤링된다 (입력/포커스 시 숨김) */}
        <span
          className="ph-roll opacity-0 peer-focus:opacity-0 peer-placeholder-shown:opacity-100"
          aria-hidden="true"
        >
          <span>예:</span>
          <span className="ph-win">
            <span className="ph-track">
              {PLACEHOLDER_EXAMPLES.concat(PLACEHOLDER_EXAMPLES[0]).map((example, index) => (
                <span key={`${example}-${index}`} className="ph-item">
                  {example}
                </span>
              ))}
            </span>
          </span>
        </span>
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="입력 초기화"
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-[#b3b7c2] transition-colors hover:bg-[#f1f0ea] hover:text-primary"
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
