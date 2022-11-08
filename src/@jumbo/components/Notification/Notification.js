import { makeStyles, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';

const useStyles = makeStyles(theme => ({
    root: {
        top: theme.spacing(9)
    }
}))



export default function Notification(props) {
    const classes = useStyles()
    const { notify, setNotify } = props;
    const handleClose = (event, reason) => {
        // If we need to close the notification by clicking outside
        if (reason === 'clickaway') {
            return;
        }
        setNotify({
            ...notify,
            isOpen: false
        })
    }
    return (
        <Snackbar
            open={notify.isOpen}
            autoHideDuration={3000}
            className={classes.root}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}>
            <Alert
                severity={notify.type}
                onClose={handleClose}>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}
