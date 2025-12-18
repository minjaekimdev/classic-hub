import searchIcon from "@shared/assets/icons/search-gray.svg";

const BookmarkSearchBox = () => {
  return (
    <div className="flex gap-[0.66rem] items-center rounded-[0.42rem] border border-transparent bg-[#f3f3f5] px-[0.66rem] py-[0.44rem] max-w-98">
      <img src={searchIcon} alt="" className="w-[0.88rem] h-[0.88rem]" />
      <input
        type="text"
        placeholder="공연명, 아티스트, 공연장 검색..."
        className="w-full placehoder:text-[#717182] placeholder:text-[0.77rem] text-[0.77rem]"
      />
    </div>
  );
};

export default BookmarkSearchBox;