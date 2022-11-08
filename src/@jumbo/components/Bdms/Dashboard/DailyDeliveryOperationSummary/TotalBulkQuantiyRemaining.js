import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalBulkQuantiyRemaining = props => {
  const { totalBulkQuantiyRemaining } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#3B9FE2"
      subTitle={`${totalBulkQuantiyRemaining}`}
      title="Today's remaining BULK"></StatisticsCardWithBg>
  );
};

export default TotalBulkQuantiyRemaining;
