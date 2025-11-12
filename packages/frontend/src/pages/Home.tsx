import React from "react";
import Footer from "@/components/layout/footer/Footer";
import Info from "@/components/home/performance-info/Info";
import Header from "@/components/layout/header/Header";

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
