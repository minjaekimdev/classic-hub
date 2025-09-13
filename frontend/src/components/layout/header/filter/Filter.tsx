import React, { useState, useEffect, useRef } from "react";
import styles from "./filter.module.scss";
import searchIcon from "@assets/filter/search-icon.svg";
import FilterField from "./FilterField";

const SearchInput: React.FC<{
  isSelected: boolean;
  onSelect: () => void;
  isFilterActive: boolean;
}> = ({ isSelected, onSelect, isFilterActive }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const inputFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`${styles["filter__searchbox"]} ${
        isSelected ? styles["filter__searchbox--active"] : ""
      } ${
        isFilterActive && !isSelected
          ? styles["filter__searchbox--inactive"]
          : ""
      }`}
      onClick={() => {
        onSelect();
        inputFocus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="공연명, 프로그램(작품)명으로 검색해보세요!"
        className={styles["filter__input"]}
        onFocus={onSelect}
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

const Filter: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [filterActive, setFilterActive] = useState(false);
  const filterRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterActive(false);
        setSelected(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const onSelect = (index: number) => {
    setFilterActive(true);
    setSelected(index);
  };

  return (
    <div className={styles["filter-section"]}>
      <div className={styles["container"]}>
        <div className={styles["filter-wrapper"]}>
          <form
            ref={filterRef}
            method="get"
            className={`${styles["filter"]} ${
              filterActive ? styles["filter--active"] : ""
            }`}
          >
            <SearchInput
              isSelected={selected === -2}
              onSelect={() => onSelect(-2)}
              isFilterActive={selected !== null}
            />
            <ButtonContainer />
            {filterFieldProps.map((element, index) => (
              <FilterField
                key={element.area}
                data={element}
                onSelect={() => onSelect(index)}
                setSelected={setSelected}
                setFilterActive={setFilterActive}
                isSelected={selected === index}
                isFilterActive={selected !== null}
              />
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Filter;
