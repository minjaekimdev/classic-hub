import styles from "./FilterDesktop.module.scss";
import FilterSearchField from "@/features/filter/FilterSearchField";
import FilterField from "@/features/filter/FilterField";
import FilterDateField from "@/features/filter/FilterDateField";
import searchIcon from "@shared/assets/icons/search-white.svg";

const FilterDesktop = () => {
  return (
    <div className={styles.filterDesktop}>
      <FilterSearchField />
      <FilterField label="지역" />
      <FilterField label="가격" />
      <FilterDateField />
      <div className={styles.buttonWrapper}>
        <button className={styles.filterDesktop__button}>
          <img src={searchIcon} alt="" />
          검색
        </button>
      </div>
    </div>
  );
};

export default FilterDesktop;
