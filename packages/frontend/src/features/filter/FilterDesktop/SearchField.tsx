import searchIcon from "@shared/assets/icons/search-gray.svg";

interface SearchFieldProps {
  inputValue: string;
  onChange: (value: string) => void;
}

const SearchField = ({ inputValue, onChange }: SearchFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 이벤트 객체(e)에서 입력된 새로운 값(target.value)을 가져와 상태를 업데이트
    onChange(e.target.value);
  };
  return (
    <div className="flex items-center gap-[0.66rem] p-[0.22rem_0.66rem] h-[2.63rem]">
      <img src={searchIcon} alt="" />
      <input
        className="w-full text-[0.77rem] placeholder:text-[0.77rem] focus-visible:outline-none"
        type="text"
        placeholder="공연명, 아티스트명, 작품명 등으로 검색해보세요!"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchField;
