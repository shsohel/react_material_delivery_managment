import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { brtaInformation } from '@jumbo/constants/PermissionsType';
import { Button, Grid, lighten, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  textField: {
    width: '80%'
  }
}));

const initialFieldValue = {
  id: '',
  key: '',
  region: '',
  isActive: true
};

export default function CityForm(props) {
  const classes = useStyles();
  const { recordForEdit, getAllCityRegion } = props;
  const [city, setCity] = useState(initialFieldValue);
  const { userPermission } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (recordForEdit) {
      setCity({
        ...city,
        id: recordForEdit.id,
        key: recordForEdit.key,
        region: recordForEdit.region
      });
    }
  }, [recordForEdit]);

  const handleSubmit = async () => {
    if (city.key) {
      await axios
        .put(`${urls_v1.brtaInformation.put}/${city.key}`, city)
        .then(({ data }) => {
          if (data.succeeded) {
            NotificationManager.success(data.message);
            getAllCityRegion();
            setCity(initialFieldValue);
          } else {
            NotificationManager.error(data.message);
          }
        })
        .catch(error => NotificationManager.warning('Someting Gonna Wrong!!'));
    } else {
      await axios
        .post(`${urls_v1.brtaInformation.post}`, city)
        .then(({ data }) => {
          if (data.succeeded) {
            NotificationManager.success(data.message);
            getAllCityRegion();
            setCity(initialFieldValue);
          } else {
            NotificationManager.error(data.message);
          }
        })
        .catch(error => NotificationManager.warning('Someting Gonna Wrong!!'));
    }
  };

  return (
    <Grid container spacing={5}>
      <NotificationContainer />
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          className={classes.textField}
          size="small"
          name="region"
          variant="outlined"
          label="Region"
          value={city.region}
          onChange={e => {
            setCity({ ...city, region: e.target.value });
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <Button
          disabled={!userPermission?.includes(brtaInformation.CREATE)}
          variant="outlined"
          onClick={() => {
            handleSubmit();
          }}>
          Submit
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <Button
          variant="outlined"
          onClick={() => {
            setCity(initialFieldValue);
          }}>
          Reset
        </Button>
      </Grid>
    </Grid>
  );
}
