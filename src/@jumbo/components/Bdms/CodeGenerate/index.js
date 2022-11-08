import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { urls_v2 } from '@jumbo/constants/ApplicationUrls/v2';
import { loadingConfirmationToken } from '@jumbo/constants/PermissionsType';
import { departments } from '@jumbo/constants/UserDepartments';
import Controls from '@jumbo/controls/Controls';
import { sweetAlerts } from '@jumbo/utils/alerts';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../../../services/auth/jwt/config';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Code Generator', link: '', isActive: true }
];

const userTypes = [
  { id: 'self', title: 'Self' },
  { id: 'others', title: 'Others' }
];

const initialFieldsValues = {
  userId: '',
  departmentName: ''
};

const userDepartments = [
  { label: 'Admin', value: departments.ADMIN },
  { label: 'ABP', value: departments.ABP },
  { label: 'Planning', value: departments.PLANNING },
  { label: 'Security', value: departments.SECURITY }
];

const CodeGenerate = () => {
  const [state, setState] = useState(initialFieldsValues);
  const [userType, setUserType] = useState('others');
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const { authUser, userPermission } = useSelector(({ auth }) => auth);
  const [departmentName, setDepartmentName] = useState(authUser.departmentName);

  //#region UDF
  const getUsers = () => {
    const selectDepertmentName = departmentName !== '' ? departmentName : authUser.departmentName;
    axios
      .get(`${urls_v1.account.users.get_users_name}/${selectDepertmentName}`)
      .then(res => {
        const body = res.data.map(user => ({
          label: user.name,
          value: user.id
        }));
        setUsers(body);
      })
      .catch(err => {
        console.log(err);
      });
  };

  //#endregion

  useEffect(() => {
    document.title = `ERL-BDMS - Code Generate`;
  }, []);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentName]);

  const handleDepartmentChange = e => {
    if (e.target.value === '') {
      setUsers([]);
      setState(initialFieldsValues);
      setDepartmentName(e.target.value);
      // alert('You must select a department');
      sweetAlerts('error', 'Error', 'You must select a department!!!');
      setDepartmentName(authUser.departmentName);
    } else {
      setDepartmentName(e.target.value);
    }
  };

  const onUserTypeChange = e => {
    setUserType(e.target.value);
    setState(initialFieldsValues);
    setUserName('');
    setDepartmentName(authUser.departmentName);
  };

  const onUserChange = e => {
    setState({ ...state, userId: e.target.value });
    const findSelectedUser = users.find(user => user.value === e.target.value);
    setUserName(findSelectedUser.label);
  };

  const handleClose = () => {
    setOpen(false);
    setToken('');
  };

  const onSubmit = e => {
    e.preventDefault();
    const reqObj = {
      userId: userType === 'self' ? authUser?.id : state.userId,
      departmentName: departmentName !== '' ? departmentName : authUser.departmentName
    };

    axios
      .post(urls_v2.confirmationToken.generate_loading_confirmation_token, reqObj)
      .then(({ data }) => {
        if (data.succeeded) {
          setToken(data.message);
          setOpen(true);
        } else {
          alert('warking');
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <PageContainer heading="Code Generator" breadcrumbs={breadcrumbs}>
      <GridContainer>
        <Grid component={Paper} container item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Box ml={5}>
              <Controls.RadioGroup
                multiline
                name="gender"
                label="Select User Type"
                value={userType}
                items={userTypes}
                onChange={onUserTypeChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            {userPermission?.includes(loadingConfirmationToken.VIEW_DEPARTMENT) ? (
              <Box>
                {userType === 'others' && (
                  <Controls.Select
                    fullWidth
                    label="Select Department"
                    name="departmentName"
                    value={departmentName}
                    onChange={e => {
                      handleDepartmentChange(e);
                    }}
                    options={userDepartments}
                  />
                )}
              </Box>
            ) : (
              <Box m={6}>
                <Typography>
                  Department: <span style={{ fontWeight: 'bold', color: 'green' }}>{authUser.departmentName} </span>
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Box>
              {userType === 'others' && (
                <Controls.Select
                  fullWidth
                  label="Select User"
                  name="userId"
                  value={state.userId}
                  onChange={onUserChange}
                  options={users}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Box m={5}>
              <Controls.Button
                size="large"
                fullWidth
                text="Submit"
                disabled={userType === 'others' && !state.userId}
                onClick={onSubmit}
              />
            </Box>
          </Grid>
        </Grid>
        <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle>{`Code Generated for :
        ${userType === 'self' && userName === '' ? authUser?.fullName : userName}`}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please Keep this <strong>token</strong> sincerely.
            </DialogContentText>
            <hr />
            <DialogContentText>
              <span style={{ fontSize: 20 }}>
                <mark>{token}</mark>
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Controls.Button text="Ok" onClick={handleClose} />
          </DialogActions>
        </Dialog>
      </GridContainer>
    </PageContainer>
  );
};

export default CodeGenerate;
