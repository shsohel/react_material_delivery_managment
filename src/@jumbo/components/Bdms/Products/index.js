import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { priceConfigurations, products, unitConfigurations } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Products = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasProductViewPermission = userPermission?.includes(products.VIEW);
  const hasProductCreatePermission = userPermission?.includes(products.CREATE);
  const hasProductEditPermission = userPermission?.includes(products.EDIT);
  const hasPriceConfigurationViewPermission = userPermission?.includes(priceConfigurations.VIEW);
  const hasProductUnitConversionViewPermission = userPermission?.includes(unitConfigurations.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/list`}
          component={lazy(() => import('./Product'))}
          isAuthenticated={hasProductViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/new`}
          component={lazy(() => import('./Product/ProductForm'))}
          isAuthenticated={hasProductCreatePermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/edit`}
          component={lazy(() => import('./Product/ProductEdit'))}
          isAuthenticated={hasProductEditPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/price-configuration`}
          component={lazy(() => import('./PriceConfiguration'))}
          isAuthenticated={hasPriceConfigurationViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/unit-conversion`}
          component={lazy(() => import('./ProductUnitConversion'))}
          isAuthenticated={hasProductUnitConversionViewPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Products;
