import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { securityChecks } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const SecutityCheck = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasEntryConfirmViewPermission = userPermission?.includes(securityChecks.ENTRY_CHECK);
  const hasExitConfirmViewPermission = userPermission?.includes(securityChecks.EXIT_CHECK);
  const requestedUrl = match.url.replace(/\/$/, '');

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/entry`}
          component={lazy(() => import('./EntryConfirm'))}
          isAuthenticated={hasEntryConfirmViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/exit`}
          component={lazy(() => import('./ExitConfirm'))}
          isAuthenticated={hasExitConfirmViewPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default SecutityCheck;
