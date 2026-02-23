const RankingItemSkeleton = () => {
  return (
    <div className="flex gap-[0.88rem] items-center rounded-main tablet:px-[0.66rem] h-[6.34rem] animate-pulse">
      <div className="shrink-0 w-8 h-8 bg-gray-200 rounded-full" />
      <div className="shrink-0 w-14 h-[4.67rem] bg-gray-200 rounded-[0.22rem]" />
      <div className="grow flex justify-between items-center">
        <ul className="flex flex-col gap-2">
          <li className="w-32 h-[0.77rem] bg-gray-200 rounded" />
          <li className="w-20 h-[0.6rem] bg-gray-100 rounded" />
          <li className="w-24 h-[0.6rem] bg-gray-100 rounded" />
          <li className="w-16 h-[0.6rem] bg-gray-100 rounded" />
        </ul>
      </div>
      <div className="hidden desktop:block">
        <div className="w-8 h-4 bg-gray-100 rounded" />
      </div>
      <div className="hidden tablet:block shrink-0">
        <div className="w-14 h-[1.8rem] bg-gray-200 rounded-button" />
      </div>
    </div>
  );
};

export default RankingItemSkeleton;
