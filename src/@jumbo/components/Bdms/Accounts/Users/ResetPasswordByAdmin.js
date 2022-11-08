import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: '400px'
  },
  field: {
    margin: theme.spacing(2),
    width: '80%'
  }
}));

export default function ResetPasswordByAdmin(props) {
  const classes = useStyles();
  const { recordForPassword, handleResetPassword } = props;

  const { authUser } = useSelector(({ auth }) => auth);

  const [changePassword, setChangePassword] = useState({
    userId: recordForPassword.id,
    userName: authUser.userName,
    password: ''
  });

  const handleSubmit = e => {
    e.preventDefault();
    handleResetPassword(changePassword);
  };

  return (
    <form>
      <Grid container direction="row" className={classes.root}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography className={classes.field}>
            Your User Name : <b>{changePassword.userName}</b>{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography className={classes.field}>
            Your are reseting password for <b>{recordForPassword.userName.toUpperCase()}</b>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <label className={classes.field}>Please Provide Your Password</label>
          <TextField
            className={classes.field}
            label="Confirm Your Password"
            type="password"
            size="small"
            variant="outlined"
            name="password"
            value={changePassword.password}
            onChange={e => {
              setChangePassword({ ...changePassword, password: e.target.value });
            }}
          />
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <Button variant="outlined" size="small" onClick={handleSubmit}>
            Reset Password
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
