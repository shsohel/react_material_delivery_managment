const apiVersion = 1;

export const urls_v1 = {
  account: {
    roles: {
      get_all: `/api/Account/roles`,
      get_by_name: `/api/Account/roles/name`,
      post: `/api/Account/roles`,
      put: `/api/Account/roles`,
      delete: `/api/Account/roles`
    },
    permissions: {
      get_all: `/api/Account/permissions`,
      me: `/api/Account/users/me/permissions`
    },
    users: {
      get_me: `/api/Account/users/me`,
      get_all_users: `/api/Account/users`,
      get_all_archived: `/api/Account/archive-users`,
      get_users_name: `/api/Account/users-name`,
      get_user_by_userId: `/api/Account/users`,
      post_user: `/api/Account/users`,
      put_user_by_userId: `/api/Account/users`,
      active_user: `/api/Account/users/active`,
      delete_user_by_userId: `/api/Account/users`,
      password_reset_by_Admin: `/api/Account/reset-password-by-admin`,
      reset_password: `/api/Account/reset-password`,
      forgot_password: `/api/Account/forgot-password`,
      user_check_by_employeeId: `api/Account/user/employee`
    }
  },

  approvalProcess: {
    get_all: `/api/V${apiVersion}/ApprovalProcess/get-all-approval-processes`,
    get_by_key: `/api/V${apiVersion}/ApprovalProcess/get-approval-process`,
    post: `/api/V${apiVersion}/ApprovalProcess/save-approval-process`,
    post_position_config: `/api/V${apiVersion}/ApprovalProcess/approval-process-position-configuration`,
    put: `/api/V${apiVersion}/ApprovalProcess/update-approval-process`,
    delete: `/api/V${apiVersion}/ApprovalProcess/delete-approval-process`
  },

  brtaInformation: {
    get_all_brta_info: `/api/v${apiVersion}/BRTAInformation/get-all-brta-info`,
    get_all_archive_brta_info: `/api/v${apiVersion}/BRTAInformation/get-all-archive-brta-info`,
    get_brta_info_by_key: `/api/v${apiVersion}/BRTAInformation/get-brta-info`,
    post: `/api/v${apiVersion}/BRTAInformation/save-brta-info`,
    put: `/api/v${apiVersion}/BRTAInformation/update-brta-info`,
    delete: `/api/v${apiVersion}/BRTAInformation/delete-brta-info`
  },

  company: {
    get_all: `api/v${apiVersion}/Company/get-all-companies`,
    get_by_key: `/api/v${apiVersion}/Company/get-company-info`,
    post: `/api/v${apiVersion}/Company/save-company-info`,
    put: `/api/v${apiVersion}/Company/update-company-info`,
    delete: `/api/v${apiVersion}/Company/delete-company-info`
  },

  currency: {
    get_all: `/api/V${apiVersion}/Currency/get-all-currencies`,
    get_all_archived: `/api/V${apiVersion}/Currency/get-archive-currencies`,
    get_by_key: `/api/V${apiVersion}/Currency/get-currency`,
    post: `/api/V${apiVersion}/Currency/save-currency`,
    put: `/api/V${apiVersion}/Currency/update-currency`,
    delete: `/api/V${apiVersion}/Currency/delete-currency`
  },

  customer: {
    get_all: `/api/v${apiVersion}/Customer/get-all-customers`,
    get_all_archived: `/api/v${apiVersion}/Customer/get-archive-customers`,
    get_by_key: `/api/v${apiVersion}/Customer/get-customer-info`,
    post: `/api/v${apiVersion}/Customer/save-customer-info`,
    put: `/api/v${apiVersion}/Customer/update-customer-info`,
    delete: `/api/v${apiVersion}/Customer/delete-customer-info`
  },

  customerRepresentative: {
    get_all: `/api/v${apiVersion}/CustomerRepresentative/get-all-customer-representatives`,
    get_by_key: `/api/v${apiVersion}/CustomerRepresentative/get-customer-representative-info`,
    get_by_id: `/api/v${apiVersion}/CustomerRepresentative/get-customer-representative-info`,
    get_by_customer_id: `/api/v${apiVersion}/CustomerRepresentative/get-customer-representative-by-customer`,
    post: `/api/v${apiVersion}/CustomerRepresentative/save-customer-representative-info`,
    put: `/api/v${apiVersion}/CustomerRepresentative/update-customer-representative-info`,
    delete: `/api/v${apiVersion}/CustomerRepresentative/delete-customer-representative-info`
  },

  dashboard: {
    get_daily_transaction: `/api/v${apiVersion}/Dashboard/get-daily-total-transaction`,
    get_daily_security_operation_summary: `/api/v${apiVersion}/Dashboard/get-daily-security-operation-summary`,
    get_daily_delivery_operation_summary: `/api/v${apiVersion}/Dashboard/get-daily-delivery-operation-summary`,
    get_daily_order_summary: `/api/v${apiVersion}/Dashboard/get-daily-order-summary`,
    get_customer_daily_delivery_operation_summary: `api/v${apiVersion}/Dashboard/get-customer-daily-delivery-operation-summary`
  },

  driver: {
    get_all_driver_info: `/api/v${apiVersion}/DriverInformation/get-all-driver-info`,
    get_all_archive_driver_info: `/api/v${apiVersion}/DriverInformation/get-all-archive-driver-info`,
    get_driver_info_by_key: `/api/v${apiVersion}/DriverInformation/get-driver-info`,
    post: `/api/v${apiVersion}/DriverInformation/save-driver-info`,
    put: `/api/v${apiVersion}/DriverInformation/update-driver-info`,
    delete: `/api/v${apiVersion}/DriverInformation/delete-driver-info`
  },

  entryPermit: {
    get_all: `/api/v${apiVersion}/EntryPermit/get-all-entry-permits`,
    get_by_key: `/api/v${apiVersion}/EntryPermit/get-entry-permit`,
    get_ls_for_entry_permit: `/api/v${apiVersion}/EntryPermit/lifting-schedule-for-entry-permit`,
    get_by_ls_key: `/api/v${apiVersion}/EntryPermit/get-lifting-schedule-for-entry-permit`,
    get_entry_permit_by_permitNo: `/api/v${apiVersion}/EntryPermit/get-entry-permit-by-permitno`,
    post: `/api/v${apiVersion}/EntryPermit/save-entry-permit`,
    put: `/api/v${apiVersion}/EntryPermit/update-entry-permit`,
    put_entry_permit_confirmation: `/api/v${apiVersion}/EntryPermit/entry-permit-confirmation`,
    delete: `/api/v${apiVersion}/EntryPermit/delete-or-cancel-entry-permit`
  },

  exitPermit: {
    get_all: `/api/v${apiVersion}/ExitPermit/get-exit-permits`,
    get_by_id: `/api/v${apiVersion}/ExitPermit/get-exit-permit`,
    get_by_key: `/api/v${apiVersion}/ExitPermit/get-exit-permit`,
    get_exitPermit_by_permitNo: `/api/v${apiVersion}/ExitPermit/get-exit-permit-by-permitno`,
    post: `/api/v${apiVersion}/ExitPermit/save-exit-permit`,
    put: `/api/v${apiVersion}/ExitPermit/update-exit-permit`,
    delete: `/api/v${apiVersion}/ExitPermit/delete-or-cancel-exit-permit`
  },

  financialYear: {
    get_all: `/api/v${apiVersion}/FinancialYear/get-all-financial-years`,
    get_by_key: `/api/v${apiVersion}/FinancialYear/get-financial-year/{key}`,
    post: `/api/v${apiVersion}/FinancialYear/save-financial-year`,
    put: `/api/v${apiVersion}/FinancialYear/update-financial-year`,
    delete: `/api/v${apiVersion}/FinancialYear/delete-financial-year`
  },

  liftingSchedule: {
    get_all: `/api/v${apiVersion}/LiftingSchedule/get-all-lifting-schedules`,
    get_by_key: `/api/v${apiVersion}/LiftingSchedule/get-lifting-schedule-info`,
    get_for_ls_edit: `/api/v${apiVersion}/LiftingSchedule/get-lifting-schedule-for-edit`,
    get_order_for_ls: `/api/v${apiVersion}/LiftingSchedule/get-order-for-lifting-schedule`,
    post: `/api/v${apiVersion}/LiftingSchedule/save-lifting-schedule`,
    put: `/api/v${apiVersion}/LiftingSchedule/update-lifting-schedule`,
    put_ls_confirmation: `/api/v${apiVersion}/LiftingSchedule/lifting-schedule-confirmation`,
    delete: `/api/v${apiVersion}/LiftingSchedule/delete-lifting-schedule`
  },

  loading: {
    get_load_unload_entry_list: `/api/v${apiVersion}/Loading/get-entry-permits-for-loading-check`,
    get_entry_permit_for_loading_check_by_key: `/api/v${apiVersion}/Loading/get-entry-permit-for-loading-check`,
    get_entry_permits_for_loading_confirmation: `/api/v${apiVersion}/Loading/get-entry-permits-for-loading-confirmation`,
    post_emptyTransportWeight: `/api/v${apiVersion}/Loading/add-empty-vehicle-weight`,
    post_loadedTransportWeight: `/api/v${apiVersion}/Loading/add-loaded-vehicle-weight`,
    put_empty_vehicleWeight: `/api/v${apiVersion}/Loading/edit-empty-vehicle-weight`,
    put_loaded_vehicleWeight: `/api/v${apiVersion}/Loading/edit-loaded-vehicle-weight`,
    cancel_loadingProcess: `/api/v${apiVersion}/Loading/cancel-loaded-process`
  },

  order: {
    get_all: `/api/V${apiVersion}/Order/get-all-orders`,
    get_all_archived_orders: `/api/V${apiVersion}/Order/get-all-archive-orders`,
    get_by_key: `/api/V${apiVersion}/Order/get-order`,
    get_details_by_order_key: `/api/V${apiVersion}/Order/get-order-details`,
    get_pending_orders: `/api/V${apiVersion}/Order/get-all-pending-orders`,
    get_approved_orders: `/api/V${apiVersion}/Order/get-all-approved-orders`,
    get_order_for_edit: `/api/V${apiVersion}/Order/get-order-for-edit`,
    post: `/api/V${apiVersion}/Order/save-order`,
    put: `/api/V${apiVersion}/Order/update-order`,
    put_order_confirmation: `/api/V${apiVersion}/Order/order-confirmation`,
    accept_order: `/api/V${apiVersion}/Order/accept-order`,
    review: `/api/V${apiVersion}/Order/send-for-review`,
    delete: `/api/V${apiVersion}/Order/delete-order`,
    delete_order_details: `/api/V${apiVersion}/Order/delete-order-details`,
    order_sync: `/api/V${apiVersion}/Sync/sync-order`
  },

  products: {
    get_all: `/api/v${apiVersion}/Product/get-all-products`,
    get_all_archived: `/api/v${apiVersion}/Product/get-archive-products`,
    get_by_key: `/api/v${apiVersion}/Product/get-product`,
    post: `/api/v${apiVersion}/Product/save-product`,
    put: `/api/v${apiVersion}/Product/update-product`,
    delete: `/api/v${apiVersion}/Product/delete-product`
  },

  productGrade: {
    get_all: `/api/v${apiVersion}/ProductGrade/get-all-grades`,
    get_by_key: `/api/v${apiVersion}/ProductGrade/get-grade`,
    get_by_productId: `/api/v${apiVersion}/ProductGrade/get-grades-for-product`,
    post: `/api/v${apiVersion}/ProductGrade/save-grade`,
    put: `/api/v${apiVersion}/ProductGrade/update-grades`,
    delete: `/api/v${apiVersion}/ProductGrade/delete-grade`,
    delete_all: `/api/v${apiVersion}/ProductGrade/delete-all-grades`
  },

  productPriceConfiguration: {
    get_all: `/api/v${apiVersion}/ProductPriceConfiguration/get-all-price-configurations`,
    get_all_archive: `/api/v${apiVersion}/ProductPriceConfiguration/get-archive-price-configurations`,
    get_by_key: `/api/v${apiVersion}/ProductPriceConfiguration/get-price-config`,
    get_by_grade_and_packageType: `/api/v${apiVersion}/ProductPriceConfiguration/get-price-config-by-grade-and-package-type`,
    post: `/api/v${apiVersion}/ProductPriceConfiguration/save-price-config`,
    put: `/api/v${apiVersion}/ProductPriceConfiguration/update-price-config`,
    delete: `/api/v${apiVersion}/ProductPriceConfiguration/delete-price-config`
  },

  productUnitConversion: {
    get_all: `/api/v${apiVersion}/ProductUnitConversion/get-all-unit-conversion`,
    get_all_archived: `/api/v${apiVersion}/ProductUnitConversion/get-archive-unit-conversion`,
    get_by_key: `/api/v${apiVersion}/ProductUnitConversion/get-unit-conversion`,
    get_unit_conversion_value: `/api/v${apiVersion}/ProductUnitConversion/get-unit-conversion-value`,
    post: `/api/v${apiVersion}/ProductUnitConversion/save-unit-conversion`,
    put: `/api/v${apiVersion}/ProductUnitConversion/update-unit-conversion`,
    delete: `/api/v${apiVersion}/ProductUnitConversion/delete-unit-conversion`
  },

  purchaseType: {
    get_all: `/api/v${apiVersion}/PurchaseType/get-all-purchase-types`,
    get_all_archived: `/api/v${apiVersion}/PurchaseType/get-archive-purchase-types`,
    get_by_key: `/api/v${apiVersion}/PurchaseType/get-purchase-type`,
    post: `/api/v${apiVersion}/PurchaseType/save-purchase-type`,
    put: `/api/v${apiVersion}/PurchaseType/update-purchase-type`,
    delete: `/api/v${apiVersion}/PurchaseType/delete-purchase-type`
  },

  report: {
    print_daily_delivery_report: `/print-daily-delivery-report`,
    print_monthly_delivery_report: `/print-monthly-delivery-report`,
    print_yearly_delivery_report: `/print-yearly-delivery-report`
  },

  representative: {
    gell_all: `/api/v${apiVersion}/Representative/get-all-representatives`,
    gell_all_archived: `/api/v${apiVersion}/Representative/get-all-archive-representatives`,
    get_by_key: `/api/v${apiVersion}/Representative/get-representative-info`,
    post: `/api/v${apiVersion}/Representative/save-representative-info`,
    put: `/api/v${apiVersion}/Representative/update-representative-info`,
    delete: `/api/v${apiVersion}/Representative/delete-representative-info`
  },

  sales: {
    get_all: `/api/v${apiVersion}/Sales/get-all-invoices`,
    get_by_invoiceno: `/api/v${apiVersion}/Sales/get-invoice`,
    get_ep_by_permitNo: `/api/v${apiVersion}/Sales/get-entry-permit-for-invoice-by-permitno`,
    get_invoice_by_invoiceNo: `/api/v${apiVersion}/Sales/get-invoice`,
    post: `/api/v${apiVersion}/Sales/save-invoice`,
    get_epName_for_invoice: `/api/v${apiVersion}/Sales/get-all-entry-permits-numbers-for-invoice`
  },

  securityCheck: {
    get_entry_list: `/api/v${apiVersion}/SecurityCheck/get-entry-permits-for-security-check`,
    get_exit_list: `/api/v${apiVersion}/SecurityCheck/get-exit-permits-for-security-check`,
    get_vehicle_no_for_entry_confirm: `/api/v${apiVersion}/SecurityCheck/get-vehicle-no-suggestion-for-entry-confirmation`,
    get_vehicle_no_for_exit_confirm: `/api/v${apiVersion}/SecurityCheck/get-vehicle-no-suggestion-for-exit-confirmation`,
    post_entry_confrim: `/api/v${apiVersion}/SecurityCheck/confirm-entry-permit-by-security`,
    post_exit_confrim: `/api/v${apiVersion}/SecurityCheck/confirm-exit-permit-by-security`
  },

  status: {
    get_all: `/api/v${apiVersion}/Status/get-all-status`,
    get_all_archive: `/api/v${apiVersion}/Status/get-archive-status`,
    get_by_key: `/api/v${apiVersion}/Status/get-status`,
    post: `/api/v${apiVersion}/Status/save-status`,
    post_configure_status_level: `/api/v${apiVersion}/Status/configure-status-level`,
    put: `/api/v${apiVersion}/Status/update-status`,
    delete: `/api/v${apiVersion}/Status/delete-status`
  },

  stockManagement: {
    get_product_current_stock: `/api/v${apiVersion}/StockManagement/get-product-current-stock`,
    get_current_stock: `/api/v${apiVersion}/StockManagement/get-current-stocks`,
    post: `/api/v${apiVersion}/StockManagement/adjust-stock`
  },

  systemSettings: {
    get_all: `/api/v${apiVersion}/SystemSettings/get-all-settings`,
    get_by_key: `/api/v${apiVersion}/SystemSetting/get-setting`,
    post: `/api/v${apiVersion}/SystemSetting/save-system-setting`,
    put: `/api/v${apiVersion}/SystemSetting/update-system-setting`,
    delete: `/api/v${apiVersion}/SystemSetting/delete-system-setting`
  },

  unit: {
    get_all: `/api/v${apiVersion}/Unit/get-units`,
    get_all_archived: `/api/v${apiVersion}/Unit/get-archive-units`,
    get_by_key: `/api/v${apiVersion}/Unit/get-unit`,
    post: `/api/v${apiVersion}/Unit/save-unit`,
    put: `/api/v${apiVersion}/Unit/update-unit`,
    delete: `/api/v${apiVersion}/Unit/delete-unit`
  },

  utilities: {
    get_approver_position_name_list: `/api/v${apiVersion}/Utilities/approver-position-name-list`,
    get_approval_process_type_list: `/api/v${apiVersion}/Utilities/approval-process-type-list`,
    get_status_for_list: `/api/v${apiVersion}/Utilities/status-for-list`,
    get_stock_operation_list: `/api/v${apiVersion}/Utilities/stock-operation-list`
  }
};
