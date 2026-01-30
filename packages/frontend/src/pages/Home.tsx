import HomeLayout from "@/layout/shared/HomeLayout";
import RankingPerformances from "@/features/ranking/components/HomeRanking";
import { Toaster } from "sonner";
import WeekendPerformances from "@/widgets/home/ui/weekend-performances";

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
