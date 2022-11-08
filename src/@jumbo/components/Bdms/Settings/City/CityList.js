import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { brtaInformation } from '@jumbo/constants/PermissionsType';
import { EditIcon } from '@jumbo/controls/ActionButtons';
import {
  ButtonGroup,
  Grid,
  lighten,
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
import { useSelector } from 'react-redux';
import axios from '../../../../../services/auth/jwt/config';
import CityForm from './CityForm';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      fontSize: '1rem',
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
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  }
}));

export default function CityList() {
  const classes = useStyles();

  const [cities, setCities] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const { userPermission } = useSelector(({ auth }) => auth);

  const getAllCityRegion = async () => {
    try {
      await axios.get(urls_v1.brtaInformation.get_all_brta_info).then(({ data }) => {
        const body = data.data;
        if (data.succeeded) {
          setCities(body);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllCityRegion();
  }, []);
  return (
    <PageContainer heading="Cities">
      <div className={classes.mainDiv}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CityForm recordForEdit={recordForEdit} getAllCityRegion={getAllCityRegion} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cities.map((cities, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{cities.region}</TableCell>
                      <TableCell>
                        <ButtonGroup variant="outlined" size="small" color="primary">
                          {userPermission?.includes(brtaInformation.EDIT) && (
                            <EditIcon
                              onClick={() => {
                                setRecordForEdit(cities);
                              }}
                              title="Edit City"
                              placement="left"
                            />
                          )}

                          {/* <DeleteIcon title="Delete City" placement="top" /> */}
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>
    </PageContainer>
  );
}
