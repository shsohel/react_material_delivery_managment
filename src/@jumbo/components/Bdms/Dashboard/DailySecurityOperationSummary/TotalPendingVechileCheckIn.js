import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalPendingVechileCheckIn = props => {
  const { totalPendingVechileCheckIn } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#E86C63"
      title="Vehichel waiting for check in"
      subTitle={`${totalPendingVechileCheckIn}`}></StatisticsCardWithBg>
  );
};

export default TotalPendingVechileCheckIn;
