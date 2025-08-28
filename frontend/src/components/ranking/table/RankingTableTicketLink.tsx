import React, { useState, useRef, useEffect } from "react";
import styles from "./RankingTableTicketLink.module.scss";
import dropdown from "@assets/dropdown/dropdown-icon-black.svg";
import linkIcon from "@assets/ticketlink/ticketlink-icon-black.svg";

interface TicketLink {
  relatenm: { _text: string };
  relateurl: { _text: string };
}

interface RankingTableTicketLinkProps {
  data: TicketLink[] | TicketLink;
}

const RankingTableTicketLink: React.FC<RankingTableTicketLinkProps> = ({
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

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={styles["rankingtable-ticketlink"]}>
      <button
        className={styles["ticketlink-button"]}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
      >
        <p>예매처</p>
        <img className={styles["dropdown-icon"]} src={dropdown} alt="" />
      </button>
      {isOpen && (
        <div className={styles["ticketlink-dropdown"]}>
          {Array.isArray(data) ? (
            data.map((element) => (
              <div
                className={styles["ticketlink-dropdown__item"]}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(`${element.relateurl._text}`, "_blank");
                }}
              >
                <span className={styles["ticketlink-name"]}>
                  {element.relatenm._text}
                </span>
                <img src={linkIcon} alt="" />
              </div>
            ))
          ) : (
            <div
              className={styles["ticketlink-dropdown__item"]}
              onClick={(e) => {
                e.preventDefault();
                window.open(`${data.relateurl._text}`, "_blank");
              }}
            >
              <span className={styles["ticketlink-name"]}>
                {data.relatenm._text}
              </span>
              <img src={linkIcon} alt="" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RankingTableTicketLink;
