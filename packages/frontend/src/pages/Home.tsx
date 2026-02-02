import { Toaster } from "sonner";
import WeekendPerformances from "@/widgets/home/ui/WeekendPerformances";
import RankingPerformances from "@/widgets/home/ui/RankingPerformances";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import { BREAKPOINTS } from "@/shared/constants";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import Modal from "@/shared/ui/modal/Modal";
import Footer from "@/layout/shared/Footer";
import HomeLayoutMobile from "@/layout/mobile/HomeLayoutMobile";
import HomeLayoutDesktop from "@/layout/desktop/HomeLayoutDesktop";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(BREAKPOINTS.TABLET);

  if (!isMobile) {
    return (
      <HomeLayoutDesktop>
        <HomeLayoutDesktop.Wrapper>{children}</HomeLayoutDesktop.Wrapper>
      </HomeLayoutDesktop>
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
      <Footer />
    </Modal>
  );
};

export default Home;
