import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { roles } from '@jumbo/constants/PermissionsType';
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
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
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
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Roles', link: '/accounts/role', isActive: true },
  { label: 'Users', link: '/accounts/user' }
];

const headCells = [
  { id: 'roleName', label: 'Role Name' },
  { id: 'description', label: 'Description' },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function RoleList(props) {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { userPermission } = useSelector(({ auth }) => auth);

  const getAllRoles = async () => {
    try {
      await axios
        .get(`${urls_v1.account.roles.get_all}`)
        .then(({ data }) => {
          setRecords(data);
          setIsLoaded(true);
        })
        .then(res => {});
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    document.title = `ERL-BDMS - Roles`;
  }, []);

  useEffect(() => {
    getAllRoles();
  }, []);

  const onEdit = name => {
    axios
      .get(`${urls_v1.account.roles.get_by_name}/${name}`)
      .then(({ data }) => {
        props.history.push('/accounts/role/edit', data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
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
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>
                  {userPermission?.includes(roles.EDIT) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => {
                        onEdit(record.name);
                      }}>
                      Manage Permission
                    </Button>
                  )}
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
    <PageContainer heading="Roles" breadcrumbs={breadcrumbs}>
      <div className={classes.mainDiv}>
        {userPermission?.includes(roles.CREATE) && (
          <NavLink to="/accounts/role/new">
            <Button variant="outlined" color="primary" size="small" endIcon={<Add />}>
              New
            </Button>
          </NavLink>
        )}

        <br />
        <br />
        {tableContent}
      </div>
    </PageContainer>
  );
}
