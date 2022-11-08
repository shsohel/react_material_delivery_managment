import {
  approvalProcess,
  audit,
  brtaInformation,
  clientRepresentative,
  clients,
  currencies,
  driverInformation,
  entryPermits,
  exitPermits,
  financialYears,
  invoices,
  liftingSchedules,
  loading,
  loadingConfirmation,
  loadingConfirmationToken,
  orders,
  packagingTypes,
  priceConfigurations,
  products,
  reports,
  roles,
  securityChecks,
  statuses,
  stockManagement,
  unitConfigurations,
  units,
  users
} from '@jumbo/constants/PermissionsType';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  AccountTree,
  ArrowForward,
  CheckBox,
  Dashboard,
  LocalShipping,
  People,
  PostAdd,
  Receipt,
  Report,
  Schedule,
  Security,
  Settings,
  ShoppingCart,
  Store,
  SwapCalls,
  VpnKey
} from '@material-ui/icons';
import React from 'react';
import { AiOutlineBarcode } from 'react-icons/ai';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';
import CmtVertical from '../../../../../@coremat/CmtNavigation/Vertical';

const useStyles = makeStyles(theme => ({
  perfectScrollbarSidebar: {
    height: '100%',
    transition: 'all 0.3s ease',
    '.Cmt-sidebar-fixed &, .Cmt-Drawer-container &': {
      height: 'calc(100% - 167px)'
    },
    '.Cmt-modernLayout &': {
      height: 'calc(100% - 72px)'
    },
    '.Cmt-miniLayout &': {
      height: 'calc(100% - 91px)'
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      height: 'calc(100% - 167px)'
    }
  }
}));

