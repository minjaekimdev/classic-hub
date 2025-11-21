import "@app/styles/main.scss";
import type { Meta, StoryObj } from "@storybook/react-vite";
import OAuthButton from "./index";
import googleIcon from "@shared/assets/icons/google.svg";

const meta = {
  title: "Features/Auth/OAuthButton",
  component: OAuthButton,
  tags: ["autodocs"],
  args: {
    iconSrc: googleIcon,
    children: "Google로 로그인",
  },
} satisfies Meta<typeof OAuthButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
