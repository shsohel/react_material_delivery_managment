import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { dashboard } from '@jumbo/constants/PermissionsType';
import { Box, CircularProgress, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../../services/auth/jwt/config';
import CustomerDailyDeliveryOperationSummary from './CustomerDailyDeliveryOperationSummary';
import TotalBulkDelivered from './DailyDeliveryOperationSummary/TotalBulkDelivered';
import TotalBulkQuantiyRemaining from './DailyDeliveryOperationSummary/TotalBulkQuantiyRemaining';
import TotalDrumDelivered from './DailyDeliveryOperationSummary/TotalDrumDelivered';
import TotalPendingVechileDrum from './DailyDeliveryOperationSummary/TotalPendingVechileDrum';
import TodaysCompletedBulk from './DailyOrderSummary/TodaysCompletedBulk';
import TodaysCompletedDrum from './DailyOrderSummary/TodaysCompletedDrum';
import TodaysOrderBulk from './DailyOrderSummary/TodaysOrderBulk';
import TodaysOrderDrum from './DailyOrderSummary/TodaysOrderDrum';
import TodaysRemainingBulk from './DailyOrderSummary/TodaysRemainingBulk';
import TodaysRemainingDrum from './DailyOrderSummary/TodaysRemainingDrum';
import TodaysWaitingForLoadingBulk from './DailyOrderSummary/TodaysWaitingForLoadingBulk';
import TodaysWaitingForLoadingDrum from './DailyOrderSummary/TodaysWaitingForLoadingDrum';
import TotalPendingVechileCheckIn from './DailySecurityOperationSummary/TotalPendingVechileCheckIn';
import TotalVechileCheckIn from './DailySecurityOperationSummary/TotalVechileCheckIn';
import TotalVechileCheckOut from './DailySecurityOperationSummary/TotalVechileCheckOut';
import TotalVechileLoaded from './DailySecurityOperationSummary/TotalVechileLoaded';

const useStyles = makeStyles(theme => ({
  circularProgressRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  paper: {
    border: '1px solid #33658A',
    maxWidth: 400,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2)
  },
  innerText: {
    fontSize: 25,
    textAlign: 'center'
  },
  innerDate: {
    fontSize: 20,
    textAlign: 'center'
  }
}));
const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Dashboard', link: '', isActive: true }
];

const initialDataFordailySecurityOperationSummary = {
  totalPendingVechileCheckIn: 0,
  totalVechileCheckIn: 0,
  totalVechileLoaded: 0,
  totalVechileCheckOut: 0
};

const initialDataFordailyDeliveryOperationSummary = {
  totalBulkQuantiyRemaining: 0,
  totalPendingVechileDrum: 0,
  totalBulkDelivered: 0,
  totalDrumDelivered: 0
};

const initialDataFordailyOrderSummary = {
  totalBulkQuantityInOrder: 0,
  totalNoOfDrumInOrder: 0,
  totalBulkOrderDeliveryOnProcess: 0,
  totalDrumOrderDeliveryOnProcess: 0,
  totalBulkOrderDelivered: 0,
  totalNoOfDrumOrderDelivered: 0,
  totalBulkOrderRemaining: 0,
  totalNoOfDrumOrderRemaining: 0
};

