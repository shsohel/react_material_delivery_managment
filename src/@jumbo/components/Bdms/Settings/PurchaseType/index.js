import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { packagingTypes } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActivePackagingTypes from './ActivePurchaseTypeList';
import InactivePackagingTypes from './InactivePurchaseTypeList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Packaging Types', link: '/products/list', isActive: true }
];

export default function PurchaseTypeList() {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(packagingTypes.VIEW);
  const hasPermissionForArchive = userPermission?.includes(packagingTypes.EDIT);
  const components = [
    {
      index: 0,
      heading: 'Active P. Types',
      component: <ActivePackagingTypes />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived P. Types',
      component: <InactivePackagingTypes />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Packaging Types" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
