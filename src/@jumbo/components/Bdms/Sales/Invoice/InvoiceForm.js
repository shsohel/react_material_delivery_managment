/* eslint-disable no-use-before-define */
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { exitPermits, invoices } from '@jumbo/constants/PermissionsType';
import { reportType } from '@jumbo/constants/reportTypes';
import { thousands_separators } from '@jumbo/utils/commonHelper';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Refresh } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
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
  searchBox: {
    width: '100%'
  },
  searchButton: {
    width: '100%',
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: '#018786'
    }
  },
  submitButton: {
    backgroundColor: '#69CF45',
    color: 'black',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#018786',
      color: 'white',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  },
  printButton: {
    padding: theme.spacing(1),
    backgroundColor: '#3699FF',
    color: 'black',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#018786',
      color: 'white',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  },
  ViewButton: {
    padding: theme.spacing(1),
    backgroundColor: '#184153',
    color: '#EDEDED',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#018786',
      color: 'white',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  },
  noteField: {
    margin: theme.spacing(1),
    width: '100%',
    fontSize: '5px',
    fontWeight: 'bold'
  },
  mainDiv: {
    padding: theme.spacing(5)
  }
}));
const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Invoices', link: '/sales/invoice-list' },
  { label: 'New', link: '', isActive: true }
];

