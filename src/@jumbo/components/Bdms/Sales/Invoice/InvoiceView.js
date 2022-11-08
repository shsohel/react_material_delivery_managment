import { thousands_separators } from '@jumbo/utils/commonHelper';
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  },
  searchBox: {
    width: '100%'
  },
  searchButton: {
    width: '100%',
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: '#018786'
    }
  },
  submitButton: {
    backgroundColor: '#69CF45',
    color: 'black',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#018786',
      color: 'white',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  },
  printButton: {
    padding: theme.spacing(1),
    backgroundColor: '#3699FF',
    color: 'black',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#018786',
      color: 'white',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  },
  ViewButton: {
    padding: theme.spacing(1),
    backgroundColor: '#184153',
    color: '#EDEDED',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#018786',
      color: 'white',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  },
  noteField: {
    margin: theme.spacing(1),
    width: '100%',
    fontSize: '5px',
    fontWeight: 'bold'
  },
  mainDiv: {
    padding: theme.spacing(5)
  },
  tableHeading: {
    '& tbody td': {
      fontWeight: 'bold'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  }
}));
export default function InvoiceView(props) {
  const { REACT_APP_REPORT_URL } = process.env;
  const classes = useStyles();
  const { InvoiceDetails } = props;
  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  return (
    <div>
      <Grid container item xs={12} sm={12} md={12} lg={12} spacing={5}>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Table className={classes.tableHeading} size="small">
            <TableBody>
              <TableRow>
                <TableCell>Customer:</TableCell>
                <TableCell style={{ fontSize: '16px' }}>{InvoiceDetails.customerName}</TableCell>
                <TableCell>Address: </TableCell>
                <TableCell>{InvoiceDetails.customerAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Customer BIN No:</TableCell>
                <TableCell>{InvoiceDetails.customerBINNo}</TableCell>
                <TableCell>Destination: </TableCell>
                <TableCell>{InvoiceDetails.customerAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Permit No.:</TableCell>
                <TableCell>{InvoiceDetails.entryPermitOrJDCNo}</TableCell>
                <TableCell>Invoice No: </TableCell>
                <TableCell>{InvoiceDetails.invoiceNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Entry Date:</TableCell>
                <TableCell>{Moment(InvoiceDetails.entryPermitDate).format('DD-MMM-yyyy')}</TableCell>
                <TableCell>Issue Date: </TableCell>
                <TableCell>{Moment(InvoiceDetails.invoiceDate).format('DD-MMM-yyyy')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Entry Time: </TableCell>
                <TableCell>{InvoiceDetails.entryPermitTime}</TableCell>
                <TableCell>Issue Time: </TableCell>
                <TableCell>{InvoiceDetails.invoiceTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Transport No: </TableCell>
                <TableCell>{InvoiceDetails.transportNumber}</TableCell>
                <TableCell>Transport Type: </TableCell>
                <TableCell>{InvoiceDetails.transportType}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <TableContainer component={Paper} className={classes.root}>
            <Table size="small" className={classes.table} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Product with Grades</TableCell>
                  <TableCell align="right">Number of Drum</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {InvoiceDetails.productName}/{InvoiceDetails.productGradeName}
                  </TableCell>
                  <TableCell align="right">{InvoiceDetails.numberOfDrum}</TableCell>
                  <TableCell align="right">
                    {InvoiceDetails.actualQuantity}({InvoiceDetails.unitName})
                  </TableCell>
                  <TableCell align="right">{thousands_separators(InvoiceDetails.perUnitPrice)}</TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(InvoiceDetails.totalPriceWithoutVAT))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={3}>Subtotal</TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(InvoiceDetails.totalPriceWithoutVAT))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>VAT</TableCell>
                  <TableCell align="right">{`${InvoiceDetails.vatPercent}%`}</TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(InvoiceDetails.totalVATAmount))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell align="right">{thousands_separators(ccyFormat(InvoiceDetails.totalPriceWithVAT))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
