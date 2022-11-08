import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { entryPermits, exitPermits } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Permits = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEntryPermitCreatePermission = userPermission?.includes(entryPermits.CREATE);
  const hasEntryPermitViewPermission = userPermission?.includes(entryPermits.VIEW);
  const hasExitPermitViewPermission = userPermission?.includes(exitPermits.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/entry-permit-list`}
          component={lazy(() => import('./EntryPermit/EntryPermitList'))}
          isAuthenticated={hasEntryPermitViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/entry`}
          component={lazy(() => import('./EntryPermit/EntryPermitForm'))}
          isAuthenticated={hasEntryPermitCreatePermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/exit-permit-list`}
          component={lazy(() => import('./ExitPermit/ExitPermitList'))}
          isAuthenticated={hasExitPermitViewPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Permits;
