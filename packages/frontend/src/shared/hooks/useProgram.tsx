import type { Program } from "@classic-hub/shared/types/performance";

const useProgram = (data: Program) => {
  const programText = data
    .map((item) => {
      // 1. 작곡가 이름
      const composer = item.composer;

      // 2. 곡 목록 (들여쓰기 추가)
      const pieces = item.pieces
        .map((piece) => `${piece}`) // 두 칸 들여쓰기
        .join("\n");

      return `<${composer}>\n${pieces}`;
    })
    .join("\n\n"); 
  return (
    <div className="whitespace-pre-wrap text-dark text-[0.88rem]/[1.42rem]">
      {programText}
    </div>
  )
};

export default useProgram;
