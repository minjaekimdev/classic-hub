import type { Meta, StoryObj } from "@storybook/react-vite";
import PosterMobile from "./PosterMobile";

const meta = {
  title: "features/detail/mobile/PosterMobile",
  component: PosterMobile,
  tags: ["autodocs"],
  args: {
    posterUrl: "http://www.kopis.or.kr/upload/pfmPoster/PF_PF266234_250530_135111.gif",
  },
} satisfies Meta<typeof PosterMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
