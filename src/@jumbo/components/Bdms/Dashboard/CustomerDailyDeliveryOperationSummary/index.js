import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#AAAAAA',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

export default function CustomerDailyDeliveryOperationSummary() {
  const classes = useStyles();
  const [customerDailyDeliveryOperationSummary, setCustomerDailyDeliveryOperationSummary] = useState([]);

  const getDailyOrderSummary = async () => {
    try {
      await axios.get(`${urls_v1.dashboard.get_customer_daily_delivery_operation_summary}`).then(({ data }) => {
        setCustomerDailyDeliveryOperationSummary(data.data);
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getDailyOrderSummary();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table size="small" className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Customer</StyledTableCell>
            <StyledTableCell align="justify">No. of Vehicle </StyledTableCell>
            <StyledTableCell align="justify">Ordered Quantity</StyledTableCell>
            <StyledTableCell align="justify">Total Remaining Quantity</StyledTableCell>
            <StyledTableCell align="justify">Total Delivered Quantity</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customerDailyDeliveryOperationSummary.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.customerName}
              </StyledTableCell>
              <StyledTableCell align="justify">{row.noOfVehicle}</StyledTableCell>
              <StyledTableCell align="justify">
                {row.orderedQuantity.toFixed(3)} {row.unitName}
              </StyledTableCell>
              <StyledTableCell align="justify">
                {row.totalRemainingQuantity.toFixed(3)} {row.unitName}
              </StyledTableCell>
              <StyledTableCell align="justify">
                {row.totalDeliveredQuantity.toFixed(3)} {row.unitName}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
