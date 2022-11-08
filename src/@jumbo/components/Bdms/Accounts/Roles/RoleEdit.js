import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Box, Button, CircularProgress, Grid, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {
  MdAddBox,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdChevronRight,
  MdFolder,
  MdFolderOpen,
  MdIndeterminateCheckBox,
  MdKeyboardArrowDown,
  MdList
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  circularProgressRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing(5),
    width: '95%'
  },
  selectEmpty: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  textField: {
    margin: theme.spacing(6),
    width: '60%'
  },

  permissions: {
    margin: theme.spacing(6),
    padding: theme.spacing(2),
    width: '60%',
    borderRadius: '6px',
    border: '1px solid #C6C6C6'
  }
}));

const breadcrumbs = [
  { label: 'Roles', link: '/accounts/role' },
  { label: 'Edit', link: '', isActive: true }
];

const icons = {
  check: <MdCheckBox className="rct-icon rct-icon-check" />,
  uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
  halfCheck: <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />,
  expandClose: <MdChevronRight className="rct-icon rct-icon-expand-close" />,
  expandOpen: <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />,
  expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
  collapseAll: <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />,
  parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
  parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
  leaf: <MdList className="rct-icon rct-icon-leaf-close" />
};

export default function RoleEdit(props) {
  const classes = useStyles();
  const record = props.location.state;
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [isPageLoaded, setPageIsLoaded] = useState(false);

  const getAllPermissions = async () => {
    try {
      await axios.get(`${urls_v1.account.permissions.get_all}`).then(({ data }) => {
        setPermissions([
          {
            value: 'permissions',
            label: 'Permissions',
            children: data.map(item => ({
              value: item.groupName,
              label: item.groupName,
              children: item.permissions.map(item => ({
                value: item,
                label: item.split('.')[2]
              }))
            }))
          }
        ]);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!record) {
      props.history.replace('/accounts/role');
    } else {
      getAllPermissions();
      setRoleName(record.name);
      setDescription(record.description);
      setChecked(record.permissions);
      setPageIsLoaded(true);
    }
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      id: record.id,
      name: roleName,
      description: description,
      permissions: checked
    };
    axios
      .put(`${urls_v1.account.roles.post}/${data.id}`, data)
      .then(res => {
        props.history.replace('/accounts/role');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <PageContainer heading="New Role" breadcrumbs={breadcrumbs}>
        <form onSubmit={handleSubmit}>
          <Paper className={classes.paper} elevation={3}>
            <GridContainer>
              <Grid container>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Box>
                    <Box>
                      <TextField
                        label="Role Name"
                        className={classes.textField}
                        size="small"
                        variant="outlined"
                        placeholder="Enter Role Name"
                        value={roleName}
                        onChange={e => {
                          setRoleName(e.target.value);
                        }}
                      />
                    </Box>
                    <Box>
                      <TextField
                        label="Role Description"
                        className={classes.textField}
                        size="small"
                        variant="outlined"
                        placeholder="Enter Role Description"
                        value={description}
                        onChange={e => {
                          setDescription(e.target.value);
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Box className={classes.permissions}>
                    <CheckboxTree
                      nodes={permissions}
                      checked={checked}
                      expanded={expanded}
                      onCheck={checked => setChecked(checked)}
                      onExpand={expanded => setExpanded(expanded)}
                      icons={icons}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
                <Box display="flex">
                  <Box ml={2}>
                    <Button type="submit" size="small" variant="outlined" color="primary">
                      Submit
                    </Button>
                  </Box>
                  <Box ml={2}>
                    <NavLink to="/accounts/role">
                      <Button size="small" color="primary" variant="outlined">
                        Cancel
                      </Button>
                    </NavLink>
                  </Box>
                </Box>
              </Grid>
            </GridContainer>
          </Paper>
        </form>
      </PageContainer>
    </div>
  );
}
