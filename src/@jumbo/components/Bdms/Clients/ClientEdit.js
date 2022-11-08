import CmtImage from '@coremat/CmtImage';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Box, Grid } from '@material-ui/core';
import Input from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  textField: {
    '& .MuiTextField-root': {
      margin: theme.spacing(6)
    }
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Clients', link: '/clients/list' },
  { label: 'Edit', link: '', isActive: true }
];

export default function ClientEdit(props) {
  const classes = useStyles();
  const data = props.location.state.client;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('nameEN' in fieldValues) temp.nameEN = fieldValues.nameEN ? '' : 'This fields is requird';
    if ('shortNameEN' in fieldValues) temp.shortNameEN = fieldValues.shortNameEN ? '' : 'This fields is requird';
    if ('addressEN' in fieldValues) temp.addressEN = fieldValues.nameEN ? '' : 'This fields is requird';
    if ('binNumberEN' in fieldValues) temp.binNumberEN = fieldValues.binNumberEN ? '' : 'This fields is requird';
    if ('phoneNumberEN' in fieldValues) temp.phoneNumberEN = fieldValues.phoneNumberEN ? '' : 'This fields is requird';
    if ('contactPerson' in fieldValues) temp.contactPerson = fieldValues.contactPerson ? '' : 'This fields is requird';
    if ('contactPersonDesignation' in fieldValues)
      temp.contactPersonDesignation = fieldValues.contactPersonDesignation ? '' : 'This fields is requird';
    if ('contactPersonPhoneNumber' in fieldValues)
      temp.contactPersonPhoneNumber = fieldValues.contactPersonPhoneNumber ? '' : 'This fields is requird';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'This fields is requird';
    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };

  const { values, errors, setErrors, handleInputChange } = useForm(data, true, validate);

  ///Start Photo State and Handle
  const imageDataType = 'data:image/png;base64';
  const [fileBase64, setFileBase64] = useState('');
  const imageUrl = `${imageDataType},${values.logo}`;
  const [previewPhoto, setPreviewPhoto] = useState({ image: imageUrl });

  const handlePhotoChange = e => {
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
    handlePhotoToBase64(e.target.files[0]);
  };
  const handlePhotoToBase64 = file => {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        var splitBase64 = Base64.split(',')[1];
        setFileBase64(splitBase64);
      };
      reader.onerror = error => {
        console.log('error', error);
      };
    }
  };

  ///Photo State and Handle End

  // Start Submit
  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      const data = { ...values };
      data.logo = fileBase64 !== '' ? fileBase64 : values?.logo;
      if (data.id !== 0) {
        axios
          .put(`${urls_v1.customer.put}/${data.key}`, data)
          .then(({ data }) => {
            if (data.succeeded) {
              props.history.replace('/clients/active-clients');
            }
          })
          .catch(error => {
            NotificationManager.error('Something Gonna Wrong');
          });
      } else {
        NotificationManager.warning('Id Not Found');
      }
    } else {
      NotificationManager.warning('Data Not Validated!!!');
    }
  };
  // Submit End

  return (
    <PageContainer heading="Edit Clients" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <Form>
        <Paper className={classes.paper} elevation={3}>
          <Grid container>
            <Grid container item lg={8} sm={12} md={8}>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  type="text"
                  name="nameEN"
                  label="Customer Name"
                  value={values.nameEN}
                  error={errors.nameEN}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  type="text"
                  name="shortNameEN"
                  label="Short Name"
                  value={values.shortNameEN}
                  error={errors.shortNameEN}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  type="text"
                  name="binNumberEN"
                  label="BIN"
                  value={values.binNumberEN}
                  error={errors.binNumberEN}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  name="phoneNumberEN"
                  label="Phone"
                  value={values.phoneNumberEN}
                  error={errors.phoneNumberEN}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  name="contactPerson"
                  label="Contact Person"
                  value={values.contactPerson}
                  error={errors.contactPerson}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  name="contactPersonPhoneNumber"
                  label="C.P. Phone No"
                  value={values.contactPersonPhoneNumber}
                  error={errors.contactPersonPhoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  name="contactPersonDesignation"
                  label="C.P. Designation"
                  value={values.contactPersonDesignation}
                  error={errors.contactPersonDesignation}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  label="Fax Number"
                  name="faxNumberEN"
                  value={values.faxNumberEN}
                  error={errors.faxNumberEN}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  name="email"
                  label="Email"
                  value={values.email}
                  error={errors.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  margin="normal"
                  name="website"
                  label="Website"
                  value={values.website}
                  error={errors.website}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Controls.Input
                  style={{ width: '90%' }}
                  multiline
                  margin="normal"
                  name="addressEN"
                  label="Address"
                  value={values.addressEN}
                  error={errors.addressEN}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} lg={6} sm={12} md={6}>
                <Box>
                  <Controls.Checkbox
                    name="isActive"
                    label="Is Active?"
                    value={values.isActive}
                    onChange={handleInputChange}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container item xs={12} lg={4} sm={12} md={4}>
              <Grid item xs={12} lg={12} sm={12} md={12}>
                <CmtImage
                  src={previewPhoto.image}
                  //src={`${imageDataType},${values.logo}`}
                  style={{ height: '250px', width: '250px', objectFit: 'contain' }}
                />
                <br />
                <Input type="file" onChange={handlePhotoChange} name="file" required label="Photo" />
                <br />
              </Grid>
            </Grid>
            <br />
            <Grid container item xs={12} lg={12} sm={12} md={12} justify="flex-end">
              <Controls.Button type="submit" text="Update" onClick={handleSubmit} />
              <NavLink to="/clients/active-clients">
                <Controls.Button text="Cancel" />
              </NavLink>
            </Grid>
          </Grid>
        </Paper>
      </Form>
      <NotificationContainer />
    </PageContainer>
  );
}
