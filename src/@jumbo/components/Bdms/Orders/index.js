import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { liftingSchedules, orders } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Orders = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasOrdersViewPermission = userPermission?.includes(orders.VIEW);
  const hasOrdersCreatePermission = userPermission?.includes(orders.CREATE);
  const hasOrdersEditPermission = userPermission?.includes(orders.EDIT);
  const hasOrdersConfirmationPermission = userPermission?.includes(orders.CREATE);
  const hasLiftingScheduleManagePermission = userPermission?.includes(liftingSchedules.CREATE);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/list`}
          component={lazy(() => import('./OrderList'))}
          isAuthenticated={hasOrdersViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/requested-orders`}
          component={lazy(() => import('./RequestedOrders/RequestedOrderList'))}
          isAuthenticated={hasOrdersViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/new`}
          component={lazy(() => import('./OrderForm'))}
          isAuthenticated={hasOrdersCreatePermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/edit`}
          component={lazy(() => import('./OrderEdit'))}
          isAuthenticated={hasOrdersEditPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/order-confirmation`}
          component={lazy(() => import('./OrderConfirmation'))}
          isAuthenticated={hasOrdersConfirmationPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/manage-schedule`}
          component={lazy(() => import('../LiftingSchedule/LiftingScheduleManage'))}
          isAuthenticated={hasLiftingScheduleManagePermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Orders;
