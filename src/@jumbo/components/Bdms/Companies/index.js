import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Companies = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={`${requestedUrl}/list`} component={lazy(() => import('./CompanyList'))} />
        <Route path={`${requestedUrl}/details`} component={lazy(() => import('./CompanyDetails'))} />
        <Route path={`${requestedUrl}/new`} component={lazy(() => import('./CompanyCreate'))} />
        <Route path={`${requestedUrl}/edit`} component={lazy(() => import('./CompanyEdit'))} />
      </Switch>
    </Suspense>
  );
};

export default Companies;
