import CmtImage from '@coremat/CmtImage';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { departments } from '@jumbo/constants/UserDepartments';
import Controls from '@jumbo/controls/Controls';
import { toastAlerts } from '@jumbo/utils/alerts';
import { Form, useForm } from '@jumbo/utils/useForm';
import { Box, Button, Grid, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
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
    margin: theme.spacing(2),
    width: '90%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  photoBox: {
    width: '100%',
    height: '100%',
    minHeight: 200,
    overflow: 'hidden',
    '& .jvectormap-container': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: `${theme.palette.background.paper} !important`
    },
    padding: theme.spacing(5)
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
  changeButton: {
    color: 'green',
    fontWeight: 'bold'
  },
  cancelButton: {
    marginLeft: '0.8rem',
    marginTop: '0.2rem',
    color: 'red'
  },
  photoChange: {
    margin: theme.spacing(3)
  },
  avator: {
    border: 'solid 2px',
    borderColor: '#C6C6C6',
    height: '250px',
    width: '250px',
    objectFit: 'contain'
  }
}));

const breadcrumbs = [
  { label: 'Users', link: '/accounts/user' },
  { label: 'New', link: 'accounts/user-new', isActive: true }
];

const initialFieldsValues = {
  userId: '',
  employeeID: '',
  userName: '',
  fullName: '',
  email: '',
  jobTitle: '',
  phoneNumber: '',
  configuration: '',
  departmentName: '',
  currentPassword: '',
  newPassword: '',
  isEnabled: true
};

const userDepartments = [
  { label: 'Admin', value: departments.ADMIN },
  { label: 'ABP', value: departments.ABP },
  { label: 'Planning', value: departments.PLANNING },
  { label: 'Security', value: departments.SECURITY }
];

