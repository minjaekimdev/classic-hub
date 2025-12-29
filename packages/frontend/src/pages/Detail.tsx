import HeaderMobile from "@/features/detail/components/mobile/HeaderMobile";
import PosterMobile from "@/features/detail/components/mobile/PosterMobile";
import SummaryMobile from "@/features/detail/components/mobile/SummaryMobile";
import MainDetailMobile from "@/features/detail/components/mobile/MainDetailMobile";
import type { DetailPerformance } from "@classic-hub/shared/types/performance";
import { DetailContext } from "@/features/detail/model/DetailContext";

const Detail = () => {
  // 추후 api 호출
  const performance: DetailPerformance = {
    // 1. Performance 기본 정보
    id: "PF278593",
    title: "크리스티안 짐머만 피아노 리사이틀 [서울]",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    artist: "크리스티안 짐머만",
    date: {
      start: "2026.01.13",
      end: "2026.01.15",
    },
    venue: "롯데콘서트홀 (롯데콘서트홀)",
    venueId: "FC001513",
    time: "화요일(19:30), 목요일(19:30)",
    runningTime: "2시간",
    age: "만 7세 이상",
    priceInfo: [
      { seat: "R석", price: 180000 },
      { seat: "S석", price: 140000 },
      { seat: "A석", price: 110000 },
      { seat: "B석", price: 90000 },
      { seat: "C석", price: 70000 },
      { seat: "시야방해R", price: 144000 },
      { seat: "시야방해S", price: 112000 },
      { seat: "시야방해A", price: 88000 },
      { seat: "시야방해B", price: 72000 },
    ],

    // 4. 프로그램 정보
    // XML 데이터 내 <sty>가 비어있으므로, 초기값은 빈 배열로 설정합니다.
    // 추후 Gemini API를 통해 상세 이미지(styurl) 텍스트를 분석하여 채울 영역입니다.
    programInfo: [
      {
        composer: "Frédéric Chopin",
        pieces: [
          "Nocturne in F-sharp major, Op. 15 No. 2",
          "Piano Sonata No. 2 in B-flat minor, Op. 35 'Funeral March'",
        ],
      },
      {
        composer: "Johannes Brahms",
        pieces: ["4 Klavierstücke, Op. 119"],
      },
      {
        composer: "Karol Szymanowski",
        pieces: ["Variations on a Polish Folk Theme in B-flat minor, Op. 10"],
      },
    ],

    // 5. 상세 이미지 (styurls 내 styurl 배열)
    detailImages: [
      "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF278593_202511100106239760.jpg",
    ],
  };

  return (
    <DetailContext value={performance}>
      <div className="flex flex-col">
        <HeaderMobile />
        <PosterMobile />
        <SummaryMobile />
        <MainDetailMobile />
      </div>
    </DetailContext>
  );
};

export default Detail;
