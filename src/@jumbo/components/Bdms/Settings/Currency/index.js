import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { currencies } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveCurrencyList from './ActiveCurrencies';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Currencies', link: '/clients/reprentatives', isActive: true }
];

export default function CurrencyList() {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(currencies.VIEW);
  const components = [
    {
      index: 0,
      heading: 'Active Currencies',
      component: <ActiveCurrencyList />,
      hasPermission: hasPermissionForActive
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
