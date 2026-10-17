/**
 * specs/home.md 구현 정책
 * - search-001: placeholder에 실제 검색 가능한 검색어 예시 표시
 */
import { useRef, type FormEvent } from "react";
import Icon from "@/components/Icon";

interface SearchBarProps {
  value: string;
  /** 매 입력마다 호출 (디바운스는 상태 소유자가 처리) */
  onChange: (value: string) => void;
  /** Enter / 검색 버튼 / 초기화 시 즉시 커밋 */
  onSubmit: (value: string) => void;
}

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
  };

  const handleClear = () => {
    onSubmit("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center rounded-sm border border-outline-variant bg-surface-container-lowest shadow-sm transition-all focus-within:border-secondary md:rounded-none"
    >
      <span className="pl-3.5 pr-1 text-on-surface-variant md:pl-4 md:pr-3">
        <Icon name="search" size={22} className="text-outline" />
      </span>
      <input
        ref={inputRef}
        type="text"
        name="concert-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예: 라흐마니노프 피아노 협주곡 3번 / 조성진 / 예술의전당"
        aria-label="공연 프로그램 검색"
        className="min-w-0 flex-1 bg-transparent py-3.5 pl-2 pr-1 text-body-md text-primary placeholder:text-outline focus:outline-none md:py-2 md:pr-2 md:text-body-lg"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="입력 초기화"
          className="mr-1 p-1.5 text-outline transition-colors hover:text-primary md:mr-1"
        >
          <Icon name="close" size={18} />
        </button>
      )}
      <button
        type="submit"
        className="mr-1.5 whitespace-nowrap rounded-xs bg-primary-container px-3 py-1.5 font-label-md text-on-primary transition-colors hover:bg-on-primary-fixed-variant md:mr-0 md:rounded-none md:px-5 md:py-2.5"
      >
        검색
      </button>
    </form>
  );
}
