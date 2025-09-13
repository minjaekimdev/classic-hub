import React from 'react';
import styles from "./PageMove.module.scss"
import PageItem from './PageItem';
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';

const PageMove: React.FC = () => {
  return (
    <div className={styles["page-move"]}>
      <PageItem>
          <LeftArrow />
        </PageItem>
        <PageItem>1</PageItem>
        <PageItem>2</PageItem>
        <PageItem>3</PageItem>
        <PageItem>4</PageItem>
        <PageItem>5</PageItem>
        <PageItem>
          <RightArrow />
        </PageItem>
    </div>
  );
};

export default PageMove;