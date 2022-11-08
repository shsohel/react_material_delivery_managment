import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysCompletedDrum = props => {
  const { totalNoOfDrumOrderDelivered } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#E86C63"
      subTitle={`${totalNoOfDrumOrderDelivered}`}
      title="Today's Complete (Drum)"></StatisticsCardWithBg>
  );
};

export default TodaysCompletedDrum;
