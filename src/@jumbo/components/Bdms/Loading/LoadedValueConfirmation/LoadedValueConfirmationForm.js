import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v2 } from '@jumbo/constants/ApplicationUrls/v2';
import { SubmitButton } from '@jumbo/controls/ActionButtons';
import { sweetAlerts } from '@jumbo/utils/alerts';
import { Box, CircularProgress, Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';
import './style.css';

const useStyles = makeStyles(theme => ({
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
  confirmColor: {
    backgroundColor: 'hsla(120, 100%, 50%, 0.2)'
  },
  pendingColor: {
    backgroundColor: 'hsla(0, 100%, 90%, 0.5)'
  }
}));

const breadcrumbs = [{ label: 'Refresh', link: '/scale-and-security/load-unload' }];

const initialSate = {
  securityToken: '',
  abpToken: '',
  planningToken: '',
  clientReprentativeToken: ''
};

const LoadedValueConfirmationForm = props => {
  const classes = useStyles();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [confirmationToken, setConfirmationToken] = useState(initialSate);
  const [abpObj, setAbpObj] = useState({});
  const [planningObj, setPlanningObj] = useState({});
  const [securityObj, setSecurityObj] = useState({});
  const {
    exitPermitId,
    customerName,
    emptyTransportWeight,
    loadTransportWeight,
    numberOfDrum,
    unitName,
    purchaseTypeName,
    entryDateAndTime,
    permitNumber,
    transportNumber,
    productName,
    productGradeName
  } = props.location.state;

  const getValidRepresentativeInfo = exitPermitId => {
    axios
      .get(`${urls_v2.confirmationToken.get_all_valid_representative_info}/${exitPermitId}`)
      .then(({ data }) => {
        const [abp, planning, security] = data.data;
        setAbpObj(abp);
        setPlanningObj(planning);
        setSecurityObj(security);
        setConfirmationToken({
          ...confirmationToken,
          abpToken: abp.isConfirmed ? 'Confirmed' : confirmationToken.abpToken,
          planningToken: planning.isConfirmed ? 'Confirmed' : confirmationToken.planningToken,
          securityToken: security.isConfirmed ? 'Confirmed' : confirmationToken.securityToken
        });
        setIsPageLoaded(true);
      })
      .catch(({ response }) => {
        sweetAlerts('error', 'Error', 'No code generated yet!!!');
        props.history.replace('/loading/loaded-value-confirmation-list');
      });
  };

  useEffect(() => {
    getValidRepresentativeInfo(exitPermitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    const stateValue = { [name]: value };
    setConfirmationToken({
      ...confirmationToken,
      ...stateValue
    });
  };

  //#region Abp Keypress and Submit
  const handleAbpKeypress = e => {
    if (e.key === 'Enter') {
      onSubmitAbp();
    }
  };

  const onSubmitAbp = () => {
    const queryStringParam = {
      userId: abpObj.userId,
      departmentName: abpObj.departmentName,
      token: confirmationToken.abpToken,
      exitPermitId: exitPermitId
    };
    axios
      .post(`${urls_v2.confirmationToken.validate_loading_confirmation_token}?${qs.stringify(queryStringParam)}`)
      .then(({ data }) => {
        if (data.succeeded) {
          setAbpObj({
            ...abpObj,
            isConfirmed: true
          });
          setConfirmationToken({ ...confirmationToken, abpToken: 'Confirmed' });
          sweetAlerts('success', 'Confirmed', 'Token Confirmed for ABP!!!!');
        } else {
          sweetAlerts('error', 'Error', 'Please put valid token!!!!');
          setConfirmationToken({ ...confirmationToken, abpToken: '' });
        }
      })
      .catch(err => {
        sweetAlerts('error', 'Error', 'Please put valid token!!!!');
        setConfirmationToken({ ...confirmationToken, abpToken: '' });
      });
  };
  //#endregion

  //#region Planning Keypress and Submit
  const handlePlanningKeypress = e => {
    if (e.key === 'Enter') {
      onSubmitPlanning();
    }
  };

  const onSubmitPlanning = () => {
    const queryStringParam = {
      userId: planningObj.userId,
      departmentName: planningObj.departmentName,
      token: confirmationToken.planningToken,
      exitPermitId: exitPermitId
    };
    axios
      .post(`${urls_v2.confirmationToken.validate_loading_confirmation_token}?${qs.stringify(queryStringParam)}`)
      .then(({ data }) => {
        if (data.succeeded) {
          setPlanningObj({
            ...planningObj,
            isConfirmed: true
          });
          setConfirmationToken({ ...confirmationToken, planningToken: 'Confirmed' });
          sweetAlerts('success', 'Confirmed', 'Token Confirmed for Planning Manager');
          props.history.push('/loading/loaded-value-confirmation-list');
        } else {
          sweetAlerts('error', 'Error', 'Please put valid token!!!!');
          setConfirmationToken({ ...confirmationToken, planningToken: '' });
        }
      })
      .catch(err => {
        sweetAlerts('error', 'Error', 'Please put valid token!!!!');
        setConfirmationToken({ ...confirmationToken, planningToken: '' });
      });
  };

  //#endregion

  //#region Security Keypress and Submit
  const handleSecurityKeypress = e => {
    if (e.key === 'Enter') {
      onSubmitSecurity();
    }
  };

  const onSubmitSecurity = () => {
    const queryStringParam = {
      userId: securityObj.userId,
      departmentName: securityObj.departmentName,
      token: confirmationToken.securityToken,
      exitPermitId: exitPermitId
    };
    axios
      .post(`${urls_v2.confirmationToken.validate_loading_confirmation_token}?${qs.stringify(queryStringParam)}`)
      .then(({ data }) => {
        if (data.succeeded) {
          setSecurityObj({
            ...securityObj,
            isConfirmed: true
          });
          setConfirmationToken({ ...confirmationToken, securityToken: 'Confirmed' });
          sweetAlerts('success', 'Confirmed', 'Token Confirmed for Security Manager');
        } else {
          sweetAlerts('error', 'Error', 'Please put valid token!!!!');
          setConfirmationToken({ ...confirmationToken, securityToken: '' });
        }
      })
      .catch(err => {
        sweetAlerts('error', 'Error', 'Please put valid token!!!!');
        setConfirmationToken({ ...confirmationToken, securityToken: '' });
      });
  };
  //#endregion

  const onFinalSubmit = e => {
    e.preventDefault();
    console.log(`${urls_v2.confirmationToken.confirm_loading_process}/${exitPermitId}?verifiedBy=${planningObj.userId}`);
    axios
      .put(`${urls_v2.confirmationToken.confirm_loading_process}/${exitPermitId}?verifiedBy=${planningObj.userId}`)
      .then(({ data }) => {
        if (data.succeeded) {
          sweetAlerts('success', 'Confirmed', 'Final Submit Confirm');
          props.history.push('/loading/loaded-value-confirmation-list');
        } else {
          sweetAlerts('error', 'Error', data.message);
        }
      })
      .catch(err => {
        sweetAlerts('error', 'Error', 'There is an Error!!!!');
      });
  };

  return (
    <>
      <PageContainer heading="Loading Confirmation" breadcrumbs={breadcrumbs}>
        <GridContainer>
          <Grid container item component={Paper} direction="column" spacing={5}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box>
                <table id="tblEntryPermitInfo" style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>Customer name</td>
                      <td>:</td>
                      <td>{customerName}</td>
                    </tr>
                    <tr>
                      <td>Entry Permit Date</td>
                      <td>:</td>
                      <td>{moment(entryDateAndTime).format('DD-MMM-yyyy')}</td>
                    </tr>
                    <tr>
                      <td>Permit Number</td>
                      <td>:</td>
                      <td>{permitNumber}</td>
                    </tr>
                    <tr>
                      <td>Transport No.</td>
                      <td>:</td>
                      <td>
                        <mark>{transportNumber}</mark>{' '}
                      </td>
                    </tr>
                    <tr>
                      <td>Product Info</td>
                      <td>:</td>
                      <td>{`${productName}(${productGradeName})`}</td>
                    </tr>
                    <tr>
                      <td>Packaging Type</td>
                      <td>:</td>
                      <td>{purchaseTypeName}</td>
                    </tr>
                    <tr>
                      <td>Empty Transport weight</td>
                      <td>:</td>
                      <td>{numberOfDrum > 0 ? 'N/A' : `${emptyTransportWeight} ${unitName}`}</td>
                    </tr>
                    <tr>
                      <td>Loaded Transport weight</td>
                      <td>:</td>
                      <td>{numberOfDrum > 0 ? 'N/A' : `${loadTransportWeight} ${unitName}`}</td>
                    </tr>
                    <tr>
                      <td>Billing Quantity</td>
                      <td>:</td>
                      <td>
                        <mark>
                          {numberOfDrum > 0
                            ? `${loadTransportWeight} Drum`
                            : `${loadTransportWeight - emptyTransportWeight} ${unitName}`}
                        </mark>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" spacing={3}>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box display="block">
                  <Box m={2}>
                    <TextField
                      // style={{ backgroundColor: 'hsla(120, 100%, 50%, 0.2)', color: '#000000' }}
                      className={securityObj.isConfirmed ? classes.confirmColor : classes.pendingColor}
                      id="txtSecurity"
                      type="tel"
                      disabled={securityObj.isConfirmed}
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Security Token"
                      name="securityToken"
                      value={confirmationToken.securityToken}
                      onChange={e => {
                        handleChange(e);
                      }}
                      onKeyPress={handleSecurityKeypress}
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end" m={2}>
                    <SubmitButton
                      disabled={securityObj.isConfirmed || !confirmationToken.securityToken}
                      ButtonLabel="Confirm"
                      onClick={onSubmitSecurity}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box display="block">
                  <Box m={2}>
                    <TextField
                      id="txtAbp"
                      type="tel"
                      className={securityObj.isConfirmed && abpObj.isConfirmed ? classes.confirmColor : classes.pendingColor}
                      disabled={!securityObj.isConfirmed || abpObj.isConfirmed}
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="ABP Token"
                      name="abpToken"
                      value={confirmationToken.abpToken}
                      onChange={e => {
                        handleChange(e);
                      }}
                      onKeyPress={handleAbpKeypress}
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end" m={2}>
                    <SubmitButton
                      disabled={abpObj.isConfirmed || !confirmationToken.abpToken}
                      ButtonLabel="Confirm"
                      onClick={onSubmitAbp}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box display="block">
                  <Box m={2}>
                    <TextField
                      id="txtPlanning"
                      type="tel"
                      className={
                        securityObj.isConfirmed && abpObj.isConfirmed && planningObj.isConfirmed
                          ? classes.confirmColor
                          : classes.pendingColor
                      }
                      disabled={!abpObj.isConfirmed || planningObj.isConfirmed}
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Planning Token"
                      name="planningToken"
                      value={confirmationToken.planningToken}
                      onChange={e => {
                        handleChange(e);
                      }}
                      onKeyPress={handlePlanningKeypress}
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end" m={2}>
                    <SubmitButton
                      disabled={planningObj.isConfirmed || !confirmationToken.planningToken}
                      ButtonLabel="Confirm"
                      onClick={onSubmitPlanning}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Box display="block">
                  <Box m={2}>
                    <TextField
                      disabled
                      fullWidth
                      size="small"
                      variant="outlined"
                      label="Client Reprentative Token"
                      name="clientReprentativeToken"
                      value={confirmationToken.clientReprentativeToken}
                      onChange={e => {
                        handleChange(e);
                      }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end" m={2}>
                    <SubmitButton disabled ButtonLabel="Confirm" />
                  </Box>
                </Box>
              </Grid> */}
            </Grid>
            {/* <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end" spacing={3}>
              <Box mt={8} mr={2}>
                <SubmitButton
                  disabled={
                    !confirmationToken.abpToken || !confirmationToken.planningToken || !confirmationToken.securityToken
                  }
                  ButtonLabel="Confirm Load"
                  onClick={onFinalSubmit}
                />
              </Box>
            </Grid> */}
          </Grid>
        </GridContainer>
        {/* <pre id="jsonData"></pre> */}
      </PageContainer>
    </>
  );
};

export default LoadedValueConfirmationForm;
