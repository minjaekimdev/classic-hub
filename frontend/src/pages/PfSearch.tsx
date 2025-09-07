import React from "react";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import Filter from "@/components/serach/filter/filter";
import PerformanceCard from "@/components/common/PerformanceItem";
import Info from "@/components/serach/performance-info/Info";

const PfSearch: React.FC = () => {
  return (
    <>
      <Header />
      <Filter />
      <Info />
      <Footer />
    </>
  );
};

export default PfSearch;
