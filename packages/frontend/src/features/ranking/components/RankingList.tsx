import trophyIcon from "@shared/assets/icons/trophy-gold.svg";
import RankingItem from "@/features/ranking/components/RankingItem";

const RankingListHeader = () => {
  return (
    <div className="p-[1.38rem]">
      <div className="flex gap-[0.44rem] items-center">
        <img src={trophyIcon} alt="트로피 아이콘" />
        <span className="text-[#0a0a0a] text-[0.88rem]">월간 인기 공연 Top 50</span>
      </div>
    </div>
  );
};

const RankingList = () => {
  // 추후 api 호출로 데이터 받아오기
  const rankingPerformanceList = [
    {
      rank: "1",
      name: "크리스티안 짐머만 피아노 리사이틀 [서울]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278593_251111_135635.gif",
      artist: "크리스티안 짐머만",
      date: "2026.01.13~2026.01.15",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "2",
      name: "헐리우드 인 크리스마스 [인천]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278701_251110_164201.gif",
      artist: "WE필하모닉 오케스트라",
      date: "2025.12.14~2025.12.14",
      hall: "아트센터 인천 콘서트홀",
    },
    {
      rank: "3",
      name: "국립오페라단, 피가로의 결혼 Le nozze di Figaro [군포]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278683_251110_154558.gif",
      artist: "국립오페라단",
      date: "2025.12.26~2025.12.27",
      hall: "군포문화예술회관 수리홀",
    },
    {
      rank: "4",
      name: "Year End Concert: 유키 구라모토와 친구들",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278502_251107_140957.gif",
      artist: "유키 구라모토, 디토 오케스트라",
      date: "2025.12.27~2025.12.27",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "5",
      name: "키릴 페트렌코 & 베를린 필하모닉 (11.09)",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF266234_250530_135111.gif",
      artist: "키릴 페트렌코, 베를린 필하모닉",
      date: "2025.11.09~2025.11.09",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "6",
      name: "NIKKE ORCHESTRAL CONCERT: Unbreakable Memories",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278232_251105_123558.png",
      artist: "니케 심포니 오케스트라",
      date: "2026.03.28~2026.03.29",
      hall: "광운대학교 동해문화예술관 대극장",
    },
    {
      rank: "7",
      name: "서울시오페라단, 아이다",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF257899_250124_152625.jpg",
      artist: "서울시오페라단",
      date: "2025.11.13~2025.11.16",
      hall: "세종문화회관 세종대극장",
    },
    {
      rank: "8",
      name: "키릴 페트렌코 & 베를린 필하모닉 (11.07)",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF266220_250530_125236.gif",
      artist: "키릴 페트렌코, 베를린 필하모닉",
      date: "2025.11.07~2025.11.07",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "9",
      name: "헐리우드 인 크리스마스 [서울]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF275559_251002_132459.gif",
      artist: "WE필하모닉 오케스트라",
      date: "2025.12.21~2025.12.21",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "10",
      name: "클래식부산 월드시리즈, 클라우스 메켈레 & 로열콘세르트헤바우 오케스트라 [부산]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF271097_250806_112910.png",
      artist: "클라우스 메켈레, RCO",
      date: "2025.11.09~2025.11.09",
      hall: "부산콘서트홀 콘서트홀",
    },
    {
      rank: "11",
      name: "콘서트오페라, 카르멘 [부산]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277633_251029_113515.gif",
      artist: "솔오페라단",
      date: "2025.12.19~2025.12.20",
      hall: "부산콘서트홀 콘서트홀",
    },
    {
      rank: "12",
      name: "지브리 OST 콘서트: 디 오케스트라",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277681_251029_142241.gif",
      artist: "디 오케스트라",
      date: "2025.11.29~2025.11.29",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "13",
      name: "키릴 페트렌코 & 베를린 필하모닉 (11.08)",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF266173_250530_101850.gif",
      artist: "키릴 페트렌코, 베를린 필하모닉",
      date: "2025.11.08~2025.11.08",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "14",
      name: "무한의 선율, 12 첼로 앙상블 콘서트 [서울 서초]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276345_251016_132128.gif",
      artist: "12 첼로 앙상블",
      date: "2025.11.09~2025.11.09",
      hall: "흰물결아트센터 화이트홀",
    },
    {
      rank: "15",
      name: "유키 구라모토 콘서트: Peacefully [천안]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF271034_250805_134110.gif",
      artist: "유키 구라모토",
      date: "2025.12.14~2025.12.14",
      hall: "천안예술의전당 대공연장",
    },
    {
      rank: "16",
      name: "지브리 & 디즈니 영화음악 FESTA [부산 (앵콜) ]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF272619_250826_112615.gif",
      artist: "밀레니엄 심포니 오케스트라",
      date: "2025.11.22~2025.11.22",
      hall: "부산콘서트홀 콘서트홀",
    },
    {
      rank: "17",
      name: "부산시립합창단 예술교육공연, 교실 밖 합창여행",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278381_251106_132413.jpg",
      artist: "부산시립합창단",
      date: "2025.11.05~2025.11.07",
      hall: "부산문화회관 챔버홀",
    },
    {
      rank: "18",
      name: "해피 크리스마스 콘서트 [창원]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278643_251110_143127.png",
      artist: "창원시립교향악단",
      date: "2025.12.16~2025.12.16",
      hall: "성산아트홀 대극장",
    },
    {
      rank: "19",
      name: "춤추는 발레 FESTA: 백조의호수 & 호두까기인형 [서울]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276740_251028_164335.gif",
      artist: "와이즈 발레단",
      date: "2026.01.10~2026.01.10",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "20",
      name: "산투 마티아스 루발리 & 필하모니아 오케스트라 [서울]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF273277_250903_151639.gif",
      artist: "산투 마티아스 루발리, 필하모니아",
      date: "2025.12.07~2025.12.07",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "21",
      name: "크리스마스 지브리 & 디즈니 OST 콘서트 [인천]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277145_251023_135400.gif",
      artist: "서울 페스타 필하모닉",
      date: "2025.12.24~2025.12.25",
      hall: "아트센터 인천 콘서트홀",
    },
    {
      rank: "22",
      name: "파리나무십자가 소년합창단 특별초청공연 [서울]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF272981_250829_134008.gif",
      artist: "파리나무십자가 소년합창단",
      date: "2025.12.21~2025.12.21",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "23",
      name: "금난새의 크리스마스 선물",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277872_251031_133308.gif",
      artist: "금난새, 뉴월드 필하모닉",
      date: "2025.12.25~2025.12.25",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "24",
      name: "The M.C Orchestra 20주년 콘서트 with 김문정",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278281_251105_144439.gif",
      artist: "김문정, The M.C Orchestra",
      date: "2025.12.28~2025.12.28",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "25",
      name: "이자벨 파우스트 & 알렉산더 멜니코프 듀오 콘서트",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278388_251106_133907.gif",
      artist: "이자벨 파우스트, 알렉산더 멜니코프",
      date: "2026.02.04~2026.02.04",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "26",
      name: "유키 구라모토 콘서트: Peacefully [수원]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278508_251107_142819.gif",
      artist: "유키 구라모토",
      date: "2025.12.13~2025.12.13",
      hall: "수원SK아트리움 대공연장",
    },
    {
      rank: "27",
      name: "제820회 KBS교향악단 정기연주회",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF255596_251016_175832.gif",
      artist: "KBS교향악단",
      date: "2025.11.21~2025.11.21",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "28",
      name: "김지영의 바이올린 이야기 Ⅱ. Reminiscence",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276844_251021_102137.jpg",
      artist: "김지영",
      date: "2025.11.07~2025.11.07",
      hall: "세종문화회관 세종체임버홀",
    },
    {
      rank: "29",
      name: "서울대학교 종합화 50주년 기념 SNU Symphony Orchestra 정기연주회",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277639_251029_121657.gif",
      artist: "SNU Symphony Orchestra",
      date: "2025.11.24~2025.11.24",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "30",
      name: "지브리 & 디즈니 영화음악 FESTA [서울 (앵콜) ]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276107_251014_135526.gif",
      artist: "밀레니엄 심포니 오케스트라",
      date: "2026.01.03~2026.01.03",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "31",
      name: "백건우 & 이 무지치 [부산]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277245_251024_133013.gif",
      artist: "백건우, 이 무지치",
      date: "2025.12.15~2025.12.15",
      hall: "부산콘서트홀 콘서트홀",
    },
    {
      rank: "32",
      name: "대니 구 윈터 콘서트: HOME [대구]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276850_251021_102946.jpg",
      artist: "대니 구, 조윤성 트리오",
      date: "2025.12.19~2025.12.19",
      hall: "아양아트센터 아양홀",
    },
    {
      rank: "33",
      name: "트리오 가온 리사이틀 [부산]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278597_251110_131337.png",
      artist: "트리오 가온",
      date: "2025.11.18~2025.11.18",
      hall: "부산콘서트홀 챔버홀",
    },
    {
      rank: "34",
      name: "지휘자 백윤학의 칸타빌레: New Year FESTA",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276777_251126_174138.gif",
      artist: "백윤학, 코리아 쿱 오케스트라",
      date: "2026.01.04~2026.01.04",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "35",
      name: "제11회 깐따피아 정기연주회",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276083_251014_125121.jpg",
      artist: "남성중창단 깐따피아",
      date: "2025.11.08~2025.11.08",
      hall: "세종문화회관 세종체임버홀",
    },
    {
      rank: "36",
      name: "성남아트센터 제야음악회",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278511_251107_143747.gif",
      artist: "성남시립교향악단",
      date: "2025.12.31~2025.12.31",
      hall: "성남아트센터 콘서트홀",
    },
    {
      rank: "37",
      name: "군산시립예술단 합동연주회: 송년음악회",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278562_251110_113216.jpg",
      artist: "군산시립예술단",
      date: "2025.12.18~2025.12.18",
      hall: "군산예술의전당 대공연장",
    },
    {
      rank: "38",
      name: "제34회 서울대학교 정기 오페라 공연: 라 보엠 [고양]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF276044_251014_102848.jpg",
      artist: "서울대학교 음악대학",
      date: "2025.11.14~2025.11.16",
      hall: "고양아람누리 아람극장",
    },
    {
      rank: "39",
      name: "박성현 오르간 부산 콘서트 [부산]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278661_251110_150148.gif",
      artist: "박성현",
      date: "2025.12.09~2025.12.09",
      hall: "부산콘서트홀 콘서트홀",
    },
    {
      rank: "40",
      name: "유키 구라모토 크리스마스 콘서트: 유키 구라모토와 친구들 (12.24)",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF275417_251001_105429.gif",
      artist: "유키 구라모토, 디토 오케스트라",
      date: "2025.12.24~2025.12.24",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "41",
      name: "유키 구라모토 콘서트: Peacefully [경주]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF274860_250924_123720.gif",
      artist: "유키 구라모토",
      date: "2025.12.20~2025.12.20",
      hall: "경주예술의전당 대공연장(화랑홀)",
    },
    {
      rank: "42",
      name: "대니 구 크리스마스 콘서트: HOME [서울 송파]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277157_251023_142009.gif",
      artist: "대니 구, 조윤성 트리오",
      date: "2025.12.24~2025.12.24",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "43",
      name: "춤추는 발레 FESTA: 백조의호수 & 호두까기인형 [고양]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278469_251107_124326.gif",
      artist: "와이즈 발레단",
      date: "2026.01.17~2026.01.17",
      hall: "고양아람누리 아람음악당",
    },
    {
      rank: "44",
      name: "제6회 K프렌즈와 함께하는 송년음악회 [부산]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278697_251110_163624.jpg",
      artist: "K프렌즈 오케스트라",
      date: "2025.12.03~2025.12.03",
      hall: "부산콘서트홀 콘서트홀",
    },
    {
      rank: "45",
      name: "정명훈 & 원 코리아 오케스트라: 베토벤 합창",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF273372_250905_130641.gif",
      artist: "정명훈, 원 코리아 오케스트라",
      date: "2025.11.19~2025.11.19",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
    {
      rank: "46",
      name: "멜론 심포니 오케스트라 (MelON) , 디즈니+ 지브리 오케스트라 콘서트 - 대구 크리스마스 [대구]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF275658_251010_101504.gif",
      artist: "멜론 심포니 오케스트라",
      date: "2025.12.25~2025.12.25",
      hall: "대구오페라하우스 대구오페라하우스",
    },
    {
      rank: "47",
      name: "빈 필하모닉 내한공연 (11.19)",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF272732_250827_124836.gif",
      artist: "빈 필하모닉 오케스트라",
      date: "2025.11.19~2025.11.19",
      hall: "예술의전당 [서울] 콘서트홀",
    },
    {
      rank: "48",
      name: "MelON 디즈니+지브리 오케스트라 콘서트 [부산 (앵콜) ]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF275841_251010_184334.gif",
      artist: "멜론 심포니 오케스트라",
      date: "2025.12.21~2025.12.21",
      hall: "부산문화회관 대극장",
    },
    {
      rank: "49",
      name: "J 애니메이션 OST 콘서트 with 밴드 & 오케스트라 [서울]",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF275763_251010_150105.gif",
      artist: "또모 오케스트라",
      date: "2025.11.29~2025.11.29",
      hall: "경희대학교 평화의전당",
    },
    {
      rank: "50",
      name: "한경아르떼필하모닉 송년음악회",
      posterUrl:
        "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278259_251105_134735.gif",
      artist: "한경아르떼필하모닉",
      date: "2025.12.17~2025.12.17",
      hall: "롯데콘서트홀 롯데콘서트홀",
    },
  ];
  return (
    <div className="flex flex-col rounded-[0.8rem] border border-[rgba(0,0,0,0.1)]">
      <RankingListHeader />
      <div className="flex flex-col gap-[0.88rem] px-[1.31rem] pb-[1.38rem]">
        {rankingPerformanceList.map((item) => (
          <RankingItem
            rank={item.rank}
            name={item.name}
            posterUrl={item.posterUrl}
            artist={item.artist}
            date={item.date}
            hall={item.hall}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingList;
