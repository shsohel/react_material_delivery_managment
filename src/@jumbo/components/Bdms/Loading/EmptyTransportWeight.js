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
  entryPermitKey: '',
  emptyTransportWeight: 0
};

export default function EmptyTransportWeight({ entryPermitKey, closePopup, ...props }) {
  const classes = useStyles();
  const [state, setState] = useState(initialFieldValues);
  const [entryPermit, setEntryPermit] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const getEntryPermitByKey = async () => {
    try {
      await axios.get(`${urls_v1.loading.get_entry_permit_for_loading_check_by_key}/${entryPermitKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setEntryPermit(body);
          setState({ ...state, entryPermitKey: body.key, emptyTransportWeight: body.emptyTransportWeight });
          setIsPageLoaded(true);
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    entryPermitKey === undefined ? props.history.replace('/dashboard') : getEntryPermitByKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setState({
      ...state,
      [name]: +value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (entryPermit.emptyTransportWeight > 0) {
      axios.put(`${urls_v1.loading.put_empty_vehicleWeight}/${state.entryPermitKey}`, state).then(({ data }) => {
        if (data.succeeded) {
          closePopup();
          NotificationManager.success('Empty Transport Weight Successfully Updated');
        } else {
          NotificationManager.error('Someting Gonna Wrong');
        }
      });
    } else {
      if (state.emptyTransportWeight > 0) {
        axios.post(`${urls_v1.loading.post_emptyTransportWeight}/${state.entryPermitKey}`, state).then(({ data }) => {
          if (data.succeeded) {
            closePopup();
            NotificationManager.success('Empty Transport Weight Successfully Inserted');
          } else {
            NotificationManager.error('Someting Gonna Wrong');
          }
        });
      } else {
        NotificationManager.error('Empty transport weight cant be zero');
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <GridContainer>
          <TextField
            className={classes.textField}
            size="small"
            variant="outlined"
            type="number"
            margin="normal"
            label="Empty Transport Weight"
            name="emptyTransportWeight"
            value={state.emptyTransportWeight}
            onChange={e => {
              handleEmptyTransportWeight(e);
            }}
            onFocus={e => {
              e.target.select();
            }}
          />
          <Button type="submit" color="primary" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </GridContainer>
      </form>
    </>
  );
}
