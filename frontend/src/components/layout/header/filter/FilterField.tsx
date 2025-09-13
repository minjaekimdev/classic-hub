import { useState, useEffect, useRef } from "react";
import eraIcon from "@assets/filter/era.svg";
import genreIcon from "@assets/filter/genre.svg";
import locationIcon from "@assets/filter/location.svg";
import periodIcon from "@assets/filter/period.svg";
import styles from "./FilterField.module.scss";
import DropdownMenu from "./dropdown/DropdownMenu";
import DatePicker from "./dropdown/DatePicker";
import dropdownArrow from "@/assets/dropdown/dropdown-icon-gray.svg";

interface FilterFieldProps {
  data: {
    area: string;
    type: "시대" | "장르" | "지역" | "가격" | "기간";
    initialState: string;
  };
  onSelect: () => void;
  isSelected: boolean;
  isFilterActive: boolean;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterField: React.FC<FilterFieldProps> = ({
  data,
  onSelect,
  isSelected,
  isFilterActive,
  setSelected,
  setFilterActive,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(data.initialState);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowDropdown(isSelected);
  }, [isSelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        console.log("FilterField eventListener!");
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const iconArray = {
    시대: eraIcon,
    장르: genreIcon,
    지역: locationIcon,
    기간: periodIcon,
  };

  const propsDataObj = {
    시대: [
      {
        main: "바로크",
        sub: "17세기 ~ 18세기 중반",
      },
      {
        main: "고전",
        sub: "18세기 중반 ~ 19세기 초",
      },
      {
        main: "낭만",
        sub: "19세기",
      },
      {
        main: "근현대",
        sub: "20세기 ~",
      },
    ],
    장르: [
      {
        main: "교향악/협연",
        sub: "오케스트라 공연",
      },
      {
        main: "독주",
        sub: "솔로 연주(리사이틀)",
      },
      {
        main: "실내악",
        sub: "소규모 앙상블",
      },
      {
        main: "무대음악",
        sub: "오페라, 발레",
      },
    ],
    지역: [
      "서울",
      "경기/인천",
      "충청/강원",
      "대구/경북",
      "부산/경남",
      "광주/전라",
      "제주",
    ],
    가격: [
      "0원 ~ 50,000원",
      "50,000원 ~ 100,000원",
      "100,000원 ~ 200,000원",
      "200,000원 ~",
    ],
  };

  const dropdownSelect = (menu: string) => {
    setSelectedMenu(menu);

    if (
      !(/^\d{4}-\d{2}-\d{2}\s~\s\d{4}-\d{2}-\d{2}$/.test(menu) || menu === "")
    ) {
      setShowDropdown(false);
    }
  };

  const renderDropdown = () => {
    if (data.type === "기간") {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-single"]}`}
        >
          <DatePicker onSelect={dropdownSelect} />
        </div>
      );
    } else if (data.type === "시대" || data.type === "장르") {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-group"]}`}
        >
          {propsDataObj[data.type].map((item) => (
            <DropdownMenu
              key={item.main}
              main={item.main}
              sub={item.sub}
              onSelect={() => dropdownSelect(item.main)}
              setSelected={setSelected}
              setFilterActive={setFilterActive}
            />
          ))}
        </div>
      );
    } else if (data.type === "가격") {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-group"]}`}
        >
          {propsDataObj[data.type].map((price) => (
            <DropdownMenu
              key={price}
              main={price}
              onSelect={() => dropdownSelect(price)}
              setSelected={setSelected}
              setFilterActive={setFilterActive}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-group"]}`}
        >
          {propsDataObj["지역"].map((item) => (
            <DropdownMenu
              key={item}
              main={item}
              onSelect={() => dropdownSelect(item)}
              setSelected={setSelected}
              setFilterActive={setFilterActive}
            />
          ))}
        </div>
      );
    }
  };

  const renderIcon = () => {
    if (data.type === "가격") return <span className={styles["won"]}>₩</span>;
    return (
      <img src={iconArray[data.type]} alt="" className={styles["field-icon"]} />
    );
  };

  return (
    <fieldset
      className={`${styles["filter-field"]} ${
        isSelected ? styles["filter-field--active"] : ""
      } ${
        isFilterActive && !isSelected ? styles["filter-field--inactive"] : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        gridArea: data.area,
        borderBottomLeftRadius: data.area === "c" ? "8px" : undefined,
      }}
    >
      <section className={styles["field-wrapper"]}>
        <div className={styles["field-left"]}>
          <div className={styles["field-icon-wrapper"]}>{renderIcon()}</div>
          <section className={styles["field-text-wrapper"]}>
            <legend>{data.type}</legend>
            <p>{selectedMenu}</p>
          </section>
        </div>
        <div className="dropdown-icon-wrapper">
          <img className="dropdown-icon" src={dropdownArrow} alt="" />
        </div>
      </section>
      {showDropdown && renderDropdown()}
    </fieldset>
  );
};

export default FilterField;
