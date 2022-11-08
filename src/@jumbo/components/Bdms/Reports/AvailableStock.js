import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import {
  Box,
  CircularProgress,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6',
      border: 'solid 0.5px black'
    },
    '& tbody td': {
      fontWeight: 'normal',
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
  textField: {
    minWidth: '300px'
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
  }
}));
export default function AvailableStock() {
  const classes = useStyles();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [availableStocks, setAvailableStocks] = useState(null);

  const getAvailableStocks = () => {
    axios
      .get(`${urls_v1.stockManagement.get_current_stock}`)
      .then(({ data }) => {
        const body = data.data;
        if (data.succeeded) {
          setAvailableStocks(body);
          setIsPageLoaded(true);
        }
      })
      .catch(({ response }) => {
        NotificationManager.warning(response.data.Message);
      });
  };

  useEffect(() => {
    getAvailableStocks();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  let totalDrumStocks = 0,
    totalBulkStock = 0;

  for (let index = 0; index < availableStocks.length; index++) {
    totalDrumStocks = totalDrumStocks + availableStocks[index].drumStock;
    totalBulkStock = totalBulkStock + availableStocks[index].bulkStock;
  }

  return (
    <>
      <TableContainer className={classes.root}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Products</TableCell>
              <TableCell align="center">Grades</TableCell>
              <TableCell align="center">BULK Stock</TableCell>
              <TableCell align="center">DRUM Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {availableStocks.map((record, index) => (
              <TableRow key={index + 1}>
                <TableCell align="center">{record.productName}</TableCell>
                <TableCell align="center">{record.gradeName}</TableCell>
                <TableCell align="center">{record.bulkStock.toFixed(2)}</TableCell>
                <TableCell align="center">{record.drumStock.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} align="right">
                Total
              </TableCell>
              <TableCell align="center">{totalBulkStock.toFixed(2)}</TableCell>
              <TableCell align="center">{totalDrumStocks.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