const Dashboard = () => {
  const classes = useStyles();
  const [dailySecurityOperationSummary, setDailySecurityOperationSummary] = useState(
    initialDataFordailySecurityOperationSummary
  );
  const [dailyDeliveryOperationSummary, setDailyDeliveryOperationSummary] = useState(
    initialDataFordailyDeliveryOperationSummary
  );
  const [dailyOrderSummary, setDailyOrderSummary] = useState(initialDataFordailyOrderSummary);
  const [isPageLoaded, setPageIsLoaded] = useState(false);

  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermisstionForSecurityCard = userPermission?.includes(dashboard.CARD_FOR_SEQURITY);
  const hasPermissionForAbpCard = userPermission?.includes(dashboard.CARD_FOR_ABP);
  const hasPermissionForPlanningCard = userPermission?.includes(dashboard.CARD_FOR_PLANNING);

  const getDailySecurityOperationSummary = async () => {
    try {
      await axios.get(`${urls_v1.dashboard.get_daily_security_operation_summary}`).then(({ data }) => {
        const { totalPendingVechileCheckIn, totalVechileCheckIn, totalVechileLoaded, totalVechileCheckOut } = data.data;
        setDailySecurityOperationSummary({
          totalPendingVechileCheckIn: totalPendingVechileCheckIn,
          totalVechileCheckIn: totalVechileCheckIn,
          totalVechileLoaded: totalVechileLoaded,
          totalVechileCheckOut: totalVechileCheckOut
        });
        setPageIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getDailyDeliveryOperationSummary = async () => {
    try {
      await axios.get(`${urls_v1.dashboard.get_daily_delivery_operation_summary}`).then(({ data }) => {
        const { totalBulkDelivered, totalBulkQuantiyRemaining, totalDrumDelivered, totalPendingVechileDrum } = data.data;
        setDailyDeliveryOperationSummary({
          totalBulkQuantiyRemaining: +totalBulkQuantiyRemaining,
          totalPendingVechileDrum: +totalPendingVechileDrum,
          totalBulkDelivered: +totalBulkDelivered,
          totalDrumDelivered: +totalDrumDelivered
        });
        setPageIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getDailyOrderSummary = async () => {
    try {
      await axios.get(`${urls_v1.dashboard.get_daily_order_summary}`).then(({ data }) => {
        const {
          totalBulkQuantityInOrder,
          totalNoOfDrumInOrder,
          totalBulkOrderDeliveryOnProcess,
          totalDrumOrderDeliveryOnProcess,
          totalBulkOrderDelivered,
          totalNoOfDrumOrderDelivered,
          totalBulkOrderRemaining,
          totalNoOfDrumOrderRemaining
        } = data.data;
        setDailyOrderSummary({
          totalBulkQuantityInOrder: +totalBulkQuantityInOrder,
          totalNoOfDrumInOrder: +totalNoOfDrumInOrder,
          totalBulkOrderDeliveryOnProcess: +totalBulkOrderDeliveryOnProcess,
          totalDrumOrderDeliveryOnProcess: +totalDrumOrderDeliveryOnProcess,
          totalBulkOrderDelivered: +totalBulkOrderDelivered,
          totalNoOfDrumOrderDelivered: +totalNoOfDrumOrderDelivered,
          totalBulkOrderRemaining: +totalBulkOrderRemaining,
          totalNoOfDrumOrderRemaining: +totalNoOfDrumOrderRemaining
        });
        setPageIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (hasPermisstionForSecurityCard) {
      getDailySecurityOperationSummary();
    }
    if (hasPermissionForAbpCard) {
      getDailyDeliveryOperationSummary();
    }
    if (hasPermissionForPlanningCard) {
      getDailyOrderSummary();
    }
    setPageIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = `ERL-BDMS - Dashboard`;
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer heading="ERL Dashboard" breadcrumbs={breadcrumbs}>
      <Paper className={classes.paper} elevation={3}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item xs zeroMinWidth>
            <Typography noWrap className={classes.innerText}>
              Bitumen Delivery System
            </Typography>
            <Typography noWrap className={classes.innerDate}>
              {moment(new Date()).format('DD-MMM-yy')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <GridContainer>
        {userPermission?.includes(dashboard.CARD_FOR_SEQURITY) && (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" component="div">
                Daily Security Operation Summary
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalPendingVechileCheckIn
                totalPendingVechileCheckIn={dailySecurityOperationSummary.totalPendingVechileCheckIn}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalVechileCheckIn totalVechileCheckIn={dailySecurityOperationSummary.totalVechileCheckIn} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalVechileLoaded totalVechileLoaded={dailySecurityOperationSummary.totalVechileLoaded} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalVechileCheckOut totalVechileCheckOut={dailySecurityOperationSummary.totalVechileCheckOut} />
            </Grid>
          </>
        )}

        {userPermission?.includes(dashboard.CARD_FOR_ABP) && (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" component="div">
                Daily Delivery Operation Summary
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalBulkQuantiyRemaining
                totalBulkQuantiyRemaining={dailyDeliveryOperationSummary.totalBulkQuantiyRemaining.toFixed(3)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalPendingVechileDrum totalPendingVechileDrum={dailyDeliveryOperationSummary.totalPendingVechileDrum} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalBulkDelivered totalBulkDelivered={dailyDeliveryOperationSummary.totalBulkDelivered.toFixed(3)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TotalDrumDelivered totalDrumDelivered={dailyDeliveryOperationSummary.totalDrumDelivered} />
            </Grid>
          </>
        )}

        {userPermission?.includes(dashboard.CARD_FOR_PLANNING) && (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" component="div">
                Daily Order Summary
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysOrderBulk totalBulkQuantityInOrder={dailyOrderSummary.totalBulkQuantityInOrder.toFixed(3)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysOrderDrum totalNoOfDrumInOrder={dailyOrderSummary.totalNoOfDrumInOrder} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysWaitingForLoadingBulk
                totalBulkOrderDeliveryOnProcess={dailyOrderSummary.totalBulkOrderDeliveryOnProcess.toFixed(3)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysWaitingForLoadingDrum
                totalDrumOrderDeliveryOnProcess={dailyOrderSummary.totalDrumOrderDeliveryOnProcess}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysCompletedBulk totalBulkOrderDelivered={dailyOrderSummary.totalBulkOrderDelivered.toFixed(3)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysCompletedDrum totalNoOfDrumOrderDelivered={dailyOrderSummary.totalNoOfDrumOrderDelivered} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysRemainingBulk totalBulkOrderRemaining={dailyOrderSummary.totalBulkOrderRemaining.toFixed(3)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <TodaysRemainingDrum totalNoOfDrumOrderRemaining={dailyOrderSummary.totalNoOfDrumOrderRemaining} />
            </Grid>
          </>
        )}
        {(userPermission?.includes(dashboard.CUSTOMER_DELIVERY_SUMMARY) ||
          userPermission?.includes(dashboard.CARD_FOR_ABP) ||
          userPermission?.includes(dashboard.CARD_FOR_PLANNING)) && (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" component="div">
                Customer Daily Delivery Operation Summary
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomerDailyDeliveryOperationSummary />
            </Grid>
          </>
        )}
      </GridContainer>
    </PageContainer>
  );
};
export default Dashboard;
