import { Toaster } from "sonner";
import WeekendPerformances from "@/widgets/home/ui/WeekendPerformances";
import RankingPerformances from "@/widgets/home/ui/RankingPerformances";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import Modal from "@/shared/ui/modal/Modal";
import HomeLayoutMobile from "@/layout/mobile/HomeLayoutMobile";
import HomeLayoutDesktop from "@/layout/desktop/LayoutDesktop";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(740);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="home">
        <HomeLayoutDesktop.Wrapper>{children}</HomeLayoutDesktop.Wrapper>
      </LayoutDesktop>
    );
  }
  return <HomeLayoutMobile>{children}</HomeLayoutMobile>;
};

const Home = () => {
  return (
    <Modal>
      <FeedbackModal />
      <LayoutSwitcher>
        <Toaster />
        <RankingPerformances />
        <WeekendPerformances />
      </LayoutSwitcher>
    </Modal>
  );
};

export default Home;
