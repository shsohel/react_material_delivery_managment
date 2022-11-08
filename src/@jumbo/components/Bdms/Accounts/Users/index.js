import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { users } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveUsersList from './ActiveUserList';
import InactiveUsersList from './InactiveUserList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Users', link: '/products/list', isActive: true }
];

export default function CurrencyList(props) {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(users.VIEW);
  const hasPermissionForArchive = userPermission?.includes(users.EDIT);
  const components = [
    {
      index: 0,
      heading: 'Active Users',
      component: <ActiveUsersList {...props} />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived Users',
      component: <InactiveUsersList />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Users" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
