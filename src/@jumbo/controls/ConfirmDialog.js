import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from '@material-ui/core';
import { NotListedLocation } from '@material-ui/icons';
import React from 'react';
import Controls from '../controls/Controls';

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  },
  dialogContent: {
    textAlign: 'center'
  },
  dialogAction: {
    justifyContent: 'center'
  },
  dialogTitle: {
    textAlign: 'center'
  },
  titleIcon: {
    backgroundColor: '#C6C6C6',
    color: 'red',
    '& :hover': {
      backgroundColor: theme.palette.secondary.light,
      cursor: 'default'
    },
    '& .MuiSvgIcon-root': {
      fontSize: '8rem'
    }
  }
}));

export default function ConfirmDialog(props) {
  const classes = useStyles();
  const { confirmDialog, setConfirmDialog } = props;
  return (
    <Dialog scroll="body" open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          <NotListedLocation />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Controls.Button
          text="No"
          color="default"
          onClick={() => {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }}
        />
        <Controls.Button text="Yes" color="primary" onClick={confirmDialog.onConfirm} />
      </DialogActions>
    </Dialog>
  );
}
