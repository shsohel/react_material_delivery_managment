import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { toastAlerts } from '@jumbo/utils/alerts';
import {
  Button,
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
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten, makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center'
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
  { id: 'Name', label: 'Name' },
  { id: 'ContactNumber', label: 'Contact Number', disableSorting: true },
  { id: 'Status', label: 'Status', disableSorting: true },
  { id: 'action', label: 'Actions', disableSorting: true }
];

export default function RepresentativeList() {
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

  const getAllRepresentative = async () => {
    try {
      await axios
        .get(
          `${urls_v1.representative.gell_all_archived}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
        )
        .then(({ data }) => {
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
    getAllRepresentative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onActivate = row => {
    setConfirmationDialog({ ...confirmationDialog, isOpen: false });
    const data = { ...row };
    data.isActive = true;
    axios
      .put(`${urls_v1.representative.put}/${data.key}`, data)
      .then(({ data }) => {
        if (data.succeeded) {
          toastAlerts('success', 'Representative Activated');
          getAllRepresentative();
        }
      })
      .catch(error => {
        toastAlerts('error', 'There was an error.Please contact with admin!');
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
                  <TableCell>{record.contactNumber}</TableCell>
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
                          heading: 'Representative Activation',
                          title: 'Are you sure to active this Representative?',
                          onConfirm: () => {
                            onActivate(record);
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
        <NotificationContainer />

        <br />
        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>

        <Controls.ConfirmationDialog confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} />
      </div>
    </PageContainer>
  );
}
