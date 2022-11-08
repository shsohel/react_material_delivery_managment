import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalBulkDelivered = props => {
  const { totalBulkDelivered } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#E86C63"
      subTitle={`${totalBulkDelivered}`}
      title="Today's delivered BULK"></StatisticsCardWithBg>
  );
};

export default TotalBulkDelivered;
