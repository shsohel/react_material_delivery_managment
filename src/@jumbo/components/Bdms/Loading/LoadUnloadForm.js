import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Box, Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(6),
    width: '100%'
  }
}));

export default function OrderConfirmedForm(props) {
  const classes = useStyles();
  const { entryPermitKey, closePopup } = props;
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [postLoadUnload, setPostLoadUnload] = useState(null);
  const [isEmptyTransport, setIsEmptyTransport] = useState(true);
  const [isThisTransportWithDrum, setIsThisTransportWithDrum] = useState(false);

  const getEntryPermitByKey = async () => {
    try {
      await axios.get(`${urls_v1.entryPermit.get_by_key}/${entryPermitKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setPostLoadUnload({
            emptyTransportWeight: body.emptyTransportWeight,
            entryPermitKey: body.key,
            loadedTransportWeight: body.loadTransportWeight,
            transportQuantity: body.transportQuantity,
            entryPermitId: body.id,
            numberOfDrum: body.numberOfDrum
          });
          if (body.emptyTransportWeight > 0) {
            setIsEmptyTransport(false);
          }
          if (body.numberOfDrum > 0) {
            setIsThisTransportWithDrum(true);
          }
          setIsPageLoaded(true);
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    entryPermitKey === undefined ? props.history.replace('/dashboard') : getEntryPermitByKey();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEmptyTransportWeight = e => {
    const { name, value } = e.target;
    setPostLoadUnload({
      ...postLoadUnload,
      emptyTransportWeight: +value
    });
  };

  const handleLoadedTransportWeight = e => {
    const { name, value } = e.target;
    setPostLoadUnload({
      ...postLoadUnload,
      loadedTransportWeight: +value
    });
  };

  const submitEmptyTransportWeight = () => {
    if (postLoadUnload.emptyTransportWeight <= 0) {
      NotificationManager.warning('Empty transport weight cant be zero');
    } else {
      const emptyWeightBody = {
        emptyTransportWeight: postLoadUnload.emptyTransportWeight,
        entryPermitKey: postLoadUnload.entryPermitKey
      };
      axios
        .post(`${urls_v1.loading.post_emptyTransportWeight}/${postLoadUnload.entryPermitKey}`, emptyWeightBody)
        .then(({ data }) => {
          if (data.succeeded) {
            closePopup();
            NotificationManager.success('Empty Transport Weight Successfully Inserted');
          } else {
            NotificationManager.error('Someting Gonna Wrong');
          }
        });
    }
  };

  const submitLoadedTransportWeight = () => {
    if (isThisTransportWithDrum) {
      const loadedWeightBody = {
        entryPermitId: postLoadUnload.entryPermitId,
        loadTransportWeight: postLoadUnload.numberOfDrum
      };
      axios.post(`${urls_v1.exitPermit.post}`, loadedWeightBody).then(({ data }) => {
        if (data.succeeded) {
          closePopup();
          NotificationManager.success('Loaded Transport Weight Successfully Inserted');
        } else {
          NotificationManager.error(data.message);
        }
      });
    } else {
      if (
        postLoadUnload.loadedTransportWeight <= 0 ||
        postLoadUnload.loadedTransportWeight > postLoadUnload.emptyTransportWeight + postLoadUnload.transportQuantity
      ) {
        NotificationManager.warning('Transport weight not less than zero or not more than limit');
      } else {
        const loadedWeightBody = {
          entryPermitId: postLoadUnload.entryPermitId,
          loadTransportWeight: postLoadUnload.numberOfDrum
            ? postLoadUnload.numberOfDrum
            : postLoadUnload.loadedTransportWeight
        };

        axios.post(`${urls_v1.exitPermit.post}`, loadedWeightBody).then(({ data }) => {
          if (data.succeeded) {
            closePopup();
            NotificationManager.success('Loaded Transport Weight Successfully Inserted');
          } else {
            NotificationManager.error(data.message);
          }
        });
      }
    }
  };

  const handleSubmit = () => {
    if (isEmptyTransport && !isThisTransportWithDrum) {
      submitEmptyTransportWeight();
    }
    if (!isEmptyTransport || isThisTransportWithDrum) {
      submitLoadedTransportWeight();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justify="center" spacing={2}>
        {postLoadUnload.numberOfDrum > 0 ? (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              className={classes.textField}
              size="small"
              variant="outlined"
              type="number"
              margin="normal"
              label="Number of Drum"
              name="numberOfDrum"
              value={postLoadUnload.numberOfDrum}
              onChange={e => {
                setPostLoadUnload({ ...postLoadUnload, numberOfDrum: Number(e.target.value) });
              }}
              onFocus={e => {
                e.target.select();
              }}
            />
          </Grid>
        ) : isEmptyTransport ? (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              className={classes.textField}
              size="small"
              variant="outlined"
              type="number"
              margin="normal"
              label="Empty Transport Weight"
              name="emptyTransportWeight"
              value={postLoadUnload.emptyTransportWeight}
              onChange={e => {
                handleEmptyTransportWeight(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              className={classes.textField}
              size="small"
              variant="outlined"
              type="number"
              margin="normal"
              label="Loaded Transport Weight"
              name="loadedTransportWeight"
              inputProps={{
                min: postLoadUnload.emptyTransportWeight,
                max: postLoadUnload.emptyTransportWeight + postLoadUnload.transportQuantity
              }}
              value={postLoadUnload.loadedTransportWeight}
              onChange={e => {
                handleLoadedTransportWeight(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
            />
          </Grid>
        )}
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
          <Button type="submit" color="primary" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
