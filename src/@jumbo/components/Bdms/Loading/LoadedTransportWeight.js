import GridContainer from '@jumbo/components/GridContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Box, Button, CircularProgress, makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing(6),
    width: '100%'
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
  }
}));

const initialFieldValues = {
  entryPermitId: '',
  entryPermitKey: '',
  loadTransportWeight: 0,
  numberOfDrum: 0
};

export default function LoadedTransportWeight({ entryPermitKey, closePopup, ...props }) {
  const classes = useStyles();
  const [state, setState] = useState(initialFieldValues);
  const [entryPermitWithLoadedWeight, setEntryPermitWithLoadedWeight] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const getEntryPermitByKey = async () => {
    try {
      await axios.get(`${urls_v1.loading.get_entry_permit_for_loading_check_by_key}/${entryPermitKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setEntryPermitWithLoadedWeight(body);
          setState({
            ...state,
            entryPermitId: body.id,
            entryPermitKey: body.key,
            loadTransportWeight: body.loadTransportWeight,
            numberOfDrum: body.loadTransportWeight
          });
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

  const handleLoadedTransportWeight = e => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: +value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    //#region Drum
    if (entryPermitWithLoadedWeight.numberOfDrum > 0) {
      if (state.numberOfDrum > 0) {
        if (entryPermitWithLoadedWeight.loadTransportWeight === 0 && entryPermitWithLoadedWeight.numberOfDrum) {
          const body = {
            entryPermitId: state.entryPermitId,
            loadTransportWeight: state.numberOfDrum
          };
          axios.post(`${urls_v1.loading.post_loadedTransportWeight}`, body).then(({ data }) => {
            if (data.succeeded) {
              closePopup();
              NotificationManager.success(data.message);
            } else {
              NotificationManager.error(data.message);
            }
          });
        } else {
          const body = {
            entryPermitKey: state.entryPermitKey,
            loadedTransportWeight: state.numberOfDrum
          };
          axios.put(`${urls_v1.loading.put_loaded_vehicleWeight}/${body.entryPermitKey}`, body).then(({ data }) => {
            if (data.succeeded) {
              closePopup();
              NotificationManager.success(data.message);
            } else {
              NotificationManager.error(data.message);
            }
          });
        }
      } else {
        NotificationManager.error('Invalid drum quantity');
      }
    }
    //#endregion

    //#region Bulk
    else {
      if (state.loadTransportWeight > 0 && state.loadTransportWeight > entryPermitWithLoadedWeight.emptyTransportWeight) {
        if (entryPermitWithLoadedWeight.loadTransportWeight > 0) {
          const body = {
            entryPermitKey: state.entryPermitKey,
            loadedTransportWeight: state.loadTransportWeight
          };
          axios.put(`${urls_v1.loading.put_loaded_vehicleWeight}/${body.entryPermitKey}`, body).then(({ data }) => {
            if (data.succeeded) {
              closePopup();
              NotificationManager.success(data.message);
            } else {
              NotificationManager.error(data.message);
            }
          });
        } else {
          axios.post(`${urls_v1.loading.post_loadedTransportWeight}`, state).then(({ data }) => {
            if (data.succeeded) {
              closePopup();
              NotificationManager.success(data.message);
            } else {
              NotificationManager.error(data.message);
            }
          });
        }
      } else {
        NotificationManager.warning('Invalid transport weight');
      }
    }
    //#endregion
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <GridContainer>
          {entryPermitWithLoadedWeight.numberOfDrum > 0 ? (
            <TextField
              className={classes.textField}
              size="small"
              variant="outlined"
              type="number"
              margin="normal"
              label="Number of Drum"
              name="numberOfDrum"
              value={state.numberOfDrum}
              onChange={e => {
                handleLoadedTransportWeight(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
            />
          ) : (
            <TextField
              className={classes.textField}
              size="small"
              variant="outlined"
              type="number"
              margin="normal"
              label="Loaded transport weight"
              name="loadTransportWeight"
              value={state.loadTransportWeight}
              onChange={e => {
                handleLoadedTransportWeight(e);
              }}
              onFocus={e => {
                e.target.select();
              }}
            />
          )}
          <Button type="submit" color="primary" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </GridContainer>
      </form>
    </>
  );
}
