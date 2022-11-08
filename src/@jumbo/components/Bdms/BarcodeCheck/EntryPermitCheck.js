import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { toastAlerts } from '@jumbo/utils/alerts';
import {
  Avatar,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Moment from 'moment';
import React, { useState } from 'react';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(6),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      border: 'solid 0.5px black'
    },
    '& tbody td': {
      fontWeight: 'bold',
      border: 'solid 0.5px black'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    },
    '& tfoot td': {
      fontWeight: 'bold',
      border: 'solid 0.5px black'
    }
  },
  driveImage: {
    margin: 'auto',
    minHeight: '120px',
    minWidth: '120px'
  }
}));
const initialEntryPermit = {
  purchaseTypeName: '',
  permitNumber: '',
  customerName: '',
  productName: '',
  productGradeName: '',
  unitName: '',
  entryDateAndTime: '',
  representativeName: '',
  representativeContact: '',
  transportNumber: '',
  driverName: '',
  licenceNumber: ''
};

export default function EntryPermitCheck() {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const [entryPermitNo, setEntryPermitNo] = useState('');
  const [entryPermit, setEntryPermit] = useState(initialEntryPermit);

  const getEntryPermitInfo = async entryPermitNo => {
    await axios
      .get(`${urls_v1.entryPermit.get_entry_permit_by_permitNo}/${entryPermitNo}`)
      .then(({ data }) => {
        setEntryPermit(data.data);
      })
      .catch(({ response }) => {
        toastAlerts('error', response.data.Message);
      });
  };

  const onResetEntryPermit = () => {
    setEntryPermitNo('');
    setEntryPermit(initialEntryPermit);
    document.getElementById('txtEntryPermit').focus();
  };

  const onEntryPermitKeypress = e => {
    if (e.key === 'Enter') {
      getEntryPermitInfo(entryPermitNo);
    }
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={11} md={11} lg={11} xl={11}>
          <TextField
            size="small"
            fullWidth
            id="txtEntryPermit"
            label="Entry permit Number"
            placeholder="ENP-XXXXXX"
            variant="outlined"
            value={entryPermitNo}
            onChange={e => {
              setEntryPermitNo(e.target.value);
            }}
            onKeyPress={onEntryPermitKeypress}
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1} xl={1}>
          <Button color="primary" variant="outlined" disableRipple onClick={onResetEntryPermit}>
            Reset
          </Button>
        </Grid>
      </Grid>
      <br />
      <div>
        {entryPermit?.permitNumber && (
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan="4">
                    <span style={{ fontSize: '20px' }}>Eastern Refinery Limited</span>
                    <br />
                    <span>Uttar Patenga</span> <span>Chittagong</span>
                    <br />
                    <span>Entry Permit</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left">Serial No.</TableCell>
                  <TableCell align="left">{entryPermit?.permitNumber}</TableCell>
                  <TableCell align="right" colSpan="2">
                    <h3> Date and Time: {Moment(entryPermit?.entryDateAndTime).format('DD-MMM-yyyy')}</h3>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Customer Name :</TableCell>
                  <TableCell align="left" colSpan="1">
                    {entryPermit?.customerName}
                  </TableCell>
                  <TableCell align="center" colSpan="1" rowSpan="4">
                    <h3> Driver</h3>
                    <Avatar
                      className={classes.driveImage}
                      alt="driver photo"
                      src={`${REACT_APP_BASE_URL}/${entryPermit?.driverImageUrl}`}
                    />
                    {entryPermit?.driverName} ({entryPermit?.licenceNumber})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Product Description :
                  </TableCell>
                  <TableCell align="left" colSpan="1">
                    {entryPermit?.productName} ({entryPermit?.productGradeName})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Transport No. :
                  </TableCell>
                  <TableCell align="left" colSpan="1">
                    {entryPermit?.transportNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Representative :
                  </TableCell>
                  <TableCell align="left" colSpan="1">
                    {entryPermit?.representativeName} ({entryPermit?.representativeContact})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  );
}
