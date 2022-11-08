import CmtAvatar from '@coremat/CmtAvatar';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import Controls from '@jumbo/controls/Controls';
import { toastAlerts } from '@jumbo/utils/alerts';
import { capitalizeFLetter } from '@jumbo/utils/commonHelper';
import {
  Button,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
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
  textField: {
    minWidth: '300px'
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
  { id: 'employeeID', label: 'Employee ID' },
  { id: 'userName', label: 'User Name' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'deparment', label: 'Department', disableSorting: true },
  { id: 'email', label: 'Email' },
  { id: 'phoneNumber', label: 'Phone' },
  { id: 'jobTitle', label: 'Job Title', disableSorting: true },
  { id: 'photo', label: 'Photo', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function UserList(props) {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({ isOpen: false, heading: '', title: '', subTitle: '' });

  const getAllUsers = () => {
    try {
      axios.get(urls_v1.account.users.get_all_archived).then(res => {
        setRecords(res.data);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    document.title = `ERL-BDMS - Users`;
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  const onActivate = id => {
    setConfirmationDialog({ ...confirmationDialog, isOpen: false });
    axios
      .put(`${urls_v1.account.users.active_user}/${id}`)
      .then(() => {
        toastAlerts('success', 'User activated!!!');
        getAllUsers();
      })
      .catch(error => {
        toastAlerts('error', 'There was an error.Please contact with admin!');
      });
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <TableContainer component={Paper}>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              {headCells.map(headCell => (
                <TableCell key={headCell.id}>{headCell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeID}</TableCell>
                <TableCell>{record.userName}</TableCell>
                <TableCell>{record.fullName}</TableCell>
                <TableCell>{record.departmentName ? capitalizeFLetter(record.departmentName) : 'None'}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.phoneNumber}</TableCell>
                <TableCell>{record.jobTitle}</TableCell>
                <TableCell>
                  <CmtAvatar src={`${REACT_APP_BASE_URL}/${record.media?.fileUrl}`} />{' '}
                </TableCell>
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
                          onActivate(record.id);
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
    );
  } else {
    tableContent = <LinearProgress color="primary" />;
  }

  return (
    <PageContainer>
      <div className={classes.mainDiv}>
        {tableContent}
        <Controls.ConfirmationDialog confirmationDialog={confirmationDialog} setConfirmationDialog={setConfirmationDialog} />
      </div>
    </PageContainer>
  );
}
