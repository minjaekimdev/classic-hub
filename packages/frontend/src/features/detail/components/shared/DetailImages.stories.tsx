import type { Meta, StoryObj } from "@storybook/react-vite";
import DetailImages from "./DetailImages";

const meta = {
  title: "features/detail/shared/DetailImages",
  component: DetailImages,
  tags: ["autodocs"],
  args: {
    imgUrlArray: [
      "http://www.kopis.or.kr/upload/pfmIntroImage/PF_PF278593_202511100106239760.jpg",
    ],
  },
} satisfies Meta<typeof DetailImages>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
