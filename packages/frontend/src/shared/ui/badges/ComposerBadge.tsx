const ComposerBadge = ({ composer }: { composer: string }) => {
  return (
    <div className="text-composer-dark rounded-button text-badge font-medium px-badge-x py-badge-y bg-light inline-block border border-[#d1d5dc]">
      {composer}
    </div>
  );
};

export default ComposerBadge;
