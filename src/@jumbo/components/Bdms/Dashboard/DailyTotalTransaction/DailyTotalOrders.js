import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';

const DailyTotalOrders = () => {
  return (
    <StatisticsCardWithBg
      backgroundColor="#E90052"
      icon={<TimelineIcon style={{ color: '#fff' }} />}
      title="5"
      subTitle="Total Daily Orders"></StatisticsCardWithBg>
  );
};

export default DailyTotalOrders;
