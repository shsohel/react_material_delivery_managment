import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { invoices } from '@jumbo/constants/PermissionsType';
import { reportType } from '@jumbo/constants/reportTypes';
import { PrintIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import { thousands_separators } from '@jumbo/utils/commonHelper';
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
import { Add, FilterListSharp, Search } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from '../../../../../services/auth/jwt/config';
import InvoiceView from './InvoiceView';
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
  { id: 'InvoiceNumber', label: 'Invoice No' },
  { id: 'CustomerName', label: 'Customer' },
  { id: 'CustomerBINNo', label: 'BIN No', disableSorting: true },
  { id: 'InvoiceDate', label: 'Invoice Date', disableSorting: true },
  { id: 'PerUnitPrice', label: 'Unit Price', disableSorting: true },
  { id: 'VatPercent', label: 'VAT', disableSorting: true },
  { id: 'TotalPriceWithoutVAT', label: 'Price Without VAT', disableSorting: true },
  { id: 'TotalPriceWithVAT', label: 'Price With VAT', disableSorting: true },
  { id: 'TotalVATAmount', label: 'Total Vat Ammount', disableSorting: true },
  { id: 'action', label: 'Action' }
];

export default function UnitList() {
  const { REACT_APP_REPORT_URL } = process.env;
  const classes = useStyles();
  const { userPermission } = useSelector(({ auth }) => auth);
  const { authUser } = useSelector(({ auth }) => auth);

  const [records, setRecords] = useState(null);
  const [InvoiceDetails, setInvoiceDetails] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const [isFilter, setIsFilter] = useState(false);

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const [filterByInvoiceNo, setFilterByInvoiceNo] = useState('');
  const [filterByCustomer, setFilterByCustomer] = useState('');
  const [filterByPermitDate, setFilterByPermitDate] = useState({
    fromDate: '',
    toDate: ''
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

  const getAllInvoices = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (filterByInvoiceNo !== '') {
      filterBody.InvoiceNo = filterByInvoiceNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }

    if (filterByPermitDate.fromDate !== '') {
      filterBody.FromDate = Moment(filterByPermitDate.fromDate).format('yy-MM-DD');
    }
    if (filterByPermitDate.invoiceToDate !== '') {
      filterBody.ToDate = Moment(filterByPermitDate.invoiceToDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.sales.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setRecords(body);
          setDataLength(data.totalNoOfRow);
          setIsLoaded(true);
        } else {
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
      fromDate: Moment(date).format('yy-MM-DD')
    });
  };
  const handleToDateChange = date => {
    setSelectedDate({ ...selectedDate, toDate: date });
    setFilterByPermitDate({
      ...filterByPermitDate,
      toDate: Moment(date).format('yy-MM-DD')
    });
  };

  useEffect(() => {
    getAllInvoices();
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const handleReset = async () => {
    setFilterByCustomer('');
    setFilterByInvoiceNo('');
    setFilterByPermitDate({
      fromDate: '',
      toDate: ''
    });

    ///call another
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    try {
      await axios.get(`${urls_v1.sales.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setRecords(body);
          setDataLength(data.totalNoOfRow);
          setIsLoaded(true);
        } else {
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleSearch = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    if (filterByInvoiceNo !== '') {
      filterBody.InvoiceNo = filterByInvoiceNo;
    }
    if (filterByCustomer !== '') {
      filterBody.CustomerName = filterByCustomer;
    }

    if (filterByPermitDate.fromDate !== '') {
      filterBody.fromDate = Moment(filterByPermitDate.fromDate).format('yy-MM-DD');
    }
    if (filterByPermitDate.toDate !== '') {
      filterBody.toDate = Moment(filterByPermitDate.toDate).format('yy-MM-DD');
    }
    try {
      await axios.get(`${urls_v1.sales.get_all}?${qs.stringify(filterBody)}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setRecords(body);
          setDataLength(data.totalNoOfRow);
          setIsLoaded(true);
        } else {
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const PreviewOrder = invoiceNumber => {
    if (invoiceNumber) {
      axios.get(`${urls_v1.sales.get_by_invoiceno}/${invoiceNumber}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;

          setInvoiceDetails(body);
          setOpenPopup(true);
        }
      });
    }
  };
  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <>
        <TableContainer className={classes.tContrainer} component={Paper}>
          <Table size="small" className={classes.table}>
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
              {records.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{record.invoiceNumber}</TableCell>
                  <TableCell>{record.customerName}</TableCell>
                  <TableCell>{record.customerBINNo}</TableCell>
                  <TableCell>{Moment(record.invoiceDate).format('DD-MMM-yyyy')}</TableCell>
                  <TableCell>{thousands_separators(record.perUnitPrice.toFixed(2))}</TableCell>
                  <TableCell>{`${record.vatPercent.toFixed(2)}%`}</TableCell>
                  <TableCell>{thousands_separators(record.totalPriceWithoutVAT.toFixed(2))}</TableCell>
                  <TableCell>{thousands_separators(record.totalPriceWithVAT.toFixed(2))}</TableCell>
                  <TableCell>{thousands_separators(record.totalVATAmount.toFixed(2))}</TableCell>
                  <TableCell>
                    <>
                      <ViewIcon
                        title="View Invoice Details"
                        placement="top"
                        onClick={() => {
                          PreviewOrder(record.invoiceNumber);
                        }}
                      />
                      <PrintIcon
                        title="Print"
                        placement="top"
                        onClick={() => {
                          window.open(
                            `${REACT_APP_REPORT_URL}/${reportType.INVOICE}/${record.key}/${authUser.id}`,
                            '_blank'
                          );
                        }}
                      />
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
    <PageContainer heading="Invoices">
      <div className={classes.mainDiv}>
        <Grid container>
          <Grid xs item>
            {userPermission?.includes(invoices.CREATE) && (
              <NavLink to="/sales/invoice-new">
                <Button variant="outlined" color="primary" size="small" endIcon={<Add />}>
                  New
                </Button>
              </NavLink>
            )}
          </Grid>
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
                label="Invoice No"
                variant="outlined"
                value={filterByInvoiceNo}
                onChange={e => {
                  setFilterByInvoiceNo(e.target.value);
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
              <Box display="flex">
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
                onClick={() => {
                  handleSearch();
                }}
                className={classes.searchButton}
                variant="outlined"
                endIcon={<Search />}>
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

        <Controls.Popup title="Invoice Details" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <InvoiceView InvoiceDetails={InvoiceDetails} />
        </Controls.Popup>
      </div>
    </PageContainer>
  );
}
