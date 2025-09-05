import React from 'react';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import Filter from '@/components/serach/filter/filter';

const PfSearch: React.FC = () => {
  return (
    <>
      <Header />
      <Filter />
      <Footer />
    </>
  );
};

export default PfSearch;