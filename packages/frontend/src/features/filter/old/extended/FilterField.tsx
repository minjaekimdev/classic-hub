import { useState, useEffect, useRef, type SetStateAction } from "react";
import locationIcon from "@assets/filter/location-gray.png";
import moneyIcon from "@assets/filter/money-gray.png";
import periodIcon from "@assets/filter/calendar-gray.png";
import styles from "./FilterField.module.scss";
import DropdownMenu from "./dropdown/DropdownMenu";
import DatePicker from "./dropdown/DatePicker";
import dropdownArrow from "@/assets/dropdown/dropdown-icon-gray.svg";
import type { fieldType, fieldContentType } from "../../Header";

interface FilterFieldProps {
  data: {
    area: string;
    type: Exclude<fieldType, "검색어">;
    initialState: string;
  };
  fieldSelected: fieldType | "";
  fieldContent: string;
  onFieldSelect: React.Dispatch<SetStateAction<fieldType | "">>;
  setFieldContent: React.Dispatch<SetStateAction<fieldContentType>>;
}

const FilterField: React.FC<FilterFieldProps> = ({
  data,
  fieldSelected,
  fieldContent,
  onFieldSelect,
  setFieldContent,
}) => {
  const [showDropdown, setShowDropdown] = useState<string | null>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowDropdown(fieldSelected);
  }, [fieldSelected]);

  // 카테고리 드롭다운 열림 상태에서 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown("");
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const iconArray = {
    지역: locationIcon,
    가격: moneyIcon,
    기간: periodIcon,
  };

  const propsDataObj = {
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
    setFieldContent((prev) => ({ ...prev, [data.type]: menu }));
    if (
      !(/^\d{4}-\d{2}-\d{2}\s~\s\d{4}-\d{2}-\d{2}$/.test(menu) || menu === "")
    ) {
      setShowDropdown("");
    }
  };

  const renderDropdown = () => {
    if (data.type === "기간" && showDropdown === "기간") {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-single"]}`}
        >
          <DatePicker setFieldContent={setFieldContent} />
        </div>
      );
    } else if (data.type === "가격" && showDropdown === "가격") {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-group"]}`}
        >
          {propsDataObj[data.type].map((price) => (
            <DropdownMenu
              key={price}
              main={price}
              fieldType={data.type}
              onSelect={dropdownSelect}
              onFieldSelect={onFieldSelect}
              setFieldContent={setFieldContent}
            />
          ))}
        </div>
      );
    } else if (data.type === "지역" && showDropdown === "지역") {
      return (
        <div
          ref={dropdownRef}
          className={`${styles["dropdown-container"]} ${styles["dropdown-container-group"]}`}
        >
          {propsDataObj["지역"].map((item) => (
            <DropdownMenu
              key={item}
              main={item}
              fieldType={data.type}
              onSelect={dropdownSelect}
              onFieldSelect={onFieldSelect}
              setFieldContent={setFieldContent}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <fieldset
      className={`${styles["filter-field"]} ${
        fieldSelected === data.type ? styles["filter-field--active"] : ""
      } ${
        fieldSelected && fieldSelected !== data.type
          ? styles["filter-field--inactive"]
          : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onFieldSelect(data.type);
        setShowDropdown(data.type);
      }}
      style={{
        gridArea: data.area,
        borderBottomLeftRadius: data.area === "c" ? "8px" : undefined,
      }}
    >
      <section className={styles["field-wrapper"]}>
        <div className={styles["field-left"]}>
          <div className={styles["field-icon-wrapper"]}>
            <img
              src={iconArray[data.type]}
              alt=""
              className={styles["field-icon"]}
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <section className={styles["field-text-wrapper"]}>
            <legend>{data.type}</legend>
            <p>{fieldContent ? fieldContent : data.initialState}</p>
          </section>
        </div>
        <div className="dropdown-icon-wrapper">
          <img className="dropdown-icon" src={dropdownArrow} alt="" />
        </div>
      </section>
      {renderDropdown()}
    </fieldset>
  );
};

export default FilterField;
