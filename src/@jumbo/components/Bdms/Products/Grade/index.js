import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import PageLoader from '../../@jumbo/components/PageComponents/PageLoader';

const Grades = ({ match }) => {
  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path={`${requestedUrl}/list`} component={lazy(() => import('./GradeList'))} />
        <Route path={`${requestedUrl}/new`} component={lazy(() => import('./GradeForm'))} />
      </Switch>
    </Suspense>
  );
};

export default Grades;
