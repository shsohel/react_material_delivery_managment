import CmtAvatar from '@coremat/CmtAvatar';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { users } from '@jumbo/constants/PermissionsType';
import { EditIcon, InActiveIcon, NewButton, PasswordIcon } from '@jumbo/controls/ActionButtons';
import { toastAlerts } from '@jumbo/utils/alerts';
import { capitalizeFLetter } from '@jumbo/utils/commonHelper';
import {
  Grid,
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
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from '../../../../../services/auth/jwt/config';
import Controls from '../../../../controls/Controls';
import ResetPasswordByAdmin from './ResetPasswordByAdmin';

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
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForPassword, setrecordForPassword] = useState([]);

  const { userPermission } = useSelector(({ auth }) => auth);

  const getAllUsers = async () => {
    try {
      await axios.get(urls_v1.account.users.get_all_users).then(res => {
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

  const onDelete = id => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls_v1.account.users.delete_user_by_userId}/${id}`).then(({ data }) => {
      if (data.succeeded) {
        toastAlerts('success', data.message);
        getAllUsers();
      } else {
        toastAlerts('error', data.message);
      }
    });
  };

  const handleEdit = async userId => {
    if (userId) {
      await axios.get(`${urls_v1.account.users.get_user_by_userId}/${userId}`).then(({ data }) => {
        props.history.replace('/accounts/user-update', data);
      });
    } else {
    }
  };

  const openInPopup = user => {
    setrecordForPassword({
      userName: user.userName,
      id: user.id
    });
    setOpenPopup(true);
  };

  const handleResetPassword = async resetData => {
    try {
      await axios
        .post(`${urls_v1.account.users.password_reset_by_Admin}?${qs.stringify(resetData)}`)
        .then(({ data }) => {
          if (data.succeeded) {
            toastAlerts('success', data.message);

            setOpenPopup(false);
          } else {
            toastAlerts('error', data.message);
          }
        })
        .catch(error => {
          toastAlerts('error', 'Something Gonna Wrong!!!');
        });
    } catch (error) {}
    // setrecordForPassword(null)
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
                  <>
                    {userPermission?.includes(users.EDIT) && (
                      <EditIcon
                        title="Edit User"
                        placement="top"
                        onClick={() => {
                          handleEdit(record.id);
                        }}
                      />
                    )}
                    {userPermission?.includes(users.DELETE) && (
                      <InActiveIcon
                        title="Inactive User"
                        placement="top"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to inactive this record?',
                            subTitle: "You cann't undo this operation",
                            onConfirm: () => {
                              onDelete(record.id);
                            }
                          });
                        }}
                      />
                    )}
                    {
                      <PasswordIcon
                        title="Reset Password"
                        placement="right"
                        onClick={() => {
                          openInPopup(record);
                        }}
                      />
                    }
                  </>
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
        <NotificationContainer />
        <Grid container>
          <Grid xs item>
            {userPermission?.includes(users.CREATE) && (
              <>
                <NavLink to="/accounts/user-new">
                  <NewButton />
                </NavLink>
              </>
            )}
          </Grid>
        </Grid>
        <br />
        {tableContent}

        <Controls.Popup title="Password Reset" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <ResetPasswordByAdmin recordForPassword={recordForPassword} handleResetPassword={handleResetPassword} />
        </Controls.Popup>

        <Controls.ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
