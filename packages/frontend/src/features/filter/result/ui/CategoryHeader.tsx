interface CategoryHeaderProps {
  iconSrc?: string;
  text: string;
}

const CategoryHeader = ({ iconSrc, text }: CategoryHeaderProps) => {
  return (
    <div className="flex items-center gap-[0.44rem]">
      {iconSrc && <img src={iconSrc} alt="카테고리 헤더 아이콘" />}
      <span className="text-dark text-[0.88rem]/[1.31rem] font-semibold">
        {text}
      </span>
    </div>
  );
};

export default CategoryHeader;