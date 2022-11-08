import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { products } from '@jumbo/constants/PermissionsType';
import { DeleteIcon, EditIcon, SettingsIcon, ViewIcon } from '@jumbo/controls/ActionButtons';
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
import React, { useEffect, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import Notification from '../../../Notification/Notification';
import GradeForm from '../Grade/GradeForm';
import ProductPreview from './ProductPreview';
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
  { id: 'NameEN', label: 'Name' },
  { id: 'unitId', label: 'Unit', disableSorting: true },
  { id: 'Grade', label: 'Grade', disableSorting: true },
  { id: 'status', label: 'Status', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function ProductList(props) {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [recordForDetails, setrecordForDetails] = useState(null);
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

  const getAllProducts = async () => {
    try {
      await axios
        .get(
          `${urls_v1.products.get_all}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
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
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const closePopup = () => {
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const openGradePopup = record => {
    setrecordForDetails(null);
    setRecordForEdit(record);
    setOpenPopup(true);
  };

  const onEdit = product => {
    setrecordForDetails(null);
    props.history.replace('/products/edit', { product });
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.products.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        toastAlerts('success', 'Product deleted!!');
        getAllProducts();
      } else {
        toastAlerts('error', 'Something went Wrong!!!');
      }
    });
  };

  const PreviewOrder = key => {
    if (key) {
      axios.get(`${urls_v1.products.get_by_key}/${key}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          setrecordForDetails(body);
          setOpenPopup(true);
        }
      });
    }
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
                  <TableCell align="justify" key={headCell.id}>
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
                  <TableCell align="justify">{record.nameEN}</TableCell>
                  <TableCell align="justify">{record.unit.name}</TableCell>
                  <TableCell align="justify">
                    <SettingsIcon
                      title={!record.hasAnyGrade ? `Cann't Mange this Grade` : 'Mange Grade'}
                      placement="top"
                      onClick={() => {
                        openGradePopup(record);
                      }}
                      disabled={!record.hasAnyGrade}
                      color={!record.hasAnyGrade ? 'default' : 'primary'}
                    />
                  </TableCell>
                  <TableCell align="justify">{record.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="justify">
                    <>
                      {userPermission?.includes(products.EDIT) && (
                        <EditIcon
                          title="Edit Product"
                          placement="top"
                          onClick={() => {
                            onEdit(record);
                          }}
                        />
                      )}

                      {userPermission?.includes(products.DELETE) && (
                        <DeleteIcon
                          title="Delete Product"
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

                      <ViewIcon
                        title="View Product Details"
                        placement="top"
                        onClick={() => {
                          PreviewOrder(record.key);
                        }}
                      />
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
        {userPermission?.includes(products.CREATE) && (
          <NavLink to="/products/new">
            <Button variant="outlined" color="primary" size="small" endIcon={<AddIcon />}>
              New
            </Button>
          </NavLink>
        )}
        <br /> <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
        {recordForDetails ? (
          <Controls.Popup title="Product Details" openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <ProductPreview closePopup={closePopup} recordForDetails={recordForDetails} />
          </Controls.Popup>
        ) : (
          <Controls.Popup title="Manage Grades" openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <GradeForm closePopup={closePopup} recordForEdit={recordForEdit} />
          </Controls.Popup>
        )}
        <Notification notify={notify} setNotify={setNotify} />
        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
