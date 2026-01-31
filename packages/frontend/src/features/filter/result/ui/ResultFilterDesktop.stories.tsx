import type { Meta, StoryObj } from '@storybook/react-vite';
import ResultFilterDesktop from './ResultFilterDesktop';
import { fn } from 'storybook/test';

// 1. Mock 데이터 생성 (useResultFilter 훅의 리턴값 흉내내기)
const defaultFilterStates = {
  selectedSort: 'imminent',
  expandedRegion: null,
  selectedVenues: [],
};

const mockActions = {
  handleSortChange: fn(), // Actions 패널에 로그가 찍힘
  toggleRegion: fn(),
  toggleVenue: fn(),
  handleReset: fn(),
};

// 2. Meta 설정
const meta = {
  title: 'features/filter/result/ResultFilterDesktop',
  component: ResultFilterDesktop,
  tags: ['autodocs'],
  // 공통 Args 설정
  args: {
    isOpen: true,
    // filter prop 구조를 맞춰서 주입
    filter: {
      states: defaultFilterStates,
      actions: mockActions,
    },
  },
  // filter prop 처럼 복잡한 객체는 컨트롤 패널에서 수정하기 어렵으므로 설명 추가 가능
  argTypes: {
    filter: {
      description: 'useResultFilter 훅의 반환값 (상태 + 핸들러)',
      control: 'object',
    },
  },
} satisfies Meta<typeof ResultFilterDesktop>;

export default meta;
type Story = StoryObj<typeof meta>;

// 3. 스토리 정의

// #1. 기본 상태 (아무것도 선택 안 됨)
export const Default: Story = {};

// #2. 서울 지역이 열려있고, 예술의전당이 선택된 상태
export const RegionExpandedAndSelected: Story = {
  args: {
    filter: {
      states: {
        selectedSort: 'imminent',
        expandedRegion: 'seoul', // 서울 아코디언 열림
        selectedVenues: ['sac'], // 예술의전당 체크됨
      },
      actions: mockActions,
    },
  },
};

// #3. 정렬이 '낮은가격순'으로 되어 있는 상태
export const SortedByPrice: Story = {
  args: {
    filter: {
      states: {
        ...defaultFilterStates,
        selectedSort: 'price_asc',
      },
      actions: mockActions,
    },
  },
};

// #4. 닫혀있는 상태 (안 보여야 함)
export const Closed: Story = {
  args: {
    isOpen: false,
  },
};