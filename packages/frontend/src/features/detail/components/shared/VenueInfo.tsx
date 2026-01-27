import locationIcon from "@shared/assets/icons/location-lightgray.svg";
import telIcon from "@shared/assets/icons/tel-lightgray.svg";
import disabledIcon from "@shared/assets/icons/disabled-black.svg";
import buildingIcon from "@shared/assets/icons/building-lightgray.svg";
import linkIcon from "@shared/assets/icons/link-lightgray.svg";
import Badge from "@/shared/ui/badges/Badge";
import getVenueInfo from "../../fetchers/getVenueInfo";
import { useDetail } from "@/pages/Detail";
import { useEffect, useState } from "react";
import type { Hall } from "@classic-hub/shared/types/client";

interface CategoryProps {
  iconSrc: string;
  title: string;
  children: React.ReactNode;
}
const Category = ({ iconSrc, title, children }: CategoryProps) => {
  return (
    <div className="shrink-0 flex gap-[0.66rem]">
      <img
        src={iconSrc}
        alt="아이콘"
        className="mt-1 w-[0.88rem] h-[0.88rem]"
      />
      <div className="flex flex-col gap-[0.22rem]">
        <span className="text-dark text-[0.88rem]/[1.31rem]">{title}</span>
        {children}
      </div>
    </div>
  );
};

const FACILITY_LABELS: Partial<Record<keyof Hall, string>> = {
  restaurant: "레스토랑",
  cafe: "카페",
  store: "편의점",
  nolibang: "놀이방",
  suyu: "수유실",
  parking: "주차시설",
  disabledParking: "장애인 주차구역",
  disabledRestroom: "장애인 화장실",
  disabledRamp: "휠체어 경사로",
  disabledElevator: "엘리베이터",
};

const VenueInfo = () => {
  const { venue, venueId } = useDetail();
  // 추후 api 호출
  const [venueData, setVenueData] = useState<Hall | null>(null);

  useEffect(() => {
    const handleVenueInfo = async () => {
      const result = await getVenueInfo(venueId, venue);

      setVenueData(result);
    };
    handleVenueInfo();
  }, [venueId, venue]);

  console.log("asdf");
  console.log(venueData);

  return (
    <div className="flex flex-col gap-[0.88rem] px-[0.88rem] py-[1.09rem] desktop:p-0">
      <h3 className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
        공연장 정보
      </h3>
      <div className="flex flex-col gap-[1.31rem]">
        <p className="text-[#717182] text-[0.77rem]/[1.09rem] desktop:text-[0.88rem]/[1.31rem]">
          {venue}
        </p>
        <div className="grid grid-cols-1 tablet:grid tablet:grid-cols-2 gap-[0.88rem]">
          <Category iconSrc={locationIcon} title="주소">
            <span className="text-[#4a5565] text-[0.88rem]/[1.31rem]">
              {venueData ? venueData.address : "-"}
            </span>
          </Category>
          <Category iconSrc={telIcon} title="전화번호">
            <span className="text-[#4a5565] text-[0.88rem]/[1.31rem]">
              {venueData ? venueData.tel : "-"}
            </span>
          </Category>
          <Category iconSrc={telIcon} title="객석 수">
            <span className="text-[#4a5565] text-[0.88rem]/[1.31rem]">
              {venueData ? Number(venueData.seatCount).toLocaleString() : "-"}석
            </span>
          </Category>
          <Category iconSrc={linkIcon} title="홈페이지">
            <a
              href=""
              className="text-blue-600 text-[0.88rem]/[1.31rem] hover:underline"
            >
              {venueData ? venueData.url : "-"}
            </a>
          </Category>
        </div>
        <Category iconSrc={buildingIcon} title="편의시설">
          <div className="flex flex-wrap gap-[0.44rem]">
            {venueData
              ? Object.entries(venueData)
                  .filter(([, value]) => value === true)
                  .map(([key]) => {
                    if (key.includes("disabled")) {
                      return (
                        <Badge>
                          <div className="flex items-center gap-[0.22rem]">
                            <img
                              src={disabledIcon}
                              alt=""
                              className="w-[0.66rem] h-[0.66rem]"
                            />
                            {FACILITY_LABELS[key as keyof Hall]}
                          </div>
                        </Badge>
                      );
                    }
                    return <Badge>{FACILITY_LABELS[key as keyof Hall]}</Badge>;
                  })
              : "-"}
          </div>
        </Category>
      </div>
    </div>
  );
};

export default VenueInfo;
