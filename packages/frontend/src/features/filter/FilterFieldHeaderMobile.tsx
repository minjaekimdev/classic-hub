interface FilterFieldHeaderMobileProps {
  fieldName: string | null;
}

const FilterFieldHeaderMobile = ({
  fieldName,
}: FilterFieldHeaderMobileProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-[#101828] text-[0.88rem]/[1.31rem] font-medium">
        {fieldName} 선택
      </h3>
      <button className="text-[#6a7282] text-[0.77rem]/[1.09rem]">닫기</button>
    </div>
  );
};

export default FilterFieldHeaderMobile;
