import React from "react";
import Header from "@/components/layout/header/HeaderExtended";
import Footer from "@/components/layout/footer/Footer";
import RankingContainer from "@/components/ranking/RankingContainer";

const Ranking: React.FC = () => {
  return (
    <>
      <Header />
      <RankingContainer />
      <Footer />
    </>
  );
};

export default Ranking;
