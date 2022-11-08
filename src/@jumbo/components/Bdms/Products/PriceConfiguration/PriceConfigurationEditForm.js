import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, Grid, InputAdornment, makeStyles, MenuItem, TextField } from '@material-ui/core';
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
    width: '100%'
  }
}));

export default function PriceConfigurationEditForm(props) {
  const classes = useStyles();
  const { savePriceConfiguration, priceConfigKey } = props;
  const [currencies, setCurrencies] = useState([]);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    id: '',
    key: '',
    productId: '',
    productName: '',
    productCode: '',
    hsCode: '',
    unitId: '',
    unitName: '',
    productGradeId: '',
    purchaseTypeId: '',
    purchaseTypeName: '',
    currency: '',
    perUnitPrice: 0,
    vatAmount: 0,
    vatPercent: 0,
    productGradeName: '',
    dateFromActive: '',
    isActive: true
  });

  const getRecordForEdit = async () => {
    if (priceConfigKey) {
      await axios.get(`${urls_v1.productPriceConfiguration.get_by_key}/${priceConfigKey}`).then(({ data }) => {
        const body = data.data;
        setState({
          ...state,
          id: body.id,
          key: body.key,
          productId: body.productId,
          productName: body.productName,
          hsCode: body.hsCode,
          productCode: body.productCode,
          productGradeId: body.productGradeId,
          productGradeName: body.productGrade.nameEN,
          purchaseTypeName: body.purchaseTypeName,
          unitName: body.unitName,
          vatAmount: body.vatAmount,
          vatPercent: body.vatPercent,
          currency: body.currency,
          perUnitPrice: body.perUnitPrice,
          dateFromActive: Moment(body.dateFromActive).format('DD-MMM-yyyy')
        });
      });
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

  useEffect(() => {
    getAllCurrencies();
    getRecordForEdit();
  }, []);

  const validate = (fieldValues = state) => {
    let temp = { ...errors };
    if ('currency' in fieldValues) temp.currency = fieldValues.currency ? '' : 'Please select Currency';
    if ('perUnitPrice' in fieldValues) temp.perUnitPrice = fieldValues.perUnitPrice ? '' : 'This field is required';
    if ('vatAmount' in fieldValues) temp.vatAmount = fieldValues.vatAmount ? '' : 'This field is required';
    if ('productCode' in fieldValues) temp.productCode = fieldValues.productCode ? '' : 'Product Code can not be empty';
    if ('hsCode' in fieldValues) temp.hsCode = fieldValues.hsCode ? '' : 'HS Code can not be empty';
    if ('vatPercent' in fieldValues) temp.vatPercent = fieldValues.vatPercent ? '' : 'This field is required';
    setErrors({
      ...temp
    });
    if (fieldValues === state) return Object.values(temp).every(x => x === '');
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
    const body = {
      id: state.id,
      key: state.key,
      perUnitPrice: state.perUnitPrice,
      hsCode: state.hsCode,
      productCode: state.productCode,
      vatAmount: state.vatAmount,
      vatPercent: state.vatPercent,
      isActive: true
    };
    if (validate()) {
      savePriceConfiguration(body);
    }
  };

  return (
    <form className={classes.mainForm} onSubmit={handleSubmit}>
      <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <TextField
              disabled
              className={classes.textField}
              label="Product"
              value={state.productName}
              size="small"
              variant="outlined"
            />
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
              disabled
              className={classes.textField}
              label="Grade"
              value={state.productGradeName}
              size="small"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              disabled
              className={classes.textField}
              label="Packaging Type"
              value={state.purchaseTypeName}
              size="small"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              disabled
              className={classes.textField}
              label="Date From Active"
              value={state.dateFromActive}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              className={classes.textField}
              id="ddlCurrency"
              select
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
              label={`Per ${state.unitName} Price`}
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
              label={`Per ${state.unitName} Vat Amount`}
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
