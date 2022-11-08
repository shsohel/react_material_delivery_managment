import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { RemoveCircleOutline } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(5),
    width: '95%'
  },
  selectEmpty: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  textField: {
    margin: theme.spacing(6),
    width: '90%'
  },
  btnAdd: {
    marginTop: 25,
    marginLeft: 10,
    padding: 8,
    width: '90%',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(6),
      width: '90%'
    }
  },

  textFieldNote: {
    margin: theme.spacing(6),
    width: '90%'
  },
  checkBoxControl: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  },
  addRemoveAction: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
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
  }
}));

const breadcrumbs = [
  { label: 'Order', link: '/orders/list' },
  { label: 'New', link: 'orders/new', isActive: true }
];

const initialFieldValues = {
  id: 0,
  requestDateAndTime: '',
  productId: '',
  productName: '',
  unitId: '',
  unitName: '',
  productGradeId: '',
  productGradeName: '',
  purchaseTypeId: '',
  numberOfDrumRequest: '',
  quantityRequest: '',
  numberOfDrumFinal: 0,
  quantityFinal: 0
};

const masterInfo = {
  customerId: '',
  customerName: '',
  note: ''
};

export default function OrderForm(props) {
  const classes = useStyles();

  //#region States
  const [selectedDate, handleDateChange] = useState(new Date());
  const [customers, setCustomers] = useState([]); // For customer DropDown
  const [products, setProducts] = useState([]); /// For Product DropDown
  const [grades, setGrades] = useState([]); /// For grade DropDown
  const [purchaseTypes, setPurchaseTypes] = useState([]); /// For purchasetype DropDown
  const [perUnitPrice, setPerUnitPrice] = useState(0);
  const [purchaseType, setPurchaseType] = useState({});
  const [conversionValue, setConversionValue] = useState(0);
  const [masterInfoState, setMasterInfoState] = useState(masterInfo);
  const [order, setOrder] = useState(initialFieldValues);
  const [orderDetails, setOrderDetails] = useState([]);
  const [open, setOpen] = useState(false);
  //#endregion

  //#region UDF
  async function getAllCustomers() {
    await axios
      .get(urls_v1.customer.get_all)
      .then(res => {
        const body = res.data.data;
        setCustomers(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      })
      .catch();
  }

  async function getAllProdcut() {
    await axios
      .get(urls_v1.products.get_all)
      .then(res => {
        const body = res.data.data;
        setProducts(
          body.map(item => ({
            label: item.nameEN,
            value: item.id,
            unitId: item.unit.id,
            unitName: item.unit.name
          }))
        );
      })
      .catch();
  }

  async function getAllPurchaseType() {
    await axios
      .get(urls_v1.purchaseType.get_all)
      .then(res => {
        const body = res.data.data;
        setPurchaseTypes(
          body.map(item => ({
            label: item.name,
            value: item.id,
            key: item.key,
            purchaseTypeName: item.name,
            hasConversion: item.hasConversion,
            unitId: item.unitId
          }))
        );
      })
      .catch();
  }

  const getGradesByProductId = productId => {
    if (productId === '') {
      setGrades([]);
      return;
    }
    axios.get(`${urls_v1.productGrade.get_by_productId}/${productId}`).then(({ data }) => {
      if (data.data.length) {
        const body = data.data;
        setGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      } else {
        NotificationManager.warning('Selected Product has no grade!!!');
        setGrades([]);
      }
    });
  };

  const getPerUnitPrice = purchaseType => {
    const queryStringForProductGradePrice = {
      gradeId: order.productGradeId,
      purchaseTypeId: purchaseType.value
    };
    axios
      .get(
        `${urls_v1.productPriceConfiguration.get_by_grade_and_packageType}?${qs.stringify(queryStringForProductGradePrice)}`
      )
      .then(({ data }) => {
        if (data.succeeded) {
          setPerUnitPrice(data.data.perUnitPrice);
        } else {
          setOrder({ ...order, productGradeId: '', productName: '', purchaseTypeId: '' });
          NotificationManager.warning('Selected Grades has not price configuration!!!');
        }
      })
      .catch(err => {
        NotificationManager.warning('Price not found for this product');
      });
  };

  const getUnitCoversionValue = async purchaseType => {
    const queryStringForUnitConversionValue = {
      fromUnitId: purchaseType.unitId,
      toUnitId: order.unitId,
      gradeId: order.productGradeId
    };

    try {
      await axios
        .get(`${urls_v1.productUnitConversion.get_unit_conversion_value}?${qs.stringify(queryStringForUnitConversionValue)}`)
        .then(res => {
          const body = res.data.data;
          setConversionValue(body);
        });
    } catch (error) {
      NotificationManager.error('Seletected Grades has no Unit Converstion!!!');
    }
  };

  //#endregion

  useEffect(() => {
    getAllCustomers();
    getAllProdcut();
    getAllPurchaseType();
  }, []);

  //#region Events
  const handleAddFields = () => {
    if (
      order.productId &&
      order.productGradeId &&
      order.purchaseTypeId &&
      (order.numberOfDrumRequest || order.quantityRequest)
    ) {
      // if same item already in have OderDetails
      const similarItemIndex = orderDetails.findIndex(
        item =>
          item.productId === order.productId &&
          item.productGradeId === order.productGradeId &&
          item.purchaseTypeId === order.purchaseTypeId
      );
      if (similarItemIndex > -1) {
        setOpen(true);
      } else {
        setOrderDetails([
          ...orderDetails,
          {
            fieldId: uuidv4(),
            productId: order.productId,
            productName: order.productName,
            productGradeId: order.productGradeId,
            productGradeName: order.productGradeName,
            purchaseTypeId: order.purchaseTypeId,
            purchaseTypeName: purchaseType.purchaseTypeName,
            numberOfDrumRequest: order.numberOfDrumRequest ? order.numberOfDrumRequest : 0,
            quantityRequest: order.quantityRequest ? order.quantityRequest : 0,
            numberOfDrumFinal: order.numberOfDrumFinal,
            quantityFinal: order.quantityFinal,
            unitId: order.unitId,
            unitName: order.unitName,
            conversionRate: conversionValue,
            perUnitPrice: perUnitPrice
          }
        ]);
        setOrder(initialFieldValues);
        setPerUnitPrice(0);
        setConversionValue(0);
        document.getElementById('ddlProduct').focus();
      }
    } else {
      NotificationManager.warning('Plese define order information first!!!');
    }
  };

  const handleRemoveFields = fieldId => {
    const values = [...orderDetails];
    values.splice(
      values.findIndex(value => value.fieldId === fieldId),
      1
    );
    setOrderDetails(values);
  };

  const mergeAmount = () => {
    // if same item already in have OderDetails
    const similarItemIndex = orderDetails.findIndex(
      item =>
        item.productId === order.productId &&
        item.productGradeId === order.productGradeId &&
        item.purchaseTypeId === order.purchaseTypeId
    );
    const updatedOrderDetails = [...orderDetails];
    if (updatedOrderDetails[similarItemIndex].numberOfDrumRequest > 0) {
      updatedOrderDetails[similarItemIndex] = {
        ...updatedOrderDetails[similarItemIndex],
        numberOfDrumRequest: updatedOrderDetails[similarItemIndex].numberOfDrumRequest + order.numberOfDrumRequest,
        quantityRequest: updatedOrderDetails[similarItemIndex].quantityRequest + order.quantityRequest
      };
    } else {
      updatedOrderDetails[similarItemIndex] = {
        ...updatedOrderDetails[similarItemIndex],
        quantityRequest: updatedOrderDetails[similarItemIndex].quantityRequest + order.quantityRequest
      };
    }
    setOrderDetails(updatedOrderDetails);
    setOrder(initialFieldValues);
    setOpen(false);
  };

  const mergedDisagree = () => {
    setOrder(initialFieldValues);
    setOpen(false);
  };

  const handleCustomerChange = e => {
    const selectedCustomer = customers.find(item => item.value === e.target.value);
    setMasterInfoState({ ...masterInfoState, customerId: selectedCustomer.value, customerName: selectedCustomer.label });
  };

  const handleProductChange = e => {
    if (e.target.value === '') {
      setOrder({ ...order, productId: '', productName: '', unitId: '', unitName: '' });
      return;
    }
    const selectedProduct = products.find(item => item.value === e.target.value);
    setOrder({
      ...order,
      productId: e.target.value,
      productName: selectedProduct.label,
      unitId: selectedProduct.unitId,
      unitName: selectedProduct.unitName
    });
    getGradesByProductId(e.target.value);
  };

  const handleGradeChange = e => {
    if (e.target.value === '') {
      return;
    }
    const selectedGrade = e.target.value === '' ? null : grades.find(item => item.value === e.target.value);
    setOrder({
      ...order,
      productGradeId: selectedGrade.value,
      productGradeName: selectedGrade.label,
      purchaseTypeId: ''
    });
  };

  const handlePurchaseType = e => {
    if (e.target.value === '') {
      return;
    }
    const selectedPurchaseType = purchaseTypes.find(item => item.value === e.target.value);
    setPurchaseType(selectedPurchaseType);
    setOrder({
      ...order,
      purchaseTypeId: e.target.value,
      numberOfDrumFinal: 0,
      quantityFinal: 0
    });
    if (selectedPurchaseType.hasConversion) {
      getUnitCoversionValue(selectedPurchaseType);
    } else {
      setConversionValue(0);
    }
    getPerUnitPrice(selectedPurchaseType);
  };

  const handleNumberOfDrumRequest = e => {
    const { value } = e.target;
    if (value.includes('.')) {
      NotificationManager.warning('Decimal not allowed!!!');
      return;
    }
    setOrder({
      ...order,
      numberOfDrumRequest: Number(value),
      quantityRequest: Number((value * conversionValue).toFixed(3))
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (orderDetails.length > 0) {
      const body = {
        id: order.id,
        requestDateAndTime: Moment(selectedDate).format('yyyy-MM-DD hh:mm A'),
        customerId: masterInfoState.customerId,
        customerName: masterInfoState.customerName,
        note: masterInfoState.note,
        orderDetails
      };

      axios
        .post(urls_v1.order.post, body)
        .then(({ data }) => {
          if (data.succeeded) {
            props.history.replace('/orders/list');
          }
        })
        .catch(error => {
          console.log(error);
          NotificationManager.warning('Something went wrong!!!');
        });
    } else {
      NotificationManager.warning('Please add at least a single product');
    }
  };
  //#endregion

  return (
    <PageContainer heading="New Order Entry" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <br />
      <br />
      <form>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="column" justify="center" alignContent="center" spacing={3}>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <DateTimePicker
                  disablePast
                  className={classes.textField}
                  size="small"
                  format="DD-MM-yyyy hh:mm A"
                  label="Order Date"
                  inputVariant="outlined"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  className={classes.textField}
                  id="ddlCustomer"
                  select
                  label="Customer"
                  value={masterInfoState.customerId}
                  onChange={e => {
                    handleCustomerChange(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {customers.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  className={classes.formControl}
                  size="small"
                  margin="normal"
                  variant="outlined"
                  name="note"
                  label="Note"
                  value={masterInfoState.note}
                  onChange={e => {
                    setMasterInfoState({ ...masterInfoState, note: e.target.value });
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
              <Grid item xs={12} sm={12} md={12} lg={12} style={{ background: '#A9A9A9', color: 'white' }}>
                <h2 style={{ textAlign: 'center' }}>Order Details</h2>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TextField
                  className={classes.textField}
                  id="ddlProduct"
                  select
                  label="Product"
                  value={order.productId}
                  onChange={e => {
                    handleProductChange(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {products.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TextField
                  select
                  id="ddlGrade"
                  disabled={!order.productId}
                  className={classes.textField}
                  label="Grade"
                  value={order.productGradeId}
                  onChange={e => {
                    handleGradeChange(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {grades.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TextField
                  select
                  id="ddlPurchaseType"
                  disabled={!order.productGradeId}
                  className={classes.textField}
                  label="Packaging Type"
                  value={order.purchaseTypeId}
                  onChange={e => {
                    handlePurchaseType(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {purchaseTypes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2}>
                {purchaseType.hasConversion ? (
                  <TextField
                    size="small"
                    className={classes.textField}
                    disabled={!order.purchaseTypeId}
                    type="number"
                    variant="outlined"
                    margin="normal"
                    name="numberOfDrumRequest"
                    label={
                      'Number of ' + purchaseTypes !== {} ? purchaseType.purchaseTypeName + ' Quantity' : purchaseTypes.label
                    }
                    value={order.numberOfDrumRequest}
                    onChange={e => {
                      handleNumberOfDrumRequest(e);
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                  />
                ) : (
                  <TextField
                    size="small"
                    className={classes.textField}
                    disabled={!order.purchaseTypeId}
                    type="number"
                    variant="outlined"
                    margin="normal"
                    name="quantityRequest"
                    label={!order.purchaseTypeId ? 'Quantity' : purchaseType.purchaseTypeName + ' Quantity'}
                    value={order.quantityRequest}
                    onChange={e => {
                      setOrder({ ...order, quantityRequest: Number(e.target.value) });
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  className={classes.btnAdd}
                  onClick={handleAddFields}>
                  Add
                </Button>
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              {orderDetails.length > 0 ? (
                <TableContainer component={Paper} className={classes.root}>
                  <Table size="small" aria-label="a dense table" className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SL</TableCell>
                        <TableCell>Product Info</TableCell>
                        <TableCell align="left">Packaging Type</TableCell>
                        <TableCell align="left">Number of Drum</TableCell>
                        <TableCell align="left">Quantity</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetails.map((item, index) => (
                        <TableRow key={item.fieldId}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell component="th" scope="row">
                            {item.productName} ({item.productGradeName})
                          </TableCell>
                          <TableCell align="left">{item.purchaseTypeName}</TableCell>
                          <TableCell align="left">{item.numberOfDrumRequest}</TableCell>
                          <TableCell align="left">
                            {item.quantityRequest} {item.unitName}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              style={{ color: '#DC004E' }}
                              onClick={() => {
                                handleRemoveFields(item.fieldId);
                              }}>
                              <RemoveCircleOutline />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-start">
              <Box display="flex">
                <Box ml={2}>
                  <Button onClick={handleSubmit} size="small" variant="outlined" color="primary">
                    Submit
                  </Button>
                </Box>
                <Box ml={2}>
                  <NavLink to="/orders/list">
                    <Button size="small" color="primary" variant="outlined">
                      Cancel
                    </Button>
                  </NavLink>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <Dialog open={open}>
        <DialogTitle style={{ color: 'black', fontWeight: 'bold' }}>{'Product already added'}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#404040' }}>
            This product is already added in the list. Are you sure to add this again? If agree, amount will be merged.
          </DialogContentText>
          <DialogContentText style={{ color: 'black', fontWeight: 'bold' }}>
            If agree, amount will be merged.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" style={{ color: 'red' }} onClick={mergedDisagree} color="primary">
            Disagree
          </Button>
          <Button
            variant="outlined"
            style={{ color: 'green' }}
            onClick={() => {
              mergeAmount();
            }}
            color="primary"
            autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
