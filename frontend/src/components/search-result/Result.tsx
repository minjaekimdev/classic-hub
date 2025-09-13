import React from 'react';
import SearchResultHeader from './SearchResultHeader';
import PerformanceGrid from './PerformanceGrid';
import SortBar from './sort-bar/SortBar';
import Pagenation from './pagenation/Pagenation';

const Result: React.FC = () => {
  return (
    <div className="container">
      <SearchResultHeader />
      <SortBar />
      <PerformanceGrid />
      <Pagenation />
    </div>
  );
};

export default Result;