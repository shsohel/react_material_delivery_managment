import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { reportType } from '@jumbo/constants/reportTypes';
import { Button, Grid, MenuItem, Paper, TextField } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { DatePicker } from '@material-ui/pickers';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from 'services/auth/jwt/config';
import AvailableStock from './AvailableStock';
import DailyDeliveryReport from './DailyDeliveryReport';
import MonthlyDeliveryReport from './MonthlyDeliveryReport';
import YearlyDeliveryReport from './YearlyDeliveryReport';

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
  textField: {
    minWidth: '95%',
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(6),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  }
}));
const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Reports', link: '', isActive: true }
];

const reportsTypes = [
  {
    value: 'Daily Bitumin Delivery',
    label: 'Daily Bitumin Delivery'
  },
  {
    value: 'Daily Lifting Schedule',
    label: 'Daily Lifting Schedule'
  },
  {
    value: 'Monthly Sales Register',
    label: 'Monthly Sales Register'
  },
  {
    value: 'Monthly Bitumin Delivery',
    label: 'Monthly Bitumin Delivery'
  },
  {
    value: 'Yearly Bitumin Delivery',
    label: 'Yearly Bitumin Delivery'
  },
  {
    value: 'Price History',
    label: 'Price History'
  },
  {
    value: 'Print Vehicle History',
    label: 'Print Vehicle History'
  }
];
const yearTypes = [
  {
    value: 'Calender Year',
    label: 'Calender Year'
  },
  {
    value: 'Financial Year',
    label: 'Financial Year'
  }
];
const initialFieldValues = {
  productId: '',
  unitId: '',
  unitName: '',
  productFirstGrade: '',
  productSecondGrade: '',
  purchaseTypeId: '',
  currency: '',
  perUnitPrice: '',
  vatAmount: 0,
  vatPercent: 0,
  dateFromActive: Moment(new Date()).format('yyyy-MM-DD'),
  isActive: true
};

