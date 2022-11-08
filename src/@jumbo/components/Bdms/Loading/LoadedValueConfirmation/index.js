import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  tableEntry: {
    '& thead th': {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
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
    width: '90%',
    backgroundColor: '#F8CFDD'
  },
  searchButton: {
    width: '80%',
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: '#018786'
    }
  },
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    marginBottom: 16,
    display: 'inline-block'
  },
  noExitPermitPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#000000',
    fontSize: 20
  }
}));

const breadcrumbs = [{ label: 'Refresh', link: '/scale-and-security/load-unload' }];

const LoadedValueConfirmation = props => {
  const { replace } = props.history;
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [entryInfo, setEntryInfo] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEntryList = async () => {
    const today = Moment(new Date()).format('yyyy-MM-DD');
    await axios.get(`${urls_v1.loading.get_entry_permits_for_loading_confirmation}/${today}`).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
        // console.log(body);
        setEntryInfo(body);
        // document.getElementById('jsonData').textContent = JSON.stringify(body, null, 2);
      }
    });
  };
  const getSearchList = search => {
    const data = entryInfo.filter(item => item.transportNumber.toLowerCase().includes(search.toLowerCase()));
    setSearchData(data);
  };

  useEffect(() => {
    document.title = `ERL-BDMS - Loaded value confirmation`;
  }, []);

  useEffect(() => {
    getEntryList();
  }, []);

  const handleConfirmation = record => {
    replace('/loading/loaded-value-confirmation', record);
  };

  let entryDataList = null;
  if (searchData.length) {
    entryDataList = searchData;
  } else {
    entryDataList = entryInfo;
  }

  return (
    <>
      <PageContainer heading="Loading Confirmation" breadcrumbs={breadcrumbs}>
        <NotificationContainer />
        {entryInfo.length ? (
          <Grid container component={Paper} direction="column" spacing={5}>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" spacing={3}>
              <h2>Please Search by Transport No </h2>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="center" spacing={3}>
              <Grid container item xs={12} sm={12} md={8} lg={8} justify="center">
                <TextField
                  className={classes.searchBox}
                  size="small"
                  name="search"
                  variant="outlined"
                  placeholder="Search by Transport Number"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    getSearchList(e.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12} sm={12} md={12} lg={12}>
              <TableContainer component={Paper}>
                <Table className={classes.tableEntry} size="small" aria-label="lifting">
                  <TableHead>
                    <TableRow>
                      <TableCell>Entry Date</TableCell>
                      <TableCell>Permit No</TableCell>
                      <TableCell>Transport No</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? entryDataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : entryDataList
                    ).map(item => (
                      <TableRow key={item.entryPermitId}>
                        <TableCell>{Moment(item.entryDateAndTime).format('DD-MMM-yyyy')}</TableCell>
                        <TableCell component="th" scope="row">
                          {item.permitNumber}
                        </TableCell>
                        <TableCell>{item.transportNumber}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              handleConfirmation(item);
                            }}>
                            Confirm
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[25, 50, 75, 100, { label: 'All', value: -1 }]}
                colSpan={3}
                component="div"
                count={entryDataList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <Paper className={classes.noExitPermitPaper}>No vehicles at loading point!!!</Paper>
            </Grid>
          </Grid>
        )}
        {/* <pre id="jsonData"></pre> */}
      </PageContainer>
    </>
  );
};
export default LoadedValueConfirmation;
