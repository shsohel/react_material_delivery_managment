import CmtAvatar from '@coremat/CmtAvatar';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
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
  },
  photoBox: {
    width: '100%',
    height: '100%',
    minHeight: 50,
    overflow: 'hidden',
    '& .jvectormap-container': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: `${theme.palette.background.paper} !important`
    },
    padding: theme.spacing(1)
  },
  avator: {
    border: 'solid 2px',
    borderColor: '#C6C6C6',
    height: '100px',
    width: '100px',
    objectFit: 'contain'
  }
}));

export default function DriverForm(props) {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const { recordForEditKey, closePopupAfterAdd, closePopupAfterEdit } = props;
  const [isPhotoChange, setIsPhotoChange] = useState(false);

  const [driver, setDriver] = useState({
    id: '',
    name: '',
    cellNumber: '',
    licenceNumber: '',
    imageUrl: '',
    isActive: true
  });
  const [previewPhoto, setPreviewPhoto] = useState({ image: null });
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const recordForEdit = () => {
    if (recordForEditKey) {
      axios.get(`${urls_v1.driver.get_driver_info_by_key}/${recordForEditKey}`).then(({ data }) => {
        const body = data.data;
        setDriver({
          key: body.key,
          id: body.id,
          cellNumber: body.cellNumber,
          name: body.name,
          imageUrl: body.imageUrl,
          licenceNumber: body.licenceNumber,
          isActive: body.isActive
        });
      });
    }
  };

  const handlePhotoChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
    setIsPhotoChange(true);
  };

  useEffect(() => {
    recordForEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onhandleSubmit = () => {
    var form_data = new FormData();
    for (var key in driver) {
      form_data.append(key, driver[key]);
    }
    if (file) {
      form_data.append('File', file, fileName);
    }
    if (recordForEditKey) {
      axios
        .put(`${urls_v1.driver.put}/${recordForEditKey}`, form_data)
        .then(({ data }) => {
          if (data.succeeded) {
            closePopupAfterEdit();
          } else {
            NotificationManager.warning(data.message);
          }
        })
        .catch(({ response }) => {
          NotificationManager.warning(response.data.Message);
        });
    } else {
      axios
        .post(urls_v1.driver.post, form_data)
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
    <Grid container direction="column" justify="center">
      <Grid container item xs={12} sm={12} md={12} lg={12} spacing={1}>
        <Grid container item xs={12} sm={12} md={6} lg={6} spacing={1}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              className={classes.formControl}
              size="small"
              label="Driver"
              variant="outlined"
              value={driver.name}
              name="name"
              onChange={e => {
                setDriver({ ...driver, name: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              className={classes.formControl}
              size="small"
              label="Contact No"
              variant="outlined"
              value={driver.cellNumber}
              name="cellNumber"
              onChange={e => {
                setDriver({ ...driver, cellNumber: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              className={classes.formControl}
              size="small"
              label="Licence No"
              variant="outlined"
              value={driver.licenceNumber}
              name="cellNumber"
              onChange={e => {
                setDriver({ ...driver, licenceNumber: e.target.value });
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
                  checked={driver.isActive}
                  onChange={e => {
                    setDriver({ ...driver, isActive: e.target.checked });
                  }}
                />
              }
              label="is Active?"
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} sm={12} md={6} lg={6}>
          <Box className={classes.photoBox}>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
              <CmtAvatar className={classes.avator} src={previewPhoto.image || `${REACT_APP_BASE_URL}/${driver.imageUrl}`} />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              marginTop="2%"
              justifyContent="center"
              flexDirection={{ xs: 'column', sm: 'row' }}>
              {!isPhotoChange ? (
                <Button
                  className={classes.changeButton}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIsPhotoChange(true);
                  }}>
                  {' '}
                  Add Photo
                </Button>
              ) : (
                <Button
                  className={classes.cancelButton}
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIsPhotoChange(false);
                    setPreviewPhoto({ image: null });
                    setFile();
                    setFileName();
                  }}>
                  {' '}
                  Cancel
                </Button>
              )}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              marginTop="2%"
              justifyContent="center"
              flexDirection={{ xs: 'column', sm: 'row' }}>
              {isPhotoChange && (
                <TextField
                  className={classes.photoChange}
                  size="small"
                  variant="outlined"
                  name="file"
                  onChange={handlePhotoChange}
                  type="file"
                />
              )}
            </Box>
          </Box>
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
  );
}
