import bottomArrow from "@shared/assets/icons/bottom-arrow-gray.svg";
import { useSearchFilterDesktop, type FieldType } from "../../contexts/SearchFilterDesktop";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

interface FilterFieldProps {
  iconSrc: string;
  title: FieldType;
  children: React.ReactNode;
}
const SearchFilterField = ({ iconSrc, title, children }: FilterFieldProps) => {
  const { searchValue, activeField, openField, closeField } = useSearchFilterDesktop();
  const isOpen = title === activeField;
  const titleColor = searchValue[title] ? "000" : "text-[#867e7c]";

  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      // isOpenNow에는 앞으로 변할 상태가 들어감(현재 닫힘 -> isOpenNow = true)
      // 클릭과 같은 토글 이벤트가 발생할 때마다 실행됨
      onOpenChange={(isOpenNow: boolean) => {
        if (isOpenNow) {
          openField(title);
        } else {
          closeField();
        }
      }}
    >
      <DropdownMenuTrigger>
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex place-content-between items-center w-full h-[1.97rem] p-[0_0.66rem]">
            <div className="flex items-center gap-[0.44rem]">
              <img className="w-3.5 h-3.5" src={iconSrc} alt="" />
              <span className={`text-[0.77rem]/[1.09rem] ${titleColor}`}>
                {searchValue[title] ? searchValue[title] : title}
              </span>
            </div>
            <img className="w-3.5 h-3.5 mb-1" src={bottomArrow} alt="" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-(--z-header-dropdown)">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchFilterField;
