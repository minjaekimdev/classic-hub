import LOCATION_ARR from "../../constants/search-filter-location.mobile";
import { useSearchMobile } from "../../contexts/search-context.mobile";

interface LocationComponentProps {
  main: string;
  sub: string;
}

const LocationComponent = ({ main, sub }: LocationComponentProps) => {
  const { searchValue, changeValue } = useSearchMobile();
  const style = main === searchValue.location ? "border-main bg-[#fef2f2]" : "";
  return (
    <div
      className={`flex flex-col border rounded-main p-[0.72rem] cursor-pointer ${style}`}
      onClick={() => {
        changeValue({ ...searchValue, location: main });
      }}
    >
      <span className="text-[#101828] text-[0.77rem]/[1.09rem] font-medium">
        {main}
      </span>
      <span className="text-[#4a5565] text-[0.66rem]/[0.88rem]">{sub}</span>
    </div>
  );
};

const LocationSelectMobile = () => {
  return (
    <div className="grid grid-cols-2 gap-[0.44rem]">
      {LOCATION_ARR.map((item) => (
        <LocationComponent key={item.main} main={item.main} sub={item.sub} />
      ))}
    </div>
  );
};

export default LocationSelectMobile;
