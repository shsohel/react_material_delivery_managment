import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import React from 'react';

const TotalNoOfDrumInOrder = props => {
  const { totalNoOfDrumInOrder } = props;

  return (
    <StatisticsCardWithBg
      backgroundColor="#3B9FE2"
      title={`${totalNoOfDrumInOrder}`}
      subTitle="Today's DRUM order"></StatisticsCardWithBg>
  );
};

export default TotalNoOfDrumInOrder;
