import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import {
  Box,
  Button,
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
import { ClearOutlined, DoneOutline, EditOutlined } from '@material-ui/icons';
import { DateTimePicker } from '@material-ui/pickers';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../../services/auth/jwt/config';
import Controls from '../../../controls/Controls';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(5),
    width: '95%'
    //   paddingLeft: theme.spacing(2)
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
    width: '98%'
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
  { label: 'Edit', link: 'orders/edit', isActive: true }
];

export default function OrderForm(props) {
  const classes = useStyles();
  const orderKey = props.location.state.orderKey;
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [grades, setGrades] = useState([]);
  //const [unit, setUnit] = useState([]);
  //const [gradeName, setGradeName] = useState([]);
  const [purchaseTypes, setPurchaseTypes] = useState([]);
  const [purchaseType, setPurchaseType] = useState({});
  const [perUnitPrice, setPerUnitPrice] = useState(0);
  const [conversionValue, setConversionValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [selectedDate, handleDateChange] = useState(new Date());
  const [order, setOrder] = useState({
    id: 0,
    orderNumber: '',
    requestDate: '',
    requestTime: '',
    requestDateAndTime: '',
    customerId: '',
    customerName: '',
    note: '',
    productId: '',
    productName: '',
    productGradeId: '',
    productGradeName: '',
    unitId: '',
    unitName: '',
    gradeId: '',
    orderDetails: [],
    purchaseTypeId: '',
    numberOfDrumRequest: 0,
    quantityRequest: 0,
    numberOfDrumFinal: 0,
    quantityFinal: 0
  });

  async function getOrderwithDetailsbyKey() {
    try {
      await axios.get(`${urls_v1.order.get_order_for_edit}/${orderKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          handleDateChange(body.requestDateAndTime);
          setOrder({
            ...order,
            id: body.id,
            key: orderKey,
            orderNumber: body.orderNumber,
            customerId: body.customerId,
            customerName: body.customerName,
            note: body.note,
            orderDetails: body.orderDetails
          });
          setOrderDetails(
            body.orderDetails.map(item => ({
              ...orderDetails,
              fieldId: uuidv4(),
              id: item.id,
              key: item.key,
              orderId: item.orderId,
              orderNumber: item.orderNumber,
              perUnitPrice: item.perUnitPrice,
              productGradeId: item.productGradeId,
              productGradeName: item.productGradeName,
              productId: item.productId,
              productName: item.productName,
              purchaseTypeId: item.purchaseTypeId,
              purchaseTypeName: item.purchaseTypeName,
              numberOfDrumFinal: item.numberOfDrumFinal,
              numberOfDrumRequest: item.numberOfDrumRequest,
              quantityFinal: item.quantityFinal,
              quantityRequest: item.quantityRequest,
              unitId: item.unitId,
              unitName: item.unitName,
              conversionRate: item.conversionRate,
              isEditable: false
            }))
          );
        } else {
          NotificationManager.error(data.message);
        }
      });
    } catch (error) {
      NotificationManager.warning('Something Wrong from Server!!!');
    }
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

  useEffect(() => {
    getOrderwithDetailsbyKey();
    getAllProdcut();
    getAllPurchaseType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleAddFields = () => {
    if (
      order.productId &&
      order.productGradeId &&
      order.purchaseTypeId &&
      (order.numberOfDrumRequest || order.quantityRequest)
    ) {
      setOrderDetails([
        ...orderDetails,
        {
          fieldId: uuidv4(),
          id: 0,
          orderId: order.id,
          orderNumber: order.orderNumber,
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
          perUnitPrice: perUnitPrice,
          conversionRate: conversionValue
        }
      ]);
    } else {
      NotificationManager.warning('Plese define order information first!!!');
    }
  };

  const handleRemoveFields = item => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    const body = {
      orderId: item.orderId,
      key: item.key
    };
    const values = [...orderDetails];
    values.splice(
      values.findIndex(value => value.fieldId === item.fieldId),
      1
    );
    setOrderDetails(values);

    if (body.key) {
      axios
        .delete(`${urls_v1.order.delete_order_details}/${item.key}`, { data: body })
        .then(() => {})
        .catch(err => console.log(err));
    }
  };

  const handleEnableEdit = fieldId => {
    const updateOrderDetails = [...orderDetails];
    const specificItemIndex = updateOrderDetails.findIndex(item => item.fieldId === fieldId);
    const oldState = updateOrderDetails[specificItemIndex].isEditable;
    updateOrderDetails[specificItemIndex] = { ...updateOrderDetails[specificItemIndex], isEditable: !oldState };
    setOrderDetails(updateOrderDetails);
  };

  const handleInputChange = (fieldId, e) => {
    const newInputField = orderDetails.map(item => {
      if (fieldId === item.fieldId) {
        item[e.target.name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      }
      return item;
    });
    setOrderDetails(newInputField);
  };

  const handleConvertion = (fieldId, e) => {
    const newInputField = orderDetails.map(item => {
      if (fieldId === item.fieldId) {
        item['numberOfDrumRequest'] = Number(e.target.value);
        item['quantityRequest'] = item.conversionRate * Number(e.target.value);
      }
      return item;
    });
    setOrderDetails(newInputField);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const body = {
      id: order.id,
      key: order.key,
      orderNumber: order.orderNumber,
      requestDateAndTime: Moment(selectedDate).format('yyyy-MM-DD hh:mm A'),
      customerId: order.customerId,
      customerName: order.customerName,
      note: order.note,
      orderDetails: orderDetails.map(item => {
        delete item.fieldId;
        delete item.isEditable;
        return item;
      })
    };

    axios.put(`${urls_v1.order.put}/${body.key}`, body).then(({ data }) => {
      if (data.succeeded) {
        props.history.replace('/orders/list');
      } else {
        NotificationManager.warning(data.message);
      }
    });
  };

  return (
    <PageContainer heading="Editing Order" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <br />
      <br />
      <form>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="column" justify="center" alignContent="center" spacing={3}>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <DateTimePicker
                  className={classes.textField}
                  disablePast
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
                  className={classes.formControl}
                  disabled
                  variant="outlined"
                  size="small"
                  margin="normal"
                  name="customerName"
                  label="Customer Name"
                  value={order.customerName}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  className={classes.formControl}
                  variant="outlined"
                  multiline
                  size="small"
                  margin="normal"
                  name="note"
                  label="Note"
                  value={order.note}
                  onChange={e => {
                    setOrder({ ...order, note: e.target.value });
                  }}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
              <Grid item xs={12} sm={12} md={12} lg={12} style={{ background: '#A9A9A9', color: 'white' }}>
                <h2 style={{ backgroundColor: '#C6C6C6', color: 'black', textAlign: 'center' }}>Order Details</h2>
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
                  disabled={!order.productId}
                  className={classes.textField}
                  id="ddlGrade"
                  select
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
                  disabled={!order.productGradeId}
                  className={classes.textField}
                  id="ddlPurchaseType"
                  select
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
                    label={'Number of ' + purchaseTypes !== {} ? purchaseType.purchaseTypeName : purchaseTypes.label}
                    value={order.numberOfDrumRequest}
                    onChange={e => {
                      setOrder({
                        ...order,
                        numberOfDrumRequest: Number(e.target.value),
                        quantityRequest: Number((e.target.value * conversionValue).toFixed(3))
                      });
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
                    label="Quantity Final"
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
                <Button variant="contained" color="primary" className={classes.btnAdd} onClick={handleAddFields}>
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
                          <TableCell align="left">
                            {item.isEditable ? (
                              <TextField
                                disabled={item.conversionRate === 0}
                                type="number"
                                name="numberOfDrumRequest"
                                value={item.numberOfDrumRequest}
                                onChange={e => {
                                  handleInputChange(item.fieldId, e);
                                  handleConvertion(item.fieldId, e);
                                }}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            ) : (
                              item.numberOfDrumRequest
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {item.isEditable ? (
                              <TextField
                                disabled={item.conversionRate > 0}
                                type="number"
                                name="quantityRequest"
                                value={item.quantityRequest}
                                onChange={e => {
                                  handleInputChange(item.fieldId, e);
                                }}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            ) : (
                              item.quantityRequest
                            )}
                            {item.unitName}
                          </TableCell>
                          <TableCell align="center">
                            {!item.isEditable && (
                              <IconButton
                                style={{ color: '#DC004E' }}
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure to delete this record?',
                                    subTitle: "You cann't undo this operation",
                                    onConfirm: () => {
                                      handleRemoveFields(item);
                                    }
                                  });
                                }}>
                                <ClearOutlined />
                              </IconButton>
                            )}
                            <IconButton
                              style={{ color: '#0DC143' }}
                              onClick={() => {
                                handleEnableEdit(item.fieldId);
                              }}>
                              {item.isEditable ? <DoneOutline /> : <EditOutlined />}
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
      <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </PageContainer>
  );
}
