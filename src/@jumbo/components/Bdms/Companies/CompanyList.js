import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import axios from '../../../../services/auth/jwt/config';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.dark,
    color: theme.palette.common.white
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

export default function CompanyList(props) {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  async function getAllCompanies() {
    await axios
      .get(urls_v1.company.get_all)
      .then(res => {
        const body = res.data.data;
        setRecords(body);
        setIsLoaded(true);
      })
      .catch();
  }
  useEffect(() => {
    getAllCompanies();
  }, []);

  const getDetails = details => {
    props.history.push('/companies/details', { details });
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell colSpan={2} align="center">
              Action
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(row => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.nameEN}
              </StyledTableCell>
              <StyledTableCell>{row.addressEN}</StyledTableCell>
              <StyledTableCell align="center">
                <Button
                  onClick={() => {
                    getDetails(row);
                  }}
                  variant="contained"
                  color="secondary"
                  size="small">
                  Details
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    );
  } else {
    tableContent = <LinearProgress color="primary" />;
  }

  return (
    <>
      <TableContainer component={Paper}>{tableContent}</TableContainer>
    </>
  );
}
