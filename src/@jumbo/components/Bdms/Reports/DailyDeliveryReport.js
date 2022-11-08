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
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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

export default function DailyDeliveryReport() {
  const classes = useStyles();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const [dailyDeliveryReports, setDailyDeliveryReports] = useState(null);
  const { authUser } = useSelector(({ auth }) => auth);

  const paramsBody = {
    salesDate: Moment(new Date()).format('MM-DD-yyyy'),
    firstGrade: '80/100',
    secondGrade: '60/70',
    userId: authUser?.id
  };

  const getDailyDeliveryReports = async () => {
    try {
      await axios.get(`${urls_v1.report.print_daily_delivery_report}?${qs.stringify(paramsBody)}`).then(({ data }) => {
        const body = data;
        setDailyDeliveryReports(body);
        setIsPageLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDailyDeliveryReports();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const getGrandSummaryForDailyDeliveryReport = dataArray => {
    let bulkFirstGrade = 0,
      bulkSecondGrade = 0,
      totalBulkQuantity = 0,
      noOfDrumFirstGrade = 0,
      drumFirstGrade = 0,
      noOfDrumSecondGrade = 0,
      drumSecondGrade = 0,
      totalDrumQuantity = 0;

    let totalFirstGrade = 0,
      totalSecondGrade = 0,
      gradeTotal = 0,
      packegTotal = 0;

    let ratioFirstGrade = 0,
      ratioSecondGrade = 0,
      ratioBulk = 0,
      ratioDrum = 0;

    for (let index = 0; index < dataArray.length; index++) {
      bulkFirstGrade = bulkFirstGrade + dataArray[index].bulkFirstGrade;
      bulkSecondGrade = bulkSecondGrade + dataArray[index].bulkSecondGrade;
      totalBulkQuantity = totalBulkQuantity + dataArray[index].totalBulkQuantity;
      noOfDrumFirstGrade = noOfDrumFirstGrade + dataArray[index].noOfDrumFirstGrade;
      drumFirstGrade = drumFirstGrade + dataArray[index].drumFirstGrade;
      noOfDrumSecondGrade = noOfDrumSecondGrade + dataArray[index].noOfDrumSecondGrade;
      drumSecondGrade = drumSecondGrade + dataArray[index].drumSecondGrade;
      totalDrumQuantity = totalDrumQuantity + dataArray[index].totalDrumQuantity;
    }

    totalFirstGrade = bulkFirstGrade + drumFirstGrade;
    totalSecondGrade = bulkSecondGrade + drumSecondGrade;
    gradeTotal = totalFirstGrade + totalSecondGrade;
    packegTotal = totalBulkQuantity + totalDrumQuantity;

    ratioFirstGrade = Number.isNaN((totalFirstGrade / gradeTotal) * 100) ? 0 : (totalFirstGrade / gradeTotal) * 100;
    ratioSecondGrade = Number.isNaN((totalSecondGrade / gradeTotal) * 100) ? 0 : (totalSecondGrade / gradeTotal) * 100;
    ratioBulk = Number.isNaN((totalBulkQuantity / packegTotal) * 100) ? 0 : (totalBulkQuantity / packegTotal) * 100;
    ratioDrum = Number.isNaN((totalDrumQuantity / packegTotal) * 100) ? 0 : (totalDrumQuantity / packegTotal) * 100;

    return {
      bulkFirstGrade,
      bulkSecondGrade,
      totalBulkQuantity,
      noOfDrumFirstGrade,
      drumFirstGrade,
      noOfDrumSecondGrade,
      drumSecondGrade,
      totalDrumQuantity,

      totalFirstGrade,
      totalSecondGrade,
      gradeTotal,
      packegTotal,

      ratioFirstGrade,
      ratioSecondGrade,
      ratioBulk,
      ratioDrum
    };
  };

  return (
    <>
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right" style={{ backgroundColor: 'white' }} colSpan={14}>
                Date: {dailyDeliveryReports.salesDate}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell rowSpan={2}>Custormer Name</TableCell>
              <TableCell align="center" colSpan={3}>
                Bulk
              </TableCell>
              <TableCell align="center" colSpan={5}>
                Drum
              </TableCell>
              <TableCell align="center" colSpan={2}>
                Ratio
              </TableCell>
              <TableCell align="center" colSpan={2}>
                Ratio
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{dailyDeliveryReports.firstGrade}</TableCell>
              <TableCell>{dailyDeliveryReports.secondGrade}</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>{dailyDeliveryReports.firstGrade}</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>{dailyDeliveryReports.secondGrade} </TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>{dailyDeliveryReports.firstGrade}</TableCell>
              <TableCell> {dailyDeliveryReports.secondGrade}</TableCell>
              <TableCell>Bulk</TableCell>
              <TableCell>Drum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyDeliveryReports.data.map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.customerName}</TableCell>
                <TableCell>{record.bulkFirstGrade.toFixed(3)}</TableCell>
                <TableCell>{record.bulkSecondGrade.toFixed(3)}</TableCell>
                <TableCell>{record.totalBulkQuantity.toFixed(3)}</TableCell>
                <TableCell>{record.noOfDrumFirstGrade}</TableCell>
                <TableCell>{record.drumFirstGrade.toFixed(3)}</TableCell>
                <TableCell>{record.noOfDrumSecondGrade}</TableCell>
                <TableCell>{record.drumSecondGrade.toFixed(3)}</TableCell>
                <TableCell>{record.totalDrumQuantity.toFixed(3)}</TableCell>
                <TableCell>{record.ratioFirstGrade.toFixed(2)}</TableCell>
                <TableCell>{record.ratioSecondGrade.toFixed(2)}</TableCell>
                <TableCell>{record.ratioBulk.toFixed(2)}</TableCell>
                <TableCell>{record.ratioDrum.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell align="right">Total</TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).bulkFirstGrade.toFixed(3)}
              </TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).bulkSecondGrade.toFixed(3)}
              </TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).totalBulkQuantity.toFixed(3)}
              </TableCell>
              <TableCell>{getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).noOfDrumFirstGrade}</TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).drumFirstGrade.toFixed(3)}
              </TableCell>
              <TableCell>{getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).noOfDrumSecondGrade}</TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).drumSecondGrade.toFixed(3)}
              </TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).totalDrumQuantity.toFixed(3)}
              </TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).ratioFirstGrade.toFixed(2)}
              </TableCell>
              <TableCell>
                {getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).ratioSecondGrade.toFixed(2)}
              </TableCell>
              <TableCell>{getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).ratioBulk.toFixed(2)}</TableCell>
              <TableCell>{getGrandSummaryForDailyDeliveryReport(dailyDeliveryReports.data).ratioDrum.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
