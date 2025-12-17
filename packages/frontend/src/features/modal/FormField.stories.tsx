import type { Meta, StoryObj } from "@storybook/react-vite";
import FormField from "./FormField";

const meta = {
  title: "features/modal/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: {
    isSingleLine: true,
    type: "email",
    id: "email",
    label: "이메일",
    placeHolder: "example@email.com",
    verticalPadding: "0.22rem",
    inputAreaHeight: "1.53rem",
    required: true,
  },
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    isSingleLine: false,
    id: "feedback",
    label: "의견 *",
    placeHolder: "개선사항, 불편사항, 기능 제안 등을 자유롭게 작성해주세요.",
    verticalPadding: "0.44rem",
    inputAreaHeight: "2.63rem",
    required: true,
  },
};
