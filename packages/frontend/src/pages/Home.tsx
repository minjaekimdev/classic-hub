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
  {
    id: "PF282526",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF282526_260102_133310.gif",
    title: "선데이콘서트, 엘림 리사이틀 시리즈: 김선아 피아노 독주회 [인천]",
    artist: "김선아",
    date: { start: "2026.01.11", end: "2026.01.11" },
    venue: "엘림아트센터",
    composerArray: ["쇼팽", "리스트"],
    time: "오후 2시 00분",
    price: { min: 20000, max: 20000 },
  },
  {
    id: "PF282525",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF282525_260102_133138.gif",
    title: "제17회 ARKO한국창작음악제: 양악부문",
    artist: "KBS교향악단 외",
    date: { start: "2026.02.06", end: "2026.02.06" },
    venue: "예술의전당 [서울]",
    composerArray: ["한국 현대 작곡가 다수"],
    time: "오후 7시 30분",
    price: { min: 10000, max: 30000 },
  },
  {
    id: "PF282520",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF282520_260102_131712.gif",
    title: "제83회 시티필하모니오케스트라 정기연주회",
    artist: "시티필하모니오케스트라",
    date: { start: "2026.01.12", end: "2026.01.12" },
    venue: "영산아트홀",
    composerArray: ["베토벤", "브람스"],
    time: "오후 8시 00분",
    price: { min: 30000, max: 100000 },
  },
  {
    id: "PF282516",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF282516_260102_130516.gif",
    title: "김초아 피아노 독주회: 전통과 한국 현대음악을 잇는 피아노의 여정",
    artist: "김초아",
    date: { start: "2026.02.03", end: "2026.02.03" },
    venue: "예술의전당 [서울]",
    composerArray: ["윤이상", "드뷔시"],
    time: "오후 7시 30분",
    price: { min: 20000, max: 50000 },
  },
  {
    id: "PF282509",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF282509_260102_123348.gif",
    title: "이홍규 교수 정년퇴임 음악회",
    artist: "이홍규 및 제자 일동",
    date: { start: "2026.01.31", end: "2026.01.31" },
    venue: "영산아트홀",
    composerArray: ["하이든", "모차르트"],
    time: "오후 3시 00분",
    price: { min: 0, max: 0 }, // 전석 초대일 가능성 고려
  },
  {
    id: "PF282508",
    posterUrl:
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF282508_260102_123348.jpg",
    title: "오감클래식 영유아 클래식 콘서트: Happy New Year! [일산] (1월)",
    artist: "오감클래식 앙상블",
    date: { start: "2026.01.01", end: "2026.01.17" },
    venue: "오감클래식",
    composerArray: ["요한 슈트라우스", "동요 메들리"],
    time: "오전 11시 00분",
    price: { min: 25000, max: 25000 },
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
