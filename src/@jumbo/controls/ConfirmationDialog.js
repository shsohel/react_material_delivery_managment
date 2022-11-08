import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  makeStyles
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  btnAgree: {
    backgroundColor: '#FFFFFF',
    color: '#6BBC6E',
    '&:hover': {
      backgroundColor: '#6BBC6E',
      color: '#FFFFFF'
    }
  },
  btnDisAgree: {
    backgroundColor: '#FFFFFF',
    color: '#DB4449',
    '&:hover': {
      backgroundColor: '#DB4449',
      color: '#FFFFFF'
    }
  }
}));

export default function ConfirmationDialog(props) {
  const classes = useStyles();
  const { confirmationDialog, setConfirmationDialog } = props;
  return (
    <Dialog open={confirmationDialog.isOpen}>
      <DialogTitle style={{ color: 'black', fontWeight: 'bold' }}>{confirmationDialog.heading}</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText style={{ color: '#404040' }}>{confirmationDialog.title}</DialogContentText>
        <DialogContentText style={{ color: 'black', fontWeight: 'bold' }}>{confirmationDialog.subTitle}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          variant="outlined"
          className={classes.btnDisAgree}
          onClick={() => {
            setConfirmationDialog({
              ...confirmationDialog,
              isOpen: false
            });
          }}
          color="primary">
          Disagree
        </Button>
        <Button
          size="small"
          className={classes.btnAgree}
          variant="outlined"
          onClick={confirmationDialog.onConfirm}
          color="primary"
          autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
