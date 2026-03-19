import icon from "@shared/assets/icons/single-note-red.svg";

interface ProgramCalloutProps {
  composer: string;
  piece: string;
  other: number;
}
const ProgramCallout = ({ composer, piece, other }: ProgramCalloutProps) => {
  return (
    <div className="rounded-022 bg-gray-150 px-callout-x pt-callout-t pb-callout-b flex gap-022 border border-gray-300">
      <img src={icon} alt="" />
      <span className="text-badge">
        <span className="font-medium">{composer}: </span>
        <span>{piece} 외 {other}곡</span>
      </span>
    </div>
  );
};

export default ProgramCallout;
