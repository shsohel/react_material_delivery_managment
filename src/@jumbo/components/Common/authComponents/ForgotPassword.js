import { isValidEmail } from '@jumbo/utils/commonHelper';
import { Box, fade } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AuhMethods } from '../../../../services/auth';
import { CurrentAuthMethod } from '../../../constants/AppConstants';
import IntlMessages from '../../../utils/IntlMessages';
import ContentLoader from '../../ContentLoader';
import AuthWrapper from './AuthWrapper';
const useStyles = makeStyles(theme => ({
  authThumb: {
    backgroundColor: fade(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2
    }
  },
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
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: fade(theme.palette.common.dark, 0.12)
    }
  }
}));
//variant = 'default', 'standard', 'bgColor'
const ForgotPassword = ({ method = CurrentAuthMethod, variant = 'default', wrapperVariant = 'default' }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles({ variant });

  const onSubmit = () => {
    const isValidMail = isValidEmail(email);
    if (!isValidMail) {
      NotificationManager.error('Email must be valid');
    } else {
      dispatch(AuhMethods[method].onForgotPassword({ email }));
    }
  };

  return (
    <AuthWrapper variant={wrapperVariant}>
      <NotificationContainer />
      <Box className={classes.authContent}>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          ForgotPassword
        </Typography>
        <form>
          <Box mb={5}>
            <TextField
              label={<IntlMessages id="appModule.email" />}
              fullWidth
              onChange={event => setEmail(event.target.value)}
              type="email"
              value={email}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
            />
          </Box>
          <Box mb={5} display="flex">
            <Box mr={2}>
              <Button onClick={onSubmit} size="small" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
            <Box mr={2}>
              <NavLink to="/signin">
                <Button size="small" variant="contained" color="primary">
                  Back
                </Button>
              </NavLink>
            </Box>
          </Box>
        </form>
        <ContentLoader />
      </Box>
    </AuthWrapper>
  );
};

export default ForgotPassword;
