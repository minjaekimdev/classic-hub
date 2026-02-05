interface FilterCategoryLayoutProps {
  children: React.ReactNode;
}
const FilterCategoryLayout = ({children}: FilterCategoryLayoutProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      {children}
    </div>
  );
};

export default FilterCategoryLayout;