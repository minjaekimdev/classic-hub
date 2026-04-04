import noteIcon from "@shared/assets/icons/single-note-red.svg";

export const CalloutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="callout-box my-088 self-start">
      <div className="gap-022 flex items-start">
        <img src={noteIcon} className="relative top-0.5" />
        {children}
      </div>
    </div>
  );
};