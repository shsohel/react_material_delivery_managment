import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { currencies, financialYears, packagingTypes, statuses, units } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Settings = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasUnitViewPermission = userPermission?.includes(units.VIEW);
  const hasCurrencyViewPermission = userPermission?.includes(currencies.VIEW);
  const hasFinancialYearViewPermission = userPermission?.includes(financialYears.VIEW);
  const hasPackagingTypeViewPermission = userPermission?.includes(packagingTypes.VIEW);
  const hasStatusViewPermission = userPermission?.includes(statuses.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/unit`}
          component={lazy(() => import('./Units'))}
          isAuthenticated={hasUnitViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/currency`}
          component={lazy(() => import('./Currency'))}
          isAuthenticated={hasCurrencyViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/financial-year`}
          component={lazy(() => import('./FinancialYear/financialYearList'))}
          isAuthenticated={hasFinancialYearViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/packaging-type`}
          component={lazy(() => import('./PurchaseType'))}
          isAuthenticated={hasPackagingTypeViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/status`}
          component={lazy(() => import('./Status'))}
          isAuthenticated={hasStatusViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/system-settings`}
          component={lazy(() => import('./SystemSettings/systemSettingsList'))}
        />
        <Route exact path={`${requestedUrl}/drivers`} component={lazy(() => import('./Driver/DriverList'))} />
        <Route exact path={`${requestedUrl}/cities`} component={lazy(() => import('./City/CityList'))} />
      </Switch>
    </Suspense>
  );
};

export default Settings;
