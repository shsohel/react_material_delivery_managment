import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';

const DailyTotalEntryPermits = props => {
  return (
    <StatisticsCardWithBg
      backgroundColor="#0795F4"
      icon={<TimelineIcon style={{ color: '#fff' }} />}
      title="7"
      subTitle="Total Daily Entry Permits"></StatisticsCardWithBg>
  );
};

export default DailyTotalEntryPermits;
