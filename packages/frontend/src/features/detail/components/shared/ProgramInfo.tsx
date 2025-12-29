import useProgram from "@/shared/hooks/useProgram";
import type { Program } from "@classic-hub/shared/types/performance";

const ProgramInfo = ({ programInfo }: { programInfo: Program }) => {
  const data = useProgram(programInfo);
  return (
    <div className="flex flex-col gap-[0.66rem]">
      <h3 className="text-dark text-[0.88rem]/[1.31rem] desktop:text-[0.98rem]/[1.53rem] font-semibold">
        프로그램
      </h3>
      <div className="rounded-main p-[0.66rem] bg-[#f9fafb] whitespace-pre-line">
        {data}
      </div>
    </div>
  );
};

export default ProgramInfo;
