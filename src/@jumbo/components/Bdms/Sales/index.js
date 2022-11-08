import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { invoices } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Sales = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasInvoiceViewPermission = userPermission?.includes(invoices.VIEW);
  const hasInvoiceCreatePermission = userPermission?.includes(invoices.CREATE);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/invoice-list`}
          component={lazy(() => import('./Invoice/InvoiceList'))}
          isAuthenticated={hasInvoiceViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/invoice-new`}
          component={lazy(() => import('./Invoice/InvoiceForm'))}
          isAuthenticated={hasInvoiceCreatePermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Sales;
