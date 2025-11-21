import "@app/styles/main.scss";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ModalTicketVendor from "./index";

const meta = {
  title: "Features/Booking/ModalTicketVendor",
  component: ModalTicketVendor,
  tags: ["autodocs"],
  args: {
    icon: "🎫",
    background: "#2B7FFF",
    name: "인터파크",
    url: "http://ticket.interpark.com/Ticket/Goods/GoodsInfo.asp?GoodsCode=25014456",
  },
} satisfies Meta<typeof ModalTicketVendor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
