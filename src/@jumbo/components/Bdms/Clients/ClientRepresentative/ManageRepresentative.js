import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { DeleteIcon } from '@jumbo/controls/ActionButtons';
import Controls from '@jumbo/controls/Controls';
import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    width: '750px'
  },
  field: {
    width: '100%',
    marginBlockEnd: theme.spacing(3)
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
  btn: {
    marginLeft: theme.spacing(2)
  }
}));
export default function ManageRepresentative(props) {
  const classes = useStyles();
  const { idForManage, onClosePoppup } = props;
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const [customers, setCustomers] = useState([]);
  const [customerForAssign, setCustomerForAssign] = useState([]);
  const [representativeForManage, setRepresentativeForManage] = useState([]);

  const [customerAutoValues, setCustomerAutoValues] = useState([]);

  const getAllRepresentativeById = async () => {
    await axios.get(`${urls_v1.customerRepresentative.get_by_id}/${idForManage}`).then(({ data }) => {
      const body = data.data;
      setRepresentativeForManage(
        body.customers?.map(item => ({
          key: item.key,
          id: item.customerId,
          name: item.customerName
        }))
      );
      setCustomerForAssign(
        body.customers?.map(item => ({
          key: item.key,
          id: item.customerId,
          name: item.customerName
        }))
      );
    });
  };

  const getAllCustomers = async () => {
    await axios.get(`${urls_v1.customer.get_all}`).then(({ data }) => {
      const body = data.data;

      setCustomers(
        body.map(item => ({
          ...customers,
          id: item.id,
          nameEN: item.nameEN
        }))
      );
    });
  };

  useEffect(() => {
    getAllCustomers();
    getAllRepresentativeById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMultiSelectedCustomers = (event, customers) => {
    setCustomerForAssign(
      customers.map(item => ({
        id: item.id,
        name: item.nameEN
      }))
    );
    setCustomerAutoValues(customers);
  };

  const handleSubmit = e => {
    e.preventDefault();

    for (let index = 0; index < customerForAssign.length; index++) {
      const selectedCustomer = customerForAssign[index];
      const obj = {
        customerId: selectedCustomer.id,
        representativeId: idForManage
      };
      axios
        .post(`${urls_v1.customerRepresentative.post}`, obj)
        .then(({ data }) => {
          if (data.succeeded) {
            NotificationManager.success(data.message);
            getAllRepresentativeById();
            setCustomerAutoValues([]);
          } else {
            NotificationManager.error(data.message);
          }
        })
        .catch(({ response }) => {
          NotificationManager.warning(response.data.Message);
        });
    }
  };
  const onDelete = customerKey => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios
      .delete(`${urls_v1.customerRepresentative.delete}/${customerKey}`)
      .then(({ data }) => {
        if (data.succeeded) {
          NotificationManager.success(data.message);
          getAllRepresentativeById();
        } else {
          NotificationManager.error(data.message);
        }
      })
      .catch(({ response }) => {
        NotificationManager.warning(response.data.Message);
      });
  };

  return (
    <Grid container direction="row" className={classes.root} spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Autocomplete
          className={classes.field}
          multiple
          id="tags-outlined"
          size="small"
          options={customers.filter(e => representativeForManage.map(e => e.id).includes(e.id) === false)}
          getOptionLabel={option => option.nameEN}
          value={customerAutoValues}
          filterSelectedOptions
          loading
          loadingText="All Customers Assigned for the Representative"
          onChange={(event, newValue) => {
            handleMultiSelectedCustomers(event, newValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option.nameEN} size="small" {...getTagProps({ index })} />
            ))
          }
          renderInput={params => <TextField {...params} variant="outlined" label="Assign Customer" />}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            {representativeForManage.map(item => (
              <TableBody key={item.id}>
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <DeleteIcon
                      title="Delete"
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
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </Grid>

      <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
        <Button className={classes.btn} size="small" variant="outlined" onClick={onClosePoppup}>
          Cancel
        </Button>
        <Button
          disabled={!customerAutoValues.length}
          className={classes.btn}
          size="small"
          variant="outlined"
          onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>

      <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </Grid>
  );
}
