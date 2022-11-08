import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { statuses as statusPermissions } from '@jumbo/constants/PermissionsType';
import { DeleteIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Collapse,
  fade,
  FormControl,
  Grid,
  IconButton,
  lighten,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import StatusForm from './StatusForm';

//import ApprovalProcessForm from './ApprovalProcessForm';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    // padding: '25px',
    width: '100%'
  },
  table: {
    backgroundColor: fade(blue['500'], 0.1),
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr': {
      fontWeight: 'bold',
      backgroundColor: fade('#C6C6C6', 0.1),
      fontStyle: 'oblique'
    },
    '& tbody tr:hover': {
      backgroundColor: fade('#C76300', 0.1),
      cursor: 'pointer'
    },
    '& tbody tr:active': {
      backgroundColor: '#FF8C00'
    },
    '& table thead th': {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      cursor: 'pointer'
    },
    '& table tbody tr': {
      fontWeight: 'bold',
      fontStyle: 'normal',
      backgroundColor: fade(theme.palette.warning.main, 0.15),
      color: theme.palette.success.main
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
  { label: 'Status List', link: '/settings/status', isActive: true }
];

const StatusDetailsData = props => {
  const { row, getAllStatus } = props;
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const classes = useRowStyles();

  const { userPermission } = useSelector(({ auth }) => auth);

  const statusLevelUp = record => {
    const upBody = {
      id: record.id,
      key: record.key,
      isUp: true
    };
    axios.post(`${urls_v1.status.post_configure_status_level}/${record.key}`, upBody).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success(data.message);
        getAllStatus();
      } else {
        NotificationManager.warning(data.message);
        getAllStatus();
      }
    });
  };

  const statusLevelDown = record => {
    const downBody = {
      id: record.id,
      key: record.key,
      isUp: false
    };
    axios
      .post(`${urls_v1.status.post_configure_status_level}/${record.key}`, downBody)
      .then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success(data.message);
          getAllStatus();
        } else {
          NotificationManager.warning(data.message);
          getAllStatus();
        }
      })
      .catch(error => console.log(error.message));
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.status.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success('Delete Successfully Done!!!');
        getAllStatus();
      } else {
        NotificationManager.error('Something Gonna Wrong!!!');
      }
    });
  };

  return (
    <>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" style={{ fontWeight: 'bold', fontSize: '18px' }}>
          {row.groupName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} style={{ backgroundColor: 'white' }} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="lifting">
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Public Name</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.status.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.publicName}</TableCell>
                      <TableCell>
                        <>
                          <ButtonGroup size="small" variant="contained">
                            <Button
                              disabled={index === 0}
                              style={{
                                backgroundColor: index === 0 ? '#D5D5D5' : 'white'
                              }}
                              onClick={() => {
                                statusLevelUp(item);
                              }}>
                              {' '}
                              <ArrowUpwardOutlined
                                style={{
                                  color: index === 0 ? 'black' : 'green'
                                }}
                              />{' '}
                            </Button>
                            <Button
                              disabled={index === row.status.length - 1}
                              style={{
                                backgroundColor: index === row.status.length - 1 ? '#D5D5D5' : 'white'
                              }}
                              onClick={() => {
                                statusLevelDown(item);
                              }}>
                              {' '}
                              <ArrowDownwardOutlined
                                style={{
                                  color: index === row.status.length - 1 ? 'black' : 'red'
                                }}
                              />{' '}
                            </Button>
                          </ButtonGroup>
                        </>
                      </TableCell>
                      <TableCell>
                        {userPermission?.includes(statusPermissions.DELETE) && (
                          <DeleteIcon
                            title="Delete Status"
                            placement="top"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: 'Are you sure to delete this record?',
                                subTitle: "You cann't undo this operation",
                                onConfirm: () => {
                                  onDelete(item.key);
                                }
                              });
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Controls.Popup title="Status Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <StatusForm
          //saveStatus={saveStatus}
          recordForEdit={recordForEdit}
        />
      </Controls.Popup>
      <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
};
const InActiveStatusList = props => {
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { userPermission } = useSelector(({ auth }) => auth);

  const handleChangePage = (event, pageNumber) => {
    setPage(pageNumber);
    setPageNumber(pageNumber);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const getAllStatus = async () => {
    try {
      await axios
        .get(`${urls_v1.status.get_all_archive}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}`)
        .then(({ data }) => {
          if (data.succeeded) {
            const body = data.data;
            setStatuses(body);
            setDataLength(data.totalNoOfRow);
            setIsPageLoaded(true);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllStatus();
  }, [rowsPerPage, pageNumber]);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }
  //This is for Both Insert and update
  const saveStatus = (status, resetForm) => {
    if (!status.key) {
      axios.post(urls_v1.status.post, status).then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success('New Status Successfully Added!!!');
          getAllStatus();
        } else {
          NotificationManager.error('Something Gonna Wrong!!!');
        }
      });
    } else {
      axios.put(`${urls_v1.status.put}/${status.key}`, status).then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success('Update Successfully Done!!!');
          getAllStatus();
        } else {
          NotificationManager.error('Something Gonna Wrong!!!');
        }
      });
    }
    setRecordForEdit(null);
    resetForm();
    setOpenPopup(false);
  };

  return (
    <>
      <div className={classes.mainDiv}>
        <NotificationContainer />

        <br />
        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer component={Paper} className={classes.tContainer}>
              <Table className={classes.table} size="small" aria-label="collapsible table">
                <TableBody>
                  {statuses.map((row, index) => (
                    <StatusDetailsData
                      key={row.groupName}
                      row={row}
                      propsRoute={props}
                      sl={index + 1}
                      getAllStatus={getAllStatus}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
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
        </Grid>
        <Controls.Popup title="Status Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <StatusForm saveStatus={saveStatus} />
        </Controls.Popup>
      </div>
    </>
  );
};

export default InActiveStatusList;
