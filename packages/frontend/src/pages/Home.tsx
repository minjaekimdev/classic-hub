import HomeLayout from "@/shared/layout/desktop/HomeLayout";
import RankingPerformances from "@/features/ranking/components/HomeRanking";
import WeekendPerformances from "@/features/performance/components/WeekendPerformances";

const Home = () => {
  return (
    <HomeLayout>
      <RankingPerformances />
      <WeekendPerformances />
    </HomeLayout>
  );
};

export default Home;
