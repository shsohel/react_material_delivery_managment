import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { driverInformation } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Tooltip
} from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { DateTimePicker } from '@material-ui/pickers';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import PinInput from 'react-pin-input';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from '../../../../../services/auth/jwt/config';
import DriverForm from '../../Settings/Driver/DriverForm';
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
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
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: '#018786'
    },
    '& tbody td': {
      fontWeight: 'lighter'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  },
  dateTime: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary
  },
  textField: {
    margin: theme.spacing(1),
    width: '100%',
    fontSize: '5px',
    fontWeight: 'bold'
  },
  searchBox: {
    width: '100%'
  },
  dividerColor: {
    backgroundColor: '#1D4354'
  },
  formControl: {
    width: '100%',
    padding: theme.spacing(0)
  },
  headdingTitle: {
    backgroundColor: '#C6C6C6',
    marginBottom: '15px',
    marginTop: '15px'
  }
}));
const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Orders', link: '/orders/list' },
  { label: 'Lifting Schedules', link: '/schedules/list' },
  { label: 'Entry Permits', link: '/permits/entry-permit-list' },
  { label: 'Create Entry Permit', link: '', isActive: true }
];

const TransportLetterCode = ['ই', 'U', 'TA', 'THA', 'DA', 'DHA', 'NA', 'MO'];

