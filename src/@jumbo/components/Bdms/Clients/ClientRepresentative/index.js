import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { clientRepresentative } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveRepresentatives from './ActiveRepresentativeList';
import InactiveRepresentatives from './InactiveRepresentativeList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Representatives', link: '/clients/reprentatives', isActive: true }
];

export default function RepresentativeList() {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(clientRepresentative.VIEW);
  const hasPermissionForArchive = userPermission?.includes(clientRepresentative.EDIT);

  const components = [
    {
      index: 0,
      heading: 'Active Representatives',
      component: <ActiveRepresentatives />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived Representatives',
      component: <InactiveRepresentatives />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Representatives" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
