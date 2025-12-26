interface ComposerTab {
  composer: string;
}

const ComposerTab = ({ composer }: ComposerTab) => {
  return (
    <div className="flex justify-center items-center rounded-button bg-[#eceef2] px-[0.44rem] py-[0.11rem] text-[#030213] text-[0.66rem]/[0.88rem] font-medium">
      {composer}
    </div>
  );
};

export default ComposerTab;
