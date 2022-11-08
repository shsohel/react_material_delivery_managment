import GridContainer from '@jumbo/components/GridContainer';
import { Box, fade, Grid, LinearProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AuhMethods } from '../../../../services/auth';
import { CurrentAuthMethod } from '../../../constants/AppConstants';
import ContentLoader from '../../ContentLoader';
import AuthWrapper from './AuthWrapper';
const useStyles = makeStyles(theme => ({
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      order: 1,
      width: props => (props.variant === 'default' ? '50%' : '100%')
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50
    }
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary
  },
  warningRoot: {
    color: 'red'
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: fade(theme.palette.common.dark, 0.12)
    }
  }
}));
//variant = 'default', 'standard', 'bgColor'
const ResetPassword = ({ method = CurrentAuthMethod, variant = 'default', wrapperVariant = 'default' }) => {
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirmPassword: ''
  });
  const dispatch = useDispatch();
  const classes = useStyles({ variant });

  const urlParams = new URLSearchParams(window.location.search);

  var email = urlParams.get('email');
  var token = urlParams.get('token').replace(/ /g, '+');

  const resetPass = {
    Email: email,
    Token: token,
    Password: resetPassword.password,
    ConfirmPassword: resetPassword.confirmPassword
  };

  const onSubmit = () => {
    dispatch(AuhMethods[method].onResetPassword({ resetPass }));
  };

  const handleKeypress = e => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  useEffect(() => {
    document.getElementById('btnSubmit').focus();
  }, []);

  return (
    <AuthWrapper variant={wrapperVariant}>
      <NotificationContainer />
      <GridContainer className={classes.authContent}>
        <Grid item xs={12} sm={12} md={12} xl={12}>
          <Typography component="div" variant="h1" className={classes.titleRoot}>
            Reset Password
          </Typography>
        </Grid>
        <Grid container item xs={12} sm={12} md={12} xl={12} spacing={2}>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <TextField
              className={classes.textFieldRoot}
              label="New Password"
              type="password"
              fullWidth
              onChange={e => setResetPassword({ ...resetPassword, password: e.target.value })}
              value={resetPassword.password}
              margin="normal"
              size="small"
              variant="outlined"
              onKeyPress={handleKeypress}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <TextField
              className={classes.textFieldRoot}
              label="Confirm Password"
              fullWidth
              type="password"
              onChange={e => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
              value={resetPassword.confirmPassword}
              margin="normal"
              size="small"
              variant="outlined"
              onKeyPress={handleKeypress}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            {resetPassword.password === resetPassword.confirmPassword
              ? ''
              : resetPassword.confirmPassword !== '' && (
                  <>
                    <Typography className={classes.warningRoot} component="p">
                      New Password & Confirm Password are not matched
                    </Typography>
                    <LinearProgress />
                  </>
                )}
          </Grid>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <Box>
              <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
                <NavLink to="/signin">Back to Signin?</NavLink>
              </Box>
              <Box mt={3} mb={5}>
                <Button
                  id="btnSubmit"
                  onClick={onSubmit}
                  disableFocusRipple
                  size="small"
                  variant="contained"
                  color="primary">
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <ContentLoader />
      </GridContainer>
    </AuthWrapper>
  );
};

export default ResetPassword;
