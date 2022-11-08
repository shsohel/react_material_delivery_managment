import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { audit } from '@jumbo/constants/PermissionsType';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import EntryPermitCheck from './EntryPermitCheck';
import ExitPermitCheck from './ExitPermitCheck';
import InvoiceCheck from './InvoiceCheck';
import UserCheck from './UserCheck';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(6),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  }
}));

export default function BarcodeCheck() {
  const classes = useStyles();
  const { userPermission } = useSelector(({ auth }) => auth);
  return (
    <PageContainer heading="Barcode Check">
      <NotificationContainer />
      {userPermission?.includes(audit.ENTRY_PERMIT_INSPECTION) && (
        <Paper className={classes.paper}>
          <u>
            <strong>
              <h2 style={{ color: 'black' }}>Entry Permit</h2>
            </strong>
          </u>
          <br />
          <EntryPermitCheck />
        </Paper>
      )}
      {userPermission?.includes(audit.EXIT_PERMIT_INSPECTION) && (
        <Paper className={classes.paper}>
          <u>
            <strong>
              <h2 style={{ color: 'black' }}>Exit Permit</h2>
            </strong>
          </u>
          <br />
          <ExitPermitCheck />
        </Paper>
      )}
      {userPermission?.includes(audit.INVOICE_INSPECTION) && (
        <Paper className={classes.paper}>
          <u>
            <strong>
              <h2 style={{ color: 'black' }}>Invoice</h2>
            </strong>
          </u>
          <br />
          <InvoiceCheck />
        </Paper>
      )}
      {userPermission?.includes(audit.INVOICE_INSPECTION) && (
        <Paper className={classes.paper}>
          <u>
            <strong>
              <h2 style={{ color: 'black' }}>User</h2>
            </strong>
          </u>
          <br />
          <UserCheck />
        </Paper>
      )}
    </PageContainer>
  );
}
