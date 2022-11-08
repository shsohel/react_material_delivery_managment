import { Box } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import CmtAvatar from '../../../../@coremat/CmtAvatar';
import elrLogo from '../../../../assests/images/erlLoginImage.png';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '11px 16px 12px 16px',
    borderBottom: `solid 1px ${theme.palette.sidebar.borderColor}`,
    marginBottom: '25px',
    backgroundColor: 'white'
  },
  userInfo: {
    paddingTop: 24,
    transition: 'all 0.1s ease',
    height: 75,
    opacity: 1,
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      height: 0,
      paddingTop: 0,
      opacity: 0,
      transition: 'all 0.3s ease'
    }
  },
  userTitle: {
    color: theme.palette.sidebar.textLightColor,
    marginBottom: 8
  },
  userSubTitle: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: 0.25
  }
}));

const SidebarHeader = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Box className={classes.root}>
        <CmtAvatar src={`${elrLogo}`} />
        {/* <Box className={classes.userInfo}>
          <CmtDropdownMenu
            onItemClick={onItemClick}
            TriggerComponent={
              <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                <Box mr={2}>
                  <Typography className={classes.userTitle} component="h3" variant="h2">
                    {authUser?.userName}
                  </Typography>
                  <Typography className={classes.userSubTitle}>{authUser?.email}</Typography>
                </Box>
                <ArrowDropDownIcon />
              </Box>
            }
            items={actionsList}
          />
        </Box> */}
      </Box>
    </React.Fragment>
  );
};

export default SidebarHeader;
