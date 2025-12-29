import { useState } from "react";
import ProgramInfo from "../shared/ProgramInfo";
import DetailImages from "../shared/DetailImages";
import { useDetail } from "../../model/useDetail";
import PriceInfoMobile from "./PriceInfoMobile";
import VenueInfo from "../shared/VenueInfo";

interface TabProps {
  text: CategoryType;
  selected: string;
  onClick: (category: CategoryType) => void;
}
const Tab = ({ text, selected, onClick }: TabProps) => {
  const isSelected = text === selected;
  const style = isSelected
    ? "border-b-2 border-main text-main"
    : "text-[#4a5565]";
  return (
    <div
      className={`flex-1 flex justify-center items-center h-[2.53rem] text-[#4a5565] text-[0.77rem]/[1.09rem] cursor-pointer ${style}`}
      onClick={() => onClick(text)}
    >
      {text}
    </div>
  );
};

// 상세정보의 각 카테고리(프로그램, 공연 상세 이미지, 공연장 정보 등)에 여백 설정
interface SectionLayoutProps {
  children: React.ReactNode;
}
const SectionLayout = ({ children }: SectionLayoutProps) => {
  return <section className="px-[0.88rem] py-[1.09rem]">{children}</section>;
};

const Detail = () => {
  const performance = useDetail();
  return (
    <div className="flex flex-col gap-[0.44rem]">
      <SectionLayout>
        <ProgramInfo programInfo={performance.programInfo} />
      </SectionLayout>
      <SectionLayout>
        <DetailImages imgUrlArray={performance.detailImages} />
      </SectionLayout>
    </div>
  );
};

type CategoryType = "공연상세" | "가격정보" | "장소정보";
const detailCategory: CategoryType[] = ["공연상세", "가격정보", "장소정보"];

const MainDetailMobile = () => {
  const [selected, setSelected] = useState<CategoryType>("공연상세");

  const handleClick = (category: CategoryType) => {
    setSelected(category);
  };

  const detailObj: Record<CategoryType, React.ReactNode> = {
    공연상세: <Detail />,
    가격정보: <PriceInfoMobile />,
    장소정보: <VenueInfo />,
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        {detailCategory.map((item) => (
          <Tab
            key={item}
            text={item}
            selected={selected}
            onClick={handleClick}
          />
        ))}
      </div>
      {detailObj[selected]}
    </div>
  );
};

export default MainDetailMobile;
