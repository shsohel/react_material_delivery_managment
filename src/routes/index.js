import ForgotPasswordPage from '@jumbo/components/Auth/ForgotPassword';
import Login from '@jumbo/components/Auth/Login';
import Register from '@jumbo/components/Auth/Register';
import ResetPasswordPage from '@jumbo/components/Auth/ResetPassword';
import Accounts from '@jumbo/components/Bdms/Accounts';
import BarcodeCheck from '@jumbo/components/Bdms/BarcodeCheck';
import Clients from '@jumbo/components/Bdms/Clients';
import CodeGenerate from '@jumbo/components/Bdms/CodeGenerate';
import Dashboard from '@jumbo/components/Bdms/Dashboard';
import LiftingSchedules from '@jumbo/components/Bdms/LiftingSchedule';
import Loading from '@jumbo/components/Bdms/Loading';
import Orders from '@jumbo/components/Bdms/Orders';
import Permits from '@jumbo/components/Bdms/Permits';
import Products from '@jumbo/components/Bdms/Products';
import Report from '@jumbo/components/Bdms/Reports/Report';
import Sales from '@jumbo/components/Bdms/Sales';
import SecutityCheck from '@jumbo/components/Bdms/SecurityCheck';
import Settings from '@jumbo/components/Bdms/Settings';
import StockAdjustment from '@jumbo/components/Bdms/StockAdjustment';
import TestPage from '@jumbo/components/Bdms/TestPage/TestPage';
import TestSohel from '@jumbo/components/Bdms/TestPage/TestSohel';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import Companies from '../@jumbo/components/Bdms/Companies';
import Error404 from './Pages/404';
///End Restricted Route to authorised user
const RestrictedRoute = ({ component: Component, ...rest }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

///End Restricted Route to authorised user

const Routes = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  const location = useLocation();

  if (location.pathname === '' || location.pathname === '/') {
    return <Redirect to={'/dashboard'} />;
  } else if (authUser && location.pathname === '/signin') {
    return <Redirect to={'/dashboard'} />;
  }

  return (
    <React.Fragment>
      <Switch>
        <RestrictedRoute path="/dashboard" component={Dashboard} />
        <RestrictedRoute path="/code-generate" component={CodeGenerate} />
        <RestrictedRoute path="/clients" component={Clients} />
        <RestrictedRoute path="/products" component={Products} />
        <RestrictedRoute path="/schedules" component={LiftingSchedules} />
        <RestrictedRoute path="/settings" component={Settings} />
        <RestrictedRoute path="/accounts" component={Accounts} />
        <RestrictedRoute path="/companies" component={Companies} />
        <RestrictedRoute path="/orders" component={Orders} />
        <RestrictedRoute path="/permits" component={Permits} />
        <RestrictedRoute path="/security-check" component={SecutityCheck} />
        <RestrictedRoute path="/loading" component={Loading} />
        <RestrictedRoute path="/sales" component={Sales} />
        <RestrictedRoute path="/stock-adjustment" component={StockAdjustment} />
        <RestrictedRoute path="/reports" component={Report} />
        <RestrictedRoute path="/barcode-check" component={BarcodeCheck} />
        <RestrictedRoute path="/tests" component={TestPage} />
        <RestrictedRoute path="/s-tests" component={TestSohel} />

        <Route path="/signin" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />

        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
