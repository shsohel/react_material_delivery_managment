import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  },
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
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Orders', link: '/orders/list' },
  { label: 'Lifting Schedules', link: '/schedules/list' },
  { label: 'Create Lifting Schedule', link: '', isActive: true }
];

export default function LiftingScheduleManage(props) {
  const classes = useStyles();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [state, setState] = useState(null);
  const [liftingInfo, setLiftingInfo] = useState([]);
  const [createMultipleLs, setCreateMultipleLs] = useState(false);
  const orderKey = props.location.state;

  const getLiftingScheduleByOrderKey = async () => {
    try {
      await axios.get(`${urls_v1.liftingSchedule.get_order_for_ls}/${orderKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setState(body);
          setLiftingInfo(
            body.orderDetails.map(item => ({
              id: item.id,
              key: item.key,
              numberOfDrumFinal: item.numberOfDrumFinal,
              numberOfDrumDue: item.numberOfDrumDue,
              numberOfDrumRequest: item.numberOfDrumRequest,
              orderId: item.orderId,
              perUnitPrice: item.perUnitPrice,
              productGradeId: item.productGradeId,
              productGradeName: item.productGradeName,
              productId: item.productId,
              productName: item.productName,
              purchaseTypeId: item.purchaseTypeId,
              purchaseTypeName: item.purchaseTypeName,
              quantityFinal: item.quantityFinal,
              quantityDue: item.quantityDue,
              quantityRequest: item.quantityRequest,
              statusId: item.statusId,
              unitId: item.unitId,
              unitName: item.unitName,
              conversionRate: item.conversionRate,

              liftingDrum: '',
              liftingQuantity: '',
              requestDateTime: body.requestDate
            }))
          );
          setIsPageLoaded(true);
        } else {
          const e = window.confirm('You have completed all the lifting schedule');
          if (e) {
            props.history.replace('/schedules/list');
          } else {
            props.history.replace('/dashboard');
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    orderKey === undefined ? props.history.replace('/dashboard') : getLiftingScheduleByOrderKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleInputChange = (key, e) => {
    const newInputField = liftingInfo.map(item => {
      if (key === item.key) {
        item[e.target.name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      }
      return item;
    });
    setLiftingInfo(newInputField);
  };

  const handleDateChange = (key, e) => {
    const newInputField = liftingInfo.map(item => {
      if (key === item.key) {
        item['requestDateTime'] = e._d;
      }
      return item;
    });
    setLiftingInfo(newInputField);
  };

  const handleConvertion = (key, e) => {
    const newInputField = liftingInfo.map(item => {
      if (key === item.key) {
        if (Number(e.target.value) <= item.numberOfDrumDue) {
          item['liftingQuantity'] = Number((item.conversionRate * Number(e.target.value)).toFixed(3));
        } else {
          NotificationManager.warning('You reacched maximum drum');
          item['liftingDrum'] = 0;
          item['liftingQuantity'] = 0;
        }
      }
      return item;
    });
    setLiftingInfo(newInputField);
  };
  const handleQueantityChange = (key, e) => {
    const newInputField = liftingInfo.map(item => {
      if (key === item.key) {
        if (Number(e.target.value) <= item.quantityDue) {
          item['liftingQuantity'] = Number(e.target.value);
        } else {
          NotificationManager.warning('You reacched maximum quantity');
          item['liftingQuantity'] = 0;
        }
      }
      return item;
    });
    setLiftingInfo(newInputField);
  };
  const handleSubmit = e => {
    e.preventDefault();
    const obj = {
      liftingSchedules: liftingInfo
        .filter(item => item.liftingQuantity > 0)
        .map(item => ({
          orderId: item.orderId,
          orderDetailsId: item.id,
          customerId: state.customerId,
          customerName: state.customerName,
          productGradeId: item.productGradeId,
          productId: item.productId,
          productName: item.productName,
          productGradeName: item.productGradeName,
          purchaseTypeId: item.purchaseTypeId,
          purchaseTypeName: item.purchaseTypeName,
          numberOfDrum: item.liftingDrum ? item.liftingDrum : 0,
          liftingQuantity: item.liftingQuantity,
          liftingDateAndTime: Moment(item.requestDateTime).format('yyyy-MM-DD HH:mm:ss'),
          conversionRate: item.conversionRate,
          unitId: item.unitId,
          unitName: item.unitName
        }))
    };

    const isFinishedAllItem = liftingInfo.every(item => item.quantityDue === item.liftingQuantity);
    axios.post(urls_v1.liftingSchedule.post, obj).then(({ data }) => {
      if (data.succeeded) {
        if (isFinishedAllItem || !createMultipleLs) {
          props.history.replace('/orders/list');
          return;
        }
        NotificationManager.success(data.message);
        getLiftingScheduleByOrderKey();
      } else {
        NotificationManager.warning(data.message);
      }
    });
  };
  return (
    <>
      <PageContainer heading="IDM: Lifting Schedule" breadcrumbs={breadcrumbs}>
        <Paper className={classes.paper} elevation={3}>
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" justify="center" alignContent="center" spacing={5}>
              <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
                <Table className={classes.table} size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell> Order Number : {state.orderNumber} </TableCell>
                      <TableCell> Requested Date : {state.requestDate}</TableCell>
                      <TableCell> Customer Name : {state.customerName}</TableCell>
                      <TableCell> Note : {state.note}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <TableContainer component={Paper}>
                  <Table className={classes.table} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Info</TableCell>
                        <TableCell>Purchase Type</TableCell>
                        <TableCell>No of Drum</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>No Of Drum (Remaining)</TableCell>
                        <TableCell>Quantity (Remaining)</TableCell>
                        <TableCell>{`Date & Time`}</TableCell>
                        <TableCell>No of Drum</TableCell>
                        <TableCell>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {liftingInfo.map(record => (
                        <TableRow key={record.id}>
                          <TableCell>{`${record.productName}-${record.productGradeName}`}</TableCell>
                          <TableCell>{record.purchaseTypeName}</TableCell>
                          <TableCell>{record.numberOfDrumFinal}</TableCell>
                          <TableCell>{record.quantityFinal}</TableCell>
                          <TableCell>{record.unitName}</TableCell>
                          <TableCell>{record.numberOfDrumDue}</TableCell>
                          <TableCell>{record.quantityDue}</TableCell>
                          <TableCell>
                            <DateTimePicker
                              minDate={state.requestDate}
                              format="DD-MM-yyyy hh:mm a"
                              name="requestDateTime"
                              value={record.requestDateTime}
                              onChange={e => {
                                handleDateChange(record.key, e);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled={record.numberOfDrumFinal === 0}
                              //type="number"
                              name="liftingDrum"
                              value={record.liftingDrum}
                              //inputProps={{ min: 0, max: record.numberOfDrumDue }}
                              onChange={e => {
                                handleInputChange(record.key, e);
                                handleConvertion(record.key, e);
                              }}
                              onFocus={e => {
                                e.target.select();
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled={record.numberOfDrumFinal > 0}
                              //type="number"
                              name="liftingQuantity"
                              value={record.liftingQuantity}
                              //inputProps={{ min: 0, max: record.quantityDue }}
                              onChange={e => {
                                handleInputChange(record.key, e);
                                handleQueantityChange(record.key, e);
                              }}
                              onFocus={e => {
                                e.target.select();
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
                <Box display="flex">
                  <Box ml={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isLastLiftingSchedule"
                          checked={createMultipleLs}
                          onChange={e => {
                            setCreateMultipleLs(e.target.checked);
                          }}
                        />
                      }
                      label="Create Multiple?"
                    />
                  </Box>
                  <Box ml={2}>
                    <Button size="small" type="submit" variant="outlined" color="primary">
                      Submit
                    </Button>
                  </Box>
                  <Box ml={2}>
                    <NavLink to="/orders/list">
                      <Button size="small" variant="outlined" color="primary">
                        Cancel
                      </Button>
                    </NavLink>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
          <NotificationContainer />
        </Paper>
      </PageContainer>
    </>
  );
}
