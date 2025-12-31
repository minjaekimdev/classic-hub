import locationIcon from "@shared/assets/icons/location-lightgray.svg";
import telIcon from "@shared/assets/icons/tel-lightgray.svg";
import disabledIcon from "@shared/assets/icons/disabled-black.svg";
import buildingIcon from "@shared/assets/icons/building-lightgray.svg";
import linkIcon from "@shared/assets/icons/link-lightgray.svg";
import Badge from "@/shared/ui/badges/Badge";
import { useDetail } from "../../model/useDetail";
import { useVenueInfo } from "../../model/useVenueInfo";

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

interface Facility {
  restaurant: boolean;
  cafe: boolean;
  store: boolean;
  nolibang: boolean;
  suyu: boolean;
  parkbarrier: boolean;
  restbarrier: boolean;
  runwbarrier: boolean;
  elevbarrier: boolean;
  parkinglot: boolean;
}
const FACILITY_LABELS: Record<keyof Facility, string> = {
  restaurant: "레스토랑",
  cafe: "카페",
  store: "편의점",
  nolibang: "놀이방",
  suyu: "수유실",
  parkbarrier: "장애인 주차구역",
  restbarrier: "장애인 화장실",
  runwbarrier: "휠체어 경사로",
  elevbarrier: "엘리베이터",
  parkinglot: "주차시설",
};

export interface VenueData {
  address: string; // 주소
  tel: string; // 전화번호
  seatscale: string; // 객석 수
  link: string; // 홈페이지 링크
  facilities: Facility;
}
const VenueInfo = () => {
  const { venue, venueId } = useDetail();
  // 추후 api 호출
  const data = useVenueInfo(venueId);
  return (
    <div className="flex flex-col gap-[0.88rem] px-[0.88rem] py-[1.09rem] desktop:p-0">
      <h3 className="text-dark text-[0.88rem]/[1.31rem] desktop:text-[1.31rem]/[1.75rem] font-semibold">
        공연장 정보
      </h3>
      <div className="flex flex-col gap-[1.31rem]">
        <p className="text-[#717182] text-[0.77rem]/[1.09rem] desktop:text-[0.88rem]/[1.31rem]">{venue}</p>
        <div className="grid grid-cols-1 tablet:grid tablet:grid-cols-2 gap-[0.88rem]">
          <Category iconSrc={locationIcon} title="주소">
            <span className="text-[#4a5565] text-[0.88rem]/[1.31rem]">
              {data ? data.address : "-"}
            </span>
          </Category>
          <Category iconSrc={telIcon} title="전화번호">
            <span className="text-[#4a5565] text-[0.88rem]/[1.31rem]">
              {data ? data.tel : "-"}
            </span>
          </Category>
          <Category iconSrc={telIcon} title="객석 수">
            <span className="text-[#4a5565] text-[0.88rem]/[1.31rem]">
              {data ? Number(data.seatscale).toLocaleString() : "-"}석
            </span>
          </Category>
          <Category iconSrc={linkIcon} title="홈페이지">
            <a
              href=""
              className="text-blue-600 text-[0.88rem]/[1.31rem] hover:underline"
            >
              {data ? data.link : "-"}
            </a>
          </Category>
        </div>
        <Category iconSrc={buildingIcon} title="편의시설">
          <div className="flex flex-wrap gap-[0.44rem]">
            {data
              ? Object.entries(data.facilities)
                  .filter(([, value]) => value === true)
                  .map(([key]) => {
                    if (key.includes("barrier")) {
                      return (
                        <Badge>
                          <div className="flex items-center gap-[0.22rem]">
                            <img
                              src={disabledIcon}
                              alt=""
                              className="w-[0.66rem] h-[0.66rem]"
                            />
                            {FACILITY_LABELS[key as keyof Facility]}
                          </div>
                        </Badge>
                      );
                    }
                    return (
                      <Badge>{FACILITY_LABELS[key as keyof Facility]}</Badge>
                    );
                  })
              : "-"}
          </div>
        </Category>
        {/* 공연장 지도 */}
        <div className="flex flex-col gap-[0.44rem]">
          <p className="text-dark text-[0.77rem]/[1.09rem]">위치</p>
          <div className="rounded-main border border-[rgba(0,0,0,0.1)] h-56"></div>
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;
