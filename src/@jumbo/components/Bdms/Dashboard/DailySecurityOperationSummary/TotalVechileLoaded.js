import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalVechileLoaded = props => {
  const { totalVechileLoaded } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#4C9173"
      subTitle={`${totalVechileLoaded}`}
      title="Vehicle waiting for check out"></StatisticsCardWithBg>
  );
};

export default TotalVechileLoaded;
