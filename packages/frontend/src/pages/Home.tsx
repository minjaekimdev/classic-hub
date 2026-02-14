import { Toaster } from "sonner";
import WeekendPerformances from "@/widgets/home/ui/WeekendPerformances";
import RankingPerformances from "@/widgets/home/ui/RankingPerformances";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import FeedbackModal from "@/features/feedback/FeedbackModal";
import Modal from "@/shared/ui/modal/Modal";
import HomeLayoutMobile from "@/layout/mobile/HomeLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import SearchDesktop from "@/features/filter/contexts/search-context.desktop";
import SearchMobile from "@/features/filter/contexts/search-context.mobile";

const LayoutSwitcher = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useBreakpoint(740);

  if (!isMobile) {
    return (
      <LayoutDesktop variant="home">
        <SearchDesktop>
          <LayoutDesktop.Wrapper hasPaddingTop={true}>
            {children}
          </LayoutDesktop.Wrapper>
        </SearchDesktop>
      </LayoutDesktop>
    );
  }
  return (
    <SearchMobile>
      <HomeLayoutMobile>{children}</HomeLayoutMobile>
    </SearchMobile>
  );
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
