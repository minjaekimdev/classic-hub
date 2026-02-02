interface DetailCategoryProps {
  title: string;
  children: React.ReactNode;
}
const DetailCategory = ({ title, children }: DetailCategoryProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <h3 className="text-dark text-[1.31rem]/[1.75rem] font-semibold">{title}</h3>
      {children}
    </div>
  );
};

export default DetailCategory;
