import React from "react";
import styles from "./ModalTicketVendor.module.scss";
import type { TicketVendorInfoType } from "@root-shared/model/booking";

interface ModalTicketVendorProps extends TicketVendorInfoType {
  icon: string;
  background: string;
}

const ModalTicketVendor: React.FC<ModalTicketVendorProps> = ({
  icon,
  background,
  name,
  url,
}) => {
  return (
    <a className={styles.ticketVendor} href={url}>
      <div className={styles.ticketVendor__wrapper}>
        <div className={styles.ticketVendor__content}>
          <div className={styles.icon} style={{ backgroundColor: background }}>
            {icon}
          </div>
          <span className={styles.name}>{name}</span>
        </div>
      </div>
    </a>
  );
};

export default ModalTicketVendor;
