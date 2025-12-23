import HomePerformanceRanking from "@/features/performance/components/HomePerformanceRanking";
import HomePerformanceWeekend from "@/features/performance/components/WeekendPerformances";
import MainLayout from "@/shared/layout/MainLayout";

// 목업 데이터
const rankingArray = [
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: "1",
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    stdate: "2026년 1월 13일 (목)",
    eddate: "2026년 1월 13일 (목)",
    time: "오후 8시 30분",
    hall: "롯데콘서트홀",
    lowPrice: "80,000",
    highPrice: "80,000",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: "1",
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    stdate: "2026년 1월 13일 (목)",
    eddate: "2026년 1월 13일 (목)",
    time: "오후 8시 30분",
    hall: "롯데콘서트홀",
    lowPrice: "80,000",
    highPrice: "90,000",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: "1",
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    stdate: "2026년 1월 13일 (목)",
    eddate: "2026년 1월 13일 (목)",
    time: "오후 8시 30분",
    hall: "롯데콘서트홀",
    lowPrice: "80,000",
    highPrice: "80,000",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: "1",
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    stdate: "2026년 1월 13일 (목)",
    eddate: "2026년 1월 13일 (목)",
    time: "오후 8시 30분",
    hall: "롯데콘서트홀",
    lowPrice: "80,000",
    highPrice: "80,000",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: "1",
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    stdate: "2026년 1월 13일 (목)",
    eddate: "2026년 1월 13일 (목)",
    time: "오후 8시 30분",
    hall: "롯데콘서트홀",
    lowPrice: "80,000",
    highPrice: "80,000",
  },
];

const weekendArray = [
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279144_251114_171830.gif",
    title: "제16회 국민일보 영산아트홀 오르간 & 실내악 콩쿠르 입상자 연주회",
    artist: "국민일보 콩쿠르 입상자",
    stdate: "2025.11.16",
    eddate: "2025.11.16",
    time: "오후 7시 30분",
    hall: "영산아트홀",
    lowPrice: "30,000원",
    highPrice: "50,000원",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279126_251114_161108.jpg",
    title:
      "용인시립청소년오케스트라 & 용인시립소년소녀합창단 합동 정기연주회 [용인]",
    artist: "용인시립 단원 일동",
    stdate: "2025.11.16",
    eddate: "2025.11.16",
    time: "오후 5시 00분",
    hall: "용인포은아트홀",
    lowPrice: "50,000원",
    highPrice: "50,000원",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279006_251113_141147.jpg",
    title: "비원뮤직홀 로맨틱 시리즈, 렉처콘서트: 당신 곁의 클래식",
    artist: "클래식 해설가 A",
    stdate: "2025.11.15",
    eddate: "2025.11.15",
    time: "오후 8시 00분",
    hall: "비원뮤직홀",
    lowPrice: "25,000원",
    highPrice: "25,000원",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278862_251112_112952.png",
    title: "크리스마스 & 애니메이션 OST 섀도우콘서트 [제주]",
    artist: "제주 앙상블",
    stdate: "2025.11.15",
    eddate: "2025.12.31",
    time: "저녁 6시 30분",
    hall: "알레스 아트(Alles-Art)",
    lowPrice: "35,000원",
    highPrice: "320,000원",
  },
  {
    imgSrc:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278537_251110_104240.gif",
    title: "제3회 KIMEEA 정기음악회",
    artist: "KIMEEA 회원",
    stdate: "2025.11.16",
    eddate: "2025.11.16",
    time: "오후 3시 00분",
    hall: "로데아트센터",
    lowPrice: "10,000원",
    highPrice: "10,000원",
  },
];

const Home = () => {
  return (
    <MainLayout>
      <HomePerformanceRanking performanceArray={rankingArray} />
      <HomePerformanceWeekend performanceArray={weekendArray} />
    </MainLayout>
  );
};

export default Home;
