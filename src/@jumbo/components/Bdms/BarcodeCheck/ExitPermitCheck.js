import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { thousands_separators } from '@jumbo/utils/commonHelper';
import {
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
import { NotificationManager } from 'react-notifications';
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
  }
}));

const initialExitPermit = {
  purchaseTypeName: '',
  exitPermitSerialNumber: '',
  customerName: '',
  binNumber: '',
  productName: '',
  productGradeName: '',
  actualQuantity: '',
  numberOfDrum: '',
  totalPriceWithoutVAT: '',
  totalVATAmount: '',
  unitName: '',
  entryDateAndTime: '',
  representativeName: '',
  representativeContact: '',
  transportNumber: '',
  driverName: '',
  licenceNumber: ''
};

export default function ExitPermitCheck() {
  const classes = useStyles();
  const [exitPermitNo, setExitPermitNo] = useState('');
  const [exitPermit, setExitPermit] = useState(initialExitPermit);

  const getExitPermitInfo = async exitPermitNo => {
    await axios
      .get(`${urls_v1.exitPermit.get_exitPermit_by_permitNo}/${exitPermitNo}`)
      .then(({ data }) => {
        setExitPermit(data.data);
      })
      .catch(({ response }) => {
        NotificationManager.error(response.data.Message);
      });
  };

  const onResetExitPermit = () => {
    setExitPermitNo('');
    setExitPermit(initialExitPermit);
    document.getElementById('txtExitPermit').focus();
  };

  const onExitPermitKeypress = e => {
    if (e.key === 'Enter') {
      getExitPermitInfo(exitPermitNo);
    }
  };
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={11} md={11} lg={11} xl={11}>
          <TextField
            size="small"
            fullWidth
            id="txtExitPermit"
            label="Exit permit Number"
            placeholder="EXP-XXXXXX"
            variant="outlined"
            value={exitPermitNo}
            onChange={e => {
              setExitPermitNo(e.target.value);
            }}
            onKeyPress={onExitPermitKeypress}
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1} xl={1}>
          <Button color="primary" variant="outlined" disableRipple onClick={onResetExitPermit}>
            Reset
          </Button>
        </Grid>
      </Grid>
      <br />
      <div>
        {exitPermit.exitPermitSerialNumber && (
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan="4">
                    <span style={{ fontSize: '20px' }}>Eastern Refinery Limited</span>
                    <br />
                    <span>Uttar Patenga</span> <span>Chittagong</span>
                    <br />
                    <span>Exit Permit</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Serial No.{' '}
                  </TableCell>
                  <TableCell align="left">{exitPermit.exitPermitSerialNumber}</TableCell>
                  <TableCell align="right" colSpan="2">
                    <h3> Date and Time: {Moment(exitPermit?.entryDateAndTime).format('DD-MMM-yyyy')}</h3>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Customer Name :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {exitPermit.customerName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    BIN No. :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {exitPermit.binNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Transport No. :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {exitPermit.transportNumber}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Product Description :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {exitPermit.productName} ({exitPermit.productGradeName})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Total Quantity :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {parseFloat(exitPermit.actualQuantity).toFixed(2)} {exitPermit.unitName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Number of Drum :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {exitPermit.numberOfDrum}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Total Amount:{' '}
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {thousands_separators(parseFloat(exitPermit.totalPriceWithoutVAT).toFixed(2))}/-
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" style={{ width: '30%' }}>
                    Total VAT Amount :
                  </TableCell>
                  <TableCell align="left" colSpan="3">
                    {thousands_separators(parseFloat(exitPermit.totalVATAmount).toFixed(2))}/-
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
