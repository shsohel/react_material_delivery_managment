import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Box, Button, CircularProgress, Grid, InputAdornment, makeStyles, MenuItem, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  mainForm: {
    '& .MuiFormControl-root': {
      width: '90%',
      margin: theme.spacing(1)
    }
  },
  circularProgressRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textField: {
    margin: theme.spacing(6),
    width: '90%'
  }
}));

const initialFieldValues = {
  productId: '',
  unitId: '',
  unitName: '',
  productGradeId: '',
  purchaseTypeId: '',
  currency: '',
  perUnitPrice: '',
  productCode: '',
  hsCode: '',
  vatAmount: '',
  vatPercent: '',
  dateFromActive: Moment(new Date()).format('yyyy-MM-DD'),
  isActive: true
};

export default function PriceConfigurationForm(props) {
  const classes = useStyles();
  const { savePriceConfiguration } = props;
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [products, setProducts] = useState(null);
  const [productGrades, setProductGrades] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [purchaseTypes, setPurchaseTypes] = useState([]);
  const [state, setState] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

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
          setIsPageLoaded(true);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getAllCurrencies = () => {
    axios
      .get(urls_v1.currency.get_all)
      .then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setCurrencies(
            body.map(item => ({
              label: item.shortCode,
              value: item.shortCode
            }))
          );
        }
      })
      .catch();
  };

  const getAllPurchaseTypes = () => {
    axios
      .get(urls_v1.purchaseType.get_all)
      .then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setPurchaseTypes(
            body.map(item => ({
              label: item.name,
              value: item.id
            }))
          );
        }
      })
      .catch();
  };

  useEffect(() => {
    getAllProducts();
    getAllCurrencies();
    getAllPurchaseTypes();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('productId' in fieldValues) temp.productId = fieldValues.productId ? '' : 'Please select a product';
    if ('productGradeId' in fieldValues) temp.productGradeId = fieldValues.productGradeId ? '' : 'Please select a Grade';
    if ('productCode' in fieldValues) temp.productCode = fieldValues.productCode ? '' : 'Product Code can not be empty';
    if ('hsCode' in fieldValues) temp.hsCode = fieldValues.hsCode ? '' : 'HS Code can not be empty';
    if ('purchaseTypeId' in fieldValues)
      temp.purchaseTypeId = fieldValues.purchaseTypeId ? '' : 'Please select Packaging Type';
    if ('currency' in fieldValues) temp.currency = fieldValues.currency ? '' : 'Please select Currency';
    if ('perUnitPrice' in fieldValues) temp.perUnitPrice = fieldValues.perUnitPrice ? '' : 'This field is required';
    if ('vatAmount' in fieldValues) temp.vatAmount = fieldValues.vatAmount ? '' : 'This field is required';
    if ('vatPercent' in fieldValues) temp.vatPercent = fieldValues.vatPercent ? '' : 'This field is required';
    setErrors({
      ...temp
    });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
  };

  const handleProductChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    const unit = products.find(item => item.value === value);
    setState({
      ...state,
      ...fieldValue,
      unitId: value ? unit.unitId : '',
      unitName: value ? unit.unitName : ''
    });
    validate(fieldValue);
    getGradesByProductId(e.target.value);
  };

  const getGradesByProductId = productId => {
    if (productId === '') {
      setProductGrades([]);
      return;
    }
    axios.get(`${urls_v1.productGrade.get_by_productId}/${productId}`).then(({ data }) => {
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

  const handleInputChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setState({
      ...state,
      ...fieldValue
    });
    validate(fieldValue);
  };
  const handleDateChange = date => {
    const dateFromActive = Moment(date).format('yyyy-MM-DD');
    setState({ ...state, dateFromActive: dateFromActive });
  };

  const handlePerUnitPriceChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: +value };
    setState({
      ...state,
      ...fieldValue,
      vatPercent: '',
      vatAmount: ''
    });
  };

  const handleVatAmountChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: +value };
    const vatPercent = ((+value / state.perUnitPrice) * 100).toFixed(2);
    setState({
      ...state,
      ...fieldValue,
      vatPercent: +vatPercent
    });
  };

  const handleVatPercentChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: +value };
    const vatAmount = (state.perUnitPrice * (+value / 100)).toFixed(2);
    setState({
      ...state,
      ...fieldValue,
      vatAmount: +vatAmount
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      savePriceConfiguration(state);
    }
  };

  return (
    <form className={classes.mainForm} onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={6} sm={6} md={6} lg={6}>
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
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              className={classes.textField}
              disabled={!state.productId}
              id="ddlGrade"
              select
              name="productGradeId"
              label="Grades"
              value={state.productGradeId}
              onChange={e => {
                handleInputChange(e);
              }}
              variant="outlined"
              size="small"
              {...(errors.productGradeId && { error: true, helperText: errors.productGradeId })}>
              <MenuItem value="">None</MenuItem>
              {productGrades.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <TextField
              className={classes.textField}
              label="Product Code"
              name="productCode"
              value={state.productCode}
              size="small"
              variant="outlined"
              onChange={e => {
                handleInputChange(e);
              }}
              {...(errors.productCode && { error: true, helperText: errors.productCode })}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <TextField
              className={classes.textField}
              label="HS Code"
              name="hsCode"
              value={state.hsCode}
              size="small"
              variant="outlined"
              onChange={e => {
                handleInputChange(e);
              }}
              {...(errors.hsCode && { error: true, helperText: errors.hsCode })}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              disabled={!state.productId}
              className={classes.textField}
              id="ddlPackagingType"
              select
              name="purchaseTypeId"
              label="Packaging Type"
              value={state.purchaseTypeId}
              onChange={e => {
                handleInputChange(e);
              }}
              variant="outlined"
              size="small"
              {...(errors.purchaseTypeId && { error: true, helperText: errors.purchaseTypeId })}>
              <MenuItem value="">None</MenuItem>
              {purchaseTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <KeyboardDatePicker
              disablePast
              disabled
              size="small"
              inputVariant="outlined"
              margin="normal"
              id="dPDateFromActive"
              label="Date From Active"
              format="DD-MM-yyyy"
              value={state.dateFromActive}
              onChange={date => {
                handleDateChange(date);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              select
              disabled={!state.productId}
              className={classes.textField}
              id="ddlCurrency"
              name="currency"
              label="Currency"
              value={state.currency}
              onChange={e => {
                handleInputChange(e);
              }}
              variant="outlined"
              size="small"
              {...(errors.currency && { error: true, helperText: errors.currency })}>
              <MenuItem value="">None</MenuItem>
              {currencies.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label={` ${state.unitName ? 'Per ' + state.unitName + ' Price' : 'Per Unit Price'} `}
              variant="outlined"
              size="small"
              type="number"
              name="perUnitPrice"
              value={state.perUnitPrice}
              onChange={e => {
                handlePerUnitPriceChange(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
              {...(errors.perUnitPrice && { error: true, helperText: errors.perUnitPrice })}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label={`${state.unitName ? 'Per ' + state.unitName + ' Vat Amount' : 'Vat Amount'}`}
              type="number"
              variant="outlined"
              size="small"
              name="vatAmount"
              value={state.vatAmount}
              onChange={e => {
                handleVatAmountChange(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
              {...(errors.vatAmount && { error: true, helperText: errors.vatAmount })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label="Vat Percent"
              variant="outlined"
              size="small"
              type="number"
              name="vatPercent"
              value={state.vatPercent}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              onChange={e => {
                handleVatPercentChange(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
              {...(errors.vatPercent && { error: true, helperText: errors.vatPercent })}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <Button size="small" variant="outlined" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
