import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
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
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
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
  tContainer: {
    marginBottom: theme.spacing(3)
  }
}));

const headCells = [
  { id: 'ProductGradeId', label: 'Product Info' },
  { id: 'productCode', label: 'Product Code' },
  { id: 'hsCode', label: 'HS Code' },
  { id: 'perUnitPrice', label: 'Unit Price', disableSorting: true },
  { id: 'vatPercent', label: 'VAT(%)', disableSorting: true },
  { id: 'vatAmount', label: 'VAT Amount', disableSorting: true },
  { id: 'dateFromActive', label: 'Date From Active', disableSorting: true },
  { id: 'status', label: 'Status', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

const InActivePriceConfigurationList = () => {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [priceConfigKey, setPriceConfigKey] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');
  const [confirmationDialog, setConfirmationDialog] = useState({ isOpen: false, heading: '', title: '', subTitle: '' });
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

  const getAllPriceConfiguration = async () => {
    try {
      await axios
        .get(
          `${urls_v1.productPriceConfiguration.get_all_archive}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
        )
        .then(res => {
          const body = res.data.data;
          setRecords(body);
          setDataLength(res.data.totalNoOfRow);
          setIsLoaded(true);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    document.title = `ERL-BDMS - Price Configuration`;
  }, []);

  useEffect(() => {
    getAllPriceConfiguration();
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const onActive = record => {
    setConfirmationDialog({ ...confirmationDialog, isOpen: false });

    const data = { ...record };
    data.isActive = true;
    axios
      .put(`${urls_v1.productPriceConfiguration.put}/${record.key}`, data)
      .then(({ data }) => {
        if (data.succeeded) {
          toastAlerts('success', 'Product Price Configuration Activated!!!');
          getAllPriceConfiguration();
        } else {
          toastAlerts('error', 'Something Gonna Wrong!!!');
        }
      })
      .catch(({ response }) => {
        toastAlerts('warning', response.data.Message);
      });
  };

  function thousands_separators(num) {
    var num_parts = num.toString().split('.');
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return num_parts.join('.');
  }

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
                  <TableCell>
                    {record.productName} ({record.productGrade.nameEN}) - {record.purchaseTypeName}
                  </TableCell>
                  <TableCell>{record.productCode}</TableCell>
                  <TableCell>{record.hsCode}</TableCell>
                  <TableCell>
                    {thousands_separators(record.perUnitPrice.toFixed(2))} {record.currency}/ {record.unitName}
                  </TableCell>
                  <TableCell>{record.vatPercent}%</TableCell>
                  <TableCell>
                    {thousands_separators(record.vatAmount.toFixed(2))} {record.currency}/ {record.unitName}
                  </TableCell>
                  <TableCell>{Moment(record.dateFromActive).format('DD-MMM-yyyy')}</TableCell>
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
                          heading: 'Product Price Configuration Activation',
                          title: 'Are you sure to active this Product Price Configuration?',
                          onConfirm: () => {
                            onActive(record);
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
        <Controls.ConfirmationDialog confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} />
      </div>
    </PageContainer>
  );
};

export default InActivePriceConfigurationList;
