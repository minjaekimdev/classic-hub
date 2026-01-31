import type { Meta, StoryObj } from "@storybook/react-vite";
import CategoryItem from "./CategoryItem";

const meta = {
  title: "features/filter/result/CategoryItem",
  component: CategoryItem,
  tags: ["autodocs"],
  args: {
    text: "전체",
    selected: "서울",
    onSelect: () => {},
  },
} satisfies Meta<typeof CategoryItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    selected: "전체",
    count: 13,
  },
};