export default function EntryPermitForm(props) {
  const classes = useStyles();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [errors, setErrors] = useState({});

  const liftinkKey = props.location.state;
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [entryInfo, setEntryInfo] = useState(null);
  const [checkForMultiEntry, setCheckForMultiEntry] = useState(false);
  const [representatives, setRepresentatives] = useState([]);
  const [singleRepresentative, setSingleRepresentative] = useState({
    representativeName: '',
    representativeContact: ''
  });
  const [transDistrictCode, setTransDistrictCode] = useState('');
  const [transLetterCode, setTransLetterCode] = useState('');
  const [transportNumberCode, setTransportNumberCode] = useState('');
  const [cityCode, setCityCode] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const [repAutoValues, setRepAutoValues] = React.useState('');
  const [driveAutoValues, setDriveAutoValues] = useState('');

  const [pin, setPin] = useState(null);

  const { userPermission } = useSelector(({ auth }) => auth);

  const getAllExitInfobyLiftingkey = async () => {
    try {
      await axios.get(`${urls_v1.entryPermit.get_by_ls_key}/${liftinkKey}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setEntryInfo({
            ...entryInfo,
            liftingScheduleId: body.id,
            purchaseTypeId: body.purchaseTypeId,
            purchaseTypeName: body.purchaseTypeName,
            customerId: body.customerId,
            customerName: body.customerName,
            productGradeId: body.productGradeId,
            productId: body.productId,
            productName: body.productName,
            productGradeName: body.productGradeName,
            representativeName: singleRepresentative.representativeName,
            representativeContact: singleRepresentative.representativeContact,
            transportType: '',
            transportNumber: '',
            driverName: '',
            driverId: '',
            licenceNumber: '',
            transportQuantity: 0, //body.liftingQuantityDue,
            numberOfDrum: 0, // body.numberOfDrumDue,
            unitId: body.unitId,
            unitName: body.unitName,
            numberOfDrumDue: body.numberOfDrumDue,
            liftingQuantityDue: body.liftingQuantityDue,
            liftingDateAndTime: body.liftingDateAndTime,
            conversionRate: body.conversionRate
          });
          handleDateChange(body.liftingDateAndTime);
          getAllRepresentative(body.customerId);
          setIsPageLoaded(true);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getAllRepresentative = async customerId => {
    if (customerId) {
      try {
        await axios.get(`${urls_v1.customerRepresentative.get_by_customer_id}/${customerId}`).then(({ data }) => {
          const body = data.data;
          if (data.succeeded) {
            setRepresentatives(body);
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const getCityCode = async () => {
    try {
      await axios.get(`${urls_v1.brtaInformation.get_all_brta_info}`).then(({ data }) => {
        const body = data.data;
        if (data.succeeded) {
          setCityCode(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getAllDriver = async () => {
    try {
      await axios.get(urls_v1.driver.get_all_driver_info).then(({ data }) => {
        const body = data.data;
        if (data.succeeded) {
          setDrivers(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleRepresentativeChange = (e, value) => {
    if (value) {
      setRepAutoValues(value);
      setSingleRepresentative({
        ...singleRepresentative,
        representativeName: value.name,
        representativeContact: value.contactNumber
      });
    } else {
      setSingleRepresentative({
        ...singleRepresentative,
        representativeName: '',
        representativeContact: ''
      });
    }
  };
  const handleDriverChange = (e, value) => {
    if (value) {
      setDriveAutoValues(value);
      setEntryInfo({
        ...entryInfo,
        driverName: value.name,
        driverId: value.id,
        licenceNumber: value.cellNumber
      });
    } else {
      setEntryInfo({
        ...entryInfo,
        driverName: '',
        driverId: '',
        licenceNumber: ''
      });
    }
  };
  const validate = (fieldValues = entryInfo) => {
    let temp = { ...errors };

    if ('transportQuantity' in fieldValues) {
      temp.transportQuantity = fieldValues.transportQuantity ? '' : 'Please Enter Transport Qty';
    }
    setErrors({
      ...temp
    });
    if (fieldValues === entryInfo) return Object.values(temp).every(x => x === '');
  };

  useEffect(() => {
    liftinkKey === undefined ? props.history.replace('/dashboard') : getAllExitInfobyLiftingkey();

    getAllRepresentative();
    getCityCode();
    getAllDriver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleDrumQty = e => {
    const { name, value } = e.target;
    if (value.includes('.')) {
      NotificationManager.warning('Decimal not allowed!!!');
      return;
    }
    const fieldValue = { [name]: value, transportQuantity: (value * entryInfo.conversionRate).toFixed(3) };
    if (+value > entryInfo.numberOfDrumDue) {
      NotificationManager.warning('Inputed Value greater than Due Drum');
      setEntryInfo({ ...entryInfo, numberOfDrum: 0, transportQuantity: 0 });
    } else {
      setEntryInfo({ ...entryInfo, numberOfDrum: value, transportQuantity: (value * entryInfo.conversionRate).toFixed(3) });
      validate(fieldValue);
    }
  };

  const handleQueantity = e => {
    const { name, value } = e.target;
    const fieldValue = { [name]: value };
    if (e.target.value > entryInfo.liftingQuantityDue) {
      NotificationManager.warning('Inputed Value greater than Due Quantity');
      setEntryInfo({ ...entryInfo, transportQuantity: 0 });
    } else {
      setEntryInfo({ ...entryInfo, transportQuantity: +value });
      validate(fieldValue);
    }
  };
  const closePopupAfterAdd = () => {
    setOpenPopup(false);
    getAllDriver();
    NotificationManager.success('Add New Successfully Done!!!');
  };

  const handleSubmit = () => {
    if (validate()) {
      const transportNumber = `${transDistrictCode}-${transLetterCode}-${transportNumberCode.substring(
        0,
        2
      )}-${transportNumberCode.substring(2)}`;

      const body = {
        liftingScheduleId: entryInfo.liftingScheduleId,
        purchaseTypeId: entryInfo.purchaseTypeId,
        purchaseTypeName: entryInfo.purchaseTypeName,
        customerId: entryInfo.customerId,
        customerName: entryInfo.customerName,
        productGradeId: entryInfo.productGradeId,
        productId: entryInfo.productId,
        productName: entryInfo.productName,
        productGradeName: entryInfo.productGradeName,
        // entryDateAndTime: Moment(selectedDate).format('yyyy-MM-DD hh:mm A'),
        entryDateAndTime: Moment(new Date()).format('yyyy-MM-DD hh:mm:ss A'),
        representativeName: singleRepresentative.representativeName,
        representativeContact: singleRepresentative.representativeContact,
        transportNumber: transportNumber,
        transportType: entryInfo.transportType,
        driverName: entryInfo.driverName,
        driverId: entryInfo.driverId,
        licenceNumber: entryInfo.licenceNumber,
        numberOfDrum: entryInfo.numberOfDrum,
        transportQuantity: entryInfo.transportQuantity,
        conversionRate: entryInfo.conversionRate,
        unitId: entryInfo.unitId,
        unitName: entryInfo.unitName
      };
      const isFinishedQuantity = +entryInfo.transportQuantity === entryInfo.liftingQuantityDue;

      axios.post(urls_v1.entryPermit.post, body).then(({ data }) => {
        if (data.succeeded) {
          if (isFinishedQuantity || !checkForMultiEntry) {
            props.history.replace('/schedules/list');
            return;
          }
          NotificationManager.success(data.message);
          getAllExitInfobyLiftingkey();
          setTransDistrictCode('');
          setTransLetterCode('');
          setTransportNumberCode('');
          //  setRepAutoValues('');
          setDriveAutoValues('');
          pin.clear();
        } else {
          NotificationManager.warning(data.message);
        }
      });
    }
  };

  return (
    <PageContainer heading="Entry Permit" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <br />
      <br />
      <form>
        <Grid container direction="row" component={Paper} spacing={5}>
          <Grid container item xs={12} sm={12} md={12} lg={12}>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" className={classes.headdingTitle}>
              <h2>Order Details</h2>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} style={{ backgroundColor: 'white' }} spacing={2}>
              <Grid item xs={12} sm={6} md={2} lg={3}>
                <Box>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Customer: ${entryInfo.customerName}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Product: ${entryInfo.productName}`} />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Box>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Grade: ${entryInfo.productGradeName}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Packaging Type: ${entryInfo.purchaseTypeName}`} />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Box>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Unit: ${entryInfo.unitName}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Lifting Date: ${Moment(entryInfo.liftingDate).format('DD-MMM-yyyy')}`} />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={3}>
                <Box>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Remaining Quantity : ${entryInfo.liftingQuantityDue.toFixed(3)}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Remaining Drum: ${entryInfo.numberOfDrumDue}`} />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" className={classes.headdingTitle}>
              <h2>Permits Details</h2>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} style={{ backgroundColor: 'white' }} spacing={2}>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <DateTimePicker
                  disablePast
                  disabled
                  className={classes.textField}
                  size="small"
                  format="DD-MM-yyyy"
                  label="Entry Date"
                  inputVariant="outlined"
                  value={new Date()}
                  onChange={handleDateChange}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Autocomplete
                  className={classes.textField}
                  id="combo-box-demo"
                  size="small"
                  options={representatives}
                  getOptionLabel={option => {
                    if (option.hasOwnProperty('friendlyName')) {
                      return option.friendlyName;
                    }
                    return option;
                  }}
                  value={repAutoValues}
                  onChange={(event, newValue) => {
                    handleRepresentativeChange(event, newValue);
                  }}
                  renderInput={params => (
                    <TextField {...params} variant="outlined" placeholder="Representatives" size="small" />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={3} xl={3}>
                <TextField
                  disabled
                  className={classes.textField}
                  size="small"
                  variant="outlined"
                  label="Representative Contact"
                  name="representativeContact"
                  value={singleRepresentative.representativeContact}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={2} lg={2}>
                <TextField
                  className={classes.textField}
                  disabled={entryInfo.numberOfDrumDue === 0}
                  size="small"
                  variant="outlined"
                  type="number"
                  label="Number Of Drum"
                  name="numberOfDrum"
                  inputProps={{ min: 0, max: entryInfo.numberOfDrumDue }}
                  value={entryInfo.numberOfDrum}
                  onChange={e => {
                    handleDrumQty(e);
                  }}
                  onFocus={e => {
                    e.target.select();
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={2} lg={2}>
                <TextField
                  className={classes.textField}
                  disabled={entryInfo.numberOfDrumDue !== 0}
                  size="small"
                  variant="outlined"
                  type="number"
                  label="Bulk Quantity"
                  name="transportQuantity"
                  value={entryInfo.transportQuantity}
                  onChange={e => {
                    handleQueantity(e);
                  }}
                  onFocus={e => {
                    e.target.select();
                  }}
                  {...(errors.transportQuantity && { error: true, helperText: errors.transportQuantity })}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" className={classes.headdingTitle}>
              <h2>Transport Details</h2>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} style={{ backgroundColor: 'white' }} spacing={2}>
              <Grid item container xs={12} sm={12} md={3} lg={3} xl={3}>
                <Grid item xs={2}>
                  {userPermission?.includes(driverInformation.CREATE) && (
                    <Tooltip title="Add new driver" placement="top">
                      <IconButton
                        color="primary"
                        component="span"
                        onClick={() => {
                          setOpenPopup(true);
                        }}>
                        <LibraryAdd />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item xs={10}>
                  <Autocomplete
                    className={classes.textField}
                    id="combo-box-demo"
                    size="small"
                    options={drivers}
                    getOptionLabel={option => {
                      if (option.hasOwnProperty('name')) {
                        return option.name;
                      }
                      return option;
                    }}
                    value={driveAutoValues}
                    onChange={(event, newValue) => {
                      handleDriverChange(event, newValue);
                    }}
                    renderInput={params => <TextField {...params} variant="outlined" placeholder="Drivers" size="small" />}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  className={classes.textField}
                  disabled
                  size="small"
                  variant="outlined"
                  label="Contact Number"
                  name="licenceNumber"
                  value={entryInfo.licenceNumber}
                  onChange={e => {
                    setEntryInfo({ ...entryInfo, licenceNumber: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2}>
                <TextField
                  className={classes.textField}
                  id="standard-select-transportType"
                  name="transDistrictCode"
                  select
                  label="City"
                  value={transDistrictCode}
                  onChange={e => {
                    setTransDistrictCode(e.target.value);
                  }}
                  variant="outlined"
                  size="small">
                  {cityCode.map(option => (
                    <MenuItem key={option.id} value={option.region}>
                      {option.region}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2}>
                <TextField
                  className={classes.textField}
                  id="standard-select-transportType"
                  name="transLetterCode"
                  select
                  label="Class"
                  value={transLetterCode}
                  onChange={e => {
                    setTransLetterCode(e.target.value);
                  }}
                  variant="outlined"
                  size="small">
                  {TransportLetterCode.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <PinInput
                  length={6}
                  //onChange={(value, index) => { setTransportNumberCode(value) }}
                  type="numeric"
                  inputMode="number"
                  style={{ padding: '5px' }}
                  inputStyle={{
                    borderColor: '#C6C6C6',
                    marginRight: '5px',
                    width: '37px',
                    height: '37px',
                    border: 'solid 1px',
                    borderRadius: '14%'
                  }}
                  inputFocusStyle={{
                    borderColor: 'blue',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    width: '47px',
                    height: '47px'
                  }}
                  ref={p => setPin(p)}
                  onComplete={value => {
                    setTransportNumberCode(value);
                  }}
                  autoSelect={true}
                  regexCriteria={/^ [A - Za - z0 -9_@./#&+-]*$/}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <Box display="flex">
                <Box ml={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkForMultiEntry}
                        onChange={e => {
                          setCheckForMultiEntry(e.target.checked);
                        }}
                      />
                    }
                    label="Do you want to entry multiple?"
                  />
                </Box>
                <Box ml={2}>
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    size="small"
                    variant="outlined"
                    color="primary">
                    Submit
                  </Button>
                </Box>
                <Box ml={2}>
                  <NavLink to="/schedules/list">
                    <Button size="small" variant="outlined" color="primary">
                      Cancel
                    </Button>
                  </NavLink>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Controls.Popup title="Driver Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <DriverForm closePopupAfterAdd={closePopupAfterAdd} />
      </Controls.Popup>
    </PageContainer>
  );
}