export default function Report() {
  const { REACT_APP_REPORT_URL } = process.env;
  const classes = useStyles();
  const [selectedReport, setSelectedReport] = useState('');
  const [yearsType, setYearsType] = useState('');
  const [financialYear, setFinancialYear] = useState([]);
  const [financialValue, setFinancialValue] = useState('');
  const [products, setProducts] = useState([]);
  const [productFirstGrades, setProductFirstGrades] = useState([]);
  const [productSecondGrades, setProductSecondGrades] = useState([]);
  const [clients, setClients] = useState([]);
  const [state, setState] = useState(initialFieldValues);
  const [clientVlaue, setClientVlaue] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());

  const { authUser } = useSelector(({ auth }) => auth);

  const [isProductSelected, setIsProductSelected] = useState(false);

  const getAllFinancialYears = async () => {
    try {
      await axios.get(`${urls_v1.financialYear.get_all}`).then(({ data }) => {
        setFinancialYear(data.data);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getAllClients = async () => {
    try {
      await axios.get(`${urls_v1.customer.get_all}`).then(({ data }) => {
        setClients(data.data);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getAllProducts = async () => {
    try {
      await axios.get(urls_v1.products.get_all).then(({ data }) => {
        const body = data.data;
        if (data.succeeded) {
          setProducts(
            body.map(item => ({
              label: item.nameEN,
              value: item.id,
              unitId: item.unit.id,
              unitName: item.unit.name
            }))
          );
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleYearChange = date => {
    setSelectedYear(date);
  };
  const handleMonthChange = date => {
    setSelectedMonth(date);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };
  const handleToDateChange = date => {
    setSelectedToDate(date);
  };

  const handleReportTypeChange = reportType => {
    setSelectedReport(reportType);

    if (reportType !== 'Yearly Bitumin Delivery') {
      setYearsType('');
    }

    if (
      reportType !== 'Daily Bitumin Delivery' ||
      reportType === 'Monthly Bitumin Delivery' ||
      reportType === 'Yearly Bitumin Delivery'
    ) {
      setIsProductSelected(false);
      setState({
        ...state,
        productId: ''
      });
      setProducts([]);
    }
    if (
      reportType === 'Daily Bitumin Delivery' ||
      reportType === 'Monthly Bitumin Delivery' ||
      reportType === 'Yearly Bitumin Delivery'
    ) {
      getAllProducts();
    }
  };

  useEffect(() => {
    getAllFinancialYears();
    getAllClients();
    getAllProducts();
  }, []);

  const handleProductChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setState({
      ...state,
      ...fieldValue
    });
    if (value === '') {
      setProductFirstGrades([]);
      setProductSecondGrades([]);
      return;
    }
    axios.get(`${urls_v1.productGrade.get_by_productId}/${value}`).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
        setProductFirstGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
        setProductSecondGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      }
    });
    setIsProductSelected(true);
  };

  const handleFirstGradeChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    const alternateGrade = productFirstGrades.filter(item => item.label !== value);
    setState({
      ...state,
      ...fieldValue,
      productSecondGrade: alternateGrade[0].label
    });
  };
  const handleGradeChangeSecond = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setState({
      ...state,
      ...fieldValue
    });
  };

  const handleSubmit = () => {
    const dailyBituminDelivery = {
      date: Moment(selectedDate).format('yy-MM-DD'),
      firstGrade: state.productFirstGrade,
      secondGrade: state.productSecondGrade,
      uid: authUser?.id
    };
    const dailyLiftingSchedule = {
      date: Moment(selectedDate).format('MM/DD/yyyy'),
      clientId: clientVlaue,
      uid: authUser?.id
    };
    const monthlySalesRegister = {
      month: new Date(selectedMonth).getMonth() + 1,
      year: new Date(selectedYear).getFullYear(),
      uid: authUser?.id
    };

    const monthlyBituminDelivery = {
      month: new Date(selectedMonth).getMonth() + 1,
      year: new Date(selectedYear).getFullYear(),
      firstGrade: state.productFirstGrade,
      secondGrade: state.productSecondGrade,
      uid: authUser?.id
    };
    const yearlyBituminDeliverybyYear = {
      type: 'year',
      year: new Date(selectedYear).getFullYear(),
      firstGrade: state.productFirstGrade,
      secondGrade: state.productSecondGrade,
      uid: authUser?.id
    };
    const yearlyBituminDeliverybyFinancialYear = {
      type: 'FinYear',
      year: financialValue,
      firstGrade: state.productFirstGrade,
      secondGrade: state.productSecondGrade,
      uid: authUser?.id
    };
    const priceHistory = {
      fromDate: Moment(selectedDate).format('MM-DD-yyyy'),
      toDate: Moment(selectedToDate).format('MM-DD-yyyy'),
      uid: authUser?.id
    };
    const printVehicleHistory = {
      permitFromDate: Moment(selectedDate).format('yyyy-MM-DD'),
      permitToDate: Moment(selectedToDate).format('yyyy-MM-DD'),
      customerId: clientVlaue,
      uid: authUser?.id,
      urlConstant: 'VehicleHistory.pdf'
    };

    if (selectedReport === 'Print Vehicle History') {
      window.open(
        `${REACT_APP_REPORT_URL}/${reportType.PRINT_VEHICLE_HISTORY}/${printVehicleHistory.permitFromDate}/${printVehicleHistory.permitToDate}/${printVehicleHistory.customerId}/${printVehicleHistory.uid}/${printVehicleHistory.urlConstant}`
      );
    }
    if (selectedReport === 'Price History') {
      window.open(`${REACT_APP_REPORT_URL}/${reportType.PRICE_HISTORY}?${qs.stringify(priceHistory)}`);
    }
    if (selectedReport === 'Daily Bitumin Delivery') {
      window.open(`${REACT_APP_REPORT_URL}/${reportType.DAILY_BITUMIN_DELIVERY}?${qs.stringify(dailyBituminDelivery)}`);
    }

    if (selectedReport === 'Daily Lifting Schedule') {
      window.open(`${REACT_APP_REPORT_URL}/${reportType.DAILY_LIFTING_SCHEDULE}?${qs.stringify(dailyLiftingSchedule)}`);
    }

    if (selectedReport === 'Monthly Sales Register') {
      window.open(`${REACT_APP_REPORT_URL}/${reportType.SALES_REGISTER}?${qs.stringify(monthlySalesRegister)}`);
    }
    if (selectedReport === 'Monthly Bitumin Delivery') {
      window.open(`${REACT_APP_REPORT_URL}/${reportType.MONTHLY_BITUMIN_DELIVERY}?${qs.stringify(monthlyBituminDelivery)}`);
    }

    if (selectedReport === 'Yearly Bitumin Delivery' && yearsType === 'Calender Year') {
      window.open(
        `${REACT_APP_REPORT_URL}/${reportType.YEARLY_BITUMIN_DELIVERY}?${qs.stringify(yearlyBituminDeliverybyYear)}`
      );
    }

    if (selectedReport === 'Yearly Bitumin Delivery' && yearsType === 'Financial Year') {
      window.open(
        `${REACT_APP_REPORT_URL}/${reportType.YEARLY_BITUMIN_DELIVERY}?${qs.stringify(yearlyBituminDeliverybyFinancialYear)}`
      );
    }
  };

  return (
    <PageContainer heading="Reports" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={5}>
          <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" spacing={3}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                className={classes.textField}
                id="select-reports-type"
                select
                label="Select Reports Type"
                size="small"
                variant="outlined"
                value={selectedReport}
                onChange={e => {
                  handleReportTypeChange(e.target.value);
                }}>
                {reportsTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid container item xs={12} sm={12} md={8} lg={8} xl={8}>
              {selectedReport === 'Monthly Sales Register' ? (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      views={['month']}
                      label="Month"
                      format="MMMM"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      animateYearScrolling
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      views={['year']}
                      label="Year"
                      value={selectedYear}
                      onChange={handleYearChange}
                      animateYearScrolling
                    />
                  </Grid>
                </>
              ) : selectedReport === 'Daily Bitumin Delivery' ? (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      label="Date"
                      format="yyyy-MM-DD"
                      value={selectedDate}
                      onChange={handleDateChange}
                      animateYearScrolling
                    />
                  </Grid>
                </>
              ) : selectedReport === 'Price History' || selectedReport === 'Print Vehicle History' ? (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      label="From Date"
                      format="yyyy-MM-DD"
                      value={selectedDate}
                      onChange={handleDateChange}
                      animateYearScrolling
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      label="To Date"
                      format="yyyy-MM-DD"
                      value={selectedToDate}
                      onChange={handleToDateChange}
                      animateYearScrolling
                    />
                  </Grid>
                </>
              ) : selectedReport === 'Monthly Bitumin Delivery' ? (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      views={['month']}
                      label="Month"
                      format="MMMM"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      animateYearScrolling
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <DatePicker
                      className={classes.textField}
                      inputVariant="outlined"
                      size="small"
                      views={['year']}
                      label="Year"
                      value={selectedYear}
                      onChange={handleYearChange}
                      animateYearScrolling
                      invalidDateMessage={''}
                    />
                  </Grid>
                </>
              ) : selectedReport === 'Yearly Bitumin Delivery' ? (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    className={classes.textField}
                    id="select-reports-type-01"
                    select
                    label="Select Years Type"
                    size="small"
                    variant="outlined"
                    value={yearsType}
                    onChange={e => {
                      setYearsType(e.target.value);
                    }}>
                    {yearTypes.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                selectedReport === 'Daily Lifting Schedule' && (
                  <>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <DatePicker
                        className={classes.textField}
                        inputVariant="outlined"
                        size="small"
                        label="Date"
                        format="yyyy-MM-DD"
                        value={selectedDate}
                        onChange={handleDateChange}
                        animateYearScrolling
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        className={classes.textField}
                        id="select-customer"
                        type="number"
                        select
                        label="Select a Customer"
                        size="small"
                        variant="outlined"
                        value={clientVlaue}
                        onChange={e => {
                          setClientVlaue(e.target.value);
                        }}>
                        <MenuItem value={0}>All</MenuItem>
                        {clients.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.nameEN}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid> */}
                  </>
                )
              )}

              {/* Start: After Year Type Selected */}
              {yearsType === 'Calender Year' ? (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <DatePicker
                    className={classes.textField}
                    inputVariant="outlined"
                    size="small"
                    views={['year']}
                    label="Year"
                    value={selectedYear}
                    onChange={handleYearChange}
                    animateYearScrolling
                    invalidDateMessage={''}
                  />
                </Grid>
              ) : (
                yearsType === 'Financial Year' && (
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      type="number"
                      className={classes.textField}
                      id="select-reports-type"
                      select
                      label="Select Finacial Year"
                      size="small"
                      variant="outlined"
                      value={financialValue}
                      onChange={e => {
                        setFinancialValue(e.target.value);
                      }}>
                      {financialYear.map(option => (
                        <MenuItem key={option.id} value={option.financialYearName}>
                          {option.financialYearName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )
              )}
              {/* End: After Year Type Selected */}

              {/* Star: After Selected Report Type for Product DropDown */}
              {(selectedReport === 'Daily Bitumin Delivery' ||
                selectedReport === 'Monthly Bitumin Delivery' ||
                selectedReport === 'Yearly Bitumin Delivery') && (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    className={classes.textField}
                    id="ddlProduct"
                    select
                    name="productId"
                    label="Products"
                    value={state.productId}
                    onChange={e => {
                      handleProductChange(e);
                    }}
                    variant="outlined"
                    size="small">
                    {products.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              {/*End:  After Selected Report Type for Product DropDown */}

              {(selectedReport === 'Print Vehicle History' || selectedReport === 'Daily Lifting Schedule') && (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    className={classes.textField}
                    id="select-customer"
                    type="number"
                    select
                    label="Select a Customer"
                    size="small"
                    variant="outlined"
                    value={clientVlaue}
                    onChange={e => {
                      setClientVlaue(e.target.value);
                    }}>
                    <MenuItem value={0}>All</MenuItem>
                    {clients.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.nameEN}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {/* Star: after Selected Product */}

              {isProductSelected && (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      className={classes.textField}
                      disabled={!state.productId}
                      id="ddlGrade"
                      select
                      name="productFirstGrade"
                      label="First Grade"
                      value={state.productFirstGrade}
                      onChange={e => {
                        handleFirstGradeChange(e);
                      }}
                      variant="outlined"
                      size="small">
                      {productFirstGrades.map(option => (
                        <MenuItem key={option.value} value={option.label}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      className={classes.textField}
                      disabled={!state.productId}
                      id="ddlGrade2"
                      select
                      name="productSecondGrade"
                      label="Second Grade"
                      value={state.productSecondGrade}
                      onChange={e => {
                        handleGradeChangeSecond(e);
                      }}
                      variant="outlined"
                      size="small">
                      {productSecondGrades
                        .filter(e => e.label !== state.productFirstGrade)
                        .map(option => (
                          <MenuItem selected key={option.value} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </>
              )}
              {/*End:  after Selected Product */}
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end" spacing={3}>
            <Button
              variant="outlined"
              onClick={() => {
                handleSubmit();
              }}>
              Print
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Grid container item xs={12} sm={12} md={12} lg={12} spacing={3}>
          <h2> Available Stocks</h2>
          <AvailableStock />
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Grid container item xs={12} sm={12} md={12} lg={12} spacing={3}>
          <h2> Daily Delivery Reports</h2>
          <DailyDeliveryReport />
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Grid container item xs={12} sm={12} md={12} lg={12} spacing={3}>
          <h2> Monthly Delivery Reports</h2>
          <MonthlyDeliveryReport />
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Grid container item xs={12} sm={12} md={12} lg={12} spacing={3}>
          <h2> Yearly Delivery Reports</h2>
          <YearlyDeliveryReport />
        </Grid>
      </Paper>
    </PageContainer>
  );
}
