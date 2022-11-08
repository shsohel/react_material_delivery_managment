import React from 'react';
import { Route } from 'react-router';
import Error404 from './Pages/404';

const ProtectedRoute = ({ component: Component, isAuthenticated: IsAuthenticated, ...rest }) => {
  return <Route {...rest} render={props => (IsAuthenticated ? <Component {...props} /> : <Route component={Error404} />)} />;
};

export default ProtectedRoute;
