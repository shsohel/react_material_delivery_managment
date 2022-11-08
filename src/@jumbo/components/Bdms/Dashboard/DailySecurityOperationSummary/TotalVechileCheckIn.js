import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalVechileCheckIn = props => {
  const { totalVechileCheckIn } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#3B9FE2"
      subTitle={`${totalVechileCheckIn}`}
      title="Vehicle checked in"></StatisticsCardWithBg>
  );
};

export default TotalVechileCheckIn;
