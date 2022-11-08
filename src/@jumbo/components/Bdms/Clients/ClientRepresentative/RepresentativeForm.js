import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
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
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  },
  checkBoxControl: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  }
}));

export default function RepresentativeForm(props) {
  const classes = useStyles();
  const { recordForEditKey, closePopupAfterAdd, closePopupAfterEdit } = props;
  const [representative, setRepresentative] = useState({
    name: '',
    contactNumber: '',
    isActive: false
  });
  const recordForEdit = () => {
    if (recordForEditKey) {
      axios.get(`${urls_v1.representative.get_by_key}/${recordForEditKey}`).then(({ data }) => {
        const body = data.data;
        setRepresentative({
          key: body.key,
          id: body.id,
          name: body.name,
          contactNumber: body.contactNumber,
          isActive: body.isActive
        });
      });
    }
  };

  useEffect(() => {
    recordForEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onhandleSubmit = () => {
    if (recordForEditKey) {
      axios.put(`${urls_v1.representative.put}/${recordForEditKey}`, representative).then(({ data }) => {
        if (data.succeeded) {
          closePopupAfterEdit();
        } else {
          NotificationManager.warning(data.message);
        }
      });
    } else {
      axios
        .post(urls_v1.representative.post, representative)
        .then(({ data }) => {
          if (data.succeeded) {
            closePopupAfterAdd();
          } else {
            NotificationManager.warning(data.message);
          }
        })
        .catch(({ response }) => {
          NotificationManager.warning(response.data.Message);
        });
    }
  };
  return (
    <div>
      <Grid container direction="column" justify="center">
        <NotificationContainer />
        <Grid item xs>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                className={classes.formControl}
                size="small"
                label="Representative"
                variant="outlined"
                value={representative.name}
                name="name"
                onChange={e => {
                  setRepresentative({ ...representative, name: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                className={classes.formControl}
                size="small"
                label="Contact Number"
                variant="outlined"
                value={representative.contactNumber}
                name="contactNumber"
                onChange={e => {
                  setRepresentative({ ...representative, contactNumber: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControlLabel
                className={classes.checkBoxControl}
                control={
                  <Checkbox
                    variant="outlined"
                    name="isActive"
                    checked={representative.isActive}
                    onChange={e => {
                      setRepresentative({ ...representative, isActive: e.target.checked });
                    }}
                  />
                }
                label="is Active?"
              />
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Button
                type="submit"
                size="small"
                variant="outlined"
                onClick={() => {
                  onhandleSubmit();
                }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