const InvoiceForm = props => {
  const { REACT_APP_REPORT_URL } = process.env;
  const classes = useStyles();
  const {
    exitList,
    perUnitPrice,
    isPageLoaded,
    perUnitVat,
    vatPerchent,
    isSuccess,
    setIsSuccess,
    setEntryPermitAutoValue,
    getAllEntryPermits
  } = props;
  const [note, setNote] = useState('');
  const [printKey, setPrintKey] = useState(null);
  const { authUser, userPermission } = useSelector(({ auth }) => auth);

  if (!isPageLoaded) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  function priceRow(actualQuantity, perUnitPrice) {
    return actualQuantity * perUnitPrice;
  }

  function createRow(product, grade, numberOfDrum, actualQuantity, perUnitPrice) {
    const price = priceRow(actualQuantity, perUnitPrice);
    return { product, grade, numberOfDrum, actualQuantity, perUnitPrice, price };
  }

  function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  const rows = [
    createRow(exitList.productName, exitList.productGradeName, exitList.numberOfDrum, exitList.actualQuantity, perUnitPrice)
  ];

  const invoiceSubtotal = subtotal(rows);
  const invoiceVats = perUnitVat * exitList.actualQuantity;
  const invoiceTotal = invoiceVats + invoiceSubtotal;

  const handleSubmit = e => {
    e.preventDefault();
    if (exitList.actualQuantity <= exitList.availableStockQuantity) {
      const body = {
        orderId: exitList.orderId,
        numberOfDrum: exitList.numberOfDrum,
        actualQuantity: exitList.actualQuantity,
        unitId: exitList.unitId,
        purchaseTypeId: exitList.purchaseTypeId,
        entryPermitId: exitList.id,
        customerName: exitList.customerName,
        customerAddress: exitList.customerAddress,
        customerBINNo: exitList.customerBINNo,
        perUnitPrice: perUnitPrice,
        vatPercent: Number(vatPerchent),
        totalPriceWithoutVAT: invoiceSubtotal,
        totalVATAmount: invoiceVats,
        totalPriceWithVAT: invoiceTotal,
        note: note
      };
      axios.post(`${urls_v1.sales.post}`, body).then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success(data.message);
          setIsSuccess(true);
          setPrintKey(data.data);
          setEntryPermitAutoValue('');
          getAllEntryPermits();
        } else {
          NotificationManager.error(data.message);
        }
      });
    } else {
      NotificationManager.error('You dont have sufficient stock!!!');
    }
  };

  return (
    <>
      <Grid container item xs={12} sm={12} md={12} lg={12} spacing={5}>
        <NotificationContainer />
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Box>
              <List dense>
                <ListItem>
                  <ListItemText primary={`Customer: ${exitList.customerName} `} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Address: ${exitList.customerAddress}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`BIN: ${exitList.customerBINNo}`} />
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Box>
              <List dense>
                <ListItem>
                  <ListItemText primary={`Permit No.: ${exitList.permitNumber}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Representative: ${exitList.representativeName}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Repr. Contact: ${exitList.representativeContact}`} />
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={4} lg={4}>
            <Box>
              <List dense>
                <ListItem>
                  <ListItemText primary={`Driver: ${exitList.driverName}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Transport No: ${exitList.transportNumber}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Packaging Type: ${exitList.purchaseTypeName}`} />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>

        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <TableContainer component={Paper} className={classes.root}>
            <Table size="small" className={classes.table} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Product with Grades</TableCell>
                  <TableCell align="right">Number of Drum</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.product}>
                    <TableCell>
                      {row.product}/{row.grade}
                    </TableCell>
                    <TableCell align="right">{row.numberOfDrum}</TableCell>
                    <TableCell align="right">{row.actualQuantity.toFixed(3)}</TableCell>
                    <TableCell align="right">{thousands_separators(ccyFormat(row.perUnitPrice))}</TableCell>
                    <TableCell align="right">{thousands_separators(ccyFormat(row.price))}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={3}>Subtotal</TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(invoiceSubtotal))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>VAT</TableCell>
                  <TableCell align="right">
                    <Typography>{`${vatPerchent}%`}</Typography>
                  </TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(invoiceVats))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(invoiceTotal))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <TextField
            className={classes.noteField}
            variant="outlined"
            label="Write a Note"
            name="note"
            multiline
            value={note}
            onChange={e => {
              setNote(e.target.value);
            }}
          />
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={12} spacing={3} justify="flex-end">
          {isSuccess ? (
            <div>
              {userPermission?.includes(invoices.PRINT) && (
                <Button
                  className={classes.submitButton}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    window.open(
                      `${REACT_APP_REPORT_URL}/${reportType.INVOICE}/${printKey.invoiceKey}/${authUser.id}`,
                      '_blank'
                    );
                  }}>
                  Print Invoice
                </Button>
              )}

              <span>
                <span> </span>
              </span>
              {userPermission?.includes(exitPermits.PRINT) && (
                <Button
                  className={classes.submitButton}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    window.open(
                      `${REACT_APP_REPORT_URL}/${reportType.EXIT_PERMIT}/${printKey.exitPermitKey}/${authUser.id}`,
                      '_blank'
                    );
                  }}>
                  Print Exit Permit
                </Button>
              )}
            </div>
          ) : (
            <Button className={classes.submitButton} type="submit" variant="outlined" size="small" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default function ComboBox() {
  const classes = useStyles();
  const [entryList, setEntryList] = useState([]);
  const [searchEntryNo, setSearchEntryNo] = useState('');
  const [exitList, setExitList] = useState(null);
  const [perUnitPrice, setPerUnitPrice] = useState(0);
  const [perUnitVat, setPerUnitVat] = useState(0);
  const [vatPerchent, setVatPerchent] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [entryPermitAutoValue, setEntryPermitAutoValue] = useState('');

  const getAllEntryPermits = async () => {
    try {
      await axios.get(`${urls_v1.sales.get_epName_for_invoice}`).then(({ data }) => {
        if (data) {
          setEntryList(data);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllEntryPermits();
  }, []);

  const handleClear = () => {
    getAllEntryPermits();
    setExitList(null);
    setIsPageLoaded(false);
    setEntryPermitAutoValue('');
  };
  const handleEntryNoChange = (e, value) => {
    setEntryPermitAutoValue(value);
    setSearchEntryNo(value);
  };

  const handleSearch = async () => {
    if (searchEntryNo === '') {
      NotificationManager.error('Invalid Permit Number!!!');
    }
    await axios.get(`${urls_v1.sales.get_ep_by_permitNo}/${searchEntryNo}`).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
        setExitList(body);
        setIsPageLoaded(true);
        const priceBody = {
          gradeId: body.productGradeId,
          purchaseTypeId: body.purchaseTypeId
        };
        axios
          .get(`${urls_v1.productPriceConfiguration.get_by_grade_and_packageType}?${qs.stringify(priceBody)}`)
          .then(({ data }) => {
            if (data.succeeded) {
              const body = data.data.perUnitPrice;
              setPerUnitPrice(body);
              setPerUnitVat(data.data.vatAmount);
              setVatPerchent(data.data.vatPercent);
            }
          });
        setIsSuccess(false);
      }
    });
  };

  return (
    <>
      <PageContainer heading="Invoice Generator" breadcrumbs={breadcrumbs}>
        <NotificationContainer />
        <Grid container component={Paper} direction="column" className={classes.mainDiv}>
          <form>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end" spacing={5}>
              <Grid container item xs={12} sm={4} md={4} lg={4}>
                <Autocomplete
                  className={classes.searchBox}
                  id="combo-box-demo"
                  size="small"
                  options={entryList}
                  getOptionLabel={option => option}
                  onChange={(event, newValue) => {
                    handleEntryNoChange(event, newValue);
                  }}
                  value={entryPermitAutoValue}
                  style={{ width: 300 }}
                  renderInput={params => <TextField {...params} variant="outlined" placeholder="Searching" size="small" />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={2}>
                <Button
                  onClick={handleSearch}
                  color="primary"
                  size="medium"
                  variant="outlined"
                  className={classes.searchButton}>
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={2}>
                <IconButton color="primary" size="medium" onClick={handleClear}>
                  <Refresh />
                </IconButton>
              </Grid>
            </Grid>

            <hr style={{ border: '1px solid #e6e6e6', marginTop: '10px' }} />

            <Grid container item xs={12} sm={12} md={12} lg={12} className={classes.mainDiv}>
              {isPageLoaded ? (
                <InvoiceForm
                  setIsSuccess={setIsSuccess}
                  getAllEntryPermits={getAllEntryPermits}
                  setEntryPermitAutoValue={setEntryPermitAutoValue}
                  isSuccess={isSuccess}
                  exitList={exitList}
                  perUnitPrice={perUnitPrice}
                  perUnitVat={perUnitVat}
                  vatPerchent={vatPerchent}
                  isPageLoaded={isPageLoaded}
                />
              ) : (
                <Grid container item xs={12} sm={12} md={12} lg={12} spacing={5}>
                  <Grid container item xs={12} sm={12} md={12} lg={12}>
                    <Grid item xs={6} sm={6} md={4} lg={4}>
                      <Box>
                        <List dense>
                          <ListItem>
                            <ListItemText primary={`Customer:  `} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={`Address: `} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={`BIN: `} />
                          </ListItem>
                        </List>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={4}>
                      <Box>
                        <List dense>
                          <ListItem>
                            <ListItemText primary={`Permit No.: `} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={`Representative: `} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={`Repr. Contact: `} />
                          </ListItem>
                        </List>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={4} lg={4}>
                      <Box>
                        <List dense>
                          <ListItem>
                            <ListItemText primary={`Driver: `} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={`Transport No: `} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary={`Packaging Type: `} />
                          </ListItem>
                        </List>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} sm={12} md={12} lg={12}>
                    <TableContainer component={Paper} className={classes.root}>
                      <Table size="small" className={classes.table} aria-label="spanning table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product with Grades</TableCell>
                            <TableCell align="right">Number of Drum</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="right">...</TableCell>
                            <TableCell align="right">...</TableCell>
                            <TableCell align="right">...</TableCell>
                            <TableCell align="right">...</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={3}>Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={2}>VAT</TableCell>
                            <TableCell align="right">
                              <TextField id="vat-5" select value="" variant="standard" placeholder="Vat%" size="small">
                                <MenuItem value="0.07">7%</MenuItem>
                                <MenuItem value="0.10">10%</MenuItem>
                                <MenuItem value="0.15">15%</MenuItem>
                                <MenuItem value="0.20">20%</MenuItem>
                              </TextField>
                            </TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid container item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      className={classes.noteField}
                      variant="outlined"
                      label="Write a Note"
                      name="note"
                      multiline
                      value=""
                    />
                  </Grid>
                  <Grid container item xs={12} sm={12} md={12} lg={12} className={classes.mainDiv} justify="flex-end">
                    <Button className={classes.submitButton} type="submit" variant="outlined" size="small">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
      </PageContainer>
    </>
  );
}
