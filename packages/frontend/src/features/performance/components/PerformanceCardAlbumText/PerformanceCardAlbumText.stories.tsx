// PerformanceCardText.stories.tsx (수정)

import type { Meta, StoryObj } from '@storybook/react-vite';
import PerformanceCardText from './index'; // index.tsx 파일의 컴포넌트를 가져옴

// 1. 메타 데이터 설정
const meta = {
  title: 'Features/Performance/PerformanceCardText', // Storybook 사이드바 경로 설정
  component: PerformanceCardText,
  tags: ['autodocs'],
  // 💡 args는 컴포넌트가 받는 Props와 일치해야 합니다.
  args: { 
    title: "조성진 피아노 리사이틀",
    artist: "조성진",
    date: "2025년 11월 15일 (목)",
    time: "오후 8시",
    location: "롯데콘서트홀",
    // price: "100,000원부터" 등 필요한 데이터 추가
  },
} satisfies Meta<typeof PerformanceCardText>;

export default meta;

type Story = StoryObj<typeof meta>;

// 2. Primary 스토리 테스트 (기본 형태)
export const Primary: Story = {
  // args를 지정하지 않으면 위의 meta.args를 기본값으로 사용
};

// 3. (추가) 긴 제목 테스트
export const LongTitle: Story = {
  args: {
    title: "뉴욕 링컨센터 실내악협회 단독 내한공연: 브람스와 슈만 듀오가나다라마바사",
  }
};