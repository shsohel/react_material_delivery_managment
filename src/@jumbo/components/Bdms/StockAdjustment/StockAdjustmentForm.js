import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, Grid, makeStyles, MenuItem, Paper, TextField } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    width: '90%'
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  textField: {
    marginRight: theme.spacing(2),
    width: '100%'
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/dashboard' },
  { label: 'Stocks', link: '', isActive: true }
];

const initialFieldsValues = {
  postingDate: new Date(),
  operation: '',
  productId: 0,
  gradeId: 0,
  unitId: 0,
  unitName: '',
  packagingTypeId: 0,
  details: '',
  postingQuantity: 0
};
const stockOperationType = {
  StockIn: 'StockIn',
  StockOut: 'StockOut'
};

export default function StockForm() {
  const classes = useStyles();
  const [stock, setStock] = useState(initialFieldsValues);
  const [products, setProducts] = useState([]);
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [productGrades, setProductGrades] = useState([]);
  const [currentStock, setCurrentStock] = useState('');
  const [stockOperationList, setStockOperationList] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = (fieldValues = stock) => {
    let temp = { ...errors };
    if ('operation' in fieldValues) temp.operation = fieldValues.operation ? '' : 'This Operation field is required';
    if ('productId' in fieldValues) temp.productId = fieldValues.productId ? '' : 'This Product Name field is required';
    if ('gradeId' in fieldValues) temp.gradeId = fieldValues.gradeId ? '' : 'This Grade field is required';
    if ('packagingTypeId' in fieldValues)
      temp.packagingTypeId = fieldValues.packagingTypeId ? '' : 'This Packaging Type field is required';
    if ('postingQuantity' in fieldValues)
      temp.postingQuantity = fieldValues.postingQuantity ? '' : 'This Posting Quantity field is required';
    if ('details' in fieldValues) temp.details = fieldValues.details ? '' : 'This Details field is required';
    setErrors({
      ...temp
    });
    if (fieldValues === stock) return Object.values(temp).every(x => x === '');
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

  const getAllPurchaseTypes = () => {
    axios.get(urls_v1.purchaseType.get_all).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
        setPackagingTypes(
          body.map(item => ({
            label: item.name,
            value: item.id,
            unit: item.unit
          }))
        );
      }
    });
  };
  const getStockOperationList = async () => {
    await axios
      .get(urls_v1.utilities.get_stock_operation_list)
      .then(res => {
        const body = res.data.data;
        setStockOperationList(
          body.map(item => ({
            label: item[1],
            value: item[0]
          }))
        );
      })
      .catch();
  };
  useEffect(() => {
    getAllProducts();
    getAllPurchaseTypes();
    getStockOperationList();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setStock({
      ...stock,
      [name]: value
    });
    validate(fieldValue);
  };

  const handleProductChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setStock({
      ...stock,
      ...fieldValue
    });
    if (value === '') {
      setProductGrades([]);
      return;
    }
    validate(fieldValue);

    axios.get(`${urls_v1.productGrade.get_by_productId}/${value}`).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
        setProductGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      }
    });
  };
  const handleGradeChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setStock({
      ...stock,
      ...fieldValue
    });
    validate(fieldValue);
  };

  const onChangePackagingType = async e => {
    const selectedPackagingType = packagingTypes.find(item => item.value === e.target.value);
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setStock({
      ...stock,
      ...fieldValue,
      unitId: selectedPackagingType.unit.id,
      unitName: selectedPackagingType.unit.name
    });
    validate(fieldValue);

    const currentStockBody = {
      productId: stock.productId,
      gradeId: stock.gradeId,
      packagingTypeId: value
    };
    axios.get(`${urls_v1.stockManagement.get_product_current_stock}?${qs.stringify(currentStockBody)}`).then(({ data }) => {
      const cs = data.data;
      if (data.succeeded) {
        setCurrentStock(cs);
        NotificationManager.success(data.message);
      } else {
        NotificationManager.warning(data.message);
        setCurrentStock(0);
      }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      if (stock.operation === stockOperationType.StockOut && stock.postingQuantity > currentStock) {
        NotificationManager.warning('Quantity cannot be greater than Current Stock');
      } else {
        await axios
          .post(`${urls_v1.stockManagement.post}`, stock)
          .then(({ data }) => {
            if (data.succeeded) {
              NotificationManager.success(data.message);
              setStock(initialFieldsValues);
              setCurrentStock('');
            } else {
              NotificationManager.warning(data.message);
            }
          })
          .catch(({ response }) => {
            NotificationManager.warning(response.data.Message);
          });
      }
    }
  };

  return (
    <PageContainer heading="Stock Adjustment" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <Paper className={classes.paper} elevation={3}>
        <Grid container direction="column" spacing={2}>
          <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} spacing={3}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <DatePicker
                className={classes.textField}
                disabled
                disableFuture
                disablePast
                inputVariant="outlined"
                size="small"
                label="Date"
                format="DD-MM-yyyy"
                value={stock.postingDate}
                animateYearScrolling
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                className={classes.textField}
                label="Current Stocks"
                disabled
                name="postingQuantity"
                size="small"
                variant="outlined"
                value={currentStock}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                className={classes.textField}
                id="ddlStockOperationList"
                select
                name="operation"
                label="Operation"
                value={stock.operation}
                onChange={e => {
                  handleInputChange(e);
                }}
                variant="outlined"
                size="small"
                {...(errors.operation && { error: true, helperText: errors.operation })}>
                <MenuItem value="">None</MenuItem>
                {stockOperationList.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                className={classes.textField}
                id="ddlProduct"
                select
                name="productId"
                label="Products"
                value={stock.productId}
                onChange={e => {
                  handleProductChange(e);
                }}
                variant="outlined"
                size="small"
                {...(errors.productId && { error: true, helperText: errors.productId })}>
                <MenuItem value="">None</MenuItem>
                {products.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                className={classes.textField}
                disabled={!stock.productId}
                id="ddlGrade"
                select
                name="gradeId"
                label="Grade"
                value={stock.gradeId}
                onChange={e => {
                  handleGradeChange(e);
                }}
                variant="outlined"
                size="small"
                {...(errors.gradeId && { error: true, helperText: errors.gradeId })}>
                <MenuItem value="">None</MenuItem>
                {productGrades.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                className={classes.textField}
                disabled={!stock.productId && !stock.gradeId}
                id="ddlUnits"
                variant="outlined"
                size="small"
                select
                name="packagingTypeId"
                label="Packaging Type"
                value={stock.packagingTypeId}
                onChange={e => {
                  onChangePackagingType(e);
                }}
                {...(errors.packagingTypeId && { error: true, helperText: errors.packagingTypeId })}>
                <MenuItem value="">None</MenuItem>
                {packagingTypes.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
              <TextField
                multiline
                className={classes.textField}
                label="Details"
                name="details"
                size="small"
                variant="outlined"
                value={stock.details}
                onChange={e => {
                  handleInputChange(e);
                }}
                {...(errors.details && { error: true, helperText: errors.details })}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
              <TextField
                className={classes.textField}
                type="number"
                label="Quantity"
                name="postingQuantity"
                size="small"
                variant="outlined"
                value={stock.postingQuantity}
                onChange={e => {
                  handleInputChange(e);
                }}
                onFocus={e => {
                  e.target.select();
                }}
                {...(errors.postingQuantity && { error: true, helperText: errors.postingQuantity })}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={2} lg={2} xl={2}>
              <TextField
                className={classes.textField}
                label="Unit"
                disabled
                name="Unit"
                size="small"
                variant="outlined"
                value={stock.unitName}
              />
            </Grid>

            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Button size="small" variant="outlined" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </PageContainer>
  );
}
