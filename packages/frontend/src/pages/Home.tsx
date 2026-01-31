import HomeLayout from "@/layout/shared/HomeLayout";
import { Toaster } from "sonner";
import WeekendPerformances from "@/widgets/home/ui/WeekendPerformances";
import RankingPerformances from "@/widgets/home/ui/RankingPerformances";

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
