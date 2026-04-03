import { toast } from "sonner";
import ActionButton from "./ButtonWithText";
import shareIcon from "@shared/assets/icons/share-black.svg";
import { usePostHog } from "@posthog/react";

export const ShareButtonWithText = () => {
  const posthog = usePostHog();

  const handler = async () => {
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("링크가 복사되었습니다.", {id: "copy-success"});
      posthog.capture("performance_shared", { url: currentUrl });
    } catch (error) {
      console.error("클립보드 복사 실패", error);
      toast.error("링크 복사에 실패했습니다.", {id: "copy-fail"});
    }
  };

  return (
    <ActionButton handler={handler}>
      <img src={shareIcon} alt="공유하기" className="w-3.5 h-3.5" />
      공유하기
    </ActionButton>
  );
};

export default ShareButtonWithText;