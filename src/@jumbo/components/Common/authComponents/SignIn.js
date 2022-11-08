import { Box, fade } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import CmtImage from '../../../../@coremat/CmtImage';
import { AuhMethods } from '../../../../services/auth';
import { CurrentAuthMethod } from '../../../constants/AppConstants';
import IntlMessages from '../../../utils/IntlMessages';
import ContentLoader from '../../ContentLoader';
import AuthWrapper from './AuthWrapper';

const useStyles = makeStyles(theme => ({
  authThumb: {
    backgroundColor: '#FFF',
    display: 'flex',
    border: '2px solid #C6C6C6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2
    }
  },
  authContent: {
    padding: 30,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: props => (props.variant === 'default' ? '50%' : '100%'),
      order: 1
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
  },
  formcontrolLabelRoot: {
    '& .MuiFormControlLabel-label': {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12
      }
    }
  }
}));
//variant = 'default', 'standard'
const SignIn = ({ method = CurrentAuthMethod, variant = 'standard', wrapperVariant = 'standard' }) => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const classes = useStyles({ variant });

  const onSubmit = () => {
    dispatch(AuhMethods[method].onLogin({ userName, password }));
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
      {variant === 'standard' ? (
        <Box className={classes.authThumb}>
          <CmtImage src={'/images/auth/erlLoginImage.png'} />
        </Box>
      ) : null}
      <Box className={classes.authContent}>
        <Box mb={7}></Box>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Login
        </Typography>
        <form>
          <Box mb={2}>
            <TextField
              label={<IntlMessages id="appModule.name" />}
              fullWidth
              onChange={event => setUsername(event.target.value)}
              defaultValue={userName}
              margin="normal"
              variant="outlined"
              size="small"
              className={classes.textFieldRoot}
              onKeyPress={handleKeypress}
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="password"
              label={<IntlMessages id="appModule.password" />}
              fullWidth
              size="small"
              onChange={event => setPassword(event.target.value)}
              defaultValue={password}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              onKeyPress={handleKeypress}
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
            {/* <FormControlLabel
              className={classes.formcontrolLabelRoot}
              control={<Checkbox name="checkedA" />}
              label="Remember me"
            /> */}
            <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
              <NavLink to="/forgot-password">
                <IntlMessages id="appModule.forgotPassword" />
              </NavLink>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
            <Button id="btnSubmit" disableFocusRipple size="small" onClick={onSubmit} variant="contained" color="primary">
              <IntlMessages id="appModule.signIn" />
            </Button>
            {/* <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
              <NavLink to="/forgot-password">
                <IntlMessages id="appModule.forgotPassword" />
              </NavLink>
            </Box>
            <Box component="p" fontSize={{ xs: 12, sm: 16 }}>
              <NavLink to="/signup">
                <IntlMessages id="signIn.signUp" />
              </NavLink>
            </Box> */}
          </Box>
        </form>

        {dispatch(AuhMethods[method].getSocialMediaIcons())}

        <ContentLoader />
      </Box>
    </AuthWrapper>
  );
};

export default SignIn;
