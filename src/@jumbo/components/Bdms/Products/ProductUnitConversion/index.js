import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { unitConfigurations } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveProductUnitConversion from './ActiveProductUnitConversionList';
import InactiveProductUnitConversion from './InactiveProductUnitConversionList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products/list' },
  { label: 'Unit Conversion', link: '/products/unit-conversion', isActive: true }
];

export default function CurrencyList() {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(unitConfigurations.VIEW);
  const hasPermissionForArchive = userPermission?.includes(unitConfigurations.EDIT);
  const components = [
    {
      index: 0,
      heading: 'Active Unit Config',
      component: <ActiveProductUnitConversion />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived Unit Config',
      component: <InactiveProductUnitConversion />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Currencies" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
