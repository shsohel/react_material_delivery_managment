import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysWaitingForLoadingDrum = props => {
  const { totalDrumOrderDeliveryOnProcess } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#4C9173"
      subTitle={`${totalDrumOrderDeliveryOnProcess}`}
      title="Today's order delivery on process (Drum)"></StatisticsCardWithBg>
  );
};

export default TodaysWaitingForLoadingDrum;
