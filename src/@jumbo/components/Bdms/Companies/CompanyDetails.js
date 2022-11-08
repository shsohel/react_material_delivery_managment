import CmtAvatar from '@coremat/CmtAvatar';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import CmtCardHeader from '@coremat/CmtCard/CmtCardHeader';
// import Header from './Header';
import GridContainer from '@jumbo/components/GridContainer';
import { Box, fade } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import blue from '@material-ui/core/colors/blue';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DynamicFeedOutlinedIcon from '@material-ui/icons/DynamicFeedOutlined';
import LinkIcon from '@material-ui/icons/Link';
import LocalPhoneIcon from '@material-ui/icons/LocalPhoneOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  pageFull: {
    width: '100%'
  },
  profileSidebar: {
    '@media screen and (min-width: 1280px) and (max-width: 1499px)': {
      flexBasis: '100%',
      maxWidth: '100%'
    }
  },
  profileMainContent: {
    '@media screen and (min-width: 1280px) and (max-width: 1499px)': {
      flexBasis: '100%',
      maxWidth: '100%'
    }
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
    '&.web': {
      backgroundColor: fade(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main
    },
    '&.phone': {
      backgroundColor: fade(theme.palette.success.main, 0.15),
      color: theme.palette.success.dark
    },
    '&.fax': {
      backgroundColor: fade(theme.palette.success.dark, 0.1),
      color: theme.palette.warning.main
    }
  },
  wordAddress: {
    wordBreak: 'break-all',
    cursor: 'pointer'
  },
  //Profile Image
  cardSize: {
    minWidth: '100%',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    alignItems: 'center'
  }
}));

const CompanyDetails = props => {
  const { REACT_APP_BASE_URL } = process.env;
  const classes = useStyles();
  let data = null;
  if (props.location.state.details) {
    data = props.location.state.details;
  } else if (props.location.state.editcompany) {
    data = props.location.state.editcompany;
  }

  const onEdit = company => {
    if (props.location.state.details) {
      delete props.location.state.details;
    }
    props.history.replace('/companies/edit', { company });
  };

  return (
    <React.Fragment>
      <GridContainer>
        <Grid container direction="row" justify="flex-end" item xs={12} sm={12} md={12} lg={12}>
          <Button
            onClick={() => {
              onEdit(data);
            }}
            variant="outlined"
            color="primary">
            Edit
          </Button>
        </Grid>

        <Grid item container xs={12} md={12} lg={12} spacing={8}>
          <Grid container justify="center" alignItems="center" item xs={12} md={4} lg={4}>
            <CmtCard className={classes.cardSize}>
              <CmtCardContent>
                <Box>
                  <CmtAvatar size={200} src={`${REACT_APP_BASE_URL}/${data.companyMedia.fileUrl}`} />
                </Box>
              </CmtCardContent>
            </CmtCard>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <CmtCard>
              <CmtCardHeader title={data.nameEN} />
              <CmtCardContent>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={classes.iconView}>
                    <MailOutlineIcon />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      Email
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16}>
                      <Box component="a" href={`mailto:${data.email}`}>
                        {data.email}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'phone')}>
                    <LocalPhoneIcon />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      Phone
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                      {data.phoneNumberEN}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'web')}>
                    <LinkIcon />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      BIN
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                      {data.binNumberEN}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'fax')}>
                    <DynamicFeedOutlinedIcon />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      FAX
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                      {data.faxNumberEN}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={clsx(classes.iconView, 'web')}>
                    <LinkIcon />
                  </Box>
                  <Box ml={5}>
                    <Box component="span" fontSize={12} color="text.secondary">
                      Address
                    </Box>
                    <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                      {data.addressEN}
                    </Box>
                  </Box>
                </Box>
              </CmtCardContent>
            </CmtCard>
          </Grid>
        </Grid>
      </GridContainer>
    </React.Fragment>
  );
};

export default CompanyDetails;
