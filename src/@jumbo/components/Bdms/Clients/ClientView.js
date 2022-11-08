import { Box, fade, Grid } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  Language,
  LocalPhone,
  LocalPrintshop,
  LocationOn,
  PersonAdd,
  Phone,
  TitleRounded,
  WorkOutline
} from '@material-ui/icons';
import Link from '@material-ui/icons/Link';
import MailOutline from '@material-ui/icons/MailOutline';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
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

  tableHeading: {
    width: '500px',
    '& tbody td': {
      fontWeight: 'bold'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    },
    padding: theme.spacing(2)
  },
  cardRoot: {
    padding: theme.spacing(2)
  },
  textUppercase: {
    textTransform: 'uppercase'
  },
  vectorMapRoot: {
    width: '100%',
    height: '95%',
    overflow: 'hidden',
    '& .jvectormap-container': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: `${theme.palette.background.paper} !important`
    },
    border: 'solid 2px',
    borderColor: '#C6C6C6',
    padding: theme.spacing(4),
    margin: theme.spacing(2)
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
  },
  rootDiv: {
    width: '900px'
  }
}));
export default function ClientView(props) {
  const classes = useStyles();
  const { recordForDetails } = props;
  return (
    <Grid container className={classes.rootDiv}>
      <Grid container item xs={12} sm={12} md={6} lg={6}>
        <Box className={classes.vectorMapRoot}>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'jobtile')}>
              <TitleRounded />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Job Title
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16}>
                <Box component="a">{recordForDetails.nameEN}</Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'username')}>
              <Link />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Short Code
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16}>
                <Box component="a">{recordForDetails.shortNameEN}</Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView)}>
              <LocalPhone />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Phone
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16}>
                <Box component="a">{recordForDetails.phoneNumberEN}</Box>
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
              <Box component="p" className={classes.wordAddress} fontSize={14}>
                <Box component="a" href={`mailto:${recordForDetails.email}`}>
                  {recordForDetails.email}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'phone')}>
              <LocalPrintshop />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                FAX
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16}>
                <Box component="a">{recordForDetails.faxNumberEN}</Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'email')}>
              <TitleRounded />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                BIN
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16}>
                <Box component="a">{recordForDetails.binNumberEN}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid container item xs={12} lg={6} sm={12} md={6}>
        <Box className={classes.vectorMapRoot}>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView)}>
              <PersonAdd />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Contact Person
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16}>
                <Box component="a">{recordForDetails.contactPerson}</Box>
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'phone')}>
              <WorkOutline />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Contact Person Designation
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                {recordForDetails.contactPersonDesignation}
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'email')}>
              <Phone />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Contact Person Phone
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                {recordForDetails.contactPersonPhoneNumber}
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView)}>
              <Language />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Website
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                {recordForDetails.website}
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
            <Box className={clsx(classes.iconView, 'phone')}>
              <LocationOn />
            </Box>
            <Box ml={5}>
              <Box component="span" fontSize={12} color="text.secondary">
                Address
              </Box>
              <Box component="p" className={classes.wordAddress} fontSize={16} color="text.primary">
                {recordForDetails.addressEN}
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
