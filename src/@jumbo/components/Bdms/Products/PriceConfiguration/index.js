import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { priceConfigurations } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActivePriceCofigurationList from './ActivePriceCofigurationList';
import InActivePriceConfigurationList from './InActivePriceConfigurationList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products/list' },
  { label: 'Price Configuration', link: '/products/price-configuration', isActive: true }
];

export default function PriceCofigurationList(props) {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(priceConfigurations.VIEW);
  const hasPermissionForArchive = userPermission?.includes(priceConfigurations.EDIT);
  const components = [
    {
      index: 0,
      heading: 'Active',
      component: <ActivePriceCofigurationList {...props} />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived ',
      component: <InActivePriceConfigurationList />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Price Configurations" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
