import ComposerBadge from "@/shared/ui/badges/ComposerBadge";
import type { Program } from "@classic-hub/shared/types/common";

const ComposerList = ({ programs }: { programs: Program[] }) => {
  if (!programs || programs.length === 0) return null;
  const composersKo = programs
    .filter((item) => item.composerKo)
    .map((item) => item.composerKo)
    .slice(0, 5);
  return (
    <div className="flex w-full max-h-11 flex-wrap items-center gap-1 overflow-hidden">
      {composersKo.map((composer, idx) => (
        <ComposerBadge key={idx} composer={composer!} />
      ))}
    </div>
  );
};

export default ComposerList;
