import CmtAvatar from '@coremat/CmtAvatar';
import GridContainer from '@jumbo/components/GridContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { Box, Button, fade, Grid, TextField } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { EditAttributesOutlined, Link, LocalPhone, MailOutline, TitleRounded, VpnKey } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios from '../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(6),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },

  userRoot: {
    width: '100%',
    height: '100%',
    minHeight: 200,
    overflow: 'hidden',
    '& .jvectormap-container': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: `${theme.palette.background.paper} !important`
    },
    border: 'solid 2px',
    borderColor: '#C6C6C6',
    padding: theme.spacing(4)
  },
  avator: {
    border: 'solid 2px',
    borderColor: '#C6C6C6'
  },

  ///Contact Info
  iconView: {
    backgroundColor: fade(blue['500'], 0.1),
    color: blue['500'],
    padding: 8,
    borderRadius: 4,
    '& .MuiSvgIcon-root': {
      display: 'block'
    },

    '&.username': {
      backgroundColor: fade(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main
    },
    '&.phone': {
      backgroundColor: fade(theme.palette.success.main, 0.15),
      color: theme.palette.success.dark
    },

    '&.jobtile': {
      backgroundColor: fade(theme.palette.success.main, 0.15),
      color: theme.palette.success.dark
    },
    '&.email': {
      backgroundColor: fade(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main
    }
  },

  wordAddress: {
    wordBreak: 'break-all',
    cursor: 'pointer'
  },
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
  }
}));
const initialEntryPermit = {
  email: '',
  employeeID: '',
  file: null,
  fullName: '',
  id: '',
  jobTitle: '',
  phoneNumber: '',
  roles: [],
  userName: ''
};

export default function UserCheck() {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const [employeeId, setEmployeeId] = useState('');
  const [user, setUser] = useState(initialEntryPermit);

  const getUserInfo = async employeeId => {
    await axios
      .get(`${urls_v1.account.users.user_check_by_employeeId}/${employeeId}`)
      .then(({ data }) => {
        setUser(data);
      })
      .catch(({ response }) => {
        NotificationManager.error(response.statusText);
      });
  };

  const onResetEntryPermit = () => {
    setEmployeeId('');
    setUser(initialEntryPermit);
    document.getElementById('txtEmployeeId').focus();
  };

  const onEmployeeKeypress = e => {
    if (e.key === 'Enter') {
      getUserInfo(employeeId);
    }
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={11} md={11} lg={11} xl={11}>
          <TextField
            size="small"
            fullWidth
            id="txtEmployeeId"
            label="Employee Id"
            variant="outlined"
            placeholder="Employee ID"
            value={employeeId}
            onChange={e => {
              setEmployeeId(e.target.value);
            }}
            onKeyPress={onEmployeeKeypress}
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1} xl={1}>
          <Button color="primary" variant="outlined" disableRipple onClick={onResetEntryPermit}>
            Reset
          </Button>
        </Grid>
      </Grid>
      <br />
      <div>
        {user.employeeID && (
          <GridContainer>
            <Grid item xs={12} md={7} xl={6}>
              <Box className={classes.userRoot}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="5%"
                  marginBottom="10%"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  <CmtAvatar className={classes.avator} size={300} src={`${REACT_APP_BASE_URL}/${user?.media?.fileUrl}`} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} xl={6}>
              <Box className={classes.userRoot}>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'username')}>
                    <VpnKey />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.primary">
                      Employee ID
                    </Box>
                    <Box className={classes.wordAddress} fontSize={16}>
                      <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                        {user.employeeID}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'jobtile')}>
                    <TitleRounded />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.primary">
                      Job Title
                    </Box>
                    <Box className={classes.wordAddress} fontSize={16}>
                      <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                        {user.jobTitle}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'username')}>
                    <Link />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      User Name
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                      {user.userName}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={classes.iconView}>
                    <EditAttributesOutlined />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      Name
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16}>
                      <Box component="a">{user.fullName}</Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'email')}>
                    <MailOutline />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      Email
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16}>
                      <Box component="a" href={`mailto:${user.email}`}>
                        {user.email}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'phone')}>
                    <LocalPhone />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      Phone
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                      {user.phoneNumber}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </GridContainer>
        )}
      </div>
    </>
  );
}
