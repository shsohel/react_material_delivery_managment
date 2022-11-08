import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
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
export default function ProductPreview(props) {
  const classes = useStyles();
  const { recordForDetails } = props;
  return (
    <Grid container>
      <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" spacing={5}>
        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Table size="small" className={classes.tableHeading}>
            <TableBody>
              <TableRow>
                <TableCell>Product Name :</TableCell>
                <TableCell>{recordForDetails.nameEN}</TableCell>
                <TableCell>Unit :</TableCell>
                <TableCell>{recordForDetails.unit.name}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <TableContainer component={Paper}>
            {recordForDetails.productGrade.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small" className={classes.table} aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Grades</TableCell>
                      <TableCell align="left">Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recordForDetails.productGrade.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.nameEN}
                        </TableCell>
                        <TableCell align="left">{item.detailsEN}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
