
const DetailImages = ({ imgUrlArray }: { imgUrlArray: string[] }) => {
  return (
    <div className="flex flex-col gap-[0.88rem] desktop:gap-[1.31rem]">
      <h3 className="text-dark text-[0.88rem]/[1.31rem] desktop:text-[1.31rem]/[1.75rem] font-semibold">공연 상세 정보</h3>
      <div className="flex flex-col rounded-main border border-[rgba(0,0,0,0.1)] overflow-hidden">
        {imgUrlArray.map((item) => (
          <img src={item} alt="상세이미지" className="w-full" />
        ))}
      </div>
    </div>
  );
};

export default DetailImages;
