import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { entryPermits, liftingSchedules } from '@jumbo/constants/PermissionsType';
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import {
  Box,
  Button,
  Collapse,
  fade,
  FormControl,
  Grid,
  IconButton,
  lighten,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { FilterListSharp, Search } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Pagination } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import Moment from 'moment';
import PropTypes from 'prop-types';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../../services/auth/jwt/config';
import Notification from '../../Notification/Notification';
import EditLiftingSchedule from './EditLiftingSchedule';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  table: {
    backgroundColor: fade(blue['500'], 0.1),
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr': {
      fontWeight: 'bold',
      backgroundColor: fade('#C6C6C6', 0.1),
      fontStyle: 'oblique'
    },
    '& tbody tr:hover': {
      backgroundColor: fade('#C76300', 0.1),
      cursor: 'pointer'
    },
    '& tbody tr:active': {
      backgroundColor: '#FF8C00'
    },
    '& table thead th': {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      cursor: 'pointer'
    },
    '& table tbody tr': {
      fontWeight: 'bold',
      fontStyle: 'normal',
      backgroundColor: fade(theme.palette.warning.main, 0.15),
      color: theme.palette.success.main
    }
  },

  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },

  filterBox: {
    marginBottom: theme.spacing(3),
    fontWeight: 'bold'
  },
  dateBox: {
    fontWeight: 'bold',
    marginRight: theme.spacing(3)
  },
  searchButton: {
    marginLeft: theme.spacing(3)
  },
  tContrainer: {
    marginBottom: theme.spacing(3)
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Orders', link: '/orders/list' },
  { label: 'Lifting Schedules', link: '/schedules/list', isActive: true },
  { label: 'Entry Permits', link: '/permits/entry-permit-list' }
];

const LiftingOrderDetailsData = props => {
  const { row, sl, getAllLiftingSchedules, url } = props;

  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const classes = useRowStyles();

  const { userPermission } = useSelector(({ auth }) => auth);

  const makeEntryPermit = async key => {
    if (key) {
      await axios.get(`${urls_v1.entryPermit.get_by_ls_key}/${key}`).then(({ data }) => {
        if (data.succeeded) {
          const sdata = data.data;
          if ((sdata.liftingQuantityDue !== 0 && sdata.numberOfDrumDue === 0) || sdata.numberOfDrumDue !== 0) {
            props.propsRoute.history.replace('/permits/entry', key);
          } else {
            alert('Entry Permit created already!!!');
          }
        }
      });
    }
  };
  const onEdit = async lsKey => {
    await axios.get(`${urls_v1.liftingSchedule.get_for_ls_edit}/${lsKey}`).then(({ data }) => {
      if (data.succeeded) {
        setRecordForEdit(data.data);
        setOpenPopup(true);
      } else {
        setNotify({
          isOpen: true,
          message: 'Entry permit already created. Please delete first your entry permit',
          type: 'error'
        });
      }
    });
  };

  const closePopup = () => {
    getAllLiftingSchedules();
    setOpenPopup(false);
  };
  const onDelete = lsKey => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios
      .delete(`${urls_v1.liftingSchedule.delete}/${lsKey}`)
      .then(({ data }) => {
        if (data.succeeded) {
          setNotify({
            isOpen: true,
            message: 'Delete Successfully',
            type: 'error'
          });
          getAllLiftingSchedules();
        }
      })
      .catch(err => {
        setNotify({
          isOpen: true,
          message: 'Something Wrong!!!',
          type: 'error'
        });
      });
    setNotify({
      isOpen: true,
      message: 'Delete Successfully',
      type: 'error'
    });
  };

  return (
    <>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {sl}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.orderNumber}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.customerName}
        </TableCell>
        <TableCell>{Moment(row.requestDate).format('DD-MMM-yyyy')}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} style={{ backgroundColor: 'white' }} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Lifting Schedule
              </Typography>
              <Table size="small" aria-label="lifting">
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Packaging Type</TableCell>
                    <TableCell>{`Date`}</TableCell>
                    <TableCell>Number of Drum</TableCell>
                    <TableCell>Lifting Qty</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell align="center">Entry Permit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.liftingSchedules.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.productGradeName}</TableCell>
                      <TableCell>{item.purchaseTypeName}</TableCell>
                      <TableCell>{Moment(item.liftingDate).format('DD-MMM-yyyy')}</TableCell>
                      <TableCell>{item.numberOfDrum}</TableCell>
                      <TableCell>
                        {item.liftingQuantity.toFixed(3)} ({item.unitName})
                      </TableCell>
                      <TableCell>
                        <>
                          {userPermission?.includes(liftingSchedules.EditLiftingSchedule) && (
                            <EditIcon
                              title="Edit Schedule"
                              placement="top"
                              onClick={() => {
                                onEdit(item.key);
                              }}
                            />
                          )}
                          {userPermission?.includes(liftingSchedules.DELETE) && (
                            <DeleteIcon
                              title="Delete Schedule"
                              placement="top"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Are you sure to delete this record?',
                                  subTitle: "You cann't undo this operation",
                                  onConfirm: () => {
                                    onDelete(item.key);
                                  }
                                });
                              }}
                            />
                          )}
                          {item.isComplete && (
                            <ViewIcon
                              title="View Schedule"
                              placement="top"
                              onClick={() => {
                                url.replace({
                                  pathname: '/permits/entry-permit-list',
                                  search: `?LiftingId=${item.id}`
                                });
                              }}
                            />
                          )}
                        </>
                      </TableCell>
                      <TableCell align="center">
                        {item.isComplete
                          ? `Completed`
                          : userPermission?.includes(entryPermits.CREATE) && (
                              <AddIcon
                                title="Add Entry Permit"
                                placement="top"
                                onClick={() => {
                                  makeEntryPermit(item.key);
                                }}
                              />
                            )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Controls.Popup title="Modify Lifting Schedule" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <EditLiftingSchedule recordForEdit={recordForEdit} closePopup={closePopup} />
      </Controls.Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
};

