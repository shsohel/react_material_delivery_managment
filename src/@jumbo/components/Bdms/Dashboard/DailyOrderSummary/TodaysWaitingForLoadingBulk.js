import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysWaitingForLoadingBulk = props => {
  const { totalBulkOrderDeliveryOnProcess } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#4C9173"
      subTitle={`${totalBulkOrderDeliveryOnProcess}`}
      title="Today's order delivery on process (Bulk)"></StatisticsCardWithBg>
  );
};

export default TodaysWaitingForLoadingBulk;
