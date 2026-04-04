import { CalloutLayout } from "@/shared/ui/callout/CalloutLayout";
import type { Program } from "@classic-hub/shared/types/common";
import { getProgramInfo } from "../desktop/ResultPerformanceAlbumCard/utils";

interface MatchedProgramProps {
  program: Program[];
  keyword: string;
  pieceCount: number;
}
export const MatchedProgram = ({
  program,
  keyword,
  pieceCount,
}: MatchedProgramProps) => {
  const matchedProgram = getProgramInfo(program, keyword);
  if (!matchedProgram) return null;
  const { composer, piece } = matchedProgram;

  return (
    <CalloutLayout>
      {/* 작곡가명이 매칭된 경우 */}
      {composer && composer.length === 3 && (
        <p className="line-clamp-2">
          <span>
            {composer[0]}
            <mark className="font-semibold">{composer[1]}</mark>
            {composer[2]}
          </span>
          {piece ? (
            <span>
              : {piece} 외 {pieceCount - 1}곡
            </span>
          ) : (
            <span> (세부 곡명 미정)</span>
          )}
        </p>
      )}

      {/* 곡명이 매칭된 경우 */}
      {piece && piece.length === 3 && (
        <p className="line-clamp-2">
          {composer ? <span>{composer}: </span> : ""}
          <span>
            {piece[0]}
            <mark className="font-semibold">{piece[1]}</mark>
            {piece[2]} 외 {pieceCount - 1}곡
          </span>
        </p>
      )}
    </CalloutLayout>
  );
};