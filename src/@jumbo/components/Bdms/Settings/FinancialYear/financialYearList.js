import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { financialYears } from '@jumbo/constants/PermissionsType';
import { DeleteIcon, EditIcon } from '@jumbo/controls/ActionButtons';
import { toastAlerts } from '@jumbo/utils/alerts';
import {
  Button,
  FormControl,
  Grid,
  LinearProgress,
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
  TableSortLabel,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Pagination } from '@material-ui/lab';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import FinancialYearForm from './FinancialYearForm';
const useStyles = makeStyles(theme => ({
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
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
  tContainer: {
    marginBottom: theme.spacing(3)
  }
}));

const headCells = [
  { id: 'FinancialYearName', label: 'Financial Year Name' },
  { id: 'startDate', label: 'Start Date', disableSorting: true },
  { id: 'endDate', label: 'End Date', disableSorting: true },
  { id: 'status', label: 'Status', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function FinancialYearList() {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
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

  const getAllFinancialYears = async () => {
    try {
      await axios
        .get(
          `${urls_v1.financialYear.get_all}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
        )
        .then(res => {
          setRecords(res.data.data);
          setIsLoaded(true);
          setDataLength(res.data.totalNoOfRow);
        });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllFinancialYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  //This is for Both Insert and update
  const saveFinancialYear = (financialYear, resetForm) => {
    if (!financialYear.key) {
      axios.post(`${urls_v1.financialYear.post}`, financialYear).then(({ data }) => {
        if (data.succeeded) {
          toastAlerts('success', 'New Financial Year Successfully Added!!!');
          getAllFinancialYears();
        } else {
          toastAlerts('error', 'Something Gonna Wrong!!!');
        }
      });
    } else {
      axios.put(`${urls_v1.financialYear.put}/${financialYear.key}`, financialYear).then(({ data }) => {
        if (data.succeeded) {
          toastAlerts('success', 'Update Successfully Done!!!');
          getAllFinancialYears();
        } else {
          toastAlerts('error', 'Something Gonna Wrong!!!');
        }
      });
    }
    setRecordForEdit(null);
    resetForm();
    setOpenPopup(false);
  };

  const openInPopup = record => {
    setRecordForEdit(record);
    setOpenPopup(true);
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.financialYear.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        toastAlerts('success', 'Delete Successfully Done!!!');
        getAllFinancialYears();
      } else {
        toastAlerts('error', 'Something Gonna Wrong!!!');
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
                  <TableCell>{record.financialYearName}</TableCell>
                  <TableCell> {Moment(record.startDate).format('DD-MMM-yyyy')}</TableCell>
                  <TableCell>{Moment(record.endDate).format('DD-MMM-yyyy')}</TableCell>
                  <TableCell>{record.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <>
                      {userPermission?.includes(financialYears.EDIT) && (
                        <EditIcon
                          title="Edit Financial Year"
                          placement="top"
                          onClick={() => {
                            openInPopup(record);
                          }}
                        />
                      )}
                      {userPermission?.includes(financialYears.DELETE) && (
                        <DeleteIcon
                          title="Delete Financial Year"
                          placement="top"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure to delete this record?',
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
    <PageContainer heading="Financial Year">
      <div className={classes.mainDiv}>
        <NotificationContainer />
        {userPermission?.includes(financialYears.CREATE) && (
          <Button
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
            variant="outlined"
            color="primary"
            endIcon={<AddIcon />}>
            New
          </Button>
        )}
        <br />
        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
        <Controls.Popup title="Financial Year Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <FinancialYearForm saveFinancialYear={saveFinancialYear} recordForEdit={recordForEdit} />
        </Controls.Popup>
        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
