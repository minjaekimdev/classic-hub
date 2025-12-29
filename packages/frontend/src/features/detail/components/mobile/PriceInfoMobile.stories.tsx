import type { Meta, StoryObj } from "@storybook/react-vite";
import PriceInfoMobile from "./PriceInfoMobile";

const meta = {
  title: "features/detail/mobile/PriceInfoMobile",
  component: PriceInfoMobile,
  tags: ["autodocs"],
  args: {
    priceInfo: [
      { seat: "R석", price: 180000 },
      { seat: "S석", price: 140000 },
      { seat: "A석", price: 110000 },
      { seat: "B석", price: 90000 },
      { seat: "C석", price: 70000 },
      { seat: "시야방해R", price: 144000 },
      { seat: "시야방해S", price: 112000 },
      { seat: "시야방해A", price: 88000 },
      { seat: "시야방해B", price: 72000 },
    ],
  },
} satisfies Meta<typeof PriceInfoMobile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
