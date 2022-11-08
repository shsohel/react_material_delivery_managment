import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { toastAlerts } from '@jumbo/utils/alerts';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  },
  selectEmpty: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  formControlLabel: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  textField: {
    margin: theme.spacing(6),
    width: '90%'
  },
  detailsField: {
    margin: theme.spacing(6),
    width: '96%',
    [theme.breakpoints.down('sm')]: {
      width: '90%'
    }
  },
  checkBoxControl: {
    margin: theme.spacing(5),
    width: '98%',
    paddingLeft: theme.spacing(2)
  },
  addRemoveAction: {
    margin: theme.spacing(5),
    width: '98%',
    paddingLeft: theme.spacing(2)
  }
}));

const breadcrumbs = [
  { label: 'Prdoducts', link: '/products/list' },
  { label: 'New', link: '', isActive: true }
];

const initialFieldValues = {
  id: 0,
  nameEN: '',
  productCodeEN: '',
  hsCodeEN: '',
  unitId: '',
  detailsEN: '',
  isActive: true,
  hasAnyGrade: false
};

export default function ProductForm(props) {
  const classes = useStyles();
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState(initialFieldValues);
  const [grades, setGrades] = useState([
    //  { fieldId: uuidv4(), productId: null, nameEN: "", detailsEN: "", isActive: true }
  ]);

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
  useEffect(() => {
    getAllUnits();
  }, []);

  const validate = (fieldValues = product) => {
    let temp = { ...errors };
    if ('nameEN' in fieldValues) temp.nameEN = fieldValues.nameEN ? '' : 'This Product Name field is required';
    if ('detailsEN' in fieldValues) temp.detailsEN = fieldValues.detailsEN ? '' : 'This Details field is required';
    if ('unitId' in fieldValues) temp.unitId = fieldValues.unitId ? '' : 'Please select a unit';
    setErrors({
      ...temp
    });
    if (fieldValues === product) return Object.values(temp).every(x => x === '');
  };

  const handleProductInputChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setProduct({
      ...product,
      ...fieldValue
    });
    validate(fieldValue);
  };

  const handleGradeInputChange = (fieldId, e) => {
    const newInputField = grades.map(item => {
      if (fieldId === item.fieldId) {
        item[e.target.name] = e.target.value;
      }
      return item;
    });
    setGrades(newInputField);
  };

  const handleAddFields = () => {
    setGrades([...grades, { fieldId: uuidv4(), productId: null, nameEN: '', detailsEN: '', isActive: true }]);
  };
  const handleRemoveFields = id => {
    const values = [...grades];
    values.splice(
      values.findIndex(value => value.id === id),
      1
    );
    setGrades(values);
    if (values.length === 0) {
      setProduct({ ...product, hasAnyGrade: false });
    }
  };

  const handleHasAnyGrade = e => {
    const hasAnyGrade = e.target.checked;
    setProduct({ ...product, hasAnyGrade: hasAnyGrade });
    if (hasAnyGrade) {
      handleAddFields();
    } else {
      setGrades([]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      if (grades.length) {
        const isValidGrades = grades.every(grade => grade.nameEN.length > 0 && grade.detailsEN.length > 0);
        if (isValidGrades) {
          axios
            .post(urls_v1.products.post, product)
            .then(({ data }) => {
              grades.forEach(item => (item.productId = data.data));
              const body = {
                productId: data.data,
                productGrades: grades
              };
              axios.post(urls_v1.productGrade.post, body).then(({ data }) => {
                if (data.succeeded) {
                  toastAlerts('success', data.message);
                  props.history.replace('/products/list');
                } else {
                  toastAlerts('error', data.message);
                }
              });
            })
            .catch(error => {
              toastAlerts('error', 'There is an error!!! Please try again with correct information');
            });
        } else {
          toastAlerts('warning', 'Plese enter all your grade name');
        }
      } else {
        axios
          .post(urls_v1.products.post, product)
          .then(({ data }) => {
            if (data.succeeded) {
              toastAlerts('success', 'Create Successfully Done');
              props.history.replace('/products/list');
            } else {
              toastAlerts('success', 'Something gone wrong!!!');
            }
          })
          .catch(({ response }) => {
            toastAlerts('warning', response.data.Message);
          });
      }
    }
  };
  return (
    <PageContainer heading="New Prdoduct" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <NotificationContainer />
      <form onSubmit={handleSubmit}>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="column" justify="center" alignItems="flex-start" spacing={3}>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  className={classes.textField}
                  size="small"
                  variant="outlined"
                  margin="normal"
                  name="nameEN"
                  label="Name"
                  value={product.nameEN}
                  onChange={e => handleProductInputChange(e)}
                  {...(errors.nameEN && { error: true, helperText: errors.nameEN })}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  select
                  id="standard-select-Unit"
                  variant="outlined"
                  className={classes.textField}
                  size="small"
                  label="Unit"
                  name="unitId"
                  value={product.unitId}
                  onChange={e => handleProductInputChange(e)}
                  {...(errors.unitId && { error: true, helperText: errors.unitId })}>
                  {units.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid container item xs={12} sm={12} md={4} lg={4}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <FormControlLabel
                    className={classes.checkBoxControl}
                    classes={{ label: classes.formControlLabel }}
                    control={
                      <Checkbox
                        variant="outlined"
                        name="isActive"
                        value={product.isActive}
                        onChange={e => {
                          setProduct({ ...product, isActive: e.target.checked });
                        }}
                      />
                    }
                    label="is Active?"
                  />
                </Grid>

                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <FormControlLabel
                    className={classes.checkBoxControl}
                    classes={{ label: classes.formControlLabel }}
                    control={
                      <Checkbox
                        variant="outlined"
                        name="hasAnyGrade"
                        checked={product.hasAnyGrade}
                        onChange={e => {
                          handleHasAnyGrade(e);
                        }}
                      />
                    }
                    label="Has Any Grade?"
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  className={classes.detailsField}
                  multiline
                  size="small"
                  margin="normal"
                  variant="outlined"
                  name="detailsEN"
                  label="Details"
                  value={product.detailsEN}
                  onChange={e => handleProductInputChange(e)}
                  {...(errors.detailsEN && { error: true, helperText: errors.detailsEN })}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              {grades.length > 0 ? (
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ background: '#A9A9A9', color: 'white' }}>
                  <h1 style={{ textAlign: 'center' }}> Assign Grade for the Product</h1>
                </Grid>
              ) : null}
              {grades.map((item, index) => (
                <Grid container item xs={12} sm={12} md={12} lg={12} key={item.fieldId}>
                  <Grid item xs={4} sm={4} md={5} lg={5}>
                    <TextField
                      className={classes.textField}
                      size="small"
                      variant="outlined"
                      name="nameEN"
                      label="Grade Name"
                      value={item.nameEN}
                      onChange={e => {
                        handleGradeInputChange(item.fieldId, e);
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={4} md={5} lg={5}>
                    <TextField
                      className={classes.textField}
                      size="small"
                      name="detailsEN"
                      label="Details"
                      variant="outlined"
                      value={item.detailsEN}
                      onChange={e => {
                        handleGradeInputChange(item.fieldId, e);
                      }}
                    />
                  </Grid>
                  <Grid container item xs={4} sm={4} md={2} lg={2}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box className={classes.addRemoveAction}>
                        <IconButton
                          style={{ color: '#DC004E' }}
                          onClick={() => {
                            handleRemoveFields(item.fieldId);
                          }}>
                          <RemoveCircleOutline />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      <Box className={classes.addRemoveAction}>
                        {index === grades.length - 1 ? (
                          <IconButton style={{ color: '#4CAF50' }} onClick={handleAddFields}>
                            <AddCircleOutline />
                          </IconButton>
                        ) : null}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Box display="flex">
                <Box ml={2}>
                  <Button type="submit" onClick={handleSubmit} size="small" variant="outlined" color="primary">
                    Submit
                  </Button>
                </Box>
                <Box ml={2}>
                  <NavLink to="/products/list">
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
    </PageContainer>
  );
}
