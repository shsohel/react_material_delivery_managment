import CmtImage from '@coremat/CmtImage';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Grid } from '@material-ui/core';
import Input from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../services/auth/jwt/config';

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
  { label: 'List Company', link: '/companies/list' },
  { label: 'Edit', link: 'companies/edit', isActive: true }
];

export default function ClientEdit(props) {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const data = props.location.state.company;
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('nameEN' in fieldValues) temp.nameEN = fieldValues.nameEN ? '' : 'This fields is requird';
    // if ('shortCode' in fieldValues) temp.shortCode = fieldValues.shortCode ? '' : 'This fields is requird';
    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };

  const { values, errors, setErrors, handleInputChange } = useForm(data, true, validate);

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const imageUrl = `${REACT_APP_BASE_URL}/${data.companyMedia.fileUrl}`;
  const [previewPhoto, setPreviewPhoto] = useState({ image: imageUrl });

  const handlePhotoChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
  };

  // Start Submit
  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      const data = values;
      if (data.id !== 0) {
        var form_data = new FormData();
        for (var key in data) {
          form_data.append(key, data[key]);
        }
        if (file) {
          form_data.append('File', file, fileName);
        }
        axios
          .put(`${urls_v1.company.put}/${data.key}`, form_data)
          .then(({ data }) => {
            if (data.succeeded) {
              axios.get(`${urls_v1.company.get_by_key}/${values.key}`).then(({ data }) => {
                const editcompany = data.data;
                props.history.replace('/companies/details', { editcompany });
              });
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
    <PageContainer heading="Editing Company" breadcrumbs={breadcrumbs}>
      <hr />
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
                  label="Company Name"
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
                  label="Fax Number"
                  name="faxNumberEN"
                  value={values.faxNumberEN}
                  error={errors.contactPerson}
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
                  name="addressEN"
                  label="Address"
                  value={values.addressEN}
                  error={errors.addressEN}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} lg={4} sm={12} md={4}>
              <Grid item xs={12} lg={12} sm={12} md={12}>
                <CmtImage src={previewPhoto.image} style={{ height: '250px', width: '250px', objectFit: 'contain' }} />
                <br />
                <Input type="file" onChange={handlePhotoChange} name="file" required label="Photo" />
                <br />
              </Grid>
            </Grid>
            <br />
            <Grid container item xs={12} lg={12} sm={12} md={12} justify="flex-end">
              <Controls.Button type="submit" text="Update" onClick={handleSubmit} />
            </Grid>
          </Grid>
        </Paper>
      </Form>
      <NotificationContainer />
    </PageContainer>
  );
}
