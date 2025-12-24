import type { Meta, StoryObj } from "@storybook/react-vite";
import WeekendPerformances from "./WeekendPerformances";

const meta = {
  title: "features/performance/WeekendPerformances",
  component: WeekendPerformances,
  tags: ["autodocs"],
  args: {
    performanceArray: [
      {
        id: "PF281871",
        title: "이민성 피아노 리사이틀: DRAMA",
        artist: "이민성", // 제목에서 유추
        posterUrl:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281871_251219_111529.gif",
        date: {
          start: "2025.12.21",
          end: "2025.12.21",
        },
        venue: "금호아트홀 연세",
        time: "오후 8시 00분", // 임의 생성
        composerArray: ["쇼팽", "리스트", "라흐마니노프"], // 임의 생성
        price: {
          min: 30000, // 임의 생성
          max: 50000,
        },
        rank: 1, // 임의 생성
      },
      {
        id: "PF281717",
        title: "장애인과 함께하는 음악회: 아름다운 동행 [성남]",
        artist: "아름다운 동행 앙상블", // 임의 생성
        posterUrl:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281717_251217_104137.jpg",
        date: {
          start: "2025.12.21",
          end: "2025.12.21",
        },
        venue: "성남아트센터",
        time: "오후 5시 00분", // 임의 생성
        composerArray: ["엘가", "비발디", "파헬벨"], // 임의 생성
        price: {
          min: 0, // 무료 공연 추정
          max: 0,
        },
        rank: 2,
      },
      {
        id: "PF281644",
        title: "제7회 GTG 청소년오케스트라 정기연주회",
        artist: "GTG 청소년오케스트라", // 제목에서 유추
        posterUrl:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281644_251216_105921.png",
        date: {
          start: "2025.12.21",
          end: "2025.12.21",
        },
        venue: "고양아람누리",
        time: "오후 4시 00분", // 임의 생성
        composerArray: ["드보르작", "베토벤"], // 임의 생성
        price: {
          min: 10000, // 청소년 연주회 통상 가격 추정
          max: 10000,
        },
        rank: 3,
      },
      {
        id: "PF281617",
        title: "임동혁의 크리스마스 음악선물 [화성]",
        artist: "임동혁", // 제목에서 유추
        posterUrl:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281617_251215_150928.gif",
        date: {
          start: "2025.12.21",
          end: "2025.12.21",
        },
        venue: "남양성모성지",
        time: "오후 7시 30분", // 임의 생성
        composerArray: ["슈베르트", "바흐", "크리스마스 캐롤"], // 임의 생성
        price: {
          min: 50000, // 임의 생성
          max: 50000,
        },
        rank: 4,
      },
      {
        id: "PF281557",
        title: "오잉클! (12월)",
        artist: "오감 앙상블", // 임의 생성
        posterUrl:
          "http://www.kopis.or.kr/upload/pfmPoster/PF_PF281557_251215_124338.jpg",
        date: {
          start: "2025.12.21",
          end: "2025.12.21",
        },
        venue: "오감클래식",
        time: "오전 11시 00분", // 마티네 공연 추정
        composerArray: ["생상스", "차이코프스키"], // 임의 생성
        price: {
          min: 20000, // 소규모 공연장 통상 가격 추정
          max: 30000,
        },
        // rank는 선택적(optional) 속성이므로 일부러 제외한 케이스 예시
      },
    ],
  },
} satisfies Meta<typeof WeekendPerformances>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
