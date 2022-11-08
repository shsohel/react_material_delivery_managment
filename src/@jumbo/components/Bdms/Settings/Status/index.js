import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { statuses } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveStatusList from './ActiveStatusList';
import InActiveStatusList from './InActiveStatusList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products/list' },
  { label: 'Price Configuration', link: '/products/price-configuration', isActive: true }
];

export default function StatusList(props) {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(statuses.VIEW);
  const hasPermissionForArchive = userPermission?.includes(statuses.EDIT);
  const components = [
    {
      index: 0,
      heading: 'Active',
      component: <ActiveStatusList {...props} />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived ',
      component: <InActiveStatusList />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Status" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
