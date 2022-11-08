import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
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
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  serchInput: {
    width: '100%'
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
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },
  tContainer: {
    marginBottom: theme.spacing(3)
  },
  btnActive: {
    margin: 5,
    '&:hover': {
      backgroundColor: '#673D6A',
      color: '#ffffff'
    }
  }
}));

const headCells = [
  { id: 'Name', label: 'Unit Name' },
  { id: 'ShortCode', label: 'Short Code' },
  { id: 'status', label: 'Status', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function InactiveUnitList() {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({ isOpen: false, heading: '', title: '', subTitle: '' });

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');

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

  const getAllUnits = async () => {
    try {
      await axios
        .get(
          `${urls_v1.unit.get_all_archived}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
        )
        .then(res => {
          setRecords(res.data.data);
          setDataLength(res.data.totalNoOfRow);
          setIsLoaded(true);
        });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedColumn, sortedBy]);

  const onStatusChange = record => {
    setConfirmationDialog({ ...confirmationDialog, isOpen: false });
    const data = { ...record };
    data.isActive = true;
    axios.put(`${urls_v1.unit.put}/${record.key}`, data).then(({ data }) => {
      if (data.succeeded) {
        toastAlerts('success', 'Update Successfully Done!!!');
        getAllUnits();
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
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.shortCode}</TableCell>
                  <TableCell>{record.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button
                      className={classes.btnActive}
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => {
                        setConfirmationDialog({
                          isOpen: true,
                          heading: 'Unit Activation',
                          title: 'Are you sure to active this Unit?',
                          onConfirm: () => {
                            onStatusChange(record);
                          }
                        });
                      }}>
                      Active
                    </Button>
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
    <PageContainer>
      <div className={classes.mainDiv}>
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
      </div>
      <Controls.ConfirmationDialog confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} />
    </PageContainer>
  );
}
