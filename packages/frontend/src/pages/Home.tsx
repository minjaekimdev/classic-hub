import HomeLayout from "@/layout/shared/HomeLayout";
import { Toaster } from "sonner";
import WeekendPerformances from "@/widgets/home/ui/weekend-performances";
import RankingPerformances from "@/widgets/home/ui/ranking-performances";

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
