import type { Meta, StoryObj } from "@storybook/react-vite";
import BookmarkDeleteModal from "./BookmarkDeleteModal";

const meta = {
  title: "Features/Bookmark/BookmarkDeleteModal",
  component: BookmarkDeleteModal,
  tags: ["autodocs"],
  args: {
    title: "크리스티안 짐머만 피아노 리사이틀",
  },
} satisfies Meta<typeof BookmarkDeleteModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    title:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세",
  },
};
