import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';

const Reports = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}`} component={lazy(() => import('./Report'))} />
      </Switch>
    </Suspense>
  );
};

export default Reports;
