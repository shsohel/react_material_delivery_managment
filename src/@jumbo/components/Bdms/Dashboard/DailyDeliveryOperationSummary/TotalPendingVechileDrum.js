import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalPendingVechileCheckIn = props => {
  const { totalPendingVechileDrum } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#4C9173"
      subTitle={`${totalPendingVechileDrum}`}
      title="Today's remaining DRUM"></StatisticsCardWithBg>
  );
};

export default TotalPendingVechileCheckIn;
