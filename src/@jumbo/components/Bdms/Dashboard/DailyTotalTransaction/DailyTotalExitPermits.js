import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';

const DailyTotalExitPermits = props => {
  /* 
     "totalNoOfExitPermit": 1,
     "totalNoOfInvoice": 1,
     "totalAmountExitPermit": 217810,
     "totalAmountInvoice": 217810
 
     */
  return (
    <StatisticsCardWithBg
      backgroundColor="#018786"
      icon={<TimelineIcon style={{ color: '#fff' }} />}
      title="5"
      subTitle="Total Daily Exit Permits"></StatisticsCardWithBg>
  );
};

export default DailyTotalExitPermits;
