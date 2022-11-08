import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { toastAlerts } from '@jumbo/utils/alerts';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  tableEntry: {
    '& thead th': {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
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
  searchBox: {
    width: '100%',
    backgroundColor: '#EDEDED'
  },
  searchButton: {
    width: '80%',
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: '#018786'
    }
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    marginBottom: 16,
    display: 'inline-block'
  }
}));
const breadcrumbs = [{ label: 'Refresh', link: '/security-check/exit' }];

export default function ExitConfirm(props) {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [exitSearch, setExitSearch] = useState('');
  const [exitSecurityCheck, setEntrySecurityCheck] = useState([]);
  const [searchVehicleList, setSearchVehicleList] = useState([]);
  const [open, setOpen] = useState(false);

  const getAllVehicleList = async () => {
    if (search === '') {
      console.log('s');
    } else {
      const body = {
        term: search
      };
      await axios.get(`${urls_v1.securityCheck.get_vehicle_no_for_exit_confirm}?${qs.stringify(body)}`).then(({ data }) => {
        if (data) {
          setSearchVehicleList(data.data);
        }
      });
    }
  };

  const getExitSecurityCheckList = async () => {
    let searchQuery = null;
    if (exitSearch === '' || exitSearch === null) {
      searchQuery = '%20';
    } else {
      searchQuery = exitSearch;
    }
    await axios.get(`${urls_v1.securityCheck.get_exit_list}/${searchQuery}`).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
        console.log(body);
        setEntrySecurityCheck(body);
      } else {
        toastAlerts('warning', data.message);
      }
    });
  };

  const handleSync = async () => {
    setOpen(true);
    await axios
      .post(urls_v1.order.order_sync)
      .then(({ data }) => {
        if (data.succeeded) {
          setOpen(false);
          toastAlerts('success', 'You have done full process successfully, please check your order status!');
        } else {
          console.log(data.message);
        }
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  const handleExitConfirm = async exitKey => {
    if (exitKey) {
      const exitConfirmPostbody = {
        exitPermitKey: exitKey
      };

      await axios
        .post(urls_v1.securityCheck.post_exit_confrim, exitConfirmPostbody)
        .then(({ data }) => {
          if (data.succeeded) {
            getExitSecurityCheckList();
            handleSync();
            toastAlerts('success', data.message);
          } else {
            toastAlerts('error', data.message);
          }
        })
        .catch(({ response }) => {
          toastAlerts('warning', response.data.Message);
        });
    }
  };
  useEffect(() => {
    getAllVehicleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  useEffect(() => {
    getExitSecurityCheckList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <PageContainer heading="Security Check: Exit" breadcrumbs={breadcrumbs}>
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={5}>
          <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" spacing={3}>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <h3> Search by Transport No </h3>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={7}>
              <Autocomplete
                className={classes.searchBox}
                id="combo-box-demo"
                size="small"
                options={searchVehicleList}
                getOptionLabel={option => option}
                onChange={(event, newValue) => {
                  setExitSearch(newValue);
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Searching"
                    size="small"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2}>
              <Button
                className={classes.searchButton}
                size="large"
                variant="outlined"
                color="primary"
                onClick={() => {
                  getExitSecurityCheckList();
                }}>
                Search{' '}
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <TableContainer component={Paper}>
              <Table className={classes.tableEntry} size="small" aria-label="lifting">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Exit Permit No</TableCell>
                    <TableCell>Packaging Type</TableCell>
                    <TableCell>Entry Date</TableCell>
                    <TableCell>Drums</TableCell>
                    <TableCell>Bulk Qty</TableCell>
                    <TableCell>Transport No</TableCell>
                    <TableCell>Licence No</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exitSecurityCheck?.map(item => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.customerName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.exitPermitSerialNumber}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {item.purchaseTypeName}
                      </TableCell>
                      <TableCell>{Moment(item.exitDateAndTime).format('DD-MMM-yyyy hh:mm A')}</TableCell>
                      <TableCell>{item.numberOfDrum}</TableCell>
                      <TableCell>
                        {item.actualQuantity.toFixed(3)} -{item.unitName}
                      </TableCell>
                      <TableCell>{item.transportNumber}</TableCell>
                      <TableCell>{item.licenceNumber}</TableCell>
                      <TableCell align="center">
                        {item.isSecurityChecked === false ? (
                          <Button
                            onClick={() => {
                              handleExitConfirm(item.key);
                            }}
                            variant="outlined"
                            size="small">
                            Confirm
                          </Button>
                        ) : (
                          <Box className={classes.badgeRoot} component="span" bgcolor="#8DCD03">
                            Checked Out
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Paper>
    </PageContainer>
  );
}
