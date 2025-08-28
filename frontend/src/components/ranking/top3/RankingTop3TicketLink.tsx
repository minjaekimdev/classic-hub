import React, { useState, useRef, useEffect } from "react";
import dropdown from "@assets/dropdown/dropdown-icon-black.svg";
import styles from "./RankingTop3TicketLink.module.scss";
import type { TicketLink } from "@/models/common.client";
import RankingTop3TicketLinkDropdown from "./RankingTop3TicketLinkDropdown";

interface RankingTop3TicketLinkProps {
  data: TicketLink[] | TicketLink;
}

const RankingTop3TicketLink: React.FC<RankingTop3TicketLinkProps> = ({
  data,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭한 곳이 드롭다운 영역 외부라면 닫기
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={styles["top3-ticketlink"]}>
      <button
        className={styles["top3-ticketlink-button"]}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <div className={styles["text-container"]}>
          <span className={styles["text"]}>예매처 선택</span>
          <img src={dropdown} alt="" />
        </div>
      </button>
      {isOpen && (
        <div className={styles["ticketlink-dropdown"]}>
          <div className={styles["ticketlink"]}>
            {Array.isArray(data) ? (
              data.map((element, index) => (
                <RankingTop3TicketLinkDropdown data={element} key={index} /> 
              ))
            ) : (
              <RankingTop3TicketLinkDropdown data={data} />
            )}
          </div>
          <div className={styles["ticketlink__bottom"]}>
            <span className={styles["text"]}>원하는 예매처를 선택해주세요</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingTop3TicketLink;
