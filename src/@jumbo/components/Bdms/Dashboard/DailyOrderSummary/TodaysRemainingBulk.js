import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysRemainingBulk = props => {
  const { totalBulkOrderRemaining } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#7D38DF"
      subTitle={`${totalBulkOrderRemaining}`}
      title="Today's Remaining (Bulk)"></StatisticsCardWithBg>
  );
};

export default TodaysRemainingBulk;
