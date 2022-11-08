import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalDrumDelivered = props => {
  const { totalDrumDelivered } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#7D38DF"
      subTitle={`${totalDrumDelivered}`}
      title="Today's delivered DRUM"></StatisticsCardWithBg>
  );
};

export default TotalDrumDelivered;
