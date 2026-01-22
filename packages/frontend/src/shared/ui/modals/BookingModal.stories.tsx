import type { Meta, StoryObj } from "@storybook/react-vite";
import BookingModal from "./BookingModal";

const meta = {
  title: "features/modal/BookingModal",
  component: BookingModal,
  tags: ["autodocs"],
  args: {
    ticketVendorArray: [
      {
        name: "NHN티켓링크",
        url: "http://www.ticketlink.co.kr/product/54161",
      },
      {
        name: "멜론티켓",
        url: "https://ticket.melon.com/performance/index.htm?prodId=210961",
      },
      {
        name: "세종문화회관",
        url: "https://www.sejongpac.or.kr/portal/performance/performance/performTicket.do?performIdx=35891&menuNo=200320",
      },
      {
        name: "예스24",
        url: "http://ticket.yes24.com/Perf/52549",
      },
      {
        name: "인터파크",
        url: "http://ticket.interpark.com/Ticket/Goods/GoodsInfo.asp?GoodsCode=P0004142",
      },
      {
        name: "클립서비스주식회사",
        url: "https://www.clipservice.co.kr/Clipservice/Ticket/ShowDetail?playNum=78325",
      },
    ],
  },
} satisfies Meta<typeof BookingModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {},
};
