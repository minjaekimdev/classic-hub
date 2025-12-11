import RankingHeader from "@/features/ranking/components/RankingHeader";
import RankingList from "@/features/ranking/components/RankingList";
import MainLayout from "@/shared/layout/MainLayout";

const Ranking = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-[2.19rem]">
        <RankingHeader />
        <RankingList />
      </div>
    </MainLayout>
  );
};

export default Ranking;
