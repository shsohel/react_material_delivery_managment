import Notification from '@jumbo/components/Notification/Notification';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { entryPermits } from '@jumbo/constants/PermissionsType';
import { reportType } from '@jumbo/constants/reportTypes';
import { CancelIcon, PrintIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import {
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
import Box from '@material-ui/core/Box';
import { blue } from '@material-ui/core/colors';
import { FilterListSharp, Print, Search } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Pagination } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import Moment from 'moment';
import PropTypes from 'prop-types';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import EntryPermitCancelForm from './EntryPermitCancelForm';
import EntryPermitView from './EntryPermitView';
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
    marginLeft: theme.spacing(3),
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
  { label: 'Lifting Schedules', link: '/schedules/list' },
  { label: 'Entry Permits', link: '/permits/entry-permit-list', isActive: true }
];

const { REACT_APP_REPORT_URL } = process.env;

const EntryPermitLiftingData = props => {
  const classes = useRowStyles();
  const { userPermission } = useSelector(({ auth }) => auth);
  const { authUser } = useSelector(({ auth }) => auth);
  const { row, getAllEntryPermits } = props;
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [recordForDetails, setrecordForDetails] = useState(null);

  const closePopup = () => {
    getAllEntryPermits();
    setrecordForDetails(null);
    setOpenPopup(false);
  };

  const onCancel = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    const data = {
      key: key,
      isCancel: true,
      isDeleted: false
    };
    axios
      .delete(`${urls_v1.entryPermit.delete}/${key}`, { data: data })
      .then(({ data }) => {
        if (data.succeeded) {
          setNotify({
            isOpen: true,
            message: 'Delete Successfully',
            type: 'error'
          });
          closePopup();
        }
      })
      .catch(err => {
        setNotify({
          isOpen: true,
          message: 'Something Wrong!!!',
          type: 'error'
        });
      });
  };
  const [itemForCancel, setItemForCancel] = useState(null);
  const [isCancelFromOpen, setIsCancelFromOpen] = useState(false);

  const openCancelPopup = key => {
    console.log(key);
    setItemForCancel(key);
    setIsCancelFromOpen(true);
  };

  const closeCancelPopup = () => {
    getAllEntryPermits();
    setIsCancelFromOpen(false);
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    const data = {
      key: key,
      isCancel: false,
      isDeleted: true
    };
    axios
      .delete(`${urls_v1.entryPermit.delete}/${key}`, { data: data })
      .then(({ data }) => {
        if (data.succeeded) {
          setNotify({
            isOpen: true,
            message: 'Delete Successfully',
            type: 'error'
          });
          closePopup();
        }
      })
      .catch(err => {
        setNotify({
          isOpen: true,
          message: 'Something Wrong!!!',
          type: 'error'
        });
      });
  };

  const entryPermitPreview = async entryPermitKey => {
    if (entryPermitKey) {
      axios.get(`${urls_v1.entryPermit.get_by_key}/${entryPermitKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setrecordForDetails(body);
          setOpenPopup(true);
        }
      });
    }
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.orderNumber}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.customerName}
        </TableCell>
        <TableCell>
          {row.productName}({row.productGradeName})
        </TableCell>
        <TableCell>{row.purchaseTypeName}</TableCell>
        <TableCell>{Moment(row.liftingDate).format('DD-MMM-yyyy')}</TableCell>
        <TableCell>{row.numberOfDrum}</TableCell>
        <TableCell>
          {row.liftingQuantity} / {row.unitName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} style={{ backgroundColor: 'white' }} timeout="auto" unmountOnExit>
            <Box component="div" margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Entry Permits
              </Typography>
              <Table size="small" aria-label="lifting">
                <TableHead>
                  <TableRow>
                    <TableCell>Permit No</TableCell>
                    <TableCell>Entry Date</TableCell>
                    <TableCell>Transport No</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.entryPermits.map(item => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.permitNumber}
                      </TableCell>
                      <TableCell>{Moment(item.entryDateAndTime).format('DD-MMM-yyyy')}</TableCell>
                      <TableCell>{item.transportNumber}</TableCell>
                      <TableCell align="center">
                        <>
                          {item.isCompleted ? (
                            ''
                          ) : item.isEntryConfirm ? (
                            ''
                          ) : item.isCancel ? (
                            <div>Canceled</div>
                          ) : (
                            <>
                              {userPermission?.includes(entryPermits.DELETE) && (
                                <CancelIcon
                                  title="Cancel Entry Permit"
                                  placement="top"
                                  onClick={() => {
                                    openCancelPopup(item.key);
                                  }}
                                />
                              )}
                            </>
                          )}
                          <ViewIcon
                            title="View Entry Permit"
                            placement="top"
                            onClick={() => {
                              entryPermitPreview(item.key);
                            }}
                          />
                          {userPermission?.includes(entryPermits.PRINT) && !item.isCompleted ? (
                            <PrintIcon
                              title="Print"
                              placement="top"
                              onClick={() => {
                                window.open(
                                  `${REACT_APP_REPORT_URL}/${reportType.ENTRY_PERMIT}/${item.key}/${authUser.id}`,
                                  '_blank'
                                );
                              }}
                            />
                          ) : null}
                        </>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Controls.Popup title="Entry Permit Details" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <EntryPermitView closePopup={closePopup} recordForDetails={recordForDetails} />
      </Controls.Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <Controls.Popup title="Cancel Entry Permit " openPopup={isCancelFromOpen} setOpenPopup={setIsCancelFromOpen}>
        <EntryPermitCancelForm closePopup={closeCancelPopup} itemForCancel={itemForCancel} entryPermit />
      </Controls.Popup>
      <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </React.Fragment>
  );
};

EntryPermitLiftingData.propTypes = {
  row: PropTypes.shape({
    orderNumber: PropTypes.string,
    customerName: PropTypes.string,
    productName: PropTypes.string,
    purchaseTypeName: PropTypes.string,
    liftingDate: PropTypes.string,
    numberOfDrum: PropTypes.number,
    liftingQuantity: PropTypes.number,
    unitName: PropTypes.string
  }).isRequired
};

const headCells = [
  { id: 'OrderId', label: 'Order No' },
  { id: 'CustomerName', label: 'Customer' },
  { id: 'ProductName', label: 'Product' },
  { id: 'PurchaseTypeName', label: 'Packaging Type' },
  { id: 'LiftingDate', label: 'Lifting Date' },
  { id: 'TotalDrums', label: 'Total Drums', disableSorting: true },
  { id: 'actions', label: 'Total Quantity', disableSorting: true }
];

export default function EntryList(props) {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const [entryList, setEntryList] = useState([]);
  const urlConstant = 'VehicleList.pdf';

  const [isFilter, setIsFilter] = useState(false);

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const [filterbyPermitNo, setFilterbyPermitNo] = useState('');
  const [filterByCustomer, setFilterByCustomer] = useState('');
  const [filterByTransfortNo, setFilterByTransfortNo] = useState('');
  const [filterByPermitDate, setFilterByPermitDate] = useState({
    permitFromDate: '',
    permitToDate: ''
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

  const getAllEntryPermits = async () => {
    const queryParam = new URLSearchParams(props.location.search).get('LiftingId');

    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (queryParam) {
      filterBody.LiftingId = queryParam;
    }
    if (filterbyPermitNo !== '') {
      filterBody.PermitNo = filterbyPermitNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }
    if (filterByTransfortNo !== '') {
      filterBody.TransportNo = filterByTransfortNo;
    }

    if (filterByPermitDate.permitFromDate !== '') {
      filterBody.PermitFromDate = Moment(filterByPermitDate.permitFromDate).format('yy-MM-DD');
    }
    if (filterByPermitDate.permitToDate !== '') {
      filterBody.PermitToDate = Moment(filterByPermitDate.permitToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.entryPermit.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setDataLength(data.totalNoOfRow);
          setEntryList(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleFromDateChange = date => {
    setSelectedDate({ ...selectedDate, fromDate: date });
    setFilterByPermitDate({
      ...filterByPermitDate,
      permitFromDate: Moment(date).format('yy-MM-DD')
    });
  };
  const handleToDateChange = date => {
    setSelectedDate({ ...selectedDate, toDate: date });
    setFilterByPermitDate({
      ...filterByPermitDate,
      permitToDate: Moment(date).format('yy-MM-DD')
    });
  };

  useEffect(() => {
    getAllEntryPermits();
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const handleSearch = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (filterbyPermitNo !== '') {
      filterBody.PermitNo = filterbyPermitNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }
    if (filterByTransfortNo !== '') {
      filterBody.TransportNo = filterByTransfortNo;
    }

    if (filterByPermitDate.permitFromDate !== '') {
      filterBody.PermitFromDate = Moment(filterByPermitDate.permitFromDate).format('yy-MM-DD');
    }
    if (filterByPermitDate.permitToDate !== '') {
      filterBody.PermitToDate = Moment(filterByPermitDate.permitToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.entryPermit.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setDataLength(data.totalNoOfRow);
          setEntryList(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleReset = async () => {
    setFilterByCustomer('');
    setFilterbyPermitNo('');
    setFilterByTransfortNo('');
    setFilterByPermitDate({
      permitFromDate: '',
      permitToDate: ''
    });
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    try {
      await axios.get(`${urls_v1.entryPermit.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setDataLength(data.totalNoOfRow);
          setEntryList(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer heading="Entry Permits" breadcrumbs={breadcrumbs}>
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
                    pathname: '/permits/entry-permit-list'
                  });
                }}
                endIcon={<List />}>
                Full List
              </Button>
            </Box>
          </Grid> */}
          <Grid item xs container justify="flex-end">
            <Box className={classes.filterBox}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  window.open(
                    `${REACT_APP_REPORT_URL}/${reportType.DAILY_ENTRY_PERMIT_LIST}/${authUser.id}/${urlConstant}`,
                    '_blank'
                  );
                }}
                endIcon={<Print />}>
                Print
              </Button>
            </Box>
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
            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
              <TextField
                size="small"
                label="Permit No"
                variant="outlined"
                value={filterbyPermitNo}
                onChange={e => {
                  setFilterbyPermitNo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
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
            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
              <TextField
                size="small"
                label="Transport No"
                variant="outlined"
                value={filterByTransfortNo}
                onChange={e => {
                  setFilterByTransfortNo(e.target.value);
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
                  {entryList.map(row => (
                    <EntryPermitLiftingData
                      key={row.id}
                      row={row}
                      propsRoute={props}
                      getAllEntryPermits={getAllEntryPermits}
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
  );
}
