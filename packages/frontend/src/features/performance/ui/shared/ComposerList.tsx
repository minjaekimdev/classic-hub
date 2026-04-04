import useBreakpoint from "@/shared/hooks/useBreakpoint";
import ComposerBadge from "@/shared/ui/badges/ComposerBadge";
import type { Program } from "@classic-hub/shared/types/common";

const ComposerList = ({ programs }: { programs: Program[] }) => {
  const isShrink = useBreakpoint(420);

  if (!programs || programs.length === 0) return null;
  const composersKo = programs
    .filter((item) => item.composerKo)
    .map((item) => item.composerKo)
    .slice(0, 5);

  const height = isShrink ? "max-h-5" : "max-h-11";
  return (
    <div
      className={`flex w-full flex-wrap items-center gap-1 overflow-hidden ${height}`}
    >
      {composersKo.map((composer, idx) => (
        <ComposerBadge key={idx} composer={composer!} />
      ))}
    </div>
  );
};

export default ComposerList;
