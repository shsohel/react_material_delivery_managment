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
  },
  masterData: {
    fontWeight: 'bold',
    fontStyle: 'oblique'
  }
}));

const initialState = {
  customerName: '',
  customerAddress: '',
  customerBINNo: '',
  transportNumber: '',

  invoiceNumber: '',
  invoiceDate: '',
  invoiceTime: '',
  entryPermitDate: '',
  entryPermitTime: '',
  entryPermitOrJDCNo: '',

  productName: '',
  productGradeName: '',
  actualQuantity: '',
  unitName: '',
  perUnitPrice: ''
};

export default function InvoiceCheck() {
  const classes = useStyles();

  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoice, setInvoice] = useState(initialState);

  const getInvoiceInfo = async invoiceNo => {
    await axios
      .get(`${urls_v1.sales.get_invoice_by_invoiceNo}/${invoiceNo}`)
      .then(({ data }) => {
        setInvoice(data.data);
      })
      .catch(({ response }) => {
        NotificationManager.error(response.data.Message);
      });
  };

  const onResetInvoice = () => {
    setInvoiceNo('');
    setInvoice(initialState);
    document.getElementById('txtInvoice').focus();
  };

  const onInvoiceKeypress = e => {
    if (e.key === 'Enter') {
      getInvoiceInfo(invoiceNo);
    }
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={11} md={11} lg={11} xl={11}>
          <TextField
            size="small"
            fullWidth
            id="txtInvoice"
            label="Invoice Number"
            placeholder="ERLC-XXXXXX"
            variant="outlined"
            value={invoiceNo}
            onChange={e => {
              setInvoiceNo(e.target.value);
            }}
            onKeyPress={onInvoiceKeypress}
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1} xl={1}>
          <Button color="primary" variant="outlined" disableRipple onClick={onResetInvoice}>
            Reset
          </Button>
        </Grid>
      </Grid>
      <br />
      <div>
        {invoice.invoiceNumber && (
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan="7">
                    <span style={{ fontSize: '20px' }}>Eastern Refinery Limited</span>
                    <br />
                    <span>Uttar Patenga</span> <span>Chittagong</span>
                    <br />
                    <span>BIN Number : 001506046-0503</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left" colSpan="3">
                    <span className={classes.masterData}>Customer</span> : {invoice.customerName}
                    <br />
                    <span className={classes.masterData}>Customer Address</span> : {invoice.customerAddress}
                    <br />
                    <span className={classes.masterData}>BIN</span> : {invoice.customerAddress}
                    <br />
                    <span className={classes.masterData}>Final Destination</span> : {invoice.customerName}
                    <br />
                    <span className={classes.masterData}>Transport No.</span> : {invoice.transportNumber}
                  </TableCell>
                  <TableCell align="right" colSpan="4">
                    <span className={classes.masterData}>Invoice Number</span> : {invoice.invoiceNumber}
                    <br />
                    <span className={classes.masterData}>Invoice Date</span> : {invoice.invoiceDate}
                    <br />
                    <span className={classes.masterData}>Invoice Time</span> : {invoice.invoiceTime}
                    <br />
                    <span className={classes.masterData}>Date of exit</span> : {invoice.entryPermitDate}
                    <br />
                    <span className={classes.masterData}>Time of exit</span> : {invoice.entryPermitTime}
                    <br />
                    <span className={classes.masterData}>Entry permit/JDC No</span> : {invoice.entryPermitOrJDCNo}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">SL.</TableCell>
                  <TableCell align="center">Product info and Quantity</TableCell>
                  <TableCell align="center">Price for SD</TableCell>
                  <TableCell align="center">SD</TableCell>
                  <TableCell align="center">Price for VAT</TableCell>
                  <TableCell align="center">VAT Amount</TableCell>
                  <TableCell align="center">Price with VAt and SD</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="center">2</TableCell>
                  <TableCell align="center">3</TableCell>
                  <TableCell align="center">4</TableCell>
                  <TableCell align="center">5</TableCell>
                  <TableCell align="center">6</TableCell>
                  <TableCell align="center">7</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="left">
                    {invoice.productName} {invoice.productGradeName}
                    <br />
                    {invoice.actualQuantity} {invoice.unitName} x {thousands_separators(invoice.perUnitPrice)} BDT
                  </TableCell>
                  <TableCell align="center">{thousands_separators(parseFloat(invoice.sdPercent).toFixed(2))}/-</TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalSDAmount).toFixed(2))}/-
                  </TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalPriceWithoutVAT).toFixed(2))}/-
                  </TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalVATAmount).toFixed(2))}/-
                  </TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalPriceWithVAT).toFixed(2))}/-
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan="2" align="right">
                    Total
                  </TableCell>
                  <TableCell align="center"> {thousands_separators(parseFloat(invoice.sdPercent).toFixed(2))}/-</TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalSDAmount).toFixed(2))}/-
                  </TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalPriceWithoutVAT).toFixed(2))}/-
                  </TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalVATAmount).toFixed(2))}/-
                  </TableCell>
                  <TableCell align="center">
                    {thousands_separators(parseFloat(invoice.totalPriceWithVAT).toFixed(2))}/-
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
