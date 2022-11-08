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
  { label: 'Updating', link: 'accounts/user-update', isActive: true }
];

const userDepartments = [
  { label: 'Admin', value: departments.ADMIN },
  { label: 'ABP', value: departments.ABP },
  { label: 'Planning', value: departments.PLANNING },
  { label: 'Security', value: departments.SECURITY }
];

export default function UserForm(props) {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const data = props.history.location.state;
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isPhotoChange, setIsPhotoChange] = useState(false);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('userName' in fieldValues) temp.userName = fieldValues.userName ? '' : 'This fields is requird';
    if ('employeeID' in fieldValues) temp.employeeID = fieldValues.employeeID ? '' : 'This fields is requird';
    if ('fullName' in fieldValues) temp.fullName = fieldValues.fullName ? '' : 'This fields is requird';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'This fields is requird';
    if ('jobTitle' in fieldValues) temp.jobTitle = fieldValues.jobTitle ? '' : 'This fields is requird';
    if ('phoneNumber' in fieldValues) temp.phoneNumber = fieldValues.phoneNumber ? '' : 'This fields is requird';
    if ('departmentName' in fieldValues) temp.departmentName = fieldValues.departmentName ? '' : 'This fields is requird';
    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };
  const { values, errors, setErrors, handleInputChange } = useForm(data, true, validate);

  ///Start Photo State and Handle
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const imageUrl = `${REACT_APP_BASE_URL}/${data?.media?.fileUrl}`;
  const [previewPhoto, setPreviewPhoto] = useState({ image: imageUrl });

  const handlePhotoChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
  };

  ///Photo State and Handle End
  const [roleName, setRoleName] = useState(data.roles);
  const [roles, setRoles] = useState([]);
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const getAllRoles = async () => {
    await axios
      .get(urls_v1.account.roles.get_all)
      .then(res => {
        const body = res.data;
        setRoles(body.map(item => item.name));
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  const handleMultipleRolesSelect = roles => {
    setRoleName(roles);
  };

  const handleSubmit = event => {
    event.preventDefault();
    var data = {
      id: values.id,
      userName: values.userName,
      employeeID: values.employeeID,
      fullName: values.fullName,
      email: values.email,
      jobTitle: values.jobTitle,
      phoneNumber: values.phoneNumber,
      isEnabled: values.isEnabled,
      departmentName: values.departmentName,
      currentPassword: passwordChange.currentPassword,
      newPassword: passwordChange.newPassword,
      configuration: '',
      roles: roleName
    };
    var form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    if (file) {
      form_data.append('File', file, fileName);
    }
    axios
      .put(`${urls_v1.account.users.put_user_by_userId}/${data.id}`, form_data)
      .then(res => {
        console.log(res);
        if (res.data || res.status === 204) {
          toastAlerts('success', 'Save Successfully!!!');
          props.history.replace('/accounts/user');
        } else {
          toastAlerts('error', data.message);
        }
      })
      .catch(({ response }) => {
        const message = response?.data?.error?.toString().replace(',', ' ');
        toastAlerts('error', `${message}`);
      });
  };

  return (
    <PageContainer heading="Edit User" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <Form onSubmit={handleSubmit}>
        <Paper className={classes.paper} elevation={3}>
          <Grid container spacing={3}>
            <Grid container item lg={8} sm={12} md={8} spacing={3}>
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
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Controls.Input
                  name="userName"
                  disabled
                  type="text"
                  label="User Name"
                  value={values.userName}
                  error={errors.userName}
                  onChange={handleInputChange}
                />
              </Grid>
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
              <Grid item xs={12} sm={6} lg={6} md={6}>
                {!isChangePassword ? (
                  <Button
                    className={classes.changeButton}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setIsChangePassword(true);
                    }}>
                    {' '}
                    Change Password
                  </Button>
                ) : (
                  <Button
                    className={classes.cancelButton}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setIsChangePassword(false);
                      setPasswordChange({ currentPassword: '', newPassword: '' });
                    }}>
                    {' '}
                    Cancel
                  </Button>
                )}
              </Grid>
              {isChangePassword && (
                <>
                  <Grid item xs={12} sm={6} lg={6} md={6}>
                    <TextField
                      className={classes.textField}
                      type="password"
                      size="small"
                      variant="outlined"
                      margin="normal"
                      name="currentPassword"
                      label="Current Password"
                      value={passwordChange.currentPassword}
                      onChange={e => {
                        setPasswordChange({ ...passwordChange, currentPassword: e.target.value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6} md={6}>
                    <TextField
                      className={classes.textField}
                      type="password"
                      size="small"
                      variant="outlined"
                      margin="normal"
                      name="newPassword"
                      label="New Password"
                      value={passwordChange.newPassword}
                      onChange={e => {
                        setPasswordChange({ ...passwordChange, newPassword: e.target.value });
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container item xs={12} lg={4} sm={12} md={4} justify="center">
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
                      Change Photo
                    </Button>
                  ) : (
                    <Button
                      className={classes.cancelButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(false);
                        setPreviewPhoto({ image: imageUrl });
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

            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Controls.Button type="submit" text="Submit" />
              <NavLink to="/accounts/user">
                <Controls.Button text="Cancel" />
              </NavLink>
            </Grid>
          </Grid>
        </Paper>
      </Form>
    </PageContainer>
  );
}
