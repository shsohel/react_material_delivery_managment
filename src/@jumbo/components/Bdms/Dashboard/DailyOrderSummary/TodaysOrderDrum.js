import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysOrderDrum = props => {
  const { totalNoOfDrumInOrder } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#3B9FE2"
      subTitle={`${totalNoOfDrumInOrder}`}
      title="Today's Order (Drum)"></StatisticsCardWithBg>
  );
};

export default TodaysOrderDrum;
