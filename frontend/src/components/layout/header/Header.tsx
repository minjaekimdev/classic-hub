import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.scss";
import Logo from "./Logo";
import NavBar from "./NavBar";
import Auth from "./Auth";
import FilterSmall from "./filter/simplified/FilterSmall";
import FilterBig from "@/components/layout/header/filter/extended/FilterBig";

export type fieldType = "검색" | "시대" | "장르" | "지역" | "가격" | "기간";

export interface fieldContentType {
  검색: string;
  시대: string;
  장르: string;
  지역: string;
  가격: string;
  기간: string;
}

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState(true); // true: 헤더 확장, false: 헤더 축소
  const [userExpanded, setUserExpanded] = useState(false);
  const [selectedField, setSelectedField] = useState<fieldType | "">(""); // 선택된 field의 드롭다운 열기, 해당하는 field에 드롭다운 항목 표시
  const [fieldContent, setFieldContent] = useState<fieldContentType>({ // 각 field별 드롭다운 항목 저장
    검색: "",
    시대: "",
    장르: "",
    지역: "",
    가격: "",
    기간: "",
  });
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      console.log("handleScroll");
      if (window.scrollY > 0) {
        if (!userExpanded) {
          setExpanded(false);
          setSelectedField("");
        } else {
          setExpanded(true);
        }
      } else { // 스크롤이 맨 꼭대기인 상태
        setExpanded(true);
        setUserExpanded(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      console.log('handleClick');
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node) &&
        window.scrollY > 0
      ) {
        setExpanded(false);
        setUserExpanded(false);
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [expanded, userExpanded]);

  const handleUserHeaderExpand = (field: fieldType) => {
    setExpanded(true);
    setUserExpanded(true);
    setSelectedField(field);
  };

  return (
    <div ref={headerRef} className={styles["header-extended"]}>
      <header className={styles.header}>
        <Logo />
        {expanded ? (
          <NavBar />
        ) : (
          <FilterSmall
            selected={selectedField}
            onFieldClick={handleUserHeaderExpand}
          />
        )}
        <Auth />
      </header>
      {expanded && (
        <FilterBig
          selectedField={selectedField}
          fieldContent={fieldContent}
          setSelectedField={setSelectedField}
          setFieldContent={setFieldContent}
        />
      )}
    </div>
  );
};

export default Header;
