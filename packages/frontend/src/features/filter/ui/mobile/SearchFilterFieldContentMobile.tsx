import React from "react";
import FilterFieldHeaderMobile from "./SearchFilterFieldHeaderMobile";
import type { SearchCategory } from "../../types/filter";

interface FilterFieldContentMobileProps {
  fieldName: keyof SearchCategory;
  children: React.ReactNode;
}

const FilterFieldContentMobile = ({
  fieldName,
  children,
}: FilterFieldContentMobileProps) => {
  return (
    <div className="flex flex-col gap-066 p-[1.31rem] pb-20">
      <FilterFieldHeaderMobile fieldName={fieldName} />
      {children}
    </div>
  );
};

export default FilterFieldContentMobile;
