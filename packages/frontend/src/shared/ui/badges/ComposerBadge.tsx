const ComposerBadge = ({ composer }: { composer: string }) => {
  return (
    <div className="max-w-full truncate text-composer-dark rounded-button text-badge px-badge-x py-badge-y bg-light inline-block border border-[#d1d5dc] font-medium">
      {composer}
    </div>
  );
};

export default ComposerBadge;
