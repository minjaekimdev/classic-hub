import HomeLayout from "@/shared/layout/HomeLayout";
import RankingPerformances from "@/features/performance/components/RankingPerformances";
import WeekendPerformances from "@/features/performance/components/WeekendPerformances";
// import MainLayout from "@/shared/layout/MainLayout";
import type { HomePerformance } from "@classic-hub/shared/types/client";


const Home = () => {
  return (
    <HomeLayout>
      <RankingPerformances />
      {/* <WeekendPerformances performanceArray={homeWeekendData} /> */}
    </HomeLayout>
  );
};

export default Home;
