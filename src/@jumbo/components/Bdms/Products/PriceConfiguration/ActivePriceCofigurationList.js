import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { priceConfigurations } from '@jumbo/constants/PermissionsType';
import { DeleteIcon, EditIcon } from '@jumbo/controls/ActionButtons';
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
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import PriceConfigurationEditForm from './PriceConfigurationEditForm';
import PriceConfigurationForm from './PriceConfigurationForm';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center'
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

export default function ActivePriceCofigurationList() {
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
          `${urls_v1.productPriceConfiguration.get_all}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
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

  //This is for Both Insert and update savePurchaseType
  const savePriceConfiguration = PriceConfiguration => {
    if (!PriceConfiguration.key) {
      axios.post(urls_v1.productPriceConfiguration.post, PriceConfiguration).then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success(data.message);
          getAllPriceConfiguration();
        } else {
          NotificationManager.error(data.message);
        }
      });
    } else {
      axios
        .put(`${urls_v1.productPriceConfiguration.put}/${PriceConfiguration.key}`, PriceConfiguration)
        .then(({ data }) => {
          if (data.succeeded) {
            NotificationManager.success(data.message);
            getAllPriceConfiguration();
          } else {
            NotificationManager.error(data.message);
          }
        });
    }
    setPriceConfigKey(null);
    setOpenPopup(false);
  };

  const openInPopup = priceConfigKey => {
    setPriceConfigKey(priceConfigKey);
    setOpenPopup(true);
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.productPriceConfiguration.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success('Price Configuration Deleted!!!');
        getAllPriceConfiguration();
      } else {
        NotificationManager.error('Something Gonna Wrong!!!');
      }
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
        <TableContainer component={Paper}>
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
                    <>
                      {userPermission?.includes(priceConfigurations.EDIT) && (
                        <EditIcon
                          title="Edit Price Configuration"
                          placement="top"
                          onClick={() => {
                            openInPopup(record.key);
                          }}
                        />
                      )}
                      {userPermission?.includes(priceConfigurations.DELETE) && (
                        <DeleteIcon
                          title="Delete Price Configuration"
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
    <PageContainer>
      <div className={classes.mainDiv}>
        <NotificationContainer />
        {userPermission?.includes(priceConfigurations.CREATE) && (
          <Button
            size="small"
            onClick={() => {
              setOpenPopup(true);
              setPriceConfigKey(null);
            }}
            variant="outlined"
            color="primary"
            endIcon={<AddIcon />}>
            New{' '}
          </Button>
        )}

        <br />
        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
        {priceConfigKey ? (
          <Controls.Popup title="Edit Price Configuration" openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <PriceConfigurationEditForm savePriceConfiguration={savePriceConfiguration} priceConfigKey={priceConfigKey} />
          </Controls.Popup>
        ) : (
          <Controls.Popup title="Price Configuration" openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <PriceConfigurationForm savePriceConfiguration={savePriceConfiguration} />
          </Controls.Popup>
        )}

        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
