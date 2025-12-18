import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/shadcn/dropdown-menu";
import { useState } from "react";
import dropdownIcon from "@shared/assets/icons/bottom-arrow-gray.svg";
import calendarIcon from "@shared/assets/icons/calendar-gray.svg";

// 현재 ~ 현재 + 6개월을 필터링 항목으로 설정 (xxxx년 x월)
const monthArray: string[] = ["전체 월"];
const now = new Date();
for (let i = 0; i < 6; i++) {
  const date = new Date(now.getFullYear(), now.getMonth() + i);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-based → 1-based

  monthArray.push(`${year}년 ${month}월`);
}

// 공연 정렬 기준
const sortMenuArray = ["공연임박순", "가나다순"];

interface DropdownProps {
  label: string;
  menuArray: string[];
}

const Dropdown = ({ label, menuArray }: DropdownProps) => {
  const [selected, setSelected] = useState<string>(menuArray[0]);
  return (
    <div className="shrink-0 flex items-center gap-[0.38rem]">
      <span className="text-[#0a0a0a] text-[0.77rem]/[1.09rem] font-medium">
        {label}:
      </span>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <div className="flex items-center justify-between rounded-[0.42rem] border border-transparent bg-[#f3f3f5] w-[9.38rem] px-[0.66rem] h-[1.97rem] cursor-pointer">
            <span className="text-[#0a0a0a] text-[0.77rem]/[1.09rem]">
              {selected}
            </span>
            <img
              src={dropdownIcon}
              alt="드롭다운 아이콘"
              className="w-[0.88rem] h-[0.88rem]"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-[600px]:hidden">
          {menuArray.map((item) => (
            <DropdownMenuItem
              className="text-xs cursor-pointer"
              onSelect={() => setSelected(item)}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const BookmarkFilter = () => {
  return (
    <div className="flex justify-between items-center flex-wrap rounded-[0.55rem] bg-[rgba(236,236,240,0.3)] px-[0.88rem]">
      <div className="shrink-0 flex items-center gap-[0.44rem] py-[0.88rem]">
        <img
          src={calendarIcon}
          alt="달력 아이콘"
          className="w-[0.88rem] h-[0.88rem]"
        />
        <Dropdown label="월별 필터" menuArray={monthArray} />
      </div>
      <div className="pb-[0.88rem] tablet:p-[0.88rem]">
        <Dropdown label="정렬" menuArray={sortMenuArray} />
      </div>
    </div>
  );
};

export default BookmarkFilter;
