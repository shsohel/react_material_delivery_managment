import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalOrderDelivered = props => {
  const { totalOrderDelivered } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#4C9173"
      title={`${totalOrderDelivered}`}
      subTitle="Today Waiting for Loading (Bulk)"></StatisticsCardWithBg>
  );
};

export default TotalOrderDelivered;
