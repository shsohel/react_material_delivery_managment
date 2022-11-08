import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { liftingSchedules } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Schedules = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasScheduleViewPermission = userPermission?.includes(liftingSchedules.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/list`}
          component={lazy(() => import('./LiftingScheduleList'))}
          isAuthenticated={hasScheduleViewPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Schedules;
