import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { audit } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const BarcodeCheck = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasAuditViewPermission =
    userPermission?.includes(audit.ENTRY_PERMIT_INSPECTION) ||
    userPermission?.includes(audit.EXIT_PERMIT_INSPECTION) ||
    userPermission?.includes(audit.INVOICE_INSPECTION) ||
    userPermission?.includes(audit.USER_INO_INSPECTION);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}`}
          component={lazy(() => import('./Inspections'))}
          isAuthenticated={hasAuditViewPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default BarcodeCheck;
