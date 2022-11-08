import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { units } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveUnitList from './ActiveUnits';
import InactiveUnitList from './InactiveUnits';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Units', link: '/clients/reprentatives', isActive: true }
];

export default function Units() {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasPermissionForActive = userPermission?.includes(units.VIEW);
  const hasPermissionForArchive = userPermission?.includes(units.EDIT);

  const components = [
    {
      index: 0,
      heading: 'Active Units',
      component: <ActiveUnitList />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived Units',
      component: <InactiveUnitList />,
      hasPermission: hasPermissionForArchive
    }
  ];
  return (
    <div>
      <PageContainer heading="Units" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
