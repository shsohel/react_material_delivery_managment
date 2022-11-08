import GridContainer from '@jumbo/components/GridContainer';
import { Grid, lighten, makeStyles, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
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
    padding: theme.spacing(2),
    minWidth: '800px'
  }
}));
export default function EntryPermitView(props) {
  const classes = useStyles();
  const { recordForDetails } = props;

  return (
    <GridContainer>
      <Grid container item xs={12} sm={12} md={12} lg={12} spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table size="small" className={classes.tableHeading}>
            <TableBody>
              <TableRow>
                <TableCell>
                  <h2>Customer: </h2>
                </TableCell>
                <TableCell colSpan={7}>
                  <h1>{recordForDetails.customerName} </h1>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <h3>Permit No :</h3>
                </TableCell>
                <TableCell style={{ backgroundColor: 'yellow' }} colSpan={2}>
                  <h3> {recordForDetails.permitNumber} </h3>
                </TableCell>
                <TableCell>
                  <h3>Entry Date :</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3>{Moment(recordForDetails.entryDateAndTime).format('DD-MMM-yyyy hh:mm A')}</h3>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <h3> Product :</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3>
                    {recordForDetails.productName} ({recordForDetails.productGradeName})
                  </h3>
                </TableCell>
                <TableCell>
                  <h3>Bulk Qty :</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3>
                    {recordForDetails.transportQuantity.toFixed(3)} / {recordForDetails.unitName}
                  </h3>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={1}>
                  <h3> Transport No :</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3>{recordForDetails.transportNumber}</h3>
                </TableCell>
                <TableCell>
                  <h3>Packaging Type : </h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3>{recordForDetails.purchaseTypeName}</h3>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <h3> Representative : </h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3> {recordForDetails.representativeName}</h3>
                </TableCell>
                <TableCell>
                  <h3>Rep. Contact :</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3> {recordForDetails.representativeContact}</h3>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <h3>Drive :</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3> {recordForDetails.driverName}</h3>
                </TableCell>
                <TableCell>
                  <h3>Driver Contact:</h3>
                </TableCell>
                <TableCell colSpan={2}>
                  <h3>{recordForDetails.licenceNumber}</h3>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </GridContainer>
  );
}
