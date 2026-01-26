import { useState } from "react";
import DetailImages from "../shared/DetailImages";
import VenueInfo from "../shared/VenueInfo";
import PriceInfo from "../shared/PriceInfo";
import { useDetail } from "@/pages/Detail";

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

const Detail = () => {
  const { detailImages } = useDetail();
  return (
    <div className="flex flex-col gap-[0.44rem]">
      <section className="px-[0.88rem] py-[1.09rem]">
        <DetailImages imgUrlArray={detailImages} />
      </section>
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
    가격정보: <PriceInfo />,
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
