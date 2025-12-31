import type { filterCategoryObjType } from "@/features/filter/model/filter";

interface LocationComponentProps {
  main: string;
  sub: string;
  selected: filterCategoryObjType;
  onChange: (value: filterCategoryObjType) => void;
}

const LocationComponent = ({
  main,
  sub,
  selected,
  onChange,
}: LocationComponentProps) => {
  const style = main === selected.location ? "border-main bg-[#fef2f2]" : "";
  return (
    <div
      className={`flex flex-col border rounded-main p-[0.72rem] cursor-pointer ${style}`}
      onClick={() => {
        onChange({ ...selected, location: main });
      }}
    >
      <span className="text-[#101828] text-[0.77rem]/[1.09rem] font-medium">
        {main}
      </span>
      <span className="text-[#4a5565] text-[0.66rem]/[0.88rem]">{sub}</span>
    </div>
  );
};

const locationArray = [
  {
    main: "전체 지역",
    sub: "모든 지역의 공연",
  },
  {
    main: "서울",
    sub: "서울특별시",
  },
  {
    main: "경기",
    sub: "경기도",
  },
  {
    main: "인천",
    sub: "인천광역시",
  },
  {
    main: "부산",
    sub: "부산광역시",
  },
  {
    main: "대구",
    sub: "대구광역시",
  },
];

interface LocationSelectMobileProps {
  filterValue: filterCategoryObjType;
  onChange: (value: filterCategoryObjType) => void;
}

const LocationSelectMobile = ({
  filterValue,
  onChange,
}: LocationSelectMobileProps) => {
  return (
    <div className="grid grid-cols-2 gap-[0.44rem]">
      {locationArray.map((item) => (
        <LocationComponent
          key={item.main}
          main={item.main}
          sub={item.sub}
          selected={filterValue}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default LocationSelectMobile;
