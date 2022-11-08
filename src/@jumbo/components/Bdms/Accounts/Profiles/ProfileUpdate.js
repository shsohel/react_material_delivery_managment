import CmtAvatar from '@coremat/CmtAvatar';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { Box, Button, fade, Grid, TextField } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { EditAttributesOutlined, Link, LocalPhone, Lock, MailOutline, Title } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    padding: theme.spacing(5)
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
    padding: theme.spacing(5)
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
  password: {
    margin: '0.8rem'
  },
  changeButton: {
    color: 'green',
    fontWeight: 'bold'
  },
  cancelButton: {
    marginLeft: '0.8rem',
    marginTop: '0.2rem',
    color: 'red'
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Profile', link: '/accounts/profile' },
  { label: 'Updating', link: '', isActive: true }
];

const ProfileUpdate = props => {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const { authUser } = props.location.state;
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isPhotoChange, setIsPhotoChange] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [user, setUser] = useState({
    email: authUser.email,
    fullName: authUser.fullName,
    id: authUser.id,
    jobTitle: authUser.jobTitle,
    phoneNumber: authUser.phoneNumber,
    userName: authUser.userName,
    roles: authUser.roles,
    currentPassword: passwordChange.currentPassword,
    newPassword: passwordChange.newPassword,
    isEnabled: true
  });

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const imageUrl = `${REACT_APP_BASE_URL}/${authUser?.media?.fileUrl}`;
  const [previewPhoto, setPreviewPhoto] = useState({ image: imageUrl });

  const handlePhotoChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
  };
  const handleSubmit = () => {
    var form_data = new FormData();
    for (var key in user) {
      form_data.append(key, user[key]);
    }
    if (file) {
      form_data.append('File', file, fileName);
    }
    axios.put('/api/Account/users/me', form_data).then(({ data }) => {
      props.history.replace('/accounts/profile');
    });
  };
  return (
    <PageContainer heading="Profile Update" breadcrumbs={breadcrumbs}>
      <CmtCard className={classes.cardRoot}>
        <CmtCardContent>
          <GridContainer>
            <Grid item xs={12} md={7} xl={6}>
              <Box className={classes.vectorMapRoot}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="2%"
                  marginBottom="2%"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  <CmtAvatar className={classes.avator} size={300} src={previewPhoto.image} />
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginBottom="2%"
                  justifyContent="center"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  {!isPhotoChange ? (
                    <Button
                      className={classes.changeButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(true);
                      }}>
                      Change Photo
                    </Button>
                  ) : (
                    <Button
                      className={classes.cancelButton}
                      size="small"
                      variant="outlined"
                      onClick={e => {
                        setIsPhotoChange(false);
                        setPreviewPhoto({ image: imageUrl });
                        setFile();
                        setFileName();
                      }}>
                      Cancel
                    </Button>
                  )}
                </Box>
                {isPhotoChange && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}>
                    <TextField size="small" variant="outlined" name="file" onChange={handlePhotoChange} type="file" />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={5} xl={6}>
              <Box className={classes.vectorMapRoot}>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'jobtile')}>
                    <Title />
                  </Box>
                  <Box ml={5}>
                    <Box className={classes.wordAddress} fontSize={16}>
                      <Box component="a">
                        <TextField
                          label="Job Title"
                          size="small"
                          variant="outlined"
                          name="jobTitle"
                          value={user.jobTitle}
                          onChange={e => {
                            setUser({ ...user, jobTitle: e.target.value });
                          }}
                        />
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
                    <Box className={classes.wordAddress} fontSize={16}>
                      <Box component="a">
                        <TextField
                          label="Name"
                          size="small"
                          variant="outlined"
                          name="fullName"
                          value={user.fullName}
                          onChange={e => {
                            setUser({ ...user, fullName: e.target.value });
                          }}
                        />
                      </Box>
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
                    <Box className={classes.wordAddress} fontSize={16} color="text.primary">
                      <TextField
                        size="small"
                        label="Phone"
                        variant="outlined"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={e => {
                          setUser({ ...user, phoneNumber: e.target.value });
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                {!isChangePassword ? (
                  <Button
                    className={classes.changeButton}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setIsChangePassword(true);
                    }}>
                    Change Password
                  </Button>
                ) : (
                  <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                    <Box className={clsx(classes.iconView, 'phone')}>
                      <Lock />
                    </Box>
                    <Box ml={5}>
                      <Box component="span" fontSize={12} color="text.secondary">
                        Password Change
                      </Box>
                      <Box className={classes.wordAddress} fontSize={16} color="text.primary">
                        <TextField
                          className={classes.password}
                          size="small"
                          type="password"
                          label="Current Password"
                          variant="outlined"
                          name="currentPassword"
                          value={passwordChange.currentPassword}
                          onChange={e => {
                            setPasswordChange({ ...passwordChange, currentPassword: e.target.value });
                          }}
                        />
                        <TextField
                          className={classes.password}
                          size="small"
                          type="password"
                          label="New Password"
                          variant="outlined"
                          name="currentPassword"
                          value={passwordChange.password}
                          onChange={e => {
                            setPasswordChange({ ...passwordChange, newPassword: e.target.value });
                          }}
                        />
                        <Button
                          className={classes.cancelButton}
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setIsChangePassword(false);
                            setPasswordChange({ currentPassword: '', newPassword: '' });
                          }}>
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid container item xs={12} md={12} xl={12} justify="flex-end">
              <Box display="flex">
                <Box ml={2}>
                  <Button size="small" color="primary" variant="outlined" onClick={handleSubmit}>
                    Update
                  </Button>
                </Box>
                <Box ml={2}>
                  <NavLink to="/accounts/profile">
                    <Button size="small" color="primary" variant="outlined">
                      Cancel
                    </Button>
                  </NavLink>
                </Box>
              </Box>
            </Grid>
          </GridContainer>
        </CmtCardContent>
      </CmtCard>
    </PageContainer>
  );
};

export default ProfileUpdate;
