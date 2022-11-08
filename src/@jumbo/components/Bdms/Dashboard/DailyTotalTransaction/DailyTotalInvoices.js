import StatisticsCardWithBg from '@jumbo/components/Common/StatisticsCardWithBg';
import TimelineIcon from '@material-ui/icons/Timeline';
import React from 'react';

const DailyTotalInvoices = props => {
  return (
    <StatisticsCardWithBg
      backgroundColor="#AE5853"
      icon={<TimelineIcon style={{ color: '#fff' }} />}
      title="254545"
      subTitle="Total Daily Invoices"></StatisticsCardWithBg>
  );
};

export default DailyTotalInvoices;
