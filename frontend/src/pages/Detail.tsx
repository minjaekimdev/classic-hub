import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/header/HeaderExtended";
import Footer from "@/components/layout/footer/Footer";
import DetailContainer from "@/components/detail/DetailContainer";

const Detail: React.FC = () => {
  const { pfId = "" } = useParams();
  return (
    <>
      <Header />
      <DetailContainer pfId={pfId} />
      <Footer />
    </>
  );
};

export default Detail;
