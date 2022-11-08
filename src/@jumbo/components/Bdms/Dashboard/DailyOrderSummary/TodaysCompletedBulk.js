import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysCompletedBulk = props => {
  const { totalBulkOrderDelivered } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#E86C63"
      subTitle={`${totalBulkOrderDelivered}`}
      title="Today's Complete (Bulk)"></StatisticsCardWithBg>
  );
};

export default TodaysCompletedBulk;
