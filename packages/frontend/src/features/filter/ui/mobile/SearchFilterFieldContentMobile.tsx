import React from "react";
import FilterFieldHeaderMobile from "./SearchFilterFieldHeaderMobile";
import type { SearchCategory } from "../../types/filter";

interface FilterFieldContentMobileProps {
  fieldName: keyof SearchCategory;
  children: React.ReactNode;
}

const FirstFilterFieldContentMobile = ({
  fieldName,
  children,
}: FilterFieldContentMobileProps) => {
  return (
    <div className="gap-066 flex flex-col p-[1.31rem] pb-20">
      <FilterFieldHeaderMobile fieldName={fieldName} />
      {children}
    </div>
  );
};

export default FirstFilterFieldContentMobile;
