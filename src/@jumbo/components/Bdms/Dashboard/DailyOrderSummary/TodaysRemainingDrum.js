import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TodaysRemainingDrum = props => {
  const { totalNoOfDrumOrderRemaining } = props;
  return (
    <StatisticsCardWithBg
      backgroundColor="#7D38DF"
      subTitle={`${totalNoOfDrumOrderRemaining}`}
      title="Today's Remaining (Drum)"></StatisticsCardWithBg>
  );
};

export default TodaysRemainingDrum;
