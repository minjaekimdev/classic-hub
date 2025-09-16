import React, { useRef, useEffect, type SetStateAction } from "react";
import styles from "./FilterBig.module.scss";
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

  return (
    <div
      className={`${styles["filter__searchbox"]} ${
        fieldSelected === "검색" ? styles["filter__searchbox--active"] : ""
      } ${
        fieldSelected !== null && fieldSelected !== "검색"
          ? styles["filter__searchbox--inactive"]
          : ""
      }`}
      onClick={() => {
        onFieldSelect("검색");
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
            검색: e.target.value,
          }));
        }}
        onFocus={() => {
          onFieldSelect("검색");
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
    <div className={styles["filter__button-container"]}>
      <button
        className={`${styles["filter__button"]} ${styles["filter__button--reset"]}`}
      >
        초기화
      </button>
      <button
        className={`${styles["filter__button"]} ${styles["filter__button--search"]}`}
      >
        <img src={searchIcon} alt="" />
        <span>검색</span>
      </button>
    </div>
  );
};

const filterFieldProps = [
  {
    area: "c",
    type: "시대",
    initialState: "시대 선택",
  },
  {
    area: "d",
    type: "장르",
    initialState: "장르 선택",
  },
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
    <div className={styles["filter-section"]}>
      <div className={styles["container"]}>
        <div className={styles["filter-wrapper"]}>
          <form
            ref={filterRef}
            method="get"
            className={`${styles["filter"]} ${
              selectedField ? styles["filter--active"] : ""
            }`}
          >
            <SearchInput
              fieldSelected={selectedField}
              inputValue={fieldContent.검색}
              onFieldSelect={setSelectedField}
              setFieldContent={setFieldContent}
            />
            <ButtonContainer />
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterBig;
