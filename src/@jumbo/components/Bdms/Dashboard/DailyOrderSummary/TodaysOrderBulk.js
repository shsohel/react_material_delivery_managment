import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysOrderBulk = props => {
  const { totalBulkQuantityInOrder } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#3B9FE2"
      subTitle={`${totalBulkQuantityInOrder}`}
      title="Today's Order (Bulk)"></StatisticsCardWithBg>
  );
};

export default TodaysOrderBulk;
