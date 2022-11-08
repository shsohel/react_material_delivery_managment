import GridContainer from '@jumbo/components/GridContainer';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
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

  noteField: {
    margin: theme.spacing(1),
    width: '100%',
    fontSize: '5px',
    fontWeight: 'bold'
  },
  tableHeading: {
    '& tbody td': {
      fontWeight: 'bold'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    },
    padding: theme.spacing(2)
  }
}));
export default function OrderPreview(props) {
  const classes = useStyles();
  const { recordForDetails } = props;
  console.log(recordForDetails);
  return (
    <GridContainer>
      <Grid container item xs={12} sm={12} md={12} lg={12} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table size="small" className={classes.tableHeading}>
            <TableBody>
              <TableRow>
                <TableCell>Customer:</TableCell>
                <TableCell style={{ fontSize: '16px' }}>{recordForDetails.customerName}</TableCell>
                <TableCell>Order Number:</TableCell>
                <TableCell>
                  <mark>{recordForDetails.orderNumber === '' ? 'Requested' : recordForDetails.orderNumber}</mark>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Note:</TableCell>
                <TableCell>{recordForDetails.note}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Requested Date:</TableCell>
                <TableCell>{Moment(recordForDetails.requestDate).format('DD-MMM-yyyy')}</TableCell>
                <TableCell>Confirmed Date:</TableCell>
                <TableCell>
                  {recordForDetails.confirmationDate === ''
                    ? 'N/A'
                    : Moment(recordForDetails.confirmationDate).format('DD-MMM-yyyy')}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          {recordForDetails.orderDetails.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table} aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Info</TableCell>
                    <TableCell align="left">Packaging Type</TableCell>
                    <TableCell align="left">Requested Drum</TableCell>
                    <TableCell align="left">Requested Quantity</TableCell>
                    <TableCell align="left">Approved Drum</TableCell>
                    <TableCell align="left">Approved Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recordForDetails.orderDetails.map(item => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.productName} ({item.productGradeName})
                      </TableCell>
                      <TableCell align="left">{item.purchaseTypeName}</TableCell>
                      <TableCell align="left">{item.numberOfDrumRequest}</TableCell>
                      <TableCell align="left">
                        {item.quantityRequest.toFixed(3)} {item.unitName}
                      </TableCell>
                      <TableCell align="left">{item.numberOfDrumFinal}</TableCell>
                      <TableCell align="left">
                        {item.quantityFinal.toFixed(3)} {item.unitName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Grid>
      </Grid>
    </GridContainer>
  );
}
