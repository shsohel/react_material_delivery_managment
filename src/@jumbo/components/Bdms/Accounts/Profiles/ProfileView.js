import CmtAvatar from '@coremat/CmtAvatar';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { urls_v1 } from '@jumbo/constants/ApplicationUrls/v1';
import { urls_v2 } from '@jumbo/constants/ApplicationUrls/v2';
import { Box, CircularProgress, fade, FormControlLabel, Switch } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { EditAttributesOutlined, Link, LocalPhone, MailOutline, TitleRounded } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import axios from '../../../../../services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    padding: theme.spacing(4)
  },
  textUppercase: {
    textTransform: 'uppercase'
  },
  vectorMapRoot: {
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

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Profile', link: '', isActive: true }
];

const ProfileView = props => {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState('');
  const [checked, setChecked] = useState(false);

  const getUser = async () => {
    try {
      await axios.get(`${urls_v1.account.users.get_me}`).then(({ data }) => {
        console.log('Enter 1');
        setAuthUser(data);
        setIsPageLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const handleTokenVisibilityChange = () => {
    axios.get(urls_v2.confirmationToken.get_user_confirmation_token).then(({ data }) => {
      if (data.succeeded) {
        setToken(data.data);
      }
      setChecked(prev => !prev);
    });
  };

  return (
    <PageContainer heading="Profile" breadcrumbs={breadcrumbs}>
      {authUser && (
        <CmtCard className={classes.cardRoot}>
          <CmtCardContent>
            <GridContainer>
              <Grid item xs={12} md={7} xl={6}>
                <Box className={classes.vectorMapRoot}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="5%"
                    marginBottom="10%"
                    flexDirection={{ xs: 'column', sm: 'row' }}>
                    <CmtAvatar
                      className={classes.avator}
                      size={300}
                      src={`${REACT_APP_BASE_URL}/${authUser?.media?.fileUrl}`}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} xl={6}>
                <Box className={classes.vectorMapRoot}>
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
                          {authUser.jobTitle}
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
                        {authUser.userName}
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
                        <Box component="a">{authUser.fullName}</Box>
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
                        <Box component="a" href={`mailto:${authUser.email}`}>
                          {authUser.email}
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
                        {authUser.phoneNumber}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                    <Box className={clsx(classes.iconView, 'phone')}>
                      <FormControlLabel
                        control={<Switch checked={checked} onChange={handleTokenVisibilityChange} />}
                        label={checked ? 'Hide token' : 'Show token'}
                      />
                    </Box>
                    <Box ml={5}>
                      {checked && (
                        <>
                          <Box component="span" fontSize={12} color="text.secondary">
                            Security Token
                          </Box>
                          <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                            {token ? token : 'You do not have token'}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid container item xs={12} md={12} xl={12} justify="flex-end">
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    props.history.replace('/accounts/profile-update', { authUser });
                  }}>
                  Edit
                </Button>
              </Grid>
            </GridContainer>
          </CmtCardContent>
        </CmtCard>
      )}
    </PageContainer>
  );
};

export default ProfileView;
