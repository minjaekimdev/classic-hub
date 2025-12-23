import calendarIcon from "@shared/assets/icons/calendar-gray.svg";
import crownIcon from "@shared/assets/icons/crown-gold.svg";
import medalIcon from "@shared/assets/icons/medal-silver.svg";
import badgeIcon from "@shared/assets/icons/badge-bronze.svg";
import type { PerformanceType } from "@classic-hub/shared/types/performance";

interface RankProps {
  rank: string;
}

const Rank = ({ rank }: RankProps) => {
  let backgroundStyle =
    "bg-[linear-gradient(135deg,#f1f5f9_0%,#e2e8f0_100%)] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]";

  let iconSrc = "";

  switch (rank) {
    case "1":
      iconSrc = crownIcon;
      backgroundStyle =
        "bg-[linear-gradient(135deg,#FDC700_0%,#F0B100_50%,#D08700_100%)] " +
        "shadow-[0_0_0_2px_rgba(253,199,0,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]";
      break;

    case "2":
      iconSrc = medalIcon;
      backgroundStyle =
        "bg-[linear-gradient(135deg,#CAD5E2_0%,#90A1B9_50%,#62748E_100%)] " +
        "shadow-[0_0_0_2px_rgba(202,213,226,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]";
      break;

    case "3":
      iconSrc = badgeIcon;
      backgroundStyle =
        "bg-[linear-gradient(135deg,#FE9A00_0%,#E17100_50%,#BB4D00_100%)] " +
        "shadow-[0_0_0_2px_rgba(255,185,0,0.30),0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]";
      break;
  }

  return (
    <div
      className={`shrink-0 w-[2.19rem] h-[2.19rem] flex justify-center items-center rounded-full ${backgroundStyle}`}
    >
      {iconSrc ? (
        <img src={iconSrc} alt="공연 랭킹" />
      ) : (
        <span className="text-[#717182] text-[0.98rem]/[1.53rem] font-semibold">
          {rank}
        </span>
      )}
    </div>
  );
};

interface PosterProps {
  posterUrl: string;
}

const Poster = ({ posterUrl }: PosterProps) => {
  return (
    <div className="shrink-0 w-14 h-[4.67rem] rounded-[0.22rem] overflow-hidden">
      <img className="w-full h-full" src={posterUrl}></img>
    </div>
  );
};

type MetaType = Omit<RankingItemProps, "rank" | "posterUrl" | "time">;

interface MetaProps {
  data: MetaType;
}

const Meta = ({ data }: MetaProps) => {
  const normalFontStyle = "text-[#717182] text-[0.66rem]/[0.88rem]";
  return (
    <div className="grow">
      <ul className="flex flex-col ">
        <li className="mb-[0.16rem] text-[#0a0a0a] text-[0.77rem]/[1.09rem] font-semibold">
          {data.title}
        </li>
        <li className={`mb-[0.44rem] ${normalFontStyle}`}>{data.artist}</li>
        <li className="flex gap-[0.22rem] items-center mb-[0.56rem]">
          <img src={calendarIcon} />
          <span className={`${normalFontStyle}`}>
            {data.stdate} ~ {data.eddate}
          </span>
        </li>
        <li className={`${normalFontStyle}`}>{data.hall}</li>
      </ul>
    </div>
  );
};

interface RankingItemProps extends PerformanceType {
  rank: string;
}

const RankingItem = ({
  rank,
  posterUrl,
  title,
  artist,
  stdate,
  eddate,
  hall,
}: RankingItemProps) => {
  return (
    <div className="flex gap-[0.88rem] items-center rounded-[0.55rem] px-[0.66rem] h-[6.34rem] cursor-pointer hover:bg-[rgba(236,236,240,0.5)]">
      <Rank rank={rank} />
      <Poster posterUrl={posterUrl} />
      <Meta data={{ title, artist, stdate, eddate, hall }} />
      <button className="shrink-0 justify-center items-center px-[0.43rem] py-[0.40rem] bg-main rounded-[0.42rem] text-white text-[0.77rem]/[1.09rem] font-medium">
        예매하기
      </button>
    </div>
  );
};

export default RankingItem;
