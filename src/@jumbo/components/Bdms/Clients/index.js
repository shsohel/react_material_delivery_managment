import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { clientRepresentative, clients } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Clients = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasClientViewPermission = userPermission?.includes(clients.VIEW);
  const hasClientCreatePermission = userPermission?.includes(clients.CREATE);
  const hasClientEditPermission = userPermission?.includes(clients.EDIT);
  const hasRepresentativeViewPermission = userPermission?.includes(clientRepresentative.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/active-clients`}
          component={lazy(() => import('./ActiveClientList'))}
          isAuthenticated={hasClientViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/inactive-clients`}
          component={lazy(() => import('./InactiveClientList'))}
          isAuthenticated={hasClientEditPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/new`}
          component={lazy(() => import('./ClientCreate'))}
          isAuthenticated={hasClientCreatePermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/edit`}
          component={lazy(() => import('./ClientEdit'))}
          isAuthenticated={hasClientEditPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/reprentatives`}
          component={lazy(() => import('./ClientRepresentative'))}
          isAuthenticated={hasRepresentativeViewPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Clients;
