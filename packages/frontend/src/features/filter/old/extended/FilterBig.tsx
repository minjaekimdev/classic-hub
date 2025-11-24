import React, { useRef, useEffect, type SetStateAction } from "react";
import styles from "./FilterBig.module.scss";
import resetIcon from "@/assets/filter/refresh_24dp_374151_FILL0_wght400_GRAD0_opsz24.svg";
import searchIcon from "@assets/filter/search-icon.svg";
import FilterField from "./FilterField";
import type { fieldType, fieldContentType } from "../../Header";

const SearchInput: React.FC<{
  fieldSelected: fieldType | "";
  inputValue: string;
  onFieldSelect: React.Dispatch<React.SetStateAction<fieldType | "">>;
  setFieldContent: React.Dispatch<React.SetStateAction<fieldContentType>>;
}> = ({ fieldSelected, inputValue, onFieldSelect, setFieldContent }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldSelected === "검색어") {
      inputRef.current?.focus();
    }
  }, [fieldSelected]);

  return (
    <div
      className={`${styles["filter__searchbox"]} ${
        fieldSelected === "검색어" ? styles["filter__searchbox--active"] : ""
      } ${
        fieldSelected && fieldSelected !== "검색어"
          ? styles["filter__searchbox--inactive"]
          : ""
      }`}
      onClick={() => {
        onFieldSelect("검색어");
        inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        placeholder="공연명, 프로그램(작품)명으로 검색해보세요!"
        className={styles["filter__input"]}
        onChange={(e) => {
          setFieldContent((prev) => ({
            ...prev,
            검색어: e.target.value,
          }));
        }}
        onFocus={() => {
          onFieldSelect("검색어");
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};

const ButtonContainer: React.FC = () => {
  return (
    <div className={styles["button-container"]}>
      <button className={`${styles["button"]} ${styles["button--reset"]}`}>
        <img src={resetIcon} alt="" style={{ width: "16px", height: "16px" }} />
      </button>
      <button className={`${styles["button"]} ${styles["button--search"]}`}>
        <img
          src={searchIcon}
          alt=""
          style={{ width: "16px", height: "16px" }}
        />
      </button>
    </div>
  );
};

const filterFieldProps = [
  {
    area: "e",
    type: "지역",
    initialState: "지역 선택",
  },
  {
    area: "f",
    type: "가격",
    initialState: "가격대 선택",
  },
  {
    area: "g",
    type: "기간",
    initialState: "기간 선택",
  },
] as const;

const FilterBig: React.FC<{
  selectedField: fieldType | "";
  fieldContent: fieldContentType;
  setSelectedField: React.Dispatch<SetStateAction<fieldType | "">>;
  setFieldContent: React.Dispatch<SetStateAction<fieldContentType>>;
}> = ({ selectedField, fieldContent, setSelectedField, setFieldContent }) => {
  const filterRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setSelectedField("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <form className={styles["form"]} method="get">
      <section
        ref={filterRef}
        className={`${styles["filter"]} ${
          selectedField ? styles["filter--active"] : ""
        }`}
      >
        <SearchInput
          fieldSelected={selectedField}
          inputValue={fieldContent.검색어}
          onFieldSelect={setSelectedField}
          setFieldContent={setFieldContent}
        />
        {filterFieldProps.map((element) => (
          <FilterField
            key={element.type}
            data={element}
            fieldSelected={selectedField}
            fieldContent={fieldContent[element.type]}
            onFieldSelect={setSelectedField}
            setFieldContent={setFieldContent}
          />
        ))}
      </section>
      <ButtonContainer />
    </form>
  );
};

export default FilterBig;
