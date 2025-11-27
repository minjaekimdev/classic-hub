import searchIcon from "@shared/assets/icons/search-gray.svg";
import locationIcon from "@shared/assets/icons/location-blue.svg";
import calendarIcon from "@shared/assets/icons/calendar-purple.svg";
import moneyIcon from "@shared/assets/icons/dollar-orange.svg";
import searchWhite from "@shared/assets/icons/search-white.svg";
import closeIcon from "@shared/assets/icons/close-gray.svg";

const Header = () => {
  return (
    <div className="flex flex-col gap-[0.33rem] border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem] pt-[1.31rem] pb-[0.94rem]">
      <div className="flex justify-between items-center">
        <h3 className="text-[#0a0a0a] text-[0.88rem]/[1.31rem] font-semibold">
          검색 필터
        </h3>
        <img src={closeIcon} alt="" className="w-[1.31rem] h-[1.31rem] cursor-pointer"/>
      </div>
      <span className="text-[#717182] text-[0.77rem]/[1.09rem]">
        원하는 공연을 찾아보세요
      </span>
    </div>
  );
};

const SearchInput = () => {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#d1d5dc] bg-[#f3f3f5] p-[0.22rem_0.66rem] h-10 cursor-pointer">
      <img src={searchIcon} alt="" className="w-3.5 h-3.5" />
      <input
        type="text"
        className="w-full placeholder:text-[#717182] text-[0.88rem] cursor-pointer"
        placeholder="공연명, 아티스트명, 작품명 등"
      />
    </div>
  );
};

interface FilterFieldProps {
  iconSrc: string;
  label: string;
  subtitle: string;
}

const FilterField = ({ iconSrc, label, subtitle }: FilterFieldProps) => {
  return (
    <div className="flex items-center gap-[0.66rem]  rounded-[0.797rem] bg-[#f9fafb] p-[0.88rem] cursor-pointer">
      <div className="flex justify-center items-center w-[1.97rem] h-[1.97rem]">
        <img src={iconSrc} alt="" />
      </div>
      <div className="flex flex-col">
        <span className="text-[#101828] text-[0.88rem]/[1.31rem] font-medium">
          {label} 선택
        </span>
        <span className="text-[#4a5565] text-[0.77rem]/[1.09rem]">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

const MobileFilter = () => {
  return (
    <div className="flex flex-col rounded-tl-[1.31rem] rounded-tr-[1.31rem]">
      <Header />
      <div className="border-b border-b-[rgba(0,0,0,0.1)] px-[1.31rem] py-[0.88rem]">
        <SearchInput />
      </div>
      <div className="flex flex-col gap-[0.62rem] px-[1.31rem] py-[0.88rem]">
        <span className="text-[#364153] text-[0.77rem]/[1.09rem] font-medium">
          추천 필터
        </span>
        <FilterField
          iconSrc={locationIcon}
          label="지역"
          subtitle="가까운 지역의 공연 찾기"
        />
        <FilterField
          iconSrc={calendarIcon}
          label="날짜"
          subtitle="관람하고 싶은 날짜를 선택하세요"
        />
        <FilterField
          iconSrc={moneyIcon}
          label="가격대"
          subtitle="예산에 맞는 공연 찾기"
        />
      </div>
      <div className="flex gap-[0.66rem] px-[1.31rem] py-[0.88rem]">
        <button className="grow flex justify-center items-center rounded-[0.42rem] border border-[rgba(0,0,0,0.1)] h-[1.97rem] text-[#0a0a0a] text-[0.77rem]/[1.09rem]">
          전체 삭제
        </button>
        <button className="grow flex justify-center items-center gap-[0.88rem] rounded-[0.42rem] bg-main h-[1.97rem] text-white text-[0.77rem]/[1.09rem]">
          <img src={searchWhite} alt="" className="" />
          검색
        </button>
      </div>
    </div>
  );
};

export default MobileFilter;
