import type { Meta, StoryObj } from "@storybook/react-vite";
import HomePerformanceWeekend from "./index";

const meta = {
  title: "Widgets/HomePerformanceWeekend",
  component: HomePerformanceWeekend,
  tags: ["autodocs"],
  args: {
    performanceArray: [
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF279144_251114_171830.gif",
        title:
          "제16회 국민일보 영산아트홀 오르간 & 실내악 콩쿠르 입상자 연주회",
        artist: "국민일보 콩쿠르 입상자",
        stdate: "2025.11.16",
        eddate: "2025.11.16",
        time: "오후 7시 30분",
        hall: "영산아트홀",
        lowPrice: "30,000원",
        highPrice: "30,000원",
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
        highPrice: "35,000원",
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
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278449_251107_111203.jpg",
        title: "부산 원먼스페스티벌, 앙상블 클라온: 클라온의 선율",
        artist: "앙상블 클라온",
        stdate: "2025.11.15",
        eddate: "2025.11.15",
        time: "오후 4시 00분",
        hall: "필슈파스 [부산진구]",
        lowPrice: "무료",
        highPrice: "무료",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278414_251107_095146.jpg",
        title: "파주 DMZ 필하모닉 오케스트라, 음악의 파도 (PaDO)",
        artist: "DMZ 필하모닉",
        stdate: "2025.11.16",
        eddate: "2025.11.16",
        time: "저녁 7시 00분",
        hall: "문산행복센터",
        lowPrice: "70,000원",
        highPrice: "70,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278313_251106_101408.gif",
        title: "겨울, 밤마실 콘서트 Ⅴ [대전]",
        artist: "지역 예술가",
        stdate: "2025.11.15",
        eddate: "2025.11.15",
        time: "오후 6시 00분",
        hall: "복합문화공간 플랜에이",
        lowPrice: "15,000원",
        highPrice: "15,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278207_251105_105726.gif",
        title: "삼육대학교 음악학과 교수음악회",
        artist: "삼육대 교수진",
        stdate: "2025.11.16",
        eddate: "2025.11.16",
        time: "오후 7시 00분",
        hall: "영산아트홀",
        lowPrice: "무료",
        highPrice: "무료",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278126_251104_112455.jpg",
        title: "O.B.S Ensemble 애니매이션 O.S.T 콘서트 [대구]",
        artist: "O.B.S 앙상블",
        stdate: "2025.11.15",
        eddate: "2025.11.15",
        time: "오후 3시 30분",
        hall: "수성아트피아",
        lowPrice: "40,000원",
        highPrice: "40,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278123_251104_111656.jpg",
        title: "제4회 파주시립소년소녀합창단 정기연주회: 풍금소리",
        artist: "파주시립 합창단",
        stdate: "2025.11.15",
        eddate: "2025.11.15",
        time: "오후 5시 30분",
        hall: "문산행복센터",
        lowPrice: "20,000원",
        highPrice: "20,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF278012_251103_135827.jpg",
        title: "쌀롱드무지끄, 일상의 에피파니",
        artist: "쌀롱드무지끄 출연진",
        stdate: "2025.11.15",
        eddate: "2025.11.15",
        time: "오후 7시 00분",
        hall: "쌀롱드무지끄",
        lowPrice: "50,000원",
        highPrice: "50,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277994_251103_132531.gif",
        title: "소프라노 김은별 귀국 독창회",
        artist: "소프라노 김은별",
        stdate: "2025.11.15",
        eddate: "2025.11.15",
        time: "오후 7시 30분",
        hall: "영산아트홀",
        lowPrice: "15,000원",
        highPrice: "15,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277988_251103_130935.jpg",
        title:
          "피아노듀오 콘서트 해설이 있는 가족콘서트, 작곡가시리즈 Charles Camille Saint-Saens (앵콜) [대구]",
        artist: "피아노 듀오",
        stdate: "2025.11.16",
        eddate: "2025.11.16",
        time: "오후 2시 00분",
        hall: "수성아트피아",
        lowPrice: "20,000원",
        highPrice: "20,000원",
      },
      {
        imgSrc:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF277970_251103_113609.gif",
        title: "권혁민 바이올린 독주회",
        artist: "바이올리니스트 권혁민",
        stdate: "2025.11.16",
        eddate: "2025.11.16",
        time: "오후 7시 30분",
        hall: "금호아트홀 연세",
        lowPrice: "5,000원",
        highPrice: "5,000원",
      },
    ],
  },
} satisfies Meta<typeof HomePerformanceWeekend>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
