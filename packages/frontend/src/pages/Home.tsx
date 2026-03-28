import { Toaster } from "sonner";
import useBreakpoint from "@/shared/hooks/useBreakpoint";
import HomeLayoutMobile from "@/layout/mobile/HomeLayoutMobile";
import LayoutDesktop from "@/layout/desktop/LayoutDesktop";
import SearchDesktop from "@/features/filter/contexts/search-context.desktop";
import SearchMobile from "@/features/filter/contexts/search-context.mobile";
import { RankingPerformances } from "@/widgets/home/ui/RankingPerformances";
import { WeekendPerformances } from "@/widgets/home/ui/WeekendPerformances";
import { ModalProvider } from "@/app/providers/modal/ModalProvider";

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
    <ModalProvider>
      <LayoutSwitcher>
        <Toaster />
        <RankingPerformances />
        <WeekendPerformances />
      </LayoutSwitcher>
    </ModalProvider>
  );
};

export default Home;
