import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { exitPermits } from '@jumbo/constants/PermissionsType';
import { reportType } from '@jumbo/constants/reportTypes';
import { PrintIcon } from '@jumbo/controls/ActionButtons';
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
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';

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

const headCells = [
  { id: 'ExitPermitSerialNumber', label: 'Exit Permit Number' },
  { id: 'CustomerName', label: 'Customer' },
  { id: 'ProductGradeName', label: 'Product Info' },
  { id: 'PurchaseTypeName', label: 'Packinging Type' },
  { id: 'numberOfDrum', label: 'No. of Drum', disableSorting: true },
  { id: 'actualQuantity', label: 'Quantity', disableSorting: true },
  { id: 'totalPriceWithVAT', label: 'Total Price', disableSorting: true },
  { id: 'TransportNumber', label: 'Transport Number', disableSorting: true },
  { id: 'action', label: 'Action', disableSorting: true }
];

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Orders', link: '/orders/list' },
  { label: 'Lifting Schedules', link: '/schedules/list' },
  { label: 'Exit Permits', link: '/permits/exit-permit-list', isActive: true }
];

export default function ExitPermitList() {
  const { REACT_APP_REPORT_URL } = process.env;
  const classes = useStyles();
  const [isFilter, setIsFilter] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');
  const [recordForDetails, setrecordForDetails] = useState(null);

  const { userPermission } = useSelector(({ auth }) => auth);
  const { authUser } = useSelector(({ auth }) => auth);

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

  const getAllExitPermits = async () => {
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
      filterBody.FromDate = Moment(filterByPermitDate.permitFromDate).format('yy-MM-DD');
    }
    if (filterByPermitDate.permitToDate !== '') {
      filterBody.ToDate = Moment(filterByPermitDate.permitToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.exitPermit.get_all}?${qs.stringify(filterBody)}`).then(res => {
        const dataArray = res.data.data;
        setRecords(dataArray);
        setDataLength(res.data.totalNoOfRow);
        setIsLoaded(true);
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
    getAllExitPermits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  //This is for Both Insert and update
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
      filterBody.FromDate = Moment(filterByPermitDate.permitFromDate).format('yy-MM-DD');
    }
    if (filterByPermitDate.permitToDate !== '') {
      filterBody.ToDate = Moment(filterByPermitDate.permitToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.exitPermit.get_all}?${qs.stringify(filterBody)}`).then(res => {
        const exitPermitList = res.data.data.filter(item => item.isCompleted);
        setRecords(exitPermitList);
        setDataLength(exitPermitList.length);
        setIsLoaded(true);
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
      await axios.get(`${urls_v1.exitPermit.get_all}?${qs.stringify(filterBody)}`).then(res => {
        const dataArray = res.data.data;
        setRecords(dataArray);
        setDataLength(res.data.totalNoOfRow);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const exitPermitPreview = async exitPermitKey => {
    if (exitPermitKey) {
      axios.get(`${urls_v1.exitPermit.get_by_key}/${exitPermitKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;

          setrecordForDetails(body);
          setOpenPopup(true);
        } else {
        }
      });
    }
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
                  <TableCell>{record.exitPermitSerialNumber}</TableCell>
                  <TableCell>{record.customerName}</TableCell>
                  <TableCell>{`${record.productName} (${record.productGradeName})`}</TableCell>
                  <TableCell>{record.purchaseTypeName}</TableCell>
                  <TableCell>{record.numberOfDrum}</TableCell>
                  <TableCell>{record.actualQuantity.toFixed(3)}</TableCell>
                  <TableCell>{record.totalPriceWithVAT.toFixed(2)}</TableCell>
                  <TableCell>{record.transportNumber}</TableCell>
                  <TableCell>
                    {/* <ViewIcon
                      title="View Exit Permit"
                      placement="top"
                      onClick={() => {
                        exitPermitPreview(record.key);
                      }}
                    /> */}
                    {userPermission?.includes(exitPermits.PRINT) && (
                      <PrintIcon
                        title="Print"
                        placement="top"
                        onClick={() => {
                          window.open(
                            `${REACT_APP_REPORT_URL}/${reportType.EXIT_PERMIT}/${record.key}/${authUser.id}`,
                            '_blank'
                          );
                        }}
                      />
                    )}
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
    <PageContainer heading="Exit Permits" breadcrumbs={breadcrumbs}>
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
            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
              <TextField
                size="small"
                label="Permit No"
                variant="outlined"
                value={filterbyPermitNo}
                onChange={e => {
                  setFilterbyPermitNo(e.target.value);
                }}
                onFocus={e => {
                  e.target.select();
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
                onFocus={e => {
                  e.target.select();
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
                onFocus={e => {
                  e.target.select();
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
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
      </div>
    </PageContainer>
  );
}
