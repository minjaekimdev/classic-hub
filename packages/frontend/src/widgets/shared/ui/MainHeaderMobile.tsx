import logo from "@shared/assets/logos/classichub.svg";
import filterIcon from "@shared/assets/icons/filter-dark.svg";
import React from "react";
import BottomSheet from "@/shared/ui/bottom-sheet/BottomSheet";
import { Link } from "react-router-dom";
import useSmallFilterInfo from "../../../features/filter/hooks/useSmallFilterInfo";

const MainHeaderMobile = () => {
  const { keyword, location, priceText, dateText } = useSmallFilterInfo();

  // 1. 순서대로 배열 정의 (우선순위: 검색어 -> 지역 -> 가격 -> 날짜)
  const allFilters = [
    { key: "keyword", value: keyword, label: keyword }, // 검색어는 그대로 보여줌
    { key: "location", value: location, label: `${location}의 공연` }, // 지역은 뒤에 '의 공연' 붙임
    { key: "price", value: priceText, label: "가격 지정" }, // 가격 등은 상황에 맞게 라벨링 가능
    { key: "date", value: dateText, label: "날짜 지정" },
  ];

  // 2. 값이 있는(유효한) 필터만 싹 골라냄
  const activeFilters = allFilters.filter((item) => item.value);

  // 3. 메인 타이틀과 서브 텍스트 결정
  // 필터가 하나도 없으면 기본값("공연 목록" 등)을 보여주거나 빈 상태 처리
  const hasFilter = activeFilters.length > 0;
  
  // 첫 번째 필터가 메인 타이틀
  const mainTitle = hasFilter 
    ? (activeFilters[0].key === 'keyword' ? activeFilters[0].value : activeFilters[0].label)
    : "공연 정보를 찾아보세요"; // 기본 멘트 (필터 없을 때)

  // 나머지 필터들은 서브 텍스트 ( | 로 연결)
  const subTitleFilters = hasFilter ? activeFilters.slice(1) : [];

  return (
    <h1 className="sticky z-(--z-header) top-0 flex justify-center items-center px-[0.88rem] py-[0.49rem] bg-white">
      <Link to="/">
        <img src={logo} alt="로고" />
      </Link>
      
      <div className="w-[0.66rem]"></div>
      
      <div className="flex-1">
        <BottomSheet.Trigger>
          <div className="rounded-full px-[0.88rem] py-[0.66rem] bg-[#F3F4F6] cursor-pointer">
            <div className="flex flex-col">
              {/* 메인 타이틀 */}
              <span className="text-[#101828] text-[0.77rem]/[1.09rem] font-semibold">
                {mainTitle}
              </span>

              {/* 서브 타이틀 (나머지 필터들) */}
              {subTitleFilters.length > 0 && (
                <div className="flex gap-[0.33rem] mt-0.5">
                  {subTitleFilters.map((filter, index) => (
                    <React.Fragment key={filter.key}>
                      <span className="text-[#4a5565] text-[0.66rem]/[0.88rem]">
                        {filter.value}
                      </span>
                      {/* 마지막 요소가 아닐 때만 구분자(|) 표시 */}
                      {index < subTitleFilters.length - 1 && (
                        <span className="text-[#4a5565] text-[0.66rem]/[0.88rem]">
                          |
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </BottomSheet.Trigger>
      </div>

      <div className="w-[0.66rem]"></div>
      <button className="flex items-center justify-center border border-[#d1d5dc] rounded-full w-[2.09rem] h-[2.09rem]">
        <img src={filterIcon} alt="필터" />
      </button>
    </h1>
  );
};

export default MainHeaderMobile;