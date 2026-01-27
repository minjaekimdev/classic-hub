import HomeLayout from "@/layout/shared/HomeLayout";
import RankingPerformances from "@/features/ranking/components/HomeRanking";
import WeekendPerformances from "@/features/performance/components/WeekendPerformances";
import { Toaster } from "sonner";

const Home = () => {
  return (
    <HomeLayout>
      <Toaster />
      <RankingPerformances />
      <WeekendPerformances />
    </HomeLayout>
  );
};

export default Home;
