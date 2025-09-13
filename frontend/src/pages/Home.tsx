import React from "react";
import Header from "@/components/layout/header/HeaderExtended";
import Footer from "@/components/layout/footer/Footer";
import Info from "@/components/home/performance-info/Info";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Info />
      <Footer />
    </>
  );
};

export default Home;
