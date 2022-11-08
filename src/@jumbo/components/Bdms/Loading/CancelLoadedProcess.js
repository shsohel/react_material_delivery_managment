import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  rootForm: {
    width: '500px'
  },
  textField: {
    margin: theme.spacing(1),
    width: '100%'
  }
}));

export default function CancelLoadedProcess(props) {
  const classes = useStyles();
  const { itemForCancel, closePopup } = props;
  const { authUser } = useSelector(state => state.auth);
  const [cancelLoaded, setCancelLoaded] = useState({
    key: itemForCancel.key,
    notes: ''
  });

  const handleCancel = async e => {
    e.preventDefault();
    const body = {
      key: cancelLoaded.key,
      notes: authUser.userName.concat(': ').concat(cancelLoaded.notes)
    };
    await axios
      .put(`${urls_v1.loading.cancel_loadingProcess}/${itemForCancel.key}`, body)
      .then(({ data }) => {
        if (data.succeeded) {
          closePopup();
          NotificationManager.success(data.message);
        } else {
          NotificationManager.warning(data.message);
        }
      })
      .catch(({ response }) => {
        NotificationManager.warning(response.data.Message);
      });
  };
  return (
    <form className={classes.rootForm} onSubmit={handleCancel}>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography variant="h5" component="div">
            Cancelation process for entry permit :{' '}
            <mark>
              <i>{itemForCancel.permitNumber}</i>
            </mark>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            className={classes.textField}
            required
            multiline
            label="Please write a note for cancel"
            size="medium"
            variant="outlined"
            value={cancelLoaded.notes}
            onChange={e => {
              setCancelLoaded({ ...cancelLoaded, notes: e.target.value });
            }}
          />
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <Button type="submit" variant="outlined" size="small">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
