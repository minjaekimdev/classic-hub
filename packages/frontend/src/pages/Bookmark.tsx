import BookmarkHeader from "@/features/bookmark/BookmarkHeader";
import BookmarkSearchBox from "@/features/bookmark/BookmarkSearchBox";
import BookmarkFilter from "@/features/bookmark/BookmarkFilter";
import BookmarkPerformance from "@/features/performance/ui/shared/BookmarkPerformance";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";

const Bookmark = () => {
  // 추후 api 호출
  const performanceArray = [
    {
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281717_251217_104137.jpg",
      name: "장애인과 함께하는 음악회: 아름다운 동행 [성남]",
      artist: "성남아트센터",
      startDate: "2025.12.21",
      endDate: "2025.12.21",
      hall: "성남아트센터",
    },
    {
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281644_251216_105921.png",
      name: "제7회 GTG 청소년오케스트라 정기연주회",
      artist: "GTG 청소년오케스트라",
      startDate: "2025.12.21",
      endDate: "2025.12.21",
      hall: "고양아람누리",
    },
    {
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281617_251215_150928.gif",
      name: "임동혁의 크리스마스 음악선물 [화성]",
      artist: "임동혁",
      startDate: "2025.12.21",
      endDate: "2025.12.21",
      hall: "남양성모성지",
    },
    {
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281557_251215_124338.jpg",
      name: "오잉클! (12월)",
      artist: "오감클래식",
      startDate: "2025.12.21",
      endDate: "2025.12.21",
      hall: "오감클래식",
    },
    {
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281548_251215_114328.gif",
      name: "처음 만나는 클래식 (12월)",
      artist: "콘서트홀 나누",
      startDate: "2025.12.21",
      endDate: "2025.12.25",
      hall: "콘서트홀 나누",
    },
    {
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281498_251212_160323.png",
      name: "메리! 클래식-마스",
      artist: "클래시카 서울",
      startDate: "2025.12.21",
      endDate: "2025.12.21",
      hall: "클래시카 서울",
    },
  ];
  const pfNum = 3;
  return (
    <LayoutDesktop variant="main">
      <BookmarkHeader pfNum={pfNum} />
      <div className="mt-7">
        <BookmarkSearchBox />
      </div>
      <div className="mt-7">
        <BookmarkFilter />
      </div>
      <div className="grid grid-cols-1 gap-[1.31rem] tablet:grid-cols-2 desktop:grid-cols-3 large-desktop:grid-cols-4 mt-[1.37rem]">
        {performanceArray.map((item) => (
          <BookmarkPerformance
            poster={item.posterUrl}
            title={item.name}
            artist={item.artist}
            startDate={item.startDate}
            endDate={item.endDate}
            venue={item.hall}
          />
        ))}
      </div>
    </LayoutDesktop>
  );
};

export default Bookmark;
