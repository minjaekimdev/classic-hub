import HomeLayout from "@/shared/layout/HomeLayout";
import RankingPerformances from "@/features/performance/components/RankingPerformances";
import WeekendPerformances from "@/features/performance/components/WeekendPerformances";
// import MainLayout from "@/shared/layout/MainLayout";
import type { HomePerformance } from "@classic-hub/shared/types/performance";

// 목업 데이터
const homeRankingData: HomePerformance[] = [
  {
    id: "rank-1",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: 1,
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    date: { start: "2026년 1월 13일 (목)", end: "2026년 1월 13일 (목)" },
    venue: "롯데콘서트홀",
    composerArray: ["쇼팽", "슈베르트"],
    time: "오후 8시 30분",
    price: { min: 80000, max: 80000 },
  },
  {
    id: "rank-2",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: 1,
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    date: { start: "2026년 1월 13일 (목)", end: "2026년 1월 13일 (목)" },
    venue: "롯데콘서트홀",
    composerArray: ["브람스", "시마노프스키"],
    time: "오후 8시 30분",
    price: { min: 80000, max: 90000 },
  },
  {
    id: "rank-3",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: 1,
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    date: { start: "2026년 1월 13일 (목)", end: "2026년 1월 13일 (목)" },
    venue: "롯데콘서트홀",
    composerArray: ["베토벤"],
    time: "오후 8시 30분",
    price: { min: 80000, max: 80000 },
  },
  {
    id: "rank-4",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: 1,
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    date: { start: "2026년 1월 13일 (목)", end: "2026년 1월 13일 (목)" },
    venue: "롯데콘서트홀",
    composerArray: ["드뷔시", "라벨"],
    time: "오후 8시 30분",
    price: { min: 80000, max: 80000 },
  },
  {
    id: "rank-5",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
    rank: 1,
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
    artist: "크리스티안 짐머만",
    date: { start: "2026년 1월 13일 (목)", end: "2026년 1월 13일 (목)" },
    venue: "롯데콘서트홀",
    composerArray: ["리스트"],
    time: "오후 8시 30분",
    price: { min: 80000, max: 80000 },
  },
];

const homeWeekendData: HomePerformance[] = [
  {
    id: "wk-1",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279144_251114_171830.gif",
    title: "제16회 국민일보 영산아트홀 오르간 & 실내악 콩쿠르 입상자 연주회",
    artist: "국민일보 콩쿠르 입상자",
    date: { start: "2025.11.16", end: "2025.11.16" },
    venue: "영산아트홀",
    composerArray: ["바흐", "멘델스존", "비도르"],
    time: "오후 7시 30분",
    price: { min: 30000, max: 50000 },
  },
  {
    id: "wk-2",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279126_251114_161108.jpg",
    title:
      "용인시립청소년오케스트라 & 용인시립소년소녀합창단 합동 정기연주회 [용인]",
    artist: "용인시립 단원 일동",
    date: { start: "2025.11.16", end: "2025.11.16" },
    venue: "용인포은아트홀",
    composerArray: ["모차르트", "베토벤"],
    time: "오후 5시 00분",
    price: { min: 50000, max: 50000 },
  },
  {
    id: "wk-3",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279006_251113_141147.jpg",
    title: "비원뮤직홀 로맨틱 시리즈, 렉처콘서트: 당신 곁의 클래식",
    artist: "클래식 해설가 A",
    date: { start: "2025.11.15", end: "2025.11.15" },
    venue: "비원뮤직홀",
    composerArray: ["슈만", "클라라 슈만"],
    time: "오후 8시 00분",
    price: { min: 25000, max: 25000 },
  },
  {
    id: "wk-4",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278862_251112_112952.png",
    title: "크리스마스 & 애니메이션 OST 섀도우콘서트 [제주]",
    artist: "제주 앙상블",
    date: { start: "2025.11.15", end: "2025.12.31" },
    venue: "알레스 아트(Alles-Art)",
    composerArray: ["히사이시 조", "차이콥스키", "알란 멘켄"],
    time: "저녁 6시 30분",
    price: { min: 35000, max: 320000 },
  },
  {
    id: "wk-5",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278537_251110_104240.gif",
    title: "제3회 KIMEEA 정기음악회",
    artist: "KIMEEA 회원",
    date: { start: "2025.11.16", end: "2025.11.16" },
    venue: "로데아트센터",
    composerArray: ["포레", "생상스"],
    time: "오후 3시 00분",
    price: { min: 10000, max: 10000 },
  },
];

const Home = () => {
  return (
    <HomeLayout>
      <RankingPerformances performanceArray={homeRankingData} />
      <WeekendPerformances performanceArray={homeWeekendData} />
    </HomeLayout>
  );
};

export default Home;
