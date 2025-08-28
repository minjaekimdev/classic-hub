import React from "react";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import RankingContainer from "@/components/ranking/RankingContainer";

const pfRanking: React.FC = () => {
  return (
    <>
      <Header />
      <RankingContainer />
      <Footer />
    </>
  );
};

export default pfRanking;
