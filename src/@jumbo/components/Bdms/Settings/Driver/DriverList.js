import CmtAvatar from '@coremat/CmtAvatar';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { driverInformation } from '@jumbo/constants/PermissionsType';
import { EditIcon, InActiveIcon } from '@jumbo/controls/ActionButtons';
import {
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableContainer,
  TableHead,
  TableSortLabel,
  Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten, makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Add } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import DriverForm from './DriverForm';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: '#000',
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
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },
  tContainer: {
    marginBottom: theme.spacing(3)
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Drivers', link: '', isActive: true }
];

const headCells = [
  { id: 'name', label: 'Driver' },
  { id: 'cellNumber', label: 'Phone No' },
  { id: 'licenceNumber', label: 'Licence No' },
  { id: 'imageUrl', label: 'Photo', disableSorting: true },
  { id: 'Status', label: 'Status', disableSorting: true },
  { id: 'action', label: 'Actions', disableSorting: true }
];

export default function DriverList() {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordForEditKey, setRecordForEditKey] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const { userPermission } = useSelector(({ auth }) => auth);

  const handleChangePage = (event, pageNumber) => {
    setPage(pageNumber);
    setPageNumber(pageNumber);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleSortRequest = cellId => {
    const isAsc = sortedColumn === cellId && sortedBy === 'asc';
    setSortedBy(isAsc ? 'desc' : 'asc');
    setSortedColumn(cellId);
  };

  const getAllDriver = async () => {
    try {
      await axios.get(urls_v1.driver.get_all_driver_info).then(({ data }) => {
        const body = data.data;
        if (data.succeeded) {
          setRecords(body);
          setDataLength(data.totalNoOfRow);
          setIsLoaded(true);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllDriver();
  }, []);

  const closePopupAfterEdit = () => {
    setRecordForEditKey(null);
    setOpenPopup(false);
    getAllDriver();
    NotificationManager.success('Update Successfully Done!!!');
  };
  const closePopupAfterAdd = () => {
    setRecordForEditKey(null);
    setOpenPopup(false);
    getAllDriver();
    NotificationManager.success('Add New Successfully Done!!!');
  };
  const closePopupAfterDelete = () => {
    setRecordForEditKey(null);
    setOpenPopup(false);
    getAllDriver();
    NotificationManager.success('Delete Successfully Done!!!');
  };

  const onEdit = key => {
    setRecordForEditKey(key);
    setOpenPopup(true);
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.driver.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        closePopupAfterDelete();
      } else {
        NotificationManager.warning(data.message);
      }
    });
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <>
        <TableContainer className={classes.tContainer} component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {headCells.map(headCell => (
                  <TableCell key={headCell.id}>
                    {headCell.disableSorting ? (
                      headCell.label
                    ) : (
                      <TableSortLabel
                        active={sortedColumn === headCell.id}
                        direction={sortedColumn === headCell.id ? sortedBy : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCell.id);
                        }}>
                        {headCell.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.cellNumber}</TableCell>
                  <TableCell>{record.licenceNumber}</TableCell>
                  <TableCell>
                    <CmtAvatar src={`${REACT_APP_BASE_URL}/${record.imageUrl}`} />{' '}
                  </TableCell>
                  <TableCell>{record.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <>
                      {userPermission?.includes(driverInformation.EDIT) && (
                        <EditIcon
                          title="Edit Representative"
                          placement="top"
                          onClick={() => {
                            onEdit(record.key);
                          }}
                        />
                      )}
                      {userPermission?.includes(driverInformation.DELETE) && (
                        <InActiveIcon
                          title="Inactive Driver"
                          placement="top"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure to inactive this record?',
                              subTitle: "You cann't undo this operation",
                              onConfirm: () => {
                                onDelete(record.key);
                              }
                            });
                          }}
                        />
                      )}
                    </>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container item xs={12} sm={12} md={12} lg={4} justify="flex-start">
          <FormControl className={classes.formControl}>
            <Typography> Row Per Page : </Typography>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Select id="select-label-row" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={8} justify="flex-end">
          <Pagination
            count={Math.ceil(dataLength / rowsPerPage)}
            variant="outlined"
            color="primary"
            onChange={handleChangePage}
            showFirstButton
            showLastButton
          />
        </Grid>
      </>
    );
  } else {
    tableContent = <LinearProgress color="primary" />;
  }
  return (
    <PageContainer heading="Drivers" breadcrumbs={breadcrumbs}>
      <div className={classes.mainDiv}>
        <NotificationContainer />
        {userPermission?.includes(driverInformation.CREATE) && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            endIcon={<Add />}
            onClick={() => {
              setOpenPopup(true);
              setRecordForEditKey(null);
            }}>
            New
          </Button>
        )}
        <br />
        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
        <Controls.Popup title="Driver Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <DriverForm
            closePopupAfterEdit={closePopupAfterEdit}
            closePopupAfterAdd={closePopupAfterAdd}
            recordForEditKey={recordForEditKey}
          />
        </Controls.Popup>
        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
