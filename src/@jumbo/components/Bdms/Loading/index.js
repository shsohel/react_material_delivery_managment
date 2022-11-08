import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { loading, loadingConfirmation } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Loading = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasLoadingViewPermission = userPermission?.includes(loading.VIEW);
  const hasLoadingConfirmationPermission = userPermission?.includes(loadingConfirmation.CONFIRM);
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/loading-list`}
          component={lazy(() => import('./LoadUnloadList'))}
          isAuthenticated={hasLoadingViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/loaded-value-confirmation-list`}
          component={lazy(() => import('./LoadedValueConfirmation'))}
          isAuthenticated={hasLoadingConfirmationPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/loaded-value-confirmation`}
          component={lazy(() => import('./LoadedValueConfirmation/LoadedValueConfirmationForm'))}
          isAuthenticated={hasLoadingConfirmationPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Loading;
