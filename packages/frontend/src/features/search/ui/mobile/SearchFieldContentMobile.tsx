import React from "react";
import FilterFieldHeaderMobile from "./SearchFieldHeaderMobile";

interface FilterFieldContentMobileProps {
  fieldName: string | null;
  children: React.ReactNode;
}

const FilterFieldContentMobile = ({
  fieldName,
  children,
}: FilterFieldContentMobileProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem] p-[1.31rem]">
      <FilterFieldHeaderMobile fieldName={fieldName} />
      {children}
    </div>
  );
};

export default FilterFieldContentMobile;
