import CmtAvatar from '@coremat/CmtAvatar';
import { CurrentAuthMethod } from '@jumbo/constants/AppConstants';
import { Box, makeStyles } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircleOutlined, ExitToApp } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuhMethods } from 'services/auth';

const useStyles = makeStyles(theme => ({
  avator: {
    width: '40px',
    height: '40px',
    margin: 'auto',
    border: 'solid 2px white'
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: '#EDEDED',
      color: '#E68A2D',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: 'black'
      }
    }
  }
}))(MenuItem);

export default function Profiles(props) {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutClick = () => {
    dispatch(AuhMethods[CurrentAuthMethod].onLogout());
  };
  const onProfileShow = () => {
    window.location.href = '/accounts/profile';
  };

  return (
    <Box className={classes.root}>
      <CmtAvatar
        className={classes.avator}
        src={`${REACT_APP_BASE_URL}/${authUser?.media?.fileUrl}`}
        onClick={handleClick}
      />
      <p>{authUser?.userName}</p>
      <StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <StyledMenuItem
          onClick={() => {
            onProfileShow();
          }}>
          <ListItemIcon>
            <AccountCircleOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </StyledMenuItem>
        <StyledMenuItem
          onClick={() => {
            onLogoutClick();
          }}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </StyledMenuItem>
      </StyledMenu>
    </Box>
  );
}
