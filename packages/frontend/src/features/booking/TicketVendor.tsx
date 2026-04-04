import type { BookingLink } from "@classic-hub/shared/types/common";
import React from "react";
import { usePostHog } from "@posthog/react";

interface ModalTicketVendorProps extends BookingLink {
  icon: string;
  background: string;
}

const TicketVendor: React.FC<ModalTicketVendorProps> = ({
  icon,
  background,
  name,
  url,
}) => {
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture("ticket_vendor_clicked", {
      vendor_name: name,
      vendor_url: url,
    });
  };

  return (
    <a href={url} className="block" target="_blank" onClick={handleClick}>
      <div className="flex flex-col justify-center items-center rounded-main border-2 border-black/10 h-[7.47rem] w-full">
        <div className="flex flex-col items-center gap-[0.47rem]">
          <div
            className="flex justify-center items-center w-[3.06rem] h-[3.06rem] rounded-full"
            style={{ backgroundColor: background }}
          >
            {icon}
          </div>
          <span className="text-dark text-[0.77rem] leading-[1.09rem] font-medium">
            {name}
          </span>
        </div>
      </div>
    </a>
  );
};

export default TicketVendor;
