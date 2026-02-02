interface CategoryLayoutProps {
  children: React.ReactNode;
}
const CategoryLayout = ({children}: CategoryLayoutProps) => {
  return (
    <div className="flex flex-col gap-[0.66rem]">
      {children}
    </div>
  );
};

export default CategoryLayout;