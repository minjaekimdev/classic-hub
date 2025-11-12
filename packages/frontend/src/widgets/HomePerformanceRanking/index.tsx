import React from 'react';
import styles from "./HomePerformanceRanking.module.scss"
import PerformanceCardHome from '@/features/performance/components/PerformanceCardHome';

interface HomePerformanceRankingProps {
  imgSrc: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  location: string;
  price: string;
}

const HomePerformanceRanking: React.FC<> = () => {
  return (
    <div className={styles.HomePerformanceRanking}>
      <PerformanceCardHome imgSrc="" />
    </div>
  );
};

export default HomePerformanceRanking;