export default function UserForm(props) {
  const classes = useStyles();
  const [roleName, setRoleName] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isPhotoChange, setIsPhotoChange] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState({ image: null });
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('userName' in fieldValues) temp.userName = fieldValues.userName ? '' : 'This fields is requird';
    if ('employeeID' in fieldValues) temp.employeeID = fieldValues.employeeID ? '' : 'This fields is requird';
    if ('fullName' in fieldValues) temp.fullName = fieldValues.fullName ? '' : 'This fields is requird';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'This fields is requird';
    if ('jobTitle' in fieldValues) temp.jobTitle = fieldValues.jobTitle ? '' : 'This fields is requird';
    if ('phoneNumber' in fieldValues) temp.phoneNumber = fieldValues.phoneNumber ? '' : 'This fields is requird';
    if ('departmentName' in fieldValues) temp.departmentName = fieldValues.departmentName ? '' : 'This fields is requird';
    // if ('configuration' in fieldValues) temp.configuration = fieldValues.configuration ? '' : 'This fields is requird';
    if ('currentPassword' in fieldValues) temp.currentPassword = fieldValues.currentPassword ? '' : 'This fields is requird';
    if ('newPassword' in fieldValues) temp.newPassword = fieldValues.newPassword ? '' : 'This fields is requird';

    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };
  const { values, errors, setErrors, resetForm, handleInputChange } = useForm(initialFieldsValues, true, validate);

  useEffect(() => {
    document.title = `ERL-BDMS - Users`;
  }, []);

  useEffect(() => {
    async function getAllRoles() {
      await axios
        .get('api/Account/roles')
        .then(res => {
          const body = res.data;
          setRoles(body.map(item => item.name));
        })
        .catch(err => {
          console.log(err);
        });
    }
    getAllRoles();
  }, []);

  const handleMultipleRolesSelect = roles => {
    setRoleName(roles);
  };

  const handlePhotoChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
    setIsPhotoChange(true);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      var data = {
        userName: values.userName,
        employeeID: values.employeeID,
        fullName: values.fullName,
        email: values.email,
        jobTitle: values.jobTitle,
        phoneNumber: values.phoneNumber,
        configuration: values.configuration,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        departmentName: values.departmentName,
        isEnabled: values.isEnabled,
        roles: roleName
      };
      var form_data = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
      //Add Image Ifle Here
      if (file) {
        form_data.append('File', file, fileName);
      }
      axios
        .post(`${urls_v1.account.users.post_user}`, form_data)
        .then(res => {
          if (res.data || res.status === 204 || res.status === 201) {
            toastAlerts('success', 'Save Successfully!!!');
            props.history.replace('/accounts/user');
          } else {
            toastAlerts('error', 'Something Gonna Wrong!!!');
          }
        })
        .catch(({ response }) => {
          const message = response?.data?.error?.toString().replace(',', ' ');
          toastAlerts('error', `${message}`);
        });
    } else {
      toastAlerts('warning', 'Data Not Validated!!!');
    }
  };

  return (
    <PageContainer heading="New User Entry" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <Form onSubmit={handleSubmit}>
        <Paper className={classes.paper} elevation={3}>
          <Grid container>
            <Grid container item lg={8} sm={12} md={8}>
              {/* EmployeeId */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="employeeID"
                  label="Employee ID"
                  type="text"
                  value={values.employeeID}
                  error={errors.employeeID}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Job Title */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="jobTitle"
                  label="Designation"
                  type="text"
                  value={values.jobTitle}
                  error={errors.jobTitle}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* User Name */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="userName"
                  type="text"
                  label="User Name"
                  value={values.userName}
                  error={errors.userName}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Full Name */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="fullName"
                  type="text"
                  label="Full Name"
                  value={values.fullName}
                  error={errors.fullName}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Email */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="email"
                  type="text"
                  label="Email"
                  value={values.email}
                  error={errors.email}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Phone */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="phoneNumber"
                  type="text"
                  label="Phone"
                  value={values.phoneNumber}
                  error={errors.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Password */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                {/* <Controls.Input
                  name="currentPassword"
                  type="password"
                  label=" Password"
                  value={values.currentPassword}
                  error={errors.currentPassword}
                  onChange={handleInputChange}
                /> */}
                <Controls.PasswordBox
                  showPassword={showCurrentPassword}
                  setShowPassword={setShowCurrentPassword}
                  label="Password"
                  name="currentPassword"
                  value={values.currentPassword}
                  error={errors.currentPassword}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Confirm/NewPassword */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                {/* <Controls.Input
                  name="newPassword"
                  type="password"
                  label="Confirm Password"
                  value={values.newPassword}
                  error={errors.newPassword}
                  onChange={handleInputChange}
                /> */}
                <Controls.PasswordBox
                  showPassword={showNewPassword}
                  setShowPassword={setShowNewPassword}
                  label="Confirm Password"
                  name="newPassword"
                  value={values.newPassword}
                  error={errors.newPassword}
                  onChange={handleInputChange}
                />
              </Grid>
              {/* Department */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Select
                  label="Select Department"
                  name="departmentName"
                  value={values.departmentName}
                  onChange={handleInputChange}
                  error={errors.departmentName}
                  options={userDepartments}
                />
              </Grid>
              {/* Roles */}
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  size="small"
                  options={roles}
                  getOptionLabel={option => option}
                  value={roleName}
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    handleMultipleRolesSelect(newValue);
                  }}
                  renderInput={params => <TextField {...params} variant="outlined" label="Assign Role" />}
                />
              </Grid>
            </Grid>
            {/* Photo */}
            <Grid container item xs={12} lg={4} sm={12} md={4}>
              <Box className={classes.photoBox}>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
                  <CmtImage className={classes.avator} src={previewPhoto.image} />
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginTop="2%"
                  justifyContent="center"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  {!isPhotoChange ? (
                    <Button
                      className={classes.changeButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(true);
                      }}>
                      {' '}
                      Add Photo
                    </Button>
                  ) : (
                    <Button
                      className={classes.cancelButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(false);
                        setPreviewPhoto({ image: null });
                        setFile();
                        setFileName();
                      }}>
                      {' '}
                      Cancel
                    </Button>
                  )}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginTop="2%"
                  justifyContent="center"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  {isPhotoChange && (
                    <TextField
                      className={classes.photoChange}
                      size="small"
                      variant="outlined"
                      name="file"
                      onChange={handlePhotoChange}
                      type="file"
                    />
                  )}
                </Box>
              </Box>
            </Grid>
            {/* Action Buttons */}
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Controls.Button type="submit" text="Submit" />
              <Controls.Button text="Reset" onClick={resetForm} />
              <NavLink to="/accounts/user">
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
