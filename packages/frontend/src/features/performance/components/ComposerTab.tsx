interface ComposerTab {
  composer: string;
}

const ComposerTab = ({ composer }: ComposerTab) => {
  return (
    <div className="flex justify-center items-center rounded-button border border-[#d1d5dc] bg-[#f9fafb] px-[0.44rem] h-[1.22rem] text-[#364153] text-[0.66rem]/[0.88rem]">
      {composer}
    </div>
  );
};

export default ComposerTab;
