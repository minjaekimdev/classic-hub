import React, { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Header.module.scss";
import Logo from "./Logo";
import NavBar from "./NavBar";
import Auth from "./Auth";
import FilterSmall from "./filter/simplified/FilterSmall";
import FilterBig from "@/components/layout/header/filter/extended/FilterBig";

export type fieldType = "검색어" | "지역" | "가격" | "기간";

export interface fieldContentType {
  검색어: string;
  시대: string;
  장르: string;
  지역: string;
  가격: string;
  기간: string;
}

const Header: React.FC = () => {
  const [expanded, setExpanded] = useState(true); // true: 헤더 확장, false: 헤더 축소
  const [userExpanded, setUserExpanded] = useState(false); // 사용자가 직접 클릭하여 헤더를 확장한 경우 표시
  const [selectedField, setSelectedField] = useState<fieldType | "">(""); // 선택된 field의 드롭다운 열기
  const [fieldContent, setFieldContent] = useState<fieldContentType>({
    // 각 field별 드롭다운 항목 저장
    검색어: "",
    시대: "",
    장르: "",
    지역: "",
    가격: "",
    기간: "",
  });
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 스크롤 내리기 -> 헤더 축소 -> 레이아웃 변경 -> 다시 스크롤 유발 -> ... 의 루프롤 throttle로 해결
    const handleScroll = throttle(() => {
      if (window.scrollY > 0) {
        if (!userExpanded) {
          setExpanded(false);
          setSelectedField("");
        }
      } else {
        // 스크롤이 맨 꼭대기인 상태일 경우 초기화
        setExpanded(true);
        setUserExpanded(false);
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [userExpanded]);

  // 헤더의 외부를 클릭하면 닫히도록 구현
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
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

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // 사용자가 축소된 상태의 헤더 중 특정 필드를 클릭하면, 확장 후 해당 필드의 드롭다운 보여주기
  const handleUserHeaderExpand = (field: fieldType) => {
    setExpanded(true);
    setUserExpanded(true);
    setSelectedField(field);
  };

  return (
    <>
      <AnimatePresence>
        {userExpanded && (
          <motion.div
            className={styles["overlay"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        ref={headerRef}
        className={styles["header"]}
        layout
        transition={{ duration: 0.1, ease: "easeInOut" }}
      >
        <Logo />
        <div className={styles["header__middle"]}>
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.div
                key="nav"
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <NavBar />
              </motion.div>
            )}
            {expanded ? (
              <motion.div
                layout
                key="big"
                layoutId="filter"
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <FilterBig
                  selectedField={selectedField}
                  fieldContent={fieldContent}
                  setSelectedField={setSelectedField}
                  setFieldContent={setFieldContent}
                />
              </motion.div>
            ) : (
              <motion.div
                layout
                key="small"
                layoutId="filter"
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <FilterSmall
                  selected={selectedField}
                  onFieldClick={handleUserHeaderExpand}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Auth />
      </motion.div>
    </>
  );
};

export default Header;
