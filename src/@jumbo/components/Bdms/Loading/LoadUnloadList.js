import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { loading } from '@jumbo/constants/PermissionsType';
import { AddIcon, CancelIcon, EditIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import {
  Box,
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
import { useSelector } from 'react-redux';
import axios from 'services/auth/jwt/config';
import CancelLoadedProcess from './CancelLoadedProcess';
import EmptyTransportWeight from './EmptyTransportWeight';
import LoadedTransportWeight from './LoadedTransportWeight';

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
  }
}));

const breadcrumbs = [{ label: 'Refresh', link: '/scale-and-security/load-unload' }];

export default function LoadUnloadList() {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [entryInfo, setEntryInfo] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  ///Dialog Open For Edit
  const [entryKey, setEntryKey] = useState(null);
  const [itemForCancel, setItemForCancel] = useState(null);
  const [openEmptyTransportWeightPopup, setOpenEmptyTransportWeightPopup] = useState(false);
  const [openLoadedTransportWeightPopup, setOpenLoadedTransportWeightPopup] = useState(false);
  const [isCancelFromOpen, setIsCancelFromOpen] = useState(false);

  const { userPermission } = useSelector(({ auth }) => auth);

  const openInEmptyTransportWeightPopup = key => {
    setEntryKey(key);
    setOpenEmptyTransportWeightPopup(true);
  };

  const openInLoadedTransportWeightPopup = key => {
    setEntryKey(key);
    setOpenLoadedTransportWeightPopup(true);
  };

  const closeEmptyTransportWeightPopup = () => {
    getEntryList();
    setOpenEmptyTransportWeightPopup(false);
  };

  const closeLoadedTransportWeightPopup = () => {
    getEntryList();
    setOpenLoadedTransportWeightPopup(false);
  };

  const openCancelPopup = item => {
    setItemForCancel(item);
    setIsCancelFromOpen(true);
  };

  const closeCancelPopup = () => {
    getEntryList();
    setIsCancelFromOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getEntryList = async () => {
    await axios.get(urls_v1.loading.get_load_unload_entry_list).then(({ data }) => {
      if (data.succeeded) {
        const body = data.data;
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
    document.title = `ERL-BDMS - Loading`;
  }, []);

  useEffect(() => {
    getEntryList();
  }, []);

  let entryDataList = null;
  if (searchData.length) {
    entryDataList = searchData;
  } else {
    entryDataList = entryInfo;
  }

  return (
    <PageContainer heading="Loading" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
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
                  <TableCell>Packaging Type</TableCell>
                  <TableCell>Bulk Qty</TableCell>
                  <TableCell>Transport No</TableCell>
                  <TableCell>Empty Weight</TableCell>
                  <TableCell>Loaded Weight</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? entryDataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : entryDataList
                ).map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{Moment(item.entryDateAndTime).format('DD-MMM-yyyy')}</TableCell>
                    <TableCell component="th" scope="row">
                      {item.permitNumber}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.purchaseTypeName}
                    </TableCell>
                    <TableCell>
                      {item.numberOfDrum > 0
                        ? `${item.transportQuantity} ${item.unitName} (${item.numberOfDrum} Drum)`
                        : `${item.transportQuantity} ${item.unitName}`}
                    </TableCell>
                    <TableCell>{item.transportNumber}</TableCell>
                    <TableCell>
                      <div>
                        {item.emptyTransportWeight}
                        {!item.numberOfDrum > 0 &&
                          (item.emptyTransportWeight > 0 ? (
                            !item.isLoadingConfirmed && (
                              <span style={{ marginLeft: '5px' }}>
                                <EditIcon
                                  title="Edit Empty weight"
                                  placement="top"
                                  onClick={() => {
                                    openInEmptyTransportWeightPopup(item.key);
                                  }}
                                />
                              </span>
                            )
                          ) : (
                            <span style={{ marginLeft: '3px' }}>
                              {userPermission?.includes(loading.PLACE_EMPTY_WEIGHT) && (
                                <AddIcon
                                  title="Add Empty weight"
                                  placement="top"
                                  onClick={() => {
                                    openInEmptyTransportWeightPopup(item.key);
                                  }}
                                />
                              )}
                            </span>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {item.loadTransportWeight}
                        {item.loadTransportWeight > 0 ? (
                          !item.isLoadingConfirmed && (
                            <span style={{ marginLeft: '5px' }}>
                              {userPermission?.includes(loading.EDIT) && (
                                <EditIcon
                                  title="Edit Empty weight"
                                  placement="top"
                                  onClick={() => {
                                    openInLoadedTransportWeightPopup(item.key);
                                  }}
                                />
                              )}
                            </span>
                          )
                        ) : (
                          <span style={{ marginLeft: '3px' }}>
                            {userPermission?.includes(loading.PLACE_LOADED_WEIGHT) && (
                              <AddIcon
                                title="Add Loaded weight"
                                placement="top"
                                onClick={() => {
                                  openInLoadedTransportWeightPopup(item.key);
                                }}
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Box
                        className={classes.badgeRoot}
                        component="span"
                        bgcolor={item.isLoadingConfirmed ? '#8DCD03' : '#FF8C00'}>
                        {item.isLoadingConfirmed ? 'Loaded' : 'Loading in Progress'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {userPermission?.includes(loading.CANCEL) && (
                        <CancelIcon
                          title="Cancel entry permit"
                          placement="bottom"
                          onClick={() => {
                            openCancelPopup(item);
                          }}
                        />
                      )}
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
      <Controls.Popup
        title="Empty Transport Weight"
        openPopup={openEmptyTransportWeightPopup}
        setOpenPopup={setOpenEmptyTransportWeightPopup}>
        <EmptyTransportWeight closePopup={closeEmptyTransportWeightPopup} entryPermitKey={entryKey} />
      </Controls.Popup>

      <Controls.Popup
        title="Loaded Transport Weight"
        openPopup={openLoadedTransportWeightPopup}
        setOpenPopup={setOpenLoadedTransportWeightPopup}>
        <LoadedTransportWeight closePopup={closeLoadedTransportWeightPopup} entryPermitKey={entryKey} />
      </Controls.Popup>

      <Controls.Popup title="Cancel Loading process" openPopup={isCancelFromOpen} setOpenPopup={setIsCancelFromOpen}>
        <CancelLoadedProcess closePopup={closeCancelPopup} itemForCancel={itemForCancel} entryPermit />
      </Controls.Popup>
      {/* <pre id="jsonData"></pre> */}
    </PageContainer>
  );
}
