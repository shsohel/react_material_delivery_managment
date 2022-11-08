import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { unitConfigurations } from '@jumbo/constants/PermissionsType';
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
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import Notification from '../../../Notification/Notification';
import ProductUnitConversionForm from './ProductUnitConversionForm';

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
  { id: 'convertToValue', label: 'Convert To Value', disableSorting: true },
  { id: 'status', label: 'Status', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function ProductUnitConversionList() {
  const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const { userPermission } = useSelector(({ auth }) => auth);

  useEffect(() => {
    document.title = `ERL-BDMS - Unit Conversion`;
  }, []);

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

  const getAllProductUnitConversion = async () => {
    try {
      await axios
        .get(
          `${urls_v1.productUnitConversion.get_all}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
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
    getAllProductUnitConversion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  //This is for Both Insert and update savePurchaseType
  const saveProductUnitConversion = (unitConversion, resetForm) => {
    if (!unitConversion.key) {
      axios
        .post(urls_v1.productUnitConversion.post, unitConversion)
        .then(res => {
          NotificationManager.success('Unit conversion saved!!!');
          getAllProductUnitConversion();
        })
        .catch(err => {
          NotificationManager.error('Something went wrong!!!');
        });
    } else {
      axios
        .put(`${urls_v1.productUnitConversion.put}/${unitConversion.key}`, unitConversion)
        .then(res => {
          NotificationManager.success('Unit conversion updated!!!');
          getAllProductUnitConversion();
        })
        .catch(err => {
          NotificationManager.error('Something went wrong!!!');
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
    axios
      .delete(`${urls_v1.productUnitConversion.delete}/${key}`)
      .then(res => {
        NotificationManager.success('Unit conversion Deleted!!!');
        getAllProductUnitConversion();
      })
      .catch(err => {
        NotificationManager.error('Something went wrong!!!');
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
                  <TableCell>
                    {record.productName} - {record.productGrade?.nameEN}
                  </TableCell>
                  <TableCell>
                    {record.convertToValue.toFixed(2)} {record.convertToUnitName}/{record.convertFromUnitName}
                  </TableCell>
                  <TableCell>{record.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <>
                      {userPermission?.includes(unitConfigurations.EDIT) && (
                        <EditIcon
                          title="Edit Unit Conversion"
                          placement="top"
                          onClick={() => {
                            openInPopup(record);
                          }}
                        />
                      )}
                      {userPermission?.includes(unitConfigurations.DELETE) && (
                        <DeleteIcon
                          title="Delete Unit Conversion"
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
        {userPermission?.includes(unitConfigurations.CREATE) && (
          <Button
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
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
        <Controls.Popup title="Unit Conversion" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <ProductUnitConversionForm saveProductUnitConversion={saveProductUnitConversion} recordForEdit={recordForEdit} />
        </Controls.Popup>

        <Notification notify={notify} setNotify={setNotify} />

        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
