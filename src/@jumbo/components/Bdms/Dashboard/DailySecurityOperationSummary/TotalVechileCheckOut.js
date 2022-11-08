import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalVechileCheckOut = props => {
  const { totalVechileCheckOut } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#7D38DF"
      subTitle={`${totalVechileCheckOut}`}
      title="Vehicle checked out"></StatisticsCardWithBg>
  );
};

export default TotalVechileCheckOut;