LiftingOrderDetailsData.propTypes = {
  row: PropTypes.shape({
    orderNumber: PropTypes.string,
    customerName: PropTypes.string,
    requestDate: PropTypes.string
  }).isRequired
};

const headCells = [
  { id: 'SL', label: 'SL', disableSorting: true },
  { id: 'OrderNumber', label: 'Order No' },
  { id: 'CustomerName', label: 'Customer' },
  { id: 'RequestDate', label: 'Order Date' }
];

export default function LiftingScheduleList(props) {
  const classes = useStyles();
  const [liftingSchedule, setLiftingSchedule] = useState([]);

  const [isFilter, setIsFilter] = useState(false);

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const [filterbyOrderNo, setFilterbyOrderNo] = useState('');
  const [filterByCustomer, setFilterByCustomer] = useState('');
  const [filterByLiftingDate, setFilterByLiftingDate] = useState({
    liftingFromDate: '',
    liftingToDate: ''
  });

  const [selectedDate, setSelectedDate] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const handleChangePage = (event, pageNumber) => {
    setPage(pageNumber);
    setPageNumber(pageNumber);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleSortRequest = cellId => {
    const isAsc = sortedColumn === cellId && sortedBy === 'asc';
    setSortedBy(isAsc ? 'desc' : 'asc');
    setSortedColumn(cellId);
  };
  const getAllLiftingSchedules = async () => {
    const queryParam = new URLSearchParams(props.location.search).get('ordernumber');
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (queryParam) {
      filterBody.OrderNumber = queryParam;
    }
    if (filterbyOrderNo !== '') {
      filterBody.OrderNumber = filterbyOrderNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }

    if (filterByLiftingDate.liftingFromDate !== '') {
      filterBody.LiftingFromDate = Moment(filterByLiftingDate.liftingFromDate).format('yy-MM-DD');
    }
    if (filterByLiftingDate.liftingToDate !== '') {
      filterBody.LiftingToDate = Moment(filterByLiftingDate.liftingToDate).format('yy-MM-DD');
    }

    try {
      await axios.get(`${urls_v1.liftingSchedule.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setLiftingSchedule(body);
          setDataLength(data.totalNoOfRow);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFromDateChange = date => {
    setSelectedDate({ ...selectedDate, fromDate: date });
    setFilterByLiftingDate({
      ...filterByLiftingDate,
      liftingFromDate: Moment(date).format('yy-MM-DD')
    });
  };
  const handleToDateChange = date => {
    setSelectedDate({ ...selectedDate, toDate: date });
    setFilterByLiftingDate({
      ...filterByLiftingDate,
      liftingToDate: Moment(date).format('yy-MM-DD')
    });
  };

  useEffect(() => {
    getAllLiftingSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const handleSearch = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (filterbyOrderNo !== '') {
      filterBody.OrderNumber = filterbyOrderNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }

    if (filterByLiftingDate.liftingFromDate !== '') {
      filterBody.LiftingFromDate = Moment(filterByLiftingDate.liftingFromDate).format('yy-MM-DD');
    }
    if (filterByLiftingDate.liftingToDate !== '') {
      filterBody.LiftingToDate = Moment(filterByLiftingDate.liftingToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.liftingSchedule.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setLiftingSchedule(body);
          setDataLength(data.totalNoOfRow);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleReset = async () => {
    setFilterByCustomer('');
    setFilterbyOrderNo('');
    setFilterByLiftingDate({
      liftingFromDate: '',
      liftingToDate: ''
    });
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    try {
      await axios.get(`${urls_v1.liftingSchedule.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setLiftingSchedule(body);
          setDataLength(data.totalNoOfRow);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <PageContainer heading="Orders for Lifting Schedule" breadcrumbs={breadcrumbs}>
        <div className={classes.mainDiv}>
          <Grid container>
            {/* <Grid item xs container justify="flex-start">
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    props.history.replace({
                      pathname: '/schedules/list'
                    });
                  }}
                  endIcon={<List />}>
                  Full List
                </Button>
              </Box>
            </Grid> */}
            <Grid item xs container justify="flex-end">
              <Box className={classes.filterBox}>
                {!isFilter ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setIsFilter(true);
                    }}
                    endIcon={<FilterListSharp />}>
                    Filter
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setIsFilter(false);
                    }}
                    endIcon={<FilterListSharp />}>
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
          {isFilter && (
            <Grid container direction="row" spacing={4}>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <TextField
                  size="small"
                  label="Order No"
                  variant="outlined"
                  value={filterbyOrderNo}
                  onChange={e => {
                    setFilterbyOrderNo(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <TextField
                  size="small"
                  label="Customer"
                  variant="outlined"
                  value={filterByCustomer}
                  onChange={e => {
                    setFilterByCustomer(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
                <Box display="flex" title="Hello">
                  <Box>
                    <DatePicker
                      className={classes.dateBox}
                      inputVariant="outlined"
                      size="small"
                      label="From Date"
                      format="yyyy-MM-DD"
                      value={selectedDate.fromDate}
                      onChange={handleFromDateChange}
                      animateYearScrolling
                    />
                  </Box>
                  <Box>
                    <DatePicker
                      className={classes.dateBox}
                      inputVariant="outlined"
                      size="small"
                      label="To Date"
                      format="yyyy-MM-DD"
                      value={selectedDate.toDate}
                      onChange={handleToDateChange}
                      animateYearScrolling
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid container item xs={12} sm={6} md={3} lg={3} xl={3} justify="flex-end">
                <Button className={classes.searchButton} variant="outlined" endIcon={<Search />} onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  onClick={() => {
                    handleSearch();
                  }}
                  className={classes.searchButton}
                  variant="outlined"
                  endIcon={<Search />}>
                  Search
                </Button>
              </Grid>
            </Grid>
          )}
          <br />
          <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TableContainer component={Paper} className={classes.tContrainer}>
                <Table className={classes.table} size="small" aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {headCells.map(headCell => (
                        <TableCell key={headCell.id}>
                          {headCell.disableSorting ? (
                            headCell.label
                          ) : (
                            <TableSortLabel
                              active={sortedColumn === headCell.id}
                              direction={sortedColumn === headCell.id ? sortedBy : 'asc'}
                              onClick={() => {
                                handleSortRequest(headCell.id);
                              }}>
                              {headCell.label}
                            </TableSortLabel>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {liftingSchedule.map((row, index) => (
                      <LiftingOrderDetailsData
                        url={props.history}
                        key={row.id}
                        row={row}
                        propsRoute={props}
                        sl={index + 1}
                        getAllLiftingSchedules={getAllLiftingSchedules}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={4} justify="flex-start">
              <FormControl className={classes.formControl}>
                <Typography> Row Per Page : </Typography>
              </FormControl>
              <FormControl className={classes.formControl}>
                <Select id="select-label-row" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={8} justify="flex-end">
              <Pagination
                count={Math.ceil(dataLength / rowsPerPage)}
                variant="outlined"
                color="primary"
                onChange={handleChangePage}
                showFirstButton
                showLastButton
              />
            </Grid>
          </Grid>
        </div>
      </PageContainer>
    </>
  );
}
