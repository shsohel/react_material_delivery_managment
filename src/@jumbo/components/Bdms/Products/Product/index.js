import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { products } from '@jumbo/constants/PermissionsType';
import Controls from '@jumbo/controls/Controls';
import React from 'react';
import { useSelector } from 'react-redux';
import ActiveProducts from './ActiveProductList';
import InactiveProducts from './InactiveProductList';

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products/list', isActive: true }
];

export default function ProductList(props) {
  const { userPermission } = useSelector(({ auth }) => auth);

  const hasPermissionForActive = userPermission?.includes(products.VIEW);
  const hasPermissionForArchive = userPermission?.includes(products.EDIT);
  const components = [
    {
      index: 0,
      heading: 'Active Products',
      component: <ActiveProducts {...props} />,
      hasPermission: hasPermissionForActive
    },
    {
      index: 1,
      heading: 'Archived Products',
      component: <InactiveProducts />,
      hasPermission: hasPermissionForArchive
    }
  ];

  return (
    <div>
      <PageContainer heading="Products" breadcrumbs={breadcrumbs}>
        <Controls.TabControls componets={components.filter(item => item.hasPermission)} />
      </PageContainer>
    </div>
  );
}
