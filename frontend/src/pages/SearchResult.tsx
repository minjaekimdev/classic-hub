import React from 'react';
import Header from '@/components/layout/header/HeaderExtended';
import Footer from '@/components/layout/footer/Footer';
import Result from '@/components/search-result/Result';

const SearchResult: React.FC = () => {
  return (
    <>
      <Header />
      <Result />
      <Footer />
    </>
  );
};

export default SearchResult;