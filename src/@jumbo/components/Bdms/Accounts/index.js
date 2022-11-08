import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import { approvalProcess, roles, users } from '@jumbo/constants/PermissionsType';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import ProtectedRoute from 'routes/ProtectedRoute';

const Accounts = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasRoleCreatePermission = userPermission?.includes(roles.CREATE);
  const hasRoleEditPermission = userPermission?.includes(roles.EDIT);
  const hasRoleViewPermission = userPermission?.includes(roles.VIEW);
  const hasUserCreatePermission = userPermission?.includes(users.CREATE);
  const hasUserEditPermission = userPermission?.includes(users.EDIT);
  const hasUserViewPermission = userPermission?.includes(users.VIEW);
  const hasApprovalProcessViewPermission = userPermission?.includes(approvalProcess.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <ProtectedRoute
          exact
          path={`${requestedUrl}/role`}
          component={lazy(() => import('./Roles/RoleList'))}
          isAuthenticated={hasRoleViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/role/new`}
          component={lazy(() => import('./Roles/RoleForm'))}
          isAuthenticated={hasRoleCreatePermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/role/edit`}
          component={lazy(() => import('./Roles/RoleEdit'))}
          isAuthenticated={hasRoleEditPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/user`}
          component={lazy(() => import('./Users'))}
          isAuthenticated={hasUserViewPermission}
        />
        <Route exact path={`${requestedUrl}/profile`} component={lazy(() => import('./Profiles/ProfileView'))} />
        <Route exact path={`${requestedUrl}/profile-update`} component={lazy(() => import('./Profiles/ProfileUpdate'))} />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/approval-process`}
          component={lazy(() => import('./ApprovalProcess/ApprovalProcessList'))}
          isAuthenticated={hasApprovalProcessViewPermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/user-new`}
          component={lazy(() => import('./Users/UserForm'))}
          isAuthenticated={hasUserCreatePermission}
        />
        <ProtectedRoute
          exact
          path={`${requestedUrl}/user-update`}
          component={lazy(() => import('./Users/UserEditForm'))}
          isAuthenticated={hasUserEditPermission}
        />
      </Switch>
    </Suspense>
  );
};

export default Accounts;
