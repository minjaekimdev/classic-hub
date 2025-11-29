import React from "react";
import FilterFieldHeaderMobile from "./FilterFieldHeaderMobile";

interface FilterFieldContentMobileProps {
  children: React.ReactNode;
}

const FilterFieldContentMobile = ({
  children,
}: FilterFieldContentMobileProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem] p-[1.31rem]">
      <FilterFieldHeaderMobile fieldName="지역" />
      {children}
    </div>
  );
};

export default FilterFieldContentMobile;
