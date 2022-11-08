import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { liftingSchedules, orders } from '@jumbo/constants/PermissionsType';
import { ConfirmIcon, DeleteIcon, EditIcon, SettingsIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
import {
  Box,
  Button,
  FormControl,
  Grid,
  LinearProgress,
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
import { FilterListSharp, Search } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import Notification from '../../../Notification/Notification';
import ApproveOrderQuantity from '../ApproveOrderQuantity';
import OrderPreview from '../OrderPreview';

const useStyles = makeStyles(theme => ({
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
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
  { label: 'Requested Orders', link: '/orders/requested-orders', isActive: true }
];

const headCells = [
  { id: 'OrderNumber', label: 'Order Number' },
  { id: 'RequestDateAndTime', label: 'Request Date' },
  { id: 'CustomerName', label: 'Customer' },
  { id: 'note', label: 'Note', disableSorting: true },
  { id: 'schedules', label: 'Schedules', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function RequestedOrderList(props) {
  const classes = useStyles();
  const { userPermission } = useSelector(({ auth }) => auth);

  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [recordForDetails, setrecordForDetails] = useState(null);
  const [openPreviewPopup, setOpenPreviewPopup] = useState(false);

  const [recordForQtyApprove, setRecordForQtyApprove] = useState(null);
  const [openQtyApprovePopup, setOpenQtyApprovePopup] = useState(false);

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const [isFilter, setIsFilter] = useState(false);

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');
  const [filterByOrderNo, setFilterByOrderNo] = useState('');
  const [filterByCustomer, setFilterByCustomer] = useState('');
  const [filterByRequestedDate, setFilterByRequestedDate] = useState({
    orderFromDate: '',
    orderToDate: ''
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

  const getAllOrders = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    if (filterByOrderNo !== '') {
      filterBody.OrderNumber = filterByOrderNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }

    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderFromDate = Moment(filterByRequestedDate.orderFromDate).format('yy-MM-DD');
    }
    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderToDate = Moment(filterByRequestedDate.orderToDate).format('yy-MM-DD');
    }

    try {
      await axios.get(`${urls_v1.order.get_all}?${qs.stringify(filterBody)}`).then(res => {
        setRecords(res.data.data);
        setDataLength(res.data.totalNoOfRow);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleFromDateChange = date => {
    setSelectedDate({ ...selectedDate, fromDate: date });
    setFilterByRequestedDate({
      ...filterByRequestedDate,
      orderFromDate: Moment(date).format('yy-MM-DD')
    });
  };
  const handleToDateChange = date => {
    setSelectedDate({ ...selectedDate, toDate: date });
    setFilterByRequestedDate({
      ...filterByRequestedDate,
      orderToDate: Moment(date).format('yy-MM-DD')
    });
  };

  const handleReset = async () => {
    setFilterByCustomer('');
    setFilterByOrderNo('');
    setFilterByRequestedDate({
      orderFromDate: '',
      orderToDate: ''
    });
    /// After Filter State is empty
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    try {
      await axios.get(`${urls_v1.order.get_all}?${qs.stringify(filterBody)}`).then(res => {
        setRecords(res.data.data);
        setDataLength(res.data.totalNoOfRow);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const handleSearch = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (filterByOrderNo !== '') {
      filterBody.OrderNumber = filterByOrderNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }
    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderFromDate = Moment(filterByRequestedDate.orderFromDate).format('yy-MM-DD');
    }
    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderToDate = Moment(filterByRequestedDate.orderToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.order.get_all}?${qs.stringify(filterBody)}`).then(res => {
        setRecords(res.data.data);
        setDataLength(res.data.totalNoOfRow);
      });
    } catch (e) {
      console.log(e);
    }
  };

  //This is for Both Insert and update savePurchaseType
  const closePopup = () => {
    setrecordForDetails(null);
    setOpenPreviewPopup(false);
  };

  const closeApproveQtyPopup = () => {
    // setRecordForQtyApprove(null);
    setOpenQtyApprovePopup(false);
    getAllOrders();
  };

  const PreviewOrder = key => {
    if (key) {
      axios.get(`${urls_v1.order.get_by_key}/${key}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setrecordForDetails(body);
          setOpenPreviewPopup(true);
        } else {
          NotificationManager.error('Something went wrong!!!!');
        }
      });
    }
  };

  const ApproveOrderQty = key => {
    if (key) {
      axios.get(`${urls_v1.order.get_by_key}/${key}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          const isConfirmedOrder = body.orderDetails.every(item => item.quantityFinal > 0);
          if (isConfirmedOrder) {
            NotificationManager.warning('You have this operation before. Please contact with admin.');
          } else {
            setRecordForQtyApprove(body);
            setOpenQtyApprovePopup(true);
          }
        } else {
          NotificationManager.error('Something went wrong!!!!');
        }
      });
    }
  };

  const onEdit = orderKey => {
    props.history.replace('/orders/edit', { orderKey });
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios
      .delete(`${urls_v1.order.delete}/${key}`)
      .then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success('Order Deleted!!!');
          getAllOrders();
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

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <>
        <TableContainer className={classes.tContrainer} component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
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
              {records.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.orderNumber}</TableCell>
                  <TableCell>{Moment(record.requestDate).format('DD-MMM-yyyy')}</TableCell>
                  <TableCell>{record.customerName}</TableCell>
                  <TableCell>{record.note}</TableCell>
                  <TableCell>
                    {!record.isLiftingScheduleCompleted && record.isQuantityConfirmed
                      ? userPermission?.includes(liftingSchedules.CREATE) && (
                          <SettingsIcon
                            title="Manage Schedule"
                            placement="top"
                            onClick={() => {
                              props.history.push('manage-schedule', record.key);
                            }}
                          />
                        )
                      : userPermission?.includes(liftingSchedules.VIEW) && (
                          <ViewIcon
                            title="View Schedule"
                            placement="top"
                            onClick={() => {
                              props.history.replace('/schedules/list');
                            }}
                          />
                        )}
                  </TableCell>
                  <TableCell>
                    <>
                      {userPermission?.includes(orders.EDIT) && (
                        <EditIcon
                          title="Edit Order"
                          placement="top"
                          onClick={() => {
                            onEdit(record.key);
                          }}
                        />
                      )}
                      {userPermission?.includes(orders.DELETE) && (
                        <DeleteIcon
                          title="Delete Order"
                          placement="top"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure to delete this record?',
                              subTitle: "You cann't undo this operation",
                              onConfirm: () => {
                                onDelete(record.key);
                              }
                            });
                          }}
                        />
                      )}
                      <ViewIcon
                        title="View Order Details"
                        placement="top"
                        onClick={() => {
                          PreviewOrder(record.key);
                        }}
                      />
                      {!record.isQuantityConfirmed ? (
                        <ConfirmIcon
                          title="Confirm Order"
                          placement="top"
                          onClick={() => {
                            ApproveOrderQty(record.key);
                          }}
                        />
                      ) : null}
                    </>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      </>
    );
  } else {
    tableContent = <LinearProgress color="primary" />;
  }
  return (
    <PageContainer heading="Orders" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <div className={classes.mainDiv}>
        <Grid container>
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
                value={filterByOrderNo}
                onChange={e => {
                  setFilterByOrderNo(e.target.value);
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
              <Button
                type="Submit"
                className={classes.searchButton}
                variant="outlined"
                endIcon={<Search />}
                onClick={handleSearch}>
                Search
              </Button>
              <Button className={classes.searchButton} variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </Grid>
          </Grid>
        )}

        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>

        <Controls.Popup title="Details" openPopup={openPreviewPopup} setOpenPopup={setOpenPreviewPopup}>
          <OrderPreview closePopup={closePopup} recordForDetails={recordForDetails} />
        </Controls.Popup>

        <Controls.Popup title="Quantity Approve" openPopup={openQtyApprovePopup} setOpenPopup={setOpenQtyApprovePopup}>
          <ApproveOrderQuantity closePopup={closeApproveQtyPopup} recordForQtyApprove={recordForQtyApprove} />
        </Controls.Popup>

        <Notification notify={notify} setNotify={setNotify} />

        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
