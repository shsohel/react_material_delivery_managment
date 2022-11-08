import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  alert: {
    '& > *': {
      marginBottom: theme.spacing(3),
      '&:not(:last-child)': {
        marginRight: theme.spacing(3)
      }
    }
  },
  formControl: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  }
}));

const initialFieldsValues = {
  id: 0,
  productId: '',
  productGradeId: '',
  convertFromUnitId: '',
  convertToUnitId: '',
  convertToValue: 0,
  isActive: true
};

export default function ProductUnitConversionForm(props) {
  const classes = useStyles();
  const { saveProductUnitConversion, recordForEdit } = props;
  const [units, setUnits] = useState([]); // For unit Dropdown Unit
  const [products, setProducts] = useState([]); /// For Product DropDown
  const [grades, setGrades] = useState([]); // For unit Dropdown Unit
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('name' in fieldValues) temp.name = fieldValues.name ? '' : 'This fields is requird';
    // if ('shortCode' in fieldValues) temp.shortCode = fieldValues.shortCode ? '' : 'This fields is requird';
    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };
  const { values, setValues, errors, setErrors, resetForm, handleInputChange } = useForm(
    initialFieldsValues,
    true,
    validate
  );

  async function getAllUnits() {
    await axios
      .get(urls_v1.unit.get_all)
      .then(res => {
        const body = res.data.data;
        setUnits(
          body.map(item => ({
            label: item.name,
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
            value: item.id
          }))
        );
      })
      .catch();
  }

  async function getAllGrades() {
    await axios
      .get(urls_v1.productGrade.get_all)
      .then(res => {
        const body = res.data.data;

        setGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      })
      .catch();
  }
  useEffect(() => {
    getAllUnits();
    getAllProdcut();
    getAllGrades();
  }, []);

  useEffect(() => {
    if (recordForEdit != null) {
      setValues({
        ...recordForEdit
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForEdit]);

  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      saveProductUnitConversion(values, resetForm);
    }
  };

  const getGradeByProductId = async productId => {
    await axios
      .get(`${urls_v1.productGrade.get_by_productId}/${productId}`)
      .then(res => {
        const body = res.data.data;
        setGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      })
      .catch();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container direction="column" justify="center" alignItems="flex-start" spacing={3}>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              className={classes.textField}
              id="standard-select-Unit"
              select
              label="Product"
              value={values.productId}
              onChange={e => {
                setValues({ ...values, productId: e.target.value });
                getGradeByProductId(e.target.value);
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
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Controls.Select
              disabled={!values.productId}
              name="productGradeId"
              label="Grade"
              value={values.productGradeId}
              error={errors.productGradeId}
              onChange={handleInputChange}
              options={grades}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Controls.Select
              name="convertFromUnitId"
              label="From Unit"
              value={values.convertFromUnitId}
              error={errors.convertFromUnitId}
              onChange={handleInputChange}
              options={units}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Controls.Select
              name="convertToUnitId"
              label="To Unit"
              value={values.convertToUnitId}
              error={errors.convertToUnitId}
              onChange={handleInputChange}
              options={units}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Controls.Input
              name="convertToValue"
              label="Convert To Value"
              value={values.convertToValue}
              error={errors.convertToValue}
              onChange={handleInputChange}
              onFocus={e => {
                e.target.select();
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Controls.Checkbox name="isActive" label="Is Active" value={values.isActive} onChange={handleInputChange} />
          </Grid>

          <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
            <div>
              <Controls.Button type="submit" text="Submit" />
              <Controls.Button text="Reset" color="default" onClick={resetForm} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
}
