import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { toastAlerts } from '@jumbo/utils/alerts';
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
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
    width: '96%'
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
  { label: 'Prdoduct', link: '/products/list' },
  { label: 'New', link: '', isActive: true }
];

export default function ProductEdit(props) {
  const classes = useStyles();
  const data = props.location.state.product; ///Get Editing Data by Location State
  const [units, setUnits] = useState([]); // For unit Dropdown
  const [errors, setErrors] = useState({});
  const [productEdit, setproductEdit] = useState({
    id: data.id,
    key: data.key,
    nameEN: data.nameEN,
    unitId: data.unit.id,
    detailsEN: data.detailsEN,
    isActive: data.isActive,
    hasAnyGrade: data.hasAnyGrade
  });

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

  const validate = (fieldValues = productEdit) => {
    let temp = { ...errors };
    if ('nameEN' in fieldValues) temp.nameEN = fieldValues.nameEN ? '' : 'This Product Name field is required';
    if ('detailsEN' in fieldValues) temp.detailsEN = fieldValues.detailsEN ? '' : 'This Details field is required';
    if ('unitId' in fieldValues) temp.unitId = fieldValues.unitId ? '' : 'Please select a unit';
    setErrors({
      ...temp
    });
    if (fieldValues === productEdit) return Object.values(temp).every(x => x === '');
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    setproductEdit({
      ...productEdit,
      ...fieldValue
    });
    validate(fieldValue);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validate()) {
      axios
        .put(`${urls_v1.products.put}/${productEdit.key}`, productEdit)
        .then(({ data }) => {
          if (data.succeeded) {
            toastAlerts('success', 'Update Successfully Done!!!');
            props.history.replace('/products/list');
          } else {
            toastAlerts('error', 'Something Gonna Wrong!!!');
          }
        })
        .catch(({ response }) => {
          toastAlerts('warning', response.data.Message);
        });
    }
  };

  return (
    <PageContainer heading="Editing Prdoduct" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <form>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="column" justify="center" alignItems="flex-start" spacing={3}>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  label="Name"
                  name="nameEN"
                  value={productEdit.nameEN}
                  onChange={e => {
                    handleInputChange(e);
                  }}
                  {...(errors.nameEN && { error: true, helperText: errors.nameEN })}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  select
                  variant="outlined"
                  id="standard-select-Unit"
                  className={classes.textField}
                  size="small"
                  label="Unit"
                  name="unitId"
                  value={productEdit.unitId}
                  onChange={e => {
                    handleInputChange(e);
                  }}
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
                    classes={{ label: classes.formControlLabel }}
                    className={classes.checkBoxControl}
                    control={
                      <Checkbox
                        variant="outlined"
                        name="isActive"
                        checked={productEdit.isActive}
                        onChange={e => {
                          setproductEdit({ ...productEdit, isActive: e.target.checked });
                        }}
                      />
                    }
                    label="is Active?"
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <FormControlLabel
                    classes={{ label: classes.formControlLabel }}
                    className={classes.checkBoxControl}
                    control={
                      <Checkbox
                        variant="outlined"
                        name="hasAnyGrade"
                        checked={productEdit.hasAnyGrade}
                        onChange={e => {
                          setproductEdit({ ...productEdit, hasAnyGrade: e.target.checked });
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
                  margin="normal"
                  variant="outlined"
                  size="small"
                  label="Details"
                  name="detailsEN"
                  value={productEdit.detailsEN}
                  onChange={e => {
                    handleInputChange(e);
                  }}
                  {...(errors.detailsEN && { error: true, helperText: errors.detailsEN })}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Box display="flex">
                <Box ml={2}>
                  <Button onClick={handleSubmit} size="small" variant="outlined" color="primary">
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
