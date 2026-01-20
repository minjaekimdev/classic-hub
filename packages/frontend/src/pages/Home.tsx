import HomeLayout from "@/shared/layout/HomeLayout";
import RankingPerformances from "@/features/performance/components/RankingPerformances";
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