const SideBar = () => {
  const classes = useStyles();
  const { userPermission } = useSelector(({ auth }) => auth);
  const navigationMenus = [
    {
      name: 'Dashboard',
      type: 'section',
      children: [
        {
          name: 'Dashboard',
          type: 'item',
          icon: <Dashboard />,
          link: '/dashboard' // dashboard  tests ,
        }
      ]
    },
    userPermission?.includes(loadingConfirmation.CONFIRM)
      ? {
          name: 'Confirmation',
          type: 'section',
          children: [
            {
              name: 'Confirmation',
              type: 'item',
              icon: <CheckBox />,
              link: '/loading/loaded-value-confirmation-list'
            }
          ]
        }
      : {},
    userPermission?.includes(loadingConfirmationToken.CREATE)
      ? {
          name: 'Code Generator',
          type: 'section',
          children: [
            {
              name: 'Code Generator',
              type: 'item',
              icon: <VpnKey />,
              link: '/code-generate'
            }
          ]
        }
      : {},
    userPermission?.includes(roles.VIEW) ||
    userPermission?.includes(users.VIEW) ||
    userPermission?.includes(approvalProcess.VIEW)
      ? {
          name: 'Account Manage',
          type: 'section',
          children: [
            {
              name: 'Account Settings',
              icon: <AccountTree />,
              type: 'collapse',
              children: [
                userPermission?.includes(roles.VIEW)
                  ? {
                      name: 'Role',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/accounts/role'
                    }
                  : {},
                userPermission?.includes(users.VIEW)
                  ? {
                      name: 'User',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/accounts/user'
                    }
                  : {},
                userPermission?.includes(approvalProcess.VIEW)
                  ? {
                      name: 'Approval Process',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/accounts/approval-process'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(clients.VIEW) || userPermission?.includes(clientRepresentative.VIEW)
      ? {
          name: 'Client Management',
          type: 'section',
          children: [
            {
              name: 'Clients',
              icon: <People />,
              type: 'collapse',
              children: [
                userPermission?.includes(clients.VIEW)
                  ? {
                      name: 'Active Clients',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/clients/active-clients'
                    }
                  : {},
                userPermission?.includes(clients.EDIT)
                  ? {
                      name: 'Inactive Clients',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/clients/inactive-clients'
                    }
                  : {},
                userPermission?.includes(clientRepresentative.VIEW)
                  ? {
                      name: 'Reprentative List',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/clients/reprentatives'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(products.VIEW) ||
    userPermission?.includes(priceConfigurations.VIEW) ||
    userPermission?.includes(unitConfigurations.VIEW)
      ? {
          name: 'Product Management',
          type: 'section',
          children: [
            {
              name: 'Product',
              icon: <PostAdd />,
              type: 'collapse',
              children: [
                userPermission?.includes(products.VIEW)
                  ? {
                      name: 'Product List',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/products/list'
                    }
                  : {},
                userPermission?.includes(priceConfigurations.VIEW)
                  ? {
                      name: 'Price Configuration',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/products/price-configuration'
                    }
                  : {},
                userPermission?.includes(unitConfigurations.VIEW)
                  ? {
                      name: 'Unit Conversion',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/products/unit-conversion'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(orders.VIEW) || userPermission?.includes(orders.CREATE)
      ? {
          name: 'Order Management',
          type: 'section',
          children: [
            {
              name: 'Orders',
              icon: <ShoppingCart />,
              type: 'collapse',
              children: [
                userPermission?.includes(orders.VIEW)
                  ? {
                      name: 'Order List',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/orders/list'
                    }
                  : {},
                userPermission?.includes(orders.CREATE)
                  ? {
                      name: 'Order Confirmation',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/orders/order-confirmation'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(liftingSchedules.VIEW)
      ? {
          name: 'Schedule Management',
          type: 'section',
          children: [
            {
              name: 'Lifting Schedule',
              icon: <Schedule />,
              type: 'collapse',
              children: [
                {
                  name: 'Schedule List',
                  type: 'item',
                  icon: <ArrowForward />,
                  link: '/schedules/list'
                }
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(entryPermits.VIEW) || userPermission?.includes(exitPermits.VIEW)
      ? {
          name: 'Permit Management',
          type: 'section',
          children: [
            {
              name: 'Permits',
              icon: <SwapCalls />,
              type: 'collapse',
              children: [
                userPermission?.includes(entryPermits.VIEW)
                  ? {
                      name: 'Entry Permits',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/permits/entry-permit-list'
                    }
                  : {},
                userPermission?.includes(exitPermits.VIEW)
                  ? {
                      name: 'Exit Permits',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/permits/exit-permit-list'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(securityChecks.ENTRY_CHECK) || userPermission?.includes(securityChecks.EXIT_CHECK)
      ? {
          name: 'Transport Check Manage',
          type: 'section',
          children: [
            {
              name: 'Transport Check',
              icon: <Security />,
              type: 'collapse',
              children: [
                userPermission?.includes(securityChecks.ENTRY_CHECK)
                  ? {
                      name: 'Entry Process',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/security-check/entry'
                    }
                  : {},
                userPermission?.includes(securityChecks.EXIT_CHECK)
                  ? {
                      name: 'Exit Process',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/security-check/exit'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(loading.VIEW)
      ? {
          name: 'Loading Manage',
          type: 'section',
          children: [
            {
              name: 'Loading',
              icon: <LocalShipping />,
              type: 'collapse',
              children: [
                {
                  name: 'Loading',
                  type: 'item',
                  icon: <ArrowForward />,
                  link: '/loading/loading-list'
                }
                // userPermission?.includes(loadingConfirmation.CONFIRM)
                //   ? {
                //       name: 'Confirmation',
                //       type: 'item',
                //       icon: <ArrowForward />,
                //       link: '/loading/loaded-value-confirmation-list'
                //     }
                //   : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(invoices.VIEW) || userPermission?.includes(invoices.CREATE)
      ? {
          name: 'Sales Management',
          type: 'section',
          children: [
            {
              name: 'Invoices',
              icon: <Receipt />,
              type: 'collapse',
              children: [
                userPermission?.includes(invoices.VIEW)
                  ? {
                      name: 'Invoice List',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/sales/invoice-list'
                    }
                  : {},
                userPermission?.includes(invoices.CREATE)
                  ? {
                      name: 'New Invoice',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/sales/invoice-new'
                    }
                  : {}
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(stockManagement.STOCK_ADJUSTMENT)
      ? {
          name: 'Stock Management',
          type: 'section',
          children: [
            {
              name: 'Stock Adjustment',
              type: 'item',
              icon: <Store />,
              link: '/stock-adjustment'
            }
          ]
        }
      : {},
    userPermission?.includes(units.VIEW) ||
    userPermission?.includes(currencies.VIEW) ||
    userPermission?.includes(financialYears.VIEW) ||
    userPermission?.includes(packagingTypes.VIEW) ||
    userPermission?.includes(statuses.VIEW) ||
    userPermission?.includes(driverInformation.VIEW)
      ? {
          name: 'Settings Management',
          type: 'section',
          children: [
            {
              name: 'Settings',
              icon: <Settings />,
              type: 'collapse',
              children: [
                userPermission?.includes(units.VIEW)
                  ? {
                      name: 'Units',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/unit'
                    }
                  : {},
                userPermission?.includes(currencies.VIEW)
                  ? {
                      name: 'Currency',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/currency'
                    }
                  : {},
                userPermission?.includes(financialYears.VIEW)
                  ? {
                      name: 'Financial Year',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/financial-year'
                    }
                  : {},
                userPermission?.includes(packagingTypes.VIEW)
                  ? {
                      name: 'Packaging Type',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/packaging-type'
                    }
                  : {},
                userPermission?.includes(statuses.VIEW)
                  ? {
                      name: 'Status',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/status'
                    }
                  : {},
                userPermission?.includes(driverInformation.VIEW)
                  ? {
                      name: 'Drivers',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/drivers'
                    }
                  : {},
                userPermission?.includes(brtaInformation.VIEW)
                  ? {
                      name: 'Cities',
                      type: 'item',
                      icon: <ArrowForward />,
                      link: '/settings/cities'
                    }
                  : {}
                // {
                //   name: 'System Settings',
                //   type: 'item',
                //   icon: <ArrowForward />,
                //   link: '/settings/system-settings',
                // }
              ]
            }
          ]
        }
      : {},
    userPermission?.includes(reports.DAILY_REPORT) ||
    userPermission?.includes(reports.MONTHLY_REPORT) ||
    userPermission?.includes(reports.YEARLY_REPORT) ||
    userPermission?.includes(reports.SALES_REGISTER_REPORT)
      ? {
          name: 'Reports',
          type: 'section',
          children: [
            {
              name: 'Reports',
              icon: <Report />,
              link: '/reports'
            }
          ]
        }
      : {},
    userPermission?.includes(audit.ENTRY_PERMIT_INSPECTION) ||
    userPermission?.includes(audit.EXIT_PERMIT_INSPECTION) ||
    userPermission?.includes(audit.INVOICE_INSPECTION) ||
    userPermission?.includes(audit.USER_INO_INSPECTION)
      ? {
          name: 'Barcode Check',
          type: 'section',
          children: [
            {
              name: 'Barcode Check',
              icon: <AiOutlineBarcode />,
              link: '/barcode-check'
            }
          ]
        }
      : {}
  ];
  return (
    <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
      <CmtVertical menuItems={navigationMenus} />
    </PerfectScrollbar>
  );
};

export default SideBar;